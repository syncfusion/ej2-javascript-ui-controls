import { TextBox } from '../../src/textbox/textbox';
import { destroy } from '@syncfusion/ej2-buttons';

/**
 * Multiline TextBox sample
 */     
let textareaObj: TextBox = new TextBox({
        placeholder: 'Enter your address',
        floatLabelType: 'Auto',
});
textareaObj.appendTo('#default');

document.getElementById('enabled').addEventListener('click',function() { changeProperty(this) });
document.getElementById('readonly').addEventListener('click',function() { changeProperty(this) });
document.getElementById('value').addEventListener('blur',function() { changeProperty(this) });
document.getElementById('select').addEventListener('change',function() { changeProperty(this) });
document.getElementById('rows').addEventListener('change',function() { changeProperty(this) });
document.getElementById('destroy').addEventListener('click',function() { changeProperty(this) });
function changeProperty(args: any) {
        if (args.id === "enabled") {
                textareaObj.enabled = args.checked;
        }
        if (args.id === "readonly") {
                textareaObj.readonly = args.checked;
        }
        if (args.id === 'select') {
                textareaObj.floatLabelType = args.value;
        }
        if (args.id === 'value') {
                textareaObj.value = args.value;
        }
        if(args.id === 'rows') {
                textareaObj.addAttributes({rows: args.value});
        }
        if(args.id === 'destroy') {
               textareaObj.destroy();
        }
    }