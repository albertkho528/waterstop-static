import type { UserConfig } from "unlighthouse/config";

export default {
  site: "http://127.0.0.1:8080",
  urls: ["/", "/en/", "/zh/"],
  scanner: {
    device: "mobile",
    samples: 3,
    ignoreI18nPages: false,
    throttle: true,
  },
  lighthouseOptions: {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 600,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 750,
      cpuSlowdownMultiplier: 1,
    },
    skipAudits: ["is-on-https", "redirects-http", "uses-http2"],
  },
  ci: {
    budget: {
      performance: 60,
      accessibility: 90,
      "best-practices": 90,
      seo: 90,
    },
    reporter: "json",
  },
} satisfies UserConfig;
