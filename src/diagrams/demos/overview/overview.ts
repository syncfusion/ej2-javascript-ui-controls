import { Diagram } from '../../src/diagram/diagram';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { Overview } from '../../src/overview/overview';
import { OverviewModel } from '../../src/overview/overview-model';


/**
 * Overview
 */
let diagram: Diagram;
let overview: Overview;
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeInfo, Node, StackPanel, ImageElement, Container, TextElement, DataBinding, HierarchicalTree } from '../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree);
let data: object[] = [
    {
        'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
        'ImageUrl': '../overview/employees/image30.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image2.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image1.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 1
    },
    {
        'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image3.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 2
    },
    {
        'Id': 4, 'Name': 'Christina kaff', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image4.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 3
    },
    {
        'Id': 5, 'Name': 'Hanna Moos', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image6.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 4
    },
    {
        'Id': 6, 'Name': 'Peter Citeaux', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image5.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 5
    },
    {
        'Id': 7, 'Name': 'Martín Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image18.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 6
    },
    {
        'Id': 8, 'Name': 'Elizabeth Mary', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image7.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 6
    },
    {
        'Id': 9, 'Name': 'Victoria Ash', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image8.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 5
    },
    {
        'Id': 10, 'Name': 'Francisco Yang', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image19.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 3
    },
    {
        'Id': 11, 'Name': 'Yang Wang', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image21.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
    },
    {
        'Id': 12, 'Name': 'Lino Rodri', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image9.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 11
    },
    {
        'Id': 13, 'Name': 'Philip Cramer', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image23.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 24
    },
    {
        'Id': 14, 'Name': 'Pedro Afonso', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image10.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 15
    },
    {
        'Id': 15, 'Name': 'Elizabeth Roel', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image11.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 13
    },
    {
        'Id': 16, 'Name': 'Janine Labrune', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image12.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 12
    },
    {
        'Id': 17, 'Name': 'Ann Devon', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image13.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 25
    },
    {
        'Id': 18, 'Name': 'Roland Mendel', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image24.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 17
    },
    {
        'Id': 19, 'Name': 'Aria Cruz', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image14.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 18
    },
    {
        'Id': 20, 'Name': 'Martine Rancé', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image26.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 18
    },
    {
        'Id': 21, 'Name': 'Maria Larsson', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image15.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 19
    },
    {
        'Id': 22, 'Name': 'Diego Roel', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image17.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 21
    },
    {
        'Id': 23, 'Name': 'Peter Franken', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image27.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 21
    },
    {
        'Id': 24, 'Name': 'Howard Snyder', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image20.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 16
    },
    {
        'Id': 25, 'Name': 'Carine Schmitt', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image22.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
    },
    {
        'Id': 26, 'Name': 'Paolo Accorti', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image28.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 36
    },
    {
        'Id': 27, 'Name': 'Eduardo Roel', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image31.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 26
    },
    {
        'Id': 28, 'Name': 'José Pedro ', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image25.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 27
    },
    {
        'Id': 29, 'Name': 'André Fonseca', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image32.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 28
    },
    {
        'Id': 30, 'Name': 'Howard Snyd', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image33.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 29
    },
    {
        'Id': 31, 'Name': 'Manu Pereira', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image34.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 32, 'Name': 'Mario Pontes', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image29.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 33, 'Name': 'Carlos Schmitt', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image30.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 34, 'Name': 'Yoshi Latimer', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image4.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 35, 'Name': 'Patricia Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image6.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 29
    },
    {
        'Id': 36, 'Name': 'Helen Bennett', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image7.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 25
    },
    {
        'Id': 37, 'Name': 'Daniel Tonini', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image1.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 'parent'
    },
    {
        'Id': 38, 'Name': 'Annette Roel', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image2.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 37
    },
    {
        'Id': 39, 'Name': 'Yoshi Wilson', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image8.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 38
    },
    {
        'Id': 40, 'Name': 'John Steel', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image3.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 38
    },
    {
        'Id': 41, 'Name': 'Renate Jose', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image9.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 40
    },
    {
        'Id': 42, 'Name': 'Jaime Yorres', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image10.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 41
    },
    {
        'Id': 43, 'Name': 'Carlos Nagy', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image5.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 42
    },
    {
        'Id': 44, 'Name': 'Felipe Kloss', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image16.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 43
    },
    {
        'Id': 45, 'Name': 'Fran Wilson', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image18.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 46, 'Name': 'John Rovelli', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image19.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 47, 'Name': 'Catherine Kaff', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image11.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 48, 'Name': 'Jean Fresnière', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image21.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 43
    },
    {
        'Id': 49, 'Name': 'Alex Feuer', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image23.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 50, 'Name': 'Simon Roel', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image24.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 42
    },
    {
        'Id': 51, 'Name': 'Yvonne Wong', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image12.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 52
    },
    {
        'Id': 52, 'Name': 'Rene Phillips', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image25.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 39
    },
    {
        'Id': 53, 'Name': 'Yoshi Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image14.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 52
    },
    {
        'Id': 54, 'Name': 'Helen Marie', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image15.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 52
    },
    {
        'Id': 55, 'Name': 'Joseph Kaff', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image26.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 52
    },
    {
        'Id': 56, 'Name': 'Georg Pipps', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image27.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 57
    },
    {
        'Id': 57, 'Name': 'Nardo Batista', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image17.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 12
    },
    {
        'Id': 58, 'Name': 'Lúcia Carvalho', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image20.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 57
    },
    {
        'Id': 59, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image28.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 57
    },
    {
        'Id': 60, 'Name': 'Sergio roel', 'Designation': 'CSR',
        'ImageUrl': '../overview/employees/image22.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 57
    },
    {
        'Id': 61, 'Name': 'Paula Wilson', 'Designation': 'CSR',
        'ImageUrl': '../overview/employees/image31.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 57
    },
    {
        'Id': 62, 'Name': 'Mauri Moroni', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image25.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 57
    },
    {
        'Id': 63, 'Name': 'Janete Limeira', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image29.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 57
    },
    {
        'Id': 64, 'Name': 'Michael Holz', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image32.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 57
    },
    {
        'Id': 65, 'Name': 'Alej Camino', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image33.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 'parent'
    },
    {
        'Id': 66, 'Name': 'Jonas Bergsen', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image34.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 65
    },
    {
        'Id': 67, 'Name': 'Jose Pavarotti', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image30.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 68
    },
    {
        'Id': 68, 'Name': 'Miguel Angel', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image4.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 66
    },
    {
        'Id': 69, 'Name': 'Jytte Petersen', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image1.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 68
    },
    {
        'Id': 70, 'Name': 'Kloss Perrier', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image2.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 72
    },
    {
        'Id': 71, 'Name': 'Art Nancy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image6.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 27
    },
    {
        'Id': 72, 'Name': 'Pascal Cartrain', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image3.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 65
    },
    {
        'Id': 73, 'Name': 'Liz Nixon', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image7.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 68
    },
    {
        'Id': 74, 'Name': 'Liu Wong', 'Designation': 'Project Manager',
        'ImageUrl': '../overview/employees/image8.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 'parent'
    },
    {
        'Id': 75, 'Name': 'Karin Josephs', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image9.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 74
    },
    {
        'Id': 76, 'Name': 'Ruby Anabela ', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image10.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 75
    },
    {
        'Id': 77, 'Name': 'Helvetis Nagy', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image11.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 82
    },
    {
        'Id': 78, 'Name': 'Palle Ibsen', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image5.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 76
    },
    {
        'Id': 79, 'Name': 'Mary Saveley', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image12.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 82
    },
    {
        'Id': 80, 'Name': 'Paul Henriot', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image16.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 79
    },
    {
        'Id': 81, 'Name': 'Rita Müller', 'Designation': 'SR',
        'ImageUrl': '../overview/employees/image13.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 79
    },
    {
        'Id': 82, 'Name': 'Pirkko King', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image18.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 78
    },
    {
        'Id': 83, 'Name': 'Paula Parente', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image19.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 75
    },
    {
        'Id': 84, 'Name': 'Karl Jablonski', 'Designation': 'S/w Engg',
        'ImageUrl': '../overview/employees/image14.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 83
    },
    {
        'Id': 34, 'Name': 'Matti Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image15.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 84
    },
    {
        'Id': 35, 'Name': 'Zbyszek Yang', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image21.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 84
    },
    {
        'Id': 85, 'Name': 'Nancy', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image17.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 74
    },
    {
        'Id': 86, 'Name': 'Robert King', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image23.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 85
    },
    {
        'Id': 87, 'Name': 'Laura Callahan', 'Designation': 'CSR',
        'ImageUrl': '../overview/employees/image20.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 88
    },
    {
        'Id': 88, 'Name': 'Anne', 'Designation': 'CSR',
        'ImageUrl': '../overview/employees/image24.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 86
    },
    {
        'Id': 89, 'Name': 'Georg Pipps', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../overview/employees/image26.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
    },
    {
        'Id': 30, 'Name': 'Isabel Castro', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image27.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 89
    },
    {
        'Id': 34, 'Name': 'Nardo Batista', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image28.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 88
    },
    {
        'Id': 90, 'Name': 'Rene Phillips', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image22.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 89
    },
    {
        'Id': 91, 'Name': 'Lúcia Carvalho', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image25.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 89
    },
    {
        'Id': 92, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '../overview/employees/image29.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 89
    },
    {
        'Id': 93, 'Name': 'Simon Roel', 'Designation': 'Project Lead',
        'ImageUrl': '../overview/employees/image28.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 98
    },
];

