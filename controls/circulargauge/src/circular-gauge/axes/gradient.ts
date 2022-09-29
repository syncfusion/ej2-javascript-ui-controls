import { CircularGauge } from '../circular-gauge';
import { ColorStopModel, GradientPositionModel } from './gradient-model';
import { Property, ChildProperty, Complex, Collection, isNullOrUndefined } from '@syncfusion/ej2-base';
import { GradientColor, LinearGradient as Linear, RadialGradient as Radial } from '@syncfusion/ej2-svg-base';
import { PointerModel, CapModel, NeedleTailModel, RangeModel } from '../axes/axis-model';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

/**
 * Specifies the color information for the gradient in the circular gauge.
 */
export class ColorStop extends ChildProperty<ColorStop> {

    /**
     * Defines the color to be used in the gradient.
     *
     * @default '#000000'
     */
    @Property('#000000')
    public color: string;

    /**
     * Defines the opacity to be used in the gradient.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Defines the gradient color begin and end in percentage
     *
     * @default '0%'
     */
    @Property('0%')
    public offset: string;

    /**
     * Defines the style of the color stop in the gradient element.
     *
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
     *
     * @default '0%'
     */
    @Property('0%')
    public x: string;

    /**
     * Defines the vertical position in percentage.
     *
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
     *
     * @default ''
     */
    @Property(null)
    public startValue: string;

    /**
     * Defines the end value of the linear gradient.
     *
     * @default ''
     */
    @Property(null)
    public endValue: string;

    /**
     * Defines the color range properties for the gradient.
     *
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
     *
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
 *
 * @hidden
 */
export class Gradient {

    private gauge: CircularGauge;

    /**
     * Constructor for gauge
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
    }

    /**
     * To get linear gradient string for pointers and ranges
     *
     * @param { PointerModel | CapModel | NeedleTailModel | RangeModel} element - Specifies the element.
     * @param {name} name - Specifies the name of the gradient.
     * @param {name} direction - Specifies the gradient position.
     * @returns {string} - Returns the string value.
     * @private
     */
    private calculateLinearGradientPosition(
        element: PointerModel | CapModel | NeedleTailModel | RangeModel,
        name: string, direction: string
    ): Linear {
        const linearPosition: Linear = {
            id: name,
            x1: (isNullOrUndefined(element.linearGradient.startValue) && name.indexOf('range') !== -1
                ? (direction === 'right' ? '100%' : '0%')
                : (!isNullOrUndefined(element.linearGradient.startValue) ? ((element.linearGradient.startValue.indexOf('%') === -1 ?
                    element.linearGradient.startValue :
                    parseFloat(element.linearGradient.startValue).toString()) + '%') : '0%')),
            x2: (isNullOrUndefined(element.linearGradient.endValue) && name.indexOf('range') !== -1 ?
                (direction === 'left' ? '100%' : '0%') :
                (!isNullOrUndefined(element.linearGradient.endValue) ? ((element.linearGradient.endValue.indexOf('%') === -1 ?
                    element.linearGradient.endValue : parseFloat(element.linearGradient.endValue).toString()) + '%') : '100%')),
            y1: (isNullOrUndefined(element.linearGradient.startValue) && name.indexOf('range') !== -1
                ? (direction === 'bottom' ? '100%' : '0%') : '0%'),
            y2: (isNullOrUndefined(element.linearGradient.endValue) && name.indexOf('range') !== -1
                ? (direction === 'top' ? '100%' : '0%') : '0%')
        };
        return linearPosition;
    }

