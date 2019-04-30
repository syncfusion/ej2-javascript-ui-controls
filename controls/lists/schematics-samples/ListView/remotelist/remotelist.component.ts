/**
 * ListView Remote Sample
 */

import { Component } from '@angular/core';
// Import DataManager related classes
import { DataManager, Query } from '@syncfusion/ej2-data';

@Component({
    selector: 'app-remote-list',
    templateUrl: 'remotelist.component.html',
    styleUrls: ['remotelist.component.css']
})

export class RemoteListComponent {

    // Initialize dataSource with the DataManager instance.
    public data: DataManager = new DataManager({
        url: '//js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
        crossDomain: true
    });

    // Initialize query with the Query instance to get specified set of data
    public query: Query = new Query().from('Products').select('ProductID,ProductName').take(10);

    // Map the appropriate columns to fields property
    public fields: Object = { id: 'ProductID', text: 'ProductName' };

    // Set header title
    public headerTitle = 'Products';
}
