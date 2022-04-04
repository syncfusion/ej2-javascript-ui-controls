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
            tooltipHeaderLine: '#969696'
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            tooltipFill: '#F4F4F4',
            tooltipBoldLabel: '#282727',
            tooltipLightLabel: '#333232',
            tooltipHeaderLine: '#9A9A9A'
        };
        break;
    case 'Bootstrap4':
        style = {
            tooltipFill: '#020202',
            tooltipBoldLabel: 'rgba(255, 255, 255)',
            tooltipLightLabel: 'rgba(255, 255, 255, 0.9)',
            tooltipHeaderLine: 'rgba(255, 255, 255, 0.2)'
        };
        break;
    case 'Tailwind':
        style = {
            tooltipFill: '#111827',
            tooltipBoldLabel: '#D1D5DB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#6B7280',
        };
        break;
    case 'TailwindDark':
        style = {
            tooltipFill: '#F9FAFB',
            tooltipBoldLabel: '#6B7280',
            tooltipLightLabel: '#1F2937',
            tooltipHeaderLine: '#9CA3AF',
        };
        break;
    case 'Bootstrap5':
        style = {
            tooltipFill: '#212529',
            tooltipBoldLabel: '#F9FAFB',
            tooltipLightLabel: '#F9FAFB',
            tooltipHeaderLine: '#9CA3AF',
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            tooltipFill: '#E9ECEF',
            tooltipBoldLabel: '#212529',
            tooltipLightLabel: '#212529',
            tooltipHeaderLine: '#ADB5BD',
        };
        break;
    case 'Fluent':
        style = {
            tooltipFill: '#FFFFFF',
            tooltipBoldLabel: '#323130',
            tooltipLightLabel: '#323130',
            tooltipHeaderLine: '#D2D0CE',
        };
        break;
    case 'FluentDark':
        style = {
            tooltipFill: '#252423',
            tooltipBoldLabel: '#F3F2F1',
            tooltipLightLabel: '#F3F2F1',
            tooltipHeaderLine: '#3B3A39',
        };
        break;
    default:
        style = {
            tooltipFill: '#000816',
            tooltipBoldLabel: '#ffffff',
            tooltipLightLabel: '#dbdbdb',
            tooltipHeaderLine: '#ffffff'
        };
        break;
    }
    return style;
}
