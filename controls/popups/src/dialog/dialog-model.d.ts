import { Component, Property, Event, Collection, L10n, EmitType, Complex, compile, createElement } from '@syncfusion/ej2-base';import { addClass, removeClass, detach, attributes, prepend, setStyleAttribute } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, isBlazor } from '@syncfusion/ej2-base';import { isNullOrUndefined, formatUnit, append, EventHandler, Draggable, extend } from '@syncfusion/ej2-base';import { BlazorDragEventArgs, SanitizeHtmlHelper, Browser } from '@syncfusion/ej2-base';import { Button, ButtonModel } from '@syncfusion/ej2-buttons';import { Popup, PositionData, getZindexPartial } from '../popup/popup';import { PositionDataModel } from '../popup/popup-model';import { createResize, removeResize, setMinHeight, setMaxWidth, setMaxHeight } from '../common/resize';
import {ButtonType,DialogEffect,ResizeDirections,BeforeSanitizeHtmlArgs,BeforeOpenEventArgs,OpenEventArgs,BeforeCloseEventArgs,CloseEventArgs} from "./dialog";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ButtonProps
 */
export interface ButtonPropsModel {

    /**
     * Specifies the button component properties to render the dialog buttons.
     */
    buttonModel?: ButtonModel;

    /**
     * Specify the type of the button.
     * Possible values are Button, Submit and Reset.
     * @default 'Button'
     * @aspType string
     * @blazorType string
     */
    type?: ButtonType | string;

    /**
     * Event triggers when `click` the dialog button.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<Object>;

}

/**
 * Interface for a class AnimationSettings
 */
export interface AnimationSettingsModel {

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
     * @default 'Fade'
     */
    effect?: DialogEffect;

    /**
     * Specifies the duration in milliseconds that the animation takes to open or close the dialog.
     * @default 400
     */
    duration?: number;

    /**
     * Specifies the delay in milliseconds to start animation.
     * @default 0
     */
    delay?: number;

}

/**
 * Interface for a class Dialog
 */
export interface DialogModel extends ComponentModel{

    /**
     * Specifies the value that can be displayed in dialog's content area.
     * It can be information, list, or other HTML elements.
     * The content of dialog can be loaded with dynamic data such as database, AJAX content, and more.
     * 
     * {% codeBlock src="dialog/content-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dialog/content-api/index.html" %}{% endcodeBlock %}
     * @default ''
     * @blazorType string
     */
    content?: string | HTMLElement;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies the value that represents whether the close icon is shown in the dialog component.
     * @default false
     */
    showCloseIcon?: boolean;

    /**
     * Specifies the Boolean value whether the dialog can be displayed as modal or non-modal.
     * * `Modal`: It creates overlay that disable interaction with the parent application and user should 
     *    respond with modal before continuing with other applications.
     * * `Modeless`: It does not prevent user interaction with parent application.
     * @default false
     */
    isModal?: boolean;

    /**
     * Specifies the value that can be displayed in the dialog's title area that can be configured with plain text or HTML elements.
     * This is optional property and the dialog can be displayed without header, if the header property is null.
     * @default ''
     * @blazorType string
     */
    header?: string | HTMLElement;

    /**
     * Specifies the value that represents whether the dialog component is visible.
     * @default true 
     */
    visible?: boolean;

    /**
     * Specifies the value whether the dialog component can be resized by the end-user.
     * If enableResize is true, the dialog component creates grip to resize it diagonal direction.
     * @default false 
     */
    enableResize?: boolean;

    /**
     * Specifies the resize handles direction in the dialog component that can be resized by the end-user.
     * @default ['South-East'] 
     */
    resizeHandles?: ResizeDirections[];

    /**
     * Specifies the height of the dialog component.
     * @default 'auto'
     * @blazorType string
     */
    height?: string | number;

    /**
     * Specify the min-height of the dialog component.
     * @default ''
     * @blazorType string
     */
    minHeight?: string | number;

