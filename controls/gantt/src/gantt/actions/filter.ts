import { TreeGrid, Filter as TreeGridFilter, FilterSettingsModel as TreeFilterSettingsModel  } from '@syncfusion/ej2-treegrid';
import { FilterEventArgs, filterAfterOpen, GroupEventArgs, getFilterMenuPostion, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { getActualProperties, IFilterMUI, Filter as GridFilter, IXLFilter } from '@syncfusion/ej2-grids';
import { Gantt } from '../base/gantt';
import { FilterSettingsModel, ColumnModel, TaskFieldsModel } from '../models/models';
import { getValue, isNullOrUndefined, remove, createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';

/** 
 * The Filter module is used to handle filter action.
 */

export class Filter {
    public parent: Gantt;
    private filterMenuElement: HTMLElement;
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
     */
    private updateCustomFilters(): void {
        let settings: TaskFieldsModel = this.parent.taskFields;
        for (let i: number = 0; i < this.parent.ganttColumns.length; i++) {
            let column: ColumnModel = this.parent.ganttColumns[i];
            if (((column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') &&
                (column.field === settings.startDate || column.field === settings.endDate
                    || column.field === settings.baselineStartDate || column.field === settings.baselineEndDate)) ||
                (column.field === settings.duration && column.editType === 'stringedit')) {
                this.initiateFiltering(this.parent.ganttColumns[i]);
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

    private initiateFiltering(column: ColumnModel): void {
        let treeColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.treeGridModule.treeGridColumns);
        column.allowFiltering = column.allowFiltering === false ? false : true;
        if (column.allowFiltering && this.parent.filterSettings.type === 'Menu' && !column.filter) {
            column.filter = { ui: this.getCustomFilterUi(column) };
        }
        if (treeColumn) {
            treeColumn.allowFiltering = column.allowFiltering;
            treeColumn.filter = column.filter;
        }
    }

    /**
     * To get filter menu UI
     * @param column 
     */
    private getCustomFilterUi(column: ColumnModel): IFilterMUI {
        let settings: TaskFieldsModel = this.parent.taskFields;
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

    private getDatePickerFilter(columnName: string): IFilterMUI {
        let parent: Gantt = this.parent;
        let timeValue: number = (columnName === parent.taskFields.startDate) || (columnName === parent.taskFields.baselineStartDate)
            ? parent.defaultStartTime : parent.defaultEndTime;
        let dropDateInstance: DatePicker;
        let filterDateUI: IFilterMUI = {
            create: (args: { target: Element, column: Object }) => {
                let flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                args.target.appendChild(flValInput);
                dropDateInstance = new DatePicker({ placeholder: this.parent.localeObj.getConstant('enterValue') });
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
        let filterDateTimeUI: IFilterMUI = {
            create: (args: { target: Element, column: Object }) => {
                let flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                args.target.appendChild(flValInput);
                dropInstance = new DateTimePicker({ placeholder: this.parent.localeObj.getConstant('enterValue') });
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
        let parent: Gantt = this.parent;
        let textBoxInstance: TextBox;
        let textValue: string = '';
        let filterDurationUI: IFilterMUI = {
            create: (args: { target: Element, column: Object }) => {
                let flValInput: HTMLElement = createElement('input', { className: 'e-input' });
                flValInput.setAttribute('placeholder', this.parent.localeObj.getConstant('enterValue'));
                args.target.appendChild(flValInput);
                textBoxInstance = new TextBox();
                textBoxInstance.appendTo(flValInput);
            },
            write: (args: {
                filteredValue: string
            }) => {
                textBoxInstance.value = args.filteredValue ? textValue : '';
            },
            read: (args: { element: HTMLInputElement, column: ColumnModel, operator: string, fltrObj: GridFilter }) => {
                let durationObj: object = this.parent.dataOperation.getDurationValue(textBoxInstance.value);
                let intVal: number = getValue('duration', durationObj);
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
     * @param args 
     */
    private columnMenuOpen(args: ColumnMenuOpenEventArgs): void {
        if (this.filterMenuElement && this.parent.element.contains(this.filterMenuElement)) {
            remove(this.filterMenuElement);
        }
        this.filterMenuElement = null;
    }
    private actionBegin(args: FilterEventArgs): void {
        // ...
    }
    private actionComplete(args: GroupEventArgs): void {
        if (args.requestType === filterAfterOpen) {
            this.filterMenuElement = getValue('filterModel.dlgObj.element', args);
            this.updateFilterMenuPosition(this.filterMenuElement, args);
            // To set default values as 'contains' in filter dialog
            let taskID: string = this.parent.taskFields.id;
            let predecessor: string = this.parent.taskFields.dependency;
            let resource: string = this.parent.taskFields.resourceInfo;
            let filterObj: object = this.parent.treeGrid.grid.filterModule;
            let filterValues: object = getValue('values', filterObj);
            if ((args.columnName === predecessor && isNullOrUndefined(getValue(predecessor, filterValues)))
                || (args.columnName === resource && isNullOrUndefined(getValue(resource, filterValues)))) {
                let element: HTMLElement = this.filterMenuElement.querySelector('.e-dropdownlist');
                let instanceObj: DropDownList = getValue('ej2_instances[0]', element);
                instanceObj.index = 2;
                instanceObj.dataBind();
            } else if (args.columnName === taskID && isNullOrUndefined(getValue(taskID, filterValues))) {
                let element: HTMLElement = this.filterMenuElement.querySelector('.e-numerictextbox');
                let instanceObj: NumericTextBox = getValue('ej2_instances[0]', element);
                if (!isNullOrUndefined(instanceObj) && isNullOrUndefined(this.parent.columnByField[args.columnName].format)) {
                    instanceObj.format = 'n';
                }
            }
        }
    }
    private setPosition(li: Element, ul: HTMLElement): void {
        let gridPos: ClientRect = this.parent.element.getBoundingClientRect();
        let liPos: ClientRect = li.getBoundingClientRect();
        let left: number = liPos.left - gridPos.left;
        let top: number = liPos.top - gridPos.top;
        if (gridPos.height < top) {
            top = top - ul.offsetHeight + liPos.height;
        } else if (gridPos.height < top + ul.offsetHeight) {
            top = gridPos.height - ul.offsetHeight;
        }
        if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
            top = window.innerHeight - ul.offsetHeight - gridPos.top;
        }
        left += (this.parent.enableRtl ? - ul.offsetWidth : liPos.width);
        if (gridPos.width <= left + ul.offsetWidth) {
            left -= liPos.width + ul.offsetWidth;
        } else if (left < 0) {
            left += ul.offsetWidth + liPos.width;
        }
        ul.style.top = top + 7 + 'px';
        ul.style.left = left + 7 + 'px';
    }

    private updateFilterMenuPosition(element: HTMLElement, args: GroupEventArgs): void {
        this.parent.element.appendChild(element);
        (element.querySelector('.e-valid-input') as HTMLElement).focus();
        let targetElement: HTMLElement;
        if (this.parent.showColumnMenu) {
            targetElement = document.querySelector('#treeGrid' + this.parent.controlId + '_gridcontrol_colmenu_Filter');
            this.setPosition(targetElement, getValue('filterModel.dlgObj.element', args));
        } else {
            targetElement = this.parent.treeGrid.grid.getColumnHeaderByField(args.columnName).querySelector('.e-filtermenudiv');
            getFilterMenuPostion(targetElement, getValue('filterModel.dlgObj', args), this.parent.treeGrid.grid as IXLFilter);
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
     * To destroy module
     */
    public destroy(): void {
        this.removeEventListener();
    }
}