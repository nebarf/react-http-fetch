/* eslint-disable no-console */
import shell from 'shelljs';

const upstream = '@{u}';

const isUpstreamConfigured =
  shell.exec(`git rev-parse --abbrev-ref --symbolic-full-name ${upstream}`).code === 0;

if (!isUpstreamConfigured) {
  console.error('You must configure upstream for the branch.');
  shell.exit();
}

const local = shell.exec('git rev-parse @');
const remote = shell.exec(`git rev-parse ${upstream}`);
const base = shell.exec(`git merge-base @ ${upstream}`);

// Branch is up to date with or ahead to remote.
if (local === remote || remote === base) {
  shell.exit(0);
}

// The local branch is behind the remote version, a pull is needed.
if (local === base) {
  console.error('The local branch is behind the remote version');
  shell.exit();
}

// Local and remote diverged.
console.log('Local branch and remote branch diverged!');
shell.exit();
