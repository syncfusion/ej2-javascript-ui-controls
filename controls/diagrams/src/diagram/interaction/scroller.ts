import { IElement } from '../objects/interface/IElement';
import { Diagram } from '../diagram';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { FitModes, DiagramRegions, RealAction, ScrollActions } from '../enum/enum';
import { Matrix, identityMatrix, scaleMatrix, translateMatrix, transformPointByMatrix, multiplyMatrix } from '../primitives/matrix';
import { MarginModel } from '../core/appearance-model';
import { IFitOptions } from '../objects/interface/interfaces';
import { updateRuler } from '../ruler/ruler';
import { canZoom, canPan, canVitualize } from './../utility/constraints-util';
import { NodeModel } from '../objects/node-model';
import { ConnectorModel } from '../objects/connector-model';
import { Overview, OverviewModel } from '../../overview';
/**
 */
export class DiagramScroller {
    /** @private */
    public transform: TransformFactor = { tx: 0, ty: 0, scale: 1 };
    /**   @private  */
    public oldCollectionObjects: string[] = [];
    /**   @private  */
    public removeCollection: string[] = [];
    private diagram: Diagram;
    private objects: IElement[];
    private vPortWidth: number = 0;
    private vPortHeight: number = 0;
    private currentZoomFActor: number = 1;
    private hOffset: number = 0;
    private vOffset: number = 0;
    private scrolled: boolean = false;
    /**
     * verticalOffset method \
     *
     * @returns { number }     verticalOffset method .\
     *
     * @private
     */
    public get viewPortHeight(): number {
        return this.vPortHeight;
    }

    /**
     * verticalOffset method \
     *
     * @returns { void }     verticalOffset method .\
     * @param {number} offset - provide the hOffset value.
     *
     * @private
     */
    public set viewPortHeight(offset: number) {
        this.vPortHeight = offset;
        this.diagram.scrollSettings.viewPortHeight = offset;
    }
    /**
     * verticalOffset method \
     *
     * @returns { number }     verticalOffset method .\
     *
     * @private
     */
    public get currentZoom(): number {
        return this.currentZoomFActor;
    }

    /**
     * verticalOffset method \
     *
     * @returns { void }     verticalOffset method .\
     * @param {number} offset - provide the hOffset value.
     *
     * @private
     */
    public set currentZoom(offset: number) {
        this.currentZoomFActor = offset;
        this.diagram.scrollSettings.currentZoom = offset;
    }
    /**
     * verticalOffset method \
     *
     * @returns { number }     verticalOffset method .\
     *
     * @private
     */
    public get viewPortWidth(): number {
        return this.vPortWidth;
    }

    /**
     * verticalOffset method \
     *
     * @returns { void }     verticalOffset method .\
     * @param {number} offset - provide the hOffset value.
     *
     * @private
     */
    public set viewPortWidth(offset: number) {
        this.vPortWidth = offset;
        this.diagram.scrollSettings.viewPortWidth = offset;
    }

    /**
     * verticalOffset method \
     *
     * @returns { number }     verticalOffset method .\
     *
     * @private
     */
    public get horizontalOffset(): number {
        return this.hOffset;
    }

    /**
     * verticalOffset method \
     *
     * @returns { void }     verticalOffset method .\
     * @param {number} offset - provide the hOffset value.
     *
     * @private
     */
    public set horizontalOffset(offset: number) {
        this.hOffset = offset;
        if (Math.abs(this.hOffset - this.diagram.scrollSettings.horizontalOffset) > 1) {
            this.diagram.realActions = this.diagram.realActions | RealAction.hScrollbarMoved;
            this.scrolled = true;
        }
        this.diagram.scrollSettings.horizontalOffset = offset;
    }

    /**
     * verticalOffset method \
     *
     * @returns { number }     verticalOffset method .\
     *
     * @private
     */
    public get verticalOffset(): number {
        return this.vOffset;
    }

    /**
     * verticalOffset method \
     *
     * @returns { void }     verticalOffset method .\
     * @param {number} offset - provide the hOffset value.
     *
     * @private
     */
    public set verticalOffset(offset: number) {
        this.vOffset = offset;
        if (Math.abs(this.vOffset - this.diagram.scrollSettings.verticalOffset) > 1) {
            this.diagram.realActions = this.diagram.realActions | RealAction.vScrollbarMoved;
            this.scrolled = true;
        }
        this.diagram.scrollSettings.verticalOffset = offset;
    }

    private diagramWidth: number;

    private diagramHeight: number;
    /** @private */
    public scrollerWidth: number;
    private hScrollSize: number = 0;
    private vScrollSize: number = 0;

    constructor(diagram: Diagram) {
        this.diagram = diagram;
        this.objects = [];
        this.transform = diagram.scroller ? diagram.scroller.transform : { tx: 0, ty: 0, scale: 1 };
        this.vPortWidth = diagram.scrollSettings.viewPortWidth;
        this.vPortHeight = diagram.scrollSettings.viewPortHeight;
        this.currentZoomFActor = diagram.scrollSettings.currentZoom;
        this.hOffset = diagram.scrollSettings.horizontalOffset;
        this.vOffset = diagram.scrollSettings.verticalOffset;
    }

