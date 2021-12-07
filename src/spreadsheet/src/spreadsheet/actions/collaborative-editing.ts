import { Spreadsheet } from '../base/index';
import { collaborativeUpdate, CollaborativeEditArgs, updateAction } from '../common/index';
/**
 * Collaborative Editing module for real time changes in the Spreadsheet.
 */
export class CollaborativeEditing {
    private parent: Spreadsheet;

    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private refreshClients(options: CollaborativeEditArgs): void {
        updateAction(options, this.parent);
    }

    private addEventListener(): void {
        this.parent.on(collaborativeUpdate, this.refreshClients, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(collaborativeUpdate, this.refreshClients);
        }
    }

    /**
     * Destroy collaborative editing module.
     *
     * @returns {void} - Destroy collaborative editing module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the collaborative editing module name.
     *
     * @returns {string} - Get the collaborative editing module name.
     */
    public getModuleName(): string {
        return 'collaborativeEditing';
    }
}

