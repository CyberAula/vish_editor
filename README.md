Vish Editor
===========================

-----------------------------------------------------
Getting Started
-----------------------------------------------------

Go to your workspace and clone vish_editor project:
git clone git@github.com:ging/vish_editor.git

cd /vish_editor

Rename /configuration/configuration_example.js to /configuration/configuration.js , and fill all configuration values.


-----------------------------------------------------------
Working with Vish Editor with Apache
-----------------------------------------------------------

Create a new file in /etc/apache2/sites-available and link the file to sites-enabled, and use ~/vish_editor as your document root.

For example:
Edit /etc/apache2/sites-enabled/default

	DocumentRoot ~/vish_editor
	<Directory />
		Options FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>
	<Directory ~/vish_editor//>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride None
		Order allow,deny
		allow from all
	</Directory>

Finally, restart apache.
sudo /etc/init.d/apache2 restart
