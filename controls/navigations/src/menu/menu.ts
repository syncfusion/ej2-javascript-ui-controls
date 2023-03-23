/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path='../common/menu-base-model.d.ts'/>
import { attributes, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
import { Browser, Complex, getUniqueID, SanitizeHtmlHelper  } from '@syncfusion/ej2-base';
import { MenuBase, FieldSettings } from '../common/menu-base';
import { MenuItemModel, FieldSettingsModel } from '../common/menu-base-model';
import { MenuModel } from './menu-model';

const VMENU: string = 'e-vertical';

const SCROLLABLE: string = 'e-scrollable';

const HAMBURGER: string = 'e-hamburger';

/**
 * Defines the different types of orientation option available in the Menu.
 * ```props
 * Horizontal - It renders the menu in a horizontal orientation mode.
 * Vertical - It renders the menu in a vertical orientation mode.
 * ```
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
     *
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: Orientation;

    /**
     * Specifies target element to open/close Menu while click in Hamburger mode.
     *
     * @default ''
     */
    @Property('')
    public target: string;

    /**
     * Specifies the template for Menu item.
     *
     * @default null
     */
    @Property(null)
    public template: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     *
     * @default false
     */
    @Property(false)
    public enableScrolling: boolean;

    /**
     * Specifies whether to enable / disable the hamburger mode in Menu.
     *
     * @default false
     */
    @Property(false)
    public hamburgerMode: boolean;

    /**
     * Specifies the title text for hamburger mode in Menu.
     *
     * @default 'Menu'
     */
    @Property('Menu')
    public title: string;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     *
     * @default { itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator",
     * children: "items" }
     */
    // eslint:disable-next-line
    @Complex<FieldSettingsModel>({ itemId: 'id', text: 'text', parentId: 'parentId', iconCss: 'iconCss', url: 'url', separator: 'separator', children: 'items' }, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Constructor for creating the component.
     *
     * @private
     * @param {MenuModel} options - Specifies the menu model
     * @param {string} element - Specifies the element
     */
    constructor(options?: MenuModel, element?: string | HTMLUListElement) {
        super(options, <HTMLUListElement | string>element);
    }

    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Module Name
     */
    protected getModuleName(): string {
        return 'menu';
    }

    /**
     * For internal use only - prerender processing.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.isMenu = true;
        this.element.id = this.element.id || getUniqueID('ej2-menu');
        if (this.template) {
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.template = document.querySelector(this.template).innerHTML.trim();
                    this.clearChanges();
                }
            } catch (e) {
                /* action on catch */
            }
            this.updateMenuItems(this.items);
        } else {
            this.updateMenuItems(this.items);
        }
        super.preRender();
    }

    protected initialize(): void {
        super.initialize();
        attributes(this.element, <{ [key: string]: string }>{ 'role': 'menubar', 'tabindex': '0' });
        if (this.orientation === 'Vertical') {
            this.element.classList.add(VMENU);
            if (this.hamburgerMode && !this.target) {
                this.element.previousElementSibling.classList.add(VMENU);
            }
            this.element.setAttribute('aria-orientation', 'vertical');
        } else {
            if (Browser.isDevice && !this.enableScrolling) {
                this.element.parentElement.classList.add(SCROLLABLE);
            }
        }
        if (this.hamburgerMode) {
            this.element.parentElement.classList.add(HAMBURGER);
            if (this.orientation === 'Horizontal') {
                this.element.classList.add('e-hide-menu');
            }
        }
    }

    private updateMenuItems(items: MenuItemModel[]): void {
        this.tempItems =  items as objColl;
        this.items = [];
        this.tempItems.map(this.createMenuItems, this);
        this.setProperties({ items: this.items }, true);
        this.tempItems = [];
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {MenuModel} newProp - Specifies the new properties.
     * @param {MenuModel} oldProp - Specifies the old properties.
     * @returns {void}
     */
    public onPropertyChanged(newProp: MenuModel, oldProp: MenuModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'orientation':
                if (newProp.orientation === 'Vertical') {
                    this.element.classList.add(VMENU);
                    if (this.hamburgerMode) {
                        if (!this.target) { this.element.previousElementSibling.classList.add(VMENU); }
                        this.element.classList.remove('e-hide-menu');
                    }
                    this.element.setAttribute('aria-orientation', 'vertical');
                } else {
                    this.element.classList.remove(VMENU);
                    if (this.hamburgerMode) {
                        if (!this.target) { this.element.previousElementSibling.classList.remove(VMENU); }
                        this.element.classList.add('e-hide-menu');
                    }
                    this.element.removeAttribute('aria-orientation');
                }
                break;
            case 'items':
                if (!Object.keys(oldProp.items).length) { this.updateMenuItems(newProp.items); }
                break;
            case 'hamburgerMode':
                if (!this.element.previousElementSibling) {
                    super.createHeaderContainer();
                }
                if (newProp.hamburgerMode) {
                    this.element.parentElement.classList.add(HAMBURGER);
                    [].slice.call(this.element.getElementsByClassName('e-blankicon')).forEach((li: HTMLElement): void => {
                        li.style[this.enableRtl ? 'paddingRight' : 'paddingLeft'] = '';
                    });
                } else {
                    this.element.parentElement.classList.remove(HAMBURGER);
                    if (this.orientation === 'Vertical') { this.setBlankIconStyle(this.element); }
                }
                if (this.orientation === 'Vertical') {
                    if (!this.target) { this.element.previousElementSibling.classList.add(VMENU); }
                    this.element.classList.remove('e-hide-menu');
                } else {
                    if (this.target) {
                        this.element.previousElementSibling.classList.add(VMENU);
                    } else {
                        this.element.previousElementSibling.classList.remove(VMENU);
                    }
                    this.element.classList[newProp.hamburgerMode ? 'add' : 'remove']('e-hide-menu');
                }
                break;
            case 'title':
                if (this.hamburgerMode && this.element.previousElementSibling) {
                    newProp.title = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(newProp.title) : newProp.title;
                    this.element.previousElementSibling.querySelector('.e-menu-title').innerHTML = newProp.title;
                }
                break;
            case 'target':
                if (this.hamburgerMode) {
                    this.unWireEvents(oldProp.target);
                    this.wireEvents();
                    if (this.orientation === 'Horizontal') {
                        if (!newProp.target) {
                            if (!this.element.previousElementSibling) {
                                super.createHeaderContainer();
                            }
                            this.element.previousElementSibling.classList.remove(VMENU);
                        } else {
                            this.element.previousElementSibling.classList.add(VMENU);
                        }
                        this.element.classList.add('e-hide-menu');
                    }
                }
                break;
            }
        }
        super.onPropertyChanged(newProp, oldProp);
    }

    private createMenuItems(item: obj): void {
        let idx: number[];
        let i: number;
        let items: MenuItemModel[] = this.items as objColl;
        const pIdField: string = this.getField('parentId');
        if (item[`${pIdField}`]) {
            idx = this.getIndex(item[`${pIdField}`].toString(), true);
            for (i = 0; i < idx.length; i++) {
                if (!items[idx[i as number]].items) {
                    items[idx[i as number]].items = [];
                }
                items = items[idx[i as number]].items;
            }
            items.push(item);
        } else {
            (<MenuItemModel[]>this.items).push(item);
        }
    }

    /**
     * This method is used to open the Menu in hamburger mode.
     *
     * @function open
     * @returns {void}
     */
    public open(): void {
        super.openHamburgerMenu();
    }

    /**
     * Closes the Menu if it is opened in hamburger mode.
     *
     * @function close
     * @returns {void}
     */
    public close(): void {
        super.closeHamburgerMenu();
    }
}
