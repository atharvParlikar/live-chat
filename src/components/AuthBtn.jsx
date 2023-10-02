const AuthBtn = ({ authenticate, skipAuth }) => {
  return (
    <div className="w-full h-screen bg-yellow-300 flex flex-col justify-center font-mono">
      <div className="flex flex-col items-center">
        <button
          className="p-4 border-4 border-gray-800 mb-4 rounded-md font-bold"
          onClick={authenticate}
          style={{
            boxShadow: "6px 6px 0 0",
          }}
        >
          Authenticate
        </button>
        <p onClick={skipAuth} className="cursor-pointer underline text-center">
          skip authenticateion (watch-only mode)
        </p>
      </div>
    </div>
  );
};

export default AuthBtn;
