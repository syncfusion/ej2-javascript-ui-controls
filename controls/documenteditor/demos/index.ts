/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../src/index';
/* tslint:disable */
import { TableDialog, HyperlinkDialog, ParagraphDialog, FontDialog, PageSetupDialog, BookmarkDialog, StyleDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, TableOfContentsDialog } from '../src/index';
import { Editor } from '../src/index';
import { Selection } from '../src/index';
import { OptionsPane } from '../src/index';
import { Search } from '../src/index';
import { ContextMenu } from '../src/index';
import { EditorHistory } from '../src/index';
import { ListDialog } from '../src/index';
import { ImageResizer } from '../src/index';
import { WordExport } from '../src/index';
import { TextExport } from '../src/index';
import { SfdtExport } from '../src/index';
/**
 *  Toolbar sample to demonstrate default functionalities.
 */
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Slider, SliderChangeEventArgs } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { RequestNavigateEventArgs } from '../src/index';

let insert_table_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-table-icon-insert" id="insert_table_cells" style="width:auto";><span class="e-btn-icon e-de-icon-table-inserttable tb-icons e-icons"></span><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:28px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let delete_table_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-table-icon-delete" id="delete_table_cells" style="width:auto";><span class="e-btn-icon e-de-icon-table-deletetable tb-icons e-icons"></span><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:28px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let orientation_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-icon-find" id="orientation" style="width:auto";><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:20px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let margin_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-icon-cut" id="margin" style="width:auto";><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:20px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let size_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-icon-fitpagewidth" id="size" style="width:auto";><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:20px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let bullet_list_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-list-icon-bullet" id="bullet_lists" style="width:auto";><span class="e-btn-icon e-de-icon-bulletlist tb-icons e-icons"></span><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:28px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let number_list_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-list-icon-number" id="number_lists" style="width:auto";><span class="e-btn-icon e-de-icon-numberedlist tb-icons e-icons"></span><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:28px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
let multilevel_list_element: string = '<button class="e-tbar-btn e-control e-btn e-icon-btn e-de-list-icon-multilevel-list" id="multilevel_lists" style="width:auto";><span class="e-btn-icon e-de-icon-multilevel-list tb-icons e-icons"></span><span class="e-input-group-icon e-spin-down e-icons" style="width:28px;height:28px;padding-left:5px;margin-right:4px;font-size:12px;"></span></button>';
// Initialize DropDownList component
let dropDownTemplate: string = '<input type="text" id="style" />';
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false
});
documenteditor.enableAllModules();
let controller: string = 'api/documenteditor/';
let baseUrl: string = 'https://ej2services.syncfusion.com/development/web-services/' + controller;
let zoomFactor: Slider = new Slider({
    change: changeZoomValue,
    value: 100,
    min: 10,
    max: 500
});
zoomFactor.appendTo('#zoom_factor');
let buttonClicked: boolean = false;
let zoom_factor = document.getElementById('zoom_factor_change');
function changeZoomValue(arg: SliderChangeEventArgs) {
    if (!buttonClicked) {
        documenteditor.zoomFactor = (arg.value as any) / 100;
        zoom_factor.innerHTML = arg.value + '%';
    }
    buttonClicked = false;
}
let decreaseButton = document.getElementById('decrease');
decreaseButton.addEventListener('click', zoomDecrease);
let increaseButton = document.getElementById('increase');
increaseButton.addEventListener('click', zoomIncrease);
let zoom_factor_value = document.getElementById('zoom_factor') as any;
function zoomDecrease(arg: any) {
    let zoomValue = zoom_factor_value.ej2_instances[0].value;
    if (zoomValue % 10 !== 0) {
        var value = Math.round(zoomValue / 10) * 10;
        if (value > zoomValue) {
            value -= 10;
        }
    } else {
        value = zoomValue;
        value -= 10;
    }
    documenteditor.zoomFactor = value / 100;
    zoom_factor.innerHTML = value + '%';
    buttonClicked = true;
}
function zoomIncrease(arg: any) {
    let zoomValue = zoom_factor_value.ej2_instances[0].value;
    if (zoomValue % 10 !== 0) {
        var value = Math.round(zoomValue / 10) * 10;
        if (value < zoomValue) {
            value += 10;
        }
    } else {
        value = zoomValue;
        value += 10;
    }
    documenteditor.zoomFactor = value / 100;
    zoom_factor.innerHTML = value + '%';
    buttonClicked = true;
}

