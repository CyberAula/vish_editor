class VishEditor::InstallGenerator < Rails::Generators::Base
  include Rails::Generators::Migration
  
  source_root File.expand_path('../templates', __FILE__)
  def require_javascripts
    inject_into_file 'app/assets/javascripts/application.js',
                     "//= require vish_editor\n",
                     :before => '//= require_tree .'
  end
end
