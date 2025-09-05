import { EventHandler } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { captureSelectionState, isolateModel, getAbsoluteOffset, getAdjacentBlock, getBlockContentElement,
    getBlockIndexById,
    getBlockModelById, getClosestContentElementInDocument, getParentBlock, getSelectedRange,
    isCursorAtEdge, isListTypeBlock, sanitizeBlock, sanitizeContents, setCursorPosition } from '../utils/index';
import { BlockModel, CollapsibleProps, ContentModel } from '../models/index';
import { BlockAddedEventArgs, BlockMovedEventArgs, BlockRemovedEventArgs, BlockType, BlurEventArgs, DeletionType, FocusEventArgs, IFromBlockData, ITransformOperation, SelectionChangedEventArgs } from '../base/index';
import { findClosestParent, getElementRect } from '../utils/dom';
import { actionType, events } from '../base/constant';
import * as constants from '../base/constant';

/**
 * Manages all event handlers for the BlockEditor component
 * This class centralizes event handling logic and provides a clean interface
 * for wiring and unwiring events across the editor
 */
export class EventManager {
    private editor: BlockEditor;

    /**
     * Creates a new EventHandlerManager instance
     *
     * @param {BlockEditor} editor The parent BlockEditor instance
     */
    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Wires up all global event handlers for the editor
     *
     * @returns {void}
     * @hidden
     */
    wireGlobalEvents(): void {
        // Document events
        EventHandler.add(document, 'selectionchange', this.handleEditorSelection, this);
        EventHandler.add(document, 'scroll', this.handleScrollActions, this);
        EventHandler.add(document, 'click', this.handleDocumentClickActions, this);
        EventHandler.add(document, 'mousemove', this.handleMouseMoveActions, this);

        // Editor events
        EventHandler.add(this.editor.element, 'scroll', this.handleScrollActions, this);
        EventHandler.add(this.editor.element, 'mouseup', this.handleMouseUpActions, this);
        EventHandler.add(this.editor.element, 'mousedown', this.handleMouseDownActions, this);
        EventHandler.add(this.editor.element, 'input', this.handleEditorInputActions, this);
        EventHandler.add(this.editor.element, 'keyup', this.handleKeyupActions, this);
        EventHandler.add(this.editor.element, 'keydown', this.handleKeydownActions, this);
        EventHandler.add(this.editor.element, 'click', this.handleEditorClickActions, this);
        EventHandler.add(this.editor.element, 'copy', this.clipboardActionHandler, this);
        EventHandler.add(this.editor.element, 'cut', this.clipboardActionHandler, this);
        EventHandler.add(this.editor.element, 'paste', this.clipboardActionHandler, this);
        EventHandler.add(this.editor.blockWrapper, 'focus', this.handleEditorFocusActions, this);
        EventHandler.add(this.editor.blockWrapper, 'blur', this.handleEditorBlurActions, this);
    }

    /**
     * Unwires all global event handlers for the editor
     *
     * @returns {void}
     * @hidden
     */
    unWireGlobalEvents(): void {
        // Document events
        EventHandler.remove(document, 'selectionchange', this.handleEditorSelection);
        EventHandler.remove(document, 'scroll', this.handleScrollActions);
        EventHandler.remove(document, 'click', this.handleDocumentClickActions);
        EventHandler.remove(document, 'mousemove', this.handleMouseMoveActions);
        EventHandler.remove(this.editor.element, 'scroll', this.handleScrollActions);

        // Editor events
        EventHandler.remove(this.editor.element, 'mouseup', this.handleMouseUpActions);
        EventHandler.remove(this.editor.element, 'mousedown', this.handleMouseDownActions);
        EventHandler.remove(this.editor.element, 'input', this.handleEditorInputActions);
        EventHandler.remove(this.editor.element, 'keydown', this.handleKeydownActions);
        EventHandler.remove(this.editor.element, 'click', this.handleEditorClickActions);
        EventHandler.remove(this.editor.element, 'copy', this.clipboardActionHandler);
        EventHandler.remove(this.editor.element, 'cut', this.clipboardActionHandler);
        EventHandler.remove(this.editor.element, 'paste', this.clipboardActionHandler);
        EventHandler.remove(this.editor.blockWrapper, 'focus', this.handleEditorFocusActions);
        EventHandler.remove(this.editor.blockWrapper, 'blur', this.handleEditorBlurActions);
    }

