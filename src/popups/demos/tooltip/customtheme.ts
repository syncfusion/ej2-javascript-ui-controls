import { Tooltip } from '../../src/tooltip/tooltip';
/**
 * tooltip custom theme sample
 */

let customTheme: Tooltip = new Tooltip({
    content: "Tooltip color customized",
    opensOn: 'Click',
    animation: {
        open: { effect: 'None', duration: 0, delay: 0 },
        close: { effect: 'None', duration: 0, delay: 0 }
    }
});
customTheme.appendTo('#customTheme');
