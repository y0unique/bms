import { Form } from "../../components/Form";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import {useEffect } from "react";


const Login = () => {
  const [error, setError] = React.useState(null);
  const router = useRouter()
  const { data: session, status } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username: event.target.username.value,
      password: event.target.password.value,
    });

    // Check if res has a error property
    if (res.error) {
      setError(res.error);
    } 
    else if  (res.ok) {
      router.push("/");
    }
  }
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);
  
  console.log("Session: ", session);
  console.log("Session Status: ", status);
  return (
    <>   
        <Form handleSubmit={handleSubmit} error={error}/>
    </>
  );
};


export default Login;
