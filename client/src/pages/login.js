import Head from "next/head";
import { CssBaseline } from "@mui/material";

// import { useEffect } from "react";

import Login from "../components/common/Login";


export default function LoginPage() {


  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <CssBaseline />
        <Login />

    </>
  );
}
