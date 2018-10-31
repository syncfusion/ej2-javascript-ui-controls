/**
 * Flat datasource binding sample
 */
import { Menu, MenuModel } from '../../src/menu/index';

let gameList: { [key: string]: Object }[] = [
        { id: "Op1", text: "File", iconCss: "", parentId: null },
        { id: "Op2", text: "Edit", iconCss: "", parentId: null },
        { id: "Op3", text: "Go", iconCss: "", parentId: null },
        { id: "Op4", text: "Help", iconCss: "", parentId: null },

        { id: "Op5", text: "New File", iconCss: "e-icons e-link", parentId: "Op1" },
        { id: "Op6", text: "New Window", iconCss: "", parentId: "Op1" },
        { id: "Op7", text: "Undo", iconCss: "", parentId: "Op2" },

        { id: "Op8", text: "Switch Editor", iconCss: "", parentId: "Op3" },
        { id: "Op9", text: "Switch Group", iconCss: "", parentId: "Op3" },
        { id: "Op10", text: "Go to File", iconCss: "", parentId: "Op3" },

        { id: "Op11", text: "New Editor", iconCss: "", parentId: "Op8" },
        { id: "Op12", text: "Previous Editor", iconCss: "", parentId: "Op8" },

        { id: "Op13", text: "Group 1", iconCss: "", parentId: "Op9" },
        { id: "Op14", text: "Group 2", iconCss: "", parentId: "Op9" }
    ];

let menuOptions: MenuModel = {
    showItemOnClick: true,
    items: gameList
};

let menuObj: Menu = new Menu(menuOptions, '#menu');