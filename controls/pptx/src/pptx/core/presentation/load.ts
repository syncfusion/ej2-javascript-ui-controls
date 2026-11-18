import { officeRelationshipType, ownerNamespace, officeRootNamespace } from '../xml/office-dialect';
/**
 * Load presentation part + ordered slide list from an opened OPC package.
 */
import { SLIDE_LAYOUT_REL_TYPE, SLIDE_MASTER_REL_TYPE, SLIDE_REL_TYPE, EXTENDED_PROPS_REL_TYPE } from '../package/constants';
import { OpcPackage, PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { patchExtendedSlideCount } from '../properties/patch-app-props';
import { createPictureMediaAccess } from '../pictures/media-access';
import { findDefaultTextStyle, findMasterTxStyles } from '../resolve/tx-styles';
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { DEFAULT_SECURITY_LIMITS, SecurityLimits } from '../security/limits';
import { walkSlideShapeTree } from '../shapes/walk';
import { parseColorMapping, parseSlideColorMapOverride, SlideColorMapOverride } from '../theme/load-color-map';
import { effectiveColorMap } from '../theme/resolve-color';
import { parseXml, serializeXmlDocument, OoxmlAttribute, OoxmlElement } from '../xml/index';
import { OFFICE_REL_ATTR_NS, PML_NS, ST_SLIDE_ID_MAX_EXCLUSIVE, ST_SLIDE_ID_MIN } from './constants';
import { LayoutSlide } from '../slideimplementation/layoutslide';
import { MasterSlide } from '../slideimplementation/masterslide';
import { P14_NS } from './shapetype';
import { Slide } from '../slideimplementation/slide';
import { ColorMapping } from '../theme/color-mapping';
import { Shape } from '../shapes/shape';
import { OoxmlText } from '../xml/dom';
import { PresentationSection } from './presentation-section';

/**
 * In-memory presentation skeleton attached to {@link Presentation}.
 *
 * @internal
 */
import { arrayIncludes, arrayAt } from '../util/es5-compat';
export interface PresentationModel {
    /** Presentation part absolute URI. */
    readonly presentationPartName: string;
    /** Root `p:presentation` element (unknown children retained). */
    root: OoxmlElement;
    /** Slides in `p:sldIdLst` document order only. */
    readonly slides: Slide[];
    /**
     * Slide masters in `p:sldMasterIdLst` document order (or rels order when
     * `p:sldMasterIdLst` is absent). Populated once at open; never rewritten
     * on no-op save.
     */
    readonly masters: ReadonlyArray<MasterSlide>;
    /**
     * Deduplication map: layout part URI → {@link LayoutSlide}.
     * Populated by `loadLayoutSlides`; used by `Slide.layout` getter.
     */
    readonly layoutsByPartName: ReadonlyMap<string, LayoutSlide>;
    /**
     * `true` when `p:extLst` contains a `p14:sectionLst` (MS-PPTX sections).
     * Computed once at open; not mutated by Phase 4 (preserve-only).
     */
    readonly hasSections: boolean;
    /** Slide width in presentation points, or undefined when `p:sldSz` is absent/invalid. */
    readonly slideWidth: number | undefined;
    /** Slide height in presentation points, or undefined when `p:sldSz` is absent/invalid. */
    readonly slideHeight: number | undefined;
    /** Authored presentation slide-size type token. */
    readonly slideSizeType: string | undefined;
    /** Parsed section membership resolved to presentation-order slide indexes. */
    readonly sections: ReadonlyArray<PresentationSection>;
}
/**
 * Parses the presentation part and resolves each `p:sldId` to a {@link Slide}.
 *
 * @throws {Error} Missing presentation part, bad root, unresolved `r:id`.
 * @throws {Error} When `slideCount` is exceeded.
 * @param {OpcPackage} pkg - Opened OPC package (parts + relationships already loaded).
 * @returns {PresentationModel} Presentation model with ordered slides.
 */
export function loadPresentationModel(pkg: OpcPackage): PresentationModel {
    const presentationPartName: string = pkg.presentationPartName;
    const part: PackagePart = pkg.parts.get(presentationPartName);
    if (part === undefined) {
        throw new InvalidPackageError(`Presentation part "${presentationPartName}" is missing`, {
            partName: presentationPartName
        });
    }
    const text: string = new TextDecoder('utf-8').decode(part.data);
    const root: OoxmlElement = parseXml(text, { limits: pkg.limits, partName: presentationPartName });
    if (root.localName !== 'presentation' || !officeRootNamespace(root.namespaceUri, PML_NS)) {
        throw new InvalidPackageError('Presentation root must be p:presentation in the PresentationML namespace',
                                      { partName: presentationPartName });
    }
    const sldIdLst: OoxmlElement = findChild(root, PML_NS, 'sldIdLst');
    const slideSize: ParsedSlideSize = parseSlideSize(root);
    const entries: Array<SldIdEntry> = sldIdLst === undefined ? [] : collectSldIdEntries(sldIdLst, presentationPartName);
    if (entries.length > pkg.limits.slideCount) {
        throw new PackageLimitError('slideCount', {
            partName: presentationPartName,
            actual: entries.length
        });
    }
    const masters: Array<MasterSlide> = loadMasterSlides(pkg, root);
    const firstMaster: MasterSlide = masters[0];
    const masterColorMap: ColorMapping = firstMaster !== undefined ? firstMaster.colorMap : undefined;
    const masterPlaceholders: { shapes: ReadonlyArray<Shape>; txStyles: OoxmlElement; } = firstMaster !== undefined
        ? { shapes: firstMaster.placeholderShapes, txStyles: firstMaster.txStyles }
        : undefined;
    // Build LayoutSlide objects (one parse per URI) and wire master.layouts[].
    const layoutsByPartName: Map<string, LayoutSlide> = loadLayoutSlides(pkg, masters);
    const rels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(presentationPartName);
        return __rels != null ? __rels : [];
    })());
    const defaultTextStyle: OoxmlElement = findDefaultTextStyle(root);
    const slides: Slide[] = [];
    for (let i: number = 0; i < entries.length; i++) {
        const entry: SldIdEntry = arrayAt(entries, i);
        const rel: PackageRelationship = findRelationshipById(rels, entry.relId);
        if (rel === undefined) {
            throw new InvalidPackageError(`p:sldId r:id "${entry.relId}" does not resolve in presentation relationships`,
                                          { partName: presentationPartName });
        }
        if (rel.targetMode !== 'Internal' || rel.targetPartName === undefined) {
            throw new InvalidPackageError(`p:sldId r:id "${entry.relId}" must target an Internal slide part`,
                                          { partName: presentationPartName });
        }
        if (!officeRelationshipType(rel.type, SLIDE_REL_TYPE)) {
            throw new InvalidPackageError(`Relationship "${entry.relId}" must be type slide (got "${rel.type}")`,
                                          { partName: presentationPartName });
        }
        const slidePartName: string = rel.targetPartName;
        const slidePart: PackagePart = pkg.parts.get(slidePartName);
        if (slidePart === undefined) {
            throw new InvalidPackageError(`Slide relationship "${entry.relId}" target "${slidePartName}" is not present in the package`,
                                          { partName: slidePartName });
        }
        const slideText: string = new TextDecoder('utf-8').decode(slidePart.data);
        const slideRoot: OoxmlElement = parseXml(slideText, { limits: pkg.limits, partName: slidePartName });
        if (slideRoot.localName !== 'sld' || !officeRootNamespace(slideRoot.namespaceUri, PML_NS)) {
            throw new InvalidPackageError('Slide root must be p:sld in the PresentationML namespace', {
                partName: slidePartName
            });
        }
        // Determine the slide's layout part name from its rels (for Slide.layout).
        const slideRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
            const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(slidePartName);
            return __rels != null ? __rels : [];
        })());
        const layoutRelEntry: PackageRelationship = slideRels.find((r: PackageRelationship) =>
            officeRelationshipType(r.type, SLIDE_LAYOUT_REL_TYPE) &&
            r.targetMode === 'Internal' &&
            r.targetPartName !== undefined);
        const layoutPartName: string = (layoutRelEntry == null ? undefined : layoutRelEntry.targetPartName);
        const layoutSlide: LayoutSlide = layoutPartName !== undefined ? layoutsByPartName.get(layoutPartName) : undefined;
        // Determine effective colour map: prefer layout override when present.
        const slideOverride: SlideColorMapOverride = parseSlideColorMapOverride(slideRoot, slidePartName);
        let baseColorMap: ColorMapping | undefined = undefined;
        if (layoutSlide != null && layoutSlide.colorMapOverride != null) {
            baseColorMap = layoutSlide.colorMapOverride;
        } else {
            baseColorMap = masterColorMap;
        }
        const slideMap: ColorMapping = baseColorMap === undefined ? undefined : effectiveColorMap(baseColorMap, slideOverride);
        // If the slide references a layout not found via master rels, build it lazily.
        // This handles packages where master→layout rels are absent but slide→layout exists.
        let resolvedLayoutSlide: LayoutSlide = layoutSlide;
        if (resolvedLayoutSlide === undefined &&
            layoutPartName !== undefined &&
            firstMaster !== undefined) {
            try {
                const lazyLayout: LayoutSlide = buildLayoutSlide(pkg, layoutPartName, firstMaster, layoutsByPartName);
                layoutsByPartName.set(layoutPartName, lazyLayout);
                firstMaster._addLayout(lazyLayout);
                resolvedLayoutSlide = lazyLayout;
            }
            catch {
                // If layout can't be built (missing part etc.) fall back to no layout.
            }
        }
        // Use cached layout placeholder shapes from LayoutSlide when available.
        const layoutPlaceholderShapes: ReadonlyArray<Shape> = (resolvedLayoutSlide == null
            ? undefined : resolvedLayoutSlide.placeholderShapes);
        const slide: Slide = new Slide({
            partName: slidePartName,
            slideId: entry.id,
            relationshipId: entry.relId,
            root: slideRoot,
            limits: pkg.limits,
            ...(layoutPartName === undefined ? {} : { layoutPartName }),
            ...(slideMap === undefined ? {} : { effectiveColorMap: slideMap })
        });
        slide.attachPlaceholderIndexes(layoutPlaceholderShapes, (masterPlaceholders == null ? undefined : masterPlaceholders.shapes));
        slide.attachInheritanceSources({
            masterTxStyles: (masterPlaceholders == null ? undefined : masterPlaceholders.txStyles),
            defaultTextStyle
        });
        // Picture blip resolve + insert write surface; never fetch External targets.
        slide.attachMediaAccess(createPictureMediaAccess(pkg, slidePartName));
        // Wire layout map so Slide.layout can resolve by URI.
        slide.attachLayoutMap(layoutsByPartName);
        // Snapshot slide rels for hasComments (and future part-rel queries).
        slide.attachPartRelationships(slideRels);
        slides.push(slide);

    }
    const sections: ReadonlyArray<PresentationSection> = parseSections(root, slides);
    return {
        presentationPartName,
        root,
        slides,
        masters,
        layoutsByPartName,
        hasSections: detectHasSections(root),
        slideWidth: slideSize.width,
        slideHeight: slideSize.height,
        slideSizeType: slideSize.type,
        sections
    };
}

