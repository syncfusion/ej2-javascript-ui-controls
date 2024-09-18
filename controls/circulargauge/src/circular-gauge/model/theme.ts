/* eslint-disable @typescript-eslint/no-namespace */
import { IFontMapping, IThemeStyle } from './interface';
import { GaugeTheme } from '../utils/enum';
/**
 * Specifies gauge Themes
 */
export namespace Theme {
    /** @private */
    export const axisLabelFont: IFontMapping = {
        size: null ,
        fontWeight: null,
        color: null,
        fontStyle: 'Normal',
        fontFamily: null
    };
    export const legendLabelFont: IFontMapping = {
        size: null,
        fontWeight: null,
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
    case 'fluent':
        palette = ['#614570', '#4C6FB1', '#CC6952', '#3F579A', '#4EA09B',
            '#6E7A89', '#D4515C', '#E6AF5D', '#639751', '#9D4D69'];
        break;
    case 'fluentdark':
        palette = ['#8AB113', '#2A72D5', '#43B786', '#584EC6', '#E85F9C',
            '#6E7A89', '#EA6266', '#EBA844', '#26BC7A', '#BC4870'];
        break;
    case 'material3':
        palette = ['#6200EE', '#E77A16', '#82C100', '#7107DC', '#05BB3D',
            '#D21020', '#FAD200', '#0085FF', '#9204EA', '#08EE9B'];
        break;
    case 'material3dark':
        palette = ['#4EAAFF', '#FA4EAB', '#FFF500', '#17EA58', '#38FFE7',
            '#FF9E45', '#B3F32F', '#B93CE4', '#FC5664', '#9B55FF'];
        break;
    case 'fluent2':
        palette = ['#6200EE', '#09AF74', '#0076E5', '#CB3587', '#E7910F',
            '#0364DE', '#66CD15', '#F3A93C', '#107C10', '#C19C00'];
        break;
    case 'fluent2dark':
    case 'fluent2highcontrast':
        palette = ['#9BB449', '#2A72D5', '#43B786', '#3F579A', '#584EC6',
            '#E85F9C', '#6E7A89', '#EA6266', '#0B6A0B', '#C19C00'];
        break;
    case 'bootstrap5':
    case 'bootstrap5dark':
        palette = ['#6610F2', '#6f42C1', '#D63384', '#DC3545',
            '#FD7E14', '#FFC107', '#198754', '#0DCAF0'];
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
            tooltipFontSize: '13px',
            tooltipTextOpacity: 1,
            labelColor: '#DADADA',
            lineColor: '#C8C8C8',
            majorTickColor: '#C8C8C8',
            minorTickColor: '#9A9A9A',
            pointerColor: '#9A9A9A',
            capColor: '#9A9A9A',
            needleColor: '#9A9A9A',
            needleTailColor: '#9A9A9A',
            fontSize: '12px',
            titleFontSize: '15px',
            labelFontFamily: 'Segoe UI',
            fontFamily: 'Segoe UI',
            fontWeight: 'Normal',
            titleFontWeight: 'Normal'
        };
        break;
    case 'highcontrast':
        style = {
            backgroundColor: '#000000',
            titleFontColor: '#FFFFFF',
            tooltipFillColor: '#ffffff',
            tooltipFontColor: '#000000',
            tooltipFontSize: '13px',
            tooltipTextOpacity: 1,
            labelColor: '#FFFFFF',
            lineColor: '#FFFFFF',
            majorTickColor: '#FFFFFF',
            minorTickColor: '#FFFFFF',
            pointerColor: '#FFFFFF',
            capColor: '#FFFFFF',
            needleColor: '#FFFFFF',
            needleTailColor: '#FFFFFF',
            fontSize: '12px',
            titleFontSize: '15px',
            labelFontFamily: 'Segoe UI',
            fontFamily: 'Segoe UI',
            fontWeight: 'Normal',
            titleFontWeight: 'Normal'
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '13px',
            labelColor: '#212529',
            lineColor: '#DEE2E6',
            majorTickColor: '#ADB5BD',
            minorTickColor: '#CED4DA',
            pointerColor: '#6C757D',
            capColor: '#6C757D',
            needleColor: '#6C757D',
            needleTailColor: '#6C757D',
            fontFamily: 'HelveticaNeue-Medium',
            fontSize: '12px',
            titleFontSize: '16px',
            labelFontFamily: 'HelveticaNeue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            fontWeight: 'Normal',
            titleFontWeight: 'Normal'
        };
        break;
    case 'tailwind':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#374151',
            tooltipFillColor: '#111827',
            tooltipFontColor: '#F9FAFB',
            tooltipFontSize: '13px',
            labelColor: '#6B7280',
            lineColor: '#E5E7EB',
            majorTickColor: '#9CA3AF',
            minorTickColor: '#9CA3AF',
            pointerColor: '#1F2937',
            capColor: '#1F2937',
            needleColor: '#1F2937',
            needleTailColor: '#1F2937',
            fontFamily: 'Inter',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            fontWeight: 'Normal',
            titleFontWeight: '500'
        };
        break;
    case 'tailwinddark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#D1D5DB',
            tooltipFillColor: '#F9FAFB',
            tooltipFontColor: '#1F2937',
            tooltipFontSize: '13px',
            labelColor: '#9CA3AF',
            lineColor: '#374151',
            majorTickColor: '#6B7280',
            minorTickColor: '#6B7280',
            pointerColor: '#9CA3AF',
            capColor: '#9CA3AF',
            needleColor: '#9CA3AF',
            needleTailColor: '#9CA3AF',
            fontFamily: 'Inter',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            fontWeight: 'Normal',
            titleFontWeight: '500'
        };
        break;
    case 'bootstrap5':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            fontSize: '10px',
            tooltipFontSize: '12px',
            labelColor: '#212529',
            lineColor: '#E9ECEF',
            majorTickColor: '#CED4DA',
            minorTickColor: '#CED4DA',
            pointerColor: '#343A40',
            capColor: '#343A40',
            needleColor: '#343A40',
            needleTailColor: '#343A40',
            fontFamily: 'Segoe UI',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 0.9,
            fontWeight: '400',
            titleFontWeight: '400'
        };
        break;
    case 'bootstrap5dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#DEE2E6',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#212529',
            fontSize: '10px',
            tooltipFontSize: '12px',
            labelColor: '#DEE2E6',
            lineColor: '#343A40',
            majorTickColor: '#6C757D',
            minorTickColor: '#6C757D',
            pointerColor: '#ADB5BD',
            capColor: '#ADB5BD',
            needleColor: '#ADB5BD',
            needleTailColor: '#ADB5BD',
            fontFamily: 'Segoe UI',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 0.9,
            fontWeight: '400',
            titleFontWeight: '400'
        };
        break;
    case 'fluent':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#201F1E',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#323130',
            tooltipFontSize: '13px',
            labelColor: '#3B3A39',
            lineColor: '#EDEBE9',
            majorTickColor: '#C8C6C4',
            minorTickColor: '#C8C6C4',
            pointerColor: '#A19F9D',
            capColor: '#A19F9D',
            needleColor: '#A19F9D',
            needleTailColor: '#A19F9D',
            fontFamily: 'Segoe UI',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: 'Normal',
            titleFontWeight: '600'
        };
        break;
    case 'fluentdark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#F3F2F1',
            tooltipFillColor: '#252423',
            tooltipFontColor: '#F3F2F1',
            tooltipFontSize: '13px',
            labelColor: '#C8C6C4',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#797775',
            capColor: '#797775',
            needleColor: '#797775',
            needleTailColor: '#797775',
            fontFamily: 'Segoe UI',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: 'Normal',
            titleFontWeight: '600'
        };
        break;
    case 'material3':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#1C1B1F',
            tooltipFillColor: '#313033',
            tooltipFontColor: '#F4EFF4',
            tooltipFontSize: '14px',
            labelColor: ' #1E192B',
            lineColor: '#E7E0EC',
            majorTickColor: '#C4C7C5',
            minorTickColor: '#C4C7C5',
            pointerColor: '#49454E',
            capColor: '#49454E',
            needleColor: '#49454E',
            needleTailColor: '#49454E',
            fontFamily: 'Roboto',
            fontSize: '12px',
            titleFontSize: '16px',
            labelFontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: '400',
            titleFontWeight: '500'
        };
        break;
    case 'material3dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#E6E1E5',
            tooltipFillColor: '#E6E1E5',
            tooltipFontColor: '#313033',
            tooltipFontSize: '14px',
            labelColor: '#E6E1E5',
            lineColor: '#49454F',
            majorTickColor: '#444746',
            minorTickColor: '#444746',
            pointerColor: '#CAC4D0',
            capColor: '#CAC4D0',
            needleColor: '#CAC4D0',
            needleTailColor: '#CAC4D0',
            fontFamily: 'Roboto',
            fontSize: '12px',
            titleFontSize: '16px',
            labelFontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: '400',
            titleFontWeight: '500'
        };
        break;
    case 'fluent2':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#242424',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#242424',
            tooltipFontSize: '12px',
            labelColor: '#242424',
            lineColor: '#EDEBE9',
            majorTickColor: '#C8C6C4',
            minorTickColor: '#C8C6C4',
            pointerColor: '#A19F9D',
            capColor: '#A19F9D',
            needleColor: '#A19F9D',
            needleTailColor: '#A19F9D',
            fontFamily: 'Segoe UI',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: '400',
            titleFontWeight: '600'
        };
        break;
    case 'fluent2dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#FFFFFF',
            tooltipFillColor: '#292929',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            labelColor: '#FFFFFF',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#8A8886',
            capColor: '#8A8886',
            needleColor: '#8A8886',
            needleTailColor: '#8A8886',
            fontFamily: 'Segoe UI',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: '400',
            titleFontWeight: '600'
        };
        break;
    case 'fluent2highcontrast':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#FFFFFF',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            labelColor: '#FFFFFF',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#8A8886',
            capColor: '#8A8886',
            needleColor: '#8A8886',
            needleTailColor: '#8A8886',
            fontFamily: 'Segoe UI',
            fontSize: '12px',
            titleFontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            fontWeight: '400',
            titleFontWeight: '600',
            tooltipBorderColor: '#FFF',
            legendBorderColor: '#FFF',
            legendBorderWidth: 1
        };
        break;
    default:
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            tooltipFontSize: '13px',
            tooltipTextOpacity: 1,
            labelColor: '#212121',
            lineColor: '#E0E0E0',
            majorTickColor: '#9E9E9E',
            minorTickColor: '#9E9E9E',
            pointerColor: '#757575',
            capColor: '#757575',
            needleColor: '#757575',
            needleTailColor: '#757575',
            fontSize: '12px',
            titleFontSize: '15px',
            labelFontFamily: 'Segoe UI',
            fontFamily: 'Segoe UI',
            fontWeight: 'Normal',
            titleFontWeight: 'Normal'
        };
        break;
    }
    return style;
}
