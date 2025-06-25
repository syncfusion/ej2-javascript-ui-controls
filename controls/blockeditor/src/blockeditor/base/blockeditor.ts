import { Component, getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property, isNullOrUndefined as isNOU, formatUnit, Collection, EmitType, EventHandler, Complex, remove, Event, append, Observer, L10n, detach } from '@syncfusion/ej2-base';
import { Mention, MentionChangeEventArgs, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { Popup, Tooltip } from '@syncfusion/ej2-popups';
import { BeforeOpenCloseMenuEventArgs, ClickEventArgs, ContextMenu, ItemModel, MenuEventArgs, OpenCloseMenuEventArgs, Toolbar } from '@syncfusion/ej2-navigations';
import { BlockModel, UserModel, CommandMenuSettingsModel, InlineToolbarSettingsModel, PasteSettingsModel, ToolbarItemModel, ContentModel, CommandItemModel, StyleModel, LabelItemModel, BlockActionMenuSettingsModel, ContextMenuSettingsModel, BlockActionItemModel, ContextMenuItemModel, LabelSettingsModel } from '../models/index';
import { BlockEditorModel } from './blockeditor-model';
import { Block } from '../models/block/block';
import { User } from '../models/common/user';
import { CommandMenuSettings } from '../models/menus/command-menu-settings';
import { InlineToolbarSettings } from '../models/menus/inline-toolbar-settings';
import { ContextMenuSettings } from '../models/menus/context-menu-settings';
import { BlockActionMenuSettings } from '../models/block/blockaction-menu-settings';
import { PasteSettings } from '../models/common/paste-settings';
import { LabelSettings } from '../models/common/label-settings';
import { FocusEventArgs, BlurEventArgs, BlockAddedEventArgs, BlockRemovedEventArgs, BlockMovedEventArgs, ContentChangedEventArgs, SelectionChangedEventArgs, UndoRedoEventArgs, BlockDragEventArgs, BlockDropEventArgs, KeyActionExecutedEventArgs, BeforePasteEventArgs, AfterPasteEventArgs, CommandMenuOpenEventArgs, CommandMenuCloseEventArgs, CommandItemClickedEventArgs, CommandQueryFilteringEventArgs, ToolbarOpenEventArgs, ToolbarCloseEventArgs, BlockActionMenuOpenEventArgs, BlockActionMenuCloseEventArgs, BlockActionItemClickEventArgs, ContextMenuBeforeOpenEventArgs, ContextMenuBeforeCloseEventArgs, ContextMenuOpenEventArgs, ContextMenuItemClickEventArgs, ContextMenuCloseEventArgs } from './eventargs';
import { PopupRenderer, MentionRenderer, MenuBarRenderer, TooltipRenderer } from '../renderer/index';
import { BlockAction, FormattingAction, ListBlockAction, DragAndDropAction, BlockEditorMethods, UndoRedoAction, ClipboardAction } from '../actions/index';
import { cleanCheckmarkElement, getAdjacentBlock, getBlockContentElement, getBlockIndexById, getBlockModelById, getClosestContentElementInDocument, getParentBlock, isAtEndOfBlock, isAtStartOfBlock, isListTypeBlock, isNonContentEditableBlock, isChildrenTypeBlock, getContentElementBasedOnId } from '../utils/block';
import { setCursorPosition, getSelectionRange, captureSelectionState, getPathFromBlock, getTextOffset } from '../utils/selection';
import { sanitizeBlock, sanitizeContent, sanitizeLabelItems, sanitizeStyles, transformIntoToolbarItem } from '../utils/transform';
import { IInlineContentInsertionArgs, IMentionRenderOptions, IPopupRenderOptions, ISplitContent, RangePath, IAddBlockArgs, IUndoRedoState, IUndoRedoSelection, ITransformBlockArgs } from './interface';
import { deepClone, focusLastNbsp, generateUniqueId, getAbsoluteOffset, getAutoAvatarColor, getNormalizedKey, getTemplateFunction, getUserInitials, isNodeAroundSpecialElements } from '../utils/common';
import { getBlockActionsMenuItems, getCommandMenuItems, getContextMenuItems, getInlineToolbarItems, getLabelMentionDisplayTemplate, getLabelMenuItems, getUserMentionDisplayTemplate } from '../utils/data';
import { BlockType, BuiltInToolbar, ContentType, DeletionType } from './enums';
import { InlineContentInsertionModule, NodeSelection, SlashCommandModule, ContextMenuModule, BlockActionMenuModule, InlineToolbarModule, LinkModule, ClipboardCleanupModule } from '../plugins/index';
import { clearBreakTags, createFormattingElement, findClosestParent, getElementRect, isElementEmpty, wrapNodeWithTag } from '../utils/dom';
import { decode, encode, sanitizeHelper } from '../utils/security';
import { events } from './constant';
import { getBlockDataAsHTML } from '../utils/html-parser';

/**
 * Represents the root class for the Block Editor component.
 * The `BlockEditor` is a rich text editor that provides functionality for creating, editing, and managing blocks of content.
 * Blocks can include paragraph, lists, toggles, and other block types, organized hierarchically.
 *
 * ```html
 * <div id='editor'></div>
 * <script>
 * var blockEditor = new BlockEditor({
 *   blocks: [
 *     {
 *       id: 'block-1',
 *       type: 'BlockType.Paragraph',
 *       content: [{ type: 'ContentType.Text' content: 'This is the first block.' }],
 *     },
 *   ]
 * });
 * </script>
 * ```
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

    /* Plugins */
    private inlineContentInsertionModule: InlineContentInsertionModule;
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
    public blockAction: BlockAction;

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

    /* Objects */
    private userMenuObj: Mention;
    private labelMenuObj: Mention;
    private addIconTooltip: Tooltip;
    private dragIconTooltip: Tooltip;

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
    public blocksInternal: BlockModel[];

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
    private updateTimer: ReturnType<typeof setTimeout>;
    /** @hidden */
    public isEntireEditorSelected: boolean
    /** @hidden */
    public undoRedoAction: UndoRedoAction;
    /** @hidden */
    public previousSelection: IUndoRedoSelection | undefined = undefined;

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
        return this.addOnPersist([]);
    }

    protected render(): void {
        this.initialize();
    }

    private initialize(): void {
        this.updateInternalValues();
        this.initializeLocale();
        this.intializeEngines();
        this.initializeKeyBindings();
        this.setDimension();
        this.setCssClass();
        this.updateEditorReadyOnlyState();
        this.populateUniqueIds(this.blocksInternal);
        this.renderBlockWrapper();
        this.initializeMentionModules();
        this.renderBlocks(this.blocksInternal);
        if (!this.overlayContainer) {
            this.createOverlayContainer();
        }
        if (!this.floatingIconContainer) {
            this.createFloatingIcons();
        }
        if (this.enableDragAndDrop) {
            this.dragAndDropAction.wireDragEvents();
        }
        this.wireGlobalEvents();
        this.applyRtlSettings();
    }

    private initializeLocale(): void {
        this.l10n = new L10n(this.getModuleName(), {
            paragraph: 'Write something or ‘/’ for commands.',
            heading1: 'Heading 1',
            heading2: 'Heading 2',
            heading3: 'Heading 3',
            heading4: 'Heading 4',
            toggleParagraph: 'Toggle Paragraph',
            toggleHeading1: 'Toggle Heading 1',
            toggleHeading2: 'Toggle Heading 2',
            toggleHeading3: 'Toggle Heading 3',
            toggleHeading4: 'Toggle Heading 4',
            bulletList: 'Add item',
            numberedList: 'Add item',
            checkList: 'Todo',
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

    private intializeEngines(): void {
        this.blockEditorMethods = new BlockEditorMethods(this);
        this.nodeSelection = new NodeSelection(this);
        this.popupRenderer = new PopupRenderer(this);
        this.menubarRenderer = new MenuBarRenderer(this);
        this.mentionRenderer = new MentionRenderer(this);
        this.tooltipRenderer = new TooltipRenderer(this);
        this.blockAction = new BlockAction(this);
        this.formattingAction = new FormattingAction(this);
        this.listBlockAction = new ListBlockAction(this, this.blockAction);
        this.dragAndDropAction = new DragAndDropAction(this);
        this.undoRedoAction = new UndoRedoAction(this);
        this.clipboardAction = new ClipboardAction(this);
        this.inlineContentInsertionModule = new InlineContentInsertionModule(this);
        this.linkModule = new LinkModule(this);
        this.inlineToolbarModule = new InlineToolbarModule(this);
        this.blockActionMenuModule = new BlockActionMenuModule(this);
        this.contextMenuModule = new ContextMenuModule(this);
    }

    private updateInternalValues(): void {
        this.blocksInternal = this.blocks.slice();
    }

    private setDimension(): void {
        this.element.style.width = !isNOU(this.width) ? formatUnit(this.width) : this.element.style.width;
        this.element.style.height = !isNOU(this.height) ? formatUnit(this.height) : this.element.style.height;
    }

    private setCssClass(): void {
        if (this.cssClass) { this.element.classList.add(this.cssClass); }
    }

    private updateLocale(): void {
        this.l10n.setLocale(this.locale);
        // Manually update placeholder for current focused block alone, rest will be updated on further focus
        if (this.currentFocusedBlock) {
            this.togglePlaceholder(this.currentFocusedBlock, true);
        }
        this.UpdateFloatingIconTooltipContent();
        this.notify('locale-changed', {});
    }

    private applyRtlSettings(): void {
        this.element.classList.toggle('e-rtl', this.enableRtl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rtlTargets: any = [
            this.userMenuObj,
            this.labelMenuObj,
            this.addIconTooltip,
            this.dragIconTooltip,
            this.contextMenuModule ? this.contextMenuModule.contextMenuObj : undefined
        ];

        for (const target of rtlTargets) {
            if (target) {
                target.enableRtl = this.enableRtl;
            }
        }
        this.notify('rtl-changed', {});
    }

    private updateEditorReadyOnlyState(): void {
        const defaultNonEditableElements: string[] = ['e-checkmark', 'e-callout-icon', 'e-toggle-icon', 'e-be-hr'];
        let editableElements: HTMLElement[] = Array.from(this.element.querySelectorAll(`[contenteditable='${this.readOnly}']`));
        editableElements = editableElements.filter((element: HTMLElement) => {
            return !defaultNonEditableElements.some((className: string) => element.classList.contains(className));
        });
        editableElements.forEach((element: HTMLElement) => { element.contentEditable = (!this.readOnly).toString(); });
    }

    private wireGlobalEvents(): void {
        EventHandler.add(document, 'selectionchange', this.handleEditorSelection, this);
        EventHandler.add(document, 'scroll', this.handleScrollActions, this);
        EventHandler.add(this.element, 'scroll', this.handleScrollActions, this);
        EventHandler.add(document, 'click', this.handleDocumentClickActions, this);
        EventHandler.add(document, 'mousemove', this.handleMouseMoveActions, this);
        EventHandler.add(this.element, 'mouseup', this.handleMouseUpActions, this);
        EventHandler.add(this.element, 'mousedown', this.handleMouseDownActions, this);
        EventHandler.add(this.element, 'input', this.handleEditorInputActions, this);
        EventHandler.add(this.element, 'keyup', this.handleKeyupActions, this);
        EventHandler.add(this.element, 'keydown', this.handleKeydownActions, this);
        EventHandler.add(this.element, 'click', this.handleEditorClickActions, this);
        EventHandler.add(this.element, 'copy', this.clipboardActionHandler, this);
        EventHandler.add(this.element, 'cut', this.clipboardActionHandler, this);
        EventHandler.add(this.element, 'paste', this.clipboardActionHandler, this);
        EventHandler.add(this.blockWrapper, 'focus', this.handleEditorFocusActions, this);
        EventHandler.add(this.blockWrapper, 'blur', this.handleEditorBlurActions, this);
    }

    private createOverlayContainer(): void {
        this.overlayContainer = this.createElement('div', { className: 'e-blockeditor-overlay-container' });
        this.element.appendChild(this.overlayContainer);
    }

    // public getCurrentUser(): UserModel {
    //     return this.users.find((user: UserModel) => user.id === this.currentUserId);
    // }

    public populateUniqueIds(blocks: BlockModel[], parentBlockId?: string): void {
        /* eslint-disable */
        const prevOnChange: boolean = (this as any).isProtectedOnChange;
        (this as any).isProtectedOnChange = true;
        blocks.forEach((block: BlockModel) => {
            if (!block.id) { block.id = generateUniqueId('block'); }
            if (parentBlockId) { block.parentId = parentBlockId; }
            block.content && block.content.forEach((content: ContentModel) => {
                if (!content.id) { content.id = generateUniqueId('content'); }
                if (!content.stylesApplied) { content.stylesApplied = []; }
                if (content.styles) {
                    const styles: StyleModel = sanitizeStyles(content.styles);
                    content.stylesApplied = Object.keys(styles).filter((style: string) => (content.styles as any)[`${style}`]);
                }
            });

            // Recursively process child blocks
            if (block.children && block.children.length > 0) {
                this.populateUniqueIds(block.children, block.id);
            }
        });
        (this as any).isProtectedOnChange = prevOnChange;
        /* eslint-enable */
    }

    private checkIsEntireEditorSelected(): boolean {
        const selection: Selection = document.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return false;
        }
        const range: Range = getSelectionRange();
        if (!range) { return false; }
        let firstBlockElement: HTMLElement = this.blockWrapper.firstElementChild as HTMLElement;
        let lastBlockElement: HTMLElement = this.blockWrapper.lastElementChild as HTMLElement;
        if (isChildrenTypeBlock(firstBlockElement.getAttribute('data-block-type'))) {
            firstBlockElement = firstBlockElement.querySelector('.e-block') as HTMLElement;
        }
        if (isChildrenTypeBlock(lastBlockElement.getAttribute('data-block-type'))) {
            lastBlockElement = lastBlockElement.querySelector('.e-block:last-child') as HTMLElement;
        }
        const firstBlockContent: HTMLElement = getBlockContentElement(this.blockWrapper.firstElementChild as HTMLElement);
        const lastBlockContent: HTMLElement = getBlockContentElement(this.blockWrapper.lastElementChild as HTMLElement);
        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;
        const isFirstBlockEmpty: boolean = firstBlockContent.textContent.trim() === '';
        const isLastBlockEmpty: boolean = lastBlockContent.textContent.trim() === '';
        const firstBlockStartNode: ChildNode = firstBlockContent.childNodes[0];
        const lastBlockEndNode: ChildNode = lastBlockContent.childNodes[lastBlockContent.childNodes.length - 1];

        // Selection performed using selectAll method
        if (startContainer.nodeType === Node.ELEMENT_NODE && endContainer.nodeType === Node.ELEMENT_NODE &&
            (startContainer as HTMLElement).classList.contains('e-block-container-wrapper') &&
            (endContainer as HTMLElement).classList.contains('e-block-container-wrapper')) {
            return true;
        }

        const isEqualsStartContainer: boolean = (
            firstBlockStartNode && firstBlockStartNode.contains(startContainer) ||
            isFirstBlockEmpty && firstBlockElement.contains(startContainer)
        );
        const isEqualsEndContainer: boolean = (
            lastBlockEndNode && lastBlockEndNode.contains(endContainer) ||
            isLastBlockEmpty && lastBlockElement.contains(endContainer)
        );
        return (isEqualsStartContainer &&
            isEqualsEndContainer &&
            range.startOffset === 0 &&
            range.endOffset === endContainer.textContent.length);
    }

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

    private handleEditorSelection(e: Event): void {
        const range: Range = getSelectionRange();
        if (!range) { return; }
        const isMoreThanSingleSelection: boolean = (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset);
        if (isMoreThanSingleSelection && this.element.contains(range.commonAncestorContainer)) {
            this.isEntireEditorSelected = this.checkIsEntireEditorSelected();
        }
    }

    private handleScrollActions(e: Event): void {
        this.hideFloatingIcons();
        if (this.linkModule) {
            this.linkModule.hideLinkPopup();
        }
        if (this.blockActionMenuModule) {
            this.blockActionMenuModule.toggleBlockActionPopup(true);
        }
        if (this.inlineToolbarModule) {
            this.inlineToolbarModule.hideInlineToolbar(e);
        }
    }

    private handleMouseMoveActions(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const blockElement: HTMLElement = target.closest('.e-block') as HTMLElement;
        if (this.contextMenuModule.isPopupOpen() ||
            this.blockActionMenuModule.isPopupOpen()) {
            return;
        }
        if (blockElement) {
            if (blockElement !== this.currentHoveredBlock) {
                if (this.currentHoveredBlock) {
                    this.hideFloatingIcons();
                }
                this.currentHoveredBlock = blockElement;
                this.showFloatingIcons(this.currentHoveredBlock);
            }
        }
        else if (this.currentHoveredBlock) {
            if (this.floatingIconContainer && !this.floatingIconContainer.contains(e.target as HTMLElement)) {
                this.hideFloatingIcons();
                this.currentHoveredBlock = null;
            }
        }
    }

    private handleEditorInputActions(e: Event): void {
        this.notify('input', e);
        if (this.isEntireEditorSelected) {
            const allBlocks: BlockModel[] = this.blocksInternal.map((block: BlockModel) => deepClone(sanitizeBlock(block)));

            this.setFocusToBlock(this.blockWrapper.firstElementChild as HTMLElement);
            this.showFloatingIcons(this.currentFocusedBlock);
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.blocksInternal.splice(1);
            this.blockAction.updatePropChangesToModel();
            this.isProtectedOnChange = prevOnChange;
            this.isEntireEditorSelected = false;

            this.undoRedoAction.pushToUndoStack({
                action: 'multipleBlocksDeleted',
                oldBlockModel: this.blocksInternal[0],
                data: {
                    deletedBlocks: allBlocks,
                    deletionType: DeletionType.Entire
                }
            });
        }
        if (this.inlineToolbarModule) {
            this.inlineToolbarModule.hideInlineToolbar(e);
        }
        const notAllowedTypes: string[] = ['Image'];
        const blockModel: BlockModel = getBlockModelById(this.currentFocusedBlock.id, this.blocksInternal);
        if (!blockModel || notAllowedTypes.indexOf(blockModel.type) !== -1) { return; }
        this.togglePlaceholder(this.currentFocusedBlock, true);
        this.hideDragIconForEmptyBlock(this.currentFocusedBlock);
        const blockContent: HTMLElement = getBlockContentElement(this.currentFocusedBlock);
        if (blockContent && blockContent.textContent.length <= 1) {
            this.showFloatingIcons(this.currentFocusedBlock);
        }
        this.filterSlashCommandOnUserInput();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isInputType: boolean = (e as any).inputType === 'insertText';
        /* Handling where user activates any formatting using keyboard(eg.ctrl+b) and starts typing */
        if ((this.formattingAction.activeInlineFormats && this.formattingAction.activeInlineFormats.size > 0)
            || this.formattingAction.lastRemovedFormat) {
            const isFormattingPerformed: boolean = this.formattingAction.handleTypingWithActiveFormats();
            if (isFormattingPerformed) { return; }
        }
        this.throttleContentUpdate(e);
    }

    private handleDocumentClickActions(e: MouseEvent): void {
        // hide if the click is outside the editor and floating icon container
        if (!this.element.contains(e.target as HTMLElement)
            && (this.floatingIconContainer && !this.floatingIconContainer.contains(e.target as HTMLElement))) {
            this.hideFloatingIcons();
        }
        this.isEntireEditorSelected = false;
        this.notify('documentClick', e);
        this.togglePopupsOnDocumentClick(e);
    }

    private handleEditorFocusActions(e: Event): void {
        setTimeout(() => {
            const range: Range = getSelectionRange();
            if (!range || !this.currentFocusedBlock) { return; }
            const eventArgs: FocusEventArgs = {
                event: e,
                blockId: this.currentFocusedBlock.id,
                selectionRange: [range.startOffset, range.endOffset]
            };
            this.trigger('focus', eventArgs);
        }, 200);
    }

    private handleEditorBlurActions(e: Event): void {
        const eventArgs: BlurEventArgs = {
            event: e,
            blockId: this.currentFocusedBlock.id
        };
        this.trigger('blur', eventArgs);
    }

    private handleEditorClickActions(e: MouseEvent): void {
        this.notify('editorClick', e);
    }

    private handleKeyupActions(e: KeyboardEvent): void {
        this.notify('keyup', e);
    }

    private handleKeydownActions(e: KeyboardEvent): void {
        this.previousSelection = captureSelectionState();
        this.notify('keydown', e);
        const commandPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-command-menu') as HTMLElement;
        const userMentionPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-user-menu') as HTMLElement;
        const labelMentionPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-label-menu') as HTMLElement;
        const isArrowKeys: boolean = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1;
        const isIndentingKeys: boolean = ['Tab', 'Shift'].indexOf(e.key) !== -1;
        const isControlKey: boolean = e.ctrlKey || e.metaKey;
        const isShiftKey: boolean = e.shiftKey;
        const isEscapeKey: boolean = e.key === 'Escape';
        const isLeftRightArrows: boolean = ['ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1;
        const isUpDownArrows: boolean = ['ArrowUp', 'ArrowDown'].indexOf(e.key) !== -1;
        const blockModel: BlockModel = getBlockModelById(this.currentFocusedBlock.id, this.blocksInternal);
        if (!blockModel || (isControlKey && isUpDownArrows && isShiftKey)) {
            return;
        }
        const selectedBlocks: BlockModel[] = this.getSelectedBlocks();
        const isSelectiveDeletions: boolean = this.isEntireEditorSelected || (selectedBlocks && selectedBlocks.length > 1);
        const notAllowedTypes: string[] = ['Code', 'Table', 'Image'];

        if (isEscapeKey || (!isControlKey && isArrowKeys && !isShiftKey)) {
            this.inlineToolbarModule.hideInlineToolbar(e);
        }
        else if ((isControlKey && isLeftRightArrows && isShiftKey)) {
            const inlineTbarPopup: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar-popup');
            const isInlineTbarOpen: boolean = inlineTbarPopup && inlineTbarPopup.classList.contains('e-popup-open');
            if (!isInlineTbarOpen) {
                setTimeout(() => {
                    const range: Range = getSelectionRange();
                    this.inlineToolbarModule.showInlineToolbar(range, e);
                });
            }
        }

        if (this.mentionRenderer.isPopupOpen ||
            (commandPopupElement && commandPopupElement.classList.contains('e-popup-open')) ||
            (userMentionPopupElement && userMentionPopupElement.classList.contains('e-popup-open')) ||
            (labelMentionPopupElement && labelMentionPopupElement.classList.contains('e-popup-open')) ||
            notAllowedTypes.indexOf(blockModel.type) !== -1) {
            return;
        }

        this.listBlockAction.handleListTriggerKey(e, this.currentFocusedBlock, blockModel);
        if (blockModel && isListTypeBlock(blockModel.type) && !isSelectiveDeletions) {
            this.listBlockAction.handleListKeyActions(e, this.currentFocusedBlock);
            if (!isArrowKeys && !isIndentingKeys) { return; }
        }

        this.handleBlockKeyActions(e);
    }

    private handleMouseUpActions(e: MouseEvent): void {
        if (this.readOnly) { return; }
        const blockElement: HTMLElement = (e.target as HTMLElement).closest('.e-block') as HTMLElement;
        if (blockElement && (this.currentFocusedBlock !== blockElement)) {
            this.togglePlaceholder(this.currentFocusedBlock, false);
            this.setFocusToBlock(blockElement);
            this.togglePlaceholder(this.currentFocusedBlock, true);
            this.showFloatingIcons(this.currentFocusedBlock);
        }
        setTimeout(() => {
            this.handleTextSelection(e);
        });
        this.notify('mouseup', e);
    }

    private handleMouseDownActions(e: MouseEvent): void {
        this.isEntireEditorSelected = false;
        if (this.readOnly) { return; }
        const blockElement: HTMLElement = (e.target as HTMLElement).closest('.e-block') as HTMLElement;
        if (blockElement && (this.currentFocusedBlock !== blockElement)) {
            if (blockElement.innerText.length === 0) {
                setCursorPosition(getBlockContentElement(blockElement), 0);
            }
        }
    }

    private throttleContentUpdate(e: Event): void {
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            const target: HTMLElement = this.currentFocusedBlock as HTMLElement;
            this.updateContentOnUserTyping(target, e);
        }, 100);
    }

    public updateContentOnUserTyping(blockElement: HTMLElement, e?: Event): void {
        if (!blockElement) { return; }

        const range: Range = getSelectionRange();

        const block: BlockModel = getBlockModelById(blockElement.id, this.blocksInternal);
        if (!block) { return; }

        const blockIndex: number = getBlockIndexById(block.id, this.blocksInternal);
        const previousBlock: BlockModel = deepClone(sanitizeBlock(block));
        let contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return; }

        const toggleBlock: HTMLElement = blockElement.closest('.e-toggle-block') as HTMLElement;
        if (toggleBlock) {
            const toggleHeader: HTMLElement = findClosestParent(range.startContainer, '.e-toggle-header');
            if (toggleHeader) {
                contentElement = toggleHeader.querySelector('.e-block-content');
            }
        }
        else if (block.type === 'Table') {
            contentElement = findClosestParent(range.startContainer, '.e-block-content');
        }

        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (!block.content || contentElement.childNodes.length === 0) {
            block.content = [];
        }
        let previousContent: ContentModel;
        let newContentId: string = '';
        contentElement.childNodes.forEach((node: ChildNode) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text: string = node.textContent;
                if (text) {
                    if (block.content.length === 0) {
                        block.content = [{ id: node.parentElement.id || generateUniqueId('content'), content: text }];
                        contentElement.id = newContentId = block.content[0].id;
                    } else {
                        const isAroundSpecialElement: boolean = isNodeAroundSpecialElements(node);
                        if (isAroundSpecialElement) {
                            const clonedNode: Node = node.cloneNode(true);
                            const index: number = Array.from(contentElement.childNodes).indexOf(node);
                            block.content.splice(index, 0, {
                                id: generateUniqueId('content'),
                                content: text
                            });
                            this.blockAction.triggerWholeContentUpdate(block, block.content);
                            const span: HTMLElement = wrapNodeWithTag(clonedNode, 'span');
                            span.id = newContentId = block.content[parseInt(index.toString(), 10)].id;
                            contentElement.insertBefore(span, node);
                            contentElement.removeChild(node);
                        }
                        else {
                            previousContent = block.content[0];
                            block.content[0].content = text;
                            newContentId = block.content[0].id;
                        }
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element: HTMLElement = node as HTMLElement;
                const text: string = element.innerText;
                if (element.classList.contains('e-label-chip') || element.classList.contains('e-user-chip')) {
                    return;
                }
                if (text || element.childNodes.length > 0) {
                    const existingContent: ContentModel = block.content.find((c: ContentModel) => c.id === element.id);
                    if (existingContent) {
                        previousContent = existingContent;
                        existingContent.content = text;
                        newContentId = existingContent.id;
                    } else {
                        const newId: string = newContentId = element.id || generateUniqueId('content');
                        block.content.push({ id: newId, content: text });
                        this.blockAction.triggerWholeContentUpdate(block, block.content);
                    }
                }
            }
        });
        if (block.type !== 'Code') {
            this.cleanUpStaleContents(block, contentElement);
        }
        this.isProtectedOnChange = prevOnChange;
        const clonedBlock: BlockModel = deepClone(sanitizeBlock(block));
        this.notify('contentChanged', { oldBlockModel: previousBlock, updatedBlockModel: clonedBlock });
        const eventArgs: ContentChangedEventArgs = {
            event: e,
            // user: this.getCurrentUser(),
            previousContent: previousContent,
            content: block.content.find((c: ContentModel) => c.id === newContentId)
        };
        this.trigger('contentChanged', eventArgs);
    }

    private cleanUpStaleContents(block: BlockModel, contentElement: HTMLElement): void {
        const idAttributes: string [] = ['id', 'data-label-id', 'data-user-id'];
        const domContentIds: Set<string> = new Set();

        for (const node of Array.from(contentElement.childNodes)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el: HTMLElement = node as HTMLElement;

                for (const attr of idAttributes) {
                    const value: string | null = el.getAttribute(attr);
                    if (value) {
                        domContentIds.add(value);
                    }
                }
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                const parentEl: HTMLElement = node.parentElement;
                if (parentEl) {
                    domContentIds.add(parentEl.id);
                }
            }
        }
        const currentContent: ContentModel[] = block.content.filter((c: ContentModel) => domContentIds.has(c.id));
        const contentRemoved: boolean = currentContent.length !== block.content.length;
        if (contentRemoved) {
            this.blockAction.triggerWholeContentUpdate(block, currentContent);
        }
    }

    private filterSlashCommandOnUserInput(): void {
        if (this.mentionRenderer.isPopupOpen &&
            this.currentFocusedBlock &&
            this.currentFocusedBlock.innerText &&
            this.isPopupOpenedOnAddIconClick) {
            const rect: DOMRect | ClientRect = getElementRect(this.currentFocusedBlock);
            const xOffset: number = rect.left;
            const yOffset: number = rect.top + this.currentFocusedBlock.offsetHeight;
            this.slashCommandModule.filterCommands(this.currentFocusedBlock.innerText, xOffset, yOffset);
        }
    }

    private renderBlockWrapper(): void {
        this.blockWrapper = this.createElement('div', { className: 'e-block-container-wrapper' });
        this.element.appendChild(this.blockWrapper);
        this.blockAction.createDefaultEmptyBlock();
    }

    public reRenderBlockContent(block: BlockModel): void {
        if (!block) { return; }
        const blockElement: HTMLElement = this.getBlockElementById(block.id);
        if (!blockElement) { return; }
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return; }

        contentElement.innerHTML = '';
        this.blockAction.contentRenderer.renderContent(block, contentElement);
    }

    public renderBlocks(blocks: BlockModel[]): void {
        if (blocks.length <= 0) {
            return;
        }
        let lastBlockElement: HTMLElement; // Track the last block for caret positioning

        blocks.forEach((block: BlockModel) => {
            const blockElement: HTMLElement = this.blockAction.createBlockElement(block);
            this.insertBlockIntoDOM(blockElement);
            this.togglePlaceholder(blockElement, false);
            lastBlockElement = blockElement;
            if (isListTypeBlock(block.type)) {
                this.listBlockAction.updateListItemMarkers(blockElement);
            }
        });

        if (lastBlockElement) {
            if (lastBlockElement.classList.contains('e-callout-block')) {
                lastBlockElement = lastBlockElement.querySelector('.e-callout-content').lastChild as HTMLElement;
            }
            // Wait for DOM updates and set focus and position the caret at the end
            requestAnimationFrame(() => {
                this.setFocusToBlock(lastBlockElement);
                this.togglePlaceholder(this.currentFocusedBlock, true);
                const position: number = lastBlockElement ? lastBlockElement.textContent.length : 0;
                setCursorPosition(getBlockContentElement(lastBlockElement), position);
                blocks.forEach((block: BlockModel) => {
                    if (block.type === 'CheckList') {
                        this.blockAction.listRenderer.toggleCheckedState(block, block.isChecked);
                    }
                });
            });
        }
    }

    private insertBlockIntoDOM(blockElement: HTMLElement, afterElement?: HTMLElement): void {
        if (afterElement) {
            this.blockWrapper.insertBefore(blockElement, afterElement.nextSibling);
        } else {
            this.blockWrapper.appendChild(blockElement);
        }
    }

    private initializeMentionModules(): void {
        this.slashCommandModule = new SlashCommandModule(this);
        this.initializeUserMention();
        this.initializeLabelContent();
    }

    private initializeUserMention(): void {
        const mentionDataSource: UserModel[] = (this.users).map((user: UserModel) => {
            const name: string = user.user.trim();
            const initials: string = getUserInitials(name);
            const bgColor: string = user.avatarBgColor || getAutoAvatarColor(user.id);
            const avatarUrl: string = user.avatarUrl || '';

            return {
                id: user.id,
                user: name,
                avatarUrl: avatarUrl,
                avatarBgColor: bgColor,
                initials
            };
        });

        const mentionArgs: IMentionRenderOptions = {
            element: this.blockWrapper,
            itemTemplate: '<div class="e-user-mention-item-template"><div class="em-avatar" style="background-color: ${avatarBgColor};">${if(avatarUrl)} <img src="${avatarUrl}" alt="${user}" class="em-img" /> ${else} <div class="em-initial">${initials}</div> ${/if} </div><div class="em-content"><div class="em-text">${user}</div></div></div>',
            displayTemplate: getUserMentionDisplayTemplate(),
            dataSource: mentionDataSource,
            popupWidth: '200px',
            cssClass: 'e-blockeditor-user-menu e-blockeditor-mention-menu',
            fields: { text: 'user', value: 'id' },
            change: this.handleInlineContentInsertion.bind(this),
            beforeOpen: (args: PopupEventArgs) => {
                args.cancel = this.users.length === 0;
            }
        };
        this.userMenuObj = this.mentionRenderer.renderMention(mentionArgs);
    }

    private initializeLabelContent(): void {
        let items: LabelItemModel[];
        if (this.labelSettings.labelItems.length > 0) {
            items = sanitizeLabelItems(this.labelSettings.labelItems);
        }
        else {
            items = getLabelMenuItems();
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.labelSettings.labelItems = items;
            this.isProtectedOnChange = prevOnChange;
        }

        const mentionArgs: IMentionRenderOptions = {
            element: this.blockWrapper,
            mentionChar: this.labelSettings.triggerChar,
            itemTemplate: '<div class="e-label-mention-item-template"><div class="em-avatar" style="background-color: ${labelColor};"> </div><div class="em-content"><span class="em-icon ${iconCss}"></span><div class="em-text">${text}</div></div></div>',
            displayTemplate: getLabelMentionDisplayTemplate(),
            dataSource: items,
            popupWidth: '200px',
            cssClass: 'e-blockeditor-label-menu e-blockeditor-mention-menu',
            fields: { text: 'text', value: 'id', groupBy: 'groupHeader', iconCss: 'iconCss' },
            change: this.handleInlineContentInsertion.bind(this)
        };
        this.labelMenuObj = this.mentionRenderer.renderMention(mentionArgs);
    }

    private handleInlineContentInsertion(args: MentionChangeEventArgs): void {
        args.e.preventDefault();
        args.e.stopPropagation();
        this.mentionRenderer.cleanMentionArtifacts(this.currentFocusedBlock);
        const contentType: ContentType = (args.value.toString().indexOf('e-user-mention-item-template')) > 0 ? ContentType.Mention : ContentType.Label;
        const mentionChar: string = contentType === ContentType.Mention ? '@' : this.labelSettings.triggerChar;
        this.mentionRenderer.removeMentionQueryKeysFromModel(mentionChar);
        const options: IInlineContentInsertionArgs = {
            block: getBlockModelById(this.currentFocusedBlock.id, this.blocksInternal),
            blockElement: this.currentFocusedBlock,
            range: getSelectionRange().cloneRange(),
            contentType: contentType,
            itemData: args.itemData
        };
        this.notify('inline-content-inserted', options);
    }

    public handleBlockTransformation(args: ITransformBlockArgs): void {
        const { block, blockElement, newBlockType, isUndoRedoAction } = args;
        const rangePath: RangePath = this.mentionRenderer.nodeSelection.getStoredBackupRange();
        this.mentionRenderer.cleanMentionArtifacts(blockElement, true);
        cleanCheckmarkElement(blockElement);
        this.mentionRenderer.removeMentionQueryKeysFromModel('/', args.isUndoRedoAction);
        const specialTypes: string[] = ['Divider', 'ToggleParagraph', 'ToggleHeading1', 'ToggleHeading2', 'ToggleHeading3',
            'ToggleHeading4', 'Callout', 'Table', 'Code'];
        const isClosestCallout: HTMLElement = findClosestParent(blockElement, '.e-callout-block');
        const isClosestToggle: HTMLElement = findClosestParent(blockElement, '.e-toggle-block');
        let transformedElement: HTMLElement = blockElement;
        const isSpecialType: boolean = (specialTypes.indexOf(newBlockType) > -1) || (specialTypes.indexOf(block.type) > -1);
        if (isSpecialType && ((blockElement.textContent.length > 0) || (isClosestCallout || isClosestToggle))) {
            transformedElement = this.blockAction.addNewBlock({
                targetBlock: isClosestCallout ? isClosestCallout : isClosestToggle ? isClosestToggle : blockElement,
                blockType: newBlockType
            });
        }
        else {
            this.blockAction.transformBlock({
                block: block,
                blockElement: blockElement,
                newBlockType: newBlockType,
                isUndoRedoAction: isUndoRedoAction
            });
        }
        // Add a new paragraph block after the transformed block if it is a special type block.
        if (isSpecialType && !isUndoRedoAction) {
            const contentElement: HTMLElement = this.createElement('p', {
                className: 'e-block-content',
                innerHTML: '<br>', // Added to hide placeholder initially
                attrs: {
                    contenteditable: 'true'
                }
            });
            this.blockAction.addNewBlock({
                targetBlock: transformedElement,
                blockType: 'Paragraph',
                contentElement: contentElement,
                preventUIUpdate: true
            });
        }
        const contentElement: HTMLElement = getBlockContentElement(transformedElement);
        this.togglePlaceholder(transformedElement, true);
        if (block.type === 'Callout') {
            const firstChild: HTMLElement = transformedElement.querySelector('.e-block') as HTMLElement;
            this.setFocusToBlock(firstChild);
        }
        if (rangePath && rangePath.endContainer && contentElement) {
            const offset: number = getAbsoluteOffset(contentElement, rangePath.endContainer, rangePath.endOffset);
            setCursorPosition(contentElement, offset);
        }
        const prevAdjacent: HTMLElement = getAdjacentBlock(transformedElement, 'previous');
        this.listBlockAction.recalculateMarkersForListItems();
        this.showFloatingIcons(transformedElement);
        this.blockAction.updatePropChangesToModel();
    }

    private handleTextSelection(e: Event): void {
        const range: Range = getSelectionRange();
        this.nodeSelection.updateSelectionRangeOnUserModel();
        if (!range || range.toString().trim().length === 0) {
            this.inlineToolbarModule.hideInlineToolbar(e);
            return;
        }
        const previousRange: Range = this.nodeSelection.getStoredRange();
        const selectionArgs: SelectionChangedEventArgs = {
            event: e,
            // user: this.users.find((user: UserModel) => user.id === this.currentUserId),
            range: [range.startOffset, range.endOffset],
            previousRange: previousRange ? [previousRange.startOffset, previousRange.endOffset] : null
        };
        this.trigger('selectionChanged', selectionArgs);
        this.nodeSelection.storeCurrentRange();
        const rect: DOMRect | ClientRect = range.getBoundingClientRect();

        if (range && rect) {
            const parentBlock: HTMLElement = getParentBlock(range.commonAncestorContainer as HTMLElement);
            if (parentBlock && parentBlock.classList.contains('e-block')) {
                this.inlineToolbarModule.showInlineToolbar(range, e);
            } else {
                this.inlineToolbarModule.hideInlineToolbar(e);
            }
        }
    }

    private togglePopupsOnDocumentClick(event: MouseEvent): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar-popup');
        const blockActionPopup: HTMLElement = document.querySelector('.e-blockeditor-blockaction-popup');
        const isInlineTbarOpen: boolean = inlineTbarPopup && inlineTbarPopup.classList.contains('e-popup-open');
        const isBlockActionOpen: boolean = blockActionPopup && blockActionPopup.classList.contains('e-popup-open');
        if (!this.inlineToolbarModule.popupObj.element.contains(event.target as Node) && isInlineTbarOpen) {
            this.inlineToolbarModule.hideInlineToolbar(event);
        }
        if (!this.blockActionMenuModule.popupObj.element.contains(event.target as Node) && isBlockActionOpen) {
            this.blockActionMenuModule.toggleBlockActionPopup(true, event);
        }
    }

    private createFloatingIcons(): void {
        this.floatingIconContainer = this.createElement('div', { className: 'e-floating-icons' });
        const addIcon: HTMLElement = this.createElement('span', { className: 'e-floating-icon e-icons e-block-add-icon' });
        EventHandler.add(addIcon, 'click', this.handleAddIconClick, this);
        const dragIcon: HTMLElement = this.createElement('span', { className: 'e-floating-icon e-icons e-block-drag-icon', attrs: { draggable: 'true' } });
        EventHandler.add(dragIcon, 'click', this.handleDragIconClick, this);
        this.floatingIconContainer.appendChild(addIcon);
        this.floatingIconContainer.appendChild(dragIcon);
        this.floatingIconContainer.style.position = 'absolute';
        this.floatingIconContainer.style.display = 'none';
        this.floatingIconContainer.style.pointerEvents = 'none';
        document.body.appendChild(this.floatingIconContainer);
        this.renderFloatingIconTooltips();
    }

    private renderFloatingIconTooltips(): void {
        this.addIconTooltip = this.tooltipRenderer.renderTooltip({
            element: this.floatingIconContainer,
            target: '.e-block-add-icon',
            position: 'TopCenter',
            showTipPointer: true,
            windowCollision: true,
            cssClass: 'e-be-floating-icon-tooltip',
            content: this.getTooltipContent('add')
        });

        this.dragIconTooltip = this.tooltipRenderer.renderTooltip({
            element: this.floatingIconContainer,
            target: '.e-block-drag-icon',
            position: 'TopCenter',
            showTipPointer: true,
            windowCollision: true,
            cssClass: 'e-be-floating-icon-tooltip',
            content: this.getTooltipContent('drag')
        });
    }

    private getTooltipContent(iconType: 'add' | 'drag'): HTMLElement {
        if (iconType === 'add') {
            const bold: HTMLElement = document.createElement('b');
            bold.textContent = this.l10n.getConstant('addIconTooltip');
            return bold;
        }

        const container: HTMLElement = document.createElement('div');
        container.innerHTML = `
            <b>${this.l10n.getConstant('dragIconTooltipActionMenu')}</b><br>
            <span>${this.l10n.getConstant('dragIconTooltip')}</span>
        `;
        return container;
    }

    private UpdateFloatingIconTooltipContent(): void {
        if (this.addIconTooltip) {
            this.addIconTooltip.content = this.getTooltipContent('add');
            this.addIconTooltip.dataBind();
        }
        if (this.dragIconTooltip) {
            this.dragIconTooltip.content = this.getTooltipContent('drag');
            this.dragIconTooltip.dataBind();
        }
    }

    private isFullyVisibleInEditor(blockElement: HTMLElement): boolean {
        const editorRect: DOMRect | ClientRect = this.element.getBoundingClientRect();
        const blockRect: DOMRect | ClientRect = blockElement.getBoundingClientRect();

        return (
            blockRect.top >= editorRect.top &&
            blockRect.bottom <= editorRect.bottom
        );
    }

    public showFloatingIcons(target: HTMLElement): void {
        if (this.readOnly) { return; }
        let blockElement: HTMLElement = target;
        this.hideDragIconForEmptyBlock(blockElement);
        const calloutContent: HTMLElement = blockElement.closest('.e-callout-content') as HTMLElement;
        const isToggleBlock: boolean = blockElement.classList.contains('e-toggle-block');
        if ((calloutContent && blockElement === calloutContent.firstElementChild) || !this.isFullyVisibleInEditor(blockElement)) {
            // Do not show floating icons for the first child of a callout content block
            this.hideFloatingIcons();
            return;
        }
        this.floatingIconContainer.style.display = 'flex';
        const floatingIconRect: DOMRect | ClientRect = this.floatingIconContainer.getBoundingClientRect();
        const blockType: string = blockElement.getAttribute('data-block-type').toLowerCase();

        blockElement = isToggleBlock ? blockElement.querySelector('.e-toggle-header') as HTMLElement : blockElement;
        const rect: DOMRect | ClientRect = getElementRect(blockElement);
        const styles: CSSStyleDeclaration = window.getComputedStyle(blockElement);
        const marginTop: number = parseFloat(styles.marginTop) || 0;
        const marginLeft: number = parseFloat(styles.marginLeft) || 0;
        const paddingTop: number = parseFloat(styles.paddingTop) || 0;
        const paddingLeft: number = parseFloat(styles.paddingLeft) || 0;
        const additionalOffsetsForHeadings: number = (rect.height / 2 - (floatingIconRect.height / 2));
        let topOffset: number = rect.top + window.scrollY + marginTop;
        topOffset = ((blockType === 'heading1' || blockType.endsWith('heading1'))
            || (blockType === 'heading2') || blockType.endsWith('heading2'))
            ? (topOffset + additionalOffsetsForHeadings) : (topOffset + paddingTop);
        const leftOffset: number = rect.left + window.scrollX - marginLeft;
        const adjustedLeft: number = leftOffset + paddingLeft - (floatingIconRect.width + 5);
        this.floatingIconContainer.style.top = `${topOffset}px`;
        this.floatingIconContainer.style.left = `${adjustedLeft}px`;
        this.floatingIconContainer.style.pointerEvents = 'auto';
    }

    private hideDragIconForEmptyBlock(target: HTMLElement): void {
        const dragIcon: HTMLElement = this.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.style.display = 'flex';
        const ignoredTypes: string[] = ['Code', 'Callout', 'Table', 'Divider', 'Toggle', 'Image'];
        const blockType: string = target.getAttribute('data-block-type');
        const isIgnoredtype: boolean = blockType && ignoredTypes.indexOf(blockType) !== -1;
        const contentElement: HTMLElement = getBlockContentElement(target);
        if (!isIgnoredtype && (contentElement && !contentElement.textContent)) {
            dragIcon.style.display = 'none';
        }
    }

    private hideFloatingIcons(): void {
        this.floatingIconContainer.style.display = 'none';
        this.currentHoveredBlock = null;
    }

    private handleDragIconClick(e: MouseEvent): void {
        if (!this.blockActionsMenu.enable) { return; }
        const block: HTMLElement = this.currentHoveredBlock;
        const popupElement: HTMLElement = document.querySelector('.e-blockeditor-blockaction-popup');
        const isPopupOpen: boolean = popupElement.classList.contains('e-popup-open');
        this.popupRenderer.adjustPopupPositionRelativeToTarget(block, this.blockActionMenuModule.popupObj);
        this.blockActionMenuModule.toggleBlockActionPopup(isPopupOpen, e);
    }

    private handleAddIconClick(): void {
        let block: HTMLElement = this.currentHoveredBlock;
        if ((this.currentHoveredBlock.innerText.length > 0) || (isNonContentEditableBlock(block.getAttribute('data-block-type')))) {
            block = this.blockAction.addNewBlock({
                targetBlock: this.currentHoveredBlock
            });
        }
        else {
            this.blockAction.setFocusAndUIForNewBlock(block);
        }
        if (this.slashCommandModule) {
            this.isPopupOpenedOnAddIconClick = true;
            this.slashCommandModule.showPopup();
        }
    }

    private handleBlockKeyActions(event: KeyboardEvent): void {
        const range: Range = getSelectionRange();
        const blockElement: HTMLElement = this.currentFocusedBlock;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.blocksInternal);
        const blockType: string = blockElement.getAttribute('data-block-type');
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            this.handleArrowKeyActions(event, range, blockElement);
            this.isEntireEditorSelected = false;
            break;
        case 'Enter':
            this.inlineToolbarModule.hideInlineToolbar();
            if (event.shiftKey) {
                this.handleLineBreaksOnBlock(blockElement);
                event.preventDefault();
            }
            else {
                this.handleEnterKeyAction(event);
                this.isEntireEditorSelected = false;
                event.preventDefault();
            }
            break;
        case 'Backspace': {
            this.inlineToolbarModule.hideInlineToolbar();
            const isDeletionPerformed: boolean = this.handleSelectiveDeletions(event);
            if (!isDeletionPerformed && (blockType === 'Divider' || isAtStartOfBlock(contentElement))) {
                this.blockAction.deleteBlockAtCursor({ blockElement: this.currentFocusedBlock, mergeDirection: 'previous' });
                this.isEntireEditorSelected = false;
                event.preventDefault();
            }
            break;
        }
        case 'Delete': {
            this.inlineToolbarModule.hideInlineToolbar();
            const isDeletionPerformed: boolean = this.handleSelectiveDeletions(event);
            if (!isDeletionPerformed && (blockType === 'Divider' || isAtEndOfBlock(contentElement))) {
                this.blockAction.deleteBlockAtCursor({ blockElement: this.currentFocusedBlock, mergeDirection: 'next' });
                this.isEntireEditorSelected = false;
                event.preventDefault();
            }
            break;
        }
        case 'Tab':
        case 'Shift+Tab': {
            const selectedBlocks: BlockModel[] = this.getSelectedBlocks();
            const blockIDs: string[] = selectedBlocks.map((block: BlockModel) => block.id);
            this.blockAction.handleBlockIndentation({
                blockIDs,
                shouldDecrease: event.shiftKey
            });
            this.isEntireEditorSelected = false;
            event.preventDefault();
            break;
        }
        case 'Space': {
            if (getBlockContentElement(blockElement).textContent.trim() === '') {
                // event.preventDefault();
                // focusLastNbsp(getBlockContentElement(blockElement));
            }
            break;
        }
        case 'Home':
        case 'End': {
            if (!event.shiftKey) {
                this.handleHomeEndKeyActions(event, range, blockElement);
            }
            break;
        }
        }
    }

    private handleHomeEndKeyActions(event: KeyboardEvent, range: Range, blockElement: HTMLElement): void {
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const isHomeKey: boolean = event.key === 'Home';

        setCursorPosition(contentElement, isHomeKey ? 0 : contentElement.textContent.length);
    }

    public handleSelectiveDeletions(event: KeyboardEvent): boolean {
        const selectedBlocks: BlockModel[] = this.getSelectedBlocks();
        this.isEntireEditorSelected = this.checkIsEntireEditorSelected();
        if (this.isEntireEditorSelected) {
            this.handleEntireBlockDeletion(event);
            return true;
        }
        else if (selectedBlocks && selectedBlocks.length > 1) {
            this.handleMultipleBlockDeletion(selectedBlocks, event.key === 'Backspace' ? 'previous' : 'next');
            event.preventDefault();
            return true;
        }
        return false;
    }

    private handleEntireBlockDeletion(event: KeyboardEvent): void {
        const prevFocusedBlockid: string = this.currentFocusedBlock ? this.currentFocusedBlock.id : '';
        const allBlocks: BlockModel[] = this.blocksInternal.map((block: BlockModel) => deepClone(sanitizeBlock(block)));
        this.blocksInternal = [];
        const newlyInsertedBlock: BlockModel = this.blockAction.createDefaultEmptyBlock(true);

        this.undoRedoAction.pushToUndoStack({
            action: 'multipleBlocksDeleted',
            oldBlockModel: newlyInsertedBlock,
            data: {
                deletedBlocks: allBlocks,
                deletionType: DeletionType.Entire,
                cursorBlockId: prevFocusedBlockid
            }
        });

        this.isEntireEditorSelected = false;
        event.preventDefault();
    }

    handleMultipleBlockDeletion(
        selectedBlocks: BlockModel[],
        direction: 'previous' | 'next' = 'previous',
        isUndoRedoAction?: boolean
    ): boolean {
        const prevFocusedBlockid: string = this.currentFocusedBlock ? this.currentFocusedBlock.id : '';
        const selectedClones: BlockModel[] = selectedBlocks.map((block: BlockModel) => deepClone(sanitizeBlock(block)));
        const firstBlock: BlockModel = selectedBlocks[0];
        const lastBlock: BlockModel = selectedBlocks[selectedBlocks.length - 1];
        const firstBlockElement: HTMLElement = this.getBlockElementById(firstBlock.id);
        const lastBlockElement: HTMLElement = this.getBlockElementById(lastBlock.id);
        const range: Range = getSelectionRange();

        if (!range || !firstBlockElement || !lastBlockElement) { return false; }

        // 1. Delete all middle blocks
        for (let i: number = 1; i < selectedBlocks.length - 1; i++) {
            this.blockAction.deleteBlock(
                {
                    blockElement: this.getBlockElementById(selectedBlocks[parseInt(i.toString(), 10)].id),
                    isUndoRedoAction: true
                }
            );
        }

        const firstBlockContent: HTMLElement = getBlockContentElement(firstBlockElement);
        const firstSplit: ISplitContent = this.blockAction.splitContent(firstBlockContent, range.startContainer, range.startOffset);
        this.updateAndCleanContentModels(firstBlock, firstSplit, 'keepBefore');

        const lastBlockContent: HTMLElement = getBlockContentElement(lastBlockElement);
        const lastSplit: ISplitContent = this.blockAction.splitContent(lastBlockContent, range.endContainer, range.endOffset);
        this.updateAndCleanContentModels(lastBlock, lastSplit, 'keepAfter');

        firstBlockContent.innerHTML = '';
        firstBlockContent.appendChild(firstSplit.beforeFragment);
        lastBlockContent.innerHTML = '';
        lastBlockContent.appendChild(lastSplit.afterFragment);

        this.blockAction.deleteBlockAtCursor({
            blockElement: lastBlockElement,
            mergeDirection: direction,
            isUndoRedoAction: true
        });

        if (!isUndoRedoAction) {
            this.undoRedoAction.pushToUndoStack({
                action: 'multipleBlocksDeleted',
                data: {
                    deletedBlocks: selectedClones,
                    deletionType: DeletionType.Partial,
                    direction: direction,
                    firstBlockIndex: getBlockIndexById(firstBlock.id, this.blocksInternal),
                    cursorBlockId: prevFocusedBlockid
                }
            });
        }

        return true;
    }

    private updateAndCleanContentModels(
        block: BlockModel,
        splitContent: ISplitContent,
        mode: 'keepBefore' | 'keepAfter'
    ): void {
        const newContentModels: ContentModel[] = [];
        const beforeFragmentNodes: ChildNode[] = Array.from(splitContent.beforeFragment.childNodes);
        const afterFragmentNodes: ChildNode[] = Array.from(splitContent.afterFragment.childNodes);
        const blockElement: HTMLElement = this.getBlockElementById(block.id);

        const range: Range = getSelectionRange();
        const splitNode: Node = mode === 'keepBefore' ? range.startContainer : range.endContainer;
        const splitOffset: number = mode === 'keepBefore' ? range.startOffset : range.endOffset;
        const contentElementOfSplitNode: HTMLElement = getClosestContentElementInDocument(splitNode);
        const isContentFoundInCollection: (element: Node, collection: ChildNode[]) => boolean =
            (element: Node, collection: ChildNode[]) => {
                return collection.some((node: Node) => {
                    return (node.contains(element) || node === element || (node as HTMLElement).id === (element as HTMLElement).id);
                });
            };
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        block.content.forEach((content: ContentModel) => {
            const contentEl: HTMLElement = getContentElementBasedOnId(content, blockElement);
            if (!contentEl) { return; }

            const isCurrentContentIntersectsNode: boolean = range.intersectsNode(contentEl);
            const isCurrentContentFoundInAfterNodes: boolean = isContentFoundInCollection(contentEl, afterFragmentNodes);
            if (mode === 'keepBefore' && isCurrentContentFoundInAfterNodes && isCurrentContentIntersectsNode) {
                return;
            }
            if (contentEl === contentElementOfSplitNode) {
                content.content = mode === 'keepBefore'
                    ? splitNode.textContent.substring(0, splitOffset) || ''
                    : splitNode.textContent.substring(splitOffset) || '';
            }
            const isCurrentContentFoundInBeforeNodes: boolean = isContentFoundInCollection(contentEl, beforeFragmentNodes);
            if (mode === 'keepAfter' && isCurrentContentFoundInBeforeNodes && isCurrentContentIntersectsNode) {
                return;
            }
            if (content.content.trim()) {
                newContentModels.push(content);
            }
        });
        block.content = newContentModels;
        this.isProtectedOnChange = prevOnChange;
    }

    private handleEnterKeyAction(event: KeyboardEvent): void {
        const blockType: string = this.currentFocusedBlock.getAttribute('data-block-type');
        const calloutBlock: HTMLElement = this.currentFocusedBlock.closest('.e-callout-block') as HTMLElement;
        const toggleBlock: HTMLElement = this.currentFocusedBlock.closest('.e-toggle-block') as HTMLElement;
        if (calloutBlock) {
            this.handleChildrenBlockExit('.e-callout-block', '.e-callout-content');
        }
        else if (toggleBlock) {
            const range: Range = getSelectionRange();
            const blockModel: BlockModel = getBlockModelById(toggleBlock.id, this.blocksInternal);
            const toggleHeader: HTMLElement = findClosestParent(range.startContainer, '.e-toggle-header');
            const toggleContent: HTMLElement = toggleBlock.querySelector('.e-toggle-content');
            if (toggleContent && toggleHeader && toggleContent.textContent === '') {
                this.blockAction.toggleRenderer.updateToggleBlockExpansion(this.currentFocusedBlock, !blockModel.isExpanded);
                setCursorPosition(toggleContent.querySelector('.e-block-content'), 0);
                this.setFocusToBlock(this.currentFocusedBlock.querySelector('.e-block'));
                return;
            }
            this.handleChildrenBlockExit('.e-toggle-block', '.e-toggle-content');
        }
        const isEmpty: boolean = this.currentFocusedBlock.textContent.trim() === '';
        const blockModel: BlockModel = getBlockModelById(this.currentFocusedBlock.id, this.blocksInternal);
        if (isEmpty && blockModel.indent > 0) {
            blockModel.indent--;
            this.blockAction.updateBlockIndentAttribute(this.currentFocusedBlock, blockModel.indent);
            this.showFloatingIcons(this.currentFocusedBlock);
            this.blockAction.updatePropChangesToModel();
        }
        else if (blockType !== BlockType.Code) {
            this.splitAndCreateNewBlockAtCursor();
        }
    }

    private handleLineBreaksOnBlock(blockElement: HTMLElement, isUndoRedoAction?: boolean): void {
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.blocksInternal);
        const oldContentClone: ContentModel[] = deepClone(sanitizeContent(blockModel.content));
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const range: Range = getSelectionRange();
        if (!range) { return; }
        const absoluteOffset: number = getAbsoluteOffset(contentElement, range.startContainer, range.startOffset);
        // Find the affected content in range
        const closestContentElement: HTMLElement = getClosestContentElementInDocument(range.startContainer);
        const contentModel: ContentModel = blockModel.content.find((content: ContentModel) => {
            return content.id === closestContentElement.id;
        });
        if (!contentModel) { return; }

        // Update the \n at correct place in the content model
        contentModel.content = contentModel.content.substring(0, range.startOffset) + '\n' + contentModel.content.substring(range.startOffset);
        this.reRenderBlockContent(blockModel);
        setCursorPosition(contentElement, absoluteOffset + 1);
        const newContentClone: ContentModel[] = deepClone(sanitizeContent(blockModel.content));
        if (!isUndoRedoAction) {
            this.undoRedoAction.pushToUndoStack({
                action: 'lineBreakAdded',
                oldContents: oldContentClone,
                newContents: newContentClone,
                data: {
                    blockId: blockModel.id
                }
            });
        }
    }

    private handleChildrenBlockExit(parentSelector: string, contentSelector: string, deleteDirection: 'previous' | 'next' = 'previous'): boolean {
        const parentBlock: HTMLElement = (this.currentFocusedBlock.closest(parentSelector) as HTMLElement);
        const contentElement: HTMLElement = parentBlock ? parentBlock.querySelector(contentSelector) : null;
        if (parentBlock && contentElement &&
            (this.currentFocusedBlock.textContent.trim() === '') &&
            (contentElement.lastElementChild === this.currentFocusedBlock)) {
            this.blockAction.deleteBlockAtCursor({ blockElement: this.currentFocusedBlock, mergeDirection: deleteDirection });
            this.currentFocusedBlock = parentBlock;
            return true;
        }
        return false;
    }

    private handleArrowKeyActions(event: KeyboardEvent, range: Range, blockElement: HTMLElement): void {
        const blockContentLength: number = blockElement.textContent.length;
        const key: string = event.key;
        const isUp: boolean = key === 'ArrowUp';
        const isDown: boolean = key === 'ArrowDown';
        const isLeft: boolean = key === 'ArrowLeft';
        const isRight: boolean = key === 'ArrowRight';
        const isAtStart: boolean = range.startOffset === 0 && range.endOffset === 0;
        const isAtEnd: boolean = range.startOffset === blockContentLength && range.endOffset === blockContentLength;
        const adjacentBlock: HTMLElement = getAdjacentBlock(blockElement, (isUp || isLeft) ? 'previous' : 'next');
        if (!adjacentBlock) { return; }
        const isAdjacentEmpty: boolean = adjacentBlock.textContent.length === 0;
        //Only prevent default behaviour when cursor at the ends, otherwise let the browser's default behaviour take over
        const isMovingAdjacentBlock: boolean = (isAtStart && (isLeft)) || (isAtEnd && (isRight)) || ((isUp || isDown) && isAdjacentEmpty);
        if (isMovingAdjacentBlock) {
            event.preventDefault();
            this.moveCursorToAdjacentBlock(adjacentBlock, key);
        }
        else {
            setTimeout(() => {
                if (!isMovingAdjacentBlock) {
                    const range: Range = getSelectionRange();
                    const currentBlock: HTMLElement = (range.startContainer.parentElement.closest('.e-block') as HTMLElement);
                    if (currentBlock !== this.currentFocusedBlock) {
                        this.togglePlaceholder(this.currentFocusedBlock, false);
                        this.setFocusToBlock(currentBlock);
                        this.showFloatingIcons(this.currentFocusedBlock);
                    }
                }
            });
        }
    }

    private moveCursorToAdjacentBlock(adjacentBlock: HTMLElement, key: string): void {
        const isMovingLeft: boolean = key === 'ArrowLeft';
        const targetPosition: number = isMovingLeft ? adjacentBlock.textContent.length : 0;
        this.togglePlaceholder(this.currentFocusedBlock, false);
        this.setFocusToBlock(adjacentBlock);
        setCursorPosition(getBlockContentElement(adjacentBlock), targetPosition);
        this.togglePlaceholder(this.currentFocusedBlock, true);
        this.showFloatingIcons(this.currentFocusedBlock);
    }

    public splitAndCreateNewBlockAtCursor(args?: IAddBlockArgs): void {
        const blockElement: HTMLElement = (args && args.isUndoRedoAction) ? args.targetBlock : this.currentFocusedBlock;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.blocksInternal);
        const contentElement: HTMLElement = getBlockContentElement(blockElement);

        // Split the block at the cursor position and get the before and after fragments
        const splitContent: ISplitContent = this.blockAction.splitBlockAtCursor(blockElement, args);
        const isTextNode: boolean =
            isNOU(splitContent.beforeFragment.lastChild) ||
            (splitContent.beforeFragment.lastChild.nodeType === Node.TEXT_NODE);
        //Track beforeFragment's last child for new content model creation
        const lastChild: HTMLElement = isTextNode ? contentElement : splitContent.beforeFragment.lastChild as HTMLElement;

        //Update the current block with the before fragment content
        contentElement.innerHTML = '';
        if (splitContent.beforeFragment.textContent !== '') {
            contentElement.appendChild(splitContent.beforeFragment);
        }
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (blockModel.type === BlockType.Template) {
            const newHtmlContent: string = contentElement.innerHTML;
            blockModel.template = newHtmlContent;
        }
        //Before clearing current block model, store the after block content to create new block with it
        const afterBlockContents: ContentModel[] = this.getContentModelForFragment(
            splitContent.afterFragment,
            blockModel,
            lastChild
        );
        this.isProtectedOnChange = prevOnChange;
        this.blockAction.updateContentChangesToModel(blockElement, contentElement);
        const curBlockType: string = blockModel.type;
        const isListType: boolean = isListTypeBlock(curBlockType);
        //Create a new block with the after fragment content and insert it after the current block
        if (isNOU(args)) {
            this.blockAction.addNewBlock({
                blockType: isListType ? curBlockType : BlockType.Paragraph,
                targetBlock: blockElement,
                contentElement: splitContent.afterFragment,
                contentModel: afterBlockContents,
                splitOffset: splitContent.splitOffset,
                lastChild: lastChild
            });
        }
        else if (args.isUndoRedoAction) {
            this.blockAction.addNewBlock({
                targetBlock: args.targetBlock,
                blockType: args.blockType,
                blockID: args.blockID,
                contentModel: args.contentModel,
                isUndoRedoAction: args.isUndoRedoAction,
                contentElement: args.contentElement
            });
        }
    }

    public getContentModelForFragment(
        fragment: DocumentFragment,
        blockModel: BlockModel,
        referenceNode: Node
    ): ContentModel[] {
        const newContents: ContentModel[] = [];
        fragment.childNodes.forEach((node: Node) => {
            if (node.nodeType === Node.ELEMENT_NODE && (node instanceof HTMLElement)) {
                const content: ContentModel = blockModel.content.find((content: ContentModel) => content.id === node.id);
                if (content) {
                    content.content = node.textContent;
                    newContents.push(content);
                }
                else {
                    /*
                    On Enter in middle of a formatted element, we clone the previous model,
                    and reuse it to preserve formatting (e.g., split '<strong>Hello</strong>' into 'He' and 'llo').
                    */
                    const previousContent: ContentModel = blockModel.content.find((content: ContentModel) => {
                        return content.id === (referenceNode as HTMLElement).id;
                    });
                    const [sanitizedContent]: ContentModel[] = sanitizeContent([previousContent]);
                    const newContent: ContentModel = deepClone(sanitizedContent) as ContentModel;
                    newContent.id = node.id;
                    newContent.content = node.textContent;
                    newContents.push(newContent);
                }
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                newContents.push({ id: generateUniqueId('content'), content: node.textContent });
            }
        });
        return newContents;
    }

    public setFocusToBlock(block: HTMLElement): void {
        if (block) {
            block.focus();
            this.currentFocusedBlock = block;
        }
    }

    public togglePlaceholder(blockElement: HTMLElement, isFocused: boolean): void {
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.blocksInternal);
        if (!blockModel) { return; }
        const blockType: string = blockElement.getAttribute('data-block-type') || 'Paragraph';
        const placeholderValue: string = this.getPlaceholderValue(blockType, blockModel.placeholder);
        const contentEle: HTMLElement = getBlockContentElement(blockElement);
        const isEmptyContent: boolean = isElementEmpty(contentEle);
        contentEle.setAttribute('placeholder', isEmptyContent && isFocused ? placeholderValue : '');
        if (isEmptyContent && blockType !== 'Code') {
            clearBreakTags(contentEle);
        }
    }

    public renderTemplate(block: BlockModel, templateElement: HTMLElement): void {
        const templateName: string = block.id + 'template';
        this.clearTemplate([templateName]);
        const templateFunction: Function = getTemplateFunction(block.template);
        append(templateFunction({}, this, templateName, 'template', this.isStringTemplate), templateElement);
        this.renderReactTemplates();
    }

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
     * @param {BlockType | string} blockType - The type of the block.
     * @param {string} blockPlaceholder - The placeholder value for the block.
     * @returns {string} The placeholder value for the given block type.
     * @hidden
     */
    public getPlaceholderValue(blockType: BlockType | string, blockPlaceholder: string): string {
        if (blockPlaceholder && blockPlaceholder !== '') { return blockPlaceholder; }
        const constant: string = blockType.charAt(0).toLowerCase() + blockType.slice(1);
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

    public getBlockElementById(blockId: string): HTMLElement | null {
        return this.blockWrapper.querySelector(`#${blockId}`);
    }

    private clipboardActionHandler(e: KeyboardEvent): void {
        let isActionExecuted: boolean = false;
        const prop: string = e.type.toLowerCase();
        switch (prop) {
        case 'cut':
            this.notify(events.cut, e);
            isActionExecuted = true;
            break;
        case 'copy':
            this.notify(events.copy, e);
            isActionExecuted = true;
            break;
        case 'paste':
            this.notify(events.paste, e);
            isActionExecuted = true;
            break;
        }
        if (isActionExecuted && this.keyActionExecuted) {
            const normalizedKey: string = prop === 'cut' ? 'ctrl+x' : prop === 'copy' ? 'ctrl+c' : 'ctrl+v';
            this.trigger('keyActionExecuted', {
                keyCombination: normalizedKey, action: prop
            });
        }
    }

    public getCurrentFocusedBlockModel(): BlockModel {
        if (!this.currentFocusedBlock) { return null; }
        return getBlockModelById(this.currentFocusedBlock.id, this.blocksInternal);
    }

    private unWireGlobalEvents(): void {
        EventHandler.remove(document, 'selectionchange', this.handleEditorSelection);
        EventHandler.remove(document, 'scroll', this.handleScrollActions);
        EventHandler.remove(this.element, 'scroll', this.handleScrollActions);
        EventHandler.remove(document, 'click', this.handleDocumentClickActions);
        EventHandler.remove(document, 'mousemove', this.handleMouseMoveActions);
        EventHandler.remove(this.element, 'mouseup', this.handleMouseUpActions);
        EventHandler.remove(this.element, 'mousedown', this.handleMouseDownActions);
        EventHandler.remove(this.element, 'input', this.handleEditorInputActions);
        EventHandler.remove(this.element, 'keydown', this.handleKeydownActions);
        EventHandler.remove(this.element, 'click', this.handleEditorClickActions);
        EventHandler.remove(this.element, 'copy', this.clipboardActionHandler);
        EventHandler.remove(this.element, 'cut', this.clipboardActionHandler);
        EventHandler.remove(this.element, 'paste', this.clipboardActionHandler);
        EventHandler.remove(this.blockWrapper, 'focus', this.handleEditorFocusActions);
        EventHandler.remove(this.blockWrapper, 'blur', this.handleEditorBlurActions);
        EventHandler.remove((this.floatingIconContainer.firstChild as HTMLElement), 'click', this.handleAddIconClick);
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

    private destroyFloatingIconTooltips(): void {
        if (this.addIconTooltip) {
            this.tooltipRenderer.destroyTooltip(this.addIconTooltip);
            this.addIconTooltip = null;
        }
        if (this.dragIconTooltip) {
            this.tooltipRenderer.destroyTooltip(this.dragIconTooltip);
            this.dragIconTooltip = null;
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
        this.unWireGlobalEvents();
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

        this.blockAction = null;
        this.formattingAction = null;
        this.listBlockAction = null;
        this.blockEditorMethods = null;

        this.blocksInternal = null;
        this.keyCommandMap = null;
        this.defaultKeyConfig = null;
        this.l10n = null;

        if (this.userMenuObj) {
            this.userMenuObj.destroy();
        }
        if (this.labelMenuObj) {
            this.labelMenuObj.destroy();
        }
        this.destroyFloatingIconTooltips();
        this.blockAction = null;
        this.dragAndDropAction = null;
        this.undoRedoAction = null;
        this.updateTimer = null;
        this.blocksInternal = null;
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
                this.updateEditorReadyOnlyState();
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
                this.blockAction.handleBlockPropertyChanges({ newProp: newProp, oldProp: oldProp });
                break;
            }
        }
    }
    /* eslint-enable */
}
