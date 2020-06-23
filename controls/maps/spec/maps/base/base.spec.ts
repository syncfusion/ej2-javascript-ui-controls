/**
 * Maps basic spec file
 */
import { createElement, isNullOrUndefined, Event, EventHandler, remove } from '@syncfusion/ej2-base';
import { Maps, IMouseEventArgs, IResizeEventArgs, ILoadEventArgs, ILoadedEventArgs, BorderModel, FontModel } from '../../../src/index';
import { MouseEvents } from './events.spec';
import { drawBalloon, drawCircle, drawCross, drawDiamond, drawHorizontalLine, drawLine, drawPath } from '../../../src/maps/utils/helper';
import { drawPattern, drawPolygon, CircleOption, LineOption, Line, PathOption, PatternOptions } from '../../../src/maps/utils/helper';
import { PolygonOption, PolylineOption, drawPolyline, drawRectangle, drawTriangle, drawVerticalLine } from '../../../src/maps/utils/helper';
import { drawStar, MapLocation, measureText, Rect, RectOption, TextOption, Size, renderTextElement } from '../../../src/maps/utils/helper';
import { checkShapeDataFields, findMidPointOfPolygon, getFieldData, removeElement, getElement } from '../../../src/maps/utils/helper';
import { getShapeColor } from '../../../src/maps/model/theme';
import { LayerSettingsModel } from '../../../src/maps/index';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { Bubble, MapsTooltip, DataLabel, Zoom, Marker, ColorMapping, Highlight, Selection, Legend } from '../../../src/index';
import { World_Map, usMap, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { map } from '../data/mappoint.spec';
import { data } from '../data/bubblepointdata.spec';
import { doesNotThrow } from 'assert';
Maps.Inject(Bubble, MapsTooltip, Zoom, Highlight, Selection, Legend);
export function getIdElement(id: string): Element {
    return document.getElementById(id);
}
describe('Maps Component Base Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Maps testing spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'maps-container';
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '800px';
            (element as HTMLDivElement).style.height = '500px';
            document.body.appendChild(element);
            maps = new Maps({
                layers: [{
                    shapeData: World_Map,
                    markerSettings: [{ visible: false }],
                    tooltipSettings: { visible: false },
                    navigationLineSettings: [{
                        visible: false
                    }]
                }],
                zoomSettings: { enable: false }
            });
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });
        it('Maps checking with loaded event and control class name', (done: Function) => {
            maps.loaded = (args: ILoadedEventArgs) => {
                expect(args.name).toBe('loaded');
                expect(args.maps.availableSize.width).toBe(800);
                expect(args.maps.availableSize.height).toBe(500);
                expect(getIdElement(id).getAttribute('class').indexOf('e-maps') > -1).toBe(true);
                maps.loaded = null;
                done();
            };
            maps.appendTo('#' + id);
            // To solve coverage issue
            maps.getPersistData();
        });
        it('Maps background onproperty change testing', () => {
            maps.background = 'aqua';
            maps.dataBind();
            expect(getIdElement(id + '_MapBorder').getAttribute('fill')).toBe('aqua');
        });
        it('Maps load event checking', (done: Function) => {
            maps.load = (args: ILoadEventArgs) => {
                expect(args.name).toBe('load');
                args.maps.width = '600px';
                args.maps.height = '450px';
                maps.load = null;
            };
            maps.loaded = (args: ILoadedEventArgs) => {
                expect(args.maps.availableSize.width).toBe(600);
                expect(args.maps.availableSize.height).toBe(450);
                maps.loaded = null;
                done();
            };
            maps.refresh();
        });
        it('Maps click event checking', () => {
            maps.click = (args: IMouseEventArgs) => {
                expect(args.name).toBe('click');
                maps.click = null;
            };
            trigger.clickEvent(element);
        });
        it('Maps double click event checking', () => {
            maps.doubleClick = (args: IMouseEventArgs) => {
                expect(args.name).toBe('doubleClick');
                maps.doubleClick = null;
            };
            trigger.doubleClickEvent(element);
        });
        it('Maps right click event checking', () => {
            maps.rightClick = (args: IMouseEventArgs) => {
                expect(args.name).toBe('rightClick');
                maps.rightClick = null;
            };
            trigger.rightClickEvent(element);
        });
        it('Maps resize event checking', (done: Function) => {
            maps.mapsOnResize(null);
            maps.resize = (args: IResizeEventArgs) => {
                expect(args.name).toBe('resize');
                maps.resize = null;
                done();
            };
            maps.mapsOnResize(null);
        });
        it('Maps height and width with(%) checking', (done: Function) => {
            maps.height = '90%';
            maps.width = '70%';
            maps.loaded = (args: ILoadedEventArgs) => {
                expect(args.maps.availableSize.height).toBe(450);
                expect(args.maps.availableSize.width).toBe(560);
                expect(getIdElement(id + '_svg').getAttribute('width')).toBe('560');
                expect(getIdElement(id + '_svg').getAttribute('height')).toBe('450');
                maps.loaded = null;
                done();
            };
            maps.refresh();
        });
    });
    describe('Maps testing spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'maps1-container';
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '0px';
            document.body.appendChild(element);
            maps = new Maps({
                background: 'lightgray',
                titleSettings: {
                    textStyle: {
                        size: '15px',
                        fontWeight: '500',
                        color: '#424242',
                        fontStyle: 'Normal',
                        fontFamily: 'Segoe UI'
                    },
                },
                layers: [{
                    shapeData: usMap
                }],
                margin: { left: 10, right: 10, top: 10, bottom: 10 },
                border: { width: 1, color: 'green' }
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });
        it('Maps checking default size', (done: Function) => {
            maps.loaded = (args: ILoadedEventArgs) => {
                expect(getIdElement(id + '_svg').getAttribute('width')).toBe('600');
                expect(getIdElement(id + '_svg').getAttribute('height')).toBe('450');
                maps.loaded = null;
                done();
            };
            maps.height = '450';
            maps.refresh();
        });
        it('dummy spec for coverage', () => {
            let border: BorderModel = { width: 1, color: 'aqua' };
            let option: PathOption = new PathOption('balloon', 'blueviolet', 2, 'blueviolet', 1);
            let bal: Element = drawBalloon(maps, option, new Size(30, 50), new MapLocation(20, 30), maps.svgObject);
            let circle: Element = drawCircle(maps, new CircleOption('circle', 'orange', border, 1, 25, 95, 20, null), maps.svgObject);
            let pathOpt: PathOption = new PathOption('cross', 'teal', 2, 'red');
            let cross: Element = drawCross(maps, pathOpt, new Size(50, 50), { x: 30, y: 165 }, maps.svgObject);
            pathOpt.id = 'dia';
            let diamond: Element = drawDiamond(maps, pathOpt, new Size(50, 50), { x: 30, y: 225 }, maps.svgObject);
            pathOpt.id = 'hor';
            let hor: Element = drawHorizontalLine(maps, pathOpt, new Size(50, 50), { x: 30, y: 285 }, maps.svgObject);
            pathOpt.id = 'ver';
            let ver: Element = drawVerticalLine(maps, pathOpt, new Size(50, 50), { x: 30, y: 345 }, maps.svgObject);
            pathOpt.id = 'star';
            let star: Element = drawStar(maps, pathOpt, new Size(50, 50), { x: 30, y: 405 }, maps.svgObject);
            pathOpt.id = 'tri';
            let tri: Element = drawTriangle(maps, pathOpt, new Size(50, 50), { x: 130, y: 30 }, maps.svgObject);
            pathOpt.id = 'path-1';
            pathOpt.d = 'M 130 100 L 180 150';
            let path: Element = drawPath(maps, pathOpt, maps.svgObject);
            let line: Element = drawLine(maps, new LineOption('line', new Line(180, 160, 130, 220), 'green', 1, 'violet'), maps.svgObject);
            let poly: PolygonOption = new PolygonOption('polygon', '300,10 350,190 260,210', 'url(#pat)', 2, 'blueviolet', 1, '5, 5');
            new PolygonOption('polygon', '300,10 350,190 260,210', 'url(#pat)', 2, 'blueviolet');
            drawPolygon(maps, poly, maps.svgObject);
            let polylin: PolylineOption = new PolylineOption('polyline', '300,160 350,340 360,450', 'red', 2, 'smokewhite');
            new PolylineOption('polyline', '300,160 350,340 360,450', 'red', 2, 'smokewhite', 1, '5, 5');
            drawPolyline(maps, polylin, maps.svgObject);
            let text: TextOption = new TextOption('text', 500, 100, 'middle', 'Maps text render testing');
            text = new TextOption('text', 500, 100, 'middle', 'Maps text render testing', 'translate(0, 0)', 'middle');
            let fontOpt: FontModel = {
                size: '14px',
                fontWeight: '500',
                color: '#424242',
                fontStyle: 'Normal',
                fontFamily: 'Segoe UI'
            };
            let tetxSize: Size = measureText('testing maps text size', fontOpt);
            renderTextElement(text, fontOpt, '#424242', maps.svgObject);
            text.id = 'array-text';
            text.text = ['text-1', 'text-2', 'text-3', 'text-3'];
            text.y += 40;
            renderTextElement(text, fontOpt, '#424242', maps.svgObject);
            text.id = 'array-text-minus';
            text.x -= 70;
            renderTextElement(text, fontOpt, '#424242', maps.svgObject, true);
            new RectOption('rect', 'url(#pat)', border, 1, new Rect(100, 250, 400, 180), 5, 5, 'translate(0, 0)', '5, 5');
            drawRectangle(maps, new RectOption('rect', 'url(#pat)', border, 1, new Rect(100, 250, 400, 180)), maps.svgObject);
            let option1: PathOption = new PathOption('balloon1', 'blueviolet', 2, 'white', 1);
            let bal1: Element = drawBalloon(maps, option1, new Size(30, 50), new MapLocation(20, 30));
            option1 = new PathOption('balloon2', 'teal', 2, 'white', 1);
            let bal2: Element = drawBalloon(maps, option1, new Size(30, 50), new MapLocation(53, 30));
            let patt: PatternOptions = new PatternOptions('pat', 10, 55, 70, 60);
            new PatternOptions('pat', 10, 55, 70, 60, 'objectBoundingBox', 'objectBoundingBox', 'translate(0, 0)', 'url(#rect)');
            drawPattern(maps, patt, [bal1, bal2], maps.svgObject);
            expect(getIdElement('balloon')).not.toBe(null);
            expect(getIdElement('circle')).not.toBe(null);
            expect(getIdElement('cross')).not.toBe(null);
            expect(getIdElement('dia')).not.toBe(null);
            expect(getIdElement('hor')).not.toBe(null);
            expect(getIdElement('ver')).not.toBe(null);
            expect(getIdElement('star')).not.toBe(null);
            expect(getIdElement('tri')).not.toBe(null);
            expect(getIdElement('path-1')).not.toBe(null);
            expect(getIdElement('line')).not.toBe(null);
            expect(getIdElement('polygon')).not.toBe(null);
            expect(getIdElement('polyline')).not.toBe(null);
            expect(getIdElement('rect')).not.toBe(null);
            expect(getIdElement('pat')).not.toBe(null);
            expect(getIdElement('text').textContent).toBe('Maps text render testing');
            let colors: string[] = getShapeColor('Material');
            colors = getShapeColor('Fabric');
            colors = getShapeColor('Bootstrap');
        });
        it('checking getFieldData method', () => {
            let datasource: Object[] = [
                { id: 100, name: 'Kratos', working: 400, mail: 'kratos@syncfusion.com' },
                { id: 101, name: 'Zeus', working: 300, mail: 'Zeus@syncfusion.com' },
                { id: 102, name: 'Pozaiton', working: 200, mail: 'Pozaiton@syncfusion.com' },
                { id: 103, name: 'Areas', working: 150, mail: 'Areas@syncfusion.com' },
                { id: 104, name: 'Athena', working: 380, mail: 'Athena@syncfusion.com' },
                { id: 105, name: 'Heades', working: 320, mail: 'Heades@syncfusion.com' },
                { id: 106, name: 'Herclues', working: 350, mail: 'Herclues@syncfusion.com' },
                { id: 107, name: 'Gaya', working: 180, mail: 'Gaya@syncfusion.com' },
            ];
            let data: object[] = getFieldData(datasource, ['mail', 'name']);
            expect(Object.keys(data[0]).length).toBe(2);
            expect(Object.keys(data[0])[0]).toBe('mail');
            expect(Object.keys(data[0])[1]).toBe('name');
        });
        it('Checking with palettes property', () => {
            let colors: string[] = ['red', 'green', 'yellow', 'orange', 'blue', 'red', 'grey'];
            maps.loaded = (args: ILoadedEventArgs) => {
                expect(maps.layers[0].shapeSettings.palette.length).toBe(7);
            };
            maps.layers[0].shapeSettings.palette = colors;
            maps.refresh();
        });
    });

    describe('Maps testing spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'maps1-module';
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '0px';
            document.body.appendChild(element);
            maps = new Maps({
                legendSettings: {
                    visible: true
                },
                zoomSettings: {
                    enable: true
                },
                layers: [
                    {
                        highlightSettings: {
                            enable: true
                        },
                        selectionSettings: {
                            enable: true
                        },
                        bubbleSettings: [{
                            visible: true
                        }],
                        tooltipSettings: {
                            visible: true
                        },
                        shapeData: World_Map,
                        dataSource: [
                            { name: 'Angola' },
                            { name: 'Australia' },
                            { name: 'N. Cyprus' },
                            { name: 'Haiti' },
                        ],
                        shapeDataPath: 'name',
                        shapePropertyPath: 'name',
                        markerSettings: [{
                            visible: false,
                        }],
                        visible: false,
                        shapeSettings: {
                            colorMapping: [
                                {
                                    from: 1, to: 2
                                }
                            ]
                        },
                    }, {
                        bubbleSettings: [{
                            visible: true
                        }],
                        dataLabelSettings: {
                            visible: true
                        },
                        visible: true,
                        shapeData: usMap,
                        tooltipSettings: {
                            visible: true
                        },
                    },
                ],
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });
        it('Maps checking default size', (done: Function) => {
            maps.loaded = (args: ILoadedEventArgs) => {
                expect(isNullOrUndefined(maps.bubbleModule)).toBe(false);
                expect(isNullOrUndefined(maps.mapsTooltipModule)).toBe(false);
                expect(isNullOrUndefined(maps.selectionModule)).toBe(true);
                expect(isNullOrUndefined(maps.highlightModule)).toBe(true);
                expect(isNullOrUndefined(maps.mapLayerPanel)).toBe(false);
                expect(isNullOrUndefined(maps.legendModule)).toBe(false);
                expect(isNullOrUndefined(maps.zoomModule)).toBe(false);
                expect(new ColorMapping(maps)).not.toBe(null);
                expect(new DataLabel(maps)).not.toBe(null);
                expect(new Marker(maps)).not.toBe(null);
                done();
            };
            maps.refresh();
        });

        it('Maps checking checkShapeDataFields getShapeDataFields helper functions', (done: Function) => {
            let layer: LayerSettingsModel = maps.layers[0];
            let index: number = checkShapeDataFields(layer.dataSource as object[], layer.shapeData['features'][1]['properties'],
                'name', 'name', layer);
            expect(index).toBe(0);
            index = checkShapeDataFields(layer.dataSource as object[], layer.shapeData['features'][37]['properties'],
                'name', 'name', layer);
            expect(index).toBe(2);
            index = checkShapeDataFields(layer.dataSource as object[], layer.shapeData['features'][7]['properties'],
                'name', 'name', layer);
            expect(index).toBe(1);
            index = checkShapeDataFields(layer.dataSource as object[], layer.shapeData['features'][69]['properties'],
                'name', 'name', layer);
            expect(index).toBe(3);
            index = checkShapeDataFields(layer.dataSource as object[], layer.shapeData['features'][45]['properties'],
                'name', 'name', layer);
            expect(index).toBe(null);
            let points: MapLocation[] = [
                { x: 200, y: 10 }, { x: 250, y: 190 }, { x: 160, y: 210 }
            ];
            let pointsString: string = '200,10 250,190 160,210';
            let option: PolygonOption = new PolygonOption('polygon-mid', pointsString, 'red', 1, 'blue', 1);
            drawPolygon(maps, option, maps.svgObject);
            let midpoint: object = findMidPointOfPolygon(points, maps.projectionType);
            let coption: CircleOption = new CircleOption('mid-cir', 'blue', { width: 1, color: 'orange' }, 1,
                midpoint['x'], midpoint['y'], 10, null);
            drawCircle(maps, coption, maps.svgObject);
            expect(parseInt(midpoint['x'], 10)).toBe(201);
            expect(parseInt(midpoint['y'], 10)).toBe(126);
            midpoint = findMidPointOfPolygon([], maps.projectionType);
            expect(midpoint).toBe(null);
            pointsString = '100,10 40,198 190,78 10,78 160,198';
            points = [
                { x: 100, y: 10 }, { x: 40, y: 198 }, { x: 190, y: 78 }, { x: 10, y: 78 }, { x: 160, y: 198 }
            ];
            option = new PolygonOption('polygon-mid-2', pointsString, 'lime', 1, 'blueviolet', 1);
            drawPolygon(maps, option, maps.svgObject);
            midpoint = findMidPointOfPolygon(points, maps.projectionType);
            coption = new CircleOption('mid-cir-2', 'aqua', { width: 1, color: 'orange' }, 1, midpoint['x'], midpoint['y'], 10, null);
            drawCircle(maps, coption, maps.svgObject);
            expect(parseInt(midpoint['x'], 10)).toBe(103);
            expect(parseInt(midpoint['y'], 10)).toBe(116);
            done();
        });

        it('Shape layer render checking with polyline', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(maps.element.id + '_LayerIndex_0_Polygon_Group');
                expect(element === null).toBe(false);
                element = document.getElementById(maps.element.id + '_LayerIndex_1_LineString_Group');
                expect(element === null).toBe(true);
            };
            maps.layers = [{
                shapeData: World_Map
            },
            {
                type: 'SubLayer',
                shapeData: flightRoutes
            }]
            maps.refresh();
        });

        it('Shape layer render checking with points', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(maps.element.id + '_LayerIndex_0_Polygon_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                element = document.getElementById(maps.element.id + '_LayerIndex_1_Point_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            maps.layers = [{
                shapeData: World_Map
            },
            {
                type: 'SubLayer',
                shapeData: intermediatestops1
            }]
            maps.refresh();
        });

        it('Shape layer render with all typesof data', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(maps.element.id + '_LayerIndex_0_Polygon_Group');
                expect(element.childElementCount === null).toBe(false);
                element = document.getElementById(maps.element.id + '_LayerIndex_1_LineString_Group');
                expect(element === null).toBe(true);
                element = document.getElementById(maps.element.id + '_LayerIndex_2_Point_Group');
                expect(element.childElementCount === null).toBe(false);
            };
            maps.layers = [{
                shapeData: World_Map
            },
            {
                type: 'SubLayer',
                shapeData: flightRoutes
            },
            {
                type: 'SubLayer',
                shapeData: intermediatestops1
            }]
            maps.refresh();
        });

        it('Checking with custom path data', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = <Element>document.getElementById(maps.element.id + '_LayerIndex_0_Path_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                // custom path no tooltip checking
                trigger.mousemoveEvent(element, 0, 0, 300, 300);
            };
            maps.layers = [{
                shapeData: CustomPathData
            }];
            maps.refresh();
        });
    });

    describe('Maps title testing spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'map-container';
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '0px';
            document.body.appendChild(element);
            maps = new Maps({
                titleSettings: {
                    text: 'World Map'
                },
                layers: [{
                    shapeData: World_Map
                }]
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });

        it('check title element', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.maps.element.id + '_Title_Group');
                expect(element !== null).toBe(true);
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            maps.refresh();
        });

        it('check title alignment near', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.maps.element.id + '_Title_Group');
                let rect: ClientRect = element.children[0].getBoundingClientRect();
                expect(rect.left).toBeLessThan(args.maps.availableSize.width / 2);
            };
            maps.titleSettings.alignment = 'Near';
            maps.refresh();
        });

        it('check title alignment Center ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.maps.element.id + '_Title_Group');
                let rect: ClientRect = element.children[0].getBoundingClientRect();
                expect((rect.left + rect.width)).toBeGreaterThan(args.maps.availableSize.width / 2);
            };
            maps.titleSettings.alignment = 'Center';
            maps.refresh();
        });

        it('check title alignment Far ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.maps.element.id + '_Title_Group');
                let rect: ClientRect = element.children[0].getBoundingClientRect();
                expect((rect.left)).toBeGreaterThan(args.maps.availableSize.width / 2);
            };
            maps.titleSettings.alignment = 'Far';
            maps.refresh();
        });

        it('Check subtitle element', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element = getIdElement(args.maps.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                expect(element.childElementCount).toBeGreaterThanOrEqual(2);
                expect(element.children[1] !== null).toBe(true);
            };
            maps.titleSettings.subtitleSettings.text = '2017';
            maps.refresh();
        });

        it('Check subtitle alignment with Near', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element = getIdElement(args.maps.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                let subTitleRect: ClientRect = element.children[1].getBoundingClientRect();
                expect(subTitleRect.left).toBeLessThanOrEqual((titleRect.left + titleRect.width / 2));
            };
            maps.titleSettings.subtitleSettings.alignment = 'Near';
            maps.refresh();
        });

        it('Check subtitle alignment with Center', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element = getIdElement(args.maps.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                let subTitleRect: ClientRect = element.children[1].getBoundingClientRect();
                expect(subTitleRect.left + subTitleRect.width).toBeGreaterThanOrEqual((titleRect.left + titleRect.width / 2));
            };
            maps.titleSettings.subtitleSettings.alignment = 'Center';
            maps.refresh();
        });

        it('Check subtitle alignment with Far', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element = getIdElement(args.maps.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                let subTitleRect: ClientRect = element.children[1].getBoundingClientRect();
                expect(subTitleRect.left).toBeGreaterThanOrEqual((titleRect.left + titleRect.width / 2));
            };
            maps.titleSettings.subtitleSettings.alignment = 'Far';
            maps.refresh();
        });
    });

    describe('Maps click event testing spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'map-container';
        let spec: Element;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '0px';
            document.body.appendChild(element);
            maps = new Maps({
                titleSettings: {
                    text: 'World Map'
                },
                layers: [{
                    shapeData: World_Map,
                    markerSettings: [
                        {
                            visible: true,
                            dataSource: [
                                { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai'},
                                { latitude: 51.5326602, longitude: -0.1262422, name: 'London'}
                            ],
                            animationDuration: 0
                        },
                    ]
                }]
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });

        it('check dynamic marker element', (done: Function) => {
            maps.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(maps.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_0');
                let ele: object = {};
                ele['type'] = 'touchend';
                ele['target'] = spec;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                maps['mouseDownOnMap'](<PointerEvent>ele);
                maps['mapsOnClick'](<PointerEvent>ele);
                done();
            };
            maps.refresh();
        });

        it('check OSM dynamic marker element', (done: Function) => {
            maps.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(maps.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_1');
                let ele: object = {};
                ele['type'] = 'touchend';
                ele['target'] = spec;
                ele['x'] = spec.getBoundingClientRect().left;
                ele['y'] = spec.getBoundingClientRect().top;
                maps['mouseDownOnMap'](<PointerEvent>ele);
                maps['mapsOnClick'](<PointerEvent>ele);
                done();
            };
            maps.layers[0].layerType = 'OSM';
            maps.refresh();
        });
    });

    describe('Maps Point Type Data spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'map-container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '0px';
            document.body.appendChild(element);
            maps = new Maps({
                titleSettings: {
                    text: 'World Map'
                },
                layers: [{
                    shapeDataPath: 'name',
                    shapePropertyPath: 'name',
                    shapeData: map,
                    shapeSettings: {
                        fill: '#E5E5E5'
                    },
                    bubbleSettings: [
                        {
                            visible: true,
                            valuePath: 'value',
                            colorValuePath: 'color',
                            dataSource: data,
                            animationDuration:0,
                            minRadius: 30,
                            maxRadius: 70,
                            opacity: 0.8,
                            tooltipSettings: {
                                visible: true,
                                valuePath: 'name'
                            },
                        }
                    ]
                }]
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });

        it('Check point type data', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                let element = document.getElementById(maps.element.id + '_LayerIndex_0_Point_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
        });
    });

    describe('Maps Default Selection And Deselection Of Shapes', () => {
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
                legendSettings: {
                    visible: true,
                },
                layers: [
                    {
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
                        shapeSettings: {
                            colorValuePath: 'color',
                        },
                        dataSource: [
                            { "drillColor": '#C13664', "continent": "North America", "CategoryName": "Books", "Sales": 10882,
                            'color': '#71B081' },
                            { "drillColor": '#9C3367',"continent": "South America", "CategoryName": "Books", "Sales": 13776,
                            'color': '#5A9A77' },
                            { "drillColor": '#80306A',"continent": "Africa", "CategoryName": "Books", "Sales": 18718.0,
                            'color': '#498770' },
                            { "drillColor": '#622D6C',"continent": "Europe", "CategoryName": "Books", "Sales": 3746,
                            'color': '#39776C' },
                            { "drillColor": '#462A6D',"continent": "Asia", "CategoryName": "Books", "Sales": 10688,
                            'color': '#266665' },
                            { "drillColor": '#2A2870', "continent": "Australia", "CategoryName": "Books", "Sales": 30716,
                            'color': '#124F5E ' }
                        ]
                    }
                ]
            },'#' + id);
        });
        afterAll(() => {
            remove(ele);
            world.destroy();
        });
        it('Select the map shapes using public methode', () => {
            world.loaded = (args: ILoadedEventArgs) => {
                args.maps.shapeSelection(0, 'name', 'India', true);
                let selectedElement = document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_64_dataIndex_0');
                expect(selectedElement.getAttribute('class')).toBe(null);
            };
            trigger.clickEvent(document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_64_dataIndex_0'));
            trigger.clickEvent(document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_4_dataIndex_1'));
            world.layers[0].selectionSettings.enableMultiSelect = false;
            world.refresh();
        });
        it('Select the map shapes using public methode', () => {
            world.loaded = (args: ILoadedEventArgs) => {
                args.maps.shapeSelection(0, 'continent', 'Asia', true);
                let selectedElement = document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_29_dataIndex_4');
                expect(selectedElement.getAttribute('class')).toBe('ShapeselectionMapStyle');
            };
            world.layers[0].selectionSettings.enableMultiSelect = true;
            world.refresh();
        });
        it('Deselect the map shapes using public methode', () => {
            world.loaded = (args: ILoadedEventArgs) => {
                args.maps.shapeSelection(0, 'continent', 'Asia', false);
                let unSelectedElement = document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_72_dataIndex_4');
                expect(unSelectedElement.getAttribute('class')).toBe(null);
            };
            world.layers[0].selectionSettings.enableMultiSelect = false;
            world.refresh();
        });
        it('Select the map by giving property path type as string array using public methode', () => {
            world.loaded = (args: ILoadedEventArgs) => {
                args.maps.shapeSelection(0, ["name", "continent"], 'Russia', true);
                let selectedElement = document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_134_dataIndex_3');
                expect(selectedElement.getAttribute('class')).toBe('ShapeselectionMapStyle');
            };
            world.layers[0].selectionSettings.enableMultiSelect = true;
            world.refresh();
        });
        it('Select the map by giving property path type as string array with multiselect using public methode', () => {
            world.loaded = (args: ILoadedEventArgs) => {
                args.maps.shapeSelection(0, ["name", "continent"], 'Asia', true);
                let selectedElement = document.getElementById(world.element.id + '_LayerIndex_0_shapeIndex_29_dataIndex_4');
                expect(selectedElement.getAttribute('class')).toBe('ShapeselectionMapStyle');
            };
            world.refresh();
        });
    });

    describe('Maps testing spec with container size for OSM , Bing and Google Static Maps', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'maps1-module';
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '0px';
            document.body.appendChild(element);
            maps = new Maps({
                zoomSettings: {
                    enable: true
                },
                layers: [
                    {
                        layerType: "OSM",
                        dataSource: [
                            { name: 'Angola' },
                            { name: 'Australia' },
                            { name: 'N. Cyprus' },
                            { name: 'Haiti' },
                        ],
                        shapeDataPath: 'name',
                        shapePropertyPath: 'name',
                        markerSettings: [{
                            visible: true,
                        }],
                    }
                ],
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });
        it('Map container height and width ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
            };
            maps.width = '600px';
            maps.height = '600px';
            maps.refresh();
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