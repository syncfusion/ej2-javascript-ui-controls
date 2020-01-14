/**
 * Maps zooming sample
 */
import { Maps, Zoom, MarkerSettings, IMouseEventArgs, MarkerSettingsModel ,Marker} from '../../src/index';
import { randomcountriesData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Zoom, Marker);

    let maps: Maps = new Maps({
    zoomSettings: {
        enable: true,
        toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
        pinchZooming: true,
		shouldZoomInitially:true   
    },
    
    layers: [
        {
        layerType:'Bing',
        key:'AuQazZ3PUo3p2_c2KPhqMku-iKvee5fKcRREIg46MENqVTM9dp2ZyTbrHJpR9esZ',
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
                },
                {   
                    name: 'Quito',
                    latitude: null,
                    longitude: null
                },
                {   
                    name: 'Buenos Aires',
                    latitude: "-19.019585",
                    longitude: "-65.261963"
                },

            ],
            visible: true,
            animationDuration: 0,
            shape: 'Circle',
            fill: 'white',
            width: 3,
            border: { width: 2, color: '#285255' },
        }]
    }]
    });
    maps.appendTo('#mapszooming');
    
    document.getElementById('zoominitial').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('zoominitial'));
    maps.zoomSettings.shouldZoomInitially = element.checked;
    maps.refresh();
};
   
    