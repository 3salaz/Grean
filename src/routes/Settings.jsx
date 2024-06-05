import UserHeader from '../components/Common/UserHeader';
import ProfileForm from '../components/Common/ProfileForm'

function Settings() {
  return (
    <main
    id="profileUpdate"
    className="w-full h-full pb-6 z-10 absolute flex flex-col items-center justify-center bg-slate-800"
  >
    {/* Card */}
          <UserHeader/>
          <ProfileForm/>
  </main>
  )
}

export default Settings