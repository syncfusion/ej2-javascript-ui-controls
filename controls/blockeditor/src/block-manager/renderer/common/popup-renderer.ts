import { Dialog, Popup, PopupModel } from '@syncfusion/ej2-popups';
import { InlineToolbarOffsetParam, InlineToolbarPositionProps, IPopupRenderOptions } from '../../../common/interface';
import { addClass, removeClass, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlockManager } from '../../base/block-manager';
import { InlineToolbarCollision, SelectionDirection } from '../../../common/types';
import { getElementRect } from '../../../common/utils/dom';

/**
 * `Popup renderer` module is used to render popup in BlockEditor.
 *
 * @hidden
 */
export class PopupRenderer {
    private parent: BlockManager;
    private editorElement: HTMLElement;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.editorElement = this.parent.rootEditorElement;
    }

    /**
     * Renders popup in BlockEditor.
     *
     * @param {IPopupRenderOptions} args - specifies  the arguments.
     * @returns {Popup} - returns the popup object.
     * @hidden
     */
    public renderPopup(args?: IPopupRenderOptions): Popup {
        let element: string | HTMLElement = args.element;
        if (typeof element == 'string') {
            element = document.querySelector(element) as HTMLElement;
        }
        const popupObj: Popup = new Popup(element, {
            targetType: 'relative',
            relateTo: this.editorElement,
            content: args.content,
            collision: { X: 'fit', Y: 'fit' },
            actionOnScroll: 'hide',
            showAnimation: {
                name: 'FadeIn'
            },
            width: args.width,
            height: args.height
        });
        popupObj.hide();

        return popupObj;
    }

    /**
     * Adjusts the popup position relative to the target element.
     *
     * @param {HTMLElement | Range} target - specifies the target element.
     * @param {Popup | Dialog} popup - specifies the popup object.
     * @returns {void}
     * @hidden
     */
    public adjustPopupPositionRelativeToTarget(target: HTMLElement | Range, popup: Popup | Dialog): void {
        const isInlineTbar: boolean = popup.element.classList.contains('e-blockeditor-inline-toolbar-popup');
        const isblkActionPopup: boolean = popup.element.classList.contains('e-blockeditor-blockaction-popup');
        const isTableGripperPopup: boolean = popup.element.classList.contains('e-table-gripper-action-popup');
        if (isblkActionPopup) {
            this.positionBlockActionPopup(target, popup as Popup);
        }
        else if (isInlineTbar) {
            this.positionInlineToolbar(target, popup as Popup);
        }
        else if (isTableGripperPopup) {
            this.positionTableGripperActionPopup(target as HTMLElement, popup as Popup);
        }
    }

    private positionBlockActionPopup(target: HTMLElement | Range, popup: Popup): void {
        addClass([popup.element], 'e-be-action-popup-hide');
        const targetRect: DOMRect = target.getBoundingClientRect() as DOMRect;
        const popupRect: DOMRect = popup.element.getBoundingClientRect() as DOMRect;
        const editorRect: DOMRect = getElementRect(this.editorElement);
        const editorScrollTop: number = this.editorElement.scrollTop || 0;
        const adjustedX: number = targetRect.left - editorRect.left;
        let adjustedY: number = targetRect.top + editorScrollTop - editorRect.top + 30;
        // To position popup above the drag icon when it overflows out of editor.
        if (targetRect.bottom + popupRect.height > editorRect.bottom) {
            adjustedY = adjustedY - popupRect.height - targetRect.height - 15;
        }
        popup.position.X = adjustedX;
        popup.position.Y = adjustedY;
        removeClass([popup.element], 'e-be-action-popup-hide');
        popup.dataBind();
    }

    private positionInlineToolbar(target: HTMLElement | Range, popup: Popup): void {
        addClass([popup.element], 'e-be-inline-tlbr-hide');
        const popupRect: DOMRect = popup.element.getBoundingClientRect() as DOMRect;
        const relativeElem: HTMLElement = this.parent.currentFocusedBlock;
        if (isNOU(relativeElem)) {
            return;
        }
        const selection: Selection = this.parent.nodeSelection.getSelection();
        const clientRects: DOMRectList = target.getClientRects() as DOMRectList;
        const direction: SelectionDirection = this.getSelectionDirection(selection);
        const rangeDomRect: DOMRect = clientRects.length === 0 ? target.getBoundingClientRect() as DOMRect :
            direction === 'Backward' ? clientRects[0] : clientRects[clientRects.length - 1];
        const offsetCalculationParam: InlineToolbarOffsetParam = {
            blockElement: relativeElem,
            blockRect: relativeElem.getBoundingClientRect() as DOMRect,
            range: target as Range,
            rangeRect: rangeDomRect,
            direction: direction,
            contentPanelElement: this.parent.rootEditorElement,
            editPanelDomRect: this.parent.blockContainer.getBoundingClientRect() as DOMRect,
            popupRect: popupRect
        };
        const offsetX: number = this.calculateOffsetX(offsetCalculationParam);
        const offsetY: number = this.calculateOffsetY(offsetCalculationParam);
        let positionProps: InlineToolbarPositionProps = {
            positionX: offsetX,
            positionY: offsetY
        };
        positionProps = this.handleVerticalCollision(offsetCalculationParam, positionProps);
        const popupProps: PopupModel = {
            offsetX: positionProps.positionX,
            offsetY: positionProps.positionY,
            relateTo: relativeElem
        };
        removeClass([popup.element], 'e-be-inline-tlbr-hide');
        popup.setProperties(popupProps);
        popup.dataBind();
    }

    // To calculate the popup offsetX position based on the range and block element position.
    private calculateOffsetX(args: InlineToolbarOffsetParam): number {
        const width: number = args.popupRect.width;
        let finalX: number;
        const buffer: number = 16.5; // A small gap between selection and popup
        const rangeEdge: number = args.direction === 'Backward' ? args.rangeRect.left : args.rangeRect.right;
        const relativePosition: number = rangeEdge - args.blockRect.left;
        if (relativePosition < width / 4) {
            finalX = relativePosition - buffer;
        } else if (relativePosition > width / 4 && relativePosition < width / 2) {
            finalX = relativePosition - width / 4;
        } else if (relativePosition > width / 2 && relativePosition < (width * 3 / 4)) {
            finalX = relativePosition - width / 2;
        } else if (relativePosition > (width * 3 / 4) && relativePosition < width) {
            finalX = relativePosition - (width * 3 / 4);
        } else {
            finalX = relativePosition - width + buffer;
        }
        return finalX;
    }

    // To calculate the popup offsetY position based on the range and block element position.
    private calculateOffsetY(args: InlineToolbarOffsetParam): number {
        const finalY: number = args.rangeRect.bottom - args.blockRect.top + 6;
        return finalY;
    }

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

    private handleVerticalCollision(
        offsetParams: InlineToolbarOffsetParam,
        positionProps: InlineToolbarPositionProps
    ): InlineToolbarPositionProps {
        const scrollTopParentElement: HTMLElement = this.parent.scrollParentElements && this.parent.scrollParentElements.length > 0 &&
        this.parent.scrollParentElements[0].nodeName !== '#document' ? this.parent.scrollParentElements[0] : this.parent.rootEditorElement;
        const scrollParentRect: DOMRect = scrollTopParentElement.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = offsetParams.blockRect;
        const topViewPortSpace: number = blockRect.top;
        const botViewPortSpace: number = blockRect.bottom;
        const spaceAbove: number = this.getSpaceAbove(
            offsetParams, scrollParentRect);
        const spaceBelow: number = this.getSpaceBelow(
            offsetParams, scrollParentRect);
        const totalPopupHeight: number = (10 + offsetParams.popupRect.height); // 10 si for tip pointer height
        const isTopPosition: boolean = this.isElemVisible(blockRect, 'top') && spaceAbove > totalPopupHeight && topViewPortSpace > totalPopupHeight;
        const isBotPosition: boolean = offsetParams.direction === 'Backward'  && isTopPosition ? false : this.isElemVisible(blockRect, 'bottom') && spaceBelow > totalPopupHeight && botViewPortSpace > totalPopupHeight;
        if (isBotPosition) {
            return positionProps; // Default Bottom position no need to change offset.
        } else if (isTopPosition) {
            positionProps.positionY = -(offsetParams.popupRect.height + 10) + (offsetParams.rangeRect.top - offsetParams.blockRect.top);
        }
        return positionProps;
    }

    private getSpaceAbove(args: InlineToolbarOffsetParam, scrollParentRect: DOMRect): number {
        let spaceAbove: number;
        const blockRect: DOMRect = args.blockRect;
        const parentRect: DOMRect = args.editPanelDomRect;
        const collision: InlineToolbarCollision = this.getTopCollisionType(blockRect, parentRect
            , scrollParentRect);
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
        return spaceAbove;
    }

    private getSpaceBelow(args: InlineToolbarOffsetParam, scrollParentRect: DOMRect): number {
        let spaceBelow: number;
        const blockRect: DOMRect = args.blockRect;
        const parentRect: DOMRect = args.editPanelDomRect;
        const collision: InlineToolbarCollision = this.getBottomCollisionType(blockRect, parentRect, scrollParentRect);
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
        if ((window.innerHeight - blockRect.bottom) < (args.popupRect.height + 10)) { // check this 10 is tip pointer height
            spaceBelow = 0;
        }
        return spaceBelow;
    }

    private getTopCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect): InlineToolbarCollision{
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

    private getBottomCollisionType(blockRect: DOMRect, parentRect: DOMRect, scrollParentRect: DOMRect): InlineToolbarCollision {
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

    // Returns true when the eleemnt is partially visible. Returns false when the element is not fully visible.
    private isElemVisible(elemRect: DOMRect, value: 'top' | 'bottom'): boolean {
        if (value === 'top') {
            return elemRect.top >= 0 && elemRect.top <= window.innerHeight;
        } else {
            return elemRect.bottom <= window.innerHeight && elemRect.bottom >= 0;
        }
    }

    private positionTableGripperActionPopup(target: HTMLElement, popup: Popup): void {
        addClass([popup.element], 'e-be-gripper-action-popup-hide');

        const isColumnGripper: boolean = target.classList.contains('e-col-action-handle');
        const popupRect: DOMRect = popup.element.getBoundingClientRect() as DOMRect;
        const targetRect: DOMRect = target.getBoundingClientRect() as DOMRect;
        const editorRect: DOMRect = this.editorElement.getBoundingClientRect() as DOMRect;
        const scrollTop: number = this.editorElement.scrollTop;

        const offsetX: number = (targetRect.left - editorRect.left) + (isColumnGripper ? (targetRect.width / 2 - popupRect.width / 2) : 0);
        const offsetY: number = targetRect.top + scrollTop - editorRect.top - popupRect.height - 5;

        popup.position.X = offsetX;
        popup.position.Y = offsetY;

        removeClass([popup.element], 'e-be-gripper-action-popup-hide');
        popup.dataBind();
    }

    public destroyPopup(popup: Popup): void {
        if (popup) {
            popup.destroy();
            popup.element.remove();
        }
    }
}
