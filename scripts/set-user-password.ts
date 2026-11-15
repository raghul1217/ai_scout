import { hashPassword } from "better-auth/crypto";
import { prisma } from "../lib/db/prisma";

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log("Usage: npx tsx scripts/set-user-password.ts <email> <newPassword>");
    process.exit(1);
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
    include: { accounts: true },
  });

  if (!user) {
    console.error(`User with email "${email}" not found.`);
    process.exit(1);
  }

  const hashedPassword = await hashPassword(newPassword);

  const credentialAccount = user.accounts.find((a) => a.providerId === "credential");

  if (credentialAccount) {
    await prisma.account.update({
      where: { id: credentialAccount.id },
      data: { password: hashedPassword },
    });
  } else {
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: "credential",
        accountId: user.id,
        password: hashedPassword,
      },
    });
  }

  console.log(`✓ Password successfully updated in Supabase for "${cleanEmail}"!`);
}

main().finally(() => prisma.$disconnect());
