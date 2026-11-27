import Image from "next/image";
import Link from "next/link";
import { Eyebrow, Members, PageHero, Stat, Testimonials } from "@/components/Blocks";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import LiteYouTube from "@/components/LiteYouTube";
import StoryScroller, { type StoryItem } from "@/components/StoryScroller";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { BUSINESS, absoluteUrl } from "@/lib/site";
import styles from "./about.module.css";

export const metadata = pageMetadata({
  title: "About Geo Pallet Ltd | Trusted Pallet Company in BC",
  description:
    "Discover Geo Pallet, Canada's trusted provider of custom wooden pallet solutions. We prioritize quality, innovation, and exceptional service.",
  path: "/about/",
  image: "/wp-content/uploads/2026/05/Updated-team-boss.jpg",
  imageAlt: "Geo Pallet Ltd. team",
});

const STORY: StoryItem[] = [
  {
    icon: "clipboardCheck",
    title: "Why Geo Pallet Began",
    lead: "Built to Meet a Need in B.C.",
    image: "/wp-content/uploads/2026/03/geo-pallet-facility-british-columbia.jpeg",
    body: (
      <p>
        Geo Pallet Ltd. was created to solve a common challenge across British Columbia: businesses needed strong, reliable, custom
        wooden pallets delivered on time and built with consistent quality.
      </p>
    ),
  },
  {
    icon: "peopleCarry",
    title: "Founding of Geo Pallet Ltd. (2007)",
    lead: "Founded by Industry Leaders",
    image: "/wp-content/uploads/2026/03/pallet-repair-worker-nail-gun.jpeg",
    body: (
      <>
        <p>
          Geo Pallet Ltd. was established in 2007 by <strong>Arshad Latif</strong> and <strong>Muhammed Ezaz Qazi,</strong> combining
          extensive hands-on experience in pallet manufacturing.
        </p>
        <p>
          <strong>Mr. Latif</strong> previously owned a well-known pallet making company in British Columbia. Together they built Geo
          Pallet with a focus on quality, dependability, and long term customer trust
        </p>
      </>
    ),
  },
  {
    icon: "warehouse",
    title: "Building the Foundation",
    lead: "How We Built Trust and Strengthened Operations",
    image: "/wp-content/uploads/2026/04/geo-pallet-lumber-yard.jpeg",
    body: (
      <>
        <p>With years of experience behind them, the founders grew Geo Pallet through:</p>
        <ul>
          <li>Hands-on operations and strong shop-floor discipline</li>
          <li>Long-term relationships with customers and suppliers</li>
          <li>Continuous improvements in production, quality control, and delivery planning</li>
        </ul>
      </>
    ),
  },
  {
    icon: "peopleArrows",
    title: "Inheritance and Active Involvement",
    lead: "Continuing the Legacy Leading Today",
    image: "/wp-content/uploads/2026/04/geo-pallet-team-measuring-lumber.jpeg",
    body: (
      <>
        <p>
          Hammadullah Qazi and Omar Arshad inherited both the company and the industry expertise behind it. Today, they are actively
          involved in:
        </p>
        <ul>
          <li>Company direction and strategic decisions</li>
          <li>Daily management and operational oversight</li>
          <li>Maintaining high standards across B.C. facilities</li>
        </ul>
      </>
    ),
  },
  {
    icon: "sortUp",
    title: "The Gaps We Solved",
    lead: "From Industry Gaps to Engineered Solutions",
    image: "/wp-content/uploads/2026/03/heat-treated-pallets-ht-stamp-printing.jpeg",
    body: (
      <>
        <p>Geo Pallet was built to address real, everyday challenges businesses faced:</p>
        <ul>
          <li>Inconsistent pallet quality</li>
          <li>Unreliable timelines and late deliveries</li>
          <li>Limited custom pallet solutions</li>
          <li>Weak customer support and slow responsiveness</li>
          <li>Engineered Product Development</li>
          <li>Innovation Through Automation</li>
          <li>Improved Waste Control</li>
          <li>Smart Manufacturing Solutions</li>
        </ul>
      </>
    ),
  },
];

const BENEFITS = [
  { icon: "/wp-content/uploads/2026/03/icons8-pricing-48.png", title: "Competitive Pricing", text: "We provide reliable pallet solutions that offer long-term value while keeping quality and durability a top priority." },
  { icon: "/wp-content/uploads/2026/03/icons8-example-50-1.png", title: "Tailor-made Strategies", text: "We create custom pallet solutions based on your business needs, instead of offering the same option to everyone." },
  { icon: "/wp-content/uploads/2026/03/icons8-good-quality-50-1.png", title: "Highest Quality Production", text: "We build every wooden pallet with care and maintain strict quality checks throughout each step of the production process." },
  { icon: "/wp-content/uploads/2026/03/icons8-goal-oriented-focus-50-1.png", title: "Customer-centric Focus", text: "We take the time to understand each customer’s needs and work hard to deliver results they can rely on for the long run." },
];

const MVG = [
  { title: "Our Mission", text: "Making shipping easier, more efficient, and cost-effective for every business." },
  { title: "Our Vision", text: "To be leading wooden pallet provider across North America, recognized for quality and innovation." },
  { title: "Our Goal", text: "Consistently supplying the best wooden pallets at the greatest value, ensuring customer satisfaction and success." },
];

