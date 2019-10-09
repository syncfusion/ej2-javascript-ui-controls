import { Workbook, CellModel } from './../../../../src/index';
import { defaultData } from './data';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

(window as any).load = () => {
    let cellDataBinding: Workbook = new Workbook({
        sheets: [{
            rows: [
                {
                    cells: [
                        { value: "Item Name" },
                        { value: "Quantity" },
                        { value: "Price" },
                        { value: "Amount" },
                        { value: "Stock Detail" },
                        { value: "Website" }
                    ]
                },
                {
                    cells: [
                        { value: "Casual Shoes" },
                        { value: "10" },
                        { value: "20" },
                        { value: "=B2*C2" },
                        { value: "OUT OF STOCK" },
                        { value: "Amazon" }
                    ]
                },
                {
                    cells: [
                        { value: "Sports Shoes" },
                        { value: "20" },
                        { value: "30" },
                        { value: "=B3*C3" },
                        { value: "IN STOCK" },
                        { value: "AliExpress" }
                    ]
                },
                {
                    cells: [
                        { value: "Formal Shoes" },
                        { value: "20" },
                        { value: "15" },
                        { value: "=B4*C4" },
                        { value: "IN STOCK" },
                        { value: "Amazon" }
                    ]
                },
                {
                    cells: [
                        { value: "Sandals & Floaters" },
                        { value: "15" },
                        { value: "20" },
                        { value: "=B5*C5" },
                        { value: "OUT OF STOCK" },
                        { value: "Alibaba" }
                    ]
                },
                {
                    cells: [
                        { value: "Flip-Flops & Slippers" },
                        { value: "30" },
                        { value: "10" },
                        { value: "=B6*C6" },
                        { value: "IN STOCK" },
                        { value: "Ebay" }
                    ]
                },
                {
                    cells: [
                        { value: "Running Shoes" },
                        { value: "20" },
                        { value: "10" },
                        { value: "=B8*C8" },
                        { value: "IN STOCK" },
                        { value: "AliExpress" }
                    ]
                },
                {
                    cells: [
                        { value: "Cricket Shoes" },
                        { value: "41" },
                        { value: "30" },
                        { value: "=B10*C10" },
                        { value: "IN STOCK" },
                        { value: "Ebay" }
                    ]
                },
                {
                    cells: [
                        { value: "Total Amount", index: 2 },
                        { value: "=Sum(D2:D11)" }
                    ]
                }
            ]
        }]
    });
    let jsonDataBinding: Workbook = new Workbook({
        sheets: [{ rangeSettings: [{ dataSource: defaultData, startCell: 'A10' }] }]
    });
    cellDataBinding.getData('Sheet1!A1:B2').then((value: Map<string, CellModel>) => {
        debugger
    }).catch((reason: string) => {
        debugger
    });
    jsonDataBinding.getData('Sheet1!A10:H20').then((value: Map<string, CellModel>) => {
        debugger
    }).catch((reason: string) => {
        debugger
    });

    let remoteData: DataManager = new DataManager({
        url: 'https://ej2services.syncfusion.com/production/web-services/api/Orders',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });

    let remoteDataBinding: Workbook = new Workbook({
        sheets: [{ rangeSettings: [{ dataSource: remoteData, startCell: 'A1' }] }]
    });
    remoteDataBinding.getData('Sheet1!A1:B2').then((value: Map<string, CellModel>) => {
        debugger
    }).catch((reason: string) => {
        debugger
    });

    
}
