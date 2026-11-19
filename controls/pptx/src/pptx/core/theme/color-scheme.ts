/**
 * Theme colour scheme (`a:clrScheme` / `CT_ColorScheme`).
 */
import { ColorSchemeIndex } from './constants';
import { ColorValue } from './color-value';
/**
 * Readonly view of the twelve theme colour-scheme slots.
 *
 * @remarks
 * Slot values are **direct** theme colours from `a:clrScheme`. They are not
 * effective/mapped colours for a particular slide (`clrMap` is TASK-1012).
 */
export class ColorScheme {
    /** Scheme `@name` (`CT_ColorScheme` required attribute). */
    readonly name: string;
    /** @internal */
    private readonly slots: ReadonlyMap<ColorSchemeIndex, ColorValue>;
    /**
     * @internal
     * @param {string} name - `a:clrScheme` `@name`.
     * @param {ReadonlyMap<ColorSchemeIndex, ColorValue>} slots - All twelve `ST_ColorSchemeIndex` entries.
     */
    constructor(name: string, slots: ReadonlyMap<ColorSchemeIndex, ColorValue>) {
        this.name = name;
        this.slots = slots;
    }
    /**
     * Returns the direct colour for one scheme slot.
     *
     * @throws RangeError When `index` is not a known scheme slot (should not occur for typed callers).
     * @param {ColorSchemeIndex} index - `ST_ColorSchemeIndex` token (`accent1`, `dk1`, …).
     * @returns {ColorValue} The authored {@link ColorValue} for that slot.
     */
    getSlot(index: ColorSchemeIndex): ColorValue {
        const value: ColorValue = this.slots.get(index);
        if (value === undefined) {
            throw new RangeError(`Colour scheme slot "${index}" is not present`);
        }
        return value;
    }
}
