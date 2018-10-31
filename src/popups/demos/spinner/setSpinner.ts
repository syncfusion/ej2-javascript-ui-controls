import { createSpinner, showSpinner, setSpinner } from '../../src/spinner/spinner';

    createSpinner({ 
        target: document.getElementById('spinner-01')
    });
    showSpinner(document.getElementById('spinner-01'));

    setSpinner({template: '<div style="width:100%;height:100%" class="custom-rolling"><div></div></div>'})
    
    createSpinner({
        target: document.getElementById('spinner-02'),
        label:"Loading..."
    });
    showSpinner(document.getElementById('spinner-02'));

    createSpinner({
        target: document.getElementById('spinner-03'),
        label:"Loading..."
    });
    showSpinner(document.getElementById('spinner-03'));

    setSpinner({template: '<div style="width:100%;height:100%" class="custom-ball"><div></div></div>'})

    createSpinner({
        target: document.getElementById('spinner-04'),
        label:"Loading..."
    });
    showSpinner(document.getElementById('spinner-04'));

        createSpinner({
        target: document.getElementById('spinner-05'),
        label:"Loading..."
    });
    showSpinner(document.getElementById('spinner-05'));
