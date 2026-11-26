/**
 * Opened presentation package document (public handle).
 */
import { OoxmlElement } from '../xml/dom';
import { addSlideToPresentation, bindSlideCollection, buildCreatePackage, AddSlideOptions, SlideCollection } from '../create/index';
import { flushPresentationModel, loadPresentationModel, PresentationModel } from '../presentation/load';
import { PresentationError } from '../errors';
import { removeSlideAtIndex, removeSlideFromPresentation } from '../slides/remove-slide';
import { MasterSlide } from '../slideimplementation/masterslide';
import { Slide } from '../slideimplementation/slide';
import { notePresentation } from '../../features/hyperlinks-actions/facade';
import { SecurityLimits } from '../security/limits';
import { loadThemePart, resolveSchemeColor as resolveSchemeColorView, EffectiveColorContext, ResolvedColor,
    SchemeColorValue, ThemePart } from '../theme/index';
import { findAllRegExpOnDocument, findAllStringOnDocument, findRegExpOnDocument, findStringOnDocument, SearchablePart } from '../text/find/find-on-slide';
import { getNotes } from '../../features/notes/get-notes';
import { TextFindMatch } from '../text/find/text-find-match';
import { DIGITAL_SIGNATURE_ORIGIN_PART_NAME, DIGITAL_SIGNATURE_ORIGIN_REL_TYPE, VBA_PROJECT_REL_TYPE } from './constants';
import { FORMAT_MAIN_CONTENT_TYPES, FormatType, formatIsMacroEnabled, getFormatTypeFromExtension } from './format-type';
export { FormatType, getFormatTypeFromContentType, getFormatTypeFromExtension } from './format-type';
import { stringIncludes, arrayAt } from '../util/es5-compat';
import { BuiltInProperties } from '../properties/builtin-set';
import { CustomProperties } from '../properties/custom-set';
import { LayoutSlide } from '../presentation';
import { PresentationSection } from '../presentation/presentation-section';
import { SectionCollection } from '../presentation/section-collection';
import { ensureContentTypesForParts, serializeContentTypes, ContentTypesModel } from './content-types';
import { createHostPartRelationshipAccess, HostPartRelationshipAccess } from './host-part-relationship-access';
import { validateLicense } from '@syncfusion/ej2-base';
import { addWaterMark } from './watermark';
import { openPresentationBytes, OpenPresentationOptions } from './open';
import { wasEncryptedContainer } from './encryption';
import { applyModifyVerifier, assertPasswordAcceptable, encryptIfPending, hasModifyVerifier, PendingEncryption, removeModifyVerifier } from './encryption';
import { InvalidPasswordError } from '../security/errors';
import { _decode } from '../errors';
import { OpcPackage, PackagePart } from './package-model';
import { createPackagePartAccess, PackagePartAccess } from './package-part-access';
import { relationshipsPartName } from './paths';
import { serializeRelationships, PackageRelationship } from './relationships';
import { writeZip } from './zip-writer';
import { ColorScheme } from '../theme/color-scheme';
import { Save } from '@syncfusion/ej2-file-utils';

/** OOXML presentation MIME type used for browser downloads (ECMA-376 / IANA). */
const PRESENTATION_MIME_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

/**
 * Decodes {@link Presentation.open} input once so encryption detection and OPC
 * load share the same bytes.
 *
 * @param {Uint8Array | ArrayBuffer | number[] | string} input - Package bytes or base64.
 * @returns {Uint8Array} Package bytes.
 */
function openInputBytes(input: Uint8Array | ArrayBuffer | number[] | string): Uint8Array {
    if (typeof input === 'string') {
        const decoded: Uint8Array | Array<number> = _decode(input, false);
        return decoded instanceof Uint8Array ? decoded : new Uint8Array(decoded);
    }
    if (input instanceof Uint8Array) {
        return input;
    }
    return new Uint8Array(input);
}

export { OpenPresentationInput, OpenPresentationOptions } from './open';

/**
 * Console warning emitted once when a signed package is mutated (req 026).
 *
 * @internal
 */
const DIGITAL_SIGNATURE_MUTATION_WARNING: string = '[@syncfusion/ej2-pptx] Warning: This presentation has digital signatures. Mutations invalidate signatures.\n' +
    'Call removeDigitalSignatures() before mutating if you wish to produce a clean file.';
/** Absolute URI prefix for OPC digital-signature packaging parts. */
const XML_SIGNATURES_PART_PREFIX: string = '/_xmlsignatures/';
export { HostPartRelationshipAccess } from './host-part-relationship-access';
export { PackagePartAccess } from './package-part-access';
/**
 * Options for {@link Presentation.create}.
 *
 * @remarks
 * Same limit override surface as {@link Presentation.open}. Slide size defaults
 * are fixed to the hand-authored create templates (see create-skeleton mapping).
 */
export interface CreatePresentationOptions {
    /** Partial security limit overrides (same shape as {@link Presentation.open}). */
    readonly limits?: Partial<SecurityLimits>;
}
/**
 * In-memory presentation package opened by {@link Presentation.open} or
 * built by {@link Presentation.create}.
 *
 * @remarks
 * Exposes OPC part enumeration, the presentation main part name, relationship
 * lookup, ordered {@link Presentation.slides} from `p:sldIdLst`, shape
 * tree / direct run text via {@link Slide.shapes}, the primary
 * {@link Presentation.theme} when discoverable, colour-map-aware
 * {@link Presentation.resolveSchemeColor} (view only), and
 * {@link Presentation.save}.
 *
 * Slide enumeration order is **only** `p:sldIdLst` document order — never
 * filesystem or part-name sort order. Save rebuilds `sldIdLst` from the model
 * without renaming slide part URIs. {@link SlideCollection.add} appends a blank
 * slide without renaming existing parts or renumbering existing slide ids.
 *
 * Theme part bytes remain opaque in the package on no-op save; the theme model
 * is a read view of `a:clrScheme`. Scheme colour **resolve** returns a
 * {@link ResolvedColor} view and never replaces authored `a:schemeClr` with RGB.
 *
 * `find` / `findAll` search slide body text, each slide's notes slide when one
 * exists, then slide masters, then slide layouts. Replace and highlight go
 * through the returned match's text part, so they write back to the same part
 * the match came from.
 */
