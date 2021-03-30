/* eslint-disable */
import {
    PdfViewer, PdfViewerBase
} from '../..';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';


/**
 * @hidden
 */
export class InputElement {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    // eslint-disable-next-line
    public inputBoxElement: any;
    /**
     * @private
     */
    public isInFocus: boolean;
    /**
     * @private
     */
    public maxHeight: number;
    /**
     * @private
     */
    public maxWidth: number;
    /**
     * @private
     */
    public fontSize: number;
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.inputBoxElement = document.createElement('input');
        this.inputBoxElement.addEventListener('focusout', this.onFocusOutInputBox.bind(this));
        this.maxHeight = 24.6;
        this.maxWidth = 151;
        this.fontSize = 16;
        this.isInFocus = false;
        this.inputBoxElement.style.position = 'absolute';
        this.inputBoxElement.style.fontFamily = 'Helvetica';
    }

    /**
     * @param currentPosition
     * @param annotation
     * @private
     */
    public editLabel(currentPosition: PointModel, annotation: PdfAnnotationBaseModel): void {
        const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        this.inputBoxElement.value = annotation.labelContent;
        this.inputBoxElement.select();
        annotation.labelContent = '';
        this.pdfViewer.nodePropertyChange(annotation, {});
        this.inputBoxElement.style.left = ((currentPosition.x) * zoomFactor) + 'px';
        this.inputBoxElement.style.top = ((currentPosition.y) * zoomFactor) + 'px';
        this.inputBoxElement.style.maxHeight = (this.maxHeight * zoomFactor) + 'px';
        this.inputBoxElement.style.maxWidth = (this.maxWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.fontSize = (this.fontSize * zoomFactor) + 'px';
        this.inputBoxElement.style.textAlign = 'center';
        if (annotation && annotation.wrapper && annotation.wrapper.bounds) {
            // eslint-disable-next-line max-len
            this.inputBoxElement.style.width = annotation.wrapper.bounds.width ? (annotation.wrapper.bounds.width / 2 * zoomFactor) + 1 + 'px' : (this.maxWidth * zoomFactor) + 'px';
            let inputEleWidth: number = parseFloat(this.inputBoxElement.style.width);
            inputEleWidth = inputEleWidth > (this.maxWidth * zoomFactor) ? (this.maxWidth * zoomFactor) : inputEleWidth;
            if (annotation.wrapper.bounds.left) {
                // eslint-disable-next-line max-len
                this.inputBoxElement.style.left = ((annotation.wrapper.bounds.left + (annotation.wrapper.bounds.width / 2) - (inputEleWidth / (zoomFactor * 2))) * zoomFactor) + 'px';
            }
            if (annotation.wrapper.bounds.top) {
                // eslint-disable-next-line max-len
                if (annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'LineWidthArrowHead' ||
                    annotation.shapeAnnotationType === 'Distance' || annotation.shapeAnnotationType === 'Polygon') {
                    // eslint-disable-next-line max-len
                    this.inputBoxElement.style.top = ((annotation.wrapper.bounds.top + (annotation.wrapper.bounds.height / 2) - (this.maxHeight)) * zoomFactor) + 'px';
                } else {
                    // eslint-disable-next-line max-len
                    this.inputBoxElement.style.top = ((annotation.wrapper.bounds.top + (annotation.wrapper.bounds.height / 2) - (this.maxHeight / 2)) * zoomFactor) + 'px';
                }
            }
            this.inputBoxElement.maxLength = annotation.labelMaxLength;
            this.inputBoxElement.fontFamily = annotation.fontFamily;
            this.inputBoxElement.style.color = annotation.fontColor;
            this.inputBoxElement.style.border = '1px solid #ffffff00';
            this.inputBoxElement.style.padding = '2px';
            this.inputBoxElement.style.background = annotation.labelFillColor;
        }
        pageDiv.appendChild(this.inputBoxElement);
        this.isInFocus = true;
        this.inputBoxElement.focus();
    }

    /**
     * @private
     */
    public onFocusOutInputBox(): void {
        const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
        let inputEleHeight: number = parseFloat(this.inputBoxElement.style.height);
        let inputEleWidth: number = parseFloat(this.inputBoxElement.style.width);
        this.isInFocus = false;
        const selectedAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        // eslint-disable-next-line
        if (selectedAnnotation) {
            inputEleWidth = ((inputEleWidth - 1) / this.pdfViewerBase.getZoomFactor());
            inputEleHeight = ((inputEleHeight - 1) / this.pdfViewerBase.getZoomFactor());
            // this.pdfViewer.annotation.modifyDynamicTextValue(this.inputBoxElement.value, this.selectedAnnotation.annotName);
            selectedAnnotation.labelContent = this.inputBoxElement.value;
            selectedAnnotation.notes = this.inputBoxElement.value;
            // eslint-disable-next-line max-len
            if (selectedAnnotation.shapeAnnotationType === 'Rectangle' || selectedAnnotation.shapeAnnotationType === 'Ellipse' || selectedAnnotation.shapeAnnotationType === 'Line'
                || selectedAnnotation.shapeAnnotationType === 'LineWidthArrowHead') {
                this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('labelContent', pageIndex, selectedAnnotation);
            } else if (selectedAnnotation.shapeAnnotationType === 'Radius' && selectedAnnotation.measureType) {
                this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('labelContent', pageIndex, selectedAnnotation);
            }
            // eslint-disable-next-line
            this.pdfViewer.nodePropertyChange(selectedAnnotation, {});
            this.pdfViewer.renderSelector(selectedAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
            // eslint-disable-next-line
            let commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
            if (commentsDiv && commentsDiv.childNodes && this.inputBoxElement.value !== 'label') {
                if (commentsDiv.childNodes[0].ej2_instances) {
                    commentsDiv.childNodes[0].ej2_instances[0].value = this.inputBoxElement.value;
                } else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                    commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = this.inputBoxElement.value;
                }
            }
        }
        pageDiv.removeChild(this.inputBoxElement);
        const canvass: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        // eslint-disable-next-line
        this.pdfViewer.renderDrawing(canvass as any, pageIndex);
    }

    /**
     * @param bounds
     * @param pageIndex
     * @param bounds
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public calculateLabelBounds(bounds: any, pageIndex?: number): any {
        // eslint-disable-next-line
        let labelBounds: any = {};
        if (bounds) {
            let labelTop: number = 0;
            let labelLeft: number = 0;
            let labelWidth: number = 0;
            const labelHeight: number = 24.6;
            const labelMaxWidth: number = 151;
            if (pageIndex === undefined) {
                pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            }
            const rotation: number = this.pdfViewerBase.pageSize[pageIndex].rotation;
            if (bounds.width) {
                // eslint-disable-next-line max-len
                labelWidth = (bounds.width / 2);
                labelWidth = (labelWidth > 0 && labelWidth < labelMaxWidth) ? labelWidth : labelMaxWidth;
            }
            if (bounds.left) {
                // eslint-disable-next-line max-len
                labelLeft = (bounds.left + (bounds.width / 2) - (labelWidth / 2));
            }
            if (bounds.top) {
                // eslint-disable-next-line max-len
                labelTop = (bounds.top + (bounds.height / 2) - (labelHeight / 2));
            }
            if (rotation === 1 || rotation === 3) {
                // eslint-disable-next-line max-len
                labelBounds = { left: labelLeft, top: labelTop, width: (labelWidth - labelHeight) + (labelWidth / 2), height: (labelHeight * 2) + labelWidth, right: 0, bottom: 0 };
            } else {
                // eslint-disable-next-line max-len
                labelBounds = { left: labelLeft, top: labelTop, width: labelWidth, height: labelHeight, right: 0, bottom: 0 };
            }
        }
        return labelBounds;
    }

    /**
     * @param bounds
     * @private
     */
    // eslint-disable-next-line
    public calculateLabelBoundsFromLoadedDocument(bounds: any): any {
        // eslint-disable-next-line
        let labelBounds: any = {};
        if (bounds) {
            let labelTop: number = 0;
            let labelLeft: number = 0;
            let labelWidth: number = 0;
            const labelHeight: number = 24.6;
            const labelMaxWidth: number = 151;
            if (bounds.Width) {
                // eslint-disable-next-line max-len
                labelWidth = (bounds.Width / 2);
                labelWidth = (labelWidth > 0 && labelWidth < labelMaxWidth) ? labelWidth : labelMaxWidth;
            }
            if (bounds.Left) {
                // eslint-disable-next-line max-len
                labelLeft = (bounds.Left + (bounds.Width / 2) - (labelWidth / 2));
            }
            if (bounds.Top) {
                // eslint-disable-next-line max-len
                labelTop = (bounds.Top + (bounds.Height / 2) - (labelHeight / 2));
            }
            // eslint-disable-next-line max-len
            labelBounds = { left: labelLeft, top: labelTop, width: labelWidth, height: labelHeight, right: 0, bottom: 0 };
        }
        return labelBounds;
    }
}
