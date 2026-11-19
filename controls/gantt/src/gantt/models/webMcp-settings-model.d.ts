import { Property, ChildProperty } from '@syncfusion/ej2-base';import { WebMcpTool } from '../base/interface';

/**
 * Interface for a class GanttWebMcpSettings
 */
export interface GanttWebMcpSettingsModel {

    /**
     * Specifies the name for the WebMCP settings instance.
     *
     * @default null
     */
    name?: string;

    /**
     * Defines the collection of WebMCP tools to be registered.
     * Can be either an array of tool names (strings) or an array of WebMcpTool objects.
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Defines the contexts where the WebMCP tools should be exposed.
     * This controls the visibility and accessibility of tools in different environments.
     *
     * @default null
     */
    exposedTo?: string[];

}