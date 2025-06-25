import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Popup, Tooltip } from '@syncfusion/ej2-popups';
import { Menu, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BlockActionItemModel, BlockActionMenuSettingsModel, BlockModel } from '../models/index';
import { getBlockIndexById, getBlockModelById, isChildrenTypeBlock, isListTypeBlock } from '../utils/block';
import { IPopupRenderOptions } from '../base/interface';
import { getBlockActionsMenuItems } from '../utils/data';
import { BlockEditor } from '../base/blockeditor';
import { BlockActionMenuOpenEventArgs, BlockActionMenuCloseEventArgs, BlockActionItemClickEventArgs } from '../base/eventargs';
import { BlockEditorModel } from '../base/index';
import { events } from '../base/constant';
import { getNormalizedKey } from '../utils/common';
import { sanitizeBlockActionItems } from '../utils/transform';


/**
 * `BlockActionMenuModule` is used to handle the block action menu in the BlockEditor.
 *
 * @hidden
 */
export class BlockActionMenuModule {
    private editor: BlockEditor;
    private menuObj: Menu;
    private isPopupOpened: boolean = false;
    public popupObj: Popup;
    private blockActionTooltip: Tooltip;
    private menuElement: HTMLUListElement;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.init();
        this.addEventListeners();
        this.bindTooltip();
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
        let items: BlockActionItemModel[];
        if (this.editor.blockActionsMenu.items.length > 0) {
            items = sanitizeBlockActionItems(this.editor.blockActionsMenu.items);
        }
        else {
            items = getBlockActionsMenuItems();
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            this.editor.blockActionsMenu.items = items;
            (this.editor as any).isProtectedOnChange = prevOnChange;
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        this.menuElement = this.editor.createElement('ul', {
            className: 'e-blockeditor-blockaction-menubar',
            styles: 'width: 100%'
        });
        const popupElement: HTMLElement = this.editor.createElement('div', {
            className: 'e-blockeditor-blockaction-popup'
        });
        document.body.appendChild(this.menuElement);
        document.body.appendChild(popupElement);

        const itemTemplate: string =
            '<div class="e-blockaction-item-template">' +
            '<div class="e-action-icon-info">' +
            '<span class="e-action-icon ${iconCss}"></span>' +
            '</div>' +
            '<div class="e-action-item-info">' +
            '<div class="e-action-item-label">${label}</div>' +
            '${if(shortcut)}' +
            '<div class="e-action-item-shortcut">${shortcut}</div>' +
            '${/if}' +
            '</div>' +
            '</div>';
        this.menuObj = this.editor.menubarRenderer.renderMenubar({
            element: this.menuElement,
            items: items,
            template: itemTemplate,
            orientation: 'Vertical',
            fields: { text: 'label', iconCss: 'iconCss' },
            select: this.handleBlockActionMenuSelect.bind(this)
        });
        const args: IPopupRenderOptions = {
            element: popupElement,
            content: this.menuElement.parentElement,
            width: this.editor.blockActionsMenu.popupWidth,
            height: this.editor.blockActionsMenu.popupHeight
        };
        this.popupObj = this.editor.popupRenderer.renderPopup(args);
    }

