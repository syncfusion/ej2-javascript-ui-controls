
import { NotifyPropertyChanges, INotifyPropertyChanged, Component, getUniqueID, Property, isNullOrUndefined as isNOU, EmitType, Event, EventHandler, ChildProperty, BaseEventArgs, Complex, removeClass, addClass, L10n } from '@syncfusion/ej2-base';
import { SpeechToTextModel, TooltipSettingsModel, ButtonSettingsModel } from './speech-to-text-model';
import { Button, IconPosition } from '@syncfusion/ej2-buttons';
import { Tooltip } from '@syncfusion/ej2-popups';

//#region Interfaces

/**
 * Applicable positions where the Tooltip can be displayed over SpeechToText button.
 * - TopLeft :- The tooltip appears at the top-left corner of the SpeechToText button.
 * - TopCenter :- The tooltip appears at the top-center of the SpeechToText button.
 * - TopRight :- The tooltip appears at the top-right corner of the SpeechToText button.
 * - BottomLeft :- The tooltip appears at the bottom-left corner of the SpeechToText button.
 * - BottomCenter :- The tooltip appears at the bottom-center of the SpeechToText button.
 * - BottomRight :- The tooltip appears at the bottom-right corner of the SpeechToText button.
 * - LeftTop :- The tooltip appears at the left-top corner of the SpeechToText button.
 * - LeftCenter :- The tooltip appears at the left-center of the SpeechToText button.
 * - LeftBottom :- The tooltip appears at the left-bottom corner of the SpeechToText button.
 * - RightTop :- The tooltip appears at the right-top corner of the SpeechToText button.
 * - RightCenter :- The tooltip appears at the right-center of the SpeechToText button.
 * - RightBottom :- The tooltip appears at the right-bottom corner of the SpeechToText button.
 */
export type TooltipPosition = 'TopLeft' | 'TopCenter' | 'TopRight' | 'BottomLeft' | 'BottomCenter' | 'BottomRight' | 'LeftTop' | 'LeftCenter' | 'LeftBottom' | 'RightTop' | 'RightCenter' | 'RightBottom';

/**
 * Configuration settings for the toggle button used in the SpeechToText component.
 */
export class ButtonSettings extends ChildProperty<ButtonSettings> {
    /**
     * Specifies the text content to be displayed when the SpeechToText button is in the "start" state.
     * This content appears alongside the icon or as standalone text based on the configuration.
     *
     * @type {string}
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Specifies the text content to be displayed when the SpeechToText button is in the "stop" state.
     * This content appears alongside the icon or as standalone text based on the configuration.
     *
     * @type {string}
     * @default ""
     */
    @Property('')
    public stopContent: string;

    /**
     * Specifies the CSS classes for the icon displayed on the SpeechToText button.
     * This class determines the appearance of the button icon in "start" state.
     *
     * @type {string}
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the CSS classes for the icon displayed when the SpeechToText button is in the "stop" state.
     * This class determines the styling of the button icon in the stop state, allowing for clear visual feedback.
     *
     * @type {string}
     * @default ""
     */
    @Property('')
    public stopIconCss: string;

    /**
     * Specifies the position of the icon relative to the button text content in the SpeechToText component.
     * This property can accept either a string or an IconPosition enum to determine the position of the icon.
     *
     * @type {string | IconPosition}
     * @default "Left"
     */
    @Property('Left')
    public iconPosition: string | IconPosition;

    /**
     * Specifies whether the button should be styled as a primary action button in the SpeechToText component.
     * When set to `true`, the button applies primary styling.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public isPrimary: boolean;
}


/**
 * Configuration settings for tooltip in the SpeechToText component.
 * This allows customization of the tooltip content and its positioning.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * The text displayed when the user hovers over the button while it is in the listening state,
     * showing the start listening option.
     * @type {string}
     * @default 'Start listening'
     */
    @Property('Start listening')
    public content: string;

    /**
     * The text displayed when the user hovers over the button while listening is in progress,
     * and the button shows the stop icon.
     * @type {string}
     * @default 'Stop listening'
     */
    @Property('Stop listening')
    public stopContent: string;

