import { BulletChart } from '../bullet-chart';
import { DataManager } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Rect, measureText, textElement, TextOption, Size, PathOption } from '@syncfusion/ej2-svg-base';
import { RectOption, CircleOption } from '../../chart/index';
import { RangeModel } from '../model/bullet-base-model';
import { IFeatureBarBounds, IBarRenderEventArgs  } from '../model/bullet-interface';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { AnimationModel } from '../../common/model/base-model';
import { getAnimationFunction,  } from '../../common/utils/helper';
import { TargetType } from '../utils/enum';
import { barRender } from '../../common/model/constants';

interface IFeatureMeasureType {
    pointX: number;
    width: number;
    lastPointX: number;
}

/**
 * class for Bullet chart Scale Group
 */
export class ScaleGroup {
    private dataSource: Object | DataManager;
    private labelOffset: number;
    private location: number;
    public featureBarBounds: IFeatureBarBounds[];
    private labelSize: number;
    private isHorizontal: boolean;
    private isVertical: boolean;
    private isTicksInside: boolean;
    private isLabelsInside: boolean;
    private isTop: boolean;
    private majorTickSize: number;
    private rangeColor: Object[];
    public bulletChart: BulletChart;
    private isLabelBelow: boolean;
    private scaleSettingsGroup: Element;
    private scaleOrientation: string;
    private comparative: Object[] = [];
    private feature: HTMLElement;
    private isLeft: boolean;
    private isRight: boolean;

    constructor(bulletChart: BulletChart) {
        //super();
        this.dataSource = bulletChart.dataSource;
        this.isVertical = (bulletChart.orientation === 'Vertical');
        this.isTicksInside = (bulletChart.tickPosition === 'Inside');
        this.isLabelsInside = (bulletChart.labelPosition === 'Inside');
        this.isHorizontal = (bulletChart.orientation === 'Horizontal');
        this.isLeft = bulletChart.titlePosition === 'Left';
        this.isRight = bulletChart.titlePosition === 'Right';
        this.isTop = bulletChart.titlePosition === 'Top';
        this.location = 10;
        this.featureBarBounds = [];
        this.majorTickSize = bulletChart.majorTickLines.height;
        this.labelOffset = 15;
        this.labelSize = 12;
        this.bulletChart = bulletChart;
        this.isLabelBelow = !this.bulletChart.opposedPosition;
        this.scaleOrientation = this.bulletChart.orientation;
        this.rangeColor = [];
    }

    /**
     * To render range scale of the bulletChart graph
     * @param scaleGroup
     */

    public drawScaleGroup(scaleGroup: Element): number[] {
        let rangeGroup: Element = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_rangeGroup' });
        let max: number = this.bulletChart.maximum;
        let ranges: RangeModel[] = this.bulletChart.ranges as RangeModel[];
        this.scaleSettingsGroup = scaleGroup;
        let rect: RectOption;
        let bullet : BulletChart = this.bulletChart;
        let enableRtl : boolean = bullet.enableRtl;
        let initialRect: Rect = bullet.initialClipRect;
        let locX: number = initialRect.x + ((enableRtl && bullet.orientation === 'Horizontal') ? initialRect.width : 0);
        let locY: number = initialRect.y + ((!enableRtl && bullet.orientation === 'Vertical') ? initialRect.height  : 0);
        let area : number = 0;
        bullet.rangeCollection = [];
        let start : number = 0;
        let range : number = (bullet.orientation === 'Horizontal') ? initialRect.width : initialRect.height;
        let fillRange : number = (bullet.orientation === 'Horizontal') ? initialRect.height : initialRect.width;
        for (let i: number = 0; i < ranges.length ; i++) {
            area = (range) * ((ranges[i].end - start) / max);
            if (bullet.orientation === 'Horizontal') {
                locX -=  (enableRtl) ? area : 0;
            } else {
                locY -=  (!enableRtl) ? area : 0;
            }
            rect = new RectOption(
                bullet.svgObject.id + '_range_' + i,
                // tslint:disable-next-line:no-string-literal
                ranges[i].color || this.bulletChart.themeStyle.rangeStrokes[i]['color'],
                { width: 1 }, ranges[i].opacity,
                new Rect(locX, locY, ((bullet.orientation === 'Horizontal') ? area : fillRange),
                         ((bullet.orientation === 'Horizontal') ? fillRange : area)));
            let svgRect: Element = bullet.renderer.drawRectangle(rect);
            rangeGroup.appendChild(svgRect);
            scaleGroup.appendChild(rangeGroup);
            if (bullet.orientation === 'Horizontal') {
                locX +=  (enableRtl) ? 0 : area;
            } else {
                locY +=  (!enableRtl) ? 0 : area;
            }
            bullet.rangeCollection.push(area);
            start = ranges[i].end;
        }
        return this.bulletChart.rangeCollection;
    }

