import { createSpinner, showSpinner } from '../../src/spinner/spinner';

createSpinner({ 
    target: document.getElementById('spinner-01'),
    label:"Loading...",
    cssClass: 'e-spin-left'
});
showSpinner(document.getElementById('spinner-01'));

createSpinner({ 
    target: document.getElementById('spinner-02'),
    label:"Loading...",
    cssClass: 'e-spin-center'
});
showSpinner( document.getElementById('spinner-02'));

createSpinner({ 
    target: document.getElementById('spinner-03'),
    label:"Loading...",
    cssClass: 'e-spin-right'
});
showSpinner(document.getElementById('spinner-03'));
