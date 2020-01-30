/**
 * Maps zooming sample
 */
import { Maps, Zoom, MarkerSettings, IMouseEventArgs, MarkerSettingsModel ,Marker, MarkerType} from '../../src/index';
import { randomcountriesData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Zoom, Marker);

let maps: Maps = new Maps({
    zoomSettings: {
        enable: true,
        toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],  
    },
    
    layers: [
        {
        layerType: 'Bing',
        key: 'AuQazZ3PUo3p2_c2KPhqMku-iKvee5fKcRREIg46MENqVTM9dp2ZyTbrHJpR9esZ',
		markerSettings: [
        {
            dataSource: [
                { 
                    name: 'India',
                    latitude: 24.281276,
                    longitude: 78.711819
                },
                {   
                    name: 'Karnataka',
                    latitude: 15.317277,
                    longitude: 75.713890
                }
            ],
            visible: true,
            animationDuration: 0,
            shape: 'Image',
            imageUrl: '../images/ballon.png',
            height: 20,
            width: 20,
        }]
    }]
});
maps.appendTo('#container');
    
document.getElementById('zoominitial').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('zoominitial'));
    maps.zoomSettings.shouldZoomInitially = element.checked;
    maps.refresh();
};
document.getElementById('zoomvisible').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('zoomvisible'));
    maps.zoomSettings.enable = element.checked;
    maps.refresh();
};
document.getElementById('shapes').onchange = () => {
    let value: string = (<HTMLInputElement>document.getElementById('shapes')).value;
    maps.layers[0].markerSettings[0].shape= <MarkerType>value; 
    maps.refresh();
};
