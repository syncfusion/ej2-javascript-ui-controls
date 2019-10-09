import { TextBox, ChangedEventArgs } from '../../src/textbox/textbox';
/**
 * Multiline feature-Matrix sample
 */
let textareaObj: TextBox = new TextBox({
        floatLabelType: 'Auto',
        placeholder: 'Enter your address',
});
textareaObj.appendTo('#textbox');
