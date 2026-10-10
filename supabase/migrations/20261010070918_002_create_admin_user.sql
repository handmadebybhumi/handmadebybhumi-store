/*
# Initial admin user (superseded by migration 006)

## Purpose
This migration originally created a placeholder admin user with email
admin@handmadebybhumi.com and a hardcoded password. That approach exposed
credentials in source code.

## Superseded
Migration 006_replace_admin_with_magic_link_owner deletes that placeholder
user and switches to passwordless magic-link auth for the real store owner
(handmadebybhumi@gmail.com). No password is stored or referenced anywhere.

## This file is kept for migration history only.
No credentials are stored here. The admin account is now managed entirely
through Supabase Auth magic-link sign-in and the admin_profiles table.
*/
