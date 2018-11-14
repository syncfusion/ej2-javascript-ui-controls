/// <reference path='../drop-down-button/drop-down-button-model.d.ts'/>
import { Event, EmitType, remove, addClass, removeClass, detach, getValue, setValue } from '@syncfusion/ej2-base';
import { EventHandler, Collection, BaseEventArgs, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
import { attributes, getUniqueID, getInstance, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from './../common/common';
import { getModel, SplitButtonIconPosition, Item } from './../common/common';
import { DropDownButton } from '../drop-down-button/drop-down-button';
import { ItemModel } from './../common/common-model';
import { SplitButtonModel } from './split-button-model';

const RTL: string = 'e-rtl';

const TAGNAME: string = 'EJS-SPLITBUTTON';

/**
 * SplitButton component has primary and secondary button. Primary button is used to select 
 * default action and secondary button is used to toggle contextual overlays for displaying list of 
 * action items. It can contain both text and images.
 * ```html
 * <button id="element"></button>
 * ```
 * ```typescript
 * <script>
 * var splitBtnObj = new SplitButton({content: 'SplitButton'});
 * splitBtnObj.appendTo("#element");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class SplitButton extends DropDownButton implements INotifyPropertyChanged {
    private wrapper: HTMLElement;
    private primaryBtnObj: Button;
    private secondaryBtnObj: DropDownButton;

    /**
     * Defines the content of the SplitButton primary action button can either be a text or HTML elements.
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Defines class/multiple classes separated by a space in the SplitButton element. The SplitButton
     * size and styles can be customized by using this.
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the SplitButton is disabled or not.
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines class/multiple classes separated by a space for the SplitButton that is used to include an 
     * icon. SplitButton can also include font icon and sprite image.
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Positions the icon before/top of the text content in the SplitButton. The possible values are
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     * @default "Left"
     */
    @Property('Left')
    public iconPosition: SplitButtonIconPosition;

    /**
     * Specifies action items with its properties which will be rendered as SplitButton secondary button popup.
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];

    /**
     * Allows to specify the SplitButton popup item element.
     * @default ""
     */
    @Property('')
    public target: string | Element;

    /**
     * Triggers while rendering each Popup item of SplitButton.
     * @event
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the SplitButton popup.
     * @event
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the SplitButton popup.
     * @event
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when the primary button of SplitButton has been clicked.
     * @event
     */
    @Event()
    public click: EmitType<ClickEventArgs>;

    /**
     * Triggers while closing the SplitButton popup.
     * @event
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the SplitButton popup.
     * @event
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item of SplitButton popup.
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
     * @param  {SplitButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options?: SplitButtonModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    /**
     * Initialize Angular support.
     * @private
     */
    protected preRender(): void {
        let ele: Element = this.element;
        if (ele.tagName === TAGNAME) {
            let ejInstance: Object = getValue('ej2_instances', ele);
            let btn: Element = this.createElement('button', { attrs: { 'type': 'button' } });
            let wrapper: HTMLElement = this.createElement(TAGNAME, { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (let idx: number = 0, len: number = ele.attributes.length; idx < len; idx++) {
                btn.setAttribute(ele.attributes[idx].nodeName, ele.attributes[idx].nodeValue);
            }
            ele.parentNode.insertBefore(wrapper, ele);
            detach(ele);
            ele = btn;
            wrapper.appendChild(ele);
            setValue('ej2_instances', ejInstance, ele);
            this.wrapper = wrapper;
            this.element = ele as HTMLButtonElement;
        }
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
    }

    public render(): void {
        this.initWrapper();
        this.createPrimaryButton();
        this.createSecondaryButton();
        this.setActiveElem([this.element, this.secondaryBtnObj.element]);
        this.setAria();
        this.wireEvents();
    }

    private initWrapper(): void {
        if (!this.wrapper) {
            this.wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
            this.element.parentNode.insertBefore(this.wrapper, this.element);
        }
        this.element.classList.remove('e-' + this.getModuleName());
        if (this.enableRtl) {
            this.wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([this.wrapper], this.cssClass.split(' '));
        }
    }

    private createPrimaryButton(): void {
        let btnModel: ButtonModel = {
            cssClass: this.cssClass,
            enableRtl: this.enableRtl,
            iconCss: this.iconCss,
            iconPosition: this.iconPosition,
            content: this.content,
            disabled: this.disabled
        };
        this.primaryBtnObj = new Button(btnModel);
        this.primaryBtnObj.createElement = this.createElement;
        this.primaryBtnObj.appendTo(this.element);
        this.element.classList.add('e-' + this.getModuleName());
        this.element.type = 'button';
        this.wrapper.appendChild(this.element);
    }

    private createSecondaryButton(): void {
        let btnElem: HTMLButtonElement = this.createElement('button', {
            className: 'e-icon-btn',
            attrs: { 'tabindex': '-1' },
            id: this.element.id + '_dropdownbtn'
        }) as HTMLButtonElement;
        this.wrapper.appendChild(btnElem);
        let dropDownBtnModel: SplitButtonModel = {
            cssClass: this.cssClass,
            disabled: this.disabled,
            enableRtl: this.enableRtl,
            items: this.items,
            target: this.target,
            beforeItemRender: (args: MenuEventArgs) => {
                this.trigger('beforeItemRender', args);
            },
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                this.trigger('beforeOpen', args);
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                this.trigger('beforeClose', args);
            },
            open: (args: OpenCloseMenuEventArgs) => {
                this.trigger('open', args);
            },
            close: (args: OpenCloseMenuEventArgs) => {
                this.trigger('close', args);
            },
            select: (args: MenuEventArgs) => {
                this.trigger('select', args);
            }
        };
        this.secondaryBtnObj = new DropDownButton(dropDownBtnModel);
        this.secondaryBtnObj.createElement = this.createElement;
        this.secondaryBtnObj.appendTo(btnElem);
        (this.secondaryBtnObj as SplitButton).dropDown.relateTo = this.wrapper;
        this.dropDown = (this.secondaryBtnObj as SplitButton).dropDown;
        (this.secondaryBtnObj as SplitButton).activeElem = [this.element, this.secondaryBtnObj.element];
        EventHandler.remove(this.getPopUpElement(), 'keydown', (this.secondaryBtnObj as SplitButton).keyBoardHandler);
        this.secondaryBtnObj.element.querySelector('.e-btn-icon').classList.remove('e-icon-right');
    }

    private setAria(): void {
        attributes(this.element, {
            'role': 'listbox', 'aria-expanded': 'false', 'aria-haspopup': 'true',
            'aria-label': this.element.textContent + ' splitbutton', 'aria-owns': (this.secondaryBtnObj as SplitButton).dropDown.element.id
        });
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'split-btn';
    }

    /**
     * To open/close SplitButton popup based on current state of the SplitButton.
     * @returns void
     */
    public toggle(): void {
        this.secondaryBtnObj.toggle();
    }

    public destroy(): void {
        let classList: string[] = [RTL];
        let element: Element = document.getElementById(this.element.id);
        if (this.cssClass) {
           classList = classList.concat(this.cssClass.split(' '));
        }
        if (element && element.parentElement === this.wrapper) {
            if (this.wrapper.tagName === TAGNAME) {
                this.wrapper.innerHTML = '';
                removeClass([this.wrapper], ['e-rtl', 'e-' + this.getModuleName() + '-wrapper']);
                removeClass([this.wrapper], this.cssClass.split(' '));
            } else {
                removeClass([this.element], classList);
                ['role', 'aria-label', 'aria-haspopup', 'aria-expanded',
                'aria-owns', 'type'].forEach((key: string) => {
                    this.element.removeAttribute(key);
                });
                this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
                remove(this.wrapper);
            }
            this.unWireEvents();
        }
        this.primaryBtnObj.destroy();
        this.secondaryBtnObj.destroy();
        super.destroy();
        if (!this.element.getAttribute('class')) {
            this.element.removeAttribute('class');
        }
    }

    protected wireEvents(): void {
        EventHandler.add(this.element, 'click', this.primaryBtnClickHandler, this);
        EventHandler.add(this.getPopUpElement(), 'keydown', this.keyBoardHandler, this);
        new KeyboardEvents(this.element, {
            keyAction: this.btnKeyBoardHandler.bind(this),
            keyConfigs: {
                altdownarrow: 'alt+downarrow'
            }
        });
    }

    protected unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.primaryBtnClickHandler);
        (getInstance(this.element, KeyboardEvents) as KeyboardEvents).destroy();
    }

    private primaryBtnClickHandler(): void {
        this.trigger('click', { element: this.element });
    }

    private btnKeyBoardHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'altdownarrow':
                this.clickHandler(e);
                break;
        }
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {SplitButtonModel} newProp
     * @param  {SplitButtonModel} oldProp
     * @returns void
     */
    public onPropertyChanged(newProp: SplitButton, oldProp: SplitButton): void {
        let model: string[] = ['content', 'iconCss', 'iconPosition', 'cssClass', 'disabled', 'enableRtl'];
        this.primaryBtnObj.setProperties(getModel(newProp, model));
        model = ['items', 'beforeOpen', 'beforeItemRender', 'select', 'open',
            'close', 'cssClass', 'disabled', 'enableRtl'];
        this.secondaryBtnObj.setProperties(getModel(newProp, model));
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.wrapper], oldProp.cssClass.split(' '));
                    }
                    addClass([this.wrapper], newProp.cssClass.split(' '));
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        addClass([this.wrapper], RTL);
                    } else {
                        removeClass([this.wrapper], RTL);
                    }
                    break;
            }
        }
    }
}

export interface ClickEventArgs extends BaseEventArgs {
    element: Element;
}