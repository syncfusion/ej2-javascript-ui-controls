/**
 * Appends a slide to an existing package / presentation model.
 */
import { allocateNextRelationshipId } from '../package/allocate-relationship-id';
import { arrayAt } from '../util/es5-compat';
import { SLIDE_CONTENT_TYPE, SLIDE_LAYOUT_CONTENT_TYPE, SLIDE_LAYOUT_REL_TYPE, SLIDE_MASTER_REL_TYPE,
    SLIDE_REL_TYPE } from '../package/constants';
import { OpcPackage } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { relativeTarget } from '../package/paths';
import { createPictureMediaAccess } from '../pictures/media-access';
import { OFFICE_REL_ATTR_NS, PML_NS, ST_SLIDE_ID_MAX_EXCLUSIVE, ST_SLIDE_ID_MIN } from '../presentation/constants';
import { PresentationModel } from '../presentation/load';
import { findDefaultTextStyle, findMasterTxStyles } from '../resolve/tx-styles';
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { asMutable, findChild, getAttr } from '../shapes/dom-utils';
import { Shape } from '../shapes/shape';
import { walkSlideShapeTree } from '../shapes/walk';
import { LayoutSlide } from '../slideimplementation/layoutslide';
import { MasterSlide } from '../slideimplementation/masterslide';
import { Slide } from '../slideimplementation/slide';
import { PresentationError } from '../errors';
import { loadMasterColorMap, parseSlideColorMapOverride, SlideColorMapOverride } from '../theme/load-color-map';
import { effectiveColorMap } from '../theme/resolve-color';
import { parseXml, serializeXml, OoxmlAttribute, OoxmlElement } from '../xml/index';
import { CREATE_LAYOUT_MASTER_REL_ID } from './build-package';
import { slideLayoutPartName, slidePartName } from './part-names';
import { DEFAULT_SLIDE_LAYOUT_TYPE, isSlideLayoutType, SlideLayoutTypeValue } from './slide-layout-type';
import { applyLayoutPlaceholdersToSlide } from './layout-slide-placeholders';
import { DEFAULT_SLIDE_LAYOUT_LIST_ID, buildSlideLayoutXml, buildSlideXml } from './templates';
import { ColorMapping } from '../theme/color-mapping';
import { PackagePart } from '../package/package-model';
import { MutableOoxmlElement } from '../shapes/dom-utils';
import { OoxmlText } from '../xml/dom';
const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder('utf-8');
/**
 * Options for {@link SlideCollection.add}.
 */
export interface AddSlideOptions {
    /**
     * Predefined layout type (`ST_SlideLayoutType` token via {@link SlideLayoutType}).
     *
     * @remarks
     * When omitted, uses {@link DEFAULT_SLIDE_LAYOUT_TYPE} (`title`). The matching
     * layout part is reused when already present for the type; otherwise a new
     * `slideLayout{n}.xml` is allocated and wired to the first slide master
     * (master rel + `p:sldLayoutIdLst` + content type + layout→master rel).
     *
     * The new slide receives one placeholder shape for each non-footer
     * placeholder on that layout (`p:ph` type and idx copied from the layout
     * part). Blank layouts have only the date/footer/slide-number triple, so
     * a blank slide stays empty. Placeholder geometry is inherited from the
     * layout and is not written onto the slide.
     *
     * Citation: ECMA-376-1 §19.7.15; Transitional `pml.xsd` `ST_SlideLayoutType`.
     */
    readonly layout?: SlideLayoutTypeValue;
}
/**
 * Allocates a new slide at the end of `p:sldIdLst` / model order.
 *
 * @throws {Error} When `slideCount` would be exceeded.
 * @throws {Error} When ST_SlideId space is exhausted or the package lacks a usable slide master for layout allocation.
 * @throws {TypeError} When `options.layout` is not a public {@link SlideLayoutType} token.
 * @remarks - New `ST_SlideId` = max(existing, 255) + 1, must stay < 2147483648. - Existing slide `@id` values and part names are never
 * changed. - Order is append-only on the model list (flush writes `sldIdLst`). - Layout parts / master list ids already present are never
 * renumbered or renamed.
 * @param {OpcPackage} pkg - Mutable package owned by the document.
 * @param {PresentationModel} model - Live presentation model (slides array is mutated).
 * @param {AddSlideOptions} options - Optional {@link AddSlideOptions.layout} selection.
 * @returns {Slide} The new {@link Slide}.
 */
