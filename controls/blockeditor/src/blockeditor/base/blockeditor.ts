import { Component, getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property, isNullOrUndefined as isNOU, formatUnit, Collection, EmitType, Complex, remove, Event, append, L10n, addClass } from '@syncfusion/ej2-base';
import { BlockModel, UserModel, CommandMenuSettingsModel, InlineToolbarSettingsModel, PasteSettingsModel, BlockActionMenuSettingsModel, ContextMenuSettingsModel, LabelSettingsModel, BasePlaceholderProp, HeadingProps } from '../models/index';
import { BlockEditorModel } from './blockeditor-model';
import { Block } from '../models/block/block';
import { User } from '../models/common/user';
import { CommandMenuSettings } from '../models/menus/command-menu-settings';
import { InlineToolbarSettings } from '../models/menus/inline-toolbar-settings';
import { ContextMenuSettings } from '../models/menus/context-menu-settings';
import { BlockActionMenuSettings } from '../models/menus/blockaction-menu-settings';
import { PasteSettings } from '../models/common/paste-settings';
import { LabelSettings } from '../models/common/label-settings';
import { FocusEventArgs, BlurEventArgs, BlockAddedEventArgs, BlockRemovedEventArgs, BlockMovedEventArgs, ContentChangedEventArgs, SelectionChangedEventArgs, UndoRedoEventArgs, BlockDragEventArgs, BlockDropEventArgs, KeyActionExecutedEventArgs, BeforePasteEventArgs, AfterPasteEventArgs } from './eventargs';
import { getBlockContentElement, getBlockModelById } from '../utils/block';
import { IUndoRedoSelectionState } from './interface';
import { getTemplateFunction } from '../utils/common';
import { BlockType, BuiltInToolbar } from './enums';
import { clearBreakTags, isElementEmpty } from '../utils/dom';
import { decode, encode, sanitizeHelper } from '../utils/security';
import { events } from './constant';
import * as constants from './constant';

import { PopupRenderer, MentionRenderer, MenuBarRenderer, TooltipRenderer } from '../renderer/index';
import { BlockRendererManager, BlockCommandManager, StateManager, FloatingIconManager, EventManager } from '../managers/index';
import { FormattingAction, ListBlockAction, DragAndDropAction, BlockEditorMethods, UndoRedoAction, ClipboardAction } from '../actions/index';
import { InlineContentInsertionModule, NodeSelection, SlashCommandModule, ContextMenuModule, BlockActionMenuModule, InlineToolbarModule, LinkModule } from '../plugins/index';
import { BlockService } from '../services/index';

/**
 * Represents the root class for the Block Editor component.
 * The `BlockEditor` is a rich text editor that provides functionality for creating, editing, and managing blocks of content.
 * Blocks can include paragraph, lists, toggles, and other block types, organized hierarchically.
 *
 **/
