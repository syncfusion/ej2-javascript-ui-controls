import { isNullOrUndefined, Property, ChildProperty } from '@syncfusion/ej2-base';import { Diagram } from '../diagram';import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs } from '../objects/interface/IElement';import { AlignmentOptions, ConnectorConstraints, DiagramConstraints, DistributeOptions, NodeConstraints, PortConstraints, PortVisibility, SizingOptions } from '../enum/enum';

/**
 * Interface for a class WebMcpDiagram
 */
export interface WebMcpDiagramModel {

}

/**
 * Interface for a class WebMcpDiagramSettings
 */
export interface WebMcpDiagramSettingsModel {

    /**
     * Name of the diagram for organizing registered tools
     *
     * @default null
     */
    name?: string;

    /**
     * Array of tool names or custom WebMcpTool definitions to register
     *
     * @default null
     */
    tools?: string[] | WebMcpTool[];

    /**
     * Optional list of allowed origins for cross-origin iframe access
     *
     * @default null
     */
    exposedTo?: string[];

}