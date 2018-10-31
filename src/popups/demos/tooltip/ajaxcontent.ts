import { Tooltip, TooltipEventArgs } from '../../src/tooltip/tooltip';
import { Ajax } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
/**
 * tooltip sample
 */

let tooltip: Tooltip = new Tooltip({
    target: '.target',
    position: 'RightCenter',
    animation: {
        open: { effect: 'ZoomIn', duration: 500 },
        close: { effect: 'ZoomOut', duration: 500 }
    },
    beforeRender: onBeforeRender
});
tooltip.appendTo('#countrylist');

function onBeforeRender(args: TooltipEventArgs): void {
    let ajax: Ajax = new Ajax('tooltipdata.js', 'GET');
    ajax.send().then(
        (result: any) => {
            result = JSON.parse(result);
            for (let i: number = 0; i < result.length; i++) {
                if (result[i].Sports === args.target.getAttribute('data-content')) {
                    this.content = "<div class='contentWrap'><img src='Images/"
                        + result[i].Sports + ".png' class='logo' /><div class='def'>" + result[i].Sports + "</div></div>";
                }
            }
            this.dataBind();
        },
        (reason: any) => {
            this.content = reason;
            this.dataBind();
        });
}