/**
 * Base class of every owner-aware Math object.
 */

import { OfficeMathEntity } from './entity';
import { ExplicitPropertyStore } from './property-store';

/**
 * Holds the owner reference, bubbles mutations to the root and tracks explicit properties.
 *
 * @public
 */
export abstract class OwnerHolder extends ExplicitPropertyStore implements OfficeMathEntity {
    private _owner: OfficeMathEntity | undefined;

    constructor(owner?: OfficeMathEntity) {
        super();
        this._owner = owner;
    }

    /** The containing entity, or `undefined` for a root or detached object. */
    get ownerMathEntity(): OfficeMathEntity | undefined {
        return this._owner;
    }

    /**
     * Re-parents this object.
     *
     * @param {OfficeMathEntity | undefined} owner - The owner.
     * @returns {void} Nothing is returned.
     * @private
     */
    setOwner(owner: OfficeMathEntity | undefined): void {
        this._owner = owner;
    }

    /**
     * True when this object is a matrix row or column, whose arguments are managed by synchronization.
     *
     * @private
     */
    get isMatrixArgumentOwner(): boolean {
        return false;
    }

    /**
     * Root-level mutation sink. The Math paragraph overrides it to notify the host.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    protected rootMutated(): void {
    // no-op unless this object is the root
    }

    /**
     * Notifies the root that something below it changed.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyMutated(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
        let current: OwnerHolder = this;
        let next: OfficeMathEntity = current._owner;
        while (next instanceof OwnerHolder) {
            current = next;
            next = current._owner;
        }
        current.rootMutated();
    }

    protected propertyChanged(): void {
        this.notifyMutated();
    }
}
