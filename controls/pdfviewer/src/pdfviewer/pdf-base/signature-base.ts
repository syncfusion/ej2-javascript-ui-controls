import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AnnotationRenderer, FormFieldsBase, Path, PointBase } from './index';
import { PdfAnnotationFlag, PdfGraphics, PdfInkAnnotation, PdfPage, PdfPen, PdfPath, Point, PdfColor } from '@syncfusion/ej2-pdf';
import { PdfViewer, PdfViewerBase } from '../index';
import { Rect } from '@syncfusion/ej2-drawings';

/**
 * SignatureBase
 *
 * @hidden
 */
export class SignatureBase {
    // eslint-disable-next-line
    m_formFields: FormFieldsBase;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     * @param {string} jsonObject - jsonObject
     * @param {any} loadedDocument - loadedDocument
     * @returns {void}
     */
    public saveSignatureData(jsonObject: { [key: string]: string }, loadedDocument: any): void {
        const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
        const signatureDetails: any = JSON.parse(jsonObject.signatureData);
        if (!isNullOrUndefined(signatureDetails)) {
            for (let i: number = 0; i < signatureDetails.length; i++) {
                const pageData: any = signatureDetails[parseInt(i.toString(), 10)];
                // Save signature as data
                if (pageData.length > 0) {
                    for (let p: number = 0; p < pageData.length; p++) {
                        const data: any = pageData[parseInt(p.toString(), 10)];
                        const signatureType: string = Object.prototype.hasOwnProperty.call(data, 'shapeAnnotationType') && data['shapeAnnotationType'] !== null
                            ? data['shapeAnnotationType'].toString()
                            : null;
                        if (signatureType !== null && signatureType === 'SignatureText') {
                            formfields.drawFreeTextAnnotations(data, loadedDocument, true);
                        }
                        else if (signatureType !== null && signatureType === 'SignatureImage') {
                            formfields.drawImage(data, loadedDocument, true);
                        }
                        else {
                            const pageNumber: number = data.pageIndex;
                            const page: PdfPage = loadedDocument.getPage(pageNumber);
                            const rotateAngle: number = this.getRotateAngle(page.rotation.toString());
                            const size: any = page.size;
                            let pageWidth: number = size.width;
                            let pageHeight: number = size.height;
                            if (rotateAngle === 1 || rotateAngle === 3) {
                                pageHeight = size.width;
                                pageWidth = size.height;
                            }
                            else {
                                pageHeight = size.height;
                                pageWidth = size.width;
                            }
                            let bounds: Rect = JSON.parse(data.bounds);
                            bounds = this.getSignatureBounds(bounds, this.convertPointToPixel(pageHeight),
                                                             this.convertPointToPixel(pageWidth), rotateAngle);
                            const stampObjects: any = JSON.parse(data.data);
                            const left: number = this.convertPixelToPoint(bounds.left);
                            const top: number = this.convertPixelToPoint(bounds.top);
                            const width: number = this.convertPixelToPoint(bounds.width);
                            const height: number = this.convertPixelToPoint(bounds.height);
                            const opacity: number = data.opacity;
                            const thickness: number = data.thickness;
                            const strokeColor: any = JSON.parse(data.strokeColor);
                            const color: PdfColor = {r: strokeColor.r, g: strokeColor.g, b: strokeColor.b};
                            let minimumX: number = -1;
                            let minimumY: number = -1;
                            let maximumX: number = -1;
                            let maximumY: number = -1;
                            for (let p: number = 0; p < stampObjects.length; p++) {
                                const value: any = stampObjects[parseInt(p.toString(), 10)];
                                if (minimumX === -1) {
                                    minimumX = value.x;
                                    minimumY = value.y;
                                    maximumX = value.x;
                                    maximumY = value.x;
                                }
                                else {
                                    const point1: number = value.x;
                                    const point2: number = value.y;
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
                            const newDifferenceX: number = maximumX - minimumX;
                            const newDifferenceY: number = maximumY - minimumY;
                            let newPoint1: number[] = [0, 0];
                            const loadedPage: PdfPage = loadedDocument.getPage(pageNumber);
                            let graphics: PdfGraphics = null;
                            if (loadedPage != null) {
                                graphics = loadedPage.graphics;
                                graphics.save();
                                graphics.setTransparency(opacity);
                                graphics.translateTransform({x: left, y: top});
                            }
                            const colors: PdfPen = new PdfPen(color, width);
                            colors._width = this.convertPixelToPoint(thickness);
                            if (stampObjects.length > 0) {
                                let dataPath: PdfPath = new PdfPath();
                                for (let j: number = 0; j < stampObjects.length; j++) {
                                    const value: any = stampObjects[parseInt(j.toString(), 10)];
                                    const path: string = value.command.toString();
                                    const differenceX: number = ((newDifferenceX) / width);
                                    const differenceY: number = ((newDifferenceY) / height);
                                    const newX: number = ((value.x - minimumX) / differenceX);
                                    const currentY: number = ((value.y - minimumY) / differenceY);
                                    if (path === 'M') {
                                        if (j !== 0) {
                                            page.graphics.drawPath(dataPath, colors, null);
                                            dataPath = new PdfPath();
                                        }
                                        newPoint1 = [newX, currentY];
                                        if (!isNullOrUndefined(graphics)) {
                                            dataPath.addLine({x: newX, y: currentY}, {x: newX, y: currentY});
                                        }
                                    }
                                    else if (path === 'L') {
                                        const newPoint2: number[] = [newX, currentY];
                                        if (graphics != null) {
                                            // Removed this line to fix the issue EJ2-60295
                                            // graphics.DrawLine(colors, newpoint1, newpoint2);
                                            dataPath.addLine({x: newPoint1[0], y: newPoint1[1]}, {x: newPoint2[0], y: newPoint2[1]});
                                        }
                                        newPoint1 = newPoint2;
                                    }
                                    if (j === stampObjects.length - 1) {
                                        page.graphics.drawPath(dataPath, colors, null);
                                    }
                                }
                            }
                            if (graphics != null) {
                                graphics.restore();
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * getSignatureBounds
     *
     * @param {Rect} bounds - bounds
     * @param {number} pageHeight - pageHeight
     * @param {number} pageWidth - pageWidth
     * @param {number} rotateAngle - rotateAngle
     * @returns {void}
     */
    public getSignatureBounds(bounds: Rect, pageHeight: number, pageWidth: number, rotateAngle: number): any {
        let bound: { [key: string]: any };
        if (rotateAngle === 0) {
            bound = { 'left': bounds.left, 'top': bounds.top, 'width': bounds.width, 'height': bounds.height };
        }
        else if (rotateAngle === 1) {
            bound = { 'left': (pageWidth - bounds.top - bounds.height), 'top': bounds.left, 'width': bounds.height, 'height': bounds.width };
        }
        else if (rotateAngle === 2) {
            bound = { 'left': (pageWidth - bounds.left - bounds.width), 'top': (pageHeight - bounds.top - bounds.height), 'width': bounds.width, 'height': bounds.height };
        }
        else if (rotateAngle === 3) {
            bound = { 'left': bounds.top, 'top': (pageHeight - bounds.left - bounds.width), 'width': bounds.height, 'height': bounds.width };
        }
        return bound;
    }

    /**
     * @private
     * @param {string} jsonObject - jsonObject
     * @param {any} loadedDocument - loadedDocument
     * @returns {void}
     */
    public saveSignatureAsAnnotatation(jsonObject: { [key: string]: string }, loadedDocument: any): void {
        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        const signatureDetails: any = JSON.parse(jsonObject.signatureData);
        if (!isNullOrUndefined(signatureDetails)) {
            for (let i: number = 0; i < signatureDetails.length; i++) {
                const pageData: any = signatureDetails[parseInt(i.toString(), 10)];
                // Save signature as data
                if (pageData.length > 0) {
                    for (let p: number = 0; p < pageData.length; p++) {
                        const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
                        const signatureAnnotation: any = pageData[parseInt(p.toString(), 10)];
                        const signatureType: string = Object.prototype.hasOwnProperty.call(signatureAnnotation, 'shapeAnnotationType') && signatureAnnotation['shapeAnnotationType'] !== null
                            ? signatureAnnotation['shapeAnnotationType'].toString()
                            : null;
                        if (signatureType !== null && signatureType === 'SignatureText') {
                            formfields.drawFreeTextAnnotations(signatureAnnotation, loadedDocument, false);
                        }
                        else if (signatureType !== null && signatureType === 'SignatureImage') {
                            formfields.drawImage(signatureAnnotation, loadedDocument, false);
                        }
                        else {
                            const bounds: Rect = JSON.parse(signatureAnnotation.bounds);
                            const stampObjects: any = JSON.parse(signatureAnnotation.data);
                            const pageNumber: number = signatureAnnotation.pageIndex;
                            const page: PdfPage = loadedDocument.getPage(pageNumber);
                            const cropValues: PointBase = annotationRenderer.getCropBoxValue(page, false);
                            const left: number = cropValues.x + this.convertPixelToPoint(bounds.left);
                            let top: number = this.convertPixelToPoint(bounds.top);
                            if (!(cropValues.x === 0 && (page.cropBox[2] === page.size.width && cropValues.y === page.size.height))) {
                                top -= cropValues.y;
                            }
                            const width: number = this.convertPixelToPoint(bounds.width);
                            const height: number = this.convertPixelToPoint(bounds.height);
                            // let cropX = 0;
                            // let cropY = 0;
                            // if(page.cropBox.x)
                            const opacity: number = signatureAnnotation.opacity;
                            const thickness: number = signatureAnnotation.thickness;
                            const strokeColor: any = JSON.parse(signatureAnnotation.strokeColor);
                            const color: PdfColor = {r: strokeColor.r, g: strokeColor.g, b: strokeColor.b};
                            let minimumX: number = -1;
                            let minimumY: number = -1;
                            let maximumX: number = -1;
                            let maximumY: number = -1;
                            const rotationAngle: number = annotationRenderer.getInkRotateAngle(page.rotation.toString());
                            const drawingPath: PdfPath = new PdfPath();
                            for (let p: number = 0; p < stampObjects.length; p++) {
                                const val: any = stampObjects[parseInt(p.toString(), 10)];
                                drawingPath.addLine({x: val.x, y: val.y}, {x: 0, y: 0});
                            }
                            const rotatedPath: Path = annotationRenderer.getRotatedPathForMinMax(drawingPath._points, rotationAngle);
                            for (let k: number = 0; k < rotatedPath.points.length; k += 2) {
                                const value: number[] = rotatedPath.points[parseInt(k.toString(), 10)];
                                if (minimumX === -1) {
                                    minimumX = value[0];
                                    minimumY = value[1];
                                    maximumX = value[0];
                                    maximumY = value[1];
                                }
                                else {
                                    const point1: number = value[0];
                                    const point2: number = value[1];
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
                            if (newDifferenceX === 0) {
                                newDifferenceX = 1;
                            }
                            else if (newDifferenceY === 0) {
                                newDifferenceY = 1;
                            }

                            let linePoints: Point[] = [];
                            let isNewValues: number = 0;
                            if (rotationAngle !== 0) {
                                for (let j: number = 0; j < stampObjects.length; j++) {
                                    const val: any = stampObjects[parseInt(j.toString(), 10)];
                                    const path: string = val['command'].toString();
                                    if (path === 'M' && j !== isNewValues) {
                                        isNewValues = j;
                                        break;
                                    }
                                    linePoints.push({
                                        x: (parseFloat(val['x'].toString())),
                                        y: (parseFloat(val['y'].toString()))
                                    });
                                }
                                const rotatedPoints: PdfPath = annotationRenderer.getRotatedPath(linePoints, rotationAngle);
                                linePoints = [];
                                for (let z: number = 0; z < rotatedPoints._points.length; z += 2) {
                                    linePoints.push({
                                        x: (rotatedPoints._points[parseInt(z.toString(), 10)].x - minimumX) / newDifferenceX + left,
                                        y: page.size.height - (rotatedPoints._points[parseInt(z.toString(), 10)].y - minimumY) /
                                        newDifferenceY - top
                                    });
                                }
                            }
                            else {
                                for (let j: number = 0; j < stampObjects.length; j++) {
                                    const val: any = stampObjects[parseInt(j.toString(), 10)];
                                    const path: string = val['command'].toString();
                                    if (path === 'M' && j !== isNewValues) {
                                        isNewValues = j;
                                        break;
                                    }
                                    const newX: number = ((val.y - minimumY) / newDifferenceY);
                                    linePoints.push({
                                        x: ((val.x - minimumX) / newDifferenceX) + left,
                                        y: page.size.height - newX - top
                                    });
                                }
                            }
                            const inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation({x: left, y: top, width: width, height: height},
                                                                                         linePoints);
                            let bound: Rect = new Rect();
                            bound = new Rect(inkAnnotation.bounds.x, (page.size.height - (inkAnnotation.bounds.y +
                                inkAnnotation.bounds.height)), inkAnnotation.bounds.width, inkAnnotation.bounds.height);
                            inkAnnotation.bounds = bound;
                            inkAnnotation.color = color;
                            linePoints = [];
                            if (isNewValues > 0) {
                                if (rotationAngle !== 0) {
                                    const pathCollection: Point[][] = [];
                                    for (let i: number = isNewValues; i < stampObjects.length; i++) {
                                        const val: any = stampObjects[parseInt(i.toString(), 10)];
                                        const path: string = val['command'].toString();
                                        if (path === 'M' && i !== isNewValues) {
                                            pathCollection.push(linePoints);
                                            linePoints = [];
                                        }
                                        linePoints.push({
                                            x: val['x'],
                                            y: val['y']
                                        });
                                    }
                                    if (linePoints.length > 0) {
                                        pathCollection.push(linePoints);
                                    }
                                    for (let g: number = 0; g < pathCollection.length; g++) {
                                        let graphicsPoints: any = [];
                                        const pointsCollections: Point[] = pathCollection[parseInt(g.toString(), 10)];
                                        if (pointsCollections.length > 0) {
                                            const rotatedPoints: PdfPath = annotationRenderer.getRotatedPath(pointsCollections,
                                                                                                             rotationAngle);
                                            for (let z: number = 0; z < rotatedPoints._points.length; z += 2) {
                                                graphicsPoints.push({
                                                    x: (rotatedPoints._points[parseInt(z.toString(), 10)].x - minimumX) /
                                                    newDifferenceX + left,
                                                    y: page.size.height - (rotatedPoints._points[parseInt(z.toString(), 10)].y - minimumY) /
                                                    newDifferenceY - top
                                                });
                                            }
                                            inkAnnotation.inkPointsCollection.push(graphicsPoints);
                                        }
                                        graphicsPoints = [];
                                    }
                                }
                                else {
                                    for (let i: number = isNewValues; i < stampObjects.length; i++) {
                                        const val: any = stampObjects[parseInt(i.toString(), 10)];
                                        const path: string = val['command'].toString();
                                        if (path === 'M' && i !== isNewValues) {
                                            inkAnnotation.inkPointsCollection.push(linePoints);
                                            linePoints = [];
                                        }
                                        const newX: number = ((val['y'] - minimumY) / newDifferenceY);
                                        linePoints.push({
                                            x: (val['x'] - minimumX) / newDifferenceX + left,
                                            y: page.size.height - newX - top
                                        });
                                    }
                                    if (linePoints.length > 0) {
                                        inkAnnotation.inkPointsCollection.push(linePoints);
                                    }
                                }
                            }
                            inkAnnotation.border.width = thickness;
                            inkAnnotation.opacity = opacity;
                            inkAnnotation._dictionary.set('NM', signatureAnnotation.signatureName.toString());
                            inkAnnotation._annotFlags = PdfAnnotationFlag.print;
                            if (Object.prototype.hasOwnProperty.call(signatureAnnotation, 'author') && signatureAnnotation['author'] !== null) {
                                const author: string = signatureAnnotation['author'].toString();
                                if (author !== 'Guest') {
                                    inkAnnotation.author = author;
                                }
                            }
                            page.annotations.add(inkAnnotation);
                        }
                    }
                }
            }
        }
    }

    private convertPointToPixel(number: number): number {
        return number * 96 / 72;
    }

    private convertPixelToPoint(value: number): number {
        return (value * (72 / 96));
    }

    private getRotateAngle(angleString: string): number {
        let angle: number = 0;
        switch (angleString) {
        case 'RotateAngle0':
        case '0':
            angle = 0;
            break;
        case 'RotateAngle180':
        case '2':
            angle = 2;
            break;
        case 'RotateAngle270':
        case '3':
            angle = 3;
            break;
        case 'RotateAngle90':
        case '1':
            angle = 1;
            break;
        }
        return angle;
    }
}
