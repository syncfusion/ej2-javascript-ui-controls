import { isNullOrUndefined as NOU, BlazorDotnetObject, formatUnit, select } from '@syncfusion/ej2-base';
import { createElement, closest, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Draggable, DragEventArgs, BlazorDragEventArgs, detach, EventHandler } from '@syncfusion/ej2-base';

const TOOLBAR_ID: string = '_toolbar';
const ROW: string = 'e-row';
const BLUR: string = 'e-blur';
const HOVER: string = 'e-hover';
const ACTIVE: string = 'e-active';
const CLONE: string = 'e-fe-clone';
const FULLROW: string = 'e-fullrow';
const FOLDER: string = 'e-fe-folder';
const LARGE_ICON: string = 'e-large-icon';
const DROP_FILE: string = 'e-fe-drop-file';
const LARGE_ICONS: string = 'e-large-icons';
const DROP_FOLDER: string = 'e-fe-drop-folder';


class SfFileManager {
    public element: BlazorElement;
    public dotnetRef: BlazorDotnetObject;
    public virtualDragElement: HTMLElement;
    public properties: InitProps;
    public dragObj: Draggable;
    public treeDragObj: Draggable;
    public treeviewEle: HTMLElement;
    public targetModule: string;
    public activeModule: string;
    public dragLi: Element;
    public cloneIcon: HTMLElement;
    public cloneName: HTMLElement;
    public dragName: string;
    public dragType: string;
    public dragCount: number;
    public dragLeft: number;
    public dragTop: number;
    public viewElem: Element;
    public ctrlId: string;
    public keyboardModule: KeyboardEvents;
    public keyboardDownModule: KeyboardEvents;
    private dragStartArgs: DragEventArgs & BlazorDragEventArgs;
    constructor(element: BlazorElement, ref: BlazorDotnetObject, properties: InitProps) {
        this.element = element;
        this.properties = properties;
        this.treeviewEle = element.querySelector('.e-navigation .e-treeview');
        this.dotnetRef = ref;
        if (!NOU(this.element)) {
            this.ctrlId = this.element.id;
            this.element.blazor__instance = this;
        }
        this.bindKeyboardEvent();
        this.wireEvents();
    }

    public wireEvents(): void {
        let gridElem: HTMLElement = this.element.querySelector('#' + this.properties.id + '_grid');
        if (gridElem) {
            EventHandler.add(gridElem, 'dblclick', this.gridBlur, this);
        }
    }

    public unWireEvents(): void {
        let gridElem: HTMLElement = this.element.querySelector('#' + this.properties.id + '_grid');
        if (gridElem) {
            EventHandler.remove(gridElem, 'dblclick', this.gridBlur);
        }
    }

    public adjustHeight(): string {
        let toolbar: HTMLElement = <HTMLElement>select('#' + this.element.id + TOOLBAR_ID, this.element);
        let toolBarHeight: number = toolbar ? toolbar.offsetHeight : 0;
        let breadcrumbBarHeight: number = (<HTMLElement>this.element.querySelector('.e-address')).offsetHeight;
        let gridHeight: number = this.element.clientHeight - toolBarHeight - breadcrumbBarHeight;
        return formatUnit(this.element.clientHeight - toolBarHeight) + ' ' + formatUnit(gridHeight);
    }

