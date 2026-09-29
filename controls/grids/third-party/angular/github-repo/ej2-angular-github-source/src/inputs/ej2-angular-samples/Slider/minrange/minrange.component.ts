import { Component } from '@angular/core';
import { TooltipDataModel } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-minrange-slider',
  templateUrl: './minrange.component.html',
  styleUrls: ['./minrange.component.css']
})
export class MinRangeSliderComponent {
  tooltip: TooltipDataModel = { placement: 'Before', showOn: 'Focus', isVisible: true };
}
