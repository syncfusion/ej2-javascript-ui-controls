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
        text: 'U.S. Government Energy Consumption By Agency (Trillion Btu)',
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal'
        }
    };
    xAxis: Object = {
        labels: ['2005', '2006', '2007', '2008', '2009', '2010',
            '2011', '2012', '2013', '2014', '2015'],
        labelRotation: 45,
        labelIntersectAction: 'None',
    };
    yAxis: Object = {
        labels: ['Agriculture', 'Energy', 'Administration', 'Health', 'Interior',
            'Justice', 'NASA', 'Transportation']
    };
    dataSource: Object = [
        [17.2, null, 18.4, 9.6, 8.6, null, 10.3, null],
        [15.8, 29.9, 15.2, null, 18.1, null, 10.2, 14.6],
        [17.8, null, 19.1, null, 7.5, null, 12.6, 5.6],
        [7.3, 20.1, null, 20.3, 6.1, 9.0, null, 7.7],
        [null, 30.5, 19.6, null, 7.9, null, 5.2, 14.3],
        [5.8, 31.7, 17.8, 10.4, null, 15.7, null, 7.7],
        [11.3, 29.1, null, 11.5, 6.3, 12.9, 10.1, null],
        [13.7, null, 15.3, null, 7.7, 16.1, 18.9, 12.6],
        [null, 29.9, 16.4, 14.5, 5.2, null, 18.7, 7.3],
        [16.3, 27.4, 27.0, null, 16.2, null, 8.3, 15.2],
        [7.2, 20.1, null, 9.0, null, null, 8.4, null]];
    public paletteSettings: Object = {
        palette: [
            { value: 4.3, color: '#FFFFDA' },
            { value: 7, color: '#EDF8B6' },
            { value: 9, color: '#CAE8B4' },
            { value: 15, color: '#78D1BD' },
            { value: 18, color: '#36BCC6' },
            { value: 25, color: '#208FC6' },
            { value: 30, color: '#253494' },
            { value: 32, color: '#081D58' }
        ],
        type: 'Fixed'
    };
    public cellSettings: Object = {
        border: { width: 0 },
        showLabel: false
    };
    public legendSettings: Object = {
        position: 'Bottom',
        width: '400px',
        enableSmartLegend: true
    };

    change() {
        let paletteType: any = (document.getElementById('paletteType') as HTMLSelectElement).value;
        this.heatmap.paletteSettings.type = paletteType;
    }
}
