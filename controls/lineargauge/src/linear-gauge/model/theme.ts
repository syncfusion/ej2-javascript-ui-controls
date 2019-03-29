/**
 * Gauge Themes doc
 */
import { IThemeStyle } from './interface';
import { LinearGaugeTheme } from '../utils/enum';

/** @private */
export function getThemeStyle(theme: LinearGaugeTheme): IThemeStyle {
    let style: IThemeStyle;
    switch (theme) {
        case 'MaterialDark':
        case 'FabricDark':
        case 'BootstrapDark':
            style = {
                backgroundColor: '#333232',
                titleFontColor: '#ffffff',
                tooltipFillColor: '#FFFFFF',
                tooltipFontColor: '#000000',
                labelColor: '#DADADA',
                lineColor: '#C8C8C8',
                majorTickColor: '#C8C8C8',
                minorTickColor: '#9A9A9A',
                pointerColor: '#9A9A9A'
            };
            break;
        case 'Highcontrast':
        case 'HighContrast':
            style = {
                backgroundColor: '#000000',
                titleFontColor: '#FFFFFF',
                tooltipFillColor: '#ffffff',
                tooltipFontColor: '#000000',
                labelColor: '#FFFFFF',
                lineColor: '#FFFFFF',
                majorTickColor: '#FFFFFF',
                minorTickColor: '#FFFFFF',
                pointerColor: '#FFFFFF'
            };
            break;
        case 'Bootstrap4':
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
                containerBackground: '#F8F9FA'
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
                containerBackground: '#e0e0e0'
            };
            break;
    }
    return style;

}