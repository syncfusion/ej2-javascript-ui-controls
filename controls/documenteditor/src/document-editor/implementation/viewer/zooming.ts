import { LayoutViewer, DocumentHelper } from './viewer';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/** 
 * @private
 */
export class Zoom {
    private documentHelper: DocumentHelper;
    public setZoomFactor(value: number): void {
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
    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    get viewer(): LayoutViewer {
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
        let viewer: LayoutViewer = this.viewer;
        this.documentHelper.clearContent();
        viewer.handleZoom();
        this.documentHelper.updateFocus();
    }
    public onMouseWheelInternal = (event: MouseWheelEvent): void => {
        if (event.ctrlKey === true) {
            event.preventDefault();
            let pageX: number = event.pageX - this.documentHelper.viewerContainer.offsetLeft;
            if (pageX < this.documentHelper.pageContainer.offsetWidth) {
                let wheel: boolean = navigator.userAgent.match('Firefox') ? event.detail < 0 : event.wheelDelta > 0;
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