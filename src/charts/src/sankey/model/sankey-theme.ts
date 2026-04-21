import { Sankey } from '../sankey';
import { SankeyTheme } from './sankey-enum';
import { ISankeyThemeStyle } from './sankey-interface';

/**
 * Gets an array of node colors for Sankey chart visualization.
 *
 * @param {SankeyTheme} theme - The theme for which to retrieve the node colors.
 * @returns {string[]} - An array of node colors.
 * @private
 */
export function getNodeColor(theme: SankeyTheme): string[] {
    let palette: string[];
    switch (theme) {
    case 'Fabric':
        palette = ['#00457A', '#0078D4', '#FFF4CE', '#DC3545', '#666666',
            '#A80000', '#016CC0', '#D83B01', '#CEA000', '#198754', '#107C10', '#0378D5', '#076376', '#876800'];
        break;
    case 'Bootstrap4':
        palette = ['#17A2B8', '#007BFF', '#FFC107', '#DC3545', '#6C757D',
            '#6610F2', '#20C997', '#FD7E14', '#6F42C1', '#28A745', '#D39E00', '#17A2B8', '#117A8B', '#E83E8C'];
        break;
    case 'Bootstrap':
        palette = ['#31708F', '#5BC0DE', '#AA6708', '#DC3243', '#555555',
            '#8A6D3B', '#A94442', '#F0AD4E', '#D9534F', '#5CB85C', '#124A1F', '#4D93D0', '#104B5D', '#A94442'];
        break;
    case 'HighContrastLight':
    case 'HighContrast':
        palette = ['#6E06F1', '#22F8FF', '#FFD939', '#FD0100', '#757575',
            '#944000', '#685708', '#FF5B04', '#FF6161', '#75F94C', '#166600', '#333333', '#66B0FF', '#8A8AFF'];
        break;
    case 'MaterialDark':
        palette = ['#0D462C', '#3F51B5', '#FFDDC2', '#D74113', '#424242',
            '#8E3F01', '#E3165B', '#C15601', '#EC618F', '#4D831E', '#7986CB', '#0677D5', '#044D8B', '#E37E5F'];
        break;
    case 'FabricDark':
        palette = ['#005799', '#0074CC', '#685100', '#CD2A19', '#DADADA',
            '#72170E', '#1A69B0', '#FF9D48', '#CEA000', '#8EFF8D', '#37844D', '#1E79CB', '#006795', '#876800'];
        break;
    case 'BootstrapDark':
        palette = ['#208090', '#2AAAC0', '#603C03', '#AC2A2A', '#959595',
            '#A16405', '#C12F2F', '#FAC168', '#D44F4F', '#48B14C', '#358238', '#248AFF', '#208090', '#D44F4F'];
        break;
    case 'Tailwind3':
        palette = ['#818CF8', '#38BDF8', '#FE9800', '#DC2626', '#4B5563',
            '#FDBA74', '#D63384', '#F97316', '#0284C7', '#4CAF51', '#3730A3', '#0E7490', '#164E63', '#EF4444'];
        break;
    case 'Tailwind3Dark':
        palette = ['#3730A3', '#38BDF8', '#FE9800', '#DC2626', '#4B5563',
            '#FDBA74', '#D63384', '#F97316', '#0284C7', '#4CAF51', '#22C55E', '#38BDF8', '#164E63', '#EF4444'];
        break;
    case 'Tailwind':
        palette = ['#818CF8', '#0EA5E9', '#FFB900', '#DC2626', '#4B5563',
            '#FB923C', '#DE4383', '#C2410C', '#06B6D4', '#4ADE80', '#15803D', '#38BDF8', '#0E7490', '#F87171'];
        break;
    case 'TailwindDark':
        palette = ['#818CF8', '#0EA5E9', '#FFB900', '#DC2626', '#4B5563',
            '#FB923C', '#7C3AED', '#C2410C', '#06B6D4', '#4ADE80', '#15803D', '#38BDF8', '#0E7490', '#F87171'];
        break;
    case 'Bootstrap5Dark':
    case 'Bootstrap5':
        palette = ['#6F42C1', '#0D6EFD', '#FFC107', '#DC3545', '#6C757D',
            '#F3A93C', '#52236C', '#FD7E14', '#6610F2', '#20C997', '#198754', '#0DCAF0', '#066477', '#D64F56'];
        break;
    case 'FluentDark':
        palette = ['#9BB449', '#0078D4', '#FCE100', '#D13438', '#E85F9C',
            '#CA5010', '#C19C00', '#FE9800', '#FF00FF', '#00FF00', '#0B6A0B', '#2A72D5', '#04B3B9', '#0000FF'];
        break;
    case 'Fluent':
        palette = ['#614570', '#0078D4', '#FCE100', '#D13438', '#6E7A89',
            '#CA5010', '#C19C00', '#FE9800', '#FF00FF', '#00FF00', '#0B6A0B', '#4C6FB1', '#026B6E', '#0000FF'];
        break;
    case 'Fluent2':
        palette = ['#7F56D9', '#60A5FA', '#FBBF24', '#DC2626', '#475569',
            '#FB923C', '#E038BC', '#FF9D14', '#C026D3', '#44BF25', '#74992E', '#2196F5', '#162F88', '#F7523F'];
        break;
    case 'Fluent2Dark':
        palette = ['#7F56D9', '#60A5FA', '#FBBF24', '#DC2626', '#475569',
            '#FB923C', '#E038BC', '#FF9D14', '#C026D3', '#44BF25', '#74992E', '#2196F5', '#162F88', '#F7523F'];
        break;
    case 'Fluent2HighContrast':
        palette = ['#7F56D9', '#60A5FA', '#FBBF24', '#DC2626', '#475569',
            '#FB923C', '#E038BC', '#FF9D14', '#C026D3', '#44BF25', '#74992E', '#2196F5', '#162F88', '#F7523F'];
        break;
    case 'Material3':
        palette = ['#9204EA', '#05B3DA', '#914C00', '#B3261E', '#625B71',
            '#6200EE', '#08EE9B', '#E77A16', '#7107DC', '#82C100', '#205107', '#01579B', '#828486', '#7D5260'];
        break;
    case 'Material3Dark':
        palette = ['#9204EA', '#05B3DA', '#914C00', '#B3261E', '#625B71',
            '#6200EE', '#08EE9B', '#E77A16', '#7107DC', '#82C100', '#53CA17', '#47ACFB', '#828486', '#7D5260'];
        break;
    default:
        palette = ['#0D462C', '#3F51B5', '#542107', '#D13438', '#424242',
            '#752E09', '#00B0FF', '#FF9800', '#0078AD', '#4CAF50', '#198754', '#03A9F4', '#025355',  '#0078AD'];
        break;
    }
    return palette;
}