    /**
     * Specifies the position of the tooltip in the UI, indicating where the tooltip should appear.
     *
     * @isenumeration true
     * @asptype TooltipPosition
     * @default 'TopCenter'
     */
    @Property('TopCenter')
    public position: TooltipPosition;
}

/**
 * Enum representing the operational states of the SpeechToText component.
 */
export enum SpeechToTextState {
    /**
     * Specifies the state where the SpeechToText component is inactive and not processing spoken input.
     */
    Inactive = 'Inactive',
    /**
     * Specifies the state where the SpeechToText component is actively listening to spoken input.
     */
    Listening = 'Listening',
    /**
     * Specifies the state where the SpeechToText component has stopped processing spoken input.
     */
    Stopped = 'Stopped'
}

/**
 * Represents the event arguments when a listening is started in the Speech to text component.
 */
export interface StartListeningEventArgs extends BaseEventArgs {
    /**
     * Indicates whether the listening or speech action should be canceled.
     * Setting this to `true` prevents listening.
     *
     * @type {boolean}
     * @default false
     */
    cancel: boolean;

    /**
     * Specifies the event type associated with the start listening action.
     *
     * @type {Event}
     */
    event: Event;

    /**
     * Represents the current state of the component when listening starts.
     *
     * @isenumeration true
     * @asptype SpeechToTextState
     * @default 'Inactive'
     */
    listeningState: SpeechToTextState;

    /**
     * Indicates whether the listening event was triggered by user interaction (`true`)
     * or programmatically (`false`).
     *
     * @type {boolean}
     * @default false
     */
    isInteracted: boolean;
}

/**
 *  Represents the event arguments triggered when listening stops in the SpeechToText component.
 */
export interface StopListeningEventArgs extends BaseEventArgs {
    /**
     * Specifies the event type associated with the stop listening action.
     *
     * @type {Event}
     */
    event: Event;

    /**
     * Represents the current state of the component when listening stops.
     *
     * @isenumeration true
     * @asptype SpeechToTextState
     * @default 'Inactive'
     */
    listeningState: SpeechToTextState;

    /**
     * Indicates whether the listening event was triggered by user interaction (`true`)
     * or programmatically (`false`).
     * @type {boolean}
     * @default false
     */
    isInteracted: boolean;
}

/**
 * Represents the event arguments triggered when a transcript is updated in the SpeechToText component.
 */
export interface TranscriptChangedEventArgs extends BaseEventArgs {
    /**
     * Specifies the event type associated with the transcript been update in the SpeechToText component.
     * Represents the event arguments when a listening is processed in the speech to text component.
     *
     * @type {Event}
     */
    event: Event;

    /**
     * Specifies the transcribed text captured from the speech to text.
     * This property contains the text representation of recorded speech.
     *
     * @type {string}
     * @default ''
     */
    transcript: string;

    /**
     * Specifies whether the recognized speech result is interim or final.
     * Returns `true` when interim results are returned and `false` when it is a final result.
     * The value is determined based on the `allowInterimResults` property.
     *
     * @type {boolean}
     * @default true
     */
    isInterimResult: boolean;
}

/**
 * Represents the event arguments triggered when listening is disabled or exceptions are raised in the SpeechToText component.
 */
export interface ErrorEventArgs extends BaseEventArgs {
    /**
     * Specifies the data provided when an error event is triggered during speech-to-text actions.
     * This property helps identify the specific error event that occurred during listening or speaking,
     * allowing to differentiate between various issues such as microphone access failures,
     * unsupported language models, or network issues.
     *
     * @type {Event}
     */
    event?: Event;

    /**
     * Represents a string describing the error type that occurred during speech-to-text actions.
     * This value indicates what went wrong, such as 'audio-capture' or 'not-allowed', and helps to find
     * the cause of the failure for better troubleshooting.
     *
     * @type {string}
     * @default ''
     */
    error: string;

