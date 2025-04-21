import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { Datastore } from '@google-cloud/datastore';
import { CampaignSchema } from './models/campaignSchema';

const csv_file = 'CommercialDBFile_250207.csv';
const UP = '..';
const csv_path = path.join(__dirname, UP, csv_file);

const credentialsPath = path.join(__dirname, '..', 'emi-gcp-key.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
console.log(credentials);

// Create Datastore client explicitly
const datastore = new Datastore({
  projectId: credentials.project_id,
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
});
console.log(csv_path);

const kind = 'trp_event_groups_campaigns';

async function quickTest() {
  const kind = 'TestKind';
  const taskKey = datastore.key([kind, 'test1']);
  const entity = {
    key: taskKey,
    data: {
      created: new Date(),
      message: 'Hello Datastore',
    },
  };

  await datastore.save(entity);
  console.log(`Saved test entity.`);
}

function parseCSV(path: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const result: any[] = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => result.push(data))
      .on('end', () => resolve(result))
      .on('error', reject);
  });
}

async function query(column: string, filter: string): Promise<any[]> {
  const query = datastore
    .createQuery(kind)
    .filter(column, '=', filter)
    .limit(10);
  const [results] = await datastore.runQuery(query);
  return [results];
}

async function saveToDatastore(data: CampaignSchema[]) {
  const tasks = data.map((row) => {
    const key = datastore.key([kind, row['Film Code']]);

    const entity = {
      key,
      data: Object.entries(row).map(([name, value]) => ({
        name,
        value,
      })),
    };

    return datastore.save(entity);
  });

  await Promise.all(tasks);
  console.log(`${tasks.length} entities saved to Datastore.`);
}

async function main() {
  const data = await parseCSV(csv_path);
  await saveToDatastore(data);
}

//main();
query('Agency', 'SPARK FOUNDRY')
  .then((success) => console.log(success))
  .catch((err) => console.log(err));