/**
 * Gets a theme color for Sankey chart.
 *
 * @param {SankeyTheme} theme - The theme for which to retrieve the series colors.
 * @param {Sankey} [_chart] - The chart instance (optional).
 * @returns {ISankeyThemeStyle} - Returns theme style.
 * @private
 */
export function getSankeyThemeColor(theme: SankeyTheme, _chart?: Sankey): ISankeyThemeStyle {
    let style: ISankeyThemeStyle;
    switch (theme) {
    case 'HighContrastLight':
    case 'HighContrast':
        style = {
            chartTitle: '#ffffff',
            legendLabel: '#ffffff',
            background: 'transparent',
            areaBorder: '#ffffff',
            tooltipFill: '#ffffff',
            tooltipBoldLabel: '#000000',
            tooltipLightLabel: '#000000',
            tooltipHeaderLine: '#969696',
            selectionRectFill: 'rgba(255, 217, 57, 0.3)',
            selectionRectStroke: '#ffffff',
            selectionCircleStroke: '#FFD939',
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
            areaBorder: ' #9A9A9A',
            tooltipFill: '#E0E0E0',
            tooltipBoldLabel: '#282727',
            tooltipLightLabel: '#333232',
            tooltipHeaderLine: '#9A9A9A',
            selectionRectFill: 'rgba(56,169,255, 0.1)',
            selectionRectStroke: '#38A9FF',
            selectionCircleStroke: '#282727',
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
            chartTitle: '#212529',
            legendLabel: '#212529',
            background:  'transparent',
            areaBorder: '#DEE2E6',
            tooltipFill: '#000000',
            tooltipBoldLabel: 'rgba(255,255,255)',
            tooltipLightLabel: 'rgba(255,255,255, 0.9)',
            tooltipHeaderLine: 'rgba(255,255,255, 0.2)',
            selectionRectFill: 'rgba(255,255,255, 0.1)',
            selectionRectStroke: 'rgba(0, 123, 255)',
            selectionCircleStroke: '#495057',
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
    case 'Tailwind3':
        style = {
            chartTitle: '#111827',
            legendLabel: '#4B5563',
            background: 'transparent',
            areaBorder: '#D1D5DB',
            tooltipFill: '#111827',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#D1D5DB',
            selectionRectFill: 'rgba(224, 231, 255, 0.25)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
            tabColor: '#4F46E5',
            chartTitleFont: {
                color: '#111827', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            legendTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '500'
            },
            legendLabelFont: {
                color: '#4B5563', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '500'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal'
            },
            datalabelFont: {
                color: '#111827', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Tailwind3Dark':
        style = {
            chartTitle: '#FFFFFF',
            legendLabel: '#D1D5DB',
            background: 'transparent',
            areaBorder: ' #374151',
            tooltipFill: '#F9FAFB',
            tooltipBoldLabel: '#1F2937',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#374151',
            selectionRectFill: 'rgba(30, 27, 75, 0.25)',
            selectionRectStroke: '#6366F1',
            selectionCircleStroke: '#282727',
            tabColor: '#22D3EE',
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            legendTitleFont: {
                color: '#E5E7EB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '500'
            },
            legendLabelFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '500'
            },
            tooltipLabelFont: {
                color: '#1F2937', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal'
            },
            datalabelFont: {
                color: '#FFFFFF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Tailwind':
        style = {
            chartTitle: '#374151',
            legendLabel: '#374151',
            background: 'transparent',
            areaBorder: ' #E5E7EB',
            tooltipFill: '#111827',
            tooltipBoldLabel: '#D1D5DB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#6B7280',
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
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
            areaBorder: ' #374151',
            tooltipFill: '#F9FAFB',
            tooltipBoldLabel: '#6B7280',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#9CA3AF',
            selectionRectFill: 'rgba(34,211,238, 0.1)',
            selectionRectStroke: '#22D3EE',
            selectionCircleStroke: '#282727',
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
            areaBorder: '#E9ECEF',
            tooltipFill: '#212529',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#FFFFFF',
            selectionRectFill: 'rgba(134,183,254, 0.1)',
            selectionRectStroke: '#0D6EFD',
            selectionCircleStroke: '#6B7280',
            tabColor: '#0D6EFD',
            chartTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal'
            },
            datalabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            chartSubTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            chartTitle: '#DEE2E6',
            legendLabel: '#DEE2E6',
            background: 'transparent',
            areaBorder: '#343A40',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#212529',
            selectionRectFill: 'rgba(134,183,254, 0.25)',
            selectionRectStroke: '#0D6EFD',
            selectionCircleStroke: '#0D6EFD',
            tabColor: '#0D6EFD',
            chartTitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
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
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent':
        style = {
            chartTitle: '#201F1E',
            legendLabel: '#323130',
            background: 'transparent',
            areaBorder: '#EDEBE9',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#323130',
            tooltipLightLabel: '#323130',
            tooltipHeaderLine: '#D2D0CE',
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
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
            areaBorder: '#414040',
            tooltipFill: '#252423',
            tooltipBoldLabel: '#F3F2F1',
            tooltipLightLabel: '#F3F2F1',
            tooltipHeaderLine: '#3B3A39',
            selectionRectFill: 'rgba(79,70,229, 0.1)',
            selectionRectStroke: '#4F46E5',
            selectionCircleStroke: '#6B7280',
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
            areaBorder: '#EDEBE9',
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#242424',
            tooltipLightLabel: '#242424',
            tooltipHeaderLine: '#D2D0CE',
            selectionRectFill: 'rgba(180, 214, 250, 0.1)',
            selectionRectStroke: '#0F6CBD',
            selectionCircleStroke: '#0F6CBD',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
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
    case 'Fluent2HighContrast':
        style = {
            chartTitle: '#FFFFFF',
            legendLabel: '#FFFFFF',
            background: 'transparent',
            areaBorder: '#292827',
            tooltipFill: '#000000',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            selectionRectFill: 'rgba(26, 235, 255, 0.2)',
            selectionRectStroke: '#1AEBFF',
            selectionCircleStroke: '#1AEBFF',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
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
    case 'Fluent2Dark':
        style = {
            chartTitle: '#FFFFFF',
            legendLabel: '#FFFFFF',
            background: 'transparent',
            areaBorder: '#292827',
            tooltipFill: '#292929',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            selectionRectFill: 'rgba(14, 71, 117, 0.1)',
            selectionRectStroke: '#115EA3',
            selectionCircleStroke: '#115EA3',
            tabColor: '#0078D4',
            chartTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '600'
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
    case 'Material3':
        style = {
            chartTitle: '#1C1B1F',
            legendLabel: '#49454E',
            background: 'transparent',
            areaBorder: '#E7E0EC',
            tooltipFill: '#313033',
            tooltipBoldLabel: '#F4EFF4',
            tooltipLightLabel: '#F4EFF4',
            tooltipHeaderLine: '#F4EFF4',
            selectionRectFill: 'rgb(98, 0, 238, 0.06)',
            selectionRectStroke: '#6200EE',
            selectionCircleStroke: '#79747E',
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
            areaBorder: '#49454F',
            tooltipFill: '#E6E1E5',
            tooltipBoldLabel: '#313033',
            tooltipLightLabel: '#313033',
            tooltipHeaderLine: '#313033',
            selectionRectFill: 'rgba(78, 170, 255, 0.06)',
            selectionRectStroke: '#4EAAFF',
            selectionCircleStroke: '#938F99',
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
            areaBorder: 'Gray',
            tooltipFill: '#000816',
            tooltipBoldLabel: '#ffffff',
            tooltipLightLabel: '#dbdbdb',
            tooltipHeaderLine: '#ffffff',
            selectionRectFill: 'rgba(41, 171, 226, 0.1)',
            selectionRectStroke: '#29abe2',
            selectionCircleStroke: '#29abe2',
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