let toolBar: Toolbar = new Toolbar({
    clicked: toolbar_btn_click_handler,
    items: [
        {
            prefixIcon: 'e-de-tab-blank-document', tooltipText: 'New', id: 'new'
        },
        {
            prefixIcon: 'e-de-icon-upload tb-icons', tooltipText: 'Open', id: 'open'
        },
        {
            prefixIcon: 'e-de-icon-export tb-icons', tooltipText: 'Save', id: 'save'
        },
        // {
        //     prefixIcon: 'e-de-tab-pdfexport', tooltipText: 'Pdf', id: 'pdf'
        // },
        {
            prefixIcon: 'e-de-icon-print tb-icons', tooltipText: 'Print', id: 'print'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-de-icon-cut tb-icons', tooltipText: 'Cut', id: 'cut'
        },
        {
            prefixIcon: 'e-de-icon-copy tb-icons', tooltipText: 'Copy', id: 'copy'
        },
        // {
        //     prefixIcon: 'e-de-icon-paste tb-icons', tooltipText: 'Paste', id: 'paste'
        // },
        {
            type: 'Separator'
        },
        {
            template: dropDownTemplate, tooltipText: 'Styles', id: 'styles', width: '200px'
        },
        {
            prefixIcon: 'e-de-icon-bold tb-icons', tooltipText: 'Bold', id: 'bold'
        },
        {
            prefixIcon: 'e-de-icon-italic tb-icons', tooltipText: 'Italic', id: 'italic'
        },
        {
            prefixIcon: 'e-de-icon-underline tb-icons', tooltipText: 'Underline', id: 'underline'
        },
        {
            prefixIcon: 'e-de-icon-strikethrough tb-icons', tooltipText: 'Strikethrough', id: 'strikethrough'
        },
        {
            prefixIcon: 'e-de-icon-subscript tb-icons', tooltipText: 'Subscript', id: 'subscript'
        },
        {
            prefixIcon: 'e-de-icon-superscript tb-icons', tooltipText: 'Superscript', id: 'superscript'
        },
        {
            prefixIcon: 'e-de-icon-fontcolor tb-icons', tooltipText: 'Font Color', id: 'fontcolor'
        },
        {
            prefixIcon: 'e-de-icon-clr-format tb-icons', tooltipText: 'Clear Formating', id: 'clear_format'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-de-icon-leftalign tb-icons', tooltipText: 'Align-Left', id: 'align-left'
        },
        {
            prefixIcon: 'e-de-icon-centeralign tb-icons', tooltipText: 'Align-Center', id: 'align-center'
        },
        {
            prefixIcon: 'e-de-icon-rightalign tb-icons', tooltipText: 'Align-Right', id: 'align-right'
        },
        {
            prefixIcon: 'e-de-icon-justifyalign tb-icons', tooltipText: 'Align-Justify', id: 'align-justify'
        },
        {
            prefixIcon: 'e-de-icon-increaseindent tb-icons', tooltipText: 'Text Indent', id: 'left-indent'
        },
        {
            prefixIcon: 'e-de-icon-decreaseindent tb-icons', tooltipText: 'Text Outdent', id: 'right-indent'
        },
        {
            type: 'Separator'
        },
        {
            template: bullet_list_element, tooltipText: 'Bullets', id: 'bullets_list'
        },
        {
            template: number_list_element, tooltipText: 'Numbering', id: 'numbering_list'
        },
        // {
        //     template: bullet_list_element, tooltipText: 'Bullets', id: 'bullets_list'
        // },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-de-icon-undo tb-icons', tooltipText: 'Undo', id: 'undo'
        },
        {
            prefixIcon: 'e-de-icon-redo tb-icons', tooltipText: 'Redo', id: 'redo'
        },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-de-icon-insertimage tb-icons', tooltipText: 'Insert Image', id: 'insert_image'
        },
        {
            prefixIcon: 'e-de-icon-insertlink tb-icons', tooltipText: 'Insert Hyperlink', id: 'insert_hyperlink'
        },
        {
            prefixIcon: 'e-de-tab-bookmark', tooltipText: 'Insert Bookmark', id: 'bookmark'
        },
        {
            prefixIcon: 'e-de-icon-inserttable tb-icons', tooltipText: 'Insert Table', id: 'insert_table'
        },
        {
            template: insert_table_element, tooltipText: 'Insert above, below, left and right', id: 'insert-table-ppty'
        },
        {
            template: delete_table_element, tooltipText: 'Delete rows, columns or entire table', id: 'delete-table-ppty'
        },
        // {
        //     type: 'Separator'
        // },
        // {
        //     template: orientation_element, tooltipText: 'Orientation', id: 'orientation'
        // },
        // {
        //     template: margin_element, tooltipText: 'Margins', id: 'margin'
        // },
        // {
        //     template: size_element, tooltipText: 'Size', id: 'size'
        // },
        // {
        //     type: 'Separator'
        // },
        // {
        //     prefixIcon: 'e-de-icon-fitfullpage tb-icons', tooltipText: 'Fit Full page', id: 'fit_full_page'
        // },
        // {
        //     prefixIcon: 'e-de-icon-fitpagewidth tb-icons', tooltipText: 'Fit Page Width', id: 'fit_page_width'
        // },
        // {
        //     prefixIcon: 'e-de-icon-resetzoom tb-icons', tooltipText: 'Zoom 100%', id: 'reset_zoom'
        // },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'e-de-icon-find tb-icons', tooltipText: 'Find', id: 'find'
        }
    ]
});
toolBar.appendTo('#toolbar');

let insert_table = document.getElementById('insert_table_ppty');
insert_table.innerHTML = '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="insert-row-above" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-row-above tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text" >Insert row above</div></button></div>';
insert_table.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="insert-row-below" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-row-below tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text">Insert row below</div></button></div>';
insert_table.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="insert-column-left" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-column-left tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text">Insert columns to the left</div></button></div>';
insert_table.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="insert-column-right" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-column-right tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text">Insert columns to the right</div></button></div>';
document.getElementById('insert-row-above').onclick = function () {
    documenteditor.editor.insertRow(true);
    insert_table.style.display = 'none';
}
document.getElementById('insert-row-below').onclick = function () {
    documenteditor.editor.insertRow(false);
    insert_table.style.display = 'none';
}
document.getElementById('insert-column-left').onclick = function () {
    documenteditor.editor.insertColumn(true);
    insert_table.style.display = 'none';
}
document.getElementById('insert-column-right').onclick = function () {
    documenteditor.editor.insertColumn(false);
    insert_table.style.display = 'none';
}

let delete_table = document.getElementById('delete_table_ppty');
delete_table.innerHTML = '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="delete-table" type="button" style="width:auto;opacity:0.87;min-width:100%;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-delete tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text">Delete table</div></button></div>';
delete_table.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="delete-row" type="button" style="width:auto;opacity:0.87;min-width:100%;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-row-delete tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text" >Delete row</div></button></div>';
delete_table.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="delete-column" type="button" style="width:auto;opacity:0.87;min-width:100%;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-column-delete tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text">Delete column</div></button></div>';
document.getElementById('delete-table').onclick = function () {
    documenteditor.editor.deleteTable();
    delete_table.style.display = 'none';
}
document.getElementById('delete-row').onclick = function () {
    documenteditor.editor.deleteRow()
    delete_table.style.display = 'none';
}
document.getElementById('delete-column').onclick = function () {
    documenteditor.editor.deleteColumn();
    delete_table.style.display = 'none';
}
toolBar.enableItems(document.getElementById('insert_table_cells').parentElement, false);
toolBar.enableItems(document.getElementById('delete_table_cells').parentElement, false);

// let orientation = document.getElementById('orientation_ppty');
// orientation.innerHTML = '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="portrait" type="button" style="width:auto;opacity:0.87;min-width:100%;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-delete tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text">Portrait</div></button></div>';
// orientation.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="landscape" type="button" style="width:auto;opacity:0.87;min-width:100%;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><span class="e-btn-icon e-de-icon-table-row-delete tb-icons e-icons e-icon-left" style="position:absolute;left:16px;"></span><div class="e-tbar-btn-text" >Landscape</div></button></div>';
// document.getElementById('portrait').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.onPortrait();
//     }
// }
// document.getElementById('landscape').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.onLandscape();
//     }
// }
// toolBar.enableItems(document.getElementById('orientation').parentElement, true);


