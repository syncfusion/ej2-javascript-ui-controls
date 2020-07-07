/**
 * Smart labels spec
 */
import { AccumulationChart, AccumulationDataLabel, AccumulationLegend, IAccLoadedEventArgs } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { removeElement } from '@syncfusion/ej2-svg-base';
AccumulationChart.Inject(AccumulationDataLabel, AccumulationLegend);

describe('Pie Series smart label placing', () => {
    let pieElement: HTMLElement;
    let testElement: HTMLElement | Element;
    let pieChart: AccumulationChart;
    beforeAll((): void => {
        pieElement = createElement('div', { id: 'piesmart' });
        document.body.appendChild(pieElement);
        pieChart = new AccumulationChart({
            enableSmartLabels: true,
            series: [
                {
                    type: 'Pie',
                    startAngle: 233,
                    dataSource: [
                        { x: 'Food', y: 120, text: '0thPoint, 0.11%' },
                        { x: 'Health', y: 120, text: '1stPoint, 0.11%' },
                        { x: 'Education', y: 120, text: '2ndPoint, 0.11%' },
                        { x: 'Electronics', y: 70, text: '3rdPoint, 0.06%' },
                        { x: 'Electronics1', y: 70, text: '4thPoint, 0.06%' },
                        { x: 'Electronics2', y: 70, text: '5thPoint, 0.06%' },
                        { x: 'Electronics3', y: 7000, text: '6thPoint, 0.06%' },
                        { x: 'Electronics4', y: 700, text: '7thPoint, 0.06%' },
                        { x: 'Electrical', y: 70000, text: '8thPoint, 0.06%' },
                        { x: 'Other Personnal', y: 94658, text: '9thPoint, 88.47%' },
                        { x: 'Medical care', y: 9090, text: '10thPoint, 8.49%' },
                        { x: 'Medical care1', y: 9090, text: '11thPoint, 8.49%' },
                        { x: 'Medical care2', y: 9090, text: '12thPoint, 8.49%' }
                    ],
                    animation: { enable: false },
                    explode: true,
                    xName: 'x', yName: 'y',
                    dataLabel: {
                        visible: true, position: 'Outside', name: 'text', connectorStyle: { type: 'Curve', length: '30' },
                        font: { fontWeight: '600' }
                    }
                }
            ]
        });
        pieChart.appendTo('#piesmart');
    });
    afterAll((): void => {
        pieChart.destroy();
        removeElement('piesmart');
    });
    it('Points in left side', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.refresh();
    });
    it('Points in right side', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].startAngle = 10;
        pieChart.refresh();
    });
    it('Points in right side', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].startAngle = 1;
        pieChart.refresh();
    });
    it('Default datalabel position inside', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataLabel.position = 'Inside';
        pieChart.refresh();
    });
    it('Default rendering', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataSource = [
            { x: 'Food', y: 120, text: '0thPoint, 0.11%' },
            { x: 'Health', y: 120, text: '1stPoint, 0.11%' },
            { x: 'Education', y: 120, text: '2ndPoint, 0.11%' },
            { x: 'Electronics', y: 70, text: '3rdPoint, 0.06%' },
            { x: 'Electrical', y: 70, text: '4thPoint, 0.06%' },
            { x: 'Groceries', y: 70, text: '5thPoint, 0.06%' },
            { x: 'Miscelenious', y: 7000, text: '6thPoint, 0.06%' },
            { x: 'Books', y: 700, text: '7thPoint, 0.06%' },
            { x: 'Calendars', y: 70000, text: '8thPoint, 0.06%' },
            { x: 'Popups', y: 700, text: '9thPoint, 0.06%' },
            { x: 'Charts', y: 800, text: '10thPoint, 0.06%' },
            { x: 'Grids', y: 600, text: '11thPoint, 0.06%' },
            { x: 'Schedule', y: 500, text: '12thPoint, 0.06%' },
            { x: 'Buttons', y: 400, text: '13thPoint, 0.06%' },
            { x: 'Navigations', y: 800, text: '14thPoint, 0.06%' },
            { x: 'Lists', y: 94658, text: '15thPoint, 88.47%' },
            { x: 'Inputs', y: 9090, text: '16thPoint, 8.49%' },
            { x: 'Notifications', y: 9090, text: '17thPoint, 8.49%' },
            { x: 'Editors', y: 9090, text: '18thPoint, 8.49%' },
            { x: 'Files', y: 8000, text: '19thPoint, 8.49%' },
            { x: 'Viewer', y: 9090, text: '20thPoint, 8.49%' }
        ];
        pieChart.refresh();
    });
    it('changing position to outside', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataLabel.position = 'Outside';
        pieChart.series[0].startAngle = 150;
        pieChart.refresh();
    });
    it('changing position to outside', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataLabel.position = 'Outside';
        pieChart.series[0].startAngle = 0;
        pieChart.refresh();
    });
    it('changing position to in angle 150', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataLabel.position = 'Outside';
        pieChart.series[0].startAngle = 150;
        pieChart.refresh();
    });
    it('changing position to in angle 300', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataLabel.position = 'Outside';
        pieChart.series[0].startAngle = 300;
        pieChart.refresh();
    });
    it('checking with label skipping', (done: Function) => {
        pieChart.loaded = (args: IAccLoadedEventArgs) => {
            testElement = document.getElementById('piesmart_datalabel_Series_0');
            expect(testElement).not.toBe(null);
            done();
        };
        pieChart.series[0].dataLabel.position = 'Outside';
        pieChart.series[0].startAngle = 0;
        pieChart.series[0].dataSource = [
            { 'x': 'USA', y: 46, text: 'United States of America: 46' },
            { 'x': 'China', y: 26, text: 'China: 26' },
            { 'x': 'Russia', y: 19, text: 'Russia: 19' },
            { 'x': 'Germany', y: 17, text: 'Germany: 17' },
            { 'x': 'Japan', y: 12, text: 'Japan: 12' },
            { 'x': 'France', y: 10, text: 'France: 10' },
            { 'x': 'South Korea', y: 9, text: 'South Korea: 9' },
            { 'x': 'Great Britain', y: 27, text: 'Great Britain: 27' },
            { 'x': 'Italy', y: 8, text: 'Italy: 8' },
            { 'x': 'Australia', y: 8, text: 'Australia: 8' },
            { 'x': 'Netherlands', y: 8, text: 'Netherlands: 8' },
            { 'x': 'NewZealand', y: 4, text: 'New Zealand: 4' },
            { 'x': 'Uzbekistan', y: 4, text: 'Uzbekistan: 4' },
            { 'x': 'Kazakhstan', y: 3, text: 'Kazakhstan: 3' },
            { 'x': 'Colombia', y: 3, text: 'Colombia: 3' },
            { 'x': 'Switzerland', y: 3, text: 'Switzerland: 3' },
            { 'x': 'Argentina', y: 3, text: 'Argentina: 3' },
            { 'x': 'South Africa', y: 2, text: 'South Africa: 2' },
            { 'x': 'North Korea', y: 2, text: 'North Korea: 2' }
        ];
        pieChart.refresh();
    });

});