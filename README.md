
# Importing CSV to Google Cloud Datastore with Node.js

This guide demonstrates how to import data from a CSV file into **Google Cloud Datastore** using Node.js. It also explains how Datastore differs from traditional SQL databases.

---

## 🧠 Code Summary

### 1. **Libraries and Setup**

```ts
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { Datastore } from '@google-cloud/datastore';
```

This script uses the `@google-cloud/datastore` library to interact with Google Cloud Datastore and `csv-parser` to read CSV files.

---

### 2. **Set Paths & Credentials**

```ts
const csv_file = 'CommercialDBFile_250207.csv';
const credentialsPath = path.join(__dirname, '..', 'emi-gcp-key.json');
```

Reads in a CSV file and Google Cloud credentials from your local system.

---

### 3. **Create Datastore Client**

```ts
const datastore = new Datastore({ projectId, credentials });
```

Explicitly initializes the Datastore client using project credentials.

---

### 4. **Parse CSV File**

```ts
function parseCSV(path: string): Promise<any[]> { ... }
```

Parses the CSV into JavaScript objects.

---

### 5. **Save to Datastore**

```ts
async function saveToDatastore(data: CampaignSchema[]) { ... }
```

Maps each row of the CSV to a Datastore entity using the row’s `Film Code` as the entity key.

---

### 6. **Query Datastore**

```ts
async function query(column: string, filter: string): Promise<any[]> { ... }
```

Retrieves entities where a specific column matches a filter.

---

## 🆚 Google Cloud Datastore vs SQL Database

| Feature | Google Cloud Datastore | SQL Database |
|--------|--------------------------|--------------|
| **Data Model** | NoSQL (Entity-Property) | Relational (Tables/Rows) |
| **Schema** | Schema-less | Rigid schema with data types |
| **Scalability** | Automatically scalable | Requires tuning/sharding |
| **Queries** | Limited (no JOINs, partial filters) | Rich SQL querying |
| **Transactions** | Limited multi-entity | Full ACID transactions |
| **Use Case** | Flexible, fast reads (e.g. IoT, apps) | Complex queries & relationships |

---

## ✅ Example Usage

Run the import process:

```ts
await main(); // Parses CSV and saves to Datastore
```

Query by agency:

```ts
query('Agency', 'SPARK FOUNDRY');
```

---

## 🧪 Test Snippet

```ts
async function quickTest() {
  const taskKey = datastore.key(['TestKind', 'test1']);
  const entity = { key: taskKey, data: { created: new Date(), message: 'Hello Datastore' } };
  await datastore.save(entity);
}
```

---

## 🗂 File Structure

```
project-root/
├── emi-gcp-key.json
├── CommercialDBFile_250207.csv
├── models/
│   └── campaignSchema.ts
└── your-script.ts
```

---

## 🚀 Run It

1. Place your CSV and credentials file.
2. Modify paths as needed.
3. Run the script with `ts-node` or transpile with `tsc`.

---

© MIT License
