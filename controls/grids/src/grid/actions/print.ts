import { print as printWindow, createElement, detach } from '@syncfusion/ej2-base';
import { IGrid, PrintEventArgs } from '../base/interface';
import { removeElement, getActualProperties, getActualPropFromColl } from '../base/util';
import { Scroll } from '../actions/scroll';
import { Grid } from '../base/grid';
import * as events from '../base/constant';

/**
 * 
 * The `Print` module is used to handle print action.
 */
export class Print {

    //Module declarations
    private parent: IGrid;
    private printWind: Window;
    private scrollModule: Scroll;
    private isAsyncPrint: boolean = false;
    private printing: string = 'isPrinting';
    private static printGridProp: string[] = [
        'aggregates', 'allowGrouping', 'allowFiltering', 'allowMultiSorting', 'allowReordering', 'allowSorting',
        'allowTextWrap', 'childGrid', 'columns', 'currentViewData', 'dataSource', 'detailTemplate', 'enableAltRow',
        'enableColumnVirtualization', 'filterSettings', 'gridLines',
        'groupSettings', 'height', 'locale', 'pageSettings', 'printMode', 'query', 'queryString',
        'rowHeight', 'rowTemplate', 'sortSettings', 'textWrapSettings', 'allowPaging',
        events.beforePrint, events.printComplete
    ];


    /**
     * Constructor for the Grid print module
     * @hidden
     */
    constructor(parent?: IGrid, scrollModule?: Scroll) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.contentReady, this.contentReady.bind(this));
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.on(events.onEmpty, this.onEmpty.bind(this));
        this.scrollModule = scrollModule;
    }

    /**
     * By default, prints all the Grid pages and hides the pager. 
     * > You can customize print options using the 
     * [`printMode`](./api-grid.html#printmode-string). 
     * @return {void}
     */
    public print(): void {
        this.renderPrintGrid();
        this.printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWind.moveTo(0, 0);
        this.printWind.resizeTo(screen.availWidth, screen.availHeight);
    }

    private onEmpty(): void {
        if (this.isPrintGrid()) {
            this.contentReady();
        }
    }
    private actionBegin(): void {
        if (this.isPrintGrid()) {
            this.isAsyncPrint = true;
        }
    }
    private renderPrintGrid(): void {
        let gObj: IGrid = this.parent;
        let elem: string = 'element';
        let printGridModel: { [key: string]: object | boolean } = {};
        let element: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_print', className: gObj.element.className + ' e-print-grid'
        });
        document.body.appendChild(element);
        for (let key of Print.printGridProp) {
            if (key === 'columns') {
                printGridModel[key] = getActualPropFromColl(gObj[key]);
            } else if (key === 'allowPaging') {
                printGridModel[key] = this.parent.printMode === 'CurrentPage';
            } else {
                printGridModel[key] = getActualProperties(gObj[key]);
            }
        }
        let printGrid: IGrid = new Grid(printGridModel);
        printGrid.appendTo(element as HTMLElement);
        printGrid.registeredTemplate = this.parent.registeredTemplate;
        printGrid[this.printing] = true;
        printGrid.trigger = gObj.trigger;
    }

    private contentReady(): void {
        if (this.isPrintGrid()) {
            let gObj: IGrid = this.parent;
            if (this.isAsyncPrint) {
                this.printGrid();
                return;
            }
            let args: PrintEventArgs = {
                requestType: 'print',
                element: gObj.element,
                selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]'),
                cancel: false
            };
            if (!this.isAsyncPrint) {
                gObj.trigger(events.beforePrint, args);
            }
            if (args.cancel) {
                detach(gObj.element);
                return;
            } else if (!this.isAsyncPrint) {
                this.printGrid();
            }
        }
    }

    private printGrid(): void {
        let gObj: IGrid = this.parent;
        // Pager eleement process based on primt mode
        if (gObj.allowPaging && gObj.printMode === 'CurrentPage') {
            (gObj.element.querySelector('.e-gridpager') as HTMLElement).style.display = 'none';
        }
        // Height adjustment on print grid
        if (gObj.height !== 'auto') { // if scroller enabled
            let cssProps: {
                padding?: string,
                border?: string
            } = this.scrollModule.getCssProperties();
            let contentDiv: HTMLElement = (gObj.element.querySelector('.e-content') as HTMLElement);
            let headerDiv: HTMLElement = (<HTMLElement>gObj.element.querySelector('.e-gridheader'));
            contentDiv.style.height = 'auto';
            contentDiv.style.overflowY = 'auto';
            headerDiv.style[cssProps.padding] = '';
            (headerDiv.firstElementChild as HTMLElement).style[cssProps.border] = '';
        }
        // Grid alignment adjustment on grouping
        if (gObj.allowGrouping) {
            if (!gObj.groupSettings.columns.length) {
                (gObj.element.querySelector('.e-groupdroparea') as HTMLElement).style.display = 'none';
            } else {
                this.removeColGroup(gObj.groupSettings.columns.length, gObj.element);
                removeElement(gObj.element, '.e-grouptopleftcell');
                removeElement(gObj.element, '.e-recordpluscollapse');
                removeElement(gObj.element, '.e-indentcell');
                removeElement(gObj.element, '.e-recordplusexpand');
            }
        }
        // hide horizontal scroll
        (gObj.element.querySelector('.e-content') as HTMLElement).style.overflowX = 'hidden';
        //hide filter bar in print grid
        if (gObj.allowFiltering && gObj.filterSettings.type === 'FilterBar') {
            (gObj.element.querySelector('.e-filterbar') as HTMLElement).style.display = 'none';
        }
        // Hide the waiting popup
        let waitingPop: NodeListOf<Element> = gObj.element.querySelectorAll('.e-spin-show');
        if (waitingPop.length > 0) {
            waitingPop[0].classList.add('e-spin-hide');
            waitingPop[0].classList.remove('e-spin-show');
        }
        if (gObj[this.printing]) {
            detach(gObj.element);
        }
        gObj.element.classList.remove('e-print-grid');
        this.printWind = printWindow(gObj.element, this.printWind);
        gObj[this.printing] = false;
        let args: PrintEventArgs = {
            element: gObj.element
        };
        gObj.trigger(events.printComplete, args);
    }

    private removeColGroup(depth: number, element: HTMLElement): void {
        let groupCaption: NodeList = element.querySelectorAll('.e-groupcaption');
        let colSpan: string = (<HTMLElement>groupCaption[depth - 1]).getAttribute('colspan');
        for (let i: number = 0; i < groupCaption.length; i++) {
            (<HTMLElement>groupCaption[i]).setAttribute('colspan', colSpan);
        }
        let colGroups: NodeList = element.querySelectorAll('colgroup');
        for (let i: number = 0; i < colGroups.length; i++) {
            for (let j: number = 0; j < depth; j++) {
                (<HTMLElement>colGroups[i].childNodes[j]).style.display = 'none';
            }
        }
    }

    private isPrintGrid(): boolean {
        return this.parent.element.id.indexOf('_print') > 0 && this.parent[this.printing];
    }

    /**
     * To destroy the print 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.contentReady, this.contentReady.bind(this));
        this.parent.removeEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.off(events.onEmpty, this.onEmpty.bind(this));
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'print';
    }

}

