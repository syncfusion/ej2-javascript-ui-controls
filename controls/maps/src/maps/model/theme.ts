/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Maps Themes doc
 */
import { IFontMapping, MapsTheme } from '../index';
import { IThemeStyle } from './interface';

/**
 * Specifies Maps Themes
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Theme {
    /** @private */
    export const mapsTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: null,
        color: '#424242',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const mapsSubTitleFont: IFontMapping = {
        size: '13px',
        fontWeight: null,
        color: '#424242',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Regular',
        color: null,
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Regular',
        color: null,
        fontStyle: 'Regular',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Medium',
        color: null,
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const dataLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FabricTheme {
    /** @private */
    export const mapsTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Semibold',
        color: '#424242',
        fontStyle: 'Semibold',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const mapsSubTitleFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Regular',
        color: '#424242',
        fontStyle: 'Regular',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#757575',
        fontStyle: 'Regular',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#757575',
        fontStyle: 'Medium',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const dataLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BootstrapTheme {
    /** @private */
    export const mapsTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Semibold',
        color: '#424242',
        fontStyle: 'Semibold',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const mapsSubTitleFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Regular',
        color: '#424242',
        fontStyle: 'Regular',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#757575',
        fontStyle: 'Regular',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#757575',
        fontStyle: 'Medium',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    export const dataLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
}
/**
 * Internal use of Method to getting colors based on themes.
 *
 * @private
 * @param {MapsTheme} theme Specifies the theme of the maps
 * @returns {string[]} Returns the shape color
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export function getShapeColor(theme: MapsTheme): string[] {
    let themePalette: string[];
    switch (theme.toLowerCase()) {
    case 'tailwind':
        themePalette = ['#0369A1', '#14B8A6', '#15803D', '#334155', '#5A61F6',
            '#65A30D', '#8B5CF6', '#9333EA', '#F59E0B', '#F97316'];
        break;
    case 'tailwinddark':
        themePalette = ['#10B981', '#22D3EE', '#2DD4BF', '#4ADE80', '#8B5CF6',
            '#E879F9', '#F472B6', '#F87171', '#F97316', '#FCD34D'];
        break;
    default:
        themePalette = ['#B5E485', '#7BC1E8', '#DF819C', '#EC9B79', '#78D0D3',
            '#D6D572', '#9178E3', '#A1E5B4', '#87A4B4', '#E4C16C'];
        break;
    }
    return themePalette;
}
/**
 * HighContrast Theme configuration
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HighContrastTheme {
    /** @private */
    export const mapsTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Medium',
        color: '#FFFFFF',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const mapsSubTitleFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#FFFFFF',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#000000',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#FFFFFF',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const dataLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
}

/**
 * Dark Theme configuration
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DarkTheme {
    /** @private */
    export const mapsTitleFont: IFontMapping = {
        fontFamily: 'Roboto, Noto, Sans-serif',
        fontWeight: 'Medium',
        size: '14px',
        fontStyle: 'Medium',
        color: '#FFFFFF'
    };
    /** @private */
    export const mapsSubTitleFont: IFontMapping = {
        size: '13px',
        color: '#FFFFFF',
        fontWeight: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif',
        fontStyle: 'Medium'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '12px',
        color: '#282727',
        fontWeight: 'Regular',
        fontFamily: 'Roboto',
        fontStyle: 'Regular'
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontFamily: 'Roboto, Noto, Sans-serif',
        fontWeight: 'Medium',
        color: '#DADADA',
        fontStyle: 'Medium'
    };

}

/**
 * Method to get the theme style
 *
 * @param {MapsTheme} theme - Specifies the theme.
 * @returns {IThemeStyle} - Returns the theme style.
 */
