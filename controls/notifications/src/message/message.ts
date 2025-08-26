import { Component, INotifyPropertyChanged, NotifyPropertyChanges, addClass, removeClass, L10n, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { EmitType, Event, Property, detach, EventHandler, isNullOrUndefined as isNOU, compile, append } from '@syncfusion/ej2-base';
import { MessageModel } from './message-model';

/**
 * Specifies the type of severity to display the message with distinctive icons and colors.
 */
export enum Severity {
    /**
     * The message is displayed with icons and colors to denote it as a normal message.
     */
    Normal = 'Normal',
    /**
     * The message is displayed with icons and colors to denote it as a success message.
     */
    Success = 'Success',
    /**
     * The message is displayed with icons and colors to denote it as information.
     */
    Info = 'Info',
    /**
     * The message is displayed with icons and colors to denote it as a warning message.
     */
    Warning = 'Warning',
    /**
     * The message is displayed with icons and colors to denote it as an error message.
     */
    Error = 'Error'
}

/**
 * Specifies the predefined appearance variants for the component to display.
 */
export enum Variant {
    /**
     * Denotes the severity is differentiated using text color and light background color.
     */
    Text = 'Text',
    /**
     * Denotes the severity is differentiated using text color and border without background.
     */
    Outlined = 'Outlined',
    /**
     * Denotes the severity is differentiated using text color and dark background color.
     */
    Filled = 'Filled'
}

const MSG_ICON: string = 'e-msg-icon';
const MSG_CLOSE_ICON: string = 'e-msg-close-icon';
const MSG_CONTENT: string = 'e-msg-content';
const MSG_CONTENT_CENTER: string = 'e-content-center';
const RTL: string = 'e-rtl';
const SUCCESS: string = 'e-success';
const WARNING: string = 'e-warning';
const INFO: string = 'e-info';
const ERROR: string = 'e-error';
const OUTLINED: string = 'e-outlined';
const FILLED: string = 'e-filled';
const HIDE: string = 'e-hidden';

/**
 * Provides information about the closed event.
 */
export interface MessageCloseEventArgs {
    /**
     * Returns the element.
     */
    element: Element
    /**
     * Returns the original event arguments.
     */
    event: Event
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean
}

/**
 * The Message component displays messages with severity by differentiating icons and colors to denote the importance and context of the message to the end user.
 * ```html
 * <div id="msg"></div>
 * <script>
 *   var msgObj: Message = new Message({
 *      content: 'Editing is restricted',
 *      showCloseIcon: true
 *   })
 *   msgObj.appendTo('#msg');
 * </script>
 * ```
 *
 */
@NotifyPropertyChanges
export class Message extends Component<HTMLElement> implements INotifyPropertyChanged {

    private iconElement: HTMLElement;
    private closeIcon: HTMLElement;
    private txtElement: HTMLElement;
    private initialRender: boolean = true;
    private l10n: L10n;
    private innerContent: HTMLElement | string;
    private msgElement: HTMLElement;

    /**
     * Specifies the content to be displayed in the Message component. It can be a paragraph, a list, or any other HTML element.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public content: string | Function;

    /**
     * Specifies the CSS class or multiple classes separated by space that can be appended to the root element of the Message component to customize the message.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Shows or hides the severity icon in the Message component. When set to true, the severity icon is displayed at the left edge of the Message component.
     * This icon will be distinctive based on the severity property.
     *
     * @default true
     */
    @Property(true)
    public showIcon: boolean;

    /**
     * Shows or hides the close icon in the Message component. An end user can click the close icon to hide the message. The closed event is triggered when the message is closed.
     *
     * @default false
     */
    @Property(false)
    public showCloseIcon: boolean;

    /**
     * Specifies the severity of the message, which is used to define the appearance (icons and colors) of the message. The available severity messages are Normal, Success, Info, Warning, and Error.
     *
     * @isenumeration true
     * @default Severity.Normal
     * @asptype Severity
     */
    @Property('Normal')
    public severity: string | Severity;

    /**
     * Specifies the variant from predefined appearance variants to display the content of the Message component. The available variants are Text, Outlined, and Filled.
     *
     * @isenumeration true
     * @default Variant.Text
     * @asptype Variant
     */
    @Property('Text')
    public variant: string | Variant;

    /**
     * Shows or hides the visibility of the Message component. When set to false, the Message component will be hidden.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Triggers when the Message component is created successfully.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the Message component is destroyed successfully.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Event>;

    /**
     * Triggers when the Message component is closed successfully.
     *
     * @event closed
     */
    @Event()
    public closed: EmitType<MessageCloseEventArgs>

    /**
     * Constructor for creating the Message component widget.
     *
     * @param {MessageModel}options - Specifies the Message component interface.
     * @param {HTMLElement}element - Specifies the target element.
     */
    constructor(options?: MessageModel, element?: HTMLElement) {
        super(options, element);
    }

    /**
     * Gets the Message component module name.
     *
     * @returns {string} - Returns the string.
     * @private
     */
    public getModuleName(): string {
        return 'message';
    }

    /**
     * Get the persisted state properties of the Message component.
     *
     * @returns {string} - Returns the string.
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Method to initialize the variables for the Message component.
     *
     * @returns {void}
     * @private
     */
    public preRender(): void {
        const localeText: object = { close: 'Close' };
        this.l10n = new L10n('message', localeText, this.locale);
    }

    /**
     * Method to initialize the Message component rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.innerContent = this.element.innerHTML;
        this.element.innerHTML = '';
        this.msgElement = this.createElement('div', { className: 'e-msg-content-wrap' });
        this.initialize();
        this.wireEvents();
        this.renderComplete();
        this.renderReactTemplates();
        this.initialRender = false;
    }

    private initialize(): void {
        this.element.setAttribute('role', 'alert');
        this.setCssClass();
        this.setIcon();
        this.setContent();
        this.setCloseIcon();
        this.setSeverity();
        this.setVariant();
        this.setVisible();
        if (this.enableRtl) {
            this.element.classList.add(RTL);
        }
    }

    private setIcon(): void {
        if (this.showIcon) {
            this.iconElement = this.createElement('span', { className: MSG_ICON });
            if (this.element.classList.contains(MSG_CONTENT_CENTER)) {
                this.msgElement.appendChild(this.iconElement);
            } else {
                this.element.appendChild(this.iconElement);
            }
        }
    }

    private setCloseIcon(): void {
        if (this.showCloseIcon) {
            this.closeIcon = this.createElement('button', { attrs: { type: 'button', class: MSG_CLOSE_ICON }});
            this.element.appendChild(this.closeIcon);
            this.setTitle();
        }
    }

    private setTitle(): void {
        this.l10n.setLocale(this.locale);
        const closeIconTitle: string = this.l10n.getConstant('close');
        this.closeIcon.setAttribute('title', closeIconTitle);
        this.closeIcon.setAttribute('aria-label', closeIconTitle);
    }

    private setContent(): void {
        this.txtElement = this.createElement('div', { className: MSG_CONTENT });
        if (this.element.classList.contains(MSG_CONTENT_CENTER)) {
            this.msgElement.appendChild(this.txtElement);
            this.element.appendChild(this.msgElement);
        } else {
            this.element.appendChild(this.txtElement);
        }
        this.setTemplate();
    }

    private setTemplate(): void {
        let templateFn: Function;
        if (isNOU(this.content) || this.content === '') {
            this.txtElement.innerHTML = this.innerContent as string;
        } else if (!isNOU(this.content) && this.content !== '') {
            if ((typeof this.content === 'string') || (typeof this.content !== 'string')) {
                // eslint-disable-next-line
                if ((this as any).isVue || typeof this.content !== 'string') {
                    templateFn = compile(this.content as string);
                    if (!isNOU(templateFn)) {
                        let tempArr: Element[] = templateFn({}, this, 'content', this.element.id + 'content', true);
                        if (tempArr) {
                            tempArr = Array.prototype.slice.call(tempArr);
                            append(tempArr, this.txtElement);
                            this.renderReactTemplates();
                        }
                    }
                } else {
                    this.txtElement.innerHTML = this.content as string;
                }
            }
        }
    }

    private setSeverity(): void {
        const classList: string[] = [SUCCESS, WARNING, INFO, ERROR];
        removeClass([this.element], classList);
        if (this.severity === 'Success') {
            addClass([this.element], SUCCESS);
        } else if (this.severity === 'Warning') {
            addClass([this.element], WARNING);
        } else if (this.severity === 'Error') {
            addClass([this.element], ERROR);
        } else if (this.severity === 'Info') {
            addClass([this.element], INFO);
        }
    }

    private setVariant(): void {
        const classList: string[] = [FILLED, OUTLINED];
        removeClass([this.element], classList);
        if (this.variant === 'Outlined') {
            addClass([this.element], OUTLINED);
        } else if (this.variant === 'Filled') {
            addClass([this.element], FILLED);
        }
    }

    private setCssClass(oldCssClass?: string): void {
        if (oldCssClass) {
            removeClass([this.element], oldCssClass.split(' '));
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
    }

    private setVisible(): void {
        if (!this.visible) {
            addClass([this.element], HIDE);
            if (!this.initialRender) {
                this.trigger('closed', { event: event, isInteracted: false, element: this.element });
            }
        } else {
            removeClass([this.element], HIDE);
        }
    }

    private clickHandler(event: Event): void {
        this.closeMessage(event);
    }

    private keyboardHandler(event: KeyboardEventArgs): void {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.closeMessage(event);
        }
    }

    private closeMessage(event: Event | KeyboardEventArgs): void {
        addClass([this.element], HIDE);
        this.setProperties({ visible: false }, true);
        const eventArgs: MessageCloseEventArgs = { event: event, isInteracted: true, element: this.element };
        this.trigger('closed', eventArgs);
    }

    private wireEvents(): void {
        if (this.showCloseIcon) {
            EventHandler.add(this.closeIcon, 'click', this.clickHandler, this);
            EventHandler.add(this.closeIcon, 'keydown', this.keyboardHandler, this);
        }
    }

    private unWireEvents(): void {
        if (this.showCloseIcon) {
            EventHandler.remove(this.closeIcon, 'click', this.clickHandler);
            EventHandler.remove(this.closeIcon, 'keydown', this.keyboardHandler);
        }
    }

    /**
     * Method to handle the dynamic changes of the Message component properties.
     *
     * @param {MessageModel} newProp - Specifies the new property.
     * @param {MessageModel} oldProp - Specifies the old property.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp?: MessageModel, oldProp?: MessageModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                this.setCssClass(oldProp.cssClass);
                break;
            case 'content':
                this.txtElement.innerHTML = '';
                this.setTemplate();
                break;
            case 'enableRtl':
                if (!this.enableRtl) {
                    this.element.classList.remove(RTL);
                } else {
                    this.element.classList.add(RTL);
                }
                break;
            case 'locale':
                if (this.showCloseIcon) {
                    this.setTitle();
                }
                break;
            case 'showIcon':
                if (!this.showIcon && this.element.getElementsByClassName(MSG_ICON).length > 0) {
                    detach(this.iconElement);
                }
                if (this.showIcon) {
                    this.iconElement = this.createElement('span', { className: MSG_ICON });
                    this.element.insertBefore(this.iconElement, this.txtElement);
                }
                break;
            case 'showCloseIcon':
                if (!this.showCloseIcon && !isNOU(this.closeIcon)) {
                    this.unWireEvents();
                    detach(this.closeIcon);
                } else {
                    this.setCloseIcon();
                    this.wireEvents();
                }
                break;
            case 'severity':
                this.setSeverity();
                break;
            case 'variant':
                this.setVariant();
                break;
            case 'visible':
                this.setVisible();
                break;
            }
        }
    }

    /**
     * Method to destroy the Message component. It removes the component from the DOM and detaches all its bound events. It also removes the attributes and classes of the component.
     *
     * @returns {void}
     */
    public destroy(): void {
        const cssClass: string[] | string = isNOU(this.cssClass) ? [''] : this.cssClass.split(' ');
        const className: string[] = [SUCCESS, WARNING, INFO, ERROR, RTL, HIDE, OUTLINED, FILLED];
        const classList: string[] = (cssClass.length === 1 && cssClass[0] === '') ? className : className.concat(cssClass);
        removeClass([this.element], classList);
        this.element.removeAttribute('role');
        this.unWireEvents();
        if (!isNOU(this.iconElement)) {
            detach(this.iconElement);
        }
        detach(this.txtElement);
        if (!isNOU(this.closeIcon)) {
            detach(this.closeIcon);
        }
        super.destroy();
    }
}
