VishEditorStandaloneBackend
===========================

Vish Editor Standalone Backend

Node.js


-----------------------------------------------------
Init
-----------------------------------------------------

npm install

Rename /configuration/configuration_example.js to /configuration/configuration.js , and fill all configuration values.

mkdir data

mongod --dbpath ./data/

node app.js



-----------------------------------------------------------
Configuration
-----------------------------------------------------------

To enable sign in with twitter/facebook in development, include this line in your /etc/hosts:

127.0.0.1	dev.visheditor.com

Remember add the required values in your ~/configuration/configuration.js file. 
