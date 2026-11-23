<?php
/**
 * Website forms -> email.
 *
 * Every quote/contact/inquiry form (and the footer newsletter box) is sent here by assets/js/geo.js.
 * The submission is emailed to the office address; the customer also gets a short copy.
 * Decided 2026-11-22: recipient office@geopalletltd.com, customer copy on, attachments up to 20 MB.
 *
 * For reliable delivery, install an SMTP plugin (e.g. WP Mail SMTP) on the live site - see CHECKLIST.md.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Where submissions go. Change here (or with the 'geo_form_recipient' filter). */
function geo_form_recipient() {
	return apply_filters( 'geo_form_recipient', 'office@geopalletltd.com' );
}

/** Largest single upload we accept; most mail servers reject emails over ~25 MB. */
function geo_form_max_upload() {
	return (int) apply_filters( 'geo_form_max_upload', 20 * MB_IN_BYTES );
}

/** File types customers may attach (drawings, photos, documents). */
function geo_form_allowed_mimes() {
	return apply_filters( 'geo_form_allowed_mimes', array(
		'jpg|jpeg|jpe' => 'image/jpeg',
		'png'          => 'image/png',
		'gif'          => 'image/gif',
		'webp'         => 'image/webp',
		'heic'         => 'image/heic',
		'pdf'          => 'application/pdf',
		'doc'          => 'application/msword',
		'docx'         => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'xls'          => 'application/vnd.ms-excel',
		'xlsx'         => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'csv'          => 'text/csv',
		'txt'          => 'text/plain',
		'dwg'          => 'application/acad',
		'dxf'          => 'application/dxf',
	) );
}

/* Tell geo.js where to send forms. */
add_action( 'wp_enqueue_scripts', function () {
	wp_localize_script( 'geo-runtime', 'geoForms', array(
		'url'       => admin_url( 'admin-ajax.php' ),
		'maxUpload' => geo_form_max_upload(),
		'messages'  => array(
			'sending'  => 'Sending…',
			'error'    => 'Sorry, something went wrong and your message was not sent. Please call us at +1 (604) 584-4368 or email ' . geo_form_recipient() . '.',
			'required' => 'This field is required.',
			'tooBig'   => 'This file is larger than 20 MB. Please send a smaller file, or email it to ' . geo_form_recipient() . '.',
		),
	) );
}, 20 );

add_action( 'wp_ajax_geo_form_submit', 'geo_form_handle' );
add_action( 'wp_ajax_nopriv_geo_form_submit', 'geo_form_handle' );

