import { BaseEventArgs, EmitType, Event, ChildProperty, Collection, Complex, Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, getUniqueID, EventHandler, isRippleEnabled, removeClass, addClass, attributes, animationMode } from '@syncfusion/ej2-base';
import { select, extend, deleteObject, KeyboardEvents, append, rippleEffect, remove, closest, selectAll, KeyboardEventArgs, isNullOrUndefined, compile, formatUnit, Animation, AnimationModel, Effect as baseEffect } from '@syncfusion/ej2-base';
import { SpeedDialItemModel, SpeedDialModel, RadialSettingsModel, SpeedDialAnimationSettingsModel } from './speed-dial-model';
import { Fab, FabPosition } from './../floating-action-button/index';
import { IconPosition } from './../button/index';

const topPosition: string[] = ['TopLeft', 'TopCenter', 'TopRight'];
const bottomPosition: string[] = ['BottomLeft', 'BottomCenter', 'BottomRight'];
const leftPosition: string[] = ['TopLeft', 'MiddleLeft', 'BottomLeft'];
const rightPosition: string[] = ['TopRight', 'MiddleRight', 'BottomRight'];

const SDHIDDEN: string = 'e-speeddial-hidden';
const FIXEDSD: string = 'e-speeddial-fixed';

const SPEEDDIAL: string = 'e-speeddial';

const RTLCLASS: string = 'e-rtl';
const HOVERSD: string = 'e-speeddial-hover-open';
const RADIALSD: string = 'e-speeddial-radial';
const LINEARSD: string = 'e-speeddial-linear';
const TEMPLATESD: string = 'e-speeddial-template';
const SDTEMPLATECONTAINER: string = 'e-speeddial-template-container';
const SDOVERLAY: string = 'e-speeddial-overlay';
const SDPOPUP: string = 'e-speeddial-popup';
const SDUL: string = 'e-speeddial-ul';
const SDLI: string = 'e-speeddial-li';
const SDACTIVELI: string = 'e-speeddial-li-active';
const SDLIICON: string = 'e-speeddial-li-icon';
const SDLITEXT: string = 'e-speeddial-li-text';
const SDLITEXTONLY: string = 'e-speeddial-text-li';
const DISABLED: string = 'e-disabled';
const SDVERTICALBOTTOM: string = 'e-speeddial-vert-bottom';
const SDVERTICALRIGHT: string = 'e-speeddial-vert-right';
const SDHORIZONTALTOP: string = 'e-speeddial-horz-top';
const SDHORIZONTALLEFT: string = 'e-speeddial-horz-left';
const SDHORIZONTALRIGHT: string = 'e-speeddial-horz-right';
const SDOVERFLOW: string = 'e-speeddial-overflow';
const SDVERTOVERFLOW: string = 'e-speeddial-vert-overflow';
const SDHORZOVERFLOW: string = 'e-speeddial-horz-overflow';
const SDTOP: string = 'e-speeddial-top';
const SDBOTTOM: string = 'e-speeddial-bottom';
const SDRIGHT: string = 'e-speeddial-right';
const SDLEFT: string = 'e-speeddial-left';
const SDMIDDLE: string = 'e-speeddial-middle';
const SDCENTER: string = 'e-speeddial-center';
const SDTOPLEFT: string = 'e-speeddial-top-left';
const SDBOTTOMRIGHT: string = 'e-speeddial-bottom-right';
const SDTOPRIGHT: string = 'e-speeddial-top-right';
const SDBOTTOMLEFT: string = 'e-speeddial-bottom-left';

const SDVERTDIST: string = '--speeddialVertDist';
const SDHORZDIST: string = '--speeddialHorzDist';
const SDRADICALANGLE: string = '--speeddialRadialAngle';
const SDRADICALOFFSET: string = '--speeddialRadialOffset';
const SDRADICALMINHEIGHT: string = '--speeddialRadialMinHeight';
const SDRADICALMINWIDTH: string = '--speeddialRadialMinWidth';
const SDOVERFLOWLIMIT: string = '--speeddialOverflowLimit';
const SDRADICALHORZDIST: string = '--speeddialRadialHorzDist';


/**
 * Defines the display mode of speed dial action items in SpeedDial
 */
export enum SpeedDialMode {
    /**
     * SpeedDial items are displayed in linear order like list.
     */
    Linear = 'Linear',
    /**
     * SpeedDial items are displayed like radial menu in radial direction (circular direction).
     */
    Radial = 'Radial'
}
/**
 * Defines the speed dial action items display direction when mode is Linear.
 */
export enum LinearDirection {
    /**
     * Speed dial action items are displayed vertically above the button of Speed Dial.
     */
    Up = 'Up',

    /**
     * Speed dial action items are displayed vertically below the button of Speed Dial.
     */
    Down = 'Down',

    /**
     * Speed dial action items are displayed horizontally on the button's right side.
     */
    Right = 'Right',

    /**
     * Speed dial action items are displayed horizontally on the button's left side.
     */
    Left = 'Left',

    /**
     * Speed dial action items are displayed vertically above or below the button of Speed Dial based on the position.
     * If Position is TopRight, TopLeft, TopCenter, the items are displayed vertically below the button else above the button.
     */
    Auto = 'Auto'
}

/**
 * Defines the speed dial action items  order, when mode is Radial.
 */
export enum RadialDirection {
    /**
     * SpeedDial items are arranged in clockwise direction.
     */
    Clockwise = 'Clockwise',

    /**
     * SpeedDial items are shown in anti-clockwise direction.
     */
    AntiClockwise = 'AntiClockwise',

    /**
     * SpeedDial items are shown clockwise or anti-clockwise based on the position.
     */
    Auto = 'Auto'
}

/**
 * Defines the animation effect applied when open and close the speed dial items.
 */
export enum SpeedDialAnimationEffect {
    /**
     * SpeedDial open/close actions occur with the Fade animation effect.
     */
    Fade = 'Fade',

    /**
     * SpeedDial open/close actions occur with the FadeZoom animation effect.
     */
    FadeZoom = 'FadeZoom',

    /**
     * SpeedDial open/close actions occur with the FlipLeftDown animation effect.
     */
    FlipLeftDown = 'FlipLeftDown',

    /**
     * SpeedDial open/close actions occur with the FlipLeftUp animation effect.
     */
    FlipLeftUp = 'FlipLeftUp',

    /**
     * SpeedDial open/close actions occur with the FlipRightDown animation effect.
     */
    FlipRightDown = 'FlipRightDown',

    /**
     * SpeedDial open/close actions occur with the FlipRightUp animation effect.
     */
    FlipRightUp = 'FlipRightUp',

    /**
     * SpeedDial open/close actions occur with the FlipXDown animation effect.
     */
    FlipXDown = 'FlipXDown',

    /**
     * SpeedDial open/close actions occur with the FlipXUp animation effect.
     */
    FlipXUp = 'FlipXUp',

    /**
     * SpeedDial open/close actions occur with the FlipYLeft animation effect.
     */
    FlipYLeft = 'FlipYLeft',

    /**
     * SpeedDial open/close actions occur with the FlipYRight animation effect.
     */
    FlipYRight = 'FlipYRight',

    /**
     * SpeedDial open/close actions occur with the SlideBottom animation effect.
     */
    SlideBottom = 'SlideBottom',

    /**
     * SpeedDial open/close actions occur with the SlideLeft animation effect.
     */
    SlideLeft = 'SlideLeft',

    /**
     * SpeedDial open/close actions occur with the SlideRight animation effect.
     */
    SlideRight = 'SlideRight',

    /**
     * SpeedDial open/close actions occur with the SlideTop animation effect.
     */
    SlideTop = 'SlideTop',

    /**
     * SpeedDial open/close actions occur with the Zoom animation effect.
     */
    Zoom = 'Zoom',

    /**
     * SpeedDial open/close actions occur without any animation effect.
     */
    None = 'None'
}

/**
 * Provides information about the beforeOpen and beforeClose event callback.
 */
export interface SpeedDialBeforeOpenCloseEventArgs extends BaseEventArgs {
    /**
     * Provides the popup element of the speed dial.
     */
    element: HTMLElement;
    /**
     * Provides the original event which triggered the open/close action of speed dial.
     */
    event: Event;
    /**
     * Defines whether the to cancel the open/close action of speed dial.
     */
    cancel: boolean;
}

