// Visual glitch effects for virus simulation

export type GlitchEffect = {
  shake: boolean;
  colorShift: boolean;
  static: boolean;
  invert: boolean;
};

export function createGlitchStyle(effect: GlitchEffect): React.CSSProperties {
  const filters: string[] = [];
  const transforms: string[] = [];

  if (effect.shake) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    transforms.push(`translate(${x}px, ${y}px)`);
  }

  if (effect.colorShift) {
    const hue = Math.random() * 360;
    filters.push(`hue-rotate(${hue}deg)`);
    filters.push(`saturate(${1 + Math.random()})`);
  }

  if (effect.invert) {
    filters.push("invert(1)");
  }

  return {
    filter: filters.length > 0 ? filters.join(" ") : undefined,
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
    transition: "none",
  };
}

export function applyGlitchToElement(
  element: HTMLElement | null,
  effect: GlitchEffect
) {
  if (!element) return;

  const style = createGlitchStyle(effect);

  if (style.filter) {
    element.style.filter = style.filter;
  }

  if (style.transform) {
    element.style.transform = style.transform;
  }
}

export function removeGlitchFromElement(element: HTMLElement | null) {
  if (!element) return;
  element.style.filter = "";
  element.style.transform = "";
}

// Teleport windows to random positions
export function teleportWindows() {
  const windows = document.querySelectorAll("[data-window-id]");
  windows.forEach((window) => {
    const htmlWindow = window as HTMLElement;
    const newX = Math.random() * (window.clientWidth - 400);
    const newY = Math.random() * (window.clientHeight - 300);
    
    // Apply teleport effect with animation
    htmlWindow.style.transition = "transform 0.05s ease-out";
    htmlWindow.style.transform = `translate(${newX}px, ${newY}px)`;
    
    // Reset after a moment
    setTimeout(() => {
      htmlWindow.style.transition = "";
    }, 100);
  });
}

// Teleport desktop icons to random positions
export function teleportDesktopIcons() {
  const icons = document.querySelectorAll("[data-desktop-icon]");
  icons.forEach((icon) => {
    const htmlIcon = icon as HTMLElement;
    const newX = Math.random() * (window.innerWidth - 100);
    const newY = Math.random() * (window.innerHeight - 100);
    
    // Apply teleport effect
    htmlIcon.style.transition = "all 0.1s ease-out";
    htmlIcon.style.transform = `translate(${newX}px, ${newY}px)`;
    
    // Reset after a moment
    setTimeout(() => {
      htmlIcon.style.transition = "";
      htmlIcon.style.transform = "";
    }, 300);
  });
}

// Multiply windows effect (create phantom clones)
export function createPhantomWindows() {
  const windows = document.querySelectorAll("[data-window-id]");
  const phantoms: HTMLElement[] = [];
  
  windows.forEach((win) => {
    const htmlWindow = win as HTMLElement;
    const clone = htmlWindow.cloneNode(true) as HTMLElement;
    
    // Style phantom
    clone.style.position = "fixed";
    clone.style.opacity = "0.5";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "9990";
    clone.style.left = `${Math.random() * window.innerWidth}px`;
    clone.style.top = `${Math.random() * window.innerHeight}px`;
    clone.setAttribute("data-phantom", "true");
    
    document.body.appendChild(clone);
    phantoms.push(clone);
    
    // Fade out and remove
    setTimeout(() => {
      clone.style.transition = "opacity 0.5s";
      clone.style.opacity = "0";
      setTimeout(() => clone.remove(), 500);
    }, 1000);
  });
  
  return phantoms;
}

// Screen tearing effect
export function applyScreenTear() {
  const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
  if (!desktop) return;
  
  const tearOffset = Math.random() * 50 - 25;
  desktop.style.clipPath = `polygon(
    0 0,
    100% 0,
    100% ${50 + tearOffset}%,
    0 ${50 - tearOffset}%
  )`;
  
  setTimeout(() => {
    desktop.style.clipPath = "";
  }, 100);
}

