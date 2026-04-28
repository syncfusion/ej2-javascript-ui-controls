import { IGrid, IAction } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
/**
 * `Freeze` module is used to handle Frozen rows and columns.
 *
 * @hidden
 */
export class Freeze implements IAction {
    private locator: ServiceLocator;
    private parent: IGrid;
    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'freeze';
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private instantiateRenderer(): void {
        this.parent.log('limitation', this.getModuleName());
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialLoad, this.instantiateRenderer);
        this.parent.off(events.destroy, this.destroy);
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
