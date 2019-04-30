//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
import { MapsTheme, Maps, Legend, Marker, MapsTooltip, ILoadEventArgs } from '@syncfusion/ej2-angular-maps';

@Component({
    selector: 'control-content',
    templateUrl: 'osm.component.html',
    styleUrls: ['osm.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MapsDefaultComponent {
    titleSettings: object = {
        text: 'OSM sample',
        textStyle: {
            size: '16px'
        }
    };
    public zoomSettings: object = {
        enable: true
    };
    public layers: object[] = [{
        layerType: 'OSM',
        animationDuration: 0,
    }];
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    constructor() {
        //code
    };
}