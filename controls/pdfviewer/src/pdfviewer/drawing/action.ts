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
    // eslint-disable-next-line
    } else if (event && event.target &&  (event as any).path && event.target.parentElement && event.target.parentElement.classList.contains('foreign-object')) {
        // eslint-disable-next-line
        const targetParentRect: ClientRect = (event as any).path[4].getBoundingClientRect();
        offsetX = (event as PointerEvent).clientX - targetParentRect.left;
        offsetY = (event as PointerEvent).clientY - targetParentRect.top;
    } else if (event.target && (event.target as HTMLElement).parentElement && (event.target as HTMLElement).parentElement.classList.contains('foreign-object')) {
        // eslint-disable-next-line
        const targetParentRect: ClientRect = (event.target as any).offsetParent.offsetParent.offsetParent.getBoundingClientRect();
        offsetX = (event as PointerEvent).clientX - targetParentRect.left;
        offsetY = (event as PointerEvent).clientY - targetParentRect.top;
        // eslint-disable-next-line
    }
    else if (event.target && (event.target as HTMLElement).parentElement && (event.target as HTMLElement).parentElement.parentElement && (event.target as HTMLElement).parentElement.parentElement.classList.contains('foreign-object')) {
        // eslint-disable-next-line
        const targetParentRect = (event.target as any).offsetParent.offsetParent.offsetParent.offsetParent.getBoundingClientRect();
        offsetX = event.clientX - targetParentRect.left;
        offsetY = event.clientY - targetParentRect.top;
        // eslint-disable-next-line
    }
    else {
        offsetX = !isNaN(event.offsetX) ? event.offsetX : (event.position ? event.position.x : 0);
        offsetY = !isNaN(event.offsetY) ? event.offsetY : (event.position ? event.position.y : 0);
    }
    const offsetForSelector: number = pdfViewer.touchPadding;
    let boundsDiff: number = 0;
    for (let i: number = 0; i < objects.length; i++) {
        if (!(objects[i].shapeAnnotationType === 'Distance' || objects[i].shapeAnnotationType === 'Line' || objects[i].shapeAnnotationType === 'LineWidthArrowHead' || pdfBase.tool instanceof LineTool)) {
            const bounds: PdfBoundsModel = objects[i].wrapper.bounds;
            let rotationValue: number = 0;
            if (objects[i].shapeAnnotationType === 'Stamp' || objects[i].shapeAnnotationType === 'Image') {
                rotationValue = 25;
            }
            // eslint-disable-next-line max-len
            if ((((bounds.x - offsetForSelector) * pdfBase.getZoomFactor()) < offsetX) && (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) > offsetX) &&
                // eslint-disable-next-line max-len
                (((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor()) < offsetY) && (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) > offsetY)) {
                if (pdfBase.tool instanceof NodeDrawingTool || pdfBase.tool instanceof StampTool) {
                    actualTarget = objects[i];
                } else {
                    if (!boundsDiff) {
                        actualTarget = objects[i];
                        // eslint-disable-next-line max-len
                        boundsDiff = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) + (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                        // eslint-disable-next-line max-len
                        (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) + (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                    } else {
                        // eslint-disable-next-line max-len
                        const objectBounds: number = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) + (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                        // eslint-disable-next-line max-len
                        (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) + (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                        if (boundsDiff > objectBounds) {
                            actualTarget = objects[i];
                            boundsDiff = objectBounds;
                        } else if (boundsDiff === objectBounds) {
                            actualTarget = objects[i];
                            boundsDiff = objectBounds;
                        } else if ((objects[i].shapeAnnotationType === "Image") || (objects[i].shapeAnnotationType === "Stamp")) {
                            actualTarget = objects[i];
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
 * @private
 * @param {any} selector - Specified the annotaion selctor.
 * @param {any} currentobject - Specified the current annotaion object.
 * @returns {any} - Returns the leader points.
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
 * @param {Object[]} collection - Specified the annotation collection.
 * @returns {void}
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
 * @private
 * @param {Container} container - Specified the annotaion container.
 * @param {PointModel} position - Specified the annotation position.
 * @param {number} padding - Specified the annotaion padding value.
 * @returns {DrawingElement} - Returns the annotation drawing element.
 */
export function findTargetShapeElement(container: Container, position: PointModel, padding?: number): DrawingElement {
    if (container && container.children) {
        for (let i: number = container.children.length - 1; i >= 0; i--) {
            const shapeElement: DrawingElement = container.children[i];
            let touchPadding = padding;
            // eslint-disable-next-line
            if (!isNullOrUndefined((shapeElement as any).children) && (shapeElement as any).children.length > 0) {
                // eslint-disable-next-line
                for (let j: number = (shapeElement as any).children.length - 1; j >= 0; j--) {
                    // eslint-disable-next-line
                    let currentTarget: any = (shapeElement as any).children[j];
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
        let element: Container = container;
        let paddingValue: number = 10;
        let rotateThumbDistance: number = 30;
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.parentTransform, element.offsetX, element.offsetY);
        let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
        let y: number = element.offsetY - element.pivot.y * element.actualSize.height;
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
 * @returns {PdfAnnotationBaseModel[]} - Returns the annotation object collections.
 */
export function findObjects(region: PointModel, objCollection: (PdfAnnotationBaseModel)[], touchPadding : number): (PdfAnnotationBaseModel)[] {
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
 * @param {PdfViewerBase} pdfBase - Specified the pdfBase element.
 * @returns {number} - Returns the active page Id.
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
        // eslint-disable-next-line
        if (offset !== this.activePage) { }
    }

    constructor() {
        this.activePageID = undefined;
    }
}
