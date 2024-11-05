import WebSocket from "ws"

export function createWebSocketServer() {
  const wsport = process.env.WSPORT || 3001
  const wss = new WebSocket.Server({ port: wsport as number })
  wss.on("connection", (ws) => {
    console.log("Client connected")

    ws.on("message", (message: string) => {
      const data = JSON.parse(message)
      if (data.action === "generate") {
        // Simulate image generation
        setTimeout(() => {
          const generatedImageUrl =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctuz6PbqpENPriLnMkKVP0u_Cyn-Hfd7xCQ&s" // Replace with actual URL
          ws.send(JSON.stringify({ image: generatedImageUrl }))
        }, 3000) // Simulating a delay for image generation
      }
    })

    ws.on("close", () => {
      console.log("Client disconnected")
    })
  })
  return wss
}
