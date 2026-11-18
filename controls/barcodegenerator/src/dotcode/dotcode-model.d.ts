import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { RenderingMode, BarcodeEvent, BarcodeExportType } from '../barcode/enum/enum';import { DisplayTextModel } from '../barcode/primitives/displaytext-model';import { MarginModel } from '../barcode/primitives/margin-model';import { DisplayText } from '../barcode/primitives/displaytext';import { Margin } from '../barcode/primitives/margin';import { BarcodeRenderer } from '../barcode/rendering/renderer';import { exportAsImage } from '../barcode/utility/barcode-util';import { DotCode } from './dotcode-util';import { Gs1DotCode } from './gs1-dotcode';import { DotCodeEncodeResult } from './dotcode-encoder';import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DotCodeGenerator
 */
export interface DotCodeGeneratorModel extends ComponentModel{

    /**
     * Defines the DotCode rendering mode.
     * * SVG - Renders the DotCode as SVG elements
     * * Canvas - Renders the DotCode on a canvas
     *
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the value to be rendered as a DotCode symbol.
     *
     * @default undefined
     */
    value?: string;

    /**
     * Specifies whether the value is encoded as GS1 DotCode. When true, the value is
     * validated as GS1 data and encoded with FNC1.
     *
     * @default false
     */
    enableGS1?: boolean;

    /**
     * Defines the number of columns in the dot grid: 0 to choose the size automatically
     * from the width and height, or 5 or more. Rows are calculated so that rows plus
     * columns is odd, as the standard requires.
     *
     * @default 0
     */
    columns?: number;

    /**
     * Defines the height of the DotCode.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the width of the DotCode.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the text properties for the DotCode. The text is drawn on a single line;
     * text wider than the available width is shortened with an ellipsis.
     *
     * @default ''
     */
    displayText?: DisplayTextModel;

    /**
     * Defines the margin properties for the DotCode. The quiet zone of three dot
     * spacings required by the standard is drawn inside it, separately.
     *
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the DotCode.
     *
     * @default 'white'
     */
    backgroundColor?: string;

    /**
     * Defines the color of the dots.
     *
     * @default 'black'
     */
    foreColor?: string;

    /**
     * Triggers when the value or a property is invalid, or the value does not fit.
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