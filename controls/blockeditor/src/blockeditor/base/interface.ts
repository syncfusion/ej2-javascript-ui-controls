/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitType } from '@syncfusion/ej2-base';
import { FieldSettingsModel as MentionFieldSettingsModel, FilteringEventArgs, MentionChangeEventArgs, PopupEventArgs, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { ClickEventArgs, ItemModel, MenuItemModel, OverflowMode, MenuEventArgs, Orientation, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { FieldSettingsModel as MenuFieldSettingsModel } from '@syncfusion/ej2-navigations/common';
import { DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { BlockModel, LabelItemModel, StyleModel, UserModel, ContentModel, BlockProperties } from '../models/index';
import { ContentType, BlockType, DeletionType } from './enums';
import { Position, TooltipEventArgs } from '@syncfusion/ej2-popups';

/* Model-driven Interfaces */
export interface IBlockOptions {
    blockId: string;
}

export interface IAddBlockOptions {
    block: BlockModel | Partial<BlockModel>;
    targetBlockId?: string;
    isAfter?: boolean;
}

export interface IMoveBlockOptions {
    blockIds: string[];
    toBlockId: string;
    isMovingUp?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRemoveBlockOptions extends IBlockOptions { }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDuplicateBlockOptions extends IBlockOptions { }

export interface IIndentBlockOptions extends IBlockOptions {
    shouldDecrease?: boolean;
}

/* Interaction-driven Interfaces */
export interface IAddBlockInteraction {
    block?: BlockModel
    targetBlockId?: string
    targetBlock?: HTMLElement
    targetBlockModel?: BlockModel
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

export interface IDeleteBlockInteraction {
    blockElement: HTMLElement
    isUndoRedoAction?: boolean
    mergeDirection?: 'previous' | 'next'
    splitOffset?: number
    lastChild?: HTMLElement
    contentElement?: Node
    isMethod?: boolean
}

export interface IAddBulkBlocksInteraction {
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

export interface IMoveBlocksInteraction {
    fromBlockIds?: string[];
    toBlockId?: string;
    fromIndex?: number[];
    toIndex?: number;
    fromParentId?: string[];
    toParentId?: string;
    isInteracted?: boolean;
    isUndoRedoAction?: boolean;
    isMovedUp?: boolean;
}

export interface ITransformBlockInteraction {
    block?: BlockModel;
    blockElement?: HTMLElement;
    newBlockType?: string;
    isUndoRedoAction?: boolean;
    props?: BlockProperties;
}

/* Renderer Interfaces */

export interface IPopupRenderOptions {
    width?: string | number
    height?: string | number
    element?: string | HTMLElement
    content?: string | HTMLElement
    relateTo?: string | HTMLElement
}

export interface IDropDownRenderOptions {
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

/* Undo Redo Interfaces */
export interface IBlockData {
    blockId?: string;
}

export interface ITransformOperation extends IBlockData {
    block?: BlockModel;
    oldBlockModel?: BlockModel;
    newBlockModel?: BlockModel;
}

export interface IDeleteOperation extends IBlockData {
    currentIndex?: number;
}

export interface IAddOperation extends IBlockData {
    currentIndex?: number;
    lastChild?: HTMLElement;
    splitOffset?: number;
    contentElement?: Node;
}

export interface IMoveOperation {
    blockIds?: string[];
    fromIndex?: number[];
    toIndex?: number;
    fromParentId?: string[];
    toParentId?: string;
    isMovedUp?: boolean;
    toBlockId?: string;
}

export interface IIndentOperation {
    blockIDs?: string[];
    shouldDecrease?: boolean;
    isUndoRedoAction?: boolean;
}

export interface ILineBreakOperation extends IBlockData {
    oldContent?: ContentModel[]
    newContent?: ContentModel[]
    isUndoRedoAction?: boolean;
}

export interface IClipboardPasteOperation {
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

export interface IMultiDeleteOperation {
    deletedBlocks: BlockModel[]
    deletionType: DeletionType
    direction?: 'previous' | 'next'
    firstBlockIndex?: number
    cursorBlockId?: string;
}

export interface IUndoRedoSelectionState {
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
    data?: IBlockData | IMoveOperation | IIndentOperation | IDeleteOperation | IAddOperation |
    ITransformOperation | IMultiDeleteOperation | IClipboardPasteOperation,
    undoSelection?: IUndoRedoSelectionState;
    redoSelection?: IUndoRedoSelectionState;
    isFormattingOnUserTyping?: boolean
}

/* Other Interfaces */

export type SubCommand = 'Link';
export interface ExecCommandOptions {
    command?: keyof StyleModel,
    subCommand?: SubCommand,
    value?: string | LinkData,
    isFormattingOnUserTyping?: boolean
}

export interface IInlineContentInsertionOptions {
    node?: HTMLElement | Node
    range?: Range
    contentType?: string | ContentType
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

export interface IPasteCleanupOptions {
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

export interface IClipboardPayloadOptions {
    e?: ClipboardEvent
    html?: string;
    text?: string;
    blockeditorData?: string;
    file?: File | Blob;
}

export interface ISplitContentData {
    beforeFragment: DocumentFragment,
    afterFragment: DocumentFragment,
    splitOffset: number
}

export interface LinkData {
    text?: string;
    url?: string;
    title?: string
    openInNewWindow?: boolean;
    shouldRemoveLink?: boolean;
}

export interface IFromBlockData {
    blockId?: string;
    model?: BlockModel;
    parent?: BlockModel;
    index?: number
}

export interface IToBlockData {
    toBlockModel: BlockModel
    toParentBlockModel: BlockModel
    toBlockIndex: number
    toParentBlockIndex: number
}

export interface ListItemProperties {
    listType: string;
    content: string[];
    nestedLevel: number;
    listFormatOverride: number;
    class: string;
    listStyle: string;
    listStyleTypeName: string;
    start: number;
    styleMarginLeft: string;
}

export interface BlockPositionInfo {
    currentBlock: BlockModel;
    currentBlockParent: BlockModel;
    isFirstBlock: boolean;
    isLastBlock: boolean;
    hasOnlyOneBlock: boolean
}
