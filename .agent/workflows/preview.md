---
description: Preview server start, stop, and status check. Local development server management. Adapts to project domain.
---

# /preview - Preview Management

$ARGUMENTS

---

## Task

Manage preview/development server: start, stop, status check.
Automatically detects the project type and uses the correct dev server.

### Commands

```
/preview           - Show current status
/preview start     - Start server
/preview stop      - Stop server
/preview restart   - Restart
/preview check     - Health check
```

---

## Domain Adaptation

| Domain | Dev Server | Default Port | Start Command | Health Check |
|--------|-----------|-------------|---------------|-------------|
| next-web | Next.js dev | 3000 | `npm run dev` | `curl http://localhost:3000` |
| python-backend | uvicorn / gunicorn | 8000 | `uvicorn main:app --reload` | `curl http://localhost:8000/docs` |
| python-ml | Jupyter / uvicorn | 8888 / 8000 | `jupyter lab` or `uvicorn` | `curl http://localhost:8888` |
| python-data | Jupyter / Streamlit | 8888 / 8501 | `jupyter lab` or `streamlit run` | browser check |
| mobile-flutter | Flutter dev | — | `flutter run` | device/emulator |
| mobile-rn | Metro / Expo | 8081 / 19000 | `npx expo start` or `npm start` | Expo DevTools |
| electron-desktop | Electron dev | — | `npm run dev` | window opens |
| chrome-extension | Extension reload | — | `npm run dev` + load unpacked | chrome://extensions |
| cli-tool | — | — | `npm run dev` or `python main.py` | CLI output |
| csharp-backend | Kestrel | 5000 / 5001 | `dotnet run` or `dotnet watch` | `curl http://localhost:5000` |
| godot-game | Godot Editor | — | F5 in Editor | game window |
| unity-game | Unity Editor | — | Play button | game view |
| phaser-game | Vite dev | 5173 | `npm run dev` | `curl http://localhost:5173` |

---

## Usage Examples

### Web Project (next-web, phaser-game)
```
/preview start

Response:
Starting preview...
   Port: 3000
   Type: Next.js

Preview ready!
   URL: http://localhost:3000
```

### Python Backend
```
/preview start

Response:
Starting preview...
   Port: 8000
   Type: FastAPI (uvicorn)

Preview ready!
   URL: http://localhost:8000
   Docs: http://localhost:8000/docs
```

### Flutter
```
/preview start

Response:
Starting preview...
   Target: Chrome (web) / Pixel 7 (Android emulator)
   Type: Flutter

Preview ready!
   Hot reload active (press r to reload)
```

### C# Backend
```
/preview start

Response:
Starting preview...
   Port: 5000 (HTTP) / 5001 (HTTPS)
   Type: ASP.NET Core (Kestrel)

Preview ready!
   URL: https://localhost:5001
   Swagger: https://localhost:5001/swagger
```

### Port Conflict
```
/preview start

Response:
Port [port] is in use.

Options:
1. Start on next available port
2. Close app on [port]
3. Specify different port

Which one? (default: 1)
```

---

## Technical

Auto preview uses `auto_preview.py` script:

```bash
python .agent/scripts/auto_preview.py start [port]
python .agent/scripts/auto_preview.py stop
python .agent/scripts/auto_preview.py status
```

For non-web projects (Flutter, Godot, Unity), provide instructions
for the editor/IDE-based preview instead of starting a server.
