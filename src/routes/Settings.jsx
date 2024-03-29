import UserHeader from '../components/UserHeader';
import ProfileForm from '../components/Tabs/Profile/ProfileForm'

function Settings() {
  return (
    <section
    id="profileTab"
    className="w-full h-[83svh] z-10 bg-white absolute top-0 flex items-center justify-center"
  >
    {/* Card */}
    <main className="container mx-auto h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col items-center relative">
          <UserHeader/>
          <ProfileForm/>
      </div>
    </main>
  </section>
  )
}

export default Settings