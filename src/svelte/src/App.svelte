<script>
  export const name = "Goth Svelte FE"
  let loading = true
  // Variables to hold WebSocket connection and messages
  let socket
  let loadingMessage = "Waiting for your hot goth girl to be generated..."
  let generatedImageUrl = "" // To store the URL of the generated image

  // Establish the WebSocket connection when the component mounts
  import { onMount } from "svelte"

  onMount(() => {
    // Connect to the WebSocket server
    socket = new WebSocket("ws://localhost:3001") // Change the URL as needed
    let ready = false
    const interval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            ready = true
            socket.send(JSON.stringify({ action: "generate" }))
            loadingMessage = "Generating your goth girl... Please wait!"
            loading = true
        }
        if (ready) {
            clearInterval(interval)
        }
      }, 1000)

    // Listen for messages from the server
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.image) {
        generatedImageUrl = data.image // Update the image URL
        loadingMessage = "" // Clear loading message
        loading = false
      }
    }

    // Handle connection errors
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error)
      loadingMessage = "Connection error. Please try again."
      loading = false
    }

    // Clean up WebSocket connection when the component is destroyed
    return () => {
      socket.close()
    }
  })
</script>

<main>
  <p>{loadingMessage}</p>
  {#if loading}
    <img
    src="/assets/loadingspinner.png"
    id="GAAS_create_loading_img"
    alt="loading icon for goth girl generator"
    />
  {/if}
  {#if generatedImageUrl}
    <img src={generatedImageUrl} alt="Generated Goth Girl" />
  {/if}
</main>

<style>
  #GAAS_create_loading_img {
    width: 25px;
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  img {
    margin-top: 20px; /* Add some spacing for the generated image */
    max-width: 100%; /* Responsive image */
  }
</style>
