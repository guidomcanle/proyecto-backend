process.on("message", (cant) => {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const numeros = [];

  for (i = 0; i <= cant; i++) {
    const random = getRandomInt(1, 1000);
    numeros.push(random);
  }
  process.send(numeros);
});
