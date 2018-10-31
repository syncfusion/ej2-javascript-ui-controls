import { ScrollBar } from './scrollbar';
import { Rect, PathOption, RectOption, CircleOption } from '../utils/helper';
import { SvgRenderer } from '@syncfusion/ej2-base';
import { IScrollbarThemeStyle } from '../../chart/index';

/**
 * Create scrollbar svg.
 * @return {void}
 */
export function createScrollSvg(scrollbar: ScrollBar, renderer: SvgRenderer): void {
    let rect: Rect = scrollbar.axis.rect;
    let isHorizontalAxis: boolean = scrollbar.axis.orientation === 'Horizontal';
    scrollbar.svgObject = renderer.createSvg({
        id: 'scrollBar_svg' + scrollbar.axis.name,
        width: scrollbar.isVertical ? scrollbar.height : scrollbar.width,
        height: scrollbar.isVertical ? scrollbar.width : scrollbar.height,
        style: 'position: absolute;top: ' + ((scrollbar.axis.opposedPosition && isHorizontalAxis ? -16 : 0) + rect.y) + 'px;left: ' +
            (((scrollbar.axis.opposedPosition && !isHorizontalAxis ? 16 : 0) + rect.x) - (scrollbar.isVertical ? scrollbar.height : 0))
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

    /**
     * Constructor for scroll elements
     * @param scrollObj 
     */
    constructor() {
        // Constructor Called here
    }

    /**
     * Render scrollbar elements.
     * @return {void}
     * @private
     */
    public renderElements(scroll: ScrollBar, renderer: SvgRenderer): Element {
        let scrollGroup: Element = renderer.createGroup({
            id: 'scrollBar_' + scroll.axis.name,
            transform: 'translate(' + (scroll.isVertical ? scroll.height : '0') +
                ',0) rotate(' + (scroll.isVertical ? '90' : '0') + ')'
        });
        let backRectGroup: Element = renderer.createGroup({
            id: 'scrollBar_backRect_' + scroll.axis.name
        });
        let thumbGroup: Element = renderer.createGroup({
            id: 'scrollBar_thumb_' + scroll.axis.name,
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
     * @param scroll 
     */
    private backRect(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        let style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        let backRectEle: Element = renderer.drawRectangle(new RectOption(
            'scrollBarBackRect_' + scroll.axis.name, style.backRect, { width: 1, color: style.backRect }, 1, new Rect(
                0, 0, scroll.width, scroll.height
            ),
            0, 0)
        ) as HTMLElement;
        parent.appendChild(backRectEle);
    }
    /**
     * Method to render arrows
     * @param scroll 
     */
    private arrows(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        let style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        let option: PathOption = new PathOption(
            'scrollBar_leftArrow_' + scroll.axis.name, style.arrow, 1, style.arrow, 1, '', ''
        );
        this.leftArrowEle = renderer.drawPath(option);
        option.id = 'scrollBar_rightArrow_' + scroll.axis.name;
        this.rightArrowEle = renderer.drawPath(option);
        this.setArrowDirection(this.thumbRectX, this.thumbRectWidth, scroll.height);
        parent.appendChild(this.leftArrowEle);
        parent.appendChild(this.rightArrowEle);
    }
    /**
     * Methods to set the arrow width
     * @param thumbRectX 
     * @param thumbRectWidth 
     * @param height 
     */
    public setArrowDirection(thumbRectX: number, thumbRectWidth: number, height: number): void {
        let circleRadius: number = 8;
        let leftDirection: string = 'M ' + ((thumbRectX - circleRadius / 2) + 1) + ' ' + (height / 2) + ' ' + 'L ' +
            (thumbRectX - circleRadius / 2 + 6) + ' ' + 11 + ' ' + 'L ' + (thumbRectX - circleRadius / 2 + 6) + ' ' + 5 + ' Z';
        let rightDirection: string = 'M ' + ((thumbRectX + thumbRectWidth + circleRadius / 2) - 0.5) + ' ' + (height / 2)
            + ' ' + 'L ' + (thumbRectX + thumbRectWidth + circleRadius / 2 - 6) + ' ' + 11.5 + ' ' + 'L ' + (thumbRectX +
                thumbRectWidth + circleRadius / 2 - 6) + ' ' + 4.5 + ' Z';
        this.leftArrowEle.setAttribute('d', leftDirection);
        this.rightArrowEle.setAttribute('d', rightDirection);
    }
    /**
     * Method to render thumb
     * @param scroll 
     * @param renderer 
     * @param parent 
     */
    public thumb(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        scroll.startX = this.thumbRectX;
        let style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        this.slider = renderer.drawRectangle(new RectOption(
            'scrollBarThumb_' + scroll.axis.name,
            style.thumb, { width: 1, color: '' }, 1, new Rect(
                this.thumbRectX, 0, this.thumbRectWidth, scroll.height
            )
        ));
        parent.appendChild(this.slider);
    }
    /**
     *  Method to render circles
     * @param scroll 
     * @param renderer 
     * @param parent 
     */
    private renderCircle(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        let style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        let option: CircleOption = new CircleOption(
            'scrollBar_leftCircle_' + scroll.axis.name, style.circle, { width: 1, color: style.circle },
            1, this.thumbRectX, scroll.height / 2, 8
        );
        let scrollShadowEle: string = '<filter x="-25.0%" y="-20.0%" width="150.0%" height="150.0%" filterUnits="objectBoundingBox"' +
            'id="scrollbar_shadow"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>' +
            '<feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>' +
            '<feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>' +
            '<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1">' +
            '</feColorMatrix></filter>';
        let defElement: Element = renderer.createDefs();
        defElement.innerHTML = scrollShadowEle;
        let shadowGroup: Element = renderer.createGroup({
            id: scroll.axis.name + '_thumb_shadow'
        });
        shadowGroup.innerHTML = '<use fill="black" fill-opacity="1" filter="url(#scrollbar_shadow)" xlink:href="#' + 'scrollBar_leftCircle_'
         + scroll.axis.name + '"></use><use fill="black" fill-opacity="1" filter="url(#scrollbar_shadow)" xlink:href="#'
         + 'scrollBar_rightCircle_' + scroll.axis.name + '"></use>';
        this.leftCircleEle = renderer.drawCircle(option);
        option.id = 'scrollBar_rightCircle_' + scroll.axis.name;
        option.cx = this.thumbRectX + this.thumbRectWidth;
        this.rightCircleEle = renderer.drawCircle(option);
        parent.appendChild(defElement);
        parent.appendChild(this.leftCircleEle);
        parent.appendChild(this.rightCircleEle);
        parent.appendChild(shadowGroup);
    }
    /**
     * Method to render grip elements
     * @param scroll 
     * @param renderer 
     * @param parent 
     */
    private thumbGrip(scroll: ScrollBar, renderer: SvgRenderer, parent: Element): void {
        let sidePadding: number = 0;
        let topPadding: number = 0;
        let gripWidth: number = 14;
        let gripCircleDiameter: number = 2;
        let padding: number = gripWidth / 2 - gripCircleDiameter;
        let style: IScrollbarThemeStyle = scroll.scrollbarThemeStyle;
        let option: CircleOption = new CircleOption(
            'scrollBar_gripCircle0' + '_' + scroll.axis.name, style.grip,
            { width: 1, color: style.grip }, 1, 0, 0, 1
        );
        this.gripCircle = renderer.createGroup({
            id: 'scrollBar_gripCircle_' + scroll.axis.name,
            transform: 'translate(' + ((this.thumbRectX + this.thumbRectWidth / 2) + ((scroll.isVertical ? 1 : -1) * padding)) +
                ',' + (scroll.isVertical ? '10' : '5') + ') rotate(' + (scroll.isVertical ? '180' : '0') + ')'
        });
        for (let i: number = 1; i <= 6; i++) {
            option.id = 'scrollBar_gripCircle' + i + '_' + scroll.axis.name;
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