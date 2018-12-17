/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/index';

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Popup',
    type: 'Mask',
    model: {
        mask: '#####',
        placeholder: 'Mask ##### (ex: 012+-)',
        floatLabelType: 'Always'
    }
});
editObj.appendTo('#element');

document.getElementById('renderMode').addEventListener('change', (e: any) => {
    switch (e.target.value) {
        case "1":
            document.body.classList.remove('e-bigger');
            break;
        case "2":
            document.body.classList.add('e-bigger');
            break;
    }
});

document.getElementById('themes').addEventListener('change', (e: any) => {
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});
