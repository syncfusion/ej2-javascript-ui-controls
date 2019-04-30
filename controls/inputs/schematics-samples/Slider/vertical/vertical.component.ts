import { Component } from '@angular/core';
import { TooltipDataModel } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-vertical-slider',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalSliderComponent {
  tooltip: TooltipDataModel = { placement: 'Before', showOn: 'Focus', isVisible: true };
}
