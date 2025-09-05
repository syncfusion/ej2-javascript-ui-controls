import { BlockActionItemModel, BlockModel, CommandItemModel, ContentModel, ContextMenuItemModel, ImageProps, LabelItemModel, StyleModel, ToolbarItemModel } from '../models/index';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { isEmptyString } from './block';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BlockType } from '../base/enums';

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

export function sanitizeContents(content: ContentModel[]): any[] {
    return content.map(sanitizeContent);
}

export function sanitizeContent(content: ContentModel): ContentModel {
    return {
        id: content.id,
        ...( !isEmptyString(content.type) ? { type: content.type } : {} ),
        ...( !isEmptyString(content.content) ? { content: content.content } : {} ),
        props: content.props
    };
}

export function sanitizeBlock(block: BlockModel): any {
    return {
        id: block.id,
        ...( !isEmptyString(block.type) ? { type: block.type } : {} ),
        content: (block.content && block.content.length > 0) ? sanitizeContents(block.content) : [],
        props: block.props,
        ...( (isNullOrUndefined(block.indent)) ? {} : { indent: block.indent }),
        ...( !isEmptyString(block.parentId) ? { parentId: block.parentId } : {} ),
        ...( !isEmptyString(block.cssClass) ? { cssClass: block.cssClass } : {} ),
        ...( !block.template ? {} : { template: block.template })
    };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
