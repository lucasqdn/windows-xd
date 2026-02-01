"use client";

type DoomProps = {
  id: string;
};

export function Doom({ id }: DoomProps) {
  return (
    <div className="h-full w-full bg-black overflow-hidden">
      <iframe
        src="/games/doom/index.html"
        title="DOOM"
        className="w-full h-full border-0"
        allow="autoplay"
      />
    </div>
  );
}