    public createDragObj(): void {
        let dragEle: HTMLElement;
        let dragTarget: string;
        if (this.properties.view === 'LargeIcons') {
            dragEle = this.element.querySelector('.e-large-icons ul');
            dragTarget = '.' + LARGE_ICON;
        } else {
            dragEle = this.element.querySelector('.e-grid.e-control');
            dragTarget = '.' + ROW;
        }
        if (this.properties.draggable) {
            if (this.dragObj) { this.dragObj.destroy(); }
            this.dragObj = new Draggable(dragEle, {
                cursorAt: { left: 44, top: 18 },
                enableTailMode: true,
                dragArea: this.element,
                dragTarget: '.' + FULLROW,
                drag: this.draggingHandler.bind(this),
                dragStart: (args: DragEventArgs & BlazorDragEventArgs) => {
                    this.dragStartHandler(args);
                },
                dragStop: this.dragStopHandler.bind(this),
                enableAutoScroll: true,
                helper: this.dragHelper.bind(this)
            });
        } else if (!this.properties.draggable) {
            this.dragObj.destroy();
        }
        if (this.treeviewEle) {
            if (this.treeDragObj) { this.treeDragObj.destroy(); }
            this.treeDragObj = new Draggable(this.treeviewEle, {
                cursorAt: { left: 44, top: 18 },
                enableTailMode: true,
                dragArea: this.element,
                dragTarget: dragTarget,
                drag: this.draggingHandler.bind(this),
                dragStart: (args: DragEventArgs & BlazorDragEventArgs) => {
                    this.dragStartHandler(args);
                },
                dragStop: this.dragStopHandler.bind(this),
                enableAutoScroll: true,
                helper: this.dragHelper.bind(this)
            });
        } else if (!this.properties.draggable) {
            this.treeDragObj.destroy();
        }
    }

    private dragHelper(args: { element: HTMLElement, sender: MouseEvent & TouchEvent }): HTMLElement {
        let dragTarget: Element = <Element>args.sender.target;
        this.getModule(dragTarget);
        if (this.activeModule === 'largeiconsview' || this.activeModule === 'navigationpane') {
            this.dragLi = closest(dragTarget, '.e-list-item');
        } else if (this.activeModule === 'detailsview') {
            this.dragLi = closest(dragTarget, 'tr.e-row');
            (this.dragLi.querySelector('.e-fe-checkbox .e-checkbox-wrapper') as HTMLElement).click();
        }
        if (!this.dragLi) { return null; }
        this.createVirtualDragElement();
        return this.virtualDragElement;
    }

    private createVirtualDragElement(): void {
        this.updateViewElement();
        this.updateDragValues();
        this.cloneIcon = createElement('div', {
            className: 'e-fe-icon ' + this.dragType
        });
        this.cloneName = createElement('div', {
            className: 'e-fe-name',
            innerHTML: this.dragName
        });
        let virtualEle: HTMLElement = createElement('div', {
            className: 'e-fe-content'
        });
        virtualEle.appendChild(this.cloneIcon);
        virtualEle.appendChild(this.cloneName);
        let ele: HTMLElement = createElement('div', {
            className: CLONE
        });
        ele.appendChild(virtualEle);
        if (this.dragCount > 1) {
            let badge: HTMLElement = createElement('span', {
                className: 'e-fe-count',
                innerHTML: (this.dragCount).toString(10)
            });
            ele.appendChild(badge);
        }
        this.virtualDragElement = ele;
        this.element.appendChild(this.virtualDragElement);
    }

    private getModule(element: Element): void {
        if (element) {
            if (closest(element, '.' + ROW)) {
                this.activeModule = 'detailsview';
            } else if (closest(element, '.' + LARGE_ICON)) {
                this.activeModule = 'largeiconsview';
            } else {
                this.activeModule = 'navigationpane';
            }
        }
    }

    private getXYValue(e: MouseEvent | TouchEvent, direction: string): number {
        let touchList: TouchList = (e as TouchEvent).changedTouches;
        let value: number;
        if (direction === 'X') {
            value = touchList ? touchList[0].clientX : (e as MouseEvent).clientX;
        } else {
            value = touchList ? touchList[0].clientY : (e as MouseEvent).clientY;
        }
        if (!value && e.type === 'focus' && e.target) {
            let rect: ClientRect = (e.target as HTMLElement).getBoundingClientRect();
            value = rect ? (direction === 'X' ? rect.left : rect.top) : null;
        }
        return Math.ceil(value);
    }

    private removeDestroyElement(): void {
        this.dragObj.intDestroy(this.dragStartArgs.event);
        this.dragCancel();
    }

    public TriggerDragEvent(cancel: boolean): void {
        if (cancel) {
            this.removeDestroyElement();
        }
    }

