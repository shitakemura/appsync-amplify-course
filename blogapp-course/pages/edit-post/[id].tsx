import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetPostQuery, Post, UpdatePostMutation } from '../../src/API'
import { updatePost } from '../../src/graphql/mutations'
import { getPost } from '../../src/graphql/queries'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})
import 'easymde/dist/easymde.min.css'

const EditPost = () => {
  const [post, setPost] = useState<Post | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      const { data } = (await API.graphql({
        query: getPost,
        variables: { id },
      })) as GraphQLResult<GetPostQuery>

      setPost(data?.getPost ?? null)
    }

    fetchPost()
  }, [id])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev!, [event.target.name]: event.target.value }))
  }

  const updateCurrentPost = async () => {
    if (!post?.title || !post?.content) return

    const postUpdated = {
      id,
      title: post.title,
      content: post.content,
    }

    const _ = (await API.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as GraphQLResult<UpdatePostMutation>

    router.push('/my-posts')
  }

  if (!post) return null

  return (
    <div>
      <h1 className="mt-6 mb-2 text-3xl font-semibold tracking-wide">
        Edit Post
      </h1>
      <input
        className="focus y-2 my-4 border-b pb-2 text-lg text-gray-500 placeholder-gray-500"
        name="title"
        placeholder="Title"
        value={post.title}
        onChange={onChange}
      />
      <SimpleMDE
        value={post.content ?? ''}
        onChange={(value) =>
          setPost((prev) => ({ ...prev!, content: value }))
        }
      />
      <button
        className="mb-4 rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white"
        onClick={updateCurrentPost}
      >
        Update Post
      </button>
    </div>
  )
}

export default EditPost