    // Method added to get bounds value if diagram is loaded from negative axis.
    // SF-359118 implemented for this ticket requirement.
    private getBounds(): Rect {
        let pageBounds: Rect;
        const postion: Rect = this.diagram.spatialSearch.getPageBounds(0, 0);
        if ((postion.x < 0 || postion.y < 0) && !this.diagram.pageSettings.multiplePage) {
            pageBounds = this.getPageBounds(undefined, undefined, true, true);
        } else {
            pageBounds = this.getPageBounds(undefined, undefined, true);
        }
        return pageBounds;
    }

    /**
     * updateScrollOffsets method \
     *
     * @returns { void }     updateScrollOffsets method .\
     * @param {number} hOffset - provide the hOffset value.
     * @param {number} vOffset - provide the vOffset value.
     *
     * @private
     */
    public updateScrollOffsets(hOffset?: number, vOffset?: number): void {
        let offsetX: number = 0;
        let offsetY: number = 0;
        const pageBounds: Rect = this.getBounds();
        pageBounds.x *= this.currentZoom;
        pageBounds.y *= this.currentZoom;
        pageBounds.width *= this.currentZoom;
        pageBounds.height *= this.currentZoom;

        offsetX = Math.max(0, hOffset - pageBounds.left);
        offsetY = Math.max(0, vOffset - pageBounds.top);
        if (hOffset !== undefined && vOffset !== undefined) {
            this.horizontalOffset = offsetX;
            this.verticalOffset = offsetY;
            this.diagram.setOffset(offsetX, offsetY);
        } else {
            this.diagram.setOffset(-this.horizontalOffset - pageBounds.x, -this.verticalOffset - pageBounds.y);
        }
        this.transform = {
            tx: Math.max(this.horizontalOffset, -pageBounds.left) / this.currentZoom, ty:
                Math.max(this.verticalOffset, -pageBounds.top) / this.currentZoom,
            scale: this.currentZoom
        };
    }
    /**
     * setScrollOffset method \
     *
     * @returns { void }     setScrollOffset method .\
     * @param {number} hOffset - provide the hOffset value.
     * @param {number} vOffset - provide the vOffset value.
     *
     * @private
     */
    public setScrollOffset(hOffset: number, vOffset: number): void {
        this.scrolled = false;
        const pageBounds: Rect = this.getBounds();
        pageBounds.x *= this.currentZoom;
        pageBounds.y *= this.currentZoom;
        pageBounds.width *= this.currentZoom;
        pageBounds.height *= this.currentZoom;

        const x: number = - pageBounds.left;
        const y: number = - pageBounds.top;
        let set: boolean = false;
        const viewWidth: number = this.viewPortWidth * this.currentZoom;
        const viewHeight: number = this.viewPortHeight * this.currentZoom;
        const newX: number = x - hOffset;
        if (newX !== this.horizontalOffset) {
            if (x < this.horizontalOffset) {
                if (this.horizontalOffset > newX) {
                    this.horizontalOffset -= hOffset;
                } else {
                    this.horizontalOffset = newX;
                }
                set = true;
            }
            const right: number = Math.max(pageBounds.right + this.vScrollSize, viewWidth);
            if (!set && right < -newX + this.viewPortWidth) {
                const actualRight: number = -newX + viewWidth - this.vScrollSize;
                const currentRight: number = -this.horizontalOffset + viewWidth - this.vScrollSize;
                if (actualRight < currentRight) {
                    //define
                    this.horizontalOffset = newX;
                } else {
                    if (actualRight - pageBounds.right > actualRight - currentRight) {
                        this.horizontalOffset = newX;
                    } else {
                        this.horizontalOffset = -(pageBounds.right + this.vScrollSize - viewWidth);
                    }
                }
                set = true;
            }
            if (!set) {
                this.horizontalOffset = x - hOffset;
            }
        }
        set = false;
        //vertical offset
        const newY: number = y - vOffset;
        if (newY !== this.verticalOffset) {
            if (y < this.verticalOffset) {
                if (this.verticalOffset > newY) {
                    this.verticalOffset -= vOffset;
                } else {
                    this.verticalOffset = newY;
                }
                set = true;
            }
            const bottom: number = Math.max(pageBounds.bottom + this.hScrollSize, viewHeight);
            if (!set && bottom < -newY + viewHeight) {
                const actualBottom: number = -newY + viewHeight - this.hScrollSize;
                const currentBottom: number = -this.verticalOffset + viewHeight - this.hScrollSize;
                if (actualBottom < currentBottom) {
                    //define
                    this.verticalOffset = newY;
                } else {
                    if (actualBottom - pageBounds.bottom > actualBottom - currentBottom) {
                        this.verticalOffset = newY;
                    } else {
                        this.verticalOffset = -(pageBounds.bottom + this.hScrollSize - viewHeight);
                    }
                }
                set = true;
            }
            if (!set) {
                this.verticalOffset = y - vOffset;
            }
        }

        this.transform = {
            tx: Math.max(this.horizontalOffset, -pageBounds.left) / this.currentZoom, ty:
                Math.max(this.verticalOffset, -pageBounds.top) / this.currentZoom,
            scale: this.currentZoom
        };
        this.setSize();
    }

