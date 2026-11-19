/**
 * Mutable `a:r` run collection (append-only per TASK-1079 Phase 1).
 *
 * @remarks
 * A {@link TextPartCollection} is a live, array-like view over the `a:r` children
 * of a {@link Paragraph}. Reading re-walks the paragraph DOM so newly appended
 * runs are visible. `add(textPart)` grafts a detached {@link TextPart}
 * (typically `new TextPart(text)`) into the paragraph before any `a:endParaRPr`
 * and returns the re-bound handle (API-RULES R1.1 / R1.5 / R2.5 / R5.1 / R5.5).
 *
 * Removing runs is out of scope (TASK-1082); this collection is append-only.
 */
import { TextPart } from './text-part';
/**
 * Ordered text parts (`a:r` regular runs) of a paragraph, with append mutation.
 *
 * @remarks
 * Supports index access (`paragraph.textParts[0]`), `length`, iteration, and
 * {@link TextPartCollection.add}. `a:br` and `a:fld` siblings are skipped by the
 * walk. Removal (`remove` / `removeAt`) lands with TASK-1082.
 */
export type TextPartCollection = ReadonlyArray<TextPart> & {
    /**
     * Appends a detached {@link TextPart} to the end of this paragraph's run
     * sequence and returns the re-bound, live handle.
     *
     * @param textPart - A {@link TextPart} constructed detached
     *   (`new TextPart(text)`). If the instance is already attached to another
     *   paragraph, appending it again would graft the same `a:r` element into a
     *   second parent — callers must construct a fresh {@link TextPart} per add
     *   (the element is reparented, not copied).
     * @returns The same {@link TextPart} instance, re-bound to the live paragraph.
     *
     * @remarks
     * Insertion is before any existing `a:endParaRPr` so schema order is preserved
     * (`dml-main.xsd` `CT_TextParagraph`). Existing `a:br` / `a:fld` siblings are
     * left untouched. Security limits (text-node length) were enforced at
     * {@link TextPart} construction time and again on later `text` / `font` edits.
     */
    add(textPart: TextPart): TextPart;
};
/**
 * Builds a live {@link TextPartCollection} proxy over a paragraph's `a:r` runs.
 *
 * @internal
 * @param {*} getParts - Returns the current walk result (re-evaluated on access).
 * @param {*} addPart - Grafts a detached {@link TextPart} into the paragraph.
 * @returns {TextPartCollection} The result.
 */
export function createTextPartCollection(getParts: () => ReadonlyArray<TextPart>,
                                         addPart: (textPart: TextPart) => TextPart): TextPartCollection {
    return new Proxy([] as unknown as TextPartCollection, {
        /**
         *
         * @param {TextPartCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {*} The result.
         */
        get(_target: TextPartCollection, prop: string | symbol): unknown {
            // ES FlattenIntoArray uses IsArray. A Proxy's `[[IsArray]]` is derived from
            // the target's `[[IsArray]]`. We use an empty array as the target (and never
            // mutate it) so `paragraphs.flatMap((p) => p.textParts)` keeps flattening the
            // collection into its TextParts. The trap forwards reads to the live walk.
            if (prop === Symbol.isConcatSpreadable) {
                return true;
            }
            if (prop === 'add') {
                return addPart;
            }
            const parts: ReadonlyArray<TextPart> = getParts();
            const value: unknown = Reflect.get(parts, prop, parts);
            if (typeof value === 'function') {
                return (value as (...args: unknown[]) => unknown).bind(parts);
            }
            return value;
        },
        /**
         *
         * @param {TextPartCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @param {*} value - The value value.
         * @returns {boolean} The result.
         */
        set(_target: TextPartCollection, prop: string | symbol, value: unknown): boolean {
            const parts: Array<TextPart> = getParts() as TextPart[];
            return Reflect.set(parts, prop, value, parts);
        },
        /**
         *
         * @param {TextPartCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {boolean} The result.
         */
        has(_target: TextPartCollection, prop: string | symbol): boolean {
            if (prop === 'add') {
                return true;
            }
            return Reflect.has(getParts(), prop);
        },
        /**
         *
         * @returns {*} The result.
         */
        ownKeys() : Array<string | symbol> {
            return Reflect.ownKeys(getParts()).filter(
                (key: string | number | symbol): key is string | symbol => typeof key !== 'number'
            );
        },
        /**
         *
         * @param {TextPartCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {*} The result.
         */
        getOwnPropertyDescriptor(_target: TextPartCollection, prop: string | symbol): PropertyDescriptor | undefined {
            const parts: ReadonlyArray<TextPart> = getParts();
            const descriptor: TypedPropertyDescriptor<unknown> = Reflect.getOwnPropertyDescriptor(parts, prop);
            if (descriptor === undefined) {
                return undefined;
            }
            return { ...descriptor, configurable: true, enumerable: true };
        }
    });
}
