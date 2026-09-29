/**
 * TimePicker format Sample
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';

@Component({
    selector: 'app-format',
    templateUrl: 'format.component.html',
    styleUrls: ['format.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class FormatComponent {
  public value: Date = new Date();
  public interval: number = 60;
  public customFormat : string = 'HH:mm';
  public placeholder: string = "Select a time";
}