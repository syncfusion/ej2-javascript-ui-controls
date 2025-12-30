import { Observer, extend, isNullOrUndefined as isNOU, remove } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { events } from '../../common/constant';
import * as constants from '../../common/constant';
import { BlockCommand } from '../plugins/block/block-command';
import { BlockFactory, BlockService, EventService, TableService } from '../services/index';
import { IBlockSelectionState } from '../../common/interface';
import { BlockActionMenuSettingsModel, BlockModel, CommandMenuSettingsModel, ContextMenuSettingsModel, IHeadingBlockSettings, ImageBlockSettingsModel, CodeBlockSettingsModel, InlineToolbarSettingsModel, LabelSettingsModel, PasteCleanupSettingsModel, TableCellModel, UserModel, BasePlaceholderProp } from '../../models/index';
import { StateManager } from '../services/state-manager';
import { CommandOptions } from './interface';
import { NodeSelection } from '../../selection/selection';
import { PopupRenderer } from '../renderer/common/popup-renderer';
import { BlockActionMenuModule, ContextMenuModule, SlashCommandModule } from '../plugins/menus/index';
import { FloatingIcon } from '../actions/floating-icon';
import { decode, encode, findCellById, getBlockContentElement, getBlockModelById, isAlwaysOnPlaceHolderBlk, sanitizeHelper, setCursorPosition } from '../../common/utils/index';
import { BlockType } from '../../models/enums';
import { clearBreakTags, findClosestParent, isElementEmpty } from '../../common/utils/dom';
import { ListPlugin } from '../plugins/block/list';
import { UndoRedoAction } from '../actions/undo';
import { BlockEditorMethods } from '../actions/methods';
import { FormattingAction } from '../actions/formatting';
import { LinkModule } from '../plugins/inline/link';
import { InlineContentInsertionModule } from '../plugins/inline/inline-content';
import { ClipboardAction } from '../actions/clipboard';
import { MentionAction } from '../actions/mention';
import { DragAndDropAction } from '../actions/drag';
import { InlineToolbarModule } from '../actions/inline-toolbar';
import { EventAction } from '../actions/event';
import { BlockRenderer } from '../plugins/block/block-renderer';
import { BlockEditor } from '../../blockeditor/base/blockeditor';
import { TableSelectionManager } from '../plugins/table/selection-manager';

export class BlockManager {

    public observer: Observer;
    public currentFocusedBlock: HTMLElement;
    public currentHoveredBlock: HTMLElement;
    public isEntireEditorSelected: boolean;
    public previousSelection: IBlockSelectionState;
    /**
     * Provides the Scrollable parent element from the Root element.
     *
     * @hidden
     *
     */
    public scrollParentElements: HTMLElement[];

    public inlineContentInsertionModule: InlineContentInsertionModule;
    public slashCommandModule: SlashCommandModule;
    public inlineToolbarModule: InlineToolbarModule;
    public contextMenuModule: ContextMenuModule;
    public blockActionMenuModule: BlockActionMenuModule;
    public linkModule: LinkModule;

    public eventAction: EventAction;
    public floatingIconAction: FloatingIcon;
    public undoRedoAction: UndoRedoAction;
    public formattingAction: FormattingAction;
    public clipboardAction: ClipboardAction;
    public dragAndDropAction: DragAndDropAction;
    public mentionAction: MentionAction;
    public editorMethods: BlockEditorMethods;

    public nodeSelection: NodeSelection;

    public blockService: BlockService;
    public eventService: EventService;

    public tableService: TableService;
    public tableSelectionManager: TableSelectionManager;

    public blockCommand: BlockCommand;
    public blockRenderer: BlockRenderer;
    public listPlugin: ListPlugin;
    public stateManager: StateManager;
    public popupRenderer: PopupRenderer;

