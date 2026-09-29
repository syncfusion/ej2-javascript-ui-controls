/**
 * Chainable command builder for executing editor commands with type-safe arguments.
 */

import { IEditorController } from '../controller/interface';
import {
    ExecuteOptions,
    LinkCommand,
    ColorCommand,
    FontSizeCommand,
    FontFamilyCommand,
    CodeBlockCommand,
    ListCommand,
    ListStyleTypeCommand,
    AlignmentCommand
} from '../controller/interface';

/**
 * Base builder for toggle commands (bold, italic, etc.)
 */
export class ToggleCommandBuilder {
    protected editor: any;
    protected commandName: string;

    constructor(editor: any, commandName: string) {
        this.editor = editor;
        this.commandName = commandName;
    }

    /**
     * Executes the toggle command
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand(this.commandName, undefined);
    }

    /**
     * Execute the command with optional arguments
     *
     * @param {string} command - The command name
     * @param {any} args - Optional command arguments
     * @returns {void}
     */
    protected executeCommand(command: string, args?: any): void {
        const controller: IEditorController = (this.editor as any).editorController;
        if (controller && controller.execute) {
            controller.execute(command as any, args);
        }
    }
}

/**
 * Builder for link command with chainable URL/text options.
 *
 * Owns the link-command payload assembly and dispatch. The internal link module
 * simply produces the building blocks (operation, href, displayText, target,
 * title) and delegates the final mutation through this builder so all
 * link-related actions route through one entry point.
 */
export class LinkCommandBuilder extends ToggleCommandBuilder {
    private linkArgs: Partial<{
        operation: 'insert' | 'edit' | 'remove' | 'open' | 'copy';
        url?: string;
        href?: string;
        text?: string;
        displayText?: string;
        title?: string | null;
        target?: string | null;
        rel?: string | null;
    }> = { operation: 'insert' };
    /** Original mouse/keyboard event to forward through the action pipeline. */
    private sourceEvent?: MouseEvent | KeyboardEvent;

    constructor(editor: any) {
        super(editor, 'link');
    }

    /**
     * Set the URL/href for the link. Alias for `href()` to match the
     * public API expected from dialog consumers.
     *
     * @param {string} urlValue - The URL value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public url(urlValue: string): this {
        this.linkArgs.href = urlValue;
        this.linkArgs.url = urlValue;
        return this;
    }

    /**
     * Set the href for the link.
     *
     * @param {string} hrefValue - The href value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public href(hrefValue: string): this {
        this.linkArgs.href = hrefValue;
        return this;
    }

    /**
     * Set the visible text of the link.
     *
     * @param {string} textValue - The text value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public text(textValue: string): this {
        this.linkArgs.text = textValue;
        return this;
    }

    /**
     * Set the display text of the link. Alias for `text()`.
     *
     * @param {string} displayValue - The display text value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public displayText(displayValue: string): this {
        this.linkArgs.displayText = displayValue;
        return this;
    }

    /**
     * Set the title/tooltip attribute of the link.
     *
     * @param {string | null} titleValue - The title value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public title(titleValue: string | null): this {
        this.linkArgs.title = titleValue;
        return this;
    }

    /**
     * Set the link operation mode.
     *
     * Default is `'insert'`. Pass `'edit'` to update an existing link,
     * `'remove'` to unlink a selection, and `'open'` / `'copy'` for the
     * matching Quick Toolbar actions.
     *
     * @param {'insert' | 'edit' | 'remove' | 'open' | 'copy'} operation - The operation type
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public operation(operation: 'insert' | 'edit' | 'remove' | 'open' | 'copy'): this {
        this.linkArgs.operation = operation;
        return this;
    }

    /**
     * Set the target attribute (e.g. `'_blank'`, `'_self'`).
     *
     * @param {string | null} targetValue - The target attribute value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public target(targetValue: '_blank' | '_self' | string | null): this {
        this.linkArgs.target = targetValue;
        return this;
    }

    /**
     * Capture the originating event so the action pipeline can forward it
     * through `EditorController.process`. Optional for callers that only
     * need a fire-and-forget mutation (e.g. `executeCommand('link', ...)`).
     *
     * @param {MouseEvent | KeyboardEvent} event - The source event
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    public source(event: MouseEvent | KeyboardEvent): this {
        this.sourceEvent = event;
        return this;
    }

    /**
     * Execute the link command and dispatch through the action pipeline.
     *
     * @returns {void}
     */
    public apply(): void {
        const value: LinkCommand = this.linkArgs as LinkCommand;
        const editor: any = this.editor as any;
        const controller: any = editor && editor.editorController;
        if (this.sourceEvent && controller && typeof controller.process === 'function') {
            controller.process(editor, 'link', this.sourceEvent, value);
            this.sourceEvent = undefined;
            return;
        }
        this.executeCommand('link', value);
    }
}

/**
 * Builder for color commands (fontColor, backgroundColor)
 */
