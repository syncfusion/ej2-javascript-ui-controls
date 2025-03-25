import { Button } from '@syncfusion/ej2-buttons';
import { AppBar } from '../src/appbar/index';

document.getElementById('render').addEventListener('click', renderAppbar);
document.getElementById('destroy').addEventListener('click', destoryAppbar);

let defaultAppBar: AppBar;

function renderAppbar(): void {
    defaultAppBar = new AppBar({
        colorMode: 'Primary',
    });
    defaultAppBar.appendTo('#ej2AppBar');
}

function destoryAppbar(): void {
    if (defaultAppBar) {
        defaultAppBar.destroy();
        defaultAppBar = null;
        menu.destroy();
        menu = null;
        regular.destroy();
        regular = null;
        login.destroy();
        login = null;
    }
}

let menu: Button = new Button({ cssClass: 'e-inherit', iconCss: 'e-icons e-menu' });
menu.appendTo('#menu');
let regular: Button = new Button({ cssClass: 'e-inherit regular', content: 'EJ2 AppBar' });
regular.appendTo('#regular');
let login: Button = new Button({ cssClass: 'e-inherit login', content: 'Login' });
login.appendTo('#login');
