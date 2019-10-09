import { BarcodeGenerator } from "../../src/barcode/barcode";

/**
 * Explores the types of nodes
 */


let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    backgroundColor: 'red',
    displayText: { text: 'ABCD' },
});
barcode.appendTo('#barcode');
var button2 = document.getElementById('change');
button2.onclick = function () {
    let value = (document.getElementById('offsetx') as HTMLSelectElement).value
    let barcodeinstance = barcode;
    barcodeinstance.value = value;
    barcode.dataBind()
};
