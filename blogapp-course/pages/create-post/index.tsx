import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { CreatePostMutation } from '../../src/API'
import { createPost } from '../../src/graphql/mutations'

const initialState = { title: '', content: '' }
const CreatePost = () => {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()

  const onChange = (event: any) => {
    setPost(() => ({ ...post, [event.target.name]: event.target.value }))
  }

  const createNewPost = async () => {
    if (!title || !content) return
    const id = uuid()

    const _ = (await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as GraphQLResult<CreatePostMutation>

    router.push(`/post/${id}`)
  }

  return (
    <div>
      <h1>Create New Post</h1>
    </div>
  )
}

export default CreatePost
