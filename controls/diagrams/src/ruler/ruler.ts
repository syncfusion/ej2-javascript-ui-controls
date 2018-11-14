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
     * @default 5
     */
    @Property(5)
    public interval: number;

    /**
     * Sets the segment width of the ruler.
     * @default 100
     */
    @Property(100)
    public segmentWidth: number;

    /**
     * Defines the orientation of the ruler.
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: RulerOrientation;

    /**
     * Defines the alignment of the tick in the ruler.
     * @default 'RightOrBottom'
     */
    @Property('RightOrBottom')
    public tickAlignment: TickAlignment;

    /**
     * Defines the color of the marker.
     * @default 'red'
     */
    @Property('red')
    public markerColor: string;

    /**
     * Defines the thickness of the ruler.
     * @default 25
     */
    @Property(25)
    public thickness: number;

    /**
     * Sets the segment width of the ruler.
     * @default null
     */
    @Property(null)
    public arrangeTick: Function | string;

    /**
     * Defines the length of the ruler.
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
     * Constructor for creating the Ruler Component
     */
    constructor(options?: RulerModel, element?: string | HTMLElement) {
        super(options, <HTMLButtonElement | string>element);
    }

    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void {
        this.unWireEvents();
        this.wireEvents();
    }


    /**
     * Renders the rulers.
     * @private
     */
    public render(): void {
        this.updateRulerGeometry();
    }

    /**
     * Core method to return the component name.
     * @private
     */
    public getModuleName(): string {
        return 'Ruler';
    }

    /**
     * To destroy the ruler
     * @return {void}
     */
    public destroy(): void {
        this.unWireEvents();
        this.notify('destroy', {});
        super.destroy();
        this.element.classList.remove('e-ruler');
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Refreshes the ruler when the Ruler properties are updated
     * @param options 
     */
    public onPropertyChanged(newProp: RulerModel, oldProp: RulerModel): void {
        for (let prop of Object.keys(newProp)) {
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
        let rulerGeometry: Size = this.getRulerGeometry();
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
        let rulerSize: number = this.getRulerSize();
        let rulerGeometry: Size = this.getRulerGeometry();
        let length: number = 0;
        let offset: number = 0;
        let availableSize: Size = new Size();
        let svg: SVGElement = this.getRulerSVG(rulerGeometry);
        if (svg) {
            length = this.length;
            availableSize.height = rulerSize;
            offset = this.offset;
            if (length && length !== Infinity) {
                let unitLength: number = length + this.segmentWidth;
                let unitOffset: number = offset;
                this.updateSegments(unitOffset, (unitLength + Math.abs(unitOffset)), svg, rulerSize);
            }
        }
    }

    private updateSegments(start: number, end: number, svg: SVGElement, rulerSize: number): void {
        let run: number = start;
        let trans: Trans = { trans: 0 };
        while (run < end) {
            let rulerSegment: RulerSegment = this.getNewSegment(run, svg);
            if (rulerSegment) {
                svg.appendChild(rulerSegment.segment);
                run = this.updateSegment(start, end, rulerSegment, run, trans, rulerSize);
            }
        }
    }

    private updateSegment(start: number, end: number, rulerSegment: RulerSegment, run: number, trans: Trans, rulerSize: number): number {
        let segWidth: number = this.updateSegmentWidth(this.scale);
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
        let translate: string = (this.orientation === 'Horizontal') ? ((trans.trans + 0.5) + ',0.5') : ('0.5,' + (trans.trans + 0.5));
        rulerSegment.segment.setAttribute('transform', 'translate(' + translate + ')');
        trans.trans += segWidth;
        run += segWidth;
        return run;
    }

    private updateTickLabel(rulerSegment: RulerSegment, rulerSize: number): void {
        let bBox: DOMRect = ((rulerSegment.segment.lastChild as SVGTextElement).getBBox() as DOMRect);
        let isHorizontal: Boolean = (this.orientation === 'Horizontal') ? true : false;
        let isRightOrBottom: Boolean = (this.tickAlignment === 'RightOrBottom') ? true : false;
        let x: number = isHorizontal ? 2 : 0;
        let y: number = isHorizontal ? (isRightOrBottom ? (rulerSize / 2 + (11 / 2) - (11 / 2)) :
            (rulerSize / 2 + (11 / 2))) : bBox.height;
        let translate: string = isRightOrBottom ? (-(bBox.width + 2) + ',' + ((rulerSize / 2) - bBox.height)) :
            (-(bBox.width + 2) + ',' + ((rulerSize / 2) - bBox.height / 2));
        let attr: Object = isHorizontal ? { 'x': x, 'y': y } :
            { 'x': x, 'y': y, 'transform': 'rotate(270)' + 'translate(' + translate + ')' };
        setAttributeSvg(rulerSegment.segment.lastChild as SVGElement, attr);
    }

    private getNewSegment(run: number, svg: SVGElement): RulerSegment {
        let segment: SVGElement = this.createNewTicks(run, svg);
        let label: SVGTextElement = (this.createTickLabel(svg, segment) as SVGTextElement);
        return { segment: segment, label: label };
    }

    private createNewTicks(run: number, svg: SVGElement): SVGElement {
        let tick: SVGElement;
        let tickInterval: number;
        let segmentWidth: number = this.updateSegmentWidth(this.scale);
        let g: SVGElement;
        let attr: Object = { 'class': 'e-ruler-segment' };
        g = createSvgElement('g', attr);
        for (let i: number = 0; i < this.interval; i++) {
            tickInterval = segmentWidth / this.interval;
            tick = this.createTick(svg, tickInterval, i + 1, run);
            g.appendChild(tick);
        }
        return g;
    }

    private getLinePoint(svg: SVGElement, tickInterval: number, length: number): number {
        let segmentWidth: number = this.updateSegmentWidth(this.scale);
        let rulerSize: number = this.getRulerSize();
        tickInterval = tickInterval * (length - 1);
        length = ((tickInterval % segmentWidth) === 0) ? rulerSize : rulerSize * 0.3;
        return length;
    }

    private createTick(svg: SVGElement, tickInterval: number, length: number, run: number): SVGElement {
        let ruler: Ruler;
        let line: SVGElement;
        let linePoint: number = this.getLinePoint(svg, tickInterval, length);
        let rulerSize: number = this.getRulerSize();
        let args: IArrangeTickOptions;
        let attr: Object;
        let isHorizontal: Boolean = (this.orientation === 'Horizontal') ? true : false;
        let isRightOrBottom: Boolean = (this.tickAlignment === 'RightOrBottom') ? true : false;
        let arrangeTick: Function = getFunction(this.arrangeTick);
        args = { ruler: ruler, tickLength: linePoint, tickInterval: ((this.segmentWidth / this.interval) * (length - 1)) };
        if (arrangeTick) {
            arrangeTick(args);
        }
        linePoint = args.tickLength;
        let point: number = tickInterval * (length - 1);
        let x1: number = isHorizontal ? point : (isRightOrBottom ? rulerSize : 0);
        let x2: number = isHorizontal ? point : (isRightOrBottom ? (rulerSize - linePoint) : (rulerSize - (rulerSize - linePoint)));
        let y1: number = isHorizontal ? (isRightOrBottom ? rulerSize : (rulerSize - (rulerSize - linePoint))) : point;
        let y2: number = isHorizontal ? (isRightOrBottom ? (rulerSize - linePoint) : 0) : point;
        attr = { 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'stroke-width': '1', 'stroke': 'black' };
        line = createSvgElement('line', attr);
        line.setAttribute('class', 'e-ruler-tick');
        return line;
    }

    private createTickLabel(svg: SVGElement, segment: SVGElement): SVGElement {
        let text: SVGElement;
        if (segment) {
            let attr: Object = { 'class': 'e-ruler-tick-label' };
            text = createSvgElement('text', attr);
            segment.appendChild(text);
        }
        return text;
    }

    /**
     * @private
     * @param scale
     */
    public updateSegmentWidth(scale: number): number {
        if (this.segmentWidth !== 100) {
            return this.segmentWidth;
        }
        let five: number = 25;
        let multiples: number = 1;
        let div: number;
        let scaleRound: number;
        let fifty: number = 100;
        scaleRound = Math.pow(2, Math.round(Math.log(scale) / Math.log(2)));
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
     * @private
     * @param rulerObj
     * @param currentPoint 
     */
    public drawRulerMarker(rulerObj: HTMLElement, currentPoint: PointModel, offset: number): void {
        let rulerSvg: SVGSVGElement;
        let rulerSize: number;
        let scale: number;
        let diff: number;
        let i: number;
        let attr: Object;
        let line: SVGElement;
        let isHorizontal: Boolean = this.orientation === 'Horizontal' ? true : false;
        let rulerSvgElements: NodeListOf<SVGSVGElement> = rulerObj.getElementsByTagName('svg');
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
            let point: number = isHorizontal ? currentPoint.x : currentPoint.y;
            let move: number = (point * scale) + offset + diff;
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
        let rulerSize: number = this.getRulerSize();
        let svg: SVGElement;
        if (this.element) {
            rulerSpace = document.getElementById(this.element.id + '_ruler_space');
            if (rulerSpace) {
                let attr: Object = {
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
     * Method to bind events for the ruler
     */
    private wireEvents(): void {
        //wire Events
    }

    /**
     * Method to unbind events for the ruler
     */
    private unWireEvents(): void {
        //unWire Events
    }
}

export interface RulerSegment {
    segment: SVGElement;
    label: SVGTextElement;
}

export interface Trans {
    trans: number;
}