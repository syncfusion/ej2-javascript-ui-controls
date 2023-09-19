/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DiagramElement } from '../elements/diagram-element';
import { ElementAction } from '../../enum/enum';
import { Thickness } from '../appearance';
import { Size } from '../../primitives/size';
import { Rect } from '../../primitives/rect';
import { PointModel } from '../../primitives/point-model';
import { rotatePoint, getOffset } from '../../utility/base-util';

/**
 * Container module is used to group related objects
 */
export class Container extends DiagramElement {
    /**
     * Gets/Sets the space between the container and its immediate children
     */
    public padding: Thickness = new Thickness(0, 0, 0, 0);

    /**
     * Gets/Sets the collection of child elements
     */
    public children: DiagramElement[];

    //private members
    private desiredBounds: Rect = undefined;

    /** @private */
    public measureChildren: boolean = true;

    /**
     * returns whether the container has child elements or not
     */
    public hasChildren(): boolean {
        if (this.children !== undefined && this.children.length > 0) {
            return true;
        }
        return false;
    }

    /**   @private  */
    public prevRotateAngle: number = 0;

    /**
     * Measures the minimum space that the container requires
     *
     * @param {Size} availableSize
     * @param {string} id
     * @param {Function} callback
     */
    public measure(availableSize: Size, id?: string, callback?: Function): Size {
        // measure the element and find the desired size
        this.desiredBounds = undefined;
        let desired: Size = undefined;
        let child: DiagramElement;
        const center: PointModel = { x: 0, y: 0 };
        let y: number; let x: number;
        let childBounds: Rect;
        if (this.hasChildren()) {
            //Measuring the children
            for (let i: number = 0; i < this.children.length; i++) {
                child = this.children[parseInt(i.toString(), 10)];
                if (child.horizontalAlignment === 'Stretch' && !availableSize.width) {
                    availableSize.width = child.bounds.width;
                }
                if (child.verticalAlignment === 'Stretch' && !availableSize.height) {
                    availableSize.height = child.bounds.height;
                }
                const force: boolean = child.horizontalAlignment === 'Stretch' || child.verticalAlignment === 'Stretch';
                if (this.measureChildren || force || (child instanceof Container && child.measureChildren !== undefined)) {
                    child.measure(availableSize, id, callback);
                }
                childBounds = this.GetChildrenBounds(child);
                if (child.horizontalAlignment !== 'Stretch' && child.verticalAlignment !== 'Stretch') {
                    if (this.desiredBounds === undefined) {
                        this.desiredBounds = childBounds;
                    } else {
                        this.desiredBounds.uniteRect(childBounds);
                    }
                } else if (this.actualSize && !this.actualSize.width && !this.actualSize.height &&
                    !child.preventContainer && child.horizontalAlignment === 'Stretch' && child.verticalAlignment === 'Stretch') {
                    if (this.desiredBounds === undefined) {
                        this.desiredBounds = child.bounds;
                    } else {
                        this.desiredBounds.uniteRect(child.bounds);
                    }
                }
            }
            if (this.desiredBounds !== undefined && this.rotateAngle !== 0) {
                const offsetPt: PointModel = {
                    x: this.desiredBounds.x + this.desiredBounds.width * this.pivot.x,
                    y: this.desiredBounds.y + this.desiredBounds.height * this.pivot.y
                };
                const newPoint: PointModel = rotatePoint(this.rotateAngle, undefined, undefined, offsetPt);
                this.desiredBounds.x = newPoint.x - this.desiredBounds.width * this.pivot.x;
                this.desiredBounds.y = newPoint.y - this.desiredBounds.height * this.pivot.y;
            }
            /**
             * Adding padding to the group bounds during initial rendering and for the group selection
             */
            if (this.desiredBounds !== undefined) {
                this.desiredBounds.width += this.padding.left + this.padding.right;
                this.desiredBounds.height += this.padding.top + this.padding.bottom;
                this.desiredBounds.x -= this.padding.left;
                this.desiredBounds.y -= this.padding.top;
            }
            if (this.desiredBounds) {
                desired = new Size(this.desiredBounds.width, this.desiredBounds.height);
            }
        }

        desired = this.validateDesiredSize(desired, availableSize);
        this.stretchChildren(desired);
        this.desiredSize = desired;
        return desired;
    }

