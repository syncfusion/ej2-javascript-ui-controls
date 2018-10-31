/**
 * navigation line selected layer testing
 */
import { Maps, ILoadedEventArgs, NavigationLine } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, } from '../data/data.spec';
Maps.Inject(NavigationLine);
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map navigation properties tesing', () => {
    describe('navigation testing', () => {
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
                        navigationLineSettings: [
                            {
                                visible: true,
                                latitude: [38.8833, 21.0000],
                                longitude: [-77.0167, 78.0000],
                                angle: 0.9,
                                width: 5,
                                color: 'blue',
                                dashArray: '2,1',
                                arrowSettings: {
                                    showArrow: true,
                                    size: 5,
                                    position: 'Start'
                                }
                            },
                        ],
                        shapeData: World_Map
                    }

                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('Navigation line selected width', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let strokeWidth: string = spec.getAttribute('stroke-width');
                expect(strokeWidth).toEqual('5');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 0,
                    width: 5,
                    color: 'red',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected stroke', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let stroke: string = spec.getAttribute('stroke');
                expect(stroke).toEqual('red');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 0,
                    width: 5,
                    color: 'red',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected dashArray', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let dashArray: string = spec.getAttribute('stroke-dasharray');
                expect(dashArray).toEqual('2,1');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 0,
                    width: 5,
                    color: 'red',
                    dashArray: '2,1',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected color', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let fill: string = spec.getAttribute('fill');
                expect(fill).toEqual('none');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 0,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected angle fill', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let fill: string = spec.getAttribute('fill');
                expect(fill).toEqual('none');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected angle d', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let fill: string = spec.getAttribute('d');
                expect(fill).toEqual(
                    'M 140.74384333333327,188.237209914718 A 213.75093827807066 213.75093827807066 0,0,0 , 352.5999999999999,216.63496505811577 ');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected angle 10', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let visible: string = spec.getAttribute('visible');
                expect(visible).toEqual(null);
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },
            ];
            map.refresh();
        });
        it('Navigation line selected angle -10', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let fill: string = spec.getAttribute('d');
                //       expect(fill).toEqual(
                // 'M 140.74384333333327,188.237209914718 A -213.75093827807066 -213.75093827807066 0,0,1 , 352.5999999999999,216.63496505811577 ');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: -10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected angle -0.5', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let fill: string = spec.getAttribute('d');
                //       expect(fill).toEqual();
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [21.0000, 38.8833],
                    longitude: [78.0000, -77.0167],
                    angle: -0.5,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected angle 0.5', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let fill: string = spec.getAttribute('d');
                //       expect(fill).toEqual();
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [21.0000, 38.8833],
                    longitude: [78.0000, -77.0167],
                    angle: 0.5,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: false,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },];
            map.refresh();
        });
        it('Navigation line selected arrow size', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let visible: string = spec.getAttribute('visible');
                expect(visible).toEqual(null);
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: true,
                        size: 5,
                        position: 'Start'
                    }
                },
            ];
            map.refresh();
        });
        it('Navigation line selected arrow color', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_triangle');
                let color: string = spec.getAttribute('stroke');
                expect(color).toEqual('none');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: true,
                        size: 5,
                        position: 'Start',
                        color: 'blue'
                    }
                },
            ];
            map.refresh();
        });
        it('Navigation line selected arrow size', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('triangle0');
                let size: string = spec.getAttribute('markerHeight');
                expect(size).toEqual('5');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: true,
                        size: 5,
                        position: 'Start',
                    }
                },
            ];
            map.refresh();
        });
        it('Navigation line selected arrow position start', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let markerstart: string = spec.getAttribute('marker-start');
                expect(markerstart).toEqual('url(#triangle0)');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: true,
                        size: 5,
                        position: 'Start'
                    }
                },
            ];
            map.refresh();
        });
        it('Navigation line selected arrow position End', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let markerEnd: string = spec.getAttribute('marker-end');
                expect(markerEnd).toEqual('url(#triangle0)');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [38.8833, 21.0000],
                    longitude: [-77.0167, 78.0000],
                    angle: 10,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: true,
                        size: 5,
                        position: 'End'
                    }
                },
            ];
            map.refresh();
        });
        it('Navigation line selected arrow position End and offSet', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
                let markerEnd: string = spec.getAttribute('marker-end');
                expect(markerEnd).toEqual('url(#triangle0)');
            };
            map.layers[0].navigationLineSettings = [
                {
                    visible: true,
                    latitude: [ 21.0000,  -15.7833],
                    longitude: [78.0000, -47.8667],
                    angle: 0,
                    width: 5,
                    color: 'none',
                    arrowSettings: {
                        showArrow: true,
                        size: 5,
                        position: 'End',
                        offSet: 5
                    }
                },
            ];
            map.refresh();
    });

        it('Navigation line selected arrow position start, angle -0.5 and offSet', () => {
          map.loaded = (args: ILoadedEventArgs) => {
             let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
             let markerEnd: string = spec.getAttribute('marker-end');
             expect(markerEnd).toEqual('url(#triangle0)');
    };
          map.layers[0].navigationLineSettings = [
            {
              visible: true,
              latitude: [38.8833, 21.0000],
              longitude: [-77.0167, 78.0000],
              angle: -0.5,
              width: 5,
              color: 'none',
              arrowSettings: {
                  showArrow: true,
                  size: 5,
                  position: 'End',
                  offSet: 5
            }
        },
    ];
          map.refresh();
});
        it('Navigation line selected arrow position start, angle -0.5 and offSet', () => {
            map.loaded = (args: ILoadedEventArgs) => {
               let spec: Element = document.getElementById('container_LayerIndex_0_NavigationIndex_0_Line0');
               let markerEnd: string = spec.getAttribute('marker-end');
               expect(markerEnd).toEqual('url(#triangle0)');
            };
            map.layers[0].navigationLineSettings = [
              {
                visible: true,
                latitude: [38.8833, 21.0000],
                longitude: [-77.0167, 78.0000],
                angle: -0.5,
                width: 5,
                color: 'none',
                arrowSettings: {
                   showArrow: true,
                   size: 5,
                   position: 'End',
                   offSet: 5
               }
             },
            ];
            map.refresh();
});

    });
});

