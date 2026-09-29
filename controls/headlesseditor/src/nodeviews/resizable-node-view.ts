/**
 * ResizableNodeView — pure-DOM resize engine for the headless editor.
 *
 * Lives at `src/nodeviews/` (top-level public surface). PM-free: this file
 * MUST NOT import from `src/pm/`, `src/extensions/`, or any `prosemirror-*`
 * package. The boundary is enforced by `tools/check-no-pm-imports.mjs`.
 *
 * Wraps an `HTMLElement` with resize handles and provides an in-place drag
 * interaction (mouse + touch + keyboard). The consumer (image, video, embed)
 * is responsible for wiring `onCommit` to any actual persistence path —
 * for image this is `editor.commands.updateImage({ width, height })`.
 */

import type {
    ResizableNodeViewBehaviorOptions,
    ResizableNodeViewDirection,
    ResizableNodeViewOptions
} from './resizable-node-view.types';

const DEFAULT_DIRECTIONS: readonly ResizableNodeViewDirection[] = [
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right'
];

const DEFAULT_MIN_WIDTH: number = 8;
const DEFAULT_MIN_HEIGHT: number = 8;

const DEFAULT_RESIZE_WRAPPER_CLASS: string = 'e-resizable-wrapper';
const DEFAULT_RESIZE_HANDLE_CLASS: string = 'e-resizable-handle';
const DEFAULT_IS_RESIZING_CLASS: string = 'is-resizing';
const DEFAULT_IS_SELECTED_CLASS: string = 'is-selected';

export class ResizableNodeView {
    /** Public: the wrapped element passed at construction. */
    public readonly element: HTMLElement;

    /** Public: wrapper element, also returned as NodeView `dom`. Always non-null after construction. */
    public wrapper: HTMLElement;

    /** Public: optional content slot for consumers with editable children. */
    public readonly contentElement: HTMLElement | null;

    /** Public: getter returned to PM as the NodeView `dom`. */
    private readonly _dom: HTMLElement;

    /** Public: getter returned to PM as the NodeView `contentDOM`. */
    private readonly _contentDOM: HTMLElement | null;

    private readonly options: ResizableNodeViewBehaviorOptions;
    private readonly directions: readonly ResizableNodeViewDirection[];
    private readonly minSize: { width: number; height: number };
    private readonly maxSize?: Partial<{ width: number; height: number }>;
    private readonly preserveAspectRatio: boolean;
    private readonly classNames: Required<ResizableNodeViewBehaviorOptions['className']> = {
        wrapper: DEFAULT_RESIZE_WRAPPER_CLASS,
        handle: DEFAULT_RESIZE_HANDLE_CLASS,
        resizing: DEFAULT_IS_RESIZING_CLASS,
        selected: DEFAULT_IS_SELECTED_CLASS
    };
    private readonly createCustomHandle?: (direction: ResizableNodeViewDirection) => HTMLElement;
    private readonly onResize?: (width: number, height: number) => void;
    private readonly onCommit: (width: number, height: number) => void;
    private readonly onUpdate?: (attrs: Record<string, unknown>) => void;
    private readonly handleMap: Map<ResizableNodeViewDirection, HTMLElement> = new Map();

    private initialWidth: number = 0;
    private initialHeight: number = 0;
    private aspectRatio: number = 1;
    private isResizing: boolean = false;
    private activeHandle: ResizableNodeViewDirection | null = null;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;
    private isShiftKeyPressed: boolean = false;

    // Listener detach references, set on resize-start and cleared on resize-end.
    private listeners: { type: string; handler: EventListener }[] = [];

    // Toggle for read-only handle visibility. Defaults to true.
    private enabled: boolean = true;

    // Tracks whether the PM node is currently selected. Handles are only
    // visible when the node is selected AND editing is enabled.
    private selected: boolean = false;

