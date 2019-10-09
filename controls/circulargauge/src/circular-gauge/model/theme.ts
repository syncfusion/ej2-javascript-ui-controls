import { IFontMapping, IThemeStyle } from './interface';
import { GaugeTheme } from '../utils/enum';
/**
 * Specifies gauge Themes
 */
export namespace Theme {
    /** @private */
    export let axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    export let legendLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
}
/** @private */
export function getRangePalette(theme: string): string[] {
    let palette: string[] = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    // switch (theme) {
    //     case 'Material':
    //         palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    //         break;
    //      case 'Fabric':
    //         palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    //         break;
    // }
    return palette;
}

/** @private */
export function getThemeStyle(theme: GaugeTheme): IThemeStyle {
    let style: IThemeStyle;
    switch (theme.toLowerCase()) {
        case 'materialdark':
        case 'fabricdark':
        case 'bootstrapdark':
            style = {
                backgroundColor: '#333232',
                titleFontColor: '#ffffff',
                tooltipFillColor: '#FFFFFF',
                tooltipFontColor: '#000000',
                labelColor: '#DADADA',
                lineColor: '#C8C8C8',
                majorTickColor: '#C8C8C8',
                minorTickColor: '#9A9A9A',
                pointerColor: '#9A9A9A',
                capColor: '#9A9A9A',
                needleColor: '#9A9A9A',
                needleTailColor: '#9A9A9A'
            };
            break;
        case 'highcontrast':
            style = {
                backgroundColor: '#000000',
                titleFontColor: '#FFFFFF',
                tooltipFillColor: '#ffffff',
                tooltipFontColor: '#000000',
                labelColor: '#FFFFFF',
                lineColor: '#FFFFFF',
                majorTickColor: '#FFFFFF',
                minorTickColor: '#FFFFFF',
                pointerColor: '#FFFFFF',
                capColor: '#FFFFFF',
                needleColor: '#FFFFFF',
                needleTailColor: '#FFFFFF'
            };
            break;
        case 'bootstrap4':
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#212529',
                tooltipFillColor: '#000000',
                tooltipFontColor: '#FFFFFF',
                labelColor: '#212529',
                lineColor: '#DEE2E6',
                majorTickColor: '#ADB5BD',
                minorTickColor: '#CED4DA',
                pointerColor: '#6C757D',
                capColor: '#6C757D',
                needleColor: '#6C757D',
                needleTailColor: '#6C757D',
                fontFamily: 'HelveticaNeue-Medium',
                fontSize: '16px',
                labelFontFamily: 'HelveticaNeue',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9
            };
            break;
        default:
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#424242',
                tooltipFillColor: '#363F4C',
                tooltipFontColor: '#ffffff',
                labelColor: '#212121',
                lineColor: '#E0E0E0',
                majorTickColor: '#9E9E9E',
                minorTickColor: '#9E9E9E',
                pointerColor: '#757575',
                capColor: '#757575',
                needleColor: '#757575',
                needleTailColor: '#757575'
            };
            break;
    }
    return style;

} 