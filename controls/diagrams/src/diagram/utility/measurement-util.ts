import { Internationalization } from '@syncfusion/ej2-base';
import { MeasurementUnit } from '../enum/enum';
import { Diagram } from '../diagram';
import { RulerSettingsModel, DiagramRulerModel } from '../diagram/ruler-settings-model';

/**
 * Helpers for ruler measurement units (DIAGRAM-RULERUNIT).
 * Physical units convert at a fixed 96 diagram units per inch (the CSS inch).
 */

/** @private */
export interface RulerSteps {
    /** Label step, in units. */
    labelStep: number;
    /** Number of decimals needed to print a label. */
    decimals: number;
    /** Minor ticks per label step (1 means no minor ticks). */
    minorCount: number;
    /** Screen pixels per unit at the given zoom. */
    pixelsPerUnit: number;
}

/** @private */
export interface RulerUnitState {
    unit: MeasurementUnit;
    /** True whenever the resolved unit is not Pixel: the grid and the snapping follow the unit. */
    unitDriven: boolean;
}

/** @private */
export interface AxisSteps {
    /** Diagram units between two label (major) ticks. */
    majorPx: number;
    /** Diagram units between two neighbouring ticks: the grid line spacing and the snap step. */
    minorPx: number;
    /** Minor parts per major step actually drawn (1 means none). */
    minorCount: number;
}

const PER_INCH: { [key: string]: number } = { Pixel: 96, Inch: 1, Centimeter: 2.54, Millimeter: 25.4, Point: 72 };
const SYMBOLS: { [key: string]: string } = { Point: 'pt', Centimeter: 'cm', Millimeter: 'mm', Inch: 'in' };
const DEFAULT_INTERVAL: number = 5;
const MIN_LABEL_GAP: number = 36;
const SUB_UNIT_WIDTH: number = 108;
const MIN_MINOR_GAP: number = 3;
const formatters: { [key: string]: Function } = {};

/**
 * Resolves any value to a supported unit. Anything else is Pixel, silently (DIAGRAM-RULER-007, -024).
 *
 * @param {Object} unit - The value to resolve.
 * @returns {MeasurementUnit} The resolved unit.
 * @private
 */
export function resolveMeasurementUnit(unit: Object): MeasurementUnit {
    if (unit === 'Pixel' || unit === 'Point' || unit === 'Centimeter' || unit === 'Millimeter' || unit === 'Inch') {
        return unit as MeasurementUnit;
    }
    return 'Pixel';
}

/**
 * Returns true for every unit except Pixel.
 *
 * @param {MeasurementUnit} unit - The unit.
 * @returns {boolean} Whether the unit is physical.
 * @private
 */
export function isPhysicalUnit(unit: MeasurementUnit): boolean {
    return unit === 'Point' || unit === 'Centimeter' || unit === 'Millimeter' || unit === 'Inch';
}

/**
 * Converts a number between measurement units at 96 pixels per inch.
 *
 * @param {number} value - The value to convert.
 * @param {MeasurementUnit} from - Unit of the value.
 * @param {MeasurementUnit} to - Target unit.
 * @returns {number} The converted value.
 * @private
 */
export function convertMeasurement(value: number, from: MeasurementUnit, to: MeasurementUnit): number {
    const source: MeasurementUnit = resolveMeasurementUnit(from);
    const target: MeasurementUnit = resolveMeasurementUnit(to);
    if (typeof value !== 'number') {
        return NaN;
    }
    if (source === target) {
        return value;
    }
    return value * PER_INCH[`${target}`] / PER_INCH[`${source}`];
}

/**
 * Diagram units in one measurement unit.
 *
 * @param {MeasurementUnit} unit - The unit.
 * @returns {number} Diagram units per unit.
 * @private
 */
export function pixelsPerUnit(unit: MeasurementUnit): number {
    return PER_INCH.Pixel / PER_INCH[resolveMeasurementUnit(unit)];
}