    public TriggerDragStartEvent(cancel: boolean): void {
        if (cancel) {
            this.removeDestroyElement();
        } else {
            this.dragStartArgs.bindEvents(this.dragStartArgs.dragElement);
            let dragArgs: FileDragEventArgs = this.dragStartArgs;
            dragArgs.cancel = false;
            this.getModule(this.dragStartArgs.target);
            let rootId: string = this.element.querySelector('.e-navigation .e-treeview ul li').getAttribute('data-uid');
            if (!this.properties.draggable || ((this.activeModule === 'navigationpane') &&
                (closest(this.dragStartArgs.target, 'li').getAttribute('data-uid') === rootId))) {
                dragArgs.cancel = true;
            }
            this.removeBlur();
            if (dragArgs.cancel) {
                this.removeDestroyElement();
            } else if (!dragArgs.cancel) {
                this.updateViewElement();
                this.blurActive();
                this.updateDragValues();
            }
        }
    }

    private dragStartHandler(args: DragEventArgs & BlazorDragEventArgs): void {
        this.dragStartArgs = args;
        this.UpdateXY(args);
        this.dotnetRef.invokeMethodAsync('DragStartCall', this.dragLeft, this.dragTop);
    }

    private blurActive(): void {
        let i: number = 0;
        let activeElements: NodeListOf<Element> = this.viewElem.querySelectorAll('.' + ACTIVE);
        while (i < activeElements.length) {
            activeElements[i].classList.add(BLUR);
            i++;
        }
    }

    private updateViewElement(): void {
        if (this.properties.view === 'LargeIcons') {
            this.viewElem = this.element.querySelector('.' + LARGE_ICONS);
        } else {
            this.viewElem = this.element.querySelector('.e-gridcontent');
        }
    }

    private getIconClass(element: HTMLElement): string {
        let iconValue: string = '';
        iconValue = element.querySelector('.e-list-img') ? 'e-fe-image' : element.querySelector('.e-list-icon').classList[1];
        return iconValue;
    }

    private updateDragValues(): void {
        let activeElements: NodeListOf<Element>;
        if (this.activeModule === 'largeiconsview') {
            activeElements = this.viewElem.querySelectorAll('.' + ACTIVE);
            this.dragName = activeElements.length > 0 ? activeElements[0].querySelector('.e-list-text').textContent : '';
            this.dragType = activeElements.length > 0 ? this.getIconClass(activeElements[0] as HTMLElement) : '';
        } else if (this.activeModule === 'detailsview') {
            activeElements = this.viewElem.querySelectorAll('tr[aria-selected="true"]');
            if (activeElements != null && activeElements.length > 0) {
                this.dragName = activeElements.length > 0 ? activeElements[0].querySelector('.e-fe-text').textContent : '';
                this.dragType = activeElements.length > 0 ? activeElements[0].querySelector('.e-fe-icon').classList[1] : '';
            }
        } else if (this.activeModule === 'navigationpane') {
            this.dragName = this.dragLi.querySelector('.e-list-text').textContent;
            this.dragType = 'e-fe-folder';
        }
        if (activeElements != null) {
            this.dragCount = activeElements.length;
        }
    }

    private getTargetModule(element: Element): void {
        if (element) {
            if (closest(element, '.e-gridcontent')) {
                this.targetModule = 'detailsview';
            } else if (closest(element, '.' + LARGE_ICONS)) {
                this.targetModule = 'largeiconsview';
            } else if (element.classList.contains('e-fullrow') ||
                element.classList.contains('e-icon-expandable')) {
                this.targetModule = 'navigationpane';
            } else if (closest(element, '.e-address-list-item')) {
                this.targetModule = 'breadcrumbbar';
            } else {
                this.targetModule = '';
            }
        }
    }

