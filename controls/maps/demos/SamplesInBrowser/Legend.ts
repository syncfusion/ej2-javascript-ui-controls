import { Maps, Legend, Marker, MapsTooltip, LegendMode, ILoadEventArgs, LegendPosition, MapAjax, Zoom, MarkerType } from '../../src/index';
import { dafaultData } from '../MapData/salesCountry';
import { Population_Density } from '../MapData/PopulationDensity';
import { world_Map } from '../MapData/worldMap';

Maps.Inject(Legend, Marker, MapsTooltip, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        zoomSettings: {
            enable: false
        },
        titleSettings: {
            text: 'Population density (per square kilometer) - 2015',
            textStyle: {
                size: '16px'
            }
        },
        legendSettings: {
            visible: true,
            position: 'Top',
        },
        layers: [
            {
                shapeData: world_Map,
                shapeDataPath: 'name',
                shapePropertyPath: 'name',
                dataSource: Population_Density,
                tooltipSettings: {
                    visible: true,
                    valuePath: 'name',
                    format: '${name} : ${density}'
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
                        },
                        {
                            color: null, label: null
                        }
                    ]
                }
            }
        ]
    });
    maps.appendTo('#container');
    document.getElementById('legendPosition').onchange = () => {
        let Value = (<HTMLInputElement>document.getElementById('legendPosition')).value
        maps.legendSettings.position = <LegendPosition>Value;
        if (Value === 'Left' || Value === 'Right') {
            maps.legendSettings.orientation = 'Vertical';
            if (maps.legendSettings.mode === 'Interactive') {
                maps.legendSettings.height = '70%';
                maps.legendSettings.width = '10';
            } else {
                maps.legendSettings.height = '';
                maps.legendSettings.width = '';
            }
        } else {
            maps.legendSettings.orientation = 'Horizontal';
            if (maps.legendSettings.mode === 'Interactive') {
                maps.legendSettings.height = '10';
                maps.legendSettings.width = '';
            }
        }
        maps.refresh();
    };
    document.getElementById('legendMode').onchange = () => {
        let Mode = (<HTMLInputElement>document.getElementById('legendMode')).value;
        maps.legendSettings.mode = <LegendMode>Mode;
        if (Mode === 'Interactive') {
            if (maps.legendSettings.orientation === 'Horizontal' || maps.legendSettings.orientation === 'None') {
                maps.legendSettings.height = '10';
                maps.legendSettings.width = '';
            } else {
                maps.legendSettings.height = '70%';
                maps.legendSettings.width = '10';
            }
        } else {
            maps.legendSettings.height = '';
            maps.legendSettings.width = '';
        }
        maps.refresh();
    };
    document.getElementById('toggleLegend').onchange = () => {
        let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('toggleLegend'));
        maps.legendSettings.toggleLegendSettings.enable = element.checked;
        maps.refresh();
    };
