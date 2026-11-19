/**
 * Collection of equations (`OfficeMath`).
 */

import { OwnedCollection, CollectionOwner } from './collection';
import { OfficeMath } from './office-math';

/**
 * Ordered collection of {@link OfficeMath} equations.
 *
 * @public
 */
export class OfficeMathCollection extends OwnedCollection<OfficeMath> {
    constructor(owner: CollectionOwner) { super(owner); }

    /**
     * Creates an equation and appends it, or inserts it at `index`.
     *
     * @param {number | undefined} index - The index.
     * @returns {OfficeMath} The result.
     */
    add(index?: number): OfficeMath {
        const item: OfficeMath = new OfficeMath();
        this.insertItem(index === undefined ? this.count : index, item);
        return item;
    }
}
