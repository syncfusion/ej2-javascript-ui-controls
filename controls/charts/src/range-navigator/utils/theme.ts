/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-namespace */
import { ChartTheme, IFontMapping } from '../../index';
import { IRangeStyle } from '../model/range-navigator-interface';
import { RangeNavigator, ThumbSettingsModel } from '../index';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 *
 */
export namespace RangeNavigatorTheme {
    /** @private */
    export const axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
}
/** @private */
export function getRangeThemeColor(theme: ChartTheme, range: RangeNavigator): IRangeStyle {
    const thumbSize: ThumbSettingsModel = range.navigatorStyleSettings.thumb;
    const thumbWidth: number = isNullOrUndefined(thumbSize.width) ? (Browser.isDevice ? 15 : 20) : thumbSize.width;
    const thumbHeight: number = isNullOrUndefined(thumbSize.height) ? (Browser.isDevice ? 15 : 20) : thumbSize.height;
    const darkAxisColor: string = (theme === 'HighContrast') ? '#969696' : '#6F6C6C';
    const darkGridlineColor: string = (theme === 'HighContrast') ? '#4A4848' : '#414040';
    const darkBackground: string = theme === 'MaterialDark' ? '#303030' : (theme === 'FabricDark' ? '#201F1F' : '1A1A1A');
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
    switch (theme as string) {
    case 'Fabric':
        style.selectedRegionColor = range.series.length ? 'transparent' : '#007897';
        break;
    case 'Bootstrap':
        style.selectedRegionColor = range.series.length ? 'transparent' : '#428BCA';
        break;
    case 'HighContrastLight':
        style = {
            gridLineColor: '#bdbdbd',
            axisLineColor: '#969696',
            labelFontColor: '#ffffff',
            unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.3)' : '#EEEEEE',
            thumpLineColor: '#ffffff',
            thumbBackground: '#262626',
            gripColor: '#ffffff',
            background: darkBackground,
            thumbHoverColor: '#BFBFBF',
            selectedRegionColor: range.series.length ? 'transparent' : '#FFD939',
            tooltipBackground: '#ffffff',
            tooltipFontColor: '#000000',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight
        };
        break;
    case 'Highcontrast':
    case 'HighContrast':
        style = {
            gridLineColor: darkGridlineColor,
            axisLineColor: darkAxisColor,
            labelFontColor: '#DADADA',
            unselectedRectColor: range.series.length ? 'rgba(43, 43, 43, 0.6)' : '#514F4F',
            thumpLineColor: '#969696',
            thumbBackground: '#333232',
            gripColor: '#DADADA',
            background: '#000000',
            thumbHoverColor: '#BFBFBF',
            selectedRegionColor: range.series.length ? 'rgba(22, 22, 22, 0.6)' : '#FFD939',
            tooltipBackground: '#F4F4F4',
            tooltipFontColor: '#282727',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            labelFontColor: '#DADADA',
            axisLineColor: ' #6F6C6C',
            gridLineColor: '#414040',
            tooltipBackground: '#F4F4F4',
            tooltipFontColor: '#333232',
            unselectedRectColor: range.series.length ? 'rgba(43, 43, 43, 0.6)' : '#514F4F',
            thumpLineColor: '#969696',
            thumbBackground: '#333232',
            gripColor: '#DADADA',
            background: darkBackground,
            thumbHoverColor: '#BFBFBF',
            selectedRegionColor: range.series.length ? 'rgba(22, 22, 22, 0.6)' :
                theme === 'FabricDark' ? '#007897' : theme === 'BootstrapDark' ? '#428BCA' : '#FF4081',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight
        };
        break;
    case 'Bootstrap4':
        style = {
            gridLineColor: '#E0E0E0',
            axisLineColor: '#CED4DA',
            labelFontColor: '#212529',
            unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.6)' : '#514F4F',
            thumpLineColor: 'rgba(189, 189, 189, 1)',
            thumbBackground: '#FFFFFF',
            gripColor: '#495057',
            background: 'rgba(255, 255, 255, 0.6)',
            thumbHoverColor: '#EEEEEE',
            selectedRegionColor: range.series.length ? 'transparent' : '#FFD939',
            tooltipBackground: 'rgba(0, 0, 0, 0.9)',
            tooltipFontColor: 'rgba(255, 255, 255)',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight
        };
        break;
	case 'Tailwind':
        style = {
            gridLineColor: '#E5E7EB',
            axisLineColor: '#D1D5DB',
            labelFontColor: '#6B7280',
            unselectedRectColor: range.series.length ? 'transparent' : '#E5E7EB',
            thumpLineColor: '#9CA3AF',
            thumbBackground: '#FFFFFF',
            gripColor: '#6B7280',
            background: 'rgba(255, 255, 255, 0.6)',
            thumbHoverColor: '#374151',
            selectedRegionColor: range.series.length ? 'rgba(79, 70, 229, 0.3)' : '#4F46E5',
            tooltipBackground: '#111827',
            tooltipFontColor: '#F9FAFB',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight
        };
        break;
	case 'TailwindDark':
        style = {
            gridLineColor: '#374151',
            axisLineColor: '#4B5563',
            labelFontColor: '#9CA3AF',
            unselectedRectColor: range.series.length ? 'transparent' : '#4B5563',
            thumpLineColor: '#6B7280',
            thumbBackground: '#1F2937',
            gripColor: '#D1D5DB',
            background: 'rgba(255, 255, 255, 0.6)',
            thumbHoverColor: '#E5E7EB',
            selectedRegionColor: range.series.length ? 'rgba(255, 255, 255, 0.6)' : '#22D3EE',
            tooltipBackground: '#F9FAFB',
            tooltipFontColor: '#1F2937',
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
