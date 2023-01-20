# Run a nextjs app with docker in a monorepo with yarn workspaces

This is a research repo to investigate methods and best practices on how a nextjs app can be dockerized while the source code is in a yarn workspaces mono repo.

## Project structure

    .
    ├── node_modules ------------ yarn workspaces will try to hoist all dependencies just once in the root
    ├── packages
        ├── lib ----------------- typescript package containing shared code
            ├── package.json
            ├── tsconfig.json
        ├── nextjs-app ---------- bare nextjs app (created with create-next-app)
            ├── Dockerfile
            ├── node_modules ---- when the app grows, some dependencies might end up here instead of in the root
            ├── package.json
    ├── package.json ------------ root package.json listing all workspaces (**/packages/*)
    └── README.md
    ├── yarn.lock

