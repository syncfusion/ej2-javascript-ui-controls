import { BlazorDotnetObject, EventHandler, isNullOrUndefined as isNOU, selectAll, closest, Touch, Browser } from '@syncfusion/ej2-base';
import { select, KeyboardEventArgs, Effect, isVisible, createElement, detach, matches, getElement, remove } from '@syncfusion/ej2-base';
import { Draggable, DragEventArgs, Droppable, DropEventArgs, KeyboardEvents, BlazorDragEventArgs, Animation } from '@syncfusion/ej2-base';
import { TapEventArgs, removeClass, addClass, AnimationOptions } from '@syncfusion/ej2-base';

const LISTITEM: string = 'e-list-item';
const PARENTITEM: string = 'e-list-parent';
const HOVER: string = 'e-hover';
const COLLAPSIBLE: string = 'e-icon-collapsible';
const EXPANDABLE: string = 'e-icon-expandable';
const MOUSEOVER: string = 'mouseover';
const CLICK: string = 'Click';
const DBLCLICK: string = 'DoubleClick';
const FOCUSING: string = 'focus';
const BLUR: string = 'blur';
const MOUSEDOWN: string = 'mousedown';
const MOUSEOUT: string = 'mouseout';
const EXPANDONNONE: string = 'None';
const EXPANDONAUTO: string = 'DoubleClick';
const ICON: string = 'e-icons';
const CHECK: string = 'e-check';
const BLOCK: string = 'block';
const HIDDEN: string = 'hidden';
const NONE: string = 'none';
const EMPTY: string = '';
const DISPLAYNONE: string = 'e-display-none';
const ACTIVE: string = 'e-active';
const CONTROL: string = 'e-control';
const ROOT: string = 'e-treeview';
const FOCUS: string = 'e-node-focus';
const PROCESS: string = 'e-process';
const CHECKBOXFRAME: string = 'e-frame';
const CHECKBOXWRAP: string = 'e-checkbox-wrapper';
const CHECKBOXRIPPLE: string = 'e-ripple-container';
const EDITING: string = 'e-editing';
const INPUT: string = 'e-input';
const INPUTGROUP: string = 'e-input-group';
const DISABLED: string = 'e-disabled';
const TEXTWRAP: string = 'e-text-content';
const FULLROW: string = 'e-fullrow';
const DRAGITEM: string = 'e-drag-item';
const DROPPABLE: string = 'e-droppable';
const DRAGGING: string = 'e-dragging';
const SIBLING: string = 'e-sibling';
const DROPIN: string = 'e-drop-in';
const DROPNEXT: string = 'e-drop-next';
const DROPOUT: string = 'e-drop-out';
const NODROP: string = 'e-no-drop';
const RTL: string = 'e-rtl';
const DROPCOUNT: string = 'e-drop-count';
const ITEM_ANIMATION_ACTIVE: string = 'e-animation-active';
const ALLOWDRAGANDDROP: string = 'allowDragAndDrop';
const ALLOWEDITING: string = 'allowEditing';
const SHOWCHECKBOX: string = 'showCheckBox';
const SETDISABLED: string = 'disabled';
const DRAGAREA: string = 'dragArea';
const CSSCLASS: string = 'cssClass';
const ANIMATION: string = 'animation';
const EXPANDONTYPE: string = 'expandOnType';
const ENABLERTL: string = 'enableRtl';
const DISABLE: string = 'e-disable';
const RIPPLE: string = 'e-ripple';
const RIPPLEELMENT: string = 'e-ripple-element';
const FULLROWSELECT: string = 'fullRowSelect';
const FULLROWWRAP: string = 'e-fullrow-wrap';

class SfTreeView {
    public element: BlazorTreeViewElement;
    public dotNetRef: BlazorDotnetObject;
    public options: ITreeViewOptions;
    private allowMultiSelection: boolean;
    private dragObj: Draggable;
    private dropObj: Droppable;
    private keyboardModule: KeyboardEvents;
    private dragLi: Element;
    private dragTarget: Element;
    private dragData: { [key: string]: Object };
    private oldText: string;
    private isHelperElement: boolean = true;
    private iconElement: Element;
    private dragStartAction: boolean;
    private touchClickObj: Touch;
    private touchExpandObj: Touch;
    private touchEditObj: Touch;
    private mouseDownStatus: boolean = false;
    private listBaseOption: { [key: string]: Object };
    private dragParent: Element;
    private expandArgs: NodeExpandEventArgs;
    private editEventArgs: NodeEditEventArgs;
    private dragStartEventArgs: DragEventArgs & BlazorDragEventArgs;
    private draggingEventArgs: DragAndDropEventArgs;
    private dragStopEventArgs: { event: MouseEvent & TouchEvent, element: HTMLElement, target: Element, helper: HTMLElement };
    private startNode: Element;
    private animationObj: Animation;
    private liList: HTMLElement[];
    private keyAction: KeyboardEventArgs;
    private keyConfigs: { [key: string]: string };
    private preventExpand: boolean = false;
    private firstTap: Element;
    public focussedElement: Element;
    constructor(element: BlazorTreeViewElement, options: ITreeViewOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = options;
    }
    public render(): void {
        this.dragStartAction = false;
        this.listBaseOption = {
            expandCollapse: true,
            showIcon: true,
            expandIconClass: EXPANDABLE,
            expandIconPosition: 'Left'
        };
        this.keyConfigs = {
            escape: 'escape',
            end: 'end',
            enter: 'enter',
            f2: 'f2',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            ctrlA: 'ctrl+A',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space',
        };
        this.animationObj = new Animation({});
        this.setDisabledMode(this.options.disabled);
        this.setMultiSelect(this.options.allowMultiSelection);
    }

    public setDisabledMode(isEnabled: boolean): void {
        this.setDragAndDrop(this.options.allowDragAndDrop);
        this.wireEditingEvents(this.options.allowEditing);
        if (isEnabled) {
            this.element.classList.add(DISABLED);
            this.unWireEvents();
        } else {
            this.element.classList.remove(DISABLED);
            this.wireEvents();
        }
    }

    private setEnableRtl(): void {
        this.options.enableRtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDownStatus = true;
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (e.ctrlKey && this.options.allowMultiSelection) {
            EventHandler.add(this.element, 'contextmenu', this.preventContextMenu, this);
        }
    }

    private onMouseLeave(e: MouseEvent): void {
        this.removeHover();
    }

    public unWireEvents(): void {
        this.wireClickEvent(false);
        this.wireExpandOnEvent(false);
        EventHandler.remove(this.element, MOUSEDOWN, this.mouseDownHandler);
        EventHandler.remove(this.element, FOCUSING, this.focusIn);
        EventHandler.remove(this.element, BLUR, this.focusOut);
        EventHandler.remove(this.element, MOUSEOVER, this.onMouseOver);
        EventHandler.remove(this.element, MOUSEOUT, this.onMouseLeave);
        if (!this.options.disabled && this.keyboardModule) {
            this.keyboardModule.destroy();
        }
    }

    private keyboardActionHandler(e: KeyboardEventArgs): void {
        this.keyAction = e;
        let target: Element = <Element>e.target;
        let focusedNode: Element = this.getFocusedNode();
        if (target && target.classList.contains(INPUT)) {
            let inpEle: HTMLInputElement = <HTMLInputElement>target;
            if (e.action === 'enter') {
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            } else if (e.action === 'escape') {
                inpEle.value = this.oldText;
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            }
            return;
        }
        e.preventDefault();
        let eventArgs: NodeKeyPressEventArgs = {
            cancel: false,
            event: e,
        };
        let id: string = focusedNode.getAttribute('data-uid');
        this.dotNetRef.invokeMethodAsync('TriggerKeyboardEvent', eventArgs, id, e.action, e.key);
    }
    public setMultiSelect(isEnabled: boolean): void {
        this.options.allowMultiSelection = isEnabled;
        let firstUl: Element = select('.' + PARENTITEM, this.element);
        if (isEnabled) {
            firstUl.setAttribute('aria-multiselectable', 'true');
        } else {
            firstUl.removeAttribute('aria-multiselectable');
        }
    }

