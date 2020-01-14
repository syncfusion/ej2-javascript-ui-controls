import { IElement } from '@syncfusion/ej2-drawings';
import { PointModel } from '@syncfusion/ej2-drawings';
import { Rect } from '@syncfusion/ej2-drawings';
import { DrawingElement , Point, Matrix, identityMatrix, rotateMatrix} from '@syncfusion/ej2-drawings';
import { Container, transformPointByMatrix } from '@syncfusion/ej2-drawings';
import { PdfViewerBase, PdfViewer } from '../pdfviewer';
import { PdfAnnotationBaseModel, PdfBoundsModel } from './pdf-annotation-model';
import { ZOrderPageTable } from './pdf-annotation';
import { isPointOverConnector } from './connector-util';

/** @private */
export function findActiveElement(event: MouseEvent | TouchEvent, pdfBase: PdfViewerBase, pdfViewer: PdfViewer): IElement {
    if (pdfViewer && pdfBase.activeElements.activePageID > -1) {
        let objects: IElement[] = findObjectsUnderMouse(pdfBase, pdfViewer, event as MouseEvent);
        let object: IElement = findObjectUnderMouse(objects, event, pdfBase, pdfViewer);
        return object;
    }
    return undefined;
}

/** @private */
export function findObjectsUnderMouse(
    pdfBase: PdfViewerBase, pdfViewer: PdfViewer, event: MouseEvent): IElement[] {
    let actualTarget: IElement[] = [];
    let bounds: Rect;
    // tslint:disable-next-line
    let pt: PointModel = pdfBase.currentPosition || { x: event.offsetX, y: event.offsetY };
    pt = { x: pt.x / pdfBase.getZoomFactor(), y: pt.y / pdfBase.getZoomFactor() };
    let pageTable: ZOrderPageTable = pdfViewer.getPageTable(pdfBase.activeElements.activePageID);
    let objArray: Object[] = findObjects(pt, pageTable.objects);
    return objArray as IElement[];
}

/** @private */
export function findObjectUnderMouse(
    // tslint:disable-next-line
    objects: (PdfAnnotationBaseModel)[], event: any, pdfBase: PdfViewerBase, pdfViewer: PdfViewer
): IElement {
    let actualTarget: PdfAnnotationBaseModel = null;
    let touchArg: TouchEvent;
    let offsetX: number;
    let offsetY: number;
    if (event && event.type && event.type.indexOf('touch') !== -1) {
        touchArg = <TouchEvent & PointerEvent>event;
        if (pdfViewer.annotation) {
            let pageDiv: HTMLElement = pdfBase.getElement('_pageDiv_' + pdfViewer.annotation.getEventPageNumber(event));
            if (pageDiv) {
                let pageCurrentRect: ClientRect =
                    pageDiv.getBoundingClientRect();

                offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
            }
        }
    } else {
        offsetX = !isNaN(event.offsetX) ? event.offsetX : (event.position ? event.position.x : 0);
        offsetY = !isNaN(event.offsetY) ? event.offsetY : (event.position ? event.position.y : 0);
    }
    let offsetForSelector: number = 5;
    for (let i: number = 0; i < objects.length; i++) {
        // tslint:disable-next-line:max-line-length
        if (!(objects[i].shapeAnnotationType === 'Distance' || objects[i].shapeAnnotationType === 'Line' || objects[i].shapeAnnotationType === 'LineWidthArrowHead')) {
            let bounds: PdfBoundsModel = objects[i].wrapper.bounds;
            let rotationValue: number = 0;
            if (objects[i].shapeAnnotationType === 'Stamp') {
                rotationValue = 25;
            }
            // tslint:disable-next-line:max-line-length
            if ((((bounds.x - offsetForSelector) * pdfBase.getZoomFactor()) < offsetX) && (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) > offsetX) &&
                (((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor()) < offsetY) && (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) > offsetY)) {
                actualTarget = objects[i];
                break;
            }
        } else {
            let pt: PointModel = { x: offsetX / pdfBase.getZoomFactor(), y: offsetY / pdfBase.getZoomFactor() };
            let obj: DrawingElement = findElementUnderMouse(objects[i] as IElement, pt, offsetForSelector);
            let isOver: boolean = isPointOverConnector(objects[i], pt);
            if (obj && !isOver) {
                let newpoint: PointModel = CalculateLeaderPoints(objects[i], obj);
                if (newpoint) {
                    let rect: Rect = Rect.toBounds([newpoint, newpoint]);
                    rect.Inflate(10);
                    if (rect.containsPoint(pt)) {
                        isOver = true;
                    }
                }
            }
            if (obj && isOver) {
                actualTarget = objects[i];
                break;
            }
        }
    }
    return actualTarget as IElement;
}
/** @private */
// tslint:disable-next-line
export function CalculateLeaderPoints(selector: any, currentobject: any): any {
    let leaderCount: number = 0;
    let sourcePoint: PointModel = selector.sourcePoint;
    let targetPoint: PointModel = selector.targetPoint;
    if (selector.shapeAnnotationType === 'Distance') {
        let segment: DrawingElement = currentobject;
        let newPoint1: PointModel;
        let angle: number = Point.findAngle(selector.sourcePoint, selector.targetPoint);
        if (segment.id.indexOf('leader') > -1) {
            let center: PointModel = selector.wrapper.children[0].bounds.center;
            if (leaderCount === 0 && segment.id.indexOf('leader1') > -1) {
                newPoint1 = { x: selector.sourcePoint.x, y: selector.sourcePoint.y - selector.leaderHeight };
                center = sourcePoint;
            } else {
                newPoint1 = { x: selector.targetPoint.x, y: selector.targetPoint.y - selector.leaderHeight };
                center = targetPoint;

            }
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, angle, center.x, center.y);
            let rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
            return rotatedPoint;
        }
    }
}
/** @private */
export function findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DrawingElement {
    return findTargetShapeElement(obj.wrapper, position, padding);
}
/** @private */
export function insertObject(obj: PdfAnnotationBaseModel, key: string, collection: Object[]): void {
    if (collection.length === 0) {
        collection.push(obj);
    } else if (collection.length === 1) {
        // tslint:disable-next-line
        if ((collection[0] as any)[key] > (obj as any)[key]) {
            collection.splice(0, 0, obj);
        } else {
            collection.push(obj);
        }
    } else if (collection.length > 1) {
        let low: number = 0;
        let high: number = collection.length - 1;
        let mid: number = Math.floor((low + high) / 2);
        while (mid !== low) {
            // tslint:disable-next-line
            if ((collection[mid] as any)[key] < (obj as any)[key]) {
                low = mid;
                mid = Math.floor((low + high) / 2);
                // tslint:disable-next-line
            } else if ((collection[mid] as any)[key] > (obj as any)[key]) {
                high = mid;
                mid = Math.floor((low + high) / 2);
            }
        }
        // tslint:disable-next-line
        if ((collection[high] as any)[key] < (obj as any)[key]) {
            collection.push(obj);
            // tslint:disable-next-line
        } else if ((collection[low] as any)[key] > (obj as any)[key]) {
            collection.splice(low, 0, obj);
            // tslint:disable-next-line
        } else if (((collection[low] as any)[key] < (obj as any)[key]) && (collection[high] as any)[key] > (obj as any)[key]) {
            collection.splice(high, 0, obj);
        }
    }
}