// let margin = document.getElementById('margin_ppty');
// margin.innerHTML = '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="narrow" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:100px;"><span class="e-btn-icon e-de-icon-table-row-above tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:50px";></span><div class="e-tbar-btn-text">Narrow<br>Top:0.5" &nbsp Bottom:0.5"<br>Left:0.5" &nbsp Right: 0.5"</div></button></div>';
// margin.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="moderate" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:100px;"><span class="e-btn-icon e-de-icon-table-row-below tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:160px";"></span><div class="e-tbar-btn-text">Moderate<br>Top:1" &nbsp Bottom:1"<br>Left:0.75" &nbsp Right: 0.75"</div></button></div>';
// margin.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="wide" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:100px;"><span class="e-btn-icon e-de-icon-table-column-left tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:270px";"></span><div class="e-tbar-btn-text">Wide<br>Top:1" &nbsp Bottom:1"<br>Left:2" &nbsp Right: 2"</div></button></div>';
// margin.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="mirrored" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:100px;"><span class="e-btn-icon e-de-icon-table-column-right tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:380px";"></span><div class="e-tbar-btn-text">Mirrored<br>Top:1" &nbsp Bottom:1"<br>Inside:1.25" &nbsp Outside: 1"</div></button></div>';
// margin.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="customMargin" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><div class="e-tbar-btn-text">Custom Margins</div></button></div>';
// document.getElementById('narrow').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.changeMarginValue('narrow');
//     }
// }
// document.getElementById('moderate').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.changeMarginValue('moderate');
//     }
// }
// document.getElementById('wide').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.changeMarginValue('wide');
//     }
// }
// document.getElementById('mirrored').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.changeMarginValue('mirrored');
//     }
// }
// document.getElementById('customMargin').onclick = function () {
//     if (documenteditor.selection.selectionRanges.length === 1) {
//         documenteditor.showMarginsDialog('customMargin');
//     }
// }
// toolBar.enableItems(document.getElementById('margin').parentElement, true);


// let size = document.getElementById('size_ppty');
// size.innerHTML = '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="letter" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:50px;"><span class="e-btn-icon e-de-icon-table-row-above tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:20px";></span><div class="e-tbar-btn-text">Letter<br>8.5" x 11"</div></button></div>';
// size.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="tabloid" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:50px;"><span class="e-btn-icon e-de-icon-table-row-below tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:75px";"></span><div class="e-tbar-btn-text">Tabloid<br>11" x 17"</div></button></div>';
// size.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="legal" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:50px;"><span class="e-btn-icon e-de-icon-table-column-left tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:130px";"></span><div class="e-tbar-btn-text">Legal<br>8.5" x 14"</div></button></div>';
// size.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="statement" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;height:50px;"><span class="e-btn-icon e-de-icon-table-column-right tb-icons e-icons e-icon-left" style="position:absolute;left:16px;top:190px";"></span><div class="e-tbar-btn-text">Statement<br>5.5" x 8.5"</div></button></div>';
// size.innerHTML += '<div class="e-toolbar-item e-toolbar-popup" style="min-width:120px;"><button class="e-tbar-btn e-tbtn-txt e-control e-btn" id="pSize" type="button" style="width:auto;opacity:0.87;min-width:100%;padding: 0 4px;font-weight:400;font-size:14px;"><div class="e-tbar-btn-text">Paper size</div></button></div>';
// document.getElementById('letter').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.onPaperSize('letter');
//     }
// }
// document.getElementById('tabloid').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.onPaperSize('tabloid');
//     }
// }
// document.getElementById('legal').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.onPaperSize('legal');
//     }
// }
// document.getElementById('statement').onclick = function () {
//     if (documenteditor.editorModule) {
//         documenteditor.editorModule.onPaperSize('statement');
//     }
// }
// document.getElementById('pSize').onclick = function () {
//     if (documenteditor.selection.selectionRanges.length === 1) {
//         documenteditor.showMarginsDialog('pSize');
//     }
// }
// toolBar.enableItems(document.getElementById('size').parentElement, true);

let bulletList = document.getElementById('bullet_list_ppty');
let table1 = createElement('table');
let bulletrow1 = createElement('tr');
table1.appendChild(bulletrow1);
let bulletcolumn1 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow1.appendChild(bulletcolumn1);
let bullet_none = createElement('div', { className: 'e-de-list-bullet-none' });
bulletcolumn1.appendChild(bullet_none);
let bulletcolumn2 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow1.appendChild(bulletcolumn2);
let bullet_dot = createElement('div', { className: 'e-de-list-bullet-dot' });
bulletcolumn2.appendChild(bullet_dot);
bulletrow1.appendChild(bulletcolumn2);
let bulletcolumn3 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow1.appendChild(bulletcolumn3);
let bullet_circle = createElement('div', { className: 'e-de-list-bullet-circle' });
bulletcolumn3.appendChild(bullet_circle);
let bulletcolumn4 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow1.appendChild(bulletcolumn4);
let bullet_square = createElement('div', { className: 'e-de-list-bullet-square' });
bulletcolumn4.appendChild(bullet_square);

let bulletrow2 = createElement('tr');
table1.appendChild(bulletrow2);
let bulletcolumn21 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow2.appendChild(bulletcolumn21);
let bullet_flower = createElement('div', { className: 'e-de-list-bullet-flower' });
bulletcolumn21.appendChild(bullet_flower);
let bulletcolumn22 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow2.appendChild(bulletcolumn22);
let bullet_arrow = createElement('div', { className: 'e-de-list-bullet-arrow' });
bulletcolumn22.appendChild(bullet_arrow);
let bulletcolumn23 = createElement('td', { styles: 'padding:4px;', className: 'e-de-bullet' });
bulletrow2.appendChild(bulletcolumn23);
let bullet_tick = createElement('div', { className: 'e-de-list-bullet-tick' });
bulletcolumn23.appendChild(bullet_tick);

