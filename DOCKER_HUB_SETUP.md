# Docker Hub Secure Authentication Setup

## ✅ Correct Method: Using Docker Hub Access Token

### Why Access Token, NOT Password?
- ✅ Access tokens can be revoked anytime
- ✅ More secure than storing your account password
- ✅ Can set expiration dates
- ✅ Can limit permissions

---

## Step 1: Get Your Docker Hub Access Token

### 1.1 Go to Docker Hub
- Navigate to: https://hub.docker.com/settings/security
- Or go to: **Account Settings** → **Security** → **Access Tokens**

### 1.2 Create New Access Token
- Click **Generate New Token**
- Token Name: `Jenkins CI/CD`
- Access Permissions: `Read & Write`
- Click **Generate**

### 1.3 Copy Your Token
You'll get something like:
```
dckr_pat_XXXXXXXXXXXXXXXXXXXXX
```

**⚠️ SAVE THIS! You won't see it again!**
Replace `XXXXXXXXXXXXXXXXXXXXX` with your actual token.

---

## Step 2: Create Jenkins Credential (CORRECT WAY)

### 2.1 Go to Jenkins
- Open: http://localhost:8080
- Click **Manage Jenkins** (top left)
- Click **Credentials**
- Click **System** (left sidebar)
- Click **Global credentials (unrestricted)**

### 2.2 Add Credential
- Click **+ Add Credentials** (top left)
- Fill in:

| Field | Value |
|-------|-------|
| **Kind** | `Username with password` |
| **Username** | `thiwanka14535` |
| **Password** | `dckr_pat_XXXXXXXXXXXXXXXXXXXXX` (your access token) |
| **ID** | `dockerhub` |
| **Description** | Docker Hub Access Token |

- Click **Create**

**Done!** Jenkins now has your secure credential stored.

---

## Step 3: Jenkinsfile Uses Credential Securely

### How It Works

**Your Jenkinsfile now uses:**
```groovy
stage('Push to Docker Hub') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                docker push $DOCKER_USER/soundplus-backend:latest
                docker push $DOCKER_USER/soundplus-frontend:latest
            '''
        }
    }
}
```

### What This Does
1. `withCredentials()` - Jenkins loads the credential securely
2. `credentialsId: 'dockerhub'` - Tells Jenkins which credential to use
3. `usernameVariable: 'DOCKER_USER'` - Username stored in `$DOCKER_USER`
4. `passwordVariable: 'DOCKER_PASS'` - Token stored in `$DOCKER_PASS`
5. `sh '''...'''` - Runs the commands (token is masked in logs!)

### Security Features
✅ Token is **masked** in Jenkins console logs  
✅ Token is **never stored** in Jenkinsfile  
✅ Token is **encrypted** in Jenkins database  
✅ Only Jenkins can access it  

---

## Step 4: Test the Pipeline

### 4.1 Run Jenkins Build
1. Go to Jenkins Dashboard
2. Click **SoundPlus-CI-CD**
3. Click **Build Now**

### 4.2 Monitor Console Output
You should see:
```
[Pipeline] stage
[Pipeline] { (Push to Docker Hub)
[Pipeline] withCredentials
Masking supported pattern matches of $DOCKER_PASS or $DOCKER_USER
[Pipeline] {
...
echo "Logging in to Docker Hub..."
Logged in as thiwanka14535
...
✓ Backend image pushed successfully
✓ Frontend image pushed successfully
✓ Push to Docker Hub completed
```

### 4.3 Verify on Docker Hub
- Go to: https://hub.docker.com/repositories
- You should see:
  - `thiwanka14535/soundplus-backend:latest`
  - `thiwanka14535/soundplus-frontend:latest`

---

## ❌ NEVER DO THIS

### ❌ DO NOT hardcode credentials
```groovy
// ❌ WRONG - Credentials in Jenkinsfile!
DOCKER_USERNAME = 'thiwanka14535'
DOCKER_PASSWORD = 'dckr_pat_XXXXXXXXXXXXXXXXXXXXX'
```

### ❌ DO NOT use plain docker login
```bash
# ❌ WRONG - Password visible in logs!
docker login -u thiwanka14535 -p dckr_pat_XXXXXXXXXXXXXXXXXXXXX
```

### ❌ DO NOT commit credentials to GitHub
```bash
# ❌ WRONG - Anyone can see your token!
git add .env
git commit -m "add credentials"
git push
```

---

## ✅ CORRECT METHOD (What We're Using Now)

### ✅ Store in Jenkins Credentials Manager
- Encrypted storage ✓
- Automatic masking in logs ✓
- Easy to rotate ✓
- Separate from code ✓

### ✅ Reference by ID Only
```groovy
withCredentials([usernamePassword(credentialsId: 'dockerhub', ...)]) {
    // Jenkins loads and injects credentials securely
}
```

### ✅ Use withCredentials Block
- Automatically masks passwords in logs
- Automatically cleans up variables
- Best security practice

---

## Troubleshooting

### Issue: "ERROR: dockerhub"
**Cause:** Credential ID doesn't exist in Jenkins  
**Solution:** 
1. Go to Jenkins → Credentials
2. Verify credential with ID `dockerhub` exists
3. Check it has correct username and token

### Issue: "Unauthorized: incorrect username or password"
**Cause:** Wrong token or username  
**Solution:**
1. Go to Docker Hub → Settings → Security
2. Verify your access token hasn't expired
3. Create a new token and update Jenkins credential

### Issue: Token appears in logs
**Cause:** Not using `withCredentials` block properly  
**Solution:** Verify Jenkinsfile has `withCredentials()` wrapping the login step

---

## Summary

| What | Where | How | Secure? |
|------|-------|-----|---------|
| Username | Jenkins Credentials | Stored safely | ✅ |
| Access Token | Jenkins Credentials | Encrypted | ✅ |
| Jenkinsfile | GitHub | References ID only | ✅ |
| Docker Login | Jenkins | withCredentials() | ✅ |
| Console Logs | Jenkins | Masked automatically | ✅ |

---

## Quick Reference

```bash
# To manually test Docker Hub login (for debugging only)
docker login -u thiwanka14535
# Then enter your access token when prompted

# To check what's in your .docker/config.json
cat ~/.docker/config.json

# To logout
docker logout
```

---

**Last Updated:** November 11, 2025  
**Jenkinsfile Commit:** 5e72db3  
**Status:** ✅ Secure credential setup complete
