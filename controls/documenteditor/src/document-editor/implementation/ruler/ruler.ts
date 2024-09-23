/* eslint-disable @typescript-eslint/ban-types */
import { HelperMethods } from '../editor/editor-helper';
import { RulerHelper } from '../utility/dom-util';
import { Size } from '../utility/size';

/**
 * Set of TickAlignment available for Ruler.
 *
 * @private
 */
export type TickAlignment = 'LeftOrTop' | 'RightOrBottom';

/**
 * Set of orientations available for Ruler.
 *
 * @private
 */
export type RulerOrientation = 'Horizontal' | 'Vertical';

/**
 * Interface for a class Point
 *
 * @private
 */
export interface PointModel {

    /**
     * Sets the x-coordinate of a position
     *
     * @default 0
     */
    x?: number;

    /**
     * Sets the y-coordinate of a position
     *
     * @default 0
     */
    y?: number;

}
/**
 * @private
 */
export class Ruler {
    /**
     * Defines the unique interval of the ruler.
     *
     * @default 6
     */
    public interval: number = 4;

    /**
     * Sets the segment width of the ruler.
     *
     * @default 36
     */
    public segmentWidth: number = 47.9988;

    /**
     * Defines the orientation of the ruler.
     *
     * @default 'Horizontal'
     */
    public orientation: RulerOrientation = 'Horizontal';

    /**
     * Defines the alignment of the tick in the ruler.
     *
     *
     * @default 'RightOrBottom'
     */
    public tickAlignment: TickAlignment = 'RightOrBottom';

    /**
     * Defines the color of the marker.
     *
     * @default 'red'
     */
    public markerColor: string = 'red';

    /**
     * Defines the thickness of the ruler.
     *
     * @default 15
     */
    public thickness: number = 15;

    /**
     * Sets the segment width of the ruler.
     *
     * @default null
     * @deprecated
     */
    public arrangeTick: Function | string = null;

    /**
     * Defines the length of the ruler.
     *
     * @default 400
     */
    public length: number = 400;

    /**   @private  */
    public offset: number = 0;
    /**   @private  */
    public scale: number = 1;
    /**   @private  */
    public startValue: number;
    /**   @private  */
    public defStartValue: number;
    /**   @private  */
    public hRulerOffset: number;
    /**   @private  */
    public vRulerOffset: number;
    /**   @private  */
    public startMargin: number;
    /**   @private  */
    public endMargin: number;
    // /**   @private  */
    // public pageWidth: number;
    /**   @private  */
    public pageHeight: number;
    /**   @private  */
    public rulerStartValue: number = 1584;
    /**   @private  */
    public zeroPosition: number = HelperMethods.convertPointToPixel(1584);

    /**   @private  */
    public addSegmentWidth: boolean = false;

    /**
     * @private
     */
    public rulerHelper: RulerHelper;

    /**
     * @private
     */
    public element: HTMLElement;

    private rulerSpacediv: HTMLElement;
    private rulerSVGElement: SVGElement;

    /**
     *  Constructor for creating the Ruler Component
     *
     * @param {string | HTMLElement} element The ruler element.
     * @param {RulerHelper} rulerHelper The ruler helper.
     */
    constructor(element: HTMLElement, rulerHelper: RulerHelper) {
        this.element = element;
        this.rulerHelper = rulerHelper;
    }


    /**
     * @private
     * @returns {void} To append the ruler
     */
    public appendTo(): void {
        this.preRender();
        this.render();
    }

    /**
     * Initializes the values of private members.
     *
     * @returns {void}  Initializes the values of private members.
     * @private
     */
    protected preRender(): void {
        this.unWireEvents();
        this.wireEvents();
    }
    /**
     * Renders the rulers.
     *
     * @returns {void}  Renders the rulers.
     * @private
     */
    public render(): void {
        this.updateRulerGeometry();
        //this.renderComplete();
    }
    /**
     * Core method to return the component name.
     *
     * @returns {string}  Core method to return the component name.
     * @private
     */
    public getModuleName(): string {
        return 'Ruler';
    }
    /**
     *To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */
    public destroy(): void {
        this.unWireEvents();
        // this.notify('destroy', {});
        // super.destroy();
        if (this.rulerSpacediv) {
            this.rulerSpacediv.remove();
            this.rulerSpacediv = null;
        }
        if (this.rulerSVGElement) {
            this.rulerSVGElement.childNodes.forEach((element: HTMLElement) => {
                this.rulerSVGElement.removeChild(element);
                element = null;
            });
            this.rulerSVGElement.innerHTML = '';
            this.rulerSVGElement.remove();
            this.rulerSVGElement = null;
        }
        this.element.classList.remove('e-ruler');
    }

