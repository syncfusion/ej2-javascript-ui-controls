import { ChartTheme, IFontMapping } from '../../index';
import { IRangeStyle } from '../model/range-navigator-interface';
import { RangeNavigator, ThumbSettingsModel } from '../index';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * 
 */
export namespace RangeNavigatorTheme {
    /** @private */
    export let axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let tooltipLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
}
/** @private */
export function getRangeThemeColor(theme: ChartTheme, range: RangeNavigator): IRangeStyle {
    let thumbSize: ThumbSettingsModel = range.navigatorStyleSettings.thumb;
    let thumbWidth: number = isNullOrUndefined(thumbSize.width) ? (Browser.isDevice ? 15 : 20) : thumbSize.width;
    let thumbHeight: number = isNullOrUndefined(thumbSize.height) ? (Browser.isDevice ? 15 : 20) : thumbSize.height;
    let style: IRangeStyle = {
        gridLineColor: '#E0E0E0',
        axisLineColor: '#000000',
        labelFontColor: '#686868',
        unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.6)' : '#EEEEEE',
        thumpLineColor: 'rgba(189, 189, 189, 1)',
        thumbBackground: 'rgba(250, 250, 250, 1)',
        gripColor: '#757575',
        background: '#FFFFFF',
        thumbHoverColor: '#EEEEEE',
        selectedRegionColor: range.series.length ? 'transparent' : '#FF4081',
        tooltipBackground: 'rgb(0, 8, 22)',
        tooltipFontColor: '#dbdbdb',
        thumbWidth: thumbWidth,
        thumbHeight: thumbHeight
    };
    switch (theme) {
        case 'Fabric':
            style.selectedRegionColor = range.series.length ? 'transparent' : '#007897';
            break;
        case 'Bootstrap':
            style.selectedRegionColor = range.series.length ? 'transparent' : '#428BCA';
            break;
        case 'Highcontrast':
            style = {
                gridLineColor: '#bdbdbd',
                axisLineColor: '#969696',
                labelFontColor: '#ffffff',
                unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.3)' : '#EEEEEE',
                thumpLineColor: '#ffffff',
                thumbBackground: '#262626',
                gripColor: '#ffffff',
                background: '#000000',
                thumbHoverColor: '#BFBFBF',
                selectedRegionColor: range.series.length ? 'transparent' : '#FFD939',
                tooltipBackground: '#ffffff',
                tooltipFontColor: '#000000',
                thumbWidth: thumbWidth,
                thumbHeight: thumbHeight
            };
            break;
        default:
            style.selectedRegionColor = range.series.length ? 'transparent' : '#FF4081';
            break;
    }
    return style;
}