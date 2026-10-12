import { createElement, Property, Complex, ChildProperty, isNullOrUndefined, select } from '@syncfusion/ej2-base';import { HeatMap } from '../heatmap';import { CurrentRect, getSanitizedTexts, removeElement } from '../utils/helper';import { Tooltip as tool, TooltipTheme } from '@syncfusion/ej2-svg-base';import { TooltipBorderModel, FontModel } from '../model/base-model';import { Series } from '../series/series';import { ITooltipEventArgs } from '../model/interface';import { BubbleTooltipData, TooltipBorder, Font } from '../model/base';import { Theme } from '../model/theme';import { DataModel } from '../datasource/adaptor-model';

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Sets and gets the custom template to format the tooltip content.
     *
     * @default ''
     */
    template?: string;

    /**
     * Specifies the color to be applied to the tooltip.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Sets and gets the options to customize the cell border style.
     */
    border?: TooltipBorderModel;

    /**
     * Sets and gets the options to customize the cell label style.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class Tooltip
 */
export interface TooltipModel {

}