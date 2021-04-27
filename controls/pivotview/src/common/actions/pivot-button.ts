import { createElement, Draggable, DragEventArgs, remove, extend, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EventHandler, MouseEventArgs, BlazorDragEventArgs, isBlazor, select } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, addClass, removeClass, closest, Browser } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction, PivotButtonArgs, MemberFilteringEventArgs } from '../../common/base/interface';
import { FieldRemoveEventArgs, FieldDragStartEventArgs } from '../../common/base/interface';
import { IFieldOptions, IFilter, IField, IDataOptions, PivotEngine, IMembers, FieldItemInfo } from '../../base/engine';
import { IPivotValues, IPivotRows, IAxisSet, INumberIndex } from '../../base/engine';
import { Button } from '@syncfusion/ej2-buttons';
import { DragAndDropEventArgs, TreeView, NodeCheckEventArgs, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { Dialog, ButtonPropsModel, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
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
    public parent: PivotView | PivotFieldList;
    private parentElement: HTMLElement;
    private dialogPopUp: Dialog;
    private draggable: Draggable;
    /* eslint-disable-next-line */
    private handlers: { load: Function };
    public menuOption: AggregateMenu;
    public axisField: AxisFieldRenderer;
    private fieldName: string;
    private valueFiedDropDownList: DropDownList;
    private columnFieldDropDownList: DropDownList;
    private index: number;
    /** @hidden */
    public memberTreeView: TreeView;
    /** @hidden */
    public isDestroyed: boolean;

    /**
     * Constructor for render module.
     * @param {PivotView | PivotFieldList} parent - Component instance.
     */
    constructor(parent: PivotView | PivotFieldList) {   /* eslint-disable-line */
        this.parent = parent;
        this.menuOption = new AggregateMenu(this.parent);
        this.parent.pivotButtonModule = this;
        this.addEventListener();
        if (this.parent instanceof PivotFieldList) {
            this.axisField = new AxisFieldRenderer(this.parent as PivotFieldList);
        }
        this.isDestroyed = false;
    }

    /* eslint-disable */
    private renderPivotButton(args: PivotButtonArgs): void {
        let field: IFieldOptions[] = extend([], args.field, null, true) as IFieldOptions[]; let axis: string = args.axis; let axisElement: Element; let valuePos: number = -1;
        let showValuesButton: boolean = (this.parent.dataType === 'pivot' ? (this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).pivotGridModule) ?
            (this.parent as PivotFieldList).pivotGridModule.showValuesButton : this.parent.showValuesButton : false);
        if (((this.parent.dataSourceSettings.valueAxis === 'row' && args.axis === 'rows') ||
            (this.parent.dataSourceSettings.valueAxis === 'column' && args.axis === 'columns')) && showValuesButton && this.parent.dataSourceSettings.values.length > 1) {
            valuePos = field.length;
            if (isNullOrUndefined(PivotUtil.getFieldByName(this.parent.localeObj.getConstant('values'), field))) {
                field.push({
                    name: this.parent.localeObj.getConstant('values'), caption: this.parent.localeObj.getConstant('values'),
                    axis: args.axis, showRemoveIcon: true, allowDragAndDrop: true
                });
            }
        }
        this.parentElement = this.parent.getModuleName() === 'pivotview' ? this.parent.element :
            document.getElementById(this.parent.element.id + '_Wrapper');
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
            if (this.parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-' + axis)) {
                let axisPrompt: Element = this.parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-' + axis)
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
            this.parentElement = this.parent.element; axisElement = this.parentElement.querySelector('.e-group-' + axis);
        }
        if (axisElement) {
            if (this.parent.getModuleName() === 'pivotview' && field.length === 0) {
                for (let element of this.parentElement.querySelectorAll('.e-group-' + axis) as any) {
                    if (!element.classList.contains(cls.GROUP_CHART_VALUE) && !element.classList.contains(cls.GROUP_CHART_COLUMN)) {
                        let axisPrompt: HTMLElement = createElement('span', {
                            className: cls.AXIS_PROMPT_CLASS,
                            innerHTML: ((this.parent as PivotView).groupingBarSettings.allowDragAndDrop ? axis === 'rows' ? this.parent.localeObj.getConstant('rowAxisPrompt') :
                                axis === 'columns' ? this.parent.localeObj.getConstant('columnAxisPrompt') :
                                    axis === 'values' ? this.parent.localeObj.getConstant('valueAxisPrompt') :
                                        this.parent.localeObj.getConstant('filterAxisPrompt') : '')
                        });
                        element.appendChild(axisPrompt);
                    }
                }
            } else {
                for (let i: number = 0, cnt: number = field.length; i < cnt; i++) {
                    for (let element of (this.parent.getModuleName() === 'pivotfieldlist' ? [axisElement] : this.parentElement.querySelectorAll('.e-group-' + axis) as any)) {
                        element = element as HTMLElement;
                        let isMeasureAvail: boolean = (this.parent.dataType === 'olap' && (field[i].name.toLowerCase() === '[measures]' || axis === 'values'));
                        let isMeasureFieldsAvail: boolean = (this.parent.dataType === 'olap' && axis === 'values');
                        if (!element.classList.contains(cls.GROUP_CHART_VALUE) && !element.classList.contains(cls.GROUP_CHART_COLUMN)) {
                            let buttonWrapper: HTMLElement = createElement('div', {
                                className: cls.PIVOT_BUTTON_WRAPPER_CLASS + (i === 0 ? ' e-first-btn' : ''),
                                attrs: { 'data-tag': axis + ':' + field[i].name }
                            });
                            let buttonElement: HTMLElement = createElement('div', {
                                id: field[i].name, className: cls.PIVOT_BUTTON_CLASS + ' ' + field[i].name.replace(/[^A-Z0-9]/ig, ''),
                                attrs: {
                                    'data-uid': field[i].name,
                                    'tabindex': (this.parent.getModuleName() === 'pivotview' && (this.parent as PivotView).grid && axis === 'rows' && !element.classList.contains(cls.GROUP_CHART_ROW)) ? '-1' : '0',
                                    'isvalue': (i === valuePos || isMeasureAvail && !isMeasureFieldsAvail) ? 'true' : 'false',
                                    'aria-disabled': 'false', 'aria-label': field[i].caption ? field[i].caption : field[i].name,
                                    'data-type': (this.parent.dataType === 'olap' ? isMeasureFieldsAvail ? 'isMeasureFieldsAvail' : isMeasureAvail ? 'isMeasureAvail' : field[i].type : field[i].type),
                                    'data-caption': field[i].caption ? field[i].caption : field[i].name,
                                    'data-basefield': field[i].baseField,
                                    'data-baseitem': field[i].baseItem
                                }
                            });
                            let dropIndicatorElement: Element = createElement('span', {
                                attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                                className: cls.DROP_INDICATOR_CLASS
                            });
                            let dropLastIndicatorElement: Element = createElement('span', {
                                attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                                className: cls.DROP_INDICATOR_CLASS + '-last'
                            });
                            let dragWrapper: HTMLElement = this.createButtonDragIcon(field[i], buttonElement);
                            let contentElement: HTMLElement = this.createButtonText(field, i, axis, valuePos);
                            buttonElement.appendChild(contentElement);
                            if (!isMeasureAvail && !field[i].isNamedSet && !field[i].isCalculatedField) {
                                if (['filters', 'values'].indexOf(axis) === -1 && valuePos !== i &&
                                    !(this.parent.dataType === 'olap' && ((this.parent.getModuleName() === 'pivotview' &&
                                        (this.parent as PivotView).enableVirtualization) || (this.parent.getModuleName() === 'pivotfieldlist' &&
                                            (this.parent as PivotFieldList).pivotGridModule !== undefined &&
                                            (this.parent as PivotFieldList).pivotGridModule.enableVirtualization)))) {
                                    this.createSortOption(buttonElement, field[i].name, field[i]);
                                }
                                if (axis !== 'values' && valuePos !== i) {
                                    this.createFilterOption(buttonElement, field[i].name, axis, field[i]);
                                }
                                if (axis === 'values') {
                                    this.getTypeStatus(field, i, buttonElement);
                                }
                            }
                            if ((field[i].isCalculatedField || field[i].type === 'CalculatedField')) {
                                let calcElement: Element = createElement('span', {
                                    attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('editCalculatedField') },
                                    className: cls.ICON + ' ' + cls.CALC_EDIT
                                });
                                if (this.parent.allowCalculatedField && this.parent.calculatedFieldModule && field[i].showEditIcon) {
                                    removeClass([calcElement], cls.ICON_DISABLE);
                                } else {
                                    addClass([calcElement], cls.ICON_DISABLE);
                                }
                                buttonElement.appendChild(calcElement);
                            }
                            let removeElement: Element = createElement('span', {
                                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('remove') },
                                className: cls.ICON + ' ' + cls.REMOVE_CLASS
                            });
                            if (this.parent.getModuleName() === 'pivotview') {
                                if (((this.parent as PivotView).groupingBarSettings.showRemoveIcon && field[i].showRemoveIcon)) {
                                    removeClass([removeElement], cls.ICON_DISABLE);
                                } else {
                                    addClass([removeElement], cls.ICON_DISABLE);
                                }
                            } else {
                                if (field[i].showRemoveIcon) {
                                    removeClass([removeElement], cls.ICON_DISABLE);
                                } else {
                                    addClass([removeElement], cls.ICON_DISABLE);
                                }
                            }
                            buttonElement.appendChild(removeElement);
                            buttonWrapper.appendChild(dropIndicatorElement);
                            buttonWrapper.appendChild(buttonElement);
                            buttonWrapper.appendChild(dropLastIndicatorElement);
                            element.appendChild(buttonWrapper);
                            let pivotButton: Button = new Button({ enableRtl: this.parent.enableRtl });
                            pivotButton.isStringTemplate = true;
                            pivotButton.appendTo(buttonElement);
                            this.unWireEvent(buttonWrapper, i === valuePos ? 'values' : axis, isMeasureAvail);
                            this.wireEvent(buttonWrapper, i === valuePos ? 'values' : axis, isMeasureAvail);
                            if ((this.parent.getModuleName() === 'pivotview' && !this.parent.isAdaptive) ||
                                this.parent.getModuleName() === 'pivotfieldlist') {
                                this.createDraggable(field[i], this.parent.getModuleName() === 'pivotview' ? contentElement : dragWrapper);
                                (buttonElement as any).querySelector('.' + cls.BUTTON_DRAGGABLE).ej2_instances[0].enableAutoScroll = false;
                            }
                        }
                    }
                }
                if (axis === 'values') {
                    for (let element of this.parentElement.querySelectorAll('.e-group-' + axis) as any) {
                        if (element.classList.contains(cls.GROUP_CHART_VALUE) && (this.parent as PivotView).chartModule) {
                            let valueData: { text: string, value: string }[] = field.map((item) => { return { text: item.caption ? item.caption : item.name, value: item.name }; });
                            let parent: PivotView = this.parent as PivotView;
                            if (this.valueFiedDropDownList && element.querySelector('.' + cls.GROUP_CHART_VALUE_DROPDOWN_DIV)) {
                                this.valueFiedDropDownList.dataSource = valueData;
                                this.valueFiedDropDownList.value = !parent.chartSettings.enableMultipleAxis ?
                                    parent.chartModule.currentMeasure : valueData[0].value;
                            } else {
                                let ddlDiv: HTMLElement = createElement('div', { className: cls.GROUP_CHART_VALUE_DROPDOWN_DIV });
                                element.appendChild(ddlDiv);
                                this.valueFiedDropDownList = new DropDownList({
                                    dataSource: valueData,
                                    enableRtl: this.parent.enableRtl,
                                    value: !parent.chartSettings.enableMultipleAxis ?
                                        parent.chartModule.currentMeasure : valueData[0].value,
                                    width: 200,
                                    fields: { value: 'value', text: 'text' },
                                    cssClass: cls.GROUP_CHART_VALUE_DROPDOWN,
                                    change: (args: ChangeEventArgs) => {
                                        if (args.e && args.e !== null) {
                                            parent.chartSettings.value = args.value as string;
                                        }
                                    }
                                });
                                this.valueFiedDropDownList.isStringTemplate = true;
                                this.valueFiedDropDownList.appendTo(ddlDiv);
                            }
                        }
                    }
                }
                else if (axis === 'columns') {
                    let availColindex: number = undefined;
                    for (let element of this.parentElement.querySelectorAll('.e-group-' + axis) as any) {
                        if (element.classList.contains(cls.GROUP_CHART_COLUMN) && (this.parent as PivotView).chartModule) {
                            let currentMeasure = (this.parent as PivotView).chartModule.currentMeasure;
                            let delimiter: string = (this.parent as PivotView).chartSettings.columnDelimiter ? (this.parent as PivotView).chartSettings.columnDelimiter : '-';
                            let columnHeader: string = ((this.parent as PivotView).chartSettings.columnHeader && (this.parent as PivotView).chartSettings.columnHeader !== '') ?
                                (this.parent as PivotView).chartSettings.columnHeader.split(delimiter).join(' - ') : '';
                            let engineModule: PivotEngine | OlapEngine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
                            let pivotValues: IPivotValues = engineModule.pivotValues;
                            let totColIndex: INumberIndex = (this.parent as PivotView).chartModule.getColumnTotalIndex(pivotValues);
                            let rKeys: string[] = Object.keys(pivotValues);
                            let columnData: {
                                text: string, value: string, title: {
                                    [key: string]: string;
                                }
                            }[] = [];
                            let firstValueRow: boolean = false;
                            for (let rKey of rKeys) {
                                if (firstValueRow) {
                                    break;
                                }
                                let rowIndex: number = Number(rKey);
                                if (pivotValues[rowIndex][0] && (pivotValues[rowIndex][0] as IAxisSet).axis === 'row' &&
                                    (this.parent.dataSourceSettings.rows.length === 0 ? true : (pivotValues[rowIndex][0] as IAxisSet).type !== 'grand sum')) {
                                    let firstRowCell: IAxisSet = pivotValues[rowIndex][0] as IAxisSet;
                                    let tupInfo: ITupInfo = this.parent.dataType === 'olap' ?
                                        (engineModule as OlapEngine).tupRowInfo[firstRowCell.ordinal] : undefined;
                                    let rows: IPivotRows = pivotValues[rowIndex];
                                    let cKeys: string[] = Object.keys(rows);
                                    for (let cKey of cKeys) {
                                        let cellIndex: number = Number(cKey);
                                        let cell: IAxisSet = pivotValues[rowIndex][cellIndex] as IAxisSet;
                                        let actualText: any = (this.parent.dataType === 'olap' && tupInfo && tupInfo.measureName) ?
                                            tupInfo.measureName : cell.actualText;
                                        if (!totColIndex[cell.colIndex] && cell.axis === 'value' && firstRowCell.type !== 'header' &&
                                            actualText !== '' && actualText === currentMeasure) {
                                            firstValueRow = true;
                                            let columnSeries: string = this.parent.dataType === 'olap' ? cell.columnHeaders.toString().split(/~~|::/).join(' - ')
                                                : cell.columnHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - ');
                                            columnData.push({ value: columnSeries, text: columnSeries, title: { ['title']: columnSeries } });
                                            if (columnSeries === columnHeader) {
                                                availColindex = columnData.length;
                                            }
                                        }
                                    }
                                }
                            }
                            if (this.columnFieldDropDownList && element.querySelector('.' + cls.GROUP_CHART_COLUMN_DROPDOWN_DIV)) {
                                this.columnFieldDropDownList.dataSource = columnData;
                                if (availColindex !== undefined) {
                                    this.columnFieldDropDownList.value = columnData[availColindex - 1].value;
                                } else {
                                    this.columnFieldDropDownList.value = columnData[0].value;
                                }
                            } else {
                                let ddlDiv: HTMLElement = createElement('div', { className: cls.GROUP_CHART_COLUMN_DROPDOWN_DIV });
                                element.appendChild(ddlDiv);
                                this.columnFieldDropDownList = new DropDownList({
                                    dataSource: columnData,
                                    enableRtl: this.parent.enableRtl,
                                    value: availColindex ? columnData[availColindex - 1].value : (columnData[0] ? columnData[0].value : ''),
                                    width: '200',
                                    fields: { value: 'value', text: 'text', htmlAttributes: 'title' },
                                    cssClass: cls.GROUP_CHART_COLUMN_DROPDOWN,
                                    change: (args: ChangeEventArgs) => {
                                        if (args.e && args.e !== null) {
                                            let delimiter: string = (this.parent as PivotView).chartSettings.columnDelimiter ? (this.parent as PivotView).chartSettings.columnDelimiter : '-';
                                            (this.parent as PivotView).chartSettings.columnHeader = (args.value as string).split(' - ').join(delimiter);
                                        }
                                    }
                                });
                                this.columnFieldDropDownList.isStringTemplate = true;
                                this.columnFieldDropDownList.appendTo(ddlDiv);
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
        let buttonText: HTMLElement;
        let aggregation: string;
        let filterMem: string;
        if (axis === 'filters') {
            filterMem = this.updateButtontext(field[i].name);
        }
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        if (engineModule.fieldList[field[i].name] !== undefined) {
            aggregation = engineModule.fieldList[field[i].name].aggregateType;
            if ((aggregation !== 'DistinctCount') && (engineModule.fieldList[field[i].name].type !== 'number' || engineModule.fieldList[field[i].name].type === 'include' ||
                engineModule.fieldList[field[i].name].type === 'exclude')) {
                aggregation = 'Count';
            } else {
                aggregation = aggregation === undefined ? 'Sum' :
                    engineModule.fieldList[field[i].name].aggregateType;
            }
        }
        let text: string = field[i].caption ? field[i].caption : field[i].name;
        buttonText = createElement('span', {
            attrs: {
                title: axis === 'filters' ? (this.parent.dataType === 'olap' && engineModule.fieldList[field[i].name].type === 'CalculatedField') ?
                    text : (text + ' (' + filterMem + ')') : (this.parent.dataType === 'olap' ?
                        text : (((!this.parent.dataSourceSettings.showAggregationOnValueField || axis !== 'values' || aggregation === 'CalculatedField') ?
                            text : this.parent.localeObj.getConstant(aggregation) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + text))),
                'tabindex': '-1', 'aria-disabled': 'false', 'oncontextmenu': 'return false;',
                'data-type': valuePos === i ? '' : aggregation
            },
            className: cls.PIVOT_BUTTON_CONTENT_CLASS + ' ' +
                (this.parent.getModuleName() === 'pivotview' ?
                    (this.parent as PivotView).groupingBarSettings.allowDragAndDrop && field[i].allowDragAndDrop ? '' : cls.DRAG_DISABLE_CLASS : ''),
            innerHTML: axis === 'filters' ? (this.parent.dataType === 'olap' && engineModule.fieldList[field[i].name].type === 'CalculatedField') ?
                text : (text + ' (' + filterMem + ')') : (this.parent.dataType === 'olap' ?
                    text : (!this.parent.dataSourceSettings.showAggregationOnValueField || axis !== 'values' || aggregation === 'CalculatedField' ?
                        text : this.parent.localeObj.getConstant(aggregation) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + text))
        });
        return buttonText;
    }
    /* eslint-enable */
    private getTypeStatus(field: IFieldOptions[], i: number, buttonElement: HTMLElement): void {
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
        } else {
            engineModule = this.parent.engineModule;
        }
        let fieldListItem: IField = engineModule.fieldList[field[i].name];
        if (fieldListItem.aggregateType !== 'CalculatedField' && this.validateDropdown(fieldListItem.type)) {
            this.createSummaryType(buttonElement, field[i].name, field[i]);
        }
    }
    private validateDropdown(type: string): boolean {
        let aggregateType: AggregateTypes[] = this.parent.aggregateTypes;
        if (type !== 'number') {
            return (aggregateType.indexOf('Count') > -1 || aggregateType.indexOf('DistinctCount') > -1);
        } else {
            for (let i: number = 0; i < aggregateType.length; i++) {
                if (this.parent.getAllSummaryType().indexOf(aggregateType[i]) > -1) {
                    return true;
                }
            }
            return false;
        }
    }

    private createSummaryType(pivotButton: HTMLElement, fieldName: string, field: IFieldOptions): Element {
        let spanElement: Element = createElement('span', {
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
        let fieldName: string = (args.target as HTMLElement).parentElement.id;
        if (this.parent.getModuleName() === 'pivotview') {
            if (this.parent.isAdaptive && ((this.parent as PivotView).showFieldList &&
                (this.parent as PivotView).pivotFieldListModule &&
                !(this.parent as PivotView).pivotFieldListModule.isDestroyed)) {
                ((this.parent as PivotView).pivotFieldListModule.element
                    .querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).click();
                (this.parent as PivotView).pivotFieldListModule.dialogRenderer.adaptiveElement.select(4);
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                ((this.parent as PivotView).pivotFieldListModule.calculatedFieldModule as any)
                    .updateAdaptiveCalculatedField(true, fieldName);
            } else {
                if (!this.parent.isAdaptive) {
                    (this.parent as PivotView).calculatedFieldModule.buttonCall = true;
                }
                this.parent.notify(events.initCalculatedField, { edit: true, fieldName: fieldName });
            }
        } else if (this.parent.getModuleName() === 'pivotfieldlist') {
            if (this.parent.isAdaptive) {
                (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.select(4);
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                ((this.parent as PivotView).calculatedFieldModule as any)
                    .updateAdaptiveCalculatedField(true, fieldName);
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
        let dragWrapper: HTMLElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' }
        });
        let dragElement: HTMLElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('drag')
            },
            className: cls.ICON + ' ' + cls.DRAG_CLASS + ' ' + (field.allowDragAndDrop ? '' : cls.DRAG_DISABLE_CLASS)
        });
        dragWrapper.appendChild(dragElement);
        pivotButton.appendChild(dragWrapper);
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
        if (!this.parent.allowDeferLayoutUpdate) {
            sortCLass = engineModule.fieldList[fieldName].sort === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
        } else {
            sortCLass = '';
            for (let i: number = 0; i < this.parent.dataSourceSettings.sortSettings.length; i++) {
                if (this.parent.dataSourceSettings.sortSettings[i].name === fieldName) {
                    sortCLass = this.parent.dataSourceSettings.sortSettings[i].order === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
                }
            }
        }
        if (engineModule.fieldList[fieldName].sort === 'None') {
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
        if (!this.parent.allowDeferLayoutUpdate) {
            engineModule.fieldList[fieldName].filter = engineModule.fieldList[fieldName].filter === null ?
                [] : engineModule.fieldList[fieldName].filter;
            filterCLass = engineModule.fieldList[fieldName].filter.length === 0 ?
                !engineModule.fieldList[fieldName].isExcelFilter ? cls.FILTER_CLASS : cls.FILTERED_CLASS : cls.FILTERED_CLASS;
        } else {
            filterCLass = cls.FILTER_CLASS;
            for (let i: number = 0; i < this.parent.dataSourceSettings.filterSettings.length; i++) {
                if (this.parent.dataSourceSettings.filterSettings[i].name === fieldName) {
                    filterCLass = cls.FILTERED_CLASS;
                }
            }
        }
        let spanElement: Element = createElement('span', {
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
        let filterCount: number = engineModule.fieldList[fieldName].filter.length;
        let filterType: string = engineModule.fieldList[fieldName].filterType;
        let memLen: number = engineModule.fieldList[fieldName].dateMember.length;
        let filterMem: string;
        let firstNode: string = engineModule.fieldList[fieldName].filter[0];
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
                    if (firstNode !== engineModule.fieldList[fieldName].dateMember[0].actualText) {
                        filterMem = firstNode;
                    } else {
                        filterMem = engineModule.fieldList[fieldName].dateMember[0].actualText as string;
                    }
                } else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            } else if (filterCount > 1) {
                let j: number;
                let allNodes: string[] = Object.keys(engineModule.fieldList[fieldName].members);
                let filteredItems: string[] = engineModule.fieldList[fieldName].filter;
                if (filterCount === (allNodes.length - 1)) {
                    /* eslint-disable */
                    loop: for (j = 0; j < allNodes.length; j++) {
                        let test: string = allNodes[j];
                        let x: number = filteredItems.indexOf(test);
                        if (x === -1) {
                            filterMem = allNodes[j];
                            break loop;
                            /* eslint-enable */
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
        let filterItems: string[] = engineModule.fieldList[fieldName].actualFilter;
        if (filterItems.length > 0) {
            let cMembers: IMembers = engineModule.fieldList[fieldName].members;
            let actualFilterItems: string[] = [];
            if (engineModule.fieldList[fieldName].filterMembers.length > 0) {
                let dummyfilterItems: { [key: string]: string } = {};
                for (let item of filterItems) {
                    dummyfilterItems[item] = item;
                    if (cMembers[item]) {
                        dummyfilterItems = this.parent.pivotCommon.eventBase.getParentNode(fieldName, item, dummyfilterItems);
                    }
                }
                let updatedFilterItems: string[] = dummyfilterItems ? Object.keys(dummyfilterItems) : [];
                for (let item of updatedFilterItems) {
                    if (cMembers[item].isSelected) {
                        if (!(cMembers[item].parent && cMembers[cMembers[item].parent].isSelected)) {
                            actualFilterItems.push(item);
                        }
                    }
                }
                firstNode = actualFilterItems.length === 1 ? cMembers[actualFilterItems[0]].caption : firstNode;
            }
            filterCount = actualFilterItems.length === 0 ? filterCount : actualFilterItems.length;
        }
        if (filterCount === 0) {
            filterMem = (engineModule.fieldList[fieldName].allMember ?
                engineModule.fieldList[fieldName].allMember : this.parent.localeObj.getConstant('all'));
        } else if (filterCount === 1) {
            filterMem = firstNode;
        } else if (filterCount > 1) {
            filterMem = this.parent.localeObj.getConstant('multipleItems');
        }
        return filterMem;
    }
    private createDragClone(args: DragEventArgs): HTMLElement {
        let element: Element = closest(args.element, '.' + cls.PIVOT_BUTTON_CLASS);
        let cloneElement: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: cls.DRAG_CLONE_CLASS
        });
        let contentElement: HTMLElement = createElement('span', {
            className: cls.TEXT_CONTENT_CLASS,
            innerHTML: element.textContent
        });
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    }
    private onDragStart(e: DragEventArgs & BlazorDragEventArgs): void {
        let element: Element = closest(e.element, '.' + cls.PIVOT_BUTTON_CLASS);
        let dragItem: HTMLElement = document.getElementById(this.parent.element.id + '_DragClone');
        let fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(element.getAttribute('data-uid'), this.parent);
        let dragEventArgs: FieldDragStartEventArgs = {
            fieldName: fieldInfo.fieldName,
            fieldItem: fieldInfo.fieldItem,
            axis: fieldInfo.axis,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            cancel: false
        };
        let control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
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
                let data: IField = engineModule.fieldList[element.getAttribute('data-uid')];
                let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
                addClass([element], cls.SELECTED_NODE_CLASS);
                if (dragItem && (this.parent.getModuleName() === 'pivotfieldlist' &&
                    (this.parent as PivotFieldList).renderMode) === 'Popup') {
                    let fieldListPopup: PivotFieldList = (this.parent as PivotFieldList);
                    dragItem.style.zIndex = (fieldListPopup.dialogRenderer.fieldListDialog.zIndex + 1).toString();
                }
                if (data && data.aggregateType === 'CalculatedField') {
                    for (let axisContent of axis) {
                        addClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                    }
                }
                if (isBlazor()) {
                    e.bindEvents(e.dragElement);
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
        if (args.target.classList && (args.target.classList.contains(cls.GROUP_CHART_VALUE) || args.target.classList.contains(cls.GROUP_CHART_VALUE_DROPDOWN))) {   /* eslint-disable-line */
            args.target = this.parent.element.querySelector('.' + cls.GROUP_CHART_ROW);
        } if (args.target.classList && args.element && (args.target.classList.contains(cls.GROUP_CHART_COLUMN) || args.target.classList.contains(cls.GROUP_CHART_COLUMN_DROPDOWN))) {   /* eslint-disable-line */
            args.cancel = true;
        }
        let element: Element = closest(args.element, '.' + cls.PIVOT_BUTTON_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS)), cls.SELECTED_NODE_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
        let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (let axisContent of axis) {
            removeClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
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
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, element.id)) {
            this.updateDataSource();
            /* eslint-disable */
            let thisObj: PivotButton = this;
            /* eslint-enable */
            thisObj.parent.axisFieldModule.render();
        }
    }
    private isButtonDropped(dropTarget: HTMLElement, target: HTMLElement): boolean {
        let axisPanel: HTMLElement = closest(target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        let droppableElement: HTMLElement = closest(dropTarget, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        let isDropped: boolean = true;
        if (axisPanel === droppableElement) {
            let pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            let droppableTarget: HTMLElement = closest(dropTarget, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
            let sourcePosition: number;
            let droppedPosition: number = -1;
            for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === target.id) {
                    sourcePosition = i;
                }
                if (droppableTarget) {
                    let droppableButton: HTMLElement = droppableTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
                    if (pivotButtons[i].id === droppableButton.id) {
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
        let buttonElement: Element = closest((args.target as HTMLElement), '.' + cls.PIVOT_BUTTON_CLASS);
        let fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo((buttonElement ? buttonElement.id : ''), this.parent);
        if (!((args.target as HTMLElement).classList.contains(cls.FILTER_COMMON_CLASS)) &&
            !((args.target as HTMLElement).classList.contains(cls.REMOVE_CLASS)) &&
            !((args.target as HTMLElement).classList.contains(cls.DRAG_CLASS)) &&
            (buttonElement && fieldInfo.fieldItem && (fieldInfo.fieldItem.showSortIcon ||
                isNullOrUndefined(fieldInfo.fieldItem.showSortIcon)))) {
            if ((this.parent instanceof PivotFieldList || (this.parent as PivotView).groupingBarSettings.showSortIcon) &&
                this.parent.dataSourceSettings.enableSorting &&
                !(this.parent.dataType === 'olap' && ((this.parent.getModuleName() === 'pivotfieldlist' &&
                    (this.parent as PivotFieldList).pivotGridModule !== undefined &&
                    (this.parent as PivotFieldList).pivotGridModule.enableVirtualization) ||
                    (this.parent.getModuleName() === 'pivotview' && (this.parent as PivotView).enableVirtualization)))) {
                if (((this.parent.getModuleName() === 'pivotview' && (this.parent as PivotView).enableValueSorting) ||
                    (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).pivotGridModule !== undefined &&
                        (this.parent as PivotFieldList).pivotGridModule.enableValueSorting))) {
                    if ((this.parent as PivotView).enableValueSorting || (this.parent as PivotFieldList).pivotGridModule.enableValueSorting) {  /* eslint-disable-line */
                        if ((args.target as HTMLElement).classList.contains('e-pivot-button')) {
                            if ((args.target as HTMLElement).parentElement.getAttribute('data-tag').split(':')[0] === 'rows') {
                                this.parent.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                            }
                        } else {
                            if ((args.target as HTMLElement).parentElement.parentElement.getAttribute('data-tag').split(':')[0] === 'rows') {
                                this.parent.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                            }
                        }
                    }
                }
                this.parent.pivotCommon.eventBase.updateSorting(args);
                if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() !== 'pivotfieldlist') {
                    this.updateDataSource(true);
                }
                /* eslint-disable */
                let thisObj: PivotButton = this;
                /* eslint-enable */
                if (thisObj.parent instanceof PivotFieldList) {
                    thisObj.axisField.render();
                }
            }
        }
    }
    /* eslint-disable-next-line */
    /** @hidden */
    public updateDataSource(isRefreshGrid?: boolean): void {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshGrid);
        } else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).isPopupView && (this.parent as PivotFieldList).pivotGridModule) {
                if (this.parent.dataType === 'olap') {
                    (this.parent as PivotFieldList).pivotGridModule.olapEngineModule = (this.parent as PivotFieldList).olapEngineModule;
                } else {
                    (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
                }
                /* eslint-disable */
                (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
                (this.parent as PivotFieldList).
                    pivotGridModule.setProperties({ dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties as IDataOptions }, true);
                /* eslint-enable */
            } else {
                (this.parent as PivotFieldList).triggerPopulateEvent();
            }
        }
    }
    private updateFiltering(args: MouseEventArgs): void {
        /* eslint-disable */
        let pivotObj: PivotView = (this.parent as any).pivotGridModule ? (this.parent as any).pivotGridModule : this.parent;
        if (pivotObj.getModuleName() === 'pivotfieldlist') {
            showSpinner(pivotObj.fieldListSpinnerElement as HTMLElement);
        } else {
            pivotObj.showWaitingPopup();
        }
        pivotObj.mouseEventArgs = args;
        pivotObj.filterTargetID = this.parent.pivotCommon.moduleName !== 'pivotfieldlist' ?
            this.parent.element : document.getElementById(this.parent.pivotCommon.parentID + '_Wrapper');
        let fieldName: string = (args.target as HTMLElement).parentElement.id;
        if (pivotObj && pivotObj.enableVirtualization && isBlazor() && pivotObj.dataType === 'pivot') {
            let $this: PivotButton = this;
            (pivotObj as any).interopAdaptor.invokeMethodAsync("PivotInteropMethod", 'fetchFieldMembers',
                fieldName).then((data: any) => {
                    let parsedData: any = JSON.parse(data.dateMembers);
                    let dateMembers: any = [];
                    let formattedMembers: any = {};
                    let members: any = {};
                    for (let i: number = 0; i < parsedData.length; i++) {
                        dateMembers.push({ formattedText: parsedData[i].FormattedText, actualText: parsedData[i].ActualText });
                        formattedMembers[parsedData[i].FormattedText] = {};
                        members[parsedData[i].ActualText] = {};
                    }
                    $this.parent.engineModule.fieldList[fieldName].dateMember = dateMembers;
                    $this.parent.engineModule.fieldList[fieldName].formattedMembers = formattedMembers;
                    $this.parent.engineModule.fieldList[fieldName].members = members;
                    $this.updateFilterEvents();
                });
        } else if (pivotObj.dataSourceSettings.mode === 'Server') {
            if (this.parent.engineModule.fieldList[fieldName].members && Object.keys(this.parent.engineModule.fieldList[fieldName].members).length > 0) {
                this.updateFilterEvents();
            } else {
                pivotObj.getEngine('fetchFieldMembers', null, null, null, null, null, fieldName);
            }
        } else {
            this.updateFilterEvents();
        }
        /* eslint-enable */
    }
    /* eslint-disable-next-line */
    /** @hidden */
    public updateFilterEvents(): void {
        /* eslint-disable */
        let pivotObj: PivotView = (this.parent as any).pivotGridModule ? (this.parent as any).pivotGridModule : this.parent;
        this.parent.pivotCommon.eventBase.updateFiltering(pivotObj.mouseEventArgs);
        let target: HTMLElement = pivotObj.mouseEventArgs.target as HTMLElement;
        this.fieldName = target.parentElement.id;
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.dialogPopUp = this.parent.pivotCommon.filterDialog.dialogPopUp;
            this.parent.pivotCommon.filterDialog.dialogPopUp.close = this.removeFilterDialog.bind(this);
            // this.memberTreeView = this.parent.pivotCommon.filterDialog.memberTreeView;
            // this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
            // this.parent.pivotCommon.filterDialog.allMemberSelect.nodeChecked = this.nodeStateModified.bind(this);
            this.bindDialogEvents();
        }
        if (pivotObj.getModuleName() === 'pivotfieldlist') {
            hideSpinner(pivotObj.fieldListSpinnerElement as HTMLElement);
        } else {
            pivotObj.hideWaitingPopup();
        }
    }
    private bindDialogEvents(): void {
        if (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter && this.parent.pivotCommon.filterDialog.tabObj) {
            this.index = this.parent.pivotCommon.filterDialog.tabObj.selectedItem;
            this.updateDialogButtonEvents();
            this.dialogPopUp.buttons = this.buttonModel();
            this.dialogPopUp.dataBind();
            this.parent.pivotCommon.filterDialog.tabObj.selected = this.tabSelect.bind(this);
        } else if (this.parent.dataSourceSettings.allowMemberFilter) {
            this.index = 0;
            this.updateDialogButtonEvents();
        }
    }
    private buttonModel(): ButtonPropsModel[] {
        return [
            {
                buttonModel: {
                    cssClass: 'e-clear-filter-button' + (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter ? '' : ' ' + cls.ICON_DISABLE),
                    iconCss: 'e-icons e-clear-filter-icon', enableRtl: this.parent.enableRtl,
                    content: this.parent.localeObj.getConstant('clearFilter'), disabled: (this.parent.pivotCommon.filterDialog.filterObject ? false : true)
                },
                click: this.ClearFilter.bind(this)
            },
            {
                buttonModel: {
                    cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                },
                click: (this.index === 0 ? this.updateFilterState.bind(this, this.fieldName) : this.updateCustomFilter.bind(this))
            },
            {
                click: this.parent.pivotCommon.filterDialog.closeFilterDialog.bind(this),
                buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
            }];
    }
    private tabSelect(e: SelectEventArgs): void {
        this.index = e.selectedIndex;
        this.updateDialogButtonEvents();
        removeClass([].slice.call(this.dialogPopUp.element.querySelectorAll('.e-selected-tab')), 'e-selected-tab');
        if (e.selectedIndex > 0) {
            addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (e.selectedIndex === 1 && this.parent.dataSourceSettings.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
        }
        if (e.selectedIndex === 0) {
            this.parent.pivotCommon.filterDialog.updateCheckedState();
        } else {
            this.dialogPopUp.buttons[0].buttonModel.disabled = false;
            this.dialogPopUp.element.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
        }
    }
    private updateDialogButtonEvents(): void {
        this.dialogPopUp.buttons = this.buttonModel();
        this.dialogPopUp.dataBind();
    }
    private updateCustomFilter(args: Event): void {
        let dialogElement: HTMLElement =
            this.dialogPopUp.element.querySelector('.e-selected-tab') as HTMLElement;
        let fieldName: string = dialogElement.getAttribute('data-fieldname');
        let levelName: string = dialogElement.getAttribute('data-selectedField');
        let filterType: string = dialogElement.getAttribute('data-type');
        let measure: string = dialogElement.getAttribute('data-measure');
        let operator: string = dialogElement.getAttribute('data-operator');
        let operand1: string = dialogElement.getAttribute('data-value1');
        let operand2: string = dialogElement.getAttribute('data-value2');
        let type: FilterType = ((filterType === 'value') ? 'Value' : (filterType === 'date') ? 'Date' :
            (filterType === 'number') ? 'Number' : 'Label');
        let filterItem: IFilter = {
            name: fieldName,
            type: type,
            measure: measure,
            condition: operator as Operators,
            value1: filterType === 'date' && !isBlazor() ? new Date(operand1) : operand1 as string,
            value2: filterType === 'date' && !isBlazor() ? new Date(operand2) : operand2 as string
        };
        let filterObject: IFilter;
        if (this.parent.dataType === 'olap') {
            filterItem.selectedField = levelName;
            this.removeDataSourceSettings(fieldName, levelName, type);
            let filterItems: IFilter[] = this.parent.dataSourceSettings.filterSettings;
            for (let item of filterItems) {
                if (item.name === fieldName && item.selectedField === levelName) {
                    filterObject = item;
                }
            }
        } else {
            filterObject = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        }
        if ((isNOU(operand1) || operand1 === '') ||
            (['Between', 'NotBetween'].indexOf(operator) > -1 && (isNOU(operand2) || operand2 === ''))) {
            let inputElementString: string =
                (type.toLowerCase() + ((isNOU(operand1) || operand1 === '') ? '_input_option_1' : '_input_option_2'));
            let focusElement: HTMLElement = select('#' + this.parent.element.id + '_' + inputElementString, dialogElement);
            addClass([focusElement], cls.EMPTY_FIELD);
            focusElement.focus();
            return;
        }
        let filterEventArgs: MemberFilteringEventArgs = {
            cancel: false,
            filterSettings: filterItem,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings)
        };
        let control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
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
            }
            this.dialogPopUp.close();
            if (!observedArgs.cancel) {
                this.refreshPivotButtonState(fieldName, true);
                this.updateDataSource(true);
            }
        });
    }
    private removeFilterDialog(): void {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
            setTimeout(this.setFocus.bind(this));
        }
        if (document.getElementById(this.parentElement.id + '_EditorTreeView')) {
            remove(document.getElementById(this.parentElement.id + '_EditorTreeView'));
        }
    }
    private setFocus() {
        if (this.parentElement) {
            let pivotButtons: HTMLElement[] = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
            for (let item of pivotButtons) {
                if (item.getAttribute('data-uid') === this.fieldName) {
                    item.focus();
                    break;
                }
            }
        }
    }
    private ClearFilter(e: Event): void {
        let dialogElement: HTMLElement = this.dialogPopUp.element;
        let fieldName: string = dialogElement.getAttribute('data-fieldname');
        let tabElement: HTMLElement = dialogElement.querySelector('.e-selected-tab') as HTMLElement;
        this.dialogPopUp.close();
        if (this.parent.dataType === 'olap' && tabElement) {
            let levelName: string = tabElement.getAttribute('data-selectedField');
            this.removeDataSourceSettings(fieldName, levelName);
        } else {
            this.removeDataSourceSettings(fieldName);
        }
        let filterObject: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        this.refreshPivotButtonState(fieldName, filterObject ? true : false);
        this.updateDataSource(true);
    }
    private removeButton(args: Event): void {
        let target: HTMLElement = args.target as HTMLElement;
        let fieldName: string = target.parentElement.id;
        let fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(fieldName, this.parent);
        let removeFieldArgs: FieldRemoveEventArgs = {
            cancel: false, fieldName: fieldName,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis
        };
        let control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.fieldRemove, removeFieldArgs, (observedArgs: FieldRemoveEventArgs) => {
            if (!observedArgs.cancel) {
                if (target.parentElement.getAttribute('isvalue') === 'true') {
                    this.parent.setProperties({ dataSourceSettings: { values: [] } }, true);
                    if (this.parent.dataType === 'olap') {
                        this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[measures]');
                    }
                } else {
                    this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(fieldName);
                    if (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.values.length === 0) {
                        this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[measures]');
                    }
                }
                if (this.parent.getModuleName() === 'pivotfieldlist') {
                    this.parent.axisFieldModule.render();
                }
                this.updateDataSource();
            }
        });
    }
    /** @hidden */
    public nodeStateModified(args: NodeCheckEventArgs): void {
        let target: Element = closest(args.node as Element, 'li');
        let fieldName: string = target.getAttribute('data-fieldname');
        if (target.getAttribute('data-memberId') === 'all') {
            this.memberTreeView.nodeChecked = null;
            if (args.action === 'check') {
                this.memberTreeView.checkAll();
            } else {
                this.memberTreeView.uncheckAll();
            }
            if (this.parent.dataType === 'olap' && this.parent.olapEngineModule &&
                !this.parent.olapEngineModule.fieldList[fieldName].isHierarchy) {
                this.updateNodeStates(this.memberTreeView.getAllCheckedNodes(), fieldName, args.action);
            }
            this.checkedStateAll(args.action);
            this.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        } else {
            if (this.parent.dataType === 'olap' && this.parent.olapEngineModule &&
                !this.parent.olapEngineModule.fieldList[fieldName].isHierarchy) {
                // let st1: number = new Date().getTime();
                let checkedNodes: string[] = this.memberTreeView.getAllCheckedNodes();
                // let st2: number = (new Date().getTime() - st1) / 1000;
                // console.log('getAllCheckedNodes:' + st2);
                this.updateNodeStates(checkedNodes, fieldName, args.action);
            }
            let pos: number = this.parent.pivotCommon.currentTreeItemsPos[target.getAttribute('data-memberId')].index;
            if (this.parent.pivotCommon.currentTreeItems[pos]) {
                this.parent.pivotCommon.currentTreeItems[pos].isSelected = args.action === 'check';
                this.parent.pivotCommon.currentTreeItemsPos[target.getAttribute('data-memberId')].isSelected = args.action === 'check';
            }
        }
        this.parent.pivotCommon.filterDialog.updateCheckedState();
    }
    private checkedStateAll(state: string): void {
        let searchItemObj: { [key: string]: string } = {};
        /* eslint-disable @typescript-eslint/no-explicit-any */
        for (let item of this.parent.pivotCommon.searchTreeItems) {
            item.isSelected = state === 'check';
            searchItemObj[(item as any).htmlAttributes['data-memberId']] = (item as any).htmlAttributes['data-memberId'];
        }
        for (let item of this.parent.pivotCommon.currentTreeItems) {
            if (searchItemObj[(item as any).htmlAttributes['data-memberId']] !== undefined) {
                item.isSelected = state === 'check';
                this.parent.pivotCommon.currentTreeItemsPos[(item as any).htmlAttributes['data-memberId']].isSelected = state === 'check';
            }
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
    private updateNodeStates(checkedNodes: string[], fieldName: string, state: string): void {
        let fieldList: IOlapField =
            (this.parent.pivotCommon.engineModule.fieldList as IOlapFieldListOptions)[fieldName];
        let currentMembers: IMembers = fieldList.members;
        let searchMembers: IMembers = fieldList.currrentMembers;
        if (fieldList.searchMembers.length > 0) {
            let members: string[] = Object.keys(searchMembers);
            for (let member of members) {
                if (searchMembers[member]) {
                    searchMembers[member].isSelected = false;
                }
                if (currentMembers[member]) {
                    currentMembers[member].isSelected = false;
                    if (this.memberTreeView.element.querySelector('li[data-memberId="' + member + '"]')) {
                        let element: HTMLElement = this.memberTreeView.element.querySelector('li[data-memberId="' + member + '"]');
                        if (element && !element.querySelector('ul')) {
                            this.parent.pivotCommon.eventBase.updateChildNodeStates(fieldList.filterMembers, fieldName, member, false);
                        }
                    }
                }
            }
            for (let node of checkedNodes) {
                if (currentMembers[node]) {
                    if (this.memberTreeView.element.querySelector('li[data-memberId="' + node + '"]')) {
                        let element: HTMLElement = this.memberTreeView.element.querySelector('li[data-memberId="' + node + '"]');
                        if (element && !element.querySelector('ul')) {
                            currentMembers[node].isSelected = true;
                            this.parent.pivotCommon.eventBase.updateChildNodeStates(fieldList.filterMembers, fieldName, node, true);
                        }
                    }
                }
                if (searchMembers[node]) {
                    searchMembers[node].isSelected = true;
                }
            }
        } else {
            let members: string[] = Object.keys(currentMembers);
            for (let member of members) {
                if (currentMembers[member].isSelected) {
                    currentMembers[member].isSelected = false;
                }
            }
            for (let node of checkedNodes) {
                if (currentMembers[node]) {
                    currentMembers[node].isSelected = true;
                    this.parent.pivotCommon.eventBase.updateChildNodeStates(fieldList.filterMembers, fieldName, node, true);
                }
            }
        }
    }
    private updateFilterState(fieldName: string, args: Event): void {
        let isNodeUnChecked: boolean = false;
        let filterItem: IFilter = { items: [], name: fieldName, type: 'Include' };
        let engineModule: OlapEngine = this.parent.olapEngineModule;
        if (this.parent.dataType === 'olap' && engineModule &&
            !engineModule.fieldList[fieldName].isHierarchy) {
            let cMembers: IMembers = engineModule.fieldList[fieldName].members;
            let sMembers: IMembers = (engineModule as OlapEngine).fieldList[fieldName].currrentMembers;
            filterItem.items = this.memberTreeView.getAllCheckedNodes();
            filterItem.levelCount = engineModule.fieldList[fieldName].levelCount;
            isNodeUnChecked = (filterItem.items.length ===
                (this.memberTreeView.fields.dataSource as { [key: string]: object }[]).length ? false : true);
            if ((engineModule as OlapEngine).fieldList[fieldName].searchMembers.length > 0 && !isNodeUnChecked) {
                let cNodeLength: number = Object.keys(cMembers).length;
                let sNodeLength: number = Object.keys(sMembers).length;
                isNodeUnChecked = cNodeLength === sNodeLength && cNodeLength === filterItem.items.length ? false : true;
            }
            let filterItems: string[] = filterItem.items;
            for (let node of filterItems) {
                if ((engineModule as OlapEngine).fieldList[fieldName].searchMembers.length > 0 && sMembers[node]) {
                    sMembers[node].isSelected = true;
                } else if (cMembers[node]) {
                    cMembers[node].isSelected = true;
                }
            }
        } else {
            for (let item of this.parent.pivotCommon.searchTreeItems) {
                if (item.isSelected) {
                    if (this.parent.pivotCommon.isDateField) {
                        filterItem.items.push(item.name as string);
                    } else {
                        filterItem.items.push((item as any).htmlAttributes['data-memberId'] as string);
                    }
                }
            }
            isNodeUnChecked = (filterItem.items.length === this.parent.pivotCommon.currentTreeItems.length ?
                false : true);
        }
        if (this.parent.dataType === 'olap') {
            this.removeDataSourceSettings(fieldName);
        }
        let filterEventArgs: MemberFilteringEventArgs = {
            filterSettings: filterItem,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            cancel: false
        };
        let control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.memberFiltering, filterEventArgs, (observedArgs: MemberFilteringEventArgs) => {
            filterItem = observedArgs.filterSettings;
            if (!observedArgs.cancel) {
                let filterObject: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
                if (filterObject) {
                    for (let i: number = 0; i < this.parent.dataSourceSettings.filterSettings.length; i++) {
                        if (this.parent.dataSourceSettings.filterSettings[i].name === fieldName) {
                            this.parent.dataSourceSettings.filterSettings.splice(i, 1);
                            break;
                        }
                    }
                }
                this.parent.dataSourceSettings.filterSettings.push(filterItem);
            }
            this.dialogPopUp.close();
            if (!observedArgs.cancel) {
                this.refreshPivotButtonState(fieldName, isNodeUnChecked);
                if (!isNodeUnChecked) {
                    this.removeDataSourceSettings(fieldName);
                }
                this.parent.lastFilterInfo = filterItem;
                this.updateDataSource(true);
                let thisObj: PivotButton = this;
                //setTimeout(() => {
                if (thisObj.parent instanceof PivotFieldList) {
                    thisObj.axisField.render();
                }
                //});
            }
            let pivotButtons: HTMLElement[] = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
            for (let item of pivotButtons) {
                if (item.getAttribute('data-uid') === fieldName) {
                    item.focus();
                    break;
                }
            }
        });
    }
    private refreshPivotButtonState(fieldName: string, isFiltered: boolean): void {
        let pivotButtons: HTMLElement[] = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
        let selectedButton: HTMLElement;
        for (let item of pivotButtons) {
            if (item.getAttribute('data-uid') === fieldName) {
                selectedButton = item.querySelector('.' + cls.FILTER_COMMON_CLASS) as HTMLElement;
                break;
            }
        }
        if (isFiltered) {
            removeClass([selectedButton], cls.FILTER_CLASS);
            addClass([selectedButton], cls.FILTERED_CLASS);
        } else {
            removeClass([selectedButton], cls.FILTERED_CLASS);
            addClass([selectedButton], cls.FILTER_CLASS);
        }
    }
    private removeDataSourceSettings(fieldName: string, selectedField?: string, type?: string): void {
        let filterSettings: IFilter[] = this.parent.dataSourceSettings.filterSettings;
        for (let len: number = 0, lnt: number = filterSettings.length; len < lnt; len++) {
            if (this.parent.dataType === 'olap' && selectedField) {
                if (!type && filterSettings[len].name === fieldName &&
                    filterSettings[len].selectedField === selectedField) {
                    filterSettings.splice(len, 1);
                    break;
                } else if (type) {
                    if (filterSettings[len].type !== type &&
                        filterSettings[len].name === fieldName) {
                        filterSettings.splice(len, 1);
                        lnt--;
                        len--;
                    }
                }
            } else {
                if (filterSettings[len].name === fieldName) {
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
            let element: HTMLElement = closest((e.target as HTMLElement), '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
            addClass([element.querySelector('.' + cls.DROP_INDICATOR_CLASS)], cls.INDICATOR_HOVER_CLASS);
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
        EventHandler.add(element.querySelector('.' + cls.REMOVE_CLASS), 'click', this.removeButton, this);
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
        EventHandler.remove(element.querySelector('.' + cls.REMOVE_CLASS), 'click', this.removeButton);
    }

    /**
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
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.pivotButtonUpdate, this.handlers.load);
    }

    /**
     * To destroy the pivot button event listener
     * @returns {void}
     * @hidden
     */

    public destroy(): void {
        if (this.menuOption) {
            this.menuOption.destroy();
        }
        if (this.valueFiedDropDownList && !this.valueFiedDropDownList.isDestroyed) {
            this.valueFiedDropDownList.destroy();
            this.valueFiedDropDownList = null;
        }
        if (this.columnFieldDropDownList && !this.columnFieldDropDownList.isDestroyed) {
            this.columnFieldDropDownList.destroy();
            this.columnFieldDropDownList = null;
        }
        if (this.memberTreeView && !this.memberTreeView.isDestroyed) {
            this.memberTreeView.destroy();
            this.memberTreeView = null;
        }
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
            this.dialogPopUp = null;
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