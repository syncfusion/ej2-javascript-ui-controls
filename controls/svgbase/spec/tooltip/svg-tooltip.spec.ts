/**
 * Tooltip Spec
 */

import { EmitType, remove,createElement }  from '@syncfusion/ej2-base';
import { Tooltip} from '../../src/tooltip/tooltip';
import { SvgRenderer} from '../../src/svg-render/index';
import { ITooltipRenderingEventArgs, ITooltipAnimationCompleteArgs } from '../../src/tooltip/interface';
import { removeElement, getElement } from '../../src/tooltip/helper';

describe('SVG Tooltip', () => {
    let element: Element;  
    let svgObject: Element; 
    let text: Element;
    let id: string = 'ej2container';
    let tooltip: Tooltip;   
 
    beforeAll((): void => {
        element = <HTMLElement>createElement('div', { id: id });
        element.setAttribute('style', 'background:lightblue'); 
        let element2 : Element = <HTMLElement>createElement('div', { id: 'tooltipcontainer' , styles :'position:absolute'}); 
        let element1 : Element = <HTMLElement>createElement('div', { id: 'tooltipparent' , styles :'position:relative'}).appendChild(element2);
        element.appendChild(element1);     
        let render : SvgRenderer = new SvgRenderer('SVG');
        let svg : Element = render.createSvg({
            id: 'tooltip_svg',
            width: 500,
            height: 500
        });
        svg.appendChild(render.drawCircle({
            id :'circle1', cx :10, cy :10, r : 5, fill :'yellow'
        }));
        svg.appendChild(render.drawCircle({
            id :'circle1', cx :50, cy :50, r : 15, fill :'pink'
        }));
        svg.appendChild(render.drawCircle({
            id :'circle1', cx :490, cy :50, r : 15, fill :'red'
        }));

        svg.appendChild(render.drawCircle({
            id :'circle1', cx :250, cy :250, r : 50, fill :'blue'
        }));
        element.appendChild(svg);        
        document.body.appendChild(element);
        let template: Element = <HTMLElement>createElement('div', { id: 'tooltiptemplate', styles :'display:none' });
        let template1: Element = <HTMLElement>createElement('div');
        template1.innerHTML = '${x}: ';
        let template2: Element = <HTMLElement>createElement('div');
        template2.innerHTML = '${y}';
        template.appendChild(template1);
        template.appendChild(template2);
         document.body.appendChild(template);
        tooltip = new Tooltip({
            header: 'Header',
            content: ['this.text'],            
            border: null,
            enableAnimation: false,
            location: {x: 10, y : 10},
            shared : false,
            palette: ['red'],
            shapes : ['Circle'],
            offset: 10,
            isCanvas: true,
            areaBounds : {height : 500, width : 500, x : 7}
        }, '#tooltipcontainer');
    });
    afterAll((): void => {
        tooltip.destroy();
      //  removeElement(id);  
        removeElement('tooltipparent');    
        removeElement('tooltiptemplate');        
    });
    it('Checking Tooltip instance creation', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);            
        };
        tooltip.shapes = ['Pentagon'],
        tooltip.refresh();
    });
    it('Checking Tooltip without header and marker', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(3);
           
        };
       tooltip.header = '';
       tooltip.shapes = [];     
       tooltip.location = {x : 50, y : 50};
       tooltip.refresh();
    });
    it('Animating the tooltip', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);           
        };
        tooltip.location = {x : 250, y: 250}; 
        tooltip.enableAnimation= true; 
       tooltip.shapes = ['Image']; 
       tooltip.dataBind();
    });

    it('Checking Tooltip with shared', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(4);
            expect(document.getElementById('tooltipcontainer_path').getAttribute('d').lastIndexOf('Q')).toBe(143);
           
        };
       tooltip.content = ['TooltipText'];
       tooltip.shared = true;         
       tooltip.shapes = ['Diamond'];
       tooltip.refresh();
    });

    it('Header and text in bold', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.childElementCount).toBe(3);
            expect((<HTMLElement>textElement.children[0]).style.fontWeight).toBe('bold');
            expect((<HTMLElement>textElement.children[2]).style.fontWeight).toBe('bold');
           
        };
       tooltip.content = ['TooltipText <br/> <b>Multiple Text<b>'];
       tooltip.header = '<b>Bold Header</b>';  
       tooltip.location = {x : 490, y : 50};     
       tooltip.shapes = ['VerticalLine'];
       tooltip.refresh();
    });

    it('Top Position', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.childElementCount).toBe(3);
            expect((<HTMLElement>textElement.children[0]).style.fontWeight).toBe('bold');
            expect((<HTMLElement>textElement.children[2]).style.fontWeight).toBe('bold');
          
        };
       tooltip.content = ['TooltipText <br/> <b>Multiple Text<b>'];
       tooltip.header = '<b>Bold Header</b>';  
       tooltip.location = {x : 250, y : 250};    
       tooltip.shapes = ['HorizontalLine']; 
       tooltip.refresh();
    });
    it('Left Position', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.childElementCount).toBe(3);
            expect((<HTMLElement>textElement.children[0]).style.fontWeight).toBe('bold');
            expect((<HTMLElement>textElement.children[2]).style.fontWeight).toBe('bold');
           
        };
       tooltip.inverted = true;
       tooltip.location = {x : 10, y : 10};     
       tooltip.refresh();
    });

    it('Left Bottom Position with Theme', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);            
            let path: Element = document.getElementById('tooltipcontainer_path');
            expect(path.getAttribute('fill')).toBe('rgba(0, 8, 22, 0.75)');
            let headerpath: Element = document.getElementById('tooltipcontainer_header_path');
            expect(headerpath.getAttribute('stroke')).toBe('#ffffff');
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.children[0].getAttribute('fill')).toBe('#ffffff');            
           
             
        };
       tooltip.inverted = true;      
       tooltip.location = {x : 10, y : 480};  
       tooltip.shapes = ['Triangle'];      
       tooltip.refresh();
    });

    it('Left Center Position', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            
        };
        tooltip.inverted = true;
       tooltip.location = {x : 10, y : 250};       
       tooltip.getPersistData();
       tooltip.shapes = ['Cross'];   
       tooltip.refresh();
    });

    it('Right Center Position', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.childElementCount).toBe(3);
            expect((<HTMLElement>textElement.children[0]).style.fontWeight).toBe('bold');
            expect((<HTMLElement>textElement.children[2]).style.fontWeight).toBe('bold');
           
        };
        tooltip.inverted = true;
        tooltip.location = {x : 490, y : 100};     
        tooltip.refresh();
    });

    it('Right Top Position', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);           
        };
        tooltip.inverted = true;
       tooltip.location = {x : 490, y : 10};  
       tooltip.shapes = ['Rectangle'];     
       tooltip.refresh();
    });

    it('Right Bottom Position', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);          
        };
        tooltip.inverted = true;
       tooltip.location = {x : 490, y : 480};    
       tooltip.header = '';
       tooltip.content = ['TooltipText : <b>Multiple Text<b> <br/> second line']; 
       tooltip.refresh();
    });

    it('Negative value', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
         
        };
        tooltip.inverted = true;
       tooltip.location = {x : -90, y : -50};       
       tooltip.refresh();
    });
    it('Negative value without invert', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
          
        };
      tooltip.inverted = false;
       tooltip.location = {x : -90, y : -50};       
       tooltip.refresh();
    });
    it('Shared Tooltip with different shape', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);
            let trackball: Element = document.getElementById('tooltipcontainer_trackball_group');
            expect(trackball.childElementCount).toBe(2);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.childElementCount).toBe(4);
            expect(document.getElementById('tooltipcontainer_path').getAttribute('d').lastIndexOf('Q')).toBe(105);
           
        };
       tooltip.content = ['TooltipText <br/> <b>Multiple Text<b>', 'Second line'];
       tooltip.header = '<b>Bold Header</b>';       
       tooltip.inverted = false;
       tooltip.arrowPadding = 0;
       tooltip.shapes = ['InvertedTriangle', 'Triangle'];
       tooltip.refresh();
    });   
   

    it('Checking Template', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).toBe(null);
          /*  let element: Element = document.getElementById('tooltipcontainer');
            expect(element.childElementCount).toBe(1);
            let textElement: HTMLElement =s <HTMLElement>document.getElementById('tooltipcontainer').children[0].children[0];
            expect(textElement.innerText).toBe('10:');*/
          
        };
       tooltip.template = '<div>${x}:</div><div>${y}</div>';
       tooltip.data = {x : 10, y: 56};       
       tooltip.inverted = false;
       tooltip.shared = false;
       tooltip.refresh();
    });
    it('Animating the template', (done: Function) => {
        tooltip.animationComplete = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).toBe(null);
            removeElement('tooltipcontainerparent_template')
           /* let element: Element = document.getElementById('tooltipcontainer');
            expect(element.childElementCount).toBe(1);
            let textElement: HTMLElement = <HTMLElement>document.getElementById('tooltipcontainer').children[0].children[0];
            expect(textElement.innerText).toBe('50:');*/
            done();
        };             
       tooltip.data = {x : 50, y: 26};      
       tooltip.enableAnimation= true;
       tooltip.location = {x : 200, y : 300};       
       tooltip.loaded = null;
       tooltip.template = '#tooltiptemplate';
       tooltip.dataBind();
    });
    it('FadeOut for Tooltip', (done: Function) => {
        tooltip.animationComplete = (args: ITooltipAnimationCompleteArgs) => {
            if (args.tooltip.fadeOut) {
                let tooltipElement: HTMLElement = <HTMLElement>getElement(args.tooltip.element.id);
                let tooltipGroup: HTMLElement = tooltipElement.firstChild as HTMLElement;   
                expect(tooltipGroup.style.display).toBe('none');
                done();
            }            
         };
        tooltip.enableAnimation = false;
        tooltip.refresh();
        tooltip.fadeOut(); 
       
     });
    it('High contrast theme', () => {
        tooltip.loaded = (arsgs: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let path: Element = document.getElementById('tooltipcontainer_path');
            expect(path.getAttribute('fill')).toBe('#ffffff');
            let headerpath: Element = document.getElementById('tooltipcontainer_header_path');
            expect(headerpath.getAttribute('stroke')).toBe('#969696');
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.children[0].getAttribute('fill')).toBe('#000000');
        };
       tooltip.tooltipRender = null;
       tooltip.template = null;
       tooltip.location = {x : 250, y: 250};       
       tooltip.inverted = false;
       tooltip.enableAnimation= false;
       tooltip.shared = false;
       tooltip.animationComplete = null;
       tooltip.theme = 'HighContrast';
       tooltip.refresh();
    });
    it('FabricDark Theme', () => {
        tooltip.loaded = (arsgs: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let path: Element = document.getElementById('tooltipcontainer_path');
            expect(path.getAttribute('fill')).toBe('#F4F4F4');
            let headerpath: Element = document.getElementById('tooltipcontainer_header_path');
            expect(headerpath.getAttribute('stroke')).toBe('#9A9A9A');
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.children[0].getAttribute('fill')).toBe('#282727');
        };
       tooltip.tooltipRender = null;
       tooltip.template = null;
       tooltip.location = {x : 250, y: 250};       
       tooltip.inverted = false;
       tooltip.enableAnimation= false;
       tooltip.shared = false;
       tooltip.animationComplete = null;
       tooltip.theme = 'FabricDark';
       tooltip.refresh();
    });
	it('MaterialDark Theme', () => {
        tooltip.loaded = (arsgs: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let path: Element = document.getElementById('tooltipcontainer_path');
            expect(path.getAttribute('fill')).toBe('#F4F4F4');
            let headerpath: Element = document.getElementById('tooltipcontainer_header_path');
            expect(headerpath.getAttribute('stroke')).toBe('#9A9A9A');
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.children[0].getAttribute('fill')).toBe('#282727');
        };
       tooltip.tooltipRender = null;
       tooltip.template = null;
       tooltip.location = {x : 250, y: 250};       
       tooltip.inverted = false;
       tooltip.enableAnimation= false;
       tooltip.shared = false;
       tooltip.animationComplete = null;
       tooltip.theme = 'MaterialDark';
       tooltip.refresh();
    });

    it('FadeOut for Tooltip', (done: Function) => {
       tooltip.animationComplete = (args: ITooltipAnimationCompleteArgs) => {
          if (args.tooltip.fadeOut) {
            let tooltipElement: HTMLElement = <HTMLElement>getElement(args.tooltip.element.id);
            let tooltipGroup: HTMLElement = tooltipElement.firstChild as HTMLElement;   
            expect(tooltipGroup.getAttribute('opacity')).toBe('0');
            done();
          }
           
        };
       tooltip.refresh();
       tooltip.fadeOut();     
      
    });

    it('checking with arablic unicode', (done: Function) => {
        tooltip.animationComplete = (args: ITooltipAnimationCompleteArgs) => {
            if (args.tooltip.fadeOut) {
                let text: HTMLElement = <HTMLElement>getElement("tooltipcontainer_text");
                expect(text.childElementCount).toBe(6);
                done();
            }

        };
        tooltip.header = 'ذكي متصفح',
        tooltip.content =  ['كروم : <b>14%</b> '],
        tooltip.loaded = null;
        tooltip.refresh();
        tooltip.fadeOut();
    });

    it('checking with colon within the bold tag', (done: Function) => {
        tooltip.animationComplete = (args: ITooltipAnimationCompleteArgs) => {
            if (args.tooltip.fadeOut) {
                let text: HTMLElement = <HTMLElement>getElement("tooltipcontainer_text");
                expect(text.childElementCount).toBe(7);
                expect(text.childNodes[1].textContent).toEqual('Consumption');
                expect((text.childNodes[1] as HTMLElement).outerHTML.indexOf('bold') > -1).toBe(true);
                expect(text.childNodes[3].textContent).toEqual('IST');
                expect((text.childNodes[3] as HTMLElement).outerHTML.indexOf('bold') > -1).toBe(true);
                expect(text.childNodes[6].textContent).toEqual(' normalText');
                expect((text.childNodes[6] as HTMLElement).outerHTML.indexOf('bold') > -1).toBe(false);
                done();
            }

        };
        tooltip.content =  [ '<b>Consumption:IST</b> : normalText'],
        tooltip.loaded = null;
        tooltip.refresh();
        tooltip.fadeOut();
    });

    it('Bootstrap4 Theme', () => {
        tooltip.loaded = (arsgs: Object) => {
            svgObject = getElement('tooltipcontainer_svg');        
            expect(svgObject).not.toBe(null);
            let path: Element = document.getElementById('tooltipcontainer_path');
            expect(path.getAttribute('fill')).toBe('rgba(0, 0, 0, 0.9)');
            let headerpath: Element = document.getElementById('tooltipcontainer_header_path');
            expect(headerpath.getAttribute('stroke')).toBe('rgba(255, 255, 255, 0.2)');
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.children[0].getAttribute('fill')).toBe('rgba(255, 255, 255, 0.9)');
        };
       tooltip.tooltipRender = null;
       tooltip.template = null;
       tooltip.location = {x : 250, y: 250};       
       tooltip.inverted = false;
       tooltip.enableAnimation= false;
       tooltip.shared = false;
       tooltip.animationComplete = null;
       tooltip.theme = 'Bootstrap4';
       tooltip.refresh();
    });
    it('Tooltip header text wrap', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');
            expect(svgObject).not.toBe(null);
            let groupElement: Element = document.getElementById('tooltipcontainer_group');
            expect(groupElement.childElementCount).toBe(5);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.childElementCount).toBe(3);

        };
        tooltip.header = 'aaaaaaaaa aaaaaaaaa aaaaaa aaaaaa aaaa aaaaaa aaaaaaaa';
        tooltip.location = { x: 490, y: 100 };
        tooltip.content = ['test'];
        tooltip.tooltipRender = null;
        tooltip.template = null;
        tooltip.animationComplete = null;
        tooltip.enableAnimation = false;
        tooltip.shared = false;
        tooltip.offset = 0;
        tooltip.isTextWrap = true;
        tooltip.theme = 'Material';
        tooltip.refresh();
    });
    it('Tooltip with body element rtl direction', () => {
        tooltip.loaded = (args: Object) => {
            svgObject = getElement('tooltipcontainer_svg');
            expect(svgObject).not.toBe(null);
            let textElement: Element = document.getElementById('tooltipcontainer_text');
            expect(textElement.getAttribute('text-anchor')).toBe('end');
        };
        document.body.setAttribute('dir', 'rtl');
        tooltip.refresh();
    });
    it('Checking Tooltip elements render with RTL Position', () => {
        tooltip.loaded = () => {
            let textPosX: string  = (<HTMLElement>(document.getElementById('tooltipcontainer_text').childNodes[1])).getAttribute("x");
            let trackballCenterX: string = document.getElementById('tooltipcontainer_Trackball_0').getAttribute('cx');
            expect(textPosX === '124' || textPosX === '120').toBe(true);
            expect(trackballCenterX === '196' || trackballCenterX === '190').toBe(true);
        };
       tooltip.header = "RTL For Marker & Text Content";
       tooltip.content = ['TooltipText'];
       tooltip.shapes = ['Circle'];
       tooltip.enableRTL = true;   
       tooltip.refresh();
    });
    it('Checking RTL with arabic text', () => {
        tooltip.loaded = () => {
            let textPosX: string  = (<HTMLElement>(document.getElementById('tooltipcontainer_text').childNodes[5])).getAttribute("x");
            expect((<HTMLElement>(document.getElementById('tooltipcontainer_text').childNodes[1])).getAttribute("x")).toBe("39");
            expect(textPosX === '33' || textPosX === '30').toBe(true);
        };
       tooltip.header = "RTL For Arabic";
       tooltip.content = ['يناير : <b>3M</b>','فبراير : <b>3M</b>'];
       tooltip.refresh();
    });
});