    private handleEditorSelection(): void {
        const range: Range = this.editor.nodeSelection.getRange();
        if (!range) { return; }
        const isMoreThanSingleSelection: boolean = (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset);
        if (isMoreThanSingleSelection && this.editor.element.contains(range.commonAncestorContainer)) {
            this.editor.isEntireEditorSelected = this.editor.nodeSelection.checkIsEntireEditorSelected();
        }
    }

    private handleScrollActions(event: Event): void {
        this.editor.floatingIconManager.hideFloatingIcons();
        if (this.editor.linkModule) {
            this.editor.linkModule.hideLinkPopup();
        }
        if (this.editor.blockActionMenuModule) {
            this.editor.blockActionMenuModule.toggleBlockActionPopup(true);
        }
        if (this.editor.inlineToolbarModule) {
            this.editor.inlineToolbarModule.hideInlineToolbar(event);
        }
    }

    private handleMouseMoveActions(moveEvent: MouseEvent): void {
        if (this.editor.contextMenuModule.isPopupOpen() || this.editor.blockActionMenuModule.isPopupOpen()) {
            return;
        }
        const blockElement: HTMLElement = (moveEvent.target as HTMLElement).closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (blockElement) {
            if (blockElement !== this.editor.currentHoveredBlock) {
                if (this.editor.currentHoveredBlock) {
                    this.editor.floatingIconManager.hideFloatingIcons();
                }
                this.editor.currentHoveredBlock = blockElement;
                this.editor.floatingIconManager.showFloatingIcons(this.editor.currentHoveredBlock);
            }
        } else if (this.editor.currentHoveredBlock) {
            if (this.editor.floatingIconContainer && !this.editor.floatingIconContainer.contains(moveEvent.target as HTMLElement)) {
                this.editor.floatingIconManager.hideFloatingIcons();
                this.editor.currentHoveredBlock = null;
            }
        }
    }

    private handleEditorInputActions(inputEvent: Event): void {
        this.editor.notify('input', inputEvent);

        this.processEntireEditorSelection();
        this.updateUIAfterInput(inputEvent);
        this.filterSlashCommandOnUserInput();
        if (this.processFormattingActions()) { return; }
        this.throttleContentUpdate(inputEvent);
    }

    private processEntireEditorSelection(): void {
        if (this.editor.isEntireEditorSelected) {
            const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
            const allBlocks: BlockModel[] = editorBlocks.map((block: BlockModel) => isolateModel(sanitizeBlock(block)));

            this.editor.setFocusToBlock(this.editor.blockWrapper.firstElementChild as HTMLElement);
            this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            editorBlocks.splice(1);
            this.editor.stateManager.updatePropChangesToModel();
            this.editor.isProtectedOnChange = prevOnChange;
            this.editor.isEntireEditorSelected = false;

            this.editor.undoRedoAction.pushActionIntoUndoStack({
                action: actionType.multipleBlocksDeleted,
                oldBlockModel: editorBlocks[0],
                data: {
                    deletedBlocks: allBlocks,
                    deletionType: DeletionType.Entire
                }
            });
        }
    }

    private updateUIAfterInput(inputEvent: Event): void {
        if (this.editor.inlineToolbarModule) {
            this.editor.inlineToolbarModule.hideInlineToolbar(inputEvent);
        }

        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
        this.editor.floatingIconManager.hideDragIconForEmptyBlock(this.editor.currentFocusedBlock);

        const blockContent: HTMLElement = getBlockContentElement(this.editor.currentFocusedBlock);
        if (blockContent && blockContent.textContent.length <= 1) {
            this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
        }
    }

