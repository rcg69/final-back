const msgObj = {
  sender: currentUserId,
  receiver: chatWithId,
  content: inputText,  // optional
  imageBase64: base64String,  // add base64 encoded image string
};
fetch("/api/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(msgObj),
});
