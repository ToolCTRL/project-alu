const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:/root/alu-crm/data/production.db"
    }
  }
});

async function checkTenant() {
  const user = await prisma.user.findUnique({
    where: { email: "raffael@tool-ctrl.de" },
    select: {
      id: true,
      email: true,
      defaultTenantId: true
    }
  });
  
  const tenants = await prisma.tenant.findMany();
  
  console.log("User defaultTenantId:", user.defaultTenantId);
  console.log("\nAlle Tenants:");
  tenants.forEach(t => {
    console.log(`  - ID: ${t.id}, Name: ${t.name}, Slug: ${t.slug}`);
  });
  
  await prisma.$disconnect();
}

checkTenant().catch(console.error);
