import { LayoutViewer, PageLayoutViewer } from './viewer';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/** 
 * @private
 */
export class Zoom {
    private viewer: LayoutViewer;

    public setZoomFactor(value: number): void {
        this.onZoomFactorChanged();
        if (!isNullOrUndefined(this.viewer.selection)) {
            this.viewer.selection.updateCaretPosition();
        }
        this.viewer.updateTouchMarkPosition();
        if (!isNullOrUndefined(this.viewer.owner.imageResizerModule)) {
            this.viewer.owner.imageResizerModule.updateImageResizerPosition();
        }
        this.viewer.owner.fireZoomFactorChange();
    }
    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
    }

    //Zoom Implementation Starts
    private onZoomFactorChanged(): void {
        if (this.viewer.zoomFactor > 5) {
            this.viewer.zoomFactor = 5;
        } else if (this.viewer.zoomFactor < 0.1) {
            this.viewer.zoomFactor = 0.1;
        }
        this.zoom();
    }
    private zoom(): void {
        let viewer: LayoutViewer = this.viewer;
        viewer.clearContent();
        (viewer as PageLayoutViewer).handleZoom();
        viewer.updateFocus();
    }
    public onMouseWheelInternal = (event: MouseWheelEvent): void => {
        if (event.ctrlKey === true) {
            event.preventDefault();
            let pageX: number = event.pageX - this.viewer.viewerContainer.offsetLeft;
            if (pageX < this.viewer.pageContainer.offsetWidth) {
                let wheel: boolean = navigator.userAgent.match('Firefox') ? event.detail < 0 : event.wheelDelta > 0;
                let zoomFactor: number = this.viewer.zoomFactor;
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
                this.viewer.zoomFactor = zoomFactor;
            }
        }
    }

    //Zoom Implementation Ends
}