export function hexToRgba(hex: string, opacity: number): string {
  // Ensure the hex code is in a valid format
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    throw new Error("Invalid hex color");
  }

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Return the RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
