import { Size } from '../../primitives/size';
import { DrawingElement } from './drawing-element';
import { Rect } from '../../primitives/rect';
import { measurePath } from './../../utility/dom-util';
import { processPathData, splitArrayCollection, transformPath, getPathString } from '../../utility/path-util';
import { PointModel } from '../../primitives/point-model';

/**
 * PathElement takes care of how to align the path based on offsetX and offsetY
 */
export class PathElement extends DrawingElement {
    /**
     * set the id for each element
     */
    public constructor() {
        super();
    }
    /**
     * Gets or sets the geometry of the path element
     */
    private pathData: string = '';

    /**
     * Gets the geometry of the path element
     */
    public get data(): string {
        return this.pathData;
    }
    /**
     * Sets the geometry of the path element
     */
    public set data(value: string) {
        if (this.pathData !== value) {
            this.pathData = value;
            this.isDirt = true;
        }
    }
    /**
     * Gets/Sets whether the path has to be transformed to fit the given x,y, width, height
     */
    public transformPath: boolean = true;

    /**
     * Gets/Sets the equivalent path, that will have the origin as 0,0
     */
    public absolutePath: string = '';

    /**   @private  */
    public canMeasurePath: boolean = false;

    //Private variables
    /**   @private  */
    public absoluteBounds: Rect = new Rect();

    private points: PointModel[];

    private pointTimer: Object;



    /**
     * Measures the minimum space that is required to render the element
     * @param availableSize
     */
    public measure(availableSize: Size): Size {
        //Performance issue - Avoiding measuring the connector path
        if (this.staticSize && this.width !== undefined && this.height !== undefined) {
            this.absoluteBounds = new Rect(
                this.offsetX - this.width * this.pivot.x, this.offsetY - this.height * this.pivot.y,
                this.width, this.height);
        } else if (this.isDirt && (this.transformPath || (this.width === undefined || this.height === undefined))
            && (!this.absoluteBounds || this.absoluteBounds.height === 0) || this.canMeasurePath) {
            //Measure the element only whent the path data is changed/ size is not specified
            this.absoluteBounds = measurePath(this.data ? this.data : '');
        }
        if (this.width === undefined) {
            this.desiredSize = new Size(this.absoluteBounds.width, this.height || this.absoluteBounds.height);
        } else if (this.height === undefined) {
            this.desiredSize = new Size(this.width || this.absoluteBounds.width, this.absoluteBounds.height);
        } else {
            this.desiredSize = new Size(this.width, this.height);
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        this.canMeasurePath = false;
        return this.desiredSize;
    }

    /**
     * Arranges the path element
     * @param desiredSize 
     */
    public arrange(desiredSize: Size): Size {
        if (this.isDirt || this.actualSize.width !== desiredSize.width || this.actualSize.height !== desiredSize.height) {
            this.isDirt = true;
            this.absolutePath = this.updatePath(this.data, this.absoluteBounds, desiredSize);
            if (!this.staticSize) {
                this.points = null;
            }
        }
        this.actualSize = this.desiredSize;
        this.updateBounds();
        this.isDirt = false;
        return this.actualSize;
    }

    /**
     * Translates the path to 0,0 and scales the path based on the actual size
     * @param pathData 
     * @param bounds 
     * @param actualSize 
     */
    public updatePath(pathData: string, bounds: Rect, actualSize: Size): string {
        let isScale: boolean = false;
        let newPathString: string = '';
        let scaleX: number = - bounds.x;
        let scaleY: number = - bounds.y;
        let arrayCollection: Object[] = [];
        if (actualSize.width !== bounds.width || actualSize.height !== bounds.height) {
            scaleX = actualSize.width / Number(bounds.width ? bounds.width : 1);
            scaleY = actualSize.height / Number(bounds.height ? bounds.height : 1);
            isScale = true;
        }
        arrayCollection = processPathData(pathData);
        arrayCollection = splitArrayCollection(arrayCollection);
        if ((isScale || this.isDirt) && this.transformPath) {
            newPathString = transformPath(arrayCollection, scaleX, scaleY, isScale, bounds.x, bounds.y, 0, 0);
        } else {
            newPathString = getPathString(arrayCollection);
        }
        isScale = false;
        return newPathString;
    }
}
