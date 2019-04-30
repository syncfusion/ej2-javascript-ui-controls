import { Component } from '@angular/core';
import { TooltipDataModel, TicksDataModel } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-ticks-slider',
  templateUrl: './ticks.component.html',
  styleUrls: ['./ticks.component.css']
})
export class TicksSliderComponent {
  tooltip: TooltipDataModel = { placement: 'Before', showOn: 'Focus', isVisible: true };
  value = [20, 80];
  ticks: TicksDataModel = {
    placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true
  };
}
