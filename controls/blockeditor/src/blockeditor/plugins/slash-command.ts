import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FilteringEventArgs, Mention, MentionChangeEventArgs, PopupEventArgs, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { BlockModel, CommandItemModel, CommandMenuSettingsModel } from '../models/index';
import { getBlockModelById } from '../utils/block';
import { IMentionRenderOptions} from '../base/interface';
import { getCommandMenuItems } from '../utils/data';
import { BlockEditor } from '../base/blockeditor';
import { CommandItemClickedEventArgs, CommandMenuCloseEventArgs, CommandMenuOpenEventArgs, CommandQueryFilteringEventArgs } from '../base/eventargs';
import { BlockEditorModel } from '../base/index';
import { events } from '../base/constant';
import { getNormalizedKey } from '../utils/common';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { sanitizeCommandMenuItems } from '../utils/transform';

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

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.init();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.keydown, this.onKeyDown, this);
        this.editor.on('rtl-changed', this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.keydown, this.onKeyDown);
        this.editor.off('rtl-changed', this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        let slashMenuOptions: CommandItemModel[];
        if (this.editor.commandMenu.commands.length > 0) {
            slashMenuOptions = sanitizeCommandMenuItems(this.editor.commandMenu.commands);
        }
        else {
            slashMenuOptions = getCommandMenuItems();
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            this.editor.commandMenu.commands = slashMenuOptions;
            (this.editor as any).isProtectedOnChange = prevOnChange;
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockWrapper,
            mentionChar: '/',
            dataSource: slashMenuOptions,
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

    private onKeyDown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }
        const commandItem: CommandItemModel = this.editor.commandMenu.commands.find((item: CommandItemModel) =>
            item.shortcut.toLowerCase() === normalizedKey);
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
                if (target.classList.contains('e-disabled') || !templateRoot) {
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

    private transformBlocks(commandItem: CommandItemModel): void {
        const selectedItem: string = commandItem.type;
        if (!selectedItem || !this.editor.currentFocusedBlock) { return; }
        const blockElement: HTMLElement = this.editor.currentFocusedBlock;
        if (!blockElement) { return; }
        const block: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        this.editor.handleBlockTransformation({
            block: block,
            blockElement: blockElement,
            newBlockType: selectedItem
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
            command: this.editor.commandMenu.commands.find((c: CommandItemModel) => c.type === (args.itemData as any).type),
            element: args.item,
            event: (args.e as Event),
            isInteracted: Object.keys(args.e).length === 0 ? false : true,
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
            const blockType: string = this.editor.currentFocusedBlock.getAttribute('data-block-type');
            args.cancel = (blockType === 'Code' || blockType === 'Table' || blockType === 'Image');
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

    private applyRtlSettings(): void {
        if (this.mentionObj) {
            this.mentionObj.enableRtl = this.editor.enableRtl;
        }
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.position = this.editor.enableRtl ? 'LeftCenter' : 'RightCenter';
        }
    }

    public isPopupOpen(): boolean {
        const commandPopupElement: HTMLElement = document.querySelector('.e-mention.e-popup.e-blockeditor-command-menu') as HTMLElement;
        return this.isPopupOpened && (commandPopupElement && commandPopupElement.classList.contains('e-popup-open'));
    }

    public hidePopup(): void {
        if (this.mentionObj) {
            this.mentionObj.hidePopup();
        }
    }

    public showPopup(): void {
        const popupElement: HTMLElement = document.querySelector('.e-blockeditor-command-menu.e-popup');
        if (popupElement && popupElement.classList.contains('e-popup-open')) {
            return;
        }
        if (this.mentionObj) {
            this.mentionObj.showPopup();
        }
    }

    public filterCommands(text: string, xOffset: number, yOffset: number): void {
        if (this.mentionObj) {
            if (text.length > 6) {
                this.hidePopup();
                return;
            }
            const rect: ClientRect | DOMRect = this.editor.floatingIconContainer.getBoundingClientRect();
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

    public destroy(): void {
        if (this.mentionObj) {
            this.mentionObj.destroy();
            this.mentionObj = null;
        }
        if (this.slashMenuTooltip) {
            this.slashMenuTooltip.destroy();
            this.slashMenuTooltip = null;
        }
        this.removeEventListeners();
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
                    this.mentionObj.dataSource = (newProp.commands as any);
                }
            }
        }
    }
    /* eslint-enable */
}
