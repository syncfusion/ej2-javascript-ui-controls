/**
 * Explores the types of nodes
 */
import { BarcodeGenerator } from "../../src/barcode/barcode";

let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '200px', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
    displayText: {
        text: 'BARCODEBARCODE',
        margin:{top:30,bottom:30,left:30,right:30}
    },
});
barcode.appendTo('#barcode');