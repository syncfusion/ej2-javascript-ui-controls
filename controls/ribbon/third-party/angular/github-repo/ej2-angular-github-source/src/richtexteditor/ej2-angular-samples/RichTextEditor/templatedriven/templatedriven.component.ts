/**
 * RTE Inline Sample
 */
import { Component, ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
    selector: 'app-template-driven',
    templateUrl: 'templatedriven.component.html',
    styleUrls: ['./templatedriven.component.css']
})

export class TemplateDrivenComponent {

    public value: string = null;
    @ViewChild('fromRTE') rteEle: RichTextEditorComponent;

    rteCreated(): void {
        this.rteEle.element.focus();
    }

    onSubmit(): void {
      alert('Form submitted successfully');
    }
}
