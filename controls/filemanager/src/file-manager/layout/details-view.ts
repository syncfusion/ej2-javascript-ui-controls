import { Grid, Resize, ContextMenu, Sort, VirtualScroll, RowSelectEventArgs, RowDeselectEventArgs, Column } from '@syncfusion/ej2-grids';
import { select, KeyboardEvents, EventHandler, KeyboardEventArgs, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, Touch, TapEventArgs, setValue, addClass, removeClass } from '@syncfusion/ej2-base';
import { Internationalization, closest, DragEventArgs, Draggable, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { FileManager } from '../base/file-manager';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { ReadArgs, SearchArgs, FileDetails, NotifyArgs } from '../base/interface';
import { FileSelectEventArgs, FileLoadEventArgs, FileSelectionEventArgs } from '../base/interface';
import { FileOpenEventArgs } from '../base/interface';
import { createDialog, createImageDialog } from '../pop-up/dialog';
import { removeBlur, openAction, getImageUrl, fileType, getSortedData, getLocaleText, updateLayout } from '../common/utility';
import { createEmptyElement } from '../common/utility';
import { read, Download, GetDetails, Delete } from '../common/operations';
import { cutFiles, addBlur, openSearchFolder, copyFiles, removeActive, pasteHandler, getPathObject, getName } from '../common/index';
import { hasReadAccess, hasEditAccess, hasDownloadAccess, doRename, getAccessClass, createDeniedDialog, rename } from '../common/index';
import { createVirtualDragElement, dragStopHandler, dragStartHandler, draggingHandler, getModule, getFullPath } from '../common/index';
import { getDirectoryPath, updateRenamingData, getItemName, doDeleteFiles, doDownloadFiles } from '../common/index';
import { RecordDoubleClickEventArgs, RowDataBoundEventArgs, SortEventArgs, HeaderCellInfoEventArgs, RowSelectingEventArgs } from '@syncfusion/ej2-grids';
import { BeforeDataBoundArgs, ColumnModel, SortDescriptorModel, BeforeCopyEventArgs } from '@syncfusion/ej2-grids';

/**
 * DetailsView module
 */
export class DetailsView {

    /* Internal variables */
    public element: HTMLElement;
    private parent: FileManager;
    private keyboardModule: KeyboardEvents;
    private keyboardDownModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private sortItem: boolean;
    private isInteracted: boolean = true;
    private interaction: boolean = true;
    private isPasteOperation: boolean = false;
    private isColumnRefresh: boolean = false;
    private clickObj: Touch;
    private sortSelectedNodes: string[];
    private emptyArgs: ReadArgs | SearchArgs;
    private dragObj: Draggable = null;
    private startIndex: number = null;
    private firstItemIndex: number = null;
    private isSelectionUpdate: boolean = false;
    private currentSelectedItem: string[] = [];
    private count: number = 0;
    private isRendered: boolean = true;
    private isLoaded: boolean = false;

    /* public variable */
    public gridObj: Grid;
    public pasteOperation: boolean = false;
    public uploadOperation: boolean = false;

    /**
     * Constructor for the GridView module
     * @hidden
     */
    constructor(parent?: FileManager) {
        Grid.Inject(Resize, ContextMenu, Sort, VirtualScroll);
        this.parent = parent;
        this.element = <HTMLElement>select('#' + this.parent.element.id + CLS.GRID_ID, this.parent.element);
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            tab: 'tab',
            moveDown: 'downarrow',
            ctrlEnd: 'ctrl+end',
            ctrlHome: 'ctrl+home',
            ctrlDown: 'ctrl+downarrow',
            ctrlLeft: 'ctrl+leftarrow',
            ctrlRight: 'ctrl+rightarrow',
            shiftEnd: 'shift+end',
            shiftHome: 'shift+home',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            ctrlUp: 'ctrl+uparrow',
            csEnd: 'ctrl+shift+end',
            csHome: 'ctrl+shift+home',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            space: 'space',
            ctrlSpace: 'ctrl+space',
            shiftSpace: 'shift+space',
            csSpace: 'ctrl+shift+space',
            end: 'end',
            home: 'home',
            moveUp: 'uparrow',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftdel: 'shift+delete',
            ctrlD: 'ctrl+d',
            f2: 'f2',
            ctrlA: 'ctrl+a',
            enter: 'enter'
        };
    }

    // tslint:disable-next-line
    /* istanbul ignore next */
    private render(args: ReadArgs | SearchArgs): void {
        showSpinner(this.parent.element);
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
                rowSelecting: this.onSelection.bind(this, 'select'),
                rowDeselecting: this.onSelection.bind(this, 'unselect'),
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
                width: '100%',
                beforeCopy: (args: BeforeCopyEventArgs) => { args.cancel = true; },
                load: function (args: Object): void {
                    this.focusModule.destroy();
                }
            });
            this.gridObj.isStringTemplate = true;
            this.gridObj.appendTo('#' + this.parent.element.id + CLS.GRID_ID);
            this.wireEvents();
            this.adjustHeight();
            this.emptyArgs = args;
        }
    }

    private adjustWidth(columns: ColumnModel[], fieldName: string): void {
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[i].field === fieldName) {
                let nameWidth: string;
                if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                    nameWidth = (this.element.clientWidth <= 500) ? '120px' : 'auto';
                } else {
                    nameWidth = (this.element.clientWidth <= 680) ? ((fieldName === 'name') ? '120px' : '180px') : 'auto';
                }
                columns[i].width = nameWidth;
            }
        }
    }

    private getColumns(): ColumnModel[] {
        let columns: ColumnModel[];
        if (this.parent.isMobile) {
            columns = [
                {
                    field: 'name', headerText: getLocaleText(this.parent, 'Name'), width: 'auto', minWidth: 120, headerTextAlign: 'Left',
                    template: '<div class="e-fe-text">${name}</div><div class="e-fe-date">${_fm_modified}</div>' +
                        '<span class="e-fe-size">${size}</span>'
                },
            ];
        } else {
            columns = JSON.parse(JSON.stringify(this.parent.detailsViewSettings.columns));
            this.adjustWidth(columns, 'name');
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                columns[i].headerText = getLocaleText(this.parent, columns[i].headerText);
            }
        }
        let iWidth: string = ((this.parent.isMobile || this.parent.isBigger) ? '54' : '46');
        let icon: ColumnModel = {
            field: 'type', width: iWidth, minWidth: iWidth, template: '<span class="e-fe-icon ${_fm_iconClass}"></span>',
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
        this.isColumnRefresh = true;
        this.gridObj.refreshColumns();
    }

    private onRowDataBound(args: RowDataBoundEventArgs): void {
        let td: Element = select('.e-fe-grid-name', args.row);
        if (!td) {
            let columns: ColumnModel[] = this.parent.detailsViewSettings.columns;
            for (let i: number = 0; i < columns.length; i++) {
                if (columns[i].field === 'name') {
                    td = args.row.children[this.parent.allowMultiSelection ? (i + 2) : (i + 1)];
                    break;
                }
            }
        }
        if (td) {
            td.setAttribute('title', getValue('name', args.data));
        }
        if (this.parent.isLayoutChange && this.parent.isCut && this.parent.fileAction === 'move' &&
            this.parent.selectedNodes && this.parent.selectedNodes.length !== 0) {
            if (this.parent.selectedNodes.indexOf(getValue('name', args.data)) !== -1) {
                addBlur(args.row);
            }
        }
        if (!this.parent.showFileExtension && getValue('isFile', args.data)) {
            let textEle: Element = args.row.querySelector('.e-fe-text');
            if (textEle) {
                let name: string = getValue('name', args.data);
                let type: string = getValue('type', args.data);
                textEle.innerHTML = name.substr(0, name.length - type.length);
            }
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
            if (getValue('_fm_modified', args.data) !== undefined && args.row.querySelector('.e-fe-date')) {
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
                let formattedString: string = intl.formatDate(new Date(getValue('_fm_modified', args.data)), format);
                dateEle.innerHTML = formattedString;
            }
        }
        let checkWrap: Element = args.row.querySelector('.' + CLS.CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
        if (!hasEditAccess(args.data)) {
            args.row.className += ' ' + getAccessClass(args.data);
        }
        let eventArgs: FileLoadEventArgs = {
            element: args.row as HTMLElement,
            fileDetails: args.data,
            module: 'DetailsView'
        };
        this.parent.trigger('fileLoad', eventArgs);
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
                    this.sortSelectedNodes.push(getValue(this.parent.hasId ? 'id' : 'name', data));
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
        showSpinner(this.parent.element);
        let items: Object[] = getSortedData(this.parent, this.gridObj.dataSource as Object[]);
        args.result = items;
    }
    /* istanbul ignore next */
    private onDataBound(): void {
        this.createDragObj();
        if (this.parent.selectedItems.length !== 0) {
            this.selectRecords(this.parent.selectedItems);
        }
        if (this.isPasteOperation === true) {
            if (!this.isColumnRefresh) {
                this.selectRecords(this.parent.pasteNodes);
                this.isPasteOperation = false;
            } else {
                this.isColumnRefresh = false;
            }
        }
        if (this.parent.createdItem) {
            this.selectRecords([getValue(this.parent.hasId ? 'id' : 'name', this.parent.createdItem)]);
            this.parent.createdItem = null;
        }
        if (this.parent.layoutSelectedItems.length) {
            this.selectRecords(this.parent.layoutSelectedItems);
        }
        if (this.parent.renamedItem) {
            this.addSelection(this.parent.renamedItem);
            this.parent.renamedItem = null;
        }
        if (this.sortItem === true) {
            this.selectRecords(this.sortSelectedNodes);
            this.sortItem = false;
        }
        if (this.isSelectionUpdate) {
            if (!this.isColumnRefresh) {
                this.selectRecords(this.currentSelectedItem);
                this.isSelectionUpdate = false;
            } else {
                this.isColumnRefresh = false;
            }
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
        this.parent.isLayoutChange = false;
        hideSpinner(this.parent.element);
        this.checkEmptyDiv(this.emptyArgs);
        this.isInteracted = this.isLoaded ? true : this.isInteracted;
        this.isLoaded = false;
    }

    private selectRecords(nodes: string[]): void {
        let gridRecords: Object[] = this.gridObj.getCurrentViewRecords();
        let sRecords: number[] = [];
        for (let i: number = 0, len: number = gridRecords.length; i < len; i++) {
            let node: string = this.parent.hasId ? getValue('id', gridRecords[i]) : getName(this.parent, gridRecords[i]);
            if (nodes.indexOf(node) !== -1) {
                sRecords.push(i);
            }
        }
        if (sRecords.length !== 0) {
            this.gridObj.selectRows(sRecords);
            this.addFocus(this.gridObj.selectedRowIndex);
        }
    }

    private addSelection(data: Object): void {
        let items: Object[] = this.gridObj.getCurrentViewRecords();
        let rData: Object[] = [];
        if (this.parent.hasId) {
            rData = new DataManager(items).
                executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
        } else {
            let nData: Object[] = new DataManager(items).
                executeLocal(new Query().where('name', 'equal', getValue('name', data), false));
            if (nData.length > 0) {
                rData = new DataManager(nData).
                    executeLocal(new Query().where('filterPath', 'equal', this.parent.filterPath, false));
            }
        }
        if (rData.length > 0) {
            let index: number = items.indexOf(rData[0]);
            this.gridObj.selectRows([index]);
        }
    }

    private onSortColumn(): void {
        this.gridObj.sortModule.sortColumn(this.parent.sortBy, this.parent.sortOrder);
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.createDragObj();
                    break;
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
                    this.interaction = false;
                    if (this.parent.selectedItems.length !== 0) {
                        if (!this.parent.allowMultiSelection) {
                            let slItems: string[] = this.parent.selectedItems.slice(this.parent.selectedItems.length - 1);
                            this.parent.setProperties({ selectedItems: slItems }, true);
                        }
                        this.selectRecords(this.parent.selectedItems);
                    } else if (!isNOU(this.gridObj)) {
                        this.gridObj.clearSelection();
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
                        this.currentSelectedItem = this.parent.selectedItems;
                        this.gridObj.selectionSettings.type = e.newProp.allowMultiSelection ? 'Multiple' : 'Single';
                        this.isSelectionUpdate = true;
                        this.renderCheckBox();
                    }
                    break;
                case 'view':
                    updateLayout(this.parent, 'Details');
                    break;
                case 'width':
                    this.onDetailsResize();
            }
        }
    }
    private onPathChanged(args: ReadArgs): void {
        this.parent.isCut = false;
        if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() === '' && this.gridObj) {
            this.parent.searchedItems = [];
            if (!this.parent.isFiltered) {
                this.removePathColumn(false);
            } else {
                this.updatePathColumn();
            }
        }
        removeBlur(this.parent);
        if (this.parent.view === 'Details') {
            /* istanbul ignore next */
            this.isInteracted = false;
            showSpinner(this.parent.element);
            this.parent.setProperties({ selectedItems: [] }, true);
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
        }
        this.emptyArgs = args;
    }

    private updatePathColumn(): void {
        let len: number = this.gridObj.columns.length;
        let columnData: ColumnModel[] = JSON.parse(JSON.stringify(this.gridObj.columns));
        if (columnData[len - 1].field && columnData[len - 1].field !== 'filterPath' && !this.parent.isMobile) {
            let pathColumn: ColumnModel = {
                field: 'filterPath', headerText: getLocaleText(this.parent, 'Path'), minWidth: 180, width: 'auto'
            };
            (<ColumnModel[]>this.gridObj.columns).push(pathColumn);
            this.adjustWidth((<Column[]>this.gridObj.columns), 'filterPath');
            this.adjustWidth((<Column[]>this.gridObj.columns), 'name');
            this.isColumnRefresh = true;
            this.gridObj.refreshColumns();
        }
    }

    private checkEmptyDiv(args: ReadArgs | SearchArgs): void {
        let items: Object[] = getSortedData(this.parent, args.files);
        if (items.length === 0 && !isNOU(this.element.querySelector('.' + CLS.GRID_VIEW))) {
            createEmptyElement(this.parent, this.element, args);
        } else if (items.length !== 0 && this.element.querySelector('.' + CLS.EMPTY)) {
            if (this.element.querySelector('.' + CLS.GRID_VIEW).querySelector('.' + CLS.EMPTY)) {
                let emptyDiv: Element = this.element.querySelector('.' + CLS.GRID_VIEW).querySelector('.' + CLS.EMPTY);
                this.element.querySelector('.' + CLS.GRID_VIEW).removeChild(emptyDiv);
            } else {
                this.element.removeChild(this.element.querySelector('.' + CLS.EMPTY));
            }
        }
    }

    private onOpenInit(): void {
        if (this.parent.activeModule === 'detailsview') {
            let data: Object = this.gridObj.getSelectedRecords()[0];
            this.openContent(data);
        }
    }

    public DblClickEvents(args: RecordDoubleClickEventArgs): void {
        this.gridObj.selectRows([args.rowIndex]);
        let data: Object;
        if (args.rowData) {
            data = JSON.parse(JSON.stringify(args.rowData));
            this.openContent(data);
        }
    }

    public openContent(data: Object): void {
        if (!hasReadAccess(data)) {
            createDeniedDialog(this.parent, data, events.permissionRead);
            return;
        }
        let eventArgs: FileOpenEventArgs = { cancel: false, fileDetails: data, module: 'DetailsView' };
        this.parent.trigger('fileOpen', eventArgs, (fileOpenArgs: FileOpenEventArgs) => {
            if (!fileOpenArgs.cancel) {
                let name: string = getValue('name', data);
                if (getValue('isFile', data)) {
                    let icon: string = fileType(data);
                    if (icon === CLS.ICON_IMAGE) {
                        let imgUrl: string = getImageUrl(this.parent, data);
                        createImageDialog(this.parent, name, imgUrl);
                    }
                } else {
                    let val: string = this.parent.breadcrumbbarModule.searchObj.element.value;
                    if (val === '' && !this.parent.isFiltered) {
                        let id: string = getValue('id', data);
                        let newPath: string = this.parent.path + (isNOU(id) ? name : id) + '/';
                        this.parent.setProperties({ path: newPath }, true);
                        this.parent.pathNames.push(name);
                        this.parent.pathId.push(getValue('_fm_id', data));
                        this.parent.itemData = [data];
                        openAction(this.parent);
                    } else {
                        openSearchFolder(this.parent, data);
                    }
                    this.parent.isFiltered = false;
                }
                this.element.focus();
            }
        });
    }

    /* istanbul ignore next */
    private onLayoutChange(args: ReadArgs): void {
        if (this.parent.view === 'Details') {
            if (!this.gridObj) {
                this.render(args);
            } else {
                this.isLoaded = true;
            }
            if (this.parent.isFiltered) {
                this.updatePathColumn();
                this.parent.setProperties({ selectedItems: [] }, true);
            }
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
            this.parent.notify(events.hideLayout, {});
            this.gridObj.element.classList.remove(CLS.DISPLAY_NONE);
            this.isInteracted = false;
            this.gridObj.clearSelection();
            if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() !== '') {
                this.onSearchFiles(args);
            }
            this.adjustHeight();
            if (this.gridObj.sortSettings.columns[0].field !== this.parent.sortBy) {
                this.gridObj.sortColumn(this.parent.sortBy, this.parent.sortOrder);
            }
        }
    }

    /* istanbul ignore next */
    private onSearchFiles(args: SearchArgs | ReadArgs): void {
        if (this.parent.view === 'Details') {
            this.parent.setProperties({ selectedItems: [] }, true);
            this.parent.notify(events.selectionChanged, {});
            if (!this.parent.isLayoutChange) {
                this.parent.layoutSelectedItems = [];
            }
            this.updatePathColumn();
            this.parent.searchedItems = args.files;
            this.onPathChanged(<ReadArgs>args);
        }
    }

    private removePathColumn(isRefresh: boolean): void {
        let len: number = this.gridObj.columns.length;
        let columnData: ColumnModel[] = JSON.parse(JSON.stringify(this.gridObj.columns));
        if (columnData[len - 1].field && (columnData[len - 1].field === 'filterPath')) {
            /* istanbul ignore next */
            if (this.gridObj.sortSettings.columns[0].field === 'filterPath') {
                this.gridObj.sortColumn('name', this.parent.sortOrder);
                this.parent.notify(events.sortByChange, {});
            }
            this.gridObj.columns.pop();
            if (!isRefresh) {
                this.isColumnRefresh = true;
                this.gridObj.refreshColumns();
            }
        }
    }

    private onFinalizeEnd(args: ReadArgs): void {
        if (this.parent.view !== 'Details') { return; }
        if (!this.gridObj) {
            this.render(args);
        } else {
            this.onPathChanged(args);
        }
    }

    private onCreateEnd(args: ReadArgs): void {
        if (this.parent.view !== 'Details') { return; }
        this.onPathChanged(args);
    }

    private onRenameInit(): void {
        if (this.parent.activeModule === 'detailsview' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }

    private onSelectedData(): void {
        if (this.parent.activeModule === 'detailsview') {
            this.parent.itemData = this.gridObj.getSelectedRecords();
        }
    }

    private onDeleteInit(): void {
        if (this.parent.activeModule === 'detailsview') {
            Delete(this.parent, this.parent.selectedItems, this.parent.path, 'delete');
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
        this.isInteracted = false;
        this.removePathColumn(true);
        this.gridObj.dataSource = getSortedData(this.parent, args.files);
        this.emptyArgs = args;
    }

    private onHideLayout(): void {
        if (this.parent.view !== 'Details' && this.gridObj) {
            this.gridObj.element.classList.add(CLS.DISPLAY_NONE);
        }
    }

    private onSelectAllInit(): void {
        if (this.parent.view === 'Details') {
            this.isInteracted = false;
            if (this.parent.allowMultiSelection) {
                this.gridObj.selectionModule.selectRowsByRange(0, this.gridObj.getRows().length);
            } else {
                this.gridObj.selectRow(this.gridObj.getRows().length - 1);
            }
            this.isInteracted = true;
            this.interaction = true;
        }
    }

    private onClearAllInit(): void {
        if (this.parent.view === 'Details') {
            this.removeSelection();
            this.interaction = true;
        }
    }

    /* istanbul ignore next */
    private onSelectionChanged(): void {
        removeClass([this.element], CLS.HEADER_CHECK);
        if (this.parent.selectedItems.length > 0) {
            addClass([this.element], CLS.HEADER_CHECK);
        }
    }

    private onLayoutRefresh(): void {
        if (this.parent.view !== 'Details') { return; }
        this.adjustHeight();
    }

    private onBeforeRequest(): void {
        this.isRendered = false;
    }

    private onAfterRequest(): void {
        this.isRendered = true;
    }

    private onUpdateSelectionData(): void {
        if (this.parent.view !== 'Details') { return; }
        this.parent.itemData = this.gridObj.getSelectedRecords();
    }

    private addEventListener(): void {
        this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.layoutChange, this.onLayoutChange, this);
        this.parent.on(events.pathChanged, this.onPathChanged, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.dropInit, this.onDropInit, this);
        this.parent.on(events.detailsInit, this.onDetailsInit, this);
        this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
        this.parent.on(events.search, this.onSearchFiles, this);
        this.parent.on(events.methodCall, this.onMethodCall, this);
        this.parent.on(events.actionFailure, this.onActionFailure, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.deleteInit, this.onDeleteInit, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.selectedData, this.onSelectedData, this);
        this.parent.on(events.renameInit, this.onRenameInit, this);
        this.parent.on(events.renameEnd, this.onPathChanged, this);
        this.parent.on(events.openInit, this.onOpenInit, this);
        this.parent.on(events.sortColumn, this.onSortColumn, this);
        this.parent.on(events.openEnd, this.onPathChanged, this);
        this.parent.on(events.filterEnd, this.onPathChanged, this);
        this.parent.on(events.pasteInit, this.onPasteInit, this);
        this.parent.on(events.hideLayout, this.onHideLayout, this);
        this.parent.on(events.selectAllInit, this.onSelectAllInit, this);
        this.parent.on(events.clearAllInit, this.onClearAllInit, this);
        this.parent.on(events.pathColumn, this.onPathColumn, this);
        this.parent.on(events.selectionChanged, this.onSelectionChanged, this);
        this.parent.on(events.beforeRequest, this.onBeforeRequest, this);
        this.parent.on(events.afterRequest, this.onAfterRequest, this);
        this.parent.on(events.pasteEnd, this.onpasteEnd, this);
        this.parent.on(events.cutCopyInit, this.oncutCopyInit, this);
        this.parent.on(events.menuItemData, this.onMenuItemData, this);
        this.parent.on(events.resizeEnd, this.onDetailsResize, this);
        this.parent.on(events.splitterResize, this.onDetailsResize, this);
        this.parent.on(events.layoutRefresh, this.onLayoutRefresh, this);
        this.parent.on(events.dropPath, this.onDropPath, this);
        this.parent.on(events.updateSelectionData, this.onUpdateSelectionData, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.layoutChange, this.onLayoutChange);
        this.parent.off(events.pathChanged, this.onPathChanged);
        this.parent.off(events.pasteInit, this.onPasteInit);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.refreshEnd, this.onRefreshEnd);
        this.parent.off(events.search, this.onSearchFiles);
        this.parent.off(events.methodCall, this.onMethodCall);
        this.parent.off(events.actionFailure, this.onActionFailure);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.renameInit, this.onRenameInit);
        this.parent.off(events.renameEnd, this.onPathChanged);
        this.parent.off(events.filterEnd, this.onPathChanged);
        this.parent.off(events.openInit, this.onOpenInit);
        this.parent.off(events.sortColumn, this.onSortColumn);
        this.parent.off(events.openEnd, this.onPathChanged);
        this.parent.off(events.hideLayout, this.onHideLayout);
        this.parent.off(events.selectAllInit, this.onSelectAllInit);
        this.parent.off(events.clearAllInit, this.onClearAllInit);
        this.parent.off(events.deleteInit, this.onDeleteInit);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
        this.parent.off(events.pathColumn, this.onPathColumn);
        this.parent.off(events.selectionChanged, this.onSelectionChanged);
        this.parent.off(events.beforeRequest, this.onBeforeRequest);
        this.parent.off(events.afterRequest, this.onAfterRequest);
        this.parent.off(events.pasteEnd, this.onpasteEnd);
        this.parent.off(events.cutCopyInit, this.oncutCopyInit);
        this.parent.off(events.dropInit, this.onDropInit);
        this.parent.off(events.selectedData, this.onSelectedData);
        this.parent.off(events.detailsInit, this.onDetailsInit);
        this.parent.off(events.menuItemData, this.onMenuItemData);
        this.parent.off(events.resizeEnd, this.onDetailsResize);
        this.parent.off(events.splitterResize, this.onDetailsResize);
        this.parent.off(events.layoutRefresh, this.onLayoutRefresh);
        this.parent.off(events.dropPath, this.onDropPath);
        this.parent.off(events.updateSelectionData, this.onUpdateSelectionData);
    }

    private onActionFailure(): void { this.interaction = true; }

    private onMenuItemData(args: { [key: string]: Object; }): void {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.itemData = [this.gridObj.getRowInfo(<Element>args.target).rowData];
        }
    }

    private onPasteInit(): void {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.itemData = (this.parent.folderPath !== '') ? this.gridObj.getSelectedRecords() :
                [getPathObject(this.parent)];
        }
    }

    private onDetailsInit(): void {
        if (this.parent.activeModule === this.getModuleName()) {
            if (this.parent.selectedItems.length !== 0) {
                this.parent.itemData = this.gridObj.getSelectedRecords();
            } else {
                this.parent.itemData = [getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
            }
        }
    }

    public dragHelper(args: { element: HTMLElement, sender: MouseEvent & TouchEvent }): HTMLElement {
        let dragTarget: Element = <Element>args.sender.target;
        let dragLi: Element = dragTarget.closest('tr.e-row');
        if (!dragLi) { return null; }
        let name: string = (<HTMLElement>dragLi.getElementsByClassName('e-fe-text')[0]).innerText;
        if (dragLi && !dragLi.querySelector('.e-active')) {
            this.selectRecords([name]);
        }
        getModule(this.parent, dragLi);
        this.parent.activeElements = [];
        this.parent.dragData = [];
        this.parent.dragData = <{ [key: string]: Object; }[]>this.gridObj.getSelectedRecords();
        this.parent.dragPath = this.parent.path;
        this.parent.activeElements = this.gridObj.getSelectedRows();
        createVirtualDragElement(this.parent);
        return this.parent.virtualDragElement;
    }

    /* istanbul ignore next */
    private onDetailsResize(): void {
        if (this.parent.view === 'Details' && !this.parent.isMobile && !isNOU(this.gridObj)) {
            let gridHeader: HTMLElement = <HTMLElement>this.gridObj.getHeaderContent().querySelector('.e-headercontent');
            let gridHeaderColGroup: HTMLElement = <HTMLElement>gridHeader.firstChild.childNodes[0];
            let gridContentColGroup: HTMLElement =
                <HTMLElement>this.gridObj.getContent().querySelector('.e-content .e-table').children[0];
            let gridHeaderColNames: ColumnModel[] = this.gridObj.getColumns();
            for (let i: number = 0; i < gridHeaderColNames.length; i++) {
                if (gridHeaderColNames[i].field === 'name' || gridHeaderColNames[i].field === 'filterPath') {
                    if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                        if (this.element.clientWidth <= 500) {
                            gridHeaderColGroup.children[i].setAttribute('style', 'width: 120px');
                            gridContentColGroup.children[i].setAttribute('style', 'width: 120px');
                        } else if (this.element.clientWidth > 500) {
                            gridHeaderColGroup.children[i].setAttribute('style', 'width: auto');
                            gridContentColGroup.children[i].setAttribute('style', 'width: auto');
                        }
                    } else {
                        if (this.element.clientWidth <= 680) {
                            if (gridHeaderColNames[i].field === 'name') {
                                gridHeaderColGroup.children[i].setAttribute('style', 'width: 120px');
                                gridContentColGroup.children[i].setAttribute('style', 'width: 120px');
                            } else {
                                gridHeaderColGroup.children[i].setAttribute('style', 'width: 180px');
                                gridContentColGroup.children[i].setAttribute('style', 'width: 180px');
                            }
                        } else if (this.element.clientWidth > 680) {
                            gridHeaderColGroup.children[i].setAttribute('style', 'width: auto');
                            gridContentColGroup.children[i].setAttribute('style', 'width: auto');
                        }
                    }
                }
            }
        }
    }

    private createDragObj(): void {
        if (!this.parent.isMobile && this.gridObj) {
            if (this.parent.allowDragAndDrop) {
                if (this.dragObj) { this.dragObj.destroy(); }
                this.dragObj = new Draggable(this.gridObj.element, {
                    cursorAt: this.parent.dragCursorPosition,
                    enableTailMode: true,
                    dragArea: this.parent.element,
                    dragTarget: '.' + CLS.ROW,
                    drag: draggingHandler.bind(this, this.parent),
                    dragStart: (args: DragEventArgs & BlazorDragEventArgs) => {
                        dragStartHandler(this.parent, args, this.dragObj);
                    },
                    dragStop: dragStopHandler.bind(this, this.parent),
                    enableAutoScroll: true,
                    helper: this.dragHelper.bind(this)
                });
            } else if (!this.parent.allowDragAndDrop && this.dragObj) {
                this.dragObj.destroy();
            }
        }
    }

    private onDropInit(args: DragEventArgs): void {
        if (this.parent.targetModule === this.getModuleName()) {
            /* istanbul ignore next */
            let cwdData: Object = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
            if (!args.target.closest('tr')) {
                this.parent.dropPath = this.parent.path;
                this.parent.dropData = cwdData;
            } else {
                let info: { [key: string]: Object; } = null;
                info = <{ [key: string]: Object; }>this.gridObj.getRowInfo(args.target).rowData;
                this.parent.dropPath = info.isFile ? this.parent.path : getFullPath(this.parent, info, this.parent.path);
                this.parent.dropData = info.isFile ? cwdData : info;
            }
        }
    }

    private oncutCopyInit(): void {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.activeRecords = this.gridObj.getSelectedRecords();
            this.parent.activeElements = this.gridObj.getSelectedRows();
        }
    }

    private onpasteEnd(args: ReadArgs): void {
        if (this.parent.view === 'Details') {
            this.isPasteOperation = true;
            if (this.parent.path === this.parent.destinationPath || this.parent.path === getDirectoryPath(this.parent, args)) {
                this.onPathChanged(args);
            }
        }
    }

    private onDropPath(args: ReadArgs): void {
        if (this.parent.view === 'Details') {
            this.isPasteOperation = true;
            this.onPathChanged(args);
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'detailsview';
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (this.gridObj) {
            this.unWireEvents();
            this.gridObj.destroy();
        }
    }

    /* istanbul ignore next */
    private onSelection(action: string, args: RowSelectingEventArgs | RowDeselectEventArgs): void {
        let eventArgs: FileSelectionEventArgs = { action: action, fileDetails: args.data, isInteracted: this.interaction, cancel: false, target: args.target };
        this.parent.trigger('fileSelection', eventArgs);
        args.cancel = eventArgs.cancel;
    }

    /* istanbul ignore next */
    private onSelected(args: RowSelectEventArgs): void {
        this.addFocus(this.gridObj.selectedRowIndex);
        this.parent.activeModule = 'detailsview';
        if (!this.parent.isLayoutChange || this.parent.isFiltered) { this.selectedRecords(); }
        this.parent.notify(events.selectionChanged, {});
        if (this.gridObj.getSelectedRowIndexes().length === 1) {
            this.firstItemIndex = this.gridObj.selectedRowIndex;
        }
        this.gridObj.element.setAttribute('tabindex', '-1');
        this.triggerSelect('select', args);
        let item: Element = this.gridObj.getRowByIndex(this.gridObj.selectedRowIndex);
        if (!isNOU(item) && !isNOU(item.querySelector('.e-checkselect'))) {
            if (this.gridObj.getSelectedRowIndexes().length !== 1) {
                let lastItemIndex: number = this.gridObj.getSelectedRowIndexes()[this.gridObj.getSelectedRowIndexes().length - 2];
                let lastItem: Element = this.gridObj.getRowByIndex(lastItemIndex);
                lastItem.querySelector('.e-checkselect').setAttribute('tabindex', '-1');
            }
            item.querySelector('.e-rowcell.e-fe-checkbox').removeAttribute('tabindex');
        }
        if (!isNOU(this.gridObj) && !isNOU(this.gridObj.element.querySelector('.e-checkselectall'))) {
            this.gridObj.element.querySelector('.e-checkselectall').setAttribute('tabindex', '-1');
        }
        let rows: number[] = this.gridObj.getSelectedRowIndexes();
        if (!this.parent.allowMultiSelection) {
            for (let i: number = 0; i < rows.length; i++) {
                if (rows[i] === this.gridObj.selectedRowIndex) {
                    this.gridObj.getRowByIndex(rows[i]).setAttribute('tabindex', '0');
                } else {
                    this.gridObj.getRowByIndex(rows[i]).removeAttribute('tabindex');
                }
            }
        }
        let len: number = rows.length;
        if (len > 0) {
            let data: Object = this.gridObj.getRowsObject()[rows[len - 1]].data;
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
        if (this.parent.allowMultiSelection && !isNOU(item) && !isNOU(item.querySelector('.e-checkselect'))) {
            let checkItem: HTMLElement = <HTMLElement>item.querySelector('.e-checkselect');
            checkItem.focus();
        }
        if (!this.parent.isLayoutChange) {
            this.isInteracted = true;
        }
    }
    /* istanbul ignore next */
    private onPathColumn(): void {
        if (this.parent.view === 'Details' && !isNOU(this.gridObj)) {
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                this.removePathColumn(false);
            }
        }
    }

    private selectedRecords(): void {
        this.parent.setProperties({ selectedItems: [] }, true);
        let selectedRecords: Object[] = this.gridSelectNodes();
        let selectSize: number = 0;
        while (selectSize < selectedRecords.length) {
            let record: FileDetails = <FileDetails>selectedRecords[selectSize];
            let name: string = getItemName(this.parent, record);
            this.parent.selectedItems.push(name);
            selectSize++;
        }
    }

    private onDeSelection(args: RowDeselectEventArgs): void {
        /* istanbul ignore next */
        if (!this.parent.allowMultiSelection && isNOU(args.data)) {
            this.gridObj.getRowByIndex(args.rowIndex).removeAttribute('tabindex');
        } else if (this.gridObj.getSelectedRowIndexes().length > 1) {
            let lastItemIndex: number = this.gridObj.getSelectedRowIndexes()[this.gridObj.getSelectedRowIndexes().length - 2];
            this.gridObj.getRowByIndex(lastItemIndex).querySelector('.e-checkselect').removeAttribute('tabindex');
        }
        if (this.gridObj.selectedRowIndex === -1) {
            this.gridObj.element.setAttribute('tabindex', '0');
        }
        if (!this.isInteracted) {
            this.isInteracted = true;
            return;
        }
        this.selectedRecords();
        if (this.parent.selectedItems.length === 0) {
            setValue('enableSelectMultiTouch', false, this.gridObj.selectionModule);
            removeClass([this.parent.element], CLS.MULTI_SELECT);
        }
        this.parent.notify(events.selectionChanged, {});
        this.triggerSelect('unselect', args);
        this.parent.visitedItem = null;
    }

    private triggerSelect(action?: string, args?: RowSelectEventArgs): void {
        let eventArgs: FileSelectEventArgs = { action: action, fileDetails: args.data, isInteracted: this.interaction };
        this.parent.trigger('fileSelect', eventArgs);
        this.interaction = true;
    }
    private wireEvents(): void {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(
            this.gridObj.element,
            {
                keyAction: this.keyupHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keyup',
            }
        );
        this.keyboardDownModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keydownHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
        EventHandler.add(this.gridObj.element, 'blur', this.removeFocus, this);
    }

    private unWireEvents(): void {
        this.wireClickEvent(false);
        this.keyboardModule.destroy();
        this.keyboardDownModule.destroy();
        EventHandler.remove(this.gridObj.element, 'blur', this.removeFocus);
    }

    private wireClickEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: DetailsView = this;
            let ele: HTMLElement = <HTMLElement>this.gridObj.getContent();
            this.clickObj = new Touch(ele, {
                tap: (eve: TapEventArgs) => {
                    if (eve.tapCount === 1 && (<HTMLElement>eve.originalEvent.target).classList.contains('e-content')) {
                        proxy.onClearAllInit();
                    }
                },
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
        if (this.gridObj.selectedRowIndex === -1) {
            this.startIndex = null;
        }
        this.isInteracted = true;
    }

    private removeFocus(): void {
        this.addFocus(null);
    }

    private getFocusedItemIndex(): number {
        return (!isNOU(this.getFocusedItem())) ?
            parseInt(this.getFocusedItem().getAttribute('aria-rowindex'), 10) : null;
    }

    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    private keydownHandler(e: KeyboardEventArgs): void {
        if (!this.isRendered) { return; }
        switch (e.action) {
            case 'end':
            case 'home':
            case 'space':
            case 'ctrlSpace':
            case 'shiftSpace':
            case 'csSpace':
            case 'ctrlA':
            case 'enter':
            case 'altEnter':
            case 'ctrlEnd':
            case 'shiftEnd':
            case 'csEnd':
            case 'ctrlHome':
            case 'shiftHome':
            case 'csHome':
            case 'ctrlDown':
            case 'shiftDown':
            case 'csDown':
            case 'ctrlLeft':
            case 'shiftLeft':
            case 'csLeft':
            case 'esc':
            case 'del':
            case 'shiftdel':
            case 'ctrlC':
            case 'ctrlV':
            case 'ctrlX':
            case 'f2':
            case 'moveDown':
            case 'moveUp':
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    private keyupHandler(e: KeyboardEventArgs): void {
        if (!this.isRendered) { return; }
        e.preventDefault();
        let action: string = e.action;
        let gridItems: object[] = getSortedData(this.parent, this.gridObj.dataSource as Object[]);
        let gridLength: number = gridItems.length;
        let focItem: Element = this.getFocusedItem();
        let focIndex: number = this.getFocusedItemIndex();
        let selIndex: number = this.gridObj.selectedRowIndex;
        let selRowIndeces: number[] = this.gridObj.getSelectedRowIndexes();
        switch (action) {
            case 'altEnter':
                GetDetails(this.parent, this.parent.selectedItems, this.parent.path, 'details');
                break;
            case 'esc':
                removeActive(this.parent);
                break;
            case 'del':
            case 'shiftdel':
                this.performDelete();
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
                copyFiles(this.parent);
                break;
            case 'ctrlV':
                this.parent.folderPath = '';
                pasteHandler(this.parent);
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                break;
            case 'ctrlD':
                this.doDownload();
                break;
            case 'f2':
                this.performRename();
                break;
            case 'ctrlA':
                if (!isNOU(gridItems[0]) && this.parent.allowMultiSelection) {
                    this.gridObj.selectionModule.selectRowsByRange(0, gridItems.length - 1);
                }
                break;
            case 'ctrlHome':
            case 'tab':
                if (!isNOU(gridItems[0])) {
                    if (!this.parent.allowMultiSelection && e.action === 'ctrlHome') {
                        this.gridObj.selectRow(0);
                    } else if (this.gridObj.selectedRowIndex !== -1 && e.action === 'tab') {
                        return;
                    } else {
                        this.addFocus(0);
                    }
                }
                break;
            case 'ctrlEnd':
                if (!isNOU(gridItems[0])) {
                    (!this.parent.allowMultiSelection) ?
                        this.gridObj.selectRow(gridLength - 1) : this.addFocus(gridLength - 1);
                }
                break;
            case 'shiftHome':
            case 'shiftEnd':
            case 'csHome':
            case 'csEnd':
                if (!this.parent.allowMultiSelection) {
                    this.gridObj.selectRow((e.action === 'shiftHome' || e.action === 'csHome') ? 0 : gridItems.length - 1);
                } else {
                    if (!isNOU(gridItems[0])) {
                        if (!isNOU(selIndex) && selIndex !== -1) {
                            this.checkRowsKey(gridItems, selIndex, null, e);
                        } else {
                            (e.action === 'csHome' || e.action === 'shiftHome') ?
                                this.gridObj.selectRow(0) : this.gridObj.selectionModule.selectRowsByRange(0, gridItems.length - 1);
                        }
                    }
                }
                break;
            case 'space':
            case 'csSpace':
            case 'shiftSpace':
            case 'ctrlSpace':
                this.spaceSelection(selRowIndeces, focIndex, selIndex, e);
                break;
            case 'csUp':
            case 'csDown':
            case 'shiftUp':
            case 'shiftDown':
                this.shiftMoveMethod(gridItems, selIndex, focIndex, selRowIndeces, e);
                break;
            case 'ctrlUp':
            case 'ctrlDown':
                (!this.parent.allowMultiSelection) ? this.moveFunction(gridItems, e, selIndex) :
                    this.ctrlMoveFunction(gridItems, e, selIndex);
                break;
            case 'home':
                let firstItem: string[] = [getValue(this.parent.hasId ? 'id' : 'name', gridItems[0])];
                this.parent.setProperties({ selectedItems: firstItem }, true);
                this.selectRecords(firstItem);
                break;
            case 'moveUp':
            case 'moveDown':
                this.moveFunction(gridItems, e, selIndex);
                break;
            case 'end':
                let lastItem: string[] = [getValue(this.parent.hasId ? 'id' : 'name', gridItems[gridLength - 1])];
                this.parent.setProperties({ selectedItems: lastItem }, true);
                this.selectRecords(lastItem);
                break;
        }
    }

    public gridSelectNodes(): Object[] {
        return this.gridObj.getSelectedRecords();
    }

    private doDownload(): void {
        if (this.parent.selectedItems.length !== 0) {
            this.parent.itemData = this.gridObj.getSelectedRecords();
            let items: Object[] = this.parent.itemData;
            for (let i: number = 0; i < items.length; i++) {
                if (!hasDownloadAccess(items[i])) {
                    createDeniedDialog(this.parent, items[i], events.permissionDownload);
                    return;
                }
            }
            Download(this.parent, this.parent.path, this.parent.selectedItems);
        }
    }

    private performDelete(): void {
        if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
            this.parent.itemData = this.gridObj.getSelectedRecords();
            let items: Object[] = this.parent.itemData;
            for (let i: number = 0; i < items.length; i++) {
                if (!hasEditAccess(items[i])) {
                    createDeniedDialog(this.parent, items[i], events.permissionEdit);
                    return;
                }
            }
            createDialog(this.parent, 'Delete');
        }
    }

    private performRename(): void {
        if (this.parent.selectedItems.length === 1) {
            this.updateRenameData();
            doRename(this.parent);
        }
    }

    private updateRenameData(): void {
        let data: Object = this.gridSelectNodes()[0];
        updateRenamingData(this.parent, data);
    }

    private shiftMoveMethod(gridItems: object[], selIndex: number, focIndex: number, selRowIndeces: number[], e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.moveFunction(gridItems, e, selIndex);
        } else {
            if (selIndex === -1 && (e.action === 'csUp' || e.action === 'csDown')) {
                this.ctrlMoveFunction(gridItems, e, selIndex);
            } else if (selIndex !== -1 && focIndex !== selIndex &&
                !((e.action === 'csUp' || e.action === 'csDown') && this.isSelected(selRowIndeces, focIndex))) {
                this.shiftSelectFocusItem(selIndex, focIndex, selRowIndeces, e);
            } else {
                this.shiftSelectedItem(selIndex, selRowIndeces, gridItems, e);
            }
        }
    }

    private moveFunction(selectedItems: object[], e: KeyboardEventArgs, rowIndex: number): void {
        if (!isNOU(this.getFocusedItem()) && this.parent.allowMultiSelection) {
            if (e.action === 'moveDown') {
                this.gridObj.selectRow(this.getFocusedItemIndex() + 1);
            } else {
                this.gridObj.selectRow(this.getFocusedItemIndex() - 1);
            }
        } else if (!isNOU(rowIndex) && rowIndex !== -1) {
            if (e.action === 'moveDown' || e.action === 'ctrlDown' || e.action === 'shiftDown' || e.action === 'csDown') {
                this.gridObj.selectRow(rowIndex + ((rowIndex !== selectedItems.length - 1) ? 1 : 0));
            } else {
                this.gridObj.selectRow(rowIndex - ((rowIndex !== 0) ? 1 : 0));
            }
        } else {
            if (!isNOU(selectedItems[0])) {
                this.gridObj.selectRow(0);
            }
        }
    }

    private spaceSelection(selRowIndeces: number[], focIndex: number, selIndex: number, e: KeyboardEventArgs): void {
        if (!this.isSelected(selRowIndeces, focIndex) && selIndex !== -1 && (e.action === 'shiftSpace' || e.action === 'csSpace')) {
            if (focIndex < selIndex) {
                this.gridObj.selectionModule.selectRowsByRange(focIndex, selIndex);
            } else {
                this.gridObj.selectionModule.selectRowsByRange(selIndex, focIndex);
            }
        } else if (!isNOU(this.getFocusedItem()) && focIndex !== selIndex) {
            selRowIndeces.push(this.getFocusedItemIndex());
            this.gridObj.selectRows(selRowIndeces);
        } else if (selIndex !== -1 && e.action === 'ctrlSpace' && this.parent.allowMultiSelection) {
            let lItem: number = selIndex;
            selRowIndeces.pop();
            this.gridObj.selectRows(selRowIndeces);
            this.addFocus(lItem);
        } else if (e.action === 'shiftSpace') {
            this.gridObj.selectRow(selIndex);
        }
    }

    private ctrlMoveFunction(items: object[], e: KeyboardEventArgs, rowIndex: number): void {
        let nextItem: number;
        if (!isNOU(this.getFocusedItem())) {
            let nextIndex: number = this.getFocusedItemIndex();
            nextItem = (e.action === 'ctrlDown' || e.action === 'csDown') ?
                nextIndex + ((nextIndex < items.length - 1) ? 1 : 0) : nextIndex - ((nextIndex < 1) ? 0 : 1);
        } else if (!isNOU(rowIndex) && rowIndex !== -1) {
            nextItem = (e.action === 'ctrlDown' || e.action === 'csDown') ?
                rowIndex + ((rowIndex < items.length) ? 1 : 0) : rowIndex - ((rowIndex < 1) ? 0 : 1);
        } else {
            if (!isNOU(items[0])) {
                nextItem = 0;
            }
        }
        this.addFocus(nextItem);
    }

    private checkRowsKey(items: object[], indexValue: number, focIndex: (null | number), e: KeyboardEventArgs): void {
        if (this.gridObj.checkAllRows === 'Uncheck' || this.gridObj.checkAllRows === 'Intermediate') {
            if (e.action !== 'csHome' && e.action !== 'csEnd') {
                if (isNOU(this.startIndex) && this.firstItemIndex !== indexValue) {
                    this.firstItemIndex = indexValue;
                }
                if (e.action === 'shiftEnd') {
                    this.gridObj.selectionModule.selectRowsByRange(this.firstItemIndex, items.length - 1);
                } else {
                    this.gridObj.selectionModule.selectRowsByRange(0, this.firstItemIndex);
                }
                this.startIndex = indexValue;
            } else {
                if (e.action === 'csEnd') {
                    this.gridObj.
                        selectRows(this.InnerItems(isNOU(indexValue) ? 0 : indexValue, isNOU(focIndex) ? items.length - 1 : focIndex, e));
                } else {
                    ((isNOU(indexValue)) ? this.gridObj.selectRow(0) :
                        this.gridObj.selectRows(this.InnerItems(isNOU(focIndex) ? 0 : focIndex, indexValue, e)));
                }
            }
        } else {
            this.gridObj.selectionModule.selectRow(((e.action === 'shiftHome' || e.action === 'csHome') ? 0 : items.length - 1));
        }
    }

    private InnerItems(fItem: number, lItem: number, e: KeyboardEventArgs): number[] {
        let itemArr: number[] = this.gridObj.getSelectedRowIndexes();
        if (e.action === 'csEnd') {
            for (let i: number = fItem + 1; i <= lItem; i++) {
                itemArr.push(i);
            }
        } else {
            for (let i: number = lItem - 1; fItem <= i; i--) {
                itemArr.push(i);
            }
        }
        return itemArr;
    }

    private shiftSelectFocusItem(selIndex: number, fIndex: number, selRowIndexes: number[], e: KeyboardEventArgs): void {
        let lItem: number;
        let fItem: number;
        lItem = fIndex + ((e.action === 'shiftDown' || e.action === 'csDown') ? 1 : -1);
        fItem = isNOU(this.startIndex) ? selIndex : selRowIndexes[0];
        if (fItem === lItem) {
            this.gridObj.selectRow(fItem);
        } else {
            (fItem < lItem) ?
                ((e.action === 'shiftDown' || e.action === 'csDown') ? this.gridObj.selectionModule.selectRowsByRange(fItem, lItem) :
                    this.gridObj.selectionModule.selectRowsByRange(lItem, fItem)) : ((e.action === 'shiftDown' || e.action === 'csDown') ?
                        this.gridObj.selectionModule.selectRowsByRange(lItem, fItem) :
                        this.gridObj.selectionModule.selectRowsByRange(fItem, lItem));
        }
        this.startIndex = this.gridObj.selectedRowIndex;
    }

    private addFocus(item: number | null): void {
        let fItem: Element = this.getFocusedItem();
        let itemElement: Element = this.gridObj.getRowByIndex(item);
        if (fItem) {
            removeClass([fItem], [CLS.FOCUS, CLS.FOCUSED]);
        }
        if (!isNOU(itemElement)) {
            addClass([itemElement], [CLS.FOCUS, CLS.FOCUSED]);
        }
    }

    private getFocusedItem(): Element {
        return select('.' + CLS.FOCUSED, this.element);
    }

    private isSelected(selRowIndexes: number[], focIndex: number): boolean {
        let check: boolean = false;
        for (let i: number = 0; i <= selRowIndexes.length - 1; i++) {
            if (selRowIndexes[i] === focIndex) {
                check = true;
                break;
            }
        }
        return check;
    }

    private shiftSelectedItem(selIndex: number, selRowIndexes: number[], gridItems: object[], e: KeyboardEventArgs): void {
        if (selIndex === -1) {
            this.gridObj.selectRow(0);
        } else {
            if (isNOU(this.startIndex) && e.shiftKey) {
                this.startIndex = this.gridObj.selectedRowIndex;
                this.gridObj.selectRows([selIndex, (e.action === 'shiftDown' || e.action === 'csDown') ?
                    (selIndex + ((selIndex !== gridItems.length - 1) ? 1 : 0)) : (selIndex - ((selIndex !== 0) ? 1 : 0))]);
            } else {
                if (e.action === 'shiftDown' || e.action === 'shiftUp') {
                    if (e.action === 'shiftDown' && selRowIndexes.indexOf(selIndex + 1) === -1) {
                        if (selIndex !== gridItems.length - 1) { selRowIndexes.push(selIndex + 1); }
                    } else if (e.action === 'shiftUp' && selRowIndexes.indexOf(selIndex - 1) === -1) {
                        if (selIndex !== 0) { selRowIndexes.push(selIndex - 1); }
                    } else {
                        selRowIndexes.pop();
                    }
                    this.gridObj.selectRows(selRowIndexes);
                } else {
                    if (e.action === 'csDown') {
                        if (!this.isSelected(selRowIndexes, this.getFocusedItemIndex() + 1)) {
                            selRowIndexes.push((this.getFocusedItemIndex() + 1));
                            this.gridObj.selectRows(selRowIndexes);
                        } else {
                            this.addFocus(this.getFocusedItemIndex() + 1);
                        }
                    } else if (!this.isSelected(selRowIndexes, this.getFocusedItemIndex() - 1)) {
                        selRowIndexes.push((this.getFocusedItemIndex() - 1));
                        this.gridObj.selectRows(selRowIndexes);
                    } else {
                        this.addFocus(this.getFocusedItemIndex() - 1);
                    }
                }
            }
        }
    }

    private onMethodCall(e: Object): void {
        if (this.parent.view !== 'Details') { return; }
        let action: string = getValue('action', e);
        switch (action) {
            case 'deleteFiles':
                this.deleteFiles(getValue('ids', e));
                break;
            case 'downloadFiles':
                this.downloadFiles(getValue('ids', e));
                break;
            case 'openFile':
                this.openFile(getValue('id', e));
                break;
            case 'createFolder':
                this.interaction = false;
                break;
            case 'renameFile':
                this.interaction = false;
                this.renameFile(getValue('id', e), getValue('newName', e));
                break;
            case 'selectAll':
                this.interaction = false;
                this.onSelectAllInit();
                break;
            case 'clearSelection':
                this.interaction = false;
                this.onClearAllInit();
                break;
        }
    }

    private getRecords(nodes: string[]): Object[] {
        let gridRecords: Object[] = this.gridObj.getCurrentViewRecords();
        let records: Object[] = [];
        let hasFilter: boolean = (this.parent.breadcrumbbarModule.searchObj.element.value !== '' || this.parent.isFiltered) ? true : false;
        let filter: string = this.parent.hasId ? 'id' : 'name';
        if (this.parent.hasId || !hasFilter) {
            for (let i: number = 0, len: number = gridRecords.length; i < len; i++) {
                if (nodes.indexOf(getValue(filter, gridRecords[i])) !== -1) {
                    records.push(gridRecords[i]);
                }
            }
        } else {
            for (let i: number = 0, len: number = gridRecords.length; i < len; i++) {
                let name: string = getValue('filterPath', gridRecords[i]) + getValue('name', gridRecords[i]);
                if (nodes.indexOf(name) !== -1) {
                    records.push(gridRecords[i]);
                }
            }
        }
        return records;
    }

    private deleteFiles(ids: string[]): void {
        this.parent.activeModule = 'detailsview';
        if (isNOU(ids)) {
            this.performDelete();
            return;
        }
        let records: Object[] = this.getRecords(ids);
        if (records.length === 0) { return; }
        let data: Object[] = [];
        let newIds: string[] = [];
        for (let i: number = 0; i < records.length; i++) {
            data[i] = records[i];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDeleteFiles(this.parent, data, newIds);
    }

    private downloadFiles(ids: string[]): void {
        if (isNOU(ids)) {
            this.doDownload();
            return;
        }
        let dRecords: Object[] = this.getRecords(ids);
        if (dRecords.length === 0) { return; }
        let data: Object[] = [];
        let newIds: string[] = [];
        for (let i: number = 0; i < dRecords.length; i++) {
            data[i] = dRecords[i];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDownloadFiles(this.parent, data, newIds);
    }

    private openFile(id: string): void {
        if (isNOU(id)) { return; }
        let records: Object[] = this.getRecords([id]);
        if (records.length > 0) {
            this.openContent(records[0]);
        }
    }

    private renameFile(id: string, name: string): void {
        this.parent.activeModule = 'detailsview';
        if (isNOU(id)) {
            this.performRename();
            return;
        }
        let records: Object[] = this.getRecords([id]);
        if (records.length > 0) {
            updateRenamingData(this.parent, records[0]);
            if (!isNOU(name)) {
                if (hasEditAccess(this.parent.itemData[0])) {
                    rename(this.parent, this.parent.path, name);
                } else {
                    createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionEdit);
                }
            } else {
                doRename(this.parent);
            }
        }
    }
}