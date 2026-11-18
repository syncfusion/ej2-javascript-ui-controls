import { EvaluatedBatchBPreset, evaluateBatchBPreset } from './preset-geometry';

/**
 * ports the block-arrow dispatch in `SlideToImageConverter.GetAutoShapePath`.
 * @param {string} preset - preset
 * @param {number} width - width
 * @param {number} height - height
 * @param {Object} adjustments - adjustments
 * @returns {EvaluatedBatchBPreset|undefined} result
 * @internal
 */
export function evaluateArrowPreset(preset: string, width: number, height: number,
                                    adjustments: Readonly<Record<string, number>> = {}): EvaluatedBatchBPreset | undefined {
    const geometry: EvaluatedBatchBPreset = evaluateBatchBPreset(preset, width, height, adjustments);
    return optionalProperty(geometry, 'family') === 'arrows' ? geometry : undefined;
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