    /**
     * Refreshes the ruler when the Ruler properties are updated\
     *
     * @returns {  void}    Refreshes the ruler when the Ruler properties are updated .\
     * @param {RulerModel} newProp - provide the newProp value.
     * @param {RulerModel} oldProp - provide the oldProp value.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // public onPropertyChanged(newProp: RulerModel, oldProp: RulerModel): void {
    //     for (const prop of Object.keys(newProp)) {
    //         switch (prop) {
    //             case 'interval':
    //             case 'segmentWidth':
    //             case 'tickAlignment':
    //             case 'markerColor':
    //             case 'thickness':
    //                 this.updateRuler();
    //                 break;
    //         }
    //     }

    // }
    /**
     * @param {boolean} show - provide the show value.
     * @private
     * @returns {void} To show or hide the ruler
     */
    public showHideRuler(show: boolean): void {
        if (show) {
            this.element.style.display = 'block';

        } else {
            this.element.style.display = 'none';
        }
    }
    private updateRulerGeometry(): void {
        this.element.style.textAlign = 'left';
        this.renderRulerSpace();
        this.updateRuler();
    }

    private renderRulerSpace(): HTMLElement {
        const rulerGeometry: Size = this.getRulerGeometry();
        this.rulerSpacediv = document.getElementById(this.element.id + '_ruler_space');
        if (!this.rulerSpacediv) {
            this.rulerSpacediv  = this.rulerHelper.createHtmlElement('div', {
                'id': this.element.id + '_ruler_space',
                'style': 'height:' + rulerGeometry.height + 'px;width:' + rulerGeometry.width + 'px;cssFloat:' + 'left;'
            });
            this.element.appendChild(this.rulerSpacediv );
        }
        return this.rulerSpacediv ;
    }

    /**
     * @private
     *
     * @returns {void} To update the ruler
     */
    public updateRuler(): void {
        const rulerSize: number = this.getRulerSize();
        const rulerGeometry: Size = this.getRulerGeometry();
        let length: number = 0;
        let offset: number = 0;
        const availableSize: Size = new Size();
        this.rulerSVGElement = this.getRulerSVG(rulerGeometry);
        if (this.rulerSVGElement) {
            length = this.length;
            availableSize.height = rulerSize;
            offset = this.offset;
            if (length && length !== Infinity) {
                const unitLength: number = length;
                const unitOffset: number = offset;
                this.updateSegments(unitOffset, (unitLength + Math.abs(unitOffset)), this.rulerSVGElement, rulerSize);
            }
        }
    }

    private updateSegments(start: number, end: number, svg: SVGElement, rulerSize: number): void {
        let run: number = start;
        const trans: SegmentTranslation = { trans: 0 };
        this.rulerStartValue = HelperMethods.convertPixelToPoint(this.zeroPosition);
        while (run < end) {
            const rulerSegment: RulerSegment = this.getNewSegment(run, svg);
            if (rulerSegment) {
                svg.appendChild(rulerSegment.segment);
                run = this.updateSegment(start, end, rulerSegment, run, trans, rulerSize);
            }
        }
        this.addSegmentWidth = false;
    }

