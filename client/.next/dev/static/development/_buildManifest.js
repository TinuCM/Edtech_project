self.__BUILD_MANIFEST = {
  "/parentlogin": [
    "static/chunks/pages/parentlogin.js"
  ],
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/api/:path*"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error",
    "/parentlogin"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()