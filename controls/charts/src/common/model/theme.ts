/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { IFontMapping } from './interface';
import { AccumulationTheme } from '../../accumulation-chart/model/enum';
import { ChartTheme } from '../../chart/utils/enum';
import { IThemeStyle, IScrollbarThemeStyle } from '../../index';

/**
 * Specifies Chart Themes
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Theme {
    /** @private */
    export const axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const axisTitleFont: IFontMapping = {
        size: '14px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const chartTitleFont: IFontMapping = {
        size: '15px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const chartSubTitleFont: IFontMapping = {
        size: '11px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const crosshairLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const legendTitleFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const stripLineLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#353535',
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const stockEventFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };

}
/** @private */
export function getSeriesColor(theme: ChartTheme | AccumulationTheme): string[] {
    let palette: string[];
    switch (theme as string) {
    case 'Fabric':
        palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
            '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
        break;
    case 'Bootstrap4':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
    case 'Bootstrap':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
    case 'HighContrastLight':
    case 'Highcontrast':
    case 'HighContrast':
        palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
            '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
        break;
    case 'MaterialDark':
        palette = ['#9ECB08', '#56AEFF', '#C57AFF', '#61EAA9', '#EBBB3E',
            '#F45C5C', '#8A77FF', '#63C7FF', '#FF84B0', '#F7C928'];
        break;
    case 'FabricDark':
        palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
            '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
        break;
    case 'BootstrapDark':
        palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        break;
    case 'Tailwind':
        palette = ['#5A61F6', '#65A30D', '#334155', '#14B8A6', '#8B5CF6',
                '#0369A1', '#F97316', '#9333EA', '#F59E0B', '#15803D'];
        break;
    case 'TailwindDark':
        palette = ['#8B5CF6', '#22D3EE', '#F87171', '#4ADE80', '#E879F9',
                    '#FCD34D', '#F97316', '#2DD4BF', '#F472B6', '#10B981'];
        break;
    case 'Bootstrap5':
        palette = ['#262E0B', '#668E1F', '#AF6E10', '#862C0B', '#1F2D50',
                    '#64680B', '#311508', '#4C4C81', '#0C7DA0', '#862C0B'];
        break;
    case 'Bootstrap5Dark':
        palette = ['#5ECB9B', '#A860F1', '#EBA844', '#557EF7', '#E9599B',
                    '#BFC529', '#3BC6CF', '#7A68EC', '#74B706', '#EA6266'];
        break;
    case 'FluentDark':
        palette = ['#8AB113', '#2A72D5', '#43B786', '#584EC6', '#E85F9C',
                    '#6E7A89', '#EA6266', '#EBA844', '#26BC7A', '#BC4870'];
        break;
    case 'Fluent':
        palette = ['#614570', '#4C6FB1', '#CC6952', '#3F579A', '#4EA09B',
                    '#6E7A89', '#D4515C', '#E6AF5D', '#639751', '#9D4D69'];
        break;
    default:
        palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
            '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
        break;
    }
    return palette;
}
/** @private */
// tslint:disable-next-line:max-func-body-length
export function getThemeColor(theme: ChartTheme | AccumulationTheme, canvas: boolean): IThemeStyle {
    let style: IThemeStyle;
    const darkBackground: string = theme === 'MaterialDark' ? '#383838' : (theme === 'FabricDark' ? '#242424' : '#1b1b1b');
    switch (theme as string) {
    case 'HighContrastLight':
    case 'Highcontrast':
    case 'HighContrast':
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
            background: canvas ? '#000000' : 'transparent',
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
            selectionCircleStroke: '#FFD939',
            tabColor: '#969696'
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            axisLabel: '#DADADA', axisTitle: '#ffffff',
            axisLine: ' #6F6C6C',
            majorGridLine: '#414040',
            minorGridLine: '#514F4F',
            majorTickLine: '#414040',
            minorTickLine: ' #4A4848',
            chartTitle: '#ffffff',
            legendLabel: '#DADADA',
            background: canvas ? darkBackground : 'transparent',
            areaBorder: ' #9A9A9A',
            errorBar: '#ffffff',
            crosshairLine: '#F4F4F4',
            crosshairFill: '#F4F4F4',
            crosshairLabel: '#282727',
            tooltipFill: '#F4F4F4',
            tooltipBoldLabel: '#282727',
            tooltipLightLabel: '#333232',
            tooltipHeaderLine: '#9A9A9A',
            markerShadow: null,
            selectionRectFill: 'rgba(56,169,255, 0.1)',
            selectionRectStroke: '#38A9FF',
            selectionCircleStroke: '#282727',
            tabColor: 'rgb(102, 175, 233)'
        };
        break;
    case 'Bootstrap4':
        style = {
            axisLabel: '#212529', axisTitle: '#212529', axisLine: '#CED4DA', majorGridLine: '#CED4DA',
            minorGridLine: '#DEE2E6', majorTickLine: '#ADB5BD', minorTickLine: '#CED4DA', chartTitle: '#212529', legendLabel: '#212529',
            background: canvas ? '#FFFFFF' : 'transparent', areaBorder: '#DEE2E6', errorBar: '#000000', crosshairLine: '#6C757D', crosshairFill: '#495057',
            crosshairLabel: '#FFFFFF', tooltipFill: '#020202', tooltipBoldLabel: 'rgba(255,255,255)',
            tooltipLightLabel: 'rgba(255,255,255, 0.9)', tooltipHeaderLine: 'rgba(255,255,255, 0.2)', markerShadow: null,
            selectionRectFill: 'rgba(255,255,255, 0.1)', selectionRectStroke: 'rgba(0, 123, 255)', selectionCircleStroke: '#495057', tabColor: 'rgb(102, 175, 233)'
        };
        break;
    case 'Tailwind':
    style = {
        axisLabel: '#6B728', axisTitle: '#374151',
        axisLine: ' #D1D5DB',
        majorGridLine: '#E5E7EB',
        minorGridLine: '#E5E7EB',
        majorTickLine: '#D1D5DB',
        minorTickLine: ' #D1D5DB',
        chartTitle: '#374151',
        legendLabel: '#374151',
        background: canvas ? 'rgba(255,255,255, 0.0)' : 'transparent',
        areaBorder: ' #E5E7EB',
        errorBar: '#374151',
        crosshairLine: '#1F2937',
        crosshairFill: '#111827',
        crosshairLabel: '#F9FAFB',
        tooltipFill: '#111827',
        tooltipBoldLabel: '#D1D5DB',
        tooltipLightLabel: '#F9FAFB',
        tooltipHeaderLine: '#6B7280',
        markerShadow: null,
        selectionRectFill: 'rgba(79,70,229, 0.1)',
        selectionRectStroke: '#4F46E5',
        selectionCircleStroke: '#6B7280',
        tabColor: 'rgb(79, 70, 229)'
    };
    break;
case 'TailwindDark':
    style = {
        axisLabel: '#9CA3AF', axisTitle: '#9CA3AF',
        axisLine: ' #4B5563',
        majorGridLine: '#374151',
        minorGridLine: '#374151',
        majorTickLine: '#4B5563',
        minorTickLine: ' #4B5563',
        chartTitle: '#D1D5DB',
        legendLabel: '#D1D5DB',
        background: canvas ? '#1f2937' : 'transparent',
        areaBorder: ' #374151',
        errorBar: '#ffffff',
        crosshairLine: '#9CA3AF',
        crosshairFill: '#F9FAFB',
        crosshairLabel: '#1F2937',
        tooltipFill: '#F9FAFB',
        tooltipBoldLabel: '#6B7280',
        tooltipLightLabel: '#1F2937',
        tooltipHeaderLine: '#9CA3AF',
        markerShadow: null,
        selectionRectFill: 'rgba(34,211,238, 0.1)',
        selectionRectStroke: '#22D3EE',
        selectionCircleStroke: '#282727',
        tabColor: 'rgb(34, 211, 238)'
    };
    break;
    case 'Bootstrap5':
        style = {
            axisLabel: '#495057',
            axisTitle: '#343A40',
            axisLine: '#D1D5DB',
            majorGridLine: '#E5E7EB',
            minorGridLine: '#E5E7EB',
            majorTickLine: '#D1D5DB',
            minorTickLine: ' #D1D5DB',
            chartTitle: '#343A40',
            legendLabel: '#343A40',
            background: canvas ? '#FFFFFF' : 'transparent',
            areaBorder: ' #DEE2E6',
            errorBar: '#1F2937',
            crosshairLine: '#1F2937',
            crosshairFill: '#212529',
            crosshairLabel: '#F9FAFB',
            tooltipFill: '#212529',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#9CA3AF',
            markerShadow: null,
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
            tabColor: '#0d6efd'
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            axisLabel: '#CED4DA',
            axisTitle: '#E9ECEF',
            axisLine: '#495057',
            majorGridLine: '#343A40',
            minorGridLine: '#343A40',
            majorTickLine: '#495057',
            minorTickLine: ' #495057',
            chartTitle: '#E9ECEF',
            legendLabel: '#E9ECEF',
            background: canvas ? '#212529' : 'transparent',
            areaBorder: ' #444C54',
            errorBar: '#ADB5BD',
            crosshairLine: '#ADB5BD',
            crosshairFill: '#E9ECEF',
            crosshairLabel: '#212529',
            tooltipFill: '#E9ECEF',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#ADB5BD',
            markerShadow: null,
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
            tabColor: 'rgb(13, 110, 253)'
        };
        break;
    case 'Fluent':
        style = {
            axisLabel: '#3B3A39',
            axisTitle: '#201F1E',
            axisLine: '#D2D0CE',
            majorGridLine: '#EDEBE9',
            minorGridLine: '#EDEBE9',
            majorTickLine: '#D2D0CE',
            minorTickLine: ' #D2D0CE',
            chartTitle: '#201F1E',
            legendLabel: '#323130',
            background: canvas ? '#FFFFFF' : 'transparent',
            areaBorder: '#EDEBE9',
            errorBar: '#A19F9D',
            crosshairLine: '#A19F9D',
            crosshairFill: '#FFFFFF',
            crosshairLabel: '#323130',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#323130',
            tooltipLightLabel: '#323130',
            tooltipHeaderLine: '#D2D0CE',
            markerShadow: null,
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
            tabColor: '#0078d4'
        };
        break;
    case 'FluentDark':
        style = {
            axisLabel: '#C8C6C4',
            axisTitle: '#F3F2F1',
            axisLine: '#3B3A39',
            majorGridLine: '#414040',
            minorGridLine: '#414040',
            majorTickLine: '#3B3A39',
            minorTickLine: '#3B3A39',
            chartTitle: '#F3F2F1',
            legendLabel: '#D2D0CE',
            background: canvas ? '#383838' : 'transparent',
            areaBorder: '#414040',
            errorBar: '#D2D0CE',
            crosshairLine: '#D2D0CE',
            crosshairFill: '#252423',
            crosshairLabel: '#F3F2F1',
            tooltipFill: '#252423',
            tooltipBoldLabel: '#F3F2F1',
            tooltipLightLabel: '#F3F2F1',
            tooltipHeaderLine: '#3B3A39',
            markerShadow: null,
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
            tabColor: '#0078d4'
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
            background: canvas ? '#FFFFFF' : 'transparent',
            areaBorder: 'Gray',
            errorBar: '#000000',
            crosshairLine: '#4f4f4f',
            crosshairFill: '#4f4f4f',
            crosshairLabel: '#e5e5e5',
            tooltipFill: '#000816',
            tooltipBoldLabel: '#ffffff',
            tooltipLightLabel: '#dbdbdb',
            tooltipHeaderLine: '#ffffff',
            markerShadow: null,
            selectionRectFill: 'rgba(41, 171, 226, 0.1)',
            selectionRectStroke: '#29abe2',
            selectionCircleStroke: '#29abe2',
            tabColor: 'rgb(158, 158, 158)'
        };
        break;
    }
    return style;
}

