/**
 * Size defines and processes the size(width/height) of the objects
 */
export class Size {

    /**
     * Sets the height of an object
     *
     * @default 0
     */
    public height: number;

    /**
     * Sets the width of an object
     *
     * @default 0
     */
    public width: number;

    constructor(width?: number, height?: number) {
        this.width = width;
        this.height = height;
    }



    /**
     * isEmpty method \
     *
     * @returns { boolean } isEmpty method .\
     *
     * @private
     */
    public isEmpty(): boolean {
        return this.height === 0 && this.width === 0;
    }

    // public static get empty(): Size {
    //     return new Size();
    // }

    // public get isEmpty(): boolean {
    //     return this.equals(Size.empty);
    // }

    // public equals(size2: Size): boolean {
    //     return this.width === size2.width && this.height === size2.height;
    // }

    // public union(size: Size): void {
    //     size.width = Math.max(size.width, this.width);
    //     size.height = Math.max(size.height, this.height);
    // }




    /**
     * clone method \
     *
     * @returns { Size } clone method .\
     *
     * @private
     */
    public clone(): Size {
        return new Size(this.width, this.height);
    }
}
