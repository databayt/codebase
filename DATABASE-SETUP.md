# Database Setup Instructions

## Issue
The application requires PostgreSQL to be running at `localhost:5432`, but it's currently not available.

## Quick Solutions

### Option 1: Install PostgreSQL (Recommended for Production-like Environment)

#### Windows Installation:
1. Download PostgreSQL installer from: https://www.postgresql.org/download/windows/
2. Run the installer and follow these steps:
   - Set password for postgres user (use: `postgres` to match our config)
   - Keep default port: `5432`
   - Install PostgreSQL service
3. After installation, PostgreSQL should start automatically
4. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE \"codebase-underway\";"
   ```

#### Alternative: Using Docker (Easier setup)
If you have Docker installed:
```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=codebase-underway -p 5432:5432 -d postgres:15
```

### Option 2: Use Cloud Database (Easiest, No Installation)

1. Sign up for a free PostgreSQL database at:
   - Supabase: https://supabase.com (free tier available)
   - Neon: https://neon.tech (free tier available)
   - Railway: https://railway.app (free tier available)

2. After creating a database, replace the DATABASE_URL in `.env.local` with the provided connection string.

Example Supabase URL:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Option 3: Mock the Database (For Testing Only)

For testing the UI without a real database, we can modify the actions to use in-memory data:

1. The code already has auth bypass enabled
2. We can add a mock data layer

## After Database Setup

Once PostgreSQL is running, run these commands:

```bash
# Generate Prisma client
pnpm prisma generate

# Push the schema to create tables
pnpm prisma db push

# (Optional) Seed with test data
pnpm prisma db seed
```

## Current Status

- **Auth Bypass**: Already enabled (using test user ID: `cmfo808py0000ix1ke1o3uzsv`)
- **Console Logging**: Extensive logging added to track operations
- **Lead Import**: Functionality ready, just needs database connection

## Testing

After setting up the database:

1. Navigate to: http://localhost:3004/en/test-import
2. Click "Create Test Lead" to verify database connection
3. Use the import features at http://localhost:3004/en/leads

## Troubleshooting

If you see the error:
```
Can't reach database server at localhost:5432
```

Check:
1. Is PostgreSQL service running? (Windows: Check Services app)
2. Is port 5432 available? (Check with `netstat -an | findstr :5432`)
3. Are credentials correct in `.env.local`?
4. Try connecting manually: `psql -U postgres -h localhost -p 5432`