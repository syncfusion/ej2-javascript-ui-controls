import { IGrid, IAction } from '../base/interface';
import { initialLoad } from '../base/constant';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualContentRenderer, VirtualHeaderRenderer }  from '../renderer/virtual-content-renderer';
import * as events from '../base/constant';
/**
 * Virtual Scrolling class
 */
export class VirtualScroll implements IAction {
    private parent: IGrid;
    private blockSize: number;
    private locator: ServiceLocator;
    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'virtualscroll';
    }

    private instantiateRenderer(): void {
        let renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
        if (this.parent.enableColumnVirtualization) {
            renderer.addRenderer(RenderType.Header, new VirtualHeaderRenderer(this.parent, this.locator));
        }
        renderer.addRenderer(RenderType.Content, new VirtualContentRenderer(this.parent, this.locator));
        this.ensurePageSize();
    }

    public ensurePageSize(): void {
        let rowHeight: number = this.parent.getRowHeight();
        this.blockSize = ~~(<number>this.parent.height / rowHeight);
        let height: number =  this.blockSize * 2;
        let size: number = this.parent.pageSettings.pageSize;
        this.parent.setProperties({ pageSettings: { pageSize: size < height ? height : size }}, true);
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.columnWidthChanged, this.refreshVirtualElement, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(events.columnWidthChanged, this.refreshVirtualElement);
    }

    private refreshVirtualElement(args: {module: string}): void {
        if (this.parent.enableColumnVirtualization && args.module === 'resize') {
            let renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
            (renderer.getRenderer(RenderType.Content) as VirtualContentRenderer).refreshVirtualElement();
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}