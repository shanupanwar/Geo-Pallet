# Converts saved live HTML of geopalletltd.com into classic-theme partials + local assets.
require 'nokogiri'; require 'fileutils'; require 'pathname'; require 'set'
Encoding.default_external = 'UTF-8'
BASE  = ARGV[0]
SRC   = File.join(BASE, 'source-assets/html')
THEME = File.join(BASE, 'geo-pallet-theme')
SITE  = File.join(THEME, 'assets/site')           # mirrors /wp-content and /wp-includes of the live site
PARTS = File.join(THEME, 'partials')
UA    = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
PAGES = %w[home about products services blogs contact contact-form pallet-inquiry-forms site-map single-post archive]
HOST  = %r{https?:(?://|\\/\\/)(?:www\.)?geopalletltd\.com}

EXCL_CSS   = %r{admin-bar|maxmegamenu|cookie-law-info|google-site-kit|bluehost|nfd-|block-library}
DROP_STYLE = %r{\A(admin-bar|wp-emoji|nfd-wonder|cky-style|global-styles|wp-img-auto-sizes|classic-theme-styles|wp-block-library)}
KEEP_BODY_SCRIPT = ->(s){ s['id'].to_s.start_with?('gp-') || s.text.include?('ast-header-break-point') || s.text.include?('lazyloadRunObserver') }
ACTIVE_CLASSES = %w[current-menu-item current_page_item elementor-item-active current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor elementor-item-anchor]

FileUtils.mkdir_p([SITE, PARTS])
$fetched = Set.new; $missing = []

def local_path(url) # absolute live url -> local file path
  File.join(SITE, url.sub(HOST, '').sub(/[?#].*\z/, ''))
end

def fetch(url)
  url = url.sub(/[?#].*\z/, '')
  return local_path(url) if $fetched.include?(url)
  $fetched << url
  dst = local_path(url)
  unless File.exist?(dst) && File.size(dst) > 0
    FileUtils.mkdir_p(File.dirname(dst))
    ok = system('curl', '-sfL', '--max-time', '60', '-A', UA, '-o', dst, url)
    unless ok; $missing << url; File.delete(dst) if File.exist?(dst); return nil; end
  end
  mirror_css(url, dst) if dst.end_with?('.css')
  dst
end

def mirror_css(url, dst) # download url() deps, rewrite absolute ones to relative
  css = File.read(dst)
  dir = Pathname(File.dirname(dst))
  css = css.gsub(/url\(\s*(['"]?)([^'")]+)\1\s*\)/) do
    q, ref = $1, $2
    next $& if ref.start_with?('data:', '#')
    abs = if ref =~ HOST then ref.sub(HOST, 'https://geopalletltd.com')
          elsif ref.start_with?('//', 'http') then next($&)
          elsif ref.start_with?('/') then 'https://geopalletltd.com' + ref
          else URI.join(url, ref).to_s end
    f = fetch(abs.sub(/[?#].*\z/, '')) or next($&)
    suffix = ref[/[?#].*\z/].to_s.sub(/\A\?ver=[^#]*/, '')
    "url(#{q}#{Pathname(f).relative_path_from(dir)}#{suffix}#{q})"
  end
  File.write(dst, css)
end
require 'uri'

# rewrite live URLs inside markup / inline css to theme tokens
def tokenize(s)
  s = s.gsub("%7B%7B", "{{").gsub("%7D%7D", "}}")
  s = s.gsub(%r{https?://(?:www\.)?geopalletltd\.com/(wp-content|wp-includes)/([^\s"'<>)]*)}) { "{{SITE}}/#{$1}/#{$2.sub(/\?ver=[^&"'\s]*\z/, '')}" }
  s = s.gsub(%r{https?:\\/\\/(?:www\.)?geopalletltd\.com\\/(wp-content|wp-includes)\\/}) { "{{SITEJ}}\\/#{$1}\\/" }
  s = s.gsub(%r{https?:\\/\\/(?:www\.)?geopalletltd\.com}) { '{{HOMEJ}}' }
  s = s.gsub(%r{https?://(?:www\.)?geopalletltd\.com}) { '{{HOME}}' }
  s
end

def clean_fragment!(node)
  # EWWW lazy-load -> plain images/backgrounds
  node.css('noscript').each { |n| n.remove if n.inner_html =~ /<img/ }
  node.css('img').each do |img|
    if img['data-src']; img['src'] = img['data-src']; end
    %w[data-src data-srcset data-sizes srcset sizes data-eio-rwidth data-eio-rheight data-max-width].each { |a| img.remove_attribute(a) }
    img['class'] = img['class'].to_s.split.reject { |c| %w[lazyload lazyloaded].include?(c) }.join(' ') if img['class']
  end
  node.css('[data-background]').each do |el|
    el['style'] = "#{el['style']};background-image:url(#{el['data-background']})".sub(/\A;/, '')
    el.remove_attribute('data-background')
    el['class'] = el['class'].to_s.split.reject { |c| %w[lazyload lazyloaded swiper-lazy].include?(c) }.join(' ')
  end
  node.css('.swiper-lazy-preloader').each(&:remove)
  # Gravity Forms / plugin runtime scripts and ajax iframes have no backend in the theme
  # (only Gravity Forms / UAEL / Elementor runtime glue - site code that merely targets a form is kept)
  node.css('script').each { |s| s.remove if s['src'].nil? && s.text =~ /gform\.initializeOnLoaded|gform\.(scriptsLoaded|utils|addAction|doAction|applyFilters)|gform_ajax_frame|gf_global|gformInit|gf_apply_rules|uael_|elementorFrontend/ }
  node.css('iframe[id^="gform_ajax_frame"]').each(&:remove)
  # forms: identical markup, endpoint left for the owner to wire up
  node.css('form').each do |f|
    next if f['role'] == 'search'
    f['action'] = '#'; f.remove_attribute('target'); f['data-geo-endpoint'] = 'TODO'
  end
  # third-party GSAP copy -> theme-bundled GSAP
  node.css('script[src]').each do |s|
    s['src'] = '{{THEME}}/assets/js/gsap.min.js' if s['src'] =~ /gsap\.min\.js/
    s['src'] = '{{THEME}}/assets/js/ScrollTrigger.min.js' if s['src'] =~ /ScrollTrigger\.min\.js/
    s.remove_attribute('data-minify')
  end
end

def strip_active!(node)
  node.css('[class]').each { |el| el['class'] = (el['class'].split - ACTIVE_CLASSES).reject { |c| c =~ /\Apage[-_]item/ }.join(' ') }
  node.css('[aria-current]').each { |el| el.remove_attribute('aria-current') }
end

header_html = nil; footer_html = nil; uploads = Set.new
PAGES.each do |key|
  doc = Nokogiri::HTML5(File.read(File.join(SRC, "#{key}.html"), encoding: 'UTF-8'))
  body = doc.at('body')

  # ---- head: stylesheets + inline styles, in original order
  head = []
  doc.css('link[rel="stylesheet"], style').each do |n|
    next if n.ancestors('noscript').any?
    next if n.ancestors('[data-elementor-type]').any?   # widget-local styles stay in the content
    if n.name == 'link'
      href = n['href'].to_s
      next if href =~ EXCL_CSS || href !~ HOST
      fetch(href) or next
      head << %(<link rel="stylesheet" id="#{n['id']}" href="{{SITE}}#{href.sub(HOST, '').sub(/\?.*\z/, '')}" media="#{n['media'] || 'all'}">)
    else
      next if n['id'].to_s =~ DROP_STYLE
      t = n.text
      next if t.strip.empty? || t =~ /\.lazyload/
      head << %(<style#{n['id'] ? %( id="#{n['id']}") : ''}>#{tokenize(t)}</style>)
    end
  end
  File.write(File.join(PARTS, "head-#{key}.html"), head.join("\n") + "\n")

  # ---- body classes (WP-generated ones are re-added by body_class())
  File.write(File.join(PARTS, "body-#{key}.txt"), body['class'].split.reject { |c| c =~ /\A(admin-bar|logged-in|mega-menu-|customize-support|no-customize-support)/ }.join(' '))

  # ---- header / footer (global)
  hdr = body.at('[data-elementor-type="header"]'); ftr = body.at('[data-elementor-type="footer"]')
  [hdr, ftr].each { |n| clean_fragment!(n); strip_active!(n) }
  h = tokenize(hdr.to_html); f = tokenize(ftr.to_html)
  header_html ||= h; footer_html ||= f
  warn "header differs on #{key}" if h != header_html
  warn "footer differs on #{key}" if f != footer_html

  # ---- main content
  main = body.at('#content .ast-container')
  clean_fragment!(main)
  File.write(File.join(PARTS, "content-#{key}.html"), tokenize(main.inner_html).strip + "\n")

  # ---- body-level scripts to keep (site customisations), in order
  tail = body.css('script:not([src])').select { |s| s.ancestors('[data-elementor-type]').empty? && KEEP_BODY_SCRIPT.(s) }
  File.write(File.join(PARTS, "tail-#{key}.html"), tail.map { |s| tokenize(s.to_html) }.join("\n") + "\n")
end
File.write(File.join(PARTS, 'header.html'), header_html + "\n")
footer_html = footer_html.sub(%r{(<span class="elementor-icon-list-text">)2026(</span>)}, "\\1{{YEAR}}\\2").sub(%r{(<span class="elementor-icon-list-text">)Geo Pallet Ltd\.\. All rights reserved\.(</span>)}, "\\1{{SITE_TITLE}}. All rights reserved.\\2")
File.write(File.join(PARTS, "footer.html"), footer_html + "\n")

# ---- pallet inquiry page: server picks one of six form templates from ?selected=
INQUIRY = %w[2-way-pallet 4-way-pallet skid-pallet wing-pallet block-pallet cribbing]
rest = nil
INQUIRY.each do |slug|
  f = File.join(SRC, "inquiry-#{slug}.html")
  next warn("no capture for #{slug}") unless File.exist?(f)
  doc = Nokogiri::HTML5(File.read(f, encoding: 'UTF-8'))
  doc.css('link[rel="stylesheet"][href*="uploads/elementor/css/post-"]').each { |l| fetch(l['href']) }
  # Gravity Forms conditional-logic rules (data only) -> evaluated by geo.js
  logic = doc.css('script').map(&:text).map { |t| t[/gf_form_conditional_logic'\]\[(\d+)\] = (\{.*?\}); if\(!window\['gf_number_format'\]\)/m] && [$1, $2] }.compact.uniq
  main = doc.at('#content .ast-container'); clean_fragment!(main)
  form = main.at('#geopallet-dynamic-form')
  data = logic.map { |id, obj| "<script>window.geoGfLogic=window.geoGfLogic||{};window.geoGfLogic[#{id}]=#{obj};</script>" }.join("\n")
  # site-specific custom code attached to the form (mobile info icons etc.), written against two
  # Gravity Forms hooks; a minimal stand-in for those hooks runs first, geo.js fires the events.
  custom = doc.css('script:not([src])').select { |s| s.ancestors('[data-elementor-type]').empty? && s.text.include?('gform_post_render') && s.text =~ /GEO PALLET/i }
  shim = File.read(File.join(THEME, 'assets/js/gf-hooks-shim.js'))
  extra = custom.empty? ? '' : "<script>#{shim}</script>\n" + custom.map { |s| "<script>#{tokenize(s.text)}</script>" }.join("\n")
  File.write(File.join(PARTS, "inquiry-#{slug}.html"), tokenize(form.to_html) + "\n" + data + "\n" + extra + "\n")
  form.replace(Nokogiri::XML::Comment.new(doc, 'GEO:inquiry-form'))
  r = tokenize(main.inner_html).strip
  warn "inquiry page differs outside the form for #{slug}" if rest && r != rest
  rest ||= r
end
File.write(File.join(PARTS, 'content-pallet-inquiry-forms.html'), rest + "\n") if rest

# ---- download every upload / plugin asset referenced by partials
Dir[File.join(PARTS, '*')].each do |p|
  File.read(p).scan(%r{\{\{SITE\}\}/((?:wp-content|wp-includes)/[^\s"'<>)\\]+)}).flatten.each { |rel| uploads << rel.sub(/[?#].*\z/, '') }
  File.read(p).scan(%r{\{\{SITEJ\}\}\\/((?:wp-content|wp-includes)\\/[^\s"'<>)]+?)(?=&quot;|"|\s)}).flatten.each { |rel| uploads << rel.gsub('\\/', '/') }
end
uploads.each { |rel| fetch("https://geopalletltd.com/#{rel}") }
puts "assets referenced: #{uploads.size}; fetched total: #{$fetched.size}"
puts "MISSING:\n" + $missing.uniq.join("\n") unless $missing.empty?
# single post hero uses the post's featured image (Elementor dynamic tag) -> runtime token
hp = File.join(PARTS, 'head-single-post.html')
File.write(hp, File.read(hp).sub(%r{(elementor-element-7d810e94 > \.elementor-motion-effects-container > \.elementor-motion-effects-layer\{background-image:url\(")[^"]+("\))}, '\1{{FEATURED_IMAGE}}\2'))