    /**
     * To get linear gradient string for pointers and ranges
     *
     * @param { PointerModel | CapModel | NeedleTailModel | RangeModel} element - Specifies the element.
     * @param {number} index - Specifies the index of the axis.
     * @param { string } direction - Specifies the gradient position.
     * @param { number } rangeIndex - Specifies the index of the range.
     * @returns {string} - Returns the string value.
     * @private
     */
    private getLinearGradientColor(
        element: PointerModel | CapModel | NeedleTailModel | RangeModel,
        index : number, direction : string, rangeIndex : number
    ): string {
        const render: SvgRenderer = new SvgRenderer('');
        const colors: GradientColor[] = (isNullOrUndefined(element.linearGradient.startValue) &&
            isNullOrUndefined(element.linearGradient.endValue) && !isNullOrUndefined(rangeIndex)) ?
            this.getCircularGradientColor(element.linearGradient.colorStop, index) :
            this.getGradientColor(element.linearGradient.colorStop);
        const name: string = (isNullOrUndefined(element.linearGradient.startValue) &&
            isNullOrUndefined(element.linearGradient.endValue) && !isNullOrUndefined(rangeIndex)) ?
            '_' + this.gauge.svgObject.id + '_range_' +
            rangeIndex + '_color_' + index + '_' + 'linearGradient'
            : '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'linearGradient';
        let gradientPosition: Linear = this.calculateLinearGradientPosition(element, name, direction);
        gradientPosition = {
            id: gradientPosition.id,
            x1: gradientPosition.x1,
            x2: gradientPosition.x2,
            y1: gradientPosition.y1,
            y2: gradientPosition.y2
        };
        const def: Element = render.drawGradient('linearGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To get color, opacity, offset and style for circular gradient path.
     *
     * @private
     */
    private getCircularGradientColor(colorStop: ColorStopModel[], index : number): GradientColor[] {
        const colors: GradientColor[] = []; let colorIndex : number = index;
        for (let j: number = colorIndex; j < (index === (colorStop.length - 1) ? index + 1 : index + 2); j++) {
            const color: GradientColor = {
                color: colorStop[j].color,
                colorStop: colorStop[j].offset,
                opacity: colorStop[j].opacity ? colorStop[j].opacity.toString() : '1',
                style: colorStop[j].style
            };
            colors.push(color);
            colorIndex++;
        }
        return colors;
    }
    /**
     * To get the radial gradient string.
     *
     * @param {PointerModel | CapModel | NeedleTailModel | RangeModel} element - Specifies the element.
     * @returns {string} - Returns the string.
     * @private
     */
    private getRadialGradientColor(element: PointerModel | CapModel | NeedleTailModel | RangeModel): string {
        const render: SvgRenderer = new SvgRenderer('');
        const colors: GradientColor[] = this.getGradientColor(element.radialGradient.colorStop);
        const name: string = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'radialGradient';
        const gradientPosition: Radial = {
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
        const def: Element = render.drawGradient('radialGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }
    /**
     * To get color, opacity, offset and style.
     *
     * @param { ColorStopModel[]} colorStop - Specifies the color stop.
     * @returns {GradientColor[]} - Returns the gradientColor.
     * @private
     */
    private getGradientColor(colorStop: ColorStopModel[]): GradientColor[] {
        const colors: GradientColor[] = [];
        for (let j: number = 0; j < colorStop.length; j++) {
            const color: GradientColor = {
                color: colorStop[j].color,
                colorStop: colorStop[j].offset,
                opacity: colorStop[j].opacity ? colorStop[j].opacity.toString() : '1',
                style: colorStop[j].style
            };
            colors.push(color);
        }
        return colors;
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To get a gradient color string
     *
     * @param {PointerModel | CapModel | NeedleTailModel | RangeModel} element - Specifies the element.
     * @returns {string} - Returns the string
     * @private
     */
    public getGradientColorString(
        element: PointerModel | CapModel | NeedleTailModel | RangeModel,
        index?: number, direction?: string, rangeIndex?: number
    ): string {
        let gradientColor: string;
        if ((element.linearGradient && !isNullOrUndefined(element.linearGradient.colorStop)) ||
            (element.radialGradient && !isNullOrUndefined(element.radialGradient.colorStop))) {
            if (element.linearGradient) {
                gradientColor = this.getLinearGradientColor(element, index, direction, rangeIndex);
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
     * 
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.gauge = null;
    }
}
