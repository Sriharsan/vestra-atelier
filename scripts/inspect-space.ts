import { Client } from "@gradio/client";
import process from "node:process";

const SPACES = [
  "Kwai-Kolors/Kolors-Virtual-Try-On",
  "yisol/IDM-VTON",
];

async function main() {
  const token = process.env.TRYON_API_KEY || undefined;

  for (const space of SPACES) {
    console.log(`\n=== ${space} ===`);
    try {
      const client = await Client.connect(space, {
        token: token as `hf_${string}` | undefined,
      });
      const info = await client.view_api();
      console.log(JSON.stringify(info, null, 2));
    } catch (err) {
      console.log("FAILED:", (err as Error).message?.substring(0, 300));
    }
  }
}

main();
