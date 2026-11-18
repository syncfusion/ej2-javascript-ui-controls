/**
 * Consumer hyperlink facade (`setHyperlink` / `hyperlink` / `removeHyperlink`).
 *
 * @remarks
 * Click only. Hover and `hlinkMouseOver` are not dropped. Targets are never fetched
 * and `ppaction://` is never invoked.
 *
 * Citations:
 * - Transitional `dml-main.xsd` `CT_Hyperlink` (`r:id`, `action`, `tooltip`)
 * - ECMA-376-4 hyperlink relationship type (`HYPERLINK_REL_TYPE`)
 * - [MS-OI29500] `ppaction://hlinksldjump` — `r:id` names the slide relationship
 * - [MS-OI29500] `ppaction://hlinkfile` — `r:id` names the external file (also used by
 *   the inspected Syncfusion Presentation fixture for URL targets)
 * - ECMA-376 Part 2 relationship `TargetMode` (`External` for URL, mailto, and file)
 *
 * @internal
 */
import { relativeTarget, resolveInternalTarget } from '../../core/package/paths';
import { HostPartRelationshipAccess } from '../../core/package/host-part-relationship-access';
import { PackageRelationship } from '../../core/package/relationships';
import { Picture } from '../../core/pictures/picture';
import { Presentation } from '../../core/package/presentation';
import { HyperlinkView } from '../../core/slideimplementation/slide';
import { Slide } from '../../core/slideimplementation/slide';

import { Shape } from '../../core/shapes/shape';
import { asMutable, getAttr, MutableOoxmlElement } from '../../core/shapes/dom-utils';
import { TextPart } from '../../core/text/text-part';
import { OoxmlAttribute, OoxmlElement } from '../../core/xml/index';
import { allocateNextRelationshipId } from '../../core/package/allocate-relationship-id';
import { PackageLimitError } from '../../core/security/errors';
import { HYPERLINK_REL_TYPE } from './constants';
import { appendChildElement, buildEmptyRunProperties, buildHyperlinkElement } from './hyperlink-dom';
import { addExternalHyperlink } from './add-external-hyperlink';
import { clearHyperlink } from './clear-hyperlink';
import { HyperlinkMutationError } from './errors';
import { readHyperlinkRelationshipId } from './hyperlink-dom';
import { parseHyperlinkElement } from './parse-hyperlink';
import { locateRunHyperlink, locateShapeHyperlink } from './resolve-hyperlink-target';
import { retargetExternal } from './retarget-hyperlink';

/**
 * Slide-jump action. Data only — never invoked.
 * Citation: [MS-OI29500] `ppaction://hlinksldjump`.
 */
const SLIDE_JUMP_ACTION: string = 'ppaction://hlinksldjump';

/**
 * External file (and, in the Syncfusion fixture, URL) action. Data only.
 * Citation: [MS-OI29500] `ppaction://hlinkfile`.
 */
const FILE_ACTION: string = 'ppaction://hlinkfile';

/**
 * Classifies a `setHyperlink` argument.
 *
 * Decimal strings are 1-based slide indexes. `mailto:` and any other scheme are
 * external. Everything else is a file name stored as an external Target.
 *
 * @param target - Caller argument.
 * @returns Classification.
 */
export function classifyHyperlinkTarget(target: string): 'slide' | 'external' | 'file' {
    if (/^[1-9][0-9]*$/u.test(target)) {
        return 'slide';
    }
    const scheme: number = target.indexOf(':');
    if (scheme > 0 && !target.slice(0, scheme).includes('/') && !target.slice(0, scheme).includes('\\')) {
        return 'external';
    }
    return 'file';
}

/**
 * @param shape - Shape or picture-backed shape.
 * @returns Owning slide when the shape is in that slide's tree.
 */
function slideForShape(shape: Shape): Slide {
    const partName: string | undefined = shape.getPartName();
    const presentation: Presentation | undefined = findPresentation(shape);
    if (partName === undefined || presentation === undefined) {
        throw new HyperlinkMutationError('Shape is not bound to a slide; cannot set a hyperlink');
    }
    const slides: ReadonlyArray<Slide> = presentation.slides;
    for (let i: number = 0; i < slides.length; i += 1) {
        const slide: Slide = slides[i];
        if (slide.partName === partName) {
            return slide;
        }
    }
    throw new HyperlinkMutationError('Owning slide was not found for this shape', { partName });
}

