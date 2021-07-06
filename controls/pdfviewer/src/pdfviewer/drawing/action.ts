/* eslint-disable */
import { IElement } from '@syncfusion/ej2-drawings';
import { PointModel } from '@syncfusion/ej2-drawings';
import { Rect } from '@syncfusion/ej2-drawings';
import { DrawingElement , Point, Matrix, identityMatrix, rotateMatrix} from '@syncfusion/ej2-drawings';
import { Container, transformPointByMatrix } from '@syncfusion/ej2-drawings';
import { PdfViewerBase, PdfViewer } from '../index';
import { PdfAnnotationBaseModel, PdfBoundsModel } from './pdf-annotation-model';
import { ZOrderPageTable } from './pdf-annotation';
import { isPointOverConnector } from './connector-util';
import { LineTool, NodeDrawingTool } from './tools';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * @param event
 * @param pdfBase
 * @param pdfViewer
 * @param isOverlapped
 * @private
 */
// eslint-disable-next-line
export function findActiveElement(event: MouseEvent | TouchEvent, pdfBase: PdfViewerBase, pdfViewer: PdfViewer, isOverlapped?: boolean): any {
    if (pdfViewer && pdfBase.activeElements.activePageID > -1) {
        const objects: IElement[] = findObjectsUnderMouse(pdfBase, pdfViewer, event as MouseEvent);
        const object: IElement = findObjectUnderMouse(objects, event, pdfBase, pdfViewer);
        if (isOverlapped) {
            return objects;
        }
        return object;
    }
    return undefined;
}

/**
 * @param pdfBase
 * @param pdfViewer
 * @param event
 * @param pdfBase
 * @param pdfViewer
 * @param event
 * @private
 */
export function findObjectsUnderMouse(
    pdfBase: PdfViewerBase, pdfViewer: PdfViewer, event: MouseEvent): IElement[] {
    const actualTarget: IElement[] = [];
    let bounds: Rect;
    // eslint-disable-next-line
    let pt: PointModel = pdfBase.currentPosition || { x: event.offsetX, y: event.offsetY };
    pt = { x: pt.x / pdfBase.getZoomFactor(), y: pt.y / pdfBase.getZoomFactor() };
    const pageTable: ZOrderPageTable = pdfViewer.getPageTable(pdfBase.activeElements.activePageID);
    const objArray: Object[] = findObjects(pt, pageTable.objects);
    return objArray as IElement[];
}

/**
 * @param objects
 * @param event
 * @param pdfBase
 * @param pdfViewer
 * @private
 */
