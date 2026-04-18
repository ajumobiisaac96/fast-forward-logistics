# Deployment Guide - Vercel

## What's Been Changed
✅ Created `/api/submit-feedback.js` - Serverless function for email submissions
✅ Updated `forms.js` - Uses relative path `/api/submit-feedback`
✅ Created `vercel.json` - Vercel configuration
✅ Created `.env.example` - Environment variables template

## Step-by-Step Deployment Instructions

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Fast-Forward Feedback System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Authorize Vercel to access your GitHub account

### 3. Import Project to Vercel
1. Click "New Project"
2. Select your GitHub repository `fast-forward-feedback`
3. Click "Import"
4. **Important:** In the Build Settings, use default settings (Vercel auto-detects)

### 4. Set Environment Variables in Vercel

**In Vercel Dashboard:**
1. Go to your project settings → Environment Variables
2. Add these variables:

```
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-gmail-app-password
```

**To get Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows"
4. Generate and copy the 16-character password
5. Paste it as `EMAIL_PASSWORD` in Vercel

### 5. Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your project
- Your app will be live at: `https://your-project-name.vercel.app`

### 6. Test on Vercel
1. Go to your deployed URL
2. Fill out the form
3. Click Submit
4. You should see the "Thank You" page and receive an email

## How It Works in Production

- **Frontend:** All HTML/CSS/JS files are served as static files
- **Backend:** `/api/submit-feedback.js` runs as a Vercel Serverless Function
- **Emails:** Nodemailer sends emails via Gmail App Password
- **API Endpoint:** `https://your-domain.vercel.app/api/submit-feedback`

## Troubleshooting

### "Email service ready" not showing
- Check that `EMAIL_USER` and `EMAIL_PASSWORD` are set in Vercel Environment Variables
- Make sure you're using an App Password, not your regular Gmail password

### 404 Errors on API Calls
- Vercel automatically detects `/api` folder
- Don't change the folder structure
- Use relative paths `/api/submit-feedback`

### CORS Errors
- Already handled in the API handler
- Vercel headers are configured in `vercel.json`

## Local Testing Before Deployment

To test locally before deploying:

```bash
npm install
# Add .env file with EMAIL_USER and EMAIL_PASSWORD
npm start
```

Visit `http://localhost:3000` and test the form submission.

## Monitoring

In Vercel Dashboard, you can:
- View logs: Settings → Functions → View Logs
- Monitor usage: Usage tab
- Check error messages in real-time

## Next Steps

Once deployed, you can:
- Add a custom domain (Domain section)
- Set up monitoring and alerts
- Scale and optimize as needed
