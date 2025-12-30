import { isNullOrUndefined as isNOU, EventHandler } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { getSelectedRange } from '../../common/utils/index';
import { BlockChangedEventArgs } from '../../models/eventargs';
import * as constants from '../../common/constant';
import { events } from '../../common/constant';

/**
 * Manages all event handlers for the BlockEditor component
 * This class centralizes event handling logic and provides a clean interface
 * for wiring and unwiring events across the editor
 */
export class EventManager {
    private editor: BlockEditor;
    private resizeTimer: ReturnType<typeof setTimeout>;

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
        EventHandler.add(document, 'mousedown', this.handleDocumentClickActions, this);
        EventHandler.add(document, 'mousemove', this.handleMouseMoveActions, this);
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.onResizeHandler, this);

        // Editor events
        EventHandler.add(this.editor.element, 'mouseup', this.handleMouseUpActions, this);
        EventHandler.add(this.editor.element, 'mousedown', this.handleMouseDownActions, this);
        EventHandler.add(this.editor.element, 'input', this.handleEditorInputActions, this);
        EventHandler.add(this.editor.element, 'keydown', this.handleKeydownActions, this);
        EventHandler.add(this.editor.element, 'click', this.handleEditorClickActions, this);
        EventHandler.add(this.editor.element, 'copy', this.clipboardActionHandler, this);
        EventHandler.add(this.editor.element, 'cut', this.clipboardActionHandler, this);
        EventHandler.add(this.editor.element, 'paste', this.clipboardActionHandler, this);
        EventHandler.add(this.editor.blockContainer, 'focus', this.handleEditorFocusActions, this);
        EventHandler.add(this.editor.blockContainer, 'blur', this.handleEditorBlurActions, this);
        this.editor.on(events.destroy, this.destroy, this);
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
        EventHandler.remove(document, 'mousedown', this.handleDocumentClickActions);
        EventHandler.remove(document, 'mousemove', this.handleMouseMoveActions);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.onResizeHandler);
        // Editor events
        EventHandler.remove(this.editor.element, 'mouseup', this.handleMouseUpActions);
        EventHandler.remove(this.editor.element, 'mousedown', this.handleMouseDownActions);
        EventHandler.remove(this.editor.element, 'input', this.handleEditorInputActions);
        EventHandler.remove(this.editor.element, 'keydown', this.handleKeydownActions);
        EventHandler.remove(this.editor.element, 'click', this.handleEditorClickActions);
        EventHandler.remove(this.editor.element, 'copy', this.clipboardActionHandler);
        EventHandler.remove(this.editor.element, 'cut', this.clipboardActionHandler);
        EventHandler.remove(this.editor.element, 'paste', this.clipboardActionHandler);
        EventHandler.remove(this.editor.blockContainer, 'focus', this.handleEditorFocusActions);
        EventHandler.remove(this.editor.blockContainer, 'blur', this.handleEditorBlurActions);
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Triggers the block change event in the editor with required args
     *
     * @param {BlockChangedEventArgs} args - The event args
     * @returns {void}
     * @hidden
     */
    public triggerBlockChangeEvent(args: BlockChangedEventArgs): void {
        this.editor.trigger('blockChanged', args);
    }

    private handleEditorSelection(): void {
        this.editor.intermediate.processActions('selectionchange');
    }

    private handleMouseMoveActions(moveEvent: MouseEvent): void {
        this.editor.intermediate.processActions('mousemove', moveEvent);
    }

    private handleEditorInputActions(inputEvent: Event): void {
        this.editor.intermediate.processActions('input', inputEvent);
    }

    private handleDocumentClickActions(clickEvent: MouseEvent): void {
        this.editor.intermediate.processActions('documentClick', clickEvent);
    }

    private handleEditorClickActions(clickEvent: MouseEvent): void {
        this.editor.intermediate.processActions('editorClick', clickEvent);
    }

    private handleEditorFocusActions(focusEvent: Event): void {
        setTimeout(() => {
            const range: Range = getSelectedRange();
            if (!range || !this.editor.blockManager.currentFocusedBlock) { return; }
            this.editor.trigger('focus', {
                event: focusEvent,
                blockId: this.editor.blockManager.currentFocusedBlock.id,
                selectionRange: [range.startOffset, range.endOffset]
            });
        }, 200);
    }

    private handleEditorBlurActions(blurEvent: any): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('#' + this.editor.element.id + constants.INLINE_TBAR_POPUP_ID);
        const contextMenuPopup: HTMLElement = document.querySelector('#' + this.editor.element.id + constants.BLOCKEDITOR_CONTEXTMENU_ID);
        const shouldPreventBlurAction: boolean = (inlineTbarPopup && inlineTbarPopup.contains(blurEvent.relatedTarget))
            || (contextMenuPopup && contextMenuPopup.contains(blurEvent.relatedTarget));
        const block: HTMLElement = this.editor.blockManager.currentFocusedBlock;
        if (!shouldPreventBlurAction) {
            this.editor.trigger('blur', {
                event: blurEvent,
                blockId: block ? block.id : ''
            });
        }
    }

    private handleKeydownActions(keyEvent: KeyboardEvent): void {
        this.editor.intermediate.processActions('keydown', keyEvent);
    }

    private handleMouseUpActions(mouseEvent: MouseEvent): void {
        this.editor.intermediate.processActions('mouseup', mouseEvent);
    }

    private handleMouseDownActions(mouseEvent: MouseEvent): void {
        this.editor.intermediate.processActions('mousedown', mouseEvent);
    }

    private clipboardActionHandler(e: KeyboardEvent): void {
        this.editor.intermediate.processActions('clipboardAction', e);
    }

    private onResizeHandler(): void {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.editor.intermediate.processActions('resize');
        }, 10);
    }

    private destroy(): void {
        this.unWireGlobalEvents();
        if (!isNOU(this.resizeTimer)) {
            clearInterval(this.resizeTimer);
            this.resizeTimer = null;
        }
    }
}
