import { Link } from 'react-router-dom';

export default function SectionTitle({ overline, title, to }) { return <div className="section-title"><div><span className="eyebrow">{overline}</span><h2 dangerouslySetInnerHTML={{ __html: title }}/></div><Link className="text-link" to={to}>VIEW ALL ↗</Link></div>; }
