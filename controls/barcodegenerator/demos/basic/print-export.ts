import { BarcodeGenerator } from "../../src/barcode/barcode";
import { BarcodeExportType } from "../../src/barcode/enum/enum";
import { QRCodeGenerator } from '../../src/qrcode/qrcode';
import { DataMatrixGenerator } from '../../src/datamatrix/datamatrix';
/**
 * Explores the types of nodes
 */

let image: any;
let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    displayText: { text: 'ABCD' },
});
barcode.appendTo('#barcode');
var button3 = document.getElementById('export1');
    button3.onclick = async function () {
        let filename: string = 'Export';
        barcode.exportImage(filename,'JPG');
        let x = await barcode.exportAsBase64Image('JPG');
        console.log(x);
        debugger;
    };

    let barcode1: QRCodeGenerator = new QRCodeGenerator({
        width: '200px', height: '150px',
        value: 'BARCODE',
        displayText: { text: 'ABCD' },
    });
    barcode1.appendTo('#barcode1');
    var button4 = document.getElementById('export2');
        button4.onclick = async function () {
            let filename: string = 'Export';
            barcode1.exportImage(filename,'JPG');
            let x = await barcode1.exportAsBase64Image('JPG');
            console.log(x);
            debugger;
        };

        let barcode2: DataMatrixGenerator = new DataMatrixGenerator({
            width: '200px', height: '150px',
            value: 'BARCODE',
            displayText: { text: 'ABCD' },
        });
        barcode2.appendTo('#barcode2');
        var button5 = document.getElementById('export3');
            button5.onclick = async function () {
                let filename: string = 'Export';
                barcode2.exportImage(filename,'JPG');
                let x = await barcode2.exportAsBase64Image('JPG');
                console.log(x);
                debugger;
            };