    private draggingHandler(args: DragEventArgs): void {
        let dragArgs: FileDragEventArgs = args;
        let canDrop: boolean = false;
        this.updateDragValues();
        this.cloneIcon.setAttribute('class', 'e-fe-icon ' + this.dragType);
        this.cloneName.innerHTML = this.dragName;
        let node: Element = null;
        this.blurActive();
        this.getTargetModule(args.target);
        this.removeDropTarget();
        this.removeBlur('hover');
        if (this.targetModule === 'navigationpane') {
            node = closest(args.target, 'li');
            node.classList.add(HOVER, DROP_FOLDER);
            canDrop = true;
        } else if (this.targetModule === 'detailsview') {
            node = closest(args.target, 'tr');
            if (node && node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
                node.classList.add(DROP_FOLDER);
            } else if (node && !node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
                node.classList.add(DROP_FILE);
            }
            canDrop = true;
        } else if (this.targetModule === 'largeiconsview') {
            node = closest(args.target, 'li');
            if (node && node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
                node.classList.add(HOVER, DROP_FOLDER);
            }
            canDrop = true;
        } else if (this.targetModule === 'breadcrumbbar') {
            canDrop = true;
        }
        this.element.classList.remove('e-fe-drop', 'e-no-drop');
        this.element.classList.add(canDrop ? 'e-fe-drop' : 'e-no-drop');
        this.UpdateXY(args);
        this.dotnetRef.invokeMethodAsync('DraggingCall', this.dragLeft, this.dragTop);
    }

    private UpdateXY(args: DragEventArgs): void {
        this.dragLeft = this.getXYValue(args.event, 'X');
        this.dragTop = this.getXYValue(args.event, 'Y');
    }

    private dragStopHandler(args: DragEventArgs): void {
        let dragArgs: FileDragEventArgs = args;
        let isLayout: boolean = false;
        dragArgs.cancel = false;
        this.removeDropTarget();
        this.element.classList.remove('e-fe-drop', 'e-no-drop');
        this.dragCancel();
        this.getTargetModule(args.target);
        if (this.targetModule === '' && (args.target as HTMLElement).classList.contains('e-view-container')) {
            isLayout = true;
        }
        this.removeBlur('hover');
        let targetElement: HTMLElement; let dataValue: string;
        if (this.targetModule === 'largeiconsview' || this.targetModule === 'navigationpane' || this.targetModule === 'breadcrumbbar') {
            targetElement = closest(args.target, 'li') as HTMLElement;
            let attr: string = this.targetModule === 'breadcrumbbar' ? 'data-utext' : 'data-uid';
            dataValue = targetElement ? targetElement.getAttribute(attr) : null;
            if (dataValue == null) { isLayout = true; }
        } else if (this.targetModule === 'detailsview') {
            targetElement = closest(args.target, 'tr') as HTMLElement;
            dataValue = targetElement ? targetElement.getAttribute('aria-rowindex') : null;
        }
        let treeid: string = this.treeviewEle ? this.dragLi.getAttribute('data-uid') : null;
        this.UpdateXY(args);
        // tslint:disable-next-line
        this.dotnetRef.invokeMethodAsync('DragStopCall', treeid, dataValue, this.targetModule, this.activeModule, isLayout, this.dragLeft, this.dragTop);
        this.dragCount = 0;
        this.dragName = '';
        this.dragType = '';
    }

    private dragCancel(): void {
        this.removeBlur();
        let virtualEle: Element = select('.' + CLONE, this.element);
        if (virtualEle) { detach(virtualEle); }
    }

    private gridBlur(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (target.tagName === 'TD') {
            target.blur();
        }
    }

    private removeItemClass(value: string): void {
        let ele: NodeListOf<Element> = this.element.querySelectorAll('.' + value);
        for (let i: number = 0; i < ele.length; i++) {
            ele[i].classList.remove(value);
        }
    }

    private removeDropTarget(): void {
        this.removeItemClass(DROP_FOLDER);
        this.removeItemClass(DROP_FILE);
    }

    private removeBlur(hover?: string): void {
        let blurEle: NodeListOf<Element> = (!hover) ? this.element.querySelectorAll('.' + BLUR) :
            this.element.querySelectorAll('.' + HOVER);
        let i: number = 0;
        while (i < blurEle.length) {
            (!hover) ? blurEle[i].classList.remove(BLUR) : blurEle[i].classList.remove(HOVER);
            i++;
        }
    }

