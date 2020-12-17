import { SfPivotView } from '../pivotview/sf-pivotview-fn';
import { SfPivotFieldList } from '../pivotfieldlist/sf-pivotfieldlist-fn';
import * as cls from '../common/constants';
import { DragStopEventArgs } from '@syncfusion/ej2-popups';
import {
    closest, removeClass, Draggable, DragEventArgs, addClass, remove,
    BlazorDragEventArgs, createElement, prepend, append, Droppable
} from '@syncfusion/ej2-base';

/**
 * The `calculated field` module.
 */
export class CalculatedField {
    public parent: SfPivotView | SfPivotFieldList;

    constructor(parent: SfPivotView | SfPivotFieldList) {
        this.parent = parent;
        this.parent.calculatedFieldModule = this;
    }

    public getNodeLocation(treeElement: HTMLElement, id: string): string {
        let position: ClientRect | DOMRect = treeElement.querySelector('li[data-uid=' + '\"' + JSON.parse(id) + '\"' + ']').getBoundingClientRect();
        return JSON.stringify([position.top + (window.scrollY || document.documentElement.scrollTop), position.left]);
    };

    public setSelectionRange(length: number) {
        if (length) {
            (document.querySelector('#' + this.parent.element.id + 'droppable') as HTMLInputElement).setSelectionRange(length, length);
        }
        (document.querySelector('#' + this.parent.element.id + 'droppable') as HTMLElement).focus();
    };

    public getIconInfo(top: number, left: number): string {
        let element: Element = document.elementFromPoint(left, top);
        if (element) {
            if (element.classList.contains(cls.FORMAT)) {
                return JSON.stringify(cls.FORMAT);
            } else if (element.classList.contains(cls.CALC_EDIT)) {
                return JSON.stringify(cls.CALC_EDIT);
            } else if (element.classList.contains(cls.GRID_REMOVE)) {
                return JSON.stringify(cls.GRID_REMOVE);
            } else if (element.classList.contains(cls.CALC_EDITED)) {
                return JSON.stringify(cls.CALC_EDITED);
            }
        }
        return undefined;
    }

    public emptyFieldName(parentID: string): void {
        addClass([document.getElementById(parentID + 'ddlelement')], [cls.EMPTY_FIELD, cls.CALCINPUT]);
        document.getElementById(parentID + 'ddlelement').focus();
    }

    public editCalculatedFieldInfo(isEdit: boolean, top: number, left: number, title: string): void {
        /* tslint:disable */
        let treeNode: HTMLElement = closest(document.elementFromPoint(left, top), 'li') as HTMLElement;
        if (isEdit) {
            if (this.parent.options.dataType === 'pivot') {
                addClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                removeClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                addClass([treeNode.querySelector('.' + cls.LIST_ICON)], cls.CALC_EDITED);
                removeClass([treeNode.querySelector('.' + cls.LIST_ICON)], cls.CALC_EDIT);
                treeNode.querySelector('.' + cls.CALC_EDITED).setAttribute('title', title);
            }
            (document.querySelector('#' + this.parent.element.id + 'droppable') as HTMLInputElement).value =
                treeNode.getAttribute('data-uid');
        } else {
            this.updatedCalculatedFieldInfo(treeNode, title);
        }
        /* tslint:enable */
    }

    private updatedCalculatedFieldInfo(treeNode: HTMLElement, title: string): void {
        if (this.parent.options.dataType === 'pivot') {
            /* tslint:disable-next-line:max-line-length */
            addClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
            /* tslint:disable-next-line:max-line-length */
            removeClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
            treeNode.querySelector('.' + cls.CALC_EDIT).setAttribute('title', title);
        }
        (document.querySelector('#' + this.parent.element.id + 'droppable') as HTMLInputElement).value = '';
    }

