# 🔐 Security Guidelines

## Environment Variables

This project uses environment variables to protect sensitive credentials. 

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual credentials in `.env`:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Never commit `.env` to git**
   - The `.env` file is already included in `.gitignore`
   - Only commit `.env.example` as a template

### Security Best Practices

- ✅ **Environment variables** are used for all sensitive data
- ✅ **`.env` is gitignored** - credentials won't be committed
- ✅ **Error handling** for missing environment variables
- ✅ **Anon key only** - no service keys in frontend code
- ✅ **Row Level Security** enabled on all tables

### Environment Variables Reference

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_DB_URL` | Database connection (scripts only) | ❌ |

### Production Deployment

For production:
1. Set environment variables in your hosting platform
2. Use different keys for production vs development
3. Enable additional Row Level Security policies
4. Consider using Supabase Edge Functions for sensitive operations

### ⚠️ Important Notes

- The **anon key** is safe for frontend use
- Never expose **service role keys** in frontend code
- Database operations are protected by **Row Level Security**
- All sensitive data stays server-side
