import { RunMode, getChecksumConfig } from "@checksum-ai/runtime";
import { resolve } from "path";
require("dotenv").config({ path: resolve(__dirname, ".env") });

// Environment variables are optional for local testing
const BASE_URL = process.env.BASE_URL || "https://joetodoapp-a03b4.web.app/";

export default getChecksumConfig({
  /**
   * Checksum Run mode. See Readme for more info
   */
  runMode: RunMode.Normal,

  /**
   * Insert here your Checksum API key. You can find it in https://app.checksum.ai/#/settings/
   */
  apiKey: process.env.CHECKSUM_API_KEY || "local-testing",

  /**
   * Define your test run environments and test users within each environment.
   * The environments must be aligned with those set here:
   * https://app.checksum.ai/#/settings/
   */
  environments: [
    {
      name: "joevibeapp-testing",
      baseURL: BASE_URL,
      loginURL: BASE_URL,
      default: true,
      users: [
        {
          role: "",
          username: process.env.USERNAME || "",
          password: process.env.PASSWORD || "",
          default: true,
        },
      ],
    },
  ],

  options: {
    /**
     * Whether to use Checksum Smart Selector in order to recover from failing to locate an element for an action (see README)
     */
    useChecksumSelectors: false,
    /**
     * Whether to use Checksum AI in order to recover from a failed action or assertion (see README)
     */
    useChecksumAI: { actions: true, assertions: true },
    /**
     * Whether to use mock API data when running your tests (see README)
     */
    useMockData: false,
    /**
     * Whether to Upload HTML test reports to app.checksum.ai so they can be viewed through the UI. Only relevant if Playwright reporter config is set to HTML
     * Reports will be saved locally either way (according to Playwright Configs) and can be viewed using the CLI command show-reports.
     */
    hostReports: !!process.env.CI,
    /**
     * Whether to create a PR with healed tests. Only relevant when in Heal mode.
     */
    autoHealPRs: !!process.env.CI,
  },
});