/**
 * Walks from the shape host root is not available here; the presentation is
 * reached through the slide list that contains this part name. Shape does not
 * store Presentation. Callers pass the slide via part-name match on the
 * document that last bound the shape — see {@link bindFacadePresentation}.
 */
const boundPresentations: Presentation[] = [];
let boundPresentation: Presentation | undefined;

/**
 * Binds the document used to resolve slide indexes and relationship bags.
 * Set by methods that already hold the slide. Tests and the public methods
 * rebind from the shape's part by scanning the last presentation that
 * registered itself.
 *
 * @param presentation - Document that owns the slides being edited.
 */
export function bindFacadePresentation(presentation: Presentation): void {
    boundPresentation = presentation;
    if (boundPresentations.indexOf(presentation) < 0) {
        boundPresentations.push(presentation);
    }
}

function findPresentation(shape: Shape): Presentation | undefined {
    const partName: string | undefined = shape.getPartName();
    if (partName === undefined) {
        return boundPresentation;
    }
    for (let p: number = boundPresentations.length - 1; p >= 0; p -= 1) {
        const candidate: Presentation = boundPresentations[p];
        const slides: ReadonlyArray<Slide> = candidate.slides;
        for (let i: number = 0; i < slides.length; i += 1) {
            if (slides[i].partName === partName && slides[i].getRoot() === shape.getHostRoot()) {
                return candidate;
            }
        }
    }
    return boundPresentation;
}

function requireSlide(shape: Shape): Slide {
    const presentation: Presentation | undefined = findPresentation(shape);
    if (presentation === undefined) {
        throw new HyperlinkMutationError('Hyperlink authoring requires a presentation-bound shape');
    }
    bindFacadePresentation(presentation);
    return slideForShape(shape);
}

function accessFor(slide: Slide): HostPartRelationshipAccess {
    const presentation: Presentation | undefined = slide.getPresentation();
    if (presentation === undefined) {
        throw new HyperlinkMutationError('Slide is not bound to a presentation', { partName: slide.partName });
    }
    bindFacadePresentation(presentation);
    return presentation.hostPartRelationshipAccess(slide.partName);
}

function shapeFromPicture(picture: Picture): Shape {
    const partName: string | undefined = picture.getMutationPartName();
    const hostRoot: OoxmlElement | undefined = picture.getHostRoot();
    if (partName === undefined || hostRoot === undefined || boundPresentation === undefined) {
        throw new HyperlinkMutationError('Picture is not bound to a slide');
    }
    const slides: ReadonlyArray<Slide> = boundPresentation.slides;
    for (let i: number = 0; i < slides.length; i += 1) {
        if (slides[i].partName !== partName) {
            continue;
        }
        const shapes: ReadonlyArray<Shape> = slides[i].shapes;
        for (let s: number = 0; s < shapes.length; s += 1) {
            if (shapes[s].asPicture() !== undefined && shapes[s].getElement() === picture.getElement()) {
                return shapes[s];
            }
        }
    }
    throw new HyperlinkMutationError('Picture shape was not found on its slide', { partName });
}

function setOnShape(shape: Shape, target: string): HyperlinkView {
    const slide: Slide = requireSlide(shape);
    const access: HostPartRelationshipAccess = accessFor(slide);
    const kind: 'slide' | 'external' | 'file' = classifyHyperlinkTarget(target);
    if (kind === 'slide') {
        setSlideJump(shape, slide, access, target);
    }
    else {
        setExternal(shape, access, slide, target);
    }
    const view: HyperlinkView | undefined = readShape(shape);
    if (view === undefined) {
        throw new HyperlinkMutationError('Hyperlink was not written', { partName: slide.partName });
    }
    return view;
}

function setExternal(shape: Shape, access: HostPartRelationshipAccess, slide: Slide, url: string): void {
    const located = locateShapeHyperlink(shape, 'click');
    if (located === undefined) {
        throw new HyperlinkMutationError('Shape cNvPr missing; cannot add hyperlink', { partName: slide.partName });
    }
    if (located.element === undefined) {
        addExternalHyperlink(shape, 'click', access, url);
        stampFileAction(shape);
        return;
    }
    const action: string | undefined = getAttr(located.element, '', 'action');
    if (action === SLIDE_JUMP_ACTION) {
        clearHyperlink(shape, 'click', access, slide.getRoot());
        addExternalHyperlink(shape, 'click', access, url);
        stampFileAction(shape);
        return;
    }
    const rId: string | undefined = readHyperlinkRelationshipId(located.element);
    if (rId === undefined) {
        clearHyperlink(shape, 'click', access, slide.getRoot());
        addExternalHyperlink(shape, 'click', access, url);
        stampFileAction(shape);
        return;
    }
    retargetExternal(shape, 'click', access, url);
    stampFileAction(shape);
}

