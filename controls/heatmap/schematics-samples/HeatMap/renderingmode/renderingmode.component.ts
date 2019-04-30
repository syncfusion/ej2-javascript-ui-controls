import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { HeatMapComponent } from '@syncfusion/ej2-angular-heatmap';

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
        text: 'Net Migration Rate of Northern Europe From 1965 to 2015',
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal'
        }
    };
    xAxis: Object = {
        labels: ['Channel Isl', 'Denmark', 'Estonia', 'Finland',
            'Iceland', 'Ireland', 'Latvia', 'Lithuania', 'Norway', 'Sweden', 'UK'],
        labelRotation: -90,
        labelIntersectAction: 'None',
        opposedPosition: true
    };
    yAxis: Object = {
        labels: ['1965-1970', '1970-1975', '1975-1980', '1980-1985', '1985-1990',
            '1990-1995', '1995-2000', '2000-2005', '2005-2010', '2010-2015']
    };
    dataSource: Object = [
        [7.6, 5.9, -3.7, 2.2, 8.9, 6.0, 14.2, 6.1, -3.2, 4.2],
        [3.9, 1.9, 2.6, 14.2, 2.3, 3.5, -2.8, 2.7, 4.2, 3.9],
        [9.2, 3.4, 5.2, 14.5, 1.0, -5.9, -0.2, -1.7, -3.3, 4.6],
        [-2.3, 7.2, -3.2, 15.1, 2.7, 2.9, 3.9, -1.2, 8.2, 6.0],
        [-1.8, 5.0, -3.5, 3.2, 2.5, -1.8, 14.7, 3.0, 8.8, -3.3],
        [-2.5, 3.4, 4.2, -1.9, 7.5, 4.6, 2.4, 10.9, 8.0, -3.0],
        [7.1, 2.5, 7.9, 7.4, 15.2, 7.0, 5.8, -2.3, -3.9, -4.1],
        [4.7, 3.3, 14.3, 5.5, 3.0, -3.5, -5.3, -6.8, -2.3, 5.7],
        [2.2, 13.8, 3.0, -2.2, 3.8, 14.2, 3.7, 4.0, -4.9, 7.8],
        [4.3, 15.3, 3.1, 1.7, 4.2, -3.6, 2.3, -3.2, 10.7, 2.3],
        [-2.3, 3.4, 6.1, -1.3, 13.3, 3.7, -1.7, 8.2, 7.6, 4.1]
    ];
    public paletteSettings: Object = {
        palette: [{ color: '#C06C84' },
        { color: '#355C7D' }
        ],
    };
    renderingMode: string = 'SVG';
    public cellSettings: Object = {
        border: {
            width: 0
        },
        showLabel: false,
        format: '{value} %'
    };
    public legendSettings: Object = {
        position: 'Bottom',
        width: '200px'
    };
    change() {
        let renderingMode: any = (document.getElementById('renderingMode') as HTMLSelectElement).value;
        this.heatmap.renderingMode = renderingMode;
    }
}