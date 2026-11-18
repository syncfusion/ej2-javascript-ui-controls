/**
 * Watermark public model types (text and picture).
 *
 * Construction, validation, residual, and layout state for TASK-8060 / TASK-8061.
 * WordDocument host attachment lives in `index.ts`. Parse lives in `parse.ts`.
 *
 * OOXML ownership: `docs/ooxml-mapping/watermark.md`. Requirement:
 * `docs/requirements/watermark-basic.md`. Spec: `docs/specs/watermark-basic.md`.
 *
 * @packageDocumentation
 */
import { enumValues } from '../../core/compat/object-compat';
/**
 * Discriminator for logical watermark kinds.
 *
 * Values match the normative public API in `docs/requirements/watermark-basic.md`.
 * Implemented as a const object + union type (API-RULES R7.5); not a TypeScript `enum`.
 *
 * @public
 */
export enum WatermarkType {
    TextWatermark = 'TextWatermark',
    PictureWatermark = 'PictureWatermark'
}
/**
 * Text watermark layout / rotation preset.
 *
 * - `Horizontal` — rotation 0°
 * - `Diagonal` — rotation 315° (Word default diagonal watermark)
 *
 * @public
 */
export enum WatermarkLayout {
    Horizontal = 'Horizontal',
    Diagonal = 'Diagonal'
}
/**
 * Supported picture watermark image encodings for authoring.
 *
 * Public values are the locked API tokens `Jpeg` and `Png` (not MIME strings).
 * Parse maps package content types (`image/jpeg` / `image/png`) onto these tokens.
 *
 * @public
 */
export enum ImageType {
    /** JPEG raster (maps from image/jpeg media part). */
    Jpeg = 'Jpeg',
    /** PNG raster (maps from image/png media part). */
    Png = 'Png'
}
/**
 * Internal tri-state for text watermark opacity parse residual.
 *
 * - `transparent` — parse saw below-full opacity (e.g. `.5`) or author set true
 * - `opaque` — parse saw full opacity or author set false
 * - `unknown` — clean parse with no opacity signal; public getter defaults true
 *   without dirtying
 *
 * @private
 */
export type SemitransparentState = 'transparent' | 'opaque' | 'unknown';
/**
 * Serializable residual bag for a recognized watermark VML shape (TASK-8061).
 *
 * Holds markup the structured model does not own so clean load/save can restore
 * it. Serialize (TASK-8062) merges these back onto dirty rewrite when needed.
 *
 * @private
 */
export interface WatermarkShapeResidual {
    /** Original `v:shape/@id` when present. */
    readonly shapeId?: string;
    /** Original `v:shape/@type` token when present. */
    readonly shapeType?: string;
    /**
     * Full original `style` attribute string when parse keeps it for unknown
     * tokens beyond structured layout/size.
     */
    readonly styleAttribute?: string;
    /** Original `fillcolor` when present (text). */
    readonly fillcolor?: string;
    /** Unknown / extra attribute name→value pairs on `v:shape`. */
    readonly extraShapeAttributes?: Readonly<Record<string, string>>;
    /**
     * Serialized XML of non-owned child elements under `v:shape` (e.g. extra
     * VML nodes). Joined in document order.
     */
    readonly extraChildXml?: ReadonlyArray<string>;
    /** Raw `v:fill/@opacity` token when observed. */
    readonly fillOpacity?: string;
    /** Picture: original header-local relationship id from `v:imagedata`. */
    readonly imageRelationshipId?: string;
    /** Picture: unresolved media path or note when bytes could not be loaded. */
    readonly unresolvedImageNote?: string;
    /** Arbitrary extension bag for future parse fields without public API churn. */
    readonly extensions?: Readonly<Record<string, string>>;
}
/**
 * Optional constructor bag for {@link TextWatermark}.
 *
 * @private
 */
