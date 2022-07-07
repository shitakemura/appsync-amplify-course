import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  CreatePostInput,
  CreatePostMutation,
  CreatePostMutationVariables,
} from '../../src/API'
import { createPost } from '../../src/graphql/mutations'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})
import 'easymde/dist/easymde.min.css'
import Image from 'next/image'

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '' })
  const { title, content } = post
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const imageFileInput = useRef<HTMLInputElement>(null)

  const createNewPost = async () => {
    if (!title || !content) return
    const id = uuid()

    const postInput: CreatePostInput = {
      id,
      title,
      content,
    }

    if (image) {
      const filename = `${image.name}_${uuid()}`
      postInput.coverImage = filename
      await Storage.put(filename, image)
    }

    const _ = (await API.graphql({
      query: createPost,
      variables: { input: postInput } as CreatePostMutationVariables,
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as GraphQLResult<CreatePostMutation>

    router.push(`/posts/${id}`)
  }

  const uploadImage = async () => {
    imageFileInput.current?.click()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files ? event.target.files[0] : null
    if (!fileUploaded) return
    setImage(fileUploaded)
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
      {image && (
        <Image
          width={300}
          height={200}
          src={URL.createObjectURL(image)}
          alt="post-image"
          className="my-4"
        />
      )}
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost((prev) => ({ ...prev, content: value }))}
      />
      <input
        type="file"
        ref={imageFileInput}
        className="absolute h-0 w-0"
        onChange={handleChange}
      />
      <button
        type="button"
        className="mr-2 mb-4 rounded-lg bg-green-600 px-8 py-2 font-semibold text-white"
        onClick={uploadImage}
      >
        Upload Cover Image
      </button>
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
