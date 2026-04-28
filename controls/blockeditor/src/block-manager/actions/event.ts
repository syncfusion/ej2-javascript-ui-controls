import { captureSelectionState, decoupleReference, getAbsoluteOffset, getAdjacentBlock, getBlockContentElement,
    getBlockModelById, getContentModelByNode, getParentBlock, getParentElement, getSelectedRange,
    getTargetBlock, isCursorAtEdge, isListTypeBlock, isNonMergableBlock, setCursorPosition } from '../../common/utils/index';
import { BlockModel, ICollapsibleBlockSettings, ContentModel } from '../../models/index';
import { findClosestParent, getElementRect } from '../../common/utils/dom';
import * as constants from '../../common/constant';
import { events, actionType } from '../../common/constant';
import { BlockManager } from '../base/block-manager';
import { BlockType } from '../../models/enums';
import { DeletionType } from '../../common/enums';
import { SelectionChangedEventArgs } from '../../models/eventargs';
import { TableUIManager } from '../plugins/table/ui-manager';

/**
 * Manages all event handlers for the BlockEditor component
 * This class centralizes event handling logic and provides a clean interface
 * for wiring and unwiring events across the editor
 */
export class EventAction {
    private parent: BlockManager;

    /**
     * Creates a new EventAction instance
     *
     * @param {BlockManager} manager The parent BlockManager instance
     */
    constructor(manager: BlockManager) {
        this.parent = manager;
        this.wireGlobalEvents();
    }

