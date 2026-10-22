declare module 'gifenc' {
  export function GIFEncoder(opts?: { auto?: boolean; initialCapacity?: number }): {
    writeFrame: (
      index: Uint8Array | number[],
      width: number,
      height: number,
      opts?: {
        palette?: number[][];
        delay?: number;
        transparent?: boolean;
        transparentIndex?: number;
        dispose?: number;
      }
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
    bytesView: () => Uint8Array;
    reset: () => void;
  };

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray | number[],
    maxColors?: number,
    opts?: {
      format?: string;
      oneBitAlpha?: boolean;
      clearAlpha?: boolean;
    }
  ): number[][];

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray | number[],
    palette: number[][],
    format?: string
  ): Uint8Array;
}
