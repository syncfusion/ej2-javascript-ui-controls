/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, Zoom, DataLabel } from '../../src/index';
import { topPopulation } from '../MapData/MarkerLocation';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Marker, DataLabel, Zoom);

let maps: Maps;
//let empty_Map : Object =
let empty_Map : Object = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
            "name":"Afghanistan"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                0,
                26.115985925333536
              ],
              [
                7.734374999999999,
                23.563987128451217
              ],
              [
                7.03125,
                28.92163128242129
              ],
              [
                0,
                26.115985925333536
              ]
            ]
          ]
        }
      }
    ]
  };

  let empty_Map1 : Object = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
            "name" : "Afghanistan"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            17.9296875,
            28.613459424004414
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
            "name" : "Argentina"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            17.578125,
            16.636191878397664
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
            "name": "Australia"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            19.6875,
            30.14512718337613
          ]
        }
      }
    ]
  };
//NL MAP nameS EDIT LAURENS

//document.getElementById('click1').onclick = () => {
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
                    shapeData: empty_Map1,
                    dataLabelSettings:{
                        visible:true,
                       labelPath:'name',
                       intersectionAction:'Trim'
                    },
                }
            ]
        });
        maps.appendTo('#container');
//};
