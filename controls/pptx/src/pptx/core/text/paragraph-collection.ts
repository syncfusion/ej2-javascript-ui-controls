/**
 * Mutable `a:p` paragraph collection (append + remove per TASK-1079 / TASK-1082).
 *
 * @remarks
 * A {@link ParagraphCollection} is a live, array-like view over the `a:p`
 * children of a {@link TextBody}. Reading re-walks the `txBody` DOM so newly
 * appended paragraphs are visible. `add(paragraph)` grafts a detached
 * {@link Paragraph} (typically `new Paragraph()`) into the text body and
 * returns the re-bound handle (API-RULES R1.1 / R1.5 / R2.5 / R5.1 / R5.5).
 * `remove(paragraph)` / `removeAt(index)` detach and discard an existing `a:p`
 * (R1.1 — `remove*` returns `void`).
 */
import { ShapeTextError, partNameOptions } from '../shapes/errors';
import { Paragraph } from './paragraph';
/**
 * Ordered paragraphs (`a:p`) of a text body, with append and remove mutation.
 *
 * @remarks
 * Supports index access (`textBody.paragraphs[0]`), `length`, iteration,
 * {@link ParagraphCollection.add} (TASK-1079), and
 * {@link ParagraphCollection.remove} / {@link ParagraphCollection.removeAt}
 * (TASK-1082).
 */
export type ParagraphCollection = ReadonlyArray<Paragraph> & {
    /**
     * Appends a detached {@link Paragraph} to the end of this text body's paragraph
     * sequence and returns the re-bound, live handle.
     *
     * @param paragraph - A {@link Paragraph} constructed detached
     *   (`new Paragraph()`). If the instance is already attached to another text
     *   body, appending it again would graft the same `a:p` element into a second
     *   parent — callers must construct a fresh {@link Paragraph} per add (the
     *   element is reparented, not copied).
     * @returns The same {@link Paragraph} instance, re-bound to the live text body.
     *
     * @remarks
     * Schema order (`dml-main.xsd` `CT_TextBody`): `bodyPr`, optional `lstStyle`,
     * then one or more `p`. Append places the new `a:p` after the last existing
     * `a:p` (preserving any trailing markup after the paragraphs is not a concern
     * for direct-text-body authoring).
     */
    add(paragraph: Paragraph): Paragraph;
    /**
     * Detaches and discards the `a:p` that backs `paragraph` from this text body.
     *
     * @param paragraph - A live {@link Paragraph} previously obtained from this
     *   collection (or attached via {@link ParagraphCollection.add}). Match is by
     *   element identity: the `a:p` element held by `paragraph` must be a child of
     *   this text body. A detached `Paragraph` (never attached) throws
     *   {@link ShapeTextError}.
     *
     * @remarks
     * Removing the last remaining paragraph is **rejected** with
     *   {@link ShapeTextError}: `CT_TextBody` requires at least one `a:p`
     *   (`dml-main.xsd`, `minOccurs="1" maxOccurs="unbounded"`). Callers that need
     *   an empty-looking body should author an empty `a:p` rather than removing
     *   the last one.
     *
     * Per API-RULES R1.1 the removal verb returns `void`. Removing a paragraph
     * does not renumber shape ids and does not touch other parts; it only drops
     * the `a:p` from the parent text body. Remaining paragraphs preserve their
     * order.
     *
     * Citation: `dml-main.xsd` `CT_TextBody` paragraph child sequence.
     */
    remove(paragraph: Paragraph): void;
    /**
     * Detaches and discards the `a:p` at `index`, shifting later paragraphs up.
     *
     * @param index - Zero-based index of the paragraph to remove (`0` ≤ `index` <
     *   `length`). Out-of-range indices throw {@link ShapeTextError}.
     *
     * @remarks
     * Same last-paragraph rejection as {@link ParagraphCollection.remove}: removing
     * the only paragraph throws {@link ShapeTextError} (`CT_TextBody` requires one
     * or more `a:p`). Per API-RULES R1.1 returns `void`.
     *
     * Citation: `dml-main.xsd` `CT_TextBody` paragraph child sequence.
     */
    removeAt(index: number): void;
};
/**
 * Builds a live {@link ParagraphCollection} proxy over a text body's `a:p`
 * paragraphs.
 *
 * @internal
 * @param {*} getParagraphs - Returns the current walk result (re-evaluated on
 * @param {*} addParagraphNode - Grafts a detached {@link Paragraph} into the text
 * @param {*} removeParagraphNode - Detaches a live {@link Paragraph} from the text
 * @param {*} removeParagraphAt - Detaches the paragraph at `index` from the text
 * @returns {ParagraphCollection} The result.
 */
