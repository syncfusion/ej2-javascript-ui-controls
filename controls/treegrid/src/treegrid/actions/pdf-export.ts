import { TreeGrid } from '../base/treegrid';
import { ITreeData } from '../base/interface';
import { getObject, PdfExport as GridPdf, Grid, BeforeDataBoundArgs, PdfExportProperties} from '@syncfusion/ej2-grids';
import { PdfQueryCellInfoEventArgs, PdfStyle } from '@syncfusion/ej2-grids';
import { isRemoteData, isOffline } from '../utils';
import { isNullOrUndefined, setValue, Ajax, extend, getValue } from '@syncfusion/ej2-base';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import * as event from '../base/constant';
import { PdfDocument } from '@syncfusion/ej2-pdf-export';
/**
 * TreeGrid PDF Export module
 * @hidden
 */
export class PdfExport {
    private parent: TreeGrid;
    private dataResults: ReturnOption;
    /**
     * Constructor for PDF export module
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridPdf);
        this.parent = parent;
        this.dataResults = <ReturnOption>{};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
      return 'PdfExport';
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on('pdfCellInfo', this.pdfQueryCellInfo, this);
        this.parent.on('updateResults', this.updatePdfResultModel, this);
      }
      /**
       * @hidden
       */
      public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('pdfCellInfo', this.pdfQueryCellInfo);
        this.parent.off('updateResults', this.updatePdfResultModel);
      }
     /**
      * To destroy the PDF Export
      * @return {void}
      * @hidden
      */
      public destroy(): void {
        this.removeEventListener();
      }
      private updatePdfResultModel(returnResult: { result: ITreeData[], count: number }): void {
        this.dataResults = <ReturnOption>returnResult;
      }
    public Map(
        pdfExportProperties?: PdfExportProperties,
        /* tslint:disable-next-line:no-any */
        isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean) : Promise<Object> {
        let dtSrc: Object = this.parent.dataSource;
        let prop: Object = Object();
        let isLocal: Boolean = !isRemoteData(this.parent) && isOffline(this.parent);
        setValue('cancel', false, prop);
        return new Promise((resolve: Function, reject: Function) => {
          let dm: DataManager = isLocal ? new DataManager(dtSrc) : <DataManager>this.parent.dataSource;
          let query: Query = new Query();
          if (!isLocal) {
            query = this.generateQuery(query);
            setValue('query', query, prop);
          }
          this.parent.trigger(event.beforePdfExport, extend(prop, pdfExportProperties));
          if (getObject('cancel', prop)) {
              return null;
          }
          dm.executeQuery(query).then((e: Object) => {
            pdfExportProperties = this.manipulatePdfProperties(pdfExportProperties, dtSrc, <Ajax>e);
            return this.parent.grid.pdfExportModule.Map(
              this.parent.grid, pdfExportProperties, isMultipleExport, pdfDoc, isBlob).then((document: PdfDocument) => {
                resolve(document);
              });
          });
        });
    }
    protected generateQuery(query: Query, prop?: PdfExportProperties) : Query {
        if (!isNullOrUndefined(prop) && prop.exportType === 'CurrentPage'
        && this.parent.allowPaging) {
            prop.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    protected manipulatePdfProperties(prop?: PdfExportProperties, dtSrc?: Object, queryResult?: Ajax) : Object {
        let args: Object = {};
        //count not required for this query  
        let isLocal: Boolean = !isRemoteData(this.parent) && isOffline(this.parent);
        setValue('query',  this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport',  true, args);
        if (!isNullOrUndefined(prop) && !isNullOrUndefined(prop.exportType)) {
          setValue('exportType',  prop.exportType, args);
        }
        if (!isLocal || !isNullOrUndefined(this.parent.parentIdMapping)) {
          this.parent.parentData = [];
          this.parent.dataModule.convertToFlatData(getValue('result', queryResult));
          setValue('expresults',  this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = <BeforeDataBoundArgs>this.dataResults;
        dtSrc = isNullOrUndefined((<BeforeDataBoundArgs>args).result) ? this.parent.flatData.slice(0) : (<BeforeDataBoundArgs>args).result;
        if (!isLocal) {
          this.parent.flatData = [];
        }
        if (prop.dataSource) {
          this.parent.dataModule.convertToFlatData(prop.dataSource);
          dtSrc = this.parent.flatData;
        }
        prop = isNullOrUndefined(prop) ? {} : prop;
        prop.dataSource = new DataManager({json: <Object[]>dtSrc});
        return prop;
      }
      /**
       * TreeGrid PDF Export cell modifier
       * @hidden
       */
      private pdfQueryCellInfo(args?: PdfQueryCellInfoEventArgs) : void {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let style: PdfStyle = {};
            let data: ITreeData = <ITreeData>getObject('data', args);
            let ispadfilter: boolean = isNullOrUndefined(data.filterLevel);
            let pad: number = ispadfilter ? data.level : data.filterLevel;
            style.paragraphIndent = pad * 3;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('pdfQueryCellInfo', args);
      }
}