
import { IFontMapping } from './interface';
import { AccumulationTheme } from '../../accumulation-chart/model/enum';
import { ChartTheme } from '../../chart/utils/enum';
import { IThemeStyle, IScrollbarThemeStyle } from '../../index';

/**
 * Specifies Chart Themes
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
    /** @private */
    export let axisTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let chartTitleFont: IFontMapping = {
        size: '15px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let chartSubTitleFont: IFontMapping = {
        size: '11px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let crosshairLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let tooltipLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let stripLineLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#353535',
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
}
/** @private */
export function getSeriesColor(theme: ChartTheme | AccumulationTheme): string[] {
    let palette: string[];
    switch (theme) {
        case 'Fabric':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'Bootstrap':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        case 'Highcontrast':
            palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
                '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
            break;
        default:
            palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
                '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
            break;
    }
    return palette;
}
/** @private */
export function getThemeColor(theme: ChartTheme | AccumulationTheme): IThemeStyle {
    let style: IThemeStyle;
    switch (theme) {
        case 'Highcontrast':
            style = {
                axisLabel: '#ffffff',
                axisTitle: '#ffffff',
                axisLine: '#ffffff',
                majorGridLine: '#BFBFBF',
                minorGridLine: '#969696',
                majorTickLine: '#BFBFBF',
                minorTickLine: '#969696',
                chartTitle: '#ffffff',
                legendLabel: '#ffffff',
                background: '#000000',
                areaBorder: '#ffffff',
                errorBar: '#ffffff',
                crosshairLine: '#ffffff',
                crosshairFill: '#ffffff',
                crosshairLabel: '#000000',
                tooltipFill: '#ffffff',
                tooltipBoldLabel: '#000000',
                tooltipLightLabel: '#000000',
                tooltipHeaderLine: '#969696',
                markerShadow: '#BFBFBF',
                selectionRectFill: 'rgba(255, 217, 57, 0.3)',
                selectionRectStroke: '#ffffff',
                selectionCircleStroke: '#FFD939'
            };
            break;
        default:
            style = {
                axisLabel: '#686868',
                axisTitle: '#424242',
                axisLine: '#b5b5b5',
                majorGridLine: '#dbdbdb',
                minorGridLine: '#eaeaea',
                majorTickLine: '#b5b5b5',
                minorTickLine: '#d6d6d6',
                chartTitle: '#424242',
                legendLabel: '#353535',
                background: '#FFFFFF',
                areaBorder: 'Gray',
                errorBar: '#000000',
                crosshairLine: '#4f4f4f',
                crosshairFill: '#4f4f4f',
                crosshairLabel: '#e5e5e5',
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                tooltipBoldLabel: '#ffffff',
                tooltipLightLabel: '#dbdbdb',
                tooltipHeaderLine: '#ffffff',
                markerShadow: null,
                selectionRectFill: 'rgba(41, 171, 226, 0.1)',
                selectionRectStroke: '#29abe2',
                selectionCircleStroke: '#29abe2'
            };
            break;
    }
    return style;
}

/** @private */
export function getScrollbarThemeColor(theme: ChartTheme): IScrollbarThemeStyle {
    let scrollStyle: IScrollbarThemeStyle;
    switch (theme) {
        case 'Highcontrast':
            scrollStyle = {
                backRect: '#333',
                thumb: '#bfbfbf',
                circle: '#fff',
                circleHover: '#685708',
                arrow: '#333',
                grip: '#333',
                arrowHover: '#fff',
                backRectBorder: '#969696',
            };
            break;
        case 'Bootstrap':
            scrollStyle = {
                backRect: '#f5f5f5',
                thumb: '#e6e6e6',
                circle: '#fff',
                circleHover: '#eee',
                arrow: '#8c8c8c',
                grip: '#8c8c8c'
            };
            break;
        case 'Fabric':
            scrollStyle = {
                backRect: '#f8f8f8',
                thumb: '#eaeaea',
                circle: '#fff',
                circleHover: '#eaeaea',
                arrow: '#a6a6a6',
                grip: '#a6a6a6'
            };
            break;
        default:
            scrollStyle = {
                backRect: '#f5f5f5',
                thumb: '#e0e0e0',
                circle: '#fff',
                circleHover: '#eee',
                arrow: '#9e9e9e',
                grip: '#9e9e9e'
            };
            break;

    }
    return scrollStyle;
}