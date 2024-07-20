"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Page() {
  const { token } = useParams();
  const router = useRouter();

  console.log(token, "tokennnnnn");
  const redirectUrl = localStorage.getItem("gotourl");


  useEffect(() => {
    if (token) {
      document.cookie = `jwt=${token}; max-age=${60 * 60 * 24 * 7}; path=/`;
      localStorage.setItem("jwt_token", token);
      
      const timeout = 1000; // Define a timeout value, e.g., 3 seconds (3000 ms)
      
      setTimeout(() => {
        if(redirectUrl){
          router.push(redirectUrl)
        }else{

          router.push("/user");
        }
      }, timeout);
    }
  }, [token, router]);

  return (
    <div>
      Redirecting...
    </div>
  );
}
