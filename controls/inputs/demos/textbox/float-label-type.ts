import { TextBox } from '../../src/textbox/textbox';
/**
 * FloatLabelType TextBox sample
 */
let inputObj: TextBox = new TextBox({
        floatLabelType: 'Never',
        placeholder: 'Enter a name',
});
inputObj.appendTo('#default');
    