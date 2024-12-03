import { IFontMapping, IThemeStyle } from './interface';
import { HeatMapTheme } from '../utils/enum';
/**
 * Specifies HeatMaps Themes
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Theme {
    /** @private */
    export const heatMapTitleFont: IFontMapping = {
        size: '15px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const titleFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None'
    };
    /** @private */
    export const axisTitleFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None'
    };
    /** @private */
    export const rectLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None'
    };
    /** @private */
    export const tooltipFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None'
    };
}

/**
 * Functions to check whether target object implement specific interface.
 *
 * @param  { HeatMapTheme } theme - specifies the value.
 * @returns { IThemeStyle } returns the theme style
 * @private
 */
export function getThemeColor(theme: HeatMapTheme): IThemeStyle {
    let style: IThemeStyle;
    switch (theme.toLowerCase()) {
    case 'highcontrastlight':
    case 'highcontrast':
        style = {
            heatMapTitle: '#ffffff',
            axisTitle: '#ffffff',
            axisLabel: '#ffffff',
            cellBorder: '#EEEEEE',
            background: '#000000',
            cellTextColor: '#000000',
            toggledColor: '#000000',
            emptyCellColor: '#EEEEEE',
            legendLabel: '#ffffff',
            palette: [{ 'color': '#BEE7EE' },
                { 'color': '#85c4cf' },
                { 'color': '#4CA1AF' }]
        };
        break;
    case 'materialdark':
    case 'fabricdark':
    case 'bootstrapdark':
        style = {
            heatMapTitle: '#ffffff',
            axisTitle: '#ffffff',
            axisLabel: '#DADADA',
            cellBorder: '#EEEEEE',
            background: '#000000',
            cellTextColor: '#000000',
            toggledColor: '#000000',
            emptyCellColor: '#EEEEEE',
            legendLabel: '#ffffff',
            palette: [{ 'color': '#BEE7EE' },
                { 'color': '#85c4cf' },
                { 'color': '#4CA1AF' }]
        };
        break;
    case 'bootstrap4':
        style = {
            heatMapTitle: '#212529',
            axisTitle: '#212529',
            axisLabel: '#212529',
            cellBorder: '#E9ECEF',
            background: '#FFFFFF',
            cellTextColor: '#212529',
            toggledColor: '#ffffff',
            emptyCellColor: '#E9ECEF',
            legendLabel: '#212529',
            palette: [{ 'color': '#BEE7EE' },
                { 'color': '#85c4cf' },
                { 'color': '#4CA1AF' }]
        };
        break;
    case 'tailwind':
        style = {
            heatMapTitle: '#374151',
            axisTitle: '#374151',
            axisLabel: '#6B7280',
            cellBorder: '#E5E7EB',
            background: 'transparent',
            cellTextColor: '#111827',
            toggledColor: 'transparent',
            emptyCellColor: '#E5E7EB',
            legendLabel: '#374151',
            palette: [{ 'color': '#5A61F6' },
                { 'color': '#65A30D' },
                { 'color': '#14B8A6' }]
        };
        break;
    case 'tailwinddark':
        style = {
            heatMapTitle: '#D1D5DB',
            axisTitle: '#D1D5DB',
            axisLabel: '#9CA3AF',
            cellBorder: '#4B5563',
            background: 'transparent',
            cellTextColor: '#FFFFFF',
            toggledColor: 'transparent',
            emptyCellColor: '#374151',
            legendLabel: '#D1D5DB',
            palette: [{ 'color': '#8B5CF6' },
                { 'color': '#22D3EE' },
                { 'color': '#F87171' }]
        };
        break;
    case 'bootstrap5':
        style = {
            heatMapTitle: '#212529',
            axisTitle: '#212529',
            axisLabel: '#212529',
            cellBorder: 'transparent',
            background: 'transparent',
            toggledColor: '#E9ECEF',
            emptyCellColor: '#E9ECEF',
            legendLabel: '#212529',
            palette: [{ 'color': '#DC3545' },
                {'color': '#FFC107' },
                {'color': '#D63384'}]
        };
        break;
    case 'bootstrap5dark':
        style = {
            heatMapTitle: '#DEE2E6',
            axisTitle: '#DEE2E6',
            axisLabel: '#DEE2E6',
            cellBorder: 'transparent',
            background: 'transparent',
            toggledColor: '#343A40',
            emptyCellColor: '#343A40',
            legendLabel: '#DEE2E6',
            palette: [{ 'color': '#DC3545' },
                { 'color': '#FFC107' },
                { 'color': '#D63384' }]
        };
        break;
    case 'fluent':
        style = {
            heatMapTitle: '#201F1E',
            axisTitle: '#201F1E',
            axisLabel: '#201F1E',
            cellBorder: '#EDEBE9',
            background: 'transparent',
            cellTextColor: '#111827',
            toggledColor: 'transparent',
            emptyCellColor: '#EDEBE9',
            legendLabel: '#201F1E',
            palette: [{ 'color': '#EDEBE9' },
                { 'color': '#614570' },
                { 'color': '#4C6FB1' }]
        };
        break;
    case 'fluentdark':
        style = {
            heatMapTitle: '#F3F2F1',
            axisTitle: '#F3F2F1',
            axisLabel: '#F3F2F1',
            cellBorder: '#EDEBE9',
            background: 'transparent',
            cellTextColor: '#FFFFFF',
            toggledColor: 'transparent',
            emptyCellColor: '#292827',
            legendLabel: '#F3F2F1',
            palette: [{ 'color': '#292827' },
                { 'color': '#2A72D5' },
                { 'color': '#43B786' }]
        };
        break;
    case 'material3':
        style = {
            heatMapTitle: '#1C1B1F',
            axisTitle: '#1C1B1F',
            axisLabel: '#1C1B1F',
            cellBorder: '#C4C7C5',
            background: 'transparent',
            cellTextColor: '#1C1B1F',
            toggledColor: '#F6F0FB',
            emptyCellColor: '#F6F0FB',
            legendLabel: '#49454E',
            palette: [{ 'color': '#6200EE' },
                { 'color': '#E77A16' },
                { 'color': '#82C100' }]
        };
        break;
    case 'material3dark':
        style = {
            heatMapTitle: '#E6E1E5',
            axisTitle: '#E6E1E5',
            axisLabel: '#E6E1E5',
            cellBorder: '#444746',
            background: 'transparent',
            cellTextColor: '#E6E1E5',
            toggledColor: '#49454F',
            emptyCellColor: '#49454E',
            legendLabel: '#CAC4D0',
            palette: [{ 'color': '#4EAAFF' },
                { 'color': '#FA4EAB' },
                { 'color': '#FFF500' }]
        };
        break;
    case 'fluent2':
        style = {
            heatMapTitle: '#242424',
            axisTitle: '#242424',
            axisLabel: '#242424',
            cellBorder: 'transparent',
            background: 'transparent',
            cellTextColor: '#242424',
            toggledColor: '#EDEBE9',
            emptyCellColor: '#EDEBE9',
            legendLabel: '#242424',
            palette: [{ 'color': '#6200EE' },
                { 'color': '#09AF74' },
                { 'color': '#0076E5' }]
        };
        break;
    case 'fluent2dark':
    case 'fluent2highcontrast':
        style = {
            heatMapTitle: '#FFFFFF',
            axisTitle: '#FFFFFF',
            axisLabel: '#FFFFFF',
            cellBorder: 'transparent',
            background: 'transparent',
            cellTextColor: '#FFFFFF',
            toggledColor: '#292827',
            emptyCellColor: '#292827',
            legendLabel: '#FFFFFF',
            palette: [{ 'color': '#9BB449' },
                { 'color': '#2A72D5' },
                { 'color': '#43B786' }]
        };
        break;
    default:
        style = {
            heatMapTitle: '#424242',
            axisTitle: '#424242',
            axisLabel: '#686868',
            cellBorder: '#EEEEEE',
            cellTextColor: '#000000',
            toggledColor: '#ffffff',
            background: '#FFFFFF',
            emptyCellColor: '#EEEEEE',
            legendLabel: '#353535',
            palette: [{ 'color': '#BEE7EE' },
                { 'color': '#85c4cf' },
                { 'color': '#4CA1AF' }]
        };
        break;
    }
    return style;
}
