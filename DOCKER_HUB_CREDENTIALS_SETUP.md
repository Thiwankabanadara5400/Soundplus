# 🐋 Docker Hub Login - Jenkins Credentials Setup

## The Problem ❌

Jenkins pipeline fails at "Push to Docker Hub" stage:
```
Error: Username and password required
```

**Reason**: Jenkins doesn't have Docker Hub credentials stored.

---

## The Solution ✅

You need to add Docker Hub credentials to Jenkins.

### Step 1: Get Your Docker Hub Credentials

You need:
- ✅ Docker Hub username: `thiwanka14535`
- ✅ Docker Hub password: (your password)
- ✅ Or Personal Access Token (recommended)

**Note**: It's better to use a **Personal Access Token** than your main password.

#### Option A: Using Personal Access Token (Recommended)

1. Go to: https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name it: `Jenkins`
4. Permissions: Select "Read & Write" (for pushing images)
5. Create and copy the token
6. Use this token as password in Jenkins

#### Option B: Using Main Password

Use your Docker Hub account password directly (less secure).

---

### Step 2: Add Credentials to Jenkins

1. **Open Jenkins**
   - URL: `http://your-jenkins-server:8080/`
   - Or: `http://localhost:8080/` (if local)

2. **Navigate to Credentials**
   - Click "Manage Jenkins" (gear icon)
   - Click "Credentials"
   - Click "System"
   - Click "Global credentials (unrestricted)"

3. **Add New Credentials**
   - Click "Add Credentials" button (top left)
   - Fill in the form:

     ```
     Kind: Username with password
     
     Username: thiwanka14535
     Password: [your-password-or-token]
     ID: dockerhub  ← ⚠️ IMPORTANT: Must be "dockerhub"
     Description: Docker Hub credentials
     ```

4. **Save**
   - Click "Create"
   - Should now show in credentials list

---

### Step 3: Verify Credentials are Saved

1. Go back to: Jenkins > Credentials > System > Global credentials
2. You should see: `dockerhub` in the list
3. Credentials are now ready for use

---

### Step 4: Run Jenkins Pipeline Again

1. Go to: `SoundPlus++` job in Jenkins
2. Click: "Build Now"
3. Pipeline should now:
   - ✅ Checkout code
   - ✅ Build images
   - ✅ Start services
   - ✅ **Login to Docker Hub** (NOW WORKS!)
   - ✅ Push images to Docker Hub
   - ✅ Deploy application

---

## What Each Stage Does

```
✅ Checkout SCM - Gets code from GitHub
✅ Checkout - Workspace setup
✅ Pre-flight Check - Validates Docker
✅ Setup Environment - Creates .env files
✅ Build Images - Docker build (fixed ✅)
✅ Start Services - docker-compose up (fixed ✅)
✅ Verify Services - Test endpoints
✅ Run Tests - Test suite
👉 Push to Docker Hub - Needs credentials (requires setup)
✅ Deploy - Deploy application
✅ Post Actions - Cleanup
```

---

## If You Don't See "dockerhub" Credentials

### Issue: Credentials not appearing

**Solution**:
1. Go to: Jenkins > Manage Jenkins > Security
2. Look for: "Credentials Provider"
3. Make sure Jenkins is enabled for credentials storage
4. Try creating credentials again

---

## Alternative: Disable Docker Hub Push (Temporary)

If you don't have Docker Hub credentials yet, you can temporarily skip the push step:

In `Jenkinsfile`, change:
```groovy
stage('Push to Docker Hub') {
    when {
        branch 'main'
    }
    steps {
        echo '✓ Skipping Docker Hub push (credentials not configured)'
    }
}
```

Then add credentials later and re-enable.

---

## Docker Hub Token vs Password

### Using Personal Access Token (Recommended ⭐)

**Advantages**:
- ✅ More secure (not your main password)
- ✅ Can be revoked without changing password
- ✅ Can set granular permissions
- ✅ Recommended by Docker

**Steps**:
1. Go: https://hub.docker.com/settings/security
2. Click: "New Access Token"
3. Fill: Name = "Jenkins"
4. Select: Permissions = "Read & Write"
5. Copy: The token shown
6. Use in Jenkins credentials

### Using Main Password (Not Recommended ⚠️)

**Disadvantages**:
- ⚠️ Your main account password
- ⚠️ If compromised, whole account at risk
- ⚠️ Can't revoke just this use case

**Only use if you don't have access token option**.

---

## Verify Push is Working

After setup, look in Jenkins console output for:

```
[Push to Docker Hub]
Logging in to Docker Hub...
WARNING! Your password will be stored unencrypted in /home/jenkins/.docker/config.json.

Tagging and pushing backend image...
soundplus-backend:latest: digest: sha256:abc123...
✓ Backend image pushed successfully

Tagging and pushing frontend image...
soundplus-frontend:latest: digest: sha256:xyz789...
✓ Frontend image pushed successfully
```

If you see this, ✅ push is working!

---

## Check Images on Docker Hub

1. Go to: https://hub.docker.com/r/thiwanka14535/
2. You should see:
   - `soundplus-backend` (with `latest` and `build-number` tags)
   - `soundplus-frontend` (with `latest` and `build-number` tags)

If images appear, ✅ push was successful!

---

## Troubleshooting

### Issue: "Authentication failed"
**Cause**: Wrong credentials  
**Fix**: Double-check username and password/token

### Issue: "No such image"
**Cause**: Build stage failed  
**Fix**: Check "Build Images" stage logs

### Issue: "Invalid credentials format"
**Cause**: Credentials ID not `dockerhub`  
**Fix**: Make sure ID is exactly `dockerhub`

### Issue: Still getting "Username and password required"
**Cause**: Jenkins not reading credentials  
**Fix**: 
1. Delete old credentials
2. Create new ones
3. Double-check ID is `dockerhub`
4. Restart Jenkins if needed

---

## Quick Reference

### What Jenkins Expects

```groovy
withCredentials([usernamePassword(
    credentialsId: 'dockerhub',  ← Must match this exactly
    usernameVariable: 'DOCKER_USER',
    passwordVariable: 'DOCKER_PASS'
)]) {
    // Use $DOCKER_USER and $DOCKER_PASS
}
```

### What to Configure in Jenkins

```
Credentials ID: dockerhub
Username: thiwanka14535
Password: [your-token-or-password]
```

### Jenkins GUI Path

```
Jenkins > Manage Jenkins > Credentials > System > Global credentials
> Add Credentials > Username with password
```

---

## Summary

| Step | Action | Status |
|------|--------|--------|
| 1 | Get Docker Hub token | ⏳ Do this |
| 2 | Add to Jenkins credentials | ⏳ Do this |
| 3 | Use ID `dockerhub` | ⚠️ Important |
| 4 | Run Jenkins "Build Now" | ⏳ After step 2 |
| 5 | Check push successful | ✅ Will see in logs |

---

## After Setup

Your pipeline will:

1. ✅ Build Docker images locally
2. ✅ Start containers to test
3. ✅ Run tests
4. ✅ **Login to Docker Hub** (NOW WORKS!)
5. ✅ Tag images with version
6. ✅ Push to Docker Hub
7. ✅ Deploy application

**Full end-to-end automation! 🚀**

---

## Next Steps

1. **Create Docker Hub Personal Access Token** (5 min)
2. **Add to Jenkins credentials** (2 min)
3. **Run Jenkins pipeline** (15 min)
4. **Verify images on Docker Hub** (1 min)

**Total: ~25 minutes** ⏱️

---

Need help? Check the steps above or ask questions! 🎯
