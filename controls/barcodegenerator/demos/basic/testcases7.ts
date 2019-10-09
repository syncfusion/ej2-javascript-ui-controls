import { BarcodeGenerator } from "../../src/barcode/barcode";

/**
 * Explores the types of nodes
 */


let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    displayText: {
        text: 'BARCODEBARCODEBARCODEBARCODE',
    },
});
barcode.appendTo('#barcode');