    /**
     * A message providing further details about the error.
     * This message gives more context or clarification on the error that occurred,
     * helping user to better understand the issue.
     * It could include user-facing messages or more technical error details.
     *
     * @type {string}
     * @default ''
     */
    errorMessage: string;
}

//#endregion

@NotifyPropertyChanges
export class SpeechToText extends Component<HTMLElement> implements INotifyPropertyChanged {

    //#region Public properties

    /**
     * The transcribed text from the speech-to-text process.
     * This property updates dynamically during speech recognition, providing both interim and final results.
     * It can be used to display or process the transcribed speech.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public transcript: string;

    /**
     * The language and locale used for speech recognition.
     * This ensures proper transcription by selecting the correct language model.
     * Common formats: 'en-US' (English, United States), 'es-ES' (Spanish, Spain), 'fr-FR' (French, France).
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public lang: string;

    /**
     * Determines whether interim results should be provided during speech recognition.
     * If true, partial results are delivered in real-time, allowing for a dynamic user experience.
     * If false, only final results will be provided after the recognition process is complete.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public allowInterimResults: boolean;

    /**
     * Determines whether the tooltip should be displayed on hover over the SpeechToText button.
     * If true, the tooltip will be shown to provide additional information about the current state or action.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

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
    @Property('Inactive')
    public listeningState: SpeechToTextState;

    /**
     * Customizes the appearance and functionality of the record button.
     * This allows for customization of button content, icons, and positions.
     * Use it to adjust the button's visual and functional properties according to your needs.
     *
     * @default null
     * @type {ButtonSettingsModel}
     */
    @Complex<ButtonSettingsModel>({}, ButtonSettings)
    public buttonSettings: ButtonSettingsModel;

    /**
     * Defines tooltip content and positioning for guiding user interactions.
     * Tooltip provides helpful instructions or descriptions for button actions, improving user experience.
     *
     * @default null
     * @type {TooltipSettingsModel}
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;

    /**
     * Indicates whether the component is disabled.
     * When true, all interactions with the component (e.g., clicking, listening) are disabled.
     * Useful for preventing user interaction in specific states, such as during processing or error handling.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies additional CSS classes for customizing the component's appearance.
     * Allows applying custom styles to match application requirements
     * This property can be used to extend the component's default style.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Allows additional HTML attributes to be added to the root element of the SpeechToText button.
     * This property accepts a key-value pair format for attributes such as name, aria-label, and others.
     * This helps to make the button more accessible and adaptable to specific requirements.
     *
     * @type {Object}
     * @default null
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Triggered when the SpeechToText component is initialized and ready for interaction.
     * This event indicates that the component is fully loaded and can start processing user input.
     * Use this event to execute initialization logic or show the component's ready state.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggered when speech recognition begins listening for audio input.
     * This event fires when the user starts the speech-to-text process.
     * Use this event to execute logic or display feedback (e.g., a "Listening..." message).
     *
     * @param {StartListeningEventArgs} args - The event arguments containing the state and context information for the start of the listening process.
     * @event onStart
     */
    @Event()
    public onStart: EmitType<StartListeningEventArgs>;

    /**
     * Triggered when speech recognition stops listening for audio input.
     * This event marks the end of the listening session, either due to user action or completion of recognition.
     * Use this event to trigger post-processing logic or indicate that listening has ended (e.g., show "Listening stopped").
     *
     * @param {StopListeningEventArgs} args - The event arguments containing the state and context information for the stop action.
     * @event onStop
     */
    @Event()
    public onStop: EmitType<StopListeningEventArgs>;

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
    @Event()
    public onError: EmitType<ErrorEventArgs>;

    /**
     * Triggered when the transcript is updated during the speech recognition process.
     * This event delivers updated text as the user speaks. It can be used to update the UI with real-time transcription.
     * The event provides both interim and final transcript results, depending on the configuration.
     *
     * @param {TranscriptChangedEventArgs} args - The event arguments containing the latest transcript text.
     * @event transcriptChanged
     */
    @Event()
    public transcriptChanged: EmitType<TranscriptChangedEventArgs>;

    //#endregion

    //#region Inherited methods

