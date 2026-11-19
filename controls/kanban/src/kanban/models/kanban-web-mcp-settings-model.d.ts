import { ChildProperty, Property } from '@syncfusion/ej2-base';import { WebMcpTool } from '../base/interface';

/**
 * Interface for a class KanbanWebMcpSettings
 */
export interface KanbanWebMcpSettingsModel {

    /**
     * Specifies the name for the WebMCP settings instance.
     *
     * @default null
     */
    name?: string;

    /**
     * Defines the collection of WebMCP tools to be registered.
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Defines the contexts where the WebMCP tools should be exposed.
     *
     * @default null
     */
    exposedTo?: string[];

}