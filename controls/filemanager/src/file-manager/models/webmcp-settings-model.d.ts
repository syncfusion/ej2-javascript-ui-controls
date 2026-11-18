import { ChildProperty, Property } from '@syncfusion/ej2-base';import { WebMcpTool } from '../base/interface';

/**
 * Interface for a class FileManagerWebMcpSettings
 */
export interface FileManagerWebMcpSettingsModel {

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
    name?: string;

    /**
     * Tool selection:
     *   - `string[]` (non-empty)      → allowlist of default-tool names.
     *   - `WebMcpTool[]` (non-empty)  → register the 7 defaults **plus**
     *                                   these custom tools.
     *   - absent / `null`             → register all 7 defaults.
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Allowed origins for cross-origin iframe access.
     * Forwarded into every `modelContext.registerTool(…)` call.
     *
     * @default null
     */
    exposedTo?: string[];

}