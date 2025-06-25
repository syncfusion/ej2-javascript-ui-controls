import { detach, append, selectAll, select, isNullOrUndefined as isNOU, closest } from '@syncfusion/ej2-base';
import { addClass, removeClass, Browser, setStyleAttribute } from '@syncfusion/ej2-base';
import { CollisionType, Popup, PopupModel, Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { setToolbarStatus, updateUndoRedoStatus } from '../base/util';
import { IRichTextEditor, IToolbarRenderOptions, IDropDownRenderArgs, IBaseQuickToolbar } from '../base/interface';
import { IQuickToolbarOptions, ISetToolbarStatusArgs } from '../base/interface';
import { QuickToolbarEventArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { BaseToolbar } from './base-toolbar';
import { DropDownButtons } from './dropdown-buttons';
import { BeforeQuickToolbarOpenArgs, IColorPickerRenderArgs, IToolbarItems, IToolbarStatus, QuickToolbarOffsetParam } from '../../common/interface';
import { ColorPickerInput } from './color-picker';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { QuickToolbarType } from '../../common/types';
import { QuickPopupRenderer } from '../renderer/quick-popup-renderer';
import { SelectionDirection, TipPointerPosition, TriggerType } from '../../common/enum';
import { isIDevice } from '../../common/util';
/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class BaseQuickToolbar implements IBaseQuickToolbar {
    public isDestroyed: boolean;
    public popupObj: Popup;
    public element: HTMLElement;
    public isRendered: boolean;
    public quickTBarObj: BaseToolbar;
    private stringItems: (string | IToolbarItems)[];
    private dropDownButtons: DropDownButtons;
    private colorPickerObj: ColorPickerInput;
    private locator: ServiceLocator;
    private parent: IRichTextEditor;
    public toolbarElement: HTMLElement;
    private tooltip: Tooltip;
    private previousToolbarStatus: IToolbarStatus = {};
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

    public constructor(type: QuickToolbarType, parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.isRendered = false;
        this.isDestroyed = false;
        this.type = type;
        this.dropDownButtons = new DropDownButtons(this.parent, this.locator);
        this.colorPickerObj = new ColorPickerInput(this.parent, this.locator);
        this.popupWidth = null;
        this.popupHeight = null;
        this.tipPointerHeight = this.parent.userAgentData.isMobileDevice() ? 16 : 10;
    }

    private appendToolbarElement(): void {
        this.toolbarElement = this.parent.createElement('div', { className: classes.CLS_QUICK_TB });
        switch (this.type) {
        case 'Image':
            this.toolbarElement.classList.add(classes.CLS_IMG_QUICK_TB);
            break;
        case 'Link':
            this.toolbarElement.classList.add(classes.CLS_LINK_QUICK_TB);
            break;
        case 'Table':
            this.toolbarElement.classList.add(classes.CLS_TABLE_QUICK_TB);
            break;
        case 'Audio':
            this.toolbarElement.classList.add(classes.CLS_AUDIO_QUICK_TB);
            break;
        case 'Video':
            this.toolbarElement.classList.add(classes.CLS_VIDEO_QUICK_TB);
            break;
        case 'Text':
            this.toolbarElement.classList.add(classes.CLS_TEXT_QUICK_TB);
            break;
        case 'Inline':
            this.toolbarElement.classList.add(classes.CLS_TOOLBAR);
            this.toolbarElement.classList.add(classes.CLS_INLINE_TOOLBAR);
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
        this.stringItems = args.toolbarItems;
        const quickPopupRenderer: QuickPopupRenderer = new QuickPopupRenderer(this.parent);
        this.popupObj = quickPopupRenderer.renderPopup(args.popupType as QuickToolbarType);
        this.element = this.popupObj.element;
        this.tipPointerElem = this.element.querySelector('.e-rte-tip-pointer');
        this.appendToolbarElement();
        this.createToolbar(args.toolbarItems, args.mode, args.cssClass);
        this.addEventListener();
        this.addCSSClass();
    }

    private createToolbar(items: (string | IToolbarItems)[], mode: OverflowMode, cssClass: string): void {
        this.quickTBarObj = new BaseToolbar(this.parent, this.locator);
        this.quickTBarObj.render({
            container: 'quick',
            target: this.toolbarElement,
            items: items,
            mode: mode,
            cssClass: cssClass
        } as IToolbarRenderOptions);
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
        this.renderSubComponents(target as HTMLElement);
        const relativeElem: HTMLElement = this.getRelativeElement(selection, target as HTMLElement);
        if (relativeElem === null) {
            return;
        }
        let iframeRect: DOMRect;
        if (this.parent.iframeSettings.enable) {
            iframeRect = this.parent.contentModule.getPanel().getBoundingClientRect() as DOMRect;
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
            contentPanelElement: this.parent.contentModule.getPanel() as HTMLElement,
            editPanelDomRect: this.parent.contentModule.getEditPanel().getBoundingClientRect() as DOMRect,
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
        let eventArgs: BeforeQuickToolbarOpenArgs = {
            popup: this.popupObj, cancel: false, targetElement: relativeElem,
            type: triggerType, positionX: offsetX, positionY: offsetY
        };
        this.enableDisableToolbarItems();
        if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Table' || this.type === 'Video') {
            if (this.parent.iframeSettings.enable) {
                eventArgs = this.handleIFrameVerticalCollision(offsetCalculationParam, eventArgs);
            } else {
                eventArgs = this.handleVerticalCollision(offsetCalculationParam, eventArgs);
            }
        }
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
                removeClass([this.element], [classes.CLS_HIDE, classes.CLS_POPUP_OPEN]);
                this.popupObj.show();
                setStyleAttribute(this.element, { maxWidth: '75%' });
                this.isRendered = true;
                this.previousTarget = target as HTMLElement;
            }
        });
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

    private renderSubComponents(target: HTMLElement): void {
        addClass([this.element], [classes.CLS_HIDE]);
        if (this.parent.iframeSettings.enable) {
            append([this.element], this.parent.rootContainer.querySelector('.' + classes.CLS_RTE_IFRAME_CONTENT));
        } else {
            append([this.element], this.parent.contentModule.getPanel());
        }
        this.dropDownButtons.renderDropDowns({ container: this.toolbarElement, containerType: 'quick', items: this.stringItems } as IDropDownRenderArgs, target as HTMLElement);
        if (this.type === 'Text' && this.dropDownButtons) {
            if (this.dropDownButtons.formatDropDown) {
                const content: string = ('<span style="display: inline-flex;' + 'width:' + this.parent.format.width + '" >' +
                    '<span class="e-rte-dropdown-btn-text></span></span>');
                this.dropDownButtons.formatDropDown.setProperties({ content: content });
            }
            if (this.dropDownButtons.fontSizeDropDown) {
                const content: string = ('<span style="display: inline-flex;' + 'width:' + this.parent.fontSize.width + '" >' +
                    '<span class="e-rte-dropdown-btn-text></span></span>');
                this.dropDownButtons.fontSizeDropDown.setProperties({ content: content });
            }
            if (this.dropDownButtons.fontNameDropDown) {
                const content: string = ('<span style="display: inline-flex;' + 'width:' + this.parent.fontFamily.width + '" >' +
                    '<span class="e-rte-dropdown-btn-text></span></span>');
                this.dropDownButtons.fontNameDropDown.setProperties({ content: content });
            }
        }
        this.colorPickerObj.renderColorPickerInput({ container: this.toolbarElement, containerType: 'quick', items: this.stringItems } as IColorPickerRenderArgs);
        if (this.parent.showTooltip) {
            this.tooltip = new Tooltip({
                target: '#' + this.element.id + ' [title]',
                openDelay: 400,
                showTipPointer: true,
                beforeRender: this.tooltipBeforeRender.bind(this),
                windowCollision: true,
                position: 'BottomCenter',
                cssClass: this.parent.getCssClass()
            });
            this.tooltip.appendTo(this.toolbarElement as HTMLElement);
        }
    }

    private tooltipBeforeRender(args: TooltipEventArgs): void {
        if (args.target.querySelector('.e-active')) {
            args.cancel = true;
            if (!isNOU(args.target.getAttribute('title'))) {
                this.parent.notify(events.closeTooltip, { target: args.target, isTitle: true });
            }
        }
    }

    /**
     * The method to hide the Quick toolbar.
     *
     * @returns {void}
     * @hidden
     */
    public hidePopup(): void {
        const isSourceCodeEnabled: boolean = !isNOU(this.parent.rootContainer) && this.parent.rootContainer.classList.contains('e-source-code-enabled');
        if (Browser.isDevice && !isIDevice()) {
            removeClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (!isNOU(this.element.querySelectorAll('[data-title]'))) {
            const removeHandEle: NodeListOf<Element> = this.element.querySelectorAll('[data-title]');
            removeHandEle.forEach((e: Element) => {
                const event: MouseEvent = new MouseEvent('mouseout', { bubbles: true, cancelable: true });
                e.dispatchEvent(event);
            });
        }
        if (!isNOU(document.querySelector('.e-tooltip-wrap'))) {
            if (!isNOU(document.querySelector('#' + this.element.id + ' [data-tooltip-id]'))) {
                const tooltipTargetEle: HTMLElement = <HTMLElement>document.querySelector('#' + this.element.id + ' [data-tooltip-id]');
                const dataContent: string = tooltipTargetEle.getAttribute('data-content');
                tooltipTargetEle.removeAttribute('data-content');
                tooltipTargetEle.setAttribute('title', dataContent);
                tooltipTargetEle.removeAttribute('data-tooltip-id');
            }
            if (!isNOU(this.tooltip)) {
                this.tooltip.destroy();
            }
        }
        else {
            if (!isNOU(this.tooltip)) {
                this.tooltip.destroy();
            }
        }
        let rangeInsideCodeBlock: boolean = false;
        if (!isNOU(this.parent.codeBlockModule)) {
            const range: Range = this.parent.getRange();
            rangeInsideCodeBlock = !isNOU(this.parent.formatter.editorManager.codeBlockObj.
                isValidCodeBlockStructure(range.startContainer))
                || !isNOU(this.parent.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(range.endContainer));
        }
        if (!isNOU(this.parent.getToolbar()) && !rangeInsideCodeBlock) {
            if (this.parent.inlineMode.enable) {
                if (!isSourceCodeEnabled) {
                    this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
                }
            } else {
                if (!isSourceCodeEnabled && !isNOU(this.parent.toolbarModule.baseToolbar.toolbarObj)) {
                    this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
                }
            }
        }
        this.removeEleFromDOM();
        this.isRendered = false;
    }

    private removeEleFromDOM(): void {
        const element: Element = this.popupObj.element;
        if (this.isRendered) {
            this.dropDownButtons.destroyDropDowns();
            this.colorPickerObj.destroyColorPicker();
            detach(element);
            const args: QuickToolbarEventArgs | Popup = this.popupObj;
            this.parent.trigger(events.quickToolbarClose, args);
        }
    }

    /**
     * Updates the status of the quick toolbar by enabling or disabling toolbar items
     * based on the current selection and editor state.
     *
     * @param {IToolbarStatus} args - An object containing the current toolbar status, including details about the selection and applied formatting.
     * @returns {void}
     * @public
     * @hidden
     */
    public updateStatus(args: IToolbarStatus): void {
        const options: ISetToolbarStatusArgs = {
            args: args,
            dropDownModule: this.dropDownButtons,
            parent: this.parent,
            tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.element),
            tbItems: this.quickTBarObj.toolbarObj.items
        };
        setToolbarStatus(options, true, this.parent);
        if (this.type === 'Text' && this.parent.quickToolbarSettings.text && this.parent.quickToolbarSettings.text.length > 0 && this.parent.quickToolbarModule.textQTBar) {
            const options: ISetToolbarStatusArgs = {
                args: args,
                dropDownModule: this.parent.quickToolbarModule.textQTBar.dropDownButtons,
                parent: this.parent,
                tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.parent.quickToolbarModule.textQTBar.element),
                tbItems: this.parent.quickToolbarModule.textQTBar.quickTBarObj.toolbarObj.items
            };
            setToolbarStatus(options, true, this.parent);
            updateUndoRedoStatus(this.parent.quickToolbarModule.textQTBar.quickTBarObj,
                                 this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
        if (!select('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA, this.parent.element)) {
            updateUndoRedoStatus(this.parent.getBaseToolbarObject(), this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
        this.previousToolbarStatus = args;
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
        this.quickTBarObj.destroy();
        this.quickTBarObj = null;
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.removeEleFromDOM();
            this.popupObj.destroy();
        }
        this.colorPickerObj = null;
        this.dropDownButtons = null;
        this.stringItems = null;
        this.dropDownButtons = null;
        this.colorPickerObj = null;
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
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        if (this.parent.inlineMode.enable || (this.type === 'Text' && this.parent.quickToolbarSettings.text && this.parent.quickToolbarSettings.text.length > 0)) {
            this.parent.on(events.toolbarUpdated, this.updateStatus, this);
        }
        this.parent.on(events.bindCssClass, this.addCSSClass, this);
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {RichTextEditorModel} e - specifies the model element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    protected onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        if (!isNOU(e.newProp.inlineMode)) {
            for (const prop of Object.keys(e.newProp.inlineMode)) {
                switch (prop) {
                case 'enable':
                    if (e.newProp.inlineMode.enable) {
                        this.parent.on(events.toolbarUpdated, this.updateStatus, this);
                    } else {
                        this.parent.off(events.toolbarUpdated, this.updateStatus);
                    }
                    break;
                }
            }
        }
    }
    /**
     * removeEventListener method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public removeEventListener(): void {
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        if (this.parent.inlineMode.enable || (this.type === 'Text' && this.parent.quickToolbarSettings.text && this.parent.quickToolbarSettings.text.length > 0)) {
            this.parent.off(events.toolbarUpdated, this.updateStatus);
        }
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
            const contentPanel: HTMLDivElement | HTMLIFrameElement = this.parent.contentModule.getPanel() as HTMLDivElement;
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
        if (this.type === 'Audio' || this.type === 'Image' || this.type === 'Video') {
            this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
            this.parent.enableToolbarItem(['Undo', 'Redo']);
        }
    }
    // In this method we change the popup properties to position the popup on top, bottom of the target element also achieve sticky collision using the 'fit' collision type.
    private handleVerticalCollision(offsetParams: QuickToolbarOffsetParam, args: BeforeQuickToolbarOpenArgs): BeforeQuickToolbarOpenArgs {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.inputElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
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
            const withOutToolbarHeight: number = scrollTopParentElement === this.parent.inputElement ?
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
        args.targetElement = this.parent.contentModule.getPanel().parentElement;
        return args;
    }

    /**
     * Retrieves the previous toolbar status before the recent update.
     *
     * @returns {IToolbarStatus} An object representing the status of the toolbar including formatting and selection details.
     * @public
     * @hidden
     */
    public getPreviousStatus(): IToolbarStatus {
        return this.previousToolbarStatus;
    }
}


