/**
 * AutoComplete Reactive Form Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
    selector: 'control-content',
    templateUrl: 'reactive-form.component.html',
    styleUrls: ['reactive-form.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReactiveFormAutoCompleteComponent {
    public autoreactiveskillset: string[] = [
        'ASP.NET', 'ActionScript', 'Basic',
        'C++' , 'C#' , 'dBase' , 'Delphi' ,
        'ESPOL' , 'F#' , 'FoxPro' , 'Java',
        'J#' , 'Lisp' , 'Logo' , 'PHP'
    ];
    public autoreactiveplaceholder: String = 'Select book';
    skillForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.createForm();
    }
    createForm() : void {
        this.skillForm = this.fb.group({
            skillname: ['', Validators.required]
        });
    }
    onreset(element: MouseEvent) : void {
        let parentNode: NodeListOf<HTMLElement> = document.getElementsByClassName('box-form')[0].querySelectorAll('.e-float-text');
        for (let i: number = 0; i < parentNode.length; i++) {
            parentNode[i].classList.remove('e-label-top');
            parentNode[i].classList.add('e-label-bottom');
        }
    }
}
