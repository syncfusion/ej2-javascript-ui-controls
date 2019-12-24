/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, Zoom } from '../../src/index';
import { topPopulation } from '../MapData/MarkerLocation';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Marker, MapsTooltip, Zoom);

let maps: Maps;
let empty_Map : Object =
//NL MAP nameS EDIT LAURENS
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Vide/Empty",
                "admin": "Vide/Empty"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            500.534577264329299,
                            500.534577264329299
                        ]                                             
                    ]
                ]
            }
        }
       
    ]
}
document.getElementById('click1').onclick = () => {
    maps = new Maps({
            useGroupingSeparator: true,
            format: 'n',
            zoomSettings: {
                enable: true
            },
            //enablePersistence:true,
            titleSettings: {
                text: 'Top 25 populated cities in the world',
                textStyle: {
                    size: '16px'
                }
            },

            layers: [
                {
                    shapeData: world_Map,
                    shapeSettings: {
                        fill: '#C3E6ED'
                    }
                },
                {
                    type: 'SubLayer',
                    shapeData: empty_Map,
                }
            ]
        });
        maps.appendTo('#container');
};

document.getElementById('click2').onclick = () => {
    maps.layers[1].markerSettings = [{
        visible: true,
        shape:'Circle',
        dataSource: [
            { name: 'India',
                      latitude: 24.281276,
                      longitude: 78.711819
              }
        ],
        animationDuration: 0
    }];
  maps.refresh();   
};