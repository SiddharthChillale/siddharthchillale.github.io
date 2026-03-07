---
title: "Handle git mistakes"
date: 2022-02-05T21:47:05+05:30
draft: false
---

1. `git status`

2. `git log`
    - `--stat` : log with the change stats.

3. `git branch` : shows all available branches.
    - `<branch_name>` : creates a branch with name as `<branch_name>`.

4. `git ammend`
    - `--amend -m` "change the commit message" : changes commit message only
    - `--amend <nothing>` : recommits with interactive editor for changing message.

5. `git checkout`
    - `<branch_name>` : switches to `<branch_name>`
    - `<file_name>` : removes all recent changes for `<file_name>`
    - `<commit_hash>` : pulls the commit with hash `<commit_hash>` in a "DETACHED HEAD" state. i.e. We are not on any branch but outside. aNy changes will be discarded in not made permanent. If changes are to made permanent, create a new branch.

6. `git diff`
    - `<commit_hash_1> <commit_hash_2>` : compares difference between commits with hashes `<commit_hash_1>` and `<commit_hash_2>`.

7. `git cherry-pick <commit_hash>`
    - applies changes from `<commit_hash>` to the current branch.

8. `git reset`
    - `--soft <commit_hash>` : return to commit with hash `<commit_hash>` with changes still in staging area.
    - `<commit_hash>` : return to commit with hash `<commit_hash>` with changes in working directory and not staged.
    - `--hard <commit_hash>` : return to commit with hash `<commit_hash>` with all the modifications deleted. Untracked files are left alone... for getting rid of untracked files see `git clean`.

9. `git clean`
    - `-df` : removes untracked files(`-f`) and directories(`-d`).

10. `git reflog` : shows all the log where a commit is referenced.

11. `git revert`
    - `<commit_hash>` : undos the changes from commit with hash`<commit_hash>`. keeps git history clean.

12. `git fetch`
    - `<remote_name/branch_name>` : brings all changes from the remote repo to the local repo, __but doesn't merge with existing files__.

13. `git merge`
    - `<remote_name/branch_name>` : Merging combines your local changes with changes made by others.

14. `git pull` : A convenient shortcut for `git fetch` and `git merge`
    - `<remote_name/branch_name>` : fetches all changes from the remote_repo `<remote_name>` to the local repo and merges the changes.

    __If any merge conflicts, then do `git merge --abort` to take the branch to where it was before you pulled__.

