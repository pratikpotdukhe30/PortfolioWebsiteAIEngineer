import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Runs api/chat.ts inside the Vite dev server, so `npm run dev` uses the real
// model API locally. Put OPENAI_API_KEY in .env.local (never commit it).
function localApi(): Plugin {
  return {
    name: "local-api",
    configureServer(server) {
      const env = loadEnv("development", process.cwd(), "");
      for (const k of ["OPENAI_API_KEY", "OPENAI_MODEL", "GEMINI_API_KEY", "GEMINI_MODEL"]) if (env[k]) process.env[k] = env[k];

      server.middlewares.use("/api/chat", async (req, res) => {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const mod = await server.ssrLoadModule("/api/chat.ts");
        const shim = {
          status(code: number) { res.statusCode = code; return shim; },
          json(body: unknown) { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); },
        };
        try {
          await mod.default({ method: req.method, body: raw ? JSON.parse(raw) : {} }, shim);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApi()],
});