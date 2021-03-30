import { Grid, getObject, Row, DetailDataBoundEventArgs, Cell, Column } from '@syncfusion/ej2-grids';
import { DetailRow as detailrow } from '@syncfusion/ej2-grids';
import { TreeGrid, ITreeData, CellSaveEventArgs } from '../base';
import { isNullOrUndefined, addClass, isBlazor } from '@syncfusion/ej2-base';
import { getExpandStatus, isRemoteData  } from '../utils';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';

/**
 * TreeGrid Detail Row module
 *
 * @hidden
 */
export class DetailRow {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(detailrow);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns DetailRow module name
     */
    protected getModuleName(): string {
        return 'detailRow';
    }
    public addEventListener(): void {
        this.parent.on('dataBoundArg', this.dataBoundArg, this);
        this.parent.on('detaildataBound', this.detaildataBound, this);
        this.parent.grid.on('detail-indentcell-info', this.setIndentVisibility, this);
        this.parent.on('childRowExpand', this.childRowExpand, this);
        this.parent.on('rowExpandCollapse', this.rowExpandCollapse, this);
        this.parent.on('actioncomplete', this.actioncomplete, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('dataBoundArg', this.dataBoundArg);
        this.parent.off('detaildataBound', this.detaildataBound);
        this.parent.off('childRowExpand', this.childRowExpand);
        this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
        this.parent.off('actioncomplete', this.actioncomplete);
        this.parent.grid.off('detail-indentcell-info', this.setIndentVisibility);
    }

    private setIndentVisibility(args: Object): void {
        const visible: string = 'visible';
        args[visible] = false;
    }

    private dataBoundArg(): void {
        const detailele: HTMLTableRowElement[] = this.parent.getRows().filter((e: HTMLTableRowElement) => {
            return !e.classList.contains('e-detailrow');
        });
        for (let i: number = 0; i < detailele.length; i++) {
            const elements: Object = detailele[i].getElementsByClassName('e-detailrowcollapse');
            const detailData: Row<Object> = this.parent.grid.getRowObjectFromUID(detailele[i].getAttribute('data-Uid'));
            const parentItem: Object = getObject('parentItem', this.parent.grid.getCurrentViewRecords()[i]);
            if (isNullOrUndefined(parentItem) || !isNullOrUndefined(parentItem) &&
        getExpandStatus(this.parent, detailData.data, this.parent.grid.getCurrentViewRecords())) {
                this.parent.grid.detailRowModule.expand(elements[0]);
            }
        }
    }
    private childRowExpand(args: { row: HTMLTableRowElement }): void {
        const detailRowElement: Object = args.row.getElementsByClassName('e-detailrowcollapse');
        if (!isNullOrUndefined(detailRowElement[0])) {
            this.parent.grid.detailRowModule.expand(detailRowElement[0]);
        }
    }

    private rowExpandCollapse(args: { detailrows: HTMLTableRowElement[], action: string }): void {
        if (isRemoteData(this.parent)) {
            return;
        }
        for (let i: number = 0; i < args.detailrows.length; i++) {
            args.detailrows[i].style.display = args.action;
        }
    }
    private detaildataBound(args: DetailDataBoundEventArgs): void {
        if (!isBlazor() || !this.parent.isServerRendered) {
            const data: ITreeData = <ITreeData>args.data;
            const row: HTMLElement = args.detailElement.parentElement.previousSibling as HTMLElement;
            const index: number = !isNullOrUndefined(data.parentItem) ? data.parentItem.index : data.index;
            const expandClass: string = 'e-gridrowindex' + index + 'level' + data.level;
            const classlist: DOMTokenList = row.querySelector('.' + expandClass).classList;
            const gridClas: string[] = [].slice.call(classlist).filter((gridclass: string) => (gridclass === expandClass));
            const newNo: number = gridClas[0].length;
            const slicedclas: string = gridClas.toString().slice(6, newNo);
            const detailClass: string = 'e-griddetail' + slicedclas;
            addClass([args.detailElement.parentElement], detailClass);
        }
    }

    private actioncomplete(args: CellSaveEventArgs): void {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            const spann: string = ((args.row as HTMLElement).querySelectorAll('.e-editcell')[0].getAttribute('colSpan'));
            const colum: number = parseInt(spann, 10) - 1;
            const updtdcolum: string = colum.toString();
            (args.row as HTMLElement).querySelectorAll('.e-editcell')[0].setAttribute('colSpan', updtdcolum);
        }
        const focusElement: Row<Object>[] | HTMLCollectionOf<HTMLTableRowElement> = this.parent.grid.contentModule.getRows();
        for (let i: number = 0; i < focusElement.length; i++) {
            (focusElement[i].cells[0] as Cell<Column> ).visible = false;
        }
        const focusModule: FocusStrategy = getObject('focusModule', this.parent.grid);
        const matrix: string = 'refreshMatrix';
        focusModule[matrix](true)({ rows: this.parent.grid.contentModule.getRows() });
    }
    /**
     * Destroys the DetailModule.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
