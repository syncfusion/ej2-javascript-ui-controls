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
 * Ordered collection of document {@link Section} objects.
 *
 * A document always has at least one section. Removing the last section throws.
 * {@link Sections.add} clones page setup from the previous last section when a
 * clone hook is registered (sections feature); otherwise seeds a default when
 * a seed hook is registered.
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

    /** Number of sections in the document. */
    get count(): number {
        return this.list.length;
    }

    /**
     * Append a new section after the current last section.
     *
     * Clones `pageSetup` from the previous last section when the sections
     * feature has registered a clone hook; otherwise seeds a default letter
     * page setup when a seed hook is registered.
     *
     * @returns {Section} The new {@link Section}.
     */
    add(): Section {
        const previous: Section = this.list[this.list.length - 1];
        const setup: SectionPropertiesModel = resolveAuthoredPageSetup(previous);
        const section: Section = new Section(this.document, [], setup);
        this.list.push(section);
        section.bindDocument(this.document);
        this.rebuildIndexProperties();
        return section;
    }

    /**
     * Insert a new section at `index` (`0…count` inclusive).
     *
     * @param {number} index - The index.
     * @returns {Section} The result.
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
     * @param {Section} section - The section.
     * @returns {void} Nothing is returned.
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
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
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
     * @param {Section} section - The section.
     * @returns {number} The result.
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