export class Presentation {
    /** @internal */
    private readonly pkg: OpcPackage;
    /** @internal */
    private readonly model: PresentationModel;
    /** @internal */
    private readonly themePart: ThemePart | undefined;
    /** @internal */
    private readonly slideCollection: SlideCollection;
    /** @internal */
    private readonly sectionCollection: SectionCollection;
    /** @internal */
    private readonly builtIn: BuiltInProperties;
    private readonly custom: CustomProperties;
    /**
     * Cached at construction: macro-enabled main content type and/or
     * presentation→vbaProject relationship. Updated when saving with explicit FormatType.
     *
     * @internal
     */
    private macrosPresent: boolean;
    /**
     * Password from {@link Presentation.encrypt}, applied on the next save only.
     *
     * @internal
     */
    private pendingEncryption: PendingEncryption | undefined;
    /**
     * Whether package-root relationships include a digital-signature origin.
     * Cleared by {@link Presentation.removeDigitalSignatures}.
     *
     * @internal
     */
    private hasDigitalSignaturesFlag: boolean;
    /**
     * After {@link Presentation.removeDigitalSignatures}, suppress mutation warnings.
     *
     * @internal
     */
    private suppressSignatureWarning: boolean = false;
    /**
     * Whether {@link Presentation.warnSignatureOnce} has already fired
     * for this document instance while signatures remain present.
     *
     * @internal
     */
    private signatureWarningEmitted: boolean = false;
    /**
     * @internal
     * @param {OpcPackage} pkg - Bound OPC package model (owned by this instance).
     */
    constructor(pkg: OpcPackage) {
        this.pkg = pkg;
        this.model = loadPresentationModel(pkg);
        this.themePart = loadThemePart(pkg);
        this.macrosPresent = detectHasMacros(pkg);
        this.hasDigitalSignaturesFlag = detectHasDigitalSignatures(pkg);
        const onMutate: () => void = (): void => {
            this.warnSignatureOnce();
        };
        if (this.themePart !== undefined) { this.themePart.attachOnMutate(onMutate); }
        const siblingSlides: () => ReadonlyArray<Slide> = (): ReadonlyArray<Slide> => this.model.slides;
        for (let i: number = 0; i < this.model.slides.length; i++) {
            const slide: Slide = arrayAt(this.model.slides, i);
            slide.attachOnMutate(onMutate);
            slide.attachSiblingSlides(siblingSlides);
            slide.attachPresentation(this);
            this.bindNotesResolver(slide);

        }
        for (let i: number = 0; i < this.model.masters.length; i++) {
            const master: MasterSlide = arrayAt(this.model.masters, i);
            master.attachOnMutate(onMutate);

        }
        const values2: LayoutSlide[] = Array.from(this.model.layoutsByPartName.values());
        for (let i: number = 0; i < values2.length; i++) {
            const layout: LayoutSlide = arrayAt(values2, i);
            layout.attachOnMutate(onMutate);

        }
        this.builtIn = new BuiltInProperties(pkg);
        this.custom = new CustomProperties(pkg);
        this.sectionCollection = new SectionCollection(this.model.sectionStore);
        this.model.sectionStore.attachAddSlide((options?: AddSlideOptions): Slide => this.slides.add(options));
        this.slideCollection = bindSlideCollection(() => this.model.slides, (options?: AddSlideOptions | Slide) => {
            this.warnSignatureOnce();
            const slide: Slide = addSlideToPresentation(this.pkg, this.model, options === undefined ? {} : options);
            slide.attachOnMutate(onMutate);
            slide.attachSiblingSlides(siblingSlides);
            slide.attachPresentation(this);
            this.bindNotesResolver(slide);
            return slide;
        }, (slide: Slide) => {
            this.warnSignatureOnce();
            this.model.sectionStore.forgetSlide(slide);
            removeSlideFromPresentation(this.pkg, this.model, slide);
        }, (index: number) => {
            this.warnSignatureOnce();
            const removed: Slide = arrayAt(this.model.slides, index);
            if (removed !== undefined) {
                this.model.sectionStore.forgetSlide(removed);
            }
            removeSlideAtIndex(this.pkg, this.model, index);
        });
    }
    /**
     * Builds a new minimal presentation package (master, blank layout, theme — **no slides**).
     *
     * @remarks Templates are hand-authored against Transitional `pml.xsd` / `dml-main.xsd` and fixture-cited EMUs / `clrMap` (see `docs/ooxml-mapping/create-skeleton.md`). `p:notesSz` is always present (schema-required). No macro parts are emitted. Freshly created documents have `slides.count === 0`. Add slides only via {@link SlideCollection.add} (`presentation.slides.add({ layout })`). {@link SecurityLimits.slideCount} is enforced on each add.
     * @example ```ts const doc = Presentation.create(); doc.slides.add({ layout: SlideLayoutType.TitleOnly }); const bytes = await
     * doc.save(); ```
     * @param {CreatePresentationOptions} options - Optional security limit overrides.
     * @returns {Presentation} A {@link Presentation} ready for edit and {@link Presentation.save}.
     */
    static create(options: CreatePresentationOptions = {}): Presentation {
        const pkg: OpcPackage = buildCreatePackage(options);
        const created: Presentation = new Presentation(pkg);
        notePresentation(created);
        return created;
    }
    /**
     * Opens an OPC presentation package from raw bytes or a base64 string.
     *
     * @throws {Error} When an encrypted package is opened without a password, the password is wrong, or ZIP traditional encryption is present.
     * @throws {Error} When a security limit is exceeded.
     * @throws {Error} When the package is not a valid presentation OPC package.
     * @remarks Same factory style as {@link Presentation.create}. Package load logic lives in the package module; this method is the public open entry. Unknown parts and relationship types are retained for round-trip. External relationship targets are never fetched. Macro-enabled main content types are accepted as packages; macros are never executed. An OFFCRYPTO / OLE CFB package is decrypted with `options.password` (or the second string argument) using `@syncfusion/ej2-office-common` before the OPC parse.
     * @example ```ts const doc = await Presentation.open(bytes); const fromBase64 = await Presentation.open(base64String); const locked = await Presentation.open(bytes, 'secret'); const main =
     * doc.getPart(doc.presentationPartName); const out = await doc.save(); ```
     * @param {*} input - Entire `.pptx` (or related) package as `Uint8Array`,
     * @param {OpenPresentationOptions} options - Optional security limit overrides.
     * @returns {*} A {@link Presentation} bound to the in-memory package.
     */
    static async open(
        input: Uint8Array | ArrayBuffer | number[] | string,
        options: OpenPresentationOptions | string = {}
    ): Promise<Presentation> {
        const resolved: OpenPresentationOptions = typeof options === 'string' ? { password: options } : options;
        const source: Uint8Array = openInputBytes(input);
        const pkg: OpcPackage = await openPresentationBytes(source, resolved);
        const opened: Presentation = new Presentation(pkg);
        if (wasEncryptedContainer(source) && typeof resolved.password === 'string' && resolved.password.length > 0) {
            opened.pendingEncryption = { password: resolved.password };
        }
        notePresentation(opened);
        return opened;
    }
    /**
     * Absolute OPC URI of the presentation main part (from package officeDocument rel).
     *
     * @returns {string} The result.
     */
    get presentationPartName(): string {
        return this.pkg.presentationPartName;
    }
    /**
     * Primary theme part when a theme relationship is discoverable.
     *
     * @remarks Discovery prefers Internal `slideMaster` → `theme`, else Internal `theme` on the presentation main part. When no theme
     * relationship exists, returns `undefined` (not an error). When a theme relationship exists but the target part is missing or invalid,
     * open fails with {@link Error}. Slot values from {@link ThemePart.getSlot} are **direct** scheme colours, not {@link
     * ResolvedColor} after `clrMap`. Use {@link Presentation.resolveSchemeColor} for mapped views.
     * @returns {ThemePart | undefined} The result.
     */
    get theme(): ThemePart | undefined {
        return this.themePart;
    }
    /**
     * Slides in `p:sldIdLst` document order only, with {@link SlideCollection.add}.
     *
     * @remarks Length is the number of `p:sldId` entries successfully resolved. Index `0` is the first list entry regardless of slide part
     * file names (`slide1.xml` vs `slide2.xml`). There is no public sort-by-part-name API. Use `slides.add()` to append a blank slide
     * (API-RULES R1.1).
     * @returns {SlideCollection} The result.
     */
    get slides(): SlideCollection {
        return this.slideCollection;
    }
    /**
     * Assigns a slide of this presentation to the section at `sectionIndex`.
     *
     * @internal Called by {@link Slide.moveToSection}.
     * @param {Slide} slide - Slide owned by this presentation.
     * @param {number} sectionIndex - Destination section index.
     * @returns {void} Nothing.
     */
    moveSlideToSection(slide: Slide, sectionIndex: number): void {
        if (this.model.slides.indexOf(slide) < 0) {
            throw new PresentationError('model/invalid-argument', 'Slide is not a member of this presentation.');
        }
        this.warnSignatureOnce();
        this.model.sectionStore.moveSlideToSection(slide, sectionIndex);
    }
    /**
     * Presentation slide width in typographic points.
     *
     * @remarks Read from the authored presentation slide size. Returns `undefined`
     * for hand-minimal packages that omit or invalidate that optional element.
     * @returns {number | undefined} Width in points.
     */
    get slideWidth(): number | undefined {
        return this.model.slideWidth;
    }
    /**
     * Presentation slide height in typographic points.
     * @returns {number | undefined} Height in points, or `undefined` when absent.
     */
    get slideHeight(): number | undefined {
        return this.model.slideHeight;
    }
    /**
     * Authored predefined slide-size type, when present.
     * @returns {string | undefined} Presentation size type token.
     */
    get slideSizeType(): string | undefined {
        return this.model.slideSizeType;
    }
    /**
     * Orientation derived from the authored dimensions.
     * @returns {'landscape' | 'portrait' | 'square' | undefined} Derived orientation.
     */
    get slideOrientation(): 'landscape' | 'portrait' | 'square' | undefined {
        const width: number = this.model.slideWidth;
        const height: number = this.model.slideHeight;
        if (width === undefined || height === undefined) {
            return undefined;
        }
        return width === height ? 'square' : width > height ? 'landscape' : 'portrait';
    }
    /**
     * Built-in core and extended document properties.
     *
     * @remarks Values are the elements stored in `docProps/core.xml` and
     * `docProps/app.xml`. Absence is `undefined`, not an inherited default.
     * Vector extended properties stay preserve-only.
     * @returns {BuiltInProperties} The property view for this presentation.
     */
    get builtInProperties(): BuiltInProperties {
        return this.builtIn;
    }
    /**
     * Custom document properties from `docProps/custom.xml`.
     *
     * @returns {CustomProperties} The custom property view for this presentation.
     */
    get customProperties(): CustomProperties {
        return this.custom;
    }
    /**
     * Ordered slide masters from `p:sldMasterIdLst` (or relationship order when
     * `p:sldMasterIdLst` is absent).
     *
     * @remarks Populated once at open; master part bytes are **never rewritten** on a no-op save. Typical single-master decks return a one-element array. Multi-master decks (e.g. combined presentations) return more than one. Returns an empty array when the package has no slide master relationships. Each {@link MasterSlide} exposes `colorMap`, `shapes` (read-only walk), and `layoutCount`. Shape-level mutation methods (`addTextBox`, `addPicture`) always throw on master slide shape collections. Citation: `pml.xsd` `CT_SlideMasterIdList` ~1356–1365; `CT_SlideMaster` ~1379–1393.
     * @see {@link MasterSlide}
     * @returns {*} The result.
     */
    get slideMasters(): ReadonlyArray<MasterSlide> {
        return this.model.masters;
    }
    /**
     * Whether this presentation packages a VBA macro project.
     *
     * @remarks `true` when **either**: 1. The presentation main part content type contains the substring `macroEnabled` (for example
     * `application/vnd.ms-powerpoint.presentation.macroEnabled.main+xml`), or 2. The presentation part has an Internal relationship of type
     * {@link VBA_PROJECT_REL_TYPE} (`http://schemas.microsoft.com/office/2006/relationships/vbaProject`). When `true`, `ppt/vbaProject.bin`
     * (and related packaging) must round-trip as opaque OPC bytes. The library **never** parses MS-OVBA structure, executes, evaluates, or
     * interprets VBA. Save must **not** downgrade a macro-enabled main content type to the standard non-macro type, and must not inject VBA
     * into a clean non-macro package. Detection uses in-memory package state only (no extra I/O). Phase 4 is detect + preserve only; there
     * is no remove-macros API. Citation: ECMA-376-1 §11.4 (macro-enabled presentation packaging); [MS-OFFMACRO] / [MS-OFFMACRO2] VBA
     * Project part + relationship; MS-OVBA (binary storage inside the part — out of scope); `docs/specs/025-vba-macro-detect.md`.
     * @returns {boolean} The result.
     */
    get hasMacros(): boolean {
        return this.macrosPresent;
    }
    /**
     * Whether the package contains a digital-signature origin relationship.
     *
     * @remarks `true` when package-root relationships include a relationship whose type is {@link DIGITAL_SIGNATURE_ORIGIN_REL_TYPE}
     * (`http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/origin`). Signature origin and `sig{N}.xml` parts
     * are preserved as **opaque** OPC bytes on no-op and text-only save. The library **never** parses, validates, creates, or countersigns
     * W3C XML-Signature markup. After {@link Presentation.removeDigitalSignatures}, this getter returns `false`. Detection is from
     * package-root relationships only — orphaned `_xmlsignatures/` parts without an origin relationship do not set this flag, but {@link
     * Presentation.removeDigitalSignatures} still scrubs them. Citation: ECMA-376-1 §15.2.7 Digital Signature Origin Part; ECMA-376-1
     * §15.2.8 XML Signature Part; ECMA-376-2 §6.5.4.3.
     * @returns {boolean} The result.
     */
    get hasDigitalSignatures(): boolean {
        return this.hasDigitalSignaturesFlag;
    }
    /**
     * Removes digital signature packaging from this package (idempotent).
     *
     * @remarks Removes: - All parts under `/_xmlsignatures/` (including `origin.sigs`, `sig{N}.xml`,
         and `_xmlsignatures/_rels/origin.sigs.rels`) - Package-root relationships of type {@link DIGITAL_SIGNATURE_ORIGIN_REL_TYPE} Sets {@link Presentation.hasDigitalSignatures} to `false` and suppresses further digital-signature mutation warnings for this document instance (open decision C). Does **not** validate signatures before removal, parse `<Signature>` XML, or remove VBA project signature material (`vbaProjectSignature.bin`). Calling when no signatures are present is a no-op (still safe scrub of any residual `/_xmlsignatures/` parts). Citation: ECMA-376-1 §15.2.7, §15.2.8. /
     * @returns {void} Nothing.
     */
    removeDigitalSignatures(): void {
        removeXmlSignatureParts(this.pkg);
        removePackageRootRelsByType(this.pkg, DIGITAL_SIGNATURE_ORIGIN_REL_TYPE);
        this.hasDigitalSignaturesFlag = false;
        this.suppressSignatureWarning = true;
    }
    /**
     * Emits the req-026 mutation warning at most once while signatures remain.
     *
     * @internal
     * @returns {void} Nothing.
     */
    private warnSignatureOnce(): void {
        if (!this.hasDigitalSignaturesFlag || this.suppressSignatureWarning) {
            return;
        }
        if (this.signatureWarningEmitted) {
            return;
        }
        this.signatureWarningEmitted = true;
        console.warn(DIGITAL_SIGNATURE_MUTATION_WARNING);
    }
    /**
     * Whether the presentation contains section definitions (`p14:sectionLst`).
     *
     * @remarks Sections are a Microsoft extension stored under `<p:extLst>` of the presentation root (`ppt/presentation.xml`). They are
     * preserved on load and save. Returns `true` when a `p:ext` child contains a `p14:sectionLst` element, including after
     * {@link Presentation.sections} creates one. Citation: MS-PPTX §2.2.5 / §2.3.1.25; namespace
     * `http://schemas.microsoft.com/office/powerpoint/2010/main`; extension URI `{521415D9-36F7-43E2-AB2F-B90AF26B5E84}`.
     * @returns {boolean} The result.
     */
    get hasSections(): boolean {
        return this.model.hasSections || this.model.sectionStore.count > 0;
    }
    /**
     * Presentation sections in authored order.
     *
     * @remarks Create, rename, reorder, and remove sections here. A slide belongs to
     * at most one section. Removing a section does not delete its slides. An
     * unmodified loaded `p14:sectionLst` is written back unchanged. Loaded membership
     * indexes remain on {@link Presentation.sectionRecords}.
     *
     * Citation: MS-PPTX §2.2.5 / §2.3.1.25 / §2.3.3.24–27.
     * @returns {SectionCollection} Live section collection.
     *
     * @example
     * ```ts
     * const section = presentation.sections.add();
     * section.name = 'SectionDemo';
     * section.addSlide(SlideLayoutType.Blank);
     * ```
     */
    get sections(): SectionCollection {
        return this.sectionCollection;
    }
    /**
     * Loaded section membership resolved to presentation-order slide indexes.
     *
     * @remarks Snapshot taken at open. Live membership is {@link Presentation.sections}.
     * @returns {ReadonlyArray<PresentationSection>} Section records from load.
     */
    get sectionRecords(): ReadonlyArray<PresentationSection> {
        return this.model.sections;
    }
    /**
     * Effective colour context for one slide (map + theme scheme), when both exist.
     *
     * @param {Slide} slide - Slide from {@link Presentation.slides}.
     * @returns {EffectiveColorContext | undefined} Context for resolve helpers, or `undefined` if map or theme missing.
     */
    getColorContext(slide: Slide): EffectiveColorContext | undefined {
        const scheme: ColorScheme = (this.themePart == null ? undefined : this.themePart.colorScheme);
        return slide.colorContext(scheme);
    }
    /**
     * Resolves a `schemeClr` token for a slide to a **view-only** {@link ResolvedColor}.
     *
     * @remarks **Non-mutating.** Does not alter package DOM or part bytes. A subsequent {@link Presentation.save} must still emit authored
     * `a:schemeClr` where present — never materialize resolved RGB over the reference. Direct scheme refs (`ColorValue` with `kind:
     * 'scheme'`) are **not** the same type as {@link ResolvedColor}.
     * @param {Slide} slide - Slide providing the effective colour map.
     * @param {string | SchemeColorValue} ref - `ST_SchemeColorVal` string or `{ kind: 'scheme', val }`.
     * @returns {ResolvedColor} Resolved sRGB/direct view, or unresolved (`phClr`, missing context, …).
     */
    resolveSchemeColor(slide: Slide, ref: string | SchemeColorValue): ResolvedColor {
        return resolveSchemeColorView(ref, this.getColorContext(slide));
    }
    /**
     * Returns a snapshot list of absolute part names present in the package
     * (excludes the content-types stream, which is reconstructed on save).
     *
     * @returns {string[]} The result.
     */
    listPartNames(): string[] {
        return [...this.pkg.parts.keys()].sort((a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0));
    }
    /**
     * Reads a part by absolute OPC URI.
     *
     * @param {string} partName - Absolute part name (e.g. `/ppt/presentation.xml`).
     * @returns {PackagePart | undefined} The part, or `undefined` if absent.
     */
    getPart(partName: string): PackagePart | undefined {
        const part: PackagePart = this.pkg.parts.get(partName);
        if (part === undefined) {
            return undefined;
        }
        return {
            name: part.name,
            contentType: part.contentType,
            data: part.data.slice()
        };
    }
    /**
     * Returns relationships for a source part (`/` for package relationships).
     *
     * @remarks Returns **frozen copies**. Mutation of package relationships requires {@link Presentation.hostPartRelationshipAccess}
     * (optional feature mutators such as hyperlink retarget/clear/add).
     * @param {string} sourcePartName - Absolute source part URI, or `/`.
     * @returns {*} The result.
     */
    getRelationships(sourcePartName: string = '/'): ReadonlyArray<PackageRelationship> {
        const key: string = sourcePartName === '' ? '/' : sourcePartName;
        const rels: Array<PackageRelationship> = this.pkg.partRelationships.get(key);
        if (rels === undefined) {
            return Object.freeze([]);
        }
        return Object.freeze(rels.map((r: PackageRelationship) => ({ ...r })));
    }
    /**
     * Live relationship access for a host part (optional feature mutators).
     *
     * @remarks Factory for optional modules (e.g. `@syncfusion/ej2-pptx/hyperlinks-actions`) that must allocate or retarget relationships without a public `setRelationships` on the document. Does not fetch Targets or open network connections. Enforcing {@link SecurityLimits.relationshipsPerPart} remains the caller's duty when appending rows (see `PackageLimitError`).
     * @example ```ts const access = doc.hostPartRelationshipAccess(slide.partName); // pass `access` to hyperlinks-actions mutators ```
     * @param {string} sourcePartName - Absolute source part URI (e.g. `slide.partName`), or `/`.
     * @returns {HostPartRelationshipAccess} Access bag with get/replace over the live package relationship map.
     */
    hostPartRelationshipAccess(sourcePartName: string = '/'): HostPartRelationshipAccess {
        return createHostPartRelationshipAccess(this.pkg, sourcePartName);
    }
    /**
     * Live package part get/set for optional modules that own non-slide part DOM.
     *
     * @remarks Factory for optional modules (e.g. `@syncfusion/ej2-pptx/notes`) that parse, mutate, or create a package part outside the presentation/slide roots flushed by {@link Presentation.save}. After mutating a live notes DOM, callers must write serialized bytes back via {@link PackagePartAccess.setPart} before save. Create paths use {@link PackagePartAccess.replaceRelationships} and {@link PackagePartAccess.ensureContentTypeOverride}. Does not fetch, execute, or open network connections.
     * @example ```ts const access = doc.packagePartAccess(); // pass `access` to notes getNotes / ensureNotes / flush helpers ```
     * @returns {PackagePartAccess} Access bag with relationship get/replace, part get/set, content-type
     */
    packagePartAccess(): PackagePartAccess {
        return createPackagePartAccess(this.pkg, (): OoxmlElement => this.model.root);
    }
    /**
     * Finds the first occurrence of `text` across slides, notes, masters, and layouts.
     *
     * @remarks Walk order: `slides` (`p:sldIdLst`), then each slide's existing notes slide, then masters (`p:sldMasterIdLst`), then layouts.
     * Within a part: shape tree (groups expanded) → paragraphs → concatenated `a:r` runs. Table cells are searched row-major. A notes part
     * is read only when the slide already has one; searching never creates notes. Does not mutate the package. **API-RULES R2.3:** boolean parameters
     * keep positional form for Phase 7 (string + two booleans); prefer overload clarity over an options bag. Spec:
     * `docs/specs/035-find-text.md`; ADR `docs/adr/2026-09-16-find-text.md`.
     * @param {string} text - Non-empty needle; empty string yields no match.
     * @param {boolean} caseSensitive - When `true`, compare literally; when `false`, fold with
     * @param {boolean} wholeWord - When `true`, require word boundaries (`\p{L}|\p{N}|_`).
     * @returns {TextFindMatch | undefined} First {@link TextFindMatch} in document walk order, or `undefined`.
     */
    find(text: string, caseSensitive: boolean, wholeWord: boolean): TextFindMatch | undefined;
    /**
     * Finds the first RegExp match across slides, notes, masters, and layouts.
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
        const parts: ReadonlyArray<SearchablePart> = this.searchableParts();
        if (typeof textOrRegex === 'string') {
            return findStringOnDocument(parts, textOrRegex, caseSensitive === true, wholeWord === true);
        }
        return findRegExpOnDocument(parts, textOrRegex);
    }
    /**
     * Finds all occurrences of `text` across slides, notes, masters, and layouts (non-overlapping, advance
     * by match length within each paragraph).
     *
     * @remarks Same walk and purity rules as `find`. **API-RULES R2.3:** positional booleans retained for Phase 7. Spec:
     * `docs/specs/035-find-text.md`; ADR `docs/adr/2026-09-16-find-text.md`.
     * @param {string} text - Non-empty needle; empty string yields `[]`.
     * @param {boolean} caseSensitive - When `true`, compare literally; when `false`, fold with
     * @param {boolean} wholeWord - When `true`, require word boundaries (`\p{L}|\p{N}|_`).
     * @returns {*} Matches in document walk order (may be empty).
     */
    findAll(text: string, caseSensitive: boolean, wholeWord: boolean): ReadonlyArray<TextFindMatch>;
    /**
     * Finds all RegExp matches across slides, notes, masters, and layouts.
     *
     * @param {RegExp} regex - Pattern; caller flags honored; `g` is not required for multi-match.
     * @returns {*} Matches in document walk order (may be empty).
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
        const parts: ReadonlyArray<SearchablePart> = this.searchableParts();
        if (typeof textOrRegex === 'string') {
            return findAllStringOnDocument(parts, textOrRegex, caseSensitive === true, wholeWord === true);
        }
        return findAllRegExpOnDocument(parts, textOrRegex);
    }
    /**
     * Slides, their existing notes, masters, then layouts, in search order.
     *
     * @internal
     * @returns {ReadonlyArray<SearchablePart>} Parts in document walk order.
     */
    private searchableParts(): ReadonlyArray<SearchablePart> {
        const parts: SearchablePart[] = [];
        const slides: ReadonlyArray<Slide> = this.model.slides;
        const owner: Slide | undefined = slides.length > 0 ? arrayAt(slides, 0) : undefined;
        for (let i: number = 0; i < slides.length; i++) {
            const slide: Slide = arrayAt(slides, i);
            parts.push({ shapes: slide.shapes, slideIndex: i, slide });
            const notes = slide.existingNotes();
            if (notes !== undefined) {
                parts.push({ shapes: notes.shapes, slideIndex: i, slide });
            }
        }
        if (owner !== undefined) {
            for (let i: number = 0; i < this.model.masters.length; i++) {
                parts.push({ shapes: arrayAt(this.model.masters, i).shapes, slideIndex: -1, slide: owner });
            }
            const layouts = Array.from(this.model.layoutsByPartName.values());
            for (let i: number = 0; i < layouts.length; i++) {
                parts.push({ shapes: arrayAt(layouts, i).shapes, slideIndex: -1, slide: owner });
            }
        }
        return parts;
    }
    /**
     * Wires notes lookup so find can read an existing notes part without creating one.
     *
     * @internal
     * @param {Slide} slide - Slide to bind.
     * @returns {void} Nothing.
     */
    private bindNotesResolver(slide: Slide): void {
        const access = this.packagePartAccess();
        slide.attachNotesResolver(() => getNotes(slide, access, { autoPersist: true }));
    }
    /**
     * Serializes the package to OPC ZIP bytes.
     *
     * @remarks Flushes the presentation and slide DOM models into part bytes, then writes all known parts (including opaque unknown parts and retained trash-item streams). Content types cover every OPC part; ECMA-376 trash items (`/[trash]/HHHH.dat`) are written as ZIP entries but never listed in `[Content_Types].xml`. Relationship documents are re-emitted from the model. ZIP layout is not byte-identical to the input; semantic part-set equality is. Compression method is store (0) for determinism. `p:sldIdLst` is written in model order with stable `@id` / `@r:id` values. Slide part names are not renamed to reflect order. Theme and colour-map markup are preserved; resolve never rewrites them. With no argument the main-part content type stays the loaded type, or `FormatType.Pptx` for a newly created presentation.
     * @example ```ts const bytes = await doc.save(); ```
     * @returns {*} A new `Uint8Array` containing the complete package.
     */
    save(): Promise<Uint8Array>;
    /**
     * Serializes the package as the given {@link FormatType}.
     *
     * @remarks Rewrites only the presentation main-part content type to the type
     * cited for that format. Macro-enabled targets (`.pptm`, `.potm`) keep an
     * existing `vbaProject.bin` and its relationship as opaque bytes. Non-macro
     * targets drop the VBA relationship, content-type override, and part. A
     * non-macro source saved as macro-enabled does **not** invent a VBA project.
     * Package relationships (`officeDocument`) are unchanged.
     * @example ```ts const bytes = await doc.save(FormatType.Potx); ```
     * @param {FormatType} format - Target package format.
     * @returns {*} A new `Uint8Array` containing the complete package.
     */
    save(format: FormatType): Promise<Uint8Array>;
    /**
     * Serializes the package and writes the OPC ZIP to a filesystem path.
     *
     * @remarks Performs the same package flush and ZIP emission as {@link Presentation.save} with no argument,
     * then writes those bytes via `@syncfusion/ej2-file-utils` `Save.save`. The extension selects the format:
     * `.pptx`, `.pptm`, `.potx`, or `.potm` (see {@link getFormatTypeFromExtension}). Other extensions throw.
     * Does not create missing parent directories. Overwrites an existing file at `fileName`.
     * @example ```ts await doc.save('out/deck.pptx'); ```
     * @param {string} fileName - Destination path (absolute or relative). Must be a non-empty path whose extension is a supported presentation format.
     * @returns {*} Resolves when the file has been written.
     */
    save(fileName: string): Promise<void>;
    /**
     *
     * @param {string | FormatType} fileNameOrFormat - Path or {@link FormatType}.
     * @returns {*} Bytes when no path is given; otherwise `void` after the file write.
     */
    async save(fileNameOrFormat?: string | FormatType): Promise<Uint8Array | void> {
        let format: FormatType | undefined;
        let fileName: string | undefined;
        if (typeof fileNameOrFormat === 'number') {
            if (FORMAT_MAIN_CONTENT_TYPES[fileNameOrFormat] === undefined) {
                throw new TypeError('format must be a FormatType value');
            }
            format = fileNameOrFormat;
        } else if (typeof fileNameOrFormat === 'string') {
            if (fileNameOrFormat.trim().length === 0) {
                throw new TypeError('fileName must be a non-empty path');
            }
            format = getFormatTypeFromExtension(fileNameOrFormat);
            fileName = fileNameOrFormat;
        }
        this.applySaveTimeLicenseWatermark();
        if (format !== undefined) {
            this.applySaveFormat(format);
        }
        const bytes: Uint8Array = encryptIfPending(this.serializePackageBytes(), this.pendingEncryption);
        if (fileName !== undefined) {
            Save.save(fileName, new Blob([bytes], { type: mimeTypeForFormat(format) }));
        } else {
            return bytes;
        }
    }
    /**
     * Save-time license watermark gate (Syncfusion Presentation parity).
     *
     * @remarks
     * Mirrors the .NET Presentation `SaveAsStream` workflow: when the existing
     * `validateLicense('pptx')` check (from `@syncfusion/ej2-base`) reports an
     * unlicensed save, {@link addWaterMark} injects the trial watermark before
     * serialization. Licensed saves leave slide/master markup untouched. The
     * check never throws and never blocks a save. Applied once per `save()` /
     * `save(fileName)` call (both forms share this path — EJ2 has no separate
     * `saveAsStream`).
     *
     * @internal
     * @returns {void} Nothing.
     */
    /**
     * Save-time license watermark gate.
     *
     * @internal
     * @returns {void} Nothing.
     */
    private applySaveTimeLicenseWatermark(): void {
        let unlicensed: boolean = false;
        try {
            unlicensed = validateLicense('pptx') === false;
        } catch (error) {
            unlicensed = false;
        }
        if (!unlicensed) {
            return;
        }
        addWaterMark(this);
    }
    /**
     * Builds OPC ZIP bytes from the live package model (shared by both `save` forms).
     *
     * @internal
     * @returns {Uint8Array} Complete package bytes.
     */
    /**
     * Applies a target package format before serialization.
     *
     * @remarks Updates the presentation main-part content type and content-type
     * override only. VBA parts stay opaque: kept when the target is macro-enabled,
     * removed when it is not. No VBA bytes are generated.
     * @internal
     * @param {FormatType} format - Target format.
     * @returns {void} Nothing.
     */
    private applySaveFormat(format: FormatType): void {
        const mainName: string = this.pkg.presentationPartName;
        const mainPart: PackagePart = this.pkg.parts.get(mainName);
        if (mainPart === undefined) {
            return;
        }
        const nextType: string = FORMAT_MAIN_CONTENT_TYPES[format];
        this.pkg.parts.set(mainName, {
            name: mainPart.name,
            contentType: nextType,
            data: mainPart.data
        });
        if (this.pkg.contentTypes.overrides.has(mainName)) {
            this.pkg.contentTypes.overrides.set(mainName, nextType);
        }
        if (formatIsMacroEnabled(format)) {
            this.macrosPresent = detectHasMacros(this.pkg);
            return;
        }
        stripVbaProject(this.pkg, mainName);
        this.macrosPresent = false;
    }
    /**
     * Builds OPC ZIP bytes from the live package model (shared by both `save` forms).
     *
     * @internal
     * @returns {Uint8Array} Complete package bytes.
     */
    private serializePackageBytes(): Uint8Array {
        this.builtIn.flush();
        this.custom.flush();
        flushPresentationModel(this.pkg, this.model);
        this.builtIn.reloadExtendedAfterStatisticRefresh();
        // Refresh relationship part bytes from model before write.
        const zipParts: Map<string, Uint8Array> = new Map<string, Uint8Array>();
        const typeMap: Map<string, { contentType: string; }> = new Map<string, {
            contentType: string;
        }>();
        // Clone non-rels parts first.
        const partEntries: Array<[string, PackagePart]> = Array.from(this.pkg.parts.entries());
        for (let i: number = 0; i < partEntries.length; i++) {
            const name: string = arrayAt(partEntries, i)[0];
            const part: PackagePart = arrayAt(partEntries, i)[1];
            if (name.endsWith('.rels')) {
                continue;
            }
            zipParts.set(name, part.data);
            typeMap.set(name, { contentType: part.contentType });

        }
        // Emit relationship parts from the model (authoritative).
        const relEntries: Array<[string, PackageRelationship[]]> = Array.from(this.pkg.partRelationships.entries());
        for (let i: number = 0; i < relEntries.length; i++) {
            const source: string = arrayAt(relEntries, i)[0];
            const rels: PackageRelationship[] = arrayAt(relEntries, i)[1];
            const relsName: string = relationshipsPartName(source);
            const relBytes: Uint8Array = serializeRelationships(rels);
            zipParts.set(relsName, relBytes);
            typeMap.set(relsName, {
                contentType: 'application/vnd.openxmlformats-package.relationships+xml'
            });

        }
        const ctModel: ContentTypesModel = ensureContentTypesForParts(this.pkg.contentTypes, typeMap);
        this.pkg.contentTypes = ctModel;
        const ctBytes: Uint8Array = serializeContentTypes(ctModel);
        zipParts.set('/[Content_Types].xml', ctBytes);
        return writeZip(zipParts);
    }
    /**
     * Encrypts the package with a password on the next {@link Presentation.save}.
     *
     * @remarks Does not rewrite parts until save. Save then emits an ECMA-376
     * Agile OFFCRYPTO compound file (AES-256 / SHA-512) via
     * `@syncfusion/ej2-office-common` `encryptPackage`. The password is not
     * written into any OPC part. Calling again replaces the pending password.
     * Opening an encrypted package with a password keeps that password for later
     * saves. A later {@link Presentation.removeEncryption} cancels it.
     * @example ```ts presentation.encrypt('syncfusion'); await presentation.save(); ```
     * @param {string} password - Open password (1–255 characters).
     * @returns {void} Nothing.
     */
    encrypt(password: string): void {
        if (typeof password !== 'string') {
            throw new InvalidPasswordError('Invalid password');
        }
        assertPasswordAcceptable(password);
        this.pendingEncryption = { password };
    }
    /**
     * Cancels package encryption so the next save is a plain OPC ZIP.
     *
     * @remarks Clears a password set by {@link Presentation.encrypt} and a
     * password retained from {@link Presentation.open} of an encrypted package.
     * Until this is called, later saves of that instance stay encrypted with
     * the same password.
     * @example ```ts presentation.removeEncryption(); await presentation.save(); ```
     * @returns {void} Nothing.
     */
    removeEncryption(): void {
        this.pendingEncryption = undefined;
    }
    /**
     * Whether the presentation carries write protection (`p:modifyVerifier`).
     * Whether the presentation carries write protection (`p:modifyVerifier`).
     *
     * @remarks Presence of the element is the signal PowerPoint uses for
     * "read-only recommended". The password is not recovered.
     * Citation: Transitional `pml.xsd` `CT_Presentation` / `CT_ModifyVerifier`.
     * @returns {boolean} `true` when `p:modifyVerifier` is present.
     */
    get isWriteProtected(): boolean {
        return hasModifyVerifier(this.model.root);
    }
    /**
     * Marks the presentation write-protected (read-only recommended).
     *
     * @remarks Writes `p:modifyVerifier` on the presentation root: SHA-512 Agile
     * hash, 100000 spins, random salt from office-common. The password itself
     * is not stored. Persisted on the next save. Replaces an existing verifier.
     * Citation: `pml.xsd` `CT_ModifyVerifier`; [MS-OFFCRYPTO] §2.3.4.11.
     * @example ```ts pptxDoc.setWriteProtection('MYPASSWORD'); await pptxDoc.save(); ```
     * @param {string} password - Write-protection password (1–255 characters).
     * @returns {void} Nothing.
     */
    setWriteProtection(password: string): void {
        if (typeof password !== 'string') {
            throw new InvalidPasswordError('Invalid password');
        }
        applyModifyVerifier(this.model.root, password);
    }
    /**
     * Removes write protection (`p:modifyVerifier`) when present.
     *
     * @remarks Other presentation children are left in place. A following save
     * emits a presentation without the verifier.
     * @example ```ts if (pptxDoc.isWriteProtected) { pptxDoc.removeWriteProtection(); } ```
     * @returns {void} Nothing.
     */
    removeWriteProtection(): void {
        removeModifyVerifier(this.model.root);
    }
}
/**
 * Browser download MIME type for a saved format.
 *
 * @remarks IANA / Office media types. Falls back to the PPTX type when the
 * format is omitted (no-argument save of an already-loaded package).
 * @param {FormatType | undefined} format - Selected format, if any.
 * @returns {string} MIME type string.
 */
