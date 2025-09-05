import { selectAll, isNullOrUndefined as isNOU, isNullOrUndefined, EventHandler, closest, setStyleAttribute, addClass, append } from '../../../base'; /*externalscript*/
import { removeClass, Browser } from '../../../base'; /*externalscript*/
import { CollisionType, Popup, PopupModel } from '../../../popups/src'; /*externalscript*/
import * as constant from '../constant';
import * as classes from '../classes';
import { IToolbarStatus } from '../../editor-scripts/common/interface';
import { ISetToolbarStatusArgs } from '../interfaces';
import { setToolbarStatus } from '../util';
import { isIDevice } from '../../editor-scripts/common/util';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { QuickPopupRenderer } from '../renderer/quick-popup-renderer';
import { BeforeQuickToolbarOpenArgs } from '../../editor-scripts/common/interface';
import { IBaseQuickToolbar } from '../interfaces';
import { QuickToolbar } from './quick-toolbar';
import { QuickToolbarCollision, QuickToolbarType, SelectionDirection, TriggerType, TipPointerPosition } from '../../editor-scripts/common/types';
import { QuickToolbarOffsetParam } from '../../editor-scripts/common/interface';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class BaseQuickToolbar implements IBaseQuickToolbar {
    public popupObj: Popup;
    public element: HTMLElement;
    public isRendered: boolean;
    private parent: SfRichTextEditor;
    public toolbarElement: HTMLElement;
    private popupRenderer: QuickPopupRenderer;
    private escapeKeyPressed: boolean = false;
    /**
     * Specifies the Quick Toolbar type.
     */
    public type: QuickToolbarType;
    public popupWidth: number;
    public popupHeight: number;
    private tipPointerElem: HTMLElement;
    private currentTipPosition: TipPointerPosition;
    private tipPointerHeight: number;
    public previousTarget: HTMLElement;
    private toolbarHeight: number;

    constructor(type: QuickToolbarType, parent: SfRichTextEditor) {
        this.type = type;
        this.parent = parent;
        this.isRendered = false;
        this.popupRenderer = new QuickPopupRenderer(parent);
    }
    public render(element: HTMLElement): void {
        this.element = element;
        this.popupObj = this.popupRenderer.renderPopup(this.type, element);
        this.element = this.popupObj.element;
        this.tipPointerElem = this.element.querySelector('.e-rte-tip-pointer');
        this.addEventListener();
        this.tipPointerHeight = this.parent.userAgentData.isMobileDevice() ? 16 : 10;
    }

    /**
     * Show the Quick toolbar popup.
     *
     * @param {Element} target - The target element relative to which the Quick toolbar is opened.
     * @param {MouseEvent | KeyboardEvent} [originalEvent] - The original event causing the Quick toolbar to open.
     * @returns {void}
     */
    public showPopup(target: Element, originalEvent?: MouseEvent | KeyboardEvent): void {
        const selection: Selection = this.parent.formatter.editorManager.nodeSelection.get(this.parent.inputElement.ownerDocument);
        if (isNOU(selection) && selection.rangeCount < 0) {
            return;
        }
        addClass([this.element], [classes.CLS_HIDE]);
        if (this.parent.iframeSettings.enable) {
            append([this.element], this.parent.rootContainer.querySelector('.' +  classes.CLS_RTE_IFRAME_CONTENT));
        } else {
            append([this.element], this.parent.getPanel());
        }
        const relativeElem: HTMLElement = this.getRelativeElement(selection, target as HTMLElement);
        if (relativeElem === null) {
            return;
        }
        let iframeRect: DOMRect;
        if (this.parent.iframeSettings.enable) {
            iframeRect = this.parent.getPanel().getBoundingClientRect() as DOMRect;
        }
        const range: Range = selection.getRangeAt(0);
        const clientRects: DOMRectList = range.getClientRects() as DOMRectList;
        const direction: SelectionDirection = this.getSelectionDirection(selection);
        let triggerType: TriggerType = isNOU(originalEvent) ? 'none' : originalEvent.type as TriggerType;
        if (triggerType === 'mouseup' && originalEvent.detail && originalEvent.detail === 3) {
            triggerType = 'trippleclick';
        }
        const rangeDomRect: DOMRect = clientRects.length === 0 ? range.getBoundingClientRect() as DOMRect :
            direction === 'Backward' ? clientRects[0] : clientRects[clientRects.length - 1];
        const offsetCalculationParam: QuickToolbarOffsetParam = {
            blockElement: relativeElem,
            blockRect: relativeElem.getBoundingClientRect() as DOMRect,
            range: range,
            rangeRect: rangeDomRect,
            iframeRect: iframeRect,
            contentPanelElement: this.parent.getPanel() as HTMLElement,
            editPanelDomRect: this.parent.getEditPanel().getBoundingClientRect() as DOMRect,
            direction: direction,
            type: triggerType
        };
        if (this.element.style.maxWidth !== '75%') {
            setStyleAttribute(this.element, { maxWidth: '75%' });
        }
        this.popupWidth = this.getPopupDimension(this.popupObj, 'width');
        this.popupHeight = this.getPopupDimension(this.popupObj, 'height');
        this.toolbarHeight =  !isNullOrUndefined(this.parent.getToolbarElement()) ?
            this.parent.getToolbarElement().getBoundingClientRect().height : 0;
        const offsetX: number = this.calculateOffsetX(offsetCalculationParam);
        const offsetY: number = this.calculateOffsetY(offsetCalculationParam);
        let args: BeforeQuickToolbarOpenArgs = {
            cancel: false, targetElement: relativeElem,
            type: triggerType, positionX: offsetX, positionY: offsetY
        };
        args = this.handleVerticalCollision(offsetCalculationParam, args);
        this.setTipPointerPostion(this.currentTipPosition);
        if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Video') {
            if (this.currentTipPosition === 'Bottom-Center' || this.currentTipPosition === 'Bottom-Left' || this.currentTipPosition === 'Bottom-Right') {
                args.positionY = args.positionY - 2; // Tip should be above the Outline of the media elements.
            } else if (this.currentTipPosition === 'Top-Center' || this.currentTipPosition === 'Top-Left' || this.currentTipPosition === 'Top-Right') {
                args.positionY = args.positionY + 2; // Tip should be above the Outline of the media elements.
            }
        }
        if (this.parent.onQuickTbOpenEnabled && triggerType !== 'scroll') {
            (this.parent.dotNetRef.invokeMethodAsync(constant.beforeQuickToolbarOpenEvent) as unknown as
                Promise<BeforeQuickToolbarOpenArgs>).then((args: BeforeQuickToolbarOpenArgs) => {
                if (!args.cancel) {
                    this.openQuickToolbarPopup(args);
                }
            });
        } else {
            this.openQuickToolbarPopup(args);
        }
        this.previousTarget = target as HTMLElement;
        EventHandler.add(this.element, 'keyup', this.keyUpQT, this);
    }
    private openQuickToolbarPopup(args: BeforeQuickToolbarOpenArgs): void {
        const popupProps: PopupModel = {
            offsetX: args.positionX,
            offsetY: args.positionY,
            relateTo: args.targetElement as HTMLElement
        };
        this.popupObj.setProperties(popupProps);
        removeClass([this.element], [classes.CLS_HIDE, classes.CLS_POPUP_OPEN]);
        this.popupObj.show();
        this.isRendered = true;
        this.parent.dotNetRef.invokeMethodAsync(constant.updateClass, this.popupObj.element.classList.toString(), this.type);
    }
    public hidePopup(): void {
        const viewSourcePanel: HTMLElement = <HTMLElement>this.parent.viewSourceModule.getViewPanel();
        if (Browser.isDevice && !isIDevice()) {
            removeClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (!isNOU(this.parent.getToolbar()) && !this.parent.inlineMode.enable) {
            if (isNOU(viewSourcePanel) || viewSourcePanel.style.display === 'none') {
                //this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
            }
        }
        this.removeEleFromDOM();
        this.isRendered = false;
        EventHandler.remove(this.element, 'keyup', this.keyUpQT);
    }
    private removeEleFromDOM(): void {
        this.popupObj.hide();
        if (this.isRendered) {
            if (this.parent.quickTbClosedEnabled) {
                this.parent.dotNetRef.invokeMethodAsync(constant.quickToolbarCloseEvent);
            }
        }
    }
    private updateStatus(args: IToolbarStatus): void {
        if (!this.element.classList.contains(classes.CLS_INLINE_POP) && !this.element.classList.contains(classes.CLS_TEXT_POP)) { return; }
        let tbElements: HTMLElement[];
        let options: ISetToolbarStatusArgs;
        if (this.parent.inlineMode.enable && !this.parent.quickToolbarModule.textQTBar) {
            tbElements = selectAll('.' + classes.CLS_TB_ITEM, this.element);
            if (tbElements.length <= 0) { return; }
            options = {
                args: args,
                dropDownModule: null,
                parent: this.parent,
                tbElements: tbElements,
                /* eslint-disable */
                tbItems: this.parent.toolbarSettings.items as any
                /* eslint-enable */
            };
        }
        else if (!this.parent.inlineMode.enable && !isNOU(this.parent.quickToolbarModule.textQTBar)) {
            tbElements = selectAll('.' + classes.CLS_TB_ITEM, this.parent.quickToolbarModule.textQTBar.element);
            if (tbElements.length <= 0) { return; }
            options = {
                args: args,
                dropDownModule: null,
                parent: this.parent,
                tbElements: tbElements,
                /* eslint-disable */
                tbItems: this.parent.quickToolbarSettings.text as any
                /* eslint-enable */
            };
        }
        if (!isNullOrUndefined(options)) {
            setToolbarStatus(options, true);
        }
    }
    private keyUpQT(e: KeyboardEvent): void {
        if (e.which === 27 && !this.escapeKeyPressed) {
            this.parent.observer.notify(constant.focusChange, {});
        }
        this.escapeKeyPressed = false;
    }
    private preventQuickToolbarClose(args: QuickToolbar): void {
        if (args.linkQTBar) {
            args.linkQTBar.escapeKeyPressed = true;
        }
        if (args.imageQTBar) {
            args.imageQTBar.escapeKeyPressed = true;
        }
        if (args.audioQTBar) {
            args.audioQTBar.escapeKeyPressed = true;
        }
        if (args.videoQTBar) {
            args.videoQTBar.escapeKeyPressed = true;
        }
        if (args.tableQTBar) {
            args.tableQTBar.escapeKeyPressed = true;
        }
        if (args.inlineQTBar) {
            args.inlineQTBar.escapeKeyPressed = true;
        }
    }
    public addEventListener(): void {
        this.parent.observer.on(constant.destroy, this.destroy, this);
        if (this.parent.inlineMode.enable || this.parent.quickToolbarModule.textQTBar) {
            this.parent.observer.on(constant.toolbarUpdated, this.updateStatus, this);
        }
        this.parent.observer.on(constant.preventQuickToolbarClose, this.preventQuickToolbarClose, this);
    }
    public removeEventListener(): void {
        this.parent.observer.off(constant.destroy, this.destroy);
        if (this.parent.inlineMode.enable || this.parent.quickToolbarModule.textQTBar) {
            this.parent.observer.off(constant.toolbarUpdated, this.updateStatus);
        }
        this.parent.observer.off(constant.preventQuickToolbarClose, this.preventQuickToolbarClose);
    }
    public destroy(): void {
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            this.removeEleFromDOM();
            this.parent.element.append(this.element);
        }
        this.removeEventListener();
        this.previousTarget = null;
    }

    // To get the relative element of the popup of the quick toolbar.
    private getRelativeElement(selection: Selection, currentTarget: HTMLElement): HTMLElement {
        const focusNode: Node = selection.focusNode as Node;
        let blockElement: HTMLElement;
        switch (this.type) {
        case 'Inline':
        case 'Text':
            blockElement = this.parent.formatter.editorManager.domTree.isBlockNode(focusNode as HTMLElement) ? focusNode as HTMLElement :
                this.parent.formatter.editorManager.domTree.getParentBlockNode(focusNode);
            if (blockElement.nodeName === 'TD' || blockElement.nodeName === 'TH') {
                blockElement = closest(currentTarget, 'table') as HTMLElement;
            }
            break;
        case 'Link':
            blockElement = focusNode.nodeType === 3 ? focusNode.parentElement : focusNode as HTMLElement;
            blockElement = closest(blockElement, 'a') as HTMLElement;
            break;
        case 'Image':
        case 'Audio':
        case 'Video':
            blockElement = currentTarget;
            break;
        case 'Table':
            blockElement = closest(currentTarget, 'table') as HTMLElement;
            break;
        }
        return blockElement;
    }

    // To check whether the selection is top to bottom or bottom to top.
    private getSelectionDirection(selection: Selection): SelectionDirection {
        if (selection && selection.rangeCount > 0 && selection.getRangeAt(0).collapsed) {
            return 'Forward';
        }
        const range: Range = new Range();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.setEnd(selection.focusNode, selection.focusOffset);
        if (range.collapsed) {
            return 'Backward';
        } else {
            return 'Forward';
        }
    }

    private getPopupDimension(popup: Popup, type: 'width' | 'height'): number {
        const element: HTMLElement = popup.element;
        element.classList.remove(classes.CLS_POPUP_CLOSE);
        const dimension: number = type === 'width' ? element.clientWidth : element.clientHeight;
        element.classList.add(classes.CLS_POPUP_CLOSE);
        return dimension;
    }

    // To calculate the popup offsetX position based on the range and block element position.
    private calculateOffsetX(args: QuickToolbarOffsetParam): number {
        const width: number = this.popupWidth;
        const tipPointerOffset: number = 16.5; // Rounded width of the Tip pointer + left offset value. 8 + 8.5
        let finalX: number;
        switch (this.type) {
        case 'Text':
        case 'Inline': {
            const rangeEdge: number = args.direction === 'Backward' ? args.rangeRect.left : args.rangeRect.right;
            const relativePosition: number = this.parent.iframeSettings.enable === false ? rangeEdge - args.blockRect.left : rangeEdge;
            if (relativePosition < width / 4) {
                finalX = relativePosition - tipPointerOffset;
                this.currentTipPosition = 'Top-Left';
            } else if (relativePosition > width / 4 && relativePosition < width / 2) {
                finalX = relativePosition - width / 4;
                this.currentTipPosition = 'Top-LeftMiddle';
            } else if (relativePosition > width / 2 && relativePosition < (width * 3 / 4)) {
                finalX = relativePosition - width / 2;
                this.currentTipPosition = 'Top-Center';
            } else if (relativePosition > (width * 3 / 4) && relativePosition < width) {
                finalX = relativePosition - (width * 3 / 4);
                this.currentTipPosition = 'Top-RightMiddle';
            } else {
                finalX = relativePosition - width + tipPointerOffset;
                this.currentTipPosition = 'Top-Right';
            }
            break;
        }
        case 'Link':
        case 'Image':
        case 'Audio':
        case 'Video':
        case 'Table': {
            const availableLeft: number = args.blockRect.left - args.editPanelDomRect.left;
            const availableRight: number = args.editPanelDomRect.right - args.blockRect.right;
            if (args.blockRect.width > width || (availableLeft > width / 2 && availableRight > width / 2)) {
                finalX = args.blockRect.width / 2 - width / 2;
                if (this.type === 'Link') {
                    this.currentTipPosition = 'Top-Center';
                } else {
                    this.currentTipPosition = 'Bottom-Center';
                }
            } else if (availableRight < width / 2) {
                finalX = -(width - args.blockRect.width);
                if (this.type === 'Link') {
                    this.currentTipPosition = 'Top-Right';
                } else {
                    this.currentTipPosition = 'Bottom-Right';
                }
            } else if (availableLeft < width / 2) {
                finalX = 0;
                if (this.type === 'Link') {
                    this.currentTipPosition = 'Top-Left';
                } else {
                    this.currentTipPosition = 'Bottom-Left';
                }
            }
            if (this.parent.iframeSettings.enable) {
                finalX = finalX + args.blockRect.left;
            }
            break;
        }
        }
        return finalX;
    }

    // To calculate the popup offsetY position based on the range and block element position.
    private calculateOffsetY(args: QuickToolbarOffsetParam): number {
        let finalY: number;
        switch (this.type) {
        case 'Text':
        case 'Inline':
        case 'Link':
            if (this.parent.iframeSettings.enable) {
                finalY = args.rangeRect.bottom + this.tipPointerHeight;
            } else {
                finalY = args.rangeRect.bottom - args.blockRect.top + this.tipPointerHeight;
            }
            break;
        case 'Image':
        case 'Audio':
        case 'Video':
        case 'Table': {
            if (this.parent.iframeSettings.enable) {
                finalY = -100;
            } else {
                finalY = - (this.popupHeight + this.tipPointerHeight);
            }
            break;
        }
        }
        return finalY;
    }

    // To update the tip pointer position on the element.
    private setTipPointerPostion(type: TipPointerPosition): void {
        this.tipPointerElem.className = '';
        this.tipPointerElem.classList.add(classes.CLS_QUICK_TBAR_TIP_POINTER);
        if (type === 'None') {
            return;
        }
        const typeArray: string[] = type.split('-');
        const verticalPosition: string = typeArray[0];
        const horizontalPosition: string = typeArray[1];
        this.tipPointerElem.classList.add('e-rte-tip-' + verticalPosition.toLowerCase());
        this.tipPointerElem.classList.add('e-rte-tip-' + horizontalPosition.toLowerCase());
    }

    private handleVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs): BeforeQuickToolbarOpenArgs {
        if (this.parent.iframeSettings.enable) {
            if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Table' || this.type === 'Video') {
                args = this.handleIFrameMediaCollision(offsetParams, args);
            } else {
                args = this.handleIFrameTextVerticalCollision(offsetParams, args);
            }
            args.targetElement = this.parent.getPanel().parentElement;
        } else {
            if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Table' || this.type === 'Video') {
                args = this.handleMediaVerticalCollision(offsetParams, args);
            } else {
                args = this.handleTextVerticalCollision(offsetParams, args);
            }
        }
        return args;
    }

    // In this method we change the popup properties to position the popup on top, bottom of the target element also achieve sticky collision using the 'fit' collision type.
    private handleMediaVerticalCollision(offsetParams: QuickToolbarOffsetParam
        , args: BeforeQuickToolbarOpenArgs): BeforeQuickToolbarOpenArgs {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = offsetParams.blockRect;
        const toolbarRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const isBottomToolbar: boolean = this.parent.toolbarSettings.position === 'Bottom';
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const isFloatingTop: boolean = isFloating && this.parent.toolbarSettings.position === 'Top';
        const isFloatingBot: boolean = isFloating && this.parent.toolbarSettings.position === 'Bottom';
        const parentRect: DOMRect = offsetParams.editPanelDomRect as DOMRect;
        const spaceAbove: number = this.getSpaceAbove(
            offsetParams, isFloatingTop, toolbarRect, scrollParentRect);
        const spaceBelow: number = this.getSpaceBelow(
            offsetParams, isFloatingBot, toolbarRect, scrollParentRect);
        let yPosition: string;
        let yCollision: CollisionType;
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top', false) && spaceAbove > totalPopupHeight;
        const isBotPosition: boolean = this.isElemVisible(blockRect, 'bottom', false) && spaceBelow > totalPopupHeight;
        if (isTopPosition) {
            yPosition = 'top';
            yCollision = 'flip';
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
            args.positionY = -(this.popupHeight + this.tipPointerHeight);
        } else if (isBotPosition) {
            yPosition = 'bottom';
            yCollision = 'flip';
            this.currentTipPosition = this.currentTipPosition.replace('Bottom', 'Top') as TipPointerPosition;
            args.positionY = this.tipPointerHeight;
        } else if ((spaceAbove < totalPopupHeight && spaceBelow < totalPopupHeight)) {
            yPosition = 'top';
            yCollision = 'fit';
            const withToolbarHeight: number = -(blockRect.top) + toolbarRect.bottom; // WHen floating Main toolbar will hide the quick toolbar so need to add the main toolbar height.
            const withOutToolbarHeight: number = scrollTopParentElement === this.parent.inputElement ?
                -(blockRect.top) : (-blockRect.top) + parentRect.top; // When there is no floating Main toolbar wont hide the quick toolbar so no need to add main toolbar height.
            if (isBottomToolbar) {
                args.positionY = withOutToolbarHeight;
            } else {
                if (isFloating) {
                    if (toolbarRect.top < 0) { // When the Toolbar is hidden beyond a viewport inside a scrollable container with overflow auto and static height.
                        args.positionY = -blockRect.top;
                    } else {
                        args.positionY = withToolbarHeight;
                    }
                } else {
                    if (scrollTopParentElement === this.parent.inputElement) {
                        args.positionY = withOutToolbarHeight;
                    } else {
                        if (parentRect.top < 0) { // WHen the Parent is hidden we need to calculate against the viewport.
                            args.positionY = -blockRect.top;
                        } else {
                            args.positionY = -(blockRect.top - scrollParentRect.top);
                        }
                    }
                }
            }
            this.currentTipPosition = 'None';
        }
        const newProps: PopupModel = {
            position: { Y: yPosition , X : this.popupObj.position.X },
            collision: { Y: yCollision , X : this.popupObj.collision.X }
        };
        this.popupObj.setProperties(newProps);
        this.popupObj.dataBind();
        return args;
    }

    private isElemVisible(elemRect: DOMRect, value: 'top' | 'bottom', isIFrame: boolean, iframeRect?: DOMRect): boolean {
        if (isIFrame) {
            const normalisedTop: number = iframeRect.top + elemRect.top;
            const normalisedBottom: number = iframeRect.top + elemRect.bottom;
            if (value === 'top') {
                return normalisedTop >= 0 && normalisedTop <= window.innerHeight;
            } else {
                return normalisedBottom <= window.innerHeight && normalisedBottom >= 0;
            }
        } else {
            if (value === 'top') {
                return elemRect.top >= 0 && elemRect.top <= window.innerHeight;
            } else {
                return elemRect.bottom <= window.innerHeight && elemRect.bottom >= 0;
            }
        }
    }

    private handleIFrameMediaCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs):
    BeforeQuickToolbarOpenArgs {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const toolbarElemRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const toolbarRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const isBottomToolbar: boolean = this.parent.toolbarSettings.position === 'Bottom';
        const blockRect: DOMRect = offsetParams.blockRect;
        const isFloatingTop: boolean = isFloating && this.parent.toolbarSettings.position === 'Top';
        const isFloatingBot: boolean = isFloating && this.parent.toolbarSettings.position === 'Bottom';
        const spaceAbove: number = this.getIFrameSpaceAbove(offsetParams, isFloatingTop, toolbarElemRect, scrollParentRect);
        const spaceBelow: number = this.getIFrameSpaceBelow(offsetParams, isFloatingBot, toolbarElemRect, scrollParentRect);
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        if (this.isElemVisible(blockRect, 'top', true, offsetParams.iframeRect) && spaceAbove > totalPopupHeight) {
            args.positionY = blockRect.top - totalPopupHeight;
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        } else if (this.isElemVisible(blockRect, 'bottom', true, offsetParams.iframeRect) && spaceBelow > totalPopupHeight){
            args.positionY = blockRect.bottom + (this.tipPointerHeight);
            this.currentTipPosition = this.currentTipPosition.replace('Bottom', 'Top') as TipPointerPosition;
        } else if ((spaceAbove < totalPopupHeight && spaceBelow < totalPopupHeight)) {
            const withToolbarHeight: number = - (offsetParams.iframeRect.top) + toolbarElemRect.bottom; // WHen floating Main toolbar will hide the quick toolbar so need to add the main toolbar height.
            const withOutToolbarHeight: number = scrollTopParentElement === this.parent.inputElement ?
                - (offsetParams.iframeRect.top) : - (offsetParams.iframeRect.top) + scrollParentRect.top; // When there is no floating Main toolbar wont hide the quick toolbar so no need to add main toolbar height.
            if (isBottomToolbar) {
                args.positionY = withOutToolbarHeight;
            } else {
                if (isFloating) {
                    if (toolbarRect.top < 0) { // When the Toolbar is hidden beyond a viewport inside a scrollable container with overflow auto and static height.
                        args.positionY = - (offsetParams.iframeRect.top);
                    } else {
                        args.positionY = withToolbarHeight;
                    }
                } else {
                    if (scrollTopParentElement === this.parent.inputElement) {
                        if (offsetParams.iframeRect.top < 0) {
                            args.positionY = withOutToolbarHeight;
                        } else {
                            args.positionY = withToolbarHeight;
                        }
                    } else {
                        if (offsetParams.iframeRect.top < 0) { // WHen the Parent is hidden we need to calculate against the viewport.
                            args.positionY = withOutToolbarHeight;
                        } else {
                            args.positionY = withToolbarHeight;
                        }
                    }
                }
            }
            this.currentTipPosition = 'None';
        }
        return args;
    }

    private getSpaceAbove(args: QuickToolbarOffsetParam, isFloatingTop: boolean
        , toolbarRect: DOMRect, scrollParentRect: DOMRect): number {
        let spaceAbove: number;
        const blockRect: DOMRect = args.blockRect;
        const parentRect: DOMRect = args.editPanelDomRect;
        const collision: QuickToolbarCollision = this.getTopCollisionType(blockRect, parentRect
            , isFloatingTop ? toolbarRect : scrollParentRect);
        if (isFloatingTop) {
            switch (collision) {
            case 'ParentElement':
            case 'ScrollableContainer':  // When the toolbar is floating at top.
                spaceAbove = blockRect.top - toolbarRect.top - toolbarRect.height;
                break;
            case 'ViewPort':
            case 'Hidden':
                spaceAbove = blockRect.top;
                break;
            }
        } else {
            switch (collision) {
            case 'ParentElement':
                spaceAbove = blockRect.top - parentRect.top;
                break;
            case 'ScrollableContainer':
                spaceAbove = scrollParentRect.top - parentRect.top;
                break;
            case 'ViewPort':
            case 'Hidden':
                spaceAbove = blockRect.top;
                break;
            }
        }
        return spaceAbove;
    }

    private getSpaceBelow(args: QuickToolbarOffsetParam, isFloatingBot: boolean, toolbarRect: DOMRect, scrollParentRect: DOMRect): number {
        let spaceBelow: number;
        const blockRect: DOMRect = args.blockRect;
        const parentRect: DOMRect = args.editPanelDomRect;
        const collision: QuickToolbarCollision = this.getBottomCollisionType(blockRect, parentRect, isFloatingBot
            ? toolbarRect : scrollParentRect);
        if (isFloatingBot) {
            switch (collision) {
            case 'Hidden':
            case 'ParentElement':
            case 'ScrollableContainer':
                spaceBelow = parentRect.bottom - blockRect.bottom - toolbarRect.height;
                break;
            case 'ViewPort':
                spaceBelow = blockRect.bottom;
                break;
            }
        } else {
            switch (collision) {
            case 'Hidden':
            case 'ParentElement':
                spaceBelow = parentRect.bottom - blockRect.bottom;
                break;
            case 'ScrollableContainer':
                spaceBelow = scrollParentRect.bottom - blockRect.bottom;
                break;
            case 'ViewPort':
                spaceBelow = window.innerHeight - blockRect.bottom;
                break;
            }
        }
        const toolbarHeight: number = isFloatingBot ? this.toolbarHeight : 0;
        if ((window.innerHeight - blockRect.bottom - toolbarHeight) < (this.popupHeight + this.tipPointerHeight)) {
            spaceBelow = 0;
        }
        return spaceBelow;
    }

    private handleTextVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs)
        : BeforeQuickToolbarOpenArgs {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = offsetParams.blockRect;
        const toolbarRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const isFloatingTop: boolean = isFloating && this.parent.toolbarSettings.position === 'Top';
        const isFloatingBot: boolean = isFloating && this.parent.toolbarSettings.position === 'Bottom';
        const topViewPortSpace: number = blockRect.top;
        const botViewPortSpace: number = blockRect.bottom;
        const spaceAbove: number = this.getSpaceAbove(
            offsetParams, isFloatingTop, toolbarRect, scrollParentRect);
        const spaceBelow: number = this.getSpaceBelow(
            offsetParams, isFloatingBot, toolbarRect, scrollParentRect);
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top', false) && spaceAbove > totalPopupHeight && topViewPortSpace > totalPopupHeight;
        const isBotPosition: boolean = offsetParams.direction === 'Backward'  && isTopPosition ? false : this.isElemVisible(blockRect, 'bottom', false) && spaceBelow > totalPopupHeight && botViewPortSpace > totalPopupHeight;
        if (isBotPosition) {
            return args; // Default Bottom position no need to change offset.
        } else if (isTopPosition) {
            args.positionY = -(this.popupHeight + 10) + (offsetParams.rangeRect.top - offsetParams.blockRect.top);
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        }
        return args;
    }

    private handleIFrameTextVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs)
        : BeforeQuickToolbarOpenArgs {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const toolbarRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const isFloatingTop: boolean = isFloating && this.parent.toolbarSettings.position === 'Top';
        const isFloatingBot: boolean = isFloating && this.parent.toolbarSettings.position === 'Bottom';
        const spaceAbove: number = this.getIFrameSpaceAbove(offsetParams, isFloatingTop, toolbarRect, scrollParentRect);
        const spaceBelow: number = this.getIFrameSpaceBelow(offsetParams, isFloatingBot, toolbarRect, scrollParentRect);
        const blockRect: DOMRect = offsetParams.blockRect;
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top', true, offsetParams.iframeRect) && spaceAbove > totalPopupHeight;
        const isBotPosition: boolean = offsetParams.direction === 'Backward'  && isTopPosition ? false : this.isElemVisible(blockRect, 'bottom', true, offsetParams.iframeRect) && spaceBelow > totalPopupHeight;
        if (isBotPosition) {
            return args;
        } else if (isTopPosition){
            args.positionY = offsetParams.rangeRect.top - totalPopupHeight;
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        }
        return args;
    }

    private getTopCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect): QuickToolbarCollision{
        if (blockRect.top < 0 || blockRect.top >= window.innerHeight) {
            return 'Hidden';
        } else {
            if (parentRect.top > 0) {
                return 'ParentElement';
            } else {
                if (scrollParentRect.top < 0) {
                    return 'ViewPort';
                }
                if (scrollParentRect.top > 0) {
                    return 'ScrollableContainer';
                }
            }
        }
        return 'ParentElement';
    }

    private getBottomCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect): QuickToolbarCollision {
        if (blockRect.bottom < 0 || blockRect.bottom >= window.innerHeight) {
            return 'Hidden';
        } else {
            if (scrollParentRect.bottom >= window.innerHeight && parentRect.bottom >= window.innerHeight) {
                return 'ViewPort';
            } else {
                if (parentRect.bottom <= scrollParentRect.bottom) {
                    return 'ParentElement';
                } else {
                    return 'ScrollableContainer';
                }
            }
        }
    }

    private getIFrameSpaceAbove(args: QuickToolbarOffsetParam, isFloatingTop: boolean
        , toolbarRect: DOMRect, scrollParentRect: DOMRect): number {
        let spaceAbove: number;
        const blockRect: DOMRect = args.blockRect;
        const parentRect: DOMRect = args.editPanelDomRect;
        const isScrollParentElemInputElem: boolean = args.editPanelDomRect.top === scrollParentRect.top && args.editPanelDomRect.bottom
            === args.editPanelDomRect.bottom;
        if (isScrollParentElemInputElem) {
            scrollParentRect = args.editPanelDomRect;
        }
        const collision: QuickToolbarCollision = this.getIFrameTopCollisionType(blockRect, parentRect
            , isFloatingTop ? toolbarRect : scrollParentRect, args.iframeRect);
        if (isFloatingTop) {
            switch (collision) {
            case 'ParentElement':
            case 'ScrollableContainer':  // When the toolbar is floating at top.
                spaceAbove = (args.iframeRect.top + blockRect.top) - toolbarRect.top - toolbarRect.height;
                break;
            case 'ViewPort':
            case 'Hidden':
                spaceAbove = (args.iframeRect.top + blockRect.top) - toolbarRect.height;
                break;
            }
        } else {
            switch (collision) {
            case 'ScrollableContainer':
                if ((args.iframeRect.top + args.blockRect.top) > scrollParentRect.top) {
                    spaceAbove = (args.iframeRect.top + args.blockRect.top) - scrollParentRect.top;
                } else {
                    spaceAbove = -(scrollParentRect.top - (args.iframeRect.top + args.blockRect.top));
                }
                break;
            case 'ParentElement':
                spaceAbove = (args.iframeRect.top + blockRect.top) - (args.iframeRect.top + args.editPanelDomRect.top);
                break;
            case 'ViewPort':
            case 'Hidden':
                if (toolbarRect.top < 0) {
                    spaceAbove = (args.iframeRect.top + blockRect.top);
                } else {
                    spaceAbove = (args.iframeRect.top + blockRect.top) - toolbarRect.bottom;
                }
                break;
            }
        }
        return spaceAbove;
    }

    private getIFrameSpaceBelow(args: QuickToolbarOffsetParam, isFloatingBot: boolean
        , toolbarRect: DOMRect, scrollParentRect: DOMRect): number {
        let spaceBelow: number;
        const blockRect: DOMRect =  args.blockRect;
        const parentRect: DOMRect = args.editPanelDomRect;
        const isScrollParentElemInputElem: boolean = args.editPanelDomRect.top === scrollParentRect.top && args.editPanelDomRect.bottom
            === args.editPanelDomRect.bottom;
        if (isScrollParentElemInputElem) {
            scrollParentRect = args.iframeRect;
        }
        const collision: QuickToolbarCollision = this.getIFrameBottomCollisionType(blockRect, parentRect, isFloatingBot
            ? toolbarRect : scrollParentRect, args.iframeRect);
        if (isFloatingBot) {
            switch (collision) {
            case 'Hidden':
            case 'ParentElement':
            case 'ScrollableContainer':
                spaceBelow = args.iframeRect.bottom - (args.iframeRect.top + blockRect.bottom);
                break;
            case 'ViewPort':
                spaceBelow = window.innerHeight - (args.iframeRect.top + blockRect.bottom);
                break;
            }
        } else {
            switch (collision) {
            case 'Hidden':
            case 'ParentElement':
            case 'ScrollableContainer':
                if (!isScrollParentElemInputElem && collision === 'ParentElement') {
                    spaceBelow = args.iframeRect.bottom -  (args.iframeRect.top + blockRect.bottom);
                } else {
                    spaceBelow = scrollParentRect.bottom - (args.iframeRect.top + blockRect.bottom);
                }
                break;
            case 'ViewPort':
                spaceBelow = window.innerHeight - (args.iframeRect.top + blockRect.bottom);
                break;
            }
        }
        const blockElemFromViewPort: number = args.iframeRect.top + blockRect.bottom;
        const totalPopupHeight: number = (this.popupHeight + this.tipPointerHeight);
        const exceedsWindow: boolean = blockElemFromViewPort > window.innerHeight;
        const exceedsScrollableParent: boolean =  blockElemFromViewPort > args.iframeRect.bottom &&
        blockElemFromViewPort + totalPopupHeight > scrollParentRect.bottom;
        if (exceedsWindow || exceedsScrollableParent) {
            spaceBelow = 0;
        }
        return spaceBelow;
    }

    private getIFrameTopCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect
        , iframeRect: DOMRect): QuickToolbarCollision{
        if ((iframeRect.top + blockRect.top) < 0 || (iframeRect.top + blockRect.top) >= window.innerHeight) {
            return 'Hidden';
        } else {
            if (iframeRect.top + parentRect.top > 0) {
                return 'ParentElement';
            } else {
                if (scrollParentRect.top <= 0) {
                    return 'ViewPort';
                }
                if (scrollParentRect.top > 0) {
                    return 'ScrollableContainer';
                }
            }
        }
        return 'ParentElement';
    }

    private getIFrameBottomCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect
        , iframeRect: DOMRect): QuickToolbarCollision {
        if ((iframeRect.top + blockRect.bottom) < 0 || (iframeRect.top + blockRect.bottom) >= window.innerHeight
        || (iframeRect.top + blockRect.bottom) >= iframeRect.bottom || (iframeRect.top + blockRect.bottom) >= scrollParentRect.bottom) {
            return 'Hidden';
        } else {
            if (scrollParentRect.bottom >= window.innerHeight && (iframeRect.top + parentRect.bottom) >= window.innerHeight) {
                return 'ViewPort';
            } else {
                if ((iframeRect.top + parentRect.bottom) <= scrollParentRect.bottom) {
                    return 'ParentElement';
                } else {
                    return 'ScrollableContainer';
                }
            }
        }
    }
}
