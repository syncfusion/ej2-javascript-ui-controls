import { Component } from '@angular/core';
import { LimitDataModel, TooltipDataModel } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-limits-slider',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.css']
})
export class LimitsSliderComponent {
  tooltip: TooltipDataModel = { placement: 'Before', showOn: 'Focus', isVisible: true };
  limits: LimitDataModel = { enabled: true, minStart: 10, minEnd: 40, maxStart: 60, maxEnd: 90 };
  value = [20, 80];
}
