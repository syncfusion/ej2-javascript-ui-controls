import { Component, getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property, isNullOrUndefined as isNOU, formatUnit, Collection, EmitType, Complex, Event, append, L10n, addClass, updateCSSText } from '@syncfusion/ej2-base';import { UserModel, CommandMenuSettingsModel, InlineToolbarSettingsModel, PasteCleanupSettingsModel, BlockActionMenuSettingsModel, ContextMenuSettingsModel, LabelSettingsModel, ImageBlockSettingsModel, CodeBlockSettingsModel } from '../../models/index';import { BlockModel } from '../../models/block/block-model';import { User } from '../../models/common/user';import { CommandMenuSettings } from '../../models/menus/command-menu-settings';import { InlineToolbarSettings } from '../../models/menus/inline-toolbar-settings';import { ContextMenuSettings } from '../../models/menus/context-menu-settings';import { BlockActionMenuSettings } from '../../models/menus/blockaction-menu-settings';import { PasteCleanupSettings } from '../../models/common/paste-settings';import { LabelSettings } from '../../models/common/label-settings';import { FocusEventArgs, BlurEventArgs, SelectionChangedEventArgs, BlockDragEventArgs, BlockDropEventArgs, BeforePasteCleanupEventArgs, AfterPasteCleanupEventArgs, BlockChangedEventArgs } from '../../models/eventargs';import { getBlockModelById } from '../../common/utils/block';import { getTemplateFunction } from '../../common/utils/common';import { getCurrentLocaleJson, getLocaleItems } from '../../common/utils/data';import { CommandName } from '../../models/enums';import { events } from '../../common/constant';import * as constants from '../../common/constant';import { MentionRenderer, MenuBarRenderer, TooltipRenderer, DialogRenderer, FloatingIconRenderer, DropDownListRenderer } from '../renderer/index';import { EventManager, Intermediate } from '../managers/index';import { InlineContentInsertionModule, SlashCommandModule, ContextMenuModule, BlockActionMenuModule, InlineToolbarModule, LinkModule } from '../renderer/index';import { BlockManager } from '../../block-manager/base/block-manager';import { ImageBlockSettings, CodeBlockSettings } from '../../models/common/index';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class BlockEditor
 */
export interface BlockEditorModel extends ComponentModel{

    /**
     * Specifies the height of the editor.
     * This property sets the height of the editor, which can be a string or number.
     *
     * @default 'auto'
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
     * The default locale value is 'en-US'.
     *
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Specifies custom keyboard shortcuts configuration.
     * This property allows the definition of custom keyboard shortcuts for editor commands.
     *
     * {% codeBlock src='blockeditor/keyconfig/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    keyConfig?: { [key: string]: string };

    /**
     * Specifies the maximum size of the undo/redo stack.
     * This property determines how many actions are stored for undo and redo functionality.
     * With a default value of 30, it allows users to revert up to 30 operations.
     *
     * {% codeBlock src='blockeditor/undo-redo-stack/index.md' %}{% endcodeBlock %}
     *
     * @default 30
     */
    undoRedoStack?: number;

