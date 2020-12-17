import { SfPivotView } from '../pivotview/sf-pivotview-fn';
import { SfPivotFieldList } from '../pivotfieldlist/sf-pivotfieldlist-fn';
import * as cls from '../common/constants';
import {
    closest, Browser, removeClass, EventHandler, isNullOrUndefined,
    Draggable, addClass, DragEventArgs, createElement, BlazorDragEventArgs, remove, Droppable, detach
} from '@syncfusion/ej2-base';
import { DragStopEventArgs } from '@syncfusion/ej2-popups';
import { IFieldOptions, FieldItemInfo } from '../../src/base/engine';
import { IOlapField } from '../../src/base/olap/engine';
import { FieldDragStartEventArgs } from '../../src/common/base/interface';

/**
 * The `Grouping` module is used to show or hide columns dynamically.
 */
export class PivotButton {
    public parent: SfPivotView | SfPivotFieldList;
    private draggable: Draggable;

    constructor(parent: SfPivotView | SfPivotFieldList) {
        this.parent = parent;
        this.parent.pivotButtonModule = this;
    }

    public createPivotButtonDrop(): void {
        for (let element of [].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.AXIS_CONTENT_CLASS))) {
            new Droppable(element, {});
            this.unWireEvents(element);
            this.wireEvents(element);
        }
    }

    public setPivotButtonDrag(): void {
        for (let element of [].slice.call(this.parent.parentElement.querySelectorAll('.' + (this.parent instanceof SfPivotView ? cls.GROUPING_BAR_CLASS : cls.PIVOT_FIELD_LIST_CLASS) + '-button'))) {
            let buttonElement: Element = element.querySelector('.' + cls.PIVOT_BUTTON_CLASS);
            this.parent.pivotButtonModule.createDraggable(false, this.parent instanceof SfPivotView ?
                buttonElement.querySelector('.' + cls.PIVOT_BUTTON_CONTENT_CLASS) : buttonElement.firstElementChild as HTMLElement, JSON.parse(buttonElement.getAttribute('data-fieldInfo')));
        }
    }

    public createDraggable(isTreeElement: boolean, element: HTMLElement, field: IFieldOptions): void {
        this.draggable = new Draggable(element, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this, field),
            dragStart: this.onDragStart.bind(this, isTreeElement),
            drag: (e: DragEventArgs) => {
                this.draggable.setProperties({ cursorAt: { top: (!isNullOrUndefined(e.event.targetTouches) || Browser.isDevice) ? 60 : -20, } });
            },
            dragStop: this.onDragStop.bind(this, isTreeElement),
            abort: (this.parent instanceof SfPivotView ? !(this.parent.groupingBarSettings.allowDragAndDrop && field.allowDragAndDrop) ?
                '.' + cls.PIVOT_BUTTON_CLASS : '' : !field.allowDragAndDrop ? '.' + cls.PIVOT_BUTTON_CLASS : '')
        });
        if (!isTreeElement) {
            this.unWireEvents(element);
            this.wireEvents(element);
        }
    }

    private createDragClone(field: IFieldOptions): HTMLElement {
        let cloneElement: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: cls.DRAG_CLONE_CLASS
        });
        let contentElement: HTMLElement = createElement('span', {
            className: cls.TEXT_CONTENT_CLASS,
            innerHTML: field ? field.caption ? field.caption : field.name : ''
        });
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    }

    private onDragStart(isTreeElement: boolean, e: DragEventArgs & BlazorDragEventArgs): void {
        let element: Element = closest(e.element, '.' + (isTreeElement ? cls.LIST_ITEM : cls.PIVOT_BUTTON_CLASS));
        (this.parent.dotNetRef as any).invokeMethodAsync('TriggerNodeDraggingEvent', element.getAttribute('data-uid')).then((eventArgs: FieldDragStartEventArgs) => {
            if (!eventArgs.cancel) {
                this.parent.isDragging = true;
                let data: IOlapField = this.parent.fieldList[element.getAttribute('data-uid')];
                let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
                addClass([isTreeElement ? element.querySelector('.' + cls.LIST_TEXT_CLASS) : element], cls.SELECTED_NODE_CLASS);
                if (data && data.aggregateType === 'CalculatedField') {
                    for (let axisContent of axis) {
                        addClass([this.parent.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                    }
                }
                e.bindEvents(e.dragElement);
            } else {
                this.parent.isDragging = false;
                this.draggable.intDestroy(e.event);
                detach(document.getElementById(this.parent.element.id + '_DragClone'));
            }
        });
    }

    private onDragStop(isTreeElement: boolean, args: DragEventArgs & DragStopEventArgs): void {
        this.parent.isDragging = false;
        let cancel: boolean = false;
        if (!isTreeElement && args.target.classList &&
            (args.target.classList.contains(cls.GROUP_CHART_VALUE) || args.target.classList.contains(cls.GROUP_CHART_VALUE_DROPDOWN))) {
            args.target = this.parent.element.querySelector('.' + cls.GROUP_CHART_ROW);
        }
        if (!isTreeElement && args.target.classList && args.element &&
            (args.target.classList.contains(cls.GROUP_CHART_COLUMN) || args.target.classList.contains(cls.GROUP_CHART_COLUMN_DROPDOWN))) {
            cancel = true;
        }
        let element: Element = closest(args.element, '.' + (isTreeElement ? cls.LIST_ITEM : cls.PIVOT_BUTTON_CLASS));
        if (this.parent.parentElement.querySelector('.' + cls.SELECTED_NODE_CLASS)) {
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.SELECTED_NODE_CLASS)), cls.SELECTED_NODE_CLASS);
        }
        let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (let axisContent of axis) {
            removeClass([this.parent.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
        }
        removeClass([isTreeElement ? element.querySelector('.' + cls.LIST_TEXT_CLASS) : element], cls.SELECTED_NODE_CLASS);
        if (document.getElementById(this.parent.element.id + '_DragClone')) {
            remove(args.helper ? args.helper : document.getElementById(this.parent.element.id + '_DragClone'));
        }
        document.body.style.cursor = 'auto';
        if (!this.isNodeDropped(isTreeElement, args, element) || !isTreeElement && cancel) {
            return;
        }
        this.nodeStateModified(isTreeElement, args, cancel, element.getAttribute('data-uid'));
    }

    private nodeStateModified(isTreeElement: boolean, args: DragEventArgs, cancel: boolean, fieldName: string): void {
        /* tslint:disable */
        let target: string = closest(args.target, '.' + cls.DROPPABLE_CLASS) ? JSON.stringify((window as any).sfBlazor.getDomObject('dropTarget', closest(args.target, '.' + cls.DROPPABLE_CLASS))) : undefined;
        let element: string = isTreeElement ? undefined : JSON.stringify((window as any).sfBlazor.getDomObject('element', args.element.parentElement));
        this.parent.dotNetRef.invokeMethodAsync('OnFieldDropped', (window as any).sfBlazor.getDomObject('target', args.target).xPath, target, element, isTreeElement || cancel ? true : false, fieldName);
        /* tslint:enable */
    }

    private isNodeDropped(isTreeElement: boolean, args: DragEventArgs, element: Element): boolean {
        let isDropped: boolean = true;
        let targetID: string = element.getAttribute('data-uid');
        if ((this.parent.fieldList[targetID] && this.parent.fieldList[targetID].isSelected) || !isTreeElement) {
            let target: Element = isTreeElement ? this.getButton(targetID) : element;
            let axisPanel: HTMLElement = closest(target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            let droppableElement: HTMLElement = closest(args.target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            if (target && axisPanel === droppableElement) {
                let pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                let dropTarget: HTMLElement = closest(args.target, '.' + cls.PIVOT_BUTTON_DIV_CLASS) as HTMLElement;
                let sourcePosition: number;
                let dropPosition: number = -1;
                for (let i: number = 0; i < pivotButtons.length; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        let droppableButton: HTMLElement = dropTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS);
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || sourcePosition === pivotButtons.length - 1 && dropPosition === -1) {
                    /* tslint:disable-next-line:max-line-length */
                    removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    }

    private getButton(fieldName: string): Element {
        for (let buttonElement of [].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS))) {
            if ((buttonElement as HTMLElement).id === fieldName) {
                return buttonElement as Element;
            }
        }
        return undefined;
    }

    public getButtonPosition(target: HTMLElement, droppedClass: string): number {
        let buttonElement: HTMLElement = closest(target, '.' + cls.PIVOT_BUTTON_DIV_CLASS) as HTMLElement;
        if (buttonElement) {
            buttonElement = buttonElement.querySelector('.' + cls.PIVOT_BUTTON_CLASS);
            /* tslint:disable-next-line:max-line-length */
            let pivotButtons: HTMLElement[] = [].slice.call(this.parent.parentElement.querySelector('.e-' + droppedClass).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === buttonElement.id) {
                    return i;
                }
            }
        }
        return -1;
    }

    private wireEvents(element: HTMLElement): void {
        EventHandler.add(element, 'mouseover', this.parent.commonActionModule.updateDropIndicator, this);
        EventHandler.add(element, 'mouseleave', this.parent.commonActionModule.updateDropIndicator, this);
    }

    private unWireEvents(element: HTMLElement): void {
        EventHandler.remove(element, 'mouseover', this.parent.commonActionModule.updateDropIndicator);
        EventHandler.remove(element, 'mouseleave', this.parent.commonActionModule.updateDropIndicator);
    }

    public destroy(): void {
        for (let element of [].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.AXIS_CONTENT_CLASS))) {
            this.unWireEvents(element);
        }
        if (this.draggable && this.draggable.isDestroyed)
            this.draggable.destroy();
    }
}