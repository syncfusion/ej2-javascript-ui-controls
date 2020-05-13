/**
 * datalabel testing
 */
import { Maps, ILoadedEventArgs, DataLabel, Zoom } from '../../../src/index';
import { createElement, remove, setCulture, setCurrencyCode } from '@syncfusion/ej2-base';
import { usMap , World_Map} from '../data/data.spec';
import { electiondata } from '../data/us-data.spec';
import { IDataLabelArgs } from '../../../src/maps/model/interface';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { getElement } from '../../../src/maps/utils/helper';
//import { world_Map } from '../../../demos/MapData/worldMap';
Maps.Inject(DataLabel, Zoom);

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map layer testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('datalabel Map layer testing', () => {
        let id: string = 'label';
        let label: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            label = new Maps({
                layers: [{
                    layerType: 'Geometry',

                    dataLabelSettings: {
                        visible: true,
                        labelPath: 'name',
                        textStyle: { size: '10px' },
                    },
                    shapeSettings: {
                        fill: '#C3E6ED',
                    },
                    shapeData: usMap,
                },
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            label.destroy();
        });
        it('label  color testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_LabelIndex_0')
                let color: string = spec.getAttribute('fill')
                expect(color).toEqual('#000000');
            }
            label.layers[0].dataLabelSettings.textStyle.color = '#000000';
            label.refresh();
        })
        it('label size  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_LabelIndex_0')
                let fontsize: string = spec.getAttribute('font-size');
                expect(fontsize).toEqual('12px');
            }
            label.layers[0].dataLabelSettings.textStyle.size = '12px';
            label.refresh();
        })
        it('label opacity  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_LabelIndex_0')
                let opacity: string = spec.getAttribute('opacity');
                expect(opacity).toEqual('1');
            }
            label.layers[0].dataLabelSettings.textStyle.opacity = 1;
            label.refresh();
        })
        it('label fontFamily  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_LabelIndex_0')
                let fontsize: string = spec.getAttribute('font-family');
                expect(fontsize).toEqual('Roboto, Noto, Sans-serif');
            }
            label.layers[0].dataLabelSettings.textStyle.fontFamily = 'Roboto, Noto, Sans-serif';
            label.refresh();
        })
        it('label fontWeight  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_LabelIndex_0')
                let fontweight: string = spec.getAttribute('font-weight')
                expect(fontweight).toEqual('Medium');
            }
            label.layers[0].dataLabelSettings.textStyle.fontWeight = "Medium";
            label.refresh();
        })

        it('label smartmode Trim  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_3_LabelIndex_3').textContent
                expect(spec).toEqual('North ...');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = "Trim";
            label.layers[0].dataLabelSettings.textStyle.size = "15px";
            label.layers[0].dataLabelSettings.intersectionAction = 'None';
            label.refresh();
        })
        it('label smartmode Hide  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_1_LabelIndex_1').textContent
                expect(spec).toEqual('');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = "Hide";
            label.layers[0].dataLabelSettings.textStyle.size = "15px";
            label.layers[0].dataLabelSettings.intersectionAction = 'None';
            label.refresh();
        })

        it('smartLablemode:None  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_8_LabelIndex_8').textContent
                expect(spec).toEqual('California');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'None';
            label.layers[0].dataLabelSettings.intersectionAction = 'None';
            label.refresh();
        })

        it('smartLablemode:None intersectionAction:None  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'None';
            label.layers[0].dataLabelSettings.intersectionAction = 'None';
            label.refresh();
        })
        it('smartLablemode:None intersectionAction:Hide  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'None';
            label.layers[0].dataLabelSettings.intersectionAction = 'Hide';
            label.refresh();
        })
        it('smartLablemode:None intersectionAction:Trim  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'None';
            label.layers[0].dataLabelSettings.intersectionAction = 'Trim';
            label.refresh();
        })
        it('smartLablemode:Trim intersectionAction:None  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'Trim';
            label.layers[0].dataLabelSettings.intersectionAction = 'None';
            label.refresh();
        })
        it('smartLablemode:Trim intersectionAction:Hide  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'Trim';
            label.layers[0].dataLabelSettings.intersectionAction = 'Hide';
            label.refresh();
        })
        it('smartLablemode:Hide intersectionAction:None  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'Hide';
            label.layers[0].dataLabelSettings.intersectionAction = 'None';
            label.refresh();
        })
        it('smartLablemode:Hide intersectionAction:Trim  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'Hide';
            label.layers[0].dataLabelSettings.intersectionAction = 'Trim';
            label.refresh();
        })
        it('smartLablemode:Hide intersectionAction:Hide  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('Montana');
            }
            label.layers[0].dataLabelSettings.smartLabelMode = 'Hide';
            label.layers[0].dataLabelSettings.intersectionAction = 'Hide';
            label.refresh();
        })

        it('label path  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('label_LayerIndex_0_shapeIndex_2_LabelIndex_2').textContent
                expect(spec).toEqual('');
            }
            label.layers[0].dataLabelSettings.labelPath = 'admin';
            label.refresh();
        })

        it('label border ,fill testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_rectIndex_0')
                let fill = spec.getAttribute('fill');
                expect(fill).toEqual('blue');
            }
            label.layers[0].dataLabelSettings.border.width = 2;
            label.layers[0].dataLabelSettings.fill = 'blue'
            label.refresh();
        })
        it('label border,rx  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_rectIndex_0')
                let rx = spec.getAttribute('rx');
                expect(rx).toEqual('5');
            }
            label.layers[0].dataLabelSettings.border.width = 2;
            label.layers[0].dataLabelSettings.rx = 5;
            label.refresh();
        })
        it('label border,ry  testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_rectIndex_0')
                let ry = spec.getAttribute('ry');
                expect(ry).toEqual('5');
            }
            label.layers[0].dataLabelSettings.border.width = 2;
            label.layers[0].dataLabelSettings.ry = 5;
            label.refresh();
        })

        it('label border ,opacity testing spec', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let spec = document.getElementById('label_LayerIndex_0_shapeIndex_0_rectIndex_0')
                let opacity = spec.getAttribute('opacity');
                expect(opacity).toEqual('2');
            }
            label.layers[0].dataLabelSettings.border.width = 2;
            label.layers[0].dataLabelSettings.opacity = 2;
            label.refresh();
        })

        it('checking with datalabel template', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById('label_LayerIndex_0_Label_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(51);
            };
            label.layers[0].dataLabelSettings.visible = true;
            label.layers[0].dataLabelSettings.labelPath = 'name';
            label.layers[0].dataLabelSettings.template = '<div id="marker1"><p>{{:name}}</p></div>';
            label.refresh();
        });

        it('checking with datalabel template', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById('label_LayerIndex_0_Label_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(51);
            };
            label.layers[0].dataLabelSettings.visible = true;
            label.layers[0].dataLabelSettings.template = 'String';
            label.refresh();
        });

    });
    describe('testing datalabel from datasource', () => {
        let id: string = 'label';
        let label: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            label = new Maps({
                projectionType: 'Equirectangular',
                format: 'c',
                useGroupingSeparator: true,
                layers: [{
                    dataSource : electiondata,
                    shapeDataPath:'State',
                    shapePropertyPath:['name', 'admin'],
                    dataLabelSettings: {
                        visible: true,
                        labelPath : 'Electors',
                        textStyle: { size: '10px' },
                    },
                    shapeSettings: {
                        fill: '#C3E6ED',
                    },
                    shapeData: usMap,
                },
                ]
            }, '#' + id)
        });
        afterAll(() => {
            remove(ele);
            label.destroy();
        });
        it('testing datalabel from datasource', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('label_LayerIndex_0_shapeIndex_4_LabelIndex_4');
                expect(spec.innerHTML).toBe('4.00');
            };
        });
    });
    describe('datalabel border testing with enable zoom', () => {
        let id: string = 'label';
        let label: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            label = new Maps({
                layers: [{
                    layerType: 'Geometry',

                    dataLabelSettings: {
                        visible: true,
                        labelPath: 'name',
                        textStyle: { size: '10px' },
                    },
                    shapeSettings: {
                        fill: '#C3E6ED',
                    },
                    shapeData: usMap,
                },
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            label.destroy();
        });
        it('checking with datalabel border with enable zoom', () => {
            label.loaded = (args: ILoadedEventArgs) => {
                let zoomElement: Element = document.getElementById(label.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: zoomElement,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: zoomElement.getBoundingClientRect().left,
                    pageY: zoomElement.getBoundingClientRect().top
                };  
                label.zoomModule.performToolBarAction(<PointerEvent>eventObj); 
            };
            label.zoomSettings.enable = true;
            label.layers[0].dataLabelSettings.fill = "White";
            label.layers[0].dataLabelSettings.visible = true;
            label.layers[0].dataLabelSettings.border.width = 2;
            label.layers[0].dataLabelSettings.border.color = "red"; 
            label.refresh();
        });
    });
    describe('datalabel with shapePropertyPath and without labelPath', () => {
      let id: string = 'label';
      let label: Maps;
      let ele: HTMLDivElement;
      let spec: Element;
      let prevent: Function = (): void => {
          //Prevent Function
      };
      beforeAll(() => {
          ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
          document.body.appendChild(ele);
          label = new Maps({
              layers: [{
                  layerType: 'Geometry',
                  shapePropertyPath: ["continent", "admin", "name" ],
                  dataLabelSettings: {
                      visible: true,
                  },
                  shapeSettings: {
                      fill: '#C3E6ED',
                  },
                  shapeData: World_Map,
              },
              ]
          }, '#' + id);
      });
      afterAll(() => {
          remove(ele);
          label.destroy();
      });
      it('checking with datalabel template without labelPath', () => {
        label.loaded = (args: ILoadedEventArgs) => {
            let element: Element = document.getElementById('label_LayerIndex_0_shapeIndex_1_LabelIndex_1');
            expect(element.innerHTML).toBe("<div>string</div>");
        };
        label.layers[0].dataLabelSettings.labelPath = "";
        label.layers[0].dataLabelSettings.template = 'string';
        label.refresh();
    });
  it('checking with datalabel without labelPath and datasource', () => {
    label.loaded = (args: ILoadedEventArgs) => {
      let element: Element = document.getElementById('label_LayerIndex_0_Label_Template_Group');
      expect(element.childElementCount).toBeGreaterThanOrEqual(47);
    };
    label.layers[0].shapePropertyPath= "continent";
    label.layers[0].shapeDataPath= 'country';
    label.layers[0].dataSource =[{name: 'Asia', country: 'Asia', color: '#FFFF00'}];
    label.layers[0].dataLabelSettings.labelPath = "";
    label.layers[0].dataLabelSettings.template = "string";
    label.refresh();
});
  });
	describe('datalabel for sublayer with point type data', () => {
        let id: string = 'label';
        let label: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        let empty_Map: Object = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "name": "Afghanistan"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            17.9296875,
                            28.613459424004414
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "Argentina"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            17.578125,
                            16.636191878397664
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "Australia"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            19.6875,
                            30.14512718337613
                        ]
                    }
                }
            ]
        };
        let prevent: Function = (): void => {
            //Prevent Function
        };
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);

            label = new Maps({
                layers: [{
                    shapeSettings: {
                        fill: '#C3E6ED'
                    },
                    shapeData: World_Map,
                },
                {
                    type: 'SubLayer',
                    shapeData: empty_Map,
                    dataLabelSettings: {
                        visible: true,
                        labelPath: 'name'
                    },
                }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            label.destroy();
        });
        it('checking with datalabel with intersection', () => {
            label.loaded = (args: ILoadedEventArgs) => {
            };
            label.layers[1].dataLabelSettings.intersectionAction= "Hide"; 
            label.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
