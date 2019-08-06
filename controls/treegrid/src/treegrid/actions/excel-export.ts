import { TreeGrid } from '../base/treegrid';
import { ITreeData } from '../base/interface';
import { getObject, Grid, ExcelExport as GridExcel, ExcelExportProperties, BeforeDataBoundArgs } from '@syncfusion/ej2-grids';
import { ExcelStyle, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { isRemoteData, isOffline } from '../utils';
import { isNullOrUndefined, setValue, Ajax, extend } from '@syncfusion/ej2-base';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import * as event from '../base/constant';
/**
 * TreeGrid Excel Export module
 * @hidden
 */
export class ExcelExport {
    private parent: TreeGrid;
    private dataResults: ReturnOption;
    /**
     * Constructor for Excel Export module
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridExcel);
        this.parent = parent;
        this.dataResults = <ReturnOption>{};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
      return 'ExcelExport';
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on('updateResults', this.updateExcelResultModel, this);
        this.parent.on('excelCellInfo', this.excelQueryCellInfo, this);
      }
      /**
       * To destroy the Excel Export
       * @return {void}
       * @hidden
       */
       public destroy(): void {
         this.removeEventListener();
       }
      /**
       * @hidden
       */
      public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('updateResults', this.updateExcelResultModel);
        this.parent.off('excelCellInfo', this.excelQueryCellInfo);
      }
      private updateExcelResultModel(returnResult: { result: ITreeData[], count: number }): void {
        this.dataResults = <ReturnOption>returnResult;
      }
    public Map(
        excelExportProperties?: ExcelExportProperties,
        /* tslint:disable-next-line:no-any */
        isMultipleExport?: boolean, workbook?: any, isBlob?: boolean, isCsv?: boolean) : Promise<Object> {
        let dataSource: Object = this.parent.dataSource;
        let property: Object = Object();
        setValue('isCsv', isCsv, property);
        setValue('cancel', false, property);
        return new Promise((resolve: Function, reject: Function) => {
          let dm: DataManager = this.isLocal() ? new DataManager(dataSource) : <DataManager>this.parent.dataSource;
          let query: Query = new Query();
          if (!this.isLocal()) {
            query = this.generateQuery(query);
            setValue('query', query, property);
          }
          this.parent.trigger(event.beforeExcelExport, extend(property, excelExportProperties));
          if (getObject('cancel', property)) {
              return null;
          }
          dm.executeQuery(query).then((e: Object) => {
            excelExportProperties = this.manipulateExportProperties(excelExportProperties, dataSource, <Ajax>e);
            return this.parent.grid.excelExportModule.Map(
              this.parent.grid, excelExportProperties, isMultipleExport, workbook, isCsv, isBlob).then((book: Object) => {
                resolve(book);
              });
          });
        });
    }
    protected generateQuery(query: Query, property?: ExcelExportProperties) : Query {
        if (!isNullOrUndefined(property) && property.exportType === 'CurrentPage'
        && this.parent.allowPaging) {
            property.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    protected manipulateExportProperties(property?: ExcelExportProperties, dtSrc?: Object, queryResult?: Ajax) : Object {
        //count not required for this query
        let args: BeforeDataBoundArgs = Object();
        setValue('query',  this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport',  true, args);
        if (!isNullOrUndefined(property) && !isNullOrUndefined(property.exportType)) {
          setValue('exportType',  property.exportType, args);
        }
        if (!this.isLocal() || !isNullOrUndefined(this.parent.parentIdMapping)) {
          this.parent.parentData = [];
          this.parent.dataModule.convertToFlatData(getObject('result', queryResult));
          setValue('expresults',  this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = <BeforeDataBoundArgs>this.dataResults;
        dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
        if (!this.isLocal()) {
          this.parent.flatData = [];
        }
        if (property.dataSource) {
          this.parent.dataModule.convertToFlatData(property.dataSource);
          dtSrc = this.parent.flatData;
        }
        property = isNullOrUndefined(property) ? Object() : property;
        property.dataSource = new DataManager({json: <Object[]>dtSrc});
        return property;
    }
      /**
       * TreeGrid Excel Export cell modifier
       * @hidden
       */
      private excelQueryCellInfo(args?: ExcelQueryCellInfoEventArgs) : void {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let style: ExcelStyle = {};
            let data: ITreeData = <ITreeData>args.data;
            let ispadfilter: boolean = isNullOrUndefined(data.filterLevel);
            let pad: number = ispadfilter ? data.level : data.filterLevel;
            style.indent = pad;
            args.style = style;
          }
        this.parent.notify('updateResults', args);
        this.parent.trigger('excelQueryCellInfo', args);
      }
      private isLocal(): Boolean {
        return !isRemoteData(this.parent) && isOffline(this.parent);
      }
}