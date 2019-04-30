/**
 * Team Organizational Chart
 */

import {
    Diagram, ConnectorModel, Node,DiagramConstraints,
    Container, TextElement, StackPanel, ImageElement, DataBinding, HierarchicalTree, TreeInfo
} from '../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree);

import { DataManager, Query } from '@syncfusion/ej2-data';

let data: object[] = [
    {
        'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 1
    },
    {
        'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 2
    },
    {
        'Id': 4, 'Name': 'Christina kaff', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 3
    },
    {
        'Id': 5, 'Name': 'Hanna Moos', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 4
    },
    {
        'Id': 6, 'Name': 'Peter Citeaux', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 4
    },
    {
        'Id': 7, 'Name': 'Martín Kloss', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 1
    },
    {
        'Id': 9, 'Name': 'Elizabeth Mary', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 8
    },
    {
        'Id': 10, 'Name': 'Victoria Ash', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 8
    },
    {
        'Id': 12, 'Name': 'Francisco Yang', 'Designation': 'CSR',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 7
    },
    {
        'Id': 13, 'Name': 'Yang Wang', 'Designation': 'CSR',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 6
    },
    {
        'Id': 27, 'Name': 'Lino Rodri', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Robin.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 38, 'Name': 'Philip Cramer', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Robin.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 14, 'Name': 'Pedro Afonso', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Paul.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 15, 'Name': 'Elizabeth Roel', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Maria.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 38
    },
    {
        'Id': 17, 'Name': 'Janine Labrune', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 48
    },
    {
        'Id': 18, 'Name': 'Ann Devon', 'Designation': 'CSR',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 31
    },
    {
        'Id': 19, 'Name': 'Roland Mendel', 'Designation': 'CSR',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 31
    },
    {
        'Id': 20, 'Name': 'Aria Cruz', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 14
    },
    {
        'Id': 22, 'Name': 'Martine Rancé', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 21
    },
    {
        'Id': 23, 'Name': 'Maria Larsson', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 20
    },
    {
        'Id': 21, 'Name': 'Diego Roel', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 20
    },
    {
        'Id': 24, 'Name': 'Peter Franken', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 23
    },
    {
        'Id': 25, 'Name': 'Carine Schmitt', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 21
    },
    {
        'Id': 26, 'Name': 'Paolo Accorti', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 21
    },
    {
        'Id': 28, 'Name': 'Eduardo Roel', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 38
    },
    {
        'Id': 29, 'Name': 'José Pedro ', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 28
    },
    {
        'Id': 30, 'Name': 'André Fonseca', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/John.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 29
    },
    {
        'Id': 31, 'Name': 'Howard Snyd', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 14
    },
    {
        'Id': 32, 'Name': 'Manu Pereira', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image56.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 8
    },
    {
        'Id': 33, 'Name': 'Mario Pontes', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 19
    },
    {
        'Id': 34, 'Name': 'Carlos Schmitt', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 19
    },
    {
        'Id': 35, 'Name': 'Yoshi Latimer', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/eric.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 18
    },
    {
        'Id': 36, 'Name': 'Patricia Kenna', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/Maria.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 55
    },
    {
        'Id': 37, 'Name': 'Helen Bennett', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 15
    },
    {
        'Id': 39, 'Name': 'Daniel Tonini', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 27
    },
    {
        'Id': 40, 'Name': 'Annette Roel', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 39
    },
    {
        'Id': 41, 'Name': 'Yoshi Wilson', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 40
    },
    {
        'Id': 42, 'Name': 'John Steel', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Maria.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 41
    },
    {
        'Id': 43, 'Name': 'Renate Jose', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 42
    },
    {
        'Id': 44, 'Name': 'Jaime Yorres', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 42
    },
    {
        'Id': 45, 'Name': 'Carlos Nagy', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 40
    },
    {
        'Id': 46, 'Name': 'Felipe Kloss', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 17
    },
    {
        'Id': 47, 'Name': 'Fran Wilson', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 46
    },
    {
        'Id': 48, 'Name': 'John Rovelli', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 46
    },
    {
        'Id': 49, 'Name': 'Catherine Kaff', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 51
    },
    {
        'Id': 50, 'Name': 'Jean Fresnière', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 49
    },
    {
        'Id': 51, 'Name': 'Alex Feuer', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 50
    },
    {
        'Id': 52, 'Name': 'Simon Roel', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 50
    },
    {
        'Id': 53, 'Name': 'Yvonne Wong', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 50
    },
    {
        'Id': 54, 'Name': 'Rene Phillips', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 7
    },
    {
        'Id': 55, 'Name': 'Yoshi Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 15
    },
    {
        'Id': 56, 'Name': 'Helen Marie', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 55
    },
    {
        'Id': 57, 'Name': 'Joseph Kaff', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 7
    },
    {
        'Id': 58, 'Name': 'Georg Pipps', 'Designation': 'SR',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 5
    },
    {
        'Id': 60, 'Name': 'Nardo Batista', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Maria.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 59
    },
    {
        'Id': 61, 'Name': 'Lúcia Carvalho', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Robin.PNG', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 60
    },
    {
        'Id': 62, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Clayton.PNG', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 74
    },
    {
        'Id': 63, 'Name': 'Sergio roel', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image55.PNG', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 61
    },
    {
        'Id': 64, 'Name': 'Paula Wilson', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/eric.PNG', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 7
    },
    {
        'Id': 65, 'Name': 'Mauri Moroni', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.PNG', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 6
    },
    {
        'Id': 66, 'Name': 'Janete Limeira', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image51.PNG', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 7
    },
    {
        'Id': 67, 'Name': 'Michael Holz', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 59
    },
    {
        'Id': 68, 'Name': 'Alej Camino', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 67
    },
    {
        'Id': 69, 'Name': 'Jonas Bergsen', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.PNG', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 19
    },
    {
        'Id': 70, 'Name': 'Jose Pavarotti', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Maria.PNG', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 56
    },
    {
        'Id': 71, 'Name': 'Miguel Angel', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/eric.PNG', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 16
    },
    {
        'Id': 72, 'Name': 'Jytte Petersen', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/image55.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 59
    },
    {
        'Id': 73, 'Name': 'Kloss Perrier', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 23
    },
    {
        'Id': 74, 'Name': 'Art Nancy', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 75, 'Name': 'Pascal Cartrain', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/John.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 36
    },
    {
        'Id': 76, 'Name': 'Liz Nixon', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 72
    },
    {
        'Id': 77, 'Name': 'Liu Wong', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 75
    },
    {
        'Id': 78, 'Name': 'Karin Josephs', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 76
    },
    {
        'Id': 79, 'Name': 'Ruby Anabela ', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 23
    },
    {
        'Id': 80, 'Name': 'Helvetis Nagy', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 75
    },
    {
        'Id': 81, 'Name': 'Palle Ibsen', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 35
    },
    {
        'Id': 82, 'Name': 'Mary Saveley', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 59
    },
    {
        'Id': 83, 'Name': 'Paul Henriot', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 30
    },
    {
        'Id': 84, 'Name': 'Rita Müller', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Paul.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 83
    },
    {
        'Id': 85, 'Name': 'Pirkko King', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 83
    },
    {
        'Id': 86, 'Name': 'Paula Parente', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/John.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 74
    },
    {
        'Id': 87, 'Name': 'Karl Jablonski', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 23
    },
    {
        'Id': 88, 'Name': 'Matti Kenna', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 23
    },
    {
        'Id': 89, 'Name': 'Zbyszek Yang', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 23
    },
    {
        'Id': 90, 'Name': 'Nancy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image56.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 23
    },
    {
        'Id': 91, 'Name': 'Robert King', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 59
    },
    {
        'Id': 92, 'Name': 'Laura Callahan', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 91
    },
    {
        'Id': 93, 'Name': 'Anne', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 92
    },
    {
        'Id': 94, 'Name': 'Georg Pipps', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 5
    },
    {
        'Id': 95, 'Name': 'Isabel Castro', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 93
    },
    {
        'Id': 96, 'Name': 'Nardo Batista', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 93
    },
    {
        'Id': 97, 'Name': 'Rene Phillips', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 92
    },
    {
        'Id': 98, 'Name': 'Lúcia Carvalho', 'Designation': 'S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 97
    },
    {
        'Id': 99, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Paul.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 56
    },
    {
        'Id': 101, 'Name': 'Simon Roel', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 91
    },
    {
        'Id': 102, 'Name': 'Rita Pfalzheim', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 101
    },
    {
        'Id': 103, 'Name': 'Paula Wilson', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 750
    },
    {
        'Id': 104, 'Name': ' Jose Michael', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/eric.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 102
    },
    {
        'Id': 105, 'Name': 'Mauri Moroni', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 35
    },
    {
        'Id': 106, 'Name': 'Janete Limeira', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 35
    },
    {
        'Id': 107, 'Name': 'Michael Holz', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 35
    },
    {
        'Id': 108, 'Name': 'Alej Camino', 'Designation': 'Project Trainee',
        'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 35
    },
];

let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

let diagram: Diagram = new Diagram({
    width: '800px', height: '500px',
    snapSettings: { constraints: 0 },
    constraints: DiagramConstraints.Default | DiagramConstraints.Virtualization,
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
        image.source = './employee.PNG';
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
document.getElementById('fittopage').onclick = () => {
    diagram.fitToPage({ mode: 'Page', region: 'Content', margin: {}, canZoomIn: false });
};

document.getElementById('fittowidth').onclick = () => {
    diagram.fitToPage({ mode: 'Width', region: 'Content', margin: {}, canZoomIn: false });
};

document.getElementById('fittoheight').onclick = () => {
    diagram.fitToPage({ mode: 'Height', region: 'Content', margin: {}, canZoomIn: false });
};
