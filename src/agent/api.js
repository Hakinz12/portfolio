// Talks to the small server in /server, which holds the Gemini key.
// Resolves to { reply, startEnquiry }. Rejects with an Error that may carry `.status`.
export async function askAgent(messages, endpoint, signal) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok) {
    const err = new Error(`agent_http_${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  if (!data || typeof data.reply !== 'string') throw new Error('agent_bad_response');
  return { reply: data.reply, startEnquiry: !!data.startEnquiry };
}