    private onKeyDown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }
        const actionItem: BlockActionItemModel = this.editor.blockActionsMenu.items.find((item: BlockActionItemModel) =>
            item.shortcut.toLowerCase() === normalizedKey);
        if (actionItem) {
            e.preventDefault();
            this.handleBlockActions(actionItem, this.editor.currentFocusedBlock, e);
            this.editor.trigger('keyActionExecuted', {
                keyCombination: normalizedKey, action: actionItem.label
            });
        }
    }

    private bindTooltip(): void {
        if (!this.editor.blockActionsMenu.enableTooltip) { return; }
        this.blockActionTooltip = this.editor.tooltipRenderer.renderTooltip({
            cssClass: 'e-blockeditor-blockaction-tooltip',
            position: 'RightCenter',
            target: '.e-menu-item',
            windowCollision: true,
            element: (document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement)
        });
    }

    private applyRtlSettings(): void {
        if (this.menuObj) {
            this.menuObj.enableRtl = this.editor.enableRtl;
        }
        if (this.blockActionTooltip) {
            this.blockActionTooltip.position = this.editor.enableRtl ? 'LeftCenter' : 'RightCenter';
        }
    }

    public toggleBlockActionPopup(shouldHide: boolean, e?: Event): void {
        if (this.popupObj) {
            if (shouldHide) {
                const closeEventArgs: BlockActionMenuCloseEventArgs = {
                    event: e,
                    items: this.editor.blockActionsMenu.items,
                    cancel: false
                };
                if (this.editor.blockActionsMenu.close) {
                    this.editor.blockActionsMenu.close.call(this, closeEventArgs);
                }
                if (closeEventArgs.cancel) { return; }
                this.popupObj.hide();
                this.isPopupOpened = false;
            }
            else {
                const openEventArgs: BlockActionMenuOpenEventArgs = {
                    event: e,
                    items: this.editor.blockActionsMenu.items,
                    cancel: false
                };
                if (this.editor.blockActionsMenu.open) {
                    this.editor.blockActionsMenu.open.call(this, openEventArgs);
                }
                if (openEventArgs.cancel) { return; }
                this.toggleDisabledItems(this.editor.currentHoveredBlock);
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
        }
    }

    private getParentBlock(parentId: string): BlockModel {
        const parentBlock: BlockModel = getBlockModelById(parentId, this.editor.blocksInternal);
        return parentBlock;
    }

    private isFirstChildBlock(block: BlockModel, parentBlock: BlockModel): boolean {
        if (!parentBlock.children.length) { return false; }
        return parentBlock.children[0].id === block.id;
    }

    private isLastChildBlock(block: BlockModel, parentBlock: BlockModel): boolean {
        if (!parentBlock.children.length) { return false; }
        const children: BlockModel[] = parentBlock.children;
        return children[children.length - 1].id === block.id;
    }

    private toggleDisabledItems(blockElement: HTMLElement): void {
        if (!blockElement) { return; }
        const blockId: string = blockElement.id;
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();

        // For multiple selection, disable all items
        if (selectedBlocks && selectedBlocks.length > 1) {
            this.editor.blockActionsMenu.items.forEach((item: BlockActionItemModel) => {
                const listElement: HTMLElement = this.popupObj.element.querySelector('#' + item.id);
                if (listElement) {
                    listElement.classList.add('e-disabled');
                }
            });
            return;
        }

        const allBlocks: BlockModel[] = this.editor.blocksInternal;
        const currentBlock: BlockModel = getBlockModelById(blockId, allBlocks);
        const currentBlockParent: BlockModel = this.getParentBlock(currentBlock.parentId);
        const currentBlockIndex: number = getBlockIndexById(blockId, allBlocks);

        const isFirstBlock: boolean = currentBlockIndex === 0;
        const isLastBlock: boolean = currentBlockIndex === (currentBlockParent
            ? currentBlockParent.children.length - 1
            : allBlocks.length - 1);
        const hasOnlyOneBlock: boolean = allBlocks.length === 1;

        this.editor.blockActionsMenu.items.forEach((item: BlockActionItemModel) => {
            const listElement: HTMLElement = this.popupObj.element.querySelector('#' + item.id);
            if (!listElement) { return; }

            let disable: boolean = item.disabled;

            switch (item.id) {
            case 'moveup':
                disable = hasOnlyOneBlock || isFirstBlock;

                // Case 1: children block, and it's the first among its siblings
                if (currentBlockParent && this.isFirstChildBlock(currentBlock, currentBlockParent)) {
                    disable = true;
                }
                break;

            case 'movedown':
                disable = hasOnlyOneBlock || isLastBlock;

                // Case 1: children block, and it's the last among its siblings
                if (currentBlockParent && this.isLastChildBlock(currentBlock, currentBlockParent)) {
                    disable = true;
                }
                break;
            }

            listElement.classList.toggle('e-disabled', disable);
        });
    }

    private handleBlockActionMenuSelect(args: MenuEventArgs): void {
        const clickEventArgs: BlockActionItemClickEventArgs = {
            item: (args.item as BlockActionItemModel),
            element: args.element,
            isInteracted: Object.keys(args.event).length > 0 ? true : false,
            cancel: false
        };
        if (this.editor.blockActionsMenu.itemClick) {
            this.editor.blockActionsMenu.itemClick.call(this, clickEventArgs);
        }
        if (clickEventArgs.cancel) {
            this.toggleBlockActionPopup(true, args.event);
            return;
        }
        this.handleBlockActions(args.item, this.editor.currentHoveredBlock, args.event);
    }

    private handleBlockActions(item: BlockActionItemModel, blockElement: HTMLElement, e?: Event): void {
        const selectedItem: string = item.label.replace(' ', '').toLowerCase();
        let toBlockElement: HTMLElement;
        let toBlockModel: BlockModel;
        switch (selectedItem) {
        case 'duplicate':
            this.editor.blockAction.duplicateBlock(blockElement);
            break;
        case 'delete': {
            const adjacentBlock: HTMLElement = (blockElement.nextElementSibling || blockElement.previousElementSibling) as HTMLElement;
            if (adjacentBlock) {
                this.editor.blockAction.setFocusAndUIForNewBlock(adjacentBlock);
            }
            this.editor.blockAction.deleteBlock({ blockElement: blockElement });
            this.editor.blockAction.createDefaultEmptyBlock(true);
            break;
        }
        case 'moveup':
        case 'movedown': {
            this.toggleDisabledItems(blockElement);
            const isDisabled: boolean = this.isItemDisabled(item.id);
            if (!blockElement || isDisabled) { return; }
            toBlockElement = (selectedItem === 'moveup' ? blockElement.previousElementSibling : blockElement.nextElementSibling) as HTMLElement;
            if (toBlockElement) {
                toBlockModel = getBlockModelById(toBlockElement.id, this.editor.blocksInternal);
                this.editor.blockAction.moveBlock({
                    fromBlockIds: [blockElement.id],
                    toBlockId: toBlockElement.id
                });
            }
            break;
        }
        }
        const currentBlockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        if ((currentBlockModel && isListTypeBlock(currentBlockModel.type)) || (toBlockModel && isListTypeBlock(toBlockModel.type))) {
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
        this.toggleBlockActionPopup(true, e);
    }

    private isItemDisabled(itemId: string): boolean {
        const listElement: HTMLElement = this.popupObj.element.querySelector('#' + itemId);
        if (listElement) {
            return listElement.classList.contains('e-disabled');
        }
        return false;
    }

    public isPopupOpen(): boolean {
        return this.isPopupOpened;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'blockActionsMenu';
    }

    public destroy(): void {
        if (this.menuObj) {
            this.menuObj.destroy();
            detach(this.menuElement);
            this.menuObj = null;
        }
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupObj.element);
            this.popupObj = null;
        }
        if (this.blockActionTooltip) {
            this.blockActionTooltip.destroy();
            this.blockActionTooltip = null;
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
        const newProp: BlockActionMenuSettingsModel = e.newProp.blockActionsMenu;
        const oldProp: BlockActionMenuSettingsModel = e.oldProp.blockActionsMenu;
        if (!isNullOrUndefined(newProp)) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'enable':
                    if (newProp.enable !== oldProp.enable) {
                        this.toggleBlockActionPopup(!newProp.enable);
                    }
                    break;
                case 'popupWidth':
                    if (newProp.popupWidth !== oldProp.popupWidth) {
                        this.popupObj.width = newProp.popupWidth;
                    }
                    break;
                case 'popupHeight':
                    if (newProp.popupHeight !== oldProp.popupHeight) {
                        this.popupObj.height = newProp.popupHeight;
                    }
                    break;
                case 'items':
                    this.menuObj.items = newProp.items;
                }
            }
        }
    }
    /* eslint-enable */

}
