import { db } from "../app/utils/db.server";
import { Colors } from "../app/application/enums/shared/Colors";

async function main() {
  // Expected ticket status options
  const options = [
    { value: "auftrag-erhalten", name: "Auftrag erhalten", color: Colors.GREEN },
    { value: "zaehler-und-foerderantraege", name: "Zähler- und Förderanträge", color: Colors.BLUE },
    { value: "hydraulischer-abgleich", name: "Hydraulischer Abgleich", color: Colors.TEAL },
    { value: "terminiert", name: "Terminiert", color: Colors.YELLOW },
    { value: "grossprojekt", name: "Großprojekt", color: Colors.PURPLE },
    { value: "ausfuehrung", name: "Ausführung", color: Colors.ORANGE },
    { value: "rechnung-erstellen", name: "Rechnung erstellen", color: Colors.RED },
    { value: "foerderungsunterlagen-auszahlung", name: "Förderungsunterlagen Auszahlung", color: Colors.LIME },
    { value: "wartungsvertrag-fernueberwachung", name: "Wartungsvertrag & Fernüberwachung", color: Colors.CYAN },
    { value: "projektabschluss-bewertung", name: "Projektabschluss & Bewertung", color: Colors.GRAY },
    { value: "archiv", name: "Archiv", color: Colors.BEIGE },
  ];

  const ticketEntity = await db.entity.findFirst({ where: { name: "ticket" } });
  if (!ticketEntity) {
    throw new Error("Entity 'ticket' not found");
  }

  const statusProperty = await db.property.findFirst({
    where: { entityId: ticketEntity.id, name: "status" },
  });

  if (!statusProperty) {
    throw new Error("Property 'status' on ticket not found");
  }

  // Remove existing options
  await db.propertyOption.deleteMany({ where: { propertyId: statusProperty.id } });
  await db.propertyAttribute.deleteMany({ where: { propertyId: statusProperty.id, name: "DefaultValue" } });

  // Recreate options with explicit order
  const orderedOptions = options.map((opt, idx) => ({ ...opt, order: idx + 1 }));

  await db.property.update({
    where: { id: statusProperty.id },
    data: {
      options: {
        create: orderedOptions,
      },
      attributes: {
        create: {
          name: "DefaultValue",
          value: "auftrag-erhalten",
        },
      },
    },
  });

  // Log the result
  const updated = await db.property.findUnique({ where: { id: statusProperty.id } });
  console.log("Updated ticket status options:", updated?.options);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
