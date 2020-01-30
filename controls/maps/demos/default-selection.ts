/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, Selection, LegendMode, LegendPosition, Highlight, Bubble, ILoadEventArgs, MapsTheme, MapAjax, bubbleClick } from '../src/index';
import { dafaultData } from './MapData/salesCountry';
import { world_Map } from './MapData/worldMap';
//import { Button } from '@syncfusion/ej2-buttons';
import { population, internetUsers } from './MapData/Populationdata';
//import { CheckBox, ChangeEventArgs as CheckBoxChangeEvents } from '@syncfusion/ej2-buttons';
//import { EmitType } from '@syncfusion/ej2-base'

Maps.Inject(Legend, Marker, MapsTooltip, Selection, Highlight, Bubble);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        // loaded: (args :ILoadEventArgs) =>{
        //     args.maps.addSelection(0, 'continent', 'Asia', true);
        //     args.maps.addSelection(0, 'name', 'India', true);
        //     },
        titleSettings: {
            text: 'YouTube office locations',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
            enable: false
        },
        legendSettings: {
            visible: true,
            //type: "Bubbles",
            // toggleLegendSettings: {
            //     enable: true,
            // }
        },
        layers: [
            {
                shapeData: world_Map,
                shapePropertyPath: 'continent',
                shapeDataPath: 'continent',
                dataSource: dafaultData,
                shapeSettings: {
                    colorValuePath: 'color',
                },
                selectionSettings: {
                    enable: true,
                    fill: 'red',
                    opacity: 1,
                    border:{
                        color: 'yellow', width: 1
                    }
                },
                highlightSettings: {
                    enable: true,
                    fill: '#A3B0D0'
                },
                markerSettings: [
                    {
                        visible: true,
                        dataSource: [
                            { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno', color: 'blue', shape: 'Rectangle'},
                            { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel', color: 'blue', shape: 'Rectangle'},
                            { latitude: 40.7424509, longitude: -74.0081468, name: 'New York', color: 'red', shape: 'Star'},
                            { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro', color: 'red', shape: 'Star'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto', color: 'green', shape: 'Triangle'},
                            { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris', color: 'green', shape: 'Triangle'},
                            { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin', color: 'yellow', shape: 'Circle'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai', color: 'yellow', shape: 'Circle'},
                            { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato', color: 'black', shape: 'Image'},
                            { latitude: 51.5326602, longitude: -0.1262422, name: 'London', color: 'black', shape: 'Image'}
                        ],
                        shape: 'Circle',
                        imageUrl: 'images/ballon.png',
                        height: 20,
                        colorValuePath: 'color',
                        shapeValuePath: 'shape',
                        imageUrlValuePath: 'imageurl',
                        width: 20,
                        offset: {
                            y: -10,
                            x: 0
                        },
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name'
                        },
                        animationDuration: 0,
                        selectionSettings: {
                            enable: true,
                            fill: 'red',
                            opacity: 1,
                            enableMultiSelect: true,
                            border: {
                                color: 'yellow', width: 1
                            }
                        },
                        highlightSettings: {
                            enable: true,
                            fill: '#A3B0D0'
                        },
                    },
                    {
                        visible: true,
                        tooltipSettings: {
                            visible: true
                        },
                        template: '<div id="marker1" class="markerTemplate">Asia' +
                            '</div>',
                        dataSource: [
                            { latitude: 50.32087157990324, longitude: 90.015625 }
                        ],
                        animationDuration: 0
                    },
                    {
                        visible: true,
                        template: '<div id="marker2" class="markerTemplate">Australia' +
                            '</div>',
                        dataSource: [
                            { latitude: -25.88583769986199, longitude: 134.296875 }
                        ],
                        animationDuration: 0
                    },
                    {
                        visible: true,
                        template: '<div id="marker3" class="markerTemplate">Africa' +
                            '</div>',
                        dataSource: [
                            { latitude: 16.97274101999902, longitude: 16.390625 }
                        ],
                        animationDuration: 0
                    },
                    {
                        visible: true,
                        template: '<div id="marker4" class="markerTemplate">Europe' +
                            '</div>',
                        dataSource: [
                            { latitude: 49.95121990866204, longitude: 18.468749999999998 }
                        ],
                        animationDuration: 0,
                    },
                    {
                        visible: true,
                        template: '<div id="marker5" class="markerTemplate" style="width:50px">North America' +
                            '</div>',
                        dataSource: [
                            { latitude: 59.88893689676585, longitude: -109.3359375 }
                        ],
                        animationDuration: 0
                    },
                    {
                        visible: true,
                        template: '<div id="marker6" class="markerTemplate" style="width:50px">South America' +
                            '</div>',
                        dataSource: [
                            { latitude: -6.64607562172573, longitude: -55.54687499999999 }
                        ],
                        animationDuration: 0
                    },
                ],
           
            },
        ],
    });
    maps.appendTo('#container');
    document.getElementById("multiselect").onchange = () => {
        let element: HTMLInputElement = <HTMLInputElement>(document.getElementById("multiselect"));
        maps.layers[0].selectionSettings.enableMultiSelect = element.checked;
        maps.refresh();
    }
    /*let selection: Button = new Button({
        cssClass: 'e-info', isPrimary: true
   });
   selection.appendTo('#selection');
   let unselection: Button = new Button({
    cssClass: 'e-info', isPrimary: true
    });
    unselection.appendTo('#unselection');*/
    document.getElementById('selection').onclick = () => {
    let valuePath: string = (<HTMLInputElement>document.getElementById('proertypath')).value;
    let name: string = (<HTMLInputElement>document.getElementById('name')).value;
        maps.shapeSelection(0, valuePath, name, true);
        maps.enablePersistence = true;
    };
    document.getElementById('unselection').onclick = () => {
    let valuePath: string = (<HTMLInputElement>document.getElementById('proertypath')).value;
    let name: string = (<HTMLInputElement>document.getElementById('name')).value;
        maps.shapeSelection(0, valuePath, name, false);
        maps.enablePersistence = true;
    };
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
