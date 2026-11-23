<?php
/**
 * Live page layout: Pallet inquiry forms.
 * As on the live site, ?selected=<slug> chooses which pallet form template is rendered
 * (2-way is the default). The dropdown script in the page reloads with the new slug.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
geo_render_dynamic( 'pallet-inquiry-forms', array(
	'inquiry-form' => function () { return geo_get_partial( 'inquiry-' . geo_inquiry_variant() ); },
) );
