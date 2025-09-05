import { BlockEditor } from '../base/blockeditor';
import { EventHandler, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { getAdjacentBlock, getBlockContentElement, getBlockIndexById, getBlockModelById, isListTypeBlock } from '../utils/block';
import { cleanupElement } from '../utils/common';
import { BlockModel } from '../models/index';
import { BlockDragEventArgs, BlockDropEventArgs } from '../base/eventargs';
import { getSelectedRange } from '../utils/selection';
import * as constants from '../base/constant';
import { BlockType } from '../base/enums';

/**
 * Drag and Drop module is used to perform block reordering actions.
 */
export class DragAndDropAction {

    private editor : BlockEditor;
    private dropIndicator: HTMLElement | null;
    private currentDropTarget: HTMLElement;
    private dragClone: HTMLElement;
    private isDragCompleted: boolean = false;
    private isDragMoveCancelled: boolean = false;
    private draggedBlocks: BlockModel[] = [];
    private isIndicatorAtTop: boolean = false;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    public wireDragEvents(): void {
        EventHandler.add(this.editor.element, 'dragover', this.updateCurrentDroppingTarget, this);
        EventHandler.add(this.editor.element, 'dragenter', this.preventNoDropIcon, this);
        if (!isNOU(this.editor.floatingIconContainer)) {
            const dragIcon: HTMLElement = this.editor.floatingIconContainer.children[1] as HTMLElement;
            if (!isNOU(dragIcon)) {
                EventHandler.add(dragIcon, 'dragstart', this.handleDragStart, this);
                EventHandler.add(dragIcon, 'drag', this.handleDragMove, this);
                EventHandler.add(dragIcon, 'dragend', this.handleDragStop, this);
            }
        }
    }

    public unwireDragEvents(): void {
        EventHandler.remove(this.editor.element, 'dragover', this.updateCurrentDroppingTarget);
        EventHandler.remove(this.editor.element, 'dragenter', this.preventNoDropIcon);
        if (!isNOU(this.editor.floatingIconContainer)) {
            const dragIcon: HTMLElement = this.editor.floatingIconContainer.children[1] as HTMLElement;
            if (!isNOU(dragIcon)) {
                EventHandler.remove(dragIcon, 'dragstart', this.handleDragStart);
                EventHandler.remove(dragIcon, 'drag', this.handleDragMove);
                EventHandler.remove(dragIcon, 'dragend', this.handleDragStop);
            }
        }
    }

    private preventNoDropIcon(e: DragEvent): void {
        e.preventDefault();
    }

    private updateCurrentDroppingTarget(e: DragEvent): void {
        e.preventDefault();
        const elementsAtPoint: Element[] = document.elementsFromPoint(e.clientX, e.clientY);
        const innerMostElement: HTMLElement | null = elementsAtPoint[0] as HTMLElement;
        const closestBlock: HTMLElement | null = innerMostElement.closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (innerMostElement && closestBlock) {
            this.currentDropTarget = closestBlock;
        }
        else {
            this.currentDropTarget = null;
        }
    }

    private handleDragMove(e: DragEvent): void {
        if (isNOU(this.editor.currentHoveredBlock)) { return; }
        this.isDragCompleted = false;
        const dropIndex: number = this.currentDropTarget ? getBlockIndexById(this.currentDropTarget.id, this.editor.getEditorBlocks()) : -1;
        const eventArgs: BlockDragEventArgs = {
            blocks: this.draggedBlocks,
            fromIndex: this.draggedBlocks.map((block: BlockModel) => getBlockIndexById(block.id, this.editor.getEditorBlocks())),
            dropIndex: dropIndex,
            event: e,
            target: this.currentDropTarget,
            cancel: false
        };
        this.editor.trigger('blockDrag', eventArgs, (dragEventArgs: BlockDragEventArgs) => {
            if (this.dragClone) {
                const editorRect: DOMRect = this.editor.element.getBoundingClientRect() as DOMRect;
                this.editor.floatingIconContainer.style.display = 'flex';
                const dragIcon: HTMLElement = this.editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                const dragIconRect: DOMRect = dragIcon.getBoundingClientRect() as DOMRect;
                this.editor.floatingIconContainer.style.display = 'none';
                this.dragClone.style.opacity = '0.7';
                const scrollTop: number = this.editor.element.scrollTop;
                const scrollLeft: number = this.editor.element.scrollLeft;
                this.dragClone.style.left = `${e.clientX - editorRect.left + dragIconRect.width + scrollLeft}px`;
                this.dragClone.style.top = `${e.clientY - editorRect.top + scrollTop}px`;
                const totalHeight: number = Array.from(this.dragClone.children)
                    .map((child: Element) => (child as HTMLElement).offsetHeight)
                    .reduce((sum: number, height: number) => sum + height, 0);
                this.dragClone.style.width = this.editor.currentHoveredBlock.offsetWidth + 'px';
                this.dragClone.style.height = `${totalHeight}px`;
                if (
                    e.clientY < editorRect.top ||
                    e.clientY > editorRect.bottom ||
                    e.clientX < editorRect.left ||
                    e.clientX > editorRect.right
                ) {
                    this.dragClone.style.opacity = '0';
                }
            }
            // To prevent the flickering of the drop indicator when drag towards up
            setTimeout(() => {
                this.updateDropIndicator();
            }, 50);
            if (dragEventArgs.cancel) {
                this.isDragMoveCancelled = true;
                return;
            }
            else {
                this.isDragMoveCancelled = false;
            }
        });
    }

    private handleDragStart(e: DragEvent): void {
        this.isDragCompleted = false;
        this.isDragMoveCancelled = false;
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        if (!(e.target as HTMLElement).classList.contains('e-block-drag-icon') || !this.editor.currentHoveredBlock) {
            return;
        }
        let selectedBlocks: BlockModel[] = [];
        const range: Range = getSelectedRange();
        if (range && range.toString().trim().length > 0) {
            selectedBlocks = this.editor.getSelectedBlocks();
        }
        else {
            const blockModel: BlockModel = getBlockModelById(this.editor.currentHoveredBlock.id, editorBlocks);
            if (blockModel) {
                selectedBlocks.push(blockModel);
            }
        }
        this.draggedBlocks = selectedBlocks;
        const eventArgs: BlockDragEventArgs = {
            blocks: this.draggedBlocks,
            fromIndex: this.draggedBlocks.map((block: BlockModel) => getBlockIndexById(block.id, editorBlocks)),
            dropIndex: this.currentDropTarget ? getBlockIndexById(this.currentDropTarget.id, editorBlocks) : -1,
            event: e,
            target: this.currentDropTarget,
            cancel: false
        };
        this.editor.trigger('blockDragStart', eventArgs, (dragEventArgs: BlockDragEventArgs) => {
            if (dragEventArgs.cancel) {
                e.preventDefault();
                return;
            }
            this.dragClone = document.createElement('div');
            this.dragClone.style.position = 'absolute';
            this.dragClone.style.opacity = '0';
            this.dragClone.style.pointerEvents = 'none';
            this.dragClone.classList.add('dragging-clone');

            for (const block of selectedBlocks) {
                const blockElement: HTMLElement = document.getElementById(block.id);
                if (blockElement) {
                    this.dragClone.appendChild(blockElement.cloneNode(true));
                }
            }
            this.editor.blockWrapper.appendChild(this.dragClone);

            const transparentImage: HTMLImageElement = new Image();
            transparentImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='; // 1x1 transparent pixel
            e.dataTransfer.setDragImage(transparentImage, 0, 0);
        });
    }

    private handleDragStop(e: MouseEvent): void {
        if (isNOU(this.editor.currentHoveredBlock)) { return; }
        if (this.isDragMoveCancelled) {
            cleanupElement(this.dragClone);
            cleanupElement(this.dropIndicator);
            return;
        }

        e.preventDefault();
        this.isDragCompleted = true;
        let currentIndicatorBlock: HTMLElement | null;
        if (this.dropIndicator) {
            currentIndicatorBlock = this.dropIndicator.closest('.' + constants.BLOCK_CLS) as HTMLElement;
        }
        let dropTarget: HTMLElement | null;
        if (currentIndicatorBlock) {
            const hoveredBlockRect: DOMRect = this.editor.currentHoveredBlock.getBoundingClientRect() as DOMRect;
            const isMovingDown: boolean = hoveredBlockRect.top < currentIndicatorBlock.getBoundingClientRect().top;
            if (!this.isIndicatorAtTop && !isMovingDown) {
                dropTarget = getAdjacentBlock(currentIndicatorBlock, 'next');
                if (isNOU(dropTarget)) {
                    dropTarget = currentIndicatorBlock;
                }
            }
            else {
                dropTarget = currentIndicatorBlock;
            }
        }
        const eventArgs: BlockDropEventArgs = {
            blocks: this.draggedBlocks.map((block: BlockModel) => block),
            fromIndex: this.draggedBlocks.map((block: BlockModel) => getBlockIndexById(block.id, this.editor.getEditorBlocks())),
            dropIndex: dropTarget ? getBlockIndexById(dropTarget.id, this.editor.getEditorBlocks()) : -1,
            event: e,
            target: dropTarget
        };
        this.editor.trigger('blockDrop', eventArgs);
        cleanupElement(this.dragClone);
        cleanupElement(this.dropIndicator);

        if (dropTarget && dropTarget !== this.editor.currentHoveredBlock) {
            this.reorderBlocks(this.draggedBlocks, dropTarget);
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
        this.draggedBlocks = [];
    }

    private reorderBlocks(draggedBlocks: BlockModel[], dropTarget: HTMLElement): void {
        this.editor.blockCommandManager.moveBlock({
            fromBlockIds: draggedBlocks.map((block: BlockModel) => block.id),
            toBlockId: dropTarget.id
        });
    }

    private updateDropIndicator(): void {
        if (
            this.isDragCompleted ||
            !this.currentDropTarget ||
            this.currentDropTarget === this.editor.currentHoveredBlock ||
            this.draggedBlocks.some((block: BlockModel) => block.id === this.currentDropTarget.id)
        ) {
            cleanupElement(this.dropIndicator);
            return;
        }
        if (!this.dropIndicator) {
            this.dropIndicator = document.createElement('div');
            this.dropIndicator.classList.add('drop-indicator');
        }
        const hoverdBlockRect: DOMRect = this.editor.currentHoveredBlock.getBoundingClientRect() as DOMRect;
        const dropTargetRect: DOMRect = this.currentDropTarget.getBoundingClientRect() as DOMRect;
        const middleY: number = dropTargetRect.top + (dropTargetRect.height / 2);
        let draggedBlockRect: DOMRect;
        if (this.dragClone) {
            draggedBlockRect = this.dragClone.children[0].getBoundingClientRect() as DOMRect;
        }
        if (isNOU(draggedBlockRect) || isNOU(hoverdBlockRect)) { return; }
        if (hoverdBlockRect.top > draggedBlockRect.top) {
            this.handleDraggingAbove(middleY, draggedBlockRect);
        }
        else {
            this.handleDraggingBelow(middleY, draggedBlockRect);
        }
        const currentIndicatorBlock: HTMLElement = this.dropIndicator.closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (!currentIndicatorBlock) { return; }
        const indicatorBlockModel: BlockModel = getBlockModelById(currentIndicatorBlock.id, this.editor.getEditorBlocks());
        const specialTypes: string[] = [BlockType.Divider, BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading, BlockType.Callout, 'Table', BlockType.Image, BlockType.Code];
        const isSpecialType: boolean = (specialTypes.indexOf(indicatorBlockModel.type) > -1);

        if (isSpecialType) {
            (this.dropIndicator as HTMLElement).style.left = '46px';
            return;
        }
        const blockContent: HTMLElement = getBlockContentElement(currentIndicatorBlock) as HTMLElement;
        if (!blockContent) { return; }

        const leftOffset: number = blockContent.getBoundingClientRect().left - currentIndicatorBlock.getBoundingClientRect().left;
        (this.dropIndicator as HTMLElement).style.left = `${leftOffset}px`;
    }

    private handleDraggingAbove(middleY: number, draggedBlockRect: DOMRect): void {
        if (draggedBlockRect && draggedBlockRect.top < middleY) {
            const adjecentBLockEle: HTMLElement = this.currentDropTarget.previousElementSibling as HTMLElement;
            if (adjecentBLockEle) {
                if (!this.checkAndInsertIndicatorInListBlock(adjecentBLockEle, true)) {
                    adjecentBLockEle.appendChild(this.dropIndicator);
                }
                this.isIndicatorAtTop = false;
            }
            else {
                if (!this.checkAndInsertIndicatorInListBlock(this.currentDropTarget, false)) {
                    this.currentDropTarget.prepend(this.dropIndicator);
                }
                this.isIndicatorAtTop = true;
            }
        }
    }

    private handleDraggingBelow(middleY: number, draggedBlockRect: DOMRect): void {
        if (draggedBlockRect && draggedBlockRect.top > middleY) {
            if (!this.checkAndInsertIndicatorInListBlock(this.currentDropTarget, true)) {
                this.currentDropTarget.appendChild(this.dropIndicator);
            }
            this.isIndicatorAtTop = false;
        }
    }

    private checkAndInsertIndicatorInListBlock(element: HTMLElement, isAfter: boolean): boolean {
        if (isListTypeBlock(element.getAttribute('data-block-type'))) {
            const listItem: HTMLElement | null = element.querySelector('li');
            if (listItem) {
                listItem.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', this.dropIndicator);
                return true;
            }
        }
        return false;
    }

    public destroy(): void {
        this.unwireDragEvents();
    }
}
