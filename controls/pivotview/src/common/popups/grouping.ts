import { createElement, remove, extend, getInstance, addClass, removeClass, select } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import * as cls from '../base/css-constant';
import { GroupType, DateGroup } from '../../base/types';
import { IFieldOptions, IDataOptions, IAxisSet, IGroupSettings, ICustomGroups, IDataSet, IField } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../base/util';
import { PivotExportUtil } from '../../base/export-util';
import { DataSourceSettings } from '../../pivotview/model/datasourcesettings';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { IAction } from '../../common/base/interface';
import * as events from '../../common/base/constant';

/**
 * `Grouping` module to create grouping option for date, number and custom in popup.
 */
/** @hidden */
export class Grouping implements IAction {
    private parent: PivotView;
    private parentElement: HTMLElement;
    private groupDialog: Dialog;
    private selectedCellsInfo: SelectedCellsInfo[];
    private isUpdate: boolean;
    private dateGroup: RegExp = /_date_group_years|_date_group_quarters|_date_group_quarterYear|_date_group_months|_date_group_days|_date_group_hours|_date_group_minutes|_date_group_seconds/g;

    private handlers: {
        load: Function; /* eslint-disable-line */
    };

    /* eslint-disable-next-line */
    /**
     * Constructor for the group UI rendering.
     * @hidden
     */
    constructor(parent?: PivotView) {   /* eslint-disable-line */
        this.parent = parent;
        this.parent.groupingModule = this;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @returns {string} - string
     * @private
     */
    protected getModuleName(): string {
        return 'grouping';
    }

    private render(args: { target: HTMLElement; option: string; parentElement: HTMLElement }): void {
        let target: HTMLElement = args.target;
        let option: string = args.option;
        let parentElement: HTMLElement = args.parentElement;
        this.parentElement = parentElement;
        this.selectedCellsInfo = [];
        this.isUpdate = false;
        let colIndex: number = Number(target.getAttribute('aria-colindex'));
        let rowIndex: number = Number(target.getAttribute('index'));
        let cell: IAxisSet = (this.parent.engineModule.pivotValues[rowIndex][colIndex] as IAxisSet);
        let fieldName: string = cell.valueSort.axis.toString();
        this.selectedCellsInfo = this.getSelectedCells(cell.axis, fieldName, cell.actualText.toString());
        this.selectedCellsInfo.push({ axis: cell.axis, fieldName: fieldName, name: cell.actualText.toString(), cellInfo: cell });
        if (option.replace(parentElement.id, '').indexOf('_custom_group') !== -1) {
            this.createGroupSettings(fieldName);
        } else {
            this.updateUnGroupSettings(fieldName);
        }
    }

    /**
     * Returns the selected members/headers by checing the valid members from the pivot table.
     * @function getSelectedOptions
     * @param  {SelectedCellsInfo[]} selectedCellsInfo - Get the members name from the given selected cells information
     * @returns {string[]} - string
     * @hidden
     */
    public getSelectedOptions(selectedCellsInfo: SelectedCellsInfo[]): string[] {
        let selectedOptions: string[] = [];
        for (let option of selectedCellsInfo) {
            if (PivotUtil.inArray(option.name, selectedOptions) === -1) {
                selectedOptions.push(option.name);
            }
        }
        return selectedOptions;
    }
    private createGroupSettings(fieldName: string): void {
        let fieldList: IField = this.parent.engineModule.fieldList[fieldName];
        let group: IGroupSettings = this.getGroupSettings(fieldName);
        if (this.selectedCellsInfo.length > 0) {
            let type: string;
            let isInvalid: boolean = false;
            if (fieldList.isCustomField) {
                if (!group) {
                    let dateGroup: IGroupSettings = this.getGroupSettings(fieldName.replace(this.dateGroup, ''));
                    let customGroup: IGroupSettings = this.getGroupSettings(fieldName.replace(/_custom_group/g, ''));
                    if (dateGroup) {
                        isInvalid = false;
                        type = 'date';
                        fieldName = fieldName.replace(this.dateGroup, '');
                    } else if (customGroup) {
                        isInvalid = this.selectedCellsInfo.length === 1;
                        type = 'custom';
                    }
                } else if (group && group.type === 'Custom') {
                    if (this.selectedCellsInfo.length === 1) {
                        isInvalid = true;
                    } else {
                        isInvalid = false;
                        type = 'custom';
                    }
                } else if (group && group.type === 'Number') {
                    isInvalid = false;
                    type = 'number';
                }
            } else {
                if (group) {
                    if (group.type === 'Number' || group.type === 'Date') {
                        isInvalid = false;
                        type = group.type === 'Date' ? 'date' : 'number';
                    } else if (group.type === 'Custom') {
                        isInvalid = this.selectedCellsInfo.length === 1;
                        type = 'custom';
                    }
                } else {
                    if (fieldList.type === 'number' ||
                        (['datetime', 'date']).indexOf(fieldList.type) !== -1 || this.isDateType(fieldName)) {
                        isInvalid = false;
                        type = (this.selectedCellsInfo.length === 1 ? ((['datetime', 'date']).indexOf(fieldList.type) !== -1 ||
                            this.isDateType(fieldName)) ? 'date' : 'number' : 'custom');
                    } else if (fieldList.type === 'string') {
                        isInvalid = this.selectedCellsInfo.length === 1;
                        type = 'custom';
                    }
                }
            }
            if (isInvalid) {
                this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('warning'), this.parent.localeObj.getConstant('invalidSelection'));
                this.parent.grid.clearSelection();
            } else if (type && type !== '') {
                this.createGroupDialog(fieldName, type);
            }
        }
    }
    private updateUnGroupSettings(fieldName: string): void {
        let fieldList: IField = this.parent.engineModule.fieldList[fieldName];
        let groupFields: IGroupSettings[] = PivotUtil.cloneGroupSettings(this.parent.dataSourceSettings.groupSettings);
        let group: IGroupSettings = this.getGroupSettings(fieldName);
        if (this.selectedCellsInfo.length > 0) {
            let type: string;
            if (fieldList.isCustomField) {
                if (!group) {
                    let dateGroup: IGroupSettings = this.getGroupSettings(fieldName.replace(this.dateGroup, ''));
                    let customGroup: IGroupSettings = this.getGroupSettings(fieldName.replace(/_custom_group/g, ''));
                    if (dateGroup) {
                        type = 'date';
                        fieldName = fieldName.replace(this.dateGroup, '');
                    } else if (customGroup) {
                        type = 'custom';
                    }
                } else if (group.type === 'Custom') {
                    type = 'custom';
                }
            } else {
                if (group) {
                    if (group.type === 'Number' || group.type === 'Date') {
                        type = group.type === 'Date' ? 'date' : 'number';
                    }
                }
            }
            if (type === 'date' || type === 'number') {
                groupFields = this.validateSettings(fieldName, groupFields, type, []);
            } else if (type === 'custom') {
                let selectedOptions: string[] = this.getSelectedOptions(this.selectedCellsInfo);
                groupFields = this.validateSettings(fieldName, groupFields, type, selectedOptions);
            }
            this.updateDateSource(groupFields, type);
        }
    }

