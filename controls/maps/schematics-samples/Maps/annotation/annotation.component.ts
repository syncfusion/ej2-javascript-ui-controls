//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
import { MapsTheme, Maps, Annotations, Marker, ILoadEventArgs, MapAjax } from '@syncfusion/ej2-angular-maps';
import {africa_continent} from './assets/africa-continent';
Maps.Inject(Annotations, Marker);

/**
 * Sample for Accumulation Distribution
 */
@Component({
    selector: 'control-content',
    templateUrl: 'annotation.component.html',
    styleUrls: ['annotation.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MapsAnnotationComponent {
    public zoomSettings: object= {
        enable: false
    };
    public load = (args: ILoadEventArgs) => { 
        let theme: string = location.hash.split('/')[1]; 
        theme = theme ? theme : 'Material'; 
        args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    public annotations: object[] = [
        {
            content: '<div id="maps-annotation"> <div id="annotation"> <div> <p style="margin-left:10px;font-size:13px;font-weight:500">Facts about Africa</p> </div> <hr style="margin-top:-3px;margin-bottom:10px;border:0.5px solid #DDDDDD"> <div> <ul style="list-style-type:disc; margin-left:-20px;margin-bottom:2px; font-weight:400"> <li>Africa is the second largest and second most populated continent in the world.</li> <li style="padding-top:5px;">Africa has 54 sovereign states and 10 non-sovereign territories.</li> <li style="padding-top:5px;">Algeria is the largest country in Africa, where as Mayotte is the smallest.</li> </ul> </div> </div> </div>',
            x: '0%', y: '70%'
        }, {
            content: '<div id="compass-maps"> <img src="src/app/maps/images/compass.svg" width="75px" height="75px"> </div>',
            x: '85%', y: '5%'
        }
    ];
    public layers: object[] = [
            {
                shapeDataPath: 'name',
                shapePropertyPath: 'name',
                shapeData: africa_continent,
                shapeSettings: {
                    fill: 'url(#grad1)'
                },
                markerSettings: [
                    {
                        visible: true,
                        template: '<h3 style="color:white">{{:name}}</h3>',
                        animationDuration: 1,
                        dataSource: [{
                            name: 'Africa', latitude: 13.97274101999902, longitude: 20.390625
                        }]
                    }
                ]
            }
        ];
    constructor() {
        //code
    };

}