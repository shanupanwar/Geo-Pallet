<?php
/**
 * Geo Pallet theme bootstrap.
 *
 * Every template renders a partial captured from the live site. Partials use tokens:
 *   {{HOME}}  site home URL (no trailing slash)      {{HOMEJ}} same, JSON-escaped
 *   {{SITE}}  theme assets/site (mirrors wp-content)  {{SITEJ}} same, JSON-escaped
 *   {{THEME}} theme root URL
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'GEO_VERSION', '1.0.0' );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
} );

/** Token replacements for partials. */
function geo_tokens() {
	static $map = null;
	if ( null === $map ) {
		$home  = untrailingslashit( home_url() );
		$theme = get_template_directory_uri();
		$site  = $theme . '/assets/site';
		$map   = array(
			'{{HOME}}'  => $home,
			'{{HOMEJ}}' => str_replace( '/', '\/', $home ),
			'{{SITEJ}}' => str_replace( '/', '\/', $site ),
			'{{SITE}}'  => $site,
			'{{THEME}}' => $theme,
			'{{YEAR}}'  => date_i18n( 'Y' ),
			'{{SITE_TITLE}}' => esc_html( get_bloginfo( 'name' ) ),
		);
	}
	return $map;
}

/** Return a partial with tokens resolved. */
function geo_get_partial( $name ) {
	$file = get_template_directory() . '/partials/' . $name;
	if ( ! preg_match( '/\.(html|txt)$/', $name ) ) { $file .= '.html'; }
	if ( ! is_readable( $file ) ) { return ''; }
	return apply_filters( 'geo_partial_output', strtr( file_get_contents( $file ), geo_tokens() ), $name );
}

/** Echo a partial (markup captured from the live site, trusted theme file). */
function geo_partial( $name ) {
	echo geo_get_partial( $name ); // phpcs:ignore WordPress.Security.EscapeOutput
}

/** Which captured page layout the current request uses. */
function geo_key( $set = null ) {
	static $key = 'home';
	if ( null !== $set ) { $key = $set; }
	return $key;
}

/** Render a full static page from its captured partials. */
function geo_render_page( $key ) {
	geo_key( $key );
	get_header();
	geo_partial( 'content-' . $key );
	get_footer();
}

/* Body classes of the live page (Astra/Elementor classes the CSS depends on). */
add_filter( 'body_class', function ( $classes ) {
	$extra = trim( geo_get_partial( 'body-' . geo_key() . '.txt' ) );
	return array_unique( array_merge( $classes, $extra ? explode( ' ', $extra ) : array() ) );
} );

/* Captured stylesheets + inline styles, printed in the live order. */
add_action( 'wp_head', function () { geo_partial( 'head-' . geo_key() ); }, 8 );

add_action( 'wp_enqueue_scripts', function () {
	$js = get_template_directory_uri() . '/assets/js/';
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'geo-she-header', $js . 'she-header.js', array( 'jquery' ), GEO_VERSION, true );
	wp_enqueue_script( 'geo-swiper', $js . 'swiper.min.js', array(), '8.4.5', true );
	wp_enqueue_script( 'geo-runtime', $js . 'geo.js', array( 'jquery', 'geo-swiper' ), GEO_VERSION, true );
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
} );

require get_template_directory() . '/inc/blog.php';
require get_template_directory() . '/inc/forms.php';
require get_template_directory() . '/inc/seo.php';

/**
 * Pallet inquiry page: slug => Elementor template id of the form shown (same mapping as live).
 */
function geo_inquiry_forms() {
	return array(
		'2-way-pallet' => 16849,
		'4-way-pallet' => 16853,
		'skid-pallet'  => 16856,
		'wing-pallet'  => 16859,
		'block-pallet' => 16862,
		'cribbing'     => 16865,
	);
}

/** Normalise ?selected= exactly like the page script (spaces/underscores/plus -> dashes, default 2-way). */
function geo_inquiry_variant() {
	$raw  = isset( $_GET['selected'] ) ? sanitize_text_field( wp_unslash( $_GET['selected'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	$slug = preg_replace( '/[\s_+]+/', '-', strtolower( trim( $raw ) ) );
	return array_key_exists( $slug, geo_inquiry_forms() ) ? $slug : '2-way-pallet';
}

/* The inquiry page head references the 2-way form's CSS; swap in the selected form's CSS file. */
add_filter( 'geo_partial_output', function ( $html, $name ) {
	if ( 'head-pallet-inquiry-forms' === $name ) {
		$html = str_replace( 'post-16849.css', 'post-' . geo_inquiry_forms()[ geo_inquiry_variant() ] . '.css', $html );
		// Per-form collapsible-section CSS exists only for the 2-way form (Gravity Form 1) on live.
		if ( '2-way-pallet' !== geo_inquiry_variant() ) {
			$html = preg_replace( '#<style id="gf_collapsible_sections_user_css_form_1-inline-css">.*?</style>\s*#s', '', $html );
		}
	}
	return $html;
}, 10, 2 );

/* Single post hero background = the post's featured image (live: Elementor "post-featured-image" tag). */
add_filter( 'geo_partial_output', function ( $html, $name ) {
	if ( 'head-single-post' === $name ) {
		$img  = is_singular() ? get_the_post_thumbnail_url( get_queried_object_id(), 'full' ) : '';
		$html = $img ? str_replace( '{{FEATURED_IMAGE}}', esc_url( $img ), $html )
			: preg_replace( '/[^\n]*\{\{FEATURED_IMAGE\}\}[^\n]*\n/', '', $html );
	}
	return $html;
}, 10, 2 );

/* Comments are turned off site-wide (decided 2026-11-22: live only ever received spam). */
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open', '__return_false', 20 );
add_filter( 'comments_array', '__return_empty_array', 20 );
add_filter( 'get_comments_number', '__return_zero', 20 );

/* Approved additions and responsive fixes. Printed right after the captured live styles
   (wp_head priority 8) so they take precedence over them. */
add_action( 'wp_head', function () {
	$css = get_template_directory_uri() . '/assets/css/';
	foreach ( array( 'geo-additions', 'geo-responsive' ) as $f ) {
		printf( '<link rel="stylesheet" id="%1$s-css" href="%2$s" media="all">' . "\n", esc_attr( $f ), esc_url( $css . $f . '.css?ver=' . GEO_VERSION ) );
	}
}, 9 );
