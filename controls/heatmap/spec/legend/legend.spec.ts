import { createElement, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface';
import { Legend, LegendSettings } from '../../src/heatmap/legend/legend';
import { Tooltip } from '../../src/heatmap/utils/tooltip';
import { MouseEvents } from '../base/event.spec'
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';
import { CellSettings } from '../../src';
import { ILegendRenderEventArgs } from '../../src/heatmap/model/interface';
HeatMap.Inject(Legend, Tooltip);

// export class MouseEvents {
//     public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
//         let mousemove: MouseEvent = document.createEvent('MouseEvent');
//         mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
//         element.dispatchEvent(mousemove);
//     }
// }

describe('Heatmap Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Heatmap Legend', () => {
        let heatmap: HeatMap;
        let legend: Legend = new Legend(heatmap);
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let legendElement: Element;
        let created: EmitType<Object>;
        let trigger: MouseEvents = new MouseEvents();
          beforeAll((): void => {
            ele = createElement('div', { id: 'heatmapContainer' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: '100%',
                height: '300px',
                xAxis: {
                    title: { text: 'Weekdays' },
                },
                yAxis: {
                    title: { text: 'YAxis' },
                },
                dataSource: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': 'rgb(255, 255, 153)', 'label': 'excellent' },
                    { 'value': 70, 'color': 'rgb(153, 255, 187)', 'label': 'good' },
                    { 'value': 25, 'color': 'rgb(153, 153, 255)', 'label': 'average' },
                    { 'value': 0, 'color': 'rgb(255, 159, 128)', 'label': 'poor' },
                    ],
                    type: 'Gradient'
                },
                legendSettings: {
                    visible: true,
                },
                showTooltip: false,
            });
        });

        afterAll((): void => {
               heatmap.destroy();
        });
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            };
            heatmap.created = created;
            heatmap.appendTo('#heatmapContainer');
        });
        it('Changing legend position to left', () => {
            heatmap.legendSettings.position = 'Left';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('x') == '20').toBe(true);
        });
        it('Changing legend position to Top', () => {
            heatmap.legendSettings.position = 'Top';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('y') == '26').toBe(true);
        });
        it('Changing legend position to Bottom',  () => {
            heatmap.legendSettings.position = 'Bottom';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('y') == '248' || tempElement.getAttribute('y') == '249').toBe(true);
        });
       it('Right Position with near alignment', () => {
            heatmap.legendSettings = {
                position : 'Right',
                height :'50%',
                alignment : 'Near'
            };
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('y') == '20').toBe(true);
        });
        it('Right Position with alignment far', () => {
            heatmap.legendSettings = {
               height :'50%',
               alignment : 'Far'
            };
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('y') == '134' || tempElement.getAttribute('y') == '135').toBe(true);
        });
        it('Right Position with center alignment', () => {
            heatmap.legendSettings = {
                height :'50%',
                alignment : 'Center'
            };
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('y') == '77' || tempElement.getAttribute('y') == '77.5').toBe(true);
        });
        it('Checking label text when no labels are present', () => {
            heatmap.paletteSettings.palette = [
                { 'value': 100, 'color': 'rgb(255, 255, 153)', 'label': 'excellent' },
                { 'value': 75, 'color': 'rgb(153, 255, 187)' },
                { 'value': 25, 'color': 'rgb(153, 153, 255)', 'label': 'average' },
                { 'value': 0, 'color': 'rgb(255, 159, 128)' }
            ];
            heatmap.refresh();
            expect(document.getElementById('heatmapContainer_Legend_Label2').textContent == '75').toBe(true);
            expect(document.getElementById('heatmapContainer_Legend_Label3').textContent == 'excellent').toBe(true);
        });
        it('Checking trim support in vertical direction', () => {
            heatmap.legendSettings.textStyle.textOverflow = 'Trim';
            heatmap.legendSettings.height = '';
            heatmap.refresh();
            let element : Element = document.getElementById('heatmapContainer_Legend_Label3');
            expect(element.textContent == 'ex...' || element.textContent == 'exc...').toBe(true);
        });
        
        it('Checking wrap support in vertical direction', () => {
            heatmap.paletteSettings.palette = [
                { 'value': 100, 'color': 'rgb(255, 255, 153)', 'label': 'text4text4text4' },
                { 'value': 70, 'color': 'rgb(153, 255, 187)', 'label': 'good' },
                { 'value': 25, 'color': 'rgb(153, 153, 255)', 'label': 'average' },
                { 'value': 0, 'color': 'rgb(255, 159, 128)', 'label': 'text1 text1 text1' },
            ];
            heatmap.legendSettings.textStyle.textOverflow = 'Wrap';
            heatmap.refresh();
            expect(document.getElementById('heatmapContainer_Legend_Label0').textContent == 'tex...tex...tex...' || document.getElementById('heatmapContainer_Legend_Label0').textContent == 'text1text1text1').toBe(true);
        });
        it('Checking trim support in horizontal direction', () => {
            heatmap.legendSettings.position = 'Bottom';
            heatmap.legendSettings.width = '20%';
            heatmap.legendSettings.textStyle.textOverflow = 'Trim';
            heatmap.refresh();
            expect(document.getElementById('heatmapContainer_Legend_Label1').textContent == 'a...').toBe(true);
        });

        it('Checking wrap support in horizontal direction', function () {
            tempElement = document.getElementById('heatmapContainer_LegendBound');
            expect(tempElement.getAttribute('height') == '58' || tempElement.getAttribute('height') == '57').toBe(true);
            heatmap.legendSettings.textStyle.textOverflow = 'Wrap';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_LegendBound');
            expect(tempElement.getAttribute('height') == '90' || tempElement.getAttribute('height') == '87').toBe(true);
        });
        it('Checking wrap support in top position', function () {
            heatmap.legendSettings.position = 'Top';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_LegendBound');
			expect(tempElement.getAttribute('height') == '90' || tempElement.getAttribute('height') == '87').toBe(true);
        });
        it('Checking legend label tooltip', () => {
            heatmap.legendSettings.textStyle.textOverflow = 'Trim';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_Legend_Label1');
            trigger.mousemoveEvent(legendElement, 5, 5, 715, 73, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 715, 100, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 715, 73, false);
            expect(document.getElementById('heatmapContainer_LegendLabel_Tooltip').textContent == 'average').toBe(true);
        });
        it('Checking Gradient pointer position in horizontal direction', () => {
            heatmap.legendSettings = {
                height : '',
                width : '',
            };
            heatmap.width = '100%';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_HeatMapRect_26');
            trigger.mousemoveEvent(legendElement, 10, 10, 646, 179, false);
            tempElement = document.getElementById('heatmapContainer_Gradient_Pointer');
            expect(heatmap.legendModule.gradientPointer != null).toBe(true);
        });
        it('Checking list type legend in horizontal direction', () => {
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_LegendBound');
            expect(heatmap.legendModule.listPerPage).toBe(1);
        });
        it('Checking list type legend in vertical direction',  () => {
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.legendSettings.height = '50%';
            heatmap.legendSettings.position = 'Right';
            heatmap.legendSettings.textStyle.textOverflow = 'None';
            heatmap.paletteSettings.palette = [
                { 'value': 80, 'color': 'rgb(0,91,162)', 'label': 'text8 text8 text8 text8' },
                { 'value': 70, 'color': 'rgb(19,171,17)', 'label': 'text7 text7 text7 text7' },
                { 'value': 60, 'color': 'rgb(255,255,1)', 'label': 'text6 text6 text6 text6' },
                { 'value': 50, 'color': 'rgb(254,0,2)', 'label': 'text5 text5 text5 text5 text5' },
                { 'value': 40, 'color': 'rgb(255, 255, 153)', 'label': 'text4 text4 text4 text4' },
                { 'value': 30, 'color': 'rgb(153, 255, 187)', 'label': 'text3 text3 text3 text3' },
                { 'value': 20, 'color': 'rgb(153, 153, 255)', 'label': 'text2  text2' },
                { 'value': 10, 'color': 'rgb(255, 159, 128)', 'label': 'text1 text1' },
            ];
                heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_LegendBound');
            expect(tempElement.getAttribute('y') == '67' || tempElement.getAttribute('y') == '67.5').toBe(true);
        });
        it('Checking list type legend in horizontal direction', function () {
            heatmap.legendSettings.width = '30%';
            heatmap.legendSettings.position = 'Bottom';
            heatmap.refresh();
            tempElement = document.getElementById('heatmapContainer_LegendBound');
            expect(tempElement.getAttribute('width') == '211.5' || tempElement.getAttribute('width') == '212.4' ).toBe(true);
        });
        it('List type legend with paging', () => {
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.legendSettings.position = 'Bottom';
            heatmap.legendSettings.height = '';
            heatmap.legendSettings.width = '50%';
            heatmap.width = '500px';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_rightArrow');
            let element:ClientRect = legendElement.getBoundingClientRect();
            trigger.clickEvent(legendElement, 0, 0, element.left + 2, element.top + 2);
            tempElement = document.getElementById('heatmapContainer_paging');
            expect(tempElement.textContent == '2/4').toBe(true);
            let leftArrow:HTMLElement = document.getElementById('heatmapContainer_leftArrow');
            let leftArrowelement:ClientRect = leftArrow.getBoundingClientRect();
            trigger.clickEvent(leftArrow, 0, 0, leftArrowelement.left + 2, leftArrowelement.top + 2);
            tempElement = document.getElementById('heatmapContainer_paging');
            expect(tempElement.textContent == '1/4').toBe(true);
        });
          it('List type legend with paging in canvas render mode', () => {
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_canvas');
            trigger.clickEvent(legendElement, 0, 0, 370.25, 285);
            expect(heatmap.legendModule.currentPage).toBe(2);
        });
        it('Checking list type legend in canvas render mode',  () => {
            heatmap.legendSettings.position = 'Right';
            heatmap.refresh();
            expect(heatmap.legendModule.labelCollections.length).toBe(8);
        });
        it('Checking list type legend with trim support in canvas ',  () => {
            heatmap.renderingMode = 'Canvas';
            heatmap.legendSettings.width = '';
            heatmap.legendSettings.position = 'Right';
            heatmap.legendSettings.textStyle.textOverflow = 'Trim';
            heatmap.refresh();
            expect(heatmap.legendModule.legendLabelTooltip.length).not.toBe(0);
        });
        it('Hide the previously rendered gradient pointer',  () => {
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.renderingMode = 'SVG';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_svg');
            trigger.mousemoveEvent(legendElement, 5, 5, 100, 73, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 400, 640, false);
            let pointerElement : HTMLElement = document.getElementById('heatmapContainer_Gradient_Pointer')
            expect(pointerElement.style.visibility == 'hidden');
        });
        it('Remove previously rendered gradient pointer in canvas in vertical direction',  () => {
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_canvas');
            trigger.mousemoveEvent(legendElement, 5, 5, 100, 73, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 400, 40, false);
            expect(heatmap.legendModule.previousOptions.pathX1 == 707 && heatmap.legendModule.previousOptions.pathX2 == 700);
        });
        it('Remove previously rendered gradient pointer in canvas in horizontal direction', () => {
            heatmap.legendSettings.position = 'Bottom';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_canvas');
            trigger.mousemoveEvent(legendElement, 5, 5, 400, 73, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 100, 40, false);
            expect(heatmap.legendModule.previousOptions.pathX1 === 648 && heatmap.legendModule.previousOptions.pathY1 === 413);
        });
        it('Disabling showLabel', function () {
            heatmap.legendSettings.position = 'Bottom';
            heatmap.legendSettings.textStyle.textOverflow = 'None';
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.legendSettings.showLabel = false;
            heatmap.dataBind();
            tempElement = document.getElementById('heatmapContainer_Heatmap_LegendLabel');
            expect(tempElement == null).toBe(true);
        });
        it('Disabling showLabel',  () => {
            heatmap.legendSettings.position = 'Right';
            heatmap.legendSettings.textStyle.textOverflow = 'None';
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.legendSettings.showLabel = false;
            heatmap.dataBind();
            tempElement = document.getElementById('heatmapContainer_Heatmap_LegendLabel');
            expect(tempElement == null).toBe(true);
         });
         it('Disabling showLabel',  () => {
            heatmap.legendSettings.position = 'Right';
            heatmap.legendSettings.textStyle.textOverflow = 'None';
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.showLabel = false;
            heatmap.dataBind();
            tempElement = document.getElementById('heatmapContainer_Heatmap_LegendLabel');
            expect(tempElement == null).toBe(true);
         });
         it('Check legend position with out axis title', function () {
            heatmap.legendSettings.position = 'Bottom';
            heatmap.legendSettings.textStyle.textOverflow = 'None';
            heatmap.renderingMode = "SVG";
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.showLabel = true;
            heatmap.xAxis.title.text = '';
            heatmap.dataBind();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('y') == '248' || tempElement.getAttribute('y') == '249').toBe(true);
        });
        it('Check legend position with out axis title', function () {
            heatmap.legendSettings.position = 'Left';
            heatmap.legendSettings.textStyle.textOverflow = 'None';
            heatmap.renderingMode = "SVG";
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.showLabel = true;
            heatmap.yAxis.title.text = '';
            heatmap.dataBind();
            tempElement = document.getElementById('heatmapContainer_Gradient_Legend');
            expect(tempElement.getAttribute('x') == '20' || tempElement.getAttribute('x') == '20').toBe(true);
        });
        it('Checking smart legend for fixed palette type', function () {
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.legendSettings.enableSmartLegend = true;
            heatmap.legendSettings.labelDisplayType = 'None';
            heatmap.dataBind();
            legendElement = document.getElementById('heatmapContainer_Smart_Legend0');
            trigger.mousemoveEvent(legendElement, 5, 5, 30, 35, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 130, 135, false);
            trigger.mousemoveEvent(legendElement, 5, 5, 30, 35, false);
            let tooltip: Element = document.getElementById('heatmapContainerlegendLabelTooltipContainer_text');
            expect(tooltip.textContent == 'text1 text1');
      });
        it('Rendering smart legend in canvas rendering', function () {
            heatmap.renderingMode = 'Canvas';
            heatmap.dataBind();
            legendElement = document.getElementById('heatmapContainer_canvas');
            trigger.mousemoveEvent(legendElement, 5, 5, 30, 35, false);
            let tooltip: Element = document.getElementById('heatmapContainerlegendLabelTooltipContainer_text');
            expect(tooltip.textContent == 'text1 text1');
        });
        it('Rendering smart legend with edge label display', function () {
            heatmap.legendSettings.labelDisplayType = 'Edge';
            heatmap.legendSettings.textStyle.textOverflow = 'Wrap';
            heatmap.dataBind();
            legendElement = document.getElementById('heatmapContainer_Smart_Legend1');
            expect(legendElement == null).toBe(true);
      });
        it('Rendering smart legend in horizontal direcrion', function () {
            heatmap.legendSettings.position = 'Bottom';
            heatmap.renderingMode = 'SVG';
            heatmap.dataBind();
            legendElement = document.getElementById('heatmapContainer_Smart_Legend0');
            expect(legendElement.getAttribute('width') == '55.375' );
      });
        it('Checking label format', function () {
            heatmap.paletteSettings.palette = [
                { 'value': 100, 'color': 'rgb(255, 255, 153)'},
                { 'value': 70, 'color': 'rgb(153, 255, 187)' },
                { 'value': 25, 'color': 'rgb(153, 153, 255)' },
                { 'value': 0, 'color': 'rgb(255, 159, 128)' },
            ];
            heatmap.legendSettings.labelFormat = '{value} %'
            heatmap.dataBind();
            legendElement = document.getElementById('heatmapContainer_Legend_Label3');
            expect(legendElement.textContent == '100 %');
        });
        it('Checking legend label customization', function () {
            heatmap.legendRender = function (args:ILegendRenderEventArgs) {
                args.cancel = true;
            };
            heatmap.refresh();
            heatmap.legendRender = function (args:ILegendRenderEventArgs) {
                args.cancel = false;
            };
            heatmap.refresh();      
                   
            legendElement = document.getElementById('heatmapContainer_Legend_Label0');
            if(heatmap.paletteSettings.type == 'Gradient'){
                if (heatmap.legendRender) {
                    expect(legendElement.textContent == '0 %').toBe(true);
                } else{
                    expect(legendElement.textContent == '').toBe(true);
                }
            } else {
                if (heatmap.legendRender) {
                    expect(legendElement.textContent == '0 %').toBe(true);
                }else{
                    expect(legendElement.textContent == '').toBe(true);
                }
            }

        });
        it('Checking cell toggle for smart legend', function () {
            legendElement = document.getElementById('heatmapContainer_Smart_Legend1');
            let element:ClientRect = legendElement.getBoundingClientRect();
            trigger.clickEvent(legendElement, 0, 0, element.left + 2, element.top + 2);
            expect(legendElement.getAttribute('fill') == 'rgb(153, 153, 255)');
        });
        it('Checking cell toggle based on legend selection', function () {
            heatmap.legendSettings.enableSmartLegend = false;
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_legend_list3');
            let element:ClientRect = legendElement.getBoundingClientRect();
            trigger.clickEvent(legendElement, 0, 0, element.left + 2, element.top + 2);
            expect(heatmap.legendModule.visibilityCollections[3]).toBe(false);
        });
        it('Checking toggled cell color after resizing', (done: Function) => {
            heatmap.heatMapResize(event);
            expect(heatmap.legendModule.visibilityCollections[3]).toBe(false);
            setTimeout(done, 1600);
        });
        it('Checking cell toggle based on legend selection in canvas rendering', function () {
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_canvas');
            trigger.clickEvent(legendElement, 0, 0, 317, 266);
            expect(heatmap.legendModule.visibilityCollections[3]).toBe(false);
        });
        it('Checking cell toggle based on legend selection in Canvas', function () {
            heatmap.legendSettings.enableSmartLegend = true;
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_canvas');
            trigger.clickEvent(legendElement, 0, 0, 317, 266);
            expect(heatmap.legendModule.visibilityCollections[2]).toBe(false);
        });
        it('Checking cell toggle when only colors are given in the palette collections', function () {
            heatmap.renderingMode = 'SVG';
            heatmap.legendSettings.enableSmartLegend = true;
            heatmap.legendSettings.labelDisplayType = 'All';
            heatmap.paletteSettings.palette = [
                    { color: '#DCD57E' },
                    { color: '#A6DC7E' },
                    { color: '#7EDCA2' },
                    { color: '#6EB5D0' }
                ],
            heatmap.refresh();
            legendElement = document.getElementById('heatmapContainer_Legend_Label3');
            let region:ClientRect = legendElement.getBoundingClientRect();
            trigger.clickEvent(legendElement, 0, 0, region.left + 2, region.top +5);
            expect(heatmap.legendModule.visibilityCollections[4]).toBe(false);
    }); 
    it('Checking cell toggle for smart legend for bubble type size and color', function () {
        heatmap.cellSettings.tileType = 'Bubble';
        heatmap.cellSettings.bubbleType = 'SizeAndColor';
        legendElement = document.getElementById('heatmapContainer_Smart_Legend1');
        let element:ClientRect = legendElement.getBoundingClientRect();
        trigger.clickEvent(legendElement, 0, 0, element.left + 2, element.top + 2);
        expect(legendElement.getAttribute('fill') == 'rgb(153, 153, 255)');
    });
    it('Checking the pages per list when title size is increased', () => {
        heatmap.legendSettings.position = 'Top';
        heatmap.legendSettings.title.textStyle.color = 'Red';
        heatmap.legendSettings.width = '50px';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.enableSmartLegend = false;
        heatmap.dataBind();
        let tempElement = document.getElementById('heatmapContainer_LegendBound');
        expect(heatmap.legendModule.listPerPage).toBe(2);
    });
    it('Checking the text in bottom position of the heatmap when the width is not provided', () => {
        heatmap.legendSettings.position = 'Bottom';
        heatmap.legendSettings.width = '';
        heatmap.paletteSettings.type = 'Gradient';
        heatmap.legendSettings.title.textStyle.size = '11px';
        heatmap.legendSettings.title.text = 'Sample';
        heatmap.refresh();
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        let element = document.getElementById('heatmapContainer_legendTitle');
        expect(element.textContent == 'Sample').toBe(true);
    });
    it('Checking the height of the heatmap when the size is changed for the legend title in the Left position', () =>  {
        heatmap.legendSettings.width = '';
        heatmap.legendSettings.title.text = 'Sample';
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        heatmap.legendSettings.title.textStyle.size = '67px';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.position = 'Left';
        heatmap.legendSettings.enableSmartLegend = true;
        heatmap.refresh();
        expect(heatmap.height == '300px').toBe(true);
    });
    it('Checking the height of the heatmap when the size is changed for the legend title in the Right position', () =>  {
        heatmap.legendSettings.width = '';
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        heatmap.legendSettings.title.textStyle.size = '56px';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.position = 'Right';
        heatmap.legendSettings.enableSmartLegend = true;
        heatmap.refresh();
        expect(heatmap.width == '500px').toBe(true);
    });
    it('Checking the height of the heatmap when the size is changed for the legend title in the Left position without smartlegend', () =>  {
        heatmap.legendSettings.width = '';
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        heatmap.legendSettings.title.textStyle.size = '56px';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.position = 'Right';
        heatmap.legendSettings.enableSmartLegend = false;
        heatmap.refresh();
        expect(heatmap.width == '500px').toBe(true);
    });
    it('Checking the width when title size is changed in the Left direction', () =>  {
        heatmap.legendSettings.width = '';
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        heatmap.legendSettings.title.textStyle.size = '89px';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.position = 'Left';
        heatmap.legendSettings.enableSmartLegend = true;
        heatmap.refresh();
        expect(heatmap.width == '500px').toBe(true);
    });
    it('Rendering SVG tooltip for legend title', () => {
        heatmap.legendSettings.width = '5%';
        heatmap.legendSettings.title.textStyle.textOverflow = 'Trim';
        heatmap.refresh();
        legendElement = document.getElementById('heatmapContainer_legendTitle');
        trigger.mousemoveEvent(legendElement, 5, 5, 715, 73, false);
        trigger.mousemoveEvent(legendElement, 5, 5, 715, 100, false);
        trigger.mousemoveEvent(legendElement, 5, 5, 715, 73, false);
        expect(document.getElementById('heatmapContainer_legendTitle_Tooltip').textContent == 'Sample').toBe(true);
    });
    it('Rendering canvas tooltip for legend title', function () {
        heatmap.renderingMode = 'Canvas';
        heatmap.legendSettings.position = 'Left';
        heatmap.refresh();
        legendElement = document.getElementById('heatmapContainer_canvas');
        trigger.mousemoveEvent(legendElement, 5, 5, 30, 35, false);
        let tooltip = document.getElementById('heatmapContainer_canvas_Tooltip');
        expect(tooltip.textContent == 'Sample').toBe(true);
    });
    it('Rendering canvas tooltip for legend title', function () {
        heatmap.renderingMode = 'Canvas';
        heatmap.legendSettings.title.textStyle.size = '24px';
        heatmap.legendSettings.width = '500px'
        heatmap.legendSettings.position = 'Top';
        heatmap.refresh();
        legendElement = document.getElementById('heatmapContainer_canvas');
        trigger.mousemoveEvent(legendElement, 5, 5, 75, 35, false);
        trigger.mousemoveEvent(legendElement, 5, 5, 85, 35, false);
        trigger.mousemoveEvent(legendElement, 5, 5, 65, 35, false);
        trigger.mousemoveEvent(legendElement, 5, 5, 95, 35, false);
        let tooltip = document.getElementById('heatmapContainer_canvas_Tooltip');
        expect(tooltip.textContent == 'Sample').toBe(true);
    });
    it('Checking with showlabel set as false', function () {
        heatmap.renderingMode = 'SVG';
        heatmap.legendSettings.position = 'Bottom';
        heatmap.legendSettings.title.text = 'Sample';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.title.textStyle.size = '14px';
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        heatmap.legendSettings.alignment = 'Center';
        heatmap.legendSettings.enableSmartLegend = false;
        heatmap.legendSettings.showLabel = false;
        heatmap.refresh();
        tempElement = document.getElementById('heatmapContainer_Heatmap_LegendLabel');
        expect(tempElement == null).toBe(true);
    });
    it('Checking with showlabel set as false', function () {
        heatmap.renderingMode = 'SVG';
        heatmap.legendSettings.position = 'Left';
        heatmap.legendSettings.title.text = 'Sample';
        heatmap.paletteSettings.type = 'Fixed';
        heatmap.legendSettings.width = '';
        heatmap.legendSettings.title.textStyle.size = '14px';
        heatmap.legendSettings.title.textStyle.textOverflow = 'None';
        heatmap.legendSettings.alignment = 'Center';
        heatmap.legendSettings.enableSmartLegend = true;
        heatmap.legendSettings.showLabel = true;
        heatmap.refresh();
        tempElement = document.getElementById('heatmapContainer_legendTitle');
        expect(tempElement.textContent == 'Sample').toBe(true);
        heatmap.legendSettings.position = 'Right';
        heatmap.legendSettings.labelDisplayType = 'None';
        heatmap.legendSettings.textStyle.textOverflow = 'Trim';
        heatmap.refresh();
        heatmap.legendRender = function (args:ILegendRenderEventArgs) {
            args.cancel = true;
        };
        heatmap.paletteSettings.type = 'Gradient';
        heatmap.refresh();
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
