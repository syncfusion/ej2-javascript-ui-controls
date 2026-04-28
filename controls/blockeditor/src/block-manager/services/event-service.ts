import { BlockChange } from '../../models/index';
import { BlockManager } from '../base/block-manager';
import * as constants from '../../common/constant';
import { events } from '../../common/constant';

/**
 * Manages block change events and their tracking for the BlockEditor.
 *
 * @hidden
 */
export class EventService {
    private parent: BlockManager;
    private blockChanges: BlockChange[]

    /**
     * Creates a new BlockCommandManager instance
     *
     * @param {BlockManager} manager The parent BlockManager instance
     */
    constructor(manager: BlockManager) {
        this.parent = manager;
        this.blockChanges = [];
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(constants.CLEAREVENTCHANGES, this.clearEventChanges, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(constants.CLEAREVENTCHANGES, this.clearEventChanges);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Adds a block change operation to the collection.
     *
     * @param {BlockChange} change - The block change to add.
     * @returns {void}
     * @hidden
     */
    public addChange(change: BlockChange): void {
        this.blockChanges.push(change);
    }

    /**
     * Retrieves the current collection of block change operations.
     *
     * @returns {BlockChange[]} change - Array of block change operations.
     * @hidden
     */
    public getChanges(): BlockChange[] {
        return this.blockChanges;
    }

    /**
     * Clears all recorded block change operations.
     *
     * @returns {void}
     * @hidden
     */
    private clearEventChanges(): void {
        this.blockChanges = [];
    }

    private destroy(): void {
        this.blockChanges = null;
        this.removeEventListener();
    }
}
