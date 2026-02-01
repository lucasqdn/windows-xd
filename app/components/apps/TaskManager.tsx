"use client";

import { useState, useEffect, useRef } from "react";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import Image from "next/image";

type TaskManagerProps = {
  id: string;
};

type ProcessInfo = {
  id: string;
  name: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
};

type HistoryData = {
  cpu: number[];
  memory: number[];
};

const MAX_HISTORY_LENGTH = 60; // Keep 60 data points for the graph

export function TaskManager({ id }: TaskManagerProps) {
  const { windows, closeWindow, focusWindow, minimizeWindow } = useWindowManager();
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"applications" | "processes" | "performance">("performance");
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memUsage, setMemUsage] = useState<number>(0);
  const [history, setHistory] = useState<HistoryData>({
    cpu: Array(MAX_HISTORY_LENGTH).fill(0),
    memory: Array(MAX_HISTORY_LENGTH).fill(0),
  });
  const cpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const memCanvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate CPU and memory usage
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.floor(Math.random() * 30) + 5; // 5-35%
      const newMem = Math.floor(Math.random() * 20) + 40; // 40-60%
      
      setCpuUsage(newCpu);
      setMemUsage(newMem);
      
      // Update history
      setHistory((prev) => ({
        cpu: [...prev.cpu.slice(1), newCpu],
        memory: [...prev.memory.slice(1), newMem],
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get running applications
  const applications = windows.filter((w) => w.isOpen && !w.isMinimized);

  // Simulate process list
  const processes: ProcessInfo[] = [
    { id: "system", name: "System Idle Process", status: "Running", cpuUsage: 99, memoryUsage: 16 },
    { id: "explorer", name: "Explorer.EXE", status: "Running", cpuUsage: 2, memoryUsage: 4096 },
    { id: "taskmgr", name: "TASKMGR.EXE", status: "Running", cpuUsage: 1, memoryUsage: 2048 },
    ...windows.map((w) => ({
      id: w.id,
      name: `${w.title}.EXE`,
      status: w.isMinimized ? "Suspended" : "Running",
      cpuUsage: Math.floor(Math.random() * 5),
      memoryUsage: Math.floor(Math.random() * 8192) + 1024,
    })),
  ];

  const handleEndTask = () => {
    if (!selectedProcess) return;

    const window = windows.find((w) => w.id === selectedProcess);
    if (window) {
      if (confirm(`Are you sure you want to end "${window.title}"?`)) {
        closeWindow(selectedProcess);
        setSelectedProcess(null);
      }
    }
  };

  const handleSwitchTo = () => {
    if (!selectedProcess) return;

    const window = windows.find((w) => w.id === selectedProcess);
    if (window) {
      focusWindow(selectedProcess);
      if (window.isMinimized) {
        minimizeWindow(selectedProcess);
      }
    }
  };

  // Draw graphs on canvas
  useEffect(() => {
    if (activeTab !== "performance") return;

    const drawGraph = (
      canvas: HTMLCanvasElement | null,
      data: number[],
      color: string,
      maxValue: number = 100
    ) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size based on its display size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const width = canvas.width;
      const height = canvas.height;
      const padding = 10;

      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = "#006600";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (i * (height - 2 * padding)) / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      // Draw graph
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const step = (width - 2 * padding) / (data.length - 1);
      data.forEach((value, index) => {
        const x = padding + index * step;
        const y = height - padding - ((value / maxValue) * (height - 2 * padding));

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    drawGraph(cpuCanvasRef.current, history.cpu, "#00FF00");
    drawGraph(memCanvasRef.current, history.memory, "#FF0000");
  }, [activeTab, history]);

  return (
    <div className="h-full flex flex-col bg-[#c0c0c0]">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs bg-[#c0c0c0]">
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button
              onClick={() => {
                const newTask = prompt("Type the name of a program to run:");
                if (newTask) {
                  alert(`Running: ${newTask}`);
                }
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
            >
              New Task (Run...)
            </button>
            <div className="border-t border-gray-500 my-1" />
            <button
              onClick={() => closeWindow(id)}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
            >
              Exit Task Manager
            </button>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">Options</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white">
              Always On Top
            </button>
            <button className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white">
              Minimize On Use
            </button>
            <div className="border-t border-gray-500 my-1" />
            <button className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white">
              Hide When Minimized
            </button>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white">
              Refresh Now
            </button>
            <div className="border-t border-gray-500 my-1" />
            <button className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white">
              Update Speed
            </button>
          </div>
        </div>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-400 bg-[#c0c0c0] px-1">
        <button
          onClick={() => setActiveTab("performance")}
          className={`px-4 py-1 text-xs border-t border-l border-r ${
            activeTab === "performance"
              ? "border-gray-100 bg-[#c0c0c0] -mb-px font-bold"
              : "border-gray-600 bg-[#c0c0c0]"
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-1 text-xs border-t border-l border-r ${
            activeTab === "applications"
              ? "border-gray-100 bg-[#c0c0c0] -mb-px font-bold"
              : "border-gray-600 bg-[#c0c0c0]"
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab("processes")}
          className={`px-4 py-1 text-xs border-t border-l border-r ${
            activeTab === "processes"
              ? "border-gray-100 bg-[#c0c0c0] -mb-px font-bold"
              : "border-gray-600 bg-[#c0c0c0]"
          }`}
        >
          Processes
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-2 overflow-hidden bg-[#c0c0c0]">
        {activeTab === "performance" && (
          <div className="flex-1 flex flex-col gap-4 bg-[#c0c0c0]">
            {/* CPU Usage Graph */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-xs font-bold mb-1">CPU Usage</div>
              <div className="flex-1 win98-inset bg-black p-1 relative min-h-0">
                <canvas
                  ref={cpuCanvasRef}
                  className="w-full h-full"
                  style={{ display: 'block' }}
                />
              </div>
              <div className="text-xs mt-1 flex justify-between">
                <span>Current: {cpuUsage}%</span>
                <span>Max: {Math.max(...history.cpu)}%</span>
                <span>Avg: {Math.floor(history.cpu.reduce((a, b) => a + b, 0) / history.cpu.length)}%</span>
              </div>
            </div>

            {/* Memory Usage Graph */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-xs font-bold mb-1">Memory Usage</div>
              <div className="flex-1 win98-inset bg-black p-1 relative min-h-0">
                <canvas
                  ref={memCanvasRef}
                  className="w-full h-full"
                  style={{ display: 'block' }}
                />
              </div>
              <div className="text-xs mt-1 flex justify-between">
                <span>Current: {memUsage}M / 128M</span>
                <span>Usage: {Math.floor((memUsage / 128) * 100)}%</span>
                <span>Available: {128 - memUsage}M</span>
              </div>
            </div>

            {/* System Info */}
            <div className="win98-raised p-2 text-xs flex-shrink-0 bg-[#c0c0c0]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold">Totals</span>
                  <div className="ml-2">
                    <div>Handles: {Math.floor(Math.random() * 5000) + 3000}</div>
                    <div>Threads: {Math.floor(Math.random() * 200) + 100}</div>
                    <div>Processes: {processes.length}</div>
                  </div>
                </div>
                <div>
                  <span className="font-bold">Physical Memory (K)</span>
                  <div className="ml-2">
                    <div>Total: 131072</div>
                    <div>Available: {(128 - memUsage) * 1024}</div>
                    <div>System Cache: {Math.floor(Math.random() * 20000) + 10000}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <>
            <div className="flex-1 win98-inset bg-white overflow-auto mb-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#c0c0c0] border-b border-gray-400">
                    <th className="text-left px-2 py-1">Task</th>
                    <th className="text-left px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-2 py-4 text-center text-gray-500">
                        No running applications
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr
                        key={app.id}
                        className={`cursor-pointer border-b border-gray-200 ${
                          selectedProcess === app.id
                            ? "bg-[#000080] text-white"
                            : "hover:bg-[#000080] hover:text-white"
                        }`}
                        onClick={() => setSelectedProcess(app.id)}
                        onDoubleClick={handleSwitchTo}
                      >
                        <td className="px-2 py-1">{app.title}</td>
                        <td className="px-2 py-1">Running</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEndTask}
                disabled={!selectedProcess}
                className="win98-button-sm disabled:opacity-50"
              >
                End Task
              </button>
              <button
                onClick={handleSwitchTo}
                disabled={!selectedProcess}
                className="win98-button-sm disabled:opacity-50"
              >
                Switch To
              </button>
              <button className="win98-button-sm ml-auto">
                New Task...
              </button>
            </div>
          </>
        )}

        {activeTab === "processes" && (
          <>
            <div className="flex-1 win98-inset bg-white overflow-auto mb-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#c0c0c0] border-b border-gray-400">
                    <th className="text-left px-2 py-1">Image Name</th>
                    <th className="text-left px-2 py-1">PID</th>
                    <th className="text-left px-2 py-1">CPU</th>
                    <th className="text-left px-2 py-1">Mem Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process, index) => (
                    <tr
                      key={process.id}
                      className={`cursor-pointer border-b border-gray-200 ${
                        selectedProcess === process.id
                          ? "bg-[#000080] text-white"
                          : "hover:bg-[#000080] hover:text-white"
                      }`}
                      onClick={() => setSelectedProcess(process.id)}
                    >
                      <td className="px-2 py-1">{process.name}</td>
                      <td className="px-2 py-1">{1000 + index * 4}</td>
                      <td className="px-2 py-1">{process.cpuUsage}</td>
                      <td className="px-2 py-1">{process.memoryUsage} K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEndTask}
                disabled={!selectedProcess || selectedProcess === "system" || selectedProcess === "explorer"}
                className="win98-button-sm disabled:opacity-50"
              >
                End Process
              </button>
            </div>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="win98-raised px-2 py-1 text-xs flex gap-4">
        <span>Processes: {processes.length}</span>
        <span>CPU Usage: {cpuUsage}%</span>
        <span>Mem Usage: {memUsage}M / 128M</span>
      </div>
    </div>
  );
}
