/**
 * Public LineFormat owned by Shape (Shape.md §7).
 *
 * @packageDocumentation
 */
import { Emus } from '../document/length';
import { Color, colorFromWire, colorToHexWire } from '../document/color';
import { emuToPoint, pointToEmus } from '../document/length';
import { DocxError } from '../../core/errors/docx-error';
import {
    alphaToTransparency,
    ArrowheadSize,
    ArrowheadStyle,
    isLineCap,
    isLineEndSize,
    isLineEndType,
    isLineDashing,
    LineCap,
    LineEndSize,
    LineEndType,
    LineStyle,
    LineDashing,
    ShapeLine,
    ShapeLineKind,
    transparencyToAlpha
} from './sp-pr';

/**
 * Default line enabled for newly authored shapes.
 *
 * @public
 */
export const DEFAULT_SHAPE_LINE_ENABLED: boolean = true;

/**
 * Default solid line color for newly authored shapes.
 *
 * @public
 */
export const DEFAULT_SHAPE_LINE_COLOR: Color = Color.Black;

/**
 * Default line width in EMU (1 pt).
 *
 * @public
 */
export const DEFAULT_SHAPE_LINE_WIDTH_EMU: number = 12700;

/**
 * Default line dash for newly authored shapes.
 *
 * @public
 */
export const DEFAULT_SHAPE_LINE_DASH: LineDashing = LineDashing.Solid;

/**
 * Modeled default outline used when authoring new AutoShapes (solid black 1 pt).
 * Parse paths must not invent this when residual `a:ln` is absent.
 *
 * @returns {ShapeLine} The result.
 * @private
 */
export function defaultAuthoredShapeLine(): ShapeLine {
    const srgb: string = colorToHexWire(DEFAULT_SHAPE_LINE_COLOR);
    return {
        kind: ShapeLineKind.Solid,
        widthEmu: DEFAULT_SHAPE_LINE_WIDTH_EMU as Emus,
        srgbColor: srgb.length > 0 ? srgb : '000000',
        alpha: undefined,
        dash: DEFAULT_SHAPE_LINE_DASH,
        cap: undefined,
        beginArrowType: undefined,
        beginArrowSize: undefined,
        endArrowType: undefined,
        endArrowSize: undefined,
        residual: false
    };
}

/**
 * Owner hooks for {@link LineFormat}.
 *
 * @private
 */
export interface LineFormatOwner {
    /**
     * @private
     */
    readShapeLineState(): ShapeLine | undefined;
    /**
     * @private
     */
    writeShapeLineState(value: ShapeLine | undefined): void;
}

function emptySolidLine(partial?: Partial<ShapeLine>): ShapeLine {
    const defaults: ShapeLine = defaultAuthoredShapeLine();
    return {
        kind: ShapeLineKind.Solid,
        widthEmu: partial !== undefined && partial.widthEmu !== undefined ? partial.widthEmu : defaults.widthEmu,
        srgbColor:
      partial !== undefined && partial.srgbColor !== undefined ? partial.srgbColor : defaults.srgbColor,
        alpha: partial !== undefined ? partial.alpha : undefined,
        dash: partial !== undefined && partial.dash !== undefined ? partial.dash : defaults.dash,
        cap: partial !== undefined ? partial.cap : undefined,
        beginArrowType: partial !== undefined ? partial.beginArrowType : undefined,
        beginArrowSize: partial !== undefined ? partial.beginArrowSize : undefined,
        endArrowType: partial !== undefined ? partial.endArrowType : undefined,
        endArrowSize: partial !== undefined ? partial.endArrowSize : undefined,
        residual: false
    };
}

function noneLine(): ShapeLine {
    return {
        kind: ShapeLineKind.None,
        widthEmu: undefined,
        srgbColor: undefined,
        alpha: undefined,
        dash: undefined,
        cap: undefined,
        beginArrowType: undefined,
        beginArrowSize: undefined,
        endArrowType: undefined,
        endArrowSize: undefined,
        residual: false
    };
}

function ensureSolid(state: ShapeLine | undefined): ShapeLine {
    if (state !== undefined && state.kind === ShapeLineKind.Solid) {
        return state;
    }
    return emptySolidLine(state);
}

/**
 * Shape line formatting surface.
 *
 * @public
 */
