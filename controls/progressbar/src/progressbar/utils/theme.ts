/**
 * Theme of the progressbar
 */
import { ProgressTheme } from './index';
import { IProgressStyle } from '../model/progress-interface';
import { Browser } from '@syncfusion/ej2-base';

/**
 * Retrieves the theme color settings for a progress bar.
 *
 * @param {ProgressTheme} theme - The theme of the progress bar.
 * @returns {IProgressStyle} - The style settings for the progress bar based on the theme.
 * @private
 */
export function getProgressThemeColor(theme: ProgressTheme): IProgressStyle {
    let style: IProgressStyle;
    switch (theme) {
    case 'Material':
        style = {
            linearTrackColor: '#E3165B',
            linearProgressColor: '#E3165B',
            circularTrackColor: '#E3165B',
            circularProgressColor: '#E3165B',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 0.26,
            bufferOpacity: 0.4,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 4,
            linearProgressThickness: 4,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#4caf50',
            danger: '#ff6652',
            warning: '#ff9800',
            info: '#03a9f4',
            tooltipLabelFont: {
                color: 'rgba(249, 250, 251, 1)', fontFamily: 'Roboto', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#000000', fontStyle: 'Normal', fontFamily: 'Roboto'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#000000', fontStyle: 'Normal', fontFamily: 'Roboto'
            }
        };
        break;
    case 'Bootstrap':
        style = {
            linearTrackColor: '#EEEEEE',
            linearProgressColor: '#317ab9',
            circularTrackColor: '#EEEEEE',
            circularProgressColor: '#317ab9',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 20,
            linearProgressThickness: 20,
            circularTrackThickness: 6,
            circularProgressThickness: 6,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#48b14c',
            danger: '#d44f4f',
            warning: '#fac168',
            info: '#2aaac0',
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica Neue', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#000000', fontStyle: 'Normal', fontFamily: 'Helvetica Neue'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#000000', fontStyle: 'Normal', fontFamily: 'Helvetica Neue'
            }
        };
        break;
    case 'Bootstrap4':
        style = {
            linearTrackColor: '#E9ECEF',
            linearProgressColor: '#007bff',
            circularTrackColor: '#E9ECEF',
            circularProgressColor: '#007bff',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 6,
            circularProgressThickness: 6,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica Neue', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#000000', fontStyle: 'Normal', fontFamily: 'Helvetica Neue'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#000000', fontStyle: 'Normal', fontFamily: 'Helvetica Neue'
            }
        };
        break;
    case 'HighContrast':
        style = {
            linearTrackColor: '#BFBFBF',
            linearProgressColor: '#FFD939',
            circularTrackColor: '#BFBFBF',
            circularProgressColor: '#FFD939',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#2bc700',
            danger: '#ff6161',
            warning: '#ff7d1a',
            info: '#66b0ff',
            tooltipLabelFont: {
                color: '#000000', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Tailwind3':
        style = {
            linearTrackColor: '#E5E7EB',
            linearProgressColor: '#4F46E5',
            circularTrackColor: '#E5E7EB',
            circularProgressColor: '#4F46E5',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            bufferColor: '#818CF8',
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#111827',
            tooltipLightLabel: '#F9FAFB',
            success: '#15803D',
            danger: '#DC2626',
            warning: '#C2410C',
            info: '#0E7490',
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter', fontWeight: '500'
            },
            linearLabelFont: {
                size: '10', fontWeight: '500', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Inter'
            },
            circularLabelFont: {
                size: '10', fontWeight: '500', color: '#4F46E5', fontStyle: 'Normal', fontFamily: 'Inter'
            }
        };
        break;
    case 'Tailwind3Dark':
        style = {
            linearTrackColor: '#282F3C',
            linearProgressColor: '#6366F1',
            circularTrackColor: '#282F3C',
            circularProgressColor: '#6366F1',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.45,
            bufferColor: '#3730A3',
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#F9FAFB',
            tooltipLightLabel: '#1F2937',
            success: '#22C55E',
            danger: '#F87171',
            warning: '#F97316',
            info: '#38BDF8',
            tooltipLabelFont: {
                color: '#1F2937', fontFamily: 'Inter', fontWeight: '500'
            },
            linearLabelFont: {
                size: '10', fontWeight: '500', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Inter'
            },
            circularLabelFont: {
                size: '10', fontWeight: '500', color: '#6366F1', fontStyle: 'Normal', fontFamily: 'Inter'
            }
        };
        break;
    case 'Tailwind':
        style = {
            linearTrackColor: '#E5E7EB',
            linearProgressColor: '#4F46E5',
            circularTrackColor: '#E5E7EB',
            circularProgressColor: '#4F46E5',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#15803D',
            danger: '#DC2626',
            warning: '#C2410C',
            info: '#0E7490',
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Inter'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Inter'
            }
        };
        break;
    case 'TailwindDark':
        style = {
            linearTrackColor: '#4B5563',
            linearProgressColor: '#22D3EE',
            circularTrackColor: '#4B5563',
            circularProgressColor: '#22D3EE',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.45,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#22C55E',
            danger: '#F87171',
            warning: '#ea580c',
            info: '#06B6D4',
            tooltipLabelFont: {
                color: '#1F2937', fontFamily: 'Inter', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#D1D5DB', fontStyle: 'Normal', fontFamily: 'Inter'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#D1D5DB', fontStyle: 'Normal', fontFamily: 'Inter'
            }
        };
        break;
    case 'FabricDark':
    case 'BootstrapDark':
    case 'MaterialDark':
        style = {
            linearTrackColor: '#C8C8C8',
            linearProgressColor: '#9A9A9A',
            circularTrackColor: '#C8C8C8',
            circularProgressColor: '#9A9A9A',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#22b24b',
            danger: '#ac2a2a',
            warning: '#ffca1c',
            info: '#489bd5',
            tooltipLabelFont: {
                color: theme === 'BootstrapDark' ? '#1A1A1A' : theme === 'FabricDark' ? '#DADADA' : 'rgba(18, 18, 18, 1)', fontFamily: theme === 'BootstrapDark' ? 'Helvetica Neue' : theme === 'FabricDark' ? 'Segoe UI' : 'Roboto', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#000000', fontStyle: 'Normal', fontFamily: theme === 'BootstrapDark' ? 'Helvetica Neue' : theme === 'FabricDark' ? 'Segoe UI' : 'Roboto'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#000000', fontStyle: 'Normal', fontFamily: theme === 'BootstrapDark' ? 'Helvetica Neue' : theme === 'FabricDark' ? 'Segoe UI' : 'Roboto'
            }
        };
        break;
    case 'Bootstrap5':
        style = {
            linearTrackColor: '#DEE2E6',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#DEE2E6',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.44,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 2,
            circularProgressThickness: 2,
            tooltipFill: '#000000E5',
            tooltipLightLabel: '#FFFFFF',
            success: '#198754',
            danger: '#DC3545',
            warning: '#FFC107',
            info: '#0DCAF0',
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '400', color: '#0D6EFD', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            linearTrackColor: '#495057',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#495057',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.4,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 2,
            circularProgressThickness: 2,
            tooltipFill: '#FFFFFFE5',
            tooltipLightLabel: '#212529',
            success: '#198754',
            danger: '#DC3545',
            warning: '#FFC107',
            info: '#0DCAF0',
            tooltipLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '400', color: '#0D6EFD', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Fluent':
        style = {
            linearTrackColor: '#F3F2F1',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#F3F2F1',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.45,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#0B6A0B',
            danger: '#D13438',
            warning: '#CA5010',
            info: '#038387',
            tooltipLabelFont: {
                color: '#323130', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#0D6EFD', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#0D6EFD', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'FluentDark':
        style = {
            linearTrackColor: '#3B4248',
            linearProgressColor: '#0D6EFD',
            circularTrackColor: '#3B4248',
            circularProgressColor: '#0D6EFD',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 16,
            linearProgressThickness: 16,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#0B6A0B',
            danger: '#D13438',
            warning: '#CA5010',
            info: '#038387',
            tooltipLabelFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#0D6EFD', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#0D6EFD', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Fluent2':
        style = {
            linearTrackColor: '#E6E6E6',
            linearProgressColor: '#0F6CBD',
            circularTrackColor: '#E6E6E6',
            circularProgressColor: '#0F6CBD',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: Browser.isDevice ? 4 : 2,
            linearProgressThickness: Browser.isDevice ? 4 : 2,
            circularTrackThickness: Browser.isDevice ? 2 : 2,
            circularProgressThickness: Browser.isDevice ? 2 : 2,
            tooltipFill: '#FFFFFF',
            tooltipLightLabel: '#242424',
            success: '#107C10',
            danger: '#D13438',
            warning: '#BC4B09',
            info: '#008AA9',
            tooltipLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '12', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#242424', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Fluent2Dark':
        style = {
            linearTrackColor: '#333333',
            linearProgressColor: '#115EA3',
            circularTrackColor: '#333333',
            circularProgressColor: '#115EA3',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: Browser.isDevice ? 4 : 2,
            linearProgressThickness: Browser.isDevice ? 4 : 2,
            circularTrackThickness: Browser.isDevice ? 2 : 2,
            circularProgressThickness: Browser.isDevice ? 2 : 2,
            tooltipFill: '#292929',
            tooltipLightLabel: '#FFFFFF',
            success: '#107C10',
            danger: '#DC626D',
            warning: '#FAA06B',
            info: '#0099BC',
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '12', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Fluent2HighContrast':
        style = {
            linearTrackColor: '#000000',
            linearProgressColor: '#1AEBFF',
            circularTrackColor: '#000000',
            circularProgressColor: '#1AEBFF',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.35,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: Browser.isDevice ? 4 : 2,
            linearProgressThickness: Browser.isDevice ? 4 : 2,
            circularTrackThickness: Browser.isDevice ? 2 : 2,
            circularProgressThickness: Browser.isDevice ? 2 : 2,
            tooltipFill: '#000000',
            tooltipLightLabel: '#FFFFFF',
            success: '#107C10',
            danger: '#C50F1F',
            warning: '#F7630C',
            info: '#0099BC',
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '12', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    case 'Material3':
        style = {
            linearTrackColor: '#E7E0EC',
            linearProgressColor: '#6750A4',
            circularTrackColor: '#E7E0EC',
            circularProgressColor: '#6750A4',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.24,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 4,
            linearProgressThickness: 4,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#313033',
            tooltipLightLabel: '#F4EFF4',
            success: '#0B6A0B',
            danger: '#D13438',
            warning: '#CA5010',
            info: '#038387',
            tooltipLabelFont: {
                size: '12px', fontWeight: '400', color: '#F4EFF4', fontStyle: 'Normal', fontFamily: 'Roboto'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#FFFFFF', fontStyle: 'Normal', fontFamily: 'Roboto'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#6750A4', fontStyle: 'Normal', fontFamily: 'Roboto'
            }
        };
        break;
    case 'Material3Dark':
        style = {
            linearTrackColor: '#49454F',
            linearProgressColor: '#D0BCFF',
            circularTrackColor: '#49454F',
            circularProgressColor: '#D0BCFF',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.24,
            linearGapWidth: 4,
            circularGapWidth: 4,
            linearTrackThickness: 4,
            linearProgressThickness: 4,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#E6E1E5',
            tooltipLightLabel: '#313033',
            success: '#0B6A0B',
            danger: '#D13438',
            warning: '#CA5010',
            info: '#038387',
            tooltipLabelFont: {
                color: '#313033', fontFamily: 'roboto', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: '#371E73', fontStyle: 'Normal', fontFamily: 'Roboto'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: '#D0BCFF', fontStyle: 'Normal', fontFamily: 'Roboto'
            }
        };
        break;
    default:
        style = {
            linearTrackColor: '#EAEAEA',
            linearProgressColor: '#0078D6',
            circularTrackColor: '#E6E6E6',
            circularProgressColor: '#0078D6',
            backgroundColor: 'transparent',
            progressOpacity: 1,
            trackOpacity: 1,
            bufferOpacity: 0.3,
            linearGapWidth: 2,
            circularGapWidth: 4,
            linearTrackThickness: 2,
            linearProgressThickness: 2,
            circularTrackThickness: 4,
            circularProgressThickness: 4,
            tooltipFill: '#ffffff',
            tooltipLightLabel: '#000000',
            success: '#166600',
            danger: '#b30900',
            warning: '#944000',
            info: '#0056b3',
            tooltipLabelFont: {
                color: '#333333', fontFamily: 'Segoe UI', fontWeight: '400'
            },
            linearLabelFont: {
                size: '10', fontWeight: '400', color: null, fontStyle: 'Normal', fontFamily: 'Segoe UI'
            },
            circularLabelFont: {
                size: '12', fontWeight: '500', color: null, fontStyle: 'Normal', fontFamily: 'Segoe UI'
            }
        };
        break;
    }
    return style;
}
