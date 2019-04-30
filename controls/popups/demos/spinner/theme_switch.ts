import { createSpinner, setSpinner, SpinnerType, showSpinner  } from '../../src/spinner/spinner';

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

setSpinner({template: '<div style="width:100%;height:100%" class="custom-ball"><div></div></div>'});

createSpinner({ 
    target: document.getElementById('spinner-04'),
    label:"Loading..."
});
showSpinner(document.getElementById('spinner-04'));

    document.getElementById("switchTheme").addEventListener("change", switch_theme);

    function switch_theme() {
        let theme = ( document.getElementById("switchTheme") as HTMLInputElement).value;
        let selectTheme: SpinnerType;
        let filename: string; 
        if ( theme == 'Material') {
            selectTheme =  'Material';
            filename = '../../styles/material.css';
        } else if (theme == 'Fabric') {
            selectTheme =  'Fabric';
            filename = '../../styles/fabric.css';
        } else {
            selectTheme =  'Bootstrap';
            filename = '../../styles/bootstrap.css';
        }
        loadcssfile(filename);
        setSpinner({ type : selectTheme });
    }

    function loadcssfile( filename: string ) {
        let fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename);
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
