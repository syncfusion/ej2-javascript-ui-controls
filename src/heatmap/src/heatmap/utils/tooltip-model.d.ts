import { createElement, Property, Complex, ChildProperty, isNullOrUndefined, select } from '@syncfusion/ej2-base';import { HeatMap } from '../heatmap';import { CurrentRect } from '../utils/helper';import { Tooltip as tool } from '@syncfusion/ej2-svg-base';import { TooltipBorderModel, FontModel } from '../model/base-model';import { Series } from '../series/series';import { ITooltipEventArgs } from '../model/interface';import { BubbleTooltipData, TooltipBorder, Font } from '../model/base';import { Theme } from '../model/theme';import { DataModel } from '../datasource/adaptor-model';

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Custom template to format the ToolTip content.
     *
     * @default ''
     */
    template?: string;

    /**
     * Specifies the color collection for heat map cell.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Specifies the cell border style.
     *
     * @default ''
     */
    border?: TooltipBorderModel;

    /**
     * Specifies the cell label style.
     *
     * @default ''
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class Tooltip
 */
export interface TooltipModel {

}