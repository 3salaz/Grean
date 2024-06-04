const CircularProgress = ({ level, pounds, maxPounds }) => {
  // Calculate the progress percentage
  const progress = (pounds / maxPounds) * 100;

  // Calculate the stroke-dashoffset based on the progress
  const strokeDashoffset = 440 - (440 * progress) / 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-32 h-32"
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="circle-bg"
          cx="80"
          cy="80"
          r="70"
          strokeWidth="10"
          stroke="#e6e6e6"
          fill="none"
        />
        <circle
          className="circle-progress"
          cx="80"
          cy="80"
          r="70"
          strokeWidth="10"
          stroke="#4caf50"
          fill="none"
          strokeDasharray="440"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          className="circle-text"
          fontSize="20"
          fill="#333"
        >
          {pounds} lbs
        </text>
      </svg>
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold">Level {level}</h2>
      </div>
    </div>
  );
};

export default CircularProgress;
