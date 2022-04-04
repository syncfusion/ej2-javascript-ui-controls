/* eslint-disable valid-jsdoc */
/**
 * Gauge Themes doc
 */
import { IThemeStyle } from './interface';
import { LinearGaugeTheme } from '../utils/enum';

/** @private */
export function getThemeStyle(theme: LinearGaugeTheme): IThemeStyle {
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
            titleFontStyle: 'Normal',
            titleFontWeight: 'Normal',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#bfbfbf'
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
            titleFontStyle: 'Normal',
            titleFontWeight: 'Normal',
            labelStyle: 'Normal',
            labelWeight: 'Normal',
            containerBorderColor: '#bfbfbf'
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
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
            tooltipFillColor: '#111827',
            tooltipFontColor: '#F9FAFB',
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
            tooltipFillColor: '#F9FAFB',
            tooltipFontColor: '#1F2937',
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
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#343A40',
            tooltipFillColor: '#212529',
            tooltipFontColor: '#F9FAFB',
            labelColor: '#495057',
            lineColor: '#E5E7EB',
            majorTickColor: '#9CA3AF',
            minorTickColor: '#9CA3AF',
            pointerColor: '#1F2937',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            labelFontFamily: 'Helvetica Neue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            containerBackground: 'rgba(255,255,255, 0.0)',
            titleFontStyle: 'normal',
            titleFontWeight: '500',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#E5E7EB'
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
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            labelFontFamily: 'Helvetica Neue',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            containerBackground: 'rgba(255,255,255, 0.0)',
            titleFontStyle: 'normal',
            titleFontWeight: '500',
            labelStyle: 'normal',
            labelWeight: '400',
            containerBorderColor: '#4b5563'
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
            tooltipFillColor: '#252423',
            tooltipFontColor: '#F3F2F1',
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
    default:
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            tooltipFillColor: '#FFFFF',
            tooltipFontColor: '#FFFFFF',
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
            containerBorderColor: '#bfbfbf'
        };
        break;
    }
    return style;

}