interface ParsedSlideSize {
    readonly width: number | undefined;
    readonly height: number | undefined;
    readonly type: string | undefined;
}

/**
 * Parse `p:sldSz` storage dimensions into the public point unit.
 *
 * @param {OoxmlElement} presentationRoot - Presentation document root.
 * @returns {ParsedSlideSize} Authored dimensions and type.
 */
function parseSlideSize(presentationRoot: OoxmlElement): ParsedSlideSize {
    const element: OoxmlElement = findChild(presentationRoot, PML_NS, 'sldSz');
    if (element === undefined) {
        return { width: undefined, height: undefined, type: undefined };
    }
    return {
        width: emuToPoints(getAttr(element, '', 'cx')),
        height: emuToPoints(getAttr(element, '', 'cy')),
        type: getAttr(element, '', 'type')
    };
}

/**
 * Convert a positive EMU storage value to presentation points.
 *
 * @param {string | undefined} value - Authored decimal EMU string.
 * @returns {number | undefined} Point value, or undefined when invalid.
 */
function emuToPoints(value: string | undefined): number | undefined {
    if (value === undefined || !/^\d+$/u.test(value)) {
        return undefined;
    }
    const emu: number = Number(value);
    if (!Number.isSafeInteger(emu) || emu <= 0) {
        return undefined;
    }
    return emu / 12700;
}
/**
 * Detects Microsoft PowerPoint section definitions in presentation `p:extLst`.
 *
 * @remarks Citation: MS-PPTX §2.2.5 / §2.3.1.25 — `p14:sectionLst` under `p:ext` with URI `{521415D9-36F7-43E2-AB2F-B90AF26B5E84}` and
 * namespace `http://schemas.microsoft.com/office/powerpoint/2010/main`. Detection is namespace-qualified on the child element only; missing
 * `p14` NS yields false while the opaque subtree is still preserved by DOM round-trip.
 * @internal
 * @param {OoxmlElement} presentationRoot - The presentationRoot value.
 * @returns {boolean} The result.
 */
