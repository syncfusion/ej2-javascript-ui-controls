/**
 * 
 */
import { ISmithchartThemeStyle, ISmithchartFontMapping} from '../model/interface';
import { SmithchartTheme} from '../utils/enum';

export namespace Theme {
    /** @private */
    export let axisLabelFont: ISmithchartFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export let smithchartTitleFont: ISmithchartFontMapping = {
        size: '15px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export let smithchartSubtitleFont: ISmithchartFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export let dataLabelFont: ISmithchartFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    export let legendLabelFont: ISmithchartFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
}
/** @private */
export function getSeriesColor(theme: SmithchartTheme): string[] {
    let palette: string[];
    switch (theme) {
        case 'Highcontrast':
            palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
                '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
            break;
        case 'Fabric':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'Bootstrap':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        default:
            palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
                '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
            break;
    }
    return palette;
}

/** @private */
export function getThemeColor(theme: SmithchartTheme): ISmithchartThemeStyle {
    let style: ISmithchartThemeStyle;
    switch (theme) {
        case 'Highcontrast':
            style = {
                axisLabel: '#ffffff',
                axisLine: '#ffffff',
                majorGridLine: '#BFBFBF',
                minorGridLine: '#969696',
                chartTitle: '#ffffff',
                legendLabel: '#ffffff',
                background: '#000000',
                areaBorder: '#ffffff',
                tooltipFill: '#ffffff',
                dataLabel: '#ffffff',
                tooltipBoldLabel: '#000000',
                tooltipLightLabel: '#000000',
                tooltipHeaderLine: '#969696',
            };
            break;
        default:
            style = {
                axisLabel: '#686868',
                axisLine: '#b5b5b5',
                majorGridLine: '#dbdbdb',
                minorGridLine: '#eaeaea',
                chartTitle: '#424242',
                legendLabel: '#353535',
                background: '#FFFFFF',
                areaBorder: 'Gray',
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                dataLabel: '#424242',
                tooltipBoldLabel: '#ffffff',
                tooltipLightLabel: '#dbdbdb',
                tooltipHeaderLine: '#ffffff'
            };
            break;
    }
    return style;
}