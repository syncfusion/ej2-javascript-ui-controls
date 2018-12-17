/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/index';
import { Slider } from './../../../src/inplace-editor/modules/slider';

InPlaceEditor.Inject(Slider);

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Popup',
    type: 'Slider',
    model: {
        min: 0,
        max: 100,
        value: 30
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
