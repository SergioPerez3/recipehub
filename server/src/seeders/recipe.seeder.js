import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

const users = [
  { name: "Saladman", email: "saladman@recipehub.dev" },
  { name: "Veganmix", email: "veganmix@recipehub.dev" },
  { name: "VacaLola", email: "vacalola@recipehub.dev" },
];
// Usuarios de ejemplo de la primera versión del seeder (se borran si existen)
const legacyEmails = [
  "laura@recipehub.dev",
  "gaby@recipehub.dev",
  "marta@recipehub.dev",
];

const img = (seed) => `https://picsum.photos/seed/${seed}/600/400`;

const recipes = [
  // ---------- Saladman ----------
  {
    author: "Saladman",
    title: "Ensalada de quinoa y aguacate",
    description: "Vegana, fresca y saciante. Ideal para llevar en tupper.",
    image: img("quinoa-aguacate"),
    ingredients:
      "200 g de quinoa\n1 aguacate maduro\n10 tomates cherry\n1/2 pepino\n1 lata pequeña de maíz\nZumo de 1 limón\nAceite de oliva\nCilantro fresco\nSal",
    steps:
      "Lava la quinoa y cuécela 15 minutos en doble volumen de agua\nDéjala enfriar y esponja con un tenedor\nCorta el aguacate, los tomates y el pepino\nMezcla todo con el maíz\nAliña con limón, aceite, sal y cilantro picado",
    category: "comida",
    difficulty: "fácil",
    cookingTime: 25,
  },
  {
    author: "Saladman",
    title: "Ensalada caprese",
    description: "Vegetariana y lista en diez minutos.",
    image: img("caprese"),
    ingredients:
      "4 tomates maduros\n2 bolas de mozzarella\nAlbahaca fresca\nAceite de oliva virgen extra\nSal en escamas\nPimienta negra",
    steps:
      "Corta los tomates y la mozzarella en rodajas\nAlterna las rodajas en un plato\nAñade hojas de albahaca\nAliña con aceite, sal y pimienta",
    category: "cena",
    difficulty: "fácil",
    cookingTime: 10,
  },
  {
    author: "Saladman",
    title: "Ensalada de garbanzos mediterránea",
    description: "Vegana, con proteína vegetal y mucho sabor.",
    image: img("garbanzos-med"),
    ingredients:
      "1 bote de garbanzos cocidos\n2 tomates\n1 pepino\n1/2 cebolla roja\nAceitunas negras\nPerejil\nZumo de 1 limón\nAceite de oliva\nOrégano y sal",
    steps:
      "Escurre y aclara los garbanzos\nCorta las verduras en dados pequeños\nMezcla todo en un bol con las aceitunas\nAliña con limón, aceite, orégano y sal\nDeja reposar 10 minutos antes de servir",
    category: "comida",
    difficulty: "fácil",
    cookingTime: 15,
  },

  // ---------- Veganmix ----------
  {
    author: "Veganmix",
    title: "Curry de garbanzos y espinacas",
    description: "Vegano, cremoso y especiado. Para mojar con arroz.",
    image: img("curry-garbanzos"),
    ingredients:
      "2 botes de garbanzos cocidos\n200 g de espinacas frescas\n1 cebolla\n2 dientes de ajo\n1 trozo de jengibre\n400 ml de tomate triturado\n200 ml de leche de coco\n2 cucharadas de curry en polvo\nAceite de oliva y sal",
    steps:
      "Sofríe la cebolla, el ajo y el jengibre picados\nAñade el curry y remueve un minuto\nIncorpora el tomate y cuece 10 minutos\nAñade los garbanzos y la leche de coco\nCuece 10 minutos más e incorpora las espinacas\nSirve con arroz basmati",
    category: "cena",
    difficulty: "media",
    cookingTime: 35,
  },
  {
    author: "Veganmix",
    title: "Hummus casero",
    description: "Vegano, suave y cremoso. Mejor que el de bote.",
    image: img("hummus"),
    ingredients:
      "1 bote de garbanzos cocidos\n2 cucharadas de tahini\n1 diente de ajo\nZumo de 1 limón\n3 cucharadas de aceite de oliva\n1/2 cucharadita de comino\nSal\nPimentón para decorar",
    steps:
      "Escurre los garbanzos y guarda un poco del líquido\nTritura todo con la batidora hasta obtener una crema\nAñade líquido de los garbanzos si queda muy espeso\nRectifica de sal y limón\nSirve con un chorrito de aceite y pimentón",
    category: "snack",
    difficulty: "fácil",
    cookingTime: 15,
  },
  {
    author: "Veganmix",
    title: "Porridge de avena con plátano y nueces",
    description: "Desayuno vegano calentito y rápido.",
    image: img("porridge"),
    ingredients:
      "50 g de copos de avena\n250 ml de bebida vegetal\n1 plátano maduro\nCanela\nUn puñado de nueces\nSirope de agave (opcional)",
    steps:
      "Calienta la avena con la bebida vegetal a fuego medio\nRemueve 5 minutos hasta que espese\nAplasta medio plátano e intégralo\nSirve con el resto del plátano en rodajas, nueces y canela",
    category: "desayuno",
    difficulty: "fácil",
    cookingTime: 10,
  },
  {
    author: "Veganmix",
    title: "Brownie vegano de chocolate",
    description: "Sin huevo ni lácteos, y nadie lo nota.",
    image: img("brownie-vegano"),
    ingredients:
      "150 g de harina\n60 g de cacao puro en polvo\n150 g de azúcar moreno\n2 plátanos maduros\n100 ml de aceite de oliva suave\n100 ml de bebida vegetal\n1 cucharadita de levadura\nUn puñado de nueces",
    steps:
      "Precalienta el horno a 180 °C\nAplasta los plátanos y mézclalos con el aceite, el azúcar y la bebida vegetal\nAñade la harina, el cacao y la levadura tamizados\nIncorpora las nueces troceadas\nVierte en un molde forrado y hornea 25 minutos\nDeja enfriar antes de cortar",
    category: "postre",
    difficulty: "media",
    cookingTime: 45,
  },

  // ---------- VacaLola ----------
  {
    author: "VacaLola",
    title: "Tortilla de calabacín",
    description: "Vegetariana, jugosa y con poca grasa.",
    image: img("tortilla-calabacin"),
    ingredients: "2 calabacines\n1 cebolla\n5 huevos\nAceite de oliva\nSal",
    steps:
      "Corta el calabacín y la cebolla en láminas finas\nPóchalos en la sartén con aceite a fuego lento\nBate los huevos con sal y mezcla con las verduras escurridas\nCuaja la tortilla por ambos lados",
    category: "cena",
    difficulty: "media",
    cookingTime: 35,
  },
  {
    author: "VacaLola",
    title: "Lasaña de verduras",
    description: "Vegetariana, con bechamel y mucho queso gratinado.",
    image: img("lasana-verduras"),
    ingredients:
      "12 placas de lasaña\n2 calabacines\n1 berenjena\n2 zanahorias\n400 g de tomate frito\n50 g de mantequilla\n50 g de harina\n600 ml de leche\n150 g de queso rallado\nNuez moscada y sal",
    steps:
      "Corta las verduras en dados y sofríelas con el tomate\nPrepara la bechamel: derrite la mantequilla, tuesta la harina y añade la leche sin dejar de remover\nSazona con sal y nuez moscada\nMonta capas de placa, verduras y bechamel\nCubre con queso rallado\nHornea a 190 °C durante 35 minutos",
    category: "comida",
    difficulty: "difícil",
    cookingTime: 75,
  },
  {
    author: "VacaLola",
    title: "Pancakes de plátano y avena",
    description: "Vegetarianos, sin harina ni azúcar añadido.",
    image: img("pancakes"),
    ingredients:
      "2 plátanos maduros\n100 g de copos de avena\n2 huevos\n100 ml de leche\n1 cucharadita de levadura\nCanela\nFruta fresca para servir",
    steps:
      "Tritura todos los ingredientes hasta obtener una masa homogénea\nCalienta una sartén antiadherente con un poco de aceite\nVierte pequeñas porciones y cocina 2 minutos por cada lado\nSirve con fruta fresca",
    category: "desayuno",
    difficulty: "fácil",
    cookingTime: 20,
  },
  {
    author: "VacaLola",
    title: "Tarta de queso al horno",
    description: "Vegetariana, cremosa y sin base.",
    image: img("tarta-queso"),
    ingredients:
      "600 g de queso crema\n200 ml de nata para montar\n4 huevos\n150 g de azúcar\n1 cucharada de harina",
    steps:
      "Precalienta el horno a 200 °C\nBate todos los ingredientes hasta que no queden grumos\nVierte en un molde forrado con papel de horno\nHornea unos 40 minutos hasta que esté dorada\nDeja enfriar y refrigera antes de servir",
    category: "postre",
    difficulty: "media",
    cookingTime: 70,
  },
  {
    author: "Saladman",
    title: "Ensalada templada de lentejas y verduras asadas",
    description: "Vegana, templada y con mucha proteína vegetal.",
    image: img("lentejas-asadas"),
    ingredients:
      "1 bote de lentejas cocidas\n1 calabacín\n1 pimiento rojo\n1 cebolla roja\n2 cucharadas de vinagre de Jerez\nAceite de oliva\n1 cucharadita de comino\nPerejil fresco\nSal",
    steps:
      "Precalienta el horno a 200 °C\nCorta el calabacín, el pimiento y la cebolla en trozos\nHornéalos 25 minutos con aceite, comino y sal\nEscurre y aclara las lentejas\nMezcla las lentejas con las verduras aún templadas\nAliña con vinagre, aceite y perejil picado",
    category: "comida",
    difficulty: "media",
    cookingTime: 40,
  },
  {
    author: "Veganmix",
    title: "Tofu revuelto con cúrcuma",
    description: "Vegano, sin huevo y listo en 15 minutos.",
    image: img("tofu-revuelto"),
    ingredients:
      "250 g de tofu firme\n1/2 cucharadita de cúrcuma\n1 cucharada de levadura nutricional\n1 tomate\nUn puñado de espinacas\nAceite de oliva\nSal y pimienta negra\nPan tostado para servir",
    steps:
      "Escurre el tofu y desmenúzalo con un tenedor\nSofríe el tomate troceado en una sartén con aceite\nAñade el tofu y la cúrcuma y remueve 5 minutos\nIncorpora las espinacas, la levadura nutricional, sal y pimienta\nSirve sobre pan tostado",
    category: "desayuno",
    difficulty: "fácil",
    cookingTime: 15,
  },
  {
    author: "VacaLola",
    title: "Shakshuka",
    description: "Vegetariana: huevos escalfados en salsa de tomate especiada.",
    image: img("shakshuka"),
    ingredients:
      "4 huevos\n1 cebolla\n1 pimiento rojo\n2 dientes de ajo\n400 g de tomate triturado\n1 cucharadita de comino\n1 cucharadita de pimentón dulce\nPerejil fresco\nAceite de oliva y sal\nPan para mojar",
    steps:
      "Sofríe la cebolla, el pimiento y el ajo picados\nAñade el comino y el pimentón y remueve un minuto\nIncorpora el tomate y cuece 10 minutos\nHaz cuatro huecos en la salsa y casca un huevo en cada uno\nTapa y cocina 5 minutos hasta que la clara cuaje\nEspolvorea con perejil y sirve con pan",
    category: "cena",
    difficulty: "media",
    cookingTime: 30,
  },
  {
    author: "Saladman",
    title: "Ensalada de espinacas y fresas",
    description: "Vegetariana, dulce y salada, lista en 15 minutos.",
    image: img("espinacas-fresas"),
    ingredients:
      "150 g de espinacas baby\n200 g de fresas\nUn puñado de nueces\n100 g de queso de cabra\n2 cucharadas de vinagre balsámico\n3 cucharadas de aceite de oliva\nSal y pimienta",
    steps:
      "Lava las espinacas y colócalas en una fuente\nCorta las fresas en láminas\nTuesta las nueces en una sartén sin aceite 2 minutos\nAñade las fresas, las nueces y el queso desmenuzado\nAliña con aceite, vinagre balsámico, sal y pimienta",
    category: "cena",
    difficulty: "fácil",
    cookingTime: 15,
  },
  {
    author: "Veganmix",
    title: "Hamburguesas de lentejas y avena",
    description: "Veganas, jugosas y al horno.",
    image: img("hamburguesas-lentejas"),
    ingredients:
      "1 bote de lentejas cocidas\n60 g de copos de avena\n1 zanahoria rallada\n1/2 cebolla\n1 diente de ajo\n1 cucharadita de pimentón\n1 cucharadita de comino\nPerejil\nSal\nPanes de hamburguesa\nLechuga y tomate para servir",
    steps:
      "Escurre las lentejas y aplástalas a medias con un tenedor\nSofríe la cebolla y el ajo picados\nMezcla todo con la avena, la zanahoria y las especias\nDeja reposar la masa 10 minutos\nForma cuatro hamburguesas\nHornea a 200 °C durante 20 minutos, dándoles la vuelta a la mitad\nMonta en los panes con lechuga y tomate",
    category: "comida",
    difficulty: "media",
    cookingTime: 45,
  },
  {
    author: "VacaLola",
    title: "Croquetas de espinacas y queso",
    description: "Vegetarianas, cremosas por dentro y crujientes por fuera.",
    image: img("croquetas-espinacas"),
    ingredients:
      "300 g de espinacas\n80 g de mantequilla\n80 g de harina\n600 ml de leche\n100 g de queso rallado\nNuez moscada y sal\n2 huevos\nPan rallado\nAceite de oliva para freír",
    steps:
      "Saltea las espinacas, escúrrelas bien y pícalas\nDerrite la mantequilla y tuesta la harina un minuto\nAñade la leche poco a poco sin dejar de remover\nIncorpora las espinacas, el queso, la nuez moscada y la sal\nCuece 5 minutos y deja enfriar la masa unas horas en la nevera\nForma las croquetas y pásalas por huevo batido y pan rallado\nFríelas en aceite caliente hasta que estén doradas",
    category: "snack",
    difficulty: "difícil",
    cookingTime: 70,
  },
  {
    author: "Saladman",
    title: "Aliño cremoso de tahini y limón",
    description: "Vegano, para ensaladas y bowls.",
    image: img("aliño-tahini"),
    ingredients:
      "3 cucharadas de tahini\nZumo de 1 limón\n1 diente de ajo\n3 cucharadas de agua\n1 cucharada de aceite de oliva\nSal",
    steps:
      "Pica el ajo muy fino\nMezcla el tahini con el limón, el aceite y el ajo\nAñade el agua poco a poco removiendo hasta que quede cremoso\nRectifica de sal y sirve sobre ensaladas o verduras asadas",
    category: "otros",
    difficulty: "fácil",
    cookingTime: 5,
  },
  {
    author: "Veganmix",
    title: "Ramen vegano de miso y setas",
    description: "Vegano, caldo reconfortante con tofu y verduras.",
    image: img("ramen-vegano"),
    ingredients:
      "2 nidos de fideos de ramen sin huevo\n1 l de caldo de verduras\n2 cucharadas de pasta de miso\n1 cucharada de salsa de soja\n200 g de tofu firme\n150 g de setas shiitake\n1 zanahoria\n2 puñados de espinacas\n2 cebolletas\n1 trozo de jengibre\n2 dientes de ajo\nAceite de sésamo\nSemillas de sésamo",
    steps:
      "Corta el tofu en dados y dóralo en una sartén con un poco de aceite\nSaltea las setas laminadas y resérvalas\nSofríe el ajo y el jengibre picados en una olla con aceite de sésamo\nAñade el caldo y la zanahoria en tiras y cuece 10 minutos\nDisuelve el miso con un poco de caldo caliente e incorpóralo con la soja sin que hierva\nCuece los fideos aparte según indique el paquete\nReparte los fideos en cuencos, vierte el caldo y añade el tofu, las setas y las espinacas\nTermina con cebolleta y semillas de sésamo",
    category: "cena",
    difficulty: "difícil",
    cookingTime: 60,
  },
  {
    author: "VacaLola",
    title: "Panna cotta de vainilla con fresas",
    description: "Vegetariana, cuajada con agar-agar en lugar de gelatina.",
    image: img("panna-cotta"),
    ingredients:
      "400 ml de nata para montar\n200 ml de leche\n60 g de azúcar\n1 vaina de vainilla o 1 cucharadita de extracto\n2 g de agar-agar en polvo\n200 g de fresas\n2 cucharadas de azúcar para el coulis\nZumo de 1/2 limón",
    steps:
      "Calienta la nata con la leche, el azúcar y la vainilla sin que llegue a hervir\nDisuelve el agar-agar con un poco de la mezcla fría e intégralo\nHierve 2 minutos sin dejar de remover\nReparte en vasos o moldes y deja enfriar\nRefrigera al menos 3 horas\nTritura las fresas con el azúcar y el limón para hacer el coulis\nSirve la panna cotta con el coulis por encima",
    category: "postre",
    difficulty: "media",
    cookingTime: 30,
  },
];

