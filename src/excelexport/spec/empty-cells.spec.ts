import { Workbook } from './../src/workbook';
import { Utils } from './../spec/utils.spec';
import './../node_modules/es6-promise/dist/es6-promise';

describe('ExcelCreation', () => {
    // afterEach(function () {
    //     sleep(3000);
    // });
    // function sleep(millSecs: any) {
    //     let date: any = new Date();
    //     let curDate: any = null;
    //     do { curDate = new Date(); }
    //     while (curDate - date < millSecs);
    // }
    it('Workbook-empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets :[{}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Workbook-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('Columns-empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets :[{columns :[{index : 1}]}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Columns-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('freeze-empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets :[{ freeze : {}}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'freeze-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('rows-empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets :[ { rows : [ {index : 1}]}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'rows-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('cells-empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets :[ { rows : [ {index : 1, cells :[{ index : 1}]}]}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'cells-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('Style-empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets :[ { rows : [ {index : 1, cells :[{ index : 1 , style : {}}]}]}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Style-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('GlobalStyle-empty', (done) => {
        let book: Workbook = new Workbook({
            styles :[{
                name : 'check', fontName : 'Arial'

            }],
            worksheets :[ { rows : [ {index : 1, cells :[{ index : 1 , style : { name : 'check'}}]}]}]
        },'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GlobalStyle-empty.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
});