    private updateDateSource(groupFields: IGroupSettings[], type: string): void {
        if (this.isUpdate) {
            this.parent.setProperties({ dataSourceSettings: { groupSettings: groupFields } }, true);
            this.parent.updateGroupingReport(groupFields, (type === 'date' ? 'Date' : type === 'custom' ? 'Custom' : 'Number'));
            this.parent.initEngine();
        }
    }

    private removeGroupSettings(fieldName: string, selectedOptions: string[], groupFields: IGroupSettings[], groupNames: string[], type?: GroupType): IGroupSettings[] {    /* eslint-disable-line */
        let index: number = groupNames.indexOf(fieldName);
        if (index !== -1) {
            let field: IGroupSettings = groupFields[index];
            for (let j: number = 0, len: number = field.customGroups.length; j < len; j++) {
                if (field.customGroups[j]) {
                    let group: ICustomGroups = field.customGroups[j];
                    if (PivotUtil.inArray(group.groupName, selectedOptions) !== -1) {
                        groupFields = this.modifyParentGroupItems(fieldName, groupFields, [group.groupName], group.items, groupNames);
                        field.customGroups.splice(j, 1);
                        this.isUpdate = true;
                        j--;
                        len--;
                    }
                }
            }
        }
        return groupFields;
    }

    private getGroupSettings(fieldName: string): IGroupSettings {
        for (let group of this.parent.dataSourceSettings.groupSettings) {
            if (group.name === fieldName) {
                return group;
            }
        }
        return undefined;
    }

