import { Container } from './container';
import { DiagramElement } from '../elements/diagram-element';
import { rotateSize } from '../../utility/base-util';
import { Transform } from '../../enum/enum';
import { Size } from '../../primitives/size';
import { Rect } from '../../primitives/rect';
import { PointModel } from '../../primitives/point-model';

/**
 * Canvas module is used to define a plane(canvas) and to arrange the children based on margin
 */
export class Canvas extends Container {

    /**
     * Not applicable for canvas
     *  @private 
     */
    public measureChildren: boolean = undefined;
    /**
     * Measures the minimum space that the canvas requires
     * @param availableSize 
     */
    public measure(availableSize: Size): Size {
        let desired: Size = undefined;
        let desiredBounds: Rect = undefined;
        if (this.hasChildren()) {
            //Measuring the children
            for (let child of this.children) {
                child.measure(availableSize);
                let childSize: Size = child.desiredSize.clone();

                if (child.rotateAngle !== 0) {
                    childSize = rotateSize(childSize, child.rotateAngle);
                }

                let right: number = childSize.width + child.margin.right;
                let bottom: number = childSize.height + child.margin.bottom;
                let childBounds: Rect = new Rect(child.margin.left, child.margin.top, right, bottom);

                if (child.float) {
                    let position: PointModel = child.getAbsolutePosition(childSize);
                    if (position !== undefined) {
                        continue;
                    }
                }

                if (desiredBounds === undefined) {
                    desiredBounds = childBounds;
                } else {
                    desiredBounds.uniteRect(childBounds);
                }
            }
            if (desiredBounds) {
                let leftMargin: number = 0;
                let topMargin: number = 0;

                leftMargin = Math.max(desiredBounds.left, 0);
                topMargin = Math.max(desiredBounds.top, 0);

                desired = new Size(desiredBounds.width + leftMargin, desiredBounds.height + topMargin);
            }
        }

        desired = super.validateDesiredSize(desired, availableSize);
        super.stretchChildren(desired);

        //Considering padding values
        desired.width += this.padding.left + this.padding.right;
        desired.height += this.padding.top + this.padding.bottom;
        this.desiredSize = desired;
        return desired;
    }

    /**
     * Arranges the child elements of the canvas
     */
    public arrange(desiredSize: Size): Size {
        this.outerBounds = new Rect();
        if (this.hasChildren()) {
            let y: number;
            let x: number;
            y = this.offsetY - desiredSize.height * this.pivot.y + this.padding.top;
            x = this.offsetX - desiredSize.width * this.pivot.x + this.padding.left;
            for (let child of this.children) {
                if ((child.transform & Transform.Parent) !== 0) {
                    child.parentTransform = this.parentTransform + this.rotateAngle;

                    let childSize: Size = child.desiredSize.clone();

                    if (child.rotateAngle !== 0) {
                        childSize = rotateSize(childSize, child.rotateAngle);
                    }

                    let topLeft: PointModel;
                    let center: PointModel = { x: 0, y: 0 };

                    let childX: number = x;
                    let childY: number = y;
                    if (child.relativeMode === 'Point') {
                        let position: PointModel = child.getAbsolutePosition(desiredSize);
                        if (position !== undefined) {
                            childX += position.x;
                            childY += position.y;
                        }
                    }
                    if (child.relativeMode === 'Object') {
                        topLeft = this.alignChildBasedOnParent(child, childSize, desiredSize, childX, childY);
                    } else {
                        topLeft = this.alignChildBasedOnaPoint(child, childX, childY, childSize);
                    }

                    center = { x: topLeft.x + childSize.width / 2, y: topLeft.y + childSize.height / 2 };

                    super.findChildOffsetFromCenter(child, center);
                }
                child.arrange(child.desiredSize);
                this.outerBounds.uniteRect(child.outerBounds);
            }
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.outerBounds.uniteRect(this.bounds);
        return desiredSize;
    }

    /**
     * Aligns the child element based on its parent
     * @param child 
     * @param childSize 
     * @param parentSize 
     * @param x 
     * @param y 
     */
    private alignChildBasedOnParent(child: DiagramElement, childSize: Size, parentSize: Size, x: number, y: number): PointModel {
        switch (child.horizontalAlignment) {
            case 'Auto':
            case 'Left':
                x += child.margin.left;
                break;
            case 'Right':
                x += parentSize.width - childSize.width - child.margin.right;
                break;
            case 'Stretch':
            case 'Center':
                x += parentSize.width / 2 - childSize.width / 2;
                break;
        }

        switch (child.verticalAlignment) {
            case 'Auto':
            case 'Top':
                y += child.margin.top;
                break;
            case 'Bottom':
                y += parentSize.height - childSize.height - child.margin.bottom;
                break;
            case 'Stretch':
            case 'Center':
                y += parentSize.height / 2 - childSize.height / 2;
                break;
        }

        return { x: x, y: y };
    }

    /**
     * Aligns the child elements based on a point
     * @param child 
     * @param x 
     * @param y 
     */
    private alignChildBasedOnaPoint(child: DiagramElement, x: number, y: number, childSize: Size): PointModel {
        x += child.margin.left - child.margin.right;
        y += child.margin.top - child.margin.bottom;
        switch (child.horizontalAlignment) {
            case 'Auto':
            case 'Left':
                x = x;
                break;
            case 'Stretch':
            case 'Center':
                x -= childSize.width * child.pivot.x;
                break;
            case 'Right':
                x -= childSize.width;
                break;
        }
        switch (child.verticalAlignment) {
            case 'Auto':
            case 'Top':
                y = y;
                break;
            case 'Stretch':
            case 'Center':
                y -= childSize.height * child.pivot.y;
                break;
            case 'Bottom':
                y -= childSize.height;
                break;
        }
        return { x: x, y: y };
    }
}