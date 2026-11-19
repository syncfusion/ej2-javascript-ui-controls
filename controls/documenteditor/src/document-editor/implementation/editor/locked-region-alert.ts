import { createElement, L10n, updateCSSText } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor';

/**
 * Dismissible banner shown when a user tries to edit a locked or non-editable region.
 * Lives in DocumentEditor so both the standalone editor and the container share it.
 *
 * @private
 */
export class LockedRegionAlert {
    private owner: DocumentEditor;
    private banner: HTMLElement;
    private messageElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private closeIcon: HTMLElement;
    private hideTimer: number;
    private readonly displayDuration: number = 5000;
    private onScrollHandler: EventListener = this.onViewerScroll.bind(this);
    private onCloseClickHandler: EventListener = this.onCloseClick.bind(this);

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    /**
     * Shows the banner and restarts the auto-hide timer.
     *
     * @returns {void}
     * @private
     */
    public show(): void {
        if (!this.owner || !this.owner.element) {
            return;
        }
        this.ensureBanner();
        this.anchorBelowRulers();
        this.wireScroll();
        this.updateLocalizedText();
        this.banner.hidden = false;
        updateCSSText(this.banner, 'display:flex');
        this.restartTimer();
    }

    /**
     * Refreshes the visible banner after the Document Editor locale changes.
     *
     * @returns {void}
     * @private
     */
    public refreshLocale(): void {
        if (!this.isShown) {
            return;
        }
        this.updateLocalizedText();
    }

    /**
     * Recalculates the banner after zoom or resize changes the viewer layout.
     *
     * @returns {void}
     * @private
     */
    public refreshLayout(): void {
        if (!this.isShown) {
            return;
        }
        this.anchorBelowRulers();
    }

    /**
     * Hides the banner and clears the auto-hide timer.
     *
     * @returns {void}
     * @private
     */
    public hide(): void {
        this.clearTimer();
        this.unwireScroll();
        if (this.banner) {
            this.banner.hidden = true;
            updateCSSText(this.banner, 'display:none');
        }
    }

    /**
     * @returns {boolean} True when the banner is currently visible.
     * @private
     */
    public get isShown(): boolean {
        return !!this.banner && !this.banner.hidden && this.banner.style.display !== 'none';
    }

    /**
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.clearTimer();
        this.unwireScroll();
        if (this.closeButton) {
            this.closeButton.removeEventListener('click', this.onCloseClickHandler);
            this.closeButton = undefined;
        }
        this.closeIcon = undefined;
        if (this.banner && this.banner.parentNode) {
            this.banner.parentNode.removeChild(this.banner);
        }
        this.banner = undefined;
        this.messageElement = undefined;
        this.owner = undefined;
    }

    private ensureBanner(): void {
        if (this.banner) {
            return;
        }
        const hostId: string = this.owner.element.id || 'documenteditor';
        this.banner = createElement('div', {
            id: hostId + '_lockedRegionAlert',
            className: 'e-de-locked-alert',
            attrs: { role: 'alert' }
        });
        updateCSSText(this.banner, 'display:none;align-items:center;box-sizing:border-box;gap:8px;height:42px;min-height:40px;max-height:45px;'
            + 'padding:0 8px 0 16px;'
            + 'font-size:14px;line-height:20px;font-weight:400;position:absolute;z-index:2;border-bottom-width:1px;border-bottom-style:solid;');
        this.banner.hidden = true;
        this.messageElement = createElement('span', { className: 'e-de-locked-alert-text' });
        updateCSSText(this.messageElement, 'flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;');
        this.closeButton = createElement('button', {
            className: 'e-de-op-close-button e-de-close-icon e-de-op-icon-btn e-btn e-flat e-icon-btn',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        updateCSSText(this.closeButton, 'position:relative;left:auto;top:auto;flex:0 0 auto;width:28px;height:28px;min-width:28px;padding:0;margin:0;');
        this.closeIcon = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        updateCSSText(this.closeIcon, 'display:inline-block;width:16px;height:16px;font-size:16px;line-height:16px;');
        this.closeButton.appendChild(this.closeIcon);
        this.closeButton.addEventListener('click', this.onCloseClickHandler);
        this.banner.appendChild(this.messageElement);
        this.banner.appendChild(this.closeButton);
        // Below the ruler (which lives inside the viewer) and above the page area.
        const viewerContainer: HTMLElement = this.owner.documentHelper && this.owner.documentHelper.viewerContainer;
        const pageContainer: HTMLElement = this.owner.documentHelper && this.owner.documentHelper.pageContainer;
        if (viewerContainer) {
            viewerContainer.appendChild(this.banner);
        } else {
            this.owner.element.insertBefore(this.banner, this.owner.element.firstChild);
        }
        this.anchorBelowRulers();
    }

    /**
     * Places the banner below the horizontal ruler and to the right of the vertical ruler.
     * Page coordinates are not changed, so the caret stays where it was.
     *
     * @returns {void}
     * @private
     */
    private anchorBelowRulers(): void {
        if (!this.banner || !this.owner || !this.owner.element) {
            return;
        }
        const hostId: string = this.owner.element.id || 'documenteditor';
        const viewer: HTMLElement = this.owner.documentHelper && this.owner.documentHelper.viewerContainer;
        const horizontalRuler: HTMLElement = this.owner.element.querySelector('#' + hostId + '_hRulerBottom') as HTMLElement;
        const verticalRuler: HTMLElement = this.owner.element.querySelector('#' + hostId + '_vRulerBottom') as HTMLElement;
        const top: number = horizontalRuler ? horizontalRuler.offsetHeight : 0;
        let left: number = 0;
        if (verticalRuler && viewer && this.isRulerShown(verticalRuler)) {
            const viewerBox: ClientRect = viewer.getBoundingClientRect();
            const rulerBox: ClientRect = verticalRuler.getBoundingClientRect();
            if (rulerBox.width > 0 && rulerBox.right > viewerBox.left) {
                left = Math.max(0, Math.round(rulerBox.right - viewerBox.left));
            }
        }
        const contentWidth: number = viewer ? viewer.clientWidth : 0;
        const width: number = contentWidth > left ? contentWidth - left : 0;
        updateCSSText(this.banner, 'position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:2;'
            + 'margin-left:' + (viewer ? viewer.scrollLeft : 0) + 'px;');
        updateCSSText(this.banner, 'width:' + (width ? width + 'px' : 'calc(100% - ' + left + 'px)'));
        this.pinToVisibleArea();
    }

