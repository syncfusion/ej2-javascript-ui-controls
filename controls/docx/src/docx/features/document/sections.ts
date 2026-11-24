import { Section } from './section';
import { SectionPropertiesModel } from './section-properties-model';
import { DetachedObjectError } from '../../core/errors/docx-error';
import { WordDocument } from './document';

/**
 * @private
 * Optional clone hook installed by the sections feature for {@link Sections.add}.
 */
export type SectionPageSetupClone = (source: SectionPropertiesModel) => SectionPropertiesModel;

/**
 * @private
 * Optional default page-setup factory (sections feature) so new sections always
 * receive a live {@link SectionPropertiesModel} while the feature is on.
 */
export type SectionPageSetupSeed = () => SectionPropertiesModel;

/**
 * @private
 * Hook run when a section is attached to a document through {@link Sections.add}, so features
 * (images) can re-register content cloned from another document.
 */
export type SectionAttachHook = (section: Section, document: WordDocument) => void;

let sectionAttachHook: SectionAttachHook | undefined;

/**
 * @param {SectionAttachHook} hook - The hook.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerSectionAttachHook(hook: SectionAttachHook): void {
    sectionAttachHook = hook;
}

let pageSetupClone: SectionPageSetupClone | undefined;
let pageSetupSeed: SectionPageSetupSeed | undefined;

/**
 * @param {SectionPageSetupClone} clone - The clone.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerSectionPageSetupClone(clone: SectionPageSetupClone): void {
    pageSetupClone = clone;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetSectionPageSetupCloneForTests(): void {
    pageSetupClone = undefined;
}

/**
 * @returns {SectionPageSetupClone | undefined} The result.
 * @private
 */
export function currentSectionPageSetupClone(): SectionPageSetupClone | undefined {
    return pageSetupClone;
}

/**
 * @param {SectionPageSetupSeed} seed - The seed.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerSectionPageSetupSeed(seed: SectionPageSetupSeed): void {
    pageSetupSeed = seed;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetSectionPageSetupSeedForTests(): void {
    pageSetupSeed = undefined;
}

/**
 * @returns {SectionPageSetupSeed | undefined} The result.
 * @private
 */
export function currentSectionPageSetupSeed(): SectionPageSetupSeed | undefined {
    return pageSetupSeed;
}

/**
 * Resolve page setup for a newly authored section: clone previous when possible,
 * otherwise seed a default when the sections feature is registered.
 *
 * @param {Section | undefined} previous - The previous.
 * @returns {SectionPropertiesModel | undefined} The result.
 * @private
 */
function resolveAuthoredPageSetup(
    previous: Section | undefined
): SectionPropertiesModel | undefined {
    if (previous !== undefined && pageSetupClone !== undefined) {
        const model: SectionPropertiesModel = previous.internalPageSetupModel();
        if (model !== undefined) {
            return pageSetupClone(model);
        }
    }
    if (pageSetupSeed !== undefined) {
        return pageSetupSeed();
    }
    return undefined;
}

/**
 * Represents the collection of sections in a document.
 *
 * A document always contains at least one section. Removing the last section throws an error.
 *
 * @public
 */
export class Sections implements Iterable<Section> {
    readonly [index: number]: Section;

    private readonly document: WordDocument;
    private list: Section[];
    private cachedLength: number = 0;

    /**
     * @param {WordDocument} document - The document.
     * @param {ReadonlyArray<Section>} sections - The sections.
     * @private
     */
    constructor(document: WordDocument, sections: ReadonlyArray<Section>) {
        if (sections.length < 1) {
            throw new DetachedObjectError('Document must have at least one section');
        }
        this.document = document;
        this.list = sections.slice();
        for (const section of this.list) {
            section.bindDocument(document);
        }
        this.rebuildIndexProperties();
    }

    /**
     * Gets the number of sections in the document.
     */
    get count(): number {
        return this.list.length;
    }

