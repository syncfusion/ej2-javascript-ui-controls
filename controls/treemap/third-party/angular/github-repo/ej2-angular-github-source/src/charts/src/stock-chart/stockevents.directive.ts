import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['background', 'border', 'date', 'description', 'placeAt', 'seriesIndexes', 'showOnSeries', 'text', 'textStyle', 'type'];
let outputs: string[] = [];
/**
 * StockEvents
 * ```html
 * <e-stockchart-stockevents>
 * <e-stockchart-stockevent></e-stockchart-stockevent>
 * </e-stockchart-stockevents>
 * ```
 */
@Directive({
    selector: 'e-stockchart-indicators>e-stockchart-stockevent',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StockEventDirective extends ComplexBase<StockEventDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies type of stock events 
     * * Circle 
     * * Square 
     * * Flag 
     * * Text 
     * * Sign 
     * * Triangle 
     * * InvertedTriangle 
     * * ArrowUp 
     * * ArrowDown 
     * * ArrowLeft 
     * * ArrowRight
     * @default 'Circle'
     */
    public declare type: any;
    /** 
     * The background of the stock event that accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    public declare background: any;
    /** 
     * Options to customize the border of the stock events.
     */
    public declare border: any;
    /** 
     * Date value of stock event in which stock event shows.
     */
    public declare date: any;
    /** 
     * Specifies the description for the chart which renders in tooltip for stock event.
     */
    public declare description: any;
    /** 
     * Corresponding values in which stock event placed. 
     * * Close 
     * * Open 
     * * High 
     * * Close
     * @default 'close'
     */
    public declare placeAt: any;
    /** 
     * To render stock events in particular series. 
     * By default stock events will render for all series.
     * @default []
     */
    public declare seriesIndexes: any;
    /** 
     * Enables the stock events to be render on series. If it disabled, stock event rendered on primaryXAxis.
     * @default true
     */
    public declare showOnSeries: any;
    /** 
     * Specifies the text for the stock chart text.
     */
    public declare text: any;
    /** 
     * Options to customize the styles for stock events text.
     */
    public declare textStyle: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * StockEvent Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-stockchart>e-stockchart-stockevents',
    standalone: true,
    queries: {
        children: new ContentChildren(StockEventDirective)
    },
})
export class StockEventsDirective extends ArrayBase<StockEventsDirective> {
    constructor() {
        super('stockevents');
    }
}