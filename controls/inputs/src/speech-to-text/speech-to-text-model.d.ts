import { NotifyPropertyChanges, INotifyPropertyChanged, Component, getUniqueID, Property, isNullOrUndefined as isNOU, EmitType, Event, EventHandler, ChildProperty, BaseEventArgs, Complex, removeClass, addClass, L10n } from '@syncfusion/ej2-base';import { Button, IconPosition } from '@syncfusion/ej2-buttons';import { Tooltip } from '@syncfusion/ej2-popups';
import {TooltipPosition,SpeechToTextState,StartListeningEventArgs,StopListeningEventArgs,ErrorEventArgs,TranscriptChangedEventArgs} from "./speech-to-text";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ButtonSettings
 */
export interface ButtonSettingsModel {

    /**
     * Specifies the text content to be displayed when the SpeechToText button is in the "start" state.
     * This content appears alongside the icon or as standalone text based on the configuration.
     *
     * @type {string}
     * @default ""
     */
    content?: string;

    /**
     * Specifies the text content to be displayed when the SpeechToText button is in the "stop" state.
     * This content appears alongside the icon or as standalone text based on the configuration.
     *
     * @type {string}
     * @default ""
     */
    stopContent?: string;

    /**
     * Specifies the CSS classes for the icon displayed on the SpeechToText button.
     * This class determines the appearance of the button icon in "start" state.
     *
     * @type {string}
     * @default ""
     */
    iconCss?: string;

    /**
     * Specifies the CSS classes for the icon displayed when the SpeechToText button is in the "stop" state.
     * This class determines the styling of the button icon in the stop state, allowing for clear visual feedback.
     *
     * @type {string}
     * @default ""
     */
    stopIconCss?: string;

    /**
     * Specifies the position of the icon relative to the button text content in the SpeechToText component.
     * This property can accept either a string or an IconPosition enum to determine the position of the icon.
     *
     * @type {string | IconPosition}
     * @default "Left"
     */
    iconPosition?: string | IconPosition;

    /**
     * Specifies whether the button should be styled as a primary action button in the SpeechToText component.
     * When set to `true`, the button applies primary styling.
     *
     * @type {boolean}
     * @default false
     */
    isPrimary?: boolean;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * The text displayed when the user hovers over the button while it is in the listening state,
     * showing the start listening option.
     * @type {string}
     * @default 'Start listening'
     */
    content?: string;

    /**
     * The text displayed when the user hovers over the button while listening is in progress,
     * and the button shows the stop icon.
     * @type {string}
     * @default 'Stop listening'
     */
    stopContent?: string;

    /**
     * Specifies the position of the tooltip in the UI, indicating where the tooltip should appear.
     *
     * @isenumeration true
     * @asptype TooltipPosition
     * @default 'TopCenter'
     */
    position?: TooltipPosition;

}

/**
 * Interface for a class SpeechToText
 */
export interface SpeechToTextModel extends ComponentModel{

    /**
     * The transcribed text from the speech-to-text process.
     * This property updates dynamically during speech recognition, providing both interim and final results.
     * It can be used to display or process the transcribed speech.
     *
     * @type {string}
     * @default ''
     */
    transcript?: string;

    /**
     * The language and locale used for speech recognition.
     * This ensures proper transcription by selecting the correct language model.
     * Common formats: 'en-US' (English, United States), 'es-ES' (Spanish, Spain), 'fr-FR' (French, France).
     *
     * @type {string}
     * @default ''
     */
    lang?: string;

    /**
     * Determines whether interim results should be provided during speech recognition.
     * If true, partial results are delivered in real-time, allowing for a dynamic user experience.
     * If false, only final results will be provided after the recognition process is complete.
     *
     * @type {boolean}
     * @default true
     */
    allowInterimResults?: boolean;

    /**
     * Determines whether the tooltip should be displayed on hover over the SpeechToText button.
     * If true, the tooltip will be shown to provide additional information about the current state or action.
     *
     * @type {boolean}
     * @default true
     */
    showTooltip?: boolean;

