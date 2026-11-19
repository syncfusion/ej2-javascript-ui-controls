import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { RenderingMode, BarcodeType, BarcodeEvent, BarcodeExportType, BearerBarType} from './enum/enum';import { WebMcpBarcode, WebMcpBarcodeSettings } from './integrations/webmcp-adapter';import { WebMcpBarcodeSettingsModel } from './integrations/webmcp-adapter-model';import { BarcodeRenderer } from './rendering/renderer';import { BarcodeCanvasRenderer } from './rendering/canvas-renderer';import { Code128B } from './one-dimension/code128B';import { Code128C } from './one-dimension/code128C';import { DisplayTextModel } from './primitives/displaytext-model';import { MarginModel } from './primitives/margin-model';import { DisplayText } from './primitives/displaytext';import { Margin } from './primitives/margin';import { Code39 } from './one-dimension/code39';import { CodaBar } from './one-dimension/codabar';import { Code128A } from './one-dimension/code128A';import { Code128 } from './one-dimension/code128';import { GS1Code128 } from './one-dimension/gs1-code128';import { ITF14 } from './one-dimension/itf14';import { GS1DataBar } from './one-dimension/gs1-databar';import { GS1DataBarExpanded } from './one-dimension/gs1-databar-expanded';import { Ean8 } from './one-dimension/ean8';import { Ean13 } from './one-dimension/ean13';import { UpcE } from './one-dimension/upcE';import { UpcA } from './one-dimension/upcA';import { Code11 } from './one-dimension/code11';import { Code93 } from './one-dimension/code93';import { Code93Extension } from './one-dimension/code93Extension';import { ValidateEvent, WebMcpToolExecuteEventArgs, WebMcpTool } from './rendering/canvas-interface';import { Code32 } from './one-dimension/code32';import { Code39Extension } from './one-dimension/code39Extension';import { removeChildElements, exportAsImage } from './utility/barcode-util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class BarcodeGenerator
 */
export interface BarcodeGeneratorModel extends ComponentModel{

    /**
     * Defines the width of the barcode model.
     * ```html
     * <div id='barcode'/>
     * ```
     * ```typescript
     * let barcode: Barcode = new Barcode({
     * width:'1000px', height:'500px' });
     * barcode.appendTo('#barcode');
     * ```
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the height of the barcode model.
     * ```html
     * <div id='barcode'/>
     * ```
     * ```typescript
     * let barcode: Barcode = new Barcode({
     * height:'1000px', height:'500px' });
     * barcode.appendTo('#barcode');
     * ```
     *
     * @default '100'
     *
     */
    height?: string | number;

    /**
     * Defines the barcode rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     *
     * @default 'SVG'
     *
     */
    mode?: RenderingMode;

    /**
     * Defines the type of barcode to be rendered.
     *
     * @default 'Code128'
     *
     */
    type?: BarcodeType;

    /**
     * Defines the value of the barcode to be rendered.
     *
     * @default undefined
     *
     */
    value?: string;

    /**
     * Defines the checksum for the barcode.
     *
     * @default 'true'
     *
     */
    enableCheckSum?: boolean;

    /**
     * Defines the text properties for the barcode.
     *
     * @default ''
     *
     */
    displayText?: DisplayTextModel;

    /**
     * Defines the margin properties for the barcode.
     *
     * @default ''
     *
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the barcode.
     *
     * @default 'white'
     *
     */
    backgroundColor?: string;

    /**
     * Defines the forecolor of the barcode.
     *
     * @default 'black'
     *
     */
    foreColor?: string;

    /**
     * Defines the bearer bars for the ITF14 type. Other types ignore it.
     *
     * @default 'Frame'
     */
    bearerBar?: BearerBarType;

    /**
     * Defines the bearer bar thickness, as a multiple of the narrow bar width,
     * from 1 to 10, for the ITF14 type. Other types ignore it.
     *
     * @default 5
     */
    bearerBarWidth?: number;

    /**
     * Defines the number of segments in each row of a GS1DataBarExpandedStacked barcode:
     * an even number from 2 to 20. Other types ignore it.
     *
     * @default 4
     */
    segmentsPerRow?: number;

    /**
     * Triggers if you enter any invalid character.
     *
     * @event
     */
    invalid?: EmitType<Object>;

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