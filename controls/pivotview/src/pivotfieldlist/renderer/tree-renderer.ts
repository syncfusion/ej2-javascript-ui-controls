import { createElement, addClass, removeClass, remove, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MouseEventArgs, TouchEventArgs, closest } from '@syncfusion/ej2-base';
import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction, FieldDropEventArgs, FieldRemoveEventArgs, FieldDragStartEventArgs } from '../../common/base/interface';
import {
    TreeView, NodeCheckEventArgs, DragAndDropEventArgs, DrawNodeEventArgs,
    NodeExpandEventArgs, NodeSelectEventArgs
} from '@syncfusion/ej2-navigations';
import { IFieldOptions, IField, IDataOptions, FieldItemInfo } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, MaskChangeEventArgs, TextBox } from '@syncfusion/ej2-inputs';
import { PivotUtil } from '../../base/util';
import { IOlapField } from '../../base/olap/engine';
import { PivotView } from '../../pivotview/base/pivotview';

/**
 * Module to render Field List
 */
/** @hidden */
export class TreeViewRenderer implements IAction {
    /** @hidden */
    public parent: PivotFieldList;
    /** @hidden */
    public fieldTable: TreeView;

    private parentElement: HTMLElement;
    private fieldDialog: Dialog;
    private treeViewElement: HTMLElement;
    private editorSearch: MaskedTextBox;
    private selectedNodes: string[] = [];
    private fieldListSort: string;
    private fieldSearch: TextBox;
    private nonSearchList: HTMLElement[];
    private isSearching: boolean = false;
    private parentIDs: string[] = [];

