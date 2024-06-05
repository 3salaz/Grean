import ContactForm from "../../Forms/ContactForm";

function Contact() {
  return (
    <div className="h-full w-full snap-always snap-center bg-white flex flex-col items-center p-2">
      <header className="bg-grean text-white w-full p-2 drop-shadow-lg">
        <div className="rounded-sm font-bold text-lg">Contact</div>
      </header>
      <main className="w-full p-2">
        <ContactForm/>
      </main>
    </div>
  );
}

export default Contact;
