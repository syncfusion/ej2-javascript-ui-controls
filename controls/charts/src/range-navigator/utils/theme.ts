/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/no-namespace */
import { ChartTheme, IFontMapping } from '../../index';
import { IRangeStyle } from '../model/range-navigator-interface';
import { RangeNavigator, ThumbSettingsModel } from '../index';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

/** @private */
// tslint:disable-next-line:max-func-body-length
export function getRangeThemeColor(theme: ChartTheme, range: RangeNavigator): IRangeStyle {
    const thumbSize: ThumbSettingsModel = range.navigatorStyleSettings.thumb;
    const thumbWidth: number = isNullOrUndefined(thumbSize.width) ? (Browser.isDevice ? 15 : 20) : thumbSize.width;
    const thumbHeight: number = isNullOrUndefined(thumbSize.height) ? (Browser.isDevice ? 15 : 20) : thumbSize.height;
    const darkAxisColor: string = (theme === 'HighContrast') ? '#969696' : '#6F6C6C';
    const darkGridlineColor: string = (theme === 'HighContrast') ? '#4A4848' : '#414040';
    const darkBackground: string = theme === 'MaterialDark' ? '#383838' : (theme === 'FabricDark' ? '#242424' : '#1b1b1b');
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
        tooltipBackground: theme === 'Material' ? '#000816' : theme === 'Fabric' ? '#FFFFFF' : '#212529',
        tooltipFontColor: '#dbdbdb',
        thumbWidth: thumbWidth,
        thumbHeight: thumbHeight,
        axisLabelFont: {
            color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Fabric' ? '#666666' : '#676767', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica'
        },
        tooltipLabelFont: {
            color: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Fabric' ? '#333333' : '#F9FAFB', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica'
        }
    };
    switch (theme) {
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
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI'
            },
            tooltipLabelFont: {
                color: '#000000', fontFamily: 'Segoe UI'
            }
        };
        break;
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
            tooltipBackground: '#FFFFFF',
            tooltipFontColor: '#282727',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI'
            },
            tooltipLabelFont: {
                color: '#000000', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            labelFontColor: '#DADADA',
            axisLineColor: ' #6F6C6C',
            gridLineColor: '#414040',
            tooltipBackground: theme === 'FabricDark' ? '#A19F9D' : theme === 'BootstrapDark' ? '#F0F0F0' : '#F4F4F4',
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
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#CED4DA', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica'
            },
            tooltipLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'FabricDark' ? '#DADADA' : '#1A1A1A', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica'
            }
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
            tooltipBackground: '#212529',
            tooltipFontColor: 'rgba(255, 255, 255)',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#495057', fontFamily: 'Helvetica'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica'
            }
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
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#6B7280', fontFamily: 'Inter'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter'
            }
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
            background: '#1f2937',
            thumbHoverColor: '#E5E7EB',
            selectedRegionColor: range.series.length ? 'rgba(255, 255, 255, 0.6)' : '#22D3EE',
            tooltipBackground: '#E9ECEF',
            tooltipFontColor: '#1F2937',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter'
            },
            tooltipLabelFont: {
                color: '#1F2937', fontFamily: 'Inter'
            }
        };
        break;
    case 'Bootstrap5':
        style = {
            gridLineColor: '#E5E7EB',
            axisLineColor: '#E5E7EB',
            labelFontColor: '#495057',
            unselectedRectColor: range.series.length ? 'transparent' : '#E5E7EB',
            thumpLineColor: '#0D6EFD',
            thumbBackground: '#FFFFFF',
            gripColor: '#0D6EFD',
            background: 'rgba(255, 255, 255, 0.0)',
            thumbHoverColor: '#EEEEEE',
            selectedRegionColor: range.series.length ? 'rgba(13, 110, 253, 0.1)' : '#4F46E5',
            tooltipBackground: '#212529',
            tooltipFontColor: '#F9FAFB',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#495057', fontFamily: 'Helvetica'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica'
            }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            gridLineColor: '#343A40',
            axisLineColor: '#343A40',
            labelFontColor: '#CED4DA',
            unselectedRectColor: range.series.length ? 'transparent' : '#E5E7EB',
            thumpLineColor: '#6C757D',
            thumbBackground: '#374151',
            gripColor: '#ADB5BD',
            background: '#212529',
            thumbHoverColor: '#666666',
            selectedRegionColor: range.series.length ? 'rgba(173, 181, 189, 0.1)' : '#ADB5BD',
            tooltipBackground: '#E9ECEF',
            tooltipFontColor: '#212529',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#CED4DA', fontFamily: 'Helvetica'
            },
            tooltipLabelFont: {
                color: '#212529', fontFamily: 'Helvetica'
            }
        };
        break;
    case 'Fluent':
        style = {
            gridLineColor: '#EDEBE9',
            axisLineColor: '#D2D0CE',
            labelFontColor: '#3B3A39',
            unselectedRectColor: range.series.length ? 'transparent' : '#A19F9D',
            thumpLineColor: '#0078D4',
            thumbBackground: '#FFFFFF',
            gripColor: '#0078D4',
            background: 'transparent',
            thumbHoverColor: '#FFFFFF',
            selectedRegionColor: range.series.length ? 'rgba(0, 120, 212, 0.1)' : '#ADB5BD',
            tooltipBackground: '#FFFFFF',
            tooltipFontColor: '#323130',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI'
            },
            tooltipLabelFont: {
                color: '#323130', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'FluentDark':
        style = {
            gridLineColor: '#414040',
            axisLineColor: '#3B3A39',
            labelFontColor: '#C8C6C4',
            unselectedRectColor: range.series.length ? 'transparent' : '#A19F9D',
            thumpLineColor: '#797775',
            thumbBackground: 'black',
            gripColor: '#797775',
            background: 'transparent',
            thumbHoverColor: 'black',
            selectedRegionColor: range.series.length ? 'rgba(121, 119, 117, 0.1)' : '#797775',
            tooltipBackground: '#323130',
            tooltipFontColor: '#F3F2F1',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI'
            },
            tooltipLabelFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI'
            }
        };
        break;
        case 'Material3':
            style = {
            gridLineColor: '#C4C7C5',
            axisLineColor: '#C4C7C5',
            labelFontColor: '#1E192B',
            unselectedRectColor: range.series.length ? 'transparent' : '#E5E5E5',
            thumpLineColor: '#49454E',
            thumbBackground: '#FFFFFF',
            gripColor: '#49454E',
            background: 'transparent',
            thumbHoverColor: '#FFFFFF',
            selectedRegionColor: range.series.length ? 'rgba(73, 69, 78, 0.1)' : '#49454E',
            tooltipBackground: '#313033',
            tooltipFontColor: '#F4EFF4',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#1E192B', fontFamily: 'Roboto'
            },
            tooltipLabelFont: {
                color: '#F4EFF4', fontFamily: 'Roboto'
            }
            };
            break;
    case 'Material3Dark':
        style = {
            gridLineColor: '#444746',
            axisLineColor: '#444746',
            labelFontColor: '#E6E1E5',
            unselectedRectColor: range.series.length ? 'transparent' : '#E5E5E5',
            thumpLineColor: '#CAC4D0',
            thumbBackground: '#1C1B1F',
            gripColor: '#CAC4D0',
            background: 'transparent',
            thumbHoverColor: '#FFFFFF',
            selectedRegionColor: range.series.length ? 'rgba(202, 196, 208, 0.1)' : '#49454E',
            tooltipBackground: '#E6E1E5',
            tooltipFontColor: '#313033',
            thumbWidth: thumbWidth,
            thumbHeight: thumbHeight,
            axisLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto'
            },
            tooltipLabelFont: {
                color: '#F4EFF4', fontFamily: 'Roboto'
            }
        };
        break;
    default:
        style.selectedRegionColor = range.series.length ? 'transparent' : '#FF4081';
        break;
    }
    return style;
}
