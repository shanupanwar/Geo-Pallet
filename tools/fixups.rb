# Approved content fixes (REVIEW.md, 2026-11-22), applied to the partials after build.rb + dynamize.rb.
#   1. links that only worked on live via its "redirect everything to home" rule -> real pages
#   2. alt text for meaningful images (decorative icons stay alt="")
require 'nokogiri'
P = File.join(ARGV[0], 'geo-pallet-theme/partials')
L = "\u0001"; R = "\u0002" # stand-ins for {{ and }} while parsed (never occur in page text)
H = "#{L}HOME#{R}"

# href (without host) => new href; [href, link text] pairs override for the Site Map toggles
LINKS = {
  '/aboutgeo/' => '/about/',
  '/wooden-pallet-solutions/' => '/about/',
  '/contact/' => '/contact-geo-pallet/',
  '/services/#delivery' => '/pallet-supplier-british-columbia/#delivery',
  '/services/#repair' => '/pallet-supplier-british-columbia/#repair',
  '/services/#heat' => '/pallet-supplier-british-columbia/#heat',
  '/geocontact' => '/contact-geo-pallet/',
  '/geoproducts/' => '/custom-pallets-british-columbia/',
  '/geoservices/' => '/pallet-supplier-british-columbia/'
}
BY_TEXT = {
  ['/geoproducts/', 'Custom Pallets'] => '/custom-pallets-british-columbia/#custom',
  ['/geoproducts/', 'Heat Treated Pallets'] => '/pallet-supplier-british-columbia/#heat',
  ['/geoproducts/', 'Recycled Pallets'] => '/custom-pallets-british-columbia/#recycle',
  ['/geoproducts/', 'Other Products'] => '/custom-pallets-british-columbia/#Crates',
  ['/geoservices/', 'Pallet Repair'] => '/pallet-supplier-british-columbia/#repair',
  ['/geoservices/', 'Delivery Solutions'] => '/pallet-supplier-british-columbia/#delivery'
}
# text inside scripts (inquiry-form Cancel buttons)
SCRIPT_URLS = { "#{H}/custom-pallet-solutions/" => "#{H}/custom-pallets-british-columbia/" }

ALT = {
  '2-Way-Pallet.png' => '2-way stringer wooden pallet',
  '4-Way-Pallet-768x384-1-300x169-1.png' => '4-way stringer wooden pallet',
  'block-Pallet-768x384-1-300x169-1.png' => 'Wooden block pallet',
  'Untitled-design-9-1024x549.png' => 'Wooden skid pallet',
  'Wing-Pallet-768x432-1.png' => 'Wooden wing pallet',
  'crate-Pallet-768x384-1-300x169-1.png' => 'Wooden shipping crate',
  'Untitled-design-7.png' => 'Custom wooden pallet',
  'Crib-1.png' => 'Stacked wood cribbing blocks',
  'ChatGPT-Image-Jun-24-2026-11_18_17-AM.png' => 'Grade B recycled wooden pallet',
  'Repair-02.jpg.jpeg' => 'Wooden pallet being repaired at Geo Pallet',
  'Updated-team-boss.jpg' => 'Geo Pallet Ltd. team',
  'Untitled-design.png' => 'Geo Pallet Ltd. logo',
  'GP-logo-without-tagline-removebg-preview.png' => 'Geo Pallet Ltd.',
  'cwcpa-logo-2.png' => 'Canadian Wood Pallet & Container Association logo',
  'NWPCA-Logo-600x132-1.webp' => 'National Wooden Pallet & Container Association logo',
  'Bottom-wing-Reversible-Block-Pallet-with-wings.png' => 'Diagram: bottom wings of a reversible block pallet',
  'Bottom-middle-wing-Reversible-Block-Pallet-with-wings.png' => 'Diagram: middle bottom wing of a reversible block pallet',
  'Skid-middle-stringer.png' => 'Diagram: middle stringer of a wooden skid',
  'Top-Wings.png' => 'Diagram: top wings of a wing pallet',
  'Bottom-Wings.png' => 'Diagram: bottom wings of a wing pallet',
  'Wing-middle-Stringer.png' => 'Diagram: middle stringer of a wing pallet'
}

counts = Hash.new(0)
Dir[File.join(P, '*.html')].sort.each do |f|
  src = File.read(f, encoding: 'UTF-8')
  doc = Nokogiri::HTML5.fragment(src.gsub("{{", L).gsub("}}", R))
  changed = false
  doc.css('a[href]').each do |a|
    next unless a['href'].start_with?(H)
    path = a['href'].sub(H, '')
    text = a.text.gsub(/\s+/, ' ').strip
    to = BY_TEXT[[path, text]] || LINKS[path]
    next unless to
    a['href'] = H + to; changed = true; counts[:links] += 1
  end
  doc.css('img').each do |img|
    alt = ALT[File.basename(img['src'].to_s)]
    next unless alt && img['alt'].to_s.strip.empty?
    img['alt'] = alt; changed = true; counts[:alts] += 1
  end
  doc.css('script').each do |s|
    t = s.content
    SCRIPT_URLS.each { |from, to| t = t.gsub(from, to) }
    next if t == s.content
    s.content = t; changed = true; counts[:scripts] += 1
  end
  next unless changed
  File.write(f, doc.to_html.gsub(L, "{{").gsub(R, "}}"))
end
puts counts.inspect

# 3. footer: business hours under Contact Info (approved 2026-11-22), same wording as the Contact page
HOURS = 'Mon-Thur: 7:00am - 4:00pm | Fri: 7:00 am to 3:00 pm | Sat &amp; Sun: Closed'
ff = File.join(P, 'footer.html')
ft = File.read(ff, encoding: 'UTF-8')
unless ft.include?('geo-footer-hours')
  li = %(\n<li class="elementor-icon-list-item geo-footer-hours">\n\t<span class="elementor-icon-list-icon"><i aria-hidden="true" class="far fa-clock"></i></span>\n\t<span class="elementor-icon-list-text">#{HOURS}</span>\n</li>)
  ft = ft.sub(%r{(<span class="elementor-icon-list-text">Langley:[^<]*</span>\s*</li>)}) { $1 + li }
  abort 'footer hours: Langley line not found' unless ft.include?('geo-footer-hours')
  File.write(ff, ft)
  puts 'footer hours added'
end
