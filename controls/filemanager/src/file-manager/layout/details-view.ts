import { Grid, Resize, ContextMenu, Sort, VirtualScroll, RowSelectEventArgs, RowDeselectEventArgs, Column } from '@syncfusion/ej2-grids';
import { select, KeyboardEvents, EventHandler, KeyboardEventArgs, getValue, selectAll, isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, Touch, TapEventArgs, setValue, addClass, removeClass } from '@syncfusion/ej2-base';
import { Internationalization, closest } from '@syncfusion/ej2-base';
import { FileManager } from '../base/file-manager';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { ReadArgs, SearchArgs, IFileManager, FileDetails, NotifyArgs } from '../base/interface';
import { FileSelectEventArgs, FileBeforeLoadEventArgs } from '../base/interface';
import { FileOpenEventArgs } from '../base/interface';
import { createDialog, createImageDialog } from '../pop-up/dialog';
import { treeNodes } from '../common/utility';
import { removeBlur, openAction, getImageUrl, fileType, getSortedData, getLocaleText } from '../common/utility';
import { createEmptyElement } from '../common/utility';
import { read, Download } from '../common/operations';
import { cutFiles, addBlur, openSearchFolder } from '../common/index';
import { ROWCELL } from '../../index';
import { RecordDoubleClickEventArgs, RowDataBoundEventArgs, SortEventArgs, HeaderCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { BeforeDataBoundArgs, ColumnModel, SortDescriptorModel } from '@syncfusion/ej2-grids';
Grid.Inject(Resize, ContextMenu, Sort, VirtualScroll);

/**
 * GridView module
 */
export class DetailsView {

    /* Internal variables */
    public element: HTMLElement;
    private parent: FileManager;
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private selectedItem: boolean;
    private sortItem: boolean;
    private isInteracted: boolean = true;
    private clickObj: Touch;
    private sortSelectedNodes: string[];
    private emptyArgs: ReadArgs | SearchArgs;

    /* public variable */
    public gridObj: Grid;
    public pasteOperation: boolean = false;
    public uploadOperation: boolean = false;
    private count: number = 0;
    private isRendered: boolean = true;

    /**
     * Constructor for the GridView module
     * @hidden
     */
    constructor(parent?: FileManager) {
        this.parent = parent;
        this.element = <HTMLElement>select('#' + this.parent.element.id + CLS.GRID_ID, this.parent.element);
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            tab: 'tab',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftdel: 'shift+delete',
            shiftF10: 'shift+F10',
            f2: 'f2',
            ctrlA: 'ctrl+a',
            enter: 'enter'
        };
    }

    // tslint:disable-next-line
    private render(args: ReadArgs | SearchArgs): void {
        if (this.parent.view === 'Details') {
            removeClass([this.parent.element], CLS.MULTI_SELECT);
            let items: Object[] = getSortedData(this.parent, args.files);
            let columns: ColumnModel[] = this.getColumns();
            let sortSettings: SortDescriptorModel[];
            if (this.parent.isMobile) {
                sortSettings = [];
            } else {
                sortSettings = [{ direction: this.parent.sortOrder, field: this.parent.sortBy }];
            }
            this.gridObj = new Grid({
                dataSource: items,
                allowSorting: true,
                rowSelected: this.onSelected.bind(this),
                rowDeselected: this.onDeSelection.bind(this),
                allowResizing: this.parent.detailsViewSettings.columnResizing,
                selectionSettings: {
                    type: this.parent.allowMultiSelection ? 'Multiple' : 'Single',
                    checkboxMode: 'ResetOnRowClick'
                },
                enableRtl: this.parent.enableRtl,
                pageSettings: { pageSize: 20 },
                sortSettings: { allowUnsort: false, columns: sortSettings },
                columns: columns,
                recordDoubleClick: this.DblClickEvents.bind(this),
                beforeDataBound: this.onBeforeDataBound.bind(this),
                dataBound: this.onDataBound.bind(this),
                rowDataBound: this.onRowDataBound.bind(this),
                actionBegin: this.onActionBegin.bind(this),
                headerCellInfo: this.onHeaderCellInfo.bind(this),
                width: '100%'
            });
            this.gridObj.appendTo('#' + this.parent.element.id + CLS.GRID_ID);
            this.wireEvents();
            this.adjustHeight();
            // tslint:disable-next-line
            (this.gridObj as any).defaultLocale.EmptyRecord = '';
            this.emptyArgs = args;
        }
    }

    private getColumns(): ColumnModel[] {
        let columns: ColumnModel[];
        if (this.parent.isMobile) {
            columns = [
                {
                    field: 'name', headerText: getLocaleText(this.parent, 'Name'), width: 'auto', minWidth: 120, headerTextAlign: 'Left',
                    template: '<div class="e-fe-text">${name}</div><div class="e-fe-date">${dateModified}</div>' +
                        '<span class="e-fe-size">${size}</span>'
                },
            ];
        } else {
            columns = JSON.parse(JSON.stringify(this.parent.detailsViewSettings.columns));
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                columns[i].headerText = getLocaleText(this.parent, columns[i].headerText);
            }
        }
        let iWidth: string = ((this.parent.isMobile || this.parent.isBigger) ? '54' : '46');
        let icon: ColumnModel = {
            field: 'type', width: iWidth, minWidth: iWidth, template: '<span class="e-fe-icon ${iconClass}"></span>',
            allowResizing: false, allowSorting: true, customAttributes: { class: 'e-fe-grid-icon' },
            headerTemplate: '<span class="e-fe-icon e-fe-folder"></span>',
        };
        columns.unshift(icon);
        if (this.parent.allowMultiSelection) {
            let cWidth: string = (this.parent.isBigger ? '36' : '26');
            let cBox: ColumnModel = {
                type: 'checkbox', width: cWidth, minWidth: cWidth, customAttributes: { class: 'e-fe-checkbox' },
                allowResizing: false, allowSorting: false
            };
            if (this.parent.isMobile) {
                columns.push(cBox);
            } else {
                columns.unshift(cBox);
            }
        }
        return columns;
    }

    private adjustHeight(): void {
        if (!this.gridObj) { return; }
        let pane: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.CONTENT_ID, this.parent.element);
        let bar: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID, this.parent.element);
        let gridHeader: HTMLElement = <HTMLElement>select('.' + CLS.GRID_HEADER, this.parent.element);
        let height: number = (pane.offsetHeight - bar.offsetHeight - gridHeader.offsetHeight);
        this.gridObj.height = height;
        this.gridObj.dataBind();
    }

    private renderCheckBox(): void {
        this.gridObj.columns = this.getColumns();
        this.gridObj.refreshColumns();
    }

    private onRowDataBound(args: RowDataBoundEventArgs): void {
        /* istanbul ignore next */
        if (!this.parent.showFileExtension && getValue('isFile', args.data)) {
            let textEle: Element = args.row.querySelector('.e-fe-text');
            let name: string = getValue('name', args.data);
            let type: string = getValue('type', args.data);
            textEle.innerHTML = name.substr(0, name.length - type.length);
        }
        if (getValue('size', args.data) !== undefined && args.row.querySelector('.e-fe-size')) {
            let sizeEle: Element = args.row.querySelector('.e-fe-size');
            let modifiedSize: string;
            if (!getValue('isFile', args.data)) {
                modifiedSize = '';
            } else {
                let sizeValue: number = getValue('size', args.data);
                if ((sizeValue / 1024) === 0) {
                    modifiedSize = '0 KB';
                } else {
                    let intl: Internationalization = new Internationalization();
                    let value: string = intl.formatNumber((sizeValue / 1024), { format: 'n' });
                    modifiedSize = value + ' KB';
                }
            }
            sizeEle.innerHTML = modifiedSize;
        }
        if (this.parent.isMobile) {
            if (getValue('dateModified', args.data) !== undefined && args.row.querySelector('.e-fe-date')) {
                let dateEle: Element = args.row.querySelector('.e-fe-date');
                let intl: Internationalization = new Internationalization();
                let columns: ColumnModel[] = this.parent.detailsViewSettings.columns;
                let format: Object;
                for (let i: number = 0; i < columns.length; i++) {
                    if (columns[i].field === 'dateModified') {
                        format = columns[i].format;
                        break;
                    }
                }
                let formattedString: string = intl.formatDate(new Date(getValue('dateModified', args.data)), format);
                dateEle.innerHTML = formattedString;
            }
        }
        let checkWrap: Element = args.row.querySelector('.' + CLS.CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
        let eventArgs: FileBeforeLoadEventArgs = {
            element: args.row as HTMLElement,
            fileDetails: args.data,
            module: 'DetailsView'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    }

    private onActionBegin(args: SortEventArgs): void {
        if (args.requestType === 'sorting') {
            this.parent.sortOrder = args.direction;
            this.parent.sortBy = args.columnName;
            if (this.parent.selectedItems.length !== 0) {
                this.sortItem = true;
                let rows: number[] = this.gridObj.getSelectedRowIndexes();
                let len: number = rows.length;
                this.sortSelectedNodes = [];
                while (len > 0) {
                    let data: Object = this.gridObj.getRowsObject()[rows[len - 1]].data;
                    this.sortSelectedNodes.push(getValue('name', data));
                    len--;
                }
            }
            this.parent.notify(events.sortByChange, {});
        }
    }

    private onHeaderCellInfo(args: HeaderCellInfoEventArgs): void {
        let checkWrap: Element = args.node.querySelector('.' + CLS.CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
    }

    private onBeforeDataBound(args: BeforeDataBoundArgs): void {
        let items: Object[] = getSortedData(this.parent, this.gridObj.dataSource as Object[]);
        args.result = items;
    }

    private maintainBlur(): void {
        let length: number = 0;
        let records: Object[] = this.gridObj.getCurrentViewRecords();
        for (length; length < records.length; length++) {
            let nodeEle: Element = this.gridObj.getDataRows()[length];
            let name: string = nodeEle.querySelector('.' + CLS.TEMPLATE_CELL).textContent;
            if (this.parent.selectedNodes.indexOf(name) !== -1) {
                let node: HTMLElement[] = selectAll('.' + CLS.ROWCELL, nodeEle);
                let nodeLength: number = 0;
                while (nodeLength < node.length) {
                    addBlur(node[nodeLength]);
                    nodeLength++;
                }
            }
        }
    }
    /* istanbul ignore next */
    private onDataBound(args: Object): void {
        if (this.parent.selectedItems.length !== 0) {
            this.selectedItem = true;
        }
        if (this.pasteOperation === true || this.selectedItem === true) {
            let selectedNodes: string[] = (this.selectedItem !== true) ? this.parent.selectedNodes : this.parent.selectedItems;
            this.selectRecords(selectedNodes);
            this.pasteOperation = ((this.selectedItem !== true)) ? false : this.pasteOperation;
            this.selectedItem = false;
        }
        if (this.parent.cutNodes && this.parent.cutNodes.length !== 0) {
            this.maintainBlur();
        }
        if (this.parent.createdItem) {
            this.selectRecords([getValue('name', this.parent.createdItem)]);
            this.parent.createdItem = null;
        }
        if (this.parent.renamedItem) {
            this.selectRecords([getValue('name', this.parent.renamedItem)]);
            this.parent.renamedItem = null;
        }
        if (this.sortItem === true) {
            this.selectRecords(this.sortSelectedNodes);
            this.sortItem = false;
        }
        if (this.parent.allowMultiSelection && this.parent.singleSelection !== undefined) {
            this.selectRecords([this.parent.singleSelection]);
        }
        if (!this.parent.allowMultiSelection && this.parent.singleSelection !== undefined) {
            this.selectRecords([this.parent.singleSelection]);
        }
        if (this.uploadOperation === true) {
            this.count++;
            this.selectRecords(this.parent.uploadItem);
            if (this.count === this.parent.uploadItem.length) {
                this.uploadOperation = false;
                this.parent.uploadItem = [];
            }
        }
        if (this.gridObj.currentViewData.length * this.gridObj.getRowHeight() < this.gridObj.height) {
            let hdTable: HTMLElement = <HTMLElement>this.gridObj.getHeaderContent();
            hdTable.style.paddingRight = '';
            hdTable.style.paddingLeft = '';
            let hdContent: HTMLElement = <HTMLElement>select('.e-headercontent', hdTable);
            hdContent.style.borderRightWidth = '0';
            let cnTable: HTMLElement = <HTMLElement>this.gridObj.getContent().querySelector('.e-content');
            cnTable.style.overflowY = '';
            cnTable.classList.add('e-scrollShow');
        } else {
            let hdTable: HTMLElement = <HTMLElement>this.gridObj.getHeaderContent();
            if (!this.parent.enableRtl) {
                hdTable.style.paddingRight = '16px';
            } else {
                hdTable.style.paddingLeft = '16px';
            }
            let cnTable: Element = this.gridObj.getContent().querySelector('.e-content');
            cnTable.classList.remove('e-scrollShow');
        }
        this.isRendered = true;
        this.checkEmptyDiv(this.emptyArgs);
    }

    private selectRecords(nodes: string[]): void {
        let gridRecords: { [key: string]: Object; }[] = <{ [key: string]: Object; }[]>this.gridObj.getCurrentViewRecords();
        let sRecords: number[] = [];
        for (let i: number = 0, len: number = gridRecords.length; i < len; i++) {
            if (nodes.indexOf(getValue('name', gridRecords[i])) !== -1) {
                sRecords.push(i);
            }
        }
        if (sRecords.length !== 0) {
            this.gridObj.selectRows(sRecords);
        }
    }

    private onSortColumn(args: Object): void {
        this.gridObj.sortModule.sortColumn(this.parent.sortBy, this.parent.sortOrder);
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'height':
                    this.adjustHeight();
                    break;
                case 'detailsViewSettings':
                    if (!isNullOrUndefined(this.gridObj)) {
                        let columns: ColumnModel[] = this.getColumns();
                        this.gridObj.columns = columns;
                        this.gridObj.allowResizing = this.parent.detailsViewSettings.columnResizing;
                        this.gridObj.dataBind();
                        this.gridObj.refreshColumns();
                    }
                    break;
                case 'selectedItems':
                    if (this.parent.selectedItems.length !== 0) {
                        this.selectRecords(this.parent.selectedItems);
                    } else if (!isNOU(this.gridObj)) {
                        this.gridObj.clearSelection();
                    }
                    break;
                case 'enableRtl':
                    if (!isNullOrUndefined(this.gridObj)) {
                        this.gridObj.enableRtl = e.newProp.enableRtl;
                        this.gridObj.dataBind();
                    }
                    break;
                case 'showFileExtension':
                    read(this.parent, events.pathChanged, this.parent.path);
                    break;
                case 'showHiddenItems':
                    read(this.parent, events.pathChanged, this.parent.path);
                    break;
                case 'allowMultiSelection':
                    if (!isNullOrUndefined(this.gridObj)) {
                        this.gridObj.selectionSettings.type = e.newProp.allowMultiSelection ? 'Multiple' : 'Single';
                        this.renderCheckBox();
                    }
                    break;
                case 'view':
                    read(this.parent, events.layoutChange, this.parent.path);
                    break;
            }
        }
    }
    private onPathChanged(args: ReadArgs): void {
        if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() === '' && this.gridObj) {
            this.parent.searchedItems = [];
            let len: number = this.gridObj.columns.length;
            // tslint:disable-next-line
            let column: any = JSON.parse(JSON.stringify(this.gridObj.columns));
            if (column[len - 1].field) {
                if (column[len - 1].field === 'filterPath') {
                    this.gridObj.columns.pop();
                    this.gridObj.refreshColumns();
                }
            }
        }
        removeBlur(this.parent as IFileManager);
        if (!this.parent.persistData) {
            this.parent.setProperties({ selectedItems: [] }, true);
        }
        if (this.parent.view === 'Details') {
            /* istanbul ignore next */
            if (!this.parent.persistData) {
                this.parent.setProperties({ selectedItems: [] }, true);
            } else {
                this.isInteracted = false;
            }
            this.parent.persistData = false;
            this.parent.cutNodes = [];
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
            this.parent.notify(events.searchTextChange, args);
        }
        this.emptyArgs = args;
    }

    private checkEmptyDiv(args: ReadArgs | SearchArgs): void {
        let items: Object[] = getSortedData(this.parent, args.files);
        if (items.length === 0 && !isNOU(this.element.querySelector('.' + CLS.GRID_VIEW))) {
            createEmptyElement(this.parent, getValue('name', args), this.element);
        } else if (items.length !== 0 && this.element.querySelector('.' + CLS.EMPTY)) {
            if (this.element.querySelector('.' + CLS.GRID_VIEW).querySelector('.' + CLS.EMPTY)) {
                let emptyDiv: Element = this.element.querySelector('.' + CLS.GRID_VIEW).querySelector('.' + CLS.EMPTY);
                this.element.querySelector('.' + CLS.GRID_VIEW).removeChild(emptyDiv);
            } else {
                this.element.removeChild(this.element.querySelector('.' + CLS.EMPTY));
            }
        }
    }

    private onOpenInit(args: ReadArgs | SearchArgs): void {
        if (this.parent.activeModule === 'detailsview') {
            let data: Object = this.gridObj.getSelectedRecords()[0];
            this.openContent(data);
        }
    }

    /**
     * Triggers when double click on the grid record
     * @public
     */
    public DblClickEvents(args: RecordDoubleClickEventArgs): void {
        this.gridObj.selectRows([args.rowIndex]);
        let data: Object;
        if (args.rowData) {
            data = JSON.parse(JSON.stringify(args.rowData));
            this.openContent(data);
        }
    }

    public openContent(data: Object): void {
        let eventArgs: FileOpenEventArgs = { cancel: false, fileDetails: data };
        this.parent.trigger('beforeFileOpen', eventArgs);
        if (eventArgs.cancel) { return; }
        if (getValue('isFile', data)) {
            let icon: string = fileType(data);
            if (icon === CLS.ICON_IMAGE) {
                let name: string = getValue('name', data);
                let imgUrl: string = getImageUrl(this.parent, data);
                createImageDialog(this.parent, name, imgUrl);
            }
        } else {
            let val: string = this.parent.breadcrumbbarModule.searchObj.element.value;
            if (val === '') {
                let newPath: string = this.parent.path + getValue('name', data) + '/';
                this.parent.setProperties({ path: newPath }, true);
                this.parent.pathId.push(getValue('nodeId', data));
                this.parent.itemData = [data];
                openAction(this.parent);
            } else {
                openSearchFolder(this.parent, data);
            }
        }
    }

    /* istanbul ignore next */
    private onLayoutChange(args: ReadArgs): void {
        if (this.parent.view === 'Details') {
            if (!this.gridObj) {
                this.render(args);
            }
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
            this.parent.notify(events.hideLayout, {});
            this.gridObj.element.classList.remove(CLS.DISPLAY_NONE);
            this.isInteracted = false;
            this.gridObj.clearSelection();
            if (this.parent.selectedItems) {
                this.selectedItem = true;
            }
            if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() !== '') {
                this.onSearchFiles(args);
            }
            this.adjustHeight();
        }
    }

    /* istanbul ignore next */
    private onSearchFiles(args: SearchArgs | ReadArgs): void {
        if (this.parent.view === 'Details') {
            let len: number = this.gridObj.columns.length;
            // tslint:disable-next-line
            let column: any = JSON.parse(JSON.stringify(this.gridObj.columns));
            if (column[len - 1].field) {
                if (column[len - 1].field === 'filterPath') {
                    this.gridObj.columns.pop();
                }
            }
            let item: Object = { field: 'filterPath', headerText: 'path', minWidth: 180 };
            if (!this.parent.isMobile) {
                (this.gridObj.columns as Column[]).push(item as Column);
            }
            this.gridObj.refreshColumns();
            this.parent.searchedItems = args.files;
            this.onPathChanged(<ReadArgs>args);
        }
    }

    private changeData(args: ReadArgs): void {
        this.isInteracted = false;
        this.gridObj.dataSource = getSortedData(this.parent, args.files);
        if (this.parent.selectedItems) {
            this.selectedItem = true;
        }
    }

    private onFinalizeEnd(args: ReadArgs): void {
        if (this.parent.view !== 'Details') { return; }
        if (!this.gridObj) {
            this.render(args);
            this.parent.notify(events.searchTextChange, args);
        } else {
            this.onPathChanged(args);
        }
    }

    private onCreateEnd(args: ReadArgs): void {
        if (this.parent.view !== 'Details') { return; }
        this.onPathChanged(args);
    }

    private onRenameInit(): void {
        if (this.parent.view === 'Details' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }

    /* istanbul ignore next */
    private onDeleteEnd(args: ReadArgs): void {
        if (this.parent.view !== 'Details') { return; }
        this.onPathChanged(args);
        this.parent.setProperties({ selectedItems: [] }, true);
    }

    private onRefreshEnd(args: ReadArgs): void {
        if (this.parent.view !== 'Details') { return; }
        this.changeData(args);
    }

    private onHideLayout(args: ReadArgs): void {
        if (this.parent.view !== 'Details' && this.gridObj) {
            this.gridObj.element.classList.add(CLS.DISPLAY_NONE);
        }
    }

    private onSelectAllInit(): void {
        if (this.parent.view === 'Details') {
            this.isInteracted = false;
            this.gridObj.selectionModule.selectRowsByRange(0, this.gridObj.getRows().length);
            this.isInteracted = true;
        }
    }

    private onClearAllInit(): void {
        if (this.parent.view === 'Details') {
            this.removeSelection();
        }
    }

    /* istanbul ignore next */
    private onSelectionChanged(): void {
        removeClass([this.element], CLS.HEADER_CHECK);
        if (this.parent.selectedItems.length > 0) {
            addClass([this.element], CLS.HEADER_CHECK);
        }
    }

    private onBeforeRequest(): void {
        this.isRendered = false;
    }

    private onAfterRequest(args: Object): void {
        this.isRendered = true;
    }

    private addEventListener(): void {
        this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.layoutChange, this.onLayoutChange, this);
        this.parent.on(events.pathChanged, this.onPathChanged, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
        this.parent.on(events.search, this.onSearchFiles, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.renameInit, this.onRenameInit, this);
        this.parent.on(events.renameEnd, this.onPathChanged, this);
        this.parent.on(events.openInit, this.onOpenInit, this);
        this.parent.on(events.sortColumn, this.onSortColumn, this);
        this.parent.on(events.openEnd, this.onPathChanged, this);
        this.parent.on(events.hideLayout, this.onHideLayout, this);
        this.parent.on(events.selectAllInit, this.onSelectAllInit, this);
        this.parent.on(events.clearAllInit, this.onClearAllInit, this);
        this.parent.on(events.pathColumn, this.onPathColumn, this);
        this.parent.on(events.selectionChanged, this.onSelectionChanged, this);
        this.parent.on(events.beforeRequest, this.onBeforeRequest, this);
        this.parent.on(events.afterRequest, this.onAfterRequest, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.layoutChange, this.onLayoutChange);
        this.parent.off(events.pathChanged, this.onPathChanged);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.refreshEnd, this.onRefreshEnd);
        this.parent.off(events.search, this.onSearchFiles);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.renameInit, this.onRenameInit);
        this.parent.off(events.renameEnd, this.onPathChanged);
        this.parent.off(events.openInit, this.onOpenInit);
        this.parent.off(events.sortColumn, this.onSortColumn);
        this.parent.off(events.openEnd, this.onPathChanged);
        this.parent.off(events.hideLayout, this.onHideLayout);
        this.parent.off(events.selectAllInit, this.onSelectAllInit);
        this.parent.off(events.clearAllInit, this.onClearAllInit);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
        this.parent.off(events.pathColumn, this.onPathColumn);
        this.parent.off(events.selectionChanged, this.onSelectionChanged);
        this.parent.off(events.beforeRequest, this.onBeforeRequest);
        this.parent.off(events.afterRequest, this.onAfterRequest);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'detailsview';
    }

    /**
     * Destroys the GridView module.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (this.gridObj) {
            this.unWireEvents();
            this.gridObj.destroy();
        }
    }

    /**
     * Grid row selected event
     * @private
     */
    /* istanbul ignore next */
    private onSelected(args: RowSelectEventArgs): void {
        this.parent.activeElements = this.gridObj.element.querySelectorAll('.' + CLS.ACTIVE);
        this.parent.activeModule = 'detailsview';
        this.selectedRecords();
        this.parent.notify(events.selectionChanged, {});
        this.triggerSelect('select', args);
        if (this.parent.allowMultiSelection) {
            let rows: number[] = this.gridObj.getSelectedRowIndexes();
            let len: number = rows.length;
            if (len > 1) {
                let data: Object = this.gridObj.getRowsObject()[rows[len - 1]].data;
                this.parent.currentItemText = getValue('name', data);
            }
        }
        if (this.parent.selectedItems.length === 1) {
            let data: Object = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
            this.parent.currentItemText = getValue('name', data);
        }
        let indexes: number[] = getValue('rowIndexes', args);
        let multiSelect: boolean = getValue('enableSelectMultiTouch', this.gridObj.selectionModule);
        if (this.parent.isDevice && isNOU(indexes) && args.target && !multiSelect && !args.target.closest('.e-headercell')) {
            this.parent.isFile = getValue('isFile', args.data);
            if (!this.parent.isFile) {
                this.openContent(args.data);
            }
        }
        this.parent.visitedItem = args.row;
    }
    /* istanbul ignore next */
    private onPathColumn(args: object): void {
        if (this.parent.view === 'Details') {
            let len: number = this.gridObj.columns.length;
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '') {
                // tslint:disable-next-line
                let column: any = JSON.parse(JSON.stringify(this.gridObj.columns));
                if (column[len - 1].field) {
                    if (column[len - 1].field === 'filterPath') {
                        this.gridObj.columns.pop();
                        this.gridObj.refreshColumns();
                    }
                }

            }
        }
    }

    private selectedRecords(): void {
        this.parent.setProperties({ selectedItems: [] }, true);
        let selectedRecords: Object[] = this.gridSelectNodes();
        let selectSize: number = 0;
        while (selectSize < selectedRecords.length) {
            let record: FileDetails = <FileDetails>selectedRecords[selectSize];
            this.parent.selectedItems.push(record.name);
            selectSize++;
        }
    }

    /**
     * Grid row de-selected event
     * @private
     */
    private onDeSelection(args: RowDeselectEventArgs): void {
        if (!this.isInteracted) {
            this.isInteracted = true;
            return;
        }
        if (this.parent.activeElements[0].querySelector('.' + CLS.ROWCELL)) {
            this.selectedRecords();
            this.parent.activeElements = this.gridObj.element.querySelectorAll('.' + CLS.ACTIVE);
        }
        let data: Object[] = args.data as Object[];
        for (let i: number = 0, len: number = data.length; i < len; i++) {
            let index: number = this.parent.selectedItems.indexOf(getValue('name', data[i]));
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
            }
        }
        if (this.parent.selectedItems.length === 0) {
            setValue('enableSelectMultiTouch', false, this.gridObj.selectionModule);
            removeClass([this.parent.element], CLS.MULTI_SELECT);
        }
        this.parent.notify(events.selectionChanged, {});
        this.triggerSelect('unselect', args);
        this.parent.visitedItem = null;
    }

    private triggerSelect(action?: string, args?: RowSelectEventArgs): void {
        let eventArgs: FileSelectEventArgs = { action: action, fileDetails: args.data };
        this.parent.trigger('fileSelect', eventArgs);
    }
    private wireEvents(): void {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(
            this.gridObj.element,
            {
                keyAction: this.keyDown.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keyup',
            }
        );
        EventHandler.add(this.gridObj.element, 'focus', this.removeSelection, this);
    }

    private unWireEvents(): void {
        this.wireClickEvent(false);
        this.keyboardModule.destroy();
        EventHandler.remove(this.gridObj.element, 'focus', this.removeSelection);
    }

    private wireClickEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: DetailsView = this;
            let ele: HTMLElement = <HTMLElement>this.gridObj.getContent();
            this.clickObj = new Touch(ele, {
                tapHold: (e: TapEventArgs) => {
                    if (proxy.parent.isDevice) {
                        e.originalEvent.preventDefault();
                        if (proxy.parent.allowMultiSelection) {
                            setValue('enableSelectMultiTouch', proxy.parent.allowMultiSelection, proxy.gridObj.selectionModule);
                            addClass([proxy.parent.element], CLS.MULTI_SELECT);
                        }
                        let target: Element = <Element>e.originalEvent.target;
                        if (target) {
                            let row: Element = closest(target, '.' + CLS.ROW);
                            let index: number = proxy.gridObj.getRows().indexOf(row);
                            proxy.gridObj.selectRow(index);
                        }
                    }
                }
            });
        } else {
            if (this.clickObj) {
                this.clickObj.destroy();
            }
        }
    }

    /* istanbul ignore next */
    private removeSelection(): void {
        removeClass([this.parent.element], CLS.MULTI_SELECT);
        this.gridObj.clearSelection();
        this.parent.setProperties({ selectedItems: [] }, true);
        this.parent.notify(events.selectionChanged, {});
    }

    /**
     * Grid keyDown event
     * @private
     */
    /* istanbul ignore next */
    private keyDown(e: KeyboardEventArgs): void {
        if (!this.isRendered) { return; }
        e.preventDefault();
        let action: string = e.action;
        switch (action) {
            case 'altEnter':
                this.parent.getDetails();
                break;
            case 'esc':
                removeBlur(this.parent as IFileManager);
                this.parent.selectedNodes = [];
                if (this.parent.navigationpaneModule) { this.parent.navigationpaneModule.treeNodes = []; }
                break;
            case 'del':
            case 'shiftdel':
                if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
                    createDialog(this.parent, 'Delete');
                }
                break;
            case 'enter':
                if (this.gridObj.selectedRowIndex === -1) { break; }
                let rowData: object = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
                if (rowData) {
                    let data: object = JSON.parse(JSON.stringify(rowData));
                    this.openContent(data);
                }
                break;
            case 'ctrlC':
                removeBlur(this.parent as IFileManager);
                this.parent.navigationpaneModule.treeNodes = [];
                this.parent.navigationpaneModule.copyNodes = [];
                this.parent.cutNodes = [];
                this.parent.selectedNodes = [];
                this.parent.targetPath = this.parent.path;
                treeNodes(this.parent.navigationpaneModule, this.gridSelectNodes(), 'copy');
                this.parent.fileAction = 'CopyTo';
                this.parent.enablePaste = true;
                this.parent.notify(events.showPaste, {});
                this.parent.fileOperation(this.gridSelectNodes());
                break;
            case 'ctrlV':
                this.parent.pasteHandler();
                break;
            case 'ctrlX':
                cutFiles(this.parent as IFileManager);
                this.parent.fileOperation(this.parent.nodeNames);
                break;
            case 'shiftF10':
                Download(this.parent, this.gridSelectNodes());
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 1) {
                    this.updateRenameData();
                    createDialog(this.parent, 'Rename');
                }
                break;
            case 'ctrlA':
                let data: Object[] = [this.gridObj.getSelectedRecords()[0]];
                this.parent.currentItemText = getValue('name', data[0]);
                break;
            case 'tab':
                let selectedItems: object[] = getSortedData(this.parent, this.gridObj.dataSource as Object[]);
                this.parent.selectedItems = [getValue('name', selectedItems[0])];
                this.selectRecords([getValue('name', selectedItems[0])]);
                break;
        }
    }

    /**
     * Get selected grid records
     * @public
     */
    public gridSelectNodes(): Object[] {
        return this.gridObj.getSelectedRecords();
    }

    private updateRenameData(): void {
        let data: Object = this.gridSelectNodes()[0];
        this.parent.itemData = [data];
        this.parent.currentItemText = getValue('name', data);
        this.parent.isFile = getValue('isFile', data);
    }
}