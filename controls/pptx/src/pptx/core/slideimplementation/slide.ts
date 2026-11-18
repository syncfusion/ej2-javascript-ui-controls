import { GradientBackgroundCopy, captureGradientBackgroundCopy, readGradientBackgroundCopy } from '../presentation/gradient-background-copy';
import { writeCopiedGradientBackground } from '../presentation/write-background';
import { AuthoredGradientFill } from '../theme/gradient-types';
import { ScopedElementSource, cloneScopedElement, scopedElementPath, ScopedCloneError } from '../xml/clone-scoped-element';
import { selectGradientStyleSource, GradientStyleSource } from '../theme/materialize-gradient-style';
import { uniqueGradientChild } from '../shapes/gradient-materialization-dom';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { parseXml } from '../xml/dom';
import { materializeBackgroundGradient, BackgroundMaterializationSource } from '../presentation/materialize-background-gradient';
import { materializeShapeGradient, GradientMaterializationSource } from '../shapes/materialize-shape-gradient';
import { resolveHostTextFills, TextFillTarget } from '../resolve/text-fill-host';
import { EffectiveTextCharacterFills } from '../resolve/resolve-text-fills';
import { GradientStopEditor } from '../shapes/gradient-stop-editor';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { writeSolidBackground, writeNoFillBackground, writeGradientBackground, writeBackgroundReference, clearBackgroundOverride, editBackgroundGradient } from '../presentation/write-background';
import { ColorValue } from '../theme/color-value';
import { GradientHostResult, GradientBackgroundSource, resolveShapeGradientHost,
    resolveGradientBackgroundHost } from '../resolve/gradient-hosts';
import { ThemePart } from '../theme/theme-part';
import { readUseBgFill } from '../shapes/read-fill-line';
import { arrayAt } from '../util/es5-compat';
/**
 * Slide part model bound to a presentation `p:sldId` entry.
 */
import { addPictureToSlide, AddPictureOptions } from '../pictures/add-picture';
import { PictureMediaAccess } from '../pictures/media-access';
import { Picture } from '../pictures/picture';
import { removePictureFromSlide } from '../pictures/remove-picture';
import { removeShapeFromSlide } from '../shapes/remove-shape';
import { buildPlaceholderIndex, matchPlaceholderShape, placeholderMatchKey, PlaceholderIndex } from '../placeholders/match';
import { PlaceholderMatch, PlaceholderInfo } from '../placeholders/placeholder-info';
import { resolveParagraphStyle as resolveParagraphStylePure, resolveRunStyle as resolveRunStylePure,
    resolveTransform as resolveTransformPure, ResolveContext } from '../resolve/resolve-style';
import { ResolvedTextStyle, ResolvedTransform } from '../resolve/types';
import { Presentation } from '../package/presentation';
import { PackageRelationship } from '../package/relationships';
import { isRegisteredCommentRelType } from '../registry/feature-registry';
import { InvalidPackageError } from '../security/errors';
import { LayoutSlide } from './layoutslide';
import { addShapeToSlide, AddShapeOptions } from '../shapes/add-shape';
import { addTextBoxToSlide, AddTextBoxOptions, ShapeBounds } from '../shapes/add-text-box';
import { AutoShapeTypeValue } from '../shapes/auto-shape-type';
import { ShapeNotFoundError } from '../shapes/errors';
import { bindShapeCollection, ShapeCollection } from '../shapes/shape-collection';
import { walkSlideShapeTree } from '../shapes/walk';
import { Shape } from '../shapes/shape';
import { TextPart } from '../text/text-part';
import { SecurityLimits } from '../security/limits';
import { findAllRegExpOnSlide, findAllStringOnSlide, findRegExpOnSlide, findStringOnSlide } from '../text/find/find-on-slide';
import { TextFindMatch } from '../text/find/text-find-match';
import { ColorMapping } from '../theme/color-mapping';
import { ColorScheme } from '../theme/color-scheme';
import { EffectiveColorContext } from '../theme/resolve-color';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/index';
import { DirectSlideBackground, readDirectBackground, ResolvedSlideBackground, resolveBackground } from '../presentation/background';
import { addChart, AddChartOptions } from '../../features/charts/add-chart';
import { Chart } from '../../features/charts/chart';
import { Charts, chartsForSlide } from '../../features/charts/charts';
import { removeChart } from '../../features/charts/remove-chart';
import { addTable, AddTableOptions } from '../../features/tables/add-table';
import { removeTable } from '../../features/tables/remove-table';
import { Table } from '../../features/tables/table';
import { addNotesSlide } from '../../features/notes/attach-notes';
import { NotesSlide } from '../../features/notes/notes-slide';
export { hasAnimationTargets } from './animation-targets';

/**
 * A single slide resolved from `p:sldIdLst` / presentation relationships.
 *
 * @remarks
 * Order of slides on {@link Presentation.slides} follows `p:sldIdLst` only —
 * never filesystem or part-name sort order. The absolute part URI is identity for
 * the part; reordering (future) must not rename parts to change order.
 *
 * {@link Slide.shapes} walks `p:cSld/p:spTree` on each access so in-place text
 * mutations stay visible without a separate refresh step.
 *
 * {@link Slide.effectiveColorMap} is the slide's resolved `CT_ColorMapping`
 * (master map, or slide `overrideClrMapping` when present). Scheme colour
 * resolve via {@link Presentation.resolveSchemeColor} is **view-only**
 * and never writes RGB over authored `a:schemeClr`.
 *
 * Placeholder matching ({@link Slide.matchPlaceholder}) pairs slide `p:ph`
 * shapes to layout/master by type+idx after XSD defaults.
 *
 * Style inheritance ({@link Slide.resolveRunStyle}, {@link Slide.resolveParagraphStyle},
 * {@link Slide.resolveTransform}) returns **view DTOs** only — never aliases direct
 * markup and never flattens resolved values into the package on save.
 *
 * `find` / `findAll` search **this slide only** (shape `txBody` and table cell text).
 * Notes, masters, and layouts are out of scope for Phase 7. Find does not mutate
 * the package.
 *
 * Citation: Transitional `pml.xsd` `CT_SlideMasterTextStyles`; eng-ref chain
 * shape → layout ph → master ph → txStyles → defaultTextStyle → theme.
 */
