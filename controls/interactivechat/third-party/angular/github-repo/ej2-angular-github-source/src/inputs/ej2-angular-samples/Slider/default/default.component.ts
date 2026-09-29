import { Component } from '@angular/core';
import { TooltipDataModel } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-default-slider',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultSliderComponent {
  tooltip: TooltipDataModel = { placement: 'Before', showOn: 'Focus', isVisible: true };
}
