const core = require("@actions/core");
const fs = require("fs");

const { context } = require("@actions/github");

async function run() {
  try {
    const { sha, payload } = context;
    const commit = payload.commits.filter(commit =>
      commit.message.toLowerCase().includes("release version")
    )[0];

    let type;

    if (commit && commit.message) {
      const message = commit.message.toLowerCase();

      if (message.includes("canary")) {
        type = "canary";
      } else if (message.includes("patch")) {
        type = "patch";
      } else if (message.includes("minor")) {
        type = "minor";
      } else if (message.includes("major")) {
        type = "major";
      }

      if (type) {
        core.exportVariable("WILL_RELEASE_TYPE", type);
        return;
      }
    }

    feedback = !type
      ? `ambigous release commit message: should have the format "release version <canary|patch|minor|major>"`
      : "no release will happen";

    core.info(feedback);

    core.exportVariable("WILL_RELEASE", "false");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