export class LineFormat {
    private readonly owner: LineFormatOwner;

    /**
     *  @private
     *
     * @param {LineFormatOwner} owner - The owner.
     */
    constructor(owner: LineFormatOwner) {
        this.owner = owner;
    }

    /**
     * Gets or sets a value indicating whether the shape has a line.
     *
     * @public
     */
    get line(): boolean {
        const state: ShapeLine = this.owner.readShapeLineState();
        if (state === undefined) {
            return false;
        }
        return state.kind !== ShapeLineKind.None;
    }

    set line(value: boolean) {
        if (value !== true && value !== false) {
            throw new RangeError('LineFormat.line must be a boolean');
        }
        if (!value) {
            this.owner.writeShapeLineState(noneLine());
            return;
        }
        this.owner.writeShapeLineState(ensureSolid(this.owner.readShapeLineState()));
    }

    /**
     * Gets or sets the solid line color.
     *
     * @public
     */
    get color(): Color {
        const state: ShapeLine = this.owner.readShapeLineState();
        if (state === undefined || state.kind !== ShapeLineKind.Solid || state.srgbColor === undefined) {
            return Color.Transparent;
        }
        const mapped: Color = colorFromWire(state.srgbColor);
        return mapped !== undefined ? mapped : Color.Transparent;
    }

