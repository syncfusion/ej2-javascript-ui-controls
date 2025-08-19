import { BlockActionItemModel, CommandItemModel, ContextMenuItemModel, ToolbarItemModel, LabelItemModel } from '../models/index';
import { BlockType, BuiltInToolbar } from '../base/enums';
import { CodeLanguageModel } from '../models/block/index';

/**
 * Returns the command menu items.
 *
 * @returns {CommandItemModel[]} - Returns the command menu items.
 */
export function getCommandMenuItems(): CommandItemModel[] {
    const blockCommandOptions: CommandItemModel[] = [
        {
            id: 'checklist-command',
            type: BlockType.CheckList,
            groupHeader: 'General',
            label: 'Checklist',
            tooltip: 'Create a checklist',
            iconCss: 'e-icons e-check-box',
            shortcut: 'Ctrl+Shift+7'
        },
        {
            id: 'bullet-list-command',
            type: BlockType.BulletList,
            groupHeader: 'General',
            label: 'Bullet List',
            tooltip: 'Create a bullet list',
            iconCss: 'e-icons e-list-unordered',
            shortcut: 'Ctrl+Shift+8'
        },
        {
            id: 'numbered-list-command',
            type: BlockType.NumberedList,
            groupHeader: 'General',
            label: 'Numbered List',
            tooltip: 'Create a numbered list',
            iconCss: 'e-icons e-list-ordered',
            shortcut: 'Ctrl+Shift+9'
        },
        {
            id: 'divider-command',
            type: BlockType.Divider,
            groupHeader: 'General',
            label: 'Divider',
            tooltip: 'Add a horizontal line',
            iconCss: 'e-icons e-be-divider',
            shortcut: 'Ctrl+Shift+-'
        },
        {
            id: 'callout-command',
            type: BlockType.Callout,
            groupHeader: 'General',
            label: 'Callout',
            tooltip: 'Add a callout block',
            iconCss: 'e-icons e-be-callout',
            shortcut: 'Ctrl+Alt+C'
        },
        {
            id: 'code-command',
            type: BlockType.Code,
            groupHeader: 'Insert',
            label: 'Code',
            tooltip: 'Insert a code block',
            iconCss: 'e-icons e-insert-code',
            shortcut: 'Ctrl+Alt+K'
        },
        {
            id: 'image-command',
            type: BlockType.Image,
            groupHeader: 'Media',
            label: 'Image',
            tooltip: 'Insert a image block',
            iconCss: 'e-icons e-image',
            shortcut: 'Ctrl+Alt+/'
        },
        {
            id: 'paragraph-command',
            type: BlockType.Paragraph,
            groupHeader: 'Text Styles',
            label: 'Paragraph',
            tooltip: 'Add a paragraph',
            iconCss: 'e-icons e-be-paragraph',
            shortcut: 'Ctrl+Alt+P'
        },
        {
            id: 'heading1-command',
            type: BlockType.Heading1,
            groupHeader: 'Text Styles',
            label: 'Heading 1',
            tooltip: 'Page title or main heading',
            iconCss: 'e-icons e-be-h1',
            shortcut: 'Ctrl+Alt+1'
        },
        {
            id: 'heading2-command',
            type: BlockType.Heading2,
            groupHeader: 'Text Styles',
            label: 'Heading 2',
            tooltip: 'Section heading',
            iconCss: 'e-icons e-be-h2',
            shortcut: 'Ctrl+Alt+2'
        },
        {
            id: 'heading3-command',
            type: BlockType.Heading3,
            groupHeader: 'Text Styles',
            label: 'Heading 3',
            tooltip: 'Subsection heading',
            iconCss: 'e-icons e-be-h3',
            shortcut: 'Ctrl+Alt+3'
        },
        {
            id: 'heading4-command',
            type: BlockType.Heading4,
            groupHeader: 'Text Styles',
            label: 'Heading 4',
            tooltip: 'Smaller heading for nested content',
            iconCss: 'e-icons e-be-h4',
            shortcut: 'Ctrl+Alt+4'
        },
        {
            id: 'toggle-paragraph-command',
            type: BlockType.ToggleParagraph,
            groupHeader: 'Text Styles',
            label: 'Toggle Paragraph',
            tooltip: 'Add a toggle paragraph block',
            iconCss: 'e-icons e-be-toggle-paragraph',
            shortcut: 'Ctrl+Alt+5'
        },
        {
            id: 'toggle-heading1-command',
            type: BlockType.ToggleHeading1,
            groupHeader: 'Text Styles',
            label: 'Toggle Heading 1',
            tooltip: 'Add a toggle heading1 block',
            iconCss: 'e-icons e-be-toggle-h1',
            shortcut: 'Ctrl+Alt+6'
        },
        {
            id: 'toggle-heading2-command',
            type: BlockType.ToggleHeading2,
            groupHeader: 'Text Styles',
            label: 'Toggle Heading 2',
            tooltip: 'Add a toggle heading2 block',
            iconCss: 'e-icons e-be-toggle-h2',
            shortcut: 'Ctrl+Alt+7'
        },
        {
            id: 'toggle-heading3-command',
            type: BlockType.ToggleHeading3,
            groupHeader: 'Text Styles',
            label: 'Toggle Heading 3',
            tooltip: 'Add a toggle heading3 block',
            iconCss: 'e-icons e-be-toggle-h3',
            shortcut: 'Ctrl+Alt+8'
        },
        {
            id: 'toggle-heading4-command',
            type: BlockType.ToggleHeading4,
            groupHeader: 'Text Styles',
            label: 'Toggle Heading 4',
            tooltip: 'Add a toggle heading4 block',
            iconCss: 'e-icons e-be-toggle-h4',
            shortcut: 'Ctrl+Alt+9'
        },
        {
            id: 'quote-command',
            type: BlockType.Quote,
            groupHeader: 'Text Styles',
            label: 'Quote',
            tooltip: 'Insert a quote block',
            iconCss: 'e-icons e-blockquote',
            shortcut: 'Ctrl+Alt+Q'
        }
    ];
    return blockCommandOptions;
}

