import { Tooltip, TooltipEventArgs } from '../../src/tooltip/tooltip';
import { compile } from '@syncfusion/ej2-base';
/**
 * tooltip template sample
 */

let gridData: any = [{
    Species: 'Mammoth',
    Family: 'Elephantidae',
    Location: 'Northern Africa',
    Kingdom: 'Animalia',
    Order: 'Proboscidea',
    Genus: 'Mammuthus',
    Active: '4 million years ago'
}, {
    Species: 'Mastodon',
    Family: 'Mammutidae',
    Location: 'North America',
    Kingdom: 'Animalia',
    Order: 'Proboscidea',
    Genus: 'Mammut',
    Active: '11,000 years ago'
}, {
    Species: 'Baiji',
    Family: 'Lipotidae',
    Location: 'China',
    Kingdom: 'Animalia',
    Order: 'Artiodactyla',
    Genus: 'Lipotes',
    Active: '2002'
}, {
    Species: 'Quagga',
    Family: 'Equidae',
    Location: 'South Africa',
    Kingdom: 'Animalia',
    Order: 'Perissodactyla',
    Genus: 'Equus',
    Active: '1883 '
}];


let tooltip: Tooltip = new Tooltip({
    position: 'RightCenter',
    target: '.templatetooltip',
    beforeRender: onBeforeRender
});
tooltip.appendTo('#tstooptip');
function onBeforeRender(args: TooltipEventArgs): void {
    let tmpfn: Function = compile("<div id='templateWrap'><img src='./images/${Species}.png' />"
        + "<div class='des'><span>Active &nbsp;&nbsp;:&nbsp; ${Active}</span></div></div>");
    for (let i: number = 0; i < gridData.length; i++) {
        if (gridData[i].Species === args.target.getAttribute('title')) {
            this.content = tmpfn(gridData[i])[0];
        }
    }
}