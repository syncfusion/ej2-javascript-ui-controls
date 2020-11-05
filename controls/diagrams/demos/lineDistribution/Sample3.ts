import {
    Diagram, ConnectorModel, Node, DataBinding, HierarchicalTree, TreeInfo, SnapConstraints, NodeModel,LineDistribution,ConnectionPointOrigin,ChildArrangement,
} from '../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree,LineDistribution);

import { DataManager, Query } from '@syncfusion/ej2-data';

// export interface EmployeeInfo {
//     Name: string;
//     Role: string;
//   }
  
  
  let data: object[] = [
    {
      "Id": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "ManagerId": "",
      "Name": "Tim Johnson"
    },
    {
      "Id": "0cc3c86b-200b-43ea-8122-b3107557f61e",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Yan Nem"
    },
    {
      "Id": "0d95088a-3f47-4c1c-9ac0-b5d5dfd59455",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Gabriel Hernandez"
    },
    {
      "Id": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Jessica Small"
    },
    {
      "Id": "3c89521c-2be0-4a46-a1a2-e002c7dcaab2",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Thersa Nhan"
    },
    {
      "Id": "44fa026b-8bb6-4044-a8b5-7a78fd94aa1d",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Aaron Garon"
    },
    {
      "Id": "48eda0fc-9861-4d16-acc5-f4b30db81d91",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Keith Balakrishnan"
    },
    {
      "Id": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Alexa Reed"
    },
    {
      "Id": "5425e57e-b56a-4825-ae08-e1bd677af44e",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Muhammad Aksoy"
    },
    {
      "Id": "63fa1948-ab81-4f9a-aa4f-86ca36a2001a",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Dang Lu"
    },
    {
      "Id": "96108260-575f-4f00-86d5-e9c49946c602",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Douglas Wheeler"
    },
    {
      "Id": "bcdd73e1-7a52-43df-8353-b5c23491042e",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Blair Wingate"
    },
    {
      "Id": "c61ff828-5e6b-4b3f-9fe7-a4def799d5d8",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Raj Abbasi"
    },
    {
      "Id": "378755ac-222b-4f93-a8d3-8546c83e8f2e",
      "ManagerId": "0cc3c86b-200b-43ea-8122-b3107557f61e",
      "Name": "Sylvia Peron"
    },
    {
      "Id": "5c826fa5-c2f4-4714-813d-cf072f98eb40",
      "ManagerId": "0cc3c86b-200b-43ea-8122-b3107557f61e",
      "Name": "Jorge Ramos"
    },
    {
      "Id": "5d57fa17-7df2-4722-91c6-bcd2a0778f2e",
      "ManagerId": "0cc3c86b-200b-43ea-8122-b3107557f61e",
      "Name": "Thomas Ngyuen"
    },
    {
      "Id": "f493da2b-ec35-45b1-97aa-a5ba757798e0",
      "ManagerId": "378755ac-222b-4f93-a8d3-8546c83e8f2e",
      "Name": "Christine Qin"
    },
    {
      "Id": "57125eda-a326-46e3-bc5f-5af1be058e50",
      "ManagerId": "5c826fa5-c2f4-4714-813d-cf072f98eb40",
      "Name": "Rosita Ramos"
    },
    {
      "Id": "5db5db14-d74f-4685-aa38-dc026f8b87ee",
      "ManagerId": "5d57fa17-7df2-4722-91c6-bcd2a0778f2e",
      "Name": "Ursala Burnet"
    },
    {
      "Id": "bc3a25b5-86c1-4864-b1c8-70a92e2fe92c",
      "ManagerId": "5d57fa17-7df2-4722-91c6-bcd2a0778f2e",
      "Name": "Hayley Santos"
    },
    {
      "Id": "59f91bfe-c7c1-4be4-aa14-d4b06a8105db",
      "ManagerId": "0d95088a-3f47-4c1c-9ac0-b5d5dfd59455",
      "Name": "Joan Isbell"
    },
    {
      "Id": "26eaca86-c907-448c-a44a-a1de967417e5",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Marcus Hawes"
    },
    {
      "Id": "28fb81b8-0c6a-479b-9bf9-a0f6b462837b",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Wei Sun"
    },
    {
      "Id": "736f416b-32d7-44a7-b99f-519db6581b2c",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Shauna Mosley"
    },
    {
      "Id": "84b9e4e9-aac3-4374-8be5-50fee1d5bb8f",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Skylar Cotton"
    },
    {
      "Id": "8eae136d-ac13-4c64-b742-babf8f725888",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Aicha Stiffel"
    },
    {
      "Id": "a3c38803-fb28-4bb1-a8ce-706e5e3f14c8",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Nhan Tran"
    },
    {
      "Id": "a7823554-aa05-44a4-b385-93c50aea2179",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Haley Hutchinson"
    },
    {
      "Id": "c97963a0-9392-4b6d-9332-2dc207538086",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Roshni Copeland"
    },
    {
      "Id": "ccd1350a-790f-48b1-9826-14bc16d33a7f",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Lucinda Caldwell"
    },
    {
      "Id": "d13b5bb2-6614-4758-8f91-a5562bccdec1",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Giacomo Nieves"
    },
    {
      "Id": "e8cba364-d8d0-407b-b94e-67e91cb2a14e",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Aaram Kumar"
    },
    {
      "Id": "a130fd55-8ffc-4987-a497-2dc03f0589aa",
      "ManagerId": "8eae136d-ac13-4c64-b742-babf8f725888",
      "Name": "Ibrahim Bukhari"
    },
    {
      "Id": "c9b6fe99-dbe6-40b3-be7a-f4335897dc08",
      "ManagerId": "8eae136d-ac13-4c64-b742-babf8f725888",
      "Name": "Anthony Peeples"
    },
    {
      "Id": "f997dd1e-5a0a-4591-bd14-a6a278cd6a08",
      "ManagerId": "8eae136d-ac13-4c64-b742-babf8f725888",
      "Name": "Jeremy Rukowski"
    },
    {
      "Id": "e77bd427-8b76-4724-8bee-5ced085484ae",
      "ManagerId": "a130fd55-8ffc-4987-a497-2dc03f0589aa",
      "Name": "Nicky Castillo"
    },
    {
      "Id": "64d57052-e220-45cc-8625-02ba8b4be252",
      "ManagerId": "e77bd427-8b76-4724-8bee-5ced085484ae",
      "Name": "Susan Cheung"
    },
    {
      "Id": "60807129-0215-4ade-951c-b2f486328425",
      "ManagerId": "64d57052-e220-45cc-8625-02ba8b4be252",
      "Name": "Rosalita Clarkson"
    },
    {
      "Id": "7a656afa-2444-4502-b60e-5fb0c04fb2f4",
      "ManagerId": "64d57052-e220-45cc-8625-02ba8b4be252",
      "Name": "Gloria Delarosa"
    },
    {
      "Id": "32e80929-092b-41e5-9050-adfdd23e7a42",
      "ManagerId": "60807129-0215-4ade-951c-b2f486328425",
      "Name": "Maria Delgado"
    },
    {
      "Id": "66b7348e-c5ea-4195-8df2-29ce63464540",
      "ManagerId": "60807129-0215-4ade-951c-b2f486328425",
      "Name": "Belinda Criswell"
    },
    {
      "Id": "2b2b051d-fa67-445c-b12d-9910d5c491e6",
      "ManagerId": "32e80929-092b-41e5-9050-adfdd23e7a42",
      "Name": "Gayle Denham"
    },
    {
      "Id": "c07ec23d-c1b1-4c9f-b9fd-c7b8c5d988df",
      "ManagerId": "32e80929-092b-41e5-9050-adfdd23e7a42",
      "Name": "Shawn Dellums"
    },
    {
      "Id": "acfd5f38-204d-41d2-ab4e-4382a123a780",
      "ManagerId": "2b2b051d-fa67-445c-b12d-9910d5c491e6",
      "Name": "Ricky Dessens"
    },
    {
      "Id": "91afbb3d-c271-41f6-80bb-6f69e66f92dc",
      "ManagerId": "66b7348e-c5ea-4195-8df2-29ce63464540",
      "Name": "Roberta Davis"
    },
    {
      "Id": "6bcd87b7-8899-4666-90f4-4655bde3a642",
      "ManagerId": "7a656afa-2444-4502-b60e-5fb0c04fb2f4",
      "Name": "Gloria Delgado"
    },
    {
      "Id": "d0ea2695-e55a-41c4-93cc-7475f28ab131",
      "ManagerId": "6bcd87b7-8899-4666-90f4-4655bde3a642",
      "Name": "Larry Detering"
    },
    {
      "Id": "661eba4d-c1b2-4e10-b933-b43413d850c4",
      "ManagerId": "c9b6fe99-dbe6-40b3-be7a-f4335897dc08",
      "Name": "Mikhail Black"
    },
    {
      "Id": "6ebef776-af1b-4517-b9c7-c936110ec3d1",
      "ManagerId": "c9b6fe99-dbe6-40b3-be7a-f4335897dc08",
      "Name": "Jeremy Parkinson"
    },
    {
      "Id": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "ManagerId": "c9b6fe99-dbe6-40b3-be7a-f4335897dc08",
      "Name": "Linda Permutter"
    },
    {
      "Id": "0bb404c2-6b75-46b3-bc1c-ebe2b949925a",
      "ManagerId": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "Name": "Arisha Davie"
    },
    {
      "Id": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "ManagerId": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "Name": "Rosa Delacroix"
    },
    {
      "Id": "ac4202a5-134b-44f0-a5cc-c4207cf47d9b",
      "ManagerId": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "Name": "Brielle McMahon"
    },
    {
      "Id": "46e8f064-fa6a-4bec-985c-9540ad5025a4",
      "ManagerId": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "Name": "Ailsa Coates"
    },
    {
      "Id": "6236e62d-f4c4-440b-9bb8-80f668d46ab4",
      "ManagerId": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "Name": "Zakir Shelson"
    },
    {
      "Id": "cff4ed13-eeda-49c8-a9c3-f8f924a16ab4",
      "ManagerId": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "Name": "Rohit Grimes"
    },
    {
      "Id": "6c81be8f-47cb-497d-a542-7b8533527916",
      "ManagerId": "f997dd1e-5a0a-4591-bd14-a6a278cd6a08",
      "Name": "Hector Sanchez"
    },
    {
      "Id": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "ManagerId": "6c81be8f-47cb-497d-a542-7b8533527916",
      "Name": "Lisa Sicarelli"
    },
    {
      "Id": "0509e334-840f-40d7-9796-8e0c33c7c889",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Crystal Dodd"
    },
    {
      "Id": "0c0f8f79-1455-47bb-8c67-4768c9c008c1",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Dolcie Ware"
    },
    {
      "Id": "583dd23e-c722-45b8-a8ed-57e422177832",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Saffa Alfaro"
    },
    {
      "Id": "8a7f43f3-b645-48ce-b0f7-a815aeed185e",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Zaki McKnight"
    },
    {
      "Id": "f4ea67e7-3391-41ed-b7de-744868b883aa",
      "ManagerId": "a3c38803-fb28-4bb1-a8ce-706e5e3f14c8",
      "Name": "Nhan Tran"
    },
    {
      "Id": "a0d76022-12a7-4643-98ed-84e4f4684a21",
      "ManagerId": "e8cba364-d8d0-407b-b94e-67e91cb2a14e",
      "Name": "Suresh Laghari"
    },
    {
      "Id": "df298aeb-35af-4407-83e4-8e926288e75e",
      "ManagerId": "e8cba364-d8d0-407b-b94e-67e91cb2a14e",
      "Name": "Katie Gonzales"
    },
    {
      "Id": "e8b4841f-5f6c-411e-9d7f-b28b8bf15b9a",
      "ManagerId": "df298aeb-35af-4407-83e4-8e926288e75e",
      "Name": "Monica Gray"
    },
    {
      "Id": "bc6774ac-5802-4adc-a5ba-d36bf87c962b",
      "ManagerId": "e8b4841f-5f6c-411e-9d7f-b28b8bf15b9a",
      "Name": "Ed Harrington"
    },
    {
      "Id": "486d57e2-fc79-4c8f-9751-e350a4989c19",
      "ManagerId": "44fa026b-8bb6-4044-a8b5-7a78fd94aa1d",
      "Name": "Sally Turkington"
    },
    {
      "Id": "6182c173-05ee-43ff-be01-0bc029faa489",
      "ManagerId": "44fa026b-8bb6-4044-a8b5-7a78fd94aa1d",
      "Name": "Damon Washington"
    },
    {
      "Id": "b00d1e7b-67a0-40b8-8e5e-488effd2cce3",
      "ManagerId": "44fa026b-8bb6-4044-a8b5-7a78fd94aa1d",
      "Name": "Carlos Beltran"
    },
    {
      "Id": "b0a9dc01-3826-45a1-8037-37a13b8916c1",
      "ManagerId": "44fa026b-8bb6-4044-a8b5-7a78fd94aa1d",
      "Name": "Tran Christian"
    },
    {
      "Id": "c8fb4a6a-d008-46de-a9d5-55dc252ff7eb",
      "ManagerId": "44fa026b-8bb6-4044-a8b5-7a78fd94aa1d",
      "Name": "Jorge Rodrigues"
    },
    {
      "Id": "8d255f05-db70-4cd5-9a97-76c513476c18",
      "ManagerId": "486d57e2-fc79-4c8f-9751-e350a4989c19",
      "Name": "Ash Agrawal"
    },
    {
      "Id": "8f9f179e-132f-49d8-812d-0824d1f35d42",
      "ManagerId": "486d57e2-fc79-4c8f-9751-e350a4989c19",
      "Name": "Xu Li"
    },
    {
      "Id": "498f533b-7af9-41dc-b3b4-10802aa7e5e2",
      "ManagerId": "8d255f05-db70-4cd5-9a97-76c513476c18",
      "Name": "Hanna Daugherty"
    },
    {
      "Id": "feb71364-d9a2-4e6c-b82c-0ca731c6c015",
      "ManagerId": "8d255f05-db70-4cd5-9a97-76c513476c18",
      "Name": "Melanie Jensen"
    },
    {
      "Id": "20b10619-c00d-4186-8763-1b2b7e0860cd",
      "ManagerId": "8f9f179e-132f-49d8-812d-0824d1f35d42",
      "Name": "Nikki Long"
    },
    {
      "Id": "461a2574-f693-4733-b149-3be3f7c30c3d",
      "ManagerId": "8f9f179e-132f-49d8-812d-0824d1f35d42",
      "Name": "Ronnie Lombardo"
    },
    {
      "Id": "33106a90-c49a-4d32-9a9b-83da8f0166db",
      "ManagerId": "20b10619-c00d-4186-8763-1b2b7e0860cd",
      "Name": "Eddie Longstreth"
    },
    {
      "Id": "1fa83e76-d32c-4a5a-895e-871fda50e9a1",
      "ManagerId": "33106a90-c49a-4d32-9a9b-83da8f0166db",
      "Name": "Victoria Lonsway"
    },
    {
      "Id": "8d5c8ac9-4c72-46c7-af36-c4d7a94377c0",
      "ManagerId": "b00d1e7b-67a0-40b8-8e5e-488effd2cce3",
      "Name": "Christine Tompkins"
    },
    {
      "Id": "929e398f-be0f-47e7-9b64-6233c26f0847",
      "ManagerId": "b00d1e7b-67a0-40b8-8e5e-488effd2cce3",
      "Name": "Ernie Blackmon"
    },
    {
      "Id": "9707cc17-7c37-4c21-9257-1043dae6f2ce",
      "ManagerId": "b00d1e7b-67a0-40b8-8e5e-488effd2cce3",
      "Name": "Caroline Merritt"
    },
    {
      "Id": "3b1e9b65-2632-4863-b7eb-63236e8984d0",
      "ManagerId": "929e398f-be0f-47e7-9b64-6233c26f0847",
      "Name": "Gerard Blake"
    },
    {
      "Id": "7ceb56a6-a5d6-482c-820c-cb78d1088a9b",
      "ManagerId": "3b1e9b65-2632-4863-b7eb-63236e8984d0",
      "Name": "Rodrigo Boghosian"
    },
    {
      "Id": "18d6f48c-8726-4fec-b50b-1875e094d59e",
      "ManagerId": "c8fb4a6a-d008-46de-a9d5-55dc252ff7eb",
      "Name": "Estella Rosa"
    },
    {
      "Id": "be51581d-f0ba-4abe-b4d5-41ec7ac069d9",
      "ManagerId": "48eda0fc-9861-4d16-acc5-f4b30db81d91",
      "Name": "Scott Ballantine"
    },
    {
      "Id": "256fbe3e-6596-4966-9d24-8e7087852634",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Tiago Vargas"
    },
    {
      "Id": "4c13b27a-2dbc-4eab-8065-77529500be3a",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Darin iles"
    },
    {
      "Id": "507db579-5df2-4fc0-bb53-d6a73dfbd61d",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Lisa Patel"
    },
    {
      "Id": "58e031dd-909c-4f4a-8b99-6b149976570c",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Harvie Aguirre"
    },
    {
      "Id": "910d2187-268a-4e5d-83f2-bbdf696b813c",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Celia Redfern"
    },
    {
      "Id": "94a738ff-2b92-4485-b60e-884bdc29971d",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Jade Thomas"
    },
    {
      "Id": "a84d3e18-3ff6-4fbb-9796-dd389244e625",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Rohit Traynor"
    },
    {
      "Id": "e0d8a825-e6e0-4f10-b215-50315df04254",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Nelly McDonnell"
    },
    {
      "Id": "f2a6b91e-4d1e-4329-a759-dfd652af5e06",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Allyson Bond"
    },
    {
      "Id": "fedde4a2-3ce5-4df1-8fca-956db59286dc",
      "ManagerId": "4ef90c25-f445-4f7a-9c92-78440b995a42",
      "Name": "Orion Bouvet"
    },
    {
      "Id": "4f57b23a-75ca-4a4d-8ea5-2894ac027a7e",
      "ManagerId": "94a738ff-2b92-4485-b60e-884bdc29971d",
      "Name": "Daniella Bass"
    },
    {
      "Id": "67d3d0c5-7778-4e62-9b43-860997fb5b80",
      "ManagerId": "94a738ff-2b92-4485-b60e-884bdc29971d",
      "Name": "Susan McKay"
    },
    {
      "Id": "9910df99-8bbc-47e5-af12-9a9fc0053f79",
      "ManagerId": "94a738ff-2b92-4485-b60e-884bdc29971d",
      "Name": "Lisa Li"
    },
    {
      "Id": "f0def661-e654-491e-9005-6319731a5905",
      "ManagerId": "94a738ff-2b92-4485-b60e-884bdc29971d",
      "Name": "Remington Mullins"
    },
    {
      "Id": "78ee27a1-523b-4170-9d9c-a2bf99a7b229",
      "ManagerId": "f0def661-e654-491e-9005-6319731a5905",
      "Name": "Harold Jenkins"
    },
    {
      "Id": "2cb26a63-373b-4fe9-8c21-b8b754a2781f",
      "ManagerId": "78ee27a1-523b-4170-9d9c-a2bf99a7b229",
      "Name": "Leila Foster"
    },
    {
      "Id": "685125b8-50d6-4f6c-be8c-74817b8569d8",
      "ManagerId": "78ee27a1-523b-4170-9d9c-a2bf99a7b229",
      "Name": "Archana Kalpathi"
    },
    {
      "Id": "872a5d66-fb63-4783-be8a-00ca21d5baca",
      "ManagerId": "78ee27a1-523b-4170-9d9c-a2bf99a7b229",
      "Name": "Leon Franks"
    },
    {
      "Id": "d5acbed9-33aa-42fc-80cb-ad1dc4932a90",
      "ManagerId": "78ee27a1-523b-4170-9d9c-a2bf99a7b229",
      "Name": "Valerie Garman"
    },
    {
      "Id": "2ca2f974-cde9-4287-a435-50fda8312cd8",
      "ManagerId": "685125b8-50d6-4f6c-be8c-74817b8569d8",
      "Name": "Mannie Doloros"
    },
    {
      "Id": "760a9fb7-5f63-401d-bf83-f8a2a73597f6",
      "ManagerId": "685125b8-50d6-4f6c-be8c-74817b8569d8",
      "Name": "Tessa Brookside"
    },
    {
      "Id": "bb6e9458-f212-4bfc-86c8-d3bde6b3728f",
      "ManagerId": "685125b8-50d6-4f6c-be8c-74817b8569d8",
      "Name": "Vijay Kathuria"
    },
    {
      "Id": "3acad30e-7b26-479e-8616-2783b0d62e6c",
      "ManagerId": "2ca2f974-cde9-4287-a435-50fda8312cd8",
      "Name": "Carmen Esteban"
    },
    {
      "Id": "3dae9010-cb01-44c9-abc6-5b03da4be49a",
      "ManagerId": "bb6e9458-f212-4bfc-86c8-d3bde6b3728f",
      "Name": "Meredyth Kerswill"
    },
    {
      "Id": "eb5f5d72-9d05-4edd-8e5e-759957ba9c43",
      "ManagerId": "3dae9010-cb01-44c9-abc6-5b03da4be49a",
      "Name": "Giselle Kovac"
    },
    {
      "Id": "e2ab1884-26c4-438e-9839-d6cbb78da676",
      "ManagerId": "872a5d66-fb63-4783-be8a-00ca21d5baca",
      "Name": "Viviana French"
    },
    {
      "Id": "424e4c60-4dce-4f20-a37d-57c2162154ad",
      "ManagerId": "e2ab1884-26c4-438e-9839-d6cbb78da676",
      "Name": "Joey Garcia"
    },
    {
      "Id": "7ec67c47-143f-44c8-a555-2189d27de8a1",
      "ManagerId": "d5acbed9-33aa-42fc-80cb-ad1dc4932a90",
      "Name": "Tracy Gilchrist"
    },
    {
      "Id": "485a40b5-def6-4912-b61c-30aba3a8eba2",
      "ManagerId": "7ec67c47-143f-44c8-a555-2189d27de8a1",
      "Name": "Joyce Gilmore"
    },
    {
      "Id": "8737b413-8aab-4efc-95c1-f57e53979b1c",
      "ManagerId": "f2a6b91e-4d1e-4329-a759-dfd652af5e06",
      "Name": "Bella Alvarez"
    },
    {
      "Id": "bc098e3a-d1d3-4f54-afc1-38918b40d0ef",
      "ManagerId": "5425e57e-b56a-4825-ae08-e1bd677af44e",
      "Name": "Kristine Applebee"
    },
    {
      "Id": "5a1c8fde-4541-4283-8442-71a832aae1dd",
      "ManagerId": "63fa1948-ab81-4f9a-aa4f-86ca36a2001a",
      "Name": "Okoni Nakanishi"
    },
    {
      "Id": "7410d7f0-f1e4-4605-a49a-deff007cefae",
      "ManagerId": "63fa1948-ab81-4f9a-aa4f-86ca36a2001a",
      "Name": "Chamroun Mau"
    },
    {
      "Id": "c1576af8-fe5c-4366-8054-92084721645c",
      "ManagerId": "63fa1948-ab81-4f9a-aa4f-86ca36a2001a",
      "Name": "Kim Mayweather"
    },
    {
      "Id": "2f47b6e5-b124-4cfe-a71c-5dc7e0979c23",
      "ManagerId": "5a1c8fde-4541-4283-8442-71a832aae1dd",
      "Name": "Yvonne Papadakis"
    },
    {
      "Id": "15aa2da3-e9a8-4e88-8531-e74de2bb4580",
      "ManagerId": "2f47b6e5-b124-4cfe-a71c-5dc7e0979c23",
      "Name": "Jimmy Patel"
    },
    {
      "Id": "aeb4031e-3cdb-4a4c-98f5-6d6265f2d846",
      "ManagerId": "2f47b6e5-b124-4cfe-a71c-5dc7e0979c23",
      "Name": "Jerry Rockwell"
    },
    {
      "Id": "53485646-e604-4bbe-8399-3a643075c6b7",
      "ManagerId": "7410d7f0-f1e4-4605-a49a-deff007cefae",
      "Name": "Penny Nyberg"
    },
    {
      "Id": "9a8d714f-67b4-47f2-9f12-a12ced3bf9e0",
      "ManagerId": "7410d7f0-f1e4-4605-a49a-deff007cefae",
      "Name": "David Richard"
    },
    {
      "Id": "64ebcf09-509a-4b28-98dd-a3b989b26736",
      "ManagerId": "53485646-e604-4bbe-8399-3a643075c6b7",
      "Name": "Aaron Ocampo"
    },
    {
      "Id": "71f4b24f-3d54-45ef-908d-23f20a203eff",
      "ManagerId": "64ebcf09-509a-4b28-98dd-a3b989b26736",
      "Name": "Lisa O\u0027Malley"
    },
    {
      "Id": "43897606-f35f-479f-8743-af3d38954b9f",
      "ManagerId": "9a8d714f-67b4-47f2-9f12-a12ced3bf9e0",
      "Name": "Denise Rockford"
    },
    {
      "Id": "0e0bb178-0eaf-426a-a6a4-4b812593b639",
      "ManagerId": "c1576af8-fe5c-4366-8054-92084721645c",
      "Name": "Abigail Merdinian"
    },
    {
      "Id": "60228087-4a03-4084-916a-2057bb27fc2b",
      "ManagerId": "0e0bb178-0eaf-426a-a6a4-4b812593b639",
      "Name": "Leesa Moskowitz"
    },
    {
      "Id": "402e41af-bc0f-4f91-92a2-49868d18cb44",
      "ManagerId": "96108260-575f-4f00-86d5-e9c49946c602",
      "Name": "Rob Viniswathan"
    },
    {
      "Id": "d77db8d4-2e67-40b5-ba9e-05b54f5766b0",
      "ManagerId": "96108260-575f-4f00-86d5-e9c49946c602",
      "Name": "Tess Bennett"
    },
    {
      "Id": "8e1148d2-7574-46ee-a22b-e8eebbf5cc33",
      "ManagerId": "402e41af-bc0f-4f91-92a2-49868d18cb44",
      "Name": "Beth Walker"
    },
    {
      "Id": "bd968998-acdb-437e-9825-423d9329566c",
      "ManagerId": "402e41af-bc0f-4f91-92a2-49868d18cb44",
      "Name": "Jamaica Washington"
    },
    {
      "Id": "d6a0322e-1596-4f5a-b81f-bae1710ec58d",
      "ManagerId": "8e1148d2-7574-46ee-a22b-e8eebbf5cc33",
      "Name": "Tiffany Walsh"
    },
    {
      "Id": "113eadb1-1a41-4eea-8b9f-07ecbca8f680",
      "ManagerId": "bd968998-acdb-437e-9825-423d9329566c",
      "Name": "Hannah Lamb"
    },
    {
      "Id": "4977b7de-bcb1-450a-924f-1b3dbf1a9800",
      "ManagerId": "bd968998-acdb-437e-9825-423d9329566c",
      "Name": "Doug Whitaker"
    },
    {
      "Id": "82939e2e-7596-4865-b81b-be97dc4adc58",
      "ManagerId": "bcdd73e1-7a52-43df-8353-b5c23491042e",
      "Name": "Gary Winters"
    }
  ];
  
  let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
  
  let diagram: Diagram = new Diagram({
      width: '100%', height: '600px',
      snapSettings: { constraints: SnapConstraints.None,
        snapAngle: 90,
        snapObjectDistance: 50 
    },
      //Use automatic layout to arrange elements on the page
      layout: {
        type: 'HierarchicalTree',connectionPointOrigin:ConnectionPointOrigin.DifferentPoint,
        margin: { left: 10, top: 10 },
        horizontalSpacing: 70.0,
        verticalSpacing: 70.0,
        springFactor: 40.0,
        springLength: 50.0,
        orientation: 'TopToBottom',
    },
    dataSourceSettings: {
        id: "Id", parentId: "ManagerId", dataManager: items
    },
      getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.shape = { type: 'Text', content: obj.id};
            obj.style = { fill: '#659be5', strokeColor: 'none', color: 'white', strokeWidth: 2 };
            obj.borderColor = '#3a6eb5';
            obj.backgroundColor = '#659be5';
            //obj.shape.margin = { left: 5, right: 5, bottom: 5, top: 5 };
            obj.expandIcon = { height: 10, width: 10, shape: 'Plus', fill: 'lightgray', offset: { x: 0.5, y: 1 } };
            obj.expandIcon.verticalAlignment = 'Auto';
            obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.offset = { x: 0.5, y: 1 };
            obj.collapseIcon.verticalAlignment = 'Auto';
            obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.height = 10;
            obj.collapseIcon.width = 10;
            obj.collapseIcon.padding.top = 5;
            obj.collapseIcon.shape = 'Minus';
            obj.collapseIcon.fill = 'lightgray';
        return obj;
      },
      getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        connector.style.strokeColor = '#6d6d6d';
        connector.constraints = 0;
        connector.cornerRadius = 5;
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
    if(log.checked){
        diagram.layout.connectionPointOrigin =ConnectionPointOrigin.DifferentPoint
    }else{
        diagram.layout.connectionPointOrigin =ConnectionPointOrigin.SamePoint
    }
}
var linear1: any = document.getElementById('linear');
linear1.onclick = linear;
var oldProp, newProp;
function linear() {
    if (linear1.checked) {
        diagram.layout.arrangement = ChildArrangement.Linear
    } else {
        diagram.layout.arrangement = ChildArrangement.Nonlinear
    }
}

