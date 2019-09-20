/**
 * Maps Themes doc
 */

import { IFontMapping, IThemeStyle } from '../model/interface';
import { TreeMapTheme } from '../utils/enum';

export namespace Theme {
    /** @private */
    export let mapsTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Medium',
        color: '#424242',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
}

/**
 * @private
 * To get the theme style based on treemap theme.
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
                tooltipFillColor: 'rgba(0, 8, 22, 0.75)',
                tooltipFontColor: '#ffffff',
                tooltipFillOpacity: 0.75,
                legendTitleColor: '#DADADA',
                legendTextColor: '#DADADA',
                fontFamily: 'Roboto, Noto, Sans-serif',
                labelFontFamily: 'Roboto, Segoe UI, Noto, Sans-serif',
                borderWidth: 0.5,
                borderColor: '#cccccc'
            };
            break;
        case 'highcontrast':
            style = {
                backgroundColor: '#000000',
                titleFontColor: '#FFFFFF',
                subTitleFontColor: '#FFFFFF',
                tooltipFillColor: 'rgba(0, 8, 22, 0.75)',
                tooltipFontColor: '#ffffff',
                tooltipFillOpacity: 0.75,
                legendTitleColor: '#FFFFFF',
                legendTextColor: '#FFFFFF',
                fontFamily: 'Roboto, Noto, Sans-serif',
                labelFontFamily: 'Roboto, Segoe UI, Noto, Sans-serif',
                borderWidth: 0.5,
                borderColor: '#cccccc'
            };
            break;
        case 'bootstrap4':
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#212529',
                subTitleFontColor: '#212529',
                tooltipFillColor: 'rgba(0, 8, 22, 0.75)',
                tooltipFontColor: '#FFFFFF',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9,
                legendTitleColor: '#212529',
                legendTextColor: '#212529',
                fontFamily: 'HelveticaNeue-Medium',
                fontSize: '16px',
                legendFontSize: '14px',
                labelFontFamily: 'HelveticaNeue',
                borderWidth: 0.5,
                borderColor: '#cccccc'
            };
            break;
        default:
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#424242',
                subTitleFontColor: '#424242',
                tooltipFillColor: 'rgba(0, 8, 22, 0.75)',
                tooltipFontColor: '#ffffff',
                legendTitleColor: '#353535',
                legendTextColor: '#353535',
                fontFamily: 'Roboto, Noto, Sans-serif',
                labelFontFamily: 'Roboto, Segoe UI, Noto, Sans-serif',
                borderWidth: 0.5,
                borderColor: '#cccccc'
            };
            break;
    }
    return style;
}