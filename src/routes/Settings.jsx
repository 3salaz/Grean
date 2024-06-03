import UserHeader from '../components/UserHeader';
import ProfileUpdate from '../components/ProfileUpdate'

function Settings() {
  return (
    <main
    id="profileUpdate"
    className="w-full h-[92svh] z-10 absolute top-[8svh] flex flex-col items-center justify-center"
  >
    {/* Card */}
          <UserHeader/>
          <ProfileUpdate/>
  </main>
  )
}

export default Settings