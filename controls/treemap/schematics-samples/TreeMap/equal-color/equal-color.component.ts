//tslint:disable
import { Component, ViewEncapsulation, ViewChild,  } from '@angular/core';
import { ILoadEventArgs, TreeMapTheme, TreeMap } from '@syncfusion/ej2-angular-treemap';
import { Metals } from './assets/metals';
import { Browser } from '@syncfusion/ej2-base';
@Component({
    selector: 'control-content',
    templateUrl: 'equal-color.component.html',
    styleUrls: ['equal-color.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreemapCustomComponent {
    @ViewChild('treemap')
    public treemap: TreeMap;
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.treemap.theme = <TreeMapTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
        titleSettings: object = {
            text: 'US Gold medal categories in Summer Olympics - 2016',
            textStyle: {size: '15px'}
        };
        dataSource: object[] = Metals;
        tooltipSettings: object ={
            visible: true,
            format: '${Sport} : ${Gold}'
        };
        equalColorValuePath: string = 'value';
        weightValuePath: string = 'Gold';
        leafItemSettings: object = {
            showLabels: !Browser.isDevice,
            labelPath: 'Sport',
            fill: '#993399',
            templatePosition: 'Center',
            border: { color: 'black', width: 0.5 },
            labelFormat: ' ${Sport} - ${Gold}',
            colorMapping: [
                {
                    value: 'Low',
                    color: 'green'                    
                },
                {
                    value: 'Medium',
                    color: 'red'                    
                },
                {
                    value: 'High',
                    color: 'blue'                    
                }
            ]
        };
};