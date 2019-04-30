//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
import { MapsTheme, Maps, Marker, Zoom, NavigationLine, ILoadEventArgs } from '@syncfusion/ej2-angular-maps';
import { penisular_location, penisular_marker } from './assets/map-location'; 
import { world_map } from './assets/world-map';
Maps.Inject(Marker, Zoom, NavigationLine);

/**
 * Linea penusular sample
 */
@Component({
    selector: 'control-content',
    templateUrl: 'navigation-line.component.html',
    styleUrls: ['navigation-line.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MapsNavigationLineComponent {
    
    public titleSettings: object = { 
        text: 'Shipping sea route between various cities', 
        titleStyle: { size: '18px' } 
    };
    public load = (args: ILoadEventArgs) => { 
        let theme: string = location.hash.split('/')[1]; 
        theme = theme ? theme : 'Material'; 
        args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    public zoomSettings: object = { enable: false, zoomFactor: 13 };

    public mapsArea: object = { background: '#4863A0' };

    public centerPosition: object = { latitude: 25.54244147012483, longitude: -89.62646484375 };

    public layers: object[] = [
        {
            shapeData: world_map,
            shapeSettings: {
                fill: '#789071',
            },
            navigationLineSettings: penisular_location,
            markerSettings: [
                {
                    visible: true,
                    shape: 'Circle',
                    fill: 'white',
                    width: 10,
                    height: 10,
                    dataSource: penisular_marker
                },
                {
                    visible: true,
                    template: '<div id="marker1" style="font-size: 12px;color:white">ALTAMIRA' +
                        '</div>',
                    dataSource: [
                        { latitude: 22.403410892712124, longitude: -97.8717041015625, }
                    ],
                    animationDuration: 0,
                    offset: {
                        x: -35,
                        y: 0
                    }
                },
                {
                    visible: true,
                    template: '<div id="marker2" style="font-size: 12px;color:white">HOUSTON' +
                        '</div>',
                    dataSource: [
                        { latitude: 29.756032197482973, longitude: -95.36270141601562 }
                    ],
                    animationDuration: 0,
                    offset: {
                        x: 0,
                        y: -15
                    }
                },
                {
                    visible: true,
                    template: '<div id="marker3" style="font-size: 12px;color:white">PANAMA CITY' +
                        '</div>',
                    dataSource: [
                        { latitude: 30.180747605060766, longitude: -85.81283569335938 }
                    ],
                    animationDuration: 0,
                    offset: {
                        x: 0,
                        y: -5
                    }
                },
                {
                    visible: true,
                    template: '<div id="marker4" style="font-size: 12px;color:white">TAMPA' +
                        '</div>',
                    dataSource: [
                        { latitude: 27.9337540167772, longitude: -82.49908447265625 }
                    ],
                    animationDuration: 0,
                    offset: {
                        x: 0,
                        y: -15
                    }
                },
                {
                    visible: true,
                    template: '<div id="marker5" style="font-size: 12px;color:white">PROGRESO' +
                        '</div>',
                    dataSource: [
                        { latitude: 21.282336521195344, longitude: -89.6649169921875 }
                    ],
                    animationDuration: 0,
                    offset: {
                        x: 0,
                        y: 15
                    }
                }
            ]
        }
    ];
    constructor() {
        //code
    };
}