    private isDateType(fieldName: string): boolean {
        for (let format of this.parent.dataSourceSettings.formatSettings) {
            if (format.name === fieldName && format.type) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the selected members/headers by checing the valid members from the pivot table.
     * @function getSelectedCells
     * @param  {string} axis - Spicifies the axis name for the given field.
     * @param  {string} fieldName - Gets selected members for the given field name.
     * @param  {string} name - specifies the selected member name for the given field.
     * @returns {SelectedCellsInfo[]} - return type
     * @hidden
     */
    public getSelectedCells(axis: string, fieldName: string, name: string): SelectedCellsInfo[] {
        let selectedCellsInfo: SelectedCellsInfo[] = [];
        /* eslint-disable */
        let selectedElements: any = this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR);
        /* eslint-enable */
        for (let element of selectedElements) {
            let colIndex: number = Number(element.getAttribute('aria-colindex'));
            let rowIndex: number = Number(element.getAttribute('index'));
            let cell: IAxisSet = (this.parent.engineModule.pivotValues[rowIndex][colIndex] as IAxisSet);
            if (cell && (cell.axis === axis) && !(cell.type === 'grand sum' || cell.type === 'sum') &&
                cell.valueSort.axis === fieldName && name !== cell.actualText.toString()) {
                selectedCellsInfo.push({
                    axis: cell.axis,
                    fieldName: cell.valueSort.axis.toString(),
                    name: cell.actualText.toString(),
                    cellInfo: cell
                });
            }
        }
        return selectedCellsInfo;
    }

    private createGroupDialog(fieldName: string, type: string): void {
        let groupDialog: HTMLElement = createElement('div', {
            id: this.parentElement.id + '_GroupDialog',
            className: 'e-group-field-settings',
            attrs: { 'data-field': fieldName, 'data-type': type }
        });
        this.parentElement.appendChild(groupDialog);
        this.groupDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('grouping'),
            content: this.createGroupOptions(fieldName, type),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            width: 300,
            height: 'auto',
            position: { X: 'center', Y: 'center' }, /* eslint-disable-line */
            buttons: [
                {
                    click: this.updateGroupSettings.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: () => {
                        this.groupDialog.hide();
                    },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            overlayClick: () => {
                this.removeDialog();
            },
            closeOnEscape: true,
            close: this.removeDialog.bind(this),
            target: this.parentElement,
            cssClass: this.parent.cssClass
        });
        this.groupDialog.isStringTemplate = true;
        this.groupDialog.appendTo(groupDialog);
    }
    private createGroupOptions(fieldName: string, type: string): HTMLElement {
        let groupInstance: Grouping = this; /* eslint-disable-line */
        let mainDiv: HTMLElement = createElement('div', {
            className: 'e-group-field-div-content', id: this.parentElement.id + '_group_field_div_content',
            attrs: { 'data-fieldName': fieldName, 'data-type': type }
        });
        let groupWrapperDiv1: HTMLElement = createElement('div', { className: 'e-group-option-container' });
        mainDiv.appendChild(groupWrapperDiv1);
        // this.parentElement.appendChild(mainDiv);
        let dataSource: IDataOptions = this.parent.dataSourceSettings;
        let groupField: IGroupSettings = PivotUtil.getFieldByName(fieldName, dataSource.groupSettings) as IGroupSettings;
        switch (type) {
            case 'custom':
                {
                    let caption: string;
                    let dataFields: IFieldOptions[] = dataSource.rows;
                    dataFields = dataFields.concat(dataSource.columns, dataSource.values, dataSource.filters);
                    let actualField: IFieldOptions = PivotUtil.getFieldByName(fieldName.replace(/_custom_group/g, ''), dataFields) as IFieldOptions;
                    let currentField: IFieldOptions = PivotUtil.getFieldByName(fieldName, dataFields) as IFieldOptions;
                    let nextField: IFieldOptions = PivotUtil.getFieldByName(fieldName + '_custom_group', dataFields) as IFieldOptions;
                    if (currentField) {
                        let newFieldName: string = fieldName + '_custom_group';
                        caption = nextField ? nextField.caption :
                            this.parent.engineModule.fieldList[actualField.name].caption + (newFieldName.match(/_custom_group/g).length + 1);
                    }
                    let captionInputTextDiv1: HTMLElement = createElement('div', {
                        className: 'e-caption-option-text', innerHTML: this.parent.localeObj.getConstant('groupFieldCaption')
                    });
                    /* eslint-enable max-len */
                    let captionInputDiv1: HTMLElement = createElement('div', { className: 'e-group-caption-container' });
                    let captionInputField1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_caption_option',
                        className: 'e-group-caption-text',
                        attrs: { 'type': 'text' }
                    }) as HTMLInputElement;
                    captionInputDiv1.appendChild(captionInputTextDiv1);
                    captionInputDiv1.appendChild(captionInputField1);
                    groupWrapperDiv1.appendChild(captionInputDiv1);
                    let inputTextDiv1: HTMLElement = createElement('div', {
                        className: 'e-input-option-text', innerHTML: this.parent.localeObj.getConstant('groupTitle')
                    });
                    let inputDiv1: HTMLElement = createElement('div', { className: 'e-group-input-container' });
                    let inputField1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_input_option',
                        className: 'e-group-input-text',
                        attrs: { 'type': 'text' }
                    }) as HTMLInputElement;
                    inputDiv1.appendChild(inputTextDiv1);
                    inputDiv1.appendChild(inputField1);
                    groupWrapperDiv1.appendChild(inputDiv1);
                    let captionInputObj1: MaskedTextBox = new MaskedTextBox({
                        placeholder: this.parent.localeObj.getConstant('captionName'),
                        enableRtl: this.parent.enableRtl,
                        locale: this.parent.locale,
                        value: caption, width: '100%',
                        cssClass: this.parent.cssClass
                    });
                    captionInputObj1.isStringTemplate = true;
                    captionInputObj1.appendTo(captionInputField1);
                    let inputObj1: MaskedTextBox = new MaskedTextBox({
                        placeholder: this.parent.localeObj.getConstant('groupName'),
                        enableRtl: this.parent.enableRtl,
                        locale: this.parent.locale,
                        width: '100%',
                        cssClass: this.parent.cssClass
                    });
                    inputObj1.isStringTemplate = true;
                    inputObj1.appendTo(inputField1);
                }
                break;
            case 'date':
            case 'number':
                {
                    let startAtWrapper: HTMLElement = createElement('div', {
                        className: 'e-group-start-option-container'
                    });
                    let startAtOptionDiv1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_start_option',
                        className: 'e-group_start_option',
                        attrs: { 'type': 'checkbox' }
                    }) as HTMLInputElement;
                    let startAtInputField1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_start_input',
                        className: 'e-group_start_input',
                        attrs: { 'type': 'text' }
                    }) as HTMLInputElement;
                    startAtWrapper.appendChild(startAtOptionDiv1);
                    startAtWrapper.appendChild(startAtInputField1);
                    groupWrapperDiv1.appendChild(startAtWrapper);
                    let endAtWrapper: HTMLElement = createElement('div', {
                        className: 'e-group-end-option-container'
                    });
                    let endAtOptionDiv1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_end_option',
                        className: 'e-group_end_option',
                        attrs: { 'type': 'checkbox' }
                    }) as HTMLInputElement;
                    let endAtInputField1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_end_input',
                        className: 'e-group_end_input',
                        attrs: { 'type': 'text' }
                    }) as HTMLInputElement;
                    endAtWrapper.appendChild(endAtOptionDiv1);
                    endAtWrapper.appendChild(endAtInputField1);
                    groupWrapperDiv1.appendChild(endAtWrapper);
                    let intervalWrapper: HTMLElement = createElement('div', {
                        className: 'e-group-interval-option-container'
                    });
                    let intervalTextDiv1: HTMLElement = createElement('div', {
                        className: 'e-group-inerval-option-text', innerHTML: this.parent.localeObj.getConstant('groupBy')
                    });
                    let intervalInputField1: HTMLInputElement = createElement('input', {
                        id: this.parentElement.id + 'group_interval_input',
                        className: 'e-group_interval_input',
                        attrs: { 'type': 'text' }
                    }) as HTMLInputElement;
                    intervalWrapper.appendChild(intervalTextDiv1);
                    intervalWrapper.appendChild(intervalInputField1);
                    groupWrapperDiv1.appendChild(intervalWrapper);
                    let startAt: string = undefined;
                    let endAt: string = undefined;
                    if (type === 'date') {
                        let selectedGroups: string[] = [];
                        let groupData: { [key: string]: Object }[] = [  /* eslint-disable-line */
                            { value: 'Seconds', text: this.parent.localeObj.getConstant('Seconds') },
                            { value: 'Minutes', text: this.parent.localeObj.getConstant('Minutes') },
                            { value: 'Hours', text: this.parent.localeObj.getConstant('Hours') },
                            { value: 'Days', text: this.parent.localeObj.getConstant('Days') },
                            { value: 'Months', text: this.parent.localeObj.getConstant('Months') },
                            { value: 'QuarterYear', text: this.parent.localeObj.getConstant('QuarterYear') },
                            { value: 'Quarters', text: this.parent.localeObj.getConstant('Quarters') },
                            { value: 'Years', text: this.parent.localeObj.getConstant('Years') }
                        ];
                        if (groupField && groupField.type === 'Date') {
                            selectedGroups = groupField.groupInterval;
                            startAt = groupField.startingAt ? groupField.startingAt.toString() : undefined;
                            endAt = groupField.endingAt ? groupField.endingAt.toString() : undefined;
                        } else {
                            selectedGroups = ['Months'];
                        }
                        let startAtInputObj: DateTimePicker = new DateTimePicker({
                            placeholder: this.parent.localeObj.getConstant('chooseDate'),
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            format: 'dd/MM/yyyy hh:mm:ss a',
                            enabled: !(startAt === undefined),
                            width: '100%',
                            cssClass: this.parent.cssClass
                        });
                        startAtInputObj.isStringTemplate = true;
                        startAtInputObj.appendTo(startAtInputField1);
                        let endAtInputObj: DateTimePicker = new DateTimePicker({
                            placeholder: this.parent.localeObj.getConstant('chooseDate'),
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            format: 'dd/MM/yyyy hh:mm:ss a',
                            enabled: !(endAt === undefined),
                            width: '100%',
                            cssClass: this.parent.cssClass
                        });
                        endAtInputObj.isStringTemplate = true;
                        endAtInputObj.appendTo(endAtInputField1);
                        MultiSelect.Inject(CheckBoxSelection);
                        /* eslint-disable */
                        let intervalObj: MultiSelect = new MultiSelect({
                            dataSource: groupData,
                            value: selectedGroups as string[],
                            fields: { text: 'text', value: 'value' },
                            mode: 'CheckBox',
                            showDropDownIcon: true,
                            enableSelectionOrder: false,
                            placeholder: this.parent.localeObj.getConstant('selectGroup'),
                            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + this.parent.localeObj.getConstant('Months'),
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            cssClass: this.parent.cssClass,
                            select: () => {
                                groupInstance.groupDialog.element.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
                            },
                            removed: () => {
                                if ((intervalObj as any).checkBoxSelectionModule.activeLi.length === 0) {
                                    groupInstance.groupDialog.element.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                                }
                            }
                        });
                        /* eslint-enable */
                        intervalObj.isStringTemplate = true;
                        intervalObj.appendTo(intervalInputField1);
                        startAtInputObj.value = startAt === undefined ? null : new Date(startAt);
                        startAtInputObj.dataBind();
                        endAtInputObj.value = endAt === undefined ? null : new Date(endAt);
                        endAtInputObj.dataBind();
                    } else {
                        let selectedInterval: number = undefined;
                        if (groupField && groupField.type === 'Number') {
                            selectedInterval = groupField.rangeInterval;
                            startAt = groupField.startingAt ? groupField.startingAt.toString() : undefined;
                            endAt = groupField.endingAt ? groupField.endingAt.toString() : undefined;
                        } else {
                            selectedInterval = 2;
                        }
                        let startAtInputObj: NumericTextBox = new NumericTextBox({
                            placeholder: this.parent.localeObj.getConstant('enterValue'),
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            showClearButton: true,
                            format: '###',
                            value: startAt === undefined ? undefined : parseInt(startAt, 10),
                            enabled: !(startAt === undefined),
                            width: '100%',
                            cssClass: this.parent.cssClass
                        });
                        startAtInputObj.isStringTemplate = true;
                        startAtInputObj.appendTo(startAtInputField1);
                        let endAtInputObj: NumericTextBox = new NumericTextBox({
                            placeholder: this.parent.localeObj.getConstant('enterValue'),
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            showClearButton: true,
                            format: '###',
                            value: endAt === undefined ? undefined : parseInt(endAt, 10),
                            enabled: !(endAt === undefined),
                            width: '100%',
                            cssClass: this.parent.cssClass
                        });
                        endAtInputObj.isStringTemplate = true;
                        endAtInputObj.appendTo(endAtInputField1);
                        let intervalObj: NumericTextBox = new NumericTextBox({
                            placeholder: this.parent.localeObj.getConstant('enterValue'),
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            showClearButton: true,
                            format: '###',
                            min: 1,
                            value: selectedInterval,
                            width: '100%',
                            cssClass: this.parent.cssClass
                        });
                        intervalObj.isStringTemplate = true;
                        intervalObj.appendTo(intervalInputField1);
                    }
                    let startAtObj: CheckBox = new CheckBox({
                        label: this.parent.localeObj.getConstant('startAt'),
                        checked: !(startAt === undefined),
                        enableRtl: this.parent.enableRtl,
                        locale: this.parent.locale,
                        cssClass: this.parent.cssClass,
                        change: (args: ChangeEventArgs) => {
                            let startAtObj: DateTimePicker | NumericTextBox = (type === 'date' ?
                                getInstance(select('#' + this.parentElement.id + 'group_start_input'), DateTimePicker) as DateTimePicker :
                                getInstance(select('#' + this.parentElement.id + 'group_start_input'), NumericTextBox) as NumericTextBox);
                            startAtObj.enabled = args.checked;
                            startAtObj.dataBind();
                        }
                    });
                    startAtObj.isStringTemplate = true;
                    startAtObj.appendTo(startAtOptionDiv1);
                    let endAtObj: CheckBox = new CheckBox({
                        label: this.parent.localeObj.getConstant('endAt'),
                        checked: !(endAt === undefined),
                        enableRtl: this.parent.enableRtl,
                        locale: this.parent.locale,
                        cssClass: this.parent.cssClass,
                        change: (args: ChangeEventArgs) => {
                            let endAtObj: DateTimePicker | NumericTextBox = (type === 'date' ?
                                getInstance(select('#' + this.parentElement.id + 'group_end_input'), DateTimePicker) as DateTimePicker :
                                getInstance(select('#' + this.parentElement.id + 'group_end_input'), NumericTextBox) as NumericTextBox);
                            endAtObj.enabled = args.checked;
                            endAtObj.dataBind();
                        }
                    });
                    endAtObj.isStringTemplate = true;
                    endAtObj.appendTo(endAtOptionDiv1);
                }
                break;
        }
        return mainDiv;
    }
    /* eslint-disable  */
    private updateGroupSettings(): void {
        let dialogElement: HTMLElement = this.groupDialog.element;
        let groupType: string = dialogElement.getAttribute('data-type');
        let fieldName: string = dialogElement.getAttribute('data-field');
        let groupFields: IGroupSettings[] =
            PivotUtil.cloneGroupSettings(this.parent.dataSourceSettings.groupSettings);
        if (groupFields.length === 0 && !this.parent.clonedDataSet && !this.parent.clonedReport) {
            let dataSet: IDataSet[] = this.parent.engineModule.data as IDataSet[];
            this.parent.clonedDataSet = PivotUtil.getClonedData(dataSet) as IDataSet[];
            this.parent.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
            this.parent.clonedReport = extend({}, this.parent.dataSourceSettings, null, true) as DataSourceSettings;
            this.parent.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
        }
        if (groupType === 'custom') {
            let inputInstance: MaskedTextBox =
                getInstance(select('#' + this.parentElement.id + 'group_input_option'), MaskedTextBox) as MaskedTextBox;
            let captionInputInstance: MaskedTextBox =
                getInstance(select('#' + this.parentElement.id + 'group_caption_option'), MaskedTextBox) as MaskedTextBox;
            removeClass([inputInstance.element], cls.EMPTY_FIELD);
            if (inputInstance.value === null || inputInstance.value === '') {
                addClass([inputInstance.element], cls.EMPTY_FIELD);
                inputInstance.element.focus();
                return;
            }
            let selectedOptions: string[] = this.getSelectedOptions(this.selectedCellsInfo);
            let customGroup: ICustomGroups = { groupName: inputInstance.value, items: selectedOptions };
            let splicedItems: string[] = [];
            let newItems: string[] = [];
            let field: IGroupSettings = { name: fieldName, caption: captionInputInstance.value, type: 'Custom', customGroups: [] };
            let isUpdated: boolean = false;
            for (let i: number = 0, len: number = groupFields.length; i < len; i++) {
                if (groupFields[i].name === fieldName) {
                    field = groupFields[i];
                    field.caption = captionInputInstance.value;
                    for (let j: number = 0, len: number = field.customGroups.length; j < len; j++) {
                        if (field.customGroups[j]) {
                            let group: ICustomGroups = field.customGroups[j];
                            if (group.items && PivotExportUtil.isContainCommonElements(group.items, selectedOptions)) {
                                splicedItems = this.mergeArray(splicedItems, [group.groupName]);
                                newItems = this.mergeArray(newItems, group.items);
                                field.customGroups.splice(j, 1);
                                j--;
                                len--;
                            }
                        }
                    }
                    for (let item of selectedOptions) {
                        let index: number = newItems.indexOf(item);
                        if (index !== -1) {
                            newItems.splice(index, 1);
                        }
                    }
                    newItems = this.mergeArray(newItems, [customGroup.groupName]);
                    field.customGroups.push(customGroup);
                    this.isUpdate = true;
                    isUpdated = true;
                    break;
                }
            }
            if (!isUpdated) {
                field.customGroups.push(customGroup);
                this.isUpdate = true;
                groupFields.push(field);
            }
            groupFields = this.validateSettings(fieldName, groupFields, groupType, (splicedItems.length === 0 ? customGroup.items : splicedItems), newItems);
        } else if (groupType === 'date' || groupType === 'number') {
            let startCheckBoxInstance: CheckBox = getInstance(select('#' + this.parentElement.id + 'group_start_option'), CheckBox) as CheckBox;
            let endCheckBoxInstance: CheckBox = getInstance(select('#' + this.parentElement.id + 'group_end_option'), CheckBox) as CheckBox;
            let startInputInstance: DateTimePicker | NumericTextBox = (groupType === 'date' ?
                getInstance(select('#' + this.parentElement.id + 'group_start_input'), DateTimePicker) as DateTimePicker :
                getInstance(select('#' + this.parentElement.id + 'group_start_input'), NumericTextBox) as NumericTextBox);
            let endInputInstance: DateTimePicker | NumericTextBox = (groupType === 'date' ?
                getInstance(select('#' + this.parentElement.id + 'group_end_input'), DateTimePicker) as DateTimePicker :
                getInstance(select('#' + this.parentElement.id + 'group_end_input'), NumericTextBox) as NumericTextBox);
            let intervalInstance: MultiSelect | NumericTextBox = (groupType === 'date' ?
                getInstance(select('#' + this.parentElement.id + 'group_interval_input'), MultiSelect) as MultiSelect :
                getInstance(select('#' + this.parentElement.id + 'group_interval_input'), NumericTextBox) as NumericTextBox);
            let startAt: string = startCheckBoxInstance.checked ? startInputInstance.value.toString() : undefined;
            let endAt: string = endCheckBoxInstance.checked ? endInputInstance.value.toString() : undefined;
            let field: IGroupSettings = { name: fieldName, startingAt: startAt, endingAt: endAt };
            if (groupType === 'date') {
                let selectedItems: DateGroup[] = [];
                for (let list of intervalInstance.value as string[]) {
                    selectedItems.push(list as DateGroup);
                }
                field.type = 'Date';
                field.groupInterval = selectedItems;
            } else {
                field.type = 'Number';
                field.rangeInterval = (intervalInstance as NumericTextBox).value;
            }
            let isUpdated: boolean = false;
            for (let i: number = 0, len: number = groupFields.length; i < len; i++) {
                if (groupFields[i].name === fieldName) {
                    groupFields.splice(i, 1, field);
                    this.isUpdate = true;
                    isUpdated = true;
                    break;
                }
            }
            if (!isUpdated) {
                this.isUpdate = true;
                groupFields.push(field);
            }
            groupFields = this.validateSettings(fieldName, groupFields, groupType, [], []);
        }
        this.groupDialog.close();
        this.updateDateSource(groupFields, groupType);
    }
    private getGroupBasedSettings(groupFields: IGroupSettings[]): { [key: string]: IGroupSettings[] } {
        let groups: { [key: string]: IGroupSettings[] } = {};
        for (let group of groupFields) {
            if (groups[group.type]) {
                groups[group.type].push(group);
            } else {
                groups[group.type] = [group];
            }
        }
        return groups;
    }
    private getGroupByName(groupFields: IGroupSettings[]): { [key: string]: IGroupSettings[] } {
        let customFields: { [key: string]: IGroupSettings[] } = {};
        for (let field of groupFields) {
            let name: string = field.name.replace(/_custom_group/g, '');
            if (customFields[name]) {
                customFields[name].push(field);
            } else {
                customFields[name] = [field];
            }
        }
        return customFields;
    }
    private validateSettings(fieldName: string, groupFields: IGroupSettings[], groupType: string, splicedItems: string[], newItems?: string[]): IGroupSettings[] {
        let validatedSettings: IGroupSettings[] = [];
        let groups: { [key: string]: IGroupSettings[] } = this.getGroupBasedSettings(groupFields);
        let groupOrders: string[] = ['Date', 'Number', 'Custom'];
        if (groups[groupOrders[2]] && groupType === 'custom') {
            let customFields: { [key: string]: IGroupSettings[] } = this.getGroupByName(groups[groupOrders[2]]);
            if (customFields[fieldName.replace(/_custom_group/g, '')]) {
                let customGroups: IGroupSettings[] = customFields[fieldName.replace(/_custom_group/g, '')];
                let fields: string[] = customGroups.map((item: IGroupSettings, pos: number) => item.name);
                if (newItems) {
                    customGroups = this.modifyParentGroupItems(fieldName, customGroups, splicedItems, newItems, fields);
                } else {
                    customGroups = this.removeGroupSettings(fieldName.replace('_custom_group', ''), splicedItems, customGroups, fields);
                }
            }
            let orderedGroups: IGroupSettings[] = [];
            for (let field of Object.keys(customFields)) {
                let fields: string[] = customFields[field].map((item: IGroupSettings, pos: number) => item.name);
                orderedGroups = this.reOrderSettings(customFields[field], fields, orderedGroups, field);
            }
            groups[groupOrders[2]] = orderedGroups;
        } else if ((groupType === 'date' || groupType === 'number') && !newItems) {
            let groupFields: IGroupSettings[] = groupType === 'date' ? groups[groupOrders[0]] : groups[groupOrders[1]];
            if (groupType === 'date') {
                groups[groupOrders[0]] = groupFields.filter((field: IGroupSettings) => { return field.name !== fieldName; });
            } else {
                groups[groupOrders[1]] = groupFields.filter((field: IGroupSettings) => { return field.name !== fieldName; });
            }
            this.isUpdate = true;
        }
        for (let order of groupOrders) {
            if (groups[order]) {
                validatedSettings = validatedSettings.concat(groups[order]);
            }
        }
        return validatedSettings;
    }
    private reOrderSettings(customGroups: IGroupSettings[], fields: string[], orderedSettings: IGroupSettings[], fieldName: string): IGroupSettings[] {
        let index: number = fields.indexOf(fieldName);
        if (index > -1 && customGroups[index].customGroups && customGroups[index].customGroups.length > 0) {
            orderedSettings.push(customGroups[index]);
            this.reOrderSettings(customGroups, fields, orderedSettings, fieldName + '_custom_group');
        }
        return orderedSettings;
    }
    private modifyParentGroupItems(fieldName: string, groupFields: IGroupSettings[], splicedItems: string[], newItems: string[], fields: string[]): IGroupSettings[] {
        let index: number = fields.indexOf(fieldName + '_custom_group');
        if (index !== -1) {
            let field: IGroupSettings = groupFields[index];
            let selectedOptions: string[] = [];
            if (field.customGroups && field.customGroups.length > 0) {
                for (let i: number = 0, len: number = field.customGroups.length; i < len; i++) {
                    if (field.customGroups[i]) {
                        let isItemsUpdated: boolean = false;
                        let group: ICustomGroups = field.customGroups[i];
                        if (group.items) {
                            for (let item of splicedItems) {
                                let pos: number = group.items.indexOf(item);
                                if (pos !== -1) {
                                    group.items.splice(pos, 1);
                                    this.isUpdate = true;
                                    isItemsUpdated = true;
                                }
                            }
                            if (isItemsUpdated) {
                                group.items = this.mergeArray(group.items, newItems);
                            }
                        }
                    }
                }
            }
        }
        return groupFields;
    }

    private mergeArray(collection1: string[], collection2: string[]): string[] {
        let resultArray: string[] = [];
        let array: string[] = collection1.concat(collection2);
        let len: number = array.length;
        let assoc: { [key: string]: boolean } = {};
        while (len--) {
            let item: string = String(array[len]);
            if (!assoc[item]) {
                resultArray.unshift(item);
                assoc[item] = true;
            }
        }
        return resultArray;
    }

    private removeDialog(): void {
        if (this.parent.grid && this.parent.grid.isDestroyed) { return; }
        this.parent.grid.clearSelection();
        if (this.groupDialog && !this.groupDialog.isDestroyed) { this.groupDialog.destroy(); }
        if (this.parentElement && document.getElementById(this.parentElement.id + '_GroupDialog')) {
            remove(document.getElementById(this.parentElement.id + '_GroupDialog'));
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.render
        };
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initGrouping, this.handlers.load, this); //For initial rendering
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeDialog();
        this.parent.off(events.initGrouping, this.handlers.load);
    }

    /**
     * To destroy the pivot button event listener
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}

/**
 * @hidden
 */
export interface SelectedCellsInfo {
    axis: string;
    fieldName: string;
    cellInfo: IAxisSet;
    name: string;
}
