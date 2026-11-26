/**
 * Keyboard shortcuts of the Workflow Designer: Ctrl+S (export), Ctrl+O (import),
 * Shift+S (add sticky note), Shift+A (auto arrange), Ctrl+= / Ctrl+- (zoom),
 * Ctrl+0 (reset zoom), Ctrl+1 (fit), Ctrl+Z / Ctrl+Y (undo / redo),
 * Ctrl+Enter (run or stop), Ctrl+L (lock), S / P (select / pan tool) and
 * Ctrl+Backspace (clear, after confirmation).
 *
 * Shortcuts apply only while focus is inside the designer, and never while
 * the user is typing in a field or working in one of its dialogs. The Tab key
 * is never intercepted, so keyboard navigation is not affected.
 */

/**
 * Callback handlers for keyboard actions.
 *
 * @private
 */
export interface KeyboardHandlerCallbacks {
    executeRun: () => void;
    stopExecution: () => void;
    undo: () => void;
    redo: () => void;
    exportWorkflow: () => void;
    importWorkflow: () => void;
    addStickyNote: () => void;
    autoArrange: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    fitToPage: () => void;
    resetZoom: () => void;
    toggleLock: () => void;
    selectTool: () => void;
    panTool: () => void;
    clearDiagram: () => void;
    /** Moves the selection to the nearest step in a direction (Alt+Arrow keys). */
    navigate?: (direction: 'Left' | 'Right' | 'Up' | 'Down') => void;
    /** Opens the property panel for the selected item (Enter). */
    openSelected?: () => boolean;
    /** Opens the step list to add a step after the selected step (Alt+N). */
    addNextStep?: () => boolean;
}

/**
 * Dispatches keyboard shortcuts for one Workflow Designer instance.
 *
 * @private
 */
export class KeyboardHandler {
    private readonly host: HTMLElement;
    private readonly callbacks: KeyboardHandlerCallbacks;
    private readonly isExecuting: () => boolean;
    private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

    /**
     * Creates a keyboard handler.
     *
     * @param {HTMLElement} host The component host element.
     * @param {KeyboardHandlerCallbacks} callbacks Action callbacks for keyboard shortcuts.
     * @param {Function} isExecuting Returns whether workflow execution is currently running.
     * @private
     */
    public constructor(
        host: HTMLElement,
        callbacks: KeyboardHandlerCallbacks,
        isExecuting: () => boolean
    ) {
        this.host = host;
        this.callbacks = callbacks;
        this.isExecuting = isExecuting;
    }

    /**
     * Starts listening for shortcuts on the designer's host element. The
     * capture phase is used so a shortcut is handled before the inner Diagram
     * applies its own default for the same keys.
     *
     * @returns {void}
     * @private
     */
    public attach(): void {
        if (this.keydownHandler) {
            return;
        }

        this.keydownHandler = (event: KeyboardEvent) => this.handleKeyDown(event);
        this.host.addEventListener('keydown', this.keydownHandler, true);
    }

    /**
     * Stops listening for shortcuts.
     *
     * @returns {void}
     * @private
     */
    public detach(): void {
        if (this.keydownHandler) {
            this.host.removeEventListener('keydown', this.keydownHandler, true);
            this.keydownHandler = null;
        }
    }

    /**
     * Handles keydown events and dispatches to appropriate callbacks.
     *
     * @param {KeyboardEvent} event The keyboard event.
     * @returns {void}
     * @private
     */
    private handleKeyDown(event: KeyboardEvent): void {
        // Only events that originate inside this designer are handled, and
        // never while the user is typing or interacting with a dialog.
        const target: HTMLElement = event.target as HTMLElement;
        if (!target || !this.host.contains(target) || this.isInEditableElement(target)) {
            return;
        }

        const shortcut: string = this.normalizeShortcut(event);

        switch (shortcut) {
        // Ctrl+S: Export workflow
        case 'ctrl+s':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.exportWorkflow();
            return;

            // Ctrl+O: Import workflow
        case 'ctrl+o':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.importWorkflow();
            return;

            // Shift+S: Add sticky note
        case 'shift+s':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.addStickyNote();
            return;

            // Shift+A: Auto arrange nodes
        case 'shift+a':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.autoArrange();
            return;

            // Ctrl+Plus/Equal: Zoom in
        case 'ctrl++':
        case 'ctrl+=':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.zoomIn();
            return;

            // Ctrl+Minus: Zoom out
        case 'ctrl+-':
        case 'ctrl+_':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.zoomOut();
            return;

            // Ctrl+0: Reset zoom
        case 'ctrl+0':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.resetZoom();
            return;

            // Ctrl+1: Fit to page
        case 'ctrl+1':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.fitToPage();
            return;

            // Ctrl+Z: Undo
        case 'ctrl+z':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.undo();
            return;

            // Ctrl+Y or Ctrl+Shift+Z: Redo
        case 'ctrl+y':
        case 'ctrl+shift+z':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.redo();
            return;

            // Ctrl+Enter: Execute or Stop
        case 'ctrl+enter':
            event.preventDefault();
            event.stopPropagation();
            if (this.isExecuting()) {
                this.callbacks.stopExecution();
            } else {
                this.callbacks.executeRun();
            }
            return;

            // Ctrl+L: Toggle lock
        case 'ctrl+l':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.toggleLock();
            return;

            // 'S': Select tool
        case 's':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.selectTool();
            return;

            // 'P': Pan tool
        case 'p':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.panTool();
            return;

            // Ctrl+Backspace or Ctrl+Delete: Clear all (the callback asks for confirmation)
        case 'ctrl+backspace':
        case 'ctrl+delete':
            event.preventDefault();
            event.stopPropagation();
            this.callbacks.clearDiagram();
            return;

        case 'alt+arrowleft':
        case 'alt+arrowright':
        case 'alt+arrowup':
        case 'alt+arrowdown':
            if (this.callbacks.navigate) {
                event.preventDefault();
                event.stopPropagation();
                const direction: string = shortcut.slice('alt+arrow'.length);
                this.callbacks.navigate((direction.charAt(0).toUpperCase() + direction.slice(1)) as 'Left' | 'Right' | 'Up' | 'Down');
            }
            return;

            // Enter: open the selected item in the property panel
        case 'enter':
            // Leave Enter alone on buttons and other controls, which use it to activate.
            if (target.closest('button, a, select, [role="button"], [role="menuitem"], [role="option"], [role="tab"]')) {
                return;
            }
            if (this.callbacks.openSelected && this.callbacks.openSelected()) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;

            // Alt+N: add a step after the selected step
        case 'alt+n':
            if (this.callbacks.addNextStep && this.callbacks.addNextStep()) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;

        default:
            return;
        }
    }

    /**
     * Normalizes a keyboard event into a keyboard shortcut string.
     * Examples: "ctrl+s", "shift+a", "ctrl+1"
     *
     * @param {KeyboardEvent} event The keyboard event.
     * @returns {string} The normalized shortcut string.
     * @private
     */
    private normalizeShortcut(event: KeyboardEvent): string {
        let key: string = event.key.toLowerCase();
        // Option+letter on macOS produces a symbol in `key`; use the physical key for Alt shortcuts.
        if (event.altKey && event.code && /^Key[A-Z]$/.test(event.code)) {
            key = event.code.slice(3).toLowerCase();
        }

        // Handle special keys
        if (key === '+' || key === '=') {
            key = '+';
        } else if (key === '-' || key === '_') {
            key = key === '-' ? '-' : '_';
        }

        const ctrl: boolean = event.ctrlKey || event.metaKey;
        const shift: boolean = event.shiftKey;
        const alt: boolean = event.altKey;

        let combo: string = '';
        if (ctrl) {
            combo += 'ctrl+';
        }
        if (shift) {
            combo += 'shift+';
        }
        if (alt) {
            combo += 'alt+';
        }
        combo += key;

        return combo;
    }

    /**
     * Returns whether the element is a text field, an editable region or part
     * of a dialog, where shortcuts must not interrupt the user.
     *
     * @param {HTMLElement} element The target element.
     * @returns {boolean} Whether the element is editable.
     * @private
     */
    private isInEditableElement(element: HTMLElement): boolean {
        if (!element) {
            return false;
        }

        // Check if element or any parent is input, textarea, or contenteditable
        let current: HTMLElement | null = element;
        while (current && current !== this.host) {
            const tagName: string = current.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                return true;
            }
            if (current.getAttribute('contenteditable') === 'true' || current.getAttribute('role') === 'dialog'
                || tagName === 'select' || current.classList.contains('e-dialog')) {
                return true;
            }
            current = current.parentElement;
        }

        return false;
    }
}