const seed = async () => {
  await connectDB();

  const emails = users.map((user) => user.email);
  const emailsToClean = [...emails, ...legacyEmails];

  // Limpia solo los datos de ejemplo (nunca tu cuenta real)
  const oldUsers = await User.find({ email: { $in: emailsToClean } });
  const oldUserIds = oldUsers.map((user) => user._id);

  await Recipe.deleteMany({ author: { $in: oldUserIds } });
  // Quita los likes que esos usuarios dejaron en otras recetas
  // Quita los likes que esos usuarios dejaron en otras recetas
  // Quita los likes que esos usuarios dejaron en otras recetas
  for (const userId of oldUserIds) {
    await Recipe.updateMany({ likes: userId }, { $pull: { likes: userId } });
  }
  await User.deleteMany({ email: { $in: emailsToClean } });

  const password = await bcrypt.hash("123456", 10);
  const createdUsers = await User.insertMany(
    users.map((user) => ({ ...user, password })),
  );

  const idByName = Object.fromEntries(
    createdUsers.map((user) => [user.name, user._id]),
  );

  const DAY = 24 * 60 * 60 * 1000;

  await Recipe.insertMany(
    recipes.map(({ author, ...recipe }, index) => {
      const authorId = idByName[author];

      // Likes de ejemplo: los otros usuarios, repartidos de forma variada
      const likes = createdUsers
        .filter(
          (user, userIndex) =>
            !user._id.equals(authorId) && (index + userIndex) % 3 !== 0,
        )
        .map((user) => user._id);

      return {
        ...recipe,
        author: authorId,
        likes,
        createdAt: new Date(Date.now() - (recipes.length - index) * DAY),
      };
    }),
  );

  console.log(
    `Seed completado: ${createdUsers.length} usuarios y ${recipes.length} recetas`,
  );
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
