/**
 * Local data for diagram layouts
 */
export let data: object[] = [
    {
        'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 1
    },
    {
        'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 2
    },
    {
        'Id': 4, 'Name': 'Christina kaff', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 3
    },
    {
        'Id': 5, 'Name': 'Hanna Moos', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 4
    },
    {
        'Id': 6, 'Name': 'Peter Citeaux', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 5
    },
    {
        'Id': 7, 'Name': 'Martín Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 6
    },
    {
        'Id': 8, 'Name': 'Elizabeth Mary', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 6
    },
    {
        'Id': 9, 'Name': 'Victoria Ash', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 5
    },
    {
        'Id': 10, 'Name': 'Francisco Yang', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 3
    },
    {
        'Id': 11, 'Name': 'Yang Wang', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
    },
    {
        'Id': 12, 'Name': 'Lino Rodri', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 11
    },
    {
        'Id': 13, 'Name': 'Philip Cramer', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 24
    },
    {
        'Id': 14, 'Name': 'Pedro Afonso', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Paul.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 15
    },
    {
        'Id': 15, 'Name': 'Elizabeth Roel', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Maria.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 13
    },
    {
        'Id': 16, 'Name': 'Janine Labrune', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 12
    },
    {
        'Id': 17, 'Name': 'Ann Devon', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 25
    },
    {
        'Id': 18, 'Name': 'Roland Mendel', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 17
    },
    {
        'Id': 19, 'Name': 'Aria Cruz', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Jenny.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 18
    },
    {
        'Id': 20, 'Name': 'Martine Rancé', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 18
    },
    {
        'Id': 21, 'Name': 'Maria Larsson', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image51.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 19
    },
    {
        'Id': 22, 'Name': 'Diego Roel', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 21
    },
    {
        'Id': 23, 'Name': 'Peter Franken', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 21
    },
   {
        'Id': 24, 'Name': 'Howard Snyder', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 16
    },
    {
        'Id': 25, 'Name': 'Carine Schmitt', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
    },
    {
        'Id': 26, 'Name': 'Paolo Accorti', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 36
    },
    {
        'Id': 27, 'Name': 'Eduardo Roel', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 26
    },
    {
        'Id': 28, 'Name': 'José Pedro ', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 27
    },
    {
        'Id': 29, 'Name': 'André Fonseca', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/John.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 28
    },
    {
        'Id': 30, 'Name': 'Howard Snyd', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Jenny.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 29
    },
    {
        'Id': 31, 'Name': 'Manu Pereira', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image56.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 32, 'Name': 'Mario Pontes', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 33, 'Name': 'Carlos Schmitt', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 34, 'Name': 'Yoshi Latimer', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/eric.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 29
    },
    {
        'Id': 35, 'Name': 'Patricia Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Maria.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 29
    },
    {
        'Id': 36, 'Name': 'Helen Bennett', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image51.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 25
    },
    {
        'Id': 37, 'Name': 'Daniel Tonini', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 'parent'
    },
    {
        'Id': 38, 'Name': 'Annette Roel', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 37
    },
    {
        'Id': 39, 'Name': 'Yoshi Wilson', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 38
    },
    {
        'Id': 40, 'Name': 'John Steel', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/Maria.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 38
    },
    {
        'Id': 41, 'Name': 'Renate Jose', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image51.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 40
    },
    {
        'Id': 42, 'Name': 'Jaime Yorres', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 41
    },
    {
        'Id': 43, 'Name': 'Carlos Nagy', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 42
    },
    {
        'Id': 44, 'Name': 'Felipe Kloss', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 43
    },
    {
        'Id': 45, 'Name': 'Fran Wilson', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 46, 'Name': 'John Rovelli', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 47, 'Name': 'Catherine Kaff', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 48, 'Name': 'Jean Fresnière', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 43
    },
    {
        'Id': 49, 'Name': 'Alex Feuer', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 43
    },
    {
        'Id': 50, 'Name': 'Simon Roel', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 42
    },
    {
        'Id': 51, 'Name': 'Yvonne Wong', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 52
    },
    {
        'Id': 52, 'Name': 'Rene Phillips', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 39
    },
    {
        'Id': 53, 'Name': 'Yoshi Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'false',
        'RatingColor': '#EBB92E', 'ReportingPerson': 52
    },
    {
        'Id': 54, 'Name': 'Helen Marie', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image51.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 52
    },
    {
        'Id': 55, 'Name': 'Joseph Kaff', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 52
    },
    {
        'Id': 56, 'Name': 'Georg Pipps', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 57
    },
    {
        'Id': 57, 'Name': 'Nardo Batista', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/Maria.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 12
    },
    {
        'Id': 58, 'Name': 'Lúcia Carvalho', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 57
    },
    {
        'Id': 59, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 57
    },
    {
        'Id': 60, 'Name': 'Sergio roel', 'Designation': 'CSR',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 57
    },
    {
        'Id': 61, 'Name': 'Paula Wilson', 'Designation': 'CSR',
        'ImageUrl': '/source/diagram/employees/eric.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 57
    },
    {
        'Id': 62, 'Name': 'Mauri Moroni', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 57
    },
    {
        'Id': 63, 'Name': 'Janete Limeira', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image51.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 57
    },
    {
        'Id': 64, 'Name': 'Michael Holz', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 57
    },
    {
        'Id': 65, 'Name': 'Alej Camino', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 'parent'
    },
    {
        'Id': 66, 'Name': 'Jonas Bergsen', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 65
    },
    {
        'Id': 67, 'Name': 'Jose Pavarotti', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Maria.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 68
    },
    {
        'Id': 68, 'Name': 'Miguel Angel', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/eric.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 66
    },
    {
        'Id': 69, 'Name': 'Jytte Petersen', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 68
    },
    {
        'Id': 70, 'Name': 'Kloss Perrier', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 72
    },
    {
        'Id': 71, 'Name': 'Art Nancy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 27
    },
    {
        'Id': 72, 'Name': 'Pascal Cartrain', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/John.png', 'IsExpand': 'true',
        'RatingColor': '#EBB92E', 'ReportingPerson': 65
    },
    {
        'Id': 73, 'Name': 'Liz Nixon', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Jenny.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 68
    },
    {
        'Id': 74, 'Name': 'Liu Wong', 'Designation': 'Project Manager',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 'parent'
    },
    {
        'Id': 75, 'Name': 'Karin Josephs', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 74
    },
    {
        'Id': 76, 'Name': 'Ruby Anabela ', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 75
    },
    {
        'Id': 77, 'Name': 'Helvetis Nagy', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 82
    },
    {
        'Id': 78, 'Name': 'Palle Ibsen', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image51.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 76
    },
    {
        'Id': 79, 'Name': 'Mary Saveley', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 82
    },
    {
        'Id': 80, 'Name': 'Paul Henriot', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 79
    },
    {
        'Id': 81, 'Name': 'Rita Müller', 'Designation': 'SR',
        'ImageUrl': '/source/diagram/employees/Paul.png', 'IsExpand': 'None',
        'RatingColor': '#68C2DE', 'ReportingPerson': 79
    },
    {
        'Id': 82, 'Name': 'Pirkko King', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 78
    },
    {
        'Id': 83, 'Name': 'Paula Parente', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/John.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 75
    },
    {
        'Id': 84, 'Name': 'Karl Jablonski', 'Designation': 'S/w Engg',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 83
    },
    {
        'Id': 34, 'Name': 'Matti Kenna', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Jenny.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 84
    },
    {
        'Id': 35, 'Name': 'Zbyszek Yang', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 84
    },
    {
        'Id': 85, 'Name': 'Nancy', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/image56.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 74
    },
    {
        'Id': 86, 'Name': 'Robert King', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'true',
        'RatingColor': '#D46E89', 'ReportingPerson': 85
    },
    {
        'Id': 87, 'Name': 'Laura Callahan', 'Designation': 'CSR',
        'ImageUrl': '/source/diagram/employees/Robin.png', 'IsExpand': 'false',
        'RatingColor': '#D46E89', 'ReportingPerson': 88
    },
    {
        'Id': 88, 'Name': 'Anne', 'Designation': 'CSR',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 86
    },
    {
        'Id': 89, 'Name': 'Georg Pipps', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '/source/diagram/employees/image53.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
    },
    {
        'Id': 30, 'Name': 'Isabel Castro', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 89
    },
    {
        'Id': 34, 'Name': 'Nardo Batista', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image57.png', 'IsExpand': 'None',
        'RatingColor': '#EBB92E', 'ReportingPerson': 88
    },
    {
        'Id': 90, 'Name': 'Rene Phillips', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/image55.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 89
    },
    {
        'Id': 91, 'Name': 'Lúcia Carvalho', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Thomas.png', 'IsExpand': 'None',
        'RatingColor': '#93B85A', 'ReportingPerson': 89
    },
    {
        'Id': 92, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
        'ImageUrl': '/source/diagram/employees/Paul.png', 'IsExpand': 'None',
        'RatingColor': '#D46E89', 'ReportingPerson': 89
    },
    {
        'Id': 93, 'Name': 'Simon Roel', 'Designation': 'Project Lead',
        'ImageUrl': '/source/diagram/employees/Clayton.png', 'IsExpand': 'true',
        'RatingColor': '#93B85A', 'ReportingPerson': 98
    },
];