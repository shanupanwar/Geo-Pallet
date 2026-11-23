<?php
/**
 * Dynamic blog pieces rendered into the captured Elementor markup:
 * BLOGS page grid (UAEL "event" skin), single post template, category/archive template.
 * Markup mirrors what the live site outputs; markers are <!--GEO:name--> in the partials.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Render a partial after swapping markers for dynamic HTML. */
function geo_render_dynamic( $key, array $markers ) {
	geo_key( $key );
	get_header();
	$html = geo_get_partial( 'content-' . $key );
	foreach ( $markers as $name => $value ) {
		$html = str_replace( '<!--GEO:' . $name . '-->', is_callable( $value ) ? call_user_func( $value ) : $value, $html );
	}
	echo $html; // phpcs:ignore WordPress.Security.EscapeOutput
	get_footer();
}

/** Featured image tag in the live markup style. */
function geo_thumb( $post_id, $size ) {
	$thumb_id = get_post_thumbnail_id( $post_id );
	$file     = $thumb_id ? get_attached_file( $thumb_id ) : '';
	if ( $thumb_id && $file && file_exists( $file ) ) {
		return get_the_post_thumbnail( $post_id, $size, array( 'decoding' => 'async' ) );
	}
	// Approved 2026-11-22: articles with no picture (or whose picture file is missing) show a
	// branded default instead of an empty space.
	return '<img src="' . esc_url( get_template_directory_uri() . '/assets/img/blog-default.svg' ) . '" width="768" height="432" class="attachment-' . esc_attr( is_string( $size ) ? $size : 'full' ) . ' wp-post-image geo-default-thumb" alt="" decoding="async">';
}

/* ------------------------------------------------------------------ */
/* Elementor Pro "Posts / Archive Posts" classic skin card              */
/* ------------------------------------------------------------------ */
function geo_el_post_card( $post, $args = array() ) {
	$a = wp_parse_args( $args, array( 'tag' => 'h3', 'size' => 'large', 'author' => true, 'date' => true ) );
	$url     = esc_url( get_permalink( $post ) );
	$classes = esc_attr( implode( ' ', get_post_class( 'elementor-post elementor-grid-item', $post ) ) );
	$thumb   = geo_thumb( $post->ID, $a['size'] );
	ob_start();
	?>
<article class="<?php echo $classes; ?>" role="listitem">
<?php if ( $thumb ) : ?>
				<a class="elementor-post__thumbnail__link" href="<?php echo $url; ?>" tabindex="-1">
			<div class="elementor-post__thumbnail"><?php echo $thumb; ?></div>
		</a>
<?php endif; ?>
				<div class="elementor-post__text">
				<<?php echo tag_escape( $a['tag'] ); ?> class="elementor-post__title">
			<a href="<?php echo $url; ?>">
				<?php echo esc_html( get_the_title( $post ) ); ?>
			</a>
		</<?php echo tag_escape( $a['tag'] ); ?>>
				<div class="elementor-post__meta-data">
<?php if ( $a['author'] ) : ?>
					<span class="elementor-post-author">
			<?php echo esc_html( get_the_author_meta( 'display_name', $post->post_author ) ); ?>
		</span>
<?php endif; ?>
<?php if ( $a['date'] ) : ?>
				<span class="elementor-post-date">
			<?php echo esc_html( get_the_date( 'F j, Y', $post ) ); ?>
		</span>
<?php endif; ?>
				</div>
				</div>
				</article>
	<?php
	return ob_get_clean();
}

function geo_el_post_cards( array $posts, $args = array() ) {
	return implode( "\n", array_map( function ( $p ) use ( $args ) { return geo_el_post_card( $p, $args ); }, $posts ) );
}

/* ------------------------------------------------------------------ */
/* BLOGS page: UAEL posts grid, "event" skin, with category filters      */
/* Live settings: 20 per page, exclude "uncategorized", excerpt 10 words */
/* ------------------------------------------------------------------ */
function geo_blogs_query() {
	static $posts = null;
	if ( null === $posts ) {
		$exclude = get_category_by_slug( 'uncategorized' );
		$posts   = get_posts( array(
			'post_type'        => 'post',
			'posts_per_page'   => 20,
			'category__not_in' => $exclude ? array( $exclude->term_id ) : array(),
			'suppress_filters' => false,
		) );
	}
	return $posts;
}

function geo_blogs_terms() {
	$terms = array();
	foreach ( geo_blogs_query() as $p ) {
		foreach ( get_the_category( $p->ID ) as $t ) {
			if ( 'uncategorized' !== $t->slug ) { $terms[ rawurldecode( $t->slug ) ] = $t; } // live shows decoded slugs
		}
	}
	uksort( $terms, 'strcmp' );
	return $terms;
}

