# Auto-Update Guide (electron-updater)

This template is compatible with auto-updates via electron-updater.
The base template does not include updater code by default.
Add it when you’re ready.

## Providers at a glance

-   GitHub: simplest for internal apps.
    Private repos require client auth to download updates.
-   Generic (HTTP/HTTPS): host files on your own server/CDN (Nginx, S3/CloudFront).
    Best for broad distribution without client auth.
-   S3: similar to Generic with first-class support.

Important files per platform (must live together under your publish URL):

-   Windows: latest.yml + YourApp-Setup.exe
-   macOS: latest-mac.yml + YourApp-mac.zip (DMG is for install; ZIP is used for auto-update)
-   Linux: latest-linux.yml + YourApp.AppImage

## GitHub provider (private repo friendly)

1. electron-builder.json5 publish

```json5
{
    // ...existing config
    publish: [{ provider: 'github', owner: 'YOUR_OWNER', repo: 'YOUR_REPO' }],
}
```

2. Build and publish

-   CI (recommended): inject GH_TOKEN/GITHUB_TOKEN from secrets.
-   Local (one-off):

```powershell
$env:GH_TOKEN = "<your_token_with_repo_scope>"
pnpm exec electron-builder --win --publish always
```

3. App code (prompt before download and before install)

```ts
// electron/main.ts
import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

app.whenReady().then(() => {
    // If repo is private and clients must authenticate
    const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
    if (token) {
        autoUpdater.requestHeaders = { Authorization: `token ${token}` };
    }

    // Ask before downloading
    autoUpdater.autoDownload = false;

    autoUpdater.on('update-available', async () => {
        const { response } = await dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version is available. Download now?',
            buttons: ['Download', 'Later'],
            defaultId: 0,
            cancelId: 1,
        });
        if (response === 0) autoUpdater.downloadUpdate();
    });

    autoUpdater.on('update-downloaded', async () => {
        const { response } = await dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'The update was downloaded. Restart now to install?',
            buttons: ['Restart now', 'Later'],
            defaultId: 0,
            cancelId: 1,
        });
        if (response === 0) autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdates();
});
```

Notes

-   Never hardcode tokens.
    Use CI secrets for publishing and environment variables for controlled client environments.
-   For external distribution, prefer Generic/S3 instead of private GitHub to avoid client auth.

## Generic provider (host on your server)

1. electron-builder.json5 publish

```json5
{
    // ...existing config
    publish: [{ provider: 'generic', url: 'https://updates.example.com/your-app/win' }],
}
```

2. Build without publishing

```bash
pnpm exec electron-builder --win --publish never
```

Upload to your server (same directory):

-   release/<version>/YourApp-Windows-<version>-Setup.exe
-   release/<version>/latest.yml

Example upload:

```bash
scp "release/1.0.0/YourApp-Windows-1.0.0-Setup.exe" "release/1.0.0/latest.yml" user@server:/var/www/updates/your-app/win/
```

Example Nginx:

```nginx
server {
  listen 443 ssl;
  server_name updates.example.com;

  root /var/www/updates;
  location / {
    autoindex off;
    add_header Cache-Control "no-store";
  }
}
```

3. App code (prompt flow)

```ts
import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

app.whenReady().then(() => {
    autoUpdater.autoDownload = false;

    autoUpdater.on('update-available', async () => {
        const { response } = await dialog.showMessageBox({
            type: 'info',
            message: 'Update available. Download now?',
            buttons: ['Download', 'Later'],
            defaultId: 0,
            cancelId: 1,
        });
        if (response === 0) autoUpdater.downloadUpdate();
    });

    autoUpdater.on('update-downloaded', async () => {
        const { response } = await dialog.showMessageBox({
            type: 'info',
            message: 'Update downloaded. Restart to install?',
            buttons: ['Restart now', 'Later'],
            defaultId: 0,
            cancelId: 1,
        });
        if (response === 0) autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdates();
});
```

## Platform notes

-   Windows/macOS code signing improves trust and enables smoother updates; macOS often requires notarization.
-   Use HTTPS for Generic hosting; avoid auth for public distribution. If auth is required, prefer short‑lived tokens or signed URLs.
-   macOS auto-update uses the generated ZIP, not the DMG.
-   You can publish per-platform under different subpaths (e.g., /win, /mac, /linux).

## Quick checklist

-   [ ] Add a publish provider to electron-builder.json5
-   [ ] Decide prompt strategy (auto vs ask)
-   [ ] Add updater code to electron/main.ts
-   [ ] Build and upload or enable CI publish
-   [ ] Verify latest\*.yml is reachable from your configured URL