    public constructor(options: ResizableNodeViewOptions) {
        if (!options || !options.element || !(options.element instanceof HTMLElement)) {
            throw new TypeError('ResizableNodeView requires a valid `element` HTMLElement.');
        }
        if (typeof options.onCommit !== 'function') {
            throw new TypeError('ResizableNodeView requires an `onCommit(width, height)` function.');
        }
        this.element = options.element;
        this.element.draggable = false;
        this.contentElement = null;
        this.onResize = options.onResize;
        this.onCommit = options.onCommit;
        this.onUpdate = options.onUpdate;
        this.options = options.options ?? {};
        this.directions = this.options.directions ?? [...DEFAULT_DIRECTIONS];
        this.minSize = {
            width: this.options.min?.width ?? DEFAULT_MIN_WIDTH,
            height: this.options.min?.height ?? DEFAULT_MIN_HEIGHT
        };
        this.maxSize = this.options.max;
        this.preserveAspectRatio = !!this.options.preserveAspectRatio;
        this.classNames = {
            wrapper: this.options.className?.wrapper ?? DEFAULT_RESIZE_WRAPPER_CLASS,
            handle: this.options.className?.handle ?? DEFAULT_RESIZE_HANDLE_CLASS,
            resizing: this.options.className?.resizing ?? DEFAULT_IS_RESIZING_CLASS,
            selected: this.options.className?.selected ?? DEFAULT_IS_SELECTED_CLASS
        };
        this.createCustomHandle = this.options.createCustomHandle;

        this.wrapper = this.createWrapper();
        this._dom = this.wrapper;
        this._contentDOM = null;
        this.applyInitialSize({
            width: this.readAttrNumber(this.element, 'width'),
            height: this.readAttrNumber(this.element, 'height')
        });

        // Append element inside wrapper. Handles are NOT attached at construction;
        // they appear only when the node is selected (via selectNode).
        if (!this.wrapper.contains(this.element)) {
            this.wrapper.appendChild(this.element);
        }
    }

    // ── DOM getters (NodeView descriptor surface) ─────────────────────────────

    public get dom(): HTMLElement {
        return this._dom;
    }

    public get contentDOM(): HTMLElement | null {
        return this._contentDOM;
    }

    // ── Lifecycle (NodeView descriptor surface) ───────────────────────────────

    /**
     * Re-seeds engine size from new attrs and applies it to the wrapped
     * element's inline style. Always returns `true` (the engine never
     * rejects updates; consumer-side filtering lives in the NodeView bridge).
     *
     * @param {Object} attrs - Updated node attributes.
     * @returns {boolean} Always `true`.
     */
    public update(attrs: Record<string, unknown>): boolean {
        const width: number | undefined = typeof attrs['width'] === 'number' ? attrs['width'] : undefined;
        const height: number | undefined = typeof attrs['height'] === 'number' ? attrs['height'] : undefined;
        if (width !== undefined || height !== undefined) {
            this.applyInitialSize({ width, height });
        }
        if (this.onUpdate) {
            try {
                this.onUpdate(attrs);
            } catch {
                // Consumer-side error: tolerate silently; engine remains consistent.
            }
        }
        return true;
    }

    /**
     * Tears down every listener, removes every handle, cancels any in-flight
     * drag, and removes the wrapper from its parent if any. Safe to call
     * multiple times. After destroy, no callbacks (onResize / onCommit /
     * onUpdate) fire.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isResizing) {
            this.isResizing = false;
            this.activeHandle = null;
            if (this.classNames.resizing) {
                this.wrapper.classList.remove(this.classNames.resizing);
            }
            this.wrapper.dataset['resizeState'] = 'false';
        }
        this.detachDocumentListeners();
        this.removeHandles();
        if (this.wrapper.parentNode) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
        this.handleMap.clear();
    }

    /**
     * Toggles handle visibility without affecting the wrapped element's
     * styles. Consumers call `setEnabled(false)` when read-only flips; the
     * handles are removed from the DOM (preferred over `pointer-events: none`)
     * so they exit the tab order.
     *
     * @param {boolean} enabled - Whether resize handles are enabled.
     * @returns {void}
     */
    public setEnabled(enabled: boolean): void {
        this.enabled = !!enabled;
        // Handles are only visible when both selected AND enabled.
        if (this.enabled && this.selected) {
            this.removeHandles();
            this.attachHandles();
        } else {
            this.removeHandles();
        }
    }

    /**
     * Returns `true` for every mutation observed inside the engine's wrapper,
     * so PM never remounts the NodeView due to:
     *  - inline `style.width` / `style.height` writes during drag
     *  - handle DOM insertions / removals during `setEnabled`
     *  - any host-app tool that mutates the wrapper
     *
     * @param {MutationRecord} _mutation - DOM mutation record (ignored).
     * @returns {boolean} Always `true` so PM never remounts this NodeView.
     */
    public ignoreMutation(_mutation: unknown): boolean {
        return true;
    }

