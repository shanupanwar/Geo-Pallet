# Builds content-fixes/restore-2-articles.xml: the two deleted articles that live "Read More" buttons link to,
# taken from the WordPress export, set back to published at their original addresses.
x = File.read(ARGV[0], encoding: 'UTF-8')
first = x.index('<item>'); last = x.rindex('</item>') + '</item>'.length
head = x[0...first]; tail = x[last..]
items = []
pos = first
while (s = x.index('<item>', pos)) && s < last
  e = x.index('</item>', s) + '</item>'.length
  b = x[s...e]; pos = e
  items << b if b.include?('<wp:post_name><![CDATA[geo-pallet-logo__trashed]]>') || b.include?('<wp:post_name><![CDATA[custom-pallets-made-to-your-load__trashed]]>')
end
abort "expected 2 items, got #{items.size}" unless items.size == 2
items.map! do |b|
  b = b.sub('<wp:status><![CDATA[trash]]>', '<wp:status><![CDATA[publish]]>').gsub('__trashed', '')
  # drop trash bookkeeping, the trash-time redirect, and a featured image whose file no longer exists
  b.gsub(%r{\s*<wp:postmeta>\s*<wp:meta_key><!\[CDATA\[(?:_wp_trash_meta_[a-z_]+|_yoast_post_redirect_info|_thumbnail_id|_yoast_indexnow_last_ping)\]\]></wp:meta_key>\s*<wp:meta_value>.*?</wp:meta_value>\s*</wp:postmeta>}m, '')
end
File.write(ARGV[1], head + items.join("\n") + "\n" + tail)
items.each { |b| puts "#{b[%r{<title>(.*?)</title>}m, 1]} | /#{b[/<wp:post_name><!\[CDATA\[(.*?)\]\]>/, 1]}/ | #{b[/<wp:status><!\[CDATA\[(.*?)\]\]>/, 1]} | trash meta left: #{b.scan('_wp_trash_meta').size}" }
