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
        fontFamily: 'Segoe UI'
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
            heatMapTitle: '#343A40',
            axisTitle: '#343A40',
            axisLabel: '#495057',
            cellBorder: '#D1D5DB',
            background: 'transparent',
            cellTextColor: '#111827',
            toggledColor: 'transparent',
            emptyCellColor: '#E5E7EB',
            legendLabel: '#343A40',
            palette: [{ 'color': '#668E1F' },
                { 'color': '#262E0B' },
                { 'color': '#AF6E10' }]
        };
        break;
    case 'bootstrap5dark':
        style = {
            heatMapTitle: '#E9ECEF',
            axisTitle: '#E9ECEF',
            axisLabel: '#CED4DA',
            cellBorder: '#4B5563',
            background: 'transparent',
            cellTextColor: '#FFFFFF',
            toggledColor: 'transparent',
            emptyCellColor: '#343A40',
            legendLabel: '#E9ECEF',
            palette: [{ 'color': '#A860F1' },
                { 'color': '#5ECB9B' },
                { 'color': '#557EF7' }]
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
