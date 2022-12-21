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
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            legendTitleColor: '#DADADA',
            legendTextColor: '#DADADA',
            fontSize: '15px',
            subtitleFontSize: '14px',
            legendFontSize: '13px',
            fontFamily: 'Roboto, Noto, Sans-serif'
        };
        break;
    case 'highcontrast':
        style = {
            backgroundColor: '#000000',
            titleFontColor: '#FFFFFF',
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            legendTitleColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            fontSize: '15px',
            subtitleFontSize: '14px',
            legendFontSize: '13px',
            fontFamily: 'Roboto, Noto, Sans-serif'
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            subTitleFontColor: '#212529',
            tooltipFillColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            legendTitleColor: '#212529',
            legendTextColor: '#212529',
            fontFamily: 'HelveticaNeue-Medium',
            fontSize: '16px',
            subtitleFontSize: '14px',
            legendFontSize: '14px',
            labelFontFamily: 'HelveticaNeue'
        };
        break;
    case 'tailwind':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#374151',
            subTitleFontColor: '#374151',
            tooltipFillColor: '#111827',
            tooltipFontColor: '#F9FAFB',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#374151',
            legendTextColor: '#374151',
            fontFamily: 'Inter',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Inter'
        };
        break;
    case 'tailwinddark':
        style = {
            backgroundColor: 'transparent',
            titleFontColor: '#D1D5DB',
            subTitleFontColor: '#D1D5DB',
            tooltipFillColor: '#F9FAFB',
            tooltipFontColor: '#1F2937',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#D1D5DB',
            legendTextColor: '#D1D5DB',
            fontFamily: 'Inter',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Inter'
        };
        break;
    case 'bootstrap5':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#212529',
            subTitleFontColor: '#212529',
            tooltipFillColor: '#212529',
            tooltipFontColor: '#F9FAFB',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#212529',
            legendTextColor: '#212529',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Helvetica Neue'
        };
        break;
    case 'bootstrap5dark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#FFFFFF',
            subTitleFontColor: '#FFFFFF',
            tooltipFillColor: '#E9ECEF',
            tooltipFontColor: '#212529',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            fontFamily: 'Helvetica Neue',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Helvetica Neue'
        };
        break;
    case 'fluent':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#201F1E',
            subTitleFontColor: '#201F1E',
            tooltipFillColor: '#FFFFFF',
            tooltipFontColor: '#323130',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#201F1E',
            legendTextColor: '#201F1E',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI'
        };
        break;
    case 'fluentdark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#F3F2F1',
            subTitleFontColor: '#F3F2F1',
            tooltipFillColor: '#252423',
            tooltipFontColor: '#F3F2F1',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            legendTitleColor: '#F3F2F1',
            legendTextColor: '#F3F2F1',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            subtitleFontSize: '12px',
            legendFontSize: '12px',
            labelFontFamily: 'Segoe UI'
        };
        break;
    default:
        style = {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            subTitleFontColor: '#424242',
            tooltipFillColor: '#363F4C',
            tooltipFontColor: '#ffffff',
            legendTitleColor: '#353535',
            legendTextColor: '#353535',
            fontSize: '15px',
            subtitleFontSize: '14px',
            legendFontSize: '13px',
            fontFamily: 'Roboto, Noto, Sans-serif'
        };
        break;
    }
    return style;
}
