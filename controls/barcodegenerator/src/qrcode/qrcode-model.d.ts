import { removeChildElements, refreshCanvasBarcode, exportAsImage } from '../barcode/utility/barcode-util';import { Complex, Property, Component, INotifyPropertyChanged, L10n, Event, EmitType, ModuleDeclaration } from '@syncfusion/ej2-base';import { ErrorCorrectionLevel, QRCodeVersion, RenderingMode, BarcodeEvent, BarcodeExportType } from '../barcode/enum/enum';import { DisplayTextModel } from '../barcode/primitives/displaytext-model';import { MarginModel } from '../barcode/primitives/margin-model';import { DisplayText } from '../barcode/primitives/displaytext';import { Margin } from '../barcode/primitives/margin';import { BarcodeRenderer } from '../barcode/rendering/renderer';import { QRCode } from './qr-code-util';import { Gs1QRCode } from './gs1-qr-code';import { ValidateEvent } from '../barcode';import { QRCodeLogo } from '../barcode/primitives/icon';import { QRCodeLogoModel } from '../barcode/primitives/icon-model';import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class QRCodeGenerator
 */
export interface QRCodeGeneratorModel extends ComponentModel{

    /**
     * Defines the height of the QR code model.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Specifies the logo overlay configuration for the QR code.
     *
     * @default ''
     */
    logo?: QRCodeLogoModel;

    /**
     * Defines the width of the QR code model.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the QR code rendering mode.
     *
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     *
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the xDimension of the QR code model.
     *
     */
    xDimension?: number;

    /**
     * Defines the error correction level of the QR code.
     *
     * @aspDefaultValueIgnore
     * @aspNumberEnum
     * @default undefined
     */
    errorCorrectionLevel?: ErrorCorrectionLevel;

    /**
     * Defines the margin properties for the QR code.
     *
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the QR code.
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
     * Defines the forecolor of the QR code.
     *
     * @default 'black'
     */
    foreColor?: string;

    /**
     * Defines the text properties for the QR code.
     *
     * @default ''
     */
    displayText?: DisplayTextModel;

    /**
     * * Defines the version of the QR code.
     *
     * @aspDefaultValueIgnore
     * @aspNumberEnum
     * @default undefined
     */
    version?: QRCodeVersion;

    /**
     * Specifies whether the value is encoded as a GS1 QR Code. When true, the value is
     * GS1 data, bracketed or raw; it is validated and encoded with FNC1.
     *
     * @default false
     */
    enableGS1?: boolean;

    /**
     * Defines the type of barcode to be rendered.
     *
     * @default undefined
     */
    value?: string;

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