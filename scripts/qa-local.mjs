import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
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
const reportDir = ".unlighthouse";
const reportPath = `${reportDir}/ci-result.json`;

const profiles = [
  {
    name: "desktop",
    flag: "--desktop",
    config: "unlighthouse.config.ts",
    report: `${reportDir}/ci-desktop.json`,
    expected: 3,
  },
  {
    name: "mobile",
    flag: "--mobile",
    config: "unlighthouse.mobile.config.ts",
    report: `${reportDir}/ci-mobile.json`,
    expected: 3,
  },
];

const requested = process.argv.slice(2);
const selected = requested.length
  ? profiles.filter((profile) => requested.includes(profile.flag))
  : profiles;
if (selected.length === 0) {
  console.error("Usage: bun scripts/qa-local.mjs [--desktop] [--mobile]");
  process.exit(1);
}

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

function percent(value) {
  if (typeof value !== "number") return "n/a";
  return Math.round(value <= 1 ? value * 100 : value);
}

function printSummary(profile) {
  if (!existsSync(profile.report)) return 0;
  const data = JSON.parse(readFileSync(profile.report, "utf8"));
  const routes = Array.isArray(data)
    ? data
    : Array.isArray(data.routes)
      ? data.routes
      : [];
  for (const route of routes) {
    console.log(
      `  ${profile.name} ${route.path ?? route.url ?? "?"}  perf ${percent(route.performance)}  a11y ${percent(route.accessibility)}  bp ${percent(route["best-practices"])}  seo ${percent(route.seo)}`,
    );
  }
  return routes.length;
}

let status = 0;
mkdirSync(reportDir, { recursive: true });

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

  for (const profile of selected) {
    rmSync(reportPath, { force: true });
    rmSync(profile.report, { force: true });

    const qa = run(
      "bunx",
      [
        "unlighthouse-ci",
        "--site",
        site,
        profile.flag,
        "--assert",
        "--enable-i18n-pages",
        "--config-file",
        profile.config,
      ],
      { timeout: 1_200_000 },
    );
    if (qa.status !== 0) status = qa.status ?? 1;

    if (existsSync(reportPath)) {
      renameSync(reportPath, profile.report);
    } else {
      console.error(`No report written for ${profile.name}.`);
      status = 1;
      continue;
    }

    const routes = printSummary(profile);
    if (routes !== profile.expected) {
      console.error(
        `Expected ${profile.expected} routes for ${profile.name}, got ${routes}.`,
      );
      status = 1;
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  status = 1;
} finally {
  stopContainer();
}

process.exit(status);
