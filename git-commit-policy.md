# Git Commit Policy & Development Guidelines

## 📝 Commit Message Standards

### Format
```
<type>: <description>

[optional body]

[optional footer]
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies, build configs

### Examples
```bash
# ✅ Good commit messages
feat: Add user authentication with JWT
fix: Resolve invoice calculation error in dashboard
docs: Update API documentation for new endpoints
refactor: Simplify invoice validation logic
style: Format code according to prettier rules

# ❌ Bad commit messages
updated stuff
fixed bug
wip
changes
```

### Rules
1. **Use present tense** ("Add" not "Added")
2. **Use imperative mood** ("Move" not "Moves")
3. **First line under 50 characters**
4. **Description starts with lowercase**
5. **No period at the end**

## 🌿 Branching Strategy

### Main Branches
- **`main`**: Production-ready code
- **`backend`**: Backend development branch
- **`frontend`**: Frontend development branch

### Feature Branches
```
feature/user-authentication
feature/invoice-calculator
bugfix/dashboard-crash
hotfix/security-vulnerability
```

### Branch Naming Convention
- **Feature**: `feature/descriptive-name`
- **Bug Fix**: `bugfix/issue-description`
- **Hotfix**: `hotfix/critical-fix`
- **Release**: `release/version-number`

## 🔄 Development Workflow

### 1. Starting New Work
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Making Changes
```bash
# Make your changes
# Stage files
git add .

# Commit with proper message
git commit -m "feat: Add new invoice validation logic"

# Push to remote
git push origin feature/your-feature-name
```

### 3. Merging Work
```bash
# Switch to target branch (backend/frontend)
git checkout backend

# Merge feature branch
git merge feature/your-feature-name

# Push changes
git push origin backend
```

### 4. Updating Main
```bash
# Switch to main
git checkout main

# Merge backend and frontend
git merge backend
git merge frontend

# Push to main
git push origin main
```

## 📁 File Organization

### Backend Branch
- `backend/src/` - Java source code
- `backend/pom.xml` - Maven configuration
- `backend/src/main/resources/` - Configuration files
- `backend/env.example` - Environment variables template

### Frontend Branch
- `frontend/src/` - React source code
- `frontend/package.json` - Node.js dependencies
- `frontend/tsconfig*.json` - TypeScript configuration
- `frontend/vite.config.ts` - Build configuration

### Root Directory
- `README.md` - Project documentation
- `.gitignore` - Global ignore rules
- `git-commit-policy.md` - This file

## 🚫 What NOT to Commit

### Never Commit
- `node_modules/` directories
- `dist/` or `build/` directories
- `.env` files with secrets
- IDE configuration files (`.vscode/`, `.idea/`)
- Log files
- Temporary files
- Large binary files

### Always Ignore
```gitignore
# Dependencies
node_modules/
*.jar
*.war

# Build outputs
dist/
build/
target/

# Environment files
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
```

## 🔍 Code Review Process

### Before Committing
1. **Self-review** your changes
2. **Test** your code locally
3. **Check** for sensitive information
4. **Verify** commit message follows standards

### Pull Request Guidelines
1. **Clear title** describing the change
2. **Detailed description** of what was changed and why
3. **Screenshots** for UI changes
4. **Test instructions** for reviewers
5. **Linked issues** if applicable

## 🚨 Emergency Procedures

### Hotfix Process
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Make urgent fix
git commit -m "fix: Resolve critical security vulnerability"

# Merge to main and release branches
git checkout main
git merge hotfix/critical-issue
git push origin main
```

### Rollback Process
```bash
# Revert last commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin <branch-name> --force
```

## 📚 Best Practices

### Daily Workflow
1. **Start day**: `git pull origin main`
2. **Create branch**: For each feature/fix
3. **Commit often**: Small, logical commits
4. **Push regularly**: Keep remote updated
5. **End day**: Clean up local branches

### Commit Frequency
- **Small commits**: Better for code review
- **Logical units**: Each commit should make sense independently
- **Regular pushes**: Don't let local work accumulate

### Communication
- **Update team** on major changes
- **Document** complex features
- **Ask questions** if unsure about approach
- **Share knowledge** through code reviews

## 🔧 Tools & Automation

### Pre-commit Hooks
Consider setting up:
- **Husky**: Git hooks for Node.js
- **Prettier**: Code formatting
- **ESLint**: Code quality checks
- **Commitlint**: Commit message validation

### IDE Integration
- **VS Code**: GitLens, Git History
- **IntelliJ**: Built-in Git tools
- **GitKraken**: Visual Git client

## 📞 Getting Help

### When to Ask
- **Unclear requirements**
- **Git conflicts** you can't resolve
- **Build/deployment issues**
- **Code review questions**

### Resources
- **Team members**: Pair programming
- **Documentation**: README, API docs
- **Git documentation**: Official guides
- **Stack Overflow**: Common issues

---

## 📋 Quick Reference

### Commit Message Template
```
<type>: <description>

- What was changed?
- Why was it changed?
- Any breaking changes?

Closes #<issue-number>
```

### Common Commands
```bash
# Check status
git status

# View commit history
git log --oneline

# View branch structure
git branch -vv

# Stash changes
git stash

# View remote info
git remote -v
```

### Remember
- **Commit often, push regularly**
- **Write clear commit messages**
- **Follow the branching strategy**
- **Ask for help when needed**
- **Keep main branch stable**

---

*Last updated: August 27, 2024*
*Maintained by: Development Team*
