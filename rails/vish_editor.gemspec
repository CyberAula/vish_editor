# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "vish_editor/version"

Gem::Specification.new do |s|
  s.name        = "vish_editor"
  s.version     = VishEditor::VERSION
  s.authors     = ["Víctor Sanchez Belmar", "Enrique Barra Arias"]
  s.email       = ["vsanchez@dit.upm.es", "ebarra@dit.upm.es"]
  s.homepage    = ""
  s.summary     = "Wrapper gem for VISH Editor"
  s.description = "Wrapper gem for VISH Editor"

  s.rubyforge_project = "vish_editor"

  s.files         = `git ls-files`.split("\n") |
                     Dir["app/assets/javascripts/libs/*"] |
                     Dir["app/assets/javascripts/mods/*"] |
                     Dir["app/assets/javascripts/mods/fc/*"] |
                     Dir["app/assets/stylesheets/templates/*"] |
                     Dir["app/assets/images/templatesthumbs/*"]
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  # specify any dependencies here; for example:
  # s.add_development_dependency "rspec"
  # s.add_runtime_dependency "rest-client"
  s.add_runtime_dependency('railties', '>= 3.1.3')
end
