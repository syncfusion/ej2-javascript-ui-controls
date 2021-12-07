/* eslint-disable @typescript-eslint/ban-types */
import { Component, Property } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { RulerModel } from './ruler-model';
import { createSvgElement, createHtmlElement, setAttributeSvg } from '../diagram/utility/dom-util';
import { Size } from '../diagram/primitives/size';
import { IArrangeTickOptions } from './objects/interface/interfaces';
import { PointModel } from '../diagram/primitives/point-model';
import { getFunction } from '../diagram/utility/base-util';



/**
 * Set of TickAlignment available for Ruler.
 */
export type TickAlignment = 'LeftOrTop' | 'RightOrBottom';

/**
 * Set of orientations available for Ruler.
 */
export type RulerOrientation = 'Horizontal' | 'Vertical';


/**
 * Represents the Ruler component that measures the Diagram objects, indicate positions, and align Diagram elements.
 * ```html
 * <div id='ruler'>Show Ruler</div>
 * ```
 * ```typescript
 * <script>
 *   var rulerObj = new Ruler({ showRuler: true });
 *   rulerObj.appendTo('#ruler');
 * </script>
 * ```
 */
export class Ruler extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines the unique interval of the ruler.
     *
     * @default 5
     */
    @Property(5)
    public interval: number;

    /**
     * Sets the segment width of the ruler.
     *
     * @default 100
     */
    @Property(100)
    public segmentWidth: number;

    /**
     * Defines the orientation of the ruler.
     *
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: RulerOrientation;

    /**
     * Defines the alignment of the tick in the ruler.
     *
     *
     * @default 'RightOrBottom'
     */
    @Property('RightOrBottom')
    public tickAlignment: TickAlignment;

    /**
     * Defines the color of the marker.
     *
     * @default 'red'
     */
    @Property('red')
    public markerColor: string;

    /**
     * Defines the thickness of the ruler.
     *
     * @default 25
     */
    @Property(25)
    public thickness: number;

    /**
     * Sets the segment width of the ruler.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public arrangeTick: Function | string;

    /**
     * Defines the length of the ruler.
     *
     * @default 400
     */
    @Property(400)
    public length: number;

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


    /**
     *  Constructor for creating the Ruler Component
     *
     * @param {RulerModel} options The ruler model.
     * @param {string | HTMLElement} element The ruler element.
     */
    constructor(options?: RulerModel, element?: string | HTMLElement) {
        super(options, <HTMLButtonElement | string>element);
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
        this.renderComplete();
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
        this.notify('destroy', {});
        super.destroy();
        this.element.classList.remove('e-ruler');
    }


    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string}  Get the properties to be maintained in the persisted state.
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
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
    public onPropertyChanged(newProp: RulerModel, oldProp: RulerModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'length':
            case 'interval':
            case 'segmentWidth':
            case 'tickAlignment':
            case 'markerColor':
            case 'thickness':
                this.updateRuler();
                break;
            }
        }

    }

    private updateRulerGeometry(): void {
        this.element.style.textAlign = 'left';
        this.renderRulerSpace();
        this.updateRuler();
    }

    private renderRulerSpace(): HTMLElement {
        const rulerGeometry: Size = this.getRulerGeometry();
        let div: HTMLElement = document.getElementById(this.element.id + '_ruler_space');
        if (!div) {
            div = createHtmlElement('div', {
                'id': this.element.id + '_ruler_space',
                'style': 'height:' + rulerGeometry.height + 'px;width:' + rulerGeometry.width + 'px;cssFloat:' + 'left;'
            });
            this.element.appendChild(div);
        }
        return div;
    }

    private updateRuler(): void {
        const rulerSize: number = this.getRulerSize();
        const rulerGeometry: Size = this.getRulerGeometry();
        let length: number = 0;
        let offset: number = 0;
        const availableSize: Size = new Size();
        const svg: SVGElement = this.getRulerSVG(rulerGeometry);
        if (svg) {
            length = this.length;
            availableSize.height = rulerSize;
            offset = this.offset;
            if (length && length !== Infinity) {
                const unitLength: number = length + this.segmentWidth;
                const unitOffset: number = offset;
                this.updateSegments(unitOffset, (unitLength + Math.abs(unitOffset)), svg, rulerSize);
            }
        }
    }

    private updateSegments(start: number, end: number, svg: SVGElement, rulerSize: number): void {
        let run: number = start;
        const trans: SegmentTranslation = { trans: 0 };
        while (run < end) {
            const rulerSegment: RulerSegment = this.getNewSegment(run, svg);
            if (rulerSegment) {
                svg.appendChild(rulerSegment.segment);
                run = this.updateSegment(start, end, rulerSegment, run, trans, rulerSize);
            }
        }
    }

    private updateSegment(
        start: number, end: number, rulerSegment: RulerSegment, run: number,
        trans: SegmentTranslation, rulerSize: number): number {
        const segWidth: number = this.updateSegmentWidth(this.scale);
        if (run === start) {
            this.startValue = Math.floor(start / segWidth) * segWidth / this.scale;
            this.startValue = (this.startValue % 1) !== 0 ? Number((this.startValue).toFixed(1)) : this.startValue;
            rulerSegment.label.textContent = this.startValue.toString();
            this.defStartValue = run = this.startValue * this.scale;
            if (this.orientation === 'Horizontal') {
                this.hRulerOffset = start - run;
            } else {
                this.vRulerOffset = start - run;
            }
        } else {
            this.startValue = (run / this.scale);
            this.startValue = (this.startValue % 1) !== 0 ? Number((this.startValue).toFixed(1)) : this.startValue;
            rulerSegment.label.textContent = this.startValue.toString();
        }
        this.updateTickLabel(rulerSegment, rulerSize);
        const translate: string = (this.orientation === 'Horizontal') ? ((trans.trans + 0.5) + ',0.5') : ('0.5,' + (trans.trans + 0.5));
        rulerSegment.segment.setAttribute('transform', 'translate(' + translate + ')');
        trans.trans += segWidth;
        run += segWidth;
        return run;
    }

    private updateTickLabel(rulerSegment: RulerSegment, rulerSize: number): void {
        const bBox: DOMRect = ((rulerSegment.segment.lastChild as SVGTextElement).getBBox() as DOMRect);
        const isHorizontal: boolean = (this.orientation === 'Horizontal') ? true : false;
        const isRightOrBottom: boolean = (this.tickAlignment === 'RightOrBottom') ? true : false;
        const x: number = isHorizontal ? 2 : 0;
        const y: number = isHorizontal ? (isRightOrBottom ? (rulerSize / 2 + (11 / 2) - (11 / 2)) :
            (rulerSize / 2 + (11 / 2))) : bBox.height;
        const translate: string = isRightOrBottom ? (-(bBox.width + 2) + ',' + ((rulerSize / 2) - bBox.height)) :
            (-(bBox.width + 2) + ',' + ((rulerSize / 2) - bBox.height / 2));
        const attr: Object = isHorizontal ? { 'x': x, 'y': y } :
            { 'x': x, 'y': y, 'transform': 'rotate(270)' + 'translate(' + translate + ')' };
        setAttributeSvg(rulerSegment.segment.lastChild as SVGElement, attr);
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
        const attr: Object = { 'class': 'e-ruler-segment' };
        const g: SVGElement = createSvgElement('g', attr);
        for (let i: number = 0; i < this.interval; i++) {
            tickInterval = segmentWidth / this.interval;
            tick = this.createTick(svg, tickInterval, i + 1, run);
            g.appendChild(tick);
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
        let linePoint: number = this.getLinePoint(svg, tickInterval, length);
        const rulerSize: number = this.getRulerSize();
        //let args: IArrangeTickOptions;
        //let attr: Object;
        const isHorizontal: boolean = (this.orientation === 'Horizontal') ? true : false;
        const isRightOrBottom: boolean = (this.tickAlignment === 'RightOrBottom') ? true : false;
        const arrangeTick: Function = getFunction(this.arrangeTick);
        // eslint-disable-next-line
        const args:IArrangeTickOptions = { ruler: ruler, tickLength: linePoint, tickInterval: ((this.segmentWidth / this.interval) * (length - 1)) };
        if (arrangeTick) {
            arrangeTick(args);
        }
        linePoint = args.tickLength;
        const point: number = tickInterval * (length - 1);
        const x1: number = isHorizontal ? point : (isRightOrBottom ? rulerSize : 0);
        const x2: number = isHorizontal ? point : (isRightOrBottom ? (rulerSize - linePoint) : (rulerSize - (rulerSize - linePoint)));
        const y1: number = isHorizontal ? (isRightOrBottom ? rulerSize : (rulerSize - (rulerSize - linePoint))) : point;
        const y2: number = isHorizontal ? (isRightOrBottom ? (rulerSize - linePoint) : 0) : point;
        const attr: Object = { 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'stroke-width': '1', 'stroke': 'black' };
        const line: SVGElement = createSvgElement('line', attr);
        line.setAttribute('class', 'e-ruler-tick');
        return line;
    }

    private createTickLabel(svg: SVGElement, segment: SVGElement): SVGElement {
        let text: SVGElement;
        if (segment) {
            const attr: Object = { 'class': 'e-ruler-tick-label' };
            text = createSvgElement('text', attr);
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

    private createMarkerLine(rulerSvg: SVGSVGElement, rulerObj: HTMLElement, attr: Object): SVGElement {
        let line: SVGElement;
        if (rulerObj) {
            line = rulerSvg.getElementById(rulerObj.id + '_marker') as SVGElement;
            if (line) {
                line.parentNode.removeChild(line);
            }
            line = createSvgElement('line', attr);
        }
        return line;
    }


    /**
     * updateSegmentWidth method\
     *
     * @returns {void}    updateSegmentWidth method .\
     * @param {HTMLElement} rulerObj - Defines the ruler Object
     * @param {PointModel} currentPoint - Defines the current point for ruler Object
     * @param {number} offset - Defines the offset ruler Object
     *
     * @private
     */
    public drawRulerMarker(rulerObj: HTMLElement, currentPoint: PointModel, offset: number): void {
        let rulerSvg: SVGSVGElement;
        let rulerSize: number;
        let scale: number;
        let diff: number;
        let i: number;
        let attr: Object;
        let line: SVGElement;
        const isHorizontal: boolean = this.orientation === 'Horizontal' ? true : false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rulerSvgElements: NodeListOf<SVGSVGElement> | any = rulerObj.getElementsByTagName('svg');
        for (i = 0; i < rulerSvgElements.length; i++) {
            if (rulerSvgElements[i]) {
                rulerSvg = rulerSvgElements[i];
            }
            break;
        }
        if (rulerSvg) {
            rulerSize = this.getRulerSize();
            attr = {
                'id': rulerObj.id + '_marker', 'x1': 0, 'y1': 0, 'x2': (isHorizontal ? 0 : rulerSize),
                'y2': (isHorizontal ? rulerSize : 0), 'stroke': this.markerColor, 'stroke-width': 1.5,
                'class': 'e-d-ruler-marker'
            };
            line = this.createMarkerLine(rulerSvg, rulerObj, attr);
            scale = this.scale;
            diff = this.offset - this.defStartValue;
            const point: number = isHorizontal ? currentPoint.x : currentPoint.y;
            const move: number = (point * scale) + offset + diff;
            line.setAttribute('transform', 'translate(' + (isHorizontal ? ((move + 0.5) + ' 0.5') : ('0.5 ' + (move + 0.5))) + ')');
            rulerSvg.appendChild(line);
        }
    }

    private getRulerGeometry(): Size {
        return new Size(
            this.element ? this.element.getBoundingClientRect().width : 0,
            this.element ? this.element.getBoundingClientRect().height : 0
        );
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
                    width: this.orientation === 'Horizontal' ? (rulerGeometry.width + 200) : rulerSize + 'px',
                    height: this.orientation === 'Horizontal' ? rulerSize : (rulerGeometry.height + 200) + 'px',
                    style: 'position:inherit;'
                };
                svg = createSvgElement('svg', attr);
                if (rulerSpace.childNodes.length > 0) {
                    for (let i: number = rulerSpace.childNodes.length - 1; i >= 0; i--) {
                        rulerSpace.childNodes[i].parentNode.removeChild(rulerSpace.childNodes[i]);
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

export interface RulerSegment {
    segment: SVGElement;
    label: SVGTextElement;
}

export interface SegmentTranslation {
    trans: number;
}
