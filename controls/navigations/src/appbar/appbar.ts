import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { addClass, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { AppBarModel } from './appbar-model';

// Constant variables
const CLS_APPBAR: string = 'e-appbar';
const CLS_HORIZONTAL_BOTTOM: string = 'e-horizontal-bottom';
const CLS_STICKY: string = 'e-sticky';
const CLS_PROMINENT: string = 'e-prominent';
const CLS_DENSE: string = 'e-dense';
const CLS_RTL: string = 'e-rtl';
const CLS_LIGHT: string = 'e-light';
const CLS_DARK: string = 'e-dark';
const CLS_PRIMARY: string = 'e-primary';
const CLS_INHERIT: string = 'e-inherit';

/**
 * Specifies the height mode of the AppBar component which defines the height of the AppBar.
 * ```props
 * Regular :- Specifies default height for the AppBar.
 * Prominent :- Specifies longer height for the AppBar to show the longer titles and images, or to provide a stronger presence.
 * Dense :- Specifies compressed (short) height for the AppBar to accommodate all the app bar content in a denser layout.
 * ```
 */
export type AppBarMode = 'Regular' | 'Prominent' | 'Dense';

/**
 * Specifies the position of the AppBar.
 * ```props
 * Top :- Position the AppBar at the top.
 * Bottom :- Position the AppBar at the bottom.
 * ```
 */
export type AppBarPosition = 'Top' | 'Bottom';

/**
 * Specifies the color of the AppBar component.
 * ```props
 * Light :- Specifies the AppBar in light color.
 * Dark :- Specifies the AppBar in dark color.
 * Primary :- Specifies the AppBar in a primary color.
 * Inherit :- Inherit color from parent for AppBar. AppBar background and colors are inherited from its parent element.
 * ```
 */
export type AppBarColor = 'Light' | 'Dark' | 'Primary' | 'Inherit';

/**
 * The AppBar displays the information and actions related to the current application screen. It is used to show branding, screen titles, navigation, and actions.
 * Support to inherit colors from AppBar provided to <c>Button</c>, <c>DropDownButton</c>, <c>Menu</c> and <c>TextBox</c>.
 * Set <c>CssClass</c> property with <code>e-inherit</code> CSS class to inherit the background and color from AppBar.
 */
@NotifyPropertyChanges
export class AppBar extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Specifies the mode of the AppBar that defines the AppBar height. The possible values for this property are as follows:
     * * `Regular`: Specifies default height for the AppBar.
     * * `Prominent`: Specifies longer height for the AppBar to show the longer titles and images, or to provide a stronger presence.
     * * `Dense`: Specifies compressed (short) height for the AppBar to accommodate all the app bar content in a denser layout.
     *
     * @default 'Regular'
     */
    @Property('Regular')
    public mode: AppBarMode;

    /**
     * Specifies the position of the AppBar. The possible values for this property are as follows:
     * * `Top`: Position the AppBar at the top.
     * * `Bottom`: Position the AppBar at the bottom.
     *
     * @default 'Top'
     */
    @Property('Top')
    public position: AppBarPosition;

    /**
     * Accepts single/multiple CSS classes (separated by a space) to be used for AppBar customization.
     *
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Defines whether the AppBar position is fixed or not while scrolling the page.
     * When set to `true`, the AppBar will be sticky while scrolling.
     *
     * @default false
     */
    @Property(false)
    public isSticky: boolean;

    /**
     * Accepts HTML attributes/custom attributes that will be applied to the AppBar element.
     *
     * @default null
     */
    @Property()
    public htmlAttributes: Record<string, string>;

    /**
     * Specifies the color mode that defines the color of the AppBar component. The possible values for this property are as follows:
     * * `Light`: Specifies the AppBar in light color.
     * * `Dark`: Specifies the AppBar in dark color.
     * * `Primary`: Specifies the AppBar in a primary color.
     * * `Inherit`: Inherit color from parent for AppBar. AppBar background and colors are inherited from its parent element.
     *
     * @default 'Light'
     */
    @Property('Light')
    public colorMode: AppBarColor;

    /**
     * Triggers after the AppBar component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers when the AppBar component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Event>;

    /**
     * Constructor for creating the AppBar widget
     *
     * @param {AppBarModel} options Accepts the AppBar model properties to initiate the rendering
     * @param {string | HTMLElement} element Accepts the DOM element reference
     */
    public constructor(options?: AppBarModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        this.element.classList.remove(CLS_APPBAR);
        this.element.removeAttribute('style');
        this.element.removeAttribute('role');
    }

    protected getModuleName(): string {
        return 'appbar';
    }

    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    protected preRender(): void {
        // pre render code
    }

    protected render(): void {
        this.element.classList.add(CLS_APPBAR);
        if (this.element.tagName !== 'HEADER') {
            this.element.setAttribute('role', 'banner');
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (this.position === 'Bottom') {
            this.element.classList.add(CLS_HORIZONTAL_BOTTOM);
        }
        if (this.isSticky) {
            this.element.classList.add(CLS_STICKY);
        }
        if (this.enableRtl) {
            this.element.classList.add(CLS_RTL);
        }
        this.setHeightMode();
        this.setColorMode();
        if (!isNullOrUndefined(this.htmlAttributes)) {
            this.setHtmlAttributes(this.htmlAttributes, this.element);
        }
    }

    public onPropertyChanged(newProp: AppBarModel, oldProp: AppBarModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'mode':
                removeClass([this.element], [CLS_DENSE, CLS_PROMINENT]);
                this.setHeightMode();
                break;
            case 'position':
                if (this.position === 'Bottom') {
                    addClass([this.element], CLS_HORIZONTAL_BOTTOM);
                } else {
                    removeClass([this.element], CLS_HORIZONTAL_BOTTOM);
                }
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.split(' '));
                }
                break;
            case 'isSticky':
                if (this.isSticky) {
                    addClass([this.element], CLS_STICKY);
                } else {
                    removeClass([this.element], CLS_STICKY);
                }
                break;
            case 'htmlAttributes':
                if (!isNullOrUndefined(this.htmlAttributes)) {
                    if (!isNullOrUndefined(oldProp.htmlAttributes)) {
                        const keys: string[] = Object.keys(oldProp.htmlAttributes);
                        for (const key of keys) {
                            if (key === 'class') {
                                removeClass([this.element], oldProp.htmlAttributes[`${key}`]);
                            } else {
                                this.element.removeAttribute(key);
                            }
                        }
                    }
                    this.setHtmlAttributes(newProp.htmlAttributes, this.element);
                }
                break;
            case 'colorMode':
                removeClass([this.element], [CLS_DARK, CLS_PRIMARY, CLS_INHERIT, CLS_LIGHT]);
                this.setColorMode();
                break;
            case 'enableRtl':
                if (this.enableRtl) {
                    addClass([this.element], CLS_RTL);
                } else {
                    removeClass([this.element], CLS_RTL);
                }
                break;
            }
        }
    }

    private setHtmlAttributes(attribute: Record<string, string>, element: HTMLElement): void {
        const keys: string[] = Object.keys(attribute);
        for (const key of keys) {
            if (key === 'class') {
                addClass([element], attribute[`${key}`]);
            } else {
                element.setAttribute(key, attribute[`${key}`]);
            }
        }
    }

    private setHeightMode(): void {
        if (this.mode === 'Prominent') {
            this.element.classList.add(CLS_PROMINENT);
        } else if (this.mode === 'Dense') {
            this.element.classList.add(CLS_DENSE);
        }
    }

    private setColorMode(): void {
        switch (this.colorMode) {
        case 'Light':
            this.element.classList.add(CLS_LIGHT);
            break;
        case 'Dark':
            this.element.classList.add(CLS_DARK);
            break;
        case 'Primary':
            this.element.classList.add(CLS_PRIMARY);
            break;
        case 'Inherit':
            this.element.classList.add(CLS_INHERIT);
            break;
        }
    }
}