export class ColorCommandBuilder extends ToggleCommandBuilder {
    private colorArgs: ColorCommand = { color: '' };

    /**
     * Creates a color command builder
     *
     * @param {any} editor - The editor instance
     * @param {'fontColor' | 'backgroundColor'} commandName - The command name
     */
    constructor(editor: any, commandName: 'fontColor' | 'backgroundColor') {
        super(editor, commandName);
    }

    /**
     * Set the color value
     *
     * @param {string} colorValue - The color value to set
     * @returns {ColorCommandBuilder} - This builder instance for chaining
     */
    public color(colorValue: string): this {
        this.colorArgs.color = colorValue;
        return this;
    }

    /**
     * Execute the color command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand(this.commandName, this.colorArgs);
    }
}

/**
 * Builder for font size command
 */
export class FontSizeCommandBuilder extends ToggleCommandBuilder {
    private sizeArgs: FontSizeCommand = { size: '' };

    /**
     * Creates a font size command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any) {
        super(editor, 'fontSize');
    }

    /**
     * Set the font size
     *
     * @param {string} sizeValue - The font size value to set
     * @returns {FontSizeCommandBuilder} - This builder instance for chaining
     */
    public size(sizeValue: string): this {
        this.sizeArgs.size = sizeValue;
        return this;
    }

    /**
     * Execute the font size command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand('fontSize', this.sizeArgs);
    }
}

/**
 * Builder for font family command
 */
export class FontFamilyCommandBuilder extends ToggleCommandBuilder {
    private fontArgs: FontFamilyCommand = { family: '' };

    /**
     * Creates a font family command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any) {
        super(editor, 'fontName');
    }

    /**
     * Set the font family name
     *
     * @param {string} fontName - The font family name to set
     * @returns {FontFamilyCommandBuilder} - This builder instance for chaining
     */
    public family(fontName: string): this {
        this.fontArgs.family = fontName;
        return this;
    }

    /**
     * Execute the font family command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand('fontName', this.fontArgs);
    }
}

/**
 * Builder for code block command
 */
export class CodeBlockCommandBuilder extends ToggleCommandBuilder {
    private codeArgs: CodeBlockCommand = { language: '' };

    /**
     * Creates a code block command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any) {
        super(editor, 'codeBlock');
    }

    /**
     * Set the code language
     *
     * @param {string} lang - The language code to set
     * @returns {CodeBlockCommandBuilder} - This builder instance for chaining
     */
    public language(lang: string): this {
        this.codeArgs.language = lang;
        return this;
    }

    /**
     * Execute the code block command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand('codeBlock', this.codeArgs);
    }
}

/**
 * Builder for list commands (numberedList, bulletList)
 */
export class ListCommandBuilder extends ToggleCommandBuilder {
    private listArgs: ListCommand = {};

    /**
     * Creates a list command builder
     *
     * @param {any} editor - The editor instance
     * @param {'numberedList' | 'bulletList'} commandName - The command name
     */
    constructor(editor: any, commandName: 'numberedList' | 'bulletList') {
        super(editor, commandName);
    }

    /**
     * Set list options
     *
     * @param {Partial<ListCommand>} opts - The list command options
     * @returns {ListCommandBuilder} - This builder instance for chaining
     */
    public options(opts: Partial<ListCommand>): this {
        this.listArgs = { ...this.listArgs, ...opts };
        return this;
    }

    /**
     * Execute the list command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand(this.commandName, this.listArgs);
    }
}

/**
 * Builder for list style command
 */
export class ListStyleCommandBuilder extends ToggleCommandBuilder {
    private styleArgs: ListStyleTypeCommand = { listType: 'none' };

    /**
     * Creates a list style command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any) {
        super(editor, 'setListStyle');
    }

    /**
     * Set the list style type
     *
     * @param {string} styleType - The list style type to set
     * @returns {ListStyleCommandBuilder} - This builder instance for chaining
     */
    public listType(styleType: string): this {
        (this.styleArgs as any).listType = styleType;
        return this;
    }

    /**
     * Execute the list style command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand('setListStyle', this.styleArgs);
    }
}

/**
 * Builder for text alignment command
 */
export class AlignmentCommandBuilder extends ToggleCommandBuilder {
    private alignArgs: AlignmentCommand = { align: 'left' };

    /**
     * Creates an alignment command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any) {
        super(editor, 'setTextAlign');
    }

    /**
     * Set the text alignment
     *
     * @param {'left' | 'center' | 'right' | 'justify'} alignment - The alignment to set
     * @returns {AlignmentCommandBuilder} - This builder instance for chaining
     */
    public align(alignment: 'left' | 'center' | 'right' | 'justify'): this {
        this.alignArgs.align = alignment;
        return this;
    }