    /**
     * Constructor for creating the component
     *
     * @param {SpeechToTextModel} options - Specifies the SpeechToTextModel model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: SpeechToTextModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        if (!this.element.id) { this.element.id = getUniqueID('e-' + this.getModuleName()); }
    }

    protected getDirective(): string {
        return 'EJS-SPEECHTOTEXT';
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'speech-to-text';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    protected render(): void {
        this.renderSpeechToText();
        this.initializeSpeechRecognition();
        if (!isNOU(this.listeningState)) {
            this.handleStateChange();
        }
        this.wireEvents();
    }

    //#endregion

    //#region Private properties

    private recognition: any;
    private micOn: boolean;
    private buttonInst: Button;
    private tooltipInst: Tooltip;
    private fullTranscript: string = '';
    private isClicked: boolean = false;
    private isUserInteracted: boolean = false;
    private hasStarted: boolean = false;
    private l10n: L10n;

    //#endregion

    //#region Private Methods

    private initializeLocale(): void {
        this.l10n = new L10n(this.getModuleName(), {
            abortedError: 'Speech recognition was aborted.',
            audioCaptureError: 'No microphone detected. Ensure your microphone is connected.',
            defaultError: 'An unknown error occurred.',
            networkError: 'Network error occurred. Check your internet connection.',
            noSpeechError: 'No speech detected. Please speak into the microphone.',
            notAllowedError: 'Microphone access denied. Allow microphone permissions.',
            serviceNotAllowedError: 'Speech recognition service is not allowed in this context.',
            unsupportedBrowserError: 'The browser does not support the SpeechRecognition API.',
            startAriaLabel: 'Press to start speaking and transcribe your words',
            stopAriaLabel: 'Press to stop speaking and end transcription',
            startTooltipText: 'Start listening',
            stopTooltipText: 'Stop listening'
        }, this.locale);
    }

    private renderSpeechToText(): void {
        this.initializeLocale();
        const iconCss: string = !isNOU(this.buttonSettings.iconCss) && this.buttonSettings.iconCss !== '' ? this.buttonSettings.iconCss : 'e-icons e-listen-icon';
        this.buttonInst = new Button({
            iconCss: iconCss,
            isPrimary: this.buttonSettings.isPrimary,
            cssClass: this.updateButtonCssClass(),
            disabled: this.disabled,
            content: this.buttonSettings.content,
            iconPosition: this.buttonSettings.iconPosition,
            enableRtl: this.enableRtl
        });
        this.buttonInst.appendTo(this.element);
        this.updateTooltip();
        this.updateCssClass(this.cssClass, '');
        this.updateAriaLabel();
        if (!isNOU(this.htmlAttributes)) { this.addHtmlAttributes(this.htmlAttributes); }
    }

    private updateAriaLabel(): void {
        let ariaLabel: string;
        if (this.htmlAttributes && this.htmlAttributes['aria-label']) {
            ariaLabel = this.htmlAttributes['aria-label'];
        } else {
            ariaLabel = this.micOn ? this.l10n.getConstant('stopAriaLabel') : this.l10n.getConstant('startAriaLabel');
        }
        this.element.setAttribute('aria-label', ariaLabel);
    }

    private updateCssClass(newClass: string, oldClass: string): void {
        if (oldClass) {
            removeClass([this.element], oldClass.trim().split(' '));
        }
        if (newClass) {
            addClass([this.element], newClass.trim().split(' '));
        }
    }

    private updateButtonCssClass(): string {
        const content: string = this.isClicked ? this.buttonSettings.stopContent : this.buttonSettings.content;
        let cssClass: string;
        if (content === '') { cssClass = 'e-round'; }
        if (this.micOn) { cssClass += ' e-listening-state'; }
        return cssClass;
    }

    private updateTooltip(): void {
        if (this.showTooltip) {
            if (this.tooltipSettings) {
                if (this.tooltipSettings.content === 'Start listening') {
                    this.tooltipSettings.content = this.l10n.getConstant('startTooltipText');
                }
                if (this.tooltipSettings.stopContent === 'Stop listening') {
                    this.tooltipSettings.stopContent = this.l10n.getConstant('stopTooltipText');
                }
            }
            this.tooltipInst = new Tooltip({
                content: this.hasStarted ? this.tooltipSettings.stopContent : this.tooltipSettings.content,
                position: this.tooltipSettings.position,
                windowCollision: true,
                cssClass: this.cssClass ? ('e-speech-to-text-tooltip ' + this.cssClass) : 'e-speech-to-text-tooltip',
                opensOn: 'Hover',
                enableRtl: this.enableRtl
            });
            this.tooltipInst.appendTo(this.element);
        }
        else {
            if (!isNOU(this.tooltipInst)) {
                this.tooltipInst.destroy();
                this.tooltipInst = null;
            }
        }
    }

    private handleStateChange(): void {
        if (this.disabled) { return; }
        if (this.listeningState === SpeechToTextState.Listening) {
            this.micOn = true;
            this.startSpeechRecognition();
        }
        else if (this.listeningState === SpeechToTextState.Inactive || this.listeningState === SpeechToTextState.Stopped) {
            if (this.micOn) {
                this.micOn = false;
                this.stopSpeechRecognition();
            } else {
                const prevOnChange: boolean = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                this.listeningState = SpeechToTextState.Inactive;
                this.isProtectedOnChange = prevOnChange;
            }
        }
    }

    private addHtmlAttributes(attrs: { [key: string]: string }): void {
        if (attrs) {
            for (const attr in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
                    this.element.setAttribute(attr, attrs[attr as string]);
                }
            }
        }
    }

    private removeHtmlAttributes(attrs: { [key: string]: string }): void {
        if (attrs) {
            for (const attr in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
                    this.element.removeAttribute(attr);
                }
            }
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.handleButtonClick, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.handleButtonClick);
    }

    private handleButtonClick(event: Event): void {
        this.isUserInteracted = true;
        this.micOn = !this.micOn;
        if (this.micOn) {
            this.startSpeechRecognition(event);
        } else {
            this.stopSpeechRecognition(event);
        }
    }

    private triggerUnSupportedError(): void {
        const eventArgs: ErrorEventArgs = {
            error: 'unsupported-browser',
            errorMessage: this.l10n.getConstant('unsupportedBrowserError')
        };
        this.trigger('onError', eventArgs);
    }

    private initializeSpeechRecognition(): void {
        const windowInst: any = window as any;
        const SpeechRecognition: any = windowInst.SpeechRecognition || windowInst.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.triggerUnSupportedError();
            return;
        }
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = this.lang;
        this.recognition.interimResults = this.allowInterimResults;

        this.recognition.onstart = (event: Event) => {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.transcript = this.fullTranscript = '';
            this.isProtectedOnChange = prevOnChange;
            const eventArgs: StartListeningEventArgs = {
                cancel: false,
                listeningState: SpeechToTextState.Listening,
                event: event,
                isInteracted: this.isUserInteracted
            };
            this.trigger('onStart', eventArgs, () => {
                if (!eventArgs.cancel) {
                    this.handleStartRecognition();
                }
                else {
                    this.recognition.abort();
                    this.micOn = false;
                }
            });
        };

        this.recognition.onend = (event: Event) => {
            if (this.hasStarted) {
                this.micOn = false;
                this.handleStopRecognition(event);
            }
        };

        this.recognition.onerror = (event: any) => {
            let errorMessage: string = '';
            switch (event.error) {
            case 'not-allowed':
                errorMessage = this.l10n.getConstant('notAllowedError');
                break;
            case 'audio-capture':
                errorMessage = this.l10n.getConstant('audioCaptureError');
                break;
            case 'network':
                errorMessage = this.l10n.getConstant('networkError');
                break;
            case 'no-speech':
                errorMessage = this.l10n.getConstant('noSpeechError');
                break;
            case 'aborted':
                errorMessage = this.l10n.getConstant('abortedError');
                break;
            case 'service-not-allowed':
                errorMessage = this.l10n.getConstant('serviceNotAllowedError');
                break;
            default:
                errorMessage = this.l10n.getConstant('defaultError');
            }
            const eventArgs: ErrorEventArgs = {
                event: event,
                error: event.error,
                errorMessage: errorMessage
            };
            this.trigger('onError', eventArgs);
            this.isUserInteracted = false;
        };

        this.recognition.onresult = (event: any) => {
            const result: SpeechRecognitionResult = event.results[event.resultIndex];
            let interimTranscript: string = '';
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            if (result.isFinal)
            {
                this.fullTranscript += result[0].transcript;
                this.transcript = this.fullTranscript;
            } else {
                interimTranscript += result[0].transcript;
                this.transcript = this.fullTranscript + interimTranscript;
            }
            const eventArgs: TranscriptChangedEventArgs = {
                event: event,
                transcript: this.transcript,
                isInterimResult: !result.isFinal
            };
            this.trigger('transcriptChanged', eventArgs, () => {
                if (eventArgs.transcript !== this.transcript) {
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.transcript = this.fullTranscript = eventArgs.transcript;
                    this.isProtectedOnChange = prevOnChange;
                }
            });
            this.isProtectedOnChange = prevOnChange;
        };
    }

    private handleStartRecognition(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.hasStarted = true;
        this.listeningState = SpeechToTextState.Listening;
        if (!isNOU(this.tooltipInst)) { this.tooltipInst.content = this.tooltipSettings.stopContent; }
        this.updateAriaLabel();
        this.isClicked = true;
        this.buttonInst.cssClass = this.updateButtonCssClass();
        this.buttonInst.content = this.buttonSettings.stopContent;
        const iconCss: string = !isNOU(this.buttonSettings.stopIconCss) && this.buttonSettings.stopIconCss !== '' ? this.buttonSettings.stopIconCss : 'e-icons e-listen-stop';
        this.buttonInst.iconCss = iconCss;
        this.isProtectedOnChange = prevOnChange;
    }

    private triggerUnSupportedStart(event: Event): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.transcript = '';
        this.isProtectedOnChange = prevOnChange;
        const eventArgs: StartListeningEventArgs = {
            cancel: false,
            listeningState: SpeechToTextState.Listening,
            event: event,
            isInteracted: this.isUserInteracted
        };
        this.trigger('onStart', eventArgs, () => {
            if (!eventArgs.cancel) {
                this.handleStartRecognition();
            }
        });
    }

    private startSpeechRecognition(event?: Event): void {
        if (this.hasStarted) { return; }
        if (this.recognition) {
            this.recognition.start();
        } else {
            this.triggerUnSupportedStart(event);
        }
    }

    private stopSpeechRecognition(event?: Event): void {
        if (this.recognition) {
            this.recognition.stop();
        } else {
            this.handleStopRecognition(event);
        }
    }

    private handleStopRecognition(event?: Event): void {
        if (!this.hasStarted) { return; } // Ensure onStop is only processed if needed
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.listeningState = SpeechToTextState.Stopped;
        if (!isNOU(this.tooltipInst)) { this.tooltipInst.content = this.tooltipSettings.content; }
        this.updateAriaLabel();
        this.isClicked = false;
        this.buttonInst.cssClass = this.updateButtonCssClass();
        this.buttonInst.content = this.buttonSettings.content;
        const eventArgs: StopListeningEventArgs = {
            listeningState: SpeechToTextState.Stopped,
            event: event,
            isInteracted: this.isUserInteracted
        };
        this.trigger('onStop', eventArgs);
        this.listeningState = SpeechToTextState.Inactive;
        const iconCss: string = !isNOU(this.buttonSettings.iconCss) && this.buttonSettings.iconCss !== '' ? this.buttonSettings.iconCss : 'e-icons e-listen-icon';
        this.buttonInst.iconCss = iconCss;
        this.hasStarted = false;
        this.isProtectedOnChange = prevOnChange;
    }

    private buttonSettingsChanges(oldModel: ButtonSettingsModel, newModel: ButtonSettingsModel): void {
        if (oldModel.content !== newModel.content || oldModel.stopContent !== newModel.stopContent) {
            this.buttonInst.content = this.hasStarted ? this.buttonSettings.stopContent : this.buttonSettings.content;
            this.buttonInst.cssClass = this.updateButtonCssClass();
        }
        if (oldModel.iconCss !== newModel.iconCss || oldModel.stopIconCss !== newModel.stopIconCss) {
            const iconCss: string = !isNOU(this.buttonSettings.iconCss) && this.buttonSettings.iconCss !== '' ? this.buttonSettings.iconCss : 'e-icons e-listen-icon';
            const stopIconCss: string = !isNOU(this.buttonSettings.stopIconCss) && this.buttonSettings.stopIconCss !== '' ? this.buttonSettings.stopIconCss : 'e-icons e-listen-stop';
            this.buttonInst.iconCss = this.hasStarted ? stopIconCss : iconCss;
        }
        if (oldModel.iconPosition !== newModel.iconPosition) {
            this.buttonInst.iconPosition = this.buttonSettings.iconPosition;
        }
        if (oldModel.isPrimary !== newModel.isPrimary) {
            this.buttonInst.isPrimary = this.buttonSettings.isPrimary;
        }
    }

    private destroyAndNullify(obj: any): void {
        if (obj) {
            obj.destroy();
            obj = null;
        }
    }

    //#endregion

    //#region Public Methods

    /**
     * Destroy the SpeechToText.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        this.unWireEvents();

        this.destroyAndNullify(this.buttonInst);
        this.destroyAndNullify(this.tooltipInst);

        this.recognition = null;
        this.micOn = null;

        this.htmlAttributes = this.tooltipSettings = this.buttonSettings = null;
        this.element.classList.remove('e-rtl');
    }

    /**
     * Begins the audio capture process by listening to the user's microphone input.
     * This method initiates the speech-to-text process and continuously updates the `transcript` property with interim and final recognition results.
     *
     * @returns {void} No return value.
     */
    public startListening(): void {
        if (!this.disabled && !this.isClicked) {
            this.isUserInteracted = false;
            this.micOn = true;
            this.startSpeechRecognition();
        }
    }

