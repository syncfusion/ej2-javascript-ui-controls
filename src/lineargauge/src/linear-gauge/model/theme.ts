/**
 * Gauge Themes doc
 */
import { IThemeStyle } from './interface';
import { LinearGaugeTheme } from '../utils/enum';

/**
 *
 * @param {LinearGaugeTheme} theme - Specifies the gauge instance.
 * @returns {IThemeStyle} - Return the theme style argument.
 * @private
 */
export function getThemeStyle(theme: LinearGaugeTheme): IThemeStyle {
    let style: IThemeStyle;
    switch (theme.toLowerCase()) {
    case 'materialdark':
    case 'fabricdark':
    case 'bootstrapdark':
        style = {
            backgroundColor: '#333232',
            titleFontColor: '#ffffff',
            titleFontSize: '15px',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#000000',
            tooltipFontSize: '13px',
            labelColor: '#DADADA',
            lineColor: '#C8C8C8',
            majorTickColor: '#C8C8C8',
            minorTickColor: '#9A9A9A',
            pointerColor: '#9A9A9A',
            titleFontStyle: 'Normal',
            titleFontWeight: 'Normal',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#bfbfbf',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI'
        };
        break;
    case 'highcontrast':
        style = {
            backgroundColor: '#000000',
            titleFontColor: '#FFFFFF',
            titleFontSize: '15px',
            tooltipFillColor: '#ffffff',
            tooltipFontColor: '#000000',
            tooltipFontSize: '13px',
            labelColor: '#FFFFFF',
            lineColor: '#FFFFFF',
            majorTickColor: '#FFFFFF',
            minorTickColor: '#FFFFFF',
            pointerColor: '#FFFFFF',
            titleFontStyle: 'Normal',
            titleFontWeight: 'Normal',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#bfbfbf',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI'
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            titleFontSize: '15px',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '13px',
            labelColor: '#212529',
            lineColor: '#ADB5BD',
            majorTickColor: '#ADB5BD',
            minorTickColor: '#CED4DA',
            pointerColor: '#6C757D',
            fontFamily: 'HelveticaNeue-Medium',
            fontSize: '16px',
            labelFontFamily: 'HelveticaNeue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            containerBackground: '#F8F9FA',
            titleFontStyle: 'Normal',
            titleFontWeight: 'Normal',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#bfbfbf'
        };
        break;
    case 'tailwind':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#374151',
            titleFontSize: '15px',
            tooltipFillColor: '#111827',
            tooltipFontColor: '#F9FAFB',
            tooltipFontSize: '13px',
            labelColor: '#6B7280',
            lineColor: '#E5E7EB',
            majorTickColor: '#9CA3AF',
            minorTickColor: '#9CA3AF',
            pointerColor: '#1F2937',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            containerBackground: 'rgba(255,255,255, 0.0)',
            titleFontStyle: 'Normal',
            titleFontWeight: '500',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#E5E7EB'
        };
        break;
    case 'tailwinddark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#D1D5DB',
            titleFontSize: '15px',
            tooltipFillColor: '#F9FAFB',
            tooltipFontColor: '#1F2937',
            tooltipFontSize: '13px',
            labelColor: '#9CA3AF',
            lineColor: '#374151',
            majorTickColor: '#6B7280',
            minorTickColor: '#6B7280',
            pointerColor: '#9CA3AF',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            containerBackground: 'rgba(255,255,255, 0.0)',
            titleFontStyle: 'Normal',
            titleFontWeight: '500',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#4b5563'
        };
        break;
    case 'bootstrap5':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#212529',
            titleFontSize: '14px',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            labelColor: '#212529',
            lineColor: '#E9ECEF',
            majorTickColor: '#CED4DA',
            minorTickColor: '#CED4DA',
            pointerColor: '#343A40',
            fontSize: '14px',
            titleFontStyle: 'normal',
            titleFontWeight: '400',
            labelStyle: 'normal',
            labelWeight: '400',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 0.9,
            containerBackground: '#E9ECEF',
            containerBorderColor: '#E9ECEF'
        };
        break;
    case 'bootstrap5dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#DEE2E6',
            titleFontSize: '14px',
            titleFontStyle: 'normal',
            titleFontWeight: '400',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#212529',
            tooltipFontSize: '12px',
            labelColor: '#DEE2E6',
            labelStyle: 'normal',
            labelWeight: '400',
            labelFontFamily: 'Segoe UI',
            lineColor: '#343A40',
            majorTickColor: '#6C757D',
            minorTickColor: '#6C757D',
            pointerColor: '#ADB5BD',
            fontSize: '14px',
            fontFamily: 'Segoe UI',
            tooltipFillOpacity: 0.9,
            containerBackground: '#343A40',
            containerBorderColor: '#343A40'
        };
        break;
    case 'fluent':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#201F1E',
            titleFontSize: '15px',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#323130',
            tooltipFontSize: '13px',
            labelColor: '#3B3A39',
            lineColor: '#EDEBE9',
            majorTickColor: '#C8C6C4',
            minorTickColor: '#C8C6C4',
            pointerColor: '#A19F9D',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            containerBackground: 'rgba(255,255,255, 0.0)',
            titleFontStyle: 'normal',
            titleFontWeight: '600',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#EDEBE9'
        };
        break;
    case 'fluentdark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#F3F2F1',
            titleFontSize: '15px',
            tooltipFillColor: '#252423',
            tooltipFontColor: '#F3F2F1',
            tooltipFontSize: '13px',
            labelColor: '#C8C6C4',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#797775',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            containerBackground: 'rgba(255,255,255, 0.0)',
            titleFontStyle: 'normal',
            titleFontWeight: '600',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#292827'
        };
        break;
    case 'material3':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#1C1B1F',
            titleFontSize: '16px',
            tooltipFillColor: '#313033',
            tooltipFontColor: '#F4EFF4',
            tooltipFontSize: '14px',
            labelColor: ' #1E192B',
            lineColor: '#C4C7C5',
            majorTickColor: '#C4C7C5',
            minorTickColor: '#C4C7C5',
            pointerColor: '#49454E',
            fontFamily: 'Roboto',
            fontSize: '12px',
            labelFontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            containerBackground: '#E7E0EC',
            titleFontStyle: 'normal',
            titleFontWeight: '500',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#E7E0EC'
        };
        break;
    case 'material3dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#E6E1E5',
            titleFontSize: '16px',
            tooltipFillColor: '#E6E1E5',
            tooltipFontColor: '#313033',
            tooltipFontSize: '14px',
            labelColor: '#E6E1E5',
            lineColor: '#938F99',
            majorTickColor: '#938F99',
            minorTickColor: '#938F99',
            pointerColor: '#CAC4D0',
            fontFamily: 'Roboto',
            fontSize: '12px',
            labelFontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            containerBackground: '#49454F',
            titleFontStyle: 'normal',
            titleFontWeight: '500',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#49454F'
        };
        break;
    case 'fluent2':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#242424',
            titleFontSize: '14px',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#242424',
            tooltipFontSize: '12px',
            labelColor: '#616161',
            lineColor: '#EDEBE9',
            majorTickColor: '#C8C6C4',
            minorTickColor: '#C8C6C4',
            pointerColor: '#A19F9D',
            fontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontStyle: 'normal',
            titleFontWeight: '600',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#EDEBE9',
            containerBackground: '#EDEBE9',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI'
        };
        break;
    case 'fluent2dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#FFFFFF',
            titleFontSize: '14px',
            tooltipFillColor: '#292929',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            labelColor: '#ADADAD',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#8A8886',
            fontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontStyle: 'normal',
            titleFontWeight: '600',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#292827',
            containerBackground: '#292827',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI'
        };
        break;
    case 'fluent2highcontrast':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#FFFFFF',
            titleFontSize: '14px',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            labelColor: '#FFFFFF',
            lineColor: '#292827',
            majorTickColor: '#484644',
            minorTickColor: '#484644',
            pointerColor: '#8A8886',
            fontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            titleFontStyle: 'normal',
            titleFontWeight: '600',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#292827',
            containerBackground: '#292827',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI',
            tooltipBorderColor: '#FFF',
            tooltipBorderWidth: 1
        };
        break;
    default:
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            titleFontSize: '15px',
            tooltipFillColor: '#FFFFF',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '13px',
            labelColor: '#686868',
            lineColor: '#a6a6a6',
            majorTickColor: '#a6a6a6',
            minorTickColor: '#a6a6a6',
            pointerColor: '#a6a6a6',
            containerBackground: '#e0e0e0',
            titleFontStyle: 'Normal',
            titleFontWeight: 'Normal',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#bfbfbf',
            fontFamily: 'Segoe UI',
            labelFontFamily: 'Segoe UI'
        };
        break;
    }
    return style;

}
