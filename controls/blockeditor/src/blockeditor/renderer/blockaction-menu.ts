import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Popup, Tooltip } from '@syncfusion/ej2-popups';
import { Menu, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BlockActionItemModel, BlockActionMenuSettingsModel, BlockModel } from '../../models/index';
import { getBlockActionsMenuItems } from '../../common/utils/data';
import { BlockEditor } from '../base/blockeditor';
import { BlockActionItemSelectEventArgs } from '../../models/eventargs';
import { BlockEditorModel } from '../base/blockeditor-model';
import { events } from '../../common/constant';
import { sanitizeBlockActionItems } from '../../common/utils/transform';
import * as constants from '../../common/constant';

/**
 * `BlockActionMenuModule` is used to handle the block action menu in the BlockEditor.
 *
 * @hidden
 */
export class BlockActionMenuModule {
    private editor: BlockEditor;
    private menuObj: Menu;
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
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        this.menuElement = this.editor.createElement('ul', {
            id: (this.editor.element.id + constants.BLOCKACTION_MENUBAR_ID),
            styles: 'width: 100%'
        });
        this.editor.element.appendChild(this.menuElement);

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
            cssClass: constants.BLOCKACTION_MENUBAR_CLS,
            items: this.getActionItems(),
            template: itemTemplate,
            orientation: 'Vertical',
            fields: { text: 'label', iconCss: 'iconCss' },
            select: this.handleBlockActionMenuSelect.bind(this)
        });
        const popupElement: HTMLElement = this.editor.createElement('div', {
            id: (this.editor.element.id + constants.BLOCKACTION_POPUP_ID),
            className: constants.BLOCKACTION_POPUP_CLS
        });
        this.editor.element.appendChild(popupElement);
        this.editor.blockManager.observer.notify('actionMenuCreated');
    }

    private getActionItems(): BlockActionItemModel[] {
        const actionItems: BlockActionItemModel[] = this.editor.blockActionMenuSettings.items.length > 0
            ? sanitizeBlockActionItems(this.editor.blockActionMenuSettings.items)
            : getBlockActionsMenuItems();

        if (this.editor.blockActionMenuSettings.items.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.blockActionMenuSettings.items = actionItems;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return actionItems;
    }

    private bindTooltip(): void {
        if (!this.editor.blockActionMenuSettings.enableTooltip) { return; }
        this.blockActionTooltip = this.editor.tooltipRenderer.renderTooltip({
            cssClass: constants.BLOCKACTION_TOOLTIP_CLS,
            position: 'RightCenter',
            target: '.e-menu-item',
            windowCollision: true,
            element: (document.querySelector('#' + this.editor.element.id + constants.BLOCKACTION_POPUP_ID) as HTMLElement)
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

    private handleBlockActionMenuSelect(args: MenuEventArgs): void {
        const clickEventArgs: BlockActionItemSelectEventArgs = {
            item: (args.item as BlockActionItemModel),
            element: args.element,
            isInteracted: (args.event && Object.keys(args.event).length > 0) ? true : false,
            cancel: false
        };
        if (this.editor.blockActionMenuSettings.itemSelect) {
            this.editor.blockActionMenuSettings.itemSelect.call(this, clickEventArgs);
        }
        if (!clickEventArgs.cancel) {
            this.editor.blockManager.observer.notify('blockActionsMenuSelect', args);
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'blockActionMenuSettings';
    }

    public destroy(): void {
        this.removeEventListeners();
        if (this.menuObj) {
            this.menuObj.destroy();
            detach(this.menuElement);
            this.menuObj = null;
            this.menuElement = null;
        }
        if (this.blockActionTooltip) {
            this.blockActionTooltip.destroy();
            this.blockActionTooltip = null;
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
        const newProp: BlockActionMenuSettingsModel = e.newProp.blockActionMenuSettings;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'popupWidth':
                this.editor.blockManager.observer.notify('popupWidthChanged', { value: newProp.popupWidth });
                break;
            case 'popupHeight':
                this.editor.blockManager.observer.notify('popupHeightChanged', { value: newProp.popupHeight });
                break;
            case 'items':
                this.menuObj.items = sanitizeBlockActionItems(newProp.items);
            }
        }
    }

}
