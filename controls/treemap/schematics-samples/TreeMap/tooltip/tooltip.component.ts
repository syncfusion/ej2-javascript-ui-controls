//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { TreeMap, TreeMapTooltip, TreeMapLegend} from '@syncfusion/ej2-angular-treemap';
import { Airport_Count } from './assets/airport-count';
import { ILoadEventArgs, TreeMapTheme } from '@syncfusion/ej2-angular-treemap';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

@Component({
    selector: 'control-content',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreemapTooltipComponent {
    @ViewChild('treemap')
    public treemap: TreeMap;
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.treemap.theme = <TreeMapTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    titleSettings: object = {
        text: 'Country wise International Airport count in South America',
        textStyle: {
            size: '15px'
        }
    };
        tooltipSettings: object = {
            visible: true,
            template: '<div id="Tooltip"><div id="displayAirports" style=" border: 1px #0a0a0a;">' +
            '<div id="airplaneicon" style="float:left;height:32px;width:32px; border: 1px black;"></div>' +
            '<div id="value" style="float:left;"><span id="label" style="margin-left: -5px;">Airports:</span>' +
            '<b style="margin-left: 5px">${Count}</b></div></div></div>'
        };
        dataSource: object[] = Airport_Count;
        weightValuePath: string = 'Count';
        equalColorValuePath: string = 'Count';
        legendSettings: object = {
            visible: true,
            position: 'Top',
            shape: 'Rectangle'
        };
        leafItemSettings: object = {
            showLabels: true,
            labelPath: 'State',
            labelPosition: 'Center',
            labelStyle: {
                size: '13px'
            },
            fill: '#6699cc',
            border: { width: 1, color: 'white'},
            colorMapping: [
                {
                    value: '25',
                    color: '#634D6F'
                },
                {
                    value: '12',
                    color: '#B34D6D'
                },
                {
                    value: '9',
                    color: '#557C5C'
                },
                {
                    value: '7',
                    color: '#44537F'
                },
                {
                    value: '6',
                    color: '#637392'
                },
                {
                    value: '3',
                    color: '#7C754D'
                },
                {
                    value: '2',
                    color: '#2E7A64'
                },
                {
                    value: '1',
                    color: '#95659A'
                },
            ]
        };
        constructor() {
            //code
          }
};