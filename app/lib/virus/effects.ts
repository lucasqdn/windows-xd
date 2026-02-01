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
