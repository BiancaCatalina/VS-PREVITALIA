exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    if (!message || typeof message !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta el mensaje' }) };
    }

    const systemPrompt = `Eres el asistente virtual de PREVITALIA, una consultora chilena de prevención de riesgos laborales fundada por Rodrigo Allende Podestà.
Ofrecen: implementación de DS 44 y RIOHS, Ley Karin y riesgos psicosociales, capacitaciones (incendios, manejo de plaguicidas, TMERT, trabajo en altura, convivencia laboral), apoyo en auditorías y fiscalizaciones, e ISO 45001.
Responde breve, cercana y profesional, en español chileno. Si no sabes algo con certeza sobre PREVITALIA, sugiere contactar por el formulario o WhatsApp. No inventes precios ni compromisos legales.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: 0.5,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq error:', errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Error al conectar con la IA' }) };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Lo siento, no pude generar una respuesta.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};