    /**
     * Keeps the banner in the visible viewer while the document scrolls.
     * Page coordinates are not changed.
     *
     * @returns {void}
     * @private
     */
    private pinToVisibleArea(): void {
        const viewer: HTMLElement = this.owner && this.owner.documentHelper && this.owner.documentHelper.viewerContainer;
        if (!this.banner || !viewer || this.banner.style.position !== 'absolute') {
            return;
        }
        const top: number = parseFloat(this.banner.style.top) || 0;
        updateCSSText(this.banner, 'margin-top:' + viewer.scrollTop + 'px;margin-left:' + viewer.scrollLeft + 'px;top:' + top + 'px;');
    }

    private wireScroll(): void {
        const viewer: HTMLElement = this.owner && this.owner.documentHelper && this.owner.documentHelper.viewerContainer;
        if (!viewer) {
            return;
        }
        viewer.removeEventListener('scroll', this.onScrollHandler);
        viewer.addEventListener('scroll', this.onScrollHandler);
    }

    private unwireScroll(): void {
        const viewer: HTMLElement = this.owner && this.owner.documentHelper && this.owner.documentHelper.viewerContainer;
        if (viewer) {
            viewer.removeEventListener('scroll', this.onScrollHandler);
        }
        if (this.banner) {
            updateCSSText(this.banner, 'margin-top:0px');
        }
    }

    private onViewerScroll(): void {
        this.pinToVisibleArea();
    }

    private isRulerShown(ruler: HTMLElement): boolean {
        if (!this.owner.documentEditorSettings || !this.owner.documentEditorSettings.showRuler) {
            return false;
        }
        return ruler.style.display !== 'none' && ruler.offsetWidth > 0 && ruler.offsetHeight > 0;
    }

    private updateLocalizedText(): void {
        const locale: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        locale.setLocale(this.owner.locale);
        const message: string = locale.getConstant('You can\'t make this change because the selection is locked');
        const closeLabel: string = locale.getConstant('Close');
        if (this.messageElement) {
            this.messageElement.textContent = message;
        }
        if (this.closeButton) {
            this.closeButton.setAttribute('aria-label', closeLabel);
            this.closeButton.setAttribute('title', closeLabel);
        }
    }

    private restartTimer(): void {
        this.clearTimer();
        this.hideTimer = window.setTimeout((): void => {
            this.hide();
        }, this.displayDuration);
    }

    private clearTimer(): void {
        if (this.hideTimer) {
            window.clearTimeout(this.hideTimer);
            this.hideTimer = undefined;
        }
    }

    private onCloseClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
    }
}
