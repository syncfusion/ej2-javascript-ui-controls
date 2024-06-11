import { IFontMapping } from './interface';
import { AccumulationTheme } from '../../accumulation-chart/model/enum';
import { ChartTheme } from '../utils/enum';
import { IThemeStyle, IScrollbarThemeStyle, AccumulationChart, Chart, StockChart } from '../../index';
import { Rect } from '@syncfusion/ej2-svg-base';



/** @private */
export const stockEventFont: IFontMapping = {
    size: '13px',
    fontWeight: '400',
    color: null,
    fontStyle: 'Normal',
    fontFamily: 'Segoe UI'
};

/**
 * Gets an array of series colors for chart visualization.
 *
 * @param {ChartTheme | AccumulationTheme} theme - The theme for which to retrieve the series colors.
 * @returns {string[]} - An array of series colors.
 * @private
 */
export function getSeriesColor(theme: ChartTheme | AccumulationTheme): string[] {
    let palette: string[];
    switch (theme) {
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
        palette = ['#6355C7', '#FFB400', '#2196F5', '#F7523F', '#963C70',
            '#4BE0BC', '#FD7400', '#C9E422', '#DE3D8A', '#162F88'];
        break;
    case 'Bootstrap5Dark':
        palette = ['#8F80F4', '#FFD46D', '#6CBDFF', '#FF7F71', '#FF6DB3',
            '#63F5D2', '#FCAA65', '#ECFF77', '#EF8EFF', '#5F82FD'];
        break;
    case 'FluentDark':
        palette = ['#1AC9E6', '#DA4CB2', '#EDBB40', '#AF4BCF', '#FF7266',
            '#1BD565', '#EE993D', '#5887FF', '#EC548D', '#7D39C0'];
        break;
    case 'Fluent':
        palette = ['#1AC9E6', '#DA4CB2', '#EDBB40', '#AF4BCF', '#FF7266',
            '#1BD565', '#EE993D', '#5887FF', '#EC548D', '#7D39C0'];
        break;
    case 'Fluent2':
        palette = ['#6200EE', '#09AF74', '#0076E5', '#CB3587', '#E7910F',
            '#0364DE', '#66CD15', '#F3A93C', '#107C10', '#C19C00'];
        break;
    case 'Fluent2Dark':
        palette = ['#9BB449', '#2A72D5', '#43B786', '#3F579A', '#584EC6',
            '#E85F9C', '#6E7A89', '#EA6266', '#0B6A0B', '#C19C00'];
        break;
    case 'Material3':
        palette = ['#6355C7', '#00AEE0', '#FFB400', '#F7523F', '#963C70',
            '#FD7400', '#4BE0BC', '#2196F5', '#DE3D8A', '#162F88'];
        break;
    case 'Material3Dark':
        palette = ['#4EAAFF', '#FA4EAB', '#FFF500', '#17EA58', '#38FFE7',
            '#FF9E45', '#B3F32F', '#B93CE4', '#FC5664', '#9B55FF'];
        break;
    default:
        palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
            '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
        break;
    }
    return palette;
}
/**
 * Gets a theme color.
 *
 * @param {ChartTheme | AccumulationTheme} theme - The theme for which to retrieve the series colors.
 * @param {boolean} canvas - Specifies whether the canvas is used.
 * @param {AccumulationChart | Chart | StockChart} [chart] - The chart instance (optional).
 * @returns {IThemeStyle} - Returns theme style.
 * @private
 */
