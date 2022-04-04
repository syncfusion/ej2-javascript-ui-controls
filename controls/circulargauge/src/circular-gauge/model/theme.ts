/* eslint-disable @typescript-eslint/no-namespace */
import { IFontMapping, IThemeStyle } from './interface';
import { GaugeTheme } from '../utils/enum';
/**
 * Specifies gauge Themes
 */
export namespace Theme {
    /** @private */
    export const axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: null
    };
    export const legendLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: null
    };
}
/**
 * @param {string} theme theme
 * @returns {string[]} palette
 * @private */
export function getRangePalette(theme: string): string[] {
    let palette: string[] = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    switch (theme.toLowerCase()) {
        case 'tailwind':
            palette = ['#0369A1', '#14B8A6', '#15803D', '#334155', '#5A61F6',
                '#65A30D', '#8B5CF6', '#9333EA', '#F59E0B', '#F97316'];
            break;
        case 'tailwinddark':
            palette = ['#10B981', '#22D3EE', '#2DD4BF', '#4ADE80', '#8B5CF6',
                '#E879F9', '#F472B6', '#F87171', '#F97316', '#FCD34D'];
            break;
        case 'bootstrap5':
            palette = ['#262E0B', '#668E1F', '#AF6E10', '#862C0B', '#1F2D50',
                '#64680B', '#311508', '#4C4C81', '#0C7DA0', '#862C0B'];
            break;
        case 'bootstrap5dark':
            palette = ['#5ECB9B', '#A860F1', '#EBA844', '#557EF7', '#E9599B',
                '#BFC529', '#3BC6CF', '#7A68EC', '#74B706', '#EA6266'];
            break;
        case 'fluent':
            palette = ['#614570', '#4C6FB1', '#CC6952', '#3F579A', '#4EA09B',
                '#6E7A89', '#D4515C', '#E6AF5D', '#639751', '#9D4D69'];
            break;
        case 'fluentdark':
            palette = ['#8AB113', '#2A72D5', '#43B786', '#584EC6', '#E85F9C',
                '#6E7A89', '#EA6266', '#EBA844', '#26BC7A', '#BC4870'];
            break;
    }
    return palette;
}

/**
 * Function to get ThemeStyle
 *
 * @param {GaugeTheme} theme theme
 * @returns {IThemeStyle} style
 * @private */
export function getThemeStyle(theme: GaugeTheme): IThemeStyle {
    let style: IThemeStyle;
    switch (theme.toLowerCase()) {
    case 'materialdark':
    case 'fabricdark':
    case 'bootstrapdark':
        style = {
            backgroundColor: '#333232',
            titleFontColor: '#ffffff',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#000000',
            labelColor: '#DADADA',
            lineColor: '#C8C8C8',
            majorTickColor: '#C8C8C8',
            minorTickColor: '#9A9A9A',
            pointerColor: '#9A9A9A',
            capColor: '#9A9A9A',
            needleColor: '#9A9A9A',
            needleTailColor: '#9A9A9A',
            labelFontFamily: 'Segoe UI',
            titleFontWeight: 'Normal'
        };
        break;
    case 'highcontrast':
        style = {
            backgroundColor: '#000000',
            titleFontColor: '#FFFFFF',
            tooltipFillColor: '#ffffff',
            tooltipFontColor: '#000000',
            labelColor: '#FFFFFF',
            lineColor: '#FFFFFF',
            majorTickColor: '#FFFFFF',
            minorTickColor: '#FFFFFF',
            pointerColor: '#FFFFFF',
            capColor: '#FFFFFF',
            needleColor: '#FFFFFF',
            needleTailColor: '#FFFFFF',
            labelFontFamily: 'Segoe UI',
            titleFontWeight: 'Normal'
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            labelColor: '#212529',
            lineColor: '#DEE2E6',
            majorTickColor: '#ADB5BD',
            minorTickColor: '#CED4DA',
            pointerColor: '#6C757D',
            capColor: '#6C757D',
            needleColor: '#6C757D',
            needleTailColor: '#6C757D',
            fontFamily: 'HelveticaNeue-Medium',
            fontSize: '16px',
            labelFontFamily: 'HelveticaNeue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            titleFontWeight: 'Normal'
        };
        break;
    case 'tailwind':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#374151',
            tooltipFillColor: '#111827',
            tooltipFontColor: '#F9FAFB',
            labelColor: '#6B7280',
            lineColor: '#E5E7EB',
            majorTickColor: '#9CA3AF',
            minorTickColor: '#9CA3AF',
            pointerColor: '#1F2937',
            capColor: '#1F2937',
            needleColor: '#1F2937',
            needleTailColor: '#1F2937',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            titleFontWeight: '500'
        };
        break;
    case 'tailwinddark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#D1D5DB',
            tooltipFillColor: '#F9FAFB',
            tooltipFontColor: '#1F2937',
            labelColor: '#9CA3AF',
            lineColor: '#374151',
            majorTickColor: '#6B7280',
            minorTickColor: '#6B7280',
            pointerColor: '#9CA3AF',
            capColor: '#9CA3AF',
            needleColor: '#9CA3AF',
            needleTailColor: '#9CA3AF',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            titleFontWeight: '500'
        };
        break;
    case 'bootstrap5':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#343A40',
            tooltipFillColor: '#212529',
            tooltipFontColor: '#F9FAFB',
            labelColor: '#495057',
            lineColor: '#E5E7EB',
            majorTickColor: '#9CA3AF',
            minorTickColor: '#9CA3AF',
            pointerColor: '#1F2937',
            capColor: '#1F2937',
            needleColor: '#1F2937',
            needleTailColor: '#1F2937',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            labelFontFamily: 'Helvetica Neue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontWeight: '500'
        };
        break;
    case 'bootstrap5dark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#E9ECEF',
            tooltipFillColor: '#E9ECEF',
            tooltipFontColor: '#212529',
            labelColor: '#CED4DA',
            lineColor: '#343A40',
            majorTickColor: '#6C757D',
            minorTickColor: '#6C757D',
            pointerColor: '#ADB5BD',
            capColor: '#ADB5BD',
            needleColor: '#ADB5BD',
            needleTailColor: '#ADB5BD',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            labelFontFamily: 'Helvetica Neue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontWeight: '500'
        };
        break;
    case 'fluent':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#201F1E',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#323130',
            labelColor: '#3B3A39',
            lineColor: '#EDEBE9',
            majorTickColor: '#C8C6C4',
            minorTickColor: '#C8C6C4',
            pointerColor: '#A19F9D',
            capColor: '#A19F9D',
            needleColor: '#A19F9D',
            needleTailColor: '#A19F9D',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontWeight: '600'
        };
        break;
    case 'fluentdark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#F3F2F1',
            tooltipFillColor: '#252423',
            tooltipFontColor: '#F3F2F1',
            labelColor: '#C8C6C4',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#797775',
            capColor: '#797775',
            needleColor: '#797775',
            needleTailColor: '#797775',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontWeight: '600'
        };
        break;
    default:
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            labelColor: '#212121',
            lineColor: '#E0E0E0',
            majorTickColor: '#9E9E9E',
            minorTickColor: '#9E9E9E',
            pointerColor: '#757575',
            capColor: '#757575',
            needleColor: '#757575',
            needleTailColor: '#757575',
            labelFontFamily: 'Segoe UI',
            titleFontWeight: 'Normal'
        };
        break;
    }
    return style;
}
