import { fileURLToPath } from "url"
import { existsSync, writeFileSync } from "fs"
import { execSync } from "child_process"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")
const envPath = path.join(root, ".env")
const force = process.argv.includes("--force")

const PLACEHOLDER_ENV =
    "# Copy filled in automatically .\n" +
    "SUPABASE_URL=http://127.0.0.1:54321\n" +
    "SUPABASE_SERVICE_ROLE_KEY=\n"

function parseEnvOutput(output: string): Record<string, string> {
    const result: Record<string, string> = {}
    for (const line of output.split("\n")) {
        const match = line.match(/^([A-Z_]+)=(.*)$/)
        if (match) result[match[1]] = match[2].replace(/^"|"$/g, "")
    }
    return result
}

function tryFetchFromSupabase(): string | null {
    try {
        const output = execSync("supabase status -o env", {
            cwd: root,
            stdio: ["ignore", "pipe", "ignore"],
        }).toString()
        const parsed = parseEnvOutput(output)
        if (!parsed.API_URL || !parsed.SERVICE_ROLE_KEY) return null
        return `SUPABASE_URL=${parsed.API_URL}\nSUPABASE_SERVICE_ROLE_KEY=${parsed.SERVICE_ROLE_KEY}\n`
    } catch {
        return null // CLI not installed, or `supabase start` hasn't been run yet
    }
}

if (existsSync(envPath) && !force) {
    process.exit(0)
}

const fetched = tryFetchFromSupabase()

if (fetched) {
    writeFileSync(envPath, fetched)
    console.log(
        `[setup-env] ${force ? "Updated" : "Created"} .env with keys pulled from your running local Supabase instance.`,
    )
} else if (force) {
    console.error(
        "[setup-env] Could not reach a running Supabase instance.\n" +
            "  Run `supabase start`, then `npm run env:pull` again.",
    )
    process.exit(1)
} else {
    writeFileSync(envPath, PLACEHOLDER_ENV)
    console.log(
        "\n[setup-env] Created .env with placeholder values (no running Supabase instance found).\n" +
            "  Run `supabase start`, then `npm run env:pull` to fill it in automatically.\n",
    )
}
