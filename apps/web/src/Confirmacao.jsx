import { useCarrinho } from './CarrinhoContext'
import { useNavigate } from 'react-router-dom'

function Confirmacao() {
  const { total, itens } = useCarrinho()
  const navigate = useNavigate()

  const numeroPedido = Math.floor(Math.random() * 9000) + 1000

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pb-24">

      <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-gold text-5xl">check_circle</span>
      </div>

      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-2 text-center">
        Pedido Confirmado!
      </h1>
      <p className="text-stone-400 text-sm text-center mb-8">
        Seu pedido foi recebido e está sendo preparado
      </p>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 w-full max-w-sm mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1">Número do Pedido</p>
        <p className="font-playfair text-2xl font-bold text-gold">#{numeroPedido}</p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 w-full max-w-sm mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1">Tempo Estimado</p>
        <p className="font-semibold text-stone-800 text-lg">35 – 45 minutos</p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 w-full max-w-sm mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1">Total Pago</p>
        <p className="font-semibold text-gold text-lg">R$ {total},00</p>
      </div>

      <button
        onClick={() => navigate('/delivery')}
        className="w-full max-w-sm bg-gold text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
      >
        Acompanhar Pedido
      </button>

      <button
        onClick={() => navigate('/')}
        className="w-full max-w-sm border border-stone-300 text-stone-500 py-4 rounded-full text-xs font-semibold tracking-widest uppercase"
      >
        Voltar ao Início
      </button>

    </main>
  )
}

export default Confirmacao