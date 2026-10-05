export interface RoomSpec {
  label: string;
  value: string;
}

export interface RoomInfo {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  specs: RoomSpec[];
  startFrame: number;
  endFrame: number;
  centerProgress: number; // progress between 0 and 1
  alignment: "bottom-left" | "bottom-right";
}

export const TOTAL_FRAMES = 341;
export const INITIAL_PRELOAD_COUNT = 150;

export const ROOMS: RoomInfo[] = [
  {
    id: "entrance",
    number: "01",
    name: "Grand Vestibule & Atrium",
    subtitle: "Arrival Experience",
    tagline: "Monumental pivot threshold & double-height skyward gallery",
    description:
      "A monumental solid teak pivot door opens into a soaring double-height atrium featuring a sculptural floating staircase with glass balustrade and a curated Japanese bonsai courtyard.",
    specs: [
      { label: "Ceiling", value: "6.2m Double-height" },
      { label: "Staircase", value: "Floating Glass Cantilever" },
      { label: "Threshold", value: "Oversized Teak Pivot" },
    ],
    startFrame: 1,
    endFrame: 55,
    centerProgress: 0.08,
    alignment: "bottom-left",
  },
  {
    id: "living",
    number: "02",
    name: "The Grand Pavilion",
    subtitle: "Living & Social Realm",
    tagline: "Panoramic column-free living behind bespoke walnut pocket doors",
    description:
      "Handcrafted walnut pocket doors slide open to reveal an expansive social salon with low-profile bouclé seating, honed limestone flooring, and seamless floor-to-ceiling glass connections to the pool terrace.",
    specs: [
      { label: "Apertures", value: "Full-Height Pocket Glazing" },
      { label: "Flooring", value: "Honed French Limestone" },
      { label: "Millwork", value: "Custom American Walnut" },
    ],
    startFrame: 56,
    endFrame: 115,
    centerProgress: 0.25,
    alignment: "bottom-right",
  },
  {
    id: "kitchen",
    number: "03",
    name: "Culinary Sanctuary",
    subtitle: "Kitchen & Dining Atelier",
    tagline: "Calacatta marble waterfall island & warm ambient lighting",
    description:
      "A masterclass in culinary elegance featuring a bookmatched marble waterfall island, fluted walnut cabinetry, warm recessed LED glow, and sculptural brushed brass pendant fixtures.",
    specs: [
      { label: "Island", value: "Bookmatched Marble Monolith" },
      { label: "Fixtures", value: "Brushed Brass Pendants" },
      { label: "Joinery", value: "Fluted Warm Walnut" },
    ],
    startFrame: 116,
    endFrame: 175,
    centerProgress: 0.42,
    alignment: "bottom-left",
  },
  {
    id: "bedroom",
    number: "04",
    name: "Master Suite",
    subtitle: "Private Horizon",
    tagline: "Quiet luxury tailored with private salon & recessed ceiling coves",
    description:
      "An intimate master haven designed with recessed ceiling coves, tailored upholstered bed, plush wool-silk carpeting, and a framed axial view directly into the en-suite wellness bath.",
    specs: [
      { label: "Suite Layout", value: "Axial En-Suite Flow" },
      { label: "Lighting", value: "Concealed Circadian Coves" },
      { label: "Textiles", value: "Custom Wool-Silk Weave" },
    ],
    startFrame: 176,
    endFrame: 230,
    centerProgress: 0.59,
    alignment: "bottom-right",
  },
  {
    id: "bathroom",
    number: "05",
    name: "Spa Enclave",
    subtitle: "Wellness Bath",
    tagline: "Floor-to-ceiling bookmatched marble & dual illuminated mirrors",
    description:
      "Hand-selected Calacatta marble envelops this private wellness sanctuary, complete with a deep ergonomic soaking tub, floating walnut vanity, twin illuminated mirrors, and a frameless rainfall shower suite.",
    specs: [
      { label: "Soaking Tub", value: "Freestanding Ergonomic Bath" },
      { label: "Surfaces", value: "Bookmatched Calacatta Marble" },
      { label: "Vanity", value: "Dual Backlit Mirrors" },
    ],
    startFrame: 231,
    endFrame: 285,
    centerProgress: 0.76,
    alignment: "bottom-left",
  },
  {
    id: "garden",
    number: "06",
    name: "Reflecting Courtyard & Grounds",
    subtitle: "Outdoor Oasis & Pool Terrace",
    tagline: "25m turquoise infinity pool & illuminated sunset facade",
    description:
      "The villa culminates in an expansive travertine terrace, a 25-meter turquoise infinity pool, relaxed poolside daybeds, and an extraordinary illuminated panorama of the two-story glass facade at dusk.",
    specs: [
      { label: "Pool", value: "25m Turquoise Infinity" },
      { label: "Terrace", value: "Honed Roman Travertine" },
      { label: "Panorama", value: "Two-Story Illuminated Dusk" },
    ],
    startFrame: 286,
    endFrame: 341,
    centerProgress: 0.92,
    alignment: "bottom-right",
  },
];

export function getFrameUrl(frameNumber: number): string {
  const clamped = Math.min(TOTAL_FRAMES, Math.max(1, frameNumber));
  const padded = clamped.toString().padStart(3, "0");
  return `/frames/frame_${padded}.png`;
}
