
import { Collection, Event, NotifyPropertyChanges, detach, Property, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { addClass, INotifyPropertyChanged, getUniqueID, rippleEffect } from '@syncfusion/ej2-base';
import { attributes, Component, closest, select, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { classList, remove, removeClass } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup } from '@syncfusion/ej2-popups';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from './../common/common';
import { getModel, SplitButtonIconPosition, Item } from './../common/common';
import { ItemModel } from './../common/common-model';
import { DropDownButtonModel } from './drop-down-button-model';

const classNames: ClassNames = {
    DISABLED: 'e-disabled',
    FOCUS: 'e-focused',
    ICON: 'e-menu-icon',
    ITEM: 'e-item',
    POPUP: 'e-dropdown-popup',
    RTL: 'e-rtl',
    SEPARATOR: 'e-separator',
    VERTICAL: 'e-vertical'
};

/**
 * DropDownButton component is used to toggle contextual overlays for displaying list of action items.
 * It can contain both text and images.
 * ``````html
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
    protected dropDown: Popup;
    protected button: Button;
    protected activeElem: HTMLElement[];
    private rippleFn: Function;
    private delegateMousedownHandler: Function;

    /**
     * Defines the content of the DropDownButton element that can either be a text or HTML elements.
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Defines class/multiple classes separated by a space in the DropDownButton element. The
     * DropDownButton size and styles can be customized by using this.
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the DropDownButton is `disabled` or not.
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines class/multiple classes separated by a space for the DropDownButton that is used to
     * include an icon. DropDownButton can also include font icon and sprite image.
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Positions the icon before/top of the text content in the DropDownButton. The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     * @default "Left"
     */
    @Property('Left')
    public iconPosition: SplitButtonIconPosition;

    /**
     * Specifies action items with its properties which will be rendered as DropDownButton popup.
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];

    /**
     * Allows to specify the DropDownButton popup item element.
     * @default ""
     */
    @Property('')
    public target: string | Element;

    /**
     * Triggers while rendering each Popup item of DropDownButton.
     * @event
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the DropDownButton popup.
     * @event
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the DropDownButton popup.
     * @event
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the DropDownButton popup.
     * @event
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the DropDownButton popup.
     * @event
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item in DropDownButton popup.
     * @event
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Constructor for creating the widget
     * @param  {DropDownButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options?: DropDownButtonModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    protected preRender(): void {
        /** */
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * To open/close DropDownButton popup based on current state of the DropDownButton.
     * @returns void
     */
    public toggle(): void {
        this.canOpen() ? this.openPopUp() : this.closePopup();
    }

    /**
     * Initialize the Component rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
    }

    private createPopup(): void {
        let div: HTMLElement = this.createElement('div', {
            className: classNames.POPUP,
            id: this.element.id + '-popup'
        });
        document.body.appendChild(div);
        this.dropDown = new Popup(div, {
            relateTo: this.element,
            collision: { X: 'fit', Y: 'flip' },
            position: { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            content: this.target ? this.getTargetElement() as HTMLElement : '',
            enableRtl: this.enableRtl
        });
        if (this.dropDown.element.style.position === 'fixed') {
            this.dropDown.refreshPosition(this.element);
        }
        this.dropDown.hide();
        attributes(this.element, {
            ['role']: 'menu', ['aria-haspopup']: this.items.length || this.target ? 'true' : 'false', ['aria-expanded']: 'false',
            ['aria-owns']: this.getPopUpElement().id, ['type']: 'button'
        });
        if (this.cssClass) { addClass([div], this.cssClass.split(' ')); }
    }

    private getTargetElement(): Element {
        return typeof (this.target) === 'string' ? select(this.target as string) : this.target;
    }

    private createItems(items: ItemModel[]): HTMLElement {
        let showIcon: boolean = this.hasIcon(items, 'iconCss');
        let span: Element; let item: ItemModel; let li: Element; let eventArgs: MenuEventArgs;
        let ul: HTMLElement = this.createElement('ul', {
            attrs: { 'tabindex': '0' }
        });
        for (let i: number = 0; i < items.length; i++) {
            item = items[i];
            li = this.createElement('li', {
                innerHTML: item.url ? '' : item.text,
                className: item.separator ? classNames.ITEM + ' ' + classNames.SEPARATOR : classNames.ITEM,
                attrs: { 'role': 'menuItem', 'tabindex': '-1' },
                id: item.id ? item.id : getUniqueID('e-' + this.getModuleName() + '-item')
            });
            if (item.iconCss) {
                span = this.createElement('span', { className: classNames.ICON + ' ' + item.iconCss });
                li.insertBefore(span, li.childNodes[0]);
            } else {
                if (showIcon && !item.separator) {
                    li.classList.add('e-blank-icon');
                }
            }
            if (item.url) { li.appendChild(this.createAnchor(item)); }
            eventArgs = { item: item, element: li as HTMLElement };
            this.trigger('beforeItemRender', eventArgs);
            ul.appendChild(li);
        }
        return ul;
    }

    private hasIcon(items: ItemModel[], field: string): boolean {
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            if ((<{ [key: string]: object }>items[i])[field]) {
                return true;
            }
        }
        return false;
    }

    private createAnchor(item: ItemModel): HTMLElement {
        return this.createElement('a', { className: 'e-menu-text e-menu-url', innerHTML: item.text, attrs: { 'href': item.url } });
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
        this.createPopup();
        this.setActiveElem([this.element]);
    }

    private appendArrowSpan(): void {
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
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'dropdown-btn';
    }

    private canOpen(): boolean {
        return this.getPopUpElement().classList.contains('e-popup-close');
    }

    /**
     * Destroys the widget.
     * @returns void
     */
    public destroy(): void {
        super.destroy();
        if (this.getModuleName() === 'dropdown-btn') {
            let attrList: string[];
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
            attrList = this.element.getAttribute('class') ? ['role', 'aria-haspopup', 'aria-expanded', 'aria-owns', 'type']
            : ['role', 'aria-haspopup', 'aria-expanded', 'aria-owns', 'type', 'class'];
            attrList.forEach((key: string) => {
                this.element.removeAttribute(key);
            });
            this.dropDown.destroy();
            let popupEle: HTMLElement = document.getElementById(this.getPopUpElement().id);
            if (popupEle) {
                removeClass([popupEle], ['e-popup-open', 'e-popup-close']);
                detach(popupEle);
            }
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
    }

    protected getPopUpElement(): HTMLElement {
        return this.dropDown.element;
    }

    protected getULElement(): HTMLElement {
        return this.getPopUpElement().children[0] as HTMLElement;
    }

    protected wireEvents(): void {
        let popupElement: HTMLElement = this.getPopUpElement();
        this.delegateMousedownHandler = this.mousedownHandler.bind(this);
        EventHandler.add(document, 'mousedown touchstart', this.delegateMousedownHandler, this);
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(popupElement, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyBoardHandler, this);
        EventHandler.add(popupElement, 'keydown', this.keyBoardHandler, this);
        this.rippleFn = rippleEffect(popupElement, { selector: '.' + classNames.ITEM });
    }

    protected keyBoardHandler(e: KeyboardEventArgs): void {
        if (e.target === this.element && (e.keyCode === 9 || (!e.altKey && e.keyCode === 40) || e.keyCode === 38)) {
            return;
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

    protected upDownKeyHandler(e: KeyboardEventArgs): void {
        if (this.target && (e.keyCode === 38 || e.keyCode === 40)) {
            return;
        }
        e.preventDefault();
        let ul: Element = this.getULElement();
        let defaultIdx: number = e.keyCode === 40 ? 0 : ul.childElementCount - 1;
        let liIdx: number = defaultIdx;
        let li: Element = null;
        this.removeCustomSelection();
        for (let i: number = 0, len: number = ul.children.length; i < len; i++) {
            if (ul.children[i].classList.contains(classNames.FOCUS)) {
                li = ul.children[i];
                liIdx = i;
                li.classList.remove(classNames.FOCUS);
                e.keyCode === 40 ? liIdx++ : liIdx--;
                if (liIdx === (e.keyCode === 40 ? ul.childElementCount : -1)) {
                    liIdx = defaultIdx;
                }
            }
        }
        li = ul.children[liIdx];
        liIdx = this.isValidLI(li, liIdx, e.keyCode);
        if (liIdx !== -1) {
            addClass([ul.children[liIdx]], classNames.FOCUS);
            (ul.children[liIdx] as HTMLElement).focus();
        }
    }

    private removeCustomSelection(): void {
        let selectedLi: Element = this.getULElement().querySelector('.e-selected');
        if (selectedLi) {
            selectedLi.classList.remove('e-selected');
        }
    }

    private isValidLI(li: Element, index: number, keyCode: number, count: number = 0): number {
        if (li.classList.contains(classNames.SEPARATOR) || li.classList.contains(classNames.DISABLED)) {
            if (index === (keyCode === 40 ? this.items.length - 1 : 0)) {
                index = keyCode === 40 ? 0 : this.items.length - 1;
            } else {
                keyCode === 40 ? index++ : index--;
            }
        }
        li = this.getULElement().children[index];
        if (li.classList.contains(classNames.SEPARATOR) || li.classList.contains(classNames.DISABLED)) {
            count++;
            if (count === this.items.length) {
                return index = -1;
            }
            index = this.isValidLI(li, index, keyCode, count);
        }
        return index;
    }

    private keyEventHandler(e: KeyboardEventArgs): void {
        if (this.target && (e.keyCode === 13 || e.keyCode === 9)) {
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
        let trgt: HTMLElement = e.target as HTMLElement;
        if (!this.canOpen() && !(closest(trgt, '#' + this.getPopUpElement().id) || closest(trgt, '#' + this.element.id))) {
            this.closePopup(e);
        }
    }

    protected clickHandler(e: MouseEvent | KeyboardEventArgs): void {
        let trgt: HTMLElement = e.target as HTMLElement;
        let canOpen: boolean = this.canOpen();
        if (closest(trgt, '#' + this.element.id)) {
            if (canOpen) {
                this.openPopUp(e);
            } else {
                this.closePopup(e, this.activeElem[0]);
            }
        } else {
            if (closest(trgt, '#' + this.getPopUpElement().id)) {
                let eventArgs: MenuEventArgs;
                let liIdx: number;
                let item: ItemModel;
                let li: Element = this.getLI(trgt);
                if (li) {
                    liIdx = Array.prototype.indexOf.call(this.getULElement().children, li);
                    item = this.items[liIdx];
                    if (item) {
                        eventArgs = { element: li as HTMLElement, item: item };
                        this.trigger('select', eventArgs);
                    }
                    this.closePopup(e, this.activeElem[0]);
                }
            }
        }
    }

    private openPopUp(e: MouseEvent | KeyboardEventArgs = null): void {
        if (!this.target) {
            this.getPopUpElement().appendChild(this.createItems(this.items));
        }
        let ul: HTMLElement = this.getULElement();
        let beforeOpenArgs: BeforeOpenCloseMenuEventArgs = { element: ul, items: this.items, event: e, cancel: false };
        this.trigger('beforeOpen', beforeOpenArgs);
        if (!beforeOpenArgs.cancel) {
            this.dropDown.show(null, this.element);
            addClass([this.element], 'e-active');
            this.element.setAttribute('aria-expanded', 'true');
            ul.focus();
            let openArgs: OpenCloseMenuEventArgs = { element: ul, items: this.items };
            this.trigger('open', openArgs);
        }
    }

    private closePopup(e: MouseEvent | KeyboardEventArgs = null, focusEle?: HTMLElement): void {
        let ul: HTMLElement = this.getULElement();
        let beforeCloseArgs: BeforeOpenCloseMenuEventArgs = { element: ul, items: this.items, event: e, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs);
        if (!beforeCloseArgs.cancel) {
            this.removeCustomSelection();
            this.dropDown.hide();
            removeClass(this.activeElem, 'e-active');
            this.element.setAttribute('aria-expanded', 'false');
            if (focusEle) {
                focusEle.focus();
            }
            let closeArgs: OpenCloseMenuEventArgs = { element: ul, items: this.items };
            this.trigger('close', closeArgs);
            if (!this.target && ul) { detach(ul); }
        }
    }

    protected unWireEvents(): void {
        EventHandler.remove(document, 'mousedown touchstart', this.delegateMousedownHandler);
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(this.getPopUpElement(), 'click', this.clickHandler);
        EventHandler.remove(this.element, 'keydown', this.keyBoardHandler);
        EventHandler.remove(this.getPopUpElement(), 'keydown', this.keyBoardHandler);
        this.rippleFn();
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {DropDownButtonModel} newProp
     * @param  {DropDownButtonModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: DropDownButtonModel, oldProp: DropDownButtonModel): void {
        let btnModel: string[] = ['content', 'cssClass', 'iconCss', 'iconPosition', 'disabled', 'enableRtl'];
        this.button.setProperties(getModel(newProp, btnModel));
        let popupElement: Element = this.getPopUpElement();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'content':
                    if (!this.element.querySelector('span.e-caret')) {
                        this.appendArrowSpan();
                    }
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.unWireEvents();
                        if (!this.canOpen()) {
                            this.closePopup();
                        }
                    } else {
                        this.wireEvents();
                    }
                    break;
                case 'cssClass':
                    if (newProp.cssClass.indexOf(classNames.VERTICAL) > -1) {
                        let arrowSpan: Element = this.element.querySelector('span.e-caret');
                        classList(arrowSpan, ['e-icon-bottom'], ['e-icon-right']);
                    }
                    if (oldProp.cssClass) {
                        removeClass([popupElement], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([popupElement], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    popupElement.classList.toggle(classNames.RTL);
                    break;
                case 'target':
                    this.target = newProp.target;
                    detach(this.getULElement());
                    popupElement.appendChild(this.getTargetElement());
                    this.dropDown.content = this.getTargetElement() as HTMLElement;
                    break;
                case 'items':
                    this.dropDown.refresh();
                    if (popupElement.classList.contains('e-popup-open')) {
                        classList(popupElement, ['e-popup-close'], ['e-popup-open']);
                    }
                    break;
            }
        }
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
}