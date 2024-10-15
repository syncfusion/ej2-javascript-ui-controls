import { HorizontalAlignment, VerticalAlignment, UnitMode, RotateTransform, RelativeMode, ElementAction } from '../../enum/enum';
import { ShapeStyleModel, MarginModel } from '../appearance-model';
import { Size } from '../../primitives/size';
import { PointModel } from '../../primitives/point-model';
import { Rect } from '../../primitives/rect';
import { getBounds } from '../../utility/base-util';
import { IRotateValue } from '../../objects/interface/IElement';

/**
 * DiagramElement module defines the basic unit of diagram
 */
export class DrawingElement {
    /**
     * Sets the unique id of the element
     */
    public id: string;

    /**
     * Sets/Gets the reference point of the element
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let stackPanel: StackPanel = new StackPanel();
     * stackPanel.offsetX = 300; stackPanel.offsetY = 200;
     * stackPanel.width = 100; stackPanel.height = 100;
     * stackPanel.style.fill = 'red';
     * stackPanel.pivot = { x: 0.5, y: 0.5 };
     * let diagram: Diagram = new Diagram({
     * ...
     * basicElements: [stackPanel],
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     */
    public pivot: PointModel = { x: 0.5, y: 0.5 };

    public rotateValue: IRotateValue = { x: 0, y: 0, angle: 0 };


    /**
     * Sets or gets whether the content of the element needs to be measured
     */
    public isDirt: boolean = true;

    /**
     * Sets/Gets the x-coordinate of the element
     */
    public offsetX: number = 0;

    /**
     * Sets/Gets the y-coordinate of the element
     */
    public offsetY: number = 0;

    /**
     * Set the corner of the element
     */
    public cornerRadius: number = 0;

    /**
     * Sets/Gets the minimum height of the element
     */
    public minHeight: number = undefined;

    /**
     * Sets/Gets the minimum width of the element
     */
    public minWidth: number = undefined;

    /**
     * Sets/Gets the maximum width of the element
     */
    public maxWidth: number = undefined;

    /**
     * Sets/Gets the maximum height of the element
     */
    public maxHeight: number = undefined;

    /**
     * Sets/Gets the width of the element
     */
    public width: number = undefined;

    /**
     * Sets/Gets the height of the element
     */
    public height: number = undefined;

    /**
     * Sets/Gets how the element has to be horizontally arranged with respect to its immediate parent
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     */
    public horizontalAlignment: HorizontalAlignment = 'Auto';

    /**
     * Sets/Gets how the element has to be vertically arranged with respect to its immediate parent
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     */
    public verticalAlignment: VerticalAlignment = 'Auto';

    /**
     * Sets or gets whether the content of the element to be visible
     */
    public visible: boolean = true;

    /**
     * Sets/Gets the rotate angle of the element
     */
    public rotateAngle: number = 0;

    /**
     * Sets/Gets the margin of the element
     */
    public margin: MarginModel = { left: 0, right: 0, top: 0, bottom: 0 };
    /**
     * Sets whether the element has to be aligned with respect to a point/with respect to its immediate parent
     * * Point - Diagram elements will be aligned with respect to a point
     * * Object - Diagram elements will be aligned with respect to its immediate parent
     */
    public relativeMode: RelativeMode = 'Point';

    /**
     * Sets whether the element has to be transformed based on its parent or not
     * * Self - Sets the transform type as Self
     * * Parent - Sets the transform type as Parent
     */
    /** @private */
    public transform: RotateTransform = RotateTransform.Self | RotateTransform.Parent;

    /**
     * Sets the style of the element
     */
    public style: ShapeStyleModel = { fill: 'white', strokeColor: 'black', opacity: 1, strokeWidth: 1 };

    /**
     * Gets the minimum size that is required by the element
     */
    public desiredSize: Size = new Size();

    /**
     * Gets the size that the element will be rendered
     */
    public actualSize: Size = new Size();

    /**
     * Gets the rotate angle that is set to the immediate parent of the element
     */
    public parentTransform: number = 0;

    /** @private */
    public preventContainer: boolean = false;

    /**
     * Gets/Sets the boundary of the element
     */
    public bounds: Rect = new Rect(0, 0, 0, 0);

    /**
     * Gets/Sets the corners of the rectangular bounds
     */
    /** @private */
    public corners: Corners;

    /**
     * Gets/Sets the print id
     */
    /** @private */
    public printID: string;

    /**
     * Defines whether the element has to be measured or not
     */
    public staticSize: boolean = false;

    /**
     * check whether the element is rect or not
     */
    /** @private */
    public isRectElement: boolean = false;

    /** @private */
    public isCalculateDesiredSize: boolean = true;

    /**
     * Defines whether the element is group or port
     */
    /** @private */
    public elementActions: ElementAction = ElementAction.None;

    // public constructor() {
    //     this.id = randomId();
    // }
    /**
     * Sets the offset of the element with respect to its parent
     * @param x 
     * @param y 
     * @param mode 
     */
    public setOffsetWithRespectToBounds(x: number, y: number, mode: UnitMode): void {
        this.unitMode = mode;
        this.position = { x: x, y: y };
    }

    /**
     * Gets the position of the element with respect to its parent
     * @param size 
     */
    public getAbsolutePosition(size: Size): PointModel {
        if (this.position !== undefined) {
            if (this.unitMode === 'Absolute') {
                return this.position;
            } else {
                return {
                    x: this.position.x * size.width, y: this.position.y * size.height
                };
            }
        }
        return undefined;
    }

    //private variables
    private position: PointModel = undefined;
    private unitMode: UnitMode = undefined;
    /**   @private  */
    public float: boolean = false;
    public get outerBounds(): Rect {
        return this.floatingBounds || this.bounds;
    }

    /**
     * used to set the outer bounds value
     * @private
     */
    public set outerBounds(bounds: Rect) {
        this.floatingBounds = bounds;
    }

    private floatingBounds: Rect = undefined;

    /**
     * Measures the minimum space that the element requires
     * @param availableSize 
     */
    public measure(availableSize: Size): Size {
        let width: number = this.width !== undefined ? this.width : (availableSize.width || 0) - this.margin.left - this.margin.right;
        let height: number = this.height !== undefined ? this.height : (availableSize.height || 0) - this.margin.top - this.margin.bottom;
        this.desiredSize = new Size(width, height);
        if (this.isCalculateDesiredSize) {
            this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        }
        return this.desiredSize;
    }

    /**
     * Arranges the element
     * @param desiredSize 
     */
    public arrange(desiredSize: Size): Size {
        this.actualSize = desiredSize;
        this.updateBounds();
        return this.actualSize;
    }

    /**
     * Updates the bounds of the element
     */
    public updateBounds(): void {
        this.bounds = getBounds(this);
    }

    /**
     * Validates the size of the element with respect to its minimum and maximum size
     * @param desiredSize 
     * @param availableSize 
     */
    protected validateDesiredSize(desiredSize: Size, availableSize: Size): Size {
        //Empty canvas
        if (this.isRectElement && !this.width && !this.minWidth && !this.maxWidth) {
            desiredSize.width = 50;
        }
        if (this.isRectElement && !this.height && !this.minHeight && !this.maxHeight) {
            desiredSize.height = 50;
        }
        if (desiredSize === undefined || this.width !== undefined &&
            this.height !== undefined) {
            desiredSize = desiredSize || new Size();
            desiredSize.width = this.width === undefined ? (availableSize.width || 0)
                - this.margin.left - this.margin.right : this.width;
            desiredSize.height = this.height === undefined ? (availableSize.height || 0)
                - this.margin.top - this.margin.bottom : this.height;
        }

        //Considering min values
        if (this.minWidth !== undefined) {
            desiredSize.width = Math.max(desiredSize.width, this.minWidth);
        }
        if (this.minHeight !== undefined) {
            desiredSize.height = Math.max(desiredSize.height, this.minHeight);
        }

        //Considering max values
        if (this.maxWidth !== undefined) {
            desiredSize.width = Math.min(desiredSize.width, this.maxWidth);
        }
        if (this.maxHeight !== undefined) {
            desiredSize.height = Math.min(desiredSize.height, this.maxHeight);
        }
        return desiredSize;
    }

}

/** @private */
export interface Corners {
    topLeft: PointModel;
    topCenter: PointModel;
    topRight: PointModel;
    middleLeft: PointModel;
    center: PointModel;
    middleRight: PointModel;
    bottomLeft: PointModel;
    bottomCenter: PointModel;
    bottomRight: PointModel;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}
