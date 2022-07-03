import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const Profile = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1 className="mt-6 text-3xl font-semibold tracking-wide">
            Profile
          </h1>
          <h1 className="my-2 font-medium text-gray-500">{user?.username}</h1>
          <p className="mb-6 text-sm text-gray-500">
            {user?.attributes?.email}
          </p>
        </div>
      )}
    </Authenticator>
  )
}

export default Profile
