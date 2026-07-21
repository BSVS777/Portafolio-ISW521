export function registerSse(app, eventBus, getSnapshot) {
  app.get('/api/events', (req, res) => {
    res.writeHead(200, {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    const send = (event, payload) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    send('whatsapp.status', getSnapshot());

    const offStatus = eventBus.on('whatsapp.status', (payload) => send('whatsapp.status', payload));
    const offReceived = eventBus.on('message.received', (payload) => send('message.received', payload));

    req.on('close', () => {
      offStatus();
      offReceived();
    });
  });
}