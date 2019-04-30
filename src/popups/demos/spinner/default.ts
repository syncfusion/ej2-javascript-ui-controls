import { createSpinner, showSpinner, setSpinner } from '../../src/spinner/spinner';

    createSpinner({ 
        target: document.getElementById('spinner-01')
    });
    showSpinner(document.getElementById('spinner-01'));
    
    createSpinner({
        target: document.getElementById('spinner-02'),
        label:"Loading..."
    });
    showSpinner(document.getElementById('spinner-02'));

    createSpinner({
        target: document.getElementById('spinner-03'),
        label:"Loading...",
        cssClass: 'e-spin-overlay'
    });
    showSpinner(document.getElementById('spinner-03'));
