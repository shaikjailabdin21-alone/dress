import { Link } from 'react-router-dom';

const contactDetails = [
  { label: 'Phone', value: '+91 90004 59539', href: 'tel:+919000459539' },
  { label: 'Phone', value: '+91 77319 35049', href: 'tel:+917731935049' },
  { label: 'Email', value: 'uu763654@gmail.com', href: 'mailto:uu763654@gmail.com' }
];

export default function ContentPage({ title, eyebrow = 'AL NISA COLLECTIONS', intro, sections = [], notice, actions = [], closing }) {
  return <main className="information-page" id="page-top">
    <header className="information-hero">
      <Link className="information-breadcrumb" to="/">HOME <span>·</span> AL NISA COLLECTIONS</Link>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
      {actions.length > 0 && <div className="information-actions">{actions.map(action => <Link className={action.secondary ? 'button button-secondary' : 'button'} key={action.to} to={action.to}>{action.label}</Link>)}</div>}
    </header>
    {notice && <aside className="information-notice">{notice}</aside>}
    <div className="information-sections">
      {sections.map((section, index) => <section className="information-section" key={section.title}>
        <span className="information-number">{String(index + 1).padStart(2, '0')}</span>
        <div className="information-section-body">
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          {section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
          {section.note && <p className="information-inline-note">{section.note}</p>}
          {section.contact && <address className="information-contact-list">{contactDetails.map(detail => <div key={detail.href}><span>{detail.label}</span><a href={detail.href}>{detail.value}</a></div>)}</address>}
        </div>
      </section>)}
    </div>
    {closing && <p className="information-closing">{closing}</p>}
    <div className="information-bottom-nav">
      <Link to="/contact">Questions? Contact us ↗</Link>
      <a href="#page-top">BACK TO TOP ↑</a>
    </div>
  </main>;
}