    private processFormattingActions(): boolean {
        if ((this.editor.formattingAction.activeInlineFormats && this.editor.formattingAction.activeInlineFormats.size > 0)
            || this.editor.formattingAction.lastRemovedFormat) {
            return this.editor.formattingAction.handleTypingWithActiveFormats();
        }
        return false;
    }

    private throttleContentUpdate(inputEvent: Event): void {
        clearTimeout(this.editor.updateTimer);
        this.editor.updateTimer = setTimeout(() => {
            const target: HTMLElement = this.editor.currentFocusedBlock as HTMLElement;
            this.editor.stateManager.updateContentOnUserTyping(target, inputEvent);
        }, 100);
    }

    private handleDocumentClickActions(clickEvent: MouseEvent): void {
        if (!this.editor.element.contains(clickEvent.target as HTMLElement)
            && (this.editor.floatingIconContainer && !this.editor.floatingIconContainer.contains(clickEvent.target as HTMLElement))) {
            this.editor.floatingIconManager.hideFloatingIcons();
        }
        this.editor.isEntireEditorSelected = false;
        this.editor.notify(events.documentClick, clickEvent);
        this.togglePopupsOnDocumentClick(clickEvent);
    }

    private handleEditorFocusActions(focusEvent: Event): void {
        setTimeout(() => {
            const range: Range = getSelectedRange();
            if (!range || !this.editor.currentFocusedBlock) { return; }
            this.editor.trigger('focus', {
                event: focusEvent,
                blockId: this.editor.currentFocusedBlock.id,
                selectionRange: [range.startOffset, range.endOffset]
            });
        }, 200);
    }

    private handleEditorBlurActions(blurEvent: Event): void {
        this.editor.trigger('blur', {
            event: blurEvent,
            blockId: this.editor.currentFocusedBlock.id
        });
    }

    private handleEditorClickActions(clickEvent: MouseEvent): void {
        this.editor.notify(events.editorClick, clickEvent);
    }

    private handleKeyupActions(event: KeyboardEvent): void {
        this.editor.notify('keyup', event);
    }

    private handleKeydownActions(keyEvent: KeyboardEvent): void {
        this.editor.previousSelection = captureSelectionState();
        this.editor.notify('keydown', keyEvent);

        if (!this.validateKeyEventProcessability(keyEvent)) {
            return;
        }

        this.handleInlineTbarStates(keyEvent);

        if (this.isAnyPopupOpen()) { return; }

        this.processKeyboardShortcuts(keyEvent);
    }

    private validateKeyEventProcessability(keyEvent: KeyboardEvent): boolean {
        const blockModel: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        const isUpDownArrows: boolean = ['ArrowUp', 'ArrowDown'].indexOf(keyEvent.key) !== -1;
        const isControlUpDownShift: boolean = keyEvent.ctrlKey && isUpDownArrows && keyEvent.shiftKey;

        return blockModel && !isControlUpDownShift;
    }

    private handleInlineTbarStates(keyEvent: KeyboardEvent): void {
        const isArrowKeys: boolean = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(keyEvent.key) !== -1;
        const isLeftRightArrows: boolean = ['ArrowLeft', 'ArrowRight'].indexOf(keyEvent.key) !== -1;
        const isControlKey: boolean = keyEvent.ctrlKey || keyEvent.metaKey;
        const isShiftKey: boolean = keyEvent.shiftKey;

        if (keyEvent.key === 'Escape' || (!isControlKey && isArrowKeys && !isShiftKey)) {
            this.editor.inlineToolbarModule.hideInlineToolbar(keyEvent);
        } else if ((isControlKey && isLeftRightArrows && isShiftKey)) {
            this.showInlineToolbarWithDelay(keyEvent);
        }
    }

