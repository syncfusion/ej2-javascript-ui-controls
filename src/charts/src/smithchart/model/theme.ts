import { ISmithchartThemeStyle } from '../model/interface';
import { SmithchartTheme } from '../utils/enum';

/**
 * @param {SmithchartTheme} theme theme of the smith chart
 * @private
 * @returns {string[]} series colors
 */
export function getSeriesColor(theme: SmithchartTheme): string[] {
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
    case 'Bootstrap5Dark':
    case 'Bootstrap5':
        palette = ['#FD7E14', '#6610F2', '#6F42C1', '#D63384', '#DC3545', '#FFC107', '#198754', '#0DCAF0'];
        break;
    case 'Fluent':
        palette = ['#1AC9E6', '#DA4CB2', '#EDBB40', '#AF4BCF', '#FF7266',
            '#1BD565', '#EE993D', '#5887FF', '#EC548D', '#7D39C0'];
        break;
    case 'FluentDark':
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
    case 'Fluent2HighContrast':
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
 * @param {SmithchartTheme} theme smithchart theme
 * @private
 * @returns {ISmithchartThemeStyle} theme style of the smith chart
 */
export function getThemeColor(theme: SmithchartTheme): ISmithchartThemeStyle {
    let style: ISmithchartThemeStyle;
    const darkBackground: string = theme === 'MaterialDark' ? '#383838' : (theme === 'FabricDark' ? '#242424' : '#1b1b1b');
    switch (theme) {
    case 'HighContrast':
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
            tooltipFontSize: '12px',
            tabColor: '#FFD939',
            smithchartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#FFFFFF', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'MaterialDark':
    case 'BootstrapDark':
    case 'FabricDark':
        style = {
            axisLabel: '#DADADA',
            axisLine: ' #6F6C6C',
            majorGridLine: '#414040',
            minorGridLine: '#514F4F',
            chartTitle: '#ffffff',
            legendLabel: '#DADADA',
            background: darkBackground,
            areaBorder: ' #9A9A9A',
            tooltipFill: theme === 'MaterialDark' ? '#F4F4F4' : theme === 'BootstrapDark' ? '#F0F0F0' : '#A19F9D',
            dataLabel: '#DADADA',
            tooltipBoldLabel: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'BootstrapDark' ? '#1A1A1A' : '#DADADA',
            tooltipLightLabel: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'BootstrapDark' ? '#1A1A1A' : '#DADADA',
            tooltipHeaderLine: '#9A9A9A',
            tooltipFontSize: '12px',
            tabColor: theme === 'MaterialDark' ? '#00B0FF' : theme === 'FabricDark' ? '#0074CC' : '#0070F0',
            smithchartTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'BootstrapDark' ? '#FFFFFF' : '#DADADA', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'BootstrapDark' ? 'Helvetica' : 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'BootstrapDark' ? '#676767' : '#A19F9D', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'BootstrapDark' ? 'Helvetica' : 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'BootstrapDark' ? '#FFFFFF' : '#DADADA', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'BootstrapDark' ? 'Helvetica' : 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'BootstrapDark' ? '#676767' : '#A19F9D', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'BootstrapDark' ? 'Helvetica' : 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'BootstrapDark' ? '#CED4DA' : '#A19F9D', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'BootstrapDark' ? 'Helvetica' : 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'BootstrapDark' ? '#FFFFFF' : '#DADADA', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'BootstrapDark' ? 'Helvetica' : 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap4':
        style = {
            axisLabel: '#212529',
            axisLine: '#ADB5BD',
            majorGridLine: '#CED4DA',
            minorGridLine: '#DEE2E6',
            chartTitle: '#212529',
            legendLabel: '#212529',
            background: '#FFFFFF',
            areaBorder: '#DEE2E6',
            tooltipFill: '#212529',
            dataLabel: '#212529',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#FFFFFF',
            tooltipFontSize: '12px',
            tabColor: '#007BFF',
            fontFamily: 'Helvetica',
            fontSize: '16px',
            labelFontFamily: 'Helvetica',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 0.9,
            smithchartTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#666666', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#212529', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Tailwind':
        style = {
            axisLabel: '#6B7280',
            axisLine: '#D1D5DB',
            majorGridLine: '#E5E7EB',
            minorGridLine: '#D1D5DB',
            chartTitle: '#374151',
            legendLabel: '#374151',
            background: '#FFFFFF',
            areaBorder: '#D1D5DB6',
            tooltipFill: '#111827',
            dataLabel: '#F9FAFB',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#9CA3AF',
            tooltipFontSize: '12px',
            tabColor: '#4F46E5',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#374151', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'TailwindDark':
        style = {
            axisLabel: '#9CA3AF',
            axisLine: '#4B5563',
            majorGridLine: '#374151',
            minorGridLine: '#4B5563',
            chartTitle: '#D1D5DB',
            legendLabel: '#D1D5DB',
            background: '#1f2937',
            areaBorder: '#4B5563',
            tooltipFill: '#E9ECEF',
            dataLabel: '#D1D5DB',
            tooltipBoldLabel: '#1F2937',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#9CA3AF',
            tooltipFontSize: '12px',
            tabColor: '#22D3EE',
            fontFamily: 'Inter',
            fontSize: '14px',
            labelFontFamily: 'inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#D1D5DB', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap5':
        style = {
            axisLabel: '#21252980',
            axisLine: '#DEE2E6',
            majorGridLine: '#DEE2E6',
            minorGridLine: '#DEE2E6',
            chartTitle: '#212529',
            legendLabel: '#212529BF',
            background: '#FFFFFF',
            areaBorder: '#E9ECEF',
            tooltipFill: '#000000E5',
            dataLabel: '#212529',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#FFFFFF',
            tooltipFontSize: '12px',
            tabColor: '#0D6EFD',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#212529BF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#21252980', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            axisLabel: '#DEE2E680',
            axisLine: '#495057',
            majorGridLine: '#495057',
            minorGridLine: '#495057',
            chartTitle: '#DEE2E6',
            legendLabel: '#DEE2E6BF',
            background: '#212529',
            areaBorder: '#343A40',
            tooltipFill: '#FFFFFFE5',
            dataLabel: '#DEE2E6',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#212529',
            tooltipFontSize: '12px',
            tabColor: '#0D6EFD',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#DEE2E6BF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#E9ECEF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#DEE2E680', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent':
        style = {
            axisLabel: '#3B3A39',
            axisLine: '#D2D0CE',
            majorGridLine: '#D2D0CE',
            minorGridLine: '#EDEBE9',
            chartTitle: '#201F1E',
            legendLabel: '#323130',
            background: '#FFFFFF',
            areaBorder: ' #D2D0CE',
            tooltipFill: '#FFFFFF',
            dataLabel: '#3B3A39',
            tooltipBoldLabel: '#323130',
            tooltipLightLabel: '#323130',
            tooltipHeaderLine: '#D2D0CE',
            tooltipFontSize: '12px',
            tabColor: '#0078D4',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#201F1E', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#49454E', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#201F1E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#323129', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'FluentDark':
        style = {
            axisLabel: '#C8C6C4',
            axisLine: '#3B3A39',
            majorGridLine: '#414040',
            minorGridLine: '#414040',
            chartTitle: '#F3F2F1',
            legendLabel: '#D2D0CE',
            background: 'transparent',
            areaBorder: '#414040',
            tooltipFill: '#323130',
            dataLabel: '#C8C6C4',
            tooltipBoldLabel: '#F3F2F1',
            tooltipLightLabel: '#F3F2F2',
            tooltipHeaderLine: '#3B3A39',
            tooltipFontSize: '12px',
            tabColor: '#0078D4',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#F3F2F1', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Fluent2':
        style = {
            axisLabel: '#616161',
            axisLine: '#D2D0CE',
            majorGridLine: '#EDEBE9',
            minorGridLine: '#FAFAFA',
            chartTitle: '#242424',
            legendLabel: '#424242',
            background: '#FFFFFF',
            areaBorder: '#EDEBE9',
            tooltipFill: '#FFFFFF',
            dataLabel: '#242424',
            tooltipBoldLabel: '#242424',
            tooltipLightLabel: '#242424',
            tooltipHeaderLine: '#D2D0CE',
            tooltipFontSize: '12px',
            tabColor: '#0078D4',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#424242', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent2Dark':
        style = {
            axisLabel: '#ADADAD',
            axisLine: '#3B3A39',
            majorGridLine: '#292827',
            minorGridLine: '#3B3A39',
            chartTitle: '#FFFFFF',
            legendLabel: '#D6D6D6',
            background: '#292929',
            areaBorder: '#292827',
            tooltipFill: '#292929',
            dataLabel: '#FFFFFF',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            tooltipFontSize: '12px',
            tabColor: '#0078D4',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#D6D6D6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent2HighContrast':
        style = {
            axisLabel: '#FFFFFF',
            axisLine: '#3B3A39',
            majorGridLine: '#3B3A39',
            minorGridLine: '#3B3A39',
            chartTitle: '#FFFFFF',
            legendLabel: '#FFFFFF',
            background: '#1c1b1f',
            areaBorder: '#292827',
            tooltipFill: '#000000',
            dataLabel: '#FFFFFF',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            tooltipFontSize: '12px',
            tabColor: '#0078D4',
            fontFamily: 'Segoe UI',
            fontSize: '14px',
            labelFontFamily: 'Segoe UI',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Material3':
        style = {
            axisLine: '#C4C7C5',
            axisLabel: '#1C1B1F',
            majorGridLine: '#C4C7C5',
            minorGridLine: '#C4C7C5',
            legendLabel: '#1C1B1F',
            background: '#FFFFFF',
            chartTitle: '#1C1B1F',
            areaBorder: ' #E7E0EC',
            dataLabel: '#49454E',
            tooltipFill: '#313033',
            tooltipBoldLabel: '#F4EFF4',
            tooltipLightLabel: '#F4EFF4',
            tooltipHeaderLine: '#F4EFF4',
            tooltipFontFamily: 'Inter',
            tooltipFontSize: '12px',
            tabColor: '#49454E',
            fontFamily: 'Inter',
            fontSize: '16px',
            labelFontFamily: 'Inter',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#1E192B', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Material3Dark':
        style = {
            axisLabel: '#E6E1E5',
            axisLine: '#444746',
            majorGridLine: '#444746',
            minorGridLine: '#444746',
            chartTitle: '#E6E1E5',
            legendLabel: '#E6E1E5',
            background: 'transparent',
            areaBorder: ' #49454F',
            tooltipFill: '#E6E1E5',
            dataLabel: '#CAC4D0',
            tooltipBoldLabel: '#313033',
            tooltipLightLabel: '#313033',
            tooltipHeaderLine: '#313033',
            tooltipFontFamily: 'Roboto',
            tooltipFontSize: '12px',
            tabColor: '#CAC4D0',
            fontFamily: 'Roboto',
            fontSize: '16px',
            labelFontFamily: 'Roboto',
            tooltipFillOpacity: 1,
            tooltipTextOpacity: 1,
            smithchartTitleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tooltipFill: theme === 'Material' ? '#000816' : theme === 'Bootstrap' ? '#212529' : '#FFFFFF',
            dataLabel: '#424242',
            tooltipBoldLabel: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Bootstrap' ? '#F9FAFB' : '#333333',
            tooltipLightLabel: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Bootstrap' ? '#F9FAFB' : '#333333',
            tooltipHeaderLine: theme === 'Fabric' ? '#D2D0CE' : '#ffffff',
            tooltipFontSize: '12px',
            tabColor: theme === 'Material' ? '#ff4081' : theme === 'Fabric' ? '#0078D6' : '#317AB9',
            fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI',
            smithchartTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Bootstrap' ? '#212529' : '#333333', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Bootstrap' ? '#666666' : '#666666', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Bootstrap' ? '#212529' : '#F3F2F1', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            dataLabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Bootstrap' ? '#676767' : '#666666', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Bootstrap' ? '#676767' : '#666666', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            smithchartSubtitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Bootstrap' ? '#212529' : '#333333', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Bootstrap' ? 'Helvetica' : 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    }
    return style;
}