/**
 * Provides information about the open  and close event callback.
 */
export interface SpeedDialOpenCloseEventArgs extends BaseEventArgs {
    /**
     * Provides the popup element of the speed dial.
     */
    element: HTMLElement;
}


/**
 * Provides information about the beforeItemRender  and clicked event callback.
 */
export interface SpeedDialItemEventArgs extends BaseEventArgs {
    /**
     * Provides speed dial item element.
     */
    element: HTMLElement;
    /**
     * Provides speed dial item.
     */
    item: SpeedDialItemModel;
    /**
     * Provides the original event.
     */
    event?: Event;
}

/**
 * AProvides options to customize the animation applied while opening and closing the popup of SpeedDial.
 */
export class SpeedDialAnimationSettings extends ChildProperty<SpeedDialAnimationSettings> {
    /**
     * Defines  the type of animation effect used for opening and closing of the Speed Dial items.
     *
     * @isenumeration true
     * @default SpeedDialAnimationEffect.Fade
     * @asptype SpeedDialAnimationEffect
     */
    @Property('Fade')
    public effect: string | SpeedDialAnimationEffect;
    /**
     * Defines the duration in milliseconds that the animation takes to open or close the popup.
     *
     * @default 400
     * @aspType int
     */
    @Property(400)
    public duration: number;
    /**
     * Defines the delay before starting the animation.
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public delay: number;
}

/**
 * Provides the options to customize the speed dial action buttons when mode of SpeedDial is Radial.
 */
export class RadialSettings extends ChildProperty<RadialSettings> {

    /**
     * Defines speed dial action items placement order.
     * The possible values are
     * * Clockwise
     * * AntiClockwise
     * * Auto
     *
     * @isenumeration true
     * @default RadialDirection.Auto
     * @asptype RadialDirection
     */
    @Property('Auto')
    public direction: string | RadialDirection;

    /**
     * Defines end angle of speed dial items placement. The accepted value range is 0 to 360.
     * When a value is outside the accepted value range, then the provided value is ignored, and the angle is calculated based on the position.
     *
     * @default -1
     * @aspType int
     */
    @Property(-1)
    public endAngle: number;

    /**
     * Defines distance of speed dial items placement from the button of Speed Dial.
     *
     * @default '100px'
     * @aspType string
     */
    @Property('100px')
    public offset: string | number;

    /**
     * Defines start angle of speed dial items placement. The accepted value range is 0 to 360.
     * When a value is outside the accepted value range, then the provided value is ignored, and the angle is calculated based on the position.
     *
     * @default -1
     * @aspType int
     */
    @Property(-1)
    public startAngle: number;
}

/**
 * Defines the items of Floating Action Button.
 */
export class SpeedDialItem extends ChildProperty<SpeedDialItem>  {
    /**
     * Defines one or more CSS classes to include an icon or image in speed dial item.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines a unique value for the SpeedDialItem which can be used to identify the item in event args.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the text content of SpeedDialItem.
     * Text won't be visible when mode is Radial.
     * Also, in Linear mode, text won't be displayed when direction is Left or Right.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Defines the title of SpeedDialItem to display tooltip.
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Defines whether to enable or disable the SpeedDialItem.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
}

/**
 * The SpeedDial component that appears in front of all the contents of the page and displays list of action buttons on click which is an extended version of FAB.
 * The button of speed dial is positioned in relative to a view port of browser or the .
 * It can display a menu of related actions or a custom content popupTemplate>.
 *
 */
@NotifyPropertyChanges
export class SpeedDial extends Component<HTMLButtonElement> implements INotifyPropertyChanged {

    /**
     * Provides options to customize the animation applied while opening and closing the popup of speed dial
     * {% codeBlock src='speeddial/animation/index.md' %}{% endcodeBlock %}
     *
     * @default { effect: 'Fade', duration: 400, delay: 0 }
     */
    @Complex<SpeedDialAnimationSettingsModel>({}, SpeedDialAnimationSettings)
    public animation: SpeedDialAnimationSettingsModel;

    /**
     * Defines the content for the button of SpeedDial.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines one or more CSS classes to include an icon or image to denote the speed dial is opened and displaying menu items.
     *
     * @default ''
     */
    @Property('')
    public closeIconCss: string;

    /**
     * Defines one or more CSS classes to customize the appearance of SpeedDial.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the speed dial item display direction when mode is linear .
     * The possible values are
     * * Up
     * * Down
     * * Left
     * * Right
     * * Auto
     *
     * @isenumeration true
     * @default LinearDirection.Auto
     * @asptype LinearDirection
     */
    @Property('Auto')
    public direction: string | LinearDirection;

    /**
     * Defines whether to enable or disable the SpeedDial.
     *
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the position of icon in the button of speed dial.
     * The possible values are:
     * * Left
     * * Right
     *
     * @isenumeration true
     * @default IconPosition.Left
     * @asptype IconPosition
     */
    @Property('Left')
    public iconPosition: string | IconPosition;

    /**
     * Defines the list of SpeedDial items.
     *
     * @default []
     */
    @Collection<SpeedDialItemModel>([], SpeedDialItem)
    public items: SpeedDialItemModel[];

    /**
     * Defines the template content for the speed dial item.
     * {% codeBlock src='speeddial/itemTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public itemTemplate: string | Function;

    /**
     * Defines the display mode of speed dial action items.
     * The possible values are:
     * * Linear
     * * Radial
     * {% codeBlock src='speeddial/mode/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default SpeedDialMode.Linear
     * @asptype SpeedDialMode
     */
    @Property('Linear')
    public mode: string | SpeedDialMode;

    /**
     * Defines one or more CSS classes to include an icon or image for the button of SpeedDial when it's closed.
     *
     * @default ''
     */
    @Property('')
    public openIconCss: string;

    /**
     * Defines whether to open the popup when the button of SpeedDial is hovered.
     * By default, SpeedDial opens popup on click action.
     *
     * @default false
     */
    @Property(false)
    public opensOnHover: boolean;

    /**
     * Defines the position of the button of Speed Dial relative to target.
     * Defines the position of the FAB relative to target.
     * The possible values are:
     * * TopLeft: Positions the FAB at the target's top left corner.
     * * TopCenter: Positions the FAB at the target's top left corner.
     * * TopRight: Positions the FAB at the target's top left corner.
     * * MiddleLeft: Positions the FAB at the target's top left corner.
     * * MiddleCenter: Positions the FAB at the target's top left corner.
     * * MiddleRight: Positions the FAB at the target's top left corner.
     * * BottomLeft: Positions the FAB at the target's top left corner.
     * * BottomCenter: Places the FAB on the bottom-center position of the target.
     * * BottomRight: Positions the FAB at the target's bottom right corner.
     *
     *  To refresh the position of FAB on target resize, use refreshPosition method.
     *  The position will be refreshed automatically when browser resized.
     *
     * @isenumeration true
     * @default FabPosition.BottomRight
     * @asptype FabPosition
     */
    @Property('BottomRight')
    public position: string | FabPosition;

    /**
     * Defines whether the speed dial popup can be displayed as modal or modal less.
     * When enabled, the Speed dial creates an overlay that disables interaction with other elements other than speed dial items.
     * If user clicks anywhere other than speed dial items then popup will get closed.
     *
     * @default false.
     */
    @Property(false)
    public modal: boolean;

    /**
     * Defines a template content for popup of SpeedDial.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public popupTemplate: string | Function;

    /**
     * Provides the options to customize the speed dial action buttons when mode of speed dial is radial
     * {% codeBlock src='speeddial/radialSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { startAngle: null, endAngle: null, direction: 'Auto' }
     */
    @Complex<RadialSettingsModel>({}, RadialSettings)
    public radialSettings: RadialSettingsModel;

    /**
     * Defines the selector that points to the element in which the button of SpeedDial will be positioned.
     * By default button is positioned based on viewport of browser.
     * The target element must have relative position, else Button will get positioned based on the closest element which has relative position.
     *
     * @default ''
     */
    @Property('')
    public target: string | HTMLElement;

    /**
     * Defines whether the SpeedDial is visible or hidden.
     *
     * @default true.
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies whether the SpeedDial acts as the primary.
     *
     * @default true
     */
    @Property(true)
    public isPrimary: boolean;

