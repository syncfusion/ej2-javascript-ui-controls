import { EmitType, Observer } from '@syncfusion/ej2-base';
import { FieldSettingsModel as MentionFieldSettingsModel, FilteringEventArgs, MentionChangeEventArgs, PopupEventArgs, SelectEventArgs, FieldSettingsModel, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { ClickEventArgs, ItemModel, MenuItemModel, OverflowMode, MenuEventArgs, Orientation, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, TabItemModel, SelectEventArgs as TabSelectEventArgs } from '@syncfusion/ej2-navigations';
import { FieldSettingsModel as MenuFieldSettingsModel } from '@syncfusion/ej2-navigations/common';
import { DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { Position, TooltipEventArgs, PositionDataModel } from '@syncfusion/ej2-popups';
import { SelectedEventArgs, UploadingEventArgs, SuccessEventArgs, FailureEventArgs, BeforeUploadEventArgs, RemovingEventArgs, AsyncSettingsModel } from '@syncfusion/ej2-inputs';
import { AnimationModel, MarginModel } from '@syncfusion/ej2-progressbar';
import { BlockModel, LabelItemModel, StyleModel, UserModel, ContentModel, BlockProperties, PasteCleanupSettingsModel, BlockActionMenuBeforeOpenEventArgs, BlockActionMenuBeforeCloseEventArgs, BeforePasteCleanupEventArgs, AfterPasteCleanupEventArgs, BlockData, CommandItemModel } from '../models/index';
import { ContentType, BlockType } from '../models/enums';
import { DeletionType } from '../common/enums';
import { BlockService } from '../block-manager/services/block-service';
import { BlockActionMenuModule, ContextMenuModule, InlineContentInsertionModule, InlineToolbarModule, SlashCommandModule } from '../blockeditor/renderer/index';
import { SelectionDirection } from './types';
import { ITableRowInsertOptions, ITableCellsClearOperation, ITableColumnInsertOptions, ITableCellsPasteOperation, IBulkRowsDeleteOperation, IBulkColumnsDeleteOperation, ITableHeaderInputOperation } from '../block-manager/base/interface';
import { actionType } from './constant';

export interface BlockManagerModel {
    observer?: Observer
    blockService?: BlockService
    blocks: BlockModel[]
    rootEditorElement: HTMLElement
    blockContainer: HTMLElement

    readOnly: boolean;
    undoRedoStack: number;
    pasteCleanupSettings: PasteCleanupSettingsModel;

    inlineContentInsertionModule: InlineContentInsertionModule;
    slashCommandModule: SlashCommandModule;
    inlineToolbarModule: InlineToolbarModule;
    contextMenuModule: ContextMenuModule;
    blockActionMenuModule: BlockActionMenuModule;
}


/* Model-driven Interfaces */
export interface IBlockOptions {
    blockId: string;
}

export interface IBlocksContainerInfo {
    array: BlockModel[];
    containerType: 'root' | 'children' | 'cell';
    containerId: string; // '' for root, parent block id for children, cell id for cell blocks
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

export type IRemoveBlockOptions = IBlockOptions;

export type IDuplicateBlockOptions = IBlockOptions;

export interface IIndentBlockOptions extends IBlockOptions {
    shouldDecrease?: boolean;
}

/* Interaction-driven Interfaces */
export interface IAddBlockInteraction {
    block?: BlockModel
    properties?: BlockProperties
    targetBlockId?: string
    targetBlock?: HTMLElement
    targetBlockModel?: BlockModel
    isAfter?: boolean
    blockType?: string | BlockType
    contentElement?: HTMLElement | Node,
    contentModel?: ContentModel[]
    blockID?: string
    isUndoRedoAction?: boolean
    splitOffset?: number
    isSplitting?: boolean,
    preventUIUpdate?: boolean,
    preventEventTrigger?: boolean,
    blockBeforeSplit?: BlockModel
    preventUpdateAction?: boolean
    forceIgnoreTargetUpdate?: boolean
}

export interface IDeleteBlockInteraction {
    blockElement: HTMLElement
    isUndoRedoAction?: boolean
    mergeDirection?: 'previous' | 'next'
    isSplitting?: boolean
    isTargetDeletion?: boolean
    isMethod?: boolean
    blockBeforeSplit?: BlockModel;
    blocksAfterSplit?: BlockModel[];
    targetBlockModel?: BlockModel;
    sourceBlockModel?: BlockModel;
    preventEventTrigger?: boolean
    preventChangesTracking?: boolean
    preventMinimumOne?: boolean
}

export interface IAddBulkBlocksInteraction {
    blocks?: BlockModel[]
    targetBlockId?: string
    isUndoRedoAction?: boolean
    insertionType?: 'blocks' | 'block'
    oldBlockModel?: BlockModel
    cursorBlockAfterSplit?: BlockModel
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
    shouldPreventUpdates?: boolean;
    preventEventTrigger?: boolean;
    oldBlockModel?: BlockModel;
}

/* Renderer Interfaces */

export interface IPopupRenderOptions {
    width?: string | number
    height?: string | number
    element?: string | HTMLElement
    content?: string | HTMLElement
    relateTo?: string | HTMLElement
    position?: PositionDataModel;
    offsetX?: number;
    offsetY?: number;
}

export interface IDropDownRenderOptions {
    instance?: DropDownButtonModel,
    element?: string | HTMLElement,
    inlineClass?: string,
    type?: 'color' | 'bgColor'
}

export interface IMenubarRenderOptions {
    cssClass?: string
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

export interface IDialogRenderOptions {
    headerTemplate?: string,
    footerTemplate?: string,
    contentTemplate?: string,
    showCloseIcon?: boolean,
    closeOnEscape?: boolean,
    locale?: string,
    width?: string,
    height?: string,
    visible?: boolean,
    element?: HTMLElement
}

export interface ICheckBoxRenderOptions {
    label?: string,
    checked?: boolean,
    element?: HTMLInputElement
}

export interface IDropDownListRenderOptions {
    dataSource?: { [key: string]: Object }[],
    targetElement?: HTMLElement
    fields?: FieldSettingsModel,
    value?: string,
    change?: EmitType<ChangeEventArgs>
}

export interface IToolbarRenderOptions {
    element?: string | HTMLElement
    items: ItemModel[]
    width?: string | number
    overflowMode?: OverflowMode
    clicked?: EmitType<ClickEventArgs>,
    created?: EmitType<Event>
}

export interface IProgressBarRendererOptions {
    element?: string | HTMLElement;
    type?: string;
    height?: string;
    width?: string;
    value?: number;
    minimum?: number;
    maximum?: number;
    trackThickness?: number;
    progressThickness?: number;
    showProgressValue?: boolean;
    animation?: AnimationModel;
    margin?: MarginModel;
}

export interface ITabRendererOptions {
    element?: string | HTMLElement;
    items?: TabItemModel[];
    selectedItem?: number;
    cssClass?: string;
    selected?: EmitType<TabSelectEventArgs>;
}

export interface IUploaderRendererOptions {
    element?: string | HTMLInputElement;
    asyncSettings?: AsyncSettingsModel;
    multiple?: boolean;
    allowedExtensions?: string;
    maxFileSize?: number;
    dropArea?: HTMLElement | string;
    cssClass?: string;
    selected?: EmitType<SelectedEventArgs>;
    uploading?: EmitType<UploadingEventArgs>;
    progress?: EmitType<any>;
    success?: EmitType<SuccessEventArgs>;
    failure?: EmitType<FailureEventArgs>;
    beforeUpload?: EmitType<BeforeUploadEventArgs>;
    removing?: EmitType<RemovingEventArgs>;
}

export interface IMentionRenderOptions {
    element?: string | HTMLElement,
    mentionChar?: string,
    dataSource?: { [key: string]: Object }[] | UserModel[] | LabelItemModel[] | CommandItemModel[],
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
    isChecked?: boolean;
    isExpanded?: boolean
}

export interface ITransformOperation extends IBlockData {
    block?: BlockModel;
    oldBlockModel?: BlockModel;
    newBlockModel?: BlockModel;
}

export interface IMultipleBlocksTransformOperation extends IBlockData {
    transformedBlocks?: Array<{ blockId: string, oldBlockModel?: BlockModel, newBlockModel?: BlockModel }>;
}

export interface IAddOperation extends IBlockData {
    currentIndex?: number;
    isSplitting?: boolean;
    isTargetDeletion?: boolean,
    isAfter?: boolean;
    contentElement?: Node;
    blockBeforeSplit?: BlockModel;
    blocksAfterSplit?: BlockModel[];
}

export interface IDeleteOperation extends IBlockData, IAddOperation {}

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
    cursorBlockAfterSplit?: BlockModel,
    pasteEndOffset?: number
}

export interface IFormattingOperation {
    blockIDs?: string[]
    oldBlockModels?: BlockModel[]
    updatedBlockModels?: BlockModel[]
    isTypingWithFormat?: boolean
    selectionState: IBlockSelectionState
}

export interface IMultiDeleteOperation {
    deletedBlocks: BlockModel[]
    deletionType: DeletionType
    direction?: 'previous' | 'next'
    firstBlockIndex?: number
    cursorBlockId?: string;
}

export interface IBlockSelectionState {
    startBlockId: string;
    endBlockId: string;
    startContainerPath?: number[];
    endContainerPath?: number[];
    startOffset: number;
    endOffset: number;
    isCollapsed?: boolean;
}

export interface IUndoRedoState {
    oldBlockModel?: BlockModel;
    updatedBlockModel?: BlockModel;
    oldContentModel?: ContentModel;
    newContentModel?: ContentModel;
    oldContents?: ContentModel[]
    newContents?: ContentModel[]
    action?: actionType;
    data?: IBlockData | IMoveOperation | IIndentOperation | IDeleteOperation | IAddOperation |
    ITransformOperation | IMultipleBlocksTransformOperation | IMultiDeleteOperation | IClipboardPasteOperation | IFormattingOperation |
    ITableRowInsertOptions | ITableColumnInsertOptions | ITableCellsClearOperation | ITableCellsPasteOperation |
    IBulkRowsDeleteOperation | IBulkColumnsDeleteOperation | ITableHeaderInputOperation,
    undoSelection?: IBlockSelectionState;
    redoSelection?: IBlockSelectionState;
}

/* Other Interfaces */

export type SubCommand = 'link';
export interface ExecCommandOptions {
    command?: keyof StyleModel,
    subCommand?: SubCommand,
    value?: string | LinkData,
    isTypingWithFormat?: boolean,
    isRemoteChanges?: boolean
    shouldRemoveGlobally?: boolean
}

export interface IInlineContentInsertionOptions {
    node?: HTMLElement | Node
    range?: Range
    contentType?: string | ContentType
    block?: BlockModel
    blockElement?: HTMLElement,
    itemData?: UserModel | LabelItemModel
    mentionChar?: string
}

export interface RangePath {
    startContainer?: Node;
    startOffset?: number;
    endContainer?: Node;
    endOffset?: number;
    contentElement?: HTMLElement
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
    title?: string;
    shouldRemoveLink?: boolean;
}

export interface IFromBlockData {
    blockId?: string;
    model?: BlockModel;
    parent?: BlockModel;
    index?: number;
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

/**
 * The interface helps to generate necessary arguments for calculating the offsetX and offsetY values.
 *
 * @hidden
 */
export interface InlineToolbarOffsetParam {
    /**
     * Specifies the relative element of the popup.
     */
    blockElement: HTMLElement
    /**
     * Specifies the DOMRect of the popup relative element.
     */
    blockRect: DOMRect
    /**
     * Specifies the range of the editor instance.
     */
    range: Range
    /**
     * Specifies the current range DOMRect of the editor.
     */
    rangeRect: DOMRect
    /**
     * Specifies the selection direction.
     */
    direction: SelectionDirection
    /**
     * Specifies the content panel element.
     */
    contentPanelElement?: HTMLElement
    /**
     * Specifies the editable element DOMRect.
     */
    editPanelDomRect?: DOMRect
    /**
     * Specifies the popup element DomRect.
     */
    popupRect: DOMRect
}

export interface InlineToolbarPositionProps {
    /**
     * Specifies the horizontal position for the toolbar popup.
     */
    positionX: number,
    /**
     * Specifies the vertical position for the toolbar popup.
     */
    positionY: number
}

export interface ICallbackData {
    callback: Function
}

export interface BlockActionMenuCloseEventProps extends BlockActionMenuBeforeCloseEventArgs, ICallbackData {}

export interface BlockActionMenuOpenEventProps extends BlockActionMenuBeforeOpenEventArgs, ICallbackData {}

export interface BeforePasteEventProps extends BeforePasteCleanupEventArgs, ICallbackData {}

export interface AfterPasteEventProps extends AfterPasteCleanupEventArgs, ICallbackData {}

export interface BlockDatas extends BlockData {
    targetId?: string
    isAfter?: boolean
    isMovingUp?: boolean
}

export interface IColorPickerRenderOptions {
    element: HTMLElement;
    type: 'color' | 'bgColor';
    cssClass?: string;
    onChange?: (value: string) => void;
    iconCss?: string;
}