bulletList.appendChild(table1);
let listDialog1 = createElement('div', { className: 'e-de-list-dialog-open', innerHTML: 'Define new Multilevel List...', styles: 'text-align:center;padding:7px;' });
bulletList.appendChild(listDialog1);
listDialog1.addEventListener('click', openListDilaog);
bullet_none.addEventListener('click', bulletNoneClick);
bullet_dot.addEventListener('click', bulletDotClick);
bullet_circle.addEventListener('click', bulletCircleClick);
bullet_square.addEventListener('click', bulletSquareClick);
bullet_flower.addEventListener('click', bulletFlowerClick);
bullet_arrow.addEventListener('click', bulletArrowClick);
bullet_tick.addEventListener('click', bulletTickClick);
function bulletNoneClick() {
    if (documenteditor.editorModule) {
        documenteditor.selection.paragraphFormat.setList(undefined);
    }
}
function bulletDotClick() {
    if (documenteditor.editorModule) {
        documenteditor.editor.applyBullet('\uf0b7', 'Symbol');
    }
}
function bulletCircleClick() {
    if (documenteditor.editorModule) {
        documenteditor.editor.applyBullet("\uf06f" + "\u0020", 'Symbol');
    }
}
function bulletSquareClick() {
    if (documenteditor.editorModule) {
        documenteditor.editor.applyBullet('\uf0a7', 'Wingdings')
    }
}
function bulletFlowerClick() {
    if (documenteditor.editorModule) {
        documenteditor.editor.applyBullet('\uf076', 'Wingdings');
    }
}
function bulletArrowClick() {
    if (documenteditor.editorModule) {
        documenteditor.editor.applyBullet('\uf0d8', 'Wingdings');
    }
}
function bulletTickClick() {
    if (documenteditor.editorModule) {
        documenteditor.editor.applyBullet('\uf0fc', 'Wingdings');
    }
}
let numberedList = document.getElementById('numbered_list_ppty');
let table2 = createElement('table');
let numberedrow1 = createElement('tr');
table2.appendChild(numberedrow1);
let numberedcolumn1 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow1.appendChild(numberedcolumn1);
let numbered_none = createElement('div', { className: 'e-de-list-numbered-none' });
numberedcolumn1.appendChild(numbered_none);
let numberedcolumn2 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow1.appendChild(numberedcolumn2);
let numbered_numberdot = createElement('div', { className: 'e-de-list-numbered-number-dot' });
numberedcolumn2.appendChild(numbered_numberdot);
numberedrow1.appendChild(numberedcolumn2);
let numberedcolumn3 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow1.appendChild(numberedcolumn3);
let numbered_numberbrace = createElement('div', { className: 'e-de-list-numbered-number-brace' });
numberedcolumn3.appendChild(numbered_numberbrace);

let numberedrow2 = createElement('tr');
table2.appendChild(numberedrow2);
let numberedcolumn21 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow2.appendChild(numberedcolumn21);
let numbered_uproman = createElement('div', { className: 'e-de-list-numbered-up-roman' });
numberedcolumn21.appendChild(numbered_uproman);
let numberedcolumn22 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow2.appendChild(numberedcolumn22);
let numbered_uplettter = createElement('div', { className: 'e-de-list-numbered-up-letter' });
numberedcolumn22.appendChild(numbered_uplettter);
let numberedcolumn23 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow2.appendChild(numberedcolumn23);
let numbered_lowletterbrace = createElement('div', { className: 'e-de-list-numbered-low-letter-brace' });
numberedcolumn23.appendChild(numbered_lowletterbrace);

let numberedrow3 = createElement('tr');
table2.appendChild(numberedrow3);
let numberedcolumn31 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow3.appendChild(numberedcolumn31);
let numbered_lowletterdot = createElement('div', { className: 'e-de-numbered-low-letter-dot' });
numberedcolumn31.appendChild(numbered_lowletterdot);
let numberedcolumn32 = createElement('td', { styles: 'padding:4px;', className: 'e-de-numbered' });
numberedrow3.appendChild(numberedcolumn32);
let numbered_lowroman = createElement('div', { className: 'e-de-list-numbered-low-roman' });
numberedcolumn32.appendChild(numbered_lowroman);

numberedList.appendChild(table2);

let listDialog = createElement('div', { className: 'e-de-list-dialog-open', innerHTML: 'Define new Multilevel List...', styles: 'text-align:center;padding:7px;' });
numberedList.appendChild(listDialog);
listDialog.addEventListener('click', openListDilaog);
numbered_none.addEventListener('click', numberedNoneClick);
numbered_numberdot.addEventListener('click', numberedNumberDotClick);
numbered_numberbrace.addEventListener('click', numberedNumberBraceClick);
numbered_uproman.addEventListener('click', numberedUpRomanClick);
numbered_uplettter.addEventListener('click', numberedUpLetterClick);
numbered_lowletterbrace.addEventListener('click', numberedLowLetterBraceClick);
numbered_lowletterdot.addEventListener('click', numberedLowLetterDotClick);
numbered_lowroman.addEventListener('click', numberedLowRomanClick);
function numberedNoneClick() {
    documenteditor.selection.paragraphFormat.setList(undefined);
}
function numberedNumberDotClick() {
    documenteditor.editor.applyNumbering('%1.', 'Arabic');
}
function numberedNumberBraceClick() {
    documenteditor.editor.applyNumbering('%1)', 'Arabic');
}
function numberedUpRomanClick() {
    documenteditor.editor.applyNumbering('%1.', 'UpRoman');
}
function numberedUpLetterClick() {
    documenteditor.editor.applyNumbering('%1.', 'UpLetter');
}
function numberedLowLetterBraceClick() {
    documenteditor.editor.applyNumbering('%1)', 'LowLetter');
}
function numberedLowLetterDotClick() {
    documenteditor.editor.applyNumbering('%1.', 'LowLetter');
}
function numberedLowRomanClick() {
    documenteditor.editor.applyNumbering('%1.', 'LowRoman');
}
// let multilevelList = document.getElementById('multilevel_list_ppty');
// let table3 = createElement('table');
// let multilevelrow1 = createElement('tr');
// table3.appendChild(multilevelrow1);
// let multilevelcolumn1 = createElement('td', { styles: 'padding:4px;', className: 'e-de-multilevel-list' });
// multilevelrow1.appendChild(multilevelcolumn1);
// let multilevel_none = createElement('div', { className: 'e-de-list-multilevel-none' });
// multilevelcolumn1.appendChild(multilevel_none);
// let multilevelcolumn2 = createElement('td', { styles: 'padding:4px;', className: 'e-de-multilevel-list' });
// multilevelrow1.appendChild(multilevelcolumn2);
// let multilevel_list_brace = createElement('div', { className: 'e-de-list-multilevel-list-normal' });
// multilevelcolumn2.appendChild(multilevel_list_brace);
// multilevelrow1.appendChild(multilevelcolumn2);
// let multilevelcolumn3 = createElement('td', { styles: 'padding:4px;', className: 'e-de-multilevel-list' });
// multilevelrow1.appendChild(multilevelcolumn3);
// let multilevel_list_dot = createElement('div', { className: 'e-de-list-multilevel-list-multilevel' });
// multilevelcolumn3.appendChild(multilevel_list_dot);

