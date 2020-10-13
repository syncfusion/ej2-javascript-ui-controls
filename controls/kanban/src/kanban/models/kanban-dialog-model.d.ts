import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { AnimationSettings, AnimationSettingsModel, PositionData, PositionDataModel } from '@syncfusion/ej2-popups';

/**
 * Interface for a class KanbanDialog
 */
export interface KanbanDialogModel {

    /**
     * Specifies the value whether the dialog component can be dragged by the end-user.
     * The dialog allows to drag by selecting the header and dragging it for re-position the dialog.
     * @default false
     */
    allowDragging?: boolean;

    /**
     * Specifies the animation settings of the dialog component.
     * The animation effect can be applied on open and close the dialog with duration and delay.
     * @default { effect: 'Fade', duration: 400, delay:0 }
     */
    animationSettings?: AnimationSettingsModel;

    /**
     * Specifies the boolean value whether the dialog can be closed with the escape key 
     * that is used to control the dialog's closing behavior.
     * @default true
     */
    closeOnEscape?: boolean;

    /**
     * Specifies the CSS class name that can be appended with root element of the dialog.
     * One or more custom CSS classes can be added to a dialog.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the value whether the dialog component can be resized by the end-user.
     * If enableResize is true, the dialog component creates grip to resize it diagonal direction.
     * @default false 
     */
    enableResize?: boolean;

    /**
     * Specifies the height of the dialog component.
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Specifies the Boolean value whether the dialog can be displayed as modal or non-modal.
     * * `Modal`: It creates overlay that disable interaction with the parent application and user should 
     *    respond with modal before continuing with other applications.
     * * `Modeless`: It does not prevent user interaction with parent application.
     * @default true
     */
    isModal?: boolean;

    /**
     * Specify the min-height of the dialog component.
     * @default ''
     */
    minHeight?: string | number;

    /**
     * Specifies the value where the dialog can be positioned within the document or target.
     * The position can be represented with pre-configured positions or specific X and Y values.
     * * `X value`: left, center, right, or offset value.
     * * `Y value`: top, center, bottom, or offset value.
     * @default { X:'center', Y:'center'}
     */
    position?: PositionDataModel;

    /**
     * Specifies the value that represents whether the close icon is shown in the dialog component.
     * @default true
     */
    showCloseIcon?: boolean;

    /**
     * Specifies the target element in which to display the dialog.
     * The default value is null, which refers the `document.body` element.
     * @default null
     */
    target?: HTMLElement | string;

    /**
     * Specifies the width of the dialog. 
     * @default 350
     */
    width?: string | number;

    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 1000
     */
    zIndex?: number;

}