/**
 * Colour mapping (`CT_ColorMapping` / `p:clrMap` / `a:overrideClrMapping`).
 */
import { COLOR_MAP_KEYS, ColorMapKey, ColorSchemeIndex } from './constants';
import { objectSet, arrayAt } from '../util/es5-compat';
/**
 * Readonly view of the twelve required colour-map attributes.
 *
 * @remarks
 * Each key is a `ST_SchemeColorVal` map token (`bg1`, `tx1`, …); each value is
 * a {@link ColorSchemeIndex} into `a:clrScheme`. This is the **map** only —
 * resolving a `schemeClr` through the map yields a separate
 * {@link ResolvedColor} view and must never be written back over `schemeClr`.
 *
 * Citation: Transitional `dml-main.xsd` `CT_ColorMapping` ~2306–2322.
 */
export class ColorMapping {
    /** @internal */
    private readonly entries: ReadonlyMap<ColorMapKey, ColorSchemeIndex>;
    /**
     * @internal
     * @param {ReadonlyMap<ColorMapKey, ColorSchemeIndex>} entries - All twelve map keys → scheme indices.
     */
    constructor(entries: ReadonlyMap<ColorMapKey, ColorSchemeIndex>) {
        for (let i: number = 0; i < COLOR_MAP_KEYS.length; i++) {
            const key: string = arrayAt(COLOR_MAP_KEYS, i);
            if (!entries.has(key)) {
                throw new RangeError(`ColorMapping is missing required key "${key}"`);
            }

        }
        this.entries = entries;
    }
    /**
     * Returns the scheme index for one map key.
     *
     * @param {ColorMapKey} key - `CT_ColorMapping` attribute name (`bg1`, `accent1`, …).
     * @returns {ColorSchemeIndex} The mapped {@link ColorSchemeIndex}.
     */
    get(key: ColorMapKey): ColorSchemeIndex {
        const value: string = this.entries.get(key);
        if (value === undefined) {
            throw new RangeError(`ColorMapping key "${key}" is not present`);
        }
        return value;
    }
    /**
     * Snapshot of all twelve mappings in `COLOR_MAP_KEYS` order.
     *
     * @returns {*} The result.
     */
    toRecord(): Readonly<Record<ColorMapKey, ColorSchemeIndex>> {
        const out: Record<string, string> = {} as Record<ColorMapKey, ColorSchemeIndex>;
        for (let i: number = 0; i < COLOR_MAP_KEYS.length; i++) {
            const key: string = arrayAt(COLOR_MAP_KEYS, i);
            objectSet(out, String(key), this.get(key));

        }
        return out;
    }
}
