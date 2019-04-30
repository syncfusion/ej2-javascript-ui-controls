import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { HeatMapComponent, ITooltipEventArgs } from '@syncfusion/ej2-angular-heatmap';

/**
 * HeatMap default sample
 */
@Component({
    selector: 'app-root',
    templateUrl: 'default.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HeatmapDefaultComponent {
    @ViewChild('heatmap')
    public heatmap: HeatMapComponent;
    titleSettings: Object = {
        text: 'Female Participation Rate in Labor Force for the Countries',
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal',
            fontFamily: 'Segoe UI'
        }
    };
    xAxis: Object = {
        labels: ['Singapore', 'Spain', 'Australia', 'Germany', 'Belgium', 'USA', 'France', 'UK'],
    };
    yAxis: Object = {
        labels: ['1995', '2000', '2005', '2010', '2015']
    };
    public cellSettings: Object = {
        border: {
            width: 1
        },
        showLabel: false,
        tileType: 'Bubble',
        bubbleType: 'Size'
    };
    dataSource: Object = [[40, 41, 52, 57, 61],
    [37, 40, 46, 52, 53],
    [54, 55, 57, 59, 60],
    [47, 49, 51, 53, 55],
    [41, 44, 46, 48, 48],
    [59, 60, 60, 59, 57],
    [48, 49, 50, 51, 52],
    [52, 54, 56, 56, 57]
    ];
    public paletteSettings: Object = {
        palette: [{ value: 35, color: '#50A3B1' },
        { value: 45, color: '#78D1BD' },
        { value: 55, color: '#CAE8B4' },
        { value: 65, color: '#EDF8B6' },
        { value: 78, color: '#FFFFDA' }
        ],
    };
    public legendSettings: Object = {
        visible: true,
    };
    public tooltipRender(args: ITooltipEventArgs): void {
        args.content = [args.xLabel + ' | ' + args.yLabel + ' : ' + args.value + ' %'];
    };
    change() {
        let bubbleType: any = (document.getElementById('bubbleType') as HTMLSelectElement).value;
        this.heatmap.cellSettings.bubbleType = bubbleType;
    }
}