function detectHasSections(presentationRoot: OoxmlElement): boolean {
    const extLst: OoxmlElement = findChild(presentationRoot, PML_NS, 'extLst');
    if (extLst === undefined) {
        return false;
    }
    for (let i: number = 0; i < extLst.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(extLst.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== PML_NS || child.localName !== 'ext') {
            continue;
        }
        if (findChild(child, P14_NS, 'sectionLst') !== undefined) {
            return true;
        }

    }
    return false;
}

/**
 * Parse section records and resolve authored slide ids to presentation indexes.
 *
 * @param {OoxmlElement} presentationRoot - Presentation document root.
 * @param {ReadonlyArray<Slide>} slides - Slides in presentation order.
 * @returns {PresentationSection[]} Read-only section DTO values.
 */
function parseSections(presentationRoot: OoxmlElement, slides: ReadonlyArray<Slide>): PresentationSection[] {
    const extLst: OoxmlElement = findChild(presentationRoot, PML_NS, 'extLst');
    if (extLst === undefined) {
        return [];
    }
    const slideIndexById: Map<string, number> = new Map<string, number>();
    for (let i: number = 0; i < slides.length; i++) {
        slideIndexById.set(arrayAt(slides, i).slideId, i);
    }
    const result: PresentationSection[] = [];
    for (let i: number = 0; i < extLst.children.length; i++) {
        const ext: OoxmlElement | OoxmlText = arrayAt(extLst.children, i);
        if (ext.kind !== 'element' || ext.namespaceUri !== PML_NS || ext.localName !== 'ext') {
            continue;
        }
        const sectionList: OoxmlElement = findChild(ext, P14_NS, 'sectionLst');
        if (sectionList === undefined) {
            continue;
        }
        for (let sectionIndex: number = 0; sectionIndex < sectionList.children.length; sectionIndex++) {
            const section: OoxmlElement | OoxmlText = arrayAt(sectionList.children, sectionIndex);
            if (section.kind !== 'element' || section.namespaceUri !== P14_NS || section.localName !== 'section') {
                continue;
            }
            const memberList: OoxmlElement = findChild(section, P14_NS, 'sldIdLst');
            const slideIndexes: number[] = [];
            if (memberList !== undefined) {
                for (let memberIndex: number = 0; memberIndex < memberList.children.length; memberIndex++) {
                    const member: OoxmlElement | OoxmlText = arrayAt(memberList.children, memberIndex);
                    if (member.kind !== 'element' || member.namespaceUri !== P14_NS || member.localName !== 'sldId') {
                        continue;
                    }
                    const authoredId: string = getAttr(member, '', 'id');
                    const resolvedIndex: number = authoredId === undefined ? undefined : slideIndexById.get(authoredId);
                    if (resolvedIndex !== undefined) {
                        slideIndexes.push(resolvedIndex);
                    }
                }
            }
            result.push({ id: getAttr(section, '', 'id'), name: getAttr(section, '', 'name'), slideIndexes });
        }
    }
    return result;
}
/**
 * Writes presentation, slide, master, and layout DOM trees back into package
 * part bytes.
 *
 * @remarks Rebuilds `p:sldIdLst` from model slide order with the same `@id` / `@r:id` values. Does not rename slide part URIs. Other
 * presentation children are left intact. Master and layout parts are serialized from their live roots so add-only shape mutations (req
 * **041**) persist on save.
 * @param {OpcPackage} pkg - Package to update.
 * @param {PresentationModel} model - Current presentation model.
 * @returns {void} Nothing.
 */
