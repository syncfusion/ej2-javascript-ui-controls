import { LayoutViewer, DocumentHelper } from './viewer';
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';

/**
 * @private
 */
export class Zoom {
    private documentHelper: DocumentHelper;
    public setZoomFactor(): void {
        this.onZoomFactorChanged();
        if (!isNullOrUndefined(this.documentHelper.selection)) {
            this.documentHelper.selection.updateCaretPosition();
        }
        this.documentHelper.updateTouchMarkPosition();
        if (!isNullOrUndefined(this.documentHelper.owner.imageResizerModule)) {
            this.documentHelper.owner.imageResizerModule.updateImageResizerPosition();
        }
        this.documentHelper.owner.fireZoomFactorChange();
    }

    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }

    //Zoom Implementation Starts
    private onZoomFactorChanged(): void {
        if (this.documentHelper.zoomFactor > 5) {
            this.documentHelper.zoomFactor = 5;
        } else if (this.documentHelper.zoomFactor < 0.1) {
            this.documentHelper.zoomFactor = 0.1;
        }
        this.zoom();
    }
    private zoom(): void {
        const viewer: LayoutViewer = this.viewer;
        this.documentHelper.clearContent();
        viewer.handleZoom();
        this.documentHelper.updateFocus();
    }
    /**
     * @private
     * @param {WheelEvent} event Specifies the mouse wheen event
     * @returns {void}
     */
    public onMouseWheelInternal = (event: WheelEvent): void => {
        if (event.ctrlKey === true) {
            event.preventDefault();
            const pageX: number = event.pageX - this.documentHelper.viewerContainer.offsetLeft;
            if (pageX < this.documentHelper.pageContainer.offsetWidth) {
                const isFirefFox: RegExpMatchArray = navigator.userAgent.match('Firefox');
                /* eslint-disable */
                const wheel: boolean = isFirefFox ? event.detail < 0 : (Browser.isIE ? (event as any).wheelDelta > 0 : event.deltaY < 0);
                /* eslint-enable */
                let zoomFactor: number = this.documentHelper.zoomFactor;
                if (wheel) {
                    if (zoomFactor <= 4.90) {
                        zoomFactor += .10;
                    } else {
                        zoomFactor = 5.00;
                    }
                } else {
                    if (zoomFactor >= .20) {
                        zoomFactor -= .10;
                    } else {
                        zoomFactor = 0.10;
                    }
                }
                this.documentHelper.zoomFactor = zoomFactor;
            }
        }
    }

    //Zoom Implementation Ends
}