    public setCssClass(cssClass: string): void {
        if (this.options.cssClass) { removeClass([this.element], this.options.cssClass.split(' ')); }
        if (cssClass) { addClass([this.element], cssClass.split(' ')); }
        this.options.cssClass = cssClass;
    }
    public wireEditingEvents(toBind: boolean): void {
        if (toBind && !this.options.disabled) {
            let proxy: SfTreeView = this;
            this.touchEditObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    if ( this.isDoubleTapped(e) && e.tapCount === 2) {
                        e.originalEvent.preventDefault();
                        proxy.editingHandler(e.originalEvent);
                    }
                }
            });
        } else  if (this.touchEditObj) {
                this.touchEditObj.destroy();
        }
    }

    public setDragAndDrop(toBind: boolean): void {
        if (toBind && !this.options.disabled) {
            this.initializeDrag();
        } else {
            this.destroyDrag();
        }
    }

    public setDragArea(dragArea: string): void {
        if (this.options.allowDragAndDrop) {
            this.dragObj.dragArea = dragArea;
        }
    }

    private destroyDrag(): void {
        if (this.dragObj && this.dropObj) {
            this.dragObj.destroy();
            this.dropObj.destroy();
        }
    }

    private initializeDrag(): void {
        let virtualEle: HTMLElement; let proxy: SfTreeView = this;
        this.dragObj = new Draggable(this.element, {
            enableTailMode: true, enableAutoScroll: true,
            dragArea: this.options.dropArea,
            dragTarget: '.' + TEXTWRAP,
            helper: (e: { sender: MouseEvent & TouchEvent, element: HTMLElement }) => {
                this.dragTarget = <Element>e.sender.target;
                let dragRoot: Element = closest(this.dragTarget, '.' + ROOT);
                let dragWrap: Element = closest(this.dragTarget, '.' + TEXTWRAP);
                this.dragLi = closest(this.dragTarget, '.' + LISTITEM);
                if (this.options.fullRowSelect && !dragWrap && this.dragTarget.classList.contains(FULLROW)) {
                    dragWrap = this.dragTarget.nextElementSibling;
                }
                if (!this.dragTarget || !e.element.isSameNode(dragRoot) || !dragWrap ||
                    this.dragTarget.classList.contains(ROOT) || this.dragTarget.classList.contains(PARENTITEM) ||
                    this.dragTarget.classList.contains(LISTITEM) || this.dragLi.classList.contains(DISABLE)) {
                    return false;
                }
                let cloneEle: Element = <Element>(dragWrap.cloneNode(true));
                if (isNOU(select('div.' + ICON, cloneEle))) {
                    let icon: HTMLElement = createElement('div', { className: ICON + ' ' + EXPANDABLE });
                    cloneEle.insertBefore(icon, cloneEle.children[0]);
                }
                let cssClass: string = DRAGITEM + ' ' + ROOT + ' ' + this.options.cssClass + ' ' + (this.options.enableRtl ? RTL : EMPTY);
                virtualEle = createElement('div', { className: cssClass });
                virtualEle.appendChild(cloneEle);
                let selectedLI: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + ACTIVE);
                let length: number = selectedLI.length;
                if (length > 1 && this.options.allowMultiSelection && this.dragLi.classList.contains(ACTIVE)) {
                    let cNode: HTMLElement = createElement('span', { className: DROPCOUNT, innerHTML: EMPTY + length });
                    virtualEle.appendChild(cNode);
                }
                document.body.appendChild(virtualEle);
                document.body.style.cursor = EMPTY;
                this.dragData = this.getNodeData(this.dragLi);
                return virtualEle;
            },
            drag: (e: DragEventArgs) => {
                this.dragObj.setProperties({ cursorAt: { top: (!isNOU(e.event.targetTouches) || Browser.isDevice) ? 60 : -20 } });
                this.dragAction(e, virtualEle);
            },
            dragStart: (e: DragEventArgs & BlazorDragEventArgs) => {
                addClass([this.element], DRAGGING);
                let listItem: Element = closest(e.target, LISTITEM); let level: number;
                if (listItem) {
                    level = parseInt(listItem.getAttribute('aria-level'), 10);
                }
                let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, null, e.target, null, virtualEle, level);
                if (eventArgs.draggedNode.classList.contains(EDITING)) {
                    this.dragObj.intDestroy(e.event);
                    this.dragCancelAction(virtualEle);
                } else {
                    this.dragStartEventArgs = e;
                    let left: number = this.getXYValue(e.event, 'X');
                    let top: number = this.getXYValue(e.event, 'Y');
                    this.dotNetRef.invokeMethodAsync('TriggerDragStartEvent', this.updateObjectValues(eventArgs), left, top);
                }
            },
            dragStop: (e: { event: MouseEvent & TouchEvent, element: HTMLElement, target: Element, helper: HTMLElement }) => {
                removeClass([this.element], DRAGGING);
                this.removeVirtualEle();
                let dropTarget: Element = e.target;
                let preventTargetExpand: boolean = false;
                let dropRoot: Element = (closest(dropTarget, '.' + DROPPABLE));
                this.isHelperElement = true;
                if (!dropTarget || !dropRoot) {
                    remove(e.helper);
                    document.body.style.cursor = EMPTY;
                    this.isHelperElement = false;
                }
                let listItem: Element = closest(dropTarget, LISTITEM); let level: number;
                if (listItem) { level = parseInt(listItem.getAttribute('aria-level'), 10); }
                let dropEle: HTMLElement = <HTMLElement>dropTarget;
                let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, dropTarget, dropEle, null, e.helper, level);
                this.dragStopEventArgs = e;
                eventArgs.preventTargetExpand = preventTargetExpand;
                let left: number = this.getXYValue(e.event, 'X');
                let top: number = this.getXYValue(e.event, 'Y');
                this.dotNetRef.invokeMethodAsync('TriggerDragStopEvent', this.updateObjectValues(eventArgs), left, top);
            }
        });
        this.dropObj = new Droppable(this.element, {
            out: (e: { evt: MouseEvent & TouchEvent, target: Element }) => {
                if (!isNOU(e) && !e.target.classList.contains(SIBLING)) {
                    document.body.style.cursor = 'not-allowed';
                }
            },
            over: (e: { evt: MouseEvent & TouchEvent, target: Element }) => {
                document.body.style.cursor = EMPTY;
            },
            drop: (e: DropEventArgs) => {
                this.dropAction(e);
            }
        });
    }

    private updateObjectValues(evtArgs: DragAndDropEventArgs): DragAndDropEventArgs {
        /* tslint:disable:no-string-literal */
        evtArgs['clonedNode'] = null;
        evtArgs['draggedNode'] = null;
        evtArgs['draggedParentNode'] = null;
        evtArgs['dropTarget'] = null;
        evtArgs['droppedNode'] = null;
        evtArgs['target'] = null;
        /* tslint:enable:no-string-literal */
        return evtArgs;
    }

    public dragNodeStop(eventArgs: DragAndDropEventArgs): void {
        this.dragParent = eventArgs.draggedParentNode;
        this.preventExpand = eventArgs.preventTargetExpand;
        if (eventArgs.cancel) {
            if (this.dragStopEventArgs.helper.parentNode) {
                remove(this.dragStopEventArgs.helper);
            }
            document.body.style.cursor = '';
            this.isHelperElement = false;
        }
        this.dragStartAction = false;
    }

    public dragStartActionContinue(): void {
        this.dragStartAction = true;
        this.dragStartEventArgs.bindEvents(getElement(this.dragStartEventArgs.dragElement));
    }

    private getId(ele: string | Element): string {
        if (isNOU(ele)) {
            return null;
        } else if (typeof ele === 'string') {
            return ele;
        } else if (typeof ele === 'object') {
            return (getElement(ele)).getAttribute('data-uid');
        } else {
            return null;
        }
    }

    // tslint:disable
    private dropAction(e: any, isBlazorDrop?: boolean): void {
        let offsetY: number = e.event.offsetY;
        let dropTarget: Element = <Element>e.target;
        let dragObj: SfTreeView;
        let level: number;
        let drop: boolean = false;
        if (!isBlazorDrop) {
            dragObj = <SfTreeView>e.dragData.draggable.blazor__instance;
        } else {
            dragObj = <SfTreeView>e.element.blazor__instance;
        }
        if (dragObj && dragObj.dragTarget) {
            let dragTarget: Element = dragObj.dragTarget;
            let dragLi: Element = (closest(dragTarget, '.' + LISTITEM));
            let dropLi: Element = (closest(dropTarget, '.' + LISTITEM));
            if (dropLi == null && dropTarget.classList.contains(ROOT)) {
                dropLi = dropTarget.firstElementChild;
            }
            if (!isBlazorDrop) {
                remove(e.droppedElement);
            } else {
                remove(e.helper);
            }
            document.body.style.cursor = EMPTY;
            if (!dropLi || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                return;
            }
            if (dragObj.allowMultiSelection && dragLi.classList.contains(ACTIVE)) {
                let sNodes: HTMLElement[] = selectAll('.' + ACTIVE, dragObj.element);
                if (e.target.offsetHeight <= 33 && offsetY > e.target.offsetHeight - 10 && offsetY > 6) {
                    for (let i: number = sNodes.length - 1; i >= 0; i--) {
                        if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                            continue;
                        }
                        this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
                    }
                } else {
                    for (let i: number = 0; i < sNodes.length; i++) {
                        if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                            continue;
                        }
                        this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
                    }
                }
            } else {
                this.appendNode(dropTarget, dragLi, dropLi, e, dragObj, offsetY);
            }
            level = parseInt(dragLi.getAttribute('aria-level'), 10);
            drop = true;
        }
        let element: HTMLLIElement = isBlazorDrop ? <HTMLLIElement>e.element : <HTMLLIElement>e.dragData.draggedElement;
        let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, dragObj, dropTarget, e.target, element, null, level, drop);
        let left: number = this.getXYValue(e.event, 'X');
        let top: number = this.getXYValue(e.event, 'Y');
        this.dotNetRef.invokeMethodAsync('TriggerNodeDropped', this.updateObjectValues(eventArgs), left, top);
    }

    private isDoubleTapped(e: TapEventArgs): boolean {
        let target: Element = <Element>e.originalEvent.target;
        let secondTap: Element;
        if (target && e.tapCount) {
            if (e.tapCount === 1) {
                this.firstTap = closest(target, '.' + LISTITEM);
            } else if (e.tapCount === 2) {
                secondTap = closest(target, '.' + LISTITEM);
            }
        }
        return (this.firstTap === secondTap);
    }

    private isDescendant(parent: Element, child: Element): boolean {
        let node: Element = <Element>child.parentNode;
        while (!isNOU(node)) {
            if (node === parent) {
                return true;
            }
            node = <Element>node.parentNode;
        }
        return false;
    }

    private appendNode(dropTarget: Element, dragLi: Element, dropLi: Element, e: DropEventArgs,
                        dragObj: SfTreeView, offsetY: number): void {
        let checkContainer: HTMLElement = closest(dropTarget, '.' + CHECKBOXWRAP) as HTMLElement;
        let collapse: Element = closest(e.target, '.' + COLLAPSIBLE);
        let expand: Element = closest(e.target, '.' + EXPANDABLE);
        if (!dragLi.classList.contains(DISABLE) && !checkContainer && ((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX < 3)
            || (expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19) || (!expand && !collapse))) {
            if (dropTarget.nodeName === 'LI') {
                this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
            } else if (dropTarget.firstElementChild && dropTarget.classList.contains(ROOT)) {
                if (dropTarget.firstElementChild.nodeName === 'UL') {
                    this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
                }
            } else if ((dropTarget.classList.contains(COLLAPSIBLE)) || (dropTarget.classList.contains(EXPANDABLE))) {
                this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
            } else {
                this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY);
            }
        } else {
            this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY, true);
        }
    }

    private dropAsSiblingNode(dragLi: Element, dropLi: Element, e: DropEventArgs, dragObj: SfTreeView): void {
        let dropUl: Element = closest(dropLi, '.' + PARENTITEM);
        let dragParentUl: Element = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        let dropParentLi: Element = closest(dropUl, '.' + LISTITEM);
        let dropParentLiId: string = null, dragParentLiId: string = null;
        let pre: boolean;
        if (e.target.offsetHeight > 0 && e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        } else if (e.event.offsetY < 2) {
            pre = true;
        } else if (e.target.classList.contains(EXPANDABLE) || (e.target.classList.contains(COLLAPSIBLE))) {
            if ((e.event.offsetY < 5) || (e.event.offsetX < 3)) {
                pre = true;
            } else if ((e.event.offsetY > 15) || (e.event.offsetX > 17)) {
                pre = false;
            }
        }
        if (dropParentLi) {
            dropParentLiId = dropParentLi.getAttribute('data-uid');
        }
        if (dragParentLi) {
            dragParentLiId = dragParentLi.getAttribute('data-uid');
        }
        let dragLiId: string = dragLi.getAttribute('data-uid');
        this.dotNetRef.invokeMethodAsync('DropNodeAsSibling', dragLiId, dropLi.getAttribute('data-uid'), dropParentLiId, pre, dragParentLiId);
        this.updateAriaLevel(dragLi);
    }

    private updateAriaLevel(dragLi: Element): void {
        let level: number = this.parents(dragLi, '.' + PARENTITEM).length;
        dragLi.setAttribute('aria-level', EMPTY + level);
        this.updateChildAriaLevel(select('.' + PARENTITEM, dragLi), level + 1);
    }

    private updateChildAriaLevel(element: Element, level: number): void {
        if (!isNOU(element)) {
            let cNodes: Element[] = <NodeListOf<HTMLLIElement> & Element[]>element.querySelectorAll('li');
            for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
                let liEle: Element = cNodes[i];
                liEle.setAttribute('aria-level', EMPTY + level);
                this.updateChildAriaLevel(select('.' + PARENTITEM, liEle), level + 1);
            }
        }
    }

    private dropAsChildNode(dragLi: Element, dropLi: Element, dragObj: SfTreeView, index?: number,
                            e?: DropEventArgs, pos?: number, isCheck?: boolean): void {
        let dragParentUl: Element = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        let dropParentUl: Element = closest(dropLi, '.' + PARENTITEM);
        let dropParentLi: Element = closest(dropParentUl, '.' + LISTITEM);
        let dropParentLiId: string = null, dragParentLiId: string = null;
        let dragLiId: string = dragLi.getAttribute('data-uid');
        let dropLiId: string = dropLi.getAttribute("data-uid");
        if (dropParentLi) {
            dropParentLiId = dropParentLi.getAttribute('data-uid');
        }
        if (dragParentLi) {
            dragParentLiId = dragParentLi.getAttribute('data-uid');
        }
        if (e && (pos < 7) && !isCheck) {
            this.dotNetRef.invokeMethodAsync('DropNodeAsSibling', dragLiId, dropLiId, dropParentLiId, true, dragParentLiId);
        } else if (e && (e.target.offsetHeight > 0 && pos > (e.target.offsetHeight - 10)) && !isCheck) {
            this.dotNetRef.invokeMethodAsync('DropNodeAsSibling', dragLiId, dropLiId, dropParentLiId, false, dragParentLiId);
        } else {
            this.dotNetRef.invokeMethodAsync('DropNodeAsChild', dragLiId, dropLiId, dragParentLiId);
        }
        this.updateAriaLevel(dragLi);
    }

    private dragCancelAction(virtualEle: HTMLElement): void {
        detach(virtualEle);
        removeClass([this.element], DRAGGING);
        this.dragStartAction = false;
    }

    private removeVirtualEle(): void {
        let sibEle: Element = select('.' + SIBLING);
        if (sibEle) {
            detach(sibEle);
        }
    }

    private dragAction(e: DropEventArgs, virtualEle: HTMLElement): void {
        let dropRoot: Element = closest(e.target, '.' + DROPPABLE);
        let dropWrap: Element = closest(e.target, '.' + TEXTWRAP);
        let icon: Element = select('div.' + ICON, virtualEle);
        removeClass([icon], [DROPIN, DROPNEXT, DROPOUT, NODROP]);
        this.removeVirtualEle();
        document.body.style.cursor = EMPTY;
        let classList: DOMTokenList = e.target.classList;
        if (this.options.fullRowSelect && !dropWrap && !isNOU(classList) && classList.contains(FULLROW)) {
            dropWrap = e.target.nextElementSibling;
        }
        if (dropRoot) {
            let dropLi: Element = closest(e.target, '.' + LISTITEM);
            let checkContainer: HTMLElement = closest(e.target, '.' + CHECKBOXWRAP) as HTMLElement;
            let collapse: Element = closest(e.target, '.' + COLLAPSIBLE);
            let expand: Element = closest(e.target, '.' + EXPANDABLE);
            if (!dropRoot.classList.contains(ROOT) || (dropWrap &&
                (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi)))) {
                if ((dropLi && e && (!expand && !collapse) && (e.event.offsetY < 7) && !checkContainer) ||
                    (((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX < 3)))) {
                    addClass([icon], DROPNEXT);
                    let element: Element = createElement('div', { className: SIBLING });
                    let index: number = this.options.fullRowSelect ? (1) : (0);
                    dropLi.insertBefore(element, dropLi.children[index]);
                } else if ((dropLi && e && (!expand && !collapse) && (e.target.offsetHeight > 0 && e.event.offsetY >
                    (e.target.offsetHeight - 10)) && !checkContainer) || (((expand && e.event.offsetY > 19) ||
                    (collapse && e.event.offsetX > 19)))) {
                    addClass([icon], DROPNEXT);
                    let element: Element = createElement('div', { className: SIBLING });
                    let index: number = this.options.fullRowSelect ? (2) : (1);
                    dropLi.insertBefore(element, dropLi.children[index]);
                } else {
                    addClass([icon], DROPIN);
                }
            } else if (e.target.nodeName === 'LI' && (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi))) {
                addClass([icon], DROPNEXT);
                this.renderVirtualEle(e);
            } else if (e.target.classList.contains(SIBLING)) {
                addClass([icon], DROPNEXT);
            } else {
                addClass([icon], DROPOUT);
            }
        } else {
            addClass([icon], NODROP);
            document.body.style.cursor = 'not-allowed';
        }
        let listItem: Element = closest(e.target, LISTITEM);
        let level: number;
        if (listItem) {
            level = parseInt(listItem.getAttribute('aria-level'), 10);
        }
        let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, e.target, e.target, null, virtualEle, level);
        if (eventArgs.dropIndicator) {
            removeClass([icon], eventArgs.dropIndicator);
        }
        this.iconElement = icon;
        this.draggingEventArgs = eventArgs;
        let left: number = this.getXYValue(e.event, 'X');
        let top: number = this.getXYValue(e.event, 'Y');
        this.dotNetRef.invokeMethodAsync('TriggerNodeDraggingEvent', this.updateObjectValues(eventArgs), left, top);
    }

    public nodeDragging(eventArgs: DragAndDropEventArgs): void {
        if (this.draggingEventArgs.dropIndicator) {
            addClass([this.iconElement], this.draggingEventArgs.dropIndicator);
        }
    }

    private renderVirtualEle(e: DragEventArgs): void {
        let previous: boolean;
        if (e.event.offsetY > e.target.offsetHeight - 2) {
            previous = false;
        } else if (e.event.offsetY < 2) {
            previous = true;
        }
        let element: Element = createElement('div', { className: SIBLING });
        let index: number = this.options.fullRowSelect ? (previous ? 1 : 2) : (previous ? 0 : 1);
        e.target.insertBefore(element, e.target.children[index]);
    }

    private parents(element: Element | Node, selector: string): Element[] {
        let matched: Element[] = [];
        let node: Element = <Element>element.parentNode;
        while (!isNOU(node)) {
            if (matches(node, selector)) {
                matched.push(node);
            }
            node = <Element>node.parentNode;
        }
        return matched;
    }

    private getDragEvent(event: MouseEvent & TouchEvent, obj: SfTreeView, dropTarget: Element, target: HTMLElement,
                        dragNode?: HTMLLIElement, cloneEle?: HTMLElement, level?: number, drop?: boolean): DragAndDropEventArgs {
        let dropLi: Element = dropTarget ? closest(dropTarget, '.' + LISTITEM) : null;
        let dropData: { [key: string]: Object } = dropLi ? this.getNodeData(dropLi) : null;
        let draggedNode: HTMLLIElement = obj ? obj.dragLi as HTMLLIElement : dragNode;
        let draggedNodeData: { [key: string]: Object } = obj ? obj.dragData : null;
        let newParent: Element[] = dropTarget ? this.parents(dropTarget, '.' + LISTITEM) : null;
        let dragLiParent: Element = obj.dragLi.parentElement;
        let dragParent: Element = obj.dragLi ? closest(dragLiParent, '.' + LISTITEM) : null;
        let targetParent: Element = null;
        let indexValue: number = null;
        let iconCss: string[] = [DROPNEXT, DROPIN, DROPOUT, NODROP];
        let iconClass: string = null;
        let node: Element = drop ? draggedNode : dropLi;
        let index: Element = node ? closest(node, '.e-list-parent') : null;
        let i: number = 0;
        dragParent = (obj.dragLi && dragParent === null) ? closest(dragLiParent, '.' + ROOT) : dragParent;
        dragParent = drop ? this.dragParent : dragParent;
        if (cloneEle) {
            while (i < 4) {
                if (select('.' + ICON, cloneEle).classList.contains(iconCss[i])) {
                    iconClass = iconCss[i];
                    break;
                }
                i++;
            }
        }
        if (index) {
            let dropTar: number = 0;
            for (i = 0; i < index.childElementCount; i++) {
                dropTar = (!drop && index.children[i] === draggedNode && dropLi !== draggedNode) ? ++dropTar : dropTar;
                if ((!drop && index.children[i].classList.contains('e-hover'))) {
                    indexValue = (event.offsetY >= 23) ? i + 1 : i;
                    break;
                } else if (index.children[i] === node) {
                    indexValue = (event.offsetY >= 23) ? i : i;
                    break;
                }
            }
            indexValue = (dropTar !== 0) ? --indexValue : indexValue;
        }
        if (dropTarget) {
            if (newParent.length === 0) {
                targetParent = null;
            } else if (dropTarget.classList.contains(LISTITEM)) {
                targetParent = newParent[0];
            } else {
                targetParent = newParent[1];
            }
        }
        if (dropLi === draggedNode) { targetParent = dropLi; }
        if (dropTarget && target.offsetHeight <= 33 && event.offsetY < target.offsetHeight - 10 && event.offsetY > 6) {
            targetParent = dropLi;
            if (!drop) {
                level = ++level;
                let parent: Element = targetParent ? select('.e-list-parent', targetParent) : null;
                indexValue = (parent) ? parent.children.length : 0;
            }
        }
        return {
            cancel: false,
            clonedNode: cloneEle,
            event: event,
            draggedNode: draggedNode,
            draggedNodeData: draggedNodeData,
            droppedNode: dropLi as HTMLLIElement,
            droppedNodeData: dropData,
            dropIndex: indexValue,
            dropLevel: level,
            draggedParentNode: dragParent,
            dropTarget: targetParent,
            dropIndicator: iconClass,
            target: target,
        };
    }

    private editingHandler(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        if (!target || target.classList.contains(ROOT) || target.classList.contains(PARENTITEM) ||
            target.classList.contains(LISTITEM) || target.classList.contains(ICON) ||
            target.classList.contains(INPUT) || target.classList.contains(INPUTGROUP)) {
            return;
        } else {
            this.createTextbox(closest(target, '.' + LISTITEM), e);
        }
    }

    private createTextbox(liEle: Element, e: MouseEvent | KeyboardEventArgs): void {
        this.editEventArgs = this.getEditEvent(liEle, null, null);
        this.dotNetRef.invokeMethodAsync('TriggerNodeEditingEvent', this.editEventArgs);
    }

    private getEditEvent(liEle: Element, newText: string, inputEle: string): NodeEditEventArgs {
        let data: { [key: string]: Object } = this.getNodeData(liEle);
        return { newText: newText, nodeData: data, oldText: this.oldText, innerHtml: inputEle };
    }

    private focusIn(): void {
        if (!this.mouseDownStatus) {
            addClass([this.getFocusedNode()], HOVER);
        }
        this.mouseDownStatus = false;
    }

    private focusOut(): void {
        removeClass([this.getFocusedNode()], HOVER);
    }

    public wireEvents(): void {
        this.setExpandOnType();
        EventHandler.add(this.element, MOUSEOVER, this.onMouseOver, this);
        EventHandler.add(this.element, FOCUSING, this.focusIn, this);
        EventHandler.add(this.element, BLUR, this.focusOut, this);
        EventHandler.add(this.element, MOUSEOUT, this.onMouseLeave, this);
        if (this.options.showCheckBox) {
            let frame: Element = select('.' + CHECKBOXFRAME, this.element);
            if (!isNOU(frame)) {
                EventHandler.add(frame, 'mousedown', this.frameMouseHandler, this);
                EventHandler.add(frame, 'mouseup', this.frameMouseHandler, this);
            }
        }
        this.wireClickEvent(true);
        if (this.options.expandOnType !== EXPANDONNONE) {
            this.wireExpandOnEvent(true);
        }
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyboardActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private frameMouseHandler(e: MouseEvent): void {
        let rippleSpan: Element = select('.' + CHECKBOXRIPPLE, (e.target as Element).parentElement);
        this.rippleMouseHandler(e, rippleSpan);
    }
    private rippleMouseHandler(e: MouseEvent, rippleSpan: Element): void {
        if (rippleSpan) {
            let event: MouseEvent = document.createEvent('MouseEvents');
            event.initEvent(e.type, false, true);
            rippleSpan.dispatchEvent(event);
        }
    }
    private setExpandOnType(): void {
        let expandOnType: string = this.options.expandOnType;
        this.options.expandOnType = (expandOnType === EXPANDONAUTO) ? (Browser.isDevice ? CLICK : DBLCLICK) : expandOnType;
    }
    private expandHandler(e: TapEventArgs): void {
        let target: Element = <Element>e.originalEvent.target;
        if (!target || target.classList.contains(INPUT) || target.classList.contains(ROOT) ||
            target.classList.contains(PARENTITEM) || target.classList.contains(LISTITEM) ||
            target.classList.contains(ICON) || this.options.showCheckBox && closest(target, '.' + CHECKBOXWRAP)) {
            return;
        } else {
            this.expandCollapseAction(closest(target, '.' + LISTITEM), e);
        }
    }
    private expandCollapseAction(currLi: Element, e: TapEventArgs): void {
        let icon: Element = select('div.' + ICON, currLi);
        if (!icon || icon.classList.contains(PROCESS)) {
            return;
        } else {
            let classList: DOMTokenList = icon.classList;
            if (classList.contains(EXPANDABLE)) {
                this.expandAction(currLi, e);
            } else if (classList.contains(COLLAPSIBLE)) {
                this.collapseAction(currLi, e);
            }
        }
    }

    private animateHeight(args: AnimationOptions, start: number, end: number): void {
        let remaining: number = (args.duration - args.timeStamp) / args.duration;
        let currentHeight: number = (end - start) * remaining + start;
        args.element.parentElement.style.height = currentHeight + 'px';
    }

    public expandAction(currLi: Element, e: TapEventArgs | KeyboardEventArgs): void {
        this.expandArgs = this.getExpandEvent(currLi, e);
        let isLoaded: boolean = false;
        isLoaded = currLi.querySelector('ul') != null;
        if (currLi && currLi.classList.contains(PROCESS)) { removeClass([currLi], PROCESS); }
        this.dotNetRef.invokeMethodAsync('TriggerNodeExpandingEvent', this.expandArgs, isLoaded);
    }

    public collapseAction(currLi: Element, e: TapEventArgs | KeyboardEventArgs): void {
        this.expandArgs = this.getExpandEvent(currLi, e);
        let start: number = 0;
        let end: number = 0;
        let proxy: SfTreeView = this;
        let ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
        let liEle: HTMLElement = <HTMLElement>currLi;
        let activeElement: HTMLElement = <HTMLElement>select('.' + LISTITEM + '.' + ACTIVE, currLi);
        if (ul) {
            let icon: Element = select('div.' + ICON, liEle);
            removeClass([icon], COLLAPSIBLE);
            addClass([icon], EXPANDABLE);
        }
        this.animationObj.animate(ul, {
            name: this.options.animation.collapse.effect,
            duration: this.options.animation.collapse.duration,
            timingFunction: this.options.animation.collapse.easing,
            begin: (args: AnimationOptions): void => {
                liEle.style.overflow = HIDDEN;
                if (!isNOU(activeElement) && activeElement instanceof HTMLElement) {
                    activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                }
                start = (<HTMLElement>select('.' + TEXTWRAP, currLi)).offsetHeight;
                end = liEle.offsetHeight;
            },
            progress: (args: AnimationOptions): void => {
                proxy.animateHeight(args, start, end);
            },
            end: (args: AnimationOptions): void => {
                args.element.style.display = NONE;
                if (!isNOU(activeElement) && activeElement instanceof HTMLElement) {
                    activeElement.classList.remove(ITEM_ANIMATION_ACTIVE);
                }
                proxy.dotNetRef.invokeMethodAsync('TriggerNodeCollapsingEvent', proxy.expandArgs);
            }
        });
    }

    private wireExpandOnEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: SfTreeView = this;
            this.touchExpandObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    if ((this.options.expandOnType === CLICK || (this.options.expandOnType === DBLCLICK &&  this.isDoubleTapped(e) && e.tapCount === 2 ))
                        && e.originalEvent.which !== 3) {
                        proxy.expandHandler(e);
                    }
                }
            });
        } else {
            if (this.touchExpandObj) {
                this.touchExpandObj.destroy();
            }
        }
    }

    private getNodeData(currLi: Element, fromDS?: boolean): { [key: string]: Object } {
        if (!isNOU(currLi) && currLi.classList.contains(LISTITEM) &&
            !isNOU(closest(currLi, '.' + CONTROL)) && closest(currLi, '.' + CONTROL).classList.contains(ROOT)) {
            let id: string = currLi.getAttribute('data-uid');
            let pNode: Element = closest(currLi.parentNode, '.' + LISTITEM);
            let pid: string = pNode ? pNode.getAttribute('data-uid') : null;
            let selected: boolean = currLi.classList.contains(ACTIVE);
            let expanded: boolean = (currLi.getAttribute('aria-expanded') === 'true');
            let hasChildren: boolean = (currLi.getAttribute('aria-expanded') === null);
            let checked: string = null;
            if (this.options.showCheckBox) {
                checked = select('.' + CHECKBOXWRAP, currLi).getAttribute('aria-checked');
            }
            return {
                id: id, text: null, parentID: pid, selected: selected, expanded: expanded,
                isChecked: checked, hasChildren: hasChildren
            };
        }
        return { id: EMPTY, text: EMPTY, parentID: EMPTY, selected: false, expanded: false, isChecked: EMPTY, hasChildren: false };
    }

    private getExpandEvent(currLi: Element, e: MouseEvent | KeyboardEventArgs | TapEventArgs): NodeExpandEventArgs {
        let nodedata: { [key: string]: Object } = this.getNodeData(currLi);
        return { isInteracted: !isNOU(e), nodeData: nodedata, event: e };
    }

    public expandedNode(expandArgs: NodeExpandEventArgs): void {
        let li: Element = this.element.querySelector('[data-uid="' + expandArgs.nodeData.id + '"]');
        this.focussedElement = li;
        let ulelement: Element = li.querySelector('ul');
        if (ulelement) {
            ulelement.classList.remove(DISPLAYNONE);
            let icon: Element = select('div.' + ICON, li);
            this.expandArgs = this.getExpandEvent(li, expandArgs.event);
            let ul: Element = li.querySelector('[role=presentation]');
            let olist: Element = li.querySelector('[role=group]');
            if (ul != null && olist != null) {
                let listelements: Element[] = <NodeListOf<HTMLLIElement> & Element[]>ul.querySelectorAll('ul[role=presentation]>li');
                for (let i: number = 0; i < listelements.length; i++) {
                    olist.appendChild(listelements[i]);
                }
                ul.remove();
            }
            let ulele: HTMLElement = <HTMLElement>select('.' + PARENTITEM, li);
            let liEle: HTMLElement = <HTMLElement>li;
            let activeElement: HTMLElement = <HTMLElement>select('.' + LISTITEM + '.' + ACTIVE, li);
            let start: number = 0;
            let end: number = 0;
            let proxy: SfTreeView = this;
            this.setHeight(liEle, ulele);
            this.animationObj.animate(ulele, {
                name: this.options.animation.expand.effect,
                duration: this.options.animation.expand.duration,
                timingFunction: this.options.animation.expand.easing,
                begin: (args: AnimationOptions): void => {
                    liEle.style.overflow = HIDDEN;
                    if (!isNOU(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                    }
                    start = liEle.offsetHeight;
                    end = (<HTMLElement>select('.' + TEXTWRAP, li)).offsetHeight;
                },
                progress: (args: AnimationOptions): void => {
                    removeClass([icon], EXPANDABLE);
                    addClass([icon], COLLAPSIBLE);
                    args.element.style.display = BLOCK;
                    proxy.animateHeight(args, start, end);
                },
                end: (args: AnimationOptions): void => {
                    args.element.style.display = BLOCK;
                    if (!isNOU(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.remove(ITEM_ANIMATION_ACTIVE);
                    }
                    proxy.dotNetRef.invokeMethodAsync('TriggerNodeExpandedEvent', proxy.expandArgs);
                    ulele.style.display = BLOCK;
                    liEle.style.display = BLOCK;
                    liEle.style.overflow = EMPTY;
                    liEle.style.height = EMPTY;
                }
            });
        } else if (li.querySelector(".e-icon-expandable")) {
            let icon: Element = select('div.' + ICON, li);
            removeClass([icon], EXPANDABLE);
            addClass([icon], COLLAPSIBLE);
        }
    }

    private setHeight(currli: HTMLElement, ul: HTMLElement): void {
        ul.style.display = BLOCK;
        ul.style.visibility = HIDDEN;
        currli.style.height = currli.offsetHeight + 'px';
        ul.style.display = NONE;
        ul.style.visibility = EMPTY;
    }

    public collapsedNode(collapseArgs: NodeExpandEventArgs): void {
        let li: HTMLElement = this.element.querySelector('[data-uid="' + collapseArgs.nodeData.id + '"]');
        this.focussedElement = li;
        let ulelement: HTMLElement = li.querySelector('ul');
        if (ulelement) {
            ulelement.style.display = NONE;
            ulelement.classList.add(DISPLAYNONE);
        }
        li.style.overflow = EMPTY;
        li.style.height = EMPTY;   
        this.expandArgs = this.getExpandEvent(li, null);
        let icon: Element = select('div.' + ICON, li);
        let _this: any = this;
        setTimeout(function(){
            removeClass([icon], COLLAPSIBLE);
            addClass([icon], EXPANDABLE);
            _this.dotNetRef.invokeMethodAsync('TriggerNodeCollapsedEvent', _this.expandArgs);
        }, 100);
    }

    private preventContextMenu(e: MouseEvent): void {
        e.preventDefault();
    }

    private clickHandler(event: TapEventArgs): void {
        let target: Element = <Element>event.originalEvent.target;
        EventHandler.remove(this.element, 'contextmenu', this.preventContextMenu);
        if (!target) {
            return;
        } else {
            let classList: DOMTokenList = target.classList;
            let li: Element = closest(target, '.' + LISTITEM);
            if (!li) {
                return;
            } else if (event.originalEvent.which !== 3) {
                let rippleElement: Element =  select('.' + RIPPLEELMENT, li);
                let rippleIcons: Element = select('.' + ICON, li);
                this.removeHover();
                this.focussedElement = li;
                this.setFocusElement(li);
                if (this.options.showCheckBox && !li.classList.contains(DISABLE)) {
                    let checkContainer: HTMLElement = closest(target, '.' + CHECKBOXWRAP) as HTMLElement;
                    if (!isNOU(checkContainer)) {
                        let checkElement: Element = select('.' + CHECKBOXFRAME, checkContainer);
                        this.validateCheckNode(checkContainer, checkElement.classList.contains(CHECK), li, event.originalEvent);
                        this.triggerClickEvent(event.originalEvent, li);
                        return;
                    }
                }
                if (classList.contains(EXPANDABLE)) {
                    this.expandAction(li, event);
                } else if (classList.contains(COLLAPSIBLE)) {
                    this.collapseAction(li, event);
                } else if (rippleElement && rippleIcons) {
                    if (rippleIcons.classList.contains(RIPPLE) && rippleIcons.classList.contains(EXPANDABLE)) {
                        this.expandAction(li, event);
                    } else if (rippleIcons.classList.contains(RIPPLE) && rippleIcons.classList.contains(COLLAPSIBLE)) {
                        this.collapseAction(li, event);
                    } else if (!classList.contains(PARENTITEM) && !classList.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                } else { 
                    if (!classList.contains(PARENTITEM) && !classList.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                }
            }
            this.triggerClickEvent(event.originalEvent, li);
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

    private triggerClickEvent(e: MouseEvent, li: Element): void {
        let eventArgs: NodeClickEventArgs = {
            event: e,
            node: null
        };
        this.dotNetRef.invokeMethodAsync('TriggerNodeClickingEvent', eventArgs, li.getAttribute('data-uid'), this.getXYValue(e, 'X'), this.getXYValue(e, 'Y'));
    }

    private getCheckEvent(currLi: Element, action: string, e: MouseEvent | KeyboardEventArgs): NodeCheckEventArgs {
        return { action: action, isInteracted: !isNOU(e), nodeData: this.getNodeData(currLi) };
    }

    private validateCheckNode(checkWrap: HTMLElement | Element, isCheck: boolean,
                                li: HTMLElement | Element, e: KeyboardEventArgs | MouseEvent): void {
        let currLi: Element = closest(checkWrap, '.' + LISTITEM);
        let ariaState: string = !isCheck ? 'true' : 'false';
        if (!isNOU(ariaState)) {
            checkWrap.setAttribute('aria-checked', ariaState);
        }
        let eventArgs: NodeCheckEventArgs = this.getCheckEvent(currLi, isCheck ? 'uncheck' : 'check', e);
        this.dotNetRef.invokeMethodAsync('TriggerNodeCheckingEvent', eventArgs);
    }

    private toggleSelect(li: Element, e: MouseEvent | KeyboardEventArgs, multiSelect?: boolean): void {
        if (!li.classList.contains(DISABLE)) {
            if (this.options.allowMultiSelection && ((e && e.ctrlKey) || multiSelect) && this.isActive(li)) {
                this.unselectNode(li, e, multiSelect);
            } else {
                this.selectNode(li, e, multiSelect);
            }
        }
    }

    private unselectNode(li: Element, e: MouseEvent | KeyboardEventArgs, multiSelect: boolean): void {
        let eventArgs: NodeSelectEventArgs = this.getSelectEvent(li, 'un-select', e);
        this.dotNetRef.invokeMethodAsync('TriggerNodeSelectingEvent', eventArgs, multiSelect, e.ctrlKey, e.shiftKey, []);
    }

    private getSelectEvent(currLi: Element, action: string, e: MouseEvent | KeyboardEventArgs): NodeSelectEventArgs {
        let detail: { [key: string]: Object } = this.getNodeData(currLi);
        return { action: action, isInteracted: !isNOU(e), nodeData: detail };
    }

    private selectNode(li: Element, e: MouseEvent | KeyboardEventArgs, multiSelect?: boolean): void {
        if (isNOU(li) || (!this.options.allowMultiSelection && this.isActive(li) && !isNOU(e))) {
            this.setFocusElement(li);
            this.focussedElement = li;
            return;
        }
        let eventArgs: NodeSelectEventArgs = this.getSelectEvent(li, 'select', e);
        let array: string[] = [];
        if (this.options.allowMultiSelection && e && e.shiftKey) {
            if (!this.startNode) {
                this.startNode = li;
            }
            let liList: HTMLElement[] = Array.prototype.slice.call(selectAll('.' + LISTITEM, this.element));
            let startIndex: number = liList.indexOf(<HTMLElement>this.startNode);
            let endIndex: number = liList.indexOf(<HTMLElement>li);
            if (startIndex > endIndex) {
                let temp: number = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i: number = startIndex; i <= endIndex; i++) {
                let currNode: Element = liList[i];
                if (isVisible(currNode) && !currNode.classList.contains(DISABLE)) {
                    array.push(currNode.getAttribute('data-uid'));
                }
            }
        }
        this.dotNetRef.invokeMethodAsync('TriggerNodeSelectingEvent', eventArgs, multiSelect, e.ctrlKey, e.shiftKey, array);
    }

    private setFocusElement(li: Element): void {
        if (!isNOU(li)) {
            let focusedNode: Element = this.getFocusedNode();
            if (focusedNode) {
                removeClass([focusedNode], FOCUS);
            }
            addClass([li], FOCUS);
            this.focussedElement = li;
            this.updateIdAttr(focusedNode, li);
        }
    }

    private updateIdAttr(preNode: Element, nextNode: Element): void {
        this.element.removeAttribute('aria-activedescendant');
        if (preNode) {
            preNode.removeAttribute('id');
        }
        nextNode.setAttribute('id', this.element.id + '_active');
        this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
    }

    private getFocusedNode(): Element {
        let selectedItem: Element;
        let fNode: Element = this.focussedElement ? this.focussedElement :
            select('.' + LISTITEM + '.' + FOCUS, this.element);
        if (isNOU(fNode)) { selectedItem = select('.' + LISTITEM, this.element); }
        return isNOU(fNode) ? (isNOU(selectedItem) ? this.element.firstElementChild : selectedItem) : fNode;
    }

    public selectedNode(nodeId: string): void {
        this.startNode = this.element.querySelector('[data-uid="' + nodeId + '"]');
    }

    public setFullRow(isEnabled: boolean): void {
        isEnabled ? addClass([this.element], FULLROWWRAP) : removeClass([this.element], FULLROWWRAP);
        this.options.fullRowSelect = isEnabled;
    }

    private isActive(li: Element): boolean {
        return li.classList.contains(ACTIVE);
    }

    private wireClickEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: SfTreeView = this;
            this.touchClickObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    proxy.clickHandler(e);
                }
            });
        } else {
            if (this.touchClickObj) {
                this.touchClickObj.destroy();
            }
        }
    }

    private onMouseOver(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        let classList: DOMTokenList = target.classList;
        let currentLi: Element = closest(target, '.' + LISTITEM);
        if (!currentLi || classList.contains(PARENTITEM) || classList.contains(LISTITEM)) {
            this.removeHover();
            return;
        } else {
            if (currentLi && !currentLi.classList.contains(DISABLE)) {
                this.setHover(currentLi);
            }
        }
    }

    private setHover(li: Element): void {
        if (!li.classList.contains(HOVER)) {
            this.removeHover();
            addClass([li], HOVER);
        }
    }

    private removeHover(): void {
        let hoveredNode: Element[] = selectAll('.' + HOVER, this.element);
        if (hoveredNode && hoveredNode.length) {
            removeClass(hoveredNode, HOVER);
        }
    }

    private checkNode(e: KeyboardEventArgs): void {
        let focusedNode: Element = this.getFocusedNode();
        let checkWrap: Element = select('.' + CHECKBOXWRAP, focusedNode);
        let isChecked: boolean = select(' .' + CHECKBOXFRAME, checkWrap).classList.contains(CHECK);
        if (!focusedNode.classList.contains(DISABLE)) {
            if (focusedNode.getElementsByClassName('e-checkbox-disabled').length === 0) {
                this.validateCheckNode(checkWrap, isChecked, focusedNode, e);
            }
        }
    }
    private openNode(toBeOpened: boolean, e: KeyboardEventArgs): void {
        let focusedNode: Element = this.getFocusedNode();
        let icon: Element = select('div.' + ICON, focusedNode);
        if (toBeOpened) {
            if (!icon) {
                return;
            } else if (icon.classList.contains(EXPANDABLE)) {
                this.expandAction(focusedNode, e);
            } else {
                this.focusNextNode(focusedNode, true);
            }
        } else {
            if (icon && icon.classList.contains(COLLAPSIBLE)) {
                this.collapseAction(focusedNode, e);
            } else {
                let parentLi: Element = closest(closest(focusedNode, '.' + PARENTITEM), '.' + LISTITEM);
                if (!parentLi) {
                    return;
                } else {
                    if (!parentLi.classList.contains(DISABLE)) {
                        this.setNodeFocus(focusedNode, parentLi);
                        this.navigateToFocus(true);
                    }
                }
            }
        }
    }
    private getScrollParent(node: Element): Element {
        if (isNOU(node)) {
            return null;
        }
        return (node.scrollHeight > node.clientHeight) ? node : this.getScrollParent(node.parentElement);
    }
    private navigateToFocus(isUp: boolean): void {
        let focusNode: Element = this.getFocusedNode().querySelector('.' + TEXTWRAP);
        let pos: ClientRect = focusNode.getBoundingClientRect();
        let parent: Element = this.getScrollParent(this.element);
        if (!isNOU(parent)) {
            let parentPos: ClientRect = parent.getBoundingClientRect();
            if (pos.bottom > parentPos.bottom) {
                parent.scrollTop += pos.bottom - parentPos.bottom;
            } else if (pos.top < parentPos.top) {
                parent.scrollTop -= parentPos.top - pos.top;
            }
        }
        let isVisible: boolean = this.isVisibleInViewport(focusNode);
        if (!isVisible) {
            focusNode.scrollIntoView(isUp);
        }
    }
    private isVisibleInViewport(txtWrap: Element): boolean {
        let pos: ClientRect = txtWrap.getBoundingClientRect();
        return (pos.top >= 0 && pos.left >= 0 && pos.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        pos.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
    private setNodeFocus(preNode: Element, nextNode: Element): void {
        removeClass([preNode], [HOVER, FOCUS]);
        if (!nextNode.classList.contains(DISABLE)) {
            this.focussedElement = nextNode;
            addClass([nextNode], [HOVER, FOCUS]);
            this.updateIdAttr(preNode, nextNode);
        }
    }
    private focusNextNode(li: Element, isTowards: boolean): void {
        let nextNode: Element = isTowards ? this.getNextNode(li) : this.getPrevNode(li);
        this.setNodeFocus(li, nextNode);
        this.navigateToFocus(!isTowards);
        if (nextNode.classList.contains(DISABLE)) {
            let lastChild: HTMLElement  = nextNode.lastChild as HTMLElement;
            if (nextNode.previousSibling == null && nextNode.classList.contains('e-level-1')) {
                this.focusNextNode(nextNode, true);
            } else if (nextNode.nextSibling == null && nextNode.classList.contains('e-node-collapsed')) {
                this.focusNextNode(nextNode, false);
            } else if (nextNode.nextSibling == null && lastChild.classList.contains(TEXTWRAP)) {
                this.focusNextNode(nextNode, false);
            } else {
                this.focusNextNode(nextNode, isTowards);
            }
        }
    }
    private shiftKeySelect(isTowards: boolean, e: KeyboardEventArgs): void {
        if (this.allowMultiSelection) {
            let focusedNode: Element = this.getFocusedNode();
            let nextNode: Element = isTowards ? this.getNextNode(focusedNode) : this.getPrevNode(focusedNode);
            this.removeHover();
            this.setFocusElement(nextNode);
            this.focussedElement = nextNode;
            this.toggleSelect(nextNode, e, false);
            this.navigateToFocus(!isTowards);
        } else {
            this.navigateNode(isTowards);
        }
    }
    private updateList(): void {
        this.liList = Array.prototype.slice.call(selectAll('.' + LISTITEM, this.element));
    }
    private getNextNode(li: Element): Element {
        let index: number = this.liList.indexOf(<HTMLElement>li);
        let nextNode: Element;
        do {
            index++;
            nextNode = this.liList[index];
            if (isNOU(nextNode)) {
                return li;
            }
        }
        while (!isVisible(nextNode));
        return nextNode;
    }

    private getPrevNode(li: Element): Element {
        let index: number = this.liList.indexOf(<HTMLElement>li);
        let prevNode: Element;
        do {
            index--;
            prevNode = this.liList[index];
            if (isNOU(prevNode)) {
                return li;
            }
        }
        while (!isVisible(prevNode));
        return prevNode;
    }

    private getRootNode(): Element {
        let index: number = 0;
        let rootNode: Element;
        do {
            rootNode = this.liList[index];
            index++;
        }
        while (!isVisible(rootNode));
        return rootNode;
    }

    private getEndNode(): Element {
        let index: number = this.liList.length - 1;
        let endNode: Element;
        do {
            endNode = this.liList[index];
            index--;
        }
        while (!isVisible(endNode));
        return endNode;
    }
    private navigateNode(isTowards: boolean): void {
        this.focusNextNode(this.getFocusedNode(), isTowards);
    }
    public onPropertyChanged(newProp: ITreeViewOptions): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case SHOWCHECKBOX:
                    this.options.showCheckBox = newProp.showCheckBox;
                    break;
                case ALLOWDRAGANDDROP:
                    this.setDragAndDrop(newProp.allowDragAndDrop);
                    break;
                case ALLOWEDITING:
                    this.wireEditingEvents(newProp.allowEditing);
                    break;
                case SETDISABLED:
                    this.setDisabledMode(newProp.disabled);
                    break;
                case DRAGAREA:
                    this.setDragArea(newProp.dropArea);
                    break;
                case CSSCLASS:
                    this.setCssClass(newProp.cssClass);
                    break;
                case FULLROWSELECT:
                    this.setFullRow(newProp.fullRowSelect);
                    break;
                case EXPANDONTYPE:
                    this.options.expandOnType = newProp.expandOnType;
                    break;
                case ENABLERTL:
                    this.options.enableRtl = newProp.enableRtl;
                    this.setEnableRtl();
                    break;
                case ANIMATION:
                    this.options.animation = newProp.animation;
            }
        }
    }
    private navigateRootNode(isBackwards: boolean): void {
        let focusedNode: Element = this.getFocusedNode();
        let rootNode: Element = isBackwards ? this.getRootNode() : this.getEndNode();
        if (!rootNode.classList.contains(DISABLE)) {
            this.setNodeFocus(focusedNode, rootNode);
            this.navigateToFocus(isBackwards);
        }
    }

    private selectGivenNodes(sNodes: HTMLElement[]): void {
        for (let i: number = 0; i < sNodes.length; i++) {
            if (!sNodes[i].classList.contains(DISABLE)) {
                this.selectNode(sNodes[i], null, true);
            }
        }
    }

    public beginEdit(node: string): void {
        let nodeElement: Element = this.element.querySelector('[data-uid="' + node + '"]');
        if (isNOU(nodeElement) || this.options.disabled) {
            return;
        }
        this.createTextbox(nodeElement, null);
    }

    public ensureVisible(node: string): void {
        let liEle: Element = this.element.querySelector('[data-uid="' + node + '"]');
        if (isNOU(liEle)) {
            return;
        }
        let parents: Element[] = this.parents(liEle, '.' + LISTITEM);
        let parentNodeId: string[] = [];
        for (let i: number = 0; i < parents.length; i++) {
            parentNodeId.push(parents[i].getAttribute('data-uid'));
        }
        this.dotNetRef.invokeMethodAsync('UpdateExpandedNode', parentNodeId);
        setTimeout(() => { liEle.scrollIntoView(true); }, 450);
    }

    public nodeCollapse(id: string): void {
        let liElement: Element = this.element.querySelector('[data-uid="' + id + '"]');
        this.collapseAction(liElement, null);
    }

    public nodeExpand(id: string): void {
        let liElement: Element = this.element.querySelector('[data-uid="' + id + '"]');
        this.expandAction(liElement, null);
    }
    
    public KeyActionHandler(e: KeyboardEventArgs, nodeId: string): void {
        this.updateList();
        let focusedNode: Element;
        let nodeElement : Element = this.element.querySelector('[data-uid="' + nodeId + '"]');
        focusedNode = isNOU(nodeElement) ? this.getFocusedNode() : nodeElement;
        switch (this.keyAction.action) {
            case 'space':
                if (this.options.showCheckBox) {
                    this.checkNode(this.keyAction);
                }
                break;
            case 'moveRight':
                this.openNode(!this.options.enableRtl, this.keyAction);
                break;
            case 'moveLeft':
                this.openNode(this.options.enableRtl, this.keyAction);
                break;
            case 'shiftDown':
                this.shiftKeySelect(true, this.keyAction);
                break;
            case 'moveDown':
            case 'ctrlDown':
            case 'csDown':
                this.navigateNode(true);
                break;
            case 'shiftUp':
                this.shiftKeySelect(false, this.keyAction);
                break;
            case 'moveUp':
            case 'ctrlUp':
            case 'csUp':
                this.navigateNode(false);
                break;
            case 'home':
            case 'shiftHome':
            case 'ctrlHome':
            case 'csHome':
                this.navigateRootNode(true);
                break;
            case 'end':
            case 'shiftEnd':
            case 'ctrlEnd':
            case 'csEnd':
                this.navigateRootNode(false);
                break;
            case 'enter':
            case 'ctrlEnter':
            case 'shiftEnter':
            case 'csEnter':
                this.toggleSelect(focusedNode, this.keyAction, false);
                break;
            case 'f2':
                if (this.options.allowEditing && !focusedNode.classList.contains(DISABLE)) {
                    this.createTextbox(focusedNode, this.keyAction);
                }
                break;
            case 'ctrlA':
                if (this.allowMultiSelection) {
                    let sNodes: HTMLElement[] = selectAll('.' + LISTITEM + ':not(.' + ACTIVE + ')', this.element);
                    this.selectGivenNodes(sNodes);
                }
                break;
        }
    }
}

