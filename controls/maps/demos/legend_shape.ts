/**
 * Legend Sample
 */
import { Maps, Legend, MapsTooltip, ITooltipRenderEventArgs, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { Population_Density } from './MapData/PopulationDensity';
import { LegendShape, LegendPosition } from '../src/maps/utils/enum'

Maps.Inject(Legend, MapsTooltip);
    let maps: Maps = new Maps({
        tooltipRender: (args: ITooltipRenderEventArgs) => {
            if (args.content.toString().indexOf('density') > -1) {
            args.cancel = true;
            }
        },
        zoomSettings: {
            enable: false
        },
        titleSettings: {
            text: 'Population density (per square kilometers) - 2015',
            textStyle: {
                size: '16px'
            }
        },
        legendSettings: {
            visible: true
        },
        layers: [
            {
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
                shapeDataPath: 'name',
                shapePropertyPath: 'name',
                dataSource: Population_Density,
                tooltipSettings: {
                    visible: true,
                    valuePath: 'name',
                    format: '${name} : ${density} per square kms'
                },
                shapeSettings: {
                    colorValuePath: 'density',
                    fill: '#E5E5E5',
                    colorMapping: [
                        {
                            from: 0.00001, to: 100, color: 'rgb(153,174,214)', label: '<100'
                        },
                        {
                            from: 100, to: 200, color: 'rgb(115,143,199)', label: '100 - 200'
                        },
                        {
                            from: 200, to: 300, color: 'rgb(77,112,184)', label: '200 - 300'
                        },
                        {
                            from: 300, to: 500, color: 'rgb(38,82,168)', label: '300 - 500'
                        },
                        {
                            from: 500, to: 19000, color: 'rgb(0,51,153)', label: '>500'
                        }
                    ]
                }
            }
        ]
    });
    maps.appendTo('#container');
    document.getElementById('position').onchange = () => {
        var value = (<HTMLInputElement>document.getElementById('position')).value;
        maps.legendSettings.position = <LegendPosition>value; 
        maps.refresh();
    }
    document.getElementById('shapes').onchange = () => {
        var value = (<HTMLInputElement>document.getElementById('shapes')).value;
        maps.legendSettings.shape= <LegendShape>value; 
        maps.refresh();
    }