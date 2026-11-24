/**
 * Mutable section list and its `p14:sectionLst` extension.
 *
 * Citation: MS-PPTX §2.2.5 (URI `{521415D9-36F7-43E2-AB2F-B90AF26B5E84}`),
 * §2.3.1.25 `sectionLst`, §2.3.3.24–27 `CT_Section` / slide id list.
 */
import { AddSlideOptions } from '../create/add-slide';
import { PresentationError } from '../errors';
import { Slide } from '../slideimplementation/slide';
import { asMutable, findChild, getAttr, MutableOoxmlElement } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { PML_NS } from './constants';
import { P14_NS } from './shapetype';
import { Section } from './section';

/**
 * MS-PPTX §2.2.5 extension URI for `p14:sectionLst`.
 *
 * @returns {string} Extension URI.
 */
export const SECTION_EXT_URI: string = '{521415D9-36F7-43E2-AB2F-B90AF26B5E84}';

/**
 * Live section state for one presentation.
 *
 * @internal
 * @returns {void} Constructed by presentation load.
 */
export class SectionStore {
    private readonly items: Section[] = [];
    private readonly members: Map<Section, Slide[]> = new Map<Section, Slide[]>();
    private readonly bySlide: Map<Slide, Section> = new Map<Slide, Section>();
    private addSlideImpl: (options?: AddSlideOptions) => Slide = (): Slide => {
        throw new PresentationError('model/detached-object', 'Sections are not attached to a presentation.');
    };
    /** When false, the loaded extension is still byte-preserved by the DOM. */
    private dirty: boolean = false;

    /**
     * Binds slide creation so `section.addSlide` uses the presentation path.
     *
     * @param {Function} impl - Presentation add-slide.
     * @returns {void} Nothing.
     */
    attachAddSlide(impl: (options?: AddSlideOptions) => Slide): void {
        this.addSlideImpl = impl;
    }

    /**
     * Whether section markup must be rewritten on the next save.
     *
     * @returns {boolean} True after a section mutation.
     */
    get isDirty(): boolean {
        return this.dirty;
    }

    /**
     * Marks the extension dirty so flush rewrites `p14:sectionLst`.
     *
     * @returns {void} Nothing.
     */
    touch(): void {
        this.dirty = true;
    }

    /**
     * Section count.
     *
     * @returns {number} Number of sections.
     */
    get count(): number {
        return this.items.length;
    }

    /**
     * Section at `index`.
     *
     * @param {number} index - Zero-based index.
     * @returns {Section} The section.
     */
    at(index: number): Section {
        this.assertIndex(index);
        return arrayAt(this.items, index);
    }

    /**
     * Appends an empty section named `Untitled`.
     *
     * @returns {Section} The new section.
     */
    add(): Section {
        const section: Section = new Section(this, newSectionId(this.items), 'Untitled');
        this.items.push(section);
        this.members.set(section, []);
        this.dirty = true;
        return section;
    }

