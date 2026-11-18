import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { RenderingMode, BarcodeEvent, BarcodeExportType, PDF417CompactionMode, PDF417ErrorCorrectionLevel } from '../barcode/enum/enum';import { DisplayTextModel } from '../barcode/primitives/displaytext-model';import { MarginModel } from '../barcode/primitives/margin-model';import { DisplayText } from '../barcode/primitives/displaytext';import { Margin } from '../barcode/primitives/margin';import { BarcodeRenderer } from '../barcode/rendering/renderer';import { exportAsImage } from '../barcode/utility/barcode-util';import { PDF417 } from './pdf417-util';import { PDF417EncodeResult } from './pdf417-encoder';import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PDF417Generator
 */
export interface PDF417GeneratorModel extends ComponentModel{

    /**
     * Defines the PDF417 rendering mode.
     * * SVG - Renders the barcode objects as SVG elements
     * * Canvas - Renders the barcode in a canvas
     *
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the value of the PDF417 barcode to be rendered.
     *
     * @default undefined
     */
    value?: string;

    /**
     * Defines the height of the PDF417 barcode.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the width of the PDF417 barcode.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines how the value is compacted into codewords.
     * * Auto - Selects Text, Numeric and Byte compaction per segment of the value
     * * Text - Printable ASCII characters, tab, line feed and carriage return
     * * Numeric - Digits 0-9
     * * Byte - Any character
     *
     * @default 'Auto'
     */
    compactionMode?: PDF417CompactionMode;

    /**
     * Defines the error correction level. Level0 to Level8 have the values 0 to 8, so a plain number
     * such as 2 can also be used. Level n adds 2^(n+1) error correction codewords.
     * Auto (-1) uses the level recommended by ISO/IEC 15438 for the data length: level 2 for up to
     * 40 data codewords, 3 for up to 160, 4 for up to 320 and 5 above that.
     *
     * @default PDF417ErrorCorrectionLevel.Auto
     */
    errorCorrectionLevel?: PDF417ErrorCorrectionLevel;

    /**
     * Defines the number of data columns (1-30). Set 0 to calculate it automatically.
     *
     * @default 0
     */
    columns?: number;

    /**
     * Defines the number of rows (3-90). Set 0 to calculate it automatically.
     *
     * @default 0
     */
    rows?: number;

    /**
     * Renders a Compact (truncated) PDF417 symbol, which omits the right row indicator and
     * shortens the stop pattern to save horizontal space.
     *
     * @default false
     */
    isCompact?: boolean;

    /**
     * Defines the height of each row as a multiple of the module width (the narrowest bar).
     * ISO/IEC 15438 requires at least 3. Higher values make taller rows, which are easier
     * for linear scanners to read. The symbol keeps this ratio and is centered in any extra space.
     *
     * @default 3
     */
    rowHeightRatio?: number;

    /**
     * Defines the text properties for the PDF417 barcode. The text is drawn on a single line;
     * text wider than the available width is shortened with an ellipsis.
     *
     * @default ''
     */
    displayText?: DisplayTextModel;

    /**
     * Defines the margin properties for the PDF417 barcode.
     *
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the PDF417 barcode.
     *
     * @default 'white'
     */
    backgroundColor?: string;

    /**
     * Defines the forecolor of the PDF417 barcode.
     *
     * @default 'black'
     */
    foreColor?: string;

    /**
     * Triggers when the value or a property is invalid, or the value does not fit in the symbol.
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