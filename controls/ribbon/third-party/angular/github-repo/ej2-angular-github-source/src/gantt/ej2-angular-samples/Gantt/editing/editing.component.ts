/**
 * Gantt Editing Sample
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { editingData, editingResources } from './assets/data-source';
import { ToolbarItem, EditSettingsModel } from '@syncfusion/ej2-angular-gantt';

@Component({
    selector: 'app-editing',
    templateUrl: 'editing.component.html',
    styleUrls: ['editing.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GanttEditingComponent {
     // Define an array of JSON data
     public data: object[] = editingData;
     public taskSettings: object = {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        resourceInfo: 'resources'
    };
     public editSettings: EditSettingsModel = {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true,
        mode: "Auto"
    };
     public toolbar: ToolbarItem[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'];
     public resources: object[] = editingResources;
     public labelSettings: object = {
        leftLabel: 'TaskName',
        rightLabel: 'resources'
    };
}     
 