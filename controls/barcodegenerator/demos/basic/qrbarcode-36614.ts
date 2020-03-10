/**
 * Explores the types of nodes
 */
import { QRCodeGenerator } from "../../src/qrcode/qrcode";
import { QRCodeVersion, ErrorCorrectionLevel,DataMatrixSize } from "../../src/barcode/enum/enum";
import { DataMatrixGenerator } from "../../src/datamatrix/datamatrix";



let barcode: QRCodeGenerator = new QRCodeGenerator({
    width: '300px',
    height: '200px',
    displayText: { visibility: true, size: 9,  text: "service--01|fragment--0001|Login|11/12/2020|test"},
    mode: 'Canvas',
    value: "service--01|fragment--0001|Login|11/01/2020",
});
barcode.appendTo('#barcode');