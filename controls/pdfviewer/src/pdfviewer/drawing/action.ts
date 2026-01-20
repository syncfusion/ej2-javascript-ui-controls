import { contains, IElement } from '@syncfusion/ej2-drawings';
import { PointModel } from '@syncfusion/ej2-drawings';
import { Rect } from '@syncfusion/ej2-drawings';
import { DrawingElement , Point, Matrix, identityMatrix, rotateMatrix} from '@syncfusion/ej2-drawings';
import { Container, transformPointByMatrix } from '@syncfusion/ej2-drawings';
import { PdfViewerBase, PdfViewer } from '../index';
import { PdfAnnotationBaseModel, PdfBoundsModel } from './pdf-annotation-model';
import { ZOrderPageTable } from './pdf-annotation';
import { isPointOverConnector } from './connector-util';
import { LineTool, NodeDrawingTool, StampTool } from './tools';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * @private
 * @param {MouseEvent | TouchEvent} event - Specified the annotaion event.
 * @param {PdfViewerBase} pdfBase - Specified the pdfviewer base element.
 * @param {PdfViewer} pdfViewer - Specified the pdfviewer element.
 * @param {boolean} isOverlapped - Specified the overlapped element or not.
 * @returns {any} - Returns the active element.
 */
export function findActiveElement(event: MouseEvent | TouchEvent, pdfBase: PdfViewerBase, pdfViewer: PdfViewer,
                                  isOverlapped?: boolean): any {
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
 * @private
 * @param {PdfViewerBase} pdfBase - Specified the pdfviewer base element.
 * @param {PdfViewer} pdfViewer - Specified the pdfviewer element.
 * @param {MouseEvent} event - Specified the annotaion event.
 * @returns {IElement[]} - Returns the annotaion elements.
 */
export function findObjectsUnderMouse(
    pdfBase: PdfViewerBase, pdfViewer: PdfViewer, event: MouseEvent): IElement[] {
    let pt: PointModel = pdfBase.currentPosition || { x: event.offsetX, y: event.offsetY };
    pt = { x: pt.x / pdfBase.getZoomFactor(), y: pt.y / pdfBase.getZoomFactor() };
    const pageTable: ZOrderPageTable = pdfViewer.getPageTable(pdfBase.activeElements.activePageID);
    const objArray: Object[] = findObjects(pt, pageTable.objects, pdfViewer.touchPadding);
    return objArray as IElement[];
}

/**
 * @private
 * @param {PdfAnnotationBaseModel[]} objects - Specified the annotaion object model.
 * @param {any} event - Specified the annotaion event.
 * @param {PdfViewerBase} pdfBase - Specified the pdfviewer base element.
 * @param {PdfViewer} pdfViewer - Specified the pdfviewer element.
 * @returns {IElement} - Returns the annotaion element.
 */
export function findObjectUnderMouse(
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
                const pageCurrentRect: DOMRect =
                    pageDiv.getBoundingClientRect() as DOMRect;

                offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
            }
        }

    } else if (event && event.target &&  (event as any).path && event.target.parentElement && event.target.parentElement.classList.contains('foreign-object')) {
        const targetParentRect: DOMRect = (event as any).path[4].getBoundingClientRect();
        offsetX = (event as PointerEvent).clientX - targetParentRect.left;
        offsetY = (event as PointerEvent).clientY - targetParentRect.top;
    } else if (event.target && (event.target as HTMLElement).parentElement && (event.target as HTMLElement).parentElement.classList.contains('foreign-object')) {
        const targetParentRect: DOMRect = (event.target as any).offsetParent.offsetParent.offsetParent.getBoundingClientRect();
        offsetX = (event as PointerEvent).clientX - targetParentRect.left;
        offsetY = (event as PointerEvent).clientY - targetParentRect.top;
    }
    else if (event.target && (event.target as HTMLElement).parentElement && (event.target as HTMLElement).parentElement.parentElement && (event.target as HTMLElement).parentElement.parentElement.classList.contains('foreign-object')) {
        let targetParentRect: DOMRect;
        if (event.target.offsetParent && event.target.offsetParent.offsetParent &&
             event.target.offsetParent.offsetParent.offsetParent && event.target.offsetParent.offsetParent.offsetParent.offsetParent){
            targetParentRect = event.target.offsetParent.offsetParent.offsetParent.offsetParent.getBoundingClientRect();
            offsetX = event.clientX - targetParentRect.left;
            offsetY = event.clientY - targetParentRect.top;
        }
        else if (event.target.parentElement.offsetParent && event.target.parentElement.offsetParent.offsetParent){
            targetParentRect = event.target.parentElement.offsetParent.offsetParent.getBoundingClientRect();
            offsetX = event.clientX - targetParentRect.left;
            offsetY = event.clientY - targetParentRect.top;
        }
    }
    else {
        offsetX = !isNaN(event.offsetX) ? event.offsetX : (event.position ? event.position.x : 0);
        offsetY = !isNaN(event.offsetY) ? event.offsetY : (event.position ? event.position.y : 0);
    }
    //EJ2-63562 - Reduced the offset selector by half to improve selection of fields in mobile devices
    const offsetForSelector: number = pdfViewer.touchPadding / 2;
    let boundsDiff: number = 0;
    for (let i: number = 0; i < objects.length; i++) {
        if (!(objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Distance' || objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Line' || objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'LineWidthArrowHead' || pdfBase.tool instanceof LineTool)) {
            let bounds: PdfBoundsModel = objects[parseInt(i.toString(), 10)].wrapper.bounds;
            let target: boolean;
            const object: Container = objects[parseInt(i.toString(), 10)].wrapper;
            if (objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Polygon' &&
                objects[parseInt(i.toString(), 10)].enableShapeLabel) {
                for (let x: number = 0; x < object.children.length; x++) {
                    target = object.children[parseInt(x.toString(), 10)].
                        bounds.containsPoint(pdfBase.currentPosition, pdfViewer.touchPadding);
                    if (target) {
                        bounds = object.children[parseInt(x.toString(), 10)].bounds;
                        break;
                    }
                }
            }
            let rotationValue: number = 0;
            if (objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Stamp' || objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Image') {
                rotationValue = 25;
            }
            if ((((bounds.x - offsetForSelector) * pdfBase.getZoomFactor()) < offsetX) &&
             (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) > offsetX) &&
                (((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor()) < offsetY) &&
                 (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) > offsetY) ||
                ((((bounds.x - offsetForSelector) * pdfBase.getZoomFactor()) < pdfBase.currentPosition.x) &&
                    (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) > pdfBase.currentPosition.x) &&
                    (((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor()) < pdfBase.currentPosition.y) &&
                    (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) > pdfBase.currentPosition.y))) {
                if (pdfBase.tool instanceof NodeDrawingTool || pdfBase.tool instanceof StampTool) {
                    actualTarget = objects[parseInt(i.toString(), 10)];
                } else {
                    if (!boundsDiff) {
                        actualTarget = objects[parseInt(i.toString(), 10)];
                        boundsDiff = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) +
                         (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                        (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) +
                         (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                    } else {
                        const objectBounds: number = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) +
                         (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                        (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) +
                         (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                        if (boundsDiff > objectBounds) {
                            actualTarget = objects[parseInt(i.toString(), 10)];
                            boundsDiff = objectBounds;
                        } else if (boundsDiff === objectBounds) {
                            actualTarget = objects[parseInt(i.toString(), 10)];
                            boundsDiff = objectBounds;
                        } else if ((objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Image') || (objects[parseInt(i.toString(), 10)].shapeAnnotationType === 'Stamp')) {
                            actualTarget = objects[parseInt(i.toString(), 10)];
                        }
                    }
                }
            }
        } else {
            const pt: PointModel = { x: offsetX / pdfBase.getZoomFactor(), y: offsetY / pdfBase.getZoomFactor() };
            const obj: DrawingElement = findElementUnderMouse(objects[parseInt(i.toString(), 10)] as IElement, pt, offsetForSelector);
            let isOver: boolean = isPointOverConnector(objects[parseInt(i.toString(), 10)], pt);
            if (obj && !isOver) {
                const newpoint: PointModel = CalculateLeaderPoints(objects[parseInt(i.toString(), 10)], obj);
                if (newpoint) {
                    const rect: Rect = Rect.toBounds([newpoint, newpoint]);
                    rect.Inflate(10);
                    if (rect.containsPoint(pt)) {
                        isOver = true;
                    }
                }
            }
            if (obj && isOver) {
                actualTarget = objects[parseInt(i.toString(), 10)];
            }
        }
    }
    return actualTarget as IElement;
}
/**
 * @private
 * @param {any} selector - Specified the annotaion selctor.
 * @param {any} currentobject - Specified the current annotaion object.
 * @returns {any} - Returns the leader points.
 */
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
 * @private
 * @param {IElement} obj - Specified the annotation element.
 * @param {PointModel} position - Specified the annotation position value.
 * @param {number} padding - Specified the annotation padding.
 * @returns {DrawingElement} - Returns the annotation drawing element.
 */
