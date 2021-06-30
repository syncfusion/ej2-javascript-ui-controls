/* eslint-disable @typescript-eslint/no-namespace */
import { ISmithchartThemeStyle, ISmithchartFontMapping } from '../model/interface';
import { SmithchartTheme } from '../utils/enum';

export namespace Theme {
    /** @private */
    export const axisLabelFont: ISmithchartFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export const smithchartTitleFont: ISmithchartFontMapping = {
        size: '15px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export const smithchartSubtitleFont: ISmithchartFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export const dataLabelFont: ISmithchartFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export const legendLabelFont: ISmithchartFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
}
/**
 * @param {SmithchartTheme} theme theme of the smith chart
 * @private
 * @returns {string[]} series colors
 */
export function getSeriesColor(theme: SmithchartTheme): string[] {
    let palette: string[];
    switch (theme.toLowerCase()) {
    case 'highcontrastlight':
        palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
            '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
        break;
    case 'fabric':
        palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
            '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
        break;
    case 'bootstrap':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
	case 'tailwind':
        palette = ['#5A61F6', '#65A30D', '#334155', '#14B8A6', '#8B5CF6',
                '#0369A1', '#F97316', '#9333EA', '#F59E0B', '#15803D'];
        break;
    case 'tailwinddark':
        palette = ['#8B5CF6', '#22D3EE', '#F87171', '#4ADE80', '#E879F9',
                    '#FCD34D', '#F97316', '#2DD4BF', '#F472B6', '#10B981'];
        break;  
    default:
        palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
            '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
        break;
    }
    return palette;
}

/**
 * @param {SmithchartTheme} theme smithchart theme
 * @private
 * @returns {ISmithchartThemeStyle} theme style of the smith chart
 */
export function getThemeColor(theme: SmithchartTheme): ISmithchartThemeStyle {
    let style: ISmithchartThemeStyle;
    const themes: string = theme.toLowerCase();
    switch (themes) {
    case 'highcontrast':
        style = {
            axisLabel: '#ffffff',
            axisLine: '#ffffff',
            majorGridLine: '#BFBFBF',
            minorGridLine: '#969696',
            chartTitle: '#ffffff',
            legendLabel: '#ffffff',
            background: '#000000',
            areaBorder: '#ffffff',
            tooltipFill: '#ffffff',
            dataLabel: '#ffffff',
            tooltipBoldLabel: '#000000',
            tooltipLightLabel: '#000000',
            tooltipHeaderLine: '#969696'
        };
        break;
    case 'materialdark':
    case 'bootstrapdark':
    case 'fabricdark':
        style = {
            axisLabel: '#DADADA',
            axisLine: ' #6F6C6C',
            majorGridLine: '#414040',
            minorGridLine: '#514F4F',
            chartTitle: '#ffffff',
            legendLabel: '#DADADA',
            background: '#000000',
            areaBorder: ' #9A9A9A',
            tooltipFill: '#F4F4F4',
            dataLabel: '#DADADA',
            tooltipBoldLabel: '#282727',
            tooltipLightLabel: '#333232',
            tooltipHeaderLine: '#9A9A9A'
        };
        break;
    case 'bootstrap4':
        style = {
            axisLabel: '#212529',
            axisLine: '#ADB5BD',
            majorGridLine: '#CED4DA',
            minorGridLine: '#DEE2E6',
            chartTitle: '#212529',
            legendLabel: '#212529',
            background: '#FFFFFF',
            areaBorder: '#DEE2E6',
            tooltipFill: '#000000',
            dataLabel: '#212529',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#FFFFFF',
            fontFamily: 'HelveticaNeue-Medium',
            fontSize: '16px',
            labelFontFamily: 'HelveticaNeue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9
        };
        break;
	case 'tailwind':
        style = {
            axisLabel: '#6B7280',
            axisLine: '#D1D5DB',
            majorGridLine: '#E5E7EB',
            minorGridLine: '#D1D5DB',
            chartTitle: '#374151',
            legendLabel: '#374151',
            background: '#FFFFFF',
            areaBorder: '#D1D5DB6',
            tooltipFill: '#111827',
            dataLabel: '#F9FAFB',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#9CA3AF',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1
        };
        break;
	case 'tailwinddark':
        style = {
            axisLabel: '#9CA3AF',
            axisLine: '#4B5563',
            majorGridLine: '#374151',
            minorGridLine: '#4B5563',
            chartTitle: '#D1D5DB',
            legendLabel: '#D1D5DB',
            background: 'transprent',
            areaBorder: '#4B5563',
            tooltipFill: '#F9FAFB',
            dataLabel: '#D1D5DB',
            tooltipBoldLabel: '#1F2937',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#9CA3AF',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1
        };
        break;
    default:
        style = {
            axisLabel: '#686868',
            axisLine: '#b5b5b5',
            majorGridLine: '#dbdbdb',
            minorGridLine: '#eaeaea',
            chartTitle: '#424242',
            legendLabel: '#353535',
            background: '#FFFFFF',
            areaBorder: 'Gray',
            tooltipFill: 'rgba(0, 8, 22, 0.75)',
            dataLabel: '#424242',
            tooltipBoldLabel: '#ffffff',
            tooltipLightLabel: '#dbdbdb',
            tooltipHeaderLine: '#ffffff'
        };
        break;
    }
    return style;
}