    protected sortRangeCollection(a: number, b: number): number {
        return (a - b);
    }

    /**
     * To render the feature bar of the bulletChart chart
     * @param dataCount
     */
    public renderFeatureBar(dataCount: number): void {
        if (dataCount === 0) {
            return;
        }
        this.renderCommonFeatureBar(dataCount, this.isHorizontal);
    }
    /**
     * To render the horizontal feature bar of the bulletChart chart
     * @param dataCount
     */
    private renderCommonFeatureBar(dataCount: number, isHorizontal: boolean): void {
        let categoryValue: string;
        let dotWidth: number = 6;
        let padding : number = 5;
        let bulletChart: BulletChart = this.bulletChart;
        let initialBoundsStart: number = isHorizontal ? (bulletChart.initialClipRect.y + bulletChart.initialClipRect.height) :
        bulletChart.initialClipRect.x;
        let lPoint: number;
        let featueGroup: Element = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_featureGroup' });
        let data: Object;
        let featureBarSize: number = (isHorizontal ? bulletChart.initialClipRect.height : bulletChart.initialClipRect.width) / dataCount;
        let bounds: IFeatureMeasureType;
        for (let i: number = 0; i < dataCount; i++) {
            data = bulletChart.dataSource[i];
            let argsData: IBarRenderEventArgs;
            argsData = {
                name: barRender, bulletChart: bulletChart, value: data[bulletChart.valueField], target: data[bulletChart.targetField],
                category: data[bulletChart.categoryField]
            };
            bulletChart.trigger(barRender, argsData);
            categoryValue = <string>argsData.category;
            if (isHorizontal) {
                lPoint = initialBoundsStart - (featureBarSize * i) - (featureBarSize + bulletChart.valueHeight) / 2;
            } else {
                lPoint = initialBoundsStart + (featureBarSize * i) + (featureBarSize / 2) - bulletChart.valueHeight / 2;
            }
            bounds = this.calculateFeatureMeasureBounds(+argsData.value, categoryValue, isHorizontal);
            if (data && bulletChart.type === 'Dot') {
                let value: number = +argsData.value;
                if (isHorizontal) {
                    bounds.pointX = bounds.pointX + (((value > 0) && !bulletChart.enableRtl) ||
                        ((value < 0) && bulletChart.enableRtl) ? (bounds.width) : 0) - dotWidth / 2;
                } else {
                    bounds.pointX = bounds.pointX + (((value > 0) && bulletChart.enableRtl) ||
                        ((value < 0) && !bulletChart.enableRtl) ? (bounds.width) : 0) - dotWidth / 2;
                }
                bounds.width = dotWidth;
            }
// Drawing feature bar rect element
            if (bounds) {
                let svgRect: Element = isHorizontal ? this.featureBar(bounds.pointX, lPoint, bounds.width, i) :
                this.verticalFeatureBar(lPoint, bounds.pointX, bounds.width, i);
                featueGroup.appendChild(svgRect);
                this.feature = svgRect as HTMLElement;
                this.scaleSettingsGroup.appendChild(featueGroup);
                this.featureBarBounds[i] = { x: bounds.pointX, y: lPoint, width: bounds.width, height: bulletChart.valueHeight };
// Drawing category text element
                if (!isNullOrUndefined(categoryValue)) {
                    let categoryTextSize : Size = measureText(categoryValue, bulletChart.categoryLabelStyle);
                    let categorySize: number = isHorizontal ? categoryTextSize.width : categoryTextSize.height;
                    let initialRect : Rect = bulletChart.initialClipRect;
                    let x : number;
                    let categoryOptions: TextOption;
                    if (isHorizontal) {
                        x = (bulletChart.enableRtl) ? (initialRect.x + initialRect.width + padding + categorySize / 2) :
                            initialRect.x - padding - categorySize / 2;
                        categoryOptions = this.drawcategory(x, lPoint, categoryValue);
                    } else {
                        x = (bulletChart.enableRtl) ? (initialRect.y - padding - categorySize / 2) :
                            initialRect.y + initialRect.height + padding + categorySize / 2;
                        categoryOptions = this.drawcategory(lPoint + bulletChart.valueHeight / 2, x, categoryValue);
                    }
                    textElement(
                        categoryOptions, bulletChart.categoryLabelStyle,
                        bulletChart.categoryLabelStyle.color || bulletChart.themeStyle.categoryFontColor,
                        this.scaleSettingsGroup
                    );
                }
            }
            if (bulletChart.animation.enable) {
                this.doValueBarAnimation(this.scaleSettingsGroup);
            }
        }
    }
    private featureBar(pointX: number, pointY: number, width: number, i: number): Element {
        let featureBarOptions: RectOption = new RectOption(
            this.bulletChart.svgObject.id + '_FeatureMeasure_' + i,
            this.bulletChart.valueFill,
            this.bulletChart.valueBorder,
            1,
            new Rect(pointX, pointY, width, this.bulletChart.valueHeight)
        );
        let svgRect: Element = this.bulletChart.renderer.drawRectangle(featureBarOptions);
        svgRect.setAttribute('class', this.bulletChart.svgObject.id + '_FeatureMeasure');
        svgRect.id = this.bulletChart.svgObject.id + '_FeatureMeasure_' + i;
        return svgRect;
    }

