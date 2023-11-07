import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Matrix, Point, Rect, Size } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBorder, PdfDocument, PdfPage, PdfRotationAngle, PdfSquareAnnotation, PdfAnnotationFlag, _PdfDictionary, _PdfName, PdfBorderEffectStyle, PdfBorderEffect, PdfAnnotationState, PdfAnnotationStateModel, PdfCircleAnnotation, PdfPopupAnnotation, PdfLineAnnotation, PdfLineEndingStyle, PdfFont, PdfFontStyle, PdfFontFamily, PdfStandardFont, PdfStringFormat, PdfTextAlignment, PdfRubberStampAnnotation, PdfPen, PdfBrush, PdfGraphics, PdfVerticalAlignment, PdfGraphicsState, _PdfPath, PdfRubberStampAnnotationIcon, PdfBitmap, PdfImage, PdfPolyLineAnnotation, PdfCircleMeasurementType, PdfPopupIcon, PdfFreeTextAnnotation, PdfBorderStyle, PdfAnnotationCollection, PdfRectangleAnnotation, PdfPolygonAnnotation, PdfEllipseAnnotation, PdfTextMarkupAnnotation, PdfAnnotation, PdfInkAnnotation, PdfAngleMeasurementAnnotation, PdfLineIntent, PdfAppearance, PdfTemplate, PdfTextMarkupAnnotationType, PdfLineCaptionType, PdfMeasurementUnit, PdfAnnotationIntent, PdfTrueTypeFont, _decode, _PdfBaseStream} from '@syncfusion/ej2-pdf';
import { PdfViewer, PdfViewerBase, SizeBase, PageRenderer } from '../index';
import { PdfPath, PdfReferenceHolder, Rectangle, RectangleF, SizeF } from '@syncfusion/ej2-pdf-export';

/**
 * AnnotationRenderer
 *
 * @hidden
 */
export class AnnotationRenderer {

    private formats: string[] = ['M/d/yyyy h:mm:ss tt', 'M/d/yyyy, h:mm:ss tt', 'M/d/yyyy h:mm tt',
        'MM/dd/yyyy hh:mm:ss', 'M/d/yyyy h:mm:ss',
        'M/d/yyyy hh:mm tt', 'M/d/yyyy hh tt',
        'M/d/yyyy h:mm', 'M/d/yyyy h:mm',
        'MM/dd/yyyy hh:mm', 'M/dd/yyyy hh:mm', 'dd/M/yyyy h:mm:ss tt', 'dd/M/yyyy, h:mm:ss tt',
        'M/d/yy, h:mm:ss tt', 'yyyy/MM/dd, h:mm:ss tt', 'dd/MMM/yy, h:mm:ss tt',
        'yyyy-MM-dd, h:mm:ss tt', 'dd-MMM-yy, h:mm:ss tt', 'MM-dd-yy, h:mm:ss tt', 'YYYY-MM-DDTHH:mm:ss.sssZ', '±YYYYYY-MM-DDTHH:mm:ss.sssZ', 'yyyy-MM-ddTHH:mm:ss.fffZ'];

    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private defaultWidth: number;
    private defaultHeight: number;
    public m_renderer: PageRenderer;

    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @param details
     * @param page
     *
     * @private
     */
    public addShape(details: any, page: PdfPage): void {
        const shapeAnnotation: any = details;
        const isLock: boolean = this.checkAnnotationLock(shapeAnnotation);
        if (!isNullOrUndefined(shapeAnnotation.author)) {
            shapeAnnotation.author = 'Guest';
        }
        if (!isNullOrUndefined(shapeAnnotation.shapeAnnotationType) && shapeAnnotation.shapeAnnotationType === 'Line') {
            const points: any = JSON.parse(shapeAnnotation.vertexPoints);

            const linePoints: number[] = this.getSaveVertexPoints(points, page);

            const lineAnnotation: PdfLineAnnotation = new PdfLineAnnotation(linePoints);

            if (!isNullOrUndefined(shapeAnnotation.note)) {
                lineAnnotation.text = shapeAnnotation.note.toString();
            }
            lineAnnotation.author = shapeAnnotation.author.toString();
            lineAnnotation._dictionary.set('NM', shapeAnnotation.annotName.toString());

            if (!isNullOrUndefined(shapeAnnotation.subject)) {
                lineAnnotation.subject = shapeAnnotation.subject.toString();
            }

            if (!isNullOrUndefined(shapeAnnotation.strokeColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const strokeColor: any = JSON.parse(shapeAnnotation.strokeColor);
                // eslint-disable-next-line max-len
                const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                lineAnnotation.color = color;
            }
            if (!isNullOrUndefined(shapeAnnotation.fillColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fillColor: any = JSON.parse(shapeAnnotation.fillColor);
                const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                lineAnnotation.innerColor = innerColor;
                if (fillColor.a < 1 && fillColor.a > 0) {
                    lineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    lineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(shapeAnnotation.opacity)) {
                lineAnnotation.opacity = shapeAnnotation.opacity;
            }
            const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = shapeAnnotation.thickness;
            lineBorder.style = shapeAnnotation.borderStyle;
            lineBorder.dash = shapeAnnotation.borderDashArray;
            lineAnnotation.border = lineBorder;
            lineAnnotation.rotationAngle = this.getRotateAngle(shapeAnnotation.rotateAngle);

            lineAnnotation.lineEndingStyle.begin = this.getLineEndingStyle(shapeAnnotation.lineHeadStart);
            lineAnnotation.lineEndingStyle.end = this.getLineEndingStyle(shapeAnnotation.lineHeadEnd);

            let dateValue: Date;
            if (!isNullOrUndefined(shapeAnnotation.modifiedDate) && !isNaN(Date.parse(shapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(shapeAnnotation.modifiedDate));
                lineAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = shapeAnnotation.comments;
            const bounds: any = JSON.parse(shapeAnnotation.bounds);
            lineAnnotation.bounds = bounds;
            lineAnnotation.bounds.x = bounds.left;
            lineAnnotation.bounds.y = bounds.top;

            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    lineAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], lineAnnotation.bounds));
                }
            }
            const reviewDetails: any = shapeAnnotation.review;
            lineAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, lineAnnotation.bounds));

            if (!isNullOrUndefined(shapeAnnotation.isLocked && shapeAnnotation.isLocked)) {
                lineAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            let isPrint : boolean = false;
            let isCommentLock : boolean = false;
            if (shapeAnnotation.isCommentLock && shapeAnnotation['isCommentLock'] !== null) {
                isCommentLock = Boolean(shapeAnnotation['isCommentLock'].toString());
            }

            if (shapeAnnotation.isPrint && shapeAnnotation['isPrint'] !== null) {
                isPrint = Boolean(shapeAnnotation['isPrint'].toString());
            }

            if (isCommentLock && isPrint) {
                lineAnnotation._annotFlags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
            } else if (isPrint) {
                lineAnnotation._annotFlags = PdfAnnotationFlag.print;
            } else if (isCommentLock) {
                lineAnnotation._annotFlags = PdfAnnotationFlag.readOnly;
            }
            if (!isNullOrUndefined(shapeAnnotation.customData)) {
                lineAnnotation.setValues('CustomData', shapeAnnotation.customData);
            }
            if (shapeAnnotation.allowedInteractions && shapeAnnotation['allowedInteractions'] != null){
                lineAnnotation.setValues('AllowedInteractions', JSON.stringify(shapeAnnotation['allowedInteractions']));
            }
            lineAnnotation.setAppearance(true);
            page.annotations.add(lineAnnotation);
        }
        else if (!isNullOrUndefined(shapeAnnotation.shapeAnnotationType) && shapeAnnotation.shapeAnnotationType === 'Square') {
            const bounds: Rect = JSON.parse(shapeAnnotation.bounds);
            if (isNullOrUndefined(bounds.left)) {
                shapeAnnotation.bounds.left = 0;
            }
            if (isNullOrUndefined(bounds.top)) {
                shapeAnnotation.bounds.top = 0;
            }
            const cropValues : PointBase = this.getCropBoxValue(page, false);
            const left: number = this.convertPixelToPoint(bounds.left);
            const top: number = this.convertPixelToPoint(bounds.top);
            const width: number = this.convertPixelToPoint(bounds.width);
            const height: number = this.convertPixelToPoint(bounds.height);
            let cropX : number = 0;
            let cropY : number = 0;
            if (cropValues.x != 0 && cropValues.y != 0 && cropValues.x == left) {
                cropX = cropValues.x;
                cropY = cropValues.y;
            }

            else if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
                cropX = cropValues.x;
                cropY = cropValues.y;
            }

            // eslint-disable-next-line max-len
            const squareAnnotation: PdfSquareAnnotation = new PdfSquareAnnotation(cropX + left, cropY + top, width, height);