    /**
     * Reorders `section` to `index`.
     *
     * @param {number} index - Destination index.
     * @param {Section} section - Existing section.
     * @returns {void} Nothing.
     */
    insert(index: number, section: Section): void {
        const from: number = this.items.indexOf(section);
        if (from < 0) {
            throw new PresentationError('model/invalid-argument', 'Section is not a member of this presentation.');
        }
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
            throw new PresentationError('model/out-of-range', 'Section index ' + String(index) +
                ' is out of range (length ' + String(this.items.length) + ').');
        }
        this.items.splice(from, 1);
        this.items.splice(index, 0, section);
        this.dirty = true;
    }

    /**
     * Moves `section` to `index`.
     *
     * @param {Section} section - Section in this store.
     * @param {number} index - Destination index.
     * @returns {void} Nothing.
     */
    move(section: Section, index: number): void {
        this.insert(index, section);
    }

    /**
     * Drops a section definition. Slides remain in the presentation.
     *
     * @param {Section} section - Section to remove.
     * @returns {void} Nothing.
     */
    remove(section: Section): void {
        const index: number = this.items.indexOf(section);
        if (index < 0) {
            throw new PresentationError('model/invalid-argument', 'Section is not a member of this presentation.');
        }
        this.detach(section);
        this.items.splice(index, 1);
        this.dirty = true;
    }

    /**
     * Drops the section at `index`.
     *
     * @param {number} index - Zero-based index.
     * @returns {void} Nothing.
     */
    removeAt(index: number): void {
        this.assertIndex(index);
        this.remove(arrayAt(this.items, index));
    }

    /**
     * Drops every section definition. Slides remain.
     *
     * @returns {void} Nothing.
     */
    clear(): void {
        for (let i: number = 0; i < this.items.length; i++) {
            this.detach(arrayAt(this.items, i));
        }
        this.items.length = 0;
        this.dirty = true;
    }

    /**
     * Slides currently assigned to `section`, in presentation order.
     *
     * @param {Section} section - Section in this store.
     * @returns {ReadonlyArray<Slide>} Member slides.
     */
    slidesOf(section: Section): ReadonlyArray<Slide> {
        const list: Slide[] = this.members.get(section);
        if (list === undefined) {
            throw new PresentationError('model/detached-object', 'Section is not a member of this presentation.');
        }
        return list;
    }

    /**
     * Creates a slide and assigns it to `section`.
     *
     * @param {Section} section - Destination section.
     * @param {AddSlideOptions} [options] - Layout options.
     * @returns {Slide} The new slide.
     */
    addSlide(section: Section, options?: AddSlideOptions | string): Slide {
        this.slidesOf(section);
        const resolved: AddSlideOptions | undefined = typeof options === 'string' ? { layout: options as AddSlideOptions['layout'] } : options;
        const slide: Slide = this.addSlideImpl(resolved);
        this.assign(section, slide);
        this.dirty = true;
        return slide;
    }

    /**
     * Assigns `slide` to the section at `sectionIndex`, removing any previous membership.
     *
     * @param {Slide} slide - Slide in this presentation.
     * @param {number} sectionIndex - Destination section index.
     * @returns {void} Nothing.
     */
    moveSlideToSection(slide: Slide, sectionIndex: number): void {
        this.assertIndex(sectionIndex);
        this.assign(arrayAt(this.items, sectionIndex), slide);
        this.dirty = true;
    }

    /**
     * Drops membership for a slide that left the presentation.
     *
     * @param {Slide} slide - Removed slide.
     * @returns {void} Nothing.
     */
    forgetSlide(slide: Slide): void {
        const owner: Section = this.bySlide.get(slide);
        if (owner === undefined) {
            return;
        }
        this.bySlide.delete(slide);
        const list: Slide[] = this.members.get(owner);
        if (list !== undefined) {
            const index: number = list.indexOf(slide);
            if (index >= 0) {
                list.splice(index, 1);
            }
        }
        this.dirty = true;
    }

    /**
     * Loads sections from `p14:sectionLst`, resolving slide ids to live slides.
     *
     * @param {OoxmlElement} root - Presentation root.
     * @param {ReadonlyArray<Slide>} slides - Slides in presentation order.
     * @returns {void} Nothing.
     */
    load(root: OoxmlElement, slides: ReadonlyArray<Slide>): void {
        this.items.length = 0;
        this.members.clear();
        this.bySlide.clear();
        this.dirty = false;
        const list: OoxmlElement = findSectionList(root);
        if (list === undefined) {
            return;
        }
        const slideById: Map<string, Slide> = new Map<string, Slide>();
        for (let i: number = 0; i < slides.length; i++) {
            const slide: Slide = arrayAt(slides, i);
            slideById.set(slide.slideId, slide);
        }
        for (let i: number = 0; i < list.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(list.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== P14_NS || child.localName !== 'section') {
                continue;
            }
            const id: string = getAttr(child, '', 'id');
            const name: string = getAttr(child, '', 'name');
            const sectionId: string = id === undefined ? newSectionId(this.items) : id;
            const sectionName: string = name === undefined ? '' : name;
            const section: Section = new Section(this, sectionId, sectionName);
            const owned: Slide[] = [];
            const memberList: OoxmlElement = findChild(child, P14_NS, 'sldIdLst');
            if (memberList !== undefined) {
                for (let m: number = 0; m < memberList.children.length; m++) {
                    const member: OoxmlElement | OoxmlText = arrayAt(memberList.children, m);
                    if (member.kind !== 'element' || member.namespaceUri !== P14_NS || member.localName !== 'sldId') {
                        continue;
                    }
                    const slideId: string = getAttr(member, '', 'id');
                    const slide: Slide = slideId === undefined ? undefined : slideById.get(slideId);
                    if (slide !== undefined && !this.bySlide.has(slide)) {
                        owned.push(slide);
                        this.bySlide.set(slide, section);
                    }
                }
            }
            this.items.push(section);
            this.members.set(section, owned);
        }
    }

    /**
     * Rewrites `p14:sectionLst` when sections changed. Untouched loads stay opaque.
     *
     * @param {OoxmlElement} root - Current presentation root.
     * @param {ReadonlyArray<Slide>} slides - Slides still in the presentation.
     * @returns {OoxmlElement} Root to serialize.
     */
    write(root: OoxmlElement, slides: ReadonlyArray<Slide>): OoxmlElement {
        if (!this.dirty) {
            return root;
        }
        for (let i: number = 0; i < this.items.length; i++) {
            const section: Section = arrayAt(this.items, i);
            const list: Slide[] = this.members.get(section);
            if (list === undefined) {
                continue;
            }
            const ordered: Slide[] = [];
            for (let s: number = 0; s < slides.length; s++) {
                const slide: Slide = arrayAt(slides, s);
                if (list.indexOf(slide) >= 0) {
                    ordered.push(slide);
                }
            }
            const dropped: Slide[] = [];
            for (let m: number = 0; m < list.length; m++) {
                const member: Slide = arrayAt(list, m);
                if (ordered.indexOf(member) < 0) {
                    dropped.push(member);
                }
            }
            list.length = 0;
            for (let m: number = 0; m < ordered.length; m++) {
                list.push(arrayAt(ordered, m));
            }
            for (let d: number = 0; d < dropped.length; d++) {
                if (this.bySlide.get(arrayAt(dropped, d)) === section) {
                    this.bySlide.delete(arrayAt(dropped, d));
                }
            }
        }
        return writeSectionList(root, this.items, this.members);
    }

    private assign(section: Section, slide: Slide): void {
        const previous: Section = this.bySlide.get(slide);
        if (previous !== undefined && previous !== section) {
            const previousList: Slide[] = this.members.get(previous);
            if (previousList !== undefined) {
                const index: number = previousList.indexOf(slide);
                if (index >= 0) {
                    previousList.splice(index, 1);
                }
            }
        }
        const list: Slide[] = this.members.get(section);
        if (list === undefined) {
            throw new PresentationError('model/detached-object', 'Section is not a member of this presentation.');
        }
        if (list.indexOf(slide) < 0) {
            list.push(slide);
        }
        this.bySlide.set(slide, section);
    }

    private detach(section: Section): void {
        const list: Slide[] = this.members.get(section);
        if (list !== undefined) {
            for (let i: number = 0; i < list.length; i++) {
                this.bySlide.delete(arrayAt(list, i));
            }
        }
        this.members.delete(section);
    }

    private assertIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
            throw new PresentationError('model/out-of-range', 'Section index ' + String(index) +
                ' is out of range (length ' + String(this.items.length) + ').');
        }
    }
}

