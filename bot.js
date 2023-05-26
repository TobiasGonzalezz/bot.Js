const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on("ready", (message) => {
  console.log("Que pasa pá 🤑, estamos activos");
  const channel = client.channels.cache.get(process.env.ID_GENERAL); 
  if (channel) {
    channel.send(
      "Los comandos que puedes usar son: !chiste, !foto 'lo que quieras' (las fotos no tienen derechos de autor), !saludo"
    );
  } else {
    console.error("No se encontró el canal especificado.");
  }
});

// saludar
client.on("messageCreate", (message) => {
  if (message.content === "!saludo") {
    message.channel.send("¡Hola! ¿Cómo estás?");
  }
  if (message.content === "ping") {
    message.channel.send("pong");
  }
});

// enviar foto
// client.on("messageCreate", async (message) => {
//   if (message.content === "!foto supra") {
//     try {
//       const response = await axios.get(
//         `https://api.unsplash.com/photos/random?query=supra&client_id=${process.env.UNPLASH_TOKEN}`
//       );
//       const carImage = response.data.urls.regular;

//       message.channel.send(carImage);
//     } catch (error) {
//       console.error("Ocurrió un error al buscar la imagen del auto:", error);
//     }
//   }
// });

// enviar foto random
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!foto")) {
    const searchQuery = message.content.slice(6);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?query=${searchQuery}&client_id=${process.env.UNPLASH_TOKEN}`
      );
      const Image = response.data.urls.regular;

      message.channel.send(Image);
    } catch (error) {
      message.channel.send("no hay foto de eso wachin busca otra cosa");
      console.error(
        `Ocurrió un error al buscar la imagen del ${searchQuery}:`,
        error
      );
    }
  }
});

// enviar chiste
client.on("messageCreate", async (message) => {
  if (message.content === "!chiste") {
    try {
      const response = await axios.get(
        "https://v2.jokeapi.dev/joke/Any?lang=es"
      );
      if (response.data.type === "single") {
        const joke = response.data.joke;
        message.channel.send(joke);
      } else if (response.data.type === "twopart") {
        const setup = response.data.setup;
        const delivery = response.data.delivery;
        message.channel.send(setup);
        message.channel.send(delivery);
      }
    } catch (error) {
      console.error("Ocurrió un error al buscar un chiste:", error);
    }
  }
});

// calculadora
// client.on("messageCreate", (message) => {
//   if (message.content === "calculadora") {
//     message.channel.send("Ingresa el primer número:");
//     message.channel.send("Ingresa el segundo número:");

//         const suma = num1 + num2;
//         const resta = num1 - num2;
//         const multiplicacion = num1 * num2;
//         const division = num1 / num2;

//         message.channel.send(`El resultado de la suma es: ${suma}`);
//         message.channel.send(`El resultado de la resta es: ${resta}`);
//         message.channel.send(
//           `El resultado de la multiplicación es: ${multiplicacion}`
//         );
//         message.channel.send(`El resultado de la división es: ${division}`);
//       });
//     });
//   }
// });

// dolar
client.on("messageCreate", async (message) => {
  if (message.content === "!mercado") {
    try {
      const response = await axios.get(
        "https://www.dolarsi.com/api/api.php?type=valoresprincipales"
      );

      const cotizaciones = response.data;
      const nombresABuscar = [
        "Dolar Oficial",
        "Dolar Blue",
        "Dolar Bolsa",
        "Bitcoin",
      ];

      const cotizacionesBuscadas = cotizaciones.filter((cotizacion) =>
        nombresABuscar.includes(cotizacion.casa.nombre)
      );

      cotizacionesBuscadas.forEach((cotizacion) => {
        const compra = cotizacion.casa.compra;
        const venta = cotizacion.casa.venta;
        const nombre = cotizacion.casa.nombre;

        message.channel.send(
          `Cotización: ${nombre}, Compra: ${compra}, Venta: ${venta}`
        );
      });
    } catch (error) {
      console.error(
        "Ocurrió un error al obtener los valores del mercado:",
        error
      );
    }
  }
});

client.login(process.env.BOT_TOKEN);
