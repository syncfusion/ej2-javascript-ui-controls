import { Column, ColumnFreezeContentRenderer, FreezeContentRender, FreezeRowModelGenerator, IGrid, NotifyArgs, RenderType, Row, ServiceLocator } from '@syncfusion/ej2-grids';
import * as literals from '../base/constant';
import { ColumnVirtualFreezeRenderer, setDebounce, VirtualFreezeHdrRenderer, VirtualFreezeRenderer} from '@syncfusion/ej2-grids';
import { TreeInterSectionObserver, VirtualTreeContentRenderer } from './virtual-tree-content-render';
import { RendererFactory } from '@syncfusion/ej2-grids/src/grid/services/renderer-factory';
import { getValue } from '@syncfusion/ej2-base';

/**
 * VirtualTreeFreezeRenderer is used to render the virtual table within the frozen and movable content table
 *
 * @hidden
 */

export class VirtualTreeFreezeRenderer extends VirtualFreezeRenderer {
    protected serviceLoc: ServiceLocator;
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public renderTable(): void {
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        this.virtualRenderer = new VirtualTreeContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.header = (this.serviceLoc.getService<RendererFactory>('rendererFactory')
            .getRenderer(RenderType.Header) as VirtualFreezeHdrRenderer).virtualHdrRenderer;
        FreezeContentRender.prototype.renderTable.call(this);
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        const movableCont: Element = this.getMovableContent();
        const minHeight: number = <number>this.parent.height;
        this.virtualRenderer.virtualEle.content = this.virtualRenderer.content = <HTMLElement>this.getPanel().querySelector('.' + literals.content);
        (this.virtualRenderer.virtualEle.content as HTMLElement).style.overflowX = 'hidden';
        this.virtualRenderer.virtualEle.renderFrozenWrapper(minHeight);
        this.virtualRenderer.virtualEle.renderFrozenPlaceHolder();
        if (this.parent.enableColumnVirtualization) {
            this.virtualRenderer.virtualEle.movableContent = this.virtualRenderer.movableContent
                = <HTMLElement>this.getPanel().querySelector('.' + literals.movableContent);
            this.virtualRenderer.virtualEle.renderMovableWrapper(minHeight);
            this.virtualRenderer.virtualEle.renderMovablePlaceHolder();
            const tbl: HTMLElement = movableCont.querySelector('table');
            this.virtualRenderer.virtualEle.movableTable = tbl;
            this.virtualRenderer.virtualEle.movableWrapper.appendChild(tbl);
            movableCont.appendChild(this.virtualRenderer.virtualEle.movableWrapper);
            movableCont.appendChild(this.virtualRenderer.virtualEle.movablePlaceholder);
        }
        this.virtualRenderer.virtualEle.wrapper.appendChild(this.getFrozenContent());
        this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
        this.virtualRenderer.virtualEle.table = <HTMLElement>this.getTable();
        setDebounce(this.parent, this.virtualRenderer, this.scrollbar, this.getMovableContent());
    }

    /**
     * @param {HTMLElement} target - specifies the target
     * @param {DocumentFragment} newChild - specifies the newChild
     * @param {NotifyArgs} e - specifies the notifyargs
     * @returns {void}
     * @hidden
     */
    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void {
        getValue('observer', this.virtualRenderer).options.debounceEvent = false;
        this.virtualRenderer['observers'] = new TreeInterSectionObserver(getValue('observer', this.virtualRenderer).element,
                                                                         getValue('observer', this.virtualRenderer).options,
                                                                         getValue('observer', this.virtualRenderer).movableEle);
        this.virtualRenderer['contents'] = this.getPanel().firstChild as HTMLElement;
        super.appendContent(target, newChild, e);
    }

    /**
     * @param {Object[]} data - specifies the data
     * @param {NotifyArgs} e - specifies the notifyargs
     * @returns {Row<Column>[]} returns the row
     * @hidden
     */
    public generateRows(data: Object[], e?: NotifyArgs): Row<Column>[] {
        return super.generateRows(data, e);
    }
}


/**
 * ColumnVirtualTreeFreezeRenderer is used to render the virtual table within the frozen and movable content table
 *
 * @hidden
 */
export class ColumnVirtualTreeFreezeRenderer extends ColumnVirtualFreezeRenderer {
    protected serviceLoc: ServiceLocator;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.serviceLoc = locator;
        this.eventListener('on');
    }

    /**
     * @returns {void}
     * @hidden
     */
    public renderTable(): void {
        this.virtualRenderer = new VirtualTreeContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.header = (this.serviceLoc.getService<RendererFactory>('rendererFactory')
            .getRenderer(RenderType.Header) as VirtualFreezeHdrRenderer).virtualHdrRenderer;
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        ColumnFreezeContentRenderer.prototype.renderTable.call(this);
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        const frozenRightCont: Element = this.getFrozenRightContent();
        let frzCont: Element = this.getFrozenContent();
        const movableCont: Element = this.getMovableContent();
        if (this.parent.getFrozenMode() === 'Right') {
            frzCont = frozenRightCont;
        }
        this.virtualRenderer.virtualEle.content = this.virtualRenderer.content = <HTMLElement>this.getPanel().querySelector('.' + literals.content);
        (this.virtualRenderer.virtualEle.content as HTMLElement).style.overflowX = 'hidden';
        const minHeight: number = <number>this.parent.height;
        this.virtualRenderer.virtualEle.renderFrozenWrapper(minHeight);
        this.virtualRenderer.virtualEle.renderFrozenPlaceHolder();
        super['renderVirtualFrozenLeft'](frzCont, movableCont);
        super['renderVirtualFrozenRight'](frzCont, movableCont);
        super['renderVirtualFrozenLeftRight'](frzCont, movableCont, frozenRightCont);
        this.virtualRenderer.virtualEle.table = <HTMLElement>this.getTable();
        setDebounce(this.parent, this.virtualRenderer, this.scrollbar, this.getMovableContent());
    }

    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void {
        getValue('observer', this.virtualRenderer).options.debounceEvent = false;
        this.virtualRenderer['observers'] = new TreeInterSectionObserver(getValue('observer', this.virtualRenderer).element,
                                                                         getValue('observer', this.virtualRenderer).options, getValue('observer', this.virtualRenderer).movableEle);
        this.virtualRenderer['contents'] = this.getPanel().firstChild as HTMLElement;
        super.appendContent(target, newChild, e);
    }
}

/**
 * VirtualTreeFreezeHdrRenderer is used to render the virtual table within the frozen and movable header table
 *
 * @hidden
 */
export class VirtualTreeFreezeHdrRenderer extends VirtualFreezeHdrRenderer {
    /**
     * @returns {void}
     * @hidden
     */
    public renderTable(): void {
        super.renderTable();
    }

    protected rfshMovable(): void {
        super.rfshMovable();
    }
}
