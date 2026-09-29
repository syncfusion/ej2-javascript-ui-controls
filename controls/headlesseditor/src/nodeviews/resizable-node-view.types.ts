/**
 * ResizableNodeView — public PM-free type definitions.
 *
 * These types live at the top-level public surface (`src/nodeviews/`) so the
 * engine can be reused by any consumer (image, video, iframe, embed, custom).
 *
 * PM-free: only primitives and `HTMLElement` are referenced. No imports from
 * `src/pm/`, `src/extensions/`, or `prosemirror-*` are permitted.
 */

/**
 * Eight resize handle directions matching the Tiptap parity surface.
 *
 * `top` / `right` / `bottom` / `left` are edge handles (single-axis).
 * `top-right` / `top-left` / `bottom-right` / `bottom-left` are corner handles
 * (both axes). Edges span the wrapper's full width or height; corners
 * attach only at the named intersection.
 */
export type ResizableNodeViewDirection =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left';

/** Pixel dimensions applied to the wrapped element. */
export interface ResizableNodeDimensions {
    width: number;
    height: number;
}

/**
 * Optional theming override for the wrapper / handle / resizing marker.
 *
 * Each field defaults to the engine's documented default class. Setting any
 * field to truthy overrides that default but does not affect the other fields.
 */
export interface ResizableNodeViewClassNames {
    /** Wrapper class (default: `'e-resizable-wrapper'`). */
    wrapper?: string;
    /** Handle class (default: `'e-resizable-handle'`). */
    handle?: string;
    /** Class toggled on the wrapper while a drag is in flight (default: `'is-resizing'`). */
    resizing?: string;
    /** Class toggled on the wrapper when the node is selected (default: `'is-selected'`). */
    selected?: string;
}

/**
 * Behavior options for the engine.
 *
 * Defaults:
 * - `directions`: `['bottom-left', 'bottom-right', 'top-left', 'top-right']`
 * - `min`: `{ width: 8, height: 8 }`
 * - `max`: `undefined`
 * - `preserveAspectRatio`: `false`
 * - `className`: `{}`
 * - `createCustomHandle`: `undefined`
 */
export interface ResizableNodeViewBehaviorOptions {
    /** Directions to render handles for. Defaults to the four corners. */
    directions?: ResizableNodeViewDirection[];

    /** Minimum dimensions (px). Defaults to `{ width: 8, height: 8 }`. */
    min?: Partial<ResizableNodeDimensions>;

    /** Maximum dimensions (px). Optional; `undefined` means no maximum. */
    max?: Partial<ResizableNodeDimensions>;

    /**
     * Always preserve aspect ratio. When `false`, aspect ratio is preserved
     * only while Shift is held during the drag.
     */
    preserveAspectRatio?: boolean;

    /** CSS class overrides. */
    className?: ResizableNodeViewClassNames;

    /**
     * Optional override for handle DOM creation. The returned element is used
     * directly as the handle for the named direction. If a non-`HTMLElement`
     * is returned the engine falls back to its default and emits a single
     * warning per direction.
     */
    createCustomHandle?: (direction: ResizableNodeViewDirection) => HTMLElement;
}

/**
 * Public constructor options for `ResizableNodeView`.
 *
 * The engine is pure DOM and has no awareness of Editor, Commands, or PM
 * node types. The constructor accepts an element, optional behavior config,
 * and resize callbacks. Persistence (`onCommit`) MUST be wired by the
 * consumer — for image this is `editor.commands.updateImage({ width, height })`.
 */
export interface ResizableNodeViewOptions {
    /** The DOM element to make resizable. Required. */
    element: HTMLElement;

    /** Optional behavior options (directions, min/max, aspect ratio, etc.). */
    options?: ResizableNodeViewBehaviorOptions;

    /**
     * Fires on every `mousemove` / `touchmove` while a drag is in flight,
     * with the current (constraints-applied) dimensions. Optional.
     */
    onResize?: (width: number, height: number) => void;

    /**
     * Fires exactly once at the end of a drag (mouseup / touchend) with the
     * final dimensions. The consumer dispatches a command here (e.g.
     * `editor.commands.updateImage({ width, height })`). Required for commit
     * flow but the engine tolerates a no-op if the consumer wraps it.
     */
    onCommit: (width: number, height: number) => void;

    /**
     * Fires after `update(attrs)` re-seeds engine state. Consumers can use
     * this to mirror additional attrs onto the wrapped element (e.g.
     * `<img>.src = attrs.src`). Optional.
     */
    onUpdate?: (attrs: Record<string, unknown>) => void;
}
