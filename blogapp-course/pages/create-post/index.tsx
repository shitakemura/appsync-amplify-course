import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { CreatePostMutation } from '../../src/API'
import { createPost } from '../../src/graphql/mutations'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})
import 'easymde/dist/easymde.min.css'

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '' })
  const { title, content } = post
  const router = useRouter()

  const createNewPost = async () => {
    if (!title || !content) return
    const id = uuid()

    const _ = (await API.graphql({
      query: createPost,
      variables: { input: { ...post, id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as GraphQLResult<CreatePostMutation>

    router.push(`/posts/${id}`)
  }

  return (
    <div>
      <h1 className="mt-6 text-3xl font-semibold tracking-wide">
        Create New Post
      </h1>
      <input
        onChange={(event) =>
          setPost((prev) => ({ ...prev, title: event.target.value }))
        }
        name="title"
        placeholder="Title"
        value={post.title}
        className="y-2 my-4 w-full border-b pb-2 text-lg font-light text-gray-500 placeholder-gray-500 focus:outline-none"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost((prev) => ({ ...prev, content: value }))}
      />
      <button
        type="button"
        className="mb-4 rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white"
        onClick={createNewPost}
      >
        Create Post
      </button>
    </div>
  )
}

export default withAuthenticator(CreatePost)