function geo_form_handle() {
	// --- simple spam protection: hidden "honeypot" box must stay empty, form must not be sent instantly,
	//     and one visitor can send at most 10 forms per hour.
	$hp      = isset( $_POST['geo_hp'] ) ? trim( wp_unslash( $_POST['geo_hp'] ) ) : ''; // phpcs:ignore
	$started = isset( $_POST['geo_t'] ) ? (int) $_POST['geo_t'] : 0; // phpcs:ignore
	if ( '' !== $hp || ( $started && time() - $started < 3 ) ) {
		wp_send_json_success( array( 'spam' => true ) ); // pretend success to bots
	}
	$ip_key = 'geo_form_rate_' . md5( isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '' ); // phpcs:ignore
	$count  = (int) get_transient( $ip_key );
	if ( $count >= 10 ) {
		wp_send_json_error( array( 'message' => 'Too many submissions. Please try again later or call us.' ), 429 );
	}
	set_transient( $ip_key, $count + 1, HOUR_IN_SECONDS );

	// --- what was submitted
	$form_name = sanitize_text_field( wp_unslash( isset( $_POST['geo_form'] ) ? $_POST['geo_form'] : 'Website form' ) ); // phpcs:ignore
	$page_url  = esc_url_raw( wp_unslash( isset( $_POST['geo_page'] ) ? $_POST['geo_page'] : '' ) ); // phpcs:ignore
	$kind      = isset( $_POST['geo_kind'] ) && 'newsletter' === $_POST['geo_kind'] ? 'newsletter' : 'enquiry'; // phpcs:ignore
	$raw       = json_decode( wp_unslash( isset( $_POST['geo_fields'] ) ? $_POST['geo_fields'] : '[]' ), true ); // phpcs:ignore
	$fields    = array();
	foreach ( is_array( $raw ) ? $raw : array() as $f ) {
		$label = isset( $f['label'] ) ? sanitize_text_field( $f['label'] ) : '';
		$value = isset( $f['value'] ) ? sanitize_textarea_field( $f['value'] ) : '';
		if ( '' !== $label && '' !== $value ) { $fields[] = array( $label, $value ); }
		if ( count( $fields ) >= 120 ) { break; }
	}
	$customer = isset( $_POST['geo_email'] ) ? sanitize_email( wp_unslash( $_POST['geo_email'] ) ) : ''; // phpcs:ignore
	$customer = is_email( $customer ) ? $customer : '';
	if ( ! $fields ) {
		wp_send_json_error( array( 'message' => 'The form was empty.' ), 400 );
	}

	// --- attachments (inquiry forms): checked, stored briefly, attached, then deleted
	$attachments = array();
	$attach_note = array();
	if ( ! empty( $_FILES ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		foreach ( $_FILES as $file ) { // phpcs:ignore
			if ( empty( $file['name'] ) || UPLOAD_ERR_NO_FILE === $file['error'] ) { continue; }
			if ( UPLOAD_ERR_OK !== $file['error'] || $file['size'] > geo_form_max_upload() ) {
				$attach_note[] = sanitize_file_name( $file['name'] ) . ' (not attached: too large or failed to upload)';
				continue;
			}
			$check = wp_check_filetype_and_ext( $file['tmp_name'], $file['name'], geo_form_allowed_mimes() );
			if ( empty( $check['ext'] ) ) {
				$attach_note[] = sanitize_file_name( $file['name'] ) . ' (not attached: file type not allowed)';
				continue;
			}
			$tmp = wp_tempnam( $file['name'] );
			$dst = trailingslashit( dirname( $tmp ) ) . 'geo-' . wp_generate_password( 6, false ) . '-' . sanitize_file_name( $file['name'] );
			@unlink( $tmp ); // phpcs:ignore
			if ( move_uploaded_file( $file['tmp_name'], $dst ) ) {
				$attachments[] = $dst;
				$attach_note[] = sanitize_file_name( $file['name'] ) . ' (attached)';
			}
		}
	}

	// --- email to the office
	$site    = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES );
	$is_news = 'newsletter' === $kind;
	$subject = $is_news ? "New newsletter sign-up from the $site website" : "New $form_name from the $site website";
	$rows    = '';
	foreach ( $fields as $f ) {
		$rows .= '<tr><th align="left" valign="top" style="padding:6px 12px 6px 0;color:#555;font-weight:600">' . esc_html( $f[0] ) . '</th><td style="padding:6px 0">' . nl2br( esc_html( $f[1] ) ) . '</td></tr>';
	}
	foreach ( $attach_note as $n ) {
		$rows .= '<tr><th align="left" style="padding:6px 12px 6px 0;color:#555;font-weight:600">File</th><td style="padding:6px 0">' . esc_html( $n ) . '</td></tr>';
	}
	$body = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">'
		. '<p><strong>' . esc_html( $form_name ) . '</strong>' . ( $page_url ? ' sent from <a href="' . esc_url( $page_url ) . '">' . esc_html( $page_url ) . '</a>' : '' ) . '</p>'
		. '<table cellspacing="0" cellpadding="0">' . $rows . '</table>'
		. ( $customer ? '<p style="color:#777">Reply to this email to answer the customer directly.</p>' : '' ) . '</div>';
	$headers = array( 'Content-Type: text/html; charset=UTF-8', 'From: ' . $site . ' Website <' . geo_form_recipient() . '>' );
	if ( $customer ) { $headers[] = 'Reply-To: ' . $customer; }
	$sent = wp_mail( geo_form_recipient(), $subject, $body, $headers, $attachments );

	// --- short copy for the customer (not for newsletter sign-ups)
	if ( $sent && $customer && ! $is_news ) {
		$copy = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">'
			. '<p>Thank you for contacting ' . esc_html( rtrim( $site, '.' ) ) . '. We have received your request and our team will contact you shortly with details.</p>'
			. '<p>Here is a copy of what you sent us:</p><table cellspacing="0" cellpadding="0">' . $rows . '</table>'
			. '<p>If anything needs changing, just reply to this email or call us at +1 (604) 584-4368.</p>'
			. '<p>' . esc_html( $site ) . '</p></div>';
		wp_mail( $customer, 'We received your request - ' . $site, $copy, array( 'Content-Type: text/html; charset=UTF-8', 'From: ' . $site . ' <' . geo_form_recipient() . '>', 'Reply-To: ' . geo_form_recipient() ) );
	}

	foreach ( $attachments as $a ) { @unlink( $a ); } // phpcs:ignore

	if ( ! $sent ) {
		wp_send_json_error( array( 'message' => 'mail-failed' ), 500 );
	}
	wp_send_json_success();
}
