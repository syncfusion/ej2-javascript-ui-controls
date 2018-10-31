import { TextBox, ChangedEventArgs } from '../../src/textbox/textbox';
/**
 * Feature-Matrix TextBox sample
 */
let inputObj: TextBox = new TextBox({
        floatLabelType: 'Auto',
        placeholder: 'Enter the text',
        // change: onChange
});
inputObj.appendTo('#textbox');
let element = document.createElement('div');
function onChange(args: ChangedEventArgs): any {
    element.innerText = 'Change event triggere'; 
    document.getElementById('events').appendChild(element);
} 