function mimeTypeForFormat(format: FormatType | undefined): string {
    if (format === FormatType.Pptm) {
        return 'application/vnd.ms-powerpoint.presentation.macroEnabled.12';
    }
    if (format === FormatType.Potx) {
        return 'application/vnd.openxmlformats-officedocument.presentationml.template';
    }
    if (format === FormatType.Potm) {
        return 'application/vnd.ms-powerpoint.template.macroEnabled.12';
    }
    return PRESENTATION_MIME_TYPE;
}
/**
 * Drops VBA packaging when saving a non-macro format.
 *
 * @remarks Removes the presentation→vbaProject relationship, the opaque
 * `vbaProject.bin` part, and its content-type override. Does not parse the
 * part. Other unknown parts are left in place.
 * @param {OpcPackage} pkg - Live package.
 * @param {string} presentationPartName - Presentation main part URI.
 * @returns {void} Nothing.
 */
function stripVbaProject(pkg: OpcPackage, presentationPartName: string): void {
    const rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(presentationPartName);
    if (rels === undefined) {
        return;
    }
    const kept: PackageRelationship[] = [];
    for (let i: number = 0; i < rels.length; i++) {
        const rel: PackageRelationship = arrayAt(rels, i);
        if (rel.type !== VBA_PROJECT_REL_TYPE) {
            kept.push(rel);
            continue;
        }
        if (rel.targetPartName !== undefined) {
            removePart(pkg, rel.targetPartName);
            const lower: string = rel.targetPartName.toLowerCase();
            if (lower.endsWith('/vbaproject.bin')) {
                const sigName: string = rel.targetPartName.slice(0, rel.targetPartName.length - 'vbaProject.bin'.length) + 'vbaProjectSignature.bin';
                if (pkg.parts.has(sigName)) {
                    removePart(pkg, sigName);
                }
            }
        }
    }
    pkg.partRelationships.set(presentationPartName, kept);
}
/**
 * Detects VBA/macro packaging from presentation main content type and/or
 * presentation→vbaProject relationship.
 *
 * @remarks Citation: ECMA-376-1 §11.4; [MS-OFFMACRO2] VBA Project relationship type. Does not read or interpret `vbaProject.bin` bytes.
 * @param {OpcPackage} pkg - Opened OPC package.
 * @returns {boolean} `true` when either detection path matches.
 */
