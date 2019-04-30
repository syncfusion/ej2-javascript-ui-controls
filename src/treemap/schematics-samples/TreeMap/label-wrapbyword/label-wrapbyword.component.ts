//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { TreeMap, LabelAlignment, TreeMapTooltip, TreeMapLegend } from '@syncfusion/ej2-angular-treemap';
import { Country_Population } from './assets/country-population';
import { ILoadEventArgs, TreeMapTheme } from '@syncfusion/ej2-angular-treemap';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);
@Component({
    selector: 'control-content',
    templateUrl: 'label-wrapbyword.component.html',
    styleUrls: ['label-wrapbyword.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreemapLabelComponent {
    @ViewChild('treemap')
    public treemap: TreeMap;
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.treemap.theme = <TreeMapTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
        titleSettings: object = {
            text: 'Countries ordered based on Population - 2017',
            textStyle: { size: '15px' }
        };
        dataSource: object[] = Country_Population;
        tooltipSettings: object = {
            visible: true,
            format: '${Country} : ${Population}'
        };
        legendSettings: object = {
            visible: true,
            mode: 'Interactive',
            width: '300px',
            height: '10',
            position: 'Top'
        };
        rangeColorValuePath: string = 'Population';
        weightValuePath: string = 'Population';
        leafItemSettings: object = {
            showLabels: true,
            labelPath: 'Country',
            interSectAction:'WrapByWord',
            fill: 'red',
            colorMapping: [
                {
                    to: 10000000000,
                    from: 100000000,
                    label: '200M - 1.3M',
                    color: '#4B134F'
                }, { to: 100000000, from: 20000000, label: '20M - 200M', color: '#8C304D' },
                { to: 20000000, from: 100000, label: '0.1M - 20M', color: '#C84B4B' }
            ]
        };
    }
   