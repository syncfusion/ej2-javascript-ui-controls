import { Component, getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property, isNullOrUndefined as isNOU, formatUnit, Collection, EmitType, Complex, remove, Event, append, L10n, addClass } from '@syncfusion/ej2-base';import { BlockModel, UserModel, CommandMenuSettingsModel, InlineToolbarSettingsModel, PasteSettingsModel, BlockActionMenuSettingsModel, ContextMenuSettingsModel, LabelSettingsModel, BasePlaceholderProp, HeadingProps } from '../models/index';import { Block } from '../models/block/block';import { User } from '../models/common/user';import { CommandMenuSettings } from '../models/menus/command-menu-settings';import { InlineToolbarSettings } from '../models/menus/inline-toolbar-settings';import { ContextMenuSettings } from '../models/menus/context-menu-settings';import { BlockActionMenuSettings } from '../models/menus/blockaction-menu-settings';import { PasteSettings } from '../models/common/paste-settings';import { LabelSettings } from '../models/common/label-settings';import { FocusEventArgs, BlurEventArgs, BlockAddedEventArgs, BlockRemovedEventArgs, BlockMovedEventArgs, ContentChangedEventArgs, SelectionChangedEventArgs, UndoRedoEventArgs, BlockDragEventArgs, BlockDropEventArgs, KeyActionExecutedEventArgs, BeforePasteEventArgs, AfterPasteEventArgs } from './eventargs';import { getBlockContentElement, getBlockModelById } from '../utils/block';import { IUndoRedoSelectionState } from './interface';import { getTemplateFunction } from '../utils/common';import { BlockType, BuiltInToolbar } from './enums';import { clearBreakTags, isElementEmpty } from '../utils/dom';import { decode, encode, sanitizeHelper } from '../utils/security';import { events } from './constant';import * as constants from './constant';import { PopupRenderer, MentionRenderer, MenuBarRenderer, TooltipRenderer } from '../renderer/index';import { BlockRendererManager, BlockCommandManager, StateManager, FloatingIconManager, EventManager } from '../managers/index';import { FormattingAction, ListBlockAction, DragAndDropAction, BlockEditorMethods, UndoRedoAction, ClipboardAction } from '../actions/index';import { InlineContentInsertionModule, NodeSelection, SlashCommandModule, ContextMenuModule, BlockActionMenuModule, InlineToolbarModule, LinkModule } from '../plugins/index';import { BlockService } from '../services/index';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class BlockEditor
 */
export interface BlockEditorModel extends ComponentModel{

    /**
     * Specifies the height of the editor.
     * This property sets the height of the editor, which can be a string or number.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Specifies the width of the editor.
     * This property sets the width of the editor, which can be a string or number.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Specifies a custom CSS class to apply to the editor.
     * This property allows for additional styling by applying a custom CSS class.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the locale for localization.
     * This property sets the language and regional settings for the editor.
     *
     * @default ''
     */
    locale?: string;

    /**
     * Specifies custom keyboard shortcuts configuration.
     * This property allows the definition of custom keyboard shortcuts for editor commands.
     *
     * @default null
     */
    keyConfig?: { [key: string]: string };

    /**
     * Specifies the maximum size of the undo/redo stack.
     * This property determines how many actions are stored for undo and redo functionality.
     * With a default value of 30, it allows users to revert up to 30 operations.
     *
     * @default 30
     */
    undoRedoStack?: number;

    /**
     * Specifies whether the editor is in read-only mode.
     * This property prevents users from editing the content when set to true.
     *
     * @default false
     */
    readOnly?: boolean;

    /**
     * Specifies whether HTML encoding is enabled.
     * This property determines if the content will be encoded to escape special HTML characters.
     *
     * @default false
     */
    enableHtmlEncode?: boolean;

    /**
     * Specifies whether the HTML sanitizer is enabled.
     * This property determines if the HTML content will be sanitized to remove potentially harmful tags and attributes.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies whether drag and drop functionality is enabled for the blocks.
     * This property enables or disables drag-and-drop operations within the block editor.
     *
     * @default true
     */
    enableDragAndDrop?: boolean;

    /**
     * Specifies whether URLs should automatically have "https://" added if the user does not include it.
     * If disabled,  URLs will be entered as-is, without any protocol prepends.
     * This can be useful for internal links or specific use cases where the protocol is not required.
     *
     * @default true
     */
    enableAutoHttps?: boolean;

    /**
     * Specifies an array of block models representing the content of the editor.
     * This property holds the various blocks that make up the editor's content.
     *
     * @default []
     */
    blocks?: BlockModel[];

