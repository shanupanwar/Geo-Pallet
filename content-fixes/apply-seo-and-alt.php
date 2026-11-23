<?php
/**
 * One-time content fixes approved on 2026-11-22 (REVIEW.md sections 2 and 3).
 * Sets Yoast SEO titles/descriptions and featured-image alt text in the WordPress database.
 *
 * Run once, after the XML import, with WP-CLI:
 *     wp eval-file apply-seo-and-alt.php
 * Safe to run again: it only writes the values below.
 */
if ( ! function_exists( 'get_page_by_path' ) ) {
	require __DIR__ . '/wp-load.php'; // when dropped into the WordPress root and opened once
}

$seo = array(
	// post or page slug => array( title, description, focus keyword|null )
	'true-pallet-cost' => array(
		'True Pallet Cost: Why the Cheapest Quote Costs More',
		'Learn how to calculate true pallet cost, from replacement orders and rejected loads to line downtime, and why the lowest quote can cost your plant more.',
		'true pallet cost',
	),
	'does-a-3000-lb-machine-need-a-3000-lb-pallet' => array(
		'Custom Pallet Design for Heavy Machines | Load Capacity',
		"A 3,000-lb machine doesn't always need a 3,000-lb pallet. See how load points, weight distribution and handling shape custom pallet design.",
		'custom pallet load capacity',
	),
	'single-vs-dual-pallet-supply-do-you-need-a-backup' => array(
		'Single vs. Dual Pallet Supply: Do You Need a Backup?',
		'Compare using one pallet supplier or two, and learn how a backup supplier protects production when deliveries slip or volumes suddenly change.',
		'pallet supplier',
	),
	'do-canada-to-u-s-wood-pallets-need-ispm-15-stamps' => array(
		'Do Canada to U.S. Pallets Need ISPM-15 Stamps?',
		'Canada–U.S. shipments can be exempt from ISPM-15, but only when the pallet qualifies. Learn when heat-treated, stamped pallets are still required.',
		'ISPM-15 pallets',
	),
	'pallet-inquiry-forms' => array( 'Pallet Quote Request Form | Geo Pallet Ltd.', null, null ), // description already set
);

// post slug => alt text for its featured image (only where it is empty or, for skids, has a typo)
$alt = array(
	'2-way-pallets'                     => '2-way wooden stringer pallets in a warehouse',
	'4-way-pallets'                     => '4-way notched stringer wooden pallet',
	'wooden-skids'                      => 'Wooden skids for heavy industrial loads',
	'wood-cribbing'                     => 'Wood cribbing stacked to support heavy equipment',
	'wooden-crates-boxes'               => 'Custom wooden shipping crates',
	'recycled-wooden-pallets'           => 'Stack of recycled wooden pallets',
	'grade-a-recycled-wooden-pallet-1'  => 'Grade A recycled wooden pallet',
	'grade-b-recycled-wooden-pallet-2'  => 'Grade B recycled wooden pallet with visible repairs',
	// the 4 newest posts: their image files are missing on the live server; applied if/when re-uploaded
	'do-canada-to-u-s-wood-pallets-need-ispm-15-stamps' => 'ISPM-15 heat-treated pallet stamp',
	'single-vs-dual-pallet-supply-do-you-need-a-backup' => 'Backup pallet supplier delivery',
	'pallet-shortage'                   => 'Pallet shortage at a plant',
	'true-pallet-cost'                  => 'Comparing pallet quotes',
);

$find = function ( $slug ) {
	$p = get_page_by_path( $slug, OBJECT, array( 'post', 'page' ) );
	return $p ? $p->ID : 0;
};

foreach ( $seo as $slug => $v ) {
	$id = $find( $slug );
	if ( ! $id ) { echo "SEO: not found: $slug\n"; continue; }
	update_post_meta( $id, '_yoast_wpseo_title', $v[0] );
	if ( $v[1] ) { update_post_meta( $id, '_yoast_wpseo_metadesc', $v[1] ); }
	if ( $v[2] ) { update_post_meta( $id, '_yoast_wpseo_focuskw', $v[2] ); }
	echo "SEO: $slug\n";
}

foreach ( $alt as $slug => $text ) {
	$id    = $find( $slug );
	$thumb = $id ? get_post_thumbnail_id( $id ) : 0;
	if ( ! $thumb ) { echo "ALT: no featured image: $slug\n"; continue; }
	$current = trim( (string) get_post_meta( $thumb, '_wp_attachment_image_alt', true ) );
	if ( '' !== $current && 'wooden-skids' !== $slug ) { echo "ALT: kept existing for $slug\n"; continue; }
	update_post_meta( $thumb, '_wp_attachment_image_alt', $text );
	echo "ALT: $slug\n";
}
echo "done\n";
