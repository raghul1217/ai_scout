import { syncBestOfAITools } from "../lib/tools/bestofai";

async function run() {
  console.log("⚡ Starting Best of AI Tools Sync...");
  console.log("Fetching from https://github.com/best-of-ai/best-of-ai ...");
  
  const result = await syncBestOfAITools();
  
  if (result.success) {
    console.log(`✅ Success! Synchronized ${result.count} AI tools into database from ${result.source}.`);
    process.exit(0);
  } else {
    console.error(`❌ Sync failed:`, result.error);
    process.exit(1);
  }
}

run();

