import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { FilteringEventArgs, Mention, MentionChangeEventArgs, PopupEventArgs, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { CommandItemModel, CommandMenuSettingsModel } from '../../models/index';
import { IMentionRenderOptions} from '../../common/interface';
import { getCommandMenuItems } from '../../common/utils/data';
import { BlockEditor } from '../base/blockeditor';
import { CommandItemSelectEventArgs, CommandFilteringEventArgs } from '../../models/eventargs';
import { BlockType } from '../../models/enums';
import { events } from '../../common/constant';
import { sanitizeCommandMenuItems } from '../../common/utils/transform';
import * as constants from '../../common/constant';
import { BlockEditorModel } from '../base/blockeditor-model';
import { findClosestParent } from '../../common/utils/dom';

/**
 * `SlashCommandModule` module is used to handle the slash command actions in the BlockEditor.
 *
 * @hidden
 */
export class SlashCommandModule {
    private editor: BlockEditor;
    public mentionObj: Mention;
    private slashMenuTooltip: Tooltip;
    private static readonly MAX_FILTER_TEXT_LENGTH: number = 6;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.init();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.blockManager.observer.on('showSlashMenuPopup', this.showPopup, this);
        this.editor.blockManager.observer.on('hideSlashMenuPopup', this.hidePopup, this);
        this.editor.blockManager.observer.on('filterSlashCommands', this.filterCommands, this);
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.blockManager.observer.off('showSlashMenuPopup', this.showPopup);
        this.editor.blockManager.observer.off('hideSlashMenuPopup', this.hidePopup);
        this.editor.blockManager.observer.off('filterSlashCommands', this.filterCommands);
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockContainer,
            mentionChar: '/',
            dataSource: this.getCommandItems(),
            cssClass: 'e-blockeditor-command-menu e-blockeditor-mention-menu',
            highlight: true,
            fields: { text: 'label', value: 'label', iconCss: 'iconCss', groupBy: 'groupBy', disabled: 'disabled' },
            itemTemplate: '<div class="e-command-mention-item-template" title="${tooltip}"><div class="e-command-icon-info"><span class="e-command-icon ${iconCss}"></span></div><div class="e-command-item-info"><div class="e-command-title">${label}</div>${if(shortcut)}<div class="e-command-shortcut">${shortcut}</div>${/if}</div></div>',
            displayTemplate: '',
            popupWidth: this.editor.commandMenuSettings.popupWidth,
            popupHeight: this.editor.commandMenuSettings.popupHeight,
            change: this.handleSlashCommandChange.bind(this),
            beforeOpen: this.handleSlashCommandBeforeOpen.bind(this),
            opened: this.handleSlashCommandOpened.bind(this),
            beforeClose: this.handleSlashCommandBeforeClose.bind(this),
            select: this.handleSlashCommandSelect.bind(this),
            filtering: this.handleSlashCommandFiltering.bind(this)
        };

        this.mentionObj = this.editor.mentionRenderer.renderMention(mentionArgs);
        this.applyRtlSettings();
        this.editor.blockManager.observer.notify('slashMenuCreated');
    }

    private getCommandItems(): CommandItemModel[] {
        const slashMenuOptions: CommandItemModel[] = this.editor.commandMenuSettings.commands.length > 0
            ? sanitizeCommandMenuItems(this.editor.commandMenuSettings.commands)
            : getCommandMenuItems();

        if (this.editor.commandMenuSettings.commands.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.commandMenuSettings.commands = slashMenuOptions;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return slashMenuOptions;
    }

    private bindTooltipForSlashPopup(popupEle: HTMLElement): void {
        this.slashMenuTooltip = this.editor.tooltipRenderer.renderTooltip({
            cssClass: 'e-blockeditor-command-menu-tooltip',
            position: 'RightCenter',
            target: '.e-list-item',
            windowCollision: true,
            element: popupEle,
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

    private setActiveItem(popupEle: HTMLElement): void {
        const firstItem: HTMLElement = popupEle.querySelector('.e-list-item');
        if (firstItem) {
            firstItem.classList.add('e-active');
        }
    }

    private clearTooltipState(): void {
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.destroy();
        }
    }

    private handleSlashCommandChange(args: MentionChangeEventArgs): void {
        args.e.preventDefault();
        args.e.stopPropagation();

        this.editor.blockManager.observer.notify('slashCommandChange', args);
    }

    private handleSlashCommandFiltering(args: FilteringEventArgs): void {
        const filterArgs: CommandFilteringEventArgs = {
            commands: this.editor.commandMenuSettings.commands,
            text: args.text,
            event: (args.baseEventArgs as Event),
            cancel: false
        };
        if (this.editor.commandMenuSettings.filtering) {
            this.editor.commandMenuSettings.filtering.call(this, filterArgs);
            args.cancel = filterArgs.cancel;
            if (!args.cancel) {
                args.updateData((filterArgs.commands as { [key: string]: Object }[]));
            }
        }
    }

    private handleSlashCommandSelect(args: SelectEventArgs): void {
        const itemClickArgs: CommandItemSelectEventArgs = {
            command: this.editor.commandMenuSettings.commands.find((c: CommandItemModel) => c.id === (args.itemData as { id: string }).id),
            element: args.item,
            event: (args.e as Event),
            isInteracted: true,
            cancel: false
        };
        if (this.editor.commandMenuSettings.itemSelect) {
            this.editor.commandMenuSettings.itemSelect.call(this, itemClickArgs);
        }
        args.cancel = itemClickArgs.cancel;
    }

    private handleSlashCommandOpened(args: PopupEventArgs): void {
        const mentionPopupId: string = `${this.editor.blockContainer.id}_popup`;
        const popupEle: HTMLElement = document.querySelector(`#${mentionPopupId}.e-blockeditor-command-menu`) as HTMLElement;
        this.clearTooltipState();
        this.bindTooltipForSlashPopup(popupEle);
        this.setActiveItem(popupEle);
        const tableBlock: HTMLElement = this.editor.blockManager.currentFocusedBlock
            ? findClosestParent(this.editor.blockManager.currentFocusedBlock, `.${constants.TABLE_BLOCK_CLS}`)
            : null;
        if (tableBlock) {
            this.restrictItemsOnSpecificBlock([BlockType.Table], popupEle);
        }
        this.editor.blockManager.observer.notify('updateSlashMenuPopupState', { isOpen: true });
    }

    private restrictItemsOnSpecificBlock(blockTypes: string[], popupEle: HTMLElement): void {
        blockTypes.forEach((blockType: string) => {
            const listItem: HTMLElement = popupEle.querySelector(`[data-value=${blockType}]`);
            if (listItem) {
                listItem.classList.add(constants.HIDDEN_CLS);
            }
        });
    }

    private handleSlashCommandBeforeOpen(args: PopupEventArgs): void {
        if (this.editor.blockManager.currentFocusedBlock) {
            args.cancel = this.restrictPopupForBlockTypes(this.editor.blockManager.currentFocusedBlock.getAttribute('data-block-type'));
        }
    }

    private handleSlashCommandBeforeClose(args: PopupEventArgs): void {
        this.editor.blockManager.observer.notify('updateSlashMenuPopupState', { isOpen: false });
        this.clearTooltipState();
    }

    private restrictPopupForBlockTypes(blockType: string): boolean {
        return blockType === BlockType.Code || blockType === BlockType.Image;
    }

    private applyRtlSettings(): void {
        this.mentionObj.enableRtl = this.editor.enableRtl;
        this.mentionObj.enablePersistence = this.editor.enablePersistence;
        this.mentionObj.locale = this.editor.locale;
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.position = this.editor.enableRtl ? 'LeftCenter' : 'RightCenter';
        }
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
        const mentionPopupId: string = `${this.editor.blockContainer.id}_popup`;
        const popupElement: HTMLElement = document.querySelector(`#${mentionPopupId}.e-blockeditor-command-menu`);
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
     * @param {{ text: string, offsetX: number, offsetY: number }} options - options to filter the slash commands.
     * @returns {void}
     * @hidden
     */
    public filterCommands(options: { text: string, offsetX: number, offsetY: number }): void {
        if (this.mentionObj) {
            if (options.text.length > SlashCommandModule.MAX_FILTER_TEXT_LENGTH) {
                this.hidePopup();
                return;
            }
            const rect: DOMRect = this.editor.floatingIconRenderer.floatingIconContainer.getBoundingClientRect() as DOMRect;
            options.offsetX += rect.width;
            this.mentionObj.search(options.text, options.offsetX, options.offsetY);
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
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    protected onPropertyChanged(e: { [key: string]: BlockEditorModel }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const newProp: CommandMenuSettingsModel = e.newProp.commandMenuSettings;
        if (!isNullOrUndefined(newProp)) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'popupWidth':
                    this.mentionObj.popupWidth = this.editor.blockManager.commandMenuSettings.popupWidth;
                    break;
                case 'popupHeight':
                    this.mentionObj.popupHeight = this.editor.blockManager.commandMenuSettings.popupHeight;
                    break;
                case 'commands':
                    this.mentionObj.dataSource = this.editor.blockManager.commandMenuSettings.commands =
                    sanitizeCommandMenuItems(newProp.commands) as { [key: string]: Object }[];
                    break;
                }
            }
        }
    }
}
