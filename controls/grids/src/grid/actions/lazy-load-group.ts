import { IGrid, IAction } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { RendererFactory } from '../services/renderer-factory';
import { GroupLazyLoadRenderer } from '../renderer/group-lazy-load-renderer';
import { RenderType } from '../base/enum';

/**
 * Group lazy load class
 */
export class LazyLoadGroup implements IAction {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;

    /**
     * Constructor for Grid group lazy load module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the ServiceLocator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'lazyLoadGroup';
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialLoad, this.instantiateRenderer);
        this.parent.off(events.destroy, this.destroy);
    }

    private instantiateRenderer(): void {
        if (this.parent.height === 'auto') {
            this.parent.height = this.parent.pageSettings.pageSize * this.parent.getRowHeight();
        }
        const renderer: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        if (this.parent.groupSettings.enableLazyLoading) {
            renderer.addRenderer(RenderType.Content, new GroupLazyLoadRenderer(this.parent, this.serviceLocator));
        }
        if (this.parent.enableVirtualization) {
            this.parent.lazyLoadRender = new GroupLazyLoadRenderer(this.parent, this.serviceLocator);
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
