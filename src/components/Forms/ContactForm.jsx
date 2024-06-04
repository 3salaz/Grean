import {useRef} from 'react'
import emailjs from '@emailjs/browser';

function ContactForm() {
    const form = useRef();

    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_d6aj2lw', 'template_41orkiq', form.current, 'tx3Q3atJsYPq2xTPe')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    };
    
    return (

      <form ref={form} onSubmit={sendEmail} className='container mx-auto bg-grean rounded-md p-2'>
        <div className='flex flex-col'>
          <label>Name</label>
          <input type="text" name="user_name" />
        </div>
        <div className='flex flex-col'>
          <label>Email</label>
          <input type="text" name="subject" />
        </div>
        <div className='flex flex-col'>
          <label>Subject</label>
          <input type="email" name="user_email" />
        </div>
        <div className='flex flex-col'>
          <label>Message</label>
          <textarea name="message" />
        </div>
        <input onClick={sendEmail} type="submit" value="Send" />
      </form>
  );
}

export default ContactForm