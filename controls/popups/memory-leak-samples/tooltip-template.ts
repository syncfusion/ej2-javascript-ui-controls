import { Button } from '@syncfusion/ej2-buttons';
import { Tooltip } from '../src/tooltip/tooltip';

let tooltipObj: Tooltip;;

document.getElementById('render').addEventListener('click', renderTooltip);
document.getElementById('destroy').addEventListener('click', destroyTooltip);


function renderTooltip(): void {
  let button: Button = new Button({ cssClass: 'e-outline', isPrimary: true });
  button.appendTo('#content');

  tooltipObj = new Tooltip({
    cssClass: 'e-tooltip-template-css',
    opensOn: 'Click',
    content: `<div id="democontent" class="democontent">
			<div class="info">
				<h3 style="margin-top:10px">Mammoth
				</h3>
        <hr style="margin: 9px 0px"/>
        <div id="mammoth" style="float:right"><img src="../demos/tooltip/images/Mammoth.png"
						 alt="" width="125" height="125"/></div>
				</div>
					<div>The
            <a href="https://en.wikipedia.org/wiki/Mammoth" target="_blank"> Mammoth</a>
            Mammoths were large, elephant-like mammals that lived during the Ice Age. They belonged to the genus Mammuthus and were covered in thick fur to survive cold climates. The most famous species, the woolly mammoth (Mammuthus primigenius), roamed North America, Europe, and Asia. They had long, curved tusks and were herbivores, feeding mainly on grass and shrubs. Mammoths went extinct around 4,000 years ago, possibly due to climate change and human hunting.</div>
		</div>`,
    position: 'BottomCenter',
    height:'Auto',
    windowCollision: true,
    created: function () {
        tooltipObj.open();
    },
  });
  tooltipObj.appendTo('#customization');
}

function destroyTooltip(): void {
    if (tooltipObj && !tooltipObj.isDestroyed) {
        tooltipObj.destroy();
        tooltipObj = null;
    }
}