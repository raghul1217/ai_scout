import { prisma } from "../lib/db/prisma";

async function main() {
  const total = await prisma.aITool.count();
  const free = await prisma.aITool.count({ where: { pricingType: "FREE" } });
  const freemium = await prisma.aITool.count({ where: { pricingType: "FREEMIUM" } });
  const paid = await prisma.aITool.count({ where: { pricingType: "PAID" } });

  console.log("TOOL STATISTICS IN DATABASE:");
  console.log(`- Total Tools: ${total}`);
  console.log(`- 100% Free:   ${free}`);
  console.log(`- Freemium:    ${freemium}`);
  console.log(`- Paid:        ${paid}`);

  const sampleFree = await prisma.aITool.findMany({
    where: { pricingType: "FREE" },
    select: { name: true, slug: true, websiteUrl: true },
    take: 5,
  });
  console.log("\nSample Free Tools in DB:", sampleFree);
  const categories = await prisma.category.findMany();
  console.log("\nCATEGORIES IN DATABASE:", categories.map((c) => ({ slug: c.slug, name: c.name })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
