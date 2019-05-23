const {generateNamespace} = require("@gql2ts/from-schema");
const fs = require('fs');
const path = require('path');
const genSchema = require('./genSchema.js');

const typescriptTypes = generateNamespace("GQL", genSchema());

fs.writeFile(
  path.join(__dirname, "../src/types/schema.d.ts"),
  typescriptTypes,
  err => {
    console.log(err);
  }
);
