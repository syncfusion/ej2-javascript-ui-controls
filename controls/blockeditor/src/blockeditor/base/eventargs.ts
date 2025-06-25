import { CommandItemModel, BlockModel, ToolbarItemModel, UserModel, BlockActionItemModel, ContentModel, ContextMenuItemModel } from '../models/index';


/**
 * This event is triggered when the command menu opens.
 *
 */
export interface CommandMenuOpenEventArgs {
    /**
     * Specifies the list of command items to be displayed in the command menu.
     *
     * @default null
     */
    commands: CommandItemModel[];

    /**
     * Specifies the native browser event associated with the opening of the command menu.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the event should be canceled. `true` to prevent opening the command menu.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * This event is triggered when the command menu closes.
 *
 */
export interface CommandMenuCloseEventArgs {
    /**
     * Specifies the list of command items that were displayed in the command menu.
     *
     * @default null
     */
    commands: CommandItemModel[];

    /**
     * Specifies the native browser event associated with the closing of the command menu.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the event should be canceled. `true` to prevent closing the command menu.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * This event is triggered when a query is typed in the command menu and filtering of commands occurs.
 *
 */
export interface CommandQueryFilteringEventArgs {
    /**
     * Specifies the list of command items after filtering based on the query.
     *
     * @default null
     */
    commands: CommandItemModel[];

    /**
     * Specifies the query text that was typed by the user.
     *
     * @default ''
     */
    text: string;

    /**
     * Specifies the native browser event associated with the query filtering action.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the event should be canceled. `true` to prevent the filtering.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * This event is triggered when a command item is clicked in the command menu.
 *
 */
export interface CommandItemClickedEventArgs {
    /**
     * Specifies the command item that was clicked.
     *
     * @default null
     */
    command: CommandItemModel;

    /**
     * Specifies the HTML element associated with the clicked command item.
     *
     * @default null
     */
    element: HTMLElement;

    /**
     * Specifies whether the click was made by the user (`true`) or programmatically (`false`).
     *
     * @default false
     */
    isInteracted: boolean;

    /**
     * Specifies the native browser event associated with the command item click.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the event should be canceled. `true` to prevent the default click action.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * This event is triggered when the toolbar is opened.
 *
 */
export interface ToolbarOpenEventArgs {
    /**
     * Specifies the list of toolbar items to be displayed.
     *
     * @default null
     */
    items: ToolbarItemModel[];

    /**
     * Specifies the native browser event associated with the opening of the toolbar.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the event should be canceled. `true` to prevent opening the toolbar.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * This event is triggered when the toolbar is closed.
 *
 */
export interface ToolbarCloseEventArgs {
    /**
     * Specifies the list of toolbar items that were displayed.
     *
     * @default null
     */
    items: ToolbarItemModel[];

    /**
     * Specifies the native browser event associated with the closing of the toolbar.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the event should be canceled. `true` to prevent closing the toolbar.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * This event is triggered when a toolbar item is clicked.
 *
 */
export interface ToolbarItemClickedEventArgs {
    /**
     * Specifies the toolbar item that was clicked.
     *
     * @default null
     */
    item: ToolbarItemModel;

    /**
     * Specifies the native browser event associated with the toolbar item click.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the click was made by the user (`true`) or programmatically (`false`).
     *
     * @default false
     */
    isInteracted: boolean;

    /**
     * Specifies whether the event should be canceled. `true` to prevent the click action.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * Represents the event arguments for opening the block action menu.
 *
 */
export interface BlockActionMenuOpenEventArgs {
    /**
     * Specifies the list of block action items in the menu.
     *
     * @default null
     */
    items: BlockActionItemModel[];

    /**
     * Represents the event that triggered the opening of the menu.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether to cancel the action.
     * If true, the menu will not open.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * Represents the event arguments for closing the block action menu.
 *
 */
export interface BlockActionMenuCloseEventArgs {
    /**
     * Specifies the list of block action items in the menu.
     *
     * @default null
     */
    items: BlockActionItemModel[];

    /**
     * Represents the event that triggered the closing of the menu.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether to cancel the action.
     * If true, the menu will not close.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * Represents the event arguments for a block action item click event.
 *
 */
export interface BlockActionItemClickEventArgs {
    /**
     * Specifies the block action item that was clicked.
     *
     * @default null
     */
    item: BlockActionItemModel;

    /**
     * Specifies the HTML element that triggered the click event.
     *
     * @default null
     */
    element: HTMLElement;

