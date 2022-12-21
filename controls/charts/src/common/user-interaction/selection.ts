/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/**
 * Selection src file
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Indexes } from '../../common/model/base';
import { IndexesModel } from '../../common/model/base-model';
import { Chart, Series, SelectionPattern, ChartSeriesType} from '../../chart';
import { AccumulationChart, AccumulationSeries, AccumulationType} from '../../accumulation-chart';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

/**
 * Selection Module handles the selection for chart.
 *
 * @private
 */

export class BaseSelection {
    /** @private */
    public styleId: string;
    protected unselected: string;
    protected control: Chart | AccumulationChart;
    constructor(control: Chart | AccumulationChart) {
        this.control = control;
    }
    /**
     * To create selection styles for series
     *
     * @returns {void}
     */
    protected seriesStyles(): void {
        let seriesclass: string;
        let style: HTMLStyleElement = <HTMLStyleElement>document.getElementById(this.styleId);
        let pattern: string = '{}';
        let fill: string;
        let opacity: number;
        const selectionPattern: SelectionPattern = (<Chart>this.control).selectionPattern;
        const highlightPattern: SelectionPattern = (<Chart>this.control).highlightPattern;
        if ((this.styleId.indexOf('highlight') > 0 && (<Chart>this.control).highlightColor !== '') || isNullOrUndefined(style) || selectionPattern !== 'None' || highlightPattern !== 'None') {
            style = document.createElement('style');
            style.setAttribute('id', this.styleId);
            for (const series of this.control.visibleSeries) {
                const visibleSeries: Series | AccumulationSeries  = this.control.visibleSeries[series.index] as Series ||
                this.control.visibleSeries[series.index] as AccumulationSeries;
                if ((this.styleId.indexOf('highlight') > 0 && (<Chart>this.control).highlightColor !== '') || (!isNullOrUndefined(selectionPattern) || !isNullOrUndefined(highlightPattern)) &&
                    (selectionPattern !== 'None' || highlightPattern !== 'None')) {
                    const patternName: SelectionPattern = this.styleId.indexOf('highlight') > 0 ? highlightPattern : selectionPattern;
                    if (visibleSeries.type as AccumulationType === 'Pie' || visibleSeries.type as AccumulationType === 'Funnel' ||
                    visibleSeries.type as AccumulationType === 'Pyramid'&& (this.control as AccumulationChart).highlightColor !== 'transparent') {
                        for (let i: number = 0; i < visibleSeries.points.length; i++) {
                            opacity = visibleSeries.opacity;
                            fill = this.pattern(this.control, (this.styleId.indexOf('highlight') > 0 && (this.control as AccumulationChart).highlightColor !== '') ? (this.control as AccumulationChart).highlightColor : (visibleSeries.points[i]).color, series.points[i].index, patternName, opacity);
                            pattern = '{ fill:' + fill + '}';
                            seriesclass = series.selectionStyle || this.styleId + '_series_' + series.index + '_point_' + series.points[i].index + ',' + '.' +
                                this.styleId + '_series_' + series.index + '_point_' + series.points[i].index + '> *';
                            if ((this.control as AccumulationChart).highlightMode === 'None' && (this.control as AccumulationChart).legendSettings.enableHighlight) {
                                style.innerHTML += '.' + this.styleId + '_series_' + series.index + '> *' + ' { stroke-width:' + (3) + ';} ';
                            }
                            pattern = (pattern.indexOf('None') > -1) ? '{fill:' + this.control.highlightColor + '!important}' : pattern;
                            style.innerHTML += series.selectionStyle ? '' : '.' + seriesclass + pattern;
                        }
                    } else if (visibleSeries.type as ChartSeriesType && (this.control as Chart).highlightColor !== 'transparent') {
                        opacity = visibleSeries.opacity;
                        fill = this.pattern(this.control, (this.styleId.indexOf('highlight') > 0 && (this.control as Chart).highlightColor !== '') ? (this.control as Chart).highlightColor :
                            (visibleSeries.pointColorMapping !== '' || ((this.control as Chart).rangeColorSettings && (this.control as Chart).rangeColorSettings.length > 1)) ? ((visibleSeries as Series).points[0]).color
                                : (visibleSeries as Series).interior, series.index, patternName, opacity);
                        pattern = '{ fill:' + fill + '}';

                    }
                }
                seriesclass = series.selectionStyle || this.styleId + '_series_' + series.index + ',' + '.' +
                    this.styleId + '_series_' + series.index + '> *';
                if ((this.control as Chart).highlightMode === 'None' && (this.control as Chart).legendSettings.enableHighlight) {
                    style.innerHTML += '.' + this.styleId + '_series_' + series.index + '> *' + ' { stroke-width:' + (3) + ';} ';
                }
                pattern = (pattern.indexOf('None') > -1) ? '{}' : pattern;
                style.innerHTML += series.selectionStyle ? '' : '.' + seriesclass + pattern;
            }
            let unSelectOpacity: number =(this.control).highlightColor !== 'transparent' ? 0.3 : opacity;
            if (isNullOrUndefined((this.control as Chart).selectionModule) && (this.control as Chart).selectionMode === 'None' && (this.control as Chart).highlightColor !== '') {
                unSelectOpacity = 1;
            }
            style.innerHTML += '.' + this.unselected + ' { opacity:' + (unSelectOpacity) + ';} ';
            document.body.appendChild(style);
        }
    }
    /**
     * To create the pattern for series/points
     *
     * @param chart
     * @param color
     * @param index
     * @param patternName
     * @param opacity
     * @param chart
     * @param color
     * @param index
     * @param patternName
     * @param opacity
     * @param chart
     * @param color
     * @param index
     * @param patternName
     * @param opacity
     * @param chart
     * @param color
     * @param index
     * @param patternName
     * @param opacity
     * @param chart
     * @param color
     * @param index
     * @param patternName
     * @param opacity
     */

