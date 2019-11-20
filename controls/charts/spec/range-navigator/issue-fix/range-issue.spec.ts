
/**
 * Issue fix specs
 */
import { RangeNavigator, DateTime, IRangeLoadedEventArgs } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
RangeNavigator.Inject(DateTime);

describe('Range Navigator Issue fixes', () => {
    describe('DataSource', () => {
        let rangeControl: RangeNavigator;
        let rangeElement: Element;
        let testElement: Element;
        let data: Object[] = [{ x: new Date(2000, 2, 4), y: 23 }, { x: new Date(2010, 2, 4), y: 23 }];
        rangeElement = createElement('div', { id: 'rangeContainer' });
        document.body.appendChild(rangeElement);

        beforeAll(() => {
            rangeControl = new RangeNavigator();

        });

        afterAll((): void => {
            rangeControl.destroy();
            rangeElement.remove();
        });
        it('checking with lightweight', (done: Function) => {
            rangeControl.loaded = (args: IRangeLoadedEventArgs) => {
                testElement = document.getElementById('rangeContainer');
                expect(testElement.classList.contains('e-control')).toBe(true);
                expect(testElement.classList.contains('e-rangenavigator')).toBe(true);
                testElement = document.getElementById('rangeContainer_FirstLevelAxisLabels');
                expect(testElement.firstChild.textContent).toEqual('0');
                expect(testElement.lastChild.textContent).toEqual('5');
                done();
            };
            rangeControl.appendTo('#rangeContainer');

        });
        it('checking with dataManager in direct', (done: Function) => {
            rangeControl.loaded = (args: IRangeLoadedEventArgs) => {
                testElement = document.getElementById('rangeContainer_chart');
                expect(testElement.childElementCount).toEqual(0);
                done();
            };
            rangeControl.valueType = 'DateTime';
            rangeControl.dataSource = new DataManager(data);
            rangeControl.xName = 'x'; rangeControl.yName = 'y';
            rangeControl.refresh();
        });
        it('checking with dataManager in series', (done: Function) => {
            rangeControl.loaded = (args: IRangeLoadedEventArgs) => {
                testElement = document.getElementById('rangeContainer');
                expect(args.rangeNavigator.element.childElementCount).not.toEqual(0);
                done();
            };
            rangeControl.valueType = 'DateTime';
            rangeControl.series = [{ dataSource: new DataManager(data), xName: 'x', yName: 'y' }];
            rangeControl.refresh();
        });
    });
});
