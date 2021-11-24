const COLUMNS_1: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 10];
const COLUMNS_2: number[] = [1, 2, 3, 4, 8, 9, 11, 10];
const COLUMNS_3: number[] = [1, 2, 3, 4, 8, 10];
const COLUMNS_4: never[] = [];

const AGGREGATED_VALUE_COLUMNS_BY_GROUP = [
  {
    id: 'e0d19935-cca9-4d2f-ba4e-31fc17944401', // PrEP
    columns: COLUMNS_1,
  },
  {
    id: '224635c4-9929-4d6e-916b-164b1216ba11', // Treatment
    columns: COLUMNS_1,
  },
  {
    id: '2e3f42fc-bcb2-43a0-a398-2331a64b14ac', // Drugs
    columns: COLUMNS_2,
  },
  {
    id: '390f9314-f60b-4025-8c1c-a7f0169732de', // SHI
    columns: COLUMNS_3,
  },
  {
    id: '3e8414b5-6754-41ed-9e80-2eaee3eb7f24', // Service quality
    columns: COLUMNS_4,
  },
  {
    id: '38d3f21f-32c9-4e91-9940-351f2d693010', // Testing
    columns: COLUMNS_1,
  },
];

export { COLUMNS_1, COLUMNS_2, COLUMNS_3, AGGREGATED_VALUE_COLUMNS_BY_GROUP };
