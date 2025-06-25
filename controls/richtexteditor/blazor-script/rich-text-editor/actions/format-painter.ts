import { addClass, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass } from '../../../base'; /*externalscript*/
import { ActionBeginEventArgs, IExecutionGroup, IFormatPainter, IFormatPainterArgs, IToolbarItemModel, NotifyArgs, ToolbarClickEventArgs } from '../../src/common/interface';
import * as events from '../constant';
import { ClickEventArgs } from '../../../buttons/src'; /*externalscript*/
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { ItemModel } from '../../../splitbuttons/src'; /*externalscript*/
import { QuickToolbarSettingsModel } from '../../src/models';
import { FormatPainterActions } from '../../src/editor-manager/plugin/format-painter-actions';

/* Format Painter Tool implementation for the Rich Text Editor */
export class FormatPainter implements IFormatPainter {
    private parent: SfRichTextEditor;
    private isSticky: boolean = false;
    private isActive: boolean = false;
    public previousAction: string;
    private isDestroyed: boolean = false;

    public constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    /* Adds required event listeners */
    private addEventListener(): void {
        this.parent.observer.on(events.formatPainterClick, this.toolbarClick, this);
        this.parent.observer.on(events.formatPainterDoubleClick, this.toolbarDoubleClick, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClick, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
    }

    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.formatPainterObj) {
            this.parent.formatter.editorManager.formatPainterObj =
                new FormatPainterActions(this.parent.formatter.editorManager, this.parent.formatPainterSettings);
        }
    }

    /* Handles toolbar click events */
    private toolbarClick(clickargs: NotifyArgs): void {
        this.parent.focusIn();
        if (!this.isSticky) {
            this.isActive = true;
            this.actionHandler(clickargs, 'click');
        } else {
            (clickargs.args as KeyboardEventArgs).action = 'escape';
            this.actionHandler(clickargs, 'keyBoard');
        }
        this.hideQuickToolbar();
    }

    /* Handles toolbar double-click events */
    private toolbarDoubleClick(args: NotifyArgs): void {
        this.isActive = true;
        this.isSticky = true;
        this.parent.focusIn();
        this.actionHandler(args, 'dbClick');
    }

    /* Handles key down events */
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        // Simplified condition for better readability
        if (isNOU(originalEvent) || isNOU(originalEvent.action)) {
            return;
        }

        const action: string = originalEvent.action;
        const isFormatAction: boolean = action === 'format-copy' || action === 'format-paste';
        const isEscapeWithFormatHistory: boolean = action === 'escape' &&
            (this.previousAction === 'format-copy' || this.previousAction === 'format-paste');

        if (isFormatAction || isEscapeWithFormatHistory) {
            if (isFormatAction) {
                originalEvent.stopPropagation();
            }
            const browser: string = this.parent.userAgentData.getBrowser();
            if (browser === 'Firefox' || browser === 'Safari') {
                originalEvent.preventDefault();
            }
            this.actionHandler(event, 'keyBoard');
        }
    }

    /* Handles actions based on event type */
    private actionHandler(event: NotifyArgs, type: string): void {
        let action: string;
        let isKeyboard: boolean = false;
        let originalEvent: MouseEvent | KeyboardEvent | PointerEvent;
        let item: IToolbarItemModel;
        switch (type) {
        case 'dbClick':
            ({ item, originalEvent, action } = this.extractToolbarClickDetails(event, 'format-copy'));
            break;
        case 'keyBoard':
            originalEvent = event.args as KeyboardEventArgs;
            isKeyboard = true;
            ({ action, item } = this.processKeyboardAction(event));
            break;
        case 'click':
            ({ item, originalEvent, action } = this.extractToolbarClickDetails(event, 'format-copy'));
            break;
        case 'docClick':
            originalEvent = event as unknown as PointerEvent;
            action = 'format-paste';
            break;
        }

        const actionBeginArgs: ActionBeginEventArgs = {
            requestType: 'FormatPainter', originalEvent, name: action, item: item || this.defaultToolbarItem()
        };
        const value: IFormatPainterArgs = { formatPainterAction: action };
        this.parent.formatter.process(this.parent, actionBeginArgs, originalEvent, value);

        if (!actionBeginArgs.cancel) {
            this.updateCursor(isKeyboard);
            this.updateToolbarBtn(type !== 'docClick' && action !== 'escape');
        }

        this.previousAction = action;
    }

    /* Extracts necessary details from a toolbar click event */
    private extractToolbarClickDetails(event: NotifyArgs, action: string): {
        item: IToolbarItemModel, originalEvent: MouseEvent, action: string } {
        const args: ToolbarClickEventArgs = event.args as ToolbarClickEventArgs;
        const item: ItemModel = args.item;
        const originalEvent: MouseEvent = args.originalEvent;
        return { item, originalEvent, action };
    }

    /* Processes keyboard actions */
    private processKeyboardAction(event: NotifyArgs): { action: string, item: IToolbarItemModel } {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        const action: string = originalEvent.action;
        this.resetStickyStateIfEscape(action);
        return { action, item: null };
    }

    /* Resets sticky state if the escape action is performed */
    private resetStickyStateIfEscape(action: string): void {
        if (action === 'escape') {
            this.isSticky = false;
            this.isActive = false;
        }
    }

    /* Returns a default toolbar item */
    private defaultToolbarItem(): IToolbarItemModel {
        return { command: 'FormatPainter', subCommand: 'FormatPainter' };
    }

    /* Updates the cursor icon */
    private updateCursor(isKeyboard: boolean): void {
        if (!this.parent.inputElement.classList.contains('e-rte-cursor-brush') && !isKeyboard) {
            addClass([this.parent.inputElement], 'e-rte-cursor-brush');
        } else if (!this.isSticky) {
            removeClass([this.parent.inputElement], 'e-rte-cursor-brush');
        }
    }

    /* Updates the toolbar button state */
    private updateToolbarBtn(enable: boolean): void {
        const formatPainterButton: Element = this.parent.element.querySelector('.e-rte-format-painter');
        const toolbarBtn: HTMLElement = this.parent.element.querySelector('#' + this.parent.element.id + '_toolbar_FormatPainter');
        if (!isNOU(formatPainterButton) && !isNOU(toolbarBtn)) {
            if (enable) {
                addClass([toolbarBtn], 'e-active');
            } else {
                removeClass([toolbarBtn], 'e-active');
            }
        }
    }

    /* Handles edit area click event */
    private editAreaClick(args: ClickEventArgs): void {
        if (this.isActive) {
            if (!this.isSticky) {
                this.isActive = false;
            }
            this.actionHandler(args, 'docClick');
            this.updateToolbarBtn(false);
        }
    }

    /* Removes event listeners and performs cleanup */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.removeListeners();
        this.cleanup();
        this.isDestroyed = true;
    }

    /* Removes all attached event listeners */
    private removeListeners(): void {
        this.parent.observer.off(events.formatPainterClick, this.toolbarClick);
        this.parent.observer.off(events.editAreaClick, this.editAreaClick);
        this.parent.observer.off(events.formatPainterDoubleClick, this.toolbarDoubleClick);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
    }

    /* Performs final cleanup */
    private cleanup(): void {
        this.parent = null;
        this.isSticky = null;
        this.isActive = null;
        this.previousAction = null;
    }

    /* Hides the quick toolbar */
    private hideQuickToolbar(): void {
        if (this.parent.quickToolbarModule && this.isTextQuickToolbarAvailable()) {
            this.parent.quickToolbarModule.textQTBar.hidePopup();
        }
    }

    /* Checks if the text quick toolbar is available */
    private isTextQuickToolbarAvailable(): boolean {
        const quickToolbarSettings: QuickToolbarSettingsModel = this.parent.quickToolbarSettings;
        return quickToolbarSettings.text.length !== 0 && !isNOU(quickToolbarSettings.text) &&
            this.parent.element.ownerDocument.contains(this.parent.quickToolbarModule.textQTBar.element);
    }

    /* Returns the module name */
    private getModuleName(): string {
        return 'formatPainter';
    }
}
