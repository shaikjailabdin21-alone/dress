import ContentPage from '../components/common/ContentPage.jsx';

const sections = [
  {
    title: 'Our Belief',
    paragraphs: ['We believe modest fashion is a beautiful expression of elegance, comfort and confidence.']
  },
  {
    title: 'Our Collection',
    paragraphs: ['Our collection includes Abayas, Hijabs, Niqabs, Khimars, Burkhas and other modest fashion essentials.']
  },
  {
    title: 'Our Goal',
    paragraphs: ['Our goal is to bring you beautiful collections with quality, comfort and style.']
  }
];

export default function About() {
  return <ContentPage
    title="About Us"
    eyebrow="AL NISA COLLECTIONS"
    intro="Welcome to AL NISA COLLECTIONS!"
    sections={sections}
    closing="AL NISA COLLECTIONS – Elegance in Every Thread."
    actions={[
      { to: '/shop', label: 'EXPLORE THE COLLECTION ↗' },
      { to: '/contact', label: 'CONTACT US', secondary: true }
    ]}
  />;
}