    /**
     * Execute the alignment command with set options
     *
     * @returns {void}
     */
    public apply(): void {
        this.executeCommand('setTextAlign', this.alignArgs);
    }
}

/**
 * Builder for horizontal line command
 */
export class HorizontalRuleCommandBuilder extends ToggleCommandBuilder {
    constructor(editor: any) {
        super(editor, 'horizontalRule');
    }
}

/**
 * Command executor providing chainable builders for all supported commands
 */
export class CommandExecutor {
    private editor: any;

    /**
     * Creates a command executor
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any) {
        this.editor = editor;
    }

    /**
     * Get a builder for the bold command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public bold(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'bold');
    }

    /**
     * Get a builder for the italic command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public italic(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'italic');
    }

    /**
     * Get a builder for the underline command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public underline(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'underline');
    }

    /**
     * Get a builder for the strikethrough command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public strikethrough(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'strikethrough');
    }

    /**
     * Get a builder for the subscript command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public subscript(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'subscript');
    }

    /**
     * Get a builder for the superscript command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public superscript(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'superscript');
    }

    /**
     * Get a builder for the lowercase command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public lowercase(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'lowercase');
    }

    /**
     * Get a builder for the uppercase command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public uppercase(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'uppercase');
    }

    /**
     * Get a builder for the undo command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public undo(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'undo');
    }

    /**
     * Get a builder for the redo command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public redo(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'redo');
    }

    /**
     * Get a builder for the heading1 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public heading1(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'heading1');
    }

    /**
     * Get a builder for the heading2 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public heading2(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'heading2');
    }

    /**
     * Get a builder for the heading3 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public heading3(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'heading3');
    }

    /**
     * Get a builder for the heading4 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public heading4(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'heading4');
    }

    /**
     * Get a builder for the paragraph command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public paragraph(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'paragraph');
    }

    /**
     * Get a builder for the blockQuote command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public blockQuote(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'blockQuote');
    }

    /**
     * Get a builder for the horizontalRule command
     *
     * @returns {HorizontalRuleCommandBuilder} - The horizontal rule command builder
     */
    public horizontalRule(): HorizontalRuleCommandBuilder {
        return new HorizontalRuleCommandBuilder(this.editor);
    }

    /**
     * Get a builder for the indent command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public indent(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'indent');
    }

    /**
     * Get a builder for the outdent command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public outdent(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'outdent');
    }

    /**
     * Get a builder for the clearFormat command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public clearFormat(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'clearFormat');
    }

    /**
     * Get a builder for the inlineCode command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    public inlineCode(): ToggleCommandBuilder {
        return new ToggleCommandBuilder(this.editor, 'inlineCode');
    }

    /**
     * Get a builder for the link command
     *
     * @returns {LinkCommandBuilder} - The link command builder
     */
    public link(): LinkCommandBuilder {
        return new LinkCommandBuilder(this.editor);
    }

    /**
     * Get a builder for the fontColor command
     *
     * @returns {ColorCommandBuilder} - The color command builder
     */
    public fontColor(): ColorCommandBuilder {
        return new ColorCommandBuilder(this.editor, 'fontColor');
    }

    /**
     * Get a builder for the backgroundColor command
     *
     * @returns {ColorCommandBuilder} - The color command builder
     */
    public backgroundColor(): ColorCommandBuilder {
        return new ColorCommandBuilder(this.editor, 'backgroundColor');
    }

    /**
     * Get a builder for the fontSize command
     *
     * @returns {FontSizeCommandBuilder} - The font size command builder
     */
    public fontSize(): FontSizeCommandBuilder {
        return new FontSizeCommandBuilder(this.editor);
    }

    /**
     * Get a builder for the fontName command
     *
     * @returns {FontFamilyCommandBuilder} - The font family command builder
     */
    public fontName(): FontFamilyCommandBuilder {
        return new FontFamilyCommandBuilder(this.editor);
    }

    /**
     * Get a builder for the codeBlock command
     *
     * @returns {CodeBlockCommandBuilder} - The code block command builder
     */
    public codeBlock(): CodeBlockCommandBuilder {
        return new CodeBlockCommandBuilder(this.editor);
    }

    /**
     * Get a builder for the numberedList command
     *
     * @returns {ListCommandBuilder} - The list command builder
     */
    public numberedList(): ListCommandBuilder {
        return new ListCommandBuilder(this.editor, 'numberedList');
    }

    /**
     * Get a builder for the bulletList command
     *
     * @returns {ListCommandBuilder} - The list command builder
     */
    public bulletList(): ListCommandBuilder {
        return new ListCommandBuilder(this.editor, 'bulletList');
    }

    /**
     * Get a builder for the setListStyle command
     *
     * @returns {ListStyleCommandBuilder} - The list style command builder
     */
    public setListStyle(): ListStyleCommandBuilder {
        return new ListStyleCommandBuilder(this.editor);
    }

    /**
     * Get a builder for the setTextAlign command
     *
     * @returns {AlignmentCommandBuilder} - The alignment command builder
     */
    public setTextAlign(): AlignmentCommandBuilder {
        return new AlignmentCommandBuilder(this.editor);
    }
}
