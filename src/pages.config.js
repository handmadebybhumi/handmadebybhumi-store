import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';
import AdminCustomers from './pages/AdminCustomers';
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

export const ADMIN_PAGES = {
    "AdminLogin": AdminLogin,
    "AdminProducts": AdminProducts,
    "AdminProductEdit": AdminProductEdit,
    "AdminDashboard": AdminDashboard,
    "AdminOrders": AdminOrders,
    "AdminOrderDetail": AdminOrderDetail,
    "AdminCustomers": AdminCustomers,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    AdminPages: ADMIN_PAGES,
    Layout: Layout,
};
