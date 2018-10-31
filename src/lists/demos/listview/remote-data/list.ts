/**
 * ListView Remote Data Binding Sample
 */
import { ListView } from '../../../src/list-view/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';

interface MyWindow extends Window {
    onAsyncCheck: any;
}

declare let window: MyWindow;

let remoteListObj: ListView = new ListView({

    dataSource: new DataManager({
        url: 'http://services.odata.org/V4/Northwind/Northwind.svc',
        adaptor: new ODataV4Adaptor
    }),

    query: new Query().from('Products').select('ProductID,ProductName').take(30),

    fields: { id: 'ProductID', text: 'ProductName' },

    headerTitle: 'Products',

    height: '400px'

});

remoteListObj.appendTo('#remote-list');
