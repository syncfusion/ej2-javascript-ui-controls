import { GradientStopEditor } from '../shapes/gradient-stop-editor';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { writeSolidBackground, writeNoFillBackground, writeGradientBackground, writeBackgroundReference, clearBackgroundOverride, editBackgroundGradient } from '../presentation/write-background';
import { ColorValue } from '../theme/color-value';
/**
 * Slide layout part model (`p:slideLayout`).
 *
 * Citation: Transitional `pml.xsd` `CT_SlideLayout` ~1380–1406;
 * `ST_SlideLayoutType` ~1407–1455; `CT_ColorMappingOverride` ~1497–1512.
 */
import { addPictureToSlide, AddPictureOptions } from '../pictures/add-picture';
import { PictureMediaAccess } from '../pictures/media-access';
import { Picture } from '../pictures/picture';
import { InvalidPackageError } from '../security/errors';
import { addShapeToSlide, AddShapeOptions } from '../shapes/add-shape';
import { addTextBoxToSlide, AddTextBoxOptions, ShapeBounds } from '../shapes/add-text-box';
import { AutoShapeTypeValue } from '../shapes/auto-shape-type';
import { bindShapeCollection, ShapeCollection } from '../shapes/shape-collection';
import { walkSlideShapeTree } from '../shapes/walk';
import { SecurityLimits } from '../security/limits';
import { ColorMapping } from '../theme/color-mapping';
import { Shape } from '../shapes/shape';
import { OoxmlElement } from '../xml/index';
import { MasterSlide } from './masterslide';
import { DirectSlideBackground, readDirectBackground } from '../presentation/background';
/**
 * Construction options for {@link LayoutSlide}.
 *
 * @internal
 */
export interface LayoutSlideOptions {
    /** Absolute OPC URI of the layout part (e.g. `/ppt/slideLayouts/slideLayout1.xml`). */
    readonly partName: string;
    /**
     * `@type` attribute of `p:slideLayout` (`ST_SlideLayoutType`).
     * `undefined` when the attribute is absent.
     */
    readonly type: string | undefined;
    /**
     * `p:cSld/@name` — human-readable layout name.
     * `undefined` when absent.
     */
    readonly name: string | undefined;
    /**
     * Whether master decorative shapes should be shown with this layout.
     * Defaults to `true` per schema when `@showMasterSp` is absent.
     */
    readonly showMasterShapes: boolean;
    /**
     * Effective colour map override from `p:clrMapOvr/a:overrideClrMapping`.
     * `undefined` when absent or when `a:masterClrMapping` is present (master passthrough).
     */
    readonly colorMapOverride: ColorMapping | undefined;
    /**
     * Shapes walked from `p:cSld/p:spTree` for placeholder matching.
     *
     * @internal
     */
    readonly placeholderShapes: ReadonlyArray<Shape>;
    /** Back-reference to the owning `MasterSlide`. */
    readonly master: MasterSlide;
    /** Parsed layout root element retained for {@link LayoutSlide.shapes} walks. */
    readonly root: OoxmlElement;
    /** Security limits from the opened package. */
    readonly limits: SecurityLimits;
}
/**
 * A single slide layout part (`p:slideLayout`) retained for the lifetime of the
 * {@link Presentation}.
 *
 * @remarks
 * The layout sits between a slide and its master in the inheritance chain.
 * {@link LayoutSlide.shapes} supports **add-only** mutation (`addTextBox`,
 * `addShape`, `addPicture`) into this layout part’s `p:spTree` (req **041**
 * ADR `2026-09-22-layout-master-shape-add`). `remove` / `removePicture` remain
 * read-only throws. Free shapes only — no `p:ph` authoring. Save flushes the
 * live layout root back to package part bytes.
 *
 * Citation: Transitional `pml.xsd` `CT_SlideLayout` ~1380–1406;
 * `docs/specs/041-layout-master-shape-add.md`.
 */
