import { IRichTextEditor } from '../base/interface';
import { ActionBeginEventArgs, ICodeBlockLanguageModel, NotifyArgs } from '../../common/interface';
import * as events from '../base/constant';
import { AutoFormatPlugin } from '../../editor-manager/plugin/autoformat';
import { isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';

/**
 * AutoFormat module provides functionality for autoformatting text in the Rich Text Editor.
 * Handles automatic formatting of Markdown patterns (e.g., **bold**, ~~strikethrough~~, `code`).
 *
 * @description Manages autoformatting logic within the Rich Text Editor.
 * @export
 */
export class AutoFormat {
    protected parent: IRichTextEditor;
    private isDestroyed: boolean;
    private autoFormatObj: AutoFormatPlugin;

    /**
     * Creates an instance of auto format module
     *
     * @param {IRichTextEditor} parent - The parent Rich Text Editor instance
     * @returns {void}
     */
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.isDestroyed = false;
        this.addEventListener();
    }

    /* Registers event handlers for auto format operations */
    private addEventListener(): void {
        this.parent.on(events.keyUp, this.onKeyUp, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
    }

    /* Handles key up events for space keys */
    private onKeyUp(e: NotifyArgs): void {
        let block: boolean = false;
        if ((e.args as KeyboardEventArgs).which === 32 && this.parent.formatter.editorManager.autoFormatObj) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
            const isValidBlock: { tag: string; format: string } = this.autoFormatObj.findBlockAutoFormatCommandInRange(range);
            if (!isNullOrUndefined(isValidBlock)) {
                const args: ActionBeginEventArgs = { item: { command: isValidBlock.format, subCommand: isValidBlock.tag } };
                if (isValidBlock.tag === 'hr') {
                    (args.item as { [key: string]: string }).value = '<hr/>';
                }
                if (isValidBlock.format === 'CodeBlock') {
                    const languages: ICodeBlockLanguageModel[] = this.parent.codeBlockSettings.languages;
                    const defaultLanguage: string = this.parent.codeBlockSettings.defaultLanguage;
                    let language: string;
                    let label: string;
                    for (let i: number = 0; i < languages.length; i++) {
                        if (languages[i as number].language === defaultLanguage) {
                            language = languages[i as number].language;
                            label = languages[i as number].label;
                            break;
                        }
                    }
                    this.parent.formatter.process(this.parent, args, e.args, { language: language, label: label, action: 'createCodeBlock', enterAction: this.parent.enterKey });
                    block = true;
                } else {
                    this.parent.formatter.process(this.parent, args, e.args);
                    block = true;
                }
            }
        }
        if (['*', '_', '`', '~'].indexOf((e.args as KeyboardEventArgs).key) !== -1) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
            if (this.autoFormatObj.findAutoFormatCommandInRange(range) && !block) {
                const args: ActionBeginEventArgs = { item: { command: 'autoformat', subCommand: 'inlinestyle' } };
                this.parent.formatter.process(this.parent, args, e.args);
            }
        }
    }

    /* Removes all event listeners attached by this module
     * Unregisters handlers to prevent memory leaks
     */
    protected removeEventListener(): void {
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
    }

    /**
     * Cleans up resources and detaches event handlers when the component is destroyed
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true;
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string value
     */
    private getModuleName(): string {
        return 'autoFormat';
    }

    /**
     * Initializes the AutoFormatPlugin object in the editor manager after editor initialization is complete.
     * This method binds the auto format module to the editor's formatter for handling auto format related operations.
     *
     * @returns {void} - This method does not return a value
     * @private
     */
    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.autoFormatObj) {
            this.parent.formatter.editorManager.autoFormatObj = new AutoFormatPlugin(this.parent.formatter.editorManager);
            this.autoFormatObj = this.parent.formatter.editorManager.autoFormatObj;
        }
    }
}