// let multilevelrow2 = createElement('tr');
// table3.appendChild(multilevelrow2);
// let multilevelcolumn21 = createElement('td', { styles: 'padding:4px;', className: 'e-de-multilevel-list' });
// multilevelrow2.appendChild(multilevelcolumn21);
// let multilevel_list_bullets = createElement('div', { className: 'e-de-list-multilevel-list-bullets' });
// multilevelcolumn21.appendChild(multilevel_list_bullets);
// multilevelList.appendChild(table3);
// let listDialog = createElement('div', { className: 'e-de-list-dialog-open', innerHTML: 'Define new Multilevel List...', styles: 'text-align:center;padding:7px;' });
// multilevelList.appendChild(listDialog);

// multilevel_none.addEventListener('click', multiLevelListNoneClick);
// multilevel_list_brace.addEventListener('click', multiLevelListBraceClick);
// multilevel_list_dot.addEventListener('click', multiLevelListDotClick);
// multilevel_list_bullets.addEventListener('click', multiLevelListBulletClick);
// listDialog.addEventListener('click', openListDilaog);
// function multiLevelListNoneClick() {
//     documenteditor.selection.paragraphFormat.setList(undefined);
// }
// function multiLevelListBraceClick() {
//     documenteditor.editor.applyNumbering('numbering');
// }
// function multiLevelListDotClick() {
//     documenteditor.editor.applyNumbering('multiLevel');
// }
// function multiLevelListBulletClick() {
//     documenteditor.editor.applyNumbering('bullet');
// }
function openListDilaog() {
    documenteditor.listDialogModule.showListDialog();
}

