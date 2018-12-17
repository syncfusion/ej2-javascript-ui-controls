/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { Rte } from '../../../src/inplace-editor/modules/rte';

InPlaceEditor.Inject(Rte);

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'RTE',
    model: {
        value: 'editable content'
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
