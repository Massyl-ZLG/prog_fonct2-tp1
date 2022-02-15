import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });



async function foxImage() {
  const url = "https://randomfox.ca/floof/";
  try {
    const response = await axios.get(url);
    return response.data.image;
  }
  catch {
    return null;
  }
}

async function catFacts() {
  const uri = 'https://cat-fact.herokuapp.com/facts/random?amount=3'
  try {
    const response = await axios.get(uri);
    return response.data.map(x => x.text);
  }
  catch {
    return null;
  }
}

//gerer la partie ou le user ne definit pas le cr 
async function dayOff(cr) {
  const year = new Date().getFullYear();
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${cr}`
  try {
    const response = await axios.get(url);
    return response.data;
  }
  catch {
    return null;
  }
  
}
// Only used for dev server, do not remove
app.head('/', () => ({ ping: 'pong' }));

app.post('/', async (req, res) => {
  // si jamais body est nul -> contrycode est nul 
  const countryCode = req.body?.countryCode;
  return {
    foxPicture: await foxImage(),
    catFacts: await catFacts(),
    holidays: await dayOff(countryCode)
    //ajouter methode pour que les requêtes se lancent en même temps 
  }
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};


start();