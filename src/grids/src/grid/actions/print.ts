import { print as printWindow, createElement, detach, classList, selectAll, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, PrintEventArgs } from '../base/interface';
import { getPrintGridModel } from '../base/util';
import { Scroll } from '../actions/scroll';
import { Grid } from '../base/grid';
import * as events from '../base/constant';
import { Deferred } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import * as literals from '../base/string-literals';

/**
 * @returns {string[]} returns the cloned property
 * @hidden
 */
export function getCloneProperties(): string[] {
    return ['aggregates', 'allowGrouping', 'allowFiltering', 'allowMultiSorting', 'allowReordering', 'allowSorting',
        'allowTextWrap', 'childGrid', 'columns', 'currentViewData', 'dataSource', 'detailTemplate', 'enableAltRow',
        'enableColumnVirtualization', 'filterSettings', 'gridLines',
        'groupSettings', 'height', 'locale', 'pageSettings', 'printMode', 'query', 'queryString', 'enableRtl',
        'rowHeight', 'rowTemplate', 'sortSettings', 'textWrapSettings', 'allowPaging', 'hierarchyPrintMode', 'searchSettings',
        'queryCellInfo', 'beforeDataBound', 'enableHtmlSanitizer'];
}

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
    public static printGridProp: string[] = [...getCloneProperties(), events.beforePrint, events.printComplete, events.load];

    private defered: Deferred = new Deferred();
    private actionBeginFunction: Function;

    /**
     * Constructor for the Grid print module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {Scroll} scrollModule - specifies the scroll module
     * @hidden
     */
    constructor(parent?: IGrid, scrollModule?: Scroll) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.contentReady, this.isContentReady(), this);
        this.actionBeginFunction = this.actionBegin.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.on(events.onEmpty, this.onEmpty.bind(this));
        this.parent.on(events.hierarchyPrint, this.hierarchyPrint, this);
        this.scrollModule = scrollModule;
    }

    private isContentReady(): Function {
        if (this.isPrintGrid() && (this.parent.hierarchyPrintMode === 'None' || !this.parent.childGrid) ) {
            return this.contentReady;
        }
        return () => {
            this.defered.promise.then(() => {
                this.contentReady();
            });
            if (this.isPrintGrid()) {
                this.hierarchyPrint();
            }
        };
    }

    private hierarchyPrint(): void {
        this.removeColGroup(this.parent);
        const printGridObj: IGrid = (<{printGridObj?: IGrid}>window).printGridObj;
        if (printGridObj && !printGridObj.element.querySelector('[aria-busy=true')) {
            printGridObj.printModule.defered.resolve();
        }
    }

    /**
     * By default, prints all the Grid pages and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./printmode/).
     *
     * @returns {void}
     */
    public print(): void {
        this.renderPrintGrid();
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
        const gObj: IGrid = this.parent;
        const element: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_print', className: gObj.element.className + ' e-print-grid'
        });
        element.classList.remove('e-gridhover');
        document.body.appendChild(element);
        const printGrid: IGrid = new Grid(getPrintGridModel(gObj, gObj.hierarchyPrintMode) as Object);
        for (let i: number = 0; i < printGrid.columns.length; i++) {
            (printGrid.columns[parseInt(i.toString(), 10)] as Column) = extend({}, printGrid.columns[parseInt(i.toString(), 10)]) as Column;
            if (!gObj.getFrozenColumns() && gObj.isFrozenGrid()) {
                (printGrid.columns[parseInt(i.toString(), 10)] as Column).freeze = undefined;
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.parent as any).isAngular ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (printGrid as any).viewContainerRef = (this.parent as any).viewContainerRef;
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        (printGrid as Grid).load = () => {};
        printGrid.query = gObj.getQuery().clone();
        (<{printGridObj?: IGrid}>window).printGridObj = printGrid;
        printGrid.isPrinting = true;
        const modules: Function[] = printGrid.getInjectedModules();
        const injectedModues: Function[] = gObj.getInjectedModules();
        if (!modules || modules.length !== injectedModues.length) {
            (printGrid as Grid).setInjectedModules(injectedModues);
        }
        gObj.notify(events.printGridInit, { element: element, printgrid: printGrid });
        this.parent.log('exporting_begin', this.getModuleName());
        printGrid.registeredTemplate = this.parent.registeredTemplate;
        printGrid.isVue = this.parent.isVue;
        if (this.parent.isVue) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (printGrid as any).vueInstance = (this.parent as any).vueInstance;
        }
        printGrid.printGridParent = gObj;
        printGrid.appendTo(element as HTMLElement);
        if (!gObj.isVue3) {
            printGrid.trigger = gObj.trigger;
        }
    }

    private contentReady(): void {
        if (this.isPrintGrid()) {
            const gObj: IGrid = this.parent;
            if (this.isAsyncPrint) {
                this.printGrid();
                return;
            }
            const args: PrintEventArgs = {
                requestType: 'print',
                element: gObj.element,
                selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]'),
                cancel: false,
                hierarchyPrintMode: gObj.hierarchyPrintMode
            };
            if (!this.isAsyncPrint) {
                gObj.trigger(events.beforePrint, args);
            }
            if (args.cancel) {
                detach(gObj.element);
                return;
            }
            if (!this.isAsyncPrint) {
                if (this.parent.printGridParent && this.parent.printGridParent.isReact) {
                    this.parent.printGridParent.renderTemplates((): void => {
                        this.printGrid();
                    });
                } else {
                    this.printGrid();
                }
            }
        }
    }

    private printGrid(): void {
        const gObj: IGrid = this.parent;
        // Height adjustment on print grid
        if (gObj.height !== 'auto') { // if scroller enabled
            const cssProps: {
                padding?: string,
                border?: string
            } = this.scrollModule.getCssProperties();
            const contentDiv: HTMLElement = (gObj.element.querySelector('.' + literals.content) as HTMLElement);
            const headerDiv: HTMLElement = (<HTMLElement>gObj.element.querySelector('.' + literals.gridHeader));
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
                this.removeColGroup(gObj);
            }
        }
        // hide horizontal scroll
        for (const element of [].slice.call(gObj.element.getElementsByClassName(literals.content))) {
            element.style.overflowX = 'hidden';
        }
        // Hide the waiting popup
        const waitingPop: NodeListOf<Element> = [].slice.call(gObj.element.getElementsByClassName('e-spin-show'));
        for (const element of [].slice.call(waitingPop)) {
            classList(element, ['e-spin-hide'], ['e-spin-show']);
        }
        this.printGridElement(gObj);
        gObj.isPrinting = false;
        delete (<{printGridObj?: IGrid}>window).printGridObj;
        const args: PrintEventArgs = {
            element: gObj.element
        };
        gObj.trigger(events.printComplete, args);
        (gObj as Grid).destroy();
        this.parent.log('exporting_complete', this.getModuleName());
    }

    private printGridElement(gObj: IGrid): void {
        classList(gObj.element, ['e-print-grid-layout'], ['e-print-grid']);
        if (gObj.isPrinting) {
            detach(gObj.element);
        }
        this.printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        if (!isNullOrUndefined(this.printWind)) {
            this.printWind.moveTo(0, 0);
            this.printWind.resizeTo(screen.availWidth, screen.availHeight);
            this.printWind = printWindow(gObj.element, this.printWind);
        }
    }

    private removeColGroup(gObj: IGrid) : void {
        const depth: number = gObj.groupSettings.columns.length;
        const element: HTMLElement = gObj.element;
        const id: string = '#' + gObj.element.id;
        if (!depth) {
            return;
        }
        const groupCaption: HTMLElement[] = selectAll('.e-groupcaption', element);
        const colSpan: string = gObj.groupSettings.enableLazyLoading ? (parseInt(groupCaption[0].getAttribute('colspan'), 10) -
            (gObj.groupSettings.columns.length - 1)).toString() : (<HTMLElement>groupCaption[depth - 1]).getAttribute('colspan');
        for (let i: number = 0; i < groupCaption.length; i++) {
            (<HTMLElement>groupCaption[parseInt(i.toString(), 10)]).setAttribute('colspan', colSpan);
        }
        const colGroups: HTMLElement[] = selectAll(`colgroup${id}colgroup`, element);
        const contentColGroups: HTMLElement[] = selectAll('.e-content colgroup', element);
        const footerColGroups: HTMLElement[] = selectAll('.e-summarycontent colgroup', element);
        this.hideColGroup(colGroups, depth);
        this.hideColGroup(contentColGroups, depth);
        this.hideColGroup(footerColGroups, depth);
    }

    private hideColGroup(colGroups: HTMLElement[], depth: number): void {
        for (let i: number = 0; i < colGroups.length; i++) {
            for (let j: number = 0; j < depth; j++) {
                (<HTMLElement>(<HTMLElement>colGroups[parseInt(i.toString(), 10)]).children[parseInt(j.toString(), 10)]).style.display = 'none';
            }
        }
    }

    /**
     * To destroy the print
     *
     * @returns {boolean} returns the isPrintGrid or not
     * @hidden
     */
    public isPrintGrid(): boolean {
        return this.parent.element.id.indexOf('_print') > 0 && this.parent.isPrinting;
    }

    /**
     * To destroy the print
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.contentReady, this.contentReady.bind(this));
        this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.off(events.onEmpty, this.onEmpty.bind(this));
        this.parent.off(events.hierarchyPrint, this.hierarchyPrint);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'print';
    }
}
