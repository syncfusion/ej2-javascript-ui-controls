/**
 * Maps zooming sample
 */
import { Maps, Zoom, MarkerSettings, IMouseEventArgs, MarkerSettingsModel ,Marker} from '../../src/index';
import { randomcountriesData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Zoom, Marker);

    let maps: Maps = new Maps({
    centerPosition: {
        latitude:44.181655,
        longitude: -98.144014
    },
    zoomSettings: {
        enable: true,
		zoomFactor:4
    },
    
    layers: [
        {
		layerType: 'OSM',	
    }]
    });
    maps.appendTo('#mapszooming');
    
document.getElementById('center1').onclick = () => {
    maps.centerPosition.latitude = 35.65;
    maps.centerPosition.longitude=-97.3; 
};

document.getElementById('center2').onclick = () => {
    maps.centerPosition.latitude = 15.317277;
    maps.centerPosition.longitude = 75.713890;
};
   
    