    /**
     * Specifies whether the item was directly interacted with.
     *
     * @default false
     */
    isInteracted: boolean;

    /**
     * Specifies whether to cancel the item click action.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * Provides information about the event before the context menu opens.
 */
export interface ContextMenuBeforeOpenEventArgs {
    /**
     * Specifies the list of context menu items available in the menu.
     *
     * @default []
     */
    items: ContextMenuItemModel[];

    /**
     * Specifies the parent context menu item.
     *
     * @default null
     */
    parentItem: ContextMenuItemModel;

    /**
     * Specifies the native browser event associated with the opening of the context menu.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the opening of the context menu should be canceled.
     * If set to `true`, the menu will not be displayed.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * Provides information about the event before the context menu closes.
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ContextMenuBeforeCloseEventArgs extends ContextMenuBeforeOpenEventArgs {}

/**
 * Provides information about the event when the context menu opens.
 */
export interface ContextMenuOpenEventArgs {
    /**
     * Specifies the list of context menu items available in the menu.
     *
     * @default []
     */
    items: ContextMenuItemModel[];

    /**
     * Specifies the parent context menu item.
     *
     * @default null
     */
    parentItem: ContextMenuItemModel;

    /**
     * Specifies the HTML element associated with the clicked menu item.
     *
     * @default null
     */
    element: HTMLElement;
}

/**
 * Provides information about the event when the context menu closes.
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ContextMenuCloseEventArgs extends ContextMenuOpenEventArgs {}

/**
 * Provides information about the event when a context menu item is being clicked.
 */
export interface ContextMenuItemClickEventArgs {
    /**
     * Specifies the clicked context menu item.
     *
     * @default null
     */
    item: ContextMenuItemModel;

    /**
     * Specifies the native browser event associated with the item click.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies whether the action triggered by clicking the menu item should be canceled.
     * If set to `true`, the menu action will not be executed.
     *
     * @default false
     */
    cancel: boolean;
}

/**
 * Represents the event arguments for a block action content change event.
 *
 */
export interface ContentChangedEventArgs {
    /**
     * Specifies the native event that triggered the content change.
     */
    event: Event;

    /**
     * Specifies the updated block content after the change.
     *
     * @default null
     */
    content: ContentModel;

    /**
     * Specifies the block content before the change.
     *
     * @default null
     */
    previousContent: ContentModel;
}

/**
 * Represents the event arguments for a selection change event.
 *
 */
export interface SelectionChangedEventArgs {
    /**
     * Specifies the native event that triggered the selection change.
     */
    event: Event;

    /**
     * Specifies the new selection range, represented as an array with [start, end] indexes.
     *
     * @default null
     */
    range: [number, number];

    /**
     * Specifies the previous selection range, represented as an array with [start, end] indexes.
     *
     * @default null
     */
    previousRange: [number, number];
}

/**
 * Represents the arguments for an undo/redo event.
 *
 */
export interface UndoRedoEventArgs {
    /**
     * Specifies whether the action is an undo or redo.
     *
     * @default false
     */
    isUndo: boolean;

    /**
     * Specifies the current block model after the undo/redo action.
     *
     * @default null
     */
    content: BlockModel;

    /**
     * Specifies the block model before the undo/redo action.
     *
     * @default null
     */
    previousContent: BlockModel;
}

/**
 * This event is triggered when a new block is added to the editor.
 *
 */
export interface BlockAddedEventArgs {
    /**
     * Specifies the block model that was added.
     *
     * @default null
     */
    block: BlockModel;

    /**
     * Specifies the ID of the parent block (if any).
     *
     * @default ''
     */
    parentID: string;

    /**
     * Specifies the index where the block was added.
     *
     * @default -1
     */
    index: number;

    /**
     * Indicates if the block was added via paste action.
     *
     * @default false
     */
    isPasted: boolean;

    /**
     * Indicates whether the user directly interacted with the block (e.g., adding it manually).
     * If `false`, the block was added programmatically.
     *
     * @default false
     */
    isInteracted: boolean;
}

/*
 * This event is triggered when a block is removed from the editor.
 *
 */
export interface BlockRemovedEventArgs {
    /**
     * Specifies the block model that was removed.
     *
     * @default null
     */
    block: BlockModel;

    /**
     * Specifies the ID of the parent block (if any).
     *
     * @default ''
     */
    parentID: string;

    /**
     * Specifies the index of the block that was removed.
     *
     * @default -1
     */
    index: number;