/**
 * Finds the first `p14:sectionLst` under presentation `p:extLst`.
 *
 * @param {OoxmlElement} root - Presentation root.
 * @returns {OoxmlElement | undefined} The section list, if present.
 */
export function findSectionList(root: OoxmlElement): OoxmlElement | undefined {
    const extLst: OoxmlElement = findChild(root, PML_NS, 'extLst');
    if (extLst === undefined) {
        return undefined;
    }
    for (let i: number = 0; i < extLst.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(extLst.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== PML_NS || child.localName !== 'ext') {
            continue;
        }
        const list: OoxmlElement = findChild(child, P14_NS, 'sectionLst');
        if (list !== undefined) {
            return list;
        }
    }
    return undefined;
}

/**
 * True when the presentation root carries `p14:sectionLst`.
 *
 * @param {OoxmlElement} root - Presentation root.
 * @returns {boolean} Whether sections are present.
 */
export function detectHasSections(root: OoxmlElement): boolean {
    return findSectionList(root) !== undefined;
}

/**
 * Rewrites the section extension from the live model.
 *
 * @param {OoxmlElement} root - Presentation root.
 * @param {ReadonlyArray<Section>} items - Sections in authored order.
 * @param {Map<Section, Slide[]>} members - Section membership.
 * @returns {OoxmlElement} Root with the section list replaced.
 */