export function createParagraphCollection(
    getParagraphs: () => ReadonlyArray<Paragraph>,
    addParagraphNode: (paragraph: Paragraph) => Paragraph,
    removeParagraphNode: (paragraph: Paragraph) => void,
    removeParagraphAt: (index: number) => void
): ParagraphCollection {
    const target: Paragraph[] = [];
    return new Proxy(target as unknown as ParagraphCollection, {
        /**
         *
         * @param {ParagraphCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {*} The result.
         */
        get(_target: ParagraphCollection, prop: string | symbol): unknown {
            // See text-part-collection.ts: target an empty array so `[[IsArray]]` is
            // true, keeping `slide.shapes.flatMap((s) =>((s.textBody == null ? undefined : s.textBody.paragraphs) != null ? (s.textBody == null ? undefined : s.textBody.paragraphs) : []))`
            // flattening the collection into its paragraphs.
            if (prop === Symbol.isConcatSpreadable) {
                return true;
            }
            if (prop === 'add') {
                return addParagraphNode;
            }
            if (prop === 'remove') {
                return removeParagraphNode;
            }
            if (prop === 'removeAt') {
                return removeParagraphAt;
            }
            const paragraphs: ReadonlyArray<Paragraph> = getParagraphs();
            const value: unknown = Reflect.get(paragraphs, prop, paragraphs);
            if (typeof value === 'function') {
                return (value as (...args: unknown[]) => unknown).bind(paragraphs);
            }
            return value;
        },
        /**
         *
         * @param {ParagraphCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @param {*} value - The value value.
         * @returns {boolean} The result.
         */
        set(_target: ParagraphCollection, prop: string | symbol, value: unknown): boolean {
            const paragraphs: Array<Paragraph> = getParagraphs() as Paragraph[];
            return Reflect.set(paragraphs, prop, value, paragraphs);
        },
        /**
         *
         * @param {ParagraphCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {boolean} The result.
         */
        has(_target: ParagraphCollection, prop: string | symbol): boolean {
            if (prop === 'add' || prop === 'remove' || prop === 'removeAt') {
                return true;
            }
            return Reflect.has(getParagraphs(), prop);
        },
        /**
         *
         * @returns {*} The result.
         */
        ownKeys() : Array<string | symbol> {
            target.length = getParagraphs().length;
            return Reflect.ownKeys(getParagraphs()).filter(
                (key: string | number | symbol): key is string | symbol => typeof key !== 'number'
            );
        },
        /**
         *
         * @param {ParagraphCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {*} The result.
         */
        getOwnPropertyDescriptor(_target: ParagraphCollection, prop: string | symbol): PropertyDescriptor | undefined {
            if (prop === 'length') {
                const length: number = getParagraphs().length;
                target.length = length;
                return { value: length, writable: true, enumerable: false, configurable: false };
            }
            const paragraphs: ReadonlyArray<Paragraph> = getParagraphs();
            const descriptor: TypedPropertyDescriptor<unknown> = Reflect.getOwnPropertyDescriptor(paragraphs, prop);
            if (descriptor === undefined) {
                return undefined;
            }
            return { ...descriptor, configurable: true, enumerable: true };
        }
    });
}
/**
 * Validates that a removal target is not the last remaining paragraph.
 *
 * @remarks `CT_TextBody` (`dml-main.xsd`) requires one or more `a:p` (`minOccurs="1" maxOccurs="unbounded"`). Removing the last paragraph
 * would leave an invalid (zero-paragraph) text body.
 * @internal
 * @param {number} length - The length value.
 * @param {string | undefined} partName - The partName value.
 * @returns {void} Nothing.
 */
export function assertNotLastParagraph(length: number, partName: string | undefined): void {
    if (length <= 1) {
        throw new ShapeTextError('Cannot remove the last paragraph: a text body must contain at least one a:p (CT_TextBody)',
                                 partNameOptions(partName));
    }
}