export function addSlideToPresentation(pkg: OpcPackage, model: PresentationModel, options: AddSlideOptions | Slide = {}): Slide {
    if (options instanceof Slide) {
        return importSlide(pkg, model, options);
    }
    const layoutType: SlideLayoutTypeValue = resolveLayoutType(options.layout);
    const nextCount: number = model.slides.length + 1;
    if (nextCount > pkg.limits.slideCount) {
        throw new PackageLimitError('slideCount', {
            partName: model.presentationPartName,
            actual: nextCount
        });
    }
    const slideId: string = allocateNextSlideId(model.slides);
    const partName: string = allocateNextSlidePartName(pkg);
    const relationshipId: string = allocateNextRelationshipId(((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(model.presentationPartName);
        return __rels != null ? __rels : [];
    })()));
    const layoutPartName: string = ensureLayoutPartForType(pkg, model, layoutType);
    const slideXml: string = buildSlideXml();
    pkg.contentTypes.overrides.set(partName, SLIDE_CONTENT_TYPE);
    const slideRels: PackageRelationship[] = [
        {
            id: 'rId1',
            type: SLIDE_LAYOUT_REL_TYPE,
            target: relativeTarget(partName, layoutPartName),
            targetMode: 'Internal',
            targetPartName: layoutPartName
        }
    ];
    pkg.partRelationships.set(partName, slideRels);
    const existingPresentationRels: PackageRelationship[] = ((function () : PackageRelationship[] {
        const __rels: Array<PackageRelationship> = pkg.partRelationships.get(model.presentationPartName);
        return __rels != null ? __rels.slice() : [];
    })());
    const newPresentationRel: PackageRelationship = {
        id: relationshipId,
        type: SLIDE_REL_TYPE,
        target: relativeTarget(model.presentationPartName, partName),
        targetMode: 'Internal',
        targetPartName: partName
    };
    const presentationRels: PackageRelationship[] = existingPresentationRels.concat([newPresentationRel]);
    pkg.partRelationships.set(model.presentationPartName, presentationRels);
    const slideRoot: OoxmlElement = parseXml(slideXml, { limits: pkg.limits, partName });
    const masterColorMap: ColorMapping = loadMasterColorMap(pkg);
    const layoutSlide: LayoutSlide = model.layoutsByPartName.get(layoutPartName);
    const layoutPh: ReadonlyArray<Shape> | undefined = layoutSlide == null
        ? undefined
        : layoutSlide.placeholderShapes;
    const layoutPlaceholderShapes: ReadonlyArray<Shape> = (layoutPh !== null && layoutPh !== undefined
        ? layoutPh
        : loadLayoutPlaceholderShapes(pkg, layoutPartName));
    applyLayoutPlaceholdersToSlide(slideRoot, layoutPlaceholderShapes);
    pkg.parts.set(partName, {
        name: partName,
        contentType: SLIDE_CONTENT_TYPE,
        data: encoder.encode(serializeXml(slideRoot))
    });
    const layoutOverride: ColorMapping = (layoutSlide == null ? undefined : layoutSlide.colorMapOverride);
    const slideOverride: SlideColorMapOverride = parseSlideColorMapOverride(slideRoot, partName);
    const baseMap: ColorMapping = (layoutOverride !== null && layoutOverride !== undefined ? layoutOverride : masterColorMap);
    const slideMap: ColorMapping = baseMap === undefined ? undefined : effectiveColorMap(baseMap, slideOverride);
    const masterPlaceholders: MasterPlaceholderData = loadMasterPlaceholderData(pkg);
    const defaultTextStyle: OoxmlElement = findDefaultTextStyle(model.root);
    const slide: Slide = new Slide({
        partName,
        slideId,
        relationshipId,
        root: slideRoot,
        limits: pkg.limits,
        layoutPartName,
        ...(slideMap === undefined ? {} : { effectiveColorMap: slideMap })
    });
    slide.attachPlaceholderIndexes(layoutPlaceholderShapes, (masterPlaceholders == null ? undefined : masterPlaceholders.shapes));
    slide.attachInheritanceSources({
        masterTxStyles: (masterPlaceholders == null ? undefined : masterPlaceholders.txStyles),
        defaultTextStyle
    });
    slide.attachMediaAccess(createPictureMediaAccess(pkg, partName));
    slide.attachLayoutMap(model.layoutsByPartName as Map<string, LayoutSlide>);
    slide.attachPartRelationships(((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(partName);
        return __rels != null ? __rels : [];
    })()));
    model.slides.push(slide);
    return slide;
}
/**
 * Appends a detached slide copy as a new slide part.
 *
 * @param {OpcPackage} pkg - Destination package.
 * @param {PresentationModel} model - Destination model.
 * @param {Slide} source - Detached slide, such as one from {@link Section.clone}.
 * @returns {Slide} The imported slide.
 */