function toolbar_btn_click_handler(arg: ClickEventArgs): void {
    let value: any;
    switch (arg.item.id) {
        case 'align-justify':
            if (documenteditor.editorModule) {
                documenteditor.editorModule.toggleTextAlignment('Justify');
            }
            break;
        case 'align-center':
            if (documenteditor.editorModule) {
                documenteditor.editorModule.toggleTextAlignment('Center');
            }
            break;
        case 'align-right':
            if (documenteditor.editorModule) {
                documenteditor.editorModule.toggleTextAlignment('Right');
            }
            break;
        case 'align-left':
            if (documenteditor.editorModule) {
                documenteditor.editorModule.toggleTextAlignment('Left');
            }
            break;
        case 'italic':
            if (documenteditor.editorModule) {
                documenteditor.selection.toggleItalic();
            }
            break;
        case 'underline':
            if (documenteditor.editorModule) {
                documenteditor.selection.toggleUnderline('Single');
            }
            break;
        case 'bold':
            if (documenteditor.editorModule) {
                documenteditor.selection.toggleBold();
            }
            break;
        // case 'paste':
        //     break;
        case 'copy':
            if (documenteditor.editorModule) {
                documenteditor.selection.copy();
            }
            break;
        case 'cut':
            if (documenteditor.editorModule) {
                documenteditor.editor.cut();
            }
            break;
        case 'new':
            documenteditor.openBlank();
            break;
        case 'open':
            let fileUpload: HTMLInputElement = document.getElementById('uploadfileButton') as HTMLInputElement;
            fileUpload.value = '';
            fileUpload.click();
            break;
        case 'save':
            saveDocx();
            break;
        case 'bullets_list':
            bulletList.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
            bulletList.style.display = 'block';
            break;
        case 'numbering_list':
            numberedList.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
            numberedList.style.display = 'block';
            break;
        // case 'multilevel_list':
        //     multilevelList.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
        //     multilevelList.style.display = 'block';
        //     break;
        case 'left-indent':
            if (documenteditor.editorModule) {
                documenteditor.selection.increaseIndent();
            }
            break;
        case 'right-indent':
            if (documenteditor.editorModule) {
                documenteditor.selection.decreaseIndent();
            }
            break;
        case 'print':
            documenteditor.print();
            break;
        case 'strikethrough':
            if (documenteditor.editorModule) {
                documenteditor.selection.toggleStrikethrough('SingleStrike');
            }
            break;
        case 'subscript':
            if (documenteditor.editorModule) {
                documenteditor.selection.toggleSubscript();
            }
            break;
        case 'superscript':
            if (documenteditor.editorModule) {
                documenteditor.selection.toggleSuperscript();
            }
            break;
        case 'clear_format':
            documenteditor.editorModule.clearFormatting();
            break;
        case 'undo':
            if (documenteditor.editorHistory) {
                documenteditor.editorHistory.undo();
            }
            break;
        case 'redo':
            if (documenteditor.editorHistory) {
                documenteditor.editorHistory.redo();
            }
            break;
        case 'insert_image':
            let pictureUpload: HTMLInputElement = document.getElementById("insertImageButton") as HTMLInputElement;
            pictureUpload.value = '';
            pictureUpload.click();
            break;
        case 'insert_hyperlink':
            documenteditor.showHyperlinkDialog();
            break;
        case 'insert_table':
            documenteditor.showTableDialog();
            break;
        case 'insert-table-ppty':
            insert_table.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
            insert_table.style.display = 'block';
            break;
        case 'delete-table-ppty':
            delete_table.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
            delete_table.style.display = 'block';
            break;
        // case 'orientation':
        //     orientation.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
        //     delete_table.style.display = 'block';
        //     break;
        // case 'margin':
        //     margin.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
        //     margin.style.display = 'block';
        //     break
        // case 'size':
        //     size.style.left = (arg.originalEvent as any).clientX - (arg.originalEvent as any).offsetX + 'px';
        //     size.style.display = 'block';
        //     break
        // case 'fit_full_page':
        //     documenteditor.fitPage('FitFullPage');
        //     break;
        // case 'fit_page_width':
        //     documenteditor.fitPage('FitPageWidth');
        //     break;
        // case 'reset_zoom':
        //     documenteditor.zoomFactor = 1;
        //     break;
        case 'find':
            documenteditor.showOptionsPane();
            break;
        // case 'replace':
        //     break;
        case 'fontcolor':
            document.getElementById('font_color_input').click();
            if (Browser.isWindows || Browser.isIE) {
                (document.getElementById('font_color_input') as HTMLInputElement).style.left = "";
            }
            break;
        case 'bookmark':
            documenteditor.showBookmarkDialog();
            break;
        case 'pdf':
            savePdf();
            break;
        // case 'highlightcolor':
        //     document.getElementById('highlight_color_input').click();
        //     break;
    }
    // documenteditor.updateFocus();
}
let host: string = 'http://internaldemo.syncfusion.com:598/';
//let host: string = 'http://localhost:61687/';
function saveDocx() {
    documenteditor.save('Sample', 'Docx');
};
function saveText() {
    documenteditor.save('Sample', 'Txt');
};
function saveJSON() {
    documenteditor.save('Sample', 'Sfdt');
};
function savePdf() {
    saveFile('Pdf', '.pdf');
};
function saveRtf() {
    saveFile('Rtf', '.rtf');
};
function saveDoc() {
    saveFile('Doc', '.doc');
};
function saveDot() {
    saveFile('Dot', '.dot');
};
function saveDotx() {
    saveFile('Dotx', '.dotx');
};
function saveWordML() {
    saveFile('WordML', '.xml');
};
function saveFile(api: string, format: string) {
    documenteditor.saveAsBlob().then((blobData: Blob) => {
        let formData: FormData = new FormData();
        formData.append('fname', 'sample.docx');
        formData.append('data', blobData);
        saveAs(formData, 'Save' + api, format);
    });
}
function saveAs(formData: FormData, method: string, format: string): void {
    let httpRequest: XMLHttpRequest = new XMLHttpRequest();
    httpRequest.open('POST', baseUrl + method, true);
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 304) {
                if (!(!navigator.msSaveBlob)) {
                    navigator.msSaveBlob(httpRequest.response, 'sample' + format);
                } else {
                    let downloadLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
                    saveInternal('sample' + format, format, httpRequest.response, downloadLink, 'download' in downloadLink);
                }
            } else {
                console.error(httpRequest.response);
            }
        }
    }
    httpRequest.responseType = 'blob';
    httpRequest.send(formData);
};
function saveInternal(fileName: string, extension: string, buffer: Blob, downloadLink: HTMLAnchorElement, hasDownloadAttribute: Boolean): void {
    if (hasDownloadAttribute) {
        downloadLink.download = fileName;
        let dataUrl: string = window.URL.createObjectURL(buffer);
        downloadLink.href = dataUrl;
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('click', true, true);
        downloadLink.dispatchEvent(event);
        setTimeout((): void => {
            window.URL.revokeObjectURL(dataUrl);
            dataUrl = undefined;
        });
    } else {
        if (extension !== 'docx' && extension !== 'xlsx') {
            let url: string = window.URL.createObjectURL(buffer);
            let isPopupBlocked: Window = window.open(url, '_blank');
            if (!isPopupBlocked) {
                window.location.href = url;
            }
        } else {
            let reader: FileReader = new FileReader();
            reader.onloadend = () => {
                let isPopupBlocked: Window = window.open(reader.result as string, '_blank');
                if (!isPopupBlocked) {
                    window.location.href = reader.result as string;
                }
            }
            reader.readAsDataURL(buffer);
        }
    }
};
function loadFile(path: any): void {
    let httpRequest: XMLHttpRequest = new XMLHttpRequest();
    httpRequest.open('POST', baseUrl + 'Import', true);
    let waitingPopUp: HTMLElement = document.getElementById('waiting-popup');
    waitingPopUp.style.display = 'block';
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 304) {
                documenteditor.open(httpRequest.responseText);
                waitingPopUp.style.display = 'none';
            } else {
                waitingPopUp.style.display = 'none';
                console.error(httpRequest.response);
            }
        }
    }
    let formData: FormData = new FormData();
    formData.append('files', path);
    document.getElementById('titlebar').innerHTML = path.name;
    httpRequest.send(formData);
};
// let pageCount = document.getElementById('pageCount');
// documenteditor.documentChange = () => {
//     pageCount.innerHTML = documenteditor.getPageCount() + '';
// }

// documenteditor.requestNavigate = (args: any) => {
//     window.open(args.navigationLink);
// };
documenteditor.zoomFactorChange = () => {
    document.getElementById('zoom_factor_change').innerHTML = Math.round((documenteditor as any).viewer.zoomFactor * 100) + '%';
    zoomFactor.value = Math.round((documenteditor as any).viewer.zoomFactor * 100);
};
documenteditor.contentChange = () => {
    setTimeout(() => {
        onContentChange();
    }, 20)
}
documenteditor.selectionChange = () => {
    setTimeout(() => {
        onSelectionChange();
    }, 20)
}

document.getElementById('uploadfileButton').addEventListener('change', onFileChange);
document.getElementById('uploadfileButton').setAttribute('accept', '.doc,.docx,.rtf,.txt,.htm,.html,.sfdt');

document.getElementById('insertImageButton').addEventListener('change', onInsertImage);

document.getElementById('font_color_input').addEventListener('change', onFontColor);

// document.getElementById('highlight_color_input').addEventListener('change', onHighlightColor);

function onFontColor(arg: any): void {
    if (documenteditor.editorModule) {
        documenteditor.selection.characterFormat.fontColor = arg.target.value;
    }
}
// function onHighlightColor(arg: any): void {
//     if (documenteditor.editorModule) {
//         documenteditor.selection.characterFormat.highlightColor = arg.target.value;
//     }
// }

