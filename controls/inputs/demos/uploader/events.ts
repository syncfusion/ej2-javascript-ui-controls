/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';
import { createElement, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    canceling: oncancelling,
    change: onchange,
    chunkFailure: onchunkFailure,
    chunkSuccess: onchunkSuccess,
    clearing: onclearing,
    failure: onfailure,
    pausing: onpausing,
    progress: onprogress,
    removing: onremoving,
    resuming: onresuming,
    selected: onselected,
    success: onsuccess,
    uploading: onuploading

});
uploadObj.appendTo('#fileupload');
let target: any = document.getElementById('events');
function oncancelling(args:any):void {
   target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
}
function onchange(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onchunkFailure(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onchunkSuccess(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onclearing(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onfailure(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onpausing(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onremoving(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onprogress(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onresuming(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
    
}
function onsuccess(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
}
function onselected(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
}
function onuploading(args:any):void {
    target.appendChild(createElement('div', {className: 'events-element', innerHTML:"Uploader's "+ args.name +" event triggered", attrs: {'title': args.name}}));
}


