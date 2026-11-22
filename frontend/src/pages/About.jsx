import ContentPage from '../components/common/ContentPage.jsx';
import { Link } from 'react-router-dom';

export default function About() {
  return <ContentPage title="Our story">
    <p>AL NISA COLLECTIONS is a destination for elegant modest fashion, curated by UMAR ALI. We bring together dresses, abayas, hijabs and thoughtful accessories for the moments that matter.</p>
    <p>Every piece begins with a feeling: considered proportions, beautiful textures and details chosen to make modest dressing feel personal. Our collection changes as new pieces arrive, so there is always something new to discover.</p>
    <div className="story-actions"><Link className="button" to="/shop">EXPLORE THE COLLECTION ↗</Link><a className="button button-secondary" href="https://wa.me/917731935049" target="_blank" rel="noreferrer">CONTACT US ON WHATSAPP</a></div>
  </ContentPage>;
}
