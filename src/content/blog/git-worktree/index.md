---
title: "One Feature, One WorkTree: How Git WorkTree Killed My Stashing Habit"
date: "2026-09-17T10:56:00.000Z"
summary: "If you've ever been deep in a feature branch — half-written code, a terminal mid-install, an AI assistant cranking away — and a production bug lands on main, you know the ritual. Stash your changes. Switch branches. Pray the stash applies cleanly later. Restart your terminal session. Lose your flow."
draft: false
---
If you've ever been deep in a feature branch — half-written code, a terminal mid-install, an AI assistant cranking away — and a production bug lands on main, you know the ritual. Stash your changes. Switch branches. Pray the stash applies cleanly later. Restart your terminal session. Lose your flow.

There's a better way, and it's been sitting inside Git all along: **git worktree**.

## The problem: one checkout, one branch

A standard Git clone gives you a single working directory with a single branch checked out. That means:

- **Context switching is expensive.** Any time you need to look at or work on another branch, you have to stash or commit, switch, then undo it all.
- **Stashes pile up.** `git stash list` becomes an archaeology site of half-finished ideas - and if you're on a small disk, all those stashed snapshots quietly eat space too.
- **AI assistants get disrupted.** If you're using a tool like Claude in your terminal, a branch switch mid-task breaks its working context. You either wait for it to finish or throw away its progress.

## The fix: git worktree

A worktree is simply **another checkout of the same repository at a different path on disk**. Each worktree has its own branch checked out, its own files, its own terminal - but they all share the same underlying repository, the same commit history, the same remotes.

The rule to remember: **the same branch cannot be checked out in two worktrees at once.** That constraint is actually the feature   - it forces clean separation between what you're working on.

From the command line:

```bash
git worktree add ../my-project-feature-x -b feature-x
git worktree list
git worktree remove ../my-project-feature-x
```

## It's built into VS Code — no extension needed

Here's the part most people miss: VS Code has native worktree support, and almost all ides support it by default.

1. Press `Ctrl+Shift+P` to open the Command Palette.
2. Type and select **Worktree: Add** (or **Git: Create Worktree**, depending on your version).
3. Choose a remote branch or create a new branch that you want in the new worktree.
4. VS Code opens a new window pointed at that path.

No marketplace extension, no extra tooling. You get a full editor window per worktree, each free to run its own terminal, its own dev server, its own everything. VS Code also shows you all the available worktrees and their own changed files view in its Git history panel.  

## My workflow: one feature, one worktree

The pattern I've settled on is dead simple:

- **When I start a feature, I create a worktree for it.**
- **When the feature is done and merged, I delete the worktree.**

That's it. And the payoff is biggest in the situations that used to hurt the most.

Say Claude (or any AI coding agent) is working on a feature in one worktree — and a bug shows up on main. I don't have to stop anything. I open a second worktree cloned from remote main, fix the bug in the worktree there, and the feature work keeps running undisturbed in its own directory with its own terminal. No stashing, no conflict, no lost context.

Even better, you can just tell Claude directly: _"Work on this feature in a separate worktree."_ It sets things up under the `.claude` directory and gets on with it — no extra tokens spent on manual directory juggling.

## One gotcha: ignored files don't come along

When you create a worktree, Git checks out the tracked files — but **anything in** **`.gitignore`** **stays behind**. That means:

- `node_modules` - you'll need to run `npm install` (or your package manager's equivalent) in the new worktree.
- `.env` and other local config files - you'll have to copy these over yourself.

It's mildly annoying, but it's also correct behavior: ignored files are machine- and environment-specific, and Git deliberately doesn't manage them. A quick `cp ../main-project/.env .` and one install command later, you're fully set up. (Whether VS Code offers an option to auto-copy files like `.env` when creating a worktree is worth a quick search — extensions exist that simplify this.)

If you switch to faster package manager like pnpm or bun or uv instead of npm or pip, then creating worktrees will stop being a hassle. 

## Why this beats the stash habit

| With stashing                                        | With worktrees                                       |
| ---------------------------------------------------- | ---------------------------------------------------- |
| Interrupt work, stash, switch, fix, switch back, pop | Fix the bug in another directory; nothing pauses     |
| Stash conflicts are common and painful               | Branches live in separate directories — no collision |
| AI assistant context is destroyed on branch switch   | Agent keeps running in its own worktree              |
| Stashes accumulate and quietly consume disk          | Old worktrees are explicit — you see and delete them |

## Getting started

If you've never used worktrees, don't refactor your whole workflow at once:

1. Manually create one or two worktrees for your next tasks and get a feel for the flow.
2. Reinstall dependencies and copy over your `.env` in each new worktree.
3. The next time you have a small issue, hand it to Claude in a separate worktree and watch it work in parallel with what you're doing.
4. Once comfortable, clean up your disk — remove stale worktrees and that forgotten stash list.

The mental shift is small but lasting: stop thinking of your repository as one directory you keep reorganizing, and start thinking of it as **a workspace you can instantiate per task**. One feature, one worktree — and the stash becomes something you simply don't need anymore.

## Follow-up: configuring worktree creation natively in VS Code

Since writing this post, VS Code added native (no extensions, no hooks) support for carrying git-ignored files into new worktrees. Condensed findings:

### git.worktreeIncludeFiles

Added in VS Code 1.109 (January 2026), currently experimental. A list of glob patterns for files and folders that are copied into a new worktree when VS Code creates it:

```json
"git.worktreeIncludeFiles": [
    ".env",
    ".env.local",
    "node_modules/**"
]
```

- A file is copied only when it matches a pattern AND is in `.gitignore` — tracked files are never duplicated.
- Applies both to worktrees created from the Source Control view (Repositories → ... → Worktrees → Create Worktree) and to worktrees VS Code creates for agent sessions — agent-host support landed in v1.129 (July 2026).
- Default is an empty array; node_modules is not copied unless you list it.

### Copy vs symlink for node_modules

There is no native symlink option — the setting does a real file copy, so listing `node_modules/**` duplicates the dependency tree on disk (slow, and it doubles disk usage per worktree). Avoid symlinking a shared `node_modules` yourself: it works only while branches have identical dependencies, then breaks silently — wrong package versions, native-module ABI mismatches, and tools that write into `node_modules` cross-contaminating worktrees.

The supported way to get shared, near-free dependencies is a package manager with a content-addressed store: **pnpm** hard-links from one global store into every worktree (almost no extra disk), and **bun** does the same via clonefile/hardlink. Recommended setup: `git.worktreeIncludeFiles` for the small config files (`.env`, certs), pnpm or bun for packages.

### Native initialization script (new)

The Cursor-style init script is landing natively as a task option: in `tasks.json`, `"runOptions": { "runOn": "worktreeCreated" }` runs a task automatically whenever a worktree is created (e.g. `pnpm install`, `git submodule update`), including for agent sessions. Recent addition — check whether your VS Code version's tasks.json schema accepts it. There is also a `chat.agentHost.runWorktreeCreatedTasks` setting (defaults to true) controlling auto-dispatch for agent-host sessions.

### Related settings

- `git.detectWorktrees` — auto-detect worktrees created outside VS Code (e.g. by Claude in a terminal) and show them in the Source Control view.
- `git.detectWorktreesLimit` — cap on detected worktrees, default 50.
- Claude Code has its own equivalent: a `.worktreeinclude` file at the project root (gitignore syntax) lists ignored files to copy into every worktree Claude creates.

Sources: VS Code docs (code.visualstudio.com/docs/sourcecontrol/branches-worktrees), VS Code 1.109 release notes, microsoft/vscode issues #276834 and #300905.
