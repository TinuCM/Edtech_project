self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/login": [
    "static/chunks/pages/login.js"
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
    "/login",
    "/[chapter]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()