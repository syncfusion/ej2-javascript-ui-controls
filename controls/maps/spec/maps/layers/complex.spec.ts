/**
 * Complex property support
 */
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { electiondata, populationData } from '../data/us-data.spec';
import { World_Map, usMap, India_Map, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { getElement, timeout } from '../../../src/maps/utils/helper';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { Marker, ILoadEventArgs, BingMap, Zoom, MapsTooltip, Bubble, Legend, LayerSettingsModel, MapLocation, ITooltipRenderEventArgs } from '../../../src/maps/index';
Maps.Inject(Marker, Zoom, MapsTooltip, Bubble, Legend);

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
export function getShape(i: number): string {
    return 'mapst_LayerIndex_0_shapeIndex_' + i + '_dataIndex_undefined';
}
let MapData: Object = World_Map;
describe('Map marker properties tesing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Marker, Layer, Bubble testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        let prevent: Function = (): void => {
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                layers: [
                    {
                        shapeData: MapData,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'data.continent',
                        dataSource: [
                            { "Continent": "North America", 'color': '#71B081', data: { "continent": "North America", 'color': '#71B081' } },
                            { "Continent": "South America", 'color': '#5A9A77', data: { "continent": "South America", 'color': '#5A9A77' } },
                            { "Continent": "Africa", 'color': '#498770', data: { "continent": "Africa", 'color': '#498770' } },
                            { "Continent": "Europe", 'color': '#39776C', data: { "continent": "Europe", 'color': '#39776C' } },
                            { "Continent": "Asia", 'color': '#266665', data: { "continent": "Asia", 'color': '#266665' } },
                            { "Continent": "Australia", 'color': '#124F5E', data: { "continent": "Australia", 'color': '#124F5E' } }
                        ],
                        shapeSettings: {
                            colorValuePath: 'data.color',
                        },
                        bubbleSettings: [
                            {
                                visible: true,
                                valuePath: 'data.value',
                                colorValuePath: 'data.color',
                                animationDuration:0,
                                minRadius: 3,
                                maxRadius: 40,
                                opacity: 0.8,
                                dataSource: [
                                    {'name': 'India', 'value': 18.89685398845257, data:{ 'color': 'red', 'population': 391292635, 'value': 18.89685398845257} },
                                    {'name': 'United States', 'value': 14.990417962652455, data:{ 'color': 'yellow', 'population': 245436423, 'value': 14.990417962652455 }}
                                ],
                                tooltipSettings: {
                                    visible: true,
                                    valuePath: 'data.population',
                                },
                            }
                        ],
                        markerSettings: [
                            {
                                visible: true,
                                dataSource: [
                                    { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno', data: { x: 37.6276571, y: -122.4276688, name: 'San Bruno', shape: 'Pentagon', color:'red', imageUrl:'images/ballon.png' } },
                                    { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel', data: { x: 33.5302186, y: -117.7418381, name: 'Laguna Niguel', color:'blue', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 40.7424509, longitude: -74.0081468, name: 'New York', data: { x: 40.7424509, y: -74.0081468, name: 'New York', color:'green', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro', data: { x: -23.5268201, y: -46.6489927, name: 'Bom Retiro', color:'yellow', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto', data: { x: 43.6533855, y: -79.3729994, name: 'Toronto', color:'red', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris', data: { x: 48.8773406, y: 2.3299627, name: 'Paris', color:'blue', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin', data: { x: 52.4643089, y: 13.4107368, name: 'Berlin', color:'green', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai', data: { x: 19.1555762, y: 72.8849595, name: 'Mumbai', color:'yellow', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato', data: { x: 35.6628744, y: 139.7345469, name: 'Minato', color:'red', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                                    { latitude: 51.5326602, longitude: -0.1262422, name: 'London', data: { x: 51.5326602, y: -0.1262422, name: 'London', color:'blue', shape: 'Pentagon', imageUrl:'images/ballon.png' } }
                                ],
                                //shape: 'Image',
                                //imageUrl: 'images/ballon.png',
                                shapeValuePath: "data.shape",
                                colorValuePath: "data.color",
                                height: 20,
                                width: 20,
                                offset: {
                                    y: -10,
                                    x: 0
                                },
                                longitudeValuePath: "data.y",
                                latitudeValuePath: "data.x",
                                tooltipSettings: {
                                    visible: true,
                                    valuePath: 'data.name',
                                    format: "${data.name}: ${data.x} : ${data.y}"
                                },
                                animationDuration: 0
                            },
                            {
                                visible: true,
                                tooltipSettings: {
                                    visible: true
                                },
                                template: '<div id="marker1" class="markerTemplate">{{:data.name}}</div>',
                                dataSource: [
                                    { latitude: 50.32087157990324, longitude: 90.015625, data: {name: "ASIA"} }
                                ],
                                longitudeValuePath: "longitude",
                                latitudeValuePath: "latitude",
                                animationDuration: 0
                            },
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('layer, Bubble, marker enable the complex Property', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_134_dataIndex_3');
                expect(spec.getAttribute('fill')).toBe('#39776C');
                spec = getElementByID(id + '_LayerIndex_0_MarkerIndex_0_dataIndex_3');
                expect(spec.getAttribute('fill')).toBe('yellow');
                spec = getElementByID(id + '_LayerIndex_0_BubbleIndex_0_dataIndex_1');
                expect(spec.getAttribute('fill')).toBe('yellow');
                let element: Element = document.getElementById(id + '_LayerIndex_0_MarkerIndex_1_dataIndex_0');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
               // spec = getElementById(id + '_LayerIndex_0_MarkerIndex_1_dataIndex_0');
               // expect(spec.childElementCount).toBeGreaterThanOrEqual(1);
                done();
            };
            map.refresh();
        });
        describe('Marker Checking with enable ComplexProperty', () => {
            let id: string = 'container';
            let map: Maps;
            let ele: HTMLDivElement;
            let spec: Element;
            beforeAll(() => {
                ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                document.body.appendChild(ele);
                map = new Maps({
                    baseLayerIndex: 0,
                    layers: [
                        {
                            shapeData: MapData,
                        }
                    ]
                }, '#' + id);
            });
            afterAll(() => {
                remove(ele);
                map.destroy();
            });
            it('To check the marker color which is applied from marker datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_0');
                    expect(element.getAttribute('fill')).toBe('red');
                    done();
                };
                map.layers[0].markerSettings = [
                    {
                        visible: true,
                        colorValuePath: 'data.color',
                        shape: 'Circle',
                        longitudeValuePath: "data.y",
                        latitudeValuePath: "data.x",
                        dataSource: [
                            { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno', data: { x: 37.6276571, y: -122.4276688, name: 'San Bruno', shape: 'Pentagon', color:'red', imageUrl:'images/ballon.png' } },
                            { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel', data: { x: 33.5302186, y: -117.7418381, name: 'Laguna Niguel', color:'blue', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                            { latitude: 40.7424509, longitude: -74.0081468, name: 'New York', data: { x: 40.7424509, y: -74.0081468, name: 'New York', color:'green', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                            { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro', data: { x: -23.5268201, y: -46.6489927, name: 'Bom Retiro', color:'yellow', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                        ]
                    }]
                map.refresh();
            });
            it('enable property To check the marker shape which is applied from marker datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_1');
                    expect(element.getAttribute('fill')).toBe('#FF471A');
                    done();
                };
                map.layers[0].markerSettings = [
                    {
                        visible: true,
                        longitudeValuePath: "data.y",
                        latitudeValuePath: "data.x",
                        shapeValuePath: 'data.shape',
                        shape: 'Circle',
                        dataSource: [
                            { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno', data: { x: 37.6276571, y: -122.4276688, name: 'San Bruno', shape: 'Pentagon', color:'red', imageUrl:'images/ballon.png' } },
                            { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel', data: { x: 33.5302186, y: -117.7418381, name: 'Laguna Niguel', color:'blue', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                            { latitude: 40.7424509, longitude: -74.0081468, name: 'New York', data: { x: 40.7424509, y: -74.0081468, name: 'New York', color:'green', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                            { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro', data: { x: -23.5268201, y: -46.6489927, name: 'Bom Retiro', color:'yellow', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                        ]
                    }]
                map.refresh();
            });
            it('enable property To check the marker longitude and latitude which is applied from marker datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_1');
                    expect(element.getAttribute('fill')).toBe('#FF471A');
                    done();
                };
                map.layers[0].markerSettings = [
                    {
                        visible: true,
                        longitudeValuePath: "y",
                        latitudeValuePath: "x",
                        shape: 'Circle',
                        dataSource: [
                            { x: 37.6276571, y: -122.4276688, name: 'San Bruno', data: { x: 37.6276571, y: -122.4276688, name: 'San Bruno', shape: 'Pentagon', color:'red', imageUrl:'images/ballon.png' } },
                            { x: 33.5302186, y: -117.7418381, name: 'Laguna Niguel', data: { x: 33.5302186, y: -117.7418381, name: 'Laguna Niguel', color:'blue', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                            { x: 40.7424509, y: -74.0081468, name: 'New York', data: { x: 40.7424509, y: -74.0081468, name: 'New York', color:'green', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                            { x: -23.5268201, y: -46.6489927, name: 'Bom Retiro', data: { x: -23.5268201, y: -46.6489927, name: 'Bom Retiro', color:'yellow', shape: 'Pentagon', imageUrl:'images/ballon.png' } },
                        ]
                    }]
                map.refresh();
            });
            it('enable property To check the bubble valuepath which is applied from bubble datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_BubbleIndex_0_dataIndex_0');
                    expect(element.getAttribute('fill-opacity')).toBe('0.8');
                    done();
                };
                map.layers[0].bubbleSettings = [
                    {
                        visible: true,
                        valuePath: 'data.value',
                        animationDuration:0,
                        minRadius: 3,
                        maxRadius: 40,
                        opacity: 0.8,
                        dataSource: [
                            {'name': 'India', 'value': 18.89685398845257, data:{ 'color': 'red', 'population': 391292635, 'value': 18.89685398845257} },
                            {'name': 'United States', 'value': 14.990417962652455, data:{ 'color': 'yellow', 'population': 245436423, 'value': 14.990417962652455 }}
                        ],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'data.population',
                        },
                    }]
                map.refresh();
            });
            it('enable property To check the bubble color which is applied from bubble datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_BubbleIndex_0_dataIndex_0');
                    expect(element.getAttribute('fill')).toBe('red');
                    done();
                };
                map.layers[0].bubbleSettings = [
                    {
                        visible: true,
                        valuePath: 'data.value',
                        colorValuePath: 'data.color',
                        animationDuration:0,
                        minRadius: 3,
                        maxRadius: 40,
                        opacity: 0.8,
                        dataSource: [
                            {'name': 'India', 'value': 18.89685398845257, data:{ 'color': 'red', 'population': 391292635, 'value': 18.89685398845257} },
                            {'name': 'United States', 'value': 14.990417962652455, data:{ 'color': 'yellow', 'population': 245436423, 'value': 14.990417962652455 }}
                        ],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'data.population',
                        },
                    }]
                map.refresh();
            });
            it('enable property To check the layer which is applied from layer datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_134_dataIndex_3');
                    expect(element.getAttribute('fill')).toBe('#39776C');
                    done();
                };
                map.layers[0].shapePropertyPath= 'continent';
                map.layers[0].shapeDataPath= 'data.continent';
                map.layers[0].dataSource= [
                    { "Continent": "North America", 'color': '#71B081', data: { "continent": "North America", 'color': '#71B081' } },
                    { "Continent": "South America", 'color': '#5A9A77', data: { "continent": "South America", 'color': '#5A9A77' } },
                    { "Continent": "Africa", 'color': '#498770', data: { "continent": "Africa", 'color': '#498770' } },
                    { "Continent": "Europe", 'color': '#39776C', data: { "continent": "Europe", 'color': '#39776C' } },
                    { "Continent": "Asia", 'color': '#266665', data: { "continent": "Asia", 'color': '#266665' } },
                    { "Continent": "Australia", 'color': '#124F5E', data: { "continent": "Australia", 'color': '#124F5E' } }
                ];
                map.layers[0].shapeSettings= {
                    colorValuePath: 'data.color',
                };
                map.refresh();
            });
            it('enable property To check the layer desaturation colormapping which is applied from layer datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_0_dataIndex_0');
                    expect(element.getAttribute('fill')).toBe('red');
                    done();
                };
                map.layers[0].shapePropertyPath= 'name';
                map.layers[0].shapeDataPath= 'data.name';
                map.layers[0].dataSource= [
                    { data:{'code': 'AF', 'value': 53, 'name': 'Afghanistan','population': 29863010,'density': 119} },
                    { data:{'code': 'AL','value': 117, 'name': 'Albania', 'population': 3195000, 'density': 111} },
                    { data:{'code': 'DZ','value': 15,'name': 'Algeria', 'population': 34895000,'density': 15} },
                ];
                map.layers[0].shapeSettings.colorValuePath= 'data.density';
                map.layers[0].shapeSettings.colorMapping = [
                        {
                            from: 10, to: 119, color: 'red', label: '0-190000', minOpacity: 0.1, maxOpacity:0.5 
                        },
                    ]
                map.refresh();
            });
            it('enable property To check the layer equal colormapping which is applied from layer datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_44_dataIndex_2');
                    expect(element.getAttribute('fill')).toBe('rgb(77,112,184)');
                    done();
                };
                map.layers[0].shapePropertyPath= 'name';
                map.layers[0].shapeDataPath= 'data.name';
                map.layers[0].dataSource= [
                    { data:{'code': 'AF', 'value': 53, 'name': 'Afghanistan','population': 29863010,'density': 119} },
                    { data:{'code': 'AL','value': 117, 'name': 'Albania', 'population': 3195000, 'density': 111} },
                    { data:{'code': 'DZ','value': 15,'name': 'Algeria', 'population': 34895000,'density': 15} },
                ];
                map.legendSettings = {
                    visible: true
                };
                map.layers[0].shapeSettings.colorValuePath= 'data.name';
                map.layers[0].shapeSettings.colorMapping = [
                        {
                            value:"Afghanistan",color: 'rgb(153,174,214)',
                        },
                        {
                            value:"Albania",color: 'rgb(115,143,199)'
                        },
                        {
                            value:"Algeria", color: 'rgb(77,112,184)'
                        },
                    ]
                map.refresh();
            });
            it('enable property To check the layer Range colormapping which is applied from layer datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_2_dataIndex_1');
                    expect(element.getAttribute('fill')).toBe('rgb(77,112,184)');
                    done();
                };
                map.layers[0].shapePropertyPath= 'name';
                map.layers[0].shapeDataPath= 'data.name';
                map.layers[0].dataSource= [
                    { data:{'code': 'AF', 'value': 53, 'name': 'Afghanistan','population': 29863010,'density': 119} },
                    { data:{'code': 'AL','value': 117, 'name': 'Albania', 'population': 3195000, 'density': 111} },
                    { data:{'code': 'DZ','value': 15,'name': 'Algeria', 'population': 34895000,'density': 15} },
                ];
                map.legendSettings = {
                    visible: true
                };
                map.layers[0].shapeSettings.colorValuePath= 'data.density';
                map.layers[0].shapeSettings.colorMapping = [
                        {
                            from: 0.00001, to: 15, color: 'rgb(153,174,214)', label: '<15'
                        },
                        {
                            from: 15, to: 100, color: 'rgb(115,143,199)', label: '15 - 100'
                        },
                        {
                            from: 100, to: 200, color: 'rgb(77,112,184)', label: '100 - 200'
                        }
                    ];
                map.refresh();
            });
            it('enable property To check the legend Range colormapping which is applied from layer datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_Legend_Shape_Index_0');
                    expect(element.getAttribute('fill')).toBe('rgb(153,174,214)');
                    done();
                };
                map.layers[0].shapePropertyPath= 'name';
                map.layers[0].shapeDataPath= 'data.name';
                map.layers[0].dataSource= [
                    { data:{'code': 'AF', 'value': 53, 'name': 'Afghanistan','population': 29863010,'density': 119} },
                    { data:{'code': 'AL','value': 117, 'name': 'Albania', 'population': 3195000, 'density': 111} },
                    { data:{'code': 'DZ','value': 15,'name': 'Algeria', 'population': 34895000,'density': 15} },
                ];
                map.legendSettings = {
                    visible: true
                };
                map.layers[0].shapeSettings.colorValuePath= 'data.density';
                map.layers[0].shapeSettings.colorMapping =[
                        {
                            from: 0.00001, to: 15, color: 'rgb(153,174,214)', label: '<15'
                        },
                        {
                            from: 15, to: 100, color: 'rgb(115,143,199)', label: '15 - 100'
                        },
                        {
                            from: 100, to: 200, color: 'rgb(77,112,184)', label: '100 - 200'
                        }
                    ];
                map.refresh();
            });
            it('enable property To check the legend Range colormapping which is applied from layer datasource', (done: Function) => {
                map.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(map.element.id + '_Legend_Shape_Index_0');
                    expect(element.getAttribute('fill')).toBe('rgb(153,174,214)');
                    done();
                };
                map.layers[0].shapePropertyPath= 'name';
                map.layers[0].shapeDataPath= 'data.name';
                map.layers[0].dataSource= [
                    { data:{'code': 'AF', 'value': 53, 'name': 'Afghanistan','population': 29863010,'density': 119} },
                    { data:{'code': 'AL','value': 117, 'name': 'Albania', 'population': 3195000, 'density': 111} },
                    { data:{'code': 'DZ','value': 15,'name': 'Algeria', 'population': 34895000,'density': 15} },
                ];
                map.legendSettings = {
                    visible: true
                };
                map.layers[0].shapeSettings.colorValuePath= 'data.density';
                map.layers[0].shapeSettings.colorMapping =[
                        {
                            from: 0.00001, to: 15, color: 'rgb(153,174,214)', label: '<15'
                        },
                        {
                            from: 15, to: 100, color: 'rgb(115,143,199)', label: '15 - 100'
                        },
                        {
                            from: 100, to: 200, color: 'rgb(77,112,184)', label: '100 - 200'
                        }
                    ];
                map.refresh();
            });
        });        
    });
});