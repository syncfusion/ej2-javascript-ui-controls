/**
 * Public authoring length units vs DrawingML wire EMUs.
 *
 * @remarks
 * OOXML stores geometry in EMUs (`ST_Coordinate` / `ST_PositiveCoordinate`).
 * Public authoring APIs take **points** (1 pt = 1/72 inch = 12_700 EMU).
 * Conversion belongs at the package write/read boundary — never invent wire
 * units in public option bags (API-RULES R4.1–R4.3).
 *
 * Citation: ECMA-376 DrawingML; `docs/api/API-RULES.md` §4.
 *
 * @packageDocumentation
 */

/**
 * English Metric Units per typographic point.
 *
 * @remarks
 * Exact: 1 inch = 914_400 EMU; 1 point = 1/72 inch ⇒ 12_700 EMU/pt.
 */
export const EMU_PER_POINT: number = 12700;

/**
 * Converts a finite point length to an integer EMU value (rounded).
 *
 * @throws {RangeError} When `points` is not finite.
 * @remarks Intended for **serialization** of public authoring values. Prefer points on public geometry options (`ShapeBounds`,
     table frame/row/column sizes). /
 * @param {number} points - Length in points (may be fractional).
 * @returns {number} Integer EMUs (`Math.round(points * {@link EMU_PER_POINT})`).
 */
export function pointsToEmu(points: number): number {
    if (typeof points !== 'number' || !Number.isFinite(points)) {
        throw new RangeError('pointsToEmu requires a finite number of points');
    }
    return Math.round(points * EMU_PER_POINT);
}

/**
 * Converts an EMU length to points.
 *
 * @throws {RangeError} When `emu` is not finite.
 * @remarks Read-path helper for exposing wire coordinates as public points.
 * @param {number} emu - Length in English Metric Units.
 * @returns {number} Points (`emu / {@link EMU_PER_POINT}`).
 */
export function emuToPoints(emu: number): number {
    if (typeof emu !== 'number' || !Number.isFinite(emu)) {
        throw new RangeError('emuToPoints requires a finite EMU number');
    }
    return emu / EMU_PER_POINT;
}

/**
 * Maps a public geometry coordinate to a decimal EMU string for `a:off` / `a:ext`.
 *
 * @throws {RangeError} When the value is not a finite points number or a finite EMU decimal string.
 * @param {number | string} value - Points when `number`; already-serialized EMU decimal when `string`
 * @param {string} label - Field name for error messages.
 * @returns {string} Integer EMU decimal string.
 */
export function coordinateToEmuString(value: number | string, label: string = 'coordinate'): string {
    if (typeof value === 'number') {
        return String(pointsToEmu(value));
    }
    const n: number = Number(value);
    if (!Number.isFinite(n)) {
        throw new RangeError(`${label} is not a finite EMU decimal string`);
    }
    return String(Math.round(n));
}

/**
 * Maps a public points length (or EMU string escape hatch) to integer EMUs.
 *
 * @param {number | string} value - Points when `number`; EMU decimal when `string`.
 * @param {string} label - Field name for error messages.
 * @returns {number} The result.
 */
export function coordinateToEmuNumber(value: number | string, label: string = 'coordinate'): number {
    if (typeof value === 'number') {
        return pointsToEmu(value);
    }
    const n: number = Number(value);
    if (!Number.isFinite(n)) {
        throw new RangeError(`${label} is not a finite EMU decimal string`);
    }
    return Math.round(n);
}
