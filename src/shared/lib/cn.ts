import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "h1", "h2", "h3", "body", "caption"] }],
      rounded: [{ rounded: ["card", "control", "input"] }],
      shadow: [{ shadow: ["glow"] }],
      "max-w": [{ "max-w": ["content"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
