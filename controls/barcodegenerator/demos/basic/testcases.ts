import { BarcodeGenerator } from "../../src/barcode/barcode";

/**
 * Explores the types of nodes
 */


let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    backgroundColor:'red',
    displayText:{text:'ABCD'},
    foreColor: 'green',
    margin: { left: 20, right: 20, top: 20, bottom: 20 },
});
barcode.appendTo('#barcode');