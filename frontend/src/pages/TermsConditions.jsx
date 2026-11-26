import ContentPage from '../components/common/ContentPage.jsx';

const sections = [
  {
    title: 'Website Terms',
    paragraphs: ['Welcome to AL NISA COLLECTIONS. By using our website, you agree to the following terms.'],
    items: [
      'Product colours may slightly vary depending on screen settings.',
      'Product availability may change without prior notice.',
      'Orders are subject to availability and confirmation.',
      'Prices and product details may be updated when necessary.',
      'Customers should provide correct contact and delivery information.',
      'Delivery, payment, cancellation and return arrangements will be communicated during order confirmation.',
      'All website content, images and branding belong to AL NISA COLLECTIONS unless otherwise stated.'
    ]
  },
  {
    title: 'Updates and Contact',
    paragraphs: ['We reserve the right to update these terms when necessary.']
  }
];

export default function TermsConditions() {
  return <ContentPage title="Terms & Conditions" eyebrow="CUSTOMER INFORMATION" intro="Please review these terms when using the AL NISA COLLECTIONS website." sections={sections} closing="For questions, please contact AL NISA COLLECTIONS."/>;
}
