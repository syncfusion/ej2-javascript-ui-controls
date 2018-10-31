import { TextBox, ChangedEventArgs } from '../../src/textbox/textbox';
/**
 * Default TextBox sample
 */
let inputObj: TextBox = new TextBox({
        floatLabelType: 'Auto',
        placeholder: 'Enter a name',
});
inputObj.appendTo('#default');

document.getElementById('readonly').onclick = function () {
        if (inputObj.readonly) {
            inputObj.readonly = false;
            document.getElementById('readonly').innerText = 'Enable Readonly';
        }
        else {
            inputObj.readonly = true;
            document.getElementById('readonly').innerText = 'Disable Readonly';
        }
    };
    document.getElementById('enable').onclick = function () {
        if (inputObj.enabled) {
            inputObj.enabled = false;
            document.getElementById('enable').innerText = 'Enabled';
        }
        else {
            inputObj.enabled = true;
            document.getElementById('enable').innerText = 'Disabled';
        }
    };
    document.getElementById('rtl').onclick = function () {
        if (inputObj.enableRtl) {
            inputObj.enableRtl = false;
            document.getElementById('rtl').innerText = 'Enable Rtl';
        }
        else {
            inputObj.enableRtl = true;
            document.getElementById('rtl').innerText = 'Disable Rtl';
        }
    };
    document.getElementById('type').onclick = function () {
        inputObj.type = 'number';
        inputObj.dataBind();
    };
    document.getElementById('float').onclick = function () {
        if (inputObj.floatLabelType === 'Auto') {
            inputObj.floatLabelType = 'Never';
            document.getElementById('float').innerText = 'Enable FloatLabelType';
        }
        else {
            inputObj.floatLabelType = 'Auto';
            document.getElementById('float').innerText = 'Disable FloatLabelType';
        }
    };
    document.getElementById('clear').onclick = function () {
        if (inputObj.showClearButton) {
            inputObj.showClearButton = false;
            document.getElementById('clear').innerText = 'Enable ShowClearButton';
        }
        else {
            inputObj.showClearButton = true;
            document.getElementById('clear').innerText = 'Disable ShowClearButton';
        }
    };
    document.getElementById('destroy').onclick = function () {
        inputObj.destroy();
    };
    