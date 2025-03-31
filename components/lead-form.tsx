"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LeadForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  // Função para validar email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    if (!validateEmail(email)) {
      setStatus("error")
      setMessage("Por favor, insira um email válido.")
      return
    }

    // Validar nome
    if (!name.trim()) {
      setStatus("error")
      setMessage("Por favor, insira seu nome.")
      return
    }

    setIsSubmitting(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar dados")
      }

      // Sucesso
      setStatus("success")
      setMessage("Obrigado! Seus dados foram registrados com sucesso.")
      setName("")
      setEmail("")

      // Resetar status após 5 segundos
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      setStatus("error")
      setMessage("Ocorreu um erro ao registrar seus dados. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                status === "error" && !name.trim()
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent`}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  status === "error" && !validateEmail(email)
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
                disabled={isSubmitting}
              />
              {status === "error" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Quero Receber</span>
                  <Mail className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mensagem de status */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>{message}</span>
          </div>
        )}

        <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Prometemos não enviar spam e você pode cancelar a qualquer momento</span>
        </div>
      </form>
    </div>
  )
}

