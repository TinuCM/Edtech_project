self.__BUILD_MANIFEST = {
  "/_error": [
    "static/chunks/pages/_error.js"
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
    "/_app",
    "/_error",
    "/login"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()