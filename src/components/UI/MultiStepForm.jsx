import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../UI/Button";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 4));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const progressBarWidth = (step / 4) * 100 + "%";

  return (
    <main className="w-full flex flex-col gap-4 h-[92%] max-w-lg mx-auto p-4">
      <header className="relative flex flex-col gap-2">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: progressBarWidth }}
            className="bg-grean h-2 rounded-full"
          ></motion.div>
        </div>
        <div className="w-full flex justify-between text-xs font-medium">
          <span className={`${step >= 1 ? "text-grean text-sm" : ""}`}>Basic Info</span>
          <span className={`${step >= 2 ? "text-grean text-sm" : ""}`}>Role</span>
          <span className={`${step >= 3 ? "text-grean text-sm" : ""}`}>Address</span>
          <span className={`${step >= 4 ? "text-grean text-sm" : ""}`}>Payment</span>
        </div>
      </header>

      {step === 1 && (
        <section className="min-h-[80%]">
          <h2 className="text-xl mb-4">Basic Info</h2>
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
          />
        </section>
      )}

      {step === 2 && (
        <section className="min-h-[80%]">
          <h2 className="text-xl mb-4">Role</h2>
          <select className="w-full mb-4 p-2 border rounded">
            <option>Select Role</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </section>
      )}

      {step === 3 && (
        <section className="min-h-[80%]">
          <h2 className="text-xl mb-4">Address</h2>
          <input
            type="text"
            placeholder="Street"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="State"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="ZIP Code"
            className="w-full mb-4 p-2 border rounded"
          />
        </section>
      )}

      {step === 4 && (
        <section className="min-h-[80%]">>
          <h2 className="text-xl mb-4">Payment Type</h2>
          <select className="w-full mb-4 p-2 border rounded">
            <option>Select Payment Type</option>
            <option>Paypal</option>
            <option>Zelle</option>
            <option>Venmo</option>
          </select>
        </section>
      )}

      <div className="flex justify-center gap-4 mt-4">
        {step > 1 && (
          <Button variant="primary" size="medium" onClick={prevStep}>
            Previous
          </Button>
        )}
        {step < 4 ? (
          <Button variant="primary" size="medium" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button variant="primary" size="medium" onClick={() => alert("Form submitted!")}>
            Submit
          </Button>
        )}
      </div>
    </main>
  );
};

export default MultiStepForm;
