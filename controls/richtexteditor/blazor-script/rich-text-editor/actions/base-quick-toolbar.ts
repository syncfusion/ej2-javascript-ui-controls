import { selectAll, isNullOrUndefined as isNOU, isNullOrUndefined, EventHandler, closest, setStyleAttribute, addClass, append } from '../../../base'; /*externalscript*/
import { removeClass, Browser } from '../../../base'; /*externalscript*/
import { CollisionType, Popup, PopupModel } from '../../../popups/src'; /*externalscript*/
import * as constant from '../constant';
import * as classes from '../classes';
import { IToolbarStatus } from '../../src/common/interface';
import { ISetToolbarStatusArgs } from '../interfaces';
import { setToolbarStatus, dispatchEvent } from '../util';
import { isIDevice } from '../../src/common/util';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { QuickPopupRenderer } from '../renderer/quick-popup-renderer';
import { BeforeQuickToolbarOpenArgs } from '../../src/common/interface';
import { IBaseQuickToolbar } from '../interfaces';
import { QuickToolbar } from './quick-toolbar';
import { QuickToolbarType } from '../../src/common/types';
import { QuickToolbarOffsetParam } from '../../src/common/interface';
import { TriggerType, TipPointerPosition, SelectionDirection } from '../../src/common/enum';
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
        this.popupWidth = this.getPopupDimension(this.popupObj, 'width');
        this.popupHeight = this.getPopupDimension(this.popupObj, 'height');
        this.toolbarHeight =  this.parent.getToolbarElement().getBoundingClientRect().height;
        const offsetX: number = this.calculateOffsetX(offsetCalculationParam);
        let offsetY: number = this.calculateOffsetY(offsetCalculationParam);
        const lastBlockCollision: boolean = this.checkLastCollision(offsetCalculationParam);
        if (lastBlockCollision) {
            offsetY = this.handleLastBlockCollision(offsetCalculationParam, offsetY);
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        }
        if (direction === 'Backward') {
            offsetY = this.handleBackwardsSelection(offsetY, offsetCalculationParam);
        }
        let args: BeforeQuickToolbarOpenArgs = {
            cancel: false, targetElement: relativeElem,
            type: triggerType, positionX: offsetX, positionY: offsetY
        };
        if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Table' || this.type === 'Video') {
            if (this.parent.iframeSettings.enable) {
                args = this.handleIFrameVerticalCollision(offsetCalculationParam, args);
            } else {
                args = this.handleVerticalCollision(offsetCalculationParam, args);
            }
        }
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
        setStyleAttribute(this.element, { maxWidth: '75%' });
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
        const dropDownBtn: HTMLElement = this.popupObj.element.querySelector('.e-rte-dropdown-btn.e-active') || this.popupObj.element.querySelector('.e-rte-dropdown.e-active');
        if (!isNOU(dropDownBtn)) {
            dispatchEvent(document.body, 'mousedown');
        }
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

    // When the selection is backwards (bottom to top), Quick toolbar should open at the start instead of the end.
    private handleBackwardsSelection(offsetY: number, offsetCalculationParam: QuickToolbarOffsetParam): number {
        let availableTop: number;
        if (this.parent.iframeSettings.enable) {
            const pageYOffset: number = window.pageYOffset;
            const iframeScrollTop: number = (offsetCalculationParam.contentPanelElement as HTMLIFrameElement).contentWindow.pageYOffset;
            offsetY = pageYOffset + offsetCalculationParam.iframeRect.top - iframeScrollTop - (this.popupHeight + 10);
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        } else {
            availableTop = offsetCalculationParam.editPanelDomRect.top <= 0 ? offsetCalculationParam.rangeRect.top :
                offsetCalculationParam.rangeRect.top - offsetCalculationParam.editPanelDomRect.top;
            availableTop = this.parent.toolbarSettings.enableFloating && this.parent.toolbarSettings.position === 'Top' ? availableTop - this.toolbarHeight : availableTop;
            if (availableTop > (this.popupHeight + this.tipPointerHeight)) {
                offsetY = -(this.popupHeight + 10) + (offsetCalculationParam.rangeRect.top - offsetCalculationParam.blockRect.top);
                this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
            }
        }
        return offsetY;
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
            const finalRangeEdge: number = this.parent.iframeSettings.enable === false ? rangeEdge - args.blockRect.left : rangeEdge; // Normalising for div rendering.
            const relativePosition: number = rangeEdge - args.blockRect.x;
            if (finalRangeEdge < width / 4) {
                finalX = relativePosition - tipPointerOffset;
                this.currentTipPosition = 'Top-Left';
            } else if (finalRangeEdge > width / 4 && finalRangeEdge < width / 2) {
                finalX = relativePosition - width / 4;
                this.currentTipPosition = 'Top-LeftMiddle';
            } else if (finalRangeEdge > width / 2 && finalRangeEdge < (width * 3 / 4)) {
                finalX = relativePosition - width / 2;
                this.currentTipPosition = 'Top-Center';
            } else if (finalRangeEdge > (width * 3 / 4) && finalRangeEdge < width) {
                finalX = relativePosition - (width * 3 / 4);
                this.currentTipPosition = 'Top-RightMiddle';
            } else {
                finalX = relativePosition - width + tipPointerOffset;
                this.currentTipPosition = 'Top-Right';
            }
            finalX = this.parent.iframeSettings.enable ? finalX + args.iframeRect.left : finalX;
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
                if (this.type === 'Link') {
                    finalX = finalX + args.iframeRect.left;
                } else {
                    finalX = finalX + args.blockRect.left;
                }
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
        case 'Audio':
        case 'Link':
            if (this.parent.iframeSettings.enable) {
                const iframeScrollTop: number = (args.contentPanelElement as HTMLIFrameElement).contentWindow.pageYOffset;
                const pageYOffset: number = window.pageYOffset;
                finalY = pageYOffset + args.iframeRect.top + args.rangeRect.bottom - args.blockRect.top
                        - iframeScrollTop + this.tipPointerHeight;
            } else {
                finalY = args.rangeRect.bottom - args.blockRect.top + this.tipPointerHeight;
            }
            break;
        case 'Image':
        case 'Video':
        case 'Table': {
            if (this.parent.iframeSettings.enable) {
                finalY = null;
            } else {
                finalY = - (this.popupHeight + this.tipPointerHeight);
            }
            break;
        }
        }
        return finalY;
    }

    // To check whether the popup is collide with the last line of the content either scrolled or not scrolled.
    private checkLastCollision(args: QuickToolbarOffsetParam): boolean {
        let isCollision: boolean = false;
        if (this.type === 'Inline' || this.type === 'Link' || this.type === 'Text' || this.type === 'Image' || this.type === 'Audio' || this.type === 'Video') {
            // const rangeTop: number = args.rangeRect.bottom;
            const contentPanel: HTMLDivElement | HTMLIFrameElement = this.parent.getPanel() as HTMLDivElement;
            const scrollTop: number = this.parent.iframeSettings.enable ? (contentPanel as HTMLIFrameElement).contentWindow.pageYOffset :
                contentPanel.scrollTop;
            const popupHeight: number = this.popupHeight;
            if (this.parent.iframeSettings.enable) {
                const iframeRect: DOMRect = args.iframeRect;
                const iframeContentRect: DOMRect = this.parent.inputElement.getBoundingClientRect() as DOMRect;
                const visibleBottom: number = iframeRect.top + iframeContentRect.height - scrollTop;
                const selectedRangeBottom: number = args.rangeRect.bottom + iframeRect.top;
                if (scrollTop > 0) { // Content scroll use case
                    isCollision = selectedRangeBottom > visibleBottom - popupHeight && selectedRangeBottom <= visibleBottom;
                } else { // No scrolling
                    isCollision = args.iframeRect.top + args.blockRect.top > args.iframeRect.bottom - popupHeight;
                }
            } else {
                if (scrollTop > 0) { // Content scroll use case.
                    const visibleBottom: number = contentPanel.getBoundingClientRect().bottom;
                    const selectedRangeBottom: number = args.rangeRect.bottom;
                    isCollision = selectedRangeBottom > visibleBottom - popupHeight && selectedRangeBottom <= visibleBottom;
                } else { // No scrolling
                    isCollision = args.blockRect.bottom > contentPanel.getBoundingClientRect().bottom - popupHeight;
                }
            }
        }
        return isCollision;
    }

    // To calculate a new OffsetY since there is a collision and the last line of the content.
    private handleLastBlockCollision(args: QuickToolbarOffsetParam, offsetY: number): number {
        let newOffsetY: number = 0;
        const cursorHeight: number = args.rangeRect.height;
        switch (this.type) {
        case 'Text':
        case 'Inline':
        case 'Link':
            if (this.parent.iframeSettings.enable) {
                const pageYOffset: number = window.pageYOffset;
                const iframeScrollTop: number = (args.contentPanelElement as HTMLIFrameElement).contentWindow.pageYOffset;
                newOffsetY = pageYOffset + args.iframeRect.top + args.rangeRect.top -
                        args.blockRect.top - this.popupHeight - cursorHeight - iframeScrollTop;
            } else {
                newOffsetY = args.rangeRect.top - args.blockRect.top - this.popupHeight - cursorHeight;
            }
            break;
        case 'Image':
        case 'Audio':
        case 'Video':
            newOffsetY = offsetY;
            break;
        }
        return newOffsetY;
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

    // In this method we change the popup properties to position the popup on top, bottom of the target element also achieve sticky collision using the 'fit' collision type.
    private handleVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs): BeforeQuickToolbarOpenArgs {
        const scrollToparentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollToparentElement.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = offsetParams.blockRect;
        const toolbarRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const isBottomToolbar: boolean = this.parent.toolbarSettings.position === 'Bottom';
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const isFloatingTop: boolean = isFloating && this.parent.toolbarSettings.position === 'Top';
        const isFLoatingBot: boolean = isFloating && this.parent.toolbarSettings.position === 'Bottom';
        const parentRect: DOMRect = offsetParams.editPanelDomRect as DOMRect;
        const spaceAbove: number = parentRect.top < 0 && !isFloatingTop ? offsetParams.blockRect.top : isFloatingTop ?
            offsetParams.blockRect.top - toolbarRect.top - toolbarRect.height : offsetParams.blockRect.top - parentRect.top;
        const spaceBelow: number = isFloatingTop && blockRect.bottom > scrollParentRect.bottom ? 0 : isFLoatingBot ?
            parentRect.bottom - offsetParams.blockRect.bottom - toolbarRect.height : parentRect.bottom - offsetParams.blockRect.bottom;
        const topViewPortSpace: number = blockRect.top;
        const botViewPortSpace: number = blockRect.bottom;
        let yPosition: string;
        let yCollision: CollisionType;
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top', false) && spaceAbove > totalPopupHeight && topViewPortSpace > totalPopupHeight;
        const isBotPosition: boolean = this.isElemVisible(blockRect, 'bottom', false) && spaceBelow > totalPopupHeight && botViewPortSpace > totalPopupHeight;
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
            const withOutToolbarHeight: number = scrollToparentElement === this.parent.inputElement ?
                -(blockRect.top) : (-blockRect.top) + parentRect.top; // When there is no floating Main toolbar wont hide the quick toolbar so no need to add main toolbar height.
            args.positionY = isFloating && !isBottomToolbar ? withToolbarHeight : withOutToolbarHeight;
            this.currentTipPosition = 'None';
        }
        const newProps: PopupModel = {
            position: { Y: yPosition , X : this.popupObj.position.X },
            collision: { Y: yCollision , X : this.popupObj.collision.X }
        };
        this.popupObj.setProperties(newProps);
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

    private handleIFrameVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs):
    BeforeQuickToolbarOpenArgs {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const toolbarElemRect: DOMRect = this.parent.getToolbarElement().getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = offsetParams.blockRect;
        const iframeScrollHeight: number = this.parent.inputElement.ownerDocument.defaultView.pageYOffset;
        let spaceAbove: number = blockRect.top + offsetParams.iframeRect.top - toolbarElemRect.top - toolbarElemRect.height;
        let spaceBelow: number = offsetParams.iframeRect.top < 0 && offsetParams.iframeRect.height > window.innerHeight ?
            window.innerHeight - (blockRect.bottom + offsetParams.iframeRect.top) :
            offsetParams.iframeRect.bottom - (offsetParams.iframeRect.top + blockRect.bottom + iframeScrollHeight);
        if (!isFloating && offsetParams.iframeRect.top < 0) {
            spaceAbove = blockRect.top + offsetParams.iframeRect.top;
        }
        if (scrollTopParentElement !== this.parent.inputElement) {
            spaceBelow = offsetParams.iframeRect.top < 0 && offsetParams.iframeRect.height > scrollParentRect.height ?
                scrollParentRect.height - (blockRect.bottom + offsetParams.iframeRect.top) :
                offsetParams.iframeRect.bottom - (offsetParams.iframeRect.top + blockRect.bottom + iframeScrollHeight);
        }
        args.positionY = -100; // To hide the quick toolbar when the element is not in view during scroll action.
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        if (this.isElemVisible(blockRect, 'top', true, offsetParams.iframeRect) && spaceAbove > totalPopupHeight) {
            args.positionY = blockRect.top - totalPopupHeight;
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        } else if (this.isElemVisible(blockRect, 'bottom', true, offsetParams.iframeRect) && spaceBelow > totalPopupHeight){
            args.positionY = blockRect.bottom + (this.tipPointerHeight);
            this.currentTipPosition = this.currentTipPosition.replace('Bottom', 'Top') as TipPointerPosition;
        } else if ((spaceAbove < totalPopupHeight && spaceBelow < totalPopupHeight)) {
            const isSticky: boolean = isFloating && toolbarElemRect.top === 0 && window.pageYOffset > 0;
            const topPosition: number = blockRect.top > (totalPopupHeight) ?
                blockRect.top - totalPopupHeight : 0;
            if (isSticky) {
                args.positionY = - (offsetParams.iframeRect.top) + totalPopupHeight;
            } else {
                args.positionY = scrollTopParentElement === this.parent.inputElement ? topPosition :
                    - (offsetParams.iframeRect.top) + toolbarElemRect.height + scrollParentRect.top;
            }
            if (!isFloating && offsetParams.iframeRect.top < 0) {
                args.positionY = - (offsetParams.iframeRect.top);
            }
            this.currentTipPosition = 'None';
        }
        args.targetElement = this.parent.getPanel().parentElement;
        return args;
    }

}
