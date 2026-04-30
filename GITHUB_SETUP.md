# GitHub Publishing Guide
## ChatAI Dashboard — SomeGuru/chatai-dashboard

Complete step-by-step instructions to publish the project and make releases.

---

## PART 1 — First-Time Setup (Do Once)

### Step 1: Install Git (if not already installed)

**Windows:**
1. Go to https://git-scm.com/download/win
2. Download and run the installer (all defaults are fine)
3. Open a new terminal/Command Prompt after install

**Linux:**
```bash
sudo apt install git    # Ubuntu/Debian
sudo dnf install git    # Fedora
```

Verify: `git --version`

---

### Step 2: Configure Git with your identity

Open Terminal (or Git Bash on Windows) and run:

```bash
git config --global user.name "SomeGuru"
git config --global user.email "your-email@example.com"
```

Replace the email with the one your GitHub account uses.

---

### Step 3: Create the GitHub repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `chatai-dashboard`
   - **Description:** `Your gateway to every major AI model — a professional Electron desktop app`
   - **Visibility:** Public
   - **DO NOT** check "Add a README" or "Add .gitignore" (we already have these)
3. Click **Create repository**
4. GitHub will show you a page with setup commands — **leave this tab open**

---

### Step 4: Initialize and push the project

Navigate to your project folder in Terminal:

```bash
# Windows example (adjust path to where you extracted the zip):
cd C:\Users\YourName\Downloads\chatai-dashboard

# Linux example:
cd ~/Downloads/chatai-dashboard
```

Now run these commands one at a time:

```bash
# Initialize git repo
git init

# Stage all files
git add .

# First commit
git commit -m "Initial release: ChatAI Dashboard v2.2.0"

# Point to your GitHub repo
git remote add origin https://github.com/SomeGuru/chatai-dashboard.git

# Set main branch name
git branch -M main

# Push to GitHub
git push -u origin main
```

When it asks for credentials:
- **Username:** SomeGuru
- **Password:** Use a GitHub Personal Access Token (NOT your account password)
  - Go to https://github.com/settings/tokens/new
  - Name: `chatai-dashboard-push`
  - Expiration: 90 days (or No expiration)
  - Scopes: check **repo** (full control of private repositories)
  - Click Generate — copy the token immediately (you won't see it again)
  - Paste it as your password

---

### Step 5: Create your first release tag

```bash
# Tag the current commit as v2.2.0
git tag -a v2.2.0 -m "ChatAI Dashboard v2.2.0 — Credential Vault Autofill"

# Push the tag to GitHub
git push origin v2.2.0
```

This triggers the GitHub Actions workflow automatically. Go to:
`https://github.com/SomeGuru/chatai-dashboard/actions`

You'll see the build running. It takes ~5-10 minutes to build both Windows and Linux.
When it finishes, the release appears at:
`https://github.com/SomeGuru/chatai-dashboard/releases`

---

## PART 2 — Making Future Releases

### Workflow for every new version

```bash
# 1. Make your changes to the files

# 2. Check what changed
git status

# 3. Stage everything
git add .

# 4. Commit with a message
git commit -m "v2.3.0 — Add [brief description of changes]"

# 5. Update version in package.json (edit the file, change "version": "2.2.0" to "2.3.0")
# Then stage and amend, or just do another commit:
git add package.json
git commit -m "Bump version to 2.3.0"

# 6. Push to GitHub
git push

# 7. Tag the release
git tag -a v2.3.0 -m "ChatAI Dashboard v2.3.0 — [description]"
git push origin v2.3.0
```

GitHub Actions builds and publishes automatically.

---

## PART 3 — Adding Release Notes

When GitHub Actions creates the release, it auto-generates notes from your commit messages. To add your own notes:

1. Go to https://github.com/SomeGuru/chatai-dashboard/releases
2. Click the pencil (edit) icon on the release
3. Add your release notes in Markdown format
4. Click **Update release**

These notes are what users see in the in-app update panel.

---

## PART 4 — Troubleshooting

### "Authentication failed" when pushing
- Make sure you're using a Personal Access Token, not your password
- Create a new token at https://github.com/settings/tokens

### "src refspec main does not match any" error
```bash
git branch -M main
git push -u origin main
```

### GitHub Actions build fails on Windows
- Check the Actions log at https://github.com/SomeGuru/chatai-dashboard/actions
- Most common cause: missing `npm ci` cache — the workflow handles this automatically

### SmartScreen warning on Windows installer
This is expected until the app is code-signed. Users click:
"More info" → "Run anyway"
To remove this warning permanently, you'd need a code signing certificate (~$70-200/year from Sectigo or DigiCert).

### AppImage won't run on Linux
```bash
chmod +x ChatAI-Dashboard-*.AppImage
./ChatAI-Dashboard-*.AppImage --no-sandbox
```

---

## PART 5 — Repo Settings (Recommended)

After pushing, set these up on GitHub:

1. **Description & topics:**
   - Go to your repo → click the gear ⚙ next to "About"
   - Description: `Your gateway to every major AI model — Electron desktop app`
   - Topics: `electron`, `ai`, `chatgpt`, `claude`, `gemini`, `desktop-app`, `nodejs`
   - Website: `https://www.thelarios.com`

2. **Social preview image:**
   - Settings → General → Social preview
   - Upload the ChatAI_Logo.jpg or a banner screenshot

3. **Enable Discussions** (optional):
   - Settings → Features → check Discussions
   - Good for user feedback and questions

---

## Quick Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage all | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push` |
| Create tag | `git tag -a v2.3.0 -m "description"` |
| Push tag | `git push origin v2.3.0` |
| View tags | `git tag -l` |
| View log | `git log --oneline` |
| Pull latest | `git pull` |
