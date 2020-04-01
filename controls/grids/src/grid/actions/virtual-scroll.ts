import { IGrid, IAction } from '../base/interface';
import { initialLoad } from '../base/constant';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualContentRenderer, VirtualHeaderRenderer }  from '../renderer/virtual-content-renderer';
import * as events from '../base/constant';
import { isBlazor } from '@syncfusion/ej2-base';
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
        this.parent.log(['limitation', 'virtual_height'], 'virtualization');
        let renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
        if (!this.parent.getFrozenColumns()) {
            if (this.parent.enableColumnVirtualization) {
                renderer.addRenderer(RenderType.Header, new VirtualHeaderRenderer(this.parent, this.locator));
            }
            renderer.addRenderer(RenderType.Content, new VirtualContentRenderer(this.parent, this.locator));
        }
        this.ensurePageSize();
    }

    public ensurePageSize(): void {
        let rowHeight: number = this.parent.getRowHeight();
        let vHeight: string | number = this.parent.height.toString().indexOf('%') < 0 ? this.parent.height :
        this.parent.element.getBoundingClientRect().height;
        this.blockSize = ~~(<number>vHeight / rowHeight);
        let height: number =  this.blockSize * 2;
        let size: number = this.parent.pageSettings.pageSize;
        this.parent.setProperties({ pageSettings: { pageSize: size < height ? height : size }}, true);
        if (isBlazor() && this.parent.isServerRendered) {
            this.parent.notify('refresh-virtual-indices', {});
        }
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