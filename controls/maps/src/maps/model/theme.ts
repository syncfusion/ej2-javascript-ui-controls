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
        fontFamily: null
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Medium',
        color: null,
        fontStyle: 'Medium',
        fontFamily: null
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
    case 'bootstrap5':
        themePalette = ['#262E0B', '#668E1F', '#AF6E10', '#862C0B', '#1F2D50',
            '#64680B', '#311508', '#4C4C81', '#0C7DA0', '#862C0B'];
        break;
    case 'bootstrap5dark':
        themePalette = ['#5ECB9B', '#A860F1', '#EBA844', '#557EF7', '#E9599B',
            '#BFC529', '#3BC6CF', '#7A68EC', '#74B706', '#EA6266'];
        break;
    case 'fluentui':
        themePalette = ['#614570', '#4C6FB1', '#CC6952', '#3F579A', '#4EA09B',
            '#6E7A89', '#D4515C', '#E6AF5D', '#639751', '#9D4D69'];
        break;
    case 'fluentuidark':
        themePalette = ['#8AB113', '#2A72D5', '#43B786', '#584EC6', '#E85F9C',
            '#6E7A89', '#EA6266', '#EBA844', '#26BC7A', '#BC4870'];
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
            fontFamily: 'Roboto, Noto, Sans-serif',
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
            fontFamily: 'Roboto, Noto, Sans-serif',
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
    case 'bootstrap5':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            areaBackgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#212529',
            subTitleFontColor: '#212529',
            legendTitleFontColor: '#212529',
            legendTextColor: '#212529',
            dataLabelFontColor: '#212529',
            tooltipFontColor: '#F9FAFB',
            tooltipFillColor: '#212529',
            zoomFillColor: '#6C757D',
            fontFamily: 'Helvetica Neue',
            titleFontSize: '14px',
            legendFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Helvetica Neue',
            titleFontWeight: 'normal',
            zoomSelectionColor: '#343A40',
            shapeFill: '#E9ECEF'
        };
        break;
    case 'bootstrap5dark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            areaBackgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#FFFFFF',
            subTitleFontColor: '#FFFFFF',
            legendTitleFontColor: '#FFFFFF',
            legendTextColor: '#FFFFFF',
            dataLabelFontColor: '#FFFFFF',
            tooltipFontColor: '#212529',
            tooltipFillColor: '#E9ECEF',
            zoomFillColor: '#B5BABE',
            fontFamily: 'Helvetica Neue',
            titleFontSize: '14px',
            legendFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Helvetica Neue',
            titleFontWeight: 'normal',
            zoomSelectionColor: '#DEE2E6',
            shapeFill: '#495057'
        };
        break;
    case 'fluentui':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            areaBackgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#201F1E',
            subTitleFontColor: '#201F1E',
            legendTitleFontColor: '#201F1E',
            legendTextColor: '#201F1E',
            dataLabelFontColor: '#201F1E',
            tooltipFontColor: '#323130',
            tooltipFillColor: '#FFFFFF',
            zoomFillColor: '#A19F9D',
            fontFamily: 'Segoe UI',
            titleFontSize: '14px',
            legendFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Segoe UI',
            titleFontWeight: '600',
            zoomSelectionColor: '#323130',
            shapeFill: '#F3F2F1'
        };
        break;
    case 'fluentuidark':
        style = {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            areaBackgroundColor: 'rgba(255,255,255, 0.0)',
            titleFontColor: '#F3F2F1',
            subTitleFontColor: '#F3F2F1',
            legendTitleFontColor: '#F3F2F1',
            legendTextColor: '#F3F2F1',
            dataLabelFontColor: '#F3F2F1',
            tooltipFontColor: '#F3F2F1',
            tooltipFillColor: '#252423',
            zoomFillColor: '#484644',
            fontFamily: 'Segoe UI',
            titleFontSize: '14px',
            legendFontSize: '12px',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            labelFontFamily: 'Segoe UI',
            titleFontWeight: '600',
            zoomSelectionColor: '#F3F2F1',
            shapeFill: '#252423'
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
            fontFamily: 'Roboto, Noto, Sans-serif',
            titleFontWeight: 'Medium',
            zoomSelectionColor: '#e61576',
            shapeFill: '#A6A6A6'
        };
        break;
    }
    return style;
}

