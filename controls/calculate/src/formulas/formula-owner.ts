import { Calculate } from '../base/index';

/**
 * Host surface shared by {@link BasicFormulas} and formula category modules.
 *
 * Category modules register `Compute*` handlers on the owner; cross-formula calls
 * (for example SUBTOTAL delegating to SUM) resolve through this interface.
 *
 * @hidden
 */
export interface FormulaOwner {
    /** Calculate engine that evaluates cell values and hosts the formula library. */
    parent: Calculate;
    /** When true, CONCATENATE uses empty-string semantics instead of skipping blanks. */
    isConcat?: boolean;
    /** Bound `Compute*` handlers and category-module methods keyed by name. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
