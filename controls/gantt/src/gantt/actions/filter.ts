import { TreeGrid, Filter as TreeGridFilter, FilterSettingsModel as TreeFilterSettingsModel } from '@syncfusion/ej2-treegrid';
import { FilterEventArgs, filterAfterOpen, GroupEventArgs, getFilterMenuPostion, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { getActualProperties, IFilterMUI, Filter as GridFilter, getCustomDateFormat } from '@syncfusion/ej2-grids';
import { Gantt } from '../base/gantt';
import { FilterSettingsModel, ColumnModel, TaskFieldsModel } from '../models/models';
import { getValue, isNullOrUndefined, remove, createElement, addClass, closest, EventHandler } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';

/**
 * The Filter module is used to handle filter action.
 */

export class Filter {
    public parent: Gantt;
    public filterMenuElement: HTMLElement;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridFilter);
        this.parent.treeGrid.allowFiltering = this.parent.allowFiltering;
        this.updateCustomFilters();
        this.parent.treeGrid.filterSettings = getActualProperties(this.parent.filterSettings) as TreeFilterSettingsModel;
        this.addEventListener();
    }

    private getModuleName(): string {
        return 'filter';
    }
    /**
     * Update custom filter for default Gantt columns
     *
     * @returns {void} .
     */
    private updateCustomFilters(): void {
        const settings: TaskFieldsModel = this.parent.taskFields;
        for (let i: number = 0; i < this.parent.ganttColumns.length; i++) {
            const column: ColumnModel = this.parent.ganttColumns[i as number];
            if (((column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') &&
                (column.field === settings.startDate || column.field === settings.endDate
                    || column.field === settings.baselineStartDate || column.field === settings.baselineEndDate)) ||
                (column.field === settings.duration && column.editType === 'stringedit')) {
                this.initiateFiltering(this.parent.ganttColumns[i as number]);
            }
        }
    }

    private updateModel(): void {
        this.parent.filterSettings = this.parent.treeGrid.filterSettings as FilterSettingsModel;
    }
    private addEventListener(): void {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('actionBegin', this.actionBegin, this);
        this.parent.on('actionComplete', this.actionComplete, this);
        this.parent.on('columnMenuOpen', this.columnMenuOpen, this);
    }
    private wireEvents(a: string): void {
        EventHandler.add(document.getElementById(a), 'click', this.mouseClickHandler, this);

    }
    private initiateFiltering(column: ColumnModel): void {
        const treeColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.treeGridModule.treeGridColumns);
        column.allowFiltering = column.allowFiltering === false ? false : true;
        if (column.allowFiltering && (this.parent.filterSettings.type === 'Menu' || this.parent.filterSettings.type === 'Excel') && !column.filter) {
            column.filter = { ui: this.getCustomFilterUi(column) };
        }
        if (treeColumn) {
            treeColumn.allowFiltering = column.allowFiltering;
            treeColumn.filter = column.allowFiltering ? column.filter : {};
        }
    }

    /**
     * To get filter menu UI
     *
     * @param {ColumnModel} column .
     * @returns {IFilterMUI} .
     */
    private getCustomFilterUi(column: ColumnModel): IFilterMUI {
        const settings: TaskFieldsModel = this.parent.taskFields;
        let filterUI: IFilterMUI = {};
        if (column.editType === 'datepickeredit' && (column.field === settings.startDate || column.field === settings.endDate
            || column.field === settings.baselineStartDate || column.field === settings.baselineEndDate)) {
            filterUI = this.getDatePickerFilter(column.field);
        } else if (column.editType === 'datetimepickeredit' && (column.field === settings.startDate || column.field === settings.endDate
            || column.field === settings.baselineStartDate || column.field === settings.baselineEndDate)) {
            filterUI = this.getDateTimePickerFilter();
        } else if (column.field === settings.duration && column.editType === 'stringedit') {
            filterUI = this.getDurationFilter();
        }
        return filterUI;
    }
    private mouseClickHandler(e: PointerEvent): void {
        if (closest(e.target as Element, '.e-excelfilter')){
            this.parent.treeGrid.grid.notify('click', e);
        }
    }
    private unWireEvents(): void {
        EventHandler.remove(this.parent.element, 'click', this.mouseClickHandler);
    }
    private getDatePickerFilter(columnName: string): IFilterMUI {
        const parent: Gantt = this.parent;
        const timeValue: number = (columnName === parent.taskFields.startDate) || (columnName === parent.taskFields.baselineStartDate)
            ? parent.defaultStartTime : parent.defaultEndTime;
        let dropDateInstance: DatePicker;
        const filterDateUI: IFilterMUI = {
            create: (args: { target: Element, column: ColumnModel }) => {
                const format: string = getCustomDateFormat(args.column.format, args.column.type);
                const flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                args.target.appendChild(flValInput);
                dropDateInstance = new DatePicker({ placeholder: this.parent.localeObj.getConstant('enterValue'), format: format });
                dropDateInstance.enableRtl = this.parent.enableRtl;
                dropDateInstance.appendTo(flValInput);
            },
            write: (args: {
                filteredValue: Date
            }) => {
                dropDateInstance.value = args.filteredValue;
            },
            read: (args: { target: Element, column: ColumnModel, operator: string, fltrObj: GridFilter }) => {
                if (dropDateInstance.value) {
                    dropDateInstance.value.setSeconds(timeValue);
                }
                args.fltrObj.filterByColumn(args.column.field, args.operator, dropDateInstance.value);
            }
        };
        return filterDateUI;
    }

    private getDateTimePickerFilter(): IFilterMUI {
        let dropInstance: DateTimePicker;
        const filterDateTimeUI: IFilterMUI = {
            create: (args: { target: Element, column: ColumnModel }) => {
                const format: string = getCustomDateFormat(args.column.format, args.column.type);
                const flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                args.target.appendChild(flValInput);
                dropInstance = new DateTimePicker({ placeholder: this.parent.localeObj.getConstant('enterValue'), format: format });
                dropInstance.enableRtl = this.parent.enableRtl;
                dropInstance.appendTo(flValInput);
            },
            write: (args: {
                filteredValue: Date
            }) => {
                dropInstance.value = args.filteredValue;
            },
            read: (args: { target: Element, column: ColumnModel, operator: string, fltrObj: GridFilter }) => {
                args.fltrObj.filterByColumn(args.column.field, args.operator, dropInstance.value);
            }
        };
        return filterDateTimeUI;
    }

    private getDurationFilter(): IFilterMUI {
        const parent: Gantt = this.parent;
        let textBoxInstance: TextBox;
        let textValue: string = '';
        const filterDurationUI: IFilterMUI = {
            create: (args: { target: Element, column: Object }) => {
                const flValInput: HTMLElement = createElement('input', { className: 'e-input' });
                flValInput.setAttribute('placeholder', this.parent.localeObj.getConstant('enterValue'));
                args.target.appendChild(flValInput);
                textBoxInstance = new TextBox();
                textBoxInstance.enableRtl = this.parent.enableRtl;
                textBoxInstance.appendTo(flValInput);
            },
            write: (args: {
                filteredValue: string
            }) => {
                textBoxInstance.value = args.filteredValue ? textValue : '';
            },
            read: (args: { element: HTMLInputElement, column: ColumnModel, operator: string, fltrObj: GridFilter }) => {
                const durationObj: object = this.parent.dataOperation.getDurationValue(textBoxInstance.value);
                const intVal: number = getValue('duration', durationObj);
                let unit: string = getValue('durationUnit', durationObj);
                if (intVal >= 0) {
                    let dayVal: number;
                    if (unit === 'minute') {
                        dayVal = (intVal * 60) / parent.secondsPerDay;
                    } else if (unit === 'hour') {
                        dayVal = (intVal * 60 * 60) / parent.secondsPerDay;
                    } else {
                        //Consider it as day unit
                        dayVal = intVal;
                        unit = 'day';
                    }
                    args.fltrObj.filterByColumn(args.column.field, args.operator, dayVal);
                    textValue = this.parent.dataOperation.getDurationString(intVal, unit);
                } else {
                    args.fltrObj.filterByColumn(args.column.field, args.operator, null);
                    textValue = null;
                }
            }
        };
        return filterDurationUI;
    }

    /**
     * Remove filter menu while opening column chooser menu
     *
     * @param {ColumnMenuOpenEventArgs} args .
     * @returns {void} .
     */
    private columnMenuOpen(args: ColumnMenuOpenEventArgs): void {// eslint-disable-line
        if (this.filterMenuElement && document.body.contains(this.filterMenuElement)) {
            remove(this.filterMenuElement);
        }
        this.filterMenuElement = null;
    }
    // eslint-disable-next-line
    private actionBegin(args: FilterEventArgs): void {
        // ...
    }
    public closeFilterOnContextClick(element: Element): void {
        const datePickerElement : Element = document.querySelector('body > div.e-datepicker') as HTMLElement;
        const dateTimePickerElement : Element = document.querySelector('body > div.e-datetimepicker') as HTMLElement;
        if (this.filterMenuElement && document.body.contains(this.filterMenuElement)) {
            const ganttElement: Element = closest(element, '#' + this.parent.element.id)
                || element.querySelector('#' + this.parent.element.id);
            if ((!(this.filterMenuElement.contains(element)) && !isNullOrUndefined(ganttElement)) ||
            ((!(this.filterMenuElement.contains(element)) && !this.parent.enableAdaptiveUI) && (isNullOrUndefined(datePickerElement)) &&
            (isNullOrUndefined(dateTimePickerElement)) && ((element.nodeName === 'DIV') || (element.nodeName === 'HTML') ||
            (element.nodeName === 'SPAN') || (element.nodeName === 'BUTTON'))) && !element.classList.contains('e-dropdownbase')) {
                remove(this.filterMenuElement);
                this.parent.treeGrid.grid.notify('filter-menu-close', { isOpen: false });
                this.filterMenuElement = null;
            }
        }
    }
    private actionComplete(args: GroupEventArgs): void {
        if (!isNullOrUndefined(args['filterModel'])) {
            if (!isNullOrUndefined(args['filterModel']['dialogObj'])) {
                if (!isNullOrUndefined(args['filterModel']['dialogObj']['element'])) {
                    if (this.parent.filterSettings.type === 'Excel'){
                        this.wireEvents(args['filterModel']['dialogObj']['element'].id);
                    }
                }
            }
        }
        if (args.requestType === filterAfterOpen) {
            if (this.parent.treeGrid.filterSettings.type === 'Menu') {
                this.filterMenuElement = getValue('filterModel.dlgObj.element', args);
            }
            else {
                this.filterMenuElement = getValue('filterModel.dialogObj.element', args);
            }
            this.updateFilterMenuPosition(this.filterMenuElement, args);
            // To set default values as 'contains' in filter dialog
            const taskID: string = this.parent.taskFields.id;
            const predecessor: string = this.parent.taskFields.dependency;
            const resource: string = this.parent.taskFields.resourceInfo;
            const filterObj: object = this.parent.treeGrid.grid.filterModule;
            const filterValues: object = getValue('values', filterObj);
            if ((args.columnName === predecessor && isNullOrUndefined(getValue(predecessor, filterValues)))
                || (args.columnName === resource && isNullOrUndefined(getValue(resource, filterValues)))) {
                const element: HTMLElement = this.filterMenuElement.querySelector('.e-dropdownlist');
                let instanceObj: DropDownList;
                if (!isNullOrUndefined(element)) {
                    instanceObj = getValue('ej2_instances[0]', element);
                    instanceObj.index = 2;
                    instanceObj.dataBind();
                }
            } else if (args.columnName === taskID && isNullOrUndefined(getValue(taskID, filterValues)) && this.parent.treeGrid.filterSettings.type === 'Menu') {
                const element: HTMLElement = this.filterMenuElement.querySelector('.e-flmenu-input');
                const instanceObj: NumericTextBox = getValue('ej2_instances[0]', element);
                if (!isNullOrUndefined(instanceObj) && isNullOrUndefined(this.parent.columnByField[args.columnName].format)) {
                    instanceObj.format = 'n';
                }
            }
        }
    }

    private setPosition(li: Element, ul: HTMLElement): void {
        /* eslint-disable-next-line */
        const gridPos: any = this.parent.element.getBoundingClientRect();
        const gridPosTop: number = gridPos.top + window.scrollY;
        const gridPosLeft: number = gridPos.left;
        /* eslint-disable-next-line */
        let parentNode: any;
        let parentNodeTop: number;
        let parentNodeLeft: number;
        let paddingTop: number;
        let paddingLeft: number;
        let marginTop: number | string;
        const isValid: boolean = true;
        let marginLeft: number | string;
        let isNonBodyTag: boolean = false;
        if (!isNullOrUndefined(this.parent.element.parentNode) && this.parent.element.parentNode['tagName'] !== 'BODY') {
            isNonBodyTag = true;
            parentNode = this.parent.element.parentNode;
            const topValue: number = Math.abs(parentNode.getBoundingClientRect().top);
            parentNodeTop = topValue > window.scrollY ? topValue - window.scrollY : window.scrollY - topValue;
            marginTop = parentNode.style.marginTop;
            while (isValid) {
                if (Math.abs(gridPosTop) > Math.abs(parentNodeTop)) {
                    paddingTop = gridPosTop - parentNodeTop;
                    break;
                }
                if (!isNullOrUndefined(this.parent.element.parentNode)) {
                    if (parentNode.parentNode instanceof HTMLDocument) {
                        break;
                    }
                    parentNode = parentNode.parentNode;
                    if (parentNode.parentNode && parentNode.parentNode.style) {
                        marginTop = parentNode.parentNode.style.marginTop;
                    }
                }
                parentNodeTop = parentNode.getBoundingClientRect().top;
            }
            parentNode = this.parent.element.parentNode;
            parentNodeLeft = parentNode.getBoundingClientRect().left;
            marginLeft = parentNode.style.marginLeft;
            while (isValid) {
                if (Math.abs(gridPosLeft) > Math.abs(parentNodeLeft)) {
                    paddingLeft = gridPosLeft - parentNodeLeft;
                    break;
                }
                if (!isNullOrUndefined(this.parent.element.parentNode)) {
                    if (parentNode.parentNode instanceof HTMLDocument) {
                        break;
                    }
                    parentNode = parentNode.parentNode;
                    marginLeft = parentNode.style.marginLeft;
                }
                parentNodeLeft = parentNode.getBoundingClientRect().left;
            }
        }
        /* eslint-disable-next-line */
        const liPos: any = li.getBoundingClientRect();
        const ulPos: any = ul.getBoundingClientRect();
        let left: number = liPos.right + window.scrollX;
        let top: number = isNonBodyTag ? liPos.top - gridPosTop : liPos.top + window.scrollY;
        if (gridPos.right < (left + ul.offsetWidth)) {
            if ((liPos.left - ul.offsetWidth) > gridPos.left) {
                left = (liPos.left - ul.offsetWidth);
            } else {
                left -= (left + ul.offsetWidth) - gridPos.right;
            }
        } else {
            if ((!isNullOrUndefined(paddingTop) || !isNullOrUndefined(paddingLeft)) && isNonBodyTag) {
                left = Math.abs(liPos.right - gridPos.left);
                top = Math.abs(liPos.top - gridPos.top);
            }
        }
        if (!isNullOrUndefined(paddingTop) && !isNullOrUndefined(paddingLeft)) {
            let updatedTopValue: number = liPos.top;
            const isValid: boolean = this.hasParentWithLeftSpacing(document.getElementsByClassName('e-gantt')[0]);
            if (isValid) {
                updatedTopValue = liPos.top - this.parent.element.getBoundingClientRect().top;
            }
            let updatedLeftValue: number = liPos.width + parseInt(li.parentElement.style.left, 10);
            const updateTop: boolean = liPos.top > ulPos.top;
            if (!updateTop) {
                updatedTopValue = top;
            }
            const updateLeft: boolean = ulPos.left !== (liPos.left + liPos.width);
            if (!(updateLeft && !isValid)) {
                updatedLeftValue = left;
            }
            ul.style.top = updatedTopValue + window.scrollY + 'px';
            ul.style.left = updatedLeftValue + 'px';
        } else {
            ul.style.top = top + 'px';
            ul.style.left = left + 'px';
        }
    }

    private hasParentWithLeftSpacing(element: any): boolean {
        let current: Element = element.parentElement;
        while (current) {
            const style: CSSStyleDeclaration = window.getComputedStyle(current);
            const marginLeft: number = parseFloat(style.marginLeft);
            const paddingLeft: number = parseFloat(style.paddingLeft);
            if (paddingLeft > 0 || marginLeft > 0) {
                let currentSibling: boolean = false;
                if (current.previousElementSibling && parseInt(current.previousElementSibling['style'].width, 10) > 0) {
                    currentSibling = true;
                }
                return currentSibling;
            }
            current = current.parentElement;
        }
        return false;
    }

    private updateFilterMenuPosition(element: HTMLElement, args: GroupEventArgs): void {
        addClass([element], 'e-gantt');
        if (!this.parent.enableAdaptiveUI) {
            document.querySelector('#' + this.parent.controlId).appendChild(element);
        }
        let targetElement: HTMLElement;
        if (this.parent.showColumnMenu) {
            targetElement = document.querySelector('#treeGrid' + this.parent.controlId + '_gridcontrol_colmenu_Filter');
            if (targetElement) {
                element.style.zIndex = targetElement.parentElement.style.zIndex;
                if (this.parent.treeGrid.filterSettings.type === 'Menu') {
                    this.setPosition(targetElement, getValue('filterModel.dlgObj.element', args));
                }
                else {
                    this.setPosition(targetElement, getValue('filterModel.dialogObj.element', args));
                }
            }
        } else {
            targetElement = this.parent.treeGrid.grid.getColumnHeaderByField(args.columnName).querySelector('.e-filtermenudiv');
            if (this.parent.treeGrid.filterSettings.type === 'Menu') {
                getFilterMenuPostion(targetElement, getValue('filterModel.dlgObj', args));
            }
            else {
                getFilterMenuPostion(targetElement, getValue('filterModel.dialogObj', args));
            }
        }
        element.style.display = 'block';
        if (this.parent.treeGrid.filterSettings.type === 'Menu') {
            (element.querySelector('.e-valid-input') as HTMLElement).focus();
        }
        if (this.parent.treeGrid.filterSettings.type === 'Excel') {
            const inputElement: HTMLElement = document.querySelector('.e-searchinput') as HTMLElement;
            inputElement.focus();
        }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('actionBegin', this.actionBegin);
        this.parent.off('actionComplete', this.actionComplete);
        this.parent.off('columnMenuOpen', this.columnMenuOpen);
    }
    /**
     * This method is used to destroy the filter module. When called, it performs any necessary cleanup operations related to the filter module.
     *
     * @returns {void} .
     */
    public destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
    }
}
