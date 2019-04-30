import { createSpinner, showSpinner  } from '../../src/spinner/spinner';

createSpinner({ 
    target: document.getElementById('spinner-01'),
    width: 16,
    label:"Loading...",
    cssClass: 'e-spin-overlay'
});
showSpinner(document.getElementById('spinner-01'));

createSpinner({ 
    target: document.getElementById('spinner-02'),
    width: 24,
    label:"Loading...",
    cssClass: 'e-spin-overlay'
});
showSpinner(document.getElementById('spinner-02'));

createSpinner({ 
    target: document.getElementById('spinner-03'),
    width: 32,
    label:"Loading...",
    cssClass: 'e-spin-overlay'
});
showSpinner(document.getElementById('spinner-03'));

createSpinner({ 
    target: document.getElementById('spinner-04'),
    width: 48,
    label:"Loading...",
    cssClass: 'e-spin-overlay'
});
showSpinner(document.getElementById('spinner-04'));
