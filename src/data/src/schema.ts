/* tslint:disable:typedef */
// tslint:disable-next-line:missing-jsdoc
export const schema =
// tslint:disable-next-line:no-multiline-string
`input Sort {
    name: String!
    direction: String!
}

input Aggregate {
    field: String!
    type: String!
}

input DataManager {
    skip: Int
    take: Int
    sorted: [Sort]
    group: [String]
    table: String
    select: [String]
    where: String
    search: String
    requiresCounts: Boolean,
    aggregates: [Aggregate],
    params: String
}`;
