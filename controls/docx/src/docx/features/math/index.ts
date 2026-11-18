/**
 * Native math (OMML) equations: `Math` paragraph item and live math DOM.
 *
 * The `Math` class is a document paragraph item that directly exposes the live
 * `ej2-office-common` MathParagraph DOM. Users access and modify the live DOM
 * directly through `math.mathParagraph`; all changes are serialized without conversion.
 *
 * Math formatting is available via `math.characterFormat` (applied to runs).
 *
 * OMML parsing and serialization are handled by `@syncfusion/ej2-office-common`.
 *
 * @packageDocumentation
 */
import { Paragraph } from '../document/paragraph';
import { Math } from './math';
import { ConcreteParagraphItem } from '../document/text-range';

export * from './math';

declare module '../document/paragraph' {
    interface Paragraph {
        /**
         * Native math items in this paragraph, in document order.
         *
         * @public
         */
        readonly mathEquations: ReadonlyArray<Math>;
    }
}

Object.defineProperty(Paragraph.prototype, 'mathEquations', {
    configurable: true,
    enumerable: false,
    get(this: Paragraph): ReadonlyArray<Math> {
        return this.items.filter((i: ConcreteParagraphItem) => i instanceof Math) as Math[];
    }
});
