import { detach, getUniqueID, append, closest, selectAll, select, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { addClass, removeClass, Browser, isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { Popup, isCollide } from '@syncfusion/ej2-popups';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RenderType } from '../base/enum';
import { setToolbarStatus, updateUndoRedoStatus } from '../base/util';
import { IRichTextEditor, IToolbarRenderOptions, IDropDownRenderArgs, IToolbarItemModel, IColorPickerRenderArgs } from '../base/interface';
import { IToolbarItems, IRenderer, IQuickToolbarOptions, IShowQuickTBarOptions, ISetToolbarStatusArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { BaseToolbar } from './base-toolbar';
import { DropDownButtons } from './dropdown-buttons';
import { IToolbarStatus } from '../../common/interface';
import { ColorPickerInput } from './color-picker';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class BaseQuickToolbar {
    public popupObj: Popup;
    public element: HTMLElement;
    private isDOMElement: boolean;
    public quickTBarObj: BaseToolbar;
    private stringItems: (string | IToolbarItems)[];
    private dropDownButtons: DropDownButtons;
    private colorPickerObj: ColorPickerInput;
    private locator: ServiceLocator;
    private parent: IRichTextEditor;
    private contentRenderer: IRenderer;
    private popupRenderer: IRenderer;
    public toolbarElement: HTMLElement;
    private renderFactory: RendererFactory;

    constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.isDOMElement = false;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.popupRenderer = this.renderFactory.getRenderer(RenderType.Popup);
        this.dropDownButtons = new DropDownButtons(this.parent, this.locator);
        this.colorPickerObj = new ColorPickerInput(this.parent, this.locator);
    }

    private appendPopupContent(): void {
        this.toolbarElement = this.parent.createElement('div', { className: classes.CLS_QUICK_TB });
        this.element.appendChild(this.toolbarElement);
    }

    public render(args: IQuickToolbarOptions): void {
        let className: string;
        if (args.popupType === 'Image') {
            className = classes.CLS_IMAGE_POP;
        } else if (args.popupType === 'Inline') {
            className = classes.CLS_INLINE_POP;
        } else {
            className = '';
        }
        let popupId: string = getUniqueID(args.popupType + '_Quick_Popup');
        this.stringItems = args.toolbarItems;
        this.element = this.parent.createElement('div', { id: popupId, className: className + ' ' + classes.CLS_RTE_ELEMENTS });
        this.appendPopupContent();
        this.createToolbar(args.toolbarItems, args.mode);
        this.popupRenderer.renderPopup(this);
        this.addEventListener();
    }

    private createToolbar(items: (string | IToolbarItems)[], mode: OverflowMode): void {
        this.quickTBarObj = new BaseToolbar(this.parent, this.locator);
        this.quickTBarObj.render({
            container: 'quick',
            target: this.toolbarElement,
            items: items,
            mode: mode
        } as IToolbarRenderOptions);
        this.quickTBarObj.toolbarObj.refresh();
    }

    private setPosition(e: IShowQuickTBarOptions): void {
        let x: number;
        let y: number;
        let imgWrapper: HTMLElement = <HTMLElement>closest(e.target, '.e-img-caption');
        let target: HTMLElement = !isNOU(imgWrapper) ? imgWrapper : e.target;
        addClass([this.toolbarElement], [classes.CLS_RM_WHITE_SPACE]);
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
        this.popupObj.position.Y = y;
        this.popupObj.dataBind();
        removeClass([this.toolbarElement], [classes.CLS_RM_WHITE_SPACE]);
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
                        x = e.x - (e.popWidth + e.parentData.left);
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

    public showPopup(x: number, y: number, target: Element): void {
        let editPanelTop: number;
        let editPanelHeight: number;
        let bodyStyle: CSSStyleDeclaration = window.getComputedStyle(document.body);
        let bodyRight: number = parseFloat(bodyStyle.marginRight.split('px')[0]) + parseFloat(bodyStyle.paddingRight.split('px')[0]);
        let windowHeight: number = window.innerHeight;
        let windowWidth: number = window.innerWidth;
        let parent: HTMLElement = this.parent.element;
        let toolbarAvail: boolean = !isNullOrUndefined(this.parent.getToolbar());
        let tbHeight: number = toolbarAvail && this.parent.toolbarModule.getToolbarHeight();
        let expTBHeight: number = toolbarAvail && this.parent.toolbarModule.getExpandTBarPopHeight();
        let tBarHeight: number = (toolbarAvail) ? (tbHeight + expTBHeight) : 0;
        addClass([this.element], [classes.CLS_HIDE]);
        if (Browser.isDevice) {
            addClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (this.parent.iframeSettings.enable) {
            let cntEle: Window = (<HTMLIFrameElement>this.contentRenderer.getPanel()).contentWindow;
            editPanelTop = cntEle.pageYOffset;
            editPanelHeight = cntEle.innerHeight;
        } else {
            let cntEle: HTMLElement = <HTMLElement>closest(target, '.' + classes.CLS_RTE_CONTENT);
            editPanelTop = (cntEle) ? cntEle.scrollTop : 0;
            editPanelHeight = (cntEle) ? cntEle.offsetHeight : 0;
        }
        if (!this.parent.inlineMode.enable && !closest(target, 'table')) {
            this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
            this.parent.enableToolbarItem(['Undo', 'Redo']);
        }
        append([this.element], document.body);
        this.popupObj.position.X = x + 20;
        this.popupObj.position.Y = y + ((this.parent.iframeSettings.enable) ? 35 : 20);
        this.popupObj.dataBind();
        this.popupObj.show();
        this.dropDownButtons.renderDropDowns({
            container: this.toolbarElement,
            containerType: 'quick',
            items: this.stringItems
        } as IDropDownRenderArgs);
        this.colorPickerObj.renderColorPickerInput({
            container: this.toolbarElement,
            containerType: 'quick',
            items: this.stringItems
        } as IColorPickerRenderArgs);
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
        this.popupObj.hide();
        removeClass([this.element], [classes.CLS_HIDE]);
        this.popupObj.show({ name: 'ZoomIn', duration: 400 });
        setStyleAttribute(this.element, {
            maxWidth: this.parent.element.offsetWidth + 'px'
        });
        addClass([this.element], [classes.CLS_POP]);
        this.isDOMElement = true;
    }

    public hidePopup(): void {
        let viewSourcePanel: HTMLElement = <HTMLElement>this.parent.sourceCodeModule.getViewPanel();
        if (Browser.isDevice) {
            removeClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (!isNullOrUndefined(this.parent.getToolbar()) && !this.parent.inlineMode.enable) {
            if (isNullOrUndefined(viewSourcePanel) || viewSourcePanel.style.display === 'none') {
                this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
            }
        }
        this.removeEleFromDOM();
        this.isDOMElement = false;
    }
    /** 
     * @hidden
     */
    public addQTBarItem(item: (string | IToolbarItems)[], index: number): void {
        this.quickTBarObj.toolbarObj.addItems((this.quickTBarObj.getItems(item, 'toolbar') as IToolbarItemModel[]), index);
    }
    /** 
     * @hidden
     */
    public removeQTBarItem(index: number | HTMLElement[] | Element[]): void {
        this.quickTBarObj.toolbarObj.removeItems(index as HTMLElement[] | number);
    }

    private removeEleFromDOM(): void {
        let element: Element = this.popupObj.element;
        if (this.isDOMElement) {
            this.dropDownButtons.destroyDropDowns();
            this.colorPickerObj.destroyColorPicker();
            removeClass([this.element], [classes.CLS_POP]);
            detach(element);
        }
    }

    private updateStatus(args: IToolbarStatus): void {
        let options: ISetToolbarStatusArgs = {
            args: args,
            dropDownModule: this.dropDownButtons,
            parent: this.parent,
            tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.element),
            tbItems: this.quickTBarObj.toolbarObj.items
        };
        setToolbarStatus(options, true);
        if (!select('.e-rte-srctextarea', this.parent.element)) {
            updateUndoRedoStatus(this.parent.getBaseToolbarObject(), this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    }

    /**
     * Destroys the Quick toolbar.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            this.removeEleFromDOM();
        }
        this.removeEventListener();
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.destroy, this.destroy, this);
        if (this.parent.inlineMode.enable) {
            this.parent.on(events.toolbarUpdated, this.updateStatus, this);
        }
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.destroy, this.destroy);
        if (this.parent.inlineMode.enable) {
            this.parent.off(events.toolbarUpdated, this.updateStatus);
        }
    }
}