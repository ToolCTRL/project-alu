export async function getGumroadProduct(id: string) {
  try {
    const data = await fetch("https://api.gumroad.com/v2/products/" + id, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${process.env.GUMROAD_TOKEN}`,
        "Content-Type": "application/json",
      }),
    });
    const { product } = await data.json();
    // I had to add this manually since GumRoad API doesn't provide the total sales by paid customers
    return {
      totalDownloads: Number(product.sales_count),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("GUMROAD ERROR: ", e);
  }
}

export async function getGumroadProductSales(id: string, url?: string) {
  try {
    let path = url ?? "/v2/sales?product_id=" + id;
    const data = await fetch("https://api.gumroad.com" + path, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${process.env.GUMROAD_TOKEN}`,
        "Content-Type": "application/json",
      }),
    });
    return await data.json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("GUMROAD ERROR: ", e);
  }
}
