import { INotifyPropertyChanged, NotifyPropertyChanges, Property, ChildProperty, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { InterActiveChatBase } from '../interactive-chat-base/interactive-chat-base';import { StartListeningEventArgs, StopListeningEventArgs, TranscriptChangedEventArgs, ErrorEventArgs, SpeechToTextState, ButtonSettings, ButtonSettingsModel, TooltipSettings, TooltipSettingsModel } from '@syncfusion/ej2-inputs';
import {InterActiveChatBaseModel} from "../interactive-chat-base/interactive-chat-base-model";

/**
 * Interface for a class SpeechToTextSettings
 */
export interface SpeechToTextSettingsModel {

    /**
     * Specifies whether speech-to-text functionality is enabled.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies whether interim results should be captured during speech recognition.
     *
     * @default true
     */
    allowInterimResults?: boolean;

    /**
     * Specifies the language for speech recognition using ISO language codes.
     *
     * @default 'en-US'
     */
    lang?: string;

    /**
     * Specifies whether the speech-to-text control is disabled.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Configuration object for the mic button appearance and behavior.
     * Defines the button text, icons, position, and styling for both start and stop states.
     *
     * @type {ButtonSettingsModel}
     * @default {}
     */
    buttonSettings?: ButtonSettingsModel;

    /**
     * Specifies whether to show tooltip for the mic button.
     *
     * @default true
     */
    showTooltip?: boolean;

    /**
     * Configuration object for tooltip appearance and behavior.
     * Defines the tooltip text and position for both listening and stop states.
     *
     * @type {TooltipSettingsModel}
     * @default {}
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Applies custom CSS classes to the speech-to-text component.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Stores the recognized speech transcript.
     * This property is read-only and updated when speech recognition results are received.
     *
     * @type {string}
     * @default ''
     */
    transcript?: string;

    /**
     * Indicates whether the component is currently listening.
     *
     * @default 'Inactive'
     */
    listeningState?: SpeechToTextState;

    /**
     * Event raised when speech recognition starts.
     * Triggered when the user clicks the mic button and begins speaking.
     *
     * @event onStart
     */
    onStart?: EmitType<StartListeningEventArgs>;

    /**
     * Event raised when speech recognition stops.
     * Triggered when the user stops speaking and clicks the mic button.
     *
     * @event onStop
     */
    onStop?: EmitType<StopListeningEventArgs>;

    /**
     * Event raised when the transcript changes during speech recognition.
     * Triggered for both interim results (if enabled) and final results.
     *
     * @event transcriptChanged
     */
    transcriptChanged?: EmitType<TranscriptChangedEventArgs>;

    /**
     * Event raised when an error occurs during speech recognition.
     *
     * @event onError
     */
    onError?: EmitType<ErrorEventArgs>;

}

/**
 * Interface for a class AIAssistBase
 */
export interface AIAssistBaseModel extends InterActiveChatBaseModel{

    /**
     * Specifies whether the prompt response need to be added through streaming in the component.
     * By default the response is not streamed and default value is false
     *
     * @type {boolean}
     * @default false
     */
    enableStreaming?: boolean;

}