    public updateNodeExpandIcons(treeElement: HTMLElement, id: string): string {
        /* tslint:disable */
        let node: HTMLElement = treeElement.querySelector('li[data-uid=' + '\"' + id + '\"' + ']');
        /* tslint:enable */
        let li: HTMLElement[] = [].slice.call(node.querySelectorAll('li'));
        for (let i: number = 0; i < li.length; i++) {
            let liTextElement: HTMLElement = li[i].querySelector('.' + cls.TEXT_CONTENT_CLASS);
            if (li[i].getAttribute('data-type') === cls.CALCULATED_FIELD &&
                liTextElement && li[i].querySelector('.' + cls.LIST_ICON + '.' + cls.CALC_MEMBER) &&
                !li[i].querySelector('.' + cls.GRID_REMOVE)) {
                let removeElement: HTMLElement = createElement('span', {
                    className: cls.GRID_REMOVE + ' ' + cls.ICON + ' ' + cls.LIST_ICON
                });
                liTextElement.classList.add(cls.CALC_FIELD_MEMBER);
                liTextElement.appendChild(removeElement);
            }
            if ((li[i].querySelector('.' + cls.CALC_DIMENSION_ICON + ',.' + cls.CALC_MEASURE_ICON + ',.' + cls.MEASURE_ICON) ||
                li[i].querySelector('.' + cls.DIMENSION_TYPE_ICON + ',.' + cls.ATTRIBUTE_TYPE_ICON + ',.' + cls.HIERARCHY_TYPE_ICON) ||
                li[i].querySelector('.' + cls.LEVEL_MEMBERS + ',.' + cls.NAMEDSET_TYPE_ICON))) {
                this.createDraggable(li[i]);
            }
        }
        return this.olapExpand(node);
    }

    private olapExpand(node: HTMLElement): string {
        if (node && node.querySelector('.' + cls.LIST_ICON) &&
            node.querySelector('.' + cls.ICON_EXPAND) &&
            (node.querySelector('.' + cls.LIST_ICON).className.indexOf(cls.FOLDER_TYPE_ICON) > -1)) {
            let listnode: HTMLElement = node.querySelector('.' + cls.LIST_ICON);
            removeClass([listnode], cls.FOLDER_TYPE_ICON);
            addClass([listnode], cls.FOLDER_TYPE_OPEN_ICON);
            return JSON.stringify(false);
        } else if (node && node.querySelector('.' + cls.LIST_ICON) &&
            node.querySelector('.' + cls.ICON_COLLAPSE) &&
            (node.querySelector('.' + cls.LIST_ICON).className.indexOf(cls.FOLDER_TYPE_OPEN_ICON) > -1)) {
            node = node.querySelector('.' + cls.LIST_ICON);
            removeClass([node], cls.FOLDER_TYPE_OPEN_ICON);
            addClass([node], cls.FOLDER_TYPE_ICON);
            return JSON.stringify(false);
        }
        return JSON.stringify(true);
    }
    
    public updateEditOptions(accordId: string): void {
        let acoordItem: HTMLElement[] = [].slice.call(document.querySelectorAll('#' + accordId + ' .' + cls.ACCORD_ITEM));
        addClass(document.querySelectorAll('#' + accordId), cls.CALCACCORD);
        for (let i: number = 0; i < acoordItem.length; i++) {
            if (acoordItem[i].querySelector('[data-type="CalculatedField"]')) {
                let iconElement: HTMLElement = acoordItem[i].querySelector('.' + cls.ACCORD_HEADER + ' .' + cls.TOGGLE_ICON);
                removeClass([iconElement], cls.TOGGLE_ICON);
                addClass([iconElement], cls.ACCORD_HEADER_ICON);
                let editElement: HTMLElement = iconElement.querySelector('.' + cls.TOGGLE_COLLAPSE_ICON);
                removeClass([editElement], cls.TOGGLE_COLLAPSE_ICON);
                addClass([editElement], [cls.LIST_ICON, cls.CALC_EDIT]);
                iconElement.appendChild(createElement('span', {
                    className: cls.GRID_REMOVE + ' ' + cls.ICON + ' ' + cls.LIST_ICON
                }));
            }
        }
    }
    
