import { DomVirtualContentRenderer } from '@syncfusion/ej2-grids';
import { IGrid } from '@syncfusion/ej2-grids';
import { ServiceLocator } from '@syncfusion/ej2-grids';


/**
 * DomVirtualTreeContentRenderer extends Grid's DOM virtualization rendering layer to provide tree-specific hierarchy support.
 *
 * @hidden
 */
export class DomVirtualTreeContentRenderer extends DomVirtualContentRenderer {

    /**
     * Constructor for DomVirtualTreeContentRenderer
     *
     * @param {IGrid} parent - Grid/TreeGrid instance
     * @param {ServiceLocator} locator - Service locator for dependency injection
     */
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
    }

    public destroy(): void {
        this.removeEventListener();
        super.destroy();
    }
}
