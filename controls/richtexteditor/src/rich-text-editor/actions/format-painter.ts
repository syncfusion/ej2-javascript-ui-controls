import { addClass, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass } from '@syncfusion/ej2-base';
import { ActionBeginEventArgs, IExecutionGroup, IFormatPainterArgs, IRichTextEditor, IToolbarItemModel, NotifyArgs, ToolbarClickEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { ClickEventArgs } from '@syncfusion/ej2-buttons';

export class FormatPainter  {
    private parent: IRichTextEditor;
    private isSticky: boolean = false;
    private isActive: boolean = false;
    public previousAction: string;
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(events.formatPainterClick, this.toolbarClick, this);
        this.parent.on(events.formatPainterDoubleClick, this.toolbarDoubleClick, this);
        this.parent.on(events.editAreaClick, this.editAreaClick, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private toolbarClick(args: NotifyArgs): void {
        this.isActive = true;
        this.parent.focusIn();
        this.actionHandler(args, 'click');
    }

    private toolbarDoubleClick(args: NotifyArgs): void {
        this.isActive = true;
        this.isSticky = true;
        this.parent.focusIn();
        this.actionHandler(args, 'dbClick');
    }

    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        if ((originalEvent.ctrlKey && originalEvent.shiftKey && (originalEvent.action === 'format-copy' ||  originalEvent.action === 'format-paste'))
            || (originalEvent.action === 'escape' && (this.previousAction === 'format-copy' || this.previousAction === 'format-paste' ))) {
            if (!isNOU(originalEvent.key) && originalEvent.key.toLowerCase() === 'c'){
                originalEvent.preventDefault();
            }
            if (!isNOU(originalEvent.key) && originalEvent.key.toLowerCase() === 'v' &&
                this.previousAction === 'format-copy' || this.previousAction === 'format-paste' || this.isSticky) {
                originalEvent.preventDefault();
            }
            this.actionHandler(event, 'keyBoard');
        }
    }

    private actionHandler(event: NotifyArgs, type: string): void {
        let action: string;
        let isKeyboard: boolean = false;
        let originalEvent: MouseEvent | KeyboardEvent | PointerEvent;
        let args: ToolbarClickEventArgs | NotifyArgs | IExecutionGroup;
        let item: IToolbarItemModel;
        switch (type){
        case 'dbClick':
            args = event.args as ToolbarClickEventArgs;
            item = (args as ToolbarClickEventArgs).item;
            originalEvent = (event.args as ToolbarClickEventArgs).originalEvent;
            action = 'format-copy';
            break;
        case 'keyBoard':
            args = null;
            originalEvent = event.args as KeyboardEventArgs;
            isKeyboard = true;
            action = (event.args as KeyboardEventArgs).action;
            if (action === 'escape') {
                this.isSticky = false;
                this.isActive = false;
            }
            break;
        case 'click':
            args = event.args as ToolbarClickEventArgs;
            item = (args as ToolbarClickEventArgs).item;
            originalEvent = (event.args as ToolbarClickEventArgs).originalEvent;
            action = 'format-copy';
            break;
        case 'docClick':
            originalEvent = event as unknown as PointerEvent;
            action = 'format-paste';
            break;
        }
        this.updateCursor(isKeyboard);
        const enable: boolean = type === 'docClick' || action === 'escape' ? false : true;
        this.updateToolbarBtn(enable);
        if (isNOU(item)) {
            item = {
                command: 'FormatPainter',
                subCommand: 'FormatPainter'
            } as IToolbarItemModel;
        }
        const actionBeginArgs: ActionBeginEventArgs = {
            requestType: 'FormatPainter', originalEvent: originalEvent, name: action, item: item
        };
        const value: IFormatPainterArgs = {
            formatPainterAction: action
        };
        this.parent.formatter.process(this.parent, actionBeginArgs, originalEvent, value);
        this.previousAction = action;
    }

    private updateCursor(isKeyboard: boolean): void {
        if (!this.parent.inputElement.classList.contains('e-rte-cursor-brush') && !isKeyboard){
            addClass([this.parent.inputElement], 'e-rte-cursor-brush');
        } else if (!this.isSticky) {
            removeClass([this.parent.inputElement], 'e-rte-cursor-brush');
        }
    }

    private updateToolbarBtn(enable: boolean): void  {
        const toolbarBtn: HTMLElement = this.parent.element.querySelector('.e-rte-format-painter').parentElement.parentElement;
        if (enable) {
            addClass([toolbarBtn], 'e-active');
        } else if (!this.isSticky) {
            removeClass([toolbarBtn], 'e-active');
        }
    }

    private editAreaClick(args: ClickEventArgs): void{
        if (this.isActive) {
            if (!this.isSticky) {
                this.isActive = false;
            }
            this.actionHandler(args, 'docClick');
            this.updateToolbarBtn(false);
        }
    }

    public destroy(): void {
        /**Removeeventlistener */
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.formatPainterClick, this.toolbarClick);
        this.parent.off(events.editAreaClick, this.editAreaClick);
        this.parent.off(events.formatPainterDoubleClick, this.toolbarDoubleClick);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'formatPainter';
    }
}