    private updateSegment(
        start: number, end: number, rulerSegment: RulerSegment, run: number,
        trans: SegmentTranslation, rulerSize: number): number {
        const segWidth: number = this.updateSegmentWidth(this.scale);
        if (run === start) {
            this.startValue = Math.floor(start / segWidth) * segWidth / this.scale;
            this.startValue = (this.startValue % 1) !== 0 ? Number((this.startValue).toFixed(1)) : this.startValue;
            rulerSegment.label.textContent = this.rulerStartValue.toString();
            this.defStartValue = run = this.startValue * this.scale;
            if (this.orientation === 'Horizontal') {
                this.hRulerOffset = start - run;
            } else {
                this.vRulerOffset = start - run;
            }
        } else {
            //  this.startValue = (run / this.scale);
            this.startValue = HelperMethods.convertPixelToPoint(run);
            this.startValue = (this.startValue % 1) !== 0 ? Number((this.startValue).toFixed(1)) : this.startValue;
            //  rulerSegment.label.textContent = (this.startValue).toString();
            let labeltext: number;
            if (this.rulerStartValue === 0) {
                this.addSegmentWidth = true;
            }
            if (this.addSegmentWidth) {
                labeltext = Math.abs(this.rulerStartValue + 36);
            }
            else {
                labeltext = Math.abs(this.rulerStartValue - 36);
            }
            // const labeltext = this.subtractAndAdd(this.rulerStartValue, 36);
            rulerSegment.label.textContent = (labeltext).toString();
            this.rulerStartValue = labeltext;
            //  if (this.addSegmentWidth) {
            //   if ((1584 - this.startValue) <= this.leftMargin && !((1584 -this.startValue) >= (HelperMethods.convertPixelToPoint(this.pageWidth) - this.rightMargin))) {
            //  rulerSegment.label.textContent = (this.startValue - this.leftMargin).toString();
            // if (this.startValue >= 1584 && (Math.round(HelperMethods.convertPointToPixel(this.startValue)) < ((2112 - HelperMethods.convertPointToPixel(this.startMargin)) + ((pageLength) - HelperMethods.convertPointToPixel(this.endMargin))))) {
            //     const rectElement = rulerSegment.segment.querySelector('.e-ruler-segment1') as SVGRectElement;
            //     var rect = rulerSegment.segment.firstChild;
            //     rectElement.setAttribute("fill", "white");
            // }
            //}
        }
        this.updateTickLabel(rulerSegment, rulerSize);
        const translate: string = (this.orientation === 'Horizontal') ? ((trans.trans + 0.5) + ',0.5') : ('0.5,' + (trans.trans + 0.5));
        rulerSegment.segment.setAttribute('transform', 'translate(' + translate + ') scale(' + 1 + ',1)');
        trans.trans += segWidth * this.scale;
        run += segWidth;
        return run;
    }

    private updateTickLabel(rulerSegment: RulerSegment, rulerSize: number): void {
        const bBox: DOMRect = ((rulerSegment.segment.lastChild as SVGTextElement).getBBox() as DOMRect);
        const isHorizontal: boolean = (this.orientation === 'Horizontal') ? true : false;
        const isRightOrBottom: boolean = (this.tickAlignment === 'RightOrBottom') ? true : false;
        let x: number = isHorizontal ? -4 : 0;
        let y: number = isHorizontal ? (isRightOrBottom ? (rulerSize / 2 + (11 / 2) - (11 / 2)) :
            (rulerSize / 2 + (11 / 2))) : bBox.height;
        if (isHorizontal) {
            y = y + 2;
        }
        if (!isHorizontal) {
            x = x + 10;
            y = y + 2;
        }
        const translate: string = isRightOrBottom ? (-(bBox.width + 2) + ',' + ((rulerSize / 2) - bBox.height)) :
            (-(bBox.width + 2) + ',' + ((rulerSize / 2) - bBox.height / 2));
        const attr: Object = isHorizontal ? { 'x': x, 'y': y } :
            { 'x': x, 'y': y, 'transform': 'rotate(270)' + 'translate(' + translate + ')' };
        this.rulerHelper.setAttributeSvg(rulerSegment.segment.lastChild as SVGElement, attr);
    }

    private getNewSegment(run: number, svg: SVGElement): RulerSegment {
        const segment: SVGElement = this.createNewTicks(run, svg);
        const label: SVGTextElement = (this.createTickLabel(svg, segment) as SVGTextElement);
        return { segment: segment, label: label };
    }

    private createNewTicks(run: number, svg: SVGElement): SVGElement {
        let tick: SVGElement;
        let tickInterval: number;
        const segmentWidth: number = this.updateSegmentWidth(this.scale);
        //let g: SVGElement;
        const attr: Object = { 'class': 'e-de-ruler-segment' };
        const g: SVGElement = this.rulerHelper.createSvgElement('g', attr);
        //let rect: SVGElement;
        const rectattr: Object = { 'class': 'e-de-ruler-segment1' };
        const rect: SVGElement = this.rulerHelper.createSvgElement('rect', rectattr);
        const width: number = this.orientation === 'Horizontal' ? (segmentWidth * this.scale) : 15;
        const height: number = this.orientation === 'Horizontal' ? 15 : segmentWidth;
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', width.toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('fill', 'lightgrey');
        // g.appendChild(rect);
        for (let i: number = 0; i < this.interval; i++) {
            tickInterval = segmentWidth / this.interval;
            tick = this.createTick(svg, tickInterval, i + 1, run);
            if (tick) {
                g.appendChild(tick);
            }
        }
        return g;
    }

