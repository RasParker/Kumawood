#!/bin/bash

echo "🌱 AfriShorts Database Seeding Script"
echo "======================================"
echo ""
echo "This will populate your Supabase database with:"
echo "  • 35+ series (Popular, New, Rankings, Kumawood, Naija)"
echo "  • Hundreds of episodes with pricing"
echo "  • 4 coming-soon series"
echo "  • Demo user (demo-user-id)"
echo "  • Sample following, history, and reminders"
echo ""
echo "⚠️  Make sure you have run ALL migrations first!"
echo "   (001, 002, 003, 004 in Supabase SQL Editor)"
echo ""

npx tsx server/seed.ts
