import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { WebMcpTool } from '../base/interface';

/**
 * Configures the WebMCP settings for the TreeGrid component.
 *
 * ```html
 * <div id='treegrid'></div>
 * ```
 * ```typescript
 * var treegrid = new TreeGrid({
 *     dataSource: data,
 *     enableWebMcp: true,
 *     webMcpSettings: {
 *         name: 'treegrid_mcp',
 *         tools: ['getViewRecords', 'sortByColumn', 'filterByColumn'],
 *         exposedTo: ['*']
 *     }
 * });
 * treegrid.appendTo('#treegrid');
 * ```
 */
export class TreegridWebMcpSettings extends ChildProperty<TreegridWebMcpSettings> {
    /**
     * Specifies the name or prefix for the registered tools.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Specifies the list of tools to register. Can be an array of tool names (strings) or tool objects.
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Specifies the list of allowed origins to expose the registered tools to.
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];
}
