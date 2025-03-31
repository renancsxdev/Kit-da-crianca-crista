import LeadForm from "@/components/lead-form"

export default function ExemploCaptacao() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-2xl shadow-xl">
          <div className="bg-white p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-4">
                FIQUE POR DENTRO
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Receba novidades e conteúdos exclusivos!
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Registre seu e-mail para receber novidades, promoções exclusivas e conteúdos gratuitos sobre educação
                cristã para crianças.
              </p>

              <LeadForm />

              <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-700">
                      <span className="font-semibold">Dica:</span> Ao se cadastrar, você receberá um{" "}
                      <span className="text-blue-600 font-semibold">material gratuito</span> para começar a jornada de
                      educação cristã do seu filho!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

