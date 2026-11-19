/**
 * ResizableNodeView — public PM-free type definitions.
 *
 * These types live at the top-level public surface (`src/nodeviews/`) so the
 * engine can be reused by any resizable content node or custom node view.
 *
 * PM-free: only primitives and `HTMLElement` are referenced. No imports from
 * `src/pm/`, `src/extensions/`, or `prosemirror-*` are permitted.
 */

/**
 * Eight directions supported by the generic resize handle system.
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

/** Pixel dimensions applied to the resizable element. */
export interface ResizableNodeDimensions {
    /** Width in pixels. */
    width: number;
    /** Height in pixels. */
    height: number;
}

/**
 * Optional class-name overrides for the resize wrapper and handles.
 *
 * Each field defaults to the engine's documented default class. Setting any
 * field to truthy overrides that default but does not affect the other fields.
 */
export interface ResizableNodeViewCssClasses {
    /** Class applied to the resize wrapper. */
    wrapper?: string;
    /** Class applied to each resize handle. */
    handle?: string;
    /** Class toggled on the wrapper while resizing is active. */
    resizing?: string;
    /** Class toggled on the wrapper while the node is selected. */
    selected?: string;
}

/**
 * Behavior options for the generic resize engine.
 *
 * Defaults:
 * - `directions`: `['bottom-left', 'bottom-right', 'top-left', 'top-right']`
 * - `min`: `{ width: 8, height: 8 }`
 * - `max`: `undefined`
 * - `preserveAspectRatio`: `false`
 * - `cssClasses`: `{}`
 * - `createCustomHandle`: `undefined`
 */
export interface ResizableNodeViewOptions {
    /** Directions for which handles are rendered. */
    directions?: ResizableNodeViewDirection[];

    /** Minimum dimensions permitted during resizing, in pixels. */
    min?: Partial<ResizableNodeDimensions>;

    /** Maximum dimensions permitted during resizing, in pixels. */
    max?: Partial<ResizableNodeDimensions>;

    /**
     * Whether to preserve the element aspect ratio for every resize operation.
     * When `false`, holding Shift preserves the aspect ratio during a drag.
     */
    preserveAspectRatio?: boolean;

    /** CSS class overrides for the resize UI. */
    cssClasses?: ResizableNodeViewCssClasses;

    /**
     * Creates a custom handle for a direction. If the callback does not return
     * an `HTMLElement`, the engine creates its default handle.
     */
    createCustomHandle?: (direction: ResizableNodeViewDirection) => HTMLElement;
}

/**
 * Public constructor options for the generic `ResizableNodeView` engine.
 *
 * The engine is pure DOM and has no awareness of Editor, Commands, or PM
 * node types. The constructor accepts an element, optional behavior settings,
 * and lifecycle callbacks. Persistence is owned by the consumer and must be
 * performed from `onResizeStop` when required.
 */
export interface ResizableNodeViewConfig {
    /** The DOM element whose dimensions are resized. */
    element: HTMLElement;

    /** Optional behavior settings for handles, constraints, and aspect ratio. */
    options?: ResizableNodeViewOptions;

    /**
     * Fires for each pointer movement during an active resize operation with
     * the current constraint-adjusted dimensions.
     */
    onResize?: (width: number, height: number) => void;

    /**
     * Fires before the resize operation is initialized.
     * Return `true` to cancel the operation before the element changes.
     *
     * @param {number} width - The current element width in pixels.
     * @param {number} height - The current element height in pixels.
     * @returns {boolean} `true` to cancel the resize operation; otherwise `false`.
     */
    onResizeStart?: (width: number, height: number) => boolean;

    /**
     * Fires exactly once when a resize operation ends, before the consumer
     * persists the final dimensions.
     *
     * @param {number} width - The final element width in pixels.
     * @param {number} height - The final element height in pixels.
     * @returns {void}
     */
    onResizeStop: (width: number, height: number) => void;

    /**
     * Fires after `update(attrs)` re-seeds the resize state. Consumers can use
     * this to synchronize their element with updated node attributes.
     */
    onUpdate?: (attrs: Record<string, unknown>) => void;
}
