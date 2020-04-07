/**
 *  Toolbar default Sample
 */
import { Toolbar, ItemModel } from '../../src/toolbar/index';
import { extend } from '@syncfusion/ej2-base';

let items: ItemModel[] = [
    {
        prefixIcon: 'e-cut-icon', tooltipText: 'Cut'
    },
    {
        prefixIcon: 'e-copy-icon', tooltipText: 'Copy'
    },
    {
        prefixIcon: 'e-paste-icon', tooltipText: 'Paste'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-bold-icon', tooltipText: 'Bold'
    },
    {
        prefixIcon: 'e-underline-icon', tooltipText: 'Underline'
    },
    {
        prefixIcon: 'e-italic-icon', tooltipText: 'Italic'
    },
    {
        prefixIcon: 'e-color-icon', tooltipText: 'Color-Picker'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-alignleft-icon', tooltipText: 'Align-Left'
    },
    {
        prefixIcon: 'e-alignjustify-icon', tooltipText: 'Align-Justify'
    },
    {
        prefixIcon: 'e-alignright-icon', tooltipText: 'Align-Right'
    },
    {
        prefixIcon: 'e-aligncenter-icon', tooltipText: 'Align-Center'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-bullets-icon', tooltipText: 'Bullets'
    },
    {
        prefixIcon: 'e-numbering-icon', tooltipText: 'Numbering'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-ascending-icon', tooltipText: 'Sort A - Z'
    },
    {
        prefixIcon: 'e-descending-icon', tooltipText: 'Sort Z - A'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-upload-icon', tooltipText: 'Upload'
    },
    {
        prefixIcon: 'e-download-icon', tooltipText: 'Download'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-indent-icon', tooltipText: 'Text Indent'
    },
    {
        prefixIcon: 'e-outdent-icon', tooltipText: 'Text Outdent'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-clear-icon', tooltipText: 'Clear'
    },
    {
        prefixIcon: 'e-reload-icon', tooltipText: 'Reload'
    },
    {
        prefixIcon: 'e-export-icon', tooltipText: 'Export'
    },
    {
        type: 'Separator'
    },
    {
        prefixIcon: 'e-undo-icon', tooltipText: 'Undo', text: 'Undo'
    },
    {
        prefixIcon: 'e-redo-icon', tooltipText: 'Redo', text: 'Redo'
    }];

let toolbarObj: Toolbar = new Toolbar({
    items: <ItemModel[]>extend([], items, null, true)
});
toolbarObj.appendTo('#ej2Toolbar');

let toolbarObj1: Toolbar = new Toolbar({
    overflowMode: 'Scrollable',
    width: '700px',
    items: <ItemModel[]>extend([], items, null, true)
});
toolbarObj1.appendTo('#ej2Toolbar1');

let toolbarObj2: Toolbar = new Toolbar({
    overflowMode: 'Popup',
    width: '700px',
    items: <ItemModel[]>extend([], items, null, true)
});
toolbarObj2.appendTo('#ej2Toolbar2');

let toolbarObj3: Toolbar = new Toolbar({
    overflowMode: 'Extended',
    width: '700px',
    items: <ItemModel[]>extend([], items, null, true)
});
toolbarObj3.appendTo('#ej2Toolbar3');

let toolbarObj4: Toolbar = new Toolbar({
    overflowMode: 'MultiRow',
    width: '700px',
    items: <ItemModel[]>extend([], items, null, true)
});
toolbarObj4.appendTo('#ej2Toolbar4');

let refreshToolbars: Function = () => {
    let toolbars: HTMLElement[] = [].slice.call(document.querySelectorAll('.e-toolbar'));
    for (let toolbar of toolbars) {
        ((toolbar as any).ej2_instances[0] as Toolbar).refresh();
    }
}

document.getElementById('btn_touch').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
    refreshToolbars();
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
    refreshToolbars();
};
document.getElementById('themechange').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('themechange') as HTMLSelectElement;
    let links: HTMLElement[] = [].slice.call(document.getElementsByTagName('link'));
    for (let link of links) {
        let hrefValue: string = link.getAttribute('href');
        if (hrefValue.indexOf('./theme-files/') !== -1) {
            let currentTheme: string = hrefValue.split('/').pop().split('.')[0];
            link.setAttribute('href', hrefValue.replace(currentTheme, ddl.value));
        }
    }
};