export function flushPresentationModel(pkg: OpcPackage, model: PresentationModel): void {
    const nextRoot: OoxmlElement = replaceSldIdLst(model.root, model.slides);
    model.root = nextRoot;
    const encoder: TextEncoder = new TextEncoder();
    const existingPres: PackagePart = pkg.parts.get(model.presentationPartName);
    if (existingPres === undefined) {
        throw new InvalidPackageError(`Presentation part "${model.presentationPartName}" missing on flush`,
                                      { partName: model.presentationPartName });
    }
    pkg.parts.set(model.presentationPartName, {
        name: existingPres.name,
        contentType: existingPres.contentType,
        data: encoder.encode(serializeXmlDocument(nextRoot))
    });
    for (let i: number = 0; i < model.slides.length; i++) {
        const slide: Slide = arrayAt(model.slides, i);
        const existing: PackagePart = pkg.parts.get(slide.partName);
        if (existing === undefined) {
            throw new InvalidPackageError(`Slide part "${slide.partName}" missing on flush`, {
                partName: slide.partName
            });
        }
        pkg.parts.set(slide.partName, {
            name: existing.name,
            contentType: existing.contentType,
            data: encoder.encode(serializeXmlDocument(slide.getRoot()))
        });

    }
    for (let i: number = 0; i < model.masters.length; i++) {
        const master: MasterSlide = arrayAt(model.masters, i);
        const existing: PackagePart = pkg.parts.get(master.partName);
        if (existing === undefined) {
            throw new InvalidPackageError(`Master part "${master.partName}" missing on flush`, {
                partName: master.partName
            });
        }
        pkg.parts.set(master.partName, {
            name: existing.name,
            contentType: existing.contentType,
            data: encoder.encode(serializeXmlDocument(master.getRoot()))
        });

    }
    const values2: LayoutSlide[] = Array.from(model.layoutsByPartName.values());
    for (let i: number = 0; i < values2.length; i++) {
        const layout: LayoutSlide = arrayAt(values2, i);
        const existing: PackagePart = pkg.parts.get(layout.partName);
        if (existing === undefined) {
            throw new InvalidPackageError(`Layout part "${layout.partName}" missing on flush`, {
                partName: layout.partName
            });
        }
        pkg.parts.set(layout.partName, {
            name: existing.name,
            contentType: existing.contentType,
            data: encoder.encode(serializeXmlDocument(layout.getRoot()))
        });

    }
    // Keep docProps/app.xml in sync with the live slide count. The create
    // template initialises <Slides>/<HeadingPairs>/<TitlesOfParts> at build
    // time; save() must refresh them so PowerPoint does not raise a repair
    // prompt when the two diverge (see repair-popup investigation 2026-09-17).
    refreshExtendedProperties(pkg, model.slides.length);
}
/**
 * Refreshes `/docProps/app.xml` so its `<Slides>`, `<HeadingPairs>`, and
 * `<TitlesOfParts>` vector sizes match the live slide count.
 *
 * @remarks ECMA-376-1 §15.2.12.3 defines `Slides` and the `HeadingPairs`/ `TitlesOfParts` vector pair as run-time statistics that
 * PowerPoint fills on first save. A newly-created package may emit `1` from the create template even when the document grows to `n` slides
 * before save; the resulting count mismatch with `p:sldIdLst` triggers PowerPoint's repair pass on open. The part is located by walking the
 * package-root relationships for the extended-properties relationship type (`EXTENDED_PROPS_REL_TYPE`). When the package has no `app.xml`
 * (extremely rare, schema-permissible), this is a no-op.
 * @param {OpcPackage} pkg - Live package to update.
 * @param {number} slideCount - Current `p:sldIdLst` length.
 * @returns {void} Nothing.
 */
