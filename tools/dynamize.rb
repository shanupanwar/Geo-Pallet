# Replace post-specific regions in captured blog partials with <!--GEO:x--> markers.
require 'nokogiri'
P = File.join(ARGV[0], 'geo-pallet-theme/partials')
M = ->(name) { Nokogiri::XML::Comment.new(Nokogiri::HTML::Document.new, "GEO:#{name}") }
def load(f); Nokogiri::HTML5.fragment(File.read(f, encoding: "UTF-8").gsub("{{","GEOTOKL").gsub("}}","GEOTOKR")); end
def mark(node, name)
  raise "missing node for #{name}" unless node
  node.children.each(&:remove)
  node.add_child(Nokogiri::XML::Comment.new(node.document, "GEO:#{name}"))
end
def unt(s); s.gsub("GEOTOKL","{{").gsub("GEOTOKR","}}"); end
def save(f, frag); File.write(f, unt(frag.to_html)); end

# BLOGS page
f = File.join(P, 'content-blogs.html'); d = load(f)
mark(d.at_css('.elementor-widget-uael-posts .uael-post__header'), 'uael-filters')
mark(d.at_css('.elementor-widget-uael-posts .uael-post-grid__inner'), 'uael-cards')
save(f, d)

# SINGLE post
f = File.join(P, 'content-single-post.html'); d = load(f)
tpl = d.at_css('[data-elementor-type="single-post"]')
tpl['class'] = 'elementor elementor-16484 elementor-location-single GEOPOSTCLASS'
mark(d.at_css('.elementor-widget-theme-post-title .elementor-heading-title'), 'title')
mark(d.at_css('.elementor-widget-theme-post-content > .elementor-widget-container'), 'content')
mark(d.at_css('.elementor-widget-posts .elementor-posts-container'), 'related')
d.css('.elementor-widget-posts .e-load-more-anchor').each(&:remove)
cm = d.at_css('.elementor-widget-post-comments > .elementor-widget-container')
comments = cm.inner_html
mark(cm, 'comments')
html = d.to_html.sub('GEOPOSTCLASS', '<!--GEO:post-class-->')
File.write(f, unt(html))
# comments partial: Astra comment form, post-specific values as markers
c = Nokogiri::HTML5.fragment(comments)  # comments already token-safe (from load)
c.css('input[name="comment_post_ID"]').each { |i| i['value'] = 'GEOPOSTID' }
c.css('#cancel-comment-reply-link').each { |a| a['href'] = 'GEOPERMALINK#respond' }
c.css('.comments-count-wrapper, ol.ast-comment-list').each(&:remove)
area = c.at_css('#comments')
area.prepend_child(Nokogiri::XML::Comment.new(area.document, 'GEO:comment-list')) if area
c.css('form').each { |fm| fm['action'] = 'GEOTOKLHOMEGEOTOKR/wp-comments-post.php'; fm.remove_attribute('data-geo-endpoint') }
out = unt(c.to_html).gsub('GEOPOSTID', '<!--GEO:post-id-->').gsub('GEOPERMALINK', '<!--GEO:permalink-->')
File.write(File.join(P, 'comments.html'), out)

# ARCHIVE
f = File.join(P, 'content-archive.html'); d = load(f)
mark(d.at_css('.elementor-widget-theme-archive-title .elementor-heading-title'), 'archive-title')
ap = d.at_css('.elementor-widget-archive-posts')
mark(ap.at_css('.elementor-posts-container'), 'archive-posts')
ap.css('.e-load-more-anchor, .elementor-button-wrapper').each(&:remove)
ap.at_css('.elementor-posts-container').add_next_sibling(Nokogiri::XML::Comment.new(d.document, 'GEO:archive-loadmore'))
mark(d.at_css('.elementor-widget-posts .elementor-posts-container'), 'latest')
save(f, d)
puts 'ok'
