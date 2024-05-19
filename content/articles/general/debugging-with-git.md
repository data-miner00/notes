---
title: Debugging with Git
topic: General
description: Powerful techniques to identify bugs and issues on a codebase with Git
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - git
  - debugging
  - grep
  - bisect
updatedAt: 2024-03-28T11:05:53.157Z
createdAt: 2023-10-27T11:12:17.718Z
--- 

There are much more [Git](https://git-scm.com/) commands that can be quite handy apart from the usual `fetch`, `commit`, or `push` commands. This short article will introduce 3 useful Git commands namely `bisect`, `grep` and `blame`.

## Bisect

A technique to pinpoint a bug-inducing commit through the commit history. It uses binary search under the hood to detect the bad commit. Interestingly, the process **can be automated** with custom scripts.

### Step 1: Find good and bad commits

The first step is to identify the good (old) commit and the bad (newer) commit. The bad commit will most probably be the current HEAD in which some issue arises unexpectedly, such as missing a file.

Identify those commits and note down the hash of those commits.

```
good commit hash: <hash>
bad commit hash: <hash>
```

### Step 2: Initiate Bisect

Start the interactive debugging session by using the `bisect start` command.

```
git bisect start
```

### Step 3: Specify good and bad commits

With the commit hash gathered on step 1, populate them into the debugging session.

```
git bisect good <good-hash>
git bisect bad <bad-hash>
```

### Step 4: Inspect codebase for issues

This is an iterative step. Bisect will now traverse through the history with binary search for code inspection.

Investigate the codebase. If the bug or issue persists in the current commit, we can reflect by using `bisect bad` command.

```
git bisect bad
```

Bisect will acknowledge the feedback and jump to another commit in history. Investigate the codebase and provide feedback again.

If it is a good commit, we can tell bisect using `bisect good` command.

```
git bisect good
```

Repeat this until there is no more commits to be inspected. Once that happens, the problematic commit should be found.

### Automating the process

The bisect process can be automated by writing custom scripts that can be executed on the respective command line. The script needs to return `-1` or non-zero numbers in case of failure the meet the criteria, and `0` to indicate the criteria has been matched in order for bisect to work correctly.

Specify both the bad and good commit hash to the `bisect start` command to initiate the automated bisect session.

```
git bisect start <bad-hash> <good-hash>
```

After that, specify the script or command to run against.

```
git bisect run <custom script or command>
```

At the end of the execution, it will show the problem-inducing commit just like the manual bisect session.

### Reset

After identified the regression cause, we need to end the bisect session with `reset`.

```
git bisect reset
```

## Blame

Blame is used to outline the authorship of each line of code within a document. It will display three useful info for the respective line.

- commit hash
- author
- commit timestamp

For VSCode, the [GitLens](https://gitlens.amod.io/) extension comes in handy as it shows the abovementioned info directly within the editor for the line the cursor is currently hovering on.

```
git blame <document name>
```

### Blame a Segment

To inspect only part of a file, use the `-L` flag to provide a range of line numbers to be inspected for the file.

```
git blame -L <line-start>,<line-end> <document name>

# example
git blame -L 23,54 azure-pipeline.yml
```

### Show

Use the `show` command to further inspect a commit. We can utilize the hash gathered from the `blame` command to learn more about the changes. 

```
git show <commit-hash>
```

```diff
@@ -23,4 +23,4 @@
        using System.Collections.Specialized;
        using System.IO;

-       public sealed class Calculator
+       public class Calculator
        {
            private const string Name = "Calculator";
            private readonly IMapper mapper;
            private readonly IRepository repository;
```

## Grep

`git grep` is just [Grep](https://man7.org/linux/man-pages/man1/grep.1.html), but for Git. It is used to search text with string or regular expressions for committed files within a Git repository.

```
git grep <regex/text>

# example
git grep "plain text"
git grep "^regex[a-zA-Z0-9]+$"
```

To limit file type for searching, provide the glob pattern as follows.

```
git grep <regex/text> -- <glob-pattern>

# example
git grep "hello" -- "*.tsx"
```

To search for a specific branch, provide the branch name as the second parameter.

```
git grep <regex/text> <branch>
```

This is an example of chaining everything together.

```
git grep -n "section" origin/master -- index.html
```

## References

::apa-reference
---
authors:
 - Stewart, A # Aaron Stewart
title: Git Debugging Techniques
publisher: Pluralsight
date: 2023, October 3
url: https://app.pluralsight.com/library/courses/git-debugging-techniques/table-of-contents
source: websites
---
::

::apa-reference
---
authors:
 - IAdapter
 - Ulhaq, M # Mateen Ulhaq
title: How do I use git bisect?
date: 2011, January 17
url: https://stackoverflow.com/questions/4713088/how-do-i-use-git-bisect
source: websites
---
::

::apa-reference
---
title: git bisect
retrievedDate: 2024, March 24
url: https://git-scm.com/docs/git-bisect
source: websites
---
::

::apa-reference
---
title: git grep
retrievedDate: 2024, March 24
url: https://git-scm.com/docs/git-grep
source: websites
---
::

::apa-reference
---
title: git blame
retrievedDate: 2024, March 24
url: https://git-scm.com/docs/git-blame
source: websites
---
::