export function refreshExtendedProperties(pkg: OpcPackage, slideCount: number): void {
    const appRel: PackageRelationship = pkg.packageRelationships.find((r: PackageRelationship) => r.type === EXTENDED_PROPS_REL_TYPE);
    if (appRel === undefined || appRel.targetPartName === undefined) {
        return;
    }
    const partName: string = appRel.targetPartName;
    const existing: PackagePart = pkg.parts.get(partName);
    if (existing === undefined) {
        return;
    }
    const xml: string = patchExtendedSlideCount(existing.data, slideCount, pkg.limits, partName);
    pkg.parts.set(partName, {
        name: existing.name,
        contentType: existing.contentType,
        data: new TextEncoder().encode(xml)
    });
}
interface SldIdEntry {
    readonly id: string;
    readonly relId: string;
}
/**
 *
 * @param {OoxmlElement} sldIdLst - The sldIdLst value.
 * @param {string} presentationPartName - The presentationPartName value.
 * @returns {SldIdEntry[]} The result.
 */
function collectSldIdEntries(sldIdLst: OoxmlElement, presentationPartName: string): SldIdEntry[] {
    const entries: SldIdEntry[] = [];
    for (let i: number = 0; i < sldIdLst.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(sldIdLst.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== sldIdLst.namespaceUri || child.localName !== 'sldId') {
            continue;
        }
        const id: string = getAttr(child, '', 'id');
        const relId: string = getAttr(child, OFFICE_REL_ATTR_NS, 'id');
        if (id === undefined || relId === undefined) {
            throw new InvalidPackageError('p:sldId requires id and r:id attributes', {
                partName: presentationPartName
            });
        }
        assertSlideIdRange(id, presentationPartName);
        entries.push({ id, relId });

    }
    return entries;
}
/**
 *
 * @param {string} idText - The idText value.
 * @param {string} partName - The partName value.
 * @returns {void} Nothing.
 */
function assertSlideIdRange(idText: string, partName: string): void {
    if (!/^\d+$/u.test(idText)) {
        throw new InvalidPackageError(`p:sldId @id "${idText}" is not an unsigned integer`, {
            partName
        });
    }
    const n: number = Number(idText);
    if (!Number.isSafeInteger(n) || n < ST_SLIDE_ID_MIN || n >= ST_SLIDE_ID_MAX_EXCLUSIVE) {
        throw new InvalidPackageError(`p:sldId @id "${idText}" is outside ST_SlideId range [${String(ST_SLIDE_ID_MIN)},
            ${String(ST_SLIDE_ID_MAX_EXCLUSIVE)})`, { partName });
    }
}
/**
 *
 * @param {OoxmlElement} root - The root value.
 * @param {*} slides - The slides value.
 * @returns {OoxmlElement} The result.
 */
function replaceSldIdLst(root: OoxmlElement, slides: ReadonlyArray<Slide>): OoxmlElement {
    const sldIdChildren: OoxmlElement[] = slides.map((s: Slide) => makeSldIdElement(s, root.namespaceUri));
    let found: boolean = false;
    const children: Array<OoxmlElement | OoxmlText> = root.children.map((child: OoxmlElement | OoxmlText) => {
        if (child.kind === 'element' &&
            child.namespaceUri === root.namespaceUri &&
            child.localName === 'sldIdLst') {
            found = true;
            return {
                kind: 'element' as 'element',
                namespaceUri: child.namespaceUri,
                localName: child.localName,
                attributes: child.attributes,
                children: sldIdChildren,
                ...(child.prefixHint !== undefined ? { prefixHint: child.prefixHint } : {}),
                ...(child.namespaceDeclarations !== undefined
                    ? { namespaceDeclarations: child.namespaceDeclarations }
                    : {})
            };
        }
        return child;
    });
    if (!found && slides.length > 0) {
        const listEl: OoxmlElement = {
            kind: 'element' as 'element',
            namespaceUri: root.namespaceUri,
            localName: 'sldIdLst',
            attributes: [],
            children: sldIdChildren,
            prefixHint: root.prefixHint === undefined ? 'p' : root.prefixHint
        };
        // Insert `p:sldIdLst` in its schema-mandated position within
        // `CT_Presentation` (`pml.xsd`): sldMasterIdLst → notesMasterIdLst →
        // handoutMasterIdLst → **sldIdLst** → sldSz → notesSz → …
        // A previous version `unshift`ed the list at index 0, which placed it
        // *before* `p:sldMasterIdLst` and triggered PowerPoint's repair prompt
        // on a deck created via `Presentation.create()` + `slides.add()` (the
        // initial template ships `sldMasterIdLst` without `sldIdLst`).
        let insertAt: number = 0;
        const predecessor: Array<string> = ['sldMasterIdLst', 'notesMasterIdLst', 'handoutMasterIdLst'];
        for (let i: number = 0; i < children.length; i += 1) {
            const child: OoxmlElement | OoxmlText = arrayAt(children, i);
            if (child !== undefined &&
                child.kind === 'element' &&
                child.namespaceUri === root.namespaceUri &&
                arrayIncludes(predecessor, child.localName)) {
                insertAt = i + 1;
            }
        }
        children.splice(insertAt, 0, listEl);
    }
    return {
        kind: 'element' as 'element',
        namespaceUri: root.namespaceUri,
        localName: root.localName,
        attributes: root.attributes,
        children,
        ...(root.prefixHint !== undefined ? { prefixHint: root.prefixHint } : {}),
        ...(root.namespaceDeclarations !== undefined
            ? { namespaceDeclarations: root.namespaceDeclarations }
            : {})
    };
}
/**
 *
 * @param {Slide} slide - The slide value.
 * @param {string} namespaceUri - Actual owning presentation dialect.
 * @returns {OoxmlElement} The result.
 */
