import { TreeView as BaseTreeView, NodeSelectEventArgs, NodeExpandEventArgs, DrawNodeEventArgs } from '@syncfusion/ej2-navigations';
import { NodeEditEventArgs } from '@syncfusion/ej2-navigations';
import { isNullOrUndefined as isNOU, select, setValue, getValue } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, Touch, closest } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { IFileManager, ReadArgs, ITreeView, FileBeforeLoadEventArgs, NotifyArgs } from '../base/interface';
import { FileManager } from '../base/file-manager';
import { read, Download } from '../common/operations';
import { createDialog } from '../pop-up/dialog';
import { treeNodes, updatePath, getPath, getDirectories } from '../common/utility';
import { removeBlur } from '../common/utility';
import { copyFiles, cutFiles } from '../common/index';

/**
 * `TreeView` module is used to handle Navigation actions.
 */
export class NavigationPane {

    /* Internal variables */
    private parent: IFileManager;
    public treeObj: BaseTreeView;
    private fileObj: FileManager;
    private treeInterface: ITreeView;
    public activeNode: Element;
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private expandNodeTarget: string;
    public rootNode: string;
    public treeNodes: string[] = [];
    public removeNodes: string[] = [];
    public copyNodes: { [key: string]: Object }[];
    public touchClickObj: Touch;
    public expandTree: boolean = false;
    /**
     * Constructor for the TreeView module
     * @hidden
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftF10: 'shift+F10',
            f2: 'f2'
        };
    }

    private onInit(args: ReadArgs): void {
        if (!isNOU(this.treeObj)) { return; }
        let rootData: { [key: string]: Object; } = getValue('/', this.parent.feParent);
        setValue('icon', 'e-fe-folder', rootData);
        this.rootNode = getValue('name', getValue('/', this.parent.feParent));
        this.treeObj = new BaseTreeView({
            fields: { dataSource: [rootData], id: 'nodeId', text: 'name', hasChildren: 'hasChild', iconCss: 'icon' },
            nodeSelected: this.onNodeSelected.bind(this),
            nodeExpanding: this.onNodeExpand.bind(this),
            allowEditing: true,
            nodeEditing: this.onNodeEditing.bind(this),
            drawNode: this.onDrowNode.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.treeObj.appendTo('#' + this.parent.element.id + CLS.TREE_ID);
        this.treeObj.element.style.width = '25%';
        this.parent.persistData = true;
        this.wireEvents();
    }

    private onDrowNode(args: DrawNodeEventArgs): void {
        let eventArgs: FileBeforeLoadEventArgs = {
            element: args.node,
            fileDetails: args.nodeData,
            module: 'navigationpane'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    }

    private addChild(files: { [key: string]: Object; }[], target: string, prevent: boolean): void {
        let directories: Object[] = getDirectories(files);
        if (directories.length > 0) {
            let length: number = 0;
            let folders: { [key: string]: Object; }[] = <{ [key: string]: Object; }[]>directories;
            while (length < directories.length) {
                folders[length].icon = 'e-fe-folder';
                length++;
            }
            this.treeObj.addNodes(directories as { [key: string]: Object; }[], target, null, prevent);
        }
    }

    /**
     * Tree node selection event
     * @private
     */
    private onNodeSelected(args: NodeSelectEventArgs): void {
        this.parent.breadcrumbbarModule.searchObj.element.value = '';
        this.parent.searchedItems = [];
        this.parent.activeElements = this.treeObj.element.querySelectorAll('.' + CLS.ACTIVE);
        if (!args.isInteracted) { return; }
        let text: string = getValue('text', args.nodeData);
        this.activeNode = args.node;
        this.parent.activeModule = 'navigationpane';
        if (!this.parent.persistData) { this.parent.selectedItems = []; }
        updatePath(args.node, text, this.parent);
        this.expandNodeTarget = null;
        if (args.node.querySelector('.' + CLS.ICONS) && args.node.querySelector('.' + CLS.LIST_ITEM) === null) {
            this.expandNodeTarget = 'add';
        }
        this.parent.itemData = this.treeObj.getTreeData(getValue('id', args.nodeData));
        read(this.parent, events.pathChanged, this.parent.path);
        this.parent.visitedItem = args.node;
    }

    /**
     * Tree node expand event
     * @private
     */
    /* istanbul ignore next */
    private onNodeExpand(args: NodeExpandEventArgs): void {
        if (!args.isInteracted) { return; }
        let path: string = getPath(args.node, getValue('text', args.nodeData));
        if (args.node.querySelector('.' + CLS.LIST_ITEM) === null) {
            this.expandNodeTarget = args.node.getAttribute('data-uid');
            this.parent.expandedId = this.expandNodeTarget;
            this.parent.itemData = this.treeObj.getTreeData(getValue('id', args.nodeData));
            read(this.parent, events.nodeExpand, path);
        }
    }