    /**
     * NodeView `selectNode`: show resize handles and apply the selected class.
     * Handles are only rendered when editing is also enabled (not read-only).
     *
     * @returns {void}
     */
    public selectNode(): void {
        this.selected = true;
        if (this.classNames.selected) {
            this.wrapper.classList.add(this.classNames.selected);
        }
        if (this.enabled) {
            this.attachHandles();
        }
    }

    /**
     * NodeView `deselectNode`: hide resize handles and remove the selected class.
     * Any in-flight drag is allowed to finish naturally; handles are removed after.
     *
     * @returns {void}
     */
    public deselectNode(): void {
        this.selected = false;
        if (this.classNames.selected) {
            this.wrapper.classList.remove(this.classNames.selected);
        }
        if (!this.isResizing) {
            this.removeHandles();
        }
    }

    // ── DOM construction helpers ──────────────────────────────────────────────

    private createWrapper(): HTMLElement {
        const wrapper: HTMLElement = document.createElement('span');
        wrapper.dataset['resizeWrapper'] = '';
        if (this.classNames.wrapper) {
            wrapper.className = this.classNames.wrapper;
        }
        // All visual styling and layout (position, display) are owned by the
        // host stylesheet via `.e-resizable-wrapper`. No inline styles here.
        return wrapper;
    }

    private createHandle(direction: ResizableNodeViewDirection): HTMLElement {
        const handle: HTMLElement = document.createElement('span');
        handle.dataset['resizeHandle'] = direction;
        handle.className = this.classNames.handle;
        // No inline styles: all visual styling, positioning, size, and cursor
        // are fully owned by the host stylesheet via `.e-resizable-handle` and
        // `[data-resize-handle="<direction>"]` selectors.
        return handle;
    }

