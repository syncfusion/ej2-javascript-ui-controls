import { CommandItemModel, BlockModel, BlockActionItemModel, ContextMenuItemModel } from './index';
import { IToolbarItemModel } from './interface';
import { BlockAction } from './types';


export interface BlockChangedEventArgs {
    /**
     * Array of block change operations performed in the editor.
     */
    changes: BlockChange[];
}

export interface BlockChange {
    /**
     * The type of action performed on the block.
     */
    action: BlockAction;
    /**
     * Data associated with the block change.
     */
    data: BlockData;
}

export interface BlockData {
    /**
     * The current block model after the change.
     */
    block: BlockModel;

    /**
     * The previous block model before the change, if applicable.
     */
    prevBlock?: BlockModel;

    /**
     * The current parent block, if the block is nested.
     */
    currentParent?: BlockModel;

    /**
     * The previous parent block, if the block's parent changed.
     */
    prevParent?: BlockModel;
}

/**
 * This event is triggered when a query is typed in the command menu and filtering of commands occurs.
 *
 */
export interface CommandFilteringEventArgs {
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
export interface CommandItemSelectEventArgs {
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
 * This event is triggered when a toolbar item is clicked.
 *
 */
export interface ToolbarItemClickEventArgs {
    /**
     * Specifies the toolbar item that was clicked.
     *
     * @default null
     */
    item: IToolbarItemModel;

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
export interface BlockActionMenuOpeningEventArgs {
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
export interface BlockActionMenuClosingEventArgs {
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
export interface BlockActionItemSelectEventArgs {
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
export interface ContextMenuOpeningEventArgs {
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
export type ContextMenuClosingEventArgs = ContextMenuOpeningEventArgs;

/**
 * Provides information about the event when a context menu item is being clicked.
 */
export interface ContextMenuItemSelectEventArgs {
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
    event?: Event;

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
    event?: Event;

    /**
     * The unique identifier of the block that currently had focus or selection when the blur event occurs.
     *
     * @default ''
     */
    blockId: string;
}

/**
 * Represents the event arguments for paste event.
 *
 */
export interface BeforePasteCleanupEventArgs {
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
export interface AfterPasteCleanupEventArgs {
    /**
     * Contains the content that was pasted.
     *
     * @default ''
     */
    content: string;
}
