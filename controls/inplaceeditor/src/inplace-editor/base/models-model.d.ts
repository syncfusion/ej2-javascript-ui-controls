import { ChildProperty, Property } from '@syncfusion/ej2-base';import { TooltipModel } from '@syncfusion/ej2-popups';

/**
 * Interface for a class PopupSettings
 */
export interface PopupSettingsModel {

    /**
     * Specifies title for the editor popup.

     */
    title?: string;

    /**
     * Specifies model for editor popup customization like position, animation,etc.

     */
    model?: TooltipModel;

}