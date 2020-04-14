/**
 * Smith Chart tooltip template
 *
 */

import {
    Smithchart, SmithchartLegend, TooltipRender, ISmithChartTooltipEventArgs
} from '../../../src/index';

Smithchart.Inject(SmithchartLegend, TooltipRender);

let smithchart: Smithchart = new Smithchart({
    title: { visible: true, text: 'Tooltip Render Template' },
    series: [
       {
            points: [
                { resistance: 20, reactance: -50, tooltip: 'Point1' }, { resistance: 10, reactance: -10, tooltip: 'Poin1' },
                { resistance: 9, reactance: -4.5, tooltip: 'Point2' }, { resistance: 8, reactance: -3.5, tooltip: 'Poin2' },
                { resistance: 7, reactance: -2.5, tooltip: 'Point3' }, { resistance: 6, reactance: -1.5, tooltip: 'Poin3' },
                { resistance: 5, reactance: -1, tooltip: 'Point4' }, { resistance: 4.5, reactance: -0.5, tooltip: 'Poin4' },
                { resistance: 3.5, reactance: 0, tooltip: 'Point5' }, { resistance: 2.5, reactance: 0.4, tooltip: 'Poin5' },
                { resistance: 2, reactance: 0.5, tooltip: 'Point6' }, { resistance: 1.5, reactance: 0.5, tooltip: 'Poin6' },
                { resistance: 1, reactance: 0.4, tooltip: 'Point7' }, { resistance: 0.5, reactance: 0.2,tooltip: 'Poin7' },
                { resistance: 0.3, reactance: 0.1, tooltip: 'Point8' }, { resistance: 0, reactance: 0.05, tooltip: 'Poin8' },
            ],
            name: 'Transmission2',
            enableAnimation: true,
            tooltip: { visible: true, template: '<div>${reactance} : ${resistance}</div>' },
            marker: {
                shape: 'Circle',
                visible: true,
                border: {
                    width: 2,
                }
            }
        },
    ],
    tooltipRender: (value: ISmithChartTooltipEventArgs) => {
        value.template = '<div>${reactance} : ${resistance}</div> : ${tooltip}';
    },
});
smithchart.appendTo('#tooltip');

let smithchartMap: Smithchart = new Smithchart({
    title: { visible: true, text: 'Transmission details' },
    series: [
       {
            points: [
                { resistance: 20, reactance: -50, tooltip: 'Point1' }, { resistance: 10, reactance: -10, tooltip: 'Poin1' },
                { resistance: 9, reactance: -4.5, tooltip: 'Point2' }, { resistance: 8, reactance: -3.5, tooltip: 'Poin2' },
                { resistance: 7, reactance: -2.5, tooltip: 'Point3' }, { resistance: 6, reactance: -1.5, tooltip: 'Poin3' },
                { resistance: 5, reactance: -1, tooltip: 'Point4' }, { resistance: 4.5, reactance: -0.5, tooltip: 'Poin4' },
                { resistance: 3.5, reactance: 0, tooltip: 'Point5' }, { resistance: 2.5, reactance: 0.4, tooltip: 'Poin5' },
                { resistance: 2, reactance: 0.5, tooltip: 'Point6' }, { resistance: 1.5, reactance: 0.5, tooltip: 'Poin6' },
                { resistance: 1, reactance: 0.4, tooltip: 'Point7' }, { resistance: 0.5, reactance: 0.2,tooltip: 'Poin7' },
                { resistance: 0.3, reactance: 0.1, tooltip: 'Point8' }, { resistance: 0, reactance: 0.05, tooltip: 'Poin8' },
            ],
            name: 'Transmission2',
            enableAnimation: true,
            tooltip: { visible: true },
            tooltipMappingName: 'tooltip',
            marker: {
                shape: 'Circle',
                visible: true,
                border: {
                    width: 2,
                }
            }
        },
    ],
    tooltipRender: (value: ISmithChartTooltipEventArgs) => {
        value.headerText = 'Header';
        value.text = [value.point.resistance.toString(), value.point.reactance.toString()];
    }
});
smithchartMap.appendTo('#tooltipMap');