import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { WebMcpTool } from '../base/interface';

/**
 * Holds the configuration of WebMCP settings in the Scheduler component.
 */
export class SchedulerWebMcpSettings extends ChildProperty<SchedulerWebMcpSettings> {
    /**
     * Specifies the prefix name for WebMCP tool registration.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Specifies the list of tool names or WebMcpTool objects to register.
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Specifies the list of origins to expose the tools to.
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];
}
