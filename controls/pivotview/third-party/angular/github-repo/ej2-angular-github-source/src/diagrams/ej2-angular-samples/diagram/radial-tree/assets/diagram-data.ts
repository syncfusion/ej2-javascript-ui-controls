
export let localBindData: object[] = [
  { Id: 'parent', Role: 'Board', color: '#71AF17' },
  {
    Id: '1',
    Role: 'General Manager',
    Manager: 'parent',
    ChartType: 'right',
    color: '#71AF17'
  },
  {
    Id: '11',
    Role: 'Assistant General Manager',
    Manager: '1',
    color: '#71AF17'
  },
  {
    Id: '2',
    Role: 'Human Resource Manager',
    Manager: '1',
    ChartType: 'right',
    color: '#1859B7'
  },
  { Id: '3', Role: 'Trainers', Manager: '2', color: '#2E95D8' },
  { Id: '4', Role: 'Recruiting Team', Manager: '2', color: '#2E95D8' },
  { Id: '5', Role: 'Finance Asst. Manager', Manager: '2', color: '#2E95D8' },
  {
    Id: '6',
    Role: 'Design Manager',
    Manager: '1',
    ChartType: 'right',
    color: '#1859B7'
  },
  { Id: '7', Role: 'Design Supervisor', Manager: '6', color: '#2E95D8' },
  { Id: '8', Role: 'Development Supervisor', Manager: '6', color: '#2E95D8' },
  { Id: '9', Role: 'Drafting Supervisor', Manager: '6', color: '#2E95D8' },
  {
    Id: '10',
    Role: 'Operations Manager',
    Manager: '1',
    ChartType: 'right',
    color: '#1859B7'
  },
  { Id: '11', Role: 'Statistics Department', Manager: '10', color: '#2E95D8' },
  { Id: '12', Role: 'Logistics Department', Manager: '10', color: '#2E95D8' },
  {
    Id: '16',
    Role: 'Marketing Manager',
    Manager: '1',
    ChartType: 'right',
    color: '#1859B7'
  },
  { Id: '17', Role: 'Overseas Sales Manager', Manager: '16', color: '#2E95D8' },
  { Id: '18', Role: 'Petroleum Manager', Manager: '16', color: '#2E95D8' },
  {
    Id: '20',
    Role: 'Service Department Manager',
    Manager: '16',
    color: '#2E95D8'
  },
  {
    Id: '21',
    Role: 'Quality Control Department',
    Manager: '16',
    color: '#2E95D8'
  }
];

export let organizationTree: object[] = [
  { Id: 'parent', Role: 'University President', color: '#822B86' },
  { Id: '1', Role: 'Chancellor', Supervision: 'parent', color: '#3c418B' },
  { Id: '2', Role: 'Vice President', Supervision: 'parent', color: '#3c418B' },
  {
    Id: '3',
    Role: 'Student Affairs',
    Supervision: '2',
    ChartType: 'left',
    color: '#3c418B'
  },
  { Id: '4', Role: 'Admin & Finance', Supervision: '2', color: '#3c418B' },
  { Id: '5', Role: 'Academics', Supervision: '2', color: '#3c418B' },
  {
    Id: '6',
    Role: 'External Relations',
    Supervision: '2',
    ChartType: 'right',
    color: '#3c418B'
  },
  {
    Id: '7',
    Role: 'Activities and Special events',
    Supervision: '3',
    color: '#267011'
  },
  {
    Id: '8',
    Role: 'Educational Service Center',
    Supervision: '3',
    color: '#267011'
  },
  { Id: '9', Role: 'Health Care', Supervision: '3', color: '#267011' },
  {
    Id: '10',
    Role: 'Housing and Food Service Center',
    Supervision: '3',
    color: '#267011'
  },
  {
    Id: '11',
    Role: 'Students Development',
    Supervision: '3',
    color: '#267011'
  },
  { Id: '13', Role: 'General Maintenance', Supervision: '4', color: '#267011' },
  { Id: '14', Role: 'Budget and Audit', Supervision: '4', color: '#71AF17' },
  { Id: '15', Role: 'Human Resources', Supervision: '4', color: '#267011' },
  {
    Id: '16',
    Role: 'Information Technology',
    Supervision: '4',
    color: '#71AF17'
  },
  {
    Id: '17',
    Role: 'Facilities Management',
    Supervision: '4',
    color: '#267011'
  },
  {
    Id: '117',
    Role: 'Environment Maintenance',
    Supervision: '4',
    color: '#71AF17'
  },
  { Id: '217', Role: 'Custodial Service', Supervision: '4', color: '#267011' },
  { Id: '18', Role: 'Faculties', Supervision: '5', color: '#267011' },
  { Id: '19', Role: 'Educational Service', Supervision: '5', color: '#71AF17' },
  { Id: '20', Role: 'University Library', Supervision: '5', color: '#267011' },
  { Id: '21', Role: 'Center for Planning', Supervision: '5', color: '#71AF17' },
  { Id: '22', Role: 'Summer Session', Supervision: '5', color: '#267011' },
  { Id: '23', Role: 'Fund Development', Supervision: '6', color: '#71AF17' },
  { Id: '24', Role: 'Admission', Supervision: '6', color: '#71AF17' },
  { Id: '25', Role: 'Alumini Relations', Supervision: '6', color: '#71AF17' },
  {
    Id: '12',
    Role: 'Recruitment & Promotion',
    Supervision: '6',
    color: '#71AF17'
  }
];