export function getThemeStyle(theme: MapsTheme): IThemeStyle {
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
    case 'materialdark':
    case 'fabricdark':
    case 'bootstrapdark':
        style = {
            backgroundColor: color,
            areaBackgroundColor: color,
            titleFontColor: '#FFFFFF',
            subTitleFontColor: '#FFFFFF',
            legendTitleFontColor: '#DADADA',
            legendTextColor: '#DADADA',
            dataLabelFontColor: '#DADADA',
            tooltipFontColor: '#FFFFFF',
            tooltipFillColor: '#363F4C',
            zoomFillColor: '#FFFFFF',
            labelFontFamily: 'Roboto, Noto, Sans-serif',
            titleFontWeight: 'Medium',
            zoomSelectionColor: '#e61576',
            shapeFill: '#A6A6A6'
        };
        break;
    case 'highcontrast':
        style = {
            backgroundColor: '#000000',
            areaBackgroundColor: '#000000',
            titleFontColor: '#FFFFFF',
            subTitleFontColor: '#FFFFFF',
            legendTitleFontColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            dataLabelFontColor: '#000000',
            tooltipFontColor: '#000000',
            tooltipFillColor: '#ffffff',
            zoomFillColor: '#FFFFFF',
            labelFontFamily: 'Roboto, Noto, Sans-serif',
            titleFontWeight: 'Medium',
            zoomSelectionColor: '#e61576',
            shapeFill: '#A6A6A6'
        };
        break;
    case 'bootstrap4':
        style = {
            backgroundColor: '#FFFFFF',
            areaBackgroundColor: '#FFFFFF',
            titleFontColor: '#212529',
            subTitleFontColor: '#212529',
            legendTitleFontColor: '#212529',
            legendTextColor: '#212529',
            dataLabelFontColor: '#212529',
            tooltipFontColor: '#FFFFFF',
            tooltipFillColor: '#000000',
            zoomFillColor: '#5B6269',
            fontFamily: 'HelveticaNeue-Medium',
            titleFontSize: '16px',
            legendFontSize: '14px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            labelFontFamily: 'HelveticaNeue-Medium',
            titleFontWeight: 'Medium',
            zoomSelectionColor: '#e61576',
            shapeFill: '#A6A6A6'
        };
        break;
    case 'tailwind':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            areaBackgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#374151',
            subTitleFontColor: '#374151',
            legendTitleFontColor: '#374151',
            legendTextColor: '#6B7280',
            dataLabelFontColor: '#505967',
            tooltipFontColor: '#F9FAFB',
            tooltipFillColor: '#111827',
            zoomFillColor: '#6b7280',
            fontFamily: 'Inter',
            titleFontSize: '14px',
            legendFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            labelFontFamily: 'Inter',
            titleFontWeight: '500',
            zoomSelectionColor: '#374151',
            shapeFill: '#E5E7EB'
        };
        break;
    case 'tailwinddark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            areaBackgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#D1D5DB',
            subTitleFontColor: '#D1D5DB',
            legendTitleFontColor: '#D1D5DB',
            legendTextColor: '#D1D5DB',
            dataLabelFontColor: '#D1D5DB',
            tooltipFontColor: '#1F2937',
            tooltipFillColor: '#F9FAFB',
            zoomFillColor: '#D1D5DB',
            fontFamily: 'Inter',
            titleFontSize: '14px',
            legendFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            labelFontFamily: 'Inter',
            titleFontWeight: '500',
            zoomSelectionColor: '#F3F4F6',
            shapeFill: '#374151'
        };
        break;
    default:
        style = {
            backgroundColor: '#FFFFFF',
            areaBackgroundColor: '#FFFFFF',
            titleFontColor: '#424242',
            subTitleFontColor: '#424242',
            legendTitleFontColor: '#757575',
            legendTextColor: '#757575',
            dataLabelFontColor: '#000000',
            tooltipFontColor: '#FFFFFF',
            tooltipFillColor: '#000000',
            zoomFillColor: '#737373',
            labelFontFamily: 'Roboto, Noto, Sans-serif',
            titleFontWeight: 'Medium',
            zoomSelectionColor: '#e61576',
            shapeFill: '#A6A6A6'
        };
        break;
    }
    return style;
}

