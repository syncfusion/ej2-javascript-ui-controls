import { BulletChart, IBulletLoadedEventArgs, IBulletchartTooltipEventArgs } from '../../../src/bullet-chart/index';
import { BulletTooltip } from '../../../src/bullet-chart/index';
import { MouseEvents } from '../../chart/base/events.spec';
import { createElement } from '@syncfusion/ej2-base';
import { IAccLoadedEventArgs } from '../../../src';
import { EmitType} from '@syncfusion/ej2-base';
BulletChart.Inject(BulletTooltip);

/**
 * Spec for Bulletchart Tooltip
 */
describe('Bullet Chart Scale', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('with default case', () => {
        let bullet: BulletChart;
        let svg: Element;
        let segement: Element;
        let id: string = 'container';
        let tooltipid: string = 'tooltipDiv' + id;
        let sliceid: string = id + '_svg_ComparativeMeasure_0';
        let trigger: MouseEvents = new MouseEvents();
        let bulletElement: Element = createElement('div', { id: 'container' });
        let loaded: EmitType<IAccLoadedEventArgs>;
        beforeAll(() => {
            document.body.appendChild(bulletElement);
            bullet = new BulletChart({
                dataSource: [{value: 4, target: 4}],
                valueField: 'value', targetField: 'target',
                tooltip: { enable: true },
                minimum: 0, maximum: 20, interval: 5,
                animation: {enable: false},
            });
            bullet.appendTo('#container');
        });
        afterAll((): void => {
            bullet.destroy();
            bulletElement.remove();
        });
        it('Bullet chart tooltip visibility checking', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.refresh();

            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            done();
        });
        it('Checking with tooltiprender event', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.tooltipRender = (args: IBulletchartTooltipEventArgs ) =>{
                args.text += 'K';
                args.name = 'Revenue';
            };
            bullet.refresh();

            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            done();
        });
        it('Checking with tooltip border and fill customization', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.tooltip.border = {width: 4, color: 'green'};
            bullet.tooltip.fill = 'red';
            bullet.refresh();

            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            expect(tooltip != null).toBe(true);
            expect(tooltip.style.getPropertyValue('background-color')).toBe('red');
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            done();
        });
        it('Checking with tooltip template', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.tooltip.template = '<div>Target   : ${target}K</div><br/><div>Current : ${value}K</div>';
            bullet.refresh();

            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('containerparent_template');
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            done();
        });
        it('Checking with title tooltip', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.tooltip.template = '';
            bullet.title = 'Revenue';
            bullet.subtitle = 'in %';
            bullet.refresh();

            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 46);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            expect(tooltip != null).toBe(true);
            expect(tooltip.style.getPropertyValue('background-color')).toBe('red');
            segement = document.getElementById('container_BulletChartSubTitle');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            done();
        });
        it('Checking width,color,dashArray', (done: Function) => {  
            bullet.tooltip.enable = true;
            bullet.tooltip.textStyle.fontStyle = null; 
            bullet.tooltip.border.width = null;
            bullet.tooltip.border.color=null;
            bullet.tooltip.border.dashArray = '4 4'; 
            bullet.theme = 'Fabric';
            bullet.refresh();   
            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            tooltip.style.color=bullet.themeStyle.tooltipBoldLabel;
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            done();

        });
        it('Checking conversion', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.theme='Material3'
            bullet.targetColor=null;
            bullet.containerWidth=200;
            bullet.containerHeight=200
            bullet.refresh();    
            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            tooltip.style.color=bullet.themeStyle.tooltipBoldLabel;
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            trigger.mouseleavetEvent(segement, 200, 200);       
            done(); 
        });
        it('Checking conversion with fluent', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.theme ='Fluent'
            bullet.targetColor=null;
            bullet.containerWidth=200;
            bullet.containerHeight=200
            bullet.refresh();    
            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            tooltip.style.color=bullet.themeStyle.tooltipBoldLabel;
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            trigger.mouseleavetEvent(segement, 200, 200);       
            done(); 
        });
        it('Checking conversion with fabric', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.theme = 'Fabric'
            bullet.targetColor = null;
            bullet.containerWidth = 200;
            bullet.containerHeight = 200;
            bullet.labelFormat = '{value}%';
            bullet.refresh();
            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            tooltip.style.color = bullet.themeStyle.tooltipBoldLabel;
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            trigger.mouseleavetEvent(segement, 200, 200);
            done();
        });
        it('Checking conversion with flunet2', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.theme = 'Fluent2'
            bullet.targetColor = null;
            bullet.containerWidth = 200;
            bullet.containerHeight = 200;
            bullet.labelFormat = '';
            bullet.refresh();
            segement = document.getElementById(sliceid);
            trigger.mousemoveEvent(segement, 0, 0, 200, 35);
            let tooltip: HTMLElement = document.getElementById('tooltipDivcontainer');
            tooltip.style.color = bullet.themeStyle.tooltipBoldLabel;
            expect(tooltip != null).toBe(true);
            segement = document.getElementById('container_svg_ComparativeMeasure_0');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            trigger.mouseleavetEvent(segement, 200, 200);
            done();
        });
        it('Checking bullet target class', (done: Function) => {
            bullet.tooltip.enable = true;
            bullet.theme = 'Fluent2'
            bullet.targetColor = null;
            bullet.containerWidth = 200;
            bullet.containerHeight = 200;
            segement = document.getElementById(sliceid);
            let element: Element = document.getElementById('container');
            bullet.loaded = (args: IBulletLoadedEventArgs): void => {
                bullet.loaded = null;
                args.bulletChart.themeStyle.tooltipLabelFont.color = null;
                args.bulletChart.bulletTooltipModule._elementTooltip(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100), args.bulletChart.svgObject.id + '_Caption', null, 100);
                args.bulletChart.bulletTooltipModule._elementTooltip(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100), args.bulletChart.svgObject.id + '_SubTitle', null, 100);

                if (document.getElementsByClassName('tooltipDiv')) {
                    document.getElementsByClassName('tooltipDiv')[0].remove();
                    document.getElementsByClassName('tooltipDiv')[0].remove();
                }
                args.bulletChart.title = '';
                args.bulletChart.subtitle = '';
                args.bulletChart.bulletTooltipModule._elementTooltip(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100), args.bulletChart.svgObject.id + '_Caption', null, 100);
                args.bulletChart.bulletTooltipModule._elementTooltip(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100), args.bulletChart.svgObject.id + '_SubTitle', null, 100);
                let tooltipElement = args.bulletChart.svgObject.id + '_ComparativeMeasure';
                args.bulletChart.dataSource = [{ value: 0, target: 0 }];
                args.bulletChart.isReact = true;
                args.bulletChart.bulletTooltipModule._displayTooltip(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100), tooltipElement, 'container_svg_ComparativeMeasure_0', 0, 0);
                args.bulletChart.isReact = false;
                args.bulletChart.title = 'Revenue';
                args.bulletChart.subtitle = 'in %';
                args.bulletChart.tooltip.template = '';
                args.bulletChart.bulletTooltipModule.updateTemplateFn();
                expect(element != null).toBe(true);
                done();
            }
            bullet.refresh();
        });
        it('chart tooltip format checking with keyboard navigation', (done: Function) => {
            bullet.theme = 'Fluent'
            bullet.targetColor = null;
            segement = document.getElementById(sliceid);
            trigger.keyboardEvent('keydown', segement, 'Space', 'Space');
            trigger.keyboardEvent('keyup', segement, 'ArrowUp', 'ArrowUp');
            trigger.keyboardEvent('keydown', segement, 'Escape', 'Escape');
            trigger.keyboardEvent('keyup', segement, 'ArrowDown', 'ArrowDown');
            trigger.keyboardEvent('keyup', segement, 'ArrowLeft', 'ArrowLeft');
            trigger.keyboardEvent('keyup', segement, 'ArrowRight', 'ArrowRight');
            bullet.isReact = true;
            trigger.keyboardEvent('mousedown', segement, 'Tab', 'Tab');
            trigger.keyboardEvent('mouseleave', segement, 'Tab', 'Tab');
            expect(segement !== null).toBe(true);
            const mousedownEvent: MouseEvent = new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0 });
            segement.dispatchEvent(mousedownEvent);
            done();
            bullet.element.id = '';
            bullet.dataLabel = { enable: true };
            bullet.orientation = 'Horizontal';
            bullet.loaded = loaded;
            bullet.refresh();
            bullet.resizeBound();
        });
    });
});