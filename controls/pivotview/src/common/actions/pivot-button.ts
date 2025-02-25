import { createElement, Draggable, DragEventArgs, remove, extend, detach, isNullOrUndefined, SanitizeHtmlHelper, getInstance } from '@syncfusion/ej2-base';
import { EventHandler, MouseEventArgs, select } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, addClass, removeClass, closest, Browser } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction, PivotButtonArgs, MemberFilteringEventArgs, PivotActionInfo } from '../../common/base/interface';
import { FieldRemoveEventArgs, FieldDragStartEventArgs } from '../../common/base/interface';
import { IFieldOptions, IFilter, IField, IDataOptions, PivotEngine, IMembers, FieldItemInfo } from '../../base/engine';
import { IPivotRows, IAxisSet, INumberIndex } from '../../base/engine';
import { Button } from '@syncfusion/ej2-buttons';
import { DragAndDropEventArgs, NodeCheckEventArgs, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { ButtonPropsModel, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Operators, FilterType } from '../../base/types';
import { AggregateMenu } from '../popups/aggregate-menu';
import { AxisFieldRenderer } from '../../pivotfieldlist/renderer/axis-field-renderer';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { OlapEngine, IOlapFieldListOptions, IOlapField, ITupInfo } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';
import { AggregateTypes } from '../base/enum';

/**
 * Module to render Pivot button
 */
/** @hidden */
export class PivotButton implements IAction {
    /** @hidden */
    public parent: PivotView | PivotFieldList;
    /** @hidden */
    public parentElement: HTMLElement;
    private draggable: Draggable;
    private handlers: { load: Function };
    /** @hidden */
    public menuOption: AggregateMenu;
    /** @hidden */
    public axisField: AxisFieldRenderer;
    /** @hidden */
    public fieldName: string;
    private index: number;
    /** @hidden */
    public isDestroyed: boolean;

    /**
     * Constructor for render module.
     *
     * @param {PivotView | PivotFieldList} parent - Component instance.
     */
    constructor(parent: PivotView | PivotFieldList) {
        this.parent = parent;
        this.menuOption = new AggregateMenu(this.parent);
        this.parent.pivotButtonModule = this;
        this.addEventListener();
        if (this.parent instanceof PivotFieldList) {
            this.axisField = new AxisFieldRenderer(this.parent as PivotFieldList);
        }
        this.isDestroyed = false;
    }

    private renderPivotButton(args: PivotButtonArgs): void {
        this.parentElement = this.parent.getModuleName() === 'pivotview' ? this.parent.element :
            document.getElementById(this.parent.element.id + '_Container');
        const currentAxisElements: Element[] = Array.prototype.slice.call(this.parentElement.querySelectorAll('.e-group-' + args.axis));
        let axisElement: Element;
        if (args.axis === 'rows' && (this.parent as PivotView).showGroupingBar && (this.parent as PivotView).groupingBarModule
        && isNullOrUndefined(this.parentElement.querySelector('.' + cls.GROUP_PIVOT_ROW))) {
            currentAxisElements.push((this.parent as PivotView).groupingBarModule.rowPanel);
            axisElement = (this.parent as PivotView).groupingBarModule.rowPanel;
        }
        const field: IFieldOptions[] = extend([], args.field, null, true) as IFieldOptions[];
        const axis: string = args.axis; let valuePos: number = -1;
        const showValuesButton: boolean = (this.parent.dataType === 'pivot' ? (this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).pivotGridModule) ?
            (this.parent as PivotFieldList).pivotGridModule.showValuesButton : this.parent.showValuesButton : false);
        if (((this.parent.dataSourceSettings.valueAxis === 'row' && args.axis === 'rows') ||
            (this.parent.dataSourceSettings.valueAxis === 'column' && args.axis === 'columns')) && showValuesButton && this.parent.dataSourceSettings.values.length > 1) {
            if (isNullOrUndefined(PivotUtil.getFieldByName('[Measures]', field))) {
                const measureField: IFieldOptions = PivotUtil.getFieldByName('[Measures]', this.parent.dataSourceSettings.fieldMapping) as IFieldOptions;
                const valueField: IFieldOptions = {
                    name: '[Measures]', caption: this.parent.localeObj.getConstant('values'),
                    axis: args.axis,
                    showRemoveIcon: (measureField && 'showRemoveIcon' in measureField) ? measureField.showRemoveIcon : true,
                    allowDragAndDrop: (measureField && 'allowDragAndDrop' in measureField) ? measureField.allowDragAndDrop : true
                };
                if ((this.parent.dataSourceSettings.valueIndex === -1 || this.parent.dataSourceSettings.valueIndex > field.length)) {
                    valuePos = field.length;
                    field.push(valueField);
                    this.parent.setProperties({ dataSourceSettings: { valueIndex: -1 } }, true);
                } else {
                    valuePos = this.parent.dataSourceSettings.valueIndex;
                    field.splice(valuePos, 0, valueField);
                }
            }
        }
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parentElement = document.getElementById(this.parent.element.id + '_Container');
            if (this.parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-' + axis)) {
                const axisPrompt: Element = this.parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-' + axis)
                    .querySelector('.' + cls.AXIS_PROMPT_CLASS);
                if (field.length === 0) {
                    removeClass([axisPrompt], cls.ICON_DISABLE);
                } else {
                    addClass([axisPrompt], cls.ICON_DISABLE);
                }
                axisElement =
                    this.parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-' + axis).querySelector('.' + cls.AXIS_CONTENT_CLASS);
            } else {
                return;
            }
        } else {
            this.parentElement = this.parent.element;
            if (!isNullOrUndefined(this.parentElement.querySelector('.e-group-' + axis))) {
                axisElement = this.parentElement.querySelector('.e-group-' + axis);
            }
        }
        if (axisElement) {
            if (this.parent.getModuleName() === 'pivotview' && field.length === 0) {
                for (let i: number = 0; i < currentAxisElements.length; i++) {
                    const element: Element = currentAxisElements[i as number];
                    if (!element.classList.contains(cls.GROUP_CHART_VALUE) && !element.classList.contains(cls.GROUP_CHART_COLUMN)) {
                        const axisPrompt: HTMLElement = createElement('span', {
                            className: cls.AXIS_PROMPT_CLASS
                        });
                        axisPrompt.innerText = ((this.parent as PivotView).groupingBarSettings.allowDragAndDrop ? axis === 'rows' ? this.parent.localeObj.getConstant('rowAxisPrompt') :
                            axis === 'columns' ? this.parent.localeObj.getConstant('columnAxisPrompt') :
                                axis === 'values' ? this.parent.localeObj.getConstant('valueAxisPrompt') :
                                    axis === 'filters' ? this.parent.localeObj.getConstant('filterAxisPrompt') :
                                        this.parent.localeObj.getConstant('allFields') : '');
                        element.appendChild(axisPrompt);
                    }
                }
            } else {
                for (let i: number = 0, cnt: number = field.length; i < cnt; i++) {
                    const elements: Element[] | NodeListOf<HTMLElement> = this.parent.getModuleName() === 'pivotfieldlist' ?
                        [axisElement] : currentAxisElements;
                    for (let j: number = 0; j < elements.length; j++) {
                        const element: HTMLElement | Element = elements[j as number];
                        if ((this.parent.olapEngineModule && (this.parent.olapEngineModule.fieldList[field[i as number].name] ||
                            field[i as number].name === '[Measures]')) || this.parent.engineModule) {
                            const isMeasureAvail: boolean = (this.parent.dataType === 'olap' && (field[i as number].name.toLowerCase() === '[measures]' || axis === 'values'));
                            const isMeasureFieldsAvail: boolean = (this.parent.dataType === 'olap' && axis === 'values');
                            if (!element.classList.contains(cls.GROUP_CHART_VALUE) && !element.classList.contains(cls.GROUP_CHART_COLUMN)) {
                                const buttonWrapper: HTMLElement = createElement('div', {
                                    className: cls.PIVOT_BUTTON_WRAPPER_CLASS + (i === 0 && axis !== 'all-fields' ? ' e-first-btn' : '') + ((this.parent as PivotView).isTabular ? (' ' + cls.TABULAR_PIVOT_BUTTON) : ''),
                                    attrs: { 'data-tag': axis + ':' + field[i as number].name }
                                });
                                if ((this.parent as PivotView).isTabular) {
                                    buttonWrapper.style.width = 'auto';
                                }
                                let buttonCaption: string = field[i as number].caption ? field[i as number].caption :
                                    field[i as number].name;
                                buttonCaption = this.parent.enableHtmlSanitizer ?
                                    SanitizeHtmlHelper.sanitize(buttonCaption) : buttonCaption;
                                const buttonElement: HTMLElement = createElement('div', {
                                    id: this.parent.element.id + '_' + field[i as number].name, className: cls.PIVOT_BUTTON_CLASS + ' ' + field[i as number].name.replace(/[^A-Z0-9]/ig, '') + ((this.parent as PivotView).isTabular ? (' ' +  cls.TABULAR_ROW_BUTTON) : ''),
                                    attrs: {
                                        'data-uid': field[i as number].name,
                                        'tabindex': (this.parent.getModuleName() === 'pivotview' && (this.parent as PivotView).grid && axis === 'rows' && !element.classList.contains(cls.GROUP_CHART_ROW)) ? '-1' : '0',
                                        'isvalue': (i === valuePos || isMeasureAvail && !isMeasureFieldsAvail) ? 'true' : 'false',
                                        'aria-disabled': 'false', 'aria-label': buttonCaption,
                                        'data-type': (this.parent.dataType === 'olap' ? isMeasureFieldsAvail ? 'isMeasureFieldsAvail' : isMeasureAvail ? 'isMeasureAvail' : field[i as number].type : field[i as number].type),
                                        'data-caption': buttonCaption,
                                        'data-basefield': this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(field[i as number].baseField) : field[i as number].baseField,
                                        'data-baseitem': this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(field[i as number].baseItem) : field[i as number].baseItem,
                                        'role': 'button'
                                    }
                                });
                                const dropIndicatorElement: Element = createElement('span', {
                                    attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                                    className: cls.DROP_INDICATOR_CLASS
                                });
                                const dropLastIndicatorElement: Element = createElement('span', {
                                    attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                                    className: cls.DROP_INDICATOR_CLASS + '-last'
                                });
                                const dragWrapper: HTMLElement = this.createButtonDragIcon(field[i as number], buttonElement);
                                const contentElement: HTMLElement = this.createButtonText(field, i, axis, valuePos);
                                buttonElement.appendChild(contentElement);
                                if (axis !== 'all-fields') {
                                    if (!isMeasureAvail && !field[i as number].isNamedSet && !field[i as number].isCalculatedField) {
                                        if (['filters', 'values'].indexOf(axis) === -1 && valuePos !== i &&
                                            !(this.parent.dataType === 'olap' && ((this.parent.getModuleName() === 'pivotview' &&
                                                (this.parent as PivotView).enableVirtualization) || (this.parent.getModuleName() === 'pivotfieldlist' &&
                                                    (this.parent as PivotFieldList).pivotGridModule !== undefined &&
                                                    (this.parent as PivotFieldList).pivotGridModule.enableVirtualization)))) {
                                            this.createSortOption(buttonElement, field[i as number].name, field[i as number]);
                                        }
                                        if (axis !== 'values' && valuePos !== i) {
                                            this.createFilterOption(buttonElement, field[i as number].name, axis, field[i as number]);
                                        }
                                        if (axis === 'values') {
                                            this.getTypeStatus(field, i, buttonElement);
                                        }
                                    }
                                    if ((field[i as number].isCalculatedField || field[i as number].type === 'CalculatedField')) {
                                        const calcElement: Element = createElement('span', {
                                            attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('editCalculatedField') },
                                            className: cls.ICON + ' ' + cls.CALC_EDIT
                                        });
                                        if (this.parent.allowCalculatedField && this.parent.calculatedFieldModule &&
                                            (field[i as number].showEditIcon || field[i as number].showEditIcon === undefined)) {
                                            removeClass([calcElement], cls.ICON_DISABLE);
                                        } else {
                                            addClass([calcElement], cls.ICON_DISABLE);
                                        }
                                        buttonElement.appendChild(calcElement);
                                    }
                                    const removeElement: Element = createElement('span', {
                                        attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('remove') },
                                        className: cls.ICON + ' ' + cls.REMOVE_CLASS
                                    });
                                    if (this.parent.getModuleName() === 'pivotview') {
                                        if (((this.parent as PivotView).groupingBarSettings.showRemoveIcon &&
                                            (field[i as number].showRemoveIcon || field[i as number].showRemoveIcon === undefined))) {
                                            removeClass([removeElement], cls.ICON_DISABLE);
                                        } else {
                                            addClass([removeElement], cls.ICON_DISABLE);
                                        }
                                    } else {
                                        if (field[i as number].showRemoveIcon || field[i as number].showRemoveIcon === undefined) {
                                            removeClass([removeElement], cls.ICON_DISABLE);
                                        } else {
                                            addClass([removeElement], cls.ICON_DISABLE);
                                        }
                                    }
                                    buttonElement.appendChild(removeElement);
                                    buttonWrapper.appendChild(dropIndicatorElement);
                                    buttonWrapper.appendChild(buttonElement);
                                    buttonWrapper.appendChild(dropLastIndicatorElement);
                                } else {
                                    buttonWrapper.appendChild(dropIndicatorElement);
                                    buttonWrapper.appendChild(buttonElement);
                                }
                                element.appendChild(buttonWrapper);
                                const pivotButton: Button = new Button({
                                    enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                                    enableHtmlSanitizer: this.parent.enableHtmlSanitizer, cssClass: this.parent.cssClass
                                });
                                pivotButton.isStringTemplate = true;
                                pivotButton.appendTo(buttonElement);
                                this.unWireEvent(buttonWrapper, i === valuePos && axis !== 'all-fields' ? 'values' : axis, isMeasureAvail);
                                this.wireEvent(buttonWrapper, i === valuePos && axis !== 'all-fields' ? 'values' : axis, isMeasureAvail);
                                if ((this.parent.getModuleName() === 'pivotview' && !this.parent.isAdaptive) ||
                                    this.parent.getModuleName() === 'pivotfieldlist') {
                                    this.createDraggable(field[i as number], this.parent.getModuleName() === 'pivotview' ? contentElement : dragWrapper);
                                    (getInstance(buttonElement.querySelector('.' + cls.BUTTON_DRAGGABLE) as HTMLElement,
                                                 Draggable) as Draggable).enableAutoScroll = false;
                                }
                            }
                        }
                    }
                }
                if (axis === 'values') {
                    let valueFiedDropDownList: DropDownList = select('.' + cls.GROUP_CHART_VALUE_DROPDOWN_DIV, this.parentElement) ?
                        getInstance(select('.' + cls.GROUP_CHART_VALUE_DROPDOWN_DIV, this.parentElement), DropDownList) as DropDownList : null;
                    for (let i: number = 0; i < currentAxisElements.length; i++) {
                        const element: Element = currentAxisElements[i as number];
                        if (element.classList.contains(cls.GROUP_CHART_VALUE) && (this.parent as PivotView).pivotChartModule) {
                            const valueData: { text: string, value: string }[] = field.map((item: IFieldOptions) => {
                                return { text: item.caption ? item.caption : item.name, value: item.name };
                            });
                            const parent: PivotView = this.parent as PivotView;
                            if (valueFiedDropDownList && element.querySelector('.' + cls.GROUP_CHART_VALUE_DROPDOWN_DIV)) {
                                valueFiedDropDownList.dataSource = valueData;
                                valueFiedDropDownList.value = !parent.chartSettings.enableMultipleAxis ?
                                    parent.pivotChartModule.currentMeasure : valueData[0].value;
                            } else {
                                const ddlDiv: HTMLElement = createElement('div', { className: cls.GROUP_CHART_VALUE_DROPDOWN_DIV });
                                element.appendChild(ddlDiv);
                                valueFiedDropDownList = new DropDownList({
                                    dataSource: valueData,
                                    enableRtl: this.parent.enableRtl,
                                    locale: this.parent.locale,
                                    value: !parent.chartSettings.enableMultipleAxis ?
                                        parent.pivotChartModule.currentMeasure : valueData[0].value,
                                    width: 200,
                                    fields: { value: 'value', text: 'text' },
                                    cssClass: cls.GROUP_CHART_VALUE_DROPDOWN + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                                    change: (args: ChangeEventArgs) => {
                                        if (args.e && args.e !== null) {
                                            parent.chartSettings.value = args.value as string;
                                        }
                                    }
                                });
                                valueFiedDropDownList.isStringTemplate = true;
                                valueFiedDropDownList.appendTo(ddlDiv);
                            }
                        }
                    }
                }
                else if (axis === 'columns') {
                    let availColindex: number = undefined;
                    let columnFieldDropDownList: DropDownList = select('.' + cls.GROUP_CHART_COLUMN_DROPDOWN_DIV, this.parentElement) ?
                        getInstance(select('.' + cls.GROUP_CHART_COLUMN_DROPDOWN_DIV, this.parentElement), DropDownList) as DropDownList : null;
                    for (let i: number = 0; i < currentAxisElements.length; i++) {
                        const element: Element = currentAxisElements[i as number];
                        if (element.classList.contains(cls.GROUP_CHART_COLUMN) && (this.parent as PivotView).pivotChartModule) {
                            const currentMeasure: string = (this.parent as PivotView).pivotChartModule.currentMeasure;
                            const delimiter: string = (this.parent as PivotView).chartSettings.columnDelimiter ? (this.parent as PivotView).chartSettings.columnDelimiter : '-';
                            const columnHeader: string = ((this.parent as PivotView).chartSettings.columnHeader && (this.parent as PivotView).chartSettings.columnHeader !== '') ?
                                (this.parent as PivotView).chartSettings.columnHeader.split(delimiter).join(' - ') : '';
                            const engineModule: PivotEngine | OlapEngine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
                            const pivotValues: IAxisSet[][] = engineModule.pivotValues;
                            const totColIndex: INumberIndex = (this.parent as PivotView).pivotChartModule.getColumnTotalIndex(pivotValues);
                            const rKeys: string[] = Object.keys(pivotValues);
                            const columnData: {
                                text: string, value: string, title: {
                                    [key: string]: string;
                                }
                            }[] = [];
                            let firstValueRow: boolean = false;
                            for (const rKey of rKeys) {
                                if (firstValueRow) {
                                    break;
                                }
                                const rowIndex: number = Number(rKey);
                                if (pivotValues[rowIndex as number][0] && (pivotValues[rowIndex as number][0] as IAxisSet).axis === 'row' &&
                                    (this.parent.dataSourceSettings.rows.length === 0 ? true : (pivotValues[rowIndex as number][0] as IAxisSet).type !== 'grand sum')) {
                                    const firstRowCell: IAxisSet = pivotValues[rowIndex as number][0] as IAxisSet;
                                    const tupInfo: ITupInfo = this.parent.dataType === 'olap' ?
                                        (engineModule as OlapEngine).tupRowInfo[firstRowCell.ordinal] : undefined;
                                    const rows: IPivotRows = pivotValues[rowIndex as number];
                                    const cKeys: string[] = Object.keys(rows);
                                    for (const cKey of cKeys) {
                                        const cellIndex: number = Number(cKey);
                                        const cell: IAxisSet = pivotValues[rowIndex as number][cellIndex as number] as IAxisSet;
                                        const actualText: string | number = (this.parent.dataType === 'olap' && tupInfo && tupInfo.measureName) ?
                                            tupInfo.measureName : cell.actualText;
                                        if (!totColIndex[cell.colIndex] && cell.axis === 'value' && firstRowCell.type !== 'header' &&
                                            actualText !== '' && actualText === currentMeasure) {
                                            firstValueRow = true;
                                            const columnSeries: string = this.parent.dataType === 'olap' ? cell.columnHeaders.toString().split(/~~|::/).join(' - ')
                                                : cell.columnHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - ');
                                            columnData.push({ value: columnSeries, text: columnSeries, title: { ['title']: columnSeries } });
                                            if (columnSeries === columnHeader) {
                                                availColindex = columnData.length;
                                            }
                                        }
                                    }
                                }
                            }
                            if (columnFieldDropDownList && element.querySelector('.' + cls.GROUP_CHART_COLUMN_DROPDOWN_DIV)) {
                                columnFieldDropDownList.dataSource = columnData;
                                if (availColindex !== undefined) {
                                    columnFieldDropDownList.value = columnData[availColindex - 1].value;
                                } else {
                                    columnFieldDropDownList.value = columnData[0].value;
                                }
                            } else {
                                const ddlDiv: HTMLElement = createElement('div', { className: cls.GROUP_CHART_COLUMN_DROPDOWN_DIV });
                                element.appendChild(ddlDiv);
                                columnFieldDropDownList = new DropDownList({
                                    dataSource: columnData,
                                    enableRtl: this.parent.enableRtl,
                                    locale: this.parent.locale,
                                    value: availColindex ? columnData[availColindex - 1].value : (columnData[0] ? columnData[0].value : ''),
                                    width: '200',
                                    fields: { value: 'value', text: 'text', htmlAttributes: 'title' },
                                    cssClass: cls.GROUP_CHART_COLUMN_DROPDOWN + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                                    change: (args: ChangeEventArgs) => {
                                        if (args.e && args.e !== null) {
                                            const delimiter: string = (this.parent as PivotView).chartSettings.columnDelimiter ? (this.parent as PivotView).chartSettings.columnDelimiter : '-';
                                            (this.parent as PivotView).chartSettings.columnHeader = (args.value as string).split(' - ').join(delimiter);
                                        }
                                    }
                                });
                                columnFieldDropDownList.isStringTemplate = true;
                                columnFieldDropDownList.appendTo(ddlDiv);
                            }
                        }
                    }
                }
            }
        } else {
            return;
        }
    }

    private createButtonText(field: IFieldOptions[], i: number, axis: string, valuePos: number): HTMLElement {
        let aggregation: string;
        let filterMem: string;
        if (axis === 'filters') {
            filterMem = this.updateButtontext(field[i as number].name);
        }
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        if (engineModule.fieldList && engineModule.fieldList[field[i as number].name] !== undefined) {
            aggregation = engineModule.fieldList[field[i as number].name].aggregateType;
            if ((aggregation !== 'DistinctCount') && (engineModule.fieldList[field[i as number].name].type !== 'number' || engineModule.fieldList[field[i as number].name].type === 'include' ||
                engineModule.fieldList[field[i as number].name].type === 'exclude')) {
                aggregation = 'Count';
            } else {
                aggregation = aggregation === undefined ? 'Sum' :
                    engineModule.fieldList[field[i as number].name].aggregateType;
            }
        }
        let text: string = field[i as number].caption ? field[i as number].caption : field[i as number].name;
        text = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(text) : text;
        const buttonText: HTMLElement = createElement('span', {
            attrs: {
                title: axis === 'filters' ? (this.parent.dataType === 'olap' && engineModule.fieldList[field[i as number].name].type === 'CalculatedField') ?
                    text : (text + ' (' + filterMem + ')') : (this.parent.dataType === 'olap' ?
                    text : (((!this.parent.dataSourceSettings.showAggregationOnValueField || axis !== 'values' || aggregation === 'CalculatedField') ?
                        text : this.parent.localeObj.getConstant(aggregation) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + text))),
                'tabindex': '-1', 'aria-disabled': 'false', 'oncontextmenu': 'return false;',
                'data-type': valuePos === i ? '' : aggregation
            },
            className: cls.PIVOT_BUTTON_CONTENT_CLASS + ' ' +
                (this.parent.getModuleName() === 'pivotview' ?
                    (this.parent as PivotView).groupingBarSettings.allowDragAndDrop && (field[i as number].allowDragAndDrop || field[i as number].allowDragAndDrop === undefined) ? '' : cls.DRAG_DISABLE_CLASS : '')
        });
        buttonText.innerText = axis === 'filters' ? (this.parent.dataType === 'olap' && engineModule.fieldList[field[i as number].name].type === 'CalculatedField') ?
            text : (text + ' (' + filterMem + ')') : (this.parent.dataType === 'olap' ?
            text : (!this.parent.dataSourceSettings.showAggregationOnValueField || axis !== 'values' || aggregation === 'CalculatedField' ?
                text : this.parent.localeObj.getConstant(aggregation) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + text));
        return buttonText;
    }
    private getTypeStatus(field: IFieldOptions[], i: number, buttonElement: HTMLElement): void {
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        if (engineModule.fieldList)
        {
            const fieldListItem: IField = engineModule.fieldList[field[i as number].name];
            if (fieldListItem && fieldListItem.aggregateType !== 'CalculatedField' && this.validateDropdown(fieldListItem.type)) {
                this.createSummaryType(buttonElement, field[i as number].name, field[i as number]);
            }
        }
    }
    private validateDropdown(type: string): boolean {
        const aggregateType: AggregateTypes[] = this.parent.aggregateTypes;
        if (type !== 'number') {
            return (aggregateType.indexOf('Count') > -1 || aggregateType.indexOf('DistinctCount') > -1);
        } else {
            for (let i: number = 0; i < aggregateType.length; i++) {
                if (this.parent.getAllSummaryType().indexOf(aggregateType[i as number]) > -1) {
                    return true;
                }
            }
            return false;
        }
    }

    private createSummaryType(pivotButton: HTMLElement, fieldName: string, field: IFieldOptions): Element {
        const spanElement: Element = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('format') },
            className: cls.ICON + ' ' + cls.AXISFIELD_ICON_CLASS
        });
        if (this.parent.getModuleName() === 'pivotview') {
            if ((this.parent as PivotView).groupingBarSettings.showValueTypeIcon && field.showValueTypeIcon) {
                removeClass([spanElement], cls.ICON_DISABLE);
            } else {
                addClass([spanElement], cls.ICON_DISABLE);
            }
        } else {
            if (field.showValueTypeIcon) {
                removeClass([spanElement], cls.ICON_DISABLE);
            } else {
                addClass([spanElement], cls.ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    private createMenuOption(args: MouseEventArgs): void {
        this.menuOption.render(args, this.parentElement);
        this.parent.pivotButtonModule = this;
    }

    private openCalculatedFieldDialog(args: MouseEventArgs): void {
        const fieldName: string = (args.target as HTMLElement).parentElement.getAttribute('data-uid');
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(fieldName, this.parent);
        this.parent.actionObj.actionName = events.editCalculatedField;
        this.parent.actionObj.fieldInfo = fieldInfo;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        try {
            if (this.parent.getModuleName() === 'pivotview') {
                if (this.parent.isAdaptive && ((this.parent as PivotView).showFieldList &&
                    (this.parent as PivotView).pivotFieldListModule &&
                    !(this.parent as PivotView).pivotFieldListModule.isDestroyed)) {
                    ((this.parent as PivotView).pivotFieldListModule.element
                        .querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).click();
                    (this.parent as PivotView).pivotFieldListModule.dialogRenderer.adaptiveElement.select(4);
                    ((this.parent as PivotView).pivotFieldListModule.calculatedFieldModule).updateAdaptiveCalculatedField(true, fieldName);
                } else {
                    if (!this.parent.isAdaptive) {
                        (this.parent as PivotView).calculatedFieldModule.buttonCall = true;
                    }
                    this.parent.notify(events.initCalculatedField, { edit: true, fieldName: fieldName });
                }
            } else if (this.parent.getModuleName() === 'pivotfieldlist') {
                if (this.parent.isAdaptive) {
                    (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.select(4);
                    ((this.parent as PivotView).calculatedFieldModule).updateAdaptiveCalculatedField(true, fieldName);
                    (this.parent as PivotView).calculatedFieldModule.buttonCall = true;
                } else {
                    if ((this.parent as PivotFieldList).dialogRenderer.fieldListDialog) {
                        (this.parent as PivotFieldList).dialogRenderer.fieldListDialog.hide();
                        addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
                    }
                    this.parent.notify(events.initCalculatedField, { edit: true, fieldName: fieldName });
                    if ((this.parent as PivotFieldList).calculatedFieldModule) {
                        (this.parent as PivotFieldList).calculatedFieldModule.buttonCall = true;
                    }
                }
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private createDraggable(field: IFieldOptions, target: HTMLElement): void {
        this.draggable = new Draggable(target, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this),
            dragStart: this.onDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onDragStop.bind(this),
            abort: (this.parent.getModuleName() === 'pivotview' ?
                !((this.parent as PivotView).groupingBarSettings.allowDragAndDrop && field.allowDragAndDrop) ?
                    '.' + cls.PIVOT_BUTTON_CLASS : '' : !field.allowDragAndDrop ? '.' + cls.PIVOT_BUTTON_CLASS : '')
        });
    }
    private createButtonDragIcon(field: IFieldOptions, pivotButton: HTMLElement): HTMLElement {
        const dragWrapper: HTMLElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' }
        });
        const dragElement: HTMLElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('drag')
            },
            className: cls.ICON + ' ' + cls.DRAG_CLASS + ' ' + ((field.allowDragAndDrop || field.allowDragAndDrop === undefined) ? '' : cls.DRAG_DISABLE_CLASS)
        });
        dragWrapper.appendChild(dragElement);
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            pivotButton.appendChild(dragWrapper);
        }
        return dragWrapper;
    }
    private createSortOption(pivotButton: HTMLElement, fieldName: string, field: IFieldOptions): Element {
        let sortCLass: string;
        let spanElement: Element;
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        if ((this.parent as PivotFieldList).isDeferLayoutUpdate === false || ((this.parent as PivotFieldList).pivotGridModule &&
            (this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate === false)) {
            sortCLass = engineModule.fieldList[fieldName as string].sort === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
        } else {
            sortCLass = '';
            for (let i: number = 0; i < this.parent.dataSourceSettings.sortSettings.length; i++) {
                if (this.parent.dataSourceSettings.sortSettings[i as number].name === fieldName) {
                    sortCLass = this.parent.dataSourceSettings.sortSettings[i as number].order === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
                }
            }
        }
        if (engineModule.fieldList && engineModule.fieldList[fieldName as string].sort === 'None') {
            spanElement = createElement('span', {
                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('sort') },
                className: cls.ICON
            });
        } else {
            spanElement = createElement('span', {
                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('sort') },
                className: cls.ICON + ' ' + cls.SORT_CLASS + ' ' + sortCLass
            });
        }
        if (this.parent.dataSourceSettings.enableSorting) {
            if (this.parent.getModuleName() === 'pivotview') {
                if (field.showSortIcon && (this.parent as PivotView).groupingBarSettings.showSortIcon) {
                    removeClass([spanElement], cls.ICON_DISABLE);
                } else {
                    addClass([spanElement], cls.ICON_DISABLE);
                }
            } else {
                if (field.showSortIcon) {
                    removeClass([spanElement], cls.ICON_DISABLE);
                } else {
                    addClass([spanElement], cls.ICON_DISABLE);
                }
            }
        } else {
            addClass([spanElement], cls.ICON_DISABLE);
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    private createFilterOption(pivotButton: HTMLElement, fieldName: string, axis: string, field: IFieldOptions): Element {
        let filterCLass: string;
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        const filterField: IFieldOptions =
            PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.filterSettings) as IFieldOptions;
        if ((this.parent as PivotFieldList).isDeferLayoutUpdate === false || ((this.parent as PivotFieldList).pivotGridModule &&
            (this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate === false)) {
            engineModule.fieldList[fieldName as string].filter = engineModule.fieldList[fieldName as string].filter === null ?
                [] : engineModule.fieldList[fieldName as string].filter;
            filterCLass = ((this.parent.dataSourceSettings.mode === 'Server' && !filterField) ||
            (this.parent.dataSourceSettings.mode === 'Local' && engineModule.fieldList[fieldName as string].filter.length === 0)) ?
                !engineModule.fieldList[fieldName as string].isExcelFilter ? cls.FILTER_CLASS : cls.FILTERED_CLASS : cls.FILTERED_CLASS;
        } else {
            filterCLass = cls.FILTER_CLASS;
            for (let i: number = 0; i < this.parent.dataSourceSettings.filterSettings.length; i++) {
                if (this.parent.dataSourceSettings.filterSettings[i as number].name === fieldName) {
                    filterCLass = cls.FILTERED_CLASS;
                }
            }
        }
        const spanElement: Element = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('filter')
            },
            className: cls.FILTER_COMMON_CLASS + ' ' + cls.ICON + ' ' + filterCLass
        });
        if ((((this.parent.dataSourceSettings.allowLabelFilter || this.parent.dataSourceSettings.allowValueFilter) &&
            axis !== 'filters') || this.parent.dataSourceSettings.allowMemberFilter)) {
            removeClass([spanElement], cls.ICON_DISABLE);
        } else {
            addClass([spanElement], cls.ICON_DISABLE);
        }
        if (this.parent.getModuleName() === 'pivotview') {
            if ((((this.parent.dataSourceSettings.allowLabelFilter || this.parent.dataSourceSettings.allowValueFilter) &&
                axis !== 'filters') || this.parent.dataSourceSettings.allowMemberFilter) &&
                (this.parent as PivotView).groupingBarSettings.showFilterIcon && field.showFilterIcon) {
                removeClass([spanElement], cls.ICON_DISABLE);
            } else {
                addClass([spanElement], cls.ICON_DISABLE);
            }
        } else {
            if (field.showFilterIcon && (((this.parent.dataSourceSettings.allowLabelFilter ||
                this.parent.dataSourceSettings.allowValueFilter) && axis !== 'filters') ||
                this.parent.dataSourceSettings.allowMemberFilter)) {
                removeClass([spanElement], cls.ICON_DISABLE);
            } else {
                addClass([spanElement], cls.ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    // To update button text
    private updateButtontext(fieldName: string): string {
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        const filterCount: number = engineModule.fieldList[fieldName as string].filter.length;
        const filterType: string = engineModule.fieldList[fieldName as string].filterType;
        const memLen: number = engineModule.fieldList[fieldName as string].dateMember.length;
        let filterMem: string;
        const firstNode: string = engineModule.fieldList[fieldName as string].filter[0];
        if (this.parent.dataType === 'olap') {
            filterMem = this.updateOlapButtonText(engineModule as OlapEngine, fieldName, firstNode, filterCount);
        } else if (filterType === 'include') {
            if (filterCount === 1) {
                filterMem = firstNode;
            } else if (filterCount > 1) {
                if (filterCount === memLen) {
                    filterMem = this.parent.localeObj.getConstant('all');
                } else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            }
        } else if (filterType === 'exclude') {
            if (filterCount === 1) {
                if (memLen === 2) {
                    if (firstNode !== engineModule.fieldList[fieldName as string].dateMember[0].actualText) {
                        filterMem = firstNode;
                    } else {
                        filterMem = engineModule.fieldList[fieldName as string].dateMember[0].actualText as string;
                    }
                } else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            } else if (filterCount > 1) {
                let j: number;
                const allNodes: string[] = Object.keys(engineModule.fieldList[fieldName as string].members);
                const filteredItems: string[] = engineModule.fieldList[fieldName as string].filter;
                if (filterCount === (allNodes.length - 1)) {
                    for (j = 0; j < allNodes.length; j++) {
                        const test: string = allNodes[j as number];
                        const x: number = filteredItems.indexOf(test);
                        if (x === -1) {
                            filterMem = allNodes[j as number];
                            break;
                        }
                    }
                } else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            }
        } else {
            filterMem = this.parent.localeObj.getConstant('all');
        }
        return filterMem;
    }
    private updateOlapButtonText(engineModule: OlapEngine, fieldName: string, firstNode: string, filterCount: number): string {
        let filterMem: string;
        const filterItems: string[] = engineModule.fieldList[fieldName as string].actualFilter;
        if (filterItems.length > 0) {
            const cMembers: IMembers = engineModule.fieldList[fieldName as string].members;
            const actualFilterItems: string[] = [];
            if (engineModule.fieldList[fieldName as string].filterMembers.length > 0) {
                let dummyfilterItems: { [key: string]: string } = {};
                for (const item of filterItems) {
                    dummyfilterItems[item as string] = item;
                    if (cMembers[item as string]) {
                        dummyfilterItems = this.parent.pivotCommon.eventBase.getParentNode(fieldName, item, dummyfilterItems);
                    }
                }
                const updatedFilterItems: string[] = dummyfilterItems ? Object.keys(dummyfilterItems) : [];
                for (const item of updatedFilterItems) {
                    if (cMembers[item as string].isSelected) {
                        if (!(cMembers[item as string].parent && cMembers[cMembers[item as string].parent].isSelected)) {
                            actualFilterItems.push(item);
                        }
                    }
                }
                firstNode = actualFilterItems.length === 1 ? cMembers[actualFilterItems[0]].caption : firstNode;
            }
            filterCount = actualFilterItems.length === 0 ? filterCount : actualFilterItems.length;
        }
        if (filterCount === 0) {
            filterMem = (engineModule.fieldList[fieldName as string].allMember ?
                engineModule.fieldList[fieldName as string].allMember : this.parent.localeObj.getConstant('all'));
        } else if (filterCount === 1) {
            filterMem = firstNode;
        } else if (filterCount > 1) {
            filterMem = this.parent.localeObj.getConstant('multipleItems');
        }
        return filterMem;
    }
    private createDragClone(args: DragEventArgs): HTMLElement {
        const element: Element = closest(args.element, '.' + cls.PIVOT_BUTTON_CLASS);
        const cloneElement: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: cls.DRAG_CLONE_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '')
        });
        const contentElement: HTMLElement = createElement('span', {
            className: cls.TEXT_CONTENT_CLASS
        });
        contentElement.innerText = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(element.textContent) : element.textContent;
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    }
    private onDragStart(e: DragEventArgs): void {
        const element: Element = closest(e.element, '.' + cls.PIVOT_BUTTON_CLASS);
        const dragItem: HTMLElement = document.getElementById(this.parent.element.id + '_DragClone');
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(element.getAttribute('data-uid'), this.parent);
        const dragEventArgs: FieldDragStartEventArgs = {
            fieldName: fieldInfo.fieldName,
            fieldItem: fieldInfo.fieldItem,
            axis: fieldInfo.axis,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            cancel: false
        };
        const control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.fieldDragStart, dragEventArgs, (observedArgs: FieldDragStartEventArgs) => {
            if (!observedArgs.cancel) {
                this.parent.isDragging = true;
                let engineModule: PivotEngine | OlapEngine;
                if (this.parent.dataType === 'olap') {
                    engineModule = this.parent.olapEngineModule;
                } else {
                    engineModule = this.parent.engineModule;
                }
                const data: IField = engineModule.fieldList[element.getAttribute('data-uid')];
                const axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
                addClass([element], cls.SELECTED_NODE_CLASS);
                if (dragItem && (this.parent.getModuleName() === 'pivotfieldlist' &&
                    (this.parent as PivotFieldList).renderMode) === 'Popup') {
                    const fieldListPopup: PivotFieldList = (this.parent as PivotFieldList);
                    dragItem.style.zIndex = (fieldListPopup.dialogRenderer.fieldListDialog.zIndex + 1).toString();
                }
                if (data && data.aggregateType === 'CalculatedField') {
                    for (const axisContent of axis) {
                        addClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                        const pivotButtons: NodeListOf<HTMLElement> = this.parentElement.querySelector('.' + axisContent).querySelectorAll('.e-pivot-button');
                        pivotButtons.forEach((button: HTMLElement) => {
                            button.style.cursor = 'no-drop';
                        });
                    }
                }
            } else {
                this.parent.isDragging = false;
                this.draggable.intDestroy(e.event);
                detach(dragItem);
            }
        });

    }
    private onDragging(e: DragEventArgs): void {
        this.draggable.setProperties({ cursorAt: { top: (!isNOU(e.event.targetTouches) || Browser.isDevice) ? 60 : -20 } });
    }
    private onDragStop(args: DragEventArgs & DragAndDropEventArgs): void {
        this.parent.isDragging = false;
        if (args.target && args.element && (closest(args.element, '.' + cls.GROUP_ALL_FIELDS_CLASS) &&
            !closest(args.target, '.' + cls.DROPPABLE_CLASS))) {
            args.cancel = true;
        }
        const element: Element = closest(args.element, '.' + cls.PIVOT_BUTTON_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS)), cls.SELECTED_NODE_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
        const axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (const axisContent of axis) {
            removeClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
            const pivotButtons: NodeListOf<HTMLElement> = this.parentElement.querySelector('.' + axisContent).querySelectorAll('.e-pivot-button');
            pivotButtons.forEach((button: HTMLElement) => {
                button.style.cursor = 'default';
            });
        }
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        if (document.getElementById(this.parent.element.id + '_DragClone')) {
            remove(document.getElementById(this.parent.element.id + '_DragClone'));
        }
        document.body.style.cursor = 'auto';
        if (!this.isButtonDropped(args.target, element as HTMLElement) || args.cancel) {
            return;
        }
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            ((this.parent as PivotFieldList).pivotGridModule ? (this.parent as PivotFieldList).pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, element.getAttribute('data-uid'))) {
            this.updateDataSource();
            const thisObj: PivotButton = this as PivotButton;
            thisObj.parent.axisFieldModule.render();
        }
    }
    private isButtonDropped(dropTarget: HTMLElement, target: HTMLElement): boolean {
        const axisPanel: HTMLElement = closest(target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        const droppableElement: HTMLElement = closest(dropTarget, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        let isDropped: boolean = true;
        if (axisPanel && axisPanel === droppableElement) {
            const pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            const droppableTarget: HTMLElement = closest(dropTarget, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
            let sourcePosition: number;
            let droppedPosition: number = -1;
            for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i as number].id === target.id) {
                    sourcePosition = i;
                }
                if (droppableTarget) {
                    const droppableButton: HTMLElement = droppableTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
                    if (pivotButtons[i as number].id === droppableButton.id) {
                        droppedPosition = i;
                    }
                }
            }
            if (sourcePosition === droppedPosition || (sourcePosition === (pivotButtons.length - 1) && droppedPosition === -1)) {
                removeClass([].slice.call(this.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
                isDropped = false;
            }
        }
        return isDropped;
    }
    private updateSorting(args: MouseEventArgs): void {
        const buttonElement: Element = closest((args.target as HTMLElement), '.' + cls.PIVOT_BUTTON_CLASS);
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo((buttonElement ? buttonElement.getAttribute('data-uid') : ''), this.parent);
        if (!((args.target as HTMLElement).classList.contains(cls.FILTER_COMMON_CLASS)) &&
            !((args.target as HTMLElement).classList.contains(cls.REMOVE_CLASS)) &&
            !((args.target as HTMLElement).classList.contains(cls.DRAG_CLASS)) &&
            (buttonElement && fieldInfo.fieldItem && (fieldInfo.fieldItem.showSortIcon ||
                isNullOrUndefined(fieldInfo.fieldItem.showSortIcon)) && !fieldInfo.fieldItem.isCalculatedField)) {
            this.parent.actionObj.actionName = events.sortField;
            this.parent.actionObj.fieldInfo = fieldInfo;
            if (this.parent.actionBeginMethod()) {
                return;
            }
            try {
                if ((this.parent instanceof PivotFieldList || (this.parent as PivotView).groupingBarSettings.showSortIcon) &&
                    this.parent.dataSourceSettings.enableSorting &&
                    !(this.parent.dataType === 'olap' && ((this.parent.getModuleName() === 'pivotfieldlist' &&
                        (this.parent as PivotFieldList).pivotGridModule !== undefined &&
                        (this.parent as PivotFieldList).pivotGridModule.enableVirtualization) ||
                        (this.parent.getModuleName() === 'pivotview' && (this.parent as PivotView).enableVirtualization)))) {
                    this.parent.pivotCommon.eventBase.updateSorting(args);
                    if ((this.parent as PivotFieldList).staticPivotGridModule) {
                        (this.parent as PivotFieldList).staticPivotGridModule.actionObj = this.parent.actionObj;
                    }
                    if ((this.parent as PivotFieldList).isDeferLayoutUpdate === false || ((this.parent as PivotFieldList).pivotGridModule
                        && (this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate === false) ||
                        this.parent.getModuleName() !== 'pivotfieldlist') {
                        const actionInfo: PivotActionInfo = {
                            sortInfo: this.parent.lastSortInfo
                        };
                        this.parent.actionObj.actionInfo = actionInfo;
                        this.updateDataSource(true);
                    }
                    const thisObj: PivotButton = this as PivotButton;
                    if (thisObj.parent instanceof PivotFieldList) {
                        thisObj.axisField.render();
                        if ((this.parent as PivotFieldList).isPopupView && (this.parent as PivotFieldList).pivotGridModule) {
                            (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
                        } else if ((this.parent as PivotFieldList).staticPivotGridModule) {
                            (this.parent as PivotFieldList).staticPivotGridModule.notify(events.uiUpdate, this);
                        }
                    }
                }
            } catch (execption) {
                this.parent.actionFailureMethod(execption);
            }
        }
    }
    /**
     *
     * @param {boolean} isRefreshGrid - It contains isRefreshGrid
     * @returns {void}
     * @hidden */
    public updateDataSource(isRefreshGrid?: boolean): void {
        if ((this.parent as PivotFieldList).isDeferLayoutUpdate === false || ((this.parent as PivotFieldList).pivotGridModule
            && (this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate === false) ||
            this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshGrid);
        } else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).isPopupView && (this.parent as PivotFieldList).pivotGridModule) {
                if (this.parent.dataType === 'olap') {
                    (this.parent as PivotFieldList).pivotGridModule.olapEngineModule = (this.parent as PivotFieldList).olapEngineModule;
                } else {
                    (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
                }
                (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
                (this.parent as PivotFieldList).pivotGridModule.setProperties({
                    dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties as IDataOptions
                }, true);
            } else {
                (this.parent as PivotFieldList).triggerPopulateEvent();
            }
        }
    }
    private updateFiltering(args: MouseEventArgs): void {
        const pivotObj: PivotView | PivotFieldList = (this.parent as PivotFieldList).pivotGridModule ?
            (this.parent as PivotFieldList).pivotGridModule : this.parent;
        const fieldName: string = (args.target as HTMLElement).parentElement.getAttribute('data-uid');
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(fieldName, this.parent);
        this.parent.actionObj.actionName = events.filterField;
        this.parent.actionObj.fieldInfo = fieldInfo;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        try {
            if (pivotObj.getModuleName() === 'pivotfieldlist') {
                showSpinner(pivotObj.fieldListSpinnerElement as HTMLElement);
            } else {
                (pivotObj as PivotView).showWaitingPopup();
            }
            (pivotObj as PivotView).mouseEventArgs = args;
            pivotObj.filterTargetID = this.parent.pivotCommon.moduleName !== 'pivotfieldlist' ?
                this.parent.element : document.getElementById(this.parent.pivotCommon.parentID + '_Container');
            if (pivotObj.dataSourceSettings.mode === 'Server') {
                if (this.parent.engineModule.fieldList[fieldName as string].members &&
                    Object.keys(this.parent.engineModule.fieldList[fieldName as string].members).length > 0) {
                    this.updateFilterEvents();
                } else {
                    this.parent.getEngine('fetchFieldMembers', null, null, null, null, null, fieldName);
                }
            } else {
                if (pivotObj.dataType === 'pivot' &&  !this.parent.engineModule.fieldList[fieldName as string].isMembersFilled) {
                    this.parent.engineModule.fetchFieldMembers(fieldName);
                }
                this.updateFilterEvents();
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }
    /**
     *
     * @returns {void}
     * @hidden */
    public updateFilterEvents(): void {
        const pivotObj: PivotView | PivotFieldList = (this.parent as PivotFieldList).pivotGridModule ?
            (this.parent as PivotFieldList).pivotGridModule : this.parent;
        this.parent.pivotCommon.eventBase.updateFiltering((pivotObj as PivotView).mouseEventArgs);
        const target: HTMLElement = (pivotObj as PivotView).mouseEventArgs.target as HTMLElement;
        this.fieldName = target.parentElement.getAttribute('data-uid');
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.bindDialogEvents();
        }
        if (pivotObj.getModuleName() === 'pivotfieldlist') {
            hideSpinner(pivotObj.fieldListSpinnerElement as HTMLElement);
        } else {
            (pivotObj as PivotView).hideWaitingPopup();
        }
    }
    private bindDialogEvents(): void {
        if (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter && this.parent.pivotCommon.filterDialog.tabObj) {
            this.index = this.parent.pivotCommon.filterDialog.tabObj.selectedItem;
            this.updateDialogButtonEvents();
            this.parent.pivotCommon.filterDialog.dialogPopUp.buttons = this.buttonModel();
            this.parent.pivotCommon.filterDialog.dialogPopUp.dataBind();
            this.parent.pivotCommon.filterDialog.tabObj.selected = this.tabSelect.bind(this);
        } else if (this.parent.dataSourceSettings.allowMemberFilter) {
            this.index = 0;
            this.updateDialogButtonEvents();
        }
    }
    private buttonModel(): ButtonPropsModel[] {
        return [
            {
                isFlat: false,
                buttonModel: {
                    cssClass: 'e-clear-filter-button' + (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter ? '' : ' ' + cls.ICON_DISABLE) + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    iconCss: 'e-icons e-clear-filter-icon', enableRtl: this.parent.enableRtl,
                    content: this.parent.localeObj.getConstant('clearFilter'), disabled: (this.parent.pivotCommon.filterDialog.filterObject ? false : true)
                },
                click: this.ClearFilter.bind(this)
            },
            {
                isFlat: false,
                buttonModel: {
                    cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                },
                click: (this.index === 0 ? this.updateFilterState.bind(this, this.fieldName) : this.updateCustomFilter.bind(this))
            },
            {
                isFlat: false,
                click: this.parent.pivotCommon.filterDialog.closeFilterDialog.bind(this.parent.pivotCommon.filterDialog),
                buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
            }];
    }
    private tabSelect(e: SelectEventArgs): void {
        this.index = e.selectedIndex;
        this.updateDialogButtonEvents();
        removeClass([].slice.call(this.parent.pivotCommon.filterDialog.dialogPopUp.element.querySelectorAll('.e-selected-tab')), 'e-selected-tab');
        if (e.selectedIndex > 0) {
            addClass([this.parent.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (e.selectedIndex === 1 && this.parent.dataSourceSettings.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
        }
        if (e.selectedIndex === 0) {
            this.parent.pivotCommon.filterDialog.updateCheckedState();
        } else {
            this.parent.pivotCommon.filterDialog.dialogPopUp.buttons[0].buttonModel.disabled = false;
            this.parent.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
        }
    }
    private updateDialogButtonEvents(): void {
        this.parent.pivotCommon.filterDialog.dialogPopUp.buttons = this.buttonModel();
        this.parent.pivotCommon.filterDialog.dialogPopUp.dataBind();
    }
    private updateCustomFilter(): void {
        const dialogElement: HTMLElement =
            this.parent.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-selected-tab') as HTMLElement;
        const fieldName: string = dialogElement.getAttribute('data-fieldname');
        const levelName: string = dialogElement.getAttribute('data-selectedField');
        const filterType: string = dialogElement.getAttribute('data-type');
        const measure: string = dialogElement.getAttribute('data-measure');
        const operator: string = dialogElement.getAttribute('data-operator');
        const operand1: string = dialogElement.getAttribute('data-value1');
        const operand2: string = dialogElement.getAttribute('data-value2');
        const type: FilterType = ((filterType === 'value') ? 'Value' : (filterType === 'date') ? 'Date' :
            (filterType === 'number') ? 'Number' : 'Label');
        let filterItem: IFilter = {
            name: fieldName,
            type: type,
            measure: measure,
            condition: operator as Operators,
            value1: filterType === 'date' ? new Date(operand1) : operand1 as string,
            value2: filterType === 'date' ? new Date(operand2) : operand2 as string
        };
        let filterObject: IFilter;
        if (this.parent.dataType === 'olap') {
            filterItem.selectedField = levelName;
            this.removeDataSourceSettings(fieldName, levelName, type);
            const filterItems: IFilter[] = this.parent.dataSourceSettings.filterSettings;
            for (const item of filterItems) {
                if (item.name === fieldName && item.selectedField === levelName) {
                    filterObject = item;
                }
            }
        } else {
            filterObject = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        }
        if ((isNOU(operand1) || operand1 === '') ||
            (['Between', 'NotBetween'].indexOf(operator) > -1 && (isNOU(operand2) || operand2 === ''))) {
            const inputElementString: string =
                (type.toLowerCase() + ((isNOU(operand1) || operand1 === '') ? '_input_option_1' : '_input_option_2'));
            const focusElement: HTMLElement = select('#' + this.parent.element.id + '_' + inputElementString, dialogElement);
            addClass([focusElement], cls.EMPTY_FIELD);
            focusElement.focus();
            return;
        }
        const filterEventArgs: MemberFilteringEventArgs = {
            cancel: false,
            filterSettings: filterItem,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings)
        };
        const control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.memberFiltering, filterEventArgs, (observedArgs: MemberFilteringEventArgs) => {
            if (!observedArgs.cancel) {
                filterItem = observedArgs.filterSettings;
                if (filterObject) {
                    // this.removeDataSourceSettings(fieldName);
                    filterObject = (<{ [key: string]: Object }>filterObject).properties ?
                        (<{ [key: string]: Object }>filterObject).properties : filterObject;
                    filterObject.type = filterItem.type;
                    filterObject.measure = filterItem.measure;
                    filterObject.condition = filterItem.condition as Operators;
                    filterObject.value1 = filterItem.value1;
                    filterObject.value2 = filterItem.value2;
                    if (this.parent.dataType === 'olap') {
                        filterObject.selectedField = filterItem.selectedField;
                    }
                } else {
                    this.parent.dataSourceSettings.filterSettings.push(filterItem);
                }
            }
            if (type !== 'Value') {
                this.parent.lastFilterInfo = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
                this.parent.lastFilterInfo = (<{ [key: string]: Object }>this.parent.lastFilterInfo).properties ?
                    (<{ [key: string]: Object }>this.parent.lastFilterInfo).properties : this.parent.lastFilterInfo;
            }
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
            if (!observedArgs.cancel) {
                this.refreshPivotButtonState(fieldName, true);
                this.updateDataSource(true);
            }
        });
    }
    private ClearFilter(): void {
        const dialogElement: HTMLElement = this.parent.pivotCommon.filterDialog.dialogPopUp.element;
        const fieldName: string = dialogElement.getAttribute('data-fieldname');
        const tabElement: HTMLElement = dialogElement.querySelector('.e-selected-tab') as HTMLElement;
        this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        if (this.parent.dataType === 'olap' && tabElement) {
            const levelName: string = tabElement.getAttribute('data-selectedField');
            this.removeDataSourceSettings(fieldName, levelName);
        } else {
            this.removeDataSourceSettings(fieldName);
        }
        const filterObject: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        this.refreshPivotButtonState(fieldName, filterObject ? true : false);
        this.updateDataSource(true);
    }
    private removeButton(args: Event): void {
        const target: HTMLElement = args.target as HTMLElement;
        const fieldName: string = target.parentElement.getAttribute('data-uid');
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(fieldName, this.parent);
        this.parent.actionObj.actionName = events.removeField;
        this.parent.actionObj.fieldInfo = fieldInfo;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        const removeFieldArgs: FieldRemoveEventArgs = {
            cancel: false, fieldName: fieldName,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis
        };
        try {
            const control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
                (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
            control.trigger(events.fieldRemove, removeFieldArgs, (observedArgs: FieldRemoveEventArgs) => {
                if (!observedArgs.cancel) {
                    if (target.parentElement.getAttribute('isvalue') === 'true') {
                        this.parent.setProperties({ dataSourceSettings: { values: [] } }, true);
                        if (this.parent.dataType === 'olap') {
                            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[Measures]');
                        }
                    } else {
                        this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(fieldName);
                        if (this.parent.dataType === 'pivot' && this.parent.showValuesButton && this.parent.dataSourceSettings.values.length > 1 &&
                            fieldInfo.position < this.parent.dataSourceSettings.valueIndex && ((this.parent.dataSourceSettings.valueAxis === 'row' &&
                                observedArgs.axis === 'rows') || (this.parent.dataSourceSettings.valueAxis === 'column' && observedArgs.axis === 'columns'))) {
                            this.parent.setProperties({
                                dataSourceSettings: { valueIndex: this.parent.dataSourceSettings.valueIndex - 1 }
                            }, true);
                        }
                        if (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.values.length === 0) {
                            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[Measures]');
                        }
                    }
                    if (this.parent.getModuleName() === 'pivotfieldlist') {
                        this.parent.axisFieldModule.render();
                    }
                    this.updateDataSource();
                }
            });
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }
    /**
     *
     * @param {NodeCheckEventArgs} args - It contains args value.
     * @returns {void}
     * @hidden */
    public nodeStateModified(args: NodeCheckEventArgs): void {
        const target: Element = closest(args.node as Element, 'li');
        const fieldName: string = target.getAttribute('data-fieldname');
        if (target.getAttribute('data-memberId') === 'all') {
            this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = null;
            if (args.action === 'check') {
                this.parent.pivotCommon.filterDialog.memberTreeView.checkAll();
            } else {
                this.parent.pivotCommon.filterDialog.memberTreeView.uncheckAll();
            }
            if (this.parent.dataType === 'olap' && this.parent.olapEngineModule &&
                !this.parent.olapEngineModule.fieldList[fieldName as string].isHierarchy) {
                this.updateNodeStates(this.parent.pivotCommon.filterDialog.memberTreeView.getAllCheckedNodes(), fieldName);
            }
            this.checkedStateAll(args.action);
            this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        } else {
            if (this.parent.dataType === 'olap' && this.parent.olapEngineModule &&
                !this.parent.olapEngineModule.fieldList[fieldName as string].isHierarchy) {
                // let st1: number = new Date().getTime();
                const checkedNodes: string[] = this.parent.pivotCommon.filterDialog.memberTreeView.getAllCheckedNodes();
                // let st2: number = (new Date().getTime() - st1) / 1000;
                // console.log('getAllCheckedNodes:' + st2);
                this.updateNodeStates(checkedNodes, fieldName);
            }
            const pos: number = this.parent.pivotCommon.currentTreeItemsPos[target.getAttribute('data-memberId')].index;
            if (this.parent.pivotCommon.currentTreeItems[pos as number]) {
                this.parent.pivotCommon.currentTreeItems[pos as number].isSelected = args.action === 'check';
                this.parent.pivotCommon.currentTreeItemsPos[target.getAttribute('data-memberId')].isSelected = args.action === 'check';
            }
        }
        this.parent.pivotCommon.filterDialog.updateCheckedState();
    }
    private checkedStateAll(state: string): void {
        const searchItemObj: { [key: string]: string } = {};
        for (const item of this.parent.pivotCommon.searchTreeItems) {
            item.isSelected = state === 'check';
            searchItemObj[(item.htmlAttributes as { [key: string]: string })['data-memberId']] = (item.htmlAttributes as { [key: string]: string })['data-memberId'];
        }
        for (const item of this.parent.pivotCommon.currentTreeItems) {
            if (searchItemObj[(item.htmlAttributes as { [key: string]: string })['data-memberId']] !== undefined) {
                item.isSelected = state === 'check';
                this.parent.pivotCommon.currentTreeItemsPos[(item.htmlAttributes as { [key: string]: string })['data-memberId']].isSelected = state === 'check';
            }
        }
    }
    private updateNodeStates(checkedNodes: string[], fieldName: string): void {
        const fieldList: IOlapField =
            (this.parent.pivotCommon.engineModule.fieldList as IOlapFieldListOptions)[fieldName as string];
        const currentMembers: IMembers = fieldList.members;
        const searchMembers: IMembers = fieldList.currrentMembers;
        if (fieldList.searchMembers.length > 0) {
            const members: string[] = Object.keys(searchMembers);
            for (const member of members) {
                if (searchMembers[member as string]) {
                    searchMembers[member as string].isSelected = false;
                }
                if (currentMembers[member as string]) {
                    currentMembers[member as string].isSelected = false;
                    if (this.parent.pivotCommon.filterDialog.memberTreeView.element.querySelector('li[data-memberId="' + member + '"]')) {
                        const element: HTMLElement = this.parent.pivotCommon.filterDialog.memberTreeView.element.querySelector('li[data-memberId="' + member + '"]');
                        if (element && !element.querySelector('ul')) {
                            this.parent.pivotCommon.eventBase.updateChildNodeStates(fieldList.filterMembers, fieldName, member, false);
                        }
                    }
                }
            }
            for (const node of checkedNodes) {
                if (currentMembers[node as string]) {
                    if (this.parent.pivotCommon.filterDialog.memberTreeView.element.querySelector('li[data-memberId="' + node + '"]')) {
                        const element: HTMLElement = this.parent.pivotCommon.filterDialog.memberTreeView.element.querySelector('li[data-memberId="' + node + '"]');
                        if (element && !element.querySelector('ul')) {
                            currentMembers[node as string].isSelected = true;
                            this.parent.pivotCommon.eventBase.updateChildNodeStates(fieldList.filterMembers, fieldName, node, true);
                        }
                    }
                }
                if (searchMembers[node as string]) {
                    searchMembers[node as string].isSelected = true;
                }
            }
        } else {
            const members: string[] = Object.keys(currentMembers);
            for (const member of members) {
                if (currentMembers[member as string].isSelected) {
                    currentMembers[member as string].isSelected = false;
                }
            }
            for (const node of checkedNodes) {
                if (currentMembers[node as string]) {
                    currentMembers[node as string].isSelected = true;
                    this.parent.pivotCommon.eventBase.updateChildNodeStates(fieldList.filterMembers, fieldName, node, true);
                }
            }
        }
    }
    private updateFilterState(fieldName: string): void {
        let isNodeUnChecked: boolean = false;
        let filterItem: IFilter = { items: [], name: fieldName, type: 'Include' };
        const engineModule: PivotEngine | OlapEngine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        if (this.parent.dataType === 'olap' && engineModule &&
            !(engineModule.fieldList[fieldName as string] as IOlapField).isHierarchy) {
            const cMembers: IMembers = engineModule.fieldList[fieldName as string].members;
            const sMembers: IMembers = (engineModule as OlapEngine).fieldList[fieldName as string].currrentMembers;
            filterItem.items = this.parent.pivotCommon.filterDialog.memberTreeView.getAllCheckedNodes();
            filterItem.levelCount = (engineModule.fieldList[fieldName as string] as IOlapField).levelCount;
            isNodeUnChecked = (filterItem.items.length ===
                (this.parent.pivotCommon.filterDialog.memberTreeView.fields.dataSource as { [key: string]: object }[]).length ?
                false : true);
            if ((engineModule as OlapEngine).fieldList[fieldName as string].searchMembers.length > 0 && !isNodeUnChecked) {
                const cNodeLength: number = Object.keys(cMembers).length;
                const sNodeLength: number = Object.keys(sMembers).length;
                isNodeUnChecked = cNodeLength === sNodeLength && cNodeLength === filterItem.items.length ? false : true;
            }
            const filterItems: string[] = filterItem.items;
            for (const node of filterItems) {
                if ((engineModule as OlapEngine).fieldList[fieldName as string].searchMembers.length > 0 && sMembers[node as string]) {
                    sMembers[node as string].isSelected = true;
                } else if (cMembers[node as string]) {
                    cMembers[node as string].isSelected = true;
                }
            }
        } else {
            for (const item of this.parent.pivotCommon.searchTreeItems) {
                if (item.isSelected) {
                    if (this.parent.pivotCommon.isDateField) {
                        filterItem.items.push(this.parent.dataSourceSettings.mode === 'Server' ? item.actualText as string : item.name as string);
                    } else {
                        filterItem.items.push((item.htmlAttributes as { [key: string]: string })['data-memberId'] as string);
                    }
                }
            }
            isNodeUnChecked = (filterItem.items.length === this.parent.pivotCommon.currentTreeItems.length ?
                false : true);
        }
        if (this.parent.dataType === 'olap') {
            this.removeDataSourceSettings(fieldName);
        }
        if (this.parent.allowDeferLayoutUpdate) {
            engineModule.fieldList[filterItem.name].filterType = filterItem.type.toLowerCase();
            engineModule.fieldList[filterItem.name].filter = [];
            for (let i: number = 0; i < filterItem.items.length; i++) {
                engineModule.fieldList[filterItem.name].filter.push(filterItem.items[i as number] as string);
            }
        }
        const filterEventArgs: MemberFilteringEventArgs = {
            filterSettings: filterItem,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            cancel: false
        };
        const control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.memberFiltering, filterEventArgs, (observedArgs: MemberFilteringEventArgs) => {
            filterItem = observedArgs.filterSettings;
            if (!observedArgs.cancel) {
                const filterObject: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
                if (filterObject) {
                    for (let i: number = 0; i < this.parent.dataSourceSettings.filterSettings.length; i++) {
                        if (this.parent.dataSourceSettings.filterSettings[i as number].name === fieldName) {
                            this.parent.dataSourceSettings.filterSettings.splice(i, 1);
                            break;
                        }
                    }
                }
                this.parent.dataSourceSettings.filterSettings.push(filterItem);
            }
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
            if (!observedArgs.cancel) {
                this.refreshPivotButtonState(fieldName, isNodeUnChecked);
                if (!isNodeUnChecked) {
                    this.removeDataSourceSettings(fieldName);
                    filterItem = {};
                }
                this.parent.lastFilterInfo = filterItem;
                const actionInfo: PivotActionInfo = {
                    filterInfo: this.parent.lastFilterInfo
                };
                this.parent.actionObj.actionInfo = actionInfo;
                this.updateDataSource(true);
                const thisObj: PivotButton = this as PivotButton;
                //setTimeout(() => {
                if (thisObj.parent instanceof PivotFieldList) {
                    thisObj.axisField.render();
                }
                //});
            }
            const pivotButtons: HTMLElement[] = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
            for (const item of pivotButtons) {
                if (item.getAttribute('data-uid') === fieldName) {
                    item.focus();
                    break;
                }
            }
        });
    }
    private refreshPivotButtonState(fieldName: string, isFiltered: boolean): void {
        const pivotButtons: HTMLElement[] = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
        let selectedButton: HTMLElement;
        for (const item of pivotButtons) {
            if (item.getAttribute('data-uid') === fieldName) {
                selectedButton = item.querySelector('.' + cls.FILTER_COMMON_CLASS) as HTMLElement;
                break;
            }
        }
        if (selectedButton) {
            if (isFiltered) {
                removeClass([selectedButton], cls.FILTER_CLASS);
                addClass([selectedButton], cls.FILTERED_CLASS);
            } else {
                removeClass([selectedButton], cls.FILTERED_CLASS);
                addClass([selectedButton], cls.FILTER_CLASS);
            }
        }
    }
    private removeDataSourceSettings(fieldName: string, selectedField?: string, type?: string): void {
        const filterSettings: IFilter[] = this.parent.dataSourceSettings.filterSettings;
        for (let len: number = 0, lnt: number = filterSettings.length; len < lnt; len++) {
            if (this.parent.dataType === 'olap' && selectedField) {
                if (!type && filterSettings[len as number].name === fieldName &&
                    filterSettings[len as number].selectedField === selectedField) {
                    filterSettings.splice(len, 1);
                    break;
                } else if (type) {
                    if (filterSettings[len as number].type !== type &&
                        filterSettings[len as number].name === fieldName) {
                        filterSettings.splice(len, 1);
                        lnt--;
                        len--;
                    }
                }
            } else {
                if (filterSettings[len as number].name === fieldName) {
                    filterSettings.splice(len, 1);
                    if (this.parent.dataType !== 'olap') {
                        break;
                    }
                    lnt--;
                    len--;
                }
            }
        }
    }
    private updateDropIndicator(e: MouseEvent): void {
        if (this.parent.isDragging) {
            removeClass(
                [].slice.call(this.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            if (closest((e.target as HTMLElement), '.' + cls.DROPPABLE_CLASS)) {
                const element: HTMLElement = closest((e.target as HTMLElement), '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
                addClass([element.querySelector('.' + cls.DROP_INDICATOR_CLASS)], cls.INDICATOR_HOVER_CLASS);
            }
        }
    }
    private wireEvent(element: Element, axis: string, isMeasureAvail: boolean): void {
        EventHandler.add(element, 'mouseover', this.updateDropIndicator, this);
        if (!isMeasureAvail) {
            if (['filters', 'values'].indexOf(axis) === -1 && element.querySelector('.' + cls.PIVOT_BUTTON_CLASS) !== null) {
                EventHandler.add(element.querySelector('.' + cls.PIVOT_BUTTON_CLASS), 'click', this.updateSorting, this);
            }
            if (axis !== 'values' && element.querySelector('.' + cls.FILTER_COMMON_CLASS) !== null) {
                EventHandler.add(element.querySelector('.' + cls.FILTER_COMMON_CLASS), 'click', this.updateFiltering, this);
            }
            if (axis === 'values' && element.querySelector('.' + cls.AXISFIELD_ICON_CLASS) !== null) {
                EventHandler.add(element.querySelector('.' + cls.AXISFIELD_ICON_CLASS), 'click', this.createMenuOption, this);
            }
        }
        if (element.querySelector('.' + cls.CALC_EDIT) !== null) {
            EventHandler.add(element.querySelector('.' + cls.CALC_EDIT), 'click', this.openCalculatedFieldDialog, this);
        }
        if (element.querySelector('.' + cls.REMOVE_CLASS) !== null) {
            EventHandler.add(element.querySelector('.' + cls.REMOVE_CLASS), 'click', this.removeButton, this);
        }
    }
    private unWireEvent(element: Element, axis: string, isMeasureAvail: boolean): void {
        EventHandler.remove(element, 'mouseover', this.updateDropIndicator);
        if (!isMeasureAvail) {
            if (['filters', 'values'].indexOf(axis) === -1 && element.querySelector('.' + cls.PIVOT_BUTTON_CLASS) !== null) {
                EventHandler.remove(element.querySelector('.' + cls.PIVOT_BUTTON_CLASS), 'click', this.updateSorting);
            }
            if (axis !== 'values' && element.querySelector('.' + cls.FILTER_COMMON_CLASS) !== null) {
                EventHandler.remove(element.querySelector('.' + cls.FILTER_COMMON_CLASS), 'click', this.updateFiltering);
            }
            if (axis === 'values' && element.querySelector('.' + cls.AXISFIELD_ICON_CLASS) !== null) {
                EventHandler.remove(element.querySelector('.' + cls.AXISFIELD_ICON_CLASS), 'click', this.createMenuOption);
            }
        }
        if (element.querySelector('.' + cls.CALC_EDIT) !== null) {
            EventHandler.remove(element.querySelector('.' + cls.CALC_EDIT), 'click', this.openCalculatedFieldDialog);
        }
        if (element.querySelector('.' + cls.REMOVE_CLASS) !== null) {
            EventHandler.remove(element.querySelector('.' + cls.REMOVE_CLASS), 'click', this.removeButton);
        }
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.renderPivotButton
        };
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.pivotButtonUpdate, this.handlers.load, this);
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.pivotButtonUpdate, this.handlers.load);
    }

    /**
     * To destroy the pivot button event listener
     *
     * @returns {void}
     * @hidden
     */

    public destroy(): void {
        if (this.menuOption) {
            this.menuOption.destroy();
            this.menuOption = null;
        }
        let element: HTMLElement = select('.' + cls.GROUP_CHART_VALUE_DROPDOWN_DIV, this.parentElement);
        const valueFiedDropDownList: DropDownList = element ? getInstance(element, DropDownList) as DropDownList : null;
        if (valueFiedDropDownList && !valueFiedDropDownList.isDestroyed) {
            valueFiedDropDownList.destroy();
        }
        element = select('.' + cls.GROUP_CHART_COLUMN_DROPDOWN_DIV, this.parentElement);
        let columnFieldDropDownList: DropDownList = element ? getInstance(element, DropDownList) as DropDownList : null;
        if (columnFieldDropDownList && !columnFieldDropDownList.isDestroyed) {
            columnFieldDropDownList.destroy();
            columnFieldDropDownList = null;
        }
        if (this.draggable && !this.draggable.isDestroyed) {
            this.draggable.destroy();
            this.draggable = null;
        }
        if (this.axisField) {
            this.axisField = null;
        }
        this.removeEventListener();
        this.isDestroyed = true;
    }
}