export function findObjectUnderMouse(
    // eslint-disable-next-line
    objects: (PdfAnnotationBaseModel)[], event: any, pdfBase: PdfViewerBase, pdfViewer: PdfViewer
): IElement {
    let actualTarget: PdfAnnotationBaseModel = null;
    let touchArg: TouchEvent;
    let offsetX: number;
    let offsetY: number;
    if (event && event.type && event.type.indexOf('touch') !== -1) {
        touchArg = <TouchEvent & PointerEvent>event;
        if (pdfViewer.annotation) {
            const pageDiv: HTMLElement = pdfBase.getElement('_pageDiv_' + pdfViewer.annotation.getEventPageNumber(event));
            if (pageDiv) {
                const pageCurrentRect: ClientRect =
                    pageDiv.getBoundingClientRect();

                offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
            }
        }
    } else if(event && event.target &&  (event as any).path && event.target.parentElement && event.target.parentElement.classList.contains("foreign-object")){
        const targetParentRect: ClientRect = (event as any).path[4].getBoundingClientRect();
        offsetX = (event as PointerEvent).clientX - targetParentRect.left;
        offsetY = (event as PointerEvent).clientY - targetParentRect.top;
    } else {
        offsetX = !isNaN(event.offsetX) ? event.offsetX : (event.position ? event.position.x : 0);
        offsetY = !isNaN(event.offsetY) ? event.offsetY : (event.position ? event.position.y : 0);
    }
    const offsetForSelector: number = 5;
    let boundsDiff: number = 0;
    for (let i: number = 0; i < objects.length; i++) {
        // eslint-disable-next-line max-len
        if (!(objects[i].shapeAnnotationType === 'Distance' || objects[i].shapeAnnotationType === 'Line' || objects[i].shapeAnnotationType === 'LineWidthArrowHead' || pdfBase.tool instanceof LineTool)) {
            const bounds: PdfBoundsModel = objects[i].wrapper.bounds;
            let rotationValue: number = 0;
            if (objects[i].shapeAnnotationType === 'Stamp' || objects[i].shapeAnnotationType === 'Image') {
                rotationValue = 25;
            }
            // eslint-disable-next-line max-len
            if ((((bounds.x - offsetForSelector) * pdfBase.getZoomFactor()) < offsetX) && (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) > offsetX) &&
                (((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor()) < offsetY) && (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) > offsetY)) {
                if (pdfBase.tool instanceof NodeDrawingTool) {
                    actualTarget = objects[i];
                } else {
                    if (!boundsDiff) {
                        actualTarget = objects[i];
                        // eslint-disable-next-line max-len
                        boundsDiff = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) + (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                        (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) + (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                    } else {
                        // eslint-disable-next-line max-len
                        const objectBounds: number = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) + (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                        (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) + (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                        if (boundsDiff > objectBounds) {
                            actualTarget = objects[i];
                            boundsDiff = objectBounds;
                        }
                    }
                }
            }
        } else {
            const pt: PointModel = { x: offsetX / pdfBase.getZoomFactor(), y: offsetY / pdfBase.getZoomFactor() };
            const obj: DrawingElement = findElementUnderMouse(objects[i] as IElement, pt, offsetForSelector);
            let isOver: boolean = isPointOverConnector(objects[i], pt);
            if (obj && !isOver) {
                const newpoint: PointModel = CalculateLeaderPoints(objects[i], obj);
                if (newpoint) {
                    const rect: Rect = Rect.toBounds([newpoint, newpoint]);
                    rect.Inflate(10);
                    if (rect.containsPoint(pt)) {
                        isOver = true;
                    }
                }
            }
            if (obj && isOver) {
                actualTarget = objects[i];
            }
        }
    }
    return actualTarget as IElement;
}
/**
 * @param selector
 * @param currentobject
 * @private
 */
// eslint-disable-next-line
export function CalculateLeaderPoints(selector: any, currentobject: any): any {
    const leaderCount: number = 0;
    const sourcePoint: PointModel = selector.sourcePoint;
    const targetPoint: PointModel = selector.targetPoint;
    if (selector.shapeAnnotationType === 'Distance') {
        const segment: DrawingElement = currentobject;
        let newPoint1: PointModel;
        const angle: number = Point.findAngle(selector.sourcePoint, selector.targetPoint);
        if (segment.id.indexOf('leader') > -1) {
            let center: PointModel = selector.wrapper.children[0].bounds.center;
            if (leaderCount === 0 && segment.id.indexOf('leader1') > -1) {
                newPoint1 = { x: selector.sourcePoint.x, y: selector.sourcePoint.y - selector.leaderHeight };
                center = sourcePoint;
            } else {
                newPoint1 = { x: selector.targetPoint.x, y: selector.targetPoint.y - selector.leaderHeight };
                center = targetPoint;

            }
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, angle, center.x, center.y);
            const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
            return rotatedPoint;
        }
    }
}
/**
 * @param obj
 * @param position
 * @param padding
 * @private
 */
export function findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DrawingElement {
    return findTargetShapeElement(obj.wrapper, position, padding);
}
/**
 * @param obj
 * @param key
 * @param collection
 * @param obj
 * @param key
 * @param collection
 * @private
 */
