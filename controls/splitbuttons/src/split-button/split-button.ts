/// <reference path='../drop-down-button/drop-down-button-model.d.ts'/>
import { Event, EmitType, remove, addClass, removeClass, detach, getValue, setValue } from '@syncfusion/ej2-base';
import { EventHandler, Collection, BaseEventArgs, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
import { attributes, getUniqueID, getInstance, KeyboardEvents, KeyboardEventArgs, isBlazor } from '@syncfusion/ej2-base';
import { Button, ButtonModel, buttonObserver } from '@syncfusion/ej2-buttons';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from './../common/common';
import { getModel, SplitButtonIconPosition, Item } from './../common/common';
import { DropDownButton, dropDownButtonObserver } from '../drop-down-button/drop-down-button';
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
     * @blazorProperty 'OnItemRender'
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the SplitButton popup.
     * @event
     * @blazorProperty 'OnOpen'
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the SplitButton popup.
     * @event
     * @blazorProperty 'OnClose'
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when the primary button of SplitButton has been clicked.
     * @event
     * @blazorProperty 'Clicked'
     */
    @Event()
    public click: EmitType<ClickEventArgs>;

    /**
     * Triggers while closing the SplitButton popup.
     * @event
     * @blazorProperty 'Closed'
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the SplitButton popup.
     * @event
     * @blazorProperty 'Opened'
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item of SplitButton popup.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
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
        if (isBlazor() && this.isServerRendered) {
            return;
        }
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
        if (isBlazor() && this.isServerRendered) {
            buttonObserver.on('component-rendered', this.buttonInstance, this, this.element.id);
            dropDownButtonObserver.on('component-rendered', this.dropDownButtonInstance, this, this.element.id);
        } else {
            this.initWrapper();
            this.createPrimaryButton();
            this.renderControl();
        }
    }

    private buttonInstance(args: { instance: Button, id: string }): void {
        if (this.element.id === args.instance.element.id) {
            this.primaryBtnObj = args.instance;
            buttonObserver.off('component-rendered', this.buttonInstance, this.element.id);
        }
    }

    private dropDownButtonInstance(args: { instance: DropDownButton, id: string }): void {
        if (args.instance.element.id.indexOf(this.element.id) > -1) {
            this.secondaryBtnObj = args.instance;
            this.renderControl();
            dropDownButtonObserver.off('component-rendered', this.dropDownButtonInstance, this.element.id);
        }
    }

    private renderControl(): void {
        this.createSecondaryButton();
        this.setActiveElem([this.element, this.secondaryBtnObj.element]);
        this.setAria();
        this.wireEvents();
        this.renderComplete();
    }

    public addItems(items: ItemModel[], text?: string): void {
        super.addItems(items, text);
        this.secondaryBtnObj.items = this.items;
    }

    public removeItems(items: string[]): void {
        super.removeItems(items);
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
        let dropDownBtnModel: SplitButtonModel;
        let btnElem: HTMLButtonElement;
        if (isBlazor() && this.isServerRendered) {
            this.wrapper = this.element.parentElement;
            dropDownBtnModel = this.secondaryBtnObj;
        } else {
            btnElem = this.createElement('button', {
                className: 'e-icon-btn',
                attrs: { 'tabindex': '-1' },
                id: this.element.id + '_dropdownbtn'
            }) as HTMLButtonElement;
            this.wrapper.appendChild(btnElem);
            dropDownBtnModel = {
                cssClass: this.cssClass,
                disabled: this.disabled,
                enableRtl: this.enableRtl,
                items: this.items,
                target: this.target,
            };
        }
        dropDownBtnModel.beforeItemRender = (args: MenuEventArgs): void => {
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
            let callBackPromise: Deferred = new Deferred();
            this.trigger('beforeOpen', args, (observedArgs: BeforeOpenCloseMenuEventArgs) => {
                callBackPromise.resolve(observedArgs);
            });
            return callBackPromise;
        };
        dropDownBtnModel.beforeClose = (args: BeforeOpenCloseMenuEventArgs): Deferred | void => {
            let callBackPromise: Deferred = new Deferred();
            this.trigger('beforeClose', args, (observedArgs: BeforeOpenCloseMenuEventArgs) => {
                callBackPromise.resolve(observedArgs);
            });
            return callBackPromise;
        };
        if (!(isBlazor() && this.isServerRendered)) {
            this.secondaryBtnObj = new DropDownButton(dropDownBtnModel);
            this.secondaryBtnObj.createElement = this.createElement;
            this.secondaryBtnObj.appendTo(btnElem);
        }
        this.secondaryBtnObj.dropDown.relateTo = this.wrapper;
        this.dropDown = this.secondaryBtnObj.dropDown;
        this.secondaryBtnObj.activeElem = [this.element, this.secondaryBtnObj.element];
        EventHandler.remove(this.getPopUpElement(), 'keydown', this.secondaryBtnObj.keyBoardHandler);
        this.secondaryBtnObj.element.querySelector('.e-btn-icon').classList.remove('e-icon-right');
    }

    private setAria(): void {
        attributes(this.element, {
            'aria-expanded': 'false', 'aria-haspopup': 'true',
            'aria-label': this.element.textContent + ' splitbutton', 'aria-owns': this.secondaryBtnObj.dropDown.element.id
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
        if (!(isBlazor() && this.isServerRendered)) {
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
                ['aria-label', 'aria-haspopup', 'aria-expanded',
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
    } else {
        EventHandler.remove(this.element, 'click', this.primaryBtnClickHandler);
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
    public onPropertyChanged(newProp: SplitButtonModel, oldProp: SplitButtonModel): void {
        let model: string[] = ['content', 'iconCss', 'iconPosition', 'cssClass', 'disabled', 'enableRtl'];
        this.primaryBtnObj.setProperties(getModel(newProp, model));
        model = ['beforeOpen', 'beforeItemRender', 'select', 'open',
            'close', 'cssClass', 'disabled', 'enableRtl'];
        if (Object.keys(newProp).indexOf('items') > -1) {
            this.secondaryBtnObj.items = newProp.items;
            this.secondaryBtnObj.dataBind();
        }
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

    /**
     * Sets the focus to SplitButton
     * its native method
     * @public
     */
    public focusIn(): void {
        this.element.focus();
    }
}

export interface ClickEventArgs extends BaseEventArgs {
    element: Element;
}
/**
 * Deferred is used to handle asynchronous operation.
 */
export class Deferred {
    /**
     * Resolve a Deferred object and call doneCallbacks with the given args.
     */
    public resolve: Function;
    /**
     * Reject a Deferred object and call failCallbacks with the given args.
     */
    public reject: Function;
    /**
     * Promise is an object that represents a value that may not be available yet, but will be resolved at some point in the future. 
     */
    public promise: Promise<Object> = new Promise((resolve: Function, reject: Function) => {
        this.resolve = resolve;
        this.reject = reject;
    });
    /**
     * Defines the callback function triggers when the Deferred object is resolved.
     */
    public then: Function = this.promise.then.bind(this.promise);
    /**
     * Defines the callback function triggers when the Deferred object is rejected.
     */
    public catch: Function = this.promise.catch.bind(this.promise);
}
