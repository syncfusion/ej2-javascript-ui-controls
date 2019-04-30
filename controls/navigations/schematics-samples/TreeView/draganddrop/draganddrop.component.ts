import { Component } from '@angular/core';

@Component({
    selector: 'app-draganddrop',
    templateUrl: 'draganddrop.component.html',
    styleUrls: ['draganddrop.component.css']
})
export class DraganddropController {
    public productTeam: Object[] = [
        {
            id: 't1', name: 'ASP.NET MVC Team', expanded: true,
            child: [
                { id: 't2', pid: 't1', name: 'Smith' },
                { id: 't3', pid: 't1', name: 'Johnson' },
                { id: 't4', pid: 't1', name: 'Anderson' },
            ]
        },
        {
            id: 't5', name: 'Windows Team', expanded: true,
            child: [
                { id: 't6', pid: 't5', name: 'Clark' },
                { id: 't7', pid: 't5', name: 'Wright' },
                { id: 't8', pid: 't5', name: 'Lopez' },
            ]
        }
    ];
    public field: Object = { dataSource: this.productTeam, id: 'id', text: 'name', child: 'child' };
    // Allow drag and drop
    public allowDragAndDrop: boolean = true;
}