/**
 * Returns the unit symbol (pt, cm, mm, in); empty for Pixel. Used by tooltips only.
 *
 * @param {MeasurementUnit} unit - The unit.
 * @returns {string} The symbol.
 * @private
 */
export function unitSymbol(unit: MeasurementUnit): string {
    return SYMBOLS[`${unit}`] || '';
}

/**
 * Number of decimals needed to print a step such as 0.5, 0.02 or 5.
 *
 * @param {number} step - The step.
 * @returns {number} The decimal count.
 * @private
 */
function stepDecimals(step: number): number {
    let decimals: number = 0;
    while (decimals < 10 && Math.abs(Math.round(step * Math.pow(10, decimals)) - step * Math.pow(10, decimals)) > 1e-9) {
        decimals++;
    }
    return decimals;
}

/**
 * Yields the 1, 2, 5 ladder of whole-unit steps.
 *
 * @param {number} index - Ladder index, starting at 0.
 * @returns {number} The step.
 */
function wholeStep(index: number): number {
    return [1, 2, 5][index % 3] * Math.pow(10, Math.floor(index / 3));
}

/**
 * Yields the 0.5, 0.2, 0.1, 0.05 ... ladder of sub-unit steps (index 0 = 0.5).
 *
 * @param {number} index - Ladder index.
 * @returns {number} The step.
 * @private
 */
function fractionStep(index: number): number {
    return [5, 2, 1][index % 3] * Math.pow(10, -1 - Math.floor(index / 3));
}

/**
 * Validates a ruler interval at the boundary: below 1 (or not a number) uses the default 5, a non-integer is floored.
 * Never raises a warning (DIAGRAM-RULER-028, JS-068).
 *
 * @param {number} interval - The configured interval.
 * @returns {number} A whole number of at least 1.
 * @private
 */
export function validInterval(interval: number): number {
    if (typeof interval !== 'number' || !isFinite(interval) || interval < 1) {
        return DEFAULT_INTERVAL;
    }
    return Math.floor(interval);
}

/**
 * Number of minor parts a major step is divided into: `interval` equal parts. While the spacing would be under the
 * minimum, the largest smaller divisor of `interval` that keeps it at or above the minimum is used; 1 means no minor ticks
 * (DIAGRAM-RULER-012, -028, -036).
 *
 * @param {number} interval - The (validated) number of parts requested.
 * @param {number} labelPixels - Screen pixels between major ticks.
 * @param {number} minGap - Minimum minor tick gap in pixels.
 * @returns {number} Minor part count.
 * @private
 */
export function minorTickCount(interval: number): number {
    return validInterval(interval);
}

/**
 * Selects label step and minor tick count for a unit and zoom. Both rulers call this so they agree.
 *
 * @param {MeasurementUnit} unit - A physical unit.
 * @param {number} zoom - Current zoom factor.
 * @param {number} minGap - Minimum gap between labels in pixels.
 * @param {number} interval - Minor parts per major step for this ruler.
 * @returns {RulerSteps} The step selection.
 * @private
 */
export function computeRulerSteps(
    unit: MeasurementUnit, zoom: number, minGap: number = MIN_LABEL_GAP, interval: number = DEFAULT_INTERVAL): RulerSteps {
    const perUnit: number = pixelsPerUnit(unit) * zoom;
    const gap: number = Math.max(minGap, MIN_LABEL_GAP);
    let labelStep: number = 1;
    if (perUnit >= SUB_UNIT_WIDTH) {
        // Smallest decimal step that keeps labels at least `gap` apart.
        let index: number = 0;
        while (fractionStep(index + 1) * perUnit >= gap && index < 60) {
            index++;
        }
        labelStep = fractionStep(index);
    } else {
        let index: number = 0;
        while (wholeStep(index) * perUnit < gap && index < 90) {
            index++;
        }
        labelStep = wholeStep(index);
    }

    return {
        labelStep: labelStep,
        decimals: stepDecimals(labelStep),
        minorCount: minorTickCount(interval),
        pixelsPerUnit: perUnit
    };
}