export default function AboutPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about/" }];
  return (
    <>
      <PageHero
        title="About Us"
        intro={<p>We are committed to understanding each client’s vision and consistently delivering beyond expectations through trust &amp; clarity.</p>}
      />

      <section className="section" aria-label="Our story">
        <div className="container">
          <StoryScroller items={STORY} />
        </div>
      </section>

      <section className="section" aria-labelledby="logo-title">
        <div className="container narrow center reveal">
          <Eyebrow>You&apos;ve heard our story</Eyebrow>
          <h2 id="logo-title" className={styles.logoTitle}>Now lets talk about our logo</h2>
          <p>It might look like a mark on a leaf, but it represents something much deeper</p>
        </div>
        <div className={`container split ${styles.logo}`}>
          <div className="reveal">
            <Eyebrow>A Symbol of Canada&apos;s Identity, Growth, &amp; Natural Beauty</Eyebrow>
            <h3 className={styles.h3}>Logo Rationale</h3>
            <p>
              Our logo started with the Maple Leaf to represent our Canadian roots and the care we put into our work. As we grew, we added
              more elements to tell our story. The upward graph represents growth, while the Three Sisters Mountains reflect the values we
              stand by: trust, kindness, and confidence. Together, these details show our journey, our progress, and the kind of impact we
              want to make.
            </p>
            <div className="btn-row">
              <Link href="/geo-pallet-logo/" className="btn">Read More</Link>
              <a href="https://youtu.be/dc6iyPsnslM" target="_blank" rel="noopener" className="btn btn-ghost">
                <Icon name="play" /> Watch Video
              </a>
            </div>
          </div>
          <LiteYouTube id="dc6iyPsnslM" title="The story behind the Geo Pallet logo" className={styles.video} />
        </div>
      </section>

      <section className="section" aria-labelledby="team-title">
        <div className={`container ${styles.team}`}>
          <div className={styles.teamLeft}>
            <Image
              src="/wp-content/uploads/2026/05/Updated-team-boss.jpg"
              alt="Geo Pallet Ltd. team"
              width={1512}
              height={921}
              sizes="(max-width: 1024px) 100vw, 640px"
              className={styles.teamImg}
            />
            <div className={styles.teamStat}>
              <Stat value="1,000+" label="Happy Clients" />
            </div>
          </div>
          <div className={styles.teamRight}>
            <div className={`card ${styles.teamCard}`}>
              <h2 id="team-title" className="h-md">A Company Built on Teamwork</h2>
              <p>
                Geo Pallet has a great team culture. The people here are reliable, easy to work with, and take real pride in what they do.
                Everyone works together with a positive attitude, which makes Geo Pallet a place built on trust, teamwork, and good work every
                day.
              </p>
            </div>
            <div className={styles.mvg} tabIndex={0} aria-label="Our mission, vision and goal (scroll sideways)">
              {MVG.map((m) => (
                <figure key={m.title} className={styles.mvgItem}>
                  <blockquote>{m.text}</blockquote>
                  <figcaption>{m.title}</figcaption>
                </figure>
              ))}
            </div>
            <div className="grid grid-2">
              <Stat value="20+" label="Years of Experience" />
              <Stat value="99%" label="Positive Reviews" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="benefits-title">
        <div className="container narrow center reveal">
          <Eyebrow>Driven by Innovation</Eyebrow>
          <h2 id="benefits-title" className="h-md">Key Benefits</h2>
          <p>
            Businesses move quickly, and having the right pallet solution makes a real difference. At Geo Pallet, we build custom wooden
            pallets that fit what each customer needs. We focus on quality, practical ideas, and service people can count on. When you work
            with us, you get more than pallets. You get a team that wants to help your business run smoothly and grow.
          </p>
        </div>
        <ol className={`container ${styles.benefits}`}>
          {BENEFITS.map((b, i) => (
            <li key={b.title} className={`card card-dashed reveal ${styles.benefit}`}>
              <Image src={b.icon} alt="" width={50} height={50} />
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              {i < BENEFITS.length - 1 ? <Icon name="arrowRight" className={styles.benefitArrow} /> : null}
            </li>
          ))}
        </ol>
      </section>

      <Testimonials intro="Our customers push us to keep getting better. We regularly review our process to make sure we’re doing things properly and giving customers the quality products and service they need." />
      <Members />

      <section className={styles.policy} aria-labelledby="policy-title">
        <div className="container reveal">
          <h2 id="policy-title" className={styles.policyTitle}>Business Quality Policy</h2>
          <p>
            Our customers are at the center of everything we do. We care about delivering quality work and making sure every order meets the
            standards our customers expect. Our team works hard to keep improving through regular training, careful checks, and learning
            from experience so we can continue providing reliable products and service people can trust.
          </p>
          <Link href="/contact-geo-pallet/" className="btn">Talk to us</Link>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: absoluteUrl("/about/"),
            name: "About Geo Pallet Ltd.",
            about: { "@id": `${absoluteUrl("/").replace(/\/$/, "")}/#business` },
            mainEntity: {
              "@type": "Organization",
              name: BUSINESS.name,
              foundingDate: "2007",
              founders: [{ "@type": "Person", name: "Arshad Latif" }, { "@type": "Person", name: "Muhammed Ezaz Qazi" }],
            },
          },
        ]}
      />
    </>
  );
}