    /* Editor props */
    public rootEditorElement: HTMLElement;
    public blockContainer: HTMLElement;
    public blocks: BlockModel[];
    public readOnly: boolean;
    public undoRedoStack: number;
    public pasteCleanupSettings: PasteCleanupSettingsModel;
    public imageBlockSettings: ImageBlockSettingsModel;
    public codeBlockSettings: CodeBlockSettingsModel;
    public labelSettings: LabelSettingsModel;
    private enableHtmlEncode: boolean;
    private enableHtmlSanitizer: boolean;
    public enableDragAndDrop: boolean;
    public blockActionMenuSettings: BlockActionMenuSettingsModel;
    public contextMenuSettings: ContextMenuSettingsModel;
    public commandMenuSettings: CommandMenuSettingsModel;
    public inlineToolbarSettings: InlineToolbarSettingsModel;
    public keyConfig: { [key: string]: string };
    public users: UserModel[];

    public isPopupOpenedOnAddIconClick: boolean;
    public updateTimer: ReturnType<typeof setTimeout>;
    public keyCommandMap: Map<string, string>;
    private defaultKeyConfig: Record<string, string> = {
        bold: 'ctrl+b',
        italic: 'ctrl+i',
        underline: 'ctrl+u',
        strikethrough: 'ctrl+shift+x',
        link: 'ctrl+k',
        print: 'ctrl+p'
    };
    public localeJson: Record<string, string>;

    constructor() {
        this.observer = new Observer(this);
    }

    public updateContext(BlockEditorObj: { [key: string]: Object }): void {
        extend(this, this, BlockEditorObj);
    }

    public initialize(): void {
        /* Populate all block level properties which are not provided on application end */
        const populatedBlocks: BlockModel[] = BlockFactory.populateBlockProperties(this.blocks);
        this.blocks = populatedBlocks.slice();
        this.observer.notify('updateEditorBlocks', { blocks: this.blocks });

        this.blockCommand = new BlockCommand(this);
        this.stateManager = new StateManager(this);
        this.blockService = new BlockService(this.blocks);
        this.eventService = new EventService(this);
        this.tableService = new TableService(this);
        this.tableSelectionManager = new TableSelectionManager(this);
        this.blockCommand.createDefaultEmptyBlock();
        this.blockRenderer = new BlockRenderer(this);
        this.listPlugin = new ListPlugin(this);
        this.nodeSelection = new NodeSelection(this.blockContainer);

        this.popupRenderer = new PopupRenderer(this);

        this.eventAction = new EventAction(this);
        this.floatingIconAction = new FloatingIcon(this);
        this.undoRedoAction = new UndoRedoAction(this);
        this.formattingAction = new FormattingAction(this);
        this.clipboardAction = new ClipboardAction(this);
        this.dragAndDropAction = new DragAndDropAction(this);
        this.mentionAction = new MentionAction(this);
        this.editorMethods = new BlockEditorMethods(this);

        this.inlineContentInsertionModule = new InlineContentInsertionModule(this);
        this.linkModule = new LinkModule(this);
        this.inlineToolbarModule = new InlineToolbarModule(this);
        this.blockActionMenuModule = new BlockActionMenuModule(this);
        this.contextMenuModule = new ContextMenuModule(this);
        this.slashCommandModule = new SlashCommandModule(this);

        this.scrollParentElements = getScrollableParent(this.rootEditorElement);
        this.wireEvents();
        this.initializeKeyBindings();
    }

    private wireEvents(): void {
        this.observer.on(events.destroy, this.destroy, this);
    }

    private unwireEvents(): void {
        this.observer.off(events.destroy, this.destroy);
    }

