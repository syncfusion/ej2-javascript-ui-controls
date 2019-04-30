//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
import { MapsTheme, Maps, Bubble, IBubbleRenderingEventArgs, MapsTooltip, ILoadEventArgs, } from '@syncfusion/ej2-angular-maps';
import {  internetUsers } from './assets/population-data';
import { world_map } from './assets/world-map';

Maps.Inject(Bubble, MapsTooltip); 

export interface Data { value?: number; }

@Component({
    selector: 'control-content',
    templateUrl: 'bubble.component.html',
    styleUrls: ['bubble.component.css'], 
    encapsulation: ViewEncapsulation.None
})
export class MapsBubbleComponent {
    public load = (args: ILoadEventArgs) => { 
        let theme: string = location.hash.split('/')[1]; 
        theme = theme ? theme : 'Material'; 
        args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    public zoomSettings: object= {
        enable: true,
        horizontalAlignment: 'Near',
        toolBarOrientation: 'Vertical',
        pinchZooming: true
    }
    
    public titleSettings : object =  {
        text: 'Top 30 countries with highest Internet users',
        titleStyle: {
            size: '16px'
        }
    }

    public layers: object[] =  [
        {
            shapeDataPath: 'name',
            shapePropertyPath: 'name',
            shapeData:  world_map,
            shapeSettings: {
                fill: '#E5E5E5'
            },
            bubbleSettings: [
                {
                    visible: true,
                    valuePath: 'value',
                    colorValuePath: 'color',
                    minRadius: 3,
                    maxRadius: 70,
                    opacity: 0.8,
                    dataSource: internetUsers,
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'population',
                        format: 'Country: ${name} <br> Population: ${population}'
                    },
                }
            ]
        }
    ]

    public bubbleRendering = (args: IBubbleRenderingEventArgs) => { 
        args.radius = (args.data as Data).value; 
    }

    constructor() {
        //code
    };

}