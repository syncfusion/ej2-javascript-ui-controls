import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { FormFieldsBase } from './index';
import { PdfAnnotationFlag, PdfBorderEffect, PdfGraphics, PdfInkAnnotation, PdfPage, PdfPen, PdfRotationAngle, _PdfPath } from "@syncfusion/ej2-pdf";
import { PdfViewer, PdfViewerBase } from "../index";
import { Point, Rect } from '@syncfusion/ej2-drawings';

/**
 * SignatureBase
 * 
 * @hidden
 */
export class SignatureBase {


    m_formFields: FormFieldsBase;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;

    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     * @param jsonObject 
     * @param loadedDocument 
     */
    public saveSignatureData(jsonObject: { [key: string]: string }, loadedDocument: any) {
        const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
        let signatureDetails: any = JSON.parse(jsonObject.signatureData);
        if (!isNullOrUndefined(signatureDetails)) {
            for (let i = 0; i < signatureDetails.length; i++) {

                let pageData: any = signatureDetails[parseInt(i.toString(), 10)];

                // Save signature as data

                if (pageData.length > 0) {

                    for (let p = 0; p < pageData.length; p++) {

                        const data: any = pageData[parseInt(p.toString(), 10)];

                        const signatureType: string = data.hasOwnProperty("shapeAnnotationType") && data["shapeAnnotationType"] !== null
                            ? data["shapeAnnotationType"].toString()
                            : null;

                        if (signatureType !== null && signatureType === 'SignatureText') {
                            formfields.drawFreeTextAnnotations(data, loadedDocument, true);
                        }

                        else if (signatureType !== null && signatureType === 'SignatureImage') {
                            formfields.drawImage(data, loadedDocument, true);
                        }

                        else {
                            let pageNumber: number = data.pageIndex;
                            let page: PdfPage = loadedDocument.getPage(pageNumber);
                            let rotateAngle: number = this.getRotateAngle(page.rotation.toString());
                            let size: number[] = page.size;
                            let pageWidth: number = size[0];
                            let pageHeight: number = size[1];
                            if (rotateAngle == 1 || rotateAngle == 3) {
                                pageHeight = size[0];
                                pageWidth = size[1];
                            }
                            else {
                                pageHeight = size[0];
                                pageWidth = size[1];
                            }

                            let bounds: Rect = JSON.parse(data.bounds);
                            bounds = this.getSignatureBounds(bounds, this.convertPointToPixel(pageHeight), this.convertPointToPixel(pageWidth), rotateAngle);
                            let stampObjects: any = JSON.parse(data.data);
                            let left: number = this.convertPixelToPoint(bounds.left);
                            let top: number = this.convertPixelToPoint(bounds.top);
                            let width: number = this.convertPixelToPoint(bounds.width);
                            let height: number = this.convertPixelToPoint(bounds.height);
                            let opacity: number = data.opacity;
                            let thickness: number = data.thickness;
                            let strokeColor: any = JSON.parse(data.strokeColor);
                            let color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                            let minimumX: number = -1;
                            let minimumY: number = -1;
                            let maximumX: number = -1;
                            let maximumY: number = -1;

                            for (let p = 0; p < stampObjects.length; p++) {
                                const value = stampObjects[parseInt(p.toString(), 10)];

                                if (minimumX == -1) {
                                    minimumX = value.x;
                                    minimumY = value.y;
                                    maximumX = value.x;
                                    maximumY = value.x;
                                }
                                else {
                                    let point1: number = value.x;
                                    let point2: number = value.y;
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
                            let newDifferenceX: number = maximumX - minimumX;
                            let newDifferenceY: number = maximumY - minimumY;

                            let newPoint1: number[] = [0, 0];
                            let loadedPage: PdfPage = loadedDocument.getPage(pageNumber);
                            let graphics: PdfGraphics = null;
                            if (loadedPage != null) {
                                graphics = loadedPage.graphics;
                                graphics.save();
                                graphics.setTransparency(opacity);
                                graphics.translateTransform(left, top);
                            }
                            let colors: PdfPen = new PdfPen(color, width);
                            colors._width = thickness;

                            if (stampObjects.length > 0) {
                                let dataPath: _PdfPath = new _PdfPath();
                                for (let j = 0; j < stampObjects.length; j++) {
                                    const value = stampObjects[parseInt(j.toString(), 10)];
                                    let path: any = value.command.toString();
                                    let differenceX: number = ((newDifferenceX) / width);
                                    let differenceY: number = ((newDifferenceY) / height);
                                    let newX: number = ((value.x - minimumX) / differenceX);
                                    let currentY: number = ((value.y - minimumY) / differenceY);

                                    if (path == "M") {
                                        if (j != 0) {
                                            page.graphics._drawPath(dataPath, colors, null);
                                            dataPath = new _PdfPath();
                                        }
                                        newPoint1 = [newX, currentY];
                                        if (!isNullOrUndefined(graphics)) {
                                            dataPath._addLine(newX, currentY, newX, currentY)
                                        }
                                    }
                                    else if (path = 'L') {
                                        let newPoint2: number[] = [newX, currentY];

                                        if (graphics != null) {
                                            // Removed this line to fix the issue EJ2-60295
                                            // graphics.DrawLine(colors, newpoint1, newpoint2);
                                            dataPath._addLine(newPoint1[0], newPoint1[1], newPoint2[0], newPoint2[1]);
                                        }
                                        newPoint1 = newPoint2;
                                    }
                                    if (j == stampObjects.length - 1) {
                                        page.graphics._drawPath(dataPath, colors, null);
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
     */
    public getSignatureBounds(bounds: Rect, pageHeight: number, pageWidth: number, rotateAngle: number): any {
        let bound: { [key: string]: any };

        if (rotateAngle == 0) {
            bound = { "left": bounds.left, "top": bounds.top, "width": bounds.width, "height": bounds.height };
        }
        else if (rotateAngle == 1) {
            bound = { "left": (pageWidth - bounds.top - bounds.height), "top": bounds.left, "width": bounds.height, "height": bounds.width }
        }
        else if (rotateAngle == 2) {
            bound = { "left": (pageWidth - bounds.left - bounds.width), "top": (pageHeight - bounds.top - bounds.height), "width": bounds.width, "height": bounds.height }
        }
        else if (rotateAngle == 3) {
            bound = { "left": bounds.top, "top": (pageHeight - bounds.width), "width": bounds.height, "height": bounds.width }
        }
        return bound;
    }

    /**
     * @private
     * @param jsonObject 
     * @param loadedDocument 
     */
    public saveSignatureAsAnnotatation(jsonObject: { [key: string]: string }, loadedDocument: any) {
        const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
        let signatureDetails: any = JSON.parse(jsonObject.signatureData);
        if (!isNullOrUndefined(signatureDetails)) {
            for (let i = 0; i < signatureDetails.length; i++) {

                let pageData: any = signatureDetails[parseInt(i.toString(), 10)];

                // Save signature as data

                if (pageData.length > 0) {

                    for (let p = 0; p < pageData.length; p++) {
                        const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
                        const signatureAnnotation: any = pageData[parseInt(p.toString(), 10)];
                        const signatureType: string = signatureAnnotation.hasOwnProperty("shapeAnnotationType") && signatureAnnotation["shapeAnnotationType"] !== null
                            ? signatureAnnotation["shapeAnnotationType"].toString()
                            : null;
                        if (signatureType !== null && signatureType === 'SignatureText') {
                            formfields.drawFreeTextAnnotations(signatureAnnotation, loadedDocument, false);
                        }

                        else if (signatureType !== null && signatureType === 'SignatureImage') {
                            formfields.drawImage(signatureAnnotation, loadedDocument, false);
                        }

                        else {
                            let bounds: Rect = JSON.parse(signatureAnnotation.bounds);
                            let stampObjects: any = JSON.parse(signatureAnnotation.data);
                            let left: number = this.convertPixelToPoint(bounds.left);
                            let top: number = this.convertPixelToPoint(bounds.top);
                            let width: number = this.convertPixelToPoint(bounds.width);
                            let height: number = this.convertPixelToPoint(bounds.height);
                            let pageNumber: number = signatureAnnotation.pageIndex;
                            let page: PdfPage = loadedDocument.getPage(pageNumber);
                            // let cropX = 0;
                            // let cropY = 0;
                            // if(page.cropBox.x)

                            let opacity: number = signatureAnnotation.opacity;
                            let thickness: number = signatureAnnotation.thickness;
                            let strokeColor: any = JSON.parse(signatureAnnotation.strokeColor);
                            let color: number[] = [strokeColor.r, strokeColor.g, strokeColor.b];
                            let minimumX: number = -1;
                            let minimumY: number = -1;
                            let maximumX: number = -1;
                            let maximumY: number = -1;

                            for (let p = 0; p < stampObjects.length; p++) {
                                const value = stampObjects[parseInt(p.toString(), 10)];

                                if (minimumX == -1) {
                                    minimumX = value.x;
                                    minimumY = value.y;
                                    maximumX = value.x;
                                    maximumY = value.x;
                                }
                                else {
                                    let point1: number = value.x;
                                    let point2: number = value.y;
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
                            let newDifferenceX: number = maximumX - minimumX;
                            let newDifferenceY: number = maximumY - minimumY;
                            let linePoints: number[] = [];
                            let isNewValues = 0;
                            for (let j = 0; j < stampObjects.length; j++) {
                                const element = stampObjects[parseInt(j.toString(), 10)];
                                const value = stampObjects[parseInt(j.toString(), 10)];
                                let path: any = value.command.toString();

                                if (path == "M" && j !== 0) {   
                                    isNewValues = j;
                                    break;
                                }
                                let differenceX: number = ((newDifferenceX) / width);
                                let differenceY: number = ((newDifferenceY) / height);
                                linePoints.push(((value.x - minimumX) / differenceX) + left);
                                let newX: number = ((value.y - minimumY) / differenceY);
                                linePoints.push(loadedDocument.getPage(pageNumber).size[1] - newX - top);
                            }
                            let highestY: number = 1;


                            for (let k: number = 0; k < linePoints.length - 1; k++) {
                                if (linePoints[parseInt(k.toString(), 10)] > highestY) {
                                    highestY = linePoints[parseInt(k.toString(), 10)];
                                }
                            }
                            let rectangle: Rect = new Rect(left, top, width, height);
                            let inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation([rectangle.x, rectangle.y, rectangle.width, rectangle.height], linePoints);
                            let bound: Rect = new Rect(inkAnnotation.bounds.x, inkAnnotation.bounds.y, inkAnnotation.bounds.width, inkAnnotation.bounds.height);
                            inkAnnotation.bounds = bound;
                            inkAnnotation.color = color;
                            
                            linePoints = [];
                            for (let i = isNewValues; i < stampObjects.length; i++) {
                                const val = stampObjects[parseInt(i.toString(), 10)];
                                const path = val["command"].toString();

                                if (path === "M" && i !== isNewValues) {
                                    inkAnnotation.inkPointsCollection.push(linePoints);
                                    linePoints = [];
                                }

                                const differenceX = newDifferenceX / width;
                                const differenceY = newDifferenceY / height;

                                linePoints.push((parseFloat(val["x"].toString()) - minimumX) / differenceX + left);
                                const newX = (parseFloat(val["y"].toString()) - minimumY) / differenceY;
                                linePoints.push(loadedDocument.getPage(pageNumber).size[1] - newX - top);
                            }

                            if (linePoints.length > 0) {
                                inkAnnotation.inkPointsCollection.push(linePoints);
                            }
                            
                            inkAnnotation.border.width = thickness;
                            inkAnnotation.opacity = opacity;
                            inkAnnotation._dictionary.set('NM', signatureAnnotation.signatureName.toString());
                            inkAnnotation._annotFlags = PdfAnnotationFlag.print;
                            if (signatureAnnotation.hasOwnProperty('author') && signatureAnnotation['author'] !== null) {
                                let author: string = signatureAnnotation['author'].toString();
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
                angle = 0;
                break;
            case 'RotateAngle180':
                angle = 2;
                break;
            case 'RotateAngle270':
                angle = 3;
                break;
            case 'RotateAngle90':
                angle = 1;
                break;
        }
        return angle;
    }
}