    /**
     * Specifies whether the editor is in read-only mode.
     * This property prevents users from editing the content when set to true.
     *
     * {% codeBlock src='blockeditor/readonly/index.md' %}{% endcodeBlock %}
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
     * {% codeBlock src='blockeditor/enable-htmlsanitizer/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies whether drag and drop functionality is enabled for the blocks.
     * This property enables or disables drag-and-drop operations within the block editor.
     *
     * {% codeBlock src='blockeditor/enable-drag-drop/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableDragAndDrop?: boolean;

    /**
     * Specifies an array of block models representing the content of the editor.
     * This property holds the various blocks that make up the editor's content.
     *
     * {% codeBlock src='blockeditor/blocks/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    blocks?: BlockModel[];

    /**
     * Specifies an array of user models representing the list of users.
     * This property holds user details such as name, ID, and other properties.
     *
     * {% codeBlock src='blockeditor/users/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    users?: UserModel[];

    /**
     * Specifies configuration options for editor commands.
     * This property allows customization of command behaviors within the editor.
     *
     * {% codeBlock src='blockeditor/command-menu/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    commandMenuSettings?: CommandMenuSettingsModel;

    /**
     * Specifies settings for the formatting toolbar.
     * This property configures the toolbar that provides text formatting options.
     *
     * {% codeBlock src='blockeditor/inline-toolbar/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    inlineToolbarSettings?: InlineToolbarSettingsModel;

    /**
     * Specifies the configuration settings for the block actions menu.
     * This property allows customization of the actions menu within the editor.
     *
     * {% codeBlock src='blockeditor/block-action-menu/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    blockActionMenuSettings?: BlockActionMenuSettingsModel;

    /**
     * Specifies settings for the context menu.
     * This property configures the context menu options that appear on right-click actions.
     *
     * {% codeBlock src='blockeditor/context-menu/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Configures settings related to pasting content in the editor.
     * This property utilizes the PasteCleanupSettingsModel to specify various options and behaviors for paste operations.
     *
     * {% codeBlock src='blockeditor/paste-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    pasteCleanupSettings?: PasteCleanupSettingsModel;

    /**
     * Configures settings related to label popup in the editor.
     * This property utilizes the LabelSettingsModel to specify various options and behaviors for paste operations.
     *
     * {% codeBlock src='blockeditor/label-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    labelSettings?: LabelSettingsModel;

    /**
     * Configures settings related to image block in the editor.
     * This property utilizes the ImageBlockSettingsModel to specify various options for image block settings.
     *
     * {% codeBlock src='blockeditor/image-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    imageBlockSettings?: ImageBlockSettingsModel;

    /**
     * Configures settings related to code block in the editor.
     * This property utilizes the CodeBlockSettingsModel to specify various options for code block settings.
     *
     * {% codeBlock src='blockeditor/code-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    codeBlockSettings?: CodeBlockSettingsModel;

    /**
     * Event triggered after the Blockeditor is rendered completely.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Event triggered when the editor blocks are changed.
     * This event provides details about the changes made to the editor blocks.
     *
     * {% codeBlock src='blockeditor/block-change/index.md' %}{% endcodeBlock %}
     *
     * @event blockChanged
     */
    blockChanged?: EmitType<BlockChangedEventArgs>;

    /**
     * Event triggered when the selection in the block editor changes.
     * This event provides details about the new selection state.
     *
     * {% codeBlock src='blockeditor/selection-changed/index.md' %}{% endcodeBlock %}
     *
     * @event selectionChanged
     */
    selectionChanged?: EmitType<SelectionChangedEventArgs>;

    /**
     * Event triggered during the dragging operation of a block.
     * This event provides details about the drag operation.
     *
     * {% codeBlock src='blockeditor/block-dragging/index.md' %}{% endcodeBlock %}
     *
     * @event blockDragging
     */
    blockDragging?: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when the drag operation for a block starts.
     * This event provides details about the initial stage of the drag.
     *
     * {% codeBlock src='blockeditor/block-drag-start/index.md' %}{% endcodeBlock %}
     *
     * @event blockDragStart
     */
    blockDragStart?: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when a block is dropped after a drag operation.
     * This event provides details about the block drop action.
     *
     * {% codeBlock src='blockeditor/block-dropped/index.md' %}{% endcodeBlock %}
     *
     * @event blockDropped
     */
    blockDropped?: EmitType<BlockDropEventArgs>;

    /**
     * Event triggered when the block editor gains focus.
     * This event provides details about the focus action.
     *
     * {% codeBlock src='blockeditor/focus/index.md' %}{% endcodeBlock %}
     *
     * @event focus
     */
    focus?: EmitType<FocusEventArgs>;

    /**
     * Event triggered when the block editor loses focus.
     * This event provides details about the blur action.
     *
     * {% codeBlock src='blockeditor/blur/index.md' %}{% endcodeBlock %}
     *
     * @event blur
     */
    blur?: EmitType<BlurEventArgs>;

    /**
     * Event triggered before a paste operation occurs in the block editor.
     * This event allows interception or modification of the pasted content.
     *
     * {% codeBlock src='blockeditor/before-paste/index.md' %}{% endcodeBlock %}
     *
     * @event beforePasteCleanup
     */
    beforePasteCleanup?: EmitType<BeforePasteCleanupEventArgs>;

    /**
     * Event triggered after a paste operation occurs in the block editor.
     * This event provides details about the pasted content.
     *
     * {% codeBlock src='blockeditor/after-paste/index.md' %}{% endcodeBlock %}
     *
     * @event afterPasteCleanup
     */
    afterPasteCleanup?: EmitType<AfterPasteCleanupEventArgs>;

}