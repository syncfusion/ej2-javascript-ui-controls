import { Sparkline, ISparklineLoadedEventArgs, SparklineTooltip } from '../../src/sparkline/index';
import { removeElement, getIdElement, Rect } from '../../src/sparkline/utils/helper';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { MouseEvents } from './events.spec';
Sparkline.Inject(SparklineTooltip);
describe('Sparkline tooltip and tracker checking Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Sparkline default theme Spec', () => {
        let trigger: MouseEvents = new MouseEvents();
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            sparkline = new Sparkline({
                width: '400', height: '100',
                type: 'Column',
                containerArea: {
                    border: {                
                        width: 4
                    }
                },
                dataSource: [
                    { id: 10, value: 50 },
                    { id: 20, value: 30 },
                    { id: 30, value: -40 },
                    { id: 40, value: 10 },
                    { id: 50, value: -60 },
                    { id: 60, value: 20 },
                    { id: 70, value: 70 },
                    { id: 80, value: -55 },
                    { id: 90, value: 80 },
                    { id: 100, value: 45 }
                ], yName: 'value', xName: 'id',
                axisSettings:{
                    lineSettings:{
                        visible: true
                    }
                },
                rangeBandSettings: [
                    {
                        startRange: 1, endRange: 3, 
                    }
                ],
                dataLabelSettings:{
                    visible: ['All']
                },
                tooltipSettings: {
                    visible: true,
                    trackLineSettings: {
                        visible: true,
                        width: 2
                    }
                }
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline tracker line checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('#000000');
                expect(ele.getAttribute('stroke')).toBe('#000000');
            };
            sparkline.appendTo('#' + id);
        });

        it('Sparkline tooltip checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_text');
                expect(ele.firstChild.textContent).toBe('50');
                expect(ele.lastChild.textContent).toBe('50');
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('#000000');
                expect(ele.getAttribute('stroke')).toBe('#000000');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline tooltip fill checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_path');
                expect(ele.getAttribute('fill')).toBe('#000816');
            };
            sparkline.appendTo('#' + id);
        });
        it('checking the axisLineColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_Sparkline_XAxis');
                expect(ele.getAttribute('stroke')).toBe('#000000');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the dataLabelColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_label_text_0');
                expect(ele.getAttribute('fill')).toBe('rgba(97, 97, 97, 1)');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the rangeBandColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_rangeBand_0');
                expect(ele.getAttribute('fill')).toBe('#000000');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the background',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_SparklineBorder');
                expect(ele.getAttribute('fill')).toBe('#FFFFFF');
            }
            sparkline.appendTo('#' + id);
        })
    });

    
    describe('Sparkline MaterialDark theme Spec', () => {
        let trigger: MouseEvents = new MouseEvents();
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            sparkline = new Sparkline({
                theme:'MaterialDark',
                width: '400', height: '100',
                type: 'Column',
                containerArea: {
                    border: {                
                        width: 4
                    }
                },
                dataSource: [
                    { id: 10, value: 50 },
                    { id: 20, value: 30 },
                    { id: 30, value: -40 },
                    { id: 40, value: 10 },
                    { id: 50, value: -60 },
                    { id: 60, value: 20 },
                    { id: 70, value: 70 },
                    { id: 80, value: -55 },
                    { id: 90, value: 80 },
                    { id: 100, value: 45 }
                ], yName: 'value', xName: 'id',
                axisSettings:{
                    lineSettings:{
                        visible: true
                    }
                },
                rangeBandSettings: [
                    {
                        startRange: 1, endRange: 3, 
                    }
                ],
                dataLabelSettings:{
                    visible: ['All']
                },
                tooltipSettings: {
                    visible: true,
                    trackLineSettings: {
                        visible: true,
                        width: 2
                    }
                }
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline tracker line checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('#ffffff');
                expect(ele.getAttribute('stroke')).toBe('#ffffff');
            };
            sparkline.appendTo('#' + id);
        });

        it('Sparkline tooltip checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_text');
                expect(ele.firstChild.textContent).toBe('50');
                expect(ele.lastChild.textContent).toBe('50');
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('#ffffff');
                expect(ele.getAttribute('stroke')).toBe('#ffffff');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline tooltip fill checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_path');
                expect(ele.getAttribute('fill')).toBe('#F4F4F4');
            };
            sparkline.appendTo('#' + id);
        });
        it('checking the axisLineColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_Sparkline_XAxis');
                expect(ele.getAttribute('stroke')).toBe('#ffffff');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the dataLabelColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_label_text_0');
                expect(ele.getAttribute('fill')).toBe('rgba(255, 255, 255, 0.6)');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the rangeBandColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_rangeBand_0');
                expect(ele.getAttribute('fill')).toBe('#ffffff');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the background',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_SparklineBorder');
                expect(ele.getAttribute('fill')).toBe('#000000');
            }
            sparkline.appendTo('#' + id);
        })
    });

    describe('Sparkline bootstrap4 theme Spec', () => {
        let trigger: MouseEvents = new MouseEvents();
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            sparkline = new Sparkline({
                theme:'Bootstrap4',
                width: '400', height: '100',
                type: 'Column',
                containerArea: {
                    border: {                
                        width: 4
                    }
                },
                dataSource: [
                    { id: 10, value: 50 },
                    { id: 20, value: 30 },
                    { id: 30, value: -40 },
                    { id: 40, value: 10 },
                    { id: 50, value: -60 },
                    { id: 60, value: 20 },
                    { id: 70, value: 70 },
                    { id: 80, value: -55 },
                    { id: 90, value: 80 },
                    { id: 100, value: 45 }
                ], yName: 'value', xName: 'id',
                axisSettings:{
                    lineSettings:{
                        visible: true
                    }
                },
                rangeBandSettings: [
                    {
                        startRange: 1, endRange: 3, 
                    }
                ],
                dataLabelSettings:{
                    visible: ['All']
                },
                tooltipSettings: {
                    visible: true,
                    trackLineSettings: {
                        visible: true,
                        width: 2
                    }
                }
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline tracker line checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('#212529');
                expect(ele.getAttribute('stroke')).toBe('#212529');
            };
            sparkline.appendTo('#' + id);
        });

        it('Sparkline tooltip checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_text');
                expect(ele.firstChild.textContent).toBe('50');
                expect(ele.lastChild.textContent).toBe('50');
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('#212529');
                expect(ele.getAttribute('stroke')).toBe('#212529');
                expect(ele.getAttribute('opacity')).toBe('1');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline tooltip fill checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_path');
                expect(ele.getAttribute('fill')).toBe('#212529');
            };
            sparkline.appendTo('#' + id);
        });
        it('checking the axisLineColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_Sparkline_XAxis');
                expect(ele.getAttribute('stroke')).toBe('#6C757D');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the dataLabelColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_label_text_0');
                expect(ele.getAttribute('fill')).toBe('#495057');
                expect(ele.getAttribute('font-family')).toBe('Helvetica')
                
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the rangeBandColor',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_rangeBand_0');
                expect(ele.getAttribute('fill')).toBe('#212529');
            }
            sparkline.appendTo('#' + id);
        })
        it('checking the background',() =>{
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_SparklineBorder');
                expect(ele.getAttribute('fill')).toBe('#FFFFFF');
            }
            sparkline.appendTo('#' + id);
        })
    });
});