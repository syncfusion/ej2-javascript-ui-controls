/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, Zoom } from '../../src/index';
import { usa } from '../MapData/USA';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Marker, MapsTooltip, Zoom);

let maps: Maps;
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
            ]
        });
        maps.appendTo('#container');
document.getElementById('click2').onclick = () => {
  maps.layers[0].shapeData = usa;
  maps.refresh();   
};