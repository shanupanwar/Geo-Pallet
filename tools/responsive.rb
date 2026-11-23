# Responsive fix approved 2026-11-22: tablets and narrow windows (768-1024px) use the site's phone layout.
#
# The live Elementor design has a clean phone layout (<=767px) and a desktop layout, but its "tablet"
# range borrows desktop offsets that overlap. Moving Elementor's phone/desktop breakpoint from 767/768
# to 1024/1025 makes everything up to 1024px use the phone layout. Desktop (>=1025px) is unchanged.
#
# Run after build.rb / dynamize.rb / fixups.rb. Safe to run more than once.
THEME = File.join(ARGV[0], 'geo-pallet-theme')
files = Dir[File.join(THEME, 'assets/site/**/*.css')] + Dir[File.join(THEME, 'partials/*.html')]
changed = 0
files.each do |f|
  s = File.read(f, encoding: 'UTF-8')
  t = s.gsub(/max-width\s*:\s*767(?:\.98)?px/) { |m| m.sub(/767(?:\.98)?/, '1024') }
       .gsub(/min-width\s*:\s*768px/) { |m| m.sub('768', '1025') }
  next if t == s
  File.write(f, t)
  changed += 1
end
puts "files updated: #{changed}"
