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
    const x = (Math.random() - 0.5) * 40; // Doubled from 20 to 40
    const y = (Math.random() - 0.5) * 40;
    const rotate = (Math.random() - 0.5) * 10; // Added rotation
    transforms.push(`translate(${x}px, ${y}px) rotate(${rotate}deg)`);
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

// Teleport windows to random positions with more chaos (no rotation, just position changes)
export function teleportWindows() {
  const windows = document.querySelectorAll("[data-window-id]");
  windows.forEach((win) => {
    const htmlWindow = win as HTMLElement;
    const newX = Math.random() * (window.innerWidth - 200) - 100; // Can go slightly off-screen
    const newY = Math.random() * (window.innerHeight - 200) - 100;
    
    // Apply instant teleport with chaotic transform (no transition for glitchy feel)
    // Removed rotation to keep windows straight
    htmlWindow.style.transition = "none";
    htmlWindow.style.transform = `translate(${newX}px, ${newY}px)`;
    
    // Sometimes reset quickly for stuttering effect
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const resetX = Math.random() * (window.innerWidth - 400);
        const resetY = Math.random() * (window.innerHeight - 300);
        htmlWindow.style.transform = `translate(${resetX}px, ${resetY}px)`;
      }, 50);
    }
  });
}

// Teleport desktop icons to random positions with more chaos
export function teleportDesktopIcons() {
  const icons = document.querySelectorAll("[data-desktop-icon]");
  icons.forEach((icon) => {
    const htmlIcon = icon as HTMLElement;
    const newX = Math.random() * (window.innerWidth - 100);
    const newY = Math.random() * (window.innerHeight - 100);
    const rotation = (Math.random() - 0.5) * 60; // Add rotation
    const scale = 0.5 + Math.random() * 1; // Random scaling
    
    // Apply instant teleport with chaotic transform (no transition for glitchy feel)
    htmlIcon.style.transition = "none";
    htmlIcon.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotation}deg) scale(${scale})`;
    
    // Rapidly teleport again for stuttering effect
    setTimeout(() => {
      const newX2 = Math.random() * (window.innerWidth - 100);
      const newY2 = Math.random() * (window.innerHeight - 100);
      htmlIcon.style.transform = `translate(${newX2}px, ${newY2}px)`;
    }, 50);
    
    // Reset after a moment
    setTimeout(() => {
      htmlIcon.style.transform = "";
    }, 200);
  });
}

// Multiply windows effect (create more phantom clones)
export function createPhantomWindows() {
  const windows = document.querySelectorAll("[data-window-id]");
  const phantoms: HTMLElement[] = [];
  
  windows.forEach((win) => {
    const htmlWindow = win as HTMLElement;
    // Create 2-4 clones per window for more chaos
    const cloneCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < cloneCount; i++) {
      const clone = htmlWindow.cloneNode(true) as HTMLElement;
      
      // Style phantom - instant appearance with more variation
      clone.style.position = "fixed";
      clone.style.opacity = `${0.3 + Math.random() * 0.4}`; // 0.3-0.7 opacity
      clone.style.pointerEvents = "none";
      clone.style.zIndex = "9990";
      clone.style.left = `${Math.random() * window.innerWidth}px`;
      clone.style.top = `${Math.random() * window.innerHeight}px`;
      clone.style.transition = "none";
      clone.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg) scale(${0.8 + Math.random() * 0.4})`;
      clone.setAttribute("data-phantom", "true");
      
      document.body.appendChild(clone);
      phantoms.push(clone);
      
      // Instant disappear after short time
      setTimeout(() => {
        clone.remove();
      }, 200 + Math.random() * 200); // 200-400ms
    }
  });
  
  return phantoms;
}

// Screen tearing effect - much more intense
export function applyScreenTear() {
  const desktop = document.querySelector("[data-desktop-root]") as HTMLElement;
  if (!desktop) return;
  
  const tearType = Math.random();
  
  // Instant application with varied tear patterns
  desktop.style.transition = "none";
  
  if (tearType < 0.33) {
    // Horizontal tear
    const tearOffset = Math.random() * 150 - 75; // Much larger tear
    desktop.style.clipPath = `polygon(
      0 0,
      100% 0,
      100% ${50 + tearOffset}%,
      0 ${50 - tearOffset}%
    )`;
  } else if (tearType < 0.66) {
    // Vertical tear
    const tearOffset = Math.random() * 150 - 75;
    desktop.style.clipPath = `polygon(
      0 0,
      ${50 + tearOffset}% 0,
      ${50 - tearOffset}% 100%,
      0 100%
    )`;
  } else {
    // Diagonal tear
    const offset1 = Math.random() * 100;
    const offset2 = Math.random() * 100;
    desktop.style.clipPath = `polygon(
      0 0,
      ${offset1}% 0,
      100% ${offset2}%,
      100% 100%,
      ${100 - offset1}% 100%,
      0 ${100 - offset2}%
    )`;
  }
  
  setTimeout(() => {
    desktop.style.clipPath = "";
  }, 30); // Even faster reset for more jarring effect
}

