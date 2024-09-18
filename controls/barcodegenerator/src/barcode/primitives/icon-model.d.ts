import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class QRCodeLogo
 */
export interface QRCodeLogoModel {

    /**
     * Specifies the source for the logo image. This can be a path to a local file, a URL to a remote file, or a Base64-encoded image string. The logo is placed at the center of the QR code.
     *
     * @default ''
     */
    imageSource?: string;

    /**
     * Sets the width of the logo in pixels. If not specified, the logo's width will default to 30% of the QR code's dimensions. If the specified width exceeds 30% of the QR code's dimensions, the width will be restricted to 30%.
     * Depending on the size of the overlay, you might need to raise the errorCorrectionLevel to "High".
     *
     * @default 0
     */
    width?: number;

    /**
     * Sets the height of the logo in pixels. If not specified, the logo's height will default to 30% of the QR code's dimensions. If the specified height exceeds 30% of the QR code's dimensions, the height will be restricted to 30%.
     * Depending on the size of the overlay, you might need to raise the errorCorrectionLevel to "High".
     *
     * @default 0
     */
    height?: number;

}