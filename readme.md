# User Creation Utility

This node.js script will create test users in an Auth0 database connection for purposes such as load testing.

# Pre-requisites

1. M2M application created in your tenant and authorized for the Management API with `create:users` scope.
2. A connection to import test users to. Application from step 1 must have this application enabled for user creation.
3. Create `.env` file from sample file with `cp .env.sample .env`. Enter desired config values in .env.
4. Run `npm install`

# Creating users with script.

Run `npm start`
