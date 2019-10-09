import { Component } from '@angular/core';

@Component({
    selector: 'app-nodeediting',
    templateUrl: 'nodeediting.component.html',
    styleUrls: ['nodeediting.component.css']
})
export class NodeeditingController {
    // Hierarchical data source for TreeView component
    public hierarchicalData: Object[] = [
        {
            id: 1, name: 'Discover Music', expanded: true,
            child: [
                { id: 2, name: 'Hot Singles' },
                { id: 3, name: 'Rising Artists' },
                { id: 4, name: 'Live Music' }
            ]
        },
        {
            id: 7, name: 'Sales and Events',
            child: [
                { id: 8, name: '100 Albums - $5 Each' },
                { id: 9, name: 'Hip-Hop and R&B Sale' },
                { id: 10, name: 'CD Deals' }
            ]
        },
        {
            id: 11, name: 'Categories',
            child: [
                { id: 12, name: 'Songs' },
                { id: 13, name: 'Bestselling Albums' },
                { id: 14, name: 'New Releases' },
                { id: 15, name: 'Bestselling Songs' }
            ]
        },
        {
            id: 16, name: 'MP3 Albums',
            child: [
                { id: 17, name: 'Rock' },
                { id: 18, name: 'Gospel' },
                { id: 19, name: 'Latin Music' },
                { id: 20, name: 'Jazz' }
            ]
        },
        {
            id: 21, name: 'More in Music',
            child: [
                { id: 22, name: 'Music Trade-In' },
                { id: 23, name: 'Redeem a Gift Card' },
                { id: 24, name: 'Band T-Shirts' }
            ]
        }
    ];
    public field: Object = { dataSource: this.hierarchicalData, id: 'id', text: 'name', child: 'child' };
    // Enable TreeView editing option
    public allowEditing: boolean = true;
}