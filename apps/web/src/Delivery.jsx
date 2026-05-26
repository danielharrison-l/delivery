import { useState } from 'react'
import pratoChef from '../assets/Prato_2.webp'
import burrata from '../assets/prato_3.webp'
import ravioli from '../assets/prato_4.webp'
import vieiras from '../assets/prato.webp'
import { useCarrinho } from './CarrinhoContext'
import { useNavigate } from 'react-router-dom'

function Delivery() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('ENTRADAS')
  const [qtdSacola, setQtdSacola] = useState(2)
  const { itens, adicionarItem, removerItem, subtotal, frete, total, modalAberto, setModalAberto } = useCarrinho()
  const navigate = useNavigate()
  const [pagamentoAberto, setPagamentoAberto] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('cartao')

  const categorias = ['ENTRADAS', 'PRATOS PRINCIPAIS', 'BEBIDAS', 'SOBREMESAS']

  const pratos = [
    {
      nome: 'Filet Mignon',
      preco: 'R$ 145',
      valor: 145,
      descricao: 'Corte nobre grelhado em chama aberta, acompanhado de purê de batatas com azeite de trufas brancas e aspargos.',
      tag: '',
      avaliacao: '4.9',
      img: pratoChef
    },
    {
      nome: 'Ravioli de Lagosta',
      preco: 'R$ 168',
      valor: 168,
      descricao: 'Massa artesanal recheada com lagosta fresca, servida com bisque de crustáceos e toque de dill.',
      tag: '',
      avaliacao: '4.8',
      img: ravioli
    },
    {
      nome: 'Burrata Lumière',
      preco: 'R$ 92',
      valor: 92,
      descricao: 'Burrata cremosa, mix de tomates orgânicos, pérolas de balsâmico e pesto de pistache.',
      tag: '',
      avaliacao: '4.7',
      img: burrata
    },
]

  return (

    <main className="pt-24 pb-32 max-w-5xl mx-auto px-5">
    
{modalAberto && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-xl font-bold text-stone-800">Seu Pedido</h2>
        <button onClick={() => setModalAberto(false)} className="text-stone-400">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {itens.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-8">Nenhum item adicionado</p>
      ) : (
        <div className="space-y-3 mb-6">
          {itens.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <p className="text-stone-700 text-sm font-semibold">{item.nome}</p>
                <p className="text-gold text-xs">{item.preco}</p>
              </div>
              <button 
                onClick={() => removerItem(index)}
                className="text-stone-300 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-stone-200 pt-4 space-y-2 mb-6">
        <div className="flex justify-between text-sm text-stone-500">
          <span>Subtotal</span>
          <span>R$ {subtotal},00</span>
        </div>
        <div className="flex justify-between text-sm text-stone-500">
          <span>Frete</span>
          <span>R$ {frete},00</span>
        </div>
        <div className="flex justify-between font-bold text-stone-800 text-lg pt-2 border-t border-stone-200">
          <span>Total</span>
          <span className="text-gold">R$ {total},00</span>
        </div>
      </div>

      <button 
        onClick={() => { setModalAberto(false); setPagamentoAberto(true) }}
        className="w-full bg-gold text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
      >
        Finalizar Pedido
      </button>

      <button 
        onClick={() => setModalAberto(false)}
        className="w-full border border-stone-300 text-stone-500 py-4 rounded-full text-xs font-semibold tracking-widest uppercase"
      >
        Continuar Comprando
      </button>
    </div>
  </div>
)}

{pagamentoAberto && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-xl font-bold text-stone-800">Pagamento</h2>
        <button onClick={() => setPagamentoAberto(false)} className="text-stone-400">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="bg-stone-50 rounded-xl p-4 mb-6 flex justify-between items-center">
        <span className="text-stone-500 text-sm">Total a pagar</span>
        <span className="text-gold font-bold text-lg">R$ {total},00</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setFormaPagamento('cartao')}
          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formaPagamento === 'cartao' ? 'border-gold text-gold' : 'border-stone-200 text-stone-400'}`}
        >
          <span className="material-symbols-outlined mb-1">credit_card</span>
          <span className="text-xs font-semibold">Cartão</span>
        </button>
        <button
          onClick={() => setFormaPagamento('pix')}
          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formaPagamento === 'pix' ? 'border-gold text-gold' : 'border-stone-200 text-stone-400'}`}
        >
          <span className="material-symbols-outlined mb-1">qr_code</span>
          <span className="text-xs font-semibold">Pix</span>
        </button>
        <button
          onClick={() => setFormaPagamento('dinheiro')}
          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formaPagamento === 'dinheiro' ? 'border-gold text-gold' : 'border-stone-200 text-stone-400'}`}
        >
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="text-xs font-semibold">Dinheiro</span>
        </button>
      </div>

      {formaPagamento === 'cartao' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1 block">Número do Cartão</label>
            <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
          </div>
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1 block">Nome no Cartão</label>
            <input type="text" placeholder="NOME SOBRENOME" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1 block">Validade</label>
              <input type="text" placeholder="MM/AA" maxLength="5" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1 block">CVV</label>
              <input type="text" placeholder="000" maxLength="3" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
            </div>
          </div>
        </div>
      )}

      {formaPagamento === 'pix' && (
        <div className="flex flex-col items-center mb-6">
          <div className="w-48 h-48 bg-stone-100 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-stone-400" style={{fontSize: '100px'}}>qr_code_2</span>
          </div>
          <p className="text-stone-500 text-sm text-center">Escaneie o QR code com o app do seu banco</p>
          <p className="text-xs text-stone-400 mt-2">Chave Pix: lumiere@restaurante.com</p>
        </div>
      )}

      {formaPagamento === 'dinheiro' && (
        <div className="bg-stone-50 rounded-xl p-4 mb-6 text-center">
          <span className="material-symbols-outlined text-gold text-4xl mb-2 block">payments</span>
          <p className="text-stone-600 text-sm">Pague <strong>R$ {total},00</strong> na entrega</p>
          <p className="text-stone-400 text-xs mt-1">Tenha o valor exato se possível</p>
        </div>
      )}

      <button
        onClick={() => { setPagamentoAberto(false); navigate('/confirmacao') }}
        className="w-full bg-gold text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
      >
        {formaPagamento === 'pix' ? 'Já fiz o pagamento' : formaPagamento === 'dinheiro' ? 'Confirmar Pedido' : `Pagar R$ ${total},00`}
      </button>

      <button
        onClick={() => { setPagamentoAberto(false); setModalAberto(true) }}
        className="w-full border border-stone-300 text-stone-500 py-4 rounded-full text-xs font-semibold tracking-widest uppercase"
      >
        Voltar ao Carrinho
      </button>

    </div>
  </div>
)}

      <div className="mb-10 bg-stone-50 border border-stone-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <span className="material-symbols-outlined">delivery_dining</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-800">Entrega em andamento</h2>
            <p className="text-stone-500 text-sm">Estimativa: 35–45 min</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-grow max-w-xs">
          <div className="flex justify-between text-xs font-semibold tracking-widest uppercase text-gold">
            <span>PREPARANDO</span>
            <span className="text-stone-400">A CAMINHO</span>
          </div>
          <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-gold w-[65%]"></div>
          </div>
        </div>
      </div>
      
       <h4 className="text-gold font-semibold text-xl mb-6">Continue Comprando...</h4>
      <div className="mb-8 overflow-x-auto flex gap-6 pb-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`text-xs font-semibold tracking-widest whitespace-nowrap pb-1 ${
              categoriaAtiva === cat
                ? 'text-gold border-b-2 border-gold'
                : 'text-stone-400 hover:text-gold'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-12 relative h-96 rounded-2xl overflow-hidden group">
  <img
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    src={vieiras}
    alt="Vieiras"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white max-w-lg">
          <span className="inline-block bg-gold px-3 py-1 rounded-full text-xs font-semibold mb-3">
            RECOMENDAÇÃO DO CHEF
          </span>

          <h3 className="text-2xl font-bold mb-2">Vieiras ao Açafrão Real</h3>
          <p className="text-white/80 text-sm mb-4">
            Uma experiência sensorial com vieiras canadenses, emulsão de açafrão e micro-ervas frescas.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold">R$ 189,00</span>
            <button
              onClick={() => adicionarItem({ nome: 'Vieiras ao Açafrão Real', preco: 'R$ 189,00', valor: 189 })}
              className="px-6 py-2 bg-gold text-white rounded-full text-xs font-semibold hover:bg-yellow-600"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <h4 className="text-gold font-semibold text-xl mb-6">Sugestões para Você</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pratos.map((prato) => (
          <div key={prato.nome} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <img
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                src={prato.img}
                alt={prato.nome}
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">star</span>
                {prato.avaliacao}
              </div>
            </div>
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-semibold text-stone-800">{prato.nome}</h5>
              <span className="text-gold font-semibold">{prato.preco}</span>
            </div>
            <p className="text-stone-400 text-xs mb-4 line-clamp-2">{prato.descricao}</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-stone-100 rounded text-xs font-semibold text-stone-500">
                {prato.tag}
              </span>
              <button
                onClick={() => adicionarItem(prato)}
                className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-gold transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-md z-40">
        <button
        onClick={() => setModalAberto(true)}
        className="w-full bg-gold/60 backdrop-blur-md text-white h-14 rounded-2xl flex items-center justify-between px-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">shopping_basket</span>
            <span className="text-xs font-semibold tracking-widest uppercase">
              Ver Sacola ({itens.length} {itens.length === 1 ? 'item' : 'itens'})
            </span>
          </div>
          <span className="font-semibold">R$ {total},00</span>
        </button>
      </div>
    </main>
  )
}

export default Delivery