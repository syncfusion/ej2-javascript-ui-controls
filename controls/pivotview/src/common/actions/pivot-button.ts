import { createElement, Draggable, DragEventArgs, remove, extend } from '@syncfusion/ej2-base';
import { EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, addClass, removeClass, closest, Browser } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction, PivotButtonArgs } from '../../common/base/interface';
import { IFieldOptions, IFilter, IField } from '../../base/engine';
import { Button } from '@syncfusion/ej2-buttons';
import { DragAndDropEventArgs, TreeView, NodeCheckEventArgs, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { Operators, FilterType } from '../../base/types';

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

    /** Constructor for render module */
    constructor(parent: PivotView | PivotFieldList) {
        this.parent = parent;
        this.parent.pivotButtonModule = this;
        this.addEventListener();
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
                let axisPrompt: HTMLElement = createElement('span', {
                    className: cls.AXIS_PROMPT_CLASS,
                    innerHTML: axis === 'rows' ? this.parent.localeObj.getConstant('rowAxisPrompt') :
                        axis === 'columns' ? this.parent.localeObj.getConstant('columnAxisPrompt') :
                            axis === 'values' ? this.parent.localeObj.getConstant('valueAxisPrompt') :
                                this.parent.localeObj.getConstant('filterAxisPrompt')
                });
                axisElement.appendChild(axisPrompt);
            } else {
                for (let i: number = 0, cnt: number = field.length; i < cnt; i++) {
                    let buttonWrapper: HTMLElement = createElement('div', {
                        className: cls.PIVOT_BUTTON_WRAPPER_CLASS + (i === 0 ? ' e-first-btn' : ''),
                        attrs: { 'data-tag': axis + ':' + field[i].name }
                    });
                    let buttonElement: HTMLElement = createElement('div', {
                        id: field[i].name, className: cls.PIVOT_BUTTON_CLASS,
                        attrs: {
                            'data-uid': field[i].name, 'tabindex': '0', 'isvalue': i === valuePos ? 'true' : 'false',
                            'aria-disabled': 'false', 'aria-label': field[i].caption ? field[i].caption : field[i].name
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
                    let contentElement: HTMLElement = createElement('span', {
                        attrs: {
                            'tabindex': '-1', 'aria-disabled': 'false', 'oncontextmenu': 'return false;',
                            'data-type': valuePos === i ? '' : this.parent.engineModule.fieldList[field[i].name].aggregateType
                        },
                        className: cls.PIVOT_BUTTON_CONTENT_CLASS,
                        innerHTML: field[i].caption ? field[i].caption : field[i].name
                    });
                    buttonElement.appendChild(contentElement);
                    if (['filters', 'values'].indexOf(axis) === -1 && valuePos !== i) {
                        this.createSortOption(buttonElement, field[i].name);
                    }
                    if (axis !== 'values' && valuePos !== i) {
                        this.createFilterOption(buttonElement, field[i].name);
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
                    axisElement.appendChild(buttonWrapper);
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
        } else {
            return;
        }
    }
    private createDraggable(target: HTMLElement): void {
        this.draggable = new Draggable(target, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this),
            dragStart: this.onDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onDragStop.bind(this)
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
        let sortCLass: string = this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ? cls.SORT_DESCEND_CLASS : '';
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
        let filterCLass: string = this.parent.engineModule.fieldList[fieldName].filter.length === 0 ?
            !this.parent.engineModule.fieldList[fieldName].isExcelFilter ? cls.FILTER_CLASS : cls.FILTERED_CLASS : cls.FILTERED_CLASS;
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
        if (!this.isButtonDropped(args.target, element as HTMLElement)) { return; }
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            ((this.parent as PivotFieldList).pivotGridModule ? (this.parent as PivotFieldList).pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, element.id)) {
            this.parent.updateDataSource();
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
            this.parent.dataSource.valueSortSettings.headerText = '';
        }
        this.parent.pivotCommon.eventBase.updateSorting(args);
        this.parent.updateDataSource(true);
    }
    private updateFiltering(args: MouseEventArgs): void {
        this.parent.pivotCommon.eventBase.updateFiltering(args);
        let target: HTMLElement = args.target as HTMLElement;
        let fieldName: string = target.parentElement.id;
        this.dialogPopUp = this.parent.pivotCommon.filterDialog.dialogPopUp;
        this.memberTreeView = this.parent.pivotCommon.filterDialog.memberTreeView;
        this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        this.parent.pivotCommon.filterDialog.allMemberSelect.nodeChecked = this.nodeStateModified.bind(this);
        this.bindDialogEvents(fieldName);
    }
    private bindDialogEvents(fieldName: string): void {
        if (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter && this.parent.pivotCommon.filterDialog.tabObj) {
            this.updateDialogButtonEvents(this.parent.pivotCommon.filterDialog.tabObj.selectedItem, fieldName);
            this.dialogPopUp.buttons[1].click = this.ClearFilter.bind(this);
            this.parent.pivotCommon.filterDialog.tabObj.selected = (e: SelectEventArgs) => {
                this.updateDialogButtonEvents(e.selectedIndex, fieldName);
                removeClass([].slice.call(this.dialogPopUp.element.querySelectorAll('.e-selected-tab')), 'e-selected-tab');
                if (e.selectedIndex > 0) {
                    /* tslint:disable-next-line:max-line-length */
                    addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (e.selectedIndex === 1 && this.parent.dataSource.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
                }
            };
        } else {
            this.updateDialogButtonEvents(0, fieldName);
        }
    }
    private updateDialogButtonEvents(index: number, fieldName: string): void {
        this.dialogPopUp.buttons[0].click = (index === 0 ?
            this.updateFilterState.bind(this, fieldName) : this.updateCustomFilter.bind(this));
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
        this.dialogPopUp.hide();
        this.refreshPivotButtonState(fieldName, true);
        this.parent.updateDataSource(true);
    }
    private ClearFilter(e: Event): void {
        let dialogElement: HTMLElement = this.dialogPopUp.element;
        let fieldName: string = dialogElement.getAttribute('data-fieldname');
        this.dialogPopUp.hide();
        this.removeDataSourceSettings(fieldName);
        this.refreshPivotButtonState(fieldName, false);
        this.parent.updateDataSource(true);
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
        this.parent.updateDataSource();
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
            this.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        }
        this.parent.pivotCommon.filterDialog.updateCheckedState();
    }
    private updateFilterState(fieldName: string, args: Event): void {
        let list: HTMLElement[] = [].slice.call(this.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
        let unCheckedNodeCount: number = 0;
        let filterItem: IFilter = { items: [], name: fieldName, type: 'Include' };
        for (let i: number = 0, cnt: number = list.length; i < cnt; i++) {
            if (list[i].querySelector('.' + cls.CHECK_BOX_FRAME_CLASS).classList.contains(cls.NODE_CHECK_CLASS)) {
                filterItem.items.push(list[i].getAttribute('data-uid'));
            } else {
                unCheckedNodeCount = unCheckedNodeCount + 1;
            }
        }
        let filterObject: IFilter = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        if (filterObject) {
            filterObject = (<{ [key: string]: Object }>filterObject).properties ?
                (<{ [key: string]: Object }>filterObject).properties : filterObject;
            filterObject.items = filterItem.items;
            filterObject.type = filterItem.type;
        } else {
            this.parent.dataSource.filterSettings.push(filterItem);
        }
        this.dialogPopUp.hide();
        this.refreshPivotButtonState(fieldName, (unCheckedNodeCount > 0) ? true : false);
        if (unCheckedNodeCount === 0) {
            this.removeDataSourceSettings(fieldName);
        }
        this.parent.updateDataSource(true);
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
        this.removeEventListener();
    }
}