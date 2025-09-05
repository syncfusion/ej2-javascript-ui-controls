import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FilteringEventArgs, Mention, MentionChangeEventArgs, PopupEventArgs, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { BlockModel, CommandItemModel, CommandMenuSettingsModel, HeadingProps } from '../models/index';
import { getBlockModelById } from '../utils/block';
import { IMentionRenderOptions} from '../base/interface';
import { getCommandMenuItems } from '../utils/data';
import { BlockEditor } from '../base/blockeditor';
import { CommandItemClickedEventArgs, CommandMenuCloseEventArgs, CommandMenuOpenEventArgs, CommandQueryFilteringEventArgs } from '../base/eventargs';
import { BlockEditorModel, BlockType } from '../base/index';
import { events } from '../base/constant';
import { getNormalizedKey } from '../utils/common';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { sanitizeCommandMenuItems } from '../utils/transform';
import * as constants from '../base/constant';

/**
 * `SlashCommandModule` module is used to handle the slash command actions in the BlockEditor.
 *
 * @hidden
 */
export class SlashCommandModule {
    private editor: BlockEditor;
    public mentionObj: Mention;
    private isPopupOpened: boolean = false;
    private slashMenuTooltip: Tooltip;
    private shortcutMap: Map<string, CommandItemModel> = new Map();
    private static readonly MAX_FILTER_TEXT_LENGTH: number = 6;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.init();
        this.buildShortcutMap();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.keydown, this.onKeyDown, this);
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.keydown, this.onKeyDown);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockWrapper,
            mentionChar: '/',
            dataSource: this.getCommandItems(),
            cssClass: 'e-blockeditor-command-menu e-blockeditor-mention-menu',
            highlight: true,
            fields: { text: 'label', value: 'label', iconCss: 'iconCss', groupBy: 'groupHeader', disabled: 'disabled' },
            itemTemplate: '<div class="e-command-mention-item-template" title="${tooltip}"><div class="e-command-icon-info"><span class="e-command-icon ${iconCss}"></span></div><div class="e-command-item-info"><div class="e-command-title">${label}</div>${if(shortcut)}<div class="e-command-shortcut">${shortcut}</div>${/if}</div></div>',
            displayTemplate: '',
            popupWidth: this.editor.commandMenu.popupWidth,
            popupHeight: this.editor.commandMenu.popupHeight,
            change: this.handleSlashCommandChange.bind(this),
            beforeOpen: this.handleSlashCommandBeforeOpen.bind(this),
            opened: this.handleSlashCommandOpened.bind(this),
            beforeClose: this.handleSlashCommandBeforeClose.bind(this),
            select: this.handleSlashCommandSelect.bind(this),
            filtering: this.handleSlashCommandFiltering.bind(this)
        };

        this.mentionObj = this.editor.mentionRenderer.renderMention(mentionArgs);
    }

    private getCommandItems(): CommandItemModel[] {
        const slashMenuOptions: CommandItemModel[] = this.editor.commandMenu.commands.length > 0
            ? sanitizeCommandMenuItems(this.editor.commandMenu.commands)
            : getCommandMenuItems();

        if (this.editor.commandMenu.commands.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.commandMenu.commands = slashMenuOptions;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return slashMenuOptions;
    }


    private buildShortcutMap(): void {
        this.shortcutMap.clear();
        this.editor.commandMenu.commands.forEach((item: CommandItemModel) => {
            this.shortcutMap.set(item.shortcut.toLowerCase(), item);
        });
    }

    private onKeyDown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }
        const commandItem: CommandItemModel = this.shortcutMap.get(normalizedKey);
        if (commandItem) {
            e.preventDefault();
            this.transformBlocks(commandItem);
            this.editor.trigger('keyActionExecuted', {
                keyCombination: normalizedKey, action: commandItem.type
            });
        }
    }

    private bindTooltipForSlashPopup(): void {
        if (!this.editor.commandMenu.enableTooltip) { return; }

        this.slashMenuTooltip = this.editor.tooltipRenderer.renderTooltip({
            cssClass: 'e-blockeditor-command-menu-tooltip',
            position: 'RightCenter',
            target: '.e-list-item',
            windowCollision: true,
            element: document.querySelector('.e-blockeditor-command-menu.e-popup') as HTMLElement,
            beforeRender: (args: TooltipEventArgs) => {
                const target: HTMLElement = args.target as HTMLElement;
                const templateRoot: HTMLElement = target.querySelector('.e-command-mention-item-template');
                if (target.classList.contains(constants.DISABLED_CLS) || !templateRoot) {
                    args.cancel = true;
                    return;
                }
                const tooltipVal: string = templateRoot.getAttribute('title');
                if (tooltipVal) {
                    this.slashMenuTooltip.content = tooltipVal;
                }
                else {
                    args.cancel = true;
                }
            }
        });
    }

    private clearTooltipState(): void {
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.destroy();
        }
    }

    private handleSlashCommandChange(args: MentionChangeEventArgs): void {
        args.e.preventDefault();
        args.e.stopPropagation();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.transformBlocks(args.itemData as any);
    }

    private getHeadingProps(itemId: string): HeadingProps {
        const extractedType: string = itemId.replace('-command', '');
        const level: number = parseInt(extractedType.slice(-1), 10);
        return { level };
    }

    private transformBlocks(commandItem: CommandItemModel): void {
        const selectedItem: string = commandItem.type;
        if (!selectedItem || !this.editor.currentFocusedBlock) { return; }

        const isHeadingType: boolean = selectedItem === BlockType.Heading || selectedItem === BlockType.CollapsibleHeading;
        const headingProps: HeadingProps = isHeadingType ? this.getHeadingProps(commandItem.id) : undefined;
        this.editor.blockRendererManager.handleBlockTransformation({
            block: getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks()),
            blockElement: this.editor.currentFocusedBlock,
            newBlockType: selectedItem,
            props: headingProps
        });
    }

    private handleSlashCommandFiltering(args: FilteringEventArgs): void {
        const filterArgs: CommandQueryFilteringEventArgs = {
            commands: this.editor.commandMenu.commands,
            text: args.text,
            event: (args.baseEventArgs as Event),
            cancel: false
        };
        if (this.editor.commandMenu.queryFiltering) {
            this.editor.commandMenu.queryFiltering.call(this, filterArgs);
            args.cancel = filterArgs.cancel;
            if (!args.cancel) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                args.updateData((filterArgs.commands as any));
            }
        }
    }

    private handleSlashCommandSelect(args: SelectEventArgs): void {
        const itemClickArgs: CommandItemClickedEventArgs = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            command: this.editor.commandMenu.commands.find((c: CommandItemModel) => c.id === (args.itemData as any).id),
            element: args.item,
            event: (args.e as Event),
            isInteracted: true,
            cancel: false
        };
        if (this.editor.commandMenu.itemClicked) {
            this.editor.commandMenu.itemClicked.call(this, itemClickArgs);
        }
        args.cancel = itemClickArgs.cancel;
    }

    private handleSlashCommandOpened(args: PopupEventArgs): void {
        this.isPopupOpened = true;
        this.bindTooltipForSlashPopup();
    }

    private handleSlashCommandBeforeOpen(args: PopupEventArgs): void {
        const openEventArgs: CommandMenuOpenEventArgs = {
            commands: this.editor.commandMenu.commands,
            event: (args.event as Event),
            cancel: false
        };
        if (this.editor.commandMenu.open) {
            this.editor.commandMenu.open.call(this, openEventArgs);
        }
        args.cancel = openEventArgs.cancel;
        if (this.editor.currentFocusedBlock) {
            args.cancel = this.restrictPopupForBlockTypes(this.editor.currentFocusedBlock.getAttribute('data-block-type'));
        }
    }

    private handleSlashCommandBeforeClose(args: PopupEventArgs): void {
        const closeEventArgs: CommandMenuCloseEventArgs = {
            commands: this.editor.commandMenu.commands,
            event: (args.event as Event),
            cancel: false
        };
        if (this.editor.commandMenu.close) {
            this.editor.commandMenu.close.call(this, closeEventArgs);
        }
        args.cancel = closeEventArgs.cancel;
        if (!args.cancel) {
            this.isPopupOpened = false;
            this.clearTooltipState();
        }
    }

    private restrictPopupForBlockTypes(blockType: string): boolean {
        return blockType === BlockType.Code || blockType === BlockType.Image;
    }

    private applyRtlSettings(): void {
        if (this.mentionObj) {
            this.mentionObj.enableRtl = this.editor.enableRtl;
        }
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.position = this.editor.enableRtl ? 'LeftCenter' : 'RightCenter';
        }
    }

    /**
     * Checks whether the slash command popup is opened or not.
     *
     * @returns {boolean} - Returns true if the slash command popup is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        const commandPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-command-menu') as HTMLElement;
        return this.isPopupOpened && (commandPopupElement && commandPopupElement.classList.contains('e-popup-open'));
    }

    /**
     * Hides the slash command popup.
     *
     * @returns {void}
     * @hidden
     */
    public hidePopup(): void {
        if (this.mentionObj) {
            this.mentionObj.hidePopup();
        }
    }

    /**
     * Shows the slash command popup.
     *
     * @returns {void}
     * @hidden
     */
    public showPopup(): void {
        const popupElement: HTMLElement = document.querySelector('.e-blockeditor-command-menu.e-popup');
        if (popupElement && popupElement.classList.contains('e-popup-open')) {
            return;
        }
        if (this.mentionObj) {
            this.mentionObj.showPopup();
        }
    }

    /**
     * Filters the slash commands based on the given text.
     *
     * @param {string} text - The text to filter the slash commands.
     * @param {number} xOffset - The x offset of the slash command popup.
     * @param {number} yOffset - The y offset of the slash command popup.
     * @returns {void}
     * @hidden
     */
    public filterCommands(text: string, xOffset: number, yOffset: number): void {
        if (this.mentionObj) {
            if (text.length > SlashCommandModule.MAX_FILTER_TEXT_LENGTH) {
                this.hidePopup();
                return;
            }
            const rect: DOMRect = this.editor.floatingIconContainer.getBoundingClientRect() as DOMRect;
            xOffset += rect.width;
            this.mentionObj.search(text, xOffset, yOffset);
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'slashCommand';
    }

    /**
     * Destroys the slash command module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        if (this.mentionObj) {
            this.mentionObj.destroy();
            this.mentionObj = null;
        }
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.destroy();
            this.slashMenuTooltip = null;
        }
        this.shortcutMap = null;
        this.editor = null;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    /* eslint-disable */
    protected onPropertyChanged(e: { [key: string]: BlockEditorModel }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const newProp: CommandMenuSettingsModel = e.newProp.commandMenu;
        const oldProp: CommandMenuSettingsModel = e.oldProp.commandMenu;
        if (!isNullOrUndefined(newProp)) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'popupWidth':
                    if (newProp.popupWidth !== oldProp.popupWidth) {
                        this.mentionObj.popupWidth = newProp.popupWidth;
                    }
                    break;
                case 'popupHeight':
                    if (newProp.popupHeight !== oldProp.popupHeight) {
                        this.mentionObj.popupHeight = newProp.popupHeight;
                    }
                    break;
                case 'commands':
                    this.mentionObj.dataSource = sanitizeCommandMenuItems(newProp.commands) as any;
                    break;
                }
            }
        }
    }
    /* eslint-enable */
}
