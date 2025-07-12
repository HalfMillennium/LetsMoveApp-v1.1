# Supabase Node.js Starter

This is a minimal Node.js project using your Supabase project credentials. It shows how to:

✅ Install and initialize the Supabase client  
✅ Query a table (example: `characters`)  
✅ Use environment variables to keep your key out of code  

---

## 1️⃣ Install dependencies

```bash
npm install @supabase/supabase-js dotenv
```

---

## 2️⃣ Create your `.env` file

This keeps your key out of your code for safety.

```
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eGpqcGZtdGl1Z3psdmxidnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTU5ODAsImV4cCI6MjA2Njc5MTk4MH0.6QsKR7qAiUCVurXVUao1PGg4wpp2k_Jfd7_UMbhRfLs
```

---

## 3️⃣ Create `supabaseClient.js`

This module initializes and exports your Supabase client.

```js
// supabaseClient.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxxjjpfmtiugzlvlbvqk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 4️⃣ Create `index.js`

Example of querying your `characters` table:

```js
// index.js
import { supabase } from './supabaseClient.js';

async function getCharacters() {
  const { data, error } = await supabase
    .from('characters')
    .select();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Characters:', data);
}

getCharacters();
```

---

## 5️⃣ Run your code

```bash
node index.js
```

✅ Output will show the rows from your `characters` table, or any error.

---

## Notes

- **Never commit your `.env` with keys to public repos.**  
- This anon key is safe for client-side / public use.  
- For service-role keys, restrict them to server-side only.  
- You can change the table in `.from('characters')` to any table in your Supabase project.

---