export function findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DrawingElement {
    return findTargetShapeElement(obj.wrapper, position, padding);
}

/**
 * @private
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object model.
 * @param {string} key - Specified the annotation key value.
 * @param {object[]} collection - Specified the annotation collection.
 * @returns {void}
 */
export function insertObject(obj: PdfAnnotationBaseModel, key: string, collection: Object[]): void {
    if (collection.length === 0) {
        collection.push(obj);
    } else if (collection.length === 1) {
        if ((collection[0] as any)[`${key}`] > (obj as any)[`${key}`]) {
            collection.splice(0, 0, obj);
        } else {
            collection.push(obj);
        }
    } else if (collection.length > 1) {
        let low: number = 0;
        let high: number = collection.length - 1;
        let mid: number = Math.floor((low + high) / 2);
        while (mid !== low) {
            if ((collection[parseInt(mid.toString(), 10)] as any)[`${key}`] < (obj as any)[`${key}`]) {
                low = mid;
                mid = Math.floor((low + high) / 2);
            } else if ((collection[parseInt(mid.toString(), 10)] as any)[`${key}`] > (obj as any)[`${key}`]) {
                high = mid;
                mid = Math.floor((low + high) / 2);
            }
        }
        if ((collection[parseInt(high.toString(), 10)] as any)[`${key}`] < (obj as any)[`${key}`]) {
            collection.push(obj);
        } else if ((collection[parseInt(low.toString(), 10)] as any)[`${key}`] > (obj as any)[`${key}`]) {
            collection.splice(low, 0, obj);
        } else if (((collection[parseInt(low.toString(), 10)] as any)[`${key}`] < (obj as any)[`${key}`]) && (collection[parseInt(high.toString(), 10)] as any)[`${key}`] > (obj as any)[`${key}`]) {
            collection.splice(high, 0, obj);
        }
    }
}