    set color(value: Color) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new RangeError('LineFormat.color must be a Color enum member');
        }
        if (value === Color.Transparent) {
            this.owner.writeShapeLineState(noneLine());
            return;
        }
        const hex: string = colorToHexWire(value);
        if (hex.length === 0) {
            throw new RangeError('LineFormat.color could not be serialized to sRGB');
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({ ...base, kind: ShapeLineKind.Solid, srgbColor: hex, residual: false });
    }

    /**
     * Gets or sets the dash style.
     *
     * @public
     */
    get dashStyle(): LineDashing {
        const state: ShapeLine = this.owner.readShapeLineState();
        if (state === undefined || state.dash === undefined) {
            return LineDashing.Solid;
        }
        return isLineDashing(state.dash) ? state.dash : LineDashing.Unknown;
    }

    set dashStyle(value: LineDashing) {
        if (!isLineDashing(value)) {
            throw new RangeError(`Invalid LineFormat.dashStyle "${String(value)}"`);
        }
        if (value === LineDashing.Unknown) {
            throw new RangeError('LineFormat.dashStyle cannot be set to LineDashing.Unknown');
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({ ...base, kind: ShapeLineKind.Solid, dash: value, residual: false });
    }

    /**
     * Gets or sets the cap style.
     *
     * @public
     */
    get capStyle(): LineCap {
        const state: ShapeLine = this.owner.readShapeLineState();
        if (state === undefined || state.cap === undefined) {
            return LineCap.Flat;
        }
        return state.cap;
    }

    set capStyle(value: LineCap) {
        if (!isLineCap(value)) {
            throw new RangeError(`Invalid LineFormat.capStyle "${String(value)}"`);
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({ ...base, kind: ShapeLineKind.Solid, cap: value, residual: false });
    }

    /**
     * Gets or sets the compound line style.
     *
     * @public
     */
    get style(): LineStyle {
        return LineStyle.Single;
    }

    set style(value: LineStyle) {
        if (value !== LineStyle.Single) {
            throw new RangeError(`Invalid LineFormat.style "${String(value)}"; only LineStyle.Single is supported`);
        }
        this.owner.writeShapeLineState(ensureSolid(this.owner.readShapeLineState()));
    }

    /**
     * Gets or sets the line weight in points.
     *
     * @public
     */
    get weight(): number | undefined {
        const state: ShapeLine = this.owner.readShapeLineState();
        if (state === undefined || state.widthEmu === undefined) {
            return undefined;
        }
        return emuToPoint(state.widthEmu);
    }

    set weight(value: number | undefined) {
        if (value === undefined) {
            const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
            this.owner.writeShapeLineState({ ...base, kind: ShapeLineKind.Solid, widthEmu: undefined, residual: false });
            return;
        }
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
            throw new RangeError('LineFormat.weight must be a finite non-negative number of points');
        }
        let widthEmu: any;
        try {
            widthEmu = pointToEmus(value === 0 ? 0.0001 : value);
            if (value === 0) {
                widthEmu = 0 as typeof widthEmu;
            }
        } catch (error) {
            if (error instanceof RangeError) {
                throw new RangeError('LineFormat.weight must be a finite non-negative number of points');
            }
            throw error;
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({ ...base, kind: ShapeLineKind.Solid, widthEmu, residual: false });
    }

    /**
     * Gets or sets the transparency percent 0–100 (0 = opaque).
     *
     * @public
     */
    get transparency(): number {
        const state: ShapeLine = this.owner.readShapeLineState();
        if (state === undefined || state.kind !== ShapeLineKind.Solid) {
            return 0;
        }
        return alphaToTransparency(state.alpha);
    }

    set transparency(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
            throw new RangeError('LineFormat.transparency must be a finite number from 0 through 100');
        }
        const current: ShapeLine = this.owner.readShapeLineState();
        if (current === undefined || current.kind !== ShapeLineKind.Solid) {
            throw new DocxError(
                'content/invalid-shape',
                'LineFormat.transparency requires an explicit solid line; set color or line first'
            );
        }
        const alpha: number = transparencyToAlpha(value);
        this.owner.writeShapeLineState({
            ...current,
            alpha: alpha >= 100000 ? undefined : alpha,
            residual: false
        });
    }

    /**
     * Gets or sets the begin arrowhead style.
     *
     * @public
     */
    get beginArrowheadStyle(): ArrowheadStyle {
        const state: ShapeLine = this.owner.readShapeLineState();
        const t: string = state !== undefined ? state.beginArrowType : undefined;
        return t !== undefined ? (t as ArrowheadStyle) : ArrowheadStyle.None;
    }

    set beginArrowheadStyle(value: ArrowheadStyle) {
        if (!isLineEndType(value)) {
            throw new RangeError(`Invalid LineFormat.beginArrowheadStyle "${String(value)}"`);
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({
            ...base,
            kind: ShapeLineKind.Solid,
            beginArrowType: value as LineEndType,
            residual: false
        });
    }

    /**
     * Gets or sets the end arrowhead style.
     *
     * @public
     */
    get endArrowheadStyle(): ArrowheadStyle {
        const state: ShapeLine = this.owner.readShapeLineState();
        const t: string = state !== undefined ? state.endArrowType : undefined;
        return t !== undefined ? (t as ArrowheadStyle) : ArrowheadStyle.None;
    }

    set endArrowheadStyle(value: ArrowheadStyle) {
        if (!isLineEndType(value)) {
            throw new RangeError(`Invalid LineFormat.endArrowheadStyle "${String(value)}"`);
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({
            ...base,
            kind: ShapeLineKind.Solid,
            endArrowType: value as LineEndType,
            residual: false
        });
    }

    /**
     * Gets or sets the begin arrowhead size.
     *
     * @public
     */
    get beginArrowheadSize(): ArrowheadSize | undefined {
        const state: ShapeLine = this.owner.readShapeLineState();
        return state !== undefined ? (state.beginArrowSize as ArrowheadSize | undefined) : undefined;
    }

    set beginArrowheadSize(value: ArrowheadSize | undefined) {
        if (value !== undefined && !isLineEndSize(value)) {
            throw new RangeError(`Invalid LineFormat.beginArrowheadSize "${String(value)}"`);
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({
            ...base,
            kind: ShapeLineKind.Solid,
            beginArrowSize: value as LineEndSize | undefined,
            residual: false
        });
    }

    /**
     * Gets or sets the end arrowhead size.
     *
     * @public
     */
    get endArrowheadSize(): ArrowheadSize | undefined {
        const state: ShapeLine = this.owner.readShapeLineState();
        return state !== undefined ? (state.endArrowSize as ArrowheadSize | undefined) : undefined;
    }

    set endArrowheadSize(value: ArrowheadSize | undefined) {
        if (value !== undefined && !isLineEndSize(value)) {
            throw new RangeError(`Invalid LineFormat.endArrowheadSize "${String(value)}"`);
        }
        const base: ShapeLine = ensureSolid(this.owner.readShapeLineState());
        this.owner.writeShapeLineState({
            ...base,
            kind: ShapeLineKind.Solid,
            endArrowSize: value as LineEndSize | undefined,
            residual: false
        });
    }
}
