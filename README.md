Vish Editor
===========================


-----------------------------------------------------
Init
-----------------------------------------------------

Install node.js:
https://github.com/joyent/node/wiki/Installation

Go to your workspace and clone vish_editor project:
git clone git@github.com:ging/vish_editor.git

cd /vish_editor

npm install

Rename /configuration/configuration_example.js to /configuration/configuration.js , and fill all configuration values.

Also rename public/vishEditor/configuration/configuration_example.js to public/vishEditor/configuration/configuration.js .

mkdir data

mongod --dbpath ./data/

node app.js


-----------------------------------------------------------
Configuration
-----------------------------------------------------------

To enable sign in with twitter/facebook in development, include this line in your /etc/hosts:

127.0.0.1	dev.visheditor.com

Remember to add the appropiate keys in your ~/configuration/configuration.js file.



-----------------------------------------------------------
Working with Vish Editor without Node.js
-----------------------------------------------------------

Just use ~/vish_editor/public as your document root.

For example, in Apache:
Edit /etc/apache2/sites-enabled/000-default

	DocumentRoot ~/vish_editor/public
	<Directory />
		Options FollowSymLinks
		AllowOverride None
	</Directory>
	<Directory ~/vish_editor/public/>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride None
		Order allow,deny
		allow from all
	</Directory>


Just replace ~/vish_editor/public with your full path.

Finally, restart apache.
sudo /etc/init.d/apache2 restart