function detectHasMacros(pkg: OpcPackage): boolean {
    const mainPart: PackagePart = pkg.parts.get(pkg.presentationPartName);
    const contentTypeMacro: boolean = mainPart != null && stringIncludes(mainPart.contentType, 'macroEnabled');
    if (contentTypeMacro) {
        return true;
    }
    const rels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(pkg.presentationPartName);
        return __rels != null ? __rels : [];
    })());
    return rels.some((r: PackageRelationship) => r.type === VBA_PROJECT_REL_TYPE);
}
/**
 * Detects package-root digital-signature origin relationships.
 *
 * @remarks Citation: ECMA-376-1 §15.2.7. Does not parse signature XML.
 * @param {OpcPackage} pkg - Opened OPC package.
 * @returns {boolean} `true` when a package-root origin relationship exists.
 */
function detectHasDigitalSignatures(pkg: OpcPackage): boolean {
    return pkg.packageRelationships.some((r: PackageRelationship) => r.type === DIGITAL_SIGNATURE_ORIGIN_REL_TYPE);
}
/**
 * Deletes one part and its relationship map entry / content-type override.
 *
 * @internal
 * @param {OpcPackage} pkg - Live package model.
 * @param {string} partName - Absolute OPC part URI.
 * @returns {void} Nothing.
 */
