import { Component, Property, Event, Collection, L10n, Browser, EmitType, Complex, compile, createElement  } from '@syncfusion/ej2-base';
import { addClass, removeClass, detach, attributes, prepend, setStyleAttribute } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, append } from '@syncfusion/ej2-base';
import { ButtonPropsModel, DialogModel, AnimationSettingsModel } from './dialog-model';
import { EventHandler } from '@syncfusion/ej2-base';
import { Draggable } from '@syncfusion/ej2-base';
import { Popup, PositionData, getZindexPartial } from '../popup/popup';
import { PositionDataModel } from '../popup/popup-model';
import { Button, ButtonModel } from '@syncfusion/ej2-buttons';

export type ButtonType = 'Button' | 'Submit' | 'Reset';

export class ButtonProps extends ChildProperty<ButtonProps> {
    /**
     * Specifies the button component properties to render the dialog buttons.
     */
    @Property()
    public buttonModel: ButtonModel;

    /**
     * Specify the type of the button.
     * Possible values are Button, Submit and Reset.
     * @event
     */
    @Property('Button')
    public type: ButtonType | string;

    /**
     * Event triggers when `click` the dialog button.
     * @event
     */
    @Property()
    public click: EmitType<Object>;
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
     */
    @Property('Fade')
    public effect: DialogEffect;

    /**
     * Specifies the duration in milliseconds that the animation takes to open or close the dialog.
     */
    @Property(400)
    public duration: number;

    /**
     * Specifies the delay in milliseconds to start animation. 
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

const ROOT: string = 'e-dialog';
const RTL: string = 'e-rtl';
const DLG_HEADER_CONTENT: string = 'e-dlg-header-content';
const DLG_HEADER: string = 'e-dlg-header';
const DLG_FOOTER_CONTENT: string = 'e-footer-content';
const MODAL_DLG: string = 'e-dlg-modal';
const DLG_CONTENT: string = 'e-dlg-content';
const DLG_CLOSE_ICON: string = 'e-icon-dlg-close';
const DLG_OVERLAY: string = 'e-dlg-overlay';
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

export interface BeforeOpenEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement;
    /**
     * Returns the element of the dialog.
     */
    element: Element;
    /**
     * Returns the target element of the dialog.
     */
    target: HTMLElement | String;
}

