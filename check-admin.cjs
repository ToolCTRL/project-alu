const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:/root/alu-crm/data/production.db"
    }
  }
});

async function checkAdmin() {
  const user = await prisma.user.findUnique({
    where: { email: "raffael@tool-ctrl.de" },
    include: {
      admin: true,
      roles: {
        include: {
          role: true
        }
      }
    }
  });
  
  console.log("User:", user.email);
  console.log("Admin:", user.admin);
  console.log("Roles:", JSON.stringify(user.roles, null, 2));
  
  await prisma.$disconnect();
}

checkAdmin().catch(console.error);