/** @private */
export function findTargetShapeElement(container: Container, position: PointModel, padding?: number): DrawingElement {
    if (container && container.children) {
        for (let i: number = container.children.length - 1; i >= 0; i--) {
            let shapeElement: DrawingElement = container.children[i];
            if (shapeElement && shapeElement.bounds.containsPoint(position, 10)) {
                if (shapeElement instanceof Container) {
                    let targetElement: DrawingElement = this.findTargetElement(shapeElement, position);
                    if (targetElement) {
                        return targetElement;
                    }
                }
                if (shapeElement.bounds.containsPoint(position, 10)) {
                    return shapeElement;
                }
            }
        }
    }

    if (container && container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
        return container;
    }
    return null;
}

/** @private */
export function findObjects(region: PointModel, objCollection: (PdfAnnotationBaseModel)[]): (PdfAnnotationBaseModel)[] {
    let objects: (PdfAnnotationBaseModel)[] = [];
    for (let obj of objCollection) {
        if (findElementUnderMouse(obj as IElement, region, 10) ||
            (obj.shapeAnnotationType === 'Stamp' && findElementUnderMouse(obj as IElement, region, 40))) {
            insertObject(obj, 'Zindex', objects);
        }
    }
    return objects;
}


/** @private */
export function findActivePage(event: MouseEvent, pdfBase: PdfViewerBase): number {
    let activePageID: number = undefined;
    if (event.target && (event.target as PdfAnnotationBaseModel).wrapper) {
        return (event.target as PdfAnnotationBaseModel).pageIndex;
    }
    if (event.target) {
        let elementIdColl: string[] = (event.target as HTMLElement).id.split('_');
        if (elementIdColl.length > 0) {
            // tslint:disable-next-line:radix
            activePageID = parseInt(elementIdColl[elementIdColl.length - 1]);
        }
    }
    return activePageID;
}
/**
 * @hidden
 */
export class ActiveElements {

    private activePage: number = undefined;
    /** @private */
    public get activePageID(): number {
        return this.activePage;
    }

    /** @private */
    public set activePageID(offset: number) {
        this.activePage = offset;
        // tslint:disable-next-line
        if (offset !== this.activePage) { }
    }

    constructor() {
        this.activePageID = undefined;
    }
}