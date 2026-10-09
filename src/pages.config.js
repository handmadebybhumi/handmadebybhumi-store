import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import Wishlist from './pages/Wishlist';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ProductDetail": ProductDetail,
    "Cart": Cart,
    "Checkout": Checkout,
    "OrderSuccess": OrderSuccess,
    "Payment": Payment,
    "Wishlist": Wishlist,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};