function importSlide(pkg: OpcPackage, model: PresentationModel, source: Slide): Slide {
    if (model.slides.indexOf(source) >= 0) {
        throw new PresentationError('model/invalid-argument', 'Slide is already in this presentation.');
    }
    const nextCount: number = model.slides.length + 1;
    if (nextCount > pkg.limits.slideCount) {
        throw new PackageLimitError('slideCount', { partName: model.presentationPartName, actual: nextCount });
    }
    const sourceLayout: string | undefined = source.getLayoutPartName();
    const layoutPartName: string = sourceLayout === undefined
        ? fallbackLayoutPartName(model)
        : sourceLayout;
    if (!model.layoutsByPartName.has(layoutPartName)) {
        throw new PresentationError('model/invalid-argument', `Layout '${layoutPartName}' is not in this presentation.`);
    }
    const slideId: string = allocateNextSlideId(model.slides);
    const partName: string = allocateNextSlidePartName(pkg);
    const relationshipId: string = allocateNextRelationshipId(((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(model.presentationPartName);
        return __rels != null ? __rels : [];
    })()));
    const slideRoot: OoxmlElement = parseXml(serializeXml(source.getRoot()), { limits: pkg.limits, partName });
    pkg.contentTypes.overrides.set(partName, SLIDE_CONTENT_TYPE);
    pkg.partRelationships.set(partName, [{
        id: 'rId1',
        type: SLIDE_LAYOUT_REL_TYPE,
        target: relativeTarget(partName, layoutPartName),
        targetMode: 'Internal',
        targetPartName: layoutPartName
    }]);
    const existingPresentationRels: PackageRelationship[] = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(model.presentationPartName);
        return __rels != null ? __rels.slice() : [];
    })());
    pkg.partRelationships.set(model.presentationPartName, existingPresentationRels.concat([{
        id: relationshipId,
        type: SLIDE_REL_TYPE,
        target: relativeTarget(model.presentationPartName, partName),
        targetMode: 'Internal',
        targetPartName: partName
    }]));
    pkg.parts.set(partName, {
        name: partName,
        contentType: SLIDE_CONTENT_TYPE,
        data: encoder.encode(serializeXml(slideRoot))
    });
    const layoutSlide: LayoutSlide = model.layoutsByPartName.get(layoutPartName);
    const masterColorMap: ColorMapping = loadMasterColorMap(pkg);
    const layoutOverride: ColorMapping = layoutSlide == null ? undefined : layoutSlide.colorMapOverride;
    const slideOverride: SlideColorMapOverride = parseSlideColorMapOverride(slideRoot, partName);
    const baseMap: ColorMapping = (layoutOverride !== null && layoutOverride !== undefined ? layoutOverride : masterColorMap);
    const slideMap: ColorMapping = baseMap === undefined ? undefined : effectiveColorMap(baseMap, slideOverride);
    const masterPlaceholders: MasterPlaceholderData = loadMasterPlaceholderData(pkg);
    const slide: Slide = new Slide({
        partName,
        slideId,
        relationshipId,
        root: slideRoot,
        limits: pkg.limits,
        layoutPartName,
        ...(slideMap === undefined ? {} : { effectiveColorMap: slideMap })
    });
    const layoutPlaceholderShapes: ReadonlyArray<Shape> = layoutSlide == null
        ? loadLayoutPlaceholderShapes(pkg, layoutPartName)
        : layoutSlide.placeholderShapes;
    slide.attachPlaceholderIndexes(layoutPlaceholderShapes, masterPlaceholders == null ? undefined : masterPlaceholders.shapes);
    slide.attachInheritanceSources({
        masterTxStyles: masterPlaceholders == null ? undefined : masterPlaceholders.txStyles,
        defaultTextStyle: findDefaultTextStyle(model.root)
    });
    slide.attachMediaAccess(createPictureMediaAccess(pkg, partName));
    slide.attachLayoutMap(model.layoutsByPartName as Map<string, LayoutSlide>);
    slide.attachPartRelationships(((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(partName);
        return __rels != null ? __rels : [];
    })()));
    model.slides.push(slide);
    return slide;
}