    public updateAccordionLabel(target: string): void {
        let eventTarget: Element = document.elementFromPoint(JSON.parse(target).ClientX, JSON.parse(target).ClientY) as HTMLElement;
        let type: string =
            (eventTarget.parentElement.querySelector('.' + cls.LABEl) as HTMLElement)
                .innerText;
        let field: string = closest(eventTarget, '.' + cls.ACCORD_ITEM).
            querySelector('[data-field').getAttribute('data-caption');
        (closest(eventTarget, '.' + cls.ACCORD_ITEM).querySelector('.' + cls.LABEl) as HTMLElement).
            innerText = field + ' (' + type + ')';
        closest(eventTarget, '.' + cls.ACCORD_ITEM).
            querySelector('[data-type').setAttribute('data-type', (eventTarget).getAttribute('data-value'));
    };
    
    public accordionClick(clientX: string, clientY: string, id: string): string {
        let target: Element = document.elementFromPoint(JSON.parse(clientX), JSON.parse(clientY));
        if (closest(target, '.' + cls.ACCORD_HEADER_ICON)) {
            let node: HTMLElement = closest(target, '.' + cls.ACCORD_HEADER).querySelector('.' + cls.CALCCHECK + " input");
            if (node) {
                let actionClass: string;
                let optionElement: Element = closest(target, '.' + cls.ACCORD_HEADER_ICON);
                if (optionElement.querySelector('.' + cls.CALC_EDIT) && (target).classList.contains(cls.CALC_EDIT)) {
                    addClass([optionElement.querySelector('.' + cls.LIST_ICON)], cls.CALC_EDITED);
                    removeClass([optionElement.querySelector('.' + cls.LIST_ICON)], cls.CALC_EDIT);
                    actionClass = cls.CALC_EDIT;
                } else if (optionElement.querySelector('.' + cls.CALC_EDITED) &&
                    target.classList.contains(cls.CALC_EDITED)) {
                    addClass([optionElement.querySelector('.' + cls.LIST_ICON)], cls.CALC_EDIT);
                    removeClass([optionElement.querySelector('.' + cls.LIST_ICON)], cls.CALC_EDITED);
                    actionClass = cls.CALC_EDITED;
                } else if (optionElement.querySelector('.' + cls.GRID_REMOVE) &&
                    target.classList.contains(cls.GRID_REMOVE)) {
                    actionClass = cls.GRID_REMOVE;
                }
                return JSON.stringify([node.getAttribute('data-field'), actionClass, node.getAttribute('id').split(id + '_')[1]]);
            }
        }
        return JSON.stringify([]);
    }

    public getAccordionValue(): string {
        let fieldText: string = '';
        let node: HTMLElement[] = [].slice.call(document.querySelectorAll('.' + cls.ACCORDION + ' .' + cls.NODE_CHECK_CLASS));
        for (let i: number = 0; i < node.length; i++) {
            let field: string = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
            let type: string = node[i].parentElement.querySelector('[data-type]').getAttribute('data-type');
            if (type.indexOf(cls.CALCULATED_FIELD) === -1) {
                fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
            } else {
                fieldText = fieldText + node[i].parentElement.querySelector('[data-formula]').getAttribute('data-formula');;
            }
        }
        return fieldText;
    }