function makeSldIdElement(slide: Slide, namespaceUri: string): OoxmlElement {
    const attributes: OoxmlAttribute[] = [
        { namespaceUri: '', localName: 'id', value: slide.slideId },
        {
            namespaceUri: ownerNamespace(namespaceUri, OFFICE_REL_ATTR_NS),
            localName: 'id',
            value: slide.relationshipId,
            prefix: 'r'
        }
    ];
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName: 'sldId',
        attributes,
        children: [],
        prefixHint: 'p'
    };
}
/**
 * Parses all slide masters from the presentation package in `p:sldMasterIdLst` order
 * (falling back to relationship document order when `p:sldMasterIdLst` is absent).
 *
 * @remarks Each master part is parsed **once** per open, replacing the previous pattern of separate `loadMasterColorMap` +
 * `loadMasterPlaceholderData` passes. The resulting {@link MasterSlide} objects are cached on {@link PresentationModel}; master part bytes
 * are **never rewritten** by the save path. Citation: `pml.xsd` `CT_Presentation` `sldMasterIdLst`; `CT_SlideMaster` ~1379–1393;
 * `EG_TopLevelSlide` requires `clrMap` on every master.
 * @internal
 * @param {OpcPackage} pkg - The pkg value.
 * @param {OoxmlElement} presentationRoot - The presentationRoot value.
 * @returns {MasterSlide[]} The result.
 */
function loadMasterSlides(pkg: OpcPackage, presentationRoot: OoxmlElement): MasterSlide[] {
    const presentationRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(pkg.presentationPartName);
        return __rels != null ? __rels : [];
    })());
    // `shapesPerSlide` is documented as the cap for **slides** (security policy
    // `.agent/policies/security.md`); slide masters carry the standard Office
    // placeholder set (title/body/date/footer/sldNum — 5 shapes by default),
    // so applying the slide cap to a master would falsely trip on every
    // skeleton deck. Lift the cap to the default for template-parts walks; all
    // other limits (group depth, parts, sizes, etc.) still apply unchanged.
    const templateWalkLimits: SecurityLimits = {
        ...pkg.limits,
        shapesPerSlide: DEFAULT_SECURITY_LIMITS.shapesPerSlide
    };
    // Build ordered list of (masterIdListEntry, relId) from p:sldMasterIdLst when present.
    const idEntries: Array<{
        id: string;
        relId: string;
    }> = [];
    const masterIdLst: OoxmlElement = findChild(presentationRoot, PML_NS, 'sldMasterIdLst');
    if (masterIdLst !== undefined) {
        for (let i: number = 0; i < masterIdLst.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(masterIdLst.children, i);
            if (child.kind !== 'element' ||
                child.namespaceUri !== masterIdLst.namespaceUri ||
                child.localName !== 'sldMasterId') {
                continue;
            }
            const idAttr: string = getAttr(child, '', 'id');
            const id: string = idAttr != null ? idAttr : '';
            const relId: string = getAttr(child, OFFICE_REL_ATTR_NS, 'id');
            if (relId !== undefined) {
                idEntries.push({ id, relId });
            }

        }
    }
    else {
        // Fall back: order by first-seen Internal slideMaster rels.
        for (let i: number = 0; i < presentationRels.length; i++) {
            const rel: PackageRelationship = arrayAt(presentationRels, i);
            if (officeRelationshipType(rel.type, SLIDE_MASTER_REL_TYPE) &&
                rel.targetMode === 'Internal' &&
                rel.targetPartName !== undefined) {
                idEntries.push({ id: '', relId: rel.id });
            }

        }
    }
    const masters: MasterSlide[] = [];
    for (let i2: number = 0; i2 < idEntries.length; i2++) {
        const entry: { id: string; relId: string; } = arrayAt(idEntries, i2);
        const rel: PackageRelationship = findRelationshipById(presentationRels, entry.relId);
        if (rel === undefined ||
            !officeRelationshipType(rel.type, SLIDE_MASTER_REL_TYPE) ||
            rel.targetMode !== 'Internal' ||
            rel.targetPartName === undefined) {
            // Unresolvable entry — skip (no partial data emitted).
            continue;
        }
        const masterPartName: string = rel.targetPartName;
        const part: PackagePart = pkg.parts.get(masterPartName);
        if (part === undefined) {
            throw new InvalidPackageError(`Slide master relationship "${entry.relId}" target "${masterPartName}" is not present in the package`, { partName: masterPartName });
        }
        const text: string = new TextDecoder('utf-8').decode(part.data);
        const root: OoxmlElement = parseXml(text, { limits: pkg.limits, partName: masterPartName });
        if (root.localName !== 'sldMaster' || !officeRootNamespace(root.namespaceUri, PML_NS)) {
            throw new InvalidPackageError('Slide master root must be p:sldMaster in the PresentationML namespace',
                                          { partName: masterPartName });
        }
        // p:clrMap is required by schema (EG_TopLevelSlide).
        const clrMapEl: OoxmlElement = findChild(root, PML_NS, 'clrMap');
        if (clrMapEl === undefined) {
            throw new InvalidPackageError('p:sldMaster requires p:clrMap (EG_TopLevelSlide)', {
                partName: masterPartName
            });
        }
        const colorMap: ColorMapping = parseColorMapping(clrMapEl, masterPartName);
        // Walk spTree for placeholder matching (read-only; part bytes stay opaque on save).
        const placeholderShapes: Array<Shape> = walkSlideShapeTree(root, templateWalkLimits, masterPartName);
        // p:txStyles for text-style inheritance resolve.
        const txStyles: OoxmlElement = findMasterTxStyles(root);
        // Count Internal slideLayout relationships on this master.
        const masterRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
            const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(masterPartName);
            return __rels != null ? __rels : [];
        })());
        let layoutCount: number = 0;
        for (let j: number = 0; j < masterRels.length; j++) {
            const r: PackageRelationship = arrayAt(masterRels, j);
            if (officeRelationshipType(r.type, SLIDE_LAYOUT_REL_TYPE) && r.targetMode === 'Internal') {
                layoutCount += 1;
            }

        }
        const masterSlide: MasterSlide = new MasterSlide({
            partName: masterPartName,
            masterIdListEntry: entry.id,
            colorMap,
            layoutCount,
            txStyles,
            placeholderShapes,
            root,
            limits: templateWalkLimits
        });
        // Picture blip resolve + insert on master part (req 041).
        masterSlide.attachMediaAccess(createPictureMediaAccess(pkg, masterPartName));
        masters.push(masterSlide);

    }
    return masters;
}
/**
 * Builds {@link LayoutSlide} objects for all layouts across all masters.
 *
 * @remarks Each layout part is parsed **once** per URI (deduplication via `layoutsByPartName`). After building each layout, it is appended
 * to its owning master's `_layouts` array via {@link MasterSlide._addLayout}. Execution order in `loadPresentationModel`: 1.
 * `loadMasterSlides` — builds `MasterSlide[]` 2. `loadLayoutSlides` — builds `LayoutSlide[]` and wires `master._layouts` 3. slide loop —
 * each `Slide` references the cached `LayoutSlide` for its URI Citation: `pml.xsd` `CT_SlideMaster` `sldLayoutIdLst`; `CT_SlideLayout`
 * ~1380–1406.
 * @internal
 * @param {OpcPackage} pkg - The pkg value.
 * @param {*} masters - The masters value.
 * @returns {Map<string, LayoutSlide>} The result.
 */
