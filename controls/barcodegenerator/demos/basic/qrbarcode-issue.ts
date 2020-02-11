/**
 * Explores the types of nodes
 */
import { QRCodeGenerator } from "../../src/qrcode/qrcode";
import { ErrorCorrectionLevel } from "../../src/barcode/enum/enum";


let barcode: QRCodeGenerator = new QRCodeGenerator({
    width: '200px', height: '150px',
    value: "ELEM-004:TITRE-TEST",
    xDimension: 3,
    errorCorrectionLevel: ErrorCorrectionLevel.Low,
     mode: 'SVG'
});
barcode.appendTo('#barcode');

document.getElementById('updateBarcode').onclick = function(){
    barcode.value = (document.getElementById('ChangedContent') as HTMLInputElement).value;
    barcode.dataBind();
}