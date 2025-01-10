import { Command } from "commander";

// ╭─────────────────────────────────────────────────────╮
// │ Elle calcule la remise en fonction du montant total │
// │ 3% pour 1000€                                       │
// │ 5% pour 5000€                                       │
// │ 7% pour 7000€                                       │
// │ 10% pour 10000€                                     │
// │ 15% pour 50000€                                     │
// │ Pas de remise si inférieurs à 1000€                 │
// ╰─────────────────────────────────────────────────────╯
function calculateDiscount(total: number): number {
  switch (true) {
    case total >= 50000:
      return total * 0.15;
    case total >= 10000:
      return total * 0.1;
    case total >= 7000:
      return total * 0.07;
    case total >= 5000:
      return total * 0.05;
    case total >= 1000:
      return total * 0.03;
    default:
      return total;
  }
}

// ╭─────────────────────────────────────────────────────────────────╮
// │ On peut obtenir le taux de taxe dépendant de l'état de la vente │
// │ Utah 6.85%                                                      │
// │ Nevada 8%                                                       │
// │ Texas 6.25%                                                     │
// │ Alabama 4%                                                      │
// │ Californie : 8.25%                                              │
// ╰─────────────────────────────────────────────────────────────────╯
function getTaxRate(state: string): number {
  switch (state.toUpperCase()) {
    case "UT":
      return 0.0685;
    case "NV":
      return 0.08;
    case "TX":
      return 0.0625;
    case "AL":
      return 0.04;
    case "CA":
      return 0.0825;
    default:
      console.warn(`(${state}) n'existe pas, aucun taxe appliqué.`);
      return 0;
  }
}

// ╭──────────────────────────────────────────────────────────────────╮
// │ On peut calculer le prix total et appliquer la remise et la taxe │
// ╰──────────────────────────────────────────────────────────────────╯
function calculateTotal(
  quantity: number,
  price: number,
  state: string,
): number {
  const subtotal = quantity * price;
  const discount = calculateDiscount(subtotal);
  const discountedTotal = subtotal - (subtotal === discount ? 0 : discount);
  const taxRate = getTaxRate(state);
  const tax = discountedTotal * taxRate;
  return discountedTotal + tax;
}

// ╭────────────────────────────────────────────────────────────────────────╮
// │ Ce sont relatif à la bibliothèque commander pour prendre les arguments │
// ╰────────────────────────────────────────────────────────────────────────╯
const program = new Command();
program
  .name("Calculateur de vente au détail")
  .description("Calcule le prix total avec remise et taxe dépendant de l'état.")
  .version("1.0.0")
  .requiredOption(
    "-q, --quantity <number>",
    "Quantité d'articles vendus",
    parseFloat,
  )
  .requiredOption(
    "-p, --price <number>",
    "Prix de l'article en TTC",
    parseFloat,
  )
  .requiredOption("-s, --state <string>", "Etat dans lequel la vente a lieu")
  .action((options) => {
    const { quantity, price, state } = options;
    const total = calculateTotal(quantity, price, state);

    // console.log(`Quantité: ${quantity}`);
    // console.log(`Prix par article: ${price.toFixed(2)} €`);
    // console.log(`Etat: ${state.toUpperCase()}`);
    // console.log(`Prix total: ${total.toFixed(2)} €`);

    console.log(
      `Prix total: ${total.toFixed(2)} € pour ${quantity} articles à ${price.toFixed(2)} € l'unité dans l'état ${state.toUpperCase()}
      avec une remise de ${calculateDiscount(quantity * price).toFixed(2)} € et une taxe de ${getTaxRate(state) * 100}%`,
    );
  });

program.parse(process.argv);