export type createElementParams = (
    tag: string,
    prop?: { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }
) => HTMLElement;

export interface NodeEditEventArgs {
    newText: string;
    nodeData: { [key: string]: Object };
    oldText: string;
    innerHtml: string;
}
export interface NodeClickEventArgs {
    event: MouseEvent;
    node: HTMLElement;
}
export interface NodeKeyPressEventArgs {
    cancel: boolean;
    event: KeyboardEventArgs;
}
export interface NodeSelectEventArgs {
    action: string;
    isInteracted: boolean;
    nodeData: { [key: string]: Object };
}

export interface NodeExpandEventArgs {
    isInteracted: boolean;
    nodeData: { [key: string]: Object };
    event: MouseEvent | KeyboardEventArgs | TapEventArgs;
}
export interface NodeCheckEventArgs {
    action: string;
    isInteracted: boolean;
    nodeData: { [key: string]: Object };
}

export interface DragAndDropEventArgs {
    cancel: boolean;
    event: MouseEvent & TouchEvent;
    clonedNode: HTMLElement;
    draggedNode: HTMLLIElement;
    draggedNodeData: { [key: string]: Object };
    draggedParentNode: Element;
    dropTarget: Element;
    dropIndex: number;
    dropLevel: number;
    droppedNode: HTMLLIElement;
    dropIndicator: string;
    droppedNodeData: { [key: string]: Object };
    target: HTMLElement;
    preventTargetExpand?: boolean;
}

