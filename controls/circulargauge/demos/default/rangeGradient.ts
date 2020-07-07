/**
 * Range sample
 */
import { CircularGauge, Gradient } from '../../src/index';
CircularGauge.Inject( Gradient);

let circulargauge: CircularGauge = new CircularGauge({
    legendSettings: 
        {
            visible: true,
            position: 'Bottom'
        },
    axes: [{
        lineStyle: { width: 10, color: 'transparent' },
        labelStyle: {
            position: 'Inside', useRangeColor: true,
            font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' },
        }, 
        startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
        majorTicks:
        {
        useRangeColor: true,
        
        },
        minorTicks: 
        {
            useRangeColor: true
            
        },
        ranges: [
            
            { start: 0,
            end: 40, 
             startWidth : 20,
             endWidth: 20,
             legendText: 'winter',
             linearGradient: {
                startValue: '0%',
                endValue: '100%',
                colorStop: [
                    {
                        color: 'orange',
                        offset: '0%',
                        opacity: 2
            },
                    {
                        color: 'red',
                        offset: '100%',
                        opacity: 2
          }, 
                ]
            },
          
        }, 
        { start: 40, 
            end: 80,
            startWidth : 20,
            endWidth :20,
            legendText: 'summer',
            linearGradient: {
                startValue: '0%',
                endValue: '100%',
                colorStop: [
            {
                        color: 'black',
                        offset: '0%',
                        opacity: 2
            },
            {
                        color: 'blue',
                        offset: '100%',
                        opacity: 2
            },
            ]
        },
          
             },
        { start: 80, 
            end: 120,
            startWidth : 20,
            endWidth: 20, 
            legendText: 'rainy',
            linearGradient: {
                startValue: '0%',
                endValue: '100%',
                colorStop: [
                    {
                        color: 'green',
                        offset: '0%',
                        opacity: 2
            },
                    {
                        color: 'pink',
                        offset: '100%',
                        opacity: 2
        },
                ]
            },
        }
    ],
    }]
});
circulargauge.appendTo('#range-container');