    /**
     * getObjects \
     *
     * @returns { string[] }     To get page pageBounds.\
     * @param {string[]} coll1 - provide the source value.
     * @param {string[]} coll2 - provide the source value.
     * @private
     */
    public getObjects(coll1: string[], coll2: string[]): string[] {
        const objects: string[] = [];
        for (let i: number = 0; i < coll1.length; i++) {
            let isExist: boolean = false;
            for (let j: number = 0; j < coll2.length; j++) {
                if (coll1[parseInt(i.toString(), 10)] === coll2[parseInt(j.toString(), 10)]) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                objects.push(coll1[parseInt(i.toString(), 10)]);
            }
        }
        return objects;
    }

    /**
     * virtualizeElements \
     *
     * @returns { void }     To get page pageBounds.\
     *
     * @private
     */
    public virtualizeElements(): void {
        const viewWidth: number = this.viewPortWidth / this.currentZoom;
        const viewHeight: number = this.viewPortHeight / this.currentZoom;
        const oObjects: (NodeModel | ConnectorModel)[] = this.diagram.spatialSearch.findObjects(
            new Rect(-this.horizontalOffset / this.currentZoom, -this.verticalOffset / this.currentZoom, viewWidth, viewHeight)
        );
        let oObjectsID: string[] = [];
        const renderOrder: string[] = [];

        for (let j: number = 0; j < oObjects.length; j++) {
            const bpmnShape: any = oObjects[parseInt(j.toString(), 10)].shape;
            if (bpmnShape.type === 'Bpmn' && bpmnShape && bpmnShape.activity && bpmnShape.activity.subProcess && bpmnShape.activity.subProcess.processes && bpmnShape.activity.subProcess.processes.length > 0) {
                for (let k: number = 0; k < bpmnShape.activity.subProcess.processes.length; k++) {
                    renderOrder.push(bpmnShape.activity.subProcess.processes[parseInt(k.toString(), 10)]);
                }
                renderOrder.push(oObjects[parseInt(j.toString(), 10)].id);
            } else if ((oObjects[parseInt(j.toString(), 10)] as any).processId === '' || (oObjects[parseInt(j.toString(), 10)] as any).processId === undefined) {
                renderOrder.push(oObjects[parseInt(j.toString(), 10)].id);
            }
        }

        oObjectsID = renderOrder;

        const zindexOrder: string[] = [];

        for (let j: number = 0; j < oObjects.length; j++) {
            const items: any = oObjects[parseInt(j.toString(), 10)].shape;
            if (items.type === 'Bpmn' && items && items.activity && items.activity.subProcess && items.activity.subProcess.processes && items.activity.subProcess.processes.length > 0) {
                zindexOrder.push(oObjects[parseInt(j.toString(), 10)].id);
                for (let t: number = 0; t < items.activity.subProcess.processes.length; t++) {
                    zindexOrder.push(items.activity.subProcess.processes[parseInt(t.toString(), 10)]);
                }
            } else if ((oObjects[parseInt(j.toString(), 10)] as any).processId === '' || (oObjects[parseInt(j.toString(), 10)] as any).processId === undefined) {
                zindexOrder.push(oObjects[parseInt(j.toString(), 10)].id);
            }
        }

        for (let j: number = 0; j < oObjects.length; j++) {
            for (let k: number = 0; k < zindexOrder.length; k++) {
                if (oObjects[parseInt(j.toString(), 10)].id === zindexOrder[parseInt(k.toString(), 10)]) {
                    oObjects[parseInt(j.toString(), 10)].zIndex = k;
                    break;
                }
            }
        }

        const newObjects: string[] = this.getObjects(oObjectsID, this.oldCollectionObjects);
        if (this.oldCollectionObjects.length === 0) {
            this.oldCollectionObjects = oObjectsID;
        }
        const removeObjects: string[] = this.getObjects(this.oldCollectionObjects, oObjectsID);
        this.diagram.updateVirtualObjects(newObjects, false, removeObjects);
        this.oldCollectionObjects = oObjectsID;
    }
    /**
     * setSize \
     *
     * @returns { void }     To get page pageBounds.\
     * @param {PointModel} newOffset - provide the newOffset value.
     *
     * @private
     */
    public setSize(newOffset?: PointModel): void {
        const pageBounds: Rect = this.getPageBounds(undefined, undefined, true);
        pageBounds.x *= this.currentZoom;
        pageBounds.y *= this.currentZoom;
        pageBounds.width *= this.currentZoom;
        pageBounds.height *= this.currentZoom;

        const x: number = Math.min(pageBounds.x, -this.horizontalOffset);
        const y: number = Math.min(pageBounds.y, -this.verticalOffset);

        const difX: number = - this.horizontalOffset + this.viewPortWidth - pageBounds.right;
        const difY: number = -this.verticalOffset + this.viewPortHeight - pageBounds.bottom;
        let hScrollSize: number = this.scrollerWidth;
        let vScrollSize: number = this.scrollerWidth;
        if (-this.verticalOffset <= pageBounds.y && -this.verticalOffset + this.viewPortHeight >= pageBounds.bottom) {
            vScrollSize = 0;
        }
        if (-this.horizontalOffset <= pageBounds.x && -this.horizontalOffset + this.viewPortWidth >= pageBounds.right) {
            hScrollSize = 0;
        }
        this.hScrollSize = hScrollSize;
        this.vScrollSize = vScrollSize;
        const oldWidth: number = this.diagramWidth;
        const oldHeight: number = this.diagramHeight;
        this.diagramWidth = Math.max(pageBounds.right, -this.horizontalOffset + this.viewPortWidth - vScrollSize) - x;
        this.diagramHeight = Math.max(pageBounds.bottom, -this.verticalOffset + this.viewPortHeight - hScrollSize) - y;
        if ((oldWidth !== this.diagramWidth || oldHeight !== this.diagramHeight) && this.diagram.scrollSettings.scrollLimit !== 'Diagram') {
            this.diagram.setSize(this.diagramWidth, this.diagramHeight);
        }
        if (this.diagram.scrollSettings.scrollLimit === 'Diagram') {
            if ((oldWidth !== this.diagramWidth || oldHeight !== this.diagramHeight || this.currentZoom !== 1)
                && ((!this.diagram.diagramActions || !newOffset) || (this.diagram.diagramActions && newOffset &&
                    ((this.verticalOffset !== 0 || this.verticalOffset === newOffset.y) &&
                        (this.horizontalOffset !== 0 || this.horizontalOffset === newOffset.x))))) {
                if ((this.diagram.scrollActions & ScrollActions.Interaction) && newOffset) {
                    this.transform = {
                        tx: Math.max(newOffset.x, -(pageBounds.left / this.currentZoom)) / this.currentZoom,
                        ty: Math.max(newOffset.y, -(pageBounds.top / this.currentZoom)) / this.currentZoom,
                        scale: this.currentZoom
                    };
                    this.horizontalOffset = newOffset.x;
                    this.verticalOffset = newOffset.y;
                }
                this.diagram.setSize(this.diagramWidth, this.diagramHeight);
                if ((!(this.diagram.scrollActions & ScrollActions.PropertyChange)) && newOffset) {
                    this.horizontalOffset = newOffset.x;
                    this.verticalOffset = newOffset.y;
                    this.transform = {
                        tx: Math.max(newOffset.x, -pageBounds.left) / this.currentZoom,
                        ty: Math.max(newOffset.y, -pageBounds.top) / this.currentZoom,
                        scale: this.currentZoom
                    };
                }
            } else if (newOffset && oldWidth === this.diagramWidth && oldHeight === this.diagramHeight &&
                ((this.diagram.diagramCanvas.scrollHeight > this.viewPortHeight &&
                    newOffset.y < 0 && this.horizontalOffset === newOffset.x && this.verticalOffset === 0) ||
                (this.diagram.diagramCanvas.scrollWidth > this.viewPortWidth &&
                    newOffset.x < 0 && this.verticalOffset === newOffset.y && this.horizontalOffset === 0))) {
                this.verticalOffset = newOffset.y;
                this.horizontalOffset = newOffset.x;
                this.transform = {
                    tx: Math.max(newOffset.x, -pageBounds.left) / this.currentZoom,
                    ty: Math.max(newOffset.y, -pageBounds.top) / this.currentZoom,
                    scale: this.currentZoom
                };
            }
        }
        this.diagram.transformLayers();
        this.diagram.element.style.overflow = 'hidden';
    }
    /**
     * setViewPortSize \
     *
     * @returns { void }     To get page pageBounds.\
     * @param {number} width - provide the factor value.
     * @param {number} height - provide the factor value.
     *
     * @private
     */
    public setViewPortSize(width: number, height: number): void {
        this.viewPortWidth = width;
        this.viewPortHeight = height;
    }

