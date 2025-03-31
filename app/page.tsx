"use client"

import type React from "react"

import Image from "next/image"
import {
  Star,
  ShoppingCart,
  CheckCircle,
  Shield,
  CreditCard,
  Clock,
  Heart,
  Sparkles,
  Gift,
  Download,
  ArrowRight,
  Zap,
  Loader2,
  X,
  BookOpen,
  Video,
  PuzzleIcon as PuzzlePiece,
  Award,
  Flame,
  Package,
  Infinity,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import LeadForm from "@/components/lead-form"

// Também ajustar a função handleSubmitEmail para usar a configuração importada

// Inicializa o Firebase
// let app
// let db

// Inicializa o Firebase apenas no lado do cliente
// if (typeof window !== "undefined") {
//   try {
//     app = initializeApp(firebaseConfig)
//     db = getFirestore(app)
//   } catch (error) {
//     console.error("Erro ao inicializar o Firebase:", error)
//   }
// }

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [analysisMessage, setAnalysisMessage] = useState("")

  // Estados para o formulário de email
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Adicionar estado para o nome
  const [name, setName] = useState("")

  useEffect(() => {
    setIsVisible(true)

    // Adiciona animação de scroll suave para os links internos
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()
        const id = target.getAttribute("href")?.substring(1)
        const element = document.getElementById(id || "")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    document.addEventListener("click", handleSmoothScroll)
    return () => document.removeEventListener("click", handleSmoothScroll)
  }, [])

  // Função para validar email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Modificar a função handleSubmitEmail para incluir o nome
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    if (!validateEmail(email)) {
      setSubmitStatus("error")
      setErrorMessage("Por favor, insira um email válido.")
      return
    }

    // Validar nome
    if (!name.trim()) {
      setSubmitStatus("error")
      setErrorMessage("Por favor, insira seu nome.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Enviar para a API em vez de usar diretamente o Firebase no cliente
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar email")
      }

      // Sucesso
      setSubmitStatus("success")
      setName("")
      setEmail("")

      // Resetar status após 5 segundos
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      setSubmitStatus("error")
      setErrorMessage("Ocorreu um erro ao registrar seus dados. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    // Mostrar mensagem de análise
    setAnalyzing(true)

    // Definir mensagem de análise com base na pergunta atual
    const analysisMessages = [
      [
        "Analisando preferências criativas...",
        "Seu filho tem potencial artístico! Isso é ótimo para atividades de colorir.",
      ],
      [
        "Avaliando interesse em histórias bíblicas...",
        "Entendemos o desafio de manter o interesse nas histórias bíblicas.",
      ],
      ["Calculando tempo de tela...", "Estamos buscando o equilíbrio ideal entre tecnologia e atividades educativas."],
      [
        "Processando necessidades educativas...",
        "Preparando recomendações personalizadas para o desenvolvimento espiritual.",
      ],
    ]

    setAnalysisMessage(analysisMessages[currentQuestion][0])

    setTimeout(() => {
      setAnalysisMessage(analysisMessages[currentQuestion][1])

      setTimeout(() => {
        setAnalyzing(false)

        if (currentQuestion < 3) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          setShowResult(true)
        }
      }, 1500)
    }, 1500)
  }

  const getResult = () => {
    const firstOptionCount = answers.filter((a) => a === 0).length
    const lastOptionCount = answers.filter((a) => a === 2).length

    if (firstOptionCount >= 2) {
      return 0 // Primeira opção predominante
    } else if (lastOptionCount >= 2) {
      return 2 // Última opção predominante
    } else {
      return 1 // Mix de respostas
    }
  }

  const completeQuiz = () => {
    setQuizCompleted(true)
    setShowQuizModal(false)
  }

  const skipQuiz = () => {
    setQuizCompleted(true)
    setShowQuizModal(false)
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Quiz Modal */}
      {showQuizModal && !quizCompleted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <button
              onClick={skipQuiz}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
              aria-label="Fechar quiz"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              {!analyzing && !showResult && (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-block bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-full mb-4">
                      QUIZ EXCLUSIVO
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">
                      Descubra se o Kit da Criança Cristã é ideal para seu filho!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Responda 4 perguntas simples e descubra como podemos ajudar no desenvolvimento espiritual do seu
                      filho.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-sm text-yellow-700 rounded">
                      <span className="font-bold">✨ EXCLUSIVO:</span> 95% dos pais que responderam este quiz
                      encontraram a solução perfeita para o desenvolvimento espiritual de seus filhos!
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-3 h-3 rounded-full ${currentQuestion === step ? "bg-blue-500" : currentQuestion > step ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl shadow-md mb-6">
                    {currentQuestion === 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-blue-600 mb-4">
                          1️⃣ Seu filho gosta de atividades criativas como desenhar e colorir?
                        </h3>
                        {["Sim, ele ama!", "Às vezes, depende do dia.", "Não, ele prefere outras atividades."].map(
                          (option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswer(index)}
                              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-3"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${answers[0] === index ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"}`}
                              >
                                {answers[0] === index && <CheckCircle className="w-4 h-4" />}
                              </div>
                              <span>{option}</span>
                            </button>
                          ),
                        )}
                      </div>
                    )}

                    {currentQuestion === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-blue-600 mb-4">
                          2️⃣ Você sente dificuldade em ensinar histórias da Bíblia de forma divertida?
                        </h3>
                        {[
                          "Sim, ele se distrai fácil e perde o interesse.",
                          "Um pouco, mas tento adaptar.",
                          "Não, ele já gosta de aprender sobre a Bíblia.",
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-3"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${answers[1] === index ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"}`}
                            >
                              {answers[1] === index && <CheckCircle className="w-4 h-4" />}
                            </div>
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {currentQuestion === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-blue-600 mb-4">
                          3️⃣ Quanto tempo seu filho passa em telas (TV, celular, tablet)?
                        </h3>
                        {["Mais de 3 horas por dia.", "Entre 1 e 2 horas por dia.", "Menos de 1 hora por dia."].map(
                          (option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswer(index)}
                              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-3"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${answers[2] === index ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"}`}
                              >
                                {answers[2] === index && <CheckCircle className="w-4 h-4" />}
                              </div>
                              <span>{option}</span>
                            </button>
                          ),
                        )}
                      </div>
                    )}

                    {currentQuestion === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-blue-600 mb-4">
                          4️⃣ Você gostaria que ele tivesse mais atividades educativas e cristãs no dia a dia?
                        </h3>
                        {[
                          "Sim! Quero mais opções de aprendizado cristão.",
                          "Talvez, se for algo interativo e divertido.",
                          "Não, acho que já está bom.",
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-3"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${answers[3] === index ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"}`}
                            >
                              {answers[3] === index && <CheckCircle className="w-4 h-4" />}
                            </div>
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {analyzing && (
                <div className="py-16 text-center">
                  <div className="inline-block mb-6">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">{analysisMessage}</h3>
                  <div className="w-full max-w-md mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-progress"></div>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="text-center">
                  <div className="inline-block bg-green-100 text-green-600 font-semibold px-4 py-2 rounded-full mb-4">
                    RESULTADO DO QUIZ
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">💡 Análise Concluída!</h3>

                  <div className="bg-blue-50 p-6 rounded-2xl shadow-md mb-8">
                    {getResult() === 0 && (
                      <div className="space-y-4">
                        <div className="inline-block bg-yellow-100 p-3 rounded-full mb-2">
                          <span className="text-4xl">🎉</span>
                        </div>
                        <h4 className="text-xl font-bold text-green-600">
                          O Kit da Criança Cristã é perfeito para você!
                        </h4>
                        <p className="text-gray-700">
                          Seu filho vai amar aprender brincando! Nossas atividades criativas combinam perfeitamente com
                          o perfil dele.
                        </p>
                      </div>
                    )}

                    {getResult() === 1 && (
                      <div className="space-y-4">
                        <div className="inline-block bg-blue-100 p-3 rounded-full mb-2">
                          <span className="text-4xl">🔎</span>
                        </div>
                        <h4 className="text-xl font-bold text-blue-600">
                          Esse Kit pode ser uma ótima opção para você!
                        </h4>
                        <p className="text-gray-700">
                          Estimule o aprendizado cristão de forma leve e criativa. Nosso material foi desenvolvido para
                          engajar crianças de diferentes perfis.
                        </p>
                      </div>
                    )}

                    {getResult() === 2 && (
                      <div className="space-y-4">
                        <div className="inline-block bg-purple-100 p-3 rounded-full mb-2">
                          <span className="text-4xl">🤔</span>
                        </div>
                        <h4 className="text-xl font-bold text-purple-600">
                          Talvez seu filho precise de um outro tipo de material educativo
                        </h4>
                        <p className="text-gray-700">
                          Mas ainda assim vale a pena conhecer esse Kit! Ele pode surpreender e despertar novos
                          interesses em seu filho.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-blue-700 mb-4">
                      🔽 Pronto para dar esse presente incrível para seu filho? 🔽
                    </h4>
                  </div>

                  <div className="relative mx-auto max-w-md group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
                    <Button
                      size="lg"
                      onClick={completeQuiz}
                      className="relative w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-8 py-6 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 group-hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingCart className="h-6 w-6" />
                        <span>QUERO O ACESSO AGORA</span>
                        <span className="text-2xl">🛒</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100 via-purple-50 to-white py-20 px-4">
        {/* Partículas flutuantes animadas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => {
            const emojis = ["✝️", "🎨", "📚", "✨", "💫", "🙏", "👼", "❤️"];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const style = {
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 15}s`,
            };

            return (
              <div
                key={i}
                className="absolute animate-float text-6xl opacity-10"
                style={style}
                aria-hidden="true"
              >
                {randomEmoji}
              </div>
            );
          })}
        </div>

        {/* Formas decorativas */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div
            className="absolute top-20 left-10 w-40 h-40 rounded-full bg-yellow-200 opacity-20 animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-200 opacity-20 animate-pulse"
            style={{ animationDuration: "10s" }}
          ></div>
          <div
            className="absolute top-40 right-40 w-20 h-20 rounded-full bg-green-200 opacity-20 animate-pulse"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-32 h-32 rounded-full bg-purple-200 opacity-20 animate-pulse"
            style={{ animationDuration: "12s" }}
          ></div>
        </div>

        <div
          className={`container mx-auto max-w-6xl relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-10">
            <div className="inline-block relative mb-6">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 animate-spin-slow blur-xl opacity-30"></span>
              <span className="relative inline-block bg-white text-yellow-500 text-sm font-bold px-4 py-2 rounded-full shadow-md">
                <Sparkles className="inline-block w-4 h-4 mr-1" /> LANÇAMENTO EXCLUSIVO
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight drop-shadow-sm mb-4">
              KIT DA CRIANÇA CRISTÃ PARA COLORIR 🎨✨
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-500 max-w-3xl mx-auto">
              Histórias bíblicas para colorir e aprender brincando!
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="absolute -top-6 -left-6 w-full h-full bg-yellow-300 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="absolute -top-3 -left-3 w-full h-full bg-blue-300 rounded-xl -rotate-2 group-hover:-rotate-4 transition-transform duration-300"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-xl border-4 border-blue-200 transform transition-transform group-hover:scale-105 duration-300">
                  <img src="/conteudo kit.webp" alt="Criança feliz" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute -top-5 -right-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold py-2 px-4 rounded-full transform rotate-12 shadow-lg animate-pulse">
                    100% DIGITAL
                  </div>
                </div>

                {/* Elementos decorativos flutuantes */}
                <div
                  className="absolute -bottom-8 -right-8 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg animate-float"
                  style={{ animationDuration: "6s" }}
                >
                  <span className="text-2xl">📚</span>
                </div>
                <div
                  className="absolute -top-10 -right-10 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-lg animate-float"
                  style={{ animationDuration: "8s", animationDelay: "1s" }}
                >
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              {/* CTA Hero melhorado */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border-2 border-yellow-300 shadow-md max-w-md mx-auto transform transition-transform hover:scale-105 duration-300">
                <div className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md mx-auto max-w-xs mb-4 transform -rotate-2">
                  <div className="flex items-center justify-center gap-2">
                    <Infinity className="h-5 w-5" />
                    <span>ACESSO VITALÍCIO!</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Entrega imediata após pagamento</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Gift className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">+ 3 bônus exclusivos</span>
                </div>
                <div
                  className="relative overflow-hidden rounded-full"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-50 blur-md transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
                  ></div>
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-8 py-7 rounded-full shadow-lg transform transition-transform hover:scale-105 w-full group"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
                    <ShoppingCart className="mr-2 h-5 w-5 animate-bounce" style={{ animationDuration: "2s" }} />
                    <a href="https://pay.kirvano.com/5f8b0447-ba87-487d-b292-4c827d9a8db7?aff=ddfd6497-f41b-4251-bad0-7ef5ebc5e7cc" className="relative z-10">QUERO ACESSO VITALÍCIO</a>
                    <span className="ml-1 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                      🛒
                    </span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>Acesso imediato</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>Garantia de 7 dias</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>Suporte exclusivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imagens de crianças felizes - Design melhorado */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          {/* Elementos decorativos de fundo */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          </div>

          {/* Título da seção */}
          <div className="text-center mb-12 relative z-10">
            <div className="inline-block bg-pink-100 text-pink-600 font-semibold px-4 py-2 rounded-full mb-4 shadow-sm">
              CRIANÇAS FELIZES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
              Sorrisos que Inspiram 😊
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja a alegria das crianças que já estão aprendendo com o Kit da Criança Cristã
            </p>
          </div>

          {/* Galeria de imagens com design melhorado */}
          <div className="relative">
            {/* Moldura decorativa */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-3xl opacity-30 blur-xl"></div>

            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                {[
                  {
                    border: "border-pink-300",
                    bg: "bg-gradient-to-br from-pink-100 to-pink-50",
                    shadow: "shadow-pink-200",
                    emoji: "😊",
                    delay: "0s",
                    title: "Aprendizado Divertido",
                    image: "/criancasPintando.jpg",
                  },
                  {
                    border: "border-blue-300",
                    bg: "bg-gradient-to-br from-blue-100 to-blue-50",
                    shadow: "shadow-blue-200",
                    emoji: "🎨",
                    delay: "0.2s",
                    title: "Criatividade Cristã",
                    image: "/criancasAprendendo.jpg",
                  },
                  {
                    border: "border-purple-300",
                    bg: "bg-gradient-to-br from-purple-100 to-purple-50",
                    shadow: "shadow-purple-200",
                    emoji: "✨",
                    delay: "0.4s",
                    title: "Valores Bíblicos",
                    image: "/maeFeliz.jpg",
                  },
                ].map((item, index) => (
                  <div key={index} className="group relative" style={{ transitionDelay: item.delay }}>
                    <div
                      className={`w-[220px] h-[220px] ${item.bg} p-5 rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 ${item.shadow}`}
                    >
                      <div className={`w-full h-full rounded-xl overflow-hidden border-4 ${item.border} shadow-inner`}>
                        <Image
                          src={`${item.image}?height=200&width=200`}
                          alt={item.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute -bottom-3 inset-x-0 bg-white/80 backdrop-blur-sm py-2 px-3 mx-auto w-4/5 rounded-lg text-center border border-gray-100 shadow-md">
                        <p className="font-medium text-gray-700 text-sm">{item.title}</p>
                      </div>
                    </div>

                    {/* Emoji flutuante */}
                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-purple-100 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                      <span className="text-xl">{item.emoji}</span>
                    </div>
                  </div>
                ))}
              </div>


              <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 p-6 rounded-xl shadow-inner border border-purple-100">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-purple-600">Milhares de crianças</span> já estão aprendendo sobre
                  a Bíblia enquanto se divertem com nosso kit! Junte-se a essa comunidade de famílias cristãs.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-[1px] rounded-full">
                    <a href="https://pay.kirvano.com/5f8b0447-ba87-487d-b292-4c827d9a8db7?aff=ddfd6497-f41b-4251-bad0-7ef5ebc5e7cc" className="bg-white text-purple-600 font-medium px-6 py-2 rounded-full hover:bg-purple-50 transition-colors">
                      Quero para meu filho também!
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TUDO O QUE VOCÊ RECEBERÁ - Nova seção explosiva */}
      <section
        className="py-16 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white"
        id="pacote-completo"
      >
        <div className="container mx-auto max-w-6xl relative">
          {/* Elementos decorativos */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-300 rounded-full opacity-10 animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full mb-6 animate-bounce shadow-lg">
                <Flame className="inline-block w-5 h-5 mr-2" /> PACOTE COMPLETO{" "}
                <Flame className="inline-block w-5 h-5 ml-2" />
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-md">
                TUDO O QUE VOCÊ VAI RECEBER! 🎁
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Um pacote completo de materiais educativos cristãos para transformar o aprendizado bíblico do seu filho
                em momentos divertidos e inesquecíveis!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Layout melhorado para mostrar imagens dos produtos */}
              {[
                {
                  title: "Jogos Educativos Cristãos",
                  icon: PuzzlePiece,
                  iconBg: "from-yellow-400 to-orange-500",
                  hoverColor: "text-yellow-300",
                  features: ["Plano da Salvação", "Jogo da Memória Bíblico"],
                  description: "Jogos interativos que ensinam valores cristãos enquanto divertem!",
                  imageSrc: "/jogos.png?height=300&width=400",
                  imageAlt: "Jogos Educativos Cristãos",
                  badge: "INTERATIVO",
                  badgeBg: "bg-yellow-500",
                  badgeText: "text-yellow-900",
                },
                {
                  title: "3 E-books Exclusivos",
                  icon: BookOpen,
                  iconBg: "from-blue-400 to-indigo-500",
                  hoverColor: "text-blue-300",
                  features: [
                    "E-book 1: Ensinando as Crianças à Orar",
                    "E-book 2: Aventura na Arca",
                    "E-book 3: Jesus Ama as Crianças",
                  ],
                  description: "Coleção de e-books com histórias, valores e orações para crianças.",
                  imageSrc: "/ebooks.png?height=300&width=400",
                  imageAlt: "E-books Cristãos",
                  badge: "Prático",
                  badgeBg: "bg-yellow-500",
                  badgeText: "text-yellow-900",
                },
                {
                  title: "Desenhos para Colorir",
                  icon: "PencilIcon",
                  iconBg: "from-purple-400 to-pink-500",
                  hoverColor: "text-purple-300",
                  features: ["50+ páginas de desenhos", "Personagens bíblicos", "Histórias ilustradas"],
                  description: "Perfeito para desenvolver a criatividade enquanto aprende sobre a Bíblia!",
                  imageSrc: "/colorir.png?height=300&width=400",
                  imageAlt: "Desenhos para Colorir",
                  badge: "50+ PÁGINAS",
                  badgeBg: "bg-yellow-500",
                  badgeText: "text-yellow-900",
                },
                {
                  title: "Vídeos Animados",
                  icon: Video,
                  iconBg: "from-red-400 to-red-600",
                  hoverColor: "text-red-300",
                  features: [
                    "Vídeo 1: Arca de Noé",
                    "Vídeo 2: A Criação do Mundo",
                    "Vídeo 3: A Criança que Compartilhou",
                  ],
                  description: "Animações encantadoras que contam histórias bíblicas de forma divertida e educativa.",
                  imageSrc: "/video.png?height=300&width=400",
                  imageAlt: "Vídeos Animados",
                  badge: "HD",
                  badgeBg: "bg-green-500",
                  badgeText: "text-green-900",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="col-span-1 md:col-span-2 lg:col-span-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl transform transition-all duration-500 hover:scale-102 hover:bg-white/15 group overflow-hidden"
                >
                  {/* Imagem do produto com overlay */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent z-10"></div>
                    <Image
                      src={item.imageSrc || "/placeholder.svg"}
                      alt={item.imageAlt}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badge no canto da imagem */}
                    <div
                      className={`absolute top-3 right-3 ${item.badgeBg} ${item.badgeText} text-xs font-bold px-2 py-1 rounded-full z-20`}
                    >
                      {item.badge}
                    </div>

                    {/* Título sobreposto na imagem */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors drop-shadow-lg">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Ícone */}
                      <div className={`bg-gradient-to-br ${item.iconBg} p-3 rounded-xl shadow-lg`}>
                        {item.icon === "PencilIcon" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        ) : (
                          <item.icon className="h-6 w-6 text-white" />
                        )}
                      </div>

                      {/* Descrição */}
                      <p className="text-blue-100 text-sm">{item.description}</p>
                    </div>

                    {/* Lista de recursos */}
                    <ul className="space-y-2 text-blue-100 mb-4">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="bg-green-500 rounded-full p-1 mr-2 flex-shrink-0">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Botão de visualização */}
                    <div className="mt-auto pt-2">
                      <a
                        href="https://sites.google.com/view/kit-dacrianca-crista/?"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:bg-white/25"
                      >
                        <span>Visualizar amostra</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </a>
                    </div>

                  </div>
                </div>
              ))}

              {/* Galeria de imagens de exemplo */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Exemplos do Material</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "Colorir Arca de Noé", badge: "POPULAR", image: "/colorir2.png" },
                    { title: "Jogo da Memória", badge: "NOVO", image: "/jogos.png" },
                    { title: "E-book Interativo", badge: "DIGITAL", image: "/ebooks.png" },
                    { title: "Vídeo Animado", badge: "HD", image: "/video.png" },
                  ].map((example, i) => (
                    <div key={i} className="relative group overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity"></div>
                      <Image
                        src={example.image} // Agora cada item exibe sua própria imagem
                        alt={example.title}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full z-20">
                        {example.badge}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                        <p className="text-sm font-medium text-white">{example.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <a href="https://sites.google.com/view/kit-dacrianca-crista/?_gl=1*kha6v1*_gcl_au*MTcxMjA5NDI4MS4xNzQwNjI5OTEz*_ga*NzI1NTE4Mjg3LjE3MzIyMDU2OTg.*_ga_0QK8NDJ9YP*MTc0MzIwNzE0OS44MC4xLjE3NDMyMDc3NDYuNTcuMC4w" className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium py-2 px-6 rounded-full transition-colors inline-flex items-center gap-2">
                    <span>Ver galeria completa</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bônus Especial */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-1 rounded-3xl shadow-xl mb-12">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-3xl relative overflow-hidden">
                {/* Elementos decorativos */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-70 rounded-full animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-yellow-500 to-amber-600 p-6 rounded-full shadow-2xl">
                        <Award className="h-20 w-20 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full transform rotate-12 shadow-lg animate-bounce">
                        GRÁTIS!
                      </div>
                    </div>
                  </div>

                  <div className="md:w-2/3 text-center md:text-left">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 font-bold px-4 py-2 rounded-full mb-4 shadow-md">
                      ADICIONAL
                    </div>
                    <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
                      Guia para Pais: Como Ensinar a Bíblia de Forma Divertida
                    </h3>
                    <p className="text-xl text-blue-100 mb-6">
                      Um guia completo com dicas práticas, atividades e estratégias para ajudar os pais a ensinarem
                      valores cristãos de forma leve e divertida.
                    </p>

                    {/* Botão para visualizar o guia */}
                    <div className="mb-6">
                      <a
                        href="/Guia-para-Pais-Ensinando-a-Biblia-de-Forma-Divertida-e-Envolvente.pdf" // Substitua pelo caminho correto do seu PDF
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-amber-900 font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
                      >
                        <span className="relative z-10">VISUALIZAR GUIA GRATUITO</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </a>
                    </div>


                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <p className="text-lg font-bold text-yellow-300">
                        Valor normal: <span className="line-through">R$ 67,00</span>
                      </p>
                      <p className="text-2xl font-extrabold text-white">Hoje: GRÁTIS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Valor Total e CTA */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl text-center">
              <h3 className="text-2xl font-bold mb-4">Valor Total de Todos os Itens:</h3>
              <div className="flex justify-center items-center gap-4 mb-6">
                <p className="text-3xl font-bold text-gray-300 line-through">R$ 197,00</p>
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-1 rounded-xl">
                  <div className="bg-blue-900 px-4 py-2 rounded-xl">
                    <p className="text-4xl font-extrabold text-white">Apenas R$ 47,90</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto max-w-xl mb-6 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
                <Button
                  size="lg"
                  className="relative w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold text-xl px-10 py-8 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 group-hover:shadow-2xl"
                >
                  <a href="https://pay.kirvano.com/5f8b0447-ba87-487d-b292-4c827d9a8db7?aff=ddfd6497-f41b-4251-bad0-7ef5ebc5e7cc" className="flex items-center justify-center gap-3 text-blue-100 underline">
                    <Package className="h-7 w-7" />
                    <span>QUERO ESTE PACOTE COMPLETO AGORA!</span>
                    <span className="text-2xl">🎁</span>
                  </a>
                </Button>
              </div>

              <p className="text-blue-100">Acesso imediato após a confirmação do pagamento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dores e Soluções */}
      <section className="py-20 px-4 bg-blue-50" id="solucoes">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full mb-4">
              PROBLEMAS RESOLVIDOS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Problemas e Soluções 🔍
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entendemos os desafios de ensinar a fé para as crianças de hoje
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
            {[
              {
                icon: "📚",
                iconBg: "from-red-300 to-orange-200",
                problem: "Crianças não se interessam por histórias bíblicas tradicionais?",
                solution: "Material interativo e colorido que prende a atenção e desperta o interesse!",
                problemBg: "from-red-50 to-orange-50",
                solutionBg: "from-green-50 to-teal-50",
                delay: "0s",
              },
              {
                icon: "🌟",
                iconBg: "from-blue-300 to-purple-200",
                problem: "Falta de atividades cristãs educativas para crianças no mundo digital?",
                solution: "Jogos e desafios digitais baseados em ensinamentos bíblicos que combinam tecnologia e fé!",
                problemBg: "from-blue-50 to-indigo-50",
                solutionBg: "from-teal-50 to-green-50",
                delay: "0.2s",
              },
              {
                icon: "🎮",
                iconBg: "from-purple-300 to-pink-200",
                problem: "Poucas opções para ensinar a fé de forma lúdica e divertida?",
                solution: "O Kit combina aprendizado bíblico e diversão com atividades que as crianças adoram fazer!",
                problemBg: "from-purple-50 to-pink-50",
                solutionBg: "from-emerald-50 to-teal-50",
                delay: "0.4s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl group"
                style={{ transitionDelay: item.delay }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Ícone lateral */}
                  <div
                    className={`bg-gradient-to-br ${item.iconBg} p-6 md:p-8 flex items-center justify-center md:w-1/5`}
                  >
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6 md:w-4/5 space-y-4">
                    {/* Problema */}
                    <div
                      className={`bg-gradient-to-r ${item.problemBg} p-4 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-red-100 p-1.5 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <h3 className="font-bold text-red-600">Problema:</h3>
                      </div>
                      <p className="text-gray-700 ml-10">{item.problem}</p>
                    </div>

                    {/* Solução */}
                    <div
                      className={`bg-gradient-to-r ${item.solutionBg} p-4 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-100 p-1.5 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-green-600">Solução:</h3>
                      </div>
                      <p className="text-gray-700 ml-10">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white" id="depoimentos">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block bg-yellow-100 text-yellow-700 font-semibold px-4 py-2 rounded-full mb-4">
              EXPERIÊNCIAS REAIS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Depoimentos de Pais Satisfeitos 💬
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja o que outras famílias estão dizendo sobre o Kit da Criança Cristã
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
                border: "border-yellow-200",
                accent: "bg-yellow-400",
                accentText: "text-yellow-800",
                text: "Meu filho de 6 anos adora colorir as histórias bíblicas. Ele está aprendendo muito sobre a Bíblia de forma divertida! Agora ele pede para ler a Bíblia antes de dormir.",
                name: "Mariana S., mãe do Pedro",
                rating: 5,
                delay: "0s",
              },
              {
                bg: "bg-gradient-to-br from-blue-50 to-blue-100",
                border: "border-blue-200",
                accent: "bg-blue-400",
                accentText: "text-blue-800",
                text: "Material excelente, comprei e aprovei pois minhas filhas amaram, sou fotógrafo e gostei bastante do conteúdo.",
                name: "Carlos R., pai de duas meninas",
                rating: 5,
                delay: "0.2s",
              },
              {
                bg: "bg-gradient-to-br from-green-50 to-green-100",
                border: "border-green-200",
                accent: "bg-green-400",
                accentText: "text-green-800",
                text: "Comprei para minha sobrinha e ela adorou! É uma ótima maneira de ensinar valores cristãos de forma lúdica. Recomendo para todas as famílias cristãs!",
                name: "Fernanda T., tia da Júlia",
                rating: 5,
                delay: "0.4s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.bg} p-8 rounded-2xl border-2 ${item.border} shadow-lg relative transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group`}
                style={{ transitionDelay: item.delay }}
              >
                <div className="absolute -top-5 -right-5 transform transition-transform hover:scale-110 duration-300">
                  <div className="bg-white p-2 rounded-full shadow-md">
                    {index === 0 ? (
                      <Image
                        src="/mãe1.jpg?height=80&width=80&text=Mãe"
                        alt={`Foto de ${item.name.split(",")[0]}`}
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-yellow-300 object-cover"
                      />
                    ) : index === 1 ? (
                      <Image
                        src="/carlos.jpg?height=80&width=80&text=Pai"
                        alt={`Foto de ${item.name.split(",")[0]}`}
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-blue-300 object-cover"
                      />
                    ) : (
                      <Image
                        src="/3mae.jpg?height=80&width=80&text=Tia"
                        alt={`Foto de ${item.name.split(",")[0]}`}
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-green-300 object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Faixa de destaque */}
                <div
                  className={`absolute -top-3 -left-3 ${item.accent} ${item.accentText} px-4 py-1 rounded-full text-xs font-bold shadow-md transform -rotate-3`}
                >
                  Depoimento Verificado
                </div>

                <div className="flex text-yellow-500 mb-4 mt-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="fill-yellow-500 h-6 w-6" />
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-gray-200 opacity-50">"</span>
                  <p className="text-gray-700 italic mb-6 relative z-10">{item.text}</p>
                  <span className="absolute -bottom-8 -right-2 text-6xl text-gray-200 opacity-50">"</span>
                </div>

                <div className="flex items-center mt-8 pt-4 border-t border-gray-200">
                  <Heart className={`h-5 w-5 text-red-500 mr-2 group-hover:animate-pulse`} />
                  <p className="font-bold">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantia e Segurança */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50" id="garantia">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full mb-4">
              COMPRA SEGURA
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
              Garantia e Segurança 🔒
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Sua compra está protegida e garantida</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                bg: "bg-gradient-to-br from-green-100 to-green-50",
                iconBg: "bg-gradient-to-br from-green-500 to-green-600",
                iconColor: "text-white",
                title: "Compra 100% Segura",
                titleColor: "text-green-700",
                desc: "Seus dados estão protegidos por criptografia de ponta a ponta. Ambiente seguro garantido.",
                features: ["Pagamento Seguro", "Dados Protegidos", "Site Verificado"],
                delay: "0s",
              },
              {
                icon: CheckCircle,
                bg: "bg-gradient-to-br from-blue-100 to-blue-50",
                iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
                iconColor: "text-white",
                title: "Satisfação Garantida",
                titleColor: "text-blue-700",
                desc: "7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos seu dinheiro.",
                features: ["7 Dias de Garantia", "Devolução Simples", "Sem Burocracia"],
                delay: "0.2s",
              },
              {
                icon: CreditCard,
                bg: "bg-gradient-to-br from-purple-100 to-purple-50",
                iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
                iconColor: "text-white",
                title: "Pagamento Facilitado",
                titleColor: "text-purple-700",
                desc: "Pague com cartão de crédito, boleto ou PIX. Parcelamento em até 12x no cartão.",
                features: ["Cartão de Crédito", "Boleto Bancário", "PIX"],
                delay: "0.4s",
              },
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
                <div
                  key={index}
                  className={`${item.bg} p-8 rounded-2xl shadow-lg flex flex-col items-center text-center flex-1 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-gray-100 group relative overflow-hidden`}
                  style={{ transitionDelay: item.delay }}
                >
                  {/* Elemento decorativo de fundo */}
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-white/50 rounded-full opacity-20"></div>
                  <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-white/50 rounded-full opacity-20"></div>

                  <div
                    className={`${item.iconBg} p-6 rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`h-12 w-12 ${item.iconColor}`} />
                  </div>

                  <h3 className={`text-2xl font-bold ${item.titleColor} mb-4`}>{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.desc}</p>

                  <div className="w-full mt-auto">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-inner border border-gray-100">
                      <ul className="space-y-2">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.iconBg}`}>
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {index === 1 && <div className="border border-green-200 shadow-inner"></div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final - Melhorado e mais chamativo */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-blue-100" id="comprar">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-red-700 font-bold px-6 py-3 rounded-full mb-6 animate-bounce shadow-lg">
            <Zap className="h-5 w-5" />
            <span>ÚLTIMA CHANCE - OFERTA LIMITADA</span>
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Não perca essa oportunidade única! 🎁
          </h2>

          {/* Card principal do CTA - redesenhado e mais chamativo */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-1 rounded-3xl shadow-2xl mb-10 relative overflow-hidden">
            <div className="bg-white p-6 sm:p-10 rounded-3xl relative overflow-hidden">
              {/* Elementos decorativos animados */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 animate-pulse"
                  style={{ animationDuration: "8s" }}
                ></div>
                <div
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"
                  style={{ animationDuration: "10s" }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-10 animate-pulse"
                  style={{ animationDuration: "6s" }}
                ></div>
                <div
                  className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-purple-200 rounded-full opacity-10 animate-pulse"
                  style={{ animationDuration: "7s" }}
                ></div>
              </div>

              <div className="relative z-10">
                {/* Badge de acesso vitalício */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg mx-auto max-w-md mb-8 transform -rotate-1">
                  <div className="flex items-center justify-center gap-2">
                    <Infinity className="h-6 w-6" />
                    <span className="text-xl">ACESSO VITALÍCIO - PAGUE APENAS UMA VEZ!</span>
                    <Lock className="h-6 w-6" />
                  </div>
                </div>

                {/* Preços em cards mais atrativos */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
                  <div className="w-full md:w-auto text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border-2 border-yellow-300 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full transform rotate-12 shadow-md">
                      MELHOR OPÇÃO
                    </div>
                    <p className="text-lg font-medium">Por apenas:</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-2xl font-bold text-gray-400 line-through">R$197,00</p>
                      <p className="text-5xl font-bold text-green-600">R$ 47,90</p>
                    </div>
                    <p className="text-sm text-gray-600">à vista</p>
                  </div>

                  <div className="hidden md:flex text-4xl font-bold text-gray-300">OU</div>

                  <div className="w-full md:w-auto text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <p className="text-lg font-medium">Parcele em:</p>
                    <p className="text-5xl font-bold text-green-600">11x R$ 5,16</p>
                    <p className="text-sm text-gray-600">no cartão</p>
                  </div>
                </div>

                {/* Informações de entrega com animação */}
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-8 bg-blue-50 p-4 rounded-full shadow-inner">
                  <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                  <p className="font-medium">Acesso imediato após a confirmação do pagamento</p>
                </div>

                {/* Botão CTA principal redesenhado */}
                <div className="relative mx-auto max-w-xl mb-6 group">
                  {/* Efeito de brilho animado */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-300 animate-pulse"></div>

                  <Button
                    asChild
                    size="lg"
                    className="relative w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-10 py-8 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 group-hover:shadow-2xl"
                  >
                    <a href="https://pay.kirvano.com/5f8b0447-ba87-487d-b292-4c827d9a8db7?aff=ddfd6497-f41b-4251-bad0-7ef5ebc5e7cc" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                      <ShoppingCart className="h-7 w-7" />
                      <span>QUERO ACESSO VITALÍCIO AGORA!</span>
                      <span className="text-2xl">🛒</span>
                    </a>
                  </Button>

                </div>

                {/* Badges de confiança */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transform transition-transform hover:scale-105 duration-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transform transition-transform hover:scale-105 duration-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Garantia de 7 dias</span>
                  </div>
                  <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transform transition-transform hover:scale-105 duration-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Suporte exclusivo</span>
                  </div>
                  <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transform transition-transform hover:scale-105 duration-300">
                    <ArrowRight className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Download instantâneo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem final */}
          <div className="max-w-3xl mx-auto bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-inner transform transition-all duration-500 hover:shadow-md">
            <p className="text-lg text-gray-700">
              Invista no desenvolvimento espiritual do seu filho de forma divertida e educativa. O Kit da Criança Cristã
              para Colorir é o presente perfeito para ajudar as crianças a conhecerem as histórias bíblicas enquanto se
              divertem e desenvolvem sua criatividade.
            </p>
          </div>
        </div>
      </section>

      {/* Container para captura de emails */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-100 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-2xl shadow-xl">
            <div className="bg-white p-8 rounded-2xl relative overflow-hidden">
              {/* Elementos decorativos */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full opacity-70"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-100 rounded-full opacity-70"></div>

              <div className="relative z-10 text-center">
                <div className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-4">
                  FIQUE POR DENTRO
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Achou o investimento alto neste momento?
                </h2>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Registre seu e-mail para receber novidades, promoções exclusivas e conteúdos gratuitos sobre educação
                  cristã para crianças.
                </p>

                <div className="max-w-md mx-auto">
                  <LeadForm />
                </div>

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
                        educação cristã do seu filho enquanto aguarda nossas promoções!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-10 px-4 text-center">
        <div className="container mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
              <Image
                src="/kitLogo.png?height=60&width=200"
                alt="Logo Kit da Criança Cristã"
                width={200}
                height={60}
                className="h-16 w-auto relative"
              />
            </div>
          </div>
          <p className="mb-4">© 2025 Kit da Criança Cristã para Colorir. Todos os direitos reservados.</p>

          {/* Suporte no footer */}
          <div className="bg-blue-700/50 p-4 rounded-xl max-w-md mx-auto mb-6">
            <p className="font-bold mb-2">Precisa de ajuda? Entre em contato:</p>
            <p className="text-xl font-bold text-yellow-300 mb-1">(11) 98765-4321</p>
            <p className="text-sm">contato.leandroempreendedor@gmail.com</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {["Política de Privacidade", "Termos de Uso", "Contato", "Suporte"].map((item, index) => (
              <a key={index} href="#" className="hover:underline transition-all duration-300 hover:text-yellow-200">
                {item}
              </a>
            ))}
          </div>
          <p className="text-sm text-blue-200">Desenvolvido com ❤️ para as famílias cristãs do Brasil</p>
        </div>
      </footer>
    </div>
  )
}

