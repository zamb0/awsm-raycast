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