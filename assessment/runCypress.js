const cypress = require('cypress');
const fs = require('fs');
require('dotenv').config();
console.log(process.env.USER_LINK_SUBMISSION);

// Read the file content
const fileContent = fs.readFileSync('./cypress/e2e/spec.cy.js', 'utf8');

// Replace the first occurrence of the HTTP URL
let updatedContent = fileContent.replace(/http[^\"]+/, process.env.USER_LINK_SUBMISSION);

// Find and replace the last occurrence of the HTTP URL
const lastHttpIndex = updatedContent.lastIndexOf('http');
if (lastHttpIndex !== -1) {
  const beforeLastHttp = updatedContent.substring(0, lastHttpIndex);
  const lastHttpAndAfter = updatedContent.substring(lastHttpIndex);
  const afterLastHttp = lastHttpAndAfter.replace(/http[^\"]+/, process.env.USER_LINK_SUBMISSION);
  updatedContent = beforeLastHttp + afterLastHttp;
}

// Write the updated content back to the file
fs.writeFileSync('./cypress/e2e/spec.cy.js', updatedContent);

// Run Cypress tests
cypress.run().then((results) => {
  fs.writeFileSync('cypressResults.json', JSON.stringify(results, null, 2));
}).catch((err) => {
  console.error(err);
});
