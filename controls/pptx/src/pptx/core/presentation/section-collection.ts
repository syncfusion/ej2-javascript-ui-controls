/**
 * Ordered section list (`p14:sectionLst`).
 */
import { Section } from './section';
import { SectionStore } from './section-store';

/**
 * Presentation sections in authored order.
 *
 * @remarks Access by index with {@link SectionCollection.at}. `count` is the
 * number of section definitions, including empty sections. Clearing or removing
 * a section does not delete slides.
 */
export class SectionCollection {
    /** @internal */
    private readonly store: SectionStore;

    /**
     * @internal
     * @param {SectionStore} store - Live section state.
     */
    constructor(store: SectionStore) {
        this.store = store;
    }

    /**
     * Number of sections.
     *
     * @returns {number} Section count.
     */
    get count(): number {
        return this.store.count;
    }

    /**
     * Returns the section at a zero-based index.
     *
     * @param {number} index - Index in authored section order.
     * @returns {Section} The section at `index`.
     */
    at(index: number): Section {
        return this.store.at(index);
    }

    /**
     * Appends an empty section.
     *
     * @remarks The name defaults to `Untitled`. Assign `section.name` afterwards.
     * @returns {Section} The new section.
     */
    add(): Section {
        return this.store.add();
    }

    /**
     * Moves an existing section to `index`.
     *
     * @remarks The section must already belong to this presentation (typically one
     * just created with {@link SectionCollection.add}). This reorders; it does not
     * copy the section.
     * @param {number} index - Destination index.
     * @param {Section} section - Section already in this collection.
     * @returns {void} Nothing.
     */
    insert(index: number, section: Section): void {
        this.store.insert(index, section);
    }

    /**
     * Removes a section definition. Slides stay in the presentation.
     *
     * @param {Section} section - Section that belongs to this presentation.
     * @returns {void} Nothing.
     */
    remove(section: Section): void {
        this.store.remove(section);
    }

    /**
     * Removes the section at `index`. Slides stay in the presentation.
     *
     * @param {number} index - Zero-based section index.
     * @returns {void} Nothing.
     */
    removeAt(index: number): void {
        this.store.removeAt(index);
    }

    /**
     * Removes every section definition. Slides stay in the presentation.
     *
     * @returns {void} Nothing.
     */
    clear(): void {
        this.store.clear();
    }
}
