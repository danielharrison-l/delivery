import { useState } from 'react'
import fundoReservas from '../assets/fundo_reservas.webp'

function Reservas() {
  const [dataSelecionada, setDataSelecionada] = useState('')  
  const [horarioSelecionado, setHorarioSelecionado] = useState('20:00')
  const [toast, setToast] = useState(false)
  const [erro, setErro] = useState('')

function confirmar() {
  if (!dataSelecionada) {
    setErro('Por favor, selecione uma data!')
    setTimeout(() => setErro(''), 3000)
    return
  }
  if (!horarioSelecionado) {
    setErro('Por favor, selecione um horário!')
    setTimeout(() => setErro(''), 3000)
    return
  }
  setErro('')
  setToast(true)
  setTimeout(() => setToast(false), 3000)
}

    return (
    <main className="relative min-h-screen pt-16 pb-20">

      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src={fundoReservas}
          alt="Restaurante"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
      </div>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gold text-white px-8 py-3 rounded-full text-sm tracking-wider shadow-lg">
          Reserva confirmada para as {horarioSelecionado} ✦
        </div>
      )}

      {erro && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-8 py-3 rounded-full text-sm tracking-wider shadow-lg whitespace-nowrap">
       {erro}
       </div>
      )}

      <section className="relative z-10 px-6 py-12 max-w-5xl mx-auto lg:flex lg:gap-12 lg:items-center lg:min-h-[80vh]">

        <div className="lg:w-1/4 mb-8 lg:mb-0">
          <p className="text-yellow-400 text-xs tracking-widest uppercase">Reservas</p>
          <h2 className="text-white text-5xl font-bold mt-2 leading-tight">
            Reserve Sua<br/> Noite
          </h2>
          <p className="text-white/75 mt-4 text-sm max-w-sm">
            Sabores refinados e serviço impecável em um espaço exclusivo. Reserve sua mesa e viva uma noite extraordinária.
          </p>
        </div>

        <div className="lg:w- 3/4 bg-stone-100/95 backdrop-blur-xl rounded-2xl px-8 py-10 shadow-2xl">

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-stone-500">Guests</label>
              <div className="relative mt-2">
                <select className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-800 appearance-none">
                  <option>1 Pessoa</option>
                  <option>2 Pessoas</option>
                  <option>3 Pessoas</option>
                  <option>4 Pessoas</option>
                  <option>6 Pessoas</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-stone-400 pointer-events-none text-lg">expand_more</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-stone-500">Data</label>
              <div className="relative mt-2">
                <input
                 type="date"
                 onChange={(e) => setDataSelecionada(e.target.value)}
                 className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-800"
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-stone-400 pointer-events-none text-lg">calendar_today</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-500 text-center mb-4">Horários Disponíveis</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['18:30', '19:30', '20:00', '21:15', '22:00'].map((time) => (
                <button
                  key={time}
                  onClick={() => setHorarioSelecionado(time)}
                  className={`px-5 py-2 rounded-full text-sm border transition-all ${
                    horarioSelecionado === time
                      ? 'border-gold text-gold font-semibold bg-yellow-50'
                      : 'border-stone-300 text-stone-700 hover:border-gold hover:text-gold'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold tracking-widest uppercase text-stone-500">Pedidos Especiais</label>
            <textarea
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 mt-2 text-stone-800 h-28 resize-none"
              placeholder="restrições alimentares ou ocasiões especiais..."
            />
          </div>

          <button
            onClick={confirmar}
            className="w-full bg-gold text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-gold transition-all"
          >
            Confirmar Reserva
          </button>
        </div>
      </section>
    </main>
  )
}

export default Reservas