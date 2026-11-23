<?php
/**
 * Fallback for pages that are not part of the captured live layouts
 * (e.g. a privacy policy added later). Uses the blog-post head/body styles
 * with the page's own content; the nine live pages have dedicated templates.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
geo_key( 'single-post' );
get_header();
while ( have_posts() ) :
	the_post();
	?>
	<div id="primary" class="content-area primary">
		<main id="main" class="site-main">
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'ast-article-single' ); ?>>
				<header class="entry-header"><h1 class="entry-title"><?php the_title(); ?></h1></header>
				<div class="entry-content clear"><?php the_content(); ?></div>
			</article>
		</main>
	</div>
	<?php
endwhile;
get_footer();
