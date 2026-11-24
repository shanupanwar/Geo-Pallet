<?php
/**
 * Google Search improvements (approved 2026-11-23).
 *
 *  1. Business card for Google: LocalBusiness structured data (name, addresses, phone, hours, logo,
 *     social profiles) on the Home and Contact pages. Invisible to visitors.
 *  2. Page titles + descriptions: the Yoast SEO titles/descriptions already saved with each page are
 *     used even when the Yoast plugin is not active. When Yoast is active it handles them itself.
 *  3. Share previews (Facebook, WhatsApp, LinkedIn, X): title, summary and picture. Skipped when Yoast
 *     is active, because Yoast prints its own.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function geo_seo_yoast_active() {
	return defined( 'WPSEO_VERSION' );
}

/** Post/page id the current request is about (0 for lists such as categories). */
function geo_seo_object_id() {
	if ( is_front_page() && 'page' === get_option( 'show_on_front' ) ) {
		return (int) get_option( 'page_on_front' );
	}
	return is_singular() ? (int) get_queried_object_id() : 0;
}

/** Fill in the simple Yoast placeholders (%%title%%, %%sitename%%, %%sep%% ...) and drop the rest. */
function geo_seo_vars( $text, $id ) {
	$text = strtr( $text, array(
		'%%title%%'    => $id ? get_the_title( $id ) : '',
		'%%sitename%%' => get_bloginfo( 'name' ),
		'%%sep%%'      => '|',
		'%%page%%'     => '',
		'%%primary_category%%' => '',
	) );
	$text = preg_replace( '/%%[a-z_]+%%/', '', $text );
	return trim( preg_replace( '/\s+/', ' ', $text ), " |-\t" );
}

/** Saved Yoast value ('title' or 'metadesc') for the current page, with placeholders filled in. */
function geo_seo_saved( $key ) {
	$id = geo_seo_object_id();
	if ( ! $id ) { return ''; }
	$v = get_post_meta( $id, '_yoast_wpseo_' . $key, true );
	return $v ? geo_seo_vars( $v, $id ) : '';
}

/** Google title for the current page (falls back to WordPress's normal title). */
function geo_seo_title() {
	$t = geo_seo_saved( 'title' );
	return $t ? $t : wp_get_document_title();
}

/** Google description for the current page. */
function geo_seo_description() {
	$d = geo_seo_saved( 'metadesc' );
	if ( ! $d && is_singular( 'post' ) ) {
		$post = get_queried_object();
		$d    = has_excerpt( $post ) ? $post->post_excerpt : wp_strip_all_tags( strip_shortcodes( $post->post_content ) );
		$d    = wp_html_excerpt( trim( preg_replace( '/\s+/', ' ', $d ) ), 155, '…' );
	}
	if ( ! $d && is_category() ) {
		$d = wp_strip_all_tags( category_description() );
	}
	if ( ! $d ) {
		$d = get_bloginfo( 'description' );
	}
	return trim( $d );
}

/* 2. Titles: use the saved Google title when Yoast isn't there to do it. */
add_filter( 'pre_get_document_title', function ( $title ) {
	if ( geo_seo_yoast_active() ) { return $title; }
	$t = geo_seo_saved( 'title' );
	return $t ? $t : $title;
}, 20 );

/* 2 + 3. Description and share previews (only without Yoast). */
add_action( 'wp_head', function () {
	if ( geo_seo_yoast_active() ) { return; }
	$desc = geo_seo_description();
	if ( $desc ) {
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
	}

	$id    = geo_seo_object_id();
	$url   = $id ? get_permalink( $id ) : ( is_category() ? get_category_link( get_queried_object_id() ) : home_url( '/' ) );
	$image = '';
	if ( $id && is_singular( 'post' ) ) {
		$thumb = get_post_thumbnail_id( $id );
		$file  = $thumb ? get_attached_file( $thumb ) : '';
		if ( $file && file_exists( $file ) ) { // some live posts point at picture files that no longer exist
			$image = get_the_post_thumbnail_url( $id, 'large' );
		}
	}
	if ( ! $image ) {
		$image = get_template_directory_uri() . '/assets/img/home-hero-poster.jpg'; // 1280x720 photo of a pallet
	}
	$og = array(
		'og:locale'      => 'en_CA',
		'og:type'        => is_singular( 'post' ) ? 'article' : 'website',
		'og:site_name'   => get_bloginfo( 'name' ),
		'og:title'       => geo_seo_title(),
		'og:description' => $desc,
		'og:url'         => $url,
		'og:image'       => $image,
	);
	foreach ( $og as $p => $v ) {
		if ( $v ) { printf( '<meta property="%s" content="%s">' . "\n", esc_attr( $p ), esc_attr( $v ) ); }
	}
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
}, 1 );

/** 1. The business details Google reads (same details as the footer and Contact page). */
function geo_seo_business() {
	$home  = trailingslashit( home_url() );
	$site  = get_template_directory_uri() . '/assets/site/wp-content/uploads';
	$hours = array(
		array( '@type' => 'OpeningHoursSpecification', 'dayOfWeek' => array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday' ), 'opens' => '07:00', 'closes' => '16:00' ),
		array( '@type' => 'OpeningHoursSpecification', 'dayOfWeek' => 'Friday', 'opens' => '07:00', 'closes' => '15:00' ),
	);
	$langley = array(
		'@type'                     => 'LocalBusiness',
		'@id'                       => $home . '#langley',
		'name'                      => 'Geo Pallet Ltd. – Langley',
		'telephone'                 => '+1-604-584-4368',
		'address'                   => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => '8910 256 Street Unit #1',
			'addressLocality' => 'Langley Township',
			'addressRegion'   => 'BC',
			'postalCode'      => 'V1M 3N7',
			'addressCountry'  => 'CA',
		),
		'openingHoursSpecification' => $hours,
	);
	return array(
		'@context'                  => 'https://schema.org',
		'@type'                     => 'LocalBusiness',
		'@id'                       => $home . '#business',
		'name'                      => 'Geo Pallet Ltd.',
		'description'               => 'Wooden pallet manufacturer in Surrey and Langley, BC: new, custom, heat-treated and recycled pallets, skids, crates, cribbing, pallet repair and delivery.',
		'url'                       => $home,
		'logo'                      => $site . '/2024/04/GP-logo-without-tagline-removebg-preview.png',
		'image'                     => get_template_directory_uri() . '/assets/img/home-hero-poster.jpg',
		'telephone'                 => '+1-604-584-4368',
		'email'                     => 'office@geopalletltd.com',
		'address'                   => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => '11180 120 Street',
			'addressLocality' => 'Surrey',
			'addressRegion'   => 'BC',
			'postalCode'      => 'V3V 8B8',
			'addressCountry'  => 'CA',
		),
		'areaServed'                => array( '@type' => 'AdministrativeArea', 'name' => 'British Columbia' ),
		'openingHoursSpecification' => $hours,
		'department'                => $langley,
		'sameAs'                    => array(
			'https://www.facebook.com/GeoPallet',
			'https://www.instagram.com/geopallet',
			'https://www.linkedin.com/company/geo-pallet-ltd.',
			'https://www.youtube.com/@GeoPallet',
		),
	);
}

add_action( 'wp_head', function () {
	if ( ! ( is_front_page() || is_page( array( 'contact-geo-pallet', 'contact-form' ) ) ) ) { return; }
	$data = apply_filters( 'geo_seo_business', geo_seo_business() );
	echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n";
}, 2 );
