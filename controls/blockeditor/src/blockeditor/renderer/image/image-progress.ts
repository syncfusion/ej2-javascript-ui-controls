import { createElement, detach, isNullOrUndefined as isNOU, getUniqueID, updateCSSText } from '@syncfusion/ej2-base';
import { ProgressBar } from '@syncfusion/ej2-progressbar';
import { BlockEditor } from '../../base/blockeditor';

/**
 * ImageProgressRender manages the ProgressBar component for upload progress display.
 *
 * @hidden
 */
export class ImageProgressRenderer {
    private editor: BlockEditor;
    private imgElement: HTMLImageElement;
    private imageContainer: HTMLElement;
    private progressBarObj: ProgressBar | null;
    private progressElement: HTMLElement | null;
    private progressContainer: HTMLElement | null;
    private lastUpdatePercent: number;
    private badgeElement: HTMLElement | null;
    private badgeTimeoutId: number | null;
    private uniqueId: string;

    constructor(editor: BlockEditor, imgElement: HTMLImageElement) {
        this.editor = editor;
        this.imgElement = imgElement;
        this.imageContainer = imgElement.parentElement as HTMLElement;
        this.progressBarObj = null;
        this.progressElement = null;
        this.progressContainer = null;
        this.lastUpdatePercent = 0;
        this.badgeElement = null;
        this.badgeTimeoutId = null;
        this.uniqueId = getUniqueID('progress');

        this.initialize();
    }

    private initialize(): void {

        this.progressContainer = createElement('div', {
            id: `${this.editor.element.id}_progress-container-${this.uniqueId}`,
            className: 'e-progress-container e-hidden'
        });

        updateCSSText(this.progressContainer, 'line-height: 0;');

        // Create progress bar element with unique ID to avoid conflicts with multiple simultaneous uploads
        this.progressElement = createElement('div', {
            id: `${this.editor.element.id}_progress-bar-${this.uniqueId}`,
            className: 'e-image-progress-bar'
        });

        this.progressContainer.appendChild(this.progressElement);

        // Calculate width from image element (already in DOM)
        const targetWidth: number = this.imgElement.offsetWidth || this.imageContainer.offsetWidth || this.imgElement.clientWidth;

        this.progressBarObj = this.editor.progressBarRenderer.renderProgressBar({
            element: this.progressElement,
            type: 'Linear',
            height: '4px',
            value: 0,
            minimum: 0,
            maximum: 100,
            width: targetWidth.toString(),
            margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            animation: {
                enable: true,
                duration: 200,
                delay: 0
            },
            showProgressValue: false,
            progressThickness: 4,
            trackThickness: 4
        });

        this.imageContainer.insertBefore(this.progressContainer, this.imageContainer.firstChild);
    }

    /**
     * Shows the progress bar.
     *
     * @returns {void}
     * @hidden
     */
    public show(): void {
        if (this.progressContainer) {
            this.progressContainer.classList.remove('e-hidden');
            this.reset();
        }
    }

    public hide(callback?: () => void): void {
        if (this.progressContainer) {
            // Add a small delay to show 100% completion before hiding
            setTimeout(() => {
                if (this.progressContainer) {
                    this.progressContainer.classList.add('e-hidden');
                    this.reset();
                }
                // Execute callback after hiding if provided
                if (callback) {
                    callback();
                }
            }, 100);
        }
    }

    /**
     * Updates the progress bar value.
     * Uses 10% increment throttling with requestAnimationFrame for smooth updates.
     * @param {number} percent - Progress percentage
     *
     * @returns {void}
     * @hidden
     */
    public updateProgress(percent: number): void {
        const currentPercent: number = Math.min(100, Math.max(0, percent));
        // Update at 10% increments OR when complete
        if (currentPercent - this.lastUpdatePercent >= 10 || currentPercent === 100 || currentPercent === 0) {
            this.performUpdate(currentPercent);
            this.lastUpdatePercent = currentPercent;
        }
    }

    private performUpdate(percent: number): void {
        // Update progress bar value
        if (this.progressBarObj) {
            this.progressBarObj.value = percent;
        }
    }

    private reset(): void {
        this.lastUpdatePercent = 0;

        if (this.progressBarObj) {
            this.progressBarObj.value = 0;
        }
    }

    /**
     * Checks if progress bar is visible.
     *
     * @returns {boolean} - returns a bool to check if progress bar is visible.
     * @hidden
     */
    public isVisible(): boolean {
        return this.progressContainer ? !this.progressContainer.classList.contains('e-hidden') : false;
    }

    /**
     * Shows a success badge with tick icon at the top-right corner.
     * Badge automatically hides after 1 second.
     *
     * @returns {void}
     * @hidden
     */
    public showSuccessBadge(): void {
        this.showBadge('success', 'e-badge-success', 'e-be-check');
    }

    /**
     * Shows an error badge with error icon at the top-right corner.
     * Badge automatically hides after 1 second.
     *
     * @returns {void}
     * @hidden
     */
    public showErrorBadge(): void {
        this.showBadge('error', 'e-badge-danger', 'e-be-close');
    }

    private showBadge(type: string, badgeClass: string, iconClass: string): void {
        // Remove any existing badge first
        this.removeBadge();
        const badge: string = type === 'success' ? 'badgeSuccess' : 'badgeError';
        const ariaLable: string =
            `${this.editor.blockManager.localeJson['tabHeaderUpload']} ${this.editor.blockManager.localeJson[`${badge}`]}`;
        // Create badge container
        this.badgeElement = createElement('span', {
            className: `e-badge e-badge-circle e-icons ${iconClass} ${badgeClass}`,
            attrs: {
                'role': 'status',
                'aria-label': `${ariaLable}`
            }
        });

        // Append to image container
        this.imageContainer.appendChild(this.badgeElement);

        // Auto-remove after 1 second
        this.badgeTimeoutId = window.setTimeout(() => {
            this.removeBadge();
        }, 1000);
    }

    private removeBadge(): void {
        // Clear timeout if exists
        if (this.badgeTimeoutId !== null) {
            clearTimeout(this.badgeTimeoutId);
            this.badgeTimeoutId = null;
        }

        // Remove badge element
        if (this.badgeElement && this.badgeElement.parentElement) {
            detach(this.badgeElement);
            this.badgeElement = null;
        }
    }

    public destroy(): void {
        // Remove badge
        this.removeBadge();
        // Destroy progress bar
        if (this.progressBarObj) {
            this.progressBarObj.destroy();
            this.progressBarObj = null;
        }
        // Remove progress container
        if (this.progressContainer && this.progressContainer.parentElement) {
            detach(this.progressContainer);
            this.progressContainer = null;
        }
        // Clear references
        this.progressElement = null;
        this.lastUpdatePercent = 0;
    }
}