function onInsertImage(args: any): void {
    if (navigator.userAgent.match('Chrome') || navigator.userAgent.match('Firefox') || navigator.userAgent.match('Edge') || navigator.userAgent.match('MSIE') || navigator.userAgent.match('.NET')) {
        if (args.target.files[0]) {
            let path = args.target.files[0];
            let reader = new FileReader();
            reader.onload = function (frEvent: any) {
                let base64String = frEvent.target.result;
                let image = document.createElement('img');
                image.addEventListener('load', function () {
                    documenteditor.editor.insertImage(base64String, this.width, this.height);
                })
                image.src = base64String;
            };
            reader.readAsDataURL(path);
        }
        //Safari does not Support FileReader Class
    } else {
        let image = document.createElement('img');
        image.addEventListener('load', function () {
            documenteditor.editor.insertImage(args.target.value);
        })
        image.src = args.target.value;
    }
}
function onFileChange(args: any): void {
    if (args.target.files[0]) {
        let path = args.target.files[0];
        if (path.name.substr(path.name.lastIndexOf('.')) === '.sfdt') {
            let fileReader: FileReader = new FileReader();
            fileReader.onload = (e: any) => {
                let contents: any = e.target.result;
                documenteditor.open(contents);
            };
            fileReader.readAsText(path);
            documenteditor.documentName = path.name.substr(0, path.name.lastIndexOf('.'));
        } else {
            loadFile(path);
        }
    }
    event.preventDefault();
};
let cut: HTMLElement = document.getElementById('cut');
let copy: HTMLElement = document.getElementById('copy');

let boldButton = document.getElementById('bold');
let italicButton = document.getElementById('italic');
let underlineButton = document.getElementById('underline');
let strikethrough = document.getElementById('strikethrough');
let subScript = document.getElementById('subscript');
let superScript = document.getElementById('superscript');

let leftAlignButton = document.getElementById('align-left');
let rightAlignButton = document.getElementById('align-right');
let centerAlignButton = document.getElementById('align-center');
let justifyButton = document.getElementById('align-justify');

let undo: HTMLElement = document.getElementById('undo');
let redo: HTMLElement = document.getElementById('redo');
let hyperLink: HTMLElement = document.getElementById('insert_hyperlink');
let insertTable: HTMLElement = document.getElementById('insert_table');

// let pageNumber = document.getElementById('currentPageNumber');

// let insertTableCell: HTMLElement = document.getElementById('insert_table_cells').parentElement;
// let deleteTableCell: HTMLElement = document.getElementById('delete_table_cells').parentElement;

function onSelectionChange() {
    // let isInsideTabe = documenteditor.getEditingContextType() == 'Table'
    // if (isInsideTabe && !documenteditor.isReadOnlyMode) {
    //     toolBar.enableItems(insertTableCell, true);
    //     toolBar.enableItems(deleteTableCell, true);
    // } else {
    //     toolBar.enableItems(insertTableCell, false);
    //     toolBar.enableItems(deleteTableCell, false);
    // }
    // pageNumber.innerHTML = documenteditor.getCurrentPageNumber() + '';
    //#region character format
    if (documenteditor.selection.characterFormat.bold) {
        if (!boldButton.classList.contains('e-btn-toggle')) {
            boldButton.classList.add('e-btn-toggle');
        }
    }
    else {
        if (boldButton.classList.contains('e-btn-toggle')) {
            boldButton.classList.remove('e-btn-toggle');
        }
    }
    if (documenteditor.selection.characterFormat.italic) {
        if (!italicButton.classList.contains('e-btn-toggle')) {
            italicButton.classList.add('e-btn-toggle');
        }
    }
    else {
        if (italicButton.classList.contains('e-btn-toggle')) {
            italicButton.classList.remove('e-btn-toggle');
        }
    }
    if (documenteditor.selection.characterFormat.underline !== undefined && documenteditor.selection.characterFormat.underline !== 'None') {
        if (!underlineButton.classList.contains('e-btn-toggle')) {
            underlineButton.classList.add('e-btn-toggle');
        }
    }
    else {
        if (underlineButton.classList.contains('e-btn-toggle')) {
            underlineButton.classList.remove('e-btn-toggle');
        }
    }
    if (documenteditor.selection.characterFormat.strikethrough !== undefined && documenteditor.selection.characterFormat.strikethrough !== 'None') {
        if (!strikethrough.classList.contains('e-btn-toggle')) {
            strikethrough.classList.add('e-btn-toggle');
        }
    }
    else {
        if (strikethrough.classList.contains('e-btn-toggle')) {
            strikethrough.classList.remove('e-btn-toggle');
        }
    }
    if (documenteditor.selection.characterFormat.baselineAlignment !== undefined && documenteditor.selection.characterFormat.baselineAlignment === 'Subscript') {
        if (!subScript.classList.contains('e-btn-toggle')) {
            subScript.classList.add('e-btn-toggle');
        }
    }
    else {
        if (subScript.classList.contains('e-btn-toggle')) {
            subScript.classList.remove('e-btn-toggle');
        }
    }
    if (documenteditor.selection.characterFormat.baselineAlignment !== undefined && documenteditor.selection.characterFormat.baselineAlignment === 'Superscript') {
        if (!superScript.classList.contains('e-btn-toggle')) {
            superScript.classList.add('e-btn-toggle');
        }
    }
    else {
        if (superScript.classList.contains('e-btn-toggle')) {
            superScript.classList.remove('e-btn-toggle');
        }
    }
    //#endregion

    //#region paragraph format
    if (documenteditor.selection.paragraphFormat.textAlignment === 'Left') {
        if (!leftAlignButton.classList.contains('e-btn-toggle')) {
            leftAlignButton.classList.add('e-btn-toggle');
        }
        if (rightAlignButton.classList.contains('e-btn-toggle')) {
            rightAlignButton.classList.remove('e-btn-toggle');
        }
        if (centerAlignButton.classList.contains('e-btn-toggle')) {
            centerAlignButton.classList.remove('e-btn-toggle');
        }
        if (justifyButton.classList.contains('e-btn-toggle')) {
            justifyButton.classList.remove('e-btn-toggle');
        }
    }
    else if (documenteditor.selection.paragraphFormat.textAlignment === 'Right') {
        if (leftAlignButton.classList.contains('e-btn-toggle')) {
            leftAlignButton.classList.remove('e-btn-toggle');
        }
        if (!rightAlignButton.classList.contains('e-btn-toggle')) {
            rightAlignButton.classList.add('e-btn-toggle');
        }
        if (centerAlignButton.classList.contains('e-btn-toggle')) {
            centerAlignButton.classList.remove('e-btn-toggle');
        }
        if (justifyButton.classList.contains('e-btn-toggle')) {
            justifyButton.classList.remove('e-btn-toggle');
        }
    }
    else if (documenteditor.selection.paragraphFormat.textAlignment === 'Center') {
        if (leftAlignButton.classList.contains('e-btn-toggle')) {
            leftAlignButton.classList.remove('e-btn-toggle');
        }
        if (rightAlignButton.classList.contains('e-btn-toggle')) {
            rightAlignButton.classList.remove('e-btn-toggle');
        }
        if (!centerAlignButton.classList.contains('e-btn-toggle')) {
            centerAlignButton.classList.add('e-btn-toggle');
        }
        if (justifyButton.classList.contains('e-btn-toggle')) {
            justifyButton.classList.remove('e-btn-toggle');
        }
    }
    else if (documenteditor.selection.paragraphFormat.textAlignment === 'Justify') {
        if (leftAlignButton.classList.contains('e-btn-toggle')) {
            leftAlignButton.classList.remove('e-btn-toggle');
        }
        if (rightAlignButton.classList.contains('e-btn-toggle')) {
            rightAlignButton.classList.remove('e-btn-toggle');
        }
        if (centerAlignButton.classList.contains('e-btn-toggle')) {
            centerAlignButton.classList.remove('e-btn-toggle');
        }
        if (!justifyButton.classList.contains('e-btn-toggle')) {
            justifyButton.classList.add('e-btn-toggle');
        }
    } else if (documenteditor.selection.paragraphFormat.textAlignment === 'Justify') {
        if (leftAlignButton.classList.contains('e-btn-toggle')) {
            leftAlignButton.classList.remove('e-btn-toggle');
        }
        if (rightAlignButton.classList.contains('e-btn-toggle')) {
            rightAlignButton.classList.remove('e-btn-toggle');
        }
        if (centerAlignButton.classList.contains('e-btn-toggle')) {
            centerAlignButton.classList.remove('e-btn-toggle');
        }
        if (!justifyButton.classList.contains('e-btn-toggle')) {
            justifyButton.classList.add('e-btn-toggle');
        }
    }
    //#endregion

    // // cut, copy
    if (documenteditor.selection.isEmpty) {
        toolBar.enableItems(cut.parentElement, false);
        toolBar.enableItems(copy.parentElement, false);
    } else {
        toolBar.enableItems(cut.parentElement, true);
        toolBar.enableItems(copy.parentElement, true);
    }
    if (documenteditor.editorHistory && !documenteditor.editorHistory.canUndo()) {
        toolBar.enableItems(undo.parentElement, false);
    }
    if (documenteditor.editorHistory && !documenteditor.editorHistory.canRedo()) {
        toolBar.enableItems(redo.parentElement, false);
    }
}