function geo_blogs_filters() {
	$terms = geo_blogs_terms();
	$tabs  = '';
	$drop  = '';
	foreach ( $terms as $t ) {
		$tabs .= "\t\t\t\t\t\t\t\t<li class=\"uael-post__header-filter\" data-filter=\"." . esc_attr( rawurldecode( $t->slug ) ) . '" tabindex="0">' . esc_html( $t->name ) . "</li>\n";
		$drop .= "\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"uael-filters-dropdown-item uael-post__header-filter\" data-filter=\"." . esc_attr( rawurldecode( $t->slug ) ) . '">' . esc_html( $t->name ) . "</li>\n";
	}
	return '
					<div class="uael-post__header-filters-wrap uael-posts-tabs-dropdown">
			<ul class="uael-post__header-filters" aria-label="Taxonomy Filter">
				<li class="uael-post__header-filter uael-filter__current" data-filter="*">All</li>
' . $tabs . '			</ul>
							<div class="uael-filters-dropdown">
					<div class="uael-filters-dropdown-button">All<i class="fa fa-angle-down"></i>
</div>
					<ul class="uael-filters-dropdown-list uael-post__header-filters">
						<li class="uael-filters-dropdown-item uael-post__header-filter uael-filter__current" data-filter="*">All</li>
' . $drop . '					</ul>
				</div>
					</div>
				';
}

function geo_blogs_cards() {
	$out = '';
	foreach ( geo_blogs_query() as $p ) {
		$classes = array();
		foreach ( get_the_category( $p->ID ) as $t ) {
			// as UAEL: decoded slug cleaned to a valid class, then the lower-cased name
			$classes[] = sanitize_html_class( rawurldecode( $t->slug ) );
			$classes[] = strtolower( str_replace( ' ', '-', $t->name ) );
		}
		$url     = esc_url( get_permalink( $p ) );
		$title   = esc_html( get_the_title( $p ) );
		$excerpt = wp_trim_words( wp_strip_all_tags( strip_shortcodes( $p->post_excerpt ? $p->post_excerpt : $p->post_content ) ), 10, '' ) . ' ...';
		$thumb   = geo_thumb( $p->ID, 'full' );
		$noimg   = $thumb ? '' : ' uael-post-wrapper__noimage'; // live keeps the block, marked empty
		$noimgd  = $thumb ? '' : ' uael-post__noimage';
		$out    .= '<div class="uael-post-wrapper ' . esc_attr( implode( ' ', array_unique( $classes ) ) ) . ' ">
	<div class="uael-post__bg-wrap uael-bg-wrap-disabled">
					<a href="' . $url . '" target="_self" class="uael-post__complete-box-overlay" aria-label="Link Complete Box"></a>
		<div class="uael-post__inner-wrap uael-inner-wrap-disabled">
				<div class="uael-post__thumbnail' . $noimg . '">
						<a target="_self" href="' . $url . '" title="' . esc_attr( get_the_title( $p ) ) . '">' . $thumb . '</a>
					<div class="uael-post__datebox' . $noimgd . '">
				<div class="uael-post__date-wrap">
										<span class="uael-post__date-month">' . esc_html( get_the_date( 'M', $p ) ) . '</span><span class="uael-post__date-day">' . esc_html( get_the_date( 'j', $p ) ) . '</span>				</div>
			</div>
		</div>
			<div class="uael-post__content-wrap uael-content-wrap-disabled">
					<h4 class="uael-post__title">
						<a href="' . $url . '" target="_self">
				' . $title . '			</a>
				</h4>
		<div class="uael-post__excerpt">
			' . esc_html( $excerpt ) . '		</div>
					</div>
		</div>
	</div>
</div>
';
	}
	return $out;
}

/* ------------------------------------------------------------------ */
/* Single post: comments block in Astra's markup                         */
/* ------------------------------------------------------------------ */
function geo_comment_list() {
	$post_id = get_the_ID();
	$count   = (int) get_comments_number( $post_id );
	if ( ! $count ) { return ''; }
	ob_start();
	?>
	<div class="comments-count-wrapper">
		<h3 class="comments-title"><?php
			/* translators: 1: number of comments, 2: post title */
			printf( esc_html( _n( '%1$s thought on &ldquo;%2$s&rdquo;', '%1$s thoughts on &ldquo;%2$s&rdquo;', $count, 'geo-pallet' ) ), esc_html( number_format_i18n( $count ) ), esc_html( get_the_title() ) );
		?></h3>
	</div>
	<ol class="ast-comment-list">
		<?php wp_list_comments( array( 'style' => 'ol', 'avatar_size' => 50 ), get_comments( array( 'post_id' => $post_id, 'status' => 'approve' ) ) ); ?>
	</ol>
	<?php
	return ob_get_clean();
}
