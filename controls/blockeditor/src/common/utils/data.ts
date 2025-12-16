import { L10n } from '@syncfusion/ej2-base';
import { BlockActionItemModel, CommandItemModel, ContextMenuItemModel, LabelItemModel, CodeLanguageModel } from '../../models/index';
import { BlockType, CommandName } from '../../models/enums';
import { IToolbarItemModel } from '../../models/interface';

/**
 * Checks if the current operating system is macOS.
 *
 * @returns {boolean} - Returns `true` if the operating system is macOS, otherwise `false`.
 */
export function isMacOS(): boolean {
    const userAgent: string = navigator.userAgent;
    return userAgent.indexOf('Mac OS') !== -1;
}

/**
 * Returns the modifier key based on the platform (Ctrl for non-macOS, Cmd for macOS).
 *
 * @returns {string} - Returns platform specific shortcut key.
 */
export function getModifierKey(): string {
    return isMacOS() ? 'Cmd' : 'Ctrl';
}

/**
 * Returns the command menu items.
 *
 * @returns {CommandItemModel[]} - Returns the command menu items.
 */
export function getCommandMenuItems(): CommandItemModel[] {
    const modifier: string = getModifierKey();
    const blockCommandOptions: CommandItemModel[] = [
        {
            id: 'checklist-command',
            type: BlockType.Checklist,
            groupBy: 'General',
            label: 'Checklist',
            tooltip: 'Create a checklist',
            iconCss: 'e-icons e-check-box',
            shortcut: `${modifier}+Shift+7`
        },
        {
            id: 'bullet-list-command',
            type: BlockType.BulletList,
            groupBy: 'General',
            label: 'Bullet List',
            tooltip: 'Create a bullet list',
            iconCss: 'e-icons e-list-unordered',
            shortcut: `${modifier}+Shift+8`
        },
        {
            id: 'numbered-list-command',
            type: BlockType.NumberedList,
            groupBy: 'General',
            label: 'Numbered List',
            tooltip: 'Create a numbered list',
            iconCss: 'e-icons e-list-ordered',
            shortcut: `${modifier}+Shift+9`
        },
        {
            id: 'divider-command',
            type: BlockType.Divider,
            groupBy: 'General',
            label: 'Divider',
            tooltip: 'Add a horizontal line',
            iconCss: 'e-icons e-be-divider',
            shortcut: `${modifier}+Shift+-`
        },
        {
            id: 'callout-command',
            type: BlockType.Callout,
            groupBy: 'General',
            label: 'Callout',
            tooltip: 'Add a callout block',
            iconCss: 'e-icons e-be-callout',
            shortcut: `${modifier}+Alt+C`
        },
        {
            id: 'code-command',
            type: BlockType.Code,
            groupBy: 'Insert',
            label: 'Code',
            tooltip: 'Insert a code block',
            iconCss: 'e-icons e-insert-code',
            shortcut: `${modifier}+Alt+K`
        },
        {
            id: 'table-command',
            type: BlockType.Table,
            groupBy: 'Insert',
            label: 'Table',
            tooltip: 'Insert a table block',
            iconCss: 'e-icons e-be-table',
            shortcut: `${modifier}+Alt+T`
        },
        {
            id: 'image-command',
            type: BlockType.Image,
            groupBy: 'Media',
            label: 'Image',
            tooltip: 'Insert a image block',
            iconCss: 'e-icons e-image',
            shortcut: `${modifier}+Alt+/`
        },
        {
            id: 'paragraph-command',
            type: BlockType.Paragraph,
            groupBy: 'Text Styles',
            label: 'Paragraph',
            tooltip: 'Add a paragraph',
            iconCss: 'e-icons e-be-paragraph',
            shortcut: `${modifier}+Alt+P`
        },
        {
            id: 'heading1-command',
            type: BlockType.Heading,
            groupBy: 'Text Styles',
            label: 'Heading 1',
            tooltip: 'Page title or main heading',
            iconCss: 'e-icons e-be-h1',
            shortcut: `${modifier}+Alt+1`
        },
        {
            id: 'heading2-command',
            type: BlockType.Heading,
            groupBy: 'Text Styles',
            label: 'Heading 2',
            tooltip: 'Section heading',
            iconCss: 'e-icons e-be-h2',
            shortcut: `${modifier}+Alt+2`
        },
        {
            id: 'heading3-command',
            type: BlockType.Heading,
            groupBy: 'Text Styles',
            label: 'Heading 3',
            tooltip: 'Subsection heading',
            iconCss: 'e-icons e-be-h3',
            shortcut: `${modifier}+Alt+3`
        },
        {
            id: 'heading4-command',
            type: BlockType.Heading,
            groupBy: 'Text Styles',
            label: 'Heading 4',
            tooltip: 'Smaller heading for nested content',
            iconCss: 'e-icons e-be-h4',
            shortcut: `${modifier}+Alt+4`
        },
        {
            id: 'collapsible-paragraph-command',
            type: BlockType.CollapsibleParagraph,
            groupBy: 'Text Styles',
            label: 'Collapsible Paragraph',
            tooltip: 'Add a collapsible paragraph block',
            iconCss: 'e-icons e-be-toggle-paragraph',
            shortcut: `${modifier}+Alt+5`
        },
        {
            id: 'collapsible-heading1-command',
            type: BlockType.CollapsibleHeading,
            groupBy: 'Text Styles',
            label: 'Collapsible Heading 1',
            tooltip: 'Add a collapsible heading1 block',
            iconCss: 'e-icons e-be-toggle-h1',
            shortcut: `${modifier}+Alt+6`
        },
        {
            id: 'collapsible-heading2-command',
            type: BlockType.CollapsibleHeading,
            groupBy: 'Text Styles',
            label: 'Collapsible Heading 2',
            tooltip: 'Add a collapsible heading2 block',
            iconCss: 'e-icons e-be-toggle-h2',
            shortcut: `${modifier}+Alt+7`
        },
        {
            id: 'collapsible-heading3-command',
            type: BlockType.CollapsibleHeading,
            groupBy: 'Text Styles',
            label: 'Collapsible Heading 3',
            tooltip: 'Add a collapsible heading3 block',
            iconCss: 'e-icons e-be-toggle-h3',
            shortcut: `${modifier}+Alt+8`
        },
        {
            id: 'collapsible-heading4-command',
            type: BlockType.CollapsibleHeading,
            groupBy: 'Text Styles',
            label: 'Collapsible Heading 4',
            tooltip: 'Add a collapsible heading4 block',
            iconCss: 'e-icons e-be-toggle-h4',
            shortcut: `${modifier}+Alt+9`
        },
        {
            id: 'quote-command',
            type: BlockType.Quote,
            groupBy: 'Text Styles',
            label: 'Quote',
            tooltip: 'Insert a quote block',
            iconCss: 'e-icons e-blockquote',
            shortcut: `${modifier}+Alt+Q`
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
        { id: 'progress', labelColor: '#678fff', text: 'In-progress', groupBy: 'Progress', iconCss: 'e-icons e-settings' },
        { id: 'hold', labelColor: '#ffdd5e', text: 'On-hold', groupBy: 'Progress', iconCss: 'e-icons e-pause' },
        { id: 'done', labelColor: '#5ac8fa', text: 'Done', groupBy: 'Progress', iconCss: 'e-icons e-check-box' },
        { id: 'high', labelColor: '#ff8a80', text: 'High', groupBy: 'Priority' },
        { id: 'medium', labelColor: '#ffb74d', text: 'Medium', groupBy: 'Priority' },
        { id: 'low', labelColor: '#81c784', text: 'Low', groupBy: 'Priority' }
    ];
}

/**
 * Returns the context menu items.
 *
 * @returns {ContextMenuItemModel[]} - Returns the context menu items.
 */
export function getContextMenuItems(): ContextMenuItemModel[] {
    const modifier: string = getModifierKey();
    return [
        { id: 'undo', text: 'Undo', iconCss: 'e-icons e-undo', shortcut: `${modifier}+Z` },
        { id: 'redo', text: 'Redo', iconCss: 'e-icons e-redo', shortcut: `${modifier}${isMacOS() ? '+Shift+Z' : '+Y'}`},
        { separator: true },
        { id: 'cut', text: 'Cut', iconCss: 'e-icons e-cut', shortcut: `${modifier}+X` },
        { id: 'copy', text: 'Copy', iconCss: 'e-icons e-copy', shortcut: `${modifier}+C` },
        { id: 'paste', text: 'Paste', iconCss: 'e-icons e-paste', shortcut: `${modifier}+V` },
        { separator: true },
        { id: 'increaseindent', text: 'Increase Indent', iconCss: 'e-icons e-increase-indent', shortcut: `${modifier}+]` },
        { id: 'decreaseindent', text: 'Decrease Indent', iconCss: 'e-icons e-decrease-indent', shortcut: `${modifier}+[` },
        { separator: true },
        { id: 'link', text: 'Link', iconCss: 'e-icons e-comment-show', shortcut: `${modifier}+K` }
    ];
}

/**
 * Returns the block action menu items.
 *
 * @returns {BlockActionItemModel[]} - Returns the block action menu items.
 */
export function getBlockActionsMenuItems(): BlockActionItemModel[] {
    const modifier: string = getModifierKey();
    return [
        { id: 'duplicate', label: 'Duplicate', iconCss: 'e-icons e-duplicate', tooltip: 'Duplicates a block', shortcut: `${modifier}+D` },
        { id: 'delete', label: 'Delete', iconCss: 'e-icons e-trash', tooltip: 'Deletes a block', shortcut: `${modifier}+Shift+D` },
        { id: 'moveup', label: 'Move Up', iconCss: 'e-icons e-arrow-up', tooltip: 'Moves a block up', shortcut: `${modifier}+Shift+Up` },
        { id: 'movedown', label: 'Move Down', iconCss: 'e-icons e-arrow-down', tooltip: 'Moves a block down', shortcut: `${modifier}+Shift+Down` }
    ];
}

/**
 * Returns the inline toolbar items.
 *
 * @returns {IToolbarItemModel[]} - Returns the inline toolbar items.
 */
export function getInlineToolbarItems(): IToolbarItemModel[] {
    const modifier: string = getModifierKey();
    const inlineToolbarItems: IToolbarItemModel[] = [
        { id: 'bold', iconCss: 'e-icons e-bold', tooltipText: `Bold (${modifier}+B)`, command: CommandName.Bold, htmlAttributes: { 'data-command': CommandName.Bold } },
        { id: 'italic', iconCss: 'e-icons e-italic', tooltipText: `Italic (${modifier}+I)`, command: CommandName.Italic, htmlAttributes: { 'data-command': CommandName.Italic } },
        { id: 'underline', iconCss: 'e-icons e-underline', tooltipText: `Underline (${modifier}+U)`, command: CommandName.Underline, htmlAttributes: { 'data-command': CommandName.Underline } },
        { id: 'strikethrough', iconCss: 'e-icons e-strikethrough', tooltipText: `Strikethrough (${modifier}+Shift+X)`, command: CommandName.Strikethrough, htmlAttributes: { 'data-command': CommandName.Strikethrough } },
        { id: 'uppercase', iconCss: 'e-icons e-upper-case', tooltipText: 'Uppercase', command: CommandName.Uppercase, htmlAttributes: { 'data-command': CommandName.Uppercase } },
        { id: 'lowercase', iconCss: 'e-icons e-lower-case', tooltipText: 'Lowercase', command: CommandName.Lowercase, htmlAttributes: { 'data-command': CommandName.Lowercase } },
        { id: 'superscript', iconCss: 'e-icons e-superscript', tooltipText: 'Superscript', command: CommandName.Superscript, htmlAttributes: { 'data-command': CommandName.Superscript } },
        { id: 'subscript', iconCss: 'e-icons e-subscript', tooltipText: 'Subscript', command: CommandName.Subscript, htmlAttributes: { 'data-command': CommandName.Subscript } },
        {
            id: 'color',
            tooltipText: 'Color',
            command: CommandName.Color,
            htmlAttributes: { 'data-command': CommandName.Color },
            template: '<span class="e-toolbar-color-dropdown e-tbar-btn" id="toolbar-color-dropdown"></span>'
        },
        {
            id: 'bgColor',
            tooltipText: 'Background Color',
            command: CommandName.BackgroundColor,
            htmlAttributes: { 'data-command': CommandName.BackgroundColor },
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
    return '${groupBy}: ${text}';
}

/**
 * Returns the language items of the code block.
 *
 * @returns {CodeLanguageModel[]} - Returns the code block language items.
 */
export function getLanguageItems(): CodeLanguageModel[] {
    const codeLanguageItems: CodeLanguageModel[] = [
        { language: 'plaintext', label: 'Plain Text' },
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

export function getLocaleItems(): { [key: string]: string } {
    return {
        paragraph: 'Write something or ‘/’ for commands.',
        heading1: 'Heading 1',
        heading2: 'Heading 2',
        heading3: 'Heading 3',
        heading4: 'Heading 4',
        collapsibleParagraph: 'Collapsible Paragraph',
        collapsibleHeading1: 'Collapsible Heading 1',
        collapsibleHeading2: 'Collapsible Heading 2',
        collapsibleHeading3: 'Collapsible Heading 3',
        collapsibleHeading4: 'Collapsible Heading 4',
        bulletList: 'Add item',
        numberedList: 'Add item',
        checklist: 'Todo',
        quote: 'Write a quote',
        callout: 'Write a callout',
        addIconTooltip: 'Click to insert below',
        dragIconTooltipActionMenu: 'Click to open',
        dragIconTooltip: '(Hold to drag)',
        insertLink: 'Insert Link',
        linkText: 'Text',
        linkTextPlaceholder: 'Link text',
        linkUrl: 'URL',
        linkUrlPlaceholder: 'https://example.com',
        linkTitle: 'Title',
        linkTitlePlaceholder: 'Link title',
        linkOpenInNewWindow: 'Open in new window',
        linkInsert: 'Insert',
        linkRemove: 'Remove',
        linkCancel: 'Cancel',
        codeCopyTooltip: 'Copy code'
    };
}

export function getCurrentLocaleJson(localeInstance: L10n): { [key: string]: string } {
    return {
        paragraph: localeInstance.getConstant('paragraph'),
        heading1: localeInstance.getConstant('heading1'),
        heading2: localeInstance.getConstant('heading2'),
        heading3: localeInstance.getConstant('heading3'),
        heading4: localeInstance.getConstant('heading4'),
        collapsibleParagraph: localeInstance.getConstant('collapsibleParagraph'),
        collapsibleHeading1: localeInstance.getConstant('collapsibleHeading1'),
        collapsibleHeading2: localeInstance.getConstant('collapsibleHeading2'),
        collapsibleHeading3: localeInstance.getConstant('collapsibleHeading3'),
        collapsibleHeading4: localeInstance.getConstant('collapsibleHeading4'),
        bulletList: localeInstance.getConstant('bulletList'),
        numberedList: localeInstance.getConstant('numberedList'),
        checklist: localeInstance.getConstant('checklist'),
        quote: localeInstance.getConstant('quote'),
        callout: localeInstance.getConstant('callout'),
        addIconTooltip: localeInstance.getConstant('addIconTooltip'),
        dragIconTooltipActionMenu: localeInstance.getConstant('dragIconTooltipActionMenu'),
        dragIconTooltip: localeInstance.getConstant('dragIconTooltip'),
        insertLink: localeInstance.getConstant('insertLink'),
        linkText: localeInstance.getConstant('linkText'),
        linkTextPlaceholder: localeInstance.getConstant('linkTextPlaceholder'),
        linkUrl: localeInstance.getConstant('linkUrl'),
        linkUrlPlaceholder: localeInstance.getConstant('linkUrlPlaceholder'),
        linkTitle: localeInstance.getConstant('linkTitle'),
        linkTitlePlaceholder: localeInstance.getConstant('linkTitlePlaceholder'),
        linkOpenInNewWindow: localeInstance.getConstant('linkOpenInNewWindow'),
        linkInsert: localeInstance.getConstant('linkInsert'),
        linkRemove: localeInstance.getConstant('linkRemove'),
        linkCancel: localeInstance.getConstant('linkCancel'),
        codeCopyTooltip: localeInstance.getConstant('codeCopyTooltip')
    };
}