    /**
     * Initializes the key bindings
     *
     * @returns {void}
     */
    public initializeKeyBindings(): void {
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

    public execCommand(options: CommandOptions): void {
        switch (options.command) {
        case 'AddBlock':
            this.observer.notify(constants.ADDBLOCK, options.state);
            break;
        case 'SplitBlock':
            this.observer.notify(constants.SPLITBLOCK, options.state);
            break;
        case 'DeleteBlock':
            this.observer.notify(constants.DELETEBLOCK, options.state);
            break;
        case 'DeleteAtCursor':
            this.observer.notify(constants.DELETEATCURSOR, options.state);
            break;
        case 'DuplicateBlock':
            this.observer.notify(constants.DUPLICATEBLOCK, options.state);
            break;
        case 'IndentBlock':
            this.observer.notify(constants.INDENTBLOCK, options.state);
            break;
        case 'MoveBlock':
            this.observer.notify(constants.MOVEBLOCK, options.state);
            break;
        case 'FormattingAction':
            this.observer.notify(constants.FORMATTINGACTION, options.state);
            break;
        case 'DeleteNonMergableBlock':
            this.observer.notify(constants.DELETE_NON_MERGABLEBLOCK, options.state);
            break;
        }
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
        return this.blockContainer.querySelector(`#${blockId}`);
    }

    /**
     * Adjusts the view to focus on the current block
     *
     * @returns {void}
     * @hidden
     */
    public adjustViewForFocusedBlock(): void {
        if (!this.currentFocusedBlock) { return; }

        const editorBlocks: BlockModel[] = this.getEditorBlocks();
        const lastBlock: BlockModel = editorBlocks[editorBlocks.length - 1];
        const containerRect: DOMRect = this.rootEditorElement.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = this.currentFocusedBlock.getBoundingClientRect() as DOMRect;

        if (lastBlock && lastBlock.id === this.currentFocusedBlock.id) {
            this.rootEditorElement.scrollTo({ top: this.rootEditorElement.scrollHeight });
        } else if (blockRect.bottom > containerRect.bottom) {
            this.rootEditorElement.scrollTop += blockRect.bottom - containerRect.bottom;
        }
    }

    /**
     * Sets the focus and UI for a new block
     *
     * @param {HTMLElement} blockElement The block element to focus
     * @returns {void}
     * @hidden
     */
    public setFocusAndUIForNewBlock(blockElement: HTMLElement): void {
        this.togglePlaceholder(this.currentFocusedBlock, false);
        this.setFocusToBlock(blockElement);
        setCursorPosition(getBlockContentElement(blockElement), 0);
        this.togglePlaceholder(this.currentFocusedBlock, true);
        this.floatingIconAction.showFloatingIcons(this.currentFocusedBlock);
    }

    /**
     * Removes the focus and UI for the given block
     *
     * @param {HTMLElement} blockElement The block element to remove focus
     * @returns {void}
     * @hidden
     */
    public removeFocusAndUIForBlock(blockElement: HTMLElement): void {
        this.togglePlaceholder(blockElement, false);
        this.currentFocusedBlock = null;
        this.floatingIconAction.hideFloatingIcons();
    }

    /**
     * Gets the placeholder value for the given block element.
     *
     * @param {BlockModel} block The block model to get placeholder for.
     * @returns {string} The placeholder value for the given block type.
     * @hidden
     */
    public getPlaceholderValue(block: BlockModel): string {
        const props: IHeadingBlockSettings = block.properties as IHeadingBlockSettings;
        const tableCell: TableCellModel = findCellById(block.parentId, this.getEditorBlocks());
        if (tableCell || (props && props.placeholder && props.placeholder !== '')) { return props.placeholder; }
        let constant: string = block.blockType.charAt(0).toLowerCase() + block.blockType.slice(1);
        if (block.blockType.endsWith(BlockType.Heading) && props && props.level) {
            constant += props.level.toString();
        }
        return this.localeJson[(constant as string)];
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
        const isTableBlock: HTMLElement = blockElement && findClosestParent(blockElement, `.${constants.TABLE_BLOCK_CLS}`);
        const isCalloutBlock: HTMLElement = blockElement && findClosestParent(blockElement, `.${constants.CALLOUT_BLOCK_CLS}`);
        const isCalloutHasOneChild: boolean = isCalloutBlock && isCalloutBlock.querySelectorAll(`.${constants.BLOCK_CLS}`).length === 1;
        const isAlwaysOnBlock: boolean = blockModel && isAlwaysOnPlaceHolderBlk(blockModel.blockType);
        const tableCriteria: boolean = (isTableBlock &&
            ((blockModel && !((blockModel.properties as BasePlaceholderProp).placeholder)) || !isFocused));
        const isNullPlaceholder: boolean = (blockModel && (blockModel && !('placeholder' in blockModel.properties)));
        if (!blockModel || isNullPlaceholder || tableCriteria || (isAlwaysOnBlock && !isFocused) || (isCalloutHasOneChild && !isFocused)) {
            return;
        }
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
     * Removes all placeholder attributes from block contents
     * and refreshes the placeholder for the current focused block
     *
     * @returns {void}
     * @hidden
     */
    public refreshPlaceholder(): void {
        this.rootEditorElement.querySelectorAll('.' + constants.CONTENT_CLS).forEach((el: HTMLElement) => {
            const blockEle: HTMLElement = el.closest(`.${constants.BLOCK_CLS}`) as HTMLElement;
            this.togglePlaceholder(blockEle, false);
        });
        if (this.currentFocusedBlock) {
            this.togglePlaceholder(this.currentFocusedBlock, true);
        }
    }

    /**
     * Sets the cursor position after adding a bulk block (Clipboard paste)
     *
     * @param {string} insertionType - The type of insertion (blocks or text)
     * @returns {void}
     * @hidden
     */
    public setCursorAfterBulkBlockAddition(insertionType: string): void {
        let cursorElement: HTMLElement = this.currentFocusedBlock;
        let cursorpos: number = cursorElement.textContent.length;

        if (insertionType === 'blocks') {
            cursorElement = (cursorElement.nextElementSibling || cursorElement) as HTMLElement;
            cursorpos = 0;
            this.togglePlaceholder(this.currentFocusedBlock, false);
            this.togglePlaceholder(cursorElement, true);
        }

        this.setFocusToBlock(cursorElement);
        setCursorPosition(getBlockContentElement(cursorElement), cursorpos);
    }

    /**
     * Updates focus and cursor position
     *
     * @param {HTMLElement} blockElement The block element to split
     * @returns {void}
     * @hidden
     */
    public updateFocusAndCursor(blockElement: HTMLElement): void {
        if (blockElement) {
            const content: HTMLElement = getBlockContentElement(blockElement);
            this.setFocusToBlock(blockElement);
            setCursorPosition(content, 0);
            this.floatingIconAction.showFloatingIcons(blockElement);
        }
    }

    /**
     * Serializes the given value for HTML encoding and sanitization
     *
     * @param {string} value The value to serialize
     * @returns {string} The serialized value
     * @hidden
     */
    public serializeValue(value: string): string {
        if (!isNOU(value) && value.trim() !== '') {
            if (this.enableHtmlEncode) {
                value = sanitizeHelper(decode(value), this.enableHtmlSanitizer);
                value = encode(value);
            } else {
                value = sanitizeHelper(value, this.enableHtmlSanitizer);
            }
        }
        return value;
    }

    public removeAndNullify(element: HTMLElement): void {
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
            'currentHoveredBlock',
            'currentFocusedBlock',
            'blockContainer'
        ];

        for (const prop of properties) {
            const element: keyof BlockEditor = prop as keyof BlockEditor;
            this.removeAndNullify(this[element as keyof BlockManager] as HTMLElement);
            (this[element as keyof BlockManager] as HTMLElement) = null;
        }
    }

    public destroy(): void {
        this.scrollParentElements = [];
        this.unwireEvents();
        if (!isNOU(this.updateTimer)) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }

        this.popupRenderer = null;

        this.inlineToolbarModule = null;
        this.inlineContentInsertionModule = null;
        this.slashCommandModule = null;
        this.contextMenuModule = null;
        this.blockActionMenuModule = null;
        this.linkModule = null;
        this.nodeSelection = null;

        this.popupRenderer = null;

        this.eventAction = null;
        this.formattingAction = null;
        this.listPlugin = null;
        this.editorMethods = null;
        this.mentionAction = null;

        this.stateManager = null;
        this.blockService = null;
        this.eventService = null;
        this.blockCommand = null;
        this.blockRenderer = null;
        this.tableService = null;
        this.tableSelectionManager = null;

        this.keyCommandMap = null;
        this.defaultKeyConfig = null;
        this.dragAndDropAction = null;
        this.undoRedoAction = null;
        this.updateTimer = null;
        this.destroyBlockEditor();
    }
}
