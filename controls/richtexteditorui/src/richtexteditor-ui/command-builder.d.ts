/**
 * Chainable command builder for executing editor commands with type-safe arguments.
 */
import { ListCommand } from '../controller/interface';
/**
 * Base builder for toggle commands (bold, italic, etc.)
 */
export declare class ToggleCommandBuilder {
    protected editor: any;
    protected commandName: string;
    constructor(editor: any, commandName: string);
    /**
     * Executes the toggle command
     *
     * @returns {void}
     */
    apply(): void;
    /**
     * Execute the command with optional arguments
     *
     * @param {string} command - The command name
     * @param {any} args - Optional command arguments
     * @returns {void}
     */
    protected executeCommand(command: string, args?: any): void;
}
/**
 * Builder for link command with chainable URL/text options.
 *
 * Owns the link-command payload assembly and dispatch. The internal link module
 * simply produces the building blocks (operation, href, displayText, target,
 * title) and delegates the final mutation through this builder so all
 * link-related actions route through one entry point.
 */
export declare class LinkCommandBuilder extends ToggleCommandBuilder {
    private linkArgs;
    /** Original mouse/keyboard event to forward through the action pipeline. */
    private sourceEvent?;
    constructor(editor: any);
    /**
     * Set the URL/href for the link. Alias for `href()` to match the
     * public API expected from dialog consumers.
     *
     * @param {string} urlValue - The URL value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    url(urlValue: string): this;
    /**
     * Set the href for the link.
     *
     * @param {string} hrefValue - The href value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    href(hrefValue: string): this;
    /**
     * Set the visible text of the link.
     *
     * @param {string} textValue - The text value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    text(textValue: string): this;
    /**
     * Set the display text of the link. Alias for `text()`.
     *
     * @param {string} displayValue - The display text value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    displayText(displayValue: string): this;
    /**
     * Set the title/tooltip attribute of the link.
     *
     * @param {string | null} titleValue - The title value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    title(titleValue: string | null): this;
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
    operation(operation: 'insert' | 'edit' | 'remove' | 'open' | 'copy'): this;
    /**
     * Set the target attribute (e.g. `'_blank'`, `'_self'`).
     *
     * @param {string | null} targetValue - The target attribute value to set
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    target(targetValue: '_blank' | '_self' | string | null): this;
    /**
     * Capture the originating event so the action pipeline can forward it
     * through `EditorController.process`. Optional for callers that only
     * need a fire-and-forget mutation (e.g. `executeCommand('link', ...)`).
     *
     * @param {MouseEvent | KeyboardEvent} event - The source event
     * @returns {LinkCommandBuilder} - This builder instance for chaining
     */
    source(event: MouseEvent | KeyboardEvent): this;
    /**
     * Execute the link command and dispatch through the action pipeline.
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for color commands (fontColor, backgroundColor)
 */
export declare class ColorCommandBuilder extends ToggleCommandBuilder {
    private colorArgs;
    /**
     * Creates a color command builder
     *
     * @param {any} editor - The editor instance
     * @param {'fontColor' | 'backgroundColor'} commandName - The command name
     */
    constructor(editor: any, commandName: 'fontColor' | 'backgroundColor');
    /**
     * Set the color value
     *
     * @param {string} colorValue - The color value to set
     * @returns {ColorCommandBuilder} - This builder instance for chaining
     */
    color(colorValue: string): this;
    /**
     * Execute the color command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for font size command
 */
export declare class FontSizeCommandBuilder extends ToggleCommandBuilder {
    private sizeArgs;
    /**
     * Creates a font size command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any);
    /**
     * Set the font size
     *
     * @param {string} sizeValue - The font size value to set
     * @returns {FontSizeCommandBuilder} - This builder instance for chaining
     */
    size(sizeValue: string): this;
    /**
     * Execute the font size command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for font family command
 */
export declare class FontFamilyCommandBuilder extends ToggleCommandBuilder {
    private fontArgs;
    /**
     * Creates a font family command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any);
    /**
     * Set the font family name
     *
     * @param {string} fontName - The font family name to set
     * @returns {FontFamilyCommandBuilder} - This builder instance for chaining
     */
    family(fontName: string): this;
    /**
     * Execute the font family command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for code block command
 */
export declare class CodeBlockCommandBuilder extends ToggleCommandBuilder {
    private codeArgs;
    /**
     * Creates a code block command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any);
    /**
     * Set the code language
     *
     * @param {string} lang - The language code to set
     * @returns {CodeBlockCommandBuilder} - This builder instance for chaining
     */
    language(lang: string): this;
    /**
     * Execute the code block command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for list commands (numberedList, bulletList)
 */
export declare class ListCommandBuilder extends ToggleCommandBuilder {
    private listArgs;
    /**
     * Creates a list command builder
     *
     * @param {any} editor - The editor instance
     * @param {'numberedList' | 'bulletList'} commandName - The command name
     */
    constructor(editor: any, commandName: 'numberedList' | 'bulletList');
    /**
     * Set list options
     *
     * @param {Partial<ListCommand>} opts - The list command options
     * @returns {ListCommandBuilder} - This builder instance for chaining
     */
    options(opts: Partial<ListCommand>): this;
    /**
     * Execute the list command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for list style command
 */
export declare class ListStyleCommandBuilder extends ToggleCommandBuilder {
    private styleArgs;
    /**
     * Creates a list style command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any);
    /**
     * Set the list style type
     *
     * @param {string} styleType - The list style type to set
     * @returns {ListStyleCommandBuilder} - This builder instance for chaining
     */
    listType(styleType: string): this;
    /**
     * Execute the list style command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for text alignment command
 */
export declare class AlignmentCommandBuilder extends ToggleCommandBuilder {
    private alignArgs;
    /**
     * Creates an alignment command builder
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any);
    /**
     * Set the text alignment
     *
     * @param {'left' | 'center' | 'right' | 'justify'} alignment - The alignment to set
     * @returns {AlignmentCommandBuilder} - This builder instance for chaining
     */
    align(alignment: 'left' | 'center' | 'right' | 'justify'): this;
    /**
     * Execute the alignment command with set options
     *
     * @returns {void}
     */
    apply(): void;
}
/**
 * Builder for horizontal line command
 */
export declare class HorizontalRuleCommandBuilder extends ToggleCommandBuilder {
    constructor(editor: any);
}
/**
 * Command executor providing chainable builders for all supported commands
 */
export declare class CommandExecutor {
    private editor;
    /**
     * Creates a command executor
     *
     * @param {any} editor - The editor instance
     */
    constructor(editor: any);
    /**
     * Get a builder for the bold command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    bold(): ToggleCommandBuilder;
    /**
     * Get a builder for the italic command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    italic(): ToggleCommandBuilder;
    /**
     * Get a builder for the underline command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    underline(): ToggleCommandBuilder;
    /**
     * Get a builder for the strikethrough command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    strikethrough(): ToggleCommandBuilder;
    /**
     * Get a builder for the subscript command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    subscript(): ToggleCommandBuilder;
    /**
     * Get a builder for the superscript command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    superscript(): ToggleCommandBuilder;
    /**
     * Get a builder for the lowercase command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    lowercase(): ToggleCommandBuilder;
    /**
     * Get a builder for the uppercase command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    uppercase(): ToggleCommandBuilder;
    /**
     * Get a builder for the undo command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    undo(): ToggleCommandBuilder;
    /**
     * Get a builder for the redo command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    redo(): ToggleCommandBuilder;
    /**
     * Get a builder for the heading1 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    heading1(): ToggleCommandBuilder;
    /**
     * Get a builder for the heading2 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    heading2(): ToggleCommandBuilder;
    /**
     * Get a builder for the heading3 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    heading3(): ToggleCommandBuilder;
    /**
     * Get a builder for the heading4 command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    heading4(): ToggleCommandBuilder;
    /**
     * Get a builder for the paragraph command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    paragraph(): ToggleCommandBuilder;
    /**
     * Get a builder for the blockQuote command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    blockQuote(): ToggleCommandBuilder;
    /**
     * Get a builder for the horizontalRule command
     *
     * @returns {HorizontalRuleCommandBuilder} - The horizontal rule command builder
     */
    horizontalRule(): HorizontalRuleCommandBuilder;
    /**
     * Get a builder for the indent command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    indent(): ToggleCommandBuilder;
    /**
     * Get a builder for the outdent command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    outdent(): ToggleCommandBuilder;
    /**
     * Get a builder for the clearFormat command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    clearFormat(): ToggleCommandBuilder;
    /**
     * Get a builder for the inlineCode command
     *
     * @returns {ToggleCommandBuilder} - The command builder
     */
    inlineCode(): ToggleCommandBuilder;
    /**
     * Get a builder for the link command
     *
     * @returns {LinkCommandBuilder} - The link command builder
     */
    link(): LinkCommandBuilder;
    /**
     * Get a builder for the fontColor command
     *
     * @returns {ColorCommandBuilder} - The color command builder
     */
    fontColor(): ColorCommandBuilder;
    /**
     * Get a builder for the backgroundColor command
     *
     * @returns {ColorCommandBuilder} - The color command builder
     */
    backgroundColor(): ColorCommandBuilder;
    /**
     * Get a builder for the fontSize command
     *
     * @returns {FontSizeCommandBuilder} - The font size command builder
     */
    fontSize(): FontSizeCommandBuilder;
    /**
     * Get a builder for the fontName command
     *
     * @returns {FontFamilyCommandBuilder} - The font family command builder
     */
    fontName(): FontFamilyCommandBuilder;
    /**
     * Get a builder for the codeBlock command
     *
     * @returns {CodeBlockCommandBuilder} - The code block command builder
     */
    codeBlock(): CodeBlockCommandBuilder;
    /**
     * Get a builder for the numberedList command
     *
     * @returns {ListCommandBuilder} - The list command builder
     */
    numberedList(): ListCommandBuilder;
    /**
     * Get a builder for the bulletList command
     *
     * @returns {ListCommandBuilder} - The list command builder
     */
    bulletList(): ListCommandBuilder;
    /**
     * Get a builder for the setListStyle command
     *
     * @returns {ListStyleCommandBuilder} - The list style command builder
     */
    setListStyle(): ListStyleCommandBuilder;
    /**
     * Get a builder for the setTextAlign command
     *
     * @returns {AlignmentCommandBuilder} - The alignment command builder
     */
    setTextAlign(): AlignmentCommandBuilder;
}
