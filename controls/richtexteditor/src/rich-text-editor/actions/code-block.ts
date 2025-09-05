import { IRichTextEditor } from '../base/interface';
import { IEditorModel, ActionBeginEventArgs, ICodeBlockLanguageModel, IToolbarItemModel, NotifyArgs, ToolbarClickEventArgs, IToolbarItems } from '../../common/interface';
import * as events from '../base/constant';
import { isNullOrUndefined as isNOU, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { ClickEventArgs, Toolbar } from '@syncfusion/ej2-navigations';
import { CodeBlockSettingsModel } from '../../models';
import { CodeBlockPosition } from '../../editor-manager/base/interface';
import { CodeBlockPlugin } from '../../editor-manager/plugin/code-block';
import * as EVENTS from '../../common/constant';

/**
 * Code Block module provides functionality for working with code blocks in the Rich Text Editor
 * Handles code block creation, editing, and keypress interactions
 *
 * @constructor CodeBlock
 */
export class CodeBlock {
    protected parent: IRichTextEditor;
    private isDestroyed: boolean;
    private isItemsDisabled: boolean;
    private codeBlockObj: CodeBlockPlugin;
    /**
     * Creates an instance of CodeBlock module
     *
     * @param {IRichTextEditor} parent - The parent Rich Text Editor instance
     * @returns {void}
     */
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.isDestroyed = false;
        this.isItemsDisabled = false;
        this.addEventListener();
    }
    /* Registers event handlers for code block operations */
    private addEventListener(): void {
        this.parent.on(events.onCodeBlock, this.onCodeBlock, this);
        this.parent.on(events.codeBlockPaste, this.onPaste, this);
        this.parent.on(events.codeBlockEnter, this.codeBlockEnter, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.keyUp, this.onKeyUp, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
    }
    /* Handles code block button or dropdown click events */
    private onCodeBlock(args: NotifyArgs): void {
        if (args.member === 'codeBlock' && args.args && (args.args as ClickEventArgs).item && (args.args as ClickEventArgs).originalEvent.target &&
            ((args.args as ClickEventArgs).originalEvent.target as Node).parentElement.classList.contains('e-dropdown-btn')) {
            return;
        } else if (((args.args as ClickEventArgs).originalEvent.target as Node).parentElement.classList.contains('e-split-btn') || ((args.args as ClickEventArgs).originalEvent.target as Element).classList.contains('e-split-btn')) {
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
    private editAreaClickHandler(): void {
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
        const excludeItems: string[] = ['undo', 'redo'];
        const disableItemsList: string[] = ['codeblock', 'indent', 'outdent', 'sourcecode', 'emojipicker', 'importword', 'exportword', 'exportpdf',
            'lowercase', 'uppercase', 'blockquote', 'numberformatlist', 'bulletformatlist', 'unorderedlist', 'orderedlist', 'fullscreen'];
        if (this.codeBlockObj.isValidCodeBlockStructure(startContainer) ||
            this.codeBlockObj.isValidCodeBlockStructure(endContainer)
        ) {
            this.parent.disableToolbarItem(
                (this.parent.toolbarSettings.items as string[])
                    .filter((item: string) => excludeItems.indexOf(item.toLocaleLowerCase()) === -1)
            );
            this.parent.enableToolbarItem((this.parent.toolbarSettings.items as string[])
                .filter((item: string) => disableItemsList.indexOf(item.toLocaleLowerCase()) !== -1));
            // Disable the toolbar items when the range is inside a code block
            this.disableTextQuickToolbarItems(true);
            this.isItemsDisabled = true;
        } else if (this.isItemsDisabled) {
            const allToolbarItems: string[] = this.parent.toolbarSettings.items as string[];
            const enableItems: string[] = [...allToolbarItems];
            this.parent.enableToolbarItem(
                (enableItems).filter((item: string) => excludeItems.indexOf(item.toLocaleLowerCase()) === -1)
            );
            // Enable the toolbar items when the range is outside of the code block
            this.disableTextQuickToolbarItems(false);
            this.isItemsDisabled = false;
        }
    }
    /*
     * Enables or disables specific items in the text quick toolbar based on whether they're supported in the current context.
     * Only allows specific items like undo, redo, codeblock, etc., while disabling others based on the parameter value.
     */
    private disableTextQuickToolbarItems(disable: boolean): void {
        const allowTextQuickItems: string[] = ['undo', 'redo', 'codeblock', 'indent', 'outdent', 'sourcecode', 'emojipicker', 'importword', 'exportword', 'exportpdf',
            'lowercase', 'uppercase', 'blockquote', 'numberformatlist', 'bulletformatlist', 'unorderedlist', 'orderedlist', 'fullscreen'
        ];
        const textQuickToolbar: Toolbar = (this.parent.quickToolbarModule && this.parent.quickToolbarModule.textQTBar &&
            this.parent.quickToolbarModule.textQTBar.quickTBarObj && this.parent.quickToolbarModule.textQTBar.quickTBarObj.toolbarObj) ?
            this.parent.quickToolbarModule.textQTBar.quickTBarObj.toolbarObj : null;
        const toolbarItems: (string | IToolbarItems)[] = !isNOU(this.parent.quickToolbarSettings.text) ?
            this.parent.quickToolbarSettings.text : [];
        for (let index: number = 0; index < toolbarItems.length; index++) {
            const item: string | IToolbarItems = toolbarItems[index as number];
            const isAllowed: number = allowTextQuickItems.indexOf((item as string).toLocaleLowerCase());
            if (isAllowed === -1 && textQuickToolbar) {
                textQuickToolbar.enableItems(index, !disable);
            }
        }
    }
    /* Removes all event listeners attached by this module
     * Unregisters handlers to prevent memory leaks
     */
    protected removeEventListener(): void {
        this.parent.off(events.onCodeBlock, this.onCodeBlock);
        this.parent.off(events.codeBlockPaste, this.onPaste);
        this.parent.off(events.codeBlockEnter, this.codeBlockEnter);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
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
