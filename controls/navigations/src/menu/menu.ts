/// <reference path='../common/menu-base-model.d.ts'/>
import { attributes, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
import { Browser, Complex } from '@syncfusion/ej2-base';
import { MenuBase, FieldSettings } from '../common/menu-base';
import { MenuItemModel, FieldSettingsModel } from '../common/menu-base-model';
import { MenuModel } from './menu-model';

const VMENU: string = 'e-vertical';

const SCROLLABLE: string = 'e-scrollable';

/**
 * Specifies the option for orientation mode of Menu. By default, component rendered in Horizontal orientation mode.
 */
export type Orientation = 'Horizontal' | 'Vertical';

type objColl = { [key: string]: Object }[];
type obj = { [key: string]: Object };

/**
 * The Menu is a graphical user interface that serve as navigation headers for your application or site.
 * ```html
 * <ul id = 'menu'></ul>
 * ```
 * ```typescript
 * <script>
 * var menuObj = new Menu({ items: [{ text: 'Home' }, { text: 'Contact Us' },{ text: 'Login' }]});
 * menuObj.appendTo("#menu");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Menu extends MenuBase implements INotifyPropertyChanged {
    private tempItems: objColl = [];

    /**
     * Specified the orientation of Menu whether it can be horizontal or vertical.
     * @default 'Horizontal'
     */
     @Property('Horizontal')
     public orientation: Orientation;

    /**
     * Specifies the template for Menu item.
     * @default null
     */
    @Property(null)
    public template: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     * @default false
     */
    @Property(false)
    public enableScrolling: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     * @default { itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator",
     * children: "items" }
     */
    @Complex<FieldSettingsModel>({}, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Constructor for creating the component.
     * @private
     */
    constructor(options?: MenuModel, element?: string | HTMLUListElement) {
        super(options, <HTMLUListElement | string>element);
    }

    /**
     * Get module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'menu';
    }

    /**
     * For internal use only - prerender processing.
     * @private
     */
    protected preRender(): void {
        this.isMenu = true;
        if (this.template) {
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.template = document.querySelector(this.template).innerHTML.trim();
                    this.clearChanges();
                }
            } catch (e) {
                /* action on catch */
            }
        } else {
            this.tempItems =  this.items as objColl;
            this.items = [];
            this.tempItems.map(this.createMenuItems, this);
            this.setProperties({ items: this.items }, true);
            this.tempItems = [];
        }
        super.preRender();
    }

    protected initialize(): void {
        super.initialize();
        attributes(this.element, <{ [key: string]: string }>{ 'role': 'menubar', 'tabindex': '0' });
        if (this.orientation === 'Vertical') {
            this.element.classList.add(VMENU);
            this.element.setAttribute('aria-orientation', 'vertical');
        } else {
            if (Browser.isDevice && !this.enableScrolling) {
                this.element.parentElement.classList.add(SCROLLABLE);
            }
        }
    }

    /**
     * Called internally if any of the property value changed
     * @private
     * @param {MenuModel} newProp
     * @param {MenuModel} oldProp
     * @returns void
     */
    public onPropertyChanged(newProp: MenuModel, oldProp: MenuModel): void {
        super.onPropertyChanged(newProp, oldProp);
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'orientation':
                if (newProp.orientation === 'Vertical') {
                    this.element.classList.add(VMENU);
                    this.element.setAttribute('aria-orientation', 'vertical');
                } else {
                    this.element.classList.remove(VMENU);
                    this.element.removeAttribute('aria-orientation');
                }
                break;
            }
        }
    }

    private createMenuItems(item: obj): void {
        let pIdField: string;
        let idx: number[];
        let i: number;
        let items: MenuItemModel[] = this.items as objColl;
        pIdField = this.getField('parentId');
        if (item[pIdField]) {
            idx = this.getIndex(item[pIdField].toString(), true);
            for (i = 0; i < idx.length; i++) {
                if (!items[idx[i]].items) {
                    items[idx[i]].items = [];
                }
                items = items[idx[i]].items;
            }
            items.push(item);
        } else {
            (<MenuItemModel[]>this.items).push(item);
        }
    }
}