function loadLayoutSlides(pkg: OpcPackage, masters: ReadonlyArray<MasterSlide>): Map<string, LayoutSlide> {
    const layoutsByPartName: Map<string, LayoutSlide> = new Map<string, LayoutSlide>();
    for (let i: number = 0; i < masters.length; i++) {
        const master: MasterSlide = arrayAt(masters, i);
        const masterRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
            const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(master.partName);
            return __rels != null ? __rels : [];
        })());
        for (let j: number = 0; j < masterRels.length; j++) {
            const rel: PackageRelationship = arrayAt(masterRels, j);
            if (!officeRelationshipType(rel.type, SLIDE_LAYOUT_REL_TYPE) ||
                rel.targetMode !== 'Internal' ||
                rel.targetPartName === undefined) {
                continue;
            }
            const layoutPartName: string = rel.targetPartName;
            // Deduplication: if already parsed, reuse + wire (do not wire twice for same master).
            if (layoutsByPartName.has(layoutPartName)) {
                const existing: LayoutSlide = layoutsByPartName.get(layoutPartName);
                if (existing === undefined) {
                    continue;
                }
                master._addLayout(existing);
                continue;
            }
            const layout: LayoutSlide = buildLayoutSlide(pkg, layoutPartName, master, layoutsByPartName);
            layoutsByPartName.set(layoutPartName, layout);
            master._addLayout(layout);

        }

    }
    return layoutsByPartName;
}
/**
 * Parses a single layout part and builds a {@link LayoutSlide}.
 *
 * @remarks Validates root element, parses `@type`, `@showMasterSp`, `p:cSld/@name`, `p:clrMapOvr`, and walks `p:spTree` for placeholder
 * shapes. Circular reference guard: checks that the layout's `slideMaster` Internal rel does not point back to a layout already being
 * constructed (detects layout→master→ layout cycles in crafted packages). Citation: `pml.xsd` `CT_SlideLayout` ~1380–1406; `AG_ChildSlide`
 * ~1371.
 * @internal
 * @param {OpcPackage} pkg - The pkg value.
 * @param {string} layoutPartName - The layoutPartName value.
 * @param {MasterSlide} master - The master value.
 * @param {ReadonlyMap<string, LayoutSlide>} layoutsByPartName - The layoutsByPartName value.
 * @returns {LayoutSlide} The result.
 */
