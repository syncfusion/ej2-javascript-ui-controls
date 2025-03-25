import { Component, Property, Event, Collection, L10n, EmitType, Complex, compile, createElement, animationMode } from '@syncfusion/ej2-base';
import { addClass, removeClass, detach, attributes, prepend, setStyleAttribute } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, isBlazor } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, append, EventHandler, Draggable, extend } from '@syncfusion/ej2-base';
import { BlazorDragEventArgs, SanitizeHtmlHelper, Browser } from '@syncfusion/ej2-base';
import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { Popup, PositionData, getZindexPartial } from '../popup/popup';
import { PositionDataModel } from '../popup/popup-model';
import { ButtonPropsModel, DialogModel, AnimationSettingsModel } from './dialog-model';
import { createResize, removeResize, setMinHeight, setMaxWidth, setMaxHeight, resizeDestroy } from '../common/resize';

/**
 * Defines the types of a button in the dialog.
 */
export type ButtonType = 'Button' | 'Submit' | 'Reset';

/**
 * Provides information about a SanitizeSelectors.
 */
export interface SanitizeSelectors {
    /** Returns the tags. */
    tags?: string[]
    /** Returns the attributes. */
    attributes?: SanitizeRemoveAttrs[]
}

/**
 * Provides information about a BeforeSanitizeHtml event.
 */
export interface BeforeSanitizeHtmlArgs {
    /** Illustrates whether the current action needs to be prevented or not. */
    cancel?: boolean
    /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string.
     *
     * @function
     * @param {string} value - Returns the value.
     * @returns {string}
     */
    helper?: Function
    /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
     *Also possible to modify the block list in this event.
     */
    selectors?: SanitizeSelectors
}

/**
 * Provides information about a SanitizeRemoveAttributes.
 */
export interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize */
    attribute?: string
    /** Defines the selector that sanitize the specified attributes within the selector */
    selector?: string
}

export class ButtonProps extends ChildProperty<ButtonProps> {
    /**
     * Specifies the flat appearance of the dialog buttons
     *
     * @default true
     */
    @Property(true)
    public isFlat: boolean;
    /**
     * Specifies the button component properties to render the dialog buttons.
     */
    @Property()
    public buttonModel: ButtonModel;

    /**
     * Specify the type of the button.
     * Possible values are Button, Submit and Reset.
     *
     * @default 'Button'
     * @aspType string
     * @blazorType string
     */
    @Property('Button')
    public type: ButtonType | string;

    /**
     * Event triggers when `click` the dialog button.
     *
     * @event 'object'
     * @blazorProperty 'OnClick'
     */
    @Event()
    public click: EmitType<Object>;
    /* eslint-enable */
}

/**
 * Configures the animation properties for both open and close the dialog.
 */
export class AnimationSettings extends ChildProperty<AnimationSettings> {
    /**
     * Specifies the animation name that should be applied on open and close the dialog.
     * If user sets Fade animation, the dialog will open with `FadeIn` effect and close with `FadeOut` effect.
     * The following are the list of animation effects available to configure to the dialog:
     * 1. Fade
     * 2. FadeZoom
     * 3. FlipLeftDown
     * 4. FlipLeftUp
     * 5. FlipRightDown
     * 6. FlipRightUp
     * 7. FlipXDown
     * 8. FlipXUp
     * 9. FlipYLeft
     * 10. FlipYRight
     * 11. SlideBottom
     * 12. SlideLeft
     * 13. SlideRight
     * 14. SlideTop
     * 15. Zoom
     * 16. None
     *
     * @default 'Fade'
     */
    @Property('Fade')
    public effect: DialogEffect;

    /**
     * Specifies the duration in milliseconds that the animation takes to open or close the dialog.
     *
     * @default 400
     */
    @Property(400)
    public duration: number;

    /**
     * Specifies the delay in milliseconds to start animation.
     *
     * @default 0
     */
    @Property(0)
    public delay: number;
}

/**
 * Specifies the Dialog animation effects.
 */
export type DialogEffect = 'Fade' | 'FadeZoom' | 'FlipLeftDown' | 'FlipLeftUp' | 'FlipRightDown' | 'FlipRightUp'
| 'FlipXDown' | 'FlipXUp' | 'FlipYLeft' | 'FlipYRight' | 'SlideBottom' | 'SlideLeft' | 'SlideRight' | 'SlideTop' | 'Zoom'
| 'None';

/**
 * Specifies the Resize Handles.
 */
export type ResizeDirections = 'South' | 'North' | 'East' | 'West' | 'NorthEast' | 'NorthWest' | 'SouthEast' | 'SouthWest' | 'All';
const ROOT: string = 'e-dialog';
const RTL: string = 'e-rtl';
const DLG_HEADER_CONTENT: string = 'e-dlg-header-content';
const DLG_HEADER: string = 'e-dlg-header';
const DLG_FOOTER_CONTENT: string = 'e-footer-content';
const MODAL_DLG: string = 'e-dlg-modal';
const DLG_CONTENT: string = 'e-dlg-content';
const DLG_CLOSE_ICON: string = 'e-icon-dlg-close';
const DLG_OVERLAY: string = 'e-dlg-overlay';
const DLG_TARGET: string = 'e-dlg-target';
const DLG_CONTAINER: string = 'e-dlg-container';
const SCROLL_DISABLED: string = 'e-scroll-disabled';
const DLG_PRIMARY_BUTTON: string = 'e-primary';
const ICON: string = 'e-icons';
const POPUP_ROOT: string = 'e-popup';
const DEVICE: string = 'e-device';
const FULLSCREEN: string = 'e-dlg-fullscreen';
const DLG_CLOSE_ICON_BTN: string = 'e-dlg-closeicon-btn';
const DLG_HIDE: string = 'e-popup-close';
const DLG_SHOW: string = 'e-popup-open';
const DLG_UTIL_DEFAULT_TITLE: string = 'Information';
const DLG_UTIL_ROOT: string = 'e-scroll-disabled';
const DLG_UTIL_ALERT: string = 'e-alert-dialog';
const DLG_UTIL_CONFIRM: string = 'e-confirm-dialog';
const DLG_RESIZABLE: string = 'e-dlg-resizable';
const DLG_RESTRICT_LEFT_VALUE: string = 'e-restrict-left';
const DLG_RESTRICT_WIDTH_VALUE: string = 'e-resize-viewport';
const DLG_REF_ELEMENT: string = 'e-dlg-ref-element';
const DLG_USER_ACTION_CLOSED: string = 'user action';
const DLG_CLOSE_ICON_CLOSED: string = 'close icon';
const DLG_ESCAPE_CLOSED: string = 'escape';
const DLG_OVERLAYCLICK_CLOSED: string = 'overlayClick';
const DLG_DRAG : string = 'e-draggable';


/**
 * Provides information about a BeforeOpen event.
 */
export interface BeforeOpenEventArgs {
    /**
     * Specify the value to override max-height value of dialog.
     */
    maxHeight: string
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Returns the target element of the dialog.
     *
     * @aspType string
     * @blazorType string
     * @deprecated
     */
    target?: HTMLElement | string
}

/**
 * Provides information about a BeforeClose event.
 */
export interface BeforeCloseEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Returns the target element of the dialog.
     *
     * @aspType string
     * @blazorType string
     * @deprecated
     */
    target?: HTMLElement | string
    /**
     * Returns the original event arguments.
     */
    event: Event
    /**
     * Returns whether the dialog, is closed by "close icon", "overlayClick", "escape" and "user action"
     */
    closedBy?: string
}

/**
 * Provides information about a DialogOpen event.
 */
export interface OpenEventArgs {
    /**
     * Defines whether the focus action can be prevented in dialog.
     */
    preventFocus: boolean
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Specify the name of the event.
     */
    name: string
}

/**
 * Provides information about a Close event.
 */
export interface CloseEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement
    /**
     * Returns the element of the dialog.
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
    /**
     * Specify the name of the event.
     */
    name: string
}

/**
 * Provides information about a DragStart event.
 */
export interface DragStartEventArgs {
    /**
     * Returns the original event arguments.
     *
     * @blazorType MouseEventArgs
     */
    event: Event
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Returns the target element of the dialog.
     */
    target: HTMLElement
    /**
     * Returns the name of the event.
     */
    name: string
}

/**
 * Provides information about a DragStop event.
 */
export interface DragStopEventArgs {
    /**
     * Returns the original event arguments.
     *
     * @blazorType MouseEventArgs
     */
    event: Event
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Returns the target element of the dialog.
     */
    target: HTMLElement
    /**
     * Returns the helper element.
     */
    helper: Element
    /**
     * Returns the name of the event.
     */
    name: string
}

/**
 * Provides information about a Drag event.
 */
export interface DragEventArgs {
    /**
     * Returns the original event arguments.
     *
     * @blazorType MouseEventArgs
     */
    event: Event
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Returns the target element of the dialog.
     */
    target: HTMLElement
    /**
     * Returns the name of the event.
     */
    name: string
}

