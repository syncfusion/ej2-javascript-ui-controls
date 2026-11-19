import { Property, ChildProperty } from '@syncfusion/ej2-base';import { WebMcpTool } from '../base/interface';

/**
 * Interface for a class SchedulerWebMcpSettings
 */
export interface SchedulerWebMcpSettingsModel {

    /**
     * Specifies the prefix name for WebMCP tool registration.
     *
     * @default null
     */
    name?: string;

    /**
     * Specifies the list of tool names or WebMcpTool objects to register.
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Specifies the list of origins to expose the tools to.
     *
     * @default null
     */
    exposedTo?: string[];

}