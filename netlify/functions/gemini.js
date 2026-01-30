// Este archivo se ejecuta en los servidores de Netlify, no en el navegador del usuario.
// Aquí es seguro usar process.env.GEMINI_API_KEY

export const handler = async (event, context) => {
  // Solo permitimos peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 1. Obtener la clave secreta de las variables de entorno de Netlify
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "La API Key no está configurada en Netlify." }),
      };
    }

    // 2. Parsear el cuerpo de la solicitud que viene desde el index.html
    const requestBody = JSON.parse(event.body);

    // 3. Llamar a Google Gemini desde el servidor
    // Usamos el modelo flash-preview o el que prefieras
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    // 4. Devolver la respuesta de Google a tu página web
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("Error en la función serverless:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor al contactar con IA." }),
    };
  }
};
