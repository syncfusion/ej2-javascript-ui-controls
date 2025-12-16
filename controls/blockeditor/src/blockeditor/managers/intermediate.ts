import { AfterPasteCleanupEventArgs, BeforePasteCleanupEventArgs, BlockActionMenuClosingEventArgs, BlockActionMenuOpeningEventArgs, BlockChange, BlockChangedEventArgs, BlockData, BlockDragEventArgs, BlockDropEventArgs, SelectionChangedEventArgs } from '../../models/eventargs';
import { BlockEditor } from '../base/blockeditor';
import { events } from '../../common/constant';
import * as constants from '../../common/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { cloneObject } from '../../common/utils/transform';
import { BeforePasteEventProps, BlockActionMenuCloseEventProps, BlockActionMenuOpenEventProps, IDropDownListRenderOptions } from '../../common';

export class Intermediate {

    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.wireGlobalEvents();
    }

    /**
     * Wires up all global event handlers
     *
     * @returns {void}
     * @hidden
     */
    wireGlobalEvents(): void {
        this.editor.blockManager.observer.on('updateEditorBlocks', this.handleModelChanges, this);
        this.editor.blockManager.observer.on('selectionChanged', this.handleSelectionChange, this);
        this.editor.blockManager.observer.on('beforePaste', this.triggerBeforePaste, this);
        this.editor.blockManager.observer.on('afterPaste', this.triggerAfterPaste, this);
        this.editor.blockManager.observer.on('blockActionsMenuClose', this.triggerBlockActionsMenuCloseEvent, this);
        this.editor.blockManager.observer.on('blockActionsMenuOpen', this.triggerBlockActionsMenuOpenEvent, this);
        this.editor.blockManager.observer.on('blockDragging', this.triggerBlockDrag, this);
        this.editor.blockManager.observer.on('blockDragStart', this.triggerBlockStart, this);
        this.editor.blockManager.observer.on('blockDropped', this.triggerBlockDrop, this);

        this.editor.blockManager.observer.on('triggerBlockChange', this.triggerBlockChangeEvent, this);

        this.editor.blockManager.observer.on('renderTemplateBlock', this.editor.renderTemplate, this.editor);
        this.editor.blockManager.observer.on('renderDropdownList', this.renderDropdownList, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    /**
     * Unwires all global event handlers
     *
     * @returns {void}
     * @hidden
     */
    unWireGlobalEvents(): void {
        this.editor.blockManager.observer.off('updateEditorBlocks', this.handleModelChanges);
        this.editor.blockManager.observer.off('selectionChanged', this.handleSelectionChange);
        this.editor.blockManager.observer.off('beforePaste', this.triggerBeforePaste);
        this.editor.blockManager.observer.off('afterPaste', this.triggerAfterPaste);
        this.editor.blockManager.observer.off('blockActionsMenuClose', this.triggerBlockActionsMenuCloseEvent);
        this.editor.blockManager.observer.off('blockActionsMenuOpen', this.triggerBlockActionsMenuOpenEvent);
        this.editor.blockManager.observer.off('blockDragging', this.triggerBlockDrag);
        this.editor.blockManager.observer.off('blockDragStart', this.triggerBlockStart);
        this.editor.blockManager.observer.off('blockDropped', this.triggerBlockDrop);

        this.editor.blockManager.observer.off('triggerBlockChange', this.triggerBlockChangeEvent);

        this.editor.blockManager.observer.off('renderTemplateBlock', this.editor.renderTemplate);
        this.editor.blockManager.observer.off('renderDropdownList', this.renderDropdownList);
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Processes the event actions in block manager which originates from blockeditor
     *
     * @param {string} action - The event action
     * @param {any} args - args required for action if any.
     * @returns {void}
     * @hidden
     */
    public processActions(action: string, args?: any): void {
        this.editor.blockManager.observer.notify(action, args);
    }

    private handleModelChanges(state: any): void {
        this.editor.setProperties({ blocks: state.blocks }, true);
    }

    private handleSelectionChange(args: SelectionChangedEventArgs): void {
        this.editor.trigger('selectionChanged', args);
    }

    private triggerBeforePaste(args: BeforePasteEventProps): void {
        const eventArgs: BeforePasteCleanupEventArgs = {
            cancel: args.cancel,
            content: args.content
        };
        this.editor.trigger('beforePaste', eventArgs);
        args.callback(eventArgs);
    }

    private triggerAfterPaste(args: AfterPasteCleanupEventArgs): void {
        this.editor.trigger('afterPaste', args);
    }

    private triggerBlockDrag(args: BlockDragEventArgs): void {
        this.editor.trigger('blockDragging', args);
    }

    private triggerBlockStart(args: BlockDragEventArgs): void {
        this.editor.trigger('blockDragStart', args);
    }

    private triggerBlockDrop(args: BlockDropEventArgs): void {
        this.editor.trigger('blockDropped', args);
    }

    private triggerBlockChangeEvent(changes: BlockChange[]): void {
        const validChanges: BlockChange[] = changes
            .filter((_: BlockChange, index: number) => Number.isInteger(index) && changes[index as number] !== undefined)
            .map((change: BlockChange) => {
                const clonedData: BlockData = cloneObject(change.data, ['targetId', 'isMovingUp']) as BlockData;
                if (!isNullOrUndefined(change.data.currentParent)) {
                    clonedData.currentParent = change.data.currentParent;
                }
                if (!isNullOrUndefined(change.data.prevParent)) {
                    clonedData.prevParent = change.data.prevParent;
                }
                return {
                    action: change.action,
                    data: clonedData
                };
            });
        const blockChangeEventArgs: BlockChangedEventArgs = { changes: validChanges };
        this.editor.eventManager.triggerBlockChangeEvent(blockChangeEventArgs);
        this.editor.blockManager.observer.notify(constants.CLEAREVENTCHANGES);
    }

    private triggerBlockActionsMenuCloseEvent(args: BlockActionMenuCloseEventProps): void {
        const eventArgs: BlockActionMenuClosingEventArgs = {
            event: args.event,
            items: args.items,
            cancel: args.cancel
        };
        if (this.editor.blockActionMenuSettings.closing) {
            this.editor.blockActionMenuSettings.closing.call(this, eventArgs);
        }
        args.callback(eventArgs);
    }

    private triggerBlockActionsMenuOpenEvent(args: BlockActionMenuOpenEventProps): void {
        const eventArgs: BlockActionMenuOpeningEventArgs = {
            event: args.event,
            items: args.items,
            cancel: args.cancel
        };
        if (this.editor.blockActionMenuSettings.opening) {
            this.editor.blockActionMenuSettings.opening.call(this, eventArgs);
        }
        args.callback(eventArgs);
    }

    private renderDropdownList(args: IDropDownListRenderOptions): void {
        this.editor.dropdownListRenderer.renderDropDownList(args);
    }

    private destroy(): void {
        this.unWireGlobalEvents();
    }
}
