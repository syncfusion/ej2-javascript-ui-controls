/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path='../common/menu-base-model.d.ts'/>
import { attributes, getUniqueID, Collection, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
import { getZindexPartial } from '@syncfusion/ej2-popups';
import { ContextMenuModel } from './context-menu-model';
import { MenuBase, MenuItem } from '../common/menu-base';
import { MenuItemModel } from './../common/menu-base-model';

/**
 * The ContextMenu is a graphical user interface that appears on the user right click/touch hold operation.
 * ```html
 * <div id = 'target'></div>
 * <ul id = 'contextmenu'></ul>
 * ```
 * ```typescript
 * <script>
 * var contextMenuObj = new ContextMenu({items: [{ text: 'Cut' }, { text: 'Copy' },{ text: 'Paste' }], target: '#target'});
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class ContextMenu extends MenuBase implements INotifyPropertyChanged {
    /**
     * Constructor for creating the widget.
     *
     * @private
     * @param {ContextMenuModel} options - Specifies the context menu model
     * @param {string} element - Specifies the element
     */
    constructor(options?: ContextMenuModel, element?: string | HTMLUListElement) {
        super(options, <HTMLUListElement | string>element);
    }

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     *
     * @default ''
     */
    @Property('')
    public target: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     *
     * @default ''
     */
    @Property('')
    public filter: string;

    /**
     * Specifies menu items with its properties which will be rendered as ContextMenu.
     *
     * @default []
     * @aspType object
     * @blazorType object
     */
    @Collection<MenuItemModel>([], MenuItem)
    public items: MenuItemModel[];

    /**
     * This property allows you to define custom templates for items in the ContextMenu.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public itemTemplate: string | Function;

    /**
     * Specifies whether to enable / disable the scrollable option in ContextMenu.
     *
     * @default false
     */
    @Property(false)
    public enableScrolling: boolean;

    /**
     * For internal use only - prerender processing.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.isMenu = false;
        this.element.id = this.element.id || getUniqueID('ej2-contextmenu');
        super.preRender();
    }

    protected initialize(): void {
        this.template = this.itemTemplate ? this.itemTemplate : null;
        super.initialize();
        attributes(this.element, <{ [key: string]: string }>{ 'role': 'menubar', 'tabindex': '0' });
        this.element.style.zIndex = getZindexPartial(this.element).toString();
    }

    /**
     * This method is used to open the ContextMenu in specified position.
     *
     * @param {number} top - To specify ContextMenu vertical positioning.
     * @param {number} left - To specify ContextMenu horizontal positioning.
     * @param {HTMLElement} target - To calculate z-index for ContextMenu based upon the specified target.
     * @function open
     * @returns {void}
     */
    public open(top: number, left: number, target?: HTMLElement): void {
        super.openMenu(null, null, top, left, null, target);
    }

    /**
     * Closes the ContextMenu if it is opened.
     *
     * @function close
     * @returns {void}
     */
    public close(): void {
        super.closeMenu();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {ContextMenuModel} newProp - Specifies new properties
     * @param {ContextMenuModel} oldProp - Specifies old properties
     * @returns {void}
     */
    public onPropertyChanged(newProp: ContextMenuModel, oldProp: ContextMenuModel): void {
        super.onPropertyChanged(newProp, oldProp);
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'filter':
                this.close();
                this.filter = newProp.filter;
                break;
            case 'target':
                this.unWireEvents(oldProp.target);
                this.wireEvents();
                break;
            case 'itemTemplate':
                this.itemTemplate = newProp.itemTemplate;
                this.refresh();
            }
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Module Name
     * @private
     */
    protected getModuleName(): string {
        return 'contextmenu';
    }
}