    /**
     * To get page pageBounds \
     *
     * @returns { Rect }     To get page pageBounds.\
     * @param {boolean} boundingRect - provide the factor value.
     * @param {DiagramRegions} region - provide the factor value.
     * @param {boolean} hasPadding - provide the factor value.
     * @param {boolean} isnegativeRegion - provide the isnegativeRegion value.
     *
     * @private
     */
    public getPageBounds(boundingRect?: boolean, region?: DiagramRegions, hasPadding?: boolean, isnegativeRegion?: boolean): Rect {
        let rect: Rect = new Rect();
        const temp: number = 0;
        let pageBounds: Rect;
        if (region !== 'Content' && !isnegativeRegion && this.diagram.pageSettings.width !== null && this.diagram.pageSettings.height !== null) {
            let width: number = this.diagram.pageSettings.width;
            let height: number = this.diagram.pageSettings.height;
            let negwidth: number = 0;
            let negheight: number = 0;
            if (this.diagram.pageSettings.multiplePage) {
                rect = this.diagram.spatialSearch.getPageBounds(0, 0);
                if (rect.right > width) {
                    const x: number = Math.ceil(rect.right / width);
                    width = width * x;
                }
                if (rect.bottom > height) {
                    const x: number = Math.ceil(rect.bottom / height);
                    height = height * x;
                }
                if (rect.left < 0 && Math.abs(rect.left) > negwidth) {
                    const x: number = Math.ceil(Math.abs(rect.left) / this.diagram.pageSettings.width);
                    negwidth = this.diagram.pageSettings.width * x;
                }
                if (rect.top < 0 && Math.abs(rect.top) > negheight) {
                    const x: number = Math.ceil(Math.abs(rect.top) / this.diagram.pageSettings.height);
                    negheight = this.diagram.pageSettings.height * x;
                }
            }
            pageBounds = new Rect((-negwidth), (-negheight), width + negwidth, height + negheight);
        } else {
            const origin: number = boundingRect ? undefined : 0;
            pageBounds = this.diagram.spatialSearch.getPageBounds(origin, origin);
        }
        if (hasPadding) {
            const scrollpadding: MarginModel = this.diagram.scrollSettings.padding;
            pageBounds.x -= scrollpadding.left;
            pageBounds.y -= scrollpadding.top;
            pageBounds.width += (scrollpadding.left + scrollpadding.right);
            pageBounds.height += (scrollpadding.top + scrollpadding.bottom);
        }
        return pageBounds;
    }

