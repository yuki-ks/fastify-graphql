const fastify = require('fastify');
const mercurius = require('mercurius');

const dogs = [{
  ownerId: 1,
  name: 'Fuku'
}, {
  ownerId: 2,
  name: 'Sora'
}, {
  ownerId: 3,
  name: 'Chachamaru'
}, {
  ownerId: 4,
  name: 'Kotaro'
}, {
  ownerId: 5,
  name: 'Hana'
}, {
  ownerId: 6,
  name: 'Mugi'
}, {
  ownerId: 7,
  name: 'An'
}, {
  ownerId: 8,
  name: 'Chacha'
}];

const owners = [
  {
    id: 1,
    name: 'Haruto'
  },
  {
    id: 2,
    name: 'Aoto'
  },
  {
    id: 3,
    name: 'Riku'
  },
  {
    id: 4,
    name: 'Minato'
  },
  {
    id: 5,
    name: 'Ema'
  },
  {
    id: 6,
    name: 'Mei'
  },
  {
    id: 7,
    name: 'Sana'
  },
  {
    id: 8,
    name: 'Mio'
  }
];

const schema = `
  type Human {
    id: ID!
    name: String!
  }

  type Dog {
    name: String!
    ownerId: ID!
    owner: Human
  }

  type Query {
    test(x: Int, y: Int): Int
    dogs: [Dog]
  }
`;

const resolvers = {
  Query: {
    test: async (_, { x, y }) => x + y,
    dogs: async (obj, params ,ctx) => dogs
  }
}

const loaders = {
  Dog: {
    async owner(queries) {
      return queries.map(({ obj }) => owners.find(owner => owner.id === obj.ownerId));
    }
  }
}

function init() {
  const app = fastify();

  app.register(require('@fastify/mysql'), {
    connectionString: 'mysql://root@localhost/mysql'
  });

  app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true
  })

  app.get('/', async function (request, reply) {
    const query = '{ test(x: 2, y: 2) }';
    return reply.graphql(query);
  });

  return app;
}

if (require.main === module) {
  init().listen({ port: 3000 }, err => {
    if (err) console.log(err);
    console.log('server listening on 3000');
  });
} else {
  module.exports = init;
}