export interface TextWatermarkOptions {
    /** Typeface name written to `v:textpath` style `font-family`. */
    fontName?: string;
    /** Font size in points. */
    size?: number;
    /** Fill color (e.g. `#808080`). */
    color?: string;
    /** When true, dirty serialize emits canonical semitransparent fill (TASK-8062). */
    semitransparent?: boolean;
    /** Layout preset (Horizontal / Diagonal). */
    layout?: WatermarkLayout;
    /** Optional explicit width in points. */
    width?: number;
    /** Optional explicit height in points. */
    height?: number;
}
/**
 * Optional constructor bag for {@link PictureWatermark}.
 *
 * @private
 */
export interface PictureWatermarkOptions {
    /** Image content type. */
    imageType?: ImageType;
    /** Scale percentage (100 = 100%). Must be finite and > 0. */
    scaling?: number;
    /** Word washout / washout-like rendering when true. */
    washout?: boolean;
    /** Optional explicit width in points. */
    width?: number;
    /** Optional explicit height in points. */
    height?: number;
}
function assertFiniteNumber(name: string, value: number): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new RangeError(`${name} must be a finite number`);
    }
}
function assertOptionalPositive(name: string, value: number | undefined): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    assertFiniteNumber(name, value);
    if (value <= 0) {
        throw new RangeError(`${name} must be greater than zero`);
    }
    return value;
}
const WATERMARK_LAYOUT_VALUES: Set<string> = new Set<string>(enumValues<WatermarkLayout>(WatermarkLayout));
const IMAGE_TYPE_VALUES: Set<string> = new Set<string>(enumValues<ImageType>(ImageType));
function assertLayout(value: WatermarkLayout): WatermarkLayout {
    if (!WATERMARK_LAYOUT_VALUES.has(value)) {
        throw new RangeError('layout must be Horizontal or Diagonal');
    }
    return value;
}
function assertImageType(value: ImageType): ImageType {
    if (!IMAGE_TYPE_VALUES.has(value)) {
        throw new RangeError('imageType must be Jpeg or Png');
    }
    return value;
}
function copyBytes(data: Uint8Array): Uint8Array {
    const copy: Uint8Array = new Uint8Array(data.byteLength);
    copy.set(data);
    return copy;
}
function cloneResidual(residual: WatermarkShapeResidual | undefined): WatermarkShapeResidual | undefined {
    if (residual === undefined) {
        return undefined;
    }
    const next: {
        shapeId?: string;
        shapeType?: string;
        styleAttribute?: string;
        fillcolor?: string;
        extraShapeAttributes?: Record<string, string>;
        extraChildXml?: string[];
        fillOpacity?: string;
        imageRelationshipId?: string;
        unresolvedImageNote?: string;
        extensions?: Record<string, string>;
    } = {};
    if (residual.shapeId !== undefined) {
        next.shapeId = residual.shapeId;
    }
    if (residual.shapeType !== undefined) {
        next.shapeType = residual.shapeType;
    }
    if (residual.styleAttribute !== undefined) {
        next.styleAttribute = residual.styleAttribute;
    }
    if (residual.fillcolor !== undefined) {
        next.fillcolor = residual.fillcolor;
    }
    if (residual.extraShapeAttributes !== undefined) {
        next.extraShapeAttributes = { ...residual.extraShapeAttributes };
    }
    if (residual.extraChildXml !== undefined) {
        next.extraChildXml = [...residual.extraChildXml];
    }
    if (residual.fillOpacity !== undefined) {
        next.fillOpacity = residual.fillOpacity;
    }
    // Clone must not copy live header-local image relationship identity
    // (requirement Clone contract / TASK-8063). Omit imageRelationshipId.
    if (residual.unresolvedImageNote !== undefined) {
        next.unresolvedImageNote = residual.unresolvedImageNote;
    }
    if (residual.extensions !== undefined) {
        next.extensions = { ...residual.extensions };
    }
    return next;
}
/**
 * Abstract logical watermark base.
 *
 * @private
 */
export abstract class Watermark {
    private readonly typeValue: WatermarkType;
    protected constructor(type: WatermarkType) {
        this.typeValue = type;
    }
    /** Discriminator matching {@link WatermarkType}. */
    get type(): WatermarkType {
        return this.typeValue;
    }
    /** Deep copy suitable for independent mutation. */
    public abstract clone(): Watermark;
}
/**
 * Text watermark authored as VML `v:shape` + `v:textpath` (TASK-8062 emit).
 *
 * Defaults (requirement table): empty text, Times New Roman, 36pt, `#808080`,
 * semitransparent `true`, Diagonal layout.
 *
 * @private
 */
