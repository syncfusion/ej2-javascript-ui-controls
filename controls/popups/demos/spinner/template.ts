import { createSpinner, showSpinner  } from '../../src/spinner/spinner';

createSpinner({ 
    target: document.getElementById('spinner-01'),
    width: 32,
    template: '<div style="width:100%;height:100%" class="custom-rolling"><div></div></div>'
});
showSpinner(document.getElementById('spinner-01'));

createSpinner({ 
    target: document.getElementById('spinner-02'),
    label:"Loading...",
    cssClass:'e-rtl'
});
showSpinner(document.getElementById('spinner-02'));

createSpinner({ 
    target: document.getElementById('spinner-03'),
    label:"Loading...",
    cssClass:'custom-color'
});
showSpinner(document.getElementById('spinner-03'));
