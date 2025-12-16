import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { BlockActionItemModel, CommandItemModel, ContentModel, ContextMenuItemModel, LabelItemModel, ICollapsibleHeadingBlockSettings, IHeadingBlockSettings } from '../../models/index';
import { BlockModel } from '../../models/block/block-model';
import { isEmptyString } from './block';
import { ToolbarCommandName } from '../../models/types';
import { IToolbarItemModel } from '../../models/interface';

/**
 * Creates a shallow copy of the given object, excluding specified properties.
 *
 * @param {any} obj - The object to copy.
 * @param {string[]} excludeKeys - Optional array of property keys to exclude from the copy.
 * @returns {any} A new object with copied properties.
 */
export function cloneObject(obj: any, excludeKeys: string[] = []): any {
    const result: any = Object.create(Object.getPrototypeOf(obj));
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && excludeKeys.indexOf(key) === -1) {
            (result as any)[key as any] = (obj as any)[key as any];
        }
    }
    return result;
}

/**
 * Transforms an array of ToolbarItemModel objects into an array of ItemModel objects.
 *
 * @param {IToolbarItemModel[]} items - The toolbar items to transform.
 * @returns {ItemModel[]} The transformed toolbar items.
 */
export function transformIntoToolbarItem(items: (string | ToolbarCommandName | IToolbarItemModel)[]): ItemModel[] {
    return items.map((item: IToolbarItemModel) => ({
        id: item.id,
        prefixIcon: item.iconCss,
        tooltipText: item.tooltipText,
        text: item.text,
        cssClass: item.cssClass,
        disabled: item.disabled,
        visible: item.visible,
        tabIndex: item.tabIndex,
        template: item.template,
        type: item.type,
        htmlAttributes: item.htmlAttributes,
        command: item.command
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
        groupBy: item.groupBy,
        tooltip: item.tooltip,
        shortcut: item.shortcut
    }));
}

export function sanitizeLabelItems(items: LabelItemModel[]): LabelItemModel[] {
    return items.map((item: LabelItemModel) => ({
        id: item.id,
        text: item.text,
        groupBy: item.groupBy,
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

export function sanitizeContents(content: ContentModel[]): ContentModel[] {
    return content.map(sanitizeContent);
}

export function sanitizeContent(content: ContentModel): ContentModel {
    return {
        id: content.id,
        ...( !isEmptyString(content.contentType) ? { contentType: content.contentType } : {} ),
        ...( !isNullOrUndefined(content.content) ? { content: content.content } : {} ),
        properties: content.properties
    };
}

export function sanitizeHeadingProps(props: Partial<ICollapsibleHeadingBlockSettings> | Partial<IHeadingBlockSettings>): any {
    const sanitizedInnerProps: Partial<ICollapsibleHeadingBlockSettings> | Partial<IHeadingBlockSettings> = props ? { ...props } : {};
    const level: number = sanitizedInnerProps.level;
    if (!Number.isInteger(level) || level < 1 || level > 4) {
        sanitizedInnerProps.level = 1;
    }
    return sanitizedInnerProps;
}

export function sanitizeBlock(block: BlockModel): BlockModel {
    return {
        id: block.id,
        ...( !isEmptyString(block.blockType) ? { blockType: block.blockType } : {} ),
        content: (block.content && block.content.length > 0) ? sanitizeContents(block.content) : [],
        properties: block.properties,
        ...( (isNullOrUndefined(block.indent)) ? {} : { indent: block.indent }),
        ...( !isEmptyString(block.parentId) ? { parentId: block.parentId } : {} ),
        ...( !isEmptyString(block.cssClass) ? { cssClass: block.cssClass } : {} ),
        ...( !block.template ? {} : { template: block.template })
    };
}
