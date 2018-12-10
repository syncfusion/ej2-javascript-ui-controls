/**
 * RTE React form Sample
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-react-form',
    templateUrl: 'reactform.component.html',
    styleUrls: ['./reactform.component.css']
})

export class ReactFormComponent implements OnInit {
    rteForm: FormGroup;
    @ViewChild('fromRTE') rteEle: RichTextEditorComponent;

    constructor(private fb: FormBuilder) { }
    ngOnInit(): void {
        this.rteForm = new FormGroup({
            'name': new FormControl(null, Validators.required)
        });
    }
    rteCreated(): void {
        this.rteEle.element.focus();
    }
    onSubmit(): void {
        alert('Form submitted successfully');
    }
}
