<?php
/**
 * Category / archive listing: live Elementor archive template #11522.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
geo_render_dynamic( 'archive', array(
	'archive-title' => function () { // live: Elementor archive-title, no context prefix, fallback "Blog"
		$t = is_category() || is_tag() || is_tax() ? single_term_title( '', false ) : ( is_archive() ? wp_strip_all_tags( get_the_archive_title() ) : '' );
		return esc_html( $t ? $t : 'Blog' );
	},
	'archive-posts' => function () {
		global $wp_query;
		return geo_el_post_cards( $wp_query->posts, array( 'tag' => 'h2', 'size' => 'medium_large' ) );
	},
	'archive-loadmore' => function () {
		global $wp_query;
		$max  = (int) $wp_query->max_num_pages;
		$page = max( 1, (int) get_query_var( 'paged' ) );
		if ( $max <= $page ) { return ''; }
		return '<span class="e-load-more-anchor" data-page="' . $page . '" data-max-page="' . $max . '" data-next-page="' . esc_url( get_pagenum_link( $page + 1 ) ) . '"></span>
				<div class="elementor-button-wrapper">
				<a href="#" class="elementor-button elementor-size-sm" role="button">
					<span class="elementor-button-content-wrapper"><span class="elementor-button-text">Load More</span></span>
				</a>
			</div>';
	},
	'latest' => function () {
		return geo_el_post_cards( get_posts( array( 'posts_per_page' => 6 ) ), array( 'tag' => 'h3', 'size' => 'medium', 'author' => false ) );
	},
) );
