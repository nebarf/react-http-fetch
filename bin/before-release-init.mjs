import simpleGit from 'simple-git';

const requiredBranch = 'main';
const git = simpleGit();

const activeBranch = (await git.branch()).current;
// Check if the active branch match the required one.
if (requiredBranch !== activeBranch) {
  throw new Error('You must be on main branch to create a release branch');
}

await git.fetch();
const gitStatus = await git.status();

// Check if git directory is clean.
if (!gitStatus.isClean()) {
  throw new Error('Git working directory must be in a clean state');
}

// Check if branch is tracking a remote one.
if (!gitStatus.tracking) {
  throw new Error('Local branch is not tracking a remote one');
}

// Check if main branch is up to date with remote version.
if (gitStatus.ahead > 0) {
  throw new Error('Local branch is ahead of the remote version');
}
if (gitStatus.behind > 0) {
  throw new Error('Local branch is behind of the remote version');
}

// /* eslint-disable no-console */
// import shell from 'shelljs';

// const upstream = '@{u}';

// const isUpstreamConfigured =
//   shell.exec(`git rev-parse --abbrev-ref --symbolic-full-name ${upstream}`).code === 0;

// if (!isUpstreamConfigured) {
//   console.error('You must configure upstream for the branch.');
//   shell.exit();
// }

// const local = shell.exec('git rev-parse @');
// const remote = shell.exec(`git rev-parse ${upstream}`);
// const base = shell.exec(`git merge-base @ ${upstream}`);

// // Branch is up to date with or ahead to remote.
// if (local === remote || remote === base) {
//   shell.exit(0);
// }

// // The local branch is behind the remote version, a pull is needed.
// if (local === base) {
//   console.error('The local branch is behind the remote version');
//   shell.exit();
// }

// // Local and remote diverged.
// console.log('Local branch and remote branch diverged!');
// shell.exit();
