/**
 * Mac-friendly postinstall: fix .bin permissions/quarantine and ensure native
 * binaries (esbuild, etc.) match the current platform after copying node_modules.
 */
import { execSync } from "node:child_process";
import { chmodSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const binDir = join(root, "node_modules", ".bin");

function fixBinPermissions() {
  if (!existsSync(binDir)) return;
  for (const name of readdirSync(binDir)) {
    const file = join(binDir, name);
    try {
      chmodSync(file, 0o755);
    } catch {
      // ignore symlinks or special files
    }
  }
}

function clearMacQuarantine() {
  if (process.platform !== "darwin") return;
  try {
    execSync(`xattr -dr com.apple.quarantine "${binDir}"`, { stdio: "ignore" });
  } catch {
    // xattr missing or nothing to clear
  }
}

function ensureEsbuild() {
  const esbuildInstall = join(root, "node_modules", "esbuild", "install.js");
  if (!existsSync(esbuildInstall)) return;

  try {
    execSync(`node "${esbuildInstall}"`, { stdio: "pipe", cwd: root });
  } catch {
    console.warn("[postinstall] esbuild install failed; run: npm rebuild esbuild");
  }

  try {
    execSync('node -e "require(\\"esbuild\\")"', { stdio: "pipe", cwd: root });
  } catch (err) {
    const msg = String(err.stderr ?? err.message ?? err);
    if (msg.includes("another platform")) {
      console.log("[postinstall] Rebuilding esbuild for this platform…");
      execSync("npm rebuild esbuild", { stdio: "inherit", cwd: root });
    }
  }
}

fixBinPermissions();
clearMacQuarantine();
ensureEsbuild();
