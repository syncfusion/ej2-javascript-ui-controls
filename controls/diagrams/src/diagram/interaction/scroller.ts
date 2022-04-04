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
    private getBounds() {
        let pageBounds: Rect;
        let postion: Rect = this.diagram.spatialSearch.getPageBounds(0, 0);
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
        let pageBounds: Rect = this.getBounds();
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
        let pageBounds: Rect = this.getBounds();
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
                if (coll1[i] === coll2[j]) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                objects.push(coll1[i]);
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
        let renderOrder: string[] = [];

        for (let j = 0; j < oObjects.length; j++) {
            let bpmnShape: any = oObjects[j].shape;
            if (bpmnShape.type === "Bpmn" && bpmnShape && bpmnShape.activity && bpmnShape.activity.subProcess && bpmnShape.activity.subProcess.processes && bpmnShape.activity.subProcess.processes.length > 0) {
                for (var k = 0; k < bpmnShape.activity.subProcess.processes.length; k++) {
                    renderOrder.push(bpmnShape.activity.subProcess.processes[k]);
                }
                renderOrder.push(oObjects[j].id);
            } else if ((oObjects[j] as any).processId === "" || (oObjects[j] as any).processId === undefined) {
                renderOrder.push(oObjects[j].id);
            }
        }

        oObjectsID = renderOrder;

        let zindexOrder: string[] = [];

        for (let j = 0; j < oObjects.length; j++) {
            let items: any = oObjects[j].shape;
            if (items.type === "Bpmn" && items && items.activity && items.activity.subProcess && items.activity.subProcess.processes && items.activity.subProcess.processes.length > 0) {
                zindexOrder.push(oObjects[j].id);
                for (let t = 0; t < items.activity.subProcess.processes.length; t++) {
                    zindexOrder.push(items.activity.subProcess.processes[t]);
                }
            } else if ((oObjects[j] as any).processId === "" || (oObjects[j] as any).processId === undefined) {
                zindexOrder.push(oObjects[j].id);
            }
        }

        for (let j = 0; j < oObjects.length; j++) {
            for (let k = 0; k < zindexOrder.length; k++) {
                if (oObjects[j].id === zindexOrder[k]) {
                    oObjects[j].zIndex = k;
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
     *
     * @private
     */
    public getPageBounds(boundingRect?: boolean, region?: DiagramRegions, hasPadding?: boolean, isnegativeRegion?:boolean): Rect {
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
     *
     * @private
     */
    public zoom(factor: number, deltaX?: number, deltaY?: number, focusPoint?: PointModel): void {
        if (canZoom(this.diagram) && factor !== 1 || (canPan(this.diagram) && factor === 1)) {
            const matrix: Matrix = identityMatrix();
            scaleMatrix(matrix, this.currentZoom, this.currentZoom);
            translateMatrix(matrix, this.horizontalOffset, this.verticalOffset);
            focusPoint = focusPoint || {
                x: (this.viewPortWidth / 2 - this.horizontalOffset) / this.currentZoom,
                y: (this.viewPortHeight / 2 - this.verticalOffset) / this.currentZoom
            };
            focusPoint = transformPointByMatrix(matrix, focusPoint);
            if ((this.currentZoom * factor) >= this.diagram.scrollSettings.minZoom &&
                (this.currentZoom * factor) <= this.diagram.scrollSettings.maxZoom) {
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
                    newOffset = this.applyScrollLimit(newOffset.x, newOffset.y);
                }
                if ((this.diagram.scrollActions & ScrollActions.PropertyChange ||
                    !(this.diagram.scrollActions & ScrollActions.Interaction)) ||
                    this.diagram.scrollSettings.scrollLimit !== 'Diagram') {
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
            this.zoom(factor, deltaX, deltaY, { x: 0, y: 0 });
        } else {
            factor = 1 / this.currentZoom;
            this.zoom(factor, deltaX, deltaY, { x: 0, y: 0 });
        }
    }
    /**
     * bringIntoView method \
     *
     * @returns { void }     bringIntoView method .\
     * @param {Rect} rect - provide the bounds value.
     *
     * @private
     */
    public bringIntoView(rect: Rect): void {
        if (rect && rect.width && rect.height) {
            let bounds: Rect = rect;
            if (bounds.x > 0 && bounds.x >= bounds.width) {
                bounds.width = bounds.x + bounds.x / 3;
            }
            if (bounds.x > 0 && bounds.y >= bounds.height) {
                bounds.height = bounds.y + bounds.y / 3;
            }
            const scale: PointModel = { x: 0, y: 0 };
            scale.x = (this.viewPortWidth - 50) / (bounds.width);
            scale.y = (this.viewPortHeight - 50) / (bounds.height);
            let zoomFactor: number;
            let centerX: number;
            let centerY: number;
            let factor: number;
            let deltaX: number = -this.horizontalOffset;
            let deltaY: number = -this.verticalOffset;
            zoomFactor = Math.min(scale.x, scale.y);
            factor = (zoomFactor / this.currentZoom);
            centerX = (this.viewPortWidth - (bounds.width) * zoomFactor) / 2 - bounds.x * zoomFactor;
            centerY = (this.viewPortHeight - (bounds.height) * zoomFactor) / 2 - bounds.y * zoomFactor;
            deltaX += centerX;
            deltaY += centerY;
            this.zoom(factor, deltaX, deltaY, { x: 0, y: 0 });
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
        const hoffset: number = actualbounds.x + actualbounds.width / 2 - this.viewPortWidth / 2;
        const voffset: number = actualbounds.y + actualbounds.height / 2 - this.viewPortHeight / 2;
        this.zoom(1, -this.horizontalOffset - hoffset, -this.verticalOffset - voffset, null);
    }

    private applyScrollLimit(hOffset: number, vOffset: number): PointModel {
        if (this.diagram.scrollSettings.scrollLimit !== 'Infinity') {
            let bounds: Rect;
            if (this.diagram.scrollSettings.scrollLimit === 'Limited') {
                const scrollableBounds: Rect = this.diagram.scrollSettings.scrollableArea;
                bounds = new Rect(scrollableBounds.x, scrollableBounds.y, scrollableBounds.width, scrollableBounds.height);
            }
            bounds = bounds || this.getPageBounds(true);
            bounds.x *= this.currentZoom;
            bounds.y *= this.currentZoom;
            bounds.width *= this.currentZoom;
            bounds.height *= this.currentZoom;
            hOffset *= -1;
            vOffset *= -1;
            const allowedRight: number = Math.max(bounds.right, this.viewPortWidth);
            if (!(hOffset <= bounds.x && (hOffset + this.viewPortWidth >= bounds.right ||
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
            if (!(vOffset <= bounds.y && vOffset + this.viewPortHeight >= bounds.bottom
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
