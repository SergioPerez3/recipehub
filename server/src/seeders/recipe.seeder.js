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
    ingredients:
      "2 calabacines\n1 cebolla\n5 huevos\nAceite de oliva\nSal",
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
];

const seed = async () => {
  await connectDB();

  const emails = users.map((user) => user.email);
  const password = await bcrypt.hash("123456", 10);
  const createdUsers = await User.insertMany(
    users.map((user) => ({ ...user, password })),
  );

  const idByName = Object.fromEntries(
    createdUsers.map((user) => [user.name, user._id]),
  );

  await Recipe.insertMany(
    recipes.map(({ author, ...recipe }) => ({
      ...recipe,
      author: idByName[author],
    })),
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