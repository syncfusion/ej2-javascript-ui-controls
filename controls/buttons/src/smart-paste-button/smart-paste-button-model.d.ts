import { Button } from '../button/button';import { EventHandler, Property } from '@syncfusion/ej2-base';
import {ButtonModel} from "../button/button-model";

/**
 * Interface for a class SmartPasteButton
 */
export interface SmartPasteButtonModel extends ButtonModel{

    /**
     * Callback function to get the form response data from the server to process the smart paste.
     *
     * @param {ChatOptions} settings - Specifies the chat options
     * @returns {string} - Returns the string
     */
    aiAssistHandler?: Function;

}