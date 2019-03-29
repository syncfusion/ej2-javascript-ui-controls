import { createElement, Draggable, DragEventArgs, remove, extend } from '@syncfusion/ej2-base';
import { EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, addClass, removeClass, closest, Browser } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction, PivotButtonArgs } from '../../common/base/interface';
import { IFieldOptions, IFilter, IField, IDataOptions } from '../../base/engine';
import { Button } from '@syncfusion/ej2-buttons';
import { DragAndDropEventArgs, TreeView, NodeCheckEventArgs, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { Operators, FilterType } from '../../base/types';
import { AggregateMenu } from '../popups/aggregate-menu';
import { AxisFieldRenderer } from '../../pivotfieldlist/renderer/axis-field-renderer';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
/**
 * Module to render Pivot button
 */
/** @hidden */
export class PivotButton implements IAction {
    public parent: PivotView | PivotFieldList;
    private parentElement: HTMLElement;
    private dialogPopUp: Dialog;
    private memberTreeView: TreeView;
    private draggable: Draggable;
    private handlers: { load: Function };
    public menuOption: AggregateMenu;
    private axisField: AxisFieldRenderer;
    private fieldName: string;
    private valueFiedDropDownList: DropDownList;

    /** Constructor for render module */
    constructor(parent: PivotView | PivotFieldList) {
        this.parent = parent;
        this.menuOption = new AggregateMenu(this.parent);
        this.parent.pivotButtonModule = this;
        this.addEventListener();
        if (this.parent instanceof PivotFieldList) {
            this.axisField = new AxisFieldRenderer(this.parent as PivotFieldList);
        }
    }

    /* tslint:disable */
    private renderPivotButton(args: PivotButtonArgs): void {
        let field: IFieldOptions[] = extend([], args.field, null, true) as IFieldOptions[]; let axis: string = args.axis; let axisElement: Element; let valuePos: number = -1;
        let showValuesButton: boolean = (this.parent.getModuleName() == "pivotfieldlist" &&
            (this.parent as PivotFieldList).pivotGridModule) ?
            (this.parent as PivotFieldList).pivotGridModule.showValuesButton : this.parent.showValuesButton;
        if (((this.parent.dataSource.valueAxis === 'row' && args.axis === 'rows') ||
            (this.parent.dataSource.valueAxis === 'column' && args.axis === 'columns')) && showValuesButton && this.parent.dataSource.values.length > 1) {
            valuePos = field.length;
            field.push({
                name: this.parent.localeObj.getConstant('values'), caption: this.parent.localeObj.getConstant('values'),
                axis: args.axis
            });
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
                    if (!element.classList.contains(cls.GROUP_CHART_VALUE)) {
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
                        element = element as HTMLElement
                        if (!element.classList.contains(cls.GROUP_CHART_VALUE)) {
                            let buttonWrapper: HTMLElement = createElement('div', {
                                className: cls.PIVOT_BUTTON_WRAPPER_CLASS + (i === 0 ? ' e-first-btn' : ''),
                                attrs: { 'data-tag': axis + ':' + field[i].name }
                            });
                            let buttonElement: HTMLElement = createElement('div', {
                                id: field[i].name, className: cls.PIVOT_BUTTON_CLASS,
                                attrs: {
                                    'data-uid': field[i].name, 'tabindex': '0', 'isvalue': i === valuePos ? 'true' : 'false',
                                    'aria-disabled': 'false', 'aria-label': field[i].caption ? field[i].caption : field[i].name,
                                    'data-type': field[i].type,
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
                            let dragWrapper: HTMLElement = this.createButtonDragIcon(buttonElement);
                            let contentElement: HTMLElement = this.createButtonText(field, i, axis, valuePos);
                            buttonElement.appendChild(contentElement);
                            if (['filters', 'values'].indexOf(axis) === -1 && valuePos !== i) {
                                this.createSortOption(buttonElement, field[i].name);
                            }
                            if (axis !== 'values' && valuePos !== i) {
                                this.createFilterOption(buttonElement, field[i].name);
                            }
                            if (axis === 'values') {
                                this.getTypeStatus(field, i, buttonElement);
                            }
                            let removeElement: Element = createElement('span', {
                                attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                                className: cls.ICON + ' ' + cls.REMOVE_CLASS
                            });
                            if (this.parent.getModuleName() === 'pivotview') {
                                if ((this.parent as PivotView).groupingBarSettings.showRemoveIcon) {
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
                            pivotButton.appendTo(buttonElement);
                            this.unWireEvent(buttonWrapper, i === valuePos ? 'values' : axis);
                            this.wireEvent(buttonWrapper, i === valuePos ? 'values' : axis);
                            if ((this.parent.getModuleName() === 'pivotview' && !this.parent.isAdaptive) ||
                                this.parent.getModuleName() === 'pivotfieldlist') {
                                this.createDraggable(this.parent.getModuleName() === 'pivotview' ? contentElement : dragWrapper);
                            }
                        }
                    }
                }
                if (axis === 'values') {
                    for (let element of this.parentElement.querySelectorAll('.e-group-' + axis) as any) {
                        if (element.classList.contains(cls.GROUP_CHART_VALUE)) {
                            let valueData: { text: string, value: string }[] = field.map((item) => { return { text: item.caption ? item.caption : item.name, value: item.name } });
                            let parent: PivotView = this.parent as PivotView;
                            if (this.valueFiedDropDownList && element.querySelector('.' + cls.GROUP_CHART_VALUE_DROPDOWN_DIV)) {
                                this.valueFiedDropDownList.dataSource = valueData;
                                this.valueFiedDropDownList.value = !parent.chartSettings.enableMultiAxis ?
                                    parent.chartModule.currentMeasure : valueData[0].value;
                            } else {
                                let ddlDiv: HTMLElement = createElement('div', { className: cls.GROUP_CHART_VALUE_DROPDOWN_DIV });
                                element.appendChild(ddlDiv);
                                this.valueFiedDropDownList = new DropDownList({
                                    dataSource: valueData,
                                    enableRtl: this.parent.enableRtl,
                                    value: !parent.chartSettings.enableMultiAxis ?
                                        parent.chartModule.currentMeasure : valueData[0].value,
                                    width: 200,
                                    fields: { value: 'value', text: 'text' },
                                    cssClass: cls.GROUP_CHART_VALUE_DROPDOWN,
                                    change(args: ChangeEventArgs): void {
                                        if (args.e && args.e !== null) {
                                            parent.chartSettings.value = args.value as string;
                                        }
                                    }
                                });
                                this.valueFiedDropDownList.appendTo(ddlDiv);
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
        if (axis === "filters") {
            filterMem = this.updateButtontext(field[i].name);
        }
        if (this.parent.engineModule.fieldList[field[i].name] !== undefined) {
            aggregation = this.parent.engineModule.fieldList[field[i].name].aggregateType;
            if (aggregation === undefined && (this.parent.engineModule.fieldList[field[i].name].type === 'string' || this.parent.engineModule.fieldList[field[i].name].type === 'include' ||
                this.parent.engineModule.fieldList[field[i].name].type === 'exclude')) {
                aggregation = 'Count';
            } else if (aggregation === undefined) {
                aggregation = this.parent.engineModule.fieldList[field[i].name].aggregateType !== undefined ?
                    this.parent.engineModule.fieldList[field[i].name].aggregateType : 'Sum';
            }
        }
        let text: string = field[i].caption ? field[i].caption : field[i].name;
        buttonText = createElement('span', {
            attrs: {
                title: axis === 'filters' ? (text + ' (' + filterMem + ')') : (((!this.parent.dataSource.showAggregationOnValueField || axis !== 'values' || aggregation === 'CalculatedField') ? text : this.parent.localeObj.getConstant(aggregation) + ' ' + 'of' + ' ' + text)),
                'tabindex': '-1', 'aria-disabled': 'false', 'oncontextmenu': 'return false;',
                'data-type': valuePos === i ? '' : aggregation
            },
            className: cls.PIVOT_BUTTON_CONTENT_CLASS + ' ' +
                (this.parent.getModuleName() === 'pivotview' && !(this.parent as PivotView).groupingBarSettings.allowDragAndDrop ? 'e-disable-drag' : ''),
            innerHTML: axis === 'filters' ? (text + ' (' + filterMem + ')') : (!this.parent.dataSource.showAggregationOnValueField || axis !== 'values' || aggregation === 'CalculatedField' ? text : this.parent.localeObj.getConstant(aggregation) + ' ' + 'of' + ' ' + text)
        });
        return buttonText;
    }
    private getTypeStatus(field: IFieldOptions[], i: number, buttonElement: HTMLElement): void {
        let fieldListItem: IField = this.parent.engineModule.fieldList[field[i].name];
        if (fieldListItem.aggregateType !== 'CalculatedField' &&
            fieldListItem.type === 'number') {
            this.createSummaryType(buttonElement, field[i].name);
        }
    }
    private createSummaryType(pivotButton: HTMLElement, fieldName: string): Element {
        let spanElement: Element = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: cls.ICON + ' ' + cls.AXISFIELD_ICON_CLASS
        });
        if (this.parent.getModuleName() === 'pivotview') {
            if ((this.parent as PivotView).groupingBarSettings.showValueTypeIcon) {
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
    private createDraggable(target: HTMLElement): void {
        this.draggable = new Draggable(target, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this),
            dragStart: this.onDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onDragStop.bind(this),
            abort: (this.parent.getModuleName() === 'pivotview' && !(this.parent as PivotView).groupingBarSettings.allowDragAndDrop ? '.' + cls.PIVOT_BUTTON_CLASS : '')
        });
    }
    private createButtonDragIcon(pivotButton: HTMLElement): HTMLElement {
        let dragWrapper: HTMLElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' }
        });
        let dragElement: HTMLElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: cls.ICON + ' ' + cls.DRAG_CLASS
        });
        dragWrapper.appendChild(dragElement);
        pivotButton.appendChild(dragWrapper);
        return dragWrapper;
    }
    private createSortOption(pivotButton: HTMLElement, fieldName: string): Element {
        let sortCLass: string;
        if (!this.parent.allowDeferLayoutUpdate) {
            sortCLass = this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
        } else {
            sortCLass = '';
            for (let i: number = 0; i < this.parent.dataSource.sortSettings.length; i++) {
                if (this.parent.dataSource.sortSettings[i].name === fieldName) {
                    sortCLass = this.parent.dataSource.sortSettings[i].order === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
                }
            }
        }
        let spanElement: Element = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: cls.ICON + ' ' + cls.SORT_CLASS + ' ' + sortCLass
        });
        if (this.parent.dataSource.enableSorting) {
            removeClass([spanElement], cls.ICON_DISABLE);
        } else {
            addClass([spanElement], cls.ICON_DISABLE);
        }
        if (this.parent.getModuleName() === 'pivotview') {
            if ((this.parent as PivotView).groupingBarSettings.showSortIcon) {
                removeClass([spanElement], cls.ICON_DISABLE);
            } else {
                addClass([spanElement], cls.ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    private createFilterOption(pivotButton: HTMLElement, fieldName: string): Element {
        let filterCLass: string;
        if (!this.parent.allowDeferLayoutUpdate) {
            filterCLass = this.parent.engineModule.fieldList[fieldName].filter.length === 0 ?
                !this.parent.engineModule.fieldList[fieldName].isExcelFilter ? cls.FILTER_CLASS : cls.FILTERED_CLASS : cls.FILTERED_CLASS;
        } else {
            filterCLass = cls.FILTER_CLASS;
            for (let i: number = 0; i < this.parent.dataSource.filterSettings.length; i++) {
                if (this.parent.dataSource.filterSettings[i].name === fieldName) {
                    filterCLass = cls.FILTERED_CLASS;
                }
            }
        }
        let spanElement: Element = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: cls.FILTER_COMMON_CLASS + ' ' + cls.ICON + ' ' + filterCLass
        });
        if (this.parent.getModuleName() === 'pivotview') {
            if ((this.parent as PivotView).groupingBarSettings.showFilterIcon) {
                removeClass([spanElement], cls.ICON_DISABLE);
            } else {
                addClass([spanElement], cls.ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
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
    private onDragStart(e: DragEventArgs): void {
        this.parent.isDragging = true;
        let element: Element = closest(e.element, '.' + cls.PIVOT_BUTTON_CLASS);
        let data: IField = this.parent.engineModule.fieldList[element.getAttribute('data-uid')];
        let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        addClass([element], cls.SELECTED_NODE_CLASS);
        if (data && data.aggregateType === 'CalculatedField') {
            for (let axisContent of axis) {
                addClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
            }
        }
    }
    private onDragging(e: DragEventArgs): void {
        this.draggable.setProperties({ cursorAt: { top: (!isNOU(e.event.targetTouches) || Browser.isDevice) ? 60 : -20, } });
        // if (closest(e.event.srcElement, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS)) {
        //     let droppableElement: HTMLElement = closest(e.event.srcElement, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        //     let buttonElement: HTMLElement = closest(e.event.srcElement, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
        //     if (droppableElement.offsetHeight < droppableElement.scrollHeight) {
        //         let scrollPosition: number = (droppableElement.scrollHeight - buttonElement.offsetTop);
        //         if (buttonElement.offsetTop >= droppableElement.offsetTop && scrollPosition > droppableElement.scrollTop) {
        //             droppableElement.scrollTop += Math.abs(buttonElement.offsetHeight);
        //         } else if (buttonElement.offsetTop <= droppableElement.offsetTop) {
        //             droppableElement.scrollTop -= Math.abs(buttonElement.offsetHeight);
        //         }
        //     }
        // }
    }
    private onDragStop(args: DragEventArgs & DragAndDropEventArgs): void {
        this.parent.isDragging = false;
        if (args.target.classList && (args.target.classList.contains(cls.GROUP_CHART_VALUE) || args.target.classList.contains(cls.GROUP_CHART_VALUE_DROPDOWN))) {
            args.target = this.parent.element.querySelector('.' + cls.GROUP_CHART_ROW);
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
        if (!this.isButtonDropped(args.target, element as HTMLElement)) { return; }
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            ((this.parent as PivotFieldList).pivotGridModule ? (this.parent as PivotFieldList).pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, element.id)) {
            this.updateDataSource();
            this.parent.axisFieldModule.render();
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
        if (((this.parent.getModuleName() === 'pivotview' && (this.parent as PivotView).enableValueSorting) ||
            (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).pivotGridModule !== undefined &&
                (this.parent as PivotFieldList).pivotGridModule.enableValueSorting)) &&
            (args.target as HTMLElement).parentElement.parentElement.getAttribute('data-tag').split(':')[0] === 'rows') {
            this.parent.setProperties({ dataSource: { valueSortSettings: { headerText: '' } } }, true);
        }
        this.parent.pivotCommon.eventBase.updateSorting(args);
        this.updateDataSource(true);
    }
    private updateDataSource(isRefreshGrid?: boolean): void {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshGrid);
        } else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') {
                (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
                (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
                (this.parent as PivotFieldList).
                    pivotGridModule.setProperties({ dataSource: (<{ [key: string]: Object }>this.parent.dataSource).properties as IDataOptions }, true);
            } else {
                (this.parent as PivotFieldList).triggerPopulateEvent();
            }
        }
    }
    private updateFiltering(args: MouseEventArgs): void {
        this.parent.pivotCommon.eventBase.updateFiltering(args);
        let target: HTMLElement = args.target as HTMLElement;
        this.fieldName = target.parentElement.id;
        this.dialogPopUp = this.parent.pivotCommon.filterDialog.dialogPopUp;
        this.memberTreeView = this.parent.pivotCommon.filterDialog.memberTreeView;
        this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        this.parent.pivotCommon.filterDialog.allMemberSelect.nodeChecked = this.nodeStateModified.bind(this);
        this.bindDialogEvents();
    }
    private bindDialogEvents(): void {
        if (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter && this.parent.pivotCommon.filterDialog.tabObj) {
            this.updateDialogButtonEvents(this.parent.pivotCommon.filterDialog.tabObj.selectedItem);
            this.dialogPopUp.buttons[1].click = this.ClearFilter.bind(this);
            this.parent.pivotCommon.filterDialog.tabObj.selected = this.tabSelect.bind(this);
        } else {
            this.updateDialogButtonEvents(0);
        }
    }
    private tabSelect(e: SelectEventArgs): void {
        this.updateDialogButtonEvents(e.selectedIndex);
        removeClass([].slice.call(this.dialogPopUp.element.querySelectorAll('.e-selected-tab')), 'e-selected-tab');
        if (e.selectedIndex > 0) {
            /* tslint:disable-next-line:max-line-length */
            addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (e.selectedIndex === 1 && this.parent.dataSource.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
        }
        if (e.selectedIndex === 0) {
            this.parent.pivotCommon.filterDialog.updateCheckedState();
        } else {
            this.dialogPopUp.buttons[0].buttonModel.disabled = false;
            this.dialogPopUp.element.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
        }
    }
    private updateDialogButtonEvents(index: number): void {
        this.dialogPopUp.buttons[0].click = (index === 0 ?
            this.updateFilterState.bind(this, this.fieldName) : this.updateCustomFilter.bind(this));
    }
    private updateCustomFilter(args: Event): void {
        let dialogElement: HTMLElement =
            this.dialogPopUp.element.querySelector('.e-selected-tab') as HTMLElement;
        let fieldName: string = dialogElement.getAttribute('data-fieldname');
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
            value1: filterType === 'date' ? new Date(operand1) : operand1 as string,
            value2: filterType === 'date' ? new Date(operand2) : operand2 as string
        };
        if ((isNOU(operand1) || operand1 === '') ||
            (['Between', 'NotBetween'].indexOf(operator) > -1 && (isNOU(operand2) || operand2 === ''))) {
            let inputElementString: string =
                (type.toLowerCase() + ((isNOU(operand1) || operand1 === '') ? '_input_option_1' : '_input_option_2'));
            let focusElement: HTMLElement = dialogElement.querySelector('#' + this.parent.element.id + '_' + inputElementString);
            addClass([focusElement], cls.EMPTY_FIELD);
            focusElement.focus();
            return;
        }
        let filterObject: IFilter = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        if (filterObject) {
            // this.removeDataSourceSettings(fieldName);
            filterObject = (<{ [key: string]: Object }>filterObject).properties ?
                (<{ [key: string]: Object }>filterObject).properties : filterObject;
            filterObject.type = type;
            filterObject.measure = measure;
            filterObject.condition = operator as Operators;
            filterObject.value1 = filterType === 'date' ? new Date(operand1) : operand1 as string;
            filterObject.value2 = filterType === 'date' ? new Date(operand2) : operand2 as string;
        } else {
            this.parent.dataSource.filterSettings.push(filterItem);
        }
        if (type !== 'Value') {
            this.parent.lastFilterInfo = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        }
        this.dialogPopUp.close();
        this.refreshPivotButtonState(fieldName, true);
        this.updateDataSource(true);
    }
    private ClearFilter(e: Event): void {
        let dialogElement: HTMLElement = this.dialogPopUp.element;
        let fieldName: string = dialogElement.getAttribute('data-fieldname');
        this.dialogPopUp.close();
        this.removeDataSourceSettings(fieldName);
        this.refreshPivotButtonState(fieldName, false);
        this.updateDataSource(true);
    }
    private removeButton(args: Event): void {
        let target: HTMLElement = args.target as HTMLElement;
        let fieldName: string = target.parentElement.id;
        if (target.parentElement.getAttribute('isvalue') === 'true') {
            this.parent.setProperties({ dataSource: { values: [] } }, true);
        } else {
            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(fieldName);
        }
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parent.axisFieldModule.render();
        }
        this.updateDataSource();
    }
    private nodeStateModified(args: NodeCheckEventArgs): void {
        let target: Element = args.node.parentElement.parentElement;
        if (target.getAttribute('data-uid') === 'all') {
            this.memberTreeView.nodeChecked = null;
            if (args.action === 'check') {
                this.memberTreeView.checkAll();
            } else {
                this.memberTreeView.uncheckAll();
            }
            this.checkedStateAll(args.action);
            this.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        } else {
            let pos: number = this.parent.pivotCommon.currentTreeItemsPos[args.data[0].id as string];
            if (args.action === 'check') {
                this.parent.pivotCommon.currentTreeItems[pos].checkedStatus = true;
            } else {
                this.parent.pivotCommon.currentTreeItems[pos].checkedStatus = false;
            }
        }
        this.parent.pivotCommon.filterDialog.updateCheckedState();
    }
    private checkedStateAll(state: string): void {
        let searchItemObj: { [key: string]: string } = {};
        for (let item of this.parent.pivotCommon.searchTreeItems) {
            item.checkedStatus = state === 'check';
            searchItemObj[(item as any).id] = (item as any).id;
        }
        for (let item of this.parent.pivotCommon.currentTreeItems) {
            if (searchItemObj[(item as any).id] !== undefined) {
                item.checkedStatus = state === 'check';
            }
        }
    }
    private updateFilterState(fieldName: string, args: Event): void {
        let isNodeUnChecked: boolean = false;
        let filterItem: IFilter = { items: [], name: fieldName, type: 'Include' };
        for (let item of this.parent.pivotCommon.searchTreeItems) {
            if (item.checkedStatus) {
                if (this.parent.pivotCommon.isDateField) {
                    filterItem.items.push(item.name as string);
                } else {
                    filterItem.items.push(item.id as string);
                }
            }
        }
        isNodeUnChecked = (filterItem.items.length === this.parent.pivotCommon.currentTreeItems.length ?
            false : true);
        let filterObject: IFilter = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        if (filterObject) {
            for (let i: number = 0; i < this.parent.dataSource.filterSettings.length; i++) {
                if (this.parent.dataSource.filterSettings[i].name === fieldName) {
                    this.parent.dataSource.filterSettings.splice(i, 1);
                    break;
                }
            }
            this.parent.dataSource.filterSettings.push(filterItem);
        } else {
            this.parent.dataSource.filterSettings.push(filterItem);
        }
        this.dialogPopUp.close();
        this.refreshPivotButtonState(fieldName, isNodeUnChecked);
        if (!isNodeUnChecked) {
            this.removeDataSourceSettings(fieldName);
        }
        this.parent.lastFilterInfo = filterItem;
        this.updateDataSource(true);
        if (this.parent instanceof PivotFieldList) {
            this.axisField.render();
        }
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
    private removeDataSourceSettings(fieldName: string): void {
        let filterSettings: IFilter[] = this.parent.dataSource.filterSettings;
        for (let len: number = 0, lnt: number = filterSettings.length; len < lnt; len++) {
            if (filterSettings[len].name === fieldName) {
                filterSettings.splice(len, 1);
                break;
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
    private wireEvent(element: Element, axis: string): void {
        EventHandler.add(element, 'mouseover', this.updateDropIndicator, this);
        if (['filters', 'values'].indexOf(axis) === -1) {
            EventHandler.add(element.querySelector('.' + cls.SORT_CLASS), 'click', this.updateSorting, this);
        }
        if (axis !== 'values') {
            EventHandler.add(element.querySelector('.' + cls.FILTER_COMMON_CLASS), 'click', this.updateFiltering, this);
        }
        if (axis === 'values' && element.querySelector('.' + cls.AXISFIELD_ICON_CLASS) !== null) {
            EventHandler.add(element.querySelector('.' + cls.AXISFIELD_ICON_CLASS), 'click', this.createMenuOption, this);
        }
        EventHandler.add(element.querySelector('.' + cls.REMOVE_CLASS), 'click', this.removeButton, this);
    }
    private unWireEvent(element: Element, axis: string): void {
        EventHandler.remove(element, 'mouseover', this.updateDropIndicator);
        if (['filters', 'values'].indexOf(axis) === -1) {
            EventHandler.remove(element.querySelector('.' + cls.SORT_CLASS), 'click', this.updateSorting);
        }
        if (axis !== 'values') {
            EventHandler.remove(element.querySelector('.' + cls.FILTER_COMMON_CLASS), 'click', this.updateFiltering);
        }
        if (axis === 'values' && element.querySelector('.' + cls.AXISFIELD_ICON_CLASS) !== null) {
            EventHandler.remove(element.querySelector('.' + cls.AXISFIELD_ICON_CLASS), 'click', this.createMenuOption);
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
     * @return {void}
     * @hidden
     */

    public destroy(): void {
        this.menuOption.destroy();
        this.removeEventListener();
    }
    // To update button text

    private updateButtontext(fieldName: string): string {
        let filterCount: number = this.parent.engineModule.fieldList[fieldName].filter.length;
        let filterType: string = this.parent.engineModule.fieldList[fieldName].filterType;
        let memLen: number = this.parent.engineModule.fieldList[fieldName].dateMember.length;
        let filterMem: string;
        let firstNode: string = this.parent.engineModule.fieldList[fieldName].filter[0];
        if (filterType === "include") {
            if (filterCount === 1) {
                filterMem = firstNode;
            }
            else if (filterCount > 1) {
                if (filterCount === memLen) {
                    filterMem = this.parent.localeObj.getConstant('all');
                }
                else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            }
        }
        else if (filterType === "exclude") {
            if (filterCount === 1) {
                if (memLen === 2) {
                    if (firstNode !== this.parent.engineModule.fieldList[fieldName].dateMember[0].actualText) {
                        filterMem = firstNode;
                    }
                    else {
                        filterMem = this.parent.engineModule.fieldList[fieldName].dateMember[0].actualText as string;
                    }
                }
                else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            }
            else if (filterCount > 1) {
                let j: number;
                let allNodes: string[] = Object.keys(this.parent.engineModule.fieldList[fieldName].members);
                let filteredItems: string[] = this.parent.engineModule.fieldList[fieldName].filter;
                if (filterCount === (allNodes.length - 1)) {
                    loop: for (j = 0; j < allNodes.length; j++) {
                        let test: string = allNodes[j];
                        let x: number = filteredItems.indexOf(test);
                        if (x === -1) {
                            filterMem = allNodes[j];
                            break loop;
                        }
                    }
                }
                else {
                    filterMem = this.parent.localeObj.getConstant('multipleItems');
                }
            }
        }
        else {
            filterMem = this.parent.localeObj.getConstant('all');
        }
        return filterMem;
    }
}