export interface BeforeCloseEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteraction: boolean;
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement;
    /**
     * Returns the element of the dialog.
     */
    element: Element;
    /**
     * Returns the target element of the dialog.
     */
    target: HTMLElement | String;
    /**
     * Returns the original event arguments.
     */
    event: Event;
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
    /**
     * Specifies the value that can be displayed in dialog's content area.
     * It can be information, list, or other HTML elements.
     * The content of dialog can be loaded with dynamic data such as database, AJAX content, and more.
     * 
     * {% codeBlock src="dialog/content-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dialog/content-api/index.html" %}{% endcodeBlock %}
     * @default ''
     */
    @Property('')
    public content: string | HTMLElement;
    /**
     * Specifies the value that represents whether the close icon is shown in the dialog component.
     * @default false
     */
    @Property(false)
    public showCloseIcon: boolean;
    /**
     * Specifies the Boolean value whether the dialog can be displayed as modal or non-modal.
     * * `Modal`: It creates overlay that disable interaction with the parent application and user should 
     *    respond with modal before continuing with other applications.
     * * `Modeless`: It does not prevent user interaction with parent application.
     * @default false
     */
    @Property(false)
    public isModal: boolean;
    /**
     * Specifies the value that can be displayed in the dialog's title area that can be configured with plain text or HTML elements.
     * This is optional property and the dialog can be displayed without header, if the header property is null.
     * @default ''
     */
    @Property('')
    public header: string;
    /**
     * Specifies the value that represents whether the dialog component is visible.
     * @default true 
     */
    @Property(true)
    public visible: boolean;
    /**
     * Specifies the height of the dialog component.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Specifies the width of the dialog. 
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the CSS class name that can be appended with root element of the dialog.
     * One or more custom CSS classes can be added to a dialog.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     */
    @Property(1000)
    public zIndex: number;
    /**
     * Specifies the target element in which to display the dialog.
     * The default value is null, which refers the `document.body` element.
     * @default null
     */
    @Property(null)
    public target: HTMLElement | string;
    /**
     * Specifies the template value that can be displayed with dialog's footer area.
     * This is optional property and can be used only when the footer is occupied with information or custom components.
     * By default, the footer is configured with action [buttons](#buttons).
     * If footer template is configured to dialog, the action buttons property will be disabled.
     * 
     * > More information on the footer template configuration can be found on this [documentation](./template.html#footer) section.
     * 
     * @default ''
     */
    @Property('')
    public footerTemplate: string;
    /**
     * Specifies the value whether the dialog component can be dragged by the end-user.
     * The dialog allows to drag by selecting the header and dragging it for re-position the dialog.
     * 
     * > More information on the draggable behavior can be found on this [documentation](./getting-started.html#draggable) section.
     * 
     * @default false
     */
    @Property(false)
    public allowDragging: boolean;
    /**
     * Configures the action `buttons` that contains button properties with primary attributes and click events.
     * One or more action buttons can be configured to the dialog.
     * 
     * > More information on the button configuration can be found on this [documentation](./getting-started.html#enable-footer) section.
     * 
     * {% codeBlock src="dialog/buttons-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dialog/buttons-api/index.html" %}{% endcodeBlock %}
     * @default [{}]   
     */
    @Collection<ButtonPropsModel>([{}], ButtonProps)
    public buttons: ButtonPropsModel[];
    /**
     * Specifies the boolean value whether the dialog can be closed with the escape key 
     * that is used to control the dialog's closing behavior.
     * @default true
     */
    @Property(true)
    public closeOnEscape: boolean;
    /**
     * Specifies the animation settings of the dialog component.
     * The animation effect can be applied on open and close the dialog with duration and delay.
     * 
     * > More information on the animation settings in dialog can be found on this [documentation](./animation.html)  section.
     * 
     * {% codeBlock src="dialog/animation-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dialog/animation-api/index.html" %}{% endcodeBlock %}
     * @default { effect: 'Fade', duration: 400, delay:0 }
     */
    @Complex<AnimationSettingsModel>({}, AnimationSettings)
    public animationSettings: AnimationSettingsModel;
    /**
     * Specifies the value where the dialog can be positioned within the document or target.
     * The position can be represented with pre-configured positions or specific X and Y values.
     * * `X value`: left, center, right, or offset value.
     * * `Y value`: top, center, bottom, or offset value.
     * @default {X:'center', Y:'center'}
     */
    @Complex<PositionDataModel>({ X: 'center', Y: 'center' }, PositionData)
    public position: PositionDataModel;
    /**
     * Event triggers when the dialog is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Event triggers when a dialog is opened.
     * @event
     */
    @Event()
    public open: EmitType<Object>;
    /**
     * Event triggers when the dialog is being opened.
     * If you cancel this event, the dialog remains closed.
     * Set the cancel argument to true to cancel the open of a dialog. 
     * @event
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenEventArgs>;
    /**
     * Event triggers after the dialog has been closed.
     * @event
     */
    @Event()
    public close: EmitType<Object>;
    /**
     * Event triggers before the dialog is closed.
     * If you cancel this event, the dialog remains opened.
     * Set the cancel argument to true to cancel the closure of a dialog. 
     * @event
     */
    @Event()
    public beforeClose: EmitType<BeforeCloseEventArgs>;
    /**
     * Event triggers when the user begins dragging the dialog.
     * @event
     */
    @Event()
    public dragStart: EmitType<Object>;
    /**
     * Event triggers when the user stop dragging the dialog.
     * @event
     */
    @Event()
    public dragStop: EmitType<Object>;
    /**
     * Event triggers when the user drags the dialog.
     * @event
     */
    @Event()
    public drag: EmitType<Object>;
    /**
     * Event triggers when the overlay of dialog is clicked.
     * @event
     */
    @Event()
    public overlayClick: EmitType<Object>;
    /**
     * Constructor for creating the widget    
     * @hidden
     */
    constructor(options?: DialogModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }
    /**    
     * Initialize the control rendering
     * @private
     */
    public render(): void {
        this.initialize();
        this.initRender();
        this.wireEvents();
        if (this.width === '100%') {
            this.element.style.width = '';
        }
    }
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.headerContent = null;
        let classArray: string[] = [];
        for (let j: number = 0; j < this.element.classList.length; j++) {
            if (!isNullOrUndefined(this.element.classList[j].match('e-control')) ||
                !isNullOrUndefined(this.element.classList[j].match(ROOT))) {
                classArray.push( this.element.classList[j]);
            }
        }
        removeClass([this.element], classArray);
        this.clonedEle = <HTMLElement>this.element.cloneNode(true);
        this.closeIconClickEventHandler = (event: Event): void => {
            this.hide(event);
        };
        this.dlgOverlayClickEventHandler = (event: Object): void => {
            this.trigger('overlayClick', event);
        };
        let localeText: object = { close: 'Close' };
        this.l10n = new L10n('dialog', localeText, this.locale);
        if (isNullOrUndefined(this.target)) {
            let prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.target = document.body;
            this.isProtectedOnChange = prevOnChange;
        }
    };

    /* istanbul ignore next */
    private keyDown(event: KeyboardEvent): void {
        if (event.keyCode === 9) {
            if (this.isModal) {
                let buttonObj: Button;
                if (!isNullOrUndefined(this.btnObj)) {
                    buttonObj = this.btnObj[this.btnObj.length - 1];
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
        let element: HTMLElement = <HTMLElement>document.activeElement;
        let isTagName: boolean = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
        let isContentEdit: boolean = false;
        if (!isTagName) {
            isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
        }
        if (event.keyCode === 27 && this.closeOnEscape) {
            this.hide(event);
        }
        if ((event.keyCode === 13 && !event.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
                isTagName && !isNullOrUndefined(this.primaryButtonEle)) ||
            (event.keyCode === 13 && event.ctrlKey && (element.tagName.toLowerCase() === 'textarea' ||
                isContentEdit)) && !isNullOrUndefined(this.primaryButtonEle)) {
            let buttonIndex: number;
            let firstPrimary: boolean = this.buttons.some((data: { [key: string]: Object }, index: number) => {
                buttonIndex = index;
                let buttonModel: { [key: string]: Object } = (data.buttonModel as { [key: string]: Object });
                return !isNullOrUndefined(buttonModel) && buttonModel.isPrimary === true;
            });
            if (firstPrimary && typeof (this.buttons[buttonIndex].click) === 'function') {
                setTimeout(() => {
                    this.buttons[buttonIndex].click.call(this, event);
                });
            }
        }
    }
    /**
     * Initialize the control rendering
     * @private 
     */
    private initialize(): void {
        if (!isNullOrUndefined(this.target)) {
            this.targetEle = ((typeof this.target) === 'string') ?
                <HTMLElement>document.querySelector(<string>this.target) : <HTMLElement>this.target;
        }
        addClass([this.element], ROOT);
        if (Browser.isDevice) {
            addClass([this.element], DEVICE);
        }
        this.setCSSClass();
        this.setMaxHeight();
    }
    /**
     * Initialize the rendering
     * @private
     */
    private initRender(): void {
        this.initialRender = true;
        attributes(this.element, { role: 'dialog' });
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
        if (this.showCloseIcon) {
            this.renderCloseIcon();
        }
        this.setContent();
        if (this.footerTemplate !== '' && !isNullOrUndefined(this.footerTemplate)) {
            this.setFooterTemplate();
        } else if (!isNullOrUndefined(this.buttons[0].buttonModel)) {
            this.setButton();
        }
        if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
        attributes(this.element, { 'aria-modal': (this.isModal ? 'true' : 'false') });
        if (this.isModal) {
            this.setIsModal();
        }
        if (!isNullOrUndefined(this.targetEle)) {
            this.isModal ? this.targetEle.appendChild(this.dlgContainer) : this.targetEle.appendChild(this.element);
        }
        this.popupObj = new Popup(this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.target,
            actionOnScroll: 'none',
            open: (event: Event) => {
                this.focusContent();
                let eventArgs: object = {
                    container: this.isModal ? this.dlgContainer : this.element,
                    element: this.element,
                    target: this.target
                };
                this.trigger('open', eventArgs);
            },
            close: (event: Event) => {
                if (this.isModal) {
                    addClass([this.dlgOverlay], 'e-fade');
                }
                this.unBindEvent(this.element);
                if (this.isModal) {
                    this.dlgContainer.style.display = 'none';
                }
                this.trigger('close', this.closeArgs);
                if (!isNullOrUndefined(this.storeActiveElement)) {
                    this.storeActiveElement.focus();
                }
            }
        });
        this.positionChange();
        this.setEnableRTL();
        addClass([this.element], DLG_HIDE);
        if (this.isModal) {
            this.setOverlayZindex();
        }
        if (this.visible) {
            this.show();
        } else {
            if (this.isModal) {
                this.dlgOverlay.style.display = 'none';
            }
        }
        this.initialRender = false;
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
            if (typeof(this.position.X) === 'number' && typeof(this.position.Y) === 'number') {
                this.setPopupPosition();
            } else if ((typeof this.position.X === 'string' && typeof this.position.Y === 'number') ||
            (typeof this.position.X === 'number' && typeof this.position.Y === 'string')) {
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

    private setPopupPosition() : void {
        this.popupObj.setProperties({
            position: {
                X: this.position.X, Y: this.position.Y
            }
        });
    }

    private setAllowDragging(): void {
        let handleContent: string = '.' + DLG_HEADER_CONTENT;
        this.dragObj = new Draggable(this.element, {
            clone: false,
            abort: '.e-dlg-closeicon-btn',
            handle: handleContent,
            dragStart: (event: Object) => {
                this.trigger('dragStart', event);
            },
            dragStop: (event: Object) => {
                if (this.isModal) {
                    if (!isNullOrUndefined(this.position)) {
                        this.dlgContainer.classList.remove('e-dlg-' + this.position.X + '-' + this.position.Y);
                    }
                    // Reset the dialog position after drag completion.
                    this.element.style.position = 'relative';
                }
                this.trigger('dragStop', event);
            },
            drag: (event: Object) => {
                this.trigger('drag', event);
            }
        });
        if (!isNullOrUndefined(this.targetEle)) {
            this.dragObj.dragArea = this.targetEle;
        }
    }

    private setButton(): void {
        this.buttonContent = [];
        this.btnObj = [];
        let primaryBtnFlag: boolean = true;
        for (let i: number = 0; i < this.buttons.length; i++) {
            let buttonType: string = !isNullOrUndefined(this.buttons[i].type) ? this.buttons[i].type.toLowerCase() : 'button';
            let btn: HTMLElement = this.createElement('button', { attrs: {type: buttonType }});
            this.buttonContent.push(btn.outerHTML);
        }
        this.setFooterTemplate();
        for (let i: number = 0; i < this.buttons.length; i++) {
            this.btnObj[i] = new Button(this.buttons[i].buttonModel);
            if (typeof (this.buttons[i].click) === 'function') {
                EventHandler.add(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click, this);
            }
            this.btnObj[i].appendTo(this.ftrTemplateContent.children[i] as HTMLElement);
            this.btnObj[i].element.classList.add('e-flat');
            this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0] as HTMLElement;
        }
    }

    private setContent(): void {
        attributes(this.element, { 'aria-describedby': this.element.id + '_dialog-content' });
        this.contentEle = this.createElement('div', { className: DLG_CONTENT, id: this.element.id + '_dialog-content' });
        if (this.innerContentElement) {
            this.contentEle.appendChild(this.innerContentElement);
        } else if (!isNullOrUndefined(this.content) && this.content !== '' || !this.initialRender) {
            if (typeof (this.content) === 'string') {
                this.contentEle.innerHTML = this.content;
            } else if (this.content instanceof HTMLElement) {
                this.contentEle.appendChild(this.content);
            } else {
                this.setTemplate(this.content, this.contentEle);
            }
        }
        if (!isNullOrUndefined(this.headerContent)) {
            this.element.insertBefore(this.contentEle, this.element.children[1]);
        } else {
            this.element.insertBefore(this.contentEle, this.element.children[0]);
        }
        if (this.height === 'auto') {
            this.setMaxHeight();
        }
    }

    private setTemplate(template: string, toElement: HTMLElement): void {
        let templateFn: Function = compile(template);
        let fromElements: HTMLElement[] = [];
        for (let item of templateFn({})) {
            fromElements.push(item);
        }
        append([].slice.call(fromElements), toElement);
    }

    private setMaxHeight(): void {
        let display: string = this.element.style.display;
        this.element.style.display = 'none';
        this.element.style.maxHeight = (!isNullOrUndefined(this.target)) && (this.targetEle.offsetHeight < window.innerHeight) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
        this.element.style.display = display;
    }

    private setEnableRTL(): void {
        this.enableRtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
    }

    private setTargetContent(): void {
        if (isNullOrUndefined(this.content) || this.content === '') {
            let isContent: boolean = this.element.innerHTML.replace(/\s/g, '') !== '';
            if (this.element.children.length > 0 || isContent) {
                this.innerContentElement = document.createDocumentFragment();
                while ( this.element.childNodes.length !== 0 ) {
                    this.innerContentElement.appendChild(this.element.childNodes[0]);
                }
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
        this.setTemplate(this.header, this.headerEle);
        attributes(this.element, { 'aria-labelledby': this.element.id + '_title' });
        this.element.insertBefore(this.headerContent, this.element.children[0]);
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
            this.setTemplate(this.footerTemplate, this.ftrTemplateContent);
        } else {
            this.ftrTemplateContent.innerHTML = this.buttonContent.join('');
        }
        this.element.appendChild(this.ftrTemplateContent);
    }

    private createHeaderContent(): void {
        if (isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.createElement('div', { className: DLG_HEADER_CONTENT });
        }
    }

    private renderCloseIcon(): void {
        this.closeIcon = this.createElement('button', { className: DLG_CLOSE_ICON_BTN , attrs: {type: 'button' }});
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

    private closeIconTitle(): void {
            this.l10n.setLocale(this.locale);
            let closeIconTitle: string = this.l10n.getConstant('close');
            this.closeIcon.setAttribute('title', closeIconTitle);
    }

    private setCSSClass(oldCSSClass?: string): void {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
    }

    private setIsModal(): void {
        this.dlgContainer = this.createElement('div', { className: DLG_CONTAINER });
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
            node = <HTMLElement>items[u];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !(node as HTMLInputElement).disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            }
        }
        return node;
    }

    private focusableElements(content: HTMLElement): HTMLElement {
        if (!isNullOrUndefined(content)) {
            let value: string = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            let items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    }

    private getAutoFocusNode(container: HTMLElement): HTMLElement {
        let node: HTMLElement = <HTMLElement>container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        let value: string = '[autofocus]';
        let items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>container.querySelectorAll(value);
        let validNode: HTMLElement = this.getValidFocusNode(items);
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
        let elementMatch: Function = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
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
        let element: HTMLElement = this.getAutoFocusNode(this.element);
        let node: HTMLElement = !isNullOrUndefined(element) ? element : this.element;
        node.focus();
        this.bindEvent(this.element);
    }

    private bindEvent(element: HTMLElement): void {
        EventHandler.add(element, 'keydown', this.keyDown, this);
    }

    private unBindEvent(element: HTMLElement): void {
        EventHandler.remove(element, 'keydown', this.keyDown);
    }

    /**
     * Module required function    
     * @private 
     */
    protected getModuleName(): string {
        return 'dialog';
    }
    /**
     * Called internally if any of the property value changed
     * @private
     */
    public onPropertyChanged(newProp: DialogModel, oldProp: DialogModel): void {
        if (!this.element.classList.contains(ROOT)) { return; }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'content':
                    if (!isNullOrUndefined(this.content) && this.content !== '') {
                        if (!isNullOrUndefined(this.contentEle) && this.contentEle.getAttribute('role') !== 'dialog') {
                            this.contentEle.innerHTML = '';
                            typeof (this.content) === 'string' ?
                                this.contentEle.innerHTML = this.content : this.contentEle.appendChild(this.content);
                            this.setMaxHeight();
                        } else { this.setContent();  }
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
                    }
                    break;
                case 'footerTemplate':
                    if (this.footerTemplate === '' || isNullOrUndefined(this.footerTemplate)) {
                        if (!this.ftrTemplateContent) { return; }
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
                        } else if (!this.showCloseIcon) { detach(this.closeIcon); }
                    } else { this.renderCloseIcon(); this.wireEvents(); }
                    break;
                case 'locale':
                    if (this.showCloseIcon) {
                        this.closeIconTitle();
                    } break;
                case 'visible':
                    this.visible ? this.show() : this.hide(); break;
                case 'isModal':
                    this.updateIsModal();
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) }); break;
                case 'width':
                    setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) }); break;
                case 'zIndex':
                    this.popupObj.zIndex = this.zIndex;
                    if (this.isModal) { this.setOverlayZindex(this.zIndex); }
                    this.calculatezIndex = false;
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass); break;
                case 'buttons':
                    if (!isNullOrUndefined(this.buttons[0].buttonModel)) {
                        if (!isNullOrUndefined(this.ftrTemplateContent)) {
                            detach(this.ftrTemplateContent); this.ftrTemplateContent = null;
                        }
                        this.footerTemplate = '';
                        this.setButton();
                    } break;
                case 'allowDragging':
                    if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                        this.setAllowDragging();
                    } else {
                        this.dragObj.destroy();
                    } break;
                case 'target':
                    this.popupObj.relateTo = newProp.target;  break;
                case 'position':
                    if (this.isModal) {
                        let positionX: string | number = isNullOrUndefined(oldProp.position.X) ? this.position.X : oldProp.position.X;
                        let positionY: string | number = isNullOrUndefined(oldProp.position.Y) ? this.position.Y : oldProp.position.Y;
                        if (this.dlgContainer.classList.contains('e-dlg-' + positionX + '-' + positionY )) {
                            this.dlgContainer.classList.remove('e-dlg-' + positionX + '-' + positionY );
                        }
                    }
                    this.positionChange();
                    break;
                case 'enableRtl':
                    this.setEnableRTL(); break;
            }
        }
    }

    private updateIsModal(): void {
        this.element.setAttribute('aria-modal', this.isModal ? 'true' : 'false');
        if (this.isModal) {
            this.setIsModal();
            this.element.style.top = '0px';
            this.element.style.left = '0px';
            if (!isNullOrUndefined(this.targetEle)) {
                this.targetEle.appendChild(this.dlgContainer);
            }
        } else {
            removeClass([this.element], MODAL_DLG);
            removeClass([document.body], SCROLL_DISABLED);
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
    }

    private setzIndex(zIndexElement: HTMLElement, setPopupZindex: boolean): void {
        let prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.zIndex = getZindexPartial(zIndexElement);
        this.isProtectedOnChange = prevOnChange;
        if (setPopupZindex) {
            this.popupObj.zIndex = this.zIndex;
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @memberof dialog
     */
    public destroy(): void {
        if (this.element.classList.contains(ROOT)) {
            this.unWireEvents();
            super.destroy();
            let classArray: string[] = [
                ROOT, RTL, MODAL_DLG
            ];
            removeClass([this.element, this.element], classArray);
            if (this.popupObj.element.classList.contains(POPUP_ROOT)) {
                this.popupObj.destroy();
            }
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.btnObj)) {
                for (let i: number; i < this.btnObj.length; i++) {
                    this.btnObj[i].destroy();
                }
            }
            if (this.isModal) {
                detach(this.dlgOverlay);
                this.dlgContainer.parentNode.insertBefore(this.element, this.dlgContainer);
                detach(this.dlgContainer);
            }
            this.element.innerHTML = '';
            while (this.element.attributes.length > 0) {
                this.element.removeAttribute(this.element.attributes[0].name);
            }
            for (let k: number = 0; k < this.clonedEle.attributes.length; k++) {
                this.element.setAttribute(this.clonedEle.attributes[k].name, this.clonedEle.attributes[k].value);
            }
        }
    }

    /**
     * Binding event to the element while widget creation
     * @hidden
     */
    private wireEvents(): void {
        if (this.showCloseIcon) {
            EventHandler.add(
                this.closeIcon, 'click', this.closeIconClickEventHandler, this);
        }
        if (this.isModal) {
            EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    }
    /**
     * Unbinding event to the element while widget destroy
     * @hidden
     */
    private unWireEvents(): void {
        if (this.showCloseIcon) {
            EventHandler.remove(this.closeIcon, 'click', this.closeIconClickEventHandler);
        }
        if (this.isModal) {
            EventHandler.remove(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler);
        }

        if (!isNullOrUndefined(this.buttons[0].buttonModel)) {
            for (let i: number = 0; i < this.buttons.length; i++) {
                if (typeof (this.buttons[i].click) === 'function') {
                    EventHandler.remove(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click);
                }
            }
        }
    }
    /**
     * Refreshes the dialog's position when the user changes its header and footer height/width dynamically.
     * @return {void}
     */
    public refreshPosition(): void {
        this.popupObj.refreshPosition();
    }
    /**
     * Opens the dialog if it is in hidden state.
     * To open the dialog with full screen width, set the parameter to true.
     * @param { boolean } isFullScreen - Enable the fullScreen Dialog.
     * @return {void}
     */
    public show(isFullScreen?: boolean): void {
        if (!this.element.classList.contains(ROOT)) { return; }
        if (!this.element.classList.contains(DLG_SHOW) || (!isNullOrUndefined(isFullScreen))) {
            if (!isNullOrUndefined(isFullScreen)) {
                this.fullScreen(isFullScreen);
            }
            let eventArgs: BeforeOpenEventArgs = {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                target: this.target
            };
            this.trigger('beforeOpen', eventArgs);
            if (eventArgs.cancel) { return; }
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
                    this.element.style.position = 'relative';
                    addClass([this.targetEle], SCROLL_DISABLED);
                } else {
                    addClass([document.body], SCROLL_DISABLED);
                }
            }
            let openAnimation: Object = {
                name: this.animationSettings.effect + 'In',
                duration: this.animationSettings.duration,
                delay: this.animationSettings.delay
            };
            let zIndexElement: HTMLElement = (this.isModal) ? this.element.parentElement : this.element;
            if (this.calculatezIndex) {
                this.setzIndex(zIndexElement, true);
                setStyleAttribute(this.element, { 'zIndex': this.zIndex });
                if (this.isModal) {
                    this.setOverlayZindex(this.zIndex);
                }
            }
            this.animationSettings.effect === 'None' ? this.popupObj.show() : this.popupObj.show(openAnimation);
            this.dialogOpen = true;
            let prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.visible = true;
            this.isProtectedOnChange = prevOnChange;
        }
    }
    /**
     * Closes the dialog if it is in visible state.
     * @return {void}
     */
    public hide(event?: Event): void {
        if (!this.element.classList.contains(ROOT)) { return; }
        let eventArgs: BeforeCloseEventArgs = {
            cancel: false,
            isInteraction: event ? true : false,
            element: this.element,
            target: this.target,
            container: this.isModal ? this.dlgContainer : this.element,
            event: event
        };
        this.trigger('beforeClose', eventArgs);
        this.closeArgs = eventArgs;
        if (eventArgs.cancel) { return; }
        if (this.isModal) {
            !isNullOrUndefined(this.targetEle) ? removeClass([this.targetEle], SCROLL_DISABLED) :
                removeClass([document.body], SCROLL_DISABLED);
        }
        let closeAnimation: Object = {
            name: this.animationSettings.effect + 'Out',
            duration: this.animationSettings.duration,
            delay: this.animationSettings.delay
        };
        this.animationSettings.effect === 'None' ? this.popupObj.hide() : this.popupObj.hide(closeAnimation);
        this.dialogOpen = false;
        let prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.visible = false;
        this.isProtectedOnChange = prevOnChange;
    }
    /**
     * Specifies to view the Full screen Dialog.
     * @private
     */
    private fullScreen(args: boolean): boolean {
        let top: number = this.element.offsetTop;
        let left: number = this.element.offsetLeft;
        if (args) {
            addClass([this.element], FULLSCREEN);
            let display: string = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!isNullOrUndefined(this.target)) ?
                (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            addClass([document.body], SCROLL_DISABLED);
            if (this.allowDragging && !isNullOrUndefined(this.dragObj)) {
                this.dragObj.destroy();
            }
        } else {
            removeClass([this.element], FULLSCREEN);
            removeClass([document.body], SCROLL_DISABLED);
            if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                this.setAllowDragging();
            }
        }
        return args;
    }

    /**
     * Returns the dialog button instances.
     * Based on that, you can dynamically change the button states.
     * @param { number } index - Index of the button.
     * @return {Button}
     */
    public getButtons(index?: number): Button[] | Button {
        if (!isNullOrUndefined(index)) {
            return this.btnObj[index];
        }
        return this.btnObj;
    }
}

