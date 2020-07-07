import { CircularGauge } from '../circular-gauge';
import { ColorStopModel, GradientPositionModel } from './gradient-model';
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { GradientColor, LinearGradient as Linear, RadialGradient as Radial } from '@syncfusion/ej2-svg-base';
import { PointerModel, CapModel, NeedleTailModel, RangeModel } from '../axes/axis-model';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

/**
 * Specifies the color information for the gradient in the circular gauge.
 */
export class ColorStop extends ChildProperty<ColorStop> {

    /**
     * Defines the color to be used in the gradient.
     * @default '#000000'
     */
    @Property('#000000')
    public color: string;

    /**
     *  Defines the opacity to be used in the gradient.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     *  Defines the gradient color begin and end in percentage
     * @default '0%'
     */
    @Property('0%')
    public offset: string;

    /**
     * Defines the style of the color stop in the gradient element.
     * @default ''
     */
    @Property('')
    public style: string;
}

/**
 * Specifies the position in percentage from which the radial gradient must be applied.
 */
export class GradientPosition extends ChildProperty<GradientPosition> {

    /**
     * Defines the horizontal position in percentage.
     * @default '0%'
     */
    @Property('0%')
    public x: string;

    /**
     * Defines the vertical position in percentage.
     * @default '0%'
     */
    @Property('0%')
    public y: string;
}

/**
 * This specifies the properties of the linear gradient colors for the circular gauge.
 */
export class LinearGradient extends ChildProperty<LinearGradient> {

    /**
     * Defines the start value of the linear gradient.
     * @default '0%'
     */
    @Property('0%')
    public startValue: string;

    /**
     * Defines the end value of the linear gradient.
     * @default '100%'
     */
    @Property('100%')
    public endValue: string;

    /**
     * Defines the color range properties for the gradient.
     */
    @Collection<ColorStopModel>([{ color: '#000000', opacity: 1, offset: '0%', style: '' }], ColorStop)
    public colorStop: ColorStopModel[];
}

/**
 * This specifies the properties of the radial gradient colors for the circular gauge.
 */
export class RadialGradient extends ChildProperty<RadialGradient> {

    /**
     * Defines the radius of the radial gradient in percentage.
     * @default '0%'
     */
    @Property('0%')
    public radius: string;

    /**
     * Defines the outer circle of the radial gradient.
     */
    @Complex<GradientPositionModel>({ x: '0%', y: '0%' }, GradientPosition)
    public outerPosition: GradientPositionModel;

    /**
     * Defines the inner circle of the radial gradient.
     * 
     */
    @Complex<GradientPositionModel>({ x: '0%', y: '0%' }, GradientPosition)
    public innerPosition: GradientPositionModel;

    /**
     * Defines the color range properties for the gradient.
     */
    @Collection<ColorStopModel>([{ color: '#000000', opacity: 1, offset: '0%', style: '' }], ColorStop)
    public colorStop: ColorStopModel[];
}

/**
 * Sets and gets the module that enables the gradient option for pointers and ranges.
 * @hidden
 */
export class Gradient {

    private gauge: CircularGauge;

    /**
     * Constructor for gauge
     * @param gauge
     */
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
    }

   /**
    * To get linear gradient string for pointers and ranges
    * @private
    */
    private getLinearGradientColor(element: PointerModel | CapModel | NeedleTailModel | RangeModel): string {
        let render: SvgRenderer = new SvgRenderer('');
        let colors: GradientColor[] = this.getGradientColor(element.linearGradient.colorStop);
        let name: string = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'linearGradient';
        let gradientPosition: Linear = {
            id: name,
            x1: (element.linearGradient.startValue.indexOf('%') === -1 ?
                element.linearGradient.startValue :
                parseFloat(element.linearGradient.startValue).toString()) + '%',
            x2: (element.linearGradient.endValue.indexOf('%') === -1 ?
                element.linearGradient.endValue :
                parseFloat(element.linearGradient.endValue).toString()) + '%',
            y1: '0' + '%',
            y2: '0' + '%'
        };
        let def: Element = render.drawGradient('linearGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }
   /**
    * To get the radial gradient string.
    * @private
    */
    private getRadialGradientColor(element: PointerModel | CapModel | NeedleTailModel | RangeModel): string {
        let render: SvgRenderer = new SvgRenderer('');
        let colors: GradientColor[] = this.getGradientColor(element.radialGradient.colorStop);
        let name: string = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'radialGradient';
        let gradientPosition: Radial = {
            id: name,
            r: (element.radialGradient.radius.indexOf('%') === -1 ?
                element.radialGradient.radius :
                parseFloat(element.radialGradient.radius).toString()) + '%',
            cx: (element.radialGradient.outerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.x :
                parseFloat(element.radialGradient.outerPosition.x).toString()) + '%',
            cy: (element.radialGradient.outerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.y :
                parseFloat(element.radialGradient.outerPosition.y).toString()) + '%',
            fx: (element.radialGradient.innerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.x :
                parseFloat(element.radialGradient.innerPosition.x).toString()) + '%',
            fy: (element.radialGradient.innerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.y :
                parseFloat(element.radialGradient.innerPosition.y).toString()) + '%'
        };
        let def: Element = render.drawGradient('radialGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }
   /**
    * To get color, opacity, offset and style.
    * @private
    */
    private getGradientColor(colorStop: ColorStopModel[]): GradientColor[] {
        let colors: GradientColor[] = [];
        for (let j: number = 0; j < colorStop.length; j++) {
            let color: GradientColor = {
                color: colorStop[j].color,
                colorStop: colorStop[j].offset,
                opacity: colorStop[j].opacity ? colorStop[j].opacity.toString() : '1',
                style: colorStop[j].style,
            };
            colors.push(color);
        }
        return colors;
    }
   /**
    * To get a gradient color string
    * @private
    */
    public getGradientColorString(element: PointerModel | CapModel | NeedleTailModel | RangeModel): string {
        let gradientColor: string;
        if (element.linearGradient || element.radialGradient) {
            if (element.linearGradient) {
                gradientColor = this.getLinearGradientColor(element);
            } else {
                gradientColor = this.getRadialGradientColor(element);
            }
            this.gauge.gradientCount = this.gauge.gradientCount + 1;
        } else {
            return null;
        }
        return gradientColor;
    }

    protected getModuleName(): string {
        // Returns te module name
        return 'Gradient';
    }

    /**
     * To destroy the Gradient.
     * @return {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
    }
}