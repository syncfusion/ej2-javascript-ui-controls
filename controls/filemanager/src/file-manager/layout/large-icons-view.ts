import { ListBase, ListBaseOptions, ItemCreatedArgs } from '@syncfusion/ej2-lists';
import { createElement, select, selectAll, EventHandler, KeyboardEvents, closest, DragEventArgs, Draggable } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, addClass, removeClass, Touch, TapEventArgs, isVisible } from '@syncfusion/ej2-base';
import { TouchEventArgs, MouseEventArgs, KeyboardEventArgs, getValue, setValue, remove } from '@syncfusion/ej2-base';
import { IFileManager, FileOpenEventArgs, FileLoadEventArgs } from '../base/interface';
import { FileSelectEventArgs, NotifyArgs, FileSelectionEventArgs } from '../base/interface';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import { ReadArgs, MouseArgs } from '../../index';
import * as CLS from '../base/classes';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { read, GetDetails, Delete } from '../common/operations';
import { doRename, getAccessClass, getPathObject, getFullPath, getDirectoryPath, rename, doDownload, getItemName } from '../common/index';
import { removeBlur, cutFiles, copyFiles, addBlur, openSearchFolder, removeActive, pasteHandler } from '../common/index';
import { createVirtualDragElement, dragStopHandler, dragStartHandler, draggingHandler, getModule } from '../common/index';
import { updateRenamingData, doDeleteFiles, doDownloadFiles } from '../common/index';
import { openAction, fileType, refresh, getImageUrl, getSortedData, createDeniedDialog, updateLayout } from '../common/utility';
import { createEmptyElement, hasReadAccess, hasEditAccess } from '../common/utility';
import { createDialog, createImageDialog } from '../pop-up/dialog';

/**
 * LargeIconsView module
 */
export class LargeIconsView {

    /* Internal variables */
    private parent: IFileManager;
    public element: HTMLElement;
    public listObj: ListBaseOptions;
    private keyboardModule: KeyboardEvents;
    private keyboardDownModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private isInteraction: boolean = true;
    private itemList: HTMLElement[];
    // eslint-disable-next-line
    private items: Object[];
    private clickObj: Touch;
    private perRow: number;
    private startItem: Element;
    private multiSelect: boolean;
    public listElements: HTMLElement;
    public uploadOperation: boolean = false;
    private count: number = 0;
    private isRendered: boolean = true;
    private tapCount: number = 0;
    private tapEvent: TapEventArgs;
    private isPasteOperation: boolean = false;
    private dragObj: Draggable;
    private isInteracted: boolean = true;

