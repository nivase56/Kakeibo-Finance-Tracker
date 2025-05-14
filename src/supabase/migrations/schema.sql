-- Create tables for our Kakeibo app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL UNIQUE, -- Format: YYYY-MM
  total DECIMAL(10, 2) NOT NULL,
  needs DECIMAL(10, 2) NOT NULL,
  wants DECIMAL(10, 2) NOT NULL,
  culture DECIMAL(10, 2) NOT NULL,
  unexpected DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX expenses_date_idx ON expenses (date);
CREATE INDEX expenses_category_idx ON expenses (category);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON budgets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- File: .env.local.example
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# File: README.md
# Kakeibo Finance Tracker

A modern personal finance tracker based on the Japanese Kakeibo budgeting system. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Track Daily Expenses**: Log your spending with categories based on the Kakeibo method (Needs, Wants, Culture, Unexpected)
- **Budget Management**: Set and track monthly budgets for each category
- **Spending Insights**: Visualize your spending patterns with charts and statistics
- **Mobile Responsive**: Clean, modern UI that works on all devices
- **Persistent Storage**: All data is stored in a Supabase database

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Chart.js for visualizations

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and add your Supabase credentials
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser
