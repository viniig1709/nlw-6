import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  // hasLiked: boolean
  likeId: string | undefined
}

export function useRoom(roomId: string) {

  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
   
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => { // 'once' ouve o evento uma única vez, 'on' mais de uma vez

      // console.log(room.val()) // '.val()' busca os dados que contêm em 'rooms/'

      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

    })

    return () => {
      roomRef.off('value')
    }

  }, [roomId, user?.id]) // Toda vez que o roomId for alterado, o código é executado novamente. Como depende de user.id, a cada alteração deve ser recarregado.

  return { questions, title }
  
}