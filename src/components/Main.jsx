import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Main.module.css'

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
}

const Main = () => {
  const { NAME, ROOM } = FIELDS
  console.log()

  const [values, setValues] = React.useState({ [NAME]: '', [ROOM]: '' })

  /* здесь не понял?? */
  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value })
  }

  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((value) => !value)

    console.log(isDisabled)

    if (isDisabled) {
      e.preventDefault()
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>
        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={values[NAME]}
              className={styles.input}
              autoComplete="off"
              required
              onChange={handleChange}
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              placeholder="Room"
              value={values[ROOM]}
              className={styles.input}
              autoComplete="off"
              required
              onChange={handleChange}
            />
          </div>
          <Link
            className={styles.group}
            onClick={handleClick}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
          >
            <button type="submit" className={styles.button}>
              Sign in
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Main