    /**
     * Event callback that is raised before the speed dial popup is closed.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<SpeedDialBeforeOpenCloseEventArgs>;

    /**
     * Event callback that is raised before rendering the speed dial item.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<SpeedDialItemEventArgs>;

    /**
     * Event callback that is raised before the speed dial popup is opened.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<SpeedDialBeforeOpenCloseEventArgs>;

    /**
     * Event callback that is raised after rendering the speed dial.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event callback that is raised when a speed dial action item is clicked.
     *
     * @event clicked
     */
    @Event()
    public clicked: EmitType<SpeedDialItemEventArgs>;

    /**
     * Event callback that is raised when the SpeedDial popup is closed.
     *
     * @event onClose
     */
    @Event()
    public onClose: EmitType<SpeedDialOpenCloseEventArgs>;

    /**
     * Event callback that is raised when the SpeedDial popup is opened.
     *
     * @event onOpen
     */
    @Event()
    public onOpen: EmitType<SpeedDialOpenCloseEventArgs>;

    private fab: Fab;
    private targetEle: HTMLElement;
    private isFixed: boolean;
    private isMenuOpen: boolean = false;
    private popupEle: HTMLElement;
    private overlayEle: HTMLElement;
    private actualLinDirection: string;
    private isClock: boolean = true;
    private isVertical: boolean = true;
    private isControl: boolean = false;
    private focusedIndex: number = -1;
    private keyboardModule: KeyboardEvents;
    private popupKeyboardModule: KeyboardEvents;
    private documentKeyboardModule: KeyboardEvents;
    private removeRippleEffect: Function;
    private keyConfigs: { [key: string]: string };

    /**
     * Constructor for creating the widget
     *
     * @param  {SpeedDialModel} options - Specifies the floating action button model
     * @param  {string|HTMLButtonElement} element - Specifies the target element
     */
    constructor(options?: SpeedDialModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }
    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        this.initialize();
    }