    public pattern(chart: Chart | AccumulationChart, color: string, index: number, patternName: SelectionPattern, opacity: number): string {
        const backgroundColor: string = '#ffffff';
        const svg: Element = chart.svgObject;
        const pathOptions: { [x: string]: unknown }[] = [];
        const patternGroup: { id: string, patternUnits: string } = {
            'id': chart.element.id + '_' + patternName + '_Selection' + '_' + index, 'patternUnits': 'userSpaceOnUse' };
        const heightStr: string = 'height';
        const widthStr: string = 'width';
        const width: number = 10;
        const height: number = 12;
        const patternNum: number = 6;
        const turquoiseNum: number = 17;
        const turstrokewidth: number = 1;
        const starNum: number = 21;
        const circleNum: number = 9;
        const tileNum: number = 18;
        const strokeWidth: number = 1;
        const bubNum: number = 20;
        switch (patternName) {
        case 'Dots':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = patternNum;
            patternGroup[widthStr as string] = patternNum;
            pathOptions[0] = {
                'x': 0, 'y': 0, 'width': 7, 'height': 7, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
            };
            pathOptions[1] = {
                'cx': 3,
                'cy': 3,
                'r': 2,
                'stroke-width': 1,
                'fill': color,
                'name': 'circle'
            };
            break;
        case 'Pacman':
            patternGroup[heightStr as string] = '18.384';
            patternGroup[widthStr as string] = '17.917';
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': 17.917, 'height': 18.384,
                'transform': 'translate(0,0)', 'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path', 'd': 'M9.081,9.194l5.806-3.08c-0.812-1.496-2.403-3.052-4.291-3.052H8.835C6.138,3.063,3,6.151,3,8.723v1.679   c0,2.572,3.138,5.661,5.835,5.661h1.761c2.085,0,3.835-1.76,4.535-3.514L9.081,9.194z', 'stroke-width': 1, 'stroke': color, 'fill': color
            };
            break;
        case 'Chessboard':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = width;
            pathOptions[0] = {
                'x': 0, 'y': 0, 'width': width, 'height': width, 'fill': backgroundColor, 'opacity': opacity,
                'name': 'rect'
            };
            pathOptions[1] = { 'x': 0, 'y': 0, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
            pathOptions[2] = { 'x': 5, 'y': 5, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
            break;
        case 'Crosshatch':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = '8';
            pathOptions[0] = {
                'x': 0, 'y': 0, 'width': 8, 'height': 8, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
            };
            pathOptions[1] = {
                'd': 'M0 0L8 8ZM8 0L0 8Z',
                'stroke-width': 1,
                'stroke': color,
                'name': 'path'
            };
            break;
        case 'DiagonalForward':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = patternNum;
            pathOptions[0] = {
                'x': 0, 'y': 0, 'width': patternNum, 'height': patternNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
            };
            pathOptions[1] = {
                'd': 'M 3 -3 L 9 3 M 6 6 L 0 0 M 3 9 L -3 3',
                'stroke-width': 2,
                'stroke': color,
                'name': 'path'
            };
            break;

        case 'DiagonalBackward':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = patternNum;
            pathOptions[0] = {
                'x': 0, 'y': 0, 'width': patternNum, 'height': patternNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
            };
            pathOptions[1] = {
                'd': 'M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9',
                'stroke-width': 2,
                'stroke': color,
                'name': 'path'
            };
            break;
        case 'Grid':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = patternNum;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': patternNum, 'height': patternNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path',
                'd': 'M1 3.5L11 3.5 M0 3.5L11 3.5 M0 7.5L11 7.5 M0 11.5L11 11.5 M5.5 0L5.5 12 M11.5 0L11.5 12Z',
                'stroke-width': 1,
                'stroke': color
            };
            break;
        case 'Turquoise':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = turquoiseNum;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': turquoiseNum, 'height': turquoiseNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path', 'd': 'M0.5739999999999998,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth , 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            pathOptions[2] = {
                'name': 'path', 'd': 'M11.805,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            pathOptions[3] = {
                'name': 'path', 'd': 'M6.19,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            pathOptions[4] = {
                'name': 'path', 'd': 'M11.805,8.217a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            pathOptions[5] = {
                'name': 'path', 'd': 'M6.19,8.217a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            pathOptions[6] = {
                'name': 'path', 'd': 'M11.805,13.899a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            pathOptions[7] = {
                'name': 'path', 'd': 'M6.19,13.899a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
            };
            break;
        case 'Star':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = starNum;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': starNum, 'height': starNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path',
                'd': 'M15.913,18.59L10.762 12.842 5.613 18.75 8.291 11.422 0.325 9.91 8.154 8.33 5.337 0.91 10.488 6.658 15.637 0.75 12.959 8.078 20.925 9.59 13.096 11.17 z',
                'stroke-width': 1,
                'stroke': color,
                'fill': color
            };
            break;
        case 'Triangle':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = width;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': width, 'height': width, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path',
                'd': 'M4.987,0L7.48 4.847 9.974 9.694 4.987 9.694 0 9.694 2.493 4.847 z',
                'stroke-width': 1,
                'stroke': color,
                'fill': color
            };
            break;
        case 'Circle':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = circleNum;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': circleNum, 'height': circleNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'circle',
                'cx': 5.125,
                'cy': 3.875,
                'r': 3.625,
                'stroke-width': 1,
                'fill': color
            };
            break;
        case 'Tile':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = tileNum;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': tileNum, 'height': tileNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = { 'name': 'path', 'd': 'M0,9L0 0 9 0 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
            pathOptions[2] = { 'name': 'path', 'd': 'M9,9L9 0 18 0 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
            pathOptions[3] = { 'name': 'path', 'd': 'M0,18L0 9 9 9 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
            pathOptions[4] = { 'name': 'path', 'd': 'M9,18L9 9 18 9 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
            break;
        case 'HorizontalDash':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = height;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': height, 'height': height, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path', 'd': 'M0,1.5 L10 1.5 M0,5.5 L10 5.5 M0,9.5 L10 9.5 z', 'stroke-width': 1,
                'stroke': color, 'fill': color
            };
            break;
        case 'VerticalDash':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = height;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': height, 'height': height, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };

            pathOptions[1] = {
                'name': 'path', 'd': 'M1.5,0 L1.5 10 M5.5,0 L5.5 10 M9.5,0 L9.5 10 z', 'stroke-width': 1,
                'stroke': color, 'fill': color
            };
            break;
        case 'Rectangle':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = height;
            pathOptions[0] = { 'name': 'rect', 'width': height, 'height': height, 'fill': backgroundColor, 'opacity': opacity };
            pathOptions[1] = { 'name': 'rect', 'x': 1, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
            pathOptions[2] = { 'name': 'rect', 'x': 7, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
            break;
        case 'Box':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = width;
            pathOptions[0] = { 'name': 'rect', 'width': 13, 'height': 13, 'fill': backgroundColor, 'opacity': opacity };
            pathOptions[1] = {
                'name': 'rect', 'x': 1.5, 'y': 1.5, 'width': width, 'height': 9, 'fill': color,
                'opacity': opacity
            };
            break;
        case 'HorizontalStripe':
            patternGroup[heightStr as string] = height;
            patternGroup[widthStr as string] = width;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': width, 'height': height,
                'transform': 'translate(0,0)', 'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path', 'd': 'M0,0.5 L10 0.5 M0,4.5 L10 4.5 M0,8.5 L10 8.5 z', 'stroke-width': 1,
                'stroke': color, 'fill': color
            };
            break;
        case 'VerticalStripe':
            patternGroup[heightStr as string] = width;
            patternGroup[widthStr as string] = height;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': height, 'height': width, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = {
                'name': 'path', 'd': 'M0.5,0 L0.5 10 M4.5,0 L4.5 10 M8.5,0 L8.5 10 z', 'stroke-width': 1,
                'stroke': color, 'fill': color
            };
            break;
        case 'Bubble':
            patternGroup[heightStr as string] = patternGroup[widthStr as string] = bubNum;
            pathOptions[0] = {
                'name': 'rect', 'x': 0, 'y': 0, 'width': bubNum, 'height': bubNum, 'transform': 'translate(0,0)',
                'fill': backgroundColor, 'opacity': opacity
            };
            pathOptions[1] = { 'name': 'circle', 'cx': 5.217, 'cy': 11.325, 'r': 3.429, 'stroke-width': 1, 'fill': '#D0A6D1' };
            pathOptions[2] = { 'name': 'circle', 'cx': 13.328, 'cy': 6.24, 'r': 4.884, 'stroke-width': 1, 'fill': color };
            pathOptions[3] = {
                'name': 'circle', 'cx': 13.277, 'cy': 14.66, 'r': 3.018, 'stroke-width': 1,
                'fill': '#D0A6D1'
            };
            break;
        }
        const svgRenderer : SvgRenderer = ((chart as Chart).svgRenderer || (chart as AccumulationChart).renderer) as SvgRenderer;
        const pattern: Element = svgRenderer.createPattern(patternGroup, 'pattern');
        this.loadPattern(chart as Chart, pathOptions, pattern, svgRenderer);
        svg.appendChild(pattern);
        return 'url(#' + chart.element.id + '_' + patternName + '_' + 'Selection' + '_' + index + ')';
    }

    /**
     * To load the pattern into svg
     *
     * @param chart
     * @param options
     * @param pattern
     * @param svgRenderer
     * @param chart
     * @param options
     * @param pattern
     * @param svgRenderer
     * @param chart
     * @param options
     * @param pattern
     * @param svgRenderer
     * @param chart
     * @param options
     * @param pattern
     * @param svgRenderer
     */

    private loadPattern(chart: Chart, options: { [x: string]: unknown }[], pattern: Element, svgRenderer: SvgRenderer): void {
        let i: number;
        for (i = 0; i < options.length; i++) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const path: Element = svgRenderer.createPattern(options[i as number], (<object>options)[i as number].name);
            pattern.appendChild(path);
        }
    }

    /**
     * To concat indexes
     *
     * @param userIndexes
     * @param localIndexes
     * @param userIndexes
     * @param localIndexes
     */

    protected concatIndexes(userIndexes: IndexesModel[], localIndexes: Indexes[]): Indexes[] {
        return <Indexes[]>userIndexes.concat(localIndexes);
    }
    /**
     * Selected points series visibility checking on legend click
     *
     * @param selectedIndexes
     */

    protected checkVisibility(selectedIndexes: Indexes[], chart: Chart = null): boolean {
        if (!selectedIndexes) {
            return false;
        }
        let visible: boolean = false;
        const uniqueSeries: number[] = [];
        for (const index of selectedIndexes) {
            if (uniqueSeries.indexOf(index.series) === -1) {
                uniqueSeries.push(index.series);
            }
        }
        for (const index of uniqueSeries) {
            if (chart != null && chart.rangeColorSettings && chart.rangeColorSettings.length > 0 &&
                 chart.rangeColorSettings[0].colors.length > 0 ) {
                if (this.control.series[0].visible) {
                    visible = true;
                    break;
                }
            }
            else {
                if (this.control.series[index as number].visible) {
                    visible = true;
                    break;
                }
            }
        }
        return visible;
    }
    /**
     * To add svg element style class
     *
     * @param element
     * @param className
     * @param element
     * @param className
     * @private
     */

    public addSvgClass(element: Element, className: string): void {
        let elementClassName: string = element.getAttribute('class') || '';
        elementClassName += ((elementClassName !== '') ? ' ' : '');
        if (elementClassName.indexOf(className) === -1) {
            element.setAttribute('class', elementClassName + className);
        }
    }
    /**
     * To remove svg element style class
     *
     * @param element
     * @param className
     * @param element
     * @param className
     * @private
     */

    public removeSvgClass(element: Element, className: string): void {
        const elementClassName: string = element.getAttribute('class') || '';
        if (elementClassName.indexOf(className) > -1) {
            element.setAttribute('class', elementClassName.replace(className, ''));
        }
    }
    /**
     * To get children from parent element
     *
     * @param parent
     */

    protected getChildren(parent: Element): Element[] {
        const children: Element[] = [];
        for (let i: number = 0; i < parent.childNodes.length; i++) {
            if ((<Element>parent.childNodes[i as number]).tagName !== 'defs') {
                children.push((<Element>parent.childNodes[i as number]));
            }
        }
        return children;
    }
}