    /**
     * To get page break when PageBreak is set as true \
     *
     * @returns { Segment[] }     To get page break when PageBreak is set as true.\
     * @param {Rect} pageBounds - provide the factor value.
     *
     * @private
     */
    public getPageBreak(pageBounds: Rect): Segment[] {
        let i: number = 0;
        let j: number = 0;
        let v: number = -1;
        const collection: Segment[] = [];
        let x1: number = 0;
        let x2: number = 0;
        let y1: number = 0;
        let y2: number = 0;
        const left: number = this.diagram.pageSettings.margin.left;
        const right: number = this.diagram.pageSettings.margin.right;
        const top: number = this.diagram.pageSettings.margin.top;
        const bottom: number = this.diagram.pageSettings.margin.bottom;
        let widthCount: number = 1;
        let heightCount: number = 1;
        let segment: Segment = { x1: x1, y1: y1, x2: x2, y2: y2 };
        while (pageBounds.width > i) {
            i = i + (this.diagram.pageSettings.width ? this.diagram.pageSettings.width : pageBounds.width);
            if (i === this.diagram.pageSettings.width) {
                segment = {
                    x1: pageBounds.left + left, y1: pageBounds.top + top,
                    x2: pageBounds.left + left, y2: pageBounds.bottom - bottom
                };
                collection[++v] = segment;
            }
            if (i < pageBounds.width) {
                x1 = pageBounds.topLeft.x + this.diagram.pageSettings.width * widthCount;
                y1 = pageBounds.topLeft.y + top;
                x2 = pageBounds.bottomLeft.x + this.diagram.pageSettings.width * widthCount;
                y2 = pageBounds.bottomLeft.y - bottom;
                segment = { x1: x1, y1: y1, x2: x2, y2: y2 };
                collection[++v] = segment;
                widthCount++;
            }
            if (pageBounds.width === i) {
                segment = {
                    x1: pageBounds.right - right, y1: pageBounds.top + top,
                    x2: pageBounds.right - right, y2: pageBounds.bottom - bottom
                };
                collection[++v] = segment;
            }
        }
        while (pageBounds.height > j) {
            j = j + (this.diagram.pageSettings.height ? this.diagram.pageSettings.height : pageBounds.height);
            if (j === this.diagram.pageSettings.height) {
                segment = {
                    x1: pageBounds.left + left, y1: pageBounds.top + top,
                    x2: pageBounds.right - right, y2: pageBounds.top + top
                };
                collection[++v] = segment;
            }
            if (j < pageBounds.height) {
                x1 = pageBounds.topLeft.x + left;
                y1 = pageBounds.topLeft.y + this.diagram.pageSettings.height * heightCount;
                x2 = pageBounds.topRight.x - right;
                y2 = pageBounds.topRight.y + this.diagram.pageSettings.height * heightCount;
                segment = { x1: x1, y1: y1, x2: x2, y2: y2 };
                collection[++v] = segment;
                heightCount++;
            }
            if (pageBounds.height === j) {
                segment = {
                    x1: pageBounds.left + left, y1: pageBounds.bottom - bottom,
                    x2: pageBounds.right - right, y2: pageBounds.bottom - bottom
                };
                collection[++v] = segment;
            }
        }
        return collection;
    }
    /**
     * zoom method \
     *
     * @returns { void }     zoom method .\
     * @param {number} factor - provide the factor value.
     * @param {number} deltaX - provide the bounds value.
     * @param {number} deltaY - provide the bounds value.
     * @param {PointModel} focusPoint - provide the bounds value.
     * @param {boolean} isInteractiveZoomPan - provide the isInteractiveZoomPan value.
     * @param {boolean} isBringIntoView - provide the isBringIntoView value.
     * @param {boolean} isTrackpadScroll - provide the isTrackpadScroll value.
     * @param {boolean} canZoomOut - provide the canZoomOut value.
     *
     * @private
     */
    public zoom(factor: number, deltaX?: number, deltaY?: number, focusPoint?: PointModel, isInteractiveZoomPan?: boolean,
                isBringIntoView?: boolean, isTrackpadScroll?: boolean, canZoomOut?: boolean): void {
        if (canZoom(this.diagram) && factor !== 1 || (canPan(this.diagram) && factor === 1)) {
            const matrix: Matrix = identityMatrix();
            scaleMatrix(matrix, this.currentZoom, this.currentZoom);
            translateMatrix(matrix, this.horizontalOffset, this.verticalOffset);
            focusPoint = focusPoint || {
                x: (this.viewPortWidth / 2 - this.horizontalOffset) / this.currentZoom,
                y: (this.viewPortHeight / 2 - this.verticalOffset) / this.currentZoom
            };
            focusPoint = transformPointByMatrix(matrix, focusPoint);
            //Bug 853566: Fit to page is not working when zoom value less than minZoom.
            // Removed minZoom calculation to call fitToPage even if currentZoom less than minZoom.
            if ((this.currentZoom * factor) <= this.diagram.scrollSettings.maxZoom &&
                ((this.currentZoom * factor) >= this.diagram.scrollSettings.minZoom || (canZoomOut || factor >= 1))) {
                this.currentZoom *= factor;
                const pageBounds: Rect = this.getPageBounds(undefined, undefined, true);
                pageBounds.x *= this.currentZoom;
                pageBounds.y *= this.currentZoom;

                //target Matrix
                const targetMatrix: Matrix = identityMatrix();
                scaleMatrix(targetMatrix, factor, factor, focusPoint.x, focusPoint.y);
                translateMatrix(targetMatrix, deltaX || 0, deltaY || 0);
                multiplyMatrix(matrix, targetMatrix);

                let newOffset: PointModel = transformPointByMatrix(matrix, { x: 0, y: 0 });
                if (factor === 1) {
                    // EJ2-69238 - add true as an extra parameter to calcuate the horizontal and vertical offset
                    newOffset = this.applyScrollLimit(newOffset.x, newOffset.y, isInteractiveZoomPan, isBringIntoView, isTrackpadScroll);
                }
                // Bug 829925: Scroll bar flickers on scrolling the diagram using touchpad.
                // The below condition is used to avoid the flickering of the scroll bar on scrolling the diagram using trackpad.
                isTrackpadScroll = (-(pageBounds.y) >= newOffset.y && -(pageBounds.x) >= newOffset.x && isTrackpadScroll);
                if ((this.diagram.scrollActions & ScrollActions.PropertyChange ||
                    !(this.diagram.scrollActions & ScrollActions.Interaction)) ||
                    this.diagram.scrollSettings.scrollLimit !== 'Diagram' || isTrackpadScroll) {
                    this.transform = {
                        tx: Math.max(newOffset.x, -pageBounds.left) / this.currentZoom,
                        ty: Math.max(newOffset.y, -pageBounds.top) / this.currentZoom,
                        scale: this.currentZoom
                    };
                    this.horizontalOffset = newOffset.x;
                    this.verticalOffset = newOffset.y;
                }
                this.setSize(newOffset);
                if (this.diagram.mode !== 'SVG' && canVitualize(this.diagram)) {
                    this.diagram.scroller.virtualizeElements();
                }
                if (this.diagram.mode !== 'SVG' && !canVitualize(this.diagram)) {
                    this.diagram.refreshDiagramLayer();
                }
                this.diagram.setOffset(-this.horizontalOffset - pageBounds.x, -this.verticalOffset - pageBounds.y);
                updateRuler(this.diagram);
                //Bug 863516: Overview is not synced with diagram content while zoom-out the diagram.
                //Updating overview after the page scrolled or zoomed.
                if (this.diagram.views && (this.diagram.views as any).overview) {
                    const overview: any = (this.diagram.views as any).overview;
                    const bounds: Rect = overview.scrollOverviewRect(overview.parent.scroller.horizontalOffset,
                                                                     overview.parent.scroller.verticalOffset,
                                                                     overview.parent.scroller.currentZoom, true);
                    overview.updateOverviewrect(-bounds.x, -bounds.y, bounds.width, bounds.height);
                    overview.updateView(overview);
                }
            }
        }
    }
    /**
     * fitToPage method \
     *
     * @returns { void }     fitToPage method .\
     * @param {IFitOptions} options - provide the bounds value.
     *
     * @private
     */
    public fitToPage(options?: IFitOptions): void {
        options = options || {};
        let mode: FitModes = options.mode;
        let region: DiagramRegions = options.region;
        const margin: MarginModel = options.margin || {};
        const canZoomIn: boolean = options.canZoomIn;
        const customBounds: Rect = options.customBounds;
        // Allows fitToPage when the currentZoom less than minZoom.
        const canZoomOut: boolean = options.canZoomOut;
        margin.bottom = margin.bottom || 25;
        margin.top = margin.top || 25;
        margin.left = margin.left || 25;
        margin.right = margin.right || 25;
        let bounds: Rect = customBounds;
        let factor: number;
        let deltaX: number = -this.horizontalOffset;
        let deltaY: number = -this.verticalOffset;
        region = region ? region : 'PageSettings';
        //fit mode
        if ((region === 'PageSettings' && this.diagram.pageSettings.width && this.diagram.pageSettings.height)
            || (this.diagram.nodes.length > 0 || this.diagram.connectors.length > 0)) {
            mode = mode ? mode : 'Page';
            if (region !== 'CustomBounds') {
                bounds = this.getPageBounds(true, region, true);
            }
            const scale: PointModel = { x: 0, y: 0 };
            //Bug 853566: Fit to page is not working when zoom value less than minZoom.
            // Resetting margin value if the margin value is greater than the viewport size to avoid scale value in negative.
            if ((margin.left + margin.right) > this.viewPortWidth) {
                if (this.viewPortWidth <= 100) {
                    margin.left = 5;
                    margin.right = 5;
                } else {
                    margin.left = 25;
                    margin.right = 25;
                }
            }
            if ((margin.top + margin.bottom) > this.viewPortHeight) {
                if (this.viewPortHeight <= 100) {
                    margin.top = 5;
                    margin.bottom = 5;
                } else {
                    margin.top = 25;
                    margin.bottom = 25;
                }
            }
            scale.x = (this.viewPortWidth - (margin.left + margin.right)) / (bounds.width);
            scale.y = (this.viewPortHeight - (margin.top + margin.bottom)) / (bounds.height);
            if (!canZoomIn && (((bounds.width - this.horizontalOffset) < this.viewPortWidth) &&
                (bounds.height - this.verticalOffset) < this.viewPortHeight)) {
                scale.x = Math.min(this.currentZoom, scale.x);
                scale.y = Math.min(this.currentZoom, scale.y);
            }
            let zoomFactor: number;
            let centerX: number;
            let centerY: number;

            switch (mode) {
            case 'Width':
                zoomFactor = scale.x;
                factor = zoomFactor / this.currentZoom;
                centerX = (this.viewPortWidth - (bounds.width) * zoomFactor) / 2 - bounds.x * zoomFactor;
                deltaX += centerX + (margin.left - margin.right) / 2 * zoomFactor;
                deltaY -= -this.verticalOffset * factor;
                deltaY = region !== 'CustomBounds' ? deltaY : deltaY - this.verticalOffset * factor;
                break;
            case 'Height':
                zoomFactor = scale.y;
                factor = (zoomFactor / this.currentZoom);
                centerX = ((this.viewPortWidth - (bounds.width) * zoomFactor) / 2) - bounds.x * zoomFactor;
                centerY = ((this.viewPortHeight - (bounds.height) * zoomFactor) / 2) - bounds.y * zoomFactor;
                deltaX += centerX + (margin.left - margin.right) / 2 * zoomFactor;
                deltaY += centerY + (margin.top - margin.bottom) / 2 * zoomFactor;
                break;
            case 'Page':
                zoomFactor = Math.min(scale.x, scale.y);
                factor = (zoomFactor / this.currentZoom);
                centerX = (this.viewPortWidth - (bounds.width) * zoomFactor) / 2 - bounds.x * zoomFactor;
                centerY = (this.viewPortHeight - (bounds.height) * zoomFactor) / 2 - bounds.y * zoomFactor;
                deltaX += centerX + (margin.left - margin.right) / 2 * zoomFactor;
                deltaY += centerY + (margin.top - margin.bottom) / 2 * zoomFactor;
                break;
            }
            /**
             * EJ2-62912 - fit to page is not working properly when call it multiple times.
             */
            this.zoom(factor, deltaX, deltaY, { x: 0, y: 0 }, true, undefined, undefined, canZoomOut);
        } else {
            factor = 1 / this.currentZoom;
            this.zoom(factor, deltaX, deltaY, { x: 0, y: 0 }, true, undefined, undefined, canZoomOut);
        }
    }
    /**
     * bringIntoView method \
     *
     * @returns { void }     bringIntoView method .\
     * @param {Rect} rect - provide the bounds value.
     * @param {boolean} isBringIntoView - provide the isBringIntoView value.
     *
     * @private
     */
    public bringIntoView(rect: Rect, isBringIntoView?: boolean): void {
    // EJ2-68130-Bringintoview shows the object outside the viewport
        let x: number = 0;
        let y: number = 0;
        const scale: number = this.currentZoom;
        let bounds: Rect = rect;
        const hoffset: number = -this.horizontalOffset;
        const voffset: number = -this.verticalOffset;
        bounds = new Rect(bounds.x * scale, bounds.y * scale, bounds.width * scale, bounds.height * scale);
        const view: Rect = new Rect(hoffset, voffset, this.viewPortWidth, this.viewPortHeight);
        //To prevent nodes from being cut off in the horizontal and vertical scrollbars when calling the "bring into view" function, a padding value is added.
        const nodePadding: number = 20;
        if (!(view.containsRect(bounds))) {
            if (bounds.right > (-hoffset + this.viewPortWidth)) {
                x = bounds.right - this.viewPortWidth;
                x += nodePadding;
            }
            if (bounds.x < -hoffset) {
                x = bounds.x;
            }
            if (bounds.bottom > (-voffset + this.viewPortHeight)) {
                y = bounds.bottom - this.viewPortHeight;
                y += nodePadding;
            }
            if (bounds.y < -voffset) {
                y = bounds.y;
            }
            this.zoom(1, -this.horizontalOffset - x, -this.verticalOffset - y, null, undefined, isBringIntoView);
        }
    }

