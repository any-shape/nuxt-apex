# Contributing Guidelines

***Thank you for your interest in contributing to `nuxt-apex`! To make the process smooth and efficient for everyone, please read through this guide before opening issues or submitting pull requests.***

### Table of Contents

- **[Code of Conduct](#code-of-conduct)**
- **[Asking Questions](#asking-questions)**
- **[Getting Started](#getting-started)**
- **[Development Setup](#development-setup)**
- **[Branching and Workflow](#branching-and-workflow)**
- **[Coding Standards](#coding-standards)**
- **[Commit Messages](#commit-messages)**
- **[Running Tests](#running-tests)**
- **[Submitting a Pull Request](#submitting-a-pull-request)**
- **[Issue Reporting](#issue-reporting)**
- **[Feature Requests](#feature-requests)**
- **[Documentation](#documentation)**
- **[License](#license)**

## Code of Conduct

**This project follows the [Contributor Covenant v3.0](https://www.contributor-covenant.org/version/3/0/code_of_conduct/). By participating, you agree to abide by its terms.**

## Asking Questions

We want to keep our issue tracker focused on actionable bugs and feature requests, so please direct general questions and support inquiries to our community discussion channels:

**GitHub [Discussions](https://github.com/your-org/nuxt-apex/discussions)**:  
  - How‑to questions (“How do I configure X?”).
  - Best practices (“What’s the recommended pattern for Y?”).
  - Brainstorming and design feedback.

**When asking a question, please include:**
  - **Context**: what you’re building and how you’re using `nuxt-apex`.  
  - **Reproduction steps**: code snippets or minimal repos demonstrating the issue or configuration.  
  - **What you’ve tried**: any documentation pages, examples, or approaches you’ve already explored.

By keeping questions in the right place, we can ensure bugs and feature work stay on track in our issue tracker—and community members can more easily share knowledge and help each other!

## Getting Started

  - Fork the repository on `GitHub`.
  - Clone your fork locally:
    ```shell
    git clone git@github.com:<your-username>/nuxt-apex.git
    cd nuxt-apex
    ```
  - Install dependencies (requires Node.js ≥ 22.x and pnpm):
    ```shell
    pnpm install
    ```

## Development Setup

  - Build the module for local testing:
    ```shell
    pnpm run dev
    ```
  - Use the development server in a playground Nuxt project to verify behavior.

## Branching and Workflow

**We follow a GitHub Flow:**

  - `main`: Holds production-ready code. All changes arrive here via PRs.
  - `dev`: Integration branch for ongoing work and beta releases.
  - `feature/`: Prefix for feature branches (e.g. feature/api-types).
  - `fix/`: Prefix for bugfix branches (e.g. fix/edge-case).

**Workflow:**

  - Create a new branch: `git checkout -b feature/your-feature`.
  - Develop and test your changes.
  - Commit your work following Conventional Commits.
  - Push your branch and open a `Pull Request` against `dev`.


## Coding Standards

  - **Language**: ES2023+ (Node.js & modern browsers).
  - **TypeScript**: Enable strict mode; provide types for all public APIs.
  - **Modularity**: Break features into small, reusable functions/modules.
  - **Performance**: Prioritize scalability — batch operations, caching, and lazy-loading where appropriate.

## Commit Messages

All commits must follow the **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)** spec:

  - `fix(router)`: handle null query parameters
  - `feat(parser)`: support nested arrays
  - `perf(build)`: parallelize type extraction
  - `docs(readme)`: add migration notes
  - `chore`: update deps

***We enforce this via commitlint in CI; invalid messages will cause the build to fail.***

## Running Tests

  - Unit tests (`Vitest`):
    ```shell
    pnpm test
    ```

  - E2E tests (`Cypress`):
    ```shell
    pnpm cy:open
    ```

***Make sure all tests pass before opening a PR.***

## Submitting a Pull Request

  - Ensure tests and linting pass locally.
  - Rebase or merge latest dev into your branch.
  - Push your branch and open a PR:
    - *Base*: `dev` for features/betas, `main` for hotfixes.
    - *Title*: Begin with a `Conventional Commits` header (e.g. `feat:` , `fix:` ).
    - *Description*: Describe what changed and why. Include links to issues if relevant.
  - Add any relevant CI labels, reviewers, and assign the PR.
  - Respond to review comments; update your branch as needed.
  - After merge, CI will run lint → tests → (on `dev`) beta pre-release or (on `main`) full release.

## Issue Reporting

A great way to contribute to the project is to send a detailed issue when you encounter a problem. We always appreciate a well-written, thorough bug report.

In short, since you are most likely a developer, **provide a ticket that you would like to receive**:

  - **Review the documentation** before opening a new issue.
  - **Do not open a duplicate issue!** Search through existing issues to see if your issue has previously been reported. If your issue exists, comment with any additional information you have. You may simply note "I have this problem too", which helps prioritize the most common problems and requests.
  - **Prefer using [reactions](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/)**, not comments, if you simply want to "+1" an existing issue.
  - **Fully complete the provided issue template**. The bug report template requests all the information we need to quickly and efficiently address your issue. Be clear, concise, and descriptive. Provide as much information as you can, including steps to reproduce, stack traces, compiler errors, library versions, OS versions, and screenshots (if applicable).
  - **Use [GitHub-flavored Markdown](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax)**. Especially put code blocks and console outputs in backticks (```). This improves readability.

## Feature Requests

**Feature requests are welcome!** While we will consider all requests, we cannot guarantee your request will be accepted. We want to avoid **[feature creep](https://en.wikipedia.org/wiki/Feature_creep)**. Your idea may be great, but also out-of-scope for the project. If accepted, we cannot make any commitments regarding the timeline for implementation and release. However, you are welcome to submit a pull request to help!

  - **Do not open a duplicate feature request.** Search for existing feature requests first. If you find your feature (or one very similar) previously requested, comment on that issue.
  - **Fully complete the provided issue template.** The feature request template asks for all necessary information for us to begin a productive conversation.
  - **Be precise about the proposed outcome of the feature** and how it relates to existing features. Include implementation details if possible.

## Documentation

If you introduce new features or change existing behaviors, please **update** the project documentation so that users always have access to accurate information:

  - **README.md**: Add or adjust usage examples, upgrade notes, and configuration instructions.
  - **JSDoc/TypeScript definitions**: Ensure public APIs have clear type annotations and comments.

## License

By contributing to `nuxt-apex`, you agree that any code, documentation, or other material you submit will be licensed under the project’s [MIT License](LICENSE). Please make sure you’ve read and understood the full license text in the **LICENSE** file before contributing.