    /**
     * Appends a new section after the last section.
     *
     * The page setup of the previous last section is copied to the new section.
     *
     * @param {Section} existing - Optional detached section (for example a clone) to append instead of a new one.
     * @returns {Section} - Returns the new {@link Section}.
     */
    add(existing?: Section): Section {
        if (existing !== undefined) {
            this.list.push(existing);
            existing.bindDocument(this.document);
            if (sectionAttachHook !== undefined) {
                sectionAttachHook(existing, this.document);
            }
            this.rebuildIndexProperties();
            return existing;
        }
        const previous: Section = this.list[this.list.length - 1];
        const setup: SectionPropertiesModel = resolveAuthoredPageSetup(previous);
        const section: Section = new Section(this.document, [], setup);
        this.list.push(section);
        section.bindDocument(this.document);
        this.rebuildIndexProperties();
        return section;
    }

    /**
     * Clones every section of this collection, in order, into `destination`.
     * Source sections are never added to the destination.
     *
     * @param {Sections} destination - The destination collection.
     * @returns {void}
     * @private
     */
    cloneTo(destination: Sections): void {
        for (let i: number = 0, cnt: number = this.count; i < cnt; i++) {
            destination.add(this[i as number].clone());
        }
    }

    /**
     * Insert a new section at `index` (`0…count` inclusive).
     *
     * @returns {Section} - Returns the Section.
     * @param {number} index - Specifies the index.
     * @throws RangeError when `index` is outside `0…count`.
     */
    insert(index: number): Section {
        if (index < 0 || index > this.list.length) {
            throw new RangeError(`Section index ${String(index)} is out of range`);
        }
        if (index === this.list.length) {
            return this.add();
        }
        const sibling: Section = this.list[index === 0 ? 0 : index - 1];
        const setup: SectionPropertiesModel = resolveAuthoredPageSetup(sibling);
        const section: Section = new Section(this.document, [], setup);
        this.list.splice(index, 0, section);
        section.bindDocument(this.document);
        this.rebuildIndexProperties();
        return section;
    }

    /**
     * Remove `section` from the document.
     *
     * @returns {void}
     * @param {Section} section - Specifies the section.
     * @throws DetachedObjectError when `section` is not in this collection.
     * @throws DetachedObjectError when removing would leave zero sections.
     */
    remove(section: Section): void {
        const at: number = this.list.indexOf(section);
        if (at === -1) {
            throw new DetachedObjectError('Section is not in this document');
        }
        this.removeAt(at);
    }

    /**
     * Remove the section at `index`.
     *
     * @returns {void}
     * @param {number} index - Specifies the index.
     * @throws RangeError when `index` is out of range.
     * @throws DetachedObjectError when removing would leave zero sections.
     */
    removeAt(index: number): void {
        if (index < 0 || index >= this.list.length) {
            throw new RangeError(`Section index ${String(index)} is out of range`);
        }
        if (this.list.length <= 1) {
            throw new DetachedObjectError('Cannot remove the last section');
        }
        this.list.splice(index, 1);
        this.rebuildIndexProperties();
    }

    /**
     * Index of `section`, or `-1`.
     *
     * @returns {number} - Returns the number.
     * @param {Section} section - Specifies the section.
     */
    indexOf(section: Section): number {
        return this.list.indexOf(section);
    }

    [Symbol.iterator](): Iterator<Section> {
        const items: Section[] = this.list.slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Section> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as Section };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Section = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }

    /**
     * @param {ReadonlyArray<Section>} sections - The sections.
     * @returns {void} Nothing is returned.
     * @private
     * Replace section list after load partition (single-section bridge today).
     */
    replaceAll(sections: ReadonlyArray<Section>): void {
        if (sections.length < 1) {
            throw new DetachedObjectError('Document must have at least one section');
        }
        this.list = sections.slice();
        for (const section of this.list) {
            section.bindDocument(this.document);
        }
        this.rebuildIndexProperties();
    }

    /**
     * @returns {ReadonlyArray<Section>} The result.
     * @private
     */
    asArray(): ReadonlyArray<Section> {
        return this.list;
    }

    private rebuildIndexProperties(): void {
        const items: Section[] = this.list;
        const nextLen: number = items.length;
        const prevLen: number = this.cachedLength;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                Object.defineProperty(this, key, {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    value: items[i],
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            } else {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedLength = nextLen;
    }
}
