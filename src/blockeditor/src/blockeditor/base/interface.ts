/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitType } from '@syncfusion/ej2-base';
import { FieldSettingsModel as MentionFieldSettingsModel, FilteringEventArgs, MentionChangeEventArgs, PopupEventArgs, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { ClickEventArgs, ItemModel, MenuItemModel, OverflowMode, MenuEventArgs, Orientation, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { FieldSettingsModel as MenuFieldSettingsModel } from '@syncfusion/ej2-navigations/common';
import { DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { BlockModel, LabelItemModel, StyleModel, UserModel, ContentModel, Block } from '../models/index';
import { ContentType, BlockType, DeletionType } from './enums';
import { Position, TooltipEventArgs } from '@syncfusion/ej2-popups';

export type SubCommand = 'Link';

export interface LinkData {
    text?: string;
    url?: string;
    title?: string
    openInNewWindow?: boolean;
    shouldRemoveLink?: boolean;
}

export interface ISplitContent {
    beforeFragment: DocumentFragment,
    afterFragment: DocumentFragment,
    splitOffset: number
}

export interface IPopupRenderOptions {
    width?: string | number
    height?: string | number
    element?: string | HTMLElement
    content?: string | HTMLElement
    relateTo?: string | HTMLElement
}

export interface IDropDownButtonArgs {
    instance?: DropDownButtonModel,
    element?: string | HTMLElement,
    inlineClass?: string,
    type?: 'color' | 'bgColor',
}

export interface IMenubarRenderOptions {
    target?: string
    element?: string | HTMLUListElement
    template?: string | Function
    orientation?: Orientation
    showItemOnClick?: boolean
    items: MenuItemModel[]
    itemTemplate?: string | Function
    fields?: MenuFieldSettingsModel,
    select?: EmitType<MenuEventArgs>
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>
    open?: EmitType<OpenCloseMenuEventArgs>
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>
    close?: EmitType<OpenCloseMenuEventArgs>
}

export interface IToolbarRenderOptions {
    element?: string | HTMLElement
    items: ItemModel[]
    width?: string | number
    overflowMode?: OverflowMode
    enablePersistence?: boolean,
    enableRtl?: boolean,
    clicked?: EmitType<ClickEventArgs>,
    created?: EmitType<Event>
}

export interface IMentionRenderOptions {
    element?: string | HTMLElement,
    mentionChar?: string,
    dataSource?: any,
    cssClass?: string,
    highlight?: boolean,
    fields?: MentionFieldSettingsModel,
    itemTemplate?: string,
    displayTemplate?: string,
    popupWidth?: string
    popupHeight?: string,
    beforeOpen?: EmitType<PopupEventArgs>,
    beforeClose?: EmitType<PopupEventArgs>,
    opened?: EmitType<PopupEventArgs>,
    closed?: EmitType<PopupEventArgs>,
    select?: EmitType<SelectEventArgs>,
    change?: EmitType<MentionChangeEventArgs>,
    filtering?: EmitType<FilteringEventArgs>
}

export interface ITooltipRenderOptions {
    element?: string | HTMLElement
    content?: string | HTMLElement | Function
    container?: string | HTMLElement;
    target?: string
    position?: Position
    showTipPointer?: boolean
    windowCollision?: boolean
    cssClass?: string
    beforeRender?: EmitType<TooltipEventArgs>
}

export interface ExecCommandOptions {
    command?: keyof StyleModel,
    subCommand?: SubCommand,
    value?: string | LinkData,
    isFormattingOnUserTyping?: boolean
}

export interface IInlineContentInsertionArgs {
    node?: HTMLElement | Node
    range?: Range
    contentType?: ContentType
    block?: BlockModel
    blockElement?: HTMLElement,
    itemData?: UserModel | LabelItemModel
}

export interface RangePath {
    startContainer?: Node;
    startOffset?: number;
    endContainer?: Node;
    endOffset?: number;
    parentElement?: HTMLElement
}

export interface CommentRange {
    startContainerPath: number[];
    startOffset: number;
    endContainerPath: number[];
    endOffset: number;
    textContent: string;
}

export interface IDeleteBlockArgs {
    blockElement: HTMLElement
    isUndoRedoAction?: boolean
    mergeDirection?: 'previous' | 'next'
    splitOffset?: number
    lastChild?: HTMLElement
    contentElement?: Node
    isMethod?: boolean
}

export interface IAddBlockArgs {
    block?: BlockModel
    targetBlock?: HTMLElement
    isAfter?: boolean
    blockType?: string | BlockType
    contentElement?: Node,
    contentModel?: ContentModel[]
    blockID?: string
    isUndoRedoAction?: boolean
    splitOffset?: number
    lastChild?: HTMLElement,
    preventUIUpdate?: boolean
}

export interface IAddBulkBlocksArgs {
    blocks?: BlockModel[]
    targetBlockId?: string
    isUndoRedoAction?: boolean
    insertionType?: 'blocks' | 'block'
    oldBlockModel?: BlockModel
    clipboardBlocks?: BlockModel[]
    pastedBlocks?: BlockModel[]
    isPastedAtStart?: boolean
    isSelectivePaste?: boolean
}

export interface IMoveBlock {
    blockIds?: string[];
    fromIndex?: number[];
    toIndex?: number;
    fromParentId?: string[];
    toParentId?: string;
    isMovedUp?: boolean;
    toBlockId?: string;
}

export interface IData {
    blockId?: string;
}

export interface ITransform extends IData {
    block?: BlockModel;
    oldBlockType?: string;
    newBlockType?: string;
}

export interface IDelete extends IData {
    currentIndex?: number;
}

export interface IAdd extends IData {
    currentIndex?: number;
    lastChild?: HTMLElement;
    splitOffset?: number;
    contentElement?: Node;
}
export interface IUndoRedoSelection {
    startBlockId: string;
    endBlockId: string;
    startContainerPath: number[];
    endContainerPath: number[];
    startOffset: number;
    endOffset: number;
    isCollapsed: boolean;
}
export interface IUndoRedoState {
    oldBlockModel?: BlockModel;
    updatedBlockModel?: BlockModel;
    oldContentModel?: ContentModel;
    newContentModel?: ContentModel;
    oldContents?: ContentModel[]
    newContents?: ContentModel[]
    action?: string;
    data?: IData | IMoveBlock | IIndentBlockArgs | IDelete | IAdd | ITransform | IMultipleBlockDeletion | IClipboardPasteUndoRedo,
    undoSelection?: IUndoRedoSelection;
    redoSelection?: IUndoRedoSelection;
    isFormattingOnUserTyping?: boolean
}

export interface IIndentBlockArgs {
    blockIDs?: string[];
    shouldDecrease?: boolean;
    isUndoRedoAction?: boolean;
}

export interface IClipboardPasteUndoRedo {
    type?: 'blocks' | 'block' | 'content'
    clipboardData?: {
        blocks?: BlockModel[]
    }
    blocks?: BlockModel[]
    oldContent?: ContentModel[]
    newContent?: ContentModel[]
    targetBlockId?: string
    isPastedAtStart?: boolean
    isSelectivePaste?: boolean
}

export interface IMultipleBlockDeletion {
    deletedBlocks: BlockModel[]
    deletionType: DeletionType
    direction?: 'previous' | 'next'
    firstBlockIndex?: number
    cursorBlockId?: string;
}


export interface IMoveBlockArgs {
    fromBlockIds?: string[];
    toBlockId?: string;
    fromIndex?: number[];
    toIndex?: number;
    fromParentId?: string[];
    toParentId?: string;
    isInteracted?: boolean;
    isUndoRedoAction?: boolean;
    isUndoing?: boolean;
    isMovedUp?: boolean;
}

export interface ITransformBlockArgs {
    block?: BlockModel;
    blockElement?: HTMLElement;
    newBlockType?: string;
    isUndoRedoAction?: boolean;
}

export interface IPasteCleanupArgs {
    e?: ClipboardEvent;
    html?: string;
    plainText?: string;
    isPlainText?: boolean;
    keepFormat?: boolean;
    allowedStyles?: string[];
    deniedTags?: string[];
    isFromMsWord?: boolean;
    onSucess?: (data: string) => void;
}

export interface IClipboardPayload {
    e?: ClipboardEvent
    html?: string;
    text?: string;
    blockeditorData?: string;
    file?: File | Blob;
}

export interface IFromBlockArgs {
    blockId?: string;
    model?: BlockModel;
    parent?: BlockModel;
    index?: number
}
