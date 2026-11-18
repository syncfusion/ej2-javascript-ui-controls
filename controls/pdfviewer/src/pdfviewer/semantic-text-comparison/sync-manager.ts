import { PdfViewer } from '../index';

/**
 * Synchronizes scroll position, zoom level, and page navigation between two viewers
 * @hidden
 */
export class SyncManager {
    private leftViewer: PdfViewer;
    private rightViewer: PdfViewer;
    private isSyncing: boolean = false;
    private syncEnabled: boolean = false;
    private watchTimers: number[] = [];

    /**
     * Create a new SyncManager instance
     * @param {PdfViewer} leftViewer - Left viewer instance
     * @param {PdfViewer} rightViewer - Right viewer instance
     * @returns {SyncManager} Creates a new SyncManager instance.
     */
    constructor(leftViewer: PdfViewer, rightViewer: PdfViewer) {
        this.leftViewer = leftViewer;
        this.rightViewer = rightViewer;
    }

    /**
     * Synchronize scrolling, zooming, and page navigation between this viewer and a target viewer.
     * This enables bidirectional synchronization - changes in either viewer will be synced to the other.
     * @private
     * @param {PdfViewer} targetViewer - The viewer instance to synchronize with.
     * @param {boolean} enable - True to enable synchronization, false to disable and clean up all listeners.
     * @returns {void}
     */
    public syncViewers(targetViewer: PdfViewer, enable: boolean = true): void {
        // Validate target viewer
        if (!targetViewer) {
            throw new Error('Target viewer cannot be null or undefined.');
        }
        if (!(targetViewer instanceof PdfViewer)) {
            throw new Error('Target viewer must be a PdfViewer instance.');
        }
        if (targetViewer === this.leftViewer) {
            throw new Error('Cannot synchronize a viewer with itself.');
        }
        // Enable or disable synchronization
        if (enable) {
            this.enableSync();
        } else {
            this.disableSync();
        }
    }
    /**
     * Enable synchronization between the two viewers.
     * Starts polling for scroll, zoom, and page changes on both viewers.
     * @private
     * @returns {void}
     */
    private enableSync(): void {
        if (this.syncEnabled) {
            return;
        }
        this.syncEnabled = true;
        this.watchTimers = [];
        if (this.leftViewer && this.rightViewer) {
            const scrollWatcherId1: number = this.watchViewerScroll(this.leftViewer, this.rightViewer);
            const scrollWatcherId2: number = this.watchViewerScroll(this.rightViewer, this.leftViewer);
            const zoomWatcherId1: number = this.watchViewerZoom(this.leftViewer, this.rightViewer);
            const zoomWatcherId2: number = this.watchViewerZoom(this.rightViewer, this.leftViewer);
            this.watchTimers.push(scrollWatcherId1, scrollWatcherId2, zoomWatcherId1, zoomWatcherId2);
        }
    }
    /**
     * Disable synchronization and clean up all timers.
     * @private
     * @returns {void}
     */
    private disableSync(): void {
        if (!this.syncEnabled) {
            return;
        }
        this.syncEnabled = false;
        this.watchTimers.forEach((timerId: number) => {
            clearInterval(timerId);
        });
        this.watchTimers = [];
    }
    /**
     * Watch for zoom changes in source viewer and sync to target.
     * Uses polling to detect zoom level changes.
     * @private
     * @param {PdfViewer} sourceViewer - Source viewer to monitor
     * @param {PdfViewer} targetViewer - Target viewer to sync
     * @returns {number} The interval ID for cleanup
     */
    private watchViewerZoom(sourceViewer: PdfViewer, targetViewer: PdfViewer): number {
        let lastZoom: number = sourceViewer.zoomPercentage;
        const watchInterval: number = window.setInterval(() => {
            if (!this.syncEnabled) {
                clearInterval(watchInterval);
                return;
            }
            if (!sourceViewer || !targetViewer) {
                clearInterval(watchInterval);
                return;
            }
            const currentZoom: number = sourceViewer.zoomPercentage;
            if (Math.abs(currentZoom - lastZoom) > 0.1 && !this.isSyncing) {
                lastZoom = currentZoom;
                this.syncZoom(sourceViewer, targetViewer);
            }
        }, 10);
        return watchInterval;
    }
    /**
     * Watch for scroll changes in source viewer and sync to target.
     * Tracks both vertical (Y-axis) and horizontal (X-axis) scroll changes.
     * @private
     * @param {PdfViewer} sourceViewer - Source viewer to monitor
     * @param {PdfViewer} targetViewer - Target viewer to sync
     * @returns {number} The interval ID for cleanup
     */
    private watchViewerScroll(sourceViewer: PdfViewer, targetViewer: PdfViewer): number {
        let lastScrollY: number = 0;
        let lastScrollX: number = 0;
        const watchInterval: number = window.setInterval(() => {
            if (!this.syncEnabled) {
                clearInterval(watchInterval);
                return;
            }
            if (!sourceViewer || !targetViewer || !sourceViewer.viewerBase) {
                clearInterval(watchInterval);
                return;
            }
            try {
                const child: any = (sourceViewer.viewerBase as any).pageContainer;
                const pageContainer: any = child.closest('.e-pv-viewer-container');
                if (pageContainer) {
                    const currentScrollY: number = pageContainer.scrollTop;
                    const currentScrollX: number = pageContainer.scrollLeft;
                    if (Math.abs(currentScrollY - lastScrollY) > 2 && !this.isSyncing) {
                        lastScrollY = currentScrollY;
                        this.syncScroll(sourceViewer, targetViewer);
                    }
                    if (Math.abs(currentScrollX - lastScrollX) > 2 && !this.isSyncing) {
                        lastScrollX = currentScrollX;
                        this.syncScroll(sourceViewer, targetViewer);
                    }
                }
            } catch (e) {
                // Silently continue if scroll detection fails
            }
        }, 3);

        return watchInterval;
    }
    /**
     * Sync zoom level from source to target viewer.
     * @private
     * @param {PdfViewer} sourceViewer - Source viewer
     * @param {PdfViewer} targetViewer - Target viewer to sync to
     * @returns {void}
     */
    private syncZoom(sourceViewer: PdfViewer, targetViewer: PdfViewer): void {
        if (this.isSyncing || !this.syncEnabled) {
            return;
        }
        this.isSyncing = true;
        const zoomValue: number = sourceViewer.zoomPercentage;
        if (zoomValue !== undefined && targetViewer) {
            if (targetViewer.magnification && typeof targetViewer.magnification.zoomTo === 'function') {
                targetViewer.magnification.zoomTo(zoomValue);
            }
        }
        this.isSyncing = false;
    }
    /**
     * Sync scroll position from source to target viewer.
     * Handles both vertical and horizontal scroll.
     * @private
     * @param {PdfViewer} sourceViewer - Source viewer
     * @param {PdfViewer} targetViewer - Target viewer to sync to
     * @returns {void}
     */
    private syncScroll(sourceViewer: PdfViewer, targetViewer: PdfViewer): void {
        if (this.isSyncing || !this.syncEnabled) {
            return;
        }
        this.isSyncing = true;
        if (sourceViewer.viewerBase && targetViewer && targetViewer.viewerBase) {
            const sourceChild: any = (sourceViewer.viewerBase as any).pageContainer;
            const sourceContainer: any = sourceChild.closest('.e-pv-viewer-container');
            const targetChild: any = (targetViewer.viewerBase as any).pageContainer;
            const targetContainer: any = targetChild.closest('.e-pv-viewer-container');
            if (sourceContainer && targetContainer) {
                const scrollY: number = sourceContainer.scrollTop;
                const scrollX: number = sourceContainer.scrollLeft;
                if (targetContainer.scrollTop !== scrollY) {
                    targetContainer.scrollTop = scrollY;
                }
                if (targetContainer.scrollLeft !== scrollX) {
                    targetContainer.scrollLeft = scrollX;
                }
            }
        }
        this.isSyncing = false;
    }
}