/**
 * Layout used when an imported slide has no layout of its own.
 *
 * @param {PresentationModel} model - Destination model.
 * @returns {string} Layout part name.
 */
function fallbackLayoutPartName(model: PresentationModel): string {
    const first: Slide = arrayAt(model.slides, 0);
    const firstLayout: string | undefined = first === undefined ? undefined : first.getLayoutPartName();
    if (firstLayout !== undefined && model.layoutsByPartName.has(firstLayout)) {
        return firstLayout;
    }
    const names: string[] = [];
    model.layoutsByPartName.forEach(function (_layout: LayoutSlide, name: string): void {
        names.push(name);
    });
    if (names.length === 0) {
        throw new PresentationError('model/invalid-argument', 'Presentation has no slide layout to host an imported slide.');
    }
    return arrayAt(names, 0);
}

/**
 *
 * @param {string | undefined} layout - The layout value.
 * @returns {SlideLayoutTypeValue} The result.
 */
function resolveLayoutType(layout: string | undefined): SlideLayoutTypeValue {
    if (layout === undefined) {
        return DEFAULT_SLIDE_LAYOUT_TYPE;
    }
    if (!isSlideLayoutType(layout)) {
        throw new TypeError(`Invalid slide layout type "${layout}". Use SlideLayoutType.* tokens (ST_SlideLayoutType).`);
    }
    return layout;
}
/**
 * Returns the layout part URI for `layoutType`, creating package + model entries
 * on first use.
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {PresentationModel} model - The model value.
 * @param {SlideLayoutTypeValue} layoutType - The layoutType value.
 * @returns {string} The result.
 */
function ensureLayoutPartForType(pkg: OpcPackage, model: PresentationModel, layoutType: SlideLayoutTypeValue): string {
    // Create packages ship all eleven layouts from defaultContent.zip; reuse by type.
    const existing: string | undefined = findLayoutPartByType(model, layoutType);
    if (existing !== undefined) {
        return existing;
    }
    return allocateAndRegisterLayout(pkg, model, layoutType);
}
/**
 *
 * @param {PresentationModel} model - The model value.
 * @param {SlideLayoutTypeValue} layoutType - The layoutType value.
 * @returns {string | undefined} The result.
 */
function findLayoutPartByType(model: PresentationModel, layoutType: SlideLayoutTypeValue): string | undefined {
    const entries: Array<[string, LayoutSlide]> = Array.from(model.layoutsByPartName.entries());
    for (let i: number = 0; i < entries.length; i++) {
        const partName: string = arrayAt(entries, i)[0];
        const layout: LayoutSlide = arrayAt(entries, i)[1];
        if (layout.type === layoutType) {
            return partName;
        }
    }
    return undefined;
}
/**
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {PresentationModel} model - The model value.
 * @param {SlideLayoutTypeValue} layoutType - The layoutType value.
 * @returns {string} The result.
 */
function allocateAndRegisterLayout(pkg: OpcPackage, model: PresentationModel, layoutType: SlideLayoutTypeValue): string {
    const master: MasterSlide = model.masters[0];
    if (master === undefined) {
        throw new InvalidPackageError('Cannot allocate slide layout: presentation has no slide master',
                                      { partName: model.presentationPartName });
    }
    const layoutPartName: string = allocateNextLayoutPartName(pkg);
    const layoutXml: string = buildSlideLayoutXml(layoutType);
    pkg.parts.set(layoutPartName, {
        name: layoutPartName,
        contentType: SLIDE_LAYOUT_CONTENT_TYPE,
        data: encoder.encode(layoutXml)
    });
    pkg.contentTypes.overrides.set(layoutPartName, SLIDE_LAYOUT_CONTENT_TYPE);
    // layout → master (required by LayoutSlide load rules).
    pkg.partRelationships.set(layoutPartName, [
        {
            id: CREATE_LAYOUT_MASTER_REL_ID,
            type: SLIDE_MASTER_REL_TYPE,
            target: master.partName,
            targetMode: 'Internal',
            targetPartName: master.partName
        }
    ]);
    const masterRels: Array<PackageRelationship> = [...(((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(master.partName);
        return __rels != null ? __rels : [];
    })()))];
    const masterLayoutRelId: string = allocateNextRelationshipId(masterRels);
    masterRels.push({
        id: masterLayoutRelId,
        type: SLIDE_LAYOUT_REL_TYPE,
        target: layoutPartName,
        targetMode: 'Internal',
        targetPartName: layoutPartName
    });
    pkg.partRelationships.set(master.partName, masterRels);
    const layoutListId: string = allocateNextLayoutListId(pkg, master.partName);
    appendMasterLayoutIdEntry(pkg, model, master, layoutListId, masterLayoutRelId);
    const layout: LayoutSlide = buildLayoutSlideForCreate(pkg, layoutPartName, master);
    (model.layoutsByPartName as Map<string, LayoutSlide>).set(layoutPartName, layout);
    master._addLayout(layout);
    return layoutPartName;
}
/**
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @returns {string} The result.
 */
