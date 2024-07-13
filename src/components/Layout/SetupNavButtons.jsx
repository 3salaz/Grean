import React from "react";
import { Button } from "antd";

function SetupNavButtons({ step, user, navigateHome, prevStep, nextStep, handleSubmit }) {
  return (
    <nav className="flex justify-center gap-4 mt-4 bg-white w-full items-start h-[20%]">
      {step > 1 && (
        <Button
          className="bg-red-500 text-white"
          type="primary"
          size="large"
          onClick={prevStep}
        >
          Back
        </Button>
      )}
      {step === 1 && !user && (
        <Button
          className="bg-red-500 text-white"
          type="primary"
          size="large"
          onClick={navigateHome}
        >
          Back
        </Button>
      )}
      {step === 0 && (
        <div className="flex gap-4">
          <Button
            className="bg-red-500 text-white"
            type="primary"
            size="large"
            onClick={navigateHome}
          >
            Back
          </Button>
          <Button
            className="text-white bg-grean"
            type="primary"
            size="large"
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      )}
      {step === 1 && (
        <div className="flex gap-4">
          <Button
            className="bg-red-500 text-white"
            type="primary"
            size="large"
            onClick={navigateHome}
          >
            Back
          </Button>
          <Button
            className="bg-grean text-white"
            type="primary"
            size="large"
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      )}
      {step === 2 && (
        <Button
          className="bg-grean text-white"
          type="primary"
          size="large"
          onClick={nextStep}
        >
          Next
        </Button>
      )}
      {step === 3 && (
        <Button
          className="bg-grean text-white"
          type="primary"
          size="large"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      )}
    </nav>
  );
}

export default SetupNavButtons;
