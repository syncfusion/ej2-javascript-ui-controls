import { TextBox } from '../../src/textbox/textbox';
/**
 * ClearIcon with TextBox sample
 */
let inputObj: TextBox = new TextBox({
        showClearButton: true,
        placeholder: 'Enter a name',
});
inputObj.appendTo('#default');
    