    /**
     * Stops the audio capture process and finalizes the speech recognition.
     * This method ends the ongoing speech-to-text operation and completes the recognition process, storing the final transcription.
     * It is typically called to stop listening when the user is finished speaking.
     *
     * @returns {void} No return value.
     */
    public stopListening(): void {
        if (!this.disabled && this.isClicked) {
            this.isUserInteracted = false;
            this.micOn = false;
            this.stopSpeechRecognition();
        }
    }

    /**
     * Called if any of the property value is changed.
     *
     * @param  {SpeechToTextModel} newProp - Specifies new properties
     * @param  {SpeechToTextModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: SpeechToTextModel, oldProp?: SpeechToTextModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'lang':
                if (this.recognition) { this.recognition.lang = this.lang; }
                break;
            case 'allowInterimResults':
                if (this.recognition) { this.recognition.interimResults = this.allowInterimResults; }
                break;
            case 'buttonSettings':
                this.buttonSettingsChanges(oldProp.buttonSettings, newProp.buttonSettings);
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'disabled':
                this.buttonInst.disabled = this.disabled;
                this.handleStateChange();
                break;
            case 'htmlAttributes':
                this.removeHtmlAttributes(oldProp.htmlAttributes);
                this.addHtmlAttributes(newProp.htmlAttributes);
                break;
            case 'listeningState':
                this.handleStateChange();
                break;
            case 'tooltipSettings':
            case 'showTooltip':
                this.updateTooltip();
                break;
            case 'transcript':
                this.transcript = this.fullTranscript = newProp.transcript;
                break;
            case 'enableRtl':
                this.buttonInst.enableRtl = this.tooltipInst.enableRtl = this.enableRtl;
                break;
            case 'locale':
                this.l10n.setLocale(this.locale);
                this.updateAriaLabel();
                this.updateTooltip();
                break;
            }
        }
    }
    //#endregion
}