@NotifyPropertyChanges
export class BlockEditor extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Specifies the height of the editor.
     * This property sets the height of the editor, which can be a string or number.
     *
     * @default '100%'
     */
    @Property('100%')
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
     *
     * @default ''
     */
    @Property('')
    public locale: string;

    /**
     * Specifies custom keyboard shortcuts configuration.
     * This property allows the definition of custom keyboard shortcuts for editor commands.
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
     * @default 30
     */
    @Property(30)
    public undoRedoStack: number;

    /**
     * Specifies whether the editor is in read-only mode.
     * This property prevents users from editing the content when set to true.
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
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Specifies whether drag and drop functionality is enabled for the blocks.
     * This property enables or disables drag-and-drop operations within the block editor.
     *
     * @default true
     */
    @Property(true)
    public enableDragAndDrop: boolean;

    /**
     * Specifies whether URLs should automatically have "https://" added if the user does not include it.
     * If disabled,  URLs will be entered as-is, without any protocol prepends.
     * This can be useful for internal links or specific use cases where the protocol is not required.
     *
     * @default true
     */
    @Property(true)
    public enableAutoHttps: boolean;

    /**
     * Specifies an array of block models representing the content of the editor.
     * This property holds the various blocks that make up the editor's content.
     *
     * @default []
     */
    @Collection<BlockModel>([], Block)
    public blocks: BlockModel[];

    /**
     * Specifies an array of user models representing the list of users.
     * This property holds user details such as name, ID, and other properties.
     *
     * @default []
     */
    @Collection<UserModel>([], User)
    public users: UserModel[];

    /**
     * Specifies configuration options for editor commands.
     * This property allows customization of command behaviors within the editor.
     *
     * @default {}
     */
    @Complex<CommandMenuSettingsModel>({}, CommandMenuSettings)
    public commandMenu: CommandMenuSettingsModel;

    /**
     * Specifies settings for the formatting toolbar.
     * This property configures the toolbar that provides text formatting options.
     *
     * @default {}
     */
    @Complex<InlineToolbarSettingsModel>({}, InlineToolbarSettings)
    public inlineToolbar: InlineToolbarSettingsModel;

    /**
     * Specifies the configuration settings for the block actions menu.
     * This property allows customization of the actions menu within the editor.
     *
     * @default {}
     */
    @Complex<BlockActionMenuSettingsModel>({}, BlockActionMenuSettings)
    public blockActionsMenu: BlockActionMenuSettingsModel;

    /**
     * Specifies settings for the context menu.
     * This property configures the context menu options that appear on right-click actions.
     *
     * @default {}
     */
    @Complex<ContextMenuSettingsModel>({}, ContextMenuSettings)
    public contextMenu: ContextMenuSettingsModel;

    /**
     * Configures settings related to pasting content in the editor.
     * This property utilizes the PasteSettingsModel to specify various options and behaviors for paste operations.
     *
     * @default {}
     */
    @Complex<PasteSettingsModel>({}, PasteSettings)
    public pasteSettings: PasteSettingsModel;

    /**
     * Configures settings related to label popup in the editor.
     * This property utilizes the LabelSettingsModel to specify various options and behaviors for paste operations.
     *
     * @default {}
     */
    @Complex<LabelSettingsModel>({}, LabelSettings)
    public labelSettings: LabelSettingsModel;

    /* Events */

    /**
     * Event triggered after the Blockeditor is rendered completely.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Event triggered when the content of the block editor is changed.
     * This event provides details about the changes made to the content.
     *
     * @event contentChanged
     */
    @Event()
    public contentChanged: EmitType<ContentChangedEventArgs>;

    /**
     * Event triggered when the selection in the block editor changes.
     * This event provides details about the new selection state.
     *
     * @event selectionChanged
     */
    @Event()
    public selectionChanged: EmitType<SelectionChangedEventArgs>;

    /**
     * Event triggered when an undo or redo operation is performed in the block editor.
     * This event provides details about the undo/redo action that was executed.
     *
     * @event undoRedoPerformed
     */
    @Event()
    public undoRedoPerformed: EmitType<UndoRedoEventArgs>;

    /**
     * Event triggered when a block is added to the block editor.
     * This event provides details about the newly added block.
     *
     * @event blockAdded
     */
    @Event()
    public blockAdded: EmitType<BlockAddedEventArgs>;

    /**
     * Event triggered when a block is removed from the block editor.
     * This event provides details about the block being removed.
     *
     * @event blockRemoved
     */
    @Event()
    public blockRemoved: EmitType<BlockRemovedEventArgs>;

    /**
     * Event triggered when a block is moved within the block editor.
     * This event provides details about the moved block.
     *
     * @event blockMoved
     */
    @Event()
    public blockMoved: EmitType<BlockMovedEventArgs>;

    /**
     * Event triggered during the dragging operation of a block.
     * This event provides details about the drag operation.
     *
     * @event blockDrag
     */
    @Event()
    public blockDrag: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when the drag operation for a block starts.
     * This event provides details about the initial stage of the drag.
     *
     * @event blockDragStart
     */
    @Event()
    public blockDragStart: EmitType<BlockDragEventArgs>;

    /**
     * Event triggered when a block is dropped after a drag operation.
     * This event provides details about the block drop action.
     *
     * @event blockDrop
     */
    @Event()
    public blockDrop: EmitType<BlockDropEventArgs>;

    /**
     * Event triggered when the block editor gains focus.
     * This event provides details about the focus action.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;

    /**
     * Event triggered when the block editor loses focus.
     * This event provides details about the blur action.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;

    /**
     * Event triggered when a key action (both built-in and custom) is executed in the block editor component.
     * This event provides detailed information about the executed key action, including the key combination,
     * the action performed, whether the action was triggered by a custom key configuration, and the platform.
     *
     * @event keyActionExecuted
     */
    @Event()
    public keyActionExecuted: EmitType<KeyActionExecutedEventArgs>;

    /**
     * Event triggered before a paste operation occurs in the block editor.
     * This event allows interception or modification of the pasted content.
     *
     * @event beforePaste
     */
    @Event()
    public beforePaste: EmitType<BeforePasteEventArgs>;

    /**
     * Event triggered after a paste operation occurs in the block editor.
     * This event provides details about the pasted content.
     *
     * @event afterPaste
     */
    @Event()
    public afterPaste: EmitType<AfterPasteEventArgs>;


    /* Renderers */
    /** @hidden */
    public popupRenderer: PopupRenderer;

    /** @hidden */
    public mentionRenderer: MentionRenderer;

    /** @hidden */
    public tooltipRenderer: TooltipRenderer;

    /** @hidden */
    public menubarRenderer: MenuBarRenderer;

    /* Manager instances */
    /** @hidden */
    public blockRendererManager: BlockRendererManager;

    /** @hidden */
    public blockCommandManager: BlockCommandManager;

    /** @hidden */
    public stateManager: StateManager;

    /** @hidden */
    public floatingIconManager: FloatingIconManager;

    /** @hidden */
    public eventManager: EventManager;

    /* Services */
    /** @hidden */
    public blockService: BlockService;

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
    public nodeSelection: NodeSelection;
    /** @hidden */
    public linkModule: LinkModule;

    /* Actions */
    /** @hidden */
    public formattingAction: FormattingAction;

    /** @hidden */
    public listBlockAction: ListBlockAction;

    /** @hidden */
    public dragAndDropAction: DragAndDropAction;

    /** @hidden */
    public blockEditorMethods: BlockEditorMethods;

    /** @hidden */
    public clipboardAction: ClipboardAction;

    /* Variables */
    /** @hidden */
    public overlayContainer: HTMLElement;

    /** @hidden */
    public floatingIconContainer!: HTMLElement;

    /** @hidden */
    public currentHoveredBlock: HTMLElement;

    /** @hidden */
    public currentFocusedBlock: HTMLElement;

    /** @hidden */
    public isPopupOpenedOnAddIconClick: boolean;

    /** @hidden */
    public blockWrapper: HTMLElement;

    /** @hidden */
    public keyCommandMap: Map<string, string>;

    private defaultKeyConfig: Record<string, string> = {
        bold: 'ctrl+b',
        italic: 'ctrl+i',
        underline: 'ctrl+u',
        strikethrough: 'ctrl+shift+x',
        link: 'ctrl+k',
        print: 'ctrl+p'
    };
    /** @hidden */
    public l10n: L10n;
    /** @hidden */
    public updateTimer: ReturnType<typeof setTimeout>;
    /** @hidden */
    public isEntireEditorSelected: boolean
    /** @hidden */
    public undoRedoAction: UndoRedoAction;
    /** @hidden */
    public previousSelection: IUndoRedoSelectionState | undefined = undefined;
    /** @hidden */
    public isProtectedOnChange: boolean;

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
        this.initializeServices();
        // Initialize managers and engines
        this.initializeManagers();
        this.intializeEngines();

        // Initialize key bindings
        this.initializeKeyBindings();

        // Set dimensions and styles
        this.setDimension();
        this.setCssClass();

        this.stateManager.updateEditorReadyOnlyState();
        // Update and process blocks
        const populatedBlocks: BlockModel[] = this.stateManager.populateBlockProperties(this.getEditorBlocks());
        this.setEditorBlocks(populatedBlocks);
        this.stateManager.updatePropChangesToModel();
        this.stateManager.populateUniqueIds(this.getEditorBlocks());

        // Create floating icons and overlay containers
        if (!this.floatingIconContainer) {
            this.floatingIconManager.createFloatingIcons();
        }
        if (!this.overlayContainer) {
            this.createOverlayContainer();
        }

        // Render the blocks
        this.renderBlockWrapper();
        this.initializeMentionModules();
        this.renderBlocks(this.getEditorBlocks());

        // Wire events and apply RTL settings
        if (this.enableDragAndDrop) {
            this.dragAndDropAction.wireDragEvents();
        }
        this.eventManager.wireGlobalEvents();
        this.applyRtlSettings();
    }

    /**
     * Initializes locale values
     *
     * @returns {void}
     */
    private initializeLocale(): void {
        this.l10n = new L10n(this.getModuleName(), {
            paragraph: 'Write something or ‘/’ for commands.',
            heading1: 'Heading 1',
            heading2: 'Heading 2',
            heading3: 'Heading 3',
            heading4: 'Heading 4',
            collapsibleParagraph: 'Collapsible Paragraph',
            collapsibleHeading1: 'Collapsible Heading 1',
            collapsibleHeading2: 'Collapsible Heading 2',
            collapsibleHeading3: 'Collapsible Heading 3',
            collapsibleHeading4: 'Collapsible Heading 4',
            bulletList: 'Add item',
            numberedList: 'Add item',
            checklist: 'Todo',
            quote: 'Write a quote',
            callout: 'Write a callout',
            addIconTooltip: 'Click to insert below',
            dragIconTooltipActionMenu: 'Click to open',
            dragIconTooltip: '(Hold to drag)',
            insertLink: 'Insert Link',
            linkText: 'Text',
            linkTextPlaceholder: 'Link text',
            linkUrl: 'URL',
            linkUrlPlaceholder: 'https://example.com',
            linkTitle: 'Title',
            linkTitlePlaceholder: 'Link title',
            linkOpenInNewWindow: 'Open in new window',
            linkInsert: 'Insert',
            linkRemove: 'Remove',
            linkCancel: 'Cancel',
            codeCopyTooltip: 'Copy code'
        }, this.locale);
    }

    /**
     * Initializes all manager classes
     *
     * @returns {void}
     */
    private initializeManagers(): void {
        this.blockRendererManager = new BlockRendererManager(this);
        this.blockCommandManager = new BlockCommandManager(this);
        this.stateManager = new StateManager(this);
        this.floatingIconManager = new FloatingIconManager(this);
        this.eventManager = new EventManager(this);
    }

    /**
     * Initializes all services
     *
     * @returns {void}
     */
    private initializeServices(): void {
        this.blockService = new BlockService(this.blocks);
    }

    /**
     * Initializes all engines
     *
     * @returns {void}
     */
    private intializeEngines(): void {
        this.blockEditorMethods = new BlockEditorMethods(this);
        this.nodeSelection = new NodeSelection(this);
        this.popupRenderer = new PopupRenderer(this);
        this.menubarRenderer = new MenuBarRenderer(this);
        this.mentionRenderer = new MentionRenderer(this);
        this.tooltipRenderer = new TooltipRenderer(this);
        this.formattingAction = new FormattingAction(this);
        this.listBlockAction = new ListBlockAction(this);
        this.dragAndDropAction = new DragAndDropAction(this);
        this.undoRedoAction = new UndoRedoAction(this);
        this.clipboardAction = new ClipboardAction(this);
        this.inlineContentInsertionModule = new InlineContentInsertionModule(this);
        this.linkModule = new LinkModule(this);
        this.inlineToolbarModule = new InlineToolbarModule(this);
        this.blockActionMenuModule = new BlockActionMenuModule(this);
        this.contextMenuModule = new ContextMenuModule(this);
    }

    /**
     * Sets the dimensions of the editor
     *
     * @returns {void}
     */
    private setDimension(): void {
        this.element.style.width = !isNOU(this.width) ? formatUnit(this.width) : this.element.style.width;
        this.element.style.height = !isNOU(this.height) ? formatUnit(this.height) : this.element.style.height;
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
     * Applies dynamic locale changes
     *
     * @returns {void}
     */
    private updateLocale(): void {
        this.l10n.setLocale(this.locale);
        // Manually update placeholder for current focused block alone, rest will be updated on further focus
        if (this.currentFocusedBlock) {
            this.togglePlaceholder(this.currentFocusedBlock, true);
        }
        this.floatingIconManager.updateFloatingIconTooltipContent();
        this.notify(events.localeChanged, {});
    }

    /**
     * Applies RTL settings to the editor
     *
     * @returns {void}
     */
    private applyRtlSettings(): void {
        this.element.classList.toggle(constants.RTL_CLS, this.enableRtl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rtlTargets: any = [
            this.inlineContentInsertionModule.userMenuObj,
            this.inlineContentInsertionModule.labelMenuObj,
            this.floatingIconManager.addIconTooltip,
            this.floatingIconManager.dragIconTooltip,
            this.contextMenuModule.contextMenuObj
        ];

        for (const target of rtlTargets) {
            if (target) {
                target.enableRtl = this.enableRtl;
            }
        }
        this.notify(events.rtlChanged, {});
    }

    /**
     * Creates the overlay container for popups and dialogs
     *
     * @returns {void}
     */
    private createOverlayContainer(): void {
        this.overlayContainer = this.createElement('div', { className: constants.OVERLAY_CONTAINER_CLS });
        this.element.appendChild(this.overlayContainer);
    }

    /**
     * Initializes the key bindings
     *
     * @returns {void}
     */
    private initializeKeyBindings(): void {
        const config: { [key: string]: string } = { ...this.defaultKeyConfig, ...this.keyConfig };
        const map: Map<string, string> = new Map<string, string>();

        for (const command in config) {
            if (Object.prototype.hasOwnProperty.call(config, command)) {
                const keyCombo: string = config[`${command}`].toLowerCase().replace(/\s+/g, '');
                map.set(keyCombo, command);
            }
        }
        this.keyCommandMap = map;
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
     * Creates the block wrapper container
     *
     * @returns {void}
     */
    private renderBlockWrapper(): void {
        this.blockWrapper = this.createElement('div', { className: constants.BLOCK_WRAPPER_CLS });
        this.element.appendChild(this.blockWrapper);
        this.blockCommandManager.createDefaultEmptyBlock();
    }

    /**
     * Renders blocks in the editor
     *
     * @param {BlockModel[]} blocks The blocks to render
     * @returns {void}
     * @hidden
     */
    public renderBlocks(blocks: BlockModel[]): void {
        this.blockRendererManager.renderBlocks(blocks);
    }

    /**
     * Sets focus to a block element
     *
     * @param {HTMLElement} block The block element to focus
     * @returns {void}
     * @hidden
     */
    public setFocusToBlock(block: HTMLElement): void {
        if (block) {
            block.focus();
            this.currentFocusedBlock = block;
        }
    }

    /**
     * Fetches the editor blocks from service
     *
     * @returns {BlockModel[]} The editor blocks data
     * @hidden
     */
    public getEditorBlocks(): BlockModel[] {
        if (!this.blockService) { return []; }
        return this.blockService.getBlocks();
    }

    /**
     * Populates the editor blocks data with the given blocks
     *
     * @param {BlockModel[]} blocks The blocks to set for the editor
     * @returns {void}
     * @hidden
     */
    public setEditorBlocks(blocks: BlockModel[]): void {
        if (!this.blockService) { return; }
        this.blockService.setBlocks(blocks);
    }

    /**
     * Gets a block element by ID
     *
     * @param {string} blockId The block ID
     * @returns {HTMLElement | null} The block element or null if not found
     * @hidden
     */
    public getBlockElementById(blockId: string): HTMLElement | null {
        return this.blockWrapper.querySelector(`#${blockId}`);
    }

    /**
     * Gets the current focused block model
     *
     * @returns {BlockModel | null} The current focused block model or null if no block is focused
     * @hidden
     */
    public getCurrentFocusedBlockModel(): BlockModel {
        if (!this.currentFocusedBlock) { return null; }
        return getBlockModelById(this.currentFocusedBlock.id, this.getEditorBlocks());
    }

    /**
     * Toggles the placeholder for a block element
     *
     * @param {HTMLElement} blockElement The block element
     * @param {boolean} isFocused Whether the block is currently focused
     * @returns {void}
     * @hidden
     */
    public togglePlaceholder(blockElement: HTMLElement, isFocused: boolean): void {
        const blockModel: BlockModel = blockElement ? getBlockModelById(blockElement.id, this.getEditorBlocks()) : null;
        if (!blockModel || (blockModel && !('placeholder' in blockModel.props))) { return; }
        const blockType: string = blockElement.getAttribute('data-block-type');
        const placeholderValue: string = this.getPlaceholderValue(blockModel);
        const contentEle: HTMLElement = getBlockContentElement(blockElement);
        const isEmptyContent: boolean = isElementEmpty(contentEle);
        contentEle.setAttribute('placeholder', isEmptyContent && isFocused ? placeholderValue : '');
        if (isEmptyContent && blockType !== BlockType.Code) {
            clearBreakTags(contentEle);
        }
    }

    /**
     * Responsible for rendering the template for a block
     *
     * @param {BlockModel} block The block model
     * @param {HTMLElement} templateElement The template element to render into
     * @returns {void}
     * @hidden
     */
    public renderTemplate(block: BlockModel, templateElement: HTMLElement): void {
        const templateName: string = block.id + 'template';
        this.clearTemplate([templateName]);
        const templateFunction: Function = getTemplateFunction(block.template);
        append(templateFunction({}, this, templateName, 'template', this.isStringTemplate), templateElement);
        this.renderReactTemplates();
    }

    /**
     * Serializes the given value for HTML encoding and sanitization
     *
     * @param {string} value The value to serialize
     * @returns {string} The serialized value
     * @hidden
     */
    public serializeValue(value: string): string {
        if (!isNOU(value)) {
            if (this.enableHtmlEncode) {
                value = sanitizeHelper(decode(value), this.enableHtmlSanitizer);
                value = encode(value);
            } else {
                value = sanitizeHelper(value, this.enableHtmlSanitizer);
            }
        }
        return value;
    }

    /**
     * Gets the placeholder value for the given block element.
     *
     * @param {BlockModel} block The block model to get placeholder for.
     * @returns {string} The placeholder value for the given block type.
     * @hidden
     */
    public getPlaceholderValue(block: BlockModel): string {
        const props: HeadingProps = block.props as HeadingProps;
        if (props && props.placeholder && props.placeholder !== '') { return props.placeholder; }
        let constant: string = block.type.charAt(0).toLowerCase() + block.type.slice(1);
        if (block.type.endsWith(BlockType.Heading) && props && props.level) {
            constant += props.level.toString();
        }
        return this.l10n.getConstant(constant);
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
        this.blockEditorMethods.addBlock(block, targetId, isAfter);
    }

    /**
     * Removes a block from the editor
     *
     * @param {string} blockId - ID of the block to remove
     * @returns {void}
     */
    public removeBlock(blockId: string): void {
        this.blockEditorMethods.removeBlock(blockId);
    }

    /**
     * Gets a block by ID
     *
     * @param {string} blockId - ID of the block to retrieve
     * @returns {BlockModel | null} - The block model or null if not found
     */
    public getBlock(blockId: string): BlockModel | null {
        return this.blockEditorMethods.getBlock(blockId);
    }

    /**
     * Moves a block to a new position
     *
     * @param {string} fromBlockId - ID of the block to move
     * @param {string} toBlockId - ID of the target block to move to
     * @returns {void}
     */
    public moveBlock(fromBlockId: string, toBlockId: string): void {
        this.blockEditorMethods.moveBlock(fromBlockId, toBlockId);
    }

    /**
     * Updates block properties
     *
     * @param {string} blockId - ID of the block to update
     * @param {Partial<BlockModel>} properties - Properties to update
     * @returns {boolean} True if update was successful
     */
    public updateBlock(blockId: string, properties: Partial<BlockModel>): boolean {
        return this.blockEditorMethods.updateBlock(blockId, properties);
    }

    /**
     * Enables one or more toolbar items.
     * This method allows the specified toolbar items to be enabled.
     *
     * @param {string | string[]} itemId - The id(s) of the toolbar item(s) to enable.
     * @returns {void}
     */
    public enableToolbarItems(itemId: string | string[]): void {
        this.blockEditorMethods.enableDisableToolbarItems(itemId, true);
    }

    /**
     * Disables one or more toolbar items.
     * This method allows the specified toolbar items to be disabled.
     *
     * @param {string | string[]} itemId - The id(s) of the toolbar item(s) to disable.
     * @returns {void}
     */
    public disableToolbarItems(itemId: string | string[]): void {
        this.blockEditorMethods.enableDisableToolbarItems(itemId, false);
    }

    /**
     * Executes the specified toolbar action on the editor.
     *
     * @param {string} action - The action to execute.
     * @param {value} value - The value required if any (Optional).
     * @returns {void}
     */
    public executeToolbarAction(action: BuiltInToolbar, value?: string): void {
        this.blockEditorMethods.executeToolbarAction(action, value);
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
        this.blockEditorMethods.setSelection(contentId, startIndex, endIndex);
    }

    /**
     * Sets cursor position
     *
     * @param {string} blockId - ID of the target block
     * @param {number} position - Character offset position
     * @returns {void}
     */
    public setCursorPosition(blockId: string, position: number): void {
        this.blockEditorMethods.setCursorPosition(blockId, position);
    }

    /**
     * Gets the block from current selection
     *
     * @returns {BlockModel | null} - The block model or null if not found
     */
    public getSelectedBlocks(): BlockModel[] | null {
        return this.blockEditorMethods.getSelectedBlocks();
    }

    /**
     * Gets current selection range
     *
     * @returns {Range | null} Current selection range or null
     */
    public getRange(): Range | null {
        return this.blockEditorMethods.getRange();
    }

    /**
     * Selects the given range
     *
     * @param {Range} range - DOM Range object to select
     * @returns {void}
     */
    public selectRange(range: Range): void {
        this.blockEditorMethods.selectRange(range);
    }

    /**
     * Selects an entire block
     *
     * @param {string} blockId - ID of the block to select
     * @returns {void}
     */
    public selectBlock(blockId: string): void {
        this.blockEditorMethods.selectBlock(blockId);
    }

    /**
     * Selects all blocks in the editor.
     *
     * @returns {void}
     */
    public selectAllBlocks(): void {
        this.blockEditorMethods.selectAllBlocks();
    }

    /**
     * Focuses the editor
     *
     * @returns {void}
     */
    public focusIn(): void {
        this.blockEditorMethods.focusIn();
    }

    /**
     * Removes focus from the editor
     *
     * @returns {void}
     */
    public focusOut(): void {
        this.blockEditorMethods.focusOut();
    }

    /**
     * Gets total block count
     *
     * @returns {number} Number of blocks in editor
     */
    public getBlockCount(): number {
        return this.blockEditorMethods.getBlockCount();
    }

    /**
     * Prints all the block data.
     *
     * @returns {void}
     */
    public print(): void {
        this.blockEditorMethods.print();
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
        return this.blockEditorMethods.renderBlocksFromJson(json, replace, targetBlockId);
    }

    /**
     * Retrieves data from the editor as JSON.
     * If a block ID is provided, returns the data of that specific block; otherwise returns all content.
     *
     * @param {string} blockId - Optional ID of the block to retrieve
     * @returns {any} The JSON representation of the editor data
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getDataAsJson(blockId?: string): any {
        return this.blockEditorMethods.getDataAsJson(blockId);
    }

    /**
     * Retrieves data from the editor as HTML.
     * If a block ID is provided, returns the data of that specific block; otherwise returns all content.
     *
     * @param {string} blockId - Optional ID of the block to retrieve
     * @returns {string} The HTML representation of the editor data
     */
    public getDataAsHtml(blockId?: string): string {
        return this.blockEditorMethods.getDataAsHtml(blockId);
    }

    protected removeAndNullify(element: HTMLElement): void {
        if (element) {
            if (!isNOU(element.parentNode)) {
                remove(element);
            } else {
                element.innerHTML = '';
            }
        }
    }

    private destroyBlockEditor(): void {
        const properties: string [] = [
            'floatingIconContainer',
            'currentHoveredBlock',
            'currentFocusedBlock',
            'blockWrapper',
            'overlayContainer'
        ];

        for (const prop of properties) {
            const element: keyof BlockEditor = prop as keyof BlockEditor;
            this.removeAndNullify(this[element as keyof BlockEditor]);
            (this[element as keyof BlockEditor] as HTMLElement) = null;
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.eventManager.unWireGlobalEvents();
        if (this.enableDragAndDrop) {
            this.dragAndDropAction.destroy();
        }
        if (this.undoRedoAction) {
            this.undoRedoAction.destroy();
        }
        if (!isNOU(this.updateTimer)) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
        this.notify(events.destroy, {});

        this.popupRenderer = null;
        this.mentionRenderer = null;
        this.menubarRenderer = null;

        this.inlineToolbarModule = null;
        this.inlineContentInsertionModule = null;
        this.slashCommandModule = null;
        this.contextMenuModule = null;
        this.blockActionMenuModule = null;
        this.linkModule = null;
        this.nodeSelection = null;

        this.formattingAction = null;
        this.listBlockAction = null;
        this.blockEditorMethods = null;

        this.blockCommandManager = null;
        this.blockRendererManager = null;
        this.floatingIconManager = null;
        this.stateManager = null;
        this.eventManager = null;

        this.blockService = null;

        this.keyCommandMap = null;
        this.defaultKeyConfig = null;
        this.l10n = null;
        this.dragAndDropAction = null;
        this.undoRedoAction = null;
        this.updateTimer = null;
        this.destroyBlockEditor();
        this.isRendered = false;
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
    /* eslint-disable */
    public onPropertyChanged(newProp: BlockEditorModel, oldProp?: BlockEditorModel): void {
        const prevProp: BlockEditorModel = oldProp;
        if (!prevProp) { return; }
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
                this.applyRtlSettings();
                break;
            case 'readOnly':
                this.stateManager.updateEditorReadyOnlyState();
                break;
            case 'keyConfig':
                this.initializeKeyBindings();
                break;
            case 'enableDragAndDrop':
                if (this.enableDragAndDrop) {
                    this.dragAndDropAction.wireDragEvents();
                }
                else {
                    this.dragAndDropAction.unwireDragEvents();
                }
                break;
            case 'enableAutoHttps':
                this.linkModule.handleAutoHttps();
                break;
            case 'commandMenu':
                this.notify(events.moduleChanged, { module: 'slashCommand', newProp: newProp, oldProp: oldProp });
                break;
            case 'inlineToolbar':
                this.notify(events.moduleChanged, { module: 'inlineToolbar', newProp: newProp, oldProp: oldProp });
                break;
            case 'blockActionsMenu':
                this.notify(events.moduleChanged, { module: 'blockActionsMenu', newProp: newProp, oldProp: oldProp });
                break;
            case 'contextMenu':
                this.notify(events.moduleChanged, { module: 'contextMenu', newProp: newProp, oldProp: oldProp });
                break;
            case 'blocks':
                this.stateManager.handleBlockPropertyChanges({ newProp: newProp, oldProp: oldProp });
                break;
            }
        }
    }
    /* eslint-enable */
}