    /**
     * Constructor for the LargeIcons module.
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @hidden
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.element = <HTMLElement>select('#' + this.parent.element.id + CLS.LARGEICON_ID, this.parent.element);
        addClass([this.element], CLS.LARGE_ICONS);
        this.addEventListener();
        this.keyConfigs = {
            end: 'end',
            home: 'home',
            tab: 'tab',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlEnd: 'ctrl+end',
            ctrlHome: 'ctrl+home',
            ctrlDown: 'ctrl+downarrow',
            ctrlLeft: 'ctrl+leftarrow',
            ctrlRight: 'ctrl+rightarrow',
            ctrlUp: 'ctrl+uparrow',
            shiftEnd: 'shift+end',
            shiftHome: 'shift+home',
            shiftDown: 'shift+downarrow',
            shiftLeft: 'shift+leftarrow',
            shiftRight: 'shift+rightarrow',
            shiftUp: 'shift+uparrow',
            csEnd: 'ctrl+shift+end',
            csHome: 'ctrl+shift+home',
            csDown: 'ctrl+shift+downarrow',
            csLeft: 'ctrl+shift+leftarrow',
            csRight: 'ctrl+shift+rightarrow',
            csUp: 'ctrl+shift+uparrow',
            space: 'space',
            ctrlSpace: 'ctrl+space',
            shiftSpace: 'shift+space',
            csSpace: 'ctrl+shift+space',
            ctrlA: 'ctrl+a',
            enter: 'enter',
            altEnter: 'alt+enter',
            esc: 'escape',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            f2: 'f2',
            shiftdel: 'shift+delete',
            back: 'backspace',
            ctrlD: 'ctrl+d'
        };
    }

    private render(args: ReadArgs): void {
        this.parent.visitedItem = null;
        this.startItem = null;
        showSpinner(this.parent.element);
        if (this.parent.view === 'LargeIcons') {
            this.resetMultiSelect();
            this.element.setAttribute('tabindex', '0');
            if (this.listObj) {
                this.unWireEvents();
                this.removeEventListener();
            }
            this.parent.notify(events.hideLayout, {});
            const iconsView: Element = select('#' + this.parent.element.id + CLS.LARGEICON_ID, this.parent.element);
            const ul: HTMLUListElement = select('ul', iconsView) as HTMLUListElement;
            if (ul) {
                remove(ul);
            }
            this.listObj = {
                ariaAttributes: {
                    itemRole: 'option', listRole: 'listbox', itemText: '',
                    groupItemRole: 'group', wrapperRole: ''
                },
                showIcon: true,
                fields: { text: 'name', iconCss: '_fm_icon', imageUrl: '_fm_imageUrl', htmlAttributes: '_fm_htmlAttr' },
                sortOrder: this.parent.sortOrder,
                itemCreated: this.onItemCreated.bind(this),
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            };
            this.items = [];
            this.items = this.renderList(args);
            this.items = getSortedData(this.parent, this.items);
            // eslint-disable-next-line
            this.listElements = ListBase.createListFromJson(createElement, <{ [key: string]: Object; }[]>this.items, this.listObj);
            this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, this.listElements));
            this.element.appendChild(this.listElements);
            this.preventImgDrag();
            this.createDragObj();
            iconsView.classList.remove(CLS.DISPLAY_NONE);
            if (this.itemList.length === 0) {
                const emptyList: Element = this.element.querySelector('.' + CLS.LIST_PARENT);
                this.element.removeChild(emptyList);
                createEmptyElement(this.parent, this.element, args);
            } else if (this.itemList.length !== 0 && this.element.querySelector('.' + CLS.EMPTY)) {
                this.element.removeChild(this.element.querySelector('.' + CLS.EMPTY));
            }
            if (this.isPasteOperation === true) {
                this.selectItems(this.parent.pasteNodes);
                this.isPasteOperation = false;
            }
            /* istanbul ignore next */
            if (this.uploadOperation === true) {
                this.selectItems(this.parent.uploadItem);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.count++;
                if (this.count === this.parent.uploadItem.length) {
                    this.uploadOperation = false;
                    this.parent.uploadItem = [];
                }
            }
            const activeEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
            if (activeEle.length !== 0) {
                this.parent.activeModule = 'largeiconsview';
            }
            for (let i: number = 0; i < activeEle.length; i++) {
                activeEle[i].setAttribute('aria-selected', 'true');
            }
            this.adjustHeight();
            this.element.style.maxHeight = '100%';
            this.getItemCount();
            this.addEventListener();
            this.wireEvents();
            this.isRendered = true;
            hideSpinner(this.parent.element);
            if (this.parent.selectedItems.length) { this.checkItem(); }
        }
    }
    private preventImgDrag(): void {
        let i: number = 0;
        while (i < this.itemList.length) {
            if (this.itemList[i].querySelector('img')) {
                /* istanbul ignore next */
                this.itemList[i].ondragstart = () => { return false; };
            }
            i++;
        }
    }

    private createDragObj(): void {
        if (!this.parent.isMobile && this.listObj) {
            if (this.parent.allowDragAndDrop) {
                if (this.dragObj) { this.dragObj.destroy(); }
                this.dragObj = new Draggable(this.listElements, {
                    enableTailMode: true,
                    distance: 5,
                    enableAutoScroll: true,
                    dragTarget: '.' + CLS.LARGE_ICON,
                    helper: this.dragHelper.bind(this),
                    cursorAt: this.parent.dragCursorPosition,
                    dragArea: this.parent.element,
                    dragStop: dragStopHandler.bind(this, this.parent),
                    drag: draggingHandler.bind(this, this.parent),
                    clone: true,
                    dragStart: (args: DragEventArgs) => {
                        dragStartHandler(this.parent, args, this.dragObj);
                    }
                });
            } else if (this.dragObj && !this.parent.allowDragAndDrop) {
                this.dragObj.destroy();
            }
        }
    }

    public dragHelper(args: { element: HTMLElement, sender: MouseEvent & TouchEvent }): HTMLElement {
        const dragTarget: Element = <Element>args.sender.target;
        const dragLi: Element = closest(dragTarget, '.e-list-item');
        if (!dragLi) { return null; }
        if (dragLi && !dragLi.classList.contains('e-active')) {
            this.setFocus(dragLi);
        }
        const activeEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
        this.parent.activeElements = [];
        this.parent.dragData = [];
        for (let i: number = 0; i < activeEle.length; i++) {
            // eslint-disable-next-line
            this.parent.dragData.push(<{ [key: string]: Object; }>this.getItemObject(activeEle[i]));
            this.parent.activeElements.push(activeEle[i]);
        }
        getModule(this.parent, dragLi);
        this.parent.dragPath = this.parent.path;
        createVirtualDragElement(this.parent);
        return this.parent.virtualDragElement;
    }

    private onDropInit(args: DragEventArgs): void {
        if (this.parent.targetModule === this.getModuleName()) {
            const dropLi: Element = closest(args.target, '.e-list-item');
            // eslint-disable-next-line
            const cwdData: Object = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
            if (dropLi) {
                // eslint-disable-next-line
                const info: { [key: string]: Object; } = <{ [key: string]: Object; }>this.getItemObject(dropLi);
                this.parent.dropPath = info.isFile ? this.parent.path : getFullPath(this.parent, info, this.parent.path);
                this.parent.dropData = info.isFile ? cwdData : info;
            } else {
                this.parent.dropPath = this.parent.path;
                this.parent.dropData = cwdData;
            }
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the module name.
     * @private
     */
    private getModuleName(): string {
        return 'largeiconsview';
    }

    private adjustHeight(): void {
        const pane: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.CONTENT_ID, this.parent.element);
        const bar: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID, this.parent.element);
        this.element.style.height = (pane.offsetHeight - bar.offsetHeight) + 'px';
    }

    private onItemCreated(args: ItemCreatedArgs): void {
        args.item.removeAttribute('aria-level');
        if (!this.parent.showFileExtension && getValue('isFile', args.curData)) {
            const textEle: Element = args.item.querySelector('.' + CLS.LIST_TEXT);
            const txt: string = getValue('name', args.curData);
            const type: string = getValue('type', args.curData);
            textEle.innerHTML = txt.substr(0, txt.length - type.length);
        }
        this.renderCheckbox(args);
        const eventArgs: FileLoadEventArgs = {
            element: args.item,
            fileDetails: args.curData,
            module: 'LargeIconsView'
        };
        this.parent.trigger('fileLoad', eventArgs);
    }

    private renderCheckbox(args: ItemCreatedArgs): void {
        if (!this.parent.allowMultiSelection) { return; }
        const checkElement: Element = createCheckBox(createElement, false, {
            checked: false,
            cssClass: 'e-small'
        });
        checkElement.setAttribute('role', 'checkbox');
        checkElement.setAttribute('aria-checked', 'false');
        args.item.firstElementChild.insertBefore(checkElement, args.item.firstElementChild.childNodes[0]);
    }

    private onLayoutChange(args: ReadArgs): void {
        if (this.parent.view === 'LargeIcons') {
            this.destroy();
            this.render(args);
            /* istanbul ignore next */
            if (getValue('name', args) === 'layout-change' && this.parent.fileAction === 'move' &&
                this.parent.isCut && this.parent.selectedNodes && this.parent.selectedNodes.length !== 0) {
                const indexes: number[] = this.getIndexes(this.parent.selectedNodes);
                let length: number = 0;
                while (length < indexes.length) {
                    addBlur(this.itemList[indexes[length]]);
                    length++;
                }
            }
            const activeEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
            if (activeEle.length !== 0) {
                this.element.focus();
            }
            this.checkItem();
            this.parent.isLayoutChange = false;
        } else {
            this.element.setAttribute('tabindex', '-1');
        }
    }

    private checkItem(): void {
        const checkEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
        if (checkEle) {
            let checkLength: number = 0;
            while (checkLength < checkEle.length) {
                this.checkState(checkEle[checkLength], true);
                checkLength++;
            }
        }
    }

    // eslint-disable-next-line
    private renderList(args?: ReadArgs): Object[] {
        let i: number = 0;
        // eslint-disable-next-line
        const items: Object[] = JSON.parse(JSON.stringify(args.files));
        while (i < items.length) {
            const icon: string = fileType(items[i]);
            const name: string = getValue('name', items[i]);
            const selected: string = getItemName(this.parent, items[i]);
            let className: string = ((this.parent.selectedItems &&
                this.parent.selectedItems.indexOf(selected) !== -1)) ?
                CLS.LARGE_ICON + ' e-active' : CLS.LARGE_ICON;
            if (!hasEditAccess(items[i])) {
                className += ' ' + getAccessClass(items[i]);
            }
            if (icon === CLS.ICON_IMAGE && this.parent.showThumbnail && hasReadAccess(items[i])) {
                const imgUrl: string = getImageUrl(this.parent, items[i]);
                setValue('_fm_imageUrl', imgUrl, items[i]);
                setValue('_fm_imageAttr', { alt: name }, items[i]);
            } else {
                setValue('_fm_icon', icon, items[i]);
            }
            setValue('_fm_htmlAttr', { class: className, title: name }, items[i]);
            i++;
        }
        return items;
    }

    private onFinalizeEnd(args: ReadArgs): void {
        this.render(args);
    }

    private onCreateEnd(args: ReadArgs): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.onLayoutChange(args);
        this.clearSelect();
        this.selectItems([getValue(this.parent.hasId ? 'id' : 'name', this.parent.createdItem)]);
        this.parent.createdItem = null;
        this.parent.largeiconsviewModule.element.focus();
    }

    private onSelectedData(): void {
        if (this.parent.activeModule === 'largeiconsview') {
            this.updateSelectedData();
        }
    }

    private onDeleteInit(): void {
        if (this.parent.activeModule === 'largeiconsview') {
            Delete(this.parent, this.parent.selectedItems, this.parent.path, 'delete');
        }
    }

    /* istanbul ignore next */
    private onDeleteEnd(args: ReadArgs): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.onLayoutChange(args);
        this.parent.setProperties({ selectedItems: [] }, true);
        this.clearSelect();
    }

    private onRefreshEnd(args: ReadArgs): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.onLayoutChange(args);
    }

    private onRenameInit(): void {
        if (this.parent.activeModule === 'largeiconsview' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }

    private onPathChanged(args: ReadArgs): void {
        this.parent.isCut = false;
        /* istanbul ignore next */
        if (this.parent.breadcrumbbarModule.searchObj.element.value === '') {
            this.parent.searchedItems = [];
        }
        if (this.parent.view === 'LargeIcons') {
            removeBlur(this.parent);
            this.parent.setProperties({ selectedItems: [] }, true);
            this.onLayoutChange(args);
            if (this.parent.renamedItem) {
                this.clearSelect();
                this.addSelection(this.parent.renamedItem);
                this.parent.renamedItem = null;
            }
        }
    }

    private onOpenInit(args: NotifyArgs): void {
        if (this.parent.activeModule === 'largeiconsview') {
            this.doOpenAction(args.target);
        }
    }

    private onHideLayout(): void {
        if (this.parent.view !== 'LargeIcons' && this.element) {
            this.element.classList.add(CLS.DISPLAY_NONE);
        }
    }

    private onSelectAllInit(): void {
        if (this.parent.view === 'LargeIcons') {
            this.startItem = this.getFirstItem();
            const lastItem: Element = this.getLastItem();
            const eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
            this.doSelection(lastItem, eveArgs);
            this.isInteraction = true;
            this.isInteracted = true;
        }
    }

    private onClearAllInit(): void {
        if (this.parent.view === 'LargeIcons') {
            this.clearSelection();
            this.isInteraction = true;
            this.isInteracted = true;
        }
    }

    private onBeforeRequest(): void {
        this.isRendered = false;
    }

    private onAfterRequest(): void {
        this.isRendered = true;
    }

    /* istanbul ignore next */
    private onSearch(args: ReadArgs): void {
        if (this.parent.view === 'LargeIcons') {
            this.parent.setProperties({ selectedItems: [] }, true);
            this.parent.notify(events.selectionChanged, {});
            this.parent.searchedItems = args.files;
            this.onLayoutChange(args);
        }
    }

    private onLayoutRefresh(): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.adjustHeight();
    }

    private onUpdateSelectionData(): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.updateSelectedData();
    }

    private onPathColumn(): void {
        if (this.parent.view === 'LargeIcons' && !isNOU(this.listObj) &&
            this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered
            && this.parent.sortBy === 'filterPath') {
            this.parent.sortBy = 'name';
            this.parent.notify(events.sortByChange, {});

        }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.pathColumn, this.onPathColumn);
        this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.selectedData, this.onSelectedData);
        this.parent.off(events.deleteInit, this.onDeleteInit);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
        this.parent.off(events.refreshEnd, this.onRefreshEnd);
        this.parent.off(events.pathChanged, this.onPathChanged);
        this.parent.off(events.layoutChange, this.onLayoutChange);
        this.parent.off(events.search, this.onSearch);
        this.parent.off(events.openInit, this.onOpenInit);
        this.parent.off(events.openEnd, this.onPathChanged);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.methodCall, this.onMethodCall);
        this.parent.off(events.actionFailure, this.onActionFailure);
        this.parent.off(events.renameInit, this.onRenameInit);
        this.parent.off(events.renameEnd, this.onPathChanged);
        this.parent.off(events.hideLayout, this.onHideLayout);
        this.parent.off(events.selectAllInit, this.onSelectAllInit);
        this.parent.off(events.clearAllInit, this.onClearAllInit);
        this.parent.off(events.menuItemData, this.onMenuItemData);
        this.parent.off(events.beforeRequest, this.onBeforeRequest);
        this.parent.off(events.afterRequest, this.onAfterRequest);
        this.parent.off(events.splitterResize, this.splitterResizeHandler);
        this.parent.off(events.resizeEnd, this.resizeHandler);
        this.parent.off(events.pasteInit, this.onpasteInit);
        this.parent.off(events.pasteEnd, this.onpasteEnd);
        this.parent.off(events.cutCopyInit, this.oncutCopyInit);
        this.parent.off(events.dropInit, this.onDropInit);
        this.parent.off(events.detailsInit, this.onDetailsInit);
        this.parent.off(events.layoutRefresh, this.onLayoutRefresh);
        this.parent.off(events.dropPath, this.onDropPath);
        this.parent.off(events.updateSelectionData, this.onUpdateSelectionData);
        this.parent.off(events.filterEnd, this.onPathChanged);
    }

    private addEventListener(): void {
        this.parent.on(events.pathColumn, this.onPathColumn, this);
        this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
        this.parent.on(events.selectedData, this.onSelectedData, this);
        this.parent.on(events.pathChanged, this.onPathChanged, this);
        this.parent.on(events.deleteInit, this.onDeleteInit, this);
        this.parent.on(events.pasteInit, this.onpasteInit, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.layoutChange, this.onLayoutChange, this);
        this.parent.on(events.search, this.onSearch, this);
        this.parent.on(events.openInit, this.onOpenInit, this);
        this.parent.on(events.renameInit, this.onRenameInit, this);
        this.parent.on(events.renameEnd, this.onPathChanged, this);
        this.parent.on(events.openEnd, this.onPathChanged, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.methodCall, this.onMethodCall, this);
        this.parent.on(events.actionFailure, this.onActionFailure, this);
        this.parent.on(events.hideLayout, this.onHideLayout, this);
        this.parent.on(events.selectAllInit, this.onSelectAllInit, this);
        this.parent.on(events.clearAllInit, this.onClearAllInit, this);
        this.parent.on(events.menuItemData, this.onMenuItemData, this);
        this.parent.on(events.beforeRequest, this.onBeforeRequest, this);
        this.parent.on(events.afterRequest, this.onAfterRequest, this);
        this.parent.on(events.dropInit, this.onDropInit, this);
        this.parent.on(events.detailsInit, this.onDetailsInit, this);
        this.parent.on(events.splitterResize, this.splitterResizeHandler, this);
        this.parent.on(events.resizeEnd, this.resizeHandler, this);
        this.parent.on(events.pasteEnd, this.onpasteEnd, this);
        this.parent.on(events.cutCopyInit, this.oncutCopyInit, this);
        this.parent.on(events.layoutRefresh, this.onLayoutRefresh, this);
        this.parent.on(events.dropPath, this.onDropPath, this);
        this.parent.on(events.updateSelectionData, this.onUpdateSelectionData, this);
        this.parent.on(events.filterEnd, this.onPathChanged, this);
    }

    private onActionFailure(): void { this.isInteraction = true; this.isInteracted = true; }

    // eslint-disable-next-line
    private onMenuItemData(args: { [key: string]: Object; }): void {
        if (this.parent.activeModule === this.getModuleName()) {
            const ele: Element = closest(<Element>args.target, 'li');
            this.parent.itemData = [this.getItemObject(ele)];
        }
    }

    private onDetailsInit(): void {
        if (this.parent.activeModule === this.getModuleName()) {
            if (this.parent.selectedItems.length !== 0) {
                this.updateSelectedData();
            } else {
                this.parent.itemData = [getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
            }
        }
    }

    private onpasteInit(): void {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.itemData = (this.parent.folderPath === '') ? [getPathObject(this.parent)] :
                [this.getItemObject(select('.e-active', this.element))];
        }
    }

    private oncutCopyInit(): void {
        if (this.parent.activeModule === this.getModuleName()) {
            const activeEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
            this.parent.activeRecords = [];
            this.parent.activeElements = [];
            for (let i: number = 0; i < activeEle.length; i++) {
                this.parent.activeElements.push(activeEle[i]);
                this.parent.activeRecords.push(this.getItemObject(activeEle[i]));
            }
        }
    }

    private onpasteEnd(args: ReadArgs): void {
        if (this.parent.view === 'LargeIcons') {
            this.isPasteOperation = true;
            if (this.parent.path === this.parent.destinationPath || this.parent.path === getDirectoryPath(this.parent, args)) {
                this.onPathChanged(args);
            }
        }
    }

    private onDropPath(args: ReadArgs): void {
        if (this.parent.view === 'LargeIcons') {
            this.isPasteOperation = true;
            this.onPathChanged(args);
        }
    }

    private onPropertyChanged(e: NotifyArgs): void {
        let currentSelected: string[];
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (const prop of Object.keys(e.newProp)) {
            switch (prop) {
            case 'allowDragAndDrop':
                this.createDragObj();
                break;
            case 'height':
                this.adjustHeight();
                break;
            case 'selectedItems':
                this.isInteraction = false;
                this.isInteracted = false;
                currentSelected = isNOU(this.parent.selectedItems) ? [] : this.parent.selectedItems.slice(0);
                currentSelected = this.parent.allowMultiSelection ? currentSelected :
                    currentSelected.slice(currentSelected.length - 1);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.onClearAllInit();
                if (currentSelected.length) {
                    this.selectItems(currentSelected);
                }
                this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                this.isInteraction = true;
                this.isInteracted = true;
                break;
            case 'showThumbnail':
                refresh(this.parent);
                break;
            case 'showFileExtension':
                read(this.parent, events.pathChanged, this.parent.path);
                break;
            case 'showHiddenItems':
                read(this.parent, events.pathChanged, this.parent.path);
                break;
            case 'allowMultiSelection':
                if (this.parent.view !== 'LargeIcons') { break; }
                refresh(this.parent);
                break;
            case 'view':
                updateLayout(this.parent, 'LargeIcons');
                break;
            }
        }
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (this.listObj) {
            this.unWireEvents();
        }
    }

    private wireEvents(): void {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keyup'
            }
        );
        this.keyboardDownModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keydownActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }
        );
        EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
    }

    private unWireEvents(): void {
        this.wireClickEvent(false);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        this.keyboardModule.destroy();
        this.keyboardDownModule.destroy();
    }

    /* istanbul ignore next */
    private onMouseOver(e: MouseArgs): void {
        const targetEle: Element = closest(e.target, '.e-list-item');
        removeBlur(this.parent, 'hover');
        if (targetEle !== null) {
            targetEle.classList.add(CLS.HOVER);
        }
    }

    private wireClickEvent(toBind: boolean): void {
        if (toBind) {
            // eslint-disable-next-line
            const proxy: LargeIconsView = this;
            this.clickObj = new Touch(this.element, {
                tap: (eve: TapEventArgs) => {
                    eve.originalEvent.preventDefault();
                    if (proxy.parent.isDevice) {
                        proxy.tapCount = eve.tapCount;
                        proxy.tapEvent = eve;
                        setTimeout(
                            () => {
                                if (proxy.tapCount > 0) {
                                    proxy.doTapAction(proxy.tapEvent);
                                }
                                proxy.tapCount = 0;
                            },
                            350);
                    } else {
                        if (eve.tapCount === 2 && eve.originalEvent.which !== 3) {
                            proxy.dblClickHandler(eve);
                        } else {
                            proxy.clickHandler(eve);
                        }
                    }
                },
                tapHold: (e: TapEventArgs) => {
                    if (proxy.parent.isDevice) {
                        proxy.multiSelect = proxy.parent.allowMultiSelection ? true : false;
                        if (proxy.parent.allowMultiSelection) {
                            addClass([proxy.parent.element], CLS.MULTI_SELECT);
                        }
                        proxy.clickHandler(e);
                    }
                }
            });
        } else {
            if (this.clickObj) {
                this.clickObj.destroy();
            }
        }
    }

    private doTapAction(eve: TapEventArgs): void {
        const target: Element = <Element>eve.originalEvent.target;
        const item: Element = closest(target, '.' + CLS.LIST_ITEM);
        if (this.multiSelect || target.classList.contains(CLS.LIST_PARENT) || isNOU(item)) {
            this.clickHandler(eve);
        } else {
            this.parent.isFile = false;
            this.updateType(item);
            if (!this.parent.isFile) {
                this.dblClickHandler(eve);
            } else if (eve.tapCount === 2) {
                this.clickHandler(eve);
                this.dblClickHandler(eve);
            } else {
                this.clickHandler(eve);
            }
        }
    }

    private clickHandler(e: TapEventArgs): void {
        const target: Element = <Element>e.originalEvent.target;
        removeBlur(this.parent, 'hover');
        this.doSelection(target, e.originalEvent);
        this.parent.activeModule = 'largeiconsview';
    }
    /**
     *
     * @param {Element} target - specifies the target element.
     * @param {TouchEventArgs | MouseEventArgs | KeyboardEventArgs} e - specifies event arguements.
     * @returns {void}
     * @hidden
     */
    public doSelection(target: Element, e: TouchEventArgs | MouseEventArgs | KeyboardEventArgs): void {
        const item: Element = closest(target, '.' + CLS.LIST_ITEM);
        const cList: DOMTokenList = target.classList;
        this.parent.isFile = false;
        let action: string = 'select';
        if (e.which === 3 && !isNOU(item) && item.classList.contains(CLS.ACTIVE)) {
            this.updateType(item);
            return;
        } else if (!isNOU(item)) {
            if (this.parent.allowMultiSelection && item.classList.contains(CLS.ACTIVE)
                && (e.ctrlKey || target.classList.contains(CLS.CHECK))) {
                action = 'unselect';
            }
            const fileSelectionArgs: FileSelectionEventArgs = this.triggerSelection(action, item);
            if (fileSelectionArgs.cancel !== true) {
                if ((!this.parent.allowMultiSelection || (!this.multiSelect && (e && !e.ctrlKey)))
                    && !cList.contains(CLS.FRAME)) {
                    this.updateType(item);
                    this.clearSelect();
                }
                if (this.parent.allowMultiSelection && e.shiftKey) {
                    if (!(e && e.ctrlKey)) { this.clearSelect(); }
                    if (!this.startItem) {
                        this.startItem = item;
                    }
                    const startIndex: number = this.itemList.indexOf(<HTMLElement>this.startItem);
                    const endIndex: number = this.itemList.indexOf(<HTMLElement>item);
                    if (startIndex > endIndex) {
                        for (let i: number = startIndex; i >= endIndex; i--) {
                            this.addActive(this.itemList[i]);
                        }
                    } else {
                        for (let i: number = startIndex; i <= endIndex; i++) {
                            this.addActive(this.itemList[i]);
                        }
                    }
                    this.addFocus(this.itemList[endIndex]);
                } else {
                    this.startItem = item;
                    if (this.parent.allowMultiSelection && item.classList.contains(CLS.ACTIVE)) {
                        this.removeActive(item);
                    } else {
                        this.addActive(item);
                    }
                    this.addFocus(item);
                }
                if (this.parent.selectedItems.length === 0) {
                    this.resetMultiSelect();
                }
                this.parent.notify(events.selectionChanged, {});
                this.triggerSelect(action, item);
            }
        } else {
            this.clearSelection();
        }
        if (!isNOU(item)) {
            this.updateType(item);
        }
    }

    private dblClickHandler(e: TapEventArgs): void {
        this.parent.activeModule = 'largeiconsview';
        const target: Element = <Element>e.originalEvent.target;
        this.doOpenAction(target);
    }

    private clearSelection(): void {
        this.clearSelect();
        this.resetMultiSelect();
        this.parent.notify(events.selectionChanged, {});
    }

    private resetMultiSelect(): void {
        this.multiSelect = false;
        removeClass([this.parent.element], CLS.MULTI_SELECT);
    }

    private doOpenAction(target: Element): void {
        if (isNOU(target)) { return; }
        const item: Element = closest(target, '.' + CLS.LIST_ITEM);
        this.parent.isFile = false;
        if (!isNOU(item)) {
            this.updateType(item);
            // eslint-disable-next-line
            const details: Object = this.getItemObject(item);
            if (!hasReadAccess(details)) {
                createDeniedDialog(this.parent, details, events.permissionRead);
                return;
            }
            const eventArgs: FileOpenEventArgs = { cancel: false, fileDetails: details, module: 'LargeIconsView' };
            this.parent.trigger('fileOpen', eventArgs, (fileOpenArgs: FileOpenEventArgs) => {
                if (!fileOpenArgs.cancel) {
                    const text: string = getValue('name', details);
                    if (!this.parent.isFile) {
                        const val: string = this.parent.breadcrumbbarModule.searchObj.element.value;
                        if (val === '' && !this.parent.isFiltered) {
                            const id: string = getValue('id', details);
                            const newPath: string = this.parent.path + (isNOU(id) ? text : id) + '/';
                            this.parent.setProperties({ path: newPath }, true);
                            this.parent.pathNames.push(text);
                            this.parent.pathId.push(getValue('_fm_id', details));
                            this.parent.itemData = [details];
                            openAction(this.parent);
                        } else {
                            openSearchFolder(this.parent, details);
                        }
                        this.parent.isFiltered = false;
                        this.parent.setProperties({ selectedItems: [] }, true);
                    } else {
                        const icon: string = fileType(details);
                        if (icon === CLS.ICON_IMAGE) {
                            const imgUrl: string = getImageUrl(this.parent, details);
                            createImageDialog(this.parent, text, imgUrl);
                        }
                    }
                }
            });
        }
    }

    private updateType(item: Element): void {
        const folder: Element = select('.' + CLS.FOLDER, item);
        this.parent.isFile = isNOU(folder) ? true : false;
    }

    /* istanbul ignore next */
    // eslint:disable-next-line
    private keydownActionHandler(e: KeyboardEventArgs): void {
        if (!this.isRendered) { return; }
        switch (e.action) {
        case 'end':
        case 'home':
        case 'moveDown':
        case 'moveLeft':
        case 'moveRight':
        case 'moveUp':
        case 'ctrlEnd':
        case 'shiftEnd':
        case 'csEnd':
        case 'ctrlHome':
        case 'shiftHome':
        case 'csHome':
        case 'ctrlDown':
        case 'shiftDown':
        case 'csDown':
        case 'ctrlLeft':
        case 'shiftLeft':
        case 'csLeft':
        case 'ctrlRight':
        case 'shiftRight':
        case 'csRight':
        case 'space':
        case 'ctrlSpace':
        case 'shiftSpace':
        case 'csSpace':
        case 'ctrlA':
        case 'enter':
        case 'altEnter':
        case 'esc':
        case 'del':
        case 'shiftdel':
        case 'ctrlC':
        case 'ctrlV':
        case 'ctrlX':
        case 'f2':
        case 'ctrlD':
            e.preventDefault();
            break;
        default:
            break;
        }
    }

    /* istanbul ignore next */
    // eslint:disable-next-line
    private keyActionHandler(e: KeyboardEventArgs): void {
        if (!this.isRendered) { return; }
        const fItem: Element = this.getFocusedItem();
        const firstItem: Element = this.getFirstItem();
        const lastItem: Element = this.getLastItem();
        switch (e.action) {
        case 'end':
            this.navigateItem(lastItem);
            break;
        case 'home':
            this.navigateItem(firstItem);
            break;
        case 'tab':
            if (!isNOU(fItem)) {
                this.addFocus(fItem);
            } else if (!isNOU(firstItem)) {
                this.addFocus(firstItem);
            }
            break;
        case 'moveDown':
            this.navigateDown(fItem, true);
            break;
        case 'moveLeft':
            this.navigateRight(fItem, false);
            break;
        case 'moveRight':
            this.navigateRight(fItem, true);
            break;
        case 'moveUp':
            this.navigateDown(fItem, false);
            break;
        case 'ctrlEnd':
        case 'shiftEnd':
        case 'csEnd':
            this.csEndKey(lastItem, e);
            break;
        case 'ctrlHome':
        case 'shiftHome':
        case 'csHome':
            this.csHomeKey(firstItem, e);
            break;
        case 'ctrlDown':
        case 'shiftDown':
        case 'csDown':
            this.csDownKey(fItem, e);
            break;
        case 'ctrlLeft':
        case 'shiftLeft':
        case 'csLeft':
            this.csLeftKey(fItem, e);
            break;
        case 'ctrlRight':
        case 'shiftRight':
        case 'csRight':
            this.csRightKey(fItem, e);
            break;
        case 'ctrlUp':
        case 'shiftUp':
        case 'csUp':
            this.csUpKey(fItem, e);
            break;
        case 'space':
            this.spaceKey(fItem);
            break;
        case 'ctrlSpace':
        case 'shiftSpace':
        case 'csSpace':
            if (!isNOU(fItem)) { this.doSelection(fItem, e); }
            break;
        case 'ctrlA':
            this.ctrlAKey(firstItem, lastItem);
            break;
        case 'enter':
            this.doOpenAction(this.parent.visitedItem ? this.parent.visitedItem : this.getVisitedItem());
            break;
        case 'altEnter':
            this.parent.notify(events.detailsInit, {});
            GetDetails(this.parent, this.parent.selectedItems, this.parent.path, 'details');
            break;
        case 'esc':
            removeActive(this.parent);
            break;
        case 'del':
        case 'shiftdel':
            this.performDelete();
            break;
        case 'ctrlC':
            copyFiles(this.parent);
            break;
        case 'ctrlV':
            this.parent.folderPath = '';
            pasteHandler(this.parent);
            break;
        case 'ctrlX':
            cutFiles(this.parent);
            break;
        case 'f2':
            this.performRename();
            break;
        case 'ctrlD':
            this.doDownload();
            break;
        }
    }

    private doDownload(): void {
        this.updateSelectedData();
        doDownload(this.parent);
    }

    private performDelete(): void {
        if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
            this.updateSelectedData();
            // eslint-disable-next-line
            const data: Object[] = this.parent.itemData;
            for (let i: number = 0; i < data.length; i++) {
                if (!hasEditAccess(data[i])) {
                    createDeniedDialog(this.parent, data[i], events.permissionEdit);
                    return;
                }
            }
            createDialog(this.parent, 'Delete');
        }
    }

    private performRename(): void {
        if (this.parent.selectedItems.length === 1) {
            this.updateRenameData();
            doRename(this.parent);
        }
    }

    private updateRenameData(): void {
        const item: Element = select('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
        // eslint-disable-next-line
        const data: Object = this.getItemObject(item);
        updateRenamingData(this.parent, data);
    }

    private getVisitedItem(): Element {
        const item: string = this.parent.selectedItems[this.parent.selectedItems.length - 1];
        const indexes: number[] = this.getIndexes([item], this.parent.hasId);
        return this.itemList[indexes[0]];
    }

    private getFocusedItem(): Element {
        return select('.' + CLS.LIST_ITEM + '.' + CLS.FOCUS, this.element);
    }

    private getActiveItem(): Element {
        return select('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
    }

    private getFirstItem(): Element {
        return this.itemList[0];
    }

    private getLastItem(): Element {
        return this.itemList[this.itemList.length - 1];
    }

    private navigateItem(item: Element): void {
        this.setFocus(item);
    }

    private navigateDown(fItem: Element, isTowards: boolean): void {
        const nItem: Element = this.getNextItem(fItem, isTowards, this.perRow);
        this.setFocus(nItem);
    }

    private navigateRight(fItem: Element, isTowards: boolean): void {
        const nItem: Element = this.getNextItem(fItem, isTowards);
        this.setFocus(nItem);
    }

    private getNextItem(li: Element, isTowards: boolean, perRow?: number): Element {
        if (isNOU(li)) { return this.getFocusedItem() || this.getActiveItem() || this.getFirstItem(); }
        let index: number = this.itemList.indexOf(<HTMLElement>li);
        let nextItem: Element;
        do {
            if (isTowards) {
                index = perRow ? index + perRow : index + 1;
            } else {
                index = perRow ? index - perRow : index - 1;
            }
            nextItem = this.itemList[index];
            if (isNOU(nextItem)) {
                return li;
            }
        }
        while (!isVisible(nextItem));
        return nextItem;
    }

    private setFocus(nextItem: Element): void {
        if (!isNOU(nextItem)) {
            const fileSelectionArgs: FileSelectionEventArgs = this.triggerSelection('select', nextItem);
            if (fileSelectionArgs.cancel !== true) {
                this.startItem = nextItem;
                this.clearSelect();
                this.addActive(nextItem);
                this.addFocus(nextItem);
                this.parent.notify(events.selectionChanged, {});
                this.triggerSelect('select', nextItem);
            }
        }
    }

    private spaceKey(fItem: Element): void {
        if (!isNOU(fItem) && !fItem.classList.contains(CLS.ACTIVE)) {
            const fileSelectionArgs: FileSelectionEventArgs = this.triggerSelection('select', fItem);
            if (fileSelectionArgs.cancel !== true) {
                this.addActive(fItem);
                this.parent.notify(events.selectionChanged, {});
                this.triggerSelect('select', fItem);
            }
        }
    }

    private ctrlAKey(firstItem: Element, lastItem: Element): void {
        if (this.parent.allowMultiSelection && !isNOU(firstItem)) {
            this.startItem = firstItem;
            const eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
            const liParent: HTMLElement = this.element.querySelector('.' + CLS.LIST_PARENT);
            const liScrPos: number = liParent.scrollTop;
            const getCurFocusedItem: Element = this.getFocusedItem();
            this.doSelection(lastItem, eveArgs);
            liParent.scrollTop = liScrPos;
            if (!isNOU(getCurFocusedItem)) {
                this.addFocus(getCurFocusedItem);
            }
        }
    }

    private csEndKey(lastItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(lastItem);
        } else if (!isNOU(lastItem)) {
            if (e.action === 'ctrlEnd') { this.addFocus(lastItem); } else { this.doSelection(lastItem, e); }
        }
    }

    private csHomeKey(firstItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(firstItem);
        } else if (!isNOU(firstItem)) {
            if (e.action === 'ctrlHome') {
                this.addFocus(firstItem);
            } else{
                this.doSelection(firstItem, e);
            }
        }
    }

    private csDownKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, true);
        } else {
            const dItem: Element = this.getNextItem(fItem, true, this.perRow);
            if (!isNOU(dItem)) {
                if (e.action === 'ctrlDown') {
                    this.addFocus(dItem);
                } else {
                    this.doSelection(dItem, e);
                }
            }
        }
    }

    private csLeftKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, false);
        } else {
            const lItem: Element = this.getNextItem(fItem, false);
            if (!isNOU(lItem)) {
                if (e.action === 'ctrlLeft') {
                    this.addFocus(lItem);
                } else {
                    this.doSelection(lItem, e);
                }
            }
        }
    }

    private csRightKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, true);
        } else {
            const rItem: Element = this.getNextItem(fItem, true);
            if (!isNOU(rItem)) {
                if (e.action === 'ctrlRight'){
                    this.addFocus(rItem);
                } else{
                    this.doSelection(rItem, e);
                }
            }
        }
    }

    private csUpKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, false);
        } else {
            const uItem: Element = this.getNextItem(fItem, false, this.perRow);
            if (!isNOU(uItem)) {
                if (e.action === 'ctrlUp') {
                    this.addFocus(uItem);
                } else{
                    this.doSelection(uItem, e);
                }
            }
        }
    }

    private addActive(nextItem: Element): void {
        if (!isNOU(nextItem)) {
            if (!nextItem.classList.contains(CLS.ACTIVE)) {
                this.parent.selectedItems.push(this.getDataName(nextItem));
                this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                addClass([nextItem], [CLS.ACTIVE]);
                nextItem.setAttribute('aria-selected', 'true');
                this.checkState(nextItem, true);
            }
            this.parent.visitedItem = nextItem;
        }
    }

    private removeActive(preItem: Element): void {
        if (!isNOU(preItem)) {
            removeClass([preItem], [CLS.ACTIVE]);
            if (this.parent.allowMultiSelection) {
                preItem.setAttribute('aria-selected', 'false');
            } else {
                preItem.removeAttribute('aria-selected');
            }
            this.checkState(preItem, false);
            const index: number = this.parent.selectedItems.indexOf(this.getDataName(preItem));
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
                this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
            }
            this.parent.visitedItem = null;
        }
    }

    private getDataName(item: Element): string {
        // eslint-disable-next-line
        const data: Object = this.getItemObject(item);
        return getItemName(this.parent, data);
    }

    private addFocus(item: Element): void {
        this.element.setAttribute('tabindex', '-1');
        const fItem: Element = this.getFocusedItem();
        if (fItem) {
            fItem.removeAttribute('tabindex');
            removeClass([fItem], [CLS.FOCUS]);
        }
        addClass([item], [CLS.FOCUS]);
        item.setAttribute('tabindex', '0');
        (item as HTMLElement).focus();
    }

    private checkState(item: Element, toCheck: boolean): void {
        if (!this.parent.allowMultiSelection) { return; }
        const checkEle: Element = select('.' + CLS.FRAME, item);
        if (isNOU(checkEle)) { return; }
        if (toCheck) {
            if (!checkEle.classList.contains(CLS.CHECK)) {
                addClass([checkEle], CLS.CHECK);
                closest(checkEle, '.' + CLS.CB_WRAP).setAttribute('aria-checked', 'true');
            }
        } else {
            if (checkEle.classList.contains(CLS.CHECK)) {
                removeClass([checkEle], CLS.CHECK);
                closest(checkEle, '.' + CLS.CB_WRAP).setAttribute('aria-checked', 'false');
            }
        }
    }

    private clearSelect(): void {
        const eles: Element[] = Array.prototype.slice.call(selectAll('.' + CLS.ACTIVE, this.listElements));
        let fileSelectionArgs: FileSelectionEventArgs;
        if (eles.length !== 0) {
            fileSelectionArgs = this.triggerSelection('unselect', eles[0]);
            if (fileSelectionArgs.cancel !== true) {
                for (let i: number = 0, len: number = eles.length; i < len; i++) {
                    this.removeActive(eles[i]);
                }
            }
            this.triggerSelect('unselect', eles[0]);
        }
    }

    private resizeHandler(): void {
        this.getItemCount();
        if (!isNOU(this.listObj)) {
            this.adjustHeight();
        }
    }

    private splitterResizeHandler(): void {
        this.getItemCount();
    }

    private getItemCount(): void {
        let perRow: number = 1;
        if (this.itemList) {
            for (let i: number = 0, len: number = this.itemList.length - 1; i < len; i++) {
                if (this.itemList[i].getBoundingClientRect().top === this.itemList[i + 1].getBoundingClientRect().top) {
                    perRow++;
                } else {
                    break;
                }
            }
        }
        this.perRow = perRow;
    }
    private triggerSelection(action: string, item: Element): FileSelectionEventArgs {
        // eslint-disable-next-line
        const data: Object = this.getItemObject(item);
        const eventArgs: FileSelectionEventArgs = {
            action: action, fileDetails: data, isInteracted: this.isInteraction, cancel: false, target: item
        };
        this.parent.trigger('fileSelection', eventArgs);
        this.isInteraction = true;
        return eventArgs;
    }

    private triggerSelect(action: string, item: Element): void {
        // eslint-disable-next-line
        const data: Object = this.getItemObject(item);
        this.parent.visitedData = data;
        const eventArgs: FileSelectEventArgs = { action: action, fileDetails: data, isInteracted: this.isInteracted };
        this.parent.trigger('fileSelect', eventArgs);
        this.isInteracted = true;
    }

    private selectItems(items: string[]): void {
        const indexes: number[] = this.getIndexes(items, this.parent.hasId);
        for (let j: number = 0, len: number = indexes.length; j < len; j++) {
            const eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: false } as KeyboardEventArgs;
            this.doSelection(this.itemList[indexes[j]], eveArgs);
        }
    }

    private getIndexes(items: string[], byId?: boolean): number[] {
        const indexes: number[] = [];
        const filter: string = byId ? 'id' : 'name';
        for (let i: number = 0, len: number = this.items.length; i < len; i++) {
            if (items.indexOf(getValue(filter, this.items[i])) !== -1) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    // eslint-disable-next-line
    private getItemObject(item: Element): Object {
        const index: number = this.itemList.indexOf(<HTMLElement>item);
        return this.items[index];
    }

    // eslint-disable-next-line
    private addSelection(data: Object): void {
        // eslint-disable-next-line
        let resultData: Object[] = [];
        if (this.parent.hasId) {
            resultData = new DataManager(this.items).
                executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
        } else {
            // eslint-disable-next-line
            const newData: Object[] = new DataManager(this.items).
                executeLocal(new Query().where('name', 'equal', getValue('name', data), false));
            if (newData.length > 0) {
                resultData = new DataManager(newData).
                    executeLocal(new Query().where('filterPath', 'equal', this.parent.filterPath, false));
            }
        }
        if (resultData.length > 0) {
            const index: number = this.items.indexOf(resultData[0]);
            const eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: false } as KeyboardEventArgs;
            this.doSelection(this.itemList[index], eveArgs);
        }
    }

    private updateSelectedData(): void {
        // eslint-disable-next-line
        const data: object[] = [];
        const items: Element[] = selectAll('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
        for (let i: number = 0; i < items.length; i++) {
            data[i] = this.getItemObject(items[i]);
        }
        this.parent.itemData = data;
    }

    // eslint-disable-next-line
    private onMethodCall(args: Object): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        const action: string = getValue('action', args);
        switch (action) {
        case 'deleteFiles':
            this.deleteFiles(getValue('ids', args));
            break;
        case 'downloadFiles':
            this.downloadFiles(getValue('ids', args));
            break;
        case 'openFile':
            this.openFile(getValue('id', args));
            break;
        case 'renameFile':
            this.isInteraction = false;
            this.isInteracted = false;
            this.renameFile(getValue('id', args), getValue('newName', args));
            break;
        case 'createFolder':
            this.isInteraction = false;
            this.isInteracted = false;
            break;
        case 'clearSelection':
            this.isInteraction = false;
            this.isInteracted = false;
            this.onClearAllInit();
            break;
        case 'selectAll':
            this.isInteraction = false;
            this.isInteracted = false;
            this.onSelectAllInit();
            break;
        }
    }

    private getItemsIndex(items: string[]): number[] {
        const indexes: number[] = [];
        const isFilter: boolean = (this.parent.breadcrumbbarModule.searchObj.element.value !== '' || this.parent.isFiltered) ? true : false;
        const filterName: string = this.parent.hasId ? 'id' : 'name';
        if (this.parent.hasId || !isFilter) {
            for (let i: number = 0, len: number = this.items.length; i < len; i++) {
                if (items.indexOf(getValue(filterName, this.items[i])) !== -1) {
                    indexes.push(i);
                }
            }
        } else {
            for (let i: number = 0, len: number = this.items.length; i < len; i++) {
                const name: string = getValue('filterPath', this.items[i]) + getValue('name', this.items[i]);
                if (items.indexOf(name) !== -1) {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }

    private deleteFiles(ids: string[]): void {
        this.parent.activeModule = 'largeiconsview';
        if (isNOU(ids)) {
            this.performDelete();
            return;
        }
        const indexes: number[] = this.getItemsIndex(ids);
        if (indexes.length === 0) { return; }
        // eslint-disable-next-line
        const data: Object[] = [];
        const newIds: string[] = [];
        for (let i: number = 0; i < indexes.length; i++) {
            data[i] = this.items[indexes[i]];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDeleteFiles(this.parent, data, newIds);
    }

    private downloadFiles(ids: string[]): void {
        if (isNOU(ids)) {
            this.doDownload();
            return;
        }
        const index: number[] = this.getItemsIndex(ids);
        if (index.length === 0) { return; }
        // eslint-disable-next-line
        const data: Object[] = [];
        const newIds: string[] = [];
        for (let i: number = 0; i < index.length; i++) {
            data[i] = this.items[index[i]];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDownloadFiles(this.parent, data, newIds);
    }

    private openFile(id: string): void {
        if (isNOU(id)) { return; }
        const indexes: number[] = this.getItemsIndex([id]);
        if (indexes.length > 0) {
            this.doOpenAction(this.itemList[indexes[0]]);
        }
    }

    private renameFile(id: string, name: string): void {
        this.parent.activeModule = 'largeiconsview';
        if (isNOU(id)) {
            this.performRename();
            return;
        }
        const indexes: number[] = this.getItemsIndex([id]);
        if (indexes.length > 0) {
            updateRenamingData(this.parent, this.items[indexes[0]]);
            if (isNOU(name)) {
                doRename(this.parent);
            } else {
                if (!hasEditAccess(this.parent.itemData[0])) {
                    createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionEdit);
                } else {
                    rename(this.parent, this.parent.path, name);
                }
            }
        }
    }
}
