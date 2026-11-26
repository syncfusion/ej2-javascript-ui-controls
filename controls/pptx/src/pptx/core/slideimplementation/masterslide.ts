import { GradientStopEditor } from '../shapes/gradient-stop-editor';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { writeSolidBackground, writeNoFillBackground, writeGradientBackground, writeBackgroundReference, clearBackgroundOverride, editBackgroundGradient } from '../presentation/write-background';
import { ColorValue } from '../theme/color-value';
/**
 * Slide master part model (`p:sldMaster`).
 *
 * Citation: Transitional `pml.xsd` `CT_SlideMaster` ~1379–1393.
 */
import { addPictureToSlide, AddPictureOptions } from '../pictures/add-picture';
import { PictureMediaAccess } from '../pictures/media-access';
import { Picture } from '../pictures/picture';
import { InvalidPackageError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { addShapeToSlide, AddShapeOptions } from '../shapes/add-shape';
import { addTextBoxToSlide, AddTextBoxOptions, ShapeBounds } from '../shapes/add-text-box';
import { AutoShapeTypeValue } from '../shapes/auto-shape-type';
import { bindShapeCollection, ShapeCollection } from '../shapes/shape-collection';
import { Shape } from '../shapes/shape';
import { walkSlideShapeTree } from '../shapes/walk';
import { ColorMapping } from '../theme/color-mapping';
import { OoxmlElement } from '../xml/index';
import { LayoutSlide } from './layoutslide';
import { HeadersFooters } from '../headers-footers/header-footer';

import { DirectSlideBackground, readDirectBackground } from '../presentation/background';
/**
 * Construction options for {@link MasterSlide}.
 *
 * @internal
 */
export interface MasterSlideOptions {
    /** Absolute OPC URI of the master part. */
    readonly partName: string;
    /** `@id` value from `p:sldMasterIdLst/p:sldMasterId` (empty string when `sldMasterIdLst` absent). */
    readonly masterIdListEntry: string;
    /** Parsed `p:clrMap` colour mapping (required by schema). */
    readonly colorMap: ColorMapping;
    /** Count of Internal `slideLayout` relationships on this master part. */
    readonly layoutCount: number;
    /** `p:txStyles` element for inheritance resolve, or `undefined`. */
    readonly txStyles: OoxmlElement | undefined;
    /** Shapes walked from `p:cSld/p:spTree` for placeholder matching. */
    readonly placeholderShapes: ReadonlyArray<Shape>;
    /** Parsed master root element (retained for {@link MasterSlide.shapes} walks). */
    readonly root: OoxmlElement;
    /** Security limits from the opened package. */
    readonly limits: SecurityLimits;
}
/**
 * A single slide master part (`p:sldMaster`) retained for the lifetime of the
 * {@link Presentation}.
 *
 * @remarks
 * The master is the top of the inheritance chain for its associated layouts and slides.
 * {@link MasterSlide.colorMap} drives scheme-colour resolve (req 008/010).
 * {@link MasterSlide.shapes} supports **add-only** mutation (`addTextBox`,
 * `addShape`, `addPicture`) into this master part's `p:spTree` (req **041**
 * ADR `2026-09-22-layout-master-shape-add`). `remove` / `removePicture` remain
 * read-only throws. Free shapes only — no `p:ph` authoring. Save flushes the
 * live master root back to package part bytes.
 *
 * Citation: Transitional `pml.xsd` `CT_SlideMaster` ~1379–1393; `CT_SlideMasterIdList`
 * ~1356–1365; `CT_SlideMasterIdListEntry` ~1366–1373;
 * `docs/specs/041-layout-master-shape-add.md`.
 */
export class MasterSlide {
    /**
     * Absolute OPC URI of the master part (e.g. `/ppt/slideMasters/slideMaster1.xml`).
     */
    readonly partName: string;
    /**
     * `@id` value from `p:sldMasterIdLst/p:sldMasterId` (preserved as-authored).
     *
     * @remarks
     * Empty string when `p:sldMasterIdLst` was absent from the presentation part
     * (fall-back ordering via relationships).
     *
     * Citation: `pml.xsd` `CT_SlideMasterIdListEntry` ~1366–1373; `@id` type
     * `ST_SlideMasterId` (unsigned int ≥ 2147483648).
     */
    readonly masterIdListEntry: string;
    /**
     * Parsed `p:clrMap` twelve-attribute colour mapping.
     *
     * @remarks
     * Required by schema (`EG_TopLevelSlide` enforces `clrMap` on masters).
     * Throws {@link Error} at open time when absent.
     *
     * Citation: `pml.xsd` `CT_ColorMapping` ~1497–1512.
     */
    readonly colorMap: ColorMapping;
    /**
     * Count of Internal `slideLayout` relationships on this master part.
     *
     * @remarks
     * Populated during load from the master's OPC relationships. Will equal the
     * number of {@link LayoutSlide} entries once TASK-1031 populates `layouts[]`.
     */
    readonly layoutCount: number;
    /**
     * `p:txStyles` element for text-style inheritance resolve.
     *
     * @internal
     *
     * @remarks
     * Used by {@link Slide.attachInheritanceSources}. Not public API — callers
     * must go through the resolve helpers on {@link Slide}.
     *
     * Citation: `pml.xsd` `CT_SlideMasterTextStyles` ~1471–1478.
     */
    readonly txStyles: OoxmlElement | undefined;
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
    private _root: OoxmlElement;
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
     */
    private readonly _layouts: LayoutSlide[] = [];
    /**
     * @internal
     * @param {MasterSlideOptions} options - Identity, colour map, shapes, and XML root.
     */
    constructor(options: MasterSlideOptions) {
        this.partName = options.partName;
        this.masterIdListEntry = options.masterIdListEntry;
        this.colorMap = options.colorMap;
        this.layoutCount = options.layoutCount;
        this.txStyles = options.txStyles;
        this.placeholderShapes = options.placeholderShapes;
        this._root = options.root;
        this._limits = options.limits;
    }
    /**
     * Attaches package-backed media access for master picture insert / resolve.
     *
     * @internal
     * @param {PictureMediaAccess} media - Master part relationship + part lookup (no network).
     * @returns {void} Nothing.
     */
    attachMediaAccess(media: PictureMediaAccess): void {
        this.mediaAccess = media;
    }
    /**
     * Attaches a mutation callback invoked when master content is mutated.
     *
     * @internal
     * @param {*} callback - Invoked after successful add* on this master.
     * @returns {void} Nothing.
     */
    attachOnMutate(callback: () => void): void {
        this.onMutate = callback;
    }
    /** Direct background authored on this master, without inheritance flattening. */
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
     * Live master root element for flush serialization.
     *
     * @internal
     * @returns {OoxmlElement} The result.
     */
    getRoot(): OoxmlElement {
        return this._root;
    }
    /**
     * Replaces the live master root when package bytes mutate outside shape APIs
     * (e.g. `p:sldLayoutIdLst` append on layout allocate).
     *
     * @internal
     * @param {OoxmlElement} root - Parsed master document element matching package bytes.
     * @returns {void} Nothing.
     */
    replaceRoot(root: OoxmlElement): void {
        this._root = root;
    }
    /**
     * Ordered list of layouts owned by this master, in `p:sldLayoutIdLst` order
     * (or Internal relationship order when `p:sldLayoutIdLst` is absent).
     *
     * @remarks Populated by `loadLayoutSlides` immediately after `loadMasterSlides` during {@link open}. The array is empty until that step
     * completes. Entries match {@link MasterSlide.layoutCount}: `layouts.length === layoutCount`. Citation: `pml.xsd` `CT_SlideMaster`
     * ~1379–1393; `CT_SlideLayoutIdList` ~1456–1467.
     * @returns {*} The result.
     */
    get layouts(): ReadonlyArray<LayoutSlide> {
        return this._layouts;
    }
    /**
     * Appends a layout to this master's layout list.
     *
     * @internal
     * @param {LayoutSlide} layout - The layout value.
     * @returns {void} Nothing.
     */
    _addLayout(layout: LayoutSlide): void {
        this._layouts.push(layout);
    }
    /**
     * Shape handles under this master's `p:spTree`, document (z-order) walk order.
     *
     * @remarks Supports {@link ShapeCollection.addTextBox}, {@link ShapeCollection.addShape}, and {@link ShapeCollection.addPicture} into
     * **this master part** (req **041**). Free shapes only — does not author `p:nvPr/p:ph`. `remove` / `removePicture` still throw
     * (slide-only under req **040**). Walk re-runs on each access. New drawing element ids use the per-part allocator (tree + this part's
     * timing). `slide.shapes` remains slide-local and does not list master-only free shapes. Citation: `pml.xsd` `CT_CommonSlideData`;
     * `docs/specs/041-layout-master-shape-add.md`.
     * @throws {Error} When `shapesPerSlide` or `groupNestingDepth` is exceeded.
     * @returns {ShapeCollection} The result.
     */
    /**
     * Header, footer, date and time, and slide number on this master.
     *
     * @remarks Direct `p:hf` and placeholders on this master part. Not a resolved view of layouts or slides.
     * @returns {HeadersFooters} Live entries.
     */
    get headersFooters(): HeadersFooters {
        return new HeadersFooters(this._root, this._limits, this.partName, this._root, this.onMutate, undefined, 'master');
    }
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
                    throw new InvalidPackageError('Picture insert requires package write access on the master',
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
            addChart: (): never => {
                throw new Error('Master slide shapes do not support addChart. Use Slide.shapes.addChart() on a slide.');
            },
            addTable: (): never => {
                throw new Error('Master slide shapes do not support addTable. Use Slide.shapes.addTable() on a slide.');
            },
            removePicture: (): never => {
                throw new Error('Master slide shapes do not support removePicture in v1. Use Slide.shapes.removePicture() on a slide.');
            },
            remove: (): never => {
                throw new Error('Master slide shapes do not support remove in v1. Use Slide.shapes.remove() on a slide.');
            }
        });
    }
}