function stampFileAction(shape: Shape): void {
    const located = locateShapeHyperlink(shape, 'click');
    if (located !== undefined && located.element !== undefined) {
        setActionAttribute(located.element, FILE_ACTION);
    }
}

function setSlideJump(shape: Shape, slide: Slide, access: HostPartRelationshipAccess, indexText: string): void {
    const index: number = Number(indexText);
    const presentation: Presentation | undefined = slide.getPresentation();
    if (presentation === undefined) {
        throw new HyperlinkMutationError('Slide is not bound to a presentation', { partName: slide.partName });
    }
    const slides: ReadonlyArray<Slide> = presentation.slides;
    if (!Number.isFinite(index) || index < 1 || index > slides.length) {
        throw new HyperlinkMutationError(`Slide index "${indexText}" is out of range`, { partName: slide.partName });
    }
    const targetSlide: Slide = slides[index - 1];
    const internalTarget: string = relativeTarget(slide.partName, targetSlide.partName);
    resolveInternalTarget(slide.partName, internalTarget);
    const located = locateShapeHyperlink(shape, 'click');
    if (located === undefined) {
        throw new HyperlinkMutationError('Shape cNvPr missing; cannot add hyperlink', { partName: slide.partName });
    }
    if (located.element !== undefined) {
        clearHyperlink(shape, 'click', access, slide.getRoot());
    }
    const relationshipId: string = allocateRelationship(access, internalTarget, 'Internal', targetSlide.partName);
    const hlink: OoxmlElement = buildHyperlinkElement('hlinkClick', relationshipId, {});
    setActionAttribute(hlink, SLIDE_JUMP_ACTION);
    appendChildElement(located.parent, hlink);
}

function allocateRelationship(access: HostPartRelationshipAccess, target: string,
                              targetMode: 'External' | 'Internal', targetPartName: string | undefined): string {
    const existing: ReadonlyArray<PackageRelationship> = access.getRelationships();
    if (existing.length + 1 > access.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName: access.partName,
            actual: existing.length + 1
        });
    }
    const relationshipId: string = allocateNextRelationshipId(existing);
    access.replaceRelationships([...existing, {
        id: relationshipId,
        type: HYPERLINK_REL_TYPE,
        target,
        targetMode,
        targetPartName
    }]);
    return relationshipId;
}

function setActionAttribute(element: OoxmlElement, action: string): void {
    const mutable: MutableOoxmlElement = asMutable(element);
    const attributes: OoxmlAttribute[] = [];
    for (let i: number = 0; i < mutable.attributes.length; i += 1) {
        const attribute: OoxmlAttribute = mutable.attributes[i];
        if (attribute.localName === 'action' && attribute.namespaceUri === '') {
            continue;
        }
        attributes.push(attribute);
    }
    attributes.push({ namespaceUri: '', localName: 'action', value: action });
    mutable.attributes = attributes;
}

function readShape(shape: Shape): HyperlinkView | undefined {
    const located = locateShapeHyperlink(shape, 'click');
    if (located === undefined || located.element === undefined) {
        return undefined;
    }
    let slide: Slide | undefined;
    try {
        slide = requireSlide(shape);
    }
    catch {
        return undefined;
    }
    return viewFor(located.element, slide);
}

function viewFor(element: OoxmlElement, slide: Slide): HyperlinkView {
    const presentation: Presentation | undefined = slide.getPresentation();
    const relationships: ReadonlyArray<PackageRelationship> = presentation === undefined
        ? []
        : presentation.getRelationships(slide.partName);
    const info = parseHyperlinkElement(element, 'shape-click', relationships);
    const actionRaw: string | undefined = info.action;
    let action: string = 'unknown';
    let url: string | undefined = info.targetMode === 'External' ? info.target : undefined;
    let targetSlide: Slide | undefined;
    if (actionRaw === SLIDE_JUMP_ACTION) {
        action = 'slide';
        url = undefined;
        targetSlide = resolveTargetSlide(slide, info.targetPartName);
    }
    else if (url !== undefined && url.indexOf('mailto:') === 0) {
        action = 'mail';
    }
    else if (url !== undefined && classifyHyperlinkTarget(url) === 'file') {
        action = 'file';
    }
    else if (url !== undefined) {
        action = 'url';
    }
    else if (actionRaw !== undefined && actionRaw.length > 0) {
        action = 'unknown';
    }
    const view: HyperlinkView = {
        action,
        url,
        targetSlide,
        get screenTip(): string | undefined {
            return getAttr(element, '', 'tooltip');
        },
        set screenTip(value: string | undefined) {
            setScreenTip(view, value);
        }
    };
    // Setter above calls facade which needs the element. Attach via closure in setScreenTipImpl.
    screenTipElements.set(view, element);
    return view;
}

