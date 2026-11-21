import { Outlet } from 'react-router-dom';
import Header from '../navbar/Header.jsx';
import Footer from '../footer/Footer.jsx';

export default function SiteLayout() { return <><Header/><Outlet/><Footer/></>; }
