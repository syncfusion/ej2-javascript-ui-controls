/**
 * Selection Testcase
 */
import { usMap, World_Map, unCountries, randomcountriesData1, africa } from '../data/data.spec';
import { Population_Density } from '../data/PopulationDensity.spec';
import { createElement, remove } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { getElement } from '../../../src/maps/utils/helper';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { ILoadedEventArgs, Selection, Maps, Legend, Highlight, Marker, Zoom} from '../../../src/maps/index';
Maps.Inject(Selection, Legend, Highlight, Marker, Zoom);
describe('Selection Settings', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Testing selection is applied or not', () => {
        let id: string = 'container';
        let select: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            select = new Maps({
                titleSettings: {
                    text: 'US Map',
                },
                layers: [
                    {
                        highlightSettings: {
                            enable: true
                        },
                        selectionSettings:{
                            enable: true,
                            enableMultiSelect: false
                        },
                        shapeData: usMap,
                    }
                ],
            });
        });
        afterAll(() => {
            remove(ele);
            select.destroy();
        });
        it('Selection checking', (done: Function) => {
            select.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_undefined');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            };
            select.appendTo('#' + id);
        });
        it('Checking unselect using click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_undefined');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
        it('Switching selection element in click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_3_dataIndex_undefined');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        });
        it('selection element in click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_3_dataIndex_undefined');  
            let ele: object = {};
            ele['type'] = 'touchend';
            ele['target'] = spec;
            let selection : Selection = new Selection(select);
            selection['mouseClick'] (<Element>ele);
            expect(true).toBe(true);
            done();
        });
        it('Selection checking using public method', (done: Function) => {
            select.selectionModule.addSelection(0, 'Minnesota', true);
            spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        });
        it('Checking unselect using public method', (done: Function) => {
            select.selectionModule.addSelection(0, 'Minnesota', false);
            spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
        it('Checking selection not getting applied for other than map shape', (done: Function) => {
            spec = getElement(id);
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).not.toBe('ShapeselectionMapStyle');
            done();
        });
        it('Checking with destroyed map', (done: Function) => {
            select.isDestroyed = true;
            let selection : Selection = new Selection(select);
            spec = getElement(id);
            expect(spec.getAttribute('class')).not.toBe('ShapeselectionMapStyle');
            done();
        });
    });
    describe('Testcases for legend selection', () => {
        let id: string = 'container';
        let worldmap: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            worldmap = new Maps({
                legendSettings: {
                    visible: true,
                    toggleVisibility: false,
                },
                layers: [
                    {
                selectionSettings: {
                    enable: true,
                    enableMultiSelect: false,
                    border:{
                        width: 2,
                        color: "red",
                        opacity: 0.7
                    }
                },
                        shapeDataPath: 'Country',
                        shapePropertyPath: 'name',
                        dataSource : unCountries,
                        shapeData: World_Map,
                        shapeSettings: {
                            colorMapping: [
                                {
                                    value: 'Permanent',
                                    color : '#F05837'
                                },
                                {
                                    value: 'Non-Permanent',
                                    color: '#00743F'
                                }
                            ],
                            colorValuePath: 'Membership'
                        }
                    }
                ]
            });
        });
        afterAll(() => {
            remove(ele);
            worldmap.destroy();
        });
        it('Legend selection checking', (done: Function) => {
            worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_Legend_Shape_Index_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            };
            worldmap.appendTo('#' + id);
        });
        it('Removing legend selection', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_82_dataIndex_9');
            trigger.clickEvent(spec);
            expect(getElement('container_Legend_Shape_Index_0').getAttribute('class')).toBe(null);
            done();
        });
        it('Checking with multiselection between shape and legend', () => {
          worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_Legend_Shape_Index_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                spec = getElement('container_LayerIndex_0_shapeIndex_82_dataIndex_9');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');                
            };
            worldmap.layers[0].selectionSettings.enableMultiSelect = true;
            worldmap.refresh();
        });
        it('Checking with multiselection of legend', () => {
            worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_Legend_Shape_Index_1');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                spec = getElement('container_Legend_Shape_Index_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                trigger.clickEvent(getElement('container_Legend_Shape_Index_1'));
                trigger.clickEvent(getElement('container_LayerIndex_0_shapeIndex_134_dataIndex_2'));
                trigger.clickEvent(getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_0'));
            };
            worldmap.refresh();
        });
        it('Testing selection by changing enbalemultiselect value dynamically', () => {
            worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_LayerIndex_0_shapeIndex_167_dataIndex_4');
                trigger.clickEvent(spec);
                spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_0');
                expect(spec.getAttribute('class')).toBe(null);
            };
            worldmap.layers[0].selectionSettings.enableMultiSelect = false;
            worldmap.refresh();
        });
    });
    describe('Testing selection is applied or not', () => {
        let id: string = 'maps';
        let world: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            world = new Maps({
                legendSettings: {
                    visible: true,
                    toggleVisibility: true
                },
                layers: [
                    {
                        selectionSettings: {
                            enable: true,
                            enableMultiSelect: false,
                        },
                        shapeDataPath: 'Country',
                        shapePropertyPath: 'name',
                        dataSource : unCountries,
                        shapeData: World_Map,
                        shapeSettings: {
                            colorMapping: [
                                {
                                    value: 'Permanent',
                                    color : '#F05837'
                                },
                                {
                                    value: 'Non-Permanent',
                                    color: '#00743F'
                                }
                            ],
                            colorValuePath: 'Membership'
                        }
                    }
                ]
            });
        });
        afterAll(() => {
            remove(ele);
            world.destroy();
        });
        // it('Legend selection checking', (done: Function) => {
        //     world.loaded = (args: ILoadedEventArgs) => {
        //         spec = getElement('maps_Legend_Shape_Index_0');
        //         trigger.clickEvent(spec);
        //         expect(spec.getAttribute('opacity')).toBe('1');
        //         expect(getElement('maps_LayerIndex_0_shapeIndex_167_dataIndex_4').getAttribute('opacity')).toBe('0');
        //         trigger.clickEvent(spec);
        //         expect(getElement('maps_LayerIndex_0_shapeIndex_167_dataIndex_4').getAttribute('opacity')).toBe('1');
        //         done();
        //     };
        //     world.appendTo('#' + id);
        // });
        describe('Testing bubble, marker and navigation line selection', () => {
            let id: string = 'container';
            let world: Maps;
            let trigger: MouseEvents = new MouseEvents();
            let ele: HTMLDivElement;
            let spec: Element;
            beforeAll(() => {
                ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                document.body.appendChild(ele);
                world = new Maps({
                    titleSettings: {
                        text: 'World Map'
                    },
                    layers: [
                        {
                            navigationLineSettings: [
                                {
                                    selectionSettings: {
                                        enable: true,
                                        enableMultiSelect: false,
                                        border: {
                                            color: 'red',
                                            width: 4
                                        }
                                    },
                                    highlightSettings: {
                                        enable: false,
                                        border: {
                                            color: 'red',
                                            width: 4
                                        }
                                    },
                                    color: 'purple',
                                    width: 4,
                                    latitude: [37.16031654673677, 23.885837699862005, 71.85622888185527, 66.65297740055279],
                                    longitude: [-97.734375, 78.046875, -39.7265625, 86.8359375],
                                    visible: true,
                                    angle: 0.8
                                }
                            ],
                            highlightSettings: {
                                enable: false
                            },
                            selectionSettings: {
                                enable: true,
                                enableMultiSelect: true
                            },
                            shapeData: World_Map,
                            shapePropertyPath: 'continent',
                            shapeDataPath: 'continent',
                            dataSource: randomcountriesData1,
                            bubbleSettings: [{
                                selectionSettings: {
                                    enable: true
                                },
                                highlightSettings: {
                                    enable: false
                                },
                                visible: true,
                                dataSource: randomcountriesData1,
                                bubbleType: 'Square',
                                valuePath: 'Sales',
                                minRadius: 20,
                                maxRadius: 30,
                                fill: '#379F64',
                            }],
                            markerSettings: [
                                {
                                    selectionSettings: {
                                        enable: true
                                    },
                                    highlightSettings: {
                                        enable: false
                                    },
                                    fill: '#A569BD',
                                    height: 30,
                                    width: 30,
                                    visible: true,
                                    shape: 'Circle',
                                    dataSource: [
                                        { Name: 'USA', latitude: 38.8833, longitude: -77.0167 },
                                        { Name: 'Brazil', latitude: -15.7833, longitude: -47.8667 },
                                        { Name: 'India', latitude: 21.0000, longitude: 78.0000 },
                                        { Name: 'China', latitude: 35.0000, longitude: 103.0000 },
                                        { Name: 'Indonesia', latitude: -6.1750, longitude: 106.8283 }
                                    ]
                            }]
                        }
                    ]
                });
            });
            afterAll(() => {
                remove(ele);
                world.destroy();
            });
            it('Over all selection checking', (done: Function) => {
                    world.loaded = (args: ILoadedEventArgs) => {
                        spec = getElement('container_LayerIndex_0_BubbleIndex_0_dataIndex_2');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('BubbleselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_MarkerIndex_0_dataIndex_3');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('MarkerselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line0');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('navigationlineselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line1');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('navigationlineselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line1');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe(null);
                        spec = getElement('container');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).not.toBe('navigationlineselectionMapStyle');
                        done();
                    };
                    world.appendTo('#' + id);
                });
            it('Disabling selection', (done: Function) => {
                world.layers[0].selectionSettings.enable = false;
                world.loaded = (args: ILoadedEventArgs) => {
                    spec = getElement('container_LayerIndex_0_shapeIndex_64_dataIndex_undefined');
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('class')).toBe(null);
                    done();
                };
                world.refresh();
            });
            it('Marker shapes checking with Triangle', () => {
                world.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(world.element.id + '_Markers_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                };
                world.zoomSettings.enable = true;
                world.legendSettings = {
                    visible: true,
                    width: '200px',
                    height: '50px'
                };
                world.layers = [
                      {
                          shapeData: World_Map,
                          shapePropertyPath: 'continent',
                          shapeDataPath: 'continent',
                          shapeSettings: {
                            fill: '#E5E5E5',
                            colorValuePath: 'color'
                        },
                          dataSource: [
                              { "drillcolor": '#c13664', "continent": "north america", "categoryname": "books", "sales": 10882, 'color': '#71b081' },
                              { "drillcolor": '#9c3367', "continent": "south america", "categoryname": "books", "sales": 13776, 'color': '#5a9a77' },
                              { "drillcolor": '#80306a', "continent": "africa", "categoryname": "books", "sales": 18718.0, 'color': '#498770' },
                              { "drillcolor": '#622d6c', "continent": "europe", "categoryname": "books", "sales": 3746, 'color': '#39776c' },
                              { "drillcolor": '#462a6d', "continent": "asia", "categoryname": "books", "sales": 10688, 'color': '#266665' },
                              { "drillcolor": '#2a2870', "continent": "australia", "categoryname": "books", "sales": 30716, 'color': '#124f5e ' }
                          ],
                          animationDuration: 0,
                          selectionSettings: {
                              enable: true,
                              fill: 'green',
                              border: { color: 'white', width: 2, opacity: 1 }
                          },
                          highlightSettings: { enable: true, fill: 'green', border: { color: 'white', width: 2, opacity: 1 } },
                          markerSettings: [
                              {
                                  initialMarkerSelection: [
                                      { latitude: 64.45296412443938, longitude: 99.84812908629556 },
                                      { latitude: 33.5302186, longitude: -117.7418381 }
                                  ],
                                  selectionSettings: {
                                      enable: true,
                                      fill: 'green',
                                      enableMultiSelect: true,
                                      border: { color: 'white', width: 2, opacity: 1 },
                                  },
                                  dataSource: [
                                      { latitude: 64.45296412443938, longitude:  99.84812908629556, name: 'mumbai'},
                                      { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel'},
                                  ],
                                  visible: true,
                                  animationDuration: 0,
                                  shape: 'Balloon',
                                  fill: 'white',
                                  width: 30,
                              },
                          ]
                      }
                  ];          
                  world.refresh();
            });
            it('key up event', () => { 
                let textarea: HTMLElement = document.getElementById('container_LayerIndex_0_shapeIndex_0_dataIndex_4');            
                let keyboardeventargs: any = {
                    target: textarea,
                    code : 'Tab',
                    type: 'keyup',
                    key: 'keyup',
                }
                world.keyUpHandler(keyboardeventargs)
                textarea = document.getElementById('container_LayerIndex_0_shapeIndex_168_dataIndex_4');
                keyboardeventargs = {
                    target: textarea,
                    code : '',
                    type: 'keyup',
                    key: 'keyup'
                }
                world.keyUpHandler(keyboardeventargs)
                textarea = document.getElementById('container_LayerIndex_0_shapeIndex_0_dataIndex_4');
                keyboardeventargs = {
                    target: textarea,
                    code : 'Tab',
                    type: 'keydown',
                    key: 'keydown'
                }
                world.keyUpHandler(keyboardeventargs)
                keyboardeventargs = {
                    target: textarea,
                    code : 'Tab',
                    type: 'keydown',
                    key: 'keydown'
                }
                world.keyUpHandler(keyboardeventargs)
            });
            it('key down event', () => {
                let textarea: HTMLElement = document.getElementById('container_LayerIndex_0_shapeIndex_0_dataIndex_4');            
                let keyboardeventargs: any = {
                    target: textarea,
                    code : 'Equal',
                    type: '+',
                    key: 'keyup',
                }
                world.keyDownHandler(keyboardeventargs);
                world.keyDownHandler(keyboardeventargs);
                keyboardeventargs = {
                    target: textarea,
                    code : 'Minus',
                    type: '-',
                    key: 'keydown',
                }
                world.keyDownHandler(keyboardeventargs)
                keyboardeventargs = {
                    target: textarea,
                    keyCode : 82,
                }
                world.keyDownHandler(keyboardeventargs as KeyboardEvent)
                keyboardeventargs = {
                    target: textarea,
                    code : 'Equal',
                    type: '+',
                    key: 'keyup',
                }
                world.keyDownHandler(keyboardeventargs);
                textarea = document.getElementById('container');
                let keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'ArrowRight',
                    code: 'ArrowRight',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
                  keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'ArrowUp',
                    code: 'ArrowUp',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
                  keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
                  keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'ArrowLeft',
                    code: 'ArrowLeft',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
                  textarea = document.getElementById('container_Right_Page_Rect');
                  keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
                  textarea = document.getElementById('container_Left_Page_Rect');
                  keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
                  textarea = document.getElementById('container_LayerIndex_0_shapeIndex_168_dataIndex_4');
                  keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    repeat: false
                  });
                  textarea.dispatchEvent(keyboardEvent);
            });
            it('legend selection for coverage', () => {
                world.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(world.element.id + '_Legend_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(3);
                };
                world.zoomSettings.enable = true;
                world.legendSettings = {
                    visible: true,
                    shapeBorder: { width: 2, color: 'black' },
                    toggleLegendSettings: { enable: true },
                    mode: 'Default',
                    shape: 'Cross',
                    fill: null,
                    textStyle: { size: '12px', fontFamily: 'Roboto', fontStyle: 'Normal', fontWeight: 'Regular' },
                };
                world.layers = [
                      {
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        shapeSettings: {
                            fill: '#E5E5E5',
                            colorValuePath: 'color'
                        },
                        dataSource: [
                            { "drillcolor": '#c13664', "continent": "north america", "categoryname": "books", "sales": 10882, 'color': '#71b081' },
                            { "drillcolor": '#9c3367', "continent": "south america", "categoryname": "books", "sales": 13776, 'color': '#5a9a77' },
                            { "drillcolor": '#80306a', "continent": "africa", "categoryname": "books", "sales": 18718.0, 'color': '#498770' },
                            { "drillcolor": '#622d6c', "continent": "europe", "categoryname": "books", "sales": 3746, 'color': '#39776c' },
                            { "drillcolor": '#462a6d', "continent": "asia", "categoryname": "books", "sales": 10688, 'color': '#266665' },
                            { "drillcolor": '#2a2870', "continent": "australia", "categoryname": "books", "sales": 30716, 'color': '#124f5e ' }
                        ],
                        animationDuration: 0,
                        selectionSettings: {
                            enable: true,
                            fill: 'green',
                            border: { color: 'white', width: 2, opacity: 1 }
                        },
                    }
                  ];          
                  world.refresh();
            });
            it('seat selection for coverage', () => {
                world.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(world.element.id + '_LayerIndex_0_Polygon_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(21);
                };
                world.zoomSettings.enable = true;
                world.legendSettings = {
                    visible: true,
                    width: '200px',
                    height: '50px',
                    mode: 'Default'
                };
                world.layers = [
                      {
                        geometryType: 'Normal',
                          shapeData: { "type": "FeatureCollection", "features": [
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 0], [0, 20], [20, 20], [20, 0], [0, 0]]], [[[0, 22], [0, 27], [20, 27], [20, 22], [0, 22]]]] }, "properties": { "seatno": 19, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 47], [0, 67], [20, 67], [20, 47], [0, 47]]], [[[0, 69], [0, 74], [20, 74], [20, 69], [0, 69]]]] }, "properties": { "seatno": 18, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 94], [0, 114], [20, 114], [20, 94], [0, 94]]], [[[0, 116], [0, 121], [20, 121], [20, 116], [0, 116]]]] }, "properties": { "seatno": 13, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 141], [0, 161], [20, 161], [20, 141], [0, 141]]], [[[0, 163], [0, 168], [20, 168], [20, 163], [0, 163]]]] }, "properties": { "seatno": 12, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 188], [0, 208], [20, 208], [20, 188], [0, 188]]], [[[0, 210], [0, 215], [20, 215], [20, 210], [0, 210]]]] }, "properties": { "seatno": 7, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 235], [0, 255], [20, 255], [20, 235], [0, 235]]], [[[0, 257], [0, 262], [20, 262], [20, 257], [0, 257]]]] }, "properties": { "seatno": 6, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[0, 282], [0, 302], [20, 302], [20, 282], [0, 282]]], [[[0, 304], [0, 309], [20, 309], [20, 304], [0, 304]]]] }, "properties": { "seatno": 1, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 0], [50, 20], [70, 20], [70, 0], [50, 0]]], [[[50, 22], [50, 27], [70, 27], [70, 22], [50, 22]]]] }, "properties": { "seatno": 20, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 47], [50, 67], [70, 67], [70, 47], [50, 47]]], [[[50, 69], [50, 74], [70, 74], [70, 69], [50, 69]]]] }, "properties": { "seatno": 17, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 94], [50, 114], [70, 114], [70, 94], [50, 94]]], [[[50, 116], [50, 121], [70, 121], [70, 116], [50, 116]]]] }, "properties": { "seatno": 14, "fill": "Orange" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 141], [50, 161], [70, 161], [70, 141], [50, 141]]], [[[50, 163], [50, 168], [70, 168], [70, 163], [50, 163]]]] }, "properties": { "seatno": 11, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 188], [50, 208], [70, 208], [70, 188], [50, 188]]], [[[50, 210], [50, 215], [70, 215], [70, 210], [50, 210]]]] }, "properties": { "seatno": 8, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 235], [50, 255], [70, 255], [70, 235], [50, 235]]], [[[50, 257], [50, 262], [70, 262], [70, 257], [50, 257]]]] }, "properties": { "seatno": 5, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[50, 282], [50, 302], [70, 302], [70, 282], [50, 282]]], [[[50, 304], [50, 309], [70, 309], [70, 304], [50, 304]]]] }, "properties": { "seatno": 2, "fill": "Orange" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 0], [80, 20], [100, 20], [100, 0], [80, 0]]], [[[80, 22], [80, 27], [100, 27], [100, 22], [80, 22]]]] }, "properties": { "seatno": 21, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 47], [80, 67], [100, 67], [100, 47], [80, 47]]], [[[80, 69], [80, 74], [100, 74], [100, 69], [80, 69]]]] }, "properties": { "seatno": 16, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 94], [80, 114], [100, 114], [100, 94], [80, 94]]], [[[80, 116], [80, 121], [100, 121], [100, 116], [80, 116]]]] }, "properties": { "seatno": 15, "fill": "Orange" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 141], [80, 161], [100, 161], [100, 141], [80, 141]]], [[[80, 163], [80, 168], [100, 168], [100, 163], [80, 163]]]] }, "properties": { "seatno": 10, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 188], [80, 208], [100, 208], [100, 188], [80, 188]]], [[[80, 210], [80, 215], [100, 215], [100, 210], [80, 210]]]] }, "properties": { "seatno": 9, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 235], [80, 255], [100, 255], [100, 235], [80, 235]]], [[[80, 257], [80, 262], [100, 262], [100, 257], [80, 257]]]] }, "properties": { "seatno": 4, "fill": "gray" } },
                            { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[80, 282], [80, 302], [100, 302], [100, 282], [80, 282]]], [[[80, 304], [80, 309], [100, 309], [100, 304], [80, 304]]]] }, "properties": { "seatno": 3, "fill": "gray" } }
                        ] },
                          shapeSettings: {
                            fill: '#E5E5E5',
                        },
                          animationDuration: 0,
                          selectionSettings: {
                              enable: true,
                              fill: 'green',
                              border: { color: 'white', width: 2, opacity: 1 }
                          },
                          highlightSettings: { enable: true, fill: 'green', border: { color: 'white', width: 2, opacity: 1 } },                          
                      }
                  ];          
                  world.refresh();
            });
            it('Coverage seat selection for click event', () => {
                var spec = getElement('container_LayerIndex_0_shapeIndex_17_dataIndex_undefined');
                let ele: object = {};
                ele['target'] = spec;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                world.mapsOnClick(<PointerEvent>ele);
            });
            it('LineString for coverage', () => {
                world.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(world.element.id + '_LayerIndex_0_LineString_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(9);
                };
                world.zoomSettings.enable = true;
                world.layers = [
                      {
                        shapeData: {
                            "type": "FeatureCollection",
                        
                            "features": [
                        
                                {
                                    "properties": { "name": "Route4", "abbrev": "RDU", "from": "Raleigh", "to": "Chennai", "departure": "RDU", "arrival": "MAA", "Route1_Stop1": "ATL", "Route1_Stop2": "DXB" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[80.163775973154515, 12.982530166915435], [55.35407691722429, 25.252565593818161]] }                
                                },                
                                {
                                    "properties": { "name": "Route5", "abbrev": "RDU", "from": "Raleigh", "to": "Chennai", "departure": "RDU", "arrival": "MAA", "Route1_Stop1": "ATL", "Route1_Stop2": "DXB" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[55.35407691722429, 25.252565593818161], [-84.425397433604729, 33.640529080735213]] }                
                                },
                                {
                                    "properties": { "name": "Route6", "abbrev": "RDU", "from": "Raleigh", "to": "Chennai", "departure": "RDU", "arrival": "MAA", "Route1_Stop1": "ATL", "Route1_Stop2": "DXB" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[-84.425397433604729, 33.640529080735213], [-78.791381400675078, 35.875232345225498]] }                
                                },
                        
                                {
                                    "properties": { "name": "Route7", "abbrev": "RDU", "from": "Raleigh", "to": "Chennai", "departure": "RDU", "arrival": "MAA", "Route1_Stop1": "JFK", "Route1_Stop2": "DXB" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[80.163775973154515, 12.982530166915435], [55.35407691722429, 25.252565593818161]] }                
                                },                
                                {
                                    "properties": { "name": "Route8", "abbrev": "RDU", "from": "Raleigh", "to": "Chennai", "departure": "RDU", "arrival": "MAA", "Route1_Stop1": "JFK", "Route1_Stop2": "DXB" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[55.35407691722429, 25.252565593818161], [-73.786326860929549, 40.645959558408144]] }                
                                },                
                                {
                                    "properties": { "name": "Route9", "abbrev": "RDU", "from": "Raleigh", "to": "Chennai", "departure": "RDU", "arrival": "MAA", "Route1_Stop1": "JFK", "Route1_Stop2": "DXB" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[-73.786326860929549, 40.645959558408144], [-78.791381400675078, 35.875232345225498]] }               
                                },                
                                {
                                    "properties": { "name": "Route10", "abbrev": "MAA", "from": "Chennai", "to": "Raleigh", "departure": "MAA", "arrival": "RDU", "Route1_Stop1": "FRA", "Route1_Stop2": "IAD" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[80.163775973154515, 12.982530166915435], [8.571822869076076, 50.05067708952074]] }                
                                },
                                {
                                    "properties": { "name": "Route11", "abbrev": "MAA", "from": "Chennai", "to": "Raleigh", "departure": "MAA", "arrival": "RDU", "Route1_Stop1": "FRA", "Route1_Stop2": "IAD" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[8.571822869076076, 50.05067708952074], [-77.447792576920619, 38.95277403795302]] }
                                },
                                {
                                    "properties": { "name": "Route12", "abbrev": "MAA", "from": "Chennai", "to": "Raleigh", "departure": "MAA", "arrival": "RDU", "Route1_Stop1": "FRA", "Route1_Stop2": "IAD" }, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[-77.447792576920619, 38.95277403795302], [-78.791381400675078, 35.875232345225498]] }                
                                }
                        
                            ]
                        },
                        shapeSettings: {
                            border: { width: 2, color: 'black' },
                        },
                        selectionSettings: {
                            enable: true,
                            opacity: 1,
                            border: { width: 2, color: 'black' },
                            fill: 'blue'
                        },                     
                      }
                  ];          
                  world.refresh();
            });
            it('coverage first LineString is selected', () => {
                var spec = getElement('container_LayerIndex_0_shapeIndex_4_dataIndex_undefined');
                let ele: object = {};
                ele['target'] = spec;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                world.mapsOnClick(<PointerEvent>ele);
            });
            it('coverage second LineString is selected', () => {
                var spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
                let ele: object = {};
                ele['target'] = spec;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                world.mapsOnClick(<PointerEvent>ele);
            });
            it('initialMarkerSelection for coverage', () => {
                world.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(world.element.id + '_Markers_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(10);
                };
                world.zoomSettings.enable = true;
                world.zoomSettings.zoomOnClick = true;
                world.layers = [
                      {
                          shapeData: World_Map,
                          markerSettings: [
                            {
                                selectionSettings: { enable: true, fill: 'blue', enableMultiSelect: true, border: { color: 'black', width: 2, opacity: 1 }},
                                visible: true,
                                width: 30,
                                height: 30,
                                shape: 'Balloon',
                                animationDuration: 0,
                                initialMarkerSelection: [ { latitude: 37.6276571, longitude: -122.4276688 }, { latitude: 33.5302186, longitude: -117.7418381 }],
                                dataSource: [
                                    { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno'},
                                        { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel'},
                                        { latitude: 40.7424509, longitude: -74.0081468, name: 'New York'},
                                        { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro'},
                                        { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                                        { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris'},
                                        { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin'},
                                        { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai'},
                                        { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato'},
                                        { latitude: 51.5326602, longitude: -0.1262422, name: 'London'}
                                ]
                            },
                            {
                                visible: true,
                                template: '<div id="marker1" class="markerTemplate">Asia' +
                                    '</div>',
                                dataSource: [
                                    { latitude: 50.32087157990324, longitude: 90.015625 }
                                ],
                                animationDuration: 0
                            },]          
                      }
                  ];          
                  world.refresh();
            });
            it('initialMarkerSelection click the zoomin button', (done: Function) => {
                debugger;
                let spec = getElement('container_Zooming_ToolBar_ZoomIn_Rect');
                trigger.clickEvent(spec);
                done();
            });
            it('Tooltip marker for coverage', () => {
                world.loaded = (args: ILoadedEventArgs) => {
                    let element: Element = document.getElementById(world.element.id + '_Markers_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(4);
                };
                world.zoomSettings.enable = true;
                world.layers = [
                      {
                          shapeData: World_Map,
                          markerSettings: [{
                            enableDrag: true,
                            tooltipSettings: { visible: true, valuePath: 'Name' },
                            visible: true,
                            height: 30,
                            width: 30,
                            dataSource: [{ Name: "Chennai", latitude: 13.018410, longitude: 80.223068 },
                            { Name: "Mumbai", latitude: 19.076090, longitude: 72.877426 },
                            { Name: "Kolakata", latitude: 22.572645, longitude: 88.363892 },
                            { Name: "Gujarath", latitude: 22.140547, longitude: 73.184296 }
                            ]
                        }]                          
                      }
                  ];          
                  world.refresh();
            });
            it('coverage tooltip id as maps Area border', () => {
                var spec = getElement('container_MapAreaBorder');
                let ele: object = {};                
                ele['target'] = spec;
                ele['type'] = '';
                ele['pageX'] = spec.getBoundingClientRect().left;
                ele['pageY'] = spec.getBoundingClientRect().top;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                world.mapsTooltipModule.renderTooltip(<PointerEvent>ele);
            });
            it('coverage tooltipDisplayMode as click', () => {
                var spec = getElement('container_LayerIndex_0_MarkerIndex_0_dataIndex_2');
                let ele: object = {};                
                ele['target'] = spec;
                ele['type'] = '';
                ele['pageX'] = spec.getBoundingClientRect().left;
                ele['pageY'] = spec.getBoundingClientRect().top;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                world.mapsTooltipModule.removeEventListener();
                world.tooltipDisplayMode = 'Click';
                world.destroy();
                world.tooltipDisplayMode = 'DoubleClick';
                world.destroy();
            });
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
describe('Selection Settings', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Testing selection is applied or not', () => {
        let id: string = 'container';
        let selection: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let spec1: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            selection = new Maps({
                titleSettings: {
                    text: 'WorldMap',
                },
                legendSettings: {
                    visible: true,
                    position: 'Top',
                },
                layers: [{
                    highlightSettings: {
                        enable: true,
                        fill: 'red'
                    },
                    initialShapeSelection: [{ shapePath: 'name', shapeValue: 'India'}],
                    selectionSettings: {
                        enable: true,
                        fill: 'green',
                        border: {color: '#FFFFFF', opacity: 1, width: 2}
                    },
                    shapeData: World_Map,
                    shapeDataPath: 'name',
                    shapePropertyPath: 'name',
                    dataSource: Population_Density,
                    shapeSettings: {
                        colorValuePath: 'density',
                        fill: '#E5E5E5',
                        colorMapping: [
                            {
                                from: 0.00001, to: 100, color: 'yellow', label: '<100'
                            },
                            {
                                from: 100, to: 200, color: 'blue', label: '100 - 200'
                            },
                            {
                                from: 200, to: 300, color: 'pink', label: '200 - 300'
                            },
                            {
                                from: 300, to: 500, color: 'violet', label: '300 - 500'
                            },
                            {
                                from: 500, to: 19000, color: 'orange', label: '>500'
                            }
                        ]
                    }
                }],
            });
        });
        afterAll(() => {
            remove(ele);
            selection.destroy();
        });
        it('Selection checking for legends on shapes', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_64_dataIndex_56');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('yellow');
            done();
        };
            selection.appendTo('#' + id);
        });
        it('Selection checking for shapes on legends', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_2');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('pink');
            done();
        };
            selection.refresh();
        });
        it('Dual selection on same legends', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_1');
            trigger.clickEvent(spec);
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('blue');
            done();
        };
            selection.refresh();
        });
        it('Dual selection on same shapes', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_92_dataIndex_87');
            trigger.clickEvent(spec);
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('yellow');
            done();
        };
            selection.refresh();
        });
        it('Different shape selection', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('violet');
            spec = getElement('container_LayerIndex_0_shapeIndex_26_dataIndex_25');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('yellow');
            done();
        };
            selection.refresh();
        });
        it('Different legend selection with intearactive legend along with shape highlight', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Index_4');
            trigger.clickEvent(spec);
            spec = getElement('container_Legend_Index_3');
            trigger.clickEvent(spec);
            spec = getElement('container_Legend_Index_4');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            spec = getElement('container_Legend_Index_0');
            trigger.clickEvent(spec);
            spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_29');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            spec = getElement('container_LayerIndex_0_shapeIndex_134_dataIndex_125');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            done();
        };
            selection.legendSettings.mode = 'Interactive';
            selection.refresh();
        });
    });

    describe('Testing api based selection', () => {
        let id: string = 'container';
        let selections: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let spec1: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            selections = new Maps({
                titleSettings: {
                    text: 'WorldMap',
                },
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    mode: "Interactive"
                },
                layers: [{
                    highlightSettings: {
                        enable: true,
                        fill: 'red'
                    },
                    initialShapeSelection: [{ shapePath: 'name', shapeValue: 'India'}],
                    selectionSettings: {
                        enable: true,
                        fill: 'green'
                    },
                    shapeData: World_Map,
                    shapeDataPath: 'name',
                    dataSource: Population_Density,
                    shapeSettings: {
                        colorValuePath: 'density',
                        fill: '#E5E5E5',
                        colorMapping: [
                            {
                                from: 0.00001, to: 100, color: 'yellow', label: '<100'
                            },
                            {
                                from: 100, to: 200, color: 'blue', label: '100 - 200'
                            },
                            {
                                from: 200, to: 300, color: 'pink', label: '200 - 300'
                            },
                            {
                                from: 300, to: 500, color: 'violet', label: '300 - 500'
                            },
                            {
                                from: 500, to: 19000, color: 'orange', label: '>500'
                            }
                        ]
                    }
                }],
            });
        });
        afterAll(() => {
            remove(ele);
            selections.destroy();
        });
        it('Check shape is selected or not', (done: Function) => {
            selections.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            spec = getElement('container_Legend_Index_3');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        };
            selections.appendTo('#' + id);
        });
    });
   
    describe('Testing selection with baselayers', () => {
        let id: string = 'container';
        let selections: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let spec1: Element;
      
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            selections = new Maps({
                titleSettings: {
                    text: 'WorldMap',
                },
                layers: [{
                    shapeData: World_Map,
                    shapeSettings: {
                        fill: '#80306A',
                        colorValuePath: 'drillColor'
                    },
                    highlightSettings: {
                        enable: true,
                        fill: '#80306A'
                    },
                    selectionSettings: {
                        enable: true,
                        fill: 'red',
                        opacity: 1,
                        border: {
                            color: 'yellow', width: 1
                        }
                    },
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    }
                },
                {
                    shapeData: africa,
                    shapeSettings: {
                        fill: '#80306A',
                        colorValuePath: 'drillColor'
                    },
                    highlightSettings: {
                        enable: true,
                        fill: '#80306A'
                    },
                    selectionSettings: {
                        enable: true,
                        fill: 'red',
                        opacity: 1,
                        border: {
                            color: 'yellow', width: 1
                        }
                    },
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    }
                }]
            });
        });
        afterAll(() => {
            remove(ele);
            selections.destroy();
        });
        it('Check shape is selected or not using baseLayerIndex', (done: Function) => {
            selections.loaded = (args: ILoadedEventArgs) => {
                selections.shapeSelection(selections.baseLayerIndex, 'admin', 'Angola', true);
                spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_null');
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            }
            selections.appendTo('#' + id);
        });
        it('Set the layer type as sublayer', (done: Function) => {
            selections.loaded = (args: ILoadedEventArgs) => {
                selections.shapeSelection(1, 'admin', 'Angola', true);
                spec = getElement('container_LayerIndex_1_shapeIndex_0_dataIndex_null');
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            }
            selections.layers[1].type = 'SubLayer',
            selections.refresh();
            selections.appendTo('#' + id);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});