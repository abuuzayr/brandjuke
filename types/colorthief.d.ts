declare module "colorthief" {
  type Color = [number, number, number];
  export function getColor(string): Promise<Color>;
  export function getPalette(string): Promise<Color[]>;
}
