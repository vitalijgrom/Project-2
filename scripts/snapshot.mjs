/**
 * Обновляет public/data/media.json — снапшот, который дашборд показывает,
 * если Cloudflare-прослойка недоступна.
 *
 *   node scripts/snapshot.mjs
 *   MEDIA_SHEET_ID=... node scripts/snapshot.mjs
 *
 * Логика загрузки переиспользуется из самой функции, чтобы схема снапшота и
 * схема живого ответа не разъезжались.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWorkbook } from '../functions/api/media.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(root, 'public/data/media.json');

const sheetId = process.env.MEDIA_SHEET_ID || '18xL7SvIsXgU5aKOhTzYKucLs290cjCITR8Xxk29gXL4';

const payload = await loadWorkbook(sheetId);
payload.source = 'snapshot';

await mkdir(dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(payload, null, 2) + '\n', 'utf8');

console.log(`Снапшот обновлён: ${payload.brands.length} брендов, ` +
  `${payload.viferon.months.length} месяцев → public/data/media.json`);