    /**
     * Indicates whether the user directly interacted with the block (e.g., removing it manually).
     * If `false`, the block was removed programmatically.
     *
     * @default false
     */
    isInteracted: boolean;
}

/*
 * This event is triggered when a block is moved from one location to another within the editor.
 *
 */
export interface BlockMovedEventArgs {
    /**
     * Specifies the block models that was moved.
     *
     * @default null
     */
    blocks: BlockModel[];

    /**
     * Specifies the ID of the parent block where the block was moved to.
     *
     * @default ''
     */
    parentID: string;

    /**
     * Specifies the ID of the parent blocks from which the block was moved.
     *
     * @default ''
     */
    previousParentID: string[];

    /**
     * Specifies the new index of the block after it was moved.
     *
     * @default -1
     */
    index: number;

    /**
     * Specifies the previous index of the blocks before it was moved.
     *
     * @default -1
     */
    previousIndex: number[];

    /**
     * Indicates whether the user directly interacted with the block (e.g., moving it manually).
     * If `false`, the block was moved programmatically.
     *
     * @default false
     */
    isInteracted: boolean;
}

/*
 * This event is triggered when a block is dragged, before it is dropped in the block editor.
 *
 */
export interface BlockDragEventArgs {
    /**
     * Specifies the block models that is being dragged.
     *
     * @default null
     */
    blocks: BlockModel[];

    /**
     * Specifies the index of the blocks from which the drag started.
     *
     * @default -1
     */
    fromIndex: number[];

    /**
     * Specifies the index where the block is intended to be dropped.
     *
     * @default -1
     */
    dropIndex: number;

    /**
     * Specifies the native event (e.g., mouse or drag event) that triggered the block drag action.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies the target HTML element where the block is being dragged from.
     *
     * @default null
     */
    target: HTMLElement;

    /**
     * Specifies whether the drag action should be canceled.
     *
     * @default false
     */
    cancel: boolean;
}

/*
 * This event is triggered when a block is dropped onto another block or area in the block editor.
 *
 */
export interface BlockDropEventArgs {
    /**
     * Specifies the block models that was dropped.
     *
     * @default null
     */
    blocks: BlockModel[];

    /**
     * Specifies the index of the blocks from where it was dragged before the drop.
     *
     * @default -1
     */
    fromIndex: number[];

    /**
     * Specifies the index of the block where the drop occurred.
     *
     * @default -1
     */
    dropIndex: number;

    /**
     * Specifies the native event (e.g., mouse or drag event) that triggered the block drop action.
     *
     * @default null
     */
    event: Event;

    /**
     * Specifies the target HTML element where the block was dropped.
     *
     * @default null
     */
    target: HTMLElement;
}

/**
 * This event is triggered when a block or the block editor gains focus.
 *
 */
export interface FocusEventArgs {
    /**
     * The native event (e.g., mouse, keyboard) that triggered the focus action.
     *
     * @default null
     */
    event: Event;

    /**
     * The unique identifier of the block that currently has focus.
     *
     * @default ''
     */
    blockId: string;

    /**
     * The range of the selection within the block. The first value is the starting index, and the second value is the ending index.
     *
     * @default [0, 0]
     */
    selectionRange: [number, number];
}


/**
 * This event is triggered when the block editor loses focus.
 *
 */
export interface BlurEventArgs {
    /**
     * The native event (e.g., mouse, keyboard) that triggered the blur action.
     *
     * @default null
     */
    event: Event;

    /**
     * The unique identifier of the block that currently had focus or selection when the blur event occurs.
     *
     * @default ''
     */
    blockId: string;
}

/**
 * Represents the event arguments for a key action execution event.
 *
 */
export interface KeyActionExecutedEventArgs {
    /**
     * Specifies the key combination that triggered the action (e.g., 'Ctrl+Alt+1').
     *
     * @default ''
     */
    keyCombination: string;

    /**
     * Specifies the action that was executed based on the key combination.
     *
     * @default ''
     */
    action: string;
}

/**
 * Represents the event arguments for paste event.
 *
 */
export interface BeforePasteEventArgs {
    /**
     * Specifies whether the paste action should be canceled.
     *
     * @default false
     */
    cancel: boolean;

    /**
     * Contains the content being pasted.
     *
     * @default ''
     */
    content: string;
}

/**
 * Represents the event arguments for paste event.
 *
 */
export interface AfterPasteEventArgs {
    /**
     * Contains the content that was pasted.
     *
     * @default ''
     */
    content: string;
}
