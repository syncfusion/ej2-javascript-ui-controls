import {
    Diagram, ConnectorModel, Node, DataBinding, HierarchicalTree, TreeInfo, SnapConstraints,ChildArrangement,ConnectionPointOrigin, NodeModel,StackPanel,TextElement,ImageElement,ComplexHierarchicalTree,LineDistribution
} from '../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree,ComplexHierarchicalTree,LineDistribution);

import { DataManager, Query } from '@syncfusion/ej2-data';

// export interface EmployeeInfo {
//     Name: string;
//     Role: string;
//   }
  ////////////// test cases
export interface Activity {
    Code: string;
    Description: string;
    NodeType: string;
    Speed: string;
    Allocation: number;
}

  var getNodeTemplate = function (obj: NodeModel) {
            // Main Panel
            const nodePanel: StackPanel = new StackPanel();
            nodePanel.id = obj.id + "_nodePanel";
            nodePanel.orientation = "Horizontal";
            nodePanel.style.strokeColor = "none";
            nodePanel.height = 96;
            nodePanel.width = 196;
            nodePanel.style.fill = "White";

            // Content Panel
            const contentPanel: StackPanel = new StackPanel();
            contentPanel.id = obj.id + "_contentPanel";
            contentPanel.orientation = "Vertical";
            contentPanel.style.fill = "none";
            contentPanel.style.strokeColor = "none";
            contentPanel.width = 148;
            contentPanel.height = 96;

            // Sets panel for the alert, which indicates bottlenecks (i.e. green, yellow, red)
            const statusPanel: StackPanel = new StackPanel();
            statusPanel.orientation = "Horizontal";
            statusPanel.style.strokeColor = "none";
            statusPanel.id = obj.id + "_alert";
            statusPanel.width = 48;
            statusPanel.height = 96;

            // Header Panel
            const headerPanel: StackPanel = new StackPanel();
            headerPanel.id = obj.id + "_headerPanel";
            headerPanel.orientation = "Vertical";
            headerPanel.style.fill = "none";
            headerPanel.style.strokeColor = "none";
            headerPanel.height = 40;
            headerPanel.width = 148;
            headerPanel.verticalAlignment = "Top";
            headerPanel.horizontalAlignment = "Left";

            // Sets panel for the header first line (code)
            const code: TextElement = new TextElement();
            code.margin = { left: 8, right: 0, top: 8, bottom: 0 };
            code.content = (obj.data as Activity).Code;
            code.style.fontFamily = '"Fira Sans", sans-serif';
            code.style.fontSize = 10;
            code.style.color = "rgba(0,0,0,0.60)";
            code.style.textWrapping = "Wrap";
            code.style.textAlign = "Left";
            code.style.strokeColor = "none";
            code.horizontalAlignment = "Left";
            code.verticalAlignment = "Top";
            code.style.fill = "none";
            code.id = obj.id + "_code";

            // Sets panel for the header second line (description)
            const description: TextElement = new TextElement();
            description.margin = { left: 8, right: 0, top: 0, bottom: 0 };
            description.content = (obj.data as Activity).Description;
            description.style.fontFamily = '"Fira Sans", sans-serif';
            description.style.color = "rgba(0,0,0,0.60)";
            description.style.fontSize = 10;
            description.style.textAlign = "Left";
            description.style.textWrapping = "Wrap";
            description.style.strokeColor = "none";
            description.horizontalAlignment = "Left";
            description.verticalAlignment = "Bottom";
            description.style.strokeColor = "none";
            description.style.textWrapping = "Wrap";
            description.style.fill = "none";
            description.id = obj.id + "_description";

            // Sets fake panel to help spliting speed and capacity into different lines
            const detailPanel: StackPanel = new StackPanel();
            detailPanel.style.fill = "none";
            detailPanel.style.strokeColor = "none";
            detailPanel.orientation = "Vertical";
            detailPanel.id = obj.id + "_detailPanel";
            detailPanel.horizontalAlignment = "Left";
            detailPanel.width = 148;
            detailPanel.height = 56;

            // Sets panel for the details first line (speed)
            const speed: TextElement = new TextElement();
            speed.margin = { left: 8, right: 0, top: 18, bottom: 0 };
            speed.content = "Speed: " + (obj.data as Activity).Speed;
            speed.style.fontFamily = '"Fira Sans", sans-serif';
            speed.style.color = "rgba(0,0,0,0.87)";
            speed.style.fontSize = 12;
            speed.style.strokeColor = "none";
            speed.horizontalAlignment = "Left";
            speed.style.textWrapping = "Wrap";
            speed.style.fill = "none";
            speed.id = obj.id + "_speed";

            const icon: ImageElement = new ImageElement();
            icon.id = obj.id + "_icon";
            icon.style.strokeColor = "None";
            icon.margin = { left: 12, right: 0, top: 39, bottom: 0 };
            icon.style.fill = "none";
            icon.width = 24;
            icon.height = 24;

            // Sets panel for the details second line (allocation)
            const allocation: TextElement = new TextElement();
            allocation.margin = { left: 8, right: 0, top: 3, bottom: 0 };
            allocation.style.fontFamily = '"Fira Sans", sans-serif';
            allocation.style.color = "rgba(0,0,0,0.87)";
            allocation.style.fontSize = 12;
            // When allocation percent is zero, then it is showed as Non-Aplicable
            if ((obj.data as Activity).Allocation === 0) {
                allocation.content = "Allocation: N/A";
            } else {
                allocation.content =
                    "Allocation: " + (obj.data as Activity).Allocation + "%";
            }
            allocation.style.strokeColor = "none";
            allocation.horizontalAlignment = "Left";
            allocation.style.textWrapping = "Wrap";
            allocation.style.fill = "none";
            allocation.id = obj.id + "_allocation";

            // When the node is a line, no alerts will be visible and font will be slightly different
            if ((obj.data as Activity).NodeType === "Line") {
                // Composes the whole header panel
                nodePanel.style.fill = "#252E4E";
                contentPanel.style.fill = "#252E4E";
                statusPanel.style.fill = "#4A5C9B";
                description.style.color = "rgba(255,255,255,0.60)";
                code.style.color = "rgba(255,255,255,0.60)";
                speed.style.color = "rgba(255,255,255, 1)";
                allocation.style.color = "rgba(255,255,255, 1)";
                icon.source =
                    'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="UTF-8"%3F%3E%3Csvg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3Espeedometer%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id="Projection-Analytics" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"%3E%3Cg id="speedometer" fill="%2300EACE" fill-rule="nonzero"%3E%3Cpath d="M10.35,13.4841078 C8.63515585,13.4841078 7.245,12.0909446 7.245,10.3723906 C7.245,9.21068287 7.87635,8.19418859 8.7975,7.66519667 L18.84735,1.83591314 L13.1238,11.7726634 C12.6063,12.7891576 11.56095,13.4841078 10.35,13.4841078 M10.35,0 C12.22335,0 13.9725,0.518619531 15.49395,1.36915556 L13.32045,2.62421483 C12.42,2.27155355 11.385,2.07447812 10.35,2.07447812 C5.77708227,2.07447812 2.07,5.78958009 2.07,10.3723906 C2.07,12.6646889 2.99115,14.7391671 4.4919,16.2327913 L4.50225,16.2327913 C4.9059,16.6373146 4.9059,17.2907752 4.50225,17.6952984 C4.0986,18.0998216 3.4362,18.0998216 3.03255,17.7056708 L3.03255,17.7056708 C1.1592,15.8282681 0,13.2351704 0,10.3723906 C0,4.64387746 4.63385284,0 10.35,0 M20.7,10.3723906 C20.7,13.2351704 19.5408,15.8282681 17.66745,17.7056708 L17.66745,17.7056708 C17.2638,18.0998216 16.61175,18.0998216 16.2081,17.6952984 C15.80445,17.2907752 15.80445,16.6373146 16.2081,16.2327913 L16.2081,16.2327913 C17.70885,14.7287947 18.63,12.6646889 18.63,10.3723906 C18.63,9.33515156 18.43335,8.2979125 18.0711,7.36439734 L19.32345,5.18619531 C20.1825,6.7420539 20.7,8.48461553 20.7,10.3723906 Z" id="Shape"%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E';
            } else {
                // When the node is an activity
                // Alert will show the respective color based on bottlenecks
                if ((obj.data as Activity).Allocation < 80) {
                    // Green
                    statusPanel.style.fill = "#C8F0AA";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='worker' fill='%237FBC52' fill-rule='nonzero'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
                            break;
                        case "Equipment":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%237ABD12' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                    }
                } else if ((obj.data as Activity).Allocation > 95) {
                    // Red
                    statusPanel.style.fill = "#F2B7BF";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape' fill='%23B02032' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                        case "Equipment":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%23B02032' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                    }
                } else if (
                    (obj.data as Activity).Allocation >= 80 &&
                    (obj.data as Activity).Allocation < 90
                ) {
                    // Yellow
                    statusPanel.style.fill = "#FCE0A6";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape' fill='%23CD9A32' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                        case "Equipment":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%23CD9A32' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                    }
                } else if (
                    (obj.data as Activity).Allocation >= 90 &&
                    (obj.data as Activity).Allocation < 95
                ) {
                    // Orange
                    statusPanel.style.fill = "#FEB59C";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="UTF-8"%3F%3E%3Csvg width="21px" height="24px" viewBox="0 0 21 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id="Projection-Analytics" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"%3E%3Cpath d="M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z" id="Shape" fill="%23D04D20" fill-rule="nonzero"%3E%3C/path%3E%3C/g%3E%3C/svg%3E';
                            break;
                        case "Equipment":
                            icon.source =
                                'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="UTF-8"%3F%3E%3Csvg width="23px" height="24px" viewBox="0 0 23 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id="Projection-Analytics" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"%3E%3Cpath d="M18.7734695,3.42857143 L16.0191838,6.18285714 L16.0191838,6.38857143 L18.7734695,9.14285714 L22.8763266,9.14285714 L22.8763266,11.4285714 L17.8363266,11.4285714 L16.0191838,9.61142857 L16.0191838,12.5714286 L14.8763266,12.5714286 C13.6139615,12.5714286 12.5906123,11.5480794 12.5906123,10.2857143 L12.5906123,7.42857143 L9.0020409,7.42857143 C8.89918376,7.85142857 8.72775519,8.25142857 8.49918376,8.62857143 L15.0820409,20.5714286 L20.5906123,20.5714286 C21.8529775,20.5714286 22.8763266,21.5947777 22.8763266,22.8571429 L22.8763266,24 L0.0191837615,24 L0.0191837615,22.8571429 C0.0191837615,21.5947777 1.0425329,20.5714286 2.30489805,20.5714286 L9.85918376,20.5714286 L4.49918376,10.8571429 C2.4420409,10.8228571 0.659183762,9.41714286 0.144898047,7.42857143 C-0.483673381,4.98285714 0.990612333,2.49142857 3.44775519,1.86285714 C5.8820409,1.23428571 8.37346948,2.69714286 9.0020409,5.14285714 L12.5906123,5.14285714 L12.5906123,2.28571429 C12.5906123,1.02334914 13.6139615,0 14.8763266,0 L16.0191838,0 L16.0191838,2.96 L17.8363266,1.14285714 L22.8763266,1.14285714 L22.8763266,3.42857143 L18.7734695,3.42857143 M4.59061233,4 C3.32824719,4 2.30489805,5.02334914 2.30489805,6.28571429 C2.30489805,7.54807943 3.32824719,8.57142857 4.59061233,8.57142857 C5.85297748,8.57142857 6.87632662,7.54807943 6.87632662,6.28571429 C6.87632662,5.02334914 5.85297748,4 4.59061233,4 Z" id="Shape" fill="%23D04D20" fill-rule="nonzero"%3E%3C/path%3E%3C/g%3E%3C/svg%3E';
                            break;
                    }
                }
            }

            // Sets the respective icon for line nodes, without showing the allocation as it doesn't make sense
            if ((obj.data as Activity).NodeType === "Line") {
                speed.style.fontSize = 13;
                detailPanel.children = [speed];
            } else if ((obj.data as Activity).NodeType === "Manpower") {
                // Sets the respective icon for manpower nodes
                detailPanel.children = [speed, allocation];
            } else if ((obj.data as Activity).NodeType === "Equipment") {
                // Sets the respective icon for equipment nodes
                detailPanel.children = [speed, allocation];
            }
            headerPanel.children = [code, description];
            statusPanel.children = [icon];
            contentPanel.children = [headerPanel, detailPanel];
            nodePanel.children = [contentPanel, statusPanel];
            return nodePanel;
        };
        let tasks: object[] = [
            {
                irn: "8e4ce960-cf6a-4fef-ba7c-385cb0e9677f",
                taskNo: "2",
                taskName: "Cuts",
                nodeType: 0,
                speed: 8430.5,
                utilization: 0.0,
                parentList: [],
                nodeTypeLabel: "Line"
            },
            {
                irn: "e6643d41-d5ad-47df-9c0a-d981e457f59e",
                taskNo: "1",
                taskName: "Whole Birds",
                nodeType: 0,
                speed: 20150.5,
                utilization: 0.0,
                parentList: [],
                nodeTypeLabel: "Line"
            },
            {
                irn: "c78a9a91-97fe-463d-9b59-06aab164031c",
                taskNo: "11083",
                taskName: "Gibblet Grading",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.166623,
                parentList: ["54e12ad2-400b-46e7-a019-9768a3555176"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "7b67b28e-1c4c-4e8c-b2cc-07d0d1f4d9ce",
                taskNo: "404",
                taskName: "Crating S/On Single Portion",
                nodeType: 1,
                speed: 5537.490051,
                utilization: 0.169483,
                parentList: ["136cf265-f68e-4be2-9b7f-9dbb10618cd6"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "622bdc5f-26f0-4879-a0e8-0baca1997ad5",
                taskNo: "11252",
                taskName: "FR WB Alyoum Crating",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["491a5dbf-1f22-4a2a-a344-699e2cfd2de8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "1c61b41d-4740-4d0f-b6cb-0decbab6d12f",
                taskNo: "10980",
                taskName: "Product Packing S/Less",
                nodeType: 1,
                speed: 780.951085,
                utilization: 0.058495,
                parentList: ["390ec5c1-0a27-41d5-9793-8c4764c5b632"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b6abff5f-36a1-4d0d-a753-0e7afe8f4883",
                taskNo: "401",
                taskName: "Product Packing and weighing",
                nodeType: 1,
                speed: 100.0,
                utilization: 0.825954,
                parentList: [
                    "ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8",
                    "08032b36-661c-49e0-a5c2-6ce9e4bd2447"
                ],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "80c2bcde-4c29-47ca-aa54-1232745108aa",
                taskNo: "11091",
                taskName: "Crating",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.499871,
                parentList: ["197f3eec-570c-4b8a-b2d1-165801939445"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "7d78088f-a28a-4924-859d-14e443c53573",
                taskNo: "490",
                taskName: "Boxing",
                nodeType: 1,
                speed: 999.0,
                utilization: 0.490958,
                parentList: [
                    "6a9aee3c-74aa-4937-8918-dbe552cfb45c",
                    "2298cca0-fa28-40a7-8ade-d23ae8a5b1eb"
                ],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "197f3eec-570c-4b8a-b2d1-165801939445",
                taskNo: "11089",
                taskName: "QX1100",
                nodeType: 2,
                speed: 0.0,
                utilization: 0.999743,
                parentList: ["8b246bc8-58b3-4a7b-ba05-dc2a7e63e7bf"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fde30b7e-ff93-439e-afe7-1b331461d3b9",
                taskNo: "11247",
                taskName: "Manual Packing WB Alyoum 750g",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["06f699bf-8363-4244-91a8-6ae1b47e9b92"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "8ee5a9fb-1e2c-4bf0-b937-1d4bf7c08cb0",
                taskNo: "515",
                taskName: "MOBA  1 - 15",
                nodeType: 2,
                speed: 600.0,
                utilization: 0.511791,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "3884a007-362f-4a4e-b314-204dac85916e",
                taskNo: "10904",
                taskName: "Product Loading  AA SP",
                nodeType: 1,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b7195cd8-eb3d-400b-bd84-21d77b02e391",
                taskNo: "466",
                taskName: "Cuts - Breast Fillet Deboning L",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.499784,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "81da0030-1cea-46d8-9b04-28b97b4b2394",
                taskNo: "482",
                taskName: "Crating WIP for VA",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.269034,
                parentList: ["4b2602f0-8637-4c27-8f4b-8c8e9ac9e75d"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "5b695c07-fb80-44dc-b405-28d97f9fa986",
                taskNo: "353",
                taskName: "Whole Birds - Single A",
                nodeType: 1,
                speed: 22500.0,
                utilization: 0.209833,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "ccdeca52-a784-4424-a06f-2a8c834a5750",
                taskNo: "11159",
                taskName: "Manual Vaccum Sealer",
                nodeType: 2,
                speed: 924.082492,
                utilization: 0.998602,
                parentList: [
                    "c12066ab-7abd-4871-837b-c3d71553be6a",
                    "98522370-88cb-4bde-85ae-543821c94f3b",
                    "2c53ed6a-62ae-4819-aaec-b40826083832"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "532ca0c8-440b-47f8-afef-2c5d6d464e0e",
                taskNo: "10553",
                taskName: "Multi Head - IQF",
                nodeType: 2,
                speed: 9260.813869,
                utilization: 0.052961,
                parentList: [
                    "c263b629-1c5e-4b1b-b692-792ace72a387",
                    "5f8ee78d-c0c6-4a5c-8aab-bea90d85960d"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "7691ddd7-a2c4-4b98-b301-30ab8385749a",
                taskNo: "10965",
                taskName: "Manual Grading - Thigh",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.076969,
                parentList: ["8e95534d-7408-4310-9a01-a33d5c474408"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "a2cd6151-92a9-49f5-9c91-32bbb6d2d042",
                taskNo: "460",
                taskName: "Product Packing",
                nodeType: 1,
                speed: 407.680654,
                utilization: 0.638183,
                parentList: ["ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "bffd3c93-de71-4c0c-89c0-35db8b42bdd2",
                taskNo: "363",
                taskName: "CSB Palletizing Area 15A",
                nodeType: 2,
                speed: 2700.0,
                utilization: 0.40427,
                parentList: ["04da64dc-aa5b-42b2-8757-9d3ae9f3e6a6"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "3f1af140-7240-4c7f-8040-42fa28234947",
                taskNo: "348",
                taskName: "M5000",
                nodeType: 2,
                speed: 22500.0,
                utilization: 0.298525,
                parentList: [
                    "966bcb93-9d2e-4483-9337-5c63f60a30f2",
                    "5b695c07-fb80-44dc-b405-28d97f9fa986",
                    "03b0d211-463f-4ed5-9207-b8b8058d9699",
                    "0ad3ec9e-ff6c-410b-8416-471b6852f240"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "72fe8923-8fda-462c-b6dc-43f69e243924",
                taskNo: "10906",
                taskName: "Product Arranging Padding AA SP",
                nodeType: 1,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["3884a007-362f-4a4e-b314-204dac85916e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "1ad3f175-b396-4e97-9d21-4611d722ad85",
                taskNo: "392",
                taskName: "Crating VA",
                nodeType: 1,
                speed: 22500.000004,
                utilization: 0.00737,
                parentList: ["b4e9a25b-133f-4798-ba2f-933067ea57d9"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "0ad3ec9e-ff6c-410b-8416-471b6852f240",
                taskNo: "346",
                taskName: "Double A Tray Pack",
                nodeType: 1,
                speed: 22500.0,
                utilization: 0.0,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "49c54dd2-aef1-4723-94ce-47961e117606",
                taskNo: "10590",
                taskName: "Drop Off - IQF",
                nodeType: 2,
                speed: 15000.000003,
                utilization: 0.02761,
                parentList: ["7cc43ee2-d2c2-4015-8b9a-840c3e0e7e3d"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fa2981c2-3009-4e35-9bb8-4ca7306bf486",
                taskNo: "470",
                taskName: "Product Packing - Breast/Thigh Fillet",
                nodeType: 1,
                speed: 606.2894,
                utilization: 0.309125,
                parentList: ["ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "2e5c5191-24ee-4758-9948-51083c6e5f52",
                taskNo: "11234",
                taskName: "Nandos WB Manual Dipping & Packing",
                nodeType: 1,
                speed: 960.0,
                utilization: 0.062239,
                parentList: ["17e11ab3-1c66-4167-bb0b-f731d9984451"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "02b54228-279d-4ed3-a8d6-52474508f569",
                taskNo: "10603",
                taskName: "CARTON FREEZER",
                nodeType: 2,
                speed: 107.956904,
                utilization: 0.534097,
                parentList: [
                    "e3b8b9d2-c03b-4961-b6e0-850ef8276821",
                    "ccdeca52-a784-4424-a06f-2a8c834a5750"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "98522370-88cb-4bde-85ae-543821c94f3b",
                taskNo: "11227",
                taskName: "Manual packing-Liver Nandos",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["4debbec0-0921-4c00-80c5-c2255db8c7b3"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "0e0d1b0c-7710-4c3a-bd5b-546434f29859",
                taskNo: "377",
                taskName: "Shrink Pack Machine AA",
                nodeType: 2,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["72fe8923-8fda-462c-b6dc-43f69e243924"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "751698c1-8de2-439b-86d5-598a10fd8d18",
                taskNo: "10538",
                taskName: "CSB Product Registration Area 01",
                nodeType: 2,
                speed: 22500.0,
                utilization: 0.053998,
                parentList: ["3e34d192-b752-4903-854f-c5cc6ac6ffd5"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "601a3cde-fbcc-4e73-9be5-5c61112f1511",
                taskNo: "10566",
                taskName: "Sealing - QX1100 Thigh/Breast Fillet",
                nodeType: 2,
                speed: 4275.076454,
                utilization: 0.468747,
                parentList: [
                    "a2cd6151-92a9-49f5-9c91-32bbb6d2d042",
                    "fa2981c2-3009-4e35-9bb8-4ca7306bf486"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "966bcb93-9d2e-4483-9337-5c63f60a30f2",
                taskNo: "373",
                taskName: "Whole Birds - Double A Shrink",
                nodeType: 1,
                speed: 22500.0,
                utilization: 0.495927,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "5bc92984-ded0-4958-89d9-5ee809c9cb65",
                taskNo: "11069",
                taskName: "Product Weighing",
                nodeType: 1,
                speed: 1568.761031,
                utilization: 0.065976,
                parentList: ["bb0ffd3f-33e4-4040-97a4-ae3835cb42fa"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b99ca1d9-da04-413c-946f-600b73bf4b8d",
                taskNo: "10968",
                taskName: "Product Packing S/On",
                nodeType: 1,
                speed: 567.126443,
                utilization: 0.330755,
                parentList: ["08032b36-661c-49e0-a5c2-6ce9e4bd2447"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "0e83c96a-d77f-4c6a-bfdd-60217eeee868",
                taskNo: "11054",
                taskName: "Shrink Wrapping - IQF",
                nodeType: 1,
                speed: 1826.999999,
                utilization: 0.056671,
                parentList: ["c87ea422-8c07-42c4-986f-e9db3207f084"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "5d243c71-ed42-4842-b58a-60f7a82bced0",
                taskNo: "11137",
                taskName: "Product CSB Registr Area 07",
                nodeType: 2,
                speed: 11400.239657,
                utilization: 0.087889,
                parentList: ["a4e9abe1-203a-4f93-8361-ac84ed780176"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "c855d8d4-3848-4f3d-8947-616a9ec8dbc1",
                taskNo: "456",
                taskName: "Cuts - Drumstick Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.362909,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "491a5dbf-1f22-4a2a-a344-699e2cfd2de8",
                taskNo: "11236",
                taskName: "Manual Vacuum Sealing",
                nodeType: 2,
                speed: 240.0,
                utilization: 0.497916,
                parentList: [
                    "fde30b7e-ff93-439e-afe7-1b331461d3b9",
                    "2e5c5191-24ee-4758-9948-51083c6e5f52"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "2b5500e3-c270-4bdf-a862-69c05d9469b0",
                taskNo: "367",
                taskName: "Carton Freezer",
                nodeType: 2,
                speed: 4620.0,
                utilization: 0.051948,
                parentList: [
                    "ac8da9bd-3f1c-4cf4-8cc0-8c70712f608d",
                    "79ec6d37-e516-46bb-ab76-eff3e171d468"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "06f699bf-8363-4244-91a8-6ae1b47e9b92",
                taskNo: "384",
                taskName: "TUMBLER",
                nodeType: 2,
                speed: 1200.0,
                utilization: 0.207291,
                parentList: ["17e11ab3-1c66-4167-bb0b-f731d9984451"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "09cd3402-b762-4d23-9767-6b06781d1b84",
                taskNo: "11242",
                taskName: "Nandos WB FZ Boxing",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["491a5dbf-1f22-4a2a-a344-699e2cfd2de8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "ec44a155-106a-44bd-8b4f-6cd2524be700",
                taskNo: "349",
                taskName: "AUTOMAC 1-3",
                nodeType: 2,
                speed: 1800.0,
                utilization: 0.676643,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "08032b36-661c-49e0-a5c2-6ce9e4bd2447",
                taskNo: "10935",
                taskName: "Multi Head - Portions",
                nodeType: 2,
                speed: 6952.552502,
                utilization: 0.269976,
                parentList: [
                    "fd795140-58db-43b1-9624-a95af3d82248",
                    "75bfea49-ab2e-4a52-90d7-816b4eec3927",
                    "cdce8c53-5406-4fa5-aca9-efd47a1019c1",
                    "7691ddd7-a2c4-4b98-b301-30ab8385749a",
                    "3b686776-d0f5-4892-9ea1-dbfa9d34ce8b"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fe2f4b70-20dd-4205-a06c-782dbae3048d",
                taskNo: "10943",
                taskName: "CSB",
                nodeType: 2,
                speed: 15000.000001,
                utilization: 0.027531,
                parentList: ["7b67b28e-1c4c-4e8c-b2cc-07d0d1f4d9ce"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "c263b629-1c5e-4b1b-b692-792ace72a387",
                taskNo: "10930",
                taskName: "Wings Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.060151,
                parentList: ["8eef9692-c954-4641-abbf-eac871b79c76"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "2fb67cf5-c301-48d0-968a-797352f4854a",
                taskNo: "442",
                taskName: "Cuts - Whole Legs Line Selection",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.057612,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "60f58f04-7434-4a97-871b-7b1dba222ab9",
                taskNo: "436",
                taskName: "Manual grading - Drumstick",
                nodeType: 1,
                speed: 15000.000002,
                utilization: 0.0055,
                parentList: ["00064d72-52fa-4342-8bac-b0fb2f8b0eea"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "75bfea49-ab2e-4a52-90d7-816b4eec3927",
                taskNo: "444",
                taskName: "Manual grading - Whole Leg",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.028806,
                parentList: ["fce92890-c23b-445e-bb8e-c979f6c2f8bc"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "c304d260-1f80-493c-8d30-8331e6927058",
                taskNo: "11027",
                taskName: "Rapid Machine",
                nodeType: 2,
                speed: 7020.0,
                utilization: 0.266978,
                parentList: ["c14b50f9-e166-43f9-8d8f-cd58d0c45a39"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "7cc43ee2-d2c2-4015-8b9a-840c3e0e7e3d",
                taskNo: "485",
                taskName: "Cuts - IQF Line",
                nodeType: 1,
                speed: 15000.000003,
                utilization: 0.02761,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "e3b8b9d2-c03b-4961-b6e0-850ef8276821",
                taskNo: "11222",
                taskName: "Nandos liver boxing",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["ccdeca52-a784-4424-a06f-2a8c834a5750"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "310156cd-5925-46d8-b581-87d24c368ed9",
                taskNo: "10559",
                taskName: "CSB Product Registration Area 12",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.004568,
                parentList: ["1477367a-81b1-4c8d-bb37-eba391ac9941"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "390ec5c1-0a27-41d5-9793-8c4764c5b632",
                taskNo: "10580",
                taskName: "Product Weighing S/Less",
                nodeType: 1,
                speed: 7028.559773,
                utilization: 0.058495,
                parentList: [
                    "7691ddd7-a2c4-4b98-b301-30ab8385749a",
                    "60f58f04-7434-4a97-871b-7b1dba222ab9"
                ],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "ac8da9bd-3f1c-4cf4-8cc0-8c70712f608d",
                taskNo: "366",
                taskName: "Boxing Single A",
                nodeType: 1,
                speed: 600.0,
                utilization: 0.026666,
                parentList: ["8ee5a9fb-1e2c-4bf0-b937-1d4bf7c08cb0"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "4b2602f0-8637-4c27-8f4b-8c8e9ac9e75d",
                taskNo: "10597",
                taskName: "VA Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.134517,
                parentList: ["ca075b32-38cf-4d40-99d1-f8ad478f81dc"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "f6231156-a0ba-44da-b534-8f46333c3a27",
                taskNo: "11078",
                taskName: "Product CS Registration - 4800",
                nodeType: 1,
                speed: 4800.0,
                utilization: 0.097046,
                parentList: ["f1cf478b-d31f-463b-9733-b1bbd600b8b0"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "9871b81b-d862-4d09-bed2-928882e076ac",
                taskNo: "10543",
                taskName: "CSB Product Registration Area 12",
                nodeType: 2,
                speed: 4800.0,
                utilization: 0.004149,
                parentList: ["6ec732de-882d-45d3-9cb5-fa392c65c5fd"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "b4e9a25b-133f-4798-ba2f-933067ea57d9",
                taskNo: "389",
                taskName: "CFS",
                nodeType: 2,
                speed: 1800.0,
                utilization: 0.092129,
                parentList: ["7029bdd6-2071-42de-9faf-a28a88f4d5f3"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "54e12ad2-400b-46e7-a019-9768a3555176",
                taskNo: "11081",
                taskName: "Giblets Line",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "cdf81ed4-7d4a-4c8f-929a-9ba2dd0c5981",
                taskNo: "10572",
                taskName: "Thigh De-boner 1-4",
                nodeType: 2,
                speed: 14671.854782,
                utilization: 0.177329,
                parentList: ["4858eb7a-b048-4f43-ac57-f38760ac7c5c"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "04da64dc-aa5b-42b2-8757-9d3ae9f3e6a6",
                taskNo: "361",
                taskName: "Crating Single A",
                nodeType: 1,
                speed: 600.0,
                utilization: 0.485124,
                parentList: ["8ee5a9fb-1e2c-4bf0-b937-1d4bf7c08cb0"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "136cf265-f68e-4be2-9b7f-9dbb10618cd6",
                taskNo: "10939",
                taskName: "QX1100 - Single Portion",
                nodeType: 2,
                speed: 6434.082184,
                utilization: 0.38891,
                parentList: [
                    "b99ca1d9-da04-413c-946f-600b73bf4b8d",
                    "b6abff5f-36a1-4d0d-a753-0e7afe8f4883"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "1f9180d5-07bf-4e40-a1c4-9e4e7b115873",
                taskNo: "10564",
                taskName: "CSB Product Registration Area 01",
                nodeType: 2,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["fe95db65-1b3a-4e66-a1ff-b147683fb56c"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "997c8e2f-f8da-4f6b-b07b-a26bb06d590e",
                taskNo: "10598",
                taskName: "CFS S/Less Single Portion",
                nodeType: 2,
                speed: 7028.559773,
                utilization: 0.019498,
                parentList: ["1c61b41d-4740-4d0f-b6cb-0decbab6d12f"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "7029bdd6-2071-42de-9faf-a28a88f4d5f3",
                taskNo: "388",
                taskName: "Product Packing",
                nodeType: 1,
                speed: 1800.0,
                utilization: 0.030709,
                parentList: ["06f699bf-8363-4244-91a8-6ae1b47e9b92"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "9092f044-24b3-4dc4-9f03-a32d9f55c0c4",
                taskNo: "10602",
                taskName: "CSB Palletizing Area 15 - Frozen",
                nodeType: 2,
                speed: 107.956904,
                utilization: 0.534097,
                parentList: ["02b54228-279d-4ed3-a8d6-52474508f569"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "8e95534d-7408-4310-9a01-a33d5c474408",
                taskNo: "10958",
                taskName: "Thighs Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.076969,
                parentList: ["ca075b32-38cf-4d40-99d1-f8ad478f81dc"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "43cd2d28-8be9-4309-b30f-a45f7262295d",
                taskNo: "11093",
                taskName: "Product CSB Registration",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.499871,
                parentList: ["80c2bcde-4c29-47ca-aa54-1232745108aa"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "fd795140-58db-43b1-9624-a95af3d82248",
                taskNo: "11016",
                taskName: "Drumstick Manual Grading - 1800",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.181454,
                parentList: ["00064d72-52fa-4342-8bac-b0fb2f8b0eea"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "a4e9abe1-203a-4f93-8361-ac84ed780176",
                taskNo: "472",
                taskName: "Crating - Area 07",
                nodeType: 1,
                speed: 4275.076454,
                utilization: 0.234373,
                parentList: ["601a3cde-fbcc-4e73-9be5-5c61112f1511"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "391324f2-7c7f-4050-9b24-ad0f0f01d568",
                taskNo: "394",
                taskName: "Product CSB Registration Area 12",
                nodeType: 1,
                speed: 1600.0,
                utilization: 0.103645,
                parentList: ["1ad3f175-b396-4e97-9d21-4611d722ad85"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "bb0ffd3f-33e4-4040-97a4-ae3835cb42fa",
                taskNo: "10600",
                taskName: "Tumbler - VA - Tumbler - VA",
                nodeType: 2,
                speed: 1964.480548,
                utilization: 0.234869,
                parentList: ["4debbec0-0921-4c00-80c5-c2255db8c7b3"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "00064d72-52fa-4342-8bac-b0fb2f8b0eea",
                taskNo: "10962",
                taskName: "Drumstick Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.373911,
                parentList: [
                    "c855d8d4-3848-4f3d-8947-616a9ec8dbc1",
                    "ca075b32-38cf-4d40-99d1-f8ad478f81dc"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fe95db65-1b3a-4e66-a1ff-b147683fb56c",
                taskNo: "503",
                taskName: "Crating",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["ccdeca52-a784-4424-a06f-2a8c834a5750"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "f1cf478b-d31f-463b-9733-b1bbd600b8b0",
                taskNo: "11076",
                taskName: "Crating - 1800",
                nodeType: 1,
                speed: 999.0,
                utilization: 0.466288,
                parentList: ["ccdeca52-a784-4424-a06f-2a8c834a5750"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "2c53ed6a-62ae-4819-aaec-b40826083832",
                taskNo: "11192",
                taskName: "Manual Packing",
                nodeType: 1,
                speed: 1976.896548,
                utilization: 0.004861,
                parentList: ["bb0ffd3f-33e4-4040-97a4-ae3835cb42fa"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "e1f652bd-9849-403a-aa8a-b5caee9f2068",
                taskNo: "10911",
                taskName: "Crating AA SP",
                nodeType: 1,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["0e0d1b0c-7710-4c3a-bd5b-546434f29859"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "03b0d211-463f-4ed5-9207-b8b8058d9699",
                taskNo: "381",
                taskName: "Whole Birds - Value Added Area",
                nodeType: 1,
                speed: 22500.000007,
                utilization: 0.027422,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b2020949-aab9-455a-8936-b9bce854fe2d",
                taskNo: "369",
                taskName: "CSB Palletizing Area 15B",
                nodeType: 2,
                speed: 2700.0,
                utilization: 0.022222,
                parentList: [
                    "09cd3402-b762-4d23-9767-6b06781d1b84",
                    "2b5500e3-c270-4bdf-a862-69c05d9469b0"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "5f8ee78d-c0c6-4a5c-8aab-bea90d85960d",
                taskNo: "10592",
                taskName: "Spiral Freezer",
                nodeType: 2,
                speed: 8656.124102,
                utilization: 0.047845,
                parentList: ["49c54dd2-aef1-4723-94ce-47961e117606"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "908d1fd0-e4bf-4328-b5fe-c21edd11d658",
                taskNo: "351",
                taskName: "Prod Label Appl AA Tray Pack",
                nodeType: 1,
                speed: 1800.0,
                utilization: 0.674976,
                parentList: ["ec44a155-106a-44bd-8b4f-6cd2524be700"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "4debbec0-0921-4c00-80c5-c2255db8c7b3",
                taskNo: "11225",
                taskName: "VA raw materials",
                nodeType: 1,
                speed: 1635.226591,
                utilization: 0.569733,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "c12066ab-7abd-4871-837b-c3d71553be6a",
                taskNo: "11071",
                taskName: "Product Packing 1800",
                nodeType: 1,
                speed: 1568.761031,
                utilization: 0.065976,
                parentList: ["5bc92984-ded0-4958-89d9-5ee809c9cb65"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "3e34d192-b752-4903-854f-c5cc6ac6ffd5",
                taskNo: "352",
                taskName: "Crating Tray Pack",
                nodeType: 1,
                speed: 1800.0,
                utilization: 0.674976,
                parentList: ["908d1fd0-e4bf-4328-b5fe-c21edd11d658"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "e0861de7-17e2-4bba-a89b-c6fb9918524f",
                taskNo: "467",
                taskName: "Thigh De-Skinning",
                nodeType: 1,
                speed: 14671.854782,
                utilization: 0.177329,
                parentList: ["f696f178-97c0-4779-a0c8-e7fd7acb8b24"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "fce92890-c23b-445e-bb8e-c979f6c2f8bc",
                taskNo: "10575",
                taskName: "Whole Leg Drop S/On",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.019204,
                parentList: ["2fb67cf5-c301-48d0-968a-797352f4854a"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "c14b50f9-e166-43f9-8d8f-cd58d0c45a39",
                taskNo: "10574",
                taskName: "Breast Skinner",
                nodeType: 2,
                speed: 7020.0,
                utilization: 0.266978,
                parentList: ["b7195cd8-eb3d-400b-bd84-21d77b02e391"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8",
                taskNo: "10557",
                taskName: "Multi Head - Fillet",
                nodeType: 2,
                speed: 7020.0,
                utilization: 0.28553,
                parentList: [
                    "c304d260-1f80-493c-8d30-8331e6927058",
                    "cdf81ed4-7d4a-4c8f-929a-9ba2dd0c5981"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "2298cca0-fa28-40a7-8ade-d23ae8a5b1eb",
                taskNo: "11191",
                taskName: "Manual Vacuum Sealing",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["b6abff5f-36a1-4d0d-a753-0e7afe8f4883"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "6a9aee3c-74aa-4937-8918-dbe552cfb45c",
                taskNo: "10591",
                taskName: "Form Fill Machine - IQF",
                nodeType: 2,
                speed: 9260.813929,
                utilization: 0.052961,
                parentList: ["532ca0c8-440b-47f8-afef-2c5d6d464e0e"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "3b686776-d0f5-4892-9ea1-dbfa9d34ce8b",
                taskNo: "398",
                taskName: "Manual Product grading - Wings",
                nodeType: 1,
                speed: 15000.000001,
                utilization: 0.027531,
                parentList: ["c263b629-1c5e-4b1b-b692-792ace72a387"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "8b246bc8-58b3-4a7b-ba05-dc2a7e63e7bf",
                taskNo: "11087",
                taskName: "Multi Head - Gibblets",
                nodeType: 2,
                speed: 0.0,
                utilization: 0.999743,
                parentList: ["c78a9a91-97fe-463d-9b59-06aab164031c"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "f696f178-97c0-4779-a0c8-e7fd7acb8b24",
                taskNo: "475",
                taskName: "Cuts - Thigh Deboni Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.173449,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "c87ea422-8c07-42c4-986f-e9db3207f084",
                taskNo: "10558",
                taskName: "CSB Product Registration Area 14",
                nodeType: 2,
                speed: 11383.916461,
                utilization: 0.043084,
                parentList: ["7d78088f-a28a-4924-859d-14e443c53573"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "8eef9692-c954-4641-abbf-eac871b79c76",
                taskNo: "395",
                taskName: "Cuts - Wing Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.030075,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "1477367a-81b1-4c8d-bb37-eba391ac9941",
                taskNo: "454",
                taskName: "Crating Area 12",
                nodeType: 1,
                speed: 7028.566801,
                utilization: 0.009749,
                parentList: ["997c8e2f-f8da-4f6b-b07b-a26bb06d590e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "195cc3e9-ac68-47c0-867a-eeaa52d03db5",
                taskNo: "380",
                taskName: "Product CSB Registration Area 01",
                nodeType: 1,
                speed: 2400.0,
                utilization: 0.464932,
                parentList: ["e1f652bd-9849-403a-aa8a-b5caee9f2068"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "cdce8c53-5406-4fa5-aca9-efd47a1019c1",
                taskNo: "450",
                taskName: "Cuts - Mix Parts Line'",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.02962,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "79ec6d37-e516-46bb-ab76-eff3e171d468",
                taskNo: "371",
                taskName: "Boxing WB Bulk Frozen",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "de6d525d-de56-4f6e-a56a-f0a1333ff844",
                taskNo: "11134",
                taskName: "Product CSB Registration Area 06",
                nodeType: 2,
                speed: 12011.525179,
                utilization: 0.104111,
                parentList: ["7b67b28e-1c4c-4e8c-b2cc-07d0d1f4d9ce"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "4858eb7a-b048-4f43-ac57-f38760ac7c5c",
                taskNo: "11037",
                taskName: "Oysther Thigh Loading - 7020",
                nodeType: 1,
                speed: 7020.0,
                utilization: 0.370619,
                parentList: ["e0861de7-17e2-4bba-a89b-c6fb9918524f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "17e11ab3-1c66-4167-bb0b-f731d9984451",
                taskNo: "385",
                taskName: "Injector VA",
                nodeType: 2,
                speed: 1200.0,
                utilization: 0.257083,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "ca075b32-38cf-4d40-99d1-f8ad478f81dc",
                taskNo: "416",
                taskName: "Cuts - Thigh Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.538068,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "6ec732de-882d-45d3-9cb5-fa392c65c5fd",
                taskNo: "11239",
                taskName: "Nandos WB FR Crating",
                nodeType: 1,
                speed: 600.0,
                utilization: 0.199166,
                parentList: ["491a5dbf-1f22-4a2a-a344-699e2cfd2de8"],
                nodeTypeLabel: "Manpower"
            }
        ];
        const data = tasks.map(t => ({
            Id: (t as any).irn,
            ParentList:
                (t as any).parentList && (t as any).parentList.length > 0 ? (t as any).parentList : undefined,
            Code: (t as any).taskNo,
            Description: (t as any).taskName,
            NodeType: (t as any).nodeTypeLabel,
            Speed: (t as any).speed,
            SpeedLabel: (t as any).speed,
            Utilization: (t as any).utilization * 100,
            UtilizationLabel: (t as any).utilization
        }));
  let diagram: Diagram = new Diagram({
                width: "100%", height: 1000,
                //backgroundColor: 'black',
                setNodeTemplate: function (node: any) {
                    //return getNodeTemplate(node);
                },
                layout: {
                    type: "ComplexHierarchicalTree",
                    //connectionPointOrigin:"DifferentPoint",
                    connectionPointOrigin :ConnectionPointOrigin.DifferentPoint,
                    horizontalSpacing: 32,
                    arrangement:ChildArrangement.NonLinear,
                    verticalSpacing: 32,
                    //orientation: "LeftToRight",
                    margin: { left: 48, right: 48, top: 48, bottom: 48 },
                    enableAnimation: true
                },
                dataSourceSettings: {
                    id: "Id",
                    parentId: "ParentList", dataSource: new DataManager(data),
                    doBinding: (nodeModel: any, data: any, diagram: any) => {
                        //nodeModel.id = data.Code
                        //nodeModel.shape = { type: 'Text', content: (data a).Name };
                    },
                },
                //nodete

                getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                    obj.shape = { type: "Basic", shape: "Rectangle" };

                    obj.expandIcon.height = 10;
                    obj.style.fill = "gray"
                    obj.expandIcon.width = 10;
                    obj.expandIcon.shape = "Minus";
                    obj.expandIcon.fill = "#fff";
                    obj.expandIcon.offset = { x: 0.5, y: 1 };
                    obj.expandIcon.verticalAlignment = "Auto";
                    obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.expandIcon.borderColor = "#ABB8E7";
                    obj.expandIcon.cornerRadius = 1;

                    obj.collapseIcon.height = 10;
                    obj.collapseIcon.width = 10;
                    obj.collapseIcon.shape = "Plus";
                    obj.collapseIcon.fill = "#fff";
                    obj.collapseIcon.offset = { x: 0.5, y: 1 };
                    obj.collapseIcon.verticalAlignment = "Auto";
                    obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.collapseIcon.borderColor = "#ABB8E7";
                    obj.collapseIcon.cornerRadius = 1;

                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = "Orthogonal";
                    connector.cornerRadius = 7;
                    connector.targetDecorator.height = 5;
                    connector.targetDecorator.width = 3;
                    connector.targetDecorator.style.fill = "red";
                    connector.targetDecorator.style.strokeColor = "red";
                    connector.style.strokeColor = "red";
                    return connector;
                },
            });
  

diagram.appendTo('#diagram');
function created(): void {
        diagram.fitToPage({ mode: 'Width' });
    }

document.getElementById('orientation').onchange = () => {
    let value: string = (document.getElementById('orientation') as HTMLSelectElement).value;
    diagram.layout.orientation = value as any;
    diagram.dataBind();
};

document.getElementById('hspacing').onchange = () => {
    let value: string = (document.getElementById('hspacing') as HTMLInputElement).value;
    diagram.layout.horizontalSpacing = Number(value);
    diagram.dataBind();
};

document.getElementById('vspacing').onchange = () => {
    let value: string = (document.getElementById('vspacing') as HTMLInputElement).value;
    diagram.layout.verticalSpacing = Number(value);
    diagram.dataBind();
};

document.getElementById('marginx').onchange = () => {
    let value: string = (document.getElementById('marginx') as HTMLInputElement).value;
    diagram.layout.margin.left = Number(value);
    diagram.dataBind();
};

document.getElementById('marginy').onchange = () => {
    let value: string = (document.getElementById('marginy') as HTMLInputElement).value;
    diagram.layout.margin.top = Number(value);
    diagram.dataBind();
};
document.getElementById('marginx').onchange = () => {
    let value: string = (document.getElementById('marginx') as HTMLInputElement).value;
    diagram.layout.margin.left = Number(value);
    diagram.dataBind();
};

document.getElementById('marginy').onchange = () => {
    let value: string = (document.getElementById('marginy') as HTMLInputElement).value;
    diagram.layout.margin.top = Number(value);
    diagram.dataBind();
};

document.getElementById('halignment').onchange = () => {
    let value: string = (document.getElementById('halignment') as HTMLSelectElement).value;
    diagram.layout.horizontalAlignment = value as any;
    diagram.dataBind();
};

document.getElementById('valignment').onchange = () => {
    let value: string = (document.getElementById('valignment') as HTMLSelectElement).value;
    diagram.layout.verticalAlignment = value as any;
    diagram.dataBind();
};
var log: any = document.getElementById('log');
log.onclick = selectable;
var oldProp, newProp;
function selectable() {
    if (log.checked) {
        diagram.layout.connectionPointOrigin = ConnectionPointOrigin.DifferentPoint;//"DifferentPoint"
    } else {
        diagram.layout.connectionPointOrigin = ConnectionPointOrigin.SamePoint;//"SamePoint"
    }
}
var linear1: any = document.getElementById('linear');
linear1.onclick = linear;
var oldProp, newProp;
function linear() {
    if (linear1.checked) {
        diagram.layout.arrangement = ChildArrangement.Linear
    } else {
        diagram.layout.arrangement = ChildArrangement.NonLinear
    }
}

