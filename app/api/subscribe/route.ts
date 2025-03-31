import { NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvGHoMEey_Nlf5yFHk0-HwSFEjtWRel6M",
  authDomain: "kit-cristao.firebaseapp.com",
  projectId: "kit-cristao",
  storageBucket: "kit-cristao.firebasestorage.app",
  messagingSenderId: "233883722686",
  appId: "1:233883722686:web:9301d80e1b90247680cfef",
  measurementId: "G-09LR0SBDCX",
};

// Inicializa o Firebase apenas se ainda não foi inicializado
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validação básica
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    // Salvar no Firestore
    const docRef = await addDoc(collection(db, "leads"), {
      name,
      email,
      createdAt: serverTimestamp(),
      source: "landing_page",
    });

    console.log("Documento criado com ID:", docRef.id);

    return NextResponse.json({
      success: true,
      message: "Dados salvos com sucesso!",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Erro ao salvar dados:", error);

    return NextResponse.json(
      {
        error: "Erro ao processar solicitação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

