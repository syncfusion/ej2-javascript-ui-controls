// eslint-disable-next-line @typescript-eslint/triple-slash-reference
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
     *
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Defines class/multiple classes separated by a space in the SplitButton element. The SplitButton
     * size and styles can be customized by using this.
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the SplitButton is disabled or not.
     *
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines class/multiple classes separated by a space for the SplitButton that is used to include an
     * icon. SplitButton can also include font icon and sprite image.
     *
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Positions the icon before/top of the text content in the SplitButton. The possible values are
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     *
     * @default "Left"
     */
    @Property('Left')
    public iconPosition: SplitButtonIconPosition;

    /**
     * Specifies the popup element creation on open.
     *
     * @default false
     */
    @Property(false)
    public createPopupOnClick: boolean;

    /**
     * Specifies action items with its properties which will be rendered as SplitButton secondary button popup.
     *
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];

    /**
     * Allows to specify the SplitButton popup item element.
     *
     * @default ""
     */
    @Property('')
    public target: string | Element;

    /**
     * Triggers while rendering each Popup item of SplitButton.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the SplitButton popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the SplitButton popup.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when the primary button of SplitButton has been clicked.
     *
     * @event click
     */
    @Event()
    public click: EmitType<ClickEventArgs>;

    /**
     * Triggers while closing the SplitButton popup.
     *
     * @event close
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the SplitButton popup.
     *
     * @event open
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item of SplitButton popup.
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
     * @param  {SplitButtonModel} options - Specifies the splitbutton model
     * @param  {string|HTMLButtonElement} element - Specifies the element
     * @hidden
     */
    public constructor(options?: SplitButtonModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    /**
     * Initialize Angular support.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        let ele: Element = this.element;
        if (ele.tagName === TAGNAME) {
            const ejInstance: Object = getValue('ej2_instances', ele);
            const btn: Element = this.createElement('button', { attrs: { 'type': 'button' } });
            const wrapper: HTMLElement = this.createElement(TAGNAME, { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (let idx: number = 0, len: number = ele.attributes.length; idx < len; idx++) {
                btn.setAttribute(ele.attributes[idx as number].nodeName, ele.attributes[idx as number].nodeValue);
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
    /**
     * Initialize the Component rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initWrapper();
        this.createPrimaryButton();
        this.renderControl();
    }

    private renderControl(): void {
        this.createSecondaryButton();
        this.setActiveElem([this.element, this.secondaryBtnObj.element]);
        this.setAria();
        this.wireEvents();
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
        super.addItems(items, text);
        this.secondaryBtnObj.items = this.items;
    }
    /**
     * Removes the items from the menu.
     *
     * @param  { string[] } items - Specifies an array of string to remove the items.
     * @param { string } isUniqueId - Set `true` if specified items is a collection of unique id.
     * @returns {void}.
     */
    public removeItems(items: string[], isUniqueId?: boolean): void {
        super.removeItems(items, isUniqueId);
        this.secondaryBtnObj.items = this.items;
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
            addClass([this.wrapper], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
    }

    private createPrimaryButton(): void {
        const btnModel: ButtonModel = {
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
        const btnElem : HTMLButtonElement = this.createElement('button', {
            className: 'e-icon-btn',
            attrs: { 'tabindex': '-1' },
            id: this.element.id + '_dropdownbtn'
        }) as HTMLButtonElement;
        this.wrapper.appendChild(btnElem);
        const dropDownBtnModel: SplitButtonModel = {
            cssClass: this.cssClass,
            disabled: this.disabled,
            enableRtl: this.enableRtl,
            items: this.items,
            target: this.target,
            createPopupOnClick: this.createPopupOnClick
        };
        dropDownBtnModel.beforeItemRender = (args: MenuEventArgs): void => {
            if (this.createPopupOnClick) {
                this.secondaryBtnObj.dropDown.relateTo = this.wrapper;
                this.dropDown = this.secondaryBtnObj.dropDown;
            }
            this.trigger('beforeItemRender', args);
        };
        dropDownBtnModel.open = (args: OpenCloseMenuEventArgs): void => {
            this.trigger('open', args);
        };
        dropDownBtnModel.close = (args: OpenCloseMenuEventArgs): void => {
            this.trigger('close', args);
        };
        dropDownBtnModel.select = (args: MenuEventArgs): void => {
            this.trigger('select', args);
        };
        dropDownBtnModel.beforeOpen = (args: BeforeOpenCloseMenuEventArgs): Deferred | void => {
            if (this.createPopupOnClick && this.items.length === 0) {
                this.secondaryBtnObj.dropDown.relateTo = this.wrapper;
                this.dropDown = this.secondaryBtnObj.dropDown;
            }
            const callBackPromise: Deferred = new Deferred();
            this.trigger('beforeOpen', args, (observedArgs: BeforeOpenCloseMenuEventArgs) => {
                callBackPromise.resolve(observedArgs);
            });
            return callBackPromise;
        };
        dropDownBtnModel.beforeClose = (args: BeforeOpenCloseMenuEventArgs): Deferred | void => {
            const callBackPromise: Deferred = new Deferred();
            this.trigger('beforeClose', args, (observedArgs: BeforeOpenCloseMenuEventArgs) => {
                callBackPromise.resolve(observedArgs);
            });
            return callBackPromise;
        };
        this.secondaryBtnObj = new DropDownButton(dropDownBtnModel);
        this.secondaryBtnObj.createElement = this.createElement;
        this.secondaryBtnObj.appendTo(btnElem);
        if (!this.createPopupOnClick) {
            this.secondaryBtnObj.dropDown.relateTo = this.wrapper;
            this.dropDown = this.secondaryBtnObj.dropDown;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).isPopupCreated = (this.secondaryBtnObj as any).isPopupCreated;
        this.secondaryBtnObj.activeElem = [this.element, this.secondaryBtnObj.element];
        this.secondaryBtnObj.element.querySelector('.e-btn-icon').classList.remove('e-icon-right');
        if (this.disabled) {
            this.wrapper.classList.add('e-splitbtn-disabled');
        }
    }

    private setAria(): void {
        attributes(this.element, {
            'aria-expanded': 'false', 'aria-haspopup': 'true',
            'aria-label': this.element.textContent ? this.element.textContent + ' splitbutton' : 'splitbutton', 'aria-owns': this.element.id + '_dropdownbtn-popup'
        });
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'split-btn';
    }

    /**
     * To open/close SplitButton popup based on current state of the SplitButton.
     *
     * @returns {void}
     */
    public toggle(): void {
        this.secondaryBtnObj.toggle();
    }

    public destroy(): void {
        let classList: string[] = [RTL];
        if (this.cssClass) {
            classList = classList.concat(this.cssClass.split(' '));
        }
        if (this.element) {
            const element: Element = document.getElementById(this.element.id);
            if (element && element.parentElement === this.wrapper) {
                if (this.wrapper.tagName === TAGNAME) {
                    this.wrapper.innerHTML = '';
                    removeClass([this.wrapper], ['e-rtl', 'e-' + this.getModuleName() + '-wrapper']);
                    removeClass([this.wrapper], this.cssClass.split(' '));
                } else {
                    removeClass([this.element], classList);
                    ['aria-label', 'aria-haspopup', 'aria-expanded', 'aria-owns', 'type'].forEach((key: string) => {
                        this.element.removeAttribute(key);
                    });
                    this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
                    remove(this.wrapper);
                }
                this.unWireEvents();
            }
        }
        this.primaryBtnObj.destroy();
        this.secondaryBtnObj.destroy();
        super.destroy();
        if (this.element && !this.element.getAttribute('class')) {
            this.element.removeAttribute('class');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.refreshing && (this as any).isAngular) {
            this.element = this.wrapper as HTMLButtonElement;
            ['e-control', 'e-split-btn', 'e-lib'].forEach((key: string) => {
                this.element.classList.add(key);
            });
            setValue('ej2_instances', [this], this.element);
        }
        this.wrapper = null;
    }

    protected wireEvents(): void {
        EventHandler.add(this.element, 'click', this.primaryBtnClickHandler, this);
        new KeyboardEvents(this.element, {
            keyAction: this.btnKeyBoardHandler.bind(this),
            keyConfigs: {
                altdownarrow: 'alt+downarrow',
                enter: 'enter'
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
        case 'enter':
            this.clickHandler(e);
            if (this.getPopUpElement() && !this.getPopUpElement().classList.contains('e-popup-close')) {
                this.element.classList.remove('e-active');
                this.secondaryBtnObj.element.classList.add('e-active');
            } else {
                this.secondaryBtnObj.element.classList.remove('e-active');
            }
            break;
        }
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {SplitButtonModel} newProp - Specifies new properties
     * @param  {SplitButtonModel} oldProp - Specifies old properties
     * @returns {void}
     */
    public onPropertyChanged(newProp: SplitButtonModel, oldProp: SplitButtonModel): void {
        let model: string[] = ['content', 'iconCss', 'iconPosition', 'cssClass', 'disabled', 'enableRtl'];
        this.primaryBtnObj.setProperties(getModel(newProp, model));
        model = ['beforeOpen', 'beforeItemRender', 'select', 'open',
            'close', 'cssClass', 'disabled', 'enableRtl', 'createPopupOnClick'];
        if (Object.keys(newProp).indexOf('items') > -1) {
            this.secondaryBtnObj.items = newProp.items;
            this.secondaryBtnObj.dataBind();
        }
        this.secondaryBtnObj.setProperties(getModel(newProp, model));
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.wrapper], oldProp.cssClass.split(' '));
                }
                addClass([this.wrapper], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    addClass([this.wrapper], RTL);
                } else {
                    removeClass([this.wrapper], RTL);
                }
                break;
            case 'disabled':
                if (newProp.disabled) {
                    addClass([this.wrapper], 'e-splitbtn-disabled');
                } else {
                    removeClass([this.wrapper], 'e-splitbtn-disabled');
                }
            }
        }
    }

    /**
     * Sets the focus to SplitButton
     * its native method
     *
     * @public
     * @returns {void}
     */
    public focusIn(): void {
        this.element.focus();
    }
}
/**
 * Interface for Split Button click event arguments.
 */
export interface ClickEventArgs extends BaseEventArgs {
    element: Element;
}
/**
 * Deferred is used to handle asynchronous operation.
 */
export class Deferred {
    /**
     * Reject a Deferred object and call failCallbacks with the given args.
     */
    public reject: Function;
    /**
     * Resolve a Deferred object and call doneCallbacks with the given args.
     */
    public resolve: Function;
    /**
     * Promise is an object that represents a value that may not be available yet, but will be resolved at some point in the future.
     */
    public promise: Promise<Object> = new Promise((resolve: Function, reject: Function) => {
        this.resolve = resolve;
        this.reject = reject;
    });
    /**
     * Defines the callback function triggers when the Deferred object is rejected.
     */
    public catch: Function = this.promise.catch.bind(this.promise);
    /**
     * Defines the callback function triggers when the Deferred object is resolved.
     */
    public then: Function = this.promise.then.bind(this.promise);
}
