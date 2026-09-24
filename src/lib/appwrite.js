import { Client, Account, Databases, ID } from 'appwrite';

// Di mode dev, gunakan same-origin proxy agar bebas CORS / Invalid Origin saat diakses via IP LAN (192.168.x.x)
const APPWRITE_ENDPOINT =
  import.meta.env.DEV && typeof window !== 'undefined'
    ? `${window.location.origin}/v1`
    : 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '6ab39b8b0006db0ebd67';
const APPWRITE_PROJECT_NAME = 'agent-automation';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

// Ping Appwrite once at app initialization
client.ping()
  .then((res) => {
    console.log('[Appwrite] Ping successful:', res);
  })
  .catch((err) => {
    console.warn('[Appwrite] Ping response / warning:', err?.message || err);
  });

export {
  client,
  account,
  databases,
  ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_PROJECT_NAME,
};
