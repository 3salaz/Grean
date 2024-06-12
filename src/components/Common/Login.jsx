import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Button from "../Layout/Button";
import googleLogo from '../../assets/logos/Google__G__logo.png'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast.success("Signed in successfully with Google!");
      navigate("/account");
    } catch (error) {
      console.log(error);
      toast.error("Error signing in with Google. Please try again.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    console.log(error);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/account");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email and try again.");
      } else {
        setError(error.message);
        toast.error(
          "Error signing in. Please check your credentials and try again."
        );
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/account");
    }
  }, [user, navigate]);

  return (
      <div className="h-full w-full px-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex w-full justify-center items-center">
          <div className="container h-full flex items-center justify-cente max-w-lg">
            <div className="container max-w-3xl mx-auto rounded-md">
              <div className="w-full rounded-md">
                <div className="w-full flex items-end justify-end"></div>
                <div className="mx-auto w-full">
                  <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#75B657]">
                    Sign In To Your Account
                  </h2>
                </div>
                <div className="my-8">
                  <form className="space-y-4" onSubmit={handleSignIn}>
                    <div className="flex flex-col">
                      <label
                        id="email"
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-grean text-left"
                      >
                        Email address
                      </label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        required
                        className="block w-full rounded-md border-1 px-2 py-1.5 text-slate-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        id="password"
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-grean"
                      >
                        Password
                      </label>
                      <input
                          onChange={(e) => setPassword(e.target.value)}
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          required
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="text-sm">
                      <a
                        href="https://google.com"
                        className="font-semibold text-blue-400 hover:text-slate-800"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="w-full flex items-center justify-end">
                      <button
                        type="submit"
                        className="bg-[#75B657] rounded-xl w-24 p-1 text-lg text-white"
                      >
                        Sign In
                      </button>
                    </div>

                  </form>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Not a member?
                    <Link
                      to="/setup"
                      className="pl-1 font-semibold leading-6 text-[#75B657] hover:text-green-700"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                  <Button onClick={handleGoogleSignIn} variant="blue" size="medium" shape="rounded" className="flex justify-between">
                    <div className="bg-white">
                      <img className="w-7 aspect-square p-1" src={googleLogo} alt="google logo" srcset="" />
                    </div>
                    <div>Sign In</div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Login;
