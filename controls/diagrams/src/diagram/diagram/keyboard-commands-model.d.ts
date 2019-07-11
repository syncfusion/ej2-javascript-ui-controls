import { Keys, KeyModifiers } from '../enum/enum';import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';import { ContextMenuItemModel } from '../objects/interface/interfaces';

/**
 * Interface for a class KeyGesture
 */
export interface KeyGestureModel {

    /**
     * Sets the key value, on recognition of which the command will be executed.
     * * none - no key
     * * Number0 = The 0 key
     * * Number1 = The 1 key
     * * Number2 = The 2 key
     * * Number3 = The 3 key
     * * Number4 = The 4 key
     * * Number5 = The 5 key
     * * Number6 = The 6 key
     * * Number7 = The 7 key
     * * Number8 = The 8 key
     * * Number9 = The 9 key
     * * Number0 = The 0 key
     * * BackSpace = The BackSpace key 
     * * F1 = The f1 key
     * * F2 = The f2 key
     * * F3 = The f3 key
     * * F4 = The f4 key
     * * F5 = The f5 key
     * * F6 = The f6 key
     * * F7 = The f7 key
     * * F8 = The f8 key
     * * F9 = The f9 key
     * * F10 = The f10 key
     * * F11 = The f11 key
     * * F12 = The f12 key
     * * A = The a key
     * * B = The b key
     * * C = The c key
     * * D = The d key
     * * E = The e key
     * * F = The f key
     * * G = The g key
     * * H = The h key
     * * I = The i key
     * * J = The j key
     * * K = The k key
     * * L = The l key
     * * M = The m key
     * * N = The n key
     * * O = The o key
     * * P = The p key
     * * Q = The q key
     * * R = The r key
     * * S = The s key
     * * T = The t key
     * * U = The u key
     * * V = The v key
     * * W = The w key
     * * X = The x key
     * * Y = The y key
     * * Z = The z key
     * * Left = The left key
     * * Right = The right key
     * * Top = The top key
     * * Bottom = The bottom key
     * * Escape = The Escape key
     * * Tab = The tab key
     * * Delete = The delete key
     * * Enter = The enter key 
     * * The Space key 
     * * The page up key 
     * * The page down key 
     * * The end key 
     * * The home key 
     * * The Minus
     * * The Plus
     * * The Star
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @aspNumberEnum
     * @blazorNumberEnum
     * @default undefined
     */
    key?: Keys;

    /**
     * Sets a combination of key modifiers, on recognition of which the command will be executed.
     * * None - no modifiers are pressed
     * * Control - ctrl key
     * * Meta - meta key im mac
     * * Alt - alt key
     * * Shift - shift key
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @aspNumberEnum
     * @blazorNumberEnum
     * @default undefined
     */
    keyModifiers?: KeyModifiers;

}

/**
 * Interface for a class Command
 */
export interface CommandModel {

    /**
     * Defines the name of the command
     * @default ''
     */
    name?: string;

    /**
     * Check the command is executable at the moment or not
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    canExecute?: Function | string;

    /**
     * Defines what to be executed when the key combination is recognized
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    execute?: Function | string;

    /**
     * Defines a combination of keys and key modifiers, on recognition of which the command will be executed
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let node: NodeModel;
     * node = {
     * ...
     * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * annotations : [{ content: 'text' }];
     * ...
     * };
     * 
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes:[node],
     * commandManager:{
     * commands:[{
     * name:'customCopy',
     * parameter : 'node',
     * canExecute:function(){
     * if(diagram.selectedItems.nodes.length>0 || diagram.selectedItems.connectors.length>0){
     *               return true;
     *           }
     *           return false;
     * },
     * execute:function(){
     * for(let i=0; i<diagram.selectedItems.nodes.length; i++){
     *               diagram.selectedItems.nodes[i].style.fill = 'red';
     *           }
     *           diagram.dataBind();
     * },
     * gesture:{
     * key:Keys.G, keyModifiers:KeyModifiers.Shift | KeyModifiers.Alt
     * }
     * }]
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default {}
     */
    gesture?: KeyGestureModel;

    /**
     * Defines any additional parameters that are required at runtime
     * @default ''
     */
    parameter?: string;

}

/**
 * Interface for a class CommandManager
 */
export interface CommandManagerModel {

    /**
     * Stores the multiple command names with the corresponding command objects
     * @default []
     */
    commands?: CommandModel[];

}

/**
 * Interface for a class ContextMenuSettings
 */
export interface ContextMenuSettingsModel {

    /**
     * Enables/Disables the context menu items
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    show?: boolean;

    /**
     * Shows only the custom context menu items
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    showCustomMenuOnly?: boolean;

    /**
     * Defines the custom context menu items
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     *   contextMenuSettings: {   show: true, items: [{
     * text: 'delete', id: 'delete', target: '.e-diagramcontent', iconCss: 'e-copy'
     * }],
     * showCustomMenuOnly: false,
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    items?: ContextMenuItemModel[];

}