    private verticalFeatureBar(pointX: number, pointY: number, width: number, i: number): Element {
        let featureBarOptions: RectOption = new RectOption(
            this.bulletChart.svgObject.id + '_FeatureMeasure_' + i,
            this.bulletChart.valueFill,
            this.bulletChart.valueBorder,
            1,
            new Rect(pointX, pointY, this.bulletChart.valueHeight, width)
        );
        let svgRect: Element = this.bulletChart.renderer.drawRectangle(featureBarOptions);
        svgRect.setAttribute('class', this.bulletChart.svgObject.id + '_FeatureMeasure');
        svgRect.id = this.bulletChart.svgObject.id + '_FeatureMeasure_' + i;
        return svgRect;
    }

    private drawcategory(lPointX: number, lPointY: number, categoryValue: string): TextOption {
        let categoryOptions: TextOption = {
            'id': '',
            'anchor': 'middle',
            'x': lPointX,
            'y': lPointY + (this.bulletChart.valueHeight),
            'transform': '',
            'text': categoryValue,
            'baseLine': '',
            'labelRotation': 0
        };
        return categoryOptions;
    }

    /**
     * To render comparative symbol of the bulletChart chart
     * @param dataCount
     */
    public renderComparativeSymbol(dataCount: number): void {
        if (dataCount === 0) {
            return;
        }
        this.renderCommonComparativeSymbol(dataCount, this.isHorizontal);
    }
    private renderCommonComparativeSymbol(dataCount: number, isHorizontal: boolean): void {
        let bulletChart: BulletChart = this.bulletChart;
        let value: number;
        let rect: Rect = bulletChart.initialClipRect;
        let scaleLength: number = isHorizontal ? rect.width : rect.height;
        let y1: number;
        let y2: number;
        let x1: number;
        let pointY: number = isHorizontal ? (rect.y + rect.height) : rect.x;
        let comparativeGroup: Element = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_comparativeGroup' });
        let minimum: number = bulletChart.minimum;
        let maximum: number = bulletChart.maximum;
        let delta: number = maximum - minimum;
        let targetWidth: number = bulletChart.targetWidth;
        let pointX: number = isHorizontal ? (rect.x - (targetWidth / 2)) : (rect.y + rect.height);
        let temp: number;
        let values : number[] = [];
        let targetTypes: TargetType[] = bulletChart.targetTypes;
        let targetType: TargetType = 'Rect';
        let targetTypeLength: number = targetTypes.length;
        let featureBarSize: number = (isHorizontal ? rect.height : rect.width) / dataCount;
        let compareMeasureOptions: object;
        let svgElement: Element;
        for (let k: number = 0; k < dataCount; k++) {
            let argsData: IBarRenderEventArgs;
            argsData = {
                // tslint:disable-next-line:max-line-length
                name: barRender, bulletChart: bulletChart, value: bulletChart.dataSource[k][bulletChart.valueField], target: bulletChart.dataSource[k][bulletChart.targetField],
                category: bulletChart.dataSource[k][bulletChart.categoryField]
            };
            bulletChart.trigger(barRender, argsData);
            values = values.concat(<number>argsData.target);
            for (let i: number = 0; i < values.length; i++) {
                targetType = targetTypes[i % targetTypeLength];
                if (values[i] >= minimum && values[i] <= maximum) {
                    if (isHorizontal) {
                        temp = pointY - (featureBarSize * k) - (featureBarSize / 2);
                    } else {
                        temp = pointY + (featureBarSize * k) + (featureBarSize / 2);
                    }
                    y1 = temp - targetWidth * 1.5;
                    y2 = temp + targetWidth * 1.5;
                    temp = (scaleLength / (delta / (delta - (maximum - values[i]))));
                    if (isHorizontal) {
                        x1 = pointX + (bulletChart.enableRtl ? (scaleLength - temp) : temp);
                    } else {
                        x1 = pointX - (bulletChart.enableRtl ? (scaleLength - temp) : temp);
                    }
                    svgElement = this.getTargetElement(targetType, isHorizontal, x1, y1, y2, values[i], k);
                    this.comparative.push(svgElement);
                    comparativeGroup.appendChild(svgElement);
                    y1 = 0;
                    y2 = 0;
                }
                this.scaleSettingsGroup.appendChild(comparativeGroup);
            }
            values = [];
            if (bulletChart.animation.enable) {
                this.doTargetBarAnimation(0);
            }
        }
    }
    private getTargetElement(
        targetType: TargetType, isHorizontal: boolean, x1: number, y1: number, y2: number, value: number, k: number): Element {
        let shapeObject: object;
        let shapeElement: Element;
        let bulletChart: BulletChart = this.bulletChart;
        let size: number = bulletChart.targetWidth;
        let lx: number = isHorizontal ? x1 + (size / 2) :  y1 + ((y2 - y1) / 2);
        let ly: number = isHorizontal ? y1 + ((y2 - y1) / 2) : x1;
        let id: string = bulletChart.svgObject.id + '_ComparativeMeasure_' + k;
        let className: string = bulletChart.svgObject.id + '_ComparativeMeasure';
        if (targetType === 'Rect') {
            shapeObject = isHorizontal ? this.compareMeasure(x1, y1, y2, k, value) : this.compareVMeasure(y1, y2, x1, k, value);
            shapeElement = bulletChart.renderer.drawLine(shapeObject);
        } else if (targetType === 'Circle') {
            shapeObject = new CircleOption(
                id, bulletChart.targetColor, { width: 1, color: bulletChart.targetColor }, 1, lx, ly, size
            );
            shapeElement = bulletChart.renderer.drawCircle(shapeObject);
        } else {
            let crossDirection: string = 'M ' + (lx - size) + ' ' + (ly - size) + ' L ' + (lx + size) + ' ' + (ly + size) + ' M ' +
            (lx - size) + ' ' + (ly + size) + ' L ' + (lx + size) + ' ' + (ly - size);
            shapeObject = new PathOption(id, 'transparent', 1, bulletChart.targetColor, 1, '', crossDirection);
            shapeElement = bulletChart.renderer.drawPath(shapeObject);
        }
        shapeElement.setAttribute('class', className);
        return shapeElement;
    }
    private compareMeasure(x1: number, y1: number, y2: number, i: number, value: number): object {
        let bulletChart: BulletChart = this.bulletChart;
        let compareMeasureOptions: object = {
            'class': bulletChart.svgObject.id + '_ComparativeMeasure',
            'id': bulletChart.svgObject.id + '_ComparativeMeasure_' + i,
            'x1': (value === bulletChart.maximum) ? x1 - (bulletChart.targetWidth / 2) :
                (value === bulletChart.minimum) ? x1 + (bulletChart.targetWidth / 2) : x1,
            'y1': y1,
            'x2': (value === bulletChart.maximum) ? x1 - (bulletChart.targetWidth / 2) :
                (value === bulletChart.minimum) ? x1 + (bulletChart.targetWidth / 2) : x1,
            'y2': y2,
            'stroke-width': bulletChart.targetWidth,
            'stroke': bulletChart.targetColor
        };
        return compareMeasureOptions;
    }
    private compareVMeasure(x1: number, x2: number, y1: number, i: number, value: number): object {
        let bulletChart: BulletChart = this.bulletChart;
        let compareMeasureOptions: object = {
            'class': bulletChart.svgObject.id + '_ComparativeMeasure',
            'id': bulletChart.svgObject.id + '_ComparativeMeasure_' + i,
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y1,
            'stroke-width': bulletChart.targetWidth,
            'stroke': bulletChart.targetColor
        };
        return compareMeasureOptions;
    }
    /**
     * To calculate the bounds on vertical and horizontal orientation changes
     * @param value
     * @param categoryValue
     */
    private calculateFeatureMeasureBounds(value: number, categoryValue: string, isHorizontal: boolean): IFeatureMeasureType {
        let bulletChart: BulletChart  = this.bulletChart;
        let min: number = bulletChart.minimum;
        value = (value < min && min < 0) ? min : value;
        if (value >= min) {
            let pointX: number;
            let lastPointX: number;
            let width: number;
            let loc: number = isHorizontal ? bulletChart.initialClipRect.x : bulletChart.initialClipRect.y;
            let scaleLength: number = isHorizontal ? bulletChart.initialClipRect.width : bulletChart.initialClipRect.height;
            let delta: number = bulletChart.maximum - bulletChart.minimum;
            let valueDiff: number = bulletChart.maximum - value;
            let orientation: string = ((!bulletChart.enableRtl) ? 'forward' : 'backward') + this.scaleOrientation.toLowerCase();
            categoryValue = isNullOrUndefined(categoryValue) ? '' : categoryValue;
            let stringLength: number = measureText(categoryValue.toString(), bulletChart.labelStyle).width;
            switch (orientation) {
                case 'forwardhorizontal':
                case 'backwardvertical':
                    pointX = loc + ((min > 0) ? 0 : scaleLength / delta * Math.abs(min));
                    width = scaleLength / (delta / ((min > 0) ? delta - valueDiff : value));
                    if (value < 0) {
                        width = Math.abs(width);
                        pointX -= width;
                    }
                    width = (pointX + width < loc + scaleLength) ? width : loc + scaleLength - pointX;
                    lastPointX = loc - ((orientation === 'forwardhorizontal') ? (stringLength / 2 + 5) :
                        this.labelOffset);
                    break;
                default:
                    pointX = loc + (scaleLength - scaleLength / (delta / (delta - valueDiff)));
                    width = (min > 0) ? scaleLength / (delta / (delta - valueDiff)) : scaleLength / (delta / (value));
                    if (value < 0) {
                        width = Math.abs(width);
                        pointX -= width;
                    }
                    if (pointX < loc) {
                        width = pointX + width - loc;
                        pointX = loc;
                    }
                    lastPointX = loc + scaleLength + ((orientation === 'backwardhorizontal') ? (stringLength / 2 +
                        5) : 5);
                    break;
            }
            return { pointX: pointX, width: width, lastPointX: lastPointX };
        }
        return null;
    }

