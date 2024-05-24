import UserHeader from '../components/UserHeader';
import ProfileUpdate from '../components/ProfileUpdate'

function Settings() {
  return (
    <main
    id="profileUpdate"
    className="w-full h-[90%] z-10 absolute top-[8%] flex flex-col items-center justify-center"
  >
    {/* Card */}
          <UserHeader/>
          <ProfileUpdate/>
  </main>
  )
}

export default Settings