class ActionSettings {
    public effect: Effect;
    public duration: number;
    public easing: string;
}
class NodeAnimationSettings {
    public collapse: ActionSettings;
    public expand: ActionSettings;
}

class FieldsSettingsModel {
    public child: string | FieldsSettingsModel;
    public children: string | FieldsSettingsModel;
    public dataSource: { [key: string]: Object }[];
    public expanded: string;
    public hasChildren: string;
    public htmlAttributes: string;
    public iconCss: string;
    public id: string;
    public imageUrl: string;
    public isChecked: string;
    public parentID: string;
    public selected: string;
    public tableName: string;
    public text: string;
    public tooltip: string;
    public navigateUrl: string;
}

interface ITreeViewOptions {
    enableRtl: boolean;
    expandOnType: string;
    animation: NodeAnimationSettings;
    fields: FieldsSettingsModel;
    allowMultiSelection: boolean;
    showCheckBox: boolean;
    allowEditing: boolean;
    disabled: boolean;
    dropArea: string;
    allowDragAndDrop: boolean;
    fullRowSelect: boolean;
    cssClass: string;
}

interface BlazorTreeViewElement extends HTMLElement {
    blazor__instance: SfTreeView;
}

let TreeView: object = {
    initialize(element: BlazorTreeViewElement, options: ITreeViewOptions, dotnetRef: BlazorDotnetObject): void {
        let instance: SfTreeView = new SfTreeView(element, options, dotnetRef);
        instance.render();
        instance.dotNetRef.invokeMethodAsync('CreatedEvent', null);
    },
    dataSourceChanged(element: BlazorTreeViewElement): void {
        element.blazor__instance.unWireEvents();
        element.blazor__instance.wireEvents();
    },
    collapseAction(element: BlazorTreeViewElement, nodeId: string): void {
        if (this.valid(element)) {
            let currentLi = element.querySelector('[data-uid="' + nodeId + '"]');
            element.blazor__instance.collapseAction(currentLi, null);
        }
    },
    expandAction(element: BlazorTreeViewElement, nodeId: string): void {
        if (this.valid(element)) {
            let currentLi = element.querySelector('[data-uid="' + nodeId + '"]');
            element.blazor__instance.expandAction(currentLi, null);
        }
    },
    expandedNode(element: BlazorTreeViewElement, args: NodeExpandEventArgs): void {
        if (this.valid(element)) {
            element.blazor__instance.expandedNode(args);
        }
    },
    collapsedNode(element: BlazorTreeViewElement, args: NodeExpandEventArgs): void {
        if (this.valid(element)) {
            element.blazor__instance.collapsedNode(args);
        }
    },
    selectedNode(element: BlazorTreeViewElement, args: string): void {
        if (this.valid(element)) {
            element.blazor__instance.selectedNode(args);
        }
    },
    KeyActionHandler(element: BlazorTreeViewElement, args: KeyboardEventArgs, nodeId: string): void {
        if (this.valid(element)) {
            element.blazor__instance.KeyActionHandler(args, nodeId);
        }
    },
    setMultiSelect(element: BlazorTreeViewElement, args: boolean): void {
        if (this.valid(element)) {
            element.blazor__instance.setMultiSelect(args);
        }
    },
    dragStartActionContinue: function dragStartActionContinue(element: BlazorTreeViewElement): void {
        if (this.valid(element)) {
            element.blazor__instance.dragStartActionContinue();
        }
    },
    dragNodeStop: function dragNodeStop(element: BlazorTreeViewElement, args: DragAndDropEventArgs): void {
        if (this.valid(element)) {
            element.blazor__instance.dragNodeStop(args);
        }
    },
    nodeDragging: function nodeDragging(element: BlazorTreeViewElement, args: DragAndDropEventArgs ): void {
        if (this.valid(element)) {
            element.blazor__instance.nodeDragging(args);
        }
    },
    setFocus: function setFocus(element: HTMLElement, liElement: HTMLElement): void {
        if (!isNOU(element) && !isNOU(liElement)) {
            let inputEle: HTMLInputElement = <HTMLInputElement>(document.getElementById(element.id));
            inputEle.focus();
            inputEle.setSelectionRange(0, inputEle.value.length);
        }
    },
    onPropertyChanged: function onPropertyChanged(element: BlazorTreeViewElement, properties: ITreeViewOptions): void {
        if (this.valid(element)) {
            element.blazor__instance.onPropertyChanged(properties);
        }
    },
    valid(element: BlazorTreeViewElement): object {
        return (element && element.blazor__instance);
    },
    beginEdit: function beginEdit(element: BlazorTreeViewElement, node: string): void {
        if (this.valid(element)) {
            element.blazor__instance.beginEdit(node);
        }
    },
    ensureVisible: function ensureVisible(element: BlazorTreeViewElement, node: string): void {
        if (this.valid(element)) {
            element.blazor__instance.ensureVisible(node);
        }
    },
    nodeCollapse: function nodeCollapse(element: BlazorTreeViewElement, id: string) {
        if (this.valid(element)) {
            element.blazor__instance.nodeCollapse(id);
        }
    },
    nodeExpand: function nodeCollapse(element:BlazorTreeViewElement, id:string) {
        if (this.valid(element)) {
            element.blazor__instance.nodeExpand(id);
        }
    }
};
export default TreeView;