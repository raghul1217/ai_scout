import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updatePlans() {
  console.log("Updating plans in database to 2 plans: Free and ₹499 Pro...");

  // 1. Upsert Free Community Plan
  const freePlan = await prisma.plan.upsert({
    where: { slug: "free" },
    update: {
      name: "Free Community",
      description: "Essential AI tool directory and weekly curated updates.",
      price: 0,
      currency: "INR",
      billingType: "ONE_TIME",
      durationDays: null,
      isActive: true,
      sortOrder: 1,
      features: [
        "Curated directory of 150+ verified AI tools",
        "Weekly AI newsletter & curated headlines",
        "Public community access on WhatsApp",
        "Basic search and filtering",
      ],
    },
    create: {
      name: "Free Community",
      slug: "free",
      description: "Essential AI tool directory and weekly curated updates.",
      price: 0,
      currency: "INR",
      billingType: "ONE_TIME",
      durationDays: null,
      isActive: true,
      sortOrder: 1,
      features: [
        "Curated directory of 150+ verified AI tools",
        "Weekly AI newsletter & curated headlines",
        "Public community access on WhatsApp",
        "Basic search and filtering",
      ],
    },
  });

  // 2. Upsert Savzen Pro (₹499)
  const proPlan = await prisma.plan.upsert({
    where: { slug: "pro" },
    update: {
      name: "Savzen Pro",
      description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
      price: 49900, // ₹499.00
      currency: "INR",
      billingType: "LIFETIME",
      durationDays: null,
      isActive: true,
      sortOrder: 2,
      features: [
        "Everything in Free Community",
        "Access to all Premium Blueprints & Guides",
        "Production-tested agent prompt libraries",
        "Monthly commercial AI benchmark reports",
        "Priority VIP community lounge",
        "Lifetime access with zero recurring fees",
      ],
    },
    create: {
      name: "Savzen Pro",
      slug: "pro",
      description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
      price: 49900, // ₹499.00
      currency: "INR",
      billingType: "LIFETIME",
      durationDays: null,
      isActive: true,
      sortOrder: 2,
      features: [
        "Everything in Free Community",
        "Access to all Premium Blueprints & Guides",
        "Production-tested agent prompt libraries",
        "Monthly commercial AI benchmark reports",
        "Priority VIP community lounge",
        "Lifetime access with zero recurring fees",
      ],
    },
  });

  // Deactivate old pro-monthly and pro-lifetime if they exist
  await prisma.plan.updateMany({
    where: {
      slug: { in: ["pro-monthly", "pro-lifetime"] },
    },
    data: {
      isActive: false,
    },
  });

  console.log("✓ Successfully configured 2 plans:");
  console.log(`- Free: ${freePlan.name} (₹${freePlan.price / 100}) [${freePlan.id}]`);
  console.log(`- Pro: ${proPlan.name} (₹${proPlan.price / 100}) [${proPlan.id}]`);
}

updatePlans()
  .catch((e) => {
    console.error("Error updating plans:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

