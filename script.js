async function submition() {
  let transcript = document.getElementById('userimage').value
  let result = document.getElementById('result')
  console.log("Sending transcript:", transcript)

  try {
    const response = await fetch("/api/chat", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: `Look at the image ${transcript} and give an estimate of how many calories it has.`,
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 1,
        max_tokens: 200,
        top_p: 1,
        stream: false
      }),
    });

    const data = await response.json()

    if (data.choices && data.choices.length > 0) {
      document.getElementById('chatresult').style.display = 'block'
      const reply =
        data.choices[0].message?.content ||
        data.choices[0].text?.content ||
        "Please ask a work related question."
      result.textContent = reply
    } else {
      console.error("Unexpected response format:", data)
      result.textContent = "This feature is not working at this time"
    }
  } catch (err) {
    console.error("Error during fetch:", err)
    result.textContent = "This feature is not working at this time"
  }
}