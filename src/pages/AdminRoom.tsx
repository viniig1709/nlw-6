import { useHistory, useParams } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
// import { useContext } from 'react'

type RoomParams = {
 id: string
}

export function AdminRoom() {

  // const { user } = useAuth()

  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  
  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm("Tem certeza que deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id='page-room'>
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <div>
            <RoomCode code={params.id}/>
            <Button isOutlined onClick={handleEndRoom}> Encerrar sala </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && // '&&' serve para o fazer o if sem else
            <span> {questions.length} pergunta(s) </span>
          }
        </div>
        {/* {JSON.stringify(questions)} */}
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} // Se não passar a key, o react renderiza toda a lista para evitar problemas (ineficiente)
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta"/>
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}