/**
 * Removes floating-point noise and negative zero.
 *
 * @param {number} value - The value.
 * @param {number} decimals - Decimals to keep.
 * @returns {number} The cleaned value.
 * @private
 */
export function cleanNumber(value: number, decimals: number): number {
    const factor: number = Math.pow(10, decimals);
    return Math.round(value * factor) / factor + 0;
}

/**
 * Formats a number for a ruler label or tooltip with the culture's decimal separator.
 *
 * @param {number} value - The value.
 * @param {number} minDecimals - Minimum fraction digits (tooltips use 2).
 * @param {number} maxDecimals - Maximum fraction digits.
 * @param {string} locale - Culture name.
 * @returns {string} The formatted text.
 * @private
 */
export function formatMeasure(value: number, minDecimals: number, maxDecimals: number, locale?: string): string {
    let cleaned: number = cleanNumber(value, maxDecimals);
    if (cleaned === 0) {
        cleaned = 0;
    }
    const key: string = (locale || '') + '|' + minDecimals + '|' + maxDecimals;
    if (!formatters[`${key}`]) {
        const intl: Internationalization = new Internationalization(locale);
        formatters[`${key}`] = intl.getNumberFormat({
            minimumFractionDigits: minDecimals, maximumFractionDigits: maxDecimals, useGrouping: false
        });
    }
    return formatters[`${key}`](cleaned);
}

/**
 * Formats a diagram-unit value as `<n> <symbol>` in the given unit.
 *
 * @param {number} diagramValue - Value in diagram units.
 * @param {MeasurementUnit} unit - The unit.
 * @param {string} locale - Culture name.
 * @returns {string} Text such as "2.00 in".
 * @private
 */
export function formatTooltipValue(diagramValue: number, unit: MeasurementUnit, locale?: string): string {
    return formatMeasure(convertMeasurement(diagramValue, 'Pixel', unit), 2, 2, locale) + ' ' + unitSymbol(unit);
}

/**
 * Minimum gap between labels: the larger of 36 px and the widest label that can appear plus padding.
 * Uses one estimate for both rulers (the larger extent), so they keep the same step.
 *
 * @param {MeasurementUnit} unit - A physical unit.
 * @param {number} zoom - Current zoom factor.
 * @param {number} maxExtentPx - Largest absolute screen position shown on either ruler.
 * @returns {number} The gap in pixels.
 * @private
 */
export function labelGap(unit: MeasurementUnit, zoom: number, maxExtentPx: number): number {
    let gap: number = MIN_LABEL_GAP;
    for (let pass: number = 0; pass < 2; pass++) {
        const steps: RulerSteps = computeRulerSteps(unit, zoom, gap);
        const widest: number = Math.floor(maxExtentPx / steps.pixelsPerUnit) + 1;
        const chars: number = String(widest).length + 1 + (steps.decimals ? steps.decimals + 1 : 0);
        gap = Math.max(MIN_LABEL_GAP, chars * 6.2 + 8);
    }
    return gap;
}

/**
 * Effective unit state for a diagram. `unitDriven` is true whenever the resolved unit is not Pixel: there is no opt-in flag.
 * During a gesture the state captured at mouse-down is returned while the gesture is live (DIAGRAM-RULER-030).
 *
 * @param {Diagram} diagram - The diagram.
 * @returns {RulerUnitState} The state.
 * @private
 */
export function getRulerUnitState(diagram: Diagram): RulerUnitState {
    if (diagram.gestureUnitState) {
        return diagram.gestureUnitState;
    }
    return currentRulerUnitState(diagram);
}

/**
 * The live (non-gesture) state.
 *
 * @param {Diagram} diagram - The diagram.
 * @returns {RulerUnitState} The state.
 * @private
 */
export function currentRulerUnitState(diagram: Diagram): RulerUnitState {
    const rulers: RulerSettingsModel = diagram.rulerSettings;
    const unit: MeasurementUnit = rulers ? resolveMeasurementUnit(rulers.measurementUnit) : 'Pixel';
    return { unit: unit, unitDriven: isPhysicalUnit(unit) };
}

