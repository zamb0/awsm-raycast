import { execSync } from "node:child_process";

const awsmPath = "awsm";

const defaultEnv = {
  ...process.env,
  PATH: `/bin:/usr/bin:/usr/local/bin:/opt/homebrew/bin:${process.env.PATH || ""}`,
  BROWSER: "/usr/bin/open",
};

export function execAwsm(command: string): string {
  try {
    const result = execSync(`${awsmPath} ${command}`, {
      env: defaultEnv,
    });
    return result.toString().trim();
  } catch (err) {
    console.error("Error executing awsm command:", err);
    throw err;
  }
}

export function getDefaultBrowserBundleId(): string | undefined {
  try {
    const launchServicesPath = `${process.env.HOME}/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist`;
    const result = execSync(`/usr/bin/plutil -extract LSHandlers json -o - "${launchServicesPath}"`);
    const handlers = JSON.parse(result.toString()) as Array<Record<string, string>>;
    const handler = handlers.find((entry) => entry.LSHandlerURLScheme === "https")
      || handlers.find((entry) => entry.LSHandlerURLScheme === "http");

    return handler?.LSHandlerRoleAll;
  } catch (err) {
    console.error("Error reading default browser:", err);
    return undefined;
  }
}

export function openUrlWithBundleId(url: string, bundleId: string): void {
  execSync(`/usr/bin/open -b "${bundleId}" "${url}"`);
}