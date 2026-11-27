/**
 * Customer reviews, copied word-for-word from Geo Pallet's two Google Business Profiles
 * (checked 2026-11-27). All are 5-star reviews.
 *
 * To add a new review: copy it from Google exactly as written, add it below with its location,
 * and update the rating/count in GOOGLE_PROFILES if they changed. Then publish.
 */

export type Location = "Surrey" | "Langley";

/** The two Google profiles. Ratings and counts are copied by hand; update them now and then. */
export const GOOGLE_PROFILES: Record<Location, { placeId: string; rating: number; count: number; address: string }> = {
  Surrey: { placeId: "ChIJMwANzRjYhVQRvA4V67b5zHI", rating: 5.0, count: 32, address: "11180 120 St, Surrey" },
  Langley: { placeId: "ChIJCQu2T9vThVQR2fH5mD6H5-Y", rating: 4.9, count: 18, address: "8910 256 St Unit #1, Langley" },
};

export const googleLinks = (loc: Location) => {
  const id = GOOGLE_PROFILES[loc].placeId;
  return {
    reviews: `https://search.google.com/local/reviews?placeid=${id}`,
    write: `https://search.google.com/local/writereview?placeid=${id}`,
    map: `https://www.google.com/maps/place/?q=place_id:${id}`,
  };
};

/** Shown in this order in the sliding cards: Surrey and Langley mixed. */
export const TESTIMONIALS: { name: string; text: string; location: Location }[] = [
  { location: "Surrey", name: "Tauseef Waraich", text: "Highly professional team and their customer dealing is top notch! I have visited their facility and the office and they are such an environmental friendly company, who are recycling and re-using as well as producing new products. Very happy!" },
  { location: "Langley", name: "Bilal Cheema", text: "These guys have really upped their game. They are always improving their service while taking care of their people, their staff and making improvements in systems and operations. I also like their social media game. Its on point. Well done team GEO." },
  { location: "Surrey", name: "Mike & Debbie Strother", text: "I had business dealing with Geo Pallet for over 10 years. Excellent company to do business with. Always professional" },
  { location: "Langley", name: "Ammar Zaidi", text: "Awesome experience with Geo Pallet! Professional service, on time delivery and easy communication. Highly recommended!" },
  { location: "Surrey", name: "Sherdil Mahmood", text: "I had a good experience with Geo Pallet in terms of affordable pricing with delivery of quality pallets. I ordered a mix of standard and custom pallets. The thing i liked most was customer service and delivery of pallets on short notice. Looking forward to working with them in long-run." },
  { location: "Langley", name: "Zahid Sattar", text: "Excellent customer service, very professional in dealing with and staff was helpful, best custom pallet company in the lower mainland highly recommended thank you Geo Pallet" },
  { location: "Surrey", name: "Kais Naibkhil", text: "These guys are great, their fast, their reliable and their professionals. I would highly recommend them to anyone that requires good quality with competitive pricing." },
  { location: "Langley", name: "Owais Iqbal", text: "I have known the people at Geo for a while and had nothing but great experiences each visit. They are honest and authentic and are always willing to take the extra mile to exceed your expectations. Highly recommend!" },
  { location: "Surrey", name: "Hashim Mobeen", text: "Highly recommended if your looking for an on time service with good quality pallets. Sales team really helped to bring cost down as well." },
  { location: "Langley", name: "Mujahid Ahmed", text: "Amazing group of people! Easy to deal with from the workers to the management. High quality pallet. The factory is located at an amazing area over looking the water. Highly recommend for any pallet needs" },
  { location: "Surrey", name: "Saad Siddiqui", text: "Geo Pallet understands pallet business well, competitive pricing, great service, always a pleasure to deal with and I would strongly recommend this company for all kinds of pallet supply needs." },
  { location: "Langley", name: "Aatika Akbar", text: "Very professional and nice people! They’re punctual and easy to deal with so I recommend them for any pallet needs" },
  { location: "Surrey", name: "Waheed Sabir", text: "Excellent customer service. I know the Owner personally. Very hard working and honest people. Highly recommend to all my friends and family." },
  { location: "Langley", name: "Hassaan Sheikh", text: "Competitive pricing, great 1:1 customer service. Do lots of good stuff for the community as well which is especially impressive" },
];
