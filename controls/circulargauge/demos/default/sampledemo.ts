/**
 * sampledeomo sample
 */
import { CircularGauge } from '../../src/index';
let circulargauge: CircularGauge = new CircularGauge({
    axes:[{
        radius:'100%',
         startAngle:0,
         endAngle:0,
         lineStyle:
         {
             width:0
         },

         majorTicks: 
         { 
         width: 3,
         height: 20, 
         interval: 10,
         dashArray:"1,1"
        },
        minorTicks: 
            { 
            height: 10, 
            width: 1, 
            interval:2,
            dashArray:"1,1"
            
        },
        minimum:0,
        maximum:100,
        labelStyle:
        {
           
        },
            
    }]
});
circulargauge.appendTo('#sam');