/**
 * Base for creating Alert and Confirmation Dialog through util method.
 */
export namespace DialogUtility {

    /**
     * An alert dialog box is used to display warning like messages to the users.
     * ```
     * Eg : DialogUtility.alert('Alert message');
     * 
     * ```
     */
     /* istanbul ignore next */
    export function alert(args?: AlertDialogArgs | string): DialogModel {
        let dialogComponent: Dialog;
        let dialogElement: HTMLElement = createElement('div', { 'className': DLG_UTIL_ALERT });
        document.body.appendChild(dialogElement);
        let alertDialogObj: Dialog;
        let okButtonModel: ButtonPropsModel[] = [{
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
    export function confirm(args?: ConfirmDialogArgs | string): DialogModel {
        let dialogComponent: Dialog;
        let dialogElement: HTMLElement = createElement('div', { 'className': DLG_UTIL_CONFIRM });
        document.body.appendChild(dialogElement);
        let confirmDialogObj: Dialog;
        let okCancelButtonModel: ButtonPropsModel[] = [{
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

    function createDialog(options?: DialogModel, element?: string | HTMLElement): Dialog {
        let dialogObject: Dialog = new Dialog(options);
        dialogObject.appendTo(element);
        return dialogObject;
    }

    function alertOptions(option?: AlertDialogArgs): DialogModel {
        let options: DialogModel = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setAlertButtonModel(options, option);
        return options;
    }

    function confirmOptions(option?: ConfirmDialogArgs): DialogModel {
        let options: DialogModel = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setConfirmButtonModel(options, option);
        return options;
    }

    function formOptions(options: DialogModel, option: AlertDialogArgs): DialogModel {
        options.header = !isNullOrUndefined(option.title) ? option.title : DLG_UTIL_DEFAULT_TITLE;
        options.content = !isNullOrUndefined(option.content) ? option.content : '';
        options.isModal = !isNullOrUndefined(option.isModal) ? option.isModal : true;
        options.showCloseIcon = !isNullOrUndefined(option.showCloseIcon) ? option.showCloseIcon : false;
        options.allowDragging = !isNullOrUndefined(option.isDraggable) ? option.isDraggable : false;
        options.closeOnEscape = !isNullOrUndefined(option.closeOnEscape) ? option.closeOnEscape : false;
        options.position = !isNullOrUndefined(option.position) ? option.position : { X: 'center', Y: 'top' };
        return options;
    }

    function setAlertButtonModel(options: DialogModel, option?: AlertDialogArgs): DialogModel {
        let alertButtonModel: ButtonPropsModel[]  = [{
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

    function setConfirmButtonModel(options: DialogModel, option?: ConfirmDialogArgs): DialogModel {
        let okButtonModel: ButtonPropsModel = {
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function (): void {
                this.hide();
            }
        };
        let cancelButtonModel: ButtonPropsModel = {
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

    function formButtonModel(buttonModel: ButtonPropsModel, option: ButtonArgs, buttonPropModel: ButtonPropsModel): ButtonPropsModel {
        let buttonProps: ButtonPropsModel = buttonPropModel;
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
        return buttonProps;
    }
}

export interface ButtonArgs {
    icon?: string;
    cssClass?: string;
    click?: EmitType<Object>;
    text?: string;
}

export interface AlertDialogArgs {
    title?: string;
    content?: string | HTMLElement;
    isModal?: boolean;
    isDraggable?: boolean;
    showCloseIcon?: boolean;
    closeOnEscape?: boolean;
    position?: PositionDataModel;
    okButton?: ButtonArgs;
}

export interface ConfirmDialogArgs {
    title?: string;
    content?: string | HTMLElement;
    isModal?: boolean;
    isDraggable?: boolean;
    showCloseIcon?: boolean;
    closeOnEscape?: boolean;
    position?: PositionDataModel;
    okButton?: ButtonArgs;
    cancelButton?: ButtonArgs;
}