/**
 * Returns the label menu items.
 *
 * @returns {LabelItemModel[]} - Returns the label menu items.
 */
export function getLabelMenuItems(): LabelItemModel[] {
    return [
        { id: 'progress', labelColor: '#678fff', text: 'In-progress', groupHeader: 'Progress', iconCss: 'e-icons e-settings' },
        { id: 'hold', labelColor: '#ffdd5e', text: 'On-hold', groupHeader: 'Progress', iconCss: 'e-icons e-pause' },
        { id: 'done', labelColor: '#5ac8fa', text: 'Done', groupHeader: 'Progress', iconCss: 'e-icons e-check-box' },
        { id: 'high', labelColor: '#ff8a80', text: 'High', groupHeader: 'Priority' },
        { id: 'medium', labelColor: '#ffb74d', text: 'Medium', groupHeader: 'Priority' },
        { id: 'low', labelColor: '#81c784', text: 'Low', groupHeader: 'Priority' }
    ];
}

/**
 * Returns the context menu items.
 *
 * @returns {ContextMenuItemModel[]} - Returns the context menu items.
 */
export function getContextMenuItems(): ContextMenuItemModel[] {
    return [
        { id: 'undo', text: 'Undo', iconCss: 'e-icons e-undo', shortcut: 'Ctrl+Z' },
        { id: 'redo', text: 'Redo', iconCss: 'e-icons e-redo', shortcut: 'Ctrl+Y' },
        { separator: true },
        { id: 'cut', text: 'Cut', iconCss: 'e-icons e-cut', shortcut: 'Ctrl+X' },
        { id: 'copy', text: 'Copy', iconCss: 'e-icons e-copy', shortcut: 'Ctrl+C' },
        { id: 'paste', text: 'Paste', iconCss: 'e-icons e-paste', shortcut: 'Ctrl+V' },
        { separator: true },
        { id: 'increaseindent', text: 'Increase Indent', iconCss: 'e-icons e-increase-indent', shortcut: 'Ctrl+]' },
        { id: 'decreaseindent', text: 'Decrease Indent', iconCss: 'e-icons e-decrease-indent', shortcut: 'Ctrl+[' },
        { separator: true },
        { id: 'link', text: 'Link', iconCss: 'e-icons e-comment-show', shortcut: 'Ctrl+K' }
    ];
}

/**
 * Returns the block action menu items.
 *
 * @returns {BlockActionItemModel[]} - Returns the block action menu items.
 */
export function getBlockActionsMenuItems(): BlockActionItemModel[] {
    return [
        { id: 'duplicate', label: 'Duplicate', iconCss: 'e-icons e-duplicate', tooltip: 'Duplicates a block', shortcut: 'Ctrl+D' },
        { id: 'delete', label: 'Delete', iconCss: 'e-icons e-trash', tooltip: 'Deletes a block', shortcut: 'Ctrl+Shift+D' },
        { id: 'moveup', label: 'Move Up', iconCss: 'e-icons e-arrow-up', tooltip: 'Moves a block up', shortcut: 'Ctrl+Shift+Up' },
        { id: 'movedown', label: 'Move Down', iconCss: 'e-icons e-arrow-down', tooltip: 'Moves a block down', shortcut: 'Ctrl+Shift+Down' }
    ];
}

