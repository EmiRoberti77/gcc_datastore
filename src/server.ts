import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { Datastore } from '@google-cloud/datastore';
import { CampaignSchema } from './models/campaignSchema';

const FILE_CODE = 'Film Code';
const FILMCODE = 'Filmcode';
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
    const key = datastore.key([kind, row[FILE_CODE]]);

    const entity = {
      key,
      data: Object.entries(row).map(([name, value]) => ({
        name: name === FILE_CODE ? FILMCODE : name,
        value,
      })),
    };

    return datastore.save(entity);
  });

  await Promise.all(tasks);
  console.log(`${tasks.length} entities saved to Datastore.`);
}

async function getByKey(filmcode: string) {
  const key = datastore.key([kind, filmcode]);
  console.log(`key=${JSON.stringify(key)}`);
  const [entity] = await datastore.get(key);
  if (entity) console.log('entity found');
  else console.log('entity not found');
  return entity;
}

async function updateEntityByKey(
  filmcode: string,
  updates: Partial<Record<string, any>>
) {
  const key = datastore.key([kind, filmcode]);
  const [entity] = await datastore.get(key);

  if (!entity) {
    console.log(`Entity with key ${filmcode} not found.`);
    return;
  }

  // Apply updates
  for (const [field, value] of Object.entries(updates)) {
    entity[field] = value;
  }

  await datastore.save({ key, data: entity });
  console.log(`Entity with key ${filmcode} updated.`);
}

async function addDefaultColumns(data: any[]): Promise<any[]> {
  return data.map((row) => ({
    ...row,
    MBO_EDP1: 'false',
    MBO_EDP1_Action: 'append',
  }));
}

async function main(
  parseNewFile: boolean,
  addExtraColumns: boolean,
  runQuery: false,
  readByKey: boolean
) {
  console.log('main(start)');
  if (parseNewFile) {
    console.log('parsing CSV');
    const data = await parseCSV(csv_path);
    await saveToDatastore(data);
  }
  if (addExtraColumns) {
    let data = await parseCSV(csv_path);
    data = await addDefaultColumns(data);
    await saveToDatastore(data);
  }
  if (runQuery) {
    console.log('running query');
    const queryResponse = await query('Agency', 'SPARK FOUNDRY');
    console.log(queryResponse);
  }
  if (readByKey) {
    console.log('access by key');
    const entity_1 = await getByKey('AMVDNEE884030');
    console.log(entity_1);
    await updateEntityByKey('AMVDNEE884030', {
      MBO_EDP1: 'NEW',
      Action_MBO_EDP1: 'Q2 Push',
    });
    const entity_2 = await getByKey('AMVDNEE884030');
    console.log(entity_2);
  }
  console.log('main(complete)');
}
main(false, true, false, false);