let wordCount = document.getElementById('word_count');

function onContentChange() {
    if (documenteditor.editorHistory && !documenteditor.editorHistory.canUndo()) {
        toolBar.enableItems(undo.parentElement, false);
    } else {
        toolBar.enableItems(undo.parentElement, true);
    }
    if (documenteditor.editorHistory && !documenteditor.editorHistory.canRedo()) {
        toolBar.enableItems(redo.parentElement, false);
    } else {
        toolBar.enableItems(redo.parentElement, true);
    }
    // wordCount.innerHTML = documenteditor.getWordCount() + ' words';
    // pageCount.innerHTML = documenteditor.getPageCount() + '';
}
documenteditor.requestNavigate = (args: RequestNavigateEventArgs) => {
    if (args.linkType !== 'Bookmark') {
        let link: string = args.navigationLink;
        if (args.localReference.length > 0) {
            link += '#' + args.localReference;
        }
        window.open(link);
        args.isHandled = true;
    }
}
window.addEventListener('mouseup', isEnableResizer);
function isEnableResizer(event: any) {
    if ((event.offsetX <= 0 && !isNullOrUndefined(documenteditor.imageResizerModule) && documenteditor.imageResizerModule.isImageResizing)
        || (event.clientY <= 94 && !isNullOrUndefined(documenteditor.imageResizerModule) && documenteditor.imageResizerModule.isImageResizing)) {
        documenteditor.imageResizerModule.mouseUpInternal();
        documenteditor.imageResizerModule.isImageResizing = false;
    }
}
documenteditor.appendTo('#container');



let listObj: DropDownList = new DropDownList({
    // set the index value to select an item based on index at initial rendering
    index: 0,
    // set the placeholder to DropDownList input element
    placeholder: 'Select a style',
    dataSource: [{ StyleName: 'Normal', Class: 'e-style-edit e-de-icon-clr-format' }],
    fields: { iconCss: 'Class', value: 'StyleName' },
    footerTemplate: '<span class="create-style-footer"> Create a Style</span>',
    width: 150,
    // bind the change event
    select: (args: any) => {
        if (!documenteditor.isReadOnly && documenteditor.editorModule) {
            if (!isNullOrUndefined(args.e) && args.e.target.className === 'e-list-icon e-style-edit e-de-icon-clr-format') {
                if (documenteditor.styleDialogModule && !isNullOrUndefined(documenteditor.viewer.styles.findByName(args.itemData.StyleName))) {
                    documenteditor.styleDialogModule.show(args.itemData.StyleName);
                }
            } else {
                documenteditor.editorModule.applyStyle(args.itemData.StyleName);
            }
        }
    },
    open: (args: any) => {
        updateStyleNames();
        args.popup.element.getElementsByClassName('create-style-footer')[0].addEventListener('click', createStyle);
    }
});
listObj.appendTo('#style');

function updateStyleNames(): void {
    let collection: string[] = documenteditor.viewer.styles.getStyleNames('Paragraph');
    let defaultStyleNames: string[] = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
    let finalList: string[] = collection.concat(defaultStyleNames).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
    listObj.dataSource = constructStyleDropItems(finalList);
}
function constructStyleDropItems(stlyeNames: string[]): any {
    let collection: any = [];
    for (let name of stlyeNames) {
        let obj: any = {};
        obj.StyleName = name;
        obj.Class = 'e-style-edit e-de-icon-clr-format';
        collection.push(obj);
    }
    return collection;
}
function createStyle() {
    if (documenteditor.styleDialogModule) {
        documenteditor.styleDialogModule.show();
    }
}
//#region 