import { IElement } from '../objects/interface/IElement';
import { Diagram } from '../diagram';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { FitModes, DiagramRegions, RealAction } from '../enum/enum';
import { Matrix, identityMatrix, scaleMatrix, translateMatrix, transformPointByMatrix, multiplyMatrix } from '../primitives/matrix';
import { MarginModel } from '../core/appearance-model';
import { IFitOptions } from '../objects/interface/interfaces';
import { updateRuler } from '../ruler/ruler';
import { canZoom, canPan } from './../utility/constraints-util';
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
    /** @private */
    public get viewPortHeight(): number {
        return this.vPortHeight;
    }

    /** @private */
    public set viewPortHeight(offset: number) {
        this.vPortHeight = offset;
        this.diagram.scrollSettings.viewPortHeight = offset;
    }
    /** @private */
    public get currentZoom(): number {
        return this.currentZoomFActor;
    }

    /** @private */
    public set currentZoom(offset: number) {
        this.currentZoomFActor = offset;
        this.diagram.scrollSettings.currentZoom = offset;
    }
    /** @private */
    public get viewPortWidth(): number {
        return this.vPortWidth;
    }

    /** @private */
    public set viewPortWidth(offset: number) {
        this.vPortWidth = offset;
        this.diagram.scrollSettings.viewPortWidth = offset;
    }

    /** @private */
    public get horizontalOffset(): number {
        return this.hOffset;
    }

    /** @private */
    public set horizontalOffset(offset: number) {
        this.hOffset = offset;
        if (Math.abs(this.hOffset - this.diagram.scrollSettings.horizontalOffset) > 1) {
            this.diagram.realActions = this.diagram.realActions | RealAction.hScrollbarMoved;
            this.scrolled = true;
        }
        this.diagram.scrollSettings.horizontalOffset = offset;
    }

    /** @private */
    public get verticalOffset(): number {
        return this.vOffset;
    }

    /** @private */
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
    /** @private */
    public updateScrollOffsets(hOffset?: number, vOffset?: number): void {
        let offsetX: number = 0;
        let offsetY: number = 0;
        let pageBounds: Rect = this.getPageBounds();
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
    /** @private */
    public setScrollOffset(hOffset: number, vOffset: number): void {
        this.scrolled = false;
        let pageBounds: Rect = this.getPageBounds();
        pageBounds.x *= this.currentZoom;
        pageBounds.y *= this.currentZoom;
        pageBounds.width *= this.currentZoom;
        pageBounds.height *= this.currentZoom;

        let x: number = - pageBounds.left;
        let y: number = - pageBounds.top;
        let set: boolean = false;
        let viewWidth: number = this.viewPortWidth * this.currentZoom;
        let viewHeight: number = this.viewPortHeight * this.currentZoom;
        let newX: number = x - hOffset;
        if (newX !== this.horizontalOffset) {
            if (x < this.horizontalOffset) {
                if (this.horizontalOffset > newX) {
                    this.horizontalOffset -= hOffset;
                } else {
                    this.horizontalOffset = newX;
                }
                set = true;
            }
            let right: number = Math.max(pageBounds.right + this.vScrollSize, viewWidth);
            if (!set && right < -newX + this.viewPortWidth) {
                let actualRight: number = -newX + viewWidth - this.vScrollSize;
                let currentRight: number = -this.horizontalOffset + viewWidth - this.vScrollSize;
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
        let newY: number = y - vOffset;
        if (newY !== this.verticalOffset) {
            if (y < this.verticalOffset) {
                if (this.verticalOffset > newY) {
                    this.verticalOffset -= vOffset;
                } else {
                    this.verticalOffset = newY;
                }
                set = true;
            }
            let bottom: number = Math.max(pageBounds.bottom + this.hScrollSize, viewHeight);
            if (!set && bottom < -newY + viewHeight) {
                let actualBottom: number = -newY + viewHeight - this.hScrollSize;
                let currentBottom: number = -this.verticalOffset + viewHeight - this.hScrollSize;
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

    /** @private */
    public getObjects(coll1: string[], coll2: string[]): string[] {
        let objects: string[] = [];
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

    /**   @private  */
    public virtualizeElements(): void {
        let viewWidth: number = this.viewPortWidth / this.currentZoom;
        let viewHeight: number = this.viewPortHeight / this.currentZoom;
        let oObjects: (NodeModel | ConnectorModel)[] = this.diagram.spatialSearch.findObjects(
            new Rect(-this.horizontalOffset / this.currentZoom, -this.verticalOffset / this.currentZoom, viewWidth, viewHeight)
        );
        let oObjectsID: string[] = [];
        for (let i: number = 0; i < oObjects.length; i++) {
            oObjectsID.push(oObjects[i].id);
        }
        let newObjects: string[] = this.getObjects(oObjectsID, this.oldCollectionObjects);
        if (this.oldCollectionObjects.length === 0) {
            this.oldCollectionObjects = oObjectsID;
        }
        let removeObjects: string[] = this.getObjects(this.oldCollectionObjects, oObjectsID);
        this.diagram.updateVirtualObjects(newObjects, false, removeObjects);
        this.oldCollectionObjects = oObjectsID;
    }
    /** @private */
    public setSize(): void {
        let pageBounds: Rect = this.getPageBounds();
        pageBounds.x *= this.currentZoom;
        pageBounds.y *= this.currentZoom;
        pageBounds.width *= this.currentZoom;
        pageBounds.height *= this.currentZoom;

        let x: number = Math.min(pageBounds.x, -this.horizontalOffset);
        let y: number = Math.min(pageBounds.y, -this.verticalOffset);

        let difX: number = - this.horizontalOffset + this.viewPortWidth - pageBounds.right;
        let difY: number = -this.verticalOffset + this.viewPortHeight - pageBounds.bottom;
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
        let oldWidth: number = this.diagramWidth;
        let oldHeight: number = this.diagramHeight;
        this.diagramWidth = Math.max(pageBounds.right, -this.horizontalOffset + this.viewPortWidth - vScrollSize) - x;
        this.diagramHeight = Math.max(pageBounds.bottom, -this.verticalOffset + this.viewPortHeight - hScrollSize) - y;
        if (oldWidth !== this.diagramWidth || oldHeight !== this.diagramHeight) {
            this.diagram.setSize(this.diagramWidth, this.diagramHeight);
        }
        this.diagram.transformLayers();
        this.diagram.element.style.overflow = 'hidden';
    }
    /** @private */
    public setViewPortSize(width: number, height: number): void {
        this.viewPortWidth = width;
        this.viewPortHeight = height;
    }
    /**
     * To get page pageBounds
     * @private
     */
    public getPageBounds(boundingRect?: boolean, region?: DiagramRegions): Rect {
        let rect: Rect = new Rect();
        let temp: number = 0;
        if (region !== 'Content' && this.diagram.pageSettings.width !== null && this.diagram.pageSettings.height !== null) {
            let width: number = this.diagram.pageSettings.width;
            let height: number = this.diagram.pageSettings.height;
            let negwidth: number = 0;
            let negheight: number = 0;
            if (this.diagram.pageSettings.multiplePage) {
                rect = this.diagram.spatialSearch.getPageBounds(0, 0);
                if (rect.right > width) {
                    let x: number = Math.ceil(rect.right / width);
                    width = width * x;
                }
                if (rect.bottom > height) {
                    let x: number = Math.ceil(rect.bottom / height);
                    height = height * x;
                }
                if (rect.left < 0 && Math.abs(rect.left) > negwidth) {
                    let x: number = Math.ceil(Math.abs(rect.left) / this.diagram.pageSettings.width);
                    negwidth = this.diagram.pageSettings.width * x;
                }
                if (rect.top < 0 && Math.abs(rect.top) > negheight) {
                    let x: number = Math.ceil(Math.abs(rect.top) / this.diagram.pageSettings.height);
                    negheight = this.diagram.pageSettings.height * x;
                }
            }
            return new Rect((-negwidth), (-negheight), width + negwidth, height + negheight);
        } else {
            let origin: number = boundingRect ? undefined : 0;
            return this.diagram.spatialSearch.getPageBounds(origin, origin);
        }
    }
    /**
     * To get page break when PageBreak is set as true
     * @private
     */
    public getPageBreak(pageBounds: Rect): Segment[] {
        let i: number = 0;
        let j: number = 0;
        let v: number = -1;
        let collection: Segment[] = [];
        let x1: number = 0;
        let x2: number = 0;
        let y1: number = 0;
        let y2: number = 0;
        let left: number = this.diagram.pageSettings.margin.left;
        let right: number = this.diagram.pageSettings.margin.right;
        let top: number = this.diagram.pageSettings.margin.top;
        let bottom: number = this.diagram.pageSettings.margin.bottom;
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
    /** @private */
    public zoom(factor: number, deltaX?: number, deltaY?: number, focusPoint?: PointModel): void {
        if (canZoom(this.diagram) && factor !== 1 || (canPan(this.diagram) && factor === 1)) {
            let matrix: Matrix = identityMatrix();
            scaleMatrix(matrix, this.currentZoom, this.currentZoom);
            translateMatrix(matrix, this.horizontalOffset, this.verticalOffset);
            focusPoint = focusPoint || { x: this.viewPortWidth / 2, y: this.viewPortHeight / 2 };
            focusPoint = transformPointByMatrix(matrix, focusPoint);
            if ((this.currentZoom * factor) >= this.diagram.scrollSettings.minZoom &&
                (this.currentZoom * factor) <= this.diagram.scrollSettings.maxZoom) {
                this.currentZoom *= factor;
                let pageBounds: Rect = this.getPageBounds();
                pageBounds.x *= this.currentZoom;
                pageBounds.y *= this.currentZoom;

                //target Matrix
                let targetMatrix: Matrix = identityMatrix();
                scaleMatrix(targetMatrix, factor, factor, focusPoint.x, focusPoint.y);
                translateMatrix(targetMatrix, deltaX || 0, deltaY || 0);
                multiplyMatrix(matrix, targetMatrix);

                let newOffset: PointModel = transformPointByMatrix(matrix, { x: 0, y: 0 });
                if (factor === 1) {
                    newOffset = this.applyScrollLimit(newOffset.x, newOffset.y);
                }
                this.transform = {
                    tx: Math.max(newOffset.x, -pageBounds.left) / this.currentZoom,
                    ty: Math.max(newOffset.y, -pageBounds.top) / this.currentZoom,
                    scale: this.currentZoom
                };
                this.horizontalOffset = newOffset.x;
                this.verticalOffset = newOffset.y;
                this.setSize();

                if (this.diagram.mode !== 'SVG') {
                    this.diagram.refreshDiagramLayer();
                }
                this.diagram.setOffset(-this.horizontalOffset - pageBounds.x, -this.verticalOffset - pageBounds.y);
                updateRuler(this.diagram);
            }
        }
    }
    /** @private */
    public fitToPage(options?: IFitOptions): void {
        options = options || {};
        let mode: FitModes = options.mode;
        let region: DiagramRegions = options.region;
        let margin: MarginModel = options.margin || {};
        let canZoomIn: boolean = options.canZoomIn;
        let customBounds: Rect = options.customBounds;
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
                bounds = this.getPageBounds(true, region);
            }
            let scale: PointModel = { x: 0, y: 0 };
            scale.x = (this.viewPortWidth - (margin.left + margin.right)) / (bounds.width);
            scale.y = (this.viewPortHeight - (margin.top + margin.bottom)) / (bounds.height);
            if (!canZoomIn && ((bounds.width - this.horizontalOffset) < this.viewPortWidth) &&
                (bounds.height - this.verticalOffset) < this.viewPortHeight) {
                scale.x = Math.min(1, scale.x);
                scale.y = Math.min(1, scale.y);
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
    /** @private */
    public bringIntoView(rect: Rect): void {
        let x: number = 0;
        let y: number = 0;
        let scale: number = this.currentZoom;
        let bounds: Rect = rect;
        let hoffset: number = - this.horizontalOffset;
        let voffset: number = -this.verticalOffset;
        bounds = new Rect(bounds.x * scale, bounds.y * scale, bounds.width * scale, bounds.height * scale);
        let view: Rect = new Rect(hoffset, voffset, this.viewPortWidth, this.viewPortHeight);
        if (!(view.containsRect(bounds))) {
            if (bounds.right > (-hoffset + this.viewPortWidth)) {
                x = bounds.right - this.viewPortWidth;
            }
            if (bounds.x < -hoffset) {
                x = bounds.x;
            }
            if (bounds.bottom > (-voffset + this.viewPortHeight)) {
                y = bounds.bottom - this.viewPortHeight;
            }
            if (bounds.y < -voffset) {
                y = bounds.y;
            }
            this.zoom(1, -this.horizontalOffset - x, -this.verticalOffset - y, null);
        }
    }
    /** @private */
    public bringToCenter(bounds: Rect): void {
        let scale: number = this.currentZoom;
        let actualbounds: Rect = new Rect(bounds.x * scale, bounds.y * scale, bounds.width * scale, bounds.height * scale);
        let hoffset: number = actualbounds.x + actualbounds.width / 2 - this.viewPortWidth / 2;
        let voffset: number = actualbounds.y + actualbounds.height / 2 - this.viewPortHeight / 2;
        this.zoom(1, -this.horizontalOffset - hoffset, -this.verticalOffset - voffset, null);
    }

    private applyScrollLimit(hOffset: number, vOffset: number): PointModel {
        if (this.diagram.scrollSettings.scrollLimit !== 'Infinity') {
            let bounds: Rect;
            if (this.diagram.scrollSettings.scrollLimit === 'Limited') {
                bounds = this.diagram.scrollSettings.scrollableArea;
            }
            bounds = bounds || this.getPageBounds(true);
            bounds.x *= this.currentZoom;
            bounds.y *= this.currentZoom;
            bounds.width *= this.currentZoom;
            bounds.height *= this.currentZoom;
            hOffset *= -1;
            vOffset *= -1;
            let allowedRight: number = Math.max(bounds.right, this.viewPortWidth);
            if (!(hOffset <= bounds.x && (hOffset + this.viewPortWidth >= bounds.right ||
                hOffset >= bounds.right - this.viewPortWidth)
                || hOffset >= bounds.x && (hOffset + this.viewPortWidth <= allowedRight))) {
                //not allowed case
                if (hOffset >= bounds.x) {
                    hOffset = Math.max(
                        bounds.x,
                        Math.min(hOffset, hOffset - (hOffset + this.viewPortWidth - this.vScrollSize - allowedRight)));
                } else {
                    let allowed: number = bounds.right - this.viewPortWidth;
                    hOffset = Math.min(allowed, bounds.x);
                }
            }
            let allowedBottom: number = Math.max(bounds.bottom, this.viewPortHeight);
            if (!(vOffset <= bounds.y && vOffset + this.viewPortHeight >= bounds.bottom
                || vOffset >= bounds.y && vOffset + this.viewPortHeight <= allowedBottom)) {
                //not allowed case
                if (vOffset >= bounds.y) {
                    vOffset = Math.max(
                        bounds.y,
                        Math.min(vOffset, vOffset - (vOffset + this.viewPortHeight - this.hScrollSize - allowedBottom)));
                } else {
                    let allowed: number = bounds.bottom - this.viewPortHeight;
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