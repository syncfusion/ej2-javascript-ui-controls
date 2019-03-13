import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToolbarService, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
import { defaultDocument, WEB_API_ACTION } from './assets/data';

/**
 * Document Editor Component
 */
@Component({
    selector: 'app-default',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService],
})
export class DocEditorComponent {
    public hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
    @ViewChild('documentEditorContainerInstance')
    public documentEditorContainerInstance: DocumentEditorContainerComponent;

    render(): void {
        this.documentEditorContainerInstance.locale = 'en-US';
        this.documentEditorContainerInstance.serviceUrl = this.hostUrl + WEB_API_ACTION;
        this.documentEditorContainerInstance.documentEditor.open(JSON.stringify(defaultDocument));
    }
}
