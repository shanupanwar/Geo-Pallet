# Emulates header.php/footer.php output for a static page, with assets pointed at the live origin.
require 'zlib'; require 'base64'
T = ARGV[0]; key = ARGV[1]
P = File.join(T, 'partials'); r = ->(n){ File.read(File.join(P, n), encoding: 'UTF-8') }
L = 'https://geopalletltd.com'
tok = ->(s){ s.gsub('{{HOMEJ}}', 'https:\/\/geopalletltd.com').gsub('{{SITEJ}}', 'https:\/\/geopalletltd.com').gsub('{{HOME}}', L).gsub('{{SITE}}', L)
              .gsub('{{THEME}}/assets/js/gsap.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/gsap.min.js')
              .gsub('{{THEME}}/assets/js/ScrollTrigger.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/ScrollTrigger.min.js') }
geo = File.read(File.join(T, 'assets/js/geo.js'))
html = <<~H
<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>PREVIEW #{key}</title>
#{tok.(r.("head-#{key}.html"))}
</head><body class="#{r.("body-#{key}.txt")}">
<a class="skip-link screen-reader-text" href="#content">Skip to content</a>
<div class="hfeed site" id="page">
#{tok.(r.('header.html'))}
<div id="content" class="site-content"><div class="ast-container">
#{tok.(r.("content-#{key}.html"))}
</div></div>
#{tok.(r.('footer.html'))}
</div>
<div id="ast-scroll-top" tabindex="0" class="ast-scroll-top-icon ast-scroll-to-top-right" data-on-devices="both"><span class="screen-reader-text">Scroll to Top</span></div>
#{tok.(r.("tail-#{key}.html"))}
<script src="#{L}/wp-includes/js/jquery/jquery.min.js"></script>
<script src="#{L}/wp-content/plugins/sticky-header-effects-for-elementor/assets/js/she-header.js"></script>
<script src="#{L}/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js"></script>
<script>#{geo}</script>
</body></html>
H
File.write(File.join(ARGV[2], "preview-#{key}.html"), html)
puts Base64.strict_encode64(Zlib.gzip(html, level: 9)).size
