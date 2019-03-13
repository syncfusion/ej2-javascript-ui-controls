import { Sortable } from '../../../src/sortable/index';
import { createElement } from '@syncfusion/ej2-base';

/**
 * Place holder sample
 */
new Sortable(document.getElementById('default'), {
    placeHolder: (): HTMLElement => {
        return createElement('div', { className: 'e-place-holder' });
    }
});