export class TextWatermark extends Watermark {
    private textValue: string = '';
    private fontNameValue: string = 'Times New Roman';
    private sizeValue: number = 36;
    private colorValue: string = '#808080';
    private layoutValue: WatermarkLayout = WatermarkLayout.Diagonal;
    private widthValue: number | undefined;
    private heightValue: number | undefined;
    /**
     * Authoring path starts Opaque-or-Transparent only via this field when the
     * consumer assigns `semitransparent`. Construction default is Transparent
     * (dirty-ready default `true`) without residual Unknown.
     */
    private semitransparentState: SemitransparentState = 'transparent';
    /** Non-preset rotation degrees from parse (e.g. 45). Cleared when layout is set. */
    private customRotationDegreesValue: number | undefined;
    private parseResidualValue: WatermarkShapeResidual | undefined;
    /**
     * @param {string} text - Watermark display text.
     * @param {Object} options - Optional text styling / layout overrides.
     */
    public constructor(text?: string, options?: TextWatermarkOptions) {
        super(WatermarkType.TextWatermark);
        if (text !== undefined) {
            this.textValue = text;
        }
        if (options === undefined) {
            return;
        }
        if (options.fontName !== undefined) {
            this.fontNameValue = options.fontName;
        }
        if (options.size !== undefined) {
            assertFiniteNumber('size', options.size);
            if (options.size <= 0) {
                throw new RangeError('size must be greater than zero');
            }
            this.sizeValue = options.size;
        }
        if (options.color !== undefined) {
            this.colorValue = options.color;
        }
        if (options.semitransparent !== undefined) {
            this.semitransparentState = options.semitransparent ? 'transparent' : 'opaque';
        }
        if (options.layout !== undefined) {
            this.layoutValue = assertLayout(options.layout);
        }
        if (options.width !== undefined) {
            this.widthValue = assertOptionalPositive('width', options.width);
        }
        if (options.height !== undefined) {
            this.heightValue = assertOptionalPositive('height', options.height);
        }
    }
    /** Watermark display string (`v:textpath/@string`). */
    get text(): string {
        return this.textValue;
    }
    set text(value: string) {
        this.textValue = value;
    }
    /** Typeface name (`font-family` on `v:textpath` style). */
    get fontName(): string {
        return this.fontNameValue;
    }
    set fontName(value: string) {
        this.fontNameValue = value;
    }
    /** Font size in points. */
    get size(): number {
        return this.sizeValue;
    }
    set size(value: number) {
        assertFiniteNumber('size', value);
        if (value <= 0) {
            throw new RangeError('size must be greater than zero');
        }
        this.sizeValue = value;
    }
    /** Fill color string (e.g. `#808080`). */
    get color(): string {
        return this.colorValue;
    }
    set color(value: string) {
        this.colorValue = value;
    }
    /**
     * Whether the watermark is treated as semitransparent.
     *
     * When the internal state is Unknown (clean parse with no opacity signal),
     * the getter returns the public default `true` without dirtying residual
     * state. Assigning always records Transparent or Opaque.
     */
    get semitransparent(): boolean {
        if (this.semitransparentState === 'opaque') {
            return false;
        }
        // transparent | unknown → public default true
        return true;
    }
    set semitransparent(value: boolean) {
        this.semitransparentState = value ? 'transparent' : 'opaque';
    }
    /**
     * Layout preset (Horizontal / Diagonal).
     *
     * When a custom rotation was parsed, the getter returns `Diagonal` as a
     * non-authoritative fallback without clearing residual rotation (no dirty).
     * Assigning a layout clears custom rotation.
     */
    get layout(): WatermarkLayout {
        if (this.customRotationDegreesValue !== undefined) {
            return WatermarkLayout.Diagonal;
        }
        return this.layoutValue;
    }
    set layout(value: WatermarkLayout) {
        this.layoutValue = assertLayout(value);
        this.customRotationDegreesValue = undefined;
    }
    /** Optional explicit width in points. */
    get width(): number | undefined {
        return this.widthValue;
    }
    set width(value: number | undefined) {
        this.widthValue = assertOptionalPositive('width', value);
    }
    /** Optional explicit height in points. */
    get height(): number | undefined {
        return this.heightValue;
    }
    set height(value: number | undefined) {
        this.heightValue = assertOptionalPositive('height', value);
    }
    /**
     * @returns {SemitransparentState} The result.
     * @private
     * Expose tri-state for parse/serialize tasks without public API churn.
     */
    getSemitransparentState(): SemitransparentState {
        return this.semitransparentState;
    }
    /**
     * @param {SemitransparentState} state - The state.
     * @returns {void} Nothing is returned.
     * @private
     * Apply parse-observed opacity without forcing author defaults.
     */
    setSemitransparentState(state: SemitransparentState): void {
        this.semitransparentState = state;
    }
    /**
     * @returns {number | undefined} The result.
     * @private
     * Custom rotation degrees from style `rotation` when not 0/315.
     */
    getCustomRotationDegrees(): number | undefined {
        return this.customRotationDegreesValue;
    }
    /**
     * @param {number | undefined} degrees - The degrees.
     * @returns {void} Nothing is returned.
     * @private
     */
    setCustomRotationDegrees(degrees: number | undefined): void {
        if (degrees === undefined) {
            this.customRotationDegreesValue = undefined;
            return;
        }
        assertFiniteNumber('customRotationDegrees', degrees);
        this.customRotationDegreesValue = degrees;
    }
    /**
     * @returns {WatermarkShapeResidual | undefined} The result.
     * @private
     * Parse residual bag for clean preserve / dirty merge.
     */
    getParseResidual(): WatermarkShapeResidual | undefined {
        return this.parseResidualValue;
    }
    /**
     * @param {WatermarkShapeResidual | undefined} residual - The residual.
     * @returns {void} Nothing is returned.
     * @private
     */
    setParseResidual(residual: WatermarkShapeResidual | undefined): void {
        this.parseResidualValue = residual;
    }
    /** @inheritdoc */
    public clone(): TextWatermark {
        // exactOptionalPropertyTypes: omit optional keys when unset (do not pass undefined).
        const options: TextWatermarkOptions = {
            fontName: this.fontNameValue,
            size: this.sizeValue,
            color: this.colorValue,
            layout: this.layoutValue,
            // Pass through public boolean; then restore exact tri-state.
            semitransparent: this.semitransparentState !== 'opaque'
        };
        if (this.widthValue !== undefined) {
            options.width = this.widthValue;
        }
        if (this.heightValue !== undefined) {
            options.height = this.heightValue;
        }
        const copy: TextWatermark = new TextWatermark(this.textValue, options);
        copy.semitransparentState = this.semitransparentState;
        copy.customRotationDegreesValue = this.customRotationDegreesValue;
        copy.parseResidualValue = cloneResidual(this.parseResidualValue);
        return copy;
    }
}
/**
 * Picture watermark backed by image bytes and optional washout/scaling.
 *
 * Defaults: scaling 100, washout `true`. Bytes are defensively copied on
 * construct and {@link loadPicture}.
 *
 * @private
 */