    /**
     * Wires up all global event handlers for the editor
     *
     * @returns {void}
     * @hidden
     */
    wireGlobalEvents(): void {
        // Document events
        this.parent.observer.on('selectionchange', this.handleEditorSelection, this);
        this.parent.observer.on('documentClick', this.handleDocumentClickActions, this);
        this.parent.observer.on('mousemove', this.handleMouseMoveActions, this);
        this.parent.observer.on('resize', this.handleWindowResize, this);

        // Editor events
        this.parent.observer.on('mouseup', this.handleMouseUpActions, this);
        this.parent.observer.on('mousedown', this.handleMouseDownActions, this);
        this.parent.observer.on('input', this.handleEditorInputActions, this);
        this.parent.observer.on('keydown', this.handleKeydownActions, this);
        this.parent.observer.on('clipboardAction', this.clipboardActionHandler, this);

        this.parent.observer.on('wireUnWireDragEvents', this.wireUnWireDragEvents, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    /**
     * Unwires all global event handlers for the editor
     *
     * @returns {void}
     * @hidden
     */
    unWireGlobalEvents(): void {
        // Document events
        this.parent.observer.off('selectionchange', this.handleEditorSelection);
        this.parent.observer.off('documentClick', this.handleDocumentClickActions);
        this.parent.observer.off('mousemove', this.handleMouseMoveActions);
        this.parent.observer.off('resize', this.handleWindowResize);

        // Editor events
        this.parent.observer.off('mouseup', this.handleMouseUpActions);
        this.parent.observer.off('mousedown', this.handleMouseDownActions);
        this.parent.observer.off('input', this.handleEditorInputActions);
        this.parent.observer.off('keydown', this.handleKeydownActions);
        this.parent.observer.off('clipboardAction', this.clipboardActionHandler);

        this.parent.observer.off('wireDragEvents', this.wireUnWireDragEvents);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleEditorSelection(): void {
        const range: Range = this.parent.nodeSelection ? this.parent.nodeSelection.getRange() : null;
        if (!range) { return; }
        const isMoreThanSingleSelection: boolean = (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset);
        if (isMoreThanSingleSelection && this.parent.rootEditorElement.contains(range.commonAncestorContainer)) {
            this.parent.isEntireEditorSelected = this.parent.nodeSelection.checkIsEntireEditorSelected();
        }
    }

    private handleDocumentClickActions(clickEvent: MouseEvent): void {
        if (!this.parent.rootEditorElement.contains(clickEvent.target as HTMLElement)
            && (this.parent.floatingIconAction.floatingIconContainer
            && !this.parent.floatingIconAction.floatingIconContainer.contains(clickEvent.target as HTMLElement))) {
            this.parent.floatingIconAction.hideFloatingIcons();
        }
        this.parent.selectionOverlay.clearSelectionOverlay();
        this.parent.isEntireEditorSelected = false;
        this.togglePopupsOnDocumentClick(clickEvent);
    }

    private handleMouseMoveActions(moveEvent: MouseEvent): void {
        if (this.parent.contextMenuModule.isPopupOpen() || this.parent.blockActionMenuModule.isPopupOpen()) {
            return;
        }
        const blockElement: HTMLElement = (moveEvent.target as HTMLElement).closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (blockElement) {
            if (blockElement !== this.parent.currentHoveredBlock) {
                if (this.parent.currentHoveredBlock) {
                    this.parent.floatingIconAction.hideFloatingIcons();
                }
                this.parent.currentHoveredBlock = blockElement;
                this.parent.floatingIconAction.showFloatingIcons(this.parent.currentHoveredBlock);
            }
        } else if (this.parent.currentHoveredBlock) {
            if (this.parent.floatingIconAction.floatingIconContainer
                && !this.parent.floatingIconAction.floatingIconContainer.contains(moveEvent.target as HTMLElement)) {
                this.parent.floatingIconAction.hideFloatingIcons();
                this.parent.currentHoveredBlock = null;
            }
        }
    }

    private handleMouseUpActions(mouseEvent: MouseEvent): void {
        if (this.parent.readOnly || ((mouseEvent.target as HTMLElement).tagName === 'TD')) { return; }
        this.parent.selectionOverlay.clearSelectionOverlay();
        const range: Range = getSelectedRange();
        const startContainerParent: HTMLElement = range ? getParentElement(range.startContainer) : null;
        const target: HTMLElement = (startContainerParent || mouseEvent.target) as HTMLElement;
        const blockElement: HTMLElement = target.closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (blockElement && (this.parent.currentFocusedBlock !== blockElement)) {
            this.parent.togglePlaceholder(this.parent.currentFocusedBlock, false);
            this.parent.setFocusToBlock(blockElement);
            this.parent.togglePlaceholder(this.parent.currentFocusedBlock, true);
            this.parent.floatingIconAction.showFloatingIcons(this.parent.currentFocusedBlock);
            if (blockElement.innerText.length === 0) {
                setCursorPosition(getBlockContentElement(blockElement), 0);
            }
        }
        setTimeout(() => {
            const isPopupInteracted: boolean = this.parent.inlineToolbarModule
                && this.parent.inlineToolbarModule.popupObj.element.contains(mouseEvent.target as HTMLElement);
            if (!isPopupInteracted) {
                this.handleTextSelection(mouseEvent);
            }
        });
    }

    private handleMouseDownActions(mouseEvent: MouseEvent): void {
        this.parent.isEntireEditorSelected = false;
        this.parent.selectionOverlay.clearSelectionOverlay();
        if (this.parent.readOnly) { return; }
        const blockElement: HTMLElement = (mouseEvent.target as HTMLElement).closest('.' + constants.BLOCK_CLS) as HTMLElement;
        if (blockElement && (this.parent.currentFocusedBlock !== blockElement)) {
            if (blockElement.innerText.length === 0) {
                setCursorPosition(getBlockContentElement(blockElement), 0);
            }
        }
    }

    private handleEditorInputActions(inputEvent: Event): void {
        if (inputEvent.target && ((inputEvent.target as HTMLElement).closest('.e-uploader') || (inputEvent.target as HTMLElement).closest('.e-embed-url-input'))) {
            return;
        }

        this.parent.selectionOverlay.clearSelectionOverlay();

        const focusedBlk: HTMLElement = this.parent.currentFocusedBlock;
        const tableBlock: HTMLElement = focusedBlk ? findClosestParent(focusedBlk, '.e-table-block') : null;
        if (tableBlock) {
            const range: Range = getSelectedRange();
            const tableEle: HTMLTableElement = tableBlock.querySelector('table');
            const uiManager: TableUIManager = this.parent.blockRenderer.tableRenderer.getManager(tableBlock.id);
            const cell: HTMLElement = (findClosestParent(range.startContainer, 'td') || findClosestParent(range.startContainer, 'th'));
            uiManager.removeRowColSelection(tableEle);
            uiManager.hideRowGripper();
            uiManager.hideAllPinnedColBars();
            this.parent.tableService.removeCellFocus(tableEle);
            if (cell) { this.parent.tableService.addCellFocus(cell); }
        }

        this.processEntireEditorSelection();
        this.updateUIAfterInput(inputEvent);
        this.filterSlashCommandOnUserInput();
        if (this.processFormattingActions(inputEvent)) { return; }
        this.throttleContentUpdate(inputEvent);
    }

    private processEntireEditorSelection(): void {
        if (this.parent.isEntireEditorSelected) {
            const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
            const allBlocks: BlockModel[] = editorBlocks.map((block: BlockModel) => decoupleReference(block));

            this.parent.setFocusToBlock(this.parent.blockContainer.firstElementChild as HTMLElement);
            this.parent.floatingIconAction.showFloatingIcons(this.parent.currentFocusedBlock);
            editorBlocks.splice(1);
            this.parent.stateManager.updateManagerBlocks();
            this.parent.isEntireEditorSelected = false;

            this.parent.undoRedoAction.pushActionIntoUndoStack({
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
        if (this.parent.inlineToolbarModule) {
            this.parent.inlineToolbarModule.hideInlineToolbar(inputEvent);
        }

        this.parent.togglePlaceholder(this.parent.currentFocusedBlock, true);
        this.parent.floatingIconAction.hideDragIconForEmptyBlock(this.parent.currentFocusedBlock);

        const blockContent: HTMLElement = getBlockContentElement(this.parent.currentFocusedBlock);
        if (blockContent && blockContent.textContent.length <= 1) {
            this.parent.floatingIconAction.showFloatingIcons(this.parent.currentFocusedBlock);
        }
    }

    private processFormattingActions(inputEvent: Event): boolean {
        const isInsertText: boolean = (inputEvent as any).inputType === 'insertText';
        if ((isInsertText && this.parent.formattingAction.activeInlineFormats
            && this.parent.formattingAction.activeInlineFormats.size > 0)
            || this.parent.formattingAction.lastRemovedFormat) {
            return this.parent.formattingAction.handleTypingWithActiveFormats();
        }
        return false;
    }

    private throttleContentUpdate(inputEvent: Event): void {
        clearTimeout(this.parent.updateTimer);
        this.parent.updateTimer = setTimeout(() => {
            const target: HTMLElement = this.parent.currentFocusedBlock as HTMLElement;
            this.parent.stateManager.updateContentOnUserTyping(target, inputEvent);
        }, 100);
    }

    private handleTextSelection(event: Event): void {
        const range: Range = this.parent.nodeSelection.getRange();
        // this.parent.nodeSelection.updateSelectionRangeOnUserModel();
        if (!range || range.toString().trim().length === 0) {
            this.parent.inlineToolbarModule.hideInlineToolbar(event);
            return;
        }
        const previousRange: Range = this.parent.nodeSelection.getStoredRange();
        const selectionArgs: SelectionChangedEventArgs = {
            event: event,
            // user: this.parent.users.find((user: UserModel) => user.id === this.parent.currentUserId),
            range: [range.startOffset, range.endOffset],
            previousRange: previousRange ? [previousRange.startOffset, previousRange.endOffset] : null
        };
        this.parent.observer.notify('selectionChanged', selectionArgs);
        this.parent.nodeSelection.storeCurrentRange();
        const rect: DOMRect = range.getBoundingClientRect() as DOMRect;

        if (range && rect) {
            const parentBlock: HTMLElement = getParentBlock(range.startContainer as HTMLElement);
            if (parentBlock && parentBlock.classList.contains('e-block')) {
                this.parent.inlineToolbarModule.showInlineToolbar(range, event);
            } else {
                this.parent.inlineToolbarModule.hideInlineToolbar(event);
            }
        }
    }

    private filterSlashCommandOnUserInput(): void {
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        if (this.parent.slashCommandModule.isPopupOpen() &&
            blockElement &&
            blockElement.innerText &&
            this.parent.isPopupOpenedOnAddIconClick) {
            const rect: DOMRect = getElementRect(blockElement) as DOMRect;
            const targetEle: HTMLElement = getBlockContentElement(blockElement) || blockElement;
            const xOffset: number = rect.left;
            const yOffset: number = rect.top + targetEle.offsetHeight;
            this.parent.slashCommandModule.filterCommands(blockElement.innerText, xOffset, yOffset);
        }
    }

    private handleKeydownActions(keyEvent: KeyboardEvent): void {
        this.parent.previousSelection = captureSelectionState();
        if (!this.parent.currentFocusedBlock || !this.validateKeyEventProcessability(keyEvent) || ((keyEvent.target && (keyEvent.target as HTMLElement).closest('.e-embed-url-input')))) {
            return;
        }

        this.handleInlineTbarStates(keyEvent);

        if (this.isAnyPopupOpen()) { return; }

        /* Case where user selects multi blocks and then input a character */
        const range: Range = getSelectedRange();
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        const isCharacterKey: boolean = keyEvent.key.length === 1 && !keyEvent.ctrlKey && !keyEvent.metaKey && !keyEvent.altKey;

        if (selectedBlocks && selectedBlocks.length > 1 && range && !range.collapsed && isCharacterKey) {
            this.parent.isEntireEditorSelected = this.parent.nodeSelection.checkIsEntireEditorSelected();
            if (this.parent.isEntireEditorSelected) {
                this.parent.blockCommand.handleEntireBlockDeletion();
            }
            else {
                this.parent.blockCommand.handleMultipleBlockDeletion(selectedBlocks, 'previous');
            }
            return;
        }

        this.processKeyboardShortcuts(keyEvent);
    }

    private validateKeyEventProcessability(keyEvent: KeyboardEvent): boolean {
        const blockModel: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
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
            this.parent.inlineToolbarModule.hideInlineToolbar(keyEvent);
        } else if ((isControlKey && isLeftRightArrows && isShiftKey)) {
            this.showInlineToolbarWithDelay(keyEvent);
        }
    }

    private showInlineToolbarWithDelay(keyEvent: KeyboardEvent): void {
        const inlineTbarPopup: HTMLElement = document.querySelector(
            '#' + this.parent.rootEditorElement.id + constants.INLINE_TBAR_POPUP_ID
        );

        if (!(inlineTbarPopup && inlineTbarPopup.classList.contains('e-popup-open'))) {
            setTimeout(() => {
                const range: Range = getSelectedRange();
                if (range) {
                    this.parent.inlineToolbarModule.showInlineToolbar(range, keyEvent);
                }
            });
        }
    }

    private processKeyboardShortcuts(keyEvent: KeyboardEvent): void {
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());

        if (this.processListBlockEvents(keyEvent, blockElement, blockModel)) { return; }

        this.handleBlockKeyActions(keyEvent);
    }

    public isAnyPopupOpen(): boolean {
        const mentionPopupId: string = `${this.parent.blockContainer.id}_popup`;
        const commandPopupElement: HTMLElement = document.querySelector(`#${mentionPopupId}.e-blockeditor-command-menu`) as HTMLElement;
        const userMentionPopupElement: HTMLElement = document.querySelector(`#${mentionPopupId}.e-blockeditor-user-menu`) as HTMLElement;
        const labelMentionPopupElement: HTMLElement = document.querySelector(`#${mentionPopupId}.e-blockeditor-label-menu`) as HTMLElement;
        const blockModel: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
        const actionPopupElement: HTMLElement = this.parent.rootEditorElement.querySelector(`#${this.parent.rootEditorElement.id + constants.BLOCKACTION_POPUP_ID}`);
        const linkDialogElement: HTMLElement = this.parent.rootEditorElement.querySelector(`#${this.parent.rootEditorElement.id + constants.LINKDIALOG_ID}`);
        const codeLanguagePopup: HTMLElement = document.querySelector(`#${this.parent.rootEditorElement.id}_code-ddl_popup`);
        const notAllowedTypes: string[] = [BlockType.Code];

        return this.parent.slashCommandModule.isPopupOpen() || (commandPopupElement && commandPopupElement.classList.contains('e-popup-open')) ||
            (userMentionPopupElement && userMentionPopupElement.classList.contains('e-popup-open')) ||
            (labelMentionPopupElement && labelMentionPopupElement.classList.contains('e-popup-open')) ||
            (blockModel && notAllowedTypes.indexOf(blockModel.blockType) !== -1) ||
            (actionPopupElement && actionPopupElement.classList.contains('e-popup-open')) ||
            (linkDialogElement && linkDialogElement.classList.contains('e-popup-open') ||
            (codeLanguagePopup && codeLanguagePopup.classList.contains('e-popup-open')));
    }

    private processListBlockEvents(keyEvent: KeyboardEvent, blockElement: HTMLElement, blockModel: BlockModel): boolean {
        this.parent.listPlugin.handleListTriggerKey(keyEvent, blockElement, blockModel);

        const range: Range = getSelectedRange();
        const selectedBlocks: BlockModel[] = range && range.toString().length > 0 ? this.parent.editorMethods.getSelectedBlocks() : [];
        const isSelectiveDeletions: boolean = this.parent.isEntireEditorSelected || (selectedBlocks && selectedBlocks.length > 1);

        if (blockModel && isListTypeBlock(blockModel.blockType) && !isSelectiveDeletions) {
            return this.parent.listPlugin.handleListKeyActions(keyEvent, blockElement);
        }
        return false;
    }

    private handleBlockKeyActions(event: KeyboardEvent): void {
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            this.handleArrowKeyActions(event, getSelectedRange(), blockElement);
            this.parent.isEntireEditorSelected = false;
            break;
        case 'Enter':
            this.processEnterKey(event, blockElement);
            break;
        case 'Backspace':
        case 'Delete':
            this.processBlockDeletions(event, blockElement, blockElement.getAttribute('data-block-type'), contentElement);
            break;
        case 'Tab':
            if (blockElement.closest(`.${constants.TABLE_BLOCK_CLS}`)) { return; }
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
        this.parent.inlineToolbarModule.hideInlineToolbar();
        event.preventDefault();

        if (event.shiftKey) {
            this.handleLineBreaksOnBlock(blockElement);
        } else {
            this.handleNormalEnterKey();
        }
    }

    private handleNormalEnterKey(): void {
        if (!getSelectedRange()) { return; }
        if (this.processSpecialContainerBlocks()) { return; }
        if (this.processIndentIfBlockEmpty()) { return; }

        this.parent.execCommand({ command: 'SplitBlock' });
        this.parent.isEntireEditorSelected = false;
    }

    private processSpecialContainerBlocks(): boolean {
        const calloutBlock: HTMLElement = this.parent.currentFocusedBlock.closest('.' + constants.CALLOUT_BLOCK_CLS) as HTMLElement;
        const toggleBlock: HTMLElement = this.parent.currentFocusedBlock.closest('.' + constants.TOGGLE_BLOCK_CLS) as HTMLElement;
        const quoteBlock: HTMLElement = this.parent.currentFocusedBlock.closest('.' + constants.QUOTE_BLOCK_CLS) as HTMLElement;
        if (calloutBlock) {
            return this.handleChildrenBlockExit('.' + constants.CALLOUT_BLOCK_CLS, '.' + constants.CALLOUT_CONTENT_CLS);
        } else if (toggleBlock) {
            return this.processToggleBlock(toggleBlock);
        } else if (quoteBlock) {
            return this.handleChildrenBlockExit('.' + constants.QUOTE_BLOCK_CLS, '.' + constants.QUOTE_CONTENT_CLS);
        }

        return false;
    }

    private processToggleBlock(toggleBlock: HTMLElement): boolean {
        const blockModel: BlockModel = getBlockModelById(toggleBlock.id, this.parent.getEditorBlocks());
        const toggleHeader: HTMLElement = findClosestParent(getSelectedRange().startContainer, '.e-toggle-header');
        const toggleContent: HTMLElement = toggleBlock.querySelector('.' + constants.TOGGLE_CONTENT_CLS);

        if (toggleContent && toggleHeader && toggleContent.textContent === '') {
            this.parent.blockRenderer.collapsibleRenderer.updateCollapsibleBlockExpansion(
                this.parent.currentFocusedBlock, !(blockModel.properties as ICollapsibleBlockSettings).isExpanded
            );
            setCursorPosition(toggleContent.querySelector('.' + constants.CONTENT_CLS), 0);
            this.parent.setFocusToBlock(this.parent.currentFocusedBlock.querySelector('.' + constants.BLOCK_CLS));
            return true;
        }

        return this.handleChildrenBlockExit('.' + constants.TOGGLE_BLOCK_CLS, '.' + constants.TOGGLE_CONTENT_CLS);
    }

    private processIndentIfBlockEmpty(): boolean {
        const blockModel: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());

        if (this.parent.currentFocusedBlock.textContent.trim() === '' && blockModel.indent > 0) {
            this.parent.execCommand({
                command: 'IndentBlock',
                state: {
                    blockIDs: [blockModel.id],
                    shouldDecrease: true
                }
            });
            this.parent.floatingIconAction.showFloatingIcons(this.parent.currentFocusedBlock);
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

        this.parent.inlineToolbarModule.hideInlineToolbar();

        // Handle multi-block / entire selection first
        const isDeletionPerformed: boolean = this.parent.blockCommand.handleSelectiveDeletions(event);
        if (isDeletionPerformed) { return; }

        // Direct deletion of selected Non-mergeable block
        if (isNonMergableBlock(blockElement)) {
            this.parent.execCommand({
                command: 'DeleteNonMergableBlock',
                state: { blockElement: blockElement }
            });
            event.preventDefault();
            return;
        }

        // Two-step delete for adjacent special blocks at boundary
        if (getSelectedRange() && isCursorAtEdge(contentElement, event.key === 'Backspace')) {
            const adjacentBlock: HTMLElement = getTargetBlock(blockElement, mergeDirection);
            if (adjacentBlock) {
                const adjacentModel: BlockModel = getBlockModelById(adjacentBlock.id, this.parent.getEditorBlocks());
                const isSpecial: boolean = !!adjacentModel && ([
                    BlockType.Code,
                    BlockType.Callout,
                    BlockType.Table,
                    BlockType.Image,
                    BlockType.Quote,
                    BlockType.CollapsibleHeading,
                    BlockType.CollapsibleParagraph,
                    BlockType.Divider
                ] as string[]).indexOf(adjacentModel.blockType) !== -1;

                if (isSpecial) {
                    // First press: stage overlay
                    event.preventDefault();
                    this.parent.selectionOverlay.selectionOverlayInfo = { element: adjacentBlock, direction: mergeDirection };
                    this.parent.lastHighlightedBlockId = adjacentBlock.id;
                    if (this.parent.selectionOverlay) { this.parent.selectionOverlay.show(adjacentBlock.id); }
                    if (this.parent.nodeSelection) { this.parent.nodeSelection.clearSelection(); }
                    return;
                }
            }
            // Fallback to normal deletion-at-cursor for block merging
            event.preventDefault();
            this.parent.execCommand({
                command: 'DeleteAtCursor',
                state: {
                    blockElement: blockElement,
                    mergeDirection: mergeDirection
                }
            });
            this.parent.isEntireEditorSelected = false;
            return;
        }

        // Second press: delete
        if (this.parent.selectionOverlay.selectionOverlayInfo && this.parent.selectionOverlay.selectionOverlayInfo.element) {
            event.preventDefault();
            const blockEle: HTMLElement = this.parent.selectionOverlay.selectionOverlayInfo.element;
            this.parent.selectionOverlay.clearSelectionOverlay();
            this.parent.execCommand({
                command: 'DeleteNonMergableBlock',
                state: { blockElement: blockEle }
            });

            return;
        }
    }

    private processTabKey(event: KeyboardEvent): void {
        this.parent.execCommand({
            command: 'IndentBlock',
            state: {
                blockIDs: this.parent.editorMethods.getSelectedBlocks().map((block: BlockModel) => block.id),
                shouldDecrease: event.shiftKey
            }
        });

        this.parent.isEntireEditorSelected = false;
        event.preventDefault();
    }

    private handleHomeEndKeyActions(event: KeyboardEvent, blockElement: HTMLElement): void {
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        setCursorPosition(contentElement, (event.key === 'Home') ? 0 : contentElement.textContent.length);
    }

    private handleLineBreaksOnBlock(blockElement: HTMLElement): void {
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        const oldBlock: BlockModel = decoupleReference(blockModel);
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const range: Range = this.parent.nodeSelection.getRange();
        if (!range) { return; }

        const absoluteOffset: number = getAbsoluteOffset(contentElement, range.startContainer, range.startOffset);
        const contentModel: ContentModel = getContentModelByNode(range.startContainer, this.parent.getEditorBlocks());

        this.parent.blockService.applyLineBreak(range.startOffset, contentModel);
        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: blockModel, oldBlock: oldBlock } ]
        }});
        setCursorPosition(contentElement, absoluteOffset + 1);