/**
 * Label gap shared by both rulers, the grid and snapping, so they always use the same step.
 *
 * @param {Diagram} diagram - The diagram.
 * @param {MeasurementUnit} unit - A non-Pixel unit.
 * @returns {number} The gap in pixels.
 * @private
 */
export function rulerLabelGap(diagram: Diagram, unit: MeasurementUnit): number {
    const extent: number = Math.max(Math.abs(diagram.scroller.horizontalOffset), Math.abs(diagram.scroller.verticalOffset)) +
        Math.max(diagram.element.clientWidth, diagram.element.clientHeight) + 200;
    return labelGap(unit, diagram.scroller.currentZoom, extent);
}

/**
 * The ruler interval of one axis, validated. Vertical grid lines and x-snapping follow the horizontal ruler;
 * horizontal grid lines and y-snapping follow the vertical ruler (DIAGRAM-RULER-014).
 *
 * @param {Diagram} diagram - The diagram.
 * @param {boolean} horizontalRuler - True for the horizontal ruler.
 * @returns {number} The interval.
 * @private
 */
export function axisInterval(diagram: Diagram, horizontalRuler: boolean): number {
    const ruler: DiagramRulerModel = horizontalRuler ? diagram.rulerSettings.horizontalRuler : diagram.rulerSettings.verticalRuler;
    return validInterval(ruler ? ruler.interval : DEFAULT_INTERVAL);
}

/**
 * Tick spacing of one axis for the current unit, interval and zoom. This is the single calculation the rulers, the grid
 * and the snap step all read, so they cannot disagree, whether or not a ruler is shown (DIAGRAM-RULER-013, -014, -019).
 * Returns null for Pixel.
 *
 * @param {Diagram} diagram - The diagram.
 * @param {boolean} horizontalRuler - True for the horizontal ruler.
 * @returns {AxisSteps} Major and minor spacing in diagram units, or null.
 * @private
 */
export function getAxisSteps(diagram: Diagram, horizontalRuler: boolean): AxisSteps {
    const state: RulerUnitState = getRulerUnitState(diagram);
    if (!state.unitDriven || !diagram.scroller) {
        return null;
    }
    const zoom: number = diagram.scroller.currentZoom;
    const steps: RulerSteps = computeRulerSteps(
        state.unit, zoom, rulerLabelGap(diagram, state.unit), axisInterval(diagram, horizontalRuler));
    const majorScreen: number = steps.labelStep * steps.pixelsPerUnit;
    return { majorPx: majorScreen, minorPx: majorScreen / steps.minorCount, minorCount: steps.minorCount };
}

/** @private */
export interface UnitGrid {
    /** Cell size along x and y in screen pixels (one major step per axis). */
    tileX: number;
    tileY: number;
    /** Lines per cell along each axis. */
    countX: number;
    countY: number;
    /** Pattern phase, wrapped to one tile so it stays exact at large offsets. */
    phaseX: number;
    phaseY: number;
    /** Screen pixels between neighbouring lines per axis: the snap step. */
    minorX: number;
    minorY: number;
}

/**
 * Describes the unit-driven grid, or null for Pixel. Vertical lines come from the horizontal ruler, horizontal lines from the
 * vertical ruler.
 *
 * @param {Diagram} diagram - The diagram.
 * @returns {UnitGrid} The grid description or null.
 * @private
 */
export function getUnitGrid(diagram: Diagram): UnitGrid {
    const x: AxisSteps = getAxisSteps(diagram, true);
    const y: AxisSteps = getAxisSteps(diagram, false);
    if (!x || !y) {
        return null;
    }

    return {
        tileX: x.majorPx, tileY: y.majorPx, countX: x.minorCount, countY: y.minorCount,
        phaseX: 0, phaseY: 0,
        minorX: x.minorPx, minorY: y.minorPx
    };
}
