/**
 * Maps datalabel sample
 */
import { Maps, MapsTooltip, ILabelRenderingEventArgs, DataLabel, ILoadEventArgs, MapsTheme, SmartLabelMode, IntersectAction, MapAjax } from '../src/index';

Maps.Inject(MapsTooltip, DataLabel);
    let maps: Maps = new Maps({
dataLabelRendering:(args: ILabelRenderingEventArgs) =>{
    debugger;
},
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                dataLabelSettings: {
                    visible: true,
                    labelPath: 'name',
                    smartLabelMode: 'Trim'
                },
                shapeData: new MapAjax(location.origin + location.pathname + 'demos/MapData/USA.json'),
                shapeSettings: {
                    autofill: true
                },
                tooltipSettings: {
                    visible: true,
                    valuePath: 'name'
                },
            }
        ]
    });
    maps.appendTo('#datalabel');