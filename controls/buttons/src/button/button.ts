import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Component, isBlazor, isRippleEnabled } from '@syncfusion/ej2-base';
import { addClass, Event, EmitType, detach, removeClass } from '@syncfusion/ej2-base';
import { rippleEffect, EventHandler, Observer, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ButtonModel } from './button-model';
import { getTextNode } from '../common/common';

/**
 * Defines the arguments for the clicked event of the Button component.
 */
export interface ClickedEventArgs {
    /** The original DOM event that triggered the click. */
    originalEvent: Event;
    /** Indicates whether this click was a repeat fire (`true`) or the initial press (`false`). */
    isRepeat: boolean;
}
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

    // Repeat timer handles
    private repeatDelayTimer: ReturnType<typeof setTimeout>;
    private repeatIntervalTimer: ReturnType<typeof setInterval>;

    // Bound handler references (required for correct EventHandler.remove behaviour in ES5 target)
    private repeatPointerDownHandler: (e: PointerEvent) => void;
    private repeatPointerUpHandler: (e: PointerEvent) => void;
    private repeatPointerLeaveHandler: (e: PointerEvent) => void;
    private repeatPointerCancelHandler: (e: PointerEvent) => void;
    private repeatKeyDownHandler: (e: KeyboardEvent) => void;
    private repeatKeyUpHandler: (e: KeyboardEvent) => void;
    private repeatBlurHandler: (e: FocusEvent) => void;
    private btnClickHandler: (e?: Event) => void;
    private suppressToggleOnNextClick: boolean = false;
    private mutationObserver: MutationObserver;

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
     * [`this`](https://ej2.syncfusion.com/documentation/button/how-to/create-a-block-button).
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
     * Enables hold-to-repeat behavior on the Button when set to `true`.
     * While the button is held down (pointer or keyboard), repeated `clicked` events are fired
     * at the rate controlled by `repeatDelay` and `repeatInterval`.
     *
     * @default false
     */
    @Property(false)
    public enableRepeat: boolean;

    /**
     * Specifies the delay in milliseconds before repeat firing begins after the initial press.
     * Only applicable when `enableRepeat` is `true`.
     * Changes to this property take effect on the next hold cycle.
     *
     * @default 400
     */
    @Property(400)
    public repeatDelay: number;

    /**
     * Specifies the interval in milliseconds between repeated `clicked` fires during a hold.
     * When set to `0` (default), pointer repeat uses 100ms; keyboard repeat defers to the native OS rate.
     * Changes to this property take effect on the next hold cycle.
     *
     * @default 0
     */
    @Property(0)
    public repeatInterval: number;

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
     * Triggers on every click fire — both the initial press and each repeat while the button is held.
     * The event argument carries `originalEvent` (the originating DOM event) and `isRepeat`
     * (`false` for the first press, `true` for subsequent repeat fires).
     * Only emitted when `enableRepeat` is `true`.
     *
     * @event clicked
     */
    @Event()
    public clicked: EmitType<ClickedEventArgs>;

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
        // Bind handler references once so EventHandler.remove can match them exactly.
        // Must be done here (not in constructor) because super() triggers render() → wireEvents()
        // before the constructor body after super() has a chance to run.
        this.repeatPointerDownHandler = this.startRepeat.bind(this);
        this.repeatPointerUpHandler = this.stopRepeat.bind(this);
        this.repeatPointerLeaveHandler = this.stopRepeat.bind(this);
        this.repeatPointerCancelHandler = this.stopRepeat.bind(this);
        this.repeatKeyDownHandler = this.onRepeatKeyDown.bind(this);
        this.repeatKeyUpHandler = this.stopRepeat.bind(this);
        this.repeatBlurHandler = this.stopRepeat.bind(this);
        this.btnClickHandler = this.onClickToggle.bind(this);
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
        this.observeDomAttributeChanges();
        this.renderComplete();
    }

    private observeDomAttributeChanges(): void {
        this.mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
            const isDomDisabled: boolean = this.element.hasAttribute('disabled');
            if (isDomDisabled !== this.disabled) {
                this.disabled = isDomDisabled;
            }
        });
        this.mutationObserver.observe(this.element, {
            attributes: true,
            attributeFilter: ['disabled'],
            subtree: false
        });
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
        if (disabled) {
            this.element.classList.add('e-disabled');
        } else {
            this.element.classList.remove('e-disabled');
        }
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

    /**
     * Fires the native click on the element and emits the `clicked` EJ2 event.
     *
     * @param {Event} originalEvent - The originating DOM event.
     * @param {boolean} isRepeat - `true` when this is a repeat fire, `false` for the initial press.
     * @returns {void}
     */
    private fireClick(originalEvent: Event, isRepeat: boolean): void {
        if (this.disabled) { return; }
        // For toggle buttons we rely on the DOM `click` to toggle state once.
        // For repeat fires, suppress the toggle on the next DOM click; for initial press, allow it.
        if (this.isToggle && isRepeat === true) {
            this.suppressToggleOnNextClick = true;
        }
        this.element.click();
        this.trigger('clicked', { originalEvent: originalEvent, isRepeat: isRepeat });
    }

    /**
     * Starts the hold-to-repeat cycle for pointer input.
     * Fires the initial click immediately, then after `repeatDelay` ms begins firing
     * at the effective interval (`repeatInterval > 0 ? repeatInterval : 100`).
     * Only processes events where `PointerEvent.button === 0` (primary button:
     * left-click, touch, primary pen). Non-primary buttons (right-click `button=2`,
     * middle-click `button=1`, back/forward `button=3/4`) are ignored to prevent
     * spurious `clicked` events and timer leaks caused by context-menu pointer capture.
     *
     * @param {Event} originalEvent - The originating event (PointerEvent or KeyboardEvent).
     * @returns {void}
     */
    private startRepeat(originalEvent: Event): void {
        if ((originalEvent as PointerEvent).button !== 0) { return; }
        this.fireClick(originalEvent, false);
        const effectiveInterval: number = this.repeatInterval > 0 ? this.repeatInterval : 100;
        if (this.repeatDelay === 0) {
            this.repeatIntervalTimer = setInterval(() => {
                this.fireClick(originalEvent, true);
            }, effectiveInterval);
        } else {
            this.repeatDelayTimer = setTimeout(() => {
                this.repeatIntervalTimer = setInterval(() => {
                    this.fireClick(originalEvent, true);
                }, effectiveInterval);
            }, this.repeatDelay);
        }
    }

    /**
     * Stops any active repeat timers.
     *
     * @returns {void}
     */
    private stopRepeat(): void {
        clearTimeout(this.repeatDelayTimer);
        clearInterval(this.repeatIntervalTimer);
    }

    /**
     * Handles `keydown` events for keyboard-driven repeat.
     * - First keydown (`e.repeat === false`): fires the initial click; if `repeatInterval > 0`
     *   also starts the custom delay + interval cycle.
     * - Subsequent keydown with `e.repeat === true` and `repeatInterval === 0`: fires via native OS rate.
     * - Subsequent keydown with `e.repeat === true` and `repeatInterval > 0`: suppressed (custom interval handles it).
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {void}
     */
    private onRepeatKeyDown(e: KeyboardEvent): void {
        if (e.key !== ' ' && e.key !== 'Enter') {
            return;
        }
        if (!e.repeat) {
            this.fireClick(e, false);
            if (this.repeatInterval > 0) {
                this.repeatDelayTimer = setTimeout(() => {
                    this.repeatIntervalTimer = setInterval(() => {
                        this.fireClick(e, true);
                    }, this.repeatInterval);
                }, this.repeatDelay);
            }
        } else if (this.repeatInterval === 0) {
            this.fireClick(e, true);
        }
        // else: e.repeat === true && repeatInterval > 0 — suppress; custom interval is already running
    }

    protected wireEvents(): void {
        if (this.isToggle) {
            EventHandler.add(this.element, 'click', this.btnClickHandler, this);
        }
        if (this.enableRepeat) {
            this.wireRepeatEvents();
        }
    }

    private wireRepeatEvents(): void {
        EventHandler.add(this.element, 'pointerdown', this.repeatPointerDownHandler, this);
        EventHandler.add(this.element, 'pointerup', this.repeatPointerUpHandler, this);
        EventHandler.add(this.element, 'pointerleave', this.repeatPointerLeaveHandler, this);
        EventHandler.add(this.element, 'pointercancel', this.repeatPointerCancelHandler, this);
        EventHandler.add(this.element, 'keydown', this.repeatKeyDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.repeatKeyUpHandler, this);
        EventHandler.add(this.element, 'blur', this.repeatBlurHandler, this);
    }

    private unwireRepeatEvents(): void {
        EventHandler.remove(this.element, 'pointerdown', this.repeatPointerDownHandler);
        EventHandler.remove(this.element, 'pointerup', this.repeatPointerUpHandler);
        EventHandler.remove(this.element, 'pointerleave', this.repeatPointerLeaveHandler);
        EventHandler.remove(this.element, 'pointercancel', this.repeatPointerCancelHandler);
        EventHandler.remove(this.element, 'keydown', this.repeatKeyDownHandler);
        EventHandler.remove(this.element, 'keyup', this.repeatKeyUpHandler);
        EventHandler.remove(this.element, 'blur', this.repeatBlurHandler);
        this.stopRepeat();
    }

    protected unWireEvents(): void {
        if (this.isToggle) {
            EventHandler.remove(this.element, 'click', this.btnClickHandler);
        }
        if (this.enableRepeat) {
            this.unwireRepeatEvents();
        }
    }

    /**
     * Handles the toggle click behavior.
     * When called from a repeat fire (`isRepeat === true`) the `e-active` state is NOT toggled,
     * preserving the state set on the initial press.
     *
     * @param {boolean} [isRepeat] - `true` when invoked from a repeat fire.
     * @returns {void}
     */
    private onClickToggle(isRepeat?: boolean): void {
        // If called directly with `true` (repeat) bail out.
        if (isRepeat === true) { return; }
        // If a repeat fired and we suppressed the next DOM click, consume the suppression and bail.
        if (this.suppressToggleOnNextClick) { this.suppressToggleOnNextClick = false; return; }
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
        this.stopRepeat();
        let classList: string[] = [cssClassName.PRIMARY, cssClassName.RTL, cssClassName.ICONBTN, 'e-success', 'e-info', 'e-danger',
            'e-warning', 'e-flat', 'e-outline', 'e-small', 'e-bigger', 'e-active', 'e-round',
            'e-top-icon-btn', 'e-bottom-icon-btn', 'e-disabled'];
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
            this.element.textContent = '';
        }
        const span: Element = this.element.querySelector('span.e-btn-icon') as Element;
        if (span) {
            detach(span);
        }
        this.unWireEvents();
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
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
                if (newProp.disabled) {
                    this.stopRepeat();
                }
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
            case 'enableRepeat':
                if (newProp.enableRepeat) {
                    this.wireRepeatEvents();
                } else {
                    this.unwireRepeatEvents();
                }
                break;
            case 'repeatDelay':
                // Changes take effect on the next hold cycle; no re-wiring needed.
                break;
            case 'repeatInterval':
                // Changes take effect on the next hold cycle; no re-wiring needed.
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
