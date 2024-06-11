import { Sparkline } from '../sparkline';
import { IThemes } from '../model/interface';
import { SparklineTheme } from '../model/enum';
import { createElement, remove } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

import { SparklineBorderModel, SparklineFontModel } from '../model/base-model';
import { FontModel } from '../../stock-chart';
/**
 * Sparkline control helper file
 */

/**
 * sparkline internal use of `Size` type
 */
export class Size {
    /**
     * height of the size.
     */
    public height: number;
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
/**
 * Gets the series color.
 *
 * @private
 * @param {SparklineTheme} theme - The theme for the sparkline.
 * @returns {string[]} - The series color from the theme.
 */
export function getSeriesColor(theme: SparklineTheme): string[] {
    let palette: string[];
    switch (theme) {
    case 'Fabric':
        palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
            '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
        break;
    case 'Bootstrap4':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
    case 'Bootstrap':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
    case 'HighContrastLight':
    case 'HighContrast':
        palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
            '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
        break;
    case 'MaterialDark':
        palette = ['#9ECB08', '#56AEFF', '#C57AFF', '#61EAA9', '#EBBB3E',
            '#F45C5C', '#8A77FF', '#63C7FF', '#FF84B0', '#F7C928'];
        break;
    case 'FabricDark':
        palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
            '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
        break;
    case 'BootstrapDark':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
    case 'Tailwind':
        palette = ['#5A61F6', '#65A30D', '#334155', '#14B8A6', '#8B5CF6',
            '#0369A1', '#F97316', '#9333EA', '#F59E0B', '#15803D'];
        break;
    case 'TailwindDark':
        palette = ['#8B5CF6', '#22D3EE', '#F87171', '#4ADE80', '#E879F9',
            '#FCD34D', '#F97316', '#2DD4BF', '#F472B6', '#10B981'];
        break;
    case 'Bootstrap5':
        palette = ['#6355C7', '#FFB400', '#2196F5', '#F7523F', '#963C70',
            '#4BE0BC', '#FD7400', '#C9E422', '#DE3D8A', '#162F88'];
        break;
    case 'Bootstrap5Dark':
        palette = ['#8F80F4', '#FFD46D', '#6CBDFF', '#FF7F71', '#FF6DB3',
            '#63F5D2', '#FCAA65', '#ECFF77', '#EF8EFF', '#5F82FD'];
        break;
    case 'FluentDark':
        palette = ['#1AC9E6', '#DA4CB2', '#EDBB40', '#AF4BCF', '#FF7266',
            '#1BD565', '#EE993D', '#5887FF', '#EC548D', '#7D39C0'];
        break;
    case 'Fluent':
        palette = ['#1AC9E6', '#DA4CB2', '#EDBB40', '#AF4BCF', '#FF7266',
            '#1BD565', '#EE993D', '#5887FF', '#EC548D', '#7D39C0'];
        break;
    case 'Fluent2':
        palette = ['#6200EE', '#09AF74', '#0076E5', '#CB3587', '#E7910F',
            '#0364DE', '#66CD15', '#F3A93C', '#107C10', '#C19C00'];
        break;
    case 'Fluent2Dark':
        palette = ['#9BB449', '#2A72D5', '#43B786', '#3F579A', '#584EC6',
            '#E85F9C', '#6E7A89', '#EA6266', '#0B6A0B', '#C19C00'];
        break;
    case 'Material3':
        palette = ['#6355C7', '#00AEE0', '#FFB400', '#F7523F', '#963C70',
            '#FD7400', '#4BE0BC', '#2196F5', '#DE3D8A', '#162F88'];
        break;
    case 'Material3Dark':
        palette = ['#4EAAFF', '#FA4EAB', '#FFF500', '#17EA58', '#38FFE7',
            '#FF9E45', '#B3F32F', '#B93CE4', '#FC5664', '#9B55FF'];
        break;
    default:
        palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
            '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
        break;
    }
    return palette;
}

/**
 * To find the default colors based on theme.
 *
 * @private
 * @param {SparklineTheme} theme - The theme for the sparkline.
 * @returns {IThemes} - The theme colors.
 */
export function getThemeColor(theme: SparklineTheme): IThemes {
    let themeColors: IThemes;
    switch (theme) {
    case 'BootstrapDark':
    case 'FabricDark':
    case 'MaterialDark':
    case 'HighContrast':
        themeColors = {
            axisLineColor: '#ffffff',
            dataLabelColor: theme === 'BootstrapDark' ? '#676767' : theme === 'FabricDark' ? '#A19F9D' : theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : '#969696',
            rangeBandColor: '#ffffff',
            tooltipFill: theme === 'BootstrapDark' ? '#F0F0F0' : theme === 'FabricDark' ? '#A19F9D' : theme === 'MaterialDark' ? '#F4F4F4' : '#FFFFFF',
            background: '#000000',
            tooltipFontColor: theme === 'BootstrapDark' ? '#1A1A1A' : theme === 'FabricDark' ? '#DADADA' : theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : '#000000',
            trackerLineColor: '#ffffff',
            labelFontFamily: theme === 'BootstrapDark' ? 'Helvetica' : theme === 'FabricDark' ? 'Segoe UI' : theme === 'MaterialDark' ? 'Roboto' : 'Segoe UI',
            tooltipFontFamily: theme === 'BootstrapDark' ? 'Helvetica' : theme === 'FabricDark' ? 'Segoe UI' : theme === 'MaterialDark' ? 'Roboto' : 'Segoe UI',
            dataLabelFont: {
                fontFamily: theme === 'BootstrapDark' ? 'Helvetica' : theme === 'FabricDark' ? 'Segoe UI' : theme === 'MaterialDark' ? 'Roboto' : 'Segoe UI', color: theme === 'BootstrapDark' ? '#676767' : theme === 'FabricDark' ? '#A19F9D' : theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : '#969696', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: theme === 'BootstrapDark' ? '#0070F0' : theme === 'MaterialDark' ? '#00B0FF' : theme === 'FabricDark' ? '#0074CC' : '#FFD939'
        };
        break;
    case 'Bootstrap4':
        themeColors = {
            axisLineColor: '#6C757D',
            dataLabelColor: '#495057',
            rangeBandColor: '#212529',
            tooltipFill: '#212529',
            background: '#FFFFFF',
            tooltipFontColor: '#F9FAFB',
            trackerLineColor: '#212529',
            fontFamily: 'Helvetica',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            labelFontFamily: 'Helvetica',
            tooltipFontFamily: 'Helvetica',
            dataLabelFont: {
                fontFamily: 'Helvetica', color: '#495057', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#007BFF'
        };
        break;
    case 'Tailwind':
        themeColors = {
            axisLineColor: '#4B5563',
            dataLabelColor: '#6B7280',
            rangeBandColor: '#212529',
            background: '#FFFFFF',
            tooltipFill: '#111827',
            tooltipFontColor: '#F9FAFB',
            trackerLineColor: '#1F2937',
            fontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Inter',
            tooltipFontFamily: 'Inter',
            dataLabelFont: {
                fontFamily: 'Inter', color: '#6B7280', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#4F46E5'
        };
        break;
    case 'TailwindDark':
        themeColors = {
            axisLineColor: '#D1D5DB',
            dataLabelColor: '#9CA3AF',
            rangeBandColor: '#F9FAFB',
            background: 'transparent',
            tooltipFill: '#E9ECEF',
            tooltipFontColor: '#1F2937',
            trackerLineColor: '#9CA3AF',
            fontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Inter',
            tooltipFontFamily: 'Inter',
            dataLabelFont: {
                fontFamily: 'Inter', color: '#9CA3AF', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#22D3EE'
        };
        break;
    case 'Bootstrap5':
        themeColors = {
            axisLineColor: '#D1D5DB',
            dataLabelColor: '#495057',
            rangeBandColor: '#212529',
            background: 'rgba(255, 255, 255, 0.0)',
            tooltipFill: '#212529',
            tooltipFontColor: '#F9FAFB',
            trackerLineColor: '#1F2937',
            fontFamily: 'Helvetica',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Helvetica',
            tooltipFontFamily: 'Helvetica',
            dataLabelFont: {
                fontFamily: 'Helvetica', color: '#495057', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#0D6EFD'
        };
        break;
    case 'Bootstrap5Dark':
        themeColors = {
            axisLineColor: '#D1D5DB',
            dataLabelColor: '#E9ECEF',
            rangeBandColor: '#ADB5BD',
            background: 'rgba(255, 255, 255, 0.0)',
            tooltipFill: '#E9ECEF',
            tooltipFontColor: '#212529',
            trackerLineColor: '#ADB5BD',
            fontFamily: 'Helvetica',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Helvetica',
            tooltipFontFamily: 'Helvetica',
            dataLabelFont: {
                fontFamily: 'Helvetica', color: '#E9ECEF', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#0D6EFD'
        };
        break;
    case 'Fluent':
        themeColors = {
            axisLineColor: '#D2D0CE;',
            dataLabelColor: '#3B3A39',
            rangeBandColor: '#A19F9D',
            background: 'rgba(255, 255, 255, 0.0001)',
            tooltipFill: '#FFFFFF',
            tooltipFontColor: '#323130',
            trackerLineColor: '#A19F9D',
            fontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Segoe UI',
            tooltipFontFamily: 'Segoe UI',
            dataLabelFont: {
                fontFamily: 'Segoe UI', color: '#3B3A39', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#0078D4'
        };
        break;
    case 'FluentDark':
        themeColors = {
            axisLineColor: '#3B3A39;',
            dataLabelColor: '#D2D0CE',
            rangeBandColor: '#797775',
            background: 'transparent',
            tooltipFill: '#323130',
            tooltipFontColor: '#F3F2F1',
            trackerLineColor: '#797775',
            fontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Segoe UI',
            tooltipFontFamily: 'Segoe UI',
            dataLabelFont: {
                fontFamily: 'Segoe UI', color: '#D2D0CE', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#0078D4'
        };
        break;
    case 'Fluent2':
        themeColors = {
            axisLineColor: '#D2D0CE',
            dataLabelColor: '#424242',
            rangeBandColor: '#A19F9D',
            background: 'transparent',
            tooltipFill: '#FFFFFF',
            tooltipFontColor: '#242424',
            trackerLineColor: '#D2D0CE',
            fontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Segoe UI',
            tooltipFontFamily: 'Segoe UI',
            dataLabelFont: {
                fontFamily: 'Segoe UI', color: '#242424', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#0078D4'
        };
        break;
    case 'Fluent2Dark':
        themeColors = {
            axisLineColor: '#8A8886',
            dataLabelColor: '#D6D6D6',
            rangeBandColor: '#8A8886',
            background: 'transparent',
            tooltipFill: '#292929',
            tooltipFontColor: '#FFFFFF',
            trackerLineColor: '#3B3A39',
            fontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Segoe UI',
            tooltipFontFamily: 'Segoe UI',
            dataLabelFont: {
                fontFamily: 'Segoe UI', color: '#D6D6D6', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#0078D4'
        };
        break;
    case 'Material3':
        themeColors = {
            axisLineColor: '#C4C7C5',
            dataLabelColor: '#49454E',
            rangeBandColor: 'rgba(73, 69, 78, 0.3)',
            background: 'rgba(255, 255, 255, 0.0001)',
            tooltipFill: '#313033',
            tooltipFontColor: '#F4EFF4',
            trackerLineColor: '#49454E',
            fontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Roboto',
            tooltipFontFamily: 'Roboto',
            dataLabelFont: {
                fontFamily: 'Roboto', color: '#49454E', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#49454E'
        };
        break;
    case 'Material3Dark':
        themeColors = {
            axisLineColor: '#49454F',
            dataLabelColor: '#CAC4D0',
            rangeBandColor: 'rgba(202, 196, 208, 0.3)',
            background: 'transparent',
            tooltipFill: '#E6E1E5',
            tooltipFontColor: '#313033',
            trackerLineColor: '#CAC4D0',
            fontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Roboto',
            tooltipFontFamily: 'Roboto',
            dataLabelFont: {
                fontFamily: 'Roboto', color: '#CAC4D0', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: '#CAC4D0'
        };
        break;
    default: {
        themeColors = {
            axisLineColor: '#000000',
            dataLabelColor: theme === 'Bootstrap' ? '#676767' : theme === 'Fabric' ? '#666666' : 'rgba(97, 97, 97, 1)' ,
            rangeBandColor: '#000000',
            background: '#FFFFFF',
            tooltipFill: theme === 'Bootstrap' ? '#212529' : theme === 'Fabric' ? '#FFFFFF' : '#000816',
            tooltipFontColor: theme === 'Bootstrap' ? '#F9FAFB' : theme === 'Fabric' ? '#333333' : 'rgba(249, 250, 251, 1)',
            trackerLineColor: '#000000',
            labelFontFamily: theme === 'Bootstrap' ? 'Helvetica' : theme === 'Fabric' ? 'Segoe UI' : 'Roboto',
            tooltipFontFamily: theme === 'Bootstrap' ? 'Helvetica' : theme === 'Fabric' ? 'Segoe UI' : 'Roboto',
            dataLabelFont: {
                fontFamily: theme === 'Bootstrap' ? 'Helvetica' : theme === 'Fabric' ? 'Segoe UI' : 'Roboto', color: theme === 'Bootstrap' ? '#676767' : theme === 'Fabric' ? '#666666' : 'rgba(97, 97, 97, 1)', size: '12px', fontWeight: '400', fontStyle: 'Medium'
            },
            tabColor: theme === 'Material' ? '#ff4081' : theme === 'Fabric' ? '#0078D6' : '#317AB9'
        };
        break;
    }
    }
    return themeColors;
}

/**
 * To find number from string.
 *
 * @private
 * @param {string} value - The string containing the number.
 * @param {number} containerSize - The container size for the number.
 * @returns {number} - The extracted number from the string.
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/**
 * Method to calculate the width and height of the sparkline.
 *
 * @param {Sparkline} sparkline - The Sparkline instance.
 * @returns {void}
 */
export function calculateSize(sparkline: Sparkline): void {
    const containerWidth: number = !sparkline.element.clientWidth ? (!sparkline.element.parentElement ? 100 :
        (!sparkline.element.parentElement.clientWidth ? window.innerWidth : sparkline.element.parentElement.clientWidth)) :
        sparkline.element.clientWidth;
    const containerHeight: number = !sparkline.element.clientHeight ? (!sparkline.element.parentElement ? 50 :
        sparkline.element.parentElement.clientHeight) : sparkline.element.clientHeight;
    sparkline.availableSize = new Size(
        stringToNumber(sparkline.width, containerWidth) || containerWidth,
        stringToNumber(sparkline.height, containerHeight) || containerHeight || (sparkline.isDevice ?
            Math.min(window.innerWidth, window.innerHeight) : containerHeight)
    );
}

/**
 * Method to create svg for sparkline.
 *
 * @param {Sparkline} sparkline - The Sparkline instance.
 * @returns {void}
 */
export function createSvg(sparkline: Sparkline): void {
    sparkline.renderer = new SvgRenderer(sparkline.element.id);
    calculateSize(sparkline);
    sparkline.svgObject = sparkline.renderer.createSvg({
        id: sparkline.element.id + '_svg',
        width: sparkline.availableSize.width,
        height: sparkline.availableSize.height
    });
}

/**
 * Internal use of type rect.
 *
 * @private
 */
export class Rect {

    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

/**
 * Internal use of path options.
 *
 * @private
 */
export class PathOption {
    public opacity: number;
    public id: string;
    public stroke: string;
    public fill: string;
    public ['stroke-dasharray']: string;
    public ['stroke-width']: number;
    public d: string;
    constructor(
        id: string, fill: string, width: number, color: string, opacity?: number,
        dashArray?: string, d?: string
    ) {
        this.id = id;
        this.fill = fill;
        this.opacity = opacity;
        this['stroke-width'] = width;
        this.stroke = color;
        this.d = d;
        this['stroke-dasharray'] = dashArray;
    }
}

/**
 * Sparkline internal rendering options.
 *
 * @private
 */
export interface SparkValues {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    percent?: number;
    degree?: number;
    location?: { x: number, y: number };
    markerPosition?: number;
    xVal?: number;
    yVal?: number;
}

/**
 * Internal use of rectangle options.
 *
 * @private
 */
export class RectOption extends PathOption {

    public rect: Rect;
    public topLeft: number;
    public topRight: number;
    public bottomLeft: number;
    public bottomRight: number;
    constructor(
        id: string, fill: string, border: SparklineBorderModel, opacity: number,
        rect: Rect, tl: number = 0, tr: number = 0, bl: number = 0, br: number = 0
    ) {
        super(id, fill, border.width, border.color, opacity);
        this.rect = rect;
        this.topLeft = tl;
        this.topRight = tr;
        this.bottomLeft = bl;
        this.bottomRight = br;
    }
}
/**
 * Internal use of circle options.
 *
 * @private
 */
export class CircleOption extends PathOption {
    public cy: number;
    public cx: number;
    public r: number;
    public ['stroke-dasharray']: string;
    constructor(id: string, fill: string, border: SparklineBorderModel, opacity: number, cx: number, cy: number, r: number,
                dashArray: string) {
        super(id, fill, border.width, border.color, opacity);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
        this['stroke-dasharray'] = dashArray;
    }
}

/**
 * Internal use of append shape element.
 *
 * @private
 * @param {Element} shape - The shape element to be appended.
 * @param {Element} element - The parent element to which the shape will be appended.
 * @returns {Element} - The appended shape element.
 */
export function appendShape(shape: Element, element: Element): Element {
    if (element) { element.appendChild(shape); }
    return shape;
}

/**
 * Internal rendering of Circle.
 *
 * @private
 * @param {Sparkline} sparkline - The Sparkline instance.
 * @param {CircleOption} options - The options for rendering the circle.
 * @param {Element} element - The parent element to which the circle will be appended.
 * @returns {Element} - The rendered circle element.
 */
export function drawCircle(sparkline: Sparkline, options: CircleOption, element?: Element): Element {
    return appendShape(sparkline.renderer.drawCircle(options), element);
}

/**
 * To get rounded rect path direction.
 *
 * @param {Rect} r - The rect dimensions.
 * @param {number} topLeft - The radius of the top-left corner.
 * @param {number} topRight - The radius of the top-right corner.
 * @param {number} bottomLeft - The radius of the bottom-left corner.
 * @param {number} bottomRight - The radius of the bottom-right corner.
 * @returns {string} - The SVG path string for the rounded rect path.
 */
export function calculateRoundedRectPath(
    r: Rect, topLeft: number, topRight: number,
    bottomLeft: number, bottomRight: number
): string {
    return 'M' + ' ' + r.x + ' ' + (topLeft + r.y) +
        ' Q ' + r.x + ' ' + r.y + ' ' + (r.x + topLeft) + ' ' +
        r.y + ' ' + 'L' + ' ' + (r.x + r.width - topRight) + ' ' + r.y +
        ' Q ' + (r.x + r.width) + ' ' + r.y + ' ' +
        (r.x + r.width) + ' ' + (r.y + topRight) + ' ' + 'L ' +
        (r.x + r.width) + ' ' + (r.y + r.height - bottomRight)
        + ' Q ' + (r.x + r.width) + ' ' + (r.y + r.height) + ' ' + (r.x + r.width - bottomRight) + ' ' +
        (r.y + r.height) + ' ' + 'L ' + (r.x + bottomLeft) + ' ' + (r.y + r.height) + ' Q ' + r.x + ' ' +
        (r.y + r.height) + ' ' + r.x + ' ' + (r.y + r.height - bottomLeft) + ' ' + 'L' + ' ' + r.x + ' ' +
        (topLeft + r.y) + ' ' + 'Z';
}
/**
 * Internal rendering of Rectangle.
 *
 * @private
 * @param {Sparkline} sparkline - The Sparkline instance.
 * @param {RectOption} options - The options for rendering the rectangle.
 * @param {Element} element - The parent element to which the rectangle will be appended.
 * @returns {Element} - The rendered rectangle element.
 */
export function drawRectangle(sparkline: Sparkline, options: RectOption, element?: Element): Element {
    options.d = calculateRoundedRectPath(options.rect, options.topLeft, options.topRight, options.bottomLeft, options.bottomRight);
    return appendShape(sparkline.renderer.drawPath(options), element);
}

/**
 * Internal rendering of Path.
 *
 * @private
 * @param {Sparkline} sparkline - The Sparkline instance.
 * @param {PathOption} options - The options for rendering the path.
 * @param {Element} element - The parent element to which the path will be appended.
 * @returns {Element} - The rendered path.
 */
export function drawPath(sparkline: Sparkline, options: PathOption, element?: Element): Element {
    return appendShape(sparkline.renderer.drawPath(options), element);
}

/**
 * Function to measure the height and width of the text.
 *
 * @private
 * @param {string} text - The text to measure.
 * @param {SparklineFontModel} font - The font settings for the text.
 * @param {FontModel} themeStyle - The theme style applied to the text.
 * @returns {Size} - The size of the text.
 */
export function measureText(text: string, font: SparklineFontModel, themeStyle?: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('sparklinesmeasuretext');

    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'sparklinesmeasuretext' });
        document.body.appendChild(htmlObject);
    }

    htmlObject.innerText = text;
    htmlObject.style.fontStyle = font.fontStyle || themeStyle.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily || themeStyle.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size || themeStyle.size;
    htmlObject.style.fontWeight = font.fontWeight || themeStyle.fontWeight;
    htmlObject.style.whiteSpace = 'nowrap';
    // For Bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}

/**
 * Internal use of text options
 *
 * @private
 */
export class TextOption {
    public id: string;
    public anchor: string;
    public text: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public baseLine: string = 'auto';

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string, baseLine?: string, transform: string = '') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
}
/**
 * Internal rendering of text.
 *
 * @private
 * @param {TextOption} options - The options for rendering the text.
 * @param {SparklineFontModel} font - The font settings for the text.
 * @param {string} color - The color of the text.
 * @param {HTMLElement | Element} parent - The parent element to which the text will be appended.
 * @param {FontModel} themeStyle - The theme style applied to the text.
 * @returns {Element} - The rendered text element.
 */
export function renderTextElement(options: TextOption, font: SparklineFontModel, color: string,
                                  parent: HTMLElement | Element, themeStyle?: FontModel): Element {
    const textOptions: Object = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'transform': options.transform,
        'opacity': font.opacity,
        'fill': color,
        'font-family': font.fontFamily || themeStyle.fontFamily,
        'font-weight': font.fontWeight || themeStyle.fontWeight,
        'font-size': font.size || themeStyle.size,
        'font-style': font.fontStyle || themeStyle.fontStyle,
        'text-anchor': options.anchor,
        'dominant-baseline': options.baseLine
    };
    const renderer: SvgRenderer = new SvgRenderer('');
    const htmlObject: HTMLElement = <HTMLElement>renderer.createText(textOptions, options.text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * To remove element by id.
 *
 * @param {string} id - The id of the element to remove.
 * @returns {void}
 */
export function removeElement(id: string): void {
    const element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}
/**
 * To find the element by id.
 *
 * @param {string} id - The id of the element to find.
 * @returns {Element} - The element with the specified id, if found.
 */
export function getIdElement(id: string): Element {
    return document.getElementById(id);
}
/**
 * To find point within the bounds.
 *
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @param {Rect} bounds - The bounding rectangle to check against.
 * @returns {boolean} - True if the point is within the bounds, false otherwise.
 */
export function withInBounds(x: number, y: number, bounds: Rect): boolean {
    return (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height);
}
