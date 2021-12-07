import { IGrid, IAction } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { FreezeRender, FreezeContentRender } from '../renderer/freeze-renderer';
import { VirtualFreezeRenderer, VirtualFreezeHdrRenderer, ColumnVirtualFreezeRenderer } from '../renderer/virtual-freeze-renderer';
import { ColumnFreezeContentRenderer, ColumnFreezeHeaderRenderer } from '../renderer/column-freeze-renderer';

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
        const renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
        if (this.parent.getFrozenColumns()) {
            if ( this.parent.enableColumnVirtualization) {
                renderer.addRenderer(RenderType.Header, new VirtualFreezeHdrRenderer(this.parent, this.locator));
            } else {
                renderer.addRenderer(RenderType.Header, new FreezeRender(this.parent, this.locator));
            }
            if (this.parent.enableVirtualization) {
                renderer.addRenderer(RenderType.Content, new VirtualFreezeRenderer(this.parent, this.locator));
            } else {
                renderer.addRenderer(RenderType.Content, new FreezeContentRender(this.parent, this.locator));
            }
        }
        if (this.parent.getFrozenLeftColumnsCount() || this.parent.getFrozenRightColumnsCount()) {
            renderer.addRenderer(RenderType.Header, new ColumnFreezeHeaderRenderer(this.parent, this.locator));
            if (this.parent.enableVirtualization) {
                renderer.addRenderer(RenderType.Content, new ColumnVirtualFreezeRenderer(this.parent, this.locator));
            } else {
                renderer.addRenderer(RenderType.Content, new ColumnFreezeContentRenderer(this.parent, this.locator));
            }
        }
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
