import { Link, useLocation } from 'react-router-dom'

function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center bg-white border-t border-gray-200 z-50">

      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">home</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Home</span>
      </Link>

      <Link to="/cardapio" className={`flex flex-col items-center ${location.pathname === '/cardapio' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">restaurant_menu</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Menu</span>
      </Link>

      <Link to="/delivery" className={`flex flex-col items-center ${location.pathname === '/delivery' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">delivery_dining</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Order</span>
      </Link>

      <Link to="/reservas" className={`flex flex-col items-center ${location.pathname === '/reservas' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">event_upcoming</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Book</span>
      </Link>

    </nav>
  )
}

export default BottomNav