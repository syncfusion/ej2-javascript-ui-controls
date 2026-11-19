/**
 * SlideShow event contracts and the dispatcher that forwards them to the host
 * editor's EJ2 `@Event()` properties.
 *
 * @module @syncfusion/ej2-pptxeditor/slideshow/slideshow-events
 */

/** Names of the events the slideshow raises on the editor. */
export type SlideShowEventName =
    'presentationStarted' | 'presentationEnded' | 'slideChanged' | 'presenterViewOpened' | 'presenterViewClosed';

/** Common base for slideshow event arguments. */
export interface SlideShowEventArgs {
    /** Editor that raised the event. */
    sender?: object;
    /** Event name. */
    name?: string;
}

/** Arguments of `presentationStarted`. */
export interface SlideShowStartedEventArgs extends SlideShowEventArgs {
    /** 0-based slide the show started on. */
    startIndex: number;
    /** Total slide count. */
    slideCount: number;
}

/** Arguments of `presentationEnded`. */
export interface SlideShowEndedEventArgs extends SlideShowEventArgs {
    /** 0-based slide shown when the show ended. */
    lastIndex: number;
    /** Total slide count. */
    slideCount: number;
}

/** Arguments of the slideshow `slideChanged` event. */
export interface SlideShowSlideChangedEventArgs extends SlideShowEventArgs {
    /** Previous 0-based slide index. */
    previousIndex: number;
    /** New 0-based slide index. */
    newIndex: number;
    /** Total slide count. */
    slideCount: number;
}

/** Arguments of `presenterViewOpened` / `presenterViewClosed`. */
export interface PresenterViewEventArgs extends SlideShowEventArgs {
    /** 0-based slide current when the state changed. */
    currentIndex: number;
}

/** Minimal editor surface needed to raise events. */
export interface SlideShowEventSink {
    trigger(eventName: string, eventProp?: object): void;
}

/** Forwards slideshow events to the editor. */
export class SlideShowEvents {
    private readonly sink: SlideShowEventSink;

    /**
     * @param {SlideShowEventSink} sink - Editor raising the events
     */
    public constructor(sink: SlideShowEventSink) {
        this.sink = sink;
    }

    /**
     * Raises one slideshow event, stamping `sender` and `name`.
     *
     * @param {SlideShowEventName} name - Event name
     * @param {object} args - Event payload
     * @returns {void}
     */
    public raise(name: SlideShowEventName, args: object): void {
        const payload: SlideShowEventArgs = args;
        payload.sender = this.sink;
        payload.name = name;
        this.sink.trigger(name, payload);
    }
}
