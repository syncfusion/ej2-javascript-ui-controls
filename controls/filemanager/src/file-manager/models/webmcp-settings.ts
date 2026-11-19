import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { WebMcpTool } from '../base/interface';

/**
 * Configures WebMCP integration for this FileManager instance.
 *
 * Consumed by `WebMcpFileManager` (when injected) at init time.
 * Requires `FileManager.enableWebMcp === true` to take effect; otherwise a
 * console warning is emitted requesting the host to enable the feature and
 * inject the module.
 */
export class FileManagerWebMcpSettings extends ChildProperty<FileManagerWebMcpSettings> {
    /**
     * Prefix used when registering WebMCP tool names so multiple FileManager
     * instances can be differentiated by the host. The registered tool name
     * becomes `` `${name}_${toolName}` ``.
     *
     * If null, undefined, or an empty/whitespace-only string, falls through
     * to `parent.element.id` then `getUniqueID('filemanager')`.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Tool selection:
     *   - `string[]` (non-empty)      → allowlist of default-tool names.
     *   - `WebMcpTool[]` (non-empty)  → register the 7 defaults **plus**
     *                                   these custom tools.
     *   - absent / `null`             → register all 7 defaults.
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Allowed origins for cross-origin iframe access.
     * Forwarded into every `modelContext.registerTool(…)` call.
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];
}