    private attachHandles(): void {
        for (const direction of this.directions) {
            let handle: HTMLElement;
            if (this.createCustomHandle) {
                const candidate: unknown = this.createCustomHandle(direction);
                if (candidate instanceof HTMLElement) {
                    handle = candidate;
                } else {
                    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
                        console.warn(
                            `[ResizableNodeView] createCustomHandle("${direction}") did not return an HTMLElement. Falling back to default handle.`
                        );
                    }
                    handle = this.createHandle(direction);
                }
            } else {
                handle = this.createHandle(direction);
            }

            // Wire pointer events. Cursor styling is owned by the host stylesheet.
            const onMouseDown: (event: MouseEvent) => void = (event: MouseEvent): void => {
                this.handleResizeStart(event, direction, 'mouse');
            };
            const onTouchStart: (event: TouchEvent) => void = (event: TouchEvent): void => {
                this.handleResizeStart(event, direction, 'touch');
            };
            handle.addEventListener('mousedown', onMouseDown);
            handle.addEventListener('touchstart', onTouchStart);

            this.handleMap.set(direction, handle);
            this.wrapper.appendChild(handle);
        }
    }

    private removeHandles(): void {
        this.handleMap.forEach((handle: HTMLElement): void => {
            handle.remove();
        });
        this.handleMap.clear();
    }

    // ── Sizing ─────────────────────────────────────────────────────────────────

    private applyInitialSize(size: { width?: number; height?: number }): void {
        if (typeof size.width === 'number') {
            this.element.style.width = `${size.width}px`;
            this.initialWidth = size.width;
        } else {
            this.initialWidth = this.element.offsetWidth || 0;
        }
        if (typeof size.height === 'number') {
            this.element.style.height = `${size.height}px`;
            this.initialHeight = size.height;
        } else {
            this.initialHeight = this.element.offsetHeight || 0;
        }
        if (this.initialWidth > 0 && this.initialHeight > 0) {
            this.aspectRatio = this.initialWidth / this.initialHeight;
        }
    }

    private readAttrNumber(el: HTMLElement, name: string): number | undefined {
        const raw: string | null = el.getAttribute(name);
        if (raw === null || raw === '') {
            return undefined;
        }
        const n: number = Number(raw);
        return Number.isFinite(n) ? n : undefined;
    }

    // ── Resize interaction ─────────────────────────────────────────────────────

    private handleResizeStart(event: MouseEvent | TouchEvent, direction: ResizableNodeViewDirection, kind: 'mouse' | 'touch'): void {
        // Always preventDefault / stopPropagation on the start event so
        // PM does not clear the selection while the user is grabbing a
        // handle. See task 5.5.
        event.preventDefault();
        event.stopPropagation();

        this.isResizing = true;
        this.activeHandle = direction;
        const startPoint: { x: number; y: number } = kind === 'touch'
            ? this.readTouchPoint(event as TouchEvent)
            : { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY };

        this.startX = startPoint.x;
        this.startY = startPoint.y;
        this.startWidth = this.element.offsetWidth;
        this.startHeight = this.element.offsetHeight;

        if (this.startWidth > 0 && this.startHeight > 0) {
            this.aspectRatio = this.startWidth / this.startHeight;
        }

        if (this.classNames.resizing) {
            this.wrapper.classList.add(this.classNames.resizing);
        }
        this.wrapper.dataset['resizeState'] = 'true';

        this.attachDocumentListeners(kind);
    }

    private readTouchPoint(event: TouchEvent): { x: number; y: number } {
        const touch: Touch | undefined = event.touches && event.touches.length ? event.touches[0] : undefined;
        return touch ? { x: touch.clientX, y: touch.clientY } : { x: 0, y: 0 };
    }

    private attachDocumentListeners(kind: 'mouse' | 'touch'): void {
        const onMouseMove: (event: MouseEvent) => void = (event: MouseEvent): void => {
            const deltaX: number = event.clientX - this.startX;
            const deltaY: number = event.clientY - this.startY;
            this.handleResize(deltaX, deltaY);
        };
        const onMouseUp: () => void = (): void => {
            this.handleResizeEnd();
        };
        const onTouchMove: (event: TouchEvent) => void = (event: TouchEvent): void => {
            const point: { x: number; y: number } = this.readTouchPoint(event);
            const deltaX: number = point.x - this.startX;
            const deltaY: number = point.y - this.startY;
            this.handleResize(deltaX, deltaY);
        };
        const onTouchEnd: () => void = (): void => {
            this.handleResizeEnd();
        };
        const onKeyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
            if (event.key === 'Shift') {
                this.isShiftKeyPressed = true;
            }
        };
        const onKeyUp: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
            if (event.key === 'Shift') {
                this.isShiftKeyPressed = false;
            }
        };

        if (kind === 'mouse') {
            this.addDocumentListener('mousemove', onMouseMove);
            this.addDocumentListener('mouseup', onMouseUp);
        } else {
            this.addDocumentListener('touchmove', onTouchMove);
            this.addDocumentListener('touchend', onTouchEnd);
        }
        this.addDocumentListener('keydown', onKeyDown);
        this.addDocumentListener('keyup', onKeyUp);
    }

    private addDocumentListener(type: string, handler: EventListener): void {
        document.addEventListener(type, handler, { passive: true });
        this.listeners.push({ type, handler });
    }

    private detachDocumentListeners(): void {
        for (const entry of this.listeners) {
            document.removeEventListener(entry.type, entry.handler);
        }
        this.listeners = [];
    }

    private handleResize(deltaX: number, deltaY: number): void {
        if (!this.activeHandle) {
            return;
        }
        const shouldPreserveAspectRatio: boolean = this.preserveAspectRatio || this.isShiftKeyPressed;
        const raw: { width: number; height: number } = this.calculateNewDimensions(this.activeHandle, deltaX, deltaY);
        const constrained: { width: number; height: number } = this.applyConstraints(raw.width, raw.height, shouldPreserveAspectRatio);

        this.element.style.width = `${constrained.width}px`;
        this.element.style.height = `${constrained.height}px`;

        if (this.onResize) {
            try {
                this.onResize(constrained.width, constrained.height);
            } catch {
                // consumer error; tolerate.
            }
        }
    }

    private handleResizeEnd(): void {
        if (!this.isResizing) {
            return;
        }
        const finalWidth: number = this.element.offsetWidth;
        const finalHeight: number = this.element.offsetHeight;

        try {
            this.onCommit(finalWidth, finalHeight);
        } catch {
            // consumer error; tolerate.
        }

        this.isResizing = false;
        this.activeHandle = null;
        if (this.classNames.resizing) {
            this.wrapper.classList.remove(this.classNames.resizing);
        }
        this.wrapper.dataset['resizeState'] = 'false';
        this.detachDocumentListeners();

        // If the node was deselected mid-drag (e.g. focusout elsewhere), the
        // deselectNode path skips handle removal until resize completes. Now
        // that the drag is over, remove the remaining handles to honor selection.
        if (!this.selected) {
            this.removeHandles();
        }
    }

    // ── Math ───────────────────────────────────────────────────────────────────

    private calculateNewDimensions(
        direction: ResizableNodeViewDirection,
        deltaX: number,
        deltaY: number
    ): { width: number; height: number } {
        const isTop: boolean = direction.indexOf('top') !== -1;
        const isBottom: boolean = direction.indexOf('bottom') !== -1;
        const isLeft: boolean = direction.indexOf('left') !== -1;
        const isRight: boolean = direction.indexOf('right') !== -1;
        const isPureHorizontalEdge: boolean = direction === 'left' || direction === 'right';
        const isPureVerticalEdge: boolean = direction === 'top' || direction === 'bottom';

        let newWidth: number = this.startWidth;
        let newHeight: number = this.startHeight;

        if (isPureHorizontalEdge) {
            newWidth = this.startWidth + (isRight ? deltaX : -deltaX);
        } else if (isPureVerticalEdge) {
            newHeight = this.startHeight + (isBottom ? deltaY : -deltaY);
        } else {
            // Corner handles affect both axes.
            if (isRight) {
                newWidth = this.startWidth + deltaX;
            } else if (isLeft) {
                newWidth = this.startWidth - deltaX;
            }
            if (isBottom) {
                newHeight = this.startHeight + deltaY;
            } else if (isTop) {
                newHeight = this.startHeight - deltaY;
            }
        }

        const shouldPreserveAspectRatio: boolean = this.preserveAspectRatio || this.isShiftKeyPressed;
        if (shouldPreserveAspectRatio) {
            return this.applyAspectRatio(newWidth, newHeight, direction);
        }
        return { width: newWidth, height: newHeight };
    }

    private applyAspectRatio(width: number, height: number, direction: ResizableNodeViewDirection): { width: number; height: number } {
        const isHorizontal: boolean = direction === 'left' || direction === 'right';
        const isVertical: boolean = direction === 'top' || direction === 'bottom';

        if (isHorizontal) {
            return { width, height: width / this.aspectRatio };
        }
        if (isVertical) {
            return { width: height * this.aspectRatio, height };
        }
        // Corner: width-primary.
        return { width, height: width / this.aspectRatio };
    }

    private applyConstraints(width: number, height: number, preserveAspectRatio: boolean): { width: number; height: number } {
        if (!preserveAspectRatio) {
            let constrainedWidth: number = Math.max(this.minSize.width, width);
            let constrainedHeight: number = Math.max(this.minSize.height, height);
            if (this.maxSize?.width !== undefined) {
                constrainedWidth = Math.min(this.maxSize.width, constrainedWidth);
            }
            if (this.maxSize?.height !== undefined) {
                constrainedHeight = Math.min(this.maxSize.height, constrainedHeight);
            }
            return { width: constrainedWidth, height: constrainedHeight };
        }
        // Aspect-ratio-aware constraints: when one dimension hits a limit, the
        // other is recalculated proportionally so aspect ratio never breaks.
        let constrainedWidth: number = width;
        let constrainedHeight: number = height;
        if (constrainedWidth < this.minSize.width) {
            constrainedWidth = this.minSize.width;
            constrainedHeight = constrainedWidth / this.aspectRatio;
        }
        if (constrainedHeight < this.minSize.height) {
            constrainedHeight = this.minSize.height;
            constrainedWidth = constrainedHeight * this.aspectRatio;
        }
        if (this.maxSize?.width !== undefined && constrainedWidth > this.maxSize.width) {
            constrainedWidth = this.maxSize.width;
            constrainedHeight = constrainedWidth / this.aspectRatio;
        }
        if (this.maxSize?.height !== undefined && constrainedHeight > this.maxSize.height) {
            constrainedHeight = this.maxSize.height;
            constrainedWidth = constrainedHeight * this.aspectRatio;
        }
        return { width: constrainedWidth, height: constrainedHeight };
    }
}
