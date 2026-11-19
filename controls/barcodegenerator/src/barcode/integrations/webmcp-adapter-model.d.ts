import { isNullOrUndefined, Property, ChildProperty } from '@syncfusion/ej2-base';import { BarcodeGenerator } from '../barcode';import { QRCodeGenerator } from '../../qrcode/qrcode';import { DataMatrixGenerator } from '../../datamatrix/datamatrix';import { PDF417Generator } from '../../pdf417/pdf417';import { DotCodeGenerator } from '../../dotcode/dotcode';import { parseGs1, Gs1ParseResult } from '../../gs1/gs1-parser';import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs } from '../rendering/canvas-interface';

/**
 * Interface for a class WebMcpBarcode
 */
export interface WebMcpBarcodeModel {

}

/**
 * Interface for a class WebMcpBarcodeSettings
 */
export interface WebMcpBarcodeSettingsModel {

    /**
     * Name of the barcode for organizing registered tools
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