function allocateNextLayoutPartName(pkg: OpcPackage): string {
    let n: number = 1;
    for (;;) {
        const name: string = slideLayoutPartName(n);
        if (!pkg.parts.has(name)) {
            return name;
        }
        n += 1;
        if (n > 1000000) {
            throw new InvalidPackageError('Cannot allocate slide layout part name: exhausted search', {});
        }
    }
}
/**
 * Next `ST_SlideLayoutId`: max(existing list ids, 2147483647) + 1.
 * Citation: Transitional `pml.xsd` `ST_SlideLayoutId` minInclusive 2147483648.
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {string} masterPartName - The masterPartName value.
 * @returns {string} The result.
 */
function allocateNextLayoutListId(pkg: OpcPackage, masterPartName: string): string {
    const part: PackagePart = pkg.parts.get(masterPartName);
    if (part === undefined) {
        throw new InvalidPackageError(`Slide master "${masterPartName}" is not present in the package`, { partName: masterPartName });
    }
    const root: OoxmlElement = parseXml(decoder.decode(part.data), {
        limits: pkg.limits,
        partName: masterPartName
    });
    let maxId: number = Number(DEFAULT_SLIDE_LAYOUT_LIST_ID) - 1;
    const list: OoxmlElement = findChild(root, PML_NS, 'sldLayoutIdLst');
    if (list !== undefined) {
        for (let i: number = 0; i < list.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(list.children, i);
            if (child.kind !== 'element' || child.localName !== 'sldLayoutId') {
                continue;
            }
            const id: string = getAttr(child, '', 'id');
            if (id === undefined || !/^\d+$/u.test(id)) {
                continue;
            }
            const n: number = Number(id);
            if (Number.isSafeInteger(n) && n > maxId) {
                maxId = n;
            }

        }
    }
    const next: number = maxId + 1;
    if (next < Number(DEFAULT_SLIDE_LAYOUT_LIST_ID)) {
        throw new InvalidPackageError(`Cannot allocate ST_SlideLayoutId: next value ${String(next)} is below minInclusive ${DEFAULT_SLIDE_LAYOUT_LIST_ID}`, { partName: masterPartName });
    }
    return String(next);
}
/**
 * Appends `p:sldLayoutId` to the master part XML and keeps the live
 * {@link MasterSlide} root in sync (flush serializes that root).
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {PresentationModel} model - The model value.
 * @param {MasterSlide} master - The master value.
 * @param {string} layoutListId - The layoutListId value.
 * @param {string} layoutRelId - The layoutRelId value.
 * @returns {void} Nothing.
 */
