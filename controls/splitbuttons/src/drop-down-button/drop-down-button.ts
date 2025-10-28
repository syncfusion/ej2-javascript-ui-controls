import { Collection, Event, NotifyPropertyChanges, detach, Property, EventHandler, EmitType, isRippleEnabled, isNullOrUndefined, append, formatUnit, Animation } from '@syncfusion/ej2-base';
import { addClass, INotifyPropertyChanged, getUniqueID, rippleEffect, getComponent, ChildProperty, Complex, AnimationModel } from '@syncfusion/ej2-base';
import { attributes, Component, closest, select, KeyboardEventArgs, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { classList, removeClass, compile } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup } from '@syncfusion/ej2-popups';
import { SplitButton } from '../split-button/split-button';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, upDownKeyHandler, DropDownAnimationEffect } from './../common/common';
import { getModel, SplitButtonIconPosition, Item, setBlankIconStyle } from './../common/common';
import { ItemModel } from './../common/common-model';
import { DropDownButtonModel, DropDownMenuAnimationSettingsModel } from './drop-down-button-model';

const classNames: ClassNames = {
    DISABLED: 'e-disabled',
    FOCUS: 'e-focused',
    ICON: 'e-menu-icon',
    ITEM: 'e-item',
    POPUP: 'e-dropdown-popup',
    RTL: 'e-rtl',
    SEPARATOR: 'e-separator',
    VERTICAL: 'e-vertical',
    POPUPWIDTH: 'e-dropdown-popup-width'
};

/**
 * Animation configuration settings.
 */
export class DropDownMenuAnimationSettings extends ChildProperty<DropDownMenuAnimationSettings> {
    /**
     * Specifies the animation effect applied when the DropDownMenu is shown.
     * The possible effects are:
     * * None: Specifies that the DropDownMenu appears without any animation effect.
     * * SlideDown: Specifies that the DropDownMenu appears with a slide down effect.
     * * ZoomIn: Specifies that the DropDownMenu appears with a zoom in effect.
     * * FadeIn: Specifies that the DropDownMenu appears with a fade in effect.
     *
     * @default 'SlideDown'
     * @isEnumeration true
     */
    @Property('SlideDown')
    public effect: DropDownAnimationEffect;
    /**
     * Specifies the time duration (in milliseconds) of the animation effect when the DropDownMenu is displayed.
     *
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the easing function applied during the animation effect of the DropDownMenu.
     *
     * @default 'ease'
     */
    @Property('ease')
    public easing: string;
}

