/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, IMarkerRenderingEventArgs, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { topPopulation } from './MapData/MarkerLocation';
import { world_Map } from './MapData/worldMap';
import { Rectangle } from '@syncfusion/ej2-pdf-export';
Maps.Inject(Marker, MapsTooltip);

    let maps: Maps = new Maps({
        markerRendering: (args :IMarkerRenderingEventArgs) =>{
            args.imageUrl = "./images/atm.png";
            },
        useGroupingSeparator: true,
        format: 'n',
        zoomSettings: {
            enable: false
        },
        titleSettings: {
            text: 'Top 25 populated cities in the world',
            textStyle: {
                size: '16px'
            }
        },
        layers: [
            {
                shapeData: world_Map,
                dataSource: topPopulation,
                shapeSettings: {
                    fill: '#C3E6ED'
                },
                markerSettings: [
                    {
                        dataSource: topPopulation,
                        visible: true,
                        height: 20,
                        width: 20,
                        animationDuration: 0,
                        shape: 'Image',
                    },
                ]
            }
        ]
    });
    maps.appendTo('#container');