import AppRoutes from './routes/AppRoutes.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';

export default function App() {
  return <ProductProvider><CartProvider><AppRoutes/></CartProvider></ProductProvider>;
}
