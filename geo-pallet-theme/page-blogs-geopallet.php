<?php
/**
 * Live page layout: BLOGS (UAEL post grid with category filters).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
geo_render_dynamic( 'blogs', array(
	'uael-filters' => 'geo_blogs_filters',
	'uael-cards'   => 'geo_blogs_cards',
) );
