/**
 *  Toolbar default Sample
 */
import { Toolbar } from '../../src/toolbar/index';

    let toolbarObj: Toolbar = new Toolbar({
        items: [
            {
                prefixIcon: 'e-add-icon', text: 'Add to FaceBook', tooltipText: 'FaceBook', align: 'Center' },
            {
                prefixIcon: 'e-add-icon', text: 'Add to Twitter', tooltipText: 'Twitter', align: 'Center' },
            {
                prefixIcon: 'e-add-icon', text: 'Add to Instagram', tooltipText: 'Instagram', align: 'Center' },
            ]
    });
    toolbarObj.appendTo('#ej2Toolbar');