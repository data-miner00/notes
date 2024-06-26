---
title: Code Review
topic: General
description: Some helpful advice for a better code review mindset
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - engineering
  - pullrequest
updatedAt: 2024-06-26T12:37:01.866Z
createdAt: 2024-06-26T12:37:01.866Z
---

Code review, or PR review is the process of exchanging information and improving the code that is proposed to be included in the newer version of a software system until all parties involved are satisfied with the changes.

<!--more-->

## Code Review Aspects

1. **Design**: Is it following the appropriate design pattern for the change involved?
2. **Functionality**: Does the code behave as per the author's intention?
3. **Complexity**: Is the implementation unnecessarily complex? Can another developer comprehend such implementations in the future?
4. **Tests**: Does the code have sufficient tests that cover for most of the cases including edge cases?
5. **Naming**: Is the naming for a variable, function or a class clear and cohesive?
6. **Comments**: Are comments clear & useful? Try to avoid comments if possible.
7. **Style**: Is the code following existing style guides?
8. **Documentation**: Is the relevant documentation being updated?
9. **Improvements**: Is the PR also improving existing codes altogether? "The boy scout rule"
10. **Consistency**: Is the PR consistent with what we already have, such as naming, design patterns, etc.

## Writing Descriptions

This part is applicable to the author. When creating a pull request for review, the description is a powerful tool to convey the whole context of the what and why effectively if utilized properly.

1. Write a short summary that encompasses the whole idea of the pull request.
2. Expand and elaborate on the summary and provide as much info as possible in a paragraph. If needed, use bullet points or numberings to list out the nitty gritty of the pull request.
3. If the changes are related to user interface such as a new feature for a web application, provide appropriate screenshots and annotate each of them with easily-to-understand explanations.
4. Provide any links or references that may be helpful.

A great description will fully prepare the reviewers for their expectations and give them a holistic view of the code changes.

## Commenting

This part is applicable to the reviewer.

1. Be respectful and constructive. Don't be harsh, judgemental, or sarcastic when reviewing someone else's code.
2. Ask questions when having doubts about the code. The author should explain and justify why the code is written that way.
3. Give suggestions when there is room for improvement on the code. Provide justifications, links, or references pertaining to the suggestion.
4. Stop the reply chain. If a comment managed to garner a number of chained replies, and it seems to going nowhere, it indicates that the team have misunderstandings or misalignment. Offer a call separately to iron out the discrepancies to make sure that the team is on the same page. After clearing the doubts, come back to the same comment and post the final conclusion of the discussion so that other reviewers can be aligned.

For the authors, if you are offended by the reviewer's comment, take a step back and breathe. Don't take it personally. Lashing out in front of your co-workers is something that you will never want to happen. It is extremely immature and it will negatively impact your career and the relationship with the team in the long run. More often than not, the reviewers just want to make sure that the codebase to have the best quality and might be not good at putting words together such that it is deemed offensive when it actually isn't.

> Take a deep deep breath

## Other Tips

1. Avoid huge PRs. Break it down into smaller, logical PRs to ease the review process. It is not a race to break your "Biggest PR ever created" record.
2. Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). Prefix each logical commit with appropriate terms so that each commits can be examined separately.

## Summary

Code review ensures the quality of the codebase. It also helps the team to align with the changes, and make meaningful discussions for the win. Effective review fosters collaboration, not inciting hatred.

## Reference

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Debogori, N # Nadia Debogori
title: How to review as a Pro
url: https://dev.to/nadia/how-to-review-as-a-pro-59a0
date: 2024, June 19
source: websites
---
::

::apa-reference
---
authors:
 - Mignonsin, M # Marc Mignonsin
title: A practical guide for better, faster code reviews
url: https://github.com/mawrkus/pull-request-review-guide
date: 2024, April 15
source: websites
publisher: GitHub
---
::

::apa-reference
---
organization: Google
title: Google's Code Review Developer Guide
url: https://google.github.io/eng-practices/review/
retrievedDate: 2024, June 26
source: websites
---
::
<!-- prettier-ignore-end -->
