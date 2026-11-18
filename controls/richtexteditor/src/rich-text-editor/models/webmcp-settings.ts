import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { WebMcpTool } from '../base/interface';

/**
 * Represents the WebMCP settings for tool registration and execution.
 */
export class RichTextEditorWebMcpSettings extends ChildProperty<RichTextEditorWebMcpSettings> {
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
