/**
 * Explores the types of nodes
 */
import { BarcodeGenerator } from "../../src/barcode/barcode";

let barcode: BarcodeGenerator = new BarcodeGenerator({
    width: '100%', height: '150px',
    type: 'Code39',
    value: 'BARCODE',
 });
barcode.appendTo('#barcode');