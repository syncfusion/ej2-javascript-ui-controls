
/**
 * Common arguments for resize lifecycle events.
 *
 * @public
 */
export interface ResizeEventArgs {
    /** The DOM element being resized. */
    element: HTMLElement;
    /** The schema node type associated with the element being resized. */
    nodeType: string;
    /** The current width of the element in pixels. */
    currentWidth: number;
    /** The current height of the element in pixels. */
    currentHeight: number;
}

/**
 * Arguments supplied when a resize operation starts.
 * Set `cancel` to `true` to prevent the operation from starting.
 *
 * @public
 */
export interface ResizeStartEventArgs extends ResizeEventArgs {
    /** Prevents the resize operation when set to `true`. */
    cancel: boolean;
}

/**
 * Arguments supplied during an active resize operation.
 *
 * @public
 */
export interface ResizingEventArgs extends ResizeEventArgs {
    /** The width captured when the resize operation started, in pixels. */
    originalWidth: number;
    /** The height captured when the resize operation started, in pixels. */
    originalHeight: number;
}

/**
 * Arguments supplied when a resize operation completes.
 *
 * @public
 */
export interface ResizeStopEventArgs extends ResizeEventArgs {
    /** The width captured when the resize operation started, in pixels. */
    originalWidth: number;
    /** The height captured when the resize operation started, in pixels. */
    originalHeight: number;
}