        this.parent.undoRedoAction.trackLineBreakActionForUndoRedo({
            blockId: blockModel.id,
            oldContent: oldBlock.content,
            newContent: decoupleReference(blockModel.content)
        });
    }

    private handleChildrenBlockExit(parentSelector: string, contentSelector: string, deleteDirection: 'previous' | 'next' = 'previous'): boolean {
        const parentBlock: HTMLElement = (this.parent.currentFocusedBlock.closest(parentSelector) as HTMLElement);
        const contentElement: HTMLElement = parentBlock ? parentBlock.querySelector(contentSelector) : null;
        if (parentBlock && contentElement &&
            (this.parent.currentFocusedBlock.textContent.trim() === '') && contentElement.childElementCount > 1 &&
            (contentElement.lastElementChild === this.parent.currentFocusedBlock)) {
            this.parent.execCommand({ command: 'DeleteBlock', state: {
                blockElement: this.parent.currentFocusedBlock,
                mergeDirection: deleteDirection
            }});
            this.parent.currentFocusedBlock = parentBlock;

            this.parent.execCommand({ command: 'AddBlock', state: {
                blockType: BlockType.Paragraph,
                targetBlock: this.parent.currentFocusedBlock
            }});

            return true;
        }
        return false;
    }

    private handleArrowKeyActions(event: KeyboardEvent, range: Range, blockElement: HTMLElement): void {
        this.parent.selectionOverlay.clearSelectionOverlay();
        const blockContentLength: number = blockElement.textContent.length;
        const key: string = event.key;
        const isUp: boolean = key === 'ArrowUp';
        const isDown: boolean = key === 'ArrowDown';
        const isLeft: boolean = key === 'ArrowLeft';
        const isRight: boolean = key === 'ArrowRight';
        const isAtStart: boolean = range && (range.startOffset === 0 && range.endOffset === 0);
        const isAtEnd: boolean = range && (range.startOffset === blockContentLength && range.endOffset === blockContentLength);
        const adjacentBlock: HTMLElement = getAdjacentBlock(blockElement, (isUp || isLeft) ? 'previous' : 'next');
        if (!adjacentBlock) { return; }
        if (adjacentBlock && adjacentBlock.classList.contains(constants.TABLE_BLOCK_CLS)) {
            const tableEl: HTMLTableElement = adjacentBlock.querySelector('table') as HTMLTableElement;
            let targetCell: HTMLTableCellElement | Element = null;
            if ((isUp || isDown) && tableEl) {
                if (isUp) {
                    // focus first data-cell of the last row
                    const lastDomRow: number = tableEl.rows.length - 1;
                    targetCell = tableEl.rows[lastDomRow as number].cells[1];
                } else {
                    // ArrowDown → first header TH if present, else first body cell
                    targetCell = tableEl.tHead ? tableEl.tHead!.rows[0].cells[1] : tableEl.rows[0].cells[1];
                }
            }
            if (targetCell) {
                this.parent.tableService.addCellFocus(targetCell as HTMLElement, true);
                event.preventDefault();
                return;
            }
        }
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
                    const currentBlock: HTMLElement = (range && range.startContainer.parentElement.closest('.' + constants.BLOCK_CLS) as HTMLElement);
                    if (currentBlock !== this.parent.currentFocusedBlock) {
                        this.parent.togglePlaceholder(this.parent.currentFocusedBlock, false);
                        this.parent.setFocusToBlock(currentBlock);
                        this.parent.floatingIconAction.showFloatingIcons(this.parent.currentFocusedBlock);
                    }
                }
            });
        }
    }

    private moveCursorToAdjacentBlock(adjacentBlock: HTMLElement, key: string): void {
        this.parent.togglePlaceholder(this.parent.currentFocusedBlock, false);
        this.parent.setFocusToBlock(adjacentBlock);
        setCursorPosition(getBlockContentElement(adjacentBlock), (key === 'ArrowLeft') ? adjacentBlock.textContent.length : 0);
        this.parent.togglePlaceholder(this.parent.currentFocusedBlock, true);
        this.parent.floatingIconAction.showFloatingIcons(this.parent.currentFocusedBlock);
    }

    private togglePopupsOnDocumentClick(event: MouseEvent): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('#' + this.parent.rootEditorElement.id + constants.INLINE_TBAR_POPUP_ID);
        const blockActionPopup: HTMLElement = document.querySelector('#' + this.parent.rootEditorElement.id + constants.BLOCKACTION_POPUP_ID);
        const isInlineTbarOpen: boolean = inlineTbarPopup && inlineTbarPopup.classList.contains('e-popup-open');
        const isBlockActionOpen: boolean = blockActionPopup && blockActionPopup.classList.contains('e-popup-open');
        const isColorPaletteClick: boolean = (event.target as HTMLElement).closest('.e-colorpicker-wrapper') !== null ||
                                    (event.target as HTMLElement).closest('.e-color-palette') !== null;
        if (!this.parent.inlineToolbarModule.popupObj.element.contains(event.target as Node) && isInlineTbarOpen && !isColorPaletteClick) {
            this.parent.inlineToolbarModule.hideInlineToolbar(event);
        }
        if (!this.parent.blockActionMenuModule.popupObj.element.contains(event.target as Node) && isBlockActionOpen) {
            this.parent.blockActionMenuModule.toggleBlockActionPopup(true, event);
        }
    }

    private clipboardActionHandler(e: KeyboardEvent): void {
        if (this.parent.linkModule.isPopupOpen() || (e.target && (e.target as HTMLElement).closest('.e-embed-url-input'))) { return; }
        switch (e.type.toLowerCase()) {
        case 'cut':
            this.parent.observer.notify(events.cut, e);
            break;
        case 'copy':
            this.parent.observer.notify(events.copy, e);
            break;
        case 'paste':
            this.parent.observer.notify(events.paste, e);
            break;
        }
        this.parent.stateManager.updateManagerBlocks();
    }

    private handleWindowResize(): void {
        if (this.parent.inlineToolbarModule && this.parent.inlineToolbarModule.isPopupOpen()) {
            const range: Range = this.parent.nodeSelection.getRange();
            this.parent.popupRenderer.adjustPopupPositionRelativeToTarget(range, this.parent.inlineToolbarModule.popupObj);
        }
        // Reposition overlay on resize
        if (this.parent.selectionOverlay) { this.parent.selectionOverlay.reposition(); }
    }

    private wireUnWireDragEvents(options: { enable: boolean }): void {
        if (options.enable) {
            this.parent.dragAndDropAction.wireDragEvents();
        }
        else {
            this.parent.dragAndDropAction.unwireDragEvents();
        }
    }

    // Reposition handled by SelectionOverlay

    public destroy(): void {
        this.parent.selectionOverlay.clearSelectionOverlay();
        this.unWireGlobalEvents();
    }
}
