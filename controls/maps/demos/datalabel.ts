/**
 * Maps datalabel sample
 */
import { Maps, MapsTooltip, DataLabel, ILoadEventArgs, MapsTheme, SmartLabelMode, IntersectAction, MapAjax } from '../src/index';
import { usa } from './MapData/USA';
Maps.Inject(MapsTooltip, DataLabel);
    let maps: Maps = new Maps({
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                dataLabelSettings: {
                    visible: true,
                    labelPath: 'name',
                    smartLabelMode: 'None'
                },
                shapeData: usa,
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

    document.getElementById('intersectaction').addEventListener('change', changeintersectaction);
    function changeintersectaction(): void {
        let type:any=(document.getElementById('intersectaction') as HTMLSelectElement).value;
        maps.layers[0].dataLabelSettings.intersectionAction = type;
        maps.refresh();
}
    document.getElementById('smartlabelmode').addEventListener('change', changelabelmode);
    function changelabelmode(): void {
        let type:any=(document.getElementById('smartlabelmode') as HTMLSelectElement).value;
        maps.layers[0].dataLabelSettings.smartLabelMode = type;
        maps.refresh();
}
    document.getElementById('select').onchange = () => {
        let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('select'));
        maps.layers[0].dataLabelSettings.visible = element.checked;
        maps.refresh();
    };