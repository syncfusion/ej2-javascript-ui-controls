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
        case 'fabric':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'bootstrap4':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        case 'bootstrap':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        case 'highcontrastlight':
        case 'highcontrast':
            palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
                '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
            break;
        case 'materialdark':
            palette = ['#9ECB08', '#56AEFF', '#C57AFF', '#61EAA9', '#EBBB3E',
                '#F45C5C', '#8A77FF', '#63C7FF', '#FF84B0', '#F7C928'];
            break;
        case 'fabricdark':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'bootstrapdark':
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
        case 'bootstrap5':
            palette = ['#262E0B', '#668E1F', '#AF6E10', '#862C0B', '#1F2D50',
                        '#64680B', '#311508', '#4C4C81', '#0C7DA0', '#862C0B'];
            break;
        case 'bootstrap5dark':
            palette = ['#5ECB9B', '#A860F1', '#EBA844', '#557EF7', '#E9599B',
                        '#BFC529', '#3BC6CF', '#7A68EC', '#74B706', '#EA6266'];
            break;
        // case 'Fluent':
        //     palette = ['#614570', '#4C6FB1', '#CC6952', '#3F579A', '#4EA09B',
        //                 '#6E7A89', '#D4515C', '#E6AF5D', '#639751', '#9D4D69'];
        //     break;
        // case 'FluentDark':
        //     palette = ['#8AB113', '#2A72D5', '#43B786', '#584EC6', '#E85F9C',
        //                 '#6E7A89', '#EA6266', '#EBA844', '#26BC7A', '#BC4870'];
        //     break;
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
// tslint:disable-next-line:max-func-body-length
export function getThemeColor(theme: SmithchartTheme): ISmithchartThemeStyle {
    let style: ISmithchartThemeStyle;
    const themes: string = theme.toLowerCase();
    const darkBackground: string = themes === 'materialdark' ? '#383838' : (themes === 'fabricdark' ? '#242424' : '#1b1b1b');
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
            background: darkBackground,
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
            background: '#1f2937',
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
    case 'bootstrap5':
        style = {
            axisLabel: '#495057',
            axisLine: '#D1D5DB',
            majorGridLine: '#E5E7EB',
            minorGridLine: '#E5E7EB',
            chartTitle: '#343A40',
            legendLabel: '#343A40',
            background: 'rgba(255, 255, 255, 0.0)',
            areaBorder: ' #DEE2E6',
            tooltipFill: '#212529',
            dataLabel: '#D1D5DB',
            tooltipBoldLabel: '#D1D5DB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#6B7280',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            labelFontFamily: 'Helvetica Neue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1
        };
        break;
    case 'bootstrap5dark':
        style = {
            axisLabel: '#CED4DA',
            axisLine: '#495057',
            majorGridLine: '#495057',
            minorGridLine: '#495057',
            chartTitle: '#E9ECEF',
            legendLabel: '#E9ECEF',
            background: '#212529',
            areaBorder: ' #495057',
            tooltipFill: '#E9ECEF',
            dataLabel: '#D1D5DB',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#6B7280',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            labelFontFamily: 'Helvetica Neue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1
        };
        break;
    // case 'fluent':
    //     style = {
    //         axisLabel: '#3B3A39',
    //         axisLine: '#D2D0CE',
    //         majorGridLine: '#D2D0CE',
    //         minorGridLine: '#EDEBE9',
    //         chartTitle: '#201F1E',
    //         legendLabel: '#323130',
    //         background: '#FFFFFF',
    //         areaBorder: ' #D2D0CE',
    //         tooltipFill: '#FFFFFF',
    //         dataLabel: '#3B3A39',
    //         tooltipBoldLabel: '#D1D5DB',
    //         tooltipLightLabel: '#F9FAFB',
    //         tooltipHeaderLine: '#6B7280',
    //         fontFamily: 'Segoe UI',
    //         fontSize: '14px',
    //         labelFontFamily: 'Segoe UI',
    //         tooltipFillOpacity: 1,
    //         tooltipTextOpacity: 1
    //     };
    //     break;
    // case 'fluentdark':
    //     style = {
    //         axisLabel: '#C8C6C4',
    //         axisLine: '#3B3A39',
    //         majorGridLine: '#3B3A39',
    //         minorGridLine: '#292827',
    //         chartTitle: '#F3F2F1',
    //         legendLabel: '#D2D0CE',
    //         background: 'transparent',
    //         areaBorder: '#3B3A39',
    //         tooltipFill: '#252423',
    //         dataLabel: '#C8C6C4',
    //         tooltipBoldLabel: '#F3F2F1',
    //         tooltipLightLabel: '#F3F2F1',
    //         tooltipHeaderLine: '#3B3A39',
    //         fontFamily: 'Segoe UI',
    //         fontSize: '14px',
    //         labelFontFamily: 'Segoe UI',
    //         tooltipFillOpacity: 1,
    //         tooltipTextOpacity: 1
    //     };
    //     break;
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