    /* istanbul ignore next */
    private onNodeExpanded(args: ReadArgs): void {
        this.addChild(args.files, this.expandNodeTarget, false);
        this.parent.expandedId = null;
    }

    private onNodeEditing(args: NodeEditEventArgs): void {
        if (!isNOU(args.innerHtml)) {
            args.cancel = true;
        }
    }

    private onPathChanged(args: ReadArgs): void {
        let currFiles: { [key: string]: Object; }[] = getValue(this.parent.path, this.parent.feFiles);
        if (this.expandNodeTarget === 'add') {
            let sNode: Element = select('[data-uid="' + this.treeObj.selectedNodes[0] + '"]', this.treeObj.element);
            let ul: Element = select('.' + CLS.LIST_PARENT, sNode);
            if (isNOU(ul)) {
                this.addChild(args.files, this.treeObj.selectedNodes[0], true);
            }
            this.expandNodeTarget = '';
        }
        if (isNOU(currFiles)) {
            setValue(this.parent.path, args.files, this.parent.feFiles);
        }
    }

    private updateTree(args: ReadArgs): void {
        let id: string = this.treeObj.selectedNodes[0];
        let toExpand: boolean = this.treeObj.expandedNodes.indexOf(id) === -1 ? false : true;
        this.removeChildNodes(id);
        setValue(this.parent.path, args.files, this.parent.feFiles);
        this.addChild(args.files, id, !toExpand);
    }

    private removeChildNodes(id: string): void {
        let sNode: Element = select('[data-uid="' + id + '"]', this.treeObj.element);
        let parent: Element = select('.' + CLS.LIST_PARENT, sNode);
        let childs: Element[] = parent ? Array.prototype.slice.call(parent.children) : null;
        this.treeObj.removeNodes(childs);
    }

    private onOpenEnd(args: ReadArgs): void {
        let sleId: string = this.parent.pathId[this.parent.pathId.length - 1];
        this.treeObj.expandAll(this.treeObj.selectedNodes);
        this.treeObj.selectedNodes = [sleId];
        this.expandNodeTarget = 'add';
        this.onPathChanged(args);
    }

    private onOpenInit(args: NotifyArgs): void {
        if (this.parent.activeModule === 'navigationpane') {
            if (args.target.querySelector('.' + CLS.ICONS)) {
                this.treeObj.expandAll(this.treeObj.selectedNodes);
            }
        }
    }

    private onInitialEnd(args: ReadArgs): void {
        this.onInit(args);
        this.addChild(args.files, getValue('nodeId', args.cwd), false);
    }

    private onFinalizeEnd(args: ReadArgs): void {
        this.onInit(args);
        this.addChild(args.files, getValue('nodeId', args.cwd), false);
        this.treeObj.selectedNodes = [this.parent.pathId[this.parent.pathId.length - 1]];
    }

    private onCreateEnd(args: ReadArgs): void {
        this.updateTree(args);
    }
    /* istanbul ignore next */
    private onDeleteEnd(args: ReadArgs): void {
        if (this.parent.activeModule === 'navigationpane') {
            let selectedNode: string = this.treeObj.selectedNodes[0];
            let selcetedEle: Element = select('[data-uid="' + selectedNode + '"]', this.treeObj.element);
            let selectedNodeEle: HTMLElement = closest(selcetedEle, '.' + CLS.LIST_PARENT).parentElement;
            this.treeObj.selectedNodes = [selectedNodeEle.getAttribute('data-uid')];
            this.treeObj.dataBind();
        }
        this.updateTree(args);
    }

    private onRefreshEnd(args: ReadArgs): void {
        this.updateTree(args);
    }

    private onRenameInit(): void {
        if (this.parent.selectedItems.length === 0) {
            this.updateRenameData();
        }
    }

