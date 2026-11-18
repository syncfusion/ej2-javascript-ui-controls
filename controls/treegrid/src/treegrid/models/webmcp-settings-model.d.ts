import { ChildProperty, Property } from '@syncfusion/ej2-base';import { WebMcpTool } from '../base/interface';

/**
 * Interface for a class TreegridWebMcpSettings
 */
export interface TreegridWebMcpSettingsModel {

    /**
     * Specifies the name or prefix for the registered tools.
     *
     * @default null
     */
    name?: string;

    /**
     * Specifies the list of tools to register. Can be an array of tool names (strings) or tool objects.
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Specifies the list of allowed origins to expose the registered tools to.
     *
     * @default null
     */
    exposedTo?: string[];

}