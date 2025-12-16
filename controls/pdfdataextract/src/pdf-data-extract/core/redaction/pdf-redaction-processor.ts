import { _FieldFlag, _getInheritableProperty, _PdfAnnotationType, _PdfBaseStream, _PdfContentStream, _PdfDictionary, _PdfName, _PdfReference, PdfAnnotation, PdfBrush, PdfButtonField, PdfCheckBoxField, PdfComboBoxField, PdfDocument, PdfField, PdfForm, PdfInkAnnotation, PdfLineAnnotation, PdfListBoxField, PdfPage, PdfPolygonAnnotation, PdfPolyLineAnnotation, PdfRadioButtonListField, PdfSignatureField, PdfTextBoxField, PdfTextMarkupAnnotation, Point, Rectangle, _convertPointToNumberArray, _convertPointsToNumberArrays } from '@syncfusion/ej2-pdf';
import { PdfRedactionRegion } from './pdf-redaction-region';
export class _PdfRedactionProcessor {
    _updateContentStream(page: PdfPage, stream: _PdfContentStream, options: PdfRedactionRegion[], document: PdfDocument): void {
        if (typeof(stream) !== 'undefined' && page._pageDictionary.has('Contents')) {
            let contents: any = page._pageDictionary.getRaw('Contents'); // eslint-disable-line
            let content: Array<_PdfReference>;
            let ref: _PdfReference;
            if (contents !== null && typeof contents !== 'undefined' && contents instanceof _PdfReference) {
                ref = contents;
                contents = page._crossReference._fetch(ref);
            }
            if (contents && contents instanceof _PdfBaseStream) {
                content = [ref];
            } else if (contents && Array.isArray(contents)) {
                content = contents;
            } else {
                content = [];
            }
            for (let i: number = 0; i < content.length; i++) {
                const reference: any = content[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                page._crossReference._cacheMap.delete(reference);
            }
            const restoreReference: _PdfReference = page._crossReference._getNextReference();
            page._crossReference._cacheMap.set(restoreReference, stream);
            const pageContent: Array<_PdfReference> = [];
            pageContent.push(restoreReference);
            page._pageDictionary.set('Contents', pageContent);
            page._pageDictionary._updated = true;
        }
        this._processAnnotation(page, options);
        this._processFormFields(page, options, document);
        for (let i: number = 0; i < options.length; i++) {
            const bounds: {x: number, y: number, width: number, height: number} = options[Number.parseInt(i.toString(), 10)].bounds;
            if (options[Number.parseInt(i.toString(), 10)]._appearanceEnabled) {
                options[Number.parseInt(i.toString(), 10)].appearance.normal._isNew = true;
                page.graphics.drawTemplate(options[Number.parseInt(i.toString(), 10)].appearance.normal,
                                           bounds);
            } else if (options[Number.parseInt(i.toString(), 10)].fillColor) {
                page.graphics.drawRectangle(bounds,
                                            new PdfBrush(options[Number.parseInt(i.toString(), 10)].fillColor));
            }
        }
    }
    _processFormFields(page: PdfPage, options: PdfRedactionRegion[], document: PdfDocument): void {
        const form: PdfForm = document.form;
        let isValidField: boolean = true;
        if (form) {
            for (let i: number = 0; i < form.count; i++) {
                const field: PdfField = form. fieldAt(i);
                if (field && field.page !== page) {
                    continue;
                }
                const key: _PdfName =  _getInheritableProperty(field._dictionary, 'FT', false, true, 'Parent');
                let fieldFlags: number = 0;
                let bounds: Rectangle;
                const flag: number = _getInheritableProperty(field._dictionary, 'Ff', false, true, 'Parent');
                if (typeof flag !== 'undefined') {
                    fieldFlags = flag;
                }
                let kids: any[]; // eslint-disable-line
                switch (key.name.toLowerCase()) {
                case 'tx':
                    kids = field._dictionary.getRaw('Kids');
                    if (kids && kids.length > 1) {
                        for (let i: number = 0; i < kids.length; i++) {
                            const kidsDictionary: _PdfDictionary = document._crossReference._fetch(kids[Number.parseInt(i.toString(), 10)]);
                            if (kidsDictionary.has('Rect')) {
                                const rectangle: any = kidsDictionary.getArray('Rect'); // eslint-disable-line
                                if (rectangle) {
                                    bounds = this._toRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
                                    bounds.y = (page.graphics._size.height - (bounds.y + bounds.height));
                                }
                                const emptyRectangle: boolean = this._isEmptyRectangle(bounds.width, bounds.height);
                                if (!emptyRectangle) {
                                    for (let j: number = 0; j < options.length; j++) {
                                        if (this._isFound(bounds, options[Number.parseInt(j.toString(), 10)].bounds) &&
                                            this._isKidInSamePage(kidsDictionary, page)) {
                                            if (page._pageDictionary.has('Annots')) {
                                                let annots: any = page._pageDictionary.getRaw('Annots'); // eslint-disable-line
                                                if (annots instanceof _PdfReference) {
                                                    const values: any = document._crossReference._fetch(annots); // eslint-disable-line
                                                    annots = values;
                                                }
                                                const index: number = annots.indexOf(kids[Number.parseInt(i.toString(), 10)]);
                                                annots.splice(index, 1);
                                                page._pageDictionary._updated = true;
                                            }
                                            isValidField = false;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        bounds = (field as PdfTextBoxField).bounds;
                    }
                    break;
                case 'btn':
                    if ((fieldFlags & _FieldFlag.pushButton) !== 0) {
                        bounds = (field as PdfButtonField).bounds;
                    } else if ((fieldFlags & _FieldFlag.radio) !== 0) {
                        kids = field._dictionary.getRaw('Kids');
                        if (kids && kids.length > 0) {
                            for (let i: number = 0; i < kids.length; i++) {
                                const kidsDictionary: _PdfDictionary = document._crossReference._fetch(
                                    kids[Number.parseInt(i.toString(), 10)]);
                                if (kidsDictionary.has('Rect')) {
                                    const rectangle: any = kidsDictionary.getArray('Rect'); // eslint-disable-line
                                    if (rectangle) {
                                        bounds = this._toRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
                                        bounds.y = (page.graphics._size.height - (bounds.y + bounds.height));
                                    }
                                    const emptyRectangle: boolean = this._isEmptyRectangle(bounds.width, bounds.height);
                                    if (!emptyRectangle) {
                                        for (let j: number = 0; j < options.length; j++) {
                                            if (this._isFound(bounds, options[Number.parseInt(j.toString(), 10)].bounds)) {
                                                if (page._pageDictionary.has('Annots')) {
                                                    let annots: any[] = page._pageDictionary.getRaw('Annots'); // eslint-disable-line
                                                    if (annots instanceof _PdfReference) {
                                                        const values: any = document._crossReference._fetch(annots); // eslint-disable-line
                                                        annots = values;
                                                    }
                                                    const index: number = annots.indexOf(kids[Number.parseInt(i.toString(), 10)]);
                                                    annots.splice(index, 1);
                                                    page._pageDictionary._updated = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            bounds = (field as PdfRadioButtonListField).bounds;
                        }
                    } else {
                        bounds = (field as PdfCheckBoxField).bounds;
                    }
                    break;
                case 'ch':
                    if ((fieldFlags & _FieldFlag.combo) !== 0) {
                        bounds = (field as PdfComboBoxField).bounds;
                    } else {
                        bounds = (field as PdfListBoxField).bounds;
                    }
                    break;
                case 'sig':
                    bounds = (field as  PdfSignatureField).bounds;
                    break;
                }
                const emptyBounds: boolean = this._isEmptyRectangle(bounds.width, bounds.height);
                if (isValidField && !emptyBounds) {
                    for (let j: number = 0; j < options.length; j++) {
                        if (this._isFound(bounds, options[Number.parseInt(j.toString(), 10)].bounds)) {
                            form.removeFieldAt(i);
                            i--;
                            break;
                        }
                    }
                }
                isValidField = true;
            }
        }
    }
    _isFound(values: Rectangle, redactionBounds: Rectangle): boolean {
        if (this._intersectsWith(redactionBounds, values)) {
            return true;
        }
        return false;
    }
    _intersectsWith(rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number,
        height: number}): boolean {
        return (rect2.x < rect1.x + rect1.width) && (rect1.x < (rect2.x + rect2.width)) && (rect2.y < rect1.y + rect1.height) &&
         (rect1.y < rect2.y + rect2.height);
    }
    _isEmptyRectangle(width: number, height: number): boolean {
        return (width <= 0 || height <= 0);
    }
    _toRectangle(x: number, y: number, width: number, height: number): {x: number, y: number, width: number, height: number} {
        const x1: number = Math.min(x, width);
        const y1: number = Math.min(y, height);
        const x2: number = Math.abs(x - width);
        const y2: number = Math.abs(y - height);
        const bounds: Rectangle = {x: x1, y: y1, width: x2, height: y2};
        return bounds;
    }
    _isKidInSamePage(kid: _PdfDictionary, page: PdfPage): boolean {
        const pageReference: _PdfReference  = page._ref;
        const reference: _PdfReference = kid.getRaw('P');
        if (pageReference === reference) {
            return true;
        } else {
            return false;
        }
    }
    _processAnnotation(page: PdfPage, options: PdfRedactionRegion[]): void {
        let markupAnnotation: PdfTextMarkupAnnotation;
        const annotbounds: Array<Rectangle> = [];
        for (let i: number = 0; i <= page.annotations.count - 1; i++) {
            const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
            let type: _PdfAnnotationType;
            let rect: any; // eslint-disable-line
            let bounds: Rectangle;
            if (typeof(annotation) !== 'undefined') {
                type = this._getAnnotationType(annotation._dictionary);
                rect = annotation.bounds;
                bounds = rect;
            } else {
                type = _PdfAnnotationType.widgetAnnotation;
            }
            let isValidAnnotation: boolean = true;
            const newPoints: number[] = [];
            let inkBounds: {bounds: {x: number; y: number; width: number; height: number}, isValidAnnotation: boolean };
            switch (type) {
            case _PdfAnnotationType.textWebLinkAnnotation:
            case _PdfAnnotationType.documentLinkAnnotation:
            case _PdfAnnotationType.fileLinkAnnotation:
            case _PdfAnnotationType.watermarkAnnotation:
            case _PdfAnnotationType.fileAttachmentAnnotation:
            case _PdfAnnotationType.freeTextAnnotation:
            case _PdfAnnotationType.circleAnnotation:
            case _PdfAnnotationType.ellipseAnnotation:
            case _PdfAnnotationType.richMediaAnnotation:
            case _PdfAnnotationType.squareAnnotation:
            case _PdfAnnotationType.rectangleAnnotation:
            case _PdfAnnotationType.popupAnnotation:
            case _PdfAnnotationType.rubberStampAnnotation:
            case _PdfAnnotationType.soundAnnotation:
            case _PdfAnnotationType.linkAnnotation:
                break;
            case _PdfAnnotationType.caretAnnotation:
            case _PdfAnnotationType.movieAnnotation:
            case _PdfAnnotationType.printerMarkAnnotation:
            case _PdfAnnotationType.textAnnotation:
            case _PdfAnnotationType.textMarkupAnnotation:
            case _PdfAnnotationType.trapNetworkAnnotation:
                markupAnnotation = annotation as PdfTextMarkupAnnotation;
                if (markupAnnotation && markupAnnotation.boundsCollection && markupAnnotation.boundsCollection.length > 0) {
                    let isIntersect: boolean = false;
                    for (const innerBounds of markupAnnotation.boundsCollection) {
                        for (let j: number = 0; j < options.length; j++) {
                            if (this._isFound(innerBounds, options[Number.parseInt(j.toString(), 10)].bounds)) {
                                isIntersect = true;
                                break;
                            }
                        }
                    }
                    if (isIntersect) {
                        page.annotations.removeAt(i);
                        i--;
                        continue;
                    }
                }
                break;
            case _PdfAnnotationType.lineAnnotation:
                {
                    const lineAnnotation: PdfLineAnnotation = annotation as PdfLineAnnotation;
                    let points: Point[];
                    if (lineAnnotation) {
                        points = lineAnnotation.linePoints;
                    }
                    let isFound: boolean = false;
                    const height: number = page.graphics._size.height;
                    for (let j: number = 0; j < options.length; j++) {
                        if (this._isLineIntersectRectangle(options[Number.parseInt(j.toString(), 10)].bounds, points[0].x,
                                                           height - points[0].y, points[1].x, height - points[1].y)) {
                            isFound = true;
                        }
                    }
                    if (isFound) {
                        page.annotations.removeAt(i);
                        i--;
                        continue;
                    }
                }
                break;
            case _PdfAnnotationType.polygonAnnotation:
                {
                    const polygon: PdfPolygonAnnotation = (annotation as PdfPolygonAnnotation);
                    const polygonPoints: Point[] = polygon._getLinePoints();
                    const polygonPointsToArray: number[] = _convertPointToNumberArray(polygonPoints);
                    polygonPointsToArray.forEach((element: any) => { // eslint-disable-line
                        newPoints.push(element[0], -element[1]);
                    });
                    inkBounds = this._getBoundsFromPoints(newPoints, page);
                    bounds = inkBounds.bounds;
                    isValidAnnotation = inkBounds.isValidAnnotation;
                }
                break;
            case _PdfAnnotationType.polyLineAnnotation:
                {
                    const polyLine: PdfPolyLineAnnotation = (annotation as PdfPolyLineAnnotation);
                    const polyLinePoints: Point[] = polyLine._getLinePoints();
                    const polyLinePointsToArray: number[] = _convertPointToNumberArray(polyLinePoints);
                    polyLinePointsToArray.forEach((element: any) => { // eslint-disable-line
                        newPoints.push(element[0], -element[1]);
                    });
                    inkBounds = this._getBoundsFromPoints(newPoints, page);
                    bounds = inkBounds.bounds;
                    isValidAnnotation = inkBounds.isValidAnnotation;
                }
                break;
            case _PdfAnnotationType.inkAnnotation:
                {
                    const inkAnnotation: PdfInkAnnotation = (annotation as PdfInkAnnotation);
                    const inkList: Array<Point[]> = inkAnnotation.inkPointsCollection;
                    const inkPointsToNumberArray: number[][] = _convertPointsToNumberArrays(inkList);
                    inkBounds = this._getBoundsFromPoints(inkPointsToNumberArray[0], page);
                    bounds = inkBounds.bounds;
                    isValidAnnotation = inkBounds.isValidAnnotation;
                }
                break;
            case _PdfAnnotationType.highlight:
            case _PdfAnnotationType.squiggly:
            case _PdfAnnotationType.strikeOut:
            case _PdfAnnotationType.underline:
            case _PdfAnnotationType.screenAnnotation:
                markupAnnotation = annotation as PdfTextMarkupAnnotation;
                if (markupAnnotation && markupAnnotation.boundsCollection && markupAnnotation.boundsCollection.length > 0) {
                    let isIntersect: boolean = false;
                    for (const innerBounds of markupAnnotation.boundsCollection) {
                        for (let j: number = 0; j < options.length; j++) {
                            if (this._isFound(innerBounds, options[Number.parseInt(j.toString(), 10)].bounds)) {
                                isIntersect = true;
                                break;
                            }
                        }
                    }
                    if (isIntersect) {
                        page.annotations.removeAt(i);
                        i--;
                        continue;
                    }
                }
                break;
            default:
                isValidAnnotation = false;
            }
            annotbounds.push(bounds);
            if (bounds && isValidAnnotation) {
                for (let j: number = 0; j < options.length; j++) {
                    if (this._isFound(bounds, options[Number.parseInt(j.toString(), 10)].bounds)) {
                        page.annotations.removeAt(i);
                        i--;
                        page._pageDictionary._updated = true;
                        break;
                    }
                }
            }
        }
    }
    _getBoundsFromPoints(points: number[], loadedPage: PdfPage): { bounds: { x: number; y: number; width: number; height: number };
        isValidAnnotation: boolean } {
        let isValidAnnotation: boolean = false;
        if (points.length > 0) {
            let minX: number = points[0];
            let maxX: number = points[0];
            let minY: number = loadedPage.graphics._size.height - points[1];
            let maxY: number = loadedPage.graphics._size.height - points[1];
            for (let index: number = 0; index < points.length; index++) {
                const point: number = points[Number.parseInt(index.toString(), 10)];
                if (index % 2 === 0) {
                    minX = Math.min(minX, point);
                    maxX = Math.max(maxX, point);
                } else {
                    const adjustedY: number = loadedPage.graphics._size.height - point;
                    minY = Math.min(minY, adjustedY);
                    maxY = Math.max(maxY, adjustedY);
                }
            }
            isValidAnnotation = true;
            return { bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY }, isValidAnnotation };
        }
        return { bounds: { x: 0, y: 0, width: 0, height: 0 }, isValidAnnotation };
    }
    _isLineIntersectRectangle(
        redactBounds: { x: number; y: number; width: number; height: number },
        p1X: number,
        p1Y: number,
        p2X: number,
        p2Y: number
    ): boolean {
        let minX: number = p1X;
        let maxX: number = p2X;
        if (p1X > p2X) {
            minX = p2X;
            maxX = p1X;
        }
        if (maxX > redactBounds.x + redactBounds.width) {
            maxX = redactBounds.x + redactBounds.width;
        }
        if (minX < redactBounds.x) {
            minX = redactBounds.x;
        }
        if (minX > maxX) {
            return false;
        }
        let minY: number = p1Y;
        let maxY: number = p2Y;
        const dx: number = p2X - p1X;
        if (dx > 0.0000001) {
            const a: number = (p2Y - p1Y) / dx;
            const b: number = p1Y - a * p1X;
            minY = a * minX + b;
            maxY = a * maxX + b;
        }
        if (minY > maxY) {
            const temp: number = maxY;
            maxY = minY;
            minY = temp;
        }
        if (maxY > redactBounds.y + redactBounds.height) {
            maxY = redactBounds.y + redactBounds.height;
        }
        if (minY < redactBounds.y) {
            minY = redactBounds.y;
        }
        if (minY > maxY) {
            return false;
        }
        return true;
    }
    _isBoundsEqual(bounds1: {x: number, y: number, width: number, height: number}, bounds2: {x: number, y: number, width: number,
        height: number}): boolean {
        return bounds1.x === bounds2.x &&
               bounds1.y === bounds2.y &&
               bounds1.width === bounds2.width &&
               bounds1.height === bounds2.height;
    }
    _getAnnotationType(dictionary: _PdfDictionary): _PdfAnnotationType {
        let name: string = '';
        if (dictionary && dictionary.has('Subtype')) {
            const subtype: _PdfName = dictionary.get('Subtype');
            if (subtype) {
                name = subtype.name;
            }
        }
        let type: _PdfAnnotationType;
        switch (name.toLowerCase()) {
        case 'sound':
            type = _PdfAnnotationType.soundAnnotation;
            break;
        case 'text':
        case 'popup':
            type = _PdfAnnotationType.popupAnnotation;
            break;
        case 'link':
            {
                let linkDic: _PdfDictionary = null;
                if (dictionary.has('A')) {
                    linkDic = dictionary.get('A');
                }
                if (linkDic !== null && linkDic.has('S')) {
                    name = linkDic.get('S').name;
                    if (name != null) {
                        let border: number[] = [];
                        if (dictionary.has('Border')) {
                            border = dictionary.getArray('Border');
                        }
                        const mType: boolean = this._findAnnotation(border);
                        if (name === 'URI') {
                            if (!mType) {
                                type = _PdfAnnotationType.linkAnnotation;
                            } else {
                                type = _PdfAnnotationType.textWebLinkAnnotation;
                            }
                        }
                        else if (name === 'Launch') {
                            type = _PdfAnnotationType.fileLinkAnnotation;
                        }
                        else if (name === 'GoToR') {
                            type = _PdfAnnotationType.linkAnnotation;
                        } else if (name === 'GoTo') {
                            type = _PdfAnnotationType.documentLinkAnnotation;
                        }
                    }
                } else if (typeof(dictionary) !== 'undefined' && dictionary.has('Subtype')) {
                    const strText: _PdfName = dictionary.get('Subtype');
                    if (typeof(strText) !== 'undefined' && strText !== null) {
                        switch (strText.name) {
                        case 'Link':
                            type = _PdfAnnotationType.documentLinkAnnotation;
                            break;
                        }
                    }
                }
            }
            break;
        case 'fileattachment':
            type = _PdfAnnotationType.fileAttachmentAnnotation;
            break;
        case 'line':
            type = _PdfAnnotationType.lineAnnotation;
            break;
        case 'circle':
            {
                const circleRectArray: number[] = dictionary.getArray('Rect');
                if (circleRectArray != null) {
                    const circleRect: number[] = circleRectArray;
                    type = (circleRect[2] === (circleRect[3])) ? _PdfAnnotationType.circleAnnotation :
                        _PdfAnnotationType.ellipseAnnotation;
                }
            }
            break;
        case 'square':
            {
                const squarerectArray: number[] = dictionary.getArray('Rect');
                if (squarerectArray != null) {
                    const squareRect: number[] = squarerectArray;
                    type = (squareRect[2] === (squareRect[3])) ? _PdfAnnotationType.squareAnnotation :
                        _PdfAnnotationType.rectangleAnnotation;
                }
            }
            break;
        case 'polygon':
            type = _PdfAnnotationType.polygonAnnotation;
            break;
        case 'redact':
            type = _PdfAnnotationType.redactionAnnotation;
            break;
        case 'polyline':
            type = _PdfAnnotationType.polyLineAnnotation;
            break;
        case 'widget':
            type = _PdfAnnotationType.widgetAnnotation;
            break;
        case 'highlight':
            type = _PdfAnnotationType.highlight;
            break;
        case 'underline':
            type = _PdfAnnotationType.underline;
            break;
        case 'strikeout':
            type = _PdfAnnotationType.strikeOut;
            break;
        case 'squiggly':
            type = _PdfAnnotationType.squiggly;
            break;
        case 'stamp':
            type = _PdfAnnotationType.rubberStampAnnotation;
            break;
        case 'ink':
            type = _PdfAnnotationType.inkAnnotation;
            break;
        case 'freetext':
            type = _PdfAnnotationType.freeTextAnnotation;
            break;
        case 'caret':
            type = _PdfAnnotationType.caretAnnotation;
            break;
        case 'watermark':
            type = _PdfAnnotationType.watermarkAnnotation;
            break;
        case 'screen':
            type = _PdfAnnotationType.screenAnnotation;
            break;
        case '3d':
            type = _PdfAnnotationType.movieAnnotation;
            break;
        case 'richmedia':
            type = _PdfAnnotationType.richMediaAnnotation;
            break;
        }
        return type;
    }
    _findAnnotation(array: any[]): boolean { // eslint-disable-line
        if (typeof(array) === 'undefined') {
            return false;
        }
        for (let i: number = 0; i < array.length; i++) {
            if (array[Number.parseInt(i.toString(), 10)] instanceof Array) {
                const temp: any[] = array[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                for (let j: number = 0; j < temp.length; j++) {
                    const value: number = temp[Number.parseInt(i.toString(), 10)] as number;
                    if (value > 0) {
                        return false;
                    }
                }
            } else {
                const digit: number = array[Number.parseInt(i.toString(), 10)] as number;
                if (typeof(digit) !== 'undefined' && digit > 0) {
                    return false;
                }
            }
        }
        return true;
    }
}