    /**
     * Specifies the width of the dialog. 
     * @default '100%'
     * @blazorType string
     */
    width?: string | number;

    /**
     * Specifies the CSS class name that can be appended with root element of the dialog.
     * One or more custom CSS classes can be added to a dialog.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 1000
     */
    zIndex?: number;

    /**
     * Specifies the target element in which to display the dialog.
     * The default value is null, which refers the `document.body` element.
     * @default null
     * @blazorType string
     */
    target?: HTMLElement | string;

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
     */
    footerTemplate?: HTMLElement | string;

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
    allowDragging?: boolean;

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
    buttons?: ButtonPropsModel[];

    /**
     * Specifies the boolean value whether the dialog can be closed with the escape key 
     * that is used to control the dialog's closing behavior.
     * @default true
     */
    closeOnEscape?: boolean;

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
    animationSettings?: AnimationSettingsModel;

    /**
     * Specifies the value where the dialog can be positioned within the document or target.
     * The position can be represented with pre-configured positions or specific X and Y values.
     * * `X value`: left, center, right, or offset value.
     * * `Y value`: top, center, bottom, or offset value.
     * 
     * {% codeBlock src='dialog/position/index.md' %}{% endcodeBlock %}
     * 
     * @default {X:'center', Y:'center'}
     */
    position?: PositionDataModel;

    /**
     * Event triggers when the dialog is created.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Event triggers when a dialog is opened.
     * @event
     * @blazorProperty 'Opened'
     * @blazorType OpenEventArgs
     */
    open?: EmitType<Object>;

    /**
     * Event triggers before sanitize the value.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    beforeSanitizeHtml?: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * Event triggers when the dialog is being opened.
     * If you cancel this event, the dialog remains closed.
     * Set the cancel argument to true to cancel the open of a dialog. 
     * @event
     * @blazorProperty 'OnOpen'
     */
    beforeOpen?: EmitType<BeforeOpenEventArgs>;

    /**
     * Event triggers after the dialog has been closed.
     * @event
     * @blazorProperty 'Closed'
     * @blazorType CloseEventArgs
     */
    close?: EmitType<Object>;

    /**
     * Event triggers before the dialog is closed.
     * If you cancel this event, the dialog remains opened.
     * Set the cancel argument to true to cancel the closure of a dialog. 
     * @event
     * @blazorProperty 'OnClose'
     */
    beforeClose?: EmitType<BeforeCloseEventArgs>;

    /**
     * Event triggers when the user begins dragging the dialog.
     * @event
     * @blazorProperty 'OnDragStart'
     * @blazorType DragStartEventArgs
     */
    dragStart?: EmitType<Object>;

    /**
     * Event triggers when the user stop dragging the dialog.
     * @event
     * @blazorProperty 'OnDragStop'
     * @blazorType DragStopEventArgs
     */
    dragStop?: EmitType<Object>;

    /**
     * Event triggers when the user drags the dialog.
     * @event
     * @blazorProperty 'OnDrag'
     * @blazorType DragEventArgs
     */
    drag?: EmitType<Object>;

    /**
     * Event triggers when the overlay of dialog is clicked.
     * @event
     * @blazorProperty 'OnOverlayClick'
     */
    overlayClick?: EmitType<Object>;

    /**
     * Event triggers when the user begins to resize a dialog.
     * @event
     * @blazorProperty 'OnResizeStart'
     */
    resizeStart?: EmitType<Object>;

    /**
     * Event triggers when the user resize the dialog.
     * @event
     * @blazorProperty 'Resizing'
     */
    resizing?: EmitType<Object>;

    /**
     * Event triggers when the user stop to resize a dialog.
     * @event
     * @blazorProperty 'OnResizeStop'
     */
    resizeStop?: EmitType<Object>;

    /**
     * Event triggers when the dialog is destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Event>;

}