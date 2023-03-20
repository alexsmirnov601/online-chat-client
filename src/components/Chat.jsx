import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../styles/Chat.module.css'
import icon from '../images/emoji.svg'
import EmojiPicker from 'emoji-picker-react'
import Messages from './Messages'

const socket = io.connect('https://online-chat-6y7e.onrender.com')

const Chat = () => {
  const { search } = useLocation()
  const [params, setParams] = useState({ room: '', user: '' })
  const [state, setState] = React.useState([])
  const [message, setMessage] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [users, setUsers] = React.useState(0)

  const navigate = useNavigate()

  React.useEffect(() => {
    /* получаем строку search */
    const searchParams = Object.fromEntries(new URLSearchParams(search))
    setParams(searchParams)
    socket.emit('join', searchParams)
  }, [search])

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setState((prev) => [...prev, data])
    })
  }, [])
  useEffect(() => {
    socket.on('room', ({ data: { users } }) => {
      setUsers(users.length)
    })
  }, [])

  const leftRoom = () => {
    socket.emit('leftRoom', { params })
    navigate('/')
  }

  const handleChange = ({ target: { value } }) => {
    setMessage(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message) return

    socket.emit('sendMessage', { message, params })

    setMessage('')
  }

  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}> {params.room}</div>
        <div className={styles.users}> {users} users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          left the room
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="What do you want to say?"
            value={message}
            className={styles.input}
            autoComplete="off"
            required
            onChange={handleChange}
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="icon" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        {/* поменять кнопку */}
        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Send a message" />
        </div>
      </form>
    </div>
  )
}

export default Chat