    /**
     * Animates the feature bar.
     * @param  {FeatureBar} scale - Defines the feature bar to animate.
     * @return {void}
     */

    public doValueBarAnimation(scale: Element): void {
        let valueBarElement: HTMLElement = this.feature;
        if (!valueBarElement) {
            return null;
        }
        let animateOption: AnimationModel = this.bulletChart.animation;
        let animateDuration: number = this.bulletChart.animateSeries ? this.bulletChart.animation.duration : animateOption.duration;
        let effectType: Function = getAnimationFunction('Linear');
        let isValuePlot: boolean = this.bulletChart.dataSource < 0;
        let valueX: number;
        let valueY: number;
        let elementBarHeight: number = valueBarElement.getBoundingClientRect().height;
        let elementBarWidth: number = valueBarElement.getBoundingClientRect().width;
        let centerX: number;
        let centerY: number;
        let valueActual: number;
        if (this.bulletChart.orientation === 'Horizontal' && valueBarElement) {
            valueY = parseInt(valueBarElement.getAttribute('height'), 10);
            valueX = parseInt(valueBarElement.getAttribute('x'), 10);
            centerY = isValuePlot ? valueY : valueY + elementBarHeight;
            centerX = valueX;
        } else {
            return null;
        }
        valueBarElement.style.visibility = 'hidden';
        new Animation({}).animate(valueBarElement, {
            duration: animateDuration,
            delay: animateOption.delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    valueBarElement.style.visibility = 'visible';
                    elementBarWidth = elementBarWidth ? elementBarWidth : 1;
                    valueActual = effectType(args.timeStamp - args.delay, 0, elementBarWidth, args.duration);
                    valueBarElement.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                        ') scale(' + (valueActual / elementBarWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                }
            },
            end: (model: AnimationOptions) => {
                valueBarElement.setAttribute('transform', 'translate(0,0)');
                valueBarElement.style.visibility = 'visible';
            }
        });

    }
    /**
     * Animates the comparative bar.
     * @param  {FeatureBar} scale - Defines the feature bar to animate.
     * @return {void}
     */

    public doTargetBarAnimation(index : number): void {
        let targetBarelement: HTMLElement ;
        let option: AnimationModel = this.bulletChart.animation;
        let x: number;
        let y: number;
        let centerX: number;
        let centerY: number;
        targetBarelement = (<HTMLElement>this.comparative[index]);
        if (!targetBarelement) {
            return null;
        }
        if (this.bulletChart.orientation === 'Horizontal' && targetBarelement) {
            y = parseFloat(targetBarelement.getAttribute('y1')) + parseFloat(targetBarelement.getAttribute('y2'));
            x = parseFloat(targetBarelement.getAttribute('x1'));
            centerY = y;
            centerX = x;
        } else {
            return null;
        }
        targetBarelement.style.visibility = 'hidden';
        this.animateRect(targetBarelement, centerX, centerY, index + 1);
   }

   private animateRect(targetBarelement : HTMLElement, centerX: number, centerY: number, index : number ) : void {
    let effect: Function = getAnimationFunction('Linear');
    let value: number;
    let option: AnimationModel = this.bulletChart.animation;
    let threshold : number = this.comparative.length;
    let duration: number = this.bulletChart.animateSeries ? this.bulletChart.animation.duration : option.duration;
    new Animation({}).animate(targetBarelement, {
        duration: duration,
        delay: option.delay,
        progress: (args: AnimationOptions): void => {
            if (args.timeStamp >= args.delay) {
                targetBarelement.style.visibility = 'visible';
                value = effect(args.timeStamp - args.delay, 0, 1, args.duration);
                targetBarelement.setAttribute('transform', 'translate(' + centerX + ' ' + centerY / 2 +
                    ') scale(1,' + (value) + ') translate(' + (-centerX) + ' ' + (-centerY / 2) + ')');
            }
        },
        end: (model: AnimationOptions) => {
            targetBarelement.setAttribute('transform', 'translate(0,0)');
            if (index < threshold) {
                this.doTargetBarAnimation(index + 1);
            }
        }
     });
   }
}