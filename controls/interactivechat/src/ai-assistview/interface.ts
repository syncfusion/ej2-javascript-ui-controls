/**
 * Specifies type for the response block.
 * Union type representing blocks that can be rendered in AIAssistView: thinking stages, plain text, or custom tools.
 */
export type ResponseBlock = TextBlock | ToolBlock | ThinkingBlock;

/**
 * Specifies type for thinking context items.
 * Categorizes metadata associated with thinking stages to provide semantic context about processed resources.
 *
 */
export enum ThinkingContextType {
    /**
     * Specifies the default type of context item.
     */
    File = 'file',
    /**
     * Specifies the variable type of context item.
     */
    Variable = 'variable',
    /**
     * Specifies the search type of context item.
     */
    Search = 'search',
    /**
     * Specifies the tool type of context item.
     */
    Tool = 'tool',
    /**
     * Specifies the result type of context item.
     */
    Result = 'result',
    /**
     * Specifies the context type of context item.
     */
    Context = 'context'
}

/**
 * Specifies badge types for thinking context items.
 * Visual indicators representing status or outcome of contextual metadata in thinking stages.
 *
 */
export enum ThinkingContextBadge {
    /**
     * Specifies the default badge of context item.
     */
    None = 'none',
    /**
     * Specifies the success badge of context item.
     */
    Success = 'success',
    /**
     * Specifies the warning badge of context item.
     */
    Warning = 'warning',
    /**
     * Specifies the failed badge of context item.
     */
    Failed = 'failed'
}

/**
 * Specifies the status of thinking stages during AI processing.
 * Represents lifecycle states indicating whether stage processing is complete, ongoing, or encountered errors.
 *
 */
export enum ThinkingStageStatus {
    /**
     * Represents the default status.
     */
    Completed = 'completed',
    /**
     * Represents the in-progress status.
     */
    InProgress = 'inProgress',
    /**
     * Represents the failed status.
     */
    Failed = 'failed'
}

/**
 * Defines the thinking context item.
 * Represents contextual metadata associated with a thinking stage, such as files scanned, variables inspected, or query results.
 */
export interface ThinkingContextItem {

    /**
     * Specifies the type of the context item.
     * Determines the category of contextual information (e.g., file, variable, search result, tool, API result, or general context).
     *
     * @type {string | ThinkingContextType}
     * @default null
     */
    type?: string | ThinkingContextType;

    /**
     * Specifies the tooltip text displayed when hovering over the context item.
     * Provides additional details or explanation for the context item.
     *
     * @type {string}
     * @default null
     */
    tooltipText?: string;

    /**
     * Specifies the name or identifier of the context item.
     * Examples: filename, variable name, search query, or tool identifier.
     *
     * @type {string}
     * @default null
     */
    name?: string;

    /**
     * Specifies the value or content associated with the context item.
     * Can represent file path, variable value, search results, or API response data.
     *
     * @type {string}
     * @default null
     */
    value?: string;

    /**
     * Specifies whether the context item is clickable.
     * When true, the item can be interacted with to trigger custom handlers or navigate to related content.
     *
     * @type {boolean}
     * @default false
     */
    clickable?: boolean;

    /**
     * Specifies the badge type displayed with the context item.
     * Indicates the status or outcome of the context (e.g., success, warning, failed, or none).
     *
     * @type {string | ThinkingContextBadge}
     * @default 'none'
     */
    badge?: string | ThinkingContextBadge;
}

/**
 * Defines the thinking stage item.
 * Represents a single stage within a thinking block, typically used in multi-step AI reasoning processes.
 * Stages are always visible and cannot be individually collapsed; only the parent thinking block can be toggled.
 */
export interface ThinkingStage {
    /**
     * Specifies the unique identifier for the stage.
     * Used for id-based diffing in updateStages() to track the same stage across multiple addPromptResponse() calls,
     * even if its position in the array changes (e.g., during status transitions or when new stages are added).
     *
     * @type {string}
     * @default null
     */
    id?: string;

