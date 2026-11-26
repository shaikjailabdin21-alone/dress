import { useState } from 'react';

const contacts = {
  primary: { label: '+91 90004 59539', digits: '919000459539' },
  secondary: { label: '+91 77319 35049', digits: '917731935049' },
  email: 'uu763654@gmail.com'
};

const enquiryTypes = [
  'Product enquiry',
  'Hijab colour availability',
  'Order enquiry',
  'Delivery information',
  'Payment details',
  'Product recommendation',
  'Return or exchange enquiry'
];

function Icon({ name, className = '' }) {
  const paths = {
    bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.6-.85L4 20l1.2-3.5A7.2 7.2 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z"/><path d="M8 12h8M8 15h5"/></>,
    phone: <><path d="M7 3h10v18H7z"/><path d="M10 6h4M11 18h2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
    sparkle: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>
  };
  return <svg className={`contact-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function whatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export default function Contact() {
  const [formStatus, setFormStatus] = useState(null);
  const [whatsAppDraft, setWhatsAppDraft] = useState('');

  const submitEnquiry = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setWhatsAppDraft('');
      setFormStatus({ type: 'error', text: 'Please check the highlighted fields and complete the form before continuing.' });
      return;
    }

    const data = new FormData(form);
    const customerName = String(data.get('name') || '').trim();
    const mobile = String(data.get('mobile') || '').trim();
    const email = String(data.get('email') || '').trim();
    const enquiry = String(data.get('enquiry') || 'General enquiry');
    const message = String(data.get('message') || '').trim();
    if (!customerName || !mobile || !email || !message) {
      setWhatsAppDraft('');
      setFormStatus({ type: 'error', text: 'Please complete each field with valid information.' });
      return;
    }
    const text = [
      'Hello AL NISA COLLECTIONS, I have an enquiry.',
      '',
      `Name: ${customerName}`,
      `Mobile: ${mobile}`,
      `Email: ${email}`,
      `Enquiry type: ${enquiry}`,
      '',
      `Message: ${message}`
    ].join('\n');

    setWhatsAppDraft(whatsAppUrl(contacts.primary.digits, text));
    setFormStatus({ type: 'success', text: 'Your enquiry is ready. Open WhatsApp below and press Send to contact us.' });
  };

  return <main className="contact-page">
    <header className="contact-hero">
      <span className="eyebrow">AL NISA COLLECTIONS · HERE TO HELP</span>
      <h1>Contact <i>us</i></h1>
      <p>Thoughtful service for every piece, every order and every occasion.</p>
    </header>

    <section className="contact-about" aria-labelledby="contact-about-heading">
      <Icon name="sparkle"/>
      <div>
        <span className="contact-kicker">ABOUT OUR STORE</span>
        <h2 id="contact-about-heading">Modest fashion, thoughtfully chosen.</h2>
        <p>Welcome to AL NISA COLLECTIONS. Discover elegant modest fashion with beautiful collections designed for comfort, quality and style.</p>
      </div>
    </section>

    <div className="contact-layout">
      <div className="contact-sidebar">
        <section className="contact-panel help-panel" aria-labelledby="help-heading">
          <span className="contact-kicker">PERSONAL SERVICE</span>
          <h2 id="help-heading">How can we help you?</h2>
          <ul className="contact-help-list">
            {enquiryTypes.map(item => <li key={item}><span aria-hidden="true">✦</span>{item}</li>)}
          </ul>
        </section>

        <section className="contact-panel options-panel" aria-labelledby="options-heading">
          <span className="contact-kicker">CONTACT OPTIONS</span>
          <h2 id="options-heading">We’re just a message away.</h2>
          <div className="contact-option-list">
            <a className="contact-option contact-option-whatsapp" href={whatsAppUrl(contacts.primary.digits, 'Hello AL NISA COLLECTIONS, I have a product enquiry. Please help me with product details, colour availability and ordering.')} target="_blank" rel="noreferrer">
              <Icon name="chat"/><span><b>WhatsApp us</b><small>Product and order enquiries</small></span><span className="contact-arrow">↗</span>
            </a>
            <a className="contact-option" href={`tel:+${contacts.primary.digits}`}><Icon name="phone"/><span><b>Call us</b><small>{contacts.primary.label}</small></span></a>
            <a className="contact-option" href={`tel:+${contacts.secondary.digits}`}><Icon name="phone"/><span><b>Call us</b><small>{contacts.secondary.label}</small></span></a>
            <a className="contact-option" href={`mailto:${contacts.email}`}><Icon name="mail"/><span><b>Email us</b><small>{contacts.email}</small></span></a>
            <div className="contact-option contact-visit"><Icon name="pin"/><span><b>Visit our store</b><small>Contact us for the store location and visiting details.</small></span></div>
          </div>
        </section>
      </div>

      <section className="contact-panel contact-form-panel" aria-labelledby="form-heading">
        <span className="contact-kicker">WE’D LOVE TO HEAR FROM YOU</span>
        <h2 id="form-heading">Send an enquiry</h2>
        <p className="contact-form-intro">Share a few details and your enquiry will be prepared in WhatsApp for you to send.</p>
        <form className="contact-form" noValidate onSubmit={submitEnquiry}>
          <label>Customer name<input name="name" type="text" autoComplete="name" maxLength="100" placeholder="Your name" required/></label>
          <label>Mobile number<input name="mobile" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() .-]{8,20}" maxLength="20" placeholder="Your mobile number" title="Enter a valid phone number using 8 to 20 digits or phone symbols." required/></label>
          <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" placeholder="you@example.com" required/></label>
          <label>Select enquiry type<select name="enquiry" defaultValue="" required><option value="" disabled>Choose an enquiry</option>{enquiryTypes.map(item => <option key={item}>{item}</option>)}</select></label>
          <label className="contact-message-field">Message<textarea name="message" rows="5" minLength="10" maxLength="1500" placeholder="Tell us what you would like help with…" required/></label>
          <button className="button contact-submit" type="submit"><Icon name="mail"/>SUBMIT ENQUIRY</button>
        </form>
        {formStatus && <div className={`contact-form-status ${formStatus.type}`} role={formStatus.type === 'error' ? 'alert' : 'status'}>{formStatus.text}{whatsAppDraft && <a className="button contact-send-link" href={whatsAppDraft} target="_blank" rel="noreferrer"><Icon name="chat"/>OPEN WHATSAPP ↗</a>}</div>}
        <p className="contact-privacy-note">Submitting opens a WhatsApp draft addressed to our listed business number. Your message is sent only when you press Send in WhatsApp.</p>
      </section>
    </div>
  </main>;
}
