import { BulletChart } from '../../../src/bullet-chart/index';
import { BulletTooltip } from '../../../src/bullet-chart/index';
import { MouseEvents } from '../../chart/base/events.spec';
import { createElement } from '@syncfusion/ej2-base';
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
        beforeAll(() => {
            document.body.appendChild(bulletElement);
            bullet = new BulletChart({
                dataSource: [{value: 4, target: 4}],
                valueField: 'value', targetField: 'target',
                tooltip: { enable: true },
                minimum: 0, maximum: 20, interval: 5,
                animation: {enable: false}
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
    })
});