import { ChildProperty, Collection, Complex, Property } from '@syncfusion/ej2-base';import { Grid } from '../base/grid';
import {StatusBarValueFormatterParams,StatusBarContext,StatusBarPanelType,StatusBarPosition} from "./status-bar-settings";

/**
 * Interface for a class StatusBarPanelParams
 */
export interface StatusBarPanelParamsModel {

    /**
     * Defines the panel label.
     *
     * @default null
     */
    label?: string;

    /**
     * Formats numeric values as text.
     *
     * @default null
     */
    valueFormatter?: (params: StatusBarValueFormatterParams) => string;

    /**
     * Defines the aggregate functions displayed by a selected-cell aggregate panel.
     *
     * @default null
     */
    aggregateFunctions?: Array<'Count' | 'Sum' | 'Min' | 'Max' | 'Avg'>;

    /**
     * Defines a trusted application template or rendering function.
     *
     * @default null
     */
    template?: string | ((context: StatusBarContext) => string | HTMLElement | Promise<string | HTMLElement>);

    /**
     * Defines custom template data.
     *
     * @default null
     */
    data?: Object;

}

/**
 * Interface for a class StatusBarItemConfig
 */
export interface StatusBarItemConfigModel {

    /**
     * Defines the panel kind.
     *
     * @default null
     */
    type?: StatusBarPanelType;

    /**
     * Defines the panel zone.
     *
     * @default 'Right'
     */
    position?: StatusBarPosition;

    /**
     * Defines a nonempty unique key. Missing keys are omitted; the first duplicate wins.
     *
     * @default null
     */
    key?: string;

    /**
     * Configures panel formatting and custom content.
     *
     * @default {}
     */
    statusPanelParams?: StatusBarPanelParamsModel;

}

/**
 * Interface for a class StatusBarSettings
 */
export interface StatusBarSettingsModel {

    /**
     * Defines panels in display order within each zone.
     *
     * @default []
     */
    items?: StatusBarItemConfigModel[];

}