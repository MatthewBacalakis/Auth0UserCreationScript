// CLIENT_ID=CLIENT_ID of an application authorized for the mgmt api and the create:users scope
// CLIENT_SECRET=CLIENT_SECRET of same app
// AUTH0_DOMAIN=DOMAIN of your default tenant
// AUTH0_DB_CONN_NAME=Name of connection to create users in
// USERS_COUNT= Number of users to create, recommend 1000

require("dotenv").config();
const ManagementClient = require("auth0").ManagementClient;
const userCount = process.env.USERS_COUNT || 500;

async function generateUsers() {
  const managementClient = new ManagementClient({
    domain: `${process.env.AUTH0_DOMAIN}`,
    clientId: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.CLIENT_SECRET}`,
  });

  const users = [];
  for (let i = 1; i <= userCount; i++) {
    i.toString();
    users.push({
      email: `test${i}@example.com`,
      username: `test${i}`,
      password: `${i}Pa!0000`,
    });
  }

  console.log("username:", process.env.USERNAME_ENABLED);

  let bulk = [];
  for (const user of users) {
    bulk.push(
      managementClient
        .createUser({
          email: user.email,
          password: user.password,
          connection:
            process.env.AUTH0_DB_CONN_NAME ||
            "Username-Password-Authentication",
          ...(process.env.USERNAME_ENABLED.toLowerCase() === "true" && {
            username: user.username,
          }),
        })
        // eslint-disable-next-line promise/always-return
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          if (error.statusCode && error.statusCode === 409) {
            console.log(`${user.email} already exists`);
            return;
          }
          console.log(error);
        })
    );

    if (bulk.length > 20) {
      await Promise.all(bulk);
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
      bulk = [];
    }
  }

  await Promise.all(bulk);
}

generateUsers();

module.exports = { generateUsers };
