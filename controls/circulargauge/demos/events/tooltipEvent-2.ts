/**
 * Border sample
 */
import { CircularGauge, ITooltipRenderEventArgs, GaugeTooltip } from '../../src/index';
CircularGauge.Inject(GaugeTooltip);


let circulargauge: CircularGauge = new CircularGauge({
    axes: [{
        lineStyle: { width: 10, color: 'transparent' },
        labelStyle: {
            position: 'Inside', useRangeColor: false,
            font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
        },
        majorTicks: { height: 10, offset: 5, color: '#9E9E9E' },
        minorTicks: { height: 0 },
        startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
        ranges: [
            { start: 0, end: 40, color: '#30B32D' },
            { start: 40, end: 80, color: '#FFDD00' },
            { start: 80, end: 120, color: '#F03E3E' }
        ],
        pointers: [{
            animation: { enable: false },
            value: 30,
        }]
    }],
    tooltip: { enable: true },
    tooltipRender: function (args: ITooltipRenderEventArgs) {
        args.tooltip.fill = 'red';
        args.tooltip.border.color = "blue";
        args.tooltip.border.width = 1.5;
        args.tooltip.textStyle.color = "green";
        args.tooltip.textStyle.fontFamily = "Times New Roman";
        args.tooltip.textStyle.fontStyle = "italic";
        args.tooltip.textStyle.fontWeight = "Bold";
        args.tooltip.textStyle.opacity = 0.5;
        args.tooltip.textStyle.size = "25px";
        
    }
});
circulargauge.appendTo('#static-gauge');