    public createFormulaDroppable(edit: string, drag: string, remove: string, edited: string, isEdit: boolean, fieldName: string, id: string): void {
        let element: HTMLElement = document.getElementById(this.parent.element.id + id);
        if (element.querySelector('.' + cls.FORMULA)) {
            new Droppable(element.querySelector('.' + cls.FORMULA), {});
            let li: HTMLElement[] = [].slice.call(element.querySelectorAll('.' + cls.TREEVIEW + ' ul li'));
            for (let i: number = 0; i < li.length; i++) {
                let currentFieldName: string = li[i].getAttribute('data-field');
                if (this.parent.options.dataType === 'olap') {
                    if (li[i].querySelector('.' + cls.MEASURE_ICON)) {
                        (li[i].querySelector('.' + cls.LIST_ICON) as HTMLElement).style.display = 'none';
                    }
                    let liTextElement: HTMLElement = li[i].querySelector('.' + cls.TEXT_CONTENT_CLASS);
                    if (li[i].getAttribute('data-type') === 'CalculatedField' &&
                        liTextElement && li[i].querySelector('.' + cls.LIST_ICON + '.' + cls.CALC_MEMBER)) {
                        liTextElement.classList.add(cls.CALC_FIELD_MEMBER);
                        liTextElement.appendChild(createElement('span', {
                            className: cls.GRID_REMOVE + ' ' + cls.ICON + ' ' + cls.LIST_ICON
                        }));
                    }
                    /* tslint:disable */
                    if ((li[i].querySelector('.' + cls.CALC_DIMENSION_ICON + ',.' + cls.CALC_MEASURE_ICON + ',.' + cls.MEASURE_ICON) ||
                        li[i].querySelector('.' + cls.DIMENSION_TYPE_ICON + ',.' + cls.ATTRIBUTE_TYPE_ICON + ',.' + cls.HIERARCHY_TYPE_ICON) ||
                        li[i].querySelector('.' + cls.LEVEL_MEMBERS + ',.' + cls.NAMEDSET_TYPE_ICON))) {
                        this.createDraggable(li[i]);
                    }
                    /* tslint:enable */
                } else if (this.parent.options.dataType === 'pivot') {
                    if (li[i].querySelector('.' + cls.TEXT_CONTENT_CLASS + ' span')) {
                        let type: string = li[i].getAttribute('data-type');
                        let dragElement: HTMLElement = createElement('span', {
                            attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': drag },
                            className: cls.ICON + ' ' + cls.DRAG_CLASS
                        });
                        let spaceElement: HTMLElement = createElement('div', {
                            className: ' ' + cls.ICON_SPACE
                        });
                        prepend([dragElement], li[i].querySelector('.' + cls.TEXT_CONTENT_CLASS));
                        append([spaceElement, li[i].querySelector('.' + cls.FORMAT)], li[i].querySelector('.' + cls.TEXT_CONTENT_CLASS));
                        if (type === 'CalculatedField') {
                            li[i].querySelector('.' + cls.FORMAT).setAttribute('title', remove);
                            addClass([li[i].querySelector('.' + cls.FORMAT)], cls.GRID_REMOVE);
                            if (isEdit && fieldName === currentFieldName) {
                                /* tslint:disable-next-line:max-line-length */
                                (element.querySelector('#' + this.parent.element.id + 'droppable') as HTMLTextAreaElement).value = li[i].getAttribute('data-uid');
                            }
                            /* tslint:disable-next-line:max-line-length */
                            addClass([li[i].querySelector('.' + cls.ICON_SPACE)], [((isEdit && fieldName === currentFieldName) ? cls.CALC_EDITED : cls.CALC_EDIT), cls.ICON, cls.LIST_ICON]);
                            /* tslint:disable-next-line:max-line-length */
                            li[i].querySelector('.' + cls.CALC_EDIT + ',.' + cls.CALC_EDITED).setAttribute('title', ((isEdit && fieldName === currentFieldName) ? edited : edit));
                            li[i].querySelector('.' + cls.CALC_EDIT + ',.' + cls.CALC_EDITED).setAttribute('aria-disabled', 'false');
                            li[i].querySelector('.' + cls.CALC_EDIT + ',.' + cls.CALC_EDITED).setAttribute('tabindex', '-1');
                            removeClass([li[i].querySelector('.' + cls.FORMAT)], cls.FORMAT);
                            removeClass([li[i].querySelector('.' + cls.ICON_SPACE)], cls.ICON_SPACE);
                        }
                        this.createDraggable(dragElement);
                    }
                }
            }
        }
    }

    private createDraggable(element: HTMLElement): void {
        new Draggable(element, {
            dragTarget: '.' + cls.LIST_ITEM,
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.calculatedDragClone.bind(this),
            dragStart: this.onCalcDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onCalcDragStop.bind(this),
        });
    }

