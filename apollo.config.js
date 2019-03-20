module.exports = {
  client: {
    service: "scribecushion",
    includes: ["./packages/web/graphql/**/*.ts"],
    excludes: ["**/.next/**"]
  }
};
