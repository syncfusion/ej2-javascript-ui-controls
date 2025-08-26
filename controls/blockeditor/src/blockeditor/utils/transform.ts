import { BlockActionItemModel, BlockModel, CodeLanguageModel, CodeSettingsModel, CommandItemModel, ContentModel, ContextMenuItemModel, ImageSettingsModel, LabelItemModel, LinkSettingsModel, StyleModel, ToolbarItemModel } from '../models/index';
import { ItemModel } from '@syncfusion/ej2-navigations';

/**
 * Transforms an array of ToolbarItemModel objects into an array of ItemModel objects.
 *
 * @param {ToolbarItemModel[]} items - The toolbar items to transform.
 * @returns {ItemModel[]} The transformed toolbar items.
 */
export function transformIntoToolbarItem(items: ToolbarItemModel[]): ItemModel[] {
    return items.map((item: ToolbarItemModel) => ({
        id: item.id,
        prefixIcon: item.iconCss,
        tooltipText: item.tooltip,
        text: item.text,
        cssClass: item.cssClass,
        disabled: item.disabled,
        visible: item.visible,
        tabIndex: item.tabIndex,
        template: item.template,
        type: item.type,
        htmlAttributes: item.htmlAttributes
    }));
}

export function sanitizeBlockActionItems(items: BlockActionItemModel[]): BlockActionItemModel[] {
    return items.map((item: BlockActionItemModel) => ({
        id: item.id,
        label: item.label,
        iconCss: item.iconCss,
        disabled: item.disabled,
        tooltip: item.tooltip,
        shortcut: item.shortcut
    }));
}

export function sanitizeCommandMenuItems(items: CommandItemModel[]): CommandItemModel[] {
    return items.map((item: CommandItemModel) => ({
        id: item.id,
        type: item.type,
        disabled: item.disabled,
        iconCss: item.iconCss,
        label: item.label,
        groupHeader: item.groupHeader,
        tooltip: item.tooltip,
        shortcut: item.shortcut
    }));
}

export function sanitizeLabelItems(items: LabelItemModel[]): LabelItemModel[] {
    return items.map((item: LabelItemModel) => ({
        id: item.id,
        text: item.text,
        groupHeader: item.groupHeader,
        labelColor: item.labelColor,
        iconCss: item.iconCss
    }));
}

export function sanitizeContextMenuItems(items: ContextMenuItemModel[]): ContextMenuItemModel[] {
    return items.map((item: ContextMenuItemModel) => ({
        id: item.id,
        text: item.text,
        iconCss: item.iconCss,
        separator: item.separator,
        shortcut: item.shortcut,
        items: item.items ? sanitizeContextMenuItems(item.items) : []
    }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function sanitizeContent(content: ContentModel[]): any[] {
    return content.map((item: ContentModel) => ({
        id: item.id,
        type: item.type,
        content: item.content,
        styles: item.styles ? sanitizeStyles(item.styles) : item.styles,
        linkSettings: item.linkSettings ? sanitizeLinkSettings(item.linkSettings) : item.linkSettings,
        stylesApplied: item.stylesApplied
    }));
}

export function sanitizeStyles(styles: StyleModel): any {
    return {
        bold: styles.bold || false,
        italic: styles.italic || false,
        underline: styles.underline || false,
        strikethrough: styles.strikethrough || false,
        subscript: styles.subscript || false,
        superscript: styles.superscript || false,
        uppercase: styles.uppercase || false,
        lowercase: styles.lowercase || false,
        color: styles.color || '',
        bgColor: styles.bgColor || '',
        custom: styles.custom || ''
    };
}

export function sanitizeLinkSettings(linkSettings: LinkSettingsModel): any {
    return {
        url: linkSettings.url,
        openInNewWindow: linkSettings.openInNewWindow
    };
}

export function sanitizeImageSettings(imageSettings: ImageSettingsModel): any {
    return {
        saveFormat: imageSettings.saveFormat,
        src: imageSettings.src,
        allowedTypes: imageSettings.allowedTypes,
        width: imageSettings.width,
        height: imageSettings.height,
        minWidth: imageSettings.minWidth,
        maxWidth: imageSettings.maxWidth,
        minHeight: imageSettings.minHeight,
        maxHeight: imageSettings.maxHeight,
        altText: imageSettings.altText,
        cssClass: imageSettings.cssClass,
        readOnly: imageSettings.readOnly
    };
}

export function sanitizeCodeSettings(codeSettings: CodeSettingsModel): any {
    return {
        defaultLanguage: codeSettings.defaultLanguage,
        languages: codeSettings.languages && codeSettings.languages.length > 0
            ? codeSettings.languages.map((language: CodeLanguageModel) => ({
                language: language.language,
                label: language.label
            })) : []
    };
}

export function sanitizeBlock(block: BlockModel): any {
    return {
        id: block.id,
        parentId: block.parentId,
        placeholder: block.placeholder,
        type: block.type,
        content: (block.content && block.content.length > 0) ? sanitizeContent(block.content) : [],
        indent: block.indent,
        isExpanded: block.isExpanded,
        isChecked: block.isChecked,
        cssClass: block.cssClass,
        template: block.template,
        children: (block.children && block.children.length > 0) ? block.children.map((child: BlockModel) => sanitizeBlock(child)) : [],
        codeSettings: block.codeSettings ? sanitizeCodeSettings(block.codeSettings) : null,
        imageSettings: block.imageSettings ? sanitizeImageSettings(block.imageSettings) : null
    };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
