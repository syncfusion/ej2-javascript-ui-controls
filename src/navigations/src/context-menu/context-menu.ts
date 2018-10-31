/// <reference path='../common/menu-base-model.d.ts'/>
import { Collection, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
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
     * @private
     */
    constructor(options?: ContextMenuModel, element?: string | HTMLUListElement) {
        super(options, <HTMLUListElement | string>element);
    }

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     * @default ''  
     */
    @Property('')
    public target: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     * @default ''    
     */
    @Property('')
    public filter: string;

    /**
     * Specifies menu items with its properties which will be rendered as ContextMenu.
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public items: MenuItemModel[];

    /**
     * For internal use only - prerender processing.
     * @private
     */
    protected preRender(): void {
        this.isMenu = false;
        super.preRender();
    }

    /**
     * This method is used to open the ContextMenu in specified position.
     * @param top - To specify ContextMenu vertical positioning.
     * @param left - To specify ContextMenu horizontal positioning.
     * @param target - To calculate z-index for ContextMenu based upon the specified target.
     * @method open
     * @returns void
     */
    public open(top: number, left: number, target?: HTMLElement): void {
        super.openMenu(null, null, top, left, null, target);
    }

    /**
     * Closes the ContextMenu if it is opened.
     */
    public close(): void {
        super.closeMenu();
    }

    /**
     * Called internally if any of the property value changed
     * @private
     * @param {ContextMenuModel} newProp
     * @param {ContextMenuModel} oldProp
     * @returns void
     */
    public onPropertyChanged(newProp: ContextMenuModel, oldProp: ContextMenuModel): void {
        super.onPropertyChanged(newProp, oldProp);
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'filter':
                    this.close();
                    this.filter = newProp.filter;
                    break;
                case 'target':
                    this.unWireEvents();
                    this.target = newProp.target;
                    this.wireEvents();
                    break;
            }
        }
    }

    /**
     * Get module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'contextmenu';
    }
}