    /**
     * Specifies the status of the thinking stage.
     * Indicates whether the stage is completed, in-progress, or failed during AI processing.
     *
     * @type {string | ThinkingStageStatus}
     * @default 'completed'
     */
    status?: string | ThinkingStageStatus;

    /**
     * Specifies the CSS class for the stage icon.
     * Mapped to dotCss during active phase; used for static summary HTML in finished phase.
     *
     * @type {string}
     * @default null
     */
    iconCss?: string;

    /**
     * Specifies the stage body content as plain text or sanitized HTML.
     * Rendered inside the Timeline item content area.
     * Note: Stages are always visible within their parent thinking block; only the wrapper-level thinking block can be collapsed.
     *
     * @type {string}
     * @default null
     */
    content?: string;

    /**
     * Specifies the contextual details associated with this thinking stage.
     * Array of context items providing metadata about the stage (e.g., files scanned, queries executed, API responses, tool invocations).
     *
     * @type {ThinkingContextItem[]}
     * @default []
     */
    editableContext?: ThinkingContextItem[];
}

export interface ThinkingBlock {

    /**
     * Specifies the block type as thinking.
     * Indicates that this response block contains AI reasoning or processing stages.
     *
     * @type {'thinking'}
     * @default 'thinking'
     */
    blockType: 'thinking';

    /**
     * Specifies the unique identifier to separate multiple thinking sessions on the same prompt.
     * Allows tracking of distinct thinking processes when multiple ThinkingBlock instances are rendered.
     * If unused and passed an array of thinking blocks, order corresponds to array index.
     *
     * @type {string}
     * @default null
     */
    id?: string;

    /**
     * Specifies whether the AI is actively thinking (true) or has finished processing (false).
     * When true, a spinner is displayed to indicate ongoing processing.
     * When false, the thinking stages are rendered in their completed state.
     *
     * @type {boolean}
     * @default false
     */
    isActive?: boolean;

    /**
     * Specifies the header title displayed at the top of the thinking block.
     * Examples: 'Thinking...', 'Processing request', 'Analyzing...'.
     *
     * @type {string}
     * @default 'Thinking...'
     */
    title?: string;

    /**
     * Specifies summary content displayed alongside or above the thinking stages.
     * Can contain plain text or sanitized HTML describing the overall thinking process.
     *
     * @type {string}
     * @default null
     */
    content?: string;

    /**
     * Specifies the array of thinking stages to display within this thinking block.
     * Each stage represents a step in the AI's reasoning or processing workflow.
     *
     * @type {ThinkingStage[]}
     * @default []
     */
    stages?: ThinkingStage[];

    /**
     * Specifies whether the thinking block can be collapsed by the user.
     * When true, a toggle button is displayed allowing users to expand/collapse the stage list.
     * When false, the stages are always expanded and no toggle button is shown.
     *
     * @type {boolean}
     * @default true
     */
    collapsible?: boolean;

    /**
     * Specifies the initial collapsed state of the thinking block.
     * When true, the stages are initially hidden (collapsed); when false, they are visible (expanded).
     * Only applies when collapsible is true.
     *
     * @type {boolean}
     * @default true
     */
    collapsed?: boolean;
}

export interface TextBlock {
    /**
     * Specifies the block type as text.
     * Indicates that this response block contains plain text or HTML content without thinking stages.
     *
     * @type {'text'}
     * @default 'text'
     */
    blockType: 'text';

    /**
     * Specifies the text content to display in block.
     * Can contain plain text or sanitized HTML markup for rich formatting.
     *
     * @type {string}
     * @default null
     */
    content: string;
}

export interface ToolBlock {
    /**
     * Specifies the block type as tool.
     * Indicates that this response block contains custom tool UI rendering via registered tool handler.
     *
     * @type {'tool'}
     * @default 'tool'
     */
    blockType: 'tool';

    /**
     * Specifies the name of registered tool for rendering.
     * Must match tool name passed to registerToolUI() method.
     *
     * @type {string}
     * @default null
     */
    toolName: string;

    /**
     * Specifies optional properties passed to tool template and handler during rendering.
     * Props object forwarded to template function and handler callback for custom tool configuration.
     *
     * @type {any}
     * @default null
     */
    props?: any;
}
