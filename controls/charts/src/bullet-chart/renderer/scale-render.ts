/* eslint-disable radix */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
import { BulletChart } from '../bullet-chart';
import { DataManager } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Rect, measureText, textElement, TextOption, Size, PathOption } from '@syncfusion/ej2-svg-base';
import { RectOption, CircleOption } from '../../common/utils/helper';
import { RangeModel } from '../model/bullet-base-model';
import { IFeatureBarBounds } from '../model/bullet-interface';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { AnimationModel } from '../../common/model/base-model';
import { getAnimationFunction } from '../../common/utils/helper';
import { TargetType } from '../utils/enum';

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
     * To render range scale of the bulletChart graph.
     *
     * @param {Element} scaleGroup
     */

    public drawScaleGroup(scaleGroup: Element): number[] {
        const rangeGroup: Element = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_rangeGroup' });
        const max: number = this.bulletChart.maximum;
        const ranges: RangeModel[] = this.bulletChart.ranges as RangeModel[];
        this.scaleSettingsGroup = scaleGroup;
        let rect: RectOption;
        const bullet: BulletChart = this.bulletChart;
        const enableRtl: boolean = bullet.enableRtl;
        const initialRect: Rect = bullet.initialClipRect;
        let locX: number = initialRect.x + ((enableRtl && bullet.orientation === 'Horizontal') ? initialRect.width : 0);
        let locY: number = initialRect.y + ((!enableRtl && bullet.orientation === 'Vertical') ? initialRect.height : 0);
        let area: number = 0;
        bullet.rangeCollection = [];
        let start: number = 0;
        const range: number = (bullet.orientation === 'Horizontal') ? initialRect.width : initialRect.height;
        const fillRange: number = (bullet.orientation === 'Horizontal') ? initialRect.height : initialRect.width;
        for (let i: number = 0; i < ranges.length; i++) {
            area = (range) * ((ranges[i as number].end - start) / max);
            if (bullet.orientation === 'Horizontal') {
                locX -= (enableRtl) ? area : 0;
            } else {
                locY -= (!enableRtl) ? area : 0;
            }
            rect = new RectOption(
                bullet.svgObject.id + '_range_' + i,
                // tslint:disable-next-line:no-string-literal
                ranges[i as number].color || this.bulletChart.themeStyle.rangeStrokes[i as number]['color'],
                { width: 1 }, ranges[i as number].opacity,
                new Rect(locX, locY, ((bullet.orientation === 'Horizontal') ? area : fillRange),
                         ((bullet.orientation === 'Horizontal') ? fillRange : area)));
            const svgRect: Element = bullet.renderer.drawRectangle(rect);
            rangeGroup.appendChild(svgRect);
            scaleGroup.appendChild(rangeGroup);
            if (bullet.orientation === 'Horizontal') {
                locX += (enableRtl) ? 0 : area;
            } else {
                locY += (!enableRtl) ? 0 : area;
            }
            bullet.rangeCollection.push(area);
            start = ranges[i as number].end;
        }
        return this.bulletChart.rangeCollection;
    }

    protected sortRangeCollection(a: number, b: number): number {
        return (a - b);
    }

    /**
     * To render the feature bar of the bulletChart chart.
     *
     * @param {number} dataCount Count of the bar.
     */
    public renderFeatureBar(dataCount: number): void {
        if (dataCount === 0) {
            return;
        }
        this.renderCommonFeatureBar(dataCount, this.isHorizontal);
    }
    /**
     * To render the horizontal feature bar of the bulletChart chart
     *
     * @param {number} dataCount Count of the bar.
     */
    private renderCommonFeatureBar(dataCount: number, isHorizontal: boolean): void {
        let categoryValue: string;
        const dotWidth: number = 6;
        const padding: number = 5;
        const bulletChart: BulletChart = this.bulletChart;
        const initialBoundsStart: number = isHorizontal ? (bulletChart.initialClipRect.y + bulletChart.initialClipRect.height) :
            bulletChart.initialClipRect.x;
        let lPoint: number;
        const featueGroup: Element = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_featureGroup' });
        let data: Object;
        const featureBarSize: number = (isHorizontal ? bulletChart.initialClipRect.height : bulletChart.initialClipRect.width) / dataCount;
        let bounds: IFeatureMeasureType;
        for (let i: number = 0; i < dataCount; i++) {
            data = bulletChart.dataSource[i as number];
            categoryValue = data[bulletChart.categoryField];
            if (isHorizontal) {
                lPoint = initialBoundsStart - (featureBarSize * i) - (featureBarSize + bulletChart.valueHeight) / 2;
            } else {
                lPoint = initialBoundsStart + (featureBarSize * i) + (featureBarSize / 2) - bulletChart.valueHeight / 2;
            }
            bounds = this.calculateFeatureMeasureBounds(data[bulletChart.valueField], categoryValue, isHorizontal);
            if (data && bulletChart.type === 'Dot') {
                const value: number = data[bulletChart.valueField];
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
                const svgRect: Element = isHorizontal ? this.featureBar(bounds.pointX, lPoint, bounds.width, i) :
                    this.verticalFeatureBar(lPoint, bounds.pointX, bounds.width, i);
                featueGroup.appendChild(svgRect);
                this.feature = svgRect as HTMLElement;
                this.scaleSettingsGroup.appendChild(featueGroup);
                this.featureBarBounds[i as number] = { x: bounds.pointX, y: lPoint, width: bounds.width, height: bulletChart.valueHeight };
                // Drawing category text element
                if (!isNullOrUndefined(categoryValue)) {
                    const categoryTextSize: Size = measureText(categoryValue, bulletChart.categoryLabelStyle, bulletChart.themeStyle.axisLabelFont);
                    const categorySize: number = isHorizontal ? categoryTextSize.width : categoryTextSize.height;
                    const initialRect: Rect = bulletChart.initialClipRect;
                    let x: number;
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
                    bulletChart.categoryLabelStyle.fontFamily = bulletChart.categoryLabelStyle.fontFamily || bulletChart.themeStyle.axisLabelFont.fontFamily;
                    textElement(
                        categoryOptions, bulletChart.categoryLabelStyle,bulletChart.categoryLabelStyle.color || bulletChart.themeStyle.axisLabelFont.color,
                        this.scaleSettingsGroup 
                    );
                }
            }
            if (bulletChart.animation.enable) {
                this.doValueBarAnimation();
            }
        }
    }
    private featureBar(pointX: number, pointY: number, width: number, i: number): Element {
        const featureBarOptions: RectOption = new RectOption(
            this.bulletChart.svgObject.id + '_FeatureMeasure_' + i,
            this.bulletChart.valueFill,
            this.bulletChart.valueBorder,
            1,
            new Rect(pointX, pointY, width, this.bulletChart.valueHeight)
        );
        const svgRect: Element = this.bulletChart.renderer.drawRectangle(featureBarOptions);
        svgRect.setAttribute('class', this.bulletChart.svgObject.id + '_FeatureMeasure');
        svgRect.id = this.bulletChart.svgObject.id + '_FeatureMeasure_' + i;
        svgRect.setAttribute('role', 'img');
        svgRect.setAttribute('aria-label', (this.bulletChart.title + ', value: ' + this.bulletChart.dataSource[i as number].value + ', target: ' + this.bulletChart.dataSource[i as number].target));
        return svgRect;
    }

    private verticalFeatureBar(pointX: number, pointY: number, width: number, i: number): Element {
        const featureBarOptions: RectOption = new RectOption(
            this.bulletChart.svgObject.id + '_FeatureMeasure_' + i,
            this.bulletChart.valueFill,
            this.bulletChart.valueBorder,
            1,
            new Rect(pointX, pointY, this.bulletChart.valueHeight, width)
        );
        const svgRect: Element = this.bulletChart.renderer.drawRectangle(featureBarOptions);
        svgRect.setAttribute('class', this.bulletChart.svgObject.id + '_FeatureMeasure');
        svgRect.id = this.bulletChart.svgObject.id + '_FeatureMeasure_' + i;
        svgRect.setAttribute('role', 'img');
        svgRect.setAttribute('aria-label', (this.bulletChart.title + ', value: ' + this.bulletChart.dataSource[i as number].value + ', target: ' + this.bulletChart.dataSource[i as number].target));
        return svgRect;
    }

    private drawcategory(lPointX: number, lPointY: number, categoryValue: string): TextOption {
        const fontsize: number = parseInt(this.bulletChart.categoryLabelStyle.size);
        const categoryOptions: TextOption = {
            'id': '',
            'anchor': 'middle',
            'x': lPointX,
            'y': lPointY + (fontsize / 4 + this.bulletChart.valueHeight / 2),
            'transform': '',
            'text': categoryValue,
            'baseLine': '',
            'labelRotation': 0
        };
        return categoryOptions;
    }

    /**
     * To render comparative symbol of the bulletChart chart.
     *
     * @param {number} dataCount Data count value.
     */
    public renderComparativeSymbol(dataCount: number): void {
        if (dataCount === 0) {
            return;
        }
        this.renderCommonComparativeSymbol(dataCount, this.isHorizontal);
    }
    private renderCommonComparativeSymbol(dataCount: number, isHorizontal: boolean): void {
        const bulletChart: BulletChart = this.bulletChart;
        let value: number;
        const rect: Rect = bulletChart.initialClipRect;
        const scaleLength: number = isHorizontal ? rect.width : rect.height;
        let y1: number;
        let y2: number;
        let x1: number;
        const pointY: number = isHorizontal ? (rect.y + rect.height) : rect.x;
        const comparativeGroup: Element = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_comparativeGroup' });
        const minimum: number = bulletChart.minimum;
        const maximum: number = bulletChart.maximum;
        const delta: number = maximum - minimum;
        const targetWidth: number = 5;
        const pointX: number = isHorizontal ? (rect.x - (targetWidth / 2)) : (rect.y + rect.height);
        let temp: number;
        let values: number[] = [];
        const targetTypes: TargetType[] = bulletChart.targetTypes;
        let targetType: TargetType = 'Rect';
        const targetTypeLength: number = targetTypes.length;
        const featureBarSize: number = (isHorizontal ? rect.height : rect.width) / dataCount;
        let svgElement: Element;
        for (let k: number = 0; k < dataCount; k++) {
            value = bulletChart.dataSource[k as number][bulletChart.targetField];
            values = values.concat(value);
            for (let i: number = 0; i < values.length; i++) {
                targetType = targetTypes[i % targetTypeLength];
                if (values[i as number] >= minimum && values[i as number] <= maximum) {
                    if (isHorizontal) {
                        temp = pointY - (featureBarSize * k) - (featureBarSize / 2);
                    } else {
                        temp = pointY + (featureBarSize * k) + (featureBarSize / 2);
                    }
                    y1 = temp - targetWidth * 1.5;
                    y2 = temp + targetWidth * 1.5;
                    temp = (scaleLength / (delta / (delta - (maximum - values[i as number]))));
                    if (isHorizontal) {
                        x1 = pointX + (bulletChart.enableRtl ? (scaleLength - temp) : temp);
                    } else {
                        x1 = pointX - (bulletChart.enableRtl ? (scaleLength - temp) : temp);
                    }
                    svgElement = this.getTargetElement(targetType, isHorizontal, x1, y1, y2, values[i as number], k);
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
        const bulletChart: BulletChart = this.bulletChart;
        const strokeWidth: number = (targetType === 'Cross') ? bulletChart.targetWidth - 1 : 1;
        const size: number = (targetType === 'Circle') ? bulletChart.targetWidth - 1 : bulletChart.targetWidth;
        const lx: number = isHorizontal ? x1 + (size / 2) : y1 + ((y2 - y1) / 2);
        const ly: number = isHorizontal ? y1 + ((y2 - y1) / 2) : x1;
        const id: string = bulletChart.svgObject.id + '_ComparativeMeasure_' + k;
        const className: string = bulletChart.svgObject.id + '_ComparativeMeasure';
        if (targetType === 'Rect') {
            shapeObject = isHorizontal ? this.compareMeasure(x1, y1, y2, k, value) : this.compareVMeasure(y1, y2, x1, k);
            shapeElement = bulletChart.renderer.drawLine(shapeObject);
        } else if (targetType === 'Circle') {
            shapeObject = new CircleOption(
                id, bulletChart.targetColor, { width: 1, color: bulletChart.targetColor || 'black' }, 1, lx, ly, size
            );
            shapeElement = bulletChart.renderer.drawCircle(shapeObject);
        } else {
            const crossDirection: string = 'M ' + (lx - size) + ' ' + (ly - size) + ' L ' + (lx + size) + ' ' + (ly + size) + ' M ' +
                (lx - size) + ' ' + (ly + size) + ' L ' + (lx + size) + ' ' + (ly - size);
            shapeObject = new PathOption(id, 'transparent', strokeWidth, bulletChart.targetColor, 1, '', crossDirection);
            shapeElement = bulletChart.renderer.drawPath(shapeObject);
        }
        shapeElement.setAttribute('class', className);
        return shapeElement;
    }
    private compareMeasure(x1: number, y1: number, y2: number, i: number, value: number): object {
        const bulletChart: BulletChart = this.bulletChart;
        const compareMeasureOptions: object = {
            'class': bulletChart.svgObject.id + '_ComparativeMeasure',
            'id': bulletChart.svgObject.id + '_ComparativeMeasure_' + i,
            'x1': (value === bulletChart.maximum) ? x1 - (bulletChart.targetWidth / 2) :
                (value === bulletChart.minimum) ? x1 + (bulletChart.targetWidth / 2) : x1,
            'y1': y1,
            'x2': (value === bulletChart.maximum) ? x1 - (bulletChart.targetWidth / 2) :
                (value === bulletChart.minimum) ? x1 + (bulletChart.targetWidth / 2) : x1,
            'y2': y2,
            'stroke-width': bulletChart.targetWidth,
            'stroke': bulletChart.targetColor || 'black'
        };
        return compareMeasureOptions;
    }
    private compareVMeasure(x1: number, x2: number, y1: number, i: number): object {
        const bulletChart: BulletChart = this.bulletChart;
        const compareMeasureOptions: object = {
            'class': bulletChart.svgObject.id + '_ComparativeMeasure',
            'id': bulletChart.svgObject.id + '_ComparativeMeasure_' + i,
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y1,
            'stroke-width': bulletChart.targetWidth,
            'stroke': bulletChart.targetColor || 'black'
        };
        return compareMeasureOptions;
    }
    /**
     * To calculate the bounds on vertical and horizontal orientation changes
     *
     * @param {number} value Value of the scale.
     * @param {string} categoryValue Value of the category.
     * @param {boolean} isHorizontal Boolean value.
     * @returns {IFeatureMeasureType} calculateFeatureMeasureBounds
     */
    private calculateFeatureMeasureBounds(value: number, categoryValue: string, isHorizontal: boolean): IFeatureMeasureType {
        const bulletChart: BulletChart = this.bulletChart;
        const min: number = bulletChart.minimum;
        value = (value < min && min <= 0) ? min : value;
        if (value >= min) {
            let pointX: number;
            let lastPointX: number;
            let width: number;
            const loc: number = isHorizontal ? bulletChart.initialClipRect.x : bulletChart.initialClipRect.y;
            const scaleLength: number = isHorizontal ? bulletChart.initialClipRect.width : bulletChart.initialClipRect.height;
            const delta: number = bulletChart.maximum - bulletChart.minimum;
            const valueDiff: number = bulletChart.maximum - value;
            const orientation: string = ((!bulletChart.enableRtl) ? 'forward' : 'backward') + this.scaleOrientation.toLowerCase();
            categoryValue = isNullOrUndefined(categoryValue) ? '' : categoryValue;
            const stringLength: number = measureText(categoryValue.toString(), bulletChart.labelStyle, this.bulletChart.themeStyle.axisLabelFont).width;
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
     *
     * @returns {void}
     */
    public doValueBarAnimation(): void {
        const valueBarElement: HTMLElement = this.feature;
        if (!valueBarElement) {
            return null;
        }
        const animateOption: AnimationModel = this.bulletChart.animation;
        const animateDuration: number = this.bulletChart.animateSeries ? this.bulletChart.animation.duration : animateOption.duration;
        const effectType: Function = getAnimationFunction('Linear');
        const isValuePlot: boolean = this.bulletChart.dataSource < 0;
        let valueX: number;
        let valueY: number;
        const elementBarHeight: number = valueBarElement.getBoundingClientRect().height;
        let elementBarWidth: number = valueBarElement.getBoundingClientRect().width;
        let centerX: number;
        let centerY: number;
        let valueActual: number;
        if (this.bulletChart.orientation === 'Horizontal' && valueBarElement) {
            valueY = parseInt(valueBarElement.getAttribute('height'), 10);
            valueX = parseInt(valueBarElement.getAttribute('x'), 10);
            centerY = isValuePlot ? valueY : valueY + elementBarHeight;
            centerX = valueX;
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
            end: () => {
                valueBarElement.setAttribute('transform', 'translate(0,0)');
                valueBarElement.style.visibility = 'visible';
            }
        });

    }
    /**
     * Animates the comparative bar.
     *
     * @param {number} index Defines the feature bar to animate.
     * @returns {void}
     */
    public doTargetBarAnimation(index: number): void {
        let x: number;
        let y: number;
        let centerX: number;
        let centerY: number;
        const targetBarelement: HTMLElement = (<HTMLElement>this.comparative[index as number]);
        if (!targetBarelement) {
            return null;
        }
        if (this.bulletChart.orientation === 'Horizontal' && targetBarelement) {
            y = parseFloat(targetBarelement.getAttribute('y1')) + parseFloat(targetBarelement.getAttribute('y2'));
            x = parseFloat(targetBarelement.getAttribute('x1'));
            centerY = y;
            centerX = x;
        }
        targetBarelement.style.visibility = 'hidden';
        this.animateRect(targetBarelement, centerX, centerY, index + 1);
    }

    private animateRect(targetBarelement: HTMLElement, centerX: number, centerY: number, index: number): void {
        const effect: Function = getAnimationFunction('Linear');
        let value: number;
        const option: AnimationModel = this.bulletChart.animation;
        const threshold: number = this.comparative.length;
        const duration: number = this.bulletChart.animateSeries ? this.bulletChart.animation.duration : option.duration;
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
            end: () => {
                targetBarelement.setAttribute('transform', 'translate(0,0)');
                if (index < threshold) {
                    this.doTargetBarAnimation(index + 1);
                }
            }
        });
    }
}