export let hierarchicalTree: object[] = [
  { Name: 'Diagram', fillColor: '#916DAF' },
  { Name: 'Layout', Category: 'Diagram' },
  { Name: 'Tree Layout', Category: 'Layout' },
  { Name: 'Organizational Chart', Category: 'Layout' },
  { Name: 'Hierarchical Tree', Category: 'Tree Layout' },
  { Name: 'Radial Tree', Category: 'Tree Layout' },
  { Name: 'Mind Map', Category: 'Hierarchical Tree' },
  { Name: 'Family Tree', Category: 'Hierarchical Tree' },
  { Name: 'Management', Category: 'Organizational Chart' },
  { Name: 'Human Resource', Category: 'Management' },
  { Name: 'University', Category: 'Management' },
  { Name: 'Business', Category: 'Management' }
];

export let radialTree: object[] = [
  {
    Id: 'parent',
    Name: 'Maria Anders',
    Designation: 'Managing Director'
  },
  {
    Id: 1,
    Name: 'Ana Trujillo',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 2,
    Name: 'Lino Rodri',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 3,
    Name: 'Philip Cramer',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 4,
    Name: 'Pedro Afonso',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 5,
    Name: 'Anto Moreno',
    Designation: 'Project Lead',
    ReportingPerson: 1
  },
  {
    Id: 6,
    Name: 'Elizabeth Roel',
    Designation: 'Project Lead',
    ReportingPerson: 1
  },
  {
    Id: 7,
    Name: 'Aria Cruz',
    Designation: 'Project Lead',
    ReportingPerson: 1
  },
  {
    Id: 8,
    Name: 'Eduardo Roel',
    Designation: 'Project Lead',
    ReportingPerson: 1
  },
  {
    Id: 9,
    Name: 'Howard Snyd',
    Designation: 'Project Lead',
    ReportingPerson: 2
  },
  {
    Id: 10,
    Name: 'Daniel Tonini',
    Designation: 'Project Lead',
    ReportingPerson: 2
  },
  {
    Id: 11,
    Name: 'Nardo Batista',
    Designation: 'Project Lead',
    ReportingPerson: 89
  },
  {
    Id: 12,
    Name: 'Michael Holz',
    Designation: 'Project Lead',
    ReportingPerson: 89
  },
  {
    Id: 13,
    Name: 'Kloss Perrier',
    Designation: 'Project Lead',
    ReportingPerson: 90
  },
  {
    Id: 14,
    Name: 'Liz Nixon',
    Designation: 'Project Lead',
    ReportingPerson: 3
  },
  {
    Id: 15,
    Name: 'Paul Henriot',
    Designation: 'Project Lead',
    ReportingPerson: 3
  },
  {
    Id: 16,
    Name: 'Paula Parente',
    Designation: 'Project Lead',
    ReportingPerson: 90
  },
  {
    Id: 17,
    Name: 'Matti Kenna',
    Designation: 'Project Lead',
    ReportingPerson: 4
  },
  {
    Id: 18,
    Name: 'Laura Callahan',
    Designation: 'Project Lead',
    ReportingPerson: 4
  },
  {
    Id: 19,
    Name: 'Simon Roel',
    Designation: 'Project Lead',
    ReportingPerson: 4
  },
  {
    Id: 20,
    Name: 'Thomas Hardy',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 12
  },
  {
    Id: 21,
    Name: 'Martín Kloss',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 5
  },
  {
    Id: 23,
    Name: 'Diego Roel',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 7
  },
  {
    Id: 24,
    Name: 'José Pedro ',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 8
  },
  {
    Id: 25,
    Name: 'Manu Pereira',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 8
  },
  {
    Id: 26,
    Name: 'Annette Roel',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 25
  },
  {
    Id: 27,
    Name: 'Catherine Kaff',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 8
  },
  {
    Id: 28,
    Name: 'Lúcia Carvalho',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 12
  },
  {
    Id: 29,
    Name: 'Alej Camino',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 13
  },
  {
    Id: 30,
    Name: 'Liu Wong',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 14
  },
  {
    Id: 31,
    Name: 'Karin Josephs',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 14
  },
  {
    Id: 33,
    Name: 'Pirkko King',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 17
  },

  {
    Id: 34,
    Name: 'Karl Jablonski',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 18
  },

  {
    Id: 35,
    Name: 'Zbyszek Yang',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 19
  },
  {
    Id: 36,
    Name: 'Nancy',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 5
  },
  {
    Id: 37,
    Name: 'Anne',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 6
  },
  {
    Id: 38,
    Name: 'Isabel Castro',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 7
  },
  {
    Id: 39,
    Name: 'Nardo Batista',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 9
  },
  {
    Id: 40,
    Name: 'Rene Phillips',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 16
  },
  {
    Id: 41,
    Name: 'Rita Pfalzheim',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 9
  },
  {
    Id: 42,
    Name: 'Janete Limeira',
    Designation: 'Senior S/w Engg',
    ReportingPerson: 11
  },
  {
    Id: 43,
    Name: 'Christina kaff',
    Designation: 'S/w Engg',
    ReportingPerson: 20
  },
  {
    Id: 44,
    Name: 'Peter Franken',
    Designation: 'S/w Engg',
    ReportingPerson: 21
  },
  {
    Id: 45,
    Name: 'Carlos Schmitt',
    Designation: 'S/w Engg',
    ReportingPerson: 23
  },
  {
    Id: 46,
    Name: 'Yoshi Wilson',
    Designation: 'S/w Engg',
    ReportingPerson: 23
  },
  {
    Id: 47,
    Name: 'Jean Fresnière',
    Designation: 'S/w Engg',
    ReportingPerson: 24
  },
  {
    Id: 48,
    Name: 'Simon Roel',
    Designation: 'S/w Engg',
    ReportingPerson: 25
  },
  {
    Id: 52,
    Name: 'Palle Ibsen',
    Designation: 'S/w Engg',
    ReportingPerson: 29
  },
  {
    Id: 53,
    Name: 'Lúcia Carvalho',
    Designation: 'S/w Engg',
    ReportingPerson: 30
  },
  {
    Id: 54,
    Name: 'Hanna Moos',
    Designation: 'Project Trainee',
    ReportingPerson: 30
  },
  {
    Id: 55,
    Name: 'Peter Citeaux',
    Designation: 'Project Trainee',
    ReportingPerson: 33
  },
  {
    Id: 56,
    Name: 'Elizabeth Mary',
    Designation: 'Project Trainee',
    ReportingPerson: 33
  },
  {
    Id: 57,
    Name: 'Victoria Ash',
    Designation: 'Project Trainee',
    ReportingPerson: 34
  },
  {
    Id: 58,
    Name: 'Janine Labrune',
    Designation: 'Project Trainee',
    ReportingPerson: 35
  },
  {
    Id: 60,
    Name: 'Carine Schmitt',
    Designation: 'Project Trainee',
    ReportingPerson: 11
  },
  {
    Id: 61,
    Name: 'Paolo Accorti',
    Designation: 'Project Trainee',
    ReportingPerson: 38
  },
  {
    Id: 62,
    Name: 'André Fonseca',
    Designation: 'Project Trainee',
    ReportingPerson: 41
  },
  {
    Id: 63,
    Name: 'Mario Pontes',
    Designation: 'Project Trainee',
    ReportingPerson: 6
  },
  {
    Id: 64,
    Name: 'John Steel',
    Designation: 'Project Trainee',
    ReportingPerson: 7
  },
  {
    Id: 65,
    Name: 'Renate Jose',
    Designation: 'Project Trainee',
    ReportingPerson: 42
  },
  {
    Id: 66,
    Name: 'Jaime Yorres',
    Designation: 'Project Trainee',
    ReportingPerson: 20
  },
  {
    Id: 67,
    Name: 'Alex Feuer',
    Designation: 'Project Trainee',
    ReportingPerson: 21
  },
  {
    Id: 70,
    Name: 'Helen Marie',
    Designation: 'Project Trainee',
    ReportingPerson: 24
  },
  {
    Id: 73,
    Name: 'Sergio roel',
    Designation: 'Project Trainee',
    ReportingPerson: 37
  },
  {
    Id: 75,
    Name: 'Janete Limeira',
    Designation: 'Project Trainee',
    ReportingPerson: 29
  },
  {
    Id: 76,
    Name: 'Jonas Bergsen',
    Designation: 'Project Trainee',
    ReportingPerson: 18
  },
  {
    Id: 77,
    Name: 'Miguel Angel',
    Designation: 'Project Trainee',
    ReportingPerson: 18
  },
  {
    Id: 80,
    Name: 'Helvetis Nagy',
    Designation: 'Project Trainee',
    ReportingPerson: 34
  },
  {
    Id: 81,
    Name: 'Rita Müller',
    Designation: 'Project Trainee',
    ReportingPerson: 35
  },
  {
    Id: 82,
    Name: 'Georg Pipps',
    Designation: 'Project Trainee',
    ReportingPerson: 36
  },
  {
    Id: 83,
    Name: 'Horst Kloss',
    Designation: 'Project Trainee',
    ReportingPerson: 37
  },
  {
    Id: 84,
    Name: 'Paula Wilson',
    Designation: 'Project Trainee',
    ReportingPerson: 38
  },
  {
    Id: 85,
    Name: ' Jose Michael',
    Designation: 'Project Trainee',
    ReportingPerson: 37
  },
  {
    Id: 86,
    Name: 'Mauri Moroni',
    Designation: 'Project Trainee',
    ReportingPerson: 40
  },
  {
    Id: 87,
    Name: 'Michael Holz',
    Designation: 'Project Trainee',
    ReportingPerson: 41
  },
  {
    Id: 88,
    Name: 'Alej Camino',
    Designation: 'Project Trainee',
    ReportingPerson: 42
  },
  {
    Id: 89,
    Name: 'Jytte Petersen',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 90,
    Name: 'Mary Saveley',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 91,
    Name: 'Robert King',
    Designation: 'Project Manager',
    ReportingPerson: 'parent'
  },
  {
    Id: 95,
    Name: 'Roland Mendel',
    Designation: 'CSR',
    ReportingPerson: 19
  },
  {
    Id: 98,
    Name: 'Helen Bennett',
    Designation: 'SR',
    ReportingPerson: 42
  },
  {
    Id: 99,
    Name: 'Carlos Nagy',
    Designation: 'SR',
    ReportingPerson: 42
  },
  {
    Id: 100,
    Name: 'Felipe Kloss',
    Designation: 'SR',
    ReportingPerson: 77
  }
];
export interface DataInfo {
  [key: string]: string;
}