function buildLayoutSlide(pkg: OpcPackage, layoutPartName: string, master: MasterSlide,
                          layoutsByPartName: ReadonlyMap<string, LayoutSlide>): LayoutSlide {
    const part: PackagePart = pkg.parts.get(layoutPartName);
    if (part === undefined) {
        throw new InvalidPackageError(`Relationship target "${layoutPartName}" is not present in the package`,
                                      { partName: layoutPartName });
    }
    const text: string = new TextDecoder('utf-8').decode(part.data);
    const root: OoxmlElement = parseXml(text, { limits: pkg.limits, partName: layoutPartName });
    if (root.localName !== 'sldLayout' || !officeRootNamespace(root.namespaceUri, PML_NS)) {
        throw new InvalidPackageError('Part root must be p:sldLayout in the PresentationML namespace', {
            partName: layoutPartName
        });
    }
    // Circular reference guard: layout's slideMaster rel must not target a layout
    // already in the in-progress deduplication map (crafted cycle detection).
    const layoutRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(layoutPartName);
        return __rels != null ? __rels : [];
    })());
    for (let i: number = 0; i < layoutRels.length; i++) {
        const r: PackageRelationship = arrayAt(layoutRels, i);
        if (officeRelationshipType(r.type, SLIDE_MASTER_REL_TYPE) &&
            r.targetMode === 'Internal' &&
            r.targetPartName !== undefined &&
            layoutsByPartName.has(r.targetPartName)) {
            throw new InvalidPackageError(`Circular layout→master reference detected at "${layoutPartName}"`,
                                          { partName: layoutPartName });
        }

    }
    // Validate that the layout has a slideMaster rel (any Internal one suffices).
    const hasMasterRel: boolean = layoutRels.some((r: PackageRelationship) => officeRelationshipType(r.type, SLIDE_MASTER_REL_TYPE) &&
        r.targetMode === 'Internal' &&
        r.targetPartName !== undefined);
    if (!hasMasterRel) {
        throw new InvalidPackageError(`Slide layout "${layoutPartName}" has no Internal slideMaster relationship`,
                                      { partName: layoutPartName });
    }
    // Parse @type and @showMasterSp from root attributes.
    const layoutType: string = getAttr(root, '', 'type');
    const showMasterSpAttr: string = getAttr(root, '', 'showMasterSp');
    const showMasterShapes: boolean = showMasterSpAttr === undefined ||
        (showMasterSpAttr !== '0' && showMasterSpAttr.toLowerCase() !== 'false');
    // Parse p:cSld/@name.
    const cSld: OoxmlElement = findChild(root, PML_NS, 'cSld');
    const layoutName: string = cSld !== undefined ? getAttr(cSld, '', 'name') : undefined;
    // Parse p:clrMapOvr (optional).
    // parseSlideColorMapOverride returns 'master' sentinel, a ColorMapping, or undefined.
    // Map 'master' → undefined since layouts inherit from the master in that case.
    const rawClrMapOvr: SlideColorMapOverride = parseSlideColorMapOverride(root, layoutPartName);
    const colorMapOverride: ColorMapping = rawClrMapOvr === undefined || rawClrMapOvr === 'master' ? undefined : rawClrMapOvr;
    // Walk spTree for placeholder shapes (read-only). `shapesPerSlide` is
    // documented as the cap for **slides** — slide layouts carry inherited
    // placeholders from the master, so applying the slide cap here would trip
    // on every standard template. Lift to the default for template walks.
    const templateWalkLimits: SecurityLimits = {
        ...pkg.limits,
        shapesPerSlide: DEFAULT_SECURITY_LIMITS.shapesPerSlide
    };
    const placeholderShapes: Array<Shape> = walkSlideShapeTree(root, templateWalkLimits, layoutPartName);
    const layoutSlide: LayoutSlide = new LayoutSlide({
        partName: layoutPartName,
        type: layoutType,
        name: layoutName,
        showMasterShapes,
        colorMapOverride,
        placeholderShapes,
        master,
        root,
        limits: templateWalkLimits
    });
    // Picture blip resolve + insert on layout part (req 041).
    layoutSlide.attachMediaAccess(createPictureMediaAccess(pkg, layoutPartName));
    return layoutSlide;
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findChild(parent: OoxmlElement, namespaceUri: string, localName: string): OoxmlElement | undefined {
    namespaceUri = ownerNamespace(parent.namespaceUri, namespaceUri);
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' &&
            child.namespaceUri === namespaceUri &&
            child.localName === localName) {
            return child;
        }

    }
    return undefined;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {string | undefined} The result.
 */
function getAttr(el: OoxmlElement, namespaceUri: string, localName: string): string | undefined {
    namespaceUri = ownerNamespace(el.namespaceUri, namespaceUri);
    for (let i: number = 0; i < el.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(el.attributes, i);
        if (a.namespaceUri === namespaceUri && a.localName === localName) {
            return a.value;
        }

    }
    return undefined;
}
/**
 *
 * @param {*} rels - The rels value.
 * @param {string} id - The id value.
 * @returns {PackageRelationship | undefined} The result.
 */
function findRelationshipById(rels: ReadonlyArray<PackageRelationship>, id: string): PackageRelationship | undefined {
    for (let i: number = 0; i < rels.length; i++) {
        const r: PackageRelationship = arrayAt(rels, i);
        if (r.id === id) {
            return r;
        }

    }
    return undefined;
}