export function insertObject(obj: PdfAnnotationBaseModel, key: string, collection: Object[]): void {
    if (collection.length === 0) {
        collection.push(obj);
    } else if (collection.length === 1) {
        // eslint-disable-next-line
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
            // eslint-disable-next-line
            if ((collection[mid] as any)[key] < (obj as any)[key]) {
                low = mid;
                mid = Math.floor((low + high) / 2);
                // eslint-disable-next-line
            } else if ((collection[mid] as any)[key] > (obj as any)[key]) {
                high = mid;
                mid = Math.floor((low + high) / 2);
            }
        }
        // eslint-disable-next-line
        if ((collection[high] as any)[key] < (obj as any)[key]) {
            collection.push(obj);
            // eslint-disable-next-line
        } else if ((collection[low] as any)[key] > (obj as any)[key]) {
            collection.splice(low, 0, obj);
            // eslint-disable-next-line
        } else if (((collection[low] as any)[key] < (obj as any)[key]) && (collection[high] as any)[key] > (obj as any)[key]) {
            collection.splice(high, 0, obj);
        }
    }
}

/**
 * @param container
 * @param position
 * @param padding
 * @param container
 * @param position
 * @param padding
 * @param container
 * @param position
 * @param padding
 * @private
 */
export function findTargetShapeElement(container: Container, position: PointModel, padding?: number): DrawingElement {
    if (container && container.children) {
        for (let i: number = container.children.length - 1; i >= 0; i--) {
            const shapeElement: DrawingElement = container.children[i];
            if (!isNullOrUndefined((shapeElement as any).children) && (shapeElement as any).children.length > 0) {
                for (let j: number = (shapeElement as any).children.length - 1; j >= 0; j--) {
                    let currentTarget: any = (shapeElement as any).children[j];
                    if (currentTarget && currentTarget.bounds.containsPoint(position, 10)) {
                        if (currentTarget instanceof Container) {
                            const targetElement: DrawingElement = this.findTargetElement(currentTarget, position);
                            if (targetElement) {
                                return targetElement;
                            }
                        }
                        if (currentTarget.bounds.containsPoint(position, 10)) {
                            return currentTarget;
                        }
                    }
                }
            } else {
                if (shapeElement && shapeElement.bounds.containsPoint(position, 10)) {
                    if (shapeElement instanceof Container) {
                        const targetElement: DrawingElement = this.findTargetElement(shapeElement, position);
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
    }
    if (container && container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
        return container;
    }
    return null;
}

/**
 * @param region
 * @param objCollection
 * @param region
 * @param objCollection
 * @private
 */
export function findObjects(region: PointModel, objCollection: (PdfAnnotationBaseModel)[]): (PdfAnnotationBaseModel)[] {
    const objects: (PdfAnnotationBaseModel)[] = [];
    for (const obj of objCollection) {
        // eslint-disable-next-line max-len
        if (findElementUnderMouse(obj as IElement, region, 10)  || ((obj.shapeAnnotationType === 'Stamp' || obj.shapeAnnotationType === 'Image') && findElementUnderMouse(obj as IElement, region, 40))) {
            insertObject(obj, 'zIndex', objects);
        }
    }
    return objects;
}


/**
 * @param event
 * @param pdfBase
 * @private
 */
export function findActivePage(event: MouseEvent, pdfBase: PdfViewerBase): number {
    let activePageID: number = undefined;
    if (event.target && (event.target as PdfAnnotationBaseModel).wrapper) {
        return (event.target as PdfAnnotationBaseModel).pageIndex;
    }
    if (event.target) {
        const elementIdColl: string[] = (event.target as HTMLElement).id.split('_');
        if (elementIdColl.length > 0) {
            // eslint-disable-next-line radix
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
        // eslint-disable-next-line
        if (offset !== this.activePage) { }
    }

    constructor() {
        this.activePageID = undefined;
    }
}
