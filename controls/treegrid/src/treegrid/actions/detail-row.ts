import { Grid, getObject, Row, DetailDataBoundEventArgs, Cell } from '@syncfusion/ej2-grids';
import { DetailRow as detailrow } from '@syncfusion/ej2-grids';
import { TreeGrid, ITreeData, CellSaveEventArgs } from '../base';
import { isNullOrUndefined, addClass } from '@syncfusion/ej2-base';
import { getExpandStatus, isRemoteData  } from '../utils';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';

/**
 * TreeGrid Detail Row module
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
   * @private
   */
  protected getModuleName(): string {
    return 'detailRow';
  }
  public addEventListener(): void {
    this.parent.on('dataBoundArg', this.dataBoundArg, this);
    this.parent.on('detaildataBound', this.detaildataBound, this);
    this.parent.on('childRowExpand', this.childRowExpand, this);
    this.parent.on('rowExpandCollapse', this.rowExpandCollapse, this);
    this.parent.on('actioncomplete', this.actioncomplete, this);
  }
  /**
   * @hidden
   */
  public removeEventListener(): void {
    if (this.parent.isDestroyed) { return; }
    this.parent.off('dataBoundArg', this.dataBoundArg);
    this.parent.off('detaildataBound', this.detaildataBound);
    this.parent.off('childRowExpand', this.childRowExpand);
    this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
    this.parent.off('actioncomplete', this.actioncomplete);
  }
  private dataBoundArg(): void {
    let detailele: HTMLTableRowElement[] = this.parent.getRows().filter((e: HTMLTableRowElement) => {
      return !e.classList.contains('e-detailrow');
    });
    for (let i: number = 0; i < detailele.length; i++) {
      let elements: object = detailele[i].getElementsByClassName('e-detailrowcollapse');
      let detailData: Row<object> = this.parent.grid.getRowObjectFromUID(detailele[i].getAttribute('data-Uid'));
      let parentItem: object = getObject('parentItem', this.parent.grid.getCurrentViewRecords()[i]);
      if (isNullOrUndefined(parentItem) || !isNullOrUndefined(parentItem) &&
        getExpandStatus(this.parent, detailData.data, this.parent.grid.getCurrentViewRecords())) {
        this.parent.grid.detailRowModule.expand(elements[0]);
      }
    }
  }
   private childRowExpand(args: { row: HTMLTableRowElement }): void {
    let detailRowElement: object = args.row.getElementsByClassName('e-detailrowcollapse');
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
    let data: ITreeData = <ITreeData> args.data;
    let gridClas: string[] = [].slice.call((args.detailElement.parentElement.previousSibling as HTMLElement).classList ).filter(
    (gridclass: string) => (gridclass !== 'e-row' && gridclass !== 'e-altrow'));
    let newNo: number = gridClas[0].length;
    let slicedclas: string = gridClas.toString().slice(6, newNo);
    let detailClass: string = 'e-griddetail' + slicedclas;
    addClass([args.detailElement.parentElement], detailClass);
  };

  private actioncomplete(args: CellSaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      let spann: string = ((args.row as HTMLElement).querySelectorAll('.e-editcell')[0].getAttribute('colSpan'));
      let colum: number = parseInt(spann, 10) - 1;
      let updtdcolum: string = colum.toString();
      (args.row as HTMLElement).querySelectorAll('.e-editcell')[0].setAttribute('colSpan', updtdcolum);
    }
    let focusElement: Row<{}>[] | HTMLCollectionOf<HTMLTableRowElement> = this.parent.grid.contentModule.getRows();
    for (let i: number = 0; i < focusElement.length; i++) {
      (focusElement[i].cells[0] as Cell<{}> ).visible = false;
    }
    let focusModule: FocusStrategy = getObject('focusModule', this.parent.grid);
    let matrix: string = 'refreshMatrix';
    focusModule[matrix](true)({ rows: this.parent.grid.contentModule.getRows() });
  }
  /**
   * Destroys the DetailModule.
   * @method destroy
   * @return {void}
   */
  public destroy(): void {
    this.removeEventListener();
  }
}
