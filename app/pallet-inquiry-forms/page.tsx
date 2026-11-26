import Image from "next/image";
import { Suspense } from "react";
import InquiryForms from "@/components/InquiryForms";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import styles from "./inquiry.module.css";

export const metadata = pageMetadata({
  title: "Pallet Quote Request Form | Geo Pallet Ltd.",
  description:
    "Request a quote for new or custom wooden pallets from Geo Pallet. Share your pallet type, size, quantity and delivery needs in British Columbia.",
  path: "/pallet-inquiry-forms/",
});

export default function InquiryPage() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.head}>
          <Image src="/wp-content/uploads/2025/04/geo-pallet-logo-red.png" alt="Geo Pallet Ltd. logo" width={261} height={163} />
          <div>
            <h1 className={styles.h1}>Pallet Quote Request Form</h1>
            <p>
              We are pleased to offer a quotation for high-quality wooden pallets, designed for durability and efficient material handling.
              Please review the details below and contact us for any further information.
            </p>
          </div>
        </div>
        <div className={styles.body}>
          <Suspense fallback={<p className={styles.loading}>Loading the form…</p>}>
            <InquiryForms />
          </Suspense>
        </div>
      </div>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Pallet inquiry forms", path: "/pallet-inquiry-forms/" }])} />
    </section>
  );
}
