self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/classes": [
    "static/chunks/pages/classes.js"
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
    "/classes",
    "/learn",
    "/parentlogin"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()