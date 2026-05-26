import { useState } from 'react'
import pratoChef from '../assets/Prato_2.webp'
import burrata from '../assets/prato_3.webp'
import ravioli from '../assets/prato_4.webp'
import vieiras from '../assets/prato.webp'
import { useCarrinho } from './CarrinhoContext'

function Delivery() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('ENTRADAS')
  const { itens, adicionarItem, total, setModalAberto } = useCarrinho()

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

      {/* Banner de entrega */}
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

      {/* Categorias */}
      <h4 className="text-gold font-semibold text-xl mb-4">Continue Comprando</h4>
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

      {/* Card destaque chef */}
      <div className="mb-12 relative h-96 rounded-2xl overflow-hidden group">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={vieiras}
          alt="Vieiras"
        />
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
              className="px-6 py-2 bg-gold text-white rounded-full text-xs font-semibold hover:bg-gold/80"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Sugestões */}
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
            <div className="flex items-center justify-end">
              <button
                onClick={() => adicionarItem(prato)}
                className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-gold/80 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sacola */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-md z-40">
        <button
          onClick={() => setModalAberto(true)}
          className="w-full bg-gold/60 backdrop-blur-md text-white h-14 rounded-2xl flex items-center justify-between px-6 shadow-2xl"
        >
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