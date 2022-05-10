const { faker } = require("@faker-js/faker");

function createProds() {
  const id = 0;

  return {
    id: id,
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnai: faker.image.imageUrl(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.past(),
    stock: faker.datatype.number({ min: 50, max: 10000 }),
  };
}

module.exports = createProds;
