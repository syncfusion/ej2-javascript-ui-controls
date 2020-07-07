/**
 * Maps zooming sample
 */
import { Maps, Zoom, MarkerSettings, IMouseEventArgs, MarkerSettingsModel ,Marker} from '../../src/index';
import { randomcountriesData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
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
    centerPosition: {
        latitude:44.181655,
        longitude: -98.144014
    },
    zoomSettings: {
        enable: true,
		shouldZoomInitially:true   
    },
    
    layers: [
        {
		shapeData: world_Map,
		markerSettings: [
        {
            dataSource: [
                { 
                    latitude: 37.6276571, longitude: -122.4276688, name: "San Bruno"
                },
                {   
                    latitude: 33.5302186, longitude: -117.7418381, name: "Laguna Niguel"
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

document.getElementById('addMarker').onclick = () => {
        let markerDataSource: Object[] = maps.layersCollection[0].markerSettings[0].dataSource as object[];
        let data : Object = { 
            latitude : 19.1555762, longitude : 72.8849595, name : "Mumbai"
        };
        markerDataSource.push(data as Object);
        maps.refresh(); 
};

document.getElementById('addMarker1').onclick = () => {
        let markerDataSource: Object[] = maps.layersCollection[0].markerSettings[0].dataSource as object[];
        (maps.layersCollection[0].markerSettings[0].dataSource as object[]).pop();
        let data : Object = { 
            name: 'Karnataka',
            latitude: 15.317277,
            longitude: 75.713890
        };
        markerDataSource.push(data as Object);
        maps.refresh(); 
};
   
    