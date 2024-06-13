import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Form, Input, Button } from "antd";

function Contact() {
  const form = useRef();

  const sendEmail = (values) => {
    emailjs
      .sendForm(
        "service_d6aj2lw",
        "template_41orkiq",
        form.current,
        "tx3Q3atJsYPq2xTPe"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <div className="h-full gap-2 container snap-always snap-center bg-white flex flex-col items-center p-2">
      <header className="bg-grean text-white w-full p-2 drop-shadow-lg">
        <div className="rounded-sm font-bold text-lg">Contact</div>
      </header>
      <main className="w-full bg-slate-800 h-full p-2">
        <Form
          ref={form}
          onFinish={sendEmail}
          layout="vertical"
          className="container mx-auto bg-green rounded-md p-2"
        >
          <Form.Item
            label="Name"
            name="user_name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="user_email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please input the subject!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input your message!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}

export default Contact;
