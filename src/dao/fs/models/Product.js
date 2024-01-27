export class Product {
  constructor({
    id,
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail,
  }) {
    this.id = notNull(id);
    this.title = notNull(title);
    this.description = notNull(description);
    this.code = notNull(code);
    this.price = notNull(Number(price));
    this.status = notNull(Boolean(status));
    this.stock = notNull(Number(stock));
    this.category = notNull(category);
    this.thumbnail = notNull([thumbnail]);
  }
}

export function notNull(valor) {
  if (valor === null || valor === undefined) {
    throw new Error("Hay valores invalidos");
  }
  return valor;
}
