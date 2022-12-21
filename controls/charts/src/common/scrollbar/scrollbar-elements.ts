/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
import { ScrollBar } from './scrollbar';
import { Chart } from '../../chart/chart';
import { RectOption, CircleOption } from '../utils/helper';
import { PathOption, Rect, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { IScrollbarThemeStyle } from '../../chart/index';

// eslint-disable-next-line jsdoc/require-param
/**
 * Create scrollbar svg.
 *
 * @returns {void}
 */
export function createScrollSvg(scrollbar: ScrollBar, renderer: SvgRenderer): void {
    const rect: Rect = scrollbar.axis.rect;
    const isHorizontalAxis: boolean = scrollbar.axis.orientation === 'Horizontal';
    let enablePadding: boolean = false; let  markerHeight: number = 0;
    let yMin: number | string;
    for (const tempSeries of scrollbar.axis.series) {
        if (tempSeries.marker.visible && tempSeries.marker.height > markerHeight) {
            markerHeight = tempSeries.marker.height;
        }
    }
    for (const tempSeries of scrollbar.axis.series) {
        if (tempSeries.visible) { // To avoid the console error, when the visibility of the series is false.
            yMin = tempSeries.yMin.toString();
            enablePadding = (tempSeries.yData).some((yData: number | string) => {
                return yData === yMin;
            });
        }
        if (enablePadding) {
            break;
        }
    }
    scrollbar.svgObject = renderer.createSvg({
        id: scrollbar.component.element.id + '_' + 'scrollBar_svg' + scrollbar.axis.name,
        width: scrollbar.isVertical ? scrollbar.height : scrollbar.width,
        height: scrollbar.isVertical ? scrollbar.width : scrollbar.height,
        style: 'position: absolute;top: ' + ((scrollbar.axis.isAxisOpposedPosition && isHorizontalAxis ? -16 :
            (enablePadding ? markerHeight : 0)) + rect.y + Math.max(1, scrollbar.axis.lineStyle.width / 2)) + 'px;left: ' +
            (((scrollbar.axis.isAxisOpposedPosition && !isHorizontalAxis ? 16 : 0) + rect.x) -
             (scrollbar.isVertical ? scrollbar.height : 0))
            + 'px;cursor:auto;'
    });
    scrollbar.elements.push(scrollbar.svgObject);
}
/**
 * Scrollbar elements renderer
 */
export class ScrollElements {
    /** @private */
    public thumbRectX: number;
    /** @private */
    public thumbRectWidth: number;
    /** @private */
    public leftCircleEle: Element;
    /** @private */
    public rightCircleEle: Element;
    /** @private */
    public leftArrowEle: Element;
    /** @private */
    public rightArrowEle: Element;
    /** @private */
    public gripCircle: Element;
    /** @private */
    public slider: Element;
    /** @private */
    public chartId: string;

    /**
     * Constructor for scroll elements
     *
     * @param scrollObj
     * @param chart
     */

    constructor(chart: Chart) {
        this.chartId = chart.element.id + '_';
    }

    /**
     * Render scrollbar elements.
     *
     * @returns {void}
     * @private
     */

    public renderElements(scroll: ScrollBar, renderer: SvgRenderer): Element {
        const isInverse: boolean = scroll.axis.isAxisInverse;
        const scrollGroup: Element = renderer.createGroup({
            id: this.chartId + 'scrollBar_' + scroll.axis.name,
            transform: 'translate(' + ((scroll.isVertical && isInverse) ? scroll.height : isInverse ?
                scroll.width : '0') + ',' + (scroll.isVertical && isInverse ? '0' : isInverse ?
                scroll.height : scroll.isVertical ? scroll.width : '0') + ') rotate(' + (scroll.isVertical && isInverse ?
                '90' : scroll.isVertical ? '270' : isInverse ? '180' : '0') + ')'
        });
        const backRectGroup: Element = renderer.createGroup({
            id: this.chartId + 'scrollBar_backRect_' + scroll.axis.name
        });
        const thumbGroup: Element = renderer.createGroup({
            id: this.chartId + 'scrollBar_thumb_' + scroll.axis.name,
            transform: 'translate(0,0)'
        });
        this.backRect(scroll, renderer, backRectGroup);
        this.thumb(scroll, renderer, thumbGroup);
        this.renderCircle(scroll, renderer, thumbGroup);
        this.arrows(scroll, renderer, thumbGroup);
        this.thumbGrip(scroll, renderer, thumbGroup);
        scrollGroup.appendChild(backRectGroup);
        scrollGroup.appendChild(thumbGroup);
        return scrollGroup;
    }
    /**
     * Method to render back rectangle of scrollbar
     *
     * @param scroll
     * @param renderer
     * @param parent
     * @param renderer
     * @param parent
     */

    private backRect(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        const style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        const backRectEle: Element = renderer.drawRectangle(new RectOption(
            this.chartId + 'scrollBarBackRect_' + scroll.axis.name, style.backRect, { width: 1, color: style.backRect }, 1, new Rect(
                0, 0, scroll.width, scroll.height
            ),
            0, 0)
        ) as HTMLElement;
        parent.appendChild(backRectEle);
    }
    /**
     * Method to render arrows
     *
     * @param scroll
     * @param renderer
     * @param parent
     * @param renderer
     * @param parent
     */

    private arrows(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        const style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        const option: PathOption = new PathOption(
            this.chartId + 'scrollBar_leftArrow_' + scroll.axis.name, style.arrow, 1, style.arrow, 1, '', ''
        );
        this.leftArrowEle = renderer.drawPath(option);
        option.id = this.chartId + 'scrollBar_rightArrow_' + scroll.axis.name;
        this.rightArrowEle = renderer.drawPath(option);
        this.setArrowDirection(this.thumbRectX, this.thumbRectWidth, scroll.height);
        parent.appendChild(this.leftArrowEle);
        parent.appendChild(this.rightArrowEle);
    }
    /**
     * Methods to set the arrow width
     *
     * @param thumbRectX
     * @param thumbRectWidth
     * @param height
     */

    public setArrowDirection(thumbRectX: number, thumbRectWidth: number, height: number): void {
        const circleRadius: number = 8;
        const leftDirection: string = 'M ' + ((thumbRectX - circleRadius / 2) + 1) + ' ' + (height / 2) + ' ' + 'L ' +
            (thumbRectX - circleRadius / 2 + 6) + ' ' + 11 + ' ' + 'L ' + (thumbRectX - circleRadius / 2 + 6) + ' ' + 5 + ' Z';
        const rightDirection: string = 'M ' + ((thumbRectX + thumbRectWidth + circleRadius / 2) - 0.5) + ' ' + (height / 2)
            + ' ' + 'L ' + (thumbRectX + thumbRectWidth + circleRadius / 2 - 6) + ' ' + 11.5 + ' ' + 'L ' + (thumbRectX +
                thumbRectWidth + circleRadius / 2 - 6) + ' ' + 4.5 + ' Z';
        this.leftArrowEle.setAttribute('d', leftDirection);
        this.rightArrowEle.setAttribute('d', rightDirection);
    }
    /**
     * Method to render thumb
     *
     * @param scroll
     * @param renderer
     * @param parent
     */

    public thumb(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        scroll.startX = this.thumbRectX;
        const style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        this.slider = renderer.drawRectangle(new RectOption(
            this.chartId + 'scrollBarThumb_' + scroll.axis.name,
            style.thumb, { width: 1, color: '' }, 1, new Rect(
                this.thumbRectX, 0, this.thumbRectWidth, scroll.height
            )
        ));
        parent.appendChild(this.slider);
    }
    /**
     *  Method to render circles
     *
     * @param scroll
     * @param renderer
     * @param parent
     */

    private renderCircle(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        const style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        const option: CircleOption = new CircleOption(
            this.chartId + 'scrollBar_leftCircle_' + scroll.axis.name, style.circle, { width: 1, color: style.circle },
            1, this.thumbRectX, scroll.height / 2, 8
        );
        const scrollShadowEle: string = '<filter x="-25.0%" y="-20.0%" width="150.0%" height="150.0%" filterUnits="objectBoundingBox"' +
            'id="scrollbar_shadow"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>' +
            '<feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>' +
            '<feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>' +
            '<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1">' +
            '</feColorMatrix></filter>';
        const defElement: Element = renderer.createDefs();
        const shadowGroup: Element = renderer.createGroup({
            id: this.chartId + scroll.axis.name + '_thumb_shadow'
        });
        defElement.innerHTML = scrollShadowEle;
        shadowGroup.innerHTML = '<use fill="black" fill-opacity="1" filter="url(#scrollbar_shadow)" xlink:href="#' +
        this.chartId + 'scrollBar_leftCircle_' +
        scroll.axis.name + '"></use><use fill="black" fill-opacity="1" filter="url(#scrollbar_shadow)" xlink:href="#' +
        this.chartId + 'scrollBar_rightCircle_' + scroll.axis.name + '"></use>';
        this.leftCircleEle = renderer.drawCircle(option);
        option.id = this.chartId + 'scrollBar_rightCircle_' + scroll.axis.name;
        option.cx = this.thumbRectX + this.thumbRectWidth;
        this.rightCircleEle = renderer.drawCircle(option);
        parent.appendChild(defElement);
        parent.appendChild(this.leftCircleEle);
        parent.appendChild(this.rightCircleEle);
        parent.appendChild(shadowGroup);
    }
    /**
     * Method to render grip elements
     *
     * @param scroll
     * @param renderer
     * @param parent
     */

    private thumbGrip(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        let sidePadding: number = 0;
        let topPadding: number = 0;
        const gripWidth: number = 14;
        const gripCircleDiameter: number = 2;
        const padding: number = gripWidth / 2 - gripCircleDiameter;
        const style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        const option: CircleOption = new CircleOption(
            this.chartId + 'scrollBar_gripCircle0' + '_' + scroll.axis.name, style.grip,
            { width: 1, color: style.grip }, 1, 0, 0, 1
        );
        this.gripCircle = renderer.createGroup({
            id: this.chartId + 'scrollBar_gripCircle_' + scroll.axis.name,
            transform: 'translate(' + ((this.thumbRectX + this.thumbRectWidth / 2) + ((scroll.isVertical ? 1 : -1) * padding)) +
                ',' + (scroll.isVertical ? '10' : '5') + ') rotate(' + (scroll.isVertical ? '180' : '0') + ')'
        });
        for (let i: number = 1; i <= 6; i++) {
            option.id = this.chartId + 'scrollBar_gripCircle' + i + '_' + scroll.axis.name;
            option.cx = sidePadding;
            option.cy = topPadding;
            this.gripCircle.appendChild(
                renderer.drawCircle(option  )
            );
            sidePadding = i === 3 ? 0 : (sidePadding + 5);
            topPadding = i >= 3 ? 5 : 0;
        }
        parent.appendChild(this.gripCircle);
    }
}
