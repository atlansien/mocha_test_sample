const app = require("./server");

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8040;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${PORT}`);
});
