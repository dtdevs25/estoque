import xlsx from 'xlsx';

const FILE_PATH = '2. CONTROLE ESTOQUE REGIONAIS_EPIS_EPCS_ERG (1).xlsx';
const workbook = xlsx.readFile(FILE_PATH);
const sheet = workbook.Sheets['ESTOQUE - SPO'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log('Headers (Row 4):', data[3]);