function removePart(pkg: OpcPackage, partName: string): void {
    pkg.parts.delete(partName);
    pkg.partRelationships.delete(partName);
    if (pkg.contentTypes.overrides.has(partName)) {
        const overrides: Map<string, string> = new Map(pkg.contentTypes.overrides);
        overrides.delete(partName);
        pkg.contentTypes = {
            defaults: pkg.contentTypes.defaults,
            overrides
        };
    }
}
/**
 * Removes all parts whose absolute names start with `/_xmlsignatures/`.
 *
 * @remarks Covers `origin.sigs`, `sig{N}.xml`, and nested `.rels` under the folder. Citation: ECMA-376-1 §15.2.7 / §15.2.8.
 * @internal
 * @param {OpcPackage} pkg - Live package model.
 * @returns {void} Nothing.
 */
function removeXmlSignatureParts(pkg: OpcPackage): void {
    const names: string[] = [];
    const keys2: string[] = Array.from(pkg.parts.keys());
    for (let i: number = 0; i < keys2.length; i++) {
        const name: string = arrayAt(keys2, i);
        if (name === DIGITAL_SIGNATURE_ORIGIN_PART_NAME ||
            name.startsWith(XML_SIGNATURES_PART_PREFIX)) {
            names.push(name);
        }

    }
    for (let i: number = 0; i < names.length; i++) {
        const name: string = arrayAt(names, i);
        removePart(pkg, name);

    }
}
/**
 * Filters package-root relationships by type and keeps `/` map in sync.
 *
 * @internal
 * @param {OpcPackage} pkg - Live package model.
 * @param {string} relType - Relationship type URI to remove.
 * @returns {void} Nothing.
 */
function removePackageRootRelsByType(pkg: OpcPackage, relType: string): void {
    const next: Array<PackageRelationship> = pkg.packageRelationships.filter((r: PackageRelationship) => r.type !== relType);
    pkg.packageRelationships = next;
    pkg.partRelationships.set('/', next);
}