/**
 * @private
 * @param {Container} container - Specified the annotaion container.
 * @param {PointModel} position - Specified the annotation position.
 * @param {number} padding - Specified the annotaion padding value.
 * @returns {DrawingElement} - Returns the annotation drawing element.
 */
export function findTargetShapeElement(container: Container, position: PointModel, padding?: number): DrawingElement {
    if (container && container.children) {
        for (let i: number = container.children.length - 1; i >= 0; i--) {
            const shapeElement: DrawingElement = container.children[parseInt(i.toString(), 10)];
            const touchPadding: number = padding;
            if (!isNullOrUndefined((shapeElement as any).children) && (shapeElement as any).children.length > 0) {
                for (let j: number = (shapeElement as any).children.length - 1; j >= 0; j--) {
                    const currentTarget: any = (shapeElement as any).children[parseInt(j.toString(), 10)];
                    if (currentTarget && currentTarget.bounds.containsPoint(position, touchPadding)) {
                        if (currentTarget instanceof Container) {
                            const targetElement: DrawingElement = this.findTargetElement(currentTarget, position);
                            if (targetElement) {
                                return targetElement;
                            }
                        }
                        if (currentTarget.bounds.containsPoint(position, touchPadding)) {
                            return currentTarget;
                        }
                    }
                }
            } else {
                if (shapeElement && shapeElement.bounds.containsPoint(position, touchPadding)) {
                    if (shapeElement instanceof Container) {
                        const targetElement: DrawingElement = this.findTargetElement(shapeElement, position);
                        if (targetElement) {
                            return targetElement;
                        }
                    }
                    if (shapeElement.bounds.containsPoint(position, touchPadding)) {
                        return shapeElement;
                    }
                }
            }
        }
    }
    if (container && container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
        const element: Container = container;
        const paddingValue: number = 10;
        const rotateThumbDistance: number = 30;
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.parentTransform, element.offsetX, element.offsetY);
        const x: number = element.offsetX - element.pivot.x * element.actualSize.width;
        const y: number = element.offsetY - element.pivot.y * element.actualSize.height;
        let rotateThumb: PointModel = {
            x: x + ((element.pivot.x === 0.5 ? element.pivot.x * 2 : element.pivot.x) * element.actualSize.width / 2),
            y: y - rotateThumbDistance
        };
        rotateThumb = transformPointByMatrix(matrix, rotateThumb);
        if (contains(position, rotateThumb, paddingValue)) {
            return container;
        }
    }
    return null;
}

/**
 * @private
 * @param {PointModel} region - Specified the annotation region point model.
 * @param {PdfAnnotationBaseModel[]} objCollection - Specified the annotation object collections.
 * @param {number} touchPadding - touchPadding
 * @returns {PdfAnnotationBaseModel[]} - Returns the annotation object collections.
 */
export function findObjects(region: PointModel, objCollection: (PdfAnnotationBaseModel)[],
                            touchPadding : number): (PdfAnnotationBaseModel)[] {
    const objects: (PdfAnnotationBaseModel)[] = [];
    for (const obj of objCollection) {
        if (findElementUnderMouse(obj as IElement, region, touchPadding)  || ((obj.shapeAnnotationType === 'Stamp') && findElementUnderMouse(obj as IElement, region, 40))) {
            insertObject(obj, 'zIndex', objects);
        }
    }
    return objects;
}

/**
 * @private
 * @param {MouseEvent} event - Specified the annotaion mouse event.
 * @returns {number} - Returns the active page Id.
 */
export function findActivePage(event: MouseEvent): number {
    let activePageID: number = undefined;
    if (event.target && (event.target as PdfAnnotationBaseModel).wrapper) {
        return (event.target as PdfAnnotationBaseModel).pageIndex;
    }
    if (event.target) {
        const elementIdColl: string[] = (event.target as HTMLElement).id.split('_');
        if (elementIdColl.length > 0) {
            activePageID = parseInt(elementIdColl[elementIdColl.length - 1], 10);
        }
    }
    return activePageID;
}
/**
 * @hidden
 */
export class ActiveElements {
    private activePage: number = undefined;
    /**
     * @private
     * @returns {number} - Returns the active page Id.
     */
    public get activePageID(): number {
        return this.activePage;
    }

    /**
     * @private
     * @param {number} offset - The page offset value.
     */
    public set activePageID(offset: number) {
        this.activePage = offset;
    }
    constructor() {
        this.activePageID = undefined;
    }
}
