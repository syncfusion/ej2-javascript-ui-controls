import { Component, getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property, isNullOrUndefined as isNOU, formatUnit, Collection, EmitType, Complex, Event, append, L10n, addClass, updateCSSText } from '@syncfusion/ej2-base';
import { UserModel, CommandMenuSettingsModel, InlineToolbarSettingsModel, PasteCleanupSettingsModel, BlockActionMenuSettingsModel, ContextMenuSettingsModel, LabelSettingsModel, ImageBlockSettingsModel, CodeBlockSettingsModel } from '../../models/index';
import { BlockEditorModel } from './blockeditor-model';
import { BlockModel } from '../../models/block/block-model';
import { User } from '../../models/common/user';
import { CommandMenuSettings } from '../../models/menus/command-menu-settings';
import { InlineToolbarSettings } from '../../models/menus/inline-toolbar-settings';
import { ContextMenuSettings } from '../../models/menus/context-menu-settings';
import { BlockActionMenuSettings } from '../../models/menus/blockaction-menu-settings';
import { PasteCleanupSettings } from '../../models/common/paste-settings';
import { LabelSettings } from '../../models/common/label-settings';
import { FocusEventArgs, BlurEventArgs, SelectionChangedEventArgs, BlockDragEventArgs, BlockDropEventArgs, BeforePasteCleanupEventArgs, AfterPasteCleanupEventArgs, BlockChangedEventArgs } from '../../models/eventargs';
import { getBlockModelById } from '../../common/utils/block';
import { getTemplateFunction } from '../../common/utils/common';
import { getCurrentLocaleJson, getLocaleItems } from '../../common/utils/data';
import { CommandName } from '../../models/enums';
import { events } from '../../common/constant';
import * as constants from '../../common/constant';

import { MentionRenderer, MenuBarRenderer, TooltipRenderer, DialogRenderer, FloatingIconRenderer, DropDownListRenderer } from '../renderer/index';
import { EventManager, Intermediate } from '../managers/index';
import { InlineContentInsertionModule, SlashCommandModule, ContextMenuModule, BlockActionMenuModule, InlineToolbarModule, LinkModule } from '../renderer/index';
import { BlockManager } from '../../block-manager/base/block-manager';
import { ImageBlockSettings, CodeBlockSettings } from '../../models/common/index';

/**
 * Represents the root class for the Block Editor component.
 * The BlockEditor is a block based editor that provides functionality for creating, editing, and managing blocks of content.
 * Blocks can include paragraph, lists, toggles, and other block types, organized hierarchically.
 *
 **/