/**
 * DropDownButton component is used to toggle contextual overlays for displaying list of action items.
 * It can contain both text and images.
 * ```html
 * <button id="element">DropDownButton</button>
 * ```
 * ```typescript
 * <script>
 * var dropDownButtonObj = new DropDownButton({items: [{ text: 'Action1' }, { text: 'Action2' },{ text: 'Action3' }]);
 * dropDownButtonObj.appendTo("#element");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class DropDownButton extends Component<HTMLButtonElement> implements INotifyPropertyChanged {
    /** @hidden */
    public dropDown: Popup;
    protected button: Button;
    /** @hidden */
    public activeElem: HTMLElement[];
    private rippleFn: Function;
    private delegateMousedownHandler: Function;
    private isPopupCreated: boolean = true;
    private popupContent: HTMLElement;

    /**
     * Defines the content of the DropDownButton element that can either be a text or HTML elements.
     *
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Defines class/multiple classes separated by a space in the DropDownButton element. The
     * DropDownButton size and styles can be customized by using this.
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the DropDownButton is `disabled` or not.
     *
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines class/multiple classes separated by a space for the DropDownButton that is used to
     * include an icon. DropDownButton can also include font icon and sprite image.
     *
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Positions the icon before/top of the text content in the DropDownButton. The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     *
     * @default "Left"
     */
    @Property('Left')
    public iconPosition: SplitButtonIconPosition;

    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the DropDownButton component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Specifies action items with its properties which will be rendered as DropDownButton popup.
     *
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];

    /**
     * Specifies the popup element creation on open.
     *
     * @default false
     */
    @Property(false)
    public createPopupOnClick: boolean;

    /**
     * Allows to specify the DropDownButton popup item element.
     *
     * @default ""
     */
    @Property('')
    public target: string | Element;

    /**
     * Specifies the event to close the DropDownButton popup.
     *
     * @default ""
     */
    @Property('')
    public closeActionEvents: string;

    /**
     * Specifies the template content to be displayed.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public itemTemplate: string | Function;

    /**
     * This property defines the width of the dropdown popup for the DropDownButton component.
     *
     * @property {string | number} popupWidth - A string or number representing the width of the dropdown.
     * It can be a valid CSS unit such as `px`, `%`, or `rem`, or a number interpreted as pixels.
     * @default "auto"
     * @remarks
     * The `popupWidth` property allows developers to control the width of the dropdown popup, ensuring it fits their design requirements.
     * The default value of `auto` allows the popup to adjust based on the content length, but a specific width can be provided for more precise control.
     */
    @Property('auto')
    public popupWidth: string | number;

    /**
     * Specifies the animation settings for opening the sub menu in the DropDownMenu.
     * The settings control the duration, easing, and effect of the animation applied when the sub menu opens.
     *
     * @default { effect: 'None' }
     */
    @Complex<DropDownMenuAnimationSettingsModel>({ effect: 'None' }, DropDownMenuAnimationSettings)
    public animationSettings: DropDownMenuAnimationSettingsModel;

    /**
     * Triggers while rendering each Popup item of DropDownButton.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the DropDownButton popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the DropDownButton popup.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the DropDownButton popup.
     *
     * @event close
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the DropDownButton popup.
     *
     * @event open
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item in DropDownButton popup.
     *
     * @event select
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Constructor for creating the widget
     *
     * @param  {DropDownButtonModel} options - Specifies dropdown button model
     * @param  {string|HTMLButtonElement} element - Specifies element
     * @hidden
     */
    public constructor(options?: DropDownButtonModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    protected preRender(): void {
        /** */
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * To open/close DropDownButton popup based on current state of the DropDownButton.
     *
     * @returns {void}
     */
    public toggle(): void {
        if (this.canOpen()) {
            this.openPopUp();
        } else if (this.createPopupOnClick && !this.isPopupCreated) {
            this.createPopup();
            this.openPopUp();
        } else {
            this.closePopup();
        }
    }

    /**
     * Initialize the Component rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    }
    /**
     * Adds a new item to the menu. By default, new item appends to the list as the last item,
     * but you can insert based on the text parameter.
     *
     * @param  { ItemModel[] } items - Specifies an array of JSON data.
     * @param { string } text - Specifies the text to insert the newly added item in the menu.
     * @returns {void}.
     */
    public addItems(items: ItemModel[], text?: string): void {
        let newItem: ItemModel;
        let idx: number = this.items.length;
        for (let j: number = 0, len: number = this.items.length; j < len; j++) {
            if (text === this.items[j as number].text) {
                idx = j;
                break;
            }
        }
        for (let i: number = items.length - 1 ; i >= 0; i--) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newItem = new Item(this as any, 'items', items[i as number], true);
            this.items.splice(idx, 0, newItem);
        }
        if (!this.canOpen()) { this.createItems(); }
    }
    /**
     * Removes the items from the menu.
     *
     * @param  { string[] } items - Specifies an array of string to remove the items.
     * @param { string } isUniqueId - Set `true` if specified items is a collection of unique id.
     * @returns {void}.
     */
    public removeItems(items: string[], isUniqueId?: boolean): void {
        let refresh: boolean = false;
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            for (let j: number = 0, len: number = this.items.length; j < len; j++) {
                if (items[i as number] === (isUniqueId ? this.items[j as number].id : this.items[j as number].text)) {
                    this.items.splice(j, 1); refresh = true;
                    break;
                }
            }
        }
        if (refresh && this.getULElement()) { this.createItems(); }
    }

    private createPopup(): void {
        const div: HTMLElement = this.createElement('div', {
            className: this.popupWidth !== 'auto' ? `${classNames.POPUP} ${classNames.POPUPWIDTH}` : classNames.POPUP,
            id: this.element.id + '-popup'
        });
        document.body.appendChild(div);
        this.dropDown = new Popup(div, {
            width: this.popupWidth,
            relateTo: this.element,
            collision: { X: 'fit', Y: 'flip' },
            position: { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            content: this.target ? this.getTargetElement() as HTMLElement : '',
            enableRtl: this.enableRtl
        });
        this.dropDown.element.setAttribute('role', 'dialog');
        this.dropDown.element.setAttribute('aria-label', 'dropdown menu');
        if (!isNullOrUndefined(this.popupContent)) {
            this.popupContent.style.display = '';
        }
        if (this.dropDown.element.style.position === 'fixed') {
            this.dropDown.refreshPosition(this.element);
        }
        this.dropDown.hide();
        attributes(this.element, {
            ['aria-haspopup']: this.items.length || this.target ? 'true' : 'false', ['aria-expanded']: 'false',
            ['type']: 'button'
        });
        if (this.cssClass) { addClass([div], this.cssClass.replace(/\s+/g, ' ').trim().split(' ')); }
        this.isPopupCreated = true;
        if (this.createPopupOnClick) {
            const splitButton: SplitButton = getComponent(this.activeElem[0], 'split-btn');
            if (splitButton) {
                splitButton.isPopupCreated = true;
            }
        }
    }

    private getTargetElement(): Element {
        if (this.createPopupOnClick && !this.isColorPicker() && !isNullOrUndefined(this.popupContent)) {
            return this.popupContent as HTMLElement;
        }
        return typeof (this.target) === 'string' ? select(this.target as string) : this.target;
    }

    private createItems(appendItems?: boolean): void {
        const items: ItemModel[] = this.items;
        const showIcon: boolean = this.hasIcon(this.items, 'iconCss');
        let span: Element; let item: ItemModel; let li: Element; let eventArgs: MenuEventArgs;
        let ul: HTMLElement = this.getULElement();
        if (ul) {
            ul.innerHTML = '';
        } else {
            ul = this.createElement('ul', {
                attrs: { 'role': 'menu', 'tabindex': '0' }
            });
        }
        if (this.itemTemplate) {
            const compiledTemplate: Function = this.compiletemplate(this.itemTemplate);
            items.forEach((item: ItemModel) => {
                const li: Element = this.createElement('li', {
                    className: item.separator ? classNames.ITEM + ' ' + classNames.SEPARATOR : classNames.ITEM,
                    attrs: item.separator
                        ? { 'role': 'separator', 'tabindex': '-1', 'aria-label': 'separator', 'aria-hidden': 'true' }
                        : { 'role': 'menuitem', 'tabindex': '-1', 'aria-label': item.text },
                    id: item.id ? item.id : getUniqueID('e-' + this.getModuleName() + '-item')
                });
                const compiledElement: HTMLElement[] = compiledTemplate(item, this, 'template', null, false, null, li);
                if (compiledElement) {
                    append(compiledElement, li);
                }
                if (item.disabled) {
                    li.classList.add('e-disabled');
                }
                const eventArgs: MenuEventArgs = { item, element: li as HTMLElement };
                this.trigger('beforeItemRender', eventArgs);
                if (eventArgs.item.disabled !== item.disabled) {
                    li.classList[eventArgs.item.disabled ? 'add' : 'remove']('e-disabled');
                }
                ul.appendChild(li);
            });
            if ((this as any).isReact) {
                this.renderReactTemplates();
            }
        } else {
            for (let i: number = 0; i < items.length; i++) {
                item = items[i as number];
                if (this.enableHtmlSanitizer) {
                    item.text = SanitizeHtmlHelper.sanitize(item.text);
                }
                const tempItem: string = item.text;
                li = this.createElement('li', {
                    innerHTML: item.url ? '' : tempItem,
                    className: item.separator ? classNames.ITEM + ' ' + classNames.SEPARATOR : classNames.ITEM,
                    attrs: item.separator ? {'role' : 'separator', 'tabindex': '-1', 'aria-label': 'separator', 'aria-hidden': 'true'} : { 'role': 'menuitem', 'tabindex': '-1', 'aria-label': tempItem },
                    id: item.id ? item.id : getUniqueID('e-' + this.getModuleName() + '-item')
                });
                if (this.enableHtmlSanitizer) {
                    li.textContent = item.url ? '' : tempItem;
                }
                else {
                    li.innerHTML = item.url ? '' : tempItem;
                }
                if (item.url) {
                    li.appendChild(this.createAnchor(item));
                    li.classList.add('e-url');
                }
                if (item.iconCss) {
                    span = this.createElement('span', { className: classNames.ICON + ' ' + item.iconCss });
                    if (item.url) {
                        li.childNodes[0].appendChild(span);
                    } else {
                        li.insertBefore(span, li.childNodes[0]);
                    }
                } else {
                    if (showIcon && !item.separator) {
                        li.classList.add('e-blank-icon');
                    }
                }
                const beforeDisabled: boolean = item.disabled;
                if (item.disabled) { li.classList.add('e-disabled'); }
                eventArgs = { item: item, element: li as HTMLElement };
                this.trigger('beforeItemRender', eventArgs);
                const afterDisabled: boolean = eventArgs.item.disabled;
                if (beforeDisabled !== afterDisabled) {
                    if (eventArgs.item.disabled) {
                        li.classList.add('e-disabled');
                    } else {
                        li.classList.remove('e-disabled');
                    }
                }
                ul.appendChild(li);
            }
        }
        if (appendItems) {
            this.getPopUpElement().appendChild(ul);
        }
        if (showIcon) { setBlankIconStyle(this.getPopUpElement()); }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private compiletemplate(template: string | Function): any {
        if (!this.itemTemplate) {
            return undefined;
        }
        try {
            if (typeof this.itemTemplate !== 'function') {
                const templateElement: Element = document.querySelector(this.itemTemplate as string);
                if (templateElement) {
                    return compile(templateElement.innerHTML.trim());
                }
            }
            return compile(template);
        } catch {
            return compile(template);
        }
    }

    private hasIcon(items: ItemModel[], field: string): boolean {
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            if ((<{ [key: string]: object }>items[i as number])[`${field}`]) {
                return true;
            }
        }
        return false;
    }

    private createAnchor(item: ItemModel): HTMLElement {
        const tempItem: string = item.text;
        const anchor: HTMLElement = this.createElement('a', { className: 'e-menu-text e-menu-url', attrs: { 'href': item.url } });
        if (this.enableHtmlSanitizer) {
            anchor.textContent = tempItem;
        } else {
            anchor.innerHTML = tempItem;
        }
        return anchor;
    }

    private initialize(): void {
        this.button = new Button({
            iconCss: this.iconCss, iconPosition: this.iconPosition, cssClass: this.cssClass, content: this.content,
            disabled: this.disabled, enableRtl: this.enableRtl, enablePersistence: this.enablePersistence
        });
        this.button.createElement = this.createElement;
        this.button.appendTo(this.element);
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
        this.appendArrowSpan();
        this.setActiveElem([this.element]);
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('aria-label', this.element.textContent ? this.element.textContent : 'dropdownbutton');
        if ((this.target && !this.isColorPicker() && !this.createPopupOnClick) || !this.createPopupOnClick) {
            this.createPopup();
        } else {
            this.isPopupCreated = false;
            if (this.target && !this.isColorPicker() && this.createPopupOnClick) {
                this.popupContent = this.getTargetElement() as HTMLElement;
                this.popupContent.style.display = 'none';
            }
        }
    }

    private isColorPicker(): boolean {
        if (!this.element) {
            return false;
        }
        const prevElem: HTMLElement = this.element.previousSibling as HTMLElement;
        if (prevElem && prevElem.classList && prevElem.classList.contains('e-split-colorpicker')) {
            return true;
        }
        return false;
    }

    private appendArrowSpan(): void {
        this.cssClass = isNullOrUndefined(this.cssClass) ? '' : this.cssClass;
        this.element.appendChild(this.createElement('span', {
            className: 'e-btn-icon e-icons ' + 'e-icon-' + (this.cssClass.indexOf(classNames.VERTICAL) > -1
                ? 'bottom' : 'right') + ' e-caret'
        }));
    }

    protected setActiveElem(elem: HTMLElement[]): void {
        this.activeElem = elem;
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'dropdown-btn';
    }

    private canOpen(): boolean {
        let val: boolean = false;
        if (this.isPopupCreated) {
            val = this.getPopUpElement().classList.contains('e-popup-close');
        }
        return val;
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        if (this.getModuleName() === 'dropdown-btn') {
            let classList: string[];
            if (this.element.querySelector('span.e-caret')) {
                detach(this.element.querySelector('span.e-caret'));
            }
            if (this.cssClass) {
                classList = this.cssClass.split(' ');
            }
            this.button.destroy();
            if (classList) {
                removeClass([this.element], classList);
            }
            removeClass(this.activeElem, ['e-active']);
            const attrList: string[] = this.element.getAttribute('class') ? ['aria-haspopup', 'aria-expanded', 'aria-owns', 'type']
                : ['aria-haspopup', 'aria-expanded', 'aria-owns', 'type', 'class'];
            attrList.forEach((key: string) => {
                this.element.removeAttribute(key);
            });
            this.popupUnWireEvents();
            this.destroyPopup();
            this.isPopupCreated = false;
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
    }

    protected destroyPopup(): void {
        if (this.isPopupCreated) {
            this.dropDown.destroy();
            if (this.getPopUpElement()) {
                const popupEle: HTMLElement = document.getElementById(this.getPopUpElement().id);
                if (popupEle) {
                    removeClass([popupEle], ['e-popup-open', 'e-popup-close']);
                    detach(popupEle);
                }
            }
            EventHandler.remove(this.getPopUpElement(), 'click', this.clickHandler);
            EventHandler.remove(this.getPopUpElement(), 'keydown', this.keyBoardHandler);
            if (this.isPopupCreated && this.dropDown) {
                this.dropDown.element = null;
                this.dropDown = undefined;
            }
        }
        this.isPopupCreated = false;
        const splitButton: SplitButton = getComponent(this.activeElem[0], 'split-btn');
        if (this.createPopupOnClick && splitButton) {
            const dropDownButton: DropDownButton = getComponent(this.activeElem[1], 'dropdown-btn');
            if (dropDownButton) {
                dropDownButton.isPopupCreated = false;
            }
        }
    }

    protected getPopUpElement(): HTMLElement {
        let val: HTMLElement = null;
        if (!this.dropDown && this.activeElem[0].classList.contains('e-split-btn')) {
            const dropDownBtn: DropDownButton = getComponent(this.activeElem[1], 'dropdown-btn');
            if (dropDownBtn) { this.dropDown = dropDownBtn.dropDown; }
        }
        if (this.dropDown) {
            val = this.dropDown.element;
        }
        return val;
    }

    protected getULElement(): HTMLElement {
        let val: HTMLElement = null;
        if (this.getPopUpElement()) {
            val = this.getPopUpElement().children[0] as HTMLElement;
        }
        return val;
    }

    protected wireEvents(): void {
        this.delegateMousedownHandler = this.mousedownHandler.bind(this);
        if (!this.createPopupOnClick) {
            EventHandler.add(document, 'mousedown touchstart', this.delegateMousedownHandler, this);
        }
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyBoardHandler, this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.add(window as any, 'resize', this.windowResize, this);
    }

    protected windowResize(): void {
        if (!this.canOpen() && this.dropDown) {
            this.dropDown.refreshPosition(this.element);
        }
    }

    protected popupWireEvents(): void {
        if (!this.delegateMousedownHandler) {
            this.delegateMousedownHandler = this.mousedownHandler.bind(this);
        }
        const popupElement: HTMLElement = this.getPopUpElement();
        if (this.createPopupOnClick) {
            EventHandler.add(document, 'mousedown touchstart', this.delegateMousedownHandler, this);
        }
        if (popupElement) {
            EventHandler.add(popupElement, 'click', this.clickHandler, this);
            EventHandler.add(popupElement, 'keydown', this.keyBoardHandler, this);
            if (this.closeActionEvents) {
                EventHandler.add(popupElement, this.closeActionEvents, this.focusoutHandler, this);
            }
        }
        this.rippleFn = rippleEffect(popupElement, { selector: '.' + classNames.ITEM });
    }

    protected popupUnWireEvents(): void {
        const popupElement: HTMLElement = this.getPopUpElement();
        if (this.createPopupOnClick) {
            EventHandler.remove(document, 'mousedown touchstart', this.delegateMousedownHandler);
        }
        if (popupElement && popupElement.parentElement) {
            EventHandler.remove(popupElement, 'click', this.clickHandler);
            EventHandler.remove(popupElement, 'keydown', this.keyBoardHandler);
            if (this.closeActionEvents) {
                EventHandler.remove(popupElement, this.closeActionEvents, this.focusoutHandler);
            }
        }
        if (isRippleEnabled && this.rippleFn) {
            this.rippleFn();
        }
    }

    /**
     * Handles the keyboard interactions.
     *
     * @param {KeyboardEventArgs} e - Specifies keyboard event args.
     * @returns {void}
     * @hidden
     */
    public keyBoardHandler(e: KeyboardEventArgs): void {
        if (e.target === this.element && (e.keyCode === 9 || (!e.altKey && e.keyCode === 40) || e.keyCode === 38)) {
            return;
        }
        if (e.target && ((e.target as Element).classList.contains('e-item') || ((e.target as Element).parentElement && (e.target as Element).parentElement.classList.contains('e-split-btn-wrapper'))) && e.keyCode === 13) {
            e.preventDefault();
        }
        switch (e.keyCode) {
        case 38:
        case 40:
            if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
                this.keyEventHandler(e);
            } else {
                this.upDownKeyHandler(e);
            }
            break;
        case 9:
        case 13:
        case 27:
        case 32:
            this.keyEventHandler(e);
            break;
        }
    }

    private isSafari(): boolean {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    protected upDownKeyHandler(e: KeyboardEventArgs): void {
        if (this.target && (e.keyCode === 38 || e.keyCode === 40)) {
            return;
        }
        e.preventDefault();
        upDownKeyHandler(this.getULElement(), e.keyCode);
    }

    private keyEventHandler(e: KeyboardEventArgs): void {
        if (this.target && (e.keyCode === 13 || e.keyCode === 9 )) {
            return;
        }
        if (e.keyCode === 13 && this.activeElem[0].classList.contains('e-split-btn')) {
            this.triggerSelect(e);
            this.activeElem[0].focus();
            return;
        }
        if (e.target && (e.target as Element).className.indexOf('e-edit-template') > -1 && e.keyCode === 32) {
            return;
        }
        if (e.keyCode !== 9) {
            e.preventDefault();
        }
        if (e.keyCode === 27 || e.keyCode === 38 || e.keyCode === 9) {
            if (!this.canOpen()) {
                this.closePopup(e, this.element);
            }
        } else {
            this.clickHandler(e);
        }
    }

    private getLI(elem: Element): Element {
        return elem.tagName === 'LI' ? elem : closest(elem, 'li');
    }

    private mousedownHandler(e: MouseEvent): void {
        const trgt: HTMLElement = e.target as HTMLElement;
        if (this.dropDown && !this.canOpen() && this.getPopUpElement() && !(closest(trgt, '[id="' + this.getPopUpElement().id + '"]')
            || closest(trgt, '[id="' + this.element.id + '"]'))) {
            this.closePopup(e);
        }
    }

    private focusoutHandler(e: MouseEvent): void {
        if (this.isPopupCreated && !this.canOpen()) {
            const liTarget : HTMLElement = (e.relatedTarget || e.target) as HTMLElement;
            if (liTarget && liTarget.className.indexOf('e-item') > -1) {
                const li: Element = this.getLI(liTarget);
                if (li) {
                    const liIdx: number = Array.prototype.indexOf.call(this.getULElement().children, li);
                    const item: ItemModel = this.items[liIdx as number];
                    if (item) {
                        const selectEventArgs: MenuEventArgs = { element: li as HTMLElement, item: item, event: e };
                        this.trigger('select', selectEventArgs);
                    }
                }
            }
            this.closePopup(e);
        }
    }

    protected clickHandler(e: MouseEvent | KeyboardEventArgs): void {
        const trgt: HTMLElement = e.target as HTMLElement;
        if (closest(trgt, '[id="' + this.element.id + '"]')) {
            if (!this.createPopupOnClick || (this.target && this.target !== '' && !this.isColorPicker() && !this.createPopupOnClick)) {
                if (this.getPopUpElement().classList.contains('e-popup-close')) {
                    this.openPopUp(e);
                } else {
                    this.closePopup(e);
                }
            } else if (this.isPopupCreated) {
                this.closePopup(e, this.activeElem[0]);
            } else {
                this.createPopup();
                this.openPopUp(e);
            }
        } else {
            if (closest(trgt, '[id="' + this.getPopUpElement().id + '"]')) {
                const li: Element = this.getLI(e.target as HTMLElement);
                if (li) {
                    this.triggerSelect(e);
                    this.closePopup(e, this.activeElem[0]);
                }
            }
        }
    }

    private triggerSelect(e: MouseEvent | KeyboardEventArgs): void {
        let eventArgs: MenuEventArgs; let liIdx: number; let item: ItemModel;
        const li: Element = this.getLI(e.target as HTMLElement);
        if (li) {
            liIdx = Array.prototype.indexOf.call(this.getULElement().children, li);
            item = this.items[liIdx as number];
            if (item) {
                eventArgs = { element: li as HTMLElement, item: item, event: e };
                this.trigger('select', eventArgs);
            }
        }
    }

    private openPopUp(e: MouseEvent | KeyboardEventArgs = null): void {
        let isReact: boolean = false; const popupElem: HTMLElement = this.getPopUpElement();
        if (this.activeElem[0] && this.activeElem[0].classList.contains('e-dropdown-btn') && popupElem.style.width && popupElem.style.width !== 'auto') {
            this.setWidth(popupElem);
        }
        if (!this.target) {
            this.createItems(true);
        } else {
            if (this.activeElem.length > 1) {
                const splitButton: SplitButton = getComponent(this.activeElem[0], 'split-btn');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((splitButton as any).isReact && popupElem.childNodes.length < 1) {
                    isReact = true;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((splitButton as any).appendReactElement) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (splitButton as any).appendReactElement(this.getTargetElement(), this.getPopUpElement());
                    }
                    this.renderReactTemplates();
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((this as any).isReact && popupElem.childNodes.length < 1) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    isReact = true;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((this as any).appendReactElement) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this as any).appendReactElement(this.getTargetElement(), this.getPopUpElement());
                    }
                    this.renderReactTemplates();
                }
            }
        }
        const ul: HTMLElement = this.getULElement();
        this.popupWireEvents();
        const beforeOpenArgs: BeforeOpenCloseMenuEventArgs = { element: ul, items: this.items, event: e, cancel: false };
        this.trigger('beforeOpen', beforeOpenArgs, (observedArgs: BeforeOpenCloseMenuEventArgs) => {
            if (!observedArgs.cancel) {
                const ul: HTMLElement = this.getULElement();
                const animationOptions: AnimationModel = this.animationSettings.effect !== 'None' ? {
                    name: this.animationSettings.effect, duration: this.animationSettings.duration,
                    timingFunction: this.animationSettings.easing
                } : null;
                if (animationOptions) {
                    this.animatePopup(animationOptions, ul);
                }
                this.dropDown.show(null, this.element);
                addClass([this.element], 'e-active');
                this.element.setAttribute('aria-expanded', 'true');
                this.element.setAttribute('aria-owns', this.getPopUpElement().id);
                if (ul && !this.isSafari()) {
                    ul.focus();
                }
                if (this.enableRtl && ul.parentElement.style.left !== '0px')
                {
                    let wrapperWidth: number;
                    if (this.element.parentElement && this.element.parentElement.classList.contains('e-split-btn-wrapper')) {
                        wrapperWidth = this.element.parentElement.offsetWidth;
                    } else {
                        wrapperWidth = this.element.offsetWidth;
                    }
                    const popupRect: number = ul.parentElement.offsetWidth - wrapperWidth;
                    let popupLeft: number = parseFloat(ul.parentElement.style.left) - popupRect;
                    if (popupLeft < 0) {
                        popupLeft = 0;
                    }
                    ul.parentElement.style.left = popupLeft + 'px';
                }
                const openArgs: OpenCloseMenuEventArgs = { element: ul, items: this.items };
                this.trigger('open', openArgs);
                if (ul && this.isSafari()) {
                    ul.focus();
                }
            }
        });
    }

    private animatePopup(animationOptions: AnimationModel, element: HTMLElement): void {
        new Animation(animationOptions).animate(element, {
            begin: (args: {element: HTMLElement}) => {
                args.element.parentElement.style.height = args.element.parentElement.offsetHeight + 'px';
            }
        });
    }

    private setWidth(popupElem: HTMLElement): void {
        const width: string = formatUnit(popupElem.style.width);
        if (width.indexOf('%') > -1) {
            const btnWidth: number = this.element.offsetWidth * parseFloat(width) / 100;
            popupElem.style.width = `${btnWidth}px`;
        }
    }

    private closePopup(e: MouseEvent | KeyboardEventArgs = null, focusEle?: HTMLElement): void {
        const ul: HTMLElement = this.getULElement();
        const beforeCloseArgs: BeforeOpenCloseMenuEventArgs = { element: ul, items: this.items, event: e, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs,  (observedArgs: BeforeOpenCloseMenuEventArgs) => {
            if (!observedArgs.cancel) {
                const popupElement: HTMLElement = this.getPopUpElement();
                if (popupElement) {
                    EventHandler.remove(popupElement, 'keydown', this.keyBoardHandler);
                }
                this.popupUnWireEvents();
                const ul: HTMLElement = this.getULElement();
                let selectedLi: Element;
                if (ul) {
                    selectedLi = ul.querySelector('.e-selected');
                }
                if (selectedLi) { selectedLi.classList.remove('e-selected'); }
                if (this.dropDown) { this.dropDown.hide(); }
                removeClass(this.activeElem, 'e-active');
                this.element.setAttribute('aria-expanded', 'false');
                this.element.removeAttribute('aria-owns');
                if (focusEle) {
                    if (!this.isSafari()) {
                        if (!(this.isColorPicker() && (e as KeyboardEvent).keyCode === 27)) {
                            focusEle.focus();
                        }
                    } else {
                        focusEle.focus({ preventScroll: true });
                    }
                }
                const closeArgs: OpenCloseMenuEventArgs = { element: ul, items: this.items };
                this.trigger('close', closeArgs);
                if (!this.target && ul) { detach(ul); }
                if (!this.target || this.isColorPicker() || (this.target && !this.isColorPicker())) {
                    if (this.createPopupOnClick) { this.destroyPopup(); }
                }
            } else {
                if (observedArgs.element) {
                    ul.focus();
                }
            }
        });
    }

    protected unWireEvents(): void {
        if (!this.createPopupOnClick) {
            EventHandler.remove(document, 'mousedown touchstart', this.delegateMousedownHandler);
        }
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'keydown', this.keyBoardHandler);
        if (this.isPopupCreated) {
            EventHandler.remove(this.getPopUpElement(), 'click', this.clickHandler);
            EventHandler.remove(this.getPopUpElement(), 'keydown', this.keyBoardHandler);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.remove(window as any, 'resize', this.windowResize);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {DropDownButtonModel} newProp - Specifies new properties
     * @param  {DropDownButtonModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: DropDownButtonModel, oldProp: DropDownButtonModel): void {
        const btnModel: string[] = ['content', 'cssClass', 'iconCss', 'iconPosition', 'disabled', 'enableRtl'];
        this.button.setProperties(getModel(newProp, btnModel));
        let popupElement: Element;
        if (this.isPopupCreated) {
            popupElement = this.getPopUpElement();
            this.dropDown.setProperties(getModel(newProp, ['enableRtl']));
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'content':
                if (!this.element.querySelector('span.e-caret')) {
                    this.appendArrowSpan();
                }
                break;
            case 'disabled':
                if (newProp.disabled) {
                    this.unWireEvents();
                    if (this.isPopupCreated  && !this.canOpen()) {
                        this.closePopup();
                    }
                } else {
                    this.wireEvents();
                }
                break;
            case 'cssClass':
                oldProp.cssClass = isNullOrUndefined(oldProp.cssClass) ? '' : oldProp.cssClass;
                if (newProp.cssClass.indexOf(classNames.VERTICAL) > -1  || oldProp.cssClass.indexOf(classNames.VERTICAL) > -1) {
                    if (!this.element.querySelector('span.e-caret')) {
                        this.appendArrowSpan();
                    }
                    const arrowSpan: Element = this.element.querySelector('span.e-caret');
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    newProp.cssClass.indexOf(classNames.VERTICAL) > -1 ? classList(arrowSpan, ['e-icon-bottom'], ['e-icon-right'])
                        : classList(arrowSpan, ['e-icon-right'], ['e-icon-bottom']);
                }
                if (this.isPopupCreated) {
                    if (oldProp.cssClass) {
                        removeClass([popupElement], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([popupElement], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                    }
                }
                break;
            case 'target':
                this.dropDown.content = this.getTargetElement() as HTMLElement;
                this.dropDown.dataBind();
                break;
            case 'items':
                if (this.isPopupCreated && this.getULElement()) { this.createItems(); }
                break;
            case 'createPopupOnClick':
                if (newProp.createPopupOnClick) {
                    this.destroyPopup();
                } else {
                    this.createPopup();
                }
                break;
            }
        }
    }

    /**
     * Sets the focus to DropDownButton
     * its native method
     *
     * @public
     * @returns {void}
     */
    public focusIn(): void {
        this.element.focus();
    }

}

interface ClassNames {
    DISABLED: string;
    FOCUS: string;
    ICON: string;
    ITEM: string;
    POPUP: string;
    RTL: string;
    SEPARATOR: string;
    VERTICAL: string;
    POPUPWIDTH: string;
}
