import { BarcodeGenerator } from "../../src/barcode/barcode";

/**
 * Explores the types of nodes
 */


let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    margin: { left: 30, right: 30, top: 30, bottom: 30 },
});
barcode.appendTo('#barcode');