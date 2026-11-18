/**
 * Math break (`m:brk`) and its collection.
 */

import { K } from './keys';
import { OwnerHolder } from './owner-holder';
import { OwnedCollection, CollectionOwner } from './collection';

/**
 * Manual line break inside a Math run, box or run format.
 *
 * @public
 */
export class OfficeMathBreak extends OwnerHolder {
    /** Alignment point (`m:alnAt`) the next line aligns to. Default 0. */
    get alignAt(): number {
        return this.getProperty(K.AlignAt, () => 0);
    }
    set alignAt(value: number) {
        this.setProperty(K.AlignAt, value);
    }

    /** Whether `alignAt` was set or parsed explicitly. */
    get hasExplicitAlignAt(): boolean {
        return this.isExplicit(K.AlignAt);
    }
}

/**
 * Ordered collection of {@link OfficeMathBreak}.
 *
 * @public
 */
export class OfficeMathBreakCollection extends OwnedCollection<OfficeMathBreak> {
    constructor(owner: CollectionOwner) {
        super(owner);
    }

    /**
     * Creates a break and appends it, or inserts it at `index`.
     *
     * @param {number | undefined} index - The index.
     * @returns {OfficeMathBreak} The result.
     */
    add(index?: number): OfficeMathBreak {
        const item: OfficeMathBreak = new OfficeMathBreak(this.owner);
        item.setOwner(undefined);
        this.insertItem(index === undefined ? this.count : index, item);
        return item;
    }
}
