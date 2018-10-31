/**
 * Team Organizational Chart
 */

import {
    Diagram, ConnectorModel, Node,
    Container, TextElement, StackPanel, ImageElement, DataBinding, RadialTree, TreeInfo,
    DiagramTools
} from '../../src/diagram/index';
Diagram.Inject(DataBinding, RadialTree);

import { DataManager, Query } from '@syncfusion/ej2-data';

let data: object[] = [
    {
        "Id": "parent", "Name": "Maria Anders", "Designation": "Managing Director",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "true", "RatingColor": "#C34444"
    },
    {
        "Id": 1, "Name": "Ana Trujillo", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/Thomas.PNG", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": "parent"
    },
    {
        "Id": 2, "Name": "Lino Rodri", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/Robin.PNG", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": "parent"
    },
    {
        "Id": 3, "Name": "Philip Cramer", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/Robin.PNG", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": "parent"
    },
    {
        "Id": 4, "Name": "Pedro Afonso", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/Paul.png", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": "parent"
    },
    {
        "Id": 5, "Name": "Anto Moreno", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 1
    },
    {
        "Id": 6, "Name": "Elizabeth Roel", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Maria.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 1
    },
    {
        "Id": 7, "Name": "Aria Cruz", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 1
    },
    {
        "Id": 8, "Name": "Eduardo Roel", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "true",
        "RatingColor": "#93B85A", "ReportingPerson": 1
    },
    {
        "Id": 9, "Name": "Howard Snyd", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": 2
    },
    {
        "Id": 10, "Name": "Daniel Tonini", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "true",
        "RatingColor": "#93B85A", "ReportingPerson": 2
    },
    {
        "Id": 11, "Name": "Nardo Batista", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Maria.PNG", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": 89
    },
    {
        "Id": 12, "Name": "Michael Holz", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Thomas.PNG", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": 89
    },
    {
        "Id": 13, "Name": "Kloss Perrier", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 90
    },
    {
        "Id": 14, "Name": "Liz Nixon", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": 3
    },
    {
        "Id": 15, "Name": "Paul Henriot", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "false",
        "RatingColor": "#D46E89", "ReportingPerson": 3
    },
    {
        "Id": 16, "Name": "Paula Parente", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/John.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 90
    },
    {
        "Id": 17, "Name": "Matti Kenna", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 4
    },
    {
        "Id": 18, "Name": "Laura Callahan", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "false",
        "RatingColor": "#D46E89", "ReportingPerson": 4
    },
    {
        "Id": 19, "Name": "Simon Roel", "Designation": "Project Lead",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "true",
        "RatingColor": "#93B85A", "ReportingPerson": 4
    },
    {
        "Id": 20, "Name": "Thomas Hardy", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": 12
    },
    {
        "Id": 21, "Name": "Martín Kloss", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 5
    },
    {
        "Id": 22, "Name": "Maria Larsson", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image51.png", "IsExpand": "false",
        "RatingColor": "#EBB92E", "ReportingPerson": 6
    },
    {
        "Id": 23, "Name": "Diego Roel", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "false",
        "RatingColor": "#D46E89", "ReportingPerson": 7
    },
    {
        "Id": 24, "Name": "José Pedro ", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "true",
        "RatingColor": "#D46E89", "ReportingPerson": 8
    },
    {
        "Id": 25, "Name": "Manu Pereira", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image56.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 8
    },
    {
        "Id": 26, "Name": "Annette Roel", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 25
    },
    {
        "Id": 27, "Name": "Catherine Kaff", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 8
    },
    {
        "Id": 28, "Name": "Lúcia Carvalho", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Robin.PNG", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 12
    },
    {
        "Id": 29, "Name": "Alej Camino", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.PNG", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 13
    },
    {
        "Id": 30, "Name": "Liu Wong", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 14
    },
    {
        "Id": 31, "Name": "Karin Josephs", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 14
    },
    {
        "Id": 32, "Name": "Ruby Anabela ", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 16
    },
    {
        "Id": 33, "Name": "Pirkko King", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 17
    },

    {
        "Id": 34, "Name": "Karl Jablonski", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 18
    },

    {
        "Id": 35, "Name": "Zbyszek Yang", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 19
    },
    {
        "Id": 36, "Name": "Nancy", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image56.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 5
    },
    {
        "Id": 37, "Name": "Anne", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": 6
    },
    {
        "Id": 38, "Name": "Isabel Castro", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 7
    },
    {
        "Id": 39, "Name": "Nardo Batista", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 9
    },
    {
        "Id": 40, "Name": "Rene Phillips", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": 16
    },
    {
        "Id": 41, "Name": "Rita Pfalzheim", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "false",
        "RatingColor": "#D46E89", "ReportingPerson": 9
    },
    {
        "Id": 42, "Name": "Janete Limeira", "Designation": "Senior S/w Engg",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 11
    },
    {
        "Id": 43, "Name": "Christina kaff", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 20
    },
    {
        "Id": 44, "Name": "Peter Franken", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 21
    },
    {
        "Id": 45, "Name": "Carlos Schmitt", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 23
    },
    {
        "Id": 46, "Name": "Yoshi Wilson", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "false",
        "RatingColor": "#EBB92E", "ReportingPerson": 23
    },
    {
        "Id": 47, "Name": "Jean Fresnière", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "false",
        "RatingColor": "#D46E89", "ReportingPerson": 24
    },
    {
        "Id": 48, "Name": "Simon Roel", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 25
    },
    {
        "Id": 49, "Name": "Rene Phillips", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 55
    },
    {
        "Id": 50, "Name": "Paula Wilson", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/eric.PNG", "IsExpand": "None",
        "RatingColor": "#68C2DE", "ReportingPerson": 43
    },
    {
        "Id": 51, "Name": "Jose Pavarotti", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Maria.PNG", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 43
    },
    {
        "Id": 52, "Name": "Palle Ibsen", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/image51.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 29
    },
    {
        "Id": 53, "Name": "Lúcia Carvalho", "Designation": "S/w Engg",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 30
    },
    {
        "Id": 54, "Name": "Hanna Moos", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "true",
        "RatingColor": "#D46E89", "ReportingPerson": 30
    },
    {
        "Id": 55, "Name": "Peter Citeaux", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": 33
    },
    {
        "Id": 56, "Name": "Elizabeth Mary", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 33
    },
    {
        "Id": 57, "Name": "Victoria Ash", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 34
    },
    {
        "Id": 58, "Name": "Janine Labrune", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 35
    },
    {
        "Id": 59, "Name": "Martine Rancé", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 11
    },
    {
        "Id": 60, "Name": "Carine Schmitt", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 11
    },
    {
        "Id": 61, "Name": "Paolo Accorti", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 38
    },
    {
        "Id": 62, "Name": "André Fonseca", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/John.png", "IsExpand": "true",
        "RatingColor": "#EBB92E", "ReportingPerson": 41
    },
    {
        "Id": 63, "Name": "Mario Pontes", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 6
    },
    {
        "Id": 64, "Name": "John Steel", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Maria.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": 7
    },
    {
        "Id": 65, "Name": "Renate Jose", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image51.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 42
    },
    {
        "Id": 66, "Name": "Jaime Yorres", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 20
    },
    {
        "Id": 67, "Name": "Alex Feuer", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 21
    },

    {
        "Id": 68, "Name": "Yvonne Wong", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 6
    },

    {
        "Id": 69, "Name": "Yoshi Kenna", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "false",
        "RatingColor": "#EBB92E", "ReportingPerson": 40
    },
    {
        "Id": 70, "Name": "Helen Marie", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image51.png", "IsExpand": "true",
        "RatingColor": "#EBB92E", "ReportingPerson": 24
    },
    {
        "Id": 71, "Name": "Joseph Kaff", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 70
    },
    {
        "Id": 72, "Name": "Horst Kloss", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Clayton.PNG", "IsExpand": "None",
        "RatingColor": "#68C2DE", "ReportingPerson": 70
    },
    {
        "Id": 73, "Name": "Sergio roel", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image55.PNG", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 37
    },
    {
        "Id": 74, "Name": "Mauri Moroni", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.PNG", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 60
    },
    {
        "Id": 75, "Name": "Janete Limeira", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image51.PNG", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 29
    },
    {
        "Id": 76, "Name": "Jonas Bergsen", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.PNG", "IsExpand": "None",
        "RatingColor": "#68C2DE", "ReportingPerson": 18
    },
    {
        "Id": 77, "Name": "Miguel Angel", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/eric.PNG", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 18
    },
    {
        "Id": 78, "Name": "Art Nancy", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "true",
        "RatingColor": "#D46E89", "ReportingPerson": 88
    },
    {
        "Id": 79, "Name": "Pascal Cartrain", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/John.png", "IsExpand": "true",
        "RatingColor": "#EBB92E", "ReportingPerson": 88
    },
    {
        "Id": 80, "Name": "Helvetis Nagy", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 34
    },
    {
        "Id": 81, "Name": "Rita Müller", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Paul.png", "IsExpand": "None",
        "RatingColor": "#68C2DE", "ReportingPerson": 35
    },
    {
        "Id": 82, "Name": "Georg Pipps", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 36
    },
    {
        "Id": 83, "Name": "Horst Kloss", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Paul.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 37
    },
    {
        "Id": 84, "Name": "Paula Wilson", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 38
    },
    {
        "Id": 85, "Name": " Jose Michael", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/eric.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 37
    },
    {
        "Id": 86, "Name": "Mauri Moroni", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 40
    },
    {
        "Id": 87, "Name": "Michael Holz", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 41
    },
    {
        "Id": 88, "Name": "Alej Camino", "Designation": "Project Trainee",
        "ImageUrl": "../content/images/radialtree/image51.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 42
    },
    {
        "Id": 89, "Name": "Jytte Petersen", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/image55.PNG", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": "parent"
    },
    {
        "Id": 90, "Name": "Mary Saveley", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "false",
        "RatingColor": "#93B85A", "ReportingPerson": "parent"
    },
    {
        "Id": 91, "Name": "Robert King", "Designation": "Project Manager",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "true",
        "RatingColor": "#D46E89", "ReportingPerson": "parent"
    },
    {
        "Id": 92, "Name": "Francisco Yang", "Designation": "CSR",
        "ImageUrl": "../content/images/radialtree/image55.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 100
    },
    {
        "Id": 93, "Name": "Yang Wang", "Designation": "CSR",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 80
    },
    {
        "Id": 94, "Name": "Ann Devon", "Designation": "CSR",
        "ImageUrl": "../content/images/radialtree/Robin.png", "IsExpand": "false",
        "RatingColor": "#68C2DE", "ReportingPerson": 80
    },
    {
        "Id": 95, "Name": "Roland Mendel", "Designation": "CSR",
        "ImageUrl": "../content/images/radialtree/image57.png", "IsExpand": "true",
        "RatingColor": "#68C2DE", "ReportingPerson": 19
    },
    {
        "Id": 96, "Name": "Yoshi Latimer", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/eric.png", "IsExpand": "true",
        "RatingColor": "#D46E89", "ReportingPerson": 13
    },
    {
        "Id": 97, "Name": "Patricia Kenna", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/Maria.png", "IsExpand": "true",
        "RatingColor": "#EBB92E", "ReportingPerson": 100
    },
    {
        "Id": 98, "Name": "Helen Bennett", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/image51.png", "IsExpand": "None",
        "RatingColor": "#D46E89", "ReportingPerson": 42
    },
    {
        "Id": 99, "Name": "Carlos Nagy", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 42
    },
    {
        "Id": 100, "Name": "Felipe Kloss", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "false",
        "RatingColor": "#EBB92E", "ReportingPerson": 77
    },
    {
        "Id": 101, "Name": "Fran Wilson", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 46
    },
    {
        "Id": 102, "Name": "John Rovelli", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/Jenny.png", "IsExpand": "None",
        "RatingColor": "#93B85A", "ReportingPerson": 46
    },
    {
        "Id": 103, "Name": "Georg Pipps", "Designation": "SR",
        "ImageUrl": "../content/images/radialtree/Thomas.png", "IsExpand": "None",
        "RatingColor": "#EBB92E", "ReportingPerson": 55
    }
];

let items: DataManager = new DataManager(data as JSON[], new Query().take(5));

let diagram: Diagram = new Diagram({
    width: '900px', height: '590px',
    snapSettings: { constraints: 0 },
    layout: {
        type: 'RadialTree', horizontalSpacing: 30, verticalSpacing: 30, root: 'parent'
    },
    dataSourceSettings: {
        id: 'Id', parentId: 'ReportingPerson', dataManager: items
    },

    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.height = 50;
        obj.width = 50;
        obj.backgroundColor = 'lightgrey';
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Straight';
        return connector;
    },
});

diagram.appendTo('#diagram');
diagram.fitToPage();

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


