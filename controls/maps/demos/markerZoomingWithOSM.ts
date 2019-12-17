/**
 * Maps zooming sample
 */
import { Maps, Zoom, MarkerSettings, IMouseEventArgs, MarkerSettingsModel ,Marker} from '../src/index';
import { randomcountriesData } from './MapData/salesCountry';
import { world_Map } from './MapData/worldMap';
Maps.Inject(Zoom, Marker);

    let maps: Maps = new Maps({
    click: (args: IMouseEventArgs) => {
        debugger
        let layerIndex: number = (args.target.indexOf('_LayerIndex_') !== -1) ?
        parseFloat(args.target.split('_LayerIndex_')[1].split('_')[0]) : 0;
        let marker: MarkerSettingsModel[];
        let dynamicMarker: MarkerSettingsModel[] = maps.layersCollection[layerIndex].markerSettings;
        dynamicMarker.push(new MarkerSettings(maps, 'markerSettings', marker));
        let markerIndex: number = dynamicMarker.length - 1;
        dynamicMarker[markerIndex].visible = true;
        dynamicMarker[markerIndex].dataSource = [
        { latitude: args['latitude'], longitude: args['longitude'], name: 'dynamicmarker' }
        ];
        maps.refresh();
    },
    zoomSettings: {
        enable: true,
        toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
        pinchZooming: true,
		shouldZoomInitially:true   
    },
    
    layers: [
        {
        layerType:'OSM',
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
   
    