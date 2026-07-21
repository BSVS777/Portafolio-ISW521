import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "password123";

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const alice = await prisma.user.upsert({
    where: { phone: "+10000000001" },
    update: {},
    create: {
      displayName: "Alice Johnson",
      phone: "+10000000001",
      passwordHash,
      status: "Hey there! I'm using WhatsApp Clone.",
    },
  });

  const bob = await prisma.user.upsert({
    where: { phone: "+10000000002" },
    update: {},
    create: {
      displayName: "Bob Smith",
      phone: "+10000000002",
      passwordHash,
      status: "Available",
    },
  });

  const carol = await prisma.user.upsert({
    where: { phone: "+10000000003" },
    update: {},
    create: {
      displayName: "Carol Diaz",
      phone: "+10000000003",
      passwordHash,
      status: "Busy",
    },
  });

  const dm = await prisma.chat.create({
    data: {
      isGroup: false,
      participants: {
        create: [{ userId: alice.id }, { userId: bob.id }],
      },
    },
  });

  const group = await prisma.chat.create({
    data: {
      isGroup: true,
      title: "Weekend Trip",
      participants: {
        create: [
          { userId: alice.id, role: "admin" },
          { userId: bob.id },
          { userId: carol.id },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      chatId: dm.id,
      senderId: alice.id,
      type: "text",
      body: "Hey Bob! How's it going?",
      deliveryStatus: "read",
    },
  });
  await prisma.message.create({
    data: {
      chatId: dm.id,
      senderId: bob.id,
      type: "text",
      body: "All good, just finished the sprint review.",
      deliveryStatus: "read",
    },
  });
  await prisma.message.create({
    data: {
      chatId: dm.id,
      senderId: alice.id,
      type: "text",
      body: "Nice, let's catch up later today.",
      deliveryStatus: "delivered",
    },
  });

  await prisma.message.create({
    data: {
      chatId: group.id,
      senderId: alice.id,
      type: "text",
      body: "Who's in for the weekend trip?",
      deliveryStatus: "read",
    },
  });
  await prisma.message.create({
    data: {
      chatId: group.id,
      senderId: bob.id,
      type: "text",
      body: "Count me in!",
      deliveryStatus: "read",
    },
  });
  await prisma.message.create({
    data: {
      chatId: group.id,
      senderId: carol.id,
      type: "text",
      body: "Same here, can't wait.",
      deliveryStatus: "delivered",
    },
  });

  console.log("Seed complete.");
  console.log("Demo users (phone / password):");
  console.log(`  +10000000001 / ${DEMO_PASSWORD} (Alice Johnson)`);
  console.log(`  +10000000002 / ${DEMO_PASSWORD} (Bob Smith)`);
  console.log(`  +10000000003 / ${DEMO_PASSWORD} (Carol Diaz)`);
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