    public bindKeyboardEvent(): void {
        if (this.properties.view === 'Details') {
            let keyConfigs: { [key: string]: string } = {
                altEnter: 'alt+enter',
                esc: 'escape',
                tab: 'tab',
                moveDown: 'downarrow',
                ctrlEnd: 'ctrl+end',
                ctrlHome: 'ctrl+home',
                ctrlDown: 'ctrl+downarrow',
                ctrlLeft: 'ctrl+leftarrow',
                ctrlRight: 'ctrl+rightarrow',
                shiftEnd: 'shift+end',
                shiftHome: 'shift+home',
                shiftDown: 'shift+downarrow',
                shiftUp: 'shift+uparrow',
                ctrlUp: 'ctrl+uparrow',
                csEnd: 'ctrl+shift+end',
                csHome: 'ctrl+shift+home',
                csDown: 'ctrl+shift+downarrow',
                csUp: 'ctrl+shift+uparrow',
                space: 'space',
                ctrlSpace: 'ctrl+space',
                shiftSpace: 'shift+space',
                csSpace: 'ctrl+shift+space',
                end: 'end',
                home: 'home',
                moveUp: 'uparrow',
                del: 'delete',
                ctrlX: 'ctrl+x',
                ctrlC: 'ctrl+c',
                ctrlV: 'ctrl+v',
                ctrlShiftN: 'ctrl+shift+n',
                shiftdel: 'shift+delete',
                ctrlD: 'ctrl+d',
                f2: 'f2',
                ctrlA: 'ctrl+a',
                enter: 'enter'
            };
            let gridElem: HTMLElement = this.element.querySelector('#' + this.properties.id + '_grid');
            if (gridElem) {
                this.bindKeyboardEvents(keyConfigs, gridElem);
            }
        } else if (this.properties.view === 'LargeIcons') {
            let keyConfigs: { [key: string]: string } = {
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
            let largeIcons: HTMLElement = this.element.querySelector('#' + this.properties.id + '_largeicons');
            if (largeIcons) {
                this.bindKeyboardEvents(keyConfigs, this.element);
            }
        }
    }

    private bindKeyboardEvents(keyConfigs: { [key: string]: string }, element: HTMLElement): void {
        this.keyboardModule = new KeyboardEvents(
            element,
            {
                keyAction: this.keyupHandler.bind(this),
                keyConfigs: keyConfigs,
                eventName: 'keyup',
            }
        );
        this.keyboardDownModule = new KeyboardEvents(
            element,
            {
                keyAction: this.keydownHandler.bind(this),
                keyConfigs: keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private getRowValue(): number {
        let largeIconEle: HTMLElement = this.element.querySelector('#' + this.element.id + '_largeicons');
        let itemList: NodeList = largeIconEle.querySelectorAll('.e-list-item');
        let perRow: number = 1;
        if (itemList) {
            for (let i: number = 0, len: number = itemList.length - 1; i < len; i++) {
                if ((<HTMLElement>itemList[i]).getBoundingClientRect().top === (<HTMLElement>itemList[i + 1]).getBoundingClientRect().top) {
                    perRow++;
                } else {
                    break;
                }
            }
        }
        return perRow;
    }

    // tslint:disable-next-line:max-func-body-length
    private keyupHandler(e: KeyboardEventArgs): void {
        e.preventDefault();
        let perRow: number = 0;
        if (this.properties.view === 'LargeIcons') {
            perRow = this.getRowValue();
        }
        let action: string = e.action;
        let actionValue: string = null;
        switch (action) {
            case 'altEnter':
                actionValue = 'Details';
                break;
            case 'del':
            case 'shiftdel':
                actionValue = 'Delete';
                break;
            case 'enter':
                actionValue = 'Open';
                break;
            case 'ctrlC':
                actionValue = 'Copy';
                break;
            case 'ctrlV':
                actionValue = 'Paste';
                break;
            case 'ctrlX':
                actionValue = 'Cut';
                break;
            case 'ctrlD':
                actionValue = 'Download';
                break;
            case 'f2':
                actionValue = 'Rename';
                break;
            case 'ctrlA':
                actionValue = 'SelectAll';
                break;
            case 'home':
                actionValue = 'Home';
                break;
            case 'end':
                actionValue = 'End';
                break;
            case 'moveDown':
                actionValue = 'MoveDown_' + perRow.toString();
                break;
            case 'moveLeft':
                actionValue = 'MoveLeft';
                break;
            case 'moveRight':
                actionValue = 'MoveRight';
                break;
            case 'moveUp':
                actionValue = 'MoveUp_' + perRow.toString();
                break;
            case 'esc':
                actionValue = 'Esc';
                break;
            case 'ctrlLeft':
                actionValue = 'ControlLeft';
                break;
            case 'ctrlRight':
                actionValue = 'ControlRight';
                break;
            case 'ctrlEnd':
                actionValue = 'ControlEnd';
                break;
            case 'ctrlHome':
                actionValue = 'ControlHome';
                break;
            case 'shiftHome':
                actionValue = 'ShiftHome';
                break;
            case 'shiftEnd':
                actionValue = 'ShiftEnd';
                break;
            case 'shiftLeft':
                actionValue = 'ShiftLeft';
                break;
            case 'shiftRight':
                actionValue = 'ShiftRight';
                break;
            case 'csHome':
                actionValue = 'ControlShiftHome';
                break;
            case 'csEnd':
                actionValue = 'ControlShiftEnd';
                break;
            case 'csLeft':
                actionValue = 'ControlShiftLeft';
                break;
            case 'csRight':
                actionValue = 'ControlShiftRight';
                break;
            case 'ctrlUp':
                actionValue = 'ControlUp_' + perRow.toString();
                break;
            case 'shiftUp':
                actionValue = 'ShiftUp_' + perRow.toString();
                break;
            case 'csUp':
                actionValue = 'ControlShiftUp_' + perRow.toString();
                break;
            case 'ctrlDown':
                actionValue = 'ControlDown_' + perRow.toString();
                break;
            case 'shiftDown':
                actionValue = 'ShiftDown_' + perRow.toString();
                break;
            case 'csDown':
                actionValue = 'ControlShiftDown_' + perRow.toString();
                break;
            case 'space':
                actionValue = 'Space';
                break;
            case 'csSpace':
                actionValue = 'ControlShiftSpace';
                break;
            case 'shiftSpace':
                actionValue = 'ShiftSpace';
                break;
            case 'ctrlSpace':
                actionValue = 'ControlSpace';
                break;
        }
        if (actionValue) {
            this.dotnetRef.invokeMethodAsync('PerformKeyboardAction', actionValue);
        }
    }
    private keydownHandler(e: KeyboardEventArgs): void {
        if (this.element.querySelector('.e-dialog.e-popup-open') == null) {
            switch (e.action) {
                case 'end':
                case 'home':
                case 'space':
                case 'ctrlSpace':
                case 'shiftSpace':
                case 'csSpace':
                case 'ctrlA':
                case 'enter':
                case 'altEnter':
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
                case 'esc':
                case 'del':
                case 'shiftdel':
                case 'ctrlC':
                case 'ctrlV':
                case 'ctrlX':
                case 'f2':
                case 'moveDown':
                case 'moveUp':
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        }
    }
}

// tslint:disable-next-line
let FileManager: object = {
    initialize(element: BlazorElement, dotnetRef: BlazorDotnetObject, properties: InitProps): string {
        new SfFileManager(element, dotnetRef, properties);
        if (properties.draggable) {
            element.blazor__instance.createDragObj();
        }
        return element.blazor__instance.adjustHeight();
    },
    dragStartActionContinue(element: BlazorElement, cancel: boolean): void {
        if (element) {
            element.blazor__instance.TriggerDragStartEvent(cancel);
        }
    },
    dragActionContinue(element: BlazorElement, cancel: boolean): void {
        if (element) {
            element.blazor__instance.TriggerDragEvent(cancel);
        }
    },
    updateProperties(element: BlazorElement, properties: InitProps): string {
        element.blazor__instance.properties = properties;
        element.blazor__instance.unWireEvents();
        element.blazor__instance.wireEvents();
        return element.blazor__instance.adjustHeight();
    },
    uploadOpen(element: BlazorElement, id: string): void {
        let uploadElement: HTMLElement = element.querySelector('#' + id);
        if (uploadElement) { uploadElement.click(); }
    },
    updateView(element: BlazorElement, view: string): void {
        if (element) {
            element.blazor__instance.properties.view = view;
            element.blazor__instance.bindKeyboardEvent();
        }
    },
    updateGridRow(gridEle: HTMLElement, index: number): void {
        if (gridEle) {
            let selectedElements: NodeList = gridEle.querySelectorAll('tr.e-row[tabindex="0"]');
            for (let i: number = 0; i < selectedElements.length; i++) {
                (<HTMLElement>selectedElements[i]).removeAttribute('tabindex');
            }
            let element1: HTMLElement = gridEle.querySelector('[aria-rowindex="' + index + '"]');
            if (element1) {
                element1.setAttribute('tabindex', '0');
                element1.focus();
            }
        }
    },
    // tslint:disable-next-line
    saveFile(filename: any, url: string, element: BlazorElement): void {
        // tslint:disable-next-line
        let data: object = { 'action': 'download', 'path': filename.path, 'names': filename.names, 'data': filename.data };
        let form: HTMLElement = createElement('form', {
            id: element.id + '_downloadForm',
            attrs: { action: url, method: 'post', name: 'downloadForm', 'download': '' }
        });
        let input: HTMLElement = createElement('input', {
            id: element.id + '_hiddenForm',
            attrs: { name: 'downloadInput', value: JSON.stringify(data), type: 'hidden' }
        });
        form.appendChild(input);
        document.body.appendChild(form);
        document.forms.namedItem('downloadForm').submit();
        document.body.removeChild(form);
    },
    getTargetElement(view: string, x: number, y: number): MenuOpenModel {
        let element: Element = document.elementFromPoint(x, y);
        let targetElement: Element;
        let menuModel: MenuOpenModel;
        let treeElement: HTMLElement = closest(element, 'li[role="treeitem"]') as HTMLElement;
        if (!element) {
            menuModel = { IsFile: false, RowIndex: null, IsFolder: false, IsLayout: false, IsTree: false };
        } else {
            if ((element.classList.contains('e-yscroll') && element.classList.contains('e-content')) ||
                (element.classList.contains('e-list-parent') && element.classList.contains('e-ul')) ||
                element.classList.contains('e-view-container')) {
                menuModel = { IsFile: false, RowIndex: null, IsFolder: false, IsLayout: true, IsTree: false };
            } else if (treeElement) {
                let dataid: number = parseInt(treeElement.getAttribute('data-uid'), 10);
                menuModel = { IsFile: false, RowIndex: dataid, IsFolder: true, IsLayout: false, IsTree: true };
            } else {
                if (view === 'Details') {
                    targetElement = closest(element, 'tr');
                    let isFile: boolean = !(targetElement.querySelector('.e-fe-grid-icon .e-fe-icon').classList.contains('e-fe-folder'));
                    let rowIndex: number = parseInt(targetElement.getAttribute('aria-rowindex'), 10);
                    menuModel = { IsFile: isFile, RowIndex: rowIndex, IsFolder: !isFile, IsLayout: false, IsTree: false };
                } else if (view === 'LargeIcons') {
                    targetElement = closest(element, 'li');
                    let iconEle: HTMLElement = targetElement.querySelector('.e-list-icon');
                    let isFile: boolean = iconEle ? !(iconEle.classList.contains('e-fe-folder')) : true;
                    let rowIndex: number = parseInt(targetElement.getAttribute('data-uid'), 10);
                    menuModel = { IsFile: isFile, RowIndex: rowIndex, IsFolder: !isFile, IsLayout: false, IsTree: false };
                }
            }
        }
        return menuModel;
    }
};

interface BlazorElement extends HTMLElement {
    blazor__instance: SfFileManager;
}

interface InitProps {
    height: string;
    view: string;
    id: string;
    draggable: boolean;
}

interface MenuOpenModel {
    IsFile: boolean;
    IsTree: boolean;
    IsFolder: boolean;
    IsLayout: boolean;
    RowIndex: number;
}

class FileDragEventArgs {
    public fileDetails?: Object[];
    public event?: MouseEvent & TouchEvent;
    public element?: HTMLElement;
    public target?: HTMLElement;
    public cancel?: Boolean;
}

export default FileManager;