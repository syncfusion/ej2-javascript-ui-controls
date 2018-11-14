import { createElement, addClass, removeClass, prepend, remove } from '@syncfusion/ej2-base';
import { MouseEventArgs, TouchEventArgs, closest, extend } from '@syncfusion/ej2-base';
import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction } from '../../common/base/interface';
import { TreeView, NodeCheckEventArgs, DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { IFieldOptions, IField, IFieldListOptions } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, MaskChangeEventArgs } from '@syncfusion/ej2-inputs';

/**
 * Module to render Field List
 */
/** @hidden */
export class TreeViewRenderer implements IAction {
    public parent: PivotFieldList;
    /** @hidden */
    public fieldTable: TreeView;

    private parentElement: HTMLElement;
    private treeViewElement: HTMLElement;
    private fieldDialog: Dialog;
    private editorSearch: MaskedTextBox;
    private selectedNodes: string[] = [];

    /** Constructor for render module */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Initialize the field list tree rendering
     * @returns void
     * @private
     */
    public render(axis?: number): void {
        this.parentElement = this.parent.dialogRenderer.parentElement;
        if (!this.parent.isAdaptive) {
            let fieldTable: Element = createElement('div', { className: cls.FIELD_TABLE_CLASS });
            let treeHeader: Element = createElement('div', {
                className: cls.FIELD_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant('allFields')
            });
            this.treeViewElement = createElement('div', {
                id: this.parent.element.id + '_TreeView',
                className: cls.FIELD_LIST_CLASS
            });
            fieldTable.appendChild(treeHeader);
            fieldTable.appendChild(this.treeViewElement);
            this.parentElement.appendChild(fieldTable);
            if (this.parent.renderMode === 'Fixed') {
                let centerDiv: Element = createElement('div', { className: cls.STATIC_CENTER_DIV_CLASS });
                let axisHeader: Element = createElement('div', {
                    className: cls.STATIC_CENTER_HEADER_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('centerHeader')
                });
                this.parentElement.appendChild(centerDiv);
                this.parentElement.appendChild(axisHeader);
            }
            this.renderTreeView();
        } else {
            this.renderTreeDialog(axis);
        }
    }
    private renderTreeView(): void {
        this.fieldTable = new TreeView({
            fields: { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected' },
            nodeChecked: this.nodeStateChange.bind(this),
            cssClass: cls.FIELD_LIST_TREE_CLASS,
            showCheckBox: true,
            allowDragAndDrop: true,
            sortOrder: 'Ascending',
            enableRtl: this.parent.enableRtl,
            nodeDragStart: this.dragStart.bind(this),
            nodeDragStop: this.dragStop.bind(this)
        });
        this.treeViewElement.innerHTML = '';
        this.fieldTable.appendTo(this.treeViewElement);
        this.getTreeUpdate();
    }
    private renderTreeDialog(axis?: number): void {
        let fieldListDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FieldListTreeView',
            className: cls.ADAPTIVE_FIELD_LIST_DIALOG_CLASS
        });
        this.parentElement.appendChild(fieldListDialog);
        this.fieldDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: this.parent.localeObj.getConstant('adaptiveFieldHeader'),
            content: this.createTreeView(this.getTreeData(axis)),
            isModal: true,
            visible: true,
            showCloseIcon: false,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: '350px',
            position: { X: 'center', Y: 'center' },
            buttons: [{
                click: this.closeTreeDialog.bind(this),
                buttonModel: {
                    cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel')
                }
            }, {
                click: this.onFieldAdd.bind(this),
                buttonModel: {
                    cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('add'),
                    isPrimary: true
                }
            }],
            closeOnEscape: true,
            target: this.parentElement.parentElement,
            close: () => {
                if (document.getElementById(this.parent.element.id + '_FieldListTreeView')) {
                    remove(document.getElementById(this.parent.element.id + '_FieldListTreeView'));
                }
            }
        });
        this.fieldDialog.appendTo(fieldListDialog);
    }

    private createTreeView(treeData: { [key: string]: Object }[]): HTMLElement {
        let editorTreeWrapper: HTMLElement = createElement('div', {
            id: this.parent.element.id + 'EditorDiv',
            className: cls.EDITOR_TREE_WRAPPER_CLASS
        });
        let searchWrapper: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: cls.EDITOR_SEARCH_WRAPPER_CLASS
        });
        let editorSearch: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
        searchWrapper.appendChild(editorSearch);
        let treeViewContainer: HTMLElement = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS });
        editorTreeWrapper.appendChild(searchWrapper);
        this.editorSearch = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('search'),
            enableRtl: this.parent.enableRtl,
            cssClass: cls.EDITOR_SEARCH_CLASS,
            change: (e: MaskChangeEventArgs) => {
                this.parent.pivotCommon.eventBase.searchTreeNodes(e, this.fieldTable);
            }
        });
        this.editorSearch.appendTo(editorSearch);
        editorTreeWrapper.appendChild(treeViewContainer);
        this.fieldTable = new TreeView({
            fields: { dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected' },
            showCheckBox: true,
            sortOrder: 'Ascending',
            enableRtl: this.parent.enableRtl,
            nodeChecked: this.addNode.bind(this),
        });
        this.fieldTable.appendTo(treeViewContainer);
        return editorTreeWrapper;
    }

    private dragStart(args: DragAndDropEventArgs): void {
        if ((args.event.target as HTMLElement).classList.contains(cls.DRAG_CLASS)) {
            this.parent.isDragging = true;
            addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
            let data: IField = this.parent.engineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
            let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
            if (data && data.aggregateType === 'CalculatedField') {
                for (let axisContent of axis) {
                    addClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                }
            }
        } else {
            args.cancel = true;
        }
    }
    private dragStop(args: DragAndDropEventArgs): void {
        args.cancel = true;
        this.parent.isDragging = false;
        let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (let axisElement of axis) {
            removeClass([this.parentElement.querySelector('.' + axisElement)], cls.NO_DRAG_CLASS);
        }
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        let fieldName: string = args.draggedNodeData.id.toString();
        if (!this.isNodeDropped(args, fieldName)) { return; }
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            ((this.parent as PivotFieldList).pivotGridModule ? (this.parent as PivotFieldList).pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, fieldName)) {
            this.parent.updateDataSource();
            this.parent.axisFieldModule.render();
        }
    }
    private isNodeDropped(args: DragAndDropEventArgs, targetID: string): boolean {
        let isDropped: boolean = true;
        if (args.draggedNodeData.isChecked === 'true') {
            let target: HTMLElement = this.getButton(targetID);
            let axisPanel: HTMLElement = closest(target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            let droppableElement: HTMLElement = closest(args.target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            if (target && axisPanel === droppableElement) {
                let pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                let dropTarget: HTMLElement = closest(args.target, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
                let sourcePosition: number;
                let dropPosition: number = -1;
                for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        let droppableButton: HTMLElement = dropTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || (sourcePosition === (pivotButtons.length - 1) && dropPosition === -1)) {
                    let parentElement: HTMLElement = document.getElementById(this.parent.element.id + '_Wrapper');
                    removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    }
    private getButton(fieldName: string): HTMLElement {
        let wrapperElement: HTMLElement = document.getElementById(this.parent.element.id + '_Wrapper');
        let pivotButtons: HTMLElement[] = [].slice.call(wrapperElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        let buttonElement: HTMLElement;
        for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
            if (pivotButtons[i].id === fieldName) {
                buttonElement = pivotButtons[i];
                break;
            }
        }
        return buttonElement;
    }
    private nodeStateChange(args: NodeCheckEventArgs): void {
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        let node: HTMLElement = closest(args.node, '.' + cls.TEXT_CONTENT_CLASS) as HTMLElement;
        let list: { [key: string]: Object } = this.parent.pivotFieldList;
        let selectedNode: { [key: string]: Object } = list[args.data[0].id.toString()] as { [key: string]: Object };
        if (args.action === 'check') {
            addClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
            let addNode: IFieldOptions = this.parent.pivotCommon.dataSourceUpdate.getNewField(args.data[0].id.toString());
            selectedNode.type === 'number' ?
                this.parent.dataSource.values.push(addNode) : this.parent.dataSource.rows.push(addNode);
        } else {
            removeClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(args.data[0].id.toString());
        }
        this.parent.updateDataSource(true);
        this.parent.axisFieldModule.render();
    }

    private addNode(args: NodeCheckEventArgs): void {
        let fieldList: { [key: string]: Object } = this.parent.pivotFieldList;
        let selectedNode: { [key: string]: Object } = fieldList[args.data[0].id.toString()] as { [key: string]: Object };
        if (args.action === 'check') {
            this.selectedNodes.push(selectedNode.id.toString());
        } else {
            let count: number = this.selectedNodes.length;
            while (count--) {
                if (this.selectedNodes[count] === selectedNode.id.toString()) {
                    this.selectedNodes.splice(count, 1);
                    break;
                }
            }
        }
    }

    private getTreeUpdate(): void {
        let liElements: HTMLElement[] = [].slice.call(this.treeViewElement.querySelectorAll('.' + cls.TEXT_CONTENT_CLASS));
        for (let liElement of liElements) {
            let dragElement: Element = createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: this.parent.localeObj.getConstant('drag'),
                    'aria-disabled': 'false'
                },
                className: cls.ICON + ' ' + cls.DRAG_CLASS
            });
            prepend([dragElement], liElement);
            if (liElement.querySelector('.' + cls.NODE_CHECK_CLASS)) {
                addClass([liElement.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);

            }
        }
    }

    private refreshTreeView(): void {
        this.fieldTable.fields = { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected' };
        this.fieldTable.dataBind();
        this.getTreeUpdate();
    }

    private getTreeData(axis?: number): { [key: string]: Object }[] {
        let data: { [key: string]: Object }[] = [];
        let keys: string[] = Object.keys(this.parent.pivotFieldList);
        let fieldList: IFieldListOptions = extend({}, this.parent.pivotFieldList, null, true) as IFieldListOptions;
        if (this.parent.isAdaptive) {
            let fields: IFieldOptions[][] = [this.parent.dataSource.filters, this.parent.dataSource.columns, this.parent.dataSource.rows,
            this.parent.dataSource.values];
            let currentFieldSet: IFieldOptions[] = fields[axis];
            let len: number = keys.length;
            while (len--) {
                fieldList[keys[len]].isSelected = false;
            }
            for (let item of currentFieldSet) {
                fieldList[item.name].isSelected = true;
            }
        }
        let list: { [key: string]: Object } = fieldList as { [key: string]: Object };
        for (let member of keys) {
            let obj: { [key: string]: Object } = list[member] as { [key: string]: Object };
            data.push(obj);
        }
        return data;
    }
    private onFieldAdd(e: MouseEventArgs & TouchEventArgs): void {
        this.parent.dialogRenderer.updateDataSource(this.selectedNodes);
        this.closeTreeDialog();
    }

    private closeTreeDialog(): void {
        this.selectedNodes = [];
        this.fieldDialog.hide();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(events.treeViewUpdate, this.refreshTreeView, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.treeViewUpdate, this.refreshTreeView);
    }

    /**
     * To destroy the tree view event listener 
     * @return {void}
     * @hidden
     */

    public destroy(): void {
        this.removeEventListener();
    }
}