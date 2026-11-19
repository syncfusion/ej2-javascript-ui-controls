import { Paragraph } from './paragraph';

/**
 * Structural contract for a modeled table body item (`w:tbl`).
 * Runtime class lives in the tables feature; core never value-imports it.
 *
 * @public
 */
export interface TableBodyItem {
    readonly rows: { readonly length: number };
}

/**
 * Structural contract for a modeled block content control (`w:sdt`).
 * Runtime class lives in the content-controls feature; core never value-imports it.
 *
 * @public
 */
export interface BlockContentControlBodyItem {
    readonly isBlockLevel?: boolean;
}

/**
 * Closed public body item — direct instances, not wrapper objects.
 *
 * Supported main-story children only: {@link Paragraph}, table, and block
 * content control. Unsupported markup is preserved off this public list.
 *
 * @public
 */
export type BodyItem = Paragraph | TableBodyItem | BlockContentControlBodyItem;

/**
 * @param {unknown} value - The value.
 * @returns {*} The result.
 * @private
 * True when `value` is a {@link Paragraph} instance.
 */
export function isParagraphBodyItem(value: unknown): value is Paragraph {
    return value instanceof Paragraph;
}