export class PictureWatermark extends Watermark {
    private imageDataValue: Uint8Array | undefined;
    private imageTypeValue: ImageType | undefined;
    private scalingValue: number = 100;
    private washoutValue: boolean = true;
    private widthValue: number | undefined;
    private heightValue: number | undefined;
    private parseResidualValue: WatermarkShapeResidual | undefined;
    /**
     * @param {Uint8Array} imageData - Optional image bytes (defensively copied).
     * @param {Object} options - Optional picture styling overrides.
     */
    public constructor(imageData?: Uint8Array, options?: PictureWatermarkOptions) {
        super(WatermarkType.PictureWatermark);
        if (imageData !== undefined) {
            this.imageDataValue = copyBytes(imageData);
        }
        if (options === undefined) {
            return;
        }
        if (options.imageType !== undefined) {
            this.imageTypeValue = assertImageType(options.imageType);
        }
        if (options.scaling !== undefined) {
            assertFiniteNumber('scaling', options.scaling);
            if (options.scaling <= 0) {
                throw new RangeError('scaling must be greater than zero');
            }
            this.scalingValue = options.scaling;
        }
        if (options.washout !== undefined) {
            this.washoutValue = options.washout;
        }
        if (options.width !== undefined) {
            this.widthValue = assertOptionalPositive('width', options.width);
        }
        if (options.height !== undefined) {
            this.heightValue = assertOptionalPositive('height', options.height);
        }
    }
    /**
     * Image payload bytes. Getter returns a defensive copy; setter stores a copy.
     */
    get imageData(): Uint8Array | undefined {
        if (this.imageDataValue === undefined) {
            return undefined;
        }
        return copyBytes(this.imageDataValue);
    }
    set imageData(value: Uint8Array | undefined) {
        this.imageDataValue = value === undefined ? undefined : copyBytes(value);
    }
    /** Image content type when known. */
    get imageType(): ImageType | undefined {
        return this.imageTypeValue;
    }
    set imageType(value: ImageType | undefined) {
        this.imageTypeValue = value === undefined ? undefined : assertImageType(value);
    }
    /** Scale percentage (100 = natural size). */
    get scaling(): number {
        return this.scalingValue;
    }
    set scaling(value: number) {
        assertFiniteNumber('scaling', value);
        if (value <= 0) {
            throw new RangeError('scaling must be greater than zero');
        }
        this.scalingValue = value;
    }
    /** Washout (Word washed-out picture watermark). */
    get washout(): boolean {
        return this.washoutValue;
    }
    set washout(value: boolean) {
        this.washoutValue = value;
    }
    /** Optional explicit width in points. */
    get width(): number | undefined {
        return this.widthValue;
    }
    set width(value: number | undefined) {
        this.widthValue = assertOptionalPositive('width', value);
    }
    /** Optional explicit height in points. */
    get height(): number | undefined {
        return this.heightValue;
    }
    set height(value: number | undefined) {
        this.heightValue = assertOptionalPositive('height', value);
    }
    /**
     * Replace picture bytes and optional type (defensive copy).
     *
     * @param {Uint8Array} data - Image bytes.
     * @param {ImageType} imageType - Optional content type.
     * @returns {void} Nothing is returned.
     */
    public loadPicture(data: Uint8Array, imageType?: ImageType): void {
        this.imageDataValue = copyBytes(data);
        if (imageType !== undefined) {
            this.imageTypeValue = assertImageType(imageType);
        }
    }
    /**
     * @returns {WatermarkShapeResidual | undefined} The result.
     * @private
     * Parse residual bag for clean preserve / dirty merge.
     */
    getParseResidual(): WatermarkShapeResidual | undefined {
        return this.parseResidualValue;
    }
    /**
     * @param {WatermarkShapeResidual | undefined} residual - The residual.
     * @returns {void} Nothing is returned.
     * @private
     */
    setParseResidual(residual: WatermarkShapeResidual | undefined): void {
        this.parseResidualValue = residual;
    }
    /** @inheritdoc */
    public clone(): PictureWatermark {
        const options: PictureWatermarkOptions = {
            scaling: this.scalingValue,
            washout: this.washoutValue
        };
        if (this.imageTypeValue !== undefined) {
            options.imageType = this.imageTypeValue;
        }
        if (this.widthValue !== undefined) {
            options.width = this.widthValue;
        }
        if (this.heightValue !== undefined) {
            options.height = this.heightValue;
        }
        // exactOptionalPropertyTypes: only pass imageData when present.
        const copy: PictureWatermark = this.imageDataValue === undefined
            ? new PictureWatermark(undefined, options)
            : new PictureWatermark(this.imageDataValue, options);
        copy.parseResidualValue = cloneResidual(this.parseResidualValue);
        return copy;
    }
}
