import { Tooltip } from '../../src/tooltip/tooltip';
/**
 * tooltip custom tip style sample
 */
let customTip: Tooltip = new Tooltip({
    content: "Tooltip arrow customized",
    offsetY: 5,
    width: 100,
    cssClass: 'customtip',
    opensOn: 'Click',
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
}, '#customTip');