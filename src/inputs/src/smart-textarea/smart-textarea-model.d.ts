import { EventHandler, Property, createElement } from '@syncfusion/ej2-base';import { TextArea } from '../textarea/textarea';import { CaretPosition, CaretPositionHelper } from './caret-helper';
import {SuggestionMode} from "./smart-textarea";
import {TextAreaModel} from "../textarea/textarea-model";

/**
 * Interface for a class SmartTextArea
 */
export interface SmartTextAreaModel extends TextAreaModel{

    /**
     * Represents the user's role or designation, which can be used to provide role-specific suggestions or content within the smart textarea.
     * Provide a string that describes who is typing and for what reason, optionally giving other contextual information.
     *
     * @default ''
     */
    userRole?: string;

    /**
     * Specifies a collection of phrases commonly used by the user, which can be leveraged for auto-completion and suggestions.
     * Provide an array of string phrases commonly used by the user to enhance auto-completion and suggestions. Include preferred tone, voice, and any relevant information such as policies, URLs, or keywords for improved suggestions.
     *
     * @default []
     */
    UserPhrases?: string[];

    /**
     * Callback function to get suggestion text from server to display smart suggestion.
     *
     * @returns {string}
     */
    aiSuggestionHandler?: Function;

    /**
     * Specifies whether suggestions should appear in a popup or inline within the text area.
     * possible values are:
     * * `Enable` - Suggestions are always shown as a floating overlay, which can be tapped or clicked.
     * * `Disable` - Suggestions are always shown inline and can be accepted by pressing `Tab` key.
     * * `None` - Touch devices display suggestions as an overlay, while non-touch devices use inline suggestions.
     *
     * @default None
     */
    showSuggestionOnPopup?: SuggestionMode;

}