import { append, selectAll, closest, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { addClass, removeClass, Browser, setStyleAttribute } from '@syncfusion/ej2-base';
import { Popup, isCollide } from '@syncfusion/ej2-popups';
import * as constant from '../constant';
import * as classes from '../classes';
import { IToolbarStatus } from '../../src';
import { ISetToolbarStatusArgs } from '../interfaces';
import { isIDevice, setToolbarStatus } from '../util';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { PopupRenderer } from '../renderer/popup-renderer';
import { IShowQuickTBarOptions } from '../../src/rich-text-editor/base/interface';
import { BeforeQuickToolbarOpenArgs } from '../../src/rich-text-editor/base/interface';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class BaseQuickToolbar {
    public popupObj: Popup;
    public element: HTMLElement;
    private isDOMElement: boolean;
    private parent: SfRichTextEditor;
    public toolbarElement: HTMLElement;
    private popupRenderer: PopupRenderer;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.isDOMElement = false;
        this.popupRenderer = new PopupRenderer(parent);
    }
    public render(element: HTMLElement, type: string): void {
        this.element = element;
        this.popupRenderer.renderPopup(this, type);
        this.addEventListener();
    }
    private setPosition(e: IShowQuickTBarOptions): void {
        let x: number;
        let y: number;
        let imgContainer: HTMLElement = <HTMLElement>closest(e.target, '.' + classes.CLS_CAPTION);
        let target: HTMLElement = !isNOU(imgContainer) ? imgContainer : e.target;
        let targetOffsetTop: number = target.offsetTop;
        let parentOffsetTop: number = window.pageYOffset + e.parentData.top;
        if ((targetOffsetTop - e.editTop) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) - e.popHeight - 5;
        } else if (((e.editTop + e.editHeight) - (targetOffsetTop + target.offsetHeight)) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) + target.offsetHeight + 5;
        } else {
            y = e.y;
        }
        if (target.offsetWidth > e.popWidth) {
            x = (target.offsetWidth / 2) - (e.popWidth / 2) + e.parentData.left + target.offsetLeft;
        } else {
            x = e.parentData.left + target.offsetLeft;
        }
        this.popupObj.position.X = ((x + e.popWidth) > e.parentData.right) ? e.parentData.right - e.popWidth : x;
        this.popupObj.position.Y = (y >= 0) ? y : e.y + 5;
        this.popupObj.dataBind();
    }
    private checkCollision(e: IShowQuickTBarOptions, viewPort: string, type: string): void {
        let x: number;
        let y: number;
        let parentTop: number = e.parentData.top;
        let contentTop: number = e.windowY + parentTop + e.tBarElementHeight;
        let collision: string[] = [];
        if (viewPort === 'document') {
            collision = isCollide(e.popup);
        } else {
            collision = isCollide(e.popup, e.parentElement);
        }
        for (let i: number = 0; i < collision.length; i++) {
            switch (collision[i]) {
                case 'top':
                    if (viewPort === 'document') {
                        y = e.windowY;
                    } else {
                        y = (window.pageYOffset + parentTop) + e.tBarElementHeight;
                    }
                    break;
                case 'bottom':
                    let posY: number;
                    if (viewPort === 'document') {
                        if (type === 'inline') {
                            posY = (e.y - e.popHeight - 10);
                        } else {
                            if ((e.windowHeight - (parentTop + e.tBarElementHeight)) > e.popHeight) {
                                if ((contentTop - e.windowHeight) > e.popHeight) {
                                    posY = (contentTop + (e.windowHeight - parentTop)) - e.popHeight;
                                } else {
                                    posY = contentTop;
                                }
                            } else {
                                posY = e.windowY + (parentTop + e.tBarElementHeight);
                            }
                        }
                    } else {
                        if (e.target.tagName !== 'IMG') {
                            posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 10;
                        } else {
                            posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 5;
                        }
                    }
                    y = posY;
                    break;
                case 'right':
                    if (type === 'inline') {
                        x = e.windowWidth - (e.popWidth + e.bodyRightSpace + 10);
                    } else {
                        x = e.x - e.popWidth;
                    }
                    break;
                case 'left':
                    if (type === 'inline') {
                        x = 0;
                    } else {
                        x = e.parentData.left;
                    }
                    break;
            }
        }
        this.popupObj.position.X = (x) ? x : this.popupObj.position.X;
        this.popupObj.position.Y = (y) ? y : this.popupObj.position.Y;
        this.popupObj.dataBind();
    }
    public showPopup(x: number, y: number, target: Element, type: string): void {
        if (this.parent.onQuickTbOpenEnabled) {
            // @ts-ignore-start
            this.parent.dotNetRef.invokeMethodAsync(constant.beforeQuickToolbarOpenEvent).then((args: BeforeQuickToolbarOpenArgs) => {
                // @ts-ignore-end
                if (!args.cancel) { this.onQuickTbOpenCallback(x, y, target, type); }
            });
        } else {
            this.onQuickTbOpenCallback(x, y, target, type);
        }
    }
    private onQuickTbOpenCallback(x: number, y: number, target: Element, type: string): void {
        let editPanelTop: number;
        let editPanelHeight: number;
        let bodyStyle: CSSStyleDeclaration = window.getComputedStyle(document.body);
        let bodyRight: number = parseFloat(
            bodyStyle.marginRight.split('px')[0]) + parseFloat(bodyStyle.paddingRight.split('px')[0]
            );
        let windowHeight: number = window.innerHeight;
        let windowWidth: number = window.innerWidth;
        let parent: HTMLElement = this.parent.element;
        let toolbarAvail: boolean = !isNOU(this.parent.getToolbar());
        let tbHeight: number = toolbarAvail && this.parent.toolbarModule.getToolbarHeight();
        let expTBHeight: number = toolbarAvail && this.parent.toolbarModule.getExpandTBarPopHeight();
        let tBarHeight: number = (toolbarAvail) ? (tbHeight + expTBHeight) : 0;
        addClass([this.element], [classes.CLS_HIDE]);
        if (Browser.isDevice && !isIDevice()) {
            addClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (this.parent.iframeSettings.enable) {
            let cntEle: Window = (<HTMLIFrameElement>this.parent.getPanel()).contentWindow;
            editPanelTop = cntEle.pageYOffset;
            editPanelHeight = cntEle.innerHeight;
        } else {
            let cntEle: HTMLElement = <HTMLElement>closest(target, '.' + classes.CLS_RTE_CONTENT);
            editPanelTop = (cntEle) ? cntEle.scrollTop : 0;
            editPanelHeight = (cntEle) ? cntEle.offsetHeight : 0;
        }
        if (!this.parent.inlineMode.enable && !closest(target, 'table')) {
            // this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
            // this.parent.enableToolbarItem(['Undo', 'Redo']);
        }
        append([this.element], document.body);
        this.popupObj.position.X = x + 20;
        this.popupObj.position.Y = y + ((this.parent.iframeSettings.enable) ? 35 : 20);
        this.popupObj.dataBind();
        this.popupObj.element.classList.add(classes.CLS_POPUP_OPEN);
        let showPopupData: IShowQuickTBarOptions = {
            x: x, y: y,
            target: target as HTMLElement,
            editTop: editPanelTop,
            editHeight: editPanelHeight,
            popup: this.popupObj.element,
            popHeight: this.popupObj.element.offsetHeight,
            popWidth: this.popupObj.element.offsetWidth,
            parentElement: parent,
            bodyRightSpace: bodyRight,
            windowY: window.pageYOffset,
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            parentData: parent.getBoundingClientRect(),
            tBarElementHeight: tBarHeight
        };
        if (target.tagName === 'IMG') {
            this.setPosition(showPopupData);
        }
        if (!this.parent.inlineMode.enable) {
            this.checkCollision(showPopupData, 'parent', '');
        }
        this.checkCollision(showPopupData, 'document', ((this.parent.inlineMode.enable) ? 'inline' : ''));
        this.popupObj.element.classList.remove(classes.CLS_POPUP_OPEN);
        removeClass([this.element], [classes.CLS_HIDE]);
        this.popupObj.show({ name: 'ZoomIn', duration: (Browser.isIE ? 250 : 400) });
        setStyleAttribute(this.element, {
            maxWidth: this.parent.element.offsetWidth + 'px'
        });
        addClass([this.element], [classes.CLS_POP]);
        this.isDOMElement = true;
        this.parent.dotNetRef.invokeMethodAsync(constant.updateClass, this.popupObj.element.classList.toString(), type);
    }
    public hidePopup(): void {
        let viewSourcePanel: HTMLElement = <HTMLElement>this.parent.viewSourceModule.getViewPanel();
        if (Browser.isDevice && !isIDevice()) {
            removeClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (!isNOU(this.parent.getToolbar()) && !this.parent.inlineMode.enable) {
            if (isNOU(viewSourcePanel) || viewSourcePanel.style.display === 'none') {
                //this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
            }
        }
        this.removeEleFromDOM();
        this.isDOMElement = false;
    }
    private removeEleFromDOM(): void {
        this.popupObj.hide();
        this.element.classList.add(classes.CLS_HIDE);
        this.element.classList.add(classes.CLS_RTE_QUICK_POPUP_HIDE);
        if (this.isDOMElement) {
            removeClass([this.element], [classes.CLS_POP]);
            this.popupObj.element.removeAttribute('style');
            this.popupObj.destroy();
            if (this.parent.quickTbClosedEnabled) { this.parent.dotNetRef.invokeMethodAsync(constant.quickToolbarCloseEvent); }
        }
    }
    private updateStatus(args: IToolbarStatus): void {
        let tbElements: HTMLElement[] = selectAll('.' + classes.CLS_TB_ITEM, this.element);
        if (tbElements.length <= 0) { return; }
        let options: ISetToolbarStatusArgs = {
            args: args,
            dropDownModule: null,
            parent: this.parent,
            tbElements: tbElements,
            /* tslint:disable */
            tbItems: this.parent.toolbarSettings.items as any
            /* tslint:enable */
        };
        setToolbarStatus(options, true);
        // if (!select('.e-rte-srctextarea', this.parent.element)) {
        //     //updateUndoRedoStatus(this.parent.getBaseToolbarObject(),
        //           this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        // }
    }
    public addEventListener(): void {
        this.parent.observer.on(constant.destroy, this.destroy, this);
        if (this.parent.inlineMode.enable) {
            this.parent.observer.on(constant.toolbarUpdated, this.updateStatus, this);
        }
    }
    public removeEventListener(): void {
        this.parent.observer.off(constant.destroy, this.destroy);
        if (this.parent.inlineMode.enable) {
            this.parent.observer.off(constant.toolbarUpdated, this.updateStatus);
        }
    }
    public destroy(): void {
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            this.removeEleFromDOM();
        }
        this.removeEventListener();
    }
}