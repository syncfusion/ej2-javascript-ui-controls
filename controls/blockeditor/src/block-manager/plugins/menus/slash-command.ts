import { MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { CommandItemModel, IHeadingBlockSettings } from '../../../models/index';
import { getBlockModelById } from '../../../common/utils/block';
import { BlockType } from '../../../models/enums';
import { events } from '../../../common/constant';
import * as constants from '../../../common/constant';
import { getNormalizedKey } from '../../../common/utils/common';
import { BlockManager } from '../../base/block-manager';

/**
 * `SlashCommandModule` module is used to handle the slash command actions in the BlockEditor.
 *
 * @hidden
 */
export class SlashCommandModule {
    private parent: BlockManager;
    private isPopupOpened: boolean = false;
    private shortcutMap: Map<string, CommandItemModel> = new Map();

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.keydown, this.onKeyDown, this);
        this.parent.observer.on('slashMenuCreated', this.handleSlashMenuCreated, this);
        this.parent.observer.on('slashCommandChange', this.handleSlashCommandChange, this);
        this.parent.observer.on('updateSlashMenuPopupState', this.updateSlashMenuPopupState, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.keydown, this.onKeyDown);
        this.parent.observer.off('slashMenuCreated', this.handleSlashMenuCreated);
        this.parent.observer.off('slashCommandChange', this.handleSlashCommandChange);
        this.parent.observer.off('updateSlashMenuPopupState', this.updateSlashMenuPopupState);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleSlashMenuCreated(): void {
        this.buildShortcutMap();
    }

    private buildShortcutMap(): void {
        this.shortcutMap.clear();
        this.parent.commandMenuSettings.commands.forEach((item: CommandItemModel) => {
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
        }
    }

    private handleSlashCommandChange(args: MentionChangeEventArgs): void {
        this.transformBlocks(args.itemData as any);
    }

    private getHeadingProps(itemId: string): IHeadingBlockSettings {
        const extractedType: string = itemId.replace('-command', '');
        const level: number = parseInt(extractedType.slice(-1), 10);
        return { level };
    }

    private transformBlocks(commandItem: CommandItemModel): void {
        const selectedItem: string = commandItem.type;
        if (!selectedItem || !this.parent.currentFocusedBlock) { return; }

        const isHeadingType: boolean = selectedItem === BlockType.Heading || selectedItem === BlockType.CollapsibleHeading;
        const headingProps: IHeadingBlockSettings = isHeadingType ? this.getHeadingProps(commandItem.id) : undefined;
        this.parent.blockCommand.handleBlockTransformation({
            block: getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks()),
            blockElement: this.parent.currentFocusedBlock,
            newBlockType: selectedItem,
            props: headingProps
        });
    }

    private updateSlashMenuPopupState(options: { isOpen: boolean }): void {
        this.isPopupOpened = options.isOpen;
        if (!options.isOpen) {
            this.parent.isPopupOpenedOnAddIconClick = false;
        }
    }

    /**
     * Checks whether the slash command popup is opened or not.
     *
     * @returns {boolean} - Returns true if the slash command popup is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        const mentionPopupId: string = `${this.parent.blockContainer.id}_popup`;
        const commandPopupElement: HTMLElement = document.querySelector(`#${mentionPopupId}.e-blockeditor-command-menu`) as HTMLElement;
        return this.isPopupOpened && (commandPopupElement && commandPopupElement.classList.contains('e-popup-open'));
    }

    /**
     * Hides the slash command popup.
     *
     * @returns {void}
     * @hidden
     */
    public hidePopup(): void {
        this.parent.observer.notify('hideSlashMenuPopup');
    }

    /**
     * Shows the slash command popup.
     *
     * @returns {void}
     * @hidden
     */
    public showPopup(): void {
        this.parent.observer.notify('showSlashMenuPopup');
    }

    public filterCommands(text: string, xOffset: number, yOffset: number): void {
        this.parent.observer.notify('filterSlashCommands', { text, offsetX: xOffset, offsetY: yOffset });
    }

    /**
     * Destroys the slash command module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        this.shortcutMap = null;
    }
}