    /* istanbul ignore next */
    private onRenameEnd(args: ReadArgs): void {
        let resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeObj.getTreeData()).
            executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.currentItemText, false));
        if (resultData[0]) {
            this.treeObj.updateNode(resultData[0][this.treeObj.fields.id].toString(), this.parent.renameText);
        }

    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'enableRtl':
                    if (this.treeObj) {
                        this.treeObj.enableRtl = e.newProp.enableRtl;
                        this.treeObj.dataBind();
                    }
                    break;
                case 'navigationPaneSettings':
                    let args: ReadArgs = { files: getValue('/', this.parent.feFiles) };
                    this.onFinalizeEnd(args);
                    break;
            }
        }
    }

    /* istanbul ignore next */
    private onDownLoadInit(): void {
        this.updateActionData();
    }

    private onSelectionChanged(e: NotifyArgs): void {
        this.treeObj.selectedNodes = [e.selectedNode];
    }

    private onClearPathInit(e: NotifyArgs): void {
        this.removeChildNodes(e.selectedNode);
    }

    private addEventListener(): void {
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.downloadInit, this.onDownLoadInit, this);
        this.parent.on(events.initialEnd, this.onInitialEnd, this);
        this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(events.pathChanged, this.onPathChanged, this);
        this.parent.on(events.nodeExpand, this.onNodeExpanded, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
        this.parent.on(events.updateTreeSelection, this.onSelectionChanged, this);
        this.parent.on(events.openInit, this.onOpenInit, this);
        this.parent.on(events.openEnd, this.onOpenEnd, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.renameInit, this.onRenameInit, this);
        this.parent.on(events.renameEnd, this.onRenameEnd, this);
        this.parent.on(events.clearPathInit, this.onClearPathInit, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.initialEnd, this.onInitialEnd);
        this.parent.off(events.downloadInit, this.onDownLoadInit);
        this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.pathChanged, this.onPathChanged);
        this.parent.off(events.updateTreeSelection, this.onSelectionChanged);
        this.parent.off(events.nodeExpand, this.onNodeExpanded);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.refreshEnd, this.onRefreshEnd);
        this.parent.off(events.openInit, this.onOpenInit);
        this.parent.off(events.openEnd, this.onOpenEnd);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.renameInit, this.onRenameInit);
        this.parent.off(events.renameEnd, this.onRefreshEnd);
        this.parent.off(events.clearPathInit, this.onClearPathInit);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'navigationpane';
    }

    /**
     * Destroys the TreeView module.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (this.treeObj) {
            this.unWireEvents();
            this.treeObj.destroy();
        }
    }
    private wireEvents(): void {
        this.keyboardModule = new KeyboardEvents(
            this.treeObj.element,
            {
                keyAction: this.keyDown.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private unWireEvents(): void {
        this.keyboardModule.destroy();
    }

    /* istanbul ignore next */
    private keyDown(e: KeyboardEventArgs): void {
        let action: string = e.action;
        let fileObj: FileManager = <FileManager>this.parent;
        switch (action) {
            case 'altEnter':
                this.parent.getDetails();
                break;
            case 'esc':
                removeBlur(this.parent as IFileManager);
                this.parent.selectedNodes = [];
                this.treeNodes = [];
                break;
            case 'del':
                this.removeNodes = [];
                createDialog(this.parent, 'Delete');
                break;
            case 'ctrlC':
                copyFiles(this.parent as IFileManager);
                fileObj.fileOperation(this.parent.nodeNames);
                this.copyNodes = <{ [key: string]: Object }[]>this.parent.nodeNames;
                break;
            case 'ctrlV':
                fileObj.pasteHandler();
                break;
            case 'ctrlX':
                cutFiles(this.parent as IFileManager);
                fileObj.fileOperation(this.parent.nodeNames);
                break;
            case 'shiftF10':
                Download(this.parent, this.parent.detailsviewModule.gridObj.getSelectedRecords());
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 0) {
                    this.updateRenameData();
                    createDialog(this.parent, 'Rename');
                }
                break;
        }
    }

    private updateRenameData(): void {
        this.updateActionData();
        this.parent.currentItemText = getValue('name', this.parent.itemData[0]);
    }

    private updateActionData(): void {
        let data: Object = this.treeObj.getTreeData(this.treeObj.selectedNodes[0])[0];
        this.parent.itemData = [data];
        this.parent.isFile = false;
    }

    /**
     * Move tree folders on cut operation
     * @public
     */
    public moveNode(): void {
        this.treeObj.moveNodes(this.treeNodes, this.treeObj.selectedNodes[0], null);
        let i: number = 0;
        let nodes: { [key: string]: Object }[] = [];
        let fileObj: FileManager = <FileManager>this.parent;
        removeBlur(this.parent as IFileManager);
        this.treeNodes = [];
    }

    /**
     * Remove tree folders on delete operation
     * @public
     */
    /* istanbul ignore next */
    public removeNode(): void {
        this.treeObj.removeNodes(this.removeNodes);
        let fileObj: FileManager = <FileManager>this.parent;
        removeBlur(this.parent as IFileManager);
        this.removeNodes = [];
    }

    /**
     * Add tree folders on copy operation
     * @public
     */
    public copyNode(): void {
        this.treeObj.addNodes(<{ [key: string]: Object }[]>this.copyNodes, this.activeNode, null);
        let fileObj: FileManager = <FileManager>this.parent;
        removeBlur(this.parent as IFileManager);
    }
}