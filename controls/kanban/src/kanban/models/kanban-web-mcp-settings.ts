import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { WebMcpTool } from '../base/interface';

/**
 * Holds the WebMCP configuration for the Kanban component.
 */
export class KanbanWebMcpSettings extends ChildProperty<KanbanWebMcpSettings> {

    /**
     * Specifies the name for the WebMCP settings instance.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Defines the collection of WebMCP tools to be registered.
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Defines the contexts where the WebMCP tools should be exposed.
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];

}
