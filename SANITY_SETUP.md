# Sanity CMS Setup Instructions

## 1. Get your Sanity Project ID

1.  Go to [https://www.sanity.io/manage](https://www.sanity.io/manage) and log in.
2.  Click on "Create new project" (or select an existing one).
3.  Once created, you will see your **Project ID** on the dashboard. It looks like `7123abcd`.
4.  Your **Dataset** is usually named `production` by default.

## 2. Update Environment Variables

Open the file `.env.local` in your project root and update the following lines with your actual values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## 3. Add CORS Origin (Important!)

For your Next.js app to be able to fetch data from Sanity, you must add `http://localhost:3000` to your Sanity project's API settings.

1.  In your Sanity project dashboard, go to the **API** tab.
2.  Scroll down to **CORS Origins**.
3.  Click **Add CORS origin**.
4.  Enter `http://localhost:3000` and check **Allow credentials**.
5.  Click **Save**.

## 4. Run the Studio

Navigate to `http://localhost:3000/studio` in your browser. You should now be able to log in and create 'Event' documents.

## 5. View Events

Once you have created and **Published** some events in the Studio, go to `http://localhost:3000/events` or the home page to see them dynamically displayed!