@NotifyPropertyChanges
export class BlockEditor extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Specifies the height of the editor.
     * This property sets the height of the editor, which can be a string or number.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Specifies the width of the editor.
     * This property sets the width of the editor, which can be a string or number.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies a custom CSS class to apply to the editor.
     * This property allows for additional styling by applying a custom CSS class.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the locale for localization.
     * This property sets the language and regional settings for the editor.
     * The default locale value is 'en-US'.
     *
     * @default 'en-US'
     */
    @Property('en-US')
    public locale: string;

    /**
     * Specifies custom keyboard shortcuts configuration.
     * This property allows the definition of custom keyboard shortcuts for editor commands.
     *
     * {% codeBlock src='blockeditor/keyconfig/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public keyConfig: { [key: string]: string };

    /**
     * Specifies the maximum size of the undo/redo stack.
     * This property determines how many actions are stored for undo and redo functionality.
     * With a default value of 30, it allows users to revert up to 30 operations.
     *
     * {% codeBlock src='blockeditor/undo-redo-stack/index.md' %}{% endcodeBlock %}
     *
     * @default 30
     */
    @Property(30)
    public undoRedoStack: number;

    /**
     * Specifies whether the editor is in read-only mode.
     * This property prevents users from editing the content when set to true.
     *
     * {% codeBlock src='blockeditor/readonly/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;

    /**
     * Specifies whether HTML encoding is enabled.
     * This property determines if the content will be encoded to escape special HTML characters.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlEncode: boolean;

    /**
     * Specifies whether the HTML sanitizer is enabled.
     * This property determines if the HTML content will be sanitized to remove potentially harmful tags and attributes.
     *
     * {% codeBlock src='blockeditor/enable-htmlsanitizer/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Specifies whether drag and drop functionality is enabled for the blocks.
     * This property enables or disables drag-and-drop operations within the block editor.
     *
     * {% codeBlock src='blockeditor/enable-drag-drop/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableDragAndDrop: boolean;

    /**
     * Specifies an array of block models representing the content of the editor.
     * This property holds the various blocks that make up the editor's content.
     *
     * {% codeBlock src='blockeditor/blocks/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public blocks: BlockModel[];

    /**
     * Specifies an array of user models representing the list of users.
     * This property holds user details such as name, ID, and other properties.
     *
     * {% codeBlock src='blockeditor/users/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<UserModel>([], User)
    public users: UserModel[];

    /**
     * Specifies configuration options for editor commands.
     * This property allows customization of command behaviors within the editor.
     *
     * {% codeBlock src='blockeditor/command-menu/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<CommandMenuSettingsModel>({}, CommandMenuSettings)
    public commandMenuSettings: CommandMenuSettingsModel;

    /**
     * Specifies settings for the formatting toolbar.
     * This property configures the toolbar that provides text formatting options.
     *
     * {% codeBlock src='blockeditor/inline-toolbar/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<InlineToolbarSettingsModel>({}, InlineToolbarSettings)
    public inlineToolbarSettings: InlineToolbarSettingsModel;

    /**
     * Specifies the configuration settings for the block actions menu.
     * This property allows customization of the actions menu within the editor.
     *
     * {% codeBlock src='blockeditor/block-action-menu/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<BlockActionMenuSettingsModel>({}, BlockActionMenuSettings)
    public blockActionMenuSettings: BlockActionMenuSettingsModel;

    /**
     * Specifies settings for the context menu.
     * This property configures the context menu options that appear on right-click actions.
     *
     * {% codeBlock src='blockeditor/context-menu/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<ContextMenuSettingsModel>({}, ContextMenuSettings)
    public contextMenuSettings: ContextMenuSettingsModel;

    /**
     * Configures settings related to pasting content in the editor.
     * This property utilizes the PasteCleanupSettingsModel to specify various options and behaviors for paste operations.
     *
     * {% codeBlock src='blockeditor/paste-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<PasteCleanupSettingsModel>({}, PasteCleanupSettings)
    public pasteCleanupSettings: PasteCleanupSettingsModel;

    /**
     * Configures settings related to label popup in the editor.
     * This property utilizes the LabelSettingsModel to specify various options and behaviors for paste operations.
     *
     * {% codeBlock src='blockeditor/label-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<LabelSettingsModel>({ items: [], triggerChar: '$'}, LabelSettings)
    public labelSettings: LabelSettingsModel;

    /**
     * Configures settings related to image block in the editor.
     * This property utilizes the ImageBlockSettingsModel to specify various options for image block settings.
     *
     * {% codeBlock src='blockeditor/image-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<ImageBlockSettingsModel>({}, ImageBlockSettings)
    public imageBlockSettings: ImageBlockSettingsModel;

    /**
     * Configures settings related to code block in the editor.
     * This property utilizes the CodeBlockSettingsModel to specify various options for code block settings.
     *
     * {% codeBlock src='blockeditor/code-settings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<CodeBlockSettingsModel>({ languages: [], defaultLanguage: 'plaintext' }, CodeBlockSettings)
    public codeBlockSettings: CodeBlockSettingsModel;

    /* Events */

    /**
     * Event triggered after the Blockeditor is rendered completely.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Event triggered when the editor blocks are changed.
     * This event provides details about the changes made to the editor blocks.
     *
     * {% codeBlock src='blockeditor/block-change/index.md' %}{% endcodeBlock %}
     *
     * @event blockChanged
     */
    @Event()
    public blockChanged: EmitType<BlockChangedEventArgs>;

    /**
     * Event triggered when the selection in the block editor changes.
     * This event provides details about the new selection state.
     *
     * {% codeBlock src='blockeditor/selection-changed/index.md' %}{% endcodeBlock %}
     *
     * @event selectionChanged
     */
    @Event()
    public selectionChanged: EmitType<SelectionChangedEventArgs>;

    /**
     * Event triggered during the dragging operation of a block.
     * This event provides details about the drag operation.
     *
     * {% codeBlock src='blockeditor/block-dragging/index.md' %}{% endcodeBlock %}
     *
     * @event blockDragging
     */
    @Event()
    public blockDragging: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when the drag operation for a block starts.
     * This event provides details about the initial stage of the drag.
     *
     * {% codeBlock src='blockeditor/block-drag-start/index.md' %}{% endcodeBlock %}
     *
     * @event blockDragStart
     */
    @Event()
    public blockDragStart: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when a block is dropped after a drag operation.
     * This event provides details about the block drop action.
     *
     * {% codeBlock src='blockeditor/block-dropped/index.md' %}{% endcodeBlock %}
     *
     * @event blockDropped
     */
    @Event()
    public blockDropped: EmitType<BlockDropEventArgs>;

    /**
     * Event triggered when the block editor gains focus.
     * This event provides details about the focus action.
     *
     * {% codeBlock src='blockeditor/focus/index.md' %}{% endcodeBlock %}
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;

    /**
     * Event triggered when the block editor loses focus.
     * This event provides details about the blur action.
     *
     * {% codeBlock src='blockeditor/blur/index.md' %}{% endcodeBlock %}
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;

    /**
     * Event triggered before a paste operation occurs in the block editor.
     * This event allows interception or modification of the pasted content.
     *
     * {% codeBlock src='blockeditor/before-paste/index.md' %}{% endcodeBlock %}
     *
     * @event beforePasteCleanup
     */
    @Event()
    public beforePasteCleanup: EmitType<BeforePasteCleanupEventArgs>;

    /**
     * Event triggered after a paste operation occurs in the block editor.
     * This event provides details about the pasted content.
     *
     * {% codeBlock src='blockeditor/after-paste/index.md' %}{% endcodeBlock %}
     *
     * @event afterPasteCleanup
     */
    @Event()
    public afterPasteCleanup: EmitType<AfterPasteCleanupEventArgs>;


    /* Renderers */
    /** @hidden */
    public mentionRenderer: MentionRenderer;
    /** @hidden */
    public tooltipRenderer: TooltipRenderer;
    /** @hidden */
    public menubarRenderer: MenuBarRenderer;
    /** @hidden */
    public dialogRenderer: DialogRenderer;
    /** @hidden */
    public dropdownListRenderer: DropDownListRenderer;

    /* Manager instances */
    /** @hidden */
    public floatingIconRenderer: FloatingIconRenderer;

    /** @hidden */
    public eventManager: EventManager;

    public blockManager: BlockManager;
    public intermediate: Intermediate;

    /* Plugins */
    /** @hidden */
    public inlineContentInsertionModule: InlineContentInsertionModule;
    /** @hidden */
    public slashCommandModule: SlashCommandModule;
    /** @hidden */
    public inlineToolbarModule: InlineToolbarModule;
    /** @hidden */
    public contextMenuModule: ContextMenuModule;
    /** @hidden */
    public blockActionMenuModule: BlockActionMenuModule;
    /** @hidden */
    public linkModule: LinkModule;

    /* Variables */

    /** @hidden */
    public blockContainer: HTMLElement;

    /** @hidden */
    public keyCommandMap: Map<string, string>;
    /** @hidden */
    public l10n: L10n;
    /** @hidden */
    public isProtectedOnChange: boolean;
    private localeJson: Record<string, string>;

    /**
     * Constructor for creating the component
     *
     * @param {BlockEditorModel} options - Specifies the BlockEditorModel model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: BlockEditorModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        if (!this.element.id) { this.element.id = getUniqueID('e-' + this.getModuleName()); }
    }

    protected getDirective(): string {
        return 'EJS-BLOCKEDITOR';
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'blockeditor';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['blocks']);
    }

    /**
     * Renders the editor component
     *
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
    }

    /**
     * Initializes the editor component
     *
     * @returns {void}
     */
    private initialize(): void {
        this.initializeLocale();
        this.initializeManagers();
        this.intializeEngines();

        // Set dimensions and styles
        this.setDimension();
        this.setCssClass();
        this.setRtlClass();

        this.blockManager.stateManager.populateUniqueIds(this.blockManager.getEditorBlocks());

        // Create floating icons and overlay containers
        if (!this.floatingIconRenderer.floatingIconContainer) {
            this.floatingIconRenderer.createFloatingIcons();
        }

        // Render the blocks
        this.initializeMentionModules();
        this.renderBlocks(this.blockManager.getEditorBlocks());
        this.updateEditorReadyOnlyState();

        // Wire events
        if (this.enableDragAndDrop) {
            this.intermediate.processActions('wireUnWireDragEvents', { enable: true });
        }
        this.eventManager.wireGlobalEvents();
    }

    /**
     * Initializes locale values
     *
     * @returns {void}
     */
    private initializeLocale(): void {
        this.l10n = new L10n(this.getModuleName(), getLocaleItems(), this.locale);
        this.updateInternalLocaleCollection();
    }

    private updateInternalLocaleCollection(): void {
        this.localeJson = getCurrentLocaleJson(this.l10n);
    }

    /**
     * Initializes all manager classes
     *
     * @returns {void}
     */
    private initializeManagers(): void {
        this.blockManager = new BlockManager();
        this.intermediate = new Intermediate(this);
        this.renderblockContainer();
        this.blockManager.updateContext({
            localeJson: this.localeJson,
            blocks: this.blocks,
            blockContainer: this.blockContainer,
            rootEditorElement: this.element,
            pasteCleanupSettings: this.pasteCleanupSettings,
            imageBlockSettings: this.imageBlockSettings,
            codeBlockSettings: this.codeBlockSettings,
            labelSettings: this.labelSettings,
            users: this.users,

            blockActionMenuSettings: this.blockActionMenuSettings,
            contextMenuSettings: this.contextMenuSettings,
            commandMenuSettings: this.commandMenuSettings,
            inlineToolbarSettings: this.inlineToolbarSettings,

            ...this.getEditorProps()
        });
        this.blockManager.initialize();

        this.floatingIconRenderer = new FloatingIconRenderer(this);
        this.eventManager = new EventManager(this);
    }

    private getEditorProps(): Partial<BlockEditorModel> {
        return {
            readOnly: this.readOnly,
            undoRedoStack: this.undoRedoStack,
            enableHtmlEncode: this.enableHtmlEncode,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            enableDragAndDrop: this.enableDragAndDrop,
            keyConfig: this.keyConfig
        };
    }

    /**
     * Initializes all engines
     *
     * @returns {void}
     */
    private intializeEngines(): void {
        this.menubarRenderer = new MenuBarRenderer(this);
        this.mentionRenderer = new MentionRenderer(this);
        this.tooltipRenderer = new TooltipRenderer(this);
        this.dialogRenderer = new DialogRenderer(this);
        this.dropdownListRenderer = new DropDownListRenderer(this);

        this.inlineContentInsertionModule = new InlineContentInsertionModule(this);
        this.inlineToolbarModule = new InlineToolbarModule(this);
        this.blockActionMenuModule = new BlockActionMenuModule(this);
        this.contextMenuModule = new ContextMenuModule(this);
        this.linkModule = new LinkModule(this);
    }

    /**
     * Sets the dimensions of the editor
     *
     * @returns {void}
     */
    private setDimension(): void {
        const cssText: string = `
          width: ${!isNOU(this.width) ? formatUnit(this.width) : this.element.style.width};
          height: ${!isNOU(this.height) ? formatUnit(this.height) : this.element.style.height};
         `;
        updateCSSText(this.element, cssText);
    }

    /**
     * Sets the CSS class on the editor
     *
     * @returns {void}
     */
    private setCssClass(): void {
        if (this.cssClass) { addClass([this.element], this.cssClass.trim().split(' ')); }
    }

    /**
     * Sets the Rtl class on the editor
     *
     * @returns {void}
     */
    private setRtlClass(): void {
        this.element.classList.toggle(constants.RTL_CLS, this.enableRtl);
    }

    /**
     * Applies dynamic locale changes
     *
     * @returns {void}
     */
    private updateLocale(): void {
        this.l10n.setLocale(this.locale);
        this.updateInternalLocaleCollection();
        this.blockManager.updateContext({ localeJson: this.localeJson });

        if (this.blockManager.currentFocusedBlock) {
            this.blockManager.togglePlaceholder(this.blockManager.currentFocusedBlock, true);
        }
        this.floatingIconRenderer.updateFloatingIconTooltipContent();
        this.notify(events.localeChanged, {});
        this.blockManager.observer.notify(events.localeChanged, {});
    }

    /**
     * Initializes mention modules for @ mentions and slash commands
     *
     * @returns {void}
     */
    private initializeMentionModules(): void {
        this.slashCommandModule = new SlashCommandModule(this);
        this.inlineContentInsertionModule.initializeUserMention();
        this.inlineContentInsertionModule.initializeLabelContent();
    }

    /**
     * Creates the block container
     *
     * @returns {void}
     */
    private renderblockContainer(): void {
        this.blockContainer = this.createElement('div', {
            id: this.element.id + constants.BLOCK_CONTAINER_ID,
            className: constants.BLOCK_CONTAINER_CLS
        });
        this.element.appendChild(this.blockContainer);
    }

    /**
     * Renders blocks in the editor
     *
     * @param {BlockModel[]} blocks The blocks to render
     * @returns {void}
     * @hidden
     */
    public renderBlocks(blocks: BlockModel[]): void {
        this.blockManager.blockCommand.createDefaultEmptyBlock();
        this.blockManager.blockRenderer.renderBlocks(blocks);
    }

    /**
     * Gets the current focused block model
     *
     * @returns {BlockModel | null} The current focused block model or null if no block is focused
     * @hidden
     */
    public getCurrentFocusedBlockModel(): BlockModel {
        if (!this.blockManager.currentFocusedBlock) { return null; }
        return getBlockModelById(this.blockManager.currentFocusedBlock.id, this.blockManager.getEditorBlocks());
    }

    /**
     * Responsible for rendering the template for a block
     *
     * @param {{ block: BlockModel, templateElement: HTMLElement }} args The options to render template
     * @returns {void}
     * @hidden
     */
    public renderTemplate(args: { block: BlockModel, templateElement: HTMLElement }): void {
        const templateName: string = args.block.id + 'template';
        this.clearTemplate([templateName]);
        const templateFunction: Function = getTemplateFunction(args.block.template);
        append(templateFunction({}, this, templateName, 'template', this.isStringTemplate), args.templateElement);
        this.renderReactTemplates();
    }

    /**
     * Updates read-only state of editable elements in the editor
     *
     * @returns {void}
     * @hidden
     */
    public updateEditorReadyOnlyState(): void {
        const defaultNonEditableElements: string[] = [
            'e-callout-icon', 'e-toggle-icon', 'e-image-container', 'e-checkmark-container', 'e-divider-block',
            'e-code-block-toolbar', 'e-code-block-copy-button', 'e-mention-chip',
            ...this.blockManager.blockRenderer.tableRenderer.nonEditableElements
        ];
        let editableElements: HTMLElement[] = Array.from(this.element.querySelectorAll(
            `[contenteditable='${this.readOnly}']:not([data-table-readonly-processed]`
        ));

        editableElements = editableElements.filter((element: HTMLElement) => {
            return !defaultNonEditableElements.some((className: string) => element.classList.contains(className));
        });

        editableElements.forEach((element: HTMLElement) => {
            element.contentEditable = (!this.readOnly).toString();
        });

        this.element.classList.toggle('e-readonly', this.readOnly);
    }

    /* Section Public methods */

    /**
     * Adds a new block to the editor
     *
     * @param {BlockModel} block - The block model to add
     * @param {string} targetId - The ID of the target block to insert the new block. If not provided, the block will be appended to the end of the editor.
     * @param {boolean} isAfter - Specifies whether to insert the new block after the target block. Default is false.
     * @returns {void}
     */
    public addBlock(block: BlockModel, targetId?: string, isAfter?: boolean): void {
        this.blockManager.editorMethods.addBlock(block, targetId, isAfter);
    }

    /**
     * Removes a block from the editor
     *
     * @param {string} blockId - ID of the block to remove
     * @returns {void}
     */
    public removeBlock(blockId: string): void {
        this.blockManager.editorMethods.removeBlock(blockId);
    }

    /**
     * Gets a block by ID
     *
     * @param {string} blockId - ID of the block to retrieve
     * @returns {BlockModel | null} - The block model or null if not found
     */
    public getBlock(blockId: string): BlockModel | null {
        return this.blockManager.editorMethods.getBlock(blockId);
    }

    /**
     * Moves a block to a new position
     *
     * @param {string} fromBlockId - ID of the block to move
     * @param {string} toBlockId - ID of the target block to move to
     * @returns {void}
     */
    public moveBlock(fromBlockId: string, toBlockId: string): void {
        this.blockManager.editorMethods.moveBlock(fromBlockId, toBlockId);
    }

    /**
     * Updates block properties
     *
     * @param {string} blockId - ID of the block to update
     * @param {Partial<BlockModel>} properties - Properties to update
     * @returns {boolean} True if update was successful
     */
    public updateBlock(blockId: string, properties: Partial<BlockModel>): boolean {
        return this.blockManager.editorMethods.updateBlock(blockId, properties);
    }

    /**
     * Enables one or more toolbar items.
     * This method allows the specified toolbar items to be enabled.
     *
     * @param {string | string[]} itemId - The id(s) of the toolbar item(s) to enable.
     * @returns {void}
     */
    public enableToolbarItems(itemId: string | string[]): void {
        this.blockManager.editorMethods.enableDisableToolbarItems(itemId, true);
    }

    /**
     * Disables one or more toolbar items.
     * This method allows the specified toolbar items to be disabled.
     *
     * @param {string | string[]} itemId - The id(s) of the toolbar item(s) to disable.
     * @returns {void}
     */
    public disableToolbarItems(itemId: string | string[]): void {
        this.blockManager.editorMethods.enableDisableToolbarItems(itemId, false);
    }

    /**
     * Executes the specified toolbar action on the editor.
     *
     * @param {string} action - The action to execute.
     * @param {value} value - The value required if any (Optional).
     * @returns {void}
     */
    public executeToolbarAction(action: CommandName, value?: string): void {
        this.blockManager.editorMethods.executeToolbarAction(action, value);
    }

    /**
     * Sets the selection range within a content.
     * This method selects content within the specified element using a start and end index.
     *
     * @param {string} contentId - The ID of the content element.
     * @param {number} startIndex - The starting index of the selection.
     * @param {number} endIndex - The ending index of the selection.
     * @returns {void}
     */
    public setSelection(contentId: string, startIndex: number, endIndex: number): void {
        this.blockManager.editorMethods.setSelection(contentId, startIndex, endIndex);
    }

    /**
     * Sets cursor position
     *
     * @param {string} blockId - ID of the target block
     * @param {number} position - Character offset position
     * @returns {void}
     */
    public setCursorPosition(blockId: string, position: number): void {
        this.blockManager.editorMethods.setCursorPosition(blockId, position);
    }

    /**
     * Gets the block from current selection
     *
     * @returns {BlockModel | null} - The block model or null if not found
     */
    public getSelectedBlocks(): BlockModel[] | null {
        return this.blockManager.editorMethods.getSelectedBlocks();
    }

    /**
     * Gets current selection range
     *
     * @returns {Range | null} Current selection range or null
     */
    public getRange(): Range | null {
        return this.blockManager.editorMethods.getRange();
    }

    /**
     * Selects the given range
     *
     * @param {Range} range - DOM Range object to select
     * @returns {void}
     */
    public selectRange(range: Range): void {
        this.blockManager.editorMethods.selectRange(range);
    }

    /**
     * Selects an entire block
     *
     * @param {string} blockId - ID of the block to select
     * @returns {void}
     */
    public selectBlock(blockId: string): void {
        this.blockManager.editorMethods.selectBlock(blockId);
    }

    /**
     * Selects all blocks in the editor.
     *
     * @returns {void}
     */
    public selectAllBlocks(): void {
        this.blockManager.editorMethods.selectAllBlocks();
    }

    /**
     * Focuses the editor
     *
     * @returns {void}
     */
    public focusIn(): void {
        this.blockManager.editorMethods.focusIn();
    }

    /**
     * Removes focus from the editor
     *
     * @returns {void}
     */
    public focusOut(): void {
        this.blockManager.editorMethods.focusOut();
    }

    /**
     * Gets total block count
     *
     * @returns {number} Number of blocks in editor
     */
    public getBlockCount(): number {
        return this.blockManager.editorMethods.getBlockCount();
    }

    /**
     * Prints all the block data.
     *
     * @returns {void}
     */
    public print(): void {
        this.blockManager.editorMethods.print();
    }

    /**
     * Renders blocks from JSON data, either replacing all existing content or inserting at cursor position.
     *
     * @param {object | string} json - The JSON data (object or string) containing block definitions
     * @param {boolean} replace - Whether to replace all existing content (true) or insert at cursor (false). By default, it is set to false.
     * @param {string} targetBlockId - ID of block to insert after (applicable only if replace is false).
     * @returns {boolean} - True if operation was successful, false otherwise
     */
    public renderBlocksFromJson(
        json: object | string,
        replace: boolean = false,
        targetBlockId?: string
    ): boolean {
        return this.blockManager.editorMethods.renderBlocksFromJson(json, replace, targetBlockId);
    }

    /**
     * Retrieves data from the editor as JSON.
     * If a block ID is provided, returns the data of that specific block; otherwise returns all content.
     *
     * @param {string} blockId - Optional ID of the block to retrieve
     * @returns {any} The JSON representation of the editor data
     */
    public getDataAsJson(blockId?: string): BlockModel | BlockModel[] {
        return this.blockManager.editorMethods.getDataAsJson(blockId);
    }

    /**
     * Retrieves data from the editor as HTML.
     * If a block ID is provided, returns the data of that specific block; otherwise returns all content.
     *
     * @param {string} blockId - Optional ID of the block to retrieve
     * @returns {string} The HTML representation of the editor data
     */
    public getDataAsHtml(blockId?: string): string {
        return this.blockManager.editorMethods.getDataAsHtml(blockId);
    }

    /**
     * Parses an HTML string into an array of BlockModel objects.
     *
     * @param {string} html - HTML string to parse.
     * @returns {BlockModel[]} An array of BlockModel objects representing the parsed HTML structure.
     */
    public parseHtmlToBlocks(html: string): BlockModel[] {
        return this.blockManager.editorMethods.parseHtmlToBlocks(html);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.notify(events.destroy, {});
        this.blockManager.observer.notify(events.destroy, {});

        this.mentionRenderer = null;
        this.menubarRenderer = null;
        this.tooltipRenderer = null;
        this.dialogRenderer = null;
        this.dropdownListRenderer = null;

        this.inlineToolbarModule = null;
        this.inlineContentInsertionModule = null;
        this.slashCommandModule = null;
        this.contextMenuModule = null;
        this.blockActionMenuModule = null;
        this.linkModule = null;

        this.floatingIconRenderer = null;
        this.eventManager = null;

        this.l10n = null;
        this.blockContainer = null;
        this.isRendered = false;

        this.intermediate = null;
        super.destroy();
    }

    /**
     * Called if any of the property value is changed.
     *
     * @param  {BlockEditorModel} newProp - Specifies new properties
     * @param  {BlockEditorModel} oldProp - Specifies old properties
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(newProp: BlockEditorModel, oldProp?: BlockEditorModel): void {
        const prevProp: BlockEditorModel = oldProp;
        if (!prevProp) { return; }

        this.blockManager.updateContext(this.getEditorProps());
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
            case 'height':
                this.setDimension();
                break;
            case 'cssClass':
                this.setCssClass();
                break;
            case 'locale':
                this.updateLocale();
                break;
            case 'enableRtl':
                this.setRtlClass();
                this.notify(events.rtlChanged, {});
                break;
            case 'readOnly':
                this.updateEditorReadyOnlyState();
                this.intermediate.processActions('wireUnWireDragEvents', { enable: !this.readOnly });
                break;
            case 'keyConfig':
                this.blockManager.initializeKeyBindings();
                break;
            case 'undoRedoStack':
                this.blockManager.undoRedoAction.adjustUndoRedoStacks();
                break;
            case 'enableDragAndDrop':
                this.intermediate.processActions('wireUnWireDragEvents', { enable: this.enableDragAndDrop });
                break;
            case 'enableHtmlSanitizer':
            case 'enableHtmlEncode':
            case 'blocks':
                this.blockManager.editorMethods.replaceAllBlocks(
                    prop === 'blocks' ? newProp.blocks : this.blockManager.getEditorBlocks()
                );
                break;
            case 'labelSettings':
            case 'users':
                this.notify(events.moduleChanged, { module: 'inlineContent', newProp: newProp, oldProp: oldProp });
                break;
            case 'commandMenuSettings':
                this.notify(events.moduleChanged, { module: 'slashCommand', newProp: newProp, oldProp: oldProp });
                break;
            case 'inlineToolbarSettings':
                this.notify(events.moduleChanged, { module: 'inlineToolbarSettings', newProp: newProp, oldProp: oldProp });
                break;
            case 'blockActionMenuSettings':
                this.notify(events.moduleChanged, { module: 'blockActionMenuSettings', newProp: newProp, oldProp: oldProp });
                break;
            case 'contextMenuSettings':
                this.notify(events.moduleChanged, { module: 'contextMenuSettings', newProp: newProp, oldProp: oldProp });
                break;
            }
        }
    }
}
