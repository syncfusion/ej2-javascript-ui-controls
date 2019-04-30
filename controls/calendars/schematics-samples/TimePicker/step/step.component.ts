/**
 * TimePicker step range Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-step',
    templateUrl: 'step.component.html',
    styleUrls: ['step.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class StepComponent {
    public step: number = 35;
    public placeholder: string = "Select a time";
}