export class LayoutSlide {
    /**
     * Absolute OPC URI of the layout part (e.g. `/ppt/slideLayouts/slideLayout1.xml`).
     */
    readonly partName: string;
    /**
     * `@type` attribute of `p:slideLayout` (`ST_SlideLayoutType`), as-authored.
     *
     * @remarks
     * `undefined` when the `@type` attribute is absent from the layout root element.
     * Representative values: `'blank'`, `'title'`, `'obj'`, `'titleOnly'`,
     * `'twoObj'`, `'tx'`, etc.
     *
     * Citation: `pml.xsd` `ST_SlideLayoutType` ~1407–1455.
     */
    readonly type: string | undefined;
    /**
     * `p:cSld/@name` — human-readable layout name, as-authored.
     *
     * @remarks
     * `undefined` when the `@name` attribute is absent.
     * Common values: `'Title Slide'`, `'Title and Content'`, `'Blank'`, etc.
     */
    readonly name: string | undefined;
    /**
     * Whether master decorative shapes are shown behind this layout.
     *
     * @remarks
     * Reflects `p:slideLayout/@showMasterSp`. Defaults to `true` per schema when
     * the attribute is absent.
     *
     * Citation: `pml.xsd` `AG_ChildSlide` ~1371.
     */
    readonly showMasterShapes: boolean;
    /**
     * Effective colour map override from `p:clrMapOvr/a:overrideClrMapping`, if present.
     *
     * @remarks
     * `undefined` when no `p:clrMapOvr` exists on this layout, or when
     * `a:masterClrMapping` is present (meaning the layout defers to the master map).
     * When defined, this map takes precedence over the master `p:clrMap` for slides
     * referencing this layout.
     *
     * Citation: `pml.xsd` `CT_ColorMappingOverride` ~1497–1512.
     */
    readonly colorMapOverride: ColorMapping | undefined;
    /**
     * Back-reference to the owning {@link MasterSlide}.
     *
     * @remarks
     * Resolved via the Internal `slideMaster` relationship on this layout part.
     * Circular layout→master→layout references are rejected at open time.
     */
    readonly master: MasterSlide;
    /**
     * Shapes walked from `p:cSld/p:spTree` for placeholder matching.
     *
     * @internal
     *
     * @remarks
     * Used by {@link Slide.attachPlaceholderIndexes}. Not public API — callers
     * must go through {@link Slide.matchPlaceholder}.
     */
    readonly placeholderShapes: ReadonlyArray<Shape>;
    /**
     * @internal
     */
    private readonly _root: OoxmlElement;
    /**
     * @internal
     */
    private readonly _limits: SecurityLimits;
    /**
     * @internal
     */
    private mediaAccess: PictureMediaAccess | undefined;
    /**
     * @internal
     */
    private onMutate: (() => void) | undefined;
    /**
     * @internal
     * @param {LayoutSlideOptions} options - Identity, colour map override, shapes, master ref, and XML root.
     */
    constructor(options: LayoutSlideOptions) {
        this.partName = options.partName;
        this.type = options.type;
        this.name = options.name;
        this.showMasterShapes = options.showMasterShapes;
        this.colorMapOverride = options.colorMapOverride;
        this.placeholderShapes = options.placeholderShapes;
        this.master = options.master;
        this._root = options.root;
        this._limits = options.limits;
    }
    /**
     * Attaches package-backed media access for layout picture insert / resolve.
     *
     * @internal
     * @param {PictureMediaAccess} media - Layout part relationship + part lookup (no network).
     * @returns {void} Nothing.
     */
    attachMediaAccess(media: PictureMediaAccess): void {
        this.mediaAccess = media;
    }
    /**
     * Attaches a mutation callback invoked when layout content is mutated.
     *
     * @internal
     * @param {*} callback - Invoked after successful add* on this layout.
     * @returns {void} Nothing.
     */
    attachOnMutate(callback: () => void): void {
        this.onMutate = callback;
    }
    /** Direct background authored on this layout, without master inheritance. */
    get background(): DirectSlideBackground {
        return readDirectBackground(this._root, this.mediaAccess);
    }
    /**
     * Writes a gradient background on this explicit host only.
     *
     * @remarks Retains existing bgPr shadeToTitle, effects and extensions. Other levels remain unchanged.
     * @param {GradientFillOptions} options - Validated replacement; positions are ratios and angles degrees.
     * @returns {void} Mutates after complete input validation.
     * @throws Invalid host or gradient input, with part/property identity.
     * @example host.setGradientBackground({ stops: [
     *   { position: 0, color: { kind: 'scheme', val: 'accent1' } },
     *   { position: 1, color: { kind: 'srgb', val: 'FFFFFF' } }
     * ], shade: { kind: 'linear', angle: 45 } });
     */
    setGradientBackground(options: GradientFillOptions): void {
        if (writeGradientBackground(this._root, options, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Replaces direct background paint with an authored solid color, preserving independent metadata.
     *
     * @param {ColorValue} color - Direct color choice; scheme references remain references.
     * @returns {void} Validates before changing the source background choice.
     */
    setSolidBackground(color: ColorValue): void {
        if (writeSolidBackground(this._root, color, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /** @returns {void} Writes explicit noFill to block inherited background paint; use clearBackground to restore inheritance. */
    setNoFillBackground(): void {
        if (writeNoFillBackground(this._root, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Replaces this host's background choice with a theme matrix reference.
     *
     * @remarks Intentionally replaces the old bgPr subtree, including its effects. No resolved RGB is written.
     * @param {number} index - Unsigned 32-bit matrix index, including sentinel values.
     * @param {ColorValue} color - Required authored reference color choice.
     * @returns {void} Mutates after validation.
     * @throws Invalid host, index or color, with part/property identity.
     */
    setBackgroundReference(index: number, color: ColorValue): void {
        if (writeBackgroundReference(this._root, index, color, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Removes this host's direct background to restore inheritance.
     *
     * @remarks Removes the entire direct bg subtree. An already absent override is a no-op.
     * @returns {void} Mutates only when an override exists.
     * @throws Unsupported or malformed host.
     */
    clearBackground(): void {
        if (clearBackgroundOverride(this._root, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Opens a selective editor for this host's existing direct background gradient.
     *
     * @remarks An inherited gradient needs an explicit override before editing.
     * @returns {GradientStopEditor} Bound session; dispose after use.
     * @throws Missing direct gradient or unsupported host.
     */
    editGradientBackground(): GradientStopEditor {
        return editBackgroundGradient((): OoxmlElement => this._root, this.partName, (): void => {
            if (this.onMutate) { this.onMutate(); }
        });
    }


    /**
     * Live layout root element for flush serialization.
     *
     * @internal
     * @returns {OoxmlElement} The result.
     */
    getRoot(): OoxmlElement {
        return this._root;
    }
    /**
     * Shape handles under this layout's `p:spTree`, document (z-order) walk order.
     *
     * @remarks Supports {@link ShapeCollection.addTextBox}, {@link ShapeCollection.addShape}, and {@link ShapeCollection.addPicture} into
     * **this layout part** (req **041**). Free shapes only — does not author `p:nvPr/p:ph`. `remove` / `removePicture` still throw
     * (slide-only under req **040**). New drawing element ids use {@link allocateNextDrawingElementId} on this layout root (tree + this
     * part’s timing). `slide.shapes` remains slide-local and does not list layout-only free shapes. `shapesPerSlide` and
     * `groupNestingDepth` security limits apply identically to slide shape walks (template loads lift the shape cap — see load path).
     * Citation: `pml.xsd` `CT_CommonSlideData`; `docs/specs/041-layout-master-shape-add.md`.
     * @throws {Error} When `shapesPerSlide` or `groupNestingDepth` is exceeded.
     * @returns {ShapeCollection} The result.
     */
    get shapes(): ShapeCollection {
        return bindShapeCollection(() => walkSlideShapeTree(this._root, this._limits, this.partName, this.mediaAccess, this.onMutate), {
            addTextBox: (options?: AddTextBoxOptions): Shape => {
                const args: {
                    root: OoxmlElement;
                    limits: SecurityLimits;
                    partName: string;
                    media?: PictureMediaAccess;
                    options?: AddTextBoxOptions;
                    onMutate?: () => void;
                } = {
                    root: this._root,
                    limits: this._limits,
                    partName: this.partName
                };
                if (this.mediaAccess !== undefined) {
                    args.media = this.mediaAccess;
                }
                if (options !== undefined) {
                    args.options = options;
                }
                if (this.onMutate !== undefined) {
                    args.onMutate = this.onMutate;
                }
                return addTextBoxToSlide(args);
            },
            addShape: (type: AutoShapeTypeValue, bounds: ShapeBounds, options?: AddShapeOptions): Shape => {
                const args: {
                    root: OoxmlElement;
                    limits: SecurityLimits;
                    partName: string;
                    media?: PictureMediaAccess;
                    type: AutoShapeTypeValue;
                    bounds: ShapeBounds;
                    options?: AddShapeOptions;
                    onMutate?: () => void;
                } = {
                    root: this._root,
                    limits: this._limits,
                    partName: this.partName,
                    type,
                    bounds
                };
                if (this.mediaAccess !== undefined) {
                    args.media = this.mediaAccess;
                }
                if (options !== undefined) {
                    args.options = options;
                }
                if (this.onMutate !== undefined) {
                    args.onMutate = this.onMutate;
                }
                return addShapeToSlide(args);
            },
            addPicture: (options: AddPictureOptions): Picture => {
                if (this.mediaAccess === undefined || this.mediaAccess.write === undefined) {
                    throw new InvalidPackageError('Picture insert requires package write access on the layout',
                                                  { partName: this.partName });
                }
                const args: {
                    root: OoxmlElement;
                    limits: SecurityLimits;
                    partName: string;
                    media: PictureMediaAccess;
                    options: AddPictureOptions;
                    onMutate?: () => void;
                } = {
                    root: this._root,
                    limits: this._limits,
                    partName: this.partName,
                    media: this.mediaAccess,
                    options
                };
                if (this.onMutate !== undefined) {
                    args.onMutate = this.onMutate;
                }
                return addPictureToSlide(args);
            },
            removePicture: (): never => {
                throw new Error('Layout slide shapes do not support removePicture in v1. Use Slide.shapes.removePicture() on a slide.');
            },
            remove: (): never => {
                throw new Error('Layout slide shapes do not support remove in v1. Use Slide.shapes.remove() on a slide.');
            }
        });
    }
}
