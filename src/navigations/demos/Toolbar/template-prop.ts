/**
 *  Toolbar Template Sample
 */
import { Toolbar } from '../../src/toolbar/index';
   let toolbar: Toolbar = new Toolbar({
    items: [
        { text: "Cut", prefixIcon:'e-cut-icon' },
        { text: "Copy", prefixIcon:'e-copy-icon' },
        { text: "Paste", prefixIcon:'e-paste-icon' },
        { type: "Separator" },
        { text: "Undo", suffixIcon:'e-undo-icon' },
        { text: "Redo", suffixIcon:'e-redo-icon' },
        { template: '<input placeholder="Search" style="height:34px;"/>' }
        ]
});
toolbar.appendTo('#element');