/**
 * Circular 3D chart theme file.
 */
import { CircularChart3DTheme } from './enum';
import { CircularChart3DThemeStyle } from './circular3d-base';

/**
 * Gets an array of series colors for circular 3D chart visualization.
 *
 * @param {CircularChart3DTheme} theme - The theme for which to retrieve the series colors.
 * @returns {string[]} - An array of series colors.
 * @private
 */
export function getCircular3DSeriesColor(theme: CircularChart3DTheme): string[] {
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
 * Gets the theme color for circular 3D chart visualization.
 *
 * @param {CircularChart3DTheme} theme - The theme for which to retrieve the color.
 * @returns {CircularChart3DThemeStyle} - The theme color style object.
 * @private
 */
export function getCircular3DThemeColor(theme: CircularChart3DTheme): CircularChart3DThemeStyle {
    let style: CircularChart3DThemeStyle;
    switch (theme) {
    case 'HighContrastLight':
    case 'HighContrast':
        style = {
            chartTitle: '#ffffff',
            legendLabel: '#ffffff',
            background: 'transparent',
            tooltipFill: '#ffffff',
            tooltipBoldLabel: '#000000',
            tooltipLightLabel: '#000000',
            tooltipHeaderLine: '#969696',
            tabColor: '#FFD939',
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            chartTitle: '#ffffff',
            legendLabel: '#DADADA',
            background: 'transparent',
            tooltipFill: '#F4F4F4',
            tooltipBoldLabel: '#282727',
            tooltipLightLabel: '#333232',
            tooltipHeaderLine: '#9A9A9A',
            tabColor: theme === 'MaterialDark' ? '#00B0FF' : theme === 'FabricDark' ? '#0074CC' : '#0070F0',
            chartTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#676767', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap4':
        style = {
            chartTitle: '#212529', legendLabel: '#212529',
            background: 'transparent',
            tooltipFill: '#020202', tooltipBoldLabel: 'rgba(255,255,255)',
            tooltipLightLabel: 'rgba(255,255,255, 0.9)', tooltipHeaderLine: 'rgba(255,255,255, 0.2)',
            tabColor: '#007BFF',
            chartTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Tailwind':
        style = {
            chartTitle: '#374151',
            legendLabel: '#374151',
            background: 'transparent',
            tooltipFill: '#111827',
            tooltipBoldLabel: '#D1D5DB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#6B7280',
            tabColor: '#4F46E5',
            chartTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'TailwindDark':
        style = {
            chartTitle: '#D1D5DB',
            legendLabel: '#D1D5DB',
            background: 'transparent',
            tooltipFill: '#F9FAFB',
            tooltipBoldLabel: '#6B7280',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#9CA3AF',
            tabColor: '#22D3EE',
            chartTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap5':
        style = {
            chartTitle: '#212529',
            legendLabel: '#212529',
            background:  'transparent',
            tooltipFill: '#000000E5',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#FFFFFF',
            tabColor: '#0D6EFD',
            chartTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            datalabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#21252980', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            chartTitle: '#DEE2E6',
            legendLabel: '#DEE2E6',
            background: 'transparent',
            tooltipFill: '#E9ECEF',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#212529',
            tabColor: '#0D6EFD',
            chartTitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendTitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            datalabelFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#DEE2E680', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent':
        style = {
            chartTitle: '#201F1E',
            legendLabel: '#323130',
            background: 'transparent',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#323130',
            tooltipLightLabel: '#323130',
            tooltipHeaderLine: '#D2D0CE',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#201F1E', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#323129', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'FluentDark':
        style = {
            chartTitle: '#F3F2F1',
            legendLabel: '#D2D0CE',
            background: 'transparent',
            tooltipFill: '#252423',
            tooltipBoldLabel: '#F3F2F1',
            tooltipLightLabel: '#F3F2F1',
            tooltipHeaderLine: '#3B3A39',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Fluent2':
        style = {
            chartTitle: '#242424',
            legendLabel: '#242424',
            background: 'transparent',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#242424',
            tooltipLightLabel: '#242424',
            tooltipHeaderLine: '#D2D0CE',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent2Dark':
        style = {
            chartTitle: '#FFFFFF',
            legendLabel: '#FFFFFF',
            background: 'transparent',
            tooltipFill: '#292929',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent2HighContrast':
        style = {
            chartTitle: '#FFFFFF',
            legendLabel: '#FFFFFF',
            background: 'transparent',
            tooltipFill: '#000000',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Material3':
        style = {
            chartTitle: '#1C1B1F',
            legendLabel: '#49454E',
            background: 'transparent',
            tooltipFill: '#313033',
            tooltipBoldLabel: '#F4EFF4',
            tooltipLightLabel: '#F4EFF4',
            tooltipHeaderLine: '#F4EFF4',
            tabColor: '#49454E',
            chartTitleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Material3Dark':
        style = {
            chartTitle: '#E6E1E5',
            legendLabel: '#CAC4D0',
            background: 'transparent',
            tooltipFill: '#E6E1E5',
            tooltipBoldLabel: '#313033',
            tooltipLightLabel: '#313033',
            tooltipHeaderLine: '#313033',
            tabColor: '#CAC4D0',
            chartTitleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    default:
        style = {
            chartTitle: '#424242',
            legendLabel: '#353535',
            background: 'transparent',
            tooltipFill: '#000816',
            tooltipBoldLabel: '#ffffff',
            tooltipLightLabel: '#dbdbdb',
            tooltipHeaderLine: '#ffffff',
            tabColor: theme === 'Material' ? '#ff4081' : theme === 'Fabric' ? '#0078D6' : '#317AB9',
            chartTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Fabric' ? '#333333' : '#212529', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '16px', fontStyle: 'Normal', fontWeight: '600'
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
            datalabelFont: {
                color: theme === 'Material' ? 'rgba(97, 97, 97, 1)' : theme === 'Fabric' ? '#666666' : '#676767', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: theme === 'Material' ? 'rgba(0, 0, 0, 1)' : theme === 'Fabric' ? '#333333' : '#212529', fontFamily: theme === 'Material' ? 'Roboto' : theme === 'Fabric' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    }
    return style;
}
