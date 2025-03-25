import { createElement, L10n, remove } from "@syncfusion/ej2-base";
import { ErrorEventArgs, SpeechToText, SpeechToTextState, StartListeningEventArgs } from "../src/speech-to-text/index";

describe('SpeechToText Component', () => {

    let sttObject: SpeechToText;
    let sttElement: HTMLButtonElement;

    beforeEach(() => {
        sttElement = createElement('button', { id: 'speechtotext' }) as HTMLButtonElement;
        document.body.appendChild(sttElement);
    });

    afterEach(() => {
        if (sttObject) {
            sttObject.destroy();
            sttObject = null;
        }
        remove(sttElement);
    });

    describe('DOM and Properties', () => {

        it('should initialize with default properties', () => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
            expect(sttElement.classList.contains('e-round')).toBe(true);

            // Check default values
            expect(sttObject.lang).toEqual('');
            expect(sttObject.listeningState).toEqual(SpeechToTextState.Inactive);
            expect(sttObject.transcript).toEqual('');
            expect(sttObject.disabled).toBe(false);
        });

        it('should initialize with customized properties', () => {
            const tooltipContent = 'Click to start recording';
            sttObject = new SpeechToText({
                tooltipSettings: { content: tooltipContent },
                buttonSettings: { content: 'Start' },
                lang: 'fr-FR',
                disabled: false
            });

            sttObject.appendTo('#speechtotext');

            // Verifying the customized properties
            expect(sttObject.lang).toEqual('fr-FR');
            expect(sttObject.disabled).toBe(false);

            expect(sttElement.textContent).toEqual('Start');
            (sttObject as any).tooltipInst.open();
            const tooltipId = sttElement.getAttribute('data-tooltip-id');
            expect(document.getElementById(tooltipId).textContent).toBe('Click to start recording');
        });

        it('should apply HTML attributes to root element', () => {
            sttObject = new SpeechToText({ htmlAttributes: { 'role': 'button', 'aria-label': 'speech-to-text' } });
            sttObject.appendTo('#speechtotext');
        
            expect(sttElement.getAttribute('role')).toBe('button');
            expect(sttElement.getAttribute('aria-label')).toBe('speech-to-text');
        });

        it('should apply initial cssClass properly', () => {
            sttObject = new SpeechToText({ cssClass: 'custom-class' });
            sttObject.appendTo('#speechtotext');
            expect(sttElement.classList.contains('custom-class')).toBe(true);
            // Checking the default icon class applied
            const buttonIcon = sttElement.querySelector('.e-icons.e-listen-icon');
            expect(buttonIcon).not.toBeNull();
            // Since e-round is a default button style, ensure it is handled alongside the custom-class if relevant
            if ((sttObject as any).buttonInst.cssClass.includes('e-round')) {
                expect(sttElement.classList.contains('e-round')).toBe(true);
            }
        });

        it('should apply RTL class when enableRtl is true', () => {
            sttObject = new SpeechToText({ enableRtl: true });
            sttObject.appendTo('#speechtotext');
            // Check if RTL related classes are applied
            expect(sttElement.classList.contains('e-rtl')).toBe(true);
            expect((sttObject as any).buttonInst.enableRtl).toBe(true);
            expect((sttObject as any).tooltipInst.enableRtl).toBe(true);
        });

        it('should initialize with default aria-label when listening is not active', () => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');

            expect(sttElement.getAttribute('aria-label')).toBe('Press to start speaking and transcribe your words');
        });

        it('should update aria-label to stop label when speech recognition starts', (done) => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
            sttObject.startListening();

            setTimeout(() => {
                if ((sttObject as any).recognition.onstart) {
                    (sttObject as any).recognition.onstart(new Event('start'));
                }
                expect(sttElement.getAttribute('aria-label')).toBe('Press to stop speaking and end transcription');
                done();
            });
        });

        it('should revert aria-label to start label after speech recognition stops', (done) => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
            sttObject.startListening();

            setTimeout(() => {
                if ((sttObject as any).recognition.onstart) {
                    (sttObject as any).recognition.onstart(new Event('start'));
                }

                if ((sttObject as any).recognition.onend) {
                    (sttObject as any).recognition.onend(new Event('end'));
                }

                setTimeout(() => {
                    expect(sttElement.getAttribute('aria-label')).toBe('Press to start speaking and transcribe your words');
                    done();
                });
            });
        });

        it('should preserve custom aria-label when provided via htmlAttributes', () => {
            sttObject = new SpeechToText({
                htmlAttributes: { 'aria-label': 'custom aria label' }
            });
            sttObject.appendTo('#speechtotext');

            expect(sttElement.getAttribute('aria-label')).toBe('custom aria label');
        });

        it('should apply default CSS class to tooltipInst if showTooltip is true', () => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');

            if (sttObject.showTooltip) {
                expect((sttObject as any).tooltipInst.cssClass).toContain('e-speech-to-text-tooltip');
            }
        });
    });

    describe('Event Handling and State Management', () => {

        it('should trigger onStart event when recording starts', () => {
            sttObject = new SpeechToText({
                onStart: (args) => {
                    expect(args.listeningState).toBe(SpeechToTextState.Listening);
                }
            });
            sttObject.appendTo('#speechtotext');

            // Simulating button click to start recording
            sttElement.click();
        });

        it('should trigger onStop event when recording stops', () => {
            sttObject = new SpeechToText({
                listeningState: SpeechToTextState.Listening,
                onStop: (args) => {
                    expect(args.listeningState).toBe(SpeechToTextState.Stopped);
                }
            });
            sttObject.appendTo('#speechtotext');

            // Simulating button click to stop recording
            sttElement.click();
        });

        it('should update transcript when speech is recognized', () => {
            sttObject = new SpeechToText({
                transcriptChanged: (args) => {
                    expect(args.transcript).toBe('test');
                }
            });
            sttObject.appendTo('#speechtotext');

            // Simulating speech recognition
            (sttObject as any).recognition.onresult({ results: [{ isFinal: true, 0: { transcript: 'test' }}], resultIndex: 0 });
        });

        it('should update transcript when speech is recognized', () => {
            const newTranscript = 'This is a test transcript.';
            sttObject = new SpeechToText({
                transcriptChanged: (args) => {
                    expect(args.transcript).toBe('test');
                    args.transcript = newTranscript;
                }
            });
            sttObject.appendTo('#speechtotext');
            (sttObject as any).recognition.onresult({ results: [{ isFinal: true, 0: { transcript: 'test' }}], resultIndex: 0 });
            expect(sttObject.transcript).toBe(newTranscript);
        });
    });

    describe('Methods', () => {

        it('should get persist data', () => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
            const persistData = (sttObject as any).getPersistData();
            expect(persistData).toBe('{}'); // Assuming no properties are marked for persistence
        });

        it('should get directive', () => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
            const directive = (sttObject as any).getDirective();  // Access protected method
            expect(directive).toBe('EJS-SPEECHTOTEXT');
        });

        it('should handle interim results during speech recognition', () => {
            sttObject = new SpeechToText({
                transcriptChanged: (args) => {
                    expect(args.transcript).toBe('interim test');
                }
            });
            sttObject.appendTo('#speechtotext');
            // Simulating an interim result from speech recognition
            (sttObject as any).recognition.onresult({ results: [{ isFinal: false, 0: { transcript: 'interim test' }}], resultIndex: 0 });
        });
    });

    describe('Dynamic Properties Changes', () => {

        beforeEach(() => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
        });

        it('should update the language dynamically', () => {
            // Initial language
            expect(sttObject.lang).toBe('');

            // Change language
            sttObject.lang = 'es-ES';
            sttObject.dataBind();
            expect(sttObject['recognition'].lang).toBe('es-ES');
        });

        it('should update disabled state dynamically', (done) => {
            // Initially enabled
            expect(sttObject.disabled).toBe(false);
            expect(sttElement.disabled).toBe(false);

            // Disable the component
            sttObject.disabled = true;
            sttObject.dataBind();
            setTimeout(() => {
                expect(sttObject.disabled).toBe(true);
                expect(sttElement.disabled).toBe(true);

                // Re-enable the component
                sttObject.disabled = false;
                sttObject.dataBind();
                setTimeout(() => {
                    expect(sttObject.disabled).toBe(false);
                    expect(sttElement.disabled).toBe(false);
                    done();
                });
            });
        });
    
        it('should update button content dynamically', (done) => {
            // Initial button content
            expect(sttElement.textContent).toBe('');

            // Change button content
            sttObject.buttonSettings.content = 'Record';
            sttObject.dataBind();
            setTimeout(() => {
                expect(sttElement.textContent).toContain('Record');

                // Change button content again
                sttObject.buttonSettings.content = 'Speak';
                sttObject.dataBind();
                setTimeout(() => {
                    expect(sttElement.textContent).toContain('Speak');
                    done();
                });
            });
        });

        it('should update the icon position dynamically', (done) => {
            // Initially set iconPosition to 'Left'
            sttObject = new SpeechToText({
                buttonSettings: {
                    iconPosition: 'Left'
                }
            });
            sttObject.appendTo('#speechtotext');
            expect((sttObject as any).buttonInst.iconPosition).toBe('Left');
            sttObject.buttonSettings.iconPosition = 'Right';
            sttObject.dataBind();
            setTimeout(() => {
                expect((sttObject as any).buttonInst.iconPosition).toBe('Right');
                sttObject.buttonSettings.iconPosition = 'Top';
                sttObject.dataBind();
                setTimeout(() => {
                    expect((sttObject as any).buttonInst.iconPosition).toBe('Top');
                    done();
                });
            });
        });

        it('should update icon dynamically via buttonSettings', (done) => {
            sttObject = new SpeechToText({
                buttonSettings: { iconCss: 'e-record-icon' }
            });
            sttObject.appendTo('#speechtotext');

            // Initial icon setup
            expect(sttElement.querySelector('.e-record-icon')).not.toBeNull();

            // Update icon dynamically
            sttObject.buttonSettings.iconCss = 'e-new-record-icon';
            sttObject.dataBind();
            setTimeout(() => {
                expect(sttElement.querySelector('.e-new-record-icon')).not.toBeNull();
                done();
            });
        });

        it('should update tooltip content dynamically', (done) => {
            // Initial tooltip content
            expect(sttObject.tooltipSettings.content).toBe('Start listening');
            // Change tooltip content
            sttObject.tooltipSettings.content = 'Start Listening';
            sttObject.dataBind();
            // Simulate starting the speech recognition
            sttObject.startListening();
            (sttObject as any).recognition.onstart(new Event('start'));
            // Change tooltip to reflect listening state
            sttObject.tooltipSettings.stopContent = 'Stop Speaking';
            sttObject.dataBind();
            // Ensure the component has entered the 'Listening' state
            expect(sttObject.listeningState).toBe(SpeechToTextState.Listening);
            // Open the tooltip to check updated content
            (sttObject as any).tooltipInst.open();
            const tooltipId = sttElement.getAttribute('data-tooltip-id');
            setTimeout(() => {
                expect(document.getElementById(tooltipId).textContent).toBe('Stop Speaking');
                done();
            }, 200);
        });

        it('should properly remove HTML attributes', () => {
            sttObject = new SpeechToText({ htmlAttributes: { 'role': 'button', 'aria-label': 'speech-to-text' } });
            sttObject.appendTo('#speechtotext');
            expect(sttElement.getAttribute('role')).toBe('button');
            expect(sttElement.getAttribute('aria-label')).toBe('speech-to-text');
            // Remove all HTML attributes
            sttObject.htmlAttributes = {};
            sttObject.dataBind();
            expect(sttElement.hasAttribute('role')).toBe(false);
            expect(sttElement.hasAttribute('aria-label')).toBe(false);
        });

        it('should not instantiate tooltip when showTooltip is initially false', () => {
            sttObject = new SpeechToText({ showTooltip: false });
            sttObject.appendTo('#speechtotext');

            expect(sttObject['tooltipInst']).toBeUndefined();
        });

        it('should create and destroy tooltip as showTooltip changes', () => {
            // Initial state (default is true, so tooltip should be present)
            expect(sttObject['tooltipInst']).not.toBeNull();

            // Change to false, tooltip should be destroyed
            sttObject.showTooltip = false;
            sttObject.dataBind();
            expect(sttObject['tooltipInst']).toBeNull();

            // Change back to true, tooltip should be instantiated
            sttObject.showTooltip = true;
            sttObject.dataBind();
            expect(sttObject['tooltipInst']).not.toBeNull();
        });

        it('should add and remove HTML attributes as expected', () => {
            sttObject = new SpeechToText({ htmlAttributes: { 'role': 'button', 'data-test': 'example' } });
            sttObject.appendTo('#speechtotext');

            // Verify attributes are set
            expect(sttElement.getAttribute('role')).toBe('button');
            expect(sttElement.getAttribute('data-test')).toBe('example');

            // Change attributes dynamically
            sttObject.htmlAttributes = { 'role': 'presentation', 'aria-live': 'polite' };
            sttObject.dataBind();

            // Verify old attributes removed and new ones set
            expect(sttElement.getAttribute('role')).toBe('presentation');
            expect(sttElement.hasAttribute('data-test')).toBe(false);
            expect(sttElement.getAttribute('aria-live')).toBe('polite');
        });

        it('should update and handle state property dynamically', () => {
            // Initial condition where the state should be inactive
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive);
            // Change state to Listening, simulate starting action
            sttObject.listeningState = SpeechToTextState.Listening;
            sttObject.dataBind();
            // Simulate the recognition start event
            if ((sttObject as any).recognition.onstart) {
                (sttObject as any).recognition.onstart(new Event('start'));
            }
            expect(sttObject.listeningState).toBe(SpeechToTextState.Listening); // Should reflect the listening state
            // Change state to Stopped, simulate stopping action
            sttObject.listeningState = SpeechToTextState.Stopped;
            sttObject.dataBind();
            // Simulate the recognition end event
            if ((sttObject as any).recognition.onend) {
                (sttObject as any).recognition.onend(new Event('end'));
            }
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive); // Should revert to inactive
        });

        it('should update cssClass dynamically', () => {
            // Initial cssClass
            expect(sttElement.classList.contains('custom-class')).toBe(false);

            // Change cssClass
            sttObject.cssClass = 'custom-class';
            sttObject.dataBind();
            expect(sttElement.classList.contains('custom-class')).toBe(true);

            // Change cssClass again
            sttObject.cssClass = 'new-class';
            sttObject.dataBind();
            expect(sttElement.classList.contains('custom-class')).toBe(false);
            expect(sttElement.classList.contains('new-class')).toBe(true);
        });

        it('should manage multiple cssClasses dynamically', () => {
            // Set initial multiple classes
            sttObject.cssClass = 'first-class second-class';
            sttObject.dataBind();
            expect(sttElement.classList.contains('first-class')).toBe(true);
            expect(sttElement.classList.contains('second-class')).toBe(true);

            // Update to another set of multiple classes
            sttObject.cssClass = 'third-class fourth-class';
            sttObject.dataBind();
            expect(sttElement.classList.contains('first-class')).toBe(false);
            expect(sttElement.classList.contains('second-class')).toBe(false);
            expect(sttElement.classList.contains('third-class')).toBe(true);
            expect(sttElement.classList.contains('fourth-class')).toBe(true);
        });

        it('should update allowInterimResults dynamically', () => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');
            expect(sttObject.allowInterimResults).toBe(true);
            expect(sttObject['recognition'].interimResults).toBe(true);

            sttObject.allowInterimResults = false;
            sttObject.dataBind();
            expect(sttObject.allowInterimResults).toBe(false);
            expect(sttObject['recognition'].interimResults).toBe(false);

            sttObject.allowInterimResults = true;
            sttObject.dataBind();
            expect(sttObject.allowInterimResults).toBe(true);
            expect(sttObject['recognition'].interimResults).toBe(true);
        });

        it('should apply primary styling when isPrimary is true', () => {
            sttObject = new SpeechToText({
                buttonSettings: { isPrimary: true }
            });
            sttObject.appendTo('#speechtotext');
            expect(sttElement.classList.contains('e-primary')).toBe(true);
        });

        it('should update primary styling dynamically', (done) => {
            sttObject = new SpeechToText({
                buttonSettings: { isPrimary: true }
            });
            sttObject.appendTo('#speechtotext');
            expect(sttElement.classList.contains('e-primary')).toBe(true);
            sttObject.buttonSettings.isPrimary = false;
            sttObject.dataBind();
            setTimeout(() => {
                expect(sttElement.classList.contains('e-primary')).toBe(false);
                sttObject.buttonSettings.isPrimary = true;
                sttObject.dataBind();
                setTimeout(() => {
                    expect(sttElement.classList.contains('e-primary')).toBe(true);
                    done();
                });
            });
        });

        it('should update the transcript property dynamically', () => {
            const initialTranscript = 'Initial transcript';
            const updatedTranscript = 'Updated transcript';
            expect(sttObject.transcript).toBe('');
            sttObject.transcript = initialTranscript;
            sttObject.dataBind();
            expect(sttObject.transcript).toBe(initialTranscript);
            sttObject.transcript = updatedTranscript;
            sttObject.dataBind();
            expect(sttObject.transcript).toBe(updatedTranscript);
        });

        it('should toggle RTL dynamically', (done) => {
            sttObject = new SpeechToText({ enableRtl: false });
            sttObject.appendTo('#speechtotext');

            // Initial check for RTL classes
            expect(sttElement.classList.contains('e-rtl')).toBe(false);
            expect((sttObject as any).buttonInst.enableRtl).toBe(false);
            expect((sttObject as any).tooltipInst.enableRtl).toBe(false);
            sttObject.enableRtl = true;
            sttObject.dataBind();
            setTimeout(() => {
                expect(sttElement.classList.contains('e-rtl')).toBe(true);
                expect((sttObject as any).buttonInst.enableRtl).toBe(true);
                expect((sttObject as any).tooltipInst.enableRtl).toBe(true);
    
                // Change back to LTR
                sttObject.enableRtl = false;
                sttObject.dataBind();
                setTimeout(() => {
                    expect(sttElement.classList.contains('e-rtl')).toBe(false);
                    expect((sttObject as any).buttonInst.enableRtl).toBe(false);
                    expect((sttObject as any).tooltipInst.enableRtl).toBe(false);
                    done();
                });
            });
        });

        it('should apply CSS class dynamically to tooltipInst', (done) => {
            sttObject = new SpeechToText({ cssClass: 'initial-class' });
            sttObject.appendTo('#speechtotext');
            setTimeout(() => {
                expect((sttObject as any).tooltipInst.element.classList).toContain('initial-class');

                // Change the CSS class dynamically
                sttObject.cssClass = 'updated-class';
                sttObject.dataBind();

                setTimeout(() => {
                    expect((sttObject as any).tooltipInst.element.classList).toContain('updated-class');
                    expect((sttObject as any).tooltipInst.element.classList).not.toContain('initial-class');
                    done();
                });
            });
        });
    });

    describe('Browser Compatibility', () => {

        beforeEach(() => {
            // Mock user agent to simulate an unsupported browser
            Object.defineProperty(window.navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/92.0',
                writable: true,
                configurable: true
            });
        });

        afterEach(() => {
            // Restore the original userAgent property after each test to prevent affecting other tests
            Object.defineProperty(window.navigator, 'userAgent', {
                value: originalUserAgent,
                writable: true,
                configurable: true
            });
        });
        const originalUserAgent = window.navigator.userAgent;
        it('should trigger error for unsupported browsers due to unavailable SpeechRecognition API', () => {
            const onErrorHandler = jasmine.createSpy('onErrorHandler');
            // Remove SpeechRecognition to simulate unsupported browser
            (window as any).SpeechRecognition = undefined;
            (window as any).webkitSpeechRecognition = undefined;
            sttObject = new SpeechToText({
                onError: onErrorHandler
            });
            sttObject.appendTo('#speechtotext');

            // Attempt to start speech recognition
            sttObject.startListening();

            // Check that the error handler is called with the correct error message
            expect(onErrorHandler).toHaveBeenCalled();
            expect(onErrorHandler.calls.first().args[0].error).toBe('unsupported-browser');
            expect(onErrorHandler.calls.first().args[0].errorMessage).toBe('The browser does not support the SpeechRecognition API.');
        });
    });
    describe('Start and Stop Functionality', () => {
        let originalSpeechRecognition: any;
        let recognitionMock: any;

        beforeAll(() => {
            // Mock the SpeechRecognition API
            originalSpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionMock = {
                start: jasmine.createSpy('start'),
                stop: jasmine.createSpy('stop'),
                onstart: null,
                onend: null,
                onerror: null,
                onresult: null
            };

            (window as any).SpeechRecognition = jasmine.createSpy('SpeechRecognition').and.returnValue(recognitionMock);
            (window as any).webkitSpeechRecognition = (window as any).SpeechRecognition;
        });

        afterAll(() => {
            // Restore the original SpeechRecognition API
            (window as any).SpeechRecognition = originalSpeechRecognition;
            (window as any).webkitSpeechRecognition = originalSpeechRecognition;
        });

        it('should start listening and trigger the appropriate events', () => {
            const onStartSpy = jasmine.createSpy('onStart');
            sttObject = new SpeechToText({
                onStart: onStartSpy,
            });
            sttObject.appendTo('#speechtotext');

            // Initially inactive
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive);

            // Start listening
            sttObject.startListening();
            expect((sttObject as any).micOn).toBe(true);

            // Simulate audio start event
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }
            expect(onStartSpy).toHaveBeenCalled();
            expect(sttObject.listeningState).toBe(SpeechToTextState.Listening);
        });

        it('should stop listening and trigger the appropriate events', () => {
            const onStopSpy = jasmine.createSpy('onStop');
            sttObject = new SpeechToText({
                onStop: onStopSpy,
                listeningState: SpeechToTextState.Listening
            });
            sttObject.appendTo('#speechtotext');
            // Simulate the component is already listening by calling onstart
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }

            // Now simulate a button click for user interaction to stop
            sttElement.click();
            // Simulate audio end event
            if (recognitionMock.onend) {
                recognitionMock.onend(new Event('end'));
            }
            expect((sttObject as any).micOn).toBe(false);
            expect(onStopSpy).toHaveBeenCalled();
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive);
        });
        
        it('should trigger relevant methods on state change', () => {
            let listentingStarted = false;
            let listentingStopped = false;
            sttObject = new SpeechToText({
                onStart: () => {
                    listentingStarted = true;
                    listentingStopped = false;
                },
                onStop: () => {
                    listentingStopped = true;
                    listentingStarted = false;
                }
            });
            sttObject.appendTo('#speechtotext');

            // Change state to trigger startListening
            sttObject.listeningState = SpeechToTextState.Listening;
            sttObject.dataBind();

            // Simulate audio start event
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }
            expect(listentingStarted).toBe(true);
            expect(listentingStopped).toBe(false);

            // Change state to trigger stopListening
            sttObject.listeningState = SpeechToTextState.Stopped;
            sttObject.dataBind();
            // Simulate audio end event
            if (recognitionMock.onend) {
                recognitionMock.onend(new Event('end'));
            }
            expect(listentingStarted).toBe(false);
            expect(listentingStopped).toBe(true);
        });
        
        it('should update stop icon dynamically via buttonSettings', (done) => {
            sttObject = new SpeechToText({
                buttonSettings: { stopIconCss: 'e-stop-icon' }
            });
            sttObject.appendTo('#speechtotext');

            // Initial icon setup
            expect(sttElement.querySelector('.e-stop-icon')).toBeNull();

            sttObject.startListening();
            // Simulate audio start event
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }
            setTimeout(() => {
                expect(sttElement.querySelector('.e-stop-icon')).not.toBeNull();
                // Update icon dynamically
                sttObject.buttonSettings.stopIconCss = 'e-new-stop-icon';
                sttObject.dataBind();
                setTimeout(() => {
                    expect(sttElement.querySelector('.e-new-stop-icon')).not.toBeNull();
                    done();
                });
            });
        });

        it('should stop the recognition and update state', () => {
            const onStopSpy = jasmine.createSpy('onStop');
            sttObject = new SpeechToText({ onStop: onStopSpy });
            sttObject.appendTo('#speechtotext');
            // Simulate clicking the button to start listening
            sttElement.click(); // This sets isUserInteracted to true and starts the recognition

            // Simulate the start event to ensure hasStarted becomes true
            if ((sttObject as any).recognition.onstart) {
                (sttObject as any).recognition.onstart(new Event('start'));
            }

            sttObject.stopListening();

            // Simulate the audio end event
            if ((sttObject as any).recognition.onend) {
                (sttObject as any).recognition.onend(new Event('end'));
            }

            // Assertions
            expect((sttObject as any).micOn).toBe(false);
            expect(onStopSpy).toHaveBeenCalled();
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive);
        });

        it('should set isInteracted to true for user-triggered startListening', () => {
            const onStartSpy = jasmine.createSpy('onStartSpy');
            sttObject = new SpeechToText({
                onStart: onStartSpy
            });
            sttObject.appendTo('#speechtotext');

            // Simulating a button click for user interaction
            sttElement.click();
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }

            expect(onStartSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                isInteracted: true // Check if isInteracted is true for click-based start
            }));
        });

        it('should set isInteracted to false for programmatic startListening', () => {
            const onStartSpy = jasmine.createSpy('onStartSpy');

            sttObject = new SpeechToText({
                onStart: onStartSpy
            });
            sttObject.appendTo('#speechtotext');
            // Call startListening programmatically
            sttObject.startListening();

            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }

            expect(onStartSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                isInteracted: false // Check if isInteracted is false for programmatic start
            }));
        });

        it('should set isInteracted to true for user-triggered stopListening', () => {
            const onStopSpy = jasmine.createSpy('onStopSpy');
            sttObject = new SpeechToText({
                onStop: onStopSpy,
                listeningState: SpeechToTextState.Listening
            });
            sttObject.appendTo('#speechtotext');
            // Simulate the start process to enable a proper stop
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }
            // Simulating a button click for user interaction to stop
            sttElement.click();
            // Simulate the end event
            if (recognitionMock.onend) {
                recognitionMock.onend(new Event('end'));
            }
            expect(onStopSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                isInteracted: true // Ensuring it's marked as user interaction
            }));
            // Ensure micOn status and listening state are updated appropriately
            expect((sttObject as any).micOn).toBe(false);
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive);
        });
        it('should set isInteracted to false for programmatic stopListening', () => {
            const onStopSpy = jasmine.createSpy('onStopSpy');
            sttObject = new SpeechToText({
                onStop: onStopSpy,
                listeningState: SpeechToTextState.Listening
            });
            sttObject.appendTo('#speechtotext');
            if (recognitionMock.onstart) {
                recognitionMock.onstart(new Event('start'));
            }
            (sttObject as any).isClicked = true;
            sttObject.stopListening();
            if (recognitionMock.onend) {
                recognitionMock.onend(new Event('end'));
            }
            expect(onStopSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                isInteracted: false
            }));
            expect((sttObject as any).micOn).toBe(false);
            expect(sttObject.listeningState).toBe(SpeechToTextState.Inactive);
        });
    });

    describe('Error Handling', () => {
        let onErrorSpy: jasmine.Spy;
        let recognitionMock: any;

        beforeEach(() => {
            // Mock the SpeechRecognition API
            recognitionMock = {
                start: jasmine.createSpy('start'),
                stop: jasmine.createSpy('stop'),
                onstart: null,
                onend: null,
                onerror: null,
                onresult: null
            };

            (window as any).SpeechRecognition = jasmine.createSpy('SpeechRecognition').and.returnValue(recognitionMock);
            (window as any).webkitSpeechRecognition = jasmine.createSpy('webkitSpeechRecognition').and.returnValue(recognitionMock);

            // Initialize SpeechToText component with onError event spy
            sttObject = new SpeechToText({
                onError: onErrorSpy = jasmine.createSpy('onErrorHandler')
            });
            sttObject.appendTo('#speechtotext');
        });

        afterEach(() => {
            if (sttObject) {
                sttObject.destroy();
                sttObject = null;
            }
            (window as any).SpeechRecognition = undefined;
            (window as any).webkitSpeechRecognition = undefined;
        });

        it('should handle not-allowed error', () => {
            const errorEvent = { error: 'not-allowed', message: 'Microphone access was denied' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }
            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'not-allowed',
                errorMessage: 'Microphone access denied. Allow microphone permissions.'
            }));
        });

        it('should handle audio-capture error', () => {
            const errorEvent = { error: 'audio-capture', message: 'Audio capture failed' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'audio-capture',
                errorMessage: 'No microphone detected. Ensure your microphone is connected.'
            }));
        });

        it('should handle network error', () => {
            const errorEvent = { error: 'network', message: 'Network error' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'network',
                errorMessage: 'Network error occurred. Check your internet connection.'
            }));
        });

        it('should handle no-speech error', () => {
            const errorEvent = { error: 'no-speech', message: 'No speech detected' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'no-speech',
                errorMessage: 'No speech detected. Please speak into the microphone.'
            }));
        });

        it('should handle aborted error', () => {
            const errorEvent = { error: 'aborted', message: 'Recognition process aborted' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'aborted',
                errorMessage: 'Speech recognition was aborted.'
            }));
        });

        it('should handle unknown errors', () => {
            const errorEvent = { error: 'unknown', message: 'Unknown error' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'unknown',
                errorMessage: 'An unknown error occurred.'
            }));
        });

        it('should handle service-not-allowed error', () => {
            const errorEvent = { error: 'service-not-allowed', message: 'Speech recognition service is not allowed' };

            if (recognitionMock.onerror) {
                recognitionMock.onerror(errorEvent);
            }

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'service-not-allowed',
                errorMessage: 'Speech recognition service is not allowed in this context.'
            }));
        });

        it('should handle unsupported-browser error', () => {
            // Simulate unsupported browser by not defining SpeechRecognition API
            (window as any).SpeechRecognition = undefined;
            (window as any).webkitSpeechRecognition = undefined;

            sttObject.destroy();  // Clean up the existing instance
            sttObject = new SpeechToText({
                onError: onErrorSpy
            });
            sttObject.appendTo('#speechtotext');
            // Attempt to start speech recognition
            sttObject.startListening();

            expect(onErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                error: 'unsupported-browser',
                errorMessage: 'The browser does not support the SpeechRecognition API.'
            }));
        });
    });

    describe('Locale Handling', () => {

        beforeEach(() => {
            L10n.load({
                'de-DE': {
                    'speech-to-text': {
                        'abortedError': 'Die Spracherkennung wurde abgebrochen.',
                        'audioCaptureError': 'Kein Mikrofon erkannt. Stellen Sie sicher, dass Ihr Mikrofon angeschlossen ist.',
                        'defaultError': 'Ein unbekannter Fehler ist aufgetreten.',
                        'networkError': 'Netzwerkfehler aufgetreten. Überprüfen Sie Ihre Internetverbindung.',
                        'noSpeechError': 'Keine Sprache erkannt. Bitte sprechen Sie ins Mikrofon.',
                        'notAllowedError': 'Mikrofonzugriff verweigert. Erlauben Sie Mikrofonberechtigungen.',
                        'serviceNotAllowedError': 'Der Spracherkennungsdienst ist in diesem Kontext nicht erlaubt.',
                        'startAriaLabel': 'Stimmeingabe beginnen',
                        'stopAriaLabel': 'Stimmeingabe beenden',
                        'startTooltipText': 'Hören starten',
                        'stopTooltipText': 'Hören stoppen',
                        'unsupportedBrowserError': 'Der Browser unterstützt die SpeechRecognition-API nicht.'
                    }
                }
            });
        });

        it('should respect German locale settings for aria-label and tooltips', (done) => {
            sttObject = new SpeechToText({ locale: 'de-DE' });
            sttObject.appendTo('#speechtotext');

            // Check localized aria-label for start
            expect(sttElement.getAttribute('aria-label')).toBe('Stimmeingabe beginnen');

            // Start listening and confirm localized aria-label for stop
            sttObject.startListening();
            setTimeout(() => {
                expect(sttElement.getAttribute('aria-label')).toBe('Stimmeingabe beenden');

                // Stop and confirm the label resets to start
                sttObject.stopListening();
                setTimeout(() => {
                    expect(sttElement.getAttribute('aria-label')).toBe('Stimmeingabe beginnen');
                    done();
                }, 100);
            }, 100);
        });

        it('should apply localization when locale is dynamically changed', (done) => {
            sttObject = new SpeechToText();
            sttObject.appendTo('#speechtotext');

            // Alter locale dynamically to German
            sttObject.locale = 'de-DE';
            sttObject.dataBind();

            // Verify localized text after dynamic locale change
            expect(sttElement.getAttribute('aria-label')).toBe('Stimmeingabe beginnen');

            // Start Listening and check label updates for stop state
            sttObject.startListening();
            setTimeout(() => {
                expect(sttElement.getAttribute('aria-label')).toBe('Stimmeingabe beenden');

                // Stop listening and confirm label resets correctly
                sttObject.stopListening();
                setTimeout(() => {
                    expect(sttElement.getAttribute('aria-label')).toBe('Stimmeingabe beginnen');
                    done();
                }, 200);
            }, 200);
        });
    });
});
