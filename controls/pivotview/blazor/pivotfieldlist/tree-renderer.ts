import { SfPivotFieldList } from './sf-pivotfieldlist-fn';
import * as cls from '../common/constants';
import { closest, createElement, addClass, removeClass } from '@syncfusion/ej2-base';
import { TreeData } from '../common/interfaces';
import { FieldItemInfo } from '../../src/base/engine';
/**
 * Module for field list tree actions.
 */
export class TreeRenderer {
    public parent: SfPivotFieldList;

    constructor(parent: SfPivotFieldList) {
        this.parent = parent;
        this.parent.treeRendererModule = this;
    }

    public updateFieldListIcons(id: string, treeData: TreeData[], dragText: string): void {
        let treeElement: HTMLElement = document.getElementById(id);
        let liElement: HTMLElement[] = [].slice.call(treeElement.querySelectorAll('ul li'));
        for (let i: number = 0; i < liElement.length; i++) {
            for (let j: number = 0; j < treeData.length; j++) {
                if (treeData[j].id === liElement[i].getAttribute('data-uid')) {
                    this.updateTreeNode(liElement[i] as HTMLElement, treeData[j], dragText);
                    break;
                }
            }
        }
        /* tslint:disable-next-line:max-line-length */
        if (closest(treeElement, '.' + (this.parent.isAdaptive ? cls.EDITOR_TREE_CONTAINER_CLASS : cls.FIELD_LIST_TREE_CLASS) + '-outer-div')) {
            /* tslint:disable-next-line:max-line-length */
            (closest(treeElement, '.' + (this.parent.isAdaptive ? cls.EDITOR_TREE_CONTAINER_CLASS : cls.FIELD_LIST_TREE_CLASS) + '-outer-div') as HTMLElement).style.visibility = 'visible';
        }
    }

    private updateTreeNode(node: HTMLElement, nodeData: TreeData, dragText: string): void {
        let allowDrag: boolean = false;
        if (this.parent.options.dataType === 'olap') {
            allowDrag = this.updateOlapTreeNode(node);
        } else {
            allowDrag = true;
        }
        let liTextElement: HTMLElement = node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
        if (node.querySelector('.' + cls.LIST_ICON) && liTextElement) {
            let liIconElement: HTMLElement = node.querySelector('.' + cls.LIST_ICON);
            liTextElement.insertBefore(liIconElement, node.querySelector('.' + cls.LIST_TEXT_CLASS));
        }
        if (allowDrag && !this.parent.isAdaptive) {
            let field: FieldItemInfo = this.parent.commonActionModule.getFieldInfo(nodeData.id);
            allowDrag = false;
            let dragElement: HTMLElement = createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    'aria-disabled': 'false'
                }
            });
            dragElement.appendChild(createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: field.fieldItem ? field.fieldItem.allowDragAndDrop ? dragText : '' : dragText,
                    'aria-disabled': 'false'
                },
                className: cls.ICON + ' ' + cls.DRAG_CLASS + ' ' + (field.fieldItem ?
                    field.fieldItem.allowDragAndDrop ? '' : cls.DRAG_DISABLE_CLASS : '')
            }));
            if (node.querySelector('.' + cls.CHECKBOX_CONTAINER) && !node.querySelector('.' + cls.DRAG_CLASS) && liTextElement) {
                liTextElement.insertBefore(dragElement, node.querySelector('.' + cls.CHECKBOX_CONTAINER));
            }
            this.parent.pivotButtonModule.createDraggable(true, dragElement, field.fieldItem);
        }

        if (node.querySelector('.' + cls.NODE_CHECK_CLASS)) {
            addClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
        }
    }

    private updateOlapTreeNode(node: HTMLElement): boolean {
        if (this.parent.options.dataType === 'olap' && node) {
            let textNode: HTMLElement = node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
            if (textNode.querySelector('.' + cls.CALC_MEMBER_GROUP_TYPE_ICON + ',.' + cls.MEASURE_GROUP_TYPE_ICON + ',.' +
                cls.FOLDER_TYPE_ICON + ',.' + cls.FOLDER_TYPE_OPEN_ICON + ',.' + cls.DIMENSION_TYPE_ICON + ',.' + cls.KPI_ICON)) {
                (textNode.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.display = 'none';
            }
            /* tslint:disable-next-line:max-line-length */
            if (textNode.querySelector('.' + cls.LIST_ICON) && textNode.querySelector('.' + cls.LIST_ICON).className.indexOf(cls.LEVEL_MEMBERS) > -1) {
                this.parent.isAdaptive ? (textNode.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.display = 'none' : (textNode.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.visibility = 'hidden';
            }
            if (textNode.querySelector('.' + cls.HIERARCHY_TYPE_ICON + ',.' + cls.ATTRIBUTE_TYPE_ICON + ',.' + cls.NAMEDSET_TYPE_ICON) ||
                /* tslint:disable-next-line:max-line-length */
                textNode.querySelector('.' + cls.MEASURE_ICON + ',.' + cls.KPI_GOAL_ICON + ',.' + cls.KPI_STATUS_ICON + ',.' + cls.KPI_TREND_ICON + ',.' + cls.KPI_VALUE_ICON) ||
                textNode.querySelector('.' + cls.CALC_MEASURE_ICON + ',.' + cls.CALC_DIMENSION_ICON)) {
                if (textNode.querySelector('.' + cls.MEASURE_ICON)) {
                    (textNode.querySelector('.' + cls.LIST_ICON) as HTMLElement).style.display = 'none';
                    return true;
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
        return false;
    }
}