const screenTipElements: WeakMap<HyperlinkView, OoxmlElement> = new WeakMap();

function resolveTargetSlide(host: Slide, targetPartName: string | undefined): Slide | undefined {
    if (targetPartName === undefined) {
        return undefined;
    }
    const presentation: Presentation | undefined = host.getPresentation();
    if (presentation === undefined) {
        return undefined;
    }
    const slides: ReadonlyArray<Slide> = presentation.slides;
    for (let i: number = 0; i < slides.length; i += 1) {
        if (slides[i].partName === targetPartName) {
            return slides[i];
        }
    }
    return undefined;
}

function removeShape(shape: Shape): void {
    const located = locateShapeHyperlink(shape, 'click');
    if (located === undefined || located.element === undefined) {
        return;
    }
    const slide: Slide = requireSlide(shape);
    clearHyperlink(shape, 'click', accessFor(slide), slide.getRoot());
}

function setOnText(textPart: TextPart, target: string): HyperlinkView {
    const shapeSlide: Slide | undefined = slideForPart(textPart.getPartName());
    if (shapeSlide === undefined) {
        throw new HyperlinkMutationError('Text part is not bound to a slide');
    }
    const access: HostPartRelationshipAccess = accessFor(shapeSlide);
    const kind: 'slide' | 'external' | 'file' = classifyHyperlinkTarget(target);
    const located = locateRunHyperlink(textPart, 'click');
    if (located.element !== undefined) {
        clearHyperlink(textPart, 'click', access, shapeSlide.getRoot());
    }
    if (kind === 'slide') {
        const presentation: Presentation | undefined = shapeSlide.getPresentation();
        const index: number = Number(target);
        if (presentation === undefined || index < 1 || index > presentation.slides.length) {
            throw new HyperlinkMutationError(`Slide index "${target}" is out of range`, { partName: shapeSlide.partName });
        }
        const targetSlide: Slide = presentation.slides[index - 1];
        const internalTarget: string = relativeTarget(shapeSlide.partName, targetSlide.partName);
        const relationshipId: string = allocateRelationship(access, internalTarget, 'Internal', targetSlide.partName);
        const parent: OoxmlElement = ensureRunProperties(textPart);
        const hlink: OoxmlElement = buildHyperlinkElement('hlinkClick', relationshipId, {});
        setActionAttribute(hlink, SLIDE_JUMP_ACTION);
        appendChildElement(parent, hlink);
    }
    else {
        addExternalHyperlink(textPart, 'click', access, target);
        const written = locateRunHyperlink(textPart, 'click');
        if (written.element !== undefined) {
            setActionAttribute(written.element, FILE_ACTION);
        }
    }
    const view: HyperlinkView | undefined = readText(textPart);
    if (view === undefined) {
        throw new HyperlinkMutationError('Hyperlink was not written', { partName: shapeSlide.partName });
    }
    return view;
}

function ensureRunProperties(textPart: TextPart): OoxmlElement {
    const located = locateRunHyperlink(textPart, 'click');
    if (located.parent !== undefined) {
        return located.parent;
    }
    const parent: OoxmlElement = buildEmptyRunProperties();
    const mutable = asMutable(located.runElement);
    let insertAt: number = mutable.children.length;
    for (let i: number = 0; i < mutable.children.length; i += 1) {
        const child = mutable.children[i];
        if (child !== undefined && child.kind === 'element') {
            insertAt = i;
            break;
        }
    }
    mutable.children.splice(insertAt, 0, parent);
    return parent;
}

function slideForPart(partName: string | undefined): Slide | undefined {
    if (partName === undefined) {
        return undefined;
    }
    for (let p: number = boundPresentations.length - 1; p >= 0; p -= 1) {
        const slides: ReadonlyArray<Slide> = boundPresentations[p].slides;
        for (let i: number = 0; i < slides.length; i += 1) {
            if (slides[i].partName === partName) {
                return slides[i];
            }
        }
    }
    return undefined;
}

function readText(textPart: TextPart): HyperlinkView | undefined {
    const located = locateRunHyperlink(textPart, 'click');
    if (located.element === undefined) {
        return undefined;
    }
    const slide: Slide | undefined = slideForPart(textPart.getPartName());
    if (slide === undefined) {
        return undefined;
    }
    return viewFor(located.element, slide);
}

function removeText(textPart: TextPart): void {
    const located = locateRunHyperlink(textPart, 'click');
    if (located.element === undefined) {
        return;
    }
    const slide: Slide | undefined = slideForPart(textPart.getPartName());
    if (slide === undefined) {
        throw new HyperlinkMutationError('Text part is not bound to a slide');
    }
    clearHyperlink(textPart, 'click', accessFor(slide), slide.getRoot());
}

function setScreenTip(view: HyperlinkView, screenTip: string | undefined): void {
    const element: OoxmlElement | undefined = screenTipElements.get(view);
    if (element === undefined) {
        return;
    }
    const mutable: MutableOoxmlElement = asMutable(element);
    const attributes: OoxmlAttribute[] = [];
    for (let i: number = 0; i < mutable.attributes.length; i += 1) {
        const attribute: OoxmlAttribute = mutable.attributes[i];
        if (attribute.localName === 'tooltip' && attribute.namespaceUri === '') {
            continue;
        }
        attributes.push(attribute);
    }
    if (screenTip !== undefined) {
        attributes.push({ namespaceUri: '', localName: 'tooltip', value: screenTip });
    }
    mutable.attributes = attributes;
}

/**
 * Sets or replaces the shape click hyperlink.
 *
 * @param shape - Shape that owns `cNvPr`.
 * @param target - URL, mailto, file name, or 1-based slide index.
 * @returns The click hyperlink just written.
 */
export function setShapeHyperlink(shape: Shape, target: string): HyperlinkView {
    return setOnShape(shape, target);
}

/**
 * Sets or replaces the picture click hyperlink.
 *
 * @param picture - Picture that owns `p:cNvPr`.
 * @param target - URL, mailto, file name, or 1-based slide index.
 * @returns The click hyperlink just written.
 */
export function setPictureHyperlink(picture: Picture, target: string): HyperlinkView {
    return setOnShape(shapeFromPicture(picture), target);
}

/**
 * Sets or replaces the run click hyperlink.
 *
 * @param textPart - Run that owns `a:rPr`.
 * @param target - URL, mailto, file name, or 1-based slide index.
 * @returns The click hyperlink just written.
 */
export function setTextPartHyperlink(textPart: TextPart, target: string): HyperlinkView {
    return setOnText(textPart, target);
}

/**
 * @param shape - Shape that owns `cNvPr`.
 * @returns Click hyperlink, or `undefined` when absent.
 */
export function readShapeHyperlinkView(shape: Shape): HyperlinkView | undefined {
    return readShape(shape);
}

/**
 * @param picture - Picture that owns `p:cNvPr`.
 * @returns Click hyperlink, or `undefined` when absent.
 */
export function readPictureHyperlinkView(picture: Picture): HyperlinkView | undefined {
    return readShape(shapeFromPicture(picture));
}

/**
 * @param textPart - Run that owns `a:r`.
 * @returns Click hyperlink, or `undefined` when absent.
 */
export function readTextPartHyperlinkView(textPart: TextPart): HyperlinkView | undefined {
    return readText(textPart);
}

/**
 * Removes the shape click hyperlink. No-op when absent.
 *
 * @param shape - Shape that owns `cNvPr`.
 */
export function removeShapeHyperlink(shape: Shape): void {
    removeShape(shape);
}

/**
 * Removes the picture click hyperlink. No-op when absent.
 *
 * @param picture - Picture that owns `p:cNvPr`.
 */
export function removePictureHyperlink(picture: Picture): void {
    removeShape(shapeFromPicture(picture));
}

/**
 * Removes the run click hyperlink. No-op when absent.
 *
 * @param textPart - Run that owns `a:r`.
 */
export function removeTextPartHyperlink(textPart: TextPart): void {
    removeText(textPart);
}

/**
 * Records the presentation that owns shapes about to be edited.
 *
 * @param presentation - Owning document.
 */
export function notePresentation(presentation: Presentation): void {
    bindFacadePresentation(presentation);
}
