import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Component, isBlazor, isRippleEnabled } from '@syncfusion/ej2-base';
import { addClass, Event, EmitType, detach, removeClass } from '@syncfusion/ej2-base';
import { rippleEffect, EventHandler, Observer, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ButtonModel } from './button-model';
import { getTextNode } from '../common/common';
/**
 * Defines the icon position of button.
 */
export enum IconPosition {
    /**
     * Positions the Icon at the left of the text content in the Button.
     */
    Left = 'Left',

    /**
     * Positions the Icon at the right of the text content in the Button.
     */
    Right = 'Right',

    /**
     * Positions the Icon at the top of the text content in the Button.
     */
    Top = 'Top',

    /**
     * Positions the Icon at the bottom of the text content in the Button.
     */
    Bottom = 'Bottom',
}

export const buttonObserver: Observer = new Observer();

const cssClassName: CssClassNameT = {
    RTL: 'e-rtl',
    BUTTON: 'e-btn',
    PRIMARY: 'e-primary',
    ICONBTN: 'e-icon-btn'
};

/**
 * The Button is a graphical user interface element that triggers an event on its click action. It can contain a text, an image, or both.
 * ```html
 * <button id="button">Button</button>
 * ```
 * ```typescript
 * <script>
 * var btnObj = new Button();
 * btnObj.appendTo("#button");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Button extends Component<HTMLButtonElement> implements INotifyPropertyChanged {
    private removeRippleEffect: Function;

    /**
     * Positions the icon before/after the text content in the Button.
     * The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Right: The icon will be positioned to the right of the text content.
     *
     * @isenumeration true
     * @default IconPosition.Left
     * @asptype IconPosition
     */
    @Property('Left')
    public iconPosition: string | IconPosition;

    /**
     * Defines class/multiple classes separated by a space for the Button that is used to include an icon.
     * Buttons can also include font icon and sprite image.
     *
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies a value that indicates whether the Button is `disabled` or not.
     *
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Allows the appearance of the Button to be enhanced and visually appealing when set to `true`.
     *
     * @default false
     */
    @Property(false)
    public isPrimary: boolean;

    /**
     * Defines class/multiple classes separated by a space in the Button element. The Button types, styles, and
     * size can be defined by using
     * [`this`](http://ej2.syncfusion.com/documentation/button/howto.html?lang=typescript#create-a-block-button).
     * {% codeBlock src='button/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the text `content` of the Button element.
     * {% codeBlock src='button/content/index.md' %}{% endcodeBlock %}
     *
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Makes the Button toggle, when set to `true`. When you click it, the state changes from normal to active.
     *
     * @default false
     */
    @Property(false)
    public isToggle: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @private
     */
    @Property()
    public locale: string;

    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the Button component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

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
     * @param  {ButtonModel} options - Specifies the button model
     * @param  {string|HTMLButtonElement} element - Specifies the target element
     */
    constructor(options?: ButtonModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    protected preRender(): void {
        // pre render code snippets
    }

    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initialize();
        this.removeRippleEffect = rippleEffect(this.element, { selector: '.' + cssClassName.BUTTON });
        this.renderComplete();
    }

    private initialize(): void {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        if (this.isPrimary) {
            this.element.classList.add(cssClassName.PRIMARY);
        }
        if (!isBlazor() || (isBlazor() && this.getModuleName() !== 'progress-btn')) {
            if (this.content) {
                const tempContent: string = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(this.content) : this.content;
                this.element.innerHTML = tempContent;
            }
            this.setIconCss();
        }
        if (this.enableRtl) {
            this.element.classList.add(cssClassName.RTL);
        }
        if (this.disabled) {
            this.controlStatus(this.disabled);
        } else {
            this.wireEvents();
        }
    }

    private controlStatus(disabled: boolean): void {
        this.element.disabled = disabled;
    }

    private setIconCss(): void {
        if (this.iconCss) {
            const span: HTMLElement = this.createElement('span', { className: 'e-btn-icon ' + this.iconCss });
            if (!this.element.textContent.trim()) {
                this.element.classList.add(cssClassName.ICONBTN);
            } else {
                span.classList.add('e-icon-' + this.iconPosition.toLowerCase());
                if (this.iconPosition === 'Top' || this.iconPosition === 'Bottom') {
                    this.element.classList.add('e-' + this.iconPosition.toLowerCase() + '-icon-btn');
                }
            }
            const node: Node = this.element.childNodes[0];
            if (node && (this.iconPosition === 'Left' || this.iconPosition === 'Top')) {
                this.element.insertBefore(span, node);
            } else {
                this.element.appendChild(span);
            }
        }
    }

    protected wireEvents(): void {
        if (this.isToggle) {
            EventHandler.add(this.element, 'click', this.btnClickHandler, this);
        }
    }

    protected unWireEvents(): void {
        if (this.isToggle) {
            EventHandler.remove(this.element, 'click', this.btnClickHandler);
        }
    }

    private btnClickHandler(): void {
        if (this.element.classList.contains('e-active')) {
            this.element.classList.remove('e-active');
        } else {
            this.element.classList.add('e-active');
        }
    }


    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        let classList: string[] = [cssClassName.PRIMARY, cssClassName.RTL, cssClassName.ICONBTN, 'e-success', 'e-info', 'e-danger',
            'e-warning', 'e-flat', 'e-outline', 'e-small', 'e-bigger', 'e-active', 'e-round',
            'e-top-icon-btn', 'e-bottom-icon-btn'];
        if (this.cssClass) {
            classList = classList.concat(this.cssClass.split(/\s+/).filter((c: string) => c.length > 0));
        }
        super.destroy();
        removeClass([this.element], classList);
        if (!this.element.getAttribute('class')) {
            this.element.removeAttribute('class');
        }
        if (this.disabled) {
            this.element.removeAttribute('disabled');
        }
        if (this.content) {
            this.element.innerHTML = this.element.innerHTML.replace(this.content, '');
        }
        const span: Element = this.element.querySelector('span.e-btn-icon') as Element;
        if (span) {
            detach(span);
        }
        this.unWireEvents();
        if (isRippleEnabled) {
            this.removeRippleEffect();
        }
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module name
     * @private
     */
    public getModuleName(): string {
        return 'btn';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist Data
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Dynamically injects the required modules to the component.
     *
     * @private
     * @returns {void}
     */
    public static Inject(): void {
        // Inject code snippets
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {ButtonModel} newProp - Specifies new properties
     * @param  {ButtonModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: ButtonModel, oldProp: ButtonModel): void {
        let span: Element = this.element.querySelector('span.e-btn-icon') as Element;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'isPrimary':
                if (newProp.isPrimary) {
                    this.element.classList.add(cssClassName.PRIMARY);
                } else {
                    this.element.classList.remove(cssClassName.PRIMARY);
                }
                break;
            case 'disabled':
                this.controlStatus(newProp.disabled as boolean);
                break;
            case 'iconCss': {
                span = this.element.querySelector('span.e-btn-icon') as Element;
                if (span) {
                    if (newProp.iconCss) {
                        span.className = 'e-btn-icon ' + newProp.iconCss;
                        if (this.element.textContent.trim()) {
                            if (this.iconPosition === 'Left') {
                                span.classList.add('e-icon-left');
                            } else {
                                span.classList.add('e-icon-right');
                            }
                        }
                    } else {
                        detach(span);
                    }
                } else {
                    this.setIconCss();
                }
                break;
            }
            case 'iconPosition':
                removeClass([this.element], ['e-top-icon-btn', 'e-bottom-icon-btn']);
                span = this.element.querySelector('span.e-btn-icon') as Element;
                if (span) {
                    detach(span);
                }
                this.setIconCss();
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.split(/\s+/).filter((c: string) => c.length > 0));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    this.element.classList.add(cssClassName.RTL);
                } else {
                    this.element.classList.remove(cssClassName.RTL);
                }
                break;
            case 'content': {
                const node: Node = getTextNode(this.element);
                if (!node) {
                    this.element.classList.remove(cssClassName.ICONBTN);
                }
                if (!isBlazor() || (isBlazor() && !this.isServerRendered && this.getModuleName() !== 'progress-btn')) {
                    if (this.enableHtmlSanitizer) {
                        newProp.content = SanitizeHtmlHelper.sanitize(newProp.content as string);
                    }
                    this.element.innerHTML = newProp.content as string;
                    this.setIconCss();
                }
                break;
            }
            case 'isToggle':
                if (newProp.isToggle) {
                    EventHandler.add(this.element, 'click', this.btnClickHandler, this);
                } else {
                    EventHandler.remove(this.element, 'click', this.btnClickHandler);
                    removeClass([this.element], ['e-active']);
                }
                break;
            }
        }
    }

    /**
     * Click the button element
     * its native method
     *
     * @public
     * @returns {void}
     */
    public click(): void {
        this.element.click();
    }

    /**
     * Sets the focus to Button
     * its native method
     *
     * @public
     * @returns {void}
     */
    public focusIn(): void {
        this.element.focus();
    }
}

interface CssClassNameT {
    /** Defines the type of the classname. */
    RTL: string;
    BUTTON: string;
    PRIMARY: string;
    ICONBTN: string;
}
