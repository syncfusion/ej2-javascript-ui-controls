import { Component, ViewEncapsulation } from '@angular/core';
import { ChartTheme, IRangeLoadedEventArgs, DateTime, AreaSeries, RangeTooltip } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';
import { bitCoinData } from './assets/default-data';

/**
 * Default appearance of the range navigator
 */

let selectedTheme: string = location.hash.split('/')[1];
selectedTheme = selectedTheme ? selectedTheme : 'Material';
let theme: ChartTheme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
let themes: string[] = ['Material', 'Fabric', 'Bootstrap', 'Highcontrast']
let borderColor: string[] = ['#00bdae', '#4472c4', '#a16ee5', '#79ECE4'];
let regionColor: string[] = ['rgba(0, 189, 174, 0.3)', 'rgba(68, 114, 196, 0.3)',
    'rgba(161, 110, 229, 0.3)', 'rgba(121, 236, 228, 0.3)'];

@Component({
    selector: 'control-content',
    templateUrl: 'rangenavigator.component.html',
    styleUrls: ['rangenavigator.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DefaultComponent {

    public valueType: string = 'DateTime';

    public labelFormat: string = 'MMM-yy';

    public value: Date[] = [new Date('2017-09-01'), new Date('2018-02-01')];

    public dataSource: Object[] = bitCoinData;

    public width: string = Browser.isDevice ? '100%' : '80%';

    public theme: ChartTheme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));

    public navigatorStyleSettings: Object = {
        unselectedRegionColor: 'transparent',
        selectedRegionColor: regionColor[themes.indexOf(theme)]
    };

    public load(args: IRangeLoadedEventArgs) {
    args.rangeNavigator.rangeTooltipModule = new RangeTooltip(args.rangeNavigator);
    };

    public tooltip: Object = { enable: true, format: 'MM/dd/yyyy' , displayMode: 'Always' };

    public fill: string = 'url(#' + theme.toLowerCase() + '-gradient-chart)';

    public border: Object = { width: 2, color: borderColor[themes.indexOf(theme)] };
}
