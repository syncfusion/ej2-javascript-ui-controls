/**
 * Public FillFormat owned by Shape (Shape.md §6).
 * @packageDocumentation
 */
import { Color, colorFromWire, colorToHexWire } from '../document/color';
import { alphaToTransparency, ShapeFill, transparencyToAlpha } from './sp-pr';

/** Default fill enabled for newly authored shapes. @public */
export const DEFAULT_SHAPE_FILL_ENABLED: boolean = true;

/** Default solid fill color for newly authored shapes. @public */
export const DEFAULT_SHAPE_FILL_COLOR: Color = Color.White;

/** Default fill transparency percent (0 = opaque). @public */
export const DEFAULT_SHAPE_FILL_TRANSPARENCY: number = 0;

/**
 *  @private
 *
 * @returns {Object} The result.
 */
export function defaultAuthoredShapeFill(): {
    readonly kind: 'solid';
    readonly srgb: string;
} {
    const srgb: string = colorToHexWire(DEFAULT_SHAPE_FILL_COLOR);
    return { kind: 'solid', srgb };
}

/**
 * Owner hooks for {@link FillFormat} (avoids circular import on Shape).
 * @private
 */
export interface FillFormatOwner {
    /**
     * @private
     */
    readShapeFillState(): ShapeFill | undefined;
    /**
     * @private
     */
    writeShapeFillState(value: ShapeFill | undefined): void;
}

/**
 * Shape fill formatting surface (`a:noFill` / `a:solidFill`).
 * @public
 */
export class FillFormat {
    private readonly owner: FillFormatOwner;

    /**
     *  @private
     *
     * @param {FillFormatOwner} owner - The owner.
     */
    constructor(owner: FillFormatOwner) {
        this.owner = owner;
    }

    /**
     * Whether an explicit fill is present (`true`) or `a:noFill` (`false`).
     * Theme/unsupported residual fills report `true` without inventing a color.
     * @public
     */
    get fill(): boolean {
        const state: ShapeFill = this.owner.readShapeFillState();
        if (state === undefined) {
            return false;
        }
        return state.kind !== 'none';
    }

    set fill(value: boolean) {
        if (value !== true && value !== false) {
            throw new RangeError('FillFormat.fill must be a boolean');
        }
        if (!value) {
            this.owner.writeShapeFillState({ kind: 'none' });
            return;
        }
        const current: ShapeFill = this.owner.readShapeFillState();
        if (current !== undefined && current.kind === 'solid') {
            this.owner.writeShapeFillState(current);
            return;
        }
        this.owner.writeShapeFillState(defaultAuthoredShapeFill());
    }

    /**
     * Solid fill color. Unresolved theme/pattern/gradient returns {@link Color.Transparent}.
     * @public
     */
    get color(): Color {
        const state: ShapeFill = this.owner.readShapeFillState();
        if (state === undefined || state.kind !== 'solid') {
            return Color.Transparent;
        }
        const mapped: Color = colorFromWire(state.srgb);
        return mapped !== undefined ? mapped : Color.Transparent;
    }

    set color(value: Color) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new RangeError('FillFormat.color must be a Color enum member');
        }
        if (value === Color.Transparent) {
            this.owner.writeShapeFillState({ kind: 'none' });
            return;
        }
        const hex: string = colorToHexWire(value);
        if (hex.length === 0) {
            throw new RangeError('FillFormat.color could not be serialized to sRGB');
        }
        const current: ShapeFill = this.owner.readShapeFillState();
        const alpha: number = current !== undefined && current.kind === 'solid' ? current.alpha : undefined;
        this.owner.writeShapeFillState(
            alpha !== undefined
                ? { kind: 'solid', srgb: hex, alpha }
                : { kind: 'solid', srgb: hex }
        );
    }

    /**
     * Transparency percent 0–100 (0 = opaque, 100 = fully transparent).
     * @public
     */
    get transparency(): number {
        const state: ShapeFill = this.owner.readShapeFillState();
        if (state === undefined || state.kind !== 'solid') {
            return 0;
        }
        return alphaToTransparency(state.alpha);
    }

    set transparency(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
            throw new RangeError('FillFormat.transparency must be a finite number from 0 through 100');
        }
        let current: ShapeFill = this.owner.readShapeFillState();
        if (current === undefined || current.kind !== 'solid') {
            current = defaultAuthoredShapeFill();
        }
        const solid: { readonly kind: 'solid'; readonly srgb: string; readonly alpha?: number; } = current;
        const alpha: number = transparencyToAlpha(value);
        // Fully opaque: omit alpha on wire.
        this.owner.writeShapeFillState(
            alpha >= 100000
                ? { kind: 'solid', srgb: solid.srgb }
                : { kind: 'solid', srgb: solid.srgb, alpha }
        );
    }
}
