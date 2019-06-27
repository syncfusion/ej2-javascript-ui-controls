/**
 * Explores the types of nodes
 */
import { QRCodeGenerator } from "../../src/qrcode/qrcode";
import { QRCodeVersion, ErrorCorrectionLevel,DataMatrixSize } from "../../src/barcode/enum/enum";
import { DataMatrixGenerator } from "../../src/datamatrix/datamatrix";



let barcode: QRCodeGenerator = new QRCodeGenerator({
    width: '200px', height: '150px',
    value: "syncfusion",
    xDimension: 3,
    errorCorrectionLevel: ErrorCorrectionLevel.Low,
     mode: 'SVG'
});
barcode.appendTo('#barcode');