    /**
     * Arranges the container and its children
     *
     * @param {Size} desiredSize  - provide the desiredSize value
     */
    public arrange(desiredSize: Size): Size {
        let child: DiagramElement; let bounds: Rect;
        const childBounds: Rect = this.desiredBounds;
        if (childBounds) {
            const x: number = this.offsetX;
            const y: number = this.offsetY;

            this.offsetX = childBounds.x + childBounds.width * this.pivot.x;
            this.offsetY = childBounds.y + childBounds.height * this.pivot.y;

            // container has rotateAngle
            if (this.hasChildren()) {
                //Measuring the children
                for (let i: number = 0; i < this.children.length; i++) {
                    child = this.children[parseInt(i.toString(), 10)];
                    let arrange: boolean = false;
                    if (child.horizontalAlignment === 'Stretch') {
                        child.offsetX = this.offsetX;
                        child.parentTransform = this.parentTransform + this.rotateAngle;
                        if (this.flip && (this.elementActions & ElementAction.ElementIsGroup)) {
                            child.parentTransform = (this.flip === 'Horizontal' || this.flip === 'Vertical') ?
                                -child.parentTransform : child.parentTransform;
                        }
                        arrange = true;
                    }
                    if (child.verticalAlignment === 'Stretch') {
                        child.offsetY = this.offsetY;
                        child.parentTransform = this.parentTransform + this.rotateAngle;
                        arrange = true;
                    }
                    if (arrange || this.measureChildren || (child instanceof Container && child.measureChildren !== undefined)) {
                        child.arrange(child.desiredSize);
                    }
                    //EJ2-839298 - Connector draw cursor is not enabled while hover the group node port
                    if(i==0){
                        this.outerBounds = child.outerBounds;
                    }
                    else{
                        this.outerBounds.uniteRect(child.outerBounds);
                    }
                }
            }
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.prevRotateAngle = this.rotateAngle;
        return desiredSize;
    }

    //protected methods


    /**
     * Stretches the child elements based on the size of the container
     *
     * @param {Size} size  - provide the size value
     */
    protected stretchChildren(size: Size): void {
        if (this.hasChildren()) {
            for (const child of this.children) {
                if (child.horizontalAlignment === 'Stretch' || child.desiredSize.width === undefined) {
                    child.desiredSize.width = size.width - child.margin.left - child.margin.right;
                }
                if (child.verticalAlignment === 'Stretch' || child.desiredSize.height === undefined) {
                    child.desiredSize.height = size.height - child.margin.top - child.margin.bottom;
                }
                if (child instanceof Container) {
                    child.stretchChildren(child.desiredSize);
                }
            }
        }
    }

    /**
     * Considers the padding of the element when measuring its desired size
     * @param {Size} size - provide the size value
     */
    protected applyPadding(size: Size): void {
        size.width += this.padding.left + this.padding.right;
        size.height += this.padding.top + this.padding.bottom;
    }

    /**
     * Finds the offset of the child element with respect to the container
     *
     * @param {DiagramElement} child - provide the child value
     * @param {PointModel} center - provide the center value
     */
    protected findChildOffsetFromCenter(child: DiagramElement, center: PointModel): void {
        const topLeft: PointModel = { x: center.x - child.desiredSize.width / 2, y: center.y - child.desiredSize.height / 2 };

        let offset: PointModel = getOffset(topLeft, child);
        //Rotate based on child rotate angle
        offset = rotatePoint(child.rotateAngle, center.x, center.y, offset);
        //Rotate based on parent pivot
        offset = rotatePoint(this.rotateAngle + this.parentTransform, this.offsetX, this.offsetY, offset);

        child.offsetX = offset.x;
        child.offsetY = offset.y;
    }

    //private methods - check its need
    private GetChildrenBounds(child: DiagramElement): Rect {
        let childBounds: Rect;
        const childSize: Size = child.desiredSize.clone();

        const diffAngle: number = child.rotateAngle - this.rotateAngle;

        const refPoint: PointModel = { x: child.offsetX, y: child.offsetY };

        const left: number = refPoint.x - childSize.width * child.pivot.x;
        const top: number = refPoint.y - childSize.height * child.pivot.y;
        const right: number = left + childSize.width;
        const bottom: number = top + childSize.height;

        let topLeft: PointModel = { x: left, y: top };
        let topRight: PointModel = { x: right, y: top };
        let bottomLeft: PointModel = { x: left, y: bottom };
        let bottomRight: PointModel = { x: right, y: bottom };

        topLeft = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, topLeft);
        topRight = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, topRight);
        bottomLeft = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, bottomLeft);
        bottomRight = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, bottomRight);

        if (this.rotateAngle !== 0) {
            topLeft = rotatePoint(-this.rotateAngle, undefined, undefined, topLeft);
            topRight = rotatePoint(-this.rotateAngle, undefined, undefined, topRight);
            bottomLeft = rotatePoint(-this.rotateAngle, undefined, undefined, bottomLeft);
            bottomRight = rotatePoint(-this.rotateAngle, undefined, undefined, bottomRight);
        }
        return Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    }
}
