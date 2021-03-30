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
            legendFontSize: '14px',
            labelFontFamily: 'HelveticaNeue'
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
            fontFamily: 'Roboto, Noto, Sans-serif'
        };
        break;
    }
    return style;
}
