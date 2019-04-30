import { Component } from '@angular/core';
/**
 * Validation - In-place Editor
 */
@Component({
    selector: 'app-inplaceeditor',
    templateUrl: 'validation.component.html',
    styleUrls: ['validation.component.css']
})

export class ValidationComponent {
    public model: object = { placeholder: 'Select date' };
    public rules: object = {
      Today: { required: true }
    };
}