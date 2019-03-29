import { ListBase, ListBaseOptions, ListView, ItemCreatedArgs } from '@syncfusion/ej2-lists';
import { createElement, select, selectAll, EventHandler, KeyboardEvents, closest } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, addClass, removeClass, Touch, TapEventArgs, isVisible } from '@syncfusion/ej2-base';
import { TouchEventArgs, MouseEventArgs, KeyboardEventArgs, getValue, setValue, remove } from '@syncfusion/ej2-base';
import { IFileManager, FileOpenEventArgs, FileSelectEventArgs, NotifyArgs, FileBeforeLoadEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { ReadArgs, MouseArgs } from '../../index';
import * as CLS from '../base/classes';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { read } from '../common/operations';
import { removeBlur, cutFiles, copyFiles, addBlur, openSearchFolder } from '../common/index';
import { openAction, fileType, refresh, getImageUrl, getSortedData } from '../common/utility';
import { createEmptyElement } from '../common/utility';
import { createDialog, createImageDialog } from '../pop-up/dialog';

/**
 * LargeIcons module
 */
export class LargeIconsView {

    /* Internal variables */
    private parent: IFileManager;
    public element: HTMLElement;
    public listObj: ListBaseOptions;
    private listView: ListView;
    private keyboardModule: KeyboardEvents;
    private keyboardDownModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private itemList: HTMLElement[];
    private items: Object[];
    private clickObj: Touch;
    private perRow: number;
    private startItem: Element;
    private multiSelect: boolean;
    public listElements: HTMLElement;
    public pasteOperation: boolean = false;
    public uploadOperation: boolean = false;
    private count: number = 0;
    private isRendered: boolean = true;
    private tapCount: number = 0;
    private tapEvent: TapEventArgs;
    private isSetModel: boolean = false;

    /**
     * Constructor for the LargeIcons module
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
            back: 'backspace'
        };
    }

    private render(args: ReadArgs): void {
        this.element.setAttribute('tabindex', '0');
        this.parent.visitedItem = null;
        this.startItem = null;
        if (this.parent.view === 'LargeIcons') {
            this.resetMultiSelect();
            if (this.listObj) {
                this.unWireEvents();
                this.removeEventListener();
            }
            this.parent.notify(events.hideLayout, {});
            let iconsView: Element = select('#' + this.parent.element.id + CLS.LARGEICON_ID, this.parent.element);
            let ul: HTMLUListElement = select('ul', iconsView) as HTMLUListElement;
            if (ul) {
                remove(ul);
            }
            this.listObj = {
                ariaAttributes: {
                    itemRole: '', listRole: '', itemText: '',
                    groupItemRole: 'group', wrapperRole: 'presentation'
                },
                showIcon: true,
                fields: { text: 'name', iconCss: 'icon', imageUrl: 'imageUrl' },
                sortOrder: this.parent.sortOrder,
                itemCreated: this.onItemCreated.bind(this),
            };
            this.items = [];
            this.items = this.renderList(args);
            this.items = getSortedData(this.parent, this.items);
            this.listElements = ListBase.createListFromJson(createElement, <{ [key: string]: Object; }[]>this.items, this.listObj);
            this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, this.listElements));
            this.element.appendChild(this.listElements);
            if (this.itemList.length === 0) {
                let emptyList: Element = this.element.querySelector('.' + CLS.LIST_PARENT);
                this.element.removeChild(emptyList);
                createEmptyElement(this.parent, getValue('name', args), this.element);
            } else if (this.itemList.length !== 0 && this.element.querySelector('.' + CLS.EMPTY)) {
                this.element.removeChild(this.element.querySelector('.' + CLS.EMPTY));
            }
            if (this.pasteOperation === true) {
                this.selectItems(args.files, this.parent.selectedNodes);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.pasteOperation = false;
            }
            if (this.uploadOperation === true) {
                this.selectItems(args.files, this.parent.uploadItem);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.count++;
                if (this.count === this.parent.uploadItem.length) {
                    this.uploadOperation = false;
                    this.parent.uploadItem = [];
                }
            }
            let activeEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
            if (activeEle.length !== 0) {
                this.parent.activeModule = 'largeiconsview';
            }
            iconsView.classList.remove(CLS.DISPLAY_NONE);
            this.adjustHeight();
            this.element.style.maxHeight = '100%';
            this.getItemCount();
            this.addEventListener();
            this.wireEvents();
            this.isRendered = true;
            if (this.parent.selectedItems.length) { this.checkItem(); }
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'largeiconsview';
    }

    private adjustHeight(): void {
        let pane: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.CONTENT_ID, this.parent.element);
        let bar: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID, this.parent.element);
        this.element.style.height = (pane.offsetHeight - bar.offsetHeight) + 'px';
    }

    private onItemCreated(args: ItemCreatedArgs): void {
        if (!this.parent.showFileExtension && getValue('isFile', args.curData)) {
            let textEle: Element = args.item.querySelector('.' + CLS.LIST_TEXT);
            let txt: string = getValue('name', args.curData);
            let type: string = getValue('type', args.curData);
            textEle.innerHTML = txt.substr(0, txt.length - type.length);
        }
        this.renderCheckbox(args);
        let eventArgs: FileBeforeLoadEventArgs = {
            element: args.item,
            fileDetails: args.curData,
            module: 'LargeIcon'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    }

    private renderCheckbox(args: ItemCreatedArgs): void {
        if (!this.parent.allowMultiSelection) { return; }
        let checkElement: Element;
        checkElement = createCheckBox(createElement, false, {
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
            if (this.parent.cutNodes && this.parent.cutNodes.length !== 0) {
                let indexes: number[] = this.getIndexes(args.files, this.parent.selectedNodes);
                let length: number = 0;
                while (length < indexes.length) {
                    addBlur(this.itemList[indexes[length]]);
                    length++;
                }
            }
            let activeEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
            this.parent.activeElements = (activeEle.length !== 0) ? activeEle : this.parent.activeElements;
            if (activeEle.length !== 0) {
                this.element.focus();
            }
            this.checkItem();
        } else {
            this.element.setAttribute('tabindex', '-1');
        }
    }

    private checkItem(): void {
        let checkEle: NodeListOf<Element> = this.element.querySelectorAll('.' + CLS.ACTIVE);
        if (checkEle) {
            let checkLength: number = 0;
            while (checkLength < checkEle.length) {
                this.checkState(checkEle[checkLength], true);
                checkLength++;
            }
        }
    }

    private renderList(args?: ReadArgs): Object[] {
        let i: number = 0;
        let items: Object[] = JSON.parse(JSON.stringify(args.files));
        while (i < items.length) {
            let icon: string = fileType(items[i]);
            /* istanbul ignore next */
            let pasteNodes: Object[] = this.parent.pasteNodes;
            let className: string = ((this.parent.selectedItems &&
                this.parent.selectedItems.indexOf(getValue('name', args.files[i])) !== -1) ||
                (pasteNodes && pasteNodes.length !== 0 && pasteNodes.indexOf(getValue('name', args.files[i])) !== -1)) ?
                CLS.LARGE_ICON + ' e-active' : CLS.LARGE_ICON;
            if (icon === CLS.ICON_IMAGE && this.parent.showThumbnail) {
                let imgUrl: string = getImageUrl(this.parent, items[i]);
                setValue('imageUrl', imgUrl, items[i]);
            } else {
                setValue('icon', icon, items[i]);
            }
            setValue('htmlAttributes', { class: className, title: getValue('name', args.files[i]) }, items[i]);
            i++;
        }
        return items;
    }

    private onFinalizeEnd(args: ReadArgs): void {
        this.render(args);
        this.parent.notify(events.searchTextChange, args);
    }

    private onCreateEnd(args: ReadArgs): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.onLayoutChange(args);
        this.clearSelect();
        this.selectItems(args.files, [getValue('name', this.parent.createdItem)]);
        this.parent.createdItem = null;
        this.parent.largeiconsviewModule.element.focus();
        this.parent.persistData = false;
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
        if (this.parent.view === 'LargeIcons' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }

    private onRenameEnd(args: ReadArgs): void {
        if (this.parent.view !== 'LargeIcons') { return; }
        this.onLayoutChange(args);
        this.clearSelect();
        this.parent.setProperties({ selectedItems: [] }, true);
        this.selectItems(args.files, [getValue('name', this.parent.renamedItem)]);
        this.parent.renamedItem = null;
    }

    private onPathChanged(args: ReadArgs): void {
        /* istanbul ignore next */
        if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value === '') {
            this.parent.searchedItems = [];
        }
        if (this.parent.view === 'LargeIcons') {
            removeBlur(this.parent as IFileManager);
            if (!this.parent.persistData) { this.parent.selectedItems = []; }
            this.parent.persistData = false;
            this.parent.pasteNodes = [];
            this.parent.cutNodes = [];
            this.onLayoutChange(args);
            this.parent.notify(events.searchTextChange, args);
        }
    }

    private onOpenInit(args: NotifyArgs): void {
        if (this.parent.activeModule === 'largeiconsview') {
            this.doOpenAction(args.target);
        }
    }

    private onHideLayout(args: ReadArgs): void {
        if (this.parent.view !== 'LargeIcons' && this.element) {
            this.element.classList.add(CLS.DISPLAY_NONE);
        }
    }

    private onSelectAllInit(): void {
        if (this.parent.view === 'LargeIcons') {
            this.startItem = this.getFirstItem();
            let lastItem: Element = this.getLastItem();
            let eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
            this.doSelection(lastItem, eveArgs);
        }
    }

    private onClearAllInit(): void {
        if (this.parent.view === 'LargeIcons') {
            this.clearSelection();
        }
    }

    private onBeforeRequest(): void {
        this.isRendered = false;
    }

    private onAfterRequest(args: Object): void {
        this.isRendered = true;
    }

    /* istanbul ignore next */
    private onSearch(args: ReadArgs): void {
        this.parent.searchedItems = args.files;
        this.onLayoutChange(args);
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
        this.parent.off(events.refreshEnd, this.onRefreshEnd);
        this.parent.off(events.pathChanged, this.onPathChanged);
        this.parent.off(events.layoutChange, this.onLayoutChange);
        this.parent.off(events.search, this.onSearch);
        this.parent.off(events.openInit, this.onOpenInit);
        this.parent.off(events.openEnd, this.onLayoutChange);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.renameInit, this.onRenameInit);
        this.parent.off(events.renameEnd, this.onRenameEnd);
        this.parent.off(events.hideLayout, this.onHideLayout);
        this.parent.off(events.selectAllInit, this.onSelectAllInit);
        this.parent.off(events.clearAllInit, this.onClearAllInit);
        this.parent.off(events.beforeRequest, this.onBeforeRequest);
        this.parent.off(events.afterRequest, this.onAfterRequest);
        this.parent.off(events.splitterResize, this.resizeHandler);
        this.parent.off(events.resizeEnd, this.resizeHandler);
    }

    private addEventListener(): void {
        this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
        this.parent.on(events.pathChanged, this.onPathChanged, this);
        this.parent.on(events.layoutChange, this.onLayoutChange, this);
        this.parent.on(events.search, this.onSearch, this);
        this.parent.on(events.openInit, this.onOpenInit, this);
        this.parent.on(events.renameInit, this.onRenameInit, this);
        this.parent.on(events.renameEnd, this.onRenameEnd, this);
        this.parent.on(events.openEnd, this.onLayoutChange, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.hideLayout, this.onHideLayout, this);
        this.parent.on(events.selectAllInit, this.onSelectAllInit, this);
        this.parent.on(events.clearAllInit, this.onClearAllInit, this);
        this.parent.on(events.beforeRequest, this.onBeforeRequest, this);
        this.parent.on(events.afterRequest, this.onAfterRequest, this);
        this.parent.on(events.splitterResize, this.resizeHandler, this);
        this.parent.on(events.resizeEnd, this.resizeHandler, this);
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'height':
                    this.adjustHeight();
                    break;
                case 'selectedItems':
                    this.isSetModel = true;
                    if (this.parent.selectedItems.length !== 0) {
                        let currentDataSource: Object[] = getValue(this.parent.path, this.parent.feFiles);
                        this.selectItems(currentDataSource, this.parent.selectedItems);
                    } else {
                        while (this.element.querySelectorAll('.' + CLS.ACTIVE).length > 0) {
                            this.removeActive(this.element.querySelectorAll('.' + CLS.ACTIVE)[0]);
                        }
                    }
                    this.isSetModel = false;
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
                    refresh(this.parent);
                    if (this.parent.selectedItems.length > 1 && !this.parent.allowMultiSelection) {
                        this.parent.selectedItems = [];
                    }
                    break;
                case 'view':
                    read(this.parent, events.layoutChange, this.parent.path);
                    break;
            }
        }
    }

    /**
     * Destroys the LargeIcons module.
     * @method destroy
     * @return {void}
     */
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
                eventName: 'keyup',
            }
        );
        this.keyboardDownModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keydownActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
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
        let targetEle: Element = closest(e.target, '.e-list-item');
        removeBlur(this.parent as IFileManager, 'hover');
        if (targetEle !== null) {
            targetEle.classList.add(CLS.HOVER);
        }
    }

    private wireClickEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: LargeIconsView = this;
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
        let target: Element = <Element>eve.originalEvent.target;
        let item: Element = closest(target, '.' + CLS.LIST_ITEM);
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
        let target: Element = <Element>e.originalEvent.target;
        removeBlur(this.parent, 'hover');
        this.doSelection(target, e.originalEvent);
        this.parent.activeModule = 'largeiconsview';
    }
    /** @hidden */
    public doSelection(target: Element, e: TouchEventArgs | MouseEventArgs | KeyboardEventArgs): void {
        let item: Element = closest(target, '.' + CLS.LIST_ITEM);
        let fItem: Element = this.getFocusedItem();
        let cList: DOMTokenList = target.classList;
        this.parent.isFile = false;
        let action: string = 'select';
        if (e.which === 3 && !isNOU(item) && item.classList.contains(CLS.ACTIVE)) {
            this.updateType(item);
            return;
        } else if (!isNOU(item)) {
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
                let startIndex: number = this.itemList.indexOf(<HTMLElement>this.startItem);
                let endIndex: number = this.itemList.indexOf(<HTMLElement>item);
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
                    action = 'unselect';
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
        } else {
            this.clearSelection();
        }
        this.parent.activeElements = this.element.querySelectorAll('.e-active');
    }

    private dblClickHandler(e: TapEventArgs): void {
        this.parent.activeModule = 'largeiconsview';
        let target: Element = <Element>e.originalEvent.target;
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
        let item: Element = closest(target, '.' + CLS.LIST_ITEM);
        this.parent.isFile = false;
        if (!isNOU(item)) {
            this.updateType(item);
            let details: Object = this.getItemObject(item);
            let eventArgs: FileOpenEventArgs = { cancel: false, fileDetails: details };
            this.parent.trigger('beforeFileOpen', eventArgs);
            if (eventArgs.cancel) { return; }
            let text: string = select('.' + CLS.LIST_TEXT, item).textContent;
            if (!this.parent.isFile) {
                let val: string = this.parent.breadcrumbbarModule.searchObj.element.value;
                if (val === '') {
                    let newPath: string = this.parent.path + text + '/';
                    this.parent.setProperties({ path: newPath }, true);
                    this.parent.pathId.push(getValue('nodeId', details));
                    this.parent.itemData = [details];
                    openAction(this.parent);
                } else {
                    openSearchFolder(this.parent, details);
                }
                this.parent.setProperties({ selectedItems: [] }, true);
            } else {
                let icon: string = fileType(details);
                if (icon === CLS.ICON_IMAGE) {
                    let imgUrl: string = getImageUrl(this.parent, details);
                    createImageDialog(this.parent, getValue('name', details), imgUrl);
                }
            }
        }
    }

    private updateType(item: Element): void {
        let folder: Element = select('.' + CLS.FOLDER, item);
        this.parent.isFile = isNOU(folder) ? true : false;
    }

    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
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
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    private keyActionHandler(e: KeyboardEventArgs): void {
        if (!this.isRendered) { return; }
        let fItem: Element = this.getFocusedItem();
        let firstItem: Element = this.getFirstItem();
        let lastItem: Element = this.getLastItem();
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
                this.parent.getDetails();
                break;
            case 'esc':
                this.escapeKey();
                break;
            case 'del':
            case 'shiftdel':
                if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
                    createDialog(this.parent, 'Delete');
                }
                break;
            case 'ctrlC':
                this.copy();
                break;
            case 'ctrlV':
                this.parent.pasteHandler();
                break;
            case 'ctrlX':
                this.cut();
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 1) {
                    this.updateRenameData();
                    createDialog(this.parent, 'Rename');
                }
                break;
        }
    }

    private updateRenameData(): void {
        let item: Element = select('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
        let data: Object = this.getItemObject(item);
        this.parent.itemData = [data];
        this.parent.currentItemText = getValue('name', data);
        this.parent.isFile = getValue('isFile', data);
    }

    private getVisitedItem(): Element {
        let currFiles: Object[] = getValue(this.parent.path, this.parent.feFiles);
        let item: string = this.parent.selectedItems[this.parent.selectedItems.length - 1];
        let indexes: number[] = this.getIndexes(currFiles, [item]);
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
        let nItem: Element = this.getNextItem(fItem, isTowards, this.perRow);
        this.setFocus(nItem);
    }

    private navigateRight(fItem: Element, isTowards: boolean): void {
        let nItem: Element = this.getNextItem(fItem, isTowards);
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
            this.startItem = nextItem;
            this.clearSelect();
            this.addActive(nextItem);
            this.addFocus(nextItem);
            this.parent.notify(events.selectionChanged, {});
            this.triggerSelect('select', nextItem);
        }
    }
    /* istanbul ignore next */
    private cut(): void {
        cutFiles(this.parent as IFileManager);
        this.parent.fileOperation(this.parent.nodeNames);
    }
    /* istanbul ignore next */
    private copy(): void {
        copyFiles(this.parent as IFileManager);
        this.parent.fileOperation(this.parent.nodeNames);
    }
    /* istanbul ignore next */
    private escapeKey(): void {
        removeBlur(this.parent as IFileManager);
        this.parent.selectedNodes = [];
        this.parent.navigationpaneModule.treeNodes = [];
    }

    private spaceKey(fItem: Element): void {
        if (!isNOU(fItem) && !fItem.classList.contains(CLS.ACTIVE)) {
            this.addActive(fItem);
            this.parent.notify(events.selectionChanged, {});
            this.triggerSelect('select', fItem);
        }
    }

    private ctrlAKey(firstItem: Element, lastItem: Element): void {
        if (this.parent.allowMultiSelection && !isNOU(firstItem)) {
            this.startItem = firstItem;
            let eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
            this.doSelection(lastItem, eveArgs);
        }
    }

    private csEndKey(lastItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(lastItem);
        } else if (!isNOU(lastItem)) {
            (e.action === 'ctrlEnd') ? this.addFocus(lastItem) : this.doSelection(lastItem, e);
        }
    }

    private csHomeKey(firstItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(firstItem);
        } else if (!isNOU(firstItem)) {
            (e.action === 'ctrlHome') ? this.addFocus(firstItem) : this.doSelection(firstItem, e);
        }
    }

    private csDownKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, true);
        } else {
            let dItem: Element = this.getNextItem(fItem, true, this.perRow);
            if (!isNOU(dItem)) {
                (e.action === 'ctrlDown') ? this.addFocus(dItem) : this.doSelection(dItem, e);
            }
        }
    }

    private csLeftKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, false);
        } else {
            let lItem: Element = this.getNextItem(fItem, false);
            if (!isNOU(lItem)) {
                (e.action === 'ctrlLeft') ? this.addFocus(lItem) : this.doSelection(lItem, e);
            }
        }
    }

    private csRightKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, true);
        } else {
            let rItem: Element = this.getNextItem(fItem, true);
            if (!isNOU(rItem)) {
                (e.action === 'ctrlRight') ? this.addFocus(rItem) : this.doSelection(rItem, e);
            }
        }
    }

    private csUpKey(fItem: Element, e: KeyboardEventArgs): void {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, false);
        } else {
            let uItem: Element = this.getNextItem(fItem, false, this.perRow);
            if (!isNOU(uItem)) {
                (e.action === 'ctrlUp') ? this.addFocus(uItem) : this.doSelection(uItem, e);
            }
        }
    }

    private addActive(nextItem: Element): void {
        if (!isNOU(nextItem)) {
            if (!nextItem.classList.contains(CLS.ACTIVE)) {
                if (!this.isSetModel) {
                    this.parent.selectedItems.push(nextItem.textContent);
                }
                addClass([nextItem], [CLS.ACTIVE]);
                this.checkState(nextItem, true);
            }
            this.parent.visitedItem = nextItem;
        }
    }

    private removeActive(preItem: Element): void {
        if (!isNOU(preItem)) {
            removeClass([preItem], [CLS.ACTIVE]);
            this.checkState(preItem, false);
            let index: number = this.parent.selectedItems.indexOf(preItem.textContent);
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
            }
            this.parent.visitedItem = null;
        }
    }

    private addFocus(item: Element): void {
        let fItem: Element = this.getFocusedItem();
        if (fItem) {
            removeClass([fItem], [CLS.FOCUS]);
        }
        addClass([item], [CLS.FOCUS]);
    }

    private checkState(item: Element, toCheck: boolean): void {
        if (!this.parent.allowMultiSelection) { return; }
        let checkEle: Element = select('.' + CLS.FRAME, item);
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
        let eles: Element[] = Array.prototype.slice.call(selectAll('.' + CLS.ACTIVE, this.listElements));
        for (let i: number = 0, len: number = eles.length; i < len; i++) {
            this.removeActive(eles[i]);
        }
    }

    private resizeHandler(): void {
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

    private triggerSelect(action: string, item: Element): void {
        let data: Object = this.getItemObject(item);
        this.parent.visitedData = data;
        let eventArgs: FileSelectEventArgs = { action: action, fileDetails: data };
        this.parent.trigger('fileSelect', eventArgs);
    }

    private selectItems(files: Object[], items: string[]): void {
        let indexes: number[] = this.getIndexes(files, items);
        for (let j: number = 0, len: number = indexes.length; j < len; j++) {
            let eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: false } as KeyboardEventArgs;
            this.doSelection(this.itemList[indexes[j]], eveArgs);
        }
    }

    private getIndexes(files: Object[], items: string[]): number[] {
        let indexes: number[] = [];
        for (let i: number = 0, len: number = this.items.length; i < len; i++) {
            if (items.indexOf(getValue('name', this.items[i])) !== -1) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    private getItemObject(item: Element): Object {
        let index: number = this.itemList.indexOf(<HTMLElement>item);
        return this.items[index];
    }
}