let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

diagram = new Diagram({
    snapSettings: { constraints: 0 },
    layout: {
        type: 'OrganizationalChart', margin: { top: 20 },
        getLayoutInfo: (node: Node, tree: TreeInfo) => {
            if (!tree.hasSubTree) {
                tree.orientation = 'Vertical';
                tree.type = 'Alternate';
            }
        }
    },
    dataSourceSettings: {
        id: 'Id', parentId: 'ReportingPerson', dataManager: items
    },

    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.height = 50;
        obj.backgroundColor = 'lightgrey';
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        return connector;
    },

    setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
        let content: StackPanel = new StackPanel();
        content.id = obj.id + '_outerstack';
        content.style.strokeColor = 'darkgreen';
        content.orientation = 'Horizontal';
        content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
        let image: ImageElement = new ImageElement();
        image.width = 50;
        image.height = 50;
        image.style.strokeColor = 'none';
        image.source = obj.data['ImageUrl'];
        image.id = obj.id + '_pic';
        let innerStack: StackPanel = new StackPanel();
        innerStack.style.strokeColor = 'none';
        innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
        innerStack.id = obj.id + '_innerstack';

        let text: TextElement = new TextElement();
        text.content = obj.data['Name'];

        text.style.color = 'blue';
        text.style.strokeColor = 'none';
        text.style.fill = 'none';
        text.id = obj.id + '_text1';

        let desigText: TextElement = new TextElement();
        desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
        desigText.content = obj.data['Designation'];
        desigText.style.color = 'blue';
        desigText.style.strokeColor = 'none';
        desigText.style.fill = 'none';
        desigText.style.textWrapping = 'Wrap';
        desigText.id = obj.id + '_desig';
        innerStack.children = [text, desigText];

        content.children = [image, innerStack];

        return content;
    }
});

diagram.appendTo('#diagram');

let options: OverviewModel = {};
options.sourceID = 'diagram';
overview = new Overview(options);
overview.appendTo('#overview');


