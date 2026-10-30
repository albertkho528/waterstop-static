import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const runtime =
  process.env.CONTAINER_RUNTIME ??
  (existsSync("/usr/bin/podman") ? "podman" : "docker");
const chrome =
  process.env.CHROME_PATH ??
  [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/sbin/chromium-browser",
    "/usr/bin/google-chrome",
  ].find(existsSync);
if (chrome) process.env.CHROME_PATH = chrome;

const image = "waterstop-qa";
const name = "waterstop-qa";
const port = 8080;
const site = `http://127.0.0.1:${port}`;
const reportPath = ".unlighthouse/ci-result.json";

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    ...options,
  });
}

function stopContainer() {
  run(runtime, ["stop", name], { stdio: "ignore" });
  run(runtime, ["rm", "-f", name], { stdio: "ignore" });
}

let status = 1;

try {
  const build = run(runtime, [
    "build",
    "--platform",
    "linux/amd64",
    "-t",
    image,
    ".",
  ]);
  if (build.status !== 0) throw new Error("container build failed");

  stopContainer();
  const container = run(runtime, [
    "run",
    "-d",
    "--rm",
    "--name",
    name,
    "-p",
    `${port}:8080`,
    image,
  ]);
  if (container.status !== 0) throw new Error("container failed to start");

  let up = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${site}/`);
      if (response.ok) {
        up = true;
        break;
      }
    } catch {
      // The container is still starting.
    }
    await sleep(500);
  }
  if (!up) throw new Error(`local container did not respond at ${site}`);

  const qa = run(
    "bunx",
    [
      "unlighthouse-ci",
      "--site",
      site,
      "--desktop",
      "--assert",
      "--enable-i18n-pages",
      "--config-file",
      "unlighthouse.config.ts",
    ],
    { timeout: 900_000 },
  );
  if (qa.status !== 0) {
    status = qa.status ?? 1;
    throw new Error(`unlighthouse-ci exited with status ${status}`);
  }

  const data = JSON.parse(readFileSync(reportPath, "utf8"));
  const routes = Array.isArray(data)
    ? data.length
    : Array.isArray(data.routes)
      ? data.routes.length
      : 0;
  if (routes === 0) {
    throw new Error(
      "Unlighthouse scanned no routes; check the local container",
    );
  }
  console.log(`Local QA scanned ${routes} routes.`);
  status = 0;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  stopContainer();
}

process.exit(status);
