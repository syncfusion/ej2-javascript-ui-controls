window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.TextBox = (function () {
'use strict';

// tslint:disable
var TextBox = {
    focusIn: function (element) {
        element.focus();
    },
    focusOut: function (element) {
        element.blur();
    }
};

return TextBox;

}());