    /**
     * Represents the current operational state of the component.
     * This state helps manage transitions and control the component's behavior.
     * Possible values:
     * - 'Inactive': Component is idle.
     * - 'Listening': The component is actively listening for speech input.
     * - 'Stopped': Listening has stopped.
     *
     * @isenumeration true
     * @asptype SpeechToTextState
     * @default 'Inactive'
     */
    listeningState?: SpeechToTextState;

    /**
     * Customizes the appearance and functionality of the record button.
     * This allows for customization of button content, icons, and positions.
     * Use it to adjust the button's visual and functional properties according to your needs.
     *
     * @default null
     * @type {ButtonSettingsModel}
     */
    buttonSettings?: ButtonSettingsModel;

    /**
     * Defines tooltip content and positioning for guiding user interactions.
     * Tooltip provides helpful instructions or descriptions for button actions, improving user experience.
     *
     * @default null
     * @type {TooltipSettingsModel}
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Indicates whether the component is disabled.
     * When true, all interactions with the component (e.g., clicking, listening) are disabled.
     * Useful for preventing user interaction in specific states, such as during processing or error handling.
     *
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies additional CSS classes for customizing the component's appearance.
     * Allows applying custom styles to match application requirements
     * This property can be used to extend the component's default style.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Allows additional HTML attributes to be added to the root element of the SpeechToText button.
     * This property accepts a key-value pair format for attributes such as name, aria-label, and others.
     * This helps to make the button more accessible and adaptable to specific requirements.
     *
     * @type {Object}
     * @default null
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Triggered when the SpeechToText component is initialized and ready for interaction.
     * This event indicates that the component is fully loaded and can start processing user input.
     * Use this event to execute initialization logic or show the component's ready state.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Triggered when speech recognition begins listening for audio input.
     * This event fires when the user starts the speech-to-text process.
     * Use this event to execute logic or display feedback (e.g., a "Listening..." message).
     *
     * @param {StartListeningEventArgs} args - The event arguments containing the state and context information for the start of the listening process.
     * @event onStart
     */
    onStart?: EmitType<StartListeningEventArgs>;

    /**
     * Triggered when speech recognition stops listening for audio input.
     * This event marks the end of the listening session, either due to user action or completion of recognition.
     * Use this event to trigger post-processing logic or indicate that listening has ended (e.g., show "Listening stopped").
     *
     * @param {StopListeningEventArgs} args - The event arguments containing the state and context information for the stop action.
     * @event onStop
     */
    onStop?: EmitType<StopListeningEventArgs>;

    /**
     * Triggered when an error occurs during speech recognition or listening, this event provides details to handle exceptions, display messages, and troubleshoot issues like microphone failures, network errors, or unsupported browsers and language models.
     *
     * Common error strings may include:
     * - `no-speech`: No speech detected. Please speak into the microphone.
     * - `aborted`: Speech recognition was aborted.
     * - `audio-capture`: No microphone detected. Ensure your microphone is connected.
     * - `not-allowed`: Microphone access denied. Allow microphone permissions.
     * - `service-not-allowed`: Speech recognition service is not allowed in this context.
     * - `network`: Network error occurred. Check your internet connection.
     * - `unsupported-browser`: The browser does not support the SpeechRecognition API.
     *
     * In addition to handling common speech recognition errors, it is essential to handle unsupported browser errors. For example, if the browser does not support the `SpeechRecognition` API, the `unsupported-browser` error string will be triggered. This can help notify users to switch to a compatible browser.
     *
     * For more details on the error strings and how to handle them, refer to the documentation:
     * [SpeechRecognitionErrorEvent error](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent/error)
     *
     * @param {ErrorEventArgs} args - The event arguments containing the error details:
     *    - `error`: The error string representing the specific issue that occurred.
     *    - `message`: A brief message describing the error.
     *    - `event`: The event object that triggered the error (contains details like the type of error event).
     *
     * @event onError
     */
    onError?: EmitType<ErrorEventArgs>;

    /**
     * Triggered when the transcript is updated during the speech recognition process.
     * This event delivers updated text as the user speaks. It can be used to update the UI with real-time transcription.
     * The event provides both interim and final transcript results, depending on the configuration.
     *
     * @param {TranscriptChangedEventArgs} args - The event arguments containing the latest transcript text.
     * @event transcriptChanged
     */
    transcriptChanged?: EmitType<TranscriptChangedEventArgs>;

}