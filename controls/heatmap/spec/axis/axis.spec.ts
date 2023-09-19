import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { MouseEvents } from '../base/event.spec';
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';

describe('Heatmap Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Axis properties and behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let text: HTMLElement;
        let created: EmitType<Object>;
        let trigger: MouseEvents = new MouseEvents();
        let data: number[][]=[
            [1,2,3,4,5],
            [1,2,3,4,5],
            [1,2,3,4,5],
            [1,2,3,4,5],
            [1,2,3,4,5],
        ]
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                dataSource:data,
                legendSettings:{
                    visible:false
                },
                xAxis:{
                    labels:["test","test1","test2","test3","test4"],
                    textStyle: {
                        textOverflow: 'None'
                    }
                },
                yAxis:{
                    labels:["test","test1","test2","test3","test4"],
                    textStyle: {
                        textOverflow: 'None'
                    }
                },
                paletteSetting:{
                   palette: [
                        {color: "rgb(255, 153, 204)"},
                        {color: "rgb(255, 0, 0)"},
                        {color: "rgb(255, 255, 0)"}
                    ],
                }
            });
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#container');
        });
        it('Row Wise Mnimum and Maximum', function () {
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.paletteSettings.colorGradientMode = 'Row';
            heatmap.yAxis.isInversed = false;
            heatmap.refresh();
            expect(heatmap.dataMax[0]).toBe(5);
        });
        it('Coloumn Wise Mnimum and Maximum', function () {
            heatmap.paletteSettings.colorGradientMode = 'Column';
            heatmap.xAxis.isInversed = true;
            heatmap.refresh();
            expect(heatmap.dataMax[1]).toBe(5);
            heatmap.cellSettings.tileType = 'Bubble';
            heatmap.cellSettings.bubbleType = 'SizeAndColor';
            heatmap.refresh();
            expect(heatmap.dataMax[1]).toBe(5);
            heatmap.cellSettings.tileType = 'Rect';
            heatmap.cellSettings.bubbleType = 'Color';
            heatmap.paletteSettings.colorGradientMode = 'Table';
            heatmap.xAxis.isInversed = false;
            heatmap.refresh();
        });
        it('Check the MultipleRow label intersect action for x-axis', function () {
            heatmap.xAxis.labelIntersectAction = "MultipleRows";
            heatmap.height = '250px';
            heatmap.width = '300px';
            heatmap.xAxis = {
                    labels:["test","test1test1test1test1","test2","test3test3test3","test4"]
                }
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == 'test1test1test1test1').toBe(true);
            heatmap.xAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == 'test1test1test1test1').toBe(true);
            heatmap.xAxis.opposedPosition = true;
            heatmap.refresh();
            expect(text.textContent == 'test1test1test1test1').toBe(true);
            heatmap.xAxis = {
                labels:["test","test1","test2","test3","test4"]
            }
            heatmap.height = '';
            heatmap.width = '';
            heatmap.xAxis.labelIntersectAction = "Trim";
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.opposedPosition = false;
            heatmap.refresh();
        });
        it('Checking x-axis title', () => {
            heatmap.xAxis.title.text = "XAxis";
            heatmap.showTooltip = false;
            heatmap.dataBind();
            text = document.getElementById('container_XAxisTitle');
            expect(text.textContent == 'XAxis').toBe(true);            
        });
        it('Checking x-axis title with text alignment', () => {
         heatmap.xAxis.title.textStyle.textAlignment ="Near";
            heatmap.refresh();
            text = document.getElementById('container_XAxisTitle');
            expect(text.textContent == 'XAxis').toBe(true);            
            expect(text.getAttribute('x') == '43' || text.getAttribute('y') == '436').toBe(true);
        });
        it('Checking x-axis title with text alignment', () => {
            heatmap.xAxis.title.textStyle.textAlignment ="Far";
            heatmap.refresh();
            text = document.getElementById('container_XAxisTitle');
            expect(text.textContent == 'XAxis').toBe(true);   
            expect(text.getAttribute('x') == '757' || text.getAttribute('x') == '759' || text.getAttribute('y') == '436' || text.getAttribute('y') == '436.25').toBe(true);
        });
        it('Checking opposed position for x-axis', () => {
            heatmap.xAxis.opposedPosition = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxisLine');   
            expect((text.getAttribute('x1') == '46' || text.getAttribute('x1') == '43') && (text.getAttribute('y1') == '62' || text.getAttribute('y1') == '60')).toBe(true);
        });

        it('Checking x-axis with inversed', () => {
            heatmap.xAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);
            expect((text.getAttribute('x') == '667.8' || text.getAttribute('x') == '678.9' || text.getAttribute('x') == '687.4') && (text.getAttribute('y') == '52' || text.getAttribute('y') == '50')).toBe(true);
        });

        //y-axis
        it('Checking y-axis title', () => {
            heatmap.yAxis.title.text = "YAxis";
            heatmap.dataBind();
            text = document.getElementById('container_YAxisTitle');
            expect(text.textContent == 'YAxis').toBe(true);            
        });
        it('Checking y-axis title with text alignment', () => {
            heatmap.yAxis.title.textStyle.textAlignment ="Near";
               heatmap.refresh();
               text = document.getElementById('container_YAxisTitle');
               expect(text.textContent == 'YAxis').toBe(true);           
               expect((text.getAttribute('x') == '36' || text.getAttribute('x') == '35') && text.getAttribute('y') == '420').toBe(true);
           });
           it('Checking y-axis title with text alignment', () => {
               heatmap.yAxis.title.textStyle.textAlignment ="Far";
               heatmap.refresh();
               text = document.getElementById('container_YAxisTitle');
               expect(text.textContent == 'YAxis').toBe(true);           
               expect((text.getAttribute('x') == '36' || text.getAttribute('x') == '35') && (text.getAttribute('y') == '42' || text.getAttribute('y') == '40')).toBe(true);
           });
           it('Checking y-axis enableTrim support', () => {
                heatmap.yAxis.enableTrim = true;
                heatmap.yAxis.maxLabelLength = 15;
                heatmap.refresh();
                text = document.getElementById('container_YAxis_Label0');
                expect(text.innerHTML === 't...').toBe(true);
                heatmap.xAxis.enableTrim = true;
                heatmap.yAxis.maxLabelLength = 15;
                heatmap.xAxis.labelIntersectAction = 'None';
                heatmap.refresh();
                text = document.getElementById('container_XAxis_Label0');
                expect(text.innerHTML === 'test').toBe(true);
                heatmap.yAxis.opposedPosition = true;
                heatmap.refresh();
                heatmap.yAxis.enableTrim = false;
                heatmap.xAxis.enableTrim = false;
                heatmap.yAxis.opposedPosition = false;
                heatmap.xAxis.labelIntersectAction = 'Trim';
                heatmap.xAxis.valueType = 'Category';
                heatmap.refresh();
            });
           it('Checking opposed position for y-axis', () => {
               heatmap.yAxis.opposedPosition = true;
               heatmap.refresh();
               text = document.getElementById('container_YAxisLine');
              expect((text.getAttribute('x1') == '686' || text.getAttribute('x1') == '701' || text.getAttribute('x1') == '962' || text.getAttribute('x1') == '62') && (text.getAttribute('y1') == '62' || text.getAttribute('y1') == '60' || text.getAttribute('y1') == '962')).toBe(true);
           });

           it('Checking y-axis with inversed', () => {
            heatmap.yAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);  
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.labelRotation = 45;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);
            expect((text.getAttribute('x') == '77.6' || text.getAttribute('x') == '79.1' || text.getAttribute('x') == '105.2') && (text.getAttribute('y') == '49.85407638549805' || text.getAttribute('y') == '53.170817375183105' || text.getAttribute('y') == '53.12965965270996')).toBe(true);
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.labelRotation = 405;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);
            expect((text.getAttribute('x') == '77.6' || text.getAttribute('x') == '79.1' || text.getAttribute('x') == '105.19999694824219') && (text.getAttribute('y') == '49.85407638549805' || text.getAttribute('y') == '53.170817375183105' || text.getAttribute('y') == '53.129661560058594')).toBe(true);
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.labelRotation = 270;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);
            expect((text.getAttribute('x') == '77.6' || text.getAttribute('x') == '79.1' || text.getAttribute('x') == '105.19999694824219') && (text.getAttribute('y') == '49.0068359375' || text.getAttribute('y') == '52.283203125' || text.getAttribute('y') == '53.129661560058594')).toBe(true);
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.labelRotation = 0;
            heatmap.xAxis.interval = 2;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');        
            expect(text.textContent == 'test2').toBe(true);  
        });
        it('Checking x-axis with label rotation without trim', function () {
            heatmap.xAxis.labelRotation = 180;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.labelIntersectAction = "None";
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == 'test1').toBe(true);
            expect((text.getAttribute('x') == '212.79999999999998' || text.getAttribute('x') == '217.29999999999998' || text.getAttribute('x') == '295.6000061035156') && (text.getAttribute('y') == '44' || text.getAttribute('y') == '43')).toBe(true);
        });
        it('Checking x-axis with label rotation without trim in opposed position', function () {
            heatmap.xAxis.labelRotation = 45;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.opposedPosition = false;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == 'test1').toBe(true);
            expect((text.getAttribute('x') == '212.79999999999998' || text.getAttribute('x') == '217.29999999999998' || text.getAttribute('x') == '295.6000061035156') && (text.getAttribute('y') == '399.0218563079834' || text.getAttribute('y') == '399.15960693359375' || text.getAttribute('y') == '402.0345344543457')).toBe(true);
        });
        it('Checking x-axis with minimum and maximum', () => {
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.minimum =1;
            heatmap.xAxis.maximum = 6;
            heatmap.xAxis.opposedPosition = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test1').toBe(true);  
            text = document.getElementById('container_XAxis_Label5');        
            expect(text.textContent == '6').toBe(true);  
        });
        it('Checking x-axis with minimum and maximum', () => {
            heatmap.xAxis.minimum =6;
            heatmap.xAxis.maximum = 1;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test1').toBe(true);  
            text = document.getElementById('container_XAxis_Label5');        
            expect(text.textContent == '6').toBe(true);  
        });

        it('Checking x-axis with numeric value type', () => {
            heatmap.xAxis.labels = [];
            heatmap.xAxis.valueType = "Numeric";
            heatmap.xAxis.minimum = 0;
            heatmap.xAxis.maximum = 10;
            heatmap.xAxis.interval = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0').toBe(true);
            text = document.getElementById('container_XAxis_Label10');
            expect(text.textContent == '10').toBe(true); 
        });

        it('Checking x-axis with numeric value type', function () {
            heatmap.xAxis.valueType = "Numeric";
            heatmap.xAxis.minimum = 10;
            heatmap.xAxis.maximum = 1;
            heatmap.xAxis.interval = 2;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == '3').toBe(true);
        });
        it('Checking x-axis with numeric value type', function () {
            heatmap.xAxis.valueType = "Numeric";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum =null;
            heatmap.xAxis.labelFormat = "{value}%";
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0%').toBe(true);
        });

        //Date Time axis
        it('Checking date time axis', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum =null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0').toBe(true);
        });
        it('Checking date time axis with minimum and maximum', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum =new Date(2018,0,4);
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '1/1/2018').toBe(true);
        });
        it('Checking date time axis with minimum', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == '1/5/2018').toBe(true);
        });
        it('Checking date time axis with maximum', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum = new Date(2018,0,6);
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '1/2/2018').toBe(true);
        });

        it('Checking date time axis with Years interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Years",
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum = new Date(2022,0,1);
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == 'Jan 2018').toBe(true);
        });
        it('Checking date time axis with Months interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Months",
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == 'Jan 1').toBe(true);
        });
        it('Checking date time axis with Hours interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Hours",
            heatmap.xAxis.minimum = new Date(2018,0,1,10);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == 'Mon 14:00').toBe(true);
        });
        it('Checking date time axis with Minutes interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Minutes",
            heatmap.xAxis.minimum = new Date(2018,0,1,10,10);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == '10:14:00').toBe(true);
        });
        //Check label intersect action 
        it('Check the Rotate45 label intersect action for x-axis', function () {
            heatmap.xAxis.valueType = "Category";
            heatmap.xAxis.labels = ["India","America","Australia","Srilanka","South Africa"];
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = null,
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = "";
            heatmap.xAxis.labelIntersectAction = "Rotate45";
            heatmap.height = "600px";
            heatmap.width ="300px",
            heatmap.dataSource = [
                [1,2,3,4,5],
                [6,7,8,9,10],
                [11,12,13,14,15],
                [16,17,18,19,20],
                [21,22,23,24,25],
            ],
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect((text.getAttribute('x') == '31.8' || text.getAttribute('x') == '32.2' || text.getAttribute('x') == '33.2') && (text.getAttribute('y') == '74.59728813171387' || text.getAttribute('y') == '75.0620174407959' || text.getAttribute('y') == '65.45541954040527')).toBe(true);
        });
        it('Check the Rotate45 label intersect action for x-axis', function () {
            heatmap.xAxis.labelIntersectAction = "Rotate45";
            heatmap.xAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect((text.getAttribute('x') == '206.2' || text.getAttribute('x') == '209.8' || text.getAttribute('x') == '218.8') && (text.getAttribute('y') == '74.59728813171387' || text.getAttribute('y') == '78.10599708557129' || text.getAttribute('y') == '65.45541954040527')).toBe(true);
        });
        it('Checking auto increment in numeric axis', function () {
            heatmap.xAxis.labelIntersectAction = "Trim";
            heatmap.xAxis.valueType = "Numeric";
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == "1").toBe(true);
            heatmap.xAxis.increment = 3;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == "3").toBe(true);
        });
        it('Checking auto increment in date time axis', function () {
            heatmap.yAxis.valueType = "DateTime";
            heatmap.yAxis.minimum = new Date(2017, 0, 1);
            heatmap.yAxis.intervalType = "Months";
            heatmap.yAxis.increment = 3;
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Apr 1").toBe(true);
        });
        it('Checking yAxis with interval type-Months and showLabelOn-Years', function () {
            heatmap.dataSource = [
                [10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 16, 15, 12, 10, 8, 7, 7, 10, 14, 17, 18, 18, 10, 8,7, 7, 10, 20, 15, 18,
                     20, 21, 20, 20, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 16, 15, 12, 10, 8, 7, 7, 20, 10, 20, 15, 18, 20, 21, 20, 20,18],
                [10, 8, 7, 6, 8, 13, 15, 17, 20, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19,
                     19, 20, 17, 12, 10, 8, 7, 6, 8, 13, 15, 17, 20, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 12,22],
                [12, 10, 8, 7, 7, 10, 20, 15, 18, 20, 21, 20, 17, 10, 8, 10, 8, 7, 7, 10, 14, 17, 18, 18, 7, 7, 10, 14, 17, 18, 18,
                     17, 16, 15,12, 10, 20, 8, 7, 7, 10, 20, 15, 18, 20, 21, 20, 17, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 16, 15,24],
                [11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15,  10, 8, 7, 7, 10, 14, 17, 18, 18,15, 15, 16, 20, 22, 20, 21,
                     21, 21, 19,11, 9, 20, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15, 15, 15, 16, 20, 22, 20, 21, 21,19, 21, 19],
                [15, 15, 15, 15, 16, 20, 22, 20, 21, 10, 8, 7, 7, 10, 14, 17, 18, 18, 21, 21, 19, 18, 13, 13, 12, 12, 20, 12, 15, 18, 21,
                     22, 20, 21, 19, 15, 15, 15, 15, 16, 20, 22, 20, 21, 21, 21, 19, 18, 13, 13, 12, 12, 20, 12, 15, 18,17, 21, 22, 21, 19],
                [10, 8, 7, 6, 8, 13, 15, 17, 20, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 20,
                     17, 12, 10, 8, 7, 6, 8, 13, 15, 17, 20, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 12,22],
                [13, 13, 12, 12, 20, 12, 15, 18, 21, 22, 10, 8, 7, 7, 10, 14, 17, 18, 18, 21, 19, 11, 10, 9, 9, 10, 12, 20, 14, 16, 17, 17,
                     20, 16, 16, 13, 13, 12, 12, 20, 12, 15, 18, 21, 22, 21, 19, 11, 10, 9, 9, 10, 12, 20, 14, 16, 17,15, 17, 16, 16],
                [11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15,  10, 8, 7, 7, 10, 14, 17, 18, 18,15, 15, 16, 20, 22, 20, 21, 21,
                     21, 19,11, 9, 20, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15, 15, 15, 16, 20, 22, 20, 21, 21,19, 21, 19],
                [11, 10, 9, 9, 10, 12, 20, 14, 16, 17, 17, 16, 13, 13, 12, 10, 8, 7, 7, 10, 14, 17, 18, 18, 11, 10, 9, 9, 10, 12, 20, 14,
                     20, 16, 17, 17, 16, 13, 13, 12, 12, 20, 12, 15, 18, 21, 22, 21, 25, 14, 12, 20, 12, 15, 18, 21, 22,16, 21, 25, 14,]
            ];
            heatmap.yAxis.increment = 1;
            heatmap.yAxis.showLabelOn = "Years";
            heatmap.yAxis.labelFormat = "MMM/dd/y";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Jan/01/2018").toBe(true);
        });
        it('Checking yAxis with interval type-Days and showLabelOn-Months', function () {
            heatmap.yAxis.showLabelOn = "Months";
            heatmap.yAxis.intervalType = "Days";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Feb/01/2017").toBe(true);
        });
        it('Checking yAxis with interval type-Hours and showLabelOn-Days', function () {
            heatmap.yAxis.showLabelOn = "Days";
            heatmap.yAxis.intervalType = "Hours";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Jan/02/2017").toBe(true);
        });
        it('Checking yAxis with interval type-Minutes and showLabelOn-Hours', function () {
            heatmap.yAxis.showLabelOn = "Hours";
            heatmap.yAxis.intervalType = "Minutes";
            heatmap.yAxis.labelFormat = "hh:mm:ss";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "01:00:00").toBe(true);
        });
        it('Checking auto increment in date time axis in xaxis', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.width = '200px';
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.labelRotation = 0;
            heatmap.xAxis.minimum = new Date(2017, 0, 1);
            heatmap.xAxis.intervalType = "Months";
            heatmap.xAxis.increment = 3;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label2');
            expect(text.textContent == "Jul..." || text.textContent == "Ju...").toBe(true);
        });
        it('Checking axis tooltip position when it crosses the SVG rect', () => {
            heatmap.xAxis.opposedPosition = false;
            heatmap.xAxis.title.text = '';
            heatmap.yAxis.opposedPosition = false;
            heatmap.height = '400px';
            heatmap.width ='250px'
            heatmap.margin.bottom = 0;
            heatmap.margin.right = 0;
            heatmap.refresh();
            let Element: HTMLElement = document.getElementById('container_XAxis_Label8');
            let region: ClientRect = Element.getBoundingClientRect();
            trigger.mousemoveEvent(Element, 0, 0, region.left + 5, region.top + 5, false);
            let tooltip: HTMLElement = document.getElementById('container_axis_Tooltip');
            expect(tooltip.style.top === '352px' || tooltip.style.top === '355px' ).toBe(true);
        });
        it('Checking x-axis border type -brace ', function () {
            heatmap.width = '400px';
            heatmap.xAxis.border.width = 1;
            heatmap.xAxis.border.type = 'Brace';
            heatmap.refresh();
            expect(document.getElementById('containerXAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking x-axis border type - WithoutTopBorder', function () {
            heatmap.xAxis.border.type = 'WithoutTopBorder';
            heatmap.renderingMode = 'Canvas';
            heatmap.xAxis.multiLevelLabels= [
                {
                    border: { color: '#b5b5b5', type: 'WithoutTopBorder'},
                    categories: [
                        { start: 0, end: 8, text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
        });
        it('Checking x-axis border type - WithoutBottomBorder', function () {
            heatmap.renderingMode = 'SVG';
            heatmap.xAxis.border.type = 'WithoutBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerXAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking x-axis border type - WithoutTopandBottomBorder', function () {
            heatmap.xAxis.border.type = 'WithoutTopandBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerXAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type -brace ', function () {
             heatmap.yAxis.border.type = 'Brace';
             heatmap.yAxis.border.width = 1;
             heatmap.yAxis.interval = 1;
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type - WithoutTopBorder', function () {
            heatmap.yAxis.border.type = 'WithoutTopBorder';
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type - WithoutBottomBorder', function () {
            heatmap.yAxis.border.type = 'WithoutBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type - WithoutTopandBottomBorder', function () {
            heatmap.yAxis.border.type = 'WithoutTopandBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking x-axis grouping ', function () {
            heatmap.width = '400px';
            heatmap.renderingMode = 'SVG';
            heatmap.xAxis.multiLevelLabels= [
                {
                    alignment: 'Near',
                    overflow: 'None',
                    border: { color: '#b5b5b5', type: 'WithoutBottomBorder' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 1 Testing 1 Testing 1 Testing 1'},
                        { start: 5, end: 8, text: 'Testing 2', },
                    ]
                },
                {
                    border: { color: '#b5b5b5', type: 'WithoutTopBorder'},
                    categories: [
                        { start: 0, end: 8, text: 'Testing 3', },
                    ]
                },
                {
                    alignment: 'Far',
                    border: { color: '#b5b5b5', type: 'WithoutTopandBottomBorder' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 4', },
                    ]
                },
                
            ];
            heatmap.refresh();
            text = document.getElementById('container_XAxis_MultiLevel1_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking x-axis grouping with trimmed label', function () {
            heatmap.xAxis.valueType = 'Numeric',
            heatmap.xAxis.minimum = 1,
            heatmap.xAxis.multiLevelLabels= [
                {
                    overflow: 'Trim',
                    border: { color: '#b5b5b5', type: 'WithoutBottomBorder' },
                    categories: [
                        { start: 1, end: 4, text: 'Testing 1 Testing 1 Testing 1 Testing 1', maximumTextWidth: 30},
                        { start: 5, end: 8, text: 'Testing 2', },
                    ]
                }
            ];
            heatmap.dataBind();
            text = document.getElementById('container_XAxis_MultiLevel0_Text0');
            expect(text.textContent == "Te..." || text.textContent == 'T...').toBe(true);
        });
        it('Checking x-axis grouping with inversed axis and opposed position', function () {
            heatmap.xAxis.isInversed = true;
            heatmap.xAxis.valueType = 'DateTime',
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.opposedPosition = true;
            heatmap.xAxis.border.width = 1;
            heatmap.xAxis.multiLevelLabels= [
                {
                    overflow:'Trim',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start:'1/1/2017', end: '1/5/2017',  text: 'Testing 1 Testing 1 Testing 1 Testing 1', maximumTextWidth: 30},
                        { start: 6, end: 8, text: 'Testing 2', },
                    ]
                },
                {
                    alignment:'Far',
                    border: { color: '#b5b5b5', type: 'Brace' },
                    categories: [
                        { start: 0, end: 8, text: 'Testing 3', },
                    ]
                },
                {
                    alignment:'Near',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 4', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_XAxis_MultiLevel0_Text0');
            expect(text.textContent == "Te..." || text.textContent == 'T...').toBe(true);
        });
        it('Checking y-axis grouping with opposed position', function () {
            heatmap.yAxis.opposedPosition = true;
            heatmap.yAxis.showLabelOn = 'None';
            heatmap.yAxis.multiLevelLabels= [
                {
                    alignment: 'Near',
                    border: { width: 1, type: 'WithoutTopandBottomBorder' },
                    categories: [
                        { start: 0, end: 6,  text: 'Testing 1'},
                        { start: 7, end: 11, text: 'Testing 2', },
                    ]
                },
                {
                    border: { color: '#b5b5b5', type: 'WithoutBottomBorder'},
                    categories: [
                        { start: 0, end: 11, text: 'Testing 3', },
                    ]
                },
                {
                    alignment: 'Far',
                    border: { color: '#b5b5b5', type: 'WithoutTopBorder' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 4', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel0_Text0');
            expect(text.textContent == "Testing 1").toBe(true);
        });
        it('Checking y-axis grouping with inversed axis', function () {
            heatmap.yAxis.isInversed = false;
            heatmap.yAxis.opposedPosition = false;
            heatmap.yAxis.intervalType = 'Minutes';
            heatmap.yAxis.multiLevelLabels= [
                {
                    overflow: 'Trim',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start: 0, end: 6, text: 'Testing 1', maximumTextWidth: 30},
                        { start: 7, end: 11, text: 'Testing 2', },
                    ]
                },
                {
                    alignment: 'Far',
                    border: { color: '#b5b5b5', type: 'Brace' },
                    categories: [
                        { start: new Date(2017, 0, 1), end: new Date(2017, 0, 11), text: 'Testing 3', },
                    ]
                },
                {
                    alignment: 'Near',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start: new Date(2017, 0, 1, 12, 0), end: new Date(2017, 0, 5, 12, 9), text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel1_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking y-axis grouping with interval type hours', function () {
            heatmap.yAxis.intervalType = 'Hours';
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel1_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking y-axis grouping with interval type years', function () {
            heatmap.yAxis.intervalType = 'Years';
            heatmap.yAxis.multiLevelLabels= [
                {
                    categories: [
                        { start: new Date(2017, 3, 1), end: new Date(2018, 5, 5), text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel0_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking border', function () {
            heatmap.yAxis.intervalType = 'Years';
            heatmap.cellSettings.border.width = 26;
            heatmap.xAxis.isInversed = true;
            heatmap.yAxis.isInversed = true;
            heatmap.yAxis.opposedPosition = true;
            heatmap.xAxis.opposedPosition = true;
            heatmap.yAxis.multiLevelLabels= [
                {
                    categories: [
                        { start: new Date(2017, 3, 1), end: new Date(2018, 5, 5), text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel0_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking x-axis with Category value type', function () {
            heatmap.xAxis.valueType = "Category";
            heatmap.xAxis.labels = ["India","America","Australia","Srilanka","South Africa"];
            heatmap.yAxis.valueType = "Category";
            heatmap.yAxis.labels = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'],
            heatmap.xAxis.labelFormat = "${value}";
            heatmap.yAxis.labelFormat = "${value}";
            heatmap.width ="1000px",
            heatmap.dataSource = [
                [1,2,3,4,5],
                [6,7,8,9,10],
                [11,12,13,14,15],
                [16,17,18,19,20],
                [21,22,23,24,25],
            ],
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '$India').toBe(true);
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == '$America').toBe(true);
            text = document.getElementById('container_XAxis_Label2');
            expect(text.textContent == '$Australia').toBe(true);
            text = document.getElementById('container_XAxis_Label3');
            expect(text.textContent == '$Srilanka').toBe(true);
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == '$South Africa').toBe(true);
            text = document.getElementById('container_YAxis_Label0');
            expect(text.textContent == '$Mon').toBe(true);
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == '$Tues').toBe(true);
            text = document.getElementById('container_YAxis_Label2');
            expect(text.textContent == '$Wed').toBe(true);
            text = document.getElementById('container_YAxis_Label3');
            expect(text.textContent == '$Thurs').toBe(true);
            text = document.getElementById('container_YAxis_Label4');
            expect(text.textContent == '$Fri').toBe(true);
        });
        it('Checking x-axis with Category value type', function () {
            heatmap.xAxis.valueType = "Category";
            heatmap.xAxis.labelFormat = "{value}%";
            heatmap.yAxis.labelFormat = "{value}%";
            heatmap.xAxis.labels = null;
            heatmap.yAxis.labels = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0%').toBe(true);
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == '1%').toBe(true);
            text = document.getElementById('container_XAxis_Label2');
            expect(text.textContent == '2%').toBe(true);
            text = document.getElementById('container_XAxis_Label3');
            expect(text.textContent == '3%').toBe(true);
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == '4%').toBe(true);
            text = document.getElementById('container_YAxis_Label0');
            expect(text.textContent == '0%').toBe(true);
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == '1%').toBe(true);
            text = document.getElementById('container_YAxis_Label2');
            expect(text.textContent == '2%').toBe(true);
            text = document.getElementById('container_YAxis_Label3');
            expect(text.textContent == '3%').toBe(true);
            text = document.getElementById('container_YAxis_Label4');
            expect(text.textContent == '4%').toBe(true);
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
    })
});

describe('Axis properties', () => {
    let heatmap: HeatMap;
    let ele: HTMLElement;
    let text: HTMLElement;
    let created: EmitType<Object>;
    let trigger: MouseEvents = new MouseEvents();
    let data: number[][] = [
        [73, 39, 26, 39, 94, 0],
        [93, 58, 53, 38, 26, 68],
        [99, 28, 22, 4, 66, 90],
        [14, 26, 97, 69, 69, 3],
        [7, 46, 47, 47, 88, 6],
        [41, 55, 73, 23, 3, 79],
        [56, 69, 21, 86, 3, 33],
        [45, 7, 53, 81, 95, 79],
        [60, 77, 74, 68, 88, 51],
        [25, 25, 10, 12, 78, 14],
        [25, 56, 55, 58, 12, 82],
        [74, 33, 88, 23, 86, 59]
    ]
    beforeAll((): void => {
        ele = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        heatmap = new HeatMap({
            dataSource: data,
            legendSettings: {
                visible: false
            },
            xAxis: {
                labels: ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Paul', 'Karin', 'Mario'],
            },
            yAxis: {
                labels: ['Peace', 'Energy', 'NASA', 'Health', 'Interior',
                    'Justice'],
                labelRotation: 270,
            },
            paletteSettings: {
                type: 'Gradient'
            },

        });
    });

    afterAll((): void => {
        heatmap.destroy();
    });
    it('Checking heatmap instance creation', (done: Function) => {
        created = (args: Object): void => {
            expect(heatmap != null).toBe(true);
            done();
        }
        heatmap.created = created;
        heatmap.appendTo('#container');
    });

    it('Checking y-axis with label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label0');
        expect(text.textContent == 'Peace').toBe(true);
        expect((text.getAttribute('x') == '18') && (text.getAttribute('y') == '388')).toBe(false);
    });

    it('Checking y-axis with label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label1');
        expect(text.textContent == 'Energy').toBe(true);
        expect((text.getAttribute('x') == '18') && (text.getAttribute('y') == '320.6666666666667')).toBe(false);
    });

    it('Checking y-axis with label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label2');
        expect(text.textContent == 'NASA').toBe(true);
        expect((text.getAttribute('x') == '18') && (text.getAttribute('y') == '253.33333333333337')).toBe(false);
    });

    it('Checking y-axis with label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label3');
        expect(text.textContent == 'Health').toBe(true);
        expect((text.getAttribute('x') == '18') && (text.getAttribute('y') == '186.00000000000006')).toBe(false);
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});

describe('Axis properties', () => {
    let heatmap: HeatMap;
    let ele: HTMLElement;
    let text: HTMLElement;
    let created: EmitType<Object>;
    let data: number[][] = [
        [73, 39, 26, 39, 94, 0],
        [93, 58, 53, 38, 26, 68],
        [99, 28, 22, 4, 66, 90],
        [14, 26, 97, 69, 69, 3],
        [7, 46, 47, 47, 88, 6],
        [41, 55, 73, 23, 3, 79],
        [56, 69, 21, 86, 3, 33],
        [45, 7, 53, 81, 95, 79],
        [60, 77, 74, 68, 88, 51],
        [25, 25, 10, 12, 78, 14],
        [25, 56, 55, 58, 12, 82],
        [74, 33, 88, 23, 86, 59]
    ]
    beforeAll((): void => {
        ele = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        heatmap = new HeatMap({
            dataSource: data,
            legendSettings: {
                visible: false
            },
            xAxis: {
                labels: ['Nancy Andrew Andrew', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Paul', 'Karin', 'Mario'],
                textStyle: {
                    textOverflow: 'Wrap'
                }
            },
            yAxis: {
                labels: ['Peace Justice', 'Energy', 'NASA', 'Health', 'Interior',
                    'Justice'],
                textStyle: {
                    textOverflow: 'Wrap'
                }
            },
            paletteSettings: {
                type: 'Gradient'
            },

        });
    });

    afterAll((): void => {
        heatmap.destroy();
    });
    it('Checking heatmap instance creation', (done: Function) => {
        created = (args: Object): void => {
            expect(heatmap != null).toBe(true);
            done();
        }
        heatmap.created = created;
        heatmap.appendTo('#container');
    });

    it('Checking y-axis without label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label0');
        expect(text.textContent == 'PeaceJustice').toBe(true);
        expect((text.getAttribute('x') == '45') && (text.getAttribute('y') == '357.6666666666667' || text.getAttribute('y') == '343' || text.getAttribute('y') == '346.25')).toBe(true);
    });

    it('Checking x-axis without label rotation', function () {
        heatmap.xAxis.isInversed = false;
        heatmap.refresh();
        text = document.getElementById('container_XAxis_Label0');
        expect(text.textContent == 'Nancy AndrewAndrew' || text.textContent == 'NancyAndrewAndrew').toBe(true);
        expect((text.getAttribute('x') == '56.291666666666664' || text.getAttribute('x') == '84.33333333333333' || text.getAttribute('x') == '55.583333333333336') && (text.getAttribute('y') == '416' || text.getAttribute('y') == '402.5')).toBe(true);
    });

    it('Checking y-axis with label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label0');
        expect(text.textContent == 'PeaceJustice').toBe(true);
        expect((text.getAttribute('x') == '18' || text.getAttribute('x') == '17') && (text.getAttribute('y') == '365.6666666666667' || text.getAttribute('y') == '353.75')).toBe(true);
    });

    it('Checking x-axis with label rotation', function () {
        heatmap.xAxis.isInversed = false;
        heatmap.xAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_XAxis_Label0');
        expect(text.textContent == 'Nancy AndrewAndrew' || text.textContent == 'NancyAndrewAndrew').toBe(true);
        expect((text.getAttribute('x') == '83.91666666666666' || text.getAttribute('x') == '63.58333333333333' || text.getAttribute('x') == '83.20833333333334') && (text.getAttribute('y') == '401.3226547241211' || text.getAttribute('y') == '415.0703125')).toBe(true);
    });
    it('Checking x-axis label with line break', function () {
        heatmap.xAxis.isInversed = false;
        heatmap.xAxis = {
            labels: ['Nancy<br>Andrew', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Paul', 'Karin', 'Mario']
        }
        heatmap.refresh();
        text = document.getElementById('container_XAxis_Label0');
        expect(text.textContent == 'NancyAndrew').toBe(true);
        expect((text.getAttribute('x') == '83.20833333333334' || text.getAttribute('x') == '71.08333333333333' || text.getAttribute('x') == '83.91666666666666') && (text.getAttribute('y') == '412.0724620819092' || text.getAttribute('y') == '415.0703125')).toBe(true);
    });
    it('Checking y-axis label with line break', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis = {
            labels: ['Peace<br>Justice', 'Energy', 'NASA', 'Health', 'Interior', 'Justice']
        }
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label0');
        expect(text.textContent == 'PeaceJustice').toBe(true);
        expect((text.getAttribute('x') == '18' || text.getAttribute('x') == '17') && (text.getAttribute('y') == '350.3125' || text.getAttribute('y') == '354.2781575520833')).toBe(true);
    });
    it('Checking x-axis label with line break and label rotation', function () {
        heatmap.xAxis.isInversed = false;
        heatmap.xAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_XAxis_Label0');
        expect(text.textContent == 'NancyAndrew').toBe(true);
        expect((text.getAttribute('x') == '83.20833333333334' || text.getAttribute('x') == '71.08333333333333' || text.getAttribute('x') == '83.91666666666666') && (text.getAttribute('y') == '412.0724620819092' || text.getAttribute('y') == '415.0703125')).toBe(true);
    });
    it('Checking y-axis label with line break and label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 270;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label0');
        expect(text.textContent == 'PeaceJustice').toBe(true);
        expect((text.getAttribute('x') == '18' || text.getAttribute('x') == '17') && (text.getAttribute('y') == '350.3125' || text.getAttribute('y') == '354.2781575520833')).toBe(true);
    });
    it('Checking x-axis label with line break and label rotation', function () {
        heatmap.xAxis.isInversed = false;
        heatmap.xAxis.labelRotation = 0;
        heatmap.xAxis.enableTrim = true;
        heatmap.refresh();
        text = document.getElementById('container_XAxis_Label0');
        expect(text.textContent == 'Nan...' || text.textContent == 'Nancy...').toBe(true);
        expect((text.getAttribute('x') == '91.20833333333334' || text.getAttribute('x') == '78.58333333333333') && (text.getAttribute('y') == '432' || text.getAttribute('y') == '432.5')).toBe(true);
    });
    it('Checking y-axis label with line break and label rotation', function () {
        heatmap.yAxis.isInversed = false;
        heatmap.yAxis.labelRotation = 0;
        heatmap.yAxis.enableTrim = true;
        heatmap.refresh();
        text = document.getElementById('container_YAxis_Label0');
        expect(text.textContent == 'Peace...').toBe(true);
        expect((text.getAttribute('x') == '45' || text.getAttribute('x') == '17') && (text.getAttribute('y') == '380.3333333333333' || text.getAttribute('y') == '381.25')).toBe(true);
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
}); 