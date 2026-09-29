import { detach, append, isNullOrUndefined as isNOU, closest, remove } from '@syncfusion/ej2-base';
import { addClass, removeClass, Browser, setStyleAttribute } from '@syncfusion/ej2-base';
import { CollisionType, Popup, PopupModel, Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import { ToolbarItem } from '../../richtexteditor-ui/model/toolbar.types';
import { EditorToolbar } from './editor-toolbar';
import { RichTextEditorUI } from '../../richtexteditor-ui/richtexteditor-ui';
import { QuickPopupRenderer, QuickToolbarEventArgs } from './quick-popup';
import * as classes from '../classes';
import * as events from '../../common/constant';
import { EditorCommandExecutor } from './editor-integration';
import { EditorCommandName, IEditorController } from '../../controller/interface';
/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class BaseQuickToolbar {
    public isDestroyed: boolean;
    public popupObj: Popup;
    public element: HTMLElement;
    public isRendered: boolean;
    public quickTBarObj: EditorToolbar;
    private toolbarItems: ToolbarItem[];
    private parent: RichTextEditorUI;
    public toolbarElement: HTMLElement;
    public tooltip: Tooltip;
    /**
     * Specifies the Quick Toolbar type.
     */
    public type: QuickToolbarType;
    public popupWidth: number;
    public popupHeight: number;
    private tipPointerElem: HTMLElement;
    public currentTipPosition: TipPointerPosition;
    private tipPointerHeight: number;
    public previousTarget: HTMLElement;
    private toolbarHeight: number;
    public constructor(type: QuickToolbarType, parent?: RichTextEditorUI) {
        this.parent = parent;
        this.isRendered = false;
        this.isDestroyed = false;
        this.type = type;
        this.popupWidth = null;
        this.popupHeight = null;
        this.tipPointerHeight = Browser.isDevice ? 16 : 10;
    }

    private appendToolbarElement(): void {
        this.toolbarElement = this.parent.createElement('div', { className: CLS_QUICK_TB });
        switch (this.type) {
        case 'Image':
            this.toolbarElement.classList.add(CLS_IMG_QUICK_TB);
            break;
        case 'Link':
            this.toolbarElement.classList.add(CLS_LINK_QUICK_TB);
            break;
        case 'Table':
            this.toolbarElement.classList.add(CLS_TABLE_QUICK_TB);
            break;
        case 'Audio':
            this.toolbarElement.classList.add(CLS_AUDIO_QUICK_TB);
            break;
        case 'Video':
            this.toolbarElement.classList.add(CLS_VIDEO_QUICK_TB);
            break;
        case 'Text':
            this.toolbarElement.classList.add(CLS_TEXT_QUICK_TB);
            break;
        }
        this.popupObj.element.appendChild(this.toolbarElement);
    }

    /**
     * render method
     *
     * @param {IQuickToolbarOptions} args - specifies the arguments
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public render(args: IQuickToolbarOptions): void {
        this.toolbarItems = args.toolbarItems;
        const quickPopupRenderer: QuickPopupRenderer = new QuickPopupRenderer(this.parent);
        this.popupObj = quickPopupRenderer.renderPopup(args.popupType as QuickToolbarType);
        this.element = this.popupObj.element;
        this.tipPointerElem = this.element.querySelector('.e-rte-ui-tip-pointer');
        this.appendToolbarElement();
        this.createToolbar(args.toolbarItems, args.statusRefresh);
        this.addEventListener();
        this.addCSSClass();
    }

    private createToolbar(items: ToolbarItem[], statusRefresh?: () => void): void {
        this.quickTBarObj = new EditorToolbar();
        this.quickTBarObj.render({
            element: this.toolbarElement,
            items: items,
            type: 'MultiRow',
            controller: this.buildCommandExecutor(),
            rteInstance: this.parent,
            localeObj: this.parent.localeObj,
            statusRefresh: statusRefresh,
            toolbarContext: this.type === 'Image' || this.type === 'Table' || this.type === 'Link' ? this.type : null
        });
    }

    /*
     * Builds a minimal EditorCommandExecutor from the parent's editor controller.
     * Returns a no-op executor if no controller is available (defensive).
     */
    private buildCommandExecutor(): EditorCommandExecutor {
        const parent: RichTextEditorUI = this.parent;
        if (parent.editorController && typeof parent.editorController.execute === 'function') {
            const controller: IEditorController = parent.editorController;
            // Wrap the controller to expose both execute() and process() methods
            return {
                execute: (command: EditorCommandName, value?: unknown) => {
                    controller.execute(command, value);
                },
                process: (
                    editorInstance: RichTextEditorUI,
                    action: string,
                    event?: MouseEvent | KeyboardEvent,
                    value?: unknown
                ) => {
                    controller.process(parent, { action }, event, value);
                }
            };
        }
        // Defensive no-op executor — used when no headless editor is connected
        return {
            execute: function (_command: string, _value?: unknown): void {
                // No-op until headless editor is connected
            },
            process: function (
                _editorInstance: RichTextEditorUI,
                _action: string,
                _event?: MouseEvent | KeyboardEvent,
                _value?: unknown
            ): void {
                // No-op until headless editor is connected
            }
        };
    }

    /**
     * Show the Quick toolbar popup.
     *
     * @param {Element} target - The target element relative to which the Quick toolbar is opened.
     * @param {MouseEvent | KeyboardEvent} [originalEvent] - The original event causing the Quick toolbar to open.
     * @returns {void}
     */
    public showPopup(target: Element, originalEvent?: MouseEvent | KeyboardEvent): void {
        const selection: Selection = window.getSelection();
        if (isNOU(selection) || selection.rangeCount === 0) {
            return;
        }
        this.renderTooltip();
        let relativeElem: HTMLElement = this.getRelativeElement(selection, target as HTMLElement);
        if (isNOU(relativeElem)) {
            return;
        }
        const range: Range = selection.getRangeAt(0);
        const iframeRect: DOMRect = null;
        const clientRects: DOMRectList = range.getClientRects() as DOMRectList;
        const isEmptyContent: boolean = clientRects.length === 0 && (range.startContainer.nodeName === 'P' || range.startContainer.nodeName === 'DIV' ||
            (range.startContainer.nodeName === 'BR' && !range.startContainer.parentElement.closest('table')));
        const direction: SelectionDirection = this.getSelectionDirection(selection);
        if (this.type === 'Text' && direction === 'Backward') {
            const blockElements: HTMLElement[] = this.parent.editorController.getSelectedBlockElements();
            relativeElem = blockElements.length > 1 ? blockElements[0] : relativeElem;
        }
        let triggerType: TriggerType = isNOU(originalEvent) ? 'none' : originalEvent.type as TriggerType;
        if (triggerType === 'mouseup' && originalEvent.detail && originalEvent.detail === 3) {
            triggerType = 'trippleclick';
        }
        const rangeDomRect: DOMRect = clientRects.length === 0 && range.startContainer.nodeName !== '#text' ? (range.startContainer as HTMLElement).getBoundingClientRect() as DOMRect :
            direction === 'Backward' ? clientRects[0] : clientRects[clientRects.length - 1];
        const offsetCalculationParam: QuickToolbarOffsetParam = {
            blockElement: relativeElem,
            blockRect: relativeElem.getBoundingClientRect() as DOMRect,
            range: range,
            rangeRect: rangeDomRect,
            iframeRect: iframeRect,
            contentPanelElement: this.parent.inputElement.parentElement as HTMLElement,
            editPanelDomRect: this.parent.inputElement.getBoundingClientRect() as DOMRect,
            direction: direction,
            type: triggerType
        };
        this.popupWidth = this.getPopupDimension(this.popupObj, 'width');
        this.popupHeight = this.getPopupDimension(this.popupObj, 'height');
        this.toolbarHeight = this.parent.toolbarModule.wrapperElement.getBoundingClientRect().height;
        const offsetX: number = isEmptyContent ? 1 : this.calculateOffsetX(offsetCalculationParam);
        const offsetY: number = this.calculateOffsetY(offsetCalculationParam);
        if (isEmptyContent) {
            this.currentTipPosition = 'Top-Left';
        }
        let eventArgs: BeforeQuickToolbarOpenArgs = {
            popup: this.popupObj, cancel: false, targetElement: relativeElem,
            type: triggerType, positionX: offsetX, positionY: offsetY
        };
        this.enableDisableToolbarItems();
        eventArgs = this.handleVerticalCollision(offsetCalculationParam, eventArgs);
        this.setTipPointerPostion(this.currentTipPosition);
        if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Video') {
            if (this.currentTipPosition === 'Bottom-Center' || this.currentTipPosition === 'Bottom-Left' || this.currentTipPosition === 'Bottom-Right') {
                eventArgs.positionY = eventArgs.positionY - 2; // Tip should be above the Outline of the media elements.
            } else if (this.currentTipPosition === 'Top-Center' || this.currentTipPosition === 'Top-Left' || this.currentTipPosition === 'Top-Right') {
                eventArgs.positionY = eventArgs.positionY + 2; // Tip should be above the Outline of the media elements.
            }
        }
        this.parent.trigger(events.beforeQuickToolbarOpen, eventArgs, (beforeQuickToolbarArgs: BeforeQuickToolbarOpenArgs) => {
            if (!beforeQuickToolbarArgs.cancel) {
                const popupProps: PopupModel = {
                    offsetX: beforeQuickToolbarArgs.positionX,
                    offsetY: beforeQuickToolbarArgs.positionY,
                    relateTo: beforeQuickToolbarArgs.targetElement as HTMLElement
                };
                this.popupObj.setProperties(popupProps);
                this.popupObj.dataBind();
                removeClass([this.element], [classes.CLS_HIDE, classes.CLS_POPUP_OPEN]);
                this.popupObj.show();
                this.isRendered = true;
                this.previousTarget = target as HTMLElement;
            }
        });
    }

    private renderTooltip(): void {
        addClass([this.element], [classes.CLS_HIDE]);
        append([this.element], this.parent.quickToolbarSettings.appendToBody ?
            this.parent.inputElement.ownerDocument.body : this.parent.inputElement.parentElement);
        if (this.quickTBarObj && this.quickTBarObj.getRenderer() && this.quickTBarObj.getRenderer().isRendered) {
            this.quickTBarObj.ensureQuickPopupNestedItems();
        }
        this.tooltip = new Tooltip({
            target: '#' + this.element.id + ' [title]',
            openDelay: 400,
            showTipPointer: true,
            beforeRender: this.tooltipBeforeRender.bind(this),
            windowCollision: true,
            position: 'BottomCenter',
            cssClass: this.parent.cssClass
        });
        this.tooltip.appendTo(this.toolbarElement as HTMLElement);
        if (this.element.style.maxWidth !== '75%') {
            setStyleAttribute(this.element, { maxWidth: '75%' });
            const toolbarItemsContainer: HTMLElement = this.element.querySelector('.e-toolbar-items');
            if (!isNOU(toolbarItemsContainer)) {
                for (let i: number = 0; i < toolbarItemsContainer.children.length; i++) {
                    const childElement: Element = toolbarItemsContainer.children[i as number];
                    // If a child's width is greater, update toolbar width
                    if (childElement.clientWidth > this.element.clientWidth) {
                        this.element.style.removeProperty('max-width');
                        break;
                    }
                }
            }
        }
    }

    private tooltipBeforeRender(args: TooltipEventArgs): void {
        if (args.target.querySelector('.e-active')) {
            args.cancel = true;
        }
    }

    /**
     * The method to hide the Quick toolbar.
     *
     * @returns {void}
     * @hidden
     */
    public hidePopup(): void {
        if (this.quickTBarObj && this.quickTBarObj.getRenderer() && this.quickTBarObj.getRenderer().isRendered) {
            this.quickTBarObj.resetQuickPopupNestedItems();
        }
        const tooltipElement: HTMLElement = document.querySelector('.e-tooltip-wrap');
        if (!isNOU(tooltipElement)) {
            const tooltipTargetEle: HTMLElement = <HTMLElement>document.querySelector('#' + this.element.id + ' [data-tooltip-id]');
            if (!isNOU(tooltipTargetEle)) {
                const dataContent: string = tooltipTargetEle.getAttribute('data-content');
                tooltipTargetEle.removeAttribute('data-content');
                tooltipTargetEle.setAttribute('title', dataContent);
                tooltipTargetEle.removeAttribute('data-tooltip-id');
            }
            if (!isNOU(this.tooltip)) {
                this.tooltip.destroy();
                if (!isNOU(tooltipTargetEle) && !isNOU(tooltipElement) && tooltipElement.isConnected) {
                    remove(tooltipElement);
                }
            }
        }
        else {
            if (!isNOU(this.tooltip)) {
                this.tooltip.destroy();
            }
        }
        this.removeEleFromDOM();
        this.isRendered = false;
    }

    private removeEleFromDOM(): void {
        const element: Element = this.popupObj.element;
        if (this.isRendered) {
            detach(element);
            const args: QuickToolbarEventArgs | Popup = this.popupObj;
            this.parent.trigger(events.quickToolbarClose, args);
        }
    }

    /**
     * Destroys the Quick toolbar.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.tooltip && !this.tooltip.isDestroyed) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        this.removeEventListener();
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.removeEleFromDOM();
            this.quickTBarObj.destroy();
            this.quickTBarObj = null;
            this.popupObj.destroy();
        }
        this.toolbarItems = null;
        this.toolbarElement = null;
        this.popupWidth = null;
        this.popupHeight = null;
        this.tipPointerElem = null;
        this.previousTarget = null;
        this.isDestroyed = true;
    }
    /**
     * addEventListener method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.bindCssClass, this.addCSSClass, this);
    }
    private removeEventListener(): void {
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.bindCssClass, this.addCSSClass);
    }

    private getPopupDimension(popup: Popup, type: 'width' | 'height'): number {
        const element: HTMLElement = popup.element;
        element.classList.remove(classes.CLS_POPUP_CLOSE);
        const dimension: number = type === 'width' ? element.clientWidth : element.clientHeight;
        element.classList.add(classes.CLS_POPUP_CLOSE);
        return dimension;
    }

    // To get the relative element of the popup of the quick toolbar.
    private getRelativeElement(selection: Selection, currentTarget: HTMLElement): HTMLElement {
        const focusNode: Node = selection.focusNode as Node;
        let blockElement: HTMLElement = this.parent.editorController.getSelectedBlockElem();
        switch (this.type) {
        case 'Text':
            if (blockElement.nodeName === 'TD' || blockElement.nodeName === 'TH') {
                blockElement = closest(currentTarget, 'table') as HTMLElement;
            }
            break;
        case 'Link':
            blockElement = closest(currentTarget, 'a') as HTMLElement;
            if (isNOU(blockElement)) {
                blockElement = focusNode.nodeType === 3 ? focusNode.parentElement : focusNode as HTMLElement;
                blockElement = closest(blockElement, 'a') as HTMLElement;
            }
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

    // To calculate the popup offsetX position based on the range and block element position.
    private calculateOffsetX(args: QuickToolbarOffsetParam): number {
        const width: number = this.popupWidth;
        const tipPointerOffset: number = 16.5; // Rounded width of the Tip pointer + left offset value. 8 + 8.5
        let finalX: number;
        switch (this.type) {
        case 'Text':
        case 'Inline': {
            const rangeEdge: number = args.direction === 'Backward' ? args.rangeRect.left : args.rangeRect.right;
            const relativePosition: number = rangeEdge - args.blockRect.left;
            if (relativePosition + width > this.popupObj.element.parentElement.offsetWidth &&
                args.blockRect.right - rangeEdge < tipPointerOffset) {
                const editorRect: DOMRect = this.parent.element.getBoundingClientRect() as DOMRect;
                finalX = rangeEdge - editorRect.left - width;
                this.currentTipPosition = 'Top-Right';
            }
            else if (relativePosition < width / 4) {
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
            finalY = args.rangeRect.bottom - args.blockRect.top + this.tipPointerHeight;
            break;
        case 'Image':
        case 'Audio':
        case 'Video':
        case 'Table': {
            finalY = - (this.popupHeight + this.tipPointerHeight);
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

    private addCSSClass(): void {
        if (this.popupObj && this.parent.cssClass) {
            removeClass([this.popupObj.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
            addClass([this.popupObj.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
    }

    // To Disable the Main taoolbar items when the quick toolbar are opened.
    private enableDisableToolbarItems(): void {
        if (this.type === 'Image') {
            // this.parent.enableToolbarItem(['Undo', 'Redo']);
        }
    }

    private handleVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs): BeforeQuickToolbarOpenArgs {
        if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Table' || this.type === 'Video') {
            args = this.handleMediaVerticalCollision(offsetParams, args);
        } else {
            args = this.handleTextVerticalCollision(offsetParams, args);
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
        const toolbarRect: DOMRect = this.parent.quickToolbarSettings.appendToBody ?
            { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 } as DOMRect :
            this.parent.toolbarModule.wrapperElement.firstElementChild.getBoundingClientRect() as DOMRect;
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
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top') && spaceAbove > totalPopupHeight;
        const isBotPosition: boolean = this.isElemVisible(blockRect, 'bottom') && spaceBelow > totalPopupHeight;
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
            const parentTopClamped: number = !isFloating ? Math.max(parentRect.top, 0) : parentRect.top;
            const withToolbarHeight: number = -(blockRect.top) + toolbarRect.bottom; // WHen floating Main toolbar will hide the quick toolbar so need to add the main toolbar height.
            const withOutToolbarHeight: number = scrollTopParentElement === this.parent.inputElement ?
                (this.parent.quickToolbarSettings.appendToBody ?
                    -(blockRect.top - parentTopClamped) :
                    -(blockRect.top)) : (-blockRect.top) + parentRect.top; // When there is no floating Main toolbar wont hide the quick toolbar so no need to add main toolbar height.
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
        args = this.applyFloatingVisibilityClamp(args, blockRect, parentRect);
        const newProps: PopupModel = {
            position: { Y: yPosition, X: this.popupObj.position.X },
            collision: { Y: yCollision, X: this.popupObj.collision.X }
        };
        this.popupObj.setProperties(newProps);
        this.popupObj.dataBind();
        return args;
    }

    // Returns true when the eleemnt is partially visible. Returns false when the element is not fully visible.
    private isElemVisible(elemRect: DOMRect, value: 'top' | 'bottom'): boolean {
        if (value === 'top') {
            return elemRect.top >= 0 && elemRect.top <= window.innerHeight;
        } else {
            return elemRect.bottom <= window.innerHeight && elemRect.bottom >= 0;
        }
    }

    private getSpaceAbove(args: QuickToolbarOffsetParam, isFloatingTop: boolean
        , toolbarRect: DOMRect, scrollParentRect: DOMRect, containsMedia?: boolean): number {
        let spaceAbove: number;
        const blockRect: DOMRect = containsMedia ? args.rangeRect : args.blockRect;
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

    private getSpaceBelow(args: QuickToolbarOffsetParam, isFloatingBot: boolean, toolbarRect: DOMRect, scrollParentRect: DOMRect,
                          containsMedia?: boolean): number {
        let spaceBelow: number;
        const blockRect: DOMRect = containsMedia ? args.rangeRect : args.blockRect;
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
        const parentRect: DOMRect = offsetParams.editPanelDomRect as DOMRect;
        const isBottomToolbar: boolean = this.parent.toolbarSettings.position === 'Bottom';
        const containsMedia: boolean = (this.type === 'Text' || this.type === 'Inline') && offsetParams.blockElement.querySelectorAll('img, video').length > 0;
        const blockRect: DOMRect = containsMedia ? offsetParams.rangeRect : offsetParams.blockRect;
        const toolbarRect: DOMRect = this.parent.quickToolbarSettings.appendToBody ?
            { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 } as DOMRect :
            this.parent.toolbarModule.wrapperElement.firstElementChild.getBoundingClientRect() as DOMRect;
        const isFloating: boolean = this.parent.toolbarSettings.enableFloating;
        const isFloatingTop: boolean = isFloating && this.parent.toolbarSettings.position === 'Top';
        const isFloatingBot: boolean = isFloating && this.parent.toolbarSettings.position === 'Bottom';
        const topViewPortSpace: number = blockRect.top;
        const botViewPortSpace: number = blockRect.bottom;
        const spaceAbove: number = this.getSpaceAbove(
            offsetParams, isFloatingTop, toolbarRect, scrollParentRect, containsMedia);
        const spaceBelow: number = this.getSpaceBelow(
            offsetParams, isFloatingBot, toolbarRect, scrollParentRect, containsMedia);
        const totalPopupHeight: number = (this.tipPointerHeight + this.popupHeight);
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top') && spaceAbove > totalPopupHeight && topViewPortSpace > totalPopupHeight;
        const isBotPosition: boolean = offsetParams.direction === 'Backward' && isTopPosition ? false : this.isElemVisible(blockRect, 'bottom') && spaceBelow > totalPopupHeight && botViewPortSpace > totalPopupHeight;
        const isLargeBlock: boolean = offsetParams.blockRect.height > this.popupHeight;
        if (isBotPosition) {
            this.currentTipPosition = this.currentTipPosition.replace('Bottom', 'Top') as TipPointerPosition;
        } else if (isTopPosition) {
            args.positionY = -(this.popupHeight + 10) + (offsetParams.rangeRect.top - offsetParams.blockRect.top);
            this.currentTipPosition = this.currentTipPosition.replace('Top', 'Bottom') as TipPointerPosition;
        } else if ((spaceAbove < totalPopupHeight && spaceBelow < totalPopupHeight) &&
            (containsMedia || isLargeBlock) && !this.parent.quickToolbarSettings.appendToBody) {
            const withToolbarHeight: number = -(offsetParams.blockRect.top) + toolbarRect.bottom; // When floating Main toolbar will hide the quick toolbar so need to add the main toolbar height.
            const withOutToolbarHeight: number = scrollTopParentElement === this.parent.inputElement ?
                -(offsetParams.blockRect.top) : (-offsetParams.blockRect.top) + parentRect.top; // When there is no floating Main toolbar wont hide the quick toolbar so no need to add main toolbar height.
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
                        if (parentRect.top < 0) { // When the Parent is hidden we need to calculate against the viewport.
                            args.positionY = -blockRect.top;
                        } else {
                            args.positionY = -(blockRect.top - scrollParentRect.top);
                        }
                    }
                }
            }
        }
        if (!isBotPosition && !isTopPosition) {
            this.currentTipPosition = 'None';
        }
        args = this.applyFloatingVisibilityClamp(args, blockRect, parentRect);
        return args;
    }

    // Hides the quick toolbar by setting positionY to off-screen when the block element or popup is outside the editor's visible bounds.
    private applyFloatingVisibilityClamp(
        args: BeforeQuickToolbarOpenArgs, blockRect: DOMRect, parentRect: DOMRect): BeforeQuickToolbarOpenArgs {
        if (this.parent.quickToolbarSettings.appendToBody) {
            const blockTop: number = blockRect.top;
            const blockBottom: number = blockRect.bottom;
            const isBlockInViewport: boolean = blockBottom > 0 && blockTop < window.innerHeight;
            const isBlockInEditor: boolean = blockBottom > parentRect.top && blockTop < parentRect.bottom;
            if (!isBlockInViewport || !isBlockInEditor) {
                args.positionY = -99999;
            }
        }
        return args;
    }


    private getTopCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect): QuickToolbarCollision {
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
}

/**
 * Defines the type of the Quick toolbar popup.
 *
 * @hidden
 */
export type QuickToolbarType = 'Audio' | 'Image' | 'Inline' | 'Link' | 'Table' | 'Text' | 'Video';

/**
 * Defines the type of the popup.
 *
 * @hidden
 */
export type MediaType = 'Audios' | 'Images' | 'Videos';

/**
 * Defines the Quick toolbar collision type.
 *
 * @hidden
 */
export type QuickToolbarCollision = 'ViewPort' | 'ParentElement' | 'ScrollableContainer' | 'Hidden';

/**
 * Defines the direction of the selection.
 *
 * @hidden
 */
export type SelectionDirection = 'Backward' | 'Forward';

/**
 * Defines the Quick toolbar open event trigger.
 *
 * @hidden
 */
export type TriggerType = 'keyup' | 'contextmenu' | 'mouseup' | 'trippleclick' | 'none' | 'scroll';

/**
 * Defines the type of the Quick Toolbar tip pointer position.
 *
 * @hidden
 *
 */
export type TipPointerPosition = 'Top-Left' | 'Top-LeftMiddle' | 'Top-Center' | 'Top-RightMiddle' | 'Top-Right' | 'Bottom-Left' | 'Bottom-LeftMiddle' | 'Bottom-Center' | 'Bottom-RightMiddle' | 'Bottom-Right' | 'None';

/**
 * @hidden
 */
export const CLS_QUICK_TB: string = 'e-rte-ui-quick-toolbar';
/**
 * @hidden
 */
export const CLS_TEXT_QUICK_TB: string = 'e-text-quicktoolbar';
/**
 * @hidden
 */
export const CLS_IMG_QUICK_TB: string = 'e-image-quicktoolbar';
/**
 * @hidden
 */
export const CLS_AUDIO_QUICK_TB: string = 'e-audio-quicktoolbar';
/**
 * @hidden
 */
export const CLS_VIDEO_QUICK_TB: string = 'e-video-quicktoolbar';
/**
 * @hidden
 */
export const CLS_TABLE_QUICK_TB: string = 'e-table-quicktoolbar';
/**
 * @hidden
 */
export const CLS_LINK_QUICK_TB: string = 'e-link-quicktoolbar';

/**
 * @private
 */
export interface IQuickToolbarOptions {
    popupType: string
    mode: OverflowMode
    toolbarItems: ToolbarItem[],
    cssClass: string
    statusRefresh?: () => void
}

/**
 * Provides detailed information about the `beforeQuickToolbarOpen` event in the editor.
 */
export interface BeforeQuickToolbarOpenArgs {
    /**
     * Defines the instance of the current popup element.
     *
     */
    popup?: Popup
    /** Determine whether the quick toolbar should be prevented from opening. */
    cancel?: boolean
    /** Defines the target element on which the quick toolbar is triggered. */
    targetElement?: Element
    /**
     *
     * Defines the X-coordinate position where the quick toolbar will appear.
     */
    positionX?: number
    /**
     *
     * Defines the Y-coordinate position where the quick toolbar will appear.
     */
    positionY?: number
    /**
     * Defines the trigger type of the Quick toolbar action.
     */
    type?: TriggerType
}
/**
 * The interface helps to generate necessary arguments for calculating the offsetX and offsetY values.
 *
 * @hidden
 */
export interface QuickToolbarOffsetParam {
    /**
     * Specifies the relative element of the popup.
     */
    blockElement: HTMLElement
    /**
     * Specifies the DOMRect of the popup relative element.
     */
    blockRect: DOMRect
    /**
     * Specifies the range of the editor instance.
     */
    range: Range
    /**
     * Specifies the current range DOMRect of the editor.
     */
    rangeRect: DOMRect
    /**
     * Specifies the iframe element DOMRect, when the editor is in `iframe` mode.
     */
    iframeRect?: DOMRect
    /**
     * Specifies the content panel element.
     */
    contentPanelElement?: HTMLElement
    /**
     * Specifies the editable element DOMRect.
     */
    editPanelDomRect?: DOMRect
    /**
     * Specifies the selection direction.
     */
    direction: SelectionDirection
    /**
     * Specifies the Quick toolbar trigger type.
     */
    type: TriggerType
}
