import { Gantt } from './gantt';
import { TreeGrid, ColumnModel } from '@syncfusion/ej2-treegrid';
import { createElement, isNullOrUndefined, getValue, extend, EventHandler, deleteObject, remove, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { FilterEventArgs, SortEventArgs, FailureEventArgs, Grid, ColumnMenuItem, ColumnMenuItemModel, IFilterCreate, IFilterWrite } from '@syncfusion/ej2-grids';
import { setValue} from '@syncfusion/ej2-base';
import { Deferred, Query} from '@syncfusion/ej2-data';
import { TaskFieldsModel } from '../models/models';
import { ColumnModel as GanttColumnModel, Column as GanttColumn } from '../models/column';
import { ITaskData, IGanttData } from './interface';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-treegrid';
import { QueryCellInfoEventArgs, HeaderCellInfoEventArgs, RowDataBoundEventArgs } from '@syncfusion/ej2-grids';
import { ColumnMenuOpenEventArgs, ColumnMenuClickEventArgs } from '@syncfusion/ej2-grids';
import { isCountRequired, isEmptyObject } from './utils';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { ConstraintType } from './enum';
import {CellSaveArgs} from '@syncfusion/ej2-grids';

/** @hidden */

export class GanttTreeGrid {
    private parent: Gantt;
    private treeGridElement: HTMLElement;
    public treeGridColumns: ColumnModel[];
    public isPersist: boolean = false;
    public dropInstance: AutoComplete;
    /**
     * @private
     */
    public currentEditRow: {};
    private registeredTemplate: Object;
    public addedRecord: boolean;
    public setCancelArgs: boolean = false;
    private perviousStartDate: Date ;
    private perviousEndDate: Date ;
    private previousScroll: { top: number, left: number } = { top: 0, left: 0 };
    /** @hidden */
    public prevCurrentView: Object;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.parent.treeGrid = new TreeGrid();
        this.parent.treeGrid.allowSelection = false;
        this.parent.treeGrid.allowKeyboard = this.parent.allowKeyboard;
        this.parent.treeGrid['${enableHtmlSanitizer}'] = this.parent.enableHtmlSanitizer;
        this.parent.treeGrid.enableImmutableMode = this.parent.enableImmutableMode;
        this.parent.treeGrid.enableHover = this.parent.enableHover; // grid rows hover
        this.treeGridColumns = [];
        if (!this.parent.isLocaleChanged && this.parent.isLoad) {
            this.parent.previousGanttColumns = (extend([], [], this.parent.columns, true) as ColumnModel[]);
        }
        this.validateGanttColumns();
        if (this.parent.isLocaleChanged) {
            this.parent.isLocaleChanged = false;
        }
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on('renderPanels', this.createContainer, this);
        this.parent.on('chartScroll', this.updateScrollTop, this);
        this.parent.on('destroy', this.destroy, this);
        this.parent.treeGrid.on('renderReactTemplate', this.renderReactTemplate, this);
        this.parent.treeGrid.grid.on('beforeSetPartialRecords', this.setPartialSelectionForGrid, this);
    }
    private renderReactTemplate(args: Object[]): void {
        const portals: string = 'portals';
        for (const portal of args) {
            if (this.parent[portals as string].indexOf(portal) === -1) {
                this.parent[portals as string].push(portal);
            }
        }
        this.parent.renderTemplates();
    }
    private createContainer(): void {
        //let height: number = this.parent.ganttHeight - this.parent.toolbarModule.element.offsetHeight - 46;
        this.treeGridElement = createElement('div', {
            id: 'treeGrid' + this.parent.element.id, className: 'e-gantt-tree-grid'
            //  styles: 'height:' + height + 'px;'
        });
        const tempHeader: HTMLElement = createElement('div', { className: 'e-gantt-temp-header' });
        this.parent.treeGridPane.appendChild(this.treeGridElement);
        this.treeGridElement.appendChild(tempHeader);
        this.parent.treeGridPane.classList.add('e-temp-content');
    }
    /**
     * Method to initiate TreeGrid
     *
     * @returns {void} .
     */
    public renderTreeGrid(): void {
        this.composeProperties();
        this.bindEvents();
        const root: string = 'root';
        this.parent.treeGrid[root as string] = this.parent[root as string] ? this.parent[root as string] : this.parent;
        setValue('registeredTemplate', this.registeredTemplate, this.parent.treeGrid);
        const ref: string = 'viewContainerRef';
        setValue('viewContainerRef', this.parent[`${ref}`], this.parent.treeGrid);
        if (!this.treeGridElement.contains(this.parent.treeGrid.element)) {
            this.parent.treeGrid.appendTo(this.treeGridElement);
        }
        if (this.parent.treeGrid.grid && this.parent.toolbarModule && (this.parent as Gantt).isReact) {
            (this.parent.treeGrid.grid as Grid).portals = (this.parent as Gantt).portals;
        }
        this.wireEvents();
    }

    private composeProperties(): void {
        this.parent.treeGrid.enableAdaptiveUI = this.parent.enableAdaptiveUI;
        this.parent.treeGrid.hasChildMapping = this.parent.taskFields.hasChildMapping;
        this.parent.treeGrid.query = this.parent.query;
        this.parent.treeGrid.locale = this.parent.locale;
        this.parent.treeGrid.loadChildOnDemand = this.parent.loadChildOnDemand;
        this.parent.treeGrid['isFromGantt'] = true;
        this.parent.treeGrid.parentIdMapping = this.parent.taskFields.parentID;
        if (this.parent.taskFields.parentID) {
            this.parent.treeGrid.idMapping = this.parent.taskFields.id;
        }
        this.parent.treeGrid.showColumnMenu = this.parent.showColumnMenu;
        this.parent.treeGrid.enableCollapseAll = this.parent.collapseAllParentTasks;
        (this.parent.treeGrid.columnMenuItems as (ColumnMenuItemModel | ColumnMenuItem)[]) = this.parent.columnMenuItems;
        this.parent.treeGrid.enableRtl = this.parent.enableRtl;
        this.parent.treeGrid.childMapping = isNullOrUndefined(this.parent.taskFields.child) ? '' : this.parent.taskFields.child;
        this.parent.treeGrid.treeColumnIndex = this.parent.treeColumnIndex;
        this.parent.treeGrid.columns = this.treeGridColumns;
        this.parent.treeGrid.loadingIndicator = this.parent.loadingIndicator;
        this.parent.treeGrid.enableVirtualMaskRow = this.parent.enableVirtualMaskRow;
        if (this.parent.dataSource instanceof Object && isCountRequired(this.parent)) {
            // In order to bind the observable data at load time, hasChildMapping is necessary to be mapped.
            this.parent.treeGrid.hasChildMapping = 'isParent';
            const count: number = getValue('count', this.parent.dataSource);
            this.parent.treeGrid.dataSource = {result: this.parent.flatData, count: count};
        } else {
            if (this.parent.treeGrid.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
                this.parent.treeGrid.dataSource = this.parent.dataSource;
            }
            else {
                this.parent.treeGrid.hasChildMapping = null;
                this.parent.treeGrid.dataSource = this.parent.flatData;
            }
        }
        this.parent.treeGrid.expandStateMapping = this.parent.taskFields.expandState;
        const isGantt: string = 'isGantt';
        this.parent.treeGrid[isGantt as string] = true;
        this.parent.treeGrid.rowHeight = this.parent.rowHeight;
        this.parent.treeGrid.gridLines = this.parent.gridLines;
        if (this.parent.searchSettings.fields.length !== 0 || this.parent.searchSettings.key !== '') {
            this.parent.treeGrid.searchSettings = this.parent.searchSettings;
        }
        const isJsComponent: string = 'isJsComponent';
        this.parent.treeGrid[isJsComponent as string] = true;
        this.parent.treeGrid.height =
        this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0]['offsetHeight'] - (this.parent.flatData.length === 0 ? 0 : 19);
    }
    private getContentDiv(): HTMLElement {
        return this.treeGridElement.querySelector('.e-content');
    }

    private getHeaderDiv(): HTMLElement {
        return this.treeGridElement.querySelector('.e-headercontent');
    }

    private getScrollbarWidth(): number {
        const outer: HTMLElement = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        const inner: HTMLElement = document.createElement('div');
        outer.appendChild(inner);
        this.parent.element.appendChild(outer);
        const scrollbarWidth: number = (outer.offsetWidth - inner.offsetWidth);
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
    }
    /**
     * @returns {void} .
     * @private
     */
    public ensureScrollBar(): void {
        const content: HTMLElement = this.getContentDiv();
        const headerDiv: HTMLElement = this.getHeaderDiv();
        const scrollWidth: number = this.getScrollbarWidth();
        const isMobile: boolean = /Android|Mac|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (scrollWidth === 0 && navigator.userAgent.includes('Firefox')) {
            headerDiv.style.cssText += 'width: calc(100% + ' + (6) + 'px);';
            content.style.cssText += 'width: calc(100% + ' + (6) + 'px);';
        // For Firefox scrollWidth value return 0, causes the grid side column misalign- Task(888356)
        } else if (scrollWidth !== 0) {
            content.style.cssText += 'width: calc(100% + ' + (scrollWidth) + 'px);'; //actual scrollbar width 17 px
        } else {
            content.classList.add('e-gantt-scroll-padding');
        }
        if (scrollWidth === 0 && isMobile) {
            headerDiv.style.cssText += 'width: calc(100% + 17px);';
        }
    }
    private bindEvents(): void {
        this.parent.treeGrid.dataBound = this.dataBound.bind(this);
        this.parent.treeGrid.collapsing = this.collapsing.bind(this);
        this.parent.treeGrid.collapsed = this.collapsed.bind(this);
        this.parent.treeGrid.expanding = this.expanding.bind(this);
        this.parent.treeGrid.expanded = this.expanded.bind(this);
        this.parent.treeGrid.actionBegin = this.actionBegin.bind(this);
        this.parent.treeGrid.actionComplete = this.treeActionComplete.bind(this);
        this.parent.treeGrid.created = this.created.bind(this);
        this.parent.treeGrid.actionFailure = this.actionFailure.bind(this);
        this.parent.treeGrid.headerCellInfo = this.headerCellInfo.bind(this);
        this.parent.treeGrid.rowDataBound = this.rowDataBound.bind(this);
        this.parent.treeGrid.columnMenuOpen = this.columnMenuOpen.bind(this);
        this.parent.treeGrid.columnMenuClick = this.columnMenuClick.bind(this);
        this.parent.treeGrid.beforeDataBound = this.beforeDataBound.bind(this);
        this.parent.treeGrid.dataStateChange = this.dataStateChange.bind(this);
        if (this.parent.queryCellInfo != null)
        {
            this.parent.treeGrid.queryCellInfo = this.queryCellInfo.bind(this);
        }
    }

    private beforeDataBound(args: object): void {
        if (this.parent.enableHover) {
            const columnHeader: HTMLElement = this.treeGridElement.querySelector('.e-columnheader');
            columnHeader.classList.add('e-headercell-hover');
        }
        if (this.parent.filterModule && this.parent.treeGrid.filterModule) {
            this.parent.filterModule.filteredResult = this.parent.treeGrid.filterModule.filteredResult;
        }
        const arg: { result: { updatedCollection: object[] } } = { result: args['result'] };
        this.parent.trigger('beforeDataBound', arg);
        if (!isNullOrUndefined(this.parent.selectionModule) && this.parent.selectionSettings &&
            this.parent.selectionSettings.persistSelection && this.parent.selectionModule.getSelectedRowIndexes().length > 0 &&
            args['actionArgs']['requestType'] === 'sorting') {
            this.isPersist = true;
        }
        this.parent.updatedRecords = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            getValue('virtualScrollModule.visualData', this.parent.treeGrid) : getValue('result', args);
        const dataArgs: object = args['actionArgs'] || null;
        const isNotSortingWBS: boolean = !dataArgs || dataArgs['requestType'] !== 'sorting' || dataArgs['columnName'] !== 'WBSCode';
        const isNotFilteringWBS: boolean = !dataArgs || dataArgs['requestType'] !== 'filtering';
        if (this.parent.enableWBS && !this.parent.isVirtualScroll && isNotSortingWBS && isNotFilteringWBS) {
            this.parent.generateWBSCodes(this.parent.updatedRecords);
        }
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            this.parent.updateContentHeight(args);
        }
        setValue('contentModule.objectEqualityChecker', this.objectEqualityChecker, this.parent.treeGrid.grid);
        this.parent['isExpandPerformed'] = false;
    }
    private dataBound(args: object): void {
        if (this.parent.isReact) {
            this.parent['clearTemplate'](['TaskbarTemplate', 'ParentTaskbarTemplate', 'MilestoneTemplate', 'TaskLabelTemplate', 'RightLabelTemplate', 'LeftLabelTemplate']);
        }
        this.ensureScrollBar();
        this.parent.treeDataBound(args);
        this.parent.isLoad = false;
        if (this.parent.isVirtualScroll) {
            if ((this.parent.enableVirtualMaskRow && this.parent.enableVirtualization) ||
                (this.parent.enableVirtualization && !this.parent.enableVirtualMaskRow && this.parent.loadingIndicator.indicatorType === 'Shimmer') ||
                (this.parent.loadingIndicator.indicatorType === 'Shimmer')) {
                this.parent.hideMaskRow();
            }
            if (this.parent.editModule && this.parent.editModule.cellEditModule) {
                this.parent.editModule.cellEditModule.isCellEdit = false;
            }
            this.parent.isVirtualScroll = false;
            if (!isNullOrUndefined(this.parent.selectionModule) && !isNullOrUndefined(this.parent.toolbarModule)) {
                this.parent.toolbarModule.refreshToolbarItems();
            }
        }
        this.prevCurrentView = extend([], [], this.parent.currentViewData, true);
    }
    private dataStateChange(args: DataStateChangeEventArgs): void {
        if (args.action && args.action.requestType === 'refresh') {
            this.parent.treeGrid.dataSource = {
                result: getValue('result', this.parent.treeGrid.dataSource),
                count: getValue('count', this.parent.treeGrid.dataSource)
            };
        }
        this.parent.trigger('dataStateChange', args);
    }
    private collapsing(args: object): void | Deferred {
        // Collapsing event
        let collapsingArgs: object;
        const record: IGanttData | [] = getValue('data', args);
        const recordLength: number = (record as IGanttData[]).length;
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            if (!isNullOrUndefined(recordLength)) {
                for (let i: number = 0; i < recordLength; i++) {
                    collapsingArgs = this.createExpandCollapseArgs(args, record[i as number]);
                    this.parent.ganttChartModule.collapseGanttRow(collapsingArgs);
                }
                setValue('cancel', getValue('cancel', collapsingArgs), args);
            }
            else {
                collapsingArgs = this.createExpandCollapseArgs(args, null);
                this.parent.ganttChartModule.collapseGanttRow(collapsingArgs);
                setValue('cancel', getValue('cancel', collapsingArgs), args);
            }
        }
    }
    private expanding(args: object): void | Deferred {
        // Expanding event
        let expandingArgs: object;
        const record: IGanttData | [] = getValue('data', args);
        const recordLength: number = (record as IGanttData[]).length;
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            if (!isNullOrUndefined(recordLength)) {
                for (let i: number = 0; i < recordLength; i++) {
                    expandingArgs = this.createExpandCollapseArgs(args, record[i as number]);
                    this.parent.ganttChartModule.expandGanttRow(expandingArgs);
                }
                setValue('cancel', getValue('cancel', expandingArgs), args);
            }
            else {
                expandingArgs = this.createExpandCollapseArgs(args, null);
                this.parent.ganttChartModule.expandGanttRow(expandingArgs);
                setValue('cancel', getValue('cancel', expandingArgs), args);
            }
        }
    }
    private collapsed(args: object): void {
        const collapsingNodeData: any = (args as Record<string, any>).data;
        const expanded: boolean = collapsingNodeData && collapsingNodeData.expanded;
        if (!this.parent.enableVirtualization && this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping && !expanded) {
            (args as Record<string, any>)['data'][this.parent.taskFields.expandState] = false;
        }
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart  && !this.parent.isExpandCollapseLevelMethod) {
            let collapsedArgs: object;
            const record: IGanttData | [] = getValue('data', args);
            const recordLength: number = (record as IGanttData[]).length;
            if (!isNullOrUndefined(recordLength)) {
                for (let i: number = 0; i < recordLength; i++ ) {
                    collapsedArgs = this.createExpandCollapseArgs(args, record[i as number]);
                    this.parent.ganttChartModule.collapsedGanttRow(collapsedArgs);
                }
            }
            else {
                collapsedArgs = this.createExpandCollapseArgs(args, null);
                this.parent.ganttChartModule.collapsedGanttRow(collapsedArgs);
            }
            if (!this.parent.ganttChartModule.isCollapseAll && collapsedArgs['gridRow'] && !this.parent.allowTaskbarOverlap) {
                collapsedArgs['gridRow'].style.height = collapsedArgs['chartRow'].style.height;
                this.parent.contentHeight = this.parent.enableRtl ? this.parent['element'].getElementsByClassName('e-content')[2].children[0]['offsetHeight'] :
                    this.parent['element'].getElementsByClassName('e-content')[0].children[0]['offsetHeight'];
                document.getElementsByClassName('e-chart-rows-container')[0]['style'].height = this.parent.contentHeight + 'px';
            }
        }
        this.parent.expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        if  (this.parent.showOverAllocation) {
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.parent.ganttChartModule.updateWidthAndHeight();
        this.parent.ganttChartModule.reRenderConnectorLines();
        this.parent['hideLoadingIndicator']();
        this.parent.trigger('collapsed', args);
    }
    private expanded(args: object): void {
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart && !this.parent.isExpandCollapseLevelMethod) {
            let expandedArgs: object;
            const record: IGanttData | [] = getValue('data', args);
            const recordLength: number = (record as IGanttData[]).length;
            if (!isNullOrUndefined(recordLength)) {
                for (let i: number = 0; i < recordLength; i++ ) {
                    expandedArgs = this.createExpandCollapseArgs(args, record[i as number]);
                    this.parent.ganttChartModule.expandedGanttRow(expandedArgs);
                }
            }
            else {
                expandedArgs = this.createExpandCollapseArgs(args, null);
                this.parent.ganttChartModule.expandedGanttRow(expandedArgs);
            }
            if (!this.parent.ganttChartModule.isExpandAll && args['row'] && !this.parent.allowTaskbarOverlap) {
                args['row'].style.height = this.parent.rowHeight + 'px';
                this.parent.contentHeight = this.parent.enableRtl ? this.parent['element'].getElementsByClassName('e-content')[2].children[0]['offsetHeight'] :
                    this.parent['element'].getElementsByClassName('e-content')[0].children[0]['offsetHeight'];
                document.getElementsByClassName('e-chart-rows-container')[0]['style'].height = this.parent.contentHeight + 'px';
            }
        }
        this.parent.expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        if  (this.parent.showOverAllocation) {
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.parent.ganttChartModule.updateWidthAndHeight();
        this.parent.ganttChartModule.reRenderConnectorLines();
        this.parent['hideLoadingIndicator']();
        this.parent.isCollapseAll = false;
        this.parent.trigger('expanded', args);
        this.parent['isExpandPerformed'] = true;
    }
    private actionBegin(args: FilterEventArgs | SortEventArgs): void {
        if (this.parent.undoRedoModule && (args.requestType === 'filtering' || args.requestType === 'searching' || args.requestType === 'sorting'  || args.requestType === 'filterAfterOpen')) {
            this.parent.undoRedoModule['canUpdateIndex'] = false;
        }
        if (args.requestType === 'filterchoicerequest') {
            const filterElement: HTMLElement = getValue('filterModel.dlg', args);
            if (filterElement) {
                filterElement.style.display = 'none';
            }
        }
        if (args && args.type === 'save' && args['rowData'] && args['rowData'].ganttProperties) {
            this.perviousStartDate = args['rowData'].ganttProperties.startDate;
            this.perviousEndDate = args['rowData'].ganttProperties.endDate;

        }
        this.parent.notify('actionBegin', args);
        const flag: boolean = getValue('doubleClickTarget', this.parent.treeGrid.editModule);
        if (flag !== null) {
            setValue('doubleClickTarget', null, this.parent.treeGrid.editModule);
        }
        this.parent.trigger('actionBegin', args);
        this.parent.trigger('cellSave', args);
        if (args.requestType !== 'virtualscroll' && args.type !== 'edit' && args.requestType !== 'beginEdit' && !args.cancel) {
            this.parent['showLoadingIndicator']();
        }
    }// eslint-disable-next-line
    private created(args: object): void {
        this.updateKeyConfigSettings();
    }
    private actionFailure(args: FailureEventArgs): void {
        this.parent.trigger('actionFailure', args);
    }
    private queryCellInfo = (args: QueryCellInfoEventArgs) => {
        this.parent.trigger('queryCellInfo', args);
    }
    private headerCellInfo = (args: HeaderCellInfoEventArgs) => {
        this.parent.trigger('headerCellInfo', args);
    }
    private rowDataBound = (args: RowDataBoundEventArgs) => {
        this.parent.trigger('rowDataBound', args);
    }
    private columnMenuOpen = (args: ColumnMenuOpenEventArgs) => {
        this.parent.notify('columnMenuOpen', args);
        this.parent.trigger('columnMenuOpen', args);
        document.querySelector('.e-colmenu').addEventListener('mousemove', () => {
            const filPopOptions: HTMLElement = document.querySelector('.e-filter-popup');
            const filOptions: HTMLElement = document.querySelector('.e-filter-item');
            if (!isNullOrUndefined(filPopOptions)) {
                if (!filOptions.classList.contains('e-focused')) {
                    remove(this.parent.filterModule.filterMenuElement);
                }
            }
        });
    }
    private columnMenuClick = (args: ColumnMenuClickEventArgs) => {
        this.parent.trigger('columnMenuClick', args);
    }
    private createExpandCollapseArgs(args: object, currentRecord: IGanttData ): object {
        let chartRow: Node;
        const record: IGanttData | [] = getValue('data', args);
        const recordLength: number = (record as IGanttData[]).length;
        if (!isNullOrUndefined(recordLength)) {
            const gridRow: Node = getValue('row', args);
            chartRow = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(currentRecord)];
            const eventArgs: object = { data: currentRecord, gridRow: gridRow, chartRow: chartRow, cancel: false };
            return eventArgs;
        }
        else {
            const recordOne: IGanttData = getValue('data', args);
            const gridRow: Node = getValue('row', args);
            chartRow = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(recordOne)];
            const eventArgs: object = { data: recordOne, gridRow: gridRow, chartRow: chartRow, cancel: false };
            return eventArgs;
        }
    }
    private objectEqualityChecker = (old: Object, current: Object) => {
        if (old) {
            const keys: string[] = Object.keys(old);
            let isEqual: boolean = true;
            const excludeKeys: string[] = ['Children', 'childRecords', 'taskData', 'uniqueID', 'parentItem', 'parentUniqueID', 'ganttProperties'];
            for (let i: number = 0; i < keys.length; i++) {
                const oldKey: number | Date = old[keys[parseInt(i.toString(), 10)]] instanceof Date ?
                    new Date(old[keys[parseInt(i.toString(), 10)]]).getTime() : old[keys[parseInt(i.toString(), 10)]];
                const currentKey: number | Date = current[keys[parseInt(i.toString(), 10)]] instanceof Date ?
                    new Date(current[keys[parseInt(i.toString(), 10)]]).getTime() : current[keys[parseInt(i.toString(), 10)]];
                if (oldKey !== currentKey && excludeKeys.indexOf(keys[i as number]) === -1) {
                    this.parent.modifiedRecords.push(current);
                    isEqual = false; break;
                }
            }
            return isEqual;
        } else {
            return false;
        }
    }
    public maxLimits(durationUnit: string): number {
        switch (durationUnit) {
        case 'day':
            return 1000;
        case 'minute':
            return 24000;
        case 'hour':
            return 1440000;
        default:
            return 1000; // fallback value
        }
    }
    public isGuID(str: string): boolean {
        const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }
    public splitByLastOffset(input: string): number {
        const lastPlus: number = input.lastIndexOf('+');
        const lastMinus: number = input.lastIndexOf('-');
        const splitIndex: number = Math.max(lastPlus, lastMinus);
        let offset: string = '';
        if (splitIndex === -1) {
            return offset = null; // No + or - found
        }
        offset = input.substring(splitIndex);
        let offsetNumber: number = Number(offset.match(/\d+/));
        offsetNumber = this.isGuID(input) ? 0 : offsetNumber;
        return offsetNumber;
    }

    public updatePredecessorLimits(
        splits: string[],
        previousData: string,
        maxLimits: number
    ): string {
        const updatedSplits: (string | string[])[] = splits.map((item: string) => {
            let result: string[] | string = '';
            const offset: number = this.splitByLastOffset(item);
            if (!isNaN(offset) && offset >= maxLimits) {
                /* eslint-disable-next-line */
                let offsetValue: string[] | string = item.split(/[\+\-]/);
                const previousDataSplits: string[] = previousData.split(',');
                const index: number = previousDataSplits.findIndex((prevItem: string) => {
                    return prevItem.trim().toLowerCase() === offsetValue[0].trim().toLowerCase();
                });
                if (index !== -1) {
                    result = previousDataSplits[index as number];
                    (offsetValue as string[]).pop(); // Remove the offset part
                }
            } else {
                result = item; // Keep original string if condition not met
            }

            return result;
        });

        return updatedSplits.join(',');
    }

    private treeActionComplete(args: object): void {
        let fieldName: string = null ;
        let preventEventTrigger: boolean = false;
        const updatedArgs: object = extend({}, args);
        if (getValue('requestType', args) === 'reorder') {
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isFromUndoRedo'] && this.parent['isUndoRedoItemPresent']('ColumnReorder')) {
                if (this.parent.undoRedoModule['redoEnabled']) {
                    this.parent.undoRedoModule['disableRedo']();
                }
                this.parent.undoRedoModule['createUndoCollection']();
                const record: Object = {};
                record['action'] = 'ColumnReorder';
                record['fromIndex'] = extend([], [], [args['fromIndex']], true)[0];
                record['toIndex'] = extend([], [], [args['toIndex']], true)[0];
                record['toColumn'] = extend([], [], [this.parent.treeGrid.columns[args['toIndex']]['field']], true)[0];
                record['fromColumn'] = extend([], [], [this.parent.treeGrid.columns[args['fromIndex']]['field']], true)[0];
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as Object) = record;
            }
        }
        if (getValue('requestType', args) === 'columnstate') {
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isFromUndoRedo'] && this.parent['isUndoRedoItemPresent']('ColumnState')) {
                if (this.parent.undoRedoModule['redoEnabled']) {
                    this.parent.undoRedoModule['disableRedo']();
                }
                this.parent.undoRedoModule['createUndoCollection']();
                const record: Object = { action: 'ColumnState' };
                record['showhideColumns'] = extend([], [], args['columns'], true);
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as Object) = record;
            }
        }
        if (getValue('requestType', args) === 'sorting') {
            if (this.parent.undoRedoModule && this.parent['isUndoRedoItemPresent']('Sorting')) {
                if (this.parent.undoRedoModule['currentAction'] && this.parent.undoRedoModule['currentAction']['sortColumns'] && this.parent.undoRedoModule['currentAction']['sortColumns'].length > 1) {
                    this.parent.undoRedoModule['sortedColumnsLength']++;
                }
                if ((!this.parent.undoRedoModule['currentAction'] || (this.parent.undoRedoModule['currentAction']['sortColumns'] && this.parent.undoRedoModule['sortedColumnsLength'] !== this.parent.undoRedoModule['currentAction']['sortColumns'].length)) && !this.parent.undoRedoModule['isFromUndoRedo']) {
                    if (this.parent.undoRedoModule['redoEnabled']) {
                        this.parent.undoRedoModule['disableRedo']();
                    }
                    this.parent.undoRedoModule['createUndoCollection']();
                    const record: Object = { action: 'Sorting' };
                    record['sortColumns'] = [];
                    record['sortColumns'] = this.parent.undoRedoModule['previousSortedColumns'];
                    (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as Object) = record;
                }
                this.parent.undoRedoModule['previousSortedColumns'] = this.parent.treeGrid.sortSettings.columns;
            }
            this.parent.notify('updateModel', {});
            deleteObject(updatedArgs, 'isFrozen');
        } else if (getValue('requestType', args) === 'filtering') {
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isFromUndoRedo'] && this.parent['isUndoRedoItemPresent']('Filtering')) {
                if (this.parent.undoRedoModule['redoEnabled']) {
                    this.parent.undoRedoModule['disableRedo']();
                }
                this.parent.undoRedoModule['createUndoCollection']();
                const record: Object = { action: 'Filtering' };
                record['filteredColumns'] = extend([], [], args['columns'], true);
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as Object) = record;
            }
            this.parent.notify('updateModel', {});
        } else if (getValue('type', args) === 'save') {
            fieldName = !isNullOrUndefined(args['column']) ? args['column'].field : null;
            if (fieldName && args['previousData'] === args['data'][fieldName as string]) {
                preventEventTrigger = true;
            }
            if (this.parent.editModule && this.parent.editModule.cellEditModule) {
                const data: IGanttData = getValue('data', args);
                if (!isNullOrUndefined(data) && !isNullOrUndefined(this.parent.getTaskByUniqueID(data.uniqueID))) {
                    /* eslint-disable-next-line */
                    this.parent.getTaskByUniqueID(data.uniqueID).taskData[this.parent.taskFields.duration] = data.taskData[this.parent.taskFields.duration];
                    if (!isNullOrUndefined(data.taskData[this.parent.taskFields.resourceInfo])) {
                        /* eslint-disable-next-line */
                        this.parent.getTaskByUniqueID(data.uniqueID).taskData[this.parent.taskFields.resourceInfo] = data.taskData[this.parent.taskFields.resourceInfo];
                    }
                }
                if (isEmptyObject(this.currentEditRow) && args['column'] && args['column'].edit && args['column'].field === this.parent.taskFields.resourceInfo) {
                    const field: string = this.parent.taskFields.resourceInfo;
                    this.currentEditRow = { [field]: data['resources'] };
                }
                if (args['data'][this.parent.taskFields.dependency] && args['column'].field === this.parent.taskFields.dependency) {
                    const splits: string[] = args['data'][this.parent.taskFields.dependency].split(',');
                    const maxLimits: number = this.maxLimits(this.parent.durationUnit);
                    args['data'][this.parent.taskFields.dependency] = this.updatePredecessorLimits(splits, args['previousData'], maxLimits);
                }
                this.parent.editModule.cellEditModule.initiateCellEdit(args, this.currentEditRow);
                this.parent.editModule.cellEditModule.isCellEdit = false;
                this.currentEditRow = {};
            }
        }
        if (getValue('requestType', args) === 'filterAfterOpen') {
            this.parent.notify('actionComplete', args);
        }
        if (getValue('requestType', args) === 'searching') {
            if (this.parent.undoRedoModule && this.parent['isUndoRedoItemPresent']('Search')) {
                if (!this.parent.undoRedoModule['isFromUndoRedo']) {
                    if (this.parent.undoRedoModule['redoEnabled']) {
                        this.parent.undoRedoModule['disableRedo']();
                    }
                    this.parent.undoRedoModule['createUndoCollection']();
                    const record: Object = { 'action': 'Search' };
                    record['searchString'] = this.parent.undoRedoModule['searchString'];
                    (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as Object) = record;
                }
                this.parent.undoRedoModule['searchString'] = this.parent.treeGrid.searchSettings.key;
            }
            this.parent.notify('actionComplete', args);
        }
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(getValue('batchChanges', args))) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        if (this.parent.isCancelled) {
            setValue('requestType', 'cancel', updatedArgs);
            setValue('action', 'CellEditing', updatedArgs);
            this.parent.isCancelled = false;
        }
        if (getValue('requestType', args) === 'refresh' && isNullOrUndefined(getValue('type', args)) && this.parent.addDeleteRecord) {
            if (this.parent.selectedRowIndex !== -1) {
                if (
                    this.parent.editModule.isAdded && !isNullOrUndefined(this.parent.selectionModule) &&
                    this.parent.selectionSettings &&
                    this.parent.selectionSettings.persistSelection
                ) {
                    const selectedIndexes: number[] = this.parent.selectionModule.selectedRowIndexes;
                    if (selectedIndexes.length > 1 && this.parent.selectionSettings.persistSelection) {
                        for (let i: number = 0; i < selectedIndexes.length; i++) {
                            const records: any = this.parent.flatData[selectedIndexes[i as number].toString()];
                            this.parent.selectRows(records);
                        }
                    }
                }
                else {
                    this.parent.selectRow(this.parent.selectedRowIndex);
                    if (this.parent.selectedRowIndex > this.parent.currentViewData.length - 1) {
                        this.parent.selectedRowIndex = -1;
                    }
                }
            }
            else {
                if (!isNullOrUndefined(this.parent.selectionModule) && this.parent.selectionSettings &&
                    this.parent.selectionSettings.persistSelection
                    && this.parent.editModule && !this.parent.editModule.isAdded) {
                    const selectedRecords: Object[] = this.parent.selectionModule.getSelectedRecords();
                    for (let i: number = selectedRecords.length - 1; i >= 0; i--) {
                        const selectedTaskId: any = selectedRecords[i as number][this.parent.taskFields.id];
                        const existIndeletedRecords: boolean = this.parent.editModule.deletedRecord.some((item: any) =>
                            item.ganttProperties.taskId === selectedTaskId);
                        if (existIndeletedRecords) {
                            selectedRecords.splice(i, 1);
                        }
                    }
                }
                let indexvalue: number = 0;
                const dataCollection: IGanttData[] = this.parent.enableVirtualization ? this.parent.flatData : this.parent.currentViewData;
                // To maintain 1st record selection, while deleting the last parent record at Virtual mode
                dataCollection.map((data: Object, index: number) => {
                    if (!isNullOrUndefined(this.parent.currentSelection)
                    && (data['ganttProperties'].taskId === this.parent.currentSelection[this.parent.taskFields.id]) &&
                    (
                        (this.parent.viewType === 'ResourceView' &&
                         data['ganttProperties'].rowUniqueID === this.parent.currentSelection.rowUniqueID) ||
                        this.parent.viewType !== 'ResourceView'
                    ))  {
                        indexvalue = index;
                    }
                });
                this.addedRecord = true;
                this.parent.selectRow((isNullOrUndefined(indexvalue) ? 0 : indexvalue));
            }
            if (!this.parent['isExpandPerformed']) {
                this.parent.addDeleteRecord = false;
            }
            this.parent['isExpandPerformed'] = false;
        }
        if (this.parent.undoRedoModule) {
            this.parent.undoRedoModule['isFromUndoRedo'] = false;
        }
        if (getValue('requestType', args) === 'refresh') {
            this.parent.initiateEditAction(false);
        }
        if (!preventEventTrigger && !this.setCancelArgs) {
            this.parent.trigger('actionComplete', updatedArgs);
        }
        if ( this.parent.showOverAllocation && !this.parent.allowTaskbarOverlap) {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                if (this.parent.currentViewData[i as number].hasChildRecords && !this.parent.currentViewData[i as number].expanded) {
                    this.parent.chartRowsModule.updateDragDropRecords(this.parent.currentViewData[i as number]);
                }
            }
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
        if (args['type'] !== 'save') {
            this.parent['hideLoadingIndicator']();
        }
    }

    private updateKeyConfigSettings(): void {
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.delete;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.insert;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.upArrow;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.downArrow;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.ctrlHome;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.ctrlEnd;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.enter;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.tab;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.shiftTab;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.enter;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.upArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.downArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlShiftUpArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlShiftDownArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlUpArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlDownArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.tab;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.shiftTab;
    }

    /**
     * Method to bind internal events on TreeGrid element
     *
     * @returns {void} .
     */
    private wireEvents(): void {
        const content: HTMLElement = this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.add(content, 'scroll', this.scrollHandler, this);
        }
        if (this.parent.isAdaptive) {
            EventHandler.add(this.parent.treeGridPane, 'click', this.treeGridClickHandler, this);
        }
    }
    private unWireEvents(): void {
        const content: HTMLElement = this.parent.treeGrid.element &&
            this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.remove(content, 'scroll', this.scrollHandler);
        }
        if (this.parent.isAdaptive) {
            EventHandler.remove(this.parent.treeGridPane, 'click', this.treeGridClickHandler);
        }
    }
    // eslint-disable-next-line
    private scrollHandler(e: WheelEvent): void {
        const content: HTMLElement = this.parent.treeGrid.element.querySelector('.e-content');
        if (content.scrollTop !== this.previousScroll.top) {
            this.parent.notify('grid-scroll', { top: content.scrollTop });
        }
        this.previousScroll.top = content.scrollTop;
        if (this.parent.contextMenuModule && this.parent.contextMenuModule.isOpen) {
            this.parent.contextMenuModule.contextMenu.close();
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public validateGanttColumns(): void {
        const ganttObj: Gantt = this.parent;
        const length: number = ganttObj.columns.length;
        const tasks: TaskFieldsModel = this.parent.taskFields;
        this.parent.columnMapping = {};
        this.parent.columnByField = {};
        this.parent.customColumns = [];
        this.parent.ganttColumns = [];
        const tasksMapping: string[] = ['id', 'name', 'startDate', 'endDate', 'duration', 'dependency',
            'progress', 'baselineStartDate', 'baselineEndDate', 'baselineDuration', 'resourceInfo', 'notes', 'work', 'manual', 'type', 'milestone', 'segments', 'constraintType', 'constraintDate'];
        for (let i: number = 0; i < length; i++) {
            let column: GanttColumnModel = {};
            if (typeof ganttObj.columns[i as number] === 'string') {
                column.field = ganttObj.columns[i as number] as string;
            } else {
                column = <GanttColumnModel>ganttObj.columns[i as number];
            }
            let columnName: string[] = [];
            if (tasksMapping.length > 0) {
                columnName = tasksMapping.filter((name: string) => {
                    return column.field === tasks[name as string];
                });
            }
            if (columnName.length === 0) {
                if (column.field === this.parent.resourceFields.group) {
                    continue;
                }
                if (column.field !== 'WBSCode' && column.field !== 'WBSPredecessor') {
                    this.parent.customColumns.push(column.field);
                }
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : column.field;
                column.width = column.width ? column.width : 150;
                if (column.field === 'WBSCode') {
                    column.allowEditing = false;
                }
                else {
                    column.allowEditing = !isNullOrUndefined(column.allowEditing) ? column.allowEditing : true;
                }
                if (column.field === 'WBSCode' || column.field === 'WBSPredecessor') {
                    column.clipMode = 'EllipsisWithTooltip';
                }
                if (column.editType === undefined) {
                    if (column.type === 'date') {
                        column.editType = 'datepickeredit';
                    } else if (column.type === 'datetime') {
                        column.editType = 'datetimepickeredit';
                    } else {
                        column.editType = 'stringedit';
                    }
                }
                column.type = column.type ? column.type : 'string';
                if (column.type === 'checkbox') {
                    this.parent.selectionSettings.type = 'Multiple';
                }
                this.bindTreeGridColumnProperties(column, true);
                continue;
            } else {
                const index: number = tasksMapping.indexOf(columnName[0]);
                tasksMapping.splice(index, 1);
                this.createTreeGridColumn(column, true);
                this.parent.columnMapping[columnName[0]] = column.field;
            }
        }

        /** Create default columns with task settings property */
        for (let j: number = 0; j < tasksMapping.length; j++) {
            const column: GanttColumnModel = {};
            if (!isNullOrUndefined(tasks[tasksMapping[j as number]])) {
                column.field = tasks[tasksMapping[j as number]];
                this.createTreeGridColumn(column, length === 0);
                this.parent.columnMapping[tasksMapping[j as number]] = column.field;
            }
        }
        if (this.parent.viewType !== 'ProjectView') {
            const column: GanttColumnModel = {};
            this.composeUniqueIDColumn(column);
            this.createTreeGridColumn(column, true);
        }
    }
    private getLocalizedConstraintTypeText(type: string): string {
        return this.parent.localeObj.getConstant(`constraintType${type}`);
    }

    /**
     *
     * @param {GanttColumnModel} column .
     * @param {boolean} isDefined .
     * @returns {void} .
     */
    private createTreeGridColumn(column: GanttColumnModel, isDefined?: boolean): void {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const previousColumn: GanttColumnModel = this.parent.previousGanttColumns.filter((prevcolumn: GanttColumnModel) => {
            return column.field === prevcolumn.field;
        })[0];
        column.disableHtmlEncode = !isNullOrUndefined(column.disableHtmlEncode) ? column.disableHtmlEncode : this.parent.disableHtmlEncode;
        if (taskSettings.id !== column.field) {
            column.clipMode = column.clipMode ? column.clipMode : 'EllipsisWithTooltip';
        }
        if (taskSettings.id === column.field) {
            /** Id column */
            this.composeIDColumn(column);
        } else if (taskSettings.name === column.field) {
            /** Name column */
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('name');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('name');
            }
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = column.type ? column.type : 'string';
        } else if (taskSettings.startDate === column.field) {
            /** Name column */
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('startDate');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('startDate');
            }
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.width = column.width ? column.width : 150;
            if (column.edit && column.edit.params) {
                column.edit.params['renderDayCell'] = this.parent.renderWorkingDayCell.bind(this.parent);
            }
            else {
                if (column.edit) {
                    column.edit.params = { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) };
                }
                else {
                    column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
                }
            }
        } else if (taskSettings.baselineStartDate === column.field ||
            taskSettings.baselineEndDate === column.field) {
            const colName: string = (taskSettings.baselineEndDate === column.field) ? 'baselineEndDate' :
                'baselineStartDate';
            column.width = column.width ? column.width : 150;
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText)
                    ? previousColumn.headerText
                    : this.parent.localeObj.getConstant(colName);
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant(colName);
            }
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
        } else if (taskSettings.endDate === column.field) {
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('endDate');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('endDate');
            }
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.width = column.width ? column.width : 150;
            if (column.edit && column.edit.params) {
                column.edit.params['renderDayCell'] = this.parent.renderWorkingDayCell.bind(this.parent);
            }
            else {
                if (column.edit) {
                    column.edit.params = { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) };
                }
                else {
                    column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
                }
            }
        } else if (taskSettings.constraintDate === column.field) {
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('constraintDate');
            } else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('constraintDate');
            }
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.width = column.width ? column.width : 150;
            if (column.edit && column.edit.params) {
                column.edit.params['renderDayCell'] = this.parent.renderWorkingDayCell.bind(this.parent);
            } else {
                if (column.edit) {
                    column.edit.params = { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) };
                } else {
                    column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
                }
            }
        } else if (taskSettings.duration === column.field) {
            column.width = column.width ? column.width : 150;
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('duration');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('duration');
            }
            column.valueAccessor = column.valueAccessor ?
                column.valueAccessor : !isNullOrUndefined(column.edit) && !isNullOrUndefined(column.edit.read) ? null :
                    this.durationValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = column.type ? column.type : 'string';
        } else if (taskSettings.progress === column.field) {
            this.composeProgressColumn(column);
        } else if (taskSettings.dependency === column.field) {
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('dependency');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('dependency');
            }
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
            column.allowFiltering = column.allowFiltering === false ? false : true;
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.dependencyValueAccessor.bind(this);
            if (isNullOrUndefined(column.filter) && this.parent.locale !== 'en-US') {
                column.filter = {
                    'ui': {
                        create: (args: IFilterCreate) => {
                            const flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                            args.target.appendChild(flValInput);
                            this.dropInstance = new AutoComplete({
                                dataSource: this.changeLocale(this.parent.treeGrid.grid.dataSource),
                                fields: { text: this.parent.taskFields.dependency, value: this.parent.taskFields.dependency },
                                placeholder: this.parent.localeObj.getConstant('enterValue'),
                                popupHeight: '200px'
                            });
                            this.dropInstance.appendTo(flValInput);
                        },
                        write: (args: IFilterWrite ) => {
                            this.dropInstance.value = args.filteredValue;
                        },
                        read: (args: { target: Element, column: any, operator: string, fltrObj: any }) => {
                            args.fltrObj.filterByColumn(args.column.field, args.operator,
                                                        this.changeDelocale((this.dropInstance.value) as string));
                        }
                    }
                };
            }
        } else if (taskSettings.resourceInfo === column.field) {
            this.composeResourceColumn(column);
        } else if (taskSettings.notes === column.field) {
            if (previousColumn && this.parent.isLocaleChanged) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('notes');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('notes');
            }
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            if (!this.parent.showInlineNotes) {
                if (!column.template) {
                    const contentTemp: Function = function (): string {
                        return `<div class="e-ganttnotes-info">
                            <span class="e-icons e-notes-info"></span>
                        </div>`;
                    };
                    column.template = initializeCSPTemplate(contentTemp);
                }
            }
        }
        else if (taskSettings.baselineDuration === column.field) {
            column.width = column.width ? column.width : 150;
            if (this.parent.isLocaleChanged && previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('baselineDuration');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('baselineDuration');
            }
            column.valueAccessor = column.valueAccessor ?
                column.valueAccessor : !isNullOrUndefined(column.edit) && !isNullOrUndefined(column.edit.read) ? null :
                    this.baselineDurationValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = column.type ? column.type : 'string';
        }
        else if (taskSettings.work === column.field) {
            if (previousColumn && this.parent.isLocaleChanged) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('work');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('work');
            }
            column.width = column.width ? column.width : 150;
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.workValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'numericedit';

        } else if (taskSettings.type === column.field) {
            if (previousColumn && this.parent.isLocaleChanged) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('taskType');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('taskType');
            }
            column.width = column.width ? column.width : 150;
            //column.type = 'string';
            column.editType = 'dropdownedit';
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.taskTypeValueAccessor.bind(this);
        } else if (taskSettings.manual === column.field && this.parent.taskMode  === 'Custom') {
            if (previousColumn && this.parent.isLocaleChanged) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('taskMode');
            }
            else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('taskMode');
            }
            column.width = column.width ? column.width : 120;
            column.editType = column.editType ? column.editType : 'dropdownedit';
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.modeValueAccessor.bind(this);
            column.edit = {
                params:
                {
                    query: new Query(),
                    dataSource: [
                        { id: 1, text: this.parent.localeObj.getConstant('manual'), value: true },
                        { id: 2, text: this.parent.localeObj.getConstant('auto'), value: false }
                    ],
                    fields: { text: 'text', value: 'value'}
                }
            };
        } else if (taskSettings.constraintType === column.field) {
            if (previousColumn && this.parent.isLocaleChanged) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('constraintType');
            } else {
                column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('constraintType');
            }
            column.width = column.width ? column.width : 160;
            column.editType = column.editType ? column.editType : 'dropdownedit';
            const constraintTypeDataSource: {
                text: string;
                value: ConstraintType;
            }[] = Object.keys(ConstraintType)
                .filter((key: string) => !isNaN(Number(ConstraintType[key as any])))
                .map((key: string) => ({
                    text: this.getLocalizedConstraintTypeText(key),
                    value: ConstraintType[key as keyof typeof ConstraintType]
                }));
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.constraintTypeValueAccessor.bind(this);
            column.edit = {
                params: {
                    dataSource: constraintTypeDataSource,
                    fields: { text: 'text', value: 'value' },
                    query: new Query()
                }
            };
        }
        this.bindTreeGridColumnProperties(column, isDefined);
    }
    public changeLocale(data: any): any[] {
        const filter: any = [];
        const flatdatas: Object[] = data.map((task: any) => task.ganttProperties.predecessorsName);
        flatdatas.map((predecessorsName: any) => {
            if (!isNullOrUndefined(predecessorsName)) {
                let value: string = '';
                const splitString: string[] = (predecessorsName as string).split(',');
                splitString.map((splitvalue: string, index: number) => {
                    if (splitvalue.includes('FS')) {
                        value += splitvalue.replace('FS', this.parent.localeObj.getConstant('FS'));
                        value += (splitString.length !== index + 1) ? ',' : '';
                    } else if (splitvalue.includes('FF')) {
                        value += splitvalue.replace('FF', this.parent.localeObj.getConstant('FF'));
                        value += (splitString.length !== index + 1) ? ',' : '';
                    } else if (splitvalue.includes('SS')) {
                        value += splitvalue.replace('SS', this.parent.localeObj.getConstant('SS'));
                        value += (splitString.length !== index + 1) ? ',' : '';
                    }
                    else if (splitvalue.includes('SF')) {
                        value += splitvalue.replace('SF', this.parent.localeObj.getConstant('SF'));
                        value += (splitString.length !== index + 1) ? ',' : '';
                    }
                });
                filter.push(value);
            }

        });
        return filter;
    }

    public changeDelocale(dependency: string): string {
        const FF: string = this.parent.localeObj.getConstant('FF');
        const FS: string = this.parent.localeObj.getConstant('FS');
        const SS: string = this.parent.localeObj.getConstant('SS');
        const SF: string = this.parent.localeObj.getConstant('SF');
        if (!isNullOrUndefined(dependency)) {
            const splitString: string[] = dependency.split(',');
            let value: string = '';
            splitString.map((splitvalue: string, index: number) => {
                if (splitvalue.includes(FF)) {
                    value += splitvalue.replace(FF, 'FF');
                    value += (splitString.length !== index + 1) ? ',' : '';
                } else if (splitvalue.includes(FS)) {
                    value += splitvalue.replace(FS, 'FS');
                    value += (splitString.length !== index + 1) ? ',' : '';
                } else if (splitvalue.includes(SS)) {
                    value += splitvalue.replace(SS, 'SS');
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
                else if (splitvalue.includes(SF)) {
                    value += splitvalue.replace(SF, 'SF');
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
                else {
                    value += splitvalue;
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
            });
            return value;
        }
        return null;
    }
    /**
     * Compose Resource columns
     *
     * @param {GanttColumnModel} column .
     * @returns {void} .
     */
    private composeResourceColumn(column: GanttColumnModel): void {
        const previousColumn: GanttColumnModel = this.parent.previousGanttColumns.filter((prevcolumn: GanttColumnModel) => {
            return column.field === prevcolumn.field;
        })[0];
        if (previousColumn && this.parent.isLocaleChanged) {
            column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('resourceName');
        }
        else {
            column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('resourceName');
        }
        column.width = column.width ? column.width : 150;
        column.type = 'string';
        column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.resourceValueAccessor.bind(this);
        column.allowFiltering = column.allowFiltering === false ? false : true;
    }
    /**
     * @param {IGanttData} data .
     * @returns {object} .
     * @private
     */
    public getResourceIds(data: IGanttData): object {
        const value: Object[] = getValue(this.parent.taskFields.resourceInfo, data.taskData);
        const id: number[] = [];
        if (!isNullOrUndefined(value)) {
            for (let i: number = 0; i < value.length; i++) {
                id.push(typeof value[i as number] === 'object' ? value[i as number][this.parent.resourceFields.id] : value[i as number]);
            }
            return id;
        } else {
            return value;
        }
    }
    /**
     * Create Id column
     *
     * @param {GanttColumnModel} column .
     * @returns {void} .
     */
    private composeIDColumn(column: GanttColumnModel): void {
        const isProjectView: boolean = this.parent.viewType === 'ProjectView';
        const lengthDataSource: number = this.parent.dataSource ? this.parent.dataSource['length'] : 0;
        let taskIDName: string | number;
        column.isPrimaryKey = isProjectView ? true : false;
        if (this.parent.isLocaleChanged) {
            const previousColumn: GanttColumnModel = this.parent.previousGanttColumns.filter((prevcolumn: GanttColumnModel) => {
                return column.field === prevcolumn.field;
            })[0];
            if (previousColumn) {
                column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('id');
            }
        }
        else {
            column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('id');
        }
        column.width = column.width ? column.width : 100;
        for (let i: number = 0; i < lengthDataSource; i++) {
            if (!isNullOrUndefined(this.parent.dataSource[i as number][this.parent.taskFields.id])) {
                taskIDName = this.parent.dataSource[i as number][this.parent.taskFields.id];
                break;
            }
        }
        if (typeof(taskIDName) === 'string' || isNullOrUndefined(taskIDName)) {
            if (this.parent.viewType === 'ResourceView') {
                column.allowEditing = column.allowEditing ? column.allowEditing : false;
            } else {
                column.allowEditing = column.allowEditing ? column.allowEditing : true;
            }
            column.editType = column.editType ? column.editType : 'stringedit';
        } else {
            column.allowEditing = column.allowEditing ? column.allowEditing : false;
            column.editType = column.editType ? column.editType : 'numericedit';
        }
        column.valueAccessor = isProjectView ? null : this.idValueAccessor.bind(this);
    }
    private composeUniqueIDColumn(column: GanttColumnModel): void {
        column.field = 'rowUniqueID';
        column.isPrimaryKey = true;
        column.headerText = 'UniqueID';
        column.allowEditing = false;
        column.visible = false;
    }

    /**
     * Create progress column
     *
     * @param {GanttColumnModel} column .
     * @returns {void} .
     */
    private composeProgressColumn(column: GanttColumnModel): void {
        const previousColumn: GanttColumnModel = this.parent.previousGanttColumns.filter((prevcolumn: GanttColumnModel) => {
            return column.field === prevcolumn.field;
        })[0];
        if (this.parent.isLocaleChanged && previousColumn) {
            column.headerText = !isNullOrUndefined(previousColumn.headerText) ? previousColumn.headerText : this.parent.localeObj.getConstant('progress');
        }
        else {
            column.headerText = !isNullOrUndefined(column.headerText) ? column.headerText : this.parent.localeObj.getConstant('progress');
        }
        column.width = column.width ? column.width : 150;
        column.editType = column.editType ? column.editType : 'numericedit';
    }

    /**
     * @param {GanttColumnModel} newGanttColumn .
     * @param {boolean} isDefined .
     * @returns {void} .
     */
    private bindTreeGridColumnProperties(newGanttColumn: GanttColumnModel, isDefined?: boolean): void {
        const treeGridColumn: ColumnModel = {}; const ganttColumn: GanttColumnModel = {};
        for (const prop of Object.keys(newGanttColumn)) {
            treeGridColumn[prop as string] = ganttColumn[prop as string] = newGanttColumn[prop as string];
        }
        const templateProps: string[] = [
            'template',
            'editTemplate',
            'filterTemplate',
            'filter_itemTemplate',
            'headerTemplate',
            'formatter'
        ];
        for (const prop of templateProps) {
            if (prop in newGanttColumn && newGanttColumn[prop as string] != null) {
                treeGridColumn[prop as string] = ganttColumn[prop as string] = newGanttColumn[prop as string];
            }
        }
        if (ganttColumn.field === this.parent.taskFields.constraintDate) {
            if (!('type' in ganttColumn)) {
                if (ganttColumn.editType === 'datepickeredit') {
                    ganttColumn.type = 'date';
                } else if (ganttColumn.editType === 'datetimepickeredit') {
                    ganttColumn.type = 'datetime';
                }
                treeGridColumn.type = ganttColumn.type;
            }
        }
        this.parent.columnByField[ganttColumn.field] = ganttColumn;
        this.parent.ganttColumns.push(new GanttColumn(ganttColumn));
        if (isDefined) {
            this.treeGridColumns.push(treeGridColumn);
        }
    }// eslint-disable-next-line
    private durationValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string { 
        if (!isNullOrUndefined(data) && !isNullOrUndefined(data.ganttProperties))  {
            const ganttProp: ITaskData = data.ganttProperties;
            return this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
        }
        else if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            return this.parent.dataOperation.getDurationString(parseInt(data[this.parent.taskFields.duration], 10),
                                                               this.parent.durationUnit);
        }
        return '';
    }// eslint-disable-next-line
    private dependencyValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {
        if (data && data.ganttProperties && !isNullOrUndefined(data.ganttProperties.predecessorsName)) {
            let value: string = '';
            const predecessorsName: any = data.ganttProperties.predecessorsName;
            const splitString: string[] = (predecessorsName as string).split(',');
            splitString.map((splitvalue: string, index: number) => {
                if (splitvalue.includes('FS')) {
                    value += splitvalue.replace('FS', this.parent.localeObj.getConstant('FS'));
                    value += (splitString.length !== index + 1) ? ',' : '';
                } else if (splitvalue.includes('FF')) {
                    value += splitvalue.replace('FF', this.parent.localeObj.getConstant('FF'));
                    value += (splitString.length !== index + 1) ? ',' : '';
                } else if (splitvalue.includes('SS')) {
                    value += splitvalue.replace('SS', this.parent.localeObj.getConstant('SS'));
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
                else if (splitvalue.includes('SF')) {
                    value += splitvalue.replace('SF', this.parent.localeObj.getConstant('SF'));
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
            });
            return value;
        }
        return '';
    }
    private resourceValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.resourceNames;
        }
        return '';
    }

    private workValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return this.parent.dataOperation.getWorkString(ganttProp.work, ganttProp.workUnit);
        }
        return '';
    }
    private taskTypeValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.taskType;
        }
        return '';
    }
    private modeValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        if (data[field as string]) {
            return 'Manual';
        } else {
            return 'Auto';
        }
    }
    private constraintTypeValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {
        const constraintKey: string = Object.keys(ConstraintType)
            .find((key: string) => ConstraintType[key as keyof typeof ConstraintType] === data[field as string]);
        return this.getLocalizedConstraintTypeText(constraintKey);
    }
    /**
     * Returns the formatted baseline duration string for a given task record.
     *
     * <p>This accessor method is used for displaying baseline duration in Gantt columns.
     * It handles both direct property access and cases where child tasks are loaded on demand.</p>
     *
     * @param {string} field - The field name mapped to the column.
     * @param {IGanttData} data - The data record representing a Gantt task.
     * @param {GanttColumnModel} column - The column configuration model.
     * @returns {string} - A formatted duration string (e.g., "5 days") or an empty string if unavailable.
     *
     */
    private baselineDurationValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {
        if (!isNullOrUndefined(data) && !isNullOrUndefined(data.ganttProperties))  {
            const ganttProp: ITaskData = data.ganttProperties;
            return this.parent.dataOperation.getDurationString(ganttProp.baselineDuration, ganttProp.durationUnit);
        }
        else if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            return this.parent.dataOperation.getDurationString(parseInt(data[this.parent.taskFields.baselineDuration], 10),
                                                               this.parent.durationUnit);
        }
        return '';
    }

    private idValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        return data.level === 0 ? 'R-' + data.ganttProperties.taskId : 'T-' + data.ganttProperties.taskId;
    }

    private updateScrollTop(args: object): void {
        const newScrollTop: number = getValue('top', args);
        this.treeGridElement.querySelector('.e-content').scrollTop = newScrollTop;
        this.previousScroll.top = this.treeGridElement.querySelector('.e-content').scrollTop;
    }
    private treeGridClickHandler(e: PointerEvent): void {
        this.parent.notify('treeGridClick', e);
    }
    private setPartialSelectionForGrid(args: Object): void {
        args['isResetPartialRecords'] = this.parent.addDeleteRecord;
    }
    private removeEventListener(): void {
        this.parent.off('renderPanels', this.createContainer);
        this.parent.off('chartScroll', this.updateScrollTop);
        this.parent.off('destroy', this.destroy);
        this.parent.treeGrid.off('reactTemplateRender', this.renderReactTemplate);
        this.parent.treeGrid.grid.off('beforeSetPartialRecords', this.setPartialSelectionForGrid);
    }
    private destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
        if (this.parent.treeGrid.element) {
            this.parent.treeGrid.destroy();
        }
    }
}
