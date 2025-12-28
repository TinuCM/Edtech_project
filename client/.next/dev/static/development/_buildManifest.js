self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/_error": [
    "static/chunks/pages/_error.js"
  ],
  "/learn": [
    "static/chunks/pages/learn.js"
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
    "/",
    "/Scrollpart1",
    "/Scrollpart2",
    "/Scrollpart3",
    "/_app",
    "/_error",
    "/learn",
    "/parentlogin"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()