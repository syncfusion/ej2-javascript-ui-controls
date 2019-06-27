/**
 * Explores the types of nodes
 */
import { BarcodeGenerator } from "../../src/barcode/barcode";

let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    displayText:{text:'ABCD'},
    margin: { left: 20, right: 20, top: 20, bottom: 20 },
});
barcode.appendTo('#barcode');