/**
 * Returns the inline toolbar items.
 *
 * @returns {ToolbarItemModel[]} - Returns the inline toolbar items.
 */
export function getInlineToolbarItems(): ToolbarItemModel[] {
    const inlineToolbarItems: ToolbarItemModel[] = [
        { id: 'bold', iconCss: 'e-icons e-bold', tooltip: 'Bold', item: BuiltInToolbar.Bold, htmlAttributes: { 'data-command': BuiltInToolbar.Bold } },
        { id: 'italic', iconCss: 'e-icons e-italic', tooltip: 'Italic', item: BuiltInToolbar.Italic, htmlAttributes: { 'data-command': BuiltInToolbar.Italic } },
        { id: 'underline', iconCss: 'e-icons e-underline', tooltip: 'Underline', item: BuiltInToolbar.Underline, htmlAttributes: { 'data-command': BuiltInToolbar.Underline } },
        { id: 'strikethrough', iconCss: 'e-icons e-strikethrough', tooltip: 'Strikethrough', item: BuiltInToolbar.Strikethrough, htmlAttributes: { 'data-command': BuiltInToolbar.Strikethrough } },
        { id: 'uppercase', iconCss: 'e-icons e-upper-case', tooltip: 'Uppercase', item: BuiltInToolbar.Uppercase, htmlAttributes: { 'data-command': BuiltInToolbar.Uppercase } },
        { id: 'lowercase', iconCss: 'e-icons e-lower-case', tooltip: 'Lowercase', item: BuiltInToolbar.Lowercase, htmlAttributes: { 'data-command': BuiltInToolbar.Lowercase } },
        { id: 'superscript', iconCss: 'e-icons e-superscript', tooltip: 'Superscript', item: BuiltInToolbar.Superscript, htmlAttributes: { 'data-command': BuiltInToolbar.Superscript } },
        { id: 'subscript', iconCss: 'e-icons e-subscript', tooltip: 'Subscript', item: BuiltInToolbar.Subscript, htmlAttributes: { 'data-command': BuiltInToolbar.Subscript } },
        {
            id: 'color',
            tooltip: 'Color',
            item: BuiltInToolbar.Color,
            htmlAttributes: { 'data-command': BuiltInToolbar.Color },
            template: '<span class="e-toolbar-color-dropdown e-tbar-btn" id="toolbar-color-dropdown"></span>'
        },
        {
            id: 'bgColor',
            tooltip: 'Background Color',
            item: BuiltInToolbar.BgColor,
            htmlAttributes: { 'data-command': BuiltInToolbar.BgColor },
            template: '<span class="e-toolbar-bgcolor-dropdown e-tbar-btn" id="toolbar-bgcolor-dropdown"></span>'
        }
    ];
    return inlineToolbarItems;
}

/**
 * Returns the display template content for user mention
 *
 * @returns {string} - Returns the display template content
 */
export function getUserMentionDisplayTemplate(): string {
    return '<div class="em-avatar" style="background-color: ${avatarBgColor};">${if(avatarUrl)} <img src="${avatarUrl}" alt="${user}" class="em-img" /> ${else} <div class="em-initial">${initials}</div> ${/if} </div><div class="em-content">${user}</div>';
}

/**
 * Returns the display template content for label mention
 *
 * @returns {string} - Returns the display template content
 */
export function getLabelMentionDisplayTemplate(): string {
    return '${groupHeader}: ${text}';
}

/**
 * Returns the language items of the code block.
 *
 * @returns {CodeLanguageModel[]} - Returns the code block language items.
 */
export function getLanguageItems(): CodeLanguageModel[] {
    const codeLanguageItems: CodeLanguageModel[] = [
        { language: 'plaintext', label: 'Plain text' },
        { language: 'c', label: 'C' },
        { language: 'csharp', label: 'C#' },
        { language: 'cpp', label: 'C++' },
        { language: 'css', label: 'CSS' },
        { language: 'diff', label: 'Diff' },
        { language: 'html', label: 'HTML' },
        { language: 'java', label: 'Java' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'php', label: 'PHP' },
        { language: 'python', label: 'Python' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'sql', label: 'SQL' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'xml', label: 'XML' }
    ];
    return codeLanguageItems;
}