function appendMasterLayoutIdEntry(pkg: OpcPackage, model: PresentationModel, master: MasterSlide, layoutListId: string,
                                   layoutRelId: string): void {
    const masterPartName: string = master.partName;
    const part: PackagePart = pkg.parts.get(masterPartName);
    if (part === undefined) {
        throw new InvalidPackageError(`Slide master "${masterPartName}" is not present in the package`, { partName: masterPartName });
    }
    // Prefer the live model root so prior shape adds are not discarded.
    const live: MasterSlide = model.masters.find((m: MasterSlide) => m.partName === masterPartName);
    const root: OoxmlElement = live !== undefined
        ? live.getRoot()
        : parseXml(decoder.decode(part.data), {
            limits: pkg.limits,
            partName: masterPartName
        });
    const mutableRoot: MutableOoxmlElement = asMutable(root);
    let list: OoxmlElement = findChild(root, PML_NS, 'sldLayoutIdLst');
    if (list === undefined) {
        list = {
            kind: 'element' as 'element',
            localName: 'sldLayoutIdLst',
            namespaceUri: PML_NS,
            prefixHint: 'p',
            attributes: [],
            children: []
        };
        // Insert after clrMap when present; else append.
        const clrMapIndex: number = mutableRoot.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' &&
            c.namespaceUri === PML_NS && c.localName === 'clrMap');
        if (clrMapIndex >= 0) {
            mutableRoot.children.splice(clrMapIndex + 1, 0, list);
        }
        else {
            mutableRoot.children.push(list);
        }
    }
    const mutableList: MutableOoxmlElement = asMutable(list);
    const entryAttributes: OoxmlAttribute[] = [
        { namespaceUri: '', localName: 'id', value: layoutListId },
        { namespaceUri: OFFICE_REL_ATTR_NS, localName: 'id', value: layoutRelId, prefix: 'r' }
    ];
    mutableList.children.push({
        kind: 'element' as 'element',
        localName: 'sldLayoutId',
        namespaceUri: PML_NS,
        prefixHint: 'p',
        attributes: entryAttributes,
        children: []
    });
    // Package bytes stay current for allocateNextLayoutListId re-reads; flush
    // will re-serialize the live root (including this list entry).
    pkg.parts.set(masterPartName, {
        ...part,
        data: encoder.encode(serializeXml(root))
    });
    if (live !== undefined && live.getRoot() !== root) {
        live.replaceRoot(root);
    }
}
/**
 * Minimal LayoutSlide construction mirroring load `buildLayoutSlide` for create path.
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {string} layoutPartName - The layoutPartName value.
 * @param {MasterSlide} master - The master value.
 * @returns {LayoutSlide} The result.
 */
function buildLayoutSlideForCreate(pkg: OpcPackage, layoutPartName: string, master: MasterSlide): LayoutSlide {
    const part: PackagePart = pkg.parts.get(layoutPartName);
    if (part === undefined) {
        throw new InvalidPackageError(`Relationship target "${layoutPartName}" is not present in the package`,
                                      { partName: layoutPartName });
    }
    const root: OoxmlElement = parseXml(decoder.decode(part.data), {
        limits: pkg.limits,
        partName: layoutPartName
    });
    if (root.localName !== 'sldLayout' || root.namespaceUri !== PML_NS) {
        throw new InvalidPackageError('Part root must be p:sldLayout in the PresentationML namespace', {
            partName: layoutPartName
        });
    }
    const layoutRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(layoutPartName);
        return __rels != null ? __rels : [];
    })());
    const hasMasterRel: boolean = layoutRels.some((r: PackageRelationship) => r.type === SLIDE_MASTER_REL_TYPE &&
        r.targetMode === 'Internal' &&
        r.targetPartName !== undefined);
    if (!hasMasterRel) {
        throw new InvalidPackageError(`Slide layout "${layoutPartName}" has no Internal slideMaster relationship`,
                                      { partName: layoutPartName });
    }
    const layoutType: string = getAttr(root, '', 'type');
    const showMasterSpAttr: string = getAttr(root, '', 'showMasterSp');
    const showMasterShapes: boolean = showMasterSpAttr === undefined || showMasterSpAttr !== '0';
    const cSld: OoxmlElement = findChild(root, PML_NS, 'cSld');
    const layoutName: string = cSld !== undefined ? getAttr(cSld, '', 'name') : undefined;
    const rawClrMapOvr: SlideColorMapOverride = parseSlideColorMapOverride(root, layoutPartName);
    const colorMapOverride: ColorMapping = rawClrMapOvr === undefined || rawClrMapOvr === 'master' ? undefined : rawClrMapOvr;
    const placeholderShapes: Array<Shape> = walkSlideShapeTree(root, pkg.limits, layoutPartName);
    const layout: LayoutSlide = new LayoutSlide({
        partName: layoutPartName,
        type: layoutType,
        name: layoutName,
        showMasterShapes,
        colorMapOverride,
        placeholderShapes,
        master,
        root,
        limits: pkg.limits
    });
    layout.attachMediaAccess(createPictureMediaAccess(pkg, layoutPartName));
    return layout;
}
/**
 * Next `ST_SlideId` string: max(existing numeric ids, 255) + 1.
 *
 * Citation: `docs/specs/013-create-skeleton.md` ID allocators; `pml.xsd` ST_SlideId.
 *
 * @param {*} slides - The slides value.
 * @returns {string} The result.
 */
