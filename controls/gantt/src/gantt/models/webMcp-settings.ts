import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { WebMcpTool } from '../base/interface';

/**
 * Defines the settings for WebMCP integration in Gantt component.
 */
export class GanttWebMcpSettings extends ChildProperty<GanttWebMcpSettings> {
    /**
     * Specifies the name for the WebMCP settings instance.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Defines the collection of WebMCP tools to be registered.
     * Can be either an array of tool names (strings) or an array of WebMcpTool objects.
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Defines the contexts where the WebMCP tools should be exposed.
     * This controls the visibility and accessibility of tools in different environments.
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];
}

