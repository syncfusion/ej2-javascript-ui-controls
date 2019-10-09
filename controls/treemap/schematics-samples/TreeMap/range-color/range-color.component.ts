//tslint:disable
import { Component, ViewEncapsulation, ViewChild,  } from '@angular/core';
import { ILoadEventArgs, TreeMapTheme, TreeMap } from '@syncfusion/ej2-angular-treemap';
import { Metals } from './assets/metals';
import { Browser } from '@syncfusion/ej2-base';
/**
 * Default sample
 */
@Component({
    selector: 'control-content',
    templateUrl: 'range-color.component.html',
    styleUrls: ['range-color.component.css'],
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
        rangeColorValuePath: string = 'Gold';
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
                    from: 1,
                    to: 5,
                    color: 'green'                    
                },
                {
                    from: 5,
                    to: 15,
                    color: 'red'                    
                },
                {
                    from: 15,
                    to: 20,
                    color: 'blue'                    
                }
            ]
        };
};