/**
 * Represents the dialog component that displays the information and get input from the user.
 * Two types of dialog components are `Modal and Modeless (non-modal)` depending on its interaction with parent application.
 * ```html
 * <div id="dialog"></div>
 * ```
 * ```typescript
 * <script>
 *   var dialogObj = new Dialog({ header: 'Dialog' });
 *   dialogObj.appendTo("#dialog");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Dialog extends Component<HTMLElement> implements INotifyPropertyChanged {
    // Internal variables
    private closeIconClickEventHandler: Function;
    private dlgOverlayClickEventHandler: Function;
    private createEventHandler: Function;
    /* eslint-enable */
    private contentEle: HTMLElement;
    private dlgOverlay: HTMLElement;
    private dlgContainer: HTMLElement;
    private headerEle: HTMLElement;
    private buttonContent: string[];
    private ftrTemplateContent: HTMLElement;
    private headerContent: HTMLElement;
    private closeIcon: HTMLElement;
    private popupObj: Popup;
    private btnObj: Button[];
    private closeIconBtnObj: Button;
    private dragObj: Draggable;
    private primaryButtonEle: HTMLElement;
    private targetEle: HTMLElement;
    private dialogOpen: boolean;
    private initialRender: boolean;
    private innerContentElement: Node;
    private storeActiveElement: HTMLElement;
    private focusElements: HTMLElement[];
    private focusIndex: number;
    private l10n: L10n;
    private clonedEle: HTMLElement;
    private closeArgs: Object;
    private calculatezIndex: boolean;
    private allowMaxHeight: boolean;
    private preventVisibility: boolean;
    private IsDragStop: boolean;
    private refElement: HTMLElement;
    private dlgClosedBy: string;
    private isModelResize: boolean;
    private boundWindowResizeHandler: () => void;
    /**
     * Specifies the value that can be displayed in dialog's content area.
     * It can be information, list, or other HTML elements.
     * The content of dialog can be loaded with dynamic data such as database, AJAX content, and more.
     *
     * {% codeBlock src="dialog/content-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dialog/content-api/index.html" %}{% endcodeBlock %}
     *
     * @default ''
     * @blazorType string
     * @aspType string
     */
    @Property('')
    public content: string | HTMLElement | Function;
    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * Enables or disables the persistence of the dialog's dimensions and position state between page reloads.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies the value that represents whether the close icon is shown in the dialog component.
     *
     * @default false
     */
    @Property(false)
    public showCloseIcon: boolean;
    /**
     * Specifies the Boolean value whether the dialog can be displayed as modal or non-modal.
     * * `Modal`: It creates overlay that disable interaction with the parent application and user should
     * respond with modal before continuing with other applications.
     * * `Modeless`: It does not prevent user interaction with parent application.
     *
     * @default false
     */
    @Property(false)
    public isModal: boolean;
    /**
     * Specifies the value that can be displayed in the dialog's title area that can be configured with plain text or HTML elements.
     * This is optional property and the dialog can be displayed without header, if the header property is null.
     *
     * @default ''
     * @blazorType string
     * @aspType string
     */
    @Property('')
    public header: string | HTMLElement | Function;
    /**
     * Specifies the value that represents whether the dialog component is visible.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Specifies the value whether the dialog component can be resized by the end-user.
     * If enableResize is true, the dialog component creates grip to resize it diagonal direction.
     *
     * @default false
     */
    @Property(false)
    public enableResize: boolean;
    /**
     * Specifies the resize handles direction in the dialog component that can be resized by the end-user.
     *
     * @default ['South-East']
     */
    @Property(['South-East'])
    public resizeHandles: ResizeDirections[];
    /**
     * Specifies the height of the dialog component.
     *
     * @default 'auto'
     * @blazorType string
     */
    @Property('auto')
    public height: string | number;
    /**
     * Specify the min-height of the dialog component.
     *
     * @default ''
     * @blazorType string
     */
    @Property('')
    public minHeight: string | number;
    /**
     * Specifies the width of the dialog.
     *
     * @default '100%'
     * @blazorType string
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the CSS class name that can be appended with root element of the dialog.
     * One or more custom CSS classes can be added to a dialog.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     *
     * @default 1000
     */
    @Property(1000)
    public zIndex: number;
    /**
     * Specifies the target element in which to display the dialog.
     * The default value is null, which refers the `document.body` element.
     *
     * @default null
     * @blazorType string
     */
    @Property(null)
    public target: HTMLElement | string;
    /**
     * Specifies the template value that can be displayed with dialog's footer area.
     * This is optional property and can be used only when the footer is occupied with information or custom components.
     * By default, the footer is configured with action [buttons](#buttons).
     * If footer template is configured to dialog, the action buttons property will be disabled.
     *
     * > More information on the footer template configuration can be found on this [documentation](../../dialog/template/#footer) section.
     *
     * @default ''
     * @blazorType string
     * @aspType string
     */
    @Property('')
    public footerTemplate: HTMLElement | string | Function;
    /**
     * Specifies the value whether the dialog component can be dragged by the end-user.
     * The dialog allows to drag by selecting the header and dragging it for re-position the dialog.
     *
     * > More information on the draggable behavior can be found on this [documentation](../../dialog/getting-started/#draggable) section.
     *
     * {% codeBlock src='dialog/allowDragging/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowDragging: boolean;
    /**
     * Configures the action `buttons` that contains button properties with primary attributes and click events.
     * One or more action buttons can be configured to the dialog.
     *
     * > More information on the button configuration can be found on this
     * [documentation](../../dialog/getting-started/#enable-footer) section.
     *
     * {% codeBlock src="dialog/buttons-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dialog/buttons-api/index.html" %}{% endcodeBlock %}
     *
     * {% codeBlock src='dialog/buttons/index.md' %}{% endcodeBlock %}
     *
     * @default [{}]
     */
    @Collection<ButtonPropsModel>([{}], ButtonProps)
    public buttons: ButtonPropsModel[];
    /**
     * Specifies the boolean value whether the dialog can be closed with the escape key
     * that is used to control the dialog's closing behavior.
     *
     * @default true
     */
    @Property(true)
    public closeOnEscape: boolean;
    /**
     * Specifies the animation settings of the dialog component.
     * The animation effect can be applied on open and close the dialog with duration and delay.
     *
     * > More information on the animation settings in dialog can be found on this [documentation](../../dialog/animation/)  section.
     *
     * {% codeBlock src="dialog/animation-api/index.ts" %}{% endcodeBlock %}
     *
     * {% codeBlock src="dialog/animation-api/index.html" %}{% endcodeBlock %}
     *
     * {% codeBlock src='dialog/animationSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { effect: 'Fade', duration: 400, delay:0 }
     */
    @Complex<AnimationSettingsModel>({}, AnimationSettings)
    public animationSettings: AnimationSettingsModel;
    /**
     * Specifies the value where the dialog can be positioned within the document or target.
     * The position can be represented with pre-configured positions or specific X and Y values.
     * * `X value`: left, center, right, or offset value.
     * * `Y value`: top, center, bottom, or offset value.
     *
     * > More information on the positioning in dialog can be found on this [documentation](../../dialog/getting-started/#positioning)  section.
     *
     * {% codeBlock src='dialog/position/index.md' %}{% endcodeBlock %}
     *
     * @default { X: 'center', Y: 'center' }
     */
    @Complex<PositionDataModel>({ X: 'center', Y: 'center' }, PositionData)
    public position: PositionDataModel;
    /**
     * Event triggers when the dialog is created.
     *
     * @event 'object'
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when a dialog is opened.
     *
     * @event 'object'
     * @blazorProperty 'Opened'
     * @blazorType OpenEventArgs
     */
    @Event()
    public open: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers before sanitize the value.
     *
     * @event 'object'
     * @blazorProperty 'OnSanitizeHtml'
     */
    @Event()
    public beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;
    /**
     * Event triggers when the dialog is being opened.
     * If you cancel this event, the dialog remains closed.
     * Set the cancel argument to true to cancel the open of a dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnOpen'
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenEventArgs>;
    /**
     * Event triggers after the dialog has been closed.
     *
     * @event 'object'
     * @blazorProperty 'Closed'
     * @blazorType CloseEventArgs
     */
    @Event()
    public close: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers before the dialog is closed.
     * If you cancel this event, the dialog remains opened.
     * Set the cancel argument to true to cancel the closure of a dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnClose'
     */
    @Event()
    public beforeClose: EmitType<BeforeCloseEventArgs>;
    /**
     * Event triggers when the user begins dragging the dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnDragStart'
     * @blazorType DragStartEventArgs
     */
    @Event()
    public dragStart: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the user stop dragging the dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnDragStop'
     * @blazorType DragStopEventArgs
     */
    @Event()
    public dragStop: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the user drags the dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnDrag'
     * @blazorType DragEventArgs
     */
    @Event()
    public drag: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the overlay of dialog is clicked.
     *
     * @event 'object'
     * @blazorProperty 'OnOverlayClick'
     */
    @Event()
    public overlayClick: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the user begins to resize a dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnResizeStart'
     */
    @Event()
    public resizeStart: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the user resize the dialog.
     *
     * @event 'object'
     * @blazorProperty 'Resizing'
     */
    @Event()
    public resizing: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the user stop to resize a dialog.
     *
     * @event 'object'
     * @blazorProperty 'OnResizeStop'
     */
    @Event()
    public resizeStop: EmitType<Object>;
    /* eslint-enable */
    /**
     * Event triggers when the dialog is destroyed.
     *
     * @event 'object'
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Event>;
    protected needsID: boolean;
    /*
     * * Constructor for creating the widget
     *
     * @param
     * @param
     * @hidden
     */
    constructor(options?: DialogModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.needsID = true;
    }
    /**
     *Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initialize();
        this.initRender();
        this.wireEvents();
        if (this.width === '100%') {
            this.element.style.width = '';
        }
        if (this.minHeight !== '') {
            this.element.style.minHeight = formatUnit(this.minHeight);
        }
        if (this.enableResize) {
            this.setResize();
            if (this.isModal) {
                this.isModelResize = true;
            }
            if (this.animationSettings.effect === 'None') {
                this.getMinHeight();
            }
        }
        this.renderComplete();
    }
    private initializeValue(): void{
        this.dlgClosedBy = DLG_USER_ACTION_CLOSED;

    }
    /**
     *Initialize the event handler
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.initializeValue();
        this.headerContent = null;
        this.allowMaxHeight = true;
        this.preventVisibility = true;
        this.clonedEle = <HTMLElement>this.element.cloneNode(true);
        this.closeIconClickEventHandler = (event: Event): void => {
            this.dlgClosedBy = DLG_CLOSE_ICON_CLOSED;
            this.hide(event);
        };
        this.dlgOverlayClickEventHandler = (event: Object): void => {
            this.dlgClosedBy = DLG_OVERLAYCLICK_CLOSED;
            (event as {[key: string]: boolean}).preventFocus = false;
            this.trigger('overlayClick', event, (overlayClickEventArgs: {[key: string]: object}) => {
                if (!overlayClickEventArgs.preventFocus) {
                    this.focusContent();
                }
                this.dlgClosedBy = DLG_USER_ACTION_CLOSED;
            });
        };
        const localeText: object = { close: 'Close' };
        this.l10n = new L10n('dialog', localeText, this.locale);
        this.checkPositionData();
        if (isNullOrUndefined(this.target)) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.target = document.body;
            this.isProtectedOnChange = prevOnChange;
        }
    }
    private updatePersistData(): void {
        if (this.enablePersistence){
            this.setProperties({ width : parseFloat(this.element.style.width), height : parseFloat(this.element.style.height),
                position : { X: parseFloat(this.dragObj.element.style.left), Y: parseFloat(this.dragObj.element.style.top)} }, true);
        }
    }
    private isNumberValue(value: string): boolean {
        const isNumber: boolean = /^[-+]?\d*\.?\d+$/.test(value);
        return isNumber;
    }

    private checkPositionData(): void  {
        if (!isNullOrUndefined(this.position)) {
            if ( !isNullOrUndefined(this.position.X) && ( typeof(this.position.X) !== 'number')) {
                const isNumber: boolean = this.isNumberValue(this.position.X);
                if (isNumber) {
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.X = parseFloat(this.position.X);
                    this.isProtectedOnChange = prevOnChange;
                }
            }

            if ( !isNullOrUndefined(this.position.Y) && ( typeof(this.position.Y) !== 'number')) {
                const isNumber: boolean = this.isNumberValue(this.position.Y);
                if (isNumber) {
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.Y = parseFloat(this.position.Y);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
        }
    }

    private getEle(list: HTMLCollection, selector: string): Element {
        let element: Element = undefined;
        for (let i: number = 0; i < list.length; i++) {
            if ((list[i as number] as Element).classList.contains(selector)) {
                element = list[i as number] as Element;
                break;
            }
        }
        return element;
    }

    /* istanbul ignore next */
    private getMinHeight(): number {
        let computedHeaderHeight: string = '0px';
        let computedFooterHeight: string = '0px';
        if (!isNullOrUndefined(this.element.querySelector('.' + DLG_HEADER_CONTENT))) {
            computedHeaderHeight = getComputedStyle(this.headerContent).height;
        }
        const footerEle: Element = this.getEle(this.element.children, DLG_FOOTER_CONTENT);
        if (!isNullOrUndefined(footerEle)) {
            computedFooterHeight = getComputedStyle(footerEle).height;
        }
        const headerHeight: number = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        const footerHeight: number = parseInt(computedFooterHeight.slice(0, computedFooterHeight.indexOf('p')), 10);
        setMinHeight(headerHeight + 30 + (isNaN(footerHeight) ? 0 : footerHeight));
        return (headerHeight + 30 + footerHeight);
    }

    private onResizeStart(args: ResizeMouseEventArgs | ResizeTouchEventArgs, dialogObj: Dialog): boolean {
        dialogObj.trigger('resizeStart', args);
        if (!args.cancel && this.isModelResize && !isNullOrUndefined(this.dlgContainer) && this.dlgContainer.classList.contains('e-dlg-' + this.position.X + '-' + this.position.Y)) {
            this.setPopupPosition();
            this.dlgContainer.classList.remove('e-dlg-' + this.position.X + '-' + this.position.Y);
            const targetType: HTMLElement = this.getTargetContainer(this.target);
            if (targetType instanceof Element) {
                const computedStyle: CSSStyleDeclaration = window.getComputedStyle(targetType);
                if (computedStyle.getPropertyValue('direction') === 'rtl') {
                    this.element.style.position = 'absolute';
                } else {
                    this.element.style.position = 'relative';
                }
            } else {
                this.element.style.position = 'relative';
            }
            if (this.element.classList.contains(DLG_RESTRICT_LEFT_VALUE)) {
                this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            }
            this.isModelResize = false;
        }
        return args.cancel;
    }

    private onResizing(args: MouseEvent | TouchEvent, dialogObj: Dialog): void {
        dialogObj.trigger('resizing', args);
    }

    private onResizeComplete(args: MouseEvent | TouchEvent, dialogObj: Dialog): void {
        dialogObj.trigger('resizeStop', args);
        this.updatePersistData();
    }

    private setResize(): void {
        if (this.enableResize) {
            this.element.classList.add(DLG_RESIZABLE);
            const computedHeight: string = getComputedStyle(this.element).minHeight;
            const computedWidth: string = getComputedStyle(this.element).minWidth;
            let direction: string = '';
            for (let i: number = 0; i < this.resizeHandles.length; i++) {
                if (this.resizeHandles[i as number] === 'All') {
                    direction = 'south north east west north-east north-west south-east south-west';
                    break;
                } else {
                    let directionValue: string = '';
                    switch (this.resizeHandles[i as number].toString()) {
                    case 'SouthEast':
                        directionValue = 'south-east';
                        break;
                    case 'SouthWest':
                        directionValue = 'south-west';
                        break;
                    case 'NorthEast':
                        directionValue = 'north-east';
                        break;
                    case 'NorthWest':
                        directionValue = 'north-west';
                        break;
                    default:
                        directionValue = this.resizeHandles[i as number].toString();
                        break;
                    }
                    direction += directionValue.toLocaleLowerCase() + ' ';
                }
            }
            if (this.enableRtl && direction.trim() === 'south-east') {
                direction = 'south-west';
            } else if (this.enableRtl && direction.trim() === 'south-west') {
                direction = 'south-east';
            }
            if (this.isModal && this.enableRtl) {
                this.element.classList.add(DLG_RESTRICT_LEFT_VALUE);
            } else if (this.isModal && this.target === document.body) {
                this.element.classList.add(DLG_RESTRICT_WIDTH_VALUE);
            }
            createResize({
                element: this.element,
                direction: direction,
                minHeight: parseInt(computedHeight.slice(0, computedWidth.indexOf('p')), 10),
                maxHeight: this.targetEle.clientHeight,
                minWidth: parseInt(computedWidth.slice(0, computedWidth.indexOf('p')), 10),
                maxWidth: this.targetEle.clientWidth,
                boundary: this.target === document.body ? null : this.targetEle,
                resizeBegin: this.onResizeStart.bind(this),
                resizeComplete: this.onResizeComplete.bind(this),
                resizing: this.onResizing.bind(this),
                proxy: this
            });
            this.wireWindowResizeEvent();
        } else {
            removeResize();
            this.unWireWindowResizeEvent();
            if (this.isModal) {
                this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            } else {
                this.element.classList.remove(DLG_RESTRICT_WIDTH_VALUE);
            }
            this.element.classList.remove(DLG_RESIZABLE);
        }
    }
    private getFocusElement(target: HTMLElement): Button {
        const value: string = 'input,select,textarea,button:enabled,a,[contenteditable="true"],[tabindex]';
        const items: NodeListOf<HTMLElement> = target.querySelectorAll(value);
        return { element: items[items.length - 1] as HTMLElement } as Button;
    }
    /* istanbul ignore next */
    private keyDown(event: KeyboardEvent): void {
        if (event.keyCode === 9) {
            if (this.isModal) {
                let buttonObj: Button;
                if (!isNullOrUndefined(this.btnObj)) {
                    buttonObj = this.btnObj[this.btnObj.length - 1];
                }
                if ((isNullOrUndefined(this.btnObj)) && (!isNullOrUndefined(this.ftrTemplateContent))) {
                    buttonObj = this.getFocusElement(this.ftrTemplateContent);
                }
                if (isNullOrUndefined(this.btnObj) && isNullOrUndefined(this.ftrTemplateContent) && !isNullOrUndefined(this.contentEle)) {
                    buttonObj = this.getFocusElement(this.contentEle);
                }
                if (!isNullOrUndefined(buttonObj) && document.activeElement === buttonObj.element && !event.shiftKey) {
                    event.preventDefault();
                    this.focusableElements(this.element).focus();
                }
                if (document.activeElement === this.focusableElements(this.element) && event.shiftKey) {
                    event.preventDefault();
                    if (!isNullOrUndefined(buttonObj)) {
                        buttonObj.element.focus();
                    }
                }
            }
        }
        const element: HTMLElement = <HTMLElement>document.activeElement;
        const isTagName: boolean = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
        let isContentEdit: boolean = false;
        if (!isTagName) {
            isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
        }
        if (event.keyCode === 27 && this.closeOnEscape) {
            this.dlgClosedBy = DLG_ESCAPE_CLOSED;
            const query: HTMLElement = <HTMLElement>document.querySelector('.e-popup-open:not(.e-dialog)');
            // 'document.querySelector' is used to find the elements rendered based on body
            if (!(!isNullOrUndefined(query) && !query.classList.contains('e-toolbar-pop') && !query.classList.contains('e-slider-tooltip'))){
                this.hide(event);
            }
        }
        if ((event.keyCode === 13 && !event.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
                isTagName && !isNullOrUndefined(this.primaryButtonEle)) ||
            (event.keyCode === 13 && event.ctrlKey && (element.tagName.toLowerCase() === 'textarea' ||
                isContentEdit)) && !isNullOrUndefined(this.primaryButtonEle)) {
            let buttonIndex: number;
            const firstPrimary: boolean = this.buttons.some((data: { [key: string]: Object }, index: number) => {
                buttonIndex = index;
                const buttonModel: { [key: string]: Object } = (data.buttonModel as { [key: string]: Object });
                return !isNullOrUndefined(buttonModel) && buttonModel.isPrimary === true;
            });
            if (firstPrimary && typeof (this.buttons[buttonIndex as number].click) === 'function' && !(this.primaryButtonEle as HTMLButtonElement).disabled) {
                setTimeout(() => {
                    this.buttons[buttonIndex as number].click.call(this, event);
                });
            }
        }
    }
    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    private initialize(): void {
        if (!isNullOrUndefined(this.target)) {
            this.targetEle = ((typeof this.target) === 'string') ?
                <HTMLElement>document.querySelector(<string>this.target) : <HTMLElement>this.target;
        }
        if (!this.isBlazorServerRender()) {
            addClass([this.element], ROOT);
        }
        if (Browser.isDevice) {
            addClass([this.element], DEVICE);
        }
        if (!this.isBlazorServerRender()) {
            this.setCSSClass();
        }
        this.setMaxHeight();
    }
    /**
     * Initialize the rendering
     *
     * @returns {void}
     * @private
     */
    private initRender(): void {
        this.initialRender = true;
        if (!this.isBlazorServerRender()) {
            attributes(this.element, { role: 'dialog' });
        }
        if (this.zIndex === 1000) {
            this.setzIndex(this.element, false);
            this.calculatezIndex = true;
        } else {
            this.calculatezIndex = false;
        }
        this.setTargetContent();
        if (this.header !== '' && !isNullOrUndefined(this.header)) {
            this.setHeader();
        }
        this.renderCloseIcon();
        this.setContent();
        if (this.footerTemplate !== '' && !isNullOrUndefined(this.footerTemplate)) {
            this.setFooterTemplate();
        } else if (!isNullOrUndefined(this.buttons[0]) && !isNullOrUndefined(this.buttons[0].buttonModel)) {
            this.setButton();
        }
        if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
        attributes(this.element, { 'aria-modal': (this.isModal ? 'true' : 'false') });
        if (this.isModal) {
            this.setIsModal();
        }
        if (this.element.classList.contains(DLG_UTIL_ALERT) !== true && this.element.classList.contains(DLG_UTIL_CONFIRM) !== true
            && !isNullOrUndefined(this.element.parentElement)) {
            const parentEle: HTMLElement = this.isModal ? this.dlgContainer.parentElement : this.element.parentElement;
            this.refElement = this.createElement('div', { className: DLG_REF_ELEMENT });
            parentEle.insertBefore(this.refElement, (this.isModal ? this.dlgContainer : this.element));
        }
        if (!isNullOrUndefined(this.targetEle)) {
            if (this.isModal) {
                this.targetEle.appendChild(this.dlgContainer);
            } else {
                this.targetEle.appendChild(this.element);
            }
        }
        this.popupObj = new Popup(this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.target,
            actionOnScroll: 'none',
            enableRtl: this.enableRtl,
            // eslint-disable-next-line
            open: (event: Event) => {
                const eventArgs: object = {
                    container: this.isModal ? this.dlgContainer : this.element,
                    element: this.element,
                    target: this.target,
                    preventFocus: false
                };
                if (this.enableResize) {
                    this.resetResizeIcon();
                }
                this.trigger('open', eventArgs, (openEventArgs: {[key: string]: object} ) => {
                    if (!openEventArgs.preventFocus) {
                        this.focusContent();
                    }
                });
            },
            // eslint-disable-next-line
            close: (event: Event) => {
                if (this.isModal) {
                    addClass([this.dlgOverlay], 'e-fade');
                }
                this.unBindEvent(this.element);
                if (this.isModal) {
                    this.dlgContainer.style.display = 'none';
                }
                this.trigger('close', this.closeArgs);
                const activeEle: HTMLElement = document.activeElement as HTMLElement;
                if (!isNullOrUndefined(activeEle) && !isNullOrUndefined((activeEle).blur)) {
                    activeEle.blur();
                }
                if (!isNullOrUndefined(this.storeActiveElement) && !isNullOrUndefined(this.storeActiveElement.focus)) {
                    this.storeActiveElement.focus();
                }
            }
        });
        this.positionChange();
        this.setEnableRTL();
        if (!this.isBlazorServerRender()) {
            addClass([this.element], DLG_HIDE);
            if (this.isModal) {
                this.setOverlayZindex();
            }
        }
        if (this.visible) {
            this.show();
            if (this.isModal) {
                const targetType: HTMLElement = this.getTargetContainer(this.target);
                if (targetType instanceof Element){
                    const computedStyle: CSSStyleDeclaration = window.getComputedStyle(targetType);
                    if (computedStyle.getPropertyValue('direction') === 'rtl') {
                        this.setPopupPosition();
                    }
                }
            }
        } else {
            if (this.isModal) {
                this.dlgOverlay.style.display = 'none';
            }
        }
        this.initialRender = false;
    }

    private getTargetContainer(targetValue: HTMLElement | string): HTMLElement | null {
        let targetElement: null | HTMLElement = null;
        if (typeof targetValue === 'string') {
            if (targetValue.startsWith('#')) {
                targetElement = document.getElementById(targetValue.substring(1));
            } else if (targetValue.startsWith('.')) {
                const elements: HTMLCollectionOf<Element> = document.getElementsByClassName(targetValue.substring(1));
                targetElement = elements.length > 0 ? elements[0] as HTMLElement : null;
            } else {
                if (!((targetValue as any) instanceof HTMLElement) && (targetValue as any) !== document.body) {
                    targetElement = document.querySelector(targetValue) as HTMLElement;
                }
            }
        } else if (targetValue instanceof HTMLElement) {
            targetElement = targetValue;
        }
        return targetElement;
    }

    private resetResizeIcon(): void {
        const dialogConHeight: number = this.getMinHeight();
        if (this.targetEle.offsetHeight < dialogConHeight) {
            const className: string = this.enableRtl ? 'e-south-west' : 'e-south-east';
            const resizeIcon: HTMLElement = this.element.querySelector('.' + className);
            if (!isNullOrUndefined(resizeIcon)) {
                resizeIcon.style.bottom = '-' + dialogConHeight.toString() + 'px';
            }
        }
    }

    private setOverlayZindex(zIndexValue?: number): void {
        let zIndex: number;
        if (isNullOrUndefined(zIndexValue)) {
            zIndex = parseInt(this.element.style.zIndex, 10) ? parseInt(this.element.style.zIndex, 10) : this.zIndex;
        } else {
            zIndex = zIndexValue;
        }
        this.dlgOverlay.style.zIndex = (zIndex - 1).toString();
        this.dlgContainer.style.zIndex = zIndex.toString();
    }

    private positionChange(): void {
        if (this.isModal) {
            if (!isNaN(parseFloat(this.position.X as string)) && !isNaN(parseFloat(this.position.Y as string))) {
                this.setPopupPosition();
            } else if ((!isNaN(parseFloat(this.position.X as string)) && isNaN(parseFloat(this.position.Y as string)))
            || (isNaN(parseFloat(this.position.X as string)) && !isNaN(parseFloat(this.position.Y as string)))) {
                this.setPopupPosition();
            } else {
                this.element.style.top = '0px';
                this.element.style.left = '0px';
                this.dlgContainer.classList.add('e-dlg-' + this.position.X + '-' + this.position.Y);
            }
        } else {
            this.setPopupPosition();
        }
    }

    private setPopupPosition(): void {
        this.popupObj.setProperties({
            position: {
                X: this.position.X, Y: this.position.Y
            }
        });
    }

    private setAllowDragging(): void {
        const handleContent: string = '.' + DLG_HEADER_CONTENT;
        if (!this.element.classList.contains( DLG_DRAG)){
            this.dragObj = new Draggable(this.element, {
                clone: false,
                isDragScroll: true,
                abort: '.e-dlg-closeicon-btn',
                handle: handleContent,
                dragStart: (event: Object & BlazorDragEventArgs) => {
                    this.trigger('dragStart', event, (dragEventArgs: Object & BlazorDragEventArgs) => {
                        if (isBlazor()) {
                            dragEventArgs.bindEvents(event.dragElement);
                        }
                    });
                },
                dragStop: (event: Object) => {
                    if (this.isModal) {
                        this.IsDragStop = true;
                        if (!isNullOrUndefined(this.position)) {
                            this.dlgContainer.classList.remove('e-dlg-' + this.position.X + '-' + this.position.Y);
                        }
                        // Reset the dialog position after drag completion.
                        const targetType: HTMLElement = this.getTargetContainer(this.target);
                        if (targetType instanceof Element) {
                            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(targetType);
                            if (computedStyle.getPropertyValue('direction') === 'rtl') {
                                this.element.style.position = 'absolute';
                            } else {
                                this.element.style.position = 'relative';
                            }
                        } else {
                            this.element.style.position = 'relative';
                        }
                    }
                    this.trigger('dragStop', event);
                    this.isModelResize = false;
                    this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
                    this.updatePersistData();
                },
                drag: (event: Object) => {
                    this.trigger('drag', event);
                }
            });
            if (!isNullOrUndefined(this.targetEle)) {
                this.dragObj.dragArea = this.targetEle;
            }
        }
    }

    private setButton(): void {
        if (!this.isBlazorServerRender()) {
            this.buttonContent = [];
            this.btnObj = [];
            for (let i: number = 0; i < this.buttons.length; i++) {
                if (isNullOrUndefined(this.buttons[i as number].buttonModel)) {
                    continue;
                }
                const buttonType: string = !isNullOrUndefined(this.buttons[i as number].type) ?
                    this.buttons[i as number].type.toLowerCase() : 'button';
                const btn: HTMLElement =
                this.createElement('button', { className: this.cssClass, attrs: {type: buttonType, tabindex: '0' }});
                this.buttonContent.push(btn.outerHTML);
            }
            this.setFooterTemplate();
        }
        let footerBtn: NodeListOf<Element>;
        for (let i: number = 0, childNodes: HTMLCollection = this.element.children; i < childNodes.length; i++) {
            if (childNodes[i as number].classList.contains(DLG_FOOTER_CONTENT)) {
                footerBtn = <NodeListOf<Element>>(childNodes[i as number] as HTMLElement).querySelectorAll('button');
            }
        }

        for (let i: number = 0; i < this.buttons.length; i++) {
            if (isNullOrUndefined(this.buttons[i as number].buttonModel)) {
                continue;
            }
            if (!this.isBlazorServerRender()) {
                this.btnObj[i as number] = new Button(this.buttons[i as number].buttonModel);
            }
            if (!isNullOrUndefined(this.ftrTemplateContent) && footerBtn.length > 0) {
                if (typeof (this.buttons[i as number].click) === 'function') {
                    EventHandler.add(footerBtn[i as number], 'click', this.buttons[i as number].click, this);
                }
                if (typeof (this.buttons[i as number].click) === 'object') {
                    EventHandler.add(footerBtn[i as number], 'click', this.buttonClickHandler.bind(this, i), this);
                }
            }
            if (!this.isBlazorServerRender() && !isNullOrUndefined(this.ftrTemplateContent)) {
                this.btnObj[i as number].appendTo(this.ftrTemplateContent.children[i as number] as HTMLElement);
                if (this.buttons[i as number].isFlat){ this.btnObj[i as number].element.classList.add('e-flat'); }
                this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0] as HTMLElement;
            }
        }
    }

    private buttonClickHandler(index: number): void {
        this.trigger('buttons[' + index + '].click', {});
    }

    private setContent(): void {
        this.contentEle = this.createElement('div', { className: DLG_CONTENT, id: this.element.id + '_dialog-content' });
        if (this.headerEle){
            attributes(this.element, { 'aria-describedby': this.element.id + '_title' + ' ' + this.element.id + '_dialog-content' });
        }
        else {
            attributes(this.element, { 'aria-describedby': this.element.id + '_dialog-content' });
        }
        if (this.innerContentElement) {
            this.contentEle.appendChild(this.innerContentElement);
        } else if (!isNullOrUndefined(this.content) && this.content !== '' || !this.initialRender) {
            if (typeof (this.content) === 'string' && !isBlazor()) {
                this.setTemplate(this.content, this.contentEle, 'content');
            } else if (this.content instanceof HTMLElement) {
                this.contentEle.appendChild(this.content);
            } else {
                this.setTemplate(this.content, this.contentEle, 'content');
            }
        }
        if (!isNullOrUndefined(this.headerContent)) {
            this.element.insertBefore(this.contentEle, this.element.children[1]);
        } else {
            this.element.insertBefore(this.contentEle, this.element.children[0]);
        }
        if (this.height === 'auto') {
            if (!this.isBlazorServerRender() && Browser.isIE && this.element.style.width === '' && !isNullOrUndefined(this.width)) {
                this.element.style.width = formatUnit(this.width);
            }
            this.setMaxHeight();
        }
    }

    private setTemplate(template: string | HTMLElement | Function, toElement: HTMLElement, prop: string): void {
        let templateFn: Function;
        let templateProps: string;
        if (toElement.classList.contains(DLG_HEADER)) {
            templateProps = this.element.id + 'header';
        } else if (toElement.classList.contains(DLG_FOOTER_CONTENT)) {
            templateProps = this.element.id + 'footerTemplate';
        } else {
            templateProps = this.element.id + 'content';
        }
        let templateValue: string;
        if (!isNullOrUndefined((<HTMLElement>template).outerHTML)) {
            toElement.appendChild(template as HTMLElement);
        } else if ((typeof template === 'string') || (typeof template !== 'string') || (isBlazor() && !this.isStringTemplate)) {
            if ((typeof template === 'string')) {
                template = this.sanitizeHelper(template as string);
            }
            if (this.isVue || typeof template !== 'string') {
                templateFn = compile(template as string);
                templateValue = template as string;
            } else {
                toElement.innerHTML = template as string;
            }
        }
        const fromElements: HTMLElement[] = [];
        if (!isNullOrUndefined(templateFn)) {
            const isString: boolean = (isBlazor() &&
                !this.isStringTemplate && (templateValue).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            for (const item of templateFn({}, this, prop, templateProps, isString)) {
                fromElements.push(item);
            }
            append([].slice.call(fromElements), toElement);
        }
    }

    /*
     * @returns {void}
     * @hidden
     * @value
     */
    public sanitizeHelper(value: string): string {
        if (this.enableHtmlSanitizer) {
            const dialogItem: BeforeSanitizeHtmlArgs = SanitizeHtmlHelper.beforeSanitize();
            const beforeEvent: BeforeSanitizeHtmlArgs = {
                cancel: false,
                helper: null
            };
            extend(dialogItem, dialogItem, beforeEvent);
            this.trigger('beforeSanitizeHtml', dialogItem);
            if (dialogItem.cancel && !isNullOrUndefined(dialogItem.helper)) {
                value = dialogItem.helper(value);
            } else if (!dialogItem.cancel) {
                value = SanitizeHtmlHelper.serializeValue(dialogItem, value);
            }
        }
        return value;
    }

    private setMaxHeight(): void {
        if (!this.allowMaxHeight) {
            return;
        }
        const display: string = this.element.style.display;
        this.element.style.display = 'none';
        this.element.style.maxHeight = (!isNullOrUndefined(this.target)) && (this.targetEle.offsetHeight < window.innerHeight) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
        this.element.style.display = display;
        if (Browser.isIE && this.height === 'auto' && !isNullOrUndefined(this.contentEle)
            && this.element.offsetHeight < this.contentEle.offsetHeight) {
            this.element.style.height = 'inherit';
        }
    }

    private setEnableRTL(): void {
        if (!this.isBlazorServerRender()) {
            if (this.enableRtl) {
                addClass([this.element], RTL);
            } else {
                removeClass([this.element], RTL);
            }
        }
        if (!isNullOrUndefined(this.element.querySelector('.e-resize-handle'))) {
            removeResize();
            this.setResize();
        }
    }

    private setTargetContent(): void {
        if (isNullOrUndefined(this.content) || this.content === '') {
            const isContent: boolean = this.element.innerHTML.replace(/\s|<(\/?|\/?)(!--!--)>/g, '') !== '';
            if (this.element.children.length > 0 || isContent) {
                this.innerContentElement = document.createDocumentFragment();
                [].slice.call(this.element.childNodes).forEach((el: Element) => {
                    if (el.nodeType !== 8) {
                        this.innerContentElement.appendChild(el);
                    }
                });
            }
        }
    }

    private setHeader(): void {
        if (this.headerEle) {
            this.headerEle.innerHTML = '';
        } else {
            this.headerEle = this.createElement('div', { id: this.element.id + '_title', className: DLG_HEADER });
        }
        this.createHeaderContent();
        this.headerContent.appendChild(this.headerEle);
        this.setTemplate(this.header, this.headerEle, 'header');
        attributes(this.element, { 'aria-describedby': this.element.id + '_title' });
        attributes(this.element, { 'aria-labelledby': this.element.id + '_dialog-header' });
        this.element.insertBefore(this.headerContent, this.element.children[0]);
        if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
    }

    private setFooterTemplate(): void {
        if (this.ftrTemplateContent) {
            this.ftrTemplateContent.innerHTML = '';
        } else {
            this.ftrTemplateContent = this.createElement('div', {
                className: DLG_FOOTER_CONTENT
            });
        }
        if (this.footerTemplate !== '' && !isNullOrUndefined(this.footerTemplate)) {
            this.setTemplate(this.footerTemplate, this.ftrTemplateContent, 'footerTemplate');
        } else {
            this.ftrTemplateContent.innerHTML = this.buttonContent.join('');
        }
        this.element.appendChild(this.ftrTemplateContent);
    }

    private createHeaderContent(): void {
        if (isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.createElement('div', { id: this.element.id + '_dialog-header', className: DLG_HEADER_CONTENT });
        }
    }

    private renderCloseIcon(): void {
        if (this.showCloseIcon) {
            this.closeIcon = this.createElement('button', { className: DLG_CLOSE_ICON_BTN , attrs: {type: 'button'}});
            this.closeIconBtnObj = new Button({ cssClass: 'e-flat', iconCss: DLG_CLOSE_ICON + ' ' + ICON });
            this.closeIconTitle();
            if (!isNullOrUndefined(this.headerContent)) {
                prepend([this.closeIcon], this.headerContent);
            } else {
                this.createHeaderContent();
                prepend([this.closeIcon], this.headerContent);
                this.element.insertBefore(this.headerContent, this.element.children[0]);
            }
            this.closeIconBtnObj.appendTo(this.closeIcon);
        }
    }

    private closeIconTitle(): void {
        this.l10n.setLocale(this.locale);
        const closeIconTitle: string = this.l10n.getConstant('close');
        this.closeIcon.setAttribute('title', closeIconTitle);
        this.closeIcon.setAttribute('aria-label', closeIconTitle);
    }

    private setCSSClass(oldCSSClass?: string): void {
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
            if (this.isModal && !isNullOrUndefined(this.dlgContainer)) {
                removeClass([this.dlgContainer], oldCSSClass.split(' '));
            }
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
            if (this.isModal && !isNullOrUndefined(this.dlgContainer)) {
                addClass([this.dlgContainer], this.cssClass.split(' '));
            }
        }
    }

    private setIsModal(): void {
        this.dlgContainer = this.createElement('div', { className: DLG_CONTAINER });
        this.setCSSClass();
        this.element.classList.remove(DLG_SHOW);
        this.element.parentNode.insertBefore(this.dlgContainer, this.element);
        this.dlgContainer.appendChild(this.element);
        addClass([this.element], MODAL_DLG);
        this.dlgOverlay = this.createElement('div', { className: DLG_OVERLAY });
        this.dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
        this.dlgContainer.appendChild(this.dlgOverlay);
    }

    private getValidFocusNode(items: HTMLElement[]): HTMLElement {
        let node: HTMLElement;
        for (let u: number = 0; u < items.length; u++) {
            node = <HTMLElement>items[u as number];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !(node as HTMLInputElement).disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            } else {
                node = null;
            }
        }
        return node;
    }

    private focusableElements(content: HTMLElement): HTMLElement {
        if (!isNullOrUndefined(content)) {
            const value: string = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            const items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    }

    private getAutoFocusNode(container: HTMLElement): HTMLElement {
        let node: HTMLElement = <HTMLElement>container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        const value: string = '[autofocus]';
        const items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>container.querySelectorAll(value);
        let validNode: HTMLElement = this.getValidFocusNode(items);
        if (isBlazor()) {
            this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0] as HTMLElement;
        }
        if (!isNullOrUndefined(validNode)) {
            node = validNode;
        } else {
            validNode = this.focusableElements(this.contentEle);
            if (!isNullOrUndefined(validNode)) {
                return node = validNode;
            } else if (!isNullOrUndefined(this.primaryButtonEle)) {
                return (this.element.querySelector('.' + DLG_PRIMARY_BUTTON) as HTMLElement);
            }
        }
        return node;
    }

    private disableElement(element: HTMLElement, t: string): HTMLElement {
        const elementMatch: Function = element ? element.matches || element.webkitMatchesSelector || element.msGetRegionContent : null;
        if (elementMatch) {
            for (; element; element = <HTMLElement>element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    /* istanbul ignore next */
                    return element;
                }
            }
        }
        return null;
    }

    private focusContent(): void {
        const element: HTMLElement = this.getAutoFocusNode(this.element);
        const node: HTMLElement = !isNullOrUndefined(element) ? element : this.element;
        const userAgent: string = Browser.userAgent;
        if (userAgent.indexOf('MSIE ') > 0 || userAgent.indexOf('Trident/') > 0) {
            this.element.focus();
        }
        node.focus();
        this.unBindEvent(this.element);
        this.bindEvent(this.element);
    }

    private bindEvent(element: HTMLElement): void {
        EventHandler.add(element, 'keydown', this.keyDown, this);
    }

    private unBindEvent(element: HTMLElement): void {
        EventHandler.remove(element, 'keydown', this.keyDown);
    }

    private updateSanitizeContent(): void {
        if (!this.isBlazorServerRender()) {
            this.contentEle.innerHTML = this.sanitizeHelper(this.content as string);
        }
    }

    private isBlazorServerRender(): boolean {
        return isBlazor() && this.isServerRendered;
    }

    /**
     * Module required function
     *
     * @returns {void}
     * @private
     */
    protected getModuleName(): string {
        return 'dialog';
    }
    /**
     * Called internally if any of the property value changed
     *
     * @param {DialogModel} newProp - specifies the new property
     * @param {DialogModel} oldProp - specifies the old property
     * @private
     * @returns {void}
     */
    public onPropertyChanged(newProp: DialogModel, oldProp: DialogModel): void {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'content':
                if (!isNullOrUndefined(this.content) && this.content !== '') {
                    if (this.isBlazorServerRender()) {
                        this.contentEle = this.element.querySelector('.e-dlg-content');
                    }
                    if (!isNullOrUndefined(this.contentEle) && this.contentEle.getAttribute('role') !== 'dialog') {
                        if (!this.isBlazorServerRender()) {
                            this.contentEle.innerHTML = '';
                        }
                        if (typeof (this.content) === 'function') {
                            this.clearTemplate(['content']); detach(this.contentEle); this.contentEle = null; this.setContent();
                        } else {
                            if (typeof (this.content) === 'string') {
                                this.updateSanitizeContent();
                            } else {
                                this.contentEle.appendChild(this.content);
                            }
                        }
                        this.setMaxHeight();
                    } else {
                        this.setContent();
                    }
                } else if (!isNullOrUndefined(this.contentEle)) {
                    detach(this.contentEle); this.contentEle = null;
                }
                break;
            case 'header':
                if (this.header === '' || isNullOrUndefined(this.header)) {
                    if (this.headerEle) {
                        detach(this.headerEle);
                        this.headerEle = null;
                    }
                } else {
                    this.setHeader();
                } break;
            case 'footerTemplate':
                if (this.footerTemplate === '' || isNullOrUndefined(this.footerTemplate)) {
                    if (!this.ftrTemplateContent) {
                        return;
                    }
                    detach(this.ftrTemplateContent); this.ftrTemplateContent = null;
                    this.buttons = [{}];
                } else {
                    this.setFooterTemplate();
                    this.buttons = [{}];
                } break;
            case 'showCloseIcon':
                if (this.element.getElementsByClassName(DLG_CLOSE_ICON).length > 0) {
                    if (!this.showCloseIcon && (this.header === '' || isNullOrUndefined(this.header))) {
                        detach(this.headerContent); this.headerContent = null;
                    } else if (!this.showCloseIcon) {
                        detach(this.closeIcon);
                    }
                } else {
                    this.renderCloseIcon();
                    this.wireEvents();
                } break;
            case 'locale':
                if (this.showCloseIcon) {
                    this.closeIconTitle();
                } break;
            case 'visible':
                if (this.visible)
                {
                    this.show();
                } else {
                    this.hide();
                } break;
            case 'isModal':
                this.updateIsModal(); break;
            case 'height':
                setStyleAttribute(this.element, {'height': formatUnit(newProp.height) });
                this.updatePersistData(); break;
            case 'width':
                setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) });
                this.updatePersistData(); break;
            case 'zIndex':
                this.popupObj.zIndex = this.zIndex;
                if (this.isModal) {
                    this.setOverlayZindex(this.zIndex);
                }
                if (this.element.style.zIndex !== this.zIndex.toString()) {
                    this.calculatezIndex = false;
                } break;
            case 'cssClass':
                this.setCSSClass(oldProp.cssClass); break;
            case 'buttons': {
                this.unWireButtonEvents();
                this.destroyButtons();
                if (!isNullOrUndefined(this.ftrTemplateContent)) {
                    detach(this.ftrTemplateContent);
                    this.ftrTemplateContent = null;
                }
                this.footerTemplate = '';
                this.setButton();
                break;
            }
            case 'allowDragging':
                if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                    this.setAllowDragging();
                } else {
                    this.dragObj.destroy();
                } break;
            case 'target':
                this.setTarget(newProp.target); break;
            case 'position':
                this.checkPositionData();
                if (this.isModal) {
                    let positionX: string | number = this.position.X;
                    let positionY: string | number = this.position.Y;
                    if (!isNullOrUndefined(oldProp.position)) {
                        if (!isNullOrUndefined(oldProp.position.X)) {
                            positionX = oldProp.position.X;
                        }
                        if (!isNullOrUndefined(oldProp.position.Y)) {
                            positionY = oldProp.position.Y;
                        }
                    }
                    if (this.dlgContainer.classList.contains('e-dlg-' + positionX + '-' + positionY)) {
                        this.dlgContainer.classList.remove('e-dlg-' + positionX + '-' + positionY);
                    }
                }
                this.positionChange();
                this.updatePersistData();
                break;
            case 'enableRtl':
                this.setEnableRTL(); break;
            case 'enableResize':
                this.setResize();
                this.isModelResize = this.enableResize && this.isModal;
                if (this.enableResize && this.dialogOpen) {
                    this.resetResizeIcon();
                }
                break;
            case 'minHeight':
                if (this.minHeight !== '') {
                    this.element.style.minHeight = formatUnit(this.minHeight);
                } break;
            }
        }
    }

    private setTarget(target: string | HTMLElement): void {
        this.popupObj.relateTo = target;
        this.target = target;
        this.targetEle = ((typeof this.target) === 'string') ?
            <HTMLElement>document.querySelector(<string>this.target) : <HTMLElement>this.target;
        if (this.dragObj) {
            this.dragObj.dragArea = this.targetEle;
        }
        this.setMaxHeight();
        if (this.isModal) {
            this.updateIsModal();
        }
        if (this.enableResize) {
            this.setResize();
        }
        if (!isNullOrUndefined(this.targetEle)) {
            if (this.isModal && !isNullOrUndefined(this.dlgContainer)) {
                this.targetEle.appendChild(this.dlgContainer);
            } else if (!isNullOrUndefined(this.element)) {
                this.targetEle.appendChild(this.element);
            }
        }
    }

    private updateIsModal(): void {
        this.element.setAttribute('aria-modal', this.isModal ? 'true' : 'false');
        if (this.isModal) {
            if (isNullOrUndefined(this.dlgOverlay)) {
                this.setIsModal();
                this.element.style.top = '0px';
                this.element.style.left = '0px';
                if (!isNullOrUndefined(this.targetEle)) {
                    this.targetEle.appendChild(this.dlgContainer);
                }
            }
        } else {
            removeClass([this.element], MODAL_DLG);
            removeClass([document.body], [DLG_TARGET , SCROLL_DISABLED ]);
            detach(this.dlgOverlay);
            while (this.dlgContainer.firstChild) {
                this.dlgContainer.parentElement.insertBefore(this.dlgContainer.firstChild, this.dlgContainer);
            }
            this.dlgContainer.parentElement.removeChild(this.dlgContainer);
        }
        if (this.visible) {
            this.show();
        }
        this.positionChange();
        if (this.isModal && this.dlgOverlay) {
            EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    }

    private setzIndex(zIndexElement: HTMLElement, setPopupZindex: boolean): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        const currentzIndex : number = getZindexPartial(zIndexElement);
        this.zIndex = currentzIndex > this.zIndex ? currentzIndex : this.zIndex;
        this.isProtectedOnChange = prevOnChange;
        if (setPopupZindex) {
            this.popupObj.zIndex = this.zIndex;
        }
    }

    private windowResizeHandler(): void {
        setMaxWidth(this.targetEle.clientWidth);
        setMaxHeight(this.targetEle.clientHeight);
        this.setMaxHeight();
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {void}
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist(['width', 'height', 'position']);
    }

    private removeAllChildren(element: HTMLElement): void {
        while (element.children[0] as HTMLElement) {
            this.removeAllChildren(element.children[0] as HTMLElement);
            element.removeChild(element.children[0] as HTMLElement);
        }
    }

    /**
     * To destroy the widget
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        const classArray: string[] = [RTL, MODAL_DLG, DLG_RESIZABLE, DLG_RESTRICT_LEFT_VALUE, FULLSCREEN, DEVICE];
        const attrs: string[] = ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-grabbed', 'tabindex', 'style'];
        removeClass([this.targetEle], [DLG_TARGET , SCROLL_DISABLED]);
        if (!isNullOrUndefined(this.element) && this.element.classList.contains(FULLSCREEN)) {
            removeClass([document.body], [DLG_TARGET , SCROLL_DISABLED]);
        }
        if (this.isModal) {
            removeClass([(!isNullOrUndefined(this.targetEle) ? this.targetEle : document.body)], SCROLL_DISABLED);
        }
        this.unWireEvents();
        this.unWireButtonEvents();
        this.destroyButtons();
        if (!isNullOrUndefined(this.closeIconBtnObj)) {
            this.closeIconBtnObj.destroy();
        }
        if (!isNullOrUndefined(this.dragObj)) {
            this.dragObj.destroy();
        }
        if (!isNullOrUndefined(this.popupObj.element) && this.popupObj.element.classList.contains(POPUP_ROOT)) {
            this.popupObj.destroy();
        }
        removeClass([this.element], classArray);
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            removeClass([this.element], this.cssClass.split(' '));
        }
        if (!isNullOrUndefined(this.refElement) && !isNullOrUndefined(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore((this.isModal ? this.dlgContainer : this.element), this.refElement);
            detach(this.refElement);
            this.refElement = undefined;
        }
        if (this.isModal) {
            detach(this.dlgOverlay);
            this.dlgContainer.parentNode.insertBefore(this.element, this.dlgContainer);
            detach(this.dlgContainer);
        }
        this.element.innerHTML = this.clonedEle.innerHTML;
        for (let i: number = 0; i < attrs.length; i++) {
            this.element.removeAttribute(attrs[i as number]);
        }
        this.ftrTemplateContent = null;
        this.headerContent = null;
        if (!(this as any).isReact && !this.isVue && !isNullOrUndefined(this.contentEle)) {
            this.removeAllChildren(this.contentEle);
        }
        this.contentEle = null;
        resizeDestroy();
        super.destroy();
        // eslint-disable-next-line
        if ((this as any).isReact) {
            this.clearTemplate();
        }
    }
    private wireWindowResizeEvent(): void {
        this.boundWindowResizeHandler = this.windowResizeHandler.bind(this);
        window.addEventListener('resize', this.boundWindowResizeHandler);
    }
    private unWireWindowResizeEvent(): void {
        window.removeEventListener('resize', this.boundWindowResizeHandler);
        this.boundWindowResizeHandler = null;
    }
    /**
     * Binding event to the element while widget creation
     *
     * @returns {void}
     * @hidden
     */
    private wireEvents(): void {
        if (this.showCloseIcon) {
            EventHandler.add(
                this.closeIcon, 'click', this.closeIconClickEventHandler, this);
        }
        if (this.isModal && this.dlgOverlay) {
            EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    }
    /**
     * Unbinding event to the element while widget destroy
     *
     * @returns {void}
     * @hidden
     */
    private unWireEvents(): void {
        if (this.showCloseIcon) {
            EventHandler.remove(this.closeIcon, 'click', this.closeIconClickEventHandler);
        }
        if (this.isModal) {
            EventHandler.remove(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler);
        }
    }
    /**
     * Refreshes the dialog's position when the user changes its header and footer height/width dynamically.
     *
     * @returns {void}
     */
    public refreshPosition(): void {
        this.popupObj.refreshPosition();
        if (this.element.classList.contains(MODAL_DLG)) {
            this.positionChange();
        }
    }
    /**
     * Returns the current width and height of the Dialog
     *
     * @returns {DialogDimension}- returns the dialog element Dimension.
     * @public
     */
    public getDimension(): DialogDimension {
        const dialogWidth : number = this.element.offsetWidth;
        const dialogHeight : number = this.element.offsetHeight;
        return {width: dialogWidth, height: dialogHeight};
    }
    /**
     * Opens the dialog if it is in hidden state.
     * To open the dialog with full screen width, set the parameter to true.
     *
     * @param { boolean } isFullScreen - Enable the fullScreen Dialog.
     * @returns {void}
     */
    public show(isFullScreen?: boolean): void {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (!this.element.classList.contains(DLG_SHOW) || (!isNullOrUndefined(isFullScreen))) {
            if (!isNullOrUndefined(isFullScreen)) {
                this.fullScreen(isFullScreen);
            }
            const eventArgs: BeforeOpenEventArgs = isBlazor() ? {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                maxHeight: this.element.style.maxHeight } : {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                target: this.target,
                maxHeight: this.element.style.maxHeight
            };
            this.trigger('beforeOpen', eventArgs, (beforeOpenArgs: BeforeOpenEventArgs) => {
                if (!beforeOpenArgs.cancel) {
                    if (this.element.style.maxHeight !== eventArgs.maxHeight) {
                        this.allowMaxHeight = false;
                        this.element.style.maxHeight = eventArgs.maxHeight;
                    }
                    if (this.enableResize && this.boundWindowResizeHandler == null && !this.initialRender) {
                        this.wireWindowResizeEvent();
                    }
                    this.storeActiveElement = <HTMLElement>document.activeElement;
                    this.element.tabIndex = -1;
                    if (this.isModal && (!isNullOrUndefined(this.dlgOverlay))) {
                        this.dlgOverlay.style.display = 'block';
                        this.dlgContainer.style.display = 'flex';
                        removeClass([this.dlgOverlay], 'e-fade');
                        if (!isNullOrUndefined(this.targetEle)) {
                            if (this.targetEle === document.body) {
                                this.dlgContainer.style.position = 'fixed';
                            } else {
                                this.dlgContainer.style.position = 'absolute';
                            }
                            this.dlgOverlay.style.position = 'absolute';
                            const targetType: HTMLElement = this.getTargetContainer(this.target);
                            if (targetType instanceof Element) {
                                const computedStyle: CSSStyleDeclaration = window.getComputedStyle(targetType);
                                if (computedStyle.getPropertyValue('direction') === 'rtl') {
                                    this.element.style.position = 'absolute';
                                } else {
                                    this.element.style.position = 'relative';
                                }
                            } else {
                                this.element.style.position = 'relative';
                            }
                            addClass([this.targetEle], [DLG_TARGET , SCROLL_DISABLED ]);
                        } else {
                            addClass([document.body], [DLG_TARGET , SCROLL_DISABLED ]);
                        }
                    }
                    const openAnimation: Object = {
                        name: (this.animationSettings.effect === 'None' && animationMode === 'Enable') ? 'Zoom' + 'In' : this.animationSettings.effect + 'In',
                        duration: this.animationSettings.duration,
                        delay: this.animationSettings.delay
                    };
                    const zIndexElement: HTMLElement = (this.isModal) ? this.element.parentElement : this.element;
                    if (this.calculatezIndex) {
                        this.setzIndex(zIndexElement, true);
                        setStyleAttribute(this.element, { 'zIndex': this.zIndex });
                        if (this.isModal) {
                            this.setOverlayZindex(this.zIndex);
                        }
                    }
                    // eslint-disable-next-line
                    (this.animationSettings.effect === 'None' && animationMode === 'Enable') ? this.popupObj.show(openAnimation) : ((this.animationSettings.effect === 'None') ? this.popupObj.show() : this.popupObj.show(openAnimation));
                    if (this.isModal) {
                        const targetType: any = this.getTargetContainer(this.target);
                        if (targetType instanceof Element){
                            const computedStyle: any = window.getComputedStyle(targetType);
                            if (computedStyle.getPropertyValue('direction') === 'rtl'  && !this.IsDragStop) {
                                this.setPopupPosition();
                            }
                        }
                    }
                    this.dialogOpen = true;
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.visible = true;
                    this.preventVisibility = true;
                    this.isProtectedOnChange = prevOnChange;
                }
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }

    /**
     * Closes the dialog if it is in visible state.
     *
     * @param { Event } event - specifies the event
     * @returns {void}
     */
    public hide(event?: Event): void {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (this.preventVisibility) {
            const eventArgs: BeforeCloseEventArgs = isBlazor() ? {
                cancel: false,
                isInteracted: event ? true : false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event } : {
                cancel: false,
                isInteracted: event ? true : false,
                element: this.element,
                target: this.target,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event,
                closedBy: this.dlgClosedBy
            };
            this.closeArgs = eventArgs;
            this.trigger('beforeClose', eventArgs, (beforeCloseArgs: BeforeCloseEventArgs) => {
                if (!beforeCloseArgs.cancel) {
                    if (this.enableResize) {
                        this.unWireWindowResizeEvent();
                    }
                    const closeAnimation: Object = {
                        name: (this.animationSettings.effect === 'None' && animationMode === 'Enable') ? 'Zoom' + 'Out' : this.animationSettings.effect + 'Out',
                        duration: this.animationSettings.duration,
                        delay: this.animationSettings.delay
                    };
                    if (this.animationSettings.effect === 'None' && animationMode === 'Enable') {
                        this.popupObj.hide(closeAnimation);
                    } else if (this.animationSettings.effect === 'None') {
                        this.popupObj.hide();
                    } else {
                        this.popupObj.hide(closeAnimation);
                    }
                    setTimeout(() => {
                        if (this.isModal) {
                            if (!isNullOrUndefined(this.targetEle) && this.targetEle.classList.contains(DLG_TARGET) &&
                                this.targetEle.classList.contains(SCROLL_DISABLED)) {
                                removeClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
                            }
                        }
                        if (document.body.classList.contains(DLG_TARGET) &&
                            document.body.classList.contains(SCROLL_DISABLED)) {
                            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
                        }
                    }, (this.animationSettings.duration + this.animationSettings.delay));
                    this.dialogOpen = false;
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.visible = false;
                    this.preventVisibility = false;
                    this.isProtectedOnChange = prevOnChange;
                }
                this.dlgClosedBy = DLG_USER_ACTION_CLOSED;
            });
        }
    }
    /**
     * Specifies to view the Full screen Dialog.
     *
     * @param {boolean} args - specifies the arguments
     * @returns {boolean} - returns the boolean value
     * @private
     */
    private fullScreen(args: boolean): boolean {
        /* eslint-disable */
        const top: number = this.element.offsetTop;
        const left: number = this.element.offsetLeft;
        /* eslint-enable */
        if (args) {
            if (!this.isModal) {
                this.element.style.top = document.scrollingElement.scrollTop + 'px';
            }
            addClass([this.element], FULLSCREEN);
            const display: string = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!isNullOrUndefined(this.target)) ?
                (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            addClass([document.body], [DLG_TARGET , SCROLL_DISABLED ]);
            if (this.allowDragging && !isNullOrUndefined(this.dragObj)) {
                this.dragObj.destroy();
            }
        } else {
            removeClass([this.element], FULLSCREEN);
            removeClass([document.body], [DLG_TARGET , SCROLL_DISABLED ]);
            if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                this.setAllowDragging();
            }
        }
        return args;
    }

    /**
     * Returns the dialog button instances.
     * Based on that, you can dynamically change the button states.
     *
     * @param { number } index - Index of the button.
     * @returns {Button} - returns the button element
     */
    public getButtons(index?: number): Button[] | Button {
        if (!isNullOrUndefined(index)) {
            return this.btnObj[index as number];
        }
        return this.btnObj;
    }

    private unWireButtonEvents(): void {
        if (this.buttons.length > 0 && this.footerTemplate === '' && this.ftrTemplateContent) {
            for (let i: number = 0; i < this.buttons.length; i++) {
                if (this.buttons[i as number].click && typeof (this.buttons[i as number].click) === 'function'
                && this.ftrTemplateContent.children[i as number]) {
                    EventHandler.remove(this.ftrTemplateContent.children[i as number], 'click', this.buttons[i as number].click);
                }
            }
        }
    }

    private destroyButtons(): void {
        if (!isNullOrUndefined(this.btnObj)) {
            for (let i: number = 0; i < this.btnObj.length; i++) {
                if (this.btnObj[i as number] && !this.btnObj[i as number].isDestroyed) {
                    this.btnObj[i as number].destroy();
                }
            }
        }
    }
}

/**
 * Base for creating Alert and Confirmation Dialog through util method.
 */
// eslint-disable-next-line
export namespace DialogUtility {

    /**
     * An alert dialog box is used to display warning like messages to the users.
     * ```
     * Eg : DialogUtility.alert('Alert message');
     *
     * ```
     */
    /* istanbul ignore next */
    /**
     *
     * @param {AlertDialogArgs} args - specifies the string
     * @returns {Dialog} - returns the dialog element.
     */
    export function alert(args?: AlertDialogArgs | string): Dialog {
        const dialogElement: HTMLElement = createElement('div', { 'className': DLG_UTIL_ALERT });
        document.body.appendChild(dialogElement);
        let alertDialogObj: Dialog;
        const okButtonModel: ButtonPropsModel[] = [{
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function () : void {
                this.hide();
            }
        }];
        if (typeof (args) === 'string') {
            alertDialogObj = createDialog({ content: args,
                position: { X: 'center', Y: 'top' },
                isModal: true, header: DLG_UTIL_DEFAULT_TITLE,
                buttons: okButtonModel }, dialogElement);
        } else {
            alertDialogObj = createDialog(alertOptions(args), dialogElement);
        }
        alertDialogObj.close = () => {
            if (args && (args as AlertDialogArgs).close) {
                (args as AlertDialogArgs).close.apply(alertDialogObj);
            }
            alertDialogObj.destroy();
            if (alertDialogObj.element.classList.contains('e-dlg-modal')) {
                alertDialogObj.element.parentElement.remove();
                (alertDialogObj.target as HTMLElement).classList.remove(DLG_UTIL_ROOT);
            } else {
                alertDialogObj.element.remove();
            }
        };
        return alertDialogObj;
    }

    /**
     * A confirm dialog displays a specified message along with ‘OK’ and ‘Cancel’ button.
     * ```
     * Eg : DialogUtility.confirm('Confirm dialog message');
     *
     * ```
     */
    /* istanbul ignore next */
    /**
     *
     * @param {ConfirmDialogArgs} args - specifies the args
     * @returns {Dialog} - returns te element
     */
    export function confirm(args?: ConfirmDialogArgs | string): Dialog {
        const dialogElement: HTMLElement = createElement('div', { 'className': DLG_UTIL_CONFIRM });
        document.body.appendChild(dialogElement);
        let confirmDialogObj: Dialog;
        const okCancelButtonModel: ButtonPropsModel[] = [{
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function (): void {
                this.hide();
            }
        }, {
            buttonModel: { content: 'Cancel' },
            click: function (): void {
                this.hide();
            }
        }];
        if (typeof (args) === 'string') {
            confirmDialogObj = createDialog(
                { position: { X: 'center', Y: 'top' }, content: args, isModal: true,
                    header: DLG_UTIL_DEFAULT_TITLE, buttons: okCancelButtonModel
                },
                dialogElement);
        } else {
            confirmDialogObj = createDialog(confirmOptions(args), dialogElement);
        }
        confirmDialogObj.close = () => {
            if (args && (args as ConfirmDialogArgs).close) {
                (args as ConfirmDialogArgs).close.apply(confirmDialogObj);
            }
            confirmDialogObj.destroy();
            if (confirmDialogObj.element.classList.contains('e-dlg-modal')) {
                confirmDialogObj.element.parentElement.remove();
                (confirmDialogObj.target as HTMLElement).classList.remove(DLG_UTIL_ROOT);
            } else {
                confirmDialogObj.element.remove();
            }
        };
        return confirmDialogObj;
    }

    // eslint-disable-next-line
    function createDialog(options?: DialogModel, element?: string | HTMLElement): Dialog {
        const dialogObject: Dialog = new Dialog(options);
        dialogObject.appendTo(element);
        return dialogObject;
    }

    // eslint-disable-next-line
    function alertOptions(option?: AlertDialogArgs): DialogModel {
        let options: DialogModel = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setAlertButtonModel(options, option);
        return options;
    }

    // eslint-disable-next-line
    function confirmOptions(option?: ConfirmDialogArgs): DialogModel {
        let options: DialogModel = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setConfirmButtonModel(options, option);
        return options;
    }

    // eslint-disable-next-line
    function formOptions(options: DialogModel, option: AlertDialogArgs): DialogModel {
        options.header = !isNullOrUndefined(option.title) ? option.title : null;
        options.content = !isNullOrUndefined(option.content) ? option.content : '';
        options.isModal = !isNullOrUndefined(option.isModal) ? option.isModal : true;
        options.showCloseIcon = !isNullOrUndefined(option.showCloseIcon) ? option.showCloseIcon : false;
        options.allowDragging = !isNullOrUndefined(option.isDraggable) ? option.isDraggable : false;
        options.closeOnEscape = !isNullOrUndefined(option.closeOnEscape) ? option.closeOnEscape : false;
        options.position = !isNullOrUndefined(option.position) ? option.position : { X: 'center', Y: 'top' };
        options.animationSettings = !isNullOrUndefined(option.animationSettings) ? option.animationSettings :
            { effect: 'Fade', duration: 400, delay: 0 };
        options.cssClass = !isNullOrUndefined(option.cssClass) ? option.cssClass : '';
        options.zIndex = !isNullOrUndefined(option.zIndex) ? option.zIndex : 1000;
        options.open = !isNullOrUndefined(option.open) ? option.open : null;
        options.width = !isNullOrUndefined(option.width) ? option.width : 'auto';
        options.height = !isNullOrUndefined(option.height) ? option.height : 'auto';
        return options;
    }

    // eslint-disable-next-line
    function setAlertButtonModel(options: DialogModel, option?: AlertDialogArgs): DialogModel {
        const alertButtonModel: ButtonPropsModel[]  = [{
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function (): void {
                this.hide();
            }
        }];
        if (!isNullOrUndefined(option.okButton)) {
            options.buttons[0] = formButtonModel(options.buttons[0], option.okButton, alertButtonModel[0]);
        } else {
            options.buttons = alertButtonModel;
        }
        return options;
    }

    // eslint-disable-next-line
    function setConfirmButtonModel(options: DialogModel, option?: ConfirmDialogArgs): DialogModel {
        const okButtonModel: ButtonPropsModel = {
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function (): void {
                this.hide();
            }
        };
        const cancelButtonModel: ButtonPropsModel = {
            buttonModel: { content: 'Cancel' },
            click: function (): void {
                this.hide();
            }
        };
        if (!isNullOrUndefined(option.okButton)) {
            options.buttons[0] = formButtonModel(options.buttons[0], option.okButton, okButtonModel);
        } else {

            options.buttons[0] = okButtonModel;
        }

        if (!isNullOrUndefined(option.cancelButton)) {
            options.buttons[1] = formButtonModel(options.buttons[1], option.cancelButton, cancelButtonModel);
        } else {
            options.buttons[1] = cancelButtonModel;
        }
        return options;
    }

    // eslint-disable-next-line
    function formButtonModel(buttonModel: ButtonPropsModel, option: ButtonArgs, buttonPropModel: ButtonPropsModel): ButtonPropsModel {
        const buttonProps: ButtonPropsModel = buttonPropModel;
        if (!isNullOrUndefined(option.text)) {
            buttonProps.buttonModel.content = option.text;
        }
        if (!isNullOrUndefined(option.icon)) {
            buttonProps.buttonModel.iconCss = option.icon;
        }
        if (!isNullOrUndefined(option.cssClass)) {
            buttonProps.buttonModel.cssClass = option.cssClass;
        }
        if (!isNullOrUndefined(option.click)) {
            buttonProps.click = option.click;
        }
        if (!isNullOrUndefined(option.isFlat)) {
            buttonProps.isFlat = option.isFlat;
        }
        return buttonProps;
    }
}

/**
 * Provides information about a Button event.
 */
export interface ButtonArgs {
    icon?: string
    cssClass?: string
    click?: EmitType<Object>
    text?: string
    isFlat?: boolean
}

/**
 * Provides information about a AlertDialog.
 */
export interface AlertDialogArgs {
    title?: string
    content?: string | HTMLElement
    isModal?: boolean
    isDraggable?: boolean
    showCloseIcon?: boolean
    closeOnEscape?: boolean
    position?: PositionDataModel
    okButton?: ButtonArgs
    animationSettings ?: AnimationSettingsModel
    cssClass?: string
    zIndex?: number
    open?: EmitType<Object>
    close?: EmitType<Object>
    width?: string | number
    height?: string | number
}

/**
 * Provides information about a ConfirmDialog.
 */
export interface ConfirmDialogArgs {
    title?: string
    content?: string | HTMLElement
    isModal?: boolean
    isDraggable?: boolean
    showCloseIcon?: boolean
    closeOnEscape?: boolean
    position?: PositionDataModel
    okButton?: ButtonArgs
    cancelButton?: ButtonArgs
    animationSettings ?: AnimationSettingsModel
    cssClass?: string
    zIndex?: number
    open?: EmitType<Object>
    close?: EmitType<Object>
    width?: string | number
    height?: string | number
}
interface ResizeMouseEventArgs extends MouseEvent  {
    cancel?: boolean
}

interface ResizeTouchEventArgs extends TouchEvent  {
    cancel?: boolean
}

interface DialogDimension {
    width: number;
    height: number;
}
