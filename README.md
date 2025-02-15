# Simple Banking Project


## Task 1

### Models

#### Domain Model
![domain model](./images/domain_model.png)

#### Relational model
![relational model](./images/relational_model.png)

### Queries
- I use SQL for querying the PostgreSQL database, which has couple of specifics (e.g. keyword `LIMIT`). 
- I assume that the balance table stores the snapshots of values that principal (jistina), interest (úrok) and fee (poplatek) have at the end of each day. So the end of the month values are stored in the record with date e.g. `2025-01-31`.
- The amount of accounts receivable is calculated as `principal + interest - fee`.
- I assume that each of the variables (principal, interest, fee) has non-negative value.

#### Query 1
Select all clients with principal (in all of their accounts) higher than some number **C** at the end of the month.

```sql
SELECT a.client_id, cl.first_name, cl.last_name
FROM client cl
JOIN account a ON a.client_id = cl.id
JOIN balance b ON b.account_id = a.id
WHERE b.date = (date_trunc('month', now()) + '- 1 day'::interval)::date 
GROUP BY a.client_id, cl.first_name, cl.last_name
HAVING SUM(b.principal) > C
ORDER BY cl.last_name, cl.first_name;
```

Hint: `The WHERE clause selects records that correspond to the last day of the previous month.`

#### Query 2
Select first 10 clients that have the highest accounts receivable at the end of the month.

```sql
SELECT a.client_id, c.first_name, c.last_name, SUM(b.principal + b.interest - b.fee) AS total_accounts_receivable
FROM client c
JOIN account a ON a.client_id = c.id
JOIN balance b ON b.account_id = a.id
WHERE b.date = (date_trunc('month', now()) + '- 1 day'::interval)::date
GROUP BY a.client_id, c.first_name, c.last_name
ORDER BY total_accounts_receivable DESC
LIMIT 10;
```

Hint: `The WHERE clause selects records that correspond to the last day of the previous month.`

## Task 2
I have used TypeScript for the programming. You can find the source code in the `index.ts` file. You can also check out the `index.test.ts` to see couple of examples.

Use terminal to install the dependencies:
```
npm install
```

Compile the code:
```
npm run compile
```

Execute the code:
```
npm run start
```

Clean the compiled files:
```
npm run clean
```

Start tests:
```
npm run test
```