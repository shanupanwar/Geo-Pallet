<?php
/**
 * Single post: live Elementor single-post template #16484.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
the_post();
$geo_post = get_post();
geo_render_dynamic( 'single-post', array(
	'post-class' => function () { return esc_attr( implode( ' ', get_post_class() ) ); },
	'title'      => function () { return esc_html( get_the_title() ); },
	'content'    => function () { ob_start(); the_content(); return ob_get_clean(); },
	'related'    => function () use ( $geo_post ) {
		return geo_el_post_cards( get_posts( array( 'posts_per_page' => 4, 'post__not_in' => array( $geo_post->ID ) ) ), array( 'tag' => 'h3', 'size' => 'large' ) );
	},
	'comments'   => function () { return ( comments_open() || get_comments_number() ) ? geo_get_partial( 'comments' ) : ''; },
	'comment-list' => 'geo_comment_list',
	'post-id'    => function () { return (string) get_the_ID(); },
	'permalink'  => function () { return esc_url( get_permalink() ); },
) );
