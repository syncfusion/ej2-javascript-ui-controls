import { detach } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BaseChildrenProp, BlockActionItemModel, BlockModel } from '../../../models/index';
import { getBlockIndexById, getBlockModelById, isListTypeBlock } from '../../../common/utils/block';
import { IPopupRenderOptions, BlockPositionInfo, BlockActionMenuCloseEventProps, BlockActionMenuOpenEventProps } from '../../../common/interface';
import { BlockActionMenuOpeningEventArgs, BlockActionMenuClosingEventArgs } from '../../../models/eventargs';
import { events } from '../../../common/constant';
import { getNormalizedKey } from '../../../common/utils/common';
import * as constants from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';

/**
 * `BlockActionMenuModule` is used to handle the block action menu in the BlockEditor.
 *
 * @hidden
 */
export class BlockActionMenuModule {
    private parent: BlockManager;
    private isPopupOpened: boolean = false;
    public popupObj: Popup;
    private menuWrapperElement: HTMLUListElement;
    private shortcutMap: Map<string, BlockActionItemModel> = new Map();

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.keydown, this.onKeyDown, this);
        this.parent.observer.on('actionMenuCreated', this.handleMenuCreated, this);
        this.parent.observer.on('popupWidthChanged', this.handlePopupWidthChanges, this);
        this.parent.observer.on('popupHeightChanged', this.handlePopupHeightChanges, this);
        this.parent.observer.on('blockActionsMenuSelect', this.handleBlockActionMenuSelect, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.keydown, this.onKeyDown);
        this.parent.observer.off('actionMenuCreated', this.handleMenuCreated);
        this.parent.observer.off('popupWidthChanged', this.handlePopupWidthChanges);
        this.parent.observer.off('popupHeightChanged', this.handlePopupHeightChanges);
        this.parent.observer.off('blockActionsMenuSelect', this.handleBlockActionMenuSelect);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleMenuCreated(): void {
        this.menuWrapperElement = this.parent.rootEditorElement.querySelector(`.${constants.BLOCKACTION_MENUBAR_CLS}`);
        this.init();
        this.buildShortcutMap();
    }

    private init(): void {
        const popupElement: HTMLElement = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.BLOCKACTION_POPUP_ID);

        const args: IPopupRenderOptions = {
            element: popupElement,
            content: this.menuWrapperElement,
            width: this.parent.blockActionMenuSettings.popupWidth,
            height: this.parent.blockActionMenuSettings.popupHeight
        };
        this.popupObj = this.parent.popupRenderer.renderPopup(args);
    }

    private buildShortcutMap(): void {
        this.shortcutMap.clear();
        this.parent.blockActionMenuSettings.items.forEach((item: BlockActionItemModel) => {
            this.shortcutMap.set(item.shortcut.toLowerCase(), item);
        });
    }

    private onKeyDown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        const isTable: HTMLElement = this.parent.currentFocusedBlock &&
            this.parent.currentFocusedBlock.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;
        if (!normalizedKey || isTable) { return; }
        const actionItem: BlockActionItemModel = this.shortcutMap.get(normalizedKey);
        if (actionItem) {
            e.preventDefault();
            this.handleBlockActions(actionItem, this.parent.currentFocusedBlock, e);
        }
    }

    /**
     * Toggles the block action popup based on the provided flag.
     *
     * @param {boolean} shouldHide - Flag indicating whether to hide or show the popup.
     * @param {Event} e - Optional event object.
     * @returns {void}
     * @hidden
     */
    public toggleBlockActionPopup(shouldHide: boolean, e?: Event): void {
        setTimeout(() => {
            if (this.parent && this.parent.inlineToolbarModule) {
                this.parent.inlineToolbarModule.hideInlineToolbar();
            }
        }, 10);
        if (this.popupObj) {
            if (shouldHide) {
                const closeEventArgs: BlockActionMenuCloseEventProps = {
                    event: e,
                    items: this.parent.blockActionMenuSettings.items,
                    cancel: false,
                    callback: (args: BlockActionMenuClosingEventArgs) => {
                        if (args.cancel) { return; }
                        this.popupObj.hide();
                        this.isPopupOpened = false;
                    }
                };
                this.parent.observer.notify('blockActionsMenuClose', closeEventArgs);
            }
            else {
                const openEventArgs: BlockActionMenuOpenEventProps = {
                    event: e,
                    items: this.parent.blockActionMenuSettings.items,
                    cancel: false,
                    callback: (args: BlockActionMenuOpeningEventArgs) => {
                        if (args.cancel) { return; }
                        this.toggleDisabledItems(this.parent.currentHoveredBlock);
                        this.popupObj.show();
                        this.isPopupOpened = true;
                        setTimeout(() => {
                            const items: NodeListOf<HTMLElement> = this.popupObj.element.querySelectorAll('.e-menu-item');
                            if (items.length > 0) {
                                items[0].focus();
                                items[0].classList.add('e-focused');
                            }
                        });
                    }
                };
                this.parent.observer.notify('blockActionsMenuOpen', openEventArgs);
            }
        }
    }

    private getParentBlock(parentId: string): BlockModel {
        return getBlockModelById(parentId, this.parent.getEditorBlocks());
    }

    private isFirstChildBlock(block: BlockModel, parentBlock: BlockModel): boolean {
        const children: BlockModel[] = (parentBlock.properties as BaseChildrenProp).children;
        return (children.length > 0 && children[0].id === block.id);
    }

    private isLastChildBlock(block: BlockModel, parentBlock: BlockModel): boolean {
        const children: BlockModel[] = (parentBlock.properties as BaseChildrenProp).children;
        return (children.length > 0 && children[children.length - 1].id === block.id);
    }

    private toggleMenuItemClass(itemId: string, disable: boolean): void {
        const listElement: HTMLElement = this.popupObj.element.querySelector(`#${itemId}`);
        if (listElement) {
            listElement.classList.toggle(constants.DISABLED_CLS, disable);
        }
    }

    private getBlockPositionInfo(blockElement: HTMLElement): BlockPositionInfo {
        const allBlocks: BlockModel[] = this.parent.getEditorBlocks();
        const currentBlock: BlockModel = getBlockModelById(blockElement.id, allBlocks);
        const currentBlockParent: BlockModel = this.getParentBlock(currentBlock.parentId);
        const currentBlockIndex: number = getBlockIndexById(blockElement.id, allBlocks);
        const isFirstBlock: boolean = currentBlockIndex === 0;
        const isLastBlock: boolean = currentBlockIndex === (currentBlockParent
            ? (currentBlockParent.properties as BaseChildrenProp).children.length - 1
            : allBlocks.length - 1);
        const hasOnlyOneBlock: boolean = allBlocks.length === 1;
        return { currentBlock, currentBlockParent, isFirstBlock, isLastBlock, hasOnlyOneBlock };
    }

    private toggleDisabledItems(blockElement: HTMLElement): void {
        if (!blockElement) { return; }
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();

        if (selectedBlocks && selectedBlocks.length > 1) {
            for (const item of this.parent.blockActionMenuSettings.items) {
                this.toggleMenuItemClass(item.id, true);
            }
            return;
        }

        const { currentBlock, currentBlockParent, isFirstBlock, isLastBlock, hasOnlyOneBlock
        }: BlockPositionInfo = this.getBlockPositionInfo(blockElement);

        for (const item of this.parent.blockActionMenuSettings.items) {
            let disable: boolean = item.disabled;
            switch (item.id) {
            case 'moveup':
                disable = hasOnlyOneBlock || isFirstBlock;
                if (currentBlockParent && this.isFirstChildBlock(currentBlock, currentBlockParent)) {
                    disable = true;
                }
                break;
            case 'movedown':
                disable = hasOnlyOneBlock || isLastBlock;
                if (currentBlockParent && this.isLastChildBlock(currentBlock, currentBlockParent)) {
                    disable = true;
                }
                break;
            }
            this.toggleMenuItemClass(item.id, disable);
        }
    }

    private handleBlockActionMenuSelect(args: MenuEventArgs): void {
        this.handleBlockActions(args.item, this.parent.currentHoveredBlock, args.event);
    }

    private handlePopupWidthChanges(data: { value: string | number }): void {
        this.popupObj.width = this.parent.blockActionMenuSettings.popupWidth = data.value.toString();
    }

    private handlePopupHeightChanges(data: { value: string | number }): void {
        this.popupObj.height = this.parent.blockActionMenuSettings.popupWidth = data.value.toString();
    }

    private handleBlockActions(item: BlockActionItemModel, blockElement: HTMLElement, e?: Event): void {
        const selectedItem: string = item.label.replace(' ', '').toLowerCase();
        let toBlockElement: HTMLElement;
        let toBlockModel: BlockModel;
        switch (selectedItem) {
        case 'duplicate':
            this.parent.execCommand({ command: 'DuplicateBlock', state: {
                blockElement, direction: 'below'
            }});
            break;
        case 'delete': {
            const adjacentBlock: HTMLElement = (blockElement.nextElementSibling || blockElement.previousElementSibling) as HTMLElement;
            if (adjacentBlock) {
                this.parent.setFocusAndUIForNewBlock(adjacentBlock);
            }
            this.parent.execCommand({ command: 'DeleteBlock', state: { blockElement }});
            break;
        }
        case 'moveup':
        case 'movedown': {
            this.toggleDisabledItems(blockElement);
            if (!blockElement || this.isItemDisabled(item.id)) { return; }

            toBlockElement = (selectedItem === 'moveup' ? blockElement.previousElementSibling : blockElement.nextElementSibling) as HTMLElement;
            if (toBlockElement) {
                toBlockModel = getBlockModelById(toBlockElement.id, this.parent.getEditorBlocks());
                this.parent.execCommand({ command: 'MoveBlock', state: {
                    fromBlockIds: [blockElement.id],
                    toBlockId: toBlockElement.id
                }});
            }
            break;
        }
        }

        const currentBlockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        if ((currentBlockModel && isListTypeBlock(currentBlockModel.blockType)) ||
            (toBlockModel && isListTypeBlock(toBlockModel.blockType))) {
            this.parent.listPlugin.recalculateMarkersForListItems();
        }
        this.toggleBlockActionPopup(true, e);
    }

    private isItemDisabled(itemId: string): boolean {
        const listElement: HTMLElement = this.popupObj.element.querySelector('#' + itemId);
        return listElement && listElement.classList.contains(constants.DISABLED_CLS);
    }

    /**
     * Checks whether the block action popup is opened or not.
     *
     * @returns {boolean} - Returns true if the block action popup is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        return this.isPopupOpened;
    }

    public destroy(): void {
        this.removeEventListeners();
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupObj.element);
            this.popupObj = null;
        }
        this.shortcutMap = null;
    }

}