export function allocateNextSlideId(slides: ReadonlyArray<Slide>): string {
    let maxId: number = ST_SLIDE_ID_MIN - 1;
    for (let i: number = 0; i < slides.length; i++) {
        const s: Slide = arrayAt(slides, i);
        if (!/^\d+$/u.test(s.slideId)) {
            continue;
        }
        const n: number = Number(s.slideId);
        if (Number.isSafeInteger(n) && n > maxId) {
            maxId = n;
        }

    }
    const next: number = maxId + 1;
    if (next < ST_SLIDE_ID_MIN || next >= ST_SLIDE_ID_MAX_EXCLUSIVE) {
        throw new InvalidPackageError(`Cannot allocate ST_SlideId: next value ${String(next)} is outside [${String(ST_SLIDE_ID_MIN)},
            ${String(ST_SLIDE_ID_MAX_EXCLUSIVE)})`, {});
    }
    return String(next);
}
/**
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @returns {string} The result.
 */
function allocateNextSlidePartName(pkg: OpcPackage): string {
    let n: number = 1;
    for (;;) {
        const name: string = slidePartName(n);
        if (!pkg.parts.has(name)) {
            return name;
        }
        n += 1;
        if (n > 1000000) {
            throw new InvalidPackageError('Cannot allocate slide part name: exhausted search', {});
        }
    }
}
interface MasterPlaceholderData {
    readonly shapes: ReadonlyArray<Shape>;
    readonly txStyles: OoxmlElement | undefined;
}
/**
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @returns {MasterPlaceholderData | undefined} The result.
 */
function loadMasterPlaceholderData(pkg: OpcPackage): MasterPlaceholderData | undefined {
    const presentationRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(pkg.presentationPartName);
        return __rels != null ? __rels : [];
    })());
    for (let i: number = 0; i < presentationRels.length; i++) {
        const rel: PackageRelationship = arrayAt(presentationRels, i);
        if (rel.type !== SLIDE_MASTER_REL_TYPE ||
            rel.targetMode !== 'Internal' ||
            rel.targetPartName === undefined) {
            continue;
        }
        const walked: { readonly root: OoxmlElement; readonly shapes: ReadonlyArray<Shape>; } = walkPlaceholderPart(pkg, rel.targetPartName,
                                                                                                                    'sldMaster');
        return {
            shapes: walked.shapes,
            txStyles: findMasterTxStyles(walked.root)
        };

    }
    return undefined;
}
/**
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {string} slidePartNameForRels - The slidePartNameForRels value.
 * @returns {*} The result.
 */
function loadLayoutPlaceholderShapes(pkg: OpcPackage, slidePartNameForRels: string): ReadonlyArray<Shape> | undefined {
    const slideRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(slidePartNameForRels);
        return __rels != null ? __rels : [];
    })());
    for (let i: number = 0; i < slideRels.length; i++) {
        const rel: PackageRelationship = arrayAt(slideRels, i);
        if (rel.type !== SLIDE_LAYOUT_REL_TYPE ||
            rel.targetMode !== 'Internal' ||
            rel.targetPartName === undefined) {
            continue;
        }
        return walkPlaceholderPart(pkg, rel.targetPartName, 'sldLayout').shapes;

    }
    return undefined;
}
/**
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @param {string} partName - The partName value.
 * @param {*} expectedRootLocalName - The expectedRootLocalName value.
 * @returns {*} The result.
 */
function walkPlaceholderPart(pkg: OpcPackage, partName: string, expectedRootLocalName: 'sldLayout' | 'sldMaster'): {
    readonly root: OoxmlElement;
    readonly shapes: ReadonlyArray<Shape>;
} {
    const part: PackagePart = pkg.parts.get(partName);
    if (part === undefined) {
        throw new InvalidPackageError(`Relationship target "${partName}" is not present in the package`, { partName });
    }
    const text: string = decoder.decode(part.data);
    const root: OoxmlElement = parseXml(text, { limits: pkg.limits, partName });
    if (root.localName !== expectedRootLocalName || root.namespaceUri !== PML_NS) {
        throw new InvalidPackageError(`Part root must be p:${expectedRootLocalName} in the PresentationML namespace`, { partName });
    }
    return {
        root,
        shapes: walkSlideShapeTree(root, pkg.limits, partName)
    };
}
