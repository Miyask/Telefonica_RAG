# Telefónica Empresas RAG Assistant Prototype

Este proyecto es un prototipo funcional de un asistente RAG (Retrieval-Augmented Generation) diseñado para centralizar la documentación técnica y comercial de Telefónica Empresas.

## 🚀 Arquitectura RAG

El sistema implementa una arquitectura modular con las siguientes reglas estrictas:

1.  **Búsqueda Híbrida Local**: Simulación de recuperación por similitud de texto y metadatos.
2.  **Control de Vigencia**: Los documentos tienen fecha de caducidad. Si un documento está caducado, el sistema se niega a usarlo y escala la consulta.
3.  **Citas Obligatorias**: Toda respuesta generada debe incluir metadatos de la fuente (Título, Versión, Propietario, Vigencia).
4.  **Zero-Hallucination**: Si el score de relevancia es inferior a 0.75 o no hay documentos válidos, el sistema responde con una frase predefinida de "No encontrado" y ofrece derivación a un agente.

## 🧩 Módulos Core

-   `rag-retriever.ts`: Lógica de recuperación y scoring.
-   `kb-manager.ts`: Gestión de la base de conocimientos (12 documentos mock).
-   `citation-engine.ts`: Formateo y validación de citas.
-   `handoff-engine.ts`: Generación de payloads JSON para escalado a agentes.
-   `audit-logger.ts`: Registro de auditoría para métricas y control de calidad.

## 🛠️ Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo (Vite + Express)
npm run dev

# Ejecutar batería de tests QA (Cero Alucinaciones)
npm run test:qa
```

## 🧪 Política de Mantenimiento y Tests

El script `npm run test:qa` valida:
-   **10 FAQs exactas**: Verifican que el retriever encuentra el documento correcto.
-   **5 "No encontrado"**: Verifican que consultas fuera de dominio no generan alucinaciones.
-   **3 Caducado/Conflicto**: Verifican que el sistema detecta documentos obsoletos.

## 📊 Dashboard de Métricas

El sistema incluye un panel de auditoría que muestra:
-   % de citas correctas.
-   Tasa de escalado (handoff).
-   Estado de vigencia de la base de conocimientos.
-   Logs de auditoría en tiempo real.

---
**Desarrollado por**: Ariadna RT (Senior Software Architect & RAG Engineer)
**Stack**: React, TypeScript, Tailwind CSS, Express, tsx.
