import { Sidebar } from '../../src/sidebar/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
/**
 * Default sidebar sample
 */

// initialize the sideabr component
let defaultSidebar: Sidebar = new Sidebar();
defaultSidebar.appendTo('#default');
