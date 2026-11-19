import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { RenderingMode, BarcodeEvent, DataMatrixEncoding, DataMatrixSize, BarcodeExportType } from '../barcode/enum/enum';import { ValidateEvent } from '../barcode/rendering/canvas-interface';import { DisplayTextModel } from '../barcode/primitives/displaytext-model';import { MarginModel } from '../barcode/primitives/margin-model';import { DisplayText } from '../barcode/primitives/displaytext';import { Margin } from '../barcode/primitives/margin';import { BarcodeRenderer } from '../barcode/rendering/renderer';import { removeChildElements, refreshCanvasBarcode, exportAsImage } from '../barcode/utility/barcode-util';import { DataMatrix } from './datamatrix-util';import { Gs1DataMatrix } from './gs1-datamatrix';import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DataMatrixGenerator
 */
export interface DataMatrixGeneratorModel extends ComponentModel{

    /**
     * Defines encoding type of the DataMatrix.
     *
     * @default 'Auto'
     */
    encoding?: DataMatrixEncoding;

    /**
     * Defines encoding type of the DataMatrix.
     *
     * @default 'Auto'
     */
    size?: DataMatrixSize;

    /**
     * Defines the DataMatrix rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     *
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the value of the DataMatrix to be rendered.
     *
     * @default undefined
     */
    value?: string;

    /**
     * Defines the height of the DataMatrix.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the width of the DataMatrix.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the text properties for the DataMatrix.
     *
     * @default ''
     */
    displayText?: DisplayTextModel;

    /**
     * Defines the margin properties for the DataMatrix.
     *
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the DataMatrix.
     *
     * @default 'white'
     */
    backgroundColor?: string;

    /**
     * Triggers if you enter any invalid character.
     *
     * @event
     */
    invalid?: EmitType<Object>;

    /**
     * Defines the forecolor of the DataMatrix.
     *
     * @default 'black'
     */
    foreColor?: string;

    /**
     * Defines the xDimension of the DataMatrix.
     */
    xDimension?: number;

    /**
     * Specifies whether the value is encoded as a GS1 DataMatrix. When true, the value is
     * GS1 data, bracketed or raw; it is validated and encoded with FNC1. Base256 encoding
     * cannot be used.
     *
     * @default false
     */
    enableGS1?: boolean;

    /**
     * Specifies whether the WebMCP integration is enabled in the component.
     * When set to `true`, the component provides a set of tools with schemas and execute functions
     * that allow AI models to perform actions within the component context.
     *
     * @default false
     */
    enableWebMcp?: boolean;

    /**
     * Configures WebMCP tool registration and exposure settings.
     * When set, tools are automatically registered with the provided configuration.
     *
     * @default undefined
     */
    webMcpSettings?: WebMcpBarcodeSettingsModel;

    /**
     * Triggers before a WebMCP tool execution begins.
     * Set `args.cancel` to `true` to prevent the tool from running, or `args.showConfirmationDialog`
     * to ask the user for confirmation first.
     *
     * @event
     */
    beforeWebMcpToolExecute?: EmitType<WebMcpToolExecuteEventArgs>;

}