export function getThemeColor(theme: ChartTheme | AccumulationTheme, canvas: boolean,
                              chart?: AccumulationChart | Chart | StockChart): IThemeStyle {
    let style: IThemeStyle;
    const darkBackground: string = theme === 'MaterialDark' ? '#383838' : (theme === 'FabricDark' ? '#242424' : '#1b1b1b');
    switch (theme) {
    case 'HighContrastLight':
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
            tabColor: '#FFD939',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#FFD939',
            toolkitFill: '#737373',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#000000', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#000000', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            crosshairFill: theme === 'MaterialDark' ? '#F4F4F4' : theme === 'FabricDark' ? '#A19F9D' : '#F0F0F0',
            crosshairLabel: '#282727',
            tooltipFill: '#F4F4F4',
            tooltipBoldLabel: '#282727',
            tooltipLightLabel: '#333232',
            tooltipHeaderLine: '#9A9A9A',
            markerShadow: null,
            selectionRectFill: 'rgba(56,169,255, 0.1)',
            selectionRectStroke: '#38A9FF',
            selectionCircleStroke: '#282727',
            tabColor: theme === 'MaterialDark' ? '#00B0FF' : theme === 'FabricDark' ? '#0074CC' : '#0070F0',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: theme === 'MaterialDark' ? '#00B0FF' : theme === 'FabricDark' ? '#0074CC' : '#0070F0',
            toolkitFill: '#737373',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#CED4DA', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#676767', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'FabricDark' ? '#DADADA' : '#1A1A1A', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#676767', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'FabricDark' ? '#DADADA' : '#1A1A1A', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.24)' : theme === 'FabricDark' ? '#6F6C6C' : '#414141', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap4':
        style = {
            axisLabel: '#212529', axisTitle: '#212529', axisLine: '#CED4DA', majorGridLine: '#CED4DA',
            minorGridLine: '#DEE2E6', majorTickLine: '#ADB5BD', minorTickLine: '#CED4DA', chartTitle: '#212529', legendLabel: '#212529',
            background: canvas ? '#FFFFFF' : 'transparent', areaBorder: '#DEE2E6', errorBar: '#000000', crosshairLine: '#6C757D', crosshairFill: '#212529',
            crosshairLabel: '#FFFFFF', tooltipFill: '#020202', tooltipBoldLabel: 'rgba(255,255,255)',
            tooltipLightLabel: 'rgba(255,255,255, 0.9)', tooltipHeaderLine: 'rgba(255,255,255, 0.2)', markerShadow: null,
            selectionRectFill: 'rgba(255,255,255, 0.1)', selectionRectStroke: 'rgba(0, 123, 255)', selectionCircleStroke: '#495057', tabColor: '#007BFF',  bearFillColor: '#2ecd71', bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#007BFF',
            toolkitFill: '#495057',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(-5, -5, 26, 26),
            chartTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#666666', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#6C757D', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tabColor: '#4F46E5',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#4F46E5',
            toolkitFill: '#6B7280',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tabColor: '#22D3EE',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#22D3EE',
            toolkitFill: '#D1D5DB',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#1F2937', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#1F2937', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tabColor: '#0D6EFD',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#0D6EFD',
            toolkitFill: '#737373',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#343A40', fontFamily: 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#343A40', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#343A40', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#343A40', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#343A40', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#ADB5BD', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tabColor: '#0D6EFD',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#0D6EFD',
            toolkitFill: '#737373',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#E9ECEF', fontFamily: 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#CED4DA', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#E9ECEF', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#E9ECEF', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#E9ECEF', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#E9ECEF', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#E9ECEF', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#6C757D', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tabColor: '#0078D4',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#0078D4',
            toolkitFill: '#A19F9D',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#201F1E', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#201F1E', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#49454E', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#323130', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#201F1E', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#323129', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#323130', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#A19F9D', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            crosshairFill: '#323130',
            crosshairLabel: '#F3F2F1',
            tooltipFill: '#252423',
            tooltipBoldLabel: '#F3F2F1',
            tooltipLightLabel: '#F3F2F1',
            tooltipHeaderLine: '#3B3A39',
            markerShadow: null,
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
            tabColor: '#0078D4',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor: '#0078D4',
            toolkitFill: '#484644',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#F3F2F2', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#484644', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Fluent2':
        style = {
            axisLabel: '#616161',
            axisTitle: '#242424',
            axisLine: '#D2D0CE',
            majorGridLine: '#EDEBE9',
            minorGridLine: '#EDEBE9',
            majorTickLine: '#D2D0CE',
            minorTickLine: '#D2D0CE',
            chartTitle: '#242424',
            legendLabel: '#242424',
            background: canvas ? '#383838' : 'transparent',
            areaBorder: '#EDEBE9',
            errorBar: '#A19F9D',
            crosshairLine: '#A19F9D',
            crosshairFill: '#FFFFFF',
            crosshairLabel: '#242424',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#242424',
            tooltipLightLabel: '#242424',
            tooltipHeaderLine: '#D2D0CE',
            markerShadow: null,
            selectionRectFill: 'rgba(180, 214, 250, 0.1)',
            selectionRectStroke: '#0F6CBD',
            selectionCircleStroke: '#0F6CBD',
            tabColor: '#0078D4',
            bearFillColor: '#E7910F',
            bullFillColor : '#0076E5',
            toolkitSelectionColor: '#424242',
            toolkitFill: '#424242',
            toolkitIconRectOverFill: '#E6E6E6',
            toolkitIconRectSelectionFill: '#E6E6E6',
            toolkitIconRect: new Rect(-6, -8, 32, 32),
            chartTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: chart.getModuleName() === 'accumulationchart' ? '16px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: chart.getModuleName() === 'chart' ? '12px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            crosshairLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '700'
            },
            stripLineLabelFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Fluent2Dark':
        style = {
            axisLabel: '#ADADAD',
            axisTitle: '#FFFFFF',
            axisLine: '#3B3A39',
            majorGridLine: '#3B3A39',
            minorGridLine: '#3B3A39',
            majorTickLine: '#292827',
            minorTickLine: '#292827',
            chartTitle: '#FFFFFF',
            legendLabel: '#FFFFFF',
            background: canvas ? '#383838' : 'transparent',
            areaBorder: '#292827',
            errorBar: '#8A8886',
            crosshairLine: '#8A8886',
            crosshairFill: '#292929',
            crosshairLabel: '#FFFFFF',
            tooltipFill: '#292929',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            markerShadow: null,
            selectionRectFill: 'rgba(14, 71, 117, 0.1)',
            selectionRectStroke: '#115EA3',
            selectionCircleStroke: '#115EA3',
            tabColor: '#0078D4',
            bearFillColor: '#584EC6',
            bullFillColor : '#43B786',
            toolkitSelectionColor: '#D6D6D6',
            toolkitFill: '#D6D6D6',
            toolkitIconRectOverFill: '#333333',
            toolkitIconRectSelectionFill: '#333333',
            toolkitIconRect: new Rect(-6, -8, 32, 32),
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: chart.getModuleName() === 'accumulationchart' ? '16px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: chart.getModuleName() === 'chart' ? '12px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            crosshairLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '700'
            },
            stripLineLabelFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Material3':
        style = {
            axisLabel: '#1E192B',
            axisTitle: '#1C1B1F',
            axisLine: '#C4C7C5',
            majorGridLine: '#C4C7C5',
            minorGridLine: '#C4C7C5',
            majorTickLine: '#C4C7C5',
            minorTickLine: ' #C4C7C5',
            chartTitle: '#1C1B1F',
            legendLabel: '#49454E',
            background: canvas ? '#FFFFFF' : 'transparent',
            areaBorder: '#E7E0EC',
            errorBar: '#79747E',
            crosshairLine: '#49454E',
            crosshairFill: '#313033',
            crosshairLabel: '#F4EFF4',
            tooltipFill: '#313033',
            tooltipBoldLabel: '#F4EFF4',
            tooltipLightLabel: '#F4EFF4',
            tooltipHeaderLine: '#F4EFF4',
            markerShadow: null,
            selectionRectFill: 'rgb(98, 0, 238, 0.06)',
            selectionRectStroke: '#6200EE',
            selectionCircleStroke: '#79747E',
            tabColor: '#49454E',
            bearFillColor: '#5887FF',
            bullFillColor : '#F7523F',
            toolkitSelectionColor: '#49454E',
            toolkitFill: '#49454E',
            toolkitIconRectOverFill: '#EADDFF',
            toolkitIconRectSelectionFill: '#EADDFF',
            toolkitIconRect: new Rect(-4, -5, 26, 26),
            histogram: '#D21020',
            chartTitleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#1E192B', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F4EFF4', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#F4EFF4', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#79747E', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Material3Dark':
        style = {
            axisLabel: '#E6E1E5',
            axisTitle: '#E6E1E5',
            axisLine: '#49454F',
            majorGridLine: '#444746',
            minorGridLine: '#444746',
            majorTickLine: '#444746',
            minorTickLine: ' #444746',
            chartTitle: '#E6E1E5',
            legendLabel: '#CAC4D0',
            background: canvas ? '#FFFFFF' : 'transparent',
            areaBorder: '#49454F',
            errorBar: '#938F99',
            crosshairLine: '#CAC4D0',
            crosshairFill: '#E6E1E5',
            crosshairLabel: '#313033',
            tooltipFill: '#E6E1E5',
            tooltipBoldLabel: '#313033',
            tooltipLightLabel: '#313033',
            tooltipHeaderLine: '#313033',
            markerShadow: null,
            selectionRectFill: 'rgba(78, 170, 255, 0.06)',
            selectionRectStroke: '#4EAAFF',
            selectionCircleStroke: '#938F99',
            tabColor: '#CAC4D0',
            bearFillColor: '#B3F32F',
            bullFillColor : '#FF9E45',
            toolkitSelectionColor: '#CAC4D0',
            toolkitFill: '#CAC4D0',
            toolkitIconRectOverFill: '#4F378B',
            toolkitIconRectSelectionFill: '#4F378B',
            toolkitIconRect: new Rect(-4, -5, 26, 26),
            histogram: '#FF9E45',
            chartTitleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#313033', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: '#313033', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: '#938F99', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            crosshairFill: theme === 'Material' ? '#000816' : theme === 'Fabric' ? '#FFFFFF' : '#212529',
            crosshairLabel: '#e5e5e5',
            tooltipFill: '#000816',
            tooltipBoldLabel: '#ffffff',
            tooltipLightLabel: '#dbdbdb',
            tooltipHeaderLine: '#ffffff',
            markerShadow: null,
            selectionRectFill: 'rgba(41, 171, 226, 0.1)',
            selectionRectStroke: '#29abe2',
            selectionCircleStroke: '#29abe2',
            tabColor: theme === 'Material' ? '#ff4081' : theme === 'Fabric' ? '#0078D6' : '#317AB9',
            bearFillColor: '#2ecd71',
            bullFillColor : '#e74c3d',
            toolkitSelectionColor : theme === 'Material' ? '#ff4081' : theme === 'Fabric' ? '#0078D6' : '#317AB9',
            toolkitFill: '#737373',
            toolkitIconRectOverFill: 'transparent',
            toolkitIconRectSelectionFill: 'transparent',
            toolkitIconRect: new Rect(0, 0, 16, 16),
            chartTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Fabric' ? '#333333' : '#212529', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            axisLabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Fabric' ? '#666666' : '#676767', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Fabric' ? '#333333' : '#212529', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Fabric' ? '#666666' : '#666666', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Fabric' ? '#333333' : '#F9FAFB', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal'
            },
            axisTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Fabric' ? '#333333' : '#212529', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            datalabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Fabric' ? '#666666' : '#676767', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Fabric' ? '#333333' : '#212529', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            crosshairLabelFont: {
                color: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Fabric' ? '#333333' : '#F9FAFB', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            stripLineLabelFont: {
                color: theme === 'Material' ? 'rgba(158, 158, 158, 1)' : theme === 'Fabric' ? '#A6A6A6' : '#676767', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    }
    return style;
}

/**
 * Gets an scroll bar theme color.
 *
 * @param {ChartTheme} theme - The theme for which to retrieve the series colors.
 * @returns {IScrollbarThemeStyle} - Returns scroll bar theme style.
 * @private
 */
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
    case 'Fluent2':
        scrollStyle = {
            backRect: '#F5F5F5',
            thumb: '#F0F0F0',
            circle: '#FAFAFA',
            circleHover: '#FAFAFA',
            arrow: '#424242',
            grip: '#424242'
        };
        break;
    case 'Fluent2Dark':
        scrollStyle = {
            thumb: '#0A0A0A',
            backRect: '#141414',
            circle: '#1F1F1F',
            circleHover: '#1F1F1F',
            arrow: '#D6D6D6',
            grip: '#D6D6D6'
        };
        break;
    case 'Material3':
        scrollStyle = {
            backRect: 'rgba(103, 80, 164, 0.05)',
            thumb: ' rgba(103, 80, 164, 0.14)',
            circle: '#FFFFFF',
            circleHover: '#E1DFDD',
            arrow: '#49454E',
            grip: '#49454E'
        };
        break;
    case 'Material3Dark':
        scrollStyle = {
            backRect: 'rgba(208, 188, 255, 0.05)',
            thumb: 'rgba(208, 188, 255, 0.14)',
            circle: '#FFFFFF',
            circleHover: '#E1DFDD',
            arrow: '#CAC4D0',
            grip: '#CAC4D0'
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

