import ContentPage from '../components/common/ContentPage.jsx';

const sections = [
  {
    title: 'Our Privacy Practices',
    paragraphs: ['At AL NISA COLLECTIONS, we respect your privacy and value your trust.'],
    items: [
      'We collect customer information only when needed for enquiries and orders.',
      'Your personal details are used to provide customer support and process orders.',
      'We do not intentionally sell your personal information to others.',
      'We take reasonable steps to protect customer information.',
      'We may update this Privacy Policy when necessary.'
    ]
  },
  {
    title: 'Privacy Questions',
    paragraphs: ['For any privacy-related questions, please contact AL NISA COLLECTIONS.'],
    contact: true
  }
];

export default function PrivacyPolicy() {
  return <ContentPage title="Privacy Policy" eyebrow="YOUR PRIVACY · OUR PRACTICES" intro="Information about how AL NISA COLLECTIONS respects your privacy." sections={sections}/>;
}
