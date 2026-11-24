/**
 * Live PowerPoint section (MS-PPTX `p14:section`) and its slide membership.
 *
 * Citation: MS-PPTX §2.2.5, §2.3.1.25, §2.3.3.24–27.
 */
import { AddSlideOptions } from '../create/add-slide';
import { SlideLayoutTypeValue } from '../create/slide-layout-type';
import { PresentationError } from '../errors';
import { Slide } from '../slideimplementation/slide';
import { arrayAt } from '../util/es5-compat';
import { SectionStore } from './section-store';

/**
 * One presentation section and the slides that belong to it.
 *
 * @remarks Membership is exclusive: a slide is in at most one section. Removing a
 * section drops only the section definition; slides stay in the presentation.
 * Section order and membership are written to `p14:sectionLst` on save.
 */
export class Section {
    private readonly store: SectionStore;
    /** Stable `s:ST_Guid` (`p14:section/@id`). */
    private readonly sectionId: string;
    /** Display name (`p14:section/@name`). */
    private sectionName: string;

    /**
     * @internal
     * @param {SectionStore} store - Owning section list.
     * @param {string} id - Section GUID, including braces.
     * @param {string} name - Display name.
     */
    constructor(store: SectionStore, id: string, name: string) {
        this.store = store;
        this.sectionId = id;
        this.sectionName = name;
    }

    /**
     * Section display name (`p14:section/@name`).
     *
     * @remarks An empty name is rejected. Control characters are rejected so the
     * saved attribute stays well-formed XML text.
     * @returns {string} Current name.
     */
    get name(): string {
        return this.sectionName;
    }

    /**
     * Renames this section.
     *
     * @param {string} value - New display name.
     */
    set name(value: string) {
        if (typeof value !== 'string' || value.length === 0) {
            throw new PresentationError('model/invalid-argument', 'Section name must be a non-empty string.');
        }
        if (hasDisallowedNameChar(value)) {
            throw new PresentationError('model/invalid-argument', 'Section name contains a character that cannot be stored in OOXML.');
        }
        this.sectionName = value;
        this.store.touch();
    }

    /**
     * Stable section identifier (`p14:section/@id`, `s:ST_Guid`).
     *
     * @returns {string} GUID including braces.
     */
    get id(): string {
        return this.sectionId;
    }

    /**
     * Slides that belong to this section, in presentation order.
     *
     * @returns {ReadonlyArray<Slide>} Member slides. Index with `section.slides[0]`.
     */
    get slides(): ReadonlyArray<Slide> {
        return this.store.slidesOf(this);
    }

    /**
     * Appends a new slide to the presentation and assigns it to this section.
     *
     * @param {AddSlideOptions | SlideLayoutTypeValue} [options] - Layout token or add-slide options.
     * @returns {Slide} The created slide.
     */
    addSlide(options?: AddSlideOptions | SlideLayoutTypeValue): Slide {
        return this.store.addSlide(this, options);
    }

    /**
     * Moves this section to a new index in the section list.
     *
     * @param {number} index - Destination index. The section currently at that index shifts right.
     * @returns {void} Nothing.
     */
    move(index: number): void {
        this.store.move(this, index);
    }

    /**
     * Clones every slide in this section.
     *
     * @remarks The returned slides are not members of this presentation. Pass each
     * one to another presentation's `slides.add(slide)` to import a copy.
     * @returns {Slide[]} Detached slide copies, in section order.
     */
    clone(): Slide[] {
        const members: ReadonlyArray<Slide> = this.slides;
        const copies: Slide[] = [];
        for (let i: number = 0; i < members.length; i++) {
            const slide: Slide = arrayAt(members, i);
            copies.push(slide.clone());
        }
        return copies;
    }
}

/**
 * True when `value` contains an XML-illegal control character.
 *
 * @param {string} value - Candidate section name.
 * @returns {boolean} Whether the name must be rejected.
 */
function hasDisallowedNameChar(value: string): boolean {
    for (let i: number = 0; i < value.length; i++) {
        const code: number = value.charCodeAt(i);
        if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31)) {
            return true;
        }
    }
    return false;
}
