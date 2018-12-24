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
    switch (theme) {
        case 'Highcontrast':
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
        default:
            style = {
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                tooltipBoldLabel: '#ffffff',
                tooltipLightLabel: '#dbdbdb',
                tooltipHeaderLine: '#ffffff'
            };
            break;
    }
    return style;
}


