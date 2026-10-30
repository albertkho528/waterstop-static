import type { UserConfig } from "unlighthouse/config";

export default {
  site: "http://127.0.0.1:8080",
  urls: ["/", "/en/", "/zh/"],
  scanner: {
    device: "desktop",
    samples: 3,
    ignoreI18nPages: false,
    throttle: false,
  },
  lighthouseOptions: {
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    skipAudits: ["is-on-https", "redirects-http", "uses-http2"],
  },
  ci: {
    budget: {
      performance: 50,
      accessibility: 90,
      "best-practices": 90,
      seo: 90,
    },
    reporter: "json",
  },
} satisfies UserConfig;
