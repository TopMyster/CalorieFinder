async function submition() {
  let fileInput = document.getElementById('userimage')
  let file = fileInput.files[0]

  if (!file) {
    console.error("No file selected!")
    return
  }

  let reader = new FileReader()
  reader.onload = async function(e) {
    let base64Image = e.target.result
    console.log("Sending image:", base64Image)

    try {
      const response = await fetch("/api/chat", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Look at the image and give an estimate of how many calories it has."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          temperature: 1,
          max_completion_tokens: 900,
          top_p: 1,
          stream: false
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      let reply
      if (data.choices && data.choices.length > 0) {
        reply =
          data.choices[0].message?.content ||
          data.choices[0].text?.content ||
          "No answer provided."
      } else if (data.messages && data.messages.length > 0) {
        reply = data.messages[data.messages.length - 1].content
      } else {
        reply = "Unexpected response format."
        console.error("Unexpected response format:", data)
      }
      console.log(reply)
      document.getElementById('result').textContent = reply
    } catch (err) {
      console.error("Error during fetch:", err)
    }
  }

  reader.readAsDataURL(file)
}