    /**
     * bringToCenter method \
     *
     * @returns { void }     bringToCenter method .\
     * @param {Rect} bounds - provide the bounds value.
     *
     * @private
     */
    public bringToCenter(bounds: Rect): void {
        const scale: number = this.currentZoom;
        const actualbounds: Rect = new Rect(bounds.x * scale, bounds.y * scale, bounds.width * scale, bounds.height * scale);
        let hoffset: number = actualbounds.x + actualbounds.width / 2 - this.viewPortWidth / 2;
        let voffset: number = actualbounds.y + actualbounds.height / 2 - this.viewPortHeight / 2;
        /**
         * In applyScrollLimit method the sign of deltaX and deltaY
         * will be changed ,so here we change the sign.
         * similarly for bringIntoView.
         */
        hoffset *= -1; voffset *= -1;
        this.zoom(1, -this.horizontalOffset - hoffset, -this.verticalOffset - voffset, null);
    }

    private applyScrollLimit(hOffset: number, vOffset: number, isInteractiveZoomPan: boolean,
                             isBringIntoView?: boolean, isTrackpadScroll?: boolean): PointModel {
        /**
         * EJ2-60980- ScrollOffset is not updated properly in runtime.
         * EJ2-62524 - panning is not working properly in diagram.
         * isInteractiveZoomPan is undefined while setting scrollOffset at runtime.
         */
        if (this.diagram.scrollSettings.scrollLimit === 'Infinity')
        {
            if (isInteractiveZoomPan === undefined && !isBringIntoView){
                hOffset = -hOffset; vOffset = -vOffset;
            }
        }
        if (this.diagram.scrollSettings.scrollLimit !== 'Infinity') {
            let bounds: Rect;
            if (this.diagram.scrollSettings.scrollLimit === 'Limited') {
                const scrollableBounds: Rect = this.diagram.scrollSettings.scrollableArea;
                bounds = new Rect(scrollableBounds.x, scrollableBounds.y, scrollableBounds.width, scrollableBounds.height);
            }
            // Bug 829925: Scroll bar flickers on scrolling the diagram using touchpad.
            // Added below code to get the page bounds based on the scroll.
            bounds = bounds || (isTrackpadScroll ? this.getPageBounds() : this.getPageBounds(true));
            bounds.x *= this.currentZoom;
            bounds.y *= this.currentZoom;
            bounds.width *= this.currentZoom;
            bounds.height *= this.currentZoom;
            if (isInteractiveZoomPan !== undefined){
                hOffset *= -1;
                vOffset *= -1;
            }
            // EJ2-69238 - Added below code to multiple the horizontal and vertical offset to bring the node in viewport
            if (isBringIntoView) {
                hOffset *= -1;
                vOffset *= -1;
            }
            const allowedRight: number = Math.max(bounds.right, this.viewPortWidth);
            if (!isBringIntoView && !(hOffset <= bounds.x && (hOffset + this.viewPortWidth >= bounds.right ||
                hOffset >= bounds.right - this.viewPortWidth)
                || hOffset >= bounds.x && (hOffset + this.viewPortWidth <= allowedRight))) {
                //not allowed case
                if (hOffset >= bounds.x) {
                    hOffset = Math.max(
                        bounds.x,
                        Math.min(hOffset, hOffset - (hOffset + this.viewPortWidth - this.vScrollSize - allowedRight)));
                } else {
                    const allowed: number = bounds.right - this.viewPortWidth;
                    hOffset = Math.min(allowed, bounds.x);
                }
            }
            const allowedBottom: number = Math.max(bounds.bottom, this.viewPortHeight);
            // EJ2-69238 - Added below code to restrict the min value calculation for vertical offset in bringIntoview scenarion.
            if (!isBringIntoView && !(vOffset <= bounds.y && vOffset + this.viewPortHeight >= bounds.bottom
                || vOffset >= bounds.y && vOffset + this.viewPortHeight <= allowedBottom)) {
                //not allowed case
                if (vOffset >= bounds.y) {
                    vOffset = Math.max(
                        bounds.y,
                        Math.min(vOffset, vOffset - (vOffset + this.viewPortHeight - this.hScrollSize - allowedBottom)));
                } else {
                    const allowed: number = bounds.bottom - this.viewPortHeight;
                    vOffset = Math.min(bounds.y, allowed);
                }
            }
            hOffset *= -1;
            vOffset *= -1;
        }
        return { x: hOffset, y: vOffset };
    }
}
/** @private */
export interface TransformFactor {
    tx: number;
    ty: number;
    scale: number;
}
export interface Segment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
