/**
 * EMUs in one typographic point.
 * @internal
 */
export const EMU_PER_POINT: number = 12700;

/**
 * CSS/browser pixels in one typographic point at the reference 96 DPI.
 * @internal
 */
export const PIXELS_PER_POINT: number = 96 / 72;

/**
 * ports `Helper.EmuToPoint`.
 * @param {number} emu - emu
 * @returns {number} result
 * @internal
 */
export function emuToPoint(emu: number): number {
    return emu / EMU_PER_POINT;
}

/**
 * ports `Helper.PointToPixel` including `Convert.ToInt32` midpoint-to-even.
 * @param {number} points - points
 * @returns {number} result
 * @internal
 */
export function pointToPixel(points: number): number {
    return roundToEven(points * PIXELS_PER_POINT);
}

function roundToEven(value: number): number {
    const floor: number = Math.floor(value);
    const fraction: number = value - floor;
    if (fraction < 0.5) {
        return floor;
    }
    if (fraction > 0.5) {
        return floor + 1;
    }
    return floor % 2 === 0 ? floor : floor + 1;
}
