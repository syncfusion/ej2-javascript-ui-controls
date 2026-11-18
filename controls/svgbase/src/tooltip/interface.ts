/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
import { TextStyleModel } from './tooltip-model';
import { Tooltip } from './tooltip';
import { TooltipTheme } from './enum';
/**
 * Specifies the Theme style for chart and accumulation.
 */
export interface ITooltipThemeStyle {
    tooltipFill: string;
    tooltipBoldLabel: string;
    tooltipLightLabel: string;
    tooltipHeaderLine: string;
    textStyle: TextStyleModel;
}

export interface IBlazorTemplate {
    name: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    parent: object;
}

export interface ITooltipEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}

export interface ITooltipRenderingEventArgs extends ITooltipEventArgs {
    /** Defines tooltip text collections */
    text?: string;
    /** Defines tooltip text style */
    textStyle?: TextStyleModel;
    /** Defines the current Tooltip instance */
    tooltip: Tooltip;

}

export interface ITooltipAnimationCompleteArgs extends ITooltipEventArgs {
    /** Defines the current Tooltip instance */
    tooltip: Tooltip;
}

export interface ITooltipLoadedEventArgs extends ITooltipEventArgs {
    /** Defines the current Tooltip instance */
    tooltip: Tooltip;
}

/** @private */
export function getTooltipThemeColor(theme: TooltipTheme): ITooltipThemeStyle {
    let style: ITooltipThemeStyle;
    switch (theme as string) {
    case 'Highcontrast':
    case 'HighContrast':
        style = {
            tooltipFill: '#ffffff',
            tooltipBoldLabel: '#000000',
            tooltipLightLabel: '#000000',
            tooltipHeaderLine: '#969696',
            textStyle: { fontFamily: 'Segoe UI', color: '#000000', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            tooltipFill: theme === 'MaterialDark' ? '#F4F4F4' : theme === 'FabricDark' ? '#A19F9D' : '#F0F0F0' ,
            tooltipBoldLabel: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'FabricDark' ? '#DADADA' : '#1A1A1A',
            tooltipLightLabel: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'FabricDark' ? '#DADADA' : '#1A1A1A',
            tooltipHeaderLine: '#9A9A9A',
            textStyle: theme === 'MaterialDark' ? { fontFamily: 'Roboto', color: 'rgba(18, 18, 18, 1)', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' } : theme === 'FabricDark' ? { fontFamily: 'Segoe UI', color: '#DADADA', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' } : { fontFamily: 'Helvetica', color: '#1A1A1A', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Bootstrap4':
        style = {
            tooltipFill: '#212529',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: 'rgba(255, 255, 255, 0.2)',
            textStyle: { fontFamily: 'Helvetica', color: '#F9FAFB', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Tailwind3':
        style = {
            tooltipFill: '#111827',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#D1D5DB',
            textStyle: { fontFamily: 'Inter', color: '#F9FAFB', fontWeight: '500', size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Tailwind3Dark':
        style = {
            tooltipFill: '#F9FAFB',
            tooltipBoldLabel: '#1F2937',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#374151',
            textStyle: { fontFamily: 'Inter', color: '#1F2937', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Tailwind':
        style = {
            tooltipFill: '#111827',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#6B7280',
            textStyle: { fontFamily: 'Inter', color: '#F9FAFB', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'TailwindDark':
        style = {
            tooltipFill: '#E9ECEF',
            tooltipBoldLabel: '#1F2937',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#9CA3AF',
            textStyle: { fontFamily: 'Inter', color: '#1F2937', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Bootstrap5':
        style = {
            tooltipFill: '#000000E5',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#FFFFFF',
            textStyle: { fontFamily: 'Segoe UI', color: '#FFFFFF', fontWeight: null, size: '12px', headerTextSize: '16px', boldTextSize: '14px' }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            tooltipFill: '#FFFFFFE5',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#212529',
            textStyle: { fontFamily: 'Helvetica', color: '#212529', fontWeight: null, size: '12px', headerTextSize: '16px', boldTextSize: '14px' }
        };
        break;
    case 'Fluent':
        style = {
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#323130',
            tooltipLightLabel: '#323130',
            tooltipHeaderLine: '#D2D0CE',
            textStyle: { fontFamily: 'Segoe UI', color: '#323130', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'FluentDark':
        style = {
            tooltipFill: '#323130',
            tooltipBoldLabel: '#F3F2F2',
            tooltipLightLabel: '#F3F2F1',
            tooltipHeaderLine: '#3B3A39',
            textStyle: { fontFamily: 'Segoe UI', color: '#F3F2F1', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Fluent2':
        style = {
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#242424',
            tooltipLightLabel: '#242424',
            tooltipHeaderLine: '#D2D0CE',
            textStyle: { fontFamily: 'Segoe UI', color: '#242424', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Fluent2Dark':
        style = {
            tooltipFill: '#292929',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            textStyle: { fontFamily: 'Segoe UI', color: '#FFFFFF', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Fluent2HighContrast':
        style = {
            tooltipFill: '#000000',
            tooltipBoldLabel: '#FFFFFF',
            tooltipLightLabel: '#FFFFFF',
            tooltipHeaderLine: '#3B3A39',
            textStyle: { fontFamily: 'Segoe UI', color: '#FFFFFF', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Material3':
        style = {
            tooltipFill: '#313033',
            tooltipBoldLabel: '#F4EFF4',
            tooltipLightLabel: '#F4EFF4',
            tooltipHeaderLine: '#F4EFF4',
            textStyle: { fontFamily: 'Roboto', color: '#F4EFF4', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    case 'Material3Dark':
        style = {
            tooltipFill: '#E6E1E5',
            tooltipBoldLabel: '#313033',
            tooltipLightLabel: '#313033',
            tooltipHeaderLine: '#313033',
            textStyle: { fontFamily: 'Roboto', color: '#313033', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    default:
        style = {
            tooltipFill: theme === 'Material' ? '#000816' :  theme === 'Fabric' ? '#FFFFFF' : '#212529',
            tooltipBoldLabel: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Fabric' ? '#333333' : '#F9FAFB',
            tooltipLightLabel: theme === 'Material' ? 'rgba(249, 250, 251, 1)' : theme === 'Fabric' ? '#333333' : '#F9FAFB',
            tooltipHeaderLine: theme === 'Fabric' ? '#D2D0CE' : '#ffffff',
            textStyle: theme === 'Material' ? { fontFamily: 'Roboto', color: 'rgba(249, 250, 251, 1)', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' } : theme === 'Fabric' ? { fontFamily: 'Segoe UI', color: '#333333', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' } : { fontFamily: 'Helvetica', color: '#F9FAFB', fontWeight: null, size: '12px', headerTextSize: '12px', boldTextSize: '12px' }
        };
        break;
    }
    return style;
}
