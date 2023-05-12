const socket = io()

const urlSearch = new URLSearchParams(window.location.search)

const username = urlSearch.get('username')
const room = urlSearch.get('select_room')

const userNameDiv = document.getElementById('username')
userNameDiv.innerHTML = `Hello <strong>${username}</strong> voçê está na sala: <strong>${room}</strong>`

socket.emit(
  'select_room',
  {
    username,
    room,
  },
  (messages) => {
    console.log('response', messages)
    messages.forEach((message) => createMessage(message))
  },
)

document
  .getElementById('message_input')
  .addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value

      socket.emit('message', {
        room,
        message,
        username,
      })
      event.target.value = ''
    }
  })

socket.on('message', (data) => {
  createMessage(data)
})

function createMessage(data) {
  const messageDiv = document.getElementById('messages')

  messageDiv.innerHTML += `
    <div class="new_message">
      <label class="form-label">
        <strong> ${data.username} </strong> <span> ${data.text} - ${dayjs(
    data.createdAt,
  ).format('DD/MM HH:mm')}</span>
      </label>
    </div>
  `
}

document.getElementById('logout').addEventListener('click', (event) => {
  window.location.href = 'index.html'
})