    /** Constructor for render module
     *
     * @param {PivotFieldList} parent - Instance of field list.
     */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Initialize the field list tree rendering
     *
     * @param {number} axis - Axis position.
     * @returns {void}
     * @private
     */
    public render(axis?: number): void {
        this.parentElement = this.parent.dialogRenderer.parentElement;
        this.fieldListSort = this.parent.pivotGridModule ?
            this.parent.pivotGridModule.defaultFieldListOrder : this.parent.defaultFieldListOrder;
        this.fieldListSort = this.fieldListSort === 'Ascending' ? 'Ascend' :
            this.fieldListSort === 'Descending' ? 'Descend' : 'None';
        if (!this.parent.isAdaptive) {
            const fieldTable: Element = createElement('div', {
                className: cls.FIELD_TABLE_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_FIELD_TABLE_CLASS : '')
            });
            const treeHeader: HTMLElement = createElement('div', {
                className: cls.FIELD_HEADER_CLASS,
                attrs: { title: this.parent.localeObj.getConstant('allFields') }
            });
            treeHeader.innerText = this.parent.localeObj.getConstant('allFields');
            const searchWrapper: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
                className: cls.FIELD_LIST_SEARCH_CLASS
            });
            const searchInput: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
            searchWrapper.appendChild(searchInput);
            this.fieldSearch = new TextBox({
                placeholder: this.parent.localeObj.getConstant('search'),
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                cssClass: cls.FIELD_LIST_SEARCH_INPUT_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                input: this.textChange.bind(this),
                showClearButton: true
            });
            this.fieldSearch.isStringTemplate = true;
            this.fieldSearch.appendTo(searchInput);
            this.fieldSearch.addIcon('append', cls.FIELD_LIST_SEARCH_ICON_CLASS + ' ' + cls.ICON);
            const promptDiv: HTMLElement = createElement('div', {
                className: cls.EMPTY_MEMBER_CLASS + ' ' + cls.ICON_DISABLE
            });
            promptDiv.innerText = this.parent.localeObj.getConstant('noMatches');
            const treeOuterDiv: HTMLElement = createElement('div', {
                className: cls.FIELD_LIST_TREE_OUTER_DIV_CLASS + ' ' + cls.TREE_CONTAINER
            });
            this.treeViewElement = createElement('div', {
                id: this.parent.element.id + '_TreeView',
                className: cls.FIELD_LIST_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_FIELD_LIST_CLASS : '')
            });
            const fieldHeaderWrappper: Element = createElement('div', { className: cls.FIELD_HEADER_CONTAINER_CLASS });
            fieldHeaderWrappper.appendChild(treeHeader);
            fieldTable.appendChild(fieldHeaderWrappper);
            this.updateSortElements(fieldHeaderWrappper);
            if (this.parent.enableFieldSearching) {
                fieldTable.appendChild(searchWrapper);
                fieldTable.appendChild(promptDiv);
            }
            treeOuterDiv.appendChild(this.treeViewElement);
            fieldTable.appendChild(treeOuterDiv);
            this.parentElement.appendChild(fieldTable);
            if (this.parent.renderMode === 'Fixed') {
                const centerDiv: Element = createElement('div', { className: cls.STATIC_CENTER_DIV_CLASS });
                const axisHeader: HTMLElement = createElement('div', {
                    className: cls.STATIC_CENTER_HEADER_CLASS
                });
                axisHeader.innerText = this.parent.localeObj.getConstant('centerHeader');
                this.parentElement.appendChild(centerDiv);
                this.parentElement.appendChild(axisHeader);
            }
            this.renderTreeView();
        } else {
            this.renderTreeDialog(axis);
        }
    }
    private updateSortElements(headerWrapper: Element): void {
        const options: { [key: string]: string } = { 'None': 'sortNone', 'Ascend': 'sortAscending', 'Descend': 'sortDescending' };
        const keys: string[] = Object.keys(options);
        for (const option of keys) {
            const spanElement: Element = createElement('span', {
                attrs: {
                    'tabindex': '0',
                    'aria-disabled': 'false',
                    'aria-label': 'Sort ' + option,
                    'data-sort': option,
                    'title': this.parent.localeObj.getConstant(options[option as string]),
                    'role': 'button'
                },
                className: cls.ICON + ' ' + 'e-sort-' + option.toLowerCase() + ' ' +
                    (this.fieldListSort === option ? 'e-selected' : '')
            });
            headerWrapper.appendChild(spanElement);
            this.unWireFieldListEvent(spanElement);
            this.wireFieldListEvent(spanElement);
        }
    }
    private renderTreeView(): void {
        this.fieldTable = new TreeView({
            fields: { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass' },
            nodeChecked: this.nodeStateChange.bind(this),
            cssClass: cls.FIELD_LIST_TREE_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            showCheckBox: true,
            allowDragAndDrop: true,
            sortOrder: 'None',
            autoCheck: false,
            loadOnDemand: this.parent.dataType === 'olap' ? false : true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            nodeDragStart: this.dragStart.bind(this),
            nodeDragStop: this.dragStop.bind(this),
            drawNode: this.updateTreeNode.bind(this),
            nodeExpanding: this.updateNodeIcon.bind(this),
            nodeCollapsed: this.updateNodeIcon.bind(this),
            nodeSelected: (args: NodeSelectEventArgs) => {
                removeClass([args.node], 'e-active');
                args.cancel = true;
            }
        });
        this.treeViewElement.innerHTML = '';
        this.fieldTable.isStringTemplate = true;
        this.fieldTable.appendTo(this.treeViewElement);
        const dragEle: HTMLElement = this.parent.renderMode === 'Fixed' ? this.parent.element : this.parentElement;
        if (!isNullOrUndefined(dragEle.querySelector('.' + cls.FIELD_LIST_CLASS))) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (dragEle.querySelector('.' + cls.FIELD_LIST_CLASS) as any).ej2_instances[0].dragObj.enableAutoScroll = false;
        }
    }
    private updateNodeIcon(args: NodeExpandEventArgs): void {
        if (this.parent.dataType === 'olap') {
            if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-icon') > -1)) {
                const node: HTMLElement = args.node.querySelector('.e-list-icon');
                removeClass([node], 'e-folderCDB-icon');
                addClass([node], 'e-folderCDB-open-icon');
            } else if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-open-icon') > -1)) {
                const node: HTMLElement = args.node.querySelector('.e-list-icon');
                removeClass([node], 'e-folderCDB-open-icon');
                addClass([node], 'e-folderCDB-icon');
            }
        }
    }
    private updateTreeNode(args: DrawNodeEventArgs): void {
        let allowDrag: boolean = false;
        if (this.parent.dataType === 'olap') {
            allowDrag = this.updateOlapTreeNode(args);
        } else {
            if (args.nodeData.hasChildren) {
                allowDrag = false;
                (args.node.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.display = 'none';
                addClass([args.node], cls.FIELD_TREE_PARENT);
            }
            else {
                allowDrag = true;
            }
        }
        if (!isNullOrUndefined(args.nodeData.pid)) {
            addClass([args.node], cls.FIELD_TREE_CHILD);
        }
        const liTextElement: HTMLElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
        if (args.node.querySelector('.e-list-icon') && liTextElement) {
            const liIconElement: HTMLElement = args.node.querySelector('.e-list-icon');
            liTextElement.insertBefore(liIconElement, args.node.querySelector('.e-list-text'));
        }
        if (allowDrag && !this.parent.isAdaptive) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const field: FieldItemInfo = PivotUtil.getFieldInfo((args.nodeData as any).id, this.parent);
            allowDrag = false;
            const dragElement: Element = createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: (field.fieldItem ? field.fieldItem.allowDragAndDrop ?
                        this.parent.localeObj.getConstant('drag') : '' : this.parent.localeObj.getConstant('drag')),
                    'aria-disabled': 'false'
                },
                className: cls.ICON + ' ' + cls.DRAG_CLASS + ' ' +
                    (field.fieldItem ? field.fieldItem.allowDragAndDrop ? '' : cls.DRAG_DISABLE_CLASS : '')
            });
            if (args.node.querySelector('.' + cls.CHECKBOX_CONTAINER) &&
                !args.node.querySelector('.cls.DRAG_CLASS') && liTextElement) {
                liTextElement.insertBefore(dragElement, args.node.querySelector('.' + cls.CHECKBOX_CONTAINER));
            }
        }
        if (args.node.querySelector('.' + cls.NODE_CHECK_CLASS)) {
            addClass([args.node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
        }
        if (this.parent.enableFieldSearching && this.isSearching) {
            const liElement: HTMLElement = args.node;
            if (this.parent.dataType === 'olap') {
                const id: string = liElement.getAttribute('data-uid');
                const searchItem: HTMLElement[] = this.parent.pivotCommon.eventBase.searchListItem;
                for (let i: number = 0; i < this.parentIDs.length; i++) {
                    if (id === this.parentIDs[i as number]) {
                        addClass([liElement], cls.ICON_DISABLE);
                    }
                    for (const li2 of searchItem) {
                        const parentID: string[] = this.parent.pivotCommon.eventBase.getParentIDs(this.fieldTable, li2.getAttribute('data-uid'), []);
                        if (PivotUtil.inArray(id, parentID) > -1) {
                            removeClass([liElement], cls.ICON_DISABLE);
                            break;
                        }
                    }
                }
            }
            else {
                for (let i: number = 0; i < this.nonSearchList.length; i++) {
                    if (liElement.textContent === this.nonSearchList[i as number].textContent) {
                        addClass([liElement], cls.ICON_DISABLE);
                        break;
                    }
                    else {
                        if (liElement.innerText === this.nonSearchList[i as number].textContent) {
                            addClass([liElement], cls.ICON_DISABLE);
                            break;
                        }
                    }
                }
            }
        }
    }
    private updateOlapTreeNode(args: DrawNodeEventArgs): boolean {
        let allowDrag: boolean = false;
        if (this.parent.dataType === 'olap') {
            if (args.node && args.node.querySelector('.e-calcMemberGroupCDB,.e-measureGroupCDB-icon,.e-folderCDB-icon,.e-folderCDB-open-icon,.e-dimensionCDB-icon,.e-kpiCDB-icon')) {
                (args.node.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.display = 'none';
            }
            if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-level-members') > -1)) {
                if (this.parent.isAdaptive) {
                    (args.node.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.display = 'none';
                } else {
                    (args.node.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.visibility = 'hidden';
                }
            }
            if (args.node && (args.node.querySelector('.e-hierarchyCDB-icon,.e-attributeCDB-icon,.e-namedSetCDB-icon') ||
                args.node.querySelector('.e-measure-icon,.e-kpiGoal-icon,.e-kpiStatus-icon,.e-kpiTrend-icon,.e-kpiValue-icon') ||
                args.node.querySelector('.e-calc-measure-icon,.e-calc-dimension-icon'))) {
                if (args.node.querySelector('.e-measure-icon')) {
                    (args.node.querySelector('.e-list-icon') as HTMLElement).style.display = 'none';
                    allowDrag = true;
                } else {
                    allowDrag = true;
                }
            }
        } else {
            allowDrag = true;
        }
        return allowDrag;
    }
    private renderTreeDialog(axis?: number): void {
        const fieldListDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FieldListTreeView',
            className: cls.ADAPTIVE_FIELD_LIST_DIALOG_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-editor-dialog' : '')
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            locale: this.parent.locale,
            width: '320px',
            height: '350px',
            position: { X: 'center', Y: 'center' },
            buttons: [{
                click: this.closeTreeDialog.bind(this),
                buttonModel: {
                    cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel')
                }
            }, {
                click: this.onFieldAdd.bind(this),
                buttonModel: {
                    cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('add'),
                    isPrimary: true
                }
            }],
            closeOnEscape: false,
            cssClass: this.parent.cssClass,
            target: this.parentElement.parentElement,
            close: this.dialogClose.bind(this)
        });
        this.fieldDialog.isStringTemplate = true;
        this.fieldDialog.appendTo(fieldListDialog);
        // this.fieldDialog.element.querySelector('.e-dlg-header').innerText = this.parent.localeObj.getConstant('adaptiveFieldHeader');
    }

    private dialogClose(): void {
        if (document.getElementById(this.parent.element.id + '_FieldListTreeView')) {
            remove(document.getElementById(this.parent.element.id + '_FieldListTreeView'));
        }
    }

    private createTreeView(treeData: { [key: string]: Object }[]): HTMLElement {
        const editorTreeWrapper: HTMLElement = createElement('div', {
            id: this.parent.element.id + 'EditorDiv',
            className: cls.EDITOR_TREE_WRAPPER_CLASS
        });
        const searchWrapper: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: cls.EDITOR_SEARCH_WRAPPER_CLASS
        });
        const editorSearch: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
        searchWrapper.appendChild(editorSearch);
        const treeOuterDiv: HTMLElement = createElement('div', { className: cls.FIELD_LIST_TREE_OUTER_DIV_CLASS });
        const treeViewContainer: HTMLElement = createElement('div', {
            className: cls.EDITOR_TREE_CONTAINER_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-field-list-tree' : '')
        });
        editorTreeWrapper.appendChild(searchWrapper);
        this.editorSearch = new MaskedTextBox({
            showClearButton: true,
            placeholder: this.parent.localeObj.getConstant('search'),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            cssClass: cls.EDITOR_SEARCH_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            change: this.textChange.bind(this)
        });
        this.editorSearch.isStringTemplate = true;
        this.editorSearch.appendTo(editorSearch);
        const promptDiv: HTMLElement = createElement('div', {
            className: cls.EMPTY_MEMBER_CLASS + ' ' + cls.ICON_DISABLE
        });
        promptDiv.innerText = this.parent.localeObj.getConstant('noMatches');
        editorTreeWrapper.appendChild(promptDiv);
        treeOuterDiv.appendChild(treeViewContainer);
        editorTreeWrapper.appendChild(treeOuterDiv);
        this.fieldTable = new TreeView({
            fields: { dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass' },
            showCheckBox: true,
            autoCheck: false,
            loadOnDemand: this.parent.dataType === 'olap' ? false : true,
            sortOrder: this.parent.dataType === 'olap' ? 'None' : 'Ascending',
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            cssClass: this.parent.cssClass,
            nodeChecked: this.addNode.bind(this),
            drawNode: this.updateTreeNode.bind(this),
            nodeExpanding: this.updateNodeIcon.bind(this),
            nodeCollapsed: this.updateNodeIcon.bind(this),
            nodeSelected: (args: NodeSelectEventArgs) => {
                removeClass([args.node], 'e-active');
                args.cancel = true;
            }
        });
        this.fieldTable.isStringTemplate = true;
        this.fieldTable.appendTo(treeViewContainer);
        return editorTreeWrapper;
    }

    private textChange(e: MaskChangeEventArgs): void {
        this.parent.pivotCommon.eventBase.searchTreeNodes(e, this.fieldTable, true);
        let promptDiv: HTMLElement;
        let treeOuterDiv: HTMLElement;
        if (this.parent.isAdaptive) {
            promptDiv = this.fieldDialog.element.querySelector('.' + cls.EMPTY_MEMBER_CLASS);
        }
        else {
            promptDiv = this.parentElement.querySelector('.' + cls.EMPTY_MEMBER_CLASS);
            treeOuterDiv = this.parentElement.querySelector('.' + cls.TREE_CONTAINER);
        }
        const liList: HTMLElement[] = [].slice.call(this.fieldTable.element.querySelectorAll('li')) as HTMLElement[];
        const disabledList: HTMLElement[] = [].slice.call(this.fieldTable.element.querySelectorAll('li.' + cls.ICON_DISABLE)) as HTMLElement[];
        if (liList.length === disabledList.length) {
            removeClass([promptDiv], cls.ICON_DISABLE);
            if (!this.parent.isAdaptive) {
                addClass([treeOuterDiv], cls.ICON_DISABLE);
                removeClass([treeOuterDiv], cls.FIELD_LIST_TREE_OUTER_DIV_SEARCH_CLASS);
            }
        } else {
            addClass([promptDiv], cls.ICON_DISABLE);
            if (!this.parent.isAdaptive) {
                removeClass([treeOuterDiv], cls.ICON_DISABLE);
                addClass([treeOuterDiv], cls.FIELD_LIST_TREE_OUTER_DIV_SEARCH_CLASS);
            }
        }
        this.isSearching = disabledList.length > 0 ? true : false;
        this.nonSearchList = disabledList;
        if (this.parent.dataType === 'olap') {
            this.parentIDs = [];
            for (let i: number = 0; i < liList.length; i++) {
                if (liList[i as number].classList.contains('e-level-1')) {
                    const id: string = liList[i as number].getAttribute('data-uid');
                    this.parentIDs.push(id);
                }
            }
        }
    }

    private dragStart(args: DragAndDropEventArgs): void {
        if ((args.event.target as HTMLElement).classList.contains(cls.DRAG_CLASS) &&
            !(args.event.target as HTMLElement).classList.contains(cls.DRAG_DISABLE_CLASS)) {
            const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(args.draggedNode.getAttribute('data-uid'), this.parent);
            const dragEventArgs: FieldDragStartEventArgs = {
                fieldName: fieldInfo.fieldName, fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis,
                dataSourceSettings: this.parent.dataSourceSettings, cancel: false
            };
            const control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
            control.trigger(events.fieldDragStart, dragEventArgs, (observedArgs: FieldDragStartEventArgs) => {
                if (!observedArgs.cancel) {
                    this.parent.isDragging = true;
                    addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
                    let data: IField;
                    if (this.parent.dataType === 'olap') {
                        data = this.parent.olapEngineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
                    } else {
                        data = this.parent.engineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
                    }
                    const axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
                    if (data && data.aggregateType === 'CalculatedField') {
                        for (const axisContent of axis) {
                            addClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                        }
                    }
                    const dragItem: HTMLElement = args.clonedNode;
                    if (dragItem && (this.parent.getModuleName() === 'pivotfieldlist' &&
                        this.parent.renderMode) === 'Popup') {
                        dragItem.style.zIndex = (this.parent.dialogRenderer.fieldListDialog.zIndex + 1).toString();
                    }
                } else {
                    this.parent.isDragging = false;
                    args.cancel = true;
                }
            });
        } else {
            this.parent.isDragging = false;
            args.cancel = true;
        }
    }

    // private getFieldDragArgs(args: DragAndDropEventArgs): FieldDragStartEventArgs {
    //     let fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(args.draggedNode.getAttribute('data-uid'), this.parent);
    //     let dragEventArgs: any = {
    //         fieldName: fieldInfo.fieldName, fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis,
    //         dataSourceSettings: this.parent.dataSourceSettings, cancel: false
    //     }
    //     let treeModule: TreeViewRenderer = this;
    //     let control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
    //     control.trigger(events.fieldDragStart, dragEventArgs);
    //     return dragEventArgs;
    // }

    // private getFieldDragEventArgs(dragEventArgs: FieldDragStartEventArgs): FieldDragStartEventArgs | Deferred {
    //     let callbackPromise: Deferred = new Deferred();
    //     let control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
    //     control.trigger(events.fieldDragStart, dragEventArgs, (observedArgs: FieldDragStartEventArgs) => {
    //         callbackPromise.resolve(observedArgs);
    //     });
    //     return callbackPromise;
    // }

    private dragStop(args: DragAndDropEventArgs): void {
        args.cancel = true;
        this.parent.isDragging = false;
        const axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (const axisElement of axis) {
            removeClass([this.parentElement.querySelector('.' + axisElement)], cls.NO_DRAG_CLASS);
        }
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        const fieldName: string = args.draggedNodeData.id.toString();
        if (!this.isNodeDropped(args, fieldName)) { return; }
        const list: { [key: string]: Object } = this.parent.pivotFieldList;
        const selectedNode: { [key: string]: Object } = list[fieldName as string] as { [key: string]: Object };
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            (this.parent.isPopupView && (this.parent as PivotFieldList).pivotGridModule ?
                (this.parent as PivotFieldList).pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, fieldName)) {
            if (this.parent.allowDeferLayoutUpdate) {
                selectedNode.isSelected = true;
                this.updateDataSource();
            } else {
                this.parent.updateDataSource();
            }
            const parent: PivotFieldList = this.parent;
            //setTimeout(() => {
            parent.axisFieldModule.render();
            //});
        }
    }
    private isNodeDropped(args: DragAndDropEventArgs, targetID: string): boolean {
        let isDropped: boolean = true;
        if (args.draggedNodeData.isChecked === 'true') {
            const target: HTMLElement = this.getButton(targetID);
            const axisPanel: HTMLElement = closest(target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            const droppableElement: HTMLElement = closest(args.target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            if (target && axisPanel === droppableElement) {
                const pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                const dropTarget: HTMLElement = closest(args.target, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
                let sourcePosition: number;
                let dropPosition: number = -1;
                for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                    if (pivotButtons[i as number].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        const droppableButton: HTMLElement = dropTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
                        if (pivotButtons[i as number].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || (sourcePosition === (pivotButtons.length - 1) && dropPosition === -1)) {
                    const parentElement: HTMLElement = document.getElementById(this.parent.element.id + '_Container');
                    removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    }
    private getButton(fieldName: string): HTMLElement {
        const wrapperElement: HTMLElement = document.getElementById(this.parent.element.id + '_Container');
        const pivotButtons: HTMLElement[] = [].slice.call(wrapperElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        let buttonElement: HTMLElement;
        for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
            if (pivotButtons[i as number].getAttribute('data-uid') === fieldName) {
                buttonElement = pivotButtons[i as number];
                break;
            }
        }
        return buttonElement;
    }
    private nodeStateChange(args: NodeCheckEventArgs): void {
        if (!args.isInteracted) {
            return;
        }
        const node: HTMLElement = closest(args.node, '.' + cls.TEXT_CONTENT_CLASS) as HTMLElement;
        if (!isNullOrUndefined(node)) {
            const li: HTMLElement = closest(node, 'li') as HTMLElement;
            const id: string = li.getAttribute('data-uid');
            if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
                this.parent.pivotCommon.filterDialog.dialogPopUp.close();
            }
            const list: { [key: string]: Object } = this.parent.pivotFieldList;
            const selectedNode: { [key: string]: Object } = list[id as string] as { [key: string]: Object };
            const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(id, this.parent);
            const control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
            const parentNode: Element = node.closest('.' + cls.FIELD_TREE_PARENT);
            if (args.action === 'check') {
                const eventdrop: FieldDropEventArgs = {
                    fieldName: id, dropField: fieldInfo.fieldItem,
                    dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                    dropAxis: (selectedNode.type === 'number' || (selectedNode.type === 'CalculatedField' &&
                        selectedNode.formula && (selectedNode.formula as string).indexOf('Measure') > -1 &&
                        this.parent.dataType === 'olap')) ? 'values' : 'rows',
                    dropPosition: fieldInfo.position, draggedAxis: 'fieldlist', cancel: false
                };
                control.trigger(events.fieldDrop, eventdrop, (observedArgs: FieldDropEventArgs) => {
                    if (!observedArgs.cancel) {
                        addClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                        if (parentNode) {
                            addClass([parentNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                        }
                        this.updateSelectedNodes(li, args.action);
                        const addNode: IFieldOptions = this.parent.pivotCommon.dataSourceUpdate.getNewField(id, fieldInfo.fieldItem);
                        this.updateReportSettings(addNode, observedArgs);
                        this.updateNodeStateChange(id, args, selectedNode);
                    } else {
                        this.updateCheckState(selectedNode, args.action);
                    }
                });
            } else {
                const removeFieldArgs: FieldRemoveEventArgs = {
                    cancel: false, fieldName: id,
                    dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                    fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis
                };
                control.trigger(events.fieldRemove, removeFieldArgs, (observedArgs: FieldRemoveEventArgs) => {
                    if (!observedArgs.cancel) {
                        removeClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                        if (parentNode && isNullOrUndefined(parentNode.querySelector('.' + cls.FIELD_TREE_CHILD + ' .' + cls.NODE_CHECK_CLASS))) {
                            removeClass([parentNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                        }
                        this.updateSelectedNodes(li, args.action);
                        this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(id);
                        if (this.parent.dataType === 'pivot' && this.parent.showValuesButton && this.parent.dataSourceSettings.values.length > 1 &&
                            fieldInfo && fieldInfo.position < this.parent.dataSourceSettings.valueIndex &&
                            ((this.parent.dataSourceSettings.valueAxis === 'row' && fieldInfo.axis === 'rows') ||
                                (this.parent.dataSourceSettings.valueAxis === 'column' && fieldInfo.axis === 'columns'))) {
                            control.setProperties({ dataSourceSettings: { valueIndex: this.parent.dataSourceSettings.valueIndex - 1 } }
                                , true);
                        }
                        if (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.values.length === 0) {
                            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[Measures]');
                        }
                        this.updateNodeStateChange(id, args, selectedNode);
                    } else {
                        this.updateCheckState(selectedNode, args.action);
                    }
                });
            }
        }
    }

    private updateReportSettings(newField: IFieldOptions, dropArgs: FieldDropEventArgs): void {
        let dropPosition: number = dropArgs.dropPosition;
        const dropClass: string = dropArgs.dropAxis;
        if (this.parent.dataType === 'pivot' && this.parent.showValuesButton && this.parent.dataSourceSettings.values.length > 1) {
            const dropAxisFields: IFieldOptions[] = (this.parent.dataSourceSettings.valueAxis === 'row' &&
                dropClass === 'rows') ? this.parent.dataSourceSettings.rows : (this.parent.dataSourceSettings.valueAxis === 'column' && dropClass === 'columns') ?
                    this.parent.dataSourceSettings.columns : undefined;
            if (!isNullOrUndefined(dropAxisFields)) {
                if (dropPosition === -1 && this.parent.dataSourceSettings.valueIndex === -1) {
                    this.parent.setProperties({ dataSourceSettings: { valueIndex: dropAxisFields.length } }, true);
                } else if (dropPosition > -1 && dropPosition <= this.parent.dataSourceSettings.valueIndex) {
                    this.parent.setProperties({ dataSourceSettings: { valueIndex: this.parent.dataSourceSettings.valueIndex + 1 } }, true);
                } else if (this.parent.dataSourceSettings.valueIndex > -1 && dropPosition > this.parent.dataSourceSettings.valueIndex) {
                    dropPosition = dropPosition - 1;
                }
            }
        }
        switch (dropClass) {
        case 'filters':
            if (dropPosition !== -1) {
                this.parent.dataSourceSettings.filters.splice(dropPosition, 0, newField);
            } else{
                this.parent.dataSourceSettings.filters.push(newField);
            }
            break;
        case 'rows':
            if (dropPosition !== -1) {
                this.parent.dataSourceSettings.rows.splice(dropPosition, 0, newField);
            } else{
                this.parent.dataSourceSettings.rows.push(newField);
            }
            break;
        case 'columns':
            if (dropPosition !== -1) {
                this.parent.dataSourceSettings.columns.splice(dropPosition, 0, newField);
            } else {
                this.parent.dataSourceSettings.columns.push(newField);
            }
            break;
        case 'values':
            if (dropPosition !== -1) {
                this.parent.dataSourceSettings.values.splice(dropPosition, 0, newField);
            } else {
                this.parent.dataSourceSettings.values.push(newField);
            }
            if (this.parent.dataType === 'olap' && this.parent.olapEngineModule &&
                !(this.parent.olapEngineModule).isMeasureAvail && !(this.parent.dataSourceSettings.values.length > 1)) {
                const measureField: IFieldOptions = {
                    name: '[Measures]', caption: 'Measures', baseField: undefined, baseItem: undefined
                };
                const fieldAxis: IFieldOptions[] = this.parent.dataSourceSettings.valueAxis === 'row' ?
                    this.parent.dataSourceSettings.rows : this.parent.dataSourceSettings.columns;
                fieldAxis.push(measureField);
            }
            break;
        }
    }

    private updateCheckState(selectedNode: { [key: string]: Object }, action: string): void {
        const chkState: NodeListOf<Element> = this.fieldTable.element.querySelectorAll('.' + cls.CHECKBOX_CONTAINER);
        const innerText: NodeListOf<Element> = this.fieldTable.element.querySelectorAll('.e-list-text');
        for (let i: number = 0; i < chkState.length; i++) {
            if (selectedNode.caption === innerText[i as number].textContent) {
                if (action === 'check') {
                    this.fieldTable.uncheckAll([selectedNode['id'] as string]);
                } else {
                    this.fieldTable.checkAll([selectedNode['id'] as string]);
                }
            }
        }
    }

    private updateNodeStateChange(id: string, args: NodeCheckEventArgs, selectedNode: { [key: string]: Object }): void {
        if (!this.parent.allowDeferLayoutUpdate) {
            this.parent.updateDataSource(true);
        } else {
            selectedNode.isSelected = args.action === 'check';
            if (this.parent.dataType === 'olap') {
                this.parent.olapEngineModule.updateFieldlistData(id, args.action === 'check');
            }
            this.updateDataSource();
        }
        const selectedLi: HTMLElement = this.treeViewElement.querySelector('[data-uid="' + id + '"]');
        selectedLi.focus();
        removeClass([selectedLi], 'e-hover');
        const parent: PivotFieldList = this.parent;
        setTimeout(() => {
            parent.axisFieldModule.render();
        });
    }

    private updateSelectedNodes(li: HTMLElement, state: string): void {
        if (li && li.querySelector('ul')) {
            for (const element of [].slice.call(li.querySelectorAll('li'))) {
                if (state === 'check') {
                    addClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                } else {
                    removeClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                }
            }
        }
    }

    private updateDataSource(): void {
        if (this.parent.isPopupView) {
            if (this.parent.dataType === 'olap') {
                (this.parent as PivotFieldList).pivotGridModule.olapEngineModule = (this.parent as PivotFieldList).olapEngineModule;
            } else {
                (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
            }
            // eslint-disable-next-line max-len
            (this.parent as PivotFieldList).pivotGridModule.setProperties({ dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties as IDataOptions }, true);
            (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
        } else {
            this.parent.triggerPopulateEvent();
        }
    }

    private addNode(args: NodeCheckEventArgs): void {
        if (!args.isInteracted) {
            return;
        }
        const fieldList: { [key: string]: Object } = this.parent.pivotFieldList;
        const selectedNode: { [key: string]: Object } = fieldList[args.data[0].id.toString()] as { [key: string]: Object };
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(selectedNode.id.toString(), this.parent);
        const control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
        if (args.action === 'check') {
            const axis: string[] = ['filters', 'columns', 'rows', 'values'];
            const eventdrop: FieldDropEventArgs = {
                fieldName: fieldInfo.fieldName, dropField: fieldInfo.fieldItem,
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                dropAxis: axis[this.parent.dialogRenderer.adaptiveElement.selectedItem], draggedAxis: 'fieldlist', cancel: false
            };
            control.trigger(events.fieldDrop, eventdrop, (observedArgs: FieldDropEventArgs) => {
                if (!observedArgs.cancel) {
                    this.selectedNodes.push(selectedNode.id.toString());
                } else {
                    this.updateCheckState(selectedNode, args.action);
                }
            });
        } else {
            const removeFieldArgs: FieldRemoveEventArgs = {
                cancel: false, fieldName: fieldInfo.fieldName,
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis
            };
            control.trigger(events.fieldRemove, removeFieldArgs, (observedArgs: FieldRemoveEventArgs) => {
                if (!observedArgs.cancel) {
                    let count: number = this.selectedNodes.length;
                    while (count--) {
                        if (this.selectedNodes[count as number] === selectedNode.id.toString()) {
                            this.selectedNodes.splice(count, 1);
                            break;
                        }
                    }
                } else {
                    this.updateCheckState(selectedNode, args.action);
                }
            });
        }
    }

    private refreshTreeView(): void {
        if (this.fieldTable) {
            const treeData: { [key: string]: Object }[] = this.getUpdatedData();
            this.fieldTable.fields = {
                dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass'
            };
            this.fieldTable.dataBind();
        }
    }

    private getUpdatedData(): { [key: string]: Object }[] {
        const treeData: { [key: string]: Object }[] = this.getTreeData();
        const expandedNodes: string[] = this.fieldTable.expandedNodes;
        this.updateExpandedNodes(treeData, expandedNodes);
        return this.applySorting(treeData, this.fieldListSort);
    }
    private getTreeData(axis?: number): { [key: string]: Object }[] {
        let data: { [key: string]: Object }[] = [];
        if (this.parent.dataType === 'olap') {
            data = this.getOlapTreeData(axis);
        } else {
            const keys: string[] = this.parent.pivotFieldList ? Object.keys(this.parent.pivotFieldList) : [];
            const treeDataInfo: { [key: string]: { id?: string; pid?: string; caption?: string; isSelected?: boolean;
                hasChildren?: boolean } } = {};
            for (const key of keys) {
                const member: IField = this.parent.pivotFieldList[key as string];
                treeDataInfo[key as string] = { id: member.id, pid: member.pid, caption: member.caption, isSelected: member.isSelected };
                if (!isNullOrUndefined(member.pid) && !treeDataInfo[key as string].hasChildren) {
                    const parentId: string = member.pid + '_group_name';
                    treeDataInfo[key as string].pid = parentId;
                    treeDataInfo[parentId as string] = {
                        id: parentId, caption: member.pid,
                        isSelected: treeDataInfo[parentId as string] && treeDataInfo[parentId as string].isSelected
                            ? treeDataInfo[parentId as string].isSelected : member.isSelected, hasChildren: true
                    };
                }
            }
            if (this.parent.isAdaptive) {
                const fields: IFieldOptions[][] =
                    [this.parent.dataSourceSettings.filters, this.parent.dataSourceSettings.columns,
                        this.parent.dataSourceSettings.rows,
                        this.parent.dataSourceSettings.values];
                const currentFieldSet: IFieldOptions[] = fields[axis as number];
                let len: number = keys.length;
                while (len--) {
                    treeDataInfo[keys[len as number]].isSelected = false;
                }
                for (const item of currentFieldSet) {
                    treeDataInfo[item.name].isSelected = true;
                }
            }
            const members: string[] = Object.keys(treeDataInfo);
            for (const member of members) {
                const obj: { [key: string]: Object } = treeDataInfo[member as string] as { [key: string]: Object };
                data.push(obj);
            }
        }
        return data;
    }
    private getOlapTreeData(axis?: number): { [key: string]: Object }[] {
        let data: { [key: string]: Object }[] = [];
        const fieldListData: IOlapField[] =
            this.parent.olapEngineModule.fieldListData ? this.parent.olapEngineModule.fieldListData : [];
        if (this.parent.isAdaptive) {
            const fields: IFieldOptions[][] = [
                this.parent.dataSourceSettings.filters, this.parent.dataSourceSettings.columns,
                this.parent.dataSourceSettings.rows, this.parent.dataSourceSettings.values];
            const currentFieldSet: IFieldOptions[] = fields[axis as number];
            let i: number = 0;
            while (i < fieldListData.length) {
                const item: IOlapField = fieldListData[i as number];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let framedSet: { [key: string]: any };
                if (axis === 3) {
                    if ((item.id as string).toLowerCase() !== '[measures]' &&
                        ((item.id as string).toLowerCase().indexOf('[measures]') === 0 ||
                            (item.spriteCssClass && item.spriteCssClass.indexOf('e-measureCDB') !== -1)) ||
                        ((item.id as string).toLowerCase() === '[calculated members].[_0]' ||
                            (item.spriteCssClass && item.spriteCssClass.indexOf('e-calc-measure-icon') !== -1))) {
                        framedSet = {
                            id: item.id, caption: item.caption, hasChildren: item.hasChildren,
                            type: item.type, aggregateType: item.aggregateType,
                            isSelected: item.isSelected, pid: item.pid, spriteCssClass: item.spriteCssClass
                        };
                        framedSet.isSelected = false;
                        if (framedSet.spriteCssClass && framedSet.spriteCssClass.indexOf('e-measureCDB') !== -1) {
                            framedSet.spriteCssClass = framedSet.spriteCssClass.replace('e-folderCDB-icon', 'e-measureGroupCDB-icon');
                            framedSet.pid = undefined;
                        }
                        for (const field of currentFieldSet) {
                            if (framedSet.id === field.name) {
                                framedSet.isSelected = true;
                                break;
                            }
                        }
                        data.push(framedSet);
                    }
                } else {
                    if (!((item.id as string).toLowerCase().indexOf('[measures]') === 0) &&
                        !(item.spriteCssClass && item.spriteCssClass.indexOf('e-measureCDB') !== -1) &&
                        !(item.spriteCssClass && item.spriteCssClass.indexOf('e-calc-measure-icon') !== -1)) {
                        framedSet = {
                            id: item.id, caption: item.caption, hasChildren: item.hasChildren,
                            type: item.type, aggregateType: item.aggregateType,
                            isSelected: item.isSelected, pid: item.pid, spriteCssClass: item.spriteCssClass
                        };
                        framedSet.isSelected = false;
                        for (const item of currentFieldSet) {
                            if (framedSet.id === item.name) {
                                framedSet.isSelected = true;
                                break;
                            }
                        }
                        data.push(framedSet);
                    }
                }
                i++;
            }
        } else {
            data = isNullOrUndefined(this.parent.olapEngineModule.fieldListData) ? [] :
                PivotUtil.getClonedData(this.parent.olapEngineModule.fieldListData as { [key: string]: Object }[]);
        }
        return data;
    }
    private updateExpandedNodes(data: { [key: string]: Object }[], expandedNodes: string[]): void {
        if (expandedNodes.length > 0) {
            let i: number = 0;
            for (const field of data) {
                if (expandedNodes.indexOf((field as IOlapField).id) > -1) {
                    i++;
                    (field as IOlapField).expanded = true;
                    (field as IOlapField).spriteCssClass = ((field as IOlapField).spriteCssClass &&
                        (field as IOlapField).spriteCssClass.toString().indexOf('e-folderCDB-icon') > -1 ?
                        (field as IOlapField).spriteCssClass.toString().replace('e-folderCDB-icon', 'e-folderCDB-open-icon') :
                        (field as IOlapField).spriteCssClass);
                    if (i === (expandedNodes.length)) {
                        break;
                    }
                }
            }
        }
    }
    private updateSorting(args: Event): void {
        const target: HTMLElement = (args.target as HTMLElement);
        const option: string = target.getAttribute('data-sort');
        this.parent.actionObj.actionName = events.sortFieldTree;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        try {
            if (target.className.indexOf('e-selected') === -1) {
                switch (option) {
                case 'None':
                    this.fieldListSort = 'None';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-ascend')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-descend')], 'e-selected');
                    break;
                case 'Ascend':
                    this.fieldListSort = 'Ascend';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-none')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-descend')], 'e-selected');
                    break;
                case 'Descend':
                    this.fieldListSort = 'Descend';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-ascend')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-none')], 'e-selected');
                    break;
                }
                this.refreshTreeView();
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
        this.parent.actionObj.actionName = this.parent.getActionCompleteName();
        if (this.parent.actionObj.actionName) {
            this.parent.actionCompleteMethod();
        }
    }
    private applySorting(treeData: { [key: string]: Object }[], sortOrder: string): { [key: string]: Object }[] {
        if (treeData.length > 0) {
            if (this.parent.dataType === 'olap') {
                let measure: { [key: string]: Object };
                let calcMember: { [key: string]: Object };
                if (this.parent.dataSourceSettings.calculatedFieldSettings.length > 0 &&
                    (treeData[0].id as string).toLowerCase() === '[calculated members].[_0]') {
                    calcMember = treeData[0];
                    measure = treeData[1];
                    treeData.splice(0, 2);
                } else {
                    measure = treeData[0];
                    treeData.splice(0, 1);
                }
                treeData = sortOrder === 'Ascend' ?
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (treeData.sort((a: any, b: any) => (a.caption > b.caption) ? 1 : ((b.caption > a.caption) ? -1 : 0))) :
                    sortOrder === 'Descend' ?
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (treeData.sort((a: any, b: any) => (a.caption < b.caption) ? 1 : ((b.caption < a.caption) ? -1 : 0))) :
                        treeData;
                if (calcMember) {
                    treeData.splice(0, 0, calcMember, measure);
                } else {
                    treeData.splice(0, 0, measure);
                }
            } else {
                this.fieldTable.sortOrder = ((sortOrder === 'Ascend' ? 'Ascending' : (sortOrder === 'Descend' ? 'Descending' : 'None')));
            }
        }
        return treeData;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onFieldAdd(e: MouseEventArgs & TouchEventArgs): void {
        this.parent.dialogRenderer.updateDataSource(this.selectedNodes);
        this.closeTreeDialog();
    }

    private closeTreeDialog(): void {
        this.selectedNodes = [];
        this.fieldDialog.hide();
    }
    private keyPress(e: KeyboardEvent): void {
        if (e.keyCode === 13 && e.target) {
            (e.target as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }

    private wireFieldListEvent(element: Element): void {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.updateSorting, this);
    }

    private unWireFieldListEvent(element: Element): void {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.updateSorting);
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
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.treeViewUpdate, this.refreshTreeView);
    }

    /**
     * To destroy the tree view event listener
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.fieldTable && !this.fieldTable.isDestroyed) {
            this.fieldTable.destroy();
            this.fieldTable = null;
        }
        if (this.fieldDialog && !this.fieldDialog.isDestroyed) {
            this.fieldDialog.destroy();
            this.fieldDialog = null;
        }
        if (this.editorSearch && !this.editorSearch.isDestroyed) {
            this.editorSearch.destroy();
            this.editorSearch = null;
        }
        if (this.fieldSearch && !this.fieldSearch.isDestroyed) {
            this.fieldSearch.destroy();
            this.fieldSearch = null;
        }
    }
}