    private getLinePoint(svg: SVGElement, tickInterval: number, length: number): number {
        const segmentWidth: number = this.updateSegmentWidth(this.scale);
        const rulerSize: number = this.getRulerSize();
        tickInterval = tickInterval * (length - 1);
        length = ((tickInterval % segmentWidth) === 0) ? rulerSize : rulerSize * 0.3;
        return length;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private createTick(svg: SVGElement, tickInterval: number, length: number, run: number): SVGElement {
        let ruler: Ruler;
        //let line: SVGElement;
        const linePoint: number = this.getLinePoint(svg, tickInterval, length);
        const rulerSize: number = this.getRulerSize();
        //let args: IArrangeTickOptions;
        //let attr: Object;
        const isHorizontal: boolean = (this.orientation === 'Horizontal') ? true : false;
        const isRightOrBottom: boolean = (this.tickAlignment === 'RightOrBottom') ? true : false;
        // const arrangeTick: Function = getFunction(this.arrangeTick);
        // // eslint-disable-next-line
        // const args:IArrangeTickOptions = { ruler: ruler, tickLength: linePoint, tickInterval: ((this.segmentWidth / this.interval) * (length - 1)) };
        // if (arrangeTick) {
        //     arrangeTick(args);
        // }
        // linePoint = args.tickLength;

        const point: number = tickInterval * (length - 1) * this.scale;
        let x1: number = isHorizontal ? point : (isRightOrBottom ? rulerSize : 0);
        let x2: number = isHorizontal ? point : (isRightOrBottom ? (rulerSize - linePoint) : (rulerSize - (rulerSize - linePoint)));
        let y1: number = isHorizontal ? (isRightOrBottom ? rulerSize : (rulerSize - (rulerSize - linePoint))) : point;
        let y2: number = isHorizontal ? (isRightOrBottom ? (rulerSize - linePoint) : 0) : point;
        let line: SVGElement;
        if (y2 !== 0) {
            y1 = y1 - 6;
            y2 = y2 - 6;
            if (!isHorizontal) {
                x1 = x1 - 6;
                x2 = x2 - 6;
            }
            const attr: Object = { 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'stroke-width': '0.25', 'stroke': 'black' };
            line = this.rulerHelper.createSvgElement('line', attr);
            line.setAttribute('class', 'e-de-ruler-tick');
        }
        return line;
    }

    private createTickLabel(svg: SVGElement, segment: SVGElement): SVGElement {
        let text: SVGElement;
        if (segment) {
            const attr: Object = { 'class': 'e-de-ruler-tick-label', 'style': 'font-weight: 400' };
            text = this.rulerHelper.createSvgElement('text', attr);
            segment.appendChild(text);
        }
        return text;
    }

    /**
     * @private
     * @param {number} scale
     */

    /**
     * updateSegmentWidth method\
     *
     * @returns {number}    updateSegmentWidth method .\
     * @param {string} scale - provide the scale value.
     *
     * @private
     */
    public updateSegmentWidth(scale: number): number {
        if (this.segmentWidth !== 100) {
            return this.segmentWidth;
        }
        const five: number = 25;
        let multiples: number = 1;
        let div: number;
        //let scaleRound: number;
        const fifty: number = 100;
        const scaleRound: number = Math.pow(2, Math.round(Math.log(scale) / Math.log(2)));
        div = fifty;
        div = (fifty / scaleRound);
        while (div > 100) {
            multiples /= 10;
            div /= 10;
        }
        while (div < 25) {
            multiples *= 10;
            div *= 10;
        }
        if (div >= five && div % five !== 0) {
            div = Math.round(div / five) * five;
        }
        return div * scale / multiples;
    }

    // private createMarkerLine(rulerSvg: SVGSVGElement, rulerObj: HTMLElement, attr: Object): SVGElement {
    //     let line: SVGElement;
    //     if (rulerObj) {
    //         line = rulerSvg.getElementById(rulerObj.id + '_marker') as SVGElement;
    //         if (line) {
    //             line.parentNode.removeChild(line);
    //         }
    //         line = this.rulerHelper.createSvgElement('line', attr);
    //     }
    //     return line;
    // }


    // /**
    //  * updateSegmentWidth method\
    //  *
    //  * @returns {void}    updateSegmentWidth method .\
    //  * @param {HTMLElement} rulerObj - Defines the ruler Object
    //  * @param {PointModel} currentPoint - Defines the current point for ruler Object
    //  * @param {number} offset - Defines the offset ruler Object
    //  *
    //  * @private
    //  */
    // public drawRulerMarker(rulerObj: HTMLElement, currentPoint: PointModel, offset: number): void {
    //     let rulerSvg: SVGSVGElement;
    //     let rulerSize: number;
    //     let scale: number;
    //     let diff: number;
    //     let i: number;
    //     let attr: Object;
    //     let line: SVGElement;
    //     const isHorizontal: boolean = this.orientation === 'Horizontal' ? true : false;
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     const rulerSvgElements: NodeListOf<SVGSVGElement> | any = rulerObj.getElementsByTagName('svg');
    //     for (i = 0; i < rulerSvgElements.length; i++) {
    //         if (rulerSvgElements[parseInt(i.toString(), 10)]) {
    //             rulerSvg = rulerSvgElements[parseInt(i.toString(), 10)];
    //         }
    //         break;
    //     }
    //     if (rulerSvg) {
    //         rulerSize = this.getRulerSize();
    //         attr = {
    //             'id': rulerObj.id + '_marker', 'x1': 0, 'y1': 0, 'x2': (isHorizontal ? 0 : rulerSize),
    //             'y2': (isHorizontal ? rulerSize : 0), 'stroke': this.markerColor, 'stroke-width': 1.5,
    //             'class': 'e-d-ruler-marker'
    //         };
    //         line = this.createMarkerLine(rulerSvg, rulerObj, attr);
    //         scale = this.scale;
    //         diff = this.offset - this.defStartValue;
    //         const point: number = isHorizontal ? currentPoint.x : currentPoint.y;
    //         const move: number = (point * scale) + offset + diff;
    //         line.setAttribute('transform', 'translate(' + (isHorizontal ? ((move + 0.5) + ' 0.5') : ('0.5 ' + (move + 0.5))) + ')');
    //         rulerSvg.appendChild(line);
    //     }
    // }

    private getRulerGeometry(): Size {
        if (this.orientation === 'Horizontal') {
            return new Size(
                this.length,
                this.element ? this.element.getBoundingClientRect().height : 0
            );
        } else {
            return new Size(
                this.element ? this.element.getBoundingClientRect().width : 0,
                this.length
            );
        }
    }

    private getRulerSize(): number {
        return this.thickness;
    }

    private getRulerSVG(rulerGeometry: Size): SVGElement {
        let rulerSpace: HTMLElement;
        const rulerSize: number = this.getRulerSize();
        let svg: SVGElement;
        if (this.element) {
            rulerSpace = document.getElementById(this.element.id + '_ruler_space');
            if (rulerSpace) {
                const attr: Object = {
                    'id': this.element.id + '_Ruler_svg',
                    width: this.orientation === 'Horizontal' ? this.length : rulerSize + 'px',
                    height: this.orientation === 'Horizontal' ? rulerSize : (rulerGeometry.height) + 'px',
                    style: 'position:inherit;'
                };
                svg = this.rulerHelper.createSvgElement('svg', attr);
                if (rulerSpace.childNodes.length > 0) {
                    for (let i: number = rulerSpace.childNodes.length - 1; i >= 0; i--) {
                        rulerSpace.childNodes[parseInt(i.toString(), 10)].parentNode.removeChild(
                            rulerSpace.childNodes[parseInt(i.toString(), 10)]);
                    }
                }
                rulerSpace.appendChild(svg);
            }
        }
        return svg;
    }


    /**
     * Method to bind events for the ruler \
     *
     * @returns {void}    Method to bind events for the ruler .\
     * @private
     */
    private wireEvents(): void {
        //wire Events
    }


    /**
     *  Method to unbind events for the ruler \
     *
     * @returns {void}     Method to unbind events for the ruler .\
     * @private
     */
    private unWireEvents(): void {
        //unWire Events
    }
}

/**
 * @private
 */
export interface RulerSegment {
    segment: SVGElement;
    label: SVGTextElement;
}


/**
 * @private
 */
export interface SegmentTranslation {
    trans: number;
}
