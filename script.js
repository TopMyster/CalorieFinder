async function submition() {
  let fileInput = document.getElementById('userimage');
  let file = fileInput.files[0];

  if (!file) {
    console.error("No file selected!");
    return;
  }

  let reader = new FileReader();
  reader.onload = async function(e) {
  let base64Image = e.target.result;
  console.log("Sending transcript:", base64Image)

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
            content: base64Image
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
      const reply =
        data.choices[0].message?.content ||
        data.choices[0].text?.content ||
        "Please ask a work related question."
        console.log(reply)
    } else {
      console.error("Unexpected response format:", data)
    }
  } catch (err) {
    console.error("Error during fetch:", err)
  }
}

reader.readAsDataURL(file); 
}