    private onDragging(e: DragEventArgs): void {
        let clonedNode: HTMLElement = document.querySelector('#' + this.parent.element.id + '_DragClone ' + '.' + cls.ICON);
        if (e.target && (e.target).classList.contains(cls.FORMULA)) {
            removeClass([clonedNode], cls.NO_DRAG_CLASS);
            addClass([(e.target)], cls.COPY_DROP);
        } else {
            addClass([clonedNode], cls.NO_DRAG_CLASS);
            removeClass([(e.target)], cls.COPY_DROP);
            addClass([clonedNode], cls.ICON_EXPAND);
            removeClass([clonedNode], cls.LIST_ICON);
        }
    }

    private onCalcDragStop(e: DragEventArgs & DragStopEventArgs): void {
        let dropField: HTMLTextAreaElement = document.getElementById(this.parent.element.id + 'droppable') as HTMLTextAreaElement;
        let draggedNode: HTMLElement = closest(e.element, '.' + cls.LIST_ITEM) as HTMLElement;
        removeClass([dropField], cls.COPY_DROP);
        removeClass([draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        let cursorPos: number = dropField.selectionStart;
        if (e.target.id === (this.parent.element.id + 'droppable')) {
            this.parent.dotNetRef.invokeMethodAsync('UpdateCalcDroppable', draggedNode.getAttribute('data-uid'), cursorPos, e.target.id);
        }
        if (document.getElementById(this.parent.element.id + '_DragClone')) {
            remove(e.helper);
        }
        document.body.style.cursor = 'auto';
        this.parent.isDragging = false;
    }

    private onCalcDragStart(e: DragEventArgs & BlazorDragEventArgs): void {
        let draggedNode: HTMLElement = closest(e.element, '.' + cls.LIST_ITEM) as HTMLElement;
        let clonedNode: HTMLElement = document.getElementById(this.parent.element.id + '_DragClone');
        if (clonedNode && draggedNode && (this.parent.options.dataType === 'pivot' && e.element &&
            e.element.classList.contains(cls.DRAG_CLASS)) || (this.parent.options.dataType === 'olap' &&
                (draggedNode.querySelector('.' + cls.CALC_DIMENSION_ICON + ',.' + cls.CALC_MEASURE_ICON + ',.' + cls.MEASURE_ICON) ||
                    /* tslint:disable-next-line:max-line-length */
                    draggedNode.querySelector('.' + cls.DIMENSION_TYPE_ICON + ',.' + cls.ATTRIBUTE_TYPE_ICON + ',.' + cls.HIERARCHY_TYPE_ICON) ||
                    draggedNode.querySelector('.' + cls.LEVEL_MEMBERS + ',.' + cls.NAMEDSET_TYPE_ICON)))) {
            addClass([draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
            addClass([clonedNode], cls.PIVOTCALC);
            clonedNode.style.zIndex =
                (document.querySelector('.' + cls.CALCDIALOG + '.' + cls.OLAP_CALCDIALOG) as HTMLElement).style.zIndex + 1;
            clonedNode.style.display = 'inline';
            this.parent.isDragging = true;
        } else {
            this.parent.isDragging = false;
        }
        e.bindEvents(e.dragElement);
    }

    private calculatedDragClone(args: DragEventArgs): HTMLElement {
        let cloneElement: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: cls.DRAG_ITEM + ' ' + cls.TREEVIEW_CLASS + ' ' + cls.PIVOTCALC
        });
        let contentElement: HTMLElement = createElement('div', {
            className: cls.TEXT_CONTENT_CLASS + ' ' + cls.CALC_FIELD_MEMBER
        });
        contentElement.appendChild(createElement('div', {
            className: cls.ICON
        }));
        contentElement.appendChild(createElement('span', {
            className: cls.LIST_TEXT_CLASS,
            innerHTML: closest(args.element, 'li').getAttribute('data-caption')
        }));
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    }
}