function writeSectionList(root: OoxmlElement, items: ReadonlyArray<Section>, members: Map<Section, Slide[]>): OoxmlElement {
    const mutable: MutableOoxmlElement = asMutable(cloneElement(root));
    let extLst: OoxmlElement = findChild(mutable, PML_NS, 'extLst');
    if (items.length === 0) {
        if (extLst !== undefined) {
            removeSectionExt(asMutable(extLst));
            if (extLst.children.length === 0) {
                mutable.children = mutable.children.filter((child: OoxmlElement | OoxmlText) => child !== extLst);
            }
        }
        return mutable;
    }
    if (extLst === undefined) {
        extLst = element(PML_NS, 'extLst', 'p', [], []);
        mutable.children.push(extLst);
    }
    const extMutable: MutableOoxmlElement = asMutable(extLst);
    let ext: OoxmlElement = findSectionExt(extLst);
    const sectionElements: OoxmlElement[] = [];
    for (let i: number = 0; i < items.length; i++) {
        const section: Section = arrayAt(items, i);
        const owned: Slide[] = members.get(section);
        const ids: OoxmlElement[] = [];
        const list: Slide[] = owned === undefined ? [] : owned;
        for (let m: number = 0; m < list.length; m++) {
            ids.push(element(P14_NS, 'sldId', 'p14', [attr('id', arrayAt(list, m).slideId)], []));
        }
        sectionElements.push(element(P14_NS, 'section', 'p14', [
            attr('name', section.name),
            attr('id', section.id)
        ], [
            element(P14_NS, 'sldIdLst', 'p14', [], ids)
        ]));
    }
    const listEl: OoxmlElement = element(P14_NS, 'sectionLst', 'p14', [], sectionElements, [{ prefix: 'p14', uri: P14_NS }]);
    if (ext === undefined) {
        ext = element(PML_NS, 'ext', 'p', [attr('uri', SECTION_EXT_URI)], [listEl]);
        extMutable.children.push(ext);
    } else {
        const host: MutableOoxmlElement = asMutable(ext);
        let replaced: boolean = false;
        host.children = host.children.map((child: OoxmlElement | OoxmlText) => {
            if (!replaced && child.kind === 'element' && child.namespaceUri === P14_NS && child.localName === 'sectionLst') {
                replaced = true;
                return listEl;
            }
            return child;
        });
        if (!replaced) {
            host.children.push(listEl);
        }
    }
    ensureIgnorable(mutable, 'p14');
    return mutable;
}

/**
 * Finds the `p:ext` that hosts `p14:sectionLst`.
 *
 * @param {OoxmlElement} extLst - Presentation extension list.
 * @returns {OoxmlElement | undefined} The hosting extension.
 */
function findSectionExt(extLst: OoxmlElement): OoxmlElement | undefined {
    for (let i: number = 0; i < extLst.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(extLst.children, i);
        if (child.kind === 'element' && child.namespaceUri === PML_NS && child.localName === 'ext' &&
            findChild(child, P14_NS, 'sectionLst') !== undefined) {
            return child;
        }
    }
    return undefined;
}

/**
 * Drops the section extension and keeps unrelated extensions.
 *
 * @param {MutableOoxmlElement} extLst - Presentation extension list.
 * @returns {void} Nothing.
 */
