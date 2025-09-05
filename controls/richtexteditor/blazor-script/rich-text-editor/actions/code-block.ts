/* eslint-disable jsdoc/require-param */
import { ActionBeginEventArgs, ICodeBlockLanguageModel, IEditorModel, IToolbarItemModel, NotifyArgs, ToolbarClickEventArgs } from '../../editor-scripts/common/interface';
import * as events from '../constant';
import { isNullOrUndefined as isNOU, KeyboardEventArgs } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { CodeBlockSettingsModel } from '../../editor-scripts/models';
import { CodeBlockPosition } from   '../../editor-scripts/editor-manager/base/interface';
import { CodeBlockPlugin } from '../../editor-scripts/editor-manager/plugin/code-block';
import * as EVENTS from '../../editor-scripts/common/constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { IToolbarItems } from '../../editor-scripts/common/interface';

/**
 * Code Block module provides functionality for working with code blocks in the Rich Text Editor
 * Handles code block creation, editing, and keypress interactions
 *
 * @constructor CodeBlock
 */
export class CodeBlock {
    protected parent: SfRichTextEditor;
    private isDestroyed: boolean;
    private codeBlockObj: CodeBlockPlugin;
    /**
     * Creates an instance of CodeBlock module
     *
     * @param {SfRichTextEditor} parent - The parent Rich Text Editor instance
     * @returns {void}
     */
    public constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.isDestroyed = false;
        this.addEventListener();
    }
    /* Registers event handlers for code block operations */
    private addEventListener(): void {
        this.parent.observer.on(events.onCodeBlock, this.onCodeBlock, this);
        this.parent.observer.on(events.codeBlockPaste, this.onPaste, this);
        this.parent.observer.on(events.codeBlockEnter, this.codeBlockEnter, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.keyUp, this.onKeyUp, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);
    }
    /* Handles code block button or dropdown click events */
    private onCodeBlock(args: NotifyArgs): void {
        if (args.member === 'codeBlock' && args.args && (args.args as ClickEventArgs).item) {
            const codeBlock: CodeBlockSettingsModel = this.parent.codeBlockSettings;
            let defaultItem: ICodeBlockLanguageModel;
            if (codeBlock.languages && codeBlock.languages.length > 0) {
                const filteredItems: ICodeBlockLanguageModel[] = !isNOU(codeBlock.defaultLanguage) ?
                    codeBlock.languages.filter((item: { [key: string]: CodeBlockSettingsModel }) =>
                        item.language === codeBlock.defaultLanguage) : [];
                defaultItem = filteredItems.length > 0 ? filteredItems[0] : codeBlock.languages[0];
                this.parent.formatter.process(this.parent, args.args, (args.args as ClickEventArgs).originalEvent,
                                              { language: defaultItem.language, label: defaultItem.label, action: 'createCodeBlock', enterAction: this.parent.enterKey });
            }
        }
    }

    /* Handles paste events within code blocks while pasting remvoe the all the format and past into the code block */
    private onPaste(e: NotifyArgs): void {
        const range : Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
        if (this.codeBlockObj.isValidCodeBlockStructure(range.startContainer) ||
            this.codeBlockObj.isValidCodeBlockStructure(range.endContainer)
        ) {
            const codeBlockTarget: Element =
                !isNOU(this.codeBlockObj.isValidCodeBlockStructure(range.startContainer)) ?
                    this.codeBlockObj.isValidCodeBlockStructure(range.startContainer)
                    : this.codeBlockObj.isValidCodeBlockStructure(range.endContainer);
            const currentFormat: ICodeBlockLanguageModel[] = this.parent.codeBlockSettings.languages
                .slice()
                .filter((item: ICodeBlockLanguageModel) =>
                    item.label === codeBlockTarget.getAttribute('data-language')
                );
            let item: IToolbarItemModel = (e as ToolbarClickEventArgs).item;
            if (isNOU(item)) {
                item = {
                    command: 'CodeBlock',
                    subCommand: 'CodeBlock'
                } as IToolbarItemModel;
            }
            const actionBeginArgs: ActionBeginEventArgs = {
                originalEvent: e.args as KeyboardEvent, item: item
            };
            this.parent.formatter.process(this.parent, actionBeginArgs, e.args,
                                          { action: 'codeBlockPaste' , currentFormat: {label : currentFormat[0].label , language : currentFormat[0].language } });
        }
    }
    /*
    * Handles Enter key press events within code blocks
    * Maintains proper behavior when users press Enter while editing inside code blocks
    */
    private codeBlockEnter(args: NotifyArgs): void {
        if ((args.args) && (args.args as KeyboardEvent).which === 13) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
            if (this.codeBlockObj.isValidCodeBlockStructure(range.startContainer) ||
                this.codeBlockObj.isValidCodeBlockStructure(range.endContainer)) {
                let item: IToolbarItemModel = (args as ToolbarClickEventArgs).item;
                if (isNOU(item)) {
                    item = {
                        command: 'CodeBlock',
                        subCommand: 'CodeBlock'
                    } as IToolbarItemModel;
                }
                const actionBeginArgs: ActionBeginEventArgs = {
                    originalEvent: args.args as KeyboardEvent, item: item
                };
                this.parent.formatter.process(this.parent, actionBeginArgs, args.args,
                                              { action: 'codeBlockEnter' });
            }
        }
    }
    private codeBlockTab(args: NotifyArgs): void {
        const tabAction: boolean = (args.args) && (args.args as KeyboardEvent).which === 9 && !(args.args as KeyboardEvent).shiftKey;
        const shitTabAction: boolean = (args.args) && (args.args as KeyboardEvent).which === 9 && (args.args as KeyboardEvent).shiftKey;
        if ((tabAction) || (shitTabAction)) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
            const isCodeBlock: boolean = this.codeBlockObj.
                isSelectionWithinCodeBlock(range, range.startContainer, range.endContainer);
            if (isCodeBlock) {
                const item: IToolbarItemModel = this.createToolbarItem(args);
                const actionBeginArgs: ActionBeginEventArgs = {
                    originalEvent: args.args as KeyboardEvent,
                    item: item
                };
                const currentAction: string = tabAction ? 'codeBlockTabAction' : 'codeBlockShiftTabAction';
                this.parent.formatter.process(this.parent, actionBeginArgs, args.args,
                                              { action: currentAction });
                (args.args as KeyboardEvent).preventDefault();
            }
        }
    }
    /*
     * Handles special key events within code blocks
     * Processes delete/backspace keys and code block shortcuts to maintain proper code block structure
     */
    private onKeyDown(e: NotifyArgs): void {
        const keyboardEvent: KeyboardEventArgs = e.args as KeyboardEventArgs;
        if (keyboardEvent.which === 9) {
            this.codeBlockTab(e);
            return;
        }
        const isDeleteKey: boolean = keyboardEvent.which === 8 || keyboardEvent.which === 46;
        const isCodeBlockShortcut: boolean = keyboardEvent.action === 'code-block';
        // Only process delete/backspace keys or code block shortcut
        if (!isDeleteKey && !isCodeBlockShortcut) {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(
            this.parent.inputElement.ownerDocument
        );
        // Skip if selection contains all content
        if (this.isSelectionAllContent(range)) {
            return;
        }
        const editorManager: IEditorModel = this.parent.formatter.editorManager;
        const codeBlockPosition: CodeBlockPosition = editorManager.codeBlockObj.getCodeBlockPosition(range);
        // Check if cursor is at the end of a code block (for delete key handling)
        const isCursorAtCodeBlockEnd: boolean = !isNOU(codeBlockPosition.nextSiblingCodeBlockElement) &&
            codeBlockPosition.cursorAtLastPosition;
        // Checks if cursor is at the beginning of the current element
        // Used to handle merging with preceding elements when Backspace is pressed
        const firstContentNode: { node: Node; position: number } =
            editorManager.nodeSelection.findFirstContentNode(codeBlockPosition.blockNode);
        const isCursorAtBlockStart: boolean = firstContentNode &&
            firstContentNode.node === range.startContainer &&
            range.startOffset === 0;
        // Find any previous code block that might be affected by backspace
        const previousSiblingCodeBlock: { currentNode: Node, previousSibling: Node } | null =
            editorManager.codeBlockObj.findParentOrPreviousSiblingCodeBlock(range);
        /* Determines if the current node should not be a list (UL/OL) to prevent backspace action. */
        const currentNodeShouldNotBeList: boolean = !isNOU(previousSiblingCodeBlock) &&
            previousSiblingCodeBlock.currentNode &&
            previousSiblingCodeBlock.currentNode.nodeName !== 'UL' &&
            previousSiblingCodeBlock.currentNode.nodeName !== 'OL';
        const hasPreviousCodeBlock: boolean = currentNodeShouldNotBeList && isCursorAtBlockStart;
        // Check if selection is within a code block
        const isStartPointInCodeBlock: boolean =
            !isNOU(this.codeBlockObj.isValidCodeBlockStructure(range.startContainer));
        const isEndPointInCodeBlock: boolean =
            !isNOU(this.codeBlockObj.isValidCodeBlockStructure(range.endContainer));
        const isSelectionInCodeBlock: boolean = isStartPointInCodeBlock || isEndPointInCodeBlock;
        const shouldProcessCodeBlock: boolean = isSelectionInCodeBlock || isCursorAtCodeBlockEnd ||
            hasPreviousCodeBlock || isCodeBlockShortcut;
        if (shouldProcessCodeBlock) {
            const item: IToolbarItemModel = this.createToolbarItem(e);
            const actionBeginArgs: ActionBeginEventArgs = {
                originalEvent: e.args as KeyboardEvent,
                item: item
            };
            // Handle backspace/delete operations
            if (!isCodeBlockShortcut) {
                this.processCodeBlockDeletion(
                    actionBeginArgs,
                    e,
                    isCursorAtCodeBlockEnd,
                    hasPreviousCodeBlock,
                    isSelectionInCodeBlock,
                    range
                );
            }
            // Handle code block creation shortcut
            else {
                this.createCodeBlockWithDefaultLanguage(actionBeginArgs, e);
            }
        }
    }
    /* Creates a toolbar item model for code block operations
     * If no item exists in the event, creates a default code block item
     */
    private createToolbarItem(e: NotifyArgs): IToolbarItemModel {
        let item: IToolbarItemModel = (e as ToolbarClickEventArgs).item;
        if (isNOU(item)) {
            item = {
                command: 'CodeBlock',
                subCommand: 'CodeBlock'
            } as IToolbarItemModel;
        }
        return item;
    }
    /*
     * Handles deletion and backspace operations within code blocks
     * Evaluates the cursor position and surrounding elements to properly manage code block structure during deletion and backspace
     */
    private processCodeBlockDeletion(
        actionBeginArgs: ActionBeginEventArgs,
        e: NotifyArgs,
        isAtLastPosition: boolean,
        hasPrevCodeBlock: boolean,
        isInCodeBlock: boolean,
        range: Range
    ): void {
        if (!isAtLastPosition && !hasPrevCodeBlock && isInCodeBlock) {
            const codeBlockTarget: Element =
                !isNOU(this.codeBlockObj.isValidCodeBlockStructure(range.startContainer)) ?
                    this.codeBlockObj.isValidCodeBlockStructure(range.startContainer) :
                    this.codeBlockObj.isValidCodeBlockStructure(range.endContainer);
            const languageLabel: string = codeBlockTarget.getAttribute('data-language');
            const languages: ICodeBlockLanguageModel[] = this.parent.codeBlockSettings.languages;
            const currentFormat: ICodeBlockLanguageModel[] = languages
                .slice()
                .filter(function (item: ICodeBlockLanguageModel): boolean {
                    return item.label === languageLabel;
                });
            if (currentFormat.length > 0) {
                this.parent.formatter.process(this.parent, actionBeginArgs, e.args, {
                    action: 'codeBlockBackSpace',
                    currentFormat: {
                        label: currentFormat[0].label,
                        language: currentFormat[0].language
                    }
                });
            }
        } else {
            this.parent.formatter.process(this.parent, actionBeginArgs, e.args, {
                action: 'codeBlockBackSpace'
            });
        }
    }
    /* Creates a code block using the default language configuration
     * Retrieves the default language from settings and applies it to the selected content
     */
    private createCodeBlockWithDefaultLanguage(
        actionBeginArgs: ActionBeginEventArgs,
        e: NotifyArgs
    ): void {
        const codeBlock: CodeBlockSettingsModel = this.parent.codeBlockSettings;
        if (!codeBlock.languages || codeBlock.languages.length === 0) {
            return;
        }
        let defaultItem: ICodeBlockLanguageModel;
        const hasDefaultLanguage: boolean = !isNOU(codeBlock.defaultLanguage);
        if (hasDefaultLanguage) {
            const filteredItems: ICodeBlockLanguageModel[] = codeBlock.languages.filter(
                function (item: ICodeBlockLanguageModel): boolean {
                    return item.language === codeBlock.defaultLanguage;
                }
            );
            defaultItem = filteredItems.length > 0 ? filteredItems[0] : codeBlock.languages[0];
        } else {
            defaultItem = codeBlock.languages[0];
        }
        this.parent.formatter.process(this.parent, actionBeginArgs, e.args, {
            language: defaultItem.language,
            label: defaultItem.label,
            action: 'createCodeBlock',
            enterAction: this.parent.enterKey
        });
    }
    /* Determines if the current selection contains all content in the editor
     * Used to prevent certain operations when the entire document is selected
     */
    private isSelectionAllContent(range: Range): boolean {
        const div: HTMLElement = document.createElement('div');
        div.appendChild(range.cloneContents());
        const selectedHTML: string = div.innerHTML;
        if (selectedHTML === this.parent.inputElement.innerHTML) {
            return true;
        } else {
            return false;
        }
    }
    /* Handles key up events for delete and backspace keys */
    private onKeyUp(e: NotifyArgs): void {
        if ((e.args as KeyboardEventArgs).which === 8 || (e.args as KeyboardEventArgs).which === 46) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
            const startContainer: Node = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer;
            const endContainer: Node = range.endContainer.nodeName === '#text' ? range.endContainer.parentElement : range.endContainer;
            if ((startContainer as HTMLElement).closest('pre[data-language]') && (endContainer as HTMLElement).closest('pre[data-language]')) {
                let item: IToolbarItemModel = (e as ToolbarClickEventArgs).item;
                if (isNOU(item)) {
                    item = {
                        command: 'CodeBlock',
                        subCommand: 'CodeBlock'
                    } as IToolbarItemModel;
                }
                const actionBeginArgs: ActionBeginEventArgs = {
                    originalEvent: e.args as KeyboardEvent, item: item
                };
                this.parent.formatter.process(this.parent, actionBeginArgs, e.args,
                                              { action: 'codeBlockBackSpace' });
            }
        }
        this.disableToolbarItems();
    }
    /* Handles edit area click events
     * Updates toolbar state based on cursor position
     */
    private editAreaClickHandler(e: NotifyArgs): void {
        this.disableToolbarItems();
    }

    /* Manages toolbar item availability based on code block context
    * When inside a code block, disables most formatting options except those relevant to code blocks
    * Restores all toolbar items when outside of code blocks
    */
    public disableToolbarItems(): void {
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.inputElement.ownerDocument);
        const startContainer: Node = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer;
        const endContainer: Node = range.endContainer.nodeName === '#text' ? range.endContainer.parentElement : range.endContainer;
        if (this.codeBlockObj.isValidCodeBlockStructure(startContainer) ||
            this.codeBlockObj.isValidCodeBlockStructure(endContainer)
        ) {
            this.disableToolbarItemForCodeBlock(true);
        } else {
            this.disableToolbarItemForCodeBlock(false);
        }
    }
    public disableToolbarItemForCodeBlock(isEnable: boolean): void {
        const allowedSubCommands: string[] = ['CodeBlock', 'Indent', 'Outdent', 'SourceCode', 'EmojiPicker', 'ImportWord', 'ExportWord', 'ExportPdf',
            'LowerCase', 'UpperCase', 'Blockquote', 'NumberFormatList', 'BulletFormatList', 'UnorderedList', 'OrderedList', 'FullScreen', 'UL', 'OL'];
        const skipSubCommands: string[] = ['Undo', 'Redo']; // These will be untouched
        const toolbarItems: (string | IToolbarItems)[] = this.parent.toolbarSettings.items
            .filter((item: string | IToolbarItems | null) => item !== null);
        const toolbarElement: HTMLElement | null = this.getToolbarElement();
        if (!isNOU(toolbarElement)) {
            const toolbarItemtList: NodeListOf<Element> = toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-separator)');
            this.updateToolbarItemsState(toolbarItemtList, toolbarItems, isEnable, skipSubCommands, allowedSubCommands);
            // Check for text quick toolbar element
            const textQuickToolbarElement: Element = !isNOU(this.parent.quickToolbarModule && this.parent.quickToolbarModule.textQTBar &&
                this.parent.quickToolbarModule.textQTBar.element) ? this.parent.quickToolbarModule.textQTBar.element : null;
            if (textQuickToolbarElement) {
                const textQuickToolbar: (string | IToolbarItems)[] = this.parent.quickToolbarSettings.text
                    .filter((item: string | IToolbarItems | null) => item !== null);
                const textQuickToolbarItems: NodeListOf<Element> = textQuickToolbarElement.querySelectorAll('.e-toolbar-item:not(.e-separator)');
                this.updateToolbarItemsState(textQuickToolbarItems, textQuickToolbar, isEnable, skipSubCommands, allowedSubCommands);
            }
        }
    }
    private updateToolbarItemsState(
        toolbarItemList: NodeListOf<Element>,
        toolbarItems: (string | IToolbarItems)[],
        isEnable: boolean,
        skipSubCommands: string[],
        allowedSubCommands: string[]
    ): void {
        for (let index: number = 0; index < toolbarItems.length; index++) {
            const item: string | IToolbarItems = toolbarItems[index as number];
            const element: HTMLElement = toolbarItemList[index as number] as HTMLElement;
            const subCommand: string = (item as IToolbarItems).subCommand ? (item as IToolbarItems).subCommand.toLowerCase() : '';
            // Skip Undo and Redo
            const isSkip: boolean = skipSubCommands.some((cmd: string) => cmd.toLowerCase() === subCommand);
            if (isSkip) {
                continue;
            }
            const isAllowed: boolean = allowedSubCommands.some((cmd: string) => cmd.toLowerCase() === subCommand);
            if (isEnable) {
                if (!isAllowed) {
                    element.classList.add('e-overlay');
                }
            } else {
                element.classList.remove('e-overlay');
            }
        }
    }
    private getToolbarElement(): HTMLElement {
        const toolbarElemnt: Element = this.parent.inlineMode.enable ? this.parent.element.ownerDocument.querySelector(`#${this.parent.id}_Inline_Quick_Popup`) : this.parent.getToolbarElement();
        return toolbarElemnt as HTMLElement;
    }
    /* Removes all event listeners attached by this module
     * Unregisters handlers to prevent memory leaks
     */
    protected removeEventListener(): void {
        this.parent.observer.off(events.onCodeBlock, this.onCodeBlock);
        this.parent.observer.off(events.codeBlockPaste, this.onPaste);
        this.parent.observer.off(events.codeBlockEnter, this.codeBlockEnter);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.keyUp, this.onKeyUp);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);
        this.parent.formatter.editorManager.observer.off(EVENTS.CODEBLOCK_DISABLETOOLBAR, this.editAreaClickHandler);
    }
    /**
     * Cleans up resources and detaches event handlers when the component is destroyed
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        this.isDestroyed = true;
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string value
     */
    private getModuleName(): string {
        return 'codeBlock';
    }

    /**
     * Initializes the CodeBlockPlugin object in the editor manager after editor initialization is complete.
     * This method binds the code block  module to the editor's formatter for handling code block related operations.
     *
     * @returns {void} - This method does not return a value
     * @private
     */
    private bindOnEnd(): void {
        if (!this.parent.formatter.editorManager.codeBlockObj) {
            this.parent.formatter.editorManager.codeBlockObj = new CodeBlockPlugin(this.parent.formatter.editorManager);
            this.codeBlockObj = this.parent.formatter.editorManager.codeBlockObj;
            this.parent.formatter.editorManager.observer.on(EVENTS.CODEBLOCK_DISABLETOOLBAR, this.editAreaClickHandler, this);
        }
    }
}