/** @private */
export function getScrollbarThemeColor(theme: ChartTheme): IScrollbarThemeStyle {
    let scrollStyle: IScrollbarThemeStyle;
    switch (theme) {
    case 'HighContrastLight':
        scrollStyle = {
            backRect: '#333',
            thumb: '#bfbfbf',
            circle: '#fff',
            circleHover: '#685708',
            arrow: '#333',
            grip: '#333',
            arrowHover: '#fff',
            backRectBorder: '#969696'
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
    case 'MaterialDark':
        scrollStyle = {
            backRect: '#424242',
            thumb: '#616161',
            circle: '#757575',
            circleHover: '#616161',
            arrow: '#BDBDBD',
            grip: '#BDBDBD'
        };
        break;
    case 'FabricDark':
        scrollStyle = {
            backRect: '#282727',
            thumb: '#333232',
            circle: '#4A4848',
            circleHover: '#514F4F',
            arrow: '#ADB5BD',
            grip: '#DADADA'
        };
        break;
    case 'BootstrapDark':
        scrollStyle = {
            backRect: '#2A2A2A',
            thumb: '#313131',
            circle: '#414141',
            circleHover: '#484848',
            arrow: '#DADADA',
            grip: '#FFFFFF'
        };
        break;
    case 'Bootstrap5Dark':
        scrollStyle = {
            backRect: '#282D31',
            thumb: '#3B4248',
            circle: '#495057',
            circleHover: '#6C757D',
            arrow: '#A19F9D',
            grip: '#ADB5BD'
        };
        break;
    case 'HighContrast': 
        scrollStyle = {
            backRect: '#757575',
            thumb: '#BFBFBF',
            circle: '#FFFFFF',
            circleHover: '#FFFFFF',
            arrow: '#ADB5BD',
            grip: '#969696'
        };
        break;   
    case 'TailwindDark':
        scrollStyle = {
            backRect: '#6B7280',
            thumb: '#374151',
            circle: '#4B5563',
            circleHover: '#4B5563',
            arrow: '#ADB5BD',
            grip: '#D1D5DB'
        };
        break;
    case 'Fluent':
        scrollStyle = {
            backRect: '#F3F2F1',
            thumb: '#E1DFDD',
            circle: '#FFFFFF',
            circleHover: '#E1DFDD',
            arrow: '#605E5C',
            grip: '#605E5C'
        };
        break;
    case 'FluentDark':
        scrollStyle = {
            backRect: '#252423',
            thumb: '#323130',
            circle: '#3B3A39',
            circleHover: '#3B3A39',
            arrow: '#ADB5BD',
            grip: '#A19F9D'
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
