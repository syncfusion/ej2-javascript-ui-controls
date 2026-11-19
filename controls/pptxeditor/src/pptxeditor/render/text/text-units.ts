declare const textPointBrand: unique symbol;
declare const fontDesignUnitBrand: unique symbol;

/** A CSS-compatible typographic point value (72 points per inch). */
export type TextPoint = number & { readonly [textPointBrand]: 'TextPoint' };

/** An integer coordinate in a font's em-square design space. */
export type FontDesignUnit = number & { readonly [fontDesignUnitBrand]: 'FontDesignUnit' };

/**
 * Brands a numeric value as typographic points at an explicit boundary.
 *
 * @param {number} value - Value measured in points.
 * @returns {TextPoint} The branded point value.
 */
export function textPoint(value: number): TextPoint {
    return value as TextPoint;
}

/**
 * Brands a numeric value as font design units at an explicit boundary.
 *
 * @param {number} value - Integer value from a font metric table.
 * @returns {FontDesignUnit} The branded font design-unit value.
 */
export function fontDesignUnit(value: number): FontDesignUnit {
    return value as FontDesignUnit;
}
