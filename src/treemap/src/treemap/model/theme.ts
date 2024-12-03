/**
 * Maps Themes doc
 */

import { IFontMapping, IThemeStyle } from '../model/interface';
import { TreeMapTheme } from '../utils/enum';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Theme {
    /**
     * @private
     */
    export const mapsTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Medium',
        color: '#424242',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
}

/**
 * To get the theme style based on treemap theme.
 *
 * @param {TreeMapTheme} theme Specifies the theme of the treemap control.
 * @returns {IThemeStyle} Returns the theme.
 * @private
 */
export function getThemeStyle(theme: TreeMapTheme): IThemeStyle {
    let style: IThemeStyle; let color: string;
    switch (theme.toLowerCase()) {
    case 'materialdark':
        color = '#303030';
        break;
    case 'fabricdark':
        color = '#201F1F';
        break;
    case 'bootstrapdark':
        color = '#1A1A1A';
        break;
    }
    switch (theme.toLowerCase()) {
    case 'bootstrapdark':
    case 'fabricdark':
    case 'materialdark':
        style = {
            backgroundColor: color,
            titleFontColor: '#FFFFFF',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            tooltipFontSize: '13px',
            legendTitleColor: '#DADADA',
            legendTextColor: '#DADADA',
            fontSize: '15px',
            fontWeight: 'Normal',
            subtitleFontSize: '14px',
            legendFontSize: '13px',
            fontFamily: 'Roboto, Noto, Sans-serif',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'highcontrast':
        style = {
            backgroundColor: '#000000',
            titleFontColor: '#FFFFFF',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            tooltipFontSize: '13px',
            legendTitleColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 'Normal',
            subtitleFontSize: '14px',
            legendFontSize: '13px',
            fontFamily: 'Roboto, Noto, Sans-serif',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '13px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            legendTitleColor: '#212529',
            legendTextColor: '#212529',
            fontFamily: 'HelveticaNeue-Medium',
            fontSize: '16px',
            fontWeight: 'Normal',
            subtitleFontSize: '14px',
            legendFontSize: '14px',
            labelFontFamily: 'HelveticaNeue',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'tailwind':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#374151',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#374151',
            tooltipFillColor: '#111827',
            tooltipFontColor: '#F9FAFB',
            tooltipFontSize: '13px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#374151',
            legendTextColor: '#374151',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 'Normal',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Inter',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'tailwinddark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#D1D5DB',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#D1D5DB',
            tooltipFillColor: '#F9FAFB',
            tooltipFontColor: '#1F2937',
            tooltipFontSize: '13px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#D1D5DB',
            legendTextColor: '#D1D5DB',
            fontFamily: 'Inter',
            fontWeight: 'Normal',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Inter',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'bootstrap5':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#212529',
            titleFontWeight: '400',
            subTitleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            tooltipFillOpacity: 0.9,
            legendTitleColor: '#212529',
            legendTextColor: '#212529',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: '400',
            subtitleFontSize: '12px',
            legendFontSize: '10px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '10px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'bootstrap5dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#DEE2E6',
            titleFontWeight: '400',
            subTitleFontColor: '#DEE2E6',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#212529',
            tooltipFontSize: '12px',
            tooltipFillOpacity: 0.9,
            legendTitleColor: '#DEE2E6',
            legendTextColor: '#DEE2E6',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: '400',
            subtitleFontSize: '12px',
            legendFontSize: '10px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '10px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'fluent':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#201F1E',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#201F1E',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#323130',
            tooltipFontSize: '13px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#201F1E',
            legendTextColor: '#201F1E',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: 'Normal',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'fluentdark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#F3F2F1',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#F3F2F1',
            tooltipFillColor: '#252423',
            tooltipFontColor: '#F3F2F1',
            tooltipFontSize: '13px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#F3F2F1',
            legendTextColor: '#F3F2F1',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: 'Normal',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'material3':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#1C1B1F',
            titleFontWeight: '500',
            subTitleFontColor: '#1C1B1F',
            tooltipFillColor: '#313033',
            tooltipFontColor: '#F4EFF4',
            tooltipFontSize: '14px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#1C1B1F',
            legendTextColor: '#49454E',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: '400',
            subtitleFontSize: '14px',
            legendFontSize: '14px',
            labelFontFamily: 'Roboto',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'material3dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#E6E1E5',
            titleFontWeight: '500',
            subTitleFontColor: '#E6E1E5',
            tooltipFillColor: '#E6E1E5',
            tooltipFontColor: '#313033',
            tooltipFontSize: '14px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#E6E1E5',
            legendTextColor: '#CAC4D0',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: '400',
            subtitleFontSize: '14px',
            legendFontSize: '14px',
            labelFontFamily: 'Roboto',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'fluent2':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#242424',
            titleFontWeight: '600',
            subTitleFontColor: '#242424',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#242424',
            tooltipFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#242424',
            legendTextColor: '#242424',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: '400',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '10px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'fluent2dark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#FFFFFF',
            titleFontWeight: '600',
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#292929',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: '400',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '10px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    case 'fluent2highcontrast':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#FFFFFF',
            titleFontWeight: '600',
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            fontWeight: '400',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI',
            labelFontSize: '10px',
            legendBorderColor: '#FFF',
            legendBorderWidth: 1,
            tooltipBorderColor: '#FFF',
            tooltipBorderWidth: 1
        };
        break;
    default:
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            titleFontWeight: 'Normal',
            subTitleFontColor: '#424242',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            tooltipFontSize: '13px',
            legendTitleColor: '#353535',
            legendTextColor: '#353535',
            fontSize: '15px',
            fontWeight: 'Normal',
            subtitleFontSize: '14px',
            legendFontSize: '13px',
            fontFamily: 'Roboto, Noto, Sans-serif',
            labelFontSize: '12px',
            legendBorderColor: '#000000',
            legendBorderWidth: 0
        };
        break;
    }
    return style;
}
