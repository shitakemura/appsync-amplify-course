import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { CreatePostMutation } from '../../src/API'
import { createPost } from '../../src/graphql/mutations'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

const initialState = { title: '', content: '' }
const CreatePost = () => {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <h1 className="mt-6 text-3xl font-semibold tracking-wide">
        Create New Post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="y-2 my-4 w-full border-b pb-2 text-lg font-light text-gray-500 placeholder-gray-500 focus:outline-none"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
    </div>
  )
}

export default CreatePost
