function numeroRandom(p) {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  console.log("hola" + p);
  const cant = p;
  const numeros = [];

  for (i = 0; i < cant; i++) {
    const random = getRandomInt(1, 1000);
    numeros.push(random);
  }

  console.log(numeros);
  return numeros;
}

module.exports = numeroRandom();
