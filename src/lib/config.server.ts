import process from "node:process";

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    tryonProvider: process.env.TRYON_PROVIDER ?? "none",
    fashnApiKey: process.env.FASHN_API_KEY,
    falKey: process.env.FAL_KEY,
    tryonApiUrl: process.env.TRYON_API_URL,
    tryonApiKey: process.env.TRYON_API_KEY,
    mongodbUri: process.env.MONGODB_URI,
  };
}