    protected preRender(): void {
        this.keyConfigs = {
            space: 'space',
            enter: 'enter',
            end: 'end',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            esc: 'escape'
        };
        this.validateDirection();
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module name
     * @private
     */
    protected getModuleName(): string {
        return 'speed-dial';
    }

    private initialize(): void {
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
        this.fab = new Fab({
            content: this.content,
            cssClass: this.cssClass ? (SPEEDDIAL + ' ' + this.cssClass) : SPEEDDIAL,
            disabled: this.disabled,
            enablePersistence: this.enablePersistence,
            enableRtl: this.enableRtl,
            iconCss: this.openIconCss,
            iconPosition: this.iconPosition,
            position: this.position,
            target: this.target,
            visible: this.visible,
            isPrimary: this.isPrimary
        });
        this.fab.appendTo(this.element);
        if ((this.items.length > 0) || this.popupTemplate) { this.createPopup(); }
        this.wireEvents();

    }
    private wireEvents(): void {
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler, this);
        EventHandler.add(document.body, 'click', this.bodyClickHandler, this);
        if (this.opensOnHover) { this.wireFabHover(); } else { this.wireFabClick(); }
    }
    private wirePopupEvents(): void {
        this.removeRippleEffect = rippleEffect(this.popupEle, { selector: '.' + SDLIICON });
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        }
        );
        this.popupKeyboardModule = new KeyboardEvents(this.popupEle, {
            keyAction: this.popupKeyActionHandler.bind(this),
            keyConfigs: { esc: 'escape' },
            eventName: 'keydown'
        }
        );
        this.documentKeyboardModule = new KeyboardEvents(document.body, {
            keyAction: this.popupKeyActionHandler.bind(this),
            keyConfigs: { enter: 'enter', space: 'space' },
            eventName: 'keydown'
        }
        );
        EventHandler.add(this.popupEle, 'click', this.popupClick, this);
        EventHandler.add(this.popupEle, 'mouseleave', this.popupMouseLeaveHandle, this);
    }
    private wireFabClick(): void {
        EventHandler.add(this.fab.element, 'click', this.fabClick, this);
    }
    private wireFabHover(): void {
        this.popupEle.classList.add(HOVERSD);
        EventHandler.add(this.fab.element, 'mouseover', this.mouseOverHandle, this);
        EventHandler.add(this.element, 'mouseleave', this.mouseLeaveHandle, this);
    }
    public createPopup(): void {
        let className: string = SDPOPUP + ' ' + SDHIDDEN;
        className = this.enableRtl ? className + ' ' + RTLCLASS : className;
        className = this.cssClass ? className + ' ' + this.cssClass : className;
        this.popupEle = this.createElement('div', {
            className: className,
            id: this.element.id + '_popup'
        });
        this.element.insertAdjacentElement('afterend', this.popupEle);
        attributes(this.element, { 'aria-expanded': 'false', 'aria-haspopup': 'true', 'aria-controls': this.popupEle.id });
        this.setPopupContent();
        if (this.modal) { this.createOverlay(); }
        this.checkTarget();
        this.setPositionProps();
        this.wirePopupEvents();
    }
    private createOverlay(): void {
        this.overlayEle = this.createElement('div', {
            id: this.element.id + '_overlay',
            className: (SDOVERLAY + (this.isMenuOpen ? '' : ' ' + SDHIDDEN) + ' ' + this.cssClass).trim()
        });
        this.element.insertAdjacentElement('beforebegin', this.overlayEle);
    }
    private popupClick(): void {
        this.isControl = true;
    }

    //Checks and closes the speed dial if the click happened outside this speed dial.
    private bodyClickHandler(e: Event): void {
        if (this.isControl) { this.isControl = false; return; }
        if (this.isMenuOpen) { this.hidePopupEle(e); }
    }

    private fabClick(e: Event): void {
        this.isControl = true;
        if (this.isMenuOpen) { this.hidePopupEle(e); } else { this.showPopupEle(e); }
    }

    private setPopupContent(): void {
        this.popupEle.classList.remove(RADIALSD, LINEARSD, TEMPLATESD);
        if (!this.popupTemplate) {
            this.popupEle.classList.add((this.mode === 'Radial') ? RADIALSD : LINEARSD);
            this.createUl();
            this.createItems();
        } else {
            this.popupEle.classList.add(TEMPLATESD);
            this.appendTemplate();
        }
        this.renderReactTemplates();
    }
    private appendTemplate(): void {
        const templateContainer: HTMLElement = this.createElement('div', { className: SDTEMPLATECONTAINER });
        append([templateContainer], this.popupEle);
        const templateFunction: Function = this.getTemplateString(this.popupTemplate);
        append(templateFunction({}, this, 'fabPopupTemplate', (this.element.id + 'popupTemplate'), this.isStringTemplate), templateContainer);
    }
    private getTemplateString(template: string | Function): Function {
        let stringContent: string | Function = '';
        try {
            const tempEle: HTMLElement = select(template as string);
            if (typeof template !== 'function' && tempEle) {
                //Return innerHTML incase of jsrenderer script else outerHTML
                stringContent = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
            } else {
                stringContent = template;
            }
        } catch (e) {
            stringContent = template;
        }
        return compile(stringContent);
    }
    private updatePopupTemplate(): void {
        if (this.popupEle) {
            if (this.popupEle.querySelector('.' + SDLI)) {
                this.clearItems();
                this.popupEle.classList.remove(RADIALSD, LINEARSD);
                this.popupEle.classList.add(TEMPLATESD);
            }
            while (this.popupEle.firstElementChild) {
                remove(this.popupEle.firstElementChild);
            }
            this.setPopupContent();
            this.updatePositionProperties();
        } else {
            this.createPopup();
        }
    }
    private createUl(): void {
        const popupUlEle: HTMLElement = this.createElement('ul', {
            className: SDUL,
            id: this.element.id + '_ul',
            attrs: { 'role': 'menu' }
        });
        this.popupEle.appendChild(popupUlEle);
    }

    private createItems(): void {
        this.focusedIndex = -1;
        const ul: HTMLElement = this.popupEle.querySelector('.' + SDUL) as HTMLElement;
        for (let index: number = 0; index < this.items.length; index++) {
            const item: SpeedDialItemModel = this.items[parseInt(index.toString(), 10)];
            const li: HTMLElement = this.createElement('li', {
                className: SDLI + ' ' + SDHIDDEN,
                id: item.id ? item.id : (this.element.id + '_li_' + index),
                attrs: { 'role': 'menuitem' }
            });
            if (item.text) {
                li.setAttribute('aria-label', item.text);
            }
            if (this.itemTemplate) {
                const templateFunction: Function = this.getTemplateString(this.itemTemplate);
                append(templateFunction(item, this, 'fabItemTemplate', (this.element.id + 'itemTemplate'), this.isStringTemplate), li);
            } else {
                if (item.iconCss) {
                    const iconSpan: HTMLElement = this.createElement('span', {
                        className: SDLIICON + ' ' + item.iconCss
                    });
                    li.appendChild(iconSpan);
                }
                if (item.text) {
                    const textSpan: HTMLElement = this.createElement('span', {
                        className: SDLITEXT
                    });
                    textSpan.innerText = item.text;
                    li.appendChild(textSpan);
                    if (!item.iconCss) { li.classList.add(SDLITEXTONLY); }
                }
            }
            if (item.disabled) {
                li.classList.add(DISABLED);
                li.setAttribute('aria-disabled', 'true');
            } else {
                EventHandler.add(li, 'click', (e: Event) => this.triggerItemClick(e, item), this);
            }
            if (item.title) {
                li.setAttribute('title', item.title);
            }
            const eventArgs: SpeedDialItemEventArgs = { element: li, item: item };
            this.trigger('beforeItemRender', eventArgs, (args: SpeedDialItemEventArgs) => {
                ul.appendChild(args.element);
            });
        }
    }
    private setRTL(): void {
        this.popupEle.classList[this.enableRtl ? 'add' : 'remove'](RTLCLASS);
        this.clearHorizontalPosition();
        if (!(this.popupTemplate || (this.mode === 'Radial'))) {
            this.setLinearHorizontalPosition();
        } else {
            if (!this.popupTemplate && this.mode === 'Radial') { this.setRadialPosition(); }
            this.setHorizontalPosition();
        }
    }

    private checkTarget(): void {
        this.isFixed = true;
        if (this.target) {
            this.targetEle = (typeof this.target === 'string') ? select(this.target) : this.target;
            if (this.targetEle) {
                this.targetEle.appendChild(this.element);
                this.isFixed = false;
            }
        }
        if (this.isFixed) {
            if (this.popupEle) { this.popupEle.classList.add(FIXEDSD); }
            if (this.overlayEle) { this.overlayEle.classList.add(FIXEDSD); }
        } else {
            if (this.popupEle) { this.popupEle.classList.remove(FIXEDSD); }
            if (this.overlayEle) { this.overlayEle.classList.remove(FIXEDSD); }
        }
    }
    private setVisibility(val: boolean): void {
        this.setProperties({ visible: val }, true);
        this.fab.setProperties({ visible: val });
    }
    private popupMouseLeaveHandle(e: MouseEvent): void {
        const target: HTMLElement = e.relatedTarget as HTMLElement;
        if (this.opensOnHover && !(target.classList.contains(SPEEDDIAL) || closest(target, '.' + SPEEDDIAL))) {
            this.hidePopupEle(e);
        }
    }
    private mouseOverHandle(e: MouseEvent): void {
        this.showPopupEle(e);
    }
    private mouseLeaveHandle(e: MouseEvent): void {
        const target: HTMLElement = e.relatedTarget as HTMLElement;
        if (!(target.classList.contains(SDPOPUP) || closest(target, '.' + SDPOPUP))) {
            this.hidePopupEle(e);
        }
    }
    private popupKeyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
        case 'esc':
            this.hidePopupEle(e);
            break;
        case 'enter':
        case 'space':
            if (this.isMenuOpen && e.target !== this.element) {
                this.hidePopupEle(e);
            }
            break;
        }
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        e.preventDefault();
        switch (e.action) {
        case 'enter':
        case 'space':
            if (this.isMenuOpen) {
                if (this.focusedIndex !== -1) {
                    this.triggerItemClick(e, this.items[this.focusedIndex]);
                } else {
                    this.hidePopupEle(e);
                }
            } else {
                this.showPopupEle(e);
            }
            break;
        case 'esc':
            this.hidePopupEle(e);
            break;
        default:
            if (this.popupTemplate || !this.isMenuOpen) { break; }
            switch (e.action) {
            case 'end':
                this.focusLastElement();
                break;
            case 'home':
                this.focusFirstElement();
                break;
            case 'moveRight':
                if (this.mode === 'Radial') { this.focusLeftRightElement(false); } else { this.focusLinearElement(false); }
                break;
            case 'moveDown':
                if (this.mode === 'Radial') { this.focusUpDownElement(false); } else { this.focusLinearElement(false); }
                break;
            case 'moveLeft':
                if (this.mode === 'Radial') { this.focusLeftRightElement(true); } else { this.focusLinearElement(true); }
                break;
            case 'moveUp':
                if (this.mode === 'Radial') { this.focusUpDownElement(true); } else { this.focusLinearElement(true); }
                break;
            }
            break;
        }
    }
    private focusFirstElement(): void {
        const ele: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
        let index: number = 0;
        while (ele[parseInt(index.toString(), 10)].classList.contains(DISABLED)) {
            index++;
            if (index > (ele.length - 1)) { return; }
        }
        this.setFocus(index, ele[parseInt(index.toString(), 10)]);
    }
    private focusLastElement(): void {
        const ele: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
        let index: number = ele.length - 1;
        while (ele[parseInt(index.toString(), 10)].classList.contains(DISABLED)) {
            index--;
            if (index < 0) { return; }
        }
        this.setFocus(index, ele[parseInt(index.toString(), 10)]);
    }
    /*Linear*/
    private focusLinearElement(isLeftUp: boolean): void {
        const isReversed: boolean = this.popupEle.classList.contains(SDVERTICALBOTTOM) ||
            this.popupEle.classList.contains(SDHORIZONTALRIGHT);
        /* Elements will be in reverse (RTL) order for these classes are present.
        Reversed  and Down or right is previous.
        Not reversed and Up or left is previous.
        ((isReversed && !isLeftUp)||(!isReversed && isLeftUp)) ==> isReversed!==isLeftUp */
        if (isReversed !== isLeftUp) { this.focusPrevElement(); } else { this.focusNextElement(); }
    }
    /*Radial*/
    private focusLeftRightElement(isLeft: boolean): void {
        /*radialTop position  and left + anticlock or right + clock is previous
        other positions and right + anticlock or left + clock is previous
        ((isLeft && !this.isClock)||(!isLeft && this.isClock)) ==> isLeft!==this.isClock */
        const isradialTop: boolean = ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft'].indexOf(this.position) !== -1;
        if ((isradialTop && (isLeft !== this.isClock)) || (!isradialTop && (isLeft === this.isClock))) {
            this.focusPrevElement();
        } else {
            this.focusNextElement();
        }
    }
    /*Radial*/
    private focusUpDownElement(isUp: boolean): void {
        /*radialRight position  and up + anticlock or down + clock is previous
        other positions and down + anticlock or up + clock is previous
        ((isUp && !this.isClock)||(!isUp && this.isClock)) ==> isUp!==this.isClock */
        const isradialRight: boolean = ['TopRight', 'MiddleRight', 'BottomRight', 'BottomCenter'].indexOf(this.position) !== -1;
        if ((isradialRight && (isUp !== this.isClock)) || (!isradialRight && (isUp === this.isClock))) {
            this.focusPrevElement();
        } else {
            this.focusNextElement();
        }
    }

    private focusPrevElement(): void {
        const ele: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
        let index: number = this.focusedIndex;
        do {
            index--;
            if (index < 0) {
                this.setFocus(-1);
                return;
            }
        } while (ele[parseInt(index.toString(), 10)].classList.contains(DISABLED));
        this.setFocus(index, ele[parseInt(index.toString(), 10)]);
    }

    private focusNextElement(): void {
        const ele: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
        let index: number = this.focusedIndex;
        do {
            index++;
            if (index > (ele.length - 1)) { return; }
        } while (ele[parseInt(index.toString(), 10)].classList.contains(DISABLED));
        this.setFocus(index, ele[parseInt(index.toString(), 10)]);
    }

    private setFocus(index: number, ele?: HTMLElement): void {
        this.removeFocus();
        if (ele) { ele.classList.add(SDACTIVELI); }
        this.focusedIndex = index;
    }
    private removeFocus(): void {
        const preEle: HTMLElement = select('.' + SDACTIVELI, this.popupEle);
        if (preEle) { preEle.classList.remove(SDACTIVELI); }
    }
    private updatePositionProperties(): void {
        this.hidePopupEle();
        this.clearPosition();
        this.validateDirection();
        this.setPositionProps();
    }
    private setPositionProps(): void {
        if (this.popupTemplate) {
            this.setPosition();
        } else if ((this.mode === 'Radial')) {
            this.setRadialPosition();
            this.setPosition();
        } else {
            this.setLinearPosition();
            this.setMaxSize();
        }
    }
    private validateDirection(): void {
        switch (this.direction) {
        case 'Up':
            this.actualLinDirection = (topPosition.indexOf(this.position) !== -1) ? 'Auto' : 'Up';
            break;
        case 'Down':
            this.actualLinDirection = (bottomPosition.indexOf(this.position) !== -1) ? 'Auto' : 'Down';
            break;
        case 'Right':
            this.actualLinDirection = (rightPosition.indexOf(this.position) !== -1) ? 'Auto' : 'Right';
            break;
        case 'Left':
            this.actualLinDirection = (leftPosition.indexOf(this.position) !== -1) ? 'Auto' : 'Left';
            break;
        case 'Auto':
        default:
            this.actualLinDirection = 'Auto';
            break;
        }
        this.isVertical = !((this.actualLinDirection === 'Left') || (this.actualLinDirection === 'Right'));
    }

    private setMaxSize(): void {
        const top: number = this.element.offsetTop;
        const left: number = this.element.offsetLeft;
        const bottom: number = (this.isFixed ? window.innerHeight : this.targetEle.clientHeight) -
            this.element.offsetTop - this.element.offsetHeight;
        const right: number = (this.isFixed ? window.innerWidth : this.targetEle.clientWidth) -
            this.element.offsetLeft - this.element.offsetWidth;
        let limit: number = 0;
        const popupUlEle: HTMLElement = this.popupEle.querySelector('.' + SDUL) as HTMLElement;
        if (this.isVertical) {
            limit = ((this.actualLinDirection === 'Up') || ((this.actualLinDirection === 'Auto') && (topPosition.indexOf(this.position) === -1))) ? top : bottom;
            if (limit < popupUlEle.offsetHeight) {
                this.popupEle.classList.add(SDOVERFLOW, SDVERTOVERFLOW);
                popupUlEle.style.setProperty(SDOVERFLOWLIMIT, limit + 'px');
            }
        } else {
            limit = this.enableRtl ? (this.direction === 'Right' ? left : right) : (this.direction === 'Right' ? right : left);
            if (limit < popupUlEle.offsetWidth) {
                this.popupEle.classList.add(SDOVERFLOW, SDHORZOVERFLOW);
                popupUlEle.style.setProperty(SDOVERFLOWLIMIT, limit + 'px');
            }
        }
    }
    private setLinearPosition(): void {
        let vertDist: number = 0;
        //Check whether the position value should be in top
        const isTop: boolean = (this.actualLinDirection === 'Down') || ((this.actualLinDirection === 'Auto') && (topPosition.indexOf(this.position) !== -1)) ||
            (!this.isVertical && (bottomPosition.indexOf(this.position) === -1));
        const elementOffSetHeight: number = this.element.offsetHeight / 2;
        const isMiddle: boolean = ['MiddleRight', 'MiddleCenter', 'MiddleLeft'].indexOf(this.position) !== -1;
        if (isTop) {
            vertDist = this.element.offsetTop + (this.isVertical ? this.element.offsetHeight : 0);
            if (isMiddle) {
                if (this.actualLinDirection === 'Right' || this.actualLinDirection === 'Left') {
                    vertDist = this.element.offsetTop - elementOffSetHeight;
                }
                if (this.actualLinDirection === 'Down') {
                    vertDist = vertDist - elementOffSetHeight;
                }
            }
            if (!this.isVertical) { this.popupEle.classList.add(SDHORIZONTALTOP); }
        } else {
            vertDist = this.isFixed ? window.document.documentElement.clientHeight : this.targetEle.clientHeight;
            vertDist = (vertDist - this.element.offsetTop - (this.isVertical ? 0 : this.element.offsetHeight));
            if (isMiddle) {
                if (this.actualLinDirection === 'Auto' || this.actualLinDirection === 'Up') {
                    vertDist = vertDist + elementOffSetHeight;
                }
            }
            if (this.isVertical) { this.popupEle.classList.add(SDVERTICALBOTTOM); }
        }
        this.popupEle.classList.add(isTop ? SDTOP : SDBOTTOM);
        this.popupEle.style.setProperty(SDVERTDIST, vertDist + 'px');
        this.setLinearHorizontalPosition();
    }
    private setLinearHorizontalPosition(): void {
        //Check whether the position value should be in left
        if ((this.actualLinDirection === 'Right') || (this.isVertical && (rightPosition.indexOf(this.position) === -1))) {
            if (this.enableRtl) { this.setRight(); } else { this.setLeft(); } //reverse the direction when RTL enabled
            if (!this.isVertical) { this.popupEle.classList.add(SDHORIZONTALLEFT); }
        } else {
            if (this.enableRtl) { this.setLeft(); } else { this.setRight(); } //reverse the direction when RTL enabled
            this.popupEle.classList.add(this.isVertical ? SDVERTICALRIGHT : SDHORIZONTALRIGHT);
        }
    }
    private setLeft(): void {
        const elementOffSetWidth: number = this.element.offsetWidth / 2;
        const isCenter: boolean = [ 'TopCenter', 'MiddleCenter', 'BottomCenter'].indexOf(this.position) !== -1;
        let horzDist: number = this.element.offsetLeft + (this.isVertical ? 0 : this.element.offsetWidth);
        if (isCenter) {
            if (this.actualLinDirection === 'Auto' || this.actualLinDirection === 'Down' || this.actualLinDirection === 'Up') {
                horzDist = this.element.offsetLeft - elementOffSetWidth;
            }
            else {
                horzDist = this.actualLinDirection === 'Right' ? this.element.offsetLeft + elementOffSetWidth : horzDist + elementOffSetWidth;
            }
        }
        this.popupEle.style.setProperty(SDHORZDIST, horzDist + 'px');
        this.popupEle.classList.add(SDLEFT);
    }
    private setRight(): void {
        const elementOffSetWidth: number = this.element.offsetWidth / 2;
        const isCenter: boolean = [ 'TopCenter', 'MiddleCenter', 'BottomCenter'].indexOf(this.position) !== -1;
        let horzDist: number = this.isFixed ? window.document.documentElement.clientWidth : this.targetEle.clientWidth;
        horzDist = (horzDist - this.element.offsetLeft - (this.isVertical ? this.element.offsetWidth : 0));
        if (isCenter && this.actualLinDirection === 'Left') {
            horzDist = horzDist + elementOffSetWidth;
        }
        if (this.popupEle.classList.contains('e-rtl') && isCenter) {
            horzDist = horzDist - elementOffSetWidth;
        }
        this.popupEle.style.setProperty(SDHORZDIST, horzDist + 'px');
        this.popupEle.classList.add(SDRIGHT);
    }

    private setPosition(): void {
        //Check for middle Position
        if (['MiddleLeft', 'MiddleRight', 'MiddleCenter'].indexOf(this.position) !== -1) {
            this.popupEle.classList.add(SDMIDDLE);
            const yoffset: number = ((this.isFixed ? window.innerHeight : this.targetEle.clientHeight) - this.popupEle.offsetHeight) / 2;
            this.popupEle.style.setProperty(SDVERTDIST, yoffset + 'px');
        }
        this.popupEle.classList.add((bottomPosition.indexOf(this.position) === -1) ? SDTOP : SDBOTTOM);
        this.setHorizontalPosition();
    }

    private setHorizontalPosition(): void {
        //Check for Center Position
        if (['TopCenter', 'BottomCenter', 'MiddleCenter'].indexOf(this.position) !== -1) {
            this.popupEle.classList.add(SDCENTER);
            const xoffset: number = ((this.isFixed ? window.innerWidth : this.targetEle.clientWidth) - this.popupEle.offsetWidth) / 2;
            this.popupEle.style.setProperty(SDHORZDIST, xoffset + 'px');
        }
        const isRight: boolean = rightPosition.indexOf(this.position) !== -1;
        this.popupEle.classList.add((!(this.enableRtl || isRight) || (this.enableRtl && isRight)) ? SDLEFT : SDRIGHT);
    }

    private setCustomRadialPosition(): void {
        const viewportWidth: number = document.documentElement.clientWidth;
        const viewportHeight: number = document.documentElement.clientHeight;
        if (['TopLeft', 'BottomLeft', 'MiddleLeft'].indexOf(this.position) !== -1) {
            let horzDist: number;
            if (this.enableRtl) {
                if (this.isFixed) {
                    horzDist = viewportWidth - (this.element.offsetLeft + this.element.offsetWidth);
                }
                else {
                    horzDist = this.targetEle.clientWidth - (this.element.offsetLeft + this.element.offsetWidth);
                }
            }
            else {
                horzDist = this.element.offsetLeft;
            }
            this.popupEle.style.setProperty(SDRADICALHORZDIST, horzDist + 'px');
        }
        if (['TopLeft', 'TopCenter', 'TopRight'].indexOf(this.position) !== -1) {
            this.popupEle.style.top = this.element.offsetTop + 'px';
        }
        if (['TopRight', 'BottomRight', 'MiddleRight'].indexOf(this.position) !== -1) {
            let horzDist: number;
            if (this.enableRtl) {
                horzDist = this.element.offsetLeft;
            }
            else {
                if (this.isFixed) {
                    horzDist = viewportWidth - (this.element.offsetLeft + this.element.offsetWidth);
                }
                else {
                    horzDist = this.targetEle.clientWidth - (this.element.offsetLeft + this.element.offsetWidth);
                }
            }
            this.popupEle.style.setProperty(SDRADICALHORZDIST, horzDist + 'px');
        }
        if (['BottomLeft', 'BottomCenter', 'BottomRight'].indexOf(this.position) !== -1) {
            if (this.isFixed) {
                this.popupEle.style.bottom = viewportHeight - (this.element.offsetTop + this.element.offsetHeight) + 'px';
            }
            else {
                this.popupEle.style.bottom = this.targetEle.clientHeight - (this.element.offsetTop + this.element.offsetHeight) + 'px';
            }
        }
        if (['TopCenter', 'MiddleCenter', 'BottomCenter'].indexOf(this.position) !== -1) {
            let horzDist: number;
            if (this.enableRtl) {
                if (this.isFixed) {
                    horzDist = viewportWidth - (this.element.offsetLeft + this.element.offsetWidth) - this.popupEle.offsetWidth / 2;
                }
                else {
                    const targetEleWidth: number = this.targetEle.clientWidth;
                    const popupEleWidth: number = this.popupEle.offsetWidth;
                    horzDist = targetEleWidth - (this.element.offsetLeft + this.element.offsetWidth) - popupEleWidth / 2;
                }
            }
            else {
                horzDist = ((this.element.offsetLeft) - this.popupEle.offsetWidth / 2);
            }
            this.popupEle.style.setProperty(SDRADICALHORZDIST, horzDist + 'px');
        }
        if (['MiddleLeft', 'MiddleCenter', 'MiddleRight'].indexOf(this.position) !== -1) {
            this.popupEle.style.top = ((this.element.offsetTop) - this.popupEle.offsetHeight / 2) + 'px';
        }
    }

    private setRadialPosition(): void {
        this.setRadialCorner();
        const range: RadialSettingsModel = this.getActualRange();
        this.isClock = range.direction === 'Clockwise';
        const offset: string = formatUnit(range.offset as string | number);
        const li: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
        this.popupEle.style.setProperty(SDRADICALOFFSET, offset);
        this.popupEle.style.setProperty(SDRADICALMINHEIGHT, li[0].offsetHeight + 'px');
        this.popupEle.style.setProperty(SDRADICALMINWIDTH, li[0].offsetWidth + 'px');
        const availableAngle: number = Math.abs((range.endAngle as number) - (range.startAngle as number));
        //Start and end will be same for Middle Center position, hence available angle will 0 or 360.
        const gaps: number = ((availableAngle === 360) || (availableAngle === 0)) ? li.length : li.length - 1;
        const perAngle: number = availableAngle / gaps;
        for (let i: number = 0; i < li.length; i++) {
            const ele: HTMLElement = li[parseInt(i.toString(), 10)];
            const startAngle: number = range.startAngle;
            let angle: number = this.isClock ? ((startAngle) + (perAngle * i)) : ((startAngle) - (perAngle * i));
            angle = angle % 360; // removing the Zerp crossing changes.
            ele.style.setProperty(SDRADICALANGLE, angle + 'deg');
        }
    }
    private setRadialCorner(): void {
        //topLeftPosition
        if (['TopLeft', 'TopCenter', 'MiddleLeft', 'MiddleCenter'].indexOf(this.position) !== -1) { this.popupEle.classList.add(this.enableRtl ? SDTOPRIGHT : SDTOPLEFT); }
        //topRightPosition
        if (['TopRight', 'TopCenter', 'MiddleRight', 'MiddleCenter'].indexOf(this.position) !== -1) { this.popupEle.classList.add(this.enableRtl ? SDTOPLEFT : SDTOPRIGHT); }
        //bottpmLeftPosition
        if (['BottomLeft', 'BottomCenter', 'MiddleLeft', 'MiddleCenter'].indexOf(this.position) !== -1) { this.popupEle.classList.add(this.enableRtl ? SDBOTTOMRIGHT : SDBOTTOMLEFT); }
        //bottomRightPosition
        if (['BottomRight', 'BottomCenter', 'MiddleRight', 'MiddleCenter'].indexOf(this.position) !== -1) { this.popupEle.classList.add(this.enableRtl ? SDBOTTOMLEFT : SDBOTTOMRIGHT); }
    }
    // 0,360 is at right, 90 is at Bottom, 180 is at left, 270 is at top
    private getActualRange(): RadialSettingsModel {
        const range: RadialSettingsModel = { offset: this.radialSettings.offset };
        let start: number = this.radialSettings.startAngle;
        let end: number = this.radialSettings.endAngle;
        let isClockwise: boolean = false;
        switch (this.position) {
        case 'TopLeft':
        case 'TopRight':
            // Switch Left and Right for RTL mode.
            if (('TopLeft' === this.position) !== this.enableRtl) {
                //TopLeft
                isClockwise = this.radialSettings.direction === 'Clockwise';
                this.checkAngleRange(start, end, range, isClockwise, 0, 90, false);
            } else {
                //TopRight
                isClockwise = this.radialSettings.direction !== 'AntiClockwise';
                this.checkAngleRange(start, end, range, isClockwise, 90, 180, false);
            }
            break;
        case 'TopCenter':
            isClockwise = this.radialSettings.direction === 'Clockwise';
            this.checkAngleRange(start, end, range, isClockwise, 0, 180, false);
            break;
        case 'MiddleLeft':
        case 'MiddleRight':
            // Switch Left and Right for RTL mode.
            if (('MiddleLeft' === this.position) !== this.enableRtl) {
                //MiddleLeft
                isClockwise = this.radialSettings.direction === 'Clockwise';
                /**Replace the value if not defined or greater than 360 or less than 0 or between 91 and  269*/
                start = (isNullOrUndefined(start) || (start < 0) || (start > 360) || ((start > 90) && (start < 270))) ?
                    (isClockwise ? 270 : 90) : start;
                end = (isNullOrUndefined(end) || (end < 0) || (end > 360) || ((end > 90) && (end < 270))) ?
                    (isClockwise ? 90 : 270) : end;
                /**update for Zero Crossing */
                start = start < 91 ? start + 360 : start;
                end = end < 91 ? end + 360 : end;
                const switchVal: boolean = (isClockwise && (end < start)) || (!isClockwise && (end > start));
                range.startAngle = switchVal ? end : start;
                range.endAngle = switchVal ? start : end;
            } else {
                //MiddleRight
                isClockwise = this.radialSettings.direction !== 'AntiClockwise';
                this.checkAngleRange(start, end, range, isClockwise, 90, 270, false);
            }
            break;
        case 'MiddleCenter':
            isClockwise = this.radialSettings.direction !== 'AntiClockwise';
            /**Replace the value if not defined or greater than 360 or less than 0 */
            start = (isNullOrUndefined(start) || (start < 0) || (start > 360)) ? (isClockwise ? 0 : 360) : start;
            end = (isNullOrUndefined(end) || (end < 0) || (end > 360)) ? (isClockwise ? 360 : 0) : end;
            /**update for Zero Crossing */
            range.startAngle = (!isClockwise && (start <= end)) ? (start + 360) : start;
            range.endAngle = (isClockwise && (end <= start)) ? (end + 360) : end;
            break;
        case 'BottomLeft':
        case 'BottomRight':
            // Switch Left and Right for RTL mode.
            if (('BottomLeft' === this.position) !== this.enableRtl) {
                //BottomLeft
                isClockwise = this.radialSettings.direction === 'Clockwise';
                this.checkAngleRange(start, end, range, isClockwise, 270, 360, true);
            } else {
                //BottomRight
                isClockwise = this.radialSettings.direction !== 'AntiClockwise';
                this.checkAngleRange(start, end, range, isClockwise, 180, 270, true);
            }
            break;
        case 'BottomCenter':
            isClockwise = this.radialSettings.direction !== 'AntiClockwise';
            this.checkAngleRange(start, end, range, isClockwise, 180, 360, true);
            break;
        }
        range.direction = isClockwise ? 'Clockwise' : 'AntiClockwise';
        return range;
    }
    private checkAngleRange(
        start: number, end: number, range: RadialSettingsModel, isClockwise: boolean, min: number, max: number, check0: boolean
    ): void {
        start = this.checkAngle(start, isClockwise, min, max, check0);
        end = this.checkAngle(end, !isClockwise, min, max, check0);
        /**Switch the values if both are values are in the range but not as per direction*/
        const switchVal: boolean = (isClockwise && (end < start)) || (!isClockwise && (end > start));
        range.startAngle = switchVal ? end : start;
        range.endAngle = switchVal ? start : end;
    }
    private checkAngle(val: number, isStart: boolean, min: number, max: number, check0: boolean): number {
        if (isNullOrUndefined(val) || (val < 0) || (val > 360)) {
            return isStart ? min : max;
        } else {
            val = check0 ? ((val === 0) ? 360 : val) : ((val === 360) ? 0 : val);
            /**check whether the value is in the range if not replace them */
            return ((val >= min) && (val <= max)) ? val : isStart ? min : max;
        }
    }

    private clearPosition(): void {
        this.popupEle.style.removeProperty(SDRADICALOFFSET);
        this.popupEle.style.removeProperty(SDRADICALMINHEIGHT);
        this.popupEle.style.removeProperty(SDRADICALMINWIDTH);
        this.popupEle.classList.remove(SDTOPLEFT, SDTOPRIGHT, SDBOTTOMLEFT, SDBOTTOMRIGHT);
        this.popupEle.classList.remove(SDTOP, SDBOTTOM, SDMIDDLE);
        this.popupEle.classList.remove(SDHORIZONTALTOP, SDVERTICALBOTTOM);
        this.popupEle.style.removeProperty(SDVERTDIST);
        this.clearHorizontalPosition();
        this.clearOverflow();
    }
    private clearHorizontalPosition(): void {
        this.popupEle.style.removeProperty(SDHORZDIST);
        this.popupEle.style.removeProperty(SDRADICALHORZDIST);
        this.popupEle.style.removeProperty('top');
        this.popupEle.style.removeProperty('bottom');
        this.popupEle.classList.remove(SDRIGHT, SDLEFT, SDCENTER);
        this.popupEle.classList.remove(SDVERTICALRIGHT, SDHORIZONTALLEFT, SDHORIZONTALRIGHT);
    }
    private clearOverflow(): void {
        this.popupEle.classList.remove(SDOVERFLOW, SDVERTOVERFLOW, SDHORZOVERFLOW);
        this.popupEle.style.removeProperty(SDOVERFLOWLIMIT);
    }
    private hidePopupEle(e?: Event): void {
        if (!this.popupEle || !this.isMenuOpen) { return; }
        const eventArgs: SpeedDialBeforeOpenCloseEventArgs = { element: this.popupEle, event: e as Event, cancel: false };
        this.trigger('beforeClose', eventArgs, (args: SpeedDialBeforeOpenCloseEventArgs) => {
            if (args.cancel) { return; }
            if (this.animation.effect !== 'None') {
                const closeAnimation: AnimationModel = {
                    name: (this.animation.effect + 'Out') as baseEffect,
                    timingFunction: 'easeOut'
                };
                const eleArray: HTMLElement[] = this.popupTemplate ? [this.popupEle.firstElementChild as HTMLElement] : selectAll('.' + SDLI, this.popupEle);
                const timeOutInterval: number = this.animation.duration as number / (eleArray.length + 1);
                closeAnimation.duration = 2 * timeOutInterval;
                /* To keep the animation smooth, start the animation of the second element when animation first element is half completed */
                const animateElement: Function = (curIndex: number): void => {
                    const ele: HTMLElement = eleArray[parseInt(curIndex.toString(), 10)];
                    closeAnimation.delay = (curIndex === eleArray.length - 1) ? this.animation.delay : 0;
                    closeAnimation.begin = () => { if (curIndex === eleArray.length - 1) { this.startHide(); } };
                    closeAnimation.end = () => {
                        ele.classList.add(SDHIDDEN);
                        if (curIndex === 0) { this.endHide(); }
                    };
                    new Animation(closeAnimation).animate(ele);
                    if (curIndex !== 0) {
                        const index: number = curIndex - 1;
                        setTimeout(() => {
                            animateElement(index);
                        }, timeOutInterval);
                    }
                };
                animateElement(eleArray.length - 1);
            } else {
                this.startHide();
                if (!this.popupTemplate) {
                    const ele: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
                    ele.forEach((element: HTMLElement) => { element.classList.add(SDHIDDEN); });
                }
                this.endHide();
            }
        });
    }
    private startHide(): void {
        this.element.setAttribute('aria-expanded', 'false');
        this.removeFocus();
        this.isMenuOpen = false;
    }
    private endHide(): void {
        this.fab.setProperties({ iconCss: this.openIconCss });
        this.popupEle.classList.add(SDHIDDEN);
        if (this.popupTemplate) { this.setVisibility(true); }
        this.toggleOverlay();
        if (this.popupTemplate) {
            this.popupEle.removeAttribute('tabindex');
        }
        this.trigger('onClose', { element: this.popupEle });
    }
    private showPopupEle(e?: Event): void {
        if (!this.popupEle || this.isMenuOpen) { return; }
        if (this.popupTemplate || (this.mode === 'Radial')) {
            this.setCustomRadialPosition();
        }
        else {
            this.setLinearPosition();
        }
        const eventArgs: SpeedDialBeforeOpenCloseEventArgs = { element: this.popupEle, event: e as Event, cancel: false };
        this.trigger('beforeOpen', eventArgs, (args: SpeedDialBeforeOpenCloseEventArgs) => {
            if (args.cancel) { return; }
            if (this.animation.effect !== 'None' || (animationMode === 'Enable' && this.animation.effect === 'None')) {
                if (animationMode === 'Enable' && this.animation.effect === 'None') {
                    this.animation.effect = 'Fade';
                }
                if (animationMode === 'Enable' && this.animation.duration === 0) {
                    this.animation.duration = 400;
                }
                const openAnimation: AnimationModel = {
                    name: (this.animation.effect + 'In') as baseEffect,
                    timingFunction: 'easeIn'
                };
                const eleArray: HTMLElement[] = this.popupTemplate ? [this.popupEle.firstElementChild as HTMLElement] : selectAll('.' + SDLI, this.popupEle);
                const timeOutInterval: number = this.animation.duration as number / (eleArray.length + 1);
                openAnimation.duration = 2 * timeOutInterval;
                /* To keep the animation smooth, start the animation of the second element when animation first element is half completed */
                const animateElement: Function = (curIndex: number): void => {
                    const ele: HTMLElement = eleArray[parseInt(curIndex.toString(), 10)];
                    openAnimation.delay = (curIndex === 0) ? this.animation.delay : 0;
                    openAnimation.begin = () => {
                        if (curIndex === 0) { this.startShow(); }
                        ele.classList.remove(SDHIDDEN);
                    };
                    openAnimation.end = () => { if (curIndex === eleArray.length - 1) { this.endShow(); }};
                    new Animation(openAnimation).animate(ele);
                    if (curIndex !== eleArray.length - 1) {
                        const index: number = curIndex + 1;
                        setTimeout(() => {
                            animateElement(index);
                        }, timeOutInterval);
                    }
                };
                animateElement(0);
            } else {
                this.startShow();
                if (!this.popupTemplate) {
                    const ele: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
                    ele.forEach((element: HTMLElement) => { element.classList.remove(SDHIDDEN); });
                }
                this.endShow();
            }
        });
    }
    private startShow(): void {
        this.element.setAttribute('aria-expanded', 'true');
        this.isMenuOpen = true;
        this.toggleOverlay();
        this.popupEle.classList.remove(SDHIDDEN);
        if (this.popupTemplate) { this.setVisibility(false); }
    }
    private endShow(): void {
        if (this.closeIconCss) { this.fab.setProperties({ iconCss: this.closeIconCss }); }
        if (this.popupTemplate) {
            this.popupEle.setAttribute('tabindex', '1');
            this.popupEle.focus();
        }
        this.trigger('onOpen', { element: this.popupEle });
    }
    private toggleOverlay(): void {
        if (!this.overlayEle) { return; }
        this.overlayEle.classList[this.isMenuOpen ? 'remove' : 'add'](SDHIDDEN);
    }
    private removeOverlayEle(): void {
        if (!this.overlayEle) { return; }
        remove(this.overlayEle);
        (this.overlayEle as HTMLElement | undefined) = undefined;
    }

    private updatePopupItems(): void {
        if (this.popupEle) {
            this.hidePopupEle();
            this.clearItems();
            this.createItems();
            this.updatePositionProperties();
        } else {
            this.createPopup();
        }
    }
    private handleResize(e?: Event): void {
        if (!this.popupEle) { return; }
        this.hidePopupEle(e);
        this.clearOverflow();
        this.setPositionProps();
    }

    private triggerItemClick(e: Event, item: SpeedDialItemModel): void {
        let target: HTMLElement = e.target as HTMLElement;
        target = target.classList.contains(SDLI) ? target : closest(target, '.' + SDLI) as HTMLElement;
        const eventArgs: SpeedDialItemEventArgs = { element: target, item: item, event: e };
        this.trigger('clicked', eventArgs);
        this.hidePopupEle(e);
    }

    /**
     * Opens the SpeedDial popup to display to display the speed dial items or the popupTemplate.
     *
     * @returns {void}
     */
    public show(): void {
        this.showPopupEle();
    }

    /**
     * Closes the SpeedDial popup.
     *
     *@returns {void}
     */
    public hide(): void {
        this.hidePopupEle();
    }

    /**
     * Refreshes the button position of speed dial. You can call this method to re-position button when the target is resized.
     *
     *@returns {void}
     */
    public refreshPosition(): void {
        this.resizeHandler();
    }
    private resizeHandler(e?: Event): void {
        this.handleResize(e);
    }
    private clearItems(): void {
        const liList: HTMLElement[] = selectAll('.' + SDLI, this.popupEle);
        liList.forEach((element: HTMLElement) => {
            remove(element);
        });
    }
    private unwireEvents(): void {
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler);
        EventHandler.remove(document.body, 'click', this.bodyClickHandler);
        if (this.opensOnHover) { this.unwireFabHover(); } else { this.unwireFabClick(); }
    }
    private unwireFabClick(): void {
        EventHandler.remove(this.fab.element, 'click', this.fabClick);
    }
    private unwireFabHover(): void {
        this.popupEle.classList.remove(HOVERSD);
        EventHandler.remove(this.fab.element, 'mouseover', this.mouseOverHandle);
        EventHandler.remove(this.element, 'mouseleave', this.mouseLeaveHandle);
    }
    private unwirePopupEvents(): void {
        if (isRippleEnabled) {
            this.removeRippleEffect();
        }
        (this.removeRippleEffect as Function | null) = null;
        this.keyboardModule.destroy();
        this.popupKeyboardModule.destroy();
        this.documentKeyboardModule.destroy();
        (this.keyboardModule as KeyboardEvents | null) = null;
        (this.popupKeyboardModule as KeyboardEvents | null) = null;
        (this.documentKeyboardModule as KeyboardEvents | null) = null;
        EventHandler.remove(this.popupEle, 'click', this.popupClick);
        EventHandler.remove(this.popupEle, 'mouseleave', this.popupMouseLeaveHandle);
    }

    public destroy(): void {
        super.destroy();
        this.unwireEvents();
        ['aria-expanded', 'aria-haspopup', 'aria-controls'].forEach((attr: string) => {
            this.element.removeAttribute(attr);
        });
        if (this.popupEle) {
            this.unwirePopupEvents();
            remove(this.popupEle);
            (this.popupEle as HTMLElement | undefined) = undefined;
        }
        this.removeOverlayEle();
        this.fab.destroy();
        (this.fab as Fab | undefined) = undefined;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {SpeedDialModel} newProp - Specifies new properties
     * @param  {SpeedDialModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: SpeedDialModel, oldProp: SpeedDialModel): void {
        const fabProplist: string[] = ['content', 'cssClass', 'disabled', 'enablePersistence', 'enableRtl', 'iconPosition', 'position', 'target', 'template', 'title', 'visible', 'isPrimary'];
        const fabModel: Object = extend({}, newProp);
        for (const prop of Object.keys(fabModel)) {
            if ((fabProplist).indexOf(prop) < 0) {
                deleteObject(fabModel, prop);
            }
        }
        this.fab.setProperties(fabModel);
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                if (!this.popupEle) { break; }
                if (oldProp.cssClass) {
                    removeClass(this.overlayEle ? [this.popupEle, this.overlayEle] : [this.popupEle], oldProp.cssClass.split(/\s+/).filter((c: string) => c.length > 0));
                }
                if (newProp.cssClass) {
                    addClass(this.overlayEle ? [this.popupEle, this.overlayEle] : [this.popupEle], newProp.cssClass.split(/\s+/).filter((c: string) => c.length > 0));
                }
                break;
            case 'visible':
            case 'disabled':
                this.hide();
                break;
            case 'enableRtl':
                if (!this.popupEle) { break; }
                this.setRTL();
                break;
            case 'openIconCss':
                if (!this.isMenuOpen) { this.fab.setProperties({ iconCss: this.openIconCss }); }
                break;
            case 'closeIconCss':
                if (this.isMenuOpen) { this.fab.setProperties({ iconCss: this.closeIconCss }); }
                break;
            case 'position':
                if (!this.popupEle) { break; }
                this.updatePositionProperties();
                break;
            case 'direction':
                if (!this.popupEle || this.popupTemplate) { break; }
                this.updatePositionProperties();
                break;
            case 'popupTemplate':
                this.updatePopupTemplate();
                break;
            case 'target':
                this.hidePopupEle();
                this.checkTarget();
                if (this.overlayEle) { this.element.insertAdjacentElement('beforebegin', this.overlayEle); }
                if (!this.popupEle) { break; }
                this.element.insertAdjacentElement('afterend', this.popupEle);
                this.updatePositionProperties();
                break;
            case 'items':
            case 'itemTemplate':
                if (this.popupTemplate) { break; }
                this.updatePopupItems();
                break;
            case 'modal':
                if (newProp.modal) {
                    this.createOverlay();
                } else {
                    this.removeOverlayEle();
                }
                break;
            case 'mode':
                if (!this.popupEle || this.popupTemplate) { break; }
                this.popupEle.classList.remove(RADIALSD, LINEARSD);
                this.popupEle.classList.add((this.mode === 'Radial') ? RADIALSD : LINEARSD);
                this.updatePositionProperties();
                break;
            case 'radialSettings':
                if (this.popupEle && (this.mode === 'Radial') && !this.popupTemplate) { this.setRadialPosition(); }
                break;
            case 'opensOnHover':
                if (this.opensOnHover) {
                    this.unwireFabClick();
                    this.wireFabHover();
                } else {
                    this.unwireFabHover();
                    this.wireFabClick();
                }
                break;
            }
        }
    }
}
