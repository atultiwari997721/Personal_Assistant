# KritiAI Windows desktop shell

This Tauri v2 app packages the existing React/Vite client as a Windows desktop WebView and produces an NSIS setup executable. It does not yet bundle a Python sidecar or local execution runtime; desktop-only tools and local AI are not available in this shell.

## Build prerequisites

- Windows 10/11
- Node.js 20+
- Rust stable with the MSVC target
- Microsoft C++ Build Tools and WebView2 Runtime

Install dependencies from `client/` with `pnpm install --frozen-lockfile`, then run `pnpm desktop:dev` or `pnpm desktop:build`.

The desktop UI needs an API deployment. Set `VITE_API_URL` to the deployed API base URL ending in `/api` before building (for example, `https://your-domain.example/api`). Without this setting, the client uses `/api`, which works on the website but does not identify a backend from the packaged desktop app. Do not put provider secrets in this URL or in frontend configuration.

The tagged release workflow builds an unsigned installer and creates a **draft** GitHub release. Review and publish that release before distributing it. No installer download is available until a release is built and published.
