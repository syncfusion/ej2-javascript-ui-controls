// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../interactive-chat-base/interactive-chat-base-model.d.ts'/>
import { INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';
import { AIAssistBaseModel} from './ai-assist-base-model';
import { InterActiveChatBase } from '../interactive-chat-base/interactive-chat-base';

/**
 * Specifies the type of footer.
 */
export enum ToolbarPosition {
    /**
     * Displays the toolbar inline with the content.
     */
    Inline = 'Inline',
    /**
     * Displays the toolbar at the bottom of the edit area.
     */
    Bottom = 'Bottom'
}

/**
 * AIBase component act as base class.
 */
@NotifyPropertyChanges
export class AIAssistBase extends InterActiveChatBase implements INotifyPropertyChanged {

    /**
     * Specifies whether the prompt response need to be added through streaming in the component.
     * By default the response is not streamed and default value is false
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public enableStreaming: boolean;

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected preRender(): void {
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the current module name.
     */
    public getModuleName(): string {
        return 'aiAssistBase';
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected render(): void {
    }

    // Blur only when focus truly leaves the wrapper subtree.
    // Use FocusEvent for focusout. Do NOT blur on icon interaction if you want the caret to stay.
    protected onFooterIconsFocusOut(e: FocusEvent): void {
        const wrapper: HTMLElement = e.currentTarget as HTMLElement;
        const editable: HTMLElement = this.editableTextarea as HTMLElement;
        const next: Node = e.relatedTarget as Node | null;

        if (!editable) { return; }

        // Only blur when focus moves outside the entire wrapper
        if (!next || !wrapper.contains(next)) {
            // If you want the caret to remain even when leaving, remove this blur.
            editable.blur();
        }
    }

    // Focus the editable when clicking/tapping the empty area of the wrapper.
    // Do not cancel the event; do not use pointer capture, so toolbar icon clicks work.
    protected onFooterIconsPointerDown(e: PointerEvent): void {
        const editable: HTMLElement = this.editableTextarea as HTMLElement;
        const target: HTMLElement = e.target as HTMLElement;
        if (!editable) { return; }
        let selectors: string = '';
        if (this.getModuleName() === 'aiassistview') {
            selectors = '.e-tbar-btn, .e-assist-send, .e-assist-attachment-icon, .e-assist-clear-icon, button, [role="button"], input, [contenteditable="false"]';
        } else {
            selectors = '.e-tbar-btn, .e-send, button, [role="button"], input';
        }
        // If the press is on actionable elements (toolbar buttons/icons), let them handle it.
        if (target.closest(selectors)) {
            return;
        }
        // Focus and place caret at end
        requestAnimationFrame(() => {
            editable.focus();
            this.setFocusAtEnd(editable);
        });
    }

    // Optional: support click as a fallback (some environments may not dispatch pointer events)
    protected onFooterIconsClick(e: MouseEvent): void {
        const editable: HTMLElement = this.editableTextarea as HTMLElement;
        const target: HTMLElement = e.target as HTMLElement;

        if (!editable) { return; }

        let selectors: string = '';
        if (this.getModuleName() === 'aiassistview') {
            selectors = '.e-tbar-btn, .e-assist-send, .e-assist-attachment-icon, .e-assist-clear-icon, button, [role="button"], input, [contenteditable="false"]';
        } else {
            selectors = '.e-tbar-btn, .e-send, .e-stop-rectangle, button, [role="button"], input';
        }

        if (target.closest(selectors)) {
            return;
        }

        if (document.activeElement !== editable) {
            requestAnimationFrame(() => {
                editable.focus();
                this.setFocusAtEnd(editable);
            });
        }
    }

    protected updateFooterType(toolbarPosition: string): void {
        if (toolbarPosition.toLocaleLowerCase() === 'bottom') {
            this.footer.classList.remove('e-toolbar-inline');
            this.footer.classList.add('e-toolbar-bottom');
        } else {
            this.footer.classList.remove('e-toolbar-bottom');
            this.footer.classList.add('e-toolbar-inline');
        }
    }

    protected updateFooterClass(footerTemplate: string | Function): void {
        const footerClass: string = `e-footer ${footerTemplate ? 'e-footer-template' : ''}`;
        this.footer.className = footerClass;
    }

    /**
     * Called if any of the property value is changed.
     *
     * @param  {AIAssistBaseModel} newProp - Specifies new properties
     * @param  {AIAssistBaseModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: AIAssistBaseModel, oldProp: AIAssistBaseModel): void {
    }
}