            if (!isNullOrUndefined(shapeAnnotation.note)) {
                squareAnnotation.text = shapeAnnotation.note.toString();
            }
            squareAnnotation.author = shapeAnnotation.author.toString();
            squareAnnotation._dictionary.set('NM', shapeAnnotation.annotName.toString());
            if (!isNullOrUndefined(shapeAnnotation.subject)) {
                squareAnnotation.subject = shapeAnnotation.subject.toString();
            }
            if (!isNullOrUndefined(shapeAnnotation.strokeColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const strokeColor: any = JSON.parse(shapeAnnotation.strokeColor);
                // eslint-disable-next-line max-len
                const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                squareAnnotation.color = color;
            }
            if (!isNullOrUndefined(shapeAnnotation.fillColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fillColor: any = JSON.parse(shapeAnnotation.fillColor);
                // eslint-disable-next-line max-len
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    squareAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    squareAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    squareAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(shapeAnnotation.opacity)) {
                squareAnnotation.opacity = shapeAnnotation.opacity;
            }
            const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = shapeAnnotation.thickness;
            lineBorder.style = shapeAnnotation.borderStyle;
            lineBorder.dash = shapeAnnotation.borderDashArray;
            squareAnnotation.border = lineBorder;
            squareAnnotation.rotationAngle = this.getRotateAngle(shapeAnnotation.rotateAngle);

            let dateValue: Date;
            if (!isNullOrUndefined(shapeAnnotation.modifiedDate) && !isNaN(Date.parse(shapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(shapeAnnotation.modifiedDate));
                squareAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = shapeAnnotation.comments;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    squareAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], squareAnnotation.bounds));
                }
            }
            const reviewDetails: any = shapeAnnotation.review;
            squareAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, squareAnnotation.bounds));

            if (!isNullOrUndefined(shapeAnnotation.isCloudShape) && shapeAnnotation.isCloudShape) {
                const borderEffect: PdfBorderEffect = new PdfBorderEffect();
                borderEffect.style = PdfBorderEffectStyle.cloudy;
                borderEffect.intensity = shapeAnnotation.cloudIntensity;
                squareAnnotation.borderEffect = borderEffect;
                const rectDifferences: string[] = JSON.parse(shapeAnnotation.rectangleDifference);
                if (rectDifferences.length > 0) {
                    const rd: number[] = this.getRDValues(rectDifferences);
                    squareAnnotation._dictionary.update('RD', rd);
                }
            }


            if (!isNullOrUndefined(shapeAnnotation.isLocked) && shapeAnnotation.isLocked) {
                squareAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            let isPrint : boolean = false;
            let isCommentLock : boolean = false;
            if (shapeAnnotation.isCommentLock && shapeAnnotation['isCommentLock'] !== null) {
                isCommentLock = Boolean(shapeAnnotation['isCommentLock'].toString());
            }

            if (shapeAnnotation.isPrint && shapeAnnotation['isPrint'] !== null) {
                isPrint = Boolean(shapeAnnotation['isPrint'].toString());
            }

            if (isCommentLock && isPrint) {
                squareAnnotation._annotFlags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
            } else if (isPrint) {
                squareAnnotation._annotFlags = PdfAnnotationFlag.print;
            } else if (isCommentLock) {
                squareAnnotation._annotFlags = PdfAnnotationFlag.readOnly;
            }
            if (!isNullOrUndefined(shapeAnnotation.customData)) {
                squareAnnotation.setValues('CustomData', shapeAnnotation.customData);
            }
            if (shapeAnnotation.allowedInteractions && shapeAnnotation['allowedInteractions'] != null){
                squareAnnotation.setValues('AllowedInteractions', JSON.stringify(shapeAnnotation['allowedInteractions']));
            }
            squareAnnotation.setAppearance(true);
            page.annotations.add(squareAnnotation);

        }
        else if (!isNullOrUndefined(shapeAnnotation.shapeAnnotationType) && shapeAnnotation.shapeAnnotationType === 'Circle') {
            const bounds: Rect = JSON.parse(shapeAnnotation.bounds);
            const left: number = this.convertPixelToPoint(bounds.left);
            const top: number = this.convertPixelToPoint(bounds.top);
            const width: number = this.convertPixelToPoint(bounds.width);
            const height: number = this.convertPixelToPoint(bounds.height);
            if (isNullOrUndefined(bounds.left)) {
                shapeAnnotation.bounds.left = 0;
            }
            if (isNullOrUndefined(bounds.top)) {
                shapeAnnotation.bounds.top = 0;
            }

            const cropValues : PointBase = this.getCropBoxValue(page, false);
            let cropX : number = 0;
            let cropY : number = 0;
            if (cropValues.x != 0 && cropValues.y != 0 && cropValues.x == left) {
                cropX = cropValues.x;
                cropY = cropValues.y;
            }

            else if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
                cropX = cropValues.x;
                cropY = cropValues.y;
            }
            // eslint-disable-next-line max-len
            const circleAnnotation: PdfCircleAnnotation = new PdfCircleAnnotation(cropX + left, cropY + top, width, height);

            if (!isNullOrUndefined(shapeAnnotation.note)) {
                circleAnnotation.text = shapeAnnotation.note.toString();
            }

            circleAnnotation.author = shapeAnnotation.author.toString();

            circleAnnotation._dictionary.set('NM', shapeAnnotation.annotName.toString());

            if (!isNullOrUndefined(shapeAnnotation.subject)) {
                circleAnnotation.subject = shapeAnnotation.subject.toString();
            }

            if (!isNullOrUndefined(shapeAnnotation.strokeColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const strokeColor: any = JSON.parse(shapeAnnotation.strokeColor);
                // eslint-disable-next-line max-len
                const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                circleAnnotation.color = color;
            }

            if (!isNullOrUndefined(shapeAnnotation.fillColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fillColor: any = JSON.parse(shapeAnnotation.fillColor);
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    circleAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    circleAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    circleAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(shapeAnnotation.opacity)) {
                circleAnnotation.opacity = shapeAnnotation.opacity;
            }
            const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = shapeAnnotation.thickness;
            lineBorder.style = shapeAnnotation.borderStyle;
            lineBorder.dash = shapeAnnotation.borderDashArray;
            circleAnnotation.border = lineBorder;
            circleAnnotation.rotationAngle = this.getRotateAngle(shapeAnnotation.rotateAngle);
            let dateValue: Date;
            if (!isNullOrUndefined(shapeAnnotation.modifiedDate) && !isNaN(Date.parse(shapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(shapeAnnotation.modifiedDate));
                circleAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = shapeAnnotation.comments;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    circleAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], circleAnnotation.bounds));
                }
            }
            const reviewDetails: any = shapeAnnotation.review;
            circleAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, circleAnnotation.bounds));

            if (!isNullOrUndefined(shapeAnnotation.isCloudShape) && shapeAnnotation.isCloudShape) {
                const borderEffect: PdfBorderEffect = new PdfBorderEffect();
                borderEffect.style = PdfBorderEffectStyle.cloudy;
                borderEffect.intensity = shapeAnnotation.cloudIntensity;
                circleAnnotation._borderEffect = borderEffect;
                const rectDifferences: string[] = JSON.parse(shapeAnnotation.rectangleDifference);
                if (rectDifferences.length > 0) {
                    const rd: number[] = this.getRDValues(rectDifferences);
                    circleAnnotation._dictionary.update('RD', rd);
                }
            }

            if (!isNullOrUndefined(shapeAnnotation.isLocked && shapeAnnotation.isLocked)) {
                circleAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            let isPrint : boolean = false;
            let isCommentLock : boolean = false;
            if (shapeAnnotation.isCommentLock && shapeAnnotation['isCommentLock'] !== null) {
                isCommentLock = Boolean(shapeAnnotation['isCommentLock'].toString());
            }

            if (shapeAnnotation.isPrint && shapeAnnotation['isPrint'] !== null) {
                isPrint = Boolean(shapeAnnotation['isPrint'].toString());
            }

            if (isCommentLock && isPrint) {
                circleAnnotation._annotFlags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
            } else if (isPrint) {
                circleAnnotation._annotFlags = PdfAnnotationFlag.print;
            } else if (isCommentLock) {
                circleAnnotation._annotFlags = PdfAnnotationFlag.readOnly;
            }
            if (!isNullOrUndefined(shapeAnnotation.customData)) {
                circleAnnotation.setValues('CustomData', shapeAnnotation.customData);
            }
            if (shapeAnnotation.allowedInteractions && shapeAnnotation['allowedInteractions'] != null){
                circleAnnotation.setValues('AllowedInteractions', JSON.stringify(shapeAnnotation['allowedInteractions']));
            }
            circleAnnotation.setAppearance(true);
            page.annotations.add(circleAnnotation);
        }
        else if (!isNullOrUndefined(shapeAnnotation.shapeAnnotationType) && shapeAnnotation.shapeAnnotationType === 'Polygon') {
            const points: any = JSON.parse(shapeAnnotation.vertexPoints);
            const linePoints: number[] = this.getSaveVertexPoints(points, page);
            const bounds: Rect = JSON.parse(shapeAnnotation.bounds);
            if (isNullOrUndefined(bounds.left)) {
                shapeAnnotation.bounds.left = 0;
            }
            if (isNullOrUndefined(bounds.top)) {
                shapeAnnotation.bounds.top = 0;
            }
            const left: number = this.convertPixelToPoint(bounds.left);
            const top: number = this.convertPixelToPoint(bounds.top);
            const width: number = this.convertPixelToPoint(bounds.width);
            const height: number = this.convertPixelToPoint(bounds.height);
            const polygonAnnotation: PdfPolygonAnnotation = new PdfPolygonAnnotation(linePoints);
            polygonAnnotation.bounds = new RectangleF(left, top, width, height);
            if (!isNullOrUndefined(shapeAnnotation.note)) {
                polygonAnnotation.text = shapeAnnotation.note.toString();
            }
            polygonAnnotation.author = shapeAnnotation.author.toString();
            if (!isNullOrUndefined(shapeAnnotation.subject)) {
                polygonAnnotation.subject = shapeAnnotation.subject.toString();
            }
            polygonAnnotation._dictionary.set('NM', shapeAnnotation.annotName.toString());
            if (!isNullOrUndefined(shapeAnnotation.strokeColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const strokeColor: any = JSON.parse(shapeAnnotation.strokeColor);
                // eslint-disable-next-line max-len
                const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                polygonAnnotation.color = color;
            }
            if (!isNullOrUndefined(shapeAnnotation.fillColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fillColor: any = JSON.parse(shapeAnnotation.fillColor);
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    polygonAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    polygonAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    polygonAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(shapeAnnotation.opacity)) {
                polygonAnnotation.opacity = shapeAnnotation.opacity;
            }
            const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = shapeAnnotation.thickness;
            lineBorder.style = shapeAnnotation.borderStyle;
            lineBorder.dash = shapeAnnotation.borderDashArray;
            polygonAnnotation.border = lineBorder;
            polygonAnnotation.rotationAngle = this.getRotateAngle(shapeAnnotation.rotateAngle);
            let dateValue: Date;
            if (!isNullOrUndefined(shapeAnnotation.modifiedDate) && !isNaN(Date.parse(shapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(shapeAnnotation.modifiedDate));
                polygonAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = shapeAnnotation.comments;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    polygonAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], polygonAnnotation.bounds));
                }
            }
            const reviewDetails: any = shapeAnnotation.review;
            polygonAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, polygonAnnotation.bounds));
            if (!isNullOrUndefined(shapeAnnotation.isCloudShape) && shapeAnnotation.isCloudShape) {
                const borderEffect: PdfBorderEffect = new PdfBorderEffect();
                borderEffect.style = PdfBorderEffectStyle.cloudy;
                borderEffect.intensity = shapeAnnotation.cloudIntensity;
                polygonAnnotation.borderEffect = borderEffect;
                const rectDifferences: string[] = JSON.parse(shapeAnnotation.rectangleDifference);
                if (rectDifferences.length > 0) {
                    const rd: number[] = this.getRDValues(rectDifferences);
                    polygonAnnotation._dictionary.update('RD', rd);
                }
            }

            if (!isNullOrUndefined(shapeAnnotation.isLocked && shapeAnnotation.isLocked)) {
                polygonAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            let isPrint: boolean = true;
            let isCommentLock: boolean = false;
            if (!isNullOrUndefined(shapeAnnotation.isCommentLock) && shapeAnnotation.isCommentLock) {
                isCommentLock = true;
            }
            if (!isNullOrUndefined(shapeAnnotation.isPrint) && shapeAnnotation.isPrint) {
                isPrint = true;
            }
            if (isCommentLock && isPrint){
                polygonAnnotation.flags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
            }
            if (isLock){
                polygonAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            else if (isCommentLock){
                polygonAnnotation.flags = PdfAnnotationFlag.readOnly;
            }
            else {
                polygonAnnotation.flags = PdfAnnotationFlag.print;
            }
            if (!isNullOrUndefined(shapeAnnotation.customData)) {
                polygonAnnotation.setValues('CustomData', shapeAnnotation.customData);
            }
            if (!isNullOrUndefined(shapeAnnotation.allowedInteractions)) {
                polygonAnnotation.setValues('AllowedInteractions', JSON.stringify(shapeAnnotation.allowedInteractions));
            }
            polygonAnnotation.setAppearance(true);
            page.annotations.add(polygonAnnotation);
        }
        else if (!isNullOrUndefined(shapeAnnotation.shapeAnnotationType) && shapeAnnotation.shapeAnnotationType === 'Polyline') {
            const points: any = JSON.parse(shapeAnnotation.vertexPoints);
            const linePoints: number[] = this.getSaveVertexPoints(points, page);
            const polylineAnnotation: PdfPolyLineAnnotation = new PdfPolyLineAnnotation(linePoints);
            if (!isNullOrUndefined(shapeAnnotation.note)) {
                polylineAnnotation.text = shapeAnnotation.note.toString();
            }
            polylineAnnotation.author = shapeAnnotation.author.toString();
            if (!isNullOrUndefined(shapeAnnotation.subject)) {
                polylineAnnotation.subject = shapeAnnotation.subject.toString();
            }
            polylineAnnotation._dictionary.set('NM', shapeAnnotation.annotName.toString());
            if (!isNullOrUndefined(shapeAnnotation.strokeColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const strokeColor: any = JSON.parse(shapeAnnotation.strokeColor);
                // eslint-disable-next-line max-len
                const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                polylineAnnotation.color = color;
            }
            if (!isNullOrUndefined(shapeAnnotation.fillColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fillColor: any = JSON.parse(shapeAnnotation.fillColor);
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    polylineAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    polylineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    polylineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(shapeAnnotation.opacity)) {
                polylineAnnotation.opacity = shapeAnnotation.opacity;
            }
            const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = shapeAnnotation.thickness;
            lineBorder.style = shapeAnnotation.borderStyle;
            lineBorder.dash = shapeAnnotation.borderDashArray;
            polylineAnnotation.border = lineBorder;
            polylineAnnotation.rotationAngle = this.getRotateAngle(shapeAnnotation.rotateAngle);
            polylineAnnotation.beginLineStyle = this.getLineEndingStyle(shapeAnnotation.lineHeadStart);
            polylineAnnotation.endLineStyle = this.getLineEndingStyle(shapeAnnotation.lineHeadEnd);
            let dateValue: Date;
            if (!isNullOrUndefined(shapeAnnotation.modifiedDate) && !isNaN(Date.parse(shapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(shapeAnnotation.modifiedDate));
                polylineAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = shapeAnnotation.comments;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    polylineAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], polylineAnnotation.bounds));
                }
            }
            const reviewDetails: any = shapeAnnotation.review;
            polylineAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, polylineAnnotation.bounds));
            if (!isNullOrUndefined(shapeAnnotation.isCloudShape) && shapeAnnotation.isCloudShape) {
                const dictionary: _PdfDictionary = new _PdfDictionary(page._crossReference);
                dictionary.update('S', _PdfName.get('C'));
                dictionary.update('I', shapeAnnotation.cloudIntensity);
                polylineAnnotation._dictionary.update('BE', dictionary);
                const rectDifferences: string[] = JSON.parse(shapeAnnotation.rectangleDifference);
                if (rectDifferences.length > 0) {
                    const rd: number[] = this.getRDValues(rectDifferences);
                    polylineAnnotation._dictionary.update('RD', rd);
                }
            }
            if ((!isNullOrUndefined(shapeAnnotation.isLocked) && shapeAnnotation.isLocked) || isLock) {
                polylineAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            else if (!isNullOrUndefined(shapeAnnotation.isCommentLock) && shapeAnnotation.isCommentLock) {
                polylineAnnotation.flags = PdfAnnotationFlag.readOnly;
            }
            else {
                polylineAnnotation.flags = PdfAnnotationFlag.print;
            }
            polylineAnnotation.setAppearance(true);
            if (!isNullOrUndefined(shapeAnnotation.customData)) {
                polylineAnnotation.setValues('CustomData', shapeAnnotation.customData);
            }
            if (!isNullOrUndefined(shapeAnnotation.allowedInteractions)) {
                polylineAnnotation.setValues('AllowedInteractions', JSON.stringify(shapeAnnotation.allowedInteractions));
            }
            page.annotations.add(polylineAnnotation);
        }

    }

    /**
    * @private
    * @param details 
    * @param page 
    */
    public saveInkSignature(details: any, page: PdfPage): PdfInkAnnotation {
        let inkSignatureAnnotation: any = details;
        const bounds: Rect = JSON.parse(inkSignatureAnnotation.bounds);
        let stampObjects: any = JSON.parse(inkSignatureAnnotation.data.toString());
        let rotationAngle: number = this.getRotateAngle(page.rotation.toString());
        const cropValues: PointBase = this.getCropBoxValue(page, false);
        let left: number = cropValues.x + this.convertPixelToPoint(bounds.x);
        let top: number = this.convertPixelToPoint(bounds.y);
        if (!(cropValues.x === 0 && (page.cropBox[2] === page.size[0] && cropValues.y === page.size[1]))) {
            top -= cropValues.y;
        }
        const width: number = this.convertPixelToPoint(bounds.width);
        const height: number = this.convertPixelToPoint(bounds.height);
        const opacity: number = inkSignatureAnnotation.opacity;
        const thickness: number = parseInt(inkSignatureAnnotation.thickness.toString(), 10);
        if (!isNullOrUndefined(inkSignatureAnnotation.strokeColor)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const strokeColor: any = JSON.parse(inkSignatureAnnotation.strokeColor);
            // eslint-disable-next-line max-len
            const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
            inkSignatureAnnotation.color = color;
        }
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        let drawingPath: _PdfPath = new _PdfPath();
        for (let p = 0; p < stampObjects.length; p++) {
            let val = stampObjects[parseInt(p.toString(), 10)];
            drawingPath._addLine(val.x, val.y, 0, 0);
        }
        for (let k = 0; k < stampObjects.length; k += 2) {
            const value = drawingPath._points[k];

            if (minimumX == -1) {
                minimumX = value[0];
                minimumY = value[1];
                maximumX = value[0];
                maximumY = value[1];
            }
            else {
                let point1: number = value[0];
                let point2: number = value[1];
                if (minimumX >= point1) {
                    minimumX = point1;
                }
                if (minimumY >= point2) {
                    minimumY = point2;
                }
                if (maximumX <= point1) {
                    maximumX = point1;
                }
                if (maximumY <= point2) {
                    maximumY = point2;
                }
            }
        }
        let newDifferenceX: number = (maximumX - minimumX) / width;
        let newDifferenceY: number = (maximumY - minimumY) / height;

        if (newDifferenceX == 0) {
            newDifferenceX = 1;
        }
        else if (newDifferenceX == 0) {
            newDifferenceX = 1;
        }

        let linePoints: number[] = [];
        let isNewValues = 0;
        if (rotationAngle !== 0) {
            for (let j = 0; j < stampObjects.length; j++) {
                const val = stampObjects[parseInt(j.toString(), 10)];
                const path = val["command"].toString();
                if (path === "M" && j !== isNewValues) {
                    isNewValues = j;
                    break;
                }
                linePoints.push((parseFloat(val["x"].toString())));
                linePoints.push((parseFloat(val["y"].toString())));
            }
            let rotatedPoints: _PdfPath = this.getRotatedPath(linePoints, rotationAngle);
            linePoints = [];
            for (var z = 0; z < rotatedPoints._points.length; z += 2) {
                linePoints.push((rotatedPoints._points[z][0] - minimumX) / newDifferenceX + left);
                linePoints.push(page.size[1] - (rotatedPoints._points[z + 1][1] - minimumY) / newDifferenceY - top);
            }
        }

        else {
            for (let j = 0; j < stampObjects.length; j++) {
                const val = stampObjects[parseInt(j.toString(), 10)];
                const path = val["command"].toString();
                if (path === "M" && j !== isNewValues) {
                    isNewValues = j;
                    break;
                }
                linePoints.push(((val.x - minimumX) / newDifferenceX) + left);
                let newX: number = ((val.y - minimumY) / newDifferenceY);
                linePoints.push(page.size[1] - newX - top);
            }
        }
        let rectangle: Rect = new Rect(left, top, width, height);
        let colors: number[] = [inkSignatureAnnotation.color[0], inkSignatureAnnotation.color[1], inkSignatureAnnotation.color[2]];
        let inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation([left, top, width, height], linePoints);
        let bound: Rect = new Rect();
        bound = new Rect(inkAnnotation.bounds.x, (page.size[1] - (inkAnnotation.bounds.y + inkAnnotation.bounds.height)), inkAnnotation.bounds.width, inkAnnotation.bounds.height);
        inkAnnotation.bounds = bound;
        inkAnnotation.color = colors;
        linePoints = [];

        if (isNewValues > 0) {
            if (rotationAngle != 0) {
                let pathCollection: number[][] = [];
                for (var i = isNewValues; i < stampObjects.length; i++) {
                    const val = stampObjects[parseInt(i.toString(), 10)];
                    const path = val["command"].toString();
                    if (path === "M" && i !== isNewValues) {
                        pathCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(val["x"]);
                    linePoints.push(val["y"]);
                }
                if (linePoints.length > 0) {
                    pathCollection.push(linePoints);
                }
                for (var g = 0; g < pathCollection.length; g++) {
                    let graphicsPoints = [];
                    const pointsCollections = pathCollection[parseInt(g.toString(), 10)];
                    if (pointsCollections.length > 0) {
                        const rotatedPoints: _PdfPath = this.getRotatedPath(pointsCollections, rotationAngle);
                        for (var z = 0; z < rotatedPoints._points.length; z += 2) {
                            graphicsPoints.push(rotatedPoints._points[z][0] / minimumX + left);
                            graphicsPoints.push((rotatedPoints._points[z + 1][1] - minimumY / newDifferenceY) - top);
                        }
                        inkAnnotation.inkPointsCollection.push(graphicsPoints);
                    }
                    graphicsPoints = [];
                }

            }
            else {
                for (var i = isNewValues; i < stampObjects.length; i++) {
                    const val = stampObjects[parseInt(i.toString(), 10)];
                    const path = val["command"].toString();
                    if (path === "M" && i !== isNewValues) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push((val["x"] - minimumX) / newDifferenceX + left);
                    var newX = ((val["y"] - minimumY) / newDifferenceY);
                    linePoints.push(page.size[1] - newX - top);
                }
                if (linePoints.length > 0) {
                    inkAnnotation.inkPointsCollection.push(linePoints);
                }
            }
        }
        const isLock: boolean = this.checkAnnotationLock(inkSignatureAnnotation);
        if (isNullOrUndefined(inkSignatureAnnotation.author) || (isNullOrUndefined(inkSignatureAnnotation.author) && inkSignatureAnnotation.author === '')) {
            inkSignatureAnnotation.author = 'Guest';
        }
        else {
            inkAnnotation.author = !isNullOrUndefined(inkSignatureAnnotation.author) ? inkSignatureAnnotation.author.toString() !== '' ? inkSignatureAnnotation.author.toString() : 'Guest' : 'Guest';
        }
        if (!isNullOrUndefined(inkSignatureAnnotation.subject) && inkSignatureAnnotation.subject !== '') {
            inkAnnotation.subject = inkSignatureAnnotation.subject.toString();
        }
        if (!isNullOrUndefined(inkSignatureAnnotation.note)) {
            inkAnnotation.text = inkSignatureAnnotation.note.toString();
        }

        let dateValue: Date;
        if (!isNullOrUndefined(inkSignatureAnnotation.modifiedDate) && !isNaN(Date.parse(inkSignatureAnnotation.modifiedDate))) {
            dateValue = new Date(Date.parse(inkSignatureAnnotation.modifiedDate));
            inkAnnotation.modifiedDate = dateValue;
        }
        const reviewDetails: any = inkSignatureAnnotation.review;
        inkAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, inkAnnotation.bounds));

        const commentsDetails: any = inkSignatureAnnotation.comments;
        if (commentsDetails.length > 0) {
            for (let i: number = 0; i < commentsDetails.length; i++) {
                // eslint-disable-next-line max-len
                inkAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], inkAnnotation.bounds));
            }
        }
        if (!isNullOrUndefined(inkSignatureAnnotation.isLocked) && inkSignatureAnnotation.isLocked) {
            inkAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
        }
        else if (!isNullOrUndefined(inkSignatureAnnotation.isCommentLock) && inkSignatureAnnotation.isCommentLock) {
            inkAnnotation.flags = PdfAnnotationFlag.readOnly;
        }
        else {
            inkAnnotation.flags = PdfAnnotationFlag.print;
        }
        if (!isNullOrUndefined(inkSignatureAnnotation.customData)) {
            inkAnnotation.setValues('CustomData', inkSignatureAnnotation.customData);
        }
        inkAnnotation.border.width = thickness;
        inkAnnotation.opacity = opacity;
        inkAnnotation._dictionary.set('NM', inkSignatureAnnotation.annotName.toString());
        inkAnnotation.rotationAngle = this.getRotateAngle(inkSignatureAnnotation.rotationAngle);
        if (!isNullOrUndefined(inkSignatureAnnotation.customData)) {
            inkAnnotation.setValues('CustomData', inkSignatureAnnotation.customData);
        }
        inkAnnotation.setAppearance(true);
        page.annotations.add(inkAnnotation);
        return inkSignatureAnnotation;
    }

    private getRotatedPath(linePoints: number[], rotationAngle: number): _PdfPath {
        let graphicsPath: _PdfPath = new _PdfPath();
        for (var j = 0; j < linePoints.length; j += 2) {
            graphicsPath._addLine(linePoints[j], linePoints[j + 1], 0, 0);
        }
        return graphicsPath;
    }


    /**
     * @param details
     * @param loadedDocument
     * @private
     */
    public addTextMarkup(details: any, loadedDocument: PdfDocument): void{
        const markupAnnotation = details;
        const pageNo: number = parseInt(markupAnnotation['pageNumber'].toString(), 10);
        const page: PdfPage = loadedDocument.getPage(pageNo);
        const annotationtypes: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation();
        switch (markupAnnotation.textMarkupAnnotationType.toString()){
        case 'Highlight':
            annotationtypes.textMarkupType = PdfTextMarkupAnnotationType.highlight;
            break;
        case 'Strikethrough':
            annotationtypes.textMarkupType = PdfTextMarkupAnnotationType.strikeOut;
            break;
        case 'Underline':
            annotationtypes.textMarkupType = PdfTextMarkupAnnotationType.underline;
            break;
        case 'Squiggly':
            annotationtypes.textMarkupType = PdfTextMarkupAnnotationType.squiggly;
            break;
        }
        const bounds: {[key: string]: number}[] = JSON.parse(markupAnnotation.bounds);
        let boundsCollection: Rect[] = [];
        for (let i: number = 0; i < bounds.length; i++){
            const bound:  {[key: string]: number} = bounds[parseInt(i.toString(), 10)];
            const cropValues: PointBase = this.getCropBoxValue(page, true);
            if (!isNullOrUndefined(bound['left'])){
                boundsCollection.push(new Rect(cropValues.x + this.convertPixelToPoint(bound['left']), cropValues.y + this.convertPixelToPoint(bound['top']), bound.hasOwnProperty('width') ? this.convertPixelToPoint(bound['width']) : 0, bound.hasOwnProperty('height') ? this.convertPixelToPoint(bound['height']) : 0));
            }

            // Assuming boundsCollection is an array of RectangleF objects
            const groupedRectangles = new Map<number, Rect[]>();

            // Group rectangles by their Y values
            for (const rect of boundsCollection) {
                if (!groupedRectangles.has(rect.y)) {
                    groupedRectangles.set(rect.y, []);
                }
                if(groupedRectangles.get(rect.y))
                {
                    groupedRectangles.get(rect.y).push(rect);
                }
            }

            // Calculate combined rectangles within each group
            const combinedRectangles: Rect[] = [];
            groupedRectangles.forEach((group, groupKey) => {
                if (group.length > 0) {
                    const minX = Math.min(...group.map(rect => rect.x));
                    const width = group.map(rect => rect.width).reduce((sum, width) => sum + width, 0);
                    const height = group[0].height;

                    combinedRectangles.push(new Rect(minX, groupKey, width, height));
                }
            });

            boundsCollection = combinedRectangles;
        }
        const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation(null, 0, 0, 0, 0);
        annotation.textMarkupType = annotationtypes.textMarkupType;
        const isLock: boolean = this.checkAnnotationLock(markupAnnotation);
        if (isNullOrUndefined(markupAnnotation.author) || (isNullOrUndefined(markupAnnotation.author) && markupAnnotation.author === '')) {
            markupAnnotation.author = 'Guest';
        }
        else {
            annotation.author = !isNullOrUndefined(markupAnnotation.author) ? markupAnnotation.author.toString() !== '' ? markupAnnotation.author.toString() : 'Guest' : 'Guest';
        }
        if (!isNullOrUndefined(markupAnnotation.subject) && markupAnnotation.subject !== '') {
            annotation.subject = markupAnnotation.subject.toString();
        }
        if (!isNullOrUndefined(markupAnnotation.note) ) {
            annotation.text = markupAnnotation.note.toString();
        }
        if (!isNullOrUndefined(markupAnnotation.annotationRotation)){
            (annotation as any).rotateAngle = this.getRotateAngle(markupAnnotation.annotationRotation);
        }
        let dateValue: Date;
        if (!isNullOrUndefined(markupAnnotation.modifiedDate) && !isNaN(Date.parse(markupAnnotation.modifiedDate))) {
            dateValue = new Date(Date.parse(markupAnnotation.modifiedDate));
            annotation.modifiedDate = dateValue;
        }
        annotation._dictionary.set('NM', markupAnnotation.annotName.toString());
        if (!isNullOrUndefined(markupAnnotation.color)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const annotColor: any = JSON.parse(markupAnnotation.color);
            // eslint-disable-next-line max-len
            const color: number[] = [annotColor.r, annotColor.g, annotColor.b];
            annotation.color = color;
        }
        if (!isNullOrUndefined(markupAnnotation.opacity)) {
            annotation.opacity = markupAnnotation.opacity;
        }
        const rect: any = markupAnnotation.rect;
        if (boundsCollection.length > 0){
            // Don't need to set bounds explicitly for text markup annotation
            const boundArrayCollection: number[][] = [];
            for (let i: number = 0; i < boundsCollection.length; i++) {
                const boundArray: number[] = [];
                boundArray.push(boundsCollection[parseInt(i.toString(), 10)].x);
                boundArray.push(boundsCollection[parseInt(i.toString(), 10)].y);
                boundArray.push(boundsCollection[parseInt(i.toString(), 10)].width);
                boundArray.push(boundsCollection[parseInt(i.toString(), 10)].height);
                boundArrayCollection.push(boundArray);
            }
            annotation.boundsCollection = boundArrayCollection;
        }
        const commentsDetails: any = markupAnnotation.comments;
        if (commentsDetails.length > 0) {
            for (let i: number = 0; i < commentsDetails.length; i++) {
                // eslint-disable-next-line max-len
                annotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], annotation.bounds));
            }
        }
        const reviewDetails: any = markupAnnotation.review;
        annotation.reviewHistory.add(this.addReviewCollections(reviewDetails, annotation.bounds));
        if (!isNullOrUndefined(markupAnnotation.color)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const annotColor: any = JSON.parse(markupAnnotation.color);
            // eslint-disable-next-line max-len
            const color: number[] = [annotColor.r, annotColor.g, annotColor.b];
            annotation.textMarkUpColor = color;
        }
        let isPrint: boolean = true;
        let isCommentLock: boolean = false;
        if (!isNullOrUndefined(markupAnnotation.isCommentLock) && markupAnnotation.isCommentLock) {
            isCommentLock = true;
        }
        if (!isNullOrUndefined(markupAnnotation.isPrint) && markupAnnotation.isPrint) {
            isPrint = true;
        }
        if (isCommentLock && isPrint){
            annotation.flags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
        }
        if (isLock){
            annotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
        }
        else if (isCommentLock){
            annotation.flags = PdfAnnotationFlag.readOnly;
        }
        else {
            annotation.flags = PdfAnnotationFlag.print;
        }
        if (!isNullOrUndefined(markupAnnotation.customData)) {
            annotation.setValues('CustomData', markupAnnotation.customData);
        }
        if (!isNullOrUndefined(markupAnnotation.allowedInteractions)) {
            annotation.setValues('AllowedInteractions', JSON.stringify(markupAnnotation.allowedInteractions));
        }
        if (!isNullOrUndefined(markupAnnotation.textMarkupContent)) {
            annotation._dictionary.set('TextMarkupContent', markupAnnotation.textMarkupContent.toString());
        }
        annotation.setAppearance(true);
        page.annotations.add(annotation);
    }

    private getCropBoxValue( page: PdfPage, isPath: boolean): PointBase
    {
        let cropBoxX: number = 0;
        let cropBoxY: number = 0;
        if (page != null)
        {
            cropBoxX = !isPath ? page.cropBox[0] : 0;
            cropBoxY = !isPath ? page.cropBox[1] : 0;
        }
        return {x: cropBoxX, y: cropBoxY};
    }

    private getBothCropBoxValue(page: PdfPage): number[] {
        const cropBoxX: number = page.cropBox[0];
        const cropBoxY: number = page.cropBox[1];
        return [cropBoxX, cropBoxY];
    }

    /**
     * @private
     * @param details
     * @param page
     */
    public addCustomStampAnnotation(details: any, page: PdfPage): void {
        const stampAnnotation: any = details;
        const bounds: Rect = JSON.parse(stampAnnotation.bounds);
        const pageNo: number = parseInt(stampAnnotation['pageNumber'].toString(), 10);
        const cropValues : PointBase = this.getCropBoxValue(page, false);
        let left: number = 0;
        let top: number = 0;
        const graphics: PdfGraphics = page.graphics;
        const pageRotation: string = page.rotation.toString();
        if (stampAnnotation.hasOwnProperty('wrapperBounds')) {
            const wrapperBounds: any = stampAnnotation.wrapperBounds;
            const boundsXY: Rect = this.calculateBoundsXY(wrapperBounds, bounds, pageNo, page);
            left = boundsXY.x;
            top = boundsXY.y;

        }
        else {
            left = this.convertPixelToPoint(bounds.left);
            top = this.convertPixelToPoint(bounds.top);
        }

        let cropX : number = 0;
        let cropY : number = 0;

        if (cropValues.x != 0 && cropValues.y != 0 && cropValues.x == left) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }

        else if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }

        left += cropX;
        top += cropY;

        let width: number = this.convertPixelToPoint(bounds.width);
        let height: number = this.convertPixelToPoint(bounds.height);

        if (!isNullOrUndefined(stampAnnotation.stampAnnotationType) && (stampAnnotation.stampAnnotationType === 'image') && (stampAnnotation.stampAnnotationPath !== ' ')) {
            if (pageRotation === 'RotateAngle90' || pageRotation === 'RotateAngle270') {
                width = this.convertPixelToPoint((bounds.height));
                height = this.convertPixelToPoint((bounds.width));
            }
        }

        const opacity: number = stampAnnotation.opacity;
        const rotateAngle: number = stampAnnotation.rotateAngle;
        let isLock: boolean = false;

        if (stampAnnotation.hasOwnProperty('annotationSettings') && !isNullOrUndefined(stampAnnotation.annotationSettings)) {
            const annotationSettings: any = stampAnnotation.annotationSettings;
            if (!isNullOrUndefined(annotationSettings.isLock)) {
                isLock = annotationSettings.isLock;
            }
        }
        if (!isNullOrUndefined(stampAnnotation.stampAnnotationType) && (stampAnnotation.stampAnnotationType === 'image') && (stampAnnotation.stampAnnotationPath !== ' ')) {
            let pageRender: PageRenderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            page.annotations.add(rubberStampAnnotation);
            const imageUrl: string = (stampAnnotation['stampAnnotationPath'].toString()).split(',')[1];
            const bytes: Uint8Array = _decode(imageUrl, false) as Uint8Array;
            let bitmap: PdfImage;
            if (bytes && bytes.length > 2 && bytes[0] === 255 && bytes[1] === 216) {
                bitmap = new PdfBitmap(bytes);
                let appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
                const state: PdfGraphicsState = graphics.save();
                appearance.graphics.drawImage(bitmap, 0, 0, width, height);
                appearance.graphics.restore(state);
            }
            else {
                const appearance: PdfAppearance = rubberStampAnnotation.appearance;
                const filterAnnot: any = this.pdfViewerBase.pngData.filter((nameStamp) => nameStamp.name === stampAnnotation.annotName);
                let dictionary: _PdfDictionary = filterAnnot[0]._dictionary.get('AP');
                let pngDictionary: _PdfBaseStream = dictionary.get('N');
                appearance.normal = new PdfTemplate(pngDictionary, page._crossReference);
            }
            rubberStampAnnotation.opacity = opacity;

            if (!isNullOrUndefined(stampAnnotation.note)) {
                rubberStampAnnotation.text = stampAnnotation.note.toString();
            }
            rubberStampAnnotation._dictionary.set('NM', stampAnnotation.annotName.toString());
            let dateValue: Date;
            if (!isNullOrUndefined(stampAnnotation.modifiedDate) && !isNaN(Date.parse(stampAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(stampAnnotation.modifiedDate));
                rubberStampAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = stampAnnotation.comments;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    rubberStampAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], rubberStampAnnotation.bounds));
                }
            }
            const reviewDetails: any = stampAnnotation.review;
            rubberStampAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, rubberStampAnnotation.bounds));
            if (!isNullOrUndefined(stampAnnotation.author)) {
                stampAnnotation.author = 'Guest';
            }
            rubberStampAnnotation.author = stampAnnotation.author.toString();

            if (!isNullOrUndefined(stampAnnotation.isLocked) && stampAnnotation.isLocked) {
                rubberStampAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            else if (!isNullOrUndefined(stampAnnotation.isCommentLock) && stampAnnotation.isCommentLock) {
                rubberStampAnnotation.flags = PdfAnnotationFlag.readOnly;
            }
            else {
                rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            }
            if (!isNullOrUndefined(stampAnnotation.customData)) {
                rubberStampAnnotation.setValues('CustomData', stampAnnotation.customData);
            }
        }

        else {
            const subject: string = stampAnnotation.icon.toString();
            const stampColor: string = stampAnnotation.stampFillcolor.toString();
            const fillColor: string = stampAnnotation.fillColor.toString();
            const isDynamic: string = stampAnnotation.isDynamicStamp.toString();
            let textBrush: PdfBrush = new PdfBrush([0, 0, 0]);
            let colors: number[] = [];
            const stampWidth: number = width;
            if (fillColor === '#192760') {
                colors = [25, 39, 96];
            }
            else if (fillColor === '#516c30') {
                colors = [81, 108, 48];
            }
            else if (fillColor === '#8a251a') {
                colors = [138, 37, 26];
            }
            textBrush = new PdfBrush(colors);

            let stampBrush: PdfBrush = new PdfBrush([0, 0, 0]);
            let stampcolors: number[] = [];

            if (stampColor === '#e6eddf') {
                stampcolors = [230, 237, 223];
            }
            else if (stampColor === '#f6dedd') {
                stampcolors = [246, 222, 221];
            }
            else if (stampColor === '#dce3ef') {
                stampcolors = [220, 227, 239];
            }
            textBrush = new PdfBrush(colors);
            stampBrush = new PdfBrush(stampcolors);

            const pens: PdfPen = new PdfPen(colors, 1);
            const pageRotation: string = page.rotation.toString();
            let rectangle: Rect = new Rect(left, top, width, height);

            if (pageRotation === 'RotateAngle90' || pageRotation === 'RotateAngle270') {
                rectangle = new Rect(left, top, height, width);
            }
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation;
            rubberStampAnnotation.bounds = rectangle;
            rubberStampAnnotation.subject = stampAnnotation.icon.toString();
            if (!isNullOrUndefined(stampAnnotation.note)) {
                rubberStampAnnotation.text = stampAnnotation.note.toString();
            }
            rubberStampAnnotation._dictionary.set('NM', stampAnnotation.annotName.toString());

            let dateValue: Date;
            if (!isNullOrUndefined(stampAnnotation.modifiedDate) && !isNaN(Date.parse(stampAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(stampAnnotation.modifiedDate));
                rubberStampAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = stampAnnotation.comments;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    rubberStampAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], rubberStampAnnotation.bounds));
                }
            }
            const reviewDetails: any = stampAnnotation.review;
            rubberStampAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, rubberStampAnnotation.bounds));
            let isIconExists: boolean = false;
            if (isDynamic !== 'true') {
                isIconExists = this.getIconName(stampAnnotation, subject, rubberStampAnnotation);
            }
            if (subject.trim() === 'Accepted' || subject.trim() === 'Rejected') {
                this.drawStampAsPath(stampAnnotation.stampAnnotationPath, rubberStampAnnotation, textBrush, stampBrush);
                rubberStampAnnotation.rotationAngle = this.getRubberStampRotateAngle(pageRotation, rotateAngle);
            }
                else {
                if (page.rotation.toString() === 'RotateAngle90' || page.rotation.toString() === 'RotateAngle270') {
                    rubberStampAnnotation.bounds = rectangle;
                }
                rubberStampAnnotation.rotationAngle = this.getRubberStampRotateAngle(pageRotation, rotateAngle);
            }
            if (!isNullOrUndefined(stampAnnotation.modifiedDate) && !isNaN(Date.parse(stampAnnotation.modifiedDate))) {
                let dateValue: Date;
                if (!isNullOrUndefined(stampAnnotation.modifiedDate) && !isNaN(Date.parse(stampAnnotation.modifiedDate))) {
                    dateValue = new Date(Date.parse(stampAnnotation.modifiedDate));
                    rubberStampAnnotation.modifiedDate = dateValue;
                }
            }
            rubberStampAnnotation.opacity = opacity;
            rubberStampAnnotation.author = stampAnnotation.author.toString();
            if (!isNullOrUndefined(stampAnnotation.isLocked) && stampAnnotation.isLocked) {
                rubberStampAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            else if (!isNullOrUndefined(stampAnnotation.isCommentLock) && stampAnnotation.isCommentLock) {
                rubberStampAnnotation.flags = PdfAnnotationFlag.readOnly;
            }
            else {
                rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            }
            if (!isNullOrUndefined(stampAnnotation.customData)) {
                rubberStampAnnotation.setValues('CustomData', stampAnnotation.customData);
            }
            if (!isNullOrUndefined(stampAnnotation.rotateAngle)) {
                rubberStampAnnotation.setValues('rotateAngle', stampAnnotation.rotateAngle.toString());
            }
            page.annotations.add(rubberStampAnnotation);
            if (!isIconExists) {
                let appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
                appearance.graphics.drawRoundedRectangle(0,0, rectangle.width, rectangle.height, 10, pens, stampBrush);
                if (isDynamic === 'true') {
                    const text: string = stampAnnotation.dynamicText.toString();
                    const state: PdfGraphicsState = appearance.graphics.save();
                    appearance.graphics.setTransparency(opacity);
                    this.renderDynamicStamp(rubberStampAnnotation, subject, text, textBrush, rectangle, pens, page);
                    appearance.graphics.restore(state);
                    rubberStampAnnotation._dictionary.set('Name', _PdfName.get('#23D' + subject.toString()));
                }
                else {
                    this.retriveDefaultWidth(subject.trim());
                    const state: PdfGraphicsState = appearance.graphics.save();
                    appearance.graphics.setTransparency(opacity);
                    this.renderSignHereStamp(rubberStampAnnotation, rectangle, subject, textBrush, page, pens);
                    appearance.graphics.restore(state);
                }
                rubberStampAnnotation.rotationAngle = this.getRubberStampRotateAngle(pageRotation, rotateAngle);
            }
        }
    }

    /**
     * @param details
     * @param page
     *
     * @private
     */
    public addMeasure(details: any, page: PdfPage): void {
        const measureShapeAnnotation: any = details;
        if (!isNullOrUndefined(measureShapeAnnotation.author)) {
            measureShapeAnnotation.author = 'Guest';
        }
        if (!isNullOrUndefined(measureShapeAnnotation.shapeAnnotationType) && measureShapeAnnotation.shapeAnnotationType === 'Line') {
            const points: any = JSON.parse(measureShapeAnnotation.vertexPoints);
            const linePoints: number[] = this.getSaveVertexPoints(points, page);
            let lineAnnotation: PdfLineAnnotation = new PdfLineAnnotation(linePoints);
            if (!isNullOrUndefined(measureShapeAnnotation.note)) {
                lineAnnotation.text = measureShapeAnnotation.note.toString();
        }
            lineAnnotation.author = measureShapeAnnotation.author.toString();
            if (!isNullOrUndefined(measureShapeAnnotation.subject)) {
                lineAnnotation.subject = measureShapeAnnotation.subject.toString();
            }
            lineAnnotation.lineIntent = PdfLineIntent.lineDimension;
            if (!isNullOrUndefined(measureShapeAnnotation.annotName)) {
                lineAnnotation.name = measureShapeAnnotation.annotName.toString();
            }
            if (!isNullOrUndefined(measureShapeAnnotation.strokeColor)) {
                const strokeColor: any = JSON.parse(measureShapeAnnotation.strokeColor);
                lineAnnotation.color = [strokeColor.r, strokeColor.g, strokeColor.b];
            }
            if (!isNullOrUndefined(measureShapeAnnotation.fillColor)) {
                const fillColor: any = JSON.parse(measureShapeAnnotation.fillColor);
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    lineAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    lineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    lineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(measureShapeAnnotation.opacity)) {
                lineAnnotation.opacity = measureShapeAnnotation.opacity;
            }
            let lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = measureShapeAnnotation.thickness;
            if (!isNullOrUndefined(measureShapeAnnotation.borderStyle) && measureShapeAnnotation.borderStyle !== '') {
                lineBorder.style = this.getBorderStyle(measureShapeAnnotation.borderStyle);
            }
            if (!isNullOrUndefined(measureShapeAnnotation.borderDashArray)) {
                lineBorder.dash = [measureShapeAnnotation.borderDashArray, measureShapeAnnotation.borderDashArray];
            }
            lineAnnotation.border = lineBorder;
            lineAnnotation.rotationAngle = this.getRotateAngle(measureShapeAnnotation.rotateAngle);
            lineAnnotation.lineEndingStyle.begin = this.getLineEndingStyle(measureShapeAnnotation.lineHeadStart);
            lineAnnotation.lineEndingStyle.end = this.getLineEndingStyle(measureShapeAnnotation.lineHeadEnd);
            let dateValue: Date;
            if (!isNullOrUndefined(measureShapeAnnotation.modifiedDate) && !isNaN(Date.parse(measureShapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(measureShapeAnnotation.modifiedDate));
                lineAnnotation.modifiedDate = dateValue;
            }
            lineAnnotation.caption.type = this.getCaptionType(measureShapeAnnotation.captionPosition);
            lineAnnotation.caption.cap = measureShapeAnnotation.caption;
            lineAnnotation.leaderExt = measureShapeAnnotation.leaderLineExtension;
            lineAnnotation.leaderLine = measureShapeAnnotation.leaderLength;
            const commentsDetails: any = measureShapeAnnotation.comments;
            const bounds: any = JSON.parse(measureShapeAnnotation.bounds);
            lineAnnotation.bounds = bounds;
            lineAnnotation.bounds.x = bounds.left;
            lineAnnotation.bounds.y = bounds.top;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    lineAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], lineAnnotation.bounds));
                }
            }
            const reviewDetails: any = measureShapeAnnotation.review;
            lineAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, lineAnnotation.bounds));
            lineAnnotation._dictionary.update('LLO', measureShapeAnnotation.leaderLineOffset);
            if (measureShapeAnnotation.isPrint && !isNullOrUndefined(measureShapeAnnotation['isPrint']) && Boolean(measureShapeAnnotation['isPrint'].toString())) {
                if (measureShapeAnnotation.isCommentLock && !isNullOrUndefined(measureShapeAnnotation['isCommentLock']) && Boolean(measureShapeAnnotation['isCommentLock'].toString())) {
                    lineAnnotation.flags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
                } else {
                    lineAnnotation.flags = PdfAnnotationFlag.print;
                }
            }
            if (measureShapeAnnotation.isLocked && !isNullOrUndefined(measureShapeAnnotation['isLocked']) && Boolean(measureShapeAnnotation['isLocked'].toString())) {
                lineAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            } else if (measureShapeAnnotation.isCommentLock && !isNullOrUndefined(measureShapeAnnotation['isCommentLock']) && Boolean(measureShapeAnnotation['isCommentLock'].toString())) {
                lineAnnotation.flags = PdfAnnotationFlag.readOnly;
            } else {
                lineAnnotation.flags = PdfAnnotationFlag.print;
            }
            const measureDetail: any = JSON.parse(measureShapeAnnotation.calibrate);
            if (!isNullOrUndefined(measureDetail)) {
                lineAnnotation.measure = true;
                let unit: string = JSON.parse(measureDetail.distance)[0].unit;
                lineAnnotation.unit = this.setMeasurementUnit(unit);
            }
            if (!isNullOrUndefined(measureShapeAnnotation.customData)) {
                lineAnnotation.setValues('CustomData', measureShapeAnnotation.customData);
            }
            if (measureShapeAnnotation.allowedInteractions && measureShapeAnnotation['allowedInteractions'] != null){
                lineAnnotation.setValues('AllowedInteractions', JSON.stringify(measureShapeAnnotation['allowedInteractions']));
            }
            lineAnnotation.setAppearance(true);
            page.annotations.add(lineAnnotation);
        }
        else if (!isNullOrUndefined(measureShapeAnnotation.shapeAnnotationType) && measureShapeAnnotation.shapeAnnotationType === 'Polyline') {
            const points: any = JSON.parse(measureShapeAnnotation.vertexPoints);

            const linePoints: number[] = this.getSaveVertexPoints(points, page);

            const polylineAnnotation: PdfPolyLineAnnotation = new PdfPolyLineAnnotation(linePoints);

            polylineAnnotation.author = measureShapeAnnotation.author.toString();
            if (!isNullOrUndefined(measureShapeAnnotation.note)) {
                polylineAnnotation.text = measureShapeAnnotation.note.toString();
            }
            polylineAnnotation._dictionary.set('NM', measureShapeAnnotation.annotName.toString());
            if (!isNullOrUndefined(measureShapeAnnotation.subject)) {
                polylineAnnotation.subject = measureShapeAnnotation.subject.toString();
            }

            if (!isNullOrUndefined(measureShapeAnnotation.strokeColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const strokeColor: any = JSON.parse(measureShapeAnnotation.strokeColor);
                // eslint-disable-next-line max-len
                const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                polylineAnnotation.color = color;
            }

            if (!isNullOrUndefined(measureShapeAnnotation.fillColor)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fillColor: any = JSON.parse(measureShapeAnnotation.fillColor);
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    polylineAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    polylineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    polylineAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }

            if (!isNullOrUndefined(measureShapeAnnotation.opacity)) {
                polylineAnnotation.opacity = measureShapeAnnotation.opacity;
            }

            const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = measureShapeAnnotation.thickness;
            lineBorder.style = this.getBorderStyle(measureShapeAnnotation.borderStyle);
            lineBorder.dash = measureShapeAnnotation.borderDashArray;
            polylineAnnotation.border = lineBorder;
            polylineAnnotation.rotationAngle = this.getRotateAngle(measureShapeAnnotation.rotateAngle);
            polylineAnnotation.beginLineStyle = this.getLineEndingStyle(measureShapeAnnotation.lineHeadStart);
            polylineAnnotation.endLineStyle = this.getLineEndingStyle(measureShapeAnnotation.lineHeadEnd);

            let dateValue: Date;
            if (!isNullOrUndefined(measureShapeAnnotation.modifiedDate) && !isNaN(Date.parse(measureShapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(measureShapeAnnotation.modifiedDate));
                polylineAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = measureShapeAnnotation.comments;
            const bounds: any = JSON.parse(measureShapeAnnotation.bounds);
            polylineAnnotation.bounds = bounds;
            polylineAnnotation.bounds.x = bounds.left;
            polylineAnnotation.bounds.y = bounds.top;

            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    // eslint-disable-next-line max-len
                    polylineAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], polylineAnnotation.bounds));
                }
            }
            const reviewDetails: any = measureShapeAnnotation.review;
            polylineAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, polylineAnnotation.bounds));

            polylineAnnotation._dictionary.set('IT', _PdfName.get(measureShapeAnnotation.indent.toString()));

            if (!isNullOrUndefined(measureShapeAnnotation.isCloudShape) && measureShapeAnnotation.isCloudShape) {
                const dictionary: _PdfDictionary = new _PdfDictionary(page._crossReference);
                dictionary.update('S', _PdfName.get('C'));
                dictionary.update('I', measureShapeAnnotation.cloudIntensity);
                polylineAnnotation._dictionary.update('BE', dictionary);
                const rectDifferences: string[] = JSON.parse(measureShapeAnnotation.rectangleDifference);
                if (rectDifferences.length > 0) {
                    const rd: number[] = this.getRDValues(rectDifferences);
                    polylineAnnotation._dictionary.update('RD', rd);
                }
            }

            if (!isNullOrUndefined(measureShapeAnnotation.isLocked && measureShapeAnnotation.isLocked)) {
                polylineAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
            else if (!isNullOrUndefined(measureShapeAnnotation.isCommentLock) && measureShapeAnnotation.isCommentLock) {
                polylineAnnotation.flags = PdfAnnotationFlag.readOnly;
            }
            if (measureShapeAnnotation.isPrint && measureShapeAnnotation['isPrint'] !== null && Boolean(measureShapeAnnotation['isPrint'].toString())) {
                if (measureShapeAnnotation.isCommentLock && measureShapeAnnotation['isCommentLock'] !== null && Boolean(measureShapeAnnotation['isCommentLock'].toString())) {
                    polylineAnnotation._annotFlags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
                } else {
                    polylineAnnotation._annotFlags = PdfAnnotationFlag.print;
                }
            }
            const measureDetail: any = JSON.parse(measureShapeAnnotation.calibrate);

            if (!isNullOrUndefined(measureDetail)) {
                polylineAnnotation._dictionary.set('Measure', this.setMeasureDictionary(measureDetail));
            }
            if (!isNullOrUndefined(measureShapeAnnotation.customData)) {
                polylineAnnotation.setValues('CustomData', measureShapeAnnotation.customData);
            }
            if (measureShapeAnnotation.allowedInteractions && measureShapeAnnotation['allowedInteractions'] != null){
                polylineAnnotation.setValues('AllowedInteractions', JSON.stringify(measureShapeAnnotation['allowedInteractions']));
            }
            polylineAnnotation.setAppearance(true);
            page.annotations.add(polylineAnnotation);

        }
        else if (!isNullOrUndefined(measureShapeAnnotation.shapeAnnotationType) && (measureShapeAnnotation.shapeAnnotationType === 'Polyline') && (measureShapeAnnotation.shapeAnnotationType === 'PolygonRadius') || (measureShapeAnnotation.shapeAnnotationType === 'Circle')) {
            const circleMeasurementAnnotation: PdfCircleAnnotation = this.addCircleMeasurementAnnotation(measureShapeAnnotation, page);
            page.annotations.add(circleMeasurementAnnotation);
        } else if (!isNullOrUndefined(measureShapeAnnotation.shapeAnnotationType) && (measureShapeAnnotation.shapeAnnotationType === 'Polygon') && measureShapeAnnotation.indent !== 'PolygonRadius') {
            const points: any = JSON.parse(measureShapeAnnotation.vertexPoints);
            const linePoints: number[] = this.getSaveVertexPoints(points, page);
            let polygonAnnotation: PdfPolygonAnnotation = new PdfPolygonAnnotation(linePoints);
            polygonAnnotation.author = measureShapeAnnotation.author.toString();
            if (!isNullOrUndefined(measureShapeAnnotation.note)) {
                polygonAnnotation.text = measureShapeAnnotation.note.toString();
            }
            if (!isNullOrUndefined(measureShapeAnnotation.annotName)) {
                polygonAnnotation.name = measureShapeAnnotation.annotName.toString();
            }
            if (!isNullOrUndefined(measureShapeAnnotation.subject)) {
                polygonAnnotation.subject = measureShapeAnnotation.subject.toString();
            }
            if (!isNullOrUndefined(measureShapeAnnotation.strokeColor)) {
                const strokeColor: any = JSON.parse(measureShapeAnnotation.strokeColor);
                polygonAnnotation.color = [strokeColor.r, strokeColor.g, strokeColor.b];
            }
            if (!isNullOrUndefined(measureShapeAnnotation.fillColor)) {
                const fillColor: any = JSON.parse(measureShapeAnnotation.fillColor);
                if (!this.isTransparentColor(fillColor)){
                    const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                    polygonAnnotation.innerColor = innerColor;
                }
                if (fillColor.a < 1 && fillColor.a > 0) {
                    polygonAnnotation._dictionary.update('FillOpacity', fillColor.a);
                    fillColor.a = 1;
                }
                else {
                    polygonAnnotation._dictionary.update('FillOpacity', fillColor.a);
                }
            }
            if (!isNullOrUndefined(measureShapeAnnotation.opacity)) {
                polygonAnnotation.opacity = measureShapeAnnotation.opacity;
            }
            let lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
            lineBorder.width = measureShapeAnnotation.thickness;
            lineBorder.style = measureShapeAnnotation.borderStyle;
            if (!isNullOrUndefined(measureShapeAnnotation.borderDashArray)) {
                lineBorder.dash = [measureShapeAnnotation.borderDashArray, measureShapeAnnotation.borderDashArray];
            }
            polygonAnnotation.border = lineBorder;
            polygonAnnotation._dictionary.update('IT', _PdfName.get(measureShapeAnnotation.indent.toString()));
            polygonAnnotation.rotationAngle = this.getRotateAngle(measureShapeAnnotation.rotateAngle);
            let dateValue: Date;
            if (!isNullOrUndefined(measureShapeAnnotation.modifiedDate) && !isNaN(Date.parse(measureShapeAnnotation.modifiedDate))) {
                dateValue = new Date(Date.parse(measureShapeAnnotation.modifiedDate));
                polygonAnnotation.modifiedDate = dateValue;
            }
            const commentsDetails: any = measureShapeAnnotation.comments;
            const bounds: any = JSON.parse(measureShapeAnnotation.bounds);
            polygonAnnotation.bounds = bounds;
            polygonAnnotation.bounds.x = bounds.left;
            polygonAnnotation.bounds.y = bounds.top;
            if (commentsDetails.length > 0) {
                for (let i: number = 0; i < commentsDetails.length; i++) {
                    polygonAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], polygonAnnotation.bounds));
                }
            }
            const reviewDetails: any = measureShapeAnnotation.review;
            polygonAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, polygonAnnotation.bounds));
            if (!isNullOrUndefined(measureShapeAnnotation.isCloudShape) && Boolean(measureShapeAnnotation['isCloudShape'].toString())) {
                polygonAnnotation.borderEffect.style = PdfBorderEffectStyle.cloudy;
                polygonAnnotation.borderEffect.intensity = measureShapeAnnotation['cloudIntensity'];
                const rectDifferences: string[] = JSON.parse(measureShapeAnnotation.rectangleDifference);
                if (rectDifferences.length > 0) {
                    const rd: number[] = this.getRDValues(rectDifferences);
                    polygonAnnotation._dictionary.update('RD', rd);
                }
            }
            if (measureShapeAnnotation.isPrint && !isNullOrUndefined(measureShapeAnnotation["isPrint"]) && Boolean(measureShapeAnnotation["isPrint"].toString())) {
                if (measureShapeAnnotation.isCommentLock && !isNullOrUndefined(measureShapeAnnotation["isCommentLock"]) && Boolean(measureShapeAnnotation["isCommentLock"].toString())) {
                    polygonAnnotation.flags = PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
                } else {
                    polygonAnnotation.flags = PdfAnnotationFlag.print;
                }
            }
            if (measureShapeAnnotation.isLocked && !isNullOrUndefined(measureShapeAnnotation["isLocked"]) && Boolean(measureShapeAnnotation["isLocked"].toString())) {
                polygonAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            } else if (measureShapeAnnotation.isCommentLock && !isNullOrUndefined(measureShapeAnnotation["isCommentLock"]) && Boolean(measureShapeAnnotation["isCommentLock"].toString())) {
                polygonAnnotation.flags = PdfAnnotationFlag.readOnly;
            } else {
                polygonAnnotation.flags = PdfAnnotationFlag.print;
            }
            const measureDetail: any = JSON.parse(measureShapeAnnotation.calibrate);
            if (!isNullOrUndefined(measureDetail)) {
                polygonAnnotation._dictionary.set('Measure', this.setMeasureDictionary(measureDetail));
                if (measureShapeAnnotation["indent"] === "PolygonVolume" && measureDetail.hasOwnProperty('depth')) {
                    polygonAnnotation._dictionary.update("Depth", measureDetail["depth"]);
                }
            }
            if (!isNullOrUndefined(measureShapeAnnotation.customData)) {
                polygonAnnotation.setValues('CustomData', measureShapeAnnotation.customData);
            }
            if (measureShapeAnnotation.allowedInteractions && measureShapeAnnotation["allowedInteractions"] != null){
                polygonAnnotation.setValues('AllowedInteractions', JSON.stringify(measureShapeAnnotation["allowedInteractions"]));
            }
            polygonAnnotation.setAppearance(true);
            page.annotations.add(polygonAnnotation);
        }
    }
    /**
     * @param details
     * @param page
     *
     * @private
     */
    public addStickyNotes(details: any, page: PdfPage): void {
        const pageNo: number = details.pageNumber;
        const popUpAnnotation: any = details;
        const bounds: Rect = JSON.parse(popUpAnnotation.bounds);
        const cropValues : PointBase = this.getCropBoxValue(page, false);
        const left: number = this.convertPixelToPoint(bounds.left);
        const top: number = this.convertPixelToPoint(bounds.top);
        const width: number = this.convertPixelToPoint(bounds.width);
        const height: number = this.convertPixelToPoint(bounds.height);

        let cropX : number = 0;
        let cropY : number = 0;

        if (cropValues.x != 0 && cropValues.y != 0 && cropValues.x == left) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }

        else if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }

        const annotation: PdfPopupAnnotation = new PdfPopupAnnotation(null, cropX + left, cropY + top, width, height);

        if (popUpAnnotation['author'] === null) {
            popUpAnnotation['author'] = 'Guest';
        }
        if (popUpAnnotation['note'] != null) {
            annotation.text = popUpAnnotation['note'].toString();
        }
        annotation.author = popUpAnnotation['author'].toString();
        if (popUpAnnotation['subject'] != null) {
            annotation.subject = popUpAnnotation['subject'].toString();
        }
        annotation._dictionary.set('NM', popUpAnnotation.annotName.toString());
        let dateValue: Date;
        if (!isNullOrUndefined(popUpAnnotation.modifiedDate) && !isNaN(Date.parse(popUpAnnotation.modifiedDate))) {
            dateValue = new Date(Date.parse(popUpAnnotation.modifiedDate));
            annotation.modifiedDate = dateValue;
        }
        const commentsDetails: any = popUpAnnotation.comments;
        if (commentsDetails.length > 0) {
            for (let i: number = 0; i < commentsDetails.length; i++) {
                annotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], annotation.bounds));
            }
        }
        const reviewDetails: any = popUpAnnotation.review;
        annotation.reviewHistory.add(this.addReviewCollections(reviewDetails, annotation.bounds));
        const color: number[] = [255, 255, 51];
        annotation.color = color;
        annotation.opacity = popUpAnnotation.opacity;
        annotation.icon = PdfPopupIcon.comment;

        const isAnnotationFlagSet: boolean = false;

        if (!isNullOrUndefined(popUpAnnotation.annotationSettings)) {
            const annotationSettings: any = popUpAnnotation.annotationSettings;
            const isLock: boolean = annotationSettings.isLock;

            if (isLock) {
                annotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
            }
        }
        else if (!isNullOrUndefined(popUpAnnotation.isCommentLock) && popUpAnnotation.isCommentLock) {
            annotation.flags = PdfAnnotationFlag.readOnly;
        }
        else {
            annotation.flags = PdfAnnotationFlag.print;
        }
        if (!isNullOrUndefined(popUpAnnotation.customData)) {
            annotation.setValues('CustomData', popUpAnnotation.customData);
        }
        page.annotations.add(annotation);
    }

    /**
     * @param details
     * @param page
     * @param textFont
     *
     * @private
     */
    public addFreeText(details: any, page: PdfPage, textFont?: { [key: string]: any; }): void {
        const pageNo: number = details.pageIndex;
        const freeTextAnnotation: any = details;
        const bounds: Rect = JSON.parse(freeTextAnnotation.bounds);
        const cropValues : PointBase = this.getCropBoxValue(page, false);
        const left: number = this.convertPixelToPoint(bounds.left);
        const top: number = this.convertPixelToPoint(bounds.top);
        const width: number = this.convertPixelToPoint(bounds.width);
        const height: number = this.convertPixelToPoint(bounds.height);
        let cropX : number = 0;
        let cropY : number = 0;
        if (cropValues.x != 0 && cropValues.y != 0 && cropValues.x == left) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }
        else if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(cropX + left, cropY + top, width, height);
        annotation.setAppearance(true);
        if (freeTextAnnotation['author'] === null) {
            freeTextAnnotation['author'] = 'Guest';
        }
        annotation.author = freeTextAnnotation['author'].toString();
        let dateValue: Date;
        if (!isNullOrUndefined(freeTextAnnotation.modifiedDate) && !isNaN(Date.parse(freeTextAnnotation.modifiedDate))) {
            dateValue = new Date(Date.parse(freeTextAnnotation.modifiedDate));
            annotation.modifiedDate = dateValue;
        }
        const reviewDetails: any = freeTextAnnotation.review;
        annotation.reviewHistory.add(this.addReviewCollections(reviewDetails, annotation.bounds));
        annotation._dictionary.set('NM', freeTextAnnotation.annotName.toString());
        annotation.lineEndingStyle = PdfLineEndingStyle.openArrow;
        annotation.annotationIntent = PdfAnnotationIntent.freeTextTypeWriter;
        let fontSize: number = 0;
        if(!isNullOrUndefined(freeTextAnnotation.fontSize)) {
            fontSize = parseFloat(freeTextAnnotation.fontSize);
        }
        fontSize = !isNullOrUndefined(fontSize) && !isNaN(fontSize) && fontSize > 0 ? fontSize : 16; //default 16px
        let fontFamily: PdfFontFamily = this.getFontFamily(freeTextAnnotation.fontFamily);
        let fontJson: {[key:string]: boolean} = {};
        if (freeTextAnnotation.hasOwnProperty('font') && !isNullOrUndefined(freeTextAnnotation.font)) {
            fontJson = freeTextAnnotation.font;
        }
        let fontStyle: PdfFontStyle = this.getFontStyle(fontJson);
        annotation.font = new PdfStandardFont(fontFamily, this.convertPixelToPoint(fontSize), fontStyle);
        if(!isNullOrUndefined(textFont) && textFont.length > 0) {
            textFont.Keys.forEach((key: string) => {
                // Need to implement font stream
                let fontStream = textFont[key]; 
                if (freeTextAnnotation.hasOwnProperty('dynamicText') && !isNullOrUndefined(freeTextAnnotation.dynamicText.toString())) {
                   let fontAnnotation: PdfTrueTypeFont = new PdfTrueTypeFont(fontStream, this.convertPixelToPoint(fontSize), PdfFontStyle.regular);
                   let format: PdfStringFormat = new PdfStringFormat();
                   fontAnnotation.measureString(freeTextAnnotation.dynamicText.toString(), format);
                   let glyphPresent: boolean = fontAnnotation._dictionary.has('IsContainsFont') ? fontAnnotation._dictionary.get('IsContainsFont') : false;
                   if(glyphPresent) {
                       annotation.font = new PdfTrueTypeFont(fontStream, this.convertPixelToPoint(fontSize));
                   }
                }
            });
        }
        if (freeTextAnnotation['subject'] != null) {
            annotation.subject = freeTextAnnotation['subject'].toString();
        }
        // Markup Text
        annotation.text = '';
        if (freeTextAnnotation.hasOwnProperty('dynamicText') && !isNullOrUndefined(freeTextAnnotation.dynamicText.toString())) {
            // Markup Text
            annotation.text = freeTextAnnotation.dynamicText.toString();
        }
        annotation.rotationAngle = this.getRotateAngle(freeTextAnnotation.rotateAngle);
        const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
        lineBorder.width = !isNullOrUndefined(freeTextAnnotation.thickness) ? freeTextAnnotation.thickness : 1;
        annotation.border = lineBorder;
        if(freeTextAnnotation.hasOwnProperty('padding') && !isNullOrUndefined(freeTextAnnotation.padding)){
            const paddingValues: number = freeTextAnnotation.padding;
            // let padding: PdfPaddings = new PdfPaddings(); // PdfPaddings not exist in ej2-pdf
            // annotation.setPaddings(padding);  // setPaddings not exist
        }
        annotation.opacity = !isNullOrUndefined(freeTextAnnotation.opacity) ? freeTextAnnotation.opacity : 1;
        if (!isNullOrUndefined(freeTextAnnotation.strokeColor)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const strokeColor: any = JSON.parse(freeTextAnnotation.strokeColor);
            // eslint-disable-next-line max-len
            const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
            annotation.borderColor = color;
            // Modified Implementation for setting border width for transparent border
            if(this.isTransparentColor(strokeColor)) {
                annotation.border.width = !isNullOrUndefined(freeTextAnnotation.thickness) ? freeTextAnnotation.thickness : 0;
                
            }
        }
        if (!isNullOrUndefined(freeTextAnnotation.fillColor)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillColor: any = JSON.parse(freeTextAnnotation.fillColor);
            if (!this.isTransparentColor(fillColor)){
                const color: number[] = [fillColor.r, fillColor.g, fillColor.b];
                annotation.color = color;
            }
            if (fillColor.a < 1 && fillColor.a > 0) {
                annotation._dictionary.update('FillOpacity', fillColor.a);
                fillColor.a = 1;
            }
            else {
                annotation._dictionary.update('FillOpacity', fillColor.a);
            }
        }
        if (!isNullOrUndefined(freeTextAnnotation.fontColor)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const textMarkupColor: any = JSON.parse(freeTextAnnotation.fontColor);
            if (!this.isTransparentColor(textMarkupColor)){
                const fontColor: number[] = [textMarkupColor.r, textMarkupColor.g, textMarkupColor.b];
                annotation.textMarkUpColor = fontColor;
            }
        }
        const commentsDetails: any = freeTextAnnotation.comments;
        if (commentsDetails.length > 0) {
            for (let i: number = 0; i < commentsDetails.length; i++) {
                // eslint-disable-next-line max-len
                annotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], annotation.bounds));
            }
        }
        if (freeTextAnnotation.hasOwnProperty('annotationSettings') && !isNullOrUndefined(freeTextAnnotation.annotationSettings)) {
            const annotationSettings: any = freeTextAnnotation.annotationSettings;
            if (annotationSettings.hasOwnProperty('isLock') && !isNullOrUndefined(annotationSettings.isLock)) {
                if(annotationSettings.isLock){
                    annotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
                }
            }
        }
        else if (!isNullOrUndefined(freeTextAnnotation.isCommentLock) && freeTextAnnotation.isCommentLock) {
            annotation.flags = PdfAnnotationFlag.readOnly;
        }
        else {
            annotation.flags = PdfAnnotationFlag.print;
        }
        if (!isNullOrUndefined(freeTextAnnotation.customData)) {
            annotation.setValues('CustomData', freeTextAnnotation.customData);
        }
        if (freeTextAnnotation.hasOwnProperty("textAlign") &&!isNullOrUndefined(freeTextAnnotation.textAlign))
        {
            annotation.textAlignment = this.getPdfTextAlignment(freeTextAnnotation.textAlign.toString().toLowerCase());
        }
        let isReadonly: boolean = false;
        let isPrint: boolean = false;
        if (freeTextAnnotation.hasOwnProperty("isReadonly")) {
            isReadonly = !isNullOrUndefined(freeTextAnnotation.isReadonly) ? freeTextAnnotation.isReadonly : false;
        }
        if (freeTextAnnotation.hasOwnProperty("isPrint")) {
            isPrint = !isNullOrUndefined(freeTextAnnotation.isPrint) ? freeTextAnnotation.isPrint : false;
        }
        if (isReadonly && isPrint) {
            annotation.flags = PdfAnnotationFlag.readOnly | PdfAnnotationFlag.print;
        }
        else if (isPrint) {
            annotation.flags = PdfAnnotationFlag.print;
        }
        else if (isReadonly) {
            annotation.flags = PdfAnnotationFlag.readOnly;
        }
        if (freeTextAnnotation.hasOwnProperty("allowedInteractions") &&!isNullOrUndefined(freeTextAnnotation.allowedInteractions))
        {
            annotation.setValues('AllowedInteractions', JSON.stringify(freeTextAnnotation.allowedInteractions));
        }
        page.annotations.add(annotation);
    }
    
    // eslint-disable-next-line max-len
    private renderSignHereStamp(rubberStampAnnotation: PdfRubberStampAnnotation, rectangle: Rect, subject: string, textBrush: PdfBrush, page: PdfPage, pens: PdfPen): void {
        const stringFormat: PdfStringFormat = new PdfStringFormat();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 20, PdfFontStyle.bold | PdfFontStyle.italic);
        stringFormat.alignment = PdfTextAlignment.center;
        stringFormat.lineAlignment = PdfVerticalAlignment.middle;
        let point1: number[] = [0, 0];
        let point2: number[] = [0, 0];
        const drawingPath: _PdfPath = new _PdfPath();
        const appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
        if (this.defaultHeight > 0 && this.defaultWidth > 0) {
            appearance.graphics.scaleTransform(rectangle.width / (this.defaultWidth + 4), rectangle.height / 28.00);
        }
        point1 = [(this.defaultWidth / 2 + 1), 15, 0, 0];
        point2 = [0, 0];
        drawingPath._addLine(point1[0], point1[1], point2[0], point2[1]);
        const pointValues: number[] = [drawingPath._points[0][0], drawingPath._points[0][1], 0, 0];
        appearance.graphics.drawString(subject.toUpperCase(), font, pointValues, pens, textBrush, stringFormat);
    }

    private retriveDefaultWidth(subject: string): void {
        switch (subject.trim()) {
        case 'Witness':
            this.defaultWidth = 97.39;
            this.defaultHeight = 16.84;
            break;
        case 'Initial Here':
            this.defaultWidth = 151.345;
            this.defaultHeight = 16.781;
            break;
        case 'Sign Here':
            this.defaultWidth = 121.306;
            this.defaultHeight = 16.899;
            break;
        default:
            this.defaultWidth = 0;
            this.defaultHeight = 0;
            break;
        }
    }
    // eslint-disable-next-line max-len
    private renderDynamicStamp(rubberStampAnnotation: PdfRubberStampAnnotation, subject: string, text: string, textBrush: PdfBrush, rectangle: Rect, pens: PdfPen, page: PdfPage): void {
        const stringFormat: PdfStringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.left;
        stringFormat.lineAlignment = PdfVerticalAlignment.middle;
        const stampFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 20, PdfFontStyle.bold | PdfFontStyle.italic);
        // eslint-disable-next-line max-len
        const detailsFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, (rectangle.height / 6), PdfFontStyle.bold | PdfFontStyle.italic);
        const appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
        let point1: number[] = [0, 0];
        let point2: number[] = [0, 0];
        const drawingPath: _PdfPath = new _PdfPath();
        point1 = [5, (rectangle.height / 3)];
        point2 = [5, (rectangle.height - (detailsFont.size * 2))];
        drawingPath._addLine(point1[0], point1[1], point2[0], point2[1]);
        const stampTypeBounds: number[] = [drawingPath._points[0][0], drawingPath._points[0][1], 0, 0];
        const stampTimeStampbounds: number[] = [drawingPath._points[1][0], drawingPath._points[1][1], (rectangle.width - drawingPath._points[1][0]), (rectangle.height - drawingPath._points[1][1])];
        appearance.graphics.drawString(subject.toUpperCase(), stampFont, stampTypeBounds, pens, textBrush, stringFormat);
        appearance.graphics.drawString(text, detailsFont, stampTimeStampbounds, pens, textBrush, stringFormat);
    }

    private calculateBoundsXY(wrapperBounds: any, bounds: Rect, pageNo: number, pdfPageBase: any): Rect {
        const boundsXY: Rect = new Rect();

        const pageSize: SizeF = this.getPageSize(pageNo);

        if (pdfPageBase.pageRotation === PdfRotationAngle.angle90) {
            boundsXY.x = this.convertPixelToPoint(wrapperBounds.y);
            boundsXY.y = this.convertPixelToPoint(pageSize.width - wrapperBounds.x - wrapperBounds.width);
        }
        else if (pdfPageBase.pageRotation === PdfRotationAngle.angle180) {
            boundsXY.x = this.convertPixelToPoint(pageSize.width - wrapperBounds.x - wrapperBounds.width);
            boundsXY.y = this.convertPixelToPoint(pageSize.height - wrapperBounds.y - wrapperBounds.height);
        }
        else if (pdfPageBase.pageRotation === PdfRotationAngle.angle270) {
            boundsXY.x = this.convertPixelToPoint(pageSize.height - wrapperBounds.y - wrapperBounds.height);
            boundsXY.y = this.convertPixelToPoint(wrapperBounds.x);
        }
        else {
            boundsXY.x = this.convertPixelToPoint(wrapperBounds.x);
            boundsXY.y = this.convertPixelToPoint(wrapperBounds.y);
        }
        return boundsXY;
    }

    private getPageSize(pageNumber: number): SizeF {
        const page: PdfPage = this.pdfViewer.pdfRendererModule.loadedDocument.getPage(pageNumber);
        const size: number[] = page.size;
        return new SizeF(this.convertPointToPixel(size[0]), this.convertPointToPixel(size[1]));
    }
    private setMeasurementUnit(unit: string): PdfMeasurementUnit {
        let measurementUnit: PdfMeasurementUnit;
        switch (unit) {
            case 'cm':
                measurementUnit = PdfMeasurementUnit.centimeter;
                break;
            case 'in':
                measurementUnit = PdfMeasurementUnit.inch;
                break;
            case 'mm':
                measurementUnit = PdfMeasurementUnit.millimeter;
                break;
            case 'pt':
                measurementUnit = PdfMeasurementUnit.point;
                break;
            case 'p':
                measurementUnit = PdfMeasurementUnit.pica;
                break;
        }
        return measurementUnit;
    }
    private getRubberStampRotateAngle(angleString: string, rotationAngle: number): number {
        let angle: number = 0;
        switch (angleString) {
        case 'RotateAngle0':
            angle = 0;
            break;
        case 'RotateAngle180':
            angle = 180;
            break;
        case 'RotateAngle270':
            angle = 270;
            break;
        case 'RotateAngle90':
            angle = 90;
            break;
        default:
            break;
        }
        angle -= rotationAngle;
        return angle;
    }

    private getFontFamily(fontFamily: string): PdfFontFamily {
        let font: PdfFontFamily = PdfFontFamily.helvetica;
        fontFamily = !isNullOrUndefined(fontFamily) && fontFamily !== '' ? fontFamily : 'Helvetica';
        switch (fontFamily) {
        case 'Helvetica':
            font = PdfFontFamily.helvetica;
            break;
        case 'Courier':
            font = PdfFontFamily.courier;
            break;
        case 'Times New Roman':
            font = PdfFontFamily.timesRoman;
            break;
        case 'Symbol':
            font = PdfFontFamily.symbol;
            break;
        case 'ZapfDingbats':
            font = PdfFontFamily.zapfDingbats;
            break;
        default:
            break;
        }
        return font;
    }

    private getFontStyle(fontJson: {[key:string]: boolean}): PdfFontStyle{
        let fontStyle: PdfFontStyle = PdfFontStyle.regular;
        if(!isNullOrUndefined(fontJson)){
            if(fontJson.isBold){
                fontStyle = fontStyle | PdfFontStyle.bold;
            }
            if(fontJson.isItalic){
                fontStyle = fontStyle | PdfFontStyle.italic;
            }
            if(fontJson.isStrikeout){
                fontStyle = fontStyle | PdfFontStyle.strikeout;
            }
            if(fontJson.isUnderline){
                fontStyle = fontStyle | PdfFontStyle.underline;
            }
        }
        return fontStyle;
    }

    private getPdfTextAlignment(alignment: string): PdfTextAlignment {
        let textAlignment: PdfTextAlignment = PdfTextAlignment.left;
        switch (alignment) {
        case 'center':
            textAlignment = PdfTextAlignment.center;
            break;
        case 'right':
            textAlignment = PdfTextAlignment.right;
            break;
        case 'justify':
            textAlignment = PdfTextAlignment.justify;
            break;
        default:
            break;
        }
        return textAlignment;
    }

    // eslint-disable-next-line max-len
    private drawStampAsPath(resultObjects: string, rubberStampAnnotation: PdfRubberStampAnnotation, textBrush: PdfBrush, stampBrush: PdfBrush): void {
        const transformMatrix: Matrix = new Matrix(1, 0, 0, 1, 0, 0);
        let currentPoint: PointBase = { x: 0, y: 0 };
        let graphics: PdfGraphics;
        const graphicsPath: PdfPath = new PdfPath();
        const stampObjects: any = resultObjects;
        for (let index: number = 0; index < stampObjects.length; index++) {
            const val: any = stampObjects[parseInt(index.toString(), 10)];
            const path: any = val.command.toString();

            if (path === 'M') {
                graphicsPath.startFigure();
                currentPoint = { x: val.x, y: val.y };
            }
            if (path === 'L') {

                const array: any[] = [
                    currentPoint, { x: val.x, y: val.y }
                ];
                this.transformPoints(array);

                const array1: PointBase[] = [
                    { x: array[0].x, y: array[0].y }, { x: array[1].x, y: array[1].y }
                ];
                graphicsPath.addLine(array1[0], array1[1]);

                currentPoint = { x: val.x, y: val.y };
            }

            if (path === 'C') {
                const array2: PointBase[] = [
                    currentPoint,
                    { x: val.x, y: val.y },
                    { x: val.x1, y: val.y1 },
                    { x: val.x2, y: val.y2 }
                ];
                this.transformPoints(array2);
                const array21: PointBase[] = [
                    { x: array2[0].x, y: array2[0].y },
                    { x: array2[1].x, y: array2[1].y },
                    { x: array2[2].x, y: array2[2].y },
                    { x: array2[3].x, y: array2[3].y }
                ];
                graphicsPath.addBezier(array21[0], array21[1], array21[2], array21[3]);
                currentPoint = { x: val.x, y: val.y };
            }
            if (path === 'Z') {
                graphicsPath.closeFigure();
            }

        }
    }

    private transformPoints(points: any[]): void {
        if (!isNullOrUndefined(points)) {
            for (let i: number = 0; i < points.length; i++) {
                points[parseInt(i.toString(), 10)] = this.transform(points[parseInt(i.toString(), 10)]);
            }
        }
    }

    private transform(point: any): any {
        const x: number = point.x;
        const y: number = point.y;
        return { x, y };
    }

    private getIconName(stampAnnotation: any, subject: string, rubberStampAnnotation: PdfRubberStampAnnotation): boolean {
        let iconExists: boolean = true;
        switch (subject.trim()) {
        case 'Approved':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.approved;
            break;
        case 'Confidential':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.confidential;
            break;
        case 'Not Approved':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.notApproved;
            break;
        case 'Draft':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.draft;
            break;
        case 'Final':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.final;
            break;
        case 'Completed':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.completed;
            break;
        case 'For Public Release':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.forPublicRelease;
            break;
        case 'Not For Public Release':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.notForPublicRelease;
            break;
        case 'For Comment':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.forComment;
            break;
        case 'Void':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.void;
            break;
        case 'Preliminary Results':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.preliminaryResults;
            break;
        case 'Information Only':
            rubberStampAnnotation.icon = PdfRubberStampAnnotationIcon.informationOnly;
            break;

        default:
            iconExists = false;
            break;
        }
        return iconExists;
    }

    private addCircleMeasurementAnnotation(measureShapeAnnotation: any, page: PdfPage): PdfCircleAnnotation {
        const bounds: Rect = JSON.parse(measureShapeAnnotation.bounds);
        const cropValues : PointBase = this.getCropBoxValue(page, false);
        const left: number = this.convertPixelToPoint(bounds.left);
        const top: number = this.convertPixelToPoint(bounds.top);
        const width: number = this.convertPixelToPoint(bounds.width);
        const height: number = this.convertPixelToPoint(bounds.height);
        if (isNullOrUndefined(bounds.left)) {
            measureShapeAnnotation.bounds.left = 0;
        }
        if (isNullOrUndefined(bounds.top)) {
            measureShapeAnnotation.bounds.top = 0;
        }
        let cropX : number = 0;
        let cropY : number = 0;
        if (cropValues.x != 0 && cropValues.y != 0 && cropValues.x == left) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }

        else if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }
        // eslint-disable-next-line max-len
        const circleAnnotation: PdfCircleAnnotation = new PdfCircleAnnotation(cropX + left, cropY + top, width, height);
        if (!isNullOrUndefined(measureShapeAnnotation.note)) {
            circleAnnotation.text = measureShapeAnnotation.note.toString();
        }

        circleAnnotation.author = measureShapeAnnotation.author.toString();

        circleAnnotation._dictionary.set('NM', measureShapeAnnotation.annotName.toString());

        if (!isNullOrUndefined(measureShapeAnnotation.subject)) {
            circleAnnotation.subject = measureShapeAnnotation.subject.toString();
        }

        if (!isNullOrUndefined(measureShapeAnnotation.strokeColor)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const strokeColor: any = JSON.parse(measureShapeAnnotation.strokeColor);
            // eslint-disable-next-line max-len
            const color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
            circleAnnotation.color = color;
        }

        if (!isNullOrUndefined(measureShapeAnnotation.fillColor)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillColor: any = JSON.parse(measureShapeAnnotation.fillColor);
            if (!this.isTransparentColor(fillColor)){
                const innerColor: number[] = [fillColor.r, fillColor.g, fillColor.b];
                circleAnnotation.innerColor = innerColor;
            }
            if (fillColor.a < 1 && fillColor.a > 0) {
                circleAnnotation._dictionary.update('FillOpacity', fillColor.a);
                fillColor.a = 1;
            }
            else {
                circleAnnotation._dictionary.update('FillOpacity', fillColor.a);
            }
        }
        if (!isNullOrUndefined(measureShapeAnnotation.opacity)) {
            circleAnnotation.opacity = measureShapeAnnotation.opacity;
        }

        const lineBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
        lineBorder.width = measureShapeAnnotation.thickness;
        lineBorder.style = measureShapeAnnotation.borderStyle;
        lineBorder.dash = measureShapeAnnotation.borderDashArray;
        circleAnnotation.border = lineBorder;
        circleAnnotation.rotationAngle = this.getRotateAngle(measureShapeAnnotation.rotateAngle);

        let dateValue: Date;
        if (!isNullOrUndefined(measureShapeAnnotation.modifiedDate) && !isNaN(Date.parse(measureShapeAnnotation.modifiedDate))) {
            dateValue = new Date(Date.parse(measureShapeAnnotation.modifiedDate));
            circleAnnotation.modifiedDate = dateValue;
        }
        const commentsDetails: any = measureShapeAnnotation.comments;
        if (commentsDetails.length > 0) {
            for (let i: number = 0; i < commentsDetails.length; i++) {
                // eslint-disable-next-line max-len
                circleAnnotation.comments.add(this.addCommentsCollection(commentsDetails[parseInt(i.toString(), 10)], circleAnnotation.bounds));
            }
        }
        const reviewDetails: any = measureShapeAnnotation.review;
        circleAnnotation.reviewHistory.add(this.addReviewCollections(reviewDetails, circleAnnotation.bounds));

        if (!isNullOrUndefined(measureShapeAnnotation.isCloudShape) && measureShapeAnnotation.isCloudShape) {
            const borderEffect: PdfBorderEffect = new PdfBorderEffect();
            borderEffect.style = PdfBorderEffectStyle.cloudy; borderEffect.intensity = measureShapeAnnotation.cloudIntensity;
            circleAnnotation._borderEffect = borderEffect;
            const rectDifferences: string[] = JSON.parse(measureShapeAnnotation.rectangleDifference);
            if (rectDifferences.length > 0) {
                const rd: number[] = this.getRDValues(rectDifferences);
                circleAnnotation._dictionary.update('RD', rd);
            }
        }
        if (!isNullOrUndefined(measureShapeAnnotation.isLocked) && measureShapeAnnotation.isLocked) {
            circleAnnotation.flags = PdfAnnotationFlag.locked | PdfAnnotationFlag.print;
        }
        else if (!isNullOrUndefined(measureShapeAnnotation.isCommentLock) && measureShapeAnnotation.isCommentLock) {
            circleAnnotation.flags = PdfAnnotationFlag.readOnly;
        }
        else {
            circleAnnotation.flags = PdfAnnotationFlag.print;
        }
        circleAnnotation.measureType = PdfCircleMeasurementType.radius;

        const measureDetail: any = JSON.parse(measureShapeAnnotation.calibrate);

        if (!isNullOrUndefined(measureDetail)) {
            circleAnnotation._dictionary.set('Measure', this.setMeasureDictionary(measureDetail));
        }
        if (!isNullOrUndefined(measureShapeAnnotation.customData)) {
            circleAnnotation.setValues('CustomData', measureShapeAnnotation.customData);
        }
        circleAnnotation.setAppearance(true);
        return circleAnnotation;
    }

    private setMeasureDictionary(measureDetail: any): _PdfDictionary {
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        measureDictionary.set('Type', 'Measure');
        measureDictionary.set('R', measureDetail.ratio);
        if (!isNullOrUndefined(measureDetail.x)) {
            const xNumberFormat: _PdfDictionary[] = this.createNumberFormat(measureDetail.x);
            measureDictionary.set('X', xNumberFormat);

        }
        if (!isNullOrUndefined(measureDetail.distance)) {
            const dNumberFormat: _PdfDictionary[] = this.createNumberFormat(JSON.parse(measureDetail.distance));
            measureDictionary.set('D', dNumberFormat);

        }
        if (!isNullOrUndefined(measureDetail.area)) {
            const aNumberFormat: _PdfDictionary[] = this.createNumberFormat(JSON.parse(measureDetail.area));
            measureDictionary.set('A', aNumberFormat);

        }
        if (!isNullOrUndefined(measureDetail.angle)) {
            const tNumberFormat: _PdfDictionary[] = this.createNumberFormat(JSON.parse(measureDetail.angle));
            measureDictionary.set('T', tNumberFormat);

        }
        if (!isNullOrUndefined(measureDetail.volume)) {
            const vNumberFormat: _PdfDictionary[] = this.createNumberFormat(JSON.parse(measureDetail.volume));
            measureDictionary.set('V', vNumberFormat);
        }
        return measureDictionary;

    }

    private createNumberFormat(numberFormatList: any): _PdfDictionary[] {
        const numberFormats: _PdfDictionary[] = [];
        for (let index: number = 0; index < numberFormatList.length; index++) {
            const numberFormatDictionary: _PdfDictionary = new _PdfDictionary();
            const numberFormat: any = numberFormatList[parseInt(index.toString(), 10)];

            numberFormatDictionary.set('Type', 'NumberFormat');
            numberFormatDictionary.set('U', numberFormat.unit);
            numberFormatDictionary.set('F', numberFormat.fractionalType);
            numberFormatDictionary.set('D', numberFormat.denominator);
            numberFormatDictionary.set('C', numberFormat.conversionFactor);
            numberFormatDictionary.set('FD', numberFormat.formatDenominator);

            numberFormats.push(numberFormatDictionary);
        }
        return numberFormats;
    }

    private checkAnnotationLock(annotation: any): boolean {
        let isLock: boolean = false;
        if (!isNullOrUndefined(annotation.annotationSettings)) {
            const annotationSettings: any = annotation.annotationSettings;
            if (!isNullOrUndefined(annotationSettings.isLock)){
                isLock = annotationSettings.isLock;
            }
        }
        return isLock;
    }

    private getSaveVertexPoints(points: any, page: PdfPage): number[] {
        const cropValues : PointBase = this.getCropBoxValue(page, false);
        if (cropValues.x == 0 && page.cropBox[2] == page.size[0] && cropValues.y == page.size[1]) {
            cropValues.x = 0;
            cropValues.y = 0;
        }
        const pageHeight: number = page._size[1];
        const pointList: number[] = [];
        for (let index: number = 0; index < points.length; index++) {
            const x: number = this.convertPixelToPoint(points[parseInt(index.toString(), 10)].x) + cropValues.x;
            pointList.push(x);
            const y: number = pageHeight - this.convertPixelToPoint(points[parseInt(index.toString(), 10)].y) + cropValues.y;
            pointList.push(y);
        }
        return pointList;
    }

    private getLineEndingStyle(endingStyle: string): PdfLineEndingStyle {
        let style: PdfLineEndingStyle = PdfLineEndingStyle.none;
        switch (endingStyle) {
        case 'Square':
            style = PdfLineEndingStyle.square;
            break;
        case 'ClosedArrow':
            style = PdfLineEndingStyle.closedArrow;
            break;
        case 'RClosedArrow':
            style = PdfLineEndingStyle.rClosedArrow;
            break;
        case 'OpenArrow':
            style = PdfLineEndingStyle.openArrow;
            break;
        case 'ROpenArrow':
            style = PdfLineEndingStyle.rOpenArrow;
            break;
        case 'Butt':
            style = PdfLineEndingStyle.butt;
            break;
        case 'Circle':
            style = PdfLineEndingStyle.circle;
            break;
        case 'Diamond':
            style = PdfLineEndingStyle.diamond;
            break;
        case 'Slash':
            style = PdfLineEndingStyle.slash;
            break;
        }
        return style;

    }
    private getCaptionType(captionPosition: string): PdfLineCaptionType {
        let captionType: PdfLineCaptionType = PdfLineCaptionType.inline;
        switch (captionPosition) {
            case 'Inline':
                captionType = PdfLineCaptionType.inline;
                break;
            case 'Top':
                captionType = PdfLineCaptionType.top;
                break;
        }
        return captionType;
    }

    private addReviewCollections(popupAnnotation: any, bounds: any): PdfPopupAnnotation {
        const annotation: PdfPopupAnnotation = new PdfPopupAnnotation(null, bounds.x, bounds.y, bounds.width, bounds.height);
        if (popupAnnotation['state'] != null) {
            annotation.state = this.getReviewState(popupAnnotation['state'].toString());
            annotation.stateModel = PdfAnnotationStateModel.review;
        }
        return annotation;
    }

    private addCommentsCollection(popupAnnotation: any, bounds: any): PdfPopupAnnotation {
        // eslint-disable-next-line max-len
        const annotation: PdfPopupAnnotation = new PdfPopupAnnotation();
        annotation.text = popupAnnotation.note;
        annotation.author = popupAnnotation.author;
        annotation.subject = popupAnnotation.subject;
        if (!isNullOrUndefined(popupAnnotation.note)) {
            annotation.text = popupAnnotation['note'].toString();
        }
        else {
            annotation._annotFlags = PdfAnnotationFlag.print;
        }
        const reviewDetails: any = popupAnnotation.review;
        annotation.reviewHistory.add(this.addReviewCollections(reviewDetails, bounds));
        let dateValue: Date;
        if (!isNullOrUndefined(popupAnnotation.modifiedDate) && !isNaN(Date.parse(popupAnnotation.modifiedDate))) {
            dateValue = new Date(Date.parse(popupAnnotation.modifiedDate));
            annotation.modifiedDate = dateValue;
        }
        annotation._dictionary.set('NM', popupAnnotation.annotName.toString());
        return annotation;

    }

    private getReviewState(state: string): PdfAnnotationState {
        let reviewState: PdfAnnotationState;

        switch (state) {
        case 'Accepted':
            reviewState = PdfAnnotationState.accepted;
            break;
        case 'Cancelled':
            reviewState = PdfAnnotationState.cancel;
            break;
        case 'Completed':
            reviewState = PdfAnnotationState.completed;
            break;
        case 'Rejected':
            reviewState = PdfAnnotationState.rejected;
            break;
        case 'None':
            reviewState = PdfAnnotationState.none;
            break;
        default:
            reviewState = PdfAnnotationState.unmarked;
            break;
        }
        return reviewState;
    }


    private convertPixelToPoint(value: number): number {
        return (value * 72 / 96);
    }

    private convertPointToPixel(value: number): number {
        return (value * 96 / 72);
    }

    private isTransparentColor(fillColor: any): boolean {
        const isWhite: boolean = fillColor && fillColor.r === 255 && fillColor.g === 255 && fillColor.b === 255;
        return fillColor && fillColor.a === 0 && isWhite;
    }

    private getRDValues(values: string[]): number[] {
        const rectDifference: number[] = [];

        for (let i: number = 0; i < values.length; i++) {
            rectDifference.push(parseFloat(values[parseInt(i.toString(), 10)]));
        }
        return rectDifference;
    }

    private getRotateAngle(angleString: string): PdfRotationAngle {
        let angle: PdfRotationAngle = PdfRotationAngle.angle0;
        switch (angleString) {
        case 'RotateAngle0':
            angle = PdfRotationAngle.angle0;
            break;
        case 'RotateAngle180':
            angle = PdfRotationAngle.angle180;
            break;
        case 'RotateAngle270':
            angle = PdfRotationAngle.angle270;
            break;
        case 'RotateAngle90':
            angle = PdfRotationAngle.angle90;
            break;
        }
        return angle;
    }
    
    /**
     * @private
     * @param inkAnnot 
     * @param height 
     * @param width 
     * @param pageRotation 
     * @param pageNumber 
     * @param loadedPage 
     * @returns 
     */
    public loadSignature(inkAnnot: PdfInkAnnotation, height: number, width: number, pageRotation: number, pageNumber: number, loadedPage: PdfPage): SignatureAnnotationBase {

        let signature: SignatureAnnotationBase = new SignatureAnnotationBase();

        let outputstring: string = '';
        if (!isNullOrUndefined(inkAnnot.inkPointsCollection)) {
            for (let index: number = 0; index < inkAnnot.inkPointsCollection.length; index++) {
                const inkList: any = inkAnnot.inkPointsCollection[parseInt(index.toString(), 10)];

                for (let j = 0; j < inkList.length; j+= 2) {
                    let x: number;
                    let y: number;
                    if (j === 0) {
                        x = inkList[j];
                        y = height - inkList[j + 1];
                        outputstring += 'M' + x + ',' + y + ' ';
                    }
                    else {
                        x  = inkList[j];
                        y = height - inkList[j + 1];
                        outputstring += 'L' + x + ',' + y + ' ';
                    }
                }
            }
        }

        signature.AnnotationType = 'Signature';
        signature.Bounds = this.getBounds(inkAnnot.bounds, width, height, pageRotation);
        signature.Opacity = inkAnnot.opacity;
        signature.Thickness = inkAnnot.border.width;
        signature.PathData = outputstring;
        signature.StrokeColor = 'rgba(' + inkAnnot.color[0] + ',' + inkAnnot.color[1] + ',' + inkAnnot.color[2] + ',' + (inkAnnot.color[3] ? inkAnnot.color[3] : 1) + ')'
        signature.PageNumber = pageNumber;
        signature.SignatureName = inkAnnot.name;
        
        return signature;
        
    }

    /**
     * @private
     * @param inkAnnot 
     * @param height 
     * @param width 
     * @param pageRotation 
     * @param pageNumber 
     * @param loadedPage 
     * @returns 
     */
    public loadInkAnnotation(inkAnnot: PdfInkAnnotation, height: number, width: number, pageRotation: number, pageNumber: number, loadedPage: PdfPage): InkSignatureAnnotation {
        let signature: InkSignatureAnnotation = new InkSignatureAnnotation();
        let outputstring: string = '';
        if (!isNullOrUndefined(inkAnnot.inkPointsCollection)) {
            for (let index = 0; index < inkAnnot.inkPointsCollection.length; index++) {
                const inkList = inkAnnot.inkPointsCollection[parseInt(index.toString(), 10)];

                for (let j = 0; j < inkList.length; j += 2) {
                    let x: number;
                    let y: number;
                    if (inkAnnot._page.rotation == PdfRotationAngle.angle90) {
                        x = inkList[j + 1];
                        y = inkList[j];
                    }
                    else if (inkAnnot._page.rotation == PdfRotationAngle.angle180) {
                        x = inkAnnot._page.size[0] - inkList[j];
                        y = inkList[j + 1];
                    }
                    else if (inkAnnot._page.rotation == PdfRotationAngle.angle270) {
                        x = inkAnnot._page.size[0] - inkList[j + 1];
                        y = inkAnnot._page.size[1] - inkList[j];
                    }
                    else {
                        x = inkList[j];
                        y = inkAnnot._page.size[1] - inkList[j + 1];
                    }
                    if (j === 0) {
                        outputstring += 'M' + x + ',' + y + ' ';
                    }
                    else {
                        outputstring += 'L' + x + ',' + y + ' ';
                    }
                }
            }
        }
        signature.Author = inkAnnot.author;
        signature.Subject = inkAnnot.subject;
        if (!isNullOrUndefined(inkAnnot.modifiedDate)) {
            signature.ModifiedDate = this.formatDate(inkAnnot.modifiedDate);
        }
        else {
            signature.ModifiedDate = this.formatDate(new Date());
        }   
        signature.Note = this.getValidNoteContent(inkAnnot.text);
        for (let i = 0; i < inkAnnot.reviewHistory.count; i++) {
            signature.State = this.getStateString(inkAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            signature.StateModel = this.getStateModelString(inkAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(signature.State) || isNullOrUndefined(signature.StateModel)) {
            signature.State = 'Unmarked';
            signature.StateModel = 'None';
        }
        signature.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < inkAnnot.comments.count; i++) {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(inkAnnot.comments.at(i), height, width, pageRotation);
            signature.Comments.push(annot);
        }
        if (inkAnnot.flags === PdfAnnotationFlag.locked) {
            signature.IsLocked = true;
        }
        else {
            signature.IsLocked = false;
        }
        if (inkAnnot.flags === PdfAnnotationFlag.readOnly) {
            signature.IsCommentLock = true;
        }
        else {
            signature.IsCommentLock = false;
        }
        signature.AnnotationType = 'Ink';
        signature.AnnotType = 'Ink';
        signature.Bounds = this.getBounds(inkAnnot.bounds, height, width, pageRotation);
        if (inkAnnot.bounds.y < 0) {
            let cropRect: Rect = new Rect(inkAnnot.bounds.x, loadedPage.cropBox[1] + inkAnnot.bounds.y, inkAnnot.bounds.width, inkAnnot.bounds.height);
            signature.Bounds = this.getBounds(cropRect, height, width, pageRotation);
        }
        signature.Opacity = inkAnnot.opacity;
        signature.Thickness = inkAnnot.border.width;
        signature.PathData = outputstring;
        signature.StrokeColor = 'rgba(' + inkAnnot.color[0] + ',' + inkAnnot.color[1] + ',' + inkAnnot.color[2] + ',' + (inkAnnot.color[3] ? inkAnnot.color[3] : 1) + ')'
        signature.PageNumber = pageNumber;
        signature.AnnotName = inkAnnot.name;

        if (inkAnnot._dictionary.has('CustomData') && !isNullOrUndefined(inkAnnot._dictionary.get('CustomData'))) {
            const customData: any = inkAnnot._dictionary.get('CustomData');
            if (customData != null) {
                signature.ExistingCustomData = JSON.stringify(customData);
            }
        }

        return signature;

    }

    /**
     * @param squareAnnot
     * @param height
     * @param width
     * @param pageRotation
     * @param shapeFreeText
     * @private
     */
    public loadSquareAnnotation(squareAnnot: PdfSquareAnnotation, height: number, width: number, pageRotation: number, shapeFreeText: PdfFreeTextAnnotation): ShapeAnnotationBase {
        const shapeAnnotation: ShapeAnnotationBase = new ShapeAnnotationBase();
        shapeAnnotation.ShapeAnnotationType = 'Square';
        shapeAnnotation.Author = squareAnnot.author;
        shapeAnnotation.AnnotName = squareAnnot.name;
        shapeAnnotation.Subject = squareAnnot.subject;
        if (!isNullOrUndefined(squareAnnot.modifiedDate)) {
            shapeAnnotation.ModifiedDate = this.formatDate(squareAnnot.modifiedDate);
        }
        else {
            shapeAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        shapeAnnotation.Note = this.getValidNoteContent(squareAnnot.text);
        shapeAnnotation.Thickness = squareAnnot.border.width;
        shapeAnnotation.BorderStyle = this.getBorderStylesString(squareAnnot.border.style);
        shapeAnnotation.BorderDashArray = squareAnnot.border.dash ? squareAnnot.border.dash[0] ? squareAnnot.border.dash[0] : 0 : 0;
        shapeAnnotation.Opacity = squareAnnot.opacity;
        shapeAnnotation.RotateAngle = this.getRotateAngleString(squareAnnot.rotate);
        shapeAnnotation.AnnotType = 'shape';
        for (let i: number = 0; i < squareAnnot.reviewHistory.count; i++) {
            shapeAnnotation.State = this.getStateString(squareAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            shapeAnnotation.StateModel = this.getStateModelString(squareAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(shapeAnnotation.State) || isNullOrUndefined(shapeAnnotation.StateModel)) {
            shapeAnnotation.State = 'Unmarked';
            shapeAnnotation.StateModel = 'None';
        }

        shapeAnnotation.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < squareAnnot.comments.count; i++) {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(squareAnnot.comments.at(i), height, width, pageRotation);
            shapeAnnotation.Comments.push(annot);
        }
        shapeAnnotation.Bounds = this.getBounds(squareAnnot.bounds, height, width, pageRotation);
        shapeAnnotation.LineHeadStart = 'None';
        shapeAnnotation.LineHeadEnd = 'None';
        if (!isNullOrUndefined(squareAnnot.borderEffect)) {
            if (squareAnnot.borderEffect.style === PdfBorderEffectStyle.cloudy) {
                shapeAnnotation.IsCloudShape = true;
                shapeAnnotation.CloudIntensity = squareAnnot.borderEffect.intensity;
            }
            else {
                shapeAnnotation.IsCloudShape = false;
                shapeAnnotation.CloudIntensity = 0;
            }
        }
        else {
            shapeAnnotation.IsCloudShape = false;
            shapeAnnotation.CloudIntensity = 0;
        }
        if (squareAnnot._dictionary.has('RD') && !isNullOrUndefined(squareAnnot._dictionary.get('RD'))) {
            shapeAnnotation.RectangleDifference = squareAnnot._dictionary.get('RD');
        }
        else {
            shapeAnnotation.RectangleDifference = new Array<string>();
        }

        if (squareAnnot.flags === PdfAnnotationFlag.locked) {
            shapeAnnotation.IsLocked = true;
        }
        else {
            shapeAnnotation.IsLocked = false;
        }
        if (squareAnnot.flags === PdfAnnotationFlag.readOnly) {
            shapeAnnotation.IsCommentLock = true;
        }
        else {
            shapeAnnotation.IsCommentLock = false;
        }
        if (squareAnnot._annotFlags.toString().includes('Print')) {
            shapeAnnotation.IsPrint = true;
        }
        if (squareAnnot._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = squareAnnot.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            shapeAnnotation.AllowedInteractions = JSON.parse(text);
        }
        shapeAnnotation.StrokeColor = 'rgba(' + squareAnnot.color[0] + ',' + squareAnnot.color[1] + ',' + squareAnnot.color[2] + ',' + (squareAnnot.color[3] ? squareAnnot.color[3] : 1) + ')';
        let fillOpacity: number = squareAnnot.color[3] ? squareAnnot.color[3] : 1;
        if (squareAnnot._dictionary.has('FillOpacity') && !isNullOrUndefined(squareAnnot._dictionary.get('FillOpacity'))) {
            fillOpacity = parseInt(squareAnnot._dictionary.get('FillOpacity').toString(), 10);
        }
        fillOpacity = squareAnnot.innerColor ? fillOpacity : 0;
        squareAnnot.innerColor = squareAnnot.innerColor ? squareAnnot.innerColor : [255, 255, 255];
        shapeAnnotation.FillColor = 'rgba(' + squareAnnot.innerColor[0] + ',' + squareAnnot.innerColor[1] + ',' + squareAnnot.innerColor[2] + ',' + fillOpacity + ')';
        shapeAnnotation.EnableShapeLabel = false;
        if (shapeFreeText != null) {
            shapeAnnotation.EnableShapeLabel = true;
            shapeAnnotation.LabelContent = shapeFreeText.text;
            shapeAnnotation.LabelFillColor = 'rgba(' + shapeFreeText.color[0] + ',' + shapeFreeText.color[1] + ',' + shapeFreeText.color[2] + ',' + (shapeFreeText.color[3] ? shapeFreeText.color[3] : 1) + ')';
            shapeAnnotation.FontColor = 'rgba(' + shapeFreeText.textMarkUpColor[0] + ',' + shapeFreeText.textMarkUpColor[1] + ',' + shapeFreeText.textMarkUpColor[2] + ',' + (shapeFreeText.textMarkUpColor[3] ? shapeFreeText.textMarkUpColor[3] : 1) + ')';
            shapeAnnotation.LabelBorderColor = 'rgba(' + shapeFreeText.borderColor[0] + ',' + shapeFreeText.borderColor[1] + ',' + shapeFreeText.borderColor[2] + ',' + (shapeFreeText.borderColor[3] ? shapeFreeText.borderColor[3] : 1) + ')';
            shapeAnnotation.FontSize = shapeFreeText.font.size;
        }
        if (squareAnnot._dictionary.has('CustomData') && !isNullOrUndefined(squareAnnot._dictionary.get('CustomData'))) {
            const customData: any = squareAnnot._dictionary.get('CustomData');
            if (customData != null) {
                shapeAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        return shapeAnnotation;
    }

    // eslint-disable-next-line max-len
    /**
     * @param lineAnnot
     * @param height
     * @param width
     * @param pageRotation
     * @param shapeFreeText
     * @private
     */
    public loadLineAnnotation(lineAnnot: PdfLineAnnotation, height: number, width: number, pageRotation: number, shapeFreeText: PdfFreeTextAnnotation): ShapeAnnotationBase {
        const shapeAnnotation: ShapeAnnotationBase = new ShapeAnnotationBase();
        shapeAnnotation.ShapeAnnotationType = 'Line';
        shapeAnnotation.Author = lineAnnot.author;
        shapeAnnotation.AnnotName = lineAnnot.name;
        shapeAnnotation.Subject = lineAnnot.subject;
        if (!isNullOrUndefined(lineAnnot.modifiedDate)) {
            shapeAnnotation.ModifiedDate = this.formatDate(lineAnnot.modifiedDate);
        }
        else {
            shapeAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        shapeAnnotation.Note = this.getValidNoteContent(lineAnnot.text);
        shapeAnnotation.Thickness = lineAnnot.border.width;
        shapeAnnotation.BorderStyle = this.getBorderStylesString(lineAnnot.border.style);
        shapeAnnotation.BorderDashArray = lineAnnot.border.dash ? lineAnnot.border.dash[0] ? lineAnnot.border.dash[0] : 0 : 0;
        shapeAnnotation.Opacity = lineAnnot.opacity;
        shapeAnnotation.RotateAngle = this.getRotateAngleString(lineAnnot.rotate);
        shapeAnnotation.AnnotType = 'shape';
        shapeAnnotation.EnableShapeLabel = false;
        if (shapeFreeText != null) {
            shapeAnnotation.EnableShapeLabel = true;
            shapeAnnotation.LabelContent = shapeFreeText.text;
            shapeAnnotation.LabelFillColor = 'rgba(' + shapeFreeText.color[0] + ',' + shapeFreeText.color[1] + ',' + shapeFreeText.color[2] + ',' + (shapeFreeText.color[3] ? shapeFreeText.color[3] : 1) + ')';
            shapeAnnotation.FontColor = 'rgba(' + shapeFreeText.textMarkUpColor[0] + ',' + shapeFreeText.textMarkUpColor[1] + ',' + shapeFreeText.textMarkUpColor[2] + ',' + (shapeFreeText.textMarkUpColor[3] ? shapeFreeText.textMarkUpColor[3] : 1) + ')';
            shapeAnnotation.LabelBorderColor = 'rgba(' + shapeFreeText.borderColor[0] + ',' + shapeFreeText.borderColor[1] + ',' + shapeFreeText.borderColor[2] + ',' + (shapeFreeText.borderColor[3] ? shapeFreeText.borderColor[3] : 1) + ')';
            shapeAnnotation.FontSize = shapeFreeText.font.size;
        }
        for (let i: number = 0; i < lineAnnot.reviewHistory.count; i++) {
            shapeAnnotation.State = this.getStateString(lineAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            shapeAnnotation.StateModel = this.getStateModelString(lineAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(shapeAnnotation.State) || isNullOrUndefined(shapeAnnotation.StateModel)) {
            shapeAnnotation.State = 'Unmarked';
            shapeAnnotation.StateModel = 'None';
        }

        shapeAnnotation.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < lineAnnot.comments.count; i++) {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(lineAnnot.comments.at(i), height, width, pageRotation);
            shapeAnnotation.Comments.push(annot);
        }
        shapeAnnotation.Bounds = this.getBounds(lineAnnot.bounds, height, width, pageRotation);
        shapeAnnotation.LineHeadStart = this.getLineEndingStyleString(lineAnnot.lineEndingStyle.begin);
        shapeAnnotation.LineHeadEnd = this.getLineEndingStyleString(lineAnnot.lineEndingStyle.end);
        if (!isNullOrUndefined(lineAnnot._borderEffect)) {
            if (lineAnnot._borderEffect.style === PdfBorderEffectStyle.cloudy) {
                shapeAnnotation.IsCloudShape = true;
                shapeAnnotation.CloudIntensity = lineAnnot._borderEffect.intensity;
            } else {
                shapeAnnotation.IsCloudShape = false;
                shapeAnnotation.CloudIntensity = 0;
            }
        } else {
            shapeAnnotation.IsCloudShape = false;
            shapeAnnotation.CloudIntensity = 0;
        }
        const indent: string = this.getLineIndentString(lineAnnot.lineIntent);
        shapeAnnotation.VertexPoints = this.getLinePoints(lineAnnot.linePoints, height, width, pageRotation, lineAnnot._page);
        if (lineAnnot._dictionary.has('RD') && !isNullOrUndefined(lineAnnot._dictionary.get('RD'))) {
            shapeAnnotation.RectangleDifference = lineAnnot._dictionary.get('RD');
        } else {
            shapeAnnotation.RectangleDifference = new Array<string>();
        }

        if (lineAnnot.flags === PdfAnnotationFlag.locked) {
            shapeAnnotation.IsLocked = true;
        }
        else {
            shapeAnnotation.IsLocked = false;
        }
        if (lineAnnot.flags === PdfAnnotationFlag.readOnly) {
            shapeAnnotation.IsCommentLock = true;
        }
        else {
            shapeAnnotation.IsCommentLock = false;
        }
        if (lineAnnot._annotFlags.toString().includes('Print')) {
            shapeAnnotation.IsPrint = true;
        }
        if (lineAnnot._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = lineAnnot.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            shapeAnnotation.AllowedInteractions = JSON.parse(text);
        }

        shapeAnnotation.StrokeColor = 'rgba(' + lineAnnot.color[0] + ',' + lineAnnot.color[1] + ',' + lineAnnot.color[2] + ',' + (lineAnnot.color[3] ? lineAnnot.color[3] : 1) + ')';
        let fillOpacity: number = lineAnnot.color[3] ? lineAnnot.color[3] : 1;
        if (lineAnnot._dictionary.has('FillOpacity') && !isNullOrUndefined(lineAnnot._dictionary.get('FillOpacity'))) {
            fillOpacity = parseInt(lineAnnot._dictionary.get('FillOpacity').toString(), 10);
        }
        fillOpacity = lineAnnot.innerColor ? fillOpacity : 0;
        lineAnnot.innerColor = lineAnnot.innerColor ? lineAnnot.innerColor : [255, 255, 255];
        shapeAnnotation.FillColor = 'rgba(' + lineAnnot.innerColor[0] + ',' + lineAnnot.innerColor[1] + ',' + lineAnnot.innerColor[2] + ',' + fillOpacity + ')';
        if (lineAnnot._dictionary.has('CustomData') && !isNullOrUndefined(lineAnnot._dictionary.get('CustomData'))) {
            const customData: any = lineAnnot._dictionary.get('CustomData');
            if (customData != null) {
                shapeAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        if (lineAnnot.lineIntent === PdfLineIntent.lineArrow || !lineAnnot._dictionary.has('Measure')) {
        return shapeAnnotation;
        } else {
            let measureShapeAnnotation: MeasureShapeAnnotationBase = new MeasureShapeAnnotationBase(shapeAnnotation);
            if (lineAnnot._dictionary.has('Measure')) {
                measureShapeAnnotation.Calibrate = this.getMeasureObject(lineAnnot);
    }
            measureShapeAnnotation.Indent = lineAnnot.lineIntent.toString();
            measureShapeAnnotation.Caption = lineAnnot.caption.cap;
            measureShapeAnnotation.LeaderLength = lineAnnot.leaderLine;
            measureShapeAnnotation.LeaderLineExtension = lineAnnot.leaderExt;
            measureShapeAnnotation.ExistingCustomData = shapeAnnotation.ExistingCustomData;
            if (lineAnnot._dictionary.has('LLO')) {
                measureShapeAnnotation.LeaderLineOffset = lineAnnot._dictionary.get('LLO');
            } else {
                measureShapeAnnotation.LeaderLineOffset = 0;
            }
            measureShapeAnnotation.CaptionPosition = lineAnnot.caption.type.toString();
            if (lineAnnot.flags === PdfAnnotationFlag.readOnly) {
                measureShapeAnnotation.IsCommentLock = true;
            } else {
                measureShapeAnnotation.IsCommentLock = false;
            }
            if (lineAnnot.flags === PdfAnnotationFlag.print) {
                measureShapeAnnotation.IsPrint = true;
            }
            if (lineAnnot._dictionary.has('CustomData') && !isNullOrUndefined(lineAnnot._dictionary.get('CustomData'))) {
                const customData: any = lineAnnot._dictionary.get('CustomData');
                if (customData != null) {
                    measureShapeAnnotation.ExistingCustomData = JSON.stringify(customData);
                }
            }
            return measureShapeAnnotation;
        }
    }

    private getLinePoints(points: number[], pageHeight: number, pageWidth: number, pageRotation: number, page: PdfPage): AnnotPoint[] {
        const linePoints: AnnotPoint[] = [];
        let startingPoint: AnnotPoint = new AnnotPoint(points[0], points[1]);
        let endingPoint: AnnotPoint = new AnnotPoint(points[2], points[3]);
        const cropBox: number[] = this.getBothCropBoxValue(page);
        let cropBoxX: number = 0;
        let cropBoxY: number = 0;
        if (!(cropBox[0] == 0 && (page as PdfPage).cropBox[2] == page.size[2] && cropBox[1] == page.size[3])) {
            cropBoxX = cropBox[0];
            cropBoxY = cropBox[1];
        }
        if (pageRotation == 0) {
            startingPoint = { X: this.convertPointToPixel(points[0]) - this.convertPointToPixel(cropBoxX), Y: (pageHeight - this.convertPointToPixel(points[1])) + this.convertPointToPixel(cropBoxY) };
            endingPoint = { X: this.convertPointToPixel(points[2]) - this.convertPointToPixel(cropBoxX), Y: (pageHeight - this.convertPointToPixel(points[3])) + this.convertPointToPixel(cropBoxY) };
        } else if (pageRotation == 1) {
            startingPoint = { X: this.convertPointToPixel(points[1]), Y: this.convertPointToPixel(points[0]) };
            endingPoint = { X: this.convertPointToPixel(points[3]), Y: this.convertPointToPixel(points[2]) };
        } else if (pageRotation == 2) {
            startingPoint = { X: pageWidth - this.convertPointToPixel(points[0]), Y: this.convertPointToPixel(points[1]) };
            endingPoint = { X: pageWidth - this.convertPointToPixel(points[2]), Y: this.convertPointToPixel(points[3]) };
        } else if (pageRotation == 3) {
            startingPoint = { X: (pageWidth - this.convertPointToPixel(points[1])), Y: (pageHeight - this.convertPointToPixel(points[0])) };
            endingPoint = { X: pageWidth - this.convertPointToPixel(points[3]), Y: pageHeight - this.convertPointToPixel(points[2]) };
        }
        linePoints.push(startingPoint);
        linePoints.push(endingPoint);
        return linePoints;
    }

    /**
     * @param ellipseAnnot
     * @param height
     * @param width
     * @param pageRotation
     * @param shapeFreeText
     * @private
     */
    public loadEllipseAnnotation(ellipseAnnot: PdfEllipseAnnotation, height: number, width: number, pageRotation: number, shapeFreeText: PdfFreeTextAnnotation): ShapeAnnotationBase {
        const shapeAnnotation: ShapeAnnotationBase = new ShapeAnnotationBase();
        shapeAnnotation.ShapeAnnotationType = 'Circle';
        shapeAnnotation.Author = ellipseAnnot.author;
        shapeAnnotation.AnnotName = ellipseAnnot.name;
        shapeAnnotation.Subject = ellipseAnnot.subject;
        if (!isNullOrUndefined(ellipseAnnot.modifiedDate)) {
            shapeAnnotation.ModifiedDate = this.formatDate(ellipseAnnot.modifiedDate);
        }
        else {
            shapeAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        shapeAnnotation.Note = this.getValidNoteContent(ellipseAnnot.text);
        shapeAnnotation.Thickness = ellipseAnnot.border.width;
        shapeAnnotation.BorderStyle = this.getBorderStylesString(ellipseAnnot.border.style);
        shapeAnnotation.BorderDashArray = ellipseAnnot.border.dash ? ellipseAnnot.border.dash[0] ? ellipseAnnot.border.dash[0] : 0 : 0;
        shapeAnnotation.Opacity = ellipseAnnot.opacity;
        shapeAnnotation.RotateAngle = this.getRotateAngleString(ellipseAnnot.rotate);
        shapeAnnotation.AnnotType = 'shape';
        for (let i: number = 0; i < ellipseAnnot.reviewHistory.count; i++) {
            shapeAnnotation.State = this.getStateString(ellipseAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            shapeAnnotation.StateModel = this.getStateModelString(ellipseAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(shapeAnnotation.State) || isNullOrUndefined(shapeAnnotation.StateModel)) {
            shapeAnnotation.State = 'Unmarked';
            shapeAnnotation.StateModel = 'None';
        }

        shapeAnnotation.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < ellipseAnnot.comments.count; i++) {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(ellipseAnnot.comments.at(i), height, width, pageRotation);
            shapeAnnotation.Comments.push(annot);
        }
        shapeAnnotation.Bounds = this.getBounds(ellipseAnnot.bounds, height, width, pageRotation);
        shapeAnnotation.LineHeadStart = 'None';
        shapeAnnotation.LineHeadEnd = 'None';
        if (!isNullOrUndefined(ellipseAnnot._borderEffect)) {
            if (ellipseAnnot._borderEffect.style === PdfBorderEffectStyle.cloudy) {
                shapeAnnotation.IsCloudShape = true;
                shapeAnnotation.CloudIntensity = ellipseAnnot._borderEffect.intensity;
            }
            else {
                shapeAnnotation.IsCloudShape = false;
                shapeAnnotation.CloudIntensity = 0;
            }
        }
        else {
            shapeAnnotation.IsCloudShape = false;
            shapeAnnotation.CloudIntensity = 0;
        }
        if (ellipseAnnot._dictionary.has('RD') && !isNullOrUndefined(ellipseAnnot._dictionary.get('RD'))) {
            shapeAnnotation.RectangleDifference = ellipseAnnot._dictionary.get('RD');
        }
        else {
            shapeAnnotation.RectangleDifference = new Array<string>();
        }

        if (ellipseAnnot.flags === PdfAnnotationFlag.locked) {
            shapeAnnotation.IsLocked = true;
        }
        else {
            shapeAnnotation.IsLocked = false;
        }
        if (ellipseAnnot.flags === PdfAnnotationFlag.readOnly) {
            shapeAnnotation.IsCommentLock = true;
        }
        else {
            shapeAnnotation.IsCommentLock = false;
        }
        if (ellipseAnnot._annotFlags.toString().includes('Print')) {
            shapeAnnotation.IsPrint = true;
        }
        if (ellipseAnnot._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = ellipseAnnot.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            shapeAnnotation.AllowedInteractions = JSON.parse(text);
        }
        shapeAnnotation.StrokeColor = 'rgba(' + ellipseAnnot.color[0] + ',' + ellipseAnnot.color[1] + ',' + ellipseAnnot.color[2] + ',' + (ellipseAnnot.color[3] ? ellipseAnnot.color[3] : 1) + ')';
        let fillOpacity: number = ellipseAnnot.color[3] ? ellipseAnnot.color[3] : 1;
        if (ellipseAnnot._dictionary.has('FillOpacity') && !isNullOrUndefined(ellipseAnnot._dictionary.get('FillOpacity'))) {
            fillOpacity = parseInt(ellipseAnnot._dictionary.get('FillOpacity').toString(), 10);
        }
        fillOpacity = ellipseAnnot.innerColor ? fillOpacity : 0;
        ellipseAnnot.innerColor = ellipseAnnot.innerColor ? ellipseAnnot.innerColor : [255, 255, 255];
        shapeAnnotation.FillColor = 'rgba(' + ellipseAnnot.innerColor[0] + ',' + ellipseAnnot.innerColor[1] + ',' + ellipseAnnot.innerColor[2] + ',' + fillOpacity + ')';
        shapeAnnotation.EnableShapeLabel = false;
        if (shapeFreeText != null) {
            shapeAnnotation.EnableShapeLabel = true;
            shapeAnnotation.LabelContent = shapeFreeText.text;
            shapeAnnotation.LabelFillColor = 'rgba(' + shapeFreeText.color[0] + ',' + shapeFreeText.color[1] + ',' + shapeFreeText.color[2] + ',' + (shapeFreeText.color[3] ? shapeFreeText.color[3] : 1) + ')';
            shapeAnnotation.FontColor = 'rgba(' + shapeFreeText.textMarkUpColor[0] + ',' + shapeFreeText.textMarkUpColor[1] + ',' + shapeFreeText.textMarkUpColor[2] + ',' + (shapeFreeText.textMarkUpColor[3] ? shapeFreeText.textMarkUpColor[3] : 1) + ')';
            shapeAnnotation.LabelBorderColor = 'rgba(' + shapeFreeText.borderColor[0] + ',' + shapeFreeText.borderColor[1] + ',' + shapeFreeText.borderColor[2] + ',' + (shapeFreeText.borderColor[3] ? shapeFreeText.borderColor[3] : 1) + ')';
            shapeAnnotation.FontSize = shapeFreeText.font.size;
        }
        if (ellipseAnnot._dictionary.has('CustomData') && !isNullOrUndefined(ellipseAnnot._dictionary.get('CustomData'))) {
            const customData: any = ellipseAnnot._dictionary.get('CustomData');
            if (customData != null) {
                shapeAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        if (ellipseAnnot._dictionary.has('Measure')) {
            shapeAnnotation.FillColor = 'rgba(' + ellipseAnnot.innerColor[0] + ',' + ellipseAnnot.innerColor[1] + ',' + ellipseAnnot.innerColor[2] + ',' + fillOpacity + ')';
            let measureShapeAnnotation: MeasureShapeAnnotationBase = new MeasureShapeAnnotationBase(shapeAnnotation);
            measureShapeAnnotation.Calibrate = this.getMeasureObject(ellipseAnnot as PdfAnnotation);
            if (ellipseAnnot._dictionary.has('IT')) {
                measureShapeAnnotation.Indent = ellipseAnnot._dictionary.get('IT');
            }
            else {
                measureShapeAnnotation.Indent = 'PolyLineDimension';
            }
            measureShapeAnnotation.Caption = false;
            measureShapeAnnotation.LeaderLength = 0;
            measureShapeAnnotation.LeaderLineExtension = 0;
            measureShapeAnnotation.LeaderLineOffset = 0;
            measureShapeAnnotation.CaptionPosition = '';
            if (ellipseAnnot.flags === PdfAnnotationFlag.readOnly) {
                measureShapeAnnotation.IsCommentLock = true;
            }
            else {
                measureShapeAnnotation.IsCommentLock = false;
            }
            if (ellipseAnnot.flags === PdfAnnotationFlag.print) {
                measureShapeAnnotation.IsPrint = true;
            }
            if (ellipseAnnot._dictionary.has('CustomData') && !isNullOrUndefined(ellipseAnnot._dictionary.get('CustomData'))) {
                const customData: any = ellipseAnnot._dictionary.get('CustomData');
                if (customData != null) {
                    measureShapeAnnotation.ExistingCustomData = JSON.stringify(customData);
                }
            }
            return measureShapeAnnotation;
        }
        else {
        return shapeAnnotation;
    }
    }

    /**
     * @param polygonAnnot
     * @param height
     * @param width
     * @param pageRotation
     * @param shapeFreeText
     * @private
     */
    public loadPolygonAnnotation(polygonAnnot: PdfPolygonAnnotation, height: number, width: number, pageRotation: number, shapeFreeText: PdfFreeTextAnnotation): ShapeAnnotationBase {
        const shapeAnnotation: ShapeAnnotationBase = new ShapeAnnotationBase();
        shapeAnnotation.ShapeAnnotationType = 'Polygon';
        shapeAnnotation.Author = polygonAnnot.author;
        shapeAnnotation.AnnotName = polygonAnnot.name;
        shapeAnnotation.Subject = polygonAnnot.subject;
        if (!isNullOrUndefined(polygonAnnot.modifiedDate)){
            shapeAnnotation.ModifiedDate = this.formatDate(polygonAnnot.modifiedDate);
        }
        else{
            shapeAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        shapeAnnotation.Note = this.getValidNoteContent(polygonAnnot.text);
        shapeAnnotation.Thickness = polygonAnnot.border.width;
        shapeAnnotation.BorderStyle = this.getBorderStylesString(polygonAnnot.border.style);
        shapeAnnotation.BorderDashArray = polygonAnnot.border.dash ? polygonAnnot.border.dash[0] ? polygonAnnot.border.dash[0] : 0 : 0;
        shapeAnnotation.Opacity = polygonAnnot.opacity;
        shapeAnnotation.RotateAngle = this.getRotateAngleString(polygonAnnot.rotate);
        shapeAnnotation.AnnotType = 'shape';
        for (let i: number = 0; i < polygonAnnot.reviewHistory.count; i++)
        {
            shapeAnnotation.State = this.getStateString(polygonAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            shapeAnnotation.StateModel = this.getStateModelString(polygonAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(shapeAnnotation.State) || isNullOrUndefined(shapeAnnotation.StateModel))
        {
            shapeAnnotation.State = 'Unmarked';
            shapeAnnotation.StateModel = 'None';
        }

        shapeAnnotation.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < polygonAnnot.comments.count; i++)
        {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(polygonAnnot.comments.at(i), height, width, pageRotation);
            shapeAnnotation.Comments.push(annot);
        }
        shapeAnnotation.Bounds = this.getBounds(polygonAnnot.bounds, height, width, pageRotation);
        if (!isNullOrUndefined(polygonAnnot._dictionary.get('Vertices'))){
            shapeAnnotation.VertexPoints = this.getVertexPoints(polygonAnnot._dictionary.get('Vertices'), width, height, pageRotation, polygonAnnot._page);
        }
        if (!isNullOrUndefined(shapeAnnotation.VertexPoints) && shapeAnnotation.VertexPoints[0] !== shapeAnnotation.VertexPoints[shapeAnnotation.VertexPoints.length - 1]){
            shapeAnnotation.VertexPoints.push(shapeAnnotation.VertexPoints[0]);
        }
        shapeAnnotation.StrokeColor = 'rgba(' + polygonAnnot.color[0] + ',' + polygonAnnot.color[1] + ',' + polygonAnnot.color[2] + ',' + (polygonAnnot.color[3] ? polygonAnnot.color[3] : 1) + ')';
        let fillOpacity: number = polygonAnnot.color[3] ? polygonAnnot.color[3] : 1;
        if (polygonAnnot._dictionary.has('FillOpacity') && !isNullOrUndefined(polygonAnnot._dictionary.get('FillOpacity'))) {
            fillOpacity = parseInt(polygonAnnot._dictionary.get('FillOpacity').toString(), 10);
        }
        fillOpacity = polygonAnnot.innerColor ? fillOpacity : 0;
        polygonAnnot.innerColor = polygonAnnot.innerColor ? polygonAnnot.innerColor : [255, 255, 255];
        shapeAnnotation.FillColor = 'rgba(' + polygonAnnot.innerColor[0] + ',' + polygonAnnot.innerColor[1] + ',' + polygonAnnot.innerColor[2] + ',' + fillOpacity + ')';
        shapeAnnotation.LineHeadStart = 'None';
        shapeAnnotation.LineHeadEnd = 'None';
        shapeAnnotation.EnableShapeLabel = false;
        if (shapeFreeText != null){
            shapeAnnotation.EnableShapeLabel = true;
            shapeAnnotation.LabelContent = shapeFreeText.text;
            shapeAnnotation.LabelFillColor = 'rgba(' + shapeFreeText.color[0] + ',' + shapeFreeText.color[1] + ',' + shapeFreeText.color[2] + ',' + (shapeFreeText.color[3] ? shapeFreeText.color[3] : 1) + ')';
            shapeAnnotation.FontColor = 'rgba(' + shapeFreeText.textMarkUpColor[0] + ',' + shapeFreeText.textMarkUpColor[1] + ',' + shapeFreeText.textMarkUpColor[2] + ',' + (shapeFreeText.textMarkUpColor[3] ? shapeFreeText.textMarkUpColor[3] : 1) + ')';
            shapeAnnotation.LabelBorderColor = 'rgba(' + shapeFreeText.borderColor[0] + ',' + shapeFreeText.borderColor[1] + ',' + shapeFreeText.borderColor[2] + ',' + (shapeFreeText.borderColor[3] ? shapeFreeText.borderColor[3] : 1) + ')';
            shapeAnnotation.FontSize = shapeFreeText.font.size;
        }
        if (!isNullOrUndefined(polygonAnnot.borderEffect)){
            if (polygonAnnot.borderEffect.style === PdfBorderEffectStyle.cloudy){
                shapeAnnotation.IsCloudShape = true;
                shapeAnnotation.CloudIntensity = polygonAnnot.borderEffect.intensity;
            }
            else{
                shapeAnnotation.IsCloudShape = false;
                shapeAnnotation.CloudIntensity = 0;
            }
        }
        else{
            shapeAnnotation.IsCloudShape = false;
            shapeAnnotation.CloudIntensity = 0;
        }
        if (polygonAnnot._dictionary.has('RD') && !isNullOrUndefined(polygonAnnot._dictionary.get('RD'))){
            shapeAnnotation.RectangleDifference = polygonAnnot._dictionary.get('RD');
        }
        else{
            shapeAnnotation.RectangleDifference = new Array<string>();
        }

        if (polygonAnnot.flags === PdfAnnotationFlag.locked) {
            shapeAnnotation.IsLocked = true;
        }
        else {
            shapeAnnotation.IsLocked = false;
        }
        if (polygonAnnot.flags === PdfAnnotationFlag.readOnly) {
            shapeAnnotation.IsCommentLock = true;
        }
        else {
            shapeAnnotation.IsCommentLock = false;
        }
        if (polygonAnnot.flags === PdfAnnotationFlag.print) {
            shapeAnnotation.IsPrint = true;
        }
        if (polygonAnnot._dictionary.has('CustomData') && !isNullOrUndefined(polygonAnnot._dictionary.get('CustomData')))
        {
            const customData: any = polygonAnnot._dictionary.get('CustomData');
            if (customData != null)
            {
                shapeAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        if (polygonAnnot._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = polygonAnnot.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            shapeAnnotation.AllowedInteractions = JSON.parse(text);
        }
        if (polygonAnnot._dictionary.has('Measure')) {
            let measureShapeAnnotation: MeasureShapeAnnotationBase = new MeasureShapeAnnotationBase(shapeAnnotation);
            if (polygonAnnot._dictionary.has('IT') && !isNullOrUndefined(polygonAnnot._dictionary.get('IT'))) {
                measureShapeAnnotation.Indent = polygonAnnot._dictionary.get('IT').name;
            } else {
                measureShapeAnnotation.Indent = 'PolygonDimension';
            }
            measureShapeAnnotation.Calibrate = this.getMeasureObject(polygonAnnot);
            if (isNullOrUndefined(measureShapeAnnotation.Calibrate)) {
                return shapeAnnotation;
            }
            if (measureShapeAnnotation.Indent === 'PolygonVolume' && polygonAnnot._dictionary.has('Depth') && (!isNullOrUndefined(polygonAnnot._dictionary.get('Depth')))) {
                measureShapeAnnotation.Calibrate.Depth = polygonAnnot._dictionary.get('Depth');
            }
            measureShapeAnnotation.Caption = false;
            measureShapeAnnotation.LeaderLength = 0;
            measureShapeAnnotation.LeaderLineExtension = 0;
            measureShapeAnnotation.LeaderLineOffset = 0;
            measureShapeAnnotation.CaptionPosition = '';
            if (polygonAnnot.flags === PdfAnnotationFlag.readOnly) {
                measureShapeAnnotation.IsCommentLock = true;
            } else {
                measureShapeAnnotation.IsCommentLock = false;
            }
            if (polygonAnnot.flags === PdfAnnotationFlag.print) {
                measureShapeAnnotation.IsPrint = true;
            }
            if (polygonAnnot._dictionary.has('CustomData') && !isNullOrUndefined(polygonAnnot._dictionary.get('CustomData'))) {
                const customData: any = polygonAnnot._dictionary.get('CustomData');
                if (isNullOrUndefined(customData)) {
                    measureShapeAnnotation.ExistingCustomData = JSON.stringify(customData);
                }
            }
            return measureShapeAnnotation;
        } else {
            return shapeAnnotation;
        }
    }

    /**
     * @param polyLineAnnot
     * @param height
     * @param width
     * @param pageRotation
     * @param shapeFreeText
     * @private
     */
    // eslint-disable-next-line max-len
    public loadPolylineAnnotation(polyLineAnnot: PdfPolyLineAnnotation, height: number, width: number, pageRotation: number, shapeFreeText: PdfFreeTextAnnotation): ShapeAnnotationBase {
        const shapeAnnotation: ShapeAnnotationBase = new ShapeAnnotationBase();
        shapeAnnotation.ShapeAnnotationType = 'Polyline';
        shapeAnnotation.Author = polyLineAnnot.author;
        shapeAnnotation.AnnotName = polyLineAnnot.name;
        shapeAnnotation.Subject = polyLineAnnot.subject;
        if (!isNullOrUndefined(polyLineAnnot.modifiedDate)){
            shapeAnnotation.ModifiedDate = this.formatDate(polyLineAnnot.modifiedDate);
        }
        else{
            shapeAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        shapeAnnotation.Note = this.getValidNoteContent(polyLineAnnot.text);
        shapeAnnotation.Thickness = polyLineAnnot.border.width;
        shapeAnnotation.BorderStyle = this.getBorderStylesString(polyLineAnnot.border.style);
        shapeAnnotation.BorderDashArray = polyLineAnnot.border.dash ? polyLineAnnot.border.dash[0] ? polyLineAnnot.border.dash[0] : 0 : 0;
        shapeAnnotation.Opacity = polyLineAnnot.opacity;
        shapeAnnotation.RotateAngle = this.getRotateAngleString(polyLineAnnot.rotate);
        shapeAnnotation.AnnotType = 'shape';
        if (!isNullOrUndefined(polyLineAnnot.reviewHistory)) {
            for (let i: number = 0; i < polyLineAnnot.reviewHistory.count; i++) {
            shapeAnnotation.State = this.getStateString(polyLineAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            shapeAnnotation.StateModel = this.getStateModelString(polyLineAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        } 
        if (isNullOrUndefined(shapeAnnotation.State) || isNullOrUndefined(shapeAnnotation.StateModel))
        {
            shapeAnnotation.State = 'Unmarked';
            shapeAnnotation.StateModel = 'None';
        }

        shapeAnnotation.Comments = new Array<PopupAnnotationBase>();
        if (!isNullOrUndefined(polyLineAnnot.comments)) {
            for (let i: number = 0; i < polyLineAnnot.comments.count; i++) {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(polyLineAnnot.comments.at(i), height, width, pageRotation);
            shapeAnnotation.Comments.push(annot);
        }
        }
        shapeAnnotation.Bounds = this.getBounds(polyLineAnnot.bounds, height, width, pageRotation);
        if(!isNullOrUndefined(polyLineAnnot._dictionary.get('Vertices'))){
            shapeAnnotation.VertexPoints = this.getVertexPoints(polyLineAnnot._dictionary.get('Vertices'), width, height, pageRotation, polyLineAnnot._page);
        }
        
        shapeAnnotation.StrokeColor = 'rgba(' + polyLineAnnot.color[0] + ',' + polyLineAnnot.color[1] + ',' + polyLineAnnot.color[2] + ',' + (polyLineAnnot.color[3] ? polyLineAnnot.color[3] : 1) + ')';
        let fillOpacity: number = polyLineAnnot.color[3] ? polyLineAnnot.color[3] : 1;
        if (polyLineAnnot._dictionary.has('FillOpacity') && !isNullOrUndefined(polyLineAnnot._dictionary.get('FillOpacity'))) {
            fillOpacity = parseInt(polyLineAnnot._dictionary.get('FillOpacity').toString(), 10);
        }
        fillOpacity = polyLineAnnot.innerColor ? fillOpacity : 0;
        polyLineAnnot.innerColor = polyLineAnnot.innerColor ? polyLineAnnot.innerColor : [255, 255, 255];
        shapeAnnotation.FillColor = 'rgba(' + polyLineAnnot.innerColor[0] + ',' + polyLineAnnot.innerColor[1] + ',' + polyLineAnnot.innerColor[2] + ',' + fillOpacity + ')';
        shapeAnnotation.LineHeadStart = this.getLineEndingStyleString(polyLineAnnot.beginLineStyle);
        shapeAnnotation.LineHeadEnd = this.getLineEndingStyleString(polyLineAnnot.endLineStyle);
        shapeAnnotation.EnableShapeLabel = false;
        if (shapeFreeText != null){
            shapeAnnotation.EnableShapeLabel = true;
            shapeAnnotation.LabelContent = shapeFreeText.text;
            shapeAnnotation.LabelFillColor = 'rgba(' + shapeFreeText.color[0] + ',' + shapeFreeText.color[1] + ',' + shapeFreeText.color[2] + ',' + (shapeFreeText.color[3] ? shapeFreeText.color[3] : 1) + ')';
            shapeAnnotation.FontColor = 'rgba(' + shapeFreeText.textMarkUpColor[0] + ',' + shapeFreeText.textMarkUpColor[1] + ',' + shapeFreeText.textMarkUpColor[2] + ',' + (shapeFreeText.textMarkUpColor[3] ? shapeFreeText.textMarkUpColor[3] : 1) + ')';
            shapeAnnotation.LabelBorderColor = 'rgba(' + shapeFreeText.borderColor[0] + ',' + shapeFreeText.borderColor[1] + ',' + shapeFreeText.borderColor[2] + ',' + (shapeFreeText.borderColor[3] ? shapeFreeText.borderColor[3] : 1) + ')';
            shapeAnnotation.FontSize = shapeFreeText.font.size;
        }
        if (!isNullOrUndefined(polyLineAnnot._borderEffect)){
            if (polyLineAnnot._borderEffect.style === PdfBorderEffectStyle.cloudy){
                shapeAnnotation.IsCloudShape = true;
                shapeAnnotation.CloudIntensity = polyLineAnnot._borderEffect.intensity;
            }
            else{
                shapeAnnotation.IsCloudShape = false;
                shapeAnnotation.CloudIntensity = 0;
            }
        }
        else{
            shapeAnnotation.IsCloudShape = false;
            shapeAnnotation.CloudIntensity = 0;
        }
        if (polyLineAnnot._dictionary.has('RD') && !isNullOrUndefined(polyLineAnnot._dictionary.get('RD'))){
            shapeAnnotation.RectangleDifference = polyLineAnnot._dictionary.get('RD');
        }
        else{
            shapeAnnotation.RectangleDifference = new Array<string>();
        }

        if (polyLineAnnot.flags === PdfAnnotationFlag.locked) {
            shapeAnnotation.IsLocked = true;
        }
        else {
            shapeAnnotation.IsLocked = false;
        }
        if (polyLineAnnot.flags === PdfAnnotationFlag.readOnly) {
            shapeAnnotation.IsCommentLock = true;
        }
        else {
            shapeAnnotation.IsCommentLock = false;
        }
        if (polyLineAnnot._annotFlags.toString().includes('Print')) {
            shapeAnnotation.IsPrint = true;
        }
        if (polyLineAnnot._dictionary.has('CustomData') && !isNullOrUndefined(polyLineAnnot._dictionary.get('CustomData')))
        {
            const customData: any = polyLineAnnot._dictionary.get('CustomData');
            if (customData != null)
            {
                shapeAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        if (polyLineAnnot._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = polyLineAnnot.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            shapeAnnotation.AllowedInteractions = JSON.parse(text);
        }
        if (polyLineAnnot._dictionary.has('Measure')) {
            shapeAnnotation.FillColor = 'rgba(' + polyLineAnnot.innerColor[0] + ',' + polyLineAnnot.innerColor[1] + ',' + polyLineAnnot.innerColor[2] + ',' + fillOpacity + ')';
            let measureShapeAnnotation: MeasureShapeAnnotationBase = new MeasureShapeAnnotationBase(shapeAnnotation);
            measureShapeAnnotation.Calibrate = this.getMeasureObject(polyLineAnnot as PdfAnnotation);
            if (polyLineAnnot._dictionary.has('IT')) {
                measureShapeAnnotation.Indent = polyLineAnnot._dictionary.get('IT').name;
            }
            else {
                measureShapeAnnotation.Indent = 'PolyLineDimension';
            }
            measureShapeAnnotation.Caption = false;
            measureShapeAnnotation.LeaderLength = 0;
            measureShapeAnnotation.LeaderLineExtension = 0;
            measureShapeAnnotation.LeaderLineOffset = 0;
            measureShapeAnnotation.CaptionPosition = '';
            if (polyLineAnnot.flags === PdfAnnotationFlag.readOnly) {
                measureShapeAnnotation.IsCommentLock = true;
            }
            else {
                measureShapeAnnotation.IsCommentLock = false;
            }
            if (polyLineAnnot.flags === PdfAnnotationFlag.print) {
                measureShapeAnnotation.IsPrint = true;
            }
            if (polyLineAnnot._dictionary.has('CustomData') && !isNullOrUndefined(polyLineAnnot._dictionary.get('CustomData'))) {
                const customData: any = polyLineAnnot._dictionary.get('CustomData');
                if (customData != null) {
                    measureShapeAnnotation.ExistingCustomData = JSON.stringify(customData);
                }
            }
            return measureShapeAnnotation;
        }
        else {
        return shapeAnnotation;
    }
    }

    /**
     * @private
     * @param annotation 
     * @param pageNumber 
     * @returns 
     */
    public loadSignatureImage(annotation: PdfRubberStampAnnotation, pageNumber: number): SignatureAnnotationBase {
        const stampAnnotation = annotation as PdfRubberStampAnnotation;
        const formsFields = new SignatureAnnotationBase();
        formsFields.SignatureName = stampAnnotation.name;
        let dictionary = annotation._dictionary.get('AP');
        if (dictionary === null) {
        const pdfReference = annotation._dictionary.get('AP');
          if (pdfReference !== null && pdfReference.Object !== null) {
            dictionary = pdfReference.Object;
          }
        }
        if (dictionary !== null && dictionary.has('N') ){
            this.m_renderer.findStampImage(annotation);
        }
        formsFields.Bounds = new Rect(stampAnnotation.bounds.x, stampAnnotation.bounds.y, stampAnnotation.bounds.width, stampAnnotation.bounds.height);
        formsFields.PathData = this.m_renderer.imageData;
        formsFields.AnnotationType = "SignatureImage";
        formsFields.PageNumber = pageNumber;
        formsFields.Opacity = stampAnnotation.opacity;
        formsFields.StrokeColor = 'rgba(' + stampAnnotation.color + ',' + stampAnnotation.color[1] + ',' + stampAnnotation.color[2] + ',' + (stampAnnotation.color[3] ? stampAnnotation.color[3] : 1) + ')';
        return formsFields;
      }

    private getMeasureObject(annotation: PdfAnnotation): Measure {
        let measureObject : Measure = new Measure();
        let measureDictionary : _PdfDictionary;

        if (annotation._dictionary.has('Measure')) {
            measureDictionary = annotation._dictionary.get('Measure')            
        }
        if (measureDictionary.has('R')) {
            measureObject.Ratio = measureDictionary.get('R');
        }
        else{
            return null;
        }

        let xList: NumberFormat[];
        if (measureDictionary.has('X')) {
            xList = this.getMeasureValues(measureDictionary.getArray('X'));
        }
        measureObject.X = xList;
        let distanceList: NumberFormat[];
        if (measureDictionary.has('D')) {
            distanceList = this.getMeasureValues(measureDictionary.getArray('D'));
        }
        measureObject.Distance = distanceList;
        let areaList: NumberFormat[];
        if (measureDictionary.has('A')) {
            areaList = this.getMeasureValues(measureDictionary.getArray('A'));
        }
        measureObject.Area = areaList;
        let angleList: NumberFormat[];
        if (measureDictionary.has('T')) {
            angleList = this.getMeasureValues(measureDictionary.getArray('T'));
        }
        measureObject.Angle = angleList;
        let volumeList: NumberFormat[];
        if (measureDictionary.has('V')) {
            volumeList = this.getMeasureValues(measureDictionary.getArray('V'));
        }
        measureObject.Volume = volumeList;

        if (!isNullOrUndefined(measureDictionary) && measureDictionary.has('TargetUnitConversion')) {
            measureObject.TargetUnitConversion = measureDictionary.get('TargetUnitConversion').FloatValue;
        }
        else {
            measureObject.TargetUnitConversion = 0;
        }

        return measureObject;
    }

    private getMeasureValues(arrayValues: any[]): NumberFormat[] {
        let measureValuesArray: NumberFormat[] = new Array<NumberFormat>();
        if (!isNullOrUndefined(arrayValues)) {
            for (let index = 0; index < arrayValues.length; index++) {
                let measureFormat = arrayValues[parseInt(index.toString(), 10)];
                let measureValue: NumberFormat = new NumberFormat();
                if (!isNullOrUndefined(measureFormat)) {
                    if (measureFormat.has('D') && !isNullOrUndefined(measureFormat.get('D'))) {
                        measureValue.Denominator = measureFormat.get('D');
                    }
                    if (measureFormat.has('C') && !isNullOrUndefined(measureFormat.get('C'))) {
                        measureValue.ConversionFactor = measureFormat.get('C');
                    }
                    if (measureFormat.has('F') && !isNullOrUndefined(measureFormat.get('F'))) {
                        measureValue.FractionalType = measureFormat.get('F');
                    }
                    if (measureFormat.has('FD') && !isNullOrUndefined(measureFormat.get('FD'))) {
                        measureValue.FormatDenominator = measureFormat.get('FD');
                    }
                    if (measureFormat.has('U') && !isNullOrUndefined(measureFormat.get('U'))) {
                        measureValue.Unit = measureFormat.get('U');
                    }
                }
                measureValuesArray.push(measureValue);
            }
        }
        return measureValuesArray;
    }

    private getVertexPoints(vertices: number[], pageWidth: number, pageHeight: number, pageRotation: number, page: PdfPage): AnnotPoint[] {
        const vertexPoints: AnnotPoint[] = [];
        const cropBox = this.getBothCropBoxValue(page);
        let cropBoxX: number = 0;
        let cropBoxY: number = 0;
        if (!(cropBox[0] == 0 && (page as PdfPage).cropBox[2] == page.size[2] && cropBox[1] == page.size[3])) {
            cropBoxX = cropBox[0];
            cropBoxY = cropBox[1];
        }
        if (pageRotation == 0) {
            for (let i: number = 0; i < vertices.length; i++) {
                const point: AnnotPoint = { X: this.convertPointToPixel(vertices[parseInt(i.toString(), 10)]) - this.convertPointToPixel(cropBoxX), Y: (pageHeight - this.convertPointToPixel(vertices[i + 1])) + this.convertPointToPixel(cropBoxY) };
                i = i + 1;
                vertexPoints.push(point);
            }
        } else if (pageRotation == 1){
            for (let i: number = 0; i < vertices.length; i ++) {
                const point: AnnotPoint = { X: this.convertPointToPixel(vertices[i + 1]), Y: this.convertPointToPixel(vertices[parseInt(i.toString(), 10)]) };
                i = i + 1;
                vertexPoints.push(point);
            }
        } else if (pageRotation == 2){
            for (let i: number = 0; i < vertices.length; i ++) {
                const point: AnnotPoint = { X: pageWidth - this.convertPointToPixel(vertices[parseInt(i.toString(), 10)]), Y: pageHeight - this.convertPointToPixel(vertices[i + 1]) };
                i = i + 1;
                vertexPoints.push(point);
            }
        } else if (pageRotation == 3){
            for (let i: number = 0; i < vertices.length; i ++) {
                const point: AnnotPoint = { X: pageWidth - this.convertPointToPixel(vertices[i + 1]), Y: pageHeight - this.convertPointToPixel(vertices[parseInt(i.toString(), 10)]) };
                i = i + 1;
                vertexPoints.push(point);
            }
        }
        return vertexPoints;
    }

    private getLineIndentString(lineIntent: PdfLineIntent): string {
        switch (lineIntent) {
        case PdfLineIntent.lineArrow:
            return 'LineArrow';
        case PdfLineIntent.lineDimension:
            return 'LineDimension';
        }
    }

    private getLineEndingStyleString(lineEndingStyle: PdfLineEndingStyle): string {
        switch (lineEndingStyle) {
        case PdfLineEndingStyle.none:
            return 'None';
        case PdfLineEndingStyle.butt:
            return 'Butt';
        case PdfLineEndingStyle.circle:
            return 'Circle';
        case PdfLineEndingStyle.closedArrow:
            return 'ClosedArrow';
        case PdfLineEndingStyle.diamond:
            return 'Diamond';
        case PdfLineEndingStyle.openArrow:
            return 'OpenArrow';
        case PdfLineEndingStyle.rClosedArrow:
            return 'RClosedArrow';
        case PdfLineEndingStyle.rOpenArrow:
            return 'ROpenArrow';
        case PdfLineEndingStyle.slash:
            return 'Slash';
        case PdfLineEndingStyle.square:
            return 'Square';
        }
    }

    private getBorderStylesString(borderStyle: PdfBorderStyle): string {
        switch (borderStyle) {
        case PdfBorderStyle.solid:
            return 'Solid';
        case PdfBorderStyle.dashed:
            return 'Dashed';
        case PdfBorderStyle.beveled:
            return 'Beveled';
        case PdfBorderStyle.inset:
            return 'Inset';
        case PdfBorderStyle.underline:
            return 'Underline';
        case PdfBorderStyle.dot:
            return 'Dot';
        default:
            return 'None';
        }
    }
    private getBorderStyle(borderStyle: string): PdfBorderStyle {
        let style: PdfBorderStyle = PdfBorderStyle.solid;
        switch (borderStyle) {
        case 'Solid':
            style = PdfBorderStyle.solid;
            break;
        case 'Dashed':
            style = PdfBorderStyle.dashed;
            break;
        case 'Beveled':
            style = PdfBorderStyle.beveled;
            break;
        case 'Inset':
            style = PdfBorderStyle.inset;
            break;
        case 'Underline':
            style = PdfBorderStyle.underline;
            break;
        case 'Dot':
            style = PdfBorderStyle.dot;
            break;
        }
        return style;
    }
    private getRotateAngleString(angle: PdfRotationAngle): string {
        switch (angle) {
        case PdfRotationAngle.angle0:
            return 'RotateAngle0';
        case PdfRotationAngle.angle90:
            return 'RotateAngle90';
        case PdfRotationAngle.angle180:
            return 'RotateAngle180';
        case PdfRotationAngle.angle270:
            return 'RotateAngle270';
        default:
            return 'RotateAngle0';
        }
    }

    private getValidNoteContent(note: string): string {
        if (isNullOrUndefined(note) || note === '' || note === ' ') {
            return '';
        }
        return note;
    }

    private getBounds(bounds: any, pageWidth: number, pageHeight: number, pageRotation: number): AnnotBounds {
        let bound: AnnotBounds;
        if (pageRotation === 0) {
            // eslint-disable-next-line max-len
            bound = new AnnotBounds(this.convertPointToPixel(bounds.x), this.convertPointToPixel(bounds.y), this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height));
        }
        else if (pageRotation === 1) {
            // eslint-disable-next-line max-len
            bound = new AnnotBounds(pageWidth - this.convertPointToPixel(bounds.y) - this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.x), this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.width));
        }
        else if (pageRotation === 2) {
            // eslint-disable-next-line max-len
            bound = new AnnotBounds(pageWidth - this.convertPointToPixel(bounds.x) - this.convertPointToPixel(bounds.width), pageHeight - this.convertPointToPixel(bounds.y) - this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height));
        }
        else if (pageRotation === 3) {
            // eslint-disable-next-line max-len
            bound = new AnnotBounds(this.convertPointToPixel(bounds.y), pageHeight - this.convertPointToPixel(bounds.x) - this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.width));
        }
        return bound;
    }


    /**
     * @private
     * @param popupAnnot 
     * @param height 
     * @param width 
     * @param pageRotation 
     * @returns 
     */
    public loadPopupAnnotation(popupAnnot: PdfPopupAnnotation, height: number, width: number, pageRotation: number): PopupAnnotationBase {
        const popupAnnotation: PopupAnnotationBase = new PopupAnnotationBase();
        popupAnnotation.Author = popupAnnot.author;
        popupAnnotation.Subject = popupAnnot.subject;
        if (popupAnnot._dictionary.has('Subtype') && !isNullOrUndefined(popupAnnot._dictionary.get('Subtype')) && !isNullOrUndefined(popupAnnot._dictionary.get('Subtype').name)) {
            popupAnnotation.SubType = popupAnnot._dictionary.get('Subtype').name.toString();
        }
        if (popupAnnot._dictionary.has('Type') && !isNullOrUndefined(popupAnnot._dictionary.get('Type')) && !isNullOrUndefined(popupAnnot._dictionary.get('Type').name)) {
            popupAnnotation.Type = popupAnnot._dictionary.get('Type').name.toString();
        }
        if (popupAnnot._dictionary.has('IRT') && !isNullOrUndefined(popupAnnot._dictionary.get('IRT'))) {
            const reference: any = popupAnnot._dictionary.get('IRT');
            if (reference != null) {
                popupAnnotation.Reference = reference.Reference;
            }
        }
        popupAnnotation.AnnotName = popupAnnot.name;
        if (!isNullOrUndefined(popupAnnot.modifiedDate)) {
            popupAnnotation.ModifiedDate = this.formatDate(popupAnnot.modifiedDate);
        }
        else {
            popupAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        popupAnnotation.Note = popupAnnot.text;
        if (popupAnnot.flags === PdfAnnotationFlag.locked) {
            popupAnnotation.IsLock = true;
        }
        else {
            popupAnnotation.IsLock = false;
        }
        if (popupAnnot.flags === PdfAnnotationFlag.readOnly) {
            popupAnnotation.IsCommentLock = true;
        }
        else {
            popupAnnotation.IsCommentLock = false;
        }
        popupAnnotation.Icon = this.getPopupIconString(popupAnnot.icon);
        popupAnnotation.State = this.getStateString(popupAnnot.state);
        popupAnnotation.StateModel = this.getStateModelString(popupAnnot.stateModel);
        popupAnnotation.Size = new SizeBase(popupAnnot.bounds.width, popupAnnot.bounds.height);
        popupAnnot.color = popupAnnot.color ? popupAnnot.color : [0, 0, 0];
        popupAnnotation.Color = new AnnotColor(popupAnnot.color[0], popupAnnot.color[1], popupAnnot.color[2]);
        popupAnnotation.Opacity = popupAnnot.opacity;
        popupAnnotation.AnnotType = 'sticky';
        popupAnnotation.StrokeColor = 'rgba(' + popupAnnotation.Color.R + ',' + popupAnnotation.Color.G + ',' + popupAnnotation.Color.B + ',' + 1 + ')';
        popupAnnotation.Bounds = this.getBounds(popupAnnot.bounds, height, width, pageRotation);
        for (let i: number = 0; i < popupAnnot.reviewHistory.count; i++) {
            popupAnnotation.State = this.getStateString(popupAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            popupAnnotation.StateModel = this.getStateModelString(popupAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(popupAnnotation.State) || popupAnnotation.State === 'None' || isNullOrUndefined(popupAnnotation.StateModel)) {
            popupAnnotation.State = 'Unmarked';
            popupAnnotation.StateModel = 'None';
        }
        popupAnnotation.Comments = new Array<PopupAnnotationBase>();
        if (popupAnnot._dictionary.has('CustomData') && !isNullOrUndefined(popupAnnot._dictionary.get('CustomData'))) {
            const customData: any = popupAnnot._dictionary.get('CustomData');
            if (customData != null) {
                popupAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        for (let i: number = 0; i < popupAnnot.comments.count; i++) {
            popupAnnotation.Comments.push(this.loadPopupAnnotation(popupAnnot.comments.at(i), height, width, pageRotation));
        }
        return popupAnnotation;
    }

    /**
     * @param freeTextAnnot
     * @param height
     * @param width
     * @param pageRotation
     * @param page
     * @private
     */
    public loadFreeTextAnnotation(freeTextAnnot: PdfFreeTextAnnotation, height: number, width: number, pageRotation: number, page: PdfPage): FreeTextAnnotationBase {
        let freeTextAnnotation: FreeTextAnnotationBase = new FreeTextAnnotationBase();
        freeTextAnnotation.AnnotationIntent = this.getAnnotationIntentString(freeTextAnnot.annotationIntent); // returns wrong value
        freeTextAnnotation.AnnotationFlags = this.getAnnotationFlagsString(freeTextAnnot.flags);
        freeTextAnnotation.Author = freeTextAnnot.author;
        freeTextAnnotation.AnnotName = freeTextAnnot.name;
        if(isNullOrUndefined(freeTextAnnotation.AnnotName) || freeTextAnnotation.AnnotName === ''){
            freeTextAnnotation.AnnotName = Math.abs(Math.random()).toString(36).substring(2);
        }
        freeTextAnnotation.AnnotType = 'Text Box';
        freeTextAnnotation.FreeTextAnnotationType = 'Text Box';
        freeTextAnnotation.BorderColor = new AnnotColor(freeTextAnnot.borderColor[0], freeTextAnnot.borderColor[1], freeTextAnnot.borderColor[2]);
        let points: AnnotPoint[] = [{X: 100, Y: 400}, {X: 200, Y: 400}];
        freeTextAnnotation.CalloutLines = points;
        freeTextAnnot.color = freeTextAnnot.color ? freeTextAnnot.color : freeTextAnnot.textMarkUpColor ? freeTextAnnot.textMarkUpColor: [0, 0, 0];
        freeTextAnnotation.Color = new AnnotColor(freeTextAnnot.color[0], freeTextAnnot.color[1], freeTextAnnot.color[2]);
        freeTextAnnotation.Flatten = freeTextAnnot.flatten;
        freeTextAnnotation.FlattenPopups = !isNullOrUndefined(freeTextAnnot.flattenPopups) ? freeTextAnnot.flattenPopups : false; // returns undefined
        freeTextAnnotation.FontFamily = this.getFontFamilyString((freeTextAnnot.font as PdfStandardFont)._fontFamily);
        freeTextAnnotation.FontSize = this.convertPointToPixel(freeTextAnnot.font.size);
        freeTextAnnotation.Font = new FontBase(freeTextAnnot.font, freeTextAnnotation.FontFamily); // need to be checked
        freeTextAnnotation.Thickness = freeTextAnnot.border.width;
        freeTextAnnotation.StrokeColor = 'rgba(' + freeTextAnnot.borderColor[0] + ',' + freeTextAnnot.borderColor[1] + ',' + freeTextAnnot.borderColor[2] + ',' + (freeTextAnnot.borderColor[3] ? freeTextAnnot.borderColor[3] : 1) + ')';
        let fillOpacity: number = freeTextAnnot.color[3] ? freeTextAnnot.color[3] : 1;
        if (freeTextAnnot._dictionary.has('FillOpacity') && !isNullOrUndefined(freeTextAnnot._dictionary.get('FillOpacity'))) {
            fillOpacity = parseInt(freeTextAnnot._dictionary.get('FillOpacity').toString(), 10);
        }
        fillOpacity = freeTextAnnot.color ? fillOpacity : 0;
        freeTextAnnot.color = freeTextAnnot.color ? freeTextAnnot.color : [255, 255, 255];
        freeTextAnnotation.FillColor = 'rgba(' + freeTextAnnot.color[0] + ',' + freeTextAnnot.color[1] + ',' + freeTextAnnot.color[2] + ',' + fillOpacity + ')';
        freeTextAnnotation.Layer = freeTextAnnot._dictionary.has('Layer') ? freeTextAnnot._dictionary.get('Layer') : null;
        // freeTextAnnotation.Location = freeTextAnnot._dictionary.has('Location') ? freeTextAnnot._dictionary.get('Location') : JSON.stringify({X: freeTextAnnot.bounds.x ,Y: freeTextAnnot.bounds.y});
        freeTextAnnotation.Location = freeTextAnnot._dictionary.has('Location') ? freeTextAnnot._dictionary.get('Location') : '{X='+ freeTextAnnot.bounds.x + ',Y='+ freeTextAnnot.bounds.y + '}';
        freeTextAnnotation.MarkupText = freeTextAnnot.text;
        if (!isNullOrUndefined(freeTextAnnot.modifiedDate)) {
            freeTextAnnotation.ModifiedDate = this.formatDate(freeTextAnnot.modifiedDate);
        }
        else {
            freeTextAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        freeTextAnnotation.Name = "freeText";
        freeTextAnnotation.Opacity = freeTextAnnot.opacity;
        if(freeTextAnnot._dictionary.has('Rotation') && !isNullOrUndefined(freeTextAnnot._dictionary.get('Rotation'))){
            freeTextAnnotation.Rotate = parseInt(freeTextAnnot._dictionary.get('Rotation'));
        }
        if(freeTextAnnot._dictionary.has('Rotate') && !isNullOrUndefined(freeTextAnnot._dictionary.get('Rotate'))){
            freeTextAnnotation.Rotate = parseInt(freeTextAnnot._dictionary.get('Rotate'));
        }
        if(!isNullOrUndefined(freeTextAnnot.subject)){
            freeTextAnnotation.Subject = freeTextAnnot.subject;
        }
        else{
            freeTextAnnotation.Subject = 'Text Box';
        }
        freeTextAnnotation.Text = freeTextAnnot.text;
        freeTextAnnotation.MarkupText = freeTextAnnot.text;
        freeTextAnnotation.TextAlign = this.getTextAlignmentString(freeTextAnnot.textAlignment);
        if (isNullOrUndefined(freeTextAnnotation.State) || freeTextAnnotation.State === 'None' || isNullOrUndefined(freeTextAnnotation.StateModel)) {
            freeTextAnnotation.State = 'Unmarked';
            freeTextAnnotation.StateModel = 'None';
        }
        freeTextAnnotation.FontColor = 'rgba(' + freeTextAnnot.textMarkUpColor[0] + ',' + freeTextAnnot.textMarkUpColor[1] + ',' + freeTextAnnot.textMarkUpColor[2] + ',' + (freeTextAnnot.textMarkUpColor[3] ? freeTextAnnot.textMarkUpColor[3] : 1) + ')';
        for (let i: number = 0; i < freeTextAnnot.reviewHistory.count; i++) {
            freeTextAnnotation.State = this.getStateString(freeTextAnnot.reviewHistory.at(parseInt(i.toString(), 10)).state);
            freeTextAnnotation.StateModel = this.getStateModelString(freeTextAnnot.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        freeTextAnnotation.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < freeTextAnnot.comments.count; i++) {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(freeTextAnnot.comments.at(i), height, width, pageRotation);
            freeTextAnnotation.Comments.push(annot);
        }
        freeTextAnnotation.Bounds = this.getBounds(freeTextAnnot.bounds, height, width, pageRotation);
        if(freeTextAnnotation.Bounds.Y < 0){
            let cropRect = {x: freeTextAnnot.bounds.x, y: page.cropBox[1] + freeTextAnnot.bounds.y, width: freeTextAnnot.bounds.width, height: freeTextAnnot.bounds.height};
            freeTextAnnotation.Bounds = this.getBounds(cropRect, height, width, pageRotation);
        }
        freeTextAnnotation.PageRotation = pageRotation;
        if (freeTextAnnot.flags === PdfAnnotationFlag.readOnly) {
            freeTextAnnotation.IsCommentLock = true;
            freeTextAnnotation.IsReadonly = true;
        }
        else {
            freeTextAnnotation.IsCommentLock = false;
        }
        if(freeTextAnnot.flags === PdfAnnotationFlag.print){
            freeTextAnnotation.IsPrint = true;
        }
        if(freeTextAnnot.flags === PdfAnnotationFlag.locked){
            freeTextAnnotation.IsLocked = true;
        }
        else{
            freeTextAnnotation.IsLocked = false;
        }
        if (freeTextAnnot._dictionary.has('CustomData') && !isNullOrUndefined(freeTextAnnot._dictionary.get('CustomData'))) {
            const customData: any = freeTextAnnot._dictionary.get('CustomData');
            if (customData != null) {
                freeTextAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        if (freeTextAnnot._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = freeTextAnnot.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            freeTextAnnotation.AllowedInteractions = JSON.parse(text);
        }
        return freeTextAnnotation;
    }

    private getTextAlignmentString(textAlignment: PdfTextAlignment): string {
        switch (textAlignment) {
            case PdfTextAlignment.left:
                return 'Left';
            case PdfTextAlignment.right:
                return 'Right';
            case PdfTextAlignment.center:
                return 'Center';
            case PdfTextAlignment.justify:
                return 'Justify';
            default:
                return 'Left';
        }
    }

    /**
     * 
     * @private
     */
    public loadSignatureText(inkAnnot: PdfFreeTextAnnotation, pageNumber: number, height: number, width: number, pageRotation: number): SignatureAnnotationBase {
        let formFields: SignatureAnnotationBase = new SignatureAnnotationBase();
        formFields.SignatureName = inkAnnot.name;
        formFields.Bounds = this.getBounds(inkAnnot.bounds, width, height, pageRotation);
        formFields.AnnotationType = "SignatureText";
        formFields.FontFamily = this.getFontFamilyString((inkAnnot.font as PdfStandardFont)._fontFamily);
        formFields.FontSize = this.convertPointToPixel(inkAnnot.font.size);
        formFields.PathData = inkAnnot.text;
        formFields.PageNumber = pageNumber;
        formFields.StrokeColor = 'rgba(' + inkAnnot.textMarkUpColor[0] + ',' + inkAnnot.textMarkUpColor[1] + ',' + inkAnnot.textMarkUpColor[2] + ',' + (inkAnnot.textMarkUpColor[3] ? inkAnnot.textMarkUpColor[3] : 1) + ')';
        formFields.Opacity = inkAnnot.opacity;
        formFields.Thickness = 1;
        return formFields;
    }

    private getFontFamilyString(fontFamily: PdfFontFamily): string {
        switch (fontFamily) {
            case PdfFontFamily.helvetica:
                return 'Helvetica';
            case PdfFontFamily.timesRoman:
                return 'TimesRoman';
            case PdfFontFamily.courier:
                return 'Courier';
            case PdfFontFamily.symbol:
                return 'Symbol';
            case PdfFontFamily.zapfDingbats:
                return 'ZapfDingbats';
            default:
                return 'Helvetica';
        }
    }

    private getAnnotationFlagsString(flags: PdfAnnotationFlag): string {
        switch (flags) {
            case PdfAnnotationFlag.default:
                return 'Default';
            case PdfAnnotationFlag.invisible:
                return 'Invisible';
            case PdfAnnotationFlag.hidden:
                return 'Hidden';
            case PdfAnnotationFlag.print:
                return 'Print';
            case PdfAnnotationFlag.noZoom:
                return 'NoZoom';
            case PdfAnnotationFlag.noRotate:
                return 'NoRotate';
            case PdfAnnotationFlag.noView:
                return 'NoView';
            case PdfAnnotationFlag.readOnly:
                return 'ReadOnly';
            case PdfAnnotationFlag.locked:
                return 'Locked';
            case PdfAnnotationFlag.toggleNoView:
                return 'ToggleNoView';
            default:
                return 'Default';
        }
    }

    private getAnnotationIntentString(annotationIntent: PdfAnnotationIntent): string {
        switch (annotationIntent) {
        case PdfAnnotationIntent.freeTextCallout:
            return 'FreeTextCallout';
        case PdfAnnotationIntent.freeTextTypeWriter:
            return 'FreeTextTypeWriter';
        case PdfAnnotationIntent.none:
            return 'None';
        }
    }

    private getStateString(state: PdfAnnotationState): string {
        switch (state) {
        case PdfAnnotationState.accepted:
            return 'Accepted';
        case PdfAnnotationState.rejected:
            return 'Rejected';
        case PdfAnnotationState.cancel:
            return 'Cancelled';
        case PdfAnnotationState.completed:
            return 'Completed';
        case PdfAnnotationState.none:
            return 'None';
        case PdfAnnotationState.unmarked:
            return 'Unmarked';
        case PdfAnnotationState.marked:
            return 'Marked';
        case PdfAnnotationState.unknown:
            return 'Unknown';
        default:
            return null;
        }
    }

    private getStateModelString(stateModel: PdfAnnotationStateModel): string {
        switch (stateModel) {
        case PdfAnnotationStateModel.review:
            return 'Review';
        case PdfAnnotationStateModel.marked:
            return 'Marked';
        case PdfAnnotationStateModel.none:
            return 'None';
        default:
            return 'None';
        }
    }

    private getPopupIconString(icon: PdfPopupIcon): string {
        switch (icon) {
        case PdfPopupIcon.comment:
            return 'Comment';
        case PdfPopupIcon.help:
            return 'Help';
        case PdfPopupIcon.insert:
            return 'Insert';
        case PdfPopupIcon.key:
            return 'Key';
        case PdfPopupIcon.newParagraph:
            return 'NewParagraph';
        case PdfPopupIcon.note:
            return 'Note';
        case PdfPopupIcon.paragraph:
            return 'Paragraph';
        default:
            return null;
        }
    }

    private formatDate(date: Date): string {

        const month: string = this.datePadding(date.getMonth() + 1); // Months are zero-based
        const day: string = this.datePadding(date.getDate());
        const year: number = date.getFullYear();
        const hours: string = this.datePadding(date.getHours());
        const minutes: string = this.datePadding(date.getMinutes());
        const seconds: string = this.datePadding(date.getSeconds());

        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Pad the numbers with leading zeros if they are single digits
    private datePadding(number: number): string {
        return number < 10 ? ('0' + number) : number.toString();
    }

    /**
     * @param loadedDocument
     * @private
     */
    public removeSignatureTypeAnnot(jsonObject: { [key: string]: string }, loadedDocument: PdfDocument): void {
        if (
            (jsonObject.hasOwnProperty('isAnnotationsExist') &&
                JSON.parse(jsonObject['isAnnotationsExist'])) ||
            (jsonObject.hasOwnProperty('isFormFieldAnnotationsExist') &&
                JSON.parse(jsonObject['isFormFieldAnnotationsExist']))
        ) {
            const annotationPageList: any = jsonObject.annotationsPageList ? jsonObject.annotationsPageList : [];
            // var formFieldsPageList : any = jsonObject.formFieldsPageList ? (jsonObject.formFieldsPageList) : [] ;
            if (annotationPageList.length != 0) {
                const removeAnnotList: any = JSON.parse(annotationPageList);
                for (let i = 0; i < removeAnnotList.length; i++) {
                    const loadedPageNo: string = removeAnnotList[parseInt(i.toString(), 10)];
                    // Removing annotations from the page.
                    const page: PdfPage = loadedDocument.getPage(parseInt(loadedPageNo, 10));
                    const oldPageAnnotations: PdfAnnotationCollection = page.annotations;
                    const totalAnnotation: number = parseInt(oldPageAnnotations.count.toString(), 10);
                    for (let m: number = totalAnnotation - 1; m >= 0; m--) {
                        const annotation: PdfAnnotation = oldPageAnnotations.at(m);

                        if (
                            annotation instanceof PdfFreeTextAnnotation ||
                            annotation instanceof PdfInkAnnotation ||
                            annotation instanceof PdfLineAnnotation ||
                            annotation instanceof PdfRubberStampAnnotation ||
                            annotation instanceof PdfTextMarkupAnnotation ||
                            annotation instanceof PdfPopupAnnotation ||
                            annotation instanceof PdfSquareAnnotation ||
                            annotation instanceof PdfCircleAnnotation ||
                            annotation instanceof PdfEllipseAnnotation ||
                            annotation instanceof PdfPolygonAnnotation ||
                            annotation instanceof PdfRectangleAnnotation ||
                            annotation instanceof PdfPolyLineAnnotation
                        ) {
                            oldPageAnnotations.remove(annotation);
                        }
                    }
                }

            }
        }
    }

    /**
     * @param textMarkup
     * @param height
     * @param width
     * @param pageRotation
     * @private
     */
    // eslint-disable-next-line max-len
    public loadTextMarkupAnnotation(textMarkup: PdfTextMarkupAnnotation, height: number, width: number, pageRotation: number, page: PdfPage): TextMarkupAnnotationBase {
        const markupAnnotation: TextMarkupAnnotationBase = new TextMarkupAnnotationBase();
        markupAnnotation.TextMarkupAnnotationType = this.getMarkupAnnotTypeString(textMarkup.textMarkupType);
        if (markupAnnotation.TextMarkupAnnotationType === 'StrikeOut') {
            markupAnnotation.TextMarkupAnnotationType = 'Strikethrough';
        }
        markupAnnotation.Author = textMarkup.author;
        markupAnnotation.Subject = textMarkup.subject;
        markupAnnotation.AnnotName = textMarkup.name;
        markupAnnotation.Note = textMarkup.text ? textMarkup.text : '';
        // eslint-disable-next-line max-len
        markupAnnotation.Rect = new Rectangle(textMarkup.bounds.x, textMarkup.bounds.y, textMarkup.bounds.width + textMarkup.bounds.x, textMarkup.bounds.height + textMarkup.bounds.y);
        markupAnnotation.Opacity = textMarkup.opacity;
        // markupAnnotation.Color = 'rgba(' + textMarkup.color[0] + ',' + textMarkup.color[1] + ',' + textMarkup.color[2] + ',' + (textMarkup.color[3] ? textMarkup.color[3] : 1) + ')';
        markupAnnotation.Color = '#' + (1 << 24 | textMarkup.color[0] << 16 | textMarkup.color[1] << 8 | textMarkup.color[2]).toString(16).slice(1);
        if (!isNullOrUndefined(textMarkup.modifiedDate)){
            markupAnnotation.ModifiedDate = this.formatDate(textMarkup.modifiedDate);
        }
        else{
            markupAnnotation.ModifiedDate = this.formatDate(new Date());
        }
        markupAnnotation.AnnotationRotation = textMarkup.rotationAngle;
        const quadPoints: string[] = textMarkup._dictionary.has('QuadPoints') ? textMarkup._dictionary.get('QuadPoints') : [];
        const bounds: AnnotBounds[] = this.getTextMarkupBounds(quadPoints, height, width, pageRotation, page);
        markupAnnotation.Bounds = bounds;
        markupAnnotation.AnnotType = 'textMarkup';
        for (let i: number = 0; i < textMarkup.reviewHistory.count; i++)
        {
            markupAnnotation.State = this.getStateString(textMarkup.reviewHistory.at(parseInt(i.toString(), 10)).state);
            markupAnnotation.StateModel = this.getStateModelString(textMarkup.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
        }
        if (isNullOrUndefined(markupAnnotation.State) || isNullOrUndefined(markupAnnotation.StateModel))
        {
            markupAnnotation.State = 'Unmarked';
            markupAnnotation.StateModel = 'None';
        }

        markupAnnotation.Comments = new Array<PopupAnnotationBase>();
        for (let i: number = 0; i < textMarkup.comments.count; i++)
        {
            const annot: PopupAnnotationBase = this.loadPopupAnnotation(textMarkup.comments.at(i), height, width, pageRotation);
            markupAnnotation.Comments.push(annot);
        }
        if (textMarkup.flags === PdfAnnotationFlag.readOnly) {
            markupAnnotation.IsCommentLock = true;
        }
        else {
            markupAnnotation.IsCommentLock = false;
        }
        if (textMarkup.flags === PdfAnnotationFlag.print) {
            markupAnnotation.IsPrint = true;
        }
        if (textMarkup._dictionary.has('CustomData') && !isNullOrUndefined(textMarkup._dictionary.get('CustomData')))
        {
            const customData: any = textMarkup._dictionary.get('CustomData');
            if (customData != null)
            {
                markupAnnotation.ExistingCustomData = JSON.stringify(customData);
            }
        }
        if (textMarkup._dictionary.has('AllowedInteractions')) {
            const allowedInteractions: any = textMarkup.getValues('AllowedInteractions');
            const text: any = allowedInteractions[0];
            markupAnnotation.AllowedInteractions = JSON.parse(text);
        }
        if (textMarkup._dictionary.has('TextMarkupContent')) {
            const textMarkupData: any = textMarkup.getValues('TextMarkupContent');
            if (!isNullOrUndefined(textMarkupData)) {
                markupAnnotation.TextMarkupContent = textMarkupData[0];
            }
        }
        return markupAnnotation;
    }

    // eslint-disable-next-line max-len
    private getTextMarkupBounds(quadPoints: string[], pageHeight: number, pageWidth: number, pageRotation: number, page: PdfPage): AnnotBounds[] {
        let x: number = 0;
        let y: number = 0;
        let width: number = 0;
        let height: number = 0;
        const annotationBoundList: AnnotBounds[] = [];
        const cropValues : PointBase = this.getCropBoxValue(page, false);
        let cropX : number = 0;
        let cropY : number = 0;
        if (cropValues.x !== 0 && cropValues.y !== 0 ) {
            cropX = cropValues.x;
            cropY = cropValues.y;
        }
        if (!isNullOrUndefined(quadPoints)){
            for (let k: number = 0; k < quadPoints.length; k++){
                if (pageRotation === 0){
                    x = this.convertPointToPixel(parseInt(quadPoints[parseInt(k.toString(), 10)], 10) - cropX);
                    y = pageHeight - this.convertPointToPixel(parseInt(quadPoints[k + 1], 10) + cropY);
                    height = this.convertPointToPixel(parseInt(quadPoints[k + 3], 10) - parseInt(quadPoints[k + 7], 10));
                    width = this.convertPointToPixel(parseInt(quadPoints[k + 6], 10) - parseInt(quadPoints[k + 4], 10));
                }
                else if (pageRotation === 1){
                    x = this.convertPointToPixel(parseInt(quadPoints[k + 5], 10));
                    y = this.convertPointToPixel(parseInt(quadPoints[parseInt(k.toString(), 10)], 10));
                    height = this.convertPointToPixel(parseInt(quadPoints[k + 6], 10) - parseInt(quadPoints[k + 4], 10));
                    width = this.convertPointToPixel(parseInt(quadPoints[k + 3], 10) - parseInt(quadPoints[k + 7], 10));
                }
                else if (pageRotation === 2){
                    x = pageWidth - this.convertPointToPixel(parseInt(quadPoints[k + 2], 10));
                    y = this.convertPointToPixel(parseInt(quadPoints[k + 5], 10));
                    height = this.convertPointToPixel(parseInt(quadPoints[k + 3], 10) - parseInt(quadPoints[k + 7], 10));
                    width = this.convertPointToPixel(parseInt(quadPoints[k + 6], 10) - parseInt(quadPoints[k + 4], 10));
                }
                else{
                    x = pageWidth - this.convertPointToPixel(parseInt(quadPoints[k + 1], 10));
                    y = pageHeight - this.convertPointToPixel(parseInt(quadPoints[k + 6], 10));
                    height = this.convertPointToPixel(parseInt(quadPoints[k + 6], 10) - parseInt(quadPoints[k + 4], 10));
                    width = this.convertPointToPixel(parseInt(quadPoints[k + 3], 10) - parseInt(quadPoints[k + 7], 10));
                }
                const bounds: AnnotBounds = new AnnotBounds(x, y, width, height);
                k = k + 7;
                annotationBoundList.push(bounds);
            }
        }
        return annotationBoundList;
    }

    private getMarkupAnnotTypeString(textMarkupType: PdfTextMarkupAnnotationType): string{
        let type: string = '';
        switch (textMarkupType) {
        case PdfTextMarkupAnnotationType.highlight:
            type = 'Highlight';
            break;
        case PdfTextMarkupAnnotationType.strikeOut:
            type = 'StrikeOut';
            break;
        case PdfTextMarkupAnnotationType.underline:
            type = 'Underline';
            break;
        case PdfTextMarkupAnnotationType.squiggly:
            type = 'Squiggly';
            break;
        }
        return type;
    }

}

/**
 *
 * @hidden
 */
export class PointBase {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 *
 * @hidden
 */
export class FreeTextAnnotationBase {
    public Author: string;
    public AnnotationSelectorSettings: any = null;
    public MarkupText: string;
    public TextMarkupColor: string = null;
    public Color: AnnotColor = null;
    public Font: FontBase = null;
    public BorderColor: AnnotColor;
    public Border: PdfAnnotationBorder = null;
    public LineEndingStyle: string = null;
    public AnnotationFlags: string = null;
    public IsCommentLock: boolean;
    public IsLocked: boolean;
    public Text: string;
    public Opacity: number;
    public CalloutLines: AnnotPoint[] = null;
    public ModifiedDate: string = null;
    public AnnotName: string;
    public AnnotType: string;
    public Name: string;
    public Comments: PopupAnnotationBase[] = null;
    public AnnotationIntent: string;
    public CreatedDate: string = null;
    public Flatten: boolean;
    public FlattenPopups: boolean;
    public InnerColor: string = null;
    public Layer: PdfLayer = null;
    public Location: string;
    public Page: PdfPage = null;
    public PageTags: string = null;
    public ReviewHistory: string  = null;
    public Rotate: number = 0;
    public Size: SizeBase;
    public Subject: string;
    public State: string;
    public StateModel: string;
    public StrokeColor: string;
    public FillColor: string;
    public Thickness: number;
    public FontColor: string;
    public FontSize: number;
    public FontFamily: string;
    public FreeTextAnnotationType: string;
    public TextAlign: string;
    public Note: string = null;
    public CustomData: { [key: string]: any } = null;
    public AnnotationSettings: any = null;
    public AllowedInteractions: string[];
    public IsPrint: boolean = true;
    public IsReadonly: boolean = false;
    public ExistingCustomData: string = null;
    public Bounds: AnnotBounds =  null;
    public PageRotation: number = 0;
}
/**
 *
 * @hidden
 */
export class InkSignatureAnnotation {
    public Bounds: any;
    public AnnotationType: string;
    public CustomData: { [key: string]: any };
    public Opacity: number;
    public StrokeColor: string;
    public Thickness: number;
    public PathData: string;
    public IsLocked: boolean;
    public IsCommentLock: boolean;
    public PageNumber: number;
    public AnnotName: string;
    public Author: string;
    public ModifiedDate: string;
    public Subject: string;
    public Note: string;
    public State: string;
    public StateModel: string;
    public AnnotationSelectorSettings: any;
    public AnnotationSettings: any;
    public AllowedInteractions: string[];
  
    public Comments: PopupAnnotationBase[];
    public AnnotType: string;
    public IsPrint: boolean;
    public ExistingCustomData: string;
  
    constructor() {
        this.AnnotationType = null;
        this.Bounds = null;
        this.CustomData = null;
        this.Opacity = 0;
        this.StrokeColor = null;
        this.Thickness = null;
        this.PathData = null;
        this.IsLocked = null;
        this.IsCommentLock = null;
        this.PageNumber = null;
        this.AnnotName = null;
        this.Author = null;
        this.ModifiedDate = null;
        this.Subject = null;
        this.Note = null;
        this.State = null;
        this.StateModel = null;
        this.AnnotationSelectorSettings = null;
        this.AnnotationSettings = null;
        this.AllowedInteractions = null;
        this.Comments = null;
        this.AnnotType = null;
        this.IsPrint = null;
        this.ExistingCustomData = null;
    }
  }

/**
 *
 * @hidden
 */
export class ShapeAnnotationBase {
    public ShapeAnnotationType: string;
    public Author: string;
    public AnnotationSelectorSettings: any;
    public ModifiedDate: string;
    public Subject: string;
    public Note: string;
    public IsCommentLock: boolean;
    public StrokeColor: string;
    public FillColor: string;
    public Opacity: number;
    public Bounds: any; // Use 'any' for compatibility with System.Drawing.RectangleF or Syncfusion.Drawing.RectangleF
    public Thickness: number;
    public BorderStyle: string;
    public BorderDashArray: number;
    public RotateAngle: string;
    public IsCloudShape: boolean;
    public CloudIntensity: number;
    public RectangleDifference: string[];
    public VertexPoints: AnnotPoint[]; // for line, polyline, and polygon annotations
    public LineHeadStart: string; // only for line and polyline annotations
    public LineHeadEnd: string; // only for line and polyline annotations
    public IsLocked: boolean;
    public AnnotName: string;
    public Comments: PopupAnnotationBase[];
    public State: string;
    public StateModel: string;
    public AnnotType: string;
    public EnableShapeLabel: boolean;
    public LabelContent: string;
    public LabelFillColor: string;
    public LabelBorderColor: string;
    public FontColor: string;
    public FontSize: number;
    public CustomData: { [key: string]: any };
    public LabelBounds: AnnotBounds;
    public LabelSettings: any;
    public AnnotationSettings: any;
    public AllowedInteractions: string[];
    public IsPrint: boolean;
    public ExistingCustomData: string;
    public AnnotationRotation: number;

    constructor() {
        this.LabelBounds = new AnnotBounds(0, 0, 0, 0);
        this.LabelContent = null;
        this.LabelFillColor = null;
        this.LabelBorderColor = null;
        this.LabelSettings = null;
        this.FontColor = null;
        this.FontSize = 0;
        this.AnnotationSettings = null;
        this.AnnotationSelectorSettings = null;
        this.VertexPoints = null;
        this.CustomData = null;
        this.ExistingCustomData = null;
        this.IsPrint = true;
        this.AllowedInteractions = null;
        this.AnnotationRotation = 0;
    }
}

/**
 *
 * @hidden
 */
export class MeasureShapeAnnotationBase{
    /**
     * MeasureShapeAnnotation
     */
    public ShapeAnnotationType: string;
    public Author: string;
    public AnnotationSelectorSettings: any;
    public ModifiedDate: string;
    public Subject: string;
    public Note: string;
    public IsCommentLock: boolean;
    public StrokeColor: string;
    public FillColor: string;
    public Opacity: number;
    public Bounds: any; // Use 'any' for compatibility with System.Drawing.RectangleF or Syncfusion.Drawing.RectangleF
    public Thickness: number;
    public BorderStyle: string;
    public BorderDashArray: number;
    public RotateAngle: string;
    public IsCloudShape: boolean;
    public CloudIntensity: number;
    public RectangleDifference: string[];
    public VertexPoints: AnnotPoint[]; // for line, polyline, and polygon annotations
    public LineHeadStart: string; // only for line and polyline annotations
    public LineHeadEnd: string; // only for line and polyline annotations
    public IsLocked: boolean;
    public AnnotName: string;
    public Comments: PopupAnnotationBase[];
    public State: string;
    public StateModel: string;
    public AnnotType: string;
    public EnableShapeLabel: boolean;
    public LabelContent: string;
    public LabelFillColor: string;
    public LabelBorderColor: string;
    public FontColor: string;
    public FontSize: number;
    public CustomData: { [key: string]: any };
    public LabelBounds: AnnotBounds;
    public LabelSettings: any;
    public AnnotationSettings: any;
    public AllowedInteractions: string[];
    public IsPrint: boolean;
    public ExistingCustomData: string;
    public AnnotationRotation: number;
    constructor(shapeAnnotation: ShapeAnnotationBase) {
            this.LabelBounds = new AnnotBounds(0, 0, 0, 0);
            this.LabelContent = null;
            this.LabelFillColor = null;
            this.LabelBorderColor = null;
            this.LabelSettings = null;
            this.FontColor = null;
            this.FontSize = 0;
            this.AnnotationSettings = null;
            this.AnnotationSelectorSettings = null;
            this.VertexPoints = null;
            this.CustomData = null;
            this.ExistingCustomData = null;
            this.IsPrint = true;
            this.AllowedInteractions = null;
            this.AnnotationRotation = 0;
        this.Author = shapeAnnotation.Author;
        this.AnnotationSelectorSettings = shapeAnnotation.AnnotationSelectorSettings;
        this.BorderDashArray = shapeAnnotation.BorderDashArray;
        this.BorderStyle = shapeAnnotation.BorderStyle;
        this.Bounds = shapeAnnotation.Bounds;
        this.CloudIntensity = shapeAnnotation.CloudIntensity;
        this.FillColor = shapeAnnotation.FillColor;
        this.IsCloudShape = shapeAnnotation.IsCloudShape;
        this.IsLocked = shapeAnnotation.IsLocked;
        this.LineHeadEnd = shapeAnnotation.LineHeadEnd;
        this.LineHeadStart = shapeAnnotation.LineHeadStart;
        this.ModifiedDate = shapeAnnotation.ModifiedDate;
        this.Note = shapeAnnotation.Note;
        this.Opacity = shapeAnnotation.Opacity;
        this.RectangleDifference = shapeAnnotation.RectangleDifference;
        this.RotateAngle = shapeAnnotation.RotateAngle;
        this.ShapeAnnotationType = shapeAnnotation.ShapeAnnotationType;
        this.StrokeColor = shapeAnnotation.StrokeColor;
        this.Subject = shapeAnnotation.Subject;
        this.Thickness = shapeAnnotation.Thickness;
        this.VertexPoints = shapeAnnotation.VertexPoints;
        this.AnnotName = shapeAnnotation.AnnotName;
        this.Comments = shapeAnnotation.Comments;
        this.State = shapeAnnotation.State;
        this.StateModel = shapeAnnotation.StateModel;
        this.AnnotType = 'shape_measure';
        this.AnnotationSettings = shapeAnnotation.AnnotationSettings;
        this.EnableShapeLabel = shapeAnnotation.EnableShapeLabel;
        this.AllowedInteractions = shapeAnnotation.AllowedInteractions;
        this.AnnotationRotation = shapeAnnotation.AnnotationRotation;
        if (shapeAnnotation.EnableShapeLabel == true) {
            this.LabelContent = shapeAnnotation.LabelContent;
            this.LabelFillColor = shapeAnnotation.LabelFillColor;
            this.FontColor = shapeAnnotation.FontColor;
            this.LabelBorderColor = shapeAnnotation.LabelBorderColor;
            this.FontSize = shapeAnnotation.FontSize;
            this.LabelSettings = shapeAnnotation.LabelSettings;
            this.LabelBounds = shapeAnnotation.LabelBounds;
        }
    }
    public Indent: string;
    public Caption: boolean;
    public CaptionPosition: string;
    public LeaderLineExtension: number;
    public LeaderLength: number;
    public LeaderLineOffset: number;
    public Calibrate: Measure;
}

/**
 *
 * @hidden
 */
export class SignatureAnnotationBase{
    public AnnotationType: string;
    public Bounds: any;
    public Opacity: number;
    public StrokeColor: string;
    public Thickness: number;
    public PathData: string = null;
    public PageNumber: number;
    public SignatureName: string;
    public ExistingCustomData: string = null;
    public FontFamily: string;
    public FontSize: number;
}

class Measure {
    public Ratio: string = '';
    public X: NumberFormat[] = [];
    public Distance: NumberFormat[] = [];
    public Area: NumberFormat[]  = [];
    public Angle: NumberFormat[] = [];
    public Volume: NumberFormat[] = [];
    public TargetUnitConversion: number = 0;
    public Depth: number = 0;
}

class NumberFormat {
    public Unit: string;
    public ConversionFactor: number;
    public FractionalType: string;
    public Denominator: number;
    public FormatDenominator: boolean;
    constructor() {
        this.Unit = '';
        this.ConversionFactor = 0;
        this.FractionalType = '';
        this.Denominator = 0;
        this.FormatDenominator = false;
    }
}


/**
 *
 * @hidden
 */
export class PopupAnnotationBase {
    public Author: string;
    public AnnotationSelectorSettings: any;
    public ModifiedDate: string;
    public Subject: string;
    public IsLock: boolean;
    public IsCommentLock: boolean;
    public AnnotationFlags: string;
    public Note: string;
    public Type: string;
    public SubType: string;
    public AnnotName: string;
    public Icon: string;
    public Comments: PopupAnnotationBase[];
    public State: string;
    public StateModel: string;
    public Opacity: number;
    public StrokeColor: string;
    public Color: AnnotColor;
    public Reference: any; // Use 'any' for compatibility with Syncfusion.Pdf.Primitives.PdfReference or similar
    public AnnotType: string;
    public CustomData: { [key: string]: any };
    public AnnotationSettings: any;
    public IsPrint: boolean;
    public ExistingCustomData: string;
    public Bounds: AnnotBounds;
    public Size: SizeBase;
    public IsLocked: boolean;

    constructor() {
        this.AnnotationFlags = null;
        this.AnnotationSelectorSettings = null;
        this.AnnotationSettings = null;
        this.ExistingCustomData = null;
        this.CustomData = null;
        this.IsPrint = false;
    }
}

/**
 *
 * @hidden
 */
export class TextMarkupAnnotationBase{
    TextMarkupAnnotationType: string;
    AnnotationSelectorSettings: any;
    Author: string;
    ModifiedDate: string;
    Subject: string;
    Note: string;
    IsCommentLock: boolean;
    Bounds: AnnotBounds[];
    Color: string;
    Opacity: number;
    Rect: Rectangle;
    AnnotName: string;
    Comments: PopupAnnotationBase[];
    State: string;
    StateModel: string;
    AnnotType: string;
    CustomData: any;
    ExistingCustomData: string;
    IsMultiSelect: boolean;
    AnnotNameCollection: string[];
    AnnotpageNumbers: number[];
    AnnotationSettings: any;
    AllowedInteractions: string[];
    IsPrint: boolean;
    TextMarkupContent: string;
    AnnotationRotation: number;
    constructor() {
        this.AnnotationSelectorSettings = null;
        this.AnnotationSettings = null;
        this.ExistingCustomData = null;
        this.CustomData = null;
        this.IsPrint = true;
        this.IsMultiSelect = false;
        this.AnnotpageNumbers = null;
        this.AnnotNameCollection = null;
    }
}
/**
 *
 * @hidden
 */
export class PdfLayer {
    //PdfLayer
}

/**
 *
 * @hidden
 */
export class AnnotPoint {
    public X: number;
    public Y: number;
    constructor(_X: number, _Y: number) {
        this.X = _X;
        this.Y = _Y;
    }
}

/**
 *
 * @hidden
 */
export class AnnotBounds {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;
    public Location: {
        X: number;
        Y: number;
    };
    public Size: SizeBase
    public Left: number;
    public Top: number;
    public Right: number;
    public Bottom: number;

    constructor(_X: number, _Y: number, _Width: number, _Height: number) {
        this.X = _X;
        this.Y = _Y;
        this.Width = _Width;
        this.Height = _Height;
        this.Location = {
            X: _X,
            Y: _Y
        };
        this.Size = {
            IsEmpty: false,
            Width: _Width,
            Height: _Height
        };
        this.Left = _X;
        this.Top = _Y;
        this.Right = _X + _Width;
        this.Bottom = _Y + _Height;
    }
}

/**
 *
 * @hidden
 */
export class AnnotColor {
    public R: number;
    public G: number;
    public B: number;
    public IsEmpty: boolean = true;
    constructor(_R: number, _G: number, _B: number) {
        this.R = _R;
        this.G = _G;
        this.B = _B;
        if (this.R !== 0 || this.G !== 0 || this.B !== 0) {
            this.IsEmpty = false;
        }
    }
}

/**
 *
 * @hidden
 */
export class FontBase{
    public Bold: boolean;
    public FontFamily : PdfFontFamily;
    public Height: number;
    public Italic: boolean;
    public Name: string;
    public Size: number;
    public Strikeout: boolean;
    public Style: PdfFontStyle;
    public Underline: boolean;
    constructor(pdfFont: PdfFont, fontFamilyString: string) {
        this.Bold = pdfFont.isBold;
        this.FontFamily = (pdfFont as PdfStandardFont)._fontFamily;
        this.Height = pdfFont.height;
        this.Italic = pdfFont.isItalic;
        this.Name = fontFamilyString;
        this.Size = pdfFont.size;
        this.Strikeout = pdfFont.isStrikeout;
        this.Style = pdfFont.style;
        this.Underline = pdfFont.isUnderline;
    }
}
