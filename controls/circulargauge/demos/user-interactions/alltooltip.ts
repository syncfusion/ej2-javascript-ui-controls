/**
 * Tooltip sample
 */
import { CircularGauge, ITooltipRenderEventArgs, GaugeTooltip, Annotations } from '../../src/index';
CircularGauge.Inject(GaugeTooltip);
CircularGauge.Inject(Annotations);
let circulargauge: CircularGauge = new CircularGauge({
    title: 'Tooltip Customization',
    titleStyle: { size: '15px', color: 'grey' },
    axes: [{
        radius: '90%',
        minimum: 0,
        maximum: 120,
        startAngle: 240,
        endAngle: 120,
        annotations: [{
           content: '<div id="subGauge" style="width:90px;height:90px;"></div>', zIndex:'1', angle: 180
        }],
        lineStyle: { width: 0 },
        majorTicks: { color: 'white', offset: -5, height: 12 },
        minorTicks: { width: 0 },
        labelStyle: { useRangeColor: true, font: { color: '#424242', size: '13px', fontFamily: 'Roboto' } },
        pointers: [{
            value: 70,
            radius: '60%',
            color: '#33BCBD',
            cap: { radius: 10, border: { color: '#33BCBD', width: 5 } },
            animation: { enable: false }
        }],
        ranges: [{
            start: 0,
            end: 50,
            startWidth: 10, endWidth: 10,
            radius: '102%',
            color: '#3A5DC8',
        }, {
            start: 50,
            end: 120,
            radius: '102%',
            startWidth: 10, endWidth: 10,
            color: '#33BCBD',
        }]
    }],
    tooltip: {
        type:['Pointer', 'Range', 'Annotation'],
        enable: true,
        enableAnimation: false,
        annotationSettings: { format:'3:00 PM' },
    },
    tooltipRender: (args: ITooltipRenderEventArgs) => {
        if(args.pointer){
        let imageName: string = ((args.pointer.currentValue >= 0 && args.pointer.currentValue <= 50) ? 'range1' : 'range3');
        let borderColor: string = ((args.pointer.currentValue >= 0 && args.pointer.currentValue <= 50) ? '#3A5DC8' : '#33BCBD');
        args.tooltip.template = '<div id=templateWrap style="border:2px solid ' + borderColor + '"><img src="../images/' + imageName +
            '.png"/><div class=des><span>${value} MPH</span></div></div>';
        }
    },
    enablePointerDrag: true
});
circulargauge.appendTo('#tooltip-container');

let gauge: CircularGauge = new CircularGauge({
    axes: [{
        minimum: 0,
        maximum: 12,
        startAngle: 0,
        endAngle: 360,
        majorTicks:{
            interval: 3
        },
        lineStyle: { width: 0 },
        ranges: [
            {
                start: 0, end: 3,
                startWidth: 5, endWidth: 5,
                color: 'rgba(29,29,29,0.7)'
            }, {
                start: 3, end: 12,
                startWidth: 5, endWidth: 5,
                color: 'rgba(168,145,102,0.1)'
            }
        ],
        labelStyle: {
            hiddenLabel: 'First',
            offset: -5
        },
        pointers: [{
            pointerWidth: 2,
            radius: '40%',
            color: 'rgb(29,29,29)',
            border: { width: 1, color: 'rgb(29,29,29)' },
            cap: {
                color: 'rgb(29,29,29)',
                radius: 2,
                border: {
                    width: 0.2,
                    color: 'red'
                }
            },
            needleTail: {
                length: '0%'
            }, animation: {
                enable: false
            }
        },
        {
            value: 3,
            pointerWidth: 2,
            radius: '30%',
            color: 'rgb(29,29,29)',
            border: { width: 1, color: 'rgb(29,29,29)' },
            cap: {
                color: 'rgb(29,29,29)',
                radius: 2,
                border: {
                    width: 0.2,
                    color: 'red'
                }
            },
            needleTail: {
                length: '0%'
            }, animation: {
                enable: false
            }
        }
    ]
    }]
}, '#subGauge');