    private showInlineToolbarWithDelay(keyEvent: KeyboardEvent): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('.' + constants.INLINE_TBAR_POPUP_CLS);

        if (!(inlineTbarPopup && inlineTbarPopup.classList.contains('e-popup-open'))) {
            setTimeout(() => {
                const range: Range = getSelectedRange();
                this.editor.inlineToolbarModule.showInlineToolbar(range, keyEvent);
            });
        }
    }

    private processKeyboardShortcuts(keyEvent: KeyboardEvent): void {
        const blockElement: HTMLElement = this.editor.currentFocusedBlock;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());

        if (this.processListBlockEvents(keyEvent, blockElement, blockModel)) { return; }

        this.handleBlockKeyActions(keyEvent);
    }

    private isAnyPopupOpen(): boolean {
        const commandPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-command-menu') as HTMLElement;
        const userMentionPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-user-menu') as HTMLElement;
        const labelMentionPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-label-menu') as HTMLElement;
        const blockModel: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        const notAllowedTypes: string[] = [BlockType.Code, BlockType.Image];

        return this.editor.mentionRenderer.isPopupOpen ||
            (commandPopupElement && commandPopupElement.classList.contains('e-popup-open')) ||
            (userMentionPopupElement && userMentionPopupElement.classList.contains('e-popup-open')) ||
            (labelMentionPopupElement && labelMentionPopupElement.classList.contains('e-popup-open')) ||
            (blockModel && notAllowedTypes.indexOf(blockModel.type) !== -1);
    }

    private processListBlockEvents(keyEvent: KeyboardEvent, blockElement: HTMLElement, blockModel: BlockModel): boolean {
        this.editor.listBlockAction.handleListTriggerKey(keyEvent, blockElement, blockModel);

        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
        const isSelectiveDeletions: boolean = this.editor.isEntireEditorSelected || (selectedBlocks && selectedBlocks.length > 1);

        if (blockModel && isListTypeBlock(blockModel.type) && !isSelectiveDeletions) {
            return this.editor.listBlockAction.handleListKeyActions(keyEvent, blockElement);
        }
        return false;
    }

    private handleMouseUpActions(mouseEvent: MouseEvent): void {
        if (this.editor.readOnly) { return; }
        const blockElement: HTMLElement = (mouseEvent.target as HTMLElement).closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (blockElement && (this.editor.currentFocusedBlock !== blockElement)) {
            this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
            this.editor.setFocusToBlock(blockElement);
            this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
            this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
            if (blockElement.innerText.length === 0) {
                setCursorPosition(getBlockContentElement(blockElement), 0);
            }
        }
        setTimeout(() => {
            this.handleTextSelection(mouseEvent);
        });
        this.editor.notify('mouseup', mouseEvent);
    }

    private handleMouseDownActions(mouseEvent: MouseEvent): void {
        this.editor.isEntireEditorSelected = false;
        if (this.editor.readOnly) { return; }
        const blockElement: HTMLElement = (mouseEvent.target as HTMLElement).closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (blockElement && (this.editor.currentFocusedBlock !== blockElement)) {
            if (blockElement.innerText.length === 0) {
                setCursorPosition(getBlockContentElement(blockElement), 0);
            }
        }
    }

    private clipboardActionHandler(e: KeyboardEvent): void {
        let isActionExecuted: boolean = false;
        const prop: string = e.type.toLowerCase();
        switch (prop) {
        case 'cut':
            this.editor.notify(events.cut, e);
            isActionExecuted = true;
            break;
        case 'copy':
            this.editor.notify(events.copy, e);
            isActionExecuted = true;
            break;
        case 'paste':
            this.editor.notify(events.paste, e);
            isActionExecuted = true;
            break;
        }
        if (isActionExecuted && this.editor.keyActionExecuted) {
            const normalizedKey: string = prop === 'cut' ? 'ctrl+x' : prop === 'copy' ? 'ctrl+c' : 'ctrl+v';
            this.editor.trigger('keyActionExecuted', {
                keyCombination: normalizedKey, action: prop
            });
        }
    }

    private handleTextSelection(event: Event): void {
        const range: Range = this.editor.nodeSelection.getRange();
        // this.editor.nodeSelection.updateSelectionRangeOnUserModel();
        if (!range || range.toString().trim().length === 0) {
            this.editor.inlineToolbarModule.hideInlineToolbar(event);
            return;
        }
        const previousRange: Range = this.editor.nodeSelection.getStoredRange();
        const selectionArgs: SelectionChangedEventArgs = {
            event: event,
            // user: this.editor.users.find((user: UserModel) => user.id === this.editor.currentUserId),
            range: [range.startOffset, range.endOffset],
            previousRange: previousRange ? [previousRange.startOffset, previousRange.endOffset] : null
        };
        this.editor.trigger('selectionChanged', selectionArgs);
        this.editor.nodeSelection.storeCurrentRange();
        const rect: DOMRect = range.getBoundingClientRect() as DOMRect;

        if (range && rect) {
            const parentBlock: HTMLElement = getParentBlock(range.commonAncestorContainer as HTMLElement);
            if (parentBlock && parentBlock.classList.contains('e-block')) {
                this.editor.inlineToolbarModule.showInlineToolbar(range, event);
            } else {
                this.editor.inlineToolbarModule.hideInlineToolbar(event);
            }
        }
    }

    private handleBlockKeyActions(event: KeyboardEvent): void {
        const blockElement: HTMLElement = this.editor.currentFocusedBlock;
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            this.handleArrowKeyActions(event, getSelectedRange(), blockElement);
            this.editor.isEntireEditorSelected = false;
            break;
        case 'Enter':
            this.processEnterKey(event, blockElement);
            break;
        case 'Backspace':
        case 'Delete':
            this.processBlockDeletions(event, blockElement, blockElement.getAttribute('data-block-type'), contentElement);
            break;
        case 'Tab':
        case 'Shift+Tab':
            this.processTabKey(event);
            break;
        case 'Home':
        case 'End': {
            if (!event.shiftKey) {
                this.handleHomeEndKeyActions(event, blockElement);
            }
            break;
        }
        }
    }

    private processEnterKey(event: KeyboardEvent, blockElement: HTMLElement): void {
        this.editor.inlineToolbarModule.hideInlineToolbar();
        event.preventDefault();

        if (event.shiftKey) {
            this.handleLineBreaksOnBlock(blockElement);
        } else {
            this.handleNormalEnterKey();
        }
    }

    private handleNormalEnterKey(): void {
        if (this.processSpecialContainerBlocks()) { return; }
        if (this.processIndentIfBlockEmpty()) { return; }

        this.editor.blockCommandManager.splitAndCreateNewBlockAtCursor();
        this.editor.isEntireEditorSelected = false;
    }

    private processSpecialContainerBlocks(): boolean {
        const calloutBlock: HTMLElement = this.editor.currentFocusedBlock.closest('.' + constants.CALLOUT_BLOCK_CLS) as HTMLElement;
        const toggleBlock: HTMLElement = this.editor.currentFocusedBlock.closest('.' + constants.TOGGLE_BLOCK_CLS) as HTMLElement;

        if (calloutBlock) {
            return this.handleChildrenBlockExit('.' + constants.CALLOUT_BLOCK_CLS, '.' + constants.CALLOUT_CONTENT_CLS);
        } else if (toggleBlock) {
            return this.processToggleBlock(toggleBlock);
        }

        return false;
    }

    private processToggleBlock(toggleBlock: HTMLElement): boolean {
        const blockModel: BlockModel = getBlockModelById(toggleBlock.id, this.editor.getEditorBlocks());
        const toggleHeader: HTMLElement = findClosestParent(getSelectedRange().startContainer, '.e-toggle-header');
        const toggleContent: HTMLElement = toggleBlock.querySelector('.' + constants.TOGGLE_CONTENT_CLS);

        if (toggleContent && toggleHeader && toggleContent.textContent === '') {
            this.editor.blockRendererManager.collapsibleRenderer.updateCollapsibleBlockExpansion(
                this.editor.currentFocusedBlock,
                !(blockModel.props as CollapsibleProps).isExpanded
            );
            setCursorPosition(toggleContent.querySelector('.' + constants.CONTENT_CLS), 0);
            this.editor.setFocusToBlock(this.editor.currentFocusedBlock.querySelector('.' + constants.BLOCK_CLS));
            return true;
        }

        return this.handleChildrenBlockExit('.' + constants.TOGGLE_BLOCK_CLS, '.' + constants.TOGGLE_CONTENT_CLS);
    }

    private processIndentIfBlockEmpty(): boolean {
        const blockModel: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());

        if (this.editor.currentFocusedBlock.textContent.trim() === '' && blockModel.indent > 0) {
            this.editor.blockCommandManager.handleBlockIndentation({
                blockIDs: [blockModel.id],
                shouldDecrease: true
            });
            this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
            return true;
        }
        return false;
    }

    private processBlockDeletions(
        event: KeyboardEvent,
        blockElement: HTMLElement,
        blockType: string,
        contentElement: HTMLElement
    ): void {
        const mergeDirection: 'previous' | 'next' = (event.key === 'Backspace') ? 'previous' : 'next';
        const allowedSpecialTypes: string[] = [BlockType.Divider];
        const isAllowedSpecialType: boolean = allowedSpecialTypes.indexOf(blockType) !== -1;

        this.editor.inlineToolbarModule.hideInlineToolbar();

        // First, try to handle selective deletions (multi block deletion)
        const isDeletionPerformed: boolean = this.editor.blockCommandManager.handleSelectiveDeletions(event);

        // If no selective deletion was performed, handle normal deletions (Single block deletion)
        if (!isDeletionPerformed && (isAllowedSpecialType || isCursorAtEdge(contentElement, event.key === 'Backspace'))) {
            this.editor.blockCommandManager.deleteBlockAtCursor({
                blockElement: blockElement,
                mergeDirection: mergeDirection
            });
            this.editor.isEntireEditorSelected = false;
            event.preventDefault();
        }
    }

    private processTabKey(event: KeyboardEvent): void {
        this.editor.blockCommandManager.handleBlockIndentation({
            blockIDs: this.editor.getSelectedBlocks().map((block: BlockModel) => block.id),
            shouldDecrease: event.shiftKey
        });

        this.editor.isEntireEditorSelected = false;
        event.preventDefault();
    }

    private handleHomeEndKeyActions(event: KeyboardEvent, blockElement: HTMLElement): void {
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        setCursorPosition(contentElement, (event.key === 'Home') ? 0 : contentElement.textContent.length);
    }

    private handleLineBreaksOnBlock(blockElement: HTMLElement): void {
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        const oldContentClone: ContentModel[] = isolateModel(sanitizeContents(blockModel.content));
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const range: Range = this.editor.nodeSelection.getRange();
        if (!range) { return; }

        const absoluteOffset: number = getAbsoluteOffset(contentElement, range.startContainer, range.startOffset);
        const contentModel: ContentModel = blockModel.content.find((content: ContentModel) => {
            return content.id === getClosestContentElementInDocument(range.startContainer).id;
        });

        this.editor.blockService.applyLineBreak(range.startOffset, contentModel);

        this.editor.blockRendererManager.reRenderBlockContent(blockModel);
        setCursorPosition(contentElement, absoluteOffset + 1);

        this.editor.undoRedoAction.trackLineBreakActionForUndoRedo({
            blockId: blockModel.id,
            oldContent: oldContentClone,
            newContent: isolateModel(sanitizeContents(blockModel.content))
        });
    }

    private handleChildrenBlockExit(parentSelector: string, contentSelector: string, deleteDirection: 'previous' | 'next' = 'previous'): boolean {
        const parentBlock: HTMLElement = (this.editor.currentFocusedBlock.closest(parentSelector) as HTMLElement);
        const contentElement: HTMLElement = parentBlock ? parentBlock.querySelector(contentSelector) : null;
        if (parentBlock && contentElement &&
            (this.editor.currentFocusedBlock.textContent.trim() === '') &&
            (contentElement.lastElementChild === this.editor.currentFocusedBlock)) {
            this.editor.blockCommandManager.deleteBlockAtCursor({
                blockElement: this.editor.currentFocusedBlock,
                mergeDirection: deleteDirection
            });
            this.editor.currentFocusedBlock = parentBlock;
        }
        return false;
    }

    private handleArrowKeyActions(event: KeyboardEvent, range: Range, blockElement: HTMLElement): void {
        const blockContentLength: number = blockElement.textContent.length;
        const key: string = event.key;
        const isUp: boolean = key === 'ArrowUp';
        const isDown: boolean = key === 'ArrowDown';
        const isLeft: boolean = key === 'ArrowLeft';
        const isRight: boolean = key === 'ArrowRight';
        const isAtStart: boolean = range.startOffset === 0 && range.endOffset === 0;
        const isAtEnd: boolean = range.startOffset === blockContentLength && range.endOffset === blockContentLength;
        const adjacentBlock: HTMLElement = getAdjacentBlock(blockElement, (isUp || isLeft) ? 'previous' : 'next');
        if (!adjacentBlock) { return; }
        const isAdjacentEmpty: boolean = adjacentBlock.textContent.length === 0;
        //Only prevent default behaviour when cursor at the ends, otherwise let the browser's default behaviour take over
        const isMovingAdjacentBlock: boolean = (isAtStart && (isLeft)) || (isAtEnd && (isRight)) || ((isUp || isDown) && isAdjacentEmpty);
        if (isMovingAdjacentBlock) {
            event.preventDefault();
            this.moveCursorToAdjacentBlock(adjacentBlock, key);
        }
        else {
            setTimeout(() => {
                if (!isMovingAdjacentBlock) {
                    const range: Range = getSelectedRange();
                    const currentBlock: HTMLElement = (range.startContainer.parentElement.closest('.' + constants.BLOCK_CLS) as HTMLElement);
                    if (currentBlock !== this.editor.currentFocusedBlock) {
                        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
                        this.editor.setFocusToBlock(currentBlock);
                        this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
                    }
                }
            });
        }
    }

    private moveCursorToAdjacentBlock(adjacentBlock: HTMLElement, key: string): void {
        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
        this.editor.setFocusToBlock(adjacentBlock);
        setCursorPosition(getBlockContentElement(adjacentBlock), (key === 'ArrowLeft') ? adjacentBlock.textContent.length : 0);
        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
        this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
    }

    private togglePopupsOnDocumentClick(event: MouseEvent): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('.' + constants.INLINE_TBAR_POPUP_CLS);
        const blockActionPopup: HTMLElement = document.querySelector('.' + constants.BLOCKACTION_POPUP_CLS);
        const isInlineTbarOpen: boolean = inlineTbarPopup && inlineTbarPopup.classList.contains('e-popup-open');
        const isBlockActionOpen: boolean = blockActionPopup && blockActionPopup.classList.contains('e-popup-open');
        if (!this.editor.inlineToolbarModule.popupObj.element.contains(event.target as Node) && isInlineTbarOpen) {
            this.editor.inlineToolbarModule.hideInlineToolbar(event);
        }
        if (!this.editor.blockActionMenuModule.popupObj.element.contains(event.target as Node) && isBlockActionOpen) {
            this.editor.blockActionMenuModule.toggleBlockActionPopup(true, event);
        }
    }

    private filterSlashCommandOnUserInput(): void {
        if (this.editor.mentionRenderer.isPopupOpen &&
            this.editor.currentFocusedBlock &&
            this.editor.currentFocusedBlock.innerText &&
            this.editor.isPopupOpenedOnAddIconClick) {
            const rect: DOMRect = getElementRect(this.editor.currentFocusedBlock) as DOMRect;
            const xOffset: number = rect.left;
            const yOffset: number = rect.top + this.editor.currentFocusedBlock.offsetHeight;
            this.editor.slashCommandModule.filterCommands(this.editor.currentFocusedBlock.innerText, xOffset, yOffset);
        }
    }

    /**
     * Triggers event notification for block addition
     *
     * @param {BlockModel} block The added block model
     * @returns {void}
     * @hidden
     */
    public triggerBlockAdditionEvent(block: BlockModel): void {
        const eventArgs: BlockAddedEventArgs = {
            block: block,
            parentID: block.parentId,
            index: getBlockIndexById(block.id, this.editor.getEditorBlocks()),
            isPasted: false,
            isInteracted: true
        };

        this.editor.trigger('blockAdded', eventArgs);
    }

    /**
     * Triggers event notification for block addition
     *
     * @param {BlockModel} block The added block model
     * @param {number} blockIndex The index of the block
     * @param {boolean} isInteracted Whether the block is removed by user interaction or not
     * @returns {void}
     * @hidden
     */
    public triggerBlockRemovedEvent(block: BlockModel, blockIndex: number, isInteracted: boolean): void {
        const eventArgs: BlockRemovedEventArgs = {
            block: block,
            parentID: block.parentId,
            index: blockIndex,
            isInteracted: isInteracted
        };

        this.editor.trigger('blockRemoved', eventArgs);
    }

    /**
     * Triggers event notification for block transformation
     *
     * @param {HTMLElement} blockElement The block element
     * @param {BlockModel} newBlock - The new transformed block
     * @param {BlockModel} oldBlock - The old block for reference
     * @param {boolean} isUndoRedoAction - Specifies whether it is undo redo action
     * @returns {void}
     * @hidden
     */
    public triggerBlockTransformedEvent(
        blockElement: HTMLElement,
        newBlock: BlockModel,
        oldBlock: BlockModel,
        isUndoRedoAction: boolean
    ): void {
        if (isUndoRedoAction) { return; }

        const transformedData: ITransformOperation = {
            blockId: blockElement.id,
            oldBlockModel: oldBlock,
            newBlockModel: isolateModel(sanitizeBlock(newBlock))
        };

        this.editor.notify('blockTransformed', transformedData);
    }

    /**
     * Triggers the block moved event
     *
     * @param {IFromBlockData[]} movedBlocks The moved blocks
     * @param {string} toParentId The parent id of the moved blocks
     * @param {string} draggedBlockId The id of the dragged block
     * @param {boolean} isInteracted Whether the block is moved by user interaction or not
     * @returns {void}
     * @hidden
     */
    public triggerBlockMovedEvent(
        movedBlocks: IFromBlockData[],
        toParentId: string,
        draggedBlockId: string,
        isInteracted: boolean
    ): void {
        const reversedFromModels: IFromBlockData[] = [...movedBlocks].reverse();
        const draggedBlock: BlockModel = getBlockModelById(draggedBlockId, this.editor.getEditorBlocks());

        const eventArgs: BlockMovedEventArgs = {
            blocks: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.model),
            parentID: toParentId,
            previousParentID: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.parent ? fromModel.parent.id : ''),
            index: getBlockIndexById(draggedBlock.id, this.editor.getEditorBlocks()),
            previousIndex: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.index),
            isInteracted: isInteracted
        };

        this.editor.trigger('blockMoved', eventArgs);
    }
}
