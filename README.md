#Auth Server

### Local SetUp
1. `git clone` the repo locally
2. `npm install` to download the dependencies
3. Create a `.env` file and put following environment variables
  ````
  DATABASE_URL="mongodb://127.0.0.1:27017/auth-db"
  JWT_SECRET="thisissomerandomsecret"
  ````
4. Run `npm run dev` to start the server 
