import { allTypesOfBlock } from "../demos/datasource/blockdata";
import { BlockEditor } from "../src/index";

let blockEditor:BlockEditor;
document.getElementById('render').addEventListener('click', renderblockeditor);
document.getElementById('destroy').addEventListener('click', destoryblockeditor);

function renderblockeditor(): void {
 blockEditor = new BlockEditor({
     width: '100%',
     height: '900px',
     blocks: allTypesOfBlock,
     cssClass:'customCss'
 });
 blockEditor.appendTo('#blockeditor');
}
function destoryblockeditor(): void 
{
      if (blockEditor && !blockEditor.isDestroyed) {
        blockEditor.destroy();
        blockEditor=null;
    }
}