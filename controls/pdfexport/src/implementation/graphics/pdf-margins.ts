/**
 * PdfMargins.ts class for EJ2-PDF
 * A class representing PDF page margins.
 */
export class PdfMargins {
    /**
     * Represents the `Left margin` value.
     * @private
     */
    private leftMargin : number;
    /**
     * Represents the `Top margin` value.
     * @private
     */
    private topMargin : number;
    /**
     * Represents the `Right margin` value.
     * @private
     */
    private rightMargin : number;
    /**
     * Represents the `Bottom margin` value.
     * @private
     */
    private bottomMargin : number;
    /**
     * Represents the `Default Page Margin` value.
     * @default 0.0
     * @private
     */
    private readonly pdfMargin : number = 40.0;
    /**
     * Initializes a new instance of the `PdfMargins` class.
     * @private
     */
    constructor() {
        this.setMargins(this.pdfMargin);
    }
    //Properties
    /**
     * Gets or sets the `left margin` size.
     * @private
     */
    public get left() : number {
        return this.leftMargin;
    }
    public set left(value : number) {
        this.leftMargin = value;
    }
    /**
     * Gets or sets the `top margin` size.
     * @private
     */
    public get top() : number {
        return this.topMargin;
    }
    public set top(value : number) {
        this.topMargin = value;
    }
    /**
     * Gets or sets the `right margin` size.
     * @private
     */
    public get right() : number {
        return this.rightMargin;
    }
    public set right(value : number) {
        this.rightMargin = value;
    }
    /**
     * Gets or sets the `bottom margin` size.
     * @private
     */
    public get bottom() : number {
        return this.bottomMargin;
    }
    public set bottom(value : number) {
        this.bottomMargin = value;
    }
    /**
     * Sets the `margins`.
     * @private
     */
    public set all(value : number) {
        this.setMargins(value);
    }
    /**
     * Sets the `margins`.
     * @private
     */
    public setMargins(margin1 : number) : void
    /**
     * Sets the `margins`.
     * @private
     */
    public setMargins(margin1 : number, margin2 : number) : void
    /**
     * Sets the `margins`.
     * @private
     */
    public setMargins(margin1 : number, margin2 : number, margin3 : number, margin4 : number) : void
    public setMargins(margin1 : number, margin2? : number, margin3? : number, margin4? : number) : void {
        if (typeof margin2 === 'undefined') {
            this.leftMargin = this.topMargin = this.rightMargin = this.bottomMargin = margin1;
        } else {
            if (typeof margin3 === 'undefined') {
                this.leftMargin = this.rightMargin = margin1;
                this.bottomMargin = this.topMargin = margin2;
            } else {
                this.leftMargin = margin1;
                this.topMargin = margin2;
                this.rightMargin = margin3;
                this.bottomMargin = margin4;
            }
        }
    }
    /**
     * `Clones` the object.
     * @private
     */
    public clone() : PdfMargins {
        return this;
    }
}