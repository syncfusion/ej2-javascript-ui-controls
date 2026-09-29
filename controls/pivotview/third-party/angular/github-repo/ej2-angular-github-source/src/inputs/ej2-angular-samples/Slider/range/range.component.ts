import { Component } from '@angular/core';
import { TooltipDataModel } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.css']
})
export class RangeSliderComponent {
  tooltip: TooltipDataModel = { placement: 'Before', showOn: 'Focus', isVisible: true };
  value = [20, 80];
}
