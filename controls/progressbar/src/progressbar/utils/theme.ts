/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/**
 * Theme of the progressbar
 */
import { ProgressTheme } from './index';
import { IProgressStyle } from '../model/progress-interface';
/** @private */
export function getProgressThemeColor(theme: ProgressTheme): IProgressStyle {
    let style: IProgressStyle;
    switch (theme) {
    case 'Material':
        style = {
            linearTrackColor: '#E3165B',
            linearProgressColor: '#E3165B',
            circularTrackColor: '#E3165B',
            circularProgressColor: '#E3165B',
            backgroundColor: 'transparent',
            fontColor: '#000000',
            linearFontFamily: 'Roboto',
            linearFontSize: '12',
            linearFontStyle: 'Regular',
            circularFontFamily: 'Roboto',
            circularFontStyle: 'Normal',
            circularFontSize: '20',
            progressOpacity: 1,
            trackOpacity: 0.26,
            bufferOpacity: 0.4,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 4,
            linearProgressThickness: 4,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#4caf50',
            danger: '#ff6652',
            warning: '#ff9800',
            info: '#03a9f4'
        };
        break;
    case 'Bootstrap':
        style = {
            linearTrackColor: '#EEEEEE',
            linearProgressColor: '#317ab9',
            circularTrackColor: '#EEEEEE',
            circularProgressColor: '#317ab9',
            backgroundColor: 'transparent',
            fontColor: '#000000',
            linearFontFamily: 'Helvetica',
            linearFontStyle: 'Regular',
            linearFontSize: '12',
            circularFontFamily: 'Segoe UI',
            circularFontStyle: 'Normal',
            circularFontSize: '20',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 20,
            linearProgressThickness: 20,
            circularTrackThickness: 6,
            circularProgressThickness: 6,
            success: '#48b14c',
            danger: '#d44f4f',
            warning: '#fac168',
            info: '#2aaac0'
        };
        break;
    case 'Bootstrap4':
        style = {
            linearTrackColor: '#E9ECEF',
            linearProgressColor: '#007bff',
            circularTrackColor: '#E9ECEF',
            circularProgressColor: '#007bff',
            backgroundColor: 'transparent',
            fontColor: '#000000',
            linearFontFamily: 'Helvetica',
            linearFontStyle: 'Regular',
            linearFontSize: '12',
            circularFontFamily: 'Helvetica',
            circularFontStyle: 'Normal',
            circularFontSize: '20',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 6,
            circularProgressThickness: 6,
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        break;
    case 'HighContrast':
        style = {
            linearTrackColor: '#BFBFBF',
            linearProgressColor: '#FFD939',
            circularTrackColor: '#BFBFBF',
            circularProgressColor: '#FFD939',
            backgroundColor: 'transparent',
            fontColor: '#FFFFFF',
            linearFontFamily: 'Segoe UI',
            linearFontSize: '12',
            linearFontStyle: 'Regular',
            circularFontFamily: 'Segoe UI',
            circularFontStyle: 'Normal',
            circularFontSize: '20',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#2bc700',
            danger: '#ff6161',
            warning: '#ff7d1a',
            info: '#66b0ff'
        };
        break;
	case 'Tailwind':
		style = {
            linearTrackColor: '#E5E7EB',
            linearProgressColor: '#4F46E5',
            circularTrackColor: '#E5E7EB',
            circularProgressColor: '#4F46E5',
            backgroundColor: 'transparent',
            fontColor: '#FFFFFF',
            linearFontFamily: 'Inter',
            linearFontSize: '12',
            linearFontStyle: 'Regular',
            circularFontFamily: 'Inter',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#15803D',
            danger: '#DC2626',
            warning: '#C2410C',
            info: '#0E7490'
        };
        break;
	case 'TailwindDark':
		style = {
            linearTrackColor: '#4B5563',
            linearProgressColor: '#22D3EE',
            circularTrackColor: '#4B5563',
            circularProgressColor: '#22D3EE',
            backgroundColor: 'transparent',
            fontColor: '#D1D5DB',
            linearFontFamily: 'Inter',
            linearFontSize: '12',
            linearFontStyle: 'Regular',
            circularFontFamily: 'Interr',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.45,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#22C55E',
            danger: '#F87171',
            warning: '#ea580c',
            info: '#06B6D4'
        };
        break;
    case 'FabricDark':
    case 'BootstrapDark':
    case 'MaterialDark':
        style = {
            linearTrackColor: '#C8C8C8',
            linearProgressColor: '#9A9A9A',
            circularTrackColor: '#C8C8C8',
            circularProgressColor: '#9A9A9A',
            backgroundColor: 'transparent',
            fontColor: '#000000',
            linearFontFamily: 'Helvetica',
            linearFontStyle: 'Normal',
            linearFontSize: '12',
            circularFontFamily: 'Helvetica',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#22b24b',
            danger: '#ac2a2a',
            warning: '#ffca1c',
            info: '#489bd5'
        };
        break;
    case 'Bootstrap5':
        style = {
            linearTrackColor: '#E9ECEF',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#E9ECEF',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            fontColor: '#0D6EFD',
            linearFontFamily: 'Helvetica Neue',
            linearFontStyle: 'Normal',
            linearFontSize: '12',
            circularFontFamily: 'Helvetica Neue',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#198754',
            danger: '#DC3545',
            warning: '#FFC107',
            info: '#0DCAF0'
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            linearTrackColor: '#3B4248',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#3B4248',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            fontColor: '#0D6EFD',
            linearFontFamily: 'Helvetica Neue',
            linearFontStyle: 'Normal',
            linearFontSize: '12',
            circularFontFamily: 'Helvetica Neue',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.4,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#21B26F',
            danger: '#E4606D',
            warning: '#FFC107',
            info: '#0DCAF0'
        };
        break;
    case 'Fluent':
        style = {
            linearTrackColor: '#F3F2F1',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#F3F2F1',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            fontColor: '#0D6EFD',
            linearFontFamily: 'Helvetica Neue',
            linearFontStyle: 'Normal',
            linearFontSize: '12',
            circularFontFamily: 'Helvetica Neue',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.45,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#0B6A0B',
            danger: '#D13438',
            warning: '#CA5010',
            info: '#038387'
        };
        break;
    case 'FluentDark':
        style = {
            linearTrackColor: '#3B4248',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#3B4248',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            fontColor: '#0D6EFD',
            linearFontFamily: 'Helvetica Neue',
            linearFontStyle: 'Normal',
            linearFontSize: '12',
            circularFontFamily: 'Helvetica Neue',
            circularFontStyle: 'Normal',
            circularFontSize: '14',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#0B6A0B',
            danger: '#D13438',
            warning: '#CA5010',
            info: '#038387'
        };
        break;
    default:
        style = {
            linearTrackColor: '#EAEAEA',
            linearProgressColor: '#0078D6',
            circularTrackColor: '#E6E6E6',
            circularProgressColor: '#0078D6',
            backgroundColor: 'transparent',
            fontColor: '#333333',
            linearFontFamily: 'Segoe UI',
            linearFontStyle: 'Regular',
            linearFontSize: '12',
            circularFontFamily: 'Segoe UI',
            circularFontStyle: 'Normal',
            circularFontSize: '20',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.3,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            success: '#166600',
            danger: '#b30900',
            warning: '#944000',
            info: '#0056b3'
        };
        break;
    }
    return style;
}