function removeSectionExt(extLst: MutableOoxmlElement): void {
    extLst.children = extLst.children.filter((child: OoxmlElement | OoxmlText) => {
        if (child.kind !== 'element' || child.namespaceUri !== PML_NS || child.localName !== 'ext') {
            return true;
        }
        return findChild(child, P14_NS, 'sectionLst') === undefined;
    });
}

/**
 * Adds `prefix` to `mc:Ignorable` when that attribute already exists.
 *
 * @param {MutableOoxmlElement} root - Presentation root.
 * @param {string} prefix - Prefix token, `p14`.
 * @returns {void} Nothing.
 */
function ensureIgnorable(root: MutableOoxmlElement, prefix: string): void {
    const mc: string = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
    for (let i: number = 0; i < root.attributes.length; i++) {
        const attribute: OoxmlAttribute = arrayAt(root.attributes, i);
        if (attribute.namespaceUri === mc && attribute.localName === 'Ignorable') {
            const tokens: string[] = attribute.value.split(/\s+/u).filter((token: string) => token.length > 0);
            if (tokens.indexOf(prefix) < 0) {
                tokens.push(prefix);
            }
            const next: OoxmlAttribute[] = root.attributes.slice();
            const updated: OoxmlAttribute = {
                namespaceUri: mc,
                localName: 'Ignorable',
                value: tokens.join(' '),
                prefix: attribute.prefix
            };
            next.splice(i, 1, updated);
            root.attributes = next;
            return;
        }
    }
}

/**
 * Shallow-copies an element so its child list can be replaced.
 *
 * @param {OoxmlElement} el - Source element.
 * @returns {OoxmlElement} Copy.
 */
function cloneElement(el: OoxmlElement): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri: el.namespaceUri,
        localName: el.localName,
        attributes: el.attributes.slice(),
        children: el.children.slice(),
        ...(el.prefixHint !== undefined ? { prefixHint: el.prefixHint } : {}),
        ...(el.namespaceDeclarations !== undefined ? { namespaceDeclarations: el.namespaceDeclarations.slice() } : {})
    };
}

/**
 * Builds an element node.
 *
 * @param {string} namespaceUri - Namespace URI.
 * @param {string} localName - Local name.
 * @param {string} prefix - Preferred prefix.
 * @param {OoxmlAttribute[]} attributes - Attributes.
 * @param {Array<OoxmlElement | OoxmlText>} children - Children.
 * @param {Array<{prefix: string, uri: string}>} [namespaceDeclarations] - Namespace declarations.
 * @returns {OoxmlElement} Element.
 */
function element(namespaceUri: string, localName: string, prefix: string, attributes: OoxmlAttribute[],
                 children: Array<OoxmlElement | OoxmlText>, namespaceDeclarations?: Array<{ prefix: string; uri: string }>): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri,
        localName,
        attributes,
        children,
        prefixHint: prefix,
        ...(namespaceDeclarations !== undefined ? { namespaceDeclarations } : {})
    };
}

/**
 * Builds an un-namespaced attribute.
 *
 * @param {string} localName - Attribute name.
 * @param {string} value - Attribute value.
 * @returns {OoxmlAttribute} Attribute.
 */
function attr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}

/**
 * Allocates a section GUID that is not already used.
 *
 * @param {ReadonlyArray<Section>} existing - Sections already in the list.
 * @returns {string} GUID including braces.
 */
function newSectionId(existing: ReadonlyArray<Section>): string {
    const used: Set<string> = new Set<string>();
    for (let i: number = 0; i < existing.length; i++) {
        used.add(arrayAt(existing, i).id);
    }
    let id: string = guid();
    while (used.has(id)) {
        id = guid();
    }
    return id;
}

/**
 * Builds a version-4 GUID string in OOXML brace form.
 *
 * @returns {string} GUID including braces.
 */
function guid(): string {
    const bytes: number[] = [];
    for (let i: number = 0; i < 16; i++) {
        bytes.push(Math.floor(Math.random() * 256));
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    let hex: string = '';
    for (let i: number = 0; i < bytes.length; i++) {
        const value: number = arrayAt(bytes, i);
        hex += (value < 16 ? '0' : '') + value.toString(16);
    }
    hex = hex.toUpperCase();
    return `{${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}}`;
}
