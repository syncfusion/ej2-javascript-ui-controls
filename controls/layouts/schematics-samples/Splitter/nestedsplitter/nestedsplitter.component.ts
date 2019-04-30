import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { SplitterComponent} from '@syncfusion/ej2-angular-layouts';
import { Splitter } from '@syncfusion/ej2-layouts';
/**
 * Nested Splitter sample
 */
@Component({
    selector: 'nestedsplitter',
    templateUrl: 'nestedsplitter.component.html',
    styleUrls: ['nestedsplitter.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NestedsplitterComponent {
    @ViewChild('splitterInstance') splitterObj: SplitterComponent;

    public HTMLcontent: string = '<div><div class="content"><h3 class="h3">HTML</h3><div class="code-preview">&lt;<span>!DOCTYPE html></span><div>&lt;<span>html></span></div>' +
    '<div>&lt;<span>body></span></div>&lt;<span>div</span> id="custom-image"><div style="margin-left: 5px">&lt;<span>img</span> src="https://ej2.syncfusion.com/angular/demos/src/albert.png"></div>' +
    "<div>&lt;<span>div</span>&gt;</div><div>&lt;<span>/body></span></div><div>&lt;<span>/html></span></div></div></div></div>";
    public CSScontent: string = '<div><div class="content"><h3 class="h3">CSS</h3><div class="code-preview"><span>img {</span><div id="code-text">margin:<span>0 auto;</span></div>' +
    '<div id="code-text">display:<span>flex;</span></div><div id="code-text">height:<span>70px;</span></div><span>}</span></div></div></div>';
    public javascriptContent: string = '<div><div class="content"><h3 class="h3">JavaScript</h3><div class="code-preview"><span>var </span>'
    + 'image = document.getElementById("custom-image");<div>image.addEventListener("click", function() {</div>'
    + '<div style="padding-left: 20px;">// Code block for click action</div><span> }</span></div></div></div>';

    public onCreated () {
        document.getElementById('outerSplitter').querySelector('.e-pane-vertical').setAttribute('id', 'Innersplitter');
        let splitterObj = new Splitter({
            height: '220px',
            paneSettings: [
                { size: '50%', min: '23%', content: this.HTMLcontent },
                { size: '20%', min: '15%', content: this.CSScontent },
                { size: '30%', min: '25%', content: this.javascriptContent }
            ],
            width: '100%'
        });
        splitterObj.appendTo('#Innersplitter');
    }
}