    /**
     * Specifies an array of user models representing the list of users.
     * This property holds user details such as name, ID, and other properties.
     *
     * @default []
     */
    users?: UserModel[];

    /**
     * Specifies configuration options for editor commands.
     * This property allows customization of command behaviors within the editor.
     *
     * @default {}
     */
    commandMenu?: CommandMenuSettingsModel;

    /**
     * Specifies settings for the formatting toolbar.
     * This property configures the toolbar that provides text formatting options.
     *
     * @default {}
     */
    inlineToolbar?: InlineToolbarSettingsModel;

    /**
     * Specifies the configuration settings for the block actions menu.
     * This property allows customization of the actions menu within the editor.
     *
     * @default {}
     */
    blockActionsMenu?: BlockActionMenuSettingsModel;

    /**
     * Specifies settings for the context menu.
     * This property configures the context menu options that appear on right-click actions.
     *
     * @default {}
     */
    contextMenu?: ContextMenuSettingsModel;

    /**
     * Configures settings related to pasting content in the editor.
     * This property utilizes the PasteSettingsModel to specify various options and behaviors for paste operations.
     *
     * @default {}
     */
    pasteSettings?: PasteSettingsModel;

    /**
     * Configures settings related to label popup in the editor.
     * This property utilizes the LabelSettingsModel to specify various options and behaviors for paste operations.
     *
     * @default {}
     */
    labelSettings?: LabelSettingsModel;

    /**
     * Event triggered after the Blockeditor is rendered completely.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Event triggered when the content of the block editor is changed.
     * This event provides details about the changes made to the content.
     *
     * @event contentChanged
     */
    contentChanged?: EmitType<ContentChangedEventArgs>;

    /**
     * Event triggered when the selection in the block editor changes.
     * This event provides details about the new selection state.
     *
     * @event selectionChanged
     */
    selectionChanged?: EmitType<SelectionChangedEventArgs>;

    /**
     * Event triggered when an undo or redo operation is performed in the block editor.
     * This event provides details about the undo/redo action that was executed.
     *
     * @event undoRedoPerformed
     */
    undoRedoPerformed?: EmitType<UndoRedoEventArgs>;

    /**
     * Event triggered when a block is added to the block editor.
     * This event provides details about the newly added block.
     *
     * @event blockAdded
     */
    blockAdded?: EmitType<BlockAddedEventArgs>;

    /**
     * Event triggered when a block is removed from the block editor.
     * This event provides details about the block being removed.
     *
     * @event blockRemoved
     */
    blockRemoved?: EmitType<BlockRemovedEventArgs>;

    /**
     * Event triggered when a block is moved within the block editor.
     * This event provides details about the moved block.
     *
     * @event blockMoved
     */
    blockMoved?: EmitType<BlockMovedEventArgs>;

    /**
     * Event triggered during the dragging operation of a block.
     * This event provides details about the drag operation.
     *
     * @event blockDrag
     */
    blockDrag?: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when the drag operation for a block starts.
     * This event provides details about the initial stage of the drag.
     *
     * @event blockDragStart
     */
    blockDragStart?: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when a block is dropped after a drag operation.
     * This event provides details about the block drop action.
     *
     * @event blockDrop
     */
    blockDrop?: EmitType<BlockDropEventArgs>;

    /**
     * Event triggered when the block editor gains focus.
     * This event provides details about the focus action.
     *
     * @event focus
     */
    focus?: EmitType<FocusEventArgs>;

    /**
     * Event triggered when the block editor loses focus.
     * This event provides details about the blur action.
     *
     * @event blur
     */
    blur?: EmitType<BlurEventArgs>;

    /**
     * Event triggered when a key action (both built-in and custom) is executed in the block editor component.
     * This event provides detailed information about the executed key action, including the key combination,
     * the action performed, whether the action was triggered by a custom key configuration, and the platform.
     *
     * @event keyActionExecuted
     */
    keyActionExecuted?: EmitType<KeyActionExecutedEventArgs>;

    /**
     * Event triggered before a paste operation occurs in the block editor.
     * This event allows interception or modification of the pasted content.
     *
     * @event beforePaste
     */
    beforePaste?: EmitType<BeforePasteEventArgs>;

    /**
     * Event triggered after a paste operation occurs in the block editor.
     * This event provides details about the pasted content.
     *
     * @event afterPaste
     */
    afterPaste?: EmitType<AfterPasteEventArgs>;

}