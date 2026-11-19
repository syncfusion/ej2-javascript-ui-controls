/**
 * Keyboard, mouse and touch input for the slideshow.
 *
 * @module @syncfusion/ej2-pptxeditor/slideshow/slideshow-navigation
 */

/** Actions the input layer can request. */
export interface SlideShowNavigationHost {
    next(): void;
    previous(): void;
    first(): void;
    last(): void;
    exit(): void;
    /** Shows the overlay controls and restarts the auto-hide timer. */
    showControls(): void;
    /** True for right-to-left presentations (horizontal input is mirrored). */
    isRtl(): boolean;
}

const SWIPE_MIN_PX: number = 50;
const TAP_MAX_MOVE_PX: number = 10;
const TAP_MAX_MS: number = 500;

/**
 * Maps PowerPoint-compatible input to navigation actions.
 *
 * Next: Space, Enter, ArrowRight/Down, PageDown, N, click, tap, swipe left.
 * Previous: ArrowLeft/Up, Backspace, PageUp, P, swipe right.
 * Home/End jump to the first/last slide; Escape exits; a two-finger tap shows
 * the controls. In RTL presentations ArrowLeft/ArrowRight and swipes are mirrored.
 */
export class SlideShowNavigation {
    private readonly host: SlideShowNavigationHost;
    private root: HTMLElement | null = null;
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchStartTime: number = 0;
    private maxTouches: number = 0;
    private touchBlocked: boolean = false;
    private readonly keyHandler: (e: KeyboardEvent) => void;
    private readonly clickHandler: (e: MouseEvent) => void;
    private readonly moveHandler: () => void;
    private readonly startHandler: (e: TouchEvent) => void;
    private readonly endHandler: (e: TouchEvent) => void;

    /**
     * @param {SlideShowNavigationHost} host - Receiver of navigation actions
     */
    public constructor(host: SlideShowNavigationHost) {
        this.host = host;
        this.keyHandler = (e: KeyboardEvent): void => {
            if (this.handleKey(e)) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        this.clickHandler = (e: MouseEvent): void => this.onClick(e);
        this.moveHandler = (): void => this.host.showControls();
        this.startHandler = (e: TouchEvent): void => this.onTouchStart(e);
        this.endHandler = (e: TouchEvent): void => this.onTouchEnd(e);
    }

    /**
     * Starts listening. Keys are captured on `document` so they work wherever focus is.
     *
     * @param {HTMLElement} root - Slideshow overlay root
     * @returns {void}
     */
    public attach(root: HTMLElement): void {
        this.detach();
        this.root = root;
        document.addEventListener('keydown', this.keyHandler, true);
        root.addEventListener('click', this.clickHandler);
        root.addEventListener('mousemove', this.moveHandler);
        root.addEventListener('touchstart', this.startHandler, { passive: true });
        root.addEventListener('touchend', this.endHandler, { passive: false });
    }

    /**
     * Stops listening. Idempotent.
     *
     * @returns {void}
     */
    public detach(): void {
        document.removeEventListener('keydown', this.keyHandler, true);
        if (this.root) {
            this.root.removeEventListener('click', this.clickHandler);
            this.root.removeEventListener('mousemove', this.moveHandler);
            this.root.removeEventListener('touchstart', this.startHandler);
            this.root.removeEventListener('touchend', this.endHandler);
            this.root = null;
        }
    }

    /**
     * Handles one key press.
     *
     * @param {KeyboardEvent} event - Key event
     * @returns {boolean} True when the key was consumed
     */
    public handleKey(event: KeyboardEvent): boolean {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return false;
        }
        if (event.key === 'Escape' || event.key === 'Esc') {
            this.host.exit();
            return true;
        }
        const target: HTMLElement | null = event.target as HTMLElement | null;
        const tag: string = target && target.tagName ? target.tagName.toLowerCase() : '';
        const activation: boolean = event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter';
        // Focused form controls and buttons keep their own key behaviour.
        if (tag === 'select' || tag === 'input' || tag === 'textarea' || (tag === 'button' && activation)) {
            return false;
        }
        const rtl: boolean = this.host.isRtl();
        switch (event.key) {
        case ' ':
        case 'Spacebar':
        case 'Enter':
        case 'ArrowDown':
        case 'PageDown':
        case 'n':
        case 'N':
            this.host.next();
            return true;
        case 'ArrowRight':
            this.go(!rtl);
            return true;
        case 'ArrowLeft':
            this.go(rtl);
            return true;
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
        case 'p':
        case 'P':
            this.host.previous();
            return true;
        case 'Home':
            this.host.first();
            return true;
        case 'End':
            this.host.last();
            return true;
        default:
            return false;
        }
    }

    private go(forward: boolean): void {
        if (forward) {
            this.host.next();
        } else {
            this.host.previous();
        }
    }

    private isInteractive(target: EventTarget | null): boolean {
        const el: HTMLElement | null = target as HTMLElement | null;
        return !!(el && el.closest && el.closest('.ej2-pptx-slideshow__controls, .ej2-pptx-presenter'));
    }

    private onClick(event: MouseEvent): void {
        if (event.button !== 0 || this.isInteractive(event.target)) {
            return;
        }
        this.host.next();
    }

    private onTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            this.touchBlocked = this.isInteractive(event.target);
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
            this.touchStartTime = Date.now();
            this.maxTouches = 1;
        } else {
            this.maxTouches = Math.max(this.maxTouches, event.touches.length);
        }
    }

    private onTouchEnd(event: TouchEvent): void {
        if (event.touches.length !== 0 || this.touchBlocked) {
            return;
        }
        const touch: Touch | undefined = event.changedTouches[0];
        const dx: number = touch ? touch.clientX - this.touchStartX : 0;
        const dy: number = touch ? touch.clientY - this.touchStartY : 0;
        const elapsed: number = Date.now() - this.touchStartTime;
        const fingers: number = this.maxTouches;
        this.maxTouches = 0;
        if (event.cancelable) {
            event.preventDefault(); // suppress the synthesized click
        }
        if (fingers >= 2) {
            if (elapsed <= TAP_MAX_MS) {
                this.host.showControls();
            }
            return;
        }
        if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
            this.go(this.host.isRtl() ? dx > 0 : dx < 0);
        } else if (Math.abs(dx) <= TAP_MAX_MOVE_PX && Math.abs(dy) <= TAP_MAX_MOVE_PX && elapsed <= TAP_MAX_MS) {
            this.host.next();
        }
    }
}