export class Slide {
    /**
     * Absolute OPC URI of the slide part (e.g. `/ppt/slides/slide1.xml`).
     */
    readonly partName: string;
    /**
     * Value of `p:sldId/@id` (`ST_SlideId`) as authored in the presentation part.
     * Preserved as the attribute string for exact round-trip.
     */
    readonly slideId: string;
    /**
     * Value of `p:sldId/@r:id` — relationship Id into the presentation relationships part.
     */
    readonly relationshipId: string;
    /**
     * @internal
     */
    private root: OoxmlElement;
    /**
     * @internal
     */
    private readonly limits: SecurityLimits;
    /**
     * Effective colour map for this slide (master ± `clrMapOvr`).
     *
     * @remarks
     * `undefined` when the package has no slide master `p:clrMap` to inherit.
     * Distinct from theme `clrScheme` slot colours ({@link ThemePart.getSlot}).
     */
    readonly effectiveColorMap: ColorMapping | undefined;
    /**
     * @internal
     */
    private layoutPlaceholderIndex: PlaceholderIndex | undefined;
    /**
     * @internal
     */
    private masterPlaceholderIndex: PlaceholderIndex | undefined;
    /**
     * @internal
     */
    private masterTxStyles: OoxmlElement | undefined;
    /**
     * @internal
     */
    private defaultTextStyle: OoxmlElement | undefined;
    /**
     * @internal
     */
    private mediaAccess: PictureMediaAccess | undefined;
    /**
     * @internal
     */
    private _layoutPartName: string | undefined;
    /**
     * @internal
     */
    private _layoutsByPartName: Map<string, LayoutSlide> | undefined;
    /**
     * @internal
     */
    private _partRels: ReadonlyArray<PackageRelationship> = Object.freeze([]);
    /**
     * @internal
     */
    private onMutate: (() => void) | undefined;
    /**
     * @internal
     */
    private getSiblingSlides: (() => ReadonlyArray<Slide>) | undefined;
    /**
     * @internal
     */
    private presentation: Presentation | undefined;
    /**
     * @internal
     * @param {*} options - The options value.
     * @param {string} options.partName - Slide part name.
     * @param {string} options.slideId - Slide id.
     * @param {string} options.relationshipId - Relationship id.
     * @param {*} options.root - Slide root element.
     * @param {*} options.limits - Security limits.
     * @param {*} [options.effectiveColorMap] - Effective color map.
     * @param {string} [options.layoutPartName] - Layout part name.
     */
    constructor(options: {
        readonly partName: string;
        readonly slideId: string;
        readonly relationshipId: string;
        readonly root: OoxmlElement;
        readonly limits: SecurityLimits;
        readonly effectiveColorMap?: ColorMapping;
        readonly layoutPartName?: string;
    }) {
        this.partName = options.partName;
        this.slideId = options.slideId;
        this.relationshipId = options.relationshipId;
        this.root = options.root;
        this.limits = options.limits;
        this.effectiveColorMap = options.effectiveColorMap;
        this._layoutPartName = options.layoutPartName;
    }
    /**
     * Whether PowerPoint marks this slide hidden from slide-show playback.
     *
     * @remarks Missing `show` state defaults to visible. Authored `false` and
     * `0` are hidden; all other values remain visible and round-trip unchanged.
     * @returns {boolean} True when hidden.
     */
    get isHidden(): boolean {
        for (let i: number = 0; i < this.root.attributes.length; i++) {
            const attribute: OoxmlAttribute = arrayAt(this.root.attributes, i);
            if (attribute.namespaceUri === '' && attribute.localName === 'show') {
                return attribute.value === '0' || attribute.value.toLowerCase() === 'false';
            }
        }
        return false;
    }
    /**
     * Whether master and layout shapes participate in this slide's render stack.
     *
     * @remarks Reflects `p:sld/@showMasterSp`. The schema default is `true`;
     * authored `0` and `false` both disable inherited shapes. This direct flag
     * is kept separate from layout-level `showMasterSp`.
     * @returns {boolean} True when inherited master/layout shapes are shown.
     */
    get showMasterShapes(): boolean {
        for (let i: number = 0; i < this.root.attributes.length; i++) {
            const attribute: OoxmlAttribute = arrayAt(this.root.attributes, i);
            if (attribute.namespaceUri === '' && attribute.localName === 'showMasterSp') {
                return attribute.value !== '0' && attribute.value.toLowerCase() !== 'false';
            }
        }
        return true;
    }
    /** Direct background authored on this slide, without inherited values. */
    get background(): DirectSlideBackground {
        return readDirectBackground(this.root, this.mediaAccess);
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
        if (writeGradientBackground(this.root, options, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Replaces direct background paint with an authored solid color, preserving independent metadata.
     *
     * @param {ColorValue} color - Direct color choice; scheme references remain references.
     * @returns {void} Validates before changing the source background choice.
     */
    setSolidBackground(color: ColorValue): void {
        if (writeSolidBackground(this.root, color, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /** @returns {void} Writes explicit noFill to block inherited background paint; use clearBackground to restore inheritance. */
    setNoFillBackground(): void {
        if (writeNoFillBackground(this.root, this.partName) && this.onMutate) { this.onMutate(); }
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
        if (writeBackgroundReference(this.root, index, color, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Removes this host's direct background to restore inheritance.
     *
     * @remarks Removes the entire direct bg subtree. An already absent override is a no-op.
     * @returns {void} Mutates only when an override exists.
     * @throws Unsupported or malformed host.
     */
    clearBackground(): void {
        if (clearBackgroundOverride(this.root, this.partName) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Opens a selective editor for this host's existing direct background gradient.
     *
     * @remarks An inherited gradient needs an explicit override before editing.
     * @returns {GradientStopEditor} Bound session; dispose after use.
     * @throws Missing direct gradient or unsupported host.
     */
    editGradientBackground(): GradientStopEditor {
        return editBackgroundGradient((): OoxmlElement => this.root, this.partName, (): void => {
            if (this.onMutate) { this.onMutate(); }
        });
    }


    /**
     * Source-aware background view following slide → layout → master.
     *
     * @remarks The returned direct value is not written back and theme references
     * remain references rather than flattened colours.
     */
    get resolvedBackground(): ResolvedSlideBackground {
        const layout: LayoutSlide = this._layoutPartName === undefined || this._layoutsByPartName === undefined
            ? undefined : this._layoutsByPartName.get(this._layoutPartName);
        return resolveBackground(
            this.background,
            layout === undefined ? undefined : layout.background,
            layout === undefined ? undefined : layout.master.background
        );
    }
    /**
     * Resolves a shape gradient through its direct style and matched placeholders.
     *
     * @remarks Read-only. Missing/reset, explicit no-fill, non-gradient and invalid
     * reference results remain distinct. Scheme colors and defaults are view data,
     * never written into the shape. Unsupported color operations remain diagnostics.
     * @param {Shape} shape - Shape belonging to this slide.
     * @returns {GradientHostResult} Effective gradient fields, colors and provenance.
     * @example const fill = slide.resolveGradientFill(slide.shapes[0]);
     */
    resolveGradientFill(shape: Shape): GradientHostResult {
        if (readUseBgFill(shape.getElement())) { return this.resolveGradientBackground(); }
        const theme: ThemePart | undefined = this.gradientTheme();
        const colors: EffectiveColorContext | undefined = theme === undefined || this.presentation === undefined ?
            undefined : this.presentation.getColorContext(this);
        return resolveShapeGradientHost(
            shape, this.buildResolveContext(shape, colors), theme === undefined ? undefined : theme.gradientStyles
        );
    }
    /**
     * Inspects the authored local override that a selective edit would create.
     *
     * @remarks Does not publish an override, notify mutation or change shared sources.
     * The result is planned local source data, distinct from this shape's direct fill
     * and from effective/defaulted paint. Unsupported localization throws unchanged.
     * @param {Shape} shape - Exact live shape belonging to this slide.
     * @returns {AuthoredGradientFill} Independent planned authored fill snapshot.
     */
    inspectGradientFillOverride(shape: Shape): AuthoredGradientFill {
        const path: OoxmlElement[] = scopedElementPath({ root: this.root, node: shape.getElement() }, this.limits, this.partName);
        const snapshot: Slide = this.gradientOverrideSnapshot();
        let node: OoxmlElement = snapshot.root;
        for (let index: number = 1; index < path.length; index++) {
            const originalParent: OoxmlElement = arrayAt(path, index - 1);
            const childIndex: number = originalParent.children.indexOf(arrayAt(path, index));
            const child: OoxmlElement | OoxmlText = arrayAt(node.children, childIndex);
            if (child.kind !== 'element') { throw new ScopedCloneError('override-snapshot-target', this.partName); }
            node = child;
        }
        const target: Shape | undefined = snapshot.shapes.find((value: Shape): boolean => value.getHostElement() === node); 
        if (!target) { throw new ScopedCloneError('override-snapshot-target', this.partName); }
        snapshot.materializeGradientFill(target);
        const editor: GradientStopEditor = target.editGradientFill();
        try { return editor.fill; } finally { editor.dispose(); }
    }
    /**
     * Captures an independent authored background gradient for same-document copying.
     *
     * @remarks Localizes inherited/theme source in a detached snapshot. Symbolic colors,
     * raw presence and unknown gradient metadata remain intact; no checked RGB/defaults
     * are baked. Relationship-bearing extensions require a separate copy policy.
     * @returns {GradientBackgroundCopy} Opaque immutable copy; no live document/XML handle.
     */
    captureGradientBackground(): GradientBackgroundCopy {
        const snapshot: Slide = this.gradientOverrideSnapshot(); snapshot.materializeGradientBackground();
        const common: OoxmlElement | undefined = uniqueGradientChild(snapshot.root, snapshot.root.namespaceUri, 'cSld');
        const background: OoxmlElement | undefined = common && uniqueGradientChild(common, snapshot.root.namespaceUri, 'bg');
        const properties: OoxmlElement | undefined = background && uniqueGradientChild(background, snapshot.root.namespaceUri, 'bgPr');
        const ns: string | undefined = getGradientDrawingNamespace(snapshot.root.namespaceUri);
        const gradient: OoxmlElement | undefined = properties && ns ? uniqueGradientChild(properties, ns, 'gradFill') : undefined;
        if (!gradient) { throw new ScopedCloneError('gradient-copy-source', this.partName); }
        return captureGradientBackgroundCopy(this.presentation || this.root, snapshot.root, gradient, this.partName, this.limits);
    }
    /**
     * Applies a captured same-document gradient to this slide's local background fill.
     *
     * @remarks Existing direct background wrapper flags/effects are retained. Shared
     * layouts/masters/themes are unchanged. Foreign/forged copies and unsafe scopes
     * fail before mutation. Theme references remain symbolic and use this slide's context.
     * @param {GradientBackgroundCopy} copy - Snapshot captured before the batch begins.
     * @returns {void} Publishes one validated local fill mutation.
     */
    applyGradientBackgroundCopy(copy: GradientBackgroundCopy): void {
        const ns: string | undefined = getGradientDrawingNamespace(this.root.namespaceUri);
        if (!ns) { throw new ScopedCloneError('gradient-copy-target', this.partName); }
        const fill: OoxmlElement = readGradientBackgroundCopy(copy, this.presentation || this.root, this.partName, ns, this.limits);
        if (writeCopiedGradientBackground(this.root, fill, this.partName, this.limits) && this.onMutate) { this.onMutate(); }
    }
    /**
     * Inspects planned local authored background source without changing the slide.
     *
     * @returns {AuthoredGradientFill} Independent planned authored background.
     */
    inspectGradientBackgroundOverride(): AuthoredGradientFill {
        const snapshot: Slide = this.gradientOverrideSnapshot();
        snapshot.materializeGradientBackground();
        const editor: GradientStopEditor = snapshot.editGradientBackground();
        try { return editor.fill; } finally { editor.dispose(); }
    }
    /** Builds a detached slide while retaining only read-only inherited source context.
     *
     * @returns {Slide} Private snapshot with no live mutation callback. */
    private gradientOverrideSnapshot(): Slide {
        const source: ScopedElementSource = { root: this.root, node: this.root, partName: this.partName };
        const root: OoxmlElement = cloneScopedElement(source, { partName: this.partName, limits: this.limits });
        const snapshot: Slide = new Slide({ root, partName: this.partName, slideId: this.slideId,
            relationshipId: this.relationshipId, limits: this.limits, effectiveColorMap: this.effectiveColorMap,
            layoutPartName: this._layoutPartName });
        snapshot._layoutsByPartName = this._layoutsByPartName;
        snapshot.layoutPlaceholderIndex = this.layoutPlaceholderIndex;
        snapshot.masterPlaceholderIndex = this.masterPlaceholderIndex;
        snapshot.presentation = this.presentation;
        return snapshot;
    }
    /**
     * Creates a local authored gradient override before selective shape editing.
     *
     * @remarks Copies direct/layout/master XML without resolving scheme colors to RGB.
     * Shared sources remain unchanged. Unsupported group ownership or
     * unsafe XML-copy context throws before mutation; a complete local list is a no-op.
     * @param {Shape} shape - Exact live shape belonging to this slide.
     * @returns {boolean} Whether an override was created (and mutation notified once).
     */
    materializeGradientFill(shape: Shape): boolean {
        const target: GradientMaterializationSource = {
            id: 'direct', root: this.root, shape: shape.getElement(), partName: this.partName
        };
        const sources: GradientMaterializationSource[] = [target];
        const context: ResolveContext = this.buildResolveContext(shape, undefined);
        const layout: LayoutSlide | undefined = this._layoutPartName === undefined || this._layoutsByPartName === undefined ?
            undefined : this._layoutsByPartName.get(this._layoutPartName);
        if (layout !== undefined) {
            if (context.layoutShape !== undefined) { sources.push({ id: 'layout', root: layout.getRoot(),
                shape: context.layoutShape.getElement(), partName: layout.partName }); }
            if (context.masterShape !== undefined) { sources.push({ id: 'master', root: layout.master.getRoot(),
                shape: context.masterShape.getElement(), partName: layout.master.partName }); }
        }
        const selected: GradientHostResult = this.resolveGradientFill(shape);
        this.appendMaterializationStyles(sources, selected);
        const changed: boolean = materializeShapeGradient(target, sources, selected, this.limits);
        if (changed && this.onMutate) { this.onMutate(); }
        return changed;
    }
    /**
     * Adds only resolver-selected theme tiers, never unrelated or unavailable styles.
     *
     * @param {GradientMaterializationSource[]} sources - Matched authored shape tiers.
     * @param {GradientHostResult} selected - Canonical gradient selection.
     * @returns {void} Appends actual theme XML and its original reference-color scope.
     */
    private appendMaterializationStyles(sources: GradientMaterializationSource[], selected: GradientHostResult): void {
        if (selected.kind !== 'gradient') { return; }
        const theme: ThemePart | undefined = this.gradientTheme();
        const part: ReturnType<Presentation['getPart']> = theme === undefined || this.presentation === undefined ?
            undefined : this.presentation.getPart(theme.partName);
        if (!theme || !part) { return; }
        let root: OoxmlElement | undefined;
        for (const source of sources.slice()) {
            const id: string = source.id === 'direct' ? 'style' : source.id + '-style';
            if (selected.source !== id && (selected.gradient.stops.source.kind !== 'source' ||
                selected.gradient.stops.source.id !== id)) { continue; }
            const style: OoxmlElement | undefined = uniqueGradientChild(source.shape, source.shape.namespaceUri, 'style');
            const ns: string | undefined = getGradientDrawingNamespace(source.shape.namespaceUri);
            const reference: OoxmlElement | undefined = style && ns ? uniqueGradientChild(style, ns, 'fillRef') : undefined;
            if (!reference) { continue; }
            if (root === undefined) {
                root = parseXml(new TextDecoder().decode(part.data), { limits: this.limits, partName: theme.partName });
            }
            const referenceSource: ScopedElementSource = { root: source.root, node: reference, partName: source.partName };
            const authored: GradientStyleSource = selectGradientStyleSource(root, referenceSource);
            sources.push({ id, root, shape: source.shape, partName: theme.partName,
                gradient: authored.gradient, reference: authored.reference });
        }
    }
    /**
     * Resolves gradient background data through slide, layout and master.
     *
     * @remarks Explicit no-fill and invalid references block fallback. A missing
     * background reaches the existing white fallback. shadeToTitle is independent
     * metadata; its title-dependent rendering is not performed by this read API.
     * @returns {GradientHostResult} Effective background gradient or explicit alternative.
     * @example const background = slide.resolveGradientBackground();
     */
    resolveGradientBackground(): GradientHostResult {
        const sources: GradientBackgroundSource[] = [{ id: 'slide', root: this.root, partName: this.partName }];
        const layout: LayoutSlide | undefined = this._layoutPartName === undefined || this._layoutsByPartName === undefined ?
            undefined : this._layoutsByPartName.get(this._layoutPartName);
        if (layout !== undefined) {
            sources.push({ id: 'layout', root: layout.getRoot(), partName: layout.partName });
            sources.push({ id: 'master', root: layout.master.getRoot(), partName: layout.master.partName });
        }
        const theme: ThemePart | undefined = this.gradientTheme();
        return resolveGradientBackgroundHost(
            sources, theme === undefined ? undefined : theme.gradientStyles,
            theme === undefined || this.presentation === undefined ? undefined : this.presentation.getColorContext(this)
        );
    }
    /**
     * Creates an independent local background gradient before selective editing.
     *
     * @remarks Retains authored colors, background flags, effects and unknown XML.
     * Shared layout/master parts are unchanged; unsupported copy contexts fail atomically.
     * @returns {boolean} Whether a local override was published.
     */
    materializeGradientBackground(): boolean {
        const target: GradientBackgroundSource = { id: 'slide', root: this.root, partName: this.partName };
        const sources: BackgroundMaterializationSource[] = [target];
        const layout: LayoutSlide | undefined = this._layoutPartName === undefined || this._layoutsByPartName === undefined ?
            undefined : this._layoutsByPartName.get(this._layoutPartName);
        if (layout !== undefined) {
            sources.push({ id: 'layout', root: layout.getRoot(), partName: layout.partName });
            sources.push({ id: 'master', root: layout.master.getRoot(), partName: layout.master.partName });
        }
        const selected: GradientHostResult = this.resolveGradientBackground();
        const theme: ThemePart | undefined = this.gradientTheme();
        const part: ReturnType<Presentation['getPart']> = theme === undefined || this.presentation === undefined ?
            undefined : this.presentation.getPart(theme.partName);
        if (selected.kind === 'gradient' && theme && part) {
            let themeRoot: OoxmlElement | undefined;
            for (let index: number = 0; index < sources.length; index++) {
                const source: BackgroundMaterializationSource = arrayAt(sources, index);
                if (source.id !== selected.source && (selected.gradient.stops.source.kind !== 'source' ||
                    source.id !== selected.gradient.stops.source.id)) { continue; }
                const common: OoxmlElement | undefined = uniqueGradientChild(source.root, source.root.namespaceUri, 'cSld');
                const background: OoxmlElement | undefined = common && uniqueGradientChild(common, source.root.namespaceUri, 'bg');
                const reference: OoxmlElement | undefined = background && uniqueGradientChild(background, source.root.namespaceUri, 'bgRef');
                if (!reference) { continue; }
                if (!themeRoot) {
                    themeRoot = parseXml(new TextDecoder().decode(part.data), { limits: this.limits, partName: theme.partName });
                }
                const referenceSource: ScopedElementSource = { root: source.root, node: reference, partName: source.partName };
                const authored: GradientStyleSource = selectGradientStyleSource(themeRoot, referenceSource);
                sources.splice(index, 1, { ...source, style: { gradient: { root: themeRoot, node: authored.gradient,
                    partName: theme.partName }, reference: authored.reference } });
            }
        }
        const changed: boolean = materializeBackgroundGradient(target, sources, selected, this.limits);
        if (changed && this.onMutate) { this.onMutate(); }
        return changed;
    }
    /**
     * Refuses a first-loaded theme belonging to a different master.
     *
     * @remarks Current package theme loading exposes one theme. A different-master
     * reference remains unresolved instead of borrowing incorrect colors/matrices.
     * @returns {ThemePart | undefined} Applicable loaded theme or unavailable context.
     */
    private gradientTheme(): ThemePart | undefined {
        const theme: ThemePart | undefined = this.presentation === undefined ? undefined : this.presentation.theme;
        const layout: LayoutSlide | undefined = this._layoutPartName === undefined || this._layoutsByPartName === undefined ?
            undefined : this._layoutsByPartName.get(this._layoutPartName);
        if (theme !== undefined && layout !== undefined && this.presentation !== undefined &&
            theme.sourcePartName !== layout.master.partName && theme.sourcePartName !== this.presentation.presentationPartName) {
            return undefined;
        }
        return theme;
    }
    /**
     * Attaches a mutation callback invoked when slide content is mutated.
     *
     * @remarks Load / document-bind path only. Used by {@link Presentation} to emit a one-shot digital-signature warning while signatures
     * remain present.
     * @internal
     * @param {*} callback - Invoked after successful shape/text mutations on this slide.
     * @returns {void} Nothing.
     */
    attachOnMutate(callback: () => void): void {
        this.onMutate = callback;
    }
    /**
     * Attaches a live getter for presentation-owned sibling slides (sldIdLst order).
     *
     * @remarks Load / document-bind path only. Enables `find` / `findAll` to set {@link TextFindMatch.slideIndex} by scanning for this
     * slide instance. When unbound, find uses index `0` (spec 035 detached edge case).
     * @internal
     * @param {*} getter - Returns the current model slide array from the parent document.
     * @returns {void} Nothing.
     */
    attachSiblingSlides(getter: () => ReadonlyArray<Slide>): void {
        this.getSiblingSlides = getter;
    }
    /**
     * Attaches the owning presentation for package-backed feature bridges.
     *
     * @remarks Load / create path only. Optional feature modules (diagrams) resolve package parts and relationships through this
     * back-reference. Does not import feature modules into core. Core does not expose a public document property on Slide.
     * @internal
     * @param {Presentation} document - Parent {@link Presentation} that owns this slide.
     * @returns {void} Nothing.
     */
    attachPresentation(document: Presentation): void {
        this.presentation = document;
    }
    /**
     * Returns the owning presentation when bound, otherwise `undefined`.
     *
     * @internal
     * @returns {Presentation | undefined} The result.
     */
    getPresentation(): Presentation | undefined {
        return this.presentation;
    }
    /**
     * Returns this slide's notes slide, creating the notesSlide part when absent.
     *
     * @returns Existing or newly associated {@link NotesSlide}.
     * @throws {NotesError} The slide is not bound to a presentation.
     *
     * @remarks
     * Thin wrapper over the notes feature {@link addNotesSlide} implementation
     * (API-RULES R6.2 — same pattern as {@link Slide.addChart} /
     * {@link Slide.addTable}). Idempotent: a second call returns the same notes
     * slide. Does not rename slide parts or renumber shape ids. Body text is
     * authored through the notes text body.
     */
    addNotesSlide(): NotesSlide {
        return addNotesSlide(this);
    }
    /**
     * Security limits bound to this slide (shape walk, entry count, …).
     *
     * @internal
     * @returns {SecurityLimits} The result.
     */
    getLimits(): SecurityLimits {
        return this.limits;
    }
    /**
     * Invokes the package-level mutation hook when content changes.
     *
     * @remarks Optional feature mutators (diagrams add/remove) call this after successful slide DOM or package edits so digital-signature
     * warning and dirty tracking stay consistent with core shape mutations.
     * @internal
     * @returns {void} Nothing.
     */
    notifyMutate(): void {
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Builds and attaches layout/master placeholder indexes after construction.
     *
     * @remarks Accepts public {@link Shape} arrays so API Extractor does not require exporting the internal placeholder index type. Load
     * path only.
     * @internal
     * @param {*} layoutShapes - Shapes walked from the slide layout part, if any.
     * @param {*} masterShapes - Shapes walked from the slide master part, if any.
     * @returns {void} Nothing.
     */
    attachPlaceholderIndexes(layoutShapes: ReadonlyArray<Shape> | undefined, masterShapes: ReadonlyArray<Shape> | undefined): void {
        this.layoutPlaceholderIndex =
            layoutShapes === undefined ? undefined : buildPlaceholderIndex(layoutShapes);
        this.masterPlaceholderIndex =
            masterShapes === undefined ? undefined : buildPlaceholderIndex(masterShapes);
    }
    /**
     * Attaches master `txStyles` and presentation `defaultTextStyle` for resolve.
     *
     * @remarks Load path only. Elements are read-only views into parsed layout/master / presentation DOM; no-op save does not rewrite
     * master or theme parts from these.
     * @param {*} sources - The sources value.
     * @param {*} [sources.masterTxStyles] - Master txStyles element.
     * @param {*} [sources.defaultTextStyle] - Presentation defaultTextStyle.
     * @internal
     * @returns {void} Nothing.
     */
    attachInheritanceSources(sources: {
        readonly masterTxStyles?: OoxmlElement | undefined;
        readonly defaultTextStyle?: OoxmlElement | undefined;
    }): void {
        this.masterTxStyles = sources.masterTxStyles;
        this.defaultTextStyle = sources.defaultTextStyle;
    }
    /**
     * Attaches package-backed media access for `p:pic` blip resolve.
     *
     * @remarks Load path only. {@link Slide.shapes} re-walks on each get and forwards this access so {@link Shape.asPicture} can resolve
     * embed bytes without holding a stale shape list. `r:link` targets are never fetched.
     * @internal
     * @param {PictureMediaAccess} media - Slide relationship + part lookup (no network).
     * @returns {void} Nothing.
     */
    attachMediaAccess(media: PictureMediaAccess): void {
        this.mediaAccess = media;
    }
    /**
     * Package media access attached at load or create, if any.
     *
     * @internal
     * @returns {PictureMediaAccess | undefined} The result.
     */
    getMediaAccess(): PictureMediaAccess | undefined {
        return this.mediaAccess;
    }
    /**
     * Attaches the layout deduplication map so {@link Slide.layout} can resolve.
     *
     * @internal
     * @param {Map<string, LayoutSlide>} map - `layoutsByPartName` map from `PresentationModel`.
     * @returns {void} Nothing.
     */
    attachLayoutMap(map: Map<string, LayoutSlide>): void {
        this._layoutsByPartName = map;
    }
    /**
     * Attaches a snapshot of this slide part's OPC relationships.
     *
     * @remarks Load / create path only. Stores frozen copies so {@link Slide.hasComments} can detect a comments relationship without
     * holding a live package map. Relationship mutation (e.g. picture insert) does not require refreshing this snapshot for Phase 4 comment
     * detection.
     * @internal
     * @param {*} rels - Relationships whose source is this slide part.
     * @returns {void} Nothing.
     */
    attachPartRelationships(rels: ReadonlyArray<PackageRelationship>): void {
        this._partRels = Object.freeze(rels.map((rel: PackageRelationship) => ({ ...rel })));
    }
    /**
     * Whether this slide has an associated comments part (`p:cmLst`).
     *
     * @remarks Returns `true` if the slide's part relationships include a relationship whose type ends with `/relationships/comments`, or a
     * type registered via the optional comments module (`registerCommentRelType`). Does not parse comment content. Loading
     * `@syncfusion/ej2-pptx/comments` may extend detection for extension relationship types that do not use the ECMA suffix. Citation:
     * ECMA-376-1 §13.3.2; relationship type `http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments`.
     * @returns {boolean} The result.
     */
    get hasComments(): boolean {
        return this._partRels.some((rel: PackageRelationship) => rel.type.endsWith('/relationships/comments') ||
            isRegisteredCommentRelType(rel.type));
    }
    /**
     * The slide layout backing this slide, resolved via the Internal `slideLayout`
     * relationship.
     *
     * @remarks Part of the inheritance chain: slide → layout → master → theme. Multiple slides that reference the same layout part URI
     * return **identical** `LayoutSlide` objects (`slide1.layout === slide2.layout`). Citation: `pml.xsd` `CT_Slide`; relationship type
     * `http://…/slideLayout`; `docs/specs/020-layout-slide.md`.
     * @throws {Error} When this slide has no Internal `slideLayout` relationship,
         or when the layout part URI is not in the deduplication map. /
     * @returns {LayoutSlide} The result.
     */
    get layout(): LayoutSlide {
        const partName: string = this._layoutPartName;
        if (partName === undefined) {
            throw new InvalidPackageError('This slide has no slide layout relationship', {
                partName: this.partName
            });
        }
        const layout: LayoutSlide = this._layoutsByPartName != null ? this._layoutsByPartName.get(partName) : undefined;
        if (layout === undefined) {
            throw new InvalidPackageError(`Layout part "${partName}" not found in the layout map`, {
                partName
            });
        }
        return layout;
    }
    /**
     * Builds an {@link EffectiveColorContext} when both map and scheme are present.
     *
     * @internal
     * @param {ColorScheme | undefined} scheme - Theme colour scheme from {@link ThemePart.colorScheme}.
     * @returns {EffectiveColorContext | undefined} Context for {@link resolveSchemeColor}, or `undefined` if map missing.
     */
    colorContext(scheme: ColorScheme | undefined): EffectiveColorContext | undefined {
        if (this.effectiveColorMap === undefined || scheme === undefined) {
            return undefined;
        }
        return { mapping: this.effectiveColorMap, scheme };
    }
    /**
     * Shape handles under this slide's `p:spTree`, document (z-order) walk order,
     * with {@link ShapeCollection.addTextBox}, {@link ShapeCollection.addShape},
     * and {@link ShapeCollection.addPicture}.
     *
     * @remarks Identity is authored `cNvPr/@id` / `@name` — never renumbered by the library. Nested group children are included. Walk
     * re-runs on each access so live DOM mutations (e.g. run text) remain consistent with the current tree. Use `shapes.addTextBox()` /
     * `shapes.addShape()` / `shapes.addPicture()` to append (API-RULES R1.1). New drawing element ids are `max(existing cNvPr ids including
     * spTree grp)+1`. Picture insert never fetches `r:link` and always embeds a new media part.
     * @throws {Error} When `shapesPerSlide` or `groupNestingDepth` is exceeded.
     * @returns {ShapeCollection} The result.
     */
    get shapes(): ShapeCollection {
        return bindShapeCollection(() => walkSlideShapeTree(this.root, this.limits, this.partName, this.mediaAccess, this.onMutate), {
            addTextBox: (options?: AddTextBoxOptions): Shape => {
                const args: {
                    root: OoxmlElement;
                    limits: SecurityLimits;
                    partName: string;
                    media?: PictureMediaAccess;
                    options?: AddTextBoxOptions;
                    onMutate?: () => void;
                } = {
                    root: this.root,
                    limits: this.limits,
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
                    root: this.root,
                    limits: this.limits,
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
                    throw new InvalidPackageError('Picture insert requires package write access on the slide',
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
                    root: this.root,
                    limits: this.limits,
                    partName: this.partName,
                    media: this.mediaAccess,
                    options
                };
                if (this.onMutate !== undefined) {
                    args.onMutate = this.onMutate;
                }
                return addPictureToSlide(args);
            },
            removePicture: (picture: Picture): void => {
                if (this.mediaAccess === undefined || this.mediaAccess.write === undefined) {
                    throw new InvalidPackageError('Picture remove requires package write access on the slide',
                                                  { partName: this.partName });
                }
                const args: {
                    root: OoxmlElement;
                    partName: string;
                    media: PictureMediaAccess;
                    picture: Picture;
                    onMutate?: () => void;
                } = {
                    root: this.root,
                    partName: this.partName,
                    media: this.mediaAccess,
                    picture
                };
                if (this.onMutate !== undefined) {
                    args.onMutate = this.onMutate;
                }
                removePictureFromSlide(args);
            },
            remove: (shape: Shape): void => {
                const args: {
                    root: OoxmlElement;
                    partName: string;
                    shape: Shape;
                    media?: PictureMediaAccess;
                    onMutate?: () => void;
                } = {
                    root: this.root,
                    partName: this.partName,
                    shape
                };
                if (this.mediaAccess !== undefined) {
                    args.media = this.mediaAccess;
                }
                if (this.onMutate !== undefined) {
                    args.onMutate = this.onMutate;
                }
                removeShapeFromSlide(args);
            }
        });
    }
    /**
     * Matches a slide shape's `p:ph` to layout and master placeholders by type+idx.
     *
     * @remarks Key is `${type}\0${idx}` after XSD defaults (`obj` / `0`). First document walk order wins when a layout or master part has
     * duplicate keys. Does not mutate DOM or `cNvPr` ids. Style inheritance uses the same keys via {@link Slide.resolveRunStyle} / {@link
     * Slide.resolveParagraphStyle}. Citation: Transitional `pml.xsd` `CT_Placeholder`; eng-ref type+idx match.
     * @param {Shape} shape - Shape on this slide (typically from {@link Slide.shapes}).
     * @returns {PlaceholderMatch | undefined} Match with slide info and optional layout/master, or `undefined`
     */
    matchPlaceholder(shape: Shape): PlaceholderMatch | undefined {
        return matchPlaceholderShape(shape, this.layoutPlaceholderIndex, this.masterPlaceholderIndex);
    }
    /**
     * Resolves paragraph character style along the inheritance chain (view only).
     *
     * @remarks Chain: shape paragraph `defRPr` → layout ph → master ph → master `txStyles` bucket → presentation `defaultTextStyle`.
     * First-defined-wins per property. Never writes RGB or list styles back into the package. Pass {@link Presentation.getColorContext} for
     * scheme colour resolution. Without a context, scheme references remain unresolved views. Citation:
     * `docs/specs/010-inheritance-resolve.md`; `pml.xsd` `CT_SlideMasterTextStyles`.
     * @param {Shape} shape - Shape on this slide that owns the text body.
     * @param {number} paragraphIndex - 0-based `a:p` index.
     * @param {EffectiveColorContext} colorContext - Optional effective map + theme scheme for `schemeClr` views.
     * @returns {ResolvedTextStyle} view DTO — **not** direct markup.
     */
    resolveParagraphStyle(shape: Shape, paragraphIndex: number, colorContext?: EffectiveColorContext): ResolvedTextStyle {
        return resolveParagraphStylePure(shape, paragraphIndex, this.buildResolveContext(shape, colorContext));
    }
    /**
     * Resolves run character style along the inheritance chain (view only).
     *
     * @remarks A `schemeClr` on the run counts as **direct** specification (source=`direct`); the returned colour may still be an sRGB
     * **view** via the colour map. Resolve never materializes that RGB into run props on save. Non-placeholder shapes do not false-match
     * layout/master placeholders. Citation: eng-ref chain; `dml-main.xsd` `CT_TextCharacterProperties`.
     * @param {Shape} shape - Shape on this slide that owns the text body.
     * @param {number} paragraphIndex - 0-based `a:p` index.
     * @param {number} runIndex - 0-based `a:r` index within the paragraph.
     * @param {EffectiveColorContext} colorContext - Optional effective map + theme scheme for `schemeClr` views.
     * @returns {ResolvedTextStyle} view DTO — **not** direct `a:rPr`.
     */
    resolveRunStyle(shape: Shape, paragraphIndex: number, runIndex: number, colorContext?: EffectiveColorContext): ResolvedTextStyle {
        return resolveRunStylePure(shape, paragraphIndex, runIndex, this.buildResolveContext(shape, colorContext));
    }
    /**
     * Resolves glyph, outline and underline fills for a selected text target.
     *
     * @remarks Run and field indices count their own kinds. End targets resolve
     * insertion formatting separately. Sparse gradients retain scheme colors and
     * provenance; no resolved value is written back to the package.
     * @param {Shape} shape - Shape on this slide owning the text body.
     * @param {number} paragraphIndex - Zero-based paragraph index.
     * @param {TextFillTarget} target - Run, field, paragraph default or paragraph end.
     * @returns {EffectiveTextCharacterFills} Independent effective carrier views.
     * @throws {PresentationError} With model/out-of-range for missing indices, or model/invalid-argument for an invalid target kind.
     */
    resolveCharacterFills(shape: Shape, paragraphIndex: number, target: TextFillTarget): EffectiveTextCharacterFills {
        return resolveHostTextFills(shape, paragraphIndex, target, this.buildResolveContext(shape, undefined));
    }
    /**
     * Resolves inherited geometry without changing authored transforms.
     * @param {Shape} shape - Owning slide shape.
     * @returns {ResolvedTransform | undefined} Effective geometry.
     */
    resolveTransform(shape: Shape): ResolvedTransform | undefined {
        return resolveTransformPure(shape, this.buildResolveContext(shape, undefined));
    }
    /**
     * Builds pure resolve inputs for one shape from attached indexes and sources.
     *
     * @internal
     * @param {Shape} shape - The shape value.
     * @param {EffectiveColorContext | undefined} colorContext - The colorContext value.
     * @returns {ResolveContext} The result.
     */
    private buildResolveContext(shape: Shape, colorContext: EffectiveColorContext | undefined): ResolveContext {
        const ph: PlaceholderInfo = shape.placeholder;
        let layoutShape: Shape | undefined;
        let masterShape: Shape | undefined;
        let placeholderType: string | undefined;
        if (ph !== undefined) {
            const key: string = placeholderMatchKey(ph.type, ph.idx);
            layoutShape = this.layoutPlaceholderIndex != null ? this.layoutPlaceholderIndex.byKey.get(key) : undefined;
            masterShape = this.masterPlaceholderIndex != null ? this.masterPlaceholderIndex.byKey.get(key) : undefined;
            placeholderType = ph.type;
        }
        return {
            layoutShape,
            masterShape,
            masterTxStyles: this.masterTxStyles,
            defaultTextStyle: this.defaultTextStyle,
            colorContext,
            placeholderType
        };
    }
    /**
     * Finds a shape by authored `cNvPr/@id`.
     *
     * @throws {ShapeNotFoundError} When no shape on this slide has that id.
     * @throws {Error} When the shape walk exceeds configured limits.
     * @param {string} id - Drawing element id string as stored on `cNvPr/@id`.
     * @returns {Shape} The matching {@link Shape}.
     */
    getShapeById(id: string): Shape {
        for (let i: number = 0; i < this.shapes.length; i++) {
            const shape: Shape = arrayAt(this.shapes, i);
            if (shape.id === id) {
                return shape;
            }

        }
        throw new ShapeNotFoundError(id, { partName: this.partName });
    }
    /**
     * Finds the first occurrence of `text` in this slide's body text.
     *
     * @remarks Searches **this slide only**. Walk order: shape tree (groups expanded) → paragraphs → concatenated `a:r` runs. Table cells
     * are searched row-major. Does not search notes, masters, layouts, or other slides. Does not mutate the package. `slideIndex` is the
     * index of this instance in the parent presentation `slides` list when bound. **API-RULES R2.3:** boolean parameters keep positional
     * form for Phase 7 (string + two booleans); prefer overload clarity over an options bag. Spec: `docs/specs/035-find-text.md`; ADR
     * `docs/adr/2026-09-16-find-text.md`.
     * @param {string} text - Non-empty needle; empty string yields no match.
     * @param {boolean} caseSensitive - When `true`, compare literally; when `false`, fold with
     * @param {boolean} wholeWord - When `true`, require word boundaries (`\p{L}|\p{N}|_`).
     * @returns {TextFindMatch | undefined} First {@link TextFindMatch} in slide walk order, or `undefined`.
     */
    find(text: string, caseSensitive: boolean, wholeWord: boolean): TextFindMatch | undefined;
    /**
     * Finds the first RegExp match in this slide's body text.
     *
     * @param {RegExp} regex - Pattern; caller flags `i`/`u`/`m`/`s`/`y` are honored. Internal
     * @returns {TextFindMatch | undefined} First {@link TextFindMatch}, or `undefined`.
     */
    find(regex: RegExp): TextFindMatch | undefined;
    /**
     *
     * @param {string | RegExp} textOrRegex - The textOrRegex value.
     * @param {boolean} caseSensitive - The caseSensitive value.
     * @param {boolean} wholeWord - The wholeWord value.
     * @returns {TextFindMatch | undefined} The result.
     */
    find(textOrRegex: string | RegExp, caseSensitive?: boolean, wholeWord?: boolean): TextFindMatch | undefined {
        const slideIndex: number = this.resolveFindSlideIndex();
        if (typeof textOrRegex === 'string') {
            return findStringOnSlide(this, slideIndex, textOrRegex, caseSensitive === true, wholeWord === true);
        }
        return findRegExpOnSlide(this, slideIndex, textOrRegex);
    }
    /**
     * Finds all occurrences of `text` in this slide's body text (non-overlapping,
     * advance by match length within each paragraph).
     *
     * @remarks Same walk and purity rules as `find`. Only this slide is searched. **API-RULES R2.3:** positional booleans retained for
     * Phase 7. Spec: `docs/specs/035-find-text.md`; ADR `docs/adr/2026-09-16-find-text.md`.
     * @param {string} text - Non-empty needle; empty string yields `[]`.
     * @param {boolean} caseSensitive - When `true`, compare literally; when `false`, fold with
     * @param {boolean} wholeWord - When `true`, require word boundaries (`\p{L}|\p{N}|_`).
     * @returns {*} Matches in slide walk order (may be empty).
     */
    findAll(text: string, caseSensitive: boolean, wholeWord: boolean): ReadonlyArray<TextFindMatch>;
    /**
     * Finds all RegExp matches in this slide's body text.
     *
     * @param {RegExp} regex - Pattern; caller flags honored; `g` is not required for multi-match.
     * @returns {*} Matches in slide walk order (may be empty).
     */
    findAll(regex: RegExp): ReadonlyArray<TextFindMatch>;
    /**
     *
     * @param {string | RegExp} textOrRegex - The textOrRegex value.
     * @param {boolean} caseSensitive - The caseSensitive value.
     * @param {boolean} wholeWord - The wholeWord value.
     * @returns {*} The result.
     */
    findAll(textOrRegex: string | RegExp, caseSensitive?: boolean, wholeWord?: boolean): ReadonlyArray<TextFindMatch> {
        const slideIndex: number = this.resolveFindSlideIndex();
        if (typeof textOrRegex === 'string') {
            return findAllStringOnSlide(this, slideIndex, textOrRegex, caseSensitive === true, wholeWord === true);
        }
        return findAllRegExpOnSlide(this, slideIndex, textOrRegex);
    }
    /**
     * Resolves this slide's index in the parent presentation slide list.
     *
     * @internal
     * @returns {number} Zero-based `p:sldIdLst` index when bound; `0` when unbound or not found.
     */
    private resolveFindSlideIndex(): number {
        const siblings: ReadonlyArray<Slide> = (this.getSiblingSlides == null ? undefined : this.getSiblingSlides());
        if (siblings === undefined) {
            return 0;
        }
        const index: number = siblings.indexOf(this);
        return index >= 0 ? index : 0;
    }
    /**
     * @internal
     */
    /**
     *
     * @returns {OoxmlElement} The result.
     */
    getRoot(): OoxmlElement {
        return this.root;
    }
    /**
     * @internal
     */
    /**
     * @internal
     * @param {OoxmlElement} root - The root value.
     * @returns {void} Nothing.
     */
    setRoot(root: OoxmlElement): void {
        this.root = root;
    }
    /**
     * Classic DrawingML charts on this slide (`length` + {@link Charts.at}).
     *
     * @remarks
     * Thin wrapper over the charts feature {@link chartsForSlide} implementation
     * (API-RULES R6.2). Use `.at(index)` — not a public numeric indexer. Empty
     * when the slide is unbound, the xlsx root is not yet loaded, or there are no
     * resolvable chart frames. Warm the engine with `await loadXlsxRoot()` or
     * `await ensureFeature(CHARTS_FEATURE_ID)` before reading.
     */
    get charts(): Charts {
        return chartsForSlide(this);
    }
    /**
     * Inserts a classic DrawingML chart on this slide.
     *
     * @param options - Chart type catalog key and optional name / transform.
     * @returns Bound chart handle after parts and relationships are written.
     *
     * @remarks
     * Thin wrapper over the charts feature {@link addChart} implementation
     * (API-RULES R6.2). The xlsx root is a static import
     * ({@link getXlsxRootRequired}); this method does not return a Promise.
     * ChartEx catalog keys are refused. Shape id allocation never renumbers
     * existing ids. `Presentation.save()` remains the package await.
     *
     * @throws {Error} The catalog key is refused, or the xlsx root is missing.
     */
    addChart(options: AddChartOptions): Chart {
        return addChart(this, options);
    }
    /**
     * Removes a classic chart graphic frame and GCs unshared chart package parts.
     *
     * @param chart - Handle from {@link Slide.charts} or {@link Slide.addChart}.
     *
     * @remarks
     * Thin wrapper over the charts feature {@link removeChart} implementation
     * (API-RULES R6.2).
     */
    removeChart(chart: Chart): void {
        removeChart(this, chart);
    }
    /**
     * Appends an inline DrawingML table graphic frame and returns a live {@link Table}.
     *
     * @param options - Required `rows` / `columns`; optional `xfrm`, widths, style, name.
     * @returns Bound table handle (synchronous).
     *
     * @remarks
     * Thin wrapper over the tables feature {@link addTable} implementation
     * (API-RULES R6.2). Allocates a new `cNvPr/@id` only; never renumbers
     * survivors. Subject to `shapesPerSlide`.
     *
     * @throws {Error} Invalid rows / columns / style options, or the per-slide
     * shape limit is exceeded.
     */
    addTable(options: AddTableOptions): Table {
        return addTable(this, options);
    }
    /**
     * Removes a table graphic frame owned by this slide.
     *
     * @param table - Handle from {@link Slide.addTable} or `asTable` on this slide.
     *
     * @remarks
     * Thin wrapper over the tables feature {@link removeTable} implementation
     * (API-RULES R6.2). Detaches the `p:graphicFrame` from `p:spTree` only. Does
     * not renumber remaining shape ids, does not delete `ppt/tableStyles.xml`,
     * and does not strip timing targets that still cite the removed id.
     *
     * @throws {Error} Detached handle, table not on this slide, or frame not a
     * direct `spTree` child.
     */
    removeTable(table: Table): void {
        removeTable(this, table);
    }
}

/**
 * Read model returned by hyperlink getters. `action`, `url`, and `targetSlide` are getter-only.
 *
 * @public
 */
export interface HyperlinkView {
    readonly action: string;
    readonly url: string | undefined